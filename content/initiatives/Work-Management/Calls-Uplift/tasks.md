---
title: "Implementation Tasks: Calls Uplift"
---

# Implementation Tasks: Calls Uplift

**Mode**: AI Agent
**Generated**: 2026-03-05
**Source**: plan.md (clarified), spec.md, design.md, db-spec.md

**User Stories** (MVP Phase 1):
- **US2**: Manually Link Unmatched Calls (P1)
- **US3**: Complete Call Reviews from Inbox (P1)
- **US6**: View Call History — External Coordinators (P2, partial — Timeline only)

**Deferred**: US1 (Call Bridge UI, P2), US4 (Call Notes, P2), US5 (Recordings, P3), Batch Complete (Phase 2)

---

## Phase 1: Foundation — Database, Enums, Models

> Blocking for all subsequent phases. No dependencies between T001–T005.

- [ ] T001 [P] Migration: Add review fields to `aircall_calls` table. Columns: `review_status` (string nullable, indexed), `reviewed_at` (datetime nullable), `reviewed_by` (unsignedBigInteger nullable, FK→users.id), `reviewing_user_id` (unsignedBigInteger nullable, FK→users.id), `reviewing_started_at` (datetime nullable), `wrap_up_seconds` (integer default 900), `escalated_to_user_id` (unsignedBigInteger nullable, FK→users.id), `escalation_note` (text nullable), `escalated_at` (datetime nullable), `graph_call_id` (string(36) nullable, unique index), `case_note_id` (unsignedBigInteger nullable), `activity_id` (unsignedBigInteger nullable). Add composite index on `(user_id, review_status, started_at)`. All nullable — existing records stay NULL (no backfill). File: `app-modules/aircall/database/migrations/xxxx_add_review_fields_to_aircall_calls_table.php`

- [ ] T002 [P] Migration: Create `call_transcriptions` table. ULID primary key (`$table->ulid('id')->primary()`), `aircall_call_id` (unsignedBigInteger, foreign key → aircall_calls.id, unique index), `graph_transcription_id` (string(36), unique index), `transcription_text` (longText), `ai_summary` (text nullable), `ai_suggested_case_note` (text nullable), `ai_suggested_tasks` (json nullable — array of {title, description?} objects from Graph), `speaker_segments` (json nullable), `received_at` (datetime), timestamps. File: `app-modules/aircall/database/migrations/xxxx_create_call_transcriptions_table.php`

- [ ] T003 [P] Enum: `CallReviewStatus` — cases: PENDING_TRANSCRIPTION = 'pending_transcription', PENDING_REVIEW = 'pending_review', IN_REVIEW = 'in_review', REVIEWED = 'reviewed', ARCHIVED = 'archived', ESCALATED = 'escalated'. Use `GetEnumValues` trait. Add `transitionsTo(): array` method returning valid next states per status. File: `app-modules/aircall/src/Http/Data/Enums/CallReviewStatus.php`

- [ ] T004 [P] Model: `CallTranscription` — namespace `TrilogyCare\Aircall\Models`. Use `HasUlids` trait, `$table = 'call_transcriptions'`. Fillable: aircall_call_id, graph_transcription_id, transcription_text, ai_summary, ai_suggested_case_note, ai_suggested_tasks, speaker_segments, received_at. Casts: speaker_segments→json, ai_suggested_tasks→json, received_at→datetime. Relationship: `call(): BelongsTo` → AircallCall. File: `app-modules/aircall/src/Models/CallTranscription.php`

- [ ] T005 [P] Update `AircallCall` model — add to $fillable: review_status, reviewed_at, reviewed_by, reviewing_user_id, reviewing_started_at, wrap_up_seconds, escalated_to_user_id, escalation_note, escalated_at, graph_call_id, case_note_id, activity_id. Add casts: review_status→CallReviewStatus::class, reviewed_at→datetime, reviewing_started_at→datetime, escalated_at→datetime, wrap_up_seconds→integer. Add relationships: `transcription(): HasOne(CallTranscription::class)`, `reviewedBy(): BelongsTo(User::class, 'reviewed_by')`, `reviewingUser(): BelongsTo(User::class, 'reviewing_user_id')`, `escalatedTo(): BelongsTo(User::class, 'escalated_to_user_id')`, `caseNote(): BelongsTo(Note::class, 'case_note_id')`. Add scopes: `scopePendingReview(Builder $query)` — where review_status in [pending_review], `scopePendingAll(Builder $query)` — where review_status in [pending_transcription, pending_review], `scopeInReview(Builder $query)`, `scopeForUser(Builder $query, int $userId)` — where user_id = $userId, `scopeForTeamLeader(Builder $query, int $userId)` — whereHas users through teamsLed relationship. Add `isLocked(): bool` — checks reviewing_user_id not null AND reviewing_started_at > now()-10min. Add `totalDurationSeconds(): int` — duration + wrap_up_seconds. File: `app-modules/aircall/src/Models/AircallCall.php`

---

## Phase 2: Core Actions & Data Classes

> Depends on Phase 1 (models/enums). T006–T016 are parallelizable.

- [ ] T006 [P] [US3] Data: `GraphTranscriptionData` — Laravel Data class. Properties: event (string), call_id (string), aircall_call_id (string), transcription (nested: text string, speaker_segments array nullable, ai_summary string nullable, ai_suggested_case_note string nullable, ai_suggested_tasks array nullable — each item has title string, description string nullable), matched_packages (array of objects with package_id int, confidence string, match_reason string). Use `#[MapName(SnakeCaseMapper::class)]`. File: `app-modules/aircall/src/Http/Data/GraphTranscriptionData.php`

- [ ] T007 [P] [US3] Action: `CreateCallTranscriptionAction` — accepts GraphTranscriptionData. Finds AircallCall by aircall_call_id (or graph_call_id). Creates CallTranscription record. Updates call review_status from pending_transcription → pending_review. Updates call graph_call_id. If matched_packages provided, sync packages via aircall_aircallables (syncWithoutDetaching). Returns CallTranscription. File: `app-modules/aircall/src/Actions/CreateCallTranscriptionAction.php`

- [ ] T008 [P] [US3] Action: `CompleteCallReviewAction` — accepts AircallCall, User (reviewer), wrap_up_seconds (int), case_note_text (string nullable). Validates call is in_review status. Creates care management activity via `activity()->performedOn($package)->causedBy($reviewer)->withProperties(['call_duration_seconds' => $call->duration, 'wrap_up_seconds' => $wrapUpSeconds, 'total_seconds' => $call->duration + $wrapUpSeconds, 'direction' => $call->direction->value, 'call_id' => $call->id])->event('phone_call')->log('Phone call activity')`. If case_note_text provided: create Note on linked package (noteable_type=Package, noteable_id, content=case_note_text, created_by=reviewer, note_categories=['Phone Call']). Update call: review_status→reviewed, reviewed_at→now(), reviewed_by→$reviewer->id, reviewing_user_id→null, reviewing_started_at→null, case_note_id, activity_id. Return updated call. File: `app-modules/aircall/src/Actions/CompleteCallReviewAction.php`

- [ ] T009 [P] [US2] Action: `LinkCallToEntityAction` — accepts AircallCall, linkable model (Package|User), link_type string ('package'|'coordinator'|'provider'). Uses existing `aircall_aircallables` polymorphic pivot. Calls `$call->users()->syncWithoutDetaching()` for User type or creates pivot record directly for Package. Returns updated call with fresh relationships. File: `app-modules/aircall/src/Actions/LinkCallToEntityAction.php`

- [ ] T010 [P] [US3] Action: `ArchiveCallAction` — accepts AircallCall, User (archiver). Validates call is in_review. Updates review_status→archived, reviewing_user_id→null, reviewing_started_at→null, reviewed_by→$archiver->id, reviewed_at→now(). File: `app-modules/aircall/src/Actions/ArchiveCallAction.php`

- [ ] T011 [P] [US3] Action: `EscalateCallAction` — accepts AircallCall, User (escalator), User (teamLeader), string (note). Validates call is in_review. Updates: review_status→escalated, escalated_to_user_id→$teamLeader->id, escalation_note→$note, escalated_at→now(), reviewing_user_id→null, reviewing_started_at→null. File: `app-modules/aircall/src/Actions/EscalateCallAction.php`

- [ ] T012 [P] [US3] Action: `AcquireReviewLockAction` — accepts AircallCall, User. Checks if call isLocked() by another user → throw ValidationException 'Being reviewed by [name]'. If not locked or lock expired: update reviewing_user_id→$user->id, reviewing_started_at→now(), review_status→in_review. Returns updated call. File: `app-modules/aircall/src/Actions/AcquireReviewLockAction.php`

- [ ] T013 [P] [US3] Action: `ReleaseReviewLockAction` — accepts AircallCall. If review_status is in_review: update review_status→pending_review, reviewing_user_id→null, reviewing_started_at→null. File: `app-modules/aircall/src/Actions/ReleaseReviewLockAction.php`

- [ ] T014 [P] [US3] Data: `CallReviewData` — Laravel Data class for review form submission. Properties: wrap_up_seconds (int, default 900), case_note_text (string nullable). Validation rules: wrap_up_seconds min:0 max:7200. File: `app-modules/aircall/src/Http/Data/CallReviewData.php`

- [ ] T015 [P] [US3] Data: `EscalateCallData` — Laravel Data class. Properties: team_leader_id (int, required, exists:users,id), note (string, required, min:10). File: `app-modules/aircall/src/Http/Data/EscalateCallData.php`

- [ ] T016 [P] [US2] Data: `LinkCallData` — Laravel Data class. Properties: linkable_type (string, required, in:package,coordinator,provider), linkable_id (int, required). File: `app-modules/aircall/src/Http/Data/LinkCallData.php`

---

## Phase 3: Jobs & Scheduled Tasks

> Depends on Phase 2 (actions). T017–T019 parallelizable.

- [ ] T017 [P] [US3] Job: `ProcessGraphTranscriptionJob` — queued, accepts webhook payload array. Constructs GraphTranscriptionData from payload. Calls CreateCallTranscriptionAction. Retry 3 times with backoff [5, 30, 360]. Middleware: WithoutOverlapping keyed on aircall_call_id. File: `app-modules/aircall/src/Jobs/ProcessGraphTranscriptionJob.php`

- [ ] T018 [P] [US3] Job: `AutoTransitionPendingTranscriptionJob` — scheduled (runs hourly). Queries AircallCall where review_status=pending_transcription AND created_at < now()-24h. Updates review_status→pending_review in bulk. Log count transitioned. File: `app-modules/aircall/src/Jobs/AutoTransitionPendingTranscriptionJob.php`

- [ ] T019 [P] [US3] Job: `ReleaseStaleReviewLocksJob` — scheduled (runs every 5 min). Queries AircallCall where review_status=in_review AND reviewing_started_at < now()-10min. Calls ReleaseReviewLockAction for each. Log count released. File: `app-modules/aircall/src/Jobs/ReleaseStaleReviewLocksJob.php`

- [ ] T020 Register scheduled jobs in `routes/console.php`. `AutoTransitionPendingTranscriptionJob` — `->hourly()`. `ReleaseStaleReviewLocksJob` — `->everyFiveMinutes()`. File: `routes/console.php`

---

## Phase 4: Controllers & Routes

> Depends on Phase 2 (actions) and Phase 3 (jobs).

- [ ] T021 [US3] Controller: `CallsInboxController@index` — authorizes via Gate (user has Aircall account OR is team leader). Creates `CallsTable` instance with filters (status tab, direction, linked/unlinked, search). For team leaders: scope to all teams led via `AircallCall::forTeamLeader()`. For coordinators: scope to `AircallCall::forUser()`. Return `Inertia::render('Staff/Calls/Index', ['calls' => $table, 'statusCounts' => [...]])`. File: `app-modules/aircall/src/Http/Controllers/CallsInboxController.php`

- [ ] T022 [US3] Controller: `CallReviewController@show` — accepts AircallCall. Authorizes. Calls AcquireReviewLockAction. Returns `Inertia::modal('Staff/Calls/Show', ['call' => CallDetailData::from($call->load('transcription', 'reviewedBy', 'users', 'contact')), 'teamLeaders' => $teamLeaders])->baseRoute('staff.calls.index')`. Use deferred props for transcription content. File: `app-modules/aircall/src/Http/Controllers/CallReviewController.php`

- [ ] T023 [US3] Controller: `CallReviewController@completeReview` — accepts AircallCall, CallReviewData. Calls CompleteCallReviewAction. Returns redirect back with flash 'Call reviewed'. File: `app-modules/aircall/src/Http/Controllers/CallReviewController.php`

- [ ] T024 [US2] Controller: `CallReviewController@link` — accepts AircallCall, LinkCallData. Resolves linkable model from type+id. Calls LinkCallToEntityAction. Returns redirect back. File: `app-modules/aircall/src/Http/Controllers/CallReviewController.php`

- [ ] T025 [US3] Controller: `CallReviewController@archive` — accepts AircallCall. Calls ArchiveCallAction. Returns redirect back with flash 'Call archived'. File: `app-modules/aircall/src/Http/Controllers/CallReviewController.php`

- [ ] T026 [US3] Controller: `CallReviewController@escalate` — accepts AircallCall, EscalateCallData. Resolves team leader User. Calls EscalateCallAction. Returns redirect back with flash 'Call escalated to [name]'. File: `app-modules/aircall/src/Http/Controllers/CallReviewController.php`

- [ ] T027 [US3] Controller: `CallsApiController@pendingCount` — returns JSON `{ count: AircallCall::pendingReview()->forUser(auth()->id())->count() }`. For team leaders, include team count. File: `app-modules/aircall/src/Http/Controllers/CallsApiController.php`

- [ ] T028 [US3] Controller: `GraphWebhookController@store` — accepts Request. Validates required fields (event, aircall_call_id). Dispatches ProcessGraphTranscriptionJob with payload. Returns 200 OK immediately. File: `app-modules/aircall/src/Http/Controllers/GraphWebhookController.php`

- [ ] T029 [US2] Controller: `CallsSearchController@search` — accepts search query string. Searches Packages (by tc_customer_no, recipient name), Users with coordinator role (by name), Providers (by name). Returns JSON grouped by type: `{ suggested: [...], packages: [...], coordinators: [...], providers: [...] }`. Suggested = entities previously linked to same raw_digits phone number. File: `app-modules/aircall/src/Http/Controllers/CallsSearchController.php`

- [ ] T030 Routes: Register all endpoints. Staff routes (web middleware): `GET /staff/calls` → CallsInboxController@index (name: staff.calls.index), `GET /staff/calls/{call}` → CallReviewController@show (name: staff.calls.show), `POST /staff/calls/{call}/complete-review` → CallReviewController@completeReview, `POST /staff/calls/{call}/link` → CallReviewController@link, `POST /staff/calls/{call}/archive` → CallReviewController@archive, `POST /staff/calls/{call}/escalate` → CallReviewController@escalate. API routes: `GET /api/staff/calls/pending-count` → CallsApiController@pendingCount, `GET /api/staff/calls/search` → CallsSearchController@search. Webhook route (no auth): `POST /api/webhooks/graph/call-transcription` → GraphWebhookController@store. File: `app-modules/aircall/routes/web.php` and `app-modules/aircall/routes/api.php`

---

## Phase 5: Table Class

> Depends on Phase 4 (controllers).

- [ ] T031 [US3] Table: `CallsTable` extends `BaseTable`. Properties: $prefetch=true, $showRowsPerPage=true, $perPageOptions=[25,50,100], $defaultSort='-started_at'. Method `resource()`: returns AircallCall query with relationships (contact, users, transcription). Columns: TextColumn 'caller' (contact.full_name, searchable), TextColumn 'direction' (sortable), TextColumn 'duration' (sortable, formatted MM:SS), TextColumn 'linked_to' (computed from users/packages relationship), TextColumn 'started_at' (label 'Date', sortable). Filters: SelectFilter 'review_status' (tab-style: pending_review, reviewed, archived, escalated), SelectFilter 'direction' (inbound, outbound, missed), SelectFilter 'linked' (linked, unlinked). SearchFilter on raw_digits, contact name, package name. Accept constructor params for user scope (forUser or forTeamLeader). File: `app-modules/aircall/src/Tables/CallsTable.php`

---

## Phase 6: Vue Pages & Components — Calls Index

> Depends on Phase 4–5 (routes, table).

- [ ] T032 [US3] Page: `Index.vue` — Calls Inbox page. Layout: `AppLayout` with title 'Calls'. Uses `CommonContent`, `CommonHeader` (title='Calls', icon='heroicons-outline/phone'), `CommonCard`, `CommonTable` with `:resource="calls"` prop. Status tabs via `CommonTabs` with `:items` showing Pending (count badge), Reviewed, Archived, Escalated. Filter dropdowns: direction (CommonSelectMenu), link status (CommonSelectMenu). Click row → `router.get(route('staff.calls.show', call.id))` to open modal. Loading: skeleton rows via Inertia deferred props. Props interface: `{ calls: Table<CallData>, statusCounts: { pending: number, reviewed: number, archived: number, escalated: number } }`. File: `resources/js/Pages/Staff/Calls/Index.vue`

- [ ] T033 [P] [US3] Data: `CallData` — Laravel Data class for frontend. Properties: id, caller_name, caller_phone, direction (string), duration (int seconds), review_status (string), linked_entity_name (string nullable), linked_entity_type (string nullable), linked_entity_id (int nullable), started_at (string), is_missed (bool), has_transcription (bool), reviewing_user_name (string nullable). Use `#[TypeScript]` attribute. File: `app-modules/aircall/src/Http/Data/CallData.php`

---

## Phase 7: Vue Pages & Components — Review Drawer

> Depends on Phase 6 (Index page exists for baseRoute).

- [ ] T034 [US3] Page: `Show.vue` — Call Review drawer modal. Uses `useModal()` from `@/inertia-modal`. Full-height slide-from-right drawer (~50-60% width, override CommonModal styles for full-height). Skeleton loading state while deferred props load (skeleton blocks for header, duration, transcription, note; footer buttons disabled). Scrollable body: header section (caller→recipient, direction CommonBadge, duration, timestamp), package link section (shows linked entity or 'Link to...' button triggering inline search), duration section (two CommonTextInput: call time read-only formatted MM:SS, wrap-up time editable defaulting to '15:00'), transcription section (read-only scrollable text block, or 'Transcription unavailable' if null), AI case note (CommonTextArea pre-filled with ai_suggested_case_note, editable). Sticky footer: CommonButton 'Archive' (secondary), CommonButton 'Escalate' (secondary), CommonButton 'Complete Review' (primary, disabled if not linked to entity). For missed calls: hide duration section, show info alert 'Missed call — no activity to log', footer shows Archive and Link only (no Complete Review). Post-review success state: replace body with checkmark icon, 'Call Reviewed' heading, activity summary, two buttons: 'Close' (calls close()) and 'Review Next →' (router.get next pending call route). Props interface: `{ call: CallDetailData, teamLeaders: SelectOptionData[] }`. File: `resources/js/Pages/Staff/Calls/Show.vue`

- [ ] T035 [P] [US3] Data: `CallDetailData` — extended data for drawer. Properties: all from CallData plus transcription_text (string nullable), ai_summary (string nullable), ai_suggested_case_note (string nullable), wrap_up_seconds (int), reviewed_by_name (string nullable), escalated_to_name (string nullable), escalation_note (string nullable), is_missed (bool), packages (array of linked entities with id, name, type). Use `#[TypeScript]` attribute. File: `app-modules/aircall/src/Http/Data/CallDetailData.php`

- [ ] T036 [US3] Component: `CallTranscriptionViewer.vue` — accepts `transcription` string prop (nullable). If null: shows 'Transcription unavailable' with grey info styling. If provided: renders text in a scrollable container with max-height, proper line breaks. File: `resources/js/Components/Call/CallTranscriptionViewer.vue`

- [ ] T037 [US3] Component: `EscalationDialog.vue` — small CommonModal dialog. Props: `teamLeaders: SelectOptionData[]`, `show: boolean`. Emits: `escalate(teamLeaderId: number, note: string)`, `close`. Content: header 'Escalate Call', CommonSelectMenu for team leader selection, CommonTextArea for required note (min 10 chars), footer with Cancel and Escalate buttons. Escalate button disabled until TL selected and note ≥10 chars. File: `resources/js/Components/Call/EscalationDialog.vue`

- [ ] T038 [US2] Component: `EntityLinkSearch.vue` — inline search for linking calls to entities. Props: `callId: number`, `suggestedEntity: { id, name, type } | null`. Shows 'Link to...' button that expands to search input. On input: debounced (300ms) GET to `/api/staff/calls/search?q={query}`. Results in dropdown grouped by type (SUGGESTED, PACKAGES, COORDINATORS, PROVIDERS) with type badges. Selecting a result: POST to `/staff/calls/{callId}/link` with linkable_type and linkable_id. Optimistic update — show linked entity immediately. File: `resources/js/Components/Call/EntityLinkSearch.vue`

---

## Phase 7b: AI Summary & Task Integration (Cross-feature with Tasks MVP)

> Depends on Phase 7 (drawer exists) and Tasks MVP domain (Task model + StoreTask action).

- [ ] T059 [P] [US3] Action: `CreateTaskFromCallAction` — accepts AircallCall, User (creator), string (title), string nullable (description). Validates call is linked to at least one package. Creates Task via existing `StoreTask` action or directly via Task model: title from suggestion, created_by = creator, task_stage = NOT_STARTED, task_priority = MEDIUM. Links task to the call's first linked package via `task_linkables` polymorphic pivot. Returns created Task. File: `app-modules/aircall/src/Actions/CreateTaskFromCallAction.php`

- [ ] T060 [P] [US3] Action: `RegenerateCallAiContentAction` — accepts AircallCall. Calls Graph API to re-process the transcription. Updates call_transcriptions: ai_summary, ai_suggested_case_note, ai_suggested_tasks with new response. Returns updated CallTranscription. File: `app-modules/aircall/src/Actions/RegenerateCallAiContentAction.php`

- [ ] T061 [US3] Controller: `CallReviewController@createTask` — accepts AircallCall, request with `title` (required string) and `description` (nullable string). Calls CreateTaskFromCallAction. Returns JSON with created task data. File: `app-modules/aircall/src/Http/Controllers/CallReviewController.php`

- [ ] T062 [US3] Controller: `CallReviewController@regenerate` — accepts AircallCall. Calls RegenerateCallAiContentAction. Returns JSON with updated AI content (summary, case_note, tasks). File: `app-modules/aircall/src/Http/Controllers/CallReviewController.php`

- [ ] T063 [US3] Route: Register `POST /staff/calls/{call}/create-task` → CallReviewController@createTask and `POST /staff/calls/{call}/regenerate` → CallReviewController@regenerate. File: `app-modules/aircall/routes/web.php`

- [ ] T064 [US3] Component: `AiSummarySection.vue` — displays AI summary in blockquote-style container with close (×) button. Below summary: "REGENERATE" button (star icon, teal text, calls regenerate endpoint) and "SAVE AS NOTE" button (primary, saves summary as package case note via existing case note mechanism). Props: `summary: string | null`, `callId: number`. Emits: `regenerate`, `save-as-note`, `dismiss`. Loading state while regenerating (spinner on REGENERATE button). File: `resources/js/Components/Call/AiSummarySection.vue`

- [ ] T065 [US3] Component: `AiSuggestedTasks.vue` — displays AI-suggested tasks from Graph. Props: `tasks: Array<{ title: string, description?: string }>`, `callId: number`. Each task rendered as yellow/amber card with star icon, title text, and teal `+` button. Clicking `+`: POST to `/staff/calls/{callId}/create-task` with task title/description. On success: task card shows checkmark, `+` button becomes disabled. Optimistic UI — mark as added immediately, revert on failure. Section hidden if no tasks. File: `resources/js/Components/Call/AiSuggestedTasks.vue`

- [ ] T066 [US3] Update `Show.vue` drawer — integrate `AiSummarySection` and `AiSuggestedTasks` components into the drawer body between Transcription and AI Case Note sections. Wire up regenerate handler to call endpoint and refresh all AI sections. Wire up save-as-note to save summary as case note. Pass `call.transcription.ai_suggested_tasks` to AiSuggestedTasks. File: `resources/js/Pages/Staff/Calls/Show.vue`

- [ ] T067 [P] [US3] Update `CallDetailData` — add `ai_suggested_tasks` property (array of objects with title string, description string nullable). Source from `$call->transcription->ai_suggested_tasks`. Use `#[TypeScript]` attribute. File: `app-modules/aircall/src/Http/Data/CallDetailData.php`

---

## Phase 8: Navigation & Notification Badge

> Depends on Phase 4 (API endpoint). Parallelizable.

- [ ] T039 [P] [US3] Component: `CallInboxBadge.vue` — notification badge for header. Polls `GET /api/staff/calls/pending-count` every 60 seconds via `setInterval` + `fetch`. Shows count in a teal badge if > 0. Clicking navigates to `/staff/calls`. Track previous count — if new count > previous, show toast 'New call ready for review'. Only render if user has Aircall account or is team leader (pass `showCallsBadge` prop from layout). File: `resources/js/Components/Call/CallInboxBadge.vue`

- [ ] T040 [US3] Update sidebar navigation — add 'Calls' item under COMMUNICATION section (above Threads). In `StaffSidebarService.php`, add NavigationItemData: label='Calls', icon='heroicons-outline/phone', href='/staff/calls', permission gated by feature flag `calls-inbox-v1`. Also add `alert` property showing pending count if > 0. File: `app/Services/Sidebar/StaffSidebarService.php`

- [ ] T041 [US3] Update header/layout to include `CallInboxBadge` component. Add `showCallsBadge` prop to layout shared data (true if user has Aircall account or leads teams). Render `CallInboxBadge` in header area near existing notification elements. File: `resources/js/Layouts/AppLayout.vue` (or wherever header notification area is rendered)

---

## Phase 9: Feature Flag & Permissions

> Parallelizable with Phase 6–8.

- [ ] T042 [P] [US3] Feature flag: Register `calls-inbox-v1` in PostHog. Gate the sidebar nav item (T040) and Calls Index route (T021) behind `Feature::active('calls-inbox-v1')`. Middleware or controller check: if flag not active, abort 403 or redirect. File: `app-modules/aircall/src/Http/Controllers/CallsInboxController.php` (add check), `app/Services/Sidebar/StaffSidebarService.php` (conditional nav item)

- [ ] T043 [P] [US3] Authorization: Create `CallPolicy` — `viewAny(User $user): bool` returns true if user has Aircall account (check via user->calls relation or a hasAircallAccount() method) OR user->teamsLed()->exists(). `view(User $user, AircallCall $call): bool` — user owns the call OR user leads a team containing the call's user. `review(User $user, AircallCall $call): bool` — same as view. `archive`, `escalate` — same as review. Register in AuthServiceProvider. File: `app-modules/aircall/src/Policies/CallPolicy.php`

---

## Phase 10: Webhook Route Registration

> Depends on T028, T030.

- [ ] T044 [US3] Register Graph webhook route in Aircall module's service provider or route file. The route `POST /api/webhooks/graph/call-transcription` must NOT require auth middleware (external webhook). Add rate limiting. Optionally add signature verification (if Graph provides HMAC). Register in `AircallServiceProvider::boot()` or the module routes file. File: `app-modules/aircall/src/Providers/AircallServiceProvider.php` and/or `app-modules/aircall/routes/api.php`

---

## Phase 11: Package Timeline — Call History

> Depends on Phase 1 (model relationships). Can run in parallel with UI phases.

- [ ] T045 [P] [US6] Add call history to package Timeline tab. Find the existing package timeline/activity controller. Add a query that fetches AircallCalls linked to the package via `aircall_aircallables` pivot. Return call data (date, duration, direction, caller/recipient, linked status) alongside existing timeline entries. External coordinators (no Aircall) see this view-only. No review actions exposed here. File: find and update the existing package timeline controller/component.

---

## Phase 12: Testing

> Depends on all previous phases.

- [ ] T046 [US3] Unit test: `CallReviewStatusTest` — test valid transitions (pending_transcription→pending_review, pending_review→in_review, in_review→reviewed, in_review→archived, in_review→escalated, in_review→pending_review, escalated→in_review). Test invalid transitions throw exceptions. Test enum values() method. File: `app-modules/aircall/tests/Unit/CallReviewStatusTest.php`

- [ ] T047 [P] Unit test: `AircallCallDurationTest` — test totalDurationSeconds() returns duration + wrap_up_seconds. Test default wrap_up_seconds is 900. Test isLocked() returns true when reviewing_user_id set and reviewing_started_at < 10 min ago. Test isLocked() returns false when reviewing_started_at > 10 min ago. File: `app-modules/aircall/tests/Unit/AircallCallDurationTest.php`

- [ ] T048 [US3] Feature test: `GraphWebhookTest` — POST to `/api/webhooks/graph/call-transcription` with valid payload → 200, job dispatched. Test transcription created in DB. Test call review_status transitions to pending_review. Test duplicate webhook (same graph_transcription_id) is idempotent. Test invalid payload → 422. File: `app-modules/aircall/tests/Feature/GraphWebhookTest.php`

- [ ] T049 [US3] Feature test: `CompleteCallReviewTest` — POST to `/staff/calls/{call}/complete-review` with valid data → call marked reviewed, activity created, case note created. Test wrap_up_seconds is stored. Test unlinked call cannot be completed (must link first). Test duplicate completion (already reviewed) → 422. Test unauthorized user → 403. File: `app-modules/aircall/tests/Feature/CompleteCallReviewTest.php`

- [ ] T050 [P] [US2] Feature test: `LinkCallTest` — POST to `/staff/calls/{call}/link` with package linkable → call linked via pivot. Test link to coordinator user. Test link to provider. Test duplicate link is idempotent. File: `app-modules/aircall/tests/Feature/LinkCallTest.php`

- [ ] T051 [P] [US3] Feature test: `ArchiveCallTest` — POST to `/staff/calls/{call}/archive` → call status = archived. Test only in_review calls can be archived. File: `app-modules/aircall/tests/Feature/ArchiveCallTest.php`

- [ ] T052 [P] [US3] Feature test: `EscalateCallTest` — POST to `/staff/calls/{call}/escalate` with TL + note → call status = escalated, escalated_to set. Test note required (min 10 chars). Test TL must exist. File: `app-modules/aircall/tests/Feature/EscalateCallTest.php`

- [ ] T053 [US3] Feature test: `ReviewLockTest` — test acquiring lock sets reviewing_user_id + reviewing_started_at + in_review status. Test second user gets 422 'Being reviewed by [name]'. Test lock expires after 10 min (second user can acquire). Test closing without completing releases lock (back to pending_review). File: `app-modules/aircall/tests/Feature/ReviewLockTest.php`

- [ ] T054 [P] [US3] Feature test: `CallsInboxAccessTest` — test coordinator with Aircall sees their calls. Test TL sees all team members' calls. Test coordinator without Aircall sees empty state (or 403). Test feature flag gates access. File: `app-modules/aircall/tests/Feature/CallsInboxAccessTest.php`

- [ ] T055 [P] [US3] Feature test: `PendingCountApiTest` — GET `/api/staff/calls/pending-count` → returns correct count. Test count only includes pending_review (not pending_transcription). Test TL gets team-scoped count. File: `app-modules/aircall/tests/Feature/PendingCountApiTest.php`

---

## Phase 13: Cross-cutting & Polish

> Final phase — after all features working.

- [ ] T056 Run `./vendor/bin/pint` on all new PHP files in `app-modules/aircall/`. Fix any style issues. File: all new PHP files

- [ ] T057 Run TypeScript generation to update `generated.d.ts` with new Data classes (CallData, CallDetailData, CallReviewData, etc.). Verify Vue pages compile without TS errors. Command: `php artisan typescript:transform`

- [ ] T058 [US3] Verify Aircall module service provider auto-discovers new routes (web.php, api.php). If not auto-discovered, register in `AircallServiceProvider::boot()` with `$this->loadRoutesFrom()`. Check route list with `php artisan route:list --path=staff/calls`. File: `app-modules/aircall/src/Providers/AircallServiceProvider.php`

---

## Summary

| Metric | Count |
|--------|-------|
| **Total tasks** | 67 |
| **Phase 1 (Foundation)** | 5 |
| **Phase 2 (Actions/Data)** | 11 |
| **Phase 3 (Jobs)** | 4 |
| **Phase 4 (Controllers)** | 10 |
| **Phase 5 (Table)** | 1 |
| **Phase 6 (Index UI)** | 2 |
| **Phase 7 (Drawer UI)** | 5 |
| **Phase 7b (AI Summary + Tasks)** | 9 |
| **Phase 8 (Nav/Badge)** | 3 |
| **Phase 9 (Flags/Auth)** | 2 |
| **Phase 10 (Webhook reg)** | 1 |
| **Phase 11 (Timeline)** | 1 |
| **Phase 12 (Tests)** | 10 |
| **Phase 13 (Polish)** | 3 |
| **Parallelizable [P]** | 34 |
| **US2 (Link Calls)** | 5 |
| **US3 (Call Reviews)** | 47 |
| **US6 (Call History)** | 1 |
| **Infrastructure** | 14 |

---

## Dependencies

```
Phase 1 (T001-T005) → all subsequent phases
Phase 2 (T006-T016) → Phase 3, 4
Phase 3 (T017-T020) → Phase 4
Phase 4 (T021-T030) → Phase 5, 6
Phase 5 (T031) → Phase 6
Phase 6 (T032-T033) → Phase 7
Phase 7 (T034-T038) → standalone after Phase 6
Phase 7b (T059-T067) → after Phase 7 + requires Tasks MVP domain (Task model, StoreTask action)
Phase 8 (T039-T041) → parallel with Phase 6-7
Phase 9 (T042-T043) → parallel with Phase 6-8
Phase 10 (T044) → after T028, T030
Phase 11 (T045) → parallel after Phase 1
Phase 12 (T046-T055) → after all feature phases
Phase 13 (T056-T058) → after Phase 12
```

**Next**: Run `/speckit-implement` to start implementation, or say 'keep going' to begin.
