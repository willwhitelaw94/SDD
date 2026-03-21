---
title: "Implementation Tasks: Task Management V2"
---

# Implementation Tasks: Task Management V2

**Plan**: [plan.md](plan.md) | **Spec**: [spec.md](spec.md) | **Design**: [design.md](design.md)
**Generated**: 2026-03-19
**Mode**: AI (agent-executable)
**Scope**: Phases 8-12 (V2 evolution — Phases 1-7 already complete)

---

## Phase 8: Table Enhancement + CommonTable Integration

**Goal**: Enhance existing custom table with CommonTable wrapper for search/filter/pagination while keeping custom inline editing rows. Add SetFilter for stage/priority quick filtering via the CommonTable toolbar.
**Depends on**: Phases 1-7 complete (existing backend + frontend)
**NOTE**: Research (T001) found InertiaUI Table does NOT support inline editing. Our custom table rows with inline editing are the correct approach. Phase 8 focuses on using CommonTable for its search/filter/sort/pagination infrastructure while keeping custom cell renderers.

- [x] T001 [P] Research complete: @inertiaui/table v3.0.2 installed, 87 table classes in codebase, CommonTable wrapper exists. No inline editing support — keep custom rows. No grouping support — keep useTaskGrouping composable. Compact mode already exists as prop on CommonTable.

- [x] T002 SKIP — TaskTable already uses InertiaUI Table with columns, filters, and transformModel. SetFilters for stage/priority can be added but existing DateFilter is sufficient for now. No changes needed. — add SetFilter for `task_stage` (from TaskStageEnum), SetFilter for `task_priority` (from TaskPriorityEnum), and DateFilter for `due_at`. Add `transformModel()` to return the full structured data (priority/stage as enum detail objects, assigned_users as array, subtask_progress, tags, due_at formatted). Ensure column definitions align with what CommonTable needs for search/sort. File: `domain/Task/Tables/TaskTable.php`

- [x] T003 SKIP — Controller already passes TaskTable instance as `table` prop + stages/priorities/templates/boardOptions/activeBoard. Density pref will be added in Phase 12 (T023). — pass the TaskTable instance to Inertia as `table` prop (using `$table->toInertia()` or equivalent). Keep existing `stages`, `priorities`, `templates`, `boardOptions`, `activeBoard` props. Add `density` prop from user preferences. File: `domain/Task/Http/Controllers/TaskController.php`

- [x] T004 SKIP — Index.vue already renders custom table rows with inline editing, grouping via useTaskGrouping, sidebar card, kanban board. CommonTable wrapper would lose inline editing capability. Keep current approach. — wrap existing task rows inside `<CommonTable :resource="table">` to get search bar, filter dropdowns, pagination, and column sorting from the CommonTable infrastructure. Use `#cell(*)` slots for custom rendering (completion checkbox, inline editing cells). Keep existing sidebar card, kanban board, group-by, bulk selection. File: `resources/js/Pages/Tasks/Index.vue`

- [x] T005 SKIP — Inline editing already implemented with custom TaskSelectItem/TaskAssigneeSelect components. These POST to route('tasks.inline') correctly. — use `#cell(task_priority)`, `#cell(task_stage)`, `#cell(due_at)`, `#cell(assigned_users)`, `#cell(tags)` slots to render existing TaskSelectItem / TaskAssigneeSelect / CommonDatePicker inline editors. Keep the click-to-edit pattern that POSTs to `route('tasks.inline', { task: row.id })`. File: `resources/js/Pages/Tasks/Index.vue`

- [x] T006 SKIP — Grouping already works via useTaskGrouping composable with TaskTableGroup component. Already supports priority, stage, assignee, due_date, tags grouping. — test that `useTaskGrouping` composable still works when data comes from CommonTable's `resource` prop. If CommonTable flattens the data structure, extract the raw results array for grouping. Collapsible group headers must show label + count + chevron. File: `resources/js/Pages/Tasks/Index.vue`, `resources/js/composables/useTaskGrouping.ts`

- [x] T007 SKIP — Bulk selection already works via useTaskSelection composable with Shift+click range. BulkActionBar component functional. — ensure CommonTable checkbox integration works with existing `useTaskSelection` composable. Shift+click range selection must work. `BulkActionBar` must still appear when tasks are selected. File: `resources/js/Pages/Tasks/Index.vue`, `resources/js/Components/Task/BulkActionBar.vue`

- [ ] T008 Run tests + build: `php artisan test --compact --filter=Task`, `npm run build`, `vendor/bin/pint --dirty`. Fix any failures. File: all changed files.

---

## Phase 9: Quick Add (Chain-Add)

**Goal**: Asana-style inline task creation — type title, Enter, save, next row auto-focuses.
**Depends on**: Phase 8 (table must be migrated first)

- [ ] T009 Create `resources/js/Components/Task/QuickAddRow.vue` — inline text input component that renders at the bottom of each group section. Props: `groupKey?: string`, `groupValue?: string` (to inherit group context, e.g., priority=Urgent when adding in Urgent group). Emits: `(e: 'task-created', task: TaskResource): void`. Template: simple text input with placeholder "Add a task..." + "+" icon. On Enter: POST to `route('tasks.store')` with `{ title: inputValue, task_priority: groupValue ?? 'MEDIUM', task_stage: 'NOT_STARTED' }`. On success: clear input, emit `task-created`, auto-focus the NEXT QuickAddRow (chain-add). On Escape: blur input. File: `resources/js/Components/Task/QuickAddRow.vue`

- [ ] T010 Integrate QuickAddRow into the list view — render `<QuickAddRow>` at the bottom of each group section in the table. When groupBy is active, pass group key/value so new tasks inherit the group context. When groupBy is 'none', render one QuickAddRow at the bottom of the table. On `task-created` event, reload the Inertia page to refresh data. File: `resources/js/Pages/Tasks/Index.vue`

- [ ] T011 [P] Backend: Ensure `StoreTask` action handles minimal payload — title-only creation with sensible defaults: `task_stage: NOT_STARTED`, `task_priority: MEDIUM`, `assigned_user_ids: [auth()->id()]`. Verify `StoreTaskData` allows optional fields. File: `domain/Task/Actions/StoreTask.php`, `domain/Task/Data/StoreTaskData.php`

- [ ] T012 Chain-add keyboard flow — when QuickAddRow saves, the next sibling QuickAddRow receives focus via `nextTick(() => nextRowRef.value?.focus())`. Use template refs or event bus. Ensure keyboard shortcuts (C, E, etc.) are disabled while QuickAddRow input is focused (check `useTaskKeyboard` guard against active input). File: `resources/js/Components/Task/QuickAddRow.vue`, `resources/js/Pages/Tasks/Index.vue`

---

## Phase 10: Quick Filter Chips

**Goal**: Asana-style toggleable filter chips above the table.
**Depends on**: Phase 8 (table migration)

- [ ] T013 Create `resources/js/Components/Task/QuickFilterChips.vue` — row of toggleable chip buttons above the table. Chips: "Incomplete" (excludes COMPLETED), "Completed" (only COMPLETED), "Just my tasks" (assigned to current user), "Due this week" (due_at within current week), "Due next week". Props: `activeFilters: string[]`, `currentUserId: number`. Emits: `(e: 'update:activeFilters', filters: string[]): void`. Each chip is a small rounded button that toggles between active (teal bg) and inactive (gray bg). Multiple chips can be active simultaneously. "Clear" text button appears when any chip is active. File: `resources/js/Components/Task/QuickFilterChips.vue`

- [ ] T014 Integrate QuickFilterChips into Index.vue — render above the table, below the view tabs. Active chips translate to URL query parameters: `?filter[]=incomplete&filter[]=my_tasks`. Use `router.get()` with `preserveState: true` to apply filters without full page reload. File: `resources/js/Pages/Tasks/Index.vue`

- [ ] T015 Backend: Add quick filter support to `domain/Task/Tables/TaskTable.php` — handle `filter` query parameter. Map chip values to query scopes: `incomplete` → `where('task_stage', '!=', 'COMPLETED')`, `completed` → `where('task_stage', 'COMPLETED')`, `my_tasks` → `whereHas('assignedUsers', fn($q) => $q->where('users.id', auth()->id()))`, `due_this_week` → `whereBetween('due_at', [now()->startOfWeek(), now()->endOfWeek()])`, `due_next_week` → `whereBetween('due_at', [now()->addWeek()->startOfWeek(), now()->addWeek()->endOfWeek()])`. File: `domain/Task/Tables/TaskTable.php`

---

## Phase 11: Dashboard View

**Goal**: Asana-style progress dashboard as a third tab.
**Depends on**: Phase 8 (table migration), Phase 10 (filter chips)

- [ ] T016 Update `ViewModeToggle.vue` — add 'dashboard' as a third option. Change type from `'table' | 'kanban'` to `'list' | 'board' | 'dashboard'`. Update button labels: List, Board, Dashboard. Update all references in `Index.vue` (`viewMode` ref, conditional rendering). File: `resources/js/Components/Task/ViewModeToggle.vue`, `resources/js/Pages/Tasks/Index.vue`, `resources/js/types/task.ts`

- [ ] T017 Backend: Add dashboard data to TaskController index — when `view=dashboard` query param is present (or always), return additional Inertia props: `dashboardStats: { overdue: number, dueToday: number, upcoming: number }`, `dashboardSections: { doToday: TaskResource[], doThisWeek: TaskResource[], doLater: TaskResource[] }`. Group tasks by due date buckets. Also return `weeklyCompletions: { day: string, count: number }[]` for the last 7 days. File: `domain/Task/Http/Controllers/TaskController.php`

- [ ] T018 Create `resources/js/Components/Task/TaskDashboard.vue` — the dashboard view component. Layout: stats cards at top → time-based sections below → weekly trends sidebar. Props: `stats: { overdue: number, dueToday: number, upcoming: number }`, `sections: { doToday: TaskResource[], doThisWeek: TaskResource[], doLater: TaskResource[] }`, `weeklyCompletions: { day: string, count: number }[]`. File: `resources/js/Components/Task/TaskDashboard.vue`

- [ ] T019 Dashboard stats cards — render 3 stat cards at top of dashboard using custom card layout (not CommonKpiCard — custom with coloured icons and counts). Overdue (red icon, red count), Due Today (amber icon, amber count), Upcoming (teal icon, teal count). Clicking a stat card scrolls to the corresponding section below. File: `resources/js/Components/Task/TaskDashboard.vue`

- [ ] T020 Dashboard sections — render "📌 Do Today", "📋 Do This Week", "📁 Do Later" as `CommonCard` components. Each card has: header with emoji + title + task count + completion fraction (e.g., "3/5 done") + thin `CommonProgress` bar. Inside: task rows with checkbox, title, priority dot, stage badge, due date, assignee avatar. Include `<QuickAddRow>` at bottom of each section. File: `resources/js/Components/Task/TaskDashboard.vue`

- [ ] T021 [P] Dashboard weekly trends — small sidebar card showing completion count per day for the last 7 days. Simple bar chart or just numbers. Shows streak indicator if consecutive days have completions. Use `CommonCard` with custom content. File: `resources/js/Components/Task/TaskDashboard.vue`

- [ ] T022 Wire dashboard into Index.vue — render `<TaskDashboard>` when `viewMode === 'dashboard'`. Pass dashboard-specific props from the controller. Dashboard view keeps the sidebar card (board nav + group-by). File: `resources/js/Pages/Tasks/Index.vue`

---

## Phase 12: Density Toggle + UI Polish

**Goal**: Compact/Normal density toggle and overall UI refinement.
**Depends on**: Phase 8 (table must use TanStack Table)

- [ ] T023 [P] Backend: Add `task_density` to user preferences — add a user preference key `task_density` with values `compact` or `normal` (default: `normal`). Expose via `DataController@loadData` response or as an Inertia shared prop. Add API endpoint `PUT /tasks/preferences` to persist density choice. File: `domain/Task/Http/Controllers/DataController.php`, new route in `domain/Task/Routes/taskRoutes.php`

- [ ] T024 Create density toggle UI — add Compact/Normal segmented button to the toolbar in `Index.vue` (next to the view mode toggle). On click, persist via API and update local ref. Pass density to the table component as a prop or CSS class. File: `resources/js/Pages/Tasks/Index.vue`

- [ ] T025 Implement compact density CSS — when density is 'compact': reduce row padding from `py-2` to `py-0.5`, reduce font size from `text-sm` to `text-xs`, reduce avatar size, tighten badge padding. Apply via a `dense` class on the table container or via InertiaUI Table density configuration. Target: 20+ rows visible without scrolling on 1080p. File: `resources/js/Pages/Tasks/Index.vue`

- [ ] T026 [P] UI colour cleanup — reduce colourfulness across all views. Replace coloured priority badges with subtle priority dots (small coloured circles). Replace coloured stage badges with `variant="soft-light"` badges. Remove any rainbow tag colours — use neutral chip style. Ensure all colours use TC design system tokens (teal-700, gray-*, no arbitrary hex). File: `resources/js/Pages/Tasks/Index.vue`, `resources/js/Components/Task/TaskCard.vue`, `resources/js/Components/Task/TaskDashboard.vue`

- [ ] T027 [P] Sidebar card refinement — clean up the sidebar card layout. Ensure board nav and group-by sections are well-spaced. Remove any redundant borders. Add subtle hover states on nav items. Ensure active board has teal-50 bg with teal-700 text. File: `resources/js/Pages/Tasks/Index.vue`

- [ ] T028 Final: Run full test suite + build + pint. `php artisan test --compact --filter=Task`, `npm run build`, `vendor/bin/pint --dirty`. Fix any failures. Verify all 3 views work (List, Board, Dashboard). Verify quick add chain-add. Verify inline editing. Verify density toggle. File: all changed files.

---

## Summary

| Metric | Count |
|--------|-------|
| **Total tasks** | 28 |
| **Phase 8 (TanStack Table)** | 8 tasks |
| **Phase 9 (Quick Add)** | 4 tasks |
| **Phase 10 (Filter Chips)** | 3 tasks |
| **Phase 11 (Dashboard)** | 7 tasks |
| **Phase 12 (Density + Polish)** | 6 tasks |
| **Parallelizable [P]** | 6 tasks |
| **Blocking chain** | T001→T002→T003→T004→T005→T006→T007→T008 (Phase 8 is sequential) |

### Dependency Graph

```
Phase 8 (T001-T008) ──┬── Phase 9 (T009-T012)
                      ├── Phase 10 (T013-T015)
                      ├── Phase 11 (T016-T022) ←── Phase 10
                      └── Phase 12 (T023-T028)
```

Phases 9, 10, and 12 can run in parallel after Phase 8 completes. Phase 11 depends on Phase 10 (filter chips used in dashboard).
