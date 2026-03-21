---
title: "Research — Canvas Clara (Card Canvas / Kanban)"
student: Clara
pattern: Card Canvas / Kanban Board
date: 2026-03-10
---

# Research — Kanban / Card Canvas UI Patterns

## 1. Trello

**URL:** trello.com

**Key patterns observed:**
- Horizontal scrolling board with vertical lists (columns)
- Cards are minimal: title, labels (colored bars), member avatars, due date badge, attachment count
- Drag-and-drop between lists to change status
- Card detail opens as a centered modal overlay with full content
- Checklists inside cards with progress bar percentage
- "Add a card" button at bottom of each list
- Labels are small colored rectangles at card top — hoverable to see names
- Activity feed on card detail shows every change chronologically

**Relevance to complaints:** Lists map directly to complaint stages. Card labels map to triage levels. Checklists map to Action Plan items. Activity feed maps to notes/history.

---

## 2. Jira Board View

**URL:** atlassian.com/software/jira

**Key patterns observed:**
- Board columns represent workflow statuses (To Do, In Progress, Done — customizable)
- Cards show: issue key (REF-style), summary, priority icon, assignee avatar, story points
- Column headers show card count and optional WIP limits (highlighted red when exceeded)
- Swimlanes group cards by epic, assignee, or priority — collapsible horizontal bands
- Card detail opens as a full right-side panel (not modal), board stays visible but compressed
- Quick filters bar above the board: text search, assignee, type, label
- Cards have colored left border indicating priority level
- Drag constraints: can configure allowed transitions (not every column-to-column move is valid)

**Relevance to complaints:** WIP limits are directly useful for workload management. Priority-colored borders map to triage levels. Swimlanes could group by department or type. Constrained drag matches the stage lifecycle.

---

## 3. Monday.com Board View

**URL:** monday.com

**Key patterns observed:**
- Kanban view is one of multiple view modes (table, timeline, calendar, kanban)
- Cards are wider than Trello — show more metadata inline (status pill, person, date, tags)
- Color-coded column headers with strong saturation
- Cards have a "card cover" option — color band across top
- Grouping by any column value, not just status
- Card click opens a full-width slide-over panel from the right
- Summary row at bottom of each column (count, sum of values)
- "New item" button appears on hover at bottom of columns

**Relevance to complaints:** Rich card content useful for showing triage level, assignee, and dates without clicking. Column summaries could show "3 urgent" counts. Slide-over panel for detail view.

---

## 4. Asana Board View

**URL:** asana.com

**Key patterns observed:**
- Clean, minimal card design — task name, colored dots for projects, assignee avatar, due date
- Sections become columns; cards drag between sections
- Column headers are editable inline — feels lightweight
- Card detail opens as a right panel (about 50% width), board remains interactive behind it
- Subtasks shown as a count badge on card, expandable in detail
- Rules engine: "when card moves to Done, mark complete" — automated transitions
- Multi-select cards for bulk actions (move, assign, set due date)
- Custom fields shown as small badges on cards

**Relevance to complaints:** Subtask count badge maps to Action Plan progress. Right panel detail view keeps board context. Automated rules could auto-advance stages. Bulk actions useful for coordinators managing many records.

---

## 5. Linear Board View

**URL:** linear.app

**Key patterns observed:**
- Ultra-clean, keyboard-first design — minimal chrome
- Cards show: issue ID, title, priority icon (colored), status dot, assignee avatar
- Priority levels use distinct icons and colors (Urgent=red, High=orange, Medium=yellow, Low=gray)
- Board columns have subtle background color differentiation
- Card click opens a full detail view that replaces the board (not overlay)
- Cycle/sprint grouping above board
- Filters are inline chips, not a separate bar
- View density toggle: compact vs comfortable card sizes
- Sub-issue progress shown as a tiny progress arc on card

**Relevance to complaints:** Priority icon system maps perfectly to triage levels. Clean aesthetic suits a professional care management tool. Inline filter chips are space-efficient. Progress arc could show Action Plan completion.

---

## Synthesis — Patterns to Adopt

| Pattern | Source | Application |
|---------|--------|-------------|
| Horizontal scrolling columns per stage | All | Core layout — one column per complaint stage |
| Colored left border by priority | Jira | Red=Urgent, Orange=Medium, Gray=Standard |
| WIP limits on columns | Jira | Prevent coordinator overload at Investigation |
| Right slide-over detail panel | Monday, Asana | Keep board context while viewing record |
| Checklists with progress bar | Trello | Action Plan items with completion tracking |
| Card: REF#, subject, triage badge, avatar | All | Consistent card anatomy |
| Filter bar with type/triage/search | Jira, Linear | Quick filtering without leaving board |
| Drag to advance stage | All | Primary interaction for stage progression |
| Activity feed on card | Trello | Notes and stage change history |
| Overdue indicator on card | Trello, Linear | Flame icon for time-sensitive complaints |
