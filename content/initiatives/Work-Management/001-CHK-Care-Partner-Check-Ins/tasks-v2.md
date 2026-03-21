---
title: "Implementation Tasks: Coordinator Check-In Settings, Import/Export & Hybrid Type"
---

# Implementation Tasks: Coordinator Check-In Settings, Import/Export & Hybrid Type

**Plan**: [plan-v2.md](plan-v2.md) | **Mode**: AI | **Date**: 2026-03-12

---

## Phase 1: Foundation (Migrations, Enum, Models, Feature Flag)

- [ ] T001 Migration: Add `uuid` column to `check_ins` table. Run `php artisan make:migration add_uuid_to_check_ins_table --no-interaction`. Add `$table->uuid('uuid')->unique()->nullable()->after('id')`. Then backfill existing rows: `CheckIn::whereNull('uuid')->chunkById(500, fn ($chunk) => $chunk->each(fn ($c) => $c->update(['uuid' => Str::uuid()])))`. After backfill, alter column to not nullable. File: `database/migrations/xxxx_add_uuid_to_check_ins_table.php`

- [ ] T002 [P] Migration: Add coordinator check-in settings to `care_coordinators` table. Run `php artisan make:migration add_check_in_settings_to_care_coordinators_table --no-interaction`. Add: `$table->boolean('check_ins_enabled')->default(false)->after('default_loading_fee')`, `$table->unsignedTinyInteger('check_in_cadence_months')->default(3)->after('check_ins_enabled')`, `$table->boolean('is_internal_coordination')->default(false)->after('check_in_cadence_months')`. File: `database/migrations/xxxx_add_check_in_settings_to_care_coordinators_table.php`

- [ ] T003 [P] Enum: Add `Hybrid` case to `CheckInTypeEnum`. Add `#[Label('Hybrid')] case Hybrid = 'hybrid';` with PHPDoc `/** Hybrid check-in for Internal Coordination — counts as both internal and external */`. File: `domain/CheckIn/Enums/CheckInTypeEnum.php`

- [ ] T004 Model: Update `CheckIn` model — add `uuid` to casts as `'uuid' => 'string'`, add `protected static function booted(): void` with `static::creating(fn (CheckIn $checkIn) => $checkIn->uuid ??= (string) Str::uuid())`. Import `Illuminate\Support\Str`. File: `domain/CheckIn/Models/CheckIn.php`

- [ ] T005 [P] Model: Update `CareCoordinator` model — add `'check_ins_enabled'`, `'check_in_cadence_months'`, `'is_internal_coordination'` to `$fillable` array. Add to `casts()` method: `'check_ins_enabled' => 'boolean'`, `'check_in_cadence_months' => 'integer'`, `'is_internal_coordination' => 'boolean'`. File: `app/Models/Organisation/CareCoordinator.php`

- [ ] T006 Feature flag: Register `coordinator-check-ins-feature` in Nova settings. In `NovaServiceProvider::novaSettings()`, add a new Panel `'Coordinator Check-Ins'` with `Boolean::make('Coordinator Check-Ins Feature Flag', 'ff_coordinator_check_ins')`. Then register in Pennant — find where `care-partner-check-ins-feature` is resolved (likely `CheckFeatureFlag` middleware reading Nova settings) and add parallel resolution for `coordinator-check-ins-feature` reading `ff_coordinator_check_ins`. File: `app/Providers/NovaServiceProvider.php`, `app/Http/Middleware/CheckFeatureFlag.php`

- [ ] T007 Feature flag frontend: In `HandleInertiaRequests.php`, add to `feature_flags` array: `'coordinator_check_ins' => fn () => Feature::active('coordinator-check-ins-feature')`. File: `app/Http/Middleware/HandleInertiaRequests.php`

---

## Phase 2: Generator Action

- [ ] T008 Action: Create `GenerateCoordinatorCheckInsAction` with `AsAction` trait. File: `domain/CheckIn/Actions/GenerateCoordinatorCheckInsAction.php`

  `handle(): int` method:
  1. Early return 0 if `Feature::inactive('coordinator-check-ins-feature')`
  2. Query `CareCoordinator::where('check_ins_enabled', true)` with `->with('packages')` where packages are ACTIVE with commencement_date <= 1 month ago
  3. For each coordinator, get latest-commenced package per recipient (same subquery pattern as `GenerateCheckInsAction`)
  4. For each package:
     - Determine type: `$coordinator->is_internal_coordination ? CheckInTypeEnum::Hybrid : CheckInTypeEnum::External`
     - Determine assigned user: `$coordinator->is_internal_coordination ? $package->case_manager_id : $coordinator->owner_user_id`
     - Check no pending/in-progress check-in of this type exists for this package
     - Get cadence: `ClientCadenceSetting` for package → `$coordinator->check_in_cadence_months` → `CheckIn::DEFAULT_CADENCE_MONTHS`
     - Calculate due date (same logic as `GenerateCheckInsAction::calculateDueDate()` — extract to trait or duplicate)
     - Get previous summary from last completed check-in of same type
     - Create CheckIn with uuid auto-generated, is_flagged if assigned_user_id is null

- [ ] T009 Job: Update `ProcessCheckInsJob::handle()` — add `GenerateCoordinatorCheckInsAction::run()` after `GenerateCheckInsAction::run()`. Import `Domain\CheckIn\Actions\GenerateCoordinatorCheckInsAction`. File: `app/Jobs/ProcessCheckInsJob.php`

- [ ] T010 Scheduler: In `app/Console/Kernel.php`, find the `ProcessCheckInsJob` schedule entry. The coordinator generation runs inside the same job (T009), so no scheduler change needed. But add a separate skip condition: if BOTH `care-partner-check-ins-feature` AND `coordinator-check-ins-feature` are inactive, skip the job entirely. Update the existing `.skip()` callback. File: `app/Console/Kernel.php`

- [ ] T011 [P] Artisan command: Check if `app:process-check-ins` command exists. If yes, ensure it also calls `GenerateCoordinatorCheckInsAction::run()`. Search for the command file and update. File: likely `app/Console/Commands/ProcessCheckInsCommand.php`

---

## Phase 3: CSV Export

- [ ] T012 Export class: Create `CheckInExport` implementing `FromQuery`, `WithHeadings`, `WithMapping`. Constructor takes `?int $coordinatorId = null` for role-based scoping. File: `app/Exports/CheckInExport.php`

  `query()`: `CheckIn::query()->with(['package.recipient', 'assignedUser'])->when($this->coordinatorId, fn ($q) => $q->whereHas('package', fn ($p) => $p->where('care_coordinator_id', $this->coordinatorId)))`.

  `headings()`: `['uuid', 'tc_customer_no', 'client_name', 'type', 'status', 'due_date', 'assigned_to', 'wellbeing_rating', 'summary_notes', 'follow_up_actions', 'completed_at']`.

  `map($row)`: `[$row->uuid, $row->package?->tc_customer_no, $row->package?->recipient?->full_name, $row->type->label(), $row->status->label(), $row->due_date->format('Y-m-d'), $row->assignedUser?->full_name ?? 'Unassigned', $row->wellbeing_rating, $row->summary_notes, $row->follow_up_actions, $row->completed_at?->format('Y-m-d H:i:s')]`.

- [ ] T013 Controller: Create `CheckInExportController` with single `__invoke(Request $request)` method. Authorize via `Gate::authorize('manage-check-ins')`. Determine coordinator scoping: `$coordinatorId = $request->user()->isCareCoordinator() ? $request->user()->careCoordinator?->id : null`. Return `(new CheckInExport($coordinatorId))->download('check-ins-' . now()->format('Y-m-d') . '.csv')`. File: `app/Http/Controllers/Staff/CheckIn/CheckInExportController.php`

- [ ] T014 Route: Add export route inside the existing `check-ins.` route group in `routes/web/authenticated.php`. Add `Route::get('/export', \App\Http\Controllers\Staff\CheckIn\CheckInExportController::class)->name('export');` — place BEFORE the `/{checkIn}` wildcard route so it doesn't get caught by the model binding. File: `routes/web/authenticated.php`

- [ ] T015 Frontend: Update `Index.vue` — add "Export CSV" button in the header actions area (alongside "View Report" and "Create Check-In"). Use `<a :href="route('check-ins.export')" class="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Export CSV</a>`. No feature flag gating needed — export works for all check-ins. File: `resources/js/Pages/Staff/CheckIns/Index.vue`

---

## Phase 4: CSV Import

- [ ] T016 Import class: Create `CheckInImport` implementing `ToCollection`, `WithHeadingRow`, `WithValidation`. File: `app/Imports/CheckIn/CheckInImport.php`

  Constructor takes `int $importerId` and `?int $coordinatorId = null`.

  `collection(Collection $rows)`: For each row:
  1. Find CheckIn by `uuid` — skip if not found
  2. If `$this->coordinatorId`, verify check-in's package belongs to that coordinator — skip if not
  3. If row has `status` = `completed` and check-in is Pending/InProgress: update `status = CheckInStatusEnum::Completed`, `completed_at = now()`, `completed_by_id = $this->importerId`
  4. If row has `summary_notes`: update `summary_notes = '[Imported] ' . $row['summary_notes']`

  `rules()`: `['*.uuid' => 'required|string|exists:check_ins,uuid', '*.status' => 'nullable|string|in:completed', '*.summary_notes' => 'nullable|string|max:10000']`

- [ ] T017 Controller: Create `CheckInImportController` with single `__invoke(Request $request)` method. Validate: `$request->validate(['file' => 'required|file|mimes:csv,txt|max:5120'])`. Authorize: `Gate::authorize('manage-check-ins')`. Get coordinator scoping same as export. Run `Excel::import(new CheckInImport(auth()->id(), $coordinatorId), $request->file('file'))`. Redirect back with success message including count of processed rows. File: `app/Http/Controllers/Staff/CheckIn/CheckInImportController.php`

- [ ] T018 Route: Add import route inside the existing `check-ins.` route group. Add `Route::post('/import', \App\Http\Controllers\Staff\CheckIn\CheckInImportController::class)->name('import');` — place before the `/{checkIn}` wildcard. File: `routes/web/authenticated.php`

- [ ] T019 Frontend: Update `Index.vue` — add "Import CSV" button next to Export. Add a hidden `<input type="file" ref="fileInput" accept=".csv" @change="handleImport" />`. On button click, trigger `fileInput.value?.click()`. On file selected, submit via `router.post(route('check-ins.import'), { file: event.target.files[0] }, { forceFormData: true, onSuccess: () => { fileInput.value!.value = '' } })`. Import `router` from `@inertiajs/vue3`. Add `const fileInput = ref<HTMLInputElement | null>(null)`. File: `resources/js/Pages/Staff/CheckIns/Index.vue`

---

## Phase 5: Seeder

- [ ] T020 Seeder: Create `CoordinatorCheckInSeeder` via `php artisan make:seeder CoordinatorCheckInSeeder --no-interaction`. File: `database/seeders/CoordinatorCheckInSeeder.php`

  `run()` method:
  1. Pick first `CareCoordinator` in seeded data, set `check_ins_enabled = true`, `check_in_cadence_months = 3`, `is_internal_coordination = true`
  2. For each of that coordinator's active packages (up to 5): create 2 CheckIn records using factory — one `Completed` (with summary, wellbeing rating, completed_at 2 months ago) and one `Pending` (due in 1 month, type = Hybrid, assigned to `case_manager_id`)
  3. Pick second coordinator if exists, set `check_ins_enabled = true`, `is_internal_coordination = false`, create External check-ins assigned to `owner_user_id`

- [ ] T021 [P] Factory: Update `CheckInFactory` — add `hybrid()` state that sets `type => CheckInTypeEnum::Hybrid`. File: `domain/CheckIn/Factories/CheckInFactory.php`

- [ ] T022 DatabaseSeeder: Call `CoordinatorCheckInSeeder` from the main `DatabaseSeeder` (or wherever `CheckInSeeder` is called). Check existing seeder call chain and add after it. File: `database/seeders/DatabaseSeeder.php`

---

## Phase 6: Tests

- [ ] T023 Test: `GenerateCoordinatorCheckInsActionTest` — Pest feature test. File: `tests/Feature/CheckIn/Actions/GenerateCoordinatorCheckInsActionTest.php`

  Test cases:
  - `it generates hybrid check-in for internal coordination coordinator` — create CareCoordinator with `is_internal_coordination=true, check_ins_enabled=true`, active package with case_manager_id set, assert CheckIn created with `type=Hybrid`, `assigned_user_id=case_manager_id`
  - `it generates external check-in for non-internal coordinator` — assert `type=External`, `assigned_user_id=owner_user_id`
  - `it respects cadence hierarchy - package override wins` — set ClientCadenceSetting to 1 month, coordinator to 6 months, assert due_date is 1 month from commencement
  - `it respects cadence hierarchy - coordinator default used when no package override` — no ClientCadenceSetting, coordinator 6 months, assert due_date is 6 months
  - `it skips when check_ins_enabled is false` — assert 0 generated
  - `it skips when feature flag is inactive` — `Feature::define('coordinator-check-ins-feature', fn () => false)`, assert 0 generated
  - `it skips when pending check-in exists` — create pending Hybrid, assert no duplicate
  - `it flags check-in when assigned user is null` — no case_manager_id, assert `is_flagged=true`
  - `it generates uuid on check-in creation` — assert uuid is not null, is valid UUID format

- [ ] T024 [P] Test: `CheckInExportControllerTest` — Pest feature test. File: `tests/Feature/CheckIn/Http/Controllers/CheckInExportControllerTest.php`

  Test cases:
  - `it downloads csv for staff user` — act as admin, GET export route, assert 200 + CSV content type
  - `it scopes csv to coordinator packages for coordinator user` — create coordinator with 2 packages, create check-ins on coordinator's packages AND other packages, act as coordinator user, assert CSV only contains their check-ins
  - `it includes uuid column in csv` — assert first column header is 'uuid'
  - `it requires manage-check-ins permission` — act as user without permission, assert 403

- [ ] T025 [P] Test: `CheckInImportControllerTest` — Pest feature test. File: `tests/Feature/CheckIn/Http/Controllers/CheckInImportControllerTest.php`

  Test cases:
  - `it marks check-in as completed via csv import` — create pending CheckIn, upload CSV with uuid + status=completed, assert status changed to Completed, completed_at set, completed_by_id = importer
  - `it updates summary notes with import prefix` — upload CSV with summary_notes, assert stored as `[Imported] notes here`
  - `it rejects invalid uuid` — upload CSV with nonexistent uuid, assert validation error
  - `it scopes import to coordinator packages` — coordinator user tries to import check-in from another coordinator's package, assert that check-in is NOT updated
  - `it requires file upload` — POST without file, assert validation error
  - `it requires manage-check-ins permission` — assert 403 without permission

- [ ] T026 Test: Update existing `ProcessCheckInsJobTest` — add test case: `it calls GenerateCoordinatorCheckInsAction`. Mock or spy on the action and assert it was called. File: `tests/Feature/CheckIn/Jobs/ProcessCheckInsJobTest.php` (or wherever the existing test lives)

---

## Phase 7: Polish

- [ ] T027 Run `vendor/bin/pint --dirty` to fix formatting on all new/modified PHP files.

- [ ] T028 Run `php artisan test --compact --filter=CheckIn` to verify all check-in tests pass.

- [ ] T029 Run `npm run build` to verify no frontend build errors from Index.vue changes.

- [ ] T030 Verify migration runs cleanly: `php artisan migrate --no-interaction` on local database.
