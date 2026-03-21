---
title: "Implementation Tasks: Task Management MVP"
---

# Implementation Tasks: Task Management MVP

**Plan**: [plan.md](plan.md) | **Spec**: [spec.md](spec.md) | **Design**: [design.md](design.md)
**Generated**: 2026-03-05
**Mode**: AI (agent-executable)
**Total Tasks**: 82 | **Parallel Opportunities**: 28 tasks marked [P]

---

## Phase 1: Backend Foundation — Migrations, Enums, Models

_Blocking for all subsequent phases. No user-story dependency — infrastructure only._

- [ ] T001 Migration: Create `task_linkables` table — columns: `id` (bigint PK), `task_id` (bigint FK→tasks ON DELETE CASCADE), `linkable_type` (varchar 255), `linkable_id` (bigint unsigned), `created_at`, `updated_at`. Add unique composite index on `(task_id, linkable_type, linkable_id)`. File: `database/migrations/xxxx_create_task_linkables_table.php`

- [ ] T002 [P] Migration: Create `task_templates` table — columns: `id` (bigint PK), `name` (varchar 255), `title` (text), `description` (text nullable), `task_priority` (varchar nullable), `tags` (json nullable), `checklist` (json nullable), `created_by` (bigint FK→users), `created_at`, `updated_at`. File: `database/migrations/xxxx_create_task_templates_table.php`

- [ ] T003 [P] Migration: Alter `tasks` table — add `template_id` (bigint nullable FK→task_templates ON DELETE SET NULL). File: `database/migrations/xxxx_add_template_id_to_tasks_table.php`

- [ ] T004 Enum: Update `TaskPriorityEnum` — add cases: `NO_PRIORITY = 'NO_PRIORITY'` (colour: gray), `URGENT = 'URGENT'` (colour: red). Keep existing LOW, MEDIUM, HIGH. Update `toArray()`, `getColour()`, ordering. File: `domain/Task/Enums/TaskPriorityEnum.php`

- [ ] T005 [P] Enum: Clean `TaskStageEnum` — remove dead methods `isInReview()` and `isArchived()` that reference non-existent cases. File: `domain/Task/Enums/TaskStageEnum.php`

- [ ] T006 Model: Create `TaskLinkable` — fillable: `task_id`, `linkable_type`, `linkable_id`. Relationships: `task()` BelongsTo Task, `linkable()` MorphTo. File: `domain/Task/Models/TaskLinkable.php`

- [ ] T007 [P] Model: Create `TaskTemplate` — fillable: `name`, `title`, `description`, `task_priority`, `tags`, `checklist`, `created_by`. Casts: `task_priority` → `TaskPriorityEnum`, `tags` → array, `checklist` → array. Relationships: `createdBy()` BelongsTo User, `tasks()` HasMany Task. File: `domain/Task/Models/TaskTemplate.php`

- [ ] T008 Model: Update `Task` — add to $fillable: `template_id`. Add relationships: `linkables()` HasMany TaskLinkable, `subtasks()` HasMany Task (where parent_id = this.id), `template()` BelongsTo TaskTemplate. Add accessor: `getSubtaskProgressAttribute()` returns `['completed' => int, 'total' => int]`. Keep existing `taskable()` for backwards compat. File: `domain/Task/Models/Task.php`

- [ ] T009 [P] Data class: Create `StoreTaskData` — properties: `title` (string, required), `description` (?string), `task_priority` (?TaskPriorityEnum), `task_stage` (?TaskStageEnum), `start_at` (?string), `due_at` (?string), `tags` (?array), `checklist` (?array), `parent_id` (?int), `is_recurring` (bool, default false), `recurring_days` (?int), `template_id` (?int), `assigned_user_ids` (array of int), `assigned_team_ids` (array of int), `linkables` (?array of `['type' => string, 'id' => int]`). Use `#[MapName(SnakeCaseMapper::class)]`. File: `domain/Task/Data/StoreTaskData.php`

- [ ] T010 [P] Data class: Create `UpdateTaskData` — same as StoreTaskData but all fields optional. File: `domain/Task/Data/UpdateTaskData.php`

- [ ] T011 [P] Data class: Create `InlineUpdateTaskData` — properties: `field` (string, required — one of: title, task_priority, task_stage, due_at, start_at, tags, assigned_user_ids, assigned_team_ids, checklist), `value` (mixed, required). File: `domain/Task/Data/InlineUpdateTaskData.php`

- [ ] T012 [P] Data class: Create `BulkUpdateTaskData` — properties: `task_ids` (array of int, required, min:1), `task_priority` (?TaskPriorityEnum), `task_stage` (?TaskStageEnum), `assigned_user_ids` (?array of int). File: `domain/Task/Data/BulkUpdateTaskData.php`

- [ ] T013 Policy: Create `TaskPolicy` — methods: `viewAny(User)`, `view(User, Task)`, `create(User)`, `update(User, Task)`, `delete(User, Task)` — check `user.permission:manage-tasks`. `manageTemplates(User)` — check admin permission. All return `Response::allow()` / `Response::deny('reason')`. Register in `AuthServiceProvider`. File: `domain/Task/Policies/TaskPolicy.php`

- [ ] T014 [P] Policy: Create `TaskTemplatePolicy` — methods: `viewAny(User)`, `create(User)`, `update(User, TaskTemplate)`, `delete(User, TaskTemplate)` — admin only. Register in `AuthServiceProvider`. File: `domain/Task/Policies/TaskTemplatePolicy.php`

- [ ] T015 Data migration: Create operation to migrate existing `tasks.taskable_type`/`tasks.taskable_id` records into `task_linkables` table. For each task with non-null taskable_type: insert into task_linkables (task_id, linkable_type, linkable_id). Run as Laravel Operation (not migration). File: `database/operations/xxxx_migrate_task_taskables_to_linkables.php`

---

## Phase 2: Core Actions — Business Logic

_Depends on Phase 1 (models, data classes, enums). Blocking for controllers._

- [ ] T016 Action: Create `StoreTask` — accepts `StoreTaskData`, creates Task, syncs assignedUsers via `assignedUsers()->sync()`, syncs assignedTeams via `assignedTeams()->sync()`, creates TaskLinkable records, logs activity. Uses `AsAction` trait with `authorize()` checking `TaskPolicy::create`. File: `domain/Task/Actions/StoreTask.php`

- [ ] T017 [P] Action: Create `UpdateTask` — accepts `Task`, `UpdateTaskData`. Updates task fields, syncs users/teams, syncs linkables (diff add/remove), runs `DuplicateTask` if stage changed to COMPLETED and is_recurring. Logs activity. File: `domain/Task/Actions/UpdateTask.php`

- [ ] T018 [P] Action: Create `DeleteTask` — accepts `Task`. Detaches users/teams, soft-deletes. Logs activity. File: `domain/Task/Actions/DeleteTask.php`

- [ ] T019 [P] Action: Create `UpdateTaskStage` — accepts `Task`, `TaskStageEnum`. Quick single-field update for Kanban drag and keyboard shortcuts. Logs activity "Stage changed from X to Y". Runs DuplicateTask if COMPLETED and recurring. File: `domain/Task/Actions/UpdateTaskStage.php`

- [ ] T020 [P] Action: Create `UpdateTaskInline` — accepts `Task`, `InlineUpdateTaskData`. Validates field name against allowed list, casts value appropriately, updates single field. For array fields (tags, checklist, assigned_user_ids, assigned_team_ids) handles relationship sync. Logs activity. File: `domain/Task/Actions/UpdateTaskInline.php`

- [ ] T021 [P] Action: Create `BulkUpdateTasks` — accepts `BulkUpdateTaskData`. Loads tasks by IDs, authorizes each via TaskPolicy::update, applies non-null fields to all. Logs activity per task. Returns count of updated tasks. File: `domain/Task/Actions/BulkUpdateTasks.php`

- [ ] T022 [P] Action: Create `LinkTaskable` — accepts `Task`, `string $linkableType`, `int $linkableId`. Creates TaskLinkable record. Validates linkable exists via `morphTo` resolution. Logs activity. File: `domain/Task/Actions/LinkTaskable.php`

- [ ] T023 [P] Action: Create `UnlinkTaskable` — accepts `Task`, `TaskLinkable`. Deletes the linkable record. Logs activity. File: `domain/Task/Actions/UnlinkTaskable.php`

- [ ] T024 [P] Action: Create `StoreTaskComment` — accepts `Task`, `string $comment`, `User $user`. Creates TaskComment, parses @mentions (regex `/@(\w+)/`), dispatches notification to mentioned users. Logs activity. File: `domain/Task/Actions/StoreTaskComment.php`

- [ ] T025 [P] Action: Create `DeleteTaskComment` — accepts `TaskComment`. Authorizes (only creator can delete). Soft-deletes. Logs activity. File: `domain/Task/Actions/DeleteTaskComment.php`

- [ ] T026 [P] Action: Create `CreateTaskTemplate` — accepts `TaskTemplateData` (name, title, description, task_priority, tags, checklist). Creates TaskTemplate. Authorizes via TaskTemplatePolicy. File: `domain/Task/Actions/CreateTaskTemplate.php`

- [ ] T027 [P] Action: Create `UpdateTaskTemplate` — accepts `TaskTemplate`, `TaskTemplateData`. Updates fields. File: `domain/Task/Actions/UpdateTaskTemplate.php`

- [ ] T028 [P] Action: Create `DeleteTaskTemplate` — accepts `TaskTemplate`. Deletes (does not cascade to tasks — template_id stays). File: `domain/Task/Actions/DeleteTaskTemplate.php`

- [ ] T029 [P] Data class: Create `TaskTemplateData` — properties: `name` (string), `title` (string), `description` (?string), `task_priority` (?TaskPriorityEnum), `tags` (?array), `checklist` (?array). File: `domain/Task/Data/TaskTemplateData.php`

---

## Phase 3: Backend Tables & Controllers

_Depends on Phase 2 (actions). Connects backend to frontend._

- [ ] T030 Table: Create `TaskTable extends BaseTable` — `resource()`: Task query with eager loads (createdBy, assignedUsers, assignedTeams, linkables.linkable), withCount subtasks + completed subtasks. `columns()`: TextColumn title (searchable, sortable), BadgeColumn task_priority (sortable), BadgeColumn task_stage (sortable), DateColumn due_at (sortable), TextColumn assigned_users, TextColumn tags, ActionColumn actions. Add filters for stage, priority, assignee, due date range, tags, scope (my_tasks/all_tasks/team:{id}). File: `domain/Task/Tables/TaskTable.php`

- [ ] T031 Refactor `TaskController@index` — replace PrimeVue logic with `TaskTable::make()->toInertia()`. Add Inertia props: `stages` (TaskStageEnum::toArray()), `priorities` (TaskPriorityEnum::toArray()), `templates` (TaskTemplate::all()), `boardOptions` (current user's teams for top bar tabs). Remove all axios-based data loading. File: `domain/Task/Http/Controllers/TaskController.php`

- [ ] T032 Refactor `TaskController@store` — delegate to `StoreTask` action with `StoreTaskData::from($request)`. Return redirect back. File: `domain/Task/Http/Controllers/TaskController.php`

- [ ] T033 [P] Refactor `TaskController@update` — delegate to `UpdateTask` action with `UpdateTaskData::from($request)`. File: `domain/Task/Http/Controllers/TaskController.php`

- [ ] T034 [P] Refactor `TaskController@destroy` — delegate to `DeleteTask` action. File: `domain/Task/Http/Controllers/TaskController.php`

- [ ] T035 [P] Refactor `CommentController@store` — delegate to `StoreTaskComment` action (replace broken TaskService call). File: `domain/Task/Http/Controllers/CommentController.php`

- [ ] T036 [P] Refactor `CommentController@destroy` — delegate to `DeleteTaskComment` action (replace broken TaskService call). File: `domain/Task/Http/Controllers/CommentController.php`

- [ ] T037 New controller method: `TaskController@updateStage` — accepts `Task`, `TaskStageEnum` from request body. Delegates to `UpdateTaskStage` action. Returns JSON response. Route: `PUT /tasks/{task}/stage`. File: `domain/Task/Http/Controllers/TaskController.php`

- [ ] T038 [P] New controller method: `TaskController@updateInline` — accepts `Task`, `InlineUpdateTaskData::from($request)`. Delegates to `UpdateTaskInline` action. Returns JSON with updated TaskResource. Route: `PUT /tasks/{task}/inline`. File: `domain/Task/Http/Controllers/TaskController.php`

- [ ] T039 [P] New controller method: `TaskController@bulkUpdate` — accepts `BulkUpdateTaskData::from($request)`. Delegates to `BulkUpdateTasks` action. Returns JSON with count. Route: `POST /tasks/bulk`. File: `domain/Task/Http/Controllers/TaskController.php`

- [ ] T040 New controller: `TaskLinkableController` — `store(Task, Request)`: delegates to `LinkTaskable`. `destroy(Task, TaskLinkable)`: delegates to `UnlinkTaskable`. Routes: `POST /tasks/{task}/linkables`, `DELETE /tasks/{task}/linkables/{linkable}`. File: `domain/Task/Http/Controllers/TaskLinkableController.php`

- [ ] T041 [P] New controller: `TaskTemplateController` — `index()`: return TaskTemplate::all(). `store(Request)`: CreateTaskTemplate. `update(TaskTemplate, Request)`: UpdateTaskTemplate. `destroy(TaskTemplate)`: DeleteTaskTemplate. Routes: `GET/POST /tasks/templates`, `PUT/DELETE /tasks/templates/{template}`. File: `domain/Task/Http/Controllers/TaskTemplateController.php`

- [ ] T042 Update routes: Add new routes to `domain/Task/Routes/taskRoutes.php` — `PUT tasks/{task}/stage`, `PUT tasks/{task}/inline`, `POST tasks/bulk`, resource routes for `tasks/{task}/linkables`, resource routes for `tasks/templates`. All under `web.authenticated` + `user.permission:manage-tasks` middleware.

- [ ] T043 Update `TaskResource` — add: `subtask_progress` (from accessor), `linkables` (TaskLinkableResource collection), `template_id`, `subtasks` (TaskResource collection, only when loaded). Add `TaskLinkableResource` that returns `id`, `linkable_type`, `linkable_id`, `linkable_label` (via linkable->name or linkable->title). File: `domain/Task/Http/Resources/TaskResource.php`, create `domain/Task/Http/Resources/TaskLinkableResource.php`

- [ ] T044 Update `DataController@loadData` — add `templates` (TaskTemplate::all()) to JSON response. File: `domain/Task/Http/Controllers/DataController.php`

- [ ] T045 Delete dead code: Remove `domain/Task/Services/TaskService.php`, `app/Services/Tasks/TaskService.php`, `domain/Task/Http/Requests/StoreUpdateTaskRequest.php` (replaced by Data classes). File: delete these 3 files.

---

## Phase 4: Frontend Core — TypeScript, CommonTable, Inline Editing [US1] [US3] [US4] [US11]

_Depends on Phase 3. Delivers table view, modal create/edit, inline editing, due date indicators._

- [ ] T046 Create shared types file — define `TaskResource`, `ChecklistItem`, `TaskComment`, `TaskLinkable`, `TaskTemplate`, `StageOption`, `PriorityOption`, `GroupByOption`, `TaskTableProps` types as specified in plan.md. File: `resources/js/types/task.ts`

- [ ] T047 Convert `composables/dialog.js` → `composables/dialog.ts` — add TypeScript types for all exports. Type `confirmDialogLabel`, `isTaskDialogOpen`, `openTaskDialog(taskId?: number, forceAssociate?: boolean)`, `closeTaskDialog()`, `isAssociatePackageDialogOpen`, `closeAssociatePackageDialog(result: 'confirm' | 'cancel')`, `closeConfirmDialog(result: 'close' | 'cancel' | 'confirm')`. File: `resources/js/composables/dialog.ts` (rename from .js)

- [ ] T048 Delete dead WIP components: Remove `resources/js/Components/Task/CreateTask.vue` and `resources/js/Components/Task/CreateTaskForm.vue` (UI prototypes with hardcoded data, never connected to backend). File: delete these 2 files.

- [ ] T049 Rewrite `Pages/Tasks/Index.vue` — full rewrite in TypeScript. Use CommonTable with BaseTable props from Inertia. Add top bar tabs (My Tasks / All Tasks / Team tabs from `boardOptions` prop). Add filter bar (stage, priority, assignee, due date). Add GroupBySelector + ViewModeToggle. Replace PrimeVue DataTable entirely. Remove all PrimeVue imports. Props: `defineProps<Props>()` with `tasks: Table<TaskResource>`, `stages: StageOption[]`, `priorities: PriorityOption[]`, `templates: TaskTemplate[]`, `boardOptions: BoardOption[]`. File: `resources/js/Pages/Tasks/Index.vue`

- [ ] T050 Create composable `useTaskGrouping.ts` — accepts `tasks: TaskResource[]`, `groupBy: GroupByOption`. Returns `{ groups: ComputedRef<TaskGroup[]> }` where `TaskGroup = { label: string, key: string, tasks: TaskResource[], count: number }`. Handles grouping by stage (enum order), priority (enum order), assignee (alphabetical), due_date (Overdue/Today/This Week/This Month/Later/No Due Date), tags (alphabetical). Missing values go to "Unassigned"/"No Due Date" group at end. File: `resources/js/composables/useTaskGrouping.ts`

- [ ] T051 Create `Components/Task/TaskTableGroup.vue` — collapsible group header with chevron icon, group label, and task count. Props: `defineProps<Props>()` with `label: string`, `count: number`, `collapsed: boolean`. Emits: `defineEmits<Emits>()` with `(e: 'toggle'): void`. Uses CommonCollapsible or custom div with transition. File: `resources/js/Components/Task/TaskTableGroup.vue`

- [ ] T052 [P] Create `Components/Task/GroupBySelector.vue` — dropdown to select grouping option. Options: None, Stage, Priority, Assignee, Due Date, Tags. Props: `defineProps<Props>()` with `modelValue: GroupByOption`, `options: GroupByOption[]`. Emits: `defineEmits<Emits>()` with `(e: 'update:modelValue', value: GroupByOption): void`. Uses CommonSelectMenu. File: `resources/js/Components/Task/GroupBySelector.vue`

- [ ] T053 [P] Create `Components/Task/ViewModeToggle.vue` — segmented button for Table/Kanban. Props: `defineProps<Props>()` with `modelValue: 'table' | 'kanban'`. Emits: `defineEmits<Emits>()` with `(e: 'update:modelValue', value: 'table' | 'kanban'): void`. Uses CommonButton group. File: `resources/js/Components/Task/ViewModeToggle.vue`

- [ ] T054 Convert `Components/Task/TaskForm.vue` to TypeScript — add `<script setup lang="ts">`. Define `type Props = { taskId?: number; preLinkedObject?: { type: string; id: number } }`. Define `type Emits = { (e: 'form:close'): void; (e: 'form:success'): void }`. Replace PrimeVue DataTable checklist with custom checklist UI using CommonCheckbox + CommonInput + drag handles. Keep `useForm` pattern. File: `resources/js/Components/Task/TaskForm.vue`

- [ ] T055 Wire inline editing in Index.vue — add click handlers on table cells for title (CommonInput), priority (CommonSelectMenu dropdown), stage (CommonSelectMenu dropdown), due_at (CommonDatePicker), tags (CommonSelectMenu multi), assigned_users (CommonSelectMenu multi with avatars). On blur/Enter: call `PUT /tasks/{task}/inline` via axios. On Escape: revert. Show spinner during save. Show error toast on failure. File: `resources/js/Pages/Tasks/Index.vue`

- [ ] T056 [P] Due date visual indicators in table — add conditional classes to due_at cell: `text-red-600 font-medium` if overdue (`due_at < today`), `text-amber-600` if due within 24 hours. Apply same to Kanban cards later (T064). File: `resources/js/Pages/Tasks/Index.vue`

- [ ] T057 [P] Confetti on task completion — wire `vue-confetti-explosion` when user changes stage to COMPLETED (via checkbox click or inline edit). Trigger confetti at the task row position. Respect `prefers-reduced-motion`. File: `resources/js/Pages/Tasks/Index.vue`

- [ ] T058 Persist grouping preference — when user changes groupBy, save to user preferences via `PUT /user/preferences` (or existing user settings endpoint). On page load, read from Inertia shared props. File: `resources/js/Pages/Tasks/Index.vue`, backend: add `task_group_by` to user preferences.

---

## Phase 5: Kanban Board [US2]

_Depends on Phase 4 (Index.vue rewrite, ViewModeToggle). Delivers Kanban view._

- [ ] T059 Install vuedraggable — `npm install vuedraggable@next` (Vue 3 compatible). File: `package.json`

- [ ] T060 Create `Components/Task/KanbanBoard.vue` — 5-column layout (one per TaskStageEnum value). Props: `defineProps<Props>()` with `tasks: TaskResource[]`, `stages: StageOption[]`. Emits: `defineEmits<Emits>()` with `(e: 'stage-change', taskId: number, newStage: string): void`. Responsive: horizontal scroll on tablet, hidden on mobile (<768px). File: `resources/js/Components/Task/KanbanBoard.vue`

- [ ] T061 [P] Create `Components/Task/KanbanColumn.vue` — single column with stage header (name + count + colour dot), vuedraggable card list. Props: `defineProps<Props>()` with `stage: StageOption`, `tasks: TaskResource[]`. Emits: `defineEmits<Emits>()` with `(e: 'task-drop', taskId: number): void`. Drop zone highlight on drag over. File: `resources/js/Components/Task/KanbanColumn.vue`

- [ ] T062 [P] Create `Components/Task/TaskCard.vue` — Kanban card showing title, priority badge (CommonBadge), due date (with overdue/due-soon colours), assignee avatar (CommonAvatarGroup), subtask progress (`completed/total`). Visual states: red left border if overdue, amber if due <24h, muted+strikethrough if completed. Click opens task modal. Props: `defineProps<Props>()` with `task: TaskResource`. Emits: `defineEmits<Emits>()` with `(e: 'click', taskId: number): void`, `(e: 'complete', taskId: number): void`. File: `resources/js/Components/Task/TaskCard.vue`

- [ ] T063 Wire Kanban in Index.vue — conditionally render KanbanBoard when `viewMode === 'kanban'`. On `stage-change` emit: call `PUT /tasks/{task}/stage` via axios, optimistic update, revert on error. Share filter state between table and Kanban (same filters apply to both views). File: `resources/js/Pages/Tasks/Index.vue`

- [ ] T064 [P] Kanban confetti — trigger `vue-confetti-explosion` when a card is dropped into COMPLETED column. File: `resources/js/Components/Task/KanbanBoard.vue`

---

## Phase 6: Keyboard Shortcuts + Command Palette [US5]

_Depends on Phase 4 (Index.vue). Can run in parallel with Phase 5._

- [ ] T065 Create composable `useTaskKeyboard.ts` — registers keyboard shortcuts on mount, removes on unmount. Guards: skip shortcuts when focus is inside `<input>`, `<textarea>`, `<select>`, or `[contenteditable]`. Accepts callback map: `{ 'c': () => void, 'e': () => void, ... }`. Uses `@vueuse/core` `useEventListener`. File: `resources/js/composables/useTaskKeyboard.ts`

- [ ] T066 Wire shortcuts in Index.vue — `C` → `openTaskDialog()`, `E` → `openTaskDialog(selectedTaskId)`, `A` → open assignee inline edit on selected, `P` → open priority inline edit, `D` → open due date inline edit, `/` → focus search input, `?` → toggle shortcuts overlay, `1-5` → call `UpdateTaskStage` on selected task, `↑/↓` → navigate selected task, `Space` → toggle task checkbox, `Escape` → clear selection. File: `resources/js/Pages/Tasks/Index.vue`

- [ ] T067 [P] Create `Components/Task/KeyboardShortcutsOverlay.vue` — modal overlay showing all shortcuts grouped by category (Task Actions, Navigation, Stage, Help). Props: `defineProps<Props>()` with `visible: boolean`. Emits: `defineEmits<Emits>()` with `(e: 'close'): void`. Uses CommonModal with `side="center"`. File: `resources/js/Components/Task/KeyboardShortcutsOverlay.vue`

- [ ] T068 Extend CommonCommandPalette for tasks — when on `/tasks` route, add task-specific commands: "Create new task", "Go to Kanban", "Go to Table", recent tasks search. Register commands via existing command palette extension pattern. File: `resources/js/Components/Common/CommonCommandPalette.vue` (extend, don't rewrite)

---

## Phase 7: Subtasks + Comments + Activity [US6] [US7]

_Depends on Phase 2 (comment actions) + Phase 4 (TaskForm rewrite)._

- [ ] T069 Create `Components/Task/SubtaskList.vue` — list of subtasks with checkbox (complete toggle), title, priority badge, add-new input at bottom. Props: `defineProps<Props>()` with `parentId: number`, `subtasks: TaskResource[]`. Emits: `defineEmits<Emits>()` with `(e: 'subtask-added'): void`, `(e: 'subtask-completed', taskId: number): void`. Add subtask: calls `POST /tasks` with `parent_id`. Toggle complete: calls `PUT /tasks/{id}/stage` with COMPLETED. File: `resources/js/Components/Task/SubtaskList.vue`

- [ ] T070 Create `Components/Task/ActivityLog.vue` — unified chronological feed of comments + Spatie activity entries. Props: `defineProps<Props>()` with `taskId: number`, `comments: TaskComment[]`, `activities: Activity[]`. Emits: `defineEmits<Emits>()` with `(e: 'comment-added'): void`. Comment input at bottom with CommonInput + submit button. @mention autocomplete (search users on `@` trigger). Delete button on own comments. File: `resources/js/Components/Task/ActivityLog.vue`

- [ ] T071 Wire SubtaskList + ActivityLog into TaskForm.vue — add SubtaskList component below checklist section (only when editing existing task). Add ActivityLog component at bottom of form (only when editing). Load subtasks and activities from TaskResource. File: `resources/js/Components/Task/TaskForm.vue`

- [ ] T072 [P] Backend: Update `TaskController@show` — eager load `subtasks` (where `parent_id = task.id`) and `activities` (Spatie activity log for this task). Return in TaskResource. File: `domain/Task/Http/Controllers/TaskController.php`

---

## Phase 8: Bulk Operations + Templates [US8] [US10]

_Depends on Phase 4 (Index.vue) + Phase 2 (BulkUpdateTasks, template actions)._

- [ ] T073 Create composable `useTaskSelection.ts` — manages `selectedTaskIds: Set<number>`. Methods: `toggle(id)`, `selectRange(fromId, toId, allIds)` (for Shift+click), `selectAll(allIds)`, `clear()`, `isSelected(id)`. Computed: `selectedCount`. File: `resources/js/composables/useTaskSelection.ts`

- [ ] T074 Wire selection in Index.vue — add CommonCheckbox to each table row. Header checkbox for select all. Shift+click range selection via `useTaskSelection.selectRange()`. Show selected count. File: `resources/js/Pages/Tasks/Index.vue`

- [ ] T075 Create `Components/Task/BulkActionBar.vue` — fixed bottom bar (sticky viewport bottom, `position: fixed; bottom: 0; z-index: 50`). Shows: selected count, Set Stage dropdown (CommonSelectMenu), Set Priority dropdown, Assign dropdown, close (×) button. Props: `defineProps<Props>()` with `selectedCount: number`, `stages: StageOption[]`, `priorities: PriorityOption[]`. Emits: `defineEmits<Emits>()` with `(e: 'bulk-update', field: string, value: string | number[]): void`, `(e: 'clear'): void`. File: `resources/js/Components/Task/BulkActionBar.vue`

- [ ] T076 Wire BulkActionBar in Index.vue — show when `selectedCount > 0`. On `bulk-update` emit: call `POST /tasks/bulk` with selected task IDs and field/value. On success: reload table, clear selection, show success toast. File: `resources/js/Pages/Tasks/Index.vue`

- [ ] T077 Add template picker to TaskForm.vue — add CommonSelectMenu at top of form: "From template" dropdown listing available templates. On template select: populate title, description, priority, tags, checklist from template data. User can modify before saving. File: `resources/js/Components/Task/TaskForm.vue`

- [ ] T078 [P] Template admin UI — create admin page or modal for managing task templates. List templates with edit/delete. Create form with: name, title, description, priority, tags, checklist. Wire to template CRUD endpoints. File: `resources/js/Pages/Tasks/Templates.vue` (or modal component)

---

## Phase 9: Business Object Integration + Polish [US9] [US11]

_Depends on Phase 3 (linkable actions). Can start controller work in parallel._

- [ ] T079 Create `Components/Task/RelatedTasksPanel.vue` — embeddable panel showing tasks linked to a business object. Props: `defineProps<Props>()` with `linkableType: string`, `linkableId: number`, `tasks: TaskResource[]`. Emits: `defineEmits<Emits>()` with `(e: 'task-click', taskId: number): void`. Shows task list with title, stage badge, priority badge, due date. "Add task" button opens task modal with pre-linked object. Uses CommonBadge, CommonButton. File: `resources/js/Components/Task/RelatedTasksPanel.vue`

- [ ] T080 Embed RelatedTasksPanel on business object pages — add to client detail, package detail, bill detail, risk detail pages. Load tasks via `TaskRepository::getTaskableTasks()` (refactor to use `task_linkables` table). Pass as Inertia prop. File: multiple page files (client Show.vue, package Show.vue, etc.)

- [ ] T081 [P] Empty states — add `CommonEmptyPlaceholder` for: no tasks (icon: clipboard, message: "No tasks yet", CTA: "+ New Task" button), no filter results (message: "No tasks match your filters", CTA: "Clear filters" link). File: `resources/js/Pages/Tasks/Index.vue`

- [ ] T082 [P] Mobile responsive — ensure table view works on mobile (<768px): reduce columns to title + stage + priority only, tap row opens modal. Hide Kanban toggle on mobile. Hide keyboard shortcuts on mobile. Collapse filter bar on mobile. File: `resources/js/Pages/Tasks/Index.vue`

---

## Dependency Graph

```
Phase 1 (T001-T015) ─────────────────────────────┐
                                                   │
Phase 2 (T016-T029) ──────────────────────────────┤
                                                   │
Phase 3 (T030-T045) ──────────────────────────────┤
                                                   │
Phase 4 (T046-T058) ──────────────────────────────┤── Phase 5 (T059-T064) Kanban
                                                   │
                                                   ├── Phase 6 (T065-T068) Keyboard [P with Phase 5]
                                                   │
                                                   ├── Phase 7 (T069-T072) Subtasks + Comments
                                                   │
                                                   ├── Phase 8 (T073-T078) Bulk + Templates
                                                   │
                                                   └── Phase 9 (T079-T082) Integration + Polish

Phases 5, 6, 7, 8 can run in parallel after Phase 4.
Phase 9 can start after Phase 3 (backend) but UI needs Phase 4.
```

---

## Summary

| Phase | Tasks | Parallel | Focus |
|-------|-------|----------|-------|
| 1. Backend Foundation | T001-T015 (15) | 9 [P] | Migrations, enums, models, data classes, policies |
| 2. Core Actions | T016-T029 (14) | 12 [P] | Store, update, delete, inline, bulk, comments, templates |
| 3. Backend Tables & Controllers | T030-T045 (16) | 7 [P] | BaseTable, controller refactor, new routes, cleanup |
| 4. Frontend Core | T046-T058 (13) | 4 [P] | TypeScript, CommonTable, inline editing, grouping |
| 5. Kanban Board | T059-T064 (6) | 3 [P] | vuedraggable, cards, drag-and-drop |
| 6. Keyboard Shortcuts | T065-T068 (4) | 1 [P] | useTaskKeyboard, command palette |
| 7. Subtasks + Comments | T069-T072 (4) | 1 [P] | SubtaskList, ActivityLog, @mentions |
| 8. Bulk + Templates | T073-T078 (6) | 1 [P] | Selection, BulkActionBar, template admin |
| 9. Integration + Polish | T079-T082 (4) | 2 [P] | RelatedTasksPanel, empty states, mobile |
| **Total** | **82** | **40 [P]** | |
