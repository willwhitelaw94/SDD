---
title: "Layout"
description: "Page headers, definition lists, and structural layout components"
---

# Layout Components

Structural components for organising page content.

## Page Header (`CommonPageHeader`)

A standardised page-level header with title, subtitle, back navigation, and action buttons.

**Component:** `resources/js/Components/Common/CommonPageHeader.vue`

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `title` | `string` | — | **Required.** Page heading |
| `subtitle` | `string` | — | Description text below title |
| `kicker` | `string` | — | Small text above title (e.g. category, breadcrumb) |
| `backLabel` | `string` | — | Back button label (shows arrow + text) |
| `backHref` | `string` | — | Back button navigation URL |

### Slots

| Slot | Description |
|---|---|
| `back` | Override the back button entirely |
| `actions` | Action buttons in the right column |
| `badge` | Badge shown inline after the title |

### Layout

- Full-width with white background, bottom border, `px-6 py-4` padding
- Back button (if present) sits above the title row
- Title row: heading + badge left, action buttons right
- Responsive: stacks vertically on mobile (`flex-col`), side-by-side on desktop (`md:flex-row`)

### Usage

```vue
<CommonPageHeader
    title="John Smith"
    kicker="Recipient"
    subtitle="Package Level 4 — Active"
    back-label="Back to recipients"
    :back-href="route('recipients.index')"
>
    <template #badge>
        <CommonBadge label="Active" colour="green" />
    </template>
    <template #actions>
        <CommonButton label="Edit" variant="outline" leading-icon="heroicons:pencil" />
        <CommonButton label="Create Invoice" />
    </template>
</CommonPageHeader>
```

## Definition List (`CommonDefinitionList`)

A structured key-value list for displaying entity details. Renders a semantic `<dl>` element with optional dividers between items.

**Component:** `resources/js/Components/Common/CommonDefinitionList.vue`

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `items` | `DefinitionItem[] \| DefinitionItem[][]` | — | Items or grouped items |
| `divider` | `boolean` | `true` | Show horizontal dividers between items |

### Item Structure

```ts
type DefinitionItem = {
    title: string;           // Label (dt)
    value?: string | number; // Value (dd)
    size?: 'base' | 'lg' | 'xl';
    class?: string;          // Additional CSS classes on wrapper
};
```

### Grouping

Pass a nested array to create grouped sections within the same definition list.

### Usage

```vue
<CommonDefinitionList :items="[
    { title: 'Name', value: 'John Smith' },
    { title: 'Email', value: 'john@example.com' },
    { title: 'Phone', value: '0412 345 678' },
]" />

<!-- Without dividers -->
<CommonDefinitionList :items="details" :divider="false" />
```

## Definition Item (`CommonDefinitionItem`)

Individual key-value pair within a definition list. Supports icons, copy-to-clipboard, truncation with hover preview, and tooltip hints.

**Component:** `resources/js/Components/Common/CommonDefinitionItem.vue`

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `title` | `string` | — | Label text |
| `value` | `string \| number` | — | Display value |
| `icon` | `string` | — | Leading icon (Iconify format) |
| `money` | `boolean` | `false` | Prefix value with `$` |
| `size` | `'base' \| 'lg' \| 'xl'` | `'base'` | Text size scale |
| `inline` | `boolean` | `false` | Horizontal layout (label + value side by side) |
| `copy` | `boolean` | `false` | Show copy-to-clipboard button |
| `showTruncatedTextOnHover` | `boolean` | `false` | Tooltip with full text on hover for truncated values |
| `truncate` | `boolean` | `true` | Truncate overflowing text |
| `allPrimary` | `boolean` | `false` | Use primary text colour for label |

### Sizes

| Size | Label | Value |
|---|---|---|
| `base` | `text-xs font-semibold` | `text-sm` |
| `lg` | `text-sm font-semibold` | `text-base` |
| `xl` | `text-base font-semibold` | `text-lg` |

### Slots

| Slot | Description |
|---|---|
| `title` | Override the label content |
| `tip` | Tooltip content shown as info icon next to label |
| `default` | Override the value content |
| `icon` | Override the leading icon |

### Usage

```vue
<CommonDefinitionItem title="Email" value="john@example.com" copy />
<CommonDefinitionItem title="Balance" value="12500" money size="lg" />
<CommonDefinitionItem title="NDIS Number" value="123456789" icon="heroicons:identification" />
```

---

## When to Use Which Component

| Scenario | Component |
|---|---|
| Top of a detail/show page with title + actions | `CommonPageHeader` |
| Displaying structured key-value pairs (profile, details) | `CommonDefinitionList` |
| Single key-value pair with copy or tooltip | `CommonDefinitionItem` (standalone) |
| Tabular data with sorting/filtering | `CommonTable` (see [Tables](/design-system/components/tables)) |
| Page title inside a card | Use a card `title` prop, not `CommonPageHeader` |

## Do / Don't

| | Guidance |
|---|---|
| ✅ Do | Use `CommonPageHeader` for the top-level page heading with back navigation |
| ❌ Don't | Build custom page headers with raw HTML — use the standardised component |
| ✅ Do | Use `CommonDefinitionList` for 3+ key-value pairs in a vertical layout |
| ❌ Don't | Use a table (`CommonTable`) for simple key-value display — definition lists are semantically correct |
| ✅ Do | Use `copy` prop on `CommonDefinitionItem` for values users need to copy (IDs, emails, phone numbers) |
| ❌ Don't | Enable copy on every field — only add it where users actually need to copy values |
| ✅ Do | Use `money` prop for dollar values — it handles the `$` prefix consistently |
| ❌ Don't | Manually prefix `$` in the value string — use the built-in money formatting |
