---
title: "Tasks"
---


**Epic Code**: TSK
**Plan**: [plan.md](./plan.md)
**Spec**: [spec.md](./spec.md)
**Design**: [spec-design.md](./spec-design.md)
**Generated**: 2026-01-03
**Updated**: 2026-01-03 (added design spec components)
**Total Tasks**: 82
**Parallel Opportunities**: 20 tasks marked [P]

---

## Task Dependency Graph

```
Phase 1: Foundation (blocking)
    ↓
Phase 1b: Work Streams & Layout (blocking)
    ↓
Phase 2: US1 Kanban + US2 Table (P1 - parallel)
    ↓
Phase 3: US3 Task Creation (P1)
    ↓
Phase 4: US5 Linked Tasks + US6 Assignment (P2 - parallel)
    ↓
Phase 5: US9 Keyboard + US10 Subtasks + US11 Activity (P2 - parallel)
    ↓
Phase 6: US7 Care Partner + US8 Due Dates (P3 - parallel)
    ↓
Phase 7: Polish & Testing
```

---

## Phase 1: Foundation (Blocking Prerequisites)

> **Must complete before any user story work. No parallelization.**

### Database & Models

- [ ] T001 Create migration for `task_activities` table in `database/migrations/xxxx_create_task_activities_table.php`
- [ ] T002 Create migration to add `is_sensitive` column to `tasks` table in `database/migrations/xxxx_add_is_sensitive_to_tasks.php`
- [ ] T003 Run migrations: `php artisan migrate`
- [ ] T004 Create `TaskActivity` model in `domain/Task/Models/TaskActivity.php` with task/user relationships
- [ ] T005 Update `Task` model in `domain/Task/Models/Task.php` to add `activities()` relationship and `is_sensitive` cast

### Actions (Business Logic)

- [ ] T006 Create `LogTaskActivityAction` in `domain/Task/Actions/LogTaskActivityAction.php` for activity logging
- [ ] T007 Create `UpdateTaskStatusAction` in `domain/Task/Actions/UpdateTaskStatusAction.php` with activity logging
- [ ] T008 Create `CreateSubtaskAction` in `domain/Task/Actions/CreateSubtaskAction.php` for subtask creation

### Feature Flags

- [ ] T009 Add feature flags to `config/features.php`: `task_kanban_view`, `task_keyboard_shortcuts`, `task_care_partner_visibility`

### Policies

- [ ] T010 Update `TaskPolicy` in `domain/Task/Policies/TaskPolicy.php` to add care partner restrictions (`viewAny`, `view`, `update`)

---

## Phase 1b: Work Streams & Layout (From Design Spec)

> **New layout structure from design clarification. Must complete before Kanban/Table work.**

### Database & Models (Work Streams)

- [ ] T074 Create migration for `work_streams` table in `database/migrations/xxxx_create_work_streams_table.php` (id, name, icon, color, organisation_id)
- [ ] T075 Create migration for `work_stream_user` pivot table in `database/migrations/xxxx_create_work_stream_user_table.php`
- [ ] T076 Create migration to add `work_stream_id` column to `tasks` table in `database/migrations/xxxx_add_work_stream_id_to_tasks.php`
- [ ] T077 Run migrations: `php artisan migrate`
- [ ] T078 Create `WorkStream` model in `domain/Task/Models/WorkStream.php` with users() and tasks() relationships
- [ ] T079 Update `Task` model to add `workStream()` belongsTo relationship

### Work Stream Endpoints

- [ ] T080 Create `GET /work-streams` endpoint in `domain/Task/Http/Controllers/WorkStreamController.php`
- [ ] T081 Create `POST /work-streams` endpoint for creating work streams
- [ ] T082 Add `work_stream_id` filter support to `TaskController@index`

### Layout Components (From Design Spec)

- [ ] T083 [P] Create `WorkStreamSidebar.vue` component in `resources/js/Components/Tasks/WorkStreamSidebar.vue` with My Tasks, Unassigned, Work Streams sections
- [ ] T084 [P] Create `TaskStatsBar.vue` component in `resources/js/Components/Tasks/TaskStatsBar.vue` with task count, completed, points display
- [ ] T085 Update `Tasks/Index.vue` layout to use `CommonSplitter` with sidebar + main content structure

---

## Phase 2: User Stories 1 & 2 - Kanban & Table Views (P1)

> **Core views. Can work on Kanban and Table enhancements in parallel.**

### US1: Kanban Board View

- [ ] T011 [US1] Create `TaskCard.vue` component in `resources/js/Components/Tasks/TaskCard.vue` with title, priority badge, assignee, due date, subtask progress
- [ ] T086 [P] [US1] Create `KanbanColumn.vue` component in `resources/js/Components/Tasks/KanbanColumn.vue` with column header + card list
- [ ] T012 [P] [US1] Create `KanbanBoard.vue` component in `resources/js/Components/Tasks/KanbanBoard.vue` using KanbanColumn for 3 columns (To Do, In Progress, Done)
- [ ] T013 [US1] Add drag-drop functionality to `KanbanBoard.vue` using `vuedraggable@next` library
- [ ] T014 [US1] Create `PATCH /tasks/{id}/status` endpoint in `domain/Task/Http/Controllers/TaskController.php` for quick status updates
- [ ] T015 [US1] Update `TaskRepository` in `domain/Task/Repositories/TaskRepository.php` to add `getTasksGroupedByStatus()` method
- [ ] T016 [US1] Update `Index.vue` in `resources/js/Pages/Tasks/Index.vue` to add view toggle (Kanban/Table)
- [ ] T017 [US1] Wire Kanban drag-drop to call status update endpoint via Inertia form

### US2: Table View Enhancements

- [ ] T018 [P] [US2] Enhance table filtering in `Index.vue` to support status, assignee, due date, work stream filters
- [ ] T019 [P] [US2] Add column sorting (ascending/descending toggle) to task table in `Index.vue`
- [ ] T020 [US2] Ensure filters update results in real-time without page reload
- [ ] T021 [US2] Add `view=kanban` query parameter support to `TaskController@index`
- [ ] T087 [US2] Create `InlineTaskCreate.vue` component in `resources/js/Components/Tasks/InlineTaskCreate.vue` for quick add row
- [ ] T088 [US2] Add inline editing for Status and Priority cells (click → dropdown)
- [ ] T089 [US2] Add checkbox completion with confetti explosion using `vue-confetti-explosion`

---

## Phase 3: User Story 3 - Task Creation (P1)

> **Depends on Phase 2 for view context.**

### US3: Create Tasks Manually

- [ ] T022 [US3] Verify existing `TaskForm.vue` in `resources/js/Components/Tasks/TaskForm.vue` supports required fields (title, description, due date, assignee)
- [ ] T023 [US3] Add taskable linking dropdown to `TaskForm.vue` for business object selection
- [ ] T024 [US3] Ensure validation errors display inline for required fields
- [ ] T025 [US3] Wire task creation to appear in both Kanban board and table view immediately

---

## Phase 4: User Stories 5 & 6 - Linked Tasks & Assignment (P2)

> **Can work on linked tasks and assignment in parallel.**

### US5: View Tasks Linked to Business Objects

- [ ] T026 [P] [US5] Add `morphMany(Task::class, 'taskable')` relationship to `Patient` model in `domain/Recipient/Models/Patient.php`
- [ ] T027 [P] [US5] Add `morphMany(Task::class, 'taskable')` relationship to `Risk` model (locate correct path)
- [ ] T028 [P] [US5] Create `RelatedTasksPanel.vue` component in `resources/js/Components/Tasks/RelatedTasksPanel.vue`
- [ ] T029 [US5] Integrate `RelatedTasksPanel.vue` into Patient detail view
- [ ] T030 [US5] Integrate `RelatedTasksPanel.vue` into Package detail view (enhance existing `PackageTasks.vue`)
- [ ] T031 [US5] Add task detail modal that opens without page navigation

### US6: Assign Tasks to Users

- [ ] T032 [P] [US6] Verify existing `TaskAssignable` pivot supports user assignment
- [ ] T033 [US6] Ensure assigned tasks appear in assignee's Kanban board and table view
- [ ] T034 [US6] Add activity log entry when task is assigned via `LogTaskActivityAction`

---

## Phase 5: User Stories 9, 10 & 11 - Keyboard, Subtasks, Activity (P2)

> **These can be worked on in parallel after Phase 4.**

### US9: Keyboard Shortcuts & Command Palette

- [ ] T035 [P] [US9] Create `useKeyboardShortcuts.ts` composable in `resources/js/Composables/useKeyboardShortcuts.ts`
- [ ] T090 [P] [US9] Create `useTaskSelection.ts` composable in `resources/js/Composables/useTaskSelection.ts` for tracking selected task
- [ ] T036 [P] [US9] Create `TaskCommandPalette.vue` component in `resources/js/Components/Tasks/TaskCommandPalette.vue` extending CommonCommandPalette with task-specific actions
- [ ] T037 [US9] Create `KeyboardShortcuts.vue` help overlay in `resources/js/Components/Tasks/KeyboardShortcuts.vue`
- [ ] T038 [US9] Implement `Cmd/Ctrl+K` to open contextual command palette (task-specific on /tasks, global elsewhere)
- [ ] T039 [US9] Implement shortcuts: `C` (create), `E` (edit), `A` (assign), `D` (due date), `/` (filter)
- [ ] T040 [US9] Implement `1-9` shortcuts to move selected task to column
- [ ] T041 [US9] Implement arrow key navigation and Enter to open task details
- [ ] T042 [US9] Implement `?` to show keyboard shortcuts help overlay
- [ ] T091 [US9] Implement chord navigation: `G then T` (go to table), `G then K` (go to kanban)

### US10: Subtasks

- [ ] T043 [P] [US10] Create `POST /tasks/{id}/subtasks` endpoint in `TaskController.php`
- [ ] T044 [P] [US10] Create `SubtaskList.vue` component in `resources/js/Components/Tasks/SubtaskList.vue`
- [ ] T045 [US10] Add subtask progress indicator (e.g., "2/5 complete") to `TaskCard.vue`
- [ ] T046 [US10] Add prompt to complete parent task when all subtasks are done

### US11: Task Comments & Activity

- [ ] T047 [P] [US11] Create `GET /tasks/{id}/activities` endpoint in `TaskController.php`
- [ ] T048 [P] [US11] Create `ActivityLog.vue` component in `resources/js/Components/Tasks/ActivityLog.vue`
- [ ] T049 [US11] Integrate `ActivityLog.vue` into task detail modal
- [ ] T050 [US11] Add @mention support in comments with user autocomplete

---

## Phase 6: User Stories 7 & 8 - Care Partner & Due Dates (P3)

> **Lower priority. Can be worked on in parallel.**

### US7: Care Partner Task Visibility

- [ ] T051 [P] [US7] Implement care partner task filtering in `TaskRepository` using `TaskPolicy`
- [ ] T052 [US7] Filter out `is_sensitive=true` tasks for care partner role
- [ ] T053 [US7] Create read-only task view variant for care partners (hide edit/assign buttons)
- [ ] T054 [US7] Add care partner comment visibility (view but not add)

### US8: Task Due Date and Reminders

- [ ] T055 [P] [US8] Add due date display to `TaskCard.vue`
- [ ] T056 [US8] Add overdue visual indicator (red border) to `TaskCard.vue` when `due_at < now`
- [ ] T057 [US8] Add urgent indicator (yellow) when task due within 24 hours
- [ ] T058 [US8] Add due date column and filtering to table view

---

## Phase 7: Polish & Cross-Cutting Concerns

> **Final phase. Depends on all user stories being complete.**

### Performance Optimization

- [ ] T059 Add pagination to Kanban columns for users with 100+ tasks per column
- [ ] T060 Implement lazy loading for task detail modal content
- [ ] T061 Optimize `TaskRepository` queries with eager loading for relationships

### Accessibility

- [ ] T062 Audit all new components for WCAG 2.1 AA compliance
- [ ] T063 Ensure all interactive elements have visible focus indicators
- [ ] T064 Add ARIA labels to icon-only buttons in `TaskCard.vue` and `KanbanBoard.vue`
- [ ] T065 Test keyboard navigation flow (Tab order, focus trap in modals)
- [ ] T092 Respect `prefers-reduced-motion` for confetti animation

### Responsive (Mobile)

- [ ] T093 Force list view on mobile (<768px breakpoint) - hide Kanban toggle
- [ ] T094 Convert sidebar to hamburger menu on mobile
- [ ] T095 Convert Work Stream selector to dropdown on mobile

### Testing

- [ ] T066 Create `UpdateTaskStatusActionTest` unit test in `tests/Unit/Task/UpdateTaskStatusActionTest.php`
- [ ] T067 Create `CreateSubtaskActionTest` unit test in `tests/Unit/Task/CreateSubtaskActionTest.php`
- [ ] T096 Create `LogTaskActivityActionTest` unit test in `tests/Unit/Task/LogTaskActivityActionTest.php`
- [ ] T068 Create `TaskKanbanTest` feature test in `tests/Feature/Task/TaskKanbanTest.php`
- [ ] T069 Create `CarePartnerTaskAccessTest` feature test in `tests/Feature/Task/CarePartnerTaskAccessTest.php`
- [ ] T097 Create `WorkStreamTest` feature test in `tests/Feature/Task/WorkStreamTest.php`
- [ ] T070 Create browser test for Kanban drag-drop in `tests/Browser/TaskKanbanTest.php`
- [ ] T071 Create browser test for keyboard shortcuts in `tests/Browser/TaskKeyboardTest.php`
- [ ] T098 Create browser test for inline editing in `tests/Browser/TaskInlineEditTest.php`
- [ ] T099 Create browser test for confetti completion in `tests/Browser/TaskCompletionTest.php`

### Documentation & Cleanup

- [ ] T072 Run `vendor/bin/pint --dirty` to format all new PHP files
- [ ] T073 Update `DataController` taskableTypes to include Patient, Risk

---

## Summary

| Phase | User Stories | Task Count | Parallel Tasks |
|-------|--------------|------------|----------------|
| 1. Foundation | - | 10 | 0 |
| 1b. Work Streams & Layout | - | 12 | 2 |
| 2. Kanban & Table | US1, US2 | 14 | 4 |
| 3. Task Creation | US3 | 4 | 0 |
| 4. Linked & Assign | US5, US6 | 9 | 4 |
| 5. Keyboard/Subtasks/Activity | US9, US10, US11 | 19 | 8 |
| 6. Care Partner & Due Dates | US7, US8 | 8 | 2 |
| 7. Polish & Testing | - | 23 | 0 |
| **Total** | **10 stories** | **99** | **20** |

### MVP Scope (Must Ship by March)

**Critical Path (P1):**
- Phase 1: Foundation
- Phase 1b: Work Streams & Layout
- Phase 2: US1 Kanban + US2 Table
- Phase 3: US3 Task Creation

**High Value (P2):**
- Phase 4: US5 Linked Tasks + US6 Assignment
- Phase 5: US9 Keyboard Shortcuts

**Nice to Have (P3):**
- Phase 6: US7 Care Partner + US8 Due Dates
- Phase 7: Polish

---

## Next Steps

1. → `/speckit.implement` — Begin Phase 1 Foundation tasks
2. → `/trilogy.jira-sync` — Sync tasks to Jira (optional)
