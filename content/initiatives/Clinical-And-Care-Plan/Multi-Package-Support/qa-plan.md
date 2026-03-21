---
title: "QA Test Plan: Multi-Package Support (MPS)"
created: 2026-02-26
status: Draft
---

# QA Test Plan: Multi-Package Support (MPS)

**Epic**: Multi-Package Support (MPS)
**Spec**: [spec.md](spec.md)
**Branch**: `epic/mps-multi-package-support`
**Feature Flag**: `MultiPackageSupport::class` (Pennant)

---

## Setup Prerequisites

Before running any test case, the QA test agent **must** ensure:

### 1. Feature Flag Enabled

The `MultiPackageSupport` feature flag must be active. Use Laravel Boost `tinker` to enable it:

```php
nova_set_setting_value('ff_multi_package_support', '1');
```

Verify with:

```php
boolval(nova_get_setting('ff_multi_package_support'));
// Expected: true
```

### 2. Database Seeded with Entry Records

Verify entry records exist:

```php
\Domain\Funding\Models\EntryRecord::count();
// Expected: > 0
```

If no records exist, the database seeders haven't run. Check that:
- `nova_get_setting('initial_seeding_complete')` returns truthy (seeders ran)
- Navigate to the login page and look for the "Seed new packages" button

### 3. Verify Access

After enabling the feature flag, verify the entries page loads:
- Navigate to `/pages/entries`
- Page should load with "Entry Queue" heading
- If it returns 403 or redirects, the feature flag is not active

---

## Summary

| Metric | Count |
|--------|-------|
| **Total Test Cases** | 42 |
| **P1 (Critical)** | 18 |
| **P2 (Important)** | 16 |
| **P3 (Nice to have)** | 8 |
| **Browser Tests** | 30 |
| **Automated Tests** | 8 |
| **Manual Tests** | 4 |

---

## Test Cases

### US-1: Detect New Funding Classifications

#### TC-001: New classification detected and queued after SA sync

**AC Reference**: AC-1 from US-1
**Priority**: P1
**Severity if fails**: Sev 1
**Method**: Automated (Feature Test)

**Preconditions**:
- Client exists with an active ON (ongoing) funding stream
- SA sync data includes a new `PackageAllocation` with status `ALLOCATED` and classification `RC`
- `SyncEntryRecords` pipe is in the sync pipeline

**Steps**:
1. Trigger the SA sync pipeline (`SyncPackageFromServicesAustralia`)
2. Verify a new `EntryRecord` is created with status `queued` for the RC classification
3. Navigate to `/pages/entries` and verify the client appears in the "New / Awaiting Consent" tab

**Expected Result**:
- EntryRecord created with `classification_code: RC`, `status: queued`
- Client visible in the entry queue with RC classification highlighted

**Edge Cases**:
- Sync runs but no new allocations — no new entries created
- Sync detects allocation with `current_place_indicator: N` — should be ignored

---

#### TC-002: Queue displays client details and classification info

**AC Reference**: AC-2 from US-1
**Priority**: P1
**Severity if fails**: Sev 2
**Method**: Browser

**Preconditions**:
- At least one entry exists in `queued` status
- User logged in with Finance or Care Partner role

**Steps**:
1. Navigate to `/pages/entries`
2. Verify the default tab is "New / Awaiting Consent"
3. Verify each row displays: client name, classification badge, approval date, take-up deadline, status badge
4. Verify the table is sortable by take-up deadline

**Expected Result**:
- Queue displays all expected columns with populated data
- Classification shown as a coloured badge (e.g., RC, AT, HM)
- Take-up deadline displays "X days remaining" indicator

**Test Data**:
- EntryRecord with `take_up_deadline` set to 30 days from now
- EntryRecord with `take_up_deadline` set to 10 days from now (should show urgent)

---

#### TC-003: Multiple simultaneous classifications appear as separate line items

**AC Reference**: AC-3 from US-1
**Priority**: P1
**Severity if fails**: Sev 2
**Method**: Browser

**Preconditions**:
- Client approved for AT + HM simultaneously (two PackageAllocations)

**Steps**:
1. Navigate to `/pages/entries`
2. Click "All" tab
3. Search for the client name
4. Verify two separate rows appear — one for AT, one for HM

**Expected Result**:
- Two distinct entry rows for the same client, each with its own classification badge
- Each row independently actionable (activate, defer)

---

#### TC-004: Duplicate classification approval does not create duplicate queue entry

**AC Reference**: AC-4 from US-1
**Priority**: P1
**Severity if fails**: Sev 2
**Method**: Automated (Feature Test)

**Preconditions**:
- Client already has an active RC EntryRecord
- SA sync returns a second RC allocation for the same approval period

**Steps**:
1. Trigger SA sync with duplicate RC allocation data
2. Query EntryRecords for the package + RC classification
3. Verify only one EntryRecord exists (unique constraint on `package_id, classification_code`)

**Expected Result**:
- No duplicate EntryRecord created
- Existing entry unchanged
- No error thrown during sync

**Edge Cases**:
- New RC episode (different approval period) — should create new Funding records under the same EntryRecord, not a new entry

---

### US-2: Funding Stream Activation Workflow

#### TC-005: Activation modal displays classification details and requirements

**AC Reference**: AC-1 from US-2
**Priority**: P1
**Severity if fails**: Sev 2
**Method**: Browser

**Preconditions**:
- Entry in `queued` status exists
- User logged in with Care Partner role

**Steps**:
1. Navigate to `/pages/entries`
2. Click "Activate" on a queued entry row
3. Verify the activation modal displays:
   - Funding stream type
   - Commencement date input (pre-filled with take-up deadline)
   - Notes field
   - Submit and Cancel buttons

**Expected Result**:
- Modal opens with "Activate Funding Stream" heading
- Commencement date defaults to take-up deadline value
- Form fields are interactive and clear

---

#### TC-006: Successful activation transitions entry to ACER Pending

**AC Reference**: AC-2 from US-2
**Priority**: P1
**Severity if fails**: Sev 1
**Method**: Browser

**Preconditions**:
- Entry in `queued` status with a valid take-up deadline (future date)

**Steps**:
1. Navigate to entry queue or show page
2. Click "Activate" button
3. Set commencement date to tomorrow
4. Click "Activate" submit button
5. Verify modal closes
6. Verify entry status transitions to "ACER Pending"

**Expected Result**:
- Entry moves from "New / Awaiting Consent" tab to "ACER Pending" tab
- Show page displays status badge "ACER Pending"
- Audit trail records the activation with timestamp and user
- `consent_date` and `consent_confirmed_by` populated on the EntryRecord

---

#### TC-007: Deferral captures reason and moves entry to Deferred

**AC Reference**: AC-3 from US-2
**Priority**: P1
**Severity if fails**: Sev 2
**Method**: Browser

**Preconditions**:
- Entry in `queued` status

**Steps**:
1. Navigate to `/pages/entries`
2. Click "Defer" on a queued entry
3. Select a deferral reason from the dropdown (e.g., "Client Not Ready")
4. Optionally add notes
5. Click "Defer" submit button
6. Verify modal closes

**Expected Result**:
- Entry disappears from "New / Awaiting Consent" tab
- Entry appears in "Deferred" tab
- Tab count for "New" decreases by 1
- `deferred_reason` and `deferred_at` populated on EntryRecord
- Audit trail records deferral with reason

---

#### TC-008: Management model warning for RC activation

**AC Reference**: AC-4 from US-2
**Priority**: P2
**Severity if fails**: Sev 3
**Method**: Browser

**Preconditions**:
- Entry with classification RC in `queued` status
- Client's current management model is Self-Managed (not Fully Coordinated)

**Steps**:
1. Navigate to entry queue
2. Click "Activate" on the RC entry
3. Verify the activation modal displays a warning alert about management model change

**Expected Result**:
- Warning visible: text mentions "Fully Coordinated management" requirement
- Acknowledgement checkbox (if present) must be checked before submission
- User can still proceed after acknowledging

---

#### TC-009: Urgent flag when take-up deadline within 14 days

**AC Reference**: AC-5 from US-2
**Priority**: P2
**Severity if fails**: Sev 3
**Method**: Browser

**Preconditions**:
- Entry with `take_up_deadline` 10 days from now
- Entry with `take_up_deadline` 30 days from now

**Steps**:
1. Navigate to `/pages/entries`
2. Locate the entry with 10-day deadline
3. Verify "URGENT" badge is visible on that row
4. Verify the entry with 30-day deadline does NOT show "URGENT" badge

**Expected Result**:
- Red/urgent indicator visible for entries within 14 days of deadline
- Non-urgent entries show normal deadline text

---

### US-3: ACER Lodgement per Funding Stream

#### TC-010: Multiple funding streams show independent lodgement status

**AC Reference**: AC-1 from US-3
**Priority**: P1
**Severity if fails**: Sev 1
**Method**: Browser

**Preconditions**:
- Client has three activated entries: ON (active), RC (ACER pending), AT (ACER pending)

**Steps**:
1. Navigate to entry queue
2. Click "ACER Pending" tab
3. Verify RC and AT entries appear with status "ACER Pending"
4. Navigate to ON entry — verify its status reflects its current lifecycle stage (Active/Lodged)

**Expected Result**:
- Each stream listed separately with its own lodgement status
- Lodging one does not affect the others

---

#### TC-011: Lodge ACER for single funding stream

**AC Reference**: AC-2 from US-3
**Priority**: P1
**Severity if fails**: Sev 1
**Method**: Browser

**Preconditions**:
- Entry in `acer_pending` status

**Steps**:
1. Navigate to the entry's show page
2. Click "Lodge ACER" button
3. Verify modal opens with "Lodge ACER" heading
4. Verify commencement date is pre-filled
5. Enter lodgement date (today)
6. Check the PRODA confirmation checkbox
7. Click "Confirm Lodgement"
8. Verify modal closes

**Expected Result**:
- Entry status transitions to "ACER Lodged"
- `lodgement_date` and `commencement_date` recorded on EntryRecord
- Entry moves from "ACER Pending" tab to "Lodged" tab
- Audit trail records lodgement with date and user

---

#### TC-012: Lodge ACER modal requires PRODA confirmation checkbox

**AC Reference**: AC-2 from US-3
**Priority**: P2
**Severity if fails**: Sev 3
**Method**: Browser

**Preconditions**:
- Entry in `acer_pending` status

**Steps**:
1. Open Lodge ACER modal
2. Fill in lodgement date
3. Verify "Confirm Lodgement" button is disabled while checkbox is unchecked
4. Check the PRODA confirmation checkbox
5. Verify button becomes enabled

**Expected Result**:
- Submit button disabled until PRODA checkbox is checked
- Prevents accidental lodgement without PRODA confirmation

---

#### TC-013: ACER Pending tab shows filterable queue

**AC Reference**: AC-5 from US-3
**Priority**: P1
**Severity if fails**: Sev 2
**Method**: Browser

**Preconditions**:
- Multiple entries in `acer_pending` status with varying take-up deadlines

**Steps**:
1. Navigate to `/pages/entries`
2. Click "ACER Pending" tab
3. Verify entries are listed sorted by take-up deadline (most urgent first)
4. Verify search input filters entries by client name
5. Enter a client name in search and verify results filter

**Expected Result**:
- ACER Pending tab shows only entries awaiting lodgement
- Sorted by urgency (closest deadline first)
- Search narrows results

---

### US-4: Multi-Stream Package View

#### TC-014: Package page shows funding streams section with lifecycle statuses

**AC Reference**: AC-1 from US-4
**Priority**: P1
**Severity if fails**: Sev 2
**Method**: Browser

**Preconditions**:
- Client with entries in multiple lifecycle stages (ON active, RC allocated, AT ACER lodged)
- Package page integration implemented (Phase 4)

**Steps**:
1. Navigate to the client's package page
2. Locate the "Entry Records" or "Funding Streams" section
3. Verify each stream is listed with its lifecycle status badge
4. Verify statuses match: ON = Active, RC = Queued/Allocated, AT = ACER Lodged

**Expected Result**:
- All funding streams visible in a single view
- Each stream has a distinct status badge with colour coding
- No need to cross-reference external systems

**Note**: Depends on Phase 4 implementation (Package View integration). Mark as blocked if not yet built.

---

#### TC-015: Withdrawn funding stream displayed with reason

**AC Reference**: AC-2 from US-4
**Priority**: P2
**Severity if fails**: Sev 3
**Method**: Browser

**Preconditions**:
- Entry with status `withdrawn` and `withdrawal_reason` populated

**Steps**:
1. Navigate to the client's package page or entry show page
2. Locate the withdrawn stream
3. Verify it shows "Withdrawn" status badge
4. Verify withdrawal date and reason are displayed

**Expected Result**:
- Withdrawn stream clearly marked (distinct colour, e.g., red badge)
- Withdrawal date and reason text visible

---

#### TC-016: Entry show page displays full audit trail and history

**AC Reference**: AC-5 from US-4
**Priority**: P1
**Severity if fails**: Sev 2
**Method**: Browser

**Preconditions**:
- Entry that has been through at least one status transition (e.g., queued → activated)

**Steps**:
1. Navigate to `/pages/entries/{id}` for the entry
2. Verify breadcrumb navigation back to queue
3. Verify "Audit Trail" section is visible
4. Verify audit entries show: timestamp, user, action, old/new values

**Expected Result**:
- Full history of status transitions visible with timestamps and user attribution
- Associated funding records section shows linked funding streams
- Action buttons available based on current status

---

### US-5: Commencement Date Validation

#### TC-017: Commencement date after take-up deadline is blocked

**AC Reference**: AC-1 from US-5
**Priority**: P1
**Severity if fails**: Sev 1
**Method**: Browser

**Preconditions**:
- Entry in `queued` status with `take_up_deadline` of 2026-03-31

**Steps**:
1. Open activation modal for the entry
2. Set commencement date to 2026-04-05 (after deadline)
3. Attempt to submit the form

**Expected Result**:
- Form submission blocked
- Validation error displayed: "Commencement date must be on or before the take-up deadline"
- Entry status remains `queued`

**Edge Cases**:
- Commencement date exactly equal to take-up deadline — should be accepted
- Take-up deadline is null — validation should be skipped

---

#### TC-018: Quarter-start commencement date triggers warning

**AC Reference**: AC-2 from US-5
**Priority**: P2
**Severity if fails**: Sev 4
**Method**: Browser

**Preconditions**:
- Entry in `acer_pending` status

**Steps**:
1. Open Lodge ACER modal
2. Set commencement date to the 3rd of a quarter start (e.g., 2026-01-03 or 2026-04-03)
3. Verify a warning message appears about first-week-of-quarter dates

**Expected Result**:
- Warning displayed (not a blocking error): "Commencement dates in the first week of the quarter may result in funding being allocated to the previous quarter. Consider a date after the 7th."
- User can still proceed despite the warning

---

#### TC-019: Urgent notification for approaching deadline with no ACER

**AC Reference**: AC-3 from US-5
**Priority**: P2
**Severity if fails**: Sev 3
**Method**: Automated (Feature Test)

**Preconditions**:
- Entry in `acer_pending` status with `take_up_deadline` within 14 days
- `CheckTakeUpDeadlines` scheduled command exists

**Steps**:
1. Run the `CheckTakeUpDeadlines` command
2. Verify a `TakeUpDeadlineApproachingNotification` is dispatched
3. Verify the notification targets the Finance team

**Expected Result**:
- Notification created in the database for the correct recipients
- Entry flagged as urgent in the queue

**Note**: Depends on Phase 4 implementation (scheduled commands + notifications).

---

### US-6: Funding Stream Change Notifications

#### TC-020: Notification on new classification detection

**AC Reference**: AC-1 from US-6
**Priority**: P2
**Severity if fails**: Sev 3
**Method**: Automated (Feature Test)

**Preconditions**:
- Client has assigned Care Partner
- SA sync detects a new `PackageAllocation`

**Steps**:
1. Trigger sync with new allocation data
2. Verify `NewClassificationDetectedNotification` is dispatched
3. Verify notification targets the assigned Care Partner (database channel)

**Expected Result**:
- In-app notification created for the Care Partner
- Notification contains client name and new classification type

**Note**: Depends on Phase 2 implementation (notifications).

---

#### TC-021: High-priority notification on funding withdrawal

**AC Reference**: AC-2 from US-6
**Priority**: P2
**Severity if fails**: Sev 2
**Method**: Automated (Feature Test)

**Preconditions**:
- Entry in active status
- SA sync returns allocation with withdrawn status

**Steps**:
1. Trigger sync with withdrawn allocation data
2. Verify `FundingWithdrawnNotification` is dispatched
3. Verify notification targets Budget Coordinator and Finance team

**Expected Result**:
- High-priority notification created
- Entry status updated to `withdrawn` with `withdrawal_reason` from SA API

**Note**: Depends on Phase 2+4 implementation.

---

#### TC-022: Notification on classification level change

**AC Reference**: AC-3 from US-6
**Priority**: P2
**Severity if fails**: Sev 3
**Method**: Automated (Feature Test)

**Preconditions**:
- Client with active classification SAH 3
- SA sync returns updated classification SAH 4

**Steps**:
1. Trigger sync with level change data
2. Verify notification is dispatched indicating budget review needed

**Expected Result**:
- Notification sent to Budget Coordinator
- Classification update reflected in system

**Note**: Depends on Phase 4 implementation.

---

#### TC-023: Notification on offer type change (MSO to FSO)

**AC Reference**: AC-4 from US-6
**Priority**: P2
**Severity if fails**: Sev 3
**Method**: Automated (Feature Test)

**Preconditions**:
- Client with MSO offer type
- SA sync returns FSO offer type

**Steps**:
1. Trigger sync with offer type change
2. Verify notification dispatched about funding amount change

**Expected Result**:
- Notification sent indicating new budget preparation needed

**Note**: Depends on Phase 4 implementation.

---

### US-7: Restorative Care / End of Life Package Activation

#### TC-024: RC activation requires management model acknowledgement

**AC Reference**: AC-1 from US-7
**Priority**: P1
**Severity if fails**: Sev 2
**Method**: Browser

**Preconditions**:
- Entry with classification RC in `queued` status
- Client is self-managed

**Steps**:
1. Open activation modal for the RC entry
2. Verify warning about management model change to Fully Coordinated
3. Verify acknowledgement checkbox is present
4. Attempt to submit without checking acknowledgement
5. Check acknowledgement and submit successfully

**Expected Result**:
- Warning clearly states RC requires Fully Coordinated management
- Cannot activate without acknowledging the management model change
- Successful activation records the acknowledgement

---

#### TC-025: EOL activation displays once-in-a-lifetime warning

**AC Reference**: AC-2 from US-7
**Priority**: P2
**Severity if fails**: Sev 3
**Method**: Browser

**Preconditions**:
- Entry with classification EL (End of Life) in `queued` status

**Steps**:
1. Open activation modal for the EOL entry
2. Verify warning is displayed about once-in-a-lifetime, 3-month funding stream

**Expected Result**:
- Warning text visible: references "once-in-a-lifetime" and "3-month funding stream"
- User must acknowledge before proceeding

---

#### TC-026: EOL activation makes ongoing package dormant

**AC Reference**: AC-3 from US-7
**Priority**: P1
**Severity if fails**: Sev 1
**Method**: Automated (Feature Test)

**Preconditions**:
- Client with active ongoing (ON) package and services
- EOL entry in `queued` status

**Steps**:
1. Activate the EOL entry
2. Verify the ongoing package status changes to "Dormant" (not Terminated)
3. Verify the EOL entry becomes the active billing context

**Expected Result**:
- Ongoing package marked as Dormant
- EOL package active
- Existing services on ongoing package are paused, not cancelled

**Note**: Depends on Phase 4 implementation (EOL dormancy logic).

---

### US-8: Multi-Care Partner & Clinical Care Partner Assignment

#### TC-027: Multiple care partners assignable to a package

**AC Reference**: AC-1 from US-8
**Priority**: P2
**Severity if fails**: Sev 3
**Method**: Browser

**Preconditions**:
- Client with both ON and RC funding streams
- At least 2 care partners available

**Steps**:
1. Navigate to the package page
2. Locate care partner assignment section
3. Verify multi-select is available for care partners
4. Assign a primary care partner and a clinical care partner for RC

**Expected Result**:
- Multiple care partners can be assigned
- Clinical care partner designation visible for RC

**Note**: Depends on Phase 4 implementation.

---

#### TC-028: Clinical care partner visible in care circle

**AC Reference**: AC-2 from US-8
**Priority**: P2
**Severity if fails**: Sev 3
**Method**: Browser

**Preconditions**:
- Client with clinical care partner assigned for RC

**Steps**:
1. Navigate to client's care circle/package page
2. Verify both ongoing care partner and clinical care partner are visible
3. Verify each shows their associated funding stream

**Expected Result**:
- Two care partners listed with their role and funding stream clearly labelled

**Note**: Depends on Phase 4 implementation.

---

### Edge Cases

#### TC-029: Zero-funding classifications excluded from queue (FR-004)

**AC Reference**: FR-004
**Priority**: P1
**Severity if fails**: Sev 2
**Method**: Automated (Feature Test)

**Preconditions**:
- SA sync data includes AT with zero-funding code `55` and HM with zero-funding code `56`

**Steps**:
1. Trigger SA sync with zero-funding allocations
2. Query EntryRecords for the package

**Expected Result**:
- No EntryRecords created for zero-funding classifications
- Queue does not show these allocations

---

#### TC-030: Deferred entry expires when take-up deadline passes

**AC Reference**: Edge Case — deferred expiry
**Priority**: P2
**Severity if fails**: Sev 3
**Method**: Automated (Feature Test)

**Preconditions**:
- Entry in `deferred` status with `take_up_deadline` in the past

**Steps**:
1. Run scheduled command that checks for expired deferrals
2. Verify entry status transitions from `deferred` to `expired`

**Expected Result**:
- Entry moved to `expired` status
- Appears in "Terminated" tab (along with withdrawn, completed)
- Audit trail records the expiry

---

#### TC-031: Same classification cannot be activated twice for same period (FR-033)

**AC Reference**: FR-033
**Priority**: P1
**Severity if fails**: Sev 1
**Method**: Automated (Feature Test)

**Preconditions**:
- Entry already activated for RC classification

**Steps**:
1. Attempt to create another EntryRecord with same `package_id` and `classification_code`
2. Verify the unique constraint prevents it

**Expected Result**:
- Database-level constraint prevents duplicate
- No duplicate entries in the queue

---

#### TC-032: AT and HM approved simultaneously — independent activation

**AC Reference**: Edge Case — simultaneous approvals
**Priority**: P2
**Severity if fails**: Sev 3
**Method**: Browser

**Preconditions**:
- Client with both AT and HM entries in `queued` status

**Steps**:
1. Navigate to entry queue
2. Activate the AT entry (leave HM as queued)
3. Verify AT moves to ACER Pending while HM remains in New tab
4. Verify HM can be deferred independently

**Expected Result**:
- Each entry independently actionable
- Activating one does not affect the other

---

### Queue Page Functionality

#### TC-033: Tab navigation updates URL and displays correct data

**AC Reference**: Clarification — single page with tabs
**Priority**: P1
**Severity if fails**: Sev 2
**Method**: Browser

**Preconditions**:
- Entries exist across multiple statuses

**Steps**:
1. Navigate to `/pages/entries`
2. Click "ACER Pending" tab — verify URL contains `?tab=acer_pending`
3. Click "Lodged" tab — verify URL contains `?tab=lodged`
4. Click "All" tab — verify URL contains `?tab=all`
5. Click "New / Awaiting Consent" tab — verify URL contains `?tab=new`

**Expected Result**:
- Each tab click updates URL query parameter
- Tab content refreshes to show entries matching the tab's filter
- Tab counts (badges) update after actions

---

#### TC-034: Search filters entries by client name

**AC Reference**: Queue usability
**Priority**: P2
**Severity if fails**: Sev 4
**Method**: Browser

**Preconditions**:
- Multiple entries for different clients exist

**Steps**:
1. Navigate to `/pages/entries`
2. Type a client name into the search input
3. Verify the table filters to show only matching entries
4. Clear the search
5. Verify all entries reappear

**Expected Result**:
- Real-time filtering by client name
- No results state shown if no matches

---

#### TC-035: View link navigates to entry show page

**AC Reference**: Clarification — show page
**Priority**: P1
**Severity if fails**: Sev 2
**Method**: Browser

**Preconditions**:
- At least one entry exists in the queue

**Steps**:
1. Navigate to `/pages/entries`
2. Click "View" link on any entry row
3. Verify URL matches `/pages/entries/{id}`
4. Verify show page displays entry details
5. Click breadcrumb "Entry Queue" to return
6. Verify returned to the queue index

**Expected Result**:
- Navigation to show page works
- Breadcrumb returns to queue
- Show page displays: classification, package link, status, dates, audit trail

---

### Authorization & Access Control

#### TC-036: Finance role can access entries queue

**AC Reference**: Clarification — Finance + Care Partners only
**Priority**: P1
**Severity if fails**: Sev 1
**Method**: Browser

**Preconditions**:
- User with Finance role

**Steps**:
1. Log in as Finance user
2. Navigate to `/pages/entries`
3. Verify page loads successfully
4. Verify "Lodge ACER" action is available on ACER Pending entries

**Expected Result**:
- Finance user can view all tabs and entries
- Lodge ACER action enabled for Finance
- Activate/Defer actions may be restricted per policy

---

#### TC-037: Care Partner role can access and activate entries

**AC Reference**: Clarification — Care Partners can activate/defer
**Priority**: P1
**Severity if fails**: Sev 1
**Method**: Browser

**Preconditions**:
- User with Care Partner role

**Steps**:
1. Log in as Care Partner
2. Navigate to `/pages/entries`
3. Verify page loads successfully
4. Verify "Activate" and "Defer" actions available on queued entries

**Expected Result**:
- Care Partner can view entries
- Activate and Defer buttons visible on queued entries
- Lodge ACER may be restricted per policy

---

#### TC-038: Unauthorized role cannot access entries page

**AC Reference**: Clarification — restricted access
**Priority**: P1
**Severity if fails**: Sev 1
**Method**: Browser

**Preconditions**:
- User with a role that should NOT access entries (e.g., Supplier role)

**Steps**:
1. Log in as unauthorized user
2. Attempt to navigate to `/pages/entries`
3. Verify access is denied (403 or redirect)

**Expected Result**:
- Page does not load for unauthorized users
- No sidebar navigation item visible for entries

---

#### TC-039: Admin role can access entries queue

**AC Reference**: Commit 08b7c58 — Allow Admin role
**Priority**: P1
**Severity if fails**: Sev 2
**Method**: Browser

**Preconditions**:
- User with Admin role

**Steps**:
1. Log in as Admin
2. Navigate to `/pages/entries`
3. Verify page loads and all actions available

**Expected Result**:
- Admin has full access to all tabs and actions

---

### Data Integrity

#### TC-040: All status transitions logged with audit trail (FR-032)

**AC Reference**: FR-032
**Priority**: P1
**Severity if fails**: Sev 2
**Method**: Browser

**Preconditions**:
- Entry that has been through: queued → activated → acer_pending → acer_lodged

**Steps**:
1. Navigate to the entry's show page
2. Scroll to audit trail section
3. Verify each transition is logged with: timestamp, user who performed the action, old status, new status

**Expected Result**:
- Complete audit trail of all transitions
- Each entry includes the user who performed the action
- Timestamps in chronological order

---

#### TC-041: Feature flag gates UI visibility

**AC Reference**: Plan — Pennant feature flag
**Priority**: P2
**Severity if fails**: Sev 3
**Method**: Browser

**Preconditions**:
- `MultiPackageSupport` feature flag is disabled

**Steps**:
1. Log in as Admin
2. Verify "Entries" sidebar item is NOT visible
3. Attempt to navigate to `/pages/entries` directly
4. Verify access is blocked (redirect or 403)

**Expected Result**:
- No sidebar navigation when flag is off
- Direct URL access blocked
- No entry-related features visible anywhere in Portal

---

#### TC-042: No auto-activation — explicit user action required (FR-031)

**AC Reference**: FR-031
**Priority**: P1
**Severity if fails**: Sev 1
**Method**: Automated (Feature Test)

**Preconditions**:
- SA sync detects new allocation

**Steps**:
1. Run SA sync pipeline
2. Verify EntryRecord is created in `queued` status (NOT `activated` or `acer_pending`)
3. Verify no automatic status promotion beyond `queued`

**Expected Result**:
- Sync only creates entries in `queued` status
- No ACER lodgement happens automatically
- Every status transition requires explicit user action via the UI

---

## Responsive Testing

| Breakpoint | Resolution | Key Pages to Test |
|------------|-----------|-------------------|
| Desktop | 1920x1080 | `/pages/entries` (queue), `/pages/entries/{id}` (show), activation/defer/lodge modals |
| Tablet | 768x1024 | `/pages/entries` (table scrolls horizontally or stacks), modals fit viewport |
| Mobile | 375x812 | `/pages/entries` (table responsive), modals full-width, action buttons accessible |

---

## Accessibility Checklist

- [ ] Form fields have labels (commencement date, reason, notes, lodgement date)
- [ ] Modal dialogs trap focus and are keyboard dismissible (Escape key)
- [ ] Buttons have accessible names ("Activate", "Defer", "Lodge ACER", "Confirm Lodgement")
- [ ] Status badges have text content (not colour-only)
- [ ] Tab navigation is keyboard accessible (arrow keys between tabs)
- [ ] Heading hierarchy is correct (h1 for page title, h2 for sections)
- [ ] Focus order is logical (tab through form fields in order)
- [ ] Colour contrast meets WCAG AA for all badges and text
- [ ] URGENT indicator is not colour-only (includes text "URGENT")
- [ ] Table rows are navigable with screen reader (proper th/td structure)

---

## E2E Test Specifications

Playwright E2E tests to be created by `/trilogy-qa-test-codify` after test execution passes.

### Page Objects Needed

| Page Object | File | Covers |
|-------------|------|--------|
| `Entries` | `e2e/pages/entries.page.ts` | Queue index, show page, all modals (already exists) |
| `Auth` | `e2e/pages/auth.page.ts` | Login flows (already exists) |

### Test Specs to Create

| Spec File | Test Cases | Priority |
|-----------|-----------|----------|
| `e2e/tests/entries/entry-queue.spec.ts` | TC-002, TC-003, TC-033, TC-034, TC-035 | P1 (exists, extend) |
| `e2e/tests/entries/entry-activation.spec.ts` | TC-005, TC-006, TC-008, TC-017, TC-024, TC-025 | P1 |
| `e2e/tests/entries/entry-defer.spec.ts` | TC-007, TC-032 | P1 |
| `e2e/tests/entries/entry-lodge-acer.spec.ts` | TC-011, TC-012, TC-013, TC-018 | P1 |
| `e2e/tests/entries/entry-show.spec.ts` | TC-016, TC-040 | P1 |
| `e2e/tests/entries/entry-authorization.spec.ts` | TC-036, TC-037, TC-038, TC-039, TC-041 | P1 |

### Key Locators

| Element | Selector Strategy | Notes |
|---------|------------------|-------|
| Page heading | `getByRole('heading', { name: 'Entry Queue' })` | Exists in page object |
| Tab buttons | `getByRole('tab', { name: /New \/ Awaiting Consent/ })` | Regex for dynamic count badge |
| Activate button | `getByRole('button', { name: 'Activate' })` | Use `.first()` for queue rows |
| Defer button | `getByRole('button', { name: 'Defer' })` | Use `.first()` for queue rows |
| Lodge ACER button | `getByRole('button', { name: 'Lodge ACER' })` | On show page or queue row |
| Confirm Lodgement | `getByRole('button', { name: 'Confirm Lodgement' })` | Inside Lodge ACER modal |
| PRODA checkbox | `getByRole('checkbox')` | Inside Lodge ACER modal dialog |
| Date spinbuttons | `getByRole('spinbutton', { name: 'day,' })` | Use `.first()` / `.last()` for multiple date fields |
| Deferral reason dropdown | `getByRole('button', { name: 'Show popup' })` | CommonSelectMenu trigger inside Defer modal |
| View link | `getByRole('link', { name: 'View' })` | Table row navigation to show page |
| Status badges | `getByText('ACER Pending')` / `getByText('URGENT')` | Text-based matching |
| Breadcrumb | `getByRole('link', { name: 'Entry Queue' })` | Show page navigation back |
| Search input | `getByPlaceholder('Search clients...')` | Queue search |
| Audit trail heading | `getByRole('heading', { name: 'Audit Trail' })` | Show page section |

### Test Data Dependencies

| Test | Seeded Data Needed | Factory/Seeder |
|------|-------------------|----------------|
| TC-002, TC-003 | Multiple entries in `queued` status with different classifications | `EntryRecordFactory::queued()` |
| TC-006, TC-007 | Entry in `queued` status with future take-up deadline | `EntryRecordFactory::queued()` |
| TC-009 | Entry with take-up deadline 10 days away | `EntryRecordFactory::queued()->state(['take_up_deadline' => now()->addDays(10)])` |
| TC-011, TC-012 | Entry in `acer_pending` status | `EntryRecordFactory::acerPending()` |
| TC-016, TC-040 | Entry with activity log entries (multiple transitions) | Create + activate via actions |
| TC-024 | RC entry in `queued` status | `EntryRecordFactory::queued()->state(['classification_code' => 'RC'])` |
| TC-025 | EL entry in `queued` status | `EntryRecordFactory::queued()->state(['classification_code' => 'EL'])` |
| TC-032 | AT + HM entries for same client | Two `EntryRecordFactory` for same package |
| TC-036-039 | Users with Finance, Care Partner, Admin, Supplier roles | Standard role seeders |

---

## Quality Checks

- [ ] No console errors on `/pages/entries` (index) page load
- [ ] No console errors on `/pages/entries/{id}` (show) page load
- [ ] No console errors during modal open/close/submit
- [ ] No console warnings (feature-related, ignoring Vue dev warnings)
- [ ] No 404 network requests on entry pages
- [ ] No requests > 3s on queue page with 50+ entries
- [ ] Feature flag toggles correctly (entries hidden when flag off)
- [ ] Flash messages appear after successful activate/defer/lodge actions

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

## Implementation Status Notes

Several test cases depend on features not yet built (Phases 2 and 4):

| Phase | Status | Affected Test Cases |
|-------|--------|-------------------|
| Phase 1: Foundation | Complete | TC-031 |
| Phase 2: Sync Integration | Not started | TC-001, TC-004, TC-020, TC-021, TC-022, TC-023, TC-029, TC-042 |
| Phase 3: Queue + Modals | Complete | TC-002-013, TC-017-018, TC-024-025, TC-033-040 |
| Phase 4: Package View + Polish | Not started | TC-014, TC-015, TC-019, TC-026, TC-027, TC-028, TC-030 |

**Recommendation**: Execute Phase 3 test cases immediately (queue page, activation, deferral, ACER lodgement). Phase 2 and 4 test cases should be executed as those phases are implemented.

---

## Next Steps

- [ ] `/trilogy-qa-test-agent` — Execute this test plan in the browser (Phase 3 tests first)
- [ ] `/trilogy-qa-test-codify` — Convert passing tests to Pest/Playwright
- [ ] `/trilogy-qa-handover` — Gate 5 sign-off
