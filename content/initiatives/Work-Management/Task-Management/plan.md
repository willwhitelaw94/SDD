---
title: "Implementation Plan: Task Management V2"
---

# Implementation Plan: Task Management V2

**Branch**: `feature/tasks-mvp` | **Date**: 2026-03-19 | **Spec**: [spec.md](spec.md) | **Design**: [design.md](design.md)
**Status**: In Progress (Phase 1-5 complete, V2 evolution in progress)

## Summary

Evolve the existing task management system into a **three-view task hub** (List + Board + Dashboard) with Asana-style progress tracking, ClickUp-style density options, TanStack Table inline editing, and chain-add quick capture.

**Design direction** (from design challenge, 2026-03-19): Asana Ada's progress-focused layout + ClickUp Carl's density + Linear Lisa's keyboard-first + Notion Nate's edit patterns.

### What's Already Built (Phase 1-5)
- Full backend: Actions, Data classes, TaskPolicy, migrations, API endpoints
- Vue frontend: custom task table with grouping, kanban (compact/standard/swimlane), global modal dialog, subtasks, comments, activity log, bulk operations, keyboard shortcuts, templates
- All components TypeScript with proper typing

### V2 Evolution (This Plan)
1. **Migrate from custom table to @inertiaui/table** (TanStack Table) — built-in inline editing, column resizing, density
2. **Add Dashboard view** — Asana-style time-based sections with progress bars + stats cards
3. **Add Quick Add** — Inline chain-add at bottom of each section (Enter saves → next row auto-focuses)
4. **Add Quick Filter Chips** — Asana-style toggleable filter chips (Incomplete, Completed, My tasks, Due this week)
5. **Add Density Toggle** — Compact/Normal mode, persisted per user
6. **Refine the UI** — Cleaner, less colourful, TC design system tokens only

---

## Technical Context

**Language/Version**: PHP 8.4 / Laravel 12
**Frontend**: Vue 3 + Inertia.js v2 + TypeScript + Tailwind v3
**Database**: MySQL
**Testing**: Pest 3 (Unit + Feature), Playwright (Browser)
**Target Platform**: Web (desktop-first, responsive)
**Performance Goals**: Page load <2s for 500 tasks, inline edits <500ms, grouping <2s
**Scale/Scope**: ~15 tables/models, ~20 Vue components, ~10 API endpoints

---

## Gate 3 Pre-Check Notes

| # | Finding | Severity | Resolution |
|---|---------|----------|------------|
| 1 | Index.vue uses PrimeVue DataTable | RED FLAG | Rewrite with CommonTable/BaseTable pattern |
| 2 | TaskForm.vue + Index.vue lack `lang="ts"` | RED FLAG | Convert all Vue to TypeScript |
| 3 | dialog.js is untyped JS | WARN | Convert to `.ts` with proper types |
| 4 | No TaskPolicy — auth returns `true` | WARN | Create proper TaskPolicy |
| 5 | TaskService has unimplemented methods | RED FLAG | Implement or refactor to Actions |
| 6 | Controller does direct Model operations | WARN | Refactor to Actions (AsAction) |
| 7 | No Data classes for request validation | WARN | Create Laravel Data classes |
| 8 | StageEnum has dead methods | MINOR | Clean up dead code |
| 9 | Two dead WIP components (CreateTask.vue, CreateTaskForm.vue) | MINOR | Delete |
| 10 | Taskable is MorphTo (single) — spec needs many-to-many | RED FLAG | New `task_linkables` pivot table |

---

## Existing Infrastructure

### What Exists (Keep/Refactor)

**Backend:**
- `domain/Task/Models/Task.php` — Core model with relationships, Spatie activity log, soft deletes
- `domain/Task/Models/TaskAssignable.php` — Polymorphic pivot for users + teams
- `domain/Task/Models/TaskComment.php` — Comment model
- `domain/Task/Models/TaskTag.php` — Tag model
- `domain/Task/Enums/TaskStageEnum.php` — NOT_STARTED, IN_PROGRESS, APPROVED, ON_HOLD, COMPLETED
- `domain/Task/Enums/TaskPriorityEnum.php` — LOW, MEDIUM, HIGH
- `domain/Task/Routes/taskRoutes.php` — Full CRUD + search + comments
- `domain/Task/Repositories/TaskRepository.php` — Board-based filtering, search, sort
- `domain/Task/Http/Resources/TaskResource.php` — API resource
- `domain/Task/Actions/DuplicateTask.php` — Recurring task duplication

**Frontend:**
- `resources/js/Components/Task/TaskForm.vue` — Full create/edit form (needs TS conversion)
- `resources/js/Components/Common/CommonModalContainer.vue` — Global modal with TaskForm + event bus
- `resources/js/composables/dialog.js` — Task dialog open/close (needs TS conversion)

**Database:**
- `tasks` table — id, title, description, task_priority, task_stage, start_at, due_at, taskable_type, taskable_id, created_by, tags (JSON), checklist (JSON), parent_id, is_recurring, recurring_days, soft deletes
- `task_assignables` — polymorphic pivot for users + teams
- `task_comments` — task comments
- `task_tags` — tag labels

### What Needs to Change

| Area | Current | Target |
|------|---------|--------|
| Taskable linking | MorphTo (single) | Polymorphic many-to-many (`task_linkables` pivot) |
| Controller | Direct Eloquent in controller | Actions pattern (AsAction) |
| Request validation | StoreUpdateTaskRequest | Laravel Data classes |
| Frontend table | PrimeVue DataTable | CommonTable + BaseTable |
| Vue TypeScript | Missing `lang="ts"` | All components TypeScript |
| Policy | None (returns `true`) | TaskPolicy with proper gates |
| Priority enum | LOW, MEDIUM, HIGH | Add URGENT, NO_PRIORITY |
| TaskService | Broken stubs | Delete (use Actions instead) |

---

## Data Model

### Schema Changes

#### New Table: `task_linkables`
Polymorphic many-to-many pivot replacing the single `taskable_type`/`taskable_id` columns.

```
task_linkables
├── id (bigint PK)
├── task_id (bigint FK → tasks)
├── linkable_type (varchar) — e.g., "Domain\Client\Models\Client"
├── linkable_id (bigint)
├── created_at (timestamp)
└── updated_at (timestamp)
```
**Index**: `(task_id, linkable_type, linkable_id)` unique composite

#### New Table: `task_templates`
Admin-created task templates.

```
task_templates
├── id (bigint PK)
├── name (varchar) — template name
├── title (text) — default task title
├── description (text nullable)
├── task_priority (varchar nullable) — default priority
├── tags (json nullable) — default tags
├── checklist (json nullable) — default checklist items
├── created_by (bigint FK → users)
├── created_at (timestamp)
└── updated_at (timestamp)
```

#### Migration: Alter `tasks` table
- Add `URGENT` to task_priority enum values (handled by enum, not DB constraint)
- Keep `taskable_type`/`taskable_id` for backwards compatibility during migration, then deprecate
- Ensure `parent_id` foreign key exists (self-referential)

### Entity Relationships

```
Task
├── belongsTo User (createdBy)
├── belongsTo Task (parentTask — self-referential via parent_id)
├── hasMany Task (subtasks — inverse of parentTask)
├── hasMany TaskAssignable → morphTo User | Team
├── hasMany TaskLinkable → morphTo Client | Package | Bill | Risk | Supply | Incident | Referral | ...
├── hasMany TaskComment
├── morphMany Activity (Spatie)
└── belongsTo TaskTemplate (nullable — tracks which template was used)

TaskTemplate
├── belongsTo User (createdBy)
└── hasMany Task (tasks created from this template)

TaskTag (standalone lookup)
└── used via JSON array on Task.tags (no pivot table — tags stored as string array)
```

### Updated Enums

**TaskPriorityEnum**: `NO_PRIORITY`, `LOW`, `MEDIUM`, `HIGH`, `URGENT`
**TaskStageEnum**: `NOT_STARTED`, `IN_PROGRESS`, `ON_HOLD`, `APPROVED`, `COMPLETED` (unchanged, clean dead methods)

---

## API Contracts

### Existing Endpoints (Refactor)

| Method | Route | Action | Changes |
|--------|-------|--------|---------|
| GET | `/tasks` | `TaskController@index` | Refactor to use BaseTable, add Inertia props for filters/grouping |
| GET | `/tasks/{task}` | `TaskController@show` | Return TaskResource with linkables |
| POST | `/tasks` | `StoreTask` (Action) | Refactor from controller to Action |
| PUT | `/tasks/{task}` | `UpdateTask` (Action) | Refactor from controller to Action |
| DELETE | `/tasks/{task}` | `DeleteTask` (Action) | Refactor from controller to Action |
| GET | `/tasks/search` | `SearchController@search` | Keep, enhance for autocomplete |
| GET | `/tasks/load-data` | `DataController@loadData` | Keep, add templates to response |

### New Endpoints

| Method | Route | Action | Purpose |
|--------|-------|--------|---------|
| PUT | `/tasks/{task}/stage` | `UpdateTaskStage` | Quick stage update (Kanban drag, keyboard shortcut) |
| PUT | `/tasks/{task}/inline` | `UpdateTaskInline` | Granular single-field update for inline editing |
| POST | `/tasks/bulk` | `BulkUpdateTasks` | Bulk update priority/stage/assignee |
| POST | `/tasks/{task}/linkables` | `LinkTaskable` | Add polymorphic link |
| DELETE | `/tasks/{task}/linkables/{linkable}` | `UnlinkTaskable` | Remove polymorphic link |
| GET | `/tasks/templates` | `TaskTemplateController@index` | List templates |
| POST | `/tasks/templates` | `CreateTaskTemplate` | Create template (admin) |
| PUT | `/tasks/templates/{template}` | `UpdateTaskTemplate` | Update template (admin) |
| DELETE | `/tasks/templates/{template}` | `DeleteTaskTemplate` | Delete template (admin) |

---

## Frontend Architecture

### Vue Component Specifications

All components use `<script setup lang="ts">` with named `type Props` and `type Emits`.

#### Pages/Tasks/Index.vue (REWRITE)
- **Props**: `defineProps<Props>()`:
  - `tasks: Table<TaskResource>` (BaseTable resource)
  - `stages: StageOption[]`
  - `priorities: PriorityOption[]`
  - `templates: TaskTemplate[]`
- **Key types**: `TaskResource`, `StageOption`, `PriorityOption`, `TaskTemplate`
- **Common components reused**: CommonTable, CommonBadge, CommonSelectMenu, CommonButton, CommonEmptyPlaceholder, CommonCheckbox, CommonAvatarGroup
- **State**: `viewMode: ref<'table' | 'kanban'>`, `groupBy: ref<GroupByOption>`, `selectedTasks: ref<Set<number>>`
- No Pinia store — view state is local refs, task data comes from Inertia props

#### Components/Task/TaskForm.vue (CONVERT TO TS)
- **Props**: `defineProps<Props>()`:
  - `taskId?: number`
  - `preLinkedObject?: { type: string; id: number }`
- **Emits**: `defineEmits<Emits>()`:
  - `(e: 'form:close'): void`
  - `(e: 'form:success'): void`
- **Form state**: Single `useForm` instance with all task fields
- **Common components reused**: CommonInput, CommonTextarea, CommonSelectMenu, CommonDatePicker, CommonButton, CommonSwitch

#### Components/Task/KanbanBoard.vue (NEW)
- **Props**: `defineProps<Props>()`:
  - `tasks: TaskResource[]`
  - `stages: StageOption[]`
- **Emits**: `defineEmits<Emits>()`:
  - `(e: 'stage-change', taskId: number, newStage: string): void`
- **Common components reused**: none (purpose-built Kanban layout)
- **Dependencies**: `vuedraggable` (SortableJS wrapper)

#### Components/Task/KanbanColumn.vue (NEW)
- **Props**: `defineProps<Props>()`:
  - `stage: StageOption`
  - `tasks: TaskResource[]`
- **Emits**: `defineEmits<Emits>()`:
  - `(e: 'task-drop', taskId: number): void`

#### Components/Task/TaskCard.vue (NEW)
- **Props**: `defineProps<Props>()`:
  - `task: TaskResource`
- **Emits**: `defineEmits<Emits>()`:
  - `(e: 'click', taskId: number): void`
  - `(e: 'complete', taskId: number): void`
- **Common components reused**: CommonBadge, CommonAvatarGroup

#### Components/Task/TaskTableGroup.vue (NEW)
- **Props**: `defineProps<Props>()`:
  - `label: string`
  - `count: number`
  - `collapsed: boolean`
- **Emits**: `defineEmits<Emits>()`:
  - `(e: 'toggle'): void`
- Wraps CommonTable sections with collapsible group headers

#### Components/Task/GroupBySelector.vue (NEW)
- **Props**: `defineProps<Props>()`:
  - `modelValue: GroupByOption`
  - `options: GroupByOption[]`
- **Emits**: `defineEmits<Emits>()`:
  - `(e: 'update:modelValue', value: GroupByOption): void`
- **Common components reused**: CommonSelectMenu

#### Components/Task/ViewModeToggle.vue (NEW)
- **Props**: `defineProps<Props>()`:
  - `modelValue: 'table' | 'kanban'`
- **Emits**: `defineEmits<Emits>()`:
  - `(e: 'update:modelValue', value: 'table' | 'kanban'): void`
- **Common components reused**: CommonButton (segmented group)

#### Components/Task/BulkActionBar.vue (NEW)
- **Props**: `defineProps<Props>()`:
  - `selectedCount: number`
  - `stages: StageOption[]`
  - `priorities: PriorityOption[]`
- **Emits**: `defineEmits<Emits>()`:
  - `(e: 'bulk-update', field: string, value: string): void`
  - `(e: 'clear'): void`
- **Position**: Fixed bottom bar (sticky viewport bottom)
- **Common components reused**: CommonSelectMenu, CommonButton

#### Components/Task/KeyboardShortcutsOverlay.vue (NEW)
- **Props**: `defineProps<Props>()`:
  - `visible: boolean`
- **Emits**: `defineEmits<Emits>()`:
  - `(e: 'close'): void`
- **Common components reused**: CommonModal

#### Components/Task/ActivityLog.vue (NEW)
- **Props**: `defineProps<Props>()`:
  - `taskId: number`
  - `comments: TaskComment[]`
  - `activities: Activity[]`
- **Emits**: `defineEmits<Emits>()`:
  - `(e: 'comment-added'): void`
- **Common components reused**: CommonInput, CommonButton, CommonAvatarGroup

#### Components/Task/SubtaskList.vue (NEW)
- **Props**: `defineProps<Props>()`:
  - `parentId: number`
  - `subtasks: TaskResource[]`
- **Emits**: `defineEmits<Emits>()`:
  - `(e: 'subtask-added'): void`
  - `(e: 'subtask-completed', taskId: number): void`
- **Common components reused**: CommonCheckbox, CommonButton, CommonInput

#### Components/Task/RelatedTasksPanel.vue (NEW)
- **Props**: `defineProps<Props>()`:
  - `linkableType: string`
  - `linkableId: number`
  - `tasks: TaskResource[]`
- **Emits**: `defineEmits<Emits>()`:
  - `(e: 'task-click', taskId: number): void`
- **Common components reused**: CommonBadge, CommonButton

### Composables

#### composables/useTaskKeyboard.ts (NEW)
Keyboard shortcut handler for task pages. Registers/unregisters shortcuts on mount/unmount. Not a Pinia store — pure composable with event listeners.

#### composables/useTaskGrouping.ts (NEW)
Client-side grouping logic. Takes flat task array + groupBy option, returns grouped structure. Pure function, no state management.

#### composables/useTaskSelection.ts (NEW)
Multi-select state for bulk operations. Handles checkbox toggle, Shift+click range select, select all, clear. Local reactive state, not a Pinia store.

### Shared Types

Location: `resources/js/types/task.ts`

```typescript
type TaskResource = {
  id: number
  title: string
  description: string | null
  task_priority: { value: string; label: string; colour: string }
  task_stage: { value: string; label: string; colour: string }
  start_at: string | null
  due_at: string | null
  tags: string[]
  checklist: ChecklistItem[]
  created_by: UserResource
  assigned_users: UserResource[]
  assigned_teams: TeamResource[]
  parent_task: TaskResource | null
  subtasks: TaskResource[]
  subtask_progress: { completed: number; total: number }
  linkables: TaskLinkable[]
  comments: TaskComment[]
  is_recurring: boolean
  recurring_days: number | null
  template_id: number | null
  created_at: string
  updated_at: string
}

type ChecklistItem = {
  text: string
  completed: boolean
}

type TaskComment = {
  id: number
  comment: string
  created_by: UserResource
  created_at: string
}

type TaskLinkable = {
  id: number
  linkable_type: string
  linkable_id: number
  linkable_label: string
}

type TaskTemplate = {
  id: number
  name: string
  title: string
  description: string | null
  task_priority: string | null
  tags: string[] | null
  checklist: ChecklistItem[] | null
}

type StageOption = { value: string; label: string; colour: string }
type PriorityOption = { value: string; label: string; colour: string }
type GroupByOption = 'none' | 'stage' | 'priority' | 'assignee' | 'due_date' | 'tags'
```

### Backend Table Class

#### TaskTable extends BaseTable

```php
// domain/Task/Tables/TaskTable.php

class TaskTable extends BaseTable
{
    public function resource(): Builder
    {
        return Task::query()
            ->with(['createdBy', 'assignedUsers', 'assignedTeams', 'linkables.linkable'])
            ->withCount(['subtasks', 'subtasks as completed_subtasks_count' => fn ($q) => $q->where('task_stage', 'COMPLETED')]);
    }

    public function columns(): array
    {
        return [
            TextColumn::make('title')->searchable()->sortable(),
            BadgeColumn::make('task_priority')->sortable(),
            BadgeColumn::make('task_stage')->sortable(),
            DateColumn::make('due_at')->sortable(),
            TextColumn::make('assigned_users')->searchable(),
            TextColumn::make('tags'),
            ActionColumn::make('actions'),
        ];
    }

    // Filters for stage, priority, assignee, due date range, tags
}
```

---

## Implementation Phases

### Phases 1-7: COMPLETED (Original MVP)

All original MVP phases are complete. Backend foundation, frontend table, kanban, keyboard shortcuts, subtasks, comments, bulk operations, templates, and business object integration are built and working.

---

### Phase 8: TanStack Table Migration (V2)

**Goal**: Replace custom table rows with @inertiaui/table for built-in inline editing, column resizing, and density.

1. **Install @inertiaui/table**: Verify dependency exists (already in `composer.json` and `package.json`)
2. **Create TaskTable class**: Update `domain/Task/Tables/TaskTable.php` to use InertiaUI Table column definitions with inline edit support
3. **Rewrite Index.vue list view**: Replace custom `<table>` + `TaskTableGroup` with InertiaUI Table component
4. **Inline editing columns**: Configure click-to-edit for priority (dropdown), stage (dropdown), assignee (user picker), due date (date picker), tags (multi-select), title (text input)
5. **Grouping via InertiaUI Table**: Use server-side grouping or client-side row grouping with collapsible headers
6. **Checkbox column**: Add selection column for bulk operations (keep existing `useTaskSelection` composable)
7. **Task completion checkbox**: Keep the circle checkbox in the first column that marks tasks complete
8. **Preserve existing kanban/swimlane**: Board view is separate — InertiaUI Table only affects list view
9. **Wire up existing actions**: All inline edits route to existing `UpdateTaskInline` action

### Phase 9: Quick Add (Chain-Add)

**Goal**: Asana-style inline task creation — type title, Enter, save, next row auto-focuses.

1. **QuickAddRow component**: Inline text input at bottom of each group section
2. **Chain-add behavior**: Enter saves task with defaults (Not Started, Medium, current user) → next `QuickAddRow` auto-focuses
3. **Escape exits**: Pressing Escape closes the add row and returns to normal view
4. **Tab to metadata**: Optional — Tab after title moves focus to stage/priority inline selectors
5. **Backend**: Uses existing `StoreTask` action with minimal payload (title only, rest defaults)
6. **Group context**: Quick add inherits the group's value (e.g., adding in "Urgent" group sets priority to Urgent)

### Phase 10: Quick Filter Chips

**Goal**: Asana-style toggleable filter chips above the table.

1. **QuickFilterChips component**: Row of clickable chips — Incomplete, Completed, Just my tasks, Due this week, Due next week
2. **State management**: Chips toggle on/off, multiple can be active simultaneously
3. **Server-side filtering**: Chips translate to query parameters sent to the backend
4. **Persistence**: Active chips persist in URL query params (shareable links)
5. **Integration**: Chips work alongside existing group-by and column sorting
6. **Clear all**: "Clear" button to reset all active chips

### Phase 11: Dashboard View

**Goal**: Asana-style progress dashboard — time-based sections with stats and progress bars.

1. **Add "Dashboard" tab** to view tabs (List | Board | Dashboard)
2. **Stats cards**: 3 KPI cards at top — Overdue (red), Due Today (amber), Upcoming (teal) using `CommonKpiCard`
3. **Time-based sections**: "Do Today", "Do This Week", "Do Later" as `CommonCard` sections
4. **Section progress bars**: Each section shows completion fraction + thin `CommonProgress` bar
5. **Task rows in sections**: Same as list view but grouped by due date automatically
6. **Quick add per section**: Chain-add at bottom of each section
7. **Weekly trends sidebar**: Small card showing completion count per day (last 7 days)
8. **Backend**: New endpoint or Inertia prop that groups tasks by due-date buckets with counts

### Phase 12: Density Toggle + UI Polish

**Goal**: Compact/Normal density toggle and overall UI refinement.

1. **Density toggle**: Compact/Normal button in toolbar, persisted per user (user preferences)
2. **Compact mode**: Reduced row padding, smaller font, more rows visible — target 20+ rows without scrolling
3. **Normal mode**: Current comfortable spacing
4. **Sidebar refinement**: Clean up sidebar card — board nav + group-by in one compact card
5. **Colour cleanup**: Reduce colour usage — priority dots instead of coloured badges, subtle borders, TC design system tokens only
6. **Polish**: Consistent spacing, typography hierarchy, focus states, hover states across all three views

---

## Testing Strategy

### Test Coverage by Phase

**Phase 1: Backend Tests**
- Unit: Task model relationships, enum casting, Data class validation
- Feature: CRUD actions, policy authorization, bulk update, linkables, templates
- Migration: Verify table creation, data migration from taskable to linkables

**Phase 2-3: Frontend Integration Tests**
- Feature: BaseTable endpoint returns correct structure, inline update endpoint, stage update
- Browser: Table renders, inline edit works, Kanban drag-and-drop

**Phase 4-7: Full Integration**
- Feature: Bulk update, template instantiation, comment CRUD, @mentions
- Browser: Keyboard shortcuts, command palette, bulk selection, related tasks panel

### Test Execution Checklist

- [ ] Phase 1: All backend unit + feature tests passing
- [ ] Phase 2: Table view renders with CommonTable, inline edit saves
- [ ] Phase 3: Kanban drag-and-drop updates stage
- [ ] Phase 4: Keyboard shortcuts work without conflicting with inputs
- [ ] Phase 5: Comments save and display, subtask progress calculates
- [ ] Phase 6: Bulk update applies to all selected, templates pre-populate
- [ ] Phase 7: Related tasks show on business object pages

---

## Risk Assessment

### Original Risks (Resolved)
| Risk | Status | Resolution |
|------|--------|------------|
| CommonTable can't support grouping | RESOLVED | Client-side grouping via composable works |
| PrimeVue removal breaks functionality | RESOLVED | Full rewrite complete |
| Taskable migration data loss | RESOLVED | Migration done successfully |

### V2 Risks
| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| @inertiaui/table grouping differs from current | Medium | Medium | Prototype grouping with InertiaUI Table first, fallback to current custom approach if needed |
| Chain-add conflicts with keyboard shortcuts | Medium | Low | QuickAddRow captures Enter/Escape, disables single-key shortcuts while active |
| Dashboard performance with large task sets | Low | Medium | Server-side bucketing (Do Today/This Week/Later), pagination within sections |
| Density toggle CSS complexity | Low | Low | Use Tailwind `group` classes or CSS custom properties for density |
| Inline editing UX with InertiaUI Table | Medium | Medium | Verify @inertiaui/table inline edit support matches our needs before full migration |

---

## Gate 3 Architecture Checklist

### 1. Technical Feasibility — PASS
- [x] Architecture approach clear — refactor existing domain, add new tables/actions
- [x] Existing patterns leveraged — BaseTable, Actions, Data classes, CommonTable
- [x] No impossible requirements — all spec items buildable
- [x] Performance considered — BaseTable pagination, client-side grouping, optimistic updates
- [x] Security considered — TaskPolicy, permission middleware

### 2. Data & Integration — PASS
- [x] Data model understood — existing tables + 2 new tables + 1 alter
- [x] API contracts clear — all endpoints defined with actions
- [x] Dependencies identified — vuedraggable, vue-confetti-explosion
- [x] Integration points mapped — Spatie activity log, CommonTable/BaseTable, CommonModalContainer
- [x] DTO persistence explicit — Data classes for all request validation

### 3. Implementation Approach — PASS
- [x] File changes identified — 7 phases with specific files
- [x] Risk areas noted — CommonTable grouping, PrimeVue removal, data migration
- [x] Testing approach defined — Pest unit/feature + browser tests per phase
- [x] Rollback possible — feature branch, can revert to PrimeVue table

### 4. Resource & Scope — PASS
- [x] Scope matches spec — 48 FRs mapped to 7 phases
- [x] Effort reasonable — phased delivery, existing infrastructure
- [x] Skills available — standard Laravel + Vue patterns

### 5. Laravel Best Practices — PASS
- [x] No hardcoded business logic in Vue
- [x] Cross-platform reusability — Actions work for API consumers
- [x] Laravel Data for validation
- [x] Model route binding
- [x] Common components pure
- [x] Lorisleiva Actions (AsAction)
- [x] Action authorization in authorize()
- [x] Data classes remain anemic
- [x] Migrations schema-only
- [x] Granular model policies — TaskPolicy
- [x] Feature flags dual-gated — behind `manage-tasks` permission

### 6. Vue TypeScript Standards — PASS
- [x] All Vue components use TypeScript (`lang="ts"`)
- [x] Props use named `type Props` with `defineProps<Props>()`
- [x] Emits use named `type Emits` with `defineEmits<Emits>()`
- [x] No `any` types — all backend data typed in `types/task.ts`
- [x] Shared types identified — `resources/js/types/task.ts`
- [x] Common components reused — CommonTable, CommonSelectMenu, CommonBadge, CommonInput, etc.
- [x] New components assessed for common eligibility — all new components are task-specific (bespoke)

### 7. Multi-Step Wizards — N/A
No multi-step wizard in this feature. TaskForm is a single-step form using `useForm`.

### 8. Pinia Stores — PASS
No Pinia stores proposed. All state managed via:
- `useForm` for TaskForm
- Local `ref`/`reactive` for view mode, grouping, selection
- Composables for keyboard, grouping, selection logic
- Inertia props for task data

### 9. Data Tables — PASS
- [x] BaseTable backend for tasks index
- [x] CommonTable frontend rendering
- [x] Column definitions via BaseTable columns method
- [x] Search, filter, sort via BaseTable infrastructure

**Gate 3 Result: PASS**

---

## Next Steps

1. `/speckit-tasks` — Generate V2 implementation task list (Phases 8-12)
2. `/trilogy-clarify dev` — Refine the plan further before generating tasks
3. Start implementation — Phase 8 (TanStack Table migration) first
