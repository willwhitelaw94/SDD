---
title: "Design Challenge Brief: Task Management V2"
---

# Design Challenge Brief: Task Management V2

## Challenge Overview
Rethink the entire Task Management page — the sidebar, table/list, kanban, create/edit dialog, and inline editing — through 4 fundamentally different UI paradigms.

## Feature Summary
Task Management is the central work hub for all internal users. It must support:
- **Multiple boards** — My Tasks, Assigned, Team boards
- **Two view modes** — Table (with group-by) and Kanban (standard, compact, swimlane)
- **Create/Edit dialog** — Global modal for quick task capture and full detail editing
- **Inline editing** — Click-to-edit priority, stage, assignee, due date, tags directly in the table
- **Bulk operations** — Multi-select, shift-click range, bulk stage/priority/assignee changes
- **Keyboard shortcuts** — Linear-style: C (create), 1-5 (stage), ?, Cmd+K
- **Subtasks** — Self-referential parent_id, progress indicators
- **Comments & Activity** — Threaded comments + automated activity log
- **Templates** — Pre-built task patterns for common workflows
- **Business object linking** — Polymorphic links to clients, packages, bills, etc.

## User Stories to Address
1. US01 — View and manage tasks in table view with grouping
2. US02 — View and manage tasks in kanban board
3. US03 — Create and edit tasks via global modal
4. US04 — Inline edit task fields in table
5. US05 — Keyboard shortcuts and command palette
6. US06 — Subtasks
7. US07 — Comments and activity feed
8. US08 — Bulk task operations

## Screens to Design (Per Student)

| # | Screen | Focus |
|---|--------|-------|
| 1 | **Task List** | Main page layout: sidebar navigation, table with grouping, filters, board switching |
| 2 | **Kanban Board** | Column-based stage view with cards, drag-drop, compact/swimlane variants |
| 3 | **Task Dialog** | Create mode (quick capture) + Edit mode (full detail with comments/activity) |
| 4 | **Inline Editing** | Click-to-edit cells: priority dropdown, stage selector, date picker, assignee, tags |

## Key Interactions to Design
1. Switching between boards (My Tasks, Assigned, Team X)
2. Switching between table and kanban views
3. Group-by selector and collapsible group headers
4. Drag-and-drop in kanban to change stage
5. Quick task creation (minimal fields → save)
6. Full task editing with metadata sidebar
7. Inline cell editing with optimistic save
8. Bulk selection and action bar
9. Subtask progress indicators
10. Comment thread in task detail

## Constraints
- Must use TC Portal design system colours (teal-700 #007F7E, teal-500 #43C0BE)
- Skeleton sidebar shell for framing context
- Must work at 1280px+ viewport (desktop-first, kanban desktop-only)
- No PrimeVue — custom components only
- Must support 50-200 tasks without performance degradation

## Evaluation Criteria
1. **Familiarity** — How recognizable are the patterns? (Jakob's Law)
2. **Speed** — How fast can users complete common tasks?
3. **Clarity** — Is the status/action obvious at a glance?
4. **Scalability** — Does it work for 5 items or 200?
5. **Information Density** — Right amount of data visible without overwhelming

## Students

```
    ┌─────────┐          ╭━━━━━╮          ╔═══════════╗          ⚡ ⚡ ⚡
    │  ◠ ◠   │          ┃ ⊙ ⊙ ┃  ☕       ║  👓      ║         ┌─────────┐
    │   ▽    │          ┃  △  ┃           ║  ◉   ◉   ║         │  ● ●   │
    │  ╰─╯   │          ┃ ╰─╯ ┃           ║    ◇     ║         │   ◇    │
    └─────────┘          ╰━━━━━╯           ╚═══════════╝         └─────────┘
       │││                /│ │\              /│ │\                ⚡⚡⚡

  LINEAR LISA       NOTION NATE        ASANA ADA        CLICKUP CARL
 "Less, but         "Everything is      "See your        "Every pixel
  faster"            a database"         progress"        is data"
```

| # | Student | Paradigm | Focus |
|---|---------|----------|-------|
| 1 | Linear Lisa | **Minimal Zen** | Clean, sparse, keyboard-first. Command palette driven. No clutter. |
| 2 | Notion Nate | **Contextual Sidebar** | Database-view thinking. Side panels, inline everything, toggleable properties. |
| 3 | Asana Ada | **Dashboard + Cards** | Progress-focused. My Tasks hub, timeline awareness, visual completion tracking. |
| 4 | ClickUp Carl | **Spreadsheet Power** | Maximum density. Editable grid, custom views, power-user heaven. |

## Deliverables Per Student
1. 4 HTML mockup screens (one per agreed screen above)
2. `viewer-toolbar.js` per student folder (navigation + Figma copy)
3. Shared `comparison.md` with pattern analysis + cherry-pick recommendations
