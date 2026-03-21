---
title: "Implementation Plan: Clinical Pathways / Cases"
---

# Implementation Plan: Clinical Pathways / Cases

**Spec**: [spec.md](spec.md) | **Idea Brief**: [idea-brief.md](idea-brief.md)
**Created**: 2026-02-13
**Status**: Draft

---

## Summary

Management plans at Trilogy Care are unstructured CRM documents with no lifecycle, no automation, and no Portal visibility. This plan introduces **Clinical Cases** as a first-class domain entity with a structured lifecycle (Active → Closed/Escalated), prescribed review schedules, incident-triggered creation, and bidirectional risk linking.

Key deliverables:
- New `ClinicalCase` domain with models, enums, actions, event sourcing, and controller
- Case lifecycle: Active → Closed, Active → Escalated, Escalated → Active (Mandatory upgrade)
- Review engine: prescribed intervals with overdue tracking
- Dedicated "Cases" tab on the Package view (feature-flagged per organisation)
- Incident → Case bridge: auto-create case when incident resolves via "Clinical Pathway"
- Bidirectional risk linking via existing `riskables` polymorphic pivot
- Population-level reporting view for clinical governance

---

## Technical Context

### Technology Stack

- **Backend**: Laravel 12, PHP 8.3
- **Frontend**: Vue 3, Inertia.js v2, TypeScript, Tailwind CSS v3
- **Database**: MySQL
- **Event Sourcing**: Spatie Laravel Event Sourcing (following Risk domain pattern)
- **Actions**: Lorisleiva/Actions (following existing domain patterns)
- **DTOs**: Spatie Laravel Data (validation + typed transfer)
- **Feature Flags**: PostHog + Laravel Pennant (constitution XIV)
- **Testing**: Pest v3

### Dependencies

- Existing `Incident` model and `IncidentResolutionEnum` (add `CLINICAL_PATHWAY` value)
- Existing `Risk` model and `riskables` polymorphic pivot (no migration needed for pivot itself)
- Existing `Package` model and tab system (`PackageService::getTabs()`, `getTab()`, `getTabData()`)
- Existing `CommonCard`, `CommonTable`, `CommonModal`, `CommonButton`, `CommonBadge`, `CommonEmptyPlaceholder`, `CommonFormField`, `CommonTextarea`, `CommonSelectMenu` components
- `PackageViewLayout` for consistent package page layout

### Constraints

- **Performance**: Cases per package typically 1-10 (no pagination/virtualisation needed for list). Reporting view may query across all packages — requires indexed queries
- **Security**: Clinical health information — requires `manage-clinical-case` permission, audit trail via event sourcing
- **Accessibility**: WCAG AA — keyboard navigation, ARIA labels, focus management in modal forms
- **Coexistence**: CRM management plans remain in CRM (read-only). Portal cases are new records, no import/sync

---

## Constitution Check

| Principle | Status | Evidence |
|-----------|--------|----------|
| I. Majestic Monolith | PASS | New `domain/ClinicalCase/` domain, no microservices |
| II. Domain-Driven Design | PASS | Dedicated domain with Models, Actions, Events, Controllers |
| III. Convention Over Configuration | PASS | Follows Incident/Risk domain patterns exactly |
| IV. Code Quality Standards | PASS | Typed DTOs, explicit return types, descriptive names |
| V. Testing is First-Class | PASS | Pest tests per phase — unit, feature, browser |
| VI. Event Sourcing for Audit-Critical | PASS | Case lifecycle is audit-critical; event sourcing for create/review/escalate/close |
| VII. Laravel Data for DTOs | PASS | `ClinicalCaseData`, `StoreClinicalCaseData`, `ClinicalCaseReviewData` |
| VIII. Action Classes | PASS | One action per use case: Create, Review, Escalate, Close, Delete |
| X. Inertia + Vue 3 | PASS | Inertia pages + modal pattern for create/edit/review |
| XI. Component Library | PASS | Reuses existing Common components |
| XIII. Progress Over Perfection | PASS | 4 phases, feature-flagged, gradual rollout |
| XIV. Feature Flags | PASS | PostHog + Pennant, `Feature::active('clinical-cases')` |
| XV. Permissions & Authorization | PASS | Policy-based: `ClinicalCasePolicy` with `manage-clinical-case` permission |
| XVI. Compliance & Audit | PASS | Event sourcing, soft deletes, full audit trail |
| XVII. Pint Formatting | PASS | `vendor/bin/pint --dirty` at each phase |

---

## Design Decisions

### Data Model

#### `clinical_cases` table

| Column | Type | Notes |
|--------|------|-------|
| id | bigint PK | Auto-increment |
| uuid | uuid unique | External reference |
| package_id | bigint FK | Belongs to package |
| case_type | string(20) | `mandatory`, `recommended`, `self_service` |
| status | string(20) | `active`, `closed`, `escalated` |
| clinical_concern | text | Description of the clinical concern |
| review_interval_days | smallint nullable | Null for self-service cases. 7/14/30/90/custom |
| next_review_at | date nullable | Null for self-service. Calculated from interval |
| trigger_source | string(30) nullable | `incident`, `assessment`, `clinical_judgement` |
| trigger_incident_id | bigint FK nullable | Links to originating incident (if triggered by incident) |
| assigned_to | bigint FK | User responsible for reviews. Defaults to creator |
| closure_reason | text nullable | Required when closing. Clinical justification for mandatory cases |
| closed_at | timestamp nullable | When the case was closed |
| escalated_at | timestamp nullable | When the case was escalated |
| created_by | bigint FK | User who created the case |
| updated_by | bigint FK nullable | Last user to modify |
| created_at, updated_at | timestamps | |
| deleted_at | timestamp nullable | Soft deletes |
| **Indexes** | | |
| (package_id, status) | composite | Case list filtered by status |
| (assigned_to, next_review_at) | composite | Overdue review queries |
| (status, next_review_at) | composite | Reporting: overdue across all packages |

#### `clinical_case_reviews` table

| Column | Type | Notes |
|--------|------|-------|
| id | bigint PK | Auto-increment |
| uuid | uuid unique | External reference |
| clinical_case_id | bigint FK | Belongs to case |
| outcome | string(20) | `continue`, `close`, `escalate` |
| clinical_notes | text | Review notes |
| previous_status | string(20) | Status before this review |
| previous_review_interval_days | smallint nullable | Interval before this review (for audit) |
| reviewed_by | bigint FK | User who completed the review |
| reviewed_at | timestamp | When the review was completed |
| created_at, updated_at | timestamps | |

#### Risk linking — existing `riskables` pivot (polymorphic, no migration needed)

- `riskable_type` = `Domain\ClinicalCase\Models\ClinicalCase`
- `riskable_id` = `clinical_cases.id`
- Uses existing `morphToMany` / `morphedByMany` pattern

#### Incident linking — `trigger_incident_id` FK on `clinical_cases`

- Direct FK for the primary triggering incident
- Additional incidents added to a case are tracked via `clinical_case_incidents` pivot table

#### `clinical_case_incidents` pivot table (for multiple incidents per case)

| Column | Type | Notes |
|--------|------|-------|
| id | bigint PK | |
| clinical_case_id | bigint FK | |
| incident_id | bigint FK | |
| created_at | timestamp | When the incident was linked |

### State Machine

```
                    ┌─────────────────────┐
                    │       ACTIVE        │
                    └──────┬────────┬─────┘
                           │        │
                    Close   │        │  Escalate
                    (review)│        │  (review)
                           │        │
                           ▼        ▼
                    ┌──────────┐  ┌──────────────┐
                    │  CLOSED  │  │  ESCALATED   │
                    └──────────┘  │  (Mandatory)  │
                                  └──────┬───────┘
                                         │
                                  Continue│
                                  (review)│
                                         │
                                         ▼
                                  ┌──────────────┐
                                  │   ACTIVE     │
                                  │  (Mandatory) │
                                  └──────────────┘
```

Valid transitions:
- Active → Closed (via review with outcome "close")
- Active → Escalated (via review with outcome "escalate"; type upgrades to Mandatory; interval resets to 7 days)
- Escalated → Active (via review with outcome "continue"; retains Mandatory type)
- Closed is terminal — no reopening

### API Contracts

**Controller**: `domain/ClinicalCase/Http/Controllers/ClinicalCaseController.php`

| Method | Route | Description | Returns |
|--------|-------|-------------|---------|
| `index` | GET `packages/{package}/clinical-cases` | Case list (tab data) | Inertia page |
| `create` | GET `packages/{package}/clinical-cases/create` | Create form (modal) | Inertia modal |
| `store` | POST `packages/{package}/clinical-cases` | Save new case | Redirect back |
| `show` | GET `packages/{package}/clinical-cases/{case}` | Case detail (modal) | Inertia modal |
| `edit` | GET `packages/{package}/clinical-cases/{case}/edit` | Edit form (modal) | Inertia modal |
| `update` | PATCH `packages/{package}/clinical-cases/{case}` | Update case | Redirect back |
| `destroy` | DELETE `packages/{package}/clinical-cases/{case}` | Soft delete | Redirect back |

**Review Controller**: `domain/ClinicalCase/Http/Controllers/ClinicalCaseReviewController.php`

| Method | Route | Description | Returns |
|--------|-------|-------------|---------|
| `create` | GET `packages/{package}/clinical-cases/{case}/reviews/create` | Review form (modal) | Inertia modal |
| `store` | POST `packages/{package}/clinical-cases/{case}/reviews` | Save review + apply outcome | Redirect back |

**Reporting Controller**: `domain/ClinicalCase/Http/Controllers/ClinicalCaseReportController.php`

| Method | Route | Description | Returns |
|--------|-------|-------------|---------|
| `index` | GET `clinical-cases/reports` | Population-level view | Inertia page |

### Props Passed to Frontend

```
ClinicalCaseOptions {
    caseTypeOptions: CaseTypeEnum::toData()
    reviewIntervalOptions: ReviewIntervalEnum::toData()
    triggerSourceOptions: TriggerSourceEnum::toData()
    packageIncidents: Incident[] (package's existing incidents)
    packageRisks: Risk[] (package's existing risks)
    assignableUsers: User[] (authorised coordinators/clinicians)
}
```

### UI Components

#### Existing Components (Reuse)

| Component | Usage |
|-----------|-------|
| `CommonModal` | Create/edit/review form container (right-slide) |
| `CommonSelectMenu` | Case type, review interval, trigger source, assignee dropdowns |
| `CommonFormField` | Form field wrapper with validation |
| `CommonButton` | All action buttons |
| `CommonBadge` | Case type, status labels |
| `CommonEmptyPlaceholder` | Empty state (no cases) |
| `CommonTextarea` | Clinical concern, review notes |
| `CommonCard` | Case list container |
| `CommonTable` | Reporting table |

#### New Components

| Component | Purpose |
|-----------|---------|
| `PackageClinicalCases.vue` | Tab content: case list with filter + "Create Case" button |
| `ClinicalCaseCard.vue` | Compact card in case list: type badge, concern summary, status, review date, overdue indicator |
| `ClinicalCaseDetail.vue` | Full case detail: concern, review history timeline, linked incidents, linked risks |
| `ClinicalCaseForm.vue` | Create/edit form: type, concern, interval, trigger, risks, assignee |
| `ClinicalCaseReviewForm.vue` | Review form: outcome (continue/close/escalate), notes, mandatory closure justification |
| `ClinicalCaseReportDashboard.vue` | Population reporting: aggregate counts, overdue drill-down, org filter |

---

## Implementation Phases

### Phase 1: Domain Foundation (Models, Enums, Data, Migrations, Factory)

**Migrations:**
- `create_clinical_cases_table` — all columns per data model above
- `create_clinical_case_reviews_table`
- `create_clinical_case_incidents_table` (pivot)

**Models:**
- `domain/ClinicalCase/Models/ClinicalCase.php` — traits: HasFactory, LogsActivity, SoftDeletes. Relationships: package (BelongsTo), reviews (HasMany), risks (morphToMany via riskables), incidents (BelongsToMany via pivot), triggerIncident (BelongsTo), assignee (BelongsTo User), creator (BelongsTo User). Casts via `casts()` method.
- `domain/ClinicalCase/Models/ClinicalCaseReview.php` — traits: HasFactory. Relationships: clinicalCase (BelongsTo), reviewer (BelongsTo User).

**Enums:**
- `domain/ClinicalCase/Enums/CaseTypeEnum.php` — MANDATORY, RECOMMENDED, SELF_SERVICE
- `domain/ClinicalCase/Enums/CaseStatusEnum.php` — ACTIVE, CLOSED, ESCALATED
- `domain/ClinicalCase/Enums/ReviewOutcomeEnum.php` — CONTINUE, CLOSE, ESCALATE
- `domain/ClinicalCase/Enums/ReviewIntervalEnum.php` — WEEKLY (7), FORTNIGHTLY (14), MONTHLY (30), QUARTERLY (90), CUSTOM
- `domain/ClinicalCase/Enums/TriggerSourceEnum.php` — INCIDENT, ASSESSMENT, CLINICAL_JUDGEMENT

**Update existing enum:**
- `domain/Incident/Enums/IncidentResolutionEnum.php` — add `CLINICAL_PATHWAY = 'Clinical pathway'`

**Data Classes:**
- `domain/ClinicalCase/Data/ClinicalCaseData.php` — read DTO (fromModel)
- `domain/ClinicalCase/Data/StoreClinicalCaseData.php` — create/update validation
- `domain/ClinicalCase/Data/ClinicalCaseReviewData.php` — read DTO
- `domain/ClinicalCase/Data/StoreClinicalCaseReviewData.php` — review validation (conditional: closure_reason required when outcome is CLOSE and type is MANDATORY)

**Factory:**
- `domain/ClinicalCase/Factories/ClinicalCaseFactory.php` — with states: `mandatory()`, `recommended()`, `selfService()`, `escalated()`, `closed()`, `overdueReview()`

**Service Provider:**
- `domain/ClinicalCase/Providers/ClinicalCaseServiceProvider.php` — register routes, event sourcing projector

**Phase 1 Tests:**
- Unit: Model relationships, casts, enum values, state machine transitions
- Feature: Migrations run, factory creates valid records

### Phase 2: Event Sourcing + Actions

**Event Sourcing** (following `domain/Risk/EventSourcing/` pattern):

| File | Template |
|------|----------|
| `domain/ClinicalCase/EventSourcing/Events/ClinicalCaseCreated.php` | `PackageRiskCreated.php` |
| `domain/ClinicalCase/EventSourcing/Events/ClinicalCaseReviewed.php` | `PackageRiskUpdated.php` |
| `domain/ClinicalCase/EventSourcing/Events/ClinicalCaseEscalated.php` | New |
| `domain/ClinicalCase/EventSourcing/Events/ClinicalCaseClosed.php` | New |
| `domain/ClinicalCase/EventSourcing/Events/ClinicalCaseDeleted.php` | `PackageRiskDeleted.php` |
| `domain/ClinicalCase/EventSourcing/Aggregates/ClinicalCaseAggregate.php` | `PackageRiskAggregate.php` |
| `domain/ClinicalCase/EventSourcing/Projectors/ClinicalCaseProjector.php` | `PackageRiskProjector.php` |

**Projector handles:**
- **On create**: insert `clinical_cases` row, sync risk associations via `riskables` pivot, insert `clinical_case_incidents` pivot if trigger is incident
- **On review (continue)**: insert `clinical_case_reviews` row, advance `next_review_at`
- **On review (close)**: insert review, update status to `closed`, set `closed_at`, set `closure_reason`
- **On review (escalate)**: insert review, update status to `escalated`, upgrade type to `mandatory`, reset interval to 7 days, set `escalated_at`
- **On delete**: soft delete case

**Actions** (following Lorisleiva/Actions pattern):

| Action | Purpose |
|--------|---------|
| `CreateClinicalCaseAction` | Validate data, generate UUID, call aggregate `createCase()`, persist |
| `UpdateClinicalCaseAction` | Update concern description and/or review interval |
| `ReviewClinicalCaseAction` | Validate outcome, apply state transition, call aggregate |
| `DeleteClinicalCaseAction` | Soft delete via aggregate |

**Relationship additions to existing models:**
- `Package.php`: add `clinicalCases(): HasMany → ClinicalCase`
- `Risk.php`: add `clinicalCases(): MorphToMany` (inverse `morphedByMany`)
- `Incident.php`: add `clinicalCases(): BelongsToMany` (via `clinical_case_incidents` pivot)

**Phase 2 Tests:**
- Feature: `CreateClinicalCaseTest` — create with valid data, validation errors, risk linking, incident linking, event stored
- Feature: `ReviewClinicalCaseTest` — continue (advances review date), close (sets status + reason), escalate (upgrades type + resets interval)
- Feature: `UpdateClinicalCaseTest` — edit concern and interval
- Feature: `DeleteClinicalCaseTest` — soft delete, associations retained for audit

### Phase 3: Controller + Vue (UI)

**Controller:** `domain/ClinicalCase/Http/Controllers/ClinicalCaseController.php`

Pattern: follows `PackageContactController.php` for modal pattern.
- `getOptions()` fetches case type options, review interval options, trigger source options, package incidents, package risks, assignable users

**Routes:** `domain/ClinicalCase/Routes/clinicalCaseRoutes.php`

```php
Route::middleware(['web.authenticated', 'user.check_has_login'])
    ->prefix('packages/{package}')
    ->name('clinical-cases.')
    ->group(function () {
        Route::resource('clinical-cases', ClinicalCaseController::class);
        Route::resource('clinical-cases.reviews', ClinicalCaseReviewController::class)
            ->only(['create', 'store']);
    });
```

**Package Tab Integration:**
- Update `PackageService::getTab()` — add `clinical-cases` mapping
- Update `PackageService::getTabs()` — add Cases tab with feature flag check: `Feature::active('clinical-cases')`
- Update `PackageService::getTabData()` — add `ClinicalCaseTable` for data

**Vue Pages/Components:**
- `resources/js/Pages/Packages/ClinicalCases/Create.vue` — modal wrapper
- `resources/js/Pages/Packages/ClinicalCases/Show.vue` — modal detail view
- `resources/js/Pages/Packages/ClinicalCases/Edit.vue` — modal wrapper
- `resources/js/Pages/Packages/ClinicalCases/Reviews/Create.vue` — review modal

**Vue Components:**
- `resources/js/Pages/Packages/tabs/PackageClinicalCases.vue` — tab content
- `resources/js/Components/Staff/ClinicalCases/ClinicalCaseCard.vue` — list card
- `resources/js/Components/Staff/ClinicalCases/ClinicalCaseDetail.vue` — detail view
- `resources/js/Components/Staff/ClinicalCases/ClinicalCaseForm.vue` — create/edit form
- `resources/js/Components/Staff/ClinicalCases/ClinicalCaseReviewForm.vue` — review form

**Feature Flag:**
- Create `clinical-cases` flag in PostHog UI
- Check via `Feature::active('clinical-cases')` in `PackageService::getTabs()`
- Frontend: `HasFeatureFlag` component wraps Cases tab visibility

**Phase 3 Tests:**
- Feature: `ClinicalCaseControllerTest` — Inertia modal renders, authorization, redirect responses, options data structure
- Feature: `ClinicalCaseReviewControllerTest` — review form renders, review submission, state transitions
- Feature: Feature flag toggle (Cases tab visible/hidden)

### Phase 4: Incident Bridge + Risk Integration + Reporting

**Incident → Case Bridge:**
- Listen for incident resolution event where resolution is `MANAGEMENT_PLAN` or `CLINICAL_PATHWAY`
- Auto-create case via `CreateClinicalCaseAction` with pre-populated data from incident
- Prompt Coordinator to confirm case type + review interval (handled in frontend via intermediate modal)
- Duplicate check: query `clinical_case_incidents` to see if an active case already exists for this recipient with the same trigger incident type

**Risk Register Integration:**
- Risk detail view shows linked cases (via `morphedByMany`)
- Case status badge on risk entry (Active/Escalated/Closed)
- No separate action needed — polymorphic pivot handles the query

**Population Reporting:**
- New `ClinicalCaseReportController` at `clinical-cases/reports`
- Queries: aggregate counts by status, type, overdue (where `next_review_at < today AND status = active`), escalation rate
- Organisation filter via `Package → Organisation` join
- Overdue drill-down: list of individual cases with recipient, type, days overdue, assignee

**Phase 4 Tests:**
- Feature: Incident resolution triggers case creation with correct data
- Feature: Duplicate incident → existing case prompt
- Feature: Risk shows linked case with correct status
- Feature: Reporting view aggregates correct counts
- Feature: Organisation filter works

---

## Testing Strategy

### Test Coverage by Phase

**Phase 1 Tests (Foundation):**
- Unit: Model relationships, casts, enum values, state transitions
- Feature: Migration runs, factory creates valid records

**Phase 2 Tests (Event Sourcing + Actions):**
- Feature: `CreateClinicalCaseTest` — create, validation, risk linking, incident linking, event stored
- Feature: `ReviewClinicalCaseTest` — continue, close (mandatory justification), escalate (type upgrade + interval reset)
- Feature: `DeleteClinicalCaseTest` — soft delete, audit retained

**Phase 3 Tests (Controller + UI):**
- Feature: `ClinicalCaseControllerTest` — CRUD, authorization, Inertia responses
- Feature: `ClinicalCaseReviewControllerTest` — review submission, state transitions
- Feature: Feature flag toggle

**Phase 4 Tests (Integration):**
- Feature: Full incident → case creation flow
- Feature: Risk register shows linked cases
- Feature: Reporting aggregation + org filter

### Test Location

```
tests/Feature/ClinicalCase/CreateClinicalCaseTest.php
tests/Feature/ClinicalCase/ReviewClinicalCaseTest.php
tests/Feature/ClinicalCase/UpdateClinicalCaseTest.php
tests/Feature/ClinicalCase/DeleteClinicalCaseTest.php
tests/Feature/ClinicalCase/ClinicalCaseControllerTest.php
tests/Feature/ClinicalCase/ClinicalCaseReviewControllerTest.php
tests/Feature/ClinicalCase/ClinicalCaseReportTest.php
tests/Feature/ClinicalCase/IncidentCaseBridgeTest.php
tests/Unit/ClinicalCase/ClinicalCaseModelTest.php
tests/Unit/ClinicalCase/CaseStatusTransitionTest.php
```

### Test Execution

```bash
# Phase 1
php artisan test --compact --filter=ClinicalCaseModel
php artisan test --compact --filter=CaseStatusTransition

# Phase 2
php artisan test --compact --filter=CreateClinicalCase
php artisan test --compact --filter=ReviewClinicalCase

# Phase 3
php artisan test --compact --filter=ClinicalCaseController
php artisan test --compact --filter=ClinicalCaseReviewController

# Phase 4
php artisan test --compact --filter=IncidentCaseBridge
php artisan test --compact --filter=ClinicalCaseReport

# All
php artisan test --compact --filter=ClinicalCase
```

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Polymorphic `riskables` pivot doesn't support new model type | Low | High | Test early in Phase 2; the pivot is generic by design |
| Package tab system doesn't support feature-flagged tabs | Low | Medium | `PackageService::getTabs()` already conditionally includes tabs (budget-uplift pattern) |
| Event sourcing adds complexity for simple CRUD | Medium | Low | Cases are audit-critical per SAH Manual s8.6.2 — event sourcing is justified. Keep events simple (5 event types) |
| Incident bridge depends on ICM delivering incident creation in Portal | High | High | Phase 4 can be deferred. Phases 1-3 deliver full manual CRUD + review lifecycle independently |
| Reporting view performance across all packages | Medium | Medium | Indexed queries on (status, next_review_at). Chunk if >1000 cases. Defer to scout if needed |

---

## Smoke Test Walkthrough

1. Run migrations: `php artisan migrate`
2. Enable `clinical-cases` flag for test org in PostHog
3. Navigate to a package → verify "Cases" tab appears (flag on)
4. Click "Create Case" → fill form (Recommended, clinical concern, fortnightly, clinical judgement) → save
5. Verify case appears in list as Active with next review date
6. Open case → verify detail shows concern, no reviews yet
7. Click "Complete Review" → Continue with notes → verify review in history, date advances
8. Click "Complete Review" → Escalate with reason → verify status = Escalated, type = Mandatory, interval = 7 days
9. Click "Complete Review" → Continue → verify status returns to Active (Mandatory)
10. Click "Complete Review" → Close with justification → verify status = Closed
11. Resolve an incident as "Clinical Pathway" → verify case auto-created with incident linked
12. Check risk detail view → verify linked case shows with status badge
13. Navigate to reporting view → verify aggregate counts
14. Disable feature flag → verify Cases tab hidden, data preserved
15. Run tests: `php artisan test --compact --filter=ClinicalCase`

---

## Plan Quality

### Architecture Alignment

| Check | Status | Evidence |
|-------|--------|---------|
| Data model understood | [x] PASS | 3 tables + 1 pivot + 1 polymorphic reuse |
| API contracts clear | [x] PASS | 3 controllers with routes and responses defined |
| Dependencies identified | [x] PASS | 3 existing models (Package, Risk, Incident), 9 Common components |
| Integration points mapped | [x] PASS | `riskables` polymorphic pivot, `IncidentResolutionEnum` update, `PackageService` tab integration, Pennant feature flag |
| DTO persistence explicit | [x] PASS | Projector uses explicit field mapping |

### Implementation Approach

| Check | Status | Evidence |
|-------|--------|---------|
| File changes identified | [x] PASS | 4 phases with every file listed |
| Risk areas noted | [x] PASS | 5 risks with mitigations |
| Testing approach defined | [x] PASS | Pest v3 tests per phase |
| Rollback possible | [x] PASS | Feature flag hides UI; migrations are reversible; no existing data modified |

### Constitution Compliance

| Check | Status | Evidence |
|-------|--------|---------|
| Majestic monolith | [x] PASS | Single domain, no microservices |
| Domain-driven design | [x] PASS | `domain/ClinicalCase/` with standard structure |
| Event sourcing for audit | [x] PASS | 5 event types for full lifecycle |
| Laravel Data DTOs | [x] PASS | 4 data classes |
| Action classes | [x] PASS | 4 actions, one per use case |
| Feature flag | [x] PASS | PostHog + Pennant |
| Permissions | [x] PASS | `ClinicalCasePolicy` with `manage-clinical-case` |
| Soft deletes | [x] PASS | No hard deletes |
