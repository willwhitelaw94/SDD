---
title: "QA Test Report: Multi-Package Support (MPS)"
created: 2026-02-26
status: Complete
---

# QA Test Report: Multi-Package Support (MPS)

**Epic**: Multi-Package Support (MPS)
**Branch**: `epic/mps-multi-package-support`
**Date**: 2026-02-26
**Tester**: QA Test Agent (Claude Code)
**Environment**: Local (tc-portal.test via Laravel Herd)

---

## Summary

| Metric | Value |
|--------|-------|
| Total Test Cases Executed | 15 |
| Passed | 13 |
| Failed (Fixed) | 2 |
| Not Testable (No Seed Data) | 1 |
| Skipped | 0 |
| Automated Tests (Pest) | 247 passed |

**Overall Result**: PASS (with 2 bugs found and fixed during testing)

---

## Bugs Found and Fixed

### BUG-1: Search crashes with SQLSTATE error (Sev 1)

**Test Case**: TC-034
**File**: `domain/Funding/Tables/EntriesTable.php`
**Problem**: The `client` column had `searchable: true` but `client` is a computed field from `transformModel()`, not a real database column. Searching triggered `SQLSTATE[42S22]: Column not found: 1054 Unknown column 'entry_records.client'`.
**Fix**: Removed `searchable: true` from the client TextColumn. Added a `withQueryBuilder` method with a `searchUsing` callback that searches through `users.first_name`, `users.last_name`, `users.full_name`, and `packages.tc_customer_no` to resolve matching `package_id` values.
**Status**: Fixed and verified.

### BUG-2: EOL/RC classification warnings never display (Sev 2)

**Test Case**: TC-025
**Files**: `domain/Funding/Tables/EntriesTable.php`, `resources/js/Pages/Entries/Index.vue`, `resources/js/Pages/Entries/Partials/ActivateEntryModal.vue`
**Problem**: The activation modal checked `classification_code === 'EL'` for End of Life and `classification_code === 'RC'` for Restorative Care. However, the raw `classification_code` from the database is a numeric Services Australia code (e.g., `'513'` for EOL), not the enum value. The EOL/RC warnings and acknowledgement checkboxes never appeared.
**Fix**:
1. Added `resolveClassificationLevel()` method to `EntriesTable.php` that resolves the `PackageLevelEnum` value (e.g., `'EOL'`, `'RESTORATIVE_CARE'`) from the allocation's `classification_text`.
2. Added `classification_level` field to the table's `transformModel` output.
3. Updated `Index.vue` to pass `classification_level` to the modal.
4. Updated `ActivateEntryModal.vue` to check `classification_level === 'EOL'` and `classification_level === 'RESTORATIVE_CARE'` instead of the raw code.
**Status**: Fixed and verified.

---

## Test Results

### Entry Queue Page (TC-002)

| ID | Description | Result | Evidence |
|----|-------------|--------|----------|
| TC-002 | Entry Queue page loads with tabs, table, and action buttons | PASS | `tc-002-entry-queue.png` |

**Observations**:
- Heading "Entry Queue" with subtitle visible
- All 8 tabs visible with correct counts: New (30), Deferred (1), ACER Pending (0), Lodged (1), Active (0), Exit Pending (0), Terminated (0), All (32)
- Table columns: Client, Package, Classification, Take-Up Deadline, Status, Actions
- Action buttons: Activate, Defer, View per row

### Multiple Classifications (TC-003)

| ID | Description | Result | Evidence |
|----|-------------|--------|----------|
| TC-003 | Same client shows multiple classification entries as separate rows | PASS | `tc-002-entry-queue.png` |

**Observations**:
- Brigitte Zieme (IF-199706) appears with SAH 2, AT - Low, HM - High as separate rows
- Edgar Littel (PG-936181) appears with AT - Low, HM - Low, SAH 8 as separate rows
- Aylin Romaguera (BO-445314) appears with AT - Low (HM - High was activated, HCP 2 was deferred)

### Activation Modal (TC-005)

| ID | Description | Result | Evidence |
|----|-------------|--------|----------|
| TC-005 | Activation modal displays client details, classification, dates, and form fields | PASS | `tc-005-activation-modal.png` |

**Observations**:
- Modal title: "Activate Funding Stream"
- Client: Aylin Romaguera
- Classification: HM - High
- Take-Up Deadline: 27/02/2026 (1 days remaining)
- Commencement Date field (pre-filled with deadline date)
- Notes field
- Cancel and Activate buttons

### Activate Entry (TC-006)

| ID | Description | Result | Evidence |
|----|-------------|--------|----------|
| TC-006 | Activating an entry moves it to ACER Pending tab with correct count updates | PASS | `tc-006-after-activation.png`, `tc-006-acer-pending-tab.png` |

**Observations**:
- After activation, New count decreased from 32 to 31, ACER Pending increased from 0 to 1
- Entry visible in ACER Pending tab with status "ACER Pending" and "Lodge ACER" button
- Commencement date set to 26/02/2026

### Defer Entry (TC-007)

| ID | Description | Result | Evidence |
|----|-------------|--------|----------|
| TC-007 | Deferring an entry moves it to Deferred tab with reason | PASS | `tc-007-defer-modal.png`, `tc-007-after-defer.png` |

**Observations**:
- Defer modal shows: Client, Classification, Reason dropdown (required), Notes, Reminder Date (optional)
- Reason options: Client Not Ready, Timing Not Right, Needs Review, Other
- Defer button disabled until reason selected
- After deferral: New count decreased from 31 to 30, Deferred increased from 0 to 1

### Urgent Badges (TC-009)

| ID | Description | Result | Evidence |
|----|-------------|--------|----------|
| TC-009 | Entries within 14 days of deadline show URGENT badge | PASS | `tc-002-entry-queue.png` |

**Observations**:
- Entries with take-up deadlines within 14 days display "URGENT" badge with red styling
- Overdue entries show "X days overdue" in red

### Lodge ACER (TC-011)

| ID | Description | Result | Evidence |
|----|-------------|--------|----------|
| TC-011 | Lodging ACER moves entry from ACER Pending to Lodged | PASS | `tc-011-after-lodge.png`, `tc-011-lodged-tab.png` |

**Observations**:
- After lodgement: ACER Pending count decreased from 1 to 0, Lodged increased from 0 to 1
- Entry visible in Lodged tab with status "ACER Lodged" and "Exit" button available

### Lodge ACER Modal (TC-012)

| ID | Description | Result | Evidence |
|----|-------------|--------|----------|
| TC-012 | Lodge ACER modal requires PRODA checkbox before submission | PASS | `tc-012-lodge-acer-disabled.png`, `tc-012-lodge-acer-enabled.png` |

**Observations**:
- Modal shows: Client, Classification, Commencement Date, Lodgement Date, PRODA confirmation checkbox
- "Confirm Lodgement" button is disabled until checkbox is checked
- Deadline validation message appears: "Commencement date (26/02/2026) is before the take-up deadline (27/02/2026)"
- After checking checkbox, button becomes enabled

### Audit Trail (TC-016)

| ID | Description | Result | Evidence |
|----|-------------|--------|----------|
| TC-016 | Entry show page displays audit trail with DATE/TIME, USER, ACTION, DETAILS | PASS | `tc-016-audit-trail.png` |

**Observations**:
- Audit Trail heading visible
- Table with DATE/TIME, USER, ACTION, DETAILS columns
- Shows 3 entries: created (System), updated (Super Admin for activation), updated (Super Admin for lodgement)

### RC Activation Warning (TC-024)

| ID | Description | Result | Evidence |
|----|-------------|--------|----------|
| TC-024 | Restorative Care activation displays management model warning | NOT TESTABLE | No RC entries in seed data |

**Notes**: No Restorative Care entries exist in the seeded dataset. The code logic is in place (`ActivateEntryModal.vue` checks `classification_level === 'RESTORATIVE_CARE'`) and was verified alongside the EOL fix.

### EOL Activation Warning (TC-025)

| ID | Description | Result | Evidence |
|----|-------------|--------|----------|
| TC-025 | End of Life activation displays once-in-a-lifetime warning | PASS (after fix) | `tc-025-eol-warning.png` |

**Observations** (after BUG-2 fix):
- Info alert: "Once-in-a-Lifetime Funding"
- Description: "End of Life is typically a short-term stream. This entry can only be activated once in a consumer's lifetime."
- Acknowledgement checkbox required before activation
- Button shows "Activate (Acknowledge Required)" and is disabled until checkbox checked

### Tab Navigation (TC-033)

| ID | Description | Result | Evidence |
|----|-------------|--------|----------|
| TC-033 | Clicking tabs updates URL query parameter and filters table | PASS | `tc-033-tab-navigation.png` |

**Observations**:
- Clicking tabs updates URL: `?tab=new`, `?tab=acer_pending`, `?tab=lodged`, `?tab=all`
- Table content updates to match selected tab
- Selected tab is visually highlighted

### Search (TC-034)

| ID | Description | Result | Evidence |
|----|-------------|--------|----------|
| TC-034 | Search filters entries by client name | PASS (after fix) | `tc-034-search-filtered.png` |

**Observations** (after BUG-1 fix):
- Searching "Brigitte" returns 3 records for Brigitte Zieme (SAH 2, AT - Low, HM - High)
- Search updates URL with query parameter
- Search works across first name, last name, full name, and package reference number

### View Entry Detail (TC-035)

| ID | Description | Result | Evidence |
|----|-------------|--------|----------|
| TC-035 | View link navigates to entry show page with full details | PASS | `tc-035-show-page.png` |

**Observations**:
- Heading: "Aylin Romaguera -- HM - High"
- Subtitle: "Entry Record #ENT-19"
- Details: Classification, Package (linked), Approval Date, Take-Up Deadline, Current Status
- Breadcrumb navigation: Entry Queue > Aylin Romaguera -- HM - High
- Action buttons appropriate to status

### Admin Access (TC-039)

| ID | Description | Result | Evidence |
|----|-------------|--------|----------|
| TC-039 | Admin role has full access to entries queue | PASS | `tc-002-entry-queue.png` |

**Observations**:
- Logged in as "Admin - Bill Processing"
- Full access to all tabs, search, filter, and actions (Activate, Defer, View)
- Entries sidebar navigation item visible

### Audit Trail Transitions (TC-040)

| ID | Description | Result | Evidence |
|----|-------------|--------|----------|
| TC-040 | Audit trail shows all status transitions | PASS | `tc-016-audit-trail.png` |

**Observations**:
- Shows creation event (System), activation event (Super Admin), lodgement event (Super Admin)
- Events ordered by date/time descending

---

## Responsive Testing

| Viewport | Width x Height | Result | Evidence |
|----------|----------------|--------|----------|
| Desktop | 1920 x 1080 | PASS | `tc-002-entry-queue.png` |
| Tablet | 768 x 1024 | PASS | `responsive-tablet-768.png` |
| Mobile | 375 x 812 | PASS | `responsive-mobile-375.png` |

**Notes**: Page renders correctly at all breakpoints. Table scrolls horizontally on narrow viewports. Tabs remain accessible. Sidebar collapses on mobile.

---

## Console Errors

| Type | Count | Details |
|------|-------|---------|
| Errors | 0 | None |
| Warnings | 4 | `[Monicon] The icon "heroicons:queue-list" is missing from the configuration` (cosmetic, non-blocking) |

---

## Automated Test Results

| Suite | Tests | Assertions | Result |
|-------|-------|------------|--------|
| `tests/Feature/Funding/` | 233 | 484 | PASS |
| `tests/Feature/PackageSync/` | 14 | 39 | PASS |
| **Total** | **247** | **523** | **PASS** |

All 247 automated tests pass.

---

## Code Quality

| Check | Result |
|-------|--------|
| `vendor/bin/pint --dirty` | PASS (no formatting issues) |

---

## Files Modified During Testing

| File | Change |
|------|--------|
| `domain/Funding/Tables/EntriesTable.php` | Fixed search (BUG-1), added `classification_level` field (BUG-2) |
| `resources/js/Pages/Entries/Index.vue` | Added `classification_level` to type and modal props (BUG-2) |
| `resources/js/Pages/Entries/Partials/ActivateEntryModal.vue` | Fixed EOL/RC classification checks to use `classification_level` (BUG-2) |

---

## Recommendations

1. **Add `heroicons:queue-list` to Monicon config** -- 4 console warnings on every page load of the entries queue.
2. **Add RC seed data** -- Restorative Care classification entries should be included in `SahSeeder` or a dedicated test seeder to enable manual QA of TC-024.
3. **Date picker edge case** -- The commencement date picker pre-fills with the take-up deadline date, but submitting same-day initially triggered a validation error. On second attempt with day-1, it succeeded. The server-side validation (`gt`) is correct, so this may be a date picker component timezone edge case worth investigating.
