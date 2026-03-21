---
title: "Plan"
---


**Epic**: 002-TFE-Task-Frontend-Evolution
**Spec**: [spec.md](./spec.md)
**Design**: [design.md](./design.md)
**Created**: 2026-01-03
**Status**: Ready for Implementation

---

## Summary

Evolve the Tasks page from a basic table to a modern, Asana/Linear-inspired task management interface with inline editing, group-by functionality, saved views, keyboard navigation, and bulk operations.

---

## Technical Context

**Language/Version**: PHP 8.4, TypeScript 5.x
**Framework**: Laravel 12 + Vue 3 + Inertia.js v2
**Primary Dependencies**: Tailwind CSS v3, Headless UI, vuedraggable
**Storage**: MySQL (tasks, saved_views tables)
**Testing**: Pest v3 (unit/feature), Dusk v8 (browser)
**Target Platform**: Web (Desktop-first, responsive)
**Performance Goals**:
- Page load with 500 tasks < 2 seconds
- Inline edit save < 500ms (optimistic)
- View switch < 300ms
**Constraints**:
- Must integrate with existing TaskFilterBar
- Must preserve existing Kanban view
- Accessible (WCAG 2.1 AA)

---

## Constitution Check

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Majestic Monolith | ✅ Pass | All code in single app |
| II. Domain-Driven Design | ✅ Pass | Components in existing Tasks domain |
| III. Convention Over Configuration | ✅ Pass | Following Vue/Inertia patterns |
| IV. Code Quality Standards | ✅ Pass | TypeScript, type hints throughout |
| V. Testing is First-Class | ✅ Plan | Feature tests for each user story |
| X. Inertia + Vue 3 + TypeScript | ✅ Pass | Using useForm, composition API |
| XI. Component Library & Tailwind | ✅ Pass | Reusing CommonCheckbox, CommonBadge, etc. |
| XII. Design System | ✅ Pass | Keyboard nav, accessible focus states |

---

## Project Structure

### Documentation (this feature)

```text
.claude/INITIATIVES/WM-work-management/002-TFE-Task-Frontend-Evolution/
├── idea.md              # Epic brief
├── spec.md              # Feature specification
├── design.md       # UX/UI decisions
├── plan.md              # This file
├── tasks.md             # Task breakdown (next)
└── mockups/             # ASCII wireframes
    ├── 01-main-tasks-page.txt
    ├── 02-inline-editing.txt
    ├── 03-group-by-selector.txt
    ├── 04-view-mode-toggle.txt
    ├── 05-saved-views.txt
    └── 06-keyboard-shortcuts.txt
```

### Source Code

```text
resources/js/
├── Pages/Tasks/
│   └── Index.vue                    # Main tasks page (MODIFY)
├── Components/Tasks/
│   ├── TaskTable.vue                # NEW: Main table with grouping
│   ├── TaskTableGroup.vue           # NEW: Collapsible group section
│   ├── TaskTableRow.vue             # NEW: Single row with inline edit
│   ├── TaskInlineEdit.vue           # NEW: Inline edit cell wrapper
│   ├── GroupBySelector.vue          # NEW: Group by dropdown
│   ├── ViewModeToggle.vue           # NEW: Table/Kanban/List toggle
│   ├── SavedViewsDropdown.vue       # NEW: View management dropdown
│   ├── KeyboardShortcutsOverlay.vue # NEW: Shortcuts help modal
│   ├── BulkActionBar.vue            # NEW: Multi-select action bar
│   ├── TaskFilterBar.vue            # EXISTING: Inline filters
│   └── KanbanBoard.vue              # EXISTING: Kanban view
└── composables/
    ├── useSavedViews.ts             # EXISTING: Saved views logic
    ├── useKeyboardShortcuts.ts      # EXISTING: Keyboard shortcuts
    ├── useTaskSelection.ts          # EXISTING: Selection state
    ├── useTaskGrouping.ts           # NEW: Group by logic
    └── useInlineEdit.ts             # NEW: Inline edit state
```

---

## Design Decisions

### 1. TaskTable vs CommonTable

**Decision**: Build new `TaskTable.vue` component

**Rationale**:
- CommonTable uses server-side Table<T> pattern; Tasks use client-side axios
- Tasks need inline cell editing (CommonTable has none)
- Tasks need collapsible groups (CommonTable has none)
- Tasks need drag-drop rows (CommonTable has none)

**Trade-off**: Some code duplication, but cleaner architecture and faster iteration.

### 2. Group By Visual Pattern

**Decision**: Collapsible sections (Asana-style)

**Rationale**:
- Vertical sections work better than horizontal swimlanes for 100+ tasks
- Collapse/expand allows focus on relevant groups
- Task counts provide quick overview

### 3. Inline Editing Approach

**Decision**: Click-to-edit with optimistic updates

**Pattern**:
1. User clicks cell → becomes editable
2. User changes value → immediate visual update
3. Save request fires → spinner in cell
4. Success → done, Error → revert + toast

### 4. Saved Views Architecture

**Decision**: Extend existing `useSavedViews` composable

**Saveable Settings**:
- Filters (priority, stage, assignee, tags, dueSoon, assignedToMe)
- Sort (field, direction)
- Group by (none, stage, priority, assignee, due_date)
- View mode (table, kanban, list)
- Visible columns (array of column keys)

---

## Implementation Phases

### Phase 1: Core Table Components (P1)

1. **TaskTable.vue** - Main table container
   - Props: tasks, columns, groupBy, sortBy, sortDir
   - Slots: loading, empty, row actions
   - Events: sort, row-click, row-select

2. **TaskTableRow.vue** - Single task row
   - Checkbox for selection
   - Inline edit cells (title, priority, stage, assignee, due date)
   - Hover actions (edit, delete)

3. **TaskTableGroup.vue** - Collapsible group
   - Header with count
   - Collapse/expand toggle
   - Children slot for rows

4. **GroupBySelector.vue** - Dropdown
   - Options: None, Stage, Priority, Assignee, Due Date
   - Emits: update:groupBy

### Phase 2: Inline Editing (P1)

1. **TaskInlineEdit.vue** - Generic inline edit wrapper
   - Props: value, type (text, select, date), options
   - Events: save, cancel
   - Handles focus, blur, enter, escape

2. **useInlineEdit.ts** composable
   - editingCell state
   - save() with optimistic update
   - revert() on error

3. **API integration**
   - PATCH /api/tasks/{id} for single field updates
   - Error handling with toast notifications

### Phase 3: View Modes & Saved Views (P1)

1. **ViewModeToggle.vue** - Mode switcher
   - Table (default), Kanban, List
   - Preserves filter state on switch

2. **SavedViewsDropdown.vue** - View management
   - Select saved view
   - Save current as new view
   - Update existing view
   - Delete view (with confirmation)

3. **Extend useSavedViews.ts**
   - Add groupBy, viewMode, columns to config
   - Personal vs shared views (future)

### Phase 4: Keyboard Navigation (P2)

1. **useKeyboardShortcuts.ts** enhancements
   - Global shortcuts: C (create), Cmd+K (palette), / (search), ? (help)
   - Task-context shortcuts: E, A, P, D, 1-5
   - Arrow key navigation in table

2. **KeyboardShortcutsOverlay.vue**
   - Modal with all shortcuts listed
   - Triggered by ? key

### Phase 5: Bulk Operations (P2)

1. **BulkActionBar.vue** - Fixed bottom bar
   - Shows when tasks selected
   - Actions: Set priority, Set stage, Assign, Delete
   - Selection count

2. **useTaskSelection.ts** enhancements
   - Shift+click range selection
   - Select all / clear all
   - Selection state persistence

### Phase 6: Polish & Performance

1. **Loading states** - Skeleton rows
2. **Empty states** - Contextual messages
3. **Performance** - Virtualization for 500+ tasks
4. **Accessibility** - Focus management, ARIA labels

---

## API Contracts

### Existing Endpoints (no changes needed)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /tasks | List tasks with filters |
| GET | /tasks/{id} | Task detail |
| POST | /tasks | Create task |
| PUT | /tasks/{id} | Update task |
| DELETE | /tasks/{id} | Delete task |

### New/Modified Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| PATCH | /api/tasks/{id} | Quick update single field |
| PATCH | /api/tasks/bulk | Bulk update multiple tasks |
| GET | /api/saved-views?type=task | Get saved views for tasks |
| POST | /api/saved-views | Create saved view |
| PUT | /api/saved-views/{id} | Update saved view |
| DELETE | /api/saved-views/{id} | Delete saved view |

---

## Testing Strategy

### Unit Tests
- useTaskGrouping: grouping logic
- useInlineEdit: edit state management
- useSavedViews: view config serialization

### Feature Tests
- TaskController::update - PATCH single field
- TaskController::bulkUpdate - bulk operations
- SavedViewController - CRUD operations

### Browser Tests (Dusk)
- Inline edit flow: click → edit → save → verify
- Group by: select → verify grouping → collapse/expand
- Keyboard: C → create modal opens
- Bulk select: checkbox → action bar → bulk action → verify

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Performance with 500+ tasks | Medium | High | Virtualization, pagination fallback |
| Inline edit race conditions | Medium | Medium | Debounce saves, queue pending edits |
| Keyboard conflicts with browser | Low | Medium | Use non-conflicting shortcuts, document exceptions |
| Saved view migration | Low | Low | Backward compatible schema, defaults for missing fields |

---

## Success Criteria Mapping

| Criterion | Implementation |
|-----------|----------------|
| SC-001: Group/collapse < 1s | Client-side grouping, no API call |
| SC-002: Inline edit < 500ms | Optimistic updates, PATCH endpoint |
| SC-003: 80%+ keyboard accessible | Full shortcut coverage per design-spec |
| SC-004: 500 tasks < 2s load | Deferred loading, virtualization |
| SC-005: View switch preserves state | State in Inertia router, not URL |
| SC-006: Saved view load < 500ms | Client-side config application |

---

## Next Steps

1. Run `/speckit.tasks` to generate tasks.md
2. Begin Phase 1 implementation
3. Run `/speckit.implement` for guided development
