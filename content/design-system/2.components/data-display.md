---
title: "Data Display"
description: "Progress bars, spend bars, doughnut charts, and legend components for data visualization"
---

# Data Display

Components for visualizing data, progress, and metrics.

## Progress Bar (`CommonProgressBar`)

A minimal progress indicator built on [Reka UI](https://reka-ui.com/) Progress primitives. Animates smoothly between values.

**Component:** `resources/js/Components/Common/CommonProgressBar.vue`

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `modelValue` | `number` | — | Progress percentage (0–100) |
| `colour` | `string` | `'teal'` | Fill colour |
| `rounded` | `boolean` | — | Rounded corners |
| `height` | `'base' \| 'lg'` | — | Bar height |
| `variant` | `'solid' \| 'ghost'` | — | Fill intensity: solid (400), ghost (200), default (700) |

### Usage

```vue
<CommonProgressBar v-model:modelValue="75" colour="teal" />
<CommonProgressBar v-model:modelValue="progress" colour="blue" variant="ghost" />
```

## Progress (`CommonProgress`)

A full-featured progress indicator with percentage label, step support, and indeterminate animations.

**Component:** `resources/js/Components/Common/CommonProgress.vue`

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `value` | `number` | `null` | Current value. `null` = indeterminate |
| `max` | `number \| array` | `100` | Maximum value, or array for step-based progress |
| `label` | `string` | — | Text label shown after percentage |
| `indicator` | `boolean` | `false` | Show percentage above bar |
| `size` | `string` | `'md'` | Bar height: `2xs`, `xs`, `sm`, `md`, `lg`, `xl`, `2xl` |
| `color` | `string` | `'teal'` | Tailwind colour |
| `animation` | `string` | `'carousel'` | Indeterminate animation: `carousel`, `carousel-inverse`, `swing`, `elastic` |

### Usage

```vue
<!-- Determinate -->
<CommonProgress :value="45" :max="100" label="complete" indicator />

<!-- Indeterminate (loading) -->
<CommonProgress />

<!-- Step-based -->
<CommonProgress :value="2" :max="['Step 1', 'Step 2', 'Step 3', 'Step 4']" />
```

## Spend Bar (`CommonSpendBar`)

A budget/spend visualization bar with title, value labels, and multiple visual types. Used to show budget utilization percentages.

**Component:** `resources/js/Components/Common/CommonSpendBar.vue`

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `title` | `string` | — | Title label (left side, above bar) |
| `value` | `string` | — | Value label (right side, above bar) |
| `leftLabel` | `string` | — | Left label below bar |
| `rightLabel` | `string` | — | Right label below bar |
| `percent` | `number` | `0` | Fill percentage (clamped 0–100) |
| `size` | `'sm' \| 'base' \| 'lg'` | `'sm'` | Bar height |
| `type` | `'empty' \| 'default' \| 'full' \| 'rounded'` | `'default'` | Bar style |
| `colour` | `string` | `'teal'` | Fill colour |

### Sizes

| Size | Bar Height | Title Text | Label Text |
|---|---|---|---|
| `sm` | `h-2` | `text-base` | `text-sm` |
| `base` | `h-3.5` | `text-xl` | `text-lg` |
| `lg` | `h-5` | `text-xl` | `text-lg` |

### Types

| Type | Description |
|---|---|
| `empty` | No fill — empty grey bar |
| `default` | Filled portion with border-right separator against grey remainder |
| `full` | Filled portion only (no grey remainder beyond fill) |
| `rounded` | Filled portion with rounded inner corners |

### Usage

```vue
<CommonSpendBar
    title="Budget Utilised"
    value="$12,500"
    :percent="62"
    left-label="$0"
    right-label="$20,000"
/>

<CommonSpendBar :percent="100" type="full" colour="green" size="lg" />
<CommonSpendBar :percent="0" type="empty" />
```

## Doughnut Chart (`CommonDoughnutChart`)

SVG-based doughnut/donut chart with interactive segments, hover tooltips, and integrated legend.

**Component:** `resources/js/Components/Common/CommonDoughnutChart.vue`

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `chart` | `Chart` | — | Chart configuration object |
| `single` | `boolean` | — | Single chart layout mode |

### Chart Object

```ts
type Chart = {
    id: string | number;
    segments: Segment[];
    colour: string;              // Theme colour for card header
    centralLabel?: string;       // Centre text (top line)
    centralSubLabel?: string;    // Centre text (bottom line, bold)
    legend?: boolean;
    legendRow?: boolean;         // Row layout for legend items
    radius?: number;             // Outer radius (default: 100)
    arcWidth?: number;           // Arc thickness (default: 32)
    flex?: 'row' | 'col';       // Chart + legend layout direction
    showDates?: string;
};

type Segment = {
    id: string | number;
    value: number;
    formatted: string;           // Display value (e.g. "$1,200")
    colour: string;              // Tailwind colour class for segment
    name: string;                // Legend label
};
```

### Features

- Hover animation expands segment by 10%
- Tooltip follows cursor showing segment name and value
- Integrated `CommonLegend` items with hover cross-highlighting
- Handles zero-total edge case (renders full circle)

### Usage

```vue
<CommonDoughnutChart
    :chart="{
        id: 'budget',
        segments: [
            { id: 1, value: 5000, formatted: '$5,000', colour: 'teal-700', name: 'Core' },
            { id: 2, value: 3000, formatted: '$3,000', colour: 'teal-400', name: 'Supplements' },
            { id: 3, value: 2000, formatted: '$2,000', colour: 'teal-200', name: 'Unspent' },
        ],
        colour: 'teal',
        centralLabel: 'Total',
        centralSubLabel: '$10,000',
        flex: 'row',
    }"
    :single="true"
/>
```

## Legend (`CommonLegend`)

Colour-coded legend item used alongside charts. Shows a colour swatch, label, and optional value.

**Component:** `resources/js/Components/Common/CommonLegend.vue`

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `index` | `number` | — | Item index |
| `datum` | `object` | — | `{ id, value, formatted, colour, name }` |
| `legendRow` | `boolean` | `false` | Row layout variant |
| `variant` | `'default' \| 'compact'` | `'default'` | Layout style |

### Variants

| Variant | Description |
|---|---|
| `default` | Label left, value right (two-column) |
| `compact` | Label + value stacked in single column |

---

## Pagination (`CommonPagination`)

Standalone pagination controls for paginated lists and grids outside of `CommonTable`. For table-integrated pagination, use `CommonTablePagination` instead.

**Component:** `resources/js/Components/Common/CommonPagination.vue`
**Storybook:** `stories/Common/CommonPagination.stories.js`

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `meta` | `PaginationMeta` | Required | `{ current_page, per_page, total }` |
| `selectedCount` | `number \| null` | `null` | Number of selected items (shows "X selected of Y" when > 0) |
| `rowsPerPageOptions` | `number[]` | `[10, 15, 25, 50]` | Options for the rows-per-page selector |
| `showRowsPerPage` | `boolean` | `false` | Show the rows-per-page dropdown |

### Events

| Event | Payload | Description |
|---|---|---|
| `updatePage` | `number` | User navigated to a different page |
| `updatePerPage` | `number` | User changed the rows-per-page value |

### Layout

```
┌─────────────────────────────────────────────────────────┐
│ 42 records          Rows per page [15 ▼]  Page 1 of 3  │
│                                         |< < > >|      │
└─────────────────────────────────────────────────────────┘
```

- **Left:** Record count or selection summary
- **Right:** Optional rows-per-page selector + page indicator + navigation buttons (first, prev, next, last)

### Navigation Buttons

Four 36px (`size-9`) bordered buttons with chevron icons:

| Button | Icon | Disabled When |
|---|---|---|
| First | `heroicons-solid:chevron-double-left` | On first page |
| Previous | `heroicons-solid:chevron-left` | On first page |
| Next | `heroicons-solid:chevron-right` | On last page |
| Last | `heroicons-solid:chevron-double-right` | On last page |

### Usage

```vue
<CommonPagination
    :meta="{ current_page: 1, per_page: 15, total: 42 }"
    :show-rows-per-page="true"
    @update-page="handlePageChange"
    @update-per-page="handlePerPageChange"
/>

<!-- With selection count -->
<CommonPagination
    :meta="paginationMeta"
    :selected-count="selectedItems.length"
    @update-page="goToPage"
/>
```

### When to Use Which

| Scenario | Component |
|---|---|
| Inside `CommonTable` | `CommonTablePagination` (built-in, automatic) |
| Standalone paginated list or grid | `CommonPagination` |
| Custom paginated content | `CommonPagination` |

---

## When to Use Which Component

| Data to Show | Component | Why |
|---|---|---|
| Simple % complete | `CommonProgressBar` | Minimal, no labels |
| % with label and steps | `CommonProgress` | Full-featured, step support |
| Loading state (unknown duration) | `CommonProgress` with `value: null` | Indeterminate animation |
| Budget utilisation with labels | `CommonSpendBar` | Purpose-built for spend/budget |
| Category breakdown (proportions) | `CommonDoughnutChart` | Visual segment comparison |
| Legend for chart segments | `CommonLegend` | Colour-coded labels |
| Page-level list pagination | `CommonPagination` | Standalone controls |
| Table pagination | `CommonTablePagination` | Built into `CommonTable` |

## Do / Don't

| | Guidance |
|---|---|
| ✅ Do | Use `CommonSpendBar` for budget visualisations — it handles labels, types, and edge cases |
| ❌ Don't | Build custom progress bars with raw divs — use the existing components |
| ✅ Do | Use `CommonProgress` with `value: null` for indeterminate loading states |
| ❌ Don't | Use a spinner when the operation has measurable progress — show a progress bar instead |
| ✅ Do | Always provide `formatted` values on doughnut chart segments (e.g. "$1,200") |
| ❌ Don't | Display raw numbers without formatting in chart tooltips |
