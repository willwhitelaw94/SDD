---
title: "Feature Specification: Task Management"
---

> **[View Mockup](/mockups/task-management/index.html)**{.mockup-link}

**Initiative**: Work Management
**Created**: 2025-12-31
**Status**: In Progress
**Owner**: William Whitelaw
**Target Delivery**: April 2026
**Feature Branch**: `feature/tasks-mvp`

---

## Clarifications

### Session 2025-12-31

- Q: Should users' grouping choice persist across sessions? → A: Yes, persist per user across sessions
- Q: Who can view/download task attachments? → A: Anyone who can view the task (inherits task visibility)
- Q: For inline checklist editing, can users add/remove/reorder items? → A: Full checklist editing inline
- Q: How should performance metrics be monitored? → A: Rely on existing app monitoring (Telescope, Horizon, APM)
- **Note**: Grouping functionality built into Common table infrastructure, reusable across other index tables
- **Note**: Review existing work on `table-filters` and `table-filters-pl` branches for reusable table components

### Session 2026-01-03

- Q: Should task dependencies (blocking/blocked by) be supported? → A: Subtasks only. No blocking dependencies. Keep it simple.
- Q: What rules trigger AI recommendations? → A: Defer AI recommendations to Phase 2. Ship core task management first.

### Session 2026-03-05

- Q: Which spec is canonical? → A: Consolidate all into one root spec.md
- Q: Stage vs Status terminology? → A: **Stage** — values: Not Started, In Progress, On Hold, Approved, Completed
- Q: Primary user role? → A: All internal users equally — no role distinction for task management
- Q: Is the global modal the primary create/edit UX? → A: Yes, global modal (CommonModalContainer + TaskForm) is primary
- Q: PrimeVue dependency? → A: No PrimeVue — custom Common table components only
- Q: Kanban in MVP? → A: Yes — Table + Kanban views for MVP
- Q: Subtask data model? → A: Self-referential parent_id on tasks table
- Q: Task-to-business-object linking? → A: Polymorphic many-to-many — tasks can link to any business object
- Q: Event sourcing for tasks? → A: No — Standard Eloquent + Spatie activity log
- Q: Saved views in MVP? → A: Deferred — user's last grouping choice persists via user preferences only
- Q: Attachments in MVP? → A: Deferred to post-MVP
- Q: Keyboard shortcuts scope? → A: Full Linear-style shortcuts in MVP
- Q: Bulk operations? → A: In MVP — multi-select, Shift+click range, bulk action bar
- Q: Comments and activity feed? → A: Both in MVP — comments with @mentions + automated activity log
- Q: Which business objects can tasks link to? → A: All business objects (polymorphic, extensible)
- Q: Due date notifications? → A: Visual indicators only (red overdue, amber due soon). No push/email notifications in MVP
- Q: Task templates? → A: In MVP — admin-created templates with title, description, checklist, default priority, default tags
- Q: Recurring tasks? → A: Deferred
- Q: Mobile responsiveness? → A: Responsive table + modal. Kanban desktop-only initially
- Q: Can tasks be created from call transcriptions? → A: **Yes** — Calls Uplift provides AI-suggested tasks from Graph. Clicking + instantly creates a task linked to the call's package. Uses existing `StoreTask` action + `task_linkables` pivot. See Calls Uplift spec FR-037–FR-040.

### Session 2026-03-19

- Q: Three views or two? → A: Three: List, Board, Dashboard
- Q: Stats cards on list view? → A: Dashboard tab only — list stays clean
- Q: Task detail: panel or modal? → A: Global modal (keep current)
- Q: Default grouping? → A: User chooses — group-by dropdown with all options
- Q: Table engine? → A: Keep custom table with InertiaUI Table backend (no inline editing in InertiaUI Table)
- Q: Quick add pattern? → A: Asana-style chain-add — Enter saves, input stays focused, Escape exits
- Q: Density toggle? → A: Compact/Normal, persisted per user

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 — View and Manage Tasks in Table View (Priority: P1)

As an internal user, I want to view my tasks in a sortable, filterable table with grouping so that I can quickly find and organize tasks by priority, stage, assignee, or due date.

**Why this priority**: The table is the primary interaction surface — users need a powerful, flexible way to scan, sort, and group tasks. Grouping transforms a flat list into an organized workspace.

**Independent Test**: Enable group-by mode, select grouping options, verify tasks organize into collapsible groups with counts. Apply filters and sorting within groups.

**Acceptance Scenarios**:

1. **Given** I am logged in, **When** I navigate to Tasks, **Then** I see all my tasks in a sortable, filterable table
2. **Given** I am viewing the task table, **When** I enable group-by and select "Priority", **Then** tasks organize into groups (Urgent, High, Medium, Low, No Priority) with counts in group headers
3. **Given** tasks are grouped, **When** I click a group header, **Then** the group expands or collapses
4. **Given** tasks are grouped, **When** I switch grouping to "Stage", **Then** tasks reorganize into stage groups without page reload
5. **Given** group-by is enabled, **When** I apply filters (date range, tags, assignee), **Then** groups update to show only matching tasks and empty groups are hidden
6. **Given** tasks are grouped, **When** I sort within a group, **Then** only tasks within that group are sorted, maintaining group boundaries
7. **Given** I group by due date, **When** viewing the table, **Then** groups are: "Overdue", "Today", "This Week", "This Month", "Later", "No Due Date"
8. **Given** I am viewing the task table, **When** I click a column header, **Then** tasks sort by that column (ascending/descending toggle)
9. **Given** I apply multiple filters (stage + due date + assignee), **Then** results update in real-time

---

### User Story 2 — View and Manage Tasks in Kanban Board (Priority: P1)

As an internal user, I want to view my tasks in a Kanban board so that I can see task stage distribution at a glance and drag tasks between columns to update their progress.

**Why this priority**: Kanban complements the table view for users who prefer visual, spatial task management. Drag-and-drop provides the fastest way to change task stage.

**Independent Test**: View Kanban board, verify columns match task stages, drag a card between columns, confirm stage updates immediately. Test Compact, Standard, and Swimlane sub-modes.

**Acceptance Scenarios**:

1. **Given** I am on the Tasks page, **When** I switch to Kanban view, **Then** I see columns for each task stage (Not Started, In Progress, On Hold, Approved, Completed)
2. **Given** I am viewing the Kanban board, **When** I drag a task card to a different column, **Then** the task stage updates immediately and persists
3. **Given** I am viewing a task card, **Then** I see the title, priority badge, due date, assignee avatar, and subtask progress
4. **Given** a task is overdue, **When** I view the card, **Then** it has a red left border
5. **Given** I switch between Table and Kanban, **When** I return to either view, **Then** my filters are preserved
6. **Given** I am viewing the Kanban board, **When** I select "Compact" sub-mode, **Then** cards show minimal info with tighter spacing
7. **Given** I am viewing the Kanban board, **When** I select "Standard" sub-mode, **Then** cards show full detail (title, priority, due date, assignee, subtask progress)
8. **Given** I am viewing the Kanban board, **When** I select "Swimlane" sub-mode, **Then** cards are organized into horizontal swimlane rows grouped by priority
9. **Given** I am viewing the Kanban board with group-by enabled, **Then** group-by options work as swimlane rows

---

### User Story 3 — Create and Edit Tasks via Global Modal (Priority: P1)

As an internal user, I want to create and edit tasks using a global modal so that I can capture work items from anywhere in the application.

**Why this priority**: Task creation is fundamental. The global modal (already built in CommonModalContainer) provides a consistent, accessible entry point.

**Independent Test**: Press `C` or click "New Task" button, fill required fields, save. Open an existing task, edit fields, save. Verify changes persist.

**Acceptance Scenarios**:

1. **Given** I am logged in, **When** I click "New Task" or press `C`, **Then** the global task modal opens with the TaskForm
2. **Given** I am creating a task, **When** I fill required fields (title) and save, **Then** the task appears in my task list and Kanban board
3. **Given** I am creating a task, **When** I link it to a business object (client, package, etc.), **Then** the task shows the relationship in task details
4. **Given** I leave the title empty, **When** I try to save, **Then** I see a validation error
5. **Given** I click a task row in the table or a card in Kanban, **When** the modal opens, **Then** I can edit all task fields
6. **Given** I am editing a task, **When** the "Associate Package" prompt appears, **Then** I can choose to link or skip the association

---

### User Story 4 — Inline Edit Task Fields in Table (Priority: P1)

As an internal user, I want to edit task fields directly in the table without opening the modal so that I can make quick changes efficiently.

**Why this priority**: Inline editing reduces friction for common updates, saving time and maintaining context. Users can adjust priority, stage, dates, tags, and assignees without leaving the table.

**Independent Test**: Click various table cells, verify each enters edit mode with appropriate controls, save on blur/Enter, cancel on Escape.

**Acceptance Scenarios**:

1. **Given** I am viewing a task row, **When** I click the title cell, **Then** an inline text input appears for editing
2. **Given** I click the "Priority" badge, **When** the dropdown appears, **Then** I can select a new priority and it saves immediately
3. **Given** I click the "Stage" cell, **When** the dropdown appears, **Then** I can select a new stage and it saves immediately
4. **Given** I click the "Tags" cell, **Then** an inline tag selector appears with autocomplete, allowing addition or removal
5. **Given** I click the "Due Date" cell, **Then** an inline date picker appears; selecting a new date saves immediately; past dates show red styling
6. **Given** I click the "Staff" cell, **Then** an inline user selector appears showing assigned users with avatars; adding/removing saves immediately
7. **Given** I click the "Checklist" indicator, **Then** an inline checklist editor appears with check/uncheck, add, remove, and reorder via drag-and-drop
8. **Given** inline editing is active, **When** I press Escape, **Then** editing cancels and the cell reverts to original values
9. **Given** inline editing is active, **When** I click outside the cell, **Then** changes save automatically
10. **Given** a save fails, **When** the server returns an error, **Then** the value reverts and I see an error toast

---

### User Story 5 — Keyboard Shortcuts and Command Palette (Priority: P2)

As a power user, I want full keyboard shortcuts and a command palette so that I can manage tasks quickly without using the mouse.

**Why this priority**: Linear-style keyboard-first UX dramatically improves power user efficiency.

**Independent Test**: Press keyboard shortcuts and verify actions execute. Open command palette, search, execute commands.

**Acceptance Scenarios**:

1. **Given** I am on the Tasks page, **When** I press `Cmd/Ctrl+K`, **Then** the command palette opens with task-specific search and quick actions
2. **Given** I press `C`, **Then** the new task modal opens
3. **Given** I have a task selected, **When** I press `E`, **Then** the task modal opens for editing
4. **Given** I press `/`, **Then** the filter/search input focuses
5. **Given** I press `?`, **Then** I see a keyboard shortcuts help overlay
6. **Given** I have a task selected, **When** I press `1-5`, **Then** the task moves to the corresponding stage column
7. **Given** I press `A` with a task selected, **Then** the assignee picker opens
8. **Given** I press `D` with a task selected, **Then** the due date picker opens

**Core Shortcuts** (Linear-inspired):
- `Cmd/Ctrl+K` — Command palette
- `C` — Create new task
- `E` — Edit selected task
- `A` — Assign task
- `D` — Set due date
- `P` — Set priority
- `/` — Focus search/filter
- `1-5` — Move task to stage
- `?` — Show shortcuts help
- `↑/↓` — Navigate tasks
- `Space` — Toggle task selection
- `Shift+↑/↓` — Extend selection
- `Escape` — Clear selection/close

---

### User Story 6 — Subtasks (Priority: P2)

As an internal user, I want to break down tasks into subtasks so that I can track granular progress on complex work items.

**Why this priority**: Subtasks are standard in modern task apps and critical for tracking multi-step work.

**Independent Test**: Create a parent task, add subtasks, mark subtasks complete, verify progress indicator updates.

**Acceptance Scenarios**:

1. **Given** I am viewing a task, **When** I click "Add Subtask", **Then** I can create a subtask linked to the parent
2. **Given** a task has subtasks, **When** I view the task card or row, **Then** I see a subtask progress indicator (e.g., 2/5 complete)
3. **Given** I complete all subtasks, **When** I view the parent, **Then** I see a prompt to mark the parent complete
4. **Given** subtasks exist, **Then** each subtask is a full task with its own stage, priority, and assignee (self-referential parent_id)

---

### User Story 7 — Task Comments and Activity Feed (Priority: P2)

As an internal user, I want to add comments to tasks and see activity history so that I can collaborate with my team without leaving the task.

**Why this priority**: Comments enable async collaboration — essential for handoffs and team coordination.

**Independent Test**: Add a comment to a task, verify it appears. Change a task field, verify the activity log records the change.

**Acceptance Scenarios**:

1. **Given** I am viewing a task, **When** I add a comment, **Then** the comment appears in the task's activity feed
2. **Given** I mention a user with @username, **When** I save the comment, **Then** that user is notified
3. **Given** someone changes a task field, **When** I view the task, **Then** I see the change in the activity log with timestamp and user
4. **Given** I view the activity feed, **Then** I see both comments and automated activity (stage changes, assignments, edits) in chronological order

---

### User Story 8 — Bulk Task Operations (Priority: P2)

As an internal user, I want to select multiple tasks and perform actions on them at once so that I can efficiently manage large task lists.

**Why this priority**: Bulk operations are essential for managing larger task volumes — changing priority or reassigning multiple tasks at once.

**Independent Test**: Select multiple tasks via checkboxes, verify bulk action bar appears, apply a bulk change, verify all selected tasks update.

**Acceptance Scenarios**:

1. **Given** I select multiple task checkboxes, **When** the bulk action bar appears, **Then** I can change priority, stage, or assignee for all selected
2. **Given** I hold Shift and click two tasks, **Then** all tasks between are selected
3. **Given** I have tasks selected, **When** I press Escape, **Then** the selection clears
4. **Given** I apply a bulk stage change, **Then** all selected tasks update and the activity log records the change for each

---

### User Story 9 — Link Tasks to Business Objects (Priority: P2)

As an internal user, I want to link tasks to clients, packages, bills, risks, and other business objects so that I can see outstanding work in context.

**Why this priority**: Cross-module visibility is critical — users need to see tasks where they work, not just on the Tasks page.

**Independent Test**: Create a task linked to a client and a package. Navigate to the client/package detail page, verify the task appears in a "Related Tasks" panel.

**Acceptance Scenarios**:

1. **Given** I am creating a task, **When** I link it to a client, **Then** the task appears on that client's detail page
2. **Given** a task is linked to multiple objects (client + package), **When** I view either object, **Then** the task appears in both "Related Tasks" panels
3. **Given** I am viewing a business object, **When** I click a related task, **Then** the task modal opens for viewing/editing
4. **Given** the polymorphic link supports any model, **Then** tasks can be associated with clients, packages, bills, risks, supplies, incidents, referrals, and any future business object

---

### User Story 10 — Task Templates (Priority: P2)

As an admin, I want to create task templates so that users can quickly instantiate common task patterns without manually filling in all fields.

**Why this priority**: Templates reduce repetitive data entry for common workflows (e.g., "New client onboarding checklist", "Package review").

**Independent Test**: Admin creates a template with title, description, checklist, priority, and tags. User instantiates the template, verify all fields pre-populate.

**Acceptance Scenarios**:

1. **Given** I am an admin, **When** I create a task template, **Then** I can define title, description, checklist items, default priority, and default tags
2. **Given** a user creates a task, **When** they select "From template", **Then** the form pre-populates with the template's fields
3. **Given** a template is instantiated, **When** the task is created, **Then** the user can modify any pre-populated field before saving
4. **Given** templates exist, **Then** they appear in the command palette when creating tasks

---

### User Story 11 — Due Date Visual Indicators (Priority: P3)

As an internal user, I want tasks with due dates to show visual indicators so that I can quickly identify overdue and urgent work.

**Why this priority**: Visual cues help prioritize without requiring manual sorting.

**Independent Test**: Create tasks with various due dates, verify visual indicators display correctly.

**Acceptance Scenarios**:

1. **Given** a task has a due date, **When** I view it in table or Kanban, **Then** the due date is displayed
2. **Given** a task is overdue, **Then** it has red styling (red text, red border on Kanban card)
3. **Given** a task is due within 24 hours, **Then** it has amber/urgent styling

---

### User Story 12 — Dashboard View (Priority: P1)

As an internal user, I want a Dashboard view that shows my task load at a glance — overdue/due today/upcoming stats, time-based sections (Do Today, Do This Week, Do Later) with progress bars, and weekly completion trends.

**Why this priority**: The Dashboard provides Asana-style progress tracking, giving users a motivational overview of their workload without cluttering the List view.

**Independent Test**: Switch to Dashboard view, verify stat cards display, verify time-based sections group tasks correctly, verify weekly trends chart renders.

**Acceptance Scenarios**:

1. **Given** I switch to Dashboard view, **Then** I see 3 stat cards: Overdue (red), Due Today (amber), Upcoming (teal)
2. **Given** I view Dashboard, **Then** tasks are grouped into Do Today, Do This Week, Do Later sections with completion progress bars
3. **Given** I view weekly trends, **Then** I see a 7-day completion bar chart with streak indicator

---

### User Story 13 — Quick Add / Chain-Add (Priority: P1)

As an internal user, I want to quickly add tasks inline by typing a title and pressing Enter, with the input staying focused for continuous entry.

**Why this priority**: Quick capture is the single most important keyboard interaction — must be as fast as typing in Notion or Asana. Reduces friction from modal-based creation for simple tasks.

**Independent Test**: Click "+ Add task" at bottom of a group, type title, press Enter, verify task saves and input stays focused for next entry. Press Escape, verify input closes.

**Acceptance Scenarios**:

1. **Given** I click "+ Add task" at the bottom of a group section, **Then** an inline text input appears
2. **Given** I type a title and press Enter, **Then** the task saves with defaults and the input stays focused for the next task
3. **Given** I'm in a Priority group (e.g., Urgent), **When** I quick-add, **Then** the new task inherits that priority
4. **Given** I press Escape, **Then** the quick-add input closes

---

### User Story 14 — Quick Filter Chips (Priority: P1)

As an internal user, I want toggleable filter chips (Incomplete, Completed, Just my tasks, Due this week) so I can quickly filter my task list without opening a filter panel.

**Why this priority**: Asana-style inline chips provide instant, visible filtering that reduces clicks compared to dropdown-based filter panels.

**Independent Test**: Toggle each filter chip individually and in combination, verify task list updates correctly.

**Acceptance Scenarios**:

1. **Given** I click "Incomplete" chip, **Then** only non-completed tasks show
2. **Given** I click "Just my tasks", **Then** only tasks assigned to me show
3. **Given** multiple chips are active, **Then** filters combine (AND logic)
4. **Given** "Incomplete" and "Completed" are mutually exclusive
5. **Given** I click "Clear", **Then** all chips deactivate

---

### User Story 15 — Density Toggle (Priority: P2)

As a power user, I want to switch between Compact and Normal density so I can see more tasks at once.

**Why this priority**: ClickUp-style density options let power users maximize information density without compromising readability for casual users.

**Independent Test**: Toggle density between Compact and Normal, verify row height changes, verify preference persists after page reload.

**Acceptance Scenarios**:

1. **Given** I click "Compact", **Then** rows become tighter (py-1, text-xs) showing 20+ rows
2. **Given** I switch density, **Then** my preference persists across sessions

---

### Edge Cases

- **Tasks with no group value**: Create "Unassigned", "No Due Date", etc. groups positioned at the end
- **Filtering reduces groups to zero**: Empty groups are hidden automatically
- **Inline edit moves task to different group**: Task animates to new group or table refreshes
- **Inline validation errors**: Show inline error below/adjacent to cell, prevent save until corrected
- **Concurrent edits**: Last save wins, notify user if task was recently modified by another user
- **500+ tasks**: Pagination and performance optimization; default view shows last 30 days
- **Long task titles**: Truncate with ellipsis, full title on hover
- **Slow network**: Loading indicators during saves, optimistic updates with rollback
- **Empty state (no tasks)**: Show "No tasks yet" with create button
- **Empty state (no filter results)**: Show "No tasks match filters" with clear filters button

---

## Requirements *(mandatory)*

### Functional Requirements

**Table View & Grouping**
- **FR-001**: System MUST display tasks in a sortable, filterable table view
- **FR-002**: System MUST support grouping tasks by Stage, Priority, Assigned User, Due Date Range, and Tags
- **FR-003**: System MUST display group headers with group name and task count
- **FR-004**: System MUST allow expand/collapse of groups via clickable headers
- **FR-005**: System MUST persist the user's selected grouping option across sessions (user preferences)
- **FR-006**: System MUST apply sorting within groups without breaking group boundaries
- **FR-007**: System MUST apply active filters to grouped views and hide empty groups
- **FR-008**: System MUST create default groups for missing values ("Unassigned", "No Due Date")
- **FR-009**: System MUST support switching grouping options without page reload

**Kanban Board**
- **FR-010**: System MUST display tasks in a Kanban board with columns per task stage
- **FR-011**: System MUST allow drag-and-drop between Kanban columns to update task stage
- **FR-012**: System MUST preserve filter state when switching between Table and Kanban views

**Task Creation & Editing**
- **FR-013**: System MUST allow task creation via global modal (TaskForm in CommonModalContainer)
- **FR-014**: System MUST allow task editing via global modal (click task row/card)
- **FR-015**: System MUST support task fields: title, description, stage, priority, due date, start date, assignees (users), assignee team, tags, checklist
- **FR-016**: System MUST support linking tasks to any business object via polymorphic many-to-many

**Inline Editing**
- **FR-017**: System MUST allow inline editing of title, priority, stage, tags, due date, start date, assignees, team, and checklist
- **FR-018**: System MUST save inline edits immediately on blur or Enter
- **FR-019**: System MUST cancel inline edits on Escape, reverting to original values
- **FR-020**: System MUST show inline validation errors adjacent to the edited cell
- **FR-021**: System MUST show visual feedback (loading indicator) during inline save operations
- **FR-022**: System MUST handle concurrent edit conflicts by notifying users of recent changes

**Keyboard Shortcuts**
- **FR-023**: System MUST provide command palette via `Cmd/Ctrl+K`
- **FR-024**: System MUST support single-key shortcuts: C (create), E (edit), A (assign), P (priority), D (due date), / (search), ? (help)
- **FR-025**: System MUST support 1-5 number keys to move selected task to corresponding stage
- **FR-026**: System MUST support arrow key navigation and Space for selection toggle
- **FR-027**: System MUST display keyboard shortcuts help overlay on `?`

**Subtasks**
- **FR-028**: System MUST allow creating subtasks within a parent task (self-referential parent_id)
- **FR-029**: System MUST display subtask progress on parent task (e.g., 2/5 complete)
- **FR-030**: System MUST allow subtasks to be marked complete independently
- **FR-031**: System MUST prompt user to complete parent when all subtasks are done

**Comments & Activity**
- **FR-032**: System MUST allow users to add comments to tasks
- **FR-033**: System MUST support @mentions in comments with user notifications
- **FR-034**: System MUST display automated activity log (stage changes, assignments, edits) with timestamps
- **FR-035**: System MUST display comments and activity in a unified chronological feed

**Bulk Operations**
- **FR-036**: System MUST allow multi-select via checkboxes
- **FR-037**: System MUST support Shift+click range selection
- **FR-038**: System MUST show bulk action bar when tasks are selected
- **FR-039**: System MUST allow bulk update of priority, stage, and assignee

**Task Templates**
- **FR-040**: System MUST allow admins to create task templates with title, description, checklist, priority, and tags
- **FR-041**: System MUST allow users to create tasks from templates with pre-populated fields
- **FR-042**: System MUST allow modification of template-populated fields before saving

**Business Object Integration**
- **FR-043**: System MUST display "Related Tasks" on business object detail pages
- **FR-044**: System MUST allow creating tasks from business object context (pre-linking)
- **FR-045**: System MUST maintain task links regardless of linked object data changes

**Due Date Indicators**
- **FR-046**: System MUST display due dates on task cards and table rows
- **FR-047**: System MUST visually highlight overdue tasks (red styling)
- **FR-048**: System MUST visually indicate tasks due within 24 hours (amber styling)

**Dashboard View**
- **FR-049**: System MUST provide a Dashboard view with time-based task sections (Do Today, Do This Week, Do Later) and progress tracking (completion progress bars, stat cards for Overdue/Due Today/Upcoming, weekly completion trends)

**Quick Add / Chain-Add**
- **FR-050**: System MUST provide inline Quick Add at bottom of each group section with chain-add (Enter saves, input stays focused for continuous entry, Escape exits)

**Quick Filter Chips**
- **FR-051**: System MUST provide toggleable quick filter chips (Incomplete, Completed, My tasks, Due this week) with AND logic and mutual exclusivity between Incomplete/Completed

**Density Toggle**
- **FR-052**: System MUST support Compact/Normal density toggle, persisted per user across sessions

**Kanban Sub-Modes**
- **FR-053**: System MUST support Kanban sub-modes: Compact, Standard, Swimlane (Swimlane auto-selects priority grouping when enabled)

**Group-By Across Views**
- **FR-054**: System MUST show group-by options in both List and Board views (group-by in Board renders as swimlane rows)

### Key Entities

- **Task**: Core work item — title, description, stage, priority, due_date, start_date, parent_id (nullable, self-referential for subtasks), created/updated timestamps
- **Task Assignable**: Polymorphic relationship — tasks assigned to users and/or teams
- **Task Linkable**: Polymorphic many-to-many — tasks linked to any business object (clients, packages, bills, risks, supplies, incidents, referrals, etc.)
- **Task Tag**: Tag entity for task categorization
- **Task Comment**: User comment with @mentions support, linked to task
- **Task Activity**: Spatie activity log entries for automated change tracking
- **Task Template**: Admin-created template — title, description, checklist items, default priority, default tags
- **Task Group**: Virtual (UI-only) entity — grouped task collections by property value

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can group tasks and see results within 2 seconds
- **SC-002**: Inline edits save in under 500ms (optimistic) with visual feedback
- **SC-003**: Kanban drag-and-drop stage update completes in under 1 second
- **SC-004**: Users can create a new task in under 30 seconds
- **SC-005**: Table view filters apply in under 2 seconds for up to 500 tasks
- **SC-006**: 80%+ of table interactions are possible via keyboard
- **SC-007**: Page loads with 500 tasks in under 2 seconds
- **SC-008**: 60% of active users create or complete at least one task per week within 3 months of launch

---

## Assumptions

- File storage infrastructure is available for future attachment support (deferred)
- Grouping calculations can be performed efficiently for typical task list sizes (up to 500 tasks per page)
- Inline editing uses the same validation rules and backend API endpoints as the full TaskForm
- Existing task permission system applies equally to all task features
- Performance monitoring leverages existing infrastructure (Telescope, Horizon, APM)
- Standard Eloquent with Spatie activity log (no event sourcing for tasks)

---

## Dependencies

- **Common Table Components**: Custom Common components (no PrimeVue) — grouping built into shared infrastructure
- **CommonModalContainer**: Global modal with TaskForm, event bus, associate package dialog (already built)
- **Calls Uplift Integration**: AI-suggested tasks from Graph transcriptions create tasks via `StoreTask` action, linked to packages via `task_linkables`. See Calls Uplift spec FR-037–FR-040.
- **CommonCommandPalette**: Extend for task-specific commands
- **Spatie Activity Log**: For automated change tracking
- **Existing Task API Endpoints**: Inline editing depends on existing task update APIs supporting granular field updates

---

## Out of Scope

- Saved/named views (user's grouping preference persists, but no named view configs)
- Calendar view
- Photo and file attachments
- Recurring tasks / recurring automation
- AI-recommended tasks from Portal-side processing (Phase 2). Note: AI-suggested tasks from **Calls Uplift** (Graph-provided) are in scope — see Calls Uplift spec FR-037 to FR-040
- Real-time collaborative editing
- Version history / revision tracking for inline edits
- Multi-level grouping (e.g., stage then priority)
- Export grouped task views to PDF/Excel
- Push/email notifications for due dates
- Task dependencies (blocking/blocked by)
- Care partner read-only view (all users have equal access)

---

## Open Questions

*All clarification questions resolved. Specification ready for design consolidation and architecture planning.*
