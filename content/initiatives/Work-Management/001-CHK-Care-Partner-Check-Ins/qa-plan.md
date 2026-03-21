---
title: "QA Test Plan: Care Partner Check-Ins"
created: 2026-03-04
status: Draft
---

# QA Test Plan: Care Partner Check-Ins

**Epic**: CHK
**Spec**: [spec.md](spec.md)
**Branch**: feature/check-ins

---

## Summary

| Metric | Count |
|--------|-------|
| **Total Test Cases** | 42 |
| **P1 (Critical)** | 18 |
| **P2 (Important)** | 19 |
| **P3 (Nice to have)** | 5 |
| **Browser Tests** | 30 |
| **Automated Tests** | 8 |
| **Manual Tests** | 4 |

---

## Test Cases

### US-1: Care Partner Views Check-Ins on Dashboard

#### TC-001: Overdue check-ins display on dashboard

**AC Reference**: AC-1 from US-1
**Priority**: P1
**Severity if fails**: Sev 1
**Method**: Browser

**Preconditions**:
- Care partner user exists with 5 clients who have check-ins with `due_date` in the past
- Feature flag `care-partner-check-ins` enabled for this user

**Steps**:
1. Log in as the care partner
2. Navigate to the Care Partner Dashboard
3. Locate the "My Activities" panel
4. Find the "Overdue" group

**Expected Result**:
- 5 check-in cards appear in the "Overdue" group
- Each card shows: client name, due date, and days overdue count
- Cards are sorted by most overdue first

**Test Data**:
- Care partner with 5 active clients
- 5 check-in records with status `pending` and `due_date` ranging from 1-15 days ago

**Edge Cases**:
- Verify only the logged-in care partner's check-ins appear (not other care partners')
- Verify completed/missed/cancelled check-ins do NOT appear

---

#### TC-002: Today's check-ins display on dashboard

**AC Reference**: AC-2 from US-1
**Priority**: P1
**Severity if fails**: Sev 2
**Method**: Browser

**Preconditions**:
- Care partner with a check-in due today

**Steps**:
1. Log in as the care partner
2. Navigate to the Care Partner Dashboard
3. Locate the "Today" group in My Activities

**Expected Result**:
- Check-in card appears in the "Today" group with client name and due date showing today

**Test Data**:
- 1 check-in record with `due_date` = today, status = `pending`

---

#### TC-003: Upcoming check-ins display on dashboard

**AC Reference**: AC-3 from US-1
**Priority**: P1
**Severity if fails**: Sev 2
**Method**: Browser

**Preconditions**:
- Care partner with check-ins due within the next 30 days

**Steps**:
1. Log in as the care partner
2. Navigate to the Care Partner Dashboard
3. Locate the "Upcoming" group in My Activities

**Expected Result**:
- Check-ins due in the next 30 days appear in the "Upcoming" group
- Sorted by nearest due date first
- Check-ins due more than 30 days out do NOT appear

**Test Data**:
- 3 check-in records with `due_date` 5, 15, and 25 days in the future

---

#### TC-004: Question indicator on check-in card

**AC Reference**: AC-4 from US-1
**Priority**: P2
**Severity if fails**: Sev 3
**Method**: Browser

**Preconditions**:
- Check-in for a client with 2 active risks, each having a check-in question

**Steps**:
1. Log in as the care partner
2. Navigate to the Care Partner Dashboard
3. Find the check-in card for this client

**Expected Result**:
- Card displays a question indicator showing "2 questions"

**Test Data**:
- Client with 2 active risks on their primary package
- Each risk has 1 `RiskCheckInQuestion` record

---

#### TC-005: Empty state when no check-ins due

**AC Reference**: AC-5 from US-1
**Priority**: P2
**Severity if fails**: Sev 4
**Method**: Browser

**Preconditions**:
- Care partner with no pending check-ins

**Steps**:
1. Log in as the care partner
2. Navigate to the Care Partner Dashboard
3. View My Activities panel

**Expected Result**:
- A meaningful empty state displays (e.g., "No check-ins due — all caught up")
- No broken UI or blank space

**Test Data**:
- Care partner with 0 pending check-in records

---

### US-2: Care Partner Completes a Check-In

#### TC-006: View check-in detail with client context

**AC Reference**: AC-1 from US-2
**Priority**: P1
**Severity if fails**: Sev 1
**Method**: Browser

**Preconditions**:
- Pending check-in exists for a client with active risks and clinical questions

**Steps**:
1. Log in as the care partner
2. Click on a pending check-in card from the dashboard
3. Verify the completion page loads

**Expected Result**:
- Page shows two-column layout: 1/3 context sidebar + 2/3 form
- Context sidebar shows: client name, package details, last check-in summary
- Clinical questions from active risks appear in the form
- Wellbeing rating (1-5) input is visible
- Summary notes textarea is visible
- Follow-up actions textarea is visible

**Test Data**:
- Client with active primary package
- 2 active risks with 1 question each
- 1 previous completed check-in with summary notes

---

#### TC-007: Risk-based questions are mandatory

**AC Reference**: AC-2 from US-2
**Priority**: P1
**Severity if fails**: Sev 2
**Method**: Browser

**Preconditions**:
- Client with 2 active risks, each having a clinical question

**Steps**:
1. Open the check-in for this client
2. Fill in summary notes and wellbeing rating
3. Leave risk questions unanswered
4. Click "Complete Check-In"

**Expected Result**:
- Validation error prevents submission
- Error message indicates risk questions must be answered
- Both questions are shown grouped by their risk name

**Edge Cases**:
- Try submitting with only one question answered — should still fail

---

#### TC-008: Successful check-in completion

**AC Reference**: AC-3 from US-2
**Priority**: P1
**Severity if fails**: Sev 1
**Method**: Browser

**Preconditions**:
- Pending check-in exists

**Steps**:
1. Open the check-in
2. Fill in summary notes: "Client is doing well, no concerns"
3. Set wellbeing rating to 4
4. Answer all risk questions (if any)
5. Add follow-up actions: "Schedule physio review"
6. Click "Complete Check-In"

**Expected Result**:
- Check-in status changes to "Completed"
- Completion date is recorded (today)
- Wellbeing rating of 4 is saved
- Summary notes and follow-up actions saved
- Redirected back to dashboard
- A new check-in is scheduled 3 months from today (or per client cadence)

**Test Data**:
- Verify in database: `status = completed`, `completed_at` is today, `wellbeing_rating = 4`
- Verify new check-in record exists with `due_date` = today + 3 months

---

#### TC-009: First check-in for client shows appropriate message

**AC Reference**: AC-4 from US-2
**Priority**: P2
**Severity if fails**: Sev 4
**Method**: Browser

**Preconditions**:
- Client with no previous completed check-ins

**Steps**:
1. Open the check-in for this client
2. Look at the "Previous check-in" section in the context sidebar

**Expected Result**:
- Shows "First check-in for this client" instead of blank space

---

#### TC-010: Draft state preserved on navigation away

**AC Reference**: AC-5 from US-2
**Priority**: P1
**Severity if fails**: Sev 2
**Method**: Browser

**Preconditions**:
- Pending check-in exists

**Steps**:
1. Open the check-in
2. Fill in summary notes: "Partial notes..."
3. Set wellbeing rating to 3
4. Navigate away (click dashboard link)
5. Return to the same check-in

**Expected Result**:
- Summary notes still show "Partial notes..."
- Wellbeing rating still shows 3
- Check-in status is `in_progress`
- A `beforeunload` warning appears when navigating away with unsaved changes

**Edge Cases**:
- Test auto-save debounce (wait 30 seconds, navigate away, return — data should be saved)

---

#### TC-011: Check-in with no active risks

**AC Reference**: AC-6 from US-2
**Priority**: P2
**Severity if fails**: Sev 3
**Method**: Browser

**Preconditions**:
- Client with no active risks (or risks with no check-in questions)

**Steps**:
1. Open the check-in for this client
2. Verify questions section is empty or not shown
3. Fill in summary notes and wellbeing rating
4. Click "Complete Check-In"

**Expected Result**:
- No clinical questions section or an empty section with explanatory text
- Check-in can still be completed with just summary notes and wellbeing rating
- Submission succeeds

---

### US-3: System Auto-Generates Quarterly Check-Ins

#### TC-012: Auto-generation for active clients

**AC Reference**: AC-1 from US-3
**Priority**: P1
**Severity if fails**: Sev 1
**Method**: Automated

**Preconditions**:
- Active client with a care partner assigned
- Client's last completed check-in was 3+ months ago (or no prior check-in, with commencement date 3+ months ago)

**Steps**:
1. Run `ProcessCheckInsJob` (dispatch or artisan command)

**Expected Result**:
- A new check-in record is created with:
  - `status = pending`
  - `due_date` = 3 months from last completed check-in (or commencement date)
  - `assigned_user_id` = client's care partner
  - `type` = `internal`
  - `client_id` and `package_id` populated

**Test Data**:
- Active client with care partner, last check-in completed 3+ months ago

---

#### TC-013: Custom cadence respected

**AC Reference**: AC-2 from US-3
**Priority**: P2
**Severity if fails**: Sev 3
**Method**: Automated

**Preconditions**:
- Client with `ClientCadenceSetting` set to 1 month
- Last check-in completed 1+ month ago

**Steps**:
1. Run `ProcessCheckInsJob`

**Expected Result**:
- Check-in generated with `due_date` = 1 month from last completion, not 3 months

---

#### TC-014: No check-in for ended/cancelled packages

**AC Reference**: AC-3 from US-3
**Priority**: P1
**Severity if fails**: Sev 2
**Method**: Automated

**Preconditions**:
- Client whose package is terminated/cancelled

**Steps**:
1. Run `ProcessCheckInsJob`

**Expected Result**:
- No new check-in record created for this client

---

#### TC-015: No duplicate check-ins

**AC Reference**: AC-4 from US-3
**Priority**: P1
**Severity if fails**: Sev 1
**Method**: Automated

**Preconditions**:
- Client with an existing pending check-in

**Steps**:
1. Run `ProcessCheckInsJob`

**Expected Result**:
- No second check-in created for this client
- Only 1 pending check-in exists

---

#### TC-016: First check-in for new client

**AC Reference**: AC-5 from US-3
**Priority**: P1
**Severity if fails**: Sev 2
**Method**: Automated

**Preconditions**:
- New client who commenced this week (no prior check-ins)

**Steps**:
1. Run `ProcessCheckInsJob`

**Expected Result**:
- Check-in created with `due_date` = commencement date + 3 months
- `previous_summary` is null

---

### US-4: Care Coordinator Views and Completes External Check-Ins

#### TC-017: Coordinator sees external check-ins on dashboard

**AC Reference**: AC-1 from US-4
**Priority**: P1
**Severity if fails**: Sev 1
**Method**: Browser

**Preconditions**:
- Care coordinator with assigned clients
- External check-ins generated for these clients

**Steps**:
1. Log in as the care coordinator
2. Navigate to the Coordinator Dashboard
3. View activities panel

**Expected Result**:
- External check-ins appear with overdue/today/upcoming grouping
- Cards show same structure as care partner cards

---

#### TC-018: Coordinator completion form has coordinator-specific fields

**AC Reference**: AC-2 from US-4
**Priority**: P2
**Severity if fails**: Sev 3
**Method**: Browser

**Preconditions**:
- External check-in exists for coordinator

**Steps**:
1. Log in as coordinator
2. Open an external check-in
3. Review available form fields

**Expected Result**:
- Coordinator-relevant fields available (service satisfaction, provider feedback)
- Core fields also present (summary notes, wellbeing rating)

---

#### TC-019: Care partner and coordinator see only their own check-in type

**AC Reference**: AC-3 from US-4
**Priority**: P1
**Severity if fails**: Sev 2
**Method**: Browser

**Preconditions**:
- Client with both a care partner and coordinator assigned
- Both internal and external check-ins generated

**Steps**:
1. Log in as the care partner → verify only internal check-ins visible
2. Log out, log in as the coordinator → verify only external check-ins visible

**Expected Result**:
- Care partner sees INTERNAL type only
- Coordinator sees EXTERNAL type only
- No cross-contamination between check-in types

---

### US-5: Clinical Team Defines Questions on Client Risks

#### TC-020: Add check-in question to a risk

**AC Reference**: AC-1 from US-5
**Priority**: P2
**Severity if fails**: Sev 2
**Method**: Browser

**Preconditions**:
- Clinical team member logged in
- Client with an active risk on their primary package

**Steps**:
1. Navigate to the package view for the client's primary package
2. Open the "Check-In Questions" tab
3. Select the risk to add a question to
4. Enter question text: "How has the client's mobility been this week?"
5. Set answer type to "Free Text"
6. Click "Add Question"

**Expected Result**:
- Question saved and appears under the selected risk
- Question is immediately listed in the tab

---

#### TC-021: Check-in inherits questions from multiple active risks

**AC Reference**: AC-2 from US-5
**Priority**: P2
**Severity if fails**: Sev 2
**Method**: Browser

**Preconditions**:
- Client with 3 active risks, 2 of which have check-in questions

**Steps**:
1. Open a pending check-in for this client
2. Review the questions section

**Expected Result**:
- Questions from both risks appear, grouped by risk name
- The risk with no questions does not create an empty group
- Total question count matches the sum from both risks

---

#### TC-022: Closed risk questions excluded from new check-ins

**AC Reference**: AC-3 from US-5
**Priority**: P2
**Severity if fails**: Sev 3
**Method**: Browser + Automated

**Preconditions**:
- Client with a risk that has a check-in question
- The risk is then closed/resolved

**Steps**:
1. Close the risk record
2. Generate or open the next check-in for this client

**Expected Result**:
- Question from the closed risk no longer appears
- Previous responses to this question in older check-ins are preserved

---

#### TC-023: Check-in completable without risk questions

**AC Reference**: AC-4 from US-5
**Priority**: P2
**Severity if fails**: Sev 3
**Method**: Browser

**Preconditions**:
- Client with no active risks that have check-in questions

**Steps**:
1. Open the check-in
2. Fill in summary notes and wellbeing rating
3. Submit

**Expected Result**:
- Questions section is empty but visible (or not shown)
- Check-in completes successfully

---

### US-6: Clinical Team Reviews Check-In Responses

#### TC-024: Clinical team views question responses grouped by risk

**AC Reference**: AC-1 from US-6
**Priority**: P2
**Severity if fails**: Sev 2
**Method**: Browser

**Preconditions**:
- Completed check-in with 2 risk-based questions answered

**Steps**:
1. Log in as a clinical team member
2. Navigate to the client's profile / check-in history
3. View the completed check-in

**Expected Result**:
- Each question shown with its response
- Responses grouped by the risk they belong to
- Risk name clearly visible as group header

---

#### TC-025: Response trending over multiple check-ins

**AC Reference**: AC-2 from US-6
**Priority**: P2
**Severity if fails**: Sev 4
**Method**: Browser

**Preconditions**:
- Client with 3+ completed check-ins, all answering the same risk question

**Steps**:
1. Log in as clinical team member
2. View the client's check-in history
3. Compare responses to the same question across check-ins

**Expected Result**:
- Responses from multiple check-ins visible in chronological order
- Same question answered differently across check-ins is distinguishable

**Test Data**:
- 3 completed check-ins with the same risk question answered with different values

---

#### TC-026: Filter completed check-ins by date range

**AC Reference**: AC-3 from US-6
**Priority**: P2
**Severity if fails**: Sev 3
**Method**: Browser

**Preconditions**:
- Client with check-ins completed across different date ranges

**Steps**:
1. Navigate to the client's check-in history
2. Apply a date range filter (e.g., last 30 days)

**Expected Result**:
- Only check-ins completed within the selected range are shown
- Check-ins outside the range are hidden

---

### US-7: Care Partner Records a Failed Attempt

#### TC-027: Record a failed contact attempt

**AC Reference**: AC-1 from US-7
**Priority**: P2
**Severity if fails**: Sev 2
**Method**: Browser

**Preconditions**:
- Pending check-in exists

**Steps**:
1. Open the check-in
2. Click "Log Attempt" button
3. Select reason: "No answer"
4. Optionally add notes
5. Submit the attempt

**Expected Result**:
- Attempt logged with timestamp and reason "No answer"
- Check-in remains in "Pending" status
- Attempt count visible on the check-in detail
- Attempt timeline shows the logged attempt

---

#### TC-028: Dashboard card shows attempt count at 3+

**AC Reference**: AC-2 from US-7
**Priority**: P2
**Severity if fails**: Sev 3
**Method**: Browser

**Preconditions**:
- Check-in with 3 logged failed attempts

**Steps**:
1. Navigate to the dashboard
2. Find the check-in card for this client

**Expected Result**:
- Card shows attempt count (e.g., "3 attempts")
- Card is visually flagged (amber badge or similar indicator)
- `is_flagged = true` in the database

---

#### TC-029: Completion after failed attempts preserves all records

**AC Reference**: AC-3 from US-7
**Priority**: P2
**Severity if fails**: Sev 3
**Method**: Browser

**Preconditions**:
- Check-in with 2 failed attempts logged

**Steps**:
1. Open the check-in
2. Complete the check-in form
3. Submit
4. View the completed check-in record

**Expected Result**:
- Check-in shows as completed
- Both previous attempts are preserved and visible in the check-in history
- Attempt timeline shows attempts followed by successful completion

---

### US-8: Check-In Completion Report

#### TC-030: Team lead views completion report by period

**AC Reference**: AC-1 from US-8
**Priority**: P2
**Severity if fails**: Sev 2
**Method**: Browser

**Preconditions**:
- Multiple care partners with varying check-in completion data

**Steps**:
1. Log in as a team lead
2. Navigate to `staff/check-ins/report`
3. Select time period: last quarter

**Expected Result**:
- KPI cards show: overall completion rate, total completed, total overdue, flagged count
- Completion rate = (completed on time / total due) as percentage

---

#### TC-031: Per-care-partner breakdown in report

**AC Reference**: AC-2 from US-8
**Priority**: P2
**Severity if fails**: Sev 3
**Method**: Browser

**Preconditions**:
- 3 care partners with different completion rates

**Steps**:
1. View the completion report
2. Check the per-care-partner table

**Expected Result**:
- Each care partner row shows: name, client count, completed count, overdue count, completion rate
- Data accurately reflects the selected time period

**Test Data**:
- CP 1: 10 due, 8 completed (80%)
- CP 2: 5 due, 5 completed (100%)
- CP 3: 8 due, 3 completed (37.5%)

---

#### TC-032: Export completion report as CSV

**AC Reference**: AC-3 from US-8
**Priority**: P2
**Severity if fails**: Sev 3
**Method**: Browser

**Preconditions**:
- Report page loaded with data

**Steps**:
1. Click "Export" button on the report page
2. Verify file downloads

**Expected Result**:
- CSV file downloads
- File contains per-client check-in history
- Correct headers and data matching the report view

---

### US-9: Ad-Hoc Check-In Creation

#### TC-033: Create an ad-hoc check-in

**AC Reference**: AC-1 from US-9
**Priority**: P2
**Severity if fails**: Sev 2
**Method**: Browser

**Preconditions**:
- Care partner viewing a client's profile

**Steps**:
1. Navigate to the client's profile
2. Click "Create Ad-Hoc Check-In" action
3. Confirm creation

**Expected Result**:
- New check-in record created with:
  - `type = ad_hoc`
  - `due_date = today`
  - `status = pending`
  - `assigned_user_id` = current user

---

#### TC-034: Ad-hoc does not affect scheduled check-in

**AC Reference**: AC-2 from US-9
**Priority**: P2
**Severity if fails**: Sev 2
**Method**: Browser + Automated

**Preconditions**:
- Client with an existing pending scheduled check-in (due in 2 weeks)

**Steps**:
1. Create an ad-hoc check-in for this client
2. Complete the ad-hoc check-in
3. Verify the scheduled check-in

**Expected Result**:
- Scheduled check-in still exists as pending
- Scheduled check-in's due date is unchanged
- Both check-ins appear in the client's history

---

#### TC-035: Ad-hoc distinguished in history

**AC Reference**: AC-3 from US-9
**Priority**: P3
**Severity if fails**: Sev 4
**Method**: Browser

**Preconditions**:
- Client with completed ad-hoc and scheduled check-ins

**Steps**:
1. View the client's check-in history

**Expected Result**:
- Ad-hoc check-ins labelled as "Ad-hoc" (distinct from "Internal"/"External")
- Clear visual distinction between ad-hoc and scheduled check-ins

---

### US-10: System Auto-Marks Missed Check-Ins

#### TC-036: Auto-mark missed after 31 days overdue

**AC Reference**: AC-1 from US-10
**Priority**: P1
**Severity if fails**: Sev 1
**Method**: Automated

**Preconditions**:
- Pending check-in with `due_date` = 31 days ago

**Steps**:
1. Run `ProcessCheckInsJob`

**Expected Result**:
- Check-in status changed to `missed`
- A new check-in generated with `due_date` based on cadence from the missed check-in's due date
- New check-in assigned to the same user

---

#### TC-037: Not marked missed at 29 days

**AC Reference**: AC-2 from US-10
**Priority**: P1
**Severity if fails**: Sev 2
**Method**: Automated

**Preconditions**:
- Pending check-in with `due_date` = 29 days ago

**Steps**:
1. Run `ProcessCheckInsJob`

**Expected Result**:
- Check-in remains as `pending`
- No new check-in generated

---

#### TC-038: Missed check-ins distinguishable in dashboard and reports

**AC Reference**: AC-3 from US-10
**Priority**: P2
**Severity if fails**: Sev 4
**Method**: Browser

**Preconditions**:
- Client with a missed check-in

**Steps**:
1. View the client's check-in history
2. Check the completion report

**Expected Result**:
- Missed check-ins clearly distinguishable from completed (different badge/label/colour)
- Missed count appears in the report

---

### Edge Cases (from Spec)

#### TC-039: Care partner reassignment transfers pending check-ins

**AC Reference**: Edge Case — Spec
**Priority**: P1
**Severity if fails**: Sev 2
**Method**: Automated

**Preconditions**:
- Client with pending check-in assigned to Care Partner A
- Client's care partner is changed to Care Partner B

**Steps**:
1. Update the client's care partner from A to B
2. Verify the pending check-in

**Expected Result**:
- Pending check-in `assigned_user_id` now points to Care Partner B
- Care Partner B sees the check-in on their dashboard
- Care Partner A no longer sees it

---

#### TC-040: One check-in per client, not per package

**AC Reference**: Edge Case — Spec (Multiple Active Packages)
**Priority**: P1
**Severity if fails**: Sev 2
**Method**: Automated

**Preconditions**:
- Client with 2 active packages

**Steps**:
1. Run `ProcessCheckInsJob`

**Expected Result**:
- Only 1 check-in created for this client (on primary package)
- No duplicate for the second package

---

#### TC-041: Cancellation requires reason and preserves audit trail

**AC Reference**: FR-003 / FR-023
**Priority**: P2
**Severity if fails**: Sev 3
**Method**: Browser

**Preconditions**:
- Pending check-in exists

**Steps**:
1. Open the check-in
2. Click "Cancel Check-In"
3. Try to submit without a reason — should be blocked
4. Enter reason: "Client requested no contact this month"
5. Submit cancellation

**Expected Result**:
- Check-in status changes to `cancelled`
- `cancellation_reason` saved
- `cancelled_at` and `cancelled_by_id` recorded
- Check-in preserved in history (not deleted)
- Cancelled check-in visible in reports

---

#### TC-042: Feature flag controls old vs new system

**AC Reference**: FR-012 / US-11 AC-1
**Priority**: P1
**Severity if fails**: Sev 1
**Method**: Browser + Automated

**Preconditions**:
- Feature flag `care-partner-check-ins` can be toggled

**Steps**:
1. Disable feature flag → verify dashboard shows legacy package-date check-ins
2. Enable feature flag → verify dashboard shows new record-based check-ins
3. Attempt to access `staff/check-ins/*` routes with flag disabled

**Expected Result**:
- Flag disabled: legacy behaviour unchanged, new routes return 403
- Flag enabled: new record-based check-ins appear on dashboard, new routes accessible

---

## Responsive Testing

| Breakpoint | Resolution | Key Pages to Test |
|------------|-----------|-------------------|
| Desktop | 1920x1080 | Dashboard (My Activities), Completion Page (two-column layout), Report Page |
| Tablet | 768x1024 | Completion Page (columns may stack), Report table (horizontal scroll or responsive), Dashboard cards |
| Mobile | 375x812 | Dashboard cards (full-width), Completion Page (stacked layout), Report KPIs |

**Note**: Feature is desktop-first per design.md. Tablet and mobile are functional but not primary targets.

---

## Accessibility Checklist

- [ ] Form fields have labels (summary notes, wellbeing rating, follow-up actions, risk questions)
- [ ] Buttons have accessible names (Complete Check-In, Log Attempt, Cancel, Export)
- [ ] Status badges have appropriate ARIA labels or text
- [ ] Heading hierarchy is correct on completion page (h1 → h2 → h3)
- [ ] Focus order is logical (sidebar context → form fields → action buttons)
- [ ] Keyboard navigation works (tab through form, submit via Enter)
- [ ] Colour contrast meets WCAG AA (badge colours, wellbeing rating states)
- [ ] Radio cards for attempt reasons are keyboard-navigable

---

## E2E Test Specifications

Playwright E2E tests to be created by `/trilogy-qa-test-codify` after test execution passes.

### Page Objects Needed

| Page Object | File | Covers |
|-------------|------|--------|
| `CarePartnerDashboard` | `e2e/pages/care-partner-dashboard.page.ts` | Dashboard My Activities panel, check-in cards |
| `CheckInCompletion` | `e2e/pages/check-in-completion.page.ts` | Show.vue — form fields, risk questions, wellbeing, actions |
| `CheckInReport` | `e2e/pages/check-in-report.page.ts` | Report.vue — KPIs, filters, table, export |
| `PackageCheckInQuestions` | `e2e/pages/package-check-in-questions.page.ts` | Tab on package view — question CRUD |

### Test Specs to Create

| Spec File | Test Cases | Priority |
|-----------|-----------|----------|
| `e2e/tests/check-in/dashboard-cards.spec.ts` | TC-001, TC-002, TC-003, TC-004, TC-005 | P1 |
| `e2e/tests/check-in/completion-flow.spec.ts` | TC-006, TC-007, TC-008, TC-010, TC-011 | P1 |
| `e2e/tests/check-in/coordinator-flow.spec.ts` | TC-017, TC-018, TC-019 | P1 |
| `e2e/tests/check-in/failed-attempts.spec.ts` | TC-027, TC-028, TC-029 | P2 |
| `e2e/tests/check-in/clinical-questions.spec.ts` | TC-020, TC-021, TC-022, TC-023 | P2 |
| `e2e/tests/check-in/clinical-review.spec.ts` | TC-024, TC-025, TC-026 | P2 |
| `e2e/tests/check-in/report.spec.ts` | TC-030, TC-031, TC-032 | P2 |
| `e2e/tests/check-in/ad-hoc.spec.ts` | TC-033, TC-034, TC-035 | P2 |

### Key Locators

| Element | Selector Strategy | Notes |
|---------|------------------|-------|
| Check-in card | `getByTestId('check-in-card-{id}')` | Cards in My Activities panel |
| Complete button | `getByRole('button', { name: 'Complete Check-In' })` | Primary action on completion page |
| Log Attempt button | `getByRole('button', { name: 'Log Attempt' })` | Secondary action on completion page |
| Cancel button | `getByRole('button', { name: 'Cancel Check-In' })` | Destructive action on completion page |
| Wellbeing rating | `getByTestId('wellbeing-rating-{n}')` | 1-5 number buttons |
| Summary notes | `getByRole('textbox', { name: /summary/i })` | Textarea for call summary |
| Risk question | `getByTestId('risk-question-{id}')` | Individual question fields |
| Export button | `getByRole('button', { name: /export/i })` | CSV export on report page |
| Period filter | `getByRole('combobox', { name: /period/i })` | Report period selector |

### Test Data Dependencies

| Test | Seeded Data Needed | Factory/Seeder |
|------|-------------------|----------------|
| TC-001 to TC-005 | Care partner with clients, pending check-ins (overdue/today/upcoming) | `CheckInFactory`, `PackagesClientFactory` |
| TC-006 to TC-011 | Check-in with client, risks, questions, previous check-in | `CheckInFactory`, `RiskCheckInQuestionFactory` |
| TC-012 to TC-016 | Active clients with/without existing check-ins, various package stages | `PackagesClientFactory`, `PackageFactory` |
| TC-020 to TC-023 | Risks with/without questions, clinical user | `RiskFactory`, `RiskCheckInQuestionFactory` |
| TC-027 to TC-029 | Check-in with logged attempts | `CheckInFactory`, `CheckInAttemptFactory` |
| TC-030 to TC-032 | Multiple care partners with varying completion data | `CheckInFactory` (completed/overdue states) |

---

## Quality Checks

- [ ] No console errors on any check-in page
- [ ] No console warnings (feature-related) — ignore unrelated warnings
- [ ] No 404 network requests when navigating check-in flows
- [ ] No requests > 3s (dashboard load, completion page, report page)
- [ ] Feature flag `care-partner-check-ins` toggles correctly (enabled/disabled behaviour)
- [ ] `ProcessCheckInsJob` completes within acceptable timeframe for test data
- [ ] All form submissions show appropriate loading state on buttons
- [ ] Validation errors display correctly for all form fields

---

## Test Data Requirements

| Data | Needed For | How to Set Up |
|------|-----------|---------------|
| Care partner user | TC-001 to TC-011, TC-027 to TC-029, TC-033 | `UserFactory` with care partner role |
| Care coordinator user | TC-017 to TC-019 | `UserFactory` with coordinator role |
| Clinical team user | TC-020 to TC-026 | `UserFactory` with clinical role |
| Team lead user | TC-030 to TC-032 | `UserFactory` with team lead role |
| Active clients (5+) | TC-001, TC-012, TC-040 | `PackagesClientFactory` with active packages |
| Pending check-ins | TC-001 to TC-008, TC-027 | `CheckInFactory` with `pending` status and various due dates |
| Completed check-ins | TC-009, TC-024, TC-025, TC-030 | `CheckInFactory` with `completed` status |
| Risks with questions | TC-004, TC-007, TC-020, TC-021 | `RiskFactory` + `RiskCheckInQuestionFactory` |
| Check-in attempts | TC-028, TC-029 | `CheckInAttemptFactory` |
| Client cadence settings | TC-013 | `ClientCadenceSettingFactory` |
| Terminated packages | TC-014 | `PackageFactory` with terminated stage |

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
