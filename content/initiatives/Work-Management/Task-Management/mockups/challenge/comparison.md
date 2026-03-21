---
title: "Task Management V2 — Design Challenge Comparison"
---

# Design Challenge Comparison: Task Management V2

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

---

## Pattern Comparison

### Task List Layout

| Student | Sidebar | Grouping | Data Density | Keyboard Focus |
|---------|---------|----------|-------------|----------------|
| **Linear Lisa** | None — compact header tabs | Text section headers, spacing-based | Low — sparse rows, breathing room | Primary — shortcuts hinted at bottom |
| **Notion Nate** | Inner page tree sidebar | Collapsible chevron sections | Medium — property columns | Secondary — mouse-first with shortcuts |
| **Asana Ada** | Board nav + stats sidebar | Asana-style sections (Do Today/This Week/Later) | Medium — rows with progress indicators | Secondary — visual-first |
| **ClickUp Carl** | Space/Folder/List hierarchy | Coloured group headers with task counts | Maximum — spreadsheet grid, every column visible | Tertiary — toolbar-driven |

### Kanban Board

| Student | Card Style | Card Info | Swimlanes | Extras |
|---------|-----------|-----------|-----------|--------|
| **Linear Lisa** | Ultra-minimal, no borders | Title + priority dot + initials + date | None | Drop zone hints |
| **Notion Nate** | Medium cards with hover lift | Title + priority tag + avatar + date | None (disabled in board) | Column "..." menu |
| **Asana Ada** | Rich cards with priority border | Title + description + subtask bar + tags | None | WIP indicator, collapsed Done |
| **ClickUp Carl** | Dense cards with everything | Title + avatar stack + date + tags + subtasks + time estimate | Priority swimlane rows | WIP limits, drag handles, collapsed Done |

### Task Dialog

| Student | Create UX | Edit UX | Layout | Personality |
|---------|-----------|---------|--------|-------------|
| **Linear Lisa** | Narrow centered modal, title-first, expandable details | Right panel (~420px), key-value metadata | Minimal, progressive | Speed-first, keyboard Esc/⌘Enter |
| **Notion Nate** | Right peek panel, property table | Right peek panel, property table + description + comments | Consistent peek pattern | Database-thinking, slash commands |
| **Asana Ada** | Friendly modal with gradient header, smart defaults | Two-column: content left, metadata right | Warm, guided | Progress rings, celebration |
| **ClickUp Carl** | Full-width modal, two-column form, rich text toolbar | Full detail with tabbed sections | Dense, everything visible | Power-user, custom fields |

### Inline Editing

| Student | Popover Style | Simultaneously Editable | Bulk Actions | Feedback |
|---------|-------------- |------------------------|-------------|----------|
| **Linear Lisa** | Minimal, no borders, subtle shadows | One at a time | Not shown | Toast with undo |
| **Notion Nate** | White bg, thin border, Notion-style | Multiple shown for demo | Filter bar shown | Coloured option selection |
| **Asana Ada** | Rounded, descriptive options | Multiple shown | Full bulk bar | Toast with undo |
| **ClickUp Carl** | Dense, spreadsheet-style | Multiple simultaneously | Full floating bar + context menu | Status bar counts |

---

## Trade-off Matrix

| Criteria | Linear Lisa | Notion Nate | Asana Ada | ClickUp Carl |
|----------|:-----------:|:-----------:|:---------:|:------------:|
| **Familiarity** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| **Speed** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Clarity** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| **Scalability (200+ tasks)** | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Info Density** | ⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Learning Curve** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐ |
| **Mobile Adaptability** | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐ |

---

## Cherry-Pick Recommendations

### Adopt — Take these patterns into the unified design

| Pattern | Source | Why |
|---------|--------|-----|
| **Compact header with board tabs** | Linear Lisa | Eliminates sidebar navigation clutter, keeps focus on tasks. Board tabs (My Tasks, Assigned, Team) as minimal text are faster than a sidebar tree. |
| **Sparse table rows with priority dots** | Linear Lisa | Priority dots are scannable and take less space than badge pills. Combined with clean typography, the list breathes. |
| **Keyboard hints at bottom-left** | Linear Lisa | Non-intrusive, always-visible reminder of shortcuts without cluttering the UI. |
| **Side panel for edit (peek pattern)** | Notion Nate | Keeps the list visible while editing — no context loss. Better than a modal for frequent edit workflows. |
| **Property table (key-value metadata)** | Notion Nate | Structured, predictable layout for task metadata. Every property is inline-editable. Scales well with additional fields. |
| **Progress sections (Do Today / This Week / Later)** | Asana Ada | Time-based grouping is more actionable than priority grouping for daily work. "What do I do now?" is answered immediately. |
| **Stats bar (overdue/today/upcoming counts)** | Asana Ada | At-a-glance awareness of task load without scrolling. Three small cards above the list. |
| **Rich kanban cards with subtask progress** | Asana Ada | The right amount of info on a card — title, priority border, assignee, date, subtask bar. Not too sparse (Lisa), not too dense (Carl). |
| **Bulk action bar** | ClickUp Carl | ClickUp's floating bulk bar is the most actionable — shows selected count with inline action buttons. |
| **Status bar** | ClickUp Carl | Bottom status bar showing task count, active filters, current grouping, and view mode provides constant orientation. |
| **Inline editing with multiple simultaneous editors** | ClickUp Carl | Power users need to edit multiple cells efficiently. Show one popover at a time but allow fast tab-between-fields. |

### Consider — Worth evaluating but not mandatory

| Pattern | Source | Trade-off |
|---------|--------|-----------|
| View tabs (Table/Board/Calendar/Timeline) | Notion Nate | More views add capability but also complexity. Start with Table + Board; add Calendar later. |
| Properties toggle (show/hide columns) | Notion Nate | Useful for power users but adds toolbar complexity. Could be a "..." menu option. |
| WIP limits on kanban | ClickUp Carl | Useful for teams with process discipline. Might be overkill for a care team. |
| Completion progress ring | Asana Ada | Motivating but requires defining "complete" — is it % of tasks done today? All time? |
| Subtask tree in table | ClickUp Carl | Hierarchical display is powerful but adds complexity. Could be a toggle. |
| Right-click context menu | ClickUp Carl | Power-user shortcut but not discoverable. Could supplement, not replace, explicit actions. |

### Avoid — Don't use these patterns

| Pattern | Source | Why Not |
|---------|--------|---------|
| No sidebar at all | Linear Lisa | While clean, our users need board navigation (My Tasks, Assigned, Team X). Compact sidebar is better than none. |
| Full Notion page tree sidebar | Notion Nate | Over-engineered for this use case. We don't have nested pages/folders. Simple board list is enough. |
| Create modal with gradient header | Asana Ada | Too decorative for a productivity tool. Clean, functional create flow is faster. |
| Space/Folder/List hierarchy | ClickUp Carl | Our data model doesn't have this depth. Adds UI complexity without benefit. |
| Custom fields section | ClickUp Carl | Not in MVP scope. Adds visual noise for a feature that doesn't exist yet. |
| Full rich text editor toolbar in create | ClickUp Carl | Markdown is sufficient. Rich text toolbar adds cognitive load to quick task creation. |

---

## Recommended Unified Direction

**"Linear clarity meets Asana progress"** — Take Linear Lisa's clean, keyboard-first aesthetic and combine it with Asana Ada's progress awareness and time-based sections. Use Notion Nate's side-panel edit pattern. Use ClickUp Carl's bulk actions and status bar for power users.

### Unified Design Principles
1. **Compact sidebar** — Board tabs as a narrow card (like current), not a page tree
2. **Sparse table rows** — Priority dots, clean typography, breathing room
3. **Time-based grouping default** — Do Today / This Week / Later (with option to group by priority/stage/assignee)
4. **Stats bar** — Three cards: Overdue, Due Today, Upcoming
5. **Side panel for edit** — Notion-style peek, keeps list visible
6. **Minimal create dialog** — Title-first, expandable details, no gradient
7. **Rich-but-not-dense kanban cards** — Priority border, title, assignee, date, subtask bar
8. **Keyboard hints** — Bottom-left, always visible
9. **Bulk action bar** — Floating bar with inline actions
10. **Status bar** — Bottom, showing count + filters + view mode
