---
title: "Design Spec"
---


**Epic Code**: TSK
**Created**: 2026-01-03
**Status**: Approved
**Spec**: [spec.md](./spec.md)

---

## Overview

Design specification for the Advanced Task Management System, defining UI/UX patterns, component structure, and interaction design based on reference application patterns.

---

## User Context

| Attribute | Value |
|-----------|-------|
| **Primary Users** | Internal staff, Coordinators |
| **Secondary Users** | Care Partners (read-only) |
| **Device Priority** | Desktop first, tablet secondary, mobile tertiary |
| **Usage Pattern** | Daily task management, frequent interactions |
| **Information Density** | Medium-high (power users need quick scanning) |

---

## Layout & Structure

### Page Type: Sidebar Context + Main Content

```
┌────────────────────┬─────────────────────────────────────────────────────────┐
│                    │  Search tasks... (Press / to focus)       [+ New Task] │
│  TC Portal         │                                                         │
│                    ├─────────────────────────────────────────────────────────┤
├────────────────────┤                                                         │
│                    │  ┌─────────────────────────────────────────────────────┐│
│  My Tasks          │  │  My Tasks                    ┌───┐ ┌───┐ ┌───┐    ││
│  Unassigned        │  │  Tasks assigned to you       │ 5 │ │ 2 │ │ 18│    ││
│  Leaderboards      │  │  across all work streams     │tsk│ │done│ │pts│    ││
│                    │  └─────────────────────────────────────────────────────┘│
│  Work Streams  v   │                                                         │
│  ──────────────    │  Your Tasks                    [Kanban] [List]         │
│  * Patient Care    │  ─────────────────────────────────────────────────────  │
│    Intake Team     │                                                         │
│    Billing Ops     │  [Kanban Board or Table View]                          │
│  + Add Work Stream │                                                         │
│                    │                                                         │
│  ──────────────    │                                                         │
│  Settings          │                                                         │
└────────────────────┴─────────────────────────────────────────────────────────┘
```

### Navigation Pattern

- **Sidebar**: Persistent context menu with Work Streams (teams)
- **Work Streams**: Collapsible section, user can belong to multiple
- **Context Switch**: Clicking a Work Stream filters main content
- **View Toggle**: Segmented button for Kanban/List views

---

## Component Inventory

### Existing Components (Reuse)

| Component | Location | Usage |
|-----------|----------|-------|
| `CommonCommandPalette.vue` | `Components/Common/` | Extend for task commands |
| `CommonSplitter.vue` | `Components/Common/` | Sidebar + content layout |
| `CommonPanel.vue` | `Components/Common/` | Resizable panels |
| `CommonSelectMenu.vue` | `Components/Common/` | Status/Priority dropdowns |
| `CommonButton.vue` | `Components/Common/` | All buttons |
| `CommonInput.vue` | `Components/Common/` | Search, inline task creation |
| `CommonBadge.vue` | `Components/Common/` | Status/Priority badges |
| `CommonAvatarGroup.vue` | `Components/Common/` | Assignee display |
| `TaskForm.vue` | `Components/Task/` | Full task modal (edit for subtasks/activity) |
| `ConfettiExplosion` | `vue-confetti-explosion` | Task completion celebration |

### New Components (Create)

| Component | Location | Purpose |
|-----------|----------|---------|
| `TaskCard.vue` | `Components/Tasks/` | Kanban card with title, assignee, due date, subtask progress |
| `KanbanBoard.vue` | `Components/Tasks/` | 3-column drag-drop board |
| `KanbanColumn.vue` | `Components/Tasks/` | Single column with header + card list |
| `WorkStreamSidebar.vue` | `Components/Tasks/` | Context menu sidebar |
| `TaskStatsBar.vue` | `Components/Tasks/` | Stats banner (tasks, completed, points) |
| `KeyboardShortcuts.vue` | `Components/Tasks/` | `?` help overlay |
| `SubtaskList.vue` | `Components/Tasks/` | Subtask checklist in task detail |
| `ActivityLog.vue` | `Components/Tasks/` | Activity/comment feed |
| `RelatedTasksPanel.vue` | `Components/Tasks/` | Tasks panel for Patient/Package views |

---

## Interaction Design

### Task Creation

**Two Patterns:**

1. **Modal (Full Form)** - Click `+ New Task` button or press `C`
```
┌─────────────────────────────────────┐
│  Create New Task                 X  │
├─────────────────────────────────────┤
│  Title *                            │
│  ┌─────────────────────────────────┐│
│  │ Task title                      ││
│  └─────────────────────────────────┘│
│                                     │
│  Description                        │
│  ┌─────────────────────────────────┐│
│  │ Add a description...            ││
│  └─────────────────────────────────┘│
│                                     │
│  Status          Priority           │
│  [To Do v]       [No Priority v]    │
│                                     │
│  Assignee        Work Stream        │
│  [Unassigned v]  [No stream v]      │
│                                     │
│  Due Date                           │
│  [Pick a date]                      │
│                                     │
│           [Cancel]  [Create Task]   │
└─────────────────────────────────────┘
```

2. **Inline (Quick Add)** - Click `+ Add new task` row or press `T`
```
┌──────────────────────────────────────────────────────────────────┐
│ ☐  Title    Status    Priority    Work Stream    Due Date        │
├──────────────────────────────────────────────────────────────────┤
│ ┌────────────────────────────────────────────────────────┐  ✓  X │
│ │ Task title...                                          │       │
│ └────────────────────────────────────────────────────────┘       │
│ Press T to add • Enter to create • Shift+Enter for another • Esc │
└──────────────────────────────────────────────────────────────────┘
```

### Inline Editing (Table View)

Click any cell to edit inline:
```
┌──────────────────────────────────────────────────────────────────┐
│ ☐  Title           Status              Priority                  │
├──────────────────────────────────────────────────────────────────┤
│ ☐  Review docs     ● To Do  v          No Priority               │
│                    ┌─────────────┐                               │
│                    │ ● Backlog   │                               │
│                    │ ✓ To Do     │  ← Dropdown on click          │
│                    │ ● In Prog   │                               │
│                    │ ● Done      │                               │
│                    │ ● Canceled  │                               │
│                    └─────────────┘                               │
└──────────────────────────────────────────────────────────────────┘
```

### Task Completion

Checkbox click triggers:
1. Status changes to "Done"
2. Confetti explosion animation
3. Row/card visual update (strikethrough or fade)

```
Before:  ☐  Review intake docs    📅 Jan 21    ○
                    ↓ Click
After:   ✓  Review intake docs    📅 Jan 21    ✓  🎉 CONFETTI
```

### Task Detail (Modal)

Click task row/card → opens modal with full `TaskForm.vue`:
- Title, Description
- Status, Priority, Due Date
- Assignees (staff + team)
- Work Stream / Taskable linking
- Subtasks with progress
- Checklist
- Comments
- Activity log
- Recurring task settings

### Drag & Drop (Kanban)

```
┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│   TO DO     │  │ IN PROGRESS │  │    DONE     │
│             │  │             │  │             │
│ ┌─────────┐ │  │             │  │             │
│ │ Task 1 ─│─│──│─→ DROP HERE │  │             │
│ └─────────┘ │  │             │  │             │
│             │  │             │  │             │
└─────────────┘  └─────────────┘  └─────────────┘
```

- Drag card between columns
- Drop updates status immediately (optimistic)
- Activity logged: "Status changed from To Do to In Progress"

---

## Keyboard Shortcuts

### Shortcut Overlay (`?` to show)

```
┌─────────────────────────────────────────────────────┐
│  Keyboard Shortcuts                              X  │
├─────────────────────────────────────────────────────┤
│  TASK ACTIONS                                       │
│  Create new task                              C     │
│  Submit inline task                         Enter   │
│  Create and add another                Shift+Enter  │
│  Cancel inline creation                       Esc   │
│  Edit selected task                             E   │
│  Assign task                                    A   │
│  Set due date                                   D   │
│                                                     │
│  NAVIGATION                                         │
│  Focus search                                   /   │
│  Go to All Tasks                          G then T  │
│  Go to Kanban                             G then K  │
│  Open command palette                       Cmd+K   │
│                                                     │
│  STATUS (when task selected)                        │
│  Move to To Do                                  1   │
│  Move to In Progress                            2   │
│  Move to Done                                   3   │
│                                                     │
│  HELP                                               │
│  Show this help                                 ?   │
└─────────────────────────────────────────────────────┘
```

### Command Palette (Contextual)

On `/tasks` pages, `Cmd/Ctrl+K` opens task-specific palette:
```
┌─────────────────────────────────────────────────────┐
│  🔍 Search tasks or run command...                  │
├─────────────────────────────────────────────────────┤
│  ACTIONS                                            │
│  + Create new task                              C   │
│  ↗ Go to Kanban                           G then K  │
│  ↗ Go to List                             G then T  │
│  ⚙ Change status                                S   │
│  👤 Assign task                                 A   │
│                                                     │
│  RECENT TASKS                                       │
│  Review patient intake docs                         │
│  Follow up with care partner                        │
└─────────────────────────────────────────────────────┘
```

Elsewhere: Global `CommonCommandPalette` behavior.

---

## Task Card Design (Kanban)

Minimal, scannable design:

```
┌─────────────────────────────────────┐
│ Review patient intake documentation │
│ 🔴 High    📅 Jan 5                 │
│ 👤 Will W.              ◔ 2/4       │
└─────────────────────────────────────┘
     │          │           │
     │          │           └── Subtask progress
     │          └── Due date (red if overdue, yellow if <24h)
     └── Priority badge (color-coded)
```

**Visual States:**
- **Overdue**: Red left border
- **Due soon (<24h)**: Yellow left border
- **Completed**: Muted colors, strikethrough title

---

## States

### Loading States

- **Initial load**: Skeleton cards/rows with pulse animation
- **Drag in progress**: Ghost card follows cursor, drop zone highlights
- **Saving**: Subtle spinner on affected element

### Empty States

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│              📋                                     │
│                                                     │
│         No tasks yet                                │
│                                                     │
│    Create your first task to get started            │
│                                                     │
│              [+ New Task]                           │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Error States

- **Failed save**: Toast notification with retry option
- **Failed load**: Error message with refresh button

---

## Responsive Behavior

| Breakpoint | Behavior |
|------------|----------|
| **Desktop (≥1024px)** | Full layout: sidebar + Kanban/List |
| **Tablet (768-1023px)** | Collapsible sidebar, full Kanban/List |
| **Mobile (<768px)** | **Force List View only**, no Kanban |

### Mobile Layout

```
┌─────────────────────────┐
│  ☰  Tasks        [+ ]   │
├─────────────────────────┤
│  My Tasks          ▼    │  ← Dropdown for Work Stream
├─────────────────────────┤
│ ☐ Task 1      ● To Do   │
│ ☐ Task 2      ● To Do   │
│ ☐ Task 3      ● Prog    │
│ ✓ Task 4      ● Done    │
└─────────────────────────┘
```

- Hamburger menu for sidebar
- Work Stream selector as dropdown
- List view only (no drag-drop)
- Tap row to open task modal

---

## Accessibility

| Requirement | Implementation |
|-------------|----------------|
| **WCAG Level** | AA compliance |
| **Keyboard Navigation** | Full keyboard support, visible focus indicators |
| **Screen Reader** | ARIA labels on icon buttons, status announcements |
| **Focus Management** | Trap focus in modals, return focus on close |
| **Color Contrast** | All text meets 4.5:1 ratio |
| **Motion** | Respect `prefers-reduced-motion` for confetti |

---

## Visual Notes

### Colors (from existing TC Portal)

- **Primary**: Teal (`#047857`, `dark-teal-500`)
- **Status Colors**:
  - Backlog: Purple
  - To Do: Blue
  - In Progress: Yellow/Orange
  - Done: Green
  - Canceled: Red
- **Priority Colors**:
  - Low: Gray
  - Medium: Yellow
  - High: Orange
  - Urgent: Red

### Typography

- **Headings**: System font stack, semibold
- **Body**: System font stack, regular
- **Task titles**: Medium weight, truncate with ellipsis

### Spacing

- **Card padding**: `p-3` (12px)
- **Column gap**: `gap-4` (16px)
- **Section spacing**: `space-y-4` (16px)

---

## Design Clarifications

### Session 2026-01-03

- Q: Layout pattern for Kanban + Table toggle? → A: Sidebar context menu with Work Streams (like reference app), segmented view toggle
- Q: Task card design? → A: Minimal (Linear-style) - title, priority, due date, assignee, subtask progress
- Q: Task detail view pattern? → A: Modal (reuse TaskForm.vue), keeps consistency with current TC Portal
- Q: Command palette scope? → A: Contextual - task-specific on `/tasks`, global elsewhere
- Q: Mobile/responsive behavior? → A: Force list view on mobile, no Kanban on small screens

---

## Open Questions

None - all critical design decisions resolved.

---

## Approval

- [ ] Product Owner review
- [ ] UX review (if applicable)
- [ ] Engineering review

---

## Next Steps

1. `/trilogy.mockup` — Generate detailed ASCII mockups for key screens (optional)
2. `/speckit.implement` — Begin Phase 1 Foundation tasks
