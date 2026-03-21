---
title: "Implementation Tasks: Feedback Records Management"
---

# Implementation Tasks: Feedback Records Management

**Mode**: AI Agent
**Spec**: [spec.md](/initiatives/Work-Management/Complaints-Management/spec)
**Plan**: [plan.md](/initiatives/Work-Management/Complaints-Management/plan)
**Generated**: 2026-02-27
**Total Tasks**: 72
**Parallel Opportunities**: 38 tasks marked [P]

---

## Phase 1 — Foundation (Migrations, Enums, Models)

Blocking for all stories. Must complete before any actions or pages.

- [ ] T001 Migration: `create_feedback_records_table` — all columns from plan.md Data Model section. Use `$table->string('type', 20)` (not enum), `$table->string('stage', 50)`, `$table->string('crm_sync_status', 20)->default('SYNCED')`, `$table->json('categories')->nullable()`, `$table->boolean('due_date_manually_set')->default(false)`. Indexes on: `package_id`, `type`, `stage`, `confidential`, `zoho_id`, `crm_sync_status`, `due_date`. FK constraints: `package_id → packages`, `incident_id → incidents nullable`, `parent_feedback_record_id → feedback_records nullable`, `accountable_person_id → users nullable`, `quality_support_lead_id → users nullable`, `escalation_point_id → users nullable`, `created_by → users`. SoftDeletes. File: `database/migrations/YYYY_MM_DD_HHMMSS_create_feedback_records_table.php`

- [ ] T002 Migration: `create_feedback_action_items_table` — columns: `id`, `feedback_record_id` (FK → feedback_records, cascadeOnDelete), `description` (text), `assigned_to` (string 255 nullable), `due_date` (date nullable), `is_complete` (boolean default false), `completed_at` (datetime nullable), `completed_by` (FK → users nullable), `zoho_id` (string 50 nullable), timestamps, softDeletes. File: `database/migrations/YYYY_MM_DD_HHMMSS_create_feedback_action_items_table.php`

- [ ] T003 [P] Enum: `FeedbackRecordTypeEnum` — string-backed. Cases: `COMPLAINT = 'Complaint'`, `REMEDIATION = 'Remediation'`. Traits: `FindsFromValue`, `HasToArray`. File: `domain/FeedbackRecord/Enums/FeedbackRecordTypeEnum.php`

- [ ] T004 [P] Enum: `ComplaintStageEnum` — string-backed. Cases: `NEW = '0. New'`, `AP_ASSIGNED = '1. Accountable Person Assigned'`, `AP_ACKNOWLEDGED = '2. Accountable Person Acknowledged'`, `OWNER_ACCEPTED = '3. Complaint Owner Accepted'`, `AWAITING_INFO_COMPLAINANT = '4a. Awaiting Info - Complainant'`, `AWAITING_INFO_STAFF = '4b. Awaiting Info - Staff'`, `AWAITING_INFO_EXTERNAL = '4c. Awaiting Info - External'`, `RESOLUTION_PROPOSED = '5. Resolution Proposed'`, `CLOSED_RESOLVED = '6a. Closed - Resolved'`, `CLOSED_UNRESOLVED = '6b. Closed - Unresolved'`, `CLOSED_ARCHIVED = '6c. Closed - Archived'`, `CLOSED_CONSOLIDATED = '6d. Closed - Consolidated'`. Add `isClosed(): bool` method returning true for 6a-6d. Traits: `FindsFromValue`, `HasToArray`. File: `domain/FeedbackRecord/Enums/ComplaintStageEnum.php`

- [ ] T005 [P] Enum: `RemediationStageEnum` — string-backed. Cases: `NEW = '0. New'`, `ISSUES_ASSIGNED = '1. Issues Assigned'`, `AWAITING_INFO_COMPLAINANT = '2a. Awaiting Info - Complainant'`, `AWAITING_INFO_STAFF = '2b. Awaiting Info - Staff'`, `AWAITING_INFO_EXTERNAL = '2c. Awaiting Info - External'`, `RESOLUTION_PROPOSED = '3. Resolution Proposed'`, `CLOSED_RESOLVED = '4a. Closed - Resolved'`, `CLOSED_UNRESOLVED = '4b. Closed - Unresolved'`, `CLOSED_ARCHIVED = '4c. Closed - Archived'`, `CLOSED_CONSOLIDATED = '4d. Closed - Consolidated'`, `CONVERTED_TO_COMPLAINT = '5. Converted to Complaint'`. Add `isClosed(): bool` method. Traits: `FindsFromValue`, `HasToArray`. File: `domain/FeedbackRecord/Enums/RemediationStageEnum.php`

- [ ] T006 [P] Enum: `FeedbackTriageCategoryEnum` — string-backed. Cases: `URGENT = 'Urgent'`, `MEDIUM = 'Medium'`, `STANDARD = 'Standard'`. Traits: `FindsFromValue`, `HasToArray`. File: `domain/FeedbackRecord/Enums/FeedbackTriageCategoryEnum.php`

- [ ] T007 [P] Enum: `FeedbackComplainantTypeEnum` — string-backed. Cases: `CLIENT_SELF = 'Client (Self)'`, `ANONYMOUS = 'Anonymous'`, `SUPPORTER = 'Supporter'`, `COORDINATOR = 'Coordinator'`, `SUPPLIER = 'Supplier'`, `OTHER = 'Other'`, `REGISTERED_REPRESENTATIVE = 'Registered Representative'`. Traits: `FindsFromValue`, `HasToArray`. File: `domain/FeedbackRecord/Enums/FeedbackComplainantTypeEnum.php`

- [ ] T008 [P] Enum: `FeedbackSourceEnum` — string-backed. Cases: `VERBAL_REPORT = 'Verbal Report'`, `EMAIL_REPORT = 'Email Report'`, `ORM_REPORT = 'ORM Report'`, `EXTERNAL_ESCALATION_TRIGGER = 'External Escalation Trigger'`, `ACQSC = 'ACQSC'`. Traits: `FindsFromValue`, `HasToArray`. File: `domain/FeedbackRecord/Enums/FeedbackSourceEnum.php`

- [ ] T009 [P] Enum: `FeedbackDepartmentEnum` — string-backed. Cases from CRM `Primary_Department` picklist: `CARE_SELF_MANAGED = 'Care - Self-Managed'`, `ACCOUNTS_PAYABLE = 'Accounts Payable'`, etc. (populate from CRM field values). Traits: `FindsFromValue`, `HasToArray`. File: `domain/FeedbackRecord/Enums/FeedbackDepartmentEnum.php`

- [ ] T010 [P] Enum: `FeedbackCategoryEnum` — string-backed. Cases from CRM `Category_of_Concern_s` multiselect values. Traits: `FindsFromValue`, `HasToArray`. File: `domain/FeedbackRecord/Enums/FeedbackCategoryEnum.php`

- [ ] T011 [P] Enum: `FeedbackCrmSyncStatusEnum` — string-backed. Cases: `SYNCED = 'synced'`, `PENDING = 'pending'`, `FAILED = 'failed'`. Traits: `FindsFromValue`, `HasToArray`. File: `domain/FeedbackRecord/Enums/FeedbackCrmSyncStatusEnum.php`

- [ ] T012 Model: `FeedbackRecord` — extends `Model`. Traits: `HasFactory`, `LogsActivity`, `SoftDeletes`. Define `$fillable` with all columns from T001 (except id, uuid, timestamps, deleted_at). `casts()` method: `type → FeedbackRecordTypeEnum`, `triage_category → FeedbackTriageCategoryEnum`, `categories → array`, `safety_concerns → boolean`, `confidential → boolean`, `priority_resolution → boolean`, `due_date_manually_set → boolean`, `date_received → date`, `due_date → date`, `accountable_person_assigned_at → datetime`, `accountable_person_acknowledged_at → datetime`, `complaint_owner_accepted_at → datetime`, `closed_at → datetime`, `crm_last_pushed_at → datetime`, `crm_sync_status → FeedbackCrmSyncStatusEnum`, `migrated_from_crm → boolean`, `deleted_at → datetime`. Relationships: `package(): BelongsTo<Package>`, `actionItems(): HasMany<FeedbackActionItem>`, `notes(): MorphMany` (polymorphic), `accountablePerson(): BelongsTo<User>`, `qualitySupportLead(): BelongsTo<User>`, `escalationPoint(): BelongsTo<User>`, `createdBy(): BelongsTo<User>`, `incident(): BelongsTo<Incident>` (nullable), `parentFeedbackRecord(): BelongsTo<FeedbackRecord>` (nullable, self-referencing). Scopes: `scopeForPackage(Builder, Package)`, `scopeVisibleTo(Builder, User)` — filters out confidential records if user lacks `view-confidential-complaints`, `scopeOpen(Builder)` — excludes closed stages, `scopeOverdue(Builder)` — `where('due_date', '<', now())->open()`. Boot method: auto-generate UUID on creating event. `getActivitylogOptions()`: `LogOptions::defaults()->logOnly($this->fillable)`. `newFactory()`: `FeedbackRecordFactory::new()`. PHPDoc `@property` block for all columns. `getRouteKeyName()`: return `'uuid'`. File: `domain/FeedbackRecord/Models/FeedbackRecord.php`

- [ ] T013 Model: `FeedbackActionItem` — extends `Model`. Traits: `HasFactory`, `SoftDeletes`. `$fillable`: all columns from T002. `casts()`: `is_complete → boolean`, `due_date → date`, `completed_at → datetime`, `deleted_at → datetime`. Relationships: `feedbackRecord(): BelongsTo<FeedbackRecord>`, `completedBy(): BelongsTo<User>` (nullable). `newFactory()`: `FeedbackActionItemFactory::new()`. PHPDoc `@property` block. File: `domain/FeedbackRecord/Models/FeedbackActionItem.php`

- [ ] T014 [P] Factory: `FeedbackRecordFactory` — `@extends Factory<FeedbackRecord>`. `$model = FeedbackRecord::class`. Definition: `package_id → Package::factory()`, `type → $this->faker->randomElement(FeedbackRecordTypeEnum::cases())`, `stage → ComplaintStageEnum::NEW->value`, `reference → 'REF-' . str_pad($this->faker->unique()->numberBetween(1, 99999), 5, '0', STR_PAD_LEFT)`, `description → $this->faker->paragraph()`, `date_received → $this->faker->date()`, `crm_sync_status → FeedbackCrmSyncStatusEnum::SYNCED`, `created_by → User::factory()`, realistic defaults for other nullable fields. States: `complaint()` (type=COMPLAINT, adds triage_category), `remediation()` (type=REMEDIATION, triage_category=null), `confidential()` (confidential=true), `overdue()` (due_date=yesterday, open stage), `crmSyncFailed()` (crm_sync_status=FAILED), `migrated()` (migrated_from_crm=true, zoho_id=fake). File: `domain/FeedbackRecord/Factories/FeedbackRecordFactory.php`

- [ ] T015 [P] Factory: `FeedbackActionItemFactory` — `@extends Factory<FeedbackActionItem>`. Definition: `feedback_record_id → FeedbackRecord::factory()`, `description → $this->faker->sentence()`, `assigned_to → $this->faker->name()`, `due_date → $this->faker->dateTimeBetween('now', '+30 days')`, `is_complete → false`. States: `completed()` (is_complete=true, completed_at=now, completed_by=User::factory()). File: `domain/FeedbackRecord/Factories/FeedbackActionItemFactory.php`

- [ ] T016 Policy: `FeedbackRecordPolicy` — methods: `viewAny(User $user): bool` — `$user->hasPermissionTo('view-complaints')`, `view(User $user, FeedbackRecord $feedbackRecord): bool` — viewAny check + confidential check (`!$feedbackRecord->confidential || $user->hasPermissionTo('view-confidential-complaints')`), `create(User $user): bool` — `$user->hasPermissionTo('create-complaints')`, `update(User $user, FeedbackRecord $feedbackRecord): bool` — view check + `$user->hasPermissionTo('create-complaints')` + not closed (unless `manage-complaint-stages`), `delete(User $user, FeedbackRecord $feedbackRecord): bool` — same as update, `manageStages(User $user): bool` — `$user->hasPermissionTo('manage-complaint-stages')`, `manageNotes(User $user): bool` — `$user->hasPermissionTo('manage-complaint-notes')`, `manageActionPlan(User $user): bool` — `$user->hasPermissionTo('manage-complaint-action-plan')`, `retryCrmSync(User $user): bool` — `$user->is_super_admin || $user->hasRole('Admin')`. File: `domain/FeedbackRecord/Policies/FeedbackRecordPolicy.php`

- [ ] T017 ServiceProvider: `FeedbackRecordServiceProvider` — extends `Illuminate\Support\ServiceProvider`. `register()`: empty. `boot()`: `$this->loadRoutesFrom(__DIR__.'/../Routes/feedbackRecordRoutes.php')`. File: `domain/FeedbackRecord/Providers/FeedbackRecordServiceProvider.php`

- [ ] T018 Register ServiceProvider — add `Domain\FeedbackRecord\Providers\FeedbackRecordServiceProvider::class` to the `providers` array in `config/app.php`. Also register policy in `app/Providers/AuthServiceProvider.php`: add `FeedbackRecord::class => FeedbackRecordPolicy::class` to `$policies` array.

- [ ] T019 [P] Permissions: Add 6 entries to `config/permissions/user-permission-list.php` following the existing format `['permission_name' => 'view-complaints', 'associated_roles' => []]`. Keys: `view-complaints`, `view-confidential-complaints`, `create-complaints`, `manage-complaint-stages`, `manage-complaint-notes`, `manage-complaint-action-plan`. Leave `associated_roles` empty initially (assigned manually after deploy). Then run `php artisan sync:roles-permissions`.

- [ ] T020 [P] ZohoModuleEnum: Add `case FeedbackRecord = 'Complaints2';` to `app/Enums/ZohoModuleEnum.php`.

- [ ] T021 [P] Feature flag: No class file needed — uses string-based Pennant (Pattern B). Ensure `Feature::active('feedback-records')` will resolve to false by default. Feature flag activation is via database or Nova. Add PostHog flag `feedback-records` in PostHog dashboard for frontend gating.

---

## Phase 2 — Data Classes & Services

Depends on Phase 1 (enums + models). Blocking for actions.

- [ ] T022 Data: `FeedbackRecordData` — read DTO. Attributes: `#[TypeScript]`, `#[MapName(SnakeCaseMapper::class)]`. Properties: `id: int|Optional`, `uuid: string`, `reference: string`, `package: PackageData|Lazy|Optional` (via `Lazy::whenLoaded`), `type: FeedbackRecordTypeEnum`, `stage: string`, `triageCategory: ?FeedbackTriageCategoryEnum`, `primaryDepartment: ?string`, `categories: ?array`, `source: ?string`, `safetyConcerns: bool`, `confidential: bool`, `priorityResolution: bool`, `complainantName: ?string`, `complainantType: ?string`, `description: ?string`, `desiredOutcome: ?string`, `background: ?string`, `specificLanguage: ?string`, `rootCause: ?string`, `resolutionAction: ?string`, `preventionAction: ?string`, `contributingDetails: ?string`, `dateReceived: ?Carbon` with `#[WithTransformer(DateTimeInterfaceTransformer::class, format: 'd/m/Y')]`, `dueDate: ?Carbon` (same transformer), `dueDateManuallySet: bool`, `accountablePerson: UserData|Lazy|Optional`, `qualitySupportLead: UserData|Lazy|Optional`, `escalationPoint: UserData|Lazy|Optional`, `createdBy: UserData|Lazy|Optional`, `crmSyncStatus: FeedbackCrmSyncStatusEnum`, `crmLastPushedAt: ?Carbon`, `migratedFromCrm: bool`, `zohoId: ?string`, `closedAt: ?Carbon`, `createdAt: Carbon`, `updatedAt: Carbon`, `notes: Collection` (Lazy), `actionItems: Collection` (Lazy). Add `fromModel(FeedbackRecord $feedbackRecord): self` static constructor. File: `domain/FeedbackRecord/Data/FeedbackRecordData.php`

- [ ] T023 Data: `CreateFeedbackRecordData` — write DTO for creation. `#[TypeScript]`, `#[MapName(SnakeCaseMapper::class)]`. Properties with `#[Rule(...)]` attributes: `packageId: int` (`required`, `exists:packages,id`), `type: FeedbackRecordTypeEnum` (`required`), `description: string` (`required`, `min:10`), `triageCategory: ?FeedbackTriageCategoryEnum` (`required_if:type,Complaint`), `complainantName: ?string` (`nullable`, `max:255`), `complainantType: ?string` (`nullable`), `primaryDepartment: ?string` (`nullable`), `categories: ?array` (`nullable`, `array`), `source: ?string` (`nullable`), `safetyConcerns: bool`, `confidential: bool`, `priorityResolution: bool`, `linkedToIncident: ?string` (`nullable`), `incidentId: ?int` (`nullable`, `exists:incidents,id`), `desiredOutcome: ?string` (`nullable`), `background: ?string` (`nullable`), `specificLanguage: ?string` (`nullable`), `accountablePersonId: ?int` (`nullable`, `exists:users,id`), `qualitySupportLeadId: ?int` (`nullable`, `exists:users,id`), `escalationPointId: ?int` (`nullable`, `exists:users,id`), `dueDate: ?string` (`nullable`, `date`). File: `domain/FeedbackRecord/Data/CreateFeedbackRecordData.php`

- [ ] T024 [P] Data: `UpdateFeedbackRecordData` — same fields as Create but all optional (use `Optional` union type). Add `dueDate: ?string|Optional` and `dueDateManuallySet: bool|Optional`. File: `domain/FeedbackRecord/Data/UpdateFeedbackRecordData.php`

- [ ] T025 [P] Data: `AdvanceStageData` — `#[TypeScript]`, `#[MapName(SnakeCaseMapper::class)]`. Properties: `nextStage: string` (`required`, `string`), `note: ?string` (`nullable`, `max:1000`). File: `domain/FeedbackRecord/Data/AdvanceStageData.php`

- [ ] T026 [P] Data: `CreateFeedbackActionItemData` — `#[TypeScript]`, `#[MapName(SnakeCaseMapper::class)]`. Properties: `feedbackRecordId: int` (`required`, `exists:feedback_records,id`), `description: string` (`required`, `min:3`), `assignedTo: ?string` (`nullable`, `max:255`), `dueDate: ?string` (`nullable`, `date`). File: `domain/FeedbackRecord/Data/CreateFeedbackActionItemData.php`

- [ ] T027 [P] Data: `UpdateFeedbackActionItemData` — same as create, all optional. Add `isComplete: bool|Optional`, `completedAt: ?string|Optional`. File: `domain/FeedbackRecord/Data/UpdateFeedbackActionItemData.php`

- [ ] T028 [P] Data: `FeedbackActionItemData` — read DTO. `#[TypeScript]`, `#[MapName(SnakeCaseMapper::class)]`. Properties: `id: int`, `feedbackRecordId: int`, `description: string`, `assignedTo: ?string`, `dueDate: ?Carbon`, `isComplete: bool`, `completedAt: ?Carbon`, `completedBy: UserData|Lazy|Optional`. File: `domain/FeedbackRecord/Data/FeedbackActionItemData.php`

- [ ] T029 [P] Data: `FeedbackRecordZohoData` — maps CRM field names to Portal fields for migration. Properties: `Name → reference`, `Type → type`, `Stage / Remediation_Stages → stage`, `Client → package_id` (resolved via Consumer zoho_id lookup), `Description_of_Concerns / Remediation_Issue_s_Description → description`, etc. for all CRM Reference fields in spec.md. Add `fromZohoRecord(array $zohoRecord): self` static constructor. File: `domain/FeedbackRecord/Data/FeedbackRecordZohoData.php`

- [ ] T030 Service: `FeedbackRecordStageService` — methods: `getStageEnumForType(FeedbackRecordTypeEnum $type): string` (returns ComplaintStageEnum or RemediationStageEnum class name), `getAvailableNextStages(FeedbackRecord $feedbackRecord): array` (returns array of stage enum cases valid from current stage — encode the state machine from spec.md mermaid diagrams), `validateTransition(FeedbackRecord $feedbackRecord, string $nextStage): bool` (validates the transition is legal), `getStageDefinitions(FeedbackRecordTypeEnum $type): array` (returns ordered array of all stages with labels and descriptions for the stage management UI), `isClosedStage(string $stage, FeedbackRecordTypeEnum $type): bool`, `getTimestampFieldForStage(string $stage): ?string` (maps stage to its timestamp column, e.g. AP_ASSIGNED → accountable_person_assigned_at). File: `domain/FeedbackRecord/Services/FeedbackRecordStageService.php`

- [ ] T031 Service: `FeedbackRecordSlaService` — methods: `calculateDueDate(FeedbackRecordTypeEnum $type, ?FeedbackTriageCategoryEnum $triage, Carbon $dateReceived): Carbon` (implements SLA table from FR-028: Complaint+Urgent=+28 calendar days, Complaint+Medium=+28, Complaint+Standard=+28, Remediation=+2 calendar days), `shouldRecalculate(FeedbackRecord $feedbackRecord): bool` (returns false if `due_date_manually_set` is true), `recalculateOnTriageChange(FeedbackRecord $feedbackRecord, FeedbackTriageCategoryEnum $newTriage): ?Carbon` (recalculates unless manually set, per FR-031), `recalculateOnConversion(FeedbackRecord $feedbackRecord, FeedbackTriageCategoryEnum $triage): Carbon` (FR-032, always recalculates when remediation→complaint). File: `domain/FeedbackRecord/Services/FeedbackRecordSlaService.php`

---

## Phase 3 — CRUD Actions & Routes [US1, US2, US3]

Depends on Phase 2 (data classes, services). Core business logic.

- [ ] T032 Routes: `feedbackRecordRoutes.php` — middleware `['web.authenticated', 'user.check_has_login']`. Feature flag: wrap in `Route::middleware('check.feature.flag:feedback-records')`. Routes exactly as plan.md API Contracts section. Use Action classes as single-invokable controllers. Package-scoped routes: `Route::prefix('package/{package}')` group for create/store. Standalone routes: `Route::prefix('feedback-records')` group for show/edit/update/delete/advance-stage/retry. Action item routes: separate prefix `feedback-action-items`. File: `domain/FeedbackRecord/Routes/feedbackRecordRoutes.php`

- [ ] T033 [US1] Action: `CreateFeedbackRecordAction` — `use AsAction`. `authorize()`: `Gate::authorize('create', FeedbackRecord::class)`. `asController(Package $package): Response` — return `Inertia::render('FeedbackRecords/Create', ['package' => PackageData::fromModel($package), 'users' => $this->getUsersForPackage($package), 'enums' => $this->getEnumArrays()])`. Private helper `getEnumArrays()` returns `FeedbackRecordTypeEnum::toArray()`, `FeedbackTriageCategoryEnum::toArray()`, `FeedbackComplainantTypeEnum::toArray()`, `FeedbackSourceEnum::toArray()`, `FeedbackDepartmentEnum::toArray()`, `FeedbackCategoryEnum::toArray()`. File: `domain/FeedbackRecord/Actions/CreateFeedbackRecordAction.php`

- [ ] T034 [US1] Action: `StoreFeedbackRecordAction` — `use AsAction`. `authorize()`: `Gate::authorize('create', FeedbackRecord::class)`. `handle(CreateFeedbackRecordData $data, Package $package): FeedbackRecord` — inside `DB::transaction()`: generate REF number (query `FeedbackRecord::query()->selectRaw("MAX(CAST(SUBSTRING(reference, 5) AS UNSIGNED)) as max_ref")->lockForUpdate()->value('max_ref')`, increment, format as `REF-XXXXX`), create FeedbackRecord with all data fields + `stage = $stageEnum::NEW->value` + `date_received = now()` + `created_by = auth()->id()`, calculate due_date via `FeedbackRecordSlaService::calculateDueDate($data->type, $data->triageCategory, now())`, dispatch `SyncFeedbackRecordToZoho::run($feedbackRecord)`. `asController(CreateFeedbackRecordData $data, Package $package): RedirectResponse` — call handle(), redirect to `route('feedback-records.show', $feedbackRecord)` with success flash. File: `domain/FeedbackRecord/Actions/StoreFeedbackRecordAction.php`

- [ ] T035 [US2] Action: `ShowFeedbackRecordAction` — `use AsAction`. `authorize(ActionRequest $request): bool` — resolve FeedbackRecord from route, `Gate::check('view', $feedbackRecord)`. `asController(FeedbackRecord $feedbackRecord): Response` — eager load `notes.author`, `actionItems.completedBy`, `accountablePerson`, `qualitySupportLead`, `escalationPoint`, `package.recipient`, `createdBy`. Compute permission booleans: `canEdit`, `canManageStages`, `canManageNotes`, `canManageActionPlan`. Return `Inertia::render('FeedbackRecords/Show', ['feedbackRecord' => FeedbackRecordData::fromModel($feedbackRecord), 'package' => PackageData::fromModel($feedbackRecord->package), 'canEdit' => ..., 'canManageStages' => ..., 'canManageNotes' => ..., 'canManageActionPlan' => ...])`. File: `domain/FeedbackRecord/Actions/ShowFeedbackRecordAction.php`

- [ ] T036 [US3] Action: `EditFeedbackRecordAction` — `use AsAction`. `authorize()`: resolve record, `Gate::authorize('update', $feedbackRecord)`. `asController(FeedbackRecord $feedbackRecord): Response` — return `Inertia::render('FeedbackRecords/Edit', ['feedbackRecord' => FeedbackRecordData::fromModel($feedbackRecord), 'package' => PackageData::fromModel($feedbackRecord->package), 'users' => ..., 'enums' => ...])`. File: `domain/FeedbackRecord/Actions/EditFeedbackRecordAction.php`

- [ ] T037 [US3] Action: `UpdateFeedbackRecordAction` — `use AsAction`. `authorize()`: resolve record, `Gate::authorize('update', $feedbackRecord)`. `handle(UpdateFeedbackRecordData $data, FeedbackRecord $feedbackRecord): FeedbackRecord` — inside `DB::transaction()`: update all provided fields. If `triageCategory` changed and `!$feedbackRecord->due_date_manually_set`, recalculate due_date via `FeedbackRecordSlaService::recalculateOnTriageChange()`. If `dueDate` explicitly provided, set `due_date_manually_set = true`. Dispatch `SyncFeedbackRecordToZoho::run($feedbackRecord)`. `asController()`: call handle(), redirect back with success flash. File: `domain/FeedbackRecord/Actions/UpdateFeedbackRecordAction.php`

- [ ] T038 [US3] Action: `DeleteFeedbackRecordAction` — `use AsAction`. `authorize()`: `Gate::authorize('delete', $feedbackRecord)`. `handle(FeedbackRecord $feedbackRecord): void` — soft delete the record, dispatch CRM push to mark as archived/closed in CRM. `asController()`: call handle(), redirect to package feedback tab with success flash. File: `domain/FeedbackRecord/Actions/DeleteFeedbackRecordAction.php`

---

## Phase 4 — Stage Management [US4]

Depends on Phase 3 (routes, base actions).

- [ ] T039 [US4] Action: `AdvanceFeedbackRecordStageAction` — `use AsAction`. `authorize()`: `Gate::authorize('manageStages', FeedbackRecord::class)`. `handle(AdvanceStageData $data, FeedbackRecord $feedbackRecord): FeedbackRecord` — inside `DB::transaction()`: validate transition via `FeedbackRecordStageService::validateTransition($feedbackRecord, $data->nextStage)` (throw ValidationException if invalid). Update `$feedbackRecord->stage = $data->nextStage`. Set timestamp field via `FeedbackRecordStageService::getTimestampFieldForStage($data->nextStage)` — e.g. if advancing to AP_ASSIGNED, set `accountable_person_assigned_at = now()`. If advancing to any closed stage, set `closed_at = now()`. If `$data->note`, create a Note on the record with the note content. Handle remediation→complaint conversion: if `$data->nextStage === RemediationStageEnum::CONVERTED_TO_COMPLAINT->value`, change `$feedbackRecord->type` to COMPLAINT, reset stage to `ComplaintStageEnum::NEW->value`, recalculate due_date via `FeedbackRecordSlaService::recalculateOnConversion()`. Save and dispatch `SyncFeedbackRecordToZoho::run($feedbackRecord)`. `asController()`: redirect back with success flash. File: `domain/FeedbackRecord/Actions/AdvanceFeedbackRecordStageAction.php`

- [ ] T040 [US4] Action: `ShowStageManagementAction` — `use AsAction`. `authorize()`: `Gate::authorize('manageStages', FeedbackRecord::class)`. `asController(FeedbackRecord $feedbackRecord): Response` — return `Inertia::render('FeedbackRecords/StageManagement', ['feedbackRecord' => FeedbackRecordData::fromModel($feedbackRecord), 'availableNextStages' => FeedbackRecordStageService::getAvailableNextStages($feedbackRecord), 'stageHistory' => $this->buildStageHistory($feedbackRecord), 'complaintLifecycle' => FeedbackRecordStageService::getStageDefinitions(FeedbackRecordTypeEnum::COMPLAINT), 'remediationLifecycle' => FeedbackRecordStageService::getStageDefinitions(FeedbackRecordTypeEnum::REMEDIATION)])`. Add route `GET /feedback-records/{feedbackRecord}/stage-management` → `ShowStageManagementAction` in feedbackRecordRoutes.php. File: `domain/FeedbackRecord/Actions/ShowStageManagementAction.php`

---

## Phase 5 — Action Plan CRUD [US6]

Depends on Phase 3 (routes).

- [ ] T041 [P] [US6] Action: `StoreFeedbackActionItemAction` — `use AsAction`. `authorize()`: `Gate::authorize('manageActionPlan', FeedbackRecord::class)`. `handle(CreateFeedbackActionItemData $data): FeedbackActionItem` — create action item, dispatch `SyncFeedbackRecordToZoho::run($feedbackActionItem->feedbackRecord)` (parent push with full subform). `asController(FeedbackRecord $feedbackRecord, CreateFeedbackActionItemData $data): RedirectResponse` — call handle(), redirect back. File: `domain/FeedbackRecord/Actions/StoreFeedbackActionItemAction.php`

- [ ] T042 [P] [US6] Action: `UpdateFeedbackActionItemAction` — `use AsAction`. `authorize()`: `Gate::authorize('manageActionPlan', FeedbackRecord::class)`. `handle(UpdateFeedbackActionItemData $data, FeedbackActionItem $feedbackActionItem): FeedbackActionItem` — update fields. If marking complete (`isComplete = true`), set `completed_at = now()`, `completed_by = auth()->id()`. Dispatch parent CRM push. `asController()`: redirect back. File: `domain/FeedbackRecord/Actions/UpdateFeedbackActionItemAction.php`

- [ ] T043 [P] [US6] Action: `DeleteFeedbackActionItemAction` — `use AsAction`. `authorize()`: `Gate::authorize('manageActionPlan', FeedbackRecord::class)`. `handle(FeedbackActionItem $feedbackActionItem): void` — soft delete, dispatch parent CRM push. `asController()`: redirect back. File: `domain/FeedbackRecord/Actions/DeleteFeedbackActionItemAction.php`

---

## Phase 6 — CRM Push [US1-6]

Depends on Phase 3 (models populated). Can overlap with Phases 4-5.

- [ ] T044 [P] CRM sync action: `SyncFeedbackRecordToZoho` — `use AsAction`. `handle(FeedbackRecord $feedbackRecord): bool` — guard on `in_array(config('app.env'), ['production', 'testing'])`, guard on `config('zoho.update_to_crm')`, guard on `$feedbackRecord->zoho_id` for updates (skip if no zoho_id — new records use CreateZohoRecordJob instead). Build `$dataArray` mapping Portal fields to CRM field names from spec.md CRM Reference tables: `'Type' => $feedbackRecord->type->value`, `'Stage' => $feedbackRecord->stage`, `'Triage_Category' => $feedbackRecord->triage_category?->value`, `'Description_of_Concerns' => $feedbackRecord->description`, etc. Include action items as `'Action_Plan' => $feedbackRecord->actionItems->map(fn ($item) => [...])`. Dispatch `UpdateZohoRecordJob::dispatch('Complaints2', $feedbackRecord->zoho_id, $dataArray)`. Update `$feedbackRecord->crm_sync_status = FeedbackCrmSyncStatusEnum::PENDING`, `$feedbackRecord->crm_last_pushed_at = now()`. For new records (no zoho_id): dispatch `CreateZohoRecordJob` instead, store returned zoho_id. File: `app/Actions/Zoho/SyncFeedbackRecordToZoho.php`

- [ ] T045 [P] CRM sync action: `SyncFeedbackNoteToZoho` — `use AsAction`. `handle(Note $note, string $action = 'upsert'): bool` — guard on env + config. For upsert: `ZohoService::insertNote()` or `updateNote()` on the parent `Complaints2` record using `$note->noteable->zoho_id`. For delete: `ZohoService::deleteNote()`. File: `app/Actions/Zoho/SyncFeedbackNoteToZoho.php`

- [ ] T046 [P] Action: `RetryCrmSyncAction` — `use AsAction`. `authorize()`: admin only (`$user->is_super_admin || $user->hasRole('Admin')`). `handle(FeedbackRecord $feedbackRecord): void` — reset `crm_sync_status = PENDING`, dispatch `SyncFeedbackRecordToZoho::run($feedbackRecord)`. `asController()`: redirect back with success flash. File: `domain/FeedbackRecord/Actions/RetryCrmSyncAction.php`

---

## Phase 7 — Package Tab Integration [US2]

Depends on Phase 1 (model), Phase 3 (routes).

- [ ] T047 Table: `FeedbackRecordTable` — extends `BaseTable`. `$resource = FeedbackRecord::class`. `$defaultSort = '-date_received'`. `$toggleable = true`. `$search = ['reference']`. Constructor: `#[Remember] private readonly ?Package $package = null`. `resource()`: `FeedbackRecord::query()->visibleTo(auth()->user())` + optional `->where('package_id', $this->package->id)` if scoped. Columns: `TextColumn::make('reference', 'Reference', searchable: true)`, `TextColumn::make('type', sortable: true)` with badge render, `TextColumn::make('stage', sortable: true)`, `TextColumn::make('triage_category', 'Triage', sortable: true)`, `TextColumn::make('accountablePerson.full_name', 'Accountable Person')`, `DateColumn::make('due_date', 'Due Date', sortable: true)->format('d/m/Y')` with conditional red class for overdue, `DateColumn::make('date_received', sortable: true)->format('d/m/Y')`, `TextColumn::make('crm_sync_status', 'CRM Sync')` with badge. Filters: `SelectFilter` for type (Complaint/Remediation), `SelectFilter` for stage, `SelectFilter` for triage_category. File: `domain/FeedbackRecord/Tables/FeedbackRecordTable.php`

- [ ] T048 PackageService `getTabs()`: Add feedback records tab entry inside `$tabs` array in `app/Services/Package/PackageService.php` around line 140 (near incidents tab). Pattern: `Feature::active('feedback-records') ? ['title' => 'Feedback Records', 'permission' => 'view-complaints', 'href' => route('package.show', [$package, 'tab' => 'feedback-records']), 'count' => $counts['feedback_records']] : null`. Add count to `$counts` cache: `'feedback_records' => FeedbackRecord::where('package_id', $package->id)->visibleTo($user)->open()->count()`. Include overdue check: if any are overdue, pass `'badge_colour' => 'error'`.

- [ ] T049 PackageService `getTab()`: Add entry `'feedback-records' => ['tab' => 'PackageFeedbackRecords', 'permission' => 'view-complaints']` to the `$tabs` array in `getTab()` method.

- [ ] T050 PackageService `getTabData()`: Add entry `'feedback-records' => new FeedbackRecordTable($package)` to `$tabData` array in `getTabData()` method. Add additional props block: `if ($componentName === 'PackageFeedbackRecords') { $additionalProps['canCreate'] = Gate::check('create', FeedbackRecord::class); }`.

---

## Phase 8 — Frontend (Vue Pages) [US1-6]

Depends on all backend phases (routes return Inertia responses).

- [ ] T051 [P] Component: `CrmSyncBadge.vue` — `<script setup lang="ts">`. Props: `type Props = { status: 'SYNCED' | 'PENDING' | 'FAILED', lastPushedAt?: string | null }`. Renders `<CommonBadge>` with: SYNCED → `colour="success" label="Synced"`, PENDING → `colour="warning" label="Sync Pending"` with `heroicons:arrow-path` leading icon + animate-spin class, FAILED → `colour="error" label="Sync Failed"` with `heroicons:exclamation-triangle` leading icon. Show `lastPushedAt` as tooltip. Pure presentational. File: `resources/js/Components/FeedbackRecord/CrmSyncBadge.vue`

- [ ] T052 [P] Component: `FeedbackStageProgressBar.vue` — `<script setup lang="ts">`. Props: `type Props = { stages: { value: string, label: string }[], currentStage: string, type: 'COMPLAINT' | 'REMEDIATION' }`. Renders a horizontal step indicator. Each stage is a circle + label. Stages before current = teal-700 filled + check icon. Current stage = teal-700 ring + pulsing dot. Future stages = gray-300. Connecting lines between circles: completed = teal-700, pending = gray-300. Use flex layout, not CommonStepNavigation (that's tab-based, not suitable for a read-only progress bar). Pure presentational. File: `resources/js/Components/FeedbackRecord/FeedbackStageProgressBar.vue`

- [ ] T053 [US2] Page: `PackageFeedbackRecords.vue` — `<script setup lang="ts">`. `defineOptions({ layout: AppLayout })`. Import `PackageViewLayout` from `@/Layouts/ChildLayouts/PackageViewLayout.vue`. Props: `package`, `tabData`, `tabs`, `viewLayoutData`, `canCreate: boolean`. Template: `<PackageViewLayout :package="package" :tabs="tabs" :view-layout-data="viewLayoutData">` wrapping a `<CommonCard>` with `<CommonHeader title="Feedback Records" variant="card" />` and `<CommonTable :resource="tabData" searchPlaceholder="Search by reference...">`. Add "New Feedback Record" `<CommonButton>` in header if `canCreate`. Empty state: "No feedback records found" with CTA to create. File: `resources/js/Pages/Packages/tabs/PackageFeedbackRecords.vue`

- [ ] T054 [US2] Page: `Show.vue` (detail view) — `<script setup lang="ts">`. `defineOptions({ layout: (h: any, page: any) => h(AppLayout, { title: feedbackRecord.reference }, () => page) })`. Props: `feedbackRecord: FeedbackRecord`, `package: Package`, `canEdit: boolean`, `canManageStages: boolean`, `canManageNotes: boolean`, `canManageActionPlan: boolean`. Template structure: `<CommonContent>` with breadcrumb header (Package → Feedback Records → REF-XXXXX). 7-5 grid (`grid-cols-12`, `col-span-7` left / `col-span-5` right). **Left column**: Overview card (`CommonCard` + `CommonDefinitionList` with type badge, stage badge, triage badge, reference, date received, due date with overdue alert, description, desired outcome, background, specific language). Complainant card (name, type). Details card (department, categories, source, safety concerns, linked to incident, priority resolution). Resolution card (root cause, resolution action, prevention action, contributing details). Action Plan card (`CommonTable` inline with action items, add button if `canManageActionPlan`). **Right column**: People cards (Accountable Person, Quality Support Lead, Escalation Point — each as `CommonCard` with `CommonAvatar` + name + role). CRM sync status (`CrmSyncBadge`). Stage progress bar (`FeedbackStageProgressBar` with link to stage management if `canManageStages`). Notes section (`CommonNotes` with `modelType="FeedbackRecord"`, `:modelId="feedbackRecord.id"`). Edit button if `canEdit`. File: `resources/js/Pages/FeedbackRecords/Show.vue`

- [ ] T055 [US1] Page: `Create.vue` (create form) — `<script setup lang="ts">`. `defineOptions({ layout: (h: any, page: any) => h(AppLayout, { title: 'New Feedback Record' }, () => page) })`. Props: `package: Package`, `users: SelectOption[]`, `enums: FeedbackRecordEnums`. Form: `const form = useForm({ type: '', description: '', triage_category: '', complainant_name: '', complainant_type: '', primary_department: '', categories: [], source: '', safety_concerns: false, confidential: false, priority_resolution: false, linked_to_incident: '', incident_id: null, desired_outcome: '', background: '', specific_language: '', accountable_person_id: null, quality_support_lead_id: null, escalation_point_id: null, due_date: null })`. Submit: `form.post(route('feedback-records.store', { package: props.package.id }))`. Template: `<CommonContent>` with breadcrumb header. Sections matching detail view: Type selector (radio cards via `CommonRadioGroup` with `value-key="value"`), Complainant section, Details section, Description section (all `CommonFormField` + `CommonInput`/`CommonTextarea`/`CommonSelectMenu` with `value-key="value"`), People section (`CommonSelectMenu` for each user field), Resolution section (present but disabled with "Populated during investigation" note). File: `resources/js/Pages/FeedbackRecords/Create.vue`

- [ ] T056 [US3] Page: `Edit.vue` — same structure as Create. Props add `feedbackRecord: FeedbackRecord`. Form pre-populated from `feedbackRecord` props. Resolution fields enabled. Submit: `form.put(route('feedback-records.update', { feedbackRecord: props.feedbackRecord.uuid }))`. Closed record check: if record is in closed stage and user can't manage stages, show `CommonAlert` warning and disable form. File: `resources/js/Pages/FeedbackRecords/Edit.vue`

- [ ] T057 [US4] Page: `StageManagement.vue` — `<script setup lang="ts">`. Props: `feedbackRecord: FeedbackRecord`, `availableNextStages: StageOption[]`, `stageHistory: StageTransition[]`, `complaintLifecycle: StageDefinition[]`, `remediationLifecycle: StageDefinition[]`. Current stage card with `FeedbackStageProgressBar`. Available next stages as clickable `CommonCard` buttons with stage name + description. Confirmation modal (`CommonModal`) with optional note `CommonTextarea`. Stage advance form: `useForm({ next_stage: '', note: '' })`, submit via `form.post(route('feedback-records.advance-stage', { feedbackRecord: props.feedbackRecord.uuid }))`. Stage history timeline: chronological list of all stage transitions with timestamp, duration in stage, and who triggered. Show full lifecycle diagram for reference. File: `resources/js/Pages/FeedbackRecords/StageManagement.vue`

---

## Phase 9 — CRM Migration [US1]

Depends on Phase 6 (CRM push actions). Can run in parallel with Phase 8.

- [ ] T058 [P] Job: `MigrateFeedbackRecordsFromZohoJob` — implements `ShouldQueue`. Constructor: `int $page = 1`, `int $perPage = 200`. `handle()`: fetch page from Zoho `Complaints2` module via `ZohoService::getRecords('Complaints2', $page, $perPage)`. For each CRM record: map via `FeedbackRecordZohoData::fromZohoRecord($record)`, upsert to `feedback_records` by `zoho_id` (update if exists, create if not). Set `migrated_from_crm = true`. Import notes via `ZohoService::getNotes('Complaints2', $zohoId)`. Import action plan subform rows. Preserve original REF numbers. If more pages, dispatch self with `$page + 1`. Track progress via `Cache::put("feedback-migration-progress", ['page' => $page, 'total_imported' => $count])`. Use `RateLimitedWithRedis` middleware. File: `domain/FeedbackRecord/Jobs/MigrateFeedbackRecordsFromZohoJob.php`

- [ ] T059 [P] Artisan command: `MigrateFromCrmCommand` — signature: `feedback-records:migrate-from-crm {--resume : Resume from last page}`. Dispatches `MigrateFeedbackRecordsFromZohoJob`. If `--resume`, reads last page from cache. Outputs progress. File: `domain/FeedbackRecord/Commands/MigrateFromCrmCommand.php`. Register in ServiceProvider `boot()`: `$this->commands([MigrateFromCrmCommand::class])`.

---

## Phase 10 — Seeder

- [ ] T060 [P] Seeder: `FeedbackRecordSeeder` — creates 10 feedback records (mix of complaints and remediations) across 3 packages. Each with 1-3 action items and 1-2 notes. Various stages, some overdue, one confidential, one CRM sync failed. Uses factories with states. File: `domain/FeedbackRecord/Seeders/FeedbackRecordSeeder.php`

---

## Phase 11 — Testing

Depends on all implementation phases. Can start incrementally after each phase.

- [ ] T061 [P] Test: `FeedbackRecordPolicyTest` — Pest feature test. Test all 8 policy methods × relevant permission combinations. Scenarios: user with `view-complaints` can view non-confidential, user without `view-confidential-complaints` cannot view confidential, user with `create-complaints` can create, user without cannot, closed record blocks edit unless `manage-complaint-stages`, admin can retry CRM sync. File: `tests/Feature/FeedbackRecord/FeedbackRecordPolicyTest.php`

- [ ] T062 [P] Test: `ComplaintStageEnumTest` — Pest unit test. Verify all 12 cases exist with correct values. Test `isClosed()` returns true for 6a-6d, false for others. Test `FindsFromValue` trait. File: `tests/Unit/FeedbackRecord/ComplaintStageEnumTest.php`

- [ ] T063 [P] Test: `RemediationStageEnumTest` — same pattern for 11 remediation cases. Test `isClosed()` and `CONVERTED_TO_COMPLAINT` case. File: `tests/Unit/FeedbackRecord/RemediationStageEnumTest.php`

- [ ] T064 [P] Test: `FeedbackRecordStageServiceTest` — Pest unit test. Test `getAvailableNextStages()` for every stage of both lifecycles. Test `validateTransition()` accepts valid transitions, rejects invalid. Test `getTimestampFieldForStage()` returns correct field for each stage. Test `isClosedStage()`. File: `tests/Unit/FeedbackRecord/FeedbackRecordStageServiceTest.php`

- [ ] T065 [P] Test: `FeedbackRecordSlaServiceTest` — Pest unit test. Test `calculateDueDate()` for all 4 SLA table combinations (Complaint+Urgent=+28d, Complaint+Medium=+28d, Complaint+Standard=+28d, Remediation=+2d). Test `shouldRecalculate()` returns false when `due_date_manually_set`. Test `recalculateOnTriageChange()` respects manual override. Test `recalculateOnConversion()` always recalculates. File: `tests/Unit/FeedbackRecord/FeedbackRecordSlaServiceTest.php`

- [ ] T066 Test: `StoreFeedbackRecordActionTest` — Pest feature test. Test: creates record with valid data, generates REF-XXXXX, sets stage to NEW, calculates due_date from SLA, dispatches CRM sync job, validates required fields, rejects invalid package_id, rejects user without `create-complaints` permission. Use `Bus::fake()` to assert job dispatch. File: `tests/Feature/FeedbackRecord/StoreFeedbackRecordActionTest.php`

- [ ] T067 [P] Test: `UpdateFeedbackRecordActionTest` — Pest feature test. Test: updates fields, dispatches CRM sync, recalculates due_date on triage change (unless manually set), blocks edit on closed records for non-stage-managers, sets `due_date_manually_set` when due_date explicitly provided. File: `tests/Feature/FeedbackRecord/UpdateFeedbackRecordActionTest.php`

- [ ] T068 [P] Test: `DeleteFeedbackRecordActionTest` — Pest feature test. Test: soft deletes record, dispatches CRM sync, blocks unauthorized users. File: `tests/Feature/FeedbackRecord/DeleteFeedbackRecordActionTest.php`

- [ ] T069 [P] Test: `ShowFeedbackRecordActionTest` — Pest feature test. Test: renders Show page with correct props, eager loads relationships, hides confidential records from unauthorized users, shows CRM sync badge data. File: `tests/Feature/FeedbackRecord/ShowFeedbackRecordActionTest.php`

- [ ] T070 Test: `AdvanceFeedbackRecordStageActionTest` — Pest feature test. Test: advances to valid next stage, records timestamp, creates note if provided, rejects invalid transitions, handles remediation→complaint conversion (type change, stage reset, due_date recalculation), dispatches CRM sync. File: `tests/Feature/FeedbackRecord/AdvanceFeedbackRecordStageActionTest.php`

- [ ] T071 [P] Test: `FeedbackActionItemCrudTest` — Pest feature test. Test: create item, update item, mark complete (sets completed_at + completed_by), delete item, all dispatch parent CRM sync, all check `manage-complaint-action-plan` permission. File: `tests/Feature/FeedbackRecord/FeedbackActionItemCrudTest.php`

- [ ] T072 [P] Test: `SyncFeedbackRecordToZohoTest` — Pest feature test. Test: dispatches `UpdateZohoRecordJob` with correct module + data mapping, guards on env + config flag, includes action items as subform array, handles new records (no zoho_id) with `CreateZohoRecordJob`. Use `Bus::fake()`. File: `tests/Feature/FeedbackRecord/SyncFeedbackRecordToZohoTest.php`

---

## Phase 12 — Polish & Verification

Final phase. Run after all implementation.

- [ ] T073 Run `vendor/bin/pint --dirty` to format all new PHP files.

- [ ] T074 Run `php artisan typescript:transform` to regenerate `generated.d.ts` with new FeedbackRecord types.

- [ ] T075 Run `php artisan migrate` to verify both migrations execute cleanly.

- [ ] T076 Run `php artisan test --compact --filter=FeedbackRecord` to verify all tests pass.

- [ ] T077 Verify feature flag gating: with `feedback-records` OFF, confirm Package page does not show Feedback Records tab. With flag ON, tab appears.

---

## Task Summary

| Phase | Tasks | Parallelizable | User Stories |
|-------|-------|---------------|--------------|
| 1 — Foundation | T001-T021 (21) | 11 [P] | All |
| 2 — Data & Services | T022-T031 (10) | 7 [P] | All |
| 3 — CRUD Actions | T032-T038 (7) | 0 | US1, US2, US3 |
| 4 — Stage Management | T039-T040 (2) | 0 | US4 |
| 5 — Action Plan | T041-T043 (3) | 3 [P] | US6 |
| 6 — CRM Push | T044-T046 (3) | 3 [P] | US1-6 |
| 7 — Package Tab | T047-T050 (4) | 0 | US2 |
| 8 — Frontend | T051-T057 (7) | 2 [P] | US1-6 |
| 9 — Migration | T058-T059 (2) | 2 [P] | US1 |
| 10 — Seeder | T060 (1) | 1 [P] | — |
| 11 — Testing | T061-T072 (12) | 10 [P] | US1-6 |
| 12 — Polish | T073-T077 (5) | 0 | — |
| **Total** | **77** | **39 [P]** | |

### MVP Scope (P1 User Stories Only)

All 77 tasks are P1 scope — Phase 1 of the spec. No P2/P3 tasks included.

### Story Coverage

| Story | Tasks | Description |
|-------|-------|-------------|
| US1 — Create | T033, T034, T055 | Create action + form page |
| US2 — View | T035, T047-T050, T053, T054 | Show action + package tab + list + detail |
| US3 — Edit | T036, T037, T038, T056 | Edit/update/delete actions + edit page |
| US4 — Stages | T039, T040, T057 | Stage advance action + stage management page |
| US5 — Notes | (uses existing Note CRUD) | No new tasks — existing `notes.store`/`update`/`destroy` routes |
| US6 — Action Plan | T041, T042, T043 | Action item CRUD actions |
