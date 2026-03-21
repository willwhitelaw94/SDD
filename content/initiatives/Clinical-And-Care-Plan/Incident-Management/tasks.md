---
title: "Implementation Tasks: Incident Management Portal Migration"
---

# Implementation Tasks: Incident Management Portal Migration

**Plan**: [plan.md](plan.md) | **Spec**: [spec.md](spec.md) | **Generated**: 2026-02-24
**Mode**: AI (agent-executable)
**Total Tasks**: 68 | **Parallel Opportunities**: 22 tasks marked `[P]`

---

## Phase 1A: Data Foundation

> Migrations, enums, models, data classes, event sourcing infrastructure, policy, permissions, feature flag, factory.
> All Phase 1B–1D tasks depend on 1A completion.

### Migrations

- [ ] T001 Migration: Add V2 columns to `incidents` table. Add columns: `harm_tier` string(20) nullable, `source` string(10) default 'portal', `lifecycle_stage` string(20) nullable, `sirs_priority` string(10) nullable, `sirs_deadline` datetime nullable, `sirs_reported_date` date nullable, `sirs_reported_by` unsignedBigInteger nullable (FK users), `intake_harm_tier` string(20) nullable, `intake_classification` string(20) nullable, `reporter_relationship` string(50) nullable, `location` string(255) nullable, `care_context` string(100) nullable, `incident_date` date nullable, `incident_time` time nullable, `trend_happened_before` boolean default false, `trend_details` text nullable, `trend_is_pattern` boolean default false, `trend_pattern_details` text nullable, `escalation_who` string(255) nullable, `escalation_date` datetime nullable, `escalation_outcome` text nullable, `followup_plan` text nullable, `followup_care_plan_update` boolean default false, `disclosure_status` string(20) nullable, `disclosure_date` date nullable, `disclosure_method` string(100) nullable, `disclosure_feedback` text nullable, `lifecycle_skip_justification` text nullable, `legacy_cat_value` string(10) nullable, `public_reporter_name` string(255) nullable, `public_reporter_email` string(255) nullable, `public_reporter_phone` string(50) nullable, `review_decision` string(20) nullable, `review_reason` text nullable, `reviewed_by` unsignedBigInteger nullable (FK users), `reviewed_at` datetime nullable. File: `database/migrations/xxxx_add_v2_columns_to_incidents_table.php`

- [ ] T002 [P] Migration: Create `incident_actions` table. Columns: `id` bigIncrements, `label` string(100), `timestamps`. File: `database/migrations/xxxx_create_incident_actions_table.php`

- [ ] T003 [P] Migration: Create `incident_incident_action` pivot table. Columns: `incident_id` FK → incidents (cascade delete), `action_id` FK → incident_actions (cascade delete). No primary key, add composite unique index on (incident_id, action_id). File: `database/migrations/xxxx_create_incident_incident_action_table.php`

- [ ] T004 [P] Migration: Create `incident_stored_events` table. Use Spatie Event Sourcing's `create_stored_events_table` helper but target table name `incident_stored_events`. Follow pattern from existing custom stored event tables (e.g. `personal_context_stored_events`). File: `database/migrations/xxxx_create_incident_stored_events_table.php`

### Enums

- [ ] T005 [P] Enum: `HarmTierEnum` — cases: `SEVERE = 'severe'`, `MODERATE = 'moderate'`, `LOW = 'low'`, `CLINICAL_NOTIFICATION = 'clinical_notification'`. Add `label()`, `colour()` (red/orange/yellow/gray), `timeframe()` (returns human-readable timeframe string), `icon()` methods. File: `domain/Incident/Enums/HarmTierEnum.php`

- [ ] T006 [P] Enum: `LifecycleStageEnum` — cases: `PENDING_REVIEW = 'pending_review'`, `REJECTED = 'rejected'`, `REPORTED = 'reported'`, `TRIAGED = 'triaged'`, `ESCALATED = 'escalated'`, `ACTIONED = 'actioned'`, `DISCLOSED = 'disclosed'`, `RESOLVED = 'resolved'`. Add `label()`, `colour()`, `canTransitionTo(self $target): bool` (encode valid transitions per spec stateDiagram), `isTerminal(): bool` (true for REJECTED, RESOLVED), `canBeSkipped(): bool` (true for ESCALATED, DISCLOSED). File: `domain/Incident/Enums/LifecycleStageEnum.php`

- [ ] T007 [P] Enum: `SirsPriorityEnum` — cases: `P1 = 'p1'`, `P2 = 'p2'`. Add `label()`, `deadlineHours(): int` (24 for P1, 720 for P2 i.e. 30 days). File: `domain/Incident/Enums/SirsPriorityEnum.php`

- [ ] T008 [P] Enum: `DisclosureStatusEnum` — cases: `YES = 'yes'`, `NO = 'no'`, `NOT_YET = 'not_yet'`. Add `label()`. File: `domain/Incident/Enums/DisclosureStatusEnum.php`

- [ ] T009 [P] Enum: `IncidentSourceEnum` — cases: `PORTAL = 'portal'`, `CRM = 'crm'`. Add `label()`. File: `domain/Incident/Enums/IncidentSourceEnum.php`

- [ ] T010 [P] Enum: `ReviewDecisionEnum` — cases: `ACCEPTED = 'accepted'`, `REJECTED = 'rejected'`, `PENDING = 'pending'`. Add `label()`. File: `domain/Incident/Enums/ReviewDecisionEnum.php`

### Model Updates

- [ ] T011 Update `Incident` model — add new casts: `harm_tier` → HarmTierEnum, `lifecycle_stage` → LifecycleStageEnum, `sirs_priority` → SirsPriorityEnum, `disclosure_status` → DisclosureStatusEnum, `source` → IncidentSourceEnum, `review_decision` → ReviewDecisionEnum, `sirs_deadline` → 'datetime', `sirs_reported_date` → 'date', `incident_date` → 'date', `escalation_date` → 'datetime', `disclosure_date` → 'date', `reviewed_at` → 'datetime', `trend_happened_before` → 'boolean', `trend_is_pattern` → 'boolean', `followup_care_plan_update` → 'boolean'. Add to `$fillable`: all new columns from T001. Add relationships: `actions(): BelongsToMany<IncidentAction>` (pivot `incident_incident_action`), `sirsReportedBy(): BelongsTo<User>`, `reviewedBy(): BelongsTo<User>`. Add accessors: `isSirs(): Attribute` (returns `$this->classification === IncidentClassificationEnum::SIRS`), `isSirsOverdue(): Attribute` (checks `sirs_deadline < now() && !sirs_reported_date`), `isSirsApproaching(): Attribute` (P1: <4h remaining, P2: <3 days remaining). Add scopes: `scopeByHarmTier(Builder, HarmTierEnum)`, `scopeByLifecycleStage(Builder, LifecycleStageEnum)`, `scopeSirsOnly(Builder)`, `scopePendingReview(Builder)`. Depends on: T001, T005–T010. File: `domain/Incident/Models/Incident.php`

- [ ] T012 Model: Create `IncidentAction` — `$fillable = ['label']`, `timestamps = true`, relationship: `incidents(): BelongsToMany<Incident>` (pivot `incident_incident_action`). File: `domain/Incident/Models/IncidentAction.php`. Depends on: T002, T003.

### Data Classes

- [ ] T013 Data: `CreateIncidentData` — properties: `packageId` (int, required), `description` (string, required), `harmTier` (HarmTierEnum, required), `classification` (IncidentClassificationEnum, required), `origin` (IncidentOriginEnum, required), `incidentDate` (Carbon, required), `incidentTime` (?string), `location` (?string), `careContext` (?string), `reporterRelationship` (?string), `outcomeIds` (array of int), `actionIds` (array of int), `trendHappenedBefore` (bool), `trendDetails` (?string), `trendIsPattern` (bool), `trendPatternDetails` (?string), `escalationWho` (?string), `escalationDate` (?Carbon), `escalationOutcome` (?string), `followupPlan` (?string), `followupCarePlanUpdate` (bool), `disclosureStatus` (?DisclosureStatusEnum), `disclosureDate` (?Carbon), `disclosureMethod` (?string), `disclosureFeedback` (?string). Use `#[MapName(SnakeCaseMapper::class)]`. Validation: `packageId` exists in packages, `harmTier` required, `classification` required, `description` required min:10, `incidentDate` required date before_or_equal:today. File: `domain/Incident/Data/CreateIncidentData.php`. Depends on: T005–T010.

- [ ] T014 [P] Data: `UpdateIncidentData` — same fields as CreateIncidentData but all optional except `description` and `harmTier`. Add `resolution` (?IncidentResolutionEnum), `solution` (?string). Validation: if `lifecycleStage` is RESOLVED then `resolution` required and `solution` required. Use `#[MapName(SnakeCaseMapper::class)]`. File: `domain/Incident/Data/UpdateIncidentData.php`

- [ ] T015 [P] Data: `ReviewIncidentData` — properties: `decision` (ReviewDecisionEnum, required), `reason` (?string, required_if decision=rejected), `packageId` (?int, required_if decision=accepted, exists:packages). Use `#[MapName(SnakeCaseMapper::class)]`. File: `domain/Incident/Data/ReviewIncidentData.php`

- [ ] T016 [P] Data: `AssignSirsPriorityData` — properties: `priority` (SirsPriorityEnum, required). Use `#[MapName(SnakeCaseMapper::class)]`. File: `domain/Incident/Data/AssignSirsPriorityData.php`

- [ ] T017 [P] Data: `PublicIncidentData` — properties: same as CreateIncidentData minus `packageId`, plus `reporterName` (string, required), `reporterEmail` (string, required, email), `reporterPhone` (?string), `recipientName` (string, required), `recipientDob` (?Carbon), `recipientSahId` (?string). Use `#[MapName(SnakeCaseMapper::class)]`. File: `domain/Incident/Data/PublicIncidentData.php`

### Event Sourcing

- [ ] T018 StoredEvent: `IncidentStoredEvent` extending `EloquentStoredEvent`. Set `$table = 'incident_stored_events'`. File: `domain/Incident/EventSourcing/StoredEvents/IncidentStoredEvent.php`. Depends on: T004.

- [ ] T019 Repository: `IncidentEventRepository` — configure stored event model to `IncidentStoredEvent::class`. Follow existing pattern from other domain repositories (e.g. Bill, Supplier). File: `domain/Incident/EventSourcing/Repositories/IncidentEventRepository.php`. Depends on: T018.

- [ ] T020 Events: Create all 9 event classes, each implementing `ShouldBeStored`. Each event stores relevant data as public properties. `IncidentCreated` (all create fields + `actingUserId`), `IncidentUpdated` (changed fields + `actingUserId`), `IncidentStageAdvanced` (fromStage, toStage, actingUserId), `IncidentStageSkipped` (fromStage, toStage, justification, actingUserId), `IncidentSirsPriorityAssigned` (priority, deadline, actingUserId), `IncidentSirsReported` (reportedDate, actingUserId), `IncidentPublicSubmitted` (all public form fields), `IncidentReviewed` (decision, reason, packageId, actingUserId), `IncidentDeleted` (actingUserId). Files: `domain/Incident/EventSourcing/Events/Incident{EventName}.php` (9 files). Depends on: T018.

- [ ] T021 AggregateRoot: `IncidentAggregateRoot` — extends `AggregateRoot`. Methods: `createIncident(CreateIncidentData, int $userId)` records `IncidentCreated`, `updateIncident(UpdateIncidentData, int $userId)` records `IncidentUpdated`, `advanceStage(LifecycleStageEnum $to, int $userId)` validates transition via `canTransitionTo()` then records `IncidentStageAdvanced`, `skipStage(LifecycleStageEnum $to, string $justification, int $userId)` validates `canBeSkipped()` then records `IncidentStageSkipped`, `assignSirsPriority(SirsPriorityEnum $priority, int $userId)` calculates deadline then records `IncidentSirsPriorityAssigned`, `markSirsReported(Carbon $date, int $userId)` records `IncidentSirsReported`, `submitPublic(PublicIncidentData)` records `IncidentPublicSubmitted`, `review(ReviewIncidentData, int $userId)` records `IncidentReviewed`, `delete(int $userId)` guards against SIRS then records `IncidentDeleted`. Set `$repository` to `IncidentEventRepository::class`. File: `domain/Incident/EventSourcing/Aggregates/IncidentAggregateRoot.php`. Depends on: T019, T020, T006, T007, T013, T014, T015, T016, T017.

- [ ] T022 Projector: `IncidentProjector` — extends `Projector`. Handles all 9 events. `onIncidentCreated`: creates Incident model, sets `intake_harm_tier` + `intake_classification` snapshot, attaches outcomes + actions, sets `lifecycle_stage` to REPORTED, sets `source` to PORTAL. `onIncidentUpdated`: updates Incident fillable fields, syncs outcomes + actions. `onIncidentStageAdvanced` / `onIncidentStageSkipped`: updates `lifecycle_stage`, sets `lifecycle_skip_justification` on skip. `onIncidentSirsPriorityAssigned`: sets `sirs_priority` + `sirs_deadline`. `onIncidentSirsReported`: sets `sirs_reported_date` + `sirs_reported_by`. `onIncidentPublicSubmitted`: creates Incident with `lifecycle_stage` PENDING_REVIEW, `source` PORTAL, sets `public_reporter_*` fields. `onIncidentReviewed`: sets `review_decision`, `review_reason`, `reviewed_by`, `reviewed_at`; if accepted, sets `lifecycle_stage` to REPORTED and `package_id`. `onIncidentDeleted`: calls `$incident->delete()` (soft). File: `domain/Incident/EventSourcing/Projectors/IncidentProjector.php`. Depends on: T011, T020.

### Policy & Permissions

- [ ] T023 Create permissions migration: Add permissions `create-incidents`, `edit-incidents`, `delete-incidents`, `manage-sirs`, `review-incidents` to `config/permissions/user-permission-list.php`. Associate `create-incidents` and `edit-incidents` with Care Partner/Coordinator roles. Associate `manage-sirs` and `review-incidents` with Clinical roles. File: `config/permissions/user-permission-list.php` + new operation file `operations/xxxx_sync_incident_permissions.php`.

- [ ] T024 Policy: `IncidentPolicy` — methods: `viewAny(User)` checks `view-incidents`, `view(User, Incident)` checks `view-incidents` + user has access to incident's package, `create(User)` checks `create-incidents`, `update(User, Incident)` checks `edit-incidents` + user has access to incident's package + incident not terminal (RESOLVED/REJECTED), `delete(User, Incident)` checks `delete-incidents` + incident is NOT SIRS (`classification !== SIRS`), `manageSirs(User)` checks `manage-sirs`, `review(User)` checks `review-incidents`. Register in `AuthServiceProvider`. File: `domain/Incident/Policies/IncidentPolicy.php`. Depends on: T023, T011.

### Feature Flag

- [ ] T025 [P] Feature flag: Create `IncidentManagement` Pennant feature class. Resolve per-organisation using PostHog `incident-management` flag. Follow existing Pennant feature patterns in the codebase. File: `app/Features/IncidentManagement.php`

### Factory & Seeder

- [ ] T026 Extend `IncidentFactory` — add V2 fields to `definition()`: `harm_tier` random HarmTierEnum, `source` IncidentSourceEnum::PORTAL, `lifecycle_stage` random LifecycleStageEnum (exclude PENDING_REVIEW, REJECTED), `incident_date` faker date, `location` faker address, `care_context` faker randomElement(['Home', 'Community', 'Facility']), `reporter_relationship` faker randomElement, `disclosure_status` random DisclosureStatusEnum, trend fields as false defaults. Add states: `severe()`, `moderate()`, `low()`, `clinicalNotification()`, `sirs()` (sets classification=SIRS + sirs_priority=P1 + sirs_deadline), `pendingReview()` (sets lifecycle_stage=PENDING_REVIEW + public reporter fields), `fromCrm()` (sets source=CRM + legacy_cat_value). File: `domain/Incident/Factories/IncidentFactory.php`. Depends on: T011.

- [ ] T027 [P] Seeder: Create `IncidentActionSeeder` — seeds the `incident_actions` table with V2 checklist values: 'First aid administered', 'Called 000 (ambulance)', 'Called 000 (police)', 'Called 000 (fire)', 'Contacted registered supporter', 'Removed hazard', 'Secured area', 'Provided emotional support', 'Contacted GP', 'Contacted hospital', 'Implemented care plan change', 'Other'. File: `domain/Incident/Seeders/IncidentActionSeeder.php`. Depends on: T012.

### Foundation Tests

- [ ] T028 Tests: Unit tests for all 6 new enums — verify `label()`, `colour()`, `timeframe()` (HarmTierEnum), `canTransitionTo()` valid + invalid transitions (LifecycleStageEnum), `deadlineHours()` (SirsPriorityEnum), `canBeSkipped()` (LifecycleStageEnum). File: `tests/Unit/Incident/Enums/HarmTierEnumTest.php`, `tests/Unit/Incident/Enums/LifecycleStageEnumTest.php`, `tests/Unit/Incident/Enums/SirsPriorityEnumTest.php`, etc. Depends on: T005–T010.

- [ ] T029 Tests: Unit tests for data class validation — `CreateIncidentData` requires package_id, description (min 10), harm_tier, classification, incident_date. `UpdateIncidentData` requires resolution when stage=RESOLVED. `ReviewIncidentData` requires reason when decision=rejected, package_id when decision=accepted. `PublicIncidentData` requires reporter_name, reporter_email, recipient_name. Files: `tests/Unit/Incident/Data/CreateIncidentDataTest.php`, etc. Depends on: T013–T017.

- [ ] T030 Tests: Unit test for `IncidentPolicy` — test all 7 methods with authorized and unauthorized users. Verify SIRS incidents cannot be deleted. Verify terminal incidents cannot be updated. File: `tests/Unit/Incident/Policies/IncidentPolicyTest.php`. Depends on: T024.

- [ ] T031 Tests: Feature test for `IncidentAggregateRoot` — test `createIncident` records `IncidentCreated` event, `advanceStage` with valid transition records event, `advanceStage` with invalid transition throws exception, `skipStage` requires `canBeSkipped()`, `delete` on SIRS incident throws exception. Rebuild projector cache before running. File: `tests/Feature/Incident/EventSourcing/IncidentAggregateRootTest.php`. Depends on: T021, T022.

---

## Phase 1B: Create + Edit + Detail (CRUD)

> V2 intake wizard, detail view, edit page — the core user stories US1, US2, US3, US4.
> Depends on: Phase 1A complete.

### Actions (Backend)

- [ ] T032 Action: `CreateIncidentAction` — `AsAction`, invokable controller. Renders `Incidents/Create` page. Props: `package` (Package with recipient eager-loaded, for pre-fill), `harmTiers` (HarmTierEnum::cases()), `classifications` (IncidentClassificationEnum::cases()), `origins` (IncidentOriginEnum::cases()), `outcomes` (IncidentOutcomeEnum::cases()), `actions` (IncidentAction::all()), `disclosureStatuses` (DisclosureStatusEnum::cases()). Route: `GET /incidents/create?package={package}`. Authorize via `IncidentPolicy@create`. File: `domain/Incident/Actions/CreateIncidentAction.php`. Depends on: T024.

- [ ] T033 Action: `StoreIncidentAction` — `AsAction`, invokable controller. Accepts `CreateIncidentData` from request. Generates unique `ref` (ICM-YYYYMMDD-XXXX format). Creates incident via `IncidentAggregateRoot::retrieve($uuid)->createIncident($data, auth()->id())`. Redirects to `incidents.show` with success flash. Route: `POST /incidents`. Authorize via `IncidentPolicy@create`. File: `domain/Incident/Actions/StoreIncidentAction.php`. Depends on: T021, T024, T013.

- [ ] T034 Action: `ShowIncidentAction` — `AsAction`, invokable controller. Renders `Incidents/Show`. Props: `incident` (with outcomes, actions, package.recipient eager-loaded), `lifecycleStages` (LifecycleStageEnum::cases()), `canEdit` (bool from policy), `canManageSirs` (bool from policy), `canDelete` (bool from policy). Route: `GET /incidents/{incident}`. Authorize via `IncidentPolicy@view`. File: `domain/Incident/Actions/ShowIncidentAction.php`. Depends on: T024.

- [ ] T035 Update `EditIncidentAction` — currently renders `Incidents/Edit` but page is missing. Update to eager-load outcomes + actions + package.recipient. Add props: `incident`, `harmTiers`, `classifications`, `origins`, `outcomes`, `actions`, `disclosureStatuses`, `lifecycleStages`, `canManageSirs`. Authorize via `IncidentPolicy@update`. File: `domain/Incident/Actions/EditIncidentAction.php`. Depends on: T024.

- [ ] T036 Action: `UpdateIncidentAction` — `AsAction`, invokable controller. Accepts `UpdateIncidentData`. Updates via `IncidentAggregateRoot::retrieve($uuid)->updateIncident($data, auth()->id())`. Redirects to `incidents.show` with success flash. Route: `PUT /incidents/{incident}`. Authorize via `IncidentPolicy@update`. File: `domain/Incident/Actions/UpdateIncidentAction.php`. Depends on: T021, T024, T014.

- [ ] T037 Action: `AdvanceIncidentStageAction` — `AsAction`, invokable controller. Accepts `stage` (LifecycleStageEnum) + optional `justification` (string, required if skipping). Determine if advancing or skipping (check if target is the next sequential stage or not). Call `advanceStage()` or `skipStage()` on aggregate. If advancing to RESOLVED, validate resolution is present on incident. Redirect back with flash. Route: `POST /incidents/{incident}/advance`. Authorize via `IncidentPolicy@update`. File: `domain/Incident/Actions/AdvanceIncidentStageAction.php`. Depends on: T021, T024.

- [ ] T038 Action: `DeleteIncidentAction` — `AsAction`, invokable controller. Guards: SIRS incidents cannot be deleted (policy already checks, but double-guard in action). Calls `IncidentAggregateRoot::retrieve($uuid)->delete(auth()->id())`. Redirects to `incidents.index` with flash. Route: `DELETE /incidents/{incident}`. Authorize via `IncidentPolicy@delete`. File: `domain/Incident/Actions/DeleteIncidentAction.php`. Depends on: T021, T024.

### Routes

- [ ] T039 Routes: Add new routes to `domain/Incident/Routes/incidentRoutes.php`. Keep existing `GET /incidents` (ListIncidentsAction) and `GET /incidents/{incident}/edit` (EditIncidentAction). Add: `GET /incidents/create` (CreateIncidentAction), `POST /incidents` (StoreIncidentAction), `GET /incidents/{incident}` (ShowIncidentAction), `PUT /incidents/{incident}` (UpdateIncidentAction), `POST /incidents/{incident}/advance` (AdvanceIncidentStageAction), `DELETE /incidents/{incident}` (DeleteIncidentAction). All behind `web.authenticated` middleware. Named routes: `incidents.create`, `incidents.store`, `incidents.show`, `incidents.update`, `incidents.advance`, `incidents.destroy`. Note: `incidents.create` must be registered BEFORE `incidents.show` (wildcard `{incident}` catch). File: `domain/Incident/Routes/incidentRoutes.php`. Depends on: T032–T038.

### Vue Pages

- [ ] T040 Vue: `Incidents/Create.vue` — 5-step wizard using `CommonStepNavigation`. Steps: (1) Client & Incident — pre-filled client name/DOB/SAH ID via props, date/time/location/care context inputs, (2) What Happened — reporter relationship, free-text description (CommonTextarea min 10 chars), (3) Classification — HarmTierSelector component for harm tier + CommonRadioGroup for classification (Clinical/Non-clinical/SIRS), (4) Impact & Response — CommonCheckboxGroup for outcomes + CommonCheckboxGroup for actions (from props), trend section with conditional fields, (5) Escalation & Follow-up — escalation details, follow-up plan, disclosure section with conditional fields. Use `useForm()` from Inertia. Submit via `form.post(route('incidents.store'))`. Show validation errors per step. File: `resources/js/Pages/Incidents/Create.vue`. Depends on: T039, T042.

- [ ] T041 Vue: `Incidents/Show.vue` — detail page. Layout: `CommonContent` + `CommonHeader` with incident ref as title. Top section: `LifecycleStepper` component showing current stage with advance/skip buttons. `SirsDeadlineBadge` if SIRS. `CommonTabs` with tabs: Overview (CommonDefinitionList with key fields), Response (outcomes, actions, escalation, follow-up, disclosure), Audit Trail (event history from stored events). Action buttons: Edit (link to edit route), Delete (with confirmation modal, hidden for SIRS). SIRS section: assign priority button (if canManageSirs), mark reported button. File: `resources/js/Pages/Incidents/Show.vue`. Depends on: T039, T043, T044.

- [ ] T042 Vue Component: `HarmTierSelector.vue` — 4-card visual selector. Each card: colour-coded left border (red/orange/yellow/gray), tier name, plain-language description, timeframe text. Selected card has teal highlight ring. Emits `update:modelValue` with HarmTierEnum value. Props: `modelValue` (?string), `tiers` (array from backend). WCAG: includes text label + icon per tier, not colour alone. Uses `CommonCard` for each tier card. File: `resources/js/Components/Incidents/HarmTierSelector.vue`.

- [ ] T043 Vue Component: `LifecycleStepper.vue` — horizontal stage indicator. Props: `currentStage` (string), `stages` (array of LifecycleStageEnum values), `canAdvance` (bool), `canSkip` (bool). Shows all 6 main stages as circles connected by lines. Completed stages filled teal, current stage has ring, future stages gray. Skip button opens a CommonModal requiring justification text. Advance button progresses to next stage. Emits `advance` (stage) and `skip` (stage, justification). File: `resources/js/Components/Incidents/LifecycleStepper.vue`.

- [ ] T044 Vue Component: `SirsDeadlineBadge.vue` — countdown badge. Props: `deadline` (?string ISO datetime), `priority` (?string 'p1'|'p2'), `reportedDate` (?string). Logic: if `reportedDate` exists, show "Reported [date]" in green. If deadline is in the future, calculate time remaining and show countdown. Urgency: red if overdue, amber if approaching (P1: <4h, P2: <3 days), green otherwise. Uses `CommonBadge` with dynamic variant. File: `resources/js/Components/Incidents/SirsDeadlineBadge.vue`.

- [ ] T045 Vue: `Incidents/Edit.vue` — edit form. Same field layout as Create wizard but as a single-page form (not stepped — editing doesn't need wizard UX). Pre-filled with incident data from props. Uses `useForm()` with `form.put(route('incidents.update', incident.id))`. Show current lifecycle stage (read-only). If advancing to Resolved, require resolution fields. `CommonForm` wrapping `CommonFormField` inputs for each section. File: `resources/js/Pages/Incidents/Edit.vue`. Depends on: T039, T042.

### CRUD Tests

- [ ] T046 Tests: Feature test `CreateIncidentTest` — test authorized user can view create form, test unauthorized user gets 403, test valid submission creates incident + records event + redirects, test validation fails on missing required fields, test outcomes and actions are attached via pivot, test intake snapshot is captured (intake_harm_tier matches harm_tier at creation). File: `tests/Feature/Incident/Actions/CreateIncidentTest.php`. Depends on: T039, T032, T033.

- [ ] T047 Tests: Feature test `ShowIncidentTest` — test authorized user sees incident detail, test unauthorized user (no package access) gets 403, test all fields displayed (outcomes, actions, escalation, follow-up, disclosure). File: `tests/Feature/Incident/Actions/ShowIncidentTest.php`. Depends on: T039, T034.

- [ ] T048 Tests: Feature test `UpdateIncidentTest` — test authorized user can update fields, test audit trail event recorded, test resolution required when advancing to Resolved, test terminal incidents cannot be updated. File: `tests/Feature/Incident/Actions/UpdateIncidentTest.php`. Depends on: T039, T035, T036.

- [ ] T049 Tests: Feature test `AdvanceStageTest` — test valid stage transition succeeds, test invalid transition returns error, test skip requires justification, test skip records justification. File: `tests/Feature/Incident/Actions/AdvanceStageTest.php`. Depends on: T039, T037.

- [ ] T050 Tests: Feature test `DeleteIncidentTest` — test authorized user can soft-delete non-SIRS incident, test SIRS incident deletion is blocked (403 or validation error), test soft-deleted incident doesn't appear in lists. File: `tests/Feature/Incident/Actions/DeleteIncidentTest.php`. Depends on: T039, T038.

---

## Phase 1C: Lists + SIRS + Package Tab

> Enhanced lists, SIRS tracking, package integration — US2, US5, US6, US7, US8, US9.
> Depends on: Phase 1B complete.

### Table & List Enhancements

- [ ] T051 Update `IncidentTable` — add columns: `TextColumn::make('harm_tier')` with `BadgeColumn` rendering (colour-coded per tier), `TextColumn::make('lifecycle_stage')` with badge, `TextColumn::make('sirs_priority')` (show P1/P2 badge or empty), `DateColumn::make('sirs_deadline')` with conditional urgency styling (red if overdue, amber if approaching). Add filters: `SelectFilter::make('harm_tier')` with HarmTierEnum cases, `SelectFilter::make('lifecycle_stage')` with LifecycleStageEnum cases, `BooleanFilter::make('sirs_only')` using `scopeSirsOnly`, `DateRangeFilter::make('incident_date')`. Remove or deprecate `triage_category` column/filter. Keep `classification` filter. File: `domain/Incident/Tables/IncidentTable.php`. Depends on: T011.

- [ ] T052 Vue: Enhance `Incidents/Index.vue` — update to use enhanced table columns. Add SIRS urgency visual indicators (use `SirsDeadlineBadge` inline in table rows). Add summary stats at top: total incidents, open incidents count, SIRS overdue count. Wrap in feature flag check: if `incident-management` enabled, show "Report Incident" button linking to `incidents.create`. File: `resources/js/Pages/Incidents/Index.vue`. Depends on: T051, T044.

- [ ] T053 Vue: Enhance `PackageIncidents.vue` — add harm tier `CommonBadge` per incident row. Add lifecycle stage badge. Add empty state using `CommonEmptyPlaceholder` with "No incidents recorded" message and "Report Incident" CTA (link to `incidents.create?package={packageId}`). Wrap create CTA in feature flag check. File: `resources/js/Pages/Packages/tabs/PackageIncidents.vue`. Depends on: T051.

### SIRS Actions

- [ ] T054 Action: `AssignSirsPriorityAction` — `AsAction`, invokable controller. Accepts `AssignSirsPriorityData`. Validates incident classification is SIRS. Calls `IncidentAggregateRoot::retrieve($uuid)->assignSirsPriority($data->priority, auth()->id())`. Redirect back with flash. Route: `POST /incidents/{incident}/sirs`. Authorize via `IncidentPolicy@manageSirs`. File: `domain/Incident/Actions/AssignSirsPriorityAction.php`. Depends on: T021, T024, T016.

- [ ] T055 Action: `MarkSirsReportedAction` — `AsAction`, invokable controller. Accepts `reported_date` (date, required). Calls `IncidentAggregateRoot::retrieve($uuid)->markSirsReported(Carbon::parse($date), auth()->id())`. Redirect back with flash. Route: `POST /incidents/{incident}/sirs-reported`. Authorize via `IncidentPolicy@manageSirs`. File: `domain/Incident/Actions/MarkSirsReportedAction.php`. Depends on: T021, T024.

### SIRS Routes

- [ ] T056 Routes: Add SIRS routes to `incidentRoutes.php`. `POST /incidents/{incident}/sirs` (AssignSirsPriorityAction), `POST /incidents/{incident}/sirs-reported` (MarkSirsReportedAction). Named: `incidents.sirs.assign`, `incidents.sirs.reported`. Behind `web.authenticated` middleware. File: `domain/Incident/Routes/incidentRoutes.php`. Depends on: T054, T055.

### SIRS Tests

- [ ] T057 Tests: Feature test `SirsWorkflowTest` — test assign P1 sets 24h deadline from now, test assign P2 sets 30-day deadline, test non-SIRS incident cannot have priority assigned (validation error), test mark reported sets `sirs_reported_date` + removes urgency indicator, test SIRS deadline calculation accuracy. File: `tests/Feature/Incident/Actions/SirsWorkflowTest.php`. Depends on: T056.

- [ ] T058 Tests: Feature test `IncidentListFilterTest` — test filter by harm tier returns correct results, test filter by lifecycle stage, test filter by SIRS-only, test filter by date range, test default sort by severity. File: `tests/Feature/Incident/Actions/IncidentListFilterTest.php`. Depends on: T051.

---

## Phase 1D: Public Form + Migration + Feature Flag

> Public intake, CRM migration, feature flag wiring — US10, US11, US12.
> Depends on: Phase 1C complete (for list integration).

### Public Form

- [ ] T059 Action: `PublicIncidentFormAction` — `AsAction`, invokable controller. No authentication. Renders `Incidents/PublicForm`. Props: `harmTiers`, `classifications`, `origins`, `outcomes`, `actions` (IncidentAction::all()), `disclosureStatuses`. Route: `GET /report-incident`. No middleware (public). File: `domain/Incident/Actions/PublicIncidentFormAction.php`.

- [ ] T060 Action: `SubmitPublicIncidentAction` — `AsAction`, invokable controller. No authentication. Accepts `PublicIncidentData`. Rate limited: max 5 per IP per hour (use `RateLimiter` or `ThrottleRequests` middleware). CAPTCHA validation (use `recaptcha` or `turnstile` — check existing CAPTCHA usage in codebase). Creates incident via `IncidentAggregateRoot::retrieve($uuid)->submitPublic($data)`. Redirect to confirmation page with flash. Route: `POST /report-incident`. File: `domain/Incident/Actions/SubmitPublicIncidentAction.php`. Depends on: T021, T017.

- [ ] T061 Vue: `Incidents/PublicForm.vue` — standalone page, NO AppLayout (uses a minimal public layout or no layout). Same V2 form fields as Create.vue but without package pre-fill. Additional fields: reporter name, email, phone, client name, DOB, SAH ID (all manual entry). CAPTCHA widget before submit. Success state: confirmation message "Your incident report has been submitted and will be reviewed by our team." Uses `useForm()` with `form.post(route('report-incident.store'))`. File: `resources/js/Pages/Incidents/PublicForm.vue`. Depends on: T059, T042.

### Public Form Routes

- [ ] T062 Routes: Add public form routes. MUST be outside authenticated middleware group. `GET /report-incident` (PublicIncidentFormAction), `POST /report-incident` (SubmitPublicIncidentAction, with rate limiter middleware). Named: `report-incident.show`, `report-incident.store`. File: `domain/Incident/Routes/incidentRoutes.php`. Depends on: T059, T060.

### Pending Review

- [ ] T063 Action: `PendingReviewAction` — `AsAction`, invokable controller. Renders `Incidents/PendingReview`. Props: `incidents` (Incident::query()->pendingReview()->with('package.recipient')->paginate(25)). Route: `GET /incidents/pending-review`. Authorize via `IncidentPolicy@review`. File: `domain/Incident/Actions/PendingReviewAction.php`. Depends on: T024.

- [ ] T064 Action: `ReviewIncidentAction` — `AsAction`, invokable controller. Accepts `ReviewIncidentData`. Calls `IncidentAggregateRoot::retrieve($uuid)->review($data, auth()->id())`. If accepted: redirect to `incidents.show`. If rejected: redirect back with flash. Route: `POST /incidents/{incident}/review`. Authorize via `IncidentPolicy@review`. File: `domain/Incident/Actions/ReviewIncidentAction.php`. Depends on: T021, T024, T015.

- [ ] T065 Vue: `Incidents/PendingReview.vue` — review queue page. `CommonContent` + `CommonHeader` title "Pending Review". `CommonTable` showing public-submitted incidents: reporter name, date, recipient name, description preview, harm tier badge. Click to expand/view details. Accept button: opens modal to select package (CommonSelectMenu with search), confirm harm classification. Reject button: opens modal requiring reason text. File: `resources/js/Pages/Incidents/PendingReview.vue`. Depends on: T063.

- [ ] T066 Routes: Add pending review + review routes to `incidentRoutes.php`. `GET /incidents/pending-review` (PendingReviewAction), `POST /incidents/{incident}/review` (ReviewIncidentAction). Named: `incidents.pending-review`, `incidents.review`. Register `pending-review` BEFORE `{incident}` wildcard. File: `domain/Incident/Routes/incidentRoutes.php`. Depends on: T063, T064.

### CRM Migration

- [ ] T067 Command: `MigrateIncidentsFromCrmCommand` — Artisan command `incidents:migrate-from-crm`. Reads all incidents where `source` is null (CRM-synced via Zoho). For each: set `source = 'crm'`, map `triage_category` to `harm_tier` (CAT_1→SEVERE, CAT_2→MODERATE, CAT_3→LOW, CAT_4/CAT_5→CLINICAL_NOTIFICATION), preserve original in `legacy_cat_value`, map `stage` to nearest `lifecycle_stage` (NEW→REPORTED, PENDING→TRIAGED, ESCALATED→ESCALATED, RESOLVED→RESOLVED, INSUFFICIENT→REPORTED), set `incident_date` from `occurred_date` if null. Bulk update (no event sourcing for CRM records — direct Eloquent). Output progress bar + summary: migrated count, skipped count, error count. Log errors to `storage/logs/incident-migration.log`. Add `--dry-run` flag to preview without saving. File: `domain/Incident/Console/MigrateIncidentsFromCrmCommand.php`. Depends on: T011.

### Feature Flag Wiring

- [ ] T068 Feature flag wiring: In `CreateIncidentAction`, `EditIncidentAction`, `StoreIncidentAction`, `UpdateIncidentAction` — add feature flag check: `abort_unless(Feature::active(IncidentManagement::class), 403)`. In `Incidents/Index.vue` and `PackageIncidents.vue` — conditionally show "Report Incident" button based on `incidentManagementEnabled` prop passed from controllers. In `ListIncidentsAction` — add prop `incidentManagementEnabled: Feature::active(IncidentManagement::class)`. Files: all CRUD actions + `ListIncidentsAction` + Vue pages. Depends on: T025, T032–T036, T052, T053.

---

## Phase 1D Tests

- [ ] T069 Tests: Feature test `PublicFormTest` — test public form is accessible without auth, test valid submission creates pending-review incident, test rate limiting blocks after 5 submissions per hour, test CAPTCHA validation, test reporter details captured. File: `tests/Feature/Incident/Actions/PublicFormTest.php`. Depends on: T062.

- [ ] T070 Tests: Feature test `PendingReviewTest` — test review queue shows pending incidents, test accept links to package and moves to REPORTED, test reject records reason and sets REJECTED, test unauthorized user cannot access review queue. File: `tests/Feature/Incident/Actions/PendingReviewTest.php`. Depends on: T066.

- [ ] T071 Tests: Feature test `MigrateCrmIncidentsTest` — test CAT→harm tier mapping (CAT_1→SEVERE, CAT_2→MODERATE, CAT_3→LOW, CAT_4→CLINICAL_NOTIFICATION, CAT_5→CLINICAL_NOTIFICATION), test legacy_cat_value preserved, test stage→lifecycle_stage mapping, test dry-run doesn't modify data, test error logging for invalid records. File: `tests/Feature/Incident/Migration/MigrateCrmIncidentsTest.php`. Depends on: T067.

- [ ] T072 Tests: Feature test `FeatureFlagTest` — test with flag disabled: create/edit routes return 403, list shows incidents without create button. Test with flag enabled: full V2 capabilities available. Use Pennant test helpers to toggle flag. File: `tests/Feature/Incident/FeatureFlagTest.php`. Depends on: T068.

---

## Phase 1 Finalization

> Cross-cutting: rebuild cache, run pint, register projector, run full test suite.

- [ ] T073 Register `IncidentProjector` in `IncidentServiceProvider` — add to the `boot()` method. Also register the custom stored event table in the event sourcing config or service provider. After registration: delete `bootstrap/cache/event-handlers.php` and rebuild via `php artisan event-sourcing:cache-event-handlers`. File: `domain/Incident/Providers/IncidentServiceProvider.php`. Depends on: T022.

- [ ] T074 Run `vendor/bin/pint --dirty` on all new/modified files to ensure code style compliance. Fix any formatting issues.

- [ ] T075 Run full test suite: `php artisan test --compact tests/Unit/Incident tests/Feature/Incident` — verify all tests pass. Fix any failures.

---

## Summary

| Phase | Tasks | Parallel | Stories Covered |
|-------|-------|----------|-----------------|
| 1A: Foundation | T001–T031 | 14 `[P]` | Infrastructure |
| 1B: CRUD | T032–T050 | 0 (sequential deps) | US1, US2, US3, US4 |
| 1C: Lists + SIRS | T051–T058 | 0 | US5, US6, US7, US8, US9 |
| 1D: Public + Migration | T059–T072 | 0 | US10, US11, US12 |
| Finalization | T073–T075 | 0 | Cross-cutting |
| **Total** | **75** | **14** | **12 Phase 1 stories** |

**MVP scope (P1 stories only):** T001–T050 (Foundation + CRUD = 50 tasks)
**Full Phase 1:** T001–T075 (75 tasks)
