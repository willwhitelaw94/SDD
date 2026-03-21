---
title: "Implementation Plan: Calls Uplift"
---

# Implementation Plan: Calls Uplift

**Spec**: [spec.md](./spec.md)
**Created**: 2026-02-05
**Status**: Clarified

---

## Technical Context

### Technology Stack
- **Backend**: Laravel 12, PHP 8.3
- **Frontend**: Vue 3, Inertia.js v2, TypeScript
- **Database**: MySQL
- **Queue**: Redis + Laravel Horizon
- **Existing**: Aircall module (`app-modules/aircall/`) — all new code lives here
- **External**: Trilogy Graph (webhook provider, owns API contract)

### Dependencies

| Dependency | Status | Notes |
|------------|--------|-------|
| Trilogy Graph webhook API | **Ready** | Graph owns the contract. Direct controller + job (no Spatie WebhookClient) |
| Existing `AircallCall` model | Complete | Extend with review fields |
| Care Management Activities | Complete | Activity creation hooks exist. Create 'Phone Call' type if needed |
| Package Notes | Complete | Notes infrastructure ready |
| S3 Call Recordings | Complete | 7-year retention in place |
| Teams & Team Leader model | Complete | `Team.team_leader_id` + `User.teamsLed()` relationships ready |

### Constraints
- **Data Source**: All call data + phone matching from Trilogy Graph (not direct Aircall)
- **Desktop Only**: MVP is desktop Portal only (no mobile)
- **Human-in-Loop**: AI summaries require coordinator review before activity logging
- **Permissions**: Capabilities tied to Aircall account, not internal/external status
- **No Broadcasting**: Laravel Echo/broadcasting not set up — use polling for MVP

---

## Gates

| Gate | Status | Notes |
|------|--------|-------|
| Majestic Monolith | ✅ Pass | All features in tc-portal, Graph is external API |
| Domain-Driven Design | ✅ Pass | Extend Aircall module (not new domain) |
| Convention Over Configuration | ✅ Pass | Follow existing patterns |
| Code Quality Standards | ✅ Pass | Type safety, descriptive names |
| Testing First-Class | ✅ Pass | Unit + Feature Pest tests (no browser tests Phase 1) |
| Event Sourcing | ⚠️ Consider | Activity logging may need audit trail |
| Laravel Data for DTOs | ✅ Pass | Use Data classes for webhook payloads |
| Action Classes | ✅ Pass | CompleteCallReviewAction, LinkCallToPackageAction |
| Inertia + Vue 3 | ✅ Pass | Vue pages for inbox, Inertia modal for review detail |
| Component Library | ✅ Pass | CommonTable for inbox, Inertia modal for review |
| Feature Flags | ✅ Pass | PostHog `calls-inbox-v1` for gradual rollout |
| Permissions | ✅ Pass | Gate: has_aircall_account + team leader role-based |

---

## Design Decisions

### Data Model

**Extend `aircall_calls` table** (don't create new table):

```
aircall_calls (existing)
├── ... existing fields ...
│
├── review_status (enum: pending_transcription, pending_review, in_review, reviewed, archived, escalated)
├── reviewed_at (datetime, nullable)
├── reviewed_by (foreign key to users, nullable)
├── reviewing_user_id (foreign key to users, nullable — concurrency lock)
├── reviewing_started_at (datetime, nullable — lock timestamp, 10 min auto-release)
├── transcription_id (foreign key to call_transcriptions, nullable)
├── case_note_id (foreign key to notes, nullable)
├── activity_id (foreign key to care_management_activities, nullable)
├── graph_call_id (string, nullable — Graph's call identifier)
├── wrap_up_seconds (integer, default 900 — 15 min)
├── escalated_to_user_id (foreign key to users, nullable)
├── escalation_note (text, nullable)
└── escalated_at (datetime, nullable)
```

**Migration strategy**: `review_status` defaults to NULL. Existing historical calls are untouched — only new calls entering the system post-deployment get review statuses. No backfill.

**New `call_transcriptions` table**:

```
call_transcriptions
├── id (ulid) ← ULID primary key, consistent with newer Portal patterns
├── aircall_call_id (foreign key)
├── graph_transcription_id (string)
├── transcription_text (longtext)
├── ai_summary (text, nullable)
├── ai_suggested_case_note (text, nullable)
├── ai_suggested_tasks (json, nullable — array of {title, description?} objects from Graph)
├── speaker_segments (json, nullable)
├── received_at (datetime)
├── created_at, updated_at
```

**Key Relationships**:
- `AircallCall` hasOne `CallTranscription`
- `AircallCall` belongsTo `Note` (case_note)
- `AircallCall` belongsTo `CareManagementActivity`
- `AircallCall` belongsTo `User` (reviewed_by)
- `AircallCall` belongsTo `User` (reviewing_user — concurrency lock)
- `AircallCall` belongsTo `User` (escalated_to)

### Review Status State Machine

```
pending_transcription → pending_review (auto after 24h or when transcription arrives)
pending_review → in_review (coordinator opens call for review)
in_review → reviewed (coordinator completes review)
in_review → archived (coordinator archives — no entity link needed)
in_review → escalated (coordinator escalates to team leader)
in_review → pending_review (coordinator closes without completing, or 10 min lock timeout)
escalated → in_review (team leader opens escalated call)
```

**Concurrency lock**: `reviewing_user_id` + `reviewing_started_at`. Lock auto-releases after 10 minutes. Second reviewer sees "Being reviewed by [Name]" indicator.

### Activity Duration Model

Activities store **separate fields** for call time vs admin time:
- `call_duration_seconds` — from Aircall, fixed/not editable
- `wrap_up_seconds` — defaults to 900 (15 min), adjustable by coordinator
- Total activity time = `call_duration_seconds + wrap_up_seconds`

Create 'Phone Call' activity type if it doesn't exist.

### API Contracts

**Webhook Receiver (Graph → Portal)**:

```
POST /api/webhooks/graph/call-transcription
```

Graph owns the payload contract. Portal adapts to whatever they send. Direct controller validates payload and dispatches `ProcessGraphTranscriptionJob` (no Spatie WebhookClient).

**Internal Endpoints**:

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/staff/calls` | GET | Calls Inbox page (CommonTable) |
| `/staff/calls/{call}` | GET | Call review detail (Inertia modal, slide-from-right, deferred props) |
| `/staff/calls/{call}/complete-review` | POST | Complete Call Review → logs activity, optional case note |
| `/staff/calls/{call}/link` | POST | Link call to entity (Package, Coordinator, Provider) |
| `/staff/calls/{call}/archive` | POST | Archive call (dismiss from inbox) |
| `/staff/calls/{call}/escalate` | POST | Escalate to team leader with required note |
| `/api/staff/calls/pending-count` | GET | Badge count for polling (60s interval) |
| `/staff/calls/{call}/create-task` | POST | Create task from AI suggestion (instant, linked to package) |
| `/staff/calls/{call}/regenerate` | POST | Regenerate AI content (summary + case note + tasks) via Graph |

### UI Architecture

**No split-view panel.** Table-based layout with modal for review detail:

- **Calls Index** (`/staff/calls`): `CommonTable` with status tab filtering (Pending, Reviewed, Archived, Escalated), sortable/searchable. Team leaders get coordinator filter.
- **Call Review**: Slide-from-right Inertia `modal()` with deferred props. Shows transcription, AI case note (editable), duration + wrap-up fields, link/archive/escalate/complete actions.
- **Post-review flow**: After completing review, modal closes AND table refreshes. "Review Next" option opens the next pending call's modal. Toast confirms "Call reviewed".
- **Notification badge**: Header badge showing `pending_review` count. Polled every 60 seconds via API endpoint.
- **Toast notifications**: In-app toast only (no browser push — deferred to Phase 2). Toast shown when pending count increases during polling.

**Existing Components (reuse)**:
- `CommonTable` — Calls list
- `CommonTabs` — Status tab filtering (`:items` prop)
- `CommonBadge` — Status/direction indicators
- `CommonButton` — Actions
- `CommonEmptyPlaceholder` — Empty inbox state
- Inertia `modal()` — Review detail

**New Components**:
- `Pages/Staff/Calls/Index.vue` — Calls Inbox page
- `Pages/Staff/Calls/Show.vue` — Call Review modal (Inertia modal)
- `Components/Call/CallTranscriptionViewer.vue` — Display transcription with speakers
- `Components/Call/CallInboxBadge.vue` — Header badge with pending count + polling
- `Components/Call/AiSuggestedTasks.vue` — Displays AI-suggested tasks from Graph with instant-add (+) buttons
- `Components/Call/AiSummarySection.vue` — AI summary with Regenerate + Save as Note actions

### Team Leader Access

- Team leaders see calls from **all teams they lead** (via `User->teamsLed()->with('users')`)
- Query: calls where the call's user belongs to any team the TL leads
- TL inbox has additional coordinator filter dropdown
- TL can complete reviews on behalf — `reviewed_by` set to TL
- TL inbox access is **role-based** (team leader status), not Aircall-account-dependent

### Code Location

All new code lives in the **Aircall module** (`app-modules/aircall/`):
- Models: `CallTranscription`, extend `AircallCall`
- Enums: `CallReviewStatus`
- Actions: `CompleteCallReviewAction`, `LinkCallToEntityAction`, `ArchiveCallAction`, `EscalateCallAction`
- Controllers: `CallsInboxController`, `CallReviewController`
- Jobs: `ProcessGraphTranscriptionJob`, `AutoTransitionPendingTranscriptionJob`
- Data: `GraphTranscriptionData`, `CallReviewData`
- Vue pages: `resources/js/Pages/Staff/Calls/`

---

## Implementation Phases

### Phase 1: Infrastructure (Week 1-2)

**1.1 Database Schema**
- [ ] Migration: Add review fields to `aircall_calls` (review_status, reviewed_at, reviewed_by, reviewing_user_id, reviewing_started_at, wrap_up_seconds, escalation fields, graph_call_id)
- [ ] Migration: Create `call_transcriptions` table (ULID PK)
- [ ] Model: Extend `AircallCall` with new relationships and review scopes
- [ ] Model: Create `CallTranscription` model
- [ ] Enum: `CallReviewStatus` (6 states: pending_transcription, pending_review, in_review, reviewed, archived, escalated)

**1.2 Graph Webhook Integration**
- [ ] Route: `POST /api/webhooks/graph/call-transcription`
- [ ] Controller: Direct controller (no Spatie WebhookClient) — validates, dispatches job
- [ ] Job: `ProcessGraphTranscriptionJob` — creates transcription, updates call status
- [ ] Data: `GraphTranscriptionData` (Laravel Data)
- [ ] Action: `CreateCallTranscriptionAction`

**1.3 Review Status Flow**
- [ ] Scope: `AircallCall::pendingReview()`, `::inReview()`, `::forUser($userId)`
- [ ] Scope: `AircallCall::forTeamLeader($userId)` — calls from all teams led
- [ ] Job: `AutoTransitionPendingTranscriptionJob` — scheduled, moves calls >24h old to pending_review
- [ ] Lock: 10-minute auto-release for `in_review` status

### Phase 2: Core UI (Week 3-4)

**2.1 Calls Inbox Page**
- [ ] Controller: `CallsInboxController@index`
- [ ] Page: `resources/js/Pages/Staff/Calls/Index.vue`
- [ ] Route: `/staff/calls`
- [ ] CommonTable with status tabs (Pending, Reviewed, Archived, Escalated)
- [ ] Filters: review status, date range, direction, linked/unlinked
- [ ] Sort: date (newest first default), duration
- [ ] Search: phone number, package name, caller name
- [ ] Team leader: coordinator filter dropdown
- [ ] Pagination: Server-side

**2.2 Call Review Modal**
- [ ] Controller: `CallReviewController@show` (returns Inertia modal)
- [ ] Page: `resources/js/Pages/Staff/Calls/Show.vue` (slide-from-right modal)
- [ ] Deferred props for call detail, transcription, AI case note
- [ ] Display: Transcription viewer, AI case note (editable), duration + wrap-up fields
- [ ] Actions: Complete Review, Link to Entity, Archive, Escalate
- [ ] Post-review: Close modal + refresh table + toast. "Review Next" option.

**2.3 Notification Badge**
- [ ] Component: `CallInboxBadge.vue` in header
- [ ] API: `GET /api/staff/calls/pending-count`
- [ ] Polling: Every 60 seconds
- [ ] Toast: Show when pending count increases

**2.4 Navigation**
- [ ] Sidebar: "Calls" item under COMMUNICATION section (above Threads)
- [ ] Icon: `heroicons-outline/phone`
- [ ] Feature flag: `calls-inbox-v1` gates visibility

### Phase 3: Integration (Week 5)

**3.1 Activity Creation**
- [ ] Action: `CompleteCallReviewAction`
- [ ] Create: `CareManagementActivity` with separate `call_duration_seconds` + `wrap_up_seconds`
- [ ] Activity type: 'Phone Call' (create if doesn't exist)
- [ ] Link: Activity to package
- [ ] Attribute: To coordinator who handled call (or TL if reviewed on behalf)

**3.2 Case Note Integration**
- [ ] AI case note pre-filled from Graph, editable text area
- [ ] On complete: Create package note tagged with call metadata (date, duration, direction)
- [ ] Link: Note back to call record

**3.3 Entity Linking**
- [ ] Action: `LinkCallToEntityAction`
- [ ] Polymorphic: Link to Package, Coordinator, Provider via `aircall_aircallables`
- [ ] Search: Unified search across entity types, results grouped by type
- [ ] Suggestions: Previously-linked entity highlighted at top (not auto-linked)

**3.4 Escalation**
- [ ] Action: `EscalateCallAction`
- [ ] UI: Team leader dropdown + required note field
- [ ] Data: `escalated_to_user_id`, `escalation_note`, `escalated_at` on aircall_calls
- [ ] Notification: In-app toast to assigned TL (polling-based)

### Phase 4: Polish (Week 6)

**4.1 External Coordinator Access**
- [ ] Gate: `has_aircall_account`
- [ ] View: Call history on package Timeline tab (view-only if no Aircall)
- [ ] Empty state: "Connect your Aircall account to see calls" CTA

**4.2 Edge Cases**
- [ ] Duplicate prevention (FR-008) — idempotent activity creation
- [ ] Transcription timeout: Auto-transition after 24h, "Transcription unavailable" indicator
- [ ] Missed calls: Red "Missed" badge, no duration, follow-up indicator
- [ ] Short calls (<30s): "Short call" indicator
- [ ] Archive: Optimistic UI, toast with 5-second undo
- [ ] Concurrent review: "Being reviewed by [Name]" indicator

**4.3 Testing**
- [ ] Unit: Review status enum transitions, duration calculations
- [ ] Feature: Webhook endpoint processing
- [ ] Feature: Complete review action (activity creation, case note)
- [ ] Feature: Link/archive/escalate actions
- [ ] Feature: Permission gates (Aircall account, team leader access)
- [ ] Feature: 10-minute lock auto-release

### Cross-Feature: Task Integration (with Tasks MVP)

**AI-Suggested Tasks from Call Transcriptions**:
- Graph's transcription webhook includes `ai_suggested_tasks` — an array of task objects extracted from the call content
- Stored as JSON on `call_transcriptions.ai_suggested_tasks`
- Displayed in the review drawer under the AI Summary section (see screenshot mockup)
- Each suggested task shows title + star icon + **+** button
- Clicking **+** instantly creates a Task (via `domain/Task`) linked to the call's package via `task_linkables`
- Task created with: title from suggestion, `created_by` = reviewing user, linked to package, default priority/stage
- **REGENERATE** button re-calls Graph API to regenerate summary + case note + tasks
- **SAVE AS NOTE** button saves the AI summary as a package case note

**Integration with Tasks MVP**:
- Uses existing `POST /tasks` endpoint or `StoreTask` action from Task domain
- Task linked to package via `task_linkables` polymorphic pivot (from Tasks MVP plan)
- `TaskSuggestionData` DTO (currently empty placeholder) can be populated with Graph's suggested task structure
- Tasks created from calls appear in the Tasks Inbox like any other task

### Deferred to Phase 2+

- [ ] Batch "Complete All" for multiple linked calls (FR-036)
- [ ] Browser push notifications (FR-029) — requires Laravel Echo/Reverb setup
- [ ] Call Bridge UI (real-time context during active calls)
- [ ] Call notes during active call
- [ ] Call recordings playback
- [ ] Browser (Dusk/Playwright) tests

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Graph API contract changes | Low | Medium | Direct controller adapts to payload; Data class maps fields |
| Transcription never arrives | Low | Medium | 24h auto-transition to pending_review; coordinator reviews without transcript |
| Coordinator adoption low | Low | High | Toast notifications; training; measure completion rate |
| Performance under load | Low | Medium | Pagination; async job processing; index review_status column |
| Concurrent review conflicts | Low | Low | 10-minute auto-release lock; "Being reviewed by" indicator |

---

## Feature Flag

```php
// PostHog flag: calls-inbox-v1
if (Feature::active('calls-inbox-v1')) {
    // Show Calls Inbox in navigation
    // Enable webhook processing
}
```

Rollout plan:
1. Internal team (10 users) - Week 6
2. Pilot coordinators (50 users) - Week 7
3. All coordinators with Aircall (250 users) - Week 8

---

## Monitoring

| Metric | Target | Alert |
|--------|--------|-------|
| Webhook success rate | >99% | <95% for 5 min |
| Inbox backlog age | <24h | Any call >48h old |
| Review completion rate | >80% | <50% daily |
| Activity creation errors | 0 | Any error |
| Lock timeout releases | <5/day | >20/day (indicates UX issue) |

---

## Next Steps

1. Run `/speckit-tasks` to generate implementation task breakdown
2. Run `/trilogy-mockup` if more wireframes needed for table + modal layout
3. Start Phase 1 implementation

---

## Development Clarifications

### Session 2026-03-05

- Q: Should `call_transcriptions` use ULID or integer PK? → A: **ULID** — consistent with newer Portal domain tables, better for distributed/async webhook processing
- Q: How should the `in_review` concurrency lock timeout work? → A: **10 min auto-release** — lock expires after 10 minutes of inactivity, call reverts to pending_review. Simple, prevents stale locks.
- Q: Where should new Calls Uplift domain logic live? → A: **Extend Aircall module** — all call-related code stays in `app-modules/aircall/`. Controllers, actions, enums, Vue pages all within the module.
- Q: Should browser push notifications be in Phase 1? → A: **Defer to Phase 2** — MVP uses in-app toast only via polling. Laravel Echo/broadcasting not set up in Portal. Polling every 60 seconds is sufficient.
- Q: How should activity duration be stored? → A: **Separate fields** — `call_duration_seconds` (fixed from Aircall) + `wrap_up_seconds` (adjustable, default 900). Create 'Phone Call' activity type if it doesn't exist.
- Q: Graph webhook integration pattern? → A: **Direct controller + job** — no Spatie WebhookClient. Graph is a trusted internal service. Simple controller validates payload, dispatches `ProcessGraphTranscriptionJob`.
- Q: How should the Calls Index layout work? → A: **Table-based** — no split-view panel. `CommonTable` with status tabs. Call review opens as slide-from-right Inertia modal.
- Q: How should the Call Review detail appear? → A: **Slide-from-right Inertia modal** with deferred props. Snappy, front-end driven. Follows existing `Inertia::modal()` pattern.
- Q: How to handle existing aircall_calls records during migration? → A: **New calls only** — `review_status` defaults to NULL. Existing records untouched. Only calls received after deployment enter the review pipeline.
- Q: How should escalation data be stored? → A: **Columns on aircall_calls** — `escalated_to_user_id`, `escalation_note`, `escalated_at` directly on the table. Simple, one escalation per call. MVP-appropriate.
- Q: How should TL inbox query "my team's calls"? → A: **All teams led** — query calls where the call's user belongs to any team the TL leads via `User->teamsLed()->with('users')`.
- Q: How should toast notifications be delivered? → A: **Polling** — poll `/api/staff/calls/pending-count` every 60 seconds. Show toast when count increases. Zero new infrastructure.
- Q: What happens after completing a review in the modal? → A: **Both** — close modal + refresh table (with filters). Also offer "Review Next" to open the next pending call's modal. Toast confirms "Call reviewed".
- Q: How should batch "Complete All" work? → A: **Deferred to Phase 2** — MVP is individual review only. Reduces scope and complexity.
- Q: What testing strategy for Phase 1? → A: **Unit + Feature tests** — Pest unit tests for status transitions and duration calculations. Pest feature tests for webhook, actions, and permissions. No browser tests in Phase 1.
