---
title: "Implementation Plan: Feedback Records Management"
---

# Implementation Plan: Feedback Records Management

**Spec**: [spec.md](/initiatives/Work-Management/Complaints-Management/spec)
**Design**: [design.md](/initiatives/Work-Management/Complaints-Management/design)
**Created**: 2026-02-27
**Status**: Draft

## Summary

Build a full feedback records management system on the Portal, replacing the CRM as the source of truth for complaints and remediations. The Portal handles all CRUD, stage management, notes, and action plans. All changes are pushed to the CRM `Complaints2` module as a read-only mirror via non-blocking background jobs. A one-time migration imports existing CRM records.

**Architecture**: Domain-driven module at `domain/FeedbackRecord/` following the established Incident module pattern — Lorisleiva Actions, Spatie Laravel Data classes, Inertia Vue pages with TypeScript, polymorphic Notes, and `UpdateZohoRecordJob` for CRM push.

## Technical Context

**Language/Version**: PHP 8.3, Laravel 12
**Frontend**: Vue 3, Inertia.js v2, TypeScript, Tailwind CSS v3
**Database**: MySQL
**Testing**: Pest v3
**Target Platform**: Desktop-first web (TC Portal)
**Feature Flag**: `feedback-records` (Laravel Pennant + PostHog)

### Dependencies

- **Existing**: Package model, Note model (polymorphic), `UpdateZohoRecordJob`, `ZohoService`, `ZohoModuleEnum`, `PackageService` (tab system), `BaseTable` (InertiaUI)
- **External**: Zoho CRM API (`Complaints2` / CustomModule99)
- **Packages**: `lorisleiva/laravel-actions`, `spatie/laravel-data`, `spatie/laravel-activitylog`

### Constraints

- CRM push is non-blocking — Portal never waits for Zoho
- Zoho API rate limits — use `RateLimitedWithRedis` middleware on sync jobs
- `zoho.update_to_crm` config flag gates all CRM pushes
- Confidential records invisible to unauthorised users (no "locked" placeholder)

---

## Data Model

### FeedbackRecord

| Column | Type | Notes |
|--------|------|-------|
| `id` | bigint (PK) | Auto-increment |
| `uuid` | uuid (unique) | Public identifier |
| `reference` | string(20) | REF-XXXXX, unique, continues CRM sequence |
| `package_id` | FK → packages | Required |
| `type` | string(20) | `FeedbackRecordTypeEnum`: COMPLAINT, REMEDIATION |
| `stage` | string(50) | Stage value from lifecycle enum |
| `triage_category` | string(20) nullable | URGENT, MEDIUM, STANDARD (complaints only) |
| `primary_department` | string(50) nullable | Department picklist |
| `categories` | json nullable | Array of category strings |
| `source` | string(50) nullable | Verbal Report, Email Report, etc. |
| `safety_concerns` | boolean | Default false |
| `confidential` | boolean | Default false |
| `priority_resolution` | boolean | Default false |
| `linked_to_incident` | string(20) nullable | YES, NO, UNSURE |
| `incident_id` | FK → incidents nullable | If linked to an Incident |
| `parent_feedback_record_id` | FK → feedback_records nullable | If consolidated |
| `complainant_name` | string(255) nullable | Free text |
| `complainant_type` | string(50) nullable | Picklist |
| `description` | text nullable | Main description |
| `desired_outcome` | text nullable | |
| `background` | text nullable | Background/events |
| `specific_language` | text nullable | Exact words used |
| `root_cause` | string(100) nullable | Resolution picklist |
| `resolution_action` | string(100) nullable | |
| `prevention_action` | string(100) nullable | |
| `contributing_details` | string(100) nullable | |
| `date_received` | date | When created/received |
| `due_date` | date nullable | Resolution due date (auto-calculated from SLA, overridable) |
| `due_date_manually_set` | boolean | Default false. True if user overrode the auto-calculated due date |
| `accountable_person_id` | FK → users nullable | |
| `quality_support_lead_id` | FK → users nullable | |
| `escalation_point_id` | FK → users nullable | |
| `accountable_person_assigned_at` | datetime nullable | Stage timestamp |
| `accountable_person_acknowledged_at` | datetime nullable | |
| `complaint_owner_accepted_at` | datetime nullable | |
| `closed_at` | datetime nullable | |
| `zoho_id` | string(50) nullable | CRM record ID |
| `crm_sync_status` | string(20) | SYNCED, PENDING, FAILED |
| `crm_last_pushed_at` | datetime nullable | |
| `migrated_from_crm` | boolean | Default false |
| `created_by` | FK → users | Who created the record |
| `timestamps` | | created_at, updated_at |
| `softDeletes` | | deleted_at |

**Indexes**: `package_id`, `type`, `stage`, `confidential`, `zoho_id`, `crm_sync_status`, `due_date`

### FeedbackActionItem

| Column | Type | Notes |
|--------|------|-------|
| `id` | bigint (PK) | |
| `feedback_record_id` | FK → feedback_records | Required |
| `description` | text | Action description |
| `assigned_to` | string(255) nullable | Person or department name |
| `due_date` | date nullable | |
| `is_complete` | boolean | Default false |
| `completed_at` | datetime nullable | |
| `completed_by` | FK → users nullable | |
| `zoho_id` | string(50) nullable | CRM subform row ID |
| `timestamps` | | |
| `softDeletes` | | |

### Relationships

```
Package 1──* FeedbackRecord (package_id)
FeedbackRecord 1──* FeedbackActionItem (feedback_record_id)
FeedbackRecord 1──* Note (polymorphic: noteable_type = FeedbackRecord)
FeedbackRecord *──1 User (accountable_person_id)
FeedbackRecord *──1 User (quality_support_lead_id)
FeedbackRecord *──1 User (escalation_point_id)
FeedbackRecord *──1 User (created_by)
FeedbackRecord *──1 Incident (incident_id, nullable)
FeedbackRecord *──1 FeedbackRecord (parent_feedback_record_id, nullable)
```

### Enums

All enums follow the existing pattern with `FindsFromValue`, `HasToArray` traits. Cases use SCREAMING_SNAKE_CASE.

**FeedbackRecordTypeEnum** (`string`): `COMPLAINT`, `REMEDIATION`
**ComplaintStageEnum** (`string`): `NEW`, `AP_ASSIGNED`, `AP_ACKNOWLEDGED`, `OWNER_ACCEPTED`, `AWAITING_INFO_COMPLAINANT`, `AWAITING_INFO_STAFF`, `AWAITING_INFO_EXTERNAL`, `RESOLUTION_PROPOSED`, `CLOSED_RESOLVED`, `CLOSED_UNRESOLVED`, `CLOSED_ARCHIVED`, `CLOSED_CONSOLIDATED`
**RemediationStageEnum** (`string`): `NEW`, `ISSUES_ASSIGNED`, `AWAITING_INFO_COMPLAINANT`, `AWAITING_INFO_STAFF`, `AWAITING_INFO_EXTERNAL`, `RESOLUTION_PROPOSED`, `CLOSED_RESOLVED`, `CLOSED_UNRESOLVED`, `CLOSED_ARCHIVED`, `CLOSED_CONSOLIDATED`, `CONVERTED_TO_COMPLAINT`
**FeedbackTriageCategoryEnum** (`string`): `URGENT`, `MEDIUM`, `STANDARD`
**FeedbackComplainantTypeEnum** (`string`): `CLIENT_SELF`, `ANONYMOUS`, `SUPPORTER`, `COORDINATOR`, `SUPPLIER`, `OTHER`, `REGISTERED_REPRESENTATIVE`
**FeedbackSourceEnum** (`string`): `VERBAL_REPORT`, `EMAIL_REPORT`, `ORM_REPORT`, `EXTERNAL_ESCALATION_TRIGGER`, `ACQSC`
**FeedbackDepartmentEnum** (`string`): Values from CRM Primary_Department picklist
**FeedbackCategoryEnum** (`string`): Values from CRM Category_of_Concern_s picklist
**FeedbackCrmSyncStatusEnum** (`string`): `SYNCED`, `PENDING`, `FAILED`

---

## API Contracts

### Routes (`domain/FeedbackRecord/Routes/feedbackRecordRoutes.php`)

All routes gated by `check.feature.flag:feedback-records` middleware.

```
GET    /package/{package}/show/feedback-records          → Package tab (via PackageService)
GET    /feedback-records/{feedbackRecord}                 → ShowFeedbackRecordAction
GET    /feedback-records/{feedbackRecord}/edit             → EditFeedbackRecordAction
GET    /package/{package}/feedback-records/create          → CreateFeedbackRecordAction
POST   /package/{package}/feedback-records                 → StoreFeedbackRecordAction
PUT    /feedback-records/{feedbackRecord}                  → UpdateFeedbackRecordAction
DELETE /feedback-records/{feedbackRecord}                  → DeleteFeedbackRecordAction
POST   /feedback-records/{feedbackRecord}/advance-stage    → AdvanceFeedbackRecordStageAction
POST   /feedback-records/{feedbackRecord}/action-items     → StoreFeedbackActionItemAction
PUT    /feedback-action-items/{feedbackActionItem}          → UpdateFeedbackActionItemAction
DELETE /feedback-action-items/{feedbackActionItem}          → DeleteFeedbackActionItemAction
POST   /feedback-records/{feedbackRecord}/retry-crm-sync   → RetryCrmSyncAction (admin)
```

Notes use the existing `notes.store`, `notes.update`, `notes.destroy` routes (polymorphic).

### Data Classes

**CreateFeedbackRecordData** (`domain/FeedbackRecord/Data/CreateFeedbackRecordData.php`):
```php
#[TypeScript]
#[MapName(SnakeCaseMapper::class)]
class CreateFeedbackRecordData extends Data
{
    public function __construct(
        #[Rule('required', 'exists:packages,id')]
        public int $packageId,
        #[Rule('required')]
        public FeedbackRecordTypeEnum $type,
        #[Rule('required', 'min:10')]
        public string $description,
        // ... all intake fields with validation rules
    ) {}
}
```

**UpdateFeedbackRecordData** — same fields, all optional.

**FeedbackRecordData** — read DTO with Lazy relationships, `#[TypeScript]` for generated types.

**AdvanceStageData**:
```php
#[TypeScript]
#[MapName(SnakeCaseMapper::class)]
class AdvanceStageData extends Data
{
    public function __construct(
        #[Rule('required', 'string')]
        public string $nextStage,
        #[Rule('nullable', 'string', 'max:1000')]
        public ?string $note,
    ) {}
}
```

**CreateFeedbackActionItemData** / **UpdateFeedbackActionItemData** — CRUD DTOs for action plan items.

---

## Vue Component Specifications

### Shared Types (`resources/js/types/feedback-record.d.ts`)

```ts
type FeedbackRecord = {
    id: number
    uuid: string
    reference: string
    package: Package
    type: 'COMPLAINT' | 'REMEDIATION'
    stage: string
    triage_category: string | null
    primary_department: string | null
    categories: string[]
    source: string | null
    safety_concerns: boolean
    confidential: boolean
    priority_resolution: boolean
    complainant_name: string | null
    complainant_type: string | null
    description: string | null
    desired_outcome: string | null
    background: string | null
    specific_language: string | null
    root_cause: string | null
    resolution_action: string | null
    prevention_action: string | null
    contributing_details: string | null
    date_received: string
    due_date: string | null
    accountable_person: User | null
    quality_support_lead: User | null
    escalation_point: User | null
    crm_sync_status: 'SYNCED' | 'PENDING' | 'FAILED'
    crm_last_pushed_at: string | null
    migrated_from_crm: boolean
    zoho_id: string | null
    closed_at: string | null
    created_by: User
    created_at: string
    updated_at: string
    notes: Note[]
    action_items: FeedbackActionItem[]
}

type FeedbackActionItem = {
    id: number
    feedback_record_id: number
    description: string
    assigned_to: string | null
    due_date: string | null
    is_complete: boolean
    completed_at: string | null
    completed_by: User | null
}
```

Note: These types will be auto-generated by `spatie/typescript-transformer` via `#[TypeScript]` on Data classes. Manual types above are for reference — the generated `generated.d.ts` is the actual source.

### PackageFeedbackRecords.vue (Package Tab)

- **Path**: `resources/js/Pages/Packages/tabs/PackageFeedbackRecords.vue`
- **Props**: `defineProps<Props>()` with named type:
  - `package: Package`
  - `tabs: Tab[]`
  - `tabData: FeedbackRecordTable` (InertiaUI table resource)
  - `viewLayoutData: ViewLayoutData`
- **Common components reused**: `PackageViewLayout`, `CommonTable`, `CommonCard`, `CommonBadge`, `CommonButton`
- **Emits**: None (navigation-based)

### FeedbackRecordShow.vue (Detail View)

- **Path**: `resources/js/Pages/FeedbackRecords/Show.vue`
- **Props**: `defineProps<Props>()` with named type:
  - `feedbackRecord: FeedbackRecord`
  - `noteCategories: NoteCategory[]`
  - `package: Package`
  - `canEdit: boolean`
  - `canManageStages: boolean`
  - `canManageNotes: boolean`
  - `canManageActionPlan: boolean`
- **Layout**: `AppLayout` with breadcrumb back to package
- **Common components reused**: `CommonContent`, `CommonHeader`, `CommonCard`, `CommonBadge`, `CommonDefinitionList`, `CommonDefinitionItem`, `CommonAvatar`, `CommonAlert`, `CommonButton`, `CommonNotes`, `CommonTable`, `CommonModal`
- **Key sections**: Overview, Complainant, Details, Resolution, People cards, Stage timeline, Notes (via `CommonNotes`), Action Plan table

### FeedbackRecordCreate.vue (Create Form)

- **Path**: `resources/js/Pages/FeedbackRecords/Create.vue`
- **Props**: `defineProps<Props>()` with named type:
  - `package: Package`
  - `users: SelectOption[]` (for people fields)
  - `enums: FeedbackRecordEnums` (all picklist values)
- **Form state**: Single `useForm` at parent level with all fields:
  ```ts
  const form = useForm({
      type: '' as string,
      complainant_name: '' as string,
      complainant_type: '' as string,
      // ... all intake fields
  })
  ```
- **Step validation**: Not a multi-step wizard — single scrollable form with sections (matching design). Client-side validation via Zod before submit.
- **Common components reused**: `CommonContent`, `CommonHeader`, `CommonCard`, `CommonFormField`, `CommonInput`, `CommonTextarea`, `CommonSelectMenu`, `CommonRadioGroup`, `CommonCheckbox`, `CommonButton`
- **Emits**: None (form submit via `form.post()`)

### FeedbackRecordEdit.vue (Edit Form)

- Same structure as Create, with `form.put()` for submission
- Resolution fields enabled (unlike Create where they are disabled)
- Closed record editing blocked unless `canManageStages`

### StageManagement.vue (Stage Management Page)

- **Path**: `resources/js/Pages/FeedbackRecords/StageManagement.vue`
- **Props**: `defineProps<Props>()` with named type:
  - `feedbackRecord: FeedbackRecord`
  - `availableNextStages: StageOption[]`
  - `stageHistory: StageTransition[]`
  - `complaintLifecycle: StageDefinition[]`
  - `remediationLifecycle: StageDefinition[]`
- **Form state**: `useForm` for stage advance with optional note
- **Common components reused**: `CommonContent`, `CommonHeader`, `CommonCard`, `CommonButton`, `CommonModal`, `CommonTextarea`, `CommonBadge`

### New Components

- **FeedbackStageProgressBar.vue** — horizontal step indicator showing stage progression. Uses `CommonBadge` for stage labels with completed/current/pending states. Pure presentational component — receives stages and current stage as props.
- **CrmSyncBadge.vue** — small inline badge showing sync status (synced/pending/failed) with spinner animation for pending state. Pure presentational — receives `crmSyncStatus` as prop.

### No Pinia Stores Required

All state is handled by:
- `useForm` for form state (Create, Edit, Stage advance)
- `usePage().props` for server-provided data (record details, permissions, enums)
- Local `ref`/`reactive` for UI state (modal open/close, active section)

---

## Implementation Phases

### Phase 1A: Foundation (Data Layer)

1. **Create domain module** at `domain/FeedbackRecord/`
2. **Migrations**: `feedback_records` table, `feedback_action_items` table
3. **Models**: `FeedbackRecord`, `FeedbackActionItem` with relationships, casts, traits (`HasFactory`, `LogsActivity`, `SoftDeletes`)
4. **Enums**: All enum classes
5. **Data classes**: `FeedbackRecordData`, `CreateFeedbackRecordData`, `UpdateFeedbackRecordData`, `AdvanceStageData`, `CreateFeedbackActionItemData`, `UpdateFeedbackActionItemData`
6. **Policy**: `FeedbackRecordPolicy` with `Response::allow()`/`Response::deny()` and permission checks
7. **Service Provider**: `FeedbackRecordServiceProvider` to register routes
8. **Factory & Seeder**: `FeedbackRecordFactory`, `FeedbackActionItemFactory`
9. **Permissions**: Add 6 permission keys to `config/permissions/user-permission-list.php`, run `php artisan sync:roles-permissions`
10. **Feature flag**: Register `feedback-records` in Pennant

### Phase 1B: CRUD Actions & Routes

1. **Actions**: `CreateFeedbackRecordAction`, `StoreFeedbackRecordAction`, `ShowFeedbackRecordAction`, `EditFeedbackRecordAction`, `UpdateFeedbackRecordAction`, `DeleteFeedbackRecordAction`
2. **Stage management**: `AdvanceFeedbackRecordStageAction` with stage lifecycle validation
3. **Action plan CRUD**: `StoreFeedbackActionItemAction`, `UpdateFeedbackActionItemAction`, `DeleteFeedbackActionItemAction`
4. **Routes**: All routes with middleware (`check.feature.flag:feedback-records`, `user.permission:*`)
5. **REF number generation**: Auto-generate `REF-XXXXX` on creation (query max existing + increment with DB locking)
6. **SLA service**: `FeedbackRecordSlaService` — auto-calculates `due_date` based on type + triage category. Called on create and on triage category change. Respects `due_date_manually_set` flag to preserve manual overrides. Recalculates on remediation→complaint conversion.

### Phase 1C: CRM Push

1. **Push action**: `SyncFeedbackRecordToZoho` (Lorisleiva Action) — maps Portal fields to CRM field names, dispatches `UpdateZohoRecordJob` to `Complaints2` module
2. **Push note action**: `SyncFeedbackNoteToZoho` — pushes note content via `ZohoService::insertNote()` / `updateNote()` / `deleteNote()`
3. **Push action plan**: `SyncFeedbackActionItemToZoho` — pushes subform data
4. **CRM sync status tracking**: Update `crm_sync_status` and `crm_last_pushed_at` on the model after successful push
5. **Manual retry action**: `RetryCrmSyncAction` for admin-triggered re-push
6. **Add `Complaints2` to `ZohoModuleEnum`**

### Phase 1D: Frontend (Vue Pages)

1. **Package tab integration**: Add "Feedback Records" tab to `PackageService::getTabs()`, `::getTab()`, `::getTabData()`
2. **Table class**: `FeedbackRecordTable extends BaseTable` with filters for type, stage, triage
3. **Vue pages**: `PackageFeedbackRecords.vue`, `Show.vue`, `Create.vue`, `Edit.vue`, `StageManagement.vue`
4. **New components**: `FeedbackStageProgressBar.vue`, `CrmSyncBadge.vue`
5. **TypeScript types**: Auto-generated via `#[TypeScript]` attribute on Data classes
6. **Feature flag frontend**: Wrap Package tab visibility with `HasFeatureFlag`

### Phase 1E: Migration

1. **Migration job**: `MigrateFeedbackRecordsFromZohoJob` — one-time bulk import from CRM
2. **Migration data class**: `FeedbackRecordZohoData` — maps Zoho field names to Portal fields
3. **Migration command**: `php artisan feedback-records:migrate-from-crm` — dispatches migration job
4. **Migration flags**: Sets `migrated_from_crm = true`, stores `zoho_id`
5. **Note migration**: Import existing CRM notes and link to feedback records
6. **REF number preservation**: Migrated records keep their original REF-XXXXX numbers

### Phase 1F: Testing

- **Unit tests**: Enum label/value tests, stage lifecycle validation, REF generation
- **Feature tests**: All CRUD actions, stage advancement, permission checks, CRM push dispatch, migration
- **Policy tests**: All 6 permission combinations, confidential record hiding, package-scoped access

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Zoho API rate limiting during migration | Medium | Medium | Batch migration with `RateLimitedWithRedis`, overnight run |
| Action Plan subform schema unknown | Medium | Low | Stub the Action Plan with known fields, refine after stakeholder confirms |
| REF number sequence collision during migration | Low | High | Lock sequence generation, import existing max REF first |
| Large CRM data volume slows migration | Low | Medium | Chunked processing, progress tracking, resumable migration |
| Stage lifecycle complexity (11+ stages) | Medium | Medium | Comprehensive enum validation, stage transition matrix in service layer |

---

## Gate 3: Architecture Check

**Date**: 2026-02-27
**Status**: PASS

### Technical Feasibility
- [x] Architecture approach clear — domain module at `domain/FeedbackRecord/` following Incident pattern
- [x] Existing patterns leveraged — Lorisleiva Actions, Spatie Data, BaseTable, CommonNotes, UpdateZohoRecordJob
- [x] All requirements buildable — no impossible requirements identified
- [x] Performance considered — CRM push is async, list loads via paginated table, indexes on key columns
- [x] Security considered — confidential records hidden, permission-based access, package-scoped queries

### Data & Integration
- [x] Data model understood — FeedbackRecord + FeedbackActionItem + polymorphic Notes
- [x] API contracts clear — RESTful routes defined with Data class validation
- [x] Dependencies identified — Zoho CRM API, existing Note model, Package model, UpdateZohoRecordJob
- [x] Integration points mapped — Package tab, CRM push, polymorphic Notes, feature flag
- [x] DTO persistence explicit — Data classes map to explicit model `create()`/`update()` calls in Actions

### Implementation Approach
- [x] File changes identified — domain module, PackageService, permissions config, Vue pages
- [x] Risk areas noted — migration timing, REF sequence, action plan schema
- [x] Testing approach defined — Pest feature/unit tests for all CRUD, policies, CRM push
- [x] Rollback possible — feature flag gates entire feature, migration is additive (new tables)

### Resource & Scope
- [x] Scope matches spec — Phase 1 only, no Phase 2/3 items
- [x] Effort reasonable — follows established patterns, no new infrastructure
- [x] Skills available — standard Laravel/Vue/Inertia stack

### Laravel & Cross-Platform Best Practices
- [x] No hardcoded business logic in Vue — stage lifecycles, permissions, enums all from backend
- [x] Cross-platform reusability — API routes return JSON-compatible data via Inertia
- [x] Laravel Data for validation — all validation in Data classes, no Form Request objects
- [x] Model route binding — `FeedbackRecord $feedbackRecord` in all actions, no `int $id`
- [x] No magic numbers/IDs — enums for all categorical values, constants for status strings
- [x] Common components pure — `FeedbackStageProgressBar` and `CrmSyncBadge` are pure presentational
- [x] Use Lorisleiva Actions — all business logic in Actions with `AsAction` trait
- [x] Action authorization in `authorize()` — permission checks in `authorize()` method on each action
- [x] Data classes remain anemic — DTOs with properties and validation only, no business logic
- [x] Migrations schema-only — data migration via separate command/job
- [x] Models have single responsibility — FeedbackRecord owns complaint domain, FeedbackActionItem owns action plans
- [x] Granular model policies — `FeedbackRecordPolicy` with per-permission methods, `Response::allow()`/`Response::deny()`
- [x] Response objects in auth — policies return `Response::allow()` / `Response::deny('reason')`
- [x] Event sourcing: N/A — not using event sourcing for this feature (standard Eloquent CRUD with activity log)
- [x] Semantic column documentation — PHPDoc on model properties for all stage timestamps, CRM sync fields
- [x] Feature flags dual-gated — `check.feature.flag:feedback-records` middleware + `HasFeatureFlag` component for tab

### Vue TypeScript Standards
- [x] All new Vue components planned with `<script setup lang="ts">`
- [x] Props use named `type` (`type Props = { ... }` with `defineProps<Props>()`)
- [x] Emits use named `type` where applicable
- [x] No `any` types planned — `FeedbackRecord`, `FeedbackActionItem` types from generated TypeScript
- [x] Shared types identified — auto-generated via `#[TypeScript]` in `generated.d.ts`
- [x] Common components audited — reusing CommonTable, CommonNotes, CommonCard, CommonBadge, CommonFormField, CommonInput, CommonTextarea, CommonSelectMenu, CommonRadioGroup, CommonCheckbox, CommonButton, CommonAlert, CommonDefinitionList, CommonAvatar, CommonModal, CommonTabs
- [x] Create form uses single parent-level `useForm` (not multi-step wizard — single scrollable form)
- [x] No Pinia stores — all state via `useForm`, `usePage().props`, local refs
- [x] Type declarations: N/A — no untyped JS dependencies imported

**Ready to Implement**: YES

---

## Project Structure

### Domain Module

```
domain/FeedbackRecord/
├── Actions/
│   ├── CreateFeedbackRecordAction.php
│   ├── StoreFeedbackRecordAction.php
│   ├── ShowFeedbackRecordAction.php
│   ├── EditFeedbackRecordAction.php
│   ├── UpdateFeedbackRecordAction.php
│   ├── DeleteFeedbackRecordAction.php
│   ├── AdvanceFeedbackRecordStageAction.php
│   ├── StoreFeedbackActionItemAction.php
│   ├── UpdateFeedbackActionItemAction.php
│   ├── DeleteFeedbackActionItemAction.php
│   └── RetryCrmSyncAction.php
├── Data/
│   ├── FeedbackRecordData.php
│   ├── CreateFeedbackRecordData.php
│   ├── UpdateFeedbackRecordData.php
│   ├── AdvanceStageData.php
│   ├── FeedbackActionItemData.php
│   ├── CreateFeedbackActionItemData.php
│   ├── UpdateFeedbackActionItemData.php
│   └── FeedbackRecordZohoData.php
├── Enums/
│   ├── FeedbackRecordTypeEnum.php
│   ├── ComplaintStageEnum.php
│   ├── RemediationStageEnum.php
│   ├── FeedbackTriageCategoryEnum.php
│   ├── FeedbackComplainantTypeEnum.php
│   ├── FeedbackSourceEnum.php
│   ├── FeedbackDepartmentEnum.php
│   ├── FeedbackCategoryEnum.php
│   └── FeedbackCrmSyncStatusEnum.php
├── Factories/
│   ├── FeedbackRecordFactory.php
│   └── FeedbackActionItemFactory.php
├── Jobs/
│   └── MigrateFeedbackRecordsFromZohoJob.php
├── Models/
│   ├── FeedbackRecord.php
│   └── FeedbackActionItem.php
├── Policies/
│   └── FeedbackRecordPolicy.php
├── Providers/
│   └── FeedbackRecordServiceProvider.php
├── Routes/
│   └── feedbackRecordRoutes.php
├── Services/
│   ├── FeedbackRecordStageService.php
│   └── FeedbackRecordSlaService.php
├── Seeders/
│   └── FeedbackRecordSeeder.php
└── Tables/
    └── FeedbackRecordTable.php
```

### CRM Sync Actions

```
app/Actions/Zoho/
├── SyncFeedbackRecordToZoho.php
├── SyncFeedbackNoteToZoho.php
└── SyncFeedbackActionItemToZoho.php
```

### Vue Pages

```
resources/js/Pages/
├── FeedbackRecords/
│   ├── Show.vue
│   ├── Create.vue
│   ├── Edit.vue
│   └── StageManagement.vue
└── Packages/tabs/
    └── PackageFeedbackRecords.vue

resources/js/Components/FeedbackRecord/
├── FeedbackStageProgressBar.vue
└── CrmSyncBadge.vue
```

### Migrations

```
database/migrations/
├── YYYY_MM_DD_HHMMSS_create_feedback_records_table.php
└── YYYY_MM_DD_HHMMSS_create_feedback_action_items_table.php
```

### Tests

```
tests/
├── Feature/FeedbackRecord/
│   ├── StoreFeedbackRecordActionTest.php
│   ├── UpdateFeedbackRecordActionTest.php
│   ├── DeleteFeedbackRecordActionTest.php
│   ├── ShowFeedbackRecordActionTest.php
│   ├── AdvanceFeedbackRecordStageActionTest.php
│   ├── FeedbackActionItemCrudTest.php
│   ├── FeedbackRecordPolicyTest.php
│   └── SyncFeedbackRecordToZohoTest.php
└── Unit/FeedbackRecord/
    ├── ComplaintStageEnumTest.php
    ├── RemediationStageEnumTest.php
    └── FeedbackRecordStageServiceTest.php
```

---

## Development Clarifications

### Session 2026-02-27

1. Q: Event sourcing (like Incidents) or Eloquent CRUD with activity logging? → A: **Eloquent + ActivityLog**. Standard CRUD with Spatie ActivityLog for audit trail. Simpler, fewer moving parts. No aggregate root, no stored events table, no projector cache. Stage transitions logged via ActivityLog automatically.

2. Q: CRM sync status tracking — bare `zoho_id` (existing pattern) or richer `crm_sync_status` + `crm_last_pushed_at`? → A: **Rich sync tracking**. Add `crm_sync_status` (SYNCED/PENDING/FAILED) + `crm_last_pushed_at`. New pattern justified by spec requirements (FR-015 admin retry, sync badges in UI). Existing models may adopt this later if useful.

3. Q: Where should stage lifecycle validation live? → A: **Service class** (`FeedbackRecordStageService`). Methods: `getAvailableNextStages(FeedbackRecord)`, `validateTransition(from, to)`, `getStageDefinitions(type)`. Centralises lifecycle rules, easy to test independently, reusable by both the Action (validation) and the Vue page (showing available next stages).

4. Q: REF number generation — continue CRM sequence or start new? → A: **Continue CRM sequence**. After migration, query `MAX(reference)` from `feedback_records` table to determine next number. Use database-level locking (`SELECT ... FOR UPDATE`) to prevent sequence collisions during concurrent creation.

5. Q: CRM push timing — per-save, debounced, or observer-based? → A: **Per-save dispatch**. Dispatch `SyncFeedbackRecordToZoho` from Actions on every create/edit/stage change. Follows existing Supplier/Bill pattern. `ShouldBeUnique` prevents duplicate jobs for the same record. Simple, predictable, matches NFR-001 (under 5 minutes).

6. Q: Edit pattern — separate page, inline on detail, or modal? → A: **Separate Edit page** (`Edit.vue`). Matches existing Portal pattern. Clear read/write mode separation. Less complex than inline editing with 30+ fields.

7. Q: How should the one-time CRM migration be triggered? → A: **Artisan command** (`php artisan feedback-records:migrate-from-crm`). Run manually in production during off-peak. Resumable via `ZohoSyncHistory` (tracks page number). Safe to re-run (upsert by `zoho_id`). Includes note and action plan import.

8. Q: Detail view routing — standalone or nested under package? → A: **Standalone route** (`/feedback-records/{feedbackRecord}`). Simpler URLs, follows Incident pattern. Breadcrumb links back to package. Create route stays nested (`/package/{package}/feedback-records/create`) since it needs the package context.

9. Q: Feature flag scoping — per-organisation, global, or per-user? → A: **Per-organisation**. Use Pennant with organisation scope for gradual rollout. Enable for Compliance team first, then expand to all staff. Matches design.md "gradual rollout by team" strategy.

10. Q: How should Action Plan items push to CRM? (Zoho uses subform, not separate module) → A: **Subform update via parent record push**. Include action items as a nested `Action_Plan` array in the `UpdateZohoRecordJob` data payload for the parent `Complaints2` record. Zoho subforms are updated by pushing the entire subform array on each save. This means every action item CRUD operation triggers a full record push with all current items.

11. Q: Are complaint SLAs defined? Should due_date be auto-calculated? → A: **Yes**. SLAs from domain context (index.md): Complaints = 28 days resolution, Remediations = 2 days. Triage response SLAs: High = 24hrs, Medium = 5 business days, Standard = 10 business days. Added FR-028 through FR-032 to spec. `FeedbackRecordSlaService` auto-calculates `due_date` on create and triage change. Manual override supported via `due_date_manually_set` flag.

12. Q: Package tab badge — count only, count + overdue, or no badge? → A: **Count + overdue highlight**. Badge shows total open feedback records. If any are overdue (past `due_date` and not closed), badge turns red. Implemented in `PackageService::getTabs()` with a cached count query.

13. Q: How should confidential records behave in tab count and list? → A: **Excluded entirely**. Confidential records don't appear in the count badge or list for unauthorised users. No "locked" placeholder. Query scopes filter by `confidential = false` OR user has `view-confidential-complaints` permission. Consistent with spec edge case #3 and FR-004.

14. Q: How should the Note CRM push be triggered? Existing note routes are generic polymorphic — they don't know the note belongs to a FeedbackRecord. → A: **Model observer on Note**. Add a `NoteObserver` (or extend existing) that checks `if ($note->noteable_type === FeedbackRecord::class)` in `created()`, `updated()`, and `deleted()` methods, then dispatches `SyncFeedbackNoteToZoho::run($note)`. Zero changes to existing note controllers. Clean separation — the FeedbackRecord domain registers its own observer concern. Register in `FeedbackRecordServiceProvider::boot()`.

---

## Next Steps

- [x] `/speckit-tasks` — Implementation tasks generated (77 tasks, AI mode)
- [ ] `/trilogy-linear-sync push docs` — Sync to Linear
- [ ] `/speckit-implement` — Start development
