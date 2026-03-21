---
title: "Plan"
---


**Epic Code**: TSK
**Initiative**: Work Management
**Spec**: [spec.md](./spec.md)
**Design**: [spec-design.md](./spec-design.md)
**Created**: 2026-01-03
**Updated**: 2026-01-03 (added design spec integration)
**Status**: Draft
**Owner**: William Whitelaw
**Target Delivery**: March 2026

---

## Summary

Build a modern task management system with Kanban board, table view, keyboard shortcuts, and **Work Stream context switching** (from design spec). Replace the low-adoption v1 system with an Asana/Linear-inspired UX featuring:

- **Sidebar context menu** with Work Streams (teams)
- **Kanban board** with drag-drop status updates + confetti completion
- **Enhanced table view** with inline editing, filtering, sorting
- **Keyboard shortcuts** (Linear-style) with contextual command palette
- **Subtasks** with progress tracking
- **Activity log** for all changes
- **Care partner** read-only visibility

**Target**: 60%+ user adoption within 3 months of launch.

**Deferred to Phase 2**:
- AI-recommended tasks (requires separate planning)

---

## Technical Context

**Language/Version**: PHP 8.3+ / Laravel 12
**Frontend**: Vue 3 + Inertia.js v2 + TypeScript
**Primary Dependencies**: Spatie Laravel Data (DTOs), Headless UI (components)
**Storage**: MySQL (existing Task tables)
**Testing**: Pest v3 (unit + feature), Dusk v8 (browser)
**Target Platform**: Web (Laravel Herd local, production server)
**Project Type**: Majestic Monolith (domain-driven)
**Performance Goals**: <1s drag-drop, <2s filter (500 tasks), <30s task creation
**Constraints**: WCAG 2.1 AA accessibility, keyboard navigation required
**Scale/Scope**: ~500 tasks/user, 3 user roles (internal, coordinator, care partner)

---

## Constitution Check

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Majestic Monolith | ✅ Pass | All in `/domain/Task/`, no microservices |
| II. Domain-Driven Design | ✅ Pass | Extend existing `/domain/Task/` structure |
| III. Convention Over Configuration | ✅ Pass | Follow existing Task patterns |
| IV. Code Quality Standards | ✅ Pass | Type hints, descriptive names, <20 line methods |
| V. Testing is First-Class | ✅ Pass | >90% coverage target for business logic |
| VII. Laravel Data for DTOs | ✅ Pass | Use Data classes for task operations |
| VIII. Action Classes | ✅ Pass | One action per use case |
| X. Inertia.js + Vue 3 | ✅ Pass | No API calls from frontend |
| XI. Component Library & Tailwind | ✅ Pass | Headless UI, WCAG 2.1 AA |
| XII. Design System | ✅ Pass | Keyboard support, 24-44px touch targets |
| XIII. Progress Over Perfection | ✅ Pass | Ship core features, defer AI to Phase 2 |
| XIV. Feature Flags | ✅ Pass | Use for gradual rollout |
| XV. Permissions & Authorization | ✅ Pass | Policies for task visibility by role |
| XVI. Compliance & Audit | ✅ Pass | Activity log for all changes |
| XVII. Code Formatting | ✅ Pass | Pint enforced |

**No violations.** Plan aligns with constitution.

---

## Existing System Analysis

### Current State (from codebase research)

**What Exists:**
- `Task` model with: title, description, priority (enum), stage (enum), due_at, tags, checklist, parent_id, is_recurring
- `TaskAssignable` pivot for User/Team assignments
- `TaskComment` model for comments
- `TaskTag` model for tagging
- Polymorphic `taskable_type`/`taskable_id` (only Package implemented)
- DataTable UI with filtering (no Kanban)
- `DuplicateTask` action for recurring tasks
- Repository pattern (`TaskRepository`)

**What's Missing (to build):**
- Kanban board component
- Keyboard shortcuts / command palette
- Activity log (beyond comments)
- Extended taskable types (Patient, Risk, Bill, Supply, Coordinator)
- Care partner visibility restrictions
- Due date visual indicators (overdue, urgent)

### Files to Modify/Create

**Backend:**
- `domain/Task/Models/Task.php` — Add `is_sensitive` field, activity relationship
- `domain/Task/Models/TaskActivity.php` — NEW: Activity log model
- `domain/Task/Actions/UpdateTaskStatusAction.php` — NEW: Status change with logging
- `domain/Task/Actions/CreateSubtaskAction.php` — NEW: Subtask creation
- `domain/Task/Policies/TaskPolicy.php` — Add care partner restrictions
- `database/migrations/xxxx_add_task_activity_table.php` — NEW
- `database/migrations/xxxx_add_is_sensitive_to_tasks.php` — NEW

**Frontend:**
- `resources/js/Pages/Tasks/Index.vue` — Add Kanban view toggle
- `resources/js/Components/Tasks/KanbanBoard.vue` — NEW: Kanban component
- `resources/js/Components/Tasks/TaskCard.vue` — NEW: Draggable task card
- `resources/js/Components/Tasks/CommandPalette.vue` — NEW: Cmd+K palette
- `resources/js/Components/Tasks/KeyboardShortcuts.vue` — NEW: Help overlay
- `resources/js/Components/Tasks/ActivityLog.vue` — NEW: Activity timeline
- `resources/js/Components/Tasks/SubtaskList.vue` — NEW: Subtask management
- `resources/js/Composables/useKeyboardShortcuts.ts` — NEW: Keyboard handling

---

## Data Model Changes

### New: TaskActivity

```
task_activities
├── id (bigint, PK)
├── task_id (bigint, FK → tasks.id)
├── user_id (bigint, FK → users.id)
├── action (string) — 'created', 'status_changed', 'assigned', 'commented', etc.
├── old_value (json, nullable)
├── new_value (json, nullable)
├── created_at (timestamp)
```

### Modify: tasks

```
tasks (existing)
├── + is_sensitive (boolean, default false) — Hide from care partners
├── + work_stream_id (bigint, nullable, FK → work_streams.id)
└── (existing fields unchanged)
```

### New: work_streams (from design spec)

```
work_streams
├── id (bigint, PK)
├── name (string)
├── icon (string, nullable)
├── color (string, nullable)
├── organisation_id (bigint, FK → organisations.id)
├── created_at, updated_at (timestamps)

work_stream_user (pivot)
├── work_stream_id (bigint, FK)
├── user_id (bigint, FK)
```

### Extend: Taskable Relationships

Add `morphMany(Task::class, 'taskable')` to:
- `Patient` model
- `Risk` model
- `Bill` model (if exists)
- `Supply` model (if exists)
- `Coordinator` model (if exists, or Staff)

---

## API Contracts

### Existing Endpoints (enhance)

| Method | Endpoint | Enhancement |
|--------|----------|-------------|
| `GET` | `/tasks` | Add `view=kanban` query param |
| `PUT` | `/tasks/{id}` | Log activity on status change |
| `GET` | `/tasks/search` | Add care partner filtering |

### New Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/tasks/{id}/activities` | Get activity log for task |
| `POST` | `/tasks/{id}/subtasks` | Create subtask |
| `PATCH` | `/tasks/{id}/status` | Quick status update (for drag-drop) |

---

## UI Components (from design spec)

### Existing Components (Reuse)

| Component | Usage |
|-----------|-------|
| `CommonCommandPalette.vue` | Extend for task-specific commands |
| `CommonSplitter.vue` | Sidebar + content layout |
| `CommonSelectMenu.vue` | Status/Priority inline dropdowns |
| `TaskForm.vue` | Task detail modal (extend for subtasks/activity) |
| `ConfettiExplosion` | Task completion celebration |

### New Components (Create)

| Component | Purpose |
|-----------|---------|
| `TaskCard.vue` | Kanban card (title, priority, due date, assignee, subtask progress) |
| `KanbanColumn.vue` | Single column with header + card list |
| `KanbanBoard.vue` | 3-column drag-drop container using vuedraggable@next |
| `WorkStreamSidebar.vue` | Context menu sidebar with My Tasks, Work Streams |
| `TaskStatsBar.vue` | Stats banner (tasks count, completed, points) |
| `KeyboardShortcuts.vue` | `?` help overlay |
| `TaskCommandPalette.vue` | Task-specific command palette (contextual) |
| `SubtaskList.vue` | Subtask checklist in task detail |
| `ActivityLog.vue` | Activity/comment feed |
| `RelatedTasksPanel.vue` | Tasks panel for Patient/Package detail views |
| `InlineTaskCreate.vue` | Quick add row in table view |

### New Composables

| Composable | Purpose |
|------------|---------|
| `useKeyboardShortcuts.ts` | Global keyboard shortcut handling |
| `useTaskSelection.ts` | Track selected task for keyboard actions |

---

## Implementation Phases

### Phase 1: Foundation (Sprint 1)

**Database & Models:**
- [ ] Create `task_activities` migration
- [ ] Add `is_sensitive` to tasks migration
- [ ] Create `TaskActivity` model with relationships
- [ ] Update `Task` model with activity relationship

**Actions:**
- [ ] Create `UpdateTaskStatusAction` with activity logging
- [ ] Create `CreateSubtaskAction`
- [ ] Create `LogTaskActivityAction`

**Policies:**
- [ ] Update `TaskPolicy` for care partner restrictions

### Phase 1b: Work Streams & Layout (Sprint 1-2) - FROM DESIGN SPEC

**Database & Models:**
- [ ] Create `work_streams` migration
- [ ] Create `work_stream_user` pivot migration
- [ ] Add `work_stream_id` to tasks migration
- [ ] Create `WorkStream` model with relationships

**Endpoints:**
- [ ] `GET /work-streams` - list user's work streams
- [ ] `POST /work-streams` - create work stream
- [ ] Add `work_stream_id` filter to `TaskController@index`

**Frontend:**
- [ ] Create `WorkStreamSidebar.vue` component
- [ ] Create `TaskStatsBar.vue` component
- [ ] Update `Tasks/Index.vue` with sidebar layout

### Phase 2: Kanban & Table Enhancements (Sprint 2-3)

**Backend:**
- [ ] Enhance `TaskRepository` with Kanban grouping
- [ ] Add `/tasks/{id}/status` endpoint for quick updates
- [ ] Add `/tasks/{id}/activities` endpoint

**Frontend:**
- [ ] Create `TaskCard.vue` component with visual states
- [ ] Create `KanbanColumn.vue` component
- [ ] Create `KanbanBoard.vue` with vuedraggable@next
- [ ] Update `Index.vue` with view toggle (Kanban/Table)
- [ ] Create `InlineTaskCreate.vue` for quick add row
- [ ] Add inline editing for Status/Priority cells
- [ ] Add checkbox completion with confetti
- [ ] Implement table sorting and filtering enhancements

### Phase 3: Keyboard & Command Palette (Sprint 4)

**Frontend:**
- [ ] Create `useKeyboardShortcuts.ts` composable
- [ ] Create `useTaskSelection.ts` composable
- [ ] Create `TaskCommandPalette.vue` component (contextual)
- [ ] Create `KeyboardShortcuts.vue` help overlay
- [ ] Implement all shortcuts: C, E, A, D, /, 1-9, ?
- [ ] Implement chord navigation: G then T, G then K
- [ ] Add focus management for accessibility

### Phase 4: Subtasks & Activity (Sprint 6)

**Backend:**
- [ ] Create `/tasks/{id}/subtasks` endpoint
- [ ] Enhance task queries to include subtask counts

**Frontend:**
- [ ] Create `SubtaskList.vue` component
- [ ] Create `ActivityLog.vue` component
- [ ] Add subtask progress indicator to TaskCard
- [ ] Integrate activity log into task detail modal

### Phase 5: Care Partner & Polish (Sprint 6-7)

**Backend:**
- [ ] Implement care partner task filtering
- [ ] Add `is_sensitive` filtering logic
- [ ] Ensure all endpoints respect role permissions

**Frontend:**
- [ ] Create care partner read-only task view
- [ ] Hide edit/assign actions for care partners
- [ ] Due date visual indicators (overdue red, urgent yellow)
- [ ] Performance optimization (pagination, lazy loading)
- [ ] Accessibility audit (WCAG 2.1 AA)
- [ ] Respect `prefers-reduced-motion` for confetti

**Responsive (from design spec):**
- [ ] Force list view on mobile (<768px)
- [ ] Convert sidebar to hamburger menu on mobile
- [ ] Convert Work Stream selector to dropdown on mobile

**Testing:**
- [ ] Unit tests for all Actions
- [ ] Feature tests for all endpoints
- [ ] Feature test for Work Streams
- [ ] Browser tests for Kanban drag-drop, keyboard shortcuts
- [ ] Browser tests for inline editing, confetti completion

---

## Testing Strategy

### Unit Tests (`tests/Unit/`)

- `UpdateTaskStatusActionTest` — Status changes, activity logging
- `CreateSubtaskActionTest` — Subtask creation, parent linking
- `LogTaskActivityActionTest` — Activity record creation
- `TaskPolicyTest` — Role-based access control

### Feature Tests (`tests/Feature/`)

- `TaskKanbanTest` — Kanban view, drag-drop status updates
- `TaskFilterTest` — Table filtering, sorting
- `TaskSubtaskTest` — Subtask CRUD operations
- `TaskActivityTest` — Activity log retrieval
- `CarePartnerTaskAccessTest` — Read-only visibility, sensitive filtering

### Browser Tests (`tests/Browser/`)

- Kanban drag-drop interaction
- Keyboard shortcuts (Cmd+K, C, E, etc.)
- Command palette search and selection
- Task creation in under 30 seconds

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Drag-drop performance with 100+ tasks | Medium | High | Virtualize list, paginate columns |
| Keyboard shortcuts conflict with browser | Low | Medium | Use Cmd/Ctrl modifiers, test across browsers |
| Care partner data leakage | Low | High | Strict policy enforcement, test coverage |
| March deadline pressure | High | High | Scope controlled (AI deferred), feature flag rollout |
| Existing task data migration | Low | Medium | No breaking changes to existing schema |

---

## Feature Flag Strategy

```php
// config/features.php
'advanced_task_management' => [
    'enabled' => env('FEATURE_ADVANCED_TASKS', false),
    'rollout_percentage' => 0,
],

// Specific flags
'task_kanban_view' => env('FEATURE_TASK_KANBAN', false),
'task_keyboard_shortcuts' => env('FEATURE_TASK_SHORTCUTS', false),
'task_care_partner_visibility' => env('FEATURE_TASK_CARE_PARTNER', false),
```

**Rollout Plan:**
1. Internal testing (10%) — Week 1 post-development
2. Coordinator beta (50%) — Week 2
3. Full rollout (100%) — Week 3
4. Care partner visibility — Week 4 (after coordinator feedback)

---

## Next Steps

1. → `/speckit.tasks` — Generate dependency-ordered task list
2. → `/trilogy.mockup` — Create UI mockups for Kanban, Command Palette
3. → `/speckit.implement` — Begin Phase 1 development

---

## Appendix: Keyboard Shortcuts Reference

| Shortcut | Action | Context |
|----------|--------|---------|
| `Cmd/Ctrl+K` | Open command palette | Anywhere |
| `C` | Create new task | Task list |
| `E` | Edit selected task | Task selected |
| `A` | Assign selected task | Task selected |
| `D` | Set due date | Task selected |
| `/` | Focus filter/search | Task list |
| `1-9` | Move to column 1-9 | Task selected |
| `↑↓` | Navigate tasks | Task list |
| `Enter` | Open task details | Task selected |
| `?` | Show shortcuts help | Anywhere |
