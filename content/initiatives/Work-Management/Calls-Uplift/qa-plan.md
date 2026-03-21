---
title: "QA Test Plan: Calls Uplift"
created: 2026-03-05
status: Draft
---

# QA Test Plan: Calls Uplift

**Epic**: CALLS-UPLIFT (CUL)
**Spec**: [spec.md](spec)
**Branch**: `feature/tasks-mvp`

---

## Summary

| Metric | Count |
|--------|-------|
| **Total Test Cases** | 34 |
| **P1 (Critical)** | 16 |
| **P2 (Important)** | 12 |
| **P3 (Nice to have)** | 6 |
| **Browser Tests** | 28 |
| **Automated (Pest)** | 6 |
| **Manual** | 0 |

---

## Test Cases

### Calls Index Page (US3 — Call Reviews from Inbox)

#### TC-001: Calls table loads with correct columns

**AC Reference**: US3-AC1 (call appears with transcription, duration, caller info, linked package)
**Priority**: P1
**Severity if fails**: Sev 1
**Method**: Browser

**Preconditions**:
- User is logged in with `viewAny` AircallCall permission
- Calls exist in the database with various `review_status` values

**Steps**:
1. Navigate to `/staff/calls`
2. Verify page title is "Calls"
3. Verify table renders with columns: Caller, Direction, Duration, Linked To, Date, Status

**Expected Result**:
- Table renders with all columns
- Caller column shows avatar (initials) + name + phone number
- Direction column shows coloured icon (teal inbound, teal outbound, red missed)
- Duration shows formatted time (e.g. "12:34")
- Linked To shows entity name with green check or "Unlinked" with unlink icon
- Date shows formatted timestamp
- Status shows `CommonBadge` with review status

**Test Data**:
- At least 5 `AircallCall` records with: `pending_review`, `reviewed`, `archived`, `escalated`, `pending_transcription`
- At least 2 calls linked to packages, 2 unlinked

**Edge Cases**:
- Empty table (no calls) — should show empty state
- Call with no caller name — should show phone number only

---

#### TC-002: Direction filter works

**AC Reference**: FR-033 (filter by direction)
**Priority**: P2
**Severity if fails**: Sev 3
**Method**: Browser

**Preconditions**:
- Calls exist with inbound, outbound, and missed directions

**Steps**:
1. Navigate to `/staff/calls`
2. Click the Direction filter dropdown
3. Select "Inbound"
4. Verify only inbound calls are shown
5. Select "Outbound"
6. Verify only outbound calls are shown
7. Select "All" to reset

**Expected Result**:
- Filter correctly filters by direction
- Table updates without full page reload

**Test Data**:
- At least 1 inbound, 1 outbound, 1 missed call

---

#### TC-003: Search by phone number

**AC Reference**: FR-035 (search by phone number)
**Priority**: P2
**Severity if fails**: Sev 3
**Method**: Browser

**Preconditions**:
- Calls exist with known phone numbers (`raw_digits`)

**Steps**:
1. Navigate to `/staff/calls`
2. Enter a known phone number in the search field
3. Verify matching calls appear
4. Clear search
5. Verify all calls reappear

**Expected Result**:
- Search filters calls by phone number digits
- Partial matches work

**Test Data**:
- Calls with distinct `raw_digits` values

---

#### TC-004: Pagination works

**AC Reference**: Design: "Pagination: Server-side, 25 per page"
**Priority**: P2
**Severity if fails**: Sev 3
**Method**: Browser

**Preconditions**:
- More than 25 calls exist

**Steps**:
1. Navigate to `/staff/calls`
2. Verify first page shows up to 25 calls
3. Click "Next" page
4. Verify next page loads with different calls

**Expected Result**:
- Pagination controls visible
- Navigation between pages works
- Page shows correct count

**Test Data**:
- 30+ `AircallCall` records

---

### Call Review Detail (US3 — Complete Call Reviews)

#### TC-005: Open call review detail page

**AC Reference**: US3-AC1 (call appears with transcription, duration, caller info)
**Priority**: P1
**Severity if fails**: Sev 1
**Method**: Browser

**Preconditions**:
- A call exists with `review_status = pending_review` and a transcription
- Call is linked to a package

**Steps**:
1. Navigate to `/staff/calls`
2. Click on a `pending_review` call row
3. Verify review page loads at `/staff/calls/{id}`

**Expected Result**:
- Page shows caller header with avatar initials, name, phone number, direction badge
- Duration breakdown visible: call time + wrap-up time = total
- Transcription section shows speaker segments
- AI Summary section visible (if transcription has AI summary)
- Footer shows action buttons: Archive, Escalate, Complete Review

**Test Data**:
- `AircallCall` with `review_status = pending_review`, linked package, and `CallTranscription` record with `transcription_text`, `ai_summary`, `speaker_segments`

---

#### TC-006: Unlinked call shows warning banner

**AC Reference**: US3-AC4 (call NOT linked, prompted to link first)
**Priority**: P1
**Severity if fails**: Sev 2
**Method**: Browser

**Preconditions**:
- A call exists with `review_status = pending_review` and no linked entities

**Steps**:
1. Navigate to `/staff/calls/{call-id}` for an unlinked call
2. Verify amber warning banner appears: "No package linked"
3. Verify hint text: "Link a package before completing review"

**Expected Result**:
- Amber/yellow warning banner clearly visible
- Complete Review button is either disabled or prompts for link first

**Test Data**:
- `AircallCall` with no entries in `aircall_aircallables` pivot

---

#### TC-007: Duration breakdown displays correctly

**AC Reference**: FR-015 (call duration + wrap-up time)
**Priority**: P1
**Severity if fails**: Sev 2
**Method**: Browser

**Preconditions**:
- Call with known `duration` (Aircall) and `wrap_up_seconds` (default 900)

**Steps**:
1. Open call review page for a call with duration 754 seconds (12:34) and wrap_up_seconds 900 (15:00)
2. Verify Call Time shows "12:34"
3. Verify Wrap-up shows "15:00"
4. Verify Total shows "27:34"

**Expected Result**:
- Call time is read-only (from Aircall)
- Wrap-up time shown (defaults to 15:00)
- Total correctly sums both values

**Test Data**:
- `AircallCall` with `duration = 754`, `wrap_up_seconds = 900`

---

#### TC-008: Transcription viewer shows content

**AC Reference**: US3-AC1 (transcription text visible)
**Priority**: P1
**Severity if fails**: Sev 2
**Method**: Browser

**Preconditions**:
- Call has a `CallTranscription` with speaker segments

**Steps**:
1. Open call review page
2. Verify Transcription section is expanded by default
3. Verify speaker segments display with speaker labels and text

**Expected Result**:
- Transcription viewer shows formatted speaker segments
- Each segment shows "Speaker: text" format
- Content is scrollable if long

**Test Data**:
- `CallTranscription` with `speaker_segments` JSON array: `[{"speaker": "Speaker 1", "text": "Hello..."}, ...]`

---

#### TC-009: Call without transcription shows unavailable indicator

**AC Reference**: Edge case: "Transcription never arrives"
**Priority**: P1
**Severity if fails**: Sev 2
**Method**: Browser

**Preconditions**:
- Call with `review_status = pending_review` but no `CallTranscription` record

**Steps**:
1. Open call review page for a call without transcription
2. Verify "Transcription unavailable" or similar indicator shows

**Expected Result**:
- Graceful handling — no error, clear indication that transcription is unavailable
- Review can still proceed (link + complete without transcript)

**Test Data**:
- `AircallCall` with `review_status = pending_review`, no associated `CallTranscription`

---

#### TC-010: Complete call review

**AC Reference**: US3-AC2 (duration logged as activity, call marked as reviewed)
**Priority**: P1
**Severity if fails**: Sev 1
**Method**: Browser

**Preconditions**:
- Call is `pending_review`, linked to a package, has transcription

**Steps**:
1. Open call review page
2. Verify all sections load (header, duration, transcription, AI summary)
3. Click "Complete Review"
4. Verify call status changes to `reviewed`

**Expected Result**:
- Call `review_status` transitions to `reviewed`
- `reviewed_at` timestamp set
- Activity logged with correct duration (call_duration + wrap_up_seconds)
- Case note created if AI case note was present

**Test Data**:
- Linked `AircallCall` with transcription and AI case note

---

### Entity Linking (US2 — Manually Link Unmatched Calls)

#### TC-011: Entity link search finds packages

**AC Reference**: US2-AC1 (search by recipient name, package number, TC customer number)
**Priority**: P1
**Severity if fails**: Sev 1
**Method**: Browser

**Preconditions**:
- Packages exist in the system
- Call is unlinked

**Steps**:
1. Open call review page for an unlinked call
2. Click entity link search area
3. Type a known package recipient name
4. Verify search results appear grouped by type
5. Select a package from results

**Expected Result**:
- Search returns matching packages
- Results show package name and ID
- Selecting a result immediately links the call
- UI updates to show linked entity

**Test Data**:
- Multiple packages with distinct recipient names

---

#### TC-012: Entity link search finds coordinators and providers

**AC Reference**: FR-024 (link to Packages, Coordinator profiles, Provider profiles)
**Priority**: P2
**Severity if fails**: Sev 3
**Method**: Browser

**Preconditions**:
- Coordinators and providers exist in the system

**Steps**:
1. Open call review page for an unlinked call
2. Type a known coordinator or provider name in the link search
3. Verify results appear with type grouping (Packages, Coordinators, Providers)
4. Select a coordinator or provider

**Expected Result**:
- Search returns results across all linkable types
- Results grouped by type with type labels
- Linking to non-package entity works correctly

**Test Data**:
- Coordinator users and provider records in the system

---

#### TC-013: Linked entity persists after page reload

**AC Reference**: US2-AC2 (call is immediately linked, context updates)
**Priority**: P1
**Severity if fails**: Sev 2
**Method**: Browser

**Preconditions**:
- Call just linked to a package via entity search

**Steps**:
1. Link a call to a package
2. Close and reopen the call review page
3. Verify the linked entity still shows

**Expected Result**:
- Link is persisted to database
- Linked entity visible on reload

---

### Escalation (FR-019 — Escalate to Team Leader)

#### TC-014: Escalation dialog opens from review page

**AC Reference**: FR-019 (escalation to specific team leader with required note)
**Priority**: P1
**Severity if fails**: Sev 2
**Method**: Browser

**Preconditions**:
- Call is in review
- Team leaders exist in the system

**Steps**:
1. Open call review page
2. Click "Escalate" button in footer
3. Verify escalation dialog appears

**Expected Result**:
- Dialog shows caller info header
- "Reason for escalation" radio group with 4 options (Complaint, Safeguarding risk, Clinical decision, Other)
- "Priority" pill selector (Low, Medium, High, Urgent)
- Team leader dropdown
- Optional notes field
- "Escalate Call" button

---

#### TC-015: Submit escalation with reason and priority

**AC Reference**: FR-019 (escalation to specific TL with note)
**Priority**: P1
**Severity if fails**: Sev 1
**Method**: Browser

**Preconditions**:
- Escalation dialog is open

**Steps**:
1. Select a reason (e.g., "Complaint or concern")
2. Select a priority (e.g., "High")
3. Select a team leader from dropdown
4. Optionally add a note
5. Click "Escalate Call"

**Expected Result**:
- Call `review_status` transitions to `escalated`
- `escalated_to_user_id` set to selected TL
- `escalation_reason` set to selected reason enum
- `escalation_priority` set to selected priority enum
- `escalation_note` saved if provided
- `escalated_at` timestamp set
- Dialog closes
- Toast notification confirms escalation

**Test Data**:
- Users with team leader roles

---

#### TC-016: Escalation requires reason and priority selection

**AC Reference**: FR-019 (required fields)
**Priority**: P2
**Severity if fails**: Sev 3
**Method**: Browser

**Preconditions**:
- Escalation dialog is open

**Steps**:
1. Try to click "Escalate Call" without selecting a reason
2. Verify validation error
3. Select a reason but no priority
4. Verify validation error
5. Complete all required fields
6. Verify submission succeeds

**Expected Result**:
- Cannot submit without reason + priority + team leader
- Validation messages guide the user

---

### AI Summary (US4 — Call Notes, FR-020)

#### TC-017: AI summary section displays Graph content

**AC Reference**: FR-020 (AI-suggested case note pre-populated)
**Priority**: P1
**Severity if fails**: Sev 2
**Method**: Browser

**Preconditions**:
- Call has `CallTranscription` with `ai_summary` content

**Steps**:
1. Open call review page for a call with AI summary
2. Verify AI Summary section visible with content from `ai_summary`
3. Verify "REGENERATE" and "SAVE AS NOTE" buttons appear

**Expected Result**:
- AI summary text displayed in styled container
- Both action buttons visible and clickable

**Test Data**:
- `CallTranscription` with `ai_summary = "Reviewed John Davis email regarding..."`

---

#### TC-018: Save AI summary as package note

**AC Reference**: US4-AC2 (notes saved as package note tagged with "Phone Call")
**Priority**: P1
**Severity if fails**: Sev 2
**Method**: Browser

**Preconditions**:
- Call linked to a package, has AI summary

**Steps**:
1. Open call review page
2. Click "SAVE AS NOTE" button
3. Verify success feedback

**Expected Result**:
- Package note created with AI summary content
- Note tagged with "Phone Call" category
- Note linked to the call record

---

#### TC-019: AI summary dismiss button works

**AC Reference**: Design: "Dismissable (x)"
**Priority**: P3
**Severity if fails**: Sev 5
**Method**: Browser

**Preconditions**:
- AI summary section is visible

**Steps**:
1. Click the dismiss (x) button on the AI Summary section
2. Verify section is hidden

**Expected Result**:
- AI Summary section collapses/hides
- No data lost — can be shown again if needed

---

### Archive (US3 edge case — coordinator declines to link)

#### TC-020: Archive a call

**AC Reference**: Edge case: "Coordinator declines to link — remains in unlinked history, can be linked later"
**Priority**: P2
**Severity if fails**: Sev 3
**Method**: Browser

**Preconditions**:
- Call is in review

**Steps**:
1. Open call review page
2. Click "Archive" button
3. Verify call status changes

**Expected Result**:
- Call `review_status` transitions to `archived`
- Call removed from pending list
- Toast confirms "Call archived"

---

### Concurrency Lock (FR-018)

#### TC-021: Review lock prevents concurrent access

**AC Reference**: FR-018 (prevent concurrent reviews)
**Priority**: P2
**Severity if fails**: Sev 3
**Method**: Browser

**Preconditions**:
- Call is `in_review` with `reviewing_user_id` set to another user

**Steps**:
1. Navigate to `/staff/calls/{call-id}` where the call is locked by another user
2. Verify user sees indication that call is being reviewed by someone else

**Expected Result**:
- User cannot start a review on a locked call
- Message indicates who is currently reviewing

**Test Data**:
- `AircallCall` with `reviewing_user_id = <other_user_id>`, `reviewing_started_at = now()`

---

#### TC-022: Lock released on page close

**AC Reference**: Edge case: "Coordinator closes drawer without completing — reverts to pending_review"
**Priority**: P2
**Severity if fails**: Sev 3
**Method**: Browser

**Preconditions**:
- User has a call in `in_review` (they opened it)

**Steps**:
1. Open call review page (acquires lock)
2. Navigate away or close the page
3. Verify call reverts to `pending_review`
4. Verify `reviewing_user_id` is cleared

**Expected Result**:
- Lock released via `release-lock` endpoint
- Call status reverts to `pending_review`

---

### Authorization & Permissions

#### TC-023: Unauthorized user cannot access Calls page

**AC Reference**: AircallCallPolicy `viewAny`
**Priority**: P1
**Severity if fails**: Sev 1
**Method**: Browser

**Preconditions**:
- User logged in without AircallCall `viewAny` permission

**Steps**:
1. Navigate to `/staff/calls`
2. Verify access denied (403 or redirect)

**Expected Result**:
- User cannot access the Calls Index page
- Appropriate error or redirect

---

#### TC-024: Calls nav item hidden for unauthorized users

**AC Reference**: StaffSidebarService permission guard
**Priority**: P1
**Severity if fails**: Sev 2
**Method**: Browser

**Preconditions**:
- User logged in without AircallCall `viewAny` permission

**Steps**:
1. Verify sidebar navigation
2. Confirm "Calls" item is NOT visible

**Expected Result**:
- "Calls" nav item not rendered in sidebar

---

#### TC-025: Authorized user sees Calls nav item

**AC Reference**: StaffSidebarService permission guard
**Priority**: P1
**Severity if fails**: Sev 2
**Method**: Browser

**Preconditions**:
- User logged in with AircallCall `viewAny` permission

**Steps**:
1. Verify sidebar navigation
2. Confirm "Calls" item IS visible with phone icon

**Expected Result**:
- "Calls" nav item visible in sidebar
- Clicking navigates to `/staff/calls`

---

### Graph Webhook Integration (FR-030)

#### TC-026: Graph webhook creates transcription

**AC Reference**: FR-030 (receive transcription from Graph webhook)
**Priority**: P1
**Severity if fails**: Sev 1
**Method**: Automated (Pest)

**Preconditions**:
- `AircallCall` exists with matching `graph_call_id`

**Steps**:
1. POST to `/api/webhooks/graph/call-transcription` with valid payload
2. Verify `CallTranscription` record created
3. Verify call status transitions to `pending_review`

**Expected Result**:
- `CallTranscription` created with transcription text, AI summary, speaker segments
- Associated `AircallCall.review_status` updated
- `ProcessGraphTranscriptionJob` dispatched

**Test Data**:
- Valid Graph webhook payload with `graph_call_id` matching an existing call

---

#### TC-027: Graph webhook with invalid payload returns error

**AC Reference**: FR-030 (webhook validation)
**Priority**: P2
**Severity if fails**: Sev 3
**Method**: Automated (Pest)

**Preconditions**:
- None

**Steps**:
1. POST to `/api/webhooks/graph/call-transcription` with invalid/missing fields
2. Verify 422 validation error returned

**Expected Result**:
- Endpoint rejects malformed payloads
- No transcription created

---

### Review Status State Machine

#### TC-028: Review status transitions correctly (pending_review → in_review → reviewed)

**AC Reference**: FR-016 (6 review statuses)
**Priority**: P1
**Severity if fails**: Sev 1
**Method**: Automated (Pest)

**Preconditions**:
- Call in `pending_review` status

**Steps**:
1. Acquire review lock → call becomes `in_review`
2. Complete review → call becomes `reviewed`
3. Verify `reviewed_at` and `reviewed_by` are set

**Expected Result**:
- Status transitions follow the state machine
- Invalid transitions are rejected (e.g., `pending_transcription` → `reviewed`)

---

#### TC-029: Review status transitions (in_review → escalated)

**AC Reference**: FR-016 + FR-019
**Priority**: P1
**Severity if fails**: Sev 1
**Method**: Automated (Pest)

**Preconditions**:
- Call in `in_review` status

**Steps**:
1. Escalate call with reason, priority, team leader
2. Verify call becomes `escalated`
3. Verify `escalated_to_user_id`, `escalation_reason`, `escalation_priority` set

**Expected Result**:
- Call only escalatable from `in_review`
- All escalation fields populated

---

#### TC-030: Review status transitions (in_review → archived)

**AC Reference**: FR-016
**Priority**: P2
**Severity if fails**: Sev 3
**Method**: Automated (Pest)

**Preconditions**:
- Call in `in_review` status

**Steps**:
1. Archive the call
2. Verify call becomes `archived`

**Expected Result**:
- Archived calls removed from pending queue
- No activity logged for archived calls

---

### API Endpoints

#### TC-031: Pending count API returns correct count

**AC Reference**: FR-027 (badge with pending_review count)
**Priority**: P2
**Severity if fails**: Sev 3
**Method**: Browser

**Preconditions**:
- Known number of calls in `pending_review` status

**Steps**:
1. Call `GET /api/staff/calls/pending-count`
2. Verify count matches expected number

**Expected Result**:
- Returns JSON with pending count
- Count matches actual `pending_review` calls for the user

---

#### TC-032: Search API returns grouped results

**AC Reference**: FR-025 (unified search across entity types, grouped by type)
**Priority**: P2
**Severity if fails**: Sev 3
**Method**: Browser

**Preconditions**:
- Packages, coordinators, and providers exist

**Steps**:
1. Call `GET /api/staff/calls/search?q=<term>`
2. Verify results grouped by entity type

**Expected Result**:
- Results include packages, coordinators, providers matching search term
- Grouped by type for display

---

### AI-Suggested Tasks (FR-037, FR-038)

#### TC-033: Suggested tasks display in review page

**AC Reference**: FR-037 (display AI-suggested tasks)
**Priority**: P2
**Severity if fails**: Sev 3
**Method**: Browser

**Preconditions**:
- `CallTranscription` has `ai_suggested_tasks` JSON with task entries

**Steps**:
1. Open call review page for a call with suggested tasks
2. Verify tasks section appears below AI Summary
3. Verify each task shows title with add (+) button

**Expected Result**:
- Suggested tasks rendered from `ai_suggested_tasks` JSON
- Each task has clickable add button

**Test Data**:
- `CallTranscription` with `ai_suggested_tasks = [{"title": "Review and process physio bill"}, {"title": "Save invoice to file"}]`

---

#### TC-034: Create task from suggestion

**AC Reference**: FR-038 (instantly create task from suggested task)
**Priority**: P2
**Severity if fails**: Sev 3
**Method**: Browser

**Preconditions**:
- Call linked to a package, suggested tasks visible

**Steps**:
1. Click the (+) button on a suggested task
2. Verify task is created
3. Verify task is linked to the call's package

**Expected Result**:
- Task created immediately (no modal)
- Task linked to package via `task_linkables`
- Visual feedback (button disabled or checkmark)

---

## Responsive Testing

| Breakpoint | Resolution | Key Pages to Test |
|------------|-----------|-------------------|
| Desktop | 1920x1080 | Calls Index table, Call Review detail page |
| Laptop | 1440x900 | Calls Index table, Call Review detail page |
| Tablet | 768x1024 | Calls Index (table may need horizontal scroll) |

**Note**: This is a desktop-first feature (spec: "Desktop Portal only for MVP"). Mobile is out of scope.

---

## Accessibility Checklist

- [ ] Table rows have descriptive aria-labels (caller, direction, status)
- [ ] All buttons have accessible names
- [ ] Form fields (escalation dialog) have labels
- [ ] Keyboard navigation: Tab through call list, Enter to navigate to detail
- [ ] Focus trap on escalation dialog when open
- [ ] Colour contrast meets WCAG AA (especially direction badges, status badges)
- [ ] Screen reader: direction and status conveyed via text, not colour alone

---

## E2E Test Specifications

Playwright E2E tests to be created by `/trilogy-qa-test-codify` after test execution passes.

### Page Objects Needed

| Page Object | File | Covers |
|-------------|------|--------|
| `CallsIndex` | `e2e/pages/calls-index.page.ts` | `/staff/calls` — table, filters, search, pagination |
| `CallReview` | `e2e/pages/call-review.page.ts` | `/staff/calls/{id}` — detail, actions, escalation |

### Test Specs to Create

| Spec File | Test Cases | Priority |
|-----------|-----------|----------|
| `e2e/tests/calls/index.spec.ts` | TC-001, TC-002, TC-003, TC-004 | P1-P2 |
| `e2e/tests/calls/review.spec.ts` | TC-005, TC-006, TC-007, TC-008, TC-009, TC-010 | P1 |
| `e2e/tests/calls/linking.spec.ts` | TC-011, TC-012, TC-013 | P1-P2 |
| `e2e/tests/calls/escalation.spec.ts` | TC-014, TC-015, TC-016 | P1-P2 |
| `e2e/tests/calls/auth.spec.ts` | TC-023, TC-024, TC-025 | P1 |

### Key Locators

| Element | Selector Strategy | Notes |
|---------|------------------|-------|
| Calls table | `getByRole('table')` | Main calls listing |
| Table rows | `getByRole('row')` | Each call row |
| Direction filter | `getByLabel('Direction')` or `SetFilter` dropdown | Filter control |
| Search input | `getByPlaceholder('Search')` | Phone/name search |
| Complete Review button | `getByRole('button', { name: 'Complete Review' })` | Primary action |
| Archive button | `getByRole('button', { name: 'Archive' })` | Secondary action |
| Escalate button | `getByRole('button', { name: 'Escalate' })` | Secondary action |
| Escalation dialog | `getByRole('dialog')` | Nested confirmation |
| Entity search | `getByPlaceholder('Search packages')` | Link search field |
| Save as Note | `getByRole('button', { name: /save as note/i })` | AI summary action |

### Test Data Dependencies

| Test | Seeded Data Needed | Factory/Seeder |
|------|-------------------|----------------|
| TC-001 to TC-004 | 30+ AircallCall records with varied statuses, directions, links | `AircallCall::factory()` |
| TC-005 to TC-010 | AircallCall with CallTranscription, linked package | `AircallCall::factory()` + `CallTranscription::factory()` |
| TC-011 to TC-013 | Packages, coordinators, providers | Existing seeders |
| TC-014 to TC-016 | Team leader users | User factory with team leader role |
| TC-023 to TC-025 | Users with/without AircallCall viewAny permission | User factory with role assignment |
| TC-026 to TC-030 | AircallCall records for status transitions | `AircallCall::factory()` |

---

## Quality Checks

- [ ] No console errors on Calls Index page
- [ ] No console errors on Call Review page
- [ ] No console warnings (feature-related)
- [ ] No 404 network requests
- [ ] No requests > 3s (table load, search, detail load)
- [ ] All API endpoints return correct status codes (200, 422, 403)

---

## Severity Definitions

| Severity | Description | Gate Impact |
|----------|-------------|-------------|
| **Sev 1** | Feature unusable, data loss, security issue | BLOCKS |
| **Sev 2** | Core functionality broken, no workaround | BLOCKS |
| **Sev 3** | Functionality impaired, workaround exists | BLOCKS |
| **Sev 4** | Cosmetic, minor UX issue | Document & proceed |
| **Sev 5** | Edge case, future enhancement | Document & proceed |

---

## Next Steps

- [ ] `/trilogy-qa-test-agent` — Execute this test plan in the browser
- [ ] `/trilogy-qa-test-codify` — Convert passing tests to Pest/Playwright
- [ ] `/trilogy-qa-handover` — Gate 5 sign-off
