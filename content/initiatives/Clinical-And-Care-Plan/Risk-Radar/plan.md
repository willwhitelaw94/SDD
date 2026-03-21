---
title: "Implementation Plan: Risk Radar"
---

# Implementation Plan: Risk Radar

**Spec**: [spec.md](./spec.md) | **Design**: [design.md](./design.md)
**Created**: 2026-03-10
**Status**: Draft
**Branch**: `feature/risk-radar`

---

## Summary

Replace the existing PrimeVue DataTable risk list with a split-view card layout (Superhuman Sam pattern), add a step-based risk form, implement Maryanne's residual-risk framework (16 clinical risk areas → 5 domains → consequence assessment → mitigation → residual risk → traffic-light), and render a radar chart visualisation on a new Risk Radar sub-tab.

**Core architecture decisions:**
- New `ClinicalRiskArea` lookup model with FK on `RiskCategory` — clean 1:1 mapping for the 16 radar-eligible categories
- Versioned `RiskAssessment` records (one per reassessment, history retained)
- `DignityOfRiskDeclaration` as a cross-cutting governance entity linked to multiple risk areas
- Domain residual risk calculated on read (eager-loaded, no caching in Phase 1)
- Event sourcing extended for assessment and mitigation mutations
- Chart.js radar chart (already installed, used directly — no wrapper)
- Domain scores calculated backend-only (single source of truth, no frontend duplication)
- Risk Radar sub-tab data loaded via Inertia v2 deferred props (lazy on sub-tab click)
- "Assess All" wizard saves each risk area individually on "Save & Next" (no data loss on early close)
- `comprehensive_risks_data` JSON blob unchanged — step form is a UI restructure, not a data shape change

---

## Technical Context

**Language/Version**: PHP 8.3, TypeScript (Vue 3)
**Framework**: Laravel 12, Inertia v2, Tailwind v3
**Primary Dependencies**: Chart.js 4.x (installed, used directly), vuedraggable (new — DnD reorder), Spatie Event Sourcing, Lorisleiva Actions
**Storage**: MySQL — existing `risks`, `risk_categories`, `riskables` tables + new tables
**Testing**: Pest 3 (feature + unit), Dusk 8 (browser)
**Performance Goals**: Risk tab render < 500ms for a package with all 16 risk areas assessed
**Constraints**: Must work with feature flag OFF (existing risk cards unchanged), event sourcing for all mutations

---

## Data Model

### New Tables

#### `clinical_risk_areas`
| Column | Type | Notes |
|--------|------|-------|
| `id` | bigint PK | Auto-increment |
| `name` | string(100) | e.g., "Falls", "Chronic Disease" |
| `slug` | string(100) | Unique, for code references |
| `questionnaire` | json | Array of `{response: string, consequence_level: int}` from Maryanne's table |
| `order` | int | Display order within radar |
| `created_at` | timestamp | |
| `updated_at` | timestamp | |

#### `clinical_risk_area_domain` (pivot)
| Column | Type | Notes |
|--------|------|-------|
| `id` | bigint PK | |
| `clinical_risk_area_id` | FK → clinical_risk_areas | |
| `domain` | string(50) | Enum: functional_ability, clinical_health, mental_health, nutritional_sensory, safety |

#### `risk_categories` (existing — add column)
| Column | Type | Notes |
|--------|------|-------|
| `clinical_risk_area_id` | FK → clinical_risk_areas, nullable | 16 of 28 categories get this FK |

#### `risk_assessments` (versioned)
| Column | Type | Notes |
|--------|------|-------|
| `id` | bigint PK | |
| `uuid` | uuid | Unique |
| `package_id` | FK → packages | |
| `clinical_risk_area_id` | FK → clinical_risk_areas | |
| `risk_id` | FK → risks, nullable | Link to actual risk record |
| `questionnaire_response` | text | The selected response text |
| `consequence_level` | tinyint(1) | 0-4 |
| `rationale` | text, nullable | Clinical notes |
| `assessed_by` | FK → users | |
| `created_at` | timestamp | Serves as "assessed at" |

#### `domain_mitigation_assessments`
| Column | Type | Notes |
|--------|------|-------|
| `id` | bigint PK | |
| `uuid` | uuid | Unique |
| `package_id` | FK → packages | |
| `domain` | string(50) | Enum: same as pivot |
| `mitigation_level` | tinyint(1) | 0=None, 1=Partial, 2=Strong |
| `decision_prompts` | json | Responses to structured prompts |
| `override_rationale` | text, nullable | If clinician overrides |
| `assessed_by` | FK → users | |
| `created_at` | timestamp | |

#### `dignity_of_risk_declarations`
| Column | Type | Notes |
|--------|------|-------|
| `id` | bigint PK | |
| `uuid` | uuid | Unique |
| `package_id` | FK → packages | |
| `decision_maker` | string(255) | Who made the decision |
| `risks_accepted` | text | Description of accepted risks |
| `explanation_given` | text | What was explained |
| `client_response` | text | Client's response |
| `witness` | string(255), nullable | |
| `declared_at` | date | |
| `revoked_at` | date, nullable | Null = active |
| `created_by` | FK → users | |
| `created_at` | timestamp | |
| `updated_at` | timestamp | |

#### `dignity_of_risk_risk_area` (pivot)
| Column | Type | Notes |
|--------|------|-------|
| `dignity_of_risk_declaration_id` | FK | |
| `clinical_risk_area_id` | FK | |

### Entity Relationships

```
ClinicalRiskArea 1──M ClinicalRiskAreaDomain (pivot to domains)
ClinicalRiskArea 1──1 RiskCategory (via FK on risk_categories)
ClinicalRiskArea 1──M RiskAssessment (versioned, per package)
ClinicalRiskArea M──M DignityOfRiskDeclaration (via pivot)

Package 1──M Risk (existing, via riskables)
Package 1──M RiskAssessment
Package 1──M DomainMitigationAssessment
Package 1──M DignityOfRiskDeclaration

Risk M──1 RiskCategory (existing)
RiskCategory 0..1──1 ClinicalRiskArea (nullable FK)
```

### Enums

```php
// domain/Risk/Enums/ClinicalDomain.php
enum ClinicalDomain: string
{
    case FUNCTIONAL_ABILITY = 'functional_ability';
    case CLINICAL_HEALTH = 'clinical_health';
    case MENTAL_HEALTH = 'mental_health';
    case NUTRITIONAL_SENSORY = 'nutritional_sensory';
    case SAFETY = 'safety';
}

// domain/Risk/Enums/ConsequenceLevel.php
enum ConsequenceLevel: int
{
    case NEGLIGIBLE = 0;
    case MINOR = 1;
    case MODERATE = 2;
    case MAJOR = 3;
    case EXTREME = 4;
}

// domain/Risk/Enums/MitigationLevel.php
enum MitigationLevel: int
{
    case NONE = 0;
    case PARTIAL = 1;
    case STRONG = 2;
}

// domain/Risk/Enums/TrafficLightStatus.php
enum TrafficLightStatus: string
{
    case GREEN = 'green';   // residual 0-1
    case AMBER = 'amber';  // residual 2
    case RED = 'red';       // residual 3-4
}
```

---

## API Contracts

### Existing Routes (unchanged)
| Method | Route | Controller | Purpose |
|--------|-------|-----------|---------|
| GET | `/packages/{package}/risks/create` | PackageRiskController@create | Modal: create risk |
| POST | `/packages/{package}/risks` | PackageRiskController@store | Store risk |
| GET | `/packages/{package}/risks/{risk}` | PackageRiskController@show | Modal: view risk |
| GET | `/packages/{package}/risks/{risk}/edit` | PackageRiskController@edit | Modal: edit risk |
| PUT | `/packages/{package}/risks/{risk}` | PackageRiskController@update | Update risk |
| DELETE | `/packages/{package}/risks/{risk}` | PackageRiskController@destroy | Soft delete |

### New Routes

#### Risk Assessment
| Method | Route | Action | Purpose |
|--------|-------|--------|---------|
| GET | `/packages/{package}/risk-assessments/{clinicalRiskArea}` | RiskAssessmentController@show | Modal: assessment questionnaire for one risk area |
| POST | `/packages/{package}/risk-assessments/{clinicalRiskArea}` | RiskAssessmentController@store | Save consequence assessment (creates versioned record) |
| GET | `/packages/{package}/risk-assessments` | RiskAssessmentController@index | Modal: "Assess All" wizard (16 risk areas) |

#### Domain Mitigation
| Method | Route | Action | Purpose |
|--------|-------|--------|---------|
| GET | `/packages/{package}/domain-mitigations/{domain}` | DomainMitigationController@show | Modal: mitigation assessment for one domain |
| POST | `/packages/{package}/domain-mitigations/{domain}` | DomainMitigationController@store | Save mitigation rating |

#### Dignity of Risk
| Method | Route | Action | Purpose |
|--------|-------|--------|---------|
| GET | `/packages/{package}/dignity-of-risk/create` | DignityOfRiskController@create | Modal: new DOR declaration |
| POST | `/packages/{package}/dignity-of-risk` | DignityOfRiskController@store | Save DOR |
| GET | `/packages/{package}/dignity-of-risk/{dor}` | DignityOfRiskController@show | Modal: view DOR |
| PUT | `/packages/{package}/dignity-of-risk/{dor}` | DignityOfRiskController@update | Update/revoke DOR |

#### Quick Actions
| Method | Route | Action | Purpose |
|--------|-------|--------|---------|
| POST | `/packages/{package}/risks/add-and-assess/{clinicalRiskArea}` | PackageRiskController@addAndAssess | Create minimal risk + redirect to assessment |

### Controller Data Assembly

The existing `PackageRisks.vue` tab receives its data from the package show controller. The risk tab data will be extended:

```php
// Eager-loaded in a single query set (FR-021)
'risks' => RiskData::collect($package->risks()->with([
    'riskCategory.clinicalRiskArea.domains',
    'riskCategory.clinicalRiskArea.latestAssessment' => fn ($q) => $q->where('package_id', $package->id),
])->get()),

// New data for Risk Radar sub-tab
'clinicalRiskAreas' => ClinicalRiskAreaData::collect(
    ClinicalRiskArea::with(['domains', 'latestAssessments' => fn ($q) => $q->where('package_id', $package->id)])
        ->get()
),
'domainMitigations' => DomainMitigationData::collect(
    DomainMitigationAssessment::where('package_id', $package->id)
        ->latest()
        ->get()
        ->unique('domain')
),
'dignityOfRiskDeclarations' => DignityOfRiskData::collect(
    DignityOfRiskDeclaration::where('package_id', $package->id)
        ->whereNull('revoked_at')
        ->with('clinicalRiskAreas')
        ->get()
),
```

---

## Frontend Component Architecture

### Shared Types (`resources/js/types/Risk/`)

```typescript
// resources/js/types/Risk/riskRadar.ts
type ClinicalDomain = 'functional_ability' | 'clinical_health' | 'mental_health' | 'nutritional_sensory' | 'safety'

type ConsequenceLevel = 0 | 1 | 2 | 3 | 4

type MitigationLevel = 0 | 1 | 2

type TrafficLightStatus = 'green' | 'amber' | 'red'

type ClinicalRiskAreaData = {
  id: number
  name: string
  slug: string
  domains: ClinicalDomain[]
  questionnaire: QuestionnaireOption[]
  latestAssessment: RiskAssessmentData | null
  riskCategoryId: number
  hasRiskRecord: boolean
  riskId: number | null
}

type QuestionnaireOption = {
  response: string
  consequenceLevel: ConsequenceLevel
}

type RiskAssessmentData = {
  id: number
  uuid: string
  questionnaireResponse: string
  consequenceLevel: ConsequenceLevel
  rationale: string | null
  assessedBy: string
  createdAt: string
}

type DomainMitigationData = {
  domain: ClinicalDomain
  mitigationLevel: MitigationLevel
  decisionPrompts: Record<string, string>
  overrideRationale: string | null
  assessedBy: string
  createdAt: string
}

type DomainScore = {
  domain: ClinicalDomain
  label: string
  maxConsequence: ConsequenceLevel
  mitigationLevel: MitigationLevel
  residualRisk: number
  status: TrafficLightStatus
  assessedCount: number
  totalCount: number
  riskAreas: ClinicalRiskAreaData[]
}

type DignityOfRiskData = {
  id: number
  uuid: string
  decisionMaker: string
  risksAccepted: string
  explanationGiven: string
  clientResponse: string
  witness: string | null
  declaredAt: string
  revokedAt: string | null
  clinicalRiskAreaIds: number[]
}
```

### Component Decomposition

#### 1. PackageRisks (Tab Root — Modified)

**File**: `resources/js/Pages/Packages/tabs/PackageRisks.vue`
- **Responsibility**: Tab container with sub-tab routing (All Risks / Risk Radar)
- **Props**: `defineProps<Props>()` — `package`, `tabs`, `tabData` (extended with radar data), `riskcategories`
- **Common components**: `CommonTabs`
- **Sub-components**: Renders `AllRisks` or `RiskRadar` based on active tab

#### 2. All Risks Sub-Tab

**Directory**: `resources/js/Pages/Packages/Risks/AllRisks/`

- **`AllRisks.vue`** — Parent: split-view container (60/40), owns risk selection state
  - Props: `risks: RiskData[]`, `package: PackageData`, `clinicalRiskAreas: ClinicalRiskAreaData[]`
  - Common components: `CommonButton`, `CommonConfirmDialog`
  - Sub-components:
    - `RiskList.vue` — Left panel: scrollable list of risk rows with summary stats bar
    - `RiskDetail.vue` — Right panel: selected risk properties, details, accordion, actions
    - `RiskRow.vue` — Single risk row: severity dot, name, consequence badge, domain label
    - `EmptyState.vue` — No risks placeholder with "Add a risk" prompt

- **`RiskDetail.vue`** — Right panel detail
  - Sub-components:
    - `PropertiesGrid.vue` — 2-column grid: domain, consequence, mitigation, residual, need, care plan
    - `DetailsSection.vue` — Details + Action Plan with "Show more" truncation
    - `CheckInAccordion.vue` — Collapsible check-in questions (feature-flagged)
    - `ActionBar.vue` — Assess, Edit, Delete buttons with keyboard hints

#### 3. Risk Radar Sub-Tab

**Directory**: `resources/js/Pages/Packages/Risks/RiskRadar/`

- **`RiskRadar.vue`** — Parent: radar chart + domain list + drill-down
  - Props: `clinicalRiskAreas: ClinicalRiskAreaData[]`, `domainMitigations: DomainMitigationData[]`, `dignityOfRiskDeclarations: DignityOfRiskData[]`, `package: PackageData`
  - Receives pre-computed `DomainScore[]` from backend (no frontend calculation)
  - Common components: `CommonTabs` (chart toggle), `CommonBadge`
  - Sub-components:
    - `RadarChart.vue` — Chart.js radar with 5 axes, traffic-light colours, ghost outline
    - `BarChart.vue` — Horizontal bar chart alternative
    - `DomainGroup.vue` — Collapsible domain section with risk area cards
    - `RiskAreaCard.vue` — Individual risk area: name, consequence badge, "Add & Assess" or "Reassess"
    - `TrafficLightBadge.vue` — Reusable Green/Amber/Red badge (candidate for Common)
    - `UnassessedBanner.vue` — "X risk areas unassessed" persistent banner

#### 4. Risk Form (Step-Based)

**Directory**: `resources/js/Pages/Packages/Risks/Form/`

- **`RiskFormModal.vue`** — Parent: Inertia modal wrapper, owns `useForm()` as single source of truth
  - Props: `package: PackageData`, `options: PackageRiskOptions`, `risk?: RiskData`
  - Common components: `CommonStepNavigation`, `CommonButton`
  - Sub-components:
    - `StepBasics.vue` — Step 1: Category, Need, Care Plan, Details, Action Plan
    - `StepDetails.vue` — Step 2: Category-specific fields (conditional, uses existing section components)
    - `StepCheckInQuestions.vue` — Step 3: Question management (edit only, feature-flagged)

#### 5. Assessment Modal

**Directory**: `resources/js/Pages/Packages/Risks/Assessment/`

- **`AssessmentModal.vue`** — Parent: focused dark overlay, one risk area at a time
  - Props: `clinicalRiskArea: ClinicalRiskAreaData`, `package: PackageData`
  - Common components: `CommonButton`
  - Sub-components:
    - `ConsequenceCard.vue` — Clickable severity card with keyboard shortcut [1-5]
    - `ProgressDots.vue` — Dot-style progress for "Assess All" wizard (filled/current/empty)

#### 6. Dignity of Risk Modal

**Directory**: `resources/js/Pages/Packages/Risks/DignityOfRisk/`

- **`DignityOfRiskModal.vue`** — Parent: Inertia modal for DOR CRUD
  - Props: `package: PackageData`, `clinicalRiskAreas: ClinicalRiskAreaData[]`, `declaration?: DignityOfRiskData`
  - Common components: `CommonInput`, `CommonSelectMenu`, `CommonDatePicker`, `CommonButton`

#### 7. Composables

```typescript
// resources/js/composables/useTrafficLight.ts
// Maps a numeric score (0-4) to TrafficLightStatus
// Reusable for both consequence badges and residual risk
// Domain scores are computed backend-only (CalculateDomainScores action)
```

#### 8. Common Component Eligibility

| New Component | Common? | Reasoning |
|---------------|---------|-----------|
| `TrafficLightBadge.vue` | **Yes → `CommonTrafficLightBadge`** | General-purpose status indicator reusable across domains (incidents, budgets) |
| `RadarChart.vue` | No | Risk-specific Chart.js configuration |
| `ConsequenceCard.vue` | No | Clinical assessment-specific interaction |
| `ProgressDots.vue` | Maybe (Phase 2) | Could generalise for other wizards, but keep bespoke for now |

---

## Implementation Phases

### Phase 1: Foundation (Data Model + Seeders)

**Backend:**
1. Create migrations: `clinical_risk_areas`, `clinical_risk_area_domain`, add `clinical_risk_area_id` to `risk_categories`, `risk_assessments`, `domain_mitigation_assessments`, `dignity_of_risk_declarations`, `dignity_of_risk_risk_area`
2. Create models: `ClinicalRiskArea`, `RiskAssessment`, `DomainMitigationAssessment`, `DignityOfRiskDeclaration`
3. Create enums: `ClinicalDomain`, `ConsequenceLevel`, `MitigationLevel`, `TrafficLightStatus`
4. Create seeder: `ClinicalRiskAreaSeeder` — seed 16 risk areas with questionnaire data from Maryanne's consequence table, domain mappings, and FK links to existing `risk_categories`
5. Create Data classes: `ClinicalRiskAreaData`, `RiskAssessmentData`, `DomainMitigationData`, `DignityOfRiskData`, `DomainScoreData`
6. Create feature flag: `RiskRadarFeature` (Laravel Pennant, per-organisation)

**Frontend:**
7. Create shared types in `resources/js/types/Risk/riskRadar.ts`

**Tests:**
- Model relationship tests (ClinicalRiskArea ↔ domains, ↔ RiskCategory, ↔ RiskAssessment)
- Seeder test (16 areas seeded, correct domain mappings, correct category FKs)
- Enum casting tests

### Phase 2: Risk Cards + Split View (All Risks Tab)

**Backend:**
8. Extend `PackageRiskController` tab data to eager-load clinical risk area data with assessments
9. Update `RiskData` to include `clinicalRiskArea`, `latestConsequenceLevel`, `trafficLightStatus`

**Frontend:**
10. Create `AllRisks/` component directory with split-view layout
11. Create `RiskList.vue`, `RiskRow.vue`, `RiskDetail.vue`, `PropertiesGrid.vue`, `DetailsSection.vue`, `ActionBar.vue`
12. Create `CommonTrafficLightBadge.vue` component
13. Create `CheckInAccordion.vue` (feature-flagged to CarePartnerCheckInsFeature)
14. Replace PrimeVue DataTable in `PackageRisks.vue` with `AllRisks` component
15. Wire existing create/edit/show/delete modals to new card actions

**Tests:**
- Feature test: Risk tab renders cards instead of table
- Feature test: Split-view shows selected risk detail
- Feature test: Consequence badge displays when assessment exists

### Phase 3: Step-Based Risk Form

**Frontend:**
16. Create `Form/RiskFormModal.vue` with `useForm()` at parent level
17. Create `StepBasics.vue`, `StepDetails.vue` (reuse existing section components), `StepCheckInQuestions.vue`
18. Wire `CommonStepNavigation` with per-step validation
19. Handle conditional Step 2 skip (no category fields / "Not identified")
20. Handle Step 3 visibility (edit-only + CarePartnerCheckInsFeature flag)

**Backend:**
21. No backend changes — existing `PackageRiskController@store/update` and `PackageRiskData` validation unchanged

**Tests:**
- Feature test: Step navigation preserves data
- Feature test: Step 2 skipped for categories without fields
- Feature test: Step 3 hidden on create, visible on edit

### Phase 4: Consequence Assessment

**Backend:**
22. Create `RiskAssessmentController` with show/store/index actions
23. Create `AssessRiskArea` action (Lorisleiva AsAction) — creates versioned `RiskAssessment` record
24. Extend event sourcing: `RiskAreaAssessed` event → `RiskAssessmentProjector`
25. Create `AddAndAssessRisk` action — creates minimal risk record + assessment redirect
26. Create `GetAssessmentDataAction` — loads questionnaire, current assessment, DOR context

**Frontend:**
27. Create `Assessment/AssessmentModal.vue` with dark overlay
28. Create `ConsequenceCard.vue` with keyboard shortcuts [1-5]
29. Create `ProgressDots.vue` for "Assess All" wizard
30. Wire "Assess" button on risk cards and "Assess All" on Risk Radar

**Tests:**
- Feature test: Assessment creates versioned record
- Feature test: Reassessment creates new record, preserves history
- Feature test: "Add & Assess" creates minimal risk + opens assessment
- Feature test: Assessment respects `manage-risks` permission

### Phase 5: Mitigation Assessment + Residual Risk

**Backend:**
31. Create `DomainMitigationController` with show/store actions
32. Create `AssessDomainMitigation` action — stores mitigation with decision prompts
33. Create `CalculateDomainScores` action — computes all 5 domain scores on read
34. Extend event sourcing: `DomainMitigationAssessed` event

**Frontend:**
35. Create `DomainMitigationModal.vue` with structured decision prompts
36. Create `useTrafficLight` composable — score → status mapping (display helper only)
37. Wire mitigation UI into domain drill-down

**Tests:**
- Feature test: Mitigation creates record with decision prompts
- Feature test: Residual risk calculation: max(consequence) - mitigation
- Feature test: Override requires rationale
- Unit test: `CalculateDomainScores` action with various scenarios

### Phase 6: Risk Radar Visualisation

**Frontend:**
39. Create `RiskRadar/RiskRadar.vue` parent with chart + domain list (receives pre-computed `DomainScore[]` via deferred props)
40. Create `RadarChart.vue` — Chart.js (direct, canvas ref + onMounted) radar with 5 axes, traffic-light fill, ghost outline
42. Create `BarChart.vue` — horizontal bars with consequence/mitigation/residual
43. Create `DomainGroup.vue` — collapsible domain with risk area cards
44. Create `RiskAreaCard.vue` — consequence badge, "Add & Assess" / "Reassess"
45. Create `UnassessedBanner.vue` — persistent "X of 16 assessed"
46. Wire sub-tab toggle in `PackageRisks.vue`
47. Add traffic-light badge to package risk profile header

**Tests:**
- Feature test: Radar sub-tab renders when flag ON, hidden when OFF
- Feature test: Domain drill-down shows correct risk areas
- Feature test: Traffic-light badge in header reflects highest domain

### Phase 7: Dignity of Risk

**Backend:**
48. Create `DignityOfRiskController` with CRUD
49. Create `CreateDignityOfRisk`, `UpdateDignityOfRisk` actions
50. Extend event sourcing: `DignityOfRiskDeclared`, `DignityOfRiskRevoked` events
51. Include DOR data in mitigation assessment context

**Frontend:**
52. Create `DignityOfRisk/DignityOfRiskModal.vue`
53. Add DOR badge to risk cards via `RiskRow.vue` and `RiskAreaCard.vue`
54. Show DOR context in `DomainMitigationModal.vue`

**Tests:**
- Feature test: DOR creates record linked to multiple risk areas
- Feature test: DOR badge shows on linked risk cards
- Feature test: DOR visible during mitigation assessment
- Feature test: Revoked DOR removes badge

### Phase 8: Feature Flag + Polish

**Backend:**
55. Create `RiskRadarFeature` Pennant feature class
56. Add `check.feature.flag` middleware to new assessment/mitigation routes
57. Gate radar data loading behind feature flag in controller

**Frontend:**
58. Wrap Risk Radar sub-tab, assessment buttons, traffic-light badge in `HasFeatureFlag` component
59. Ensure existing risk cards work unchanged when flag is OFF
60. Add contextual help tooltips (FR-022 through FR-025)
61. Add keyboard navigation (arrow keys, Enter, Q for questions, A for assess)

**Tests:**
- Feature test: Flag OFF → existing cards, no radar, no scoring
- Feature test: Flag ON → full Risk Radar experience
- Feature test: Toggle flag preserves assessment data

---

## Event Sourcing Extension

### New Events

| Event | Aggregate | Data |
|-------|-----------|------|
| `RiskAreaAssessed` | `PackageRiskAggregate` | packageId, clinicalRiskAreaId, riskId, consequenceLevel, questionnaireResponse, rationale |
| `DomainMitigationAssessed` | `PackageRiskAggregate` | packageId, domain, mitigationLevel, decisionPrompts, overrideRationale |
| `DignityOfRiskDeclared` | `PackageRiskAggregate` | packageId, declarationData, clinicalRiskAreaIds |
| `DignityOfRiskRevoked` | `PackageRiskAggregate` | packageId, declarationId, revokedAt |

### Projector Updates

Extend `PackageRiskProjector` (or create `RiskAssessmentProjector`) to write to the new denormalized tables on each event.

---

## Testing Strategy

### By Phase

| Phase | Unit | Feature | Browser |
|-------|------|---------|---------|
| 1. Foundation | Model relationships, enum casts, seeder | Migration runs, seeder populates | — |
| 2. Cards | — | Tab renders cards, split-view works | Click risk → detail panel |
| 3. Form | — | Step navigation, validation, submit | Complete 3-step form |
| 4. Assessment | Score calculation | Assessment CRUD, versioning, permissions | Full assessment wizard |
| 5. Mitigation | Residual risk formula | Mitigation CRUD, override rationale | Mitigation flow |
| 6. Radar | useRiskRadarScores composable | Sub-tab render, domain drill-down | Chart interaction |
| 7. DOR | — | DOR CRUD, badge display | DOR creation flow |
| 8. Flag | — | Flag ON/OFF behaviour | Full E2E with flag toggle |

### Test Locations

```
tests/Unit/Risk/Models/ClinicalRiskAreaTest.php
tests/Unit/Risk/Enums/
tests/Unit/Risk/Composables/useRiskRadarScoresTest.php
tests/Feature/Risk/Http/Controllers/RiskAssessmentControllerTest.php
tests/Feature/Risk/Http/Controllers/DomainMitigationControllerTest.php
tests/Feature/Risk/Http/Controllers/DignityOfRiskControllerTest.php
tests/Feature/Risk/Actions/
tests/Browser/Risk/
```

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Chart.js radar doesn't render well with 5 axes | Low | Medium | Tested in mockup; 5 axes is ideal for radar charts |
| PackageRiskData (2000 lines) makes step form complex | Medium | Medium | Reuse existing section components; step form only changes UI structure, not data shape |
| Event sourcing cache stale after new projectors | Medium | High | Delete `bootstrap/cache/event-handlers.php` + rebuild after adding projectors |
| 70+ enum options in GetPackageRiskOptionsAction | Low | Low | Existing pattern, unchanged. Step form just splits the display |
| Feature flag interaction with CarePartnerCheckInsFeature | Medium | Medium | Two independent flags: Check-Ins controls accordion, Risk Radar controls scoring. Test matrix covers all 4 combinations |

---

## Dependencies

| Dependency | Type | Status |
|------------|------|--------|
| Chart.js 4.x | npm | Installed (used directly, no wrapper) |
| vuedraggable | npm | **New — install** (DnD question reorder) |
| Maryanne's Clinical Risk Consequence Table | Data | Available in `.tc-docs/content/initiatives/Clinical-And-Care-Plan/Risk-Radar/context/` |
| CarePartnerCheckInsFeature flag | Feature | Existing |
| `manage-risks` permission | Auth | Existing |
| Spatie Event Sourcing | Composer | Installed |
| Lorisleiva Actions | Composer | Installed |

---

## Gate 3: Architecture Check Results

### 1. Technical Feasibility ✅
| Check | Result |
|-------|--------|
| Architecture approach clear | ✅ Split-view cards, step form, radar chart — all proven patterns |
| Existing patterns leveraged | ✅ Extends existing Risk domain, event sourcing, Inertia modals |
| No impossible requirements | ✅ All FRs buildable with existing stack |
| Performance considered | ✅ Eager load on render, single query set |
| Security considered | ✅ Existing `manage-risks` permission, feature flag gating |

### 2. Data & Integration ✅
| Check | Result |
|-------|--------|
| Data model understood | ✅ 6 new tables, 2 enums, 1 FK addition |
| API contracts clear | ✅ 10 new endpoints defined |
| Dependencies identified | ✅ vuedraggable (new), all others existing |
| Integration points mapped | ✅ ClinicalRiskArea ↔ RiskCategory FK, event sourcing extension |
| DTO persistence explicit | ✅ All mutations via Lorisleiva Actions, no `->toArray()` |

### 3. Implementation Approach ✅
| Check | Result |
|-------|--------|
| File changes identified | ✅ 8 phases with specific file lists |
| Risk areas noted | ✅ Event sourcing cache, PackageRiskData complexity, flag interaction |
| Testing approach defined | ✅ Pest feature + unit per phase, browser tests for key flows |
| Rollback possible | ✅ Feature flag OFF hides all new UI, migrations reversible |

### 4. Resource & Scope ✅
| Check | Result |
|-------|--------|
| Scope matches spec | ✅ Phase 1 only, deferred items documented in spec |
| Effort reasonable | ✅ 8 phases, each independently deliverable |
| Skills available | ✅ Standard Laravel + Vue + Chart.js |

### 5. Laravel Best Practices ✅
| Check | Result |
|-------|--------|
| No hardcoded business logic in Vue | ✅ Score calculation in composable mirrors backend; thresholds from backend |
| Cross-platform reusability | ✅ All scoring via API, not Vue-only |
| Laravel Data for validation | ✅ New Data classes for all new entities |
| Model route binding | ✅ Controller methods use Model instances |
| No magic numbers | ✅ Enums for all levels and thresholds |
| Common components pure | ✅ `CommonTrafficLightBadge` has zero business logic |
| Lorisleiva Actions | ✅ All mutations via AsAction |
| Action authorization | ✅ Auth in `authorize()` method |
| Data classes anemic | ✅ No business logic in Data classes |
| Migrations schema-only | ✅ Seeder separate from migrations |
| Feature flags dual-gated | ✅ Backend middleware + frontend `HasFeatureFlag` |

### 6. Vue TypeScript Standards ✅
| Check | Result |
|-------|--------|
| All Vue components use TypeScript | ✅ All new components: `<script setup lang="ts">` |
| Props use named `type` | ✅ `type Props = { ... }` with `defineProps<Props>()` |
| Emits use named `type` | ✅ `type Emits = { ... }` with `defineEmits<Emits>()` |
| No `any` types | ✅ Shared types defined in `resources/js/types/Risk/riskRadar.ts` |
| Shared types identified | ✅ Single type file for all Risk Radar types |
| Common components reused | ✅ CommonTabs, CommonBadge, CommonButton, CommonStepNavigation, CommonCollapsible, CommonConfirmDialog, CommonInput, CommonSelectMenu, CommonDatePicker |
| New components assessed | ✅ TrafficLightBadge → Common; others kept bespoke |
| Multi-step wizard uses useForm | ✅ Single `useForm` at `RiskFormModal.vue` parent |
| Per-step validation | ✅ Each step validates before proceeding |

### 7. Component Decomposition ✅
| Check | Result |
|-------|--------|
| Decomposition planned | ✅ 7 component directories with sub-components listed |
| Single concern per sub-component | ✅ RiskList, RiskDetail, PropertiesGrid, etc. |
| Parent owns logic | ✅ Parents handle data/state, sub-components receive props |
| Directory structure defined | ✅ AllRisks/, RiskRadar/, Form/, Assessment/, DignityOfRisk/ |
| Naming is simple | ✅ Short names, directory provides namespace |
| No template section comments | ✅ Decomposed into sub-components instead |

### 8. Composition-Based Architecture ✅
| Check | Result |
|-------|--------|
| Composables for reusable logic | ✅ `useTrafficLight` (display helper); domain scores computed backend-only |
| Slots over props for layout | ✅ Card components use slots for content sections |
| No prop-driven conditionals | ✅ Feature flag controls component rendering, not props |

**Gate 3 Result: PASS** ✅

---

## Development Clarifications

### Session 2026-03-10

- Q: Should assessment/mitigation events use existing PackageRiskAggregate or a new aggregate? → A: Extend PackageRiskAggregate. All risk mutations in one aggregate — simpler, matches existing pattern.
- Q: Where should the authoritative residual risk calculation live? → A: Backend only (CalculateDomainScores action). Vue receives pre-computed DomainScore[]. Single source of truth, works for API consumers.
- Q: Do we need the vue-chartjs wrapper? → A: No. Use Chart.js directly with canvas ref + onMounted(). Only 1 chart component — wrapper adds unnecessary dependency. Existing codebase uses PrimeVue Chart (being deprecated).
- Q: Should 8 phases be parallelised or sequential? → A: Sequential. Simpler coordination, each phase builds on the last.
- Q: Where should seeder data (16 risk areas × 5 options) live? → A: PHP array in ClinicalRiskAreaSeeder.php. Standard Laravel pattern, version-controlled, easy to review.
- Q: Should the step form restructure comprehensive_risks_data? → A: No. Keep the JSON blob — step form is a UI change, not a data shape change. Zero migration risk.
- Q: What happens when user closes "Assess All" wizard mid-way? → A: Each risk area saves individually on "Save & Next". No data loss on early close.
- Q: Should Risk Radar sub-tab data be eager or deferred? → A: Deferred props (Inertia v2). Load radar data only when sub-tab is clicked. Keeps All Risks tab fast.
- Q: What library for drag-and-drop question reorder? → A: Install vuedraggable (SortableJS wrapper). Purpose-built for Vue list reordering (~6KB gzipped).

---

## Next Steps

1. Run `/speckit-tasks` to generate tasks.md
2. Run `/trilogy-linear-sync push docs` to sync to Linear
3. Run `/speckit-implement` to start development
