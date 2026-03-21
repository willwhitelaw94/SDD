---
title: "Design Spec"
---


**Epic**: 002-TFE-Task-Frontend-Evolution
**Created**: 2026-01-03
**Status**: Draft

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

### Miro

| Board | Link | Description |
|-------|------|-------------|
| | | |

---

## Competitive Research Summary

### Key Patterns from Modern Task Apps

| App | Table Grouping | Inline Editing | Saved Views | Keyboard |
|-----|---------------|----------------|-------------|----------|
| **Linear** | By status, priority, assignee | Click-to-edit any field | Yes (filters, sorts) | Extensive (99+ shortcuts) |
| **Asana** | Collapsible sections | Yes, grid-style | Yes (multi-sort, multi-filter) | Good |
| **Notion** | Database groups by property | Yes, click any cell | Yes (database views) | Cmd+K palette |
| **Trello** | N/A (Kanban only) | Card titles only | Board filters | Limited |
| **ClickUp** | Multiple group levels | Yes | Yes (personal + shared) | Extensive |

### Best-in-Class Patterns

1. **Linear's Keyboard-First Design** ([shortcuts.design](https://shortcuts.design/tools/toolspage-linear/))
   - `Cmd+K` command palette for everything
   - Single-key shortcuts: `C` create, `A` assign, `P` priority
   - `G+I` go to inbox, `G+B` go to backlog (two-key combos)

2. **Asana's Flexible Grouping** ([Asana Help](https://help.asana.com/hc/en-us/articles/14104942767259-List-view))
   - Group by any field (status, priority, assignee, custom fields)
   - Collapsible sections with task counts
   - Multi-sort and multi-filter with saved views

3. **Notion's Database Views** ([Notion Help](https://www.notion.com/help/boards))
   - Same data, multiple views (table, board, calendar, list)
   - Each view saves its own filters/sorts/groups
   - Group by any property with aggregation

---

## 1. UX Decisions

### User Context
- **Primary Users**: Internal staff (coordinators, care partners, admins)
- **Device Priority**: Desktop-first (80%+ usage), mobile-responsive
- **Usage Pattern**: Daily, multiple sessions, power users want speed

### Task Flow - Happy Path

```
┌─────────────────────────────────────────────────────────────────┐
│  TASKS PAGE                                                      │
├─────────────────────────────────────────────────────────────────┤
│  [My Tasks ▼] [All Tasks] [Team Tasks]     🔍 Search   [+ Task] │
│                                                                  │
│  Filters: [Assigned to me] [Due soon] [Priority ▼] [Stage ▼]   │
│                                                                  │
│  View: [Table ●] [Kanban] [List]    Group by: [None ▼]         │
│        Saved Views: [Default ▼] [Save] [...]                    │
├─────────────────────────────────────────────────────────────────┤
│  ▼ Not Started (12)                                              │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ ☐ │ Task Title          │ Priority │ Stage │ Due  │ ... │   │
│  │ ☐ │ Review patient docs │ 🔴 High  │ To Do │ Today│     │   │
│  │ ☐ │ Update care plan    │ 🟡 Med   │ To Do │ +2d  │     │   │
│  └──────────────────────────────────────────────────────────┘   │
│  ▼ In Progress (5)                                               │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ ☐ │ Call supplier       │ 🟡 Med   │ Active│ +1d  │     │   │
│  └──────────────────────────────────────────────────────────┘   │
│  ▶ Completed (24) - collapsed                                    │
└─────────────────────────────────────────────────────────────────┘
```

### Decision Points
1. **Group by selected**: Show collapsible sections with counts
2. **No group by**: Flat table with standard sorting
3. **View mode changed**: Persist filters, clear selection
4. **Saved view selected**: Apply all settings (filters, sorts, groups, columns)

### Error Recovery
- Failed inline edit: Revert to previous value, show toast
- Failed drag operation: Snap back, show error toast
- Lost connection: Queue changes, sync when restored

### Information Architecture
- **Primary**: Task title, status/stage
- **Secondary**: Priority, assignee, due date
- **Tertiary**: Tags, related objects, timestamps

### Interaction Model
- **Inline editing**: Click cell → edit mode → blur/enter to save (optimistic)
- **Status changes**: Click badge → dropdown → immediate save
- **Bulk actions**: Checkbox → action bar appears at bottom
- **Keyboard**: Full navigation without mouse

---

## 2. UI Decisions

### Architectural Decision: TaskTable vs CommonTable

**Recommendation: Build `TaskTable.vue` as a NEW component**

| Approach | Pros | Cons |
|----------|------|------|
| **Extend CommonTable** | Reuse existing code, consistent patterns | CommonTable is 1000+ lines, adding grouping/inline edit increases complexity significantly |
| **Build TaskTable** ✅ | Purpose-built for task UX, cleaner code, can innovate freely | Some code duplication, separate maintenance |

**Rationale**:
1. CommonTable uses server-side `Table<T>` resource pattern - Tasks use client-side axios
2. Tasks need **inline cell editing** - CommonTable has no cell edit support
3. Tasks need **collapsible groups** - CommonTable has no grouping
4. Tasks need **drag-drop rows** - CommonTable has no DnD
5. Task-specific features (subtask indicators, priority badges) are unique

**Implementation**: Build `TaskTable.vue` that:
- Uses composition (imports CommonCheckbox, CommonBadge, etc.)
- Shares styling patterns with CommonTable
- Can be evolved independently for task-specific needs

### Group By Visual Approach

**Recommendation: Collapsible Sections (Asana-style)**

```
▼ High Priority (3)                    ← Clickable header with count
┌────────────────────────────────────┐
│ ☐ │ Task 1 │ 🔴 High │ To Do │ ... │
│ ☐ │ Task 2 │ 🔴 High │ Active│ ... │
│ ☐ │ Task 3 │ 🔴 High │ Done  │ ... │
└────────────────────────────────────┘
▼ Medium Priority (8)
┌────────────────────────────────────┐
│ ☐ │ Task 4 │ 🟡 Med  │ To Do │ ... │
│ ...                                 │
└────────────────────────────────────┘
▶ Low Priority (15) ← Collapsed, shows count only
```

**Why not swimlanes?** Horizontal scroll on desktop is awkward. Vertical collapsible sections work better for large datasets.

### Component Inventory

#### Existing Components to Reuse
| Component | Usage | Notes |
|-----------|-------|-------|
| `CommonCheckbox` | Row selection | Already used in Tasks |
| `CommonBadge` | Priority/stage indicators | Color variants |
| `CommonSelectMenu` | Inline dropdowns | For priority/stage edit |
| `CommonInput` | Inline text edit | For title edit |
| `CommonButton` | Actions | Various variants |
| `CommonEmptyPlaceholder` | No tasks state | Standard pattern |
| `TaskFilterBar` | Quick filters | Already built |
| `KanbanBoard` | Kanban view | Already built |

#### New Components Required
| Component | Purpose | Priority |
|-----------|---------|----------|
| `TaskTable.vue` | Main table with grouping, inline edit | P1 |
| `TaskTableGroup.vue` | Collapsible group header | P1 |
| `TaskTableRow.vue` | Single task row with inline edit cells | P1 |
| `TaskListView.vue` | Simplified list (mobile-friendly) | P2 |
| `GroupBySelector.vue` | Dropdown for group by options | P1 |
| `ViewModeToggle.vue` | Table/Kanban/List switcher | P1 |

### Saved Views Architecture

Leverage existing `useSavedViews` composable with task-specific config:

```typescript
interface TaskViewConfig {
  filters: {
    priority?: string;
    stage?: string;
    assignedToMe?: boolean;
    dueSoon?: boolean;
    tags?: string[];
  };
  sort: {
    field: string;
    direction: 'asc' | 'desc';
  };
  groupBy: 'none' | 'stage' | 'priority' | 'assignee' | 'due_date';
  viewMode: 'table' | 'kanban' | 'list';
  columns: string[]; // visible columns in order
}
```

**Saveable Settings**:
- Filters (all inline filter values)
- Sort field and direction
- Group by selection
- View mode (Table/Kanban/List)
- Visible columns

**View Types**:
- Personal views (default)
- Shared team views (future)

### Keyboard Shortcuts

Following Linear's patterns ([Linear Shortcuts](https://keycombiner.com/collections/linear/)):

| Shortcut | Action | Context |
|----------|--------|---------|
| `C` | Create new task | Global |
| `Cmd/Ctrl+K` | Command palette | Global |
| `E` | Edit selected task | Task selected |
| `A` | Assign task | Task selected |
| `P` | Set priority | Task selected |
| `D` | Set due date | Task selected |
| `1-5` | Move to stage 1-5 | Task selected |
| `/` | Focus search/filter | Global |
| `?` | Show shortcuts help | Global |
| `↑/↓` | Navigate tasks | Table view |
| `Space` | Toggle task selection | Task focused |
| `Shift+↑/↓` | Extend selection | Table view |
| `Cmd/Ctrl+A` | Select all | Table view |
| `Escape` | Clear selection/close | Global |
| `G then T` | Go to Tasks | Global |
| `G then K` | Go to Kanban | Global |

### States & Loading

| State | Component | Behavior |
|-------|-----------|----------|
| **Loading** | Skeleton rows | 5 skeleton rows with pulsing animation |
| **Empty** | `CommonEmptyPlaceholder` | "No tasks found" with create button |
| **Empty (filtered)** | `CommonEmptyPlaceholder` | "No tasks match filters" with clear button |
| **Error** | `CommonAlert` | Error message with retry button |
| **Saving** | Inline spinner | Small spinner in cell being edited |

### Responsive Behavior

| Breakpoint | Behavior |
|------------|----------|
| **Desktop (1024px+)** | Full table with all columns, side filters available |
| **Tablet (768-1023px)** | Table with fewer columns, inline filters only |
| **Mobile (<768px)** | List view default, swipe actions, bottom sheet for task detail |

---

## 3. Clarification Log

| Phase | Question | Decision |
|-------|----------|----------|
| UX | Primary user type? | Internal staff (coordinators, care partners) |
| UX | Grouping interaction? | Collapsible sections with counts |
| UX | Inline edit feedback? | Optimistic updates with error rollback |
| UI | TaskTable vs CommonTable? | New TaskTable component - purpose-built |
| UI | Group by visual? | Vertical collapsible sections (Asana-style) |
| UI | Saved views scope? | Full config: filters, sort, group, view, columns |

---

## 4. Open Questions

- [ ] Should group by support multi-level grouping (e.g., Stage > Priority)?
- [ ] Calendar view scope - full implementation or just due date visualization?
- [ ] Mobile: native app considerations or web-only?

---

## 5. Approval

- [x] UX decisions documented
- [x] UI decisions documented
- [ ] Ready for `/trilogy.mockup`
- [ ] Ready for `/speckit.plan`

---

## Sources

- [Linear Keyboard Shortcuts](https://shortcuts.design/tools/toolspage-linear/)
- [Linear Cheat Sheet](https://www.shortcutfoo.com/app/dojos/linear-app-mac/cheatsheet)
- [Asana List View Help](https://help.asana.com/hc/en-us/articles/14104942767259-List-view)
- [Asana Flexible Views](https://forum.asana.com/t/introducing-flexible-ways-to-organize-your-tasks-in-list-and-board-views/698744)
- [Notion Board View](https://www.notion.com/help/boards)
- [Notion vs Linear Comparison](https://everhour.com/blog/notion-vs-linear/)
