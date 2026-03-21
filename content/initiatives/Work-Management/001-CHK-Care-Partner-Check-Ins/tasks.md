---
title: "Implementation Tasks: Care Partner Check-Ins"
---

# Implementation Tasks: Care Partner Check-Ins

**Mode**: AI | **Spec**: [spec.md](spec.md) | **Plan**: [plan.md](plan.md) | **Date**: 2026-03-03

---

## Phase 1: Foundation — Migrations, Enums, Models, Factories

> Blocking for all subsequent phases. No story-level work until Phase 1 is complete.

- [ ] T001 Migration: `create_check_ins_table` — columns: `id` bigIncrements, `client_id` foreignId constrained('packages_clients')->nullOnDelete(), `package_id` foreignId constrained('packages')->nullOnDelete(), `assigned_user_id` foreignId nullable constrained('users')->nullOnDelete(), `type` string(20)->comment('internal, external, ad_hoc'), `status` string(20)->default('pending')->comment('pending, in_progress, completed, missed, cancelled'), `due_date` date, `completed_at` datetime nullable, `completed_by_id` foreignId nullable constrained('users')->nullOnDelete(), `wellbeing_rating` unsignedTinyInteger nullable, `summary_notes` text nullable, `follow_up_actions` text nullable, `previous_summary` text nullable, `cancellation_reason` string(255) nullable, `cancelled_at` datetime nullable, `cancelled_by_id` foreignId nullable constrained('users')->nullOnDelete(), `is_flagged` boolean default(false), timestamps. Indexes: composite (`assigned_user_id`, `status`, `due_date`), (`client_id`), (`status`, `due_date`). File: `database/migrations/xxxx_create_check_ins_table.php`

- [ ] T002 [P] Migration: `create_check_in_attempts_table` — columns: `id` bigIncrements, `check_in_id` foreignId constrained()->cascadeOnDelete(), `user_id` foreignId constrained('users')->nullOnDelete(), `reason` string(50)->comment('no_answer, client_unavailable, wrong_number, client_declined, other'), `notes` text nullable, `attempted_at` datetime, timestamps. File: `database/migrations/xxxx_create_check_in_attempts_table.php`

- [ ] T003 [P] Migration: `create_risk_check_in_questions_table` — columns: `id` bigIncrements, `risk_id` foreignId constrained()->cascadeOnDelete(), `question_text` text, `answer_type` string(30)->comment('free_text, yes_no, multiple_choice, rating_1_5'), `answer_options` json nullable, `created_by_id` foreignId constrained('users')->nullOnDelete(), `sort_order` unsignedSmallInteger default(0), timestamps. File: `database/migrations/xxxx_create_risk_check_in_questions_table.php`

- [ ] T004 [P] Migration: `create_check_in_responses_table` — columns: `id` bigIncrements, `check_in_id` foreignId constrained()->cascadeOnDelete(), `risk_check_in_question_id` foreignId constrained()->cascadeOnDelete(), `risk_id` foreignId constrained()->nullOnDelete(), `response_value` text, `responded_by_id` foreignId constrained('users')->nullOnDelete(), `responded_at` datetime, timestamps. Index: (`risk_id`). File: `database/migrations/xxxx_create_check_in_responses_table.php`

- [ ] T005 [P] Migration: `create_client_cadence_settings_table` — columns: `id` bigIncrements, `client_id` foreignId constrained('packages_clients')->unique(), `cadence_months` unsignedTinyInteger, `set_by_id` foreignId constrained('users')->nullOnDelete(), `effective_date` date, timestamps. File: `database/migrations/xxxx_create_client_cadence_settings_table.php`

- [ ] T006 [P] Enum: `CheckInStatusEnum` — cases: PENDING='pending', IN_PROGRESS='in_progress', COMPLETED='completed', MISSED='missed', CANCELLED='cancelled'. Add `#[Label('Pending')]` and `#[Colour('gray')]` attributes (Pending=gray, In Progress=blue, Completed=green, Missed=red, Cancelled=gray). File: `domain/CheckIn/Enums/CheckInStatusEnum.php`

- [ ] T007 [P] Enum: `CheckInTypeEnum` — cases: INTERNAL='internal', EXTERNAL='external', AD_HOC='ad_hoc'. Add `#[Label]` attributes. File: `domain/CheckIn/Enums/CheckInTypeEnum.php`

- [ ] T008 [P] Enum: `AttemptReasonEnum` — cases: NO_ANSWER='no_answer', CLIENT_UNAVAILABLE='client_unavailable', WRONG_NUMBER='wrong_number', CLIENT_DECLINED='client_declined', OTHER='other'. Add `#[Label]` attributes. File: `domain/CheckIn/Enums/AttemptReasonEnum.php`

- [ ] T009 [P] Enum: `AnswerTypeEnum` — cases: FREE_TEXT='free_text', YES_NO='yes_no', MULTIPLE_CHOICE='multiple_choice', RATING_1_5='rating_1_5'. Add `#[Label]` attributes. File: `domain/CheckIn/Enums/AnswerTypeEnum.php`

- [ ] T010 Model: `CheckIn` — cast `type` to CheckInTypeEnum, `status` to CheckInStatusEnum via `casts()` method. Constants: `DEFAULT_CADENCE_MONTHS = 3`, `MISSED_THRESHOLD_DAYS = 30`, `FLAG_THRESHOLD_ATTEMPTS = 3` with PHPDoc. Relationships: `client()` BelongsTo PackagesClient, `package()` BelongsTo Package, `assignedUser()` BelongsTo User, `completedBy()` BelongsTo User, `cancelledBy()` BelongsTo User, `attempts()` HasMany CheckInAttempt, `responses()` HasMany CheckInResponse. Scopes: `scopeOverdue()` (pending + due_date < today), `scopeToday()` (pending + due_date = today), `scopeUpcoming()` (pending + due_date > today AND <= today+30), `scopeForUser(User $user)`, `scopeFlagged()`, `scopeOfType(CheckInTypeEnum $type)`. File: `domain/CheckIn/Models/CheckIn.php`

- [ ] T011 [P] Model: `CheckInAttempt` — cast `reason` to AttemptReasonEnum, `attempted_at` to datetime via `casts()`. Relationships: `checkIn()` BelongsTo CheckIn, `user()` BelongsTo User. File: `domain/CheckIn/Models/CheckInAttempt.php`

- [ ] T012 [P] Model: `RiskCheckInQuestion` — cast `answer_type` to AnswerTypeEnum, `answer_options` to array via `casts()`. Relationships: `risk()` BelongsTo Risk, `createdBy()` BelongsTo User, `responses()` HasMany CheckInResponse. File: `domain/Risk/Models/RiskCheckInQuestion.php`

- [ ] T013 [P] Model: `CheckInResponse` — cast `responded_at` to datetime via `casts()`. Relationships: `checkIn()` BelongsTo CheckIn, `question()` BelongsTo RiskCheckInQuestion, `risk()` BelongsTo Risk, `respondedBy()` BelongsTo User. File: `domain/CheckIn/Models/CheckInResponse.php`

- [ ] T014 [P] Model: `ClientCadenceSetting` — cast `effective_date` to date via `casts()`. Relationships: `client()` BelongsTo PackagesClient, `setBy()` BelongsTo User. File: `domain/CheckIn/Models/ClientCadenceSetting.php`

- [ ] T015 Add `checkInQuestions()` HasMany relationship to existing Risk model. Returns `RiskCheckInQuestion::class`. File: `domain/Risk/Models/Risk.php`

- [ ] T016 [P] Factory: `CheckInFactory` — define states: `pending()`, `inProgress()`, `completed()`, `missed()`, `cancelled()`, `internal()`, `external()`, `adHoc()`, `flagged()`, `withAttempts(int $count)`. Uses existing User, Package, PackagesClient factories. File: `database/factories/CheckInFactory.php`

- [ ] T017 [P] Factory: `CheckInAttemptFactory` — define default with random AttemptReasonEnum case, nullable notes, `attempted_at` now(). File: `database/factories/CheckInAttemptFactory.php`

- [ ] T018 [P] Factory: `RiskCheckInQuestionFactory` — define default with fake question_text, random AnswerTypeEnum, null answer_options. State: `multipleChoice()` sets answer_type to MULTIPLE_CHOICE and answer_options to ['Option A', 'Option B', 'Option C']. File: `database/factories/RiskCheckInQuestionFactory.php`

- [ ] T019 [P] Factory: `CheckInResponseFactory` — define default with fake response_value, links to CheckIn and RiskCheckInQuestion. File: `database/factories/CheckInResponseFactory.php`

- [ ] T020 Run migrations: `php artisan migrate`. Verify all 5 tables created with correct columns and indexes.

---

## Phase 2: Data Classes & Feature Flag

> Blocking for Actions and Controllers.

- [ ] T021 [P] Data: `CheckInData` — `#[TypeScript]` `#[MapName(SnakeCaseMapper::class)]`. Properties from CheckIn model for read/display. Include `fromModel()` static factory. File: `domain/CheckIn/Data/CheckInData.php`

- [ ] T022 [P] Data: `CheckInIndexData` — `#[TypeScript]` `#[MapName(SnakeCaseMapper::class)]`. Lightweight data for dashboard cards: id, clientName, clientPreferredName, type (CheckInTypeEnum), status (CheckInStatusEnum), dueDate, questionCount (int), attemptCount (int), isFlagged (bool), previousSummary (?string). File: `domain/CheckIn/Data/CheckInIndexData.php`

- [ ] T023 [P] Data: `CompleteCheckInData` — `#[TypeScript]` `#[MapName(SnakeCaseMapper::class)]`. Properties: `summaryNotes` string required max:10000, `wellbeingRating` int required min:1 max:5, `followUpActions` ?string nullable max:5000, `responses` array of CheckInResponseData. File: `domain/CheckIn/Data/CompleteCheckInData.php`

- [ ] T024 [P] Data: `CheckInResponseData` — `#[TypeScript]` `#[MapName(SnakeCaseMapper::class)]`. Properties: `riskCheckInQuestionId` int required exists:risk_check_in_questions,id, `responseValue` string required. File: `domain/CheckIn/Data/CheckInResponseData.php`

- [ ] T025 [P] Data: `LogAttemptData` — `#[TypeScript]` `#[MapName(SnakeCaseMapper::class)]`. Properties: `reason` string required in:no_answer,client_unavailable,wrong_number,client_declined,other, `notes` ?string nullable max:2000. File: `domain/CheckIn/Data/LogAttemptData.php`

- [ ] T026 [P] Data: `CancelCheckInData` — `#[TypeScript]` `#[MapName(SnakeCaseMapper::class)]`. Properties: `cancellationReason` string required max:255. File: `domain/CheckIn/Data/CancelCheckInData.php`

- [ ] T027 [P] Data: `CreateAdHocCheckInData` — `#[TypeScript]` `#[MapName(SnakeCaseMapper::class)]`. Properties: `type` string required in:internal,external,ad_hoc (default ad_hoc), `notes` ?string nullable max:2000. File: `domain/CheckIn/Data/CreateAdHocCheckInData.php`

- [ ] T028 [P] Data: `StoreRiskCheckInQuestionData` — `#[TypeScript]` `#[MapName(SnakeCaseMapper::class)]`. Properties: `questionText` string required max:2000, `answerType` string required in:free_text,yes_no,multiple_choice,rating_1_5, `answerOptions` ?array nullable required_if:answerType,multiple_choice min:2 max:10. File: `domain/CheckIn/Data/StoreRiskCheckInQuestionData.php`

- [ ] T029 [P] Data: `CompletionReportFilterData` — `#[TypeScript]` `#[MapName(SnakeCaseMapper::class)]`. Properties: `period` ?string nullable (e.g. 'this_quarter', 'last_quarter', 'last_6_months', 'last_year'), `team` ?string nullable, `type` ?string nullable in:internal,external. File: `domain/CheckIn/Data/CompletionReportFilterData.php`

- [ ] T030 Feature flag: Register `care-partner-check-ins` in Pennant. Create feature class extending `Feature` with `resolve()` returning false by default. Register in `AppServiceProvider` or feature directory following existing pattern. File: `app/Features/CarePartnerCheckInsFeature.php` (or wherever existing Pennant features live)

- [ ] T031 Policy: `CheckInPolicy` — methods: `view(User $user, CheckIn $checkIn): Response` (allow if assigned or staff), `complete(User $user, CheckIn $checkIn): Response` (allow if assigned and status is pending/in_progress), `cancel(User $user, CheckIn $checkIn): Response` (allow if status is pending), `logAttempt(User $user, CheckIn $checkIn): Response` (allow if assigned and status is pending). All return `Response::allow()` / `Response::deny('reason')`. Register in `AuthServiceProvider`. File: `domain/CheckIn/Policies/CheckInPolicy.php`

---

## Phase 3: Actions — Core Business Logic [US2, US3, US7, US9, US10]

> Blocking for Controllers. All actions use `AsAction` trait with `authorize()` method.

- [ ] T032 [US3] Action: `GenerateCheckInsAction` — `use AsAction`. `handle()` accepts no params. Query ACTIVE packages (stage = PackageStageEnum::ACTIVE) with `commencement_date` set and at least 1 month old. For each package: (a) check if pending/in_progress CheckIn exists for client+type — skip if yes, (b) determine due date from last completed CheckIn completion date + cadence months (check ClientCadenceSetting, fallback CheckIn::DEFAULT_CADENCE_MONTHS), or commencement_date + cadence if no prior check-in, (c) if due date <= today, create CheckIn with status PENDING, assigned to `case_manager_id` for INTERNAL or care coordinator for EXTERNAL, (d) snapshot previous_summary from last completed check-in's summary_notes. Chunk by 200. File: `domain/CheckIn/Actions/GenerateCheckInsAction.php`

- [ ] T033 [US10] Action: `MarkMissedCheckInsAction` — `use AsAction`. `handle()` queries CheckIn::where('status', CheckInStatusEnum::PENDING)->where('due_date', '<=', today()->subDays(CheckIn::MISSED_THRESHOLD_DAYS)). For each: update status to MISSED, then call GenerateCheckInsAction logic to create replacement. File: `domain/CheckIn/Actions/MarkMissedCheckInsAction.php`

- [ ] T034 [US2] Action: `CompleteCheckInAction` — `use AsAction`. `authorize()` calls Gate::authorize('complete', $checkIn). `handle(CheckIn $checkIn, CompleteCheckInData $data)`: update status to COMPLETED, set completed_at now(), completed_by_id to auth user, wellbeing_rating, summary_notes, follow_up_actions. Create CheckInResponse for each response in data (set risk_id from question's risk_id, responded_by_id auth user, responded_at now()). Then generate next scheduled check-in: new CheckIn with due_date = today + cadence, previous_summary = current summary_notes. Return updated CheckInData. File: `domain/CheckIn/Actions/CompleteCheckInAction.php`

- [ ] T035 [US7] Action: `LogCheckInAttemptAction` — `use AsAction`. `authorize()` calls Gate::authorize('logAttempt', $checkIn). `handle(CheckIn $checkIn, LogAttemptData $data)`: create CheckInAttempt with check_in_id, user_id auth, reason, notes, attempted_at now(). Then count attempts on check-in — if >= CheckIn::FLAG_THRESHOLD_ATTEMPTS, set is_flagged = true on CheckIn. Return CheckInAttempt. File: `domain/CheckIn/Actions/LogCheckInAttemptAction.php`

- [ ] T036 [US9] Action: `CreateAdHocCheckInAction` — `use AsAction`. `authorize()` checks user can create for client. `handle(PackagesClient $client, CreateAdHocCheckInData $data)`: create CheckIn with type AD_HOC, status PENDING, due_date today, assigned_user_id auth user, client_id, package_id from client's primary package. Snapshot previous_summary from last completed check-in. File: `domain/CheckIn/Actions/CreateAdHocCheckInAction.php`

- [ ] T037 Action: `CancelCheckInAction` — `use AsAction`. `authorize()` calls Gate::authorize('cancel', $checkIn). `handle(CheckIn $checkIn, CancelCheckInData $data)`: update status to CANCELLED, cancellation_reason, cancelled_at now(), cancelled_by_id auth user. Return CheckInData. File: `domain/CheckIn/Actions/CancelCheckInAction.php`

- [ ] T038 Action: `SaveCheckInDraftAction` — `use AsAction`. `handle(CheckIn $checkIn, CompleteCheckInData $data)`: update summary_notes, wellbeing_rating, follow_up_actions on CheckIn. Set status to IN_PROGRESS if currently PENDING. Do NOT create responses yet (draft state). File: `domain/CheckIn/Actions/SaveCheckInDraftAction.php`

---

## Phase 4: Job & Notification [US3, US10]

- [ ] T039 [US3, US10] Job: `ProcessCheckInsJob` — `implements ShouldQueue`. `handle()`: call `GenerateCheckInsAction::run()` then `MarkMissedCheckInsAction::run()`. Register in `app/Console/Kernel.php` under the production-only scheduling block: `$schedule->job(ProcessCheckInsJob::class)->daily()`. File: `app/Jobs/ProcessCheckInsJob.php`

- [ ] T040 [US3] Job: `CheckInNotificationJob` — `implements ShouldQueue, ShouldBeUnique`. Accepts User model. Query check_ins where assigned_user_id = user, status PENDING, group into overdue (due_date < today) and upcoming (due_date between today and today+7). Send notification with overdue and upcoming arrays. Schedule in `Kernel.php`: weekly on Mon/Wed, gated by Nova setting `ff_send_new_check_in_notifications`. File: `app/Jobs/CheckInNotificationJob.php`

---

## Phase 5: Controllers & Routes [US1, US2, US4, US5, US6, US7, US8, US9]

- [ ] T041 [US1, US2] Controller: `CheckInController` — `show(CheckIn $checkIn)`: Gate::authorize('view', $checkIn). Eager load: attempts, responses.question, client, package, assignedUser. Resolve risk questions: query RiskCheckInQuestion where risk_id in client's primary package's active risk IDs. Return `Inertia::render('Staff/CheckIns/Show', ['checkIn' => CheckInData::from($checkIn), 'riskQuestions' => ..., 'attemptReasons' => AttemptReasonEnum::cases()])`. `complete(CheckIn $checkIn, CompleteCheckInData $data)`: call CompleteCheckInAction, redirect to dashboard. `saveDraft(CheckIn $checkIn, CompleteCheckInData $data)`: call SaveCheckInDraftAction, return back. `cancel(CheckIn $checkIn, CancelCheckInData $data)`: call CancelCheckInAction, redirect to dashboard. File: `app/Http/Controllers/Staff/CheckIn/CheckInController.php`

- [ ] T042 [US7] Controller: `CheckInAttemptController` — `store(CheckIn $checkIn, LogAttemptData $data)`: call LogCheckInAttemptAction, return back. File: `app/Http/Controllers/Staff/CheckIn/CheckInAttemptController.php`

- [ ] T043 [US8] Controller: `CheckInReportController` — `index(CompletionReportFilterData $filters)`: aggregate query on check_ins grouped by assigned_user_id. Compute KPIs: completion_rate (completed / (completed + overdue + missed)), completed count, overdue count, flagged count. Per-care-partner rows: user name, team, due, completed, overdue, missed, rate, flagged. Filter by period, team, type. Join users for names, teams for team name. Return `Inertia::render('Staff/CheckIns/Report', ['rows' => ..., 'filters' => ..., 'kpis' => ..., 'teams' => ...])`. `export(CompletionReportFilterData $filters)`: return `(new CheckInCompletionExport($filters))->download('check-in-report.csv')`. File: `app/Http/Controllers/Staff/CheckIn/CheckInReportController.php`

- [ ] T044 [US9] Controller: `AdHocCheckInController` — `store(PackagesClient $client, CreateAdHocCheckInData $data)`: call CreateAdHocCheckInAction, redirect to check-in show page. File: `app/Http/Controllers/Staff/CheckIn/AdHocCheckInController.php`

- [ ] T045 [US5, US6] Controller: `RiskCheckInQuestionController` — `index(Risk $risk)`: return risk's checkInQuestions ordered by sort_order. `store(Risk $risk, StoreRiskCheckInQuestionData $data)`: create RiskCheckInQuestion on risk with created_by_id = auth user. `update(Risk $risk, RiskCheckInQuestion $question, StoreRiskCheckInQuestionData $data)`: update question_text, answer_type, answer_options. `destroy(Risk $risk, RiskCheckInQuestion $question)`: delete question. All return back(). File: `app/Http/Controllers/Staff/CheckIn/RiskCheckInQuestionController.php`

- [ ] T046 Routes: Register all check-in routes in `routes/web/authenticated.php` within a group: `Route::prefix('staff/check-ins')->name('check-ins.')->middleware('feature-flag:care-partner-check-ins')->group(...)`. Register: GET `/{checkIn}` show, PUT `/{checkIn}/complete` complete, PUT `/{checkIn}/draft` saveDraft, PUT `/{checkIn}/cancel` cancel, POST `/{checkIn}/attempts` storeAttempt, GET `/report` index, GET `/report/export` export. Separate group for ad-hoc: POST `staff/clients/{client}/check-ins`. Separate group for risk questions: CRUD under `staff/risks/{risk}/check-in-questions`. All with `feature-flag:care-partner-check-ins` middleware.

- [ ] T047 [US8] Export: `CheckInCompletionExport` — implements `FromQuery`, `WithHeadings`, `WithMapping`. `query()`: build same aggregate query as report controller. `headings()`: ['Care Partner', 'Team', 'Due', 'Completed', 'Overdue', 'Missed', 'Completion Rate', 'Flagged']. `map($row)`: format completion_rate as percentage. File: `app/Exports/CheckInCompletionExport.php`

- [ ] T048 [US1, US4] Dashboard integration: Update `DashboardRepository::getCheckInActivitiesForCarePartner()` — check `Feature::active('care-partner-check-ins')`. If active: query CheckIn::forUser(auth()->user())->whereIn('status', [PENDING, IN_PROGRESS])->with('client', 'attempts')->get(). Map to CheckInIndexData. Group by overdue/today/upcoming using scopes. If inactive: keep existing package-date logic. File: `app/Repositories/DashboardRepository.php`

---

## Phase 6: Frontend — TypeScript Types & Vue Pages [US1, US2, US4, US5, US6, US7, US8, US9]

- [ ] T049 TypeScript types: Create `check-in.d.ts` with all types from plan: CheckInStatus, CheckInType, AttemptReason, AnswerType, CheckIn, CheckInClient, CheckInPackage, CheckInUser, CheckInAttempt, RiskCheckInQuestion, CheckInResponse, CompletionReportRow. File: `resources/js/types/check-in.d.ts`

- [ ] T050 [P] [US2] Bespoke component: `WellbeingRating.vue` — `<script setup lang="ts">`. `type Props = { modelValue: number | null }`. `type Emits = { (e: 'update:modelValue', value: number): void }`. Render 5 number buttons (1-5) with labels (Poor, Fair, Good, Very Good, Excellent). Selected button: `bg-teal-700 text-white`. Unselected: `bg-gray-100 text-gray-700 hover:bg-gray-200`. File: `resources/js/Pages/Staff/CheckIns/Partials/WellbeingRating.vue`

- [ ] T051 [P] [US7] Bespoke component: `AttemptTimeline.vue` — `<script setup lang="ts">`. `type Props = { attempts: CheckInAttempt[] }`. Render numbered circles (1, 2, 3...) with connecting vertical line. Each attempt shows: reason label, notes (if any), date, user name. Color: red for no_answer/wrong_number, amber for client_unavailable/other, gray for client_declined. File: `resources/js/Pages/Staff/CheckIns/Partials/AttemptTimeline.vue`

- [ ] T052 [P] [US2, US5] Bespoke component: `RiskQuestionGroup.vue` — `<script setup lang="ts">`. `type Props = { riskName: string; questions: RiskCheckInQuestion[]; responses: Record<number, string> }`. `type Emits = { (e: 'update:responses', value: Record<number, string>): void }`. Render collapsible section per risk with CommonBadge for risk name. For each question: render appropriate input based on answer_type — CommonRadioGroup for yes_no (with value-key="value"), CommonSelectMenu for multiple_choice (with value-key="value"), CommonTextarea for free_text, custom 1-5 buttons for rating_1_5. File: `resources/js/Pages/Staff/CheckIns/Partials/RiskQuestionGroup.vue`

- [ ] T053 [US2, US7] Page: `Show.vue` — `<script setup lang="ts">`. Two-column layout (1/3 context + 2/3 form). `type Props = { checkIn: CheckIn; attemptReasons: { value: AttemptReason; label: string }[]; riskQuestions: RiskCheckInQuestion[] }`. Single `useForm` with: summary_notes, wellbeing_rating, follow_up_actions, responses (Record<number, string>). Context sidebar (CommonCard): client name/dob/phone, package name, previous summary (or "First check-in for this client"), active risks with question counts. Form section: RiskQuestionGroup per risk, WellbeingRating, CommonTextarea for summary_notes and follow_up_actions. AttemptTimeline if attempts exist. CommonAlert amber banner if is_flagged. Actions: CommonButton "Save Draft" (PUT draft), CommonButton "Complete Check-In" (PUT complete). Inline "Log Attempt" section with CommonRadioGroup for reason + optional notes textarea + submit button. "Cancel Check-In" link in header with modal for reason. Debounced auto-save: watch form fields, PUT draft every 30s or on blur. `beforeunload` warning when dirty. `defineOptions({ layout: (h: any, page: any) => h(AppLayout, { title: 'Check-In' }, () => page) })`. File: `resources/js/Pages/Staff/CheckIns/Show.vue`

- [ ] T054 [US8] Page: `Report.vue` — `<script setup lang="ts">`. `type Props = { rows: CompletionReportRow[]; filters: { period: string; team: string | null; type: CheckInType | null }; kpis: { completion_rate: number; completed: number; overdue: number; flagged: number }; teams: { value: string; label: string }[] }`. Header: 4 CommonKpiCard (Completion Rate with progress bar, Completed, Overdue in red, Flagged in amber). Filter bar: 3 CommonSelectMenu (Period, Team, Type) — changes trigger `router.visit()` with preserveScroll. Table (CommonCard wrapping): columns for Care Partner, Team, Due, Completed, Overdue, Missed, Rate (CommonBadge color-coded), Flagged. CommonButton "Export CSV" triggers GET report/export. Pagination if >20 rows. `defineOptions({ layout: ... })`. File: `resources/js/Pages/Staff/CheckIns/Report.vue`

- [ ] T055 [US5, US6] Page: `PackageCheckInQuestions.vue` — `<script setup lang="ts">`. New tab content for PackageViewLayout. `type Props = { package: { id: number; name: string }; risks: { id: number; name: string; questions: RiskCheckInQuestion[] }[]; recentResponses: { check_in_id: number; client_name: string; completed_at: string; responses: CheckInResponse[] }[] }`. `type Emits = { (e: 'questionAdded'): void; (e: 'questionRemoved', id: number): void }`. Questions grouped by risk with CommonBadge for risk name and answer type. Add Question form: `useForm` with risk_id, question_text, answer_type, answer_options. Edit/delete buttons per question. Recent Responses section below. CommonAlert info banner explaining inheritance. File: `resources/js/Pages/Packages/tabs/PackageCheckInQuestions.vue`

- [ ] T056 [US5] Register PackageCheckInQuestions tab: Add "Check-In Questions" to the tabs array in `PackageController@show` (or wherever package tabs are defined). Conditionally include behind `Feature::active('care-partner-check-ins')`. Pass `risks` with their checkInQuestions and `recentResponses` as deferred props. Modify `PackageViewLayout` or `PackageHeader` to render the new tab.

- [ ] T057 [US1, US4] Dashboard card updates: Modify existing dashboard check-in card component to show: CommonBadge for type (INT/EXT), CommonBadge for question count ("2 questions"), attempt count ("3 attempts"), "Flagged" amber CommonBadge when is_flagged, "First" purple CommonBadge when previous_summary is null. Wrap new card variant in `<HasFeatureFlag feature="care-partner-check-ins">`. Card links to `route('check-ins.show', checkIn.id)`.

---

## Phase 7: Edge Cases & Polish [US2, US3, US7, US10, US11]

- [ ] T058 [US2] Care partner reassignment: Update `UpdateCaseManagerNotification` listener in `app/Listeners/UpdateCaseManagerNotification.php`. In `handle(PackageCaseManagerUpdated $event)`: query CheckIn::where('package_id', $event->package->id)->whereIn('status', [PENDING, IN_PROGRESS])->update(['assigned_user_id' => $event->package->case_manager_id]).

- [ ] T059 [US3] Unassigned check-in handling: In `GenerateCheckInsAction`, when package has no `case_manager_id`, create CheckIn with assigned_user_id = null. Set is_flagged = true to surface for coordination team.

- [ ] T060 [P] Empty state: In Show.vue, when checkIn.risk_questions is empty, show "No clinical questions attached" in the risk questions section. In dashboard, when no check-ins exist, show "No check-ins due — all caught up" message.

---

## Phase 8: Tests

> Run after each sub-phase. Tests marked [P] can run in parallel.

### Unit Tests

- [ ] T061 [P] Test: `CheckInTest` — test model relationships (client, package, assignedUser, completedBy, cancelledBy, attempts, responses), test scopes (overdue, today, upcoming, forUser, flagged, ofType), test enum casts. File: `tests/Unit/CheckIn/Models/CheckInTest.php`

- [ ] T062 [P] Test: `CheckInAttemptTest` — test relationships (checkIn, user), test reason enum cast. File: `tests/Unit/CheckIn/Models/CheckInAttemptTest.php`

- [ ] T063 [P] Test: `CompleteCheckInActionTest` — test: status changes to COMPLETED, completed_at set, wellbeing_rating saved, responses created for each question, next check-in generated with correct due date and previous_summary, rejects if status not PENDING/IN_PROGRESS. File: `tests/Unit/CheckIn/Actions/CompleteCheckInActionTest.php`

- [ ] T064 [P] Test: `GenerateCheckInsActionTest` — test: creates check-in for active package with due date passed, skips terminated packages, skips packages with existing pending check-in, uses custom cadence from ClientCadenceSetting, uses commencement_date for first check-in, assigns to case_manager_id. File: `tests/Unit/CheckIn/Actions/GenerateCheckInsActionTest.php`

- [ ] T065 [P] Test: `LogCheckInAttemptActionTest` — test: creates attempt record, check-in stays pending, sets is_flagged after 3 attempts, does not flag at 2 attempts. File: `tests/Unit/CheckIn/Actions/LogCheckInAttemptActionTest.php`

- [ ] T066 [P] Test: `MarkMissedCheckInsActionTest` — test: marks 31-day overdue as missed, leaves 29-day as pending, generates replacement check-in after marking missed. File: `tests/Unit/CheckIn/Actions/MarkMissedCheckInsActionTest.php`

- [ ] T067 [P] Test: `CancelCheckInActionTest` — test: status changes to cancelled, reason saved, cancelled_at and cancelled_by set, rejects cancel on completed check-in. File: `tests/Unit/CheckIn/Actions/CancelCheckInActionTest.php`

### Feature Tests

- [ ] T068 [P] Test: `CheckInControllerTest` — test: show returns correct Inertia component with check-in data, complete updates status and redirects, saveDraft preserves form data, cancel with reason, 403 when feature flag disabled, 403 when unauthorized. File: `tests/Feature/CheckIn/Http/Controllers/CheckInControllerTest.php`

- [ ] T069 [P] Test: `CheckInAttemptControllerTest` — test: store creates attempt, flags after 3, validates reason enum. File: `tests/Feature/CheckIn/Http/Controllers/CheckInAttemptControllerTest.php`

- [ ] T070 [P] Test: `CheckInReportControllerTest` — test: index returns KPIs and rows, filters by period/team/type, export returns CSV download. File: `tests/Feature/CheckIn/Http/Controllers/CheckInReportControllerTest.php`

- [ ] T071 [P] Test: `AdHocCheckInControllerTest` — test: creates ad-hoc check-in with type AD_HOC and today's date, doesn't affect scheduled check-ins. File: `tests/Feature/CheckIn/Http/Controllers/AdHocCheckInControllerTest.php`

- [ ] T072 [P] Test: `RiskCheckInQuestionControllerTest` — test: store creates question on risk, update modifies question, destroy removes question, validates answer_options required for multiple_choice. File: `tests/Feature/CheckIn/Http/Controllers/RiskCheckInQuestionControllerTest.php`

- [ ] T073 [P] Test: `ProcessCheckInsJobTest` — test: generates check-ins and marks missed in single run, handles empty data gracefully. File: `tests/Feature/CheckIn/Jobs/ProcessCheckInsJobTest.php`

- [ ] T074 Test: `CheckInPolicyTest` — test: assigned user can view/complete/logAttempt, non-assigned staff can view but not complete, pending check-in can be cancelled, completed check-in cannot be cancelled. File: `tests/Feature/CheckIn/Policies/CheckInPolicyTest.php`

---

## Phase 9: Finalize

- [ ] T075 Run `vendor/bin/pint --dirty` to fix formatting on all new/modified files.
- [ ] T076 Run `php artisan test --compact --filter=CheckIn` to verify all check-in tests pass.
- [ ] T077 Run `npm run build` to verify TypeScript types compile and Vue pages build without errors.

---

## Summary

| Metric | Count |
|--------|-------|
| **Total Tasks** | 77 |
| **Phase 1 (Foundation)** | 20 |
| **Phase 2 (Data + Flag)** | 11 |
| **Phase 3 (Actions)** | 7 |
| **Phase 4 (Jobs)** | 2 |
| **Phase 5 (Controllers)** | 8 |
| **Phase 6 (Frontend)** | 9 |
| **Phase 7 (Edge Cases)** | 3 |
| **Phase 8 (Tests)** | 14 |
| **Phase 9 (Finalize)** | 3 |
| **Parallelizable [P]** | 35 |
| **MVP (P1 stories)** | T001-T057 (US1-US4 covered) |

### Story Coverage

| Story | Tasks |
|-------|-------|
| US1 — Dashboard | T048, T057 |
| US2 — Complete Check-In | T034, T038, T041, T050, T052, T053 |
| US3 — Auto-Generate | T032, T039, T059 |
| US4 — Coordinator External | T041, T048, T057 |
| US5 — Clinical Questions | T045, T055, T056 |
| US6 — Review Responses | T045, T055 |
| US7 — Failed Attempt | T035, T042, T051, T053 |
| US8 — Completion Report | T043, T047, T054 |
| US9 — Ad-Hoc Creation | T036, T044 |
| US10 — Auto-Mark Missed | T033, T039 |
| US11 — Transition (P3) | T030, T048 (feature flag covers) |
| US12 — Cadence Config (P3) | T005, T014 (schema only, UI deferred) |
