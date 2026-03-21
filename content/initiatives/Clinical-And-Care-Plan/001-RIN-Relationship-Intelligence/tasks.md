---
title: "Implementation Tasks: Relationship Intelligence"
---

# Implementation Tasks: Relationship Intelligence

**Input**: [plan.md](plan.md) | [spec.md](spec.md) | [data-model.md](data-model.md)
**Prerequisites**: Plan.md (Ready for Implementation), Gate 3 PASS, Design Handover PASS
**Frontend Status**: 27 components built with mock data — backend + wiring remaining
**Generated**: 2026-03-13

**Organisation**: Tasks grouped by user story. Phase 1 (Foundation) must complete before any user story work begins. User stories can then proceed in parallel or sequentially by priority.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story (US1-US8)
- Exact file paths included

---

## Phase 1: Backend Foundation (Blocking Prerequisites)

**Purpose**: Domain structure, migrations, models, enums, policies, routes, service provider, translations, feature flag. MUST complete before any user story work.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [ ] T001 [P] Create domain service provider `domain/RelationshipIntelligence/Providers/RelationshipIntelligenceServiceProvider.php` — register routes, policies, model bindings. Register in `config/app.php` providers array
- [ ] T002 [P] Create enum `domain/RelationshipIntelligence/Enums/PersonalContextCategory.php` — cases: `INTERESTS_HOBBIES`, `FAMILY_HOUSEHOLD`, `IMPORTANT_DATES`, `GENERAL_NOTES` (backed string enum)
- [ ] T003 [P] Create enum `domain/RelationshipIntelligence/Enums/TouchpointType.php` — cases: `PHONE_CALL`, `IN_PERSON_VISIT`, `VIDEO_CALL`, `EMAIL`
- [ ] T004 [P] Create enum `domain/RelationshipIntelligence/Enums/TouchpointActivity.php` — cases: `MONITORING_REVIEW`, `CARE_PLANNING`, `ORGANISING_ADJUSTING_SERVICES`, `NAVIGATING_OPTIONS`, `SUPPORTING_FEEDBACK_COMPLAINTS`
- [ ] T005 [P] Create enum `domain/RelationshipIntelligence/Enums/TouchpointSentiment.php` — cases: `HAPPY`, `NEUTRAL`, `CONCERNED`
- [ ] T006 [P] Create enum `domain/RelationshipIntelligence/Enums/OperationalReason.php` — cases: `BILLS_ON_HOLD`, `ACTIVE_COMPLAINTS`, `CHECK_IN_OVERDUE`, `MANAGEMENT_PLAN_DUE`, `RECENT_INCIDENTS`, `OPEN_TASKS`, `BUDGET_EXPIRING`, `UPCOMING_SERVICES`. Methods: `toChecklistLabel(): string` and `toOpenerPhrase(): string` returning translation keys
- [ ] T007 Create migration `create_personal_context_entries_table` — columns per data-model.md: id, user_id (FK), category (string 30), content (text), created_by (FK users), updated_by (FK users nullable), timestamps, soft deletes. Indexes: `[user_id, category]`
- [ ] T008 Create migration `create_touchpoints_table` — columns per data-model.md: id, user_id (FK), recorded_by (FK users), date, type (string 20), duration_minutes (smallint unsigned nullable), activity (string 40 nullable), sentiment (string 15 nullable), notes (text nullable), corrected_at/corrected_by, retracted_at/retracted_by, timestamps. Indexes: `[user_id, date]`, `[user_id, created_at]`
- [ ] T009 Create migration `add_rin_essentials_to_users_table` — add to users: `best_call_time` (string 50 nullable), `caution_flags` (json nullable), `info_notes` (json nullable), `zoho_management_plan_url` (string 255 nullable)
- [ ] T010 Create model `domain/RelationshipIntelligence/Models/PersonalContextEntry.php` — fillable, casts (`category` → PersonalContextCategory enum), SoftDeletes, relationships: `user()` BelongsTo, `createdBy()` BelongsTo, `updatedBy()` BelongsTo. Add `LogsActivity` trait (Spatie Activity Log)
- [ ] T011 Create model `domain/RelationshipIntelligence/Models/Touchpoint.php` — fillable, casts (type → TouchpointType, activity → TouchpointActivity, sentiment → TouchpointSentiment, date → date, corrected_at/retracted_at → datetime), relationships: `user()`, `recordedBy()`, `correctedBy()`, `retractedBy()`. Add `LogsActivity` trait. Scope: `scopeNotRetracted()`
- [ ] T012 Extend `domain/User/Models/User.php` — add relationships: `personalContextEntries(): HasMany`, `touchpoints(): HasMany`. Add casts for `caution_flags` (array), `info_notes` (array). Add `best_call_time` and `zoho_management_plan_url` to fillable
- [ ] T013 [P] Create factory `domain/RelationshipIntelligence/Factories/PersonalContextEntryFactory.php` — states: `interestsHobbies()`, `familyHousehold()`, `importantDates()`, `generalNotes()`
- [ ] T014 [P] Create factory `domain/RelationshipIntelligence/Factories/TouchpointFactory.php` — states: `phoneCall()`, `inPersonVisit()`, `happy()`, `concerned()`, `corrected()`, `retracted()`, `careManagement()` (duration >= 15)
- [ ] T015 Create policy `domain/RelationshipIntelligence/Policies/PersonalContextEntryPolicy.php` — `view`: user has access to any of recipient's packages; `create`: same; `delete`: creator within 24h OR user has team leader role
- [ ] T016 Create policy `domain/RelationshipIntelligence/Policies/TouchpointPolicy.php` — `view`: package access; `create`: package access; `correct`: creator within 24h OR team leader; `retract`: creator within 24h OR team leader
- [ ] T017 Create route file `domain/RelationshipIntelligence/Routes/relationshipIntelligenceRoutes.php` — middleware: `['web.authenticated', 'check.feature.flag:relationship-intelligence']`, prefix: `recipients/{user}/rin`, name: `rin.`. Register routes for all 8 endpoints from plan.md API contracts table
- [ ] T018 Create translation file `lang/en/rin.php` — keys for: operational reason checklist labels (e.g., `'operational.bills_on_hold' => 'Discuss bills currently on hold'`), opener phrases (e.g., `'opener.bills_on_hold' => 'follow up on a bill that needs attention'`), panel titles, empty states, validation messages
- [ ] T019 [P] Create feature flag `relationship-intelligence` in PostHog/Pennant — verify `HasFeatureFlag` component and `check.feature.flag` middleware work with this flag name

**Checkpoint**: Run migrations, verify models create/persist, verify feature flag gates routes. Run `php artisan test --compact --filter=RelationshipIntelligence` for foundation tests.

---

## Phase 2: US1 — Capture Personal Context (Priority: P1) 🎯 MVP

**Goal**: Coordinators can add/remove personal context pills grouped by category. Data persists and is visible to all coordinators with access.

**Independent Test**: Open Intelligence panel → add pill to "Interests & Hobbies" → verify it persists → verify another coordinator sees it.

### Implementation

- [ ] T020 [P] [US1] Create data class `domain/RelationshipIntelligence/Data/PersonalContextEntryData.php` — `#[TypeScript]`, `#[MapName(SnakeCaseMapper::class)]`: id, category, content, createdBy (string — coordinator name), createdAt (string)
- [ ] T021 [P] [US1] Create data class `domain/RelationshipIntelligence/Data/StorePersonalContextEntryData.php` — category (PersonalContextCategory enum, required), content (string, required, max:500)
- [ ] T022 [US1] Create action `domain/RelationshipIntelligence/Actions/StorePersonalContextEntry.php` — AsAction + AsController. `authorize()`: policy check. `handle(User $recipient, StorePersonalContextEntryData $data)`: create entry with `created_by` = auth user. Return `PersonalContextEntryData`. Route: `POST .../rin/context`
- [ ] T023 [US1] Create action `domain/RelationshipIntelligence/Actions/DestroyPersonalContextEntry.php` — AsAction + AsController. `authorize()`: policy delete check (creator within 24h OR team leader). `handle(PersonalContextEntry $entry)`: soft delete. Route: `DELETE .../rin/context/{personalContextEntry}`. Return 204
- [ ] T024 [US1] Wire `resources/js/Components/RelationshipIntelligence/Intelligence/PersonalContext/PersonalContextSection.vue` — replace mock data with `personalContextEntries` prop. `@add` → `router.post(route('rin.context.store', { user: recipientId }), { category, content }, { preserveScroll: true })` with optimistic add + rollback on error. `@remove` → `router.delete()` with optimistic remove
- [ ] T025 [US1] Wire `resources/js/Components/RelationshipIntelligence/Intelligence/PersonalContext/CategoryGroup.vue` — accept real entries, emit add/remove events to parent
- [ ] T026 [US1] Wire `resources/js/Components/RelationshipIntelligence/Intelligence/PersonalContext/ContextPill.vue` — accept `PersonalContextEntryData` prop, show creator tooltip on hover

### Tests

- [ ] T027 [P] [US1] Unit test: `StorePersonalContextEntry` action — valid input creates entry, invalid category rejected, content max 500 enforced
- [ ] T028 [P] [US1] Unit test: `DestroyPersonalContextEntry` action — creator can delete within 24h, creator blocked after 24h, team leader can always delete
- [ ] T029 [US1] Feature test: `POST /recipients/{user}/rin/context` — auth required, feature flag required, creates entry, returns data. `DELETE` — soft deletes, 404 for non-existent
- [ ] T030 [US1] Feature test: Personal context is client-level — entry created on Package A visible when accessing via Package B for same recipient

**Checkpoint**: Coordinator can add/remove pills. Data persists across page loads. Visible to other coordinators.

---

## Phase 3: US2 — Quick Essentials & Client Snapshot (Priority: P1) 🎯 MVP

**Goal**: Intelligence panel shows unified client view: essentials (inline-editable), operational alerts, and adapts for auth rep.

**Independent Test**: Open panel for a client with bills on hold + complaints → verify essentials show, operational alerts render with correct counts, edit preferred name inline.

### Implementation

- [ ] T031 [P] [US2] Create data class `domain/RelationshipIntelligence/Data/QuickEssentialsData.php` — `#[TypeScript]`: preferredName, language, bestCallTime, timezone, cautionFlags (string[]), infoNotes (string[])
- [ ] T032 [P] [US2] Create data class `domain/RelationshipIntelligence/Data/OperationalContextData.php` — `#[TypeScript]`: billsOnHoldCount (int), activeComplaintsCount (int), managementPlanZohoUrl (?string), checkInOverdueDays (?int), lastConversationDaysAgo (?int), recentIncidentsCount (int), openTasksCount (int), budgetExpiringCount (int)
- [ ] T033 [P] [US2] Create data class `domain/RelationshipIntelligence/Data/AuthRepData.php` — `#[TypeScript]`: name, relationship, phone, preferredName?, bestCallTime?, timezone?, isDecisionMakingAuthority (bool), isPowerOfAttorney (bool)
- [ ] T034 [P] [US2] Create data class `domain/RelationshipIntelligence/Data/IntelligencePanelData.php` — `#[TypeScript]`: essentials (QuickEssentialsData), operationalContext (OperationalContextData), personalContextEntries (PersonalContextEntryData[]), touchpointStatus (string: 'contacted'|'due'|'overdue'), lastTouchpointDate (?string), authRep (?AuthRepData)
- [ ] T035 [P] [US2] Create data class `domain/RelationshipIntelligence/Data/UpdateQuickEssentialsData.php` — field (string, required, in: preferred_name, best_call_time, caution_flags, info_notes), value (string|null)
- [ ] T036 [US2] Create action `domain/RelationshipIntelligence/Actions/GetIntelligenceData.php` — AsAction. `handle(User $recipient, Package $package)`: assemble IntelligencePanelData. Queries: bills on hold (`BillStageEnum::ON_HOLD`), complaints (90-day `NoteCategoryEnum::FEEDBACK_COMPLAINT_*`), check-in overdue (`int_check_in_date` > 28 days), incidents (`IncidentStageEnum::NEW/PENDING/ESCALATED`), tasks (`TaskStageEnum::NOT_STARTED/IN_PROGRESS`), budget expiring (`Funding::isExpiringSoon()`), auth rep from `$package->primaryRepresentative`, touchpoint status from latest non-retracted touchpoint
- [ ] T037 [US2] Create action `domain/RelationshipIntelligence/Actions/UpdateQuickEssentials.php` — AsAction + AsController. `handle(User $recipient, UpdateQuickEssentialsData $data)`: update field on User model (or PackageRepresentative if auth rep). Whitelist fields. Route: `PATCH .../rin/essentials`. Use `PackageContactService` for auth rep field updates
- [ ] T038 [US2] Register `GetIntelligenceData` as standard Inertia prop in package page controller — add `'rinIntelligence' => fn () => GetIntelligenceData::run($recipient, $package)` to shared props (gated by feature flag). Identify the correct controller (likely `RecipientPackageController` or the layout that renders package pages)
- [ ] T039 [US2] Wire `resources/js/Components/RelationshipIntelligence/Intelligence/IntelligencePanel.vue` — replace mock data with `rinIntelligence` page prop. Pass sub-data to child components
- [ ] T040 [US2] Wire `resources/js/Components/RelationshipIntelligence/Intelligence/QuickEssentials.vue` — accept real essentials data. Inline edit → `router.patch(route('rin.essentials.update', { user }), { field, value })` with optimistic update
- [ ] T041 [US2] Wire `resources/js/Components/RelationshipIntelligence/Intelligence/OperationalContext.vue` — accept real operational context. Render rows conditionally (only show rows with non-zero counts). Colour-code badges. Click navigates to relevant tab
- [ ] T042 [US2] Wire `resources/js/Components/RelationshipIntelligence/Intelligence/ContactToggle.vue` — toggle between client/auth rep. When auth rep selected, swap essentials data to `authRep` prop. Show "Calling about [Client Name]" label
- [ ] T043 [US2] Handle no-auth-rep state — when `authRep` is null, show empty state with "Add representative" link pointing to Package Contacts page
- [ ] T044 [US2] Create composable `resources/js/composables/useInlineEdit.ts` — manages edit state, value tracking, save/cancel with optimistic updates and rollback

### Tests

- [ ] T045 [P] [US2] Unit test: `GetIntelligenceData` — correct counts for bills on hold, complaints (90-day window), check-in overdue, incidents, auth rep mapping
- [ ] T046 [P] [US2] Unit test: `UpdateQuickEssentials` — valid field updates, invalid field rejected, auth rep update goes through PackageContactService
- [ ] T047 [US2] Feature test: Intelligence data loads as Inertia prop on package page — verify JSON shape, feature flag gating
- [ ] T048 [US2] Feature test: `PATCH /recipients/{user}/rin/essentials` — updates user field, validates field whitelist

**Checkpoint**: Full Intelligence panel with real data. Essentials editable. Operational alerts accurate. Auth rep toggle works.

---

## Phase 4: US3 — Log Touchpoint With Duration, Activity & Sentiment (Priority: P1) 🎯 MVP

**Goal**: Coordinators log touchpoints capturing date, type, duration, activity, notes, sentiment. Monthly compliance indicator updates.

**Independent Test**: Log a touchpoint → verify touchpoint status updates to green → verify Last Conversation card reflects new entry.

### Implementation

- [ ] T049 [P] [US3] Create data class `domain/RelationshipIntelligence/Data/TouchpointData.php` — `#[TypeScript]`: id, date, type, durationMinutes, activity, sentiment, notes, recordedBy (string), createdAt
- [ ] T050 [P] [US3] Create data class `domain/RelationshipIntelligence/Data/StoreTouchpointData.php` — date (required, date, before_or_equal:today), type (TouchpointType enum, required), durationMinutes (nullable, integer, min:1, max:240), activity (nullable, TouchpointActivity enum), sentiment (nullable, TouchpointSentiment enum), notes (nullable, string)
- [ ] T051 [P] [US3] Create data class `domain/RelationshipIntelligence/Data/CorrectTouchpointData.php` — same validation as StoreTouchpointData
- [ ] T052 [US3] Create action `domain/RelationshipIntelligence/Actions/StoreTouchpoint.php` — AsAction + AsController. `authorize()`: policy create. `handle(User $recipient, StoreTouchpointData $data)`: create touchpoint with `recorded_by` = auth user. Route: `POST .../rin/touchpoint`
- [ ] T053 [US3] Create action `domain/RelationshipIntelligence/Actions/CorrectTouchpoint.php` — AsAction + AsController. `authorize()`: policy correct (24h or team leader). `handle(Touchpoint $touchpoint, CorrectTouchpointData $data)`: update in-place, set `corrected_at`/`corrected_by`. Activity Log captures before/after. Route: `POST .../rin/touchpoint/{touchpoint}/correct`
- [ ] T054 [US3] Create action `domain/RelationshipIntelligence/Actions/RetractTouchpoint.php` — AsAction + AsController. `handle(Touchpoint $touchpoint)`: set `retracted_at`/`retracted_by`. Route: `POST .../rin/touchpoint/{touchpoint}/retract`
- [ ] T055 [US3] Wire `resources/js/Components/RelationshipIntelligence/Intelligence/TouchpointSection/TouchpointForm.vue` — replace mock with real form. `useForm()` with `router.post()`. Show care mgmt badge when duration >= 15. Sentiment via `SentimentPicker`
- [ ] T056 [US3] Wire `resources/js/Components/RelationshipIntelligence/Intelligence/TouchpointSection/TouchpointStatus.vue` — accept touchpoint status prop ('contacted'|'due'|'overdue') and lastTouchpointDate. Show green/amber/red dot + label
- [ ] T057 [US3] Wire `resources/js/Components/RelationshipIntelligence/RinToolStrip.vue` — accept `touchpointStatus` from page props. Drive status dot colour on Intelligence icon

### Tests

- [ ] T058 [P] [US3] Unit test: `StoreTouchpoint` — valid input creates, date validation (no future), duration range, enum casts
- [ ] T059 [P] [US3] Unit test: `CorrectTouchpoint` — sets corrected_at/by, respects 24h window, team leader override. Activity Log records changes
- [ ] T060 [P] [US3] Unit test: `RetractTouchpoint` — sets retracted_at/by, retracted touchpoints excluded from queries via `scopeNotRetracted()`
- [ ] T061 [US3] Feature test: `POST /recipients/{user}/rin/touchpoint` — creates touchpoint, validates all fields, returns data
- [ ] T062 [US3] Feature test: Correction + retraction endpoints — 24h policy enforcement, team leader override

**Checkpoint**: Coordinators can log touchpoints. Status indicator updates. Corrections and retractions work with audit trail.

---

## Phase 5: US6 — Conversation Guide With Last Conversation & Personal Touch (Priority: P1) 🎯 MVP

**Goal**: Conversation Guide panel shows last conversation, opening carousel with data-driven mad-libs, personal touch prompts, dynamic call checklist from operational reasons, and conflict reference.

**Independent Test**: Open Guide for a client with recent touchpoint + bills on hold → verify Last Conversation shows, openers include bill-related reason, checklist includes "Discuss bills on hold".

### Implementation

- [ ] T063 [P] [US6] Create data class `domain/RelationshipIntelligence/Data/LastConversationData.php` — `#[TypeScript]`: coordinatorName, date, durationMinutes?, sentiment?, type, activity?, notes?
- [ ] T064 [P] [US6] Create data class `domain/RelationshipIntelligence/Data/PersonalTouchPromptData.php` — `#[TypeScript]`: text, source ('last_conversation'|'important_date'|'personal_context'), sourceDetail?
- [ ] T065 [P] [US6] Create data class `domain/RelationshipIntelligence/Data/ChecklistItemData.php` — `#[TypeScript]`: id (string), label (string), source (string — OperationalReason enum value), isPersonal (bool — true for the always-present personal connection item)
- [ ] T066 [P] [US6] Create data class `domain/RelationshipIntelligence/Data/OpenerData.php` — `#[TypeScript]`: id (string), template (string with `{name}` and `{reason}` placeholders), reasons (string[] — list of operational reason phrases for the mad-lib blank), isGeneric (bool)
- [ ] T067 [P] [US6] Create data class `domain/RelationshipIntelligence/Data/ConversationGuideData.php` — `#[TypeScript]`: lastConversation (?LastConversationData), personalTouchPrompts (PersonalTouchPromptData[]), checklistItems (ChecklistItemData[]), openers (OpenerData[]), contactName (string), contactMode ('client'|'auth-rep')
- [ ] T068 [P] [US6] Create data class `domain/RelationshipIntelligence/Data/RinData.php` — `#[TypeScript]`: intelligence (IntelligencePanelData), guide (ConversationGuideData), notes (object — recent notes array, populated in US7)
- [ ] T069 [US6] Create action `domain/RelationshipIntelligence/Actions/GeneratePersonalTouchPrompts.php` — AsAction. `handle(User $recipient)`: max 3 prompts. Priority: (1) latest non-retracted touchpoint notes — "Last time you chatted about: [notes]" truncated at ~100 chars, (2) Important Dates from personal_context_entries where date within 7 days of today, (3) fallback random from interests_hobbies and family_household entries
- [ ] T070 [US6] Create action `domain/RelationshipIntelligence/Actions/GenerateOperationalReasons.php` — AsAction. `handle(Package $package)`: evaluate each `OperationalReason` enum case against package data. Package must be eager-loaded with: bills, notes (90-day complaints), incidents (non-resolved), tasks (open), fundings (expiring). Returns `OperationalReason[]` of active reasons
- [ ] T071 [US6] Create action `domain/RelationshipIntelligence/Actions/GetConversationGuideData.php` — AsAction. `handle(User $recipient, Package $package)`: assemble ConversationGuideData. Uses `GeneratePersonalTouchPrompts`, `GenerateOperationalReasons`. Builds openers with data-driven reasons from translations. Builds checklist from operational reasons + always-present personal connection item: "Find something out about [name]" / "Discuss one of [name]'s interests" (alternating wording)
- [ ] T072 [US6] Create action `domain/RelationshipIntelligence/Actions/GetRinData.php` — AsAction. `handle(User $recipient, Package $package)`: assembles full `RinData` (intelligence + guide + notes placeholder). Single entry point for the Inertia prop
- [ ] T073 [US6] Update package page controller — replace individual intelligence prop with single `'rin' => fn () => GetRinData::run($recipient, $package)` Inertia prop (gated by feature flag)
- [ ] T074 [US6] Wire `resources/js/Components/RelationshipIntelligence/ConversationGuide/ConversationGuidePanel.vue` — accept `rin.guide` prop, pass to child components
- [ ] T075 [US6] Wire `resources/js/Components/RelationshipIntelligence/ConversationGuide/LastConversation.vue` — accept `LastConversationData` prop, show "No previous conversations logged" when null
- [ ] T076 [US6] Wire `resources/js/Components/RelationshipIntelligence/ConversationGuide/OpeningTheCall/OpenerCard.vue` — accept `OpenerData` prop. Mad-lib blanks cycle through `reasons` array. Replace `{name}` with contactName
- [ ] T077 [US6] Wire `resources/js/Components/RelationshipIntelligence/ConversationGuide/PersonalTouch/PersonalTouchSection.vue` — accept `personalTouchPrompts` prop. Check/dismiss are local UI state (not persisted)
- [ ] T078 [US6] Wire `resources/js/Components/RelationshipIntelligence/ConversationGuide/PersonalTouch/AddPersonalTouch.vue` — `@save` calls `router.post(route('rin.context.store', { user }), { category: 'interests_hobbies', content })` — creates both a prompt card and a personal context pill
- [ ] T079 [US6] Wire `resources/js/Components/RelationshipIntelligence/ConversationGuide/GettingToBusiness/CallChecklist.vue` — accept `checklistItems` prop. Checkable but not persisted (local reactive state, resets on panel close). Scroll overflow when > 4 items
- [ ] T080 [US6] Wire `resources/js/Components/RelationshipIntelligence/ConversationGuide/GettingToBusiness/TransitionCarousel.vue` — semi-static carousel of transition phrases (template-based for V1)
- [ ] T081 [US6] Update `IntelligencePanel.vue` to accept data from `rin.intelligence` prop (align with single RinData shape)
- [ ] T082 [US6] Wire auth rep name swap — when `contactMode === 'auth-rep'`, opener cards use auth rep name, blue banner shows "Calling [Rep Name] (auth rep) — conversation is about [Client Name]"

### Tests

- [ ] T083 [P] [US6] Unit test: `GeneratePersonalTouchPrompts` — max 3 prompts, priority ordering, note truncation at 100 chars, Important Date within 7 days, fallback to interests/family
- [ ] T084 [P] [US6] Unit test: `GenerateOperationalReasons` — bills on hold detected, 90-day complaint window, incidents by stage, budget expiring, empty package returns no reasons
- [ ] T085 [P] [US6] Unit test: `GetConversationGuideData` — checklist includes personal connection item always, openers have data-driven reasons, auth rep mode swaps contact name
- [ ] T086 [US6] Feature test: `GetRinData` returns complete shape — intelligence + guide + notes. Feature flag gating. Auth rep data included when primary rep exists

**Checkpoint**: Full Conversation Guide with real data-driven content. Openers reference actual operational reasons. Checklist reflects client's current state.

---

## Phase 6: US7 — Quick Notes Panel (Priority: P2)

**Goal**: Coordinators capture notes mid-call with category tagging. "Log as Touchpoint" creates both a note and a touchpoint.

**Independent Test**: Type a note → select category → Save → verify it appears on Notes tab. Then test "Log as Touchpoint" creates both.

### Implementation

- [ ] T087 [P] [US7] Create data class `domain/RelationshipIntelligence/Data/StoreQuickNoteData.php` — content (string, required, max:5000), category (nullable, from existing `NoteCategoryEnum`), packageId (required, exists:packages), logAsTouchpoint (boolean, default false)
- [ ] T088 [US7] Create action `domain/RelationshipIntelligence/Actions/StoreQuickNote.php` — AsAction + AsController. `handle(User $recipient, StoreQuickNoteData $data)`: create Note via existing `NoteService::store()` on the package. If `logAsTouchpoint = true`, also create Touchpoint with content in notes field, type = PHONE_CALL (default), date = today. Route: `POST .../rin/note`
- [ ] T089 [US7] Update `GetRinData` to include recent notes — query `$package->notes()->latest()->limit(10)->get()` and map to note data shape for the Quick Notes panel
- [ ] T090 [US7] Wire `resources/js/Components/RelationshipIntelligence/QuickNotes/QuickNotesPanel.vue` — accept `rin.notes` prop for recent notes list
- [ ] T091 [US7] Wire `resources/js/Components/RelationshipIntelligence/QuickNotes/NoteInput.vue` — category dropdown uses real `NoteCategoryEnum` values (passed as prop or from generated types). `useForm()` with `router.post()`. "Log as Touchpoint" checkbox
- [ ] T092 [US7] Wire `resources/js/Components/RelationshipIntelligence/QuickNotes/RecentNotes.vue` — accept notes array prop, display read-only list with category badge and timestamp

### Tests

- [ ] T093 [P] [US7] Unit test: `StoreQuickNote` — creates note via NoteService, category maps correctly, logAsTouchpoint creates both Note + Touchpoint
- [ ] T094 [US7] Feature test: `POST /recipients/{user}/rin/note` — note persists, appears on Notes tab, touchpoint created when flag set

**Checkpoint**: Quick Notes panel fully functional. Notes persist. "Log as Touchpoint" creates dual records.

---

## Phase 7: US8 — Feature Flag Gradual Rollout (Priority: P3)

**Goal**: RIN is toggleable per organisation via PostHog feature flag. Data preserved when flag is off.

**Independent Test**: Enable flag for Org A → see RIN. Disable → RIN hidden, data preserved. Enable for Org B → they see RIN independently.

### Implementation

- [ ] T095 [US8] Verify feature flag integration — `HasFeatureFlag` component in `PackageViewLayout.vue` correctly shows/hides tool strip + panels based on `relationship-intelligence` flag
- [ ] T096 [US8] Verify backend middleware — `check.feature.flag:relationship-intelligence` on all RIN routes returns 403 when flag disabled
- [ ] T097 [US8] Verify data preservation — when flag is toggled off, personal_context_entries and touchpoints remain in DB. When re-enabled, data reappears
- [ ] T098 [US8] Verify Inertia prop is not computed when flag is off — no unnecessary queries when RIN is disabled

### Tests

- [ ] T099 [US8] Feature test: Flag enabled → RIN routes accessible, flag disabled → 403. Flag toggled → data preserved
- [ ] T100 [US8] Feature test: Package page does not include `rin` prop when flag is disabled (no performance impact)

**Checkpoint**: Feature flag works per-org. Clean enable/disable with no data loss.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Responsive behaviour, accessibility, performance, type generation, final hardening.

- [ ] T101 [P] Responsive: `RinFloatingPanel.vue` becomes slide-over via `CommonModal` at `<1280px` — use `useMediaQuery` from VueUse
- [ ] T102 [P] Accessibility: keyboard navigation for all panels — Tab through tool strip icons, Enter to toggle, Escape to close panel. ARIA labels on all interactive elements
- [ ] T103 [P] Accessibility: WCAG AA contrast check on all badge colours, status dots, sentiment emojis, caution/info highlights
- [ ] T104 Run `php artisan typescript:transform` — verify all `#[TypeScript]` Data classes generate correct types in `generated.d.ts`. Update frontend types to reference generated types
- [ ] T105 Performance: verify RIN data loads in <200ms — profile `GetRinData` action, add eager loading for all operational context queries in a single `$package->load([...])` call
- [ ] T106 Performance: verify touchpoint save in <500ms — profile `StoreTouchpoint` action
- [ ] T107 [P] Empty states: verify all panels show correct empty states — no context, no touchpoints, no notes, no auth rep, no operational alerts ("No alerts")
- [ ] T108 Run `vendor/bin/pint --dirty` on all new PHP files
- [ ] T109 Full Pest regression: `php artisan test --compact --filter=RelationshipIntelligence` — all tests pass
- [ ] T110 Dusk browser tests: panel open/close, pill add/remove, touchpoint log, essentials edit, auth rep toggle, quick note save

**Checkpoint**: All tests pass. Accessible. Responsive. Performant. Types generated.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Foundation)**: No dependencies — start immediately. BLOCKS all user stories
- **Phase 2 (US1)**: Depends on Phase 1 — no dependencies on other stories
- **Phase 3 (US2)**: Depends on Phase 1 — integrates with US1 (personal context in Intelligence panel)
- **Phase 4 (US3)**: Depends on Phase 1 — touches TouchpointForm which is independent
- **Phase 5 (US6)**: Depends on Phases 1 + 2 + 4 — personal touch pulls from context, last conversation from touchpoints
- **Phase 6 (US7)**: Depends on Phase 1 — can run in parallel with US2/US3 but integrates touchpoint creation
- **Phase 7 (US8)**: Can run in parallel with any phase — verification only
- **Phase 8 (Polish)**: Depends on all previous phases

### Recommended Execution Order (Single Developer)

1. Phase 1 → Foundation
2. Phase 2 → US1 (Personal Context)
3. Phase 3 → US2 (Quick Essentials + Operational Context)
4. Phase 4 → US3 (Touchpoints)
5. Phase 5 → US6 (Conversation Guide — needs context + touchpoints)
6. Phase 6 → US7 (Quick Notes)
7. Phase 7 → US8 (Feature Flag verification)
8. Phase 8 → Polish

### Parallel Opportunities (Multiple Developers)

After Phase 1:
- **Developer A**: US1 (context) → US6 (guide)
- **Developer B**: US2 (essentials) → US3 (touchpoints) → US7 (notes)
- **Developer C**: US8 (flags) → Phase 8 (polish)

---

## Task Summary

| Phase | Tasks | Story | Priority |
|-------|-------|-------|----------|
| 1. Foundation | T001-T019 (19 tasks) | All | — |
| 2. Personal Context | T020-T030 (11 tasks) | US1 | P1 🎯 |
| 3. Quick Essentials | T031-T048 (18 tasks) | US2 | P1 🎯 |
| 4. Touchpoints | T049-T062 (14 tasks) | US3 | P1 🎯 |
| 5. Conversation Guide | T063-T086 (24 tasks) | US6 | P1 🎯 |
| 6. Quick Notes | T087-T094 (8 tasks) | US7 | P2 |
| 7. Feature Flag | T095-T100 (6 tasks) | US8 | P3 |
| 8. Polish | T101-T110 (10 tasks) | All | — |
| **Total** | **110 tasks** | | |

---

## Notes

- All frontend components already exist with mock data — wiring tasks replace mock data with real props + API calls
- [P] tasks = different files, no dependencies between them
- Commit after each task or logical group
- Run `php artisan typescript:transform` after creating Data classes to keep generated types current
- `OperationalReason` enum + translations are the most architecturally novel part — get these right in Phase 1
- Personal Touch prompt generation is rule-based V1 — no NLP/AI needed
- US4 (Compliance Dashboard) and US5 (Interaction Timeline) are Phase 2 — not included in this task list
