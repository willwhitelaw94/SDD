---
title: "Linear Lisa — Pattern Research"
---

# Linear Lisa — Pattern Research

**Paradigm:** Linear App
**Focus:** Clean minimal UI, command palette, keyboard shortcuts, high information density

---

## Pattern 1: Command Palette (Cmd+K) as Universal Action Hub

Linear's command palette is a fuzzy-find modal that puts every action in the app at the user's fingertips. It is not a search box — it is the primary action dispatch mechanism. Users type what they want to do, and the palette matches against actions, views, issues, projects, and settings.

**How it works in Linear:**

- `Cmd+K` opens the palette from any screen. The input is pre-focused — no extra click needed.
- Typing filters results instantly with fuzzy matching. "ass john" matches "Assign to John Smith".
- Results are categorised into sections: Actions, Issues, Projects, Views. Each section has a header and keyboard-navigable items.
- Every result row shows its keyboard shortcut on the right side (e.g., `S` for status, `A` for assignee). This turns the palette into a learning tool — users discover shortcuts by searching for actions.
- The right arrow key (`→`) opens a Quick Look preview of an issue directly within the command palette, without leaving it.
- Recent actions and frequently used commands appear first, adapting to the user's workflow over time.

**Keyboard shortcuts exposed through the palette:**

| Shortcut | Action |
|----------|--------|
| `C` | Create new issue (from any view) |
| `S` | Change status |
| `A` | Assign to someone |
| `P` | Set priority |
| `L` | Apply label |
| `D` | Set due date |
| `Cmd+Shift+M` | Move issue between teams |
| `?` | Show all keyboard shortcuts |

**Design details:**

- The palette appears as a centered, floating modal with a subtle backdrop blur. No heavy overlay — you can still see the page beneath.
- Results load with zero perceptible latency. Linear caches aggressively to maintain the < 100ms interaction target.
- Dismissing with `Esc` returns focus to exactly where it was before.

---

## Pattern 2: Keyboard-First List Navigation with Peek Preview

Linear's list view treats the keyboard as the primary input device. The mouse is supported but not required. Every row in a list is navigable, selectable, and actionable without touching the mouse.

**How it works in Linear:**

- `J` / `K` (or `↑` / `↓`) move the highlight cursor through the list. The highlighted row has a subtle background tint — not a heavy selection state, just enough to know where you are.
- `Enter` opens the highlighted issue in full detail view.
- `Space` toggles the **peek preview** — a side panel that shows the issue's description, assignee, status, priority, labels, estimate, cycle, and dates. The list remains visible and navigable while peek is open. This is analogous to macOS Finder's Quick Look.
- Holding `Space` (press and hold) shows peek temporarily — releasing it dismisses the panel. A quick press toggles it on/off persistently.
- While peek is active, `J`/`K` navigation updates the peek panel in real time. The user can scan through 20 issues in seconds without opening any of them.

**Selection and bulk operations:**

- `X` selects the currently highlighted issue (adds a checkmark). The user can then `J`/`K` to another issue and `X` again to build a multi-selection.
- `Shift + ↑/↓` extends the selection range contiguously.
- `Cmd+A` selects all visible issues (respects active filters).
- Once issues are selected, a **bulk action toolbar** slides up from the bottom of the screen. It shows the count of selected issues and action buttons: Status, Assignee, Priority, Label, Project, Cycle, and more.
- The bulk toolbar is also keyboard-accessible — the command palette (`Cmd+K`) becomes contextual to the selection, showing only batch-applicable actions.
- `Esc` clears the selection and dismisses the toolbar.

**List display:**

- Each row shows: issue identifier (e.g., `ENG-142`), title, status icon (coloured dot), priority icon (bars), assignee avatar, labels (as small coloured pills), and due date — all in a single dense row.
- Rows are approximately 32-36px tall. No unnecessary padding. The information density is high but legible.
- Hovering over the far left edge of a row reveals a checkbox for mouse-based selection.

---

## Pattern 3: Issue Detail View — Content + Properties Sidebar

Linear's issue detail view uses a two-panel layout: rich content on the left, structured metadata on the right. The content area behaves like a document; the properties sidebar behaves like a form.

**Layout structure:**

- **Left panel (main content, ~65% width):**
  - Issue title — rendered as a large, editable heading. Click to edit inline. No "edit mode" toggle — the title is always directly editable.
  - Issue description — a rich-text block editor (markdown-based). Click anywhere in the description to start editing. Content auto-saves. Version history available via `Cmd+K` → "Issue content history" (snapshots every 10 minutes).
  - Below the description: a comment thread. Each comment is threaded and resolvable. Resolved threads collapse to reduce noise.
  - Activity feed below comments: status changes, assignment changes, label changes — each as a compact, timestamped line.

- **Right panel (properties sidebar, ~35% width):**
  - Properties are displayed as a vertical list of key-value pairs. Each property is independently editable by clicking the value.
  - **Status** — Coloured dot + label (e.g., "In Progress"). Clicking opens a dropdown with all workflow states grouped by category (Backlog, Unstarted, Started, Completed, Canceled). Keyboard shortcut: `S`.
  - **Assignee** — Avatar + name. Clicking opens a searchable member dropdown. Keyboard shortcut: `A`.
  - **Priority** — Icon (bars) + label (Urgent, High, Medium, Low, None). Clicking opens a selector. Keyboard shortcut: `P`.
  - **Labels** — Coloured pills. Clicking opens a multi-select searchable dropdown. Keyboard shortcut: `L`.
  - **Project** — Name with project icon. Clickable to reassign.
  - **Cycle** — Current cycle name. Clickable.
  - **Due date** — Date picker. Keyboard shortcut: `D`.
  - **Estimate** — Points display. Clickable.
  - **Relations** — Blocking/blocked-by links to other issues.
  - **Created / Updated** — Timestamps (read-only).

**Key interaction pattern:**
Every property in the sidebar uses the same micro-interaction: click the value, a contextual dropdown or picker appears inline (not a modal), make your selection, it saves immediately with no "Save" button. This is "click to set" — not "click to edit, change, then save".

**Right-click context menu:**
Right-clicking any issue (in lists, boards, or the detail view) opens a comprehensive context menu with all available actions: set status, priority, assignee, estimate, labels, project, cycle, mark as duplicate, copy branch name, copy issue URL, and delete. Sub-menus use the "safe area triangle" pattern — an invisible polygon between cursor and sub-menu that prevents accidental dismissal during diagonal mouse movement.

---

## Pattern 4: Filtering and Grouping System

Linear's filter system is designed for incremental refinement. You start with a broad view and narrow it down through composable filters — never a single complex query upfront.

**How it works in Linear:**

- Press `F` to open the filter menu from any list or board view. The menu appears as a popover attached to the filter bar.
- The filter menu shows all available filter properties: Status, Assignee, Priority, Label, Project, Cycle, Due Date, Created Date, Creator, Estimate, and more.
- Typing while the filter menu is open performs fuzzy search across filter properties. Typing "john" would surface "Assignee: John Smith" as a quick filter.
- Each filter has contextual operators: `is`, `is not`, `is either of`, `is not either of`. Labels and links support additional operators: `includes any`, `includes all`, `includes neither`, `includes none`.
- Multiple filters combine with AND/OR logic. After adding 2+ filters, a toggle appears: "all filters" (AND) or "any filter" (OR).
- Advanced filters allow grouping conditions with nested AND/OR groups for precise views.

**Grouping:**

- Independent from filtering. The `Group by` control lets you group the list by: Status, Assignee, Priority, Project, Cycle, Label, or No Grouping.
- Grouped lists show collapsible section headers with counts. Each group can be expanded/collapsed independently.
- Combined with sorting (manual, priority, status, created date, updated date), grouping creates powerful pipeline-style views.

**Saved Views:**

- Any combination of filters, grouping, and sorting can be saved as a **Custom View**. Views are named, shareable with the team, and appear in the sidebar navigation.
- Views can be favourited (pinned to sidebar) for one-click access.
- Each view has its own URL — shareable and bookmarkable.

---

## Pattern 5: Status Transitions — Inline, Frictionless, Multi-Modal

Linear does not use wizards or modals for status transitions. Status changes are treated as a property update — fast, inline, and reversible.

**How status changes work in Linear:**

1. **From the list view:** Click the coloured status dot on any row. A dropdown appears inline with all workflow states. Select one. Done. No confirmation dialog.

2. **From the detail view sidebar:** Click the Status property. Same dropdown. Same single-click change.

3. **From the keyboard:** Press `S` while an issue is highlighted (list) or open (detail). The status dropdown appears. Type to filter states. Arrow keys + `Enter` to select.

4. **From the command palette:** `Cmd+K` → type "status" → select new status. Works from anywhere.

5. **From the context menu:** Right-click → Status → select state from sub-menu.

6. **From the board view:** Drag a card from one column to another. Columns represent status categories.

7. **Via bulk selection:** Select multiple issues → bulk toolbar → Status button → select status. All selected issues update simultaneously.

**Workflow state categories:**
States are grouped into immutable categories that define the flow direction:

| Category | Purpose | Default State | Visual |
|----------|---------|---------------|--------|
| Triage | Incoming work, needs review | Triage | Grey |
| Backlog | Accepted but not planned | Backlog | Grey |
| Unstarted | Planned, not yet started | Todo | White/unfilled |
| Started | Work in progress | In Progress | Yellow |
| Completed | Done | Done | Green/purple |
| Canceled | Abandoned or rejected | Canceled | Red/grey |

Custom states can be added within any category (e.g., "In Review" under Started, "QA" under Started). Categories cannot be reordered — they enforce the conceptual flow.

**Key design decisions:**

- **No confirmation dialogs.** Status changes are instant and reversible. `Cmd+Z` undoes the last change. This removes the friction that plagues modal-heavy CRMs.
- **No mandatory fields per transition.** Linear trusts users to add context when needed (via comments or description updates) rather than gating transitions behind form completion.
- **Visual feedback is immediate.** The status dot colour changes, the issue moves in board view, and a toast notification appears at the bottom confirming the change — all within ~100ms.
- **Activity log captures everything.** Every status change is recorded in the issue's activity feed with timestamp, previous state, new state, and who made the change.

---

## Sources

- [How we redesigned the Linear UI (part II)](https://linear.app/now/how-we-redesigned-the-linear-ui)
- [Linear Keyboard Shortcuts](https://shortcuts.design/tools/toolspage-linear/)
- [Linear's Delightful Design Patterns You Should Copy](https://gunpowderlabs.com/2024/12/22/linear-delightful-patterns)
- [Invisible Details — Building Contextual Menus](https://linear.app/now/invisible-details)
- [Peek Preview — Linear Docs](https://linear.app/docs/peek)
- [Edit Issues — Linear Docs](https://linear.app/docs/editing-issues)
- [Select Issues — Linear Docs](https://linear.app/docs/select-issues)
- [Issue Status — Linear Docs](https://linear.app/docs/configuring-workflows)
- [Filters — Linear Docs](https://linear.app/docs/filters)
- [Display Options — Linear Docs](https://linear.app/docs/display-options)
- [Custom Views — Linear Docs](https://linear.app/docs/custom-views)
- [Concepts — Linear Docs](https://linear.app/docs/conceptual-model)
- [Command Palette UX Patterns](https://medium.com/design-bootcamp/command-palette-ux-patterns-1-d6b6e68f30c1)
- [Command K Bars — Maggie Appleton](https://maggieappleton.com/command-bar)
