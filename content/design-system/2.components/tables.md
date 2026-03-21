---
title: "Tables"
description: "Table component — columns, sorting, filtering, pagination, actions, and responsive behaviour"
---

# Tables

Tables are defined in the [Figma Tables page](https://www.figma.com/design/ojTCI9yefnl9ORYEVrv2WJ/Trilogy-Care-Design-System?node-id=43-7119) and implemented as `CommonTable.vue` with a suite of sub-components.

**Component:** `resources/js/Components/Common/table/CommonTable.vue`
**Storybook:** `stories/Common/Table/CommonTable.stories.js`
**Types:** `resources/js/types/table.ts`

## Figma Structure

The Figma page is split into two frames:

| Frame | Content |
|---|---|
| **Table Elements** | Column types, cell rendering, row states, pagination, bulk actions |
| **Actions & Examples** | Row actions, status badges, full table examples |

Additional frames show real portal table implementations (Recipient Portal, Admin tables).

## Anatomy

### Toolbar

```
┌──────────────────────────────────────────────────────────────────┐
│  🔍 Search placeholder...        [Actions ▼] [Filter] [Cols] [⊞]│
├──────────────────────────────────────────────────────────────────┤
│  [Status = Active ✕]  [Date > 2024-01-01 ✕]                     │  ← Active filters
├──────────────────────────────────────────────────────────────────┤
```

- **Search** — `CommonInput` with magnifying glass icon, minimum 2 characters to trigger
- **Actions dropdown** — Bulk actions + exports (`CommonTableAction`)
- **Filter button** — Add filters menu (`CommonTableFilterAction`), icon-only on mobile
- **Column toggle** — Eye icon dropdown (`CommonTableToggleColumn`), icon-only on mobile
- **View toggle** — Table/Grid switcher (`CommonToggleGroup`), only when `type="both"`
- **Filters bar** — Row of active filter chips below toolbar

### Table

```
┌────────┬────────────┬────────┬──────────┬─────────┐
│ ☐      │ Name ↕     │ Status │ Date ↕   │ Actions │  ← Header (sortable columns)
├────────┼────────────┼────────┼──────────┼─────────┤
│ ☐      │ John Doe   │ Active │ 12 Aug   │ ⋯       │  ← Row (default)
│ ☑      │ Jane Smith │ Pending│ 15 Sep   │ ⋯       │  ← Row (selected, teal left border)
│ ☐      │ Bob Lee    │ —      │ 03 Oct   │ [View]  │  ← Row (empty cell, inline action)
├────────┴────────────┴────────┴──────────┴─────────┤
│          Page 1 of 5    |< < > >|    [15 ▼] /page │  ← Pagination
└───────────────────────────────────────────────────┘
```

### Grid View

```
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│  Grid Item       │  │  Grid Item       │  │  Grid Item       │
│  #grid-item-     │  │  #grid-item-     │  │  #grid-item-     │
│   header         │  │   header         │  │   header         │
│  #grid-item-     │  │  #grid-item-     │  │  #grid-item-     │
│   content        │  │   content        │  │   content        │
└─────────────────┘  └─────────────────┘  └─────────────────┘
```

Grid layout: `grid-cols-12` with items at `col-span-12 sm:col-span-6 xl:col-span-4`.

## Table Features

`CommonTable` is a feature-rich data table built on InertiaJS with generic TypeScript support:

| Feature | Description |
|---|---|
| Search | Fuzzy search with 2-character minimum, debounced |
| Sorting | Single-column ascending/descending/none toggle |
| Filtering | Filter badges with add/remove controls (text, badge, set, date, numeric, boolean) |
| Pagination | Full, simple, or cursor-based with per-page selector |
| Bulk Actions | Checkbox selection with action dropdown |
| Row Actions | Smart inline/dropdown action menu per row |
| Column Toggle | Show/hide toggleable columns |
| Export | Sync and async export support |
| View Toggle | Switch between table and grid views |
| Sticky Columns | Horizontal scroll detection with shadow indicators |
| Middle-click | Opens row action URL in new tab |
| Prefetch | Inertia link prefetching for row actions |

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `resource` | `Table<T>` | Required | InertiaTable response with results, columns, filters, actions, exports |
| `searchPlaceholder` | `string` | Required | Search input placeholder text |
| `type` | `'table' \| 'grid' \| 'both'` | `'table'` | Display mode |
| `isPublic` | `boolean` | `false` | Hide toolbars and edit controls for public views |
| `compact` | `boolean` | `false` | Compact row spacing |

### Events

| Event | Payload | Description |
|---|---|---|
| `@count` | `number` | Total item count |
| `@edit` | `T` | Row item on edit action |
| `@download` | — | Download action triggered |
| `@customAction` | `(action, keys, item)` | Custom action handler |

## Composables

### `useTable(resource)`

Manages reactive table state and URL-driven navigation via Inertia:

| Export | Type | Description |
|---|---|---|
| `state` | `reactive` | Filter, column, sort, search, and pagination state |
| `addFilter(filter)` | `function` | Enable a filter |
| `removeFilter(column)` | `function` | Disable filter and reset value |
| `hasFilters` | `computed` | True if any filter is enabled |
| `hasBulkActions` | `computed` | True if resource has bulk actions |
| `hasSelectableRows` | `computed` | True if bulk actions OR selective exports |
| `hasExports` | `computed` | True if resource has exports |
| `prefetch` | `computed` | True if resource enables prefetch |
| `isNavigating` | `ref` | Navigation loading state |
| `isSortedByColumn(col)` | `function` | Returns `'asc'`, `'desc'`, or `false` |
| `setSort(sort)` | `function` | Update sort state |
| `sortByColumn(col)` | `function` | Smart toggle: asc → desc → none |
| `setPerPage(n)` | `function` | Update per-page (resets pagination) |
| `toggleColumn(col)` | `function` | Show/hide column |
| `visitPaginationUrl(url)` | `function` | Navigate to page URL |
| `visitTableUrl(url, opts)` | `function` | Visit URL with Inertia options |

State changes are **debounced** to prevent excessive navigation. Filter clause/value pairs are validated and mismatched types are reset.

### `useActions()`

Manages row selection and bulk action execution:

| Export | Type | Description |
|---|---|---|
| `selectedItems` | `ref` | Array of selected row IDs |
| `allItemIds` | `ref` | Array of all row IDs on current page |
| `allItemsAreSelected` | `computed` | True if all rows on page are selected |
| `isPerformingAction` | `ref` | Action loading state |
| `toggleItem(id)` | `function` | Select/deselect row (or `'*'` for all) |
| `performAction(action, keys)` | `function` | POST action with selected items |
| `performAsyncExport(export)` | `function` | POST async export |

## Column Types

| Type | Description | Alignment | Example |
|---|---|---|---|
| `text` | Plain text content | Left | Names, descriptions |
| `badge` | Coloured status indicators | Left | Active, Pending, Completed |
| `boolean` | Check/cross icons | Center | Yes/No values |
| `action` | Row action menu | Right | Edit, Delete, View |
| Custom | Slot-based rendering | Varies | Any custom content via `cell(attribute)` slot |

### Column Definition

Each column in `resource.columns`:

| Field | Type | Description |
|---|---|---|
| `header` | `string` | Column display name |
| `attribute` | `string` | Data key to render |
| `type` | `string` | Render type (text, badge, boolean, action) |
| `sortable` | `boolean` | Whether sorting is enabled |
| `toggleable` | `boolean` | Whether column can be hidden |
| `visibleByDefault` | `boolean` | Initial visibility state |
| `alignment` | `'left' \| 'center' \| 'right'` | Cell alignment |
| `meta` | `object \| null` | Optional metadata (e.g., `sticky`, `fundingStream` badges) |

## Cell Rendering

| State | Visual | Usage |
|---|---|---|
| Default | Standard text | Normal data |
| Highlighted | Bold or coloured text | Important values |
| Status Badge | Coloured pill badge | Status columns |
| Empty | Dash or "—" | No data available |

## Row States

| State | Description | Visual |
|---|---|---|
| Default | Standard row appearance | White background |
| Hover | Mouse over row | Light grey background highlight |
| Selected | Checkbox checked | Subtle highlight + teal left border |
| Expanded | Row expanded for detail | Detail content below row |

## Filtering

Six filter types are supported, each rendered as an interactive badge by `CommonTableFilter`:

| Type | Input Component | Clauses |
|---|---|---|
| `text` | `CommonInput` | contains, equals, starts_with, ends_with, is_set, etc. |
| `badge` | `CommonSelectMenu` (multi) | in, not_in |
| `set` | `CommonSelectMenu` (single) | is, not |
| `date` | `CommonDatePicker` / `CommonDateRangePicker` | between, not_between, before, after |
| `numeric` | `CommonNumberRange` | between, not_between, equals, gt, lt, etc. |
| `boolean` | None (clause only) | is, not |

### Filter Workflow

1. User clicks **Filter** button → `CommonTableFilterAction` shows available filters
2. Selecting a filter adds it to the active filters bar with `new: true` (auto-focus)
3. Each active filter is a `CommonTableFilter` chip with a dropdown editor
4. Changing clause auto-resets the value to prevent type mismatches
5. Removing a filter sets `enabled: false` and clears the value

## Pagination

**Component:** `CommonTablePagination`

Three pagination modes:

| Type | Controls | Use case |
|---|---|---|
| `full` | First, Prev, Next, Last + "Page X of Y" | Standard tables |
| `simple` | Prev, Next only | Lightweight tables |
| `cursor` | Prev, Next only | Large datasets |

Pagination props:

| Prop | Type | Default | Description |
|---|---|---|---|
| `meta` | `object` | Required | Pagination metadata (current_page, last_page, total, from, to, URLs) |
| `options` | `array` | Required | Rows-per-page options (e.g., `[15, 30, 50, 100]`) |
| `perPage` | `number` | Required | Currently selected per-page value |
| `type` | `string` | `'full'` | Pagination type |
| `showRowsPerPage` | `boolean` | `false` | Show rows-per-page selector |

**Smart behaviour:** If the current page exceeds the last page (e.g., after deleting the last item on a page), the table automatically navigates back to the last valid page.

## Row Actions (`CommonTableRowAction`)

Smart per-row action rendering with automatic layout:

**Component:** `resources/js/Components/Common/table/CommonTableRowAction.vue`
**Storybook:** `stories/Common/Table/CommonTableRowAction.stories.js`

| Prop | Type | Default | Description |
|---|---|---|---|
| `actions` | `array` | Required | Available actions for the row |
| `item` | `object` | Required | Row data object |
| `prefetch` | `boolean` | `false` | Enable Inertia prefetch for link actions |
| `isPublic` | `boolean` | `false` | Hide row actions in public mode |

**Smart layout behaviour:**
- **1-2 actions:** Rendered inline as buttons
- **3+ actions:** "View"/"Download" inline + overflow dropdown menu (kebab icon)
- Bulk-only actions (`asBulkAction`) are filtered out from row display
- Destructive actions (e.g., "Delete") automatically use danger variant
- Actions with `confirmationRequired` show a confirmation dialog

### Action Definition

Each action in `resource.actions`:

| Field | Type | Description |
|---|---|---|
| `label` | `string` | Display text (e.g., "View", "Delete") |
| `icon` | `string` | Monicon/Heroicon identifier |
| `style` | `string` | `'default'`, `'primary-button'`, `'danger-button'` |
| `isLink` | `boolean` | Navigate (GET) vs submit (POST) |
| `asRowAction` | `boolean` | Show in per-row actions |
| `asBulkAction` | `boolean` | Show in bulk actions dropdown |
| `confirmationRequired` | `boolean` | Show confirmation dialog |
| `authorized` | `boolean` | User has permission |
| `url` | `string \| null` | Action endpoint |
| `showLabel` | `boolean` | Display label alongside icon |
| `meta` | `object \| null` | Extra config (e.g., `{ toast: 'Deleted!', type: 'danger' }`) |

## Sorting (`CommonTableSort`)

Three-state column sort toggle:

| Click | State | Icon |
|---|---|---|
| 1st | Ascending | Arrow up (teal) |
| 2nd | Descending | Arrow down (teal) |
| 3rd | None | Arrows dimmed |

Emits sort attribute prefixed with `-` for descending (e.g., `@sort("-name")`). Supports custom column metadata (e.g., funding stream badges rendered in header).

## Column Toggle (`CommonTableToggleColumn`)

Dropdown menu with eye/eye-slash toggles for each `toggleable` column. Scrollable list (max height 384px). Icon-only on mobile, labelled on desktop. Columns hidden via `v-show` (preserves DOM).

## Bulk Actions (`CommonTableAction`)

Dropdown menu combining:
- **Export options** — Sync downloads and async exports (can limit to selected rows)
- **Bulk actions** — Actions flagged with `asBulkAction`, disabled until rows are selected

Selection clears automatically after an action completes.

## Loading & Empty States

### Loading

When a bulk action is in progress:
- Table wrapped in `<fieldset disabled>`
- Visual treatment: `opacity-75 blur-sm grayscale`
- Override with `<template #loading>`

### Empty State

- **Table view:** Full-width colspan with `CommonEmptyPlaceholder`, override with `<template #empty>`
- **Grid view:** Centered column with icon + text, override with `<template #empty-grid-view>`
- Compact mode uses `py-4`, default uses `min-h-[400px]`

## Sub-Components

| Component | File | Description |
|---|---|---|
| `CommonTableAction` | `table/CommonTableAction.vue` | Bulk actions + exports dropdown |
| `CommonTableFilter` | `table/CommonTableFilter.vue` | Active filter badge editor |
| `CommonTableFilterAction` | `table/CommonTableFilterAction.vue` | Add filter dropdown button |
| `CommonTablePagination` | `table/CommonTablePagination.vue` | Pagination controls |
| `CommonTablePaginationSelect` | `table/CommonTablePaginationSelect.vue` | Rows-per-page native select |
| `CommonTableSort` | `table/CommonTableSort.vue` | Column header sort control |
| `CommonTableToggleColumn` | `table/CommonTableToggleColumn.vue` | Column visibility picker |
| `CommonTableRowAction` | `table/CommonTableRowAction.vue` | Per-row action menu |

### Composable Files

| File | Description |
|---|---|
| `table/table.js` | `useTable()` — state management, navigation, debounce |
| `table/actions.js` | `useActions()` — selection, bulk actions, exports |
| `table/urlHelpers.js` | URL utilities wrapper |
| `table/agnosticUrlHelpers.js` | Core URL query string helpers |

## Slots

`CommonTable` provides extensive slot support:

| Slot | Scope | Description |
|---|---|---|
| `topbar` | — | Custom content above the table |
| `filters` | — | Custom filter controls |
| `actions` | — | Custom action buttons (in toolbar) |
| `loading` | — | Custom loading state |
| `empty` | — | Custom empty state (table view) |
| `empty-grid-view` | — | Custom empty state (grid view) |
| `thead` | — | Override full table header |
| `tbody` | — | Override full table body |
| `header(attribute)` | `{ column }` | Custom column header |
| `cell(attribute)` | `{ value, item, column }` | Custom cell renderer |
| `table` | — | Override entire table element |
| `grid` | — | Override entire grid view |
| `grid-item` | `{ item, itemIndex, table, actions, handle }` | Custom grid card |
| `grid-item-header` | `{ item }` | Custom grid card header |
| `grid-item-content` | `{ item }` | Custom grid card content |
| `footer` | — | Content below the table |

## Resource Object Shape

The `resource` prop follows the InertiaTable convention:

```typescript
interface Table<T extends BaseItem> {
  name: string;
  results: {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
    first_page_url: string;
    prev_page_url: string | null;
    next_page_url: string | null;
    last_page_url: string;
  };
  columns: Column[];
  filters: Filter[];
  actions: Action[];
  exports: Export[];
  state: State;
  search: string[];
  pagination: boolean;
  paginationType: 'full' | 'cursor' | 'simple';
  perPageOptions: number[];
  defaultPerPage: number;
  defaultSort: string;       // e.g., 'name' or '-created_at'
  debounceTime: number;      // Search/filter debounce (ms)
  prefetch: boolean;
  hasSearch: boolean;
  hasFilters: boolean;
  hasToggleableColumns: boolean;
  hasBulkActions: boolean;
  hasExports: boolean;
  hasActions: boolean;
}
```

## Responsive Behaviour

| Breakpoint | Table Behaviour |
|---|---|
| SM (640px) | Horizontal scroll or switch to grid view |
| MD (768px) | Horizontal scroll with fewer visible columns |
| LG (1024px) | Full table display |
| XL (1280px) | Full table with expanded columns |

Sticky column shadows appear automatically when the table scrolls horizontally. Action column sticks to the right with a gradient shadow. Filter and column toggle buttons show as icon-only on mobile, with labels on desktop.

## Usage

```vue
<CommonTable
    :resource="tableResource"
    search-placeholder="Search recipients..."
    type="table"
    @edit="handleEdit"
    @count="totalCount = $event"
>
    <template #cell(status)="{ value }">
        <CommonBadge :label="value" :variant="statusVariant(value)" />
    </template>
    <template #empty>
        <CommonCardEmptyState title="No results found" />
    </template>
</CommonTable>
```

### Grid View

```vue
<CommonTable
    :resource="tableResource"
    search-placeholder="Search..."
    type="both"
>
    <template #grid-item="{ item }">
        <div class="p-4">
            <h3>{{ item.name }}</h3>
            <p>{{ item.description }}</p>
        </div>
    </template>
</CommonTable>
```

### Custom Filters + Actions

```vue
<CommonTable :resource="tableResource" search-placeholder="Search...">
    <template #actions>
        <CommonButton @click="openCreateModal">
            + New Record
        </CommonButton>
    </template>
    <template #cell(amount)="{ value }">
        <span class="font-semibold">${{ value.toFixed(2) }}</span>
    </template>
</CommonTable>
```

## Do / Don't

| | Guidance |
|---|---|
| ✅ Do | Use `cell(attribute)` slots for custom rendering — badges, formatted currency, links |
| ❌ Don't | Override the entire `tbody` slot when you only need to customise one column |
| ✅ Do | Use `type="both"` to let users switch between table and grid views |
| ❌ Don't | Force grid view on desktop — tables are more scannable for data-heavy contexts |
| ✅ Do | Use filter types that match the data — `badge` for enums, `date` for dates, `numeric` for numbers |
| ❌ Don't | Use `text` filters for status columns — use `badge` or `set` filters with predefined options |
| ✅ Do | Provide a meaningful `searchPlaceholder` that hints at searchable fields |
| ❌ Don't | Use generic "Search..." — tell users what they can search (e.g. "Search by name or email...") |
| ✅ Do | Use `compact` mode for dense data tables (e.g. line items, invoice rows) |
| ❌ Don't | Use compact mode for primary entity tables — standard spacing aids scannability |
| ✅ Do | Use `confirmationRequired` on destructive row actions like delete |
| ❌ Don't | Allow destructive bulk actions without confirmation — always set `confirmationRequired: true` |
