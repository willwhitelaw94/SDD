---
title: "Interactive"
description: "Command palette, carousel, and PIN input for interactive user flows"
---

# Interactive Components

Specialised interactive components for search, content browsing, and verification flows.

## Command Palette (`CommonCommandPalette`)

A global search overlay with grouped results, recently visited pages, and highlight matching. Built on [Reka UI](https://reka-ui.com/) Combobox primitives.

**Component:** `resources/js/Components/Common/CommonCommandPalette.vue`

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `searchTerm` | `string` (v-model) | `''` | Search query |
| `name` | `string` | — | Form input name |
| `items` | `SearchItem[][]` | `[]` | Grouped search results |
| `leadingIcon` | `string` | `'heroicons:magnifying-glass'` | Search input icon |
| `loading` | `boolean` | `false` | Show loading spinner |
| `placeholder` | `string` | `'Start typing to begin your search..'` | Input placeholder |
| `recentlyVisitedPages` | `RecentlyVisitedPage[]` | `[]` | Recently visited pages shown when empty |
| `closeOnSelect` | `boolean` | `false` | Close palette on item selection |

### Search Item Structure

```ts
type SearchItem = {
    group?: string;       // Group header label
    href: string;         // Navigation URL
    icon: string;         // Iconify icon
    header: string;       // Primary text
    subheader?: string;   // Secondary text
    enum_badges?: any[];  // Optional badges
    meta?: {
        highlights?: { snippet: string }[];  // HTML highlighted matches
    };
};
```

### Slots

| Slot | Description |
|---|---|
| `leading` | Custom search icon |
| `filters` | Filter controls below search input |
| `empty` | Custom empty state content |

### Features

- Auto-focuses search input on mount
- Grouped results with labelled sections
- Recently visited pages shown when search is empty
- Search highlight marks with teal background
- Animated result transitions
- Scrollable results area (30rem max height)

### Events

| Event | Description |
|---|---|
| `close` | Emitted when palette should close |

### Usage

```vue
<CommonCommandPalette
    v-model:searchTerm="query"
    :items="searchResults"
    :loading="isSearching"
    :recently-visited-pages="recentPages"
    @close="showPalette = false"
/>
```

## Carousel (`CommonCarousel`)

A horizontal scrolling carousel powered by [Embla Carousel](https://www.embla-carousel.com/). Supports any slotted content with automatic pagination and navigation controls.

**Component:** `resources/js/Components/Common/CommonCarousel.vue`

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `data` | `any[]` | — | Array of items to render as slides |
| `snapFull` | `boolean` | `false` | Show first/last navigation buttons |

### Slots

| Slot | Props | Description |
|---|---|---|
| `slide` | `{ datum }` | Content for each slide |

### Features

- Auto-detects when scrolling is needed (content wider than viewport)
- Dot pagination indicators with click-to-navigate
- Previous/next arrow navigation using `CommonButton`
- Optional first/last jump buttons (`snapFull`)
- Responsive — hides controls when all content is visible

### Events

| Event | Description |
|---|---|
| `narrow` | Emitted when content overflows and scrolling is needed |

### Usage

```vue
<CommonCarousel :data="cards">
    <template #slide="{ datum }">
        <CommonCard :title="datum.title">
            {{ datum.content }}
        </CommonCard>
    </template>
</CommonCarousel>
```

## PIN Input (`CommonPinInput`)

A numeric PIN/OTP code input with individual digit cells. Built on [Reka UI](https://reka-ui.com/) PinInput primitives. Integrates with `useFormField` for validation.

**Component:** `resources/js/Components/Common/CommonPinInput.vue`

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `modelValue` | `string` (v-model) | — | PIN value as string (e.g. `'123456'`) |
| `numberOfDigits` | `number` | `6` | Number of digit cells |
| `loading` | `boolean` | `false` | Disabled + reduced opacity |

### Features

- Individual 40x40px digit cells with circle placeholder (`○`)
- Automatic focus progression between cells
- Error state via `useFormField` (red ring + pink background)
- Loading state reduces opacity and disables input
- Numeric-only input

### Usage

```vue
<CommonFormField label="Verification Code" name="code">
    <CommonPinInput v-model="form.code" :number-of-digits="6" />
</CommonFormField>
```

---

## Filter Badge (`CommonFilterBadge`)

A compact filter chip that wraps `CommonSelectMenu` with a minimal trigger — used for toolbar filters, quick selectors, and compact filter bars outside of tables.

**Component:** `resources/js/Components/Common/CommonFilterBadge.vue`

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `items` | `SelectOptionData[]` | Required | Options array |
| `modelValue` | `string \| number \| null` | `null` | Selected value (via `v-model`) |
| `searchTerm` | `string` | — | Search input value (via `v-model:searchTerm`) |
| `icon` | `string` | `'heroicons-outline:document-text'` | Leading icon |
| `size` | `'base' \| 'lg'` | `'base'` | Trigger size |
| `placeholder` | `string` | `'Select...'` | Placeholder when no value selected |
| `searchPlaceholder` | `string` | `'Search...'` | Search input placeholder |
| `searchable` | `boolean` | `true` | Enable search within the dropdown |
| `clearable` | `boolean` | `true` | Show clear (X) button when a value is selected |
| `disabled` | `boolean` | `false` | Disable interaction |
| `loading` | `boolean` | `false` | Show loading state |
| `renderOnly` | `boolean` | `false` | Render trigger only, no dropdown functionality |
| `dropdownWidth` | `number \| null` | `null` | Custom dropdown width in pixels |
| `valueKey` | `string` | `'value'` | Key for option values |
| `labelKey` | `string` | `'label'` | Key for option labels |

### Sizes

| Size | Padding | Text | Use Case |
|---|---|---|---|
| `base` | `px-2 py-1` | `text-xs` | Standard toolbar filters |
| `lg` | `px-3 py-1.5` | `text-xs` | Recipient portal filters |

### Visual Style

- Background: `bg-gray-50` with `ring-1 ring-gray-200`
- Border radius: `rounded-lg`
- Hover: `bg-gray-100` with `shadow-sm`
- Disabled: `opacity-60`, `cursor-not-allowed`
- Clear button: small X icon that resets the value to `null`

### Slots

| Slot | Scope | Description |
|---|---|---|
| `trigger` | `{ label, icon, selectedOption, clear, showClear, disabled }` | Custom trigger content |
| `item-label` | Item props | Custom item label rendering |

### Usage

```vue
<!-- Basic filter badge -->
<CommonFilterBadge
    v-model="selectedStatus"
    :items="statusOptions"
    icon="heroicons:funnel"
    placeholder="Status"
/>

<!-- With search and custom icon -->
<CommonFilterBadge
    v-model="selectedSupplier"
    :items="suppliers"
    icon="heroicons:building-office"
    placeholder="Supplier"
    search-placeholder="Search suppliers..."
/>

<!-- Filter toolbar -->
<div class="flex items-center gap-2">
    <CommonFilterBadge v-model="filters.status" :items="statuses" icon="heroicons:funnel" placeholder="Status" />
    <CommonFilterBadge v-model="filters.type" :items="types" icon="heroicons:tag" placeholder="Type" />
    <CommonFilterBadge v-model="filters.date" :items="dateRanges" icon="heroicons:calendar" placeholder="Date" />
</div>
```

---

## When to Use Which Component

| Scenario | Component |
|---|---|
| Global search across all entities | `CommonCommandPalette` |
| Browsing a horizontal set of cards or content | `CommonCarousel` |
| OTP / verification code input | `CommonPinInput` |
| Compact toolbar filter (single value) | `CommonFilterBadge` |
| Full form field with select dropdown | `CommonSelectMenu` (see [Forms](/design-system/components/forms)) |
| Table column filters | `CommonTableFilter` (see [Tables](/design-system/components/tables)) |
| Context menu / action list | `CommonDropdown` (see [Dropdown Menu](/design-system/components/dropdown)) |

## Do / Don't

| | Guidance |
|---|---|
| ✅ Do | Use `CommonCommandPalette` for global search — it handles grouping, highlights, and recently visited |
| ❌ Don't | Build custom search overlays — the command palette already provides the standard UX |
| ✅ Do | Use `CommonCarousel` only when horizontal browsing adds value (e.g. related items) |
| ❌ Don't | Put critical content in a carousel — users may not scroll to see it |
| ✅ Do | Wrap `CommonPinInput` in `CommonFormField` for label and error display |
| ❌ Don't | Use `CommonPinInput` for non-numeric codes — it only supports digits |
| ✅ Do | Use `CommonFilterBadge` for quick filters in toolbars and headers |
| ❌ Don't | Use `CommonFilterBadge` inside forms — use `CommonSelectMenu` with `CommonFormField` instead |
