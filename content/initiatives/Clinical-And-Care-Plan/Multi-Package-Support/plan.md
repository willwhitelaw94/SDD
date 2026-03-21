---
title: "Implementation Plan: Multi-Package Support (MPS)"
---

# Implementation Plan: Multi-Package Support (MPS)

**Branch**: `epic/mps-multi-package-support` | **Date**: 2026-02-25 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from spec.md + codebase architecture review

## Summary

MPS enables the full lifecycle for multi-classification clients: detecting new funding classifications via the SA API nightly sync, tracking ACER lodgement per funding stream, managing consent and activation per stream, and providing a unified `/entries` queue page for both Coordinators and Finance.

The core architectural addition is **EntryRecord** — a new domain model that sits between `PackageAllocation` (SA approval) and `Funding` (budget records). An Entry is lodged per classification (1 ACER for RC), but a single classification can produce multiple funding streams (RC entry -> RC + CM funding). The Entry is the lodgement unit; Funding Streams are the budget units.

The implementation extends the existing SA sync pipeline (`SyncPackageFromServicesAustralia`) with a new pipe (`SyncEntryRecords`) and adds a new `/entries` page with tabbed filtering, activation/deferral modals, and ACER lodgement recording.

## Technical Context

**Language/Version**: PHP 8.3 / Laravel 12
**Primary Dependencies**: Inertia.js v2, Vue 3, Tailwind CSS v3, Laravel Data, Lorisleiva Actions, Spatie EventSourcing, Spatie Activity Log
**Storage**: MySQL
**Testing**: Pest 3 (Feature + Unit + Browser via Dusk v8)
**Target Platform**: Web (desktop-first, responsive)
**Project Type**: Web application (Laravel + Inertia SPA)
**Performance Goals**: Sync detection within nightly run (<5min overhead); queue page loads <2s with 500+ entries
**Constraints**: Manual ACER lodgement only (no SA API write); single-package model (no multiple package records); feature-flagged rollout
**Scale/Scope**: ~2,000 active packages, up to 5 classifications each = ~10,000 potential entry records

## Gate 3: Architecture Check

**Date**: 2026-02-25
**Status**: PASS

### Technical Feasibility
- [x] Architecture approach clear — Extends existing sync pipeline + new domain model + new Inertia page
- [x] Existing patterns leveraged — Uses established Pipeline, Action, Data, Table, Notification patterns
- [x] All requirements buildable — No impossible requirements; all 33 FRs map to known patterns
- [x] Performance considered — EntryRecord query scopes + indexed `status` column; table pagination via BaseTable
- [x] Security considered — Policy-based authorization per role; Gate::authorize in controllers

### Data & Integration
- [x] Data model understood — EntryRecord entity defined with relationships to Package, PackageAllocation, Funding, User
- [x] API contracts clear — CRUD endpoints for entries + bulk actions + ACER lodgement recording
- [x] Dependencies identified — SA sync pipeline, LTH Step 2 integration, notification system, Pennant feature flags
- [x] Integration points mapped — SyncEntryRecords pipe in existing pipeline; LTH Step 2 creates EntryRecords at POS
- [x] DTO persistence explicit — Laravel Data classes for all request/response; no `->toArray()` into ORM

### Implementation Approach
- [x] File changes identified — See Implementation Phases below
- [x] Risk areas noted — Backfill migration, sync pipeline ordering, LTH integration timing
- [x] Testing approach defined — Feature tests per action/controller; unit tests for state machine; browser tests for queue page
- [x] Rollback possible — Feature flag (`multi-package-support`) gates all new UI; migration is additive (new table, no column changes)

### Resource & Scope
- [x] Scope matches spec — 33 FRs mapped to 4 phases; no over-engineering
- [x] Effort reasonable — 3-4 sprints estimated in idea brief
- [x] Skills available — Standard Laravel/Vue patterns; team familiar with sync pipeline

### Laravel & Cross-Platform Best Practices
- [x] No hardcoded business logic in Vue — All status transitions, validation rules, and business logic backend-powered
- [x] Cross-platform reusability — Actions return Data objects usable by Vue, React Native, and API consumers
- [x] Laravel Data for validation — `EntryRecordData`, `ActivateEntryData`, `LodgeAcerData`, `DeferEntryData` classes
- [x] Model route binding — Controllers use `EntryRecord $entryRecord` parameters
- [x] No magic numbers/IDs — Status enum (`EntryRecordStatusEnum`), funding stream codes via `FundingStream` model constants, zero-funding codes as constants
- [x] Common components pure — All Common components used without business logic injection
- [x] Use Lorisleiva Actions — `CreateEntryRecordAction`, `ActivateEntryAction`, `DeferEntryAction`, `LodgeAcerAction`, `PromoteEntryAction`
- [x] Action authorization in `authorize()` — Each action's `authorize()` method checks policy before `handle()`
- [x] Data classes remain anemic — All Data classes are property-only containers with validation rules
- [x] Migrations schema-only — `create_entry_records_table` migration is schema-only; backfill is a separate Laravel Operation
- [x] Models have single responsibility — EntryRecord owns the ACER lodgement lifecycle; Funding owns budget tracking
- [x] Granular model policies — `EntryRecordPolicy` with `view`, `activate`, `defer`, `lodge`, `promote` methods
- [x] Response objects in auth — `Response::allow()` / `Response::deny('reason')` in policy methods
- [x] Event sourcing events validated — EntryRecord uses activity logging (not event sourcing) since it's a simple CRUD lifecycle; Funding (existing) remains event-sourced
- [x] Semantic column documentation — All EntryRecord columns have PHPDoc definitions explaining lifecycle meaning
- [x] Feature flags dual-gated — `multi-package-support` flag checked via backend middleware + frontend `HasFeatureFlag`

### Vue TypeScript Standards
- [x] All new/modified Vue components planned with `<script setup lang="ts">`
- [x] Props use named `type` (`type Props = { ... }` with `defineProps<Props>()`)
- [x] Emits use named `type` (`type Emits = { ... }` with `defineEmits<Emits>()`)
- [x] No `any` types planned — `EntryRecordData`, `PackageAllocationData` types generated via `#[TypeScript]`
- [x] Shared types identified — `App.Data.Entry.EntryRecordData` in generated types; status enum shared
- [x] Common components audited — `CommonTable`, `CommonModal`, `CommonForm`, `CommonAlert`, `CommonBadge`, `CommonTabs`, `CommonSelectMenu`, `CommonRadioGroup`, `CommonInput` all reused
- [x] No multi-step wizards needed — Activation is a single modal, not a wizard
- [x] Pinia stores not needed — Entry data comes via Inertia props; no cross-page state required
- [x] Type declarations planned for untyped `.js` dependencies — None new required

**Ready to Implement**: YES

---

## Design Decisions

### Data Model

#### New: EntryRecord

| Column | Type | Description |
|--------|------|-------------|
| `id` | `bigint unsigned` | Primary key |
| `package_id` | `foreignId` | FK to `packages` — the client's package |
| `package_allocation_id` | `foreignId nullable` | FK to `package_allocations` — the SA allocation that triggered this entry (nullable for manual creates) |
| `classification_code` | `string(10)` | SA classification code (e.g., `RC`, `EL`, `AT`, `HM`, `ON`) |
| `status` | `string(20)` | Lifecycle status (see enum below) |
| `commencement_date` | `date nullable` | When the funding stream starts (validated <= take_up_deadline) |
| `lodgement_date` | `date nullable` | When the ACER was lodged in PRODA |
| `consent_date` | `datetime nullable` | When client consent was confirmed |
| `consent_confirmed_by` | `foreignId nullable` | FK to `users` — who confirmed consent |
| `deferred_reason` | `text nullable` | Why the entry was deferred |
| `deferred_at` | `datetime nullable` | When the entry was deferred |
| `care_partner_id` | `foreignId nullable` | FK to `users` — clinical care partner for RC/EOL |
| `take_up_deadline` | `date nullable` | From PackageAllocation.takeup_end_date |
| `intent_captured_at` | `datetime nullable` | When intent was captured at POS (LTH Step 2) |
| `withdrawal_reason` | `string nullable` | From SA API PackageAllocation.status_reason |
| `withdrawn_at` | `datetime nullable` | When funding was withdrawn |
| `status_reason` | `string nullable` | Additional context for current status |
| `created_at` | `timestamp` | Record creation |
| `updated_at` | `timestamp` | Last modification |

**Indexes**: `(package_id, classification_code)` unique composite; `(status)` for queue filtering; `(take_up_deadline)` for urgency sorting

#### EntryRecordStatusEnum

```php
enum EntryRecordStatusEnum: string
{
    case PENDING_INTENT = 'pending_intent';     // Intent captured at POS, waiting for SA allocation
    case QUEUED = 'queued';                     // SA allocated, awaiting coordinator consent
    case ACTIVATED = 'activated';               // Consent confirmed, transitioning to ACER pending
    case ACER_PENDING = 'acer_pending';         // In Finance ACER lodgement queue
    case ACER_LODGED = 'acer_lodged';           // ACER lodged in PRODA, awaiting SA budget
    case FUNDING_AVAILABLE = 'funding_available'; // SA has allocated budget
    case ACTIVE = 'active';                     // Services commenced
    case DEFERRED = 'deferred';                 // Client declined/timing not right
    case EXPIRED = 'expired';                   // Take-up deadline passed while deferred
    case WITHDRAWN = 'withdrawn';               // SA withdrew funding
    case COMPLETED = 'completed';               // Funding period ended
}
```

#### Relationships

```
Package (1) ---> (M) EntryRecord
PackageAllocation (1) ---> (1) EntryRecord
EntryRecord (1) ---> (M) Funding
User (care_partner) (1) ---> (M) EntryRecord
User (consent_confirmed_by) (1) ---> (M) EntryRecord
```

### API Contracts

#### Entry Queue Page

| Method | Route | Action | Description |
|--------|-------|--------|-------------|
| `GET` | `/entries` | `EntryController@index` | Queue page with tabbed filtering |
| `GET` | `/entries/{entryRecord}` | `EntryController@show` | Entry detail view |

#### Entry Actions

| Method | Route | Action | Description |
|--------|-------|--------|-------------|
| `POST` | `/entries/{entryRecord}/activate` | `ActivateEntryAction@asController` | Activate a queued entry (consent + care partner) |
| `POST` | `/entries/{entryRecord}/defer` | `DeferEntryAction@asController` | Defer entry activation |
| `POST` | `/entries/{entryRecord}/lodge` | `LodgeAcerAction@asController` | Record ACER lodgement |
| `POST` | `/entries/{entryRecord}/promote` | `PromoteEntryAction@asController` | Promote PendingIntent -> Queued (after SA allocates) |

#### Data Classes

**ActivateEntryData**:
```php
#[TypeScript]
#[MapName(SnakeCaseMapper::class)]
class ActivateEntryData extends Data
{
    public function __construct(
        #[Rule('required', 'date', 'before_or_equal:take_up_deadline')]
        public string $commencementDate,

        #[Rule('nullable', 'exists:users,id')]
        public ?int $carePartnerId = null,

        #[Rule('nullable', 'string', 'max:500')]
        public ?string $notes = null,
    ) {}
}
```

**DeferEntryData**:
```php
#[TypeScript]
#[MapName(SnakeCaseMapper::class)]
class DeferEntryData extends Data
{
    public function __construct(
        #[Rule('required', 'string', 'max:1000')]
        public string $reason,

        #[Rule('nullable', 'date')]
        public ?string $reminderDate = null,
    ) {}
}
```

**LodgeAcerData**:
```php
#[TypeScript]
#[MapName(SnakeCaseMapper::class)]
class LodgeAcerData extends Data
{
    public function __construct(
        #[Rule('required', 'date')]
        public string $lodgementDate,

        #[Rule('required', 'date', 'before_or_equal:take_up_deadline')]
        public string $commencementDate,
    ) {}
}
```

### UI Components

#### Entries/Index.vue (Queue Page)

```markdown
### Entries/Index.vue
- Props: `defineProps<Props>()` with named type:
  - `entries: Table<App.Data.Entry.EntryRecordData>` (table resource)
  - `metrics: EntryMetrics` (tab counts)
  - `features: Record<string, boolean>` (feature flags)
- Emits: none (page-level, no parent)
- Key types: `EntryMetrics = { new_count: number; acer_pending_count: number; lodged_count: number; total_count: number }`
- Common components reused: CommonContent, CommonHeader, CommonCard, CommonTable, CommonBadge, CommonTabs, CommonButton
- Tab structure: "New / Awaiting Consent" | "ACER Pending" | "Lodged" | "All"
- Tab filtering via query param: `?tab=new|acer_pending|lodged|all`
```

#### ActivateEntryModal.vue

```markdown
### ActivateEntryModal.vue
- Props: `defineProps<Props>()` with named type:
  - `entryRecord: App.Data.Entry.EntryRecordData`
  - `carePartners: App.Data.User.UserData[]` (for RC/EOL care partner selection)
  - `isVisible: boolean`
- Emits: `defineEmits<Emits>()` with named type:
  - `(e: 'update:isVisible', value: boolean): void`
- Key types: none new (uses generated types)
- Common components reused: CommonModal, CommonForm, CommonFormField, CommonInput (date), CommonSelectMenu, CommonAlert, CommonButton
- Form state: `useForm` with fields: commencement_date, care_partner_id, notes
- Validation: Commencement date <= take_up_deadline (client-side + server-side)
- Warnings: CommonAlert for management model change (RC/EOL), once-in-a-lifetime (EOL/HM)
```

#### DeferEntryModal.vue

```markdown
### DeferEntryModal.vue
- Props: `defineProps<Props>()` with named type:
  - `entryRecord: App.Data.Entry.EntryRecordData`
  - `isVisible: boolean`
- Emits: `defineEmits<Emits>()` with named type:
  - `(e: 'update:isVisible', value: boolean): void`
- Common components reused: CommonModal, CommonForm, CommonFormField, CommonInput, CommonButton
- Form state: `useForm` with fields: reason, reminder_date
```

#### LodgeAcerModal.vue

```markdown
### LodgeAcerModal.vue
- Props: `defineProps<Props>()` with named type:
  - `entryRecord: App.Data.Entry.EntryRecordData`
  - `isVisible: boolean`
- Emits: `defineEmits<Emits>()` with named type:
  - `(e: 'update:isVisible', value: boolean): void`
- Common components reused: CommonModal, CommonForm, CommonFormField, CommonInput (date), CommonAlert, CommonButton
- Form state: `useForm` with fields: lodgement_date, commencement_date
- Validation: Commencement date <= take_up_deadline; warn first 7 days of quarter
```

---

## Project Structure

### Documentation (this epic)

```text
.tc-docs/content/initiatives/Clinical-And-Care-Plan/Multi-Package-Support/
├── IDEA-BRIEF.md           # Idea brief
├── spec.md                 # Feature specification
├── design.md               # Design brief (to be filled)
├── plan.md                 # This file
├── data-model.md           # Entity definitions and relationships
├── contracts/              # API schemas
│   └── entries.md          # Entry endpoints
├── tasks.md                # Implementation tasks (from /speckit-tasks)
└── context/                # Raw context files
```

### Source Code (repository root)

```text
# Backend (new files)
domain/Entry/
├── Models/
│   └── EntryRecord.php
├── Enums/
│   └── EntryRecordStatusEnum.php
├── Data/
│   ├── EntryRecordData.php
│   ├── ActivateEntryData.php
│   ├── DeferEntryData.php
│   └── LodgeAcerData.php
├── Actions/
│   ├── CreateEntryRecordAction.php
│   ├── ActivateEntryAction.php
│   ├── DeferEntryAction.php
│   ├── LodgeAcerAction.php
│   └── PromoteEntryAction.php
├── Policies/
│   └── EntryRecordPolicy.php
├── Notifications/
│   ├── NewClassificationDetectedNotification.php
│   ├── FundingWithdrawnNotification.php
│   ├── TakeUpDeadlineApproachingNotification.php
│   └── PendingIntentAllocatedNotification.php
└── Http/
    └── Controllers/
        └── EntryController.php

# Backend (modified files)
domain/Package/Feature/PackageSync/Actions/
└── SyncEntryRecords.php                          # New pipe in sync pipeline

domain/Package/Feature/PackageSync/Actions/
└── SyncPackageFromServicesAustralia.php           # Modified: add SyncEntryRecords to pipeline

app/Tables/
└── EntriesTable.php                              # Table definition for /entries page

app/Services/Sidebar/
└── StaffSidebarService.php                       # Modified: add Entries nav item

app/Providers/
└── AuthServiceProvider.php                       # Modified: register EntryRecordPolicy

config/
└── support-at-home.php                           # Modified: add entry record config (zero-funding codes, deadline buffer days)

database/migrations/
└── xxxx_xx_xx_create_entry_records_table.php     # New migration

database/operations/
└── BackfillEntryRecordsFromAllocations.php       # Backfill existing allocations

# Frontend (new files)
resources/js/Pages/Entries/
├── Index.vue                                     # Queue page with tabs
└── Partials/
    ├── ActivateEntryModal.vue                    # Activation workflow modal
    ├── DeferEntryModal.vue                       # Deferral modal
    └── LodgeAcerModal.vue                        # ACER lodgement modal

# Frontend (modified files)
resources/js/Pages/Packages/tabs/
└── PackageOverview.vue                           # Modified: add funding streams section

# Routes
routes/web/
└── entry.php                                     # New route file for /entries

# Tests
tests/Feature/Entry/
├── CreateEntryRecordTest.php
├── ActivateEntryTest.php
├── DeferEntryTest.php
├── LodgeAcerTest.php
├── PromoteEntryTest.php
├── SyncEntryRecordsTest.php
└── EntryControllerTest.php

tests/Unit/Entry/
├── EntryRecordStatusEnumTest.php
└── EntryRecordTest.php
```

---

## Implementation Phases

### Phase 1: Foundation (Sprint 1)

**Goal**: EntryRecord model, migration, enum, data classes, and basic CRUD actions.

**Backend**:
1. Create migration `create_entry_records_table` with all columns and indexes
2. Create `EntryRecordStatusEnum` enum with all statuses
3. Create `EntryRecord` model with relationships (`BelongsTo<Package>`, `BelongsTo<PackageAllocation>`, `HasMany<Funding>`, `BelongsTo<User>` for care_partner and consent_confirmed_by), scopes (`scopeQueued`, `scopeAcerPending`, `scopeLodged`, `scopeUrgent`), and activity logging
4. Create `EntryRecordData` (with `#[TypeScript]`, `#[MapName(SnakeCaseMapper::class)]`)
5. Create `CreateEntryRecordAction` (with `AsAction`, `authorize()`, `handle()`)
6. Create `EntryRecordPolicy` with methods: `viewAny`, `view`, `activate`, `defer`, `lodge`, `promote`
7. Register policy in `AuthServiceProvider`
8. Create `EntryRecordFactory` for testing
9. Define Pennant feature flag: `multi-package-support`

**Tests**:
- Unit: Model relationships, enum values, scope queries
- Feature: CreateEntryRecordAction, EntryRecordPolicy authorization

### Phase 2: Sync Integration + Detection (Sprint 1-2)

**Goal**: Extend SA sync pipeline to auto-create EntryRecords from new PackageAllocations.

**Backend**:
1. Create `SyncEntryRecords` pipe — for each new `PackageAllocation` with `status: ALLOCATED` and `current_place_indicator: Y`, check if an EntryRecord exists for that `package_id + classification_code` combination; if not, create one in `Queued` status
2. Add `SyncEntryRecords` to the pipeline in `SyncPackageFromServicesAustralia` (after `SyncPackageAllocations`)
3. Exclude zero-funding classifications (AT code `55`, HM code `56`) per FR-004
4. Create `NewClassificationDetectedNotification` — sent to assigned Care Coordinator
5. Create `FundingWithdrawnNotification` — sent when allocation status changes to withdrawn
6. Create `TakeUpDeadlineApproachingNotification` — scheduled job checks entries with take_up_deadline within 14 days and ACER not lodged
7. Create backfill operation `BackfillEntryRecordsFromAllocations` — creates EntryRecords from existing PackageAllocations that don't have a matching entry

**Tests**:
- Feature: SyncEntryRecords pipe with various allocation scenarios (new, duplicate, zero-funding, withdrawn)
- Feature: Notification dispatch on sync detection
- Feature: Backfill operation correctness

### Phase 3: Queue Page + Activation Workflow (Sprint 2-3)

**Goal**: `/entries` page with tabbed queue, activation/deferral modals, ACER lodgement recording.

**Backend**:
1. Create `EntriesTable` extending `BaseTable` with:
   - Columns: client name, classification, status (badge), take-up deadline, commencement date, lodgement date, care coordinator
   - Filters: status tab filter, classification type, urgency (deadline < 14 days)
   - Sort: default by take_up_deadline ascending (most urgent first)
   - Scoped by tab: `new` (Queued + PendingIntent), `acer_pending` (ACERPending), `lodged` (ACERLodged + FundingAvailable + Active), `all`
2. Create `EntryController` with `index` (renders Entries/Index with table + metrics), `show`
3. Create `ActivateEntryAction` — validates consent, sets commencement_date, assigns care_partner (if RC/EOL), transitions status `Queued -> Activated -> ACERPending`
4. Create `ActivateEntryData` with validation rules (commencement_date <= take_up_deadline, care_partner required for RC/EOL)
5. Create `DeferEntryAction` — sets deferred_reason, transitions `Queued -> Deferred`
6. Create `DeferEntryData` with validation
7. Create `LodgeAcerAction` — records lodgement_date + commencement_date, transitions `ACERPending -> ACERLodged`
8. Create `LodgeAcerData` with validation (commencement_date <= take_up_deadline, warn first 7 days of quarter)
9. Create `PromoteEntryAction` — transitions `PendingIntent -> Queued` when SA allocates and coordinator confirms
10. Create routes in `routes/web/entry.php`
11. Add sidebar nav item in `StaffSidebarService` (gated by `multi-package-support` feature flag)

**Frontend**:
1. Create `Entries/Index.vue` — page with `CommonTabs` for tab switching, `CommonTable` for entries, metrics summary, action buttons
2. Create `ActivateEntryModal.vue` — `CommonModal` with `useForm`, commencement date input, care partner selector (for RC/EOL), management model warning
3. Create `DeferEntryModal.vue` — `CommonModal` with `useForm`, reason textarea, reminder date
4. Create `LodgeAcerModal.vue` — `CommonModal` with `useForm`, lodgement date, commencement date, quarter-start warning

**Tests**:
- Feature: EntryController index (table rendering, tab filtering, authorization)
- Feature: ActivateEntryAction (consent capture, RC/EOL care partner requirement, date validation)
- Feature: DeferEntryAction (reason required, status transition)
- Feature: LodgeAcerAction (date validation, quarter-start warning)
- Feature: PromoteEntryAction (PendingIntent -> Queued transition)
- Browser: Queue page loads with correct tabs; activation modal flow; ACER lodgement flow

### Phase 4: Package View + Notifications + Polish (Sprint 3-4)

**Goal**: Multi-stream display on package page, notification system, edge cases.

**Backend**:
1. Add `entryRecords` eager loading to Package show controller
2. Create `PendingIntentAllocatedNotification` — sent when a PendingIntent entry's classification becomes allocated at SA
3. Create scheduled command `CheckTakeUpDeadlines` — runs daily, sends `TakeUpDeadlineApproachingNotification` for entries where deadline is within 14 days
4. Handle classification level changes and offer type changes in sync pipeline (update entry, send notification per FR-020)
5. Handle EOL dormancy logic (FR-022, FR-023) — when EOL entry is activated, mark ongoing package as Dormant
6. Handle withdrawal detection — when sync detects allocation status changed to withdrawn, update EntryRecord status and send notification

**Frontend**:
1. Update `PackageOverview.vue` — add "Entry Records" section showing all streams with lifecycle status badges, care partner, dates
2. Add urgency indicators (CommonBadge with red for < 14 days to deadline)
3. Add withdrawal display with reason and date

**Tests**:
- Feature: Package view with multiple entry records
- Feature: Deadline notification scheduling
- Feature: Withdrawal detection and notification
- Feature: EOL dormancy workflow
- Browser: Package page shows all funding streams with correct statuses

---

## Testing Strategy

### Test Coverage by Phase

**Phase 1: Foundation Tests**
- Unit: EntryRecord model relationships, EntryRecordStatusEnum values and transitions, scope queries
- Feature: CreateEntryRecordAction authorization and execution, EntryRecordPolicy per role

**Phase 2: Sync + Detection Tests**
- Feature: SyncEntryRecords pipe (new allocation, duplicate skip, zero-funding exclusion, withdrawal)
- Feature: Notification dispatch (correct recipient, correct channel)
- Feature: Backfill operation (existing allocations get EntryRecords)

**Phase 3: Queue + Workflow Tests**
- Feature: EntryController authorization per role, tab filtering, search
- Feature: ActivateEntryAction (happy path, RC care partner required, date validation failure, expired deadline)
- Feature: DeferEntryAction (happy path, re-activation from deferred)
- Feature: LodgeAcerAction (happy path, date after deadline blocked, quarter-start warning)
- Browser: Full queue page flow — view entries, activate, defer, lodge ACER

**Phase 4: Package View + Polish Tests**
- Feature: Package overview with entry records
- Feature: Deadline checking scheduled command
- Feature: Withdrawal sync detection
- Feature: EOL dormancy lifecycle
- Browser: Package page multi-stream display

### Test Tools & Location

```
tests/Unit/Entry/Models/EntryRecordTest.php
tests/Unit/Entry/Enums/EntryRecordStatusEnumTest.php
tests/Feature/Entry/Actions/CreateEntryRecordTest.php
tests/Feature/Entry/Actions/ActivateEntryTest.php
tests/Feature/Entry/Actions/DeferEntryTest.php
tests/Feature/Entry/Actions/LodgeAcerTest.php
tests/Feature/Entry/Actions/PromoteEntryTest.php
tests/Feature/Entry/Actions/SyncEntryRecordsTest.php
tests/Feature/Entry/Http/EntryControllerTest.php
tests/Feature/Entry/Notifications/EntryNotificationTest.php
tests/Feature/Entry/Operations/BackfillEntryRecordsTest.php
tests/Browser/Entry/EntryQueueTest.php
tests/Browser/Entry/EntryActivationTest.php
```

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Backfill migration creates incorrect EntryRecords for historical data | Medium | High | Run backfill in staging first; validate against known client data; include dry-run mode |
| Sync pipeline ordering — SyncEntryRecords runs before allocations are persisted | Low | High | SyncEntryRecords placed AFTER SyncPackageAllocations in pipeline; integration test validates ordering |
| LTH Step 2 integration timing — LTH epic may not be ready when MPS ships | Medium | Medium | MPS works standalone (sync detection path); LTH integration (POS intent capture) is additive |
| Take-up deadline data quality — SA API may have null/incorrect deadlines | Medium | Medium | Nullable take_up_deadline column; UI shows "No deadline" when null; validation skipped when no deadline |
| Feature flag rollout — partial rollout confuses users who see some streams but not others | Low | Medium | Feature flag is all-or-nothing per environment (not per-user); clear communication to staff |
| EOL dormancy logic — existing billing relies on active package status | Medium | High | Dormancy is a new status (not termination); billing queries updated to treat Dormant as "paused but valid" |

---

## Next Steps

1. Run `/speckit-tasks` to generate tasks.md
2. Run `/trilogy-linear-sync push docs` to sync to Linear
3. Run `/speckit-implement` to start development
