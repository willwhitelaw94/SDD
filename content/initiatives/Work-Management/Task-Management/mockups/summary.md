---
title: "Task Management MVP — Mockup Summary"
---

## Mockup Files

1. **01-table-view.html** — 5 variations of the main table/list layout
2. **02-kanban-board.html** — 5 variations of the Kanban board
3. **03-task-modal.html** — 5 variations of create/edit task modal
4. **04-inline-editing.html** — 5 variations of inline editing interactions
5. **05-keyboard-shortcuts.html** — 5 variations of keyboard shortcuts & discoverability

## Recommendations Summary

| Screen | Recommended | Rationale |
|--------|-------------|-----------|
| Table View | **Option A — Full Groups with Chip Bar** | Clear priority grouping, collapsible sections, Asana-proven pattern, chip filters for quick refinement |
| Kanban Board | **Option A — Standard Kanban** | Linear-style simplicity, familiar drag-and-drop, stage columns match spec stages exactly |
| Task Modal | **Option B — Right Side Panel** | Non-blocking (keeps list visible), natural for edit flows, tabs for comments/activity |
| Inline Editing | **Option A — Priority & Stage Dropdowns** | Click-to-edit matches Linear/Notion, popovers feel lightweight, optimistic updates with toast |
| Keyboard Shortcuts | **Option B — Shortcuts Help Overlay** | Full reference modal (? key), layered with inline hints on hover |

## Variation Details

### 01 — Table View

| Option | Name | Pros | Cons |
|--------|------|------|------|
| A | Full Groups with Chip Bar | Clear hierarchy, collapsible sections, chip filters | More vertical space per group header |
| B | Flat Table with Bulk Bar | Dense data, floating bulk action bar | No visual grouping, harder to scan by priority |
| C | Dense/Compact | Maximum rows visible, zebra striping | Small text, less breathing room |
| D | Card-Enhanced Table | Two-line rows, priority left border, description preview | Takes more vertical space per row |
| E | Split Panel | List + detail side-by-side, checklist/activity visible | Narrower list, only works on wide screens |

### 02 — Kanban Board

| Option | Name | Pros | Cons |
|--------|------|------|------|
| A | Standard Kanban | Simple, familiar, drag-and-drop | Can't see priority grouping |
| B | Swimlane | Priority rows × Stage columns | Complex matrix, overwhelming with many tasks |
| C | Compact Cards | Minimal, WIP limits, quick-add input | Less info per card |
| D | Rich Cards | Description, tags, linked items, progress | Cards are large, fewer visible |
| E | Collapsible Columns | Completed collapsed to strip | Unusual pattern, may confuse users |

### 03 — Task Modal

| Option | Name | Pros | Cons |
|--------|------|------|------|
| A | Center Modal — Create | Full form, validation example | Blocks underlying view |
| B | Right Side Panel — Edit | Non-blocking, comments/activity tabs | Narrower form area |
| C | Full-Width Detail | Two-column, metadata sidebar | Takes full screen |
| D | Minimal Quick-Create | Essential fields, expandable | Limited initial fields |
| E | Multi-Step Wizard | Guided 3-step flow | Slower for power users |

### 04 — Inline Editing

| Option | Name | Pros | Cons |
|--------|------|------|------|
| A | Priority & Stage Dropdowns | Click-to-edit popovers, toast feedback | One field at a time |
| B | Date Picker | Calendar popover, quick actions | Calendar takes space |
| C | Tags & Assignee | Autocomplete chips, avatar selector | Complex multi-select |
| D | Title & Checklist | Inline input, drag-handle subtasks | Needs careful focus management |
| E | Bulk Edit & States | Floating bar, validation/loading states | Requires selection first |

### 05 — Keyboard Shortcuts

| Option | Name | Pros | Cons |
|--------|------|------|------|
| A | Command Palette (⌘K) | Spotlight search, fast navigation | Hidden, needs discovery |
| B | Shortcuts Help Overlay | Full reference, categorised | Modal interrupts flow |
| C | Inline Shortcut Hints | Contextual badges on UI elements | Visual noise |
| D | Onboarding Tour | Progressive tooltips | Only useful once |
| E | Status Bar | VS Code-style bottom bar, context-sensitive | Uses screen real estate |

## Key Design Decisions

1. **Collapsible sections** for table grouping (vertical, not horizontal swimlanes)
2. **Right side panel** for task editing (non-blocking, keeps list visible)
3. **Optimistic updates** for inline editing with toast confirmation
4. **Standard Kanban** with stage columns matching spec stages
5. **Full shortcuts overlay** (? key) combined with inline hints on hover
6. **Command palette** (⌘K) as power-user feature for navigation and actions

## Next Steps

- [ ] Review mockups — browse all 5 screens via the viewer toolbar
- [ ] Pick preferred variations for each screen
- [ ] Update this summary with final selections
- [ ] Proceed to `/speckit-plan` for technical implementation planning
