---
title: "Dropdown Menu"
description: "Context menu and action dropdown for triggering actions"
---

# Dropdown Menu

Dropdown menus provide contextual actions triggered by a button click. Built on [Reka UI](https://reka-ui.com/) DropdownMenu primitives. Unlike `CommonSelectMenu` (which selects values for forms), `CommonDropdown` triggers actions.

**Component:** `resources/js/Components/Common/CommonDropdown.vue`

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `id` | `string` | — | **Required.** Unique identifier |
| `items` | `array` | — | **Required.** Action items array (flat or grouped) |
| `triggerVariant` | `string` | `'ghost'` | Button variant for the default trigger |
| `triggerColour` | `string` | `'gray'` | Button colour for the default trigger |
| `align` | `string` | `'start'` | Menu alignment: `'start'`, `'center'`, `'end'` |
| `sideOffset` | `number` | `2` | Pixel offset from trigger |

## Item Structure

Each item in the `items` array is an object with these properties:

| Property | Type | Description |
|---|---|---|
| `label` | `string` | Display text |
| `icon` | `string` | Leading icon (Iconify format) |
| `href` | `string` | Navigation link (renders as Inertia `Link`) |
| `click` | `function` | Click handler (receives `item.id`) |
| `colour` | `string` | Text/icon colour |
| `disabled` | `boolean` | Disabled state |
| `condition` | `boolean` | Conditionally show/hide item (default: `true`) |
| `type` | `string` | `'label'` for group headers, `'seperator'` for dividers |
| `id` | `any` | Identifier passed to click handler |

## Grouped Items

Pass a nested array (`items[0]` is an array) to create groups separated by dividers:

```js
const items = [
    [
        { label: 'Edit', icon: 'heroicons:pencil', click: handleEdit },
        { label: 'Duplicate', icon: 'heroicons:document-duplicate', click: handleDuplicate },
    ],
    [
        { label: 'Delete', icon: 'heroicons:trash', colour: 'red', click: handleDelete },
    ],
];
```

## Custom Trigger

Override the default kebab menu trigger via the `trigger` slot:

```vue
<CommonDropdown id="actions" :items="menuItems">
    <template #trigger>
        <CommonButton label="Actions" trailing-icon="heroicons:chevron-down" variant="outline" />
    </template>
</CommonDropdown>
```

## Default Trigger

Without a custom trigger, the dropdown renders a ghost kebab menu button (`heroicons:ellipsis-vertical`).

## Usage

```vue
<!-- Basic dropdown -->
<CommonDropdown
    id="row-actions"
    :items="[
        { label: 'View', icon: 'heroicons:eye', href: route('item.show', item.id) },
        { label: 'Edit', icon: 'heroicons:pencil', click: () => edit(item) },
        { label: 'Delete', icon: 'heroicons:trash', colour: 'red', click: () => confirmDelete(item) },
    ]"
/>

<!-- Right-aligned -->
<CommonDropdown id="header-menu" :items="menuItems" align="end" />
```

## When to Use

| Scenario | Component |
|---|---|
| Trigger actions on an entity (edit, delete, duplicate) | `CommonDropdown` |
| Select a value for a form field | `CommonSelectMenu` |
| Global search across entities | `CommonCommandPalette` |
| Table row actions (1-2 actions) | Inline `CommonButton` (not dropdown) |
| Table row actions (3+ actions) | `CommonTableRowAction` (auto-detects) |

## Do / Don't

| | Guidance |
|---|---|
| ✅ Do | Group destructive actions (delete) in a separate group at the bottom |
| ❌ Don't | Mix navigation links and destructive actions in the same group |
| ✅ Do | Use `condition: false` to hide items the user can't access |
| ❌ Don't | Show disabled items without explanation — either hide or add a tooltip |
| ✅ Do | Use `align="end"` when the trigger is on the right side of the page |
| ❌ Don't | Let the dropdown overflow off-screen — test positioning at screen edges |
