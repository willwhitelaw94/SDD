---
title: "Tabs"
description: "Tab navigation component — sizes, states, and usage patterns"
---

# Tabs

Tabs are defined in the [Figma Tabs page](https://www.figma.com/design/ojTCI9yefnl9ORYEVrv2WJ/Trilogy-Care-Design-System?node-id=170-2306) and used for switching between content sections within a page.

## Sizes

Four tab sizes are available:

| Size | Figma Name | Height | Usage |
|---|---|---|---|
| XS | XS | 26px | Compact sub-navigation, nested tabs |
| S | S | 28px | Secondary navigation |
| M | M | 35px | Default tab navigation |
| L | L | 37px | Primary page-level navigation |

## States

Each tab supports four interaction states:

| State | Description | Visual |
|---|---|---|
| **Default** | Unselected, at rest | Grey text, no underline, leading icon (outline) |
| **Hover** | Unselected, mouse over | Grey text with subtle highlight, leading icon (outline) |
| **Selected** | Active tab | Teal text, teal bottom border, leading icon (solid/filled) |
| **Selected Hover** | Active tab, mouse over | Teal text with subtle highlight, teal bottom border |

### Selected Indicator

The active tab is distinguished by:
- **Text colour:** Teal (`text-teal-700`)
- **Bottom border:** 2px solid teal underline
- **Icon style:** Filled/solid variant of the icon

Unselected tabs use:
- **Text colour:** Grey (`text-gray-600`)
- **Icon style:** Outline variant

## Tab Anatomy

Each tab item consists of:
1. **Leading icon** (optional) — Heroicons outline (unselected) or solid (selected)
2. **Label text** — Tab name
3. **Badge** (optional) — Count or status indicator

## Tab Bar Variants

The Figma design shows three navigation tab patterns:

### Standard Tabs (with icons)
Tabs with leading icons, used for primary section navigation. Full bottom border across the tab bar.

### Text-Only Tabs
Tabs without icons, using an underline indicator for the selected state. Used for simpler content switching.

### Tabs with Badges
Tabs with trailing count badges, used when showing item counts per section (e.g., "Bills 12", "Tasks 5").

## Usage Guidelines

- Use tabs for switching between related content views within the same page
- The first tab should be the default/most common view
- Keep tab labels short (1-2 words)
- Avoid more than 5-6 tabs in a single tab bar
- On mobile, tabs may need horizontal scrolling for overflow
- Tab content should load without a full page refresh (client-side switching)

## Component (`CommonTabs`)

The tab component is built on [Reka UI](https://reka-ui.com/) tab primitives with horizontal scroll overflow and auto-scroll to active tab.

**Component:** `resources/js/Components/Common/CommonTabs.vue`

### Modes

| Mode | Behaviour | Navigation | Use Case |
|---|---|---|---|
| `controlled` | Client-side tab switching via `v-model` | No URL change | In-page content switching |
| `uncontrolled` | URL-based navigation via Inertia `Link` | Full page navigation | Section-level navigation (e.g. secondary tabs) |

In **uncontrolled** mode, the active tab is determined by URL matching — exact match or path prefix match (e.g. `/budget` matches `/budget/plans`).

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `items` | `array` | Required | Tab items: `{ id, title, href?, count?, content? }` |
| `modelValue` | `string` | — | Active tab ID (controlled mode, via `v-model`) |
| `defaultValue` | `string` | `null` | Initial active tab |
| `ariaLabel` | `string` | `null` | Accessible label for the tab list |
| `mode` | `'controlled' \| 'uncontrolled'` | `'controlled'` | Navigation behaviour |
| `prefetch` | `boolean` | `false` | Enable Inertia prefetch for uncontrolled tabs |

### Item Shape

```typescript
interface TabItem {
    id: string;        // Unique identifier and slot name
    title: string;     // Tab label text
    href?: string;     // URL for uncontrolled mode
    count?: number;    // Optional badge count
    content?: string;  // Fallback content for controlled mode
}
```

### Overflow Behaviour

When tabs exceed the container width:
- Horizontal scrolling is enabled with thin scrollbar styling
- Gradient edge shadows appear on the left/right when content is clipped
- Selecting a tab auto-scrolls the tab bar to keep the active tab visible

### Slots

In controlled mode, each tab's content is rendered via a named slot matching the item's `id`:

```vue
<CommonTabs v-model="activeTab" :items="tabs">
    <template #overview>
        <OverviewPanel />
    </template>
    <template #details>
        <DetailsPanel />
    </template>
</CommonTabs>
```

### Usage

```vue
<!-- Controlled mode — in-page content switching -->
<CommonTabs
    v-model="activeTab"
    :items="[
        { id: 'overview', title: 'Overview' },
        { id: 'details', title: 'Details' },
        { id: 'history', title: 'History', count: 5 },
    ]"
>
    <template #overview>...</template>
    <template #details>...</template>
    <template #history>...</template>
</CommonTabs>

<!-- Uncontrolled mode — URL-based navigation -->
<CommonTabs
    mode="uncontrolled"
    :prefetch="true"
    :items="[
        { id: 'plan', title: 'Service Plan', href: '/services/plan' },
        { id: 'find', title: 'Find Services', href: '/services/find' },
        { id: 'suppliers', title: 'Your Suppliers', href: '/services/suppliers' },
    ]"
/>
```
