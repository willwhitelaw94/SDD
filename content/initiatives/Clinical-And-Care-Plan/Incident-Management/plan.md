---
title: "Implementation Plan: Incident Management Portal Migration"
---

# Implementation Plan: Incident Management Portal Migration

**Spec**: [spec.md](spec.md)
**Design**: [design.md](design.md)
**Created**: 2026-02-24
**Status**: Draft

---

## Summary

Migrate incident management from Zoho CRM to Portal. Phase 1 delivers a 5-step V2 intake wizard, detail/edit page, enhanced package and global incident lists, basic SIRS deadline tracking, a public intake form, and one-time CRM migration. Event sourcing provides immutable audit trail. Feature flag controls per-organisation rollout.

---

## Technical Context

### Technology Stack

- **Backend**: Laravel 12, PHP 8.3
- **Frontend**: Vue 3, Inertia.js v2, TypeScript, Tailwind CSS v3
- **Database**: MySQL
- **Event Sourcing**: Spatie Laravel Event Sourcing (custom stored event table: `incident_stored_events`)
- **DTOs**: Spatie Laravel Data v4
- **Actions**: Lorisleiva Laravel Actions
- **Feature Flags**: Laravel Pennant (PostHog backend) + PostHog JS SDK
- **Testing**: Pest v3 (unit + feature), Dusk v8 (browser)
- **Public Form**: Cloudflare Turnstile CAPTCHA, Laravel rate limiting

### Dependencies

- **Existing Domain**: `domain/Incident/` — Model, factory, enums, data classes, routes, seeder already exist
- **Package Model**: `domain/Package/Models/Package.php` — `$package->incidents()` relationship exists
- **Zoho CRM**: Export of historical incident data for one-time migration
- **PostHog**: Feature flag `incident-management` to be created
- **CommonStepNavigation**: Reka UI-based stepper component for wizard
- **Common Components**: Full suite available (CommonForm, CommonTable, CommonBadge, CommonTabs, etc.)

### Constraints

- **Performance**: ~930 incidents/month, ~2,781/quarter. Global list needs server-side pagination. Package tab typically <50 incidents — no pagination needed.
- **Security**: Public form requires rate limiting (5/IP/hour) + CAPTCHA. No auth on public form. Standard Portal ACL for internal users.
- **Accessibility**: WCAG AA. Harm tier colours must include text label + icon (not colour alone). Keyboard navigation for wizard step transitions. Focus management on step changes.
- **Audit**: Every creation, update, field change logged via event sourcing. Immutable intake snapshot. SIRS incidents cannot be deleted.

---

## Design Decisions

### Architecture: Event Sourcing for Incident Aggregate

**Decision**: Use event sourcing for the Incident domain.

**Rationale**: The spec requires immutable intake snapshots (FR-026), complete audit trail (FR-027), lifecycle state machine (FR-028), and SIRS compliance tracking. Event sourcing provides all of this natively — every state change is an immutable event, snapshots are free, and the audit trail is the source of truth.

**Pattern**: Follow existing codebase conventions from `domain/Bill/EventSourcing/`:
- `IncidentAggregateRoot` — enforces lifecycle rules, records events
- `IncidentStoredEvent` — custom stored event model (`incident_stored_events` table)
- `IncidentEventRepository` — custom event repository
- `IncidentProjector` — projects events into read models (incidents table)
- Events as granular business facts (not CRUD wrappers)

**Event Sourcing Acceptance Criteria** — "Can We Answer This Later?":

| Business Question | Events Needed |
|---|---|
| What is the average time from incident creation to resolution? | `IncidentCreated` → `IncidentStageAdvanced(resolved)` timestamps |
| How many incidents are classified at each harm tier, and has this trended over time? | `IncidentCreated` with `harmTier` in payload |
| How often is harm classification changed after intake, and by whom? | `IncidentHarmReclassified` with original + new tier + acting user |
| What percentage of SIRS P1 incidents meet the 24h reporting deadline? | `SirsPriorityAssigned` → `SirsReportedToAcqsc` timestamps |
| Which lifecycle stage causes the longest delays? | `IncidentStageAdvanced` timestamps with from/to stage |
| How many incidents have stages skipped, and which stages are most commonly skipped? | `IncidentStageSkipped` with stage + justification |
| How many public form submissions are accepted vs rejected? | `PublicIncidentSubmitted` → `PublicIncidentAccepted` or `PublicIncidentRejected` |
| Who edited what fields, and when? | All field-change events with acting user in metadata |

**Event List**:

```
# Incident lifecycle
IncidentCreatedEvent            — incident created (intake snapshot preserved)
IncidentUpdatedEvent            — specific fields changed (field-level granularity via payload)
IncidentStageAdvancedEvent      — lifecycle stage progressed (from → to)
IncidentStageSkippedEvent       — stage skipped with justification
IncidentResolvedEvent           — resolved with resolution text
IncidentSoftDeletedEvent        — soft deleted (non-SIRS only)

# Classification
IncidentHarmReclassifiedEvent   — harm tier changed post-intake (original preserved)
IncidentClassificationChangedEvent — Clinical/Non-clinical/SIRS changed

# SIRS
SirsPriorityAssignedEvent       — P1 or P2 assigned by clinical team
SirsDeadlineCalculatedEvent     — deadline auto-calculated
SirsReportedToAcqscEvent        — marked as reported with date

# Public form
PublicIncidentSubmittedEvent     — public form submission received
PublicIncidentAcceptedEvent      — accepted by reviewer, enters lifecycle
PublicIncidentRejectedEvent      — rejected with reason
```

### Data Model

#### Existing Tables (to be extended)

**`incidents`** — Add new columns via migration:

| Column | Type | Purpose |
|--------|------|---------|
| `uuid` | `uuid` | Aggregate root UUID (unique) |
| `harm_tier` | `string(30)` | 4-tier: severe, moderate, low, clinical_notification |
| `harm_tier_at_intake` | `string(30)` | Immutable snapshot of original harm tier (FR-026) |
| `lifecycle_stage` | `string(30)` | V2 lifecycle: reported, triaged, escalated, actioned, disclosed, resolved, pending_review |
| `lifecycle_stage_skip_justification` | `text` | Justification when a stage is skipped |
| `sirs_priority` | `string(5)` | P1 or P2 (null if not SIRS) |
| `sirs_deadline_at` | `datetime` | Auto-calculated deadline |
| `sirs_reported_at` | `datetime` | When reported to ACQSC |
| `source` | `string(20)` | portal, public_form, crm_migration |
| `reporter_relationship` | `string(50)` | Relationship to care recipient (FR-019) |
| `location` | `string(255)` | Where the incident occurred (FR-020) |
| `care_context` | `string(100)` | Care context at time of incident |
| `trend_happened_before` | `boolean` | Has this happened before? |
| `trend_details` | `text` | Dates, frequency details |
| `trend_part_of_trend` | `boolean` | Part of a larger trend? |
| `trend_trend_details` | `text` | Trend pattern details |
| `disclosure_status` | `string(20)` | yes, no, not_yet |
| `disclosure_date` | `date` | When client was informed |
| `disclosure_method` | `string(100)` | How they were informed |
| `disclosure_feedback` | `text` | Client feedback on disclosure |
| `reviewed_by` | `unsignedBigInteger` | FK to users (public form reviewer) |
| `reviewed_at` | `datetime` | When public submission was reviewed |
| `review_rejection_reason` | `text` | Reason if rejected |
| `created_by` | `unsignedBigInteger` | FK to users (internal creator) |

#### New Tables

**`incident_actions`** (replaces unstructured `solution` field):

| Column | Type | Purpose |
|--------|------|---------|
| `id` | `bigIncrements` | PK |
| `incident_id` | `unsignedBigInteger` | FK to incidents |
| `label` | `string(100)` | Action label (from checklist) |
| `timestamps` | | |

**`incident_escalations`**:

| Column | Type | Purpose |
|--------|------|---------|
| `id` | `bigIncrements` | PK |
| `incident_id` | `unsignedBigInteger` | FK to incidents |
| `contacted_name` | `string(255)` | Who was contacted |
| `contacted_role` | `string(100)` | Their role |
| `contacted_at` | `datetime` | When |
| `outcome` | `text` | Result of escalation |
| `timestamps` | | |

**`incident_follow_ups`**:

| Column | Type | Purpose |
|--------|------|---------|
| `id` | `bigIncrements` | PK |
| `incident_id` | `unsignedBigInteger` | FK to incidents |
| `gp_appointment_required` | `boolean` | GP needed |
| `care_plan_update_required` | `boolean` | Care plan update needed |
| `monitoring_requirements` | `text` | Monitoring plan |
| `timestamps` | | |

**`incident_stored_events`** (event sourcing):

Standard Spatie stored events table with `aggregate_uuid`, `aggregate_version`, `event_class`, `event_properties`, `meta_data`, `created_at`.

#### Enums (New/Updated)

```php
// New enum: HarmTierEnum
enum HarmTierEnum: string {
    case SEVERE = 'severe';
    case MODERATE = 'moderate';
    case LOW = 'low';
    case CLINICAL_NOTIFICATION = 'clinical_notification';
}

// New enum: LifecycleStageEnum
enum LifecycleStageEnum: string {
    case PENDING_REVIEW = 'pending_review';
    case REPORTED = 'reported';
    case TRIAGED = 'triaged';
    case ESCALATED = 'escalated';
    case ACTIONED = 'actioned';
    case DISCLOSED = 'disclosed';
    case RESOLVED = 'resolved';
    case REJECTED = 'rejected';
}

// New enum: SirsPriorityEnum
enum SirsPriorityEnum: string {
    case P1 = 'P1';
    case P2 = 'P2';
}

// New enum: IncidentSourceEnum
enum IncidentSourceEnum: string {
    case PORTAL = 'portal';
    case PUBLIC_FORM = 'public_form';
    case CRM_MIGRATION = 'crm_migration';
}

// New enum: DisclosureStatusEnum
enum DisclosureStatusEnum: string {
    case YES = 'yes';
    case NO = 'no';
    case NOT_YET = 'not_yet';
}
```

### API Contracts (Routes)

All routes within `domain/Incident/Routes/incidentRoutes.php`:

```php
// Internal routes (authenticated, feature-flagged)
Route::middleware(['web.authenticated', 'user.check_has_login', 'check.feature.flag:incident-management'])
    ->prefix('incidents')
    ->name('incidents.')
    ->group(function () {
        // Global list (enhanced)
        Route::get('/', ListIncidentsAction::class)->name('index');

        // Create wizard
        Route::get('/create/{package}', CreateIncidentAction::class)->name('create');
        Route::post('/{package}', StoreIncidentAction::class)->name('store');

        // Detail/Edit
        Route::get('/{incident}', ShowIncidentAction::class)->name('show');
        Route::put('/{incident}', UpdateIncidentAction::class)->name('update');

        // Lifecycle
        Route::post('/{incident}/advance-stage', AdvanceIncidentStageAction::class)->name('advance-stage');
        Route::post('/{incident}/skip-stage', SkipIncidentStageAction::class)->name('skip-stage');

        // SIRS
        Route::post('/{incident}/assign-sirs-priority', AssignSirsPriorityAction::class)->name('assign-sirs');
        Route::post('/{incident}/mark-sirs-reported', MarkSirsReportedAction::class)->name('mark-sirs-reported');

        // Soft delete
        Route::delete('/{incident}', DeleteIncidentAction::class)->name('destroy');

        // Pending review queue
        Route::get('/pending-review', ListPendingReviewAction::class)->name('pending-review');
        Route::post('/{incident}/accept', AcceptPublicIncidentAction::class)->name('accept');
        Route::post('/{incident}/reject', RejectPublicIncidentAction::class)->name('reject');
    });

// Package-scoped (within package routes)
Route::get('/packages/{package}/incidents', PackageIncidentsAction::class)->name('packages.incidents');

// Public form (no auth, rate limited)
Route::middleware(['web', 'throttle:5,60'])
    ->prefix('public/incidents')
    ->name('public.incidents.')
    ->group(function () {
        Route::get('/', ShowPublicIncidentFormAction::class)->name('create');
        Route::post('/', StorePublicIncidentAction::class)->name('store');
    });
```

### UI Components

#### New Vue Pages

##### Pages/Incidents/Create.vue (Wizard)
- Props: `defineProps<Props>()` with named type:
  - `package: PackageData`
  - `outcomes: IncidentOutcomeOption[]`
  - `actions: IncidentActionOption[]`
- Form state: Single `useForm` at parent level with all fields across all 5 steps
- Steps and fields:
  1. **Client & Incident**: clientName, clientDob, sahId (pre-filled), occurredDate, reportedDate, location, careContext
  2. **What Happened**: reporterName, reporterRole, reporterRelationship (pre-filled from auth), description
  3. **Classification**: harmTier, classification (Clinical/Non-clinical/SIRS)
  4. **Impact & Response**: outcomeIds[], actionIds[], trendHappenedBefore, trendDetails, trendPartOfTrend, trendTrendDetails
  5. **Escalation & Follow-up**: escalation (contactedName, contactedRole, contactedAt, outcome), followUp (gpRequired, carePlanRequired, monitoringRequirements), disclosure (status, date, method, feedback)
- Step validation: Zod schemas per step for client-side pre-flight
- Submission: Inertia handles final POST and `form.errors` mapping
- State management: `useForm` only (no Pinia)
- Common components reused: CommonStepNavigation, CommonForm, CommonFormField, CommonSelectMenu, CommonCheckboxGroup, CommonRadioGroup, CommonDatePicker, CommonPillSelect, CommonCollapsible, CommonAlert
- Key types: `IncidentFormData`, `HarmTier`, `LifecycleStage`, `StepValidationSchema`

##### Pages/Incidents/Show.vue (Detail/Edit)
- Props: `defineProps<Props>()` with named type:
  - `incident: IncidentData`
  - `canEdit: boolean`
  - `canAssignSirs: boolean`
  - `canAdvanceStage: boolean`
- Emits: `defineEmits<Emits>()` with named type — none (uses Inertia form submissions)
- Common components reused: CommonTabs, CommonDefinitionList, CommonBadge, CommonForm, CommonFormField, CommonAlert, CommonCard
- Key types: `IncidentData`, `IncidentOutcomeData`, `IncidentEscalationData`, `IncidentFollowUpData`

##### Pages/Incidents/Index.vue (Global List — Enhanced)
- Props: `defineProps<Props>()` with named type:
  - `incidents: PaginatedTable<IncidentData>`
  - `filters: IncidentFilterOptions`
- Common components reused: CommonTable (server-side pagination/sorting/filtering), CommonBadge, CommonSelectMenu, CommonDateRangePicker
- Key types: `IncidentFilterOptions`, `PaginatedTable<T>`

##### Pages/Packages/tabs/PackageIncidents.vue (Enhanced)
- Props: already defined, extend with:
  - `canCreateIncident: boolean`
- Common components reused: CommonCard, CommonBadge, CommonEmptyPlaceholder, CommonButton
- Key types: uses existing `IncidentData`

##### Pages/Public/IncidentForm.vue (Public Form)
- Props: `defineProps<Props>()` with named type:
  - `outcomes: IncidentOutcomeOption[]`
  - `actions: IncidentActionOption[]`
  - `turnstileSiteKey: string`
- Same wizard structure as Create.vue but without pre-fill and with CAPTCHA
- No layout wrapper (standalone page)
- Key types: `PublicIncidentFormData`

##### Pages/Incidents/PendingReview.vue
- Props: `defineProps<Props>()` with named type:
  - `incidents: PaginatedTable<IncidentData>`
- Common components reused: CommonTable, CommonBadge, CommonButton

#### New Components (Feature-Specific)

##### Components/Incident/HarmTierSelector.vue
- Props: `defineProps<Props>()` — `modelValue: HarmTier | null`, `disabled: boolean`
- Emits: `defineEmits<Emits>()` — `(e: 'update:modelValue', value: HarmTier): void`
- Visual card-style selector with colour + text label + icon + timeframe per tier
- Accessible: colour + text + icon differentiator for colour-blind users
- No business logic — tier definitions come from backend props

##### Components/Incident/LifecycleStepper.vue
- Props: `defineProps<Props>()` — `currentStage: LifecycleStage`, `stages: StageDefinition[]`, `canAdvance: boolean`, `canSkip: boolean`
- Emits: `defineEmits<Emits>()` — `(e: 'advance'): void`, `(e: 'skip', justification: string): void`
- Horizontal stage indicator with completed/current/upcoming states
- Skip capability with justification modal
- Extends CommonStepNavigation pattern

##### Components/Incident/SirsDeadlineBadge.vue
- Props: `defineProps<Props>()` — `priority: 'P1' | 'P2' | null`, `deadlineAt: string | null`, `reportedAt: string | null`
- Countdown timer with amber (approaching) / red (overdue) / green (reported) states
- No emits — display only

#### Shared Types

Location: `resources/js/types/incident.ts`

```ts
type HarmTier = 'severe' | 'moderate' | 'low' | 'clinical_notification'

type LifecycleStage = 'pending_review' | 'reported' | 'triaged' | 'escalated' | 'actioned' | 'disclosed' | 'resolved' | 'rejected'

type SirsPriority = 'P1' | 'P2'

type IncidentSource = 'portal' | 'public_form' | 'crm_migration'

type DisclosureStatus = 'yes' | 'no' | 'not_yet'

type IncidentData = {
  id: number
  uuid: string
  ref: string | null
  packageId: number
  package: PackageData | null
  occurredDate: string
  reportedBy: string | null
  reportedDate: string
  description: string | null
  solution: string | null
  harmTier: HarmTier | null
  harmTierAtIntake: HarmTier | null
  lifecycleStage: LifecycleStage
  classification: string | null
  sirsPriority: SirsPriority | null
  sirsDeadlineAt: string | null
  sirsReportedAt: string | null
  source: IncidentSource
  reporterRelationship: string | null
  location: string | null
  trendHappenedBefore: boolean
  trendPartOfTrend: boolean
  disclosureStatus: DisclosureStatus | null
  outcomes: IncidentOutcomeData[]
  actions: IncidentActionData[]
  escalation: IncidentEscalationData | null
  followUp: IncidentFollowUpData | null
  createdAt: string
  updatedAt: string
}
```

---

## Implementation Phases

### Phase 1: Foundation (Data Model + Event Sourcing)

1. **Database migrations**: Add new columns to `incidents`, create `incident_actions`, `incident_escalations`, `incident_follow_ups`, `incident_stored_events` tables
2. **New enums**: `HarmTierEnum`, `LifecycleStageEnum`, `SirsPriorityEnum`, `IncidentSourceEnum`, `DisclosureStatusEnum`
3. **Event sourcing setup**: `IncidentAggregateRoot`, `IncidentStoredEvent`, `IncidentEventRepository`, event classes, `IncidentProjector`
4. **Update Incident model**: Add new relationships, casts, fillables, semantic column documentation
5. **Data classes**: `CreateIncidentData`, `UpdateIncidentData`, `StorePublicIncidentData`, updated `IncidentData`
6. **Policy**: `IncidentPolicy` with granular permissions (create, update, delete, assign-sirs, advance-stage, accept-public, reject-public)
7. **Feature flag**: Create `incident-management` in PostHog, gate routes + sidebar
8. **Factory + seeder updates**: Extend `IncidentFactory` with new fields and states

### Phase 2: Core Pages (Create + Detail + Lists)

1. **Create Wizard** (`Pages/Incidents/Create.vue`): 5-step form with single `useForm`, Zod step validation, `CommonStepNavigation`, `HarmTierSelector` component
2. **Store Action** (`StoreIncidentAction`): Validates via `CreateIncidentData`, dispatches to `IncidentAggregateRoot`, returns redirect
3. **Detail/Edit** (`Pages/Incidents/Show.vue`): Full incident view with tabs, lifecycle stepper, SIRS panel, inline editing
4. **Update Action** (`UpdateIncidentAction`): Field-level updates via aggregate
5. **Enhanced Package Tab** (`PackageIncidents.vue`): Card-based list with harm tier badges, empty state with "Report Incident" CTA
6. **Enhanced Global List** (`Pages/Incidents/Index.vue`): Server-side filtering (harm tier, status, date range, SIRS, trend), pagination, count summary

### Phase 3: SIRS + Lifecycle + Public Form

1. **Lifecycle actions**: `AdvanceIncidentStageAction`, `SkipIncidentStageAction` with justification
2. **SIRS actions**: `AssignSirsPriorityAction`, `MarkSirsReportedAction` with deadline auto-calculation
3. **LifecycleStepper component**: Horizontal stage indicator with skip capability
4. **SirsDeadlineBadge component**: Countdown timer with urgency states
5. **Public form**: Standalone page with Turnstile CAPTCHA, rate limiting, `StorePublicIncidentAction`
6. **Pending review queue**: `ListPendingReviewAction`, `AcceptPublicIncidentAction`, `RejectPublicIncidentAction`

### Phase 4: CRM Migration + Polish

1. **Migration artisan command**: `MigrateZohoIncidentsCommand` — reads CRM export, maps CAT 1-5 → harm tier, creates incidents via aggregate, produces unmigrated report
2. **One-time operation**: Seed incident outcomes + actions checklists
3. **Zoho sync decommission**: Remove/disable existing sync job behind feature flag
4. **Soft delete protection**: Block deletion of SIRS incidents
5. **Analytics events**: PostHog tracking for all success criteria metrics

---

## Testing Strategy

### Test Coverage by Phase

**Phase 1: Foundation Tests**
- Unit: `IncidentAggregateRoot` state machine, lifecycle transitions, SIRS deadline calculation, harm tier mapping
- Feature: Migration creation, model relationships, enum values, factory states

**Phase 2: Core Page Tests**
- Feature: Create incident (all 5 steps), update incident, list incidents with filters, package tab display
- Feature: Authorization (Care Partner vs Clinical Team vs public)
- Browser: Full wizard flow, step validation, form submission

**Phase 3: SIRS + Lifecycle + Public Form Tests**
- Unit: SIRS deadline calculation (P1=24h, P2=30d), stage skip validation
- Feature: Stage advance/skip, SIRS assign/report, public form submission + review
- Feature: Rate limiting on public form, CAPTCHA validation
- Browser: Public form flow, lifecycle progression

**Phase 4: Migration Tests**
- Feature: CRM migration command with test dataset, CAT→harm tier mapping, unmigrated report
- Feature: SIRS incident delete protection, soft delete non-SIRS

### Test Locations

```
tests/Unit/Incident/Aggregates/IncidentAggregateRootTest.php
tests/Unit/Incident/Actions/
tests/Unit/Incident/Models/
tests/Feature/Incident/Http/Controllers/
tests/Feature/Incident/Commands/
tests/Browser/Incident/
```

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Event sourcing adds complexity | Medium | Medium | Follow established Bill/Need domain patterns exactly; custom stored events table for isolation |
| CRM data quality issues during migration | Medium | Medium | Validation report for unmigrated records; default to Clinical Notification for unmapped CAT values |
| Wizard form UX — too many fields | Low | High | 5-step wizard with heavy pre-fill; benchmark against 5-min creation target (SC-001) |
| SIRS deadline calculation edge cases | Low | High | Business hours vs calendar day rules clearly documented; comprehensive test coverage |
| Public form abuse | Low | Medium | Turnstile CAPTCHA + rate limiting (5/IP/hour) + Pending Review queue |
| Feature flag rollout coordination | Low | Low | Per-organisation toggle; existing pattern from lead-to-hca-conversion |

---

## Gate 3: Architecture Check

**Date**: 2026-02-24
**Status**: PASS

### Technical Feasibility
- [x] Architecture approach clear — event sourcing for audit trail, existing domain patterns
- [x] Existing patterns leveraged — Bill/Need EventSourcing, Lorisleiva Actions, Laravel Data, CommonComponents
- [x] All requirements buildable — no impossible requirements identified
- [x] Performance considered — pagination on global list, package tab <50 records, ~930/month volume
- [x] Security considered — public form rate limiting + CAPTCHA, standard Portal ACL, SIRS delete protection

### Data & Integration
- [x] Data model understood — extending existing `incidents` table + 3 new related tables + stored events
- [x] API contracts clear — routes defined with Lorisleiva Actions
- [x] Dependencies identified — Zoho CRM export, PostHog feature flag, Turnstile CAPTCHA
- [x] Integration points mapped — Package model relationship, existing incident domain, Portal role system
- [x] DTO persistence explicit — all projector writes use explicit field mapping, no `->toArray()` into ORM

### Implementation Approach
- [x] File changes identified — domain/Incident/ extension, new Vue pages, new migrations
- [x] Risk areas noted — CRM migration data quality, SIRS deadline edge cases
- [x] Testing approach defined — unit (aggregate), feature (actions/controllers), browser (wizard/lifecycle)
- [x] Rollback possible — feature flag disables all new functionality, migrations reversible

### Resource & Scope
- [x] Scope matches spec — Phase 1 only, Phase 2 deferred
- [x] Effort reasonable — Large (Ferrari) but phased into 4 implementation phases
- [x] Skills available — existing event sourcing expertise in codebase

### Laravel & Cross-Platform Best Practices
- [x] No hardcoded business logic in Vue — harm tier definitions, lifecycle rules, and SIRS deadlines all backend-powered
- [x] Cross-platform reusability — all business logic in Actions/Aggregate, Vue is presentation only
- [x] Laravel Data for validation — `CreateIncidentData`, `UpdateIncidentData`, `StorePublicIncidentData`
- [x] Model route binding — `Incident $incident`, `Package $package` in all controller methods
- [x] No magic numbers/IDs — all enums use SCREAMING_SNAKE_CASE, model constants for status values
- [x] Common components pure — HarmTierSelector receives tier definitions as props, no business logic
- [x] Use Lorisleiva Actions — all actions use `AsAction` trait
- [x] Action authorization in `authorize()` — permission checks in dedicated method, not in `handle()` or `asController()`
- [x] Data classes remain anemic — DTOs have properties + validation rules only, business logic in aggregate/actions
- [x] Migrations schema-only — outcome/action seed data via one-time operations, CRM migration via artisan command
- [x] Models have single responsibility — Incident core + separate models for Actions, Escalations, Follow-ups
- [x] Granular model policies — `IncidentPolicy` with scoped permissions per action, `Response::allow()`/`Response::deny()`
- [x] Response objects in auth — all policy methods return `Response`, not bare bool
- [x] Event sourcing events validated — "Can We Answer This Later?" acceptance criteria documented with 8 business questions
- [x] Semantic column documentation — new lifecycle/domain columns (`harm_tier`, `lifecycle_stage`, `sirs_priority`, etc.) will have `@property` PHPDoc
- [x] Feature flags dual-gated — `incident-management` flag on route middleware + sidebar `Feature::active()` + frontend `HasFeatureFlag`

### Vue TypeScript Standards
- [x] All new/modified Vue components planned with `<script setup lang="ts">`
- [x] Props use named `type` (`type Props = { ... }` with `defineProps<Props>()`)
- [x] Emits use named `type` (`type Emits = { ... }` with `defineEmits<Emits>()`)
- [x] No `any` types planned — all backend data shapes have TypeScript types in `resources/js/types/incident.ts`
- [x] Shared types identified — `resources/js/types/incident.ts` for all incident-related types
- [x] Common components audited — reusing CommonStepNavigation, CommonTable, CommonForm, CommonBadge, CommonTabs, CommonPillSelect, etc.
- [x] Multi-step wizard uses single parent-level `useForm` with all fields across all 5 steps (not Pinia, not per-step state)
- [x] No Pinia stores needed — all state managed via `useForm` or Inertia page props
- [x] Type declarations for untyped deps — N/A (no untyped JS imports planned)

**Ready to Implement**: YES

---

## Next Steps

1. Run `/speckit-tasks` to generate implementation task list from this plan
2. Review mockups at https://icm-mockups.vercel.app alongside plan
3. Schedule architecture discussion for event sourcing decisions if needed
