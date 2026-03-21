---
title: "Design Specification: Task Management MVP"
---

**Status:** Draft
**Feature Spec:** [spec.md](spec.md)
**Created:** 2026-01-03
**Last Updated:** 2026-03-19

---

## Design Resources

### LOOM Videos

| Title | Link | Description |
|-------|------|-------------|
| | | |

### Figma

| File | Link | Description |
|------|------|-------------|
| | | |

---

## Competitive Research Summary

### Key Patterns from Modern Task Apps

| App | Table Grouping | Inline Editing | Keyboard | Kanban |
|-----|---------------|----------------|----------|--------|
| **Linear** | By status, priority, assignee | Click-to-edit any field | Extensive (99+ shortcuts) | Board view |
| **Asana** | Collapsible sections | Yes, grid-style | Good | Board view |
| **Notion** | Database groups by property | Yes, click any cell | Cmd+K palette | Board view |
| **ClickUp** | Multiple group levels | Yes | Extensive | Multiple views |

### Best-in-Class Patterns Adopted

1. **Linear's Keyboard-First Design** — `Cmd+K` palette, single-key shortcuts (C, A, P, D), two-key combos (G+T, G+K)
2. **Asana's Collapsible Grouping** — Group by any field, collapsible sections with task counts and progress bars
3. **Asana's Grid-Style Quick Add** — Inline "+ Add task" at bottom of each section, type title and hit Enter for instant capture
4. **Asana's Progress Dashboard** — Time-based sections (Do Today / This Week / Later) with completion bars and stats cards
5. **ClickUp's Density Toggle** — Compact/Normal mode for power users who want maximum rows visible
6. **Kanban Drag-and-Drop** — Visual stage management via card dragging (compact + swimlane modes)
7. **Asana's Quick Filter Chips** — Inline filter chips (Incomplete, Completed, Just my tasks, Due this week) for fast filtering

---

## Overview

Task Management V2 provides a **three-view** task system (List + Board + Dashboard) with inline editing, keyboard shortcuts, subtasks, comments, bulk operations, and templates. All internal users have equal access. Tasks link to any business object via polymorphic many-to-many relationships.

**Design direction:** Asana Ada's progress-focused layout with ClickUp Carl's density options. Clean, not colourful — use TC design system tokens, not rainbow badges.

**Key UX principles:**
- **Quick capture is king** — inline "+ Add task" at bottom of every section, type title → Enter → saves and opens next row for continuous entry (Asana-style chain-add)
- **Global modal for detail** — click task row opens the existing global modal for full editing (not a slide-out panel)
- **Three views via tabs** — List (default), Board (kanban), Dashboard (Asana-style progress sections)
- **Density toggle** — Compact/Normal mode. Compact shows maximum rows like ClickUp's spreadsheet
- **Stats belong on Dashboard** — List view stays clean; progress bars and stats cards live on the Dashboard tab
- **TanStack Table** — migrate from CommonTable to @inertiaui/table for built-in inline editing, column resizing, and advanced features

---

## User Context

| Aspect | Decision | Rationale |
|--------|----------|-----------|
| **Primary User** | All internal users equally | No role distinction for task management |
| **Device Priority** | Desktop-first, responsive table + modal on mobile | 80%+ desktop usage; Kanban desktop-only |
| **Usage Pattern** | Daily, multiple sessions, power users want speed | Keyboard shortcuts critical |
| **Information Density** | Medium-high | Power users need quick scanning across many tasks |

---

## Layout & Structure

### Page Type: Sidebar Card + Main Content

```
┌────────────────────┬──────────┬──────────────────────────────────────────────┐
│                    │ Sidebar  │  [List] [Board] [Dashboard]      [+ Task]   │
│  TC Portal         │ Card     │                                              │
│  Standard Sidebar  │          ├──────────────────────────────────────────────┤
│                    │ My Tasks │  Quick filters: [Incomplete] [My tasks]     │
│  ...               │ Assigned │  [Due this week] [Completed]               │
│  Tasks  ←active    │ ──────── │  Group: [Due date ▼]  Density: [▪ ▫]       │
│  ...               │ Teams    │                                              │
│                    │  Clinical│  ┌──────────────────────────────────────────┐│
│                    │  Admin   │  │                                          ││
│                    │ ──────── │  │  [View Content — List/Board/Dashboard]   ││
│                    │ Group by │  │                                          ││
│                    │  None    │  │  + Add task  [type and Enter]            ││
│                    │  Stage   │  │                                          ││
│                    │  Priority│  └──────────────────────────────────────────┘│
│                    │  Due date│                                              │
└────────────────────┴──────────┴──────────────────────────────────────────────┘
```

### Navigation Pattern

- **TC Portal Sidebar**: Standard sidebar — Tasks is a nav item
- **Board Sidebar Card** (inside content): Narrow card (~w-52) with board navigation (My Tasks, Assigned by Me, Teams) + Group By options. Visible in all views.
- **View Tabs**: `CommonTabs` — List | Board | Dashboard. Board sub-modes: Compact, Standard, Swimlane
- **Quick Filter Chips**: Asana-style inline chips above the table — Incomplete, Completed, Just my tasks, Due this week. Click to toggle.
- **Group By**: In sidebar card, available for all views. Options: None, Stage, Priority, Assignee, Due Date, Tags
- **Density Toggle**: Compact/Normal, persisted per user. Compact = tight rows, small text. Normal = breathing room.

### Quick Add Pattern (Critical UX)

Inline "+ Add task" row at the bottom of every group section:
1. Click "+ Add task" → row transforms into a text input
2. Type task title → press Enter → task saves immediately with defaults (Not Started, Medium priority, assigned to current user)
3. After Enter, the next "+ Add task" row auto-focuses for **chain-add** — keep typing without clicking
4. Press Escape to exit chain-add mode
5. Tab key after title could optionally move focus to stage/priority for quick inline metadata

This is the single most important keyboard interaction — must be as fast as typing in Notion or Asana.

---

## Component Inventory

### Existing Components (Reuse)

| Component | Usage | Notes |
|-----------|-------|-------|
| `CommonModalContainer.vue` | Global task modal host | Already built with TaskForm + event bus + associate dialog |
| `TaskForm.vue` | Full task create/edit form | Already built |
| `CommonCommandPalette.vue` | Command palette | Extend for task-specific commands |
| `CommonSelectMenu.vue` | Inline dropdowns | For stage/priority inline edit |
| `CommonButton.vue` | All buttons | Various variants |
| `CommonInput.vue` | Search, inline text edit | |
| `CommonBadge.vue` | Stage/Priority badges | Color variants |
| `CommonAvatarGroup.vue` | Assignee display | |
| `CommonCheckbox.vue` | Row selection / bulk ops | |
| `CommonEmptyPlaceholder.vue` | No tasks state | Standard pattern |
| `TaskFilterBar` | Quick filters | Already built |

### New Components (Create)

| Component | Purpose | Priority |
|-----------|---------|----------|
| `TaskTableGroup.vue` | Collapsible group header with count (wraps CommonTable sections) | P1 |
| `GroupBySelector.vue` | Dropdown for group-by options | P1 |
| `ViewModeToggle.vue` | Table/Kanban view switcher | P1 |
| `KanbanBoard.vue` | Kanban board with drag-and-drop (vuedraggable/SortableJS) | P1 |
| `KanbanColumn.vue` | Single Kanban column with header | P1 |
| `TaskCard.vue` | Kanban card (title, priority, due, assignee, subtask progress) | P1 |
| `KeyboardShortcuts.vue` | `?` help overlay | P2 |
| `SubtaskList.vue` | Subtask checklist in task detail | P2 |
| `ActivityLog.vue` | Activity/comment feed | P2 |
| `RelatedTasksPanel.vue` | Tasks panel for business object detail pages | P2 |
| `BulkActionBar.vue` | Fixed bottom bar for bulk operations (sticky viewport bottom) | P2 |

**Architecture Decision**: Migrate to `@inertiaui/table` (TanStack Table wrapper):
- **Why**: Built-in inline editing, column resizing/reordering, server-side sort/filter/paginate, row selection, column visibility toggle, density modes
- **Migration**: Replace CommonTable usage in Tasks/Index.vue with InertiaUI Table. Other pages keep CommonTable.
- **Inline editing**: Click any cell to edit — priority dropdown, stage dropdown, assignee picker, date picker, tags multi-select
- **Density**: Compact/Normal toggle changes row height + font size via table configuration

---

## Interaction Design

### Task Creation (Two Entry Points)

**Entry 1 — Quick Add (inline, speed-first)**
Inline "+ Add task" row at bottom of each group section. Type title → Enter → saves. Chain-add: next row auto-focuses. Press Escape to stop. This is the PRIMARY creation method for daily use.

**Entry 2 — Full Create (global modal)**
Click `+ New Task` button or press `C` to open the global modal with all fields:

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
│  Stage            Priority          │
│  [Not Started v]  [No Priority v]   │
│                                     │
│  Assignee         Team              │
│  [Unassigned v]   [No team v]       │
│                                     │
│  Due Date         Start Date        │
│  [Pick a date]    [Pick a date]     │
│                                     │
│  Tags             Template          │
│  [Add tags]       [From template v] │
│                                     │
│  Link to (polymorphic)              │
│  [+ Add link to client/package/...] │
│                                     │
│           [Cancel]  [Create Task]   │
└─────────────────────────────────────┘
```

### Inline Editing (Table View)

Click any cell to edit inline:

```
┌──────────────────────────────────────────────────────────────────┐
│ ☐  Title           Stage               Priority                  │
├──────────────────────────────────────────────────────────────────┤
│ ☐  Review docs     ● Not Started v     No Priority               │
│                    ┌───────────────┐                              │
│                    │ ● Not Started │                              │
│                    │ ✓ In Progress │ ← Dropdown on click          │
│                    │ ● On Hold     │                              │
│                    │ ● Approved    │                              │
│                    │ ● Completed   │                              │
│                    └───────────────┘                              │
└──────────────────────────────────────────────────────────────────┘
```

### Group By (Table View)

Collapsible sections (Asana-style):

```
▼ High Priority (3)                    ← Clickable header with count
┌────────────────────────────────────┐
│ ☐ │ Task 1 │ 🔴 High │ In Prog  │
│ ☐ │ Task 2 │ 🔴 High │ Not Start│
│ ☐ │ Task 3 │ 🔴 High │ Approved │
└────────────────────────────────────┘
▼ Medium Priority (8)
┌────────────────────────────────────┐
│ ☐ │ Task 4 │ 🟡 Med  │ Not Start│
│ ...                                 │
└────────────────────────────────────┘
▶ Low Priority (15) ← Collapsed
```

### Task Card (Kanban)

```
┌─────────────────────────────────────┐
│ Review patient intake documentation │
│ 🔴 High    📅 Jan 5                 │
│ 👤 Will W.              ◔ 2/4       │
└─────────────────────────────────────┘
     │          │           │
     │          │           └── Subtask progress
     │          └── Due date (red if overdue, amber if <24h)
     └── Priority badge (color-coded)
```

**Visual States:**
- **Overdue**: Red left border
- **Due soon (<24h)**: Amber left border
- **Completed**: Muted colors, strikethrough title

### Kanban Drag & Drop

```
┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│ NOT STARTED │  │ IN PROGRESS │  │  COMPLETED  │
│             │  │             │  │             │
│ ┌─────────┐ │  │             │  │             │
│ │ Task 1 ─│─│──│─→ DROP HERE │  │             │
│ └─────────┘ │  │             │  │             │
└─────────────┘  └─────────────┘  └─────────────┘
```

- Drag card between columns → stage updates immediately (optimistic)
- Activity logged: "Stage changed from Not Started to In Progress"

### Task Completion

Checkbox click triggers:
1. Stage changes to "Completed"
2. Confetti explosion animation
3. Row/card visual update (strikethrough or fade)

### Bulk Operations

```
┌──────────────────────────────────────────────────────────────────┐
│ ☑ │ Task 1  │ 🔴 High │ In Prog  │ Jan 5  │ Will W.            │
│ ☑ │ Task 2  │ 🟡 Med  │ Not Start│ Jan 8  │ Sarah K.           │
│ ☐ │ Task 3  │ 🟢 Low  │ Approved │ Jan 12 │ Mike T.            │
├──────────────────────────────────────────────────────────────────┤
│ 2 selected   [Set Stage ▼]  [Set Priority ▼]  [Assign ▼]  [✕] │
└──────────────────────────────────────────────────────────────────┘
```

---

## Keyboard Shortcuts

### Shortcut Overlay (`?` to show)

```
┌─────────────────────────────────────────────────────┐
│  Keyboard Shortcuts                              X  │
├─────────────────────────────────────────────────────┤
│  TASK ACTIONS                                       │
│  Create new task                              C     │
│  Edit selected task                           E     │
│  Assign task                                  A     │
│  Set priority                                 P     │
│  Set due date                                 D     │
│  Cancel / Close                              Esc    │
│                                                     │
│  NAVIGATION                                         │
│  Focus search                                 /     │
│  Navigate tasks                             ↑ / ↓   │
│  Toggle selection                          Space    │
│  Extend selection                      Shift+↑/↓    │
│  Open command palette                     Cmd+K     │
│                                                     │
│  STAGE (when task selected)                         │
│  Not Started                                  1     │
│  In Progress                                  2     │
│  On Hold                                      3     │
│  Approved                                     4     │
│  Completed                                    5     │
│                                                     │
│  HELP                                               │
│  Show this help                               ?     │
└─────────────────────────────────────────────────────┘
```

---

## States

### Loading States

| Context | Treatment |
|---------|-----------|
| Initial page load | 5 skeleton rows/cards with pulse animation |
| Drag in progress | Ghost card follows cursor, drop zone highlights |
| Inline save | Subtle spinner on affected cell |
| Data refresh | Existing content stays, spinner in header |

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

| Context | Message | CTA |
|---------|---------|-----|
| No tasks | "No tasks yet" | [+ New Task] |
| No filter results | "No tasks match your filters" | [Clear filters] |

### Error States

- **Failed save**: Toast notification with retry option, cell reverts to original value
- **Failed load**: Error message with refresh button
- **Failed drag**: Snap back to original column, error toast

---

## Responsive Behavior

| Breakpoint | Behavior |
|------------|----------|
| **Desktop (≥1024px)** | Full layout: sidebar + Table/Kanban toggle + all features |
| **Tablet (768-1023px)** | Collapsible sidebar, full table, no Kanban |
| **Mobile (<768px)** | Table view only, responsive columns, tap row to open modal |

### Mobile Layout

```
┌─────────────────────────┐
│  ☰  Tasks        [+ ]   │
├─────────────────────────┤
│  My Tasks          ▼    │  ← Dropdown for scope filter
├─────────────────────────┤
│ ☐ Task 1      ● Not St  │
│ ☐ Task 2      ● In Prog │
│ ☐ Task 3      ● On Hold │
│ ✓ Task 4      ● Done    │
└─────────────────────────┘
```

- Hamburger menu for sidebar
- Table with reduced columns (title, stage, priority)
- Tap row to open task modal
- No Kanban on mobile
- No keyboard shortcuts on mobile

---

## Accessibility

| Requirement | Implementation |
|-------------|----------------|
| **WCAG Level** | AA compliance |
| **Keyboard Navigation** | Full keyboard support, visible focus indicators |
| **Screen Reader** | ARIA labels on icon buttons, stage announcements |
| **Focus Management** | Trap focus in modals, return focus on close |
| **Color Contrast** | All text meets 4.5:1 ratio |
| **Motion** | Respect `prefers-reduced-motion` for confetti and animations |

---

## Visual Notes

### Colors (TC Portal Design System)

- **Primary**: Teal (`#007F7E` teal-700, `#43C0BE` teal-500)
- **Stage Colors**:
  - Not Started: Blue
  - In Progress: Yellow/Orange
  - On Hold: Purple
  - Approved: Teal (TC brand)
  - Completed: Gray (muted)
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

- Q: Layout pattern for Kanban + Table toggle? → A: Sidebar context + segmented view toggle
- Q: Task card design? → A: Minimal (Linear-style) — title, priority, due date, assignee, subtask progress
- Q: Task detail view pattern? → A: Modal (reuse TaskForm.vue via CommonModalContainer)
- Q: Command palette scope? → A: Contextual — task-specific on `/tasks`, global elsewhere
- Q: Mobile/responsive behavior? → A: Table view on mobile, no Kanban on small screens
- Q: TaskTable vs CommonTable? → A: New TaskTable component — purpose-built for task UX

### Session 2026-03-05

- Q: Work Streams sidebar vs standard TC Portal sidebar? → A: Standard TC Portal sidebar with Tasks nav item. No Work Streams concept.
- Q: Confetti on task completion? → A: Yes — vue-confetti-explosion on task completion. Motivating, dopamine hit.
- Q: Click task row behavior? → A: Global modal (CommonModalContainer + TaskForm). Already built.
- Q: Stage colors for On Hold and Approved? → A: On Hold = Purple, Approved = Teal (TC brand)
- Q: Kanban drag-and-drop library? → A: vuedraggable / SortableJS — battle-tested, touch support
- Q: Bulk action bar position? → A: Fixed bottom bar (Linear/Asana pattern) — sticky at viewport bottom with selected count + actions
- Q: Team scope in top bar? → A: Horizontal tabs — My Tasks | All Tasks | [dynamic team tabs]. Always visible, quick switch.
- Q: CommonTable vs custom TaskTable? → A: Use CommonTable for MVP. Build custom TaskTable later if inline editing / DnD needs outgrow it.

---

### Session 2026-03-19 — Design Challenge Clarify

Design challenge ran with 4 students (Linear Lisa, Notion Nate, Asana Ada, ClickUp Carl). User selected **Asana Ada** as the primary direction, cherry-picking from others.

| Phase | Question | Decision |
|-------|----------|----------|
| UX | Task detail: slide-out panel vs global modal? | **Global modal (keep current)**. No slide-out panel. |
| UX | Default grouping: time-based (Do Today/Week/Later) vs priority? | **User chooses** — both available in Group By dropdown. Default to due-date grouping. |
| UX | Stats cards (Overdue/Today/Upcoming) on list view? | **Dashboard tab only** — list view stays clean. Stats/progress belong on a separate Dashboard tab. |
| UI | Add Dashboard as a third view tab? | **Yes — 3 tabs: List / Board / Dashboard.** Dashboard has Asana-style progress sections + stats. |
| UI | Migrate to @inertiaui/table (TanStack Table)? | **Yes.** Built-in inline editing, column resizing, density modes. |
| UI | Density toggle (Compact/Normal)? | **Yes.** Power users get ClickUp-style density. Persisted per user. |
| UX | Quick add pattern? | **Asana-style chain-add.** Inline "+ Add task" at bottom of each section. Enter saves + auto-focuses next row. Escape exits. Critical UX. |
| UX | Quick filter chips? | **Yes.** Asana-style inline chips: Incomplete, Completed, Just my tasks, Due this week. |

**Design references:**
- Mockup viewer: `mockups/challenge/` (served on localhost:4445)
- Vue mockup pages: `https://tc-portal.test/mockups/tasks-v2` (Asana Ada in real components)
- Asana screenshot reference: collapsible sections, grid-style list, filter chips popover, quick add row

## Open Questions

- [ ] Should group-by support multi-level grouping (e.g., Stage > Priority)? → **Deferred from MVP**
- [ ] Calendar view? → **Deferred — placeholder tab can show intent**

---

## Approval

| Role | Name | Date | Status |
|------|------|------|--------|
| Product Owner | | | [ ] Approved |
| Developer | | | [ ] Approved |
