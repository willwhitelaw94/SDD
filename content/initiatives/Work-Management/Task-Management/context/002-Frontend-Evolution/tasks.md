---
title: "Tasks"
---


**Epic**: 002-TFE-Task-Frontend-Evolution
**Plan**: [plan.md](./plan.md)
**Created**: 2026-01-03
**Status**: In Progress

---

## Phase 1: Core Table Components (P1)

### TFE-001: Create TaskTableRow component
**Priority**: P1 | **Estimate**: M | **Status**: Pending

Create the base row component with inline edit capabilities.

**Acceptance Criteria**:
- [ ] Renders task data in cells (checkbox, title, priority, stage, assignee, due date)
- [ ] Checkbox for row selection
- [ ] Hover state shows quick actions
- [ ] Emits events: select, edit, delete

**Files**:
- `resources/js/Components/Tasks/TaskTableRow.vue` (CREATE)

---

### TFE-002: Create TaskTableGroup component
**Priority**: P1 | **Estimate**: S | **Status**: Pending

Collapsible group section with header and task count.

**Acceptance Criteria**:
- [ ] Clickable header toggles collapse/expand
- [ ] Shows group name and task count
- [ ] Smooth expand/collapse animation
- [ ] Slot for child rows

**Files**:
- `resources/js/Components/Tasks/TaskTableGroup.vue` (CREATE)

---

### TFE-003: Create useTaskGrouping composable
**Priority**: P1 | **Estimate**: S | **Status**: Pending

Client-side grouping logic for tasks.

**Acceptance Criteria**:
- [ ] Groups tasks by: stage, priority, assignee, due_date, or none
- [ ] Returns grouped structure with counts
- [ ] Handles empty groups (show "Unassigned" for null values)
- [ ] Reactive to groupBy changes

**Files**:
- `resources/js/composables/useTaskGrouping.ts` (CREATE)

---

### TFE-004: Create GroupBySelector component
**Priority**: P1 | **Estimate**: S | **Status**: Pending

Dropdown to select group-by field.

**Acceptance Criteria**:
- [ ] Options: None, Stage, Priority, Assignee, Due Date
- [ ] Shows current selection
- [ ] Emits update:groupBy event
- [ ] Uses CommonSelectMenu pattern

**Files**:
- `resources/js/Components/Tasks/GroupBySelector.vue` (CREATE)

---

### TFE-005: Create TaskTable component
**Priority**: P1 | **Estimate**: L | **Status**: Pending
**Depends On**: TFE-001, TFE-002, TFE-003, TFE-004

Main table container integrating all sub-components.

**Acceptance Criteria**:
- [ ] Renders TaskTableRow for each task (ungrouped) or TaskTableGroup with rows (grouped)
- [ ] Column headers with sort controls
- [ ] Loading state with skeleton rows
- [ ] Empty state with contextual message
- [ ] Integrates with useTaskGrouping

**Files**:
- `resources/js/Components/Tasks/TaskTable.vue` (CREATE)

---

## Phase 2: Inline Editing (P1)

### TFE-006: Create useInlineEdit composable
**Priority**: P1 | **Estimate**: M | **Status**: Pending

State management for inline editing with optimistic updates.

**Acceptance Criteria**:
- [ ] Tracks which cell is being edited (taskId, field)
- [ ] save() performs optimistic update then API call
- [ ] revert() restores previous value on error
- [ ] Handles concurrent edit prevention

**Files**:
- `resources/js/composables/useInlineEdit.ts` (CREATE)

---

### TFE-007: Create TaskInlineEdit component
**Priority**: P1 | **Estimate**: M | **Status**: Pending

Generic wrapper for inline editable cells.

**Acceptance Criteria**:
- [ ] Props: value, type (text, select, date), options (for select)
- [ ] Click to enter edit mode
- [ ] Enter/blur to save, Escape to cancel
- [ ] Shows spinner during save
- [ ] Emits: save, cancel

**Files**:
- `resources/js/Components/Tasks/TaskInlineEdit.vue` (CREATE)

---

### TFE-008: Add PATCH endpoint for quick task updates
**Priority**: P1 | **Estimate**: S | **Status**: Pending

API endpoint for single-field updates.

**Acceptance Criteria**:
- [ ] PATCH /api/tasks/{id} accepts partial updates
- [ ] Validates only provided fields
- [ ] Returns updated task
- [ ] Respects authorization (TaskPolicy)

**Files**:
- `routes/api.php` (MODIFY)
- `app/Http/Controllers/Api/TaskController.php` (MODIFY or CREATE)

---

### TFE-009: Integrate inline editing into TaskTableRow
**Priority**: P1 | **Estimate**: M | **Status**: Pending
**Depends On**: TFE-001, TFE-006, TFE-007, TFE-008

Wire up inline editing for title, priority, stage, assignee, due date.

**Acceptance Criteria**:
- [ ] Title cell uses TaskInlineEdit type="text"
- [ ] Priority cell uses TaskInlineEdit type="select" with priority options
- [ ] Stage cell uses TaskInlineEdit type="select" with stage options
- [ ] Assignee cell uses TaskInlineEdit type="select" with user options
- [ ] Due date cell uses TaskInlineEdit type="date"
- [ ] All edits call useInlineEdit.save()

**Files**:
- `resources/js/Components/Tasks/TaskTableRow.vue` (MODIFY)

---

## Phase 3: View Modes & Saved Views (P1)

### TFE-010: Create ViewModeToggle component
**Priority**: P1 | **Estimate**: S | **Status**: Pending

Toggle between Table, Kanban, and List views.

**Acceptance Criteria**:
- [ ] Three buttons/tabs: Table, Kanban, List
- [ ] Active state styling
- [ ] Emits update:viewMode event
- [ ] Uses CommonToggleGroup or similar pattern

**Files**:
- `resources/js/Components/Tasks/ViewModeToggle.vue` (CREATE)

---

### TFE-011: Create SavedViewsDropdown component
**Priority**: P1 | **Estimate**: M | **Status**: Pending

Dropdown for managing saved views.

**Acceptance Criteria**:
- [ ] Lists saved views for current user
- [ ] Select view → applies config
- [ ] "Save current view" option → name input → save
- [ ] "Update view" when current differs from saved
- [ ] Delete view with confirmation
- [ ] Shows "modified" indicator

**Files**:
- `resources/js/Components/Tasks/SavedViewsDropdown.vue` (CREATE)

---

### TFE-012: Extend useSavedViews for task-specific config
**Priority**: P1 | **Estimate**: S | **Status**: Pending

Add groupBy, viewMode, columns to saved view config.

**Acceptance Criteria**:
- [ ] TaskViewConfig interface includes: filters, sort, groupBy, viewMode, columns
- [ ] save() persists full config
- [ ] load() applies all settings
- [ ] Backward compatible with existing saved views

**Files**:
- `resources/js/composables/useSavedViews.ts` (MODIFY)

---

### TFE-013: Integrate view controls into Tasks/Index.vue
**Priority**: P1 | **Estimate**: L | **Status**: Pending
**Depends On**: TFE-005, TFE-010, TFE-011, TFE-012

Wire up TaskTable, ViewModeToggle, GroupBySelector, SavedViewsDropdown.

**Acceptance Criteria**:
- [ ] ViewModeToggle switches between TaskTable, KanbanBoard, and List
- [ ] GroupBySelector updates groupBy state
- [ ] SavedViewsDropdown loads/saves view configurations
- [ ] All state preserved when switching views
- [ ] Existing TaskFilterBar continues to work

**Files**:
- `resources/js/Pages/Tasks/Index.vue` (MODIFY)

---

## Phase 4: Keyboard Navigation (P2)

### TFE-014: Enhance useKeyboardShortcuts for task shortcuts
**Priority**: P2 | **Estimate**: M | **Status**: Pending

Add task-specific keyboard shortcuts.

**Acceptance Criteria**:
- [ ] C → opens create task modal
- [ ] E → opens edit for selected task
- [ ] A → opens assignee dropdown for selected task
- [ ] P → opens priority dropdown for selected task
- [ ] D → opens due date picker for selected task
- [ ] 1-5 → sets stage for selected task
- [ ] / → focuses search/filter
- [ ] ? → shows shortcuts overlay
- [ ] Arrow keys navigate table rows

**Files**:
- `resources/js/composables/useKeyboardShortcuts.ts` (MODIFY)

---

### TFE-015: Create KeyboardShortcutsOverlay component
**Priority**: P2 | **Estimate**: S | **Status**: Pending

Modal showing all available keyboard shortcuts.

**Acceptance Criteria**:
- [ ] Grouped by category (Navigation, Actions, Selection)
- [ ] Shows key combinations with descriptions
- [ ] Dismissible with Escape or click outside
- [ ] Accessible modal (focus trap)

**Files**:
- `resources/js/Components/Tasks/KeyboardShortcutsOverlay.vue` (CREATE)

---

### TFE-016: Add arrow key navigation to TaskTable
**Priority**: P2 | **Estimate**: M | **Status**: Pending
**Depends On**: TFE-005, TFE-014

Navigate between tasks using arrow keys.

**Acceptance Criteria**:
- [ ] ↑/↓ moves focus between rows
- [ ] Enter opens selected task
- [ ] Tab moves between cells in edit mode
- [ ] Focus ring visible on active row

**Files**:
- `resources/js/Components/Tasks/TaskTable.vue` (MODIFY)
- `resources/js/Components/Tasks/TaskTableRow.vue` (MODIFY)

---

## Phase 5: Bulk Operations (P2)

### TFE-017: Create BulkActionBar component
**Priority**: P2 | **Estimate**: M | **Status**: Pending

Fixed action bar for bulk operations on selected tasks.

**Acceptance Criteria**:
- [ ] Appears when 1+ tasks selected
- [ ] Shows selection count
- [ ] Actions: Set Priority, Set Stage, Assign, Delete
- [ ] Clear selection button
- [ ] Fixed position at bottom of viewport

**Files**:
- `resources/js/Components/Tasks/BulkActionBar.vue` (CREATE)

---

### TFE-018: Add bulk update API endpoint
**Priority**: P2 | **Estimate**: S | **Status**: Pending

API for updating multiple tasks at once.

**Acceptance Criteria**:
- [ ] PATCH /api/tasks/bulk accepts array of task IDs and update fields
- [ ] Validates all tasks exist and user has permission
- [ ] Returns count of updated tasks
- [ ] Atomic operation (all or nothing)

**Files**:
- `routes/api.php` (MODIFY)
- `app/Http/Controllers/Api/TaskController.php` (MODIFY)

---

### TFE-019: Enhance useTaskSelection for range selection
**Priority**: P2 | **Estimate**: S | **Status**: Pending

Add Shift+click range selection.

**Acceptance Criteria**:
- [ ] Shift+click selects range from last selected to clicked
- [ ] Cmd/Ctrl+A selects all visible tasks
- [ ] Escape clears selection
- [ ] Selection state available to BulkActionBar

**Files**:
- `resources/js/composables/useTaskSelection.ts` (MODIFY)

---

### TFE-020: Integrate bulk operations into Tasks/Index.vue
**Priority**: P2 | **Estimate**: M | **Status**: Pending
**Depends On**: TFE-017, TFE-018, TFE-019

Wire up BulkActionBar and selection state.

**Acceptance Criteria**:
- [ ] BulkActionBar appears when tasks selected
- [ ] Bulk actions call API and update table
- [ ] Success/error feedback via toast
- [ ] Selection clears after successful bulk action

**Files**:
- `resources/js/Pages/Tasks/Index.vue` (MODIFY)

---

## Phase 6: Polish & Testing

### TFE-021: Add loading and empty states
**Priority**: P2 | **Estimate**: S | **Status**: Pending

Skeleton loaders and contextual empty messages.

**Acceptance Criteria**:
- [ ] Loading: 5 skeleton rows with pulsing animation
- [ ] Empty (no tasks): "No tasks yet" with create button
- [ ] Empty (filtered): "No tasks match your filters" with clear button
- [ ] Empty (grouped): Groups with 0 tasks not shown (or collapsed)

**Files**:
- `resources/js/Components/Tasks/TaskTable.vue` (MODIFY)
- `resources/js/Components/Tasks/TaskTableGroup.vue` (MODIFY)

---

### TFE-022: Write feature tests for task CRUD
**Priority**: P2 | **Estimate**: M | **Status**: Pending

Test coverage for PATCH and bulk endpoints.

**Acceptance Criteria**:
- [ ] Test PATCH single field update
- [ ] Test bulk update with valid tasks
- [ ] Test bulk update with unauthorized task (should fail)
- [ ] Test bulk update with mixed permissions

**Files**:
- `tests/Feature/Api/TaskControllerTest.php` (CREATE or MODIFY)

---

### TFE-023: Write browser tests for inline editing
**Priority**: P2 | **Estimate**: M | **Status**: Pending

Dusk tests for inline edit flow.

**Acceptance Criteria**:
- [ ] Click cell → edit mode → type → blur → verify saved
- [ ] Click cell → edit mode → Escape → verify reverted
- [ ] Edit priority dropdown → select → verify saved
- [ ] Error case: verify revert and toast

**Files**:
- `tests/Browser/Tasks/InlineEditTest.php` (CREATE)

---

### TFE-024: Performance optimization for large task lists
**Priority**: P2 | **Estimate**: L | **Status**: Pending

Virtualization and deferred loading for 500+ tasks.

**Acceptance Criteria**:
- [ ] Virtual scrolling for lists > 100 tasks
- [ ] Deferred loading for collapsed groups
- [ ] Page load with 500 tasks < 2 seconds
- [ ] Smooth scrolling (no jank)

**Files**:
- `resources/js/Components/Tasks/TaskTable.vue` (MODIFY)

---

## Summary

| Phase | Tasks | Priority | Status |
|-------|-------|----------|--------|
| Phase 1: Core Components | TFE-001 to TFE-005 | P1 | Pending |
| Phase 2: Inline Editing | TFE-006 to TFE-009 | P1 | Pending |
| Phase 3: Views & Saved Views | TFE-010 to TFE-013 | P1 | Pending |
| Phase 4: Keyboard Navigation | TFE-014 to TFE-016 | P2 | Pending |
| Phase 5: Bulk Operations | TFE-017 to TFE-020 | P2 | Pending |
| Phase 6: Polish & Testing | TFE-021 to TFE-024 | P2 | Pending |

**Total Tasks**: 24
**P1 Tasks**: 13
**P2 Tasks**: 11
