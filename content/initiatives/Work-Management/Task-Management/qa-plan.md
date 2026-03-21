---
title: "QA Test Plan: Task Management MVP"
created: 2026-03-05
status: Draft
---

# QA Test Plan: Task Management MVP

**Epic**: TMN — Task Management [TP-2143]
**Spec**: [spec.md](spec.md)
**Branch**: `feature/tasks-mvp`

---

## Summary

| Metric | Count |
|--------|-------|
| **Total Test Cases** | 52 |
| **P1 (Critical)** | 22 |
| **P2 (Important)** | 22 |
| **P3 (Nice to have)** | 8 |
| **Browser Tests** | 44 |
| **Automated (Pest)** | 68 (already passing) |
| **Manual Tests** | 8 |

---

## Test Cases

### US1 — Table View & Grouping

#### TC-001: Task index page loads for authorized user

**AC Reference**: US1-AC1
**Priority**: P1
**Severity if fails**: Sev 1
**Method**: Browser

**Preconditions**:
- Logged in as admin user with `manage-tasks` permission
- At least 5 tasks exist in the system

**Steps**:
1. Navigate to `/tasks`
2. Wait for page to fully load
3. Verify the task table renders with rows

**Expected Result**:
- Tasks table is visible with sortable columns (Title, Stage, Priority, Due Date, Assigned)
- Filter bar is visible above the table
- View mode toggle (Table/Kanban) is visible

**Edge Cases**:
- User without `manage-tasks` permission gets 403

---

#### TC-002: Group tasks by Priority

**AC Reference**: US1-AC2
**Priority**: P1
**Severity if fails**: Sev 2
**Method**: Browser

**Preconditions**:
- At least 3 tasks with different priorities (Low, Medium, High)

**Steps**:
1. Navigate to `/tasks`
2. Locate the "Group by" selector
3. Select "Priority"
4. Verify tasks reorganize into priority groups

**Expected Result**:
- Tasks grouped under headers: Urgent, High, Medium, Low (and No Priority if applicable)
- Each group header shows task count
- Groups are collapsible

**Edge Cases**:
- Tasks with no priority appear under a "No Priority" group at the end

---

#### TC-003: Collapse and expand groups

**AC Reference**: US1-AC3
**Priority**: P2
**Severity if fails**: Sev 3
**Method**: Browser

**Preconditions**:
- Tasks are grouped by any field

**Steps**:
1. Click a group header
2. Verify the group collapses (tasks hidden)
3. Click the same header again
4. Verify the group expands (tasks visible)

**Expected Result**:
- Group toggles between collapsed/expanded on click
- Collapsed group shows count but hides task rows
- Other groups are unaffected

---

#### TC-004: Switch grouping without page reload

**AC Reference**: US1-AC4
**Priority**: P2
**Severity if fails**: Sev 3
**Method**: Browser

**Preconditions**:
- Tasks grouped by "Priority"

**Steps**:
1. Change grouping from "Priority" to "Stage"
2. Observe the transition

**Expected Result**:
- Tasks reorganize into stage groups (Not Started, In Progress, On Hold, Approved, Completed)
- No full page reload occurs
- URL may update query params but page remains intact

---

#### TC-005: Filters update grouped view and hide empty groups

**AC Reference**: US1-AC5
**Priority**: P2
**Severity if fails**: Sev 3
**Method**: Browser

**Preconditions**:
- Tasks grouped by Priority
- At least one priority group has no tasks matching a specific filter

**Steps**:
1. Group tasks by Priority
2. Apply a filter (e.g., Stage = "In Progress")
3. Verify groups update

**Expected Result**:
- Only tasks matching the filter show within groups
- Groups with zero matching tasks are hidden
- Group counts update to reflect filtered results

---

#### TC-006: Column header sorting

**AC Reference**: US1-AC8
**Priority**: P1
**Severity if fails**: Sev 2
**Method**: Browser

**Preconditions**:
- Multiple tasks with different titles, dates, priorities

**Steps**:
1. Click the "Title" column header
2. Verify tasks sort alphabetically ascending
3. Click the "Title" header again
4. Verify tasks sort descending

**Expected Result**:
- Column header click toggles between ascending/descending sort
- Visual indicator shows current sort direction
- Sort applies within groups if grouped

---

### US2 — Kanban Board

#### TC-007: Switch to Kanban view

**AC Reference**: US2-AC1
**Priority**: P1
**Severity if fails**: Sev 1
**Method**: Browser

**Preconditions**:
- Tasks exist across multiple stages

**Steps**:
1. Navigate to `/tasks`
2. Click the "Kanban" view toggle
3. Verify Kanban board renders

**Expected Result**:
- Columns appear for each stage: Not Started, In Progress, On Hold, Approved, Completed
- Each column header shows stage name and task count
- Tasks appear as cards in the correct columns

---

#### TC-008: Drag task card between Kanban columns

**AC Reference**: US2-AC2
**Priority**: P1
**Severity if fails**: Sev 1
**Method**: Browser

**Preconditions**:
- At least one task in "Not Started" column

**Steps**:
1. Switch to Kanban view
2. Drag a task card from "Not Started" to "In Progress"
3. Release the card

**Expected Result**:
- Card moves to "In Progress" column
- Stage updates immediately (optimistic)
- Column counts update
- Switching to Table view shows the task with updated stage
- Activity log records "Stage changed from Not Started to In Progress"

**Edge Cases**:
- Drag cancelled (drop back to original column) — no update occurs

---

#### TC-009: Task card displays correct information

**AC Reference**: US2-AC3
**Priority**: P2
**Severity if fails**: Sev 3
**Method**: Browser

**Preconditions**:
- Task with title, priority, due date, assignee, and subtasks

**Steps**:
1. View the task card in Kanban
2. Verify all information is displayed

**Expected Result**:
- Title visible
- Priority badge with correct color
- Due date shown
- Assignee avatar visible
- Subtask progress (e.g., "2/4") shown if subtasks exist

---

#### TC-010: Overdue task card styling

**AC Reference**: US2-AC4
**Priority**: P2
**Severity if fails**: Sev 4
**Method**: Browser

**Preconditions**:
- Task with due date in the past

**Steps**:
1. View Kanban board
2. Locate the overdue task card

**Expected Result**:
- Card has a red left border
- Due date text shows red styling

---

#### TC-011: Filter preservation between Table and Kanban

**AC Reference**: US2-AC5
**Priority**: P2
**Severity if fails**: Sev 3
**Method**: Browser

**Preconditions**:
- Active filter applied (e.g., Priority = High)

**Steps**:
1. Apply a filter in Table view
2. Switch to Kanban view
3. Verify filters are preserved
4. Switch back to Table view
5. Verify filters still applied

**Expected Result**:
- Filters persist across view mode switches
- Both views show the same filtered result set

---

### US3 — Create and Edit Tasks via Global Modal

#### TC-012: Create task via New Task button

**AC Reference**: US3-AC1, US3-AC2
**Priority**: P1
**Severity if fails**: Sev 1
**Method**: Browser

**Preconditions**:
- Logged in as admin with `manage-tasks`

**Steps**:
1. Click the "New Task" button (or press `C`)
2. Verify the global task modal opens
3. Fill in title: "Test Task Creation"
4. Set priority to "High"
5. Set stage to "Not Started"
6. Click "Create Task" / Save

**Expected Result**:
- Modal opens with TaskForm
- Task is created successfully
- Success toast appears
- Task appears in the table/Kanban immediately
- Task has correct title, priority, and stage

**Test Data**:
- Title: "Test Task Creation"
- Priority: High
- Stage: Not Started

---

#### TC-013: Validation error on empty title

**AC Reference**: US3-AC4
**Priority**: P1
**Severity if fails**: Sev 2
**Method**: Browser

**Preconditions**:
- Task creation modal is open

**Steps**:
1. Leave the title field empty
2. Click Save/Create

**Expected Result**:
- Validation error displays near the title field
- Task is NOT created
- Modal stays open

---

#### TC-014: Edit existing task via modal

**AC Reference**: US3-AC5
**Priority**: P1
**Severity if fails**: Sev 1
**Method**: Browser

**Preconditions**:
- At least one task exists

**Steps**:
1. Click a task row in the table (or card in Kanban)
2. Verify the modal opens with task data populated
3. Change the title to "Updated Task Title"
4. Save

**Expected Result**:
- Modal opens with all current field values populated
- Title updates to "Updated Task Title"
- Success toast appears
- Table/Kanban reflects the change immediately

---

### US4 — Inline Edit Task Fields

#### TC-015: Inline edit priority via dropdown

**AC Reference**: US4-AC2
**Priority**: P1
**Severity if fails**: Sev 2
**Method**: Browser

**Preconditions**:
- Task exists in table view

**Steps**:
1. Click the priority badge on a task row
2. Verify a dropdown appears with priority options
3. Select "Urgent"
4. Verify the dropdown closes

**Expected Result**:
- Priority updates to "Urgent" immediately
- Badge color changes to red
- No page reload
- Save happens automatically on selection

---

#### TC-016: Inline edit stage via dropdown

**AC Reference**: US4-AC3
**Priority**: P1
**Severity if fails**: Sev 2
**Method**: Browser

**Preconditions**:
- Task with stage "Not Started"

**Steps**:
1. Click the stage badge
2. Select "In Progress" from dropdown
3. Verify update

**Expected Result**:
- Stage updates to "In Progress" immediately
- Badge color changes
- Activity log records "Stage changed"

---

#### TC-017: Inline edit cancel on Escape

**AC Reference**: US4-AC8
**Priority**: P2
**Severity if fails**: Sev 3
**Method**: Browser

**Preconditions**:
- Inline editing is active on a title cell

**Steps**:
1. Click a task title to enter edit mode
2. Change the text
3. Press Escape

**Expected Result**:
- Edit mode cancels
- Title reverts to original value
- No save request is made

---

### US5 — Keyboard Shortcuts

#### TC-018: Create task via `C` key

**AC Reference**: US5-AC2
**Priority**: P1
**Severity if fails**: Sev 2
**Method**: Browser

**Preconditions**:
- On Tasks page, no input focused

**Steps**:
1. Press `C` key
2. Verify the new task modal opens

**Expected Result**:
- Task creation modal opens
- Focus moves to the title field

**Edge Cases**:
- `C` should NOT trigger when typing in an input/textarea field

---

#### TC-019: Navigate tasks with `j`/`k` keys

**AC Reference**: US5 (navigation)
**Priority**: P2
**Severity if fails**: Sev 3
**Method**: Browser

**Preconditions**:
- Multiple tasks in table view

**Steps**:
1. Press `j` to move focus down
2. Press `k` to move focus up
3. Verify the focused row changes

**Expected Result**:
- `j` moves to the next task row
- `k` moves to the previous task row
- Focused row has visual highlight

---

#### TC-020: Show keyboard shortcuts overlay with `?`

**AC Reference**: US5-AC5
**Priority**: P2
**Severity if fails**: Sev 3
**Method**: Browser

**Preconditions**:
- On Tasks page

**Steps**:
1. Press `?`
2. Verify shortcuts overlay appears
3. Press Escape to close

**Expected Result**:
- Overlay shows all available shortcuts grouped by category
- Escape closes the overlay

---

#### TC-021: Focus search with `/` key

**AC Reference**: US5-AC4
**Priority**: P2
**Severity if fails**: Sev 3
**Method**: Browser

**Steps**:
1. Press `/`
2. Verify search/filter input is focused

**Expected Result**:
- Search input receives focus
- User can start typing to filter

---

#### TC-022: Select task with `x` key

**AC Reference**: US5 (selection)
**Priority**: P2
**Severity if fails**: Sev 3
**Method**: Browser

**Preconditions**:
- A task row is focused via j/k navigation

**Steps**:
1. Focus a task with `j`/`k`
2. Press `x` to toggle selection
3. Verify task is selected (checkbox checked)

**Expected Result**:
- Task row gets selected/deselected on `x` press
- Bulk action bar appears when at least one task is selected

---

### US6 — Subtasks

#### TC-023: Create a subtask

**AC Reference**: US6-AC1
**Priority**: P1
**Severity if fails**: Sev 2
**Method**: Browser

**Preconditions**:
- An existing parent task

**Steps**:
1. Open the parent task modal
2. Locate the subtask section
3. Click "Add Subtask"
4. Enter subtask title
5. Save

**Expected Result**:
- Subtask is created and linked to parent
- Subtask appears in the subtask list
- Parent task shows subtask progress (e.g., "0/1")

---

#### TC-024: Subtask progress indicator

**AC Reference**: US6-AC2
**Priority**: P2
**Severity if fails**: Sev 3
**Method**: Browser

**Preconditions**:
- Task with 3 subtasks, 1 completed

**Steps**:
1. View the parent task in table/Kanban
2. Check the subtask progress indicator

**Expected Result**:
- Shows "1/3 complete" or similar progress format
- Progress updates when subtasks are completed

---

### US7 — Comments & Activity

#### TC-025: Add a comment to a task

**AC Reference**: US7-AC1
**Priority**: P1
**Severity if fails**: Sev 2
**Method**: Browser

**Preconditions**:
- Viewing a task in the modal

**Steps**:
1. Open a task modal
2. Locate the activity/comments section
3. Type "This is a test comment"
4. Submit the comment

**Expected Result**:
- Comment appears in the activity feed
- Comment shows the current user's name and timestamp
- Success feedback shown

---

#### TC-026: Activity log records stage changes

**AC Reference**: US7-AC3
**Priority**: P2
**Severity if fails**: Sev 3
**Method**: Browser

**Preconditions**:
- Task exists

**Steps**:
1. Change a task's stage (inline or via modal)
2. Open the task modal
3. View the activity feed

**Expected Result**:
- Activity entry shows "Stage changed from X to Y"
- Entry includes timestamp and user who made the change

---

#### TC-027: Activity feed shows comments and automated activity

**AC Reference**: US7-AC4
**Priority**: P2
**Severity if fails**: Sev 3
**Method**: Browser

**Preconditions**:
- Task with both comments and stage/priority changes

**Steps**:
1. Open task modal
2. Scroll through activity feed

**Expected Result**:
- Comments and automated activity (stage changes, assignments, edits) appear in chronological order
- Each entry has type indicator, timestamp, and user

---

### US8 — Bulk Operations

#### TC-028: Select multiple tasks via checkboxes

**AC Reference**: US8-AC1
**Priority**: P1
**Severity if fails**: Sev 2
**Method**: Browser

**Preconditions**:
- At least 3 tasks in table view

**Steps**:
1. Click checkbox on Task 1
2. Click checkbox on Task 2
3. Verify bulk action bar appears

**Expected Result**:
- Both tasks are selected (checkbox checked)
- Bulk action bar shows at the bottom: "2 selected" with stage, priority, assignee dropdowns
- Clear selection button (X) visible

---

#### TC-029: Shift+click range selection

**AC Reference**: US8-AC2
**Priority**: P1
**Severity if fails**: Sev 2
**Method**: Browser

**Preconditions**:
- At least 5 tasks visible in table

**Steps**:
1. Click checkbox on Task 1
2. Hold Shift and click checkbox on Task 5
3. Verify tasks 1-5 are all selected

**Expected Result**:
- All tasks between Task 1 and Task 5 (inclusive) are selected
- Bulk action bar shows "5 selected"

---

#### TC-030: Clear selection with Escape

**AC Reference**: US8-AC3
**Priority**: P2
**Severity if fails**: Sev 3
**Method**: Browser

**Preconditions**:
- Multiple tasks selected

**Steps**:
1. Select 3 tasks
2. Press Escape

**Expected Result**:
- All selections cleared
- Bulk action bar disappears
- All checkboxes unchecked

---

#### TC-031: Bulk stage change

**AC Reference**: US8-AC4
**Priority**: P1
**Severity if fails**: Sev 2
**Method**: Browser

**Preconditions**:
- 3 tasks selected, all in "Not Started"

**Steps**:
1. Select 3 tasks
2. In bulk action bar, click "Set Stage"
3. Select "In Progress"

**Expected Result**:
- All 3 tasks update to "In Progress"
- Table reflects changes immediately
- Success message/toast shown
- Activity log records change for each task

---

#### TC-032: Bulk priority change

**AC Reference**: US8-AC1 (bulk priority)
**Priority**: P1
**Severity if fails**: Sev 2
**Method**: Browser

**Preconditions**:
- 2 tasks selected with "Low" priority

**Steps**:
1. Select 2 tasks
2. In bulk action bar, click "Set Priority"
3. Select "Urgent"

**Expected Result**:
- Both tasks update to "Urgent" priority
- Priority badges change to red
- Success message shown

---

### US9 — Link Tasks to Business Objects

#### TC-033: Task linkable creation via API

**AC Reference**: US9-AC1
**Priority**: P1
**Severity if fails**: Sev 2
**Method**: Browser / API

**Preconditions**:
- Task exists
- A business object (package/risk) exists

**Steps**:
1. Create a task linked to a business object via the store endpoint
2. Verify the link is stored

**Expected Result**:
- TaskLinkable record created in database
- Task shows linked object information

**Test Data**:
- linkable_type: "Package"
- linkable_id: (valid ID)

---

#### TC-034: Task linkable deletion

**AC Reference**: US9 (unlinking)
**Priority**: P2
**Severity if fails**: Sev 3
**Method**: Browser / API

**Preconditions**:
- Task with an existing linkable

**Steps**:
1. Delete the linkable via the destroy endpoint
2. Verify link is removed

**Expected Result**:
- TaskLinkable record removed
- Task no longer shows the linked object

---

### US10 — Task Templates

#### TC-035: Admin creates a template

**AC Reference**: US10-AC1
**Priority**: P1
**Severity if fails**: Sev 2
**Method**: Browser

**Preconditions**:
- Logged in as admin with `manage-tasks`

**Steps**:
1. Navigate to `/tasks/templates`
2. Click "Create Template"
3. Fill in: Name = "Onboarding Checklist", Title = "Client Onboarding", Priority = High
4. Add checklist items: "Welcome call", "Setup profile"
5. Save

**Expected Result**:
- Template created and appears in the templates list
- Template shows name, title, priority, and checklist item count
- Success message shown

**Test Data**:
- Name: "Onboarding Checklist"
- Title: "Client Onboarding"
- Priority: High
- Checklist: ["Welcome call", "Setup profile"]

---

#### TC-036: Update an existing template

**AC Reference**: US10 (update)
**Priority**: P2
**Severity if fails**: Sev 3
**Method**: Browser

**Preconditions**:
- Template exists

**Steps**:
1. Navigate to templates page
2. Edit an existing template
3. Change the name
4. Save

**Expected Result**:
- Template name updates
- Success message shown

---

#### TC-037: Delete a template

**AC Reference**: US10 (delete)
**Priority**: P2
**Severity if fails**: Sev 3
**Method**: Browser

**Preconditions**:
- Template exists

**Steps**:
1. Navigate to templates page
2. Delete a template
3. Confirm deletion

**Expected Result**:
- Template removed from list
- Database record deleted
- Success message shown

---

#### TC-038: Prevent unauthorized template access

**AC Reference**: US10 (authorization)
**Priority**: P1
**Severity if fails**: Sev 1
**Method**: Browser

**Preconditions**:
- Logged in as user WITHOUT `manage-tasks` permission

**Steps**:
1. Attempt to navigate to `/tasks/templates`

**Expected Result**:
- 403 Forbidden response

---

### US11 — Due Date Visual Indicators

#### TC-039: Overdue task styling in table

**AC Reference**: US11-AC2
**Priority**: P2
**Severity if fails**: Sev 4
**Method**: Browser

**Preconditions**:
- Task with due date set to yesterday

**Steps**:
1. View task in table
2. Check due date cell styling

**Expected Result**:
- Due date text has red styling
- Visual indicator (e.g., red text, red badge) clearly shows overdue status

---

#### TC-040: Due-soon task styling

**AC Reference**: US11-AC3
**Priority**: P3
**Severity if fails**: Sev 4
**Method**: Browser

**Preconditions**:
- Task with due date set to today or tomorrow

**Steps**:
1. View task in table/Kanban
2. Check due date styling

**Expected Result**:
- Due date has amber/warning styling

---

### Cross-Cutting Tests

#### TC-041: Unauthorized user cannot access tasks index

**AC Reference**: Authorization
**Priority**: P1
**Severity if fails**: Sev 1
**Method**: Browser

**Preconditions**:
- Logged in as user without `manage-tasks` permission

**Steps**:
1. Navigate to `/tasks`

**Expected Result**:
- 403 Forbidden response

---

#### TC-042: Task soft delete

**AC Reference**: Delete functionality
**Priority**: P1
**Severity if fails**: Sev 2
**Method**: Browser

**Preconditions**:
- Task exists

**Steps**:
1. Open task modal
2. Click Delete
3. Confirm deletion

**Expected Result**:
- Task removed from table/Kanban
- Task is soft-deleted (still in DB with `deleted_at` set)
- Assigned users and linkables are detached
- Activity log records "Task deleted"

---

#### TC-043: Recurring task duplication on completion

**AC Reference**: Recurring task behavior
**Priority**: P1
**Severity if fails**: Sev 2
**Method**: Browser

**Preconditions**:
- Task with `is_recurring = true` and `recurring_days = 7`
- Task in "In Progress" stage

**Steps**:
1. Change the task stage to "Completed"
2. Check for a new duplicate task

**Expected Result**:
- Original task is marked Completed
- A new task is created with the same title and fields
- New task has stage "Not Started"
- New task due date is offset by recurring_days (7 days from original)

---

#### TC-044: Empty state — no tasks

**AC Reference**: Edge Cases
**Priority**: P3
**Severity if fails**: Sev 4
**Method**: Browser

**Preconditions**:
- No tasks exist for the current user/scope

**Steps**:
1. Navigate to `/tasks`
2. Verify empty state

**Expected Result**:
- "No tasks yet" message with illustration
- "New Task" CTA button visible and functional

---

#### TC-045: Empty state — no filter results

**AC Reference**: Edge Cases
**Priority**: P3
**Severity if fails**: Sev 4
**Method**: Browser

**Preconditions**:
- Tasks exist but no tasks match current filter

**Steps**:
1. Apply a filter that matches no tasks
2. Verify empty state

**Expected Result**:
- "No tasks match your filters" message
- "Clear filters" button visible and functional

---

#### TC-046: Comment soft delete

**AC Reference**: Comment deletion
**Priority**: P2
**Severity if fails**: Sev 3
**Method**: Browser

**Preconditions**:
- Task with a comment

**Steps**:
1. Open task with comments
2. Delete a comment
3. Verify removal

**Expected Result**:
- Comment removed from activity feed
- Comment is soft-deleted in database
- Activity log records "Comment deleted"

---

#### TC-047: Long task title truncation

**AC Reference**: Edge Cases
**Priority**: P3
**Severity if fails**: Sev 5
**Method**: Browser

**Preconditions**:
- Task with a very long title (100+ characters)

**Steps**:
1. View task in table row
2. View task in Kanban card

**Expected Result**:
- Title truncated with ellipsis in table
- Full title visible on hover (tooltip)
- Kanban card title wraps or truncates gracefully

---

#### TC-048: Task creation from Kanban view

**AC Reference**: US3-AC1 (create from any context)
**Priority**: P2
**Severity if fails**: Sev 3
**Method**: Browser

**Steps**:
1. Switch to Kanban view
2. Click "New Task" button (or press `C`)
3. Create a task with stage "In Progress"
4. Save

**Expected Result**:
- Task appears in the "In Progress" Kanban column
- Task also visible in Table view

---

#### TC-049: Inline edit saves on blur/click outside

**AC Reference**: US4-AC9
**Priority**: P2
**Severity if fails**: Sev 3
**Method**: Browser

**Steps**:
1. Click a title cell to enter inline edit
2. Type a new title
3. Click outside the cell (blur)

**Expected Result**:
- Changes save automatically
- Title updates to new value
- No explicit save button needed

---

#### TC-050: Template validation — name and title required

**AC Reference**: Template validation
**Priority**: P2
**Severity if fails**: Sev 3
**Method**: Browser

**Steps**:
1. Navigate to templates page
2. Try to create a template with empty name and title
3. Submit

**Expected Result**:
- Validation errors shown for both name and title
- Template NOT created

---

#### TC-051: Bulk assign users

**AC Reference**: US8-AC1 (bulk assignment)
**Priority**: P2
**Severity if fails**: Sev 3
**Method**: Browser

**Preconditions**:
- 2 tasks selected
- Another admin user exists

**Steps**:
1. Select 2 tasks
2. In bulk action bar, click "Assign"
3. Select a user

**Expected Result**:
- Both tasks now have the selected user assigned
- Table reflects updated assignees

---

#### TC-052: Task comments authorization

**AC Reference**: Comment authorization
**Priority**: P1
**Severity if fails**: Sev 1
**Method**: Browser

**Preconditions**:
- User without `manage-tasks` permission

**Steps**:
1. Attempt to POST a comment via API to a task

**Expected Result**:
- 403 Forbidden response

---

## Responsive Testing

| Breakpoint | Resolution | Key Pages to Test |
|------------|-----------|-------------------|
| Desktop | 1920x1080 | Tasks index (table + kanban), Templates, Task modal |
| Tablet | 768x1024 | Tasks index (table only), Task modal |
| Mobile | 375x812 | Tasks index (simplified table), Task modal |

### Responsive-Specific Tests

| ID | Test | Breakpoint | Expected |
|----|------|-----------|----------|
| R-01 | Table columns reduce on mobile | Mobile | Title + Stage only, tap row opens modal |
| R-02 | Kanban hidden on mobile/tablet | <1024px | View toggle shows Table only |
| R-03 | Task modal is full-screen on mobile | Mobile | Modal takes full viewport width |
| R-04 | Bulk action bar stacks on mobile | Mobile | Buttons stack or scroll horizontally |

---

## Accessibility Checklist

- [ ] Form fields have visible labels (TaskForm title, description, etc.)
- [ ] All icon-only buttons have `aria-label` (view toggle, bulk actions)
- [ ] Priority and stage badges have accessible text (not color-only)
- [ ] Table has proper `<th>` headers for screen readers
- [ ] Focus indicator visible on all interactive elements
- [ ] Modal focus trap works (Tab stays within modal)
- [ ] Focus returns to trigger element on modal close
- [ ] Keyboard navigation (j/k/x) announced to screen readers
- [ ] Colour contrast meets WCAG AA (4.5:1 for text)
- [ ] `prefers-reduced-motion` respected for confetti animation
- [ ] Kanban column headers are `role="heading"` or semantic equivalent
- [ ] Drag-and-drop has keyboard alternative (stage dropdown on card)

---

## E2E Test Specifications

Playwright E2E tests to be created by `/trilogy-qa-test-codify` after test execution passes.

### Page Objects Needed

| Page Object | File | Covers |
|-------------|------|--------|
| `TasksIndex` | `e2e/pages/tasks-index.page.ts` | Tasks index page (table + kanban views) |
| `TaskModal` | `e2e/pages/task-modal.page.ts` | Task create/edit modal |
| `TemplatesPage` | `e2e/pages/templates.page.ts` | Templates CRUD page |

### Test Specs to Create

| Spec File | Test Cases | Priority |
|-----------|-----------|----------|
| `e2e/tests/tasks/task-crud.spec.ts` | TC-012, TC-013, TC-014, TC-042 | P1 |
| `e2e/tests/tasks/table-view.spec.ts` | TC-001, TC-002, TC-006, TC-015, TC-016 | P1 |
| `e2e/tests/tasks/kanban.spec.ts` | TC-007, TC-008, TC-009, TC-010, TC-011 | P1 |
| `e2e/tests/tasks/bulk-operations.spec.ts` | TC-028, TC-029, TC-030, TC-031, TC-032 | P1 |
| `e2e/tests/tasks/keyboard.spec.ts` | TC-018, TC-019, TC-020, TC-021, TC-022 | P2 |
| `e2e/tests/tasks/subtasks-comments.spec.ts` | TC-023, TC-024, TC-025, TC-026, TC-027 | P2 |
| `e2e/tests/tasks/templates.spec.ts` | TC-035, TC-036, TC-037, TC-038, TC-050 | P2 |
| `e2e/tests/tasks/authorization.spec.ts` | TC-041, TC-052 | P1 |

### Key Locators

| Element | Selector Strategy | Notes |
|---------|------------------|-------|
| New Task button | `getByRole('button', { name: /new task/i })` | Header area |
| View toggle (Table) | `getByRole('button', { name: /table/i })` | ViewModeToggle |
| View toggle (Kanban) | `getByRole('button', { name: /kanban/i })` | ViewModeToggle |
| Group by selector | `getByRole('combobox', { name: /group/i })` | GroupBySelector |
| Task row checkbox | `getByRole('checkbox')` within table row | Per-row |
| Bulk action bar | `getByTestId('bulk-action-bar')` | Fixed bottom bar |
| Stage dropdown (inline) | `getByRole('combobox')` within stage cell | Inline edit |
| Priority dropdown (inline) | `getByRole('combobox')` within priority cell | Inline edit |
| Task modal | `getByRole('dialog')` | CommonModalContainer |
| Template form name | `getByRole('textbox', { name: /name/i })` | Templates page |
| Kanban column | `getByTestId('kanban-column-*')` | Per stage |
| Shortcuts overlay | `getByRole('dialog', { name: /shortcuts/i })` | KeyboardShortcutsOverlay |

### Test Data Dependencies

| Test | Seeded Data Needed | Factory/Seeder |
|------|-------------------|----------------|
| TC-001 to TC-006 | 5+ tasks with varied priorities/stages | `Task::factory()->count(5)` |
| TC-008 | 1 task in "Not Started" | `Task::factory()->create(['task_stage' => 'NOT_STARTED'])` |
| TC-023, TC-024 | Parent task + 3 subtasks | `Task::factory()` with `parent_id` |
| TC-025, TC-026 | Task with existing comments | `TaskComment::create(...)` |
| TC-029 | 5+ consecutive tasks | `Task::factory()->count(5)` |
| TC-035 | Admin user with `manage-tasks` | `User::factory()->asAdmin()` + permission |
| TC-043 | Recurring task (is_recurring=true, recurring_days=7) | `Task::factory()->create(['is_recurring' => true, 'recurring_days' => 7])` |

---

## Quality Checks

- [ ] No console errors on Tasks index page
- [ ] No console errors on Templates page
- [ ] No console warnings related to task components
- [ ] No 404 network requests on task pages
- [ ] No requests > 3s on initial page load
- [ ] No requests > 1s on inline saves
- [ ] Kanban drag-and-drop completes < 1s
- [ ] Task creation modal loads < 500ms

---

## Test Data Requirements

| Data | Needed For | How to Set Up |
|------|-----------|---------------|
| Admin user with `manage-tasks` | All tests | `User::factory()->asAdmin()` + `givePermissionTo('manage-tasks')` |
| User without `manage-tasks` | TC-041, TC-038, TC-052 | `User::factory()->hasRole('Care Partner')` |
| 5+ tasks with varied stages/priorities | TC-001 through TC-032 | `Task::factory()->count(5)` with state overrides |
| Task with past due date | TC-010, TC-039 | `Task::factory()->create(['due_at' => now()->subDay()])` |
| Task with due date today | TC-040 | `Task::factory()->create(['due_at' => now()])` |
| Recurring task | TC-043 | `Task::factory()->create(['is_recurring' => true, 'recurring_days' => 7])` |
| Task with subtasks | TC-023, TC-024 | Parent task + child tasks with `parent_id` |
| Task template | TC-036, TC-037 | `TaskTemplate::create([...])` |

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
