---
title: "Feedback & States"
description: "Alert banners, empty placeholders, and system feedback components"
---

# Feedback & States

Components for communicating status, feedback, and empty states to the user.

## Alert (`CommonAlert`)

Contextual alert banners for inline messages — success confirmations, warnings, errors, and informational notices.

**Component:** `resources/js/Components/Common/CommonAlert.vue`

### Types

| Type | Icon | Colours | Use Case |
|---|---|---|---|
| `success` | `heroicons:information-circle` | Green background/border/text | Confirmation, positive outcomes |
| `info` | `heroicons:information-circle` | Blue background/border/text | Informational notices, tips |
| `warning` | `heroicons:information-circle` | Yellow background/border/text | Cautionary notices, attention required |
| `error` | `local:fa-triangle-exclamation` | Red background/border/text | Errors, failures, validation issues |
| `default` | `heroicons:information-circle` | Grey background/border/text | Neutral, generic messages |

The `error` type automatically switches to a triangle exclamation icon.

### Variants

| Variant | Background | Use Case |
|---|---|---|
| `default` | White (`bg-white`) | Standard alerts on page backgrounds |
| `soft` | Grey (`bg-gray-50`) | Subtle alerts within cards or sections |

### Sizes

| Size | Padding | Border Radius | Title Text | Description Text |
|---|---|---|---|---|
| `xs` | `px-2 py-1` | `rounded-md` | `text-xs font-semibold` | `text-xs font-medium` |
| `sm` | `p-2` | `rounded-md` | `text-sm font-semibold` | `text-xs font-medium` |
| `base` | `px-4 py-3` | `rounded-lg` | `text-sm font-semibold` | `text-xs font-medium` |
| `lg` | `px-4 py-3` | `rounded-lg` | `text-base font-semibold` | `text-sm font-medium` |

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `title` | `string` | — | Alert heading text |
| `description` | `string` | — | Supporting detail text below the title |
| `type` | `string` | `'default'` | Semantic type: `success`, `info`, `warning`, `error`, `default` |
| `variant` | `string` | `'default'` | Visual variant: `default` (white) or `soft` (grey) |
| `size` | `string` | `'base'` | Size: `xs`, `sm`, `base`, `lg` |
| `icon` | `string` | `'heroicons:information-circle'` | Custom icon (Iconify format) |
| `close` | `boolean` | `false` | Show close (X) button |
| `actions` | `AlertAction[]` | `[]` | Action buttons displayed in the alert |

### Slots

| Slot | Description |
|---|---|
| `default` | Title content (overrides `title` prop) |
| `description` | Description content (overrides `description` prop) |
| `actions` | Custom action buttons (overrides `actions` prop) |

### Events

| Event | Description |
|---|---|
| `close` | Emitted when the close button is clicked |

### Usage

```vue
<!-- Simple info alert -->
<CommonAlert
    type="info"
    title="Your profile has been updated."
/>

<!-- Error alert with description and close -->
<CommonAlert
    type="error"
    title="Payment failed"
    description="Your card was declined. Please try a different payment method."
    :close="true"
    @close="dismissError"
/>

<!-- Warning alert with actions -->
<CommonAlert
    type="warning"
    title="Your session is about to expire"
    :actions="[
        { label: 'Extend session', click: () => extendSession() },
        { label: 'Log out', variant: 'ghost', click: () => logout() },
    ]"
/>

<!-- Success alert with custom slot content -->
<CommonAlert type="success">
    <strong>Invoice #1234</strong> has been sent to the supplier.
</CommonAlert>
```

---

## Empty Placeholder (`CommonEmptyPlaceholder`)

Centered placeholder for empty states in tables, lists, and content areas. For empty states inside cards, use `CommonCardEmptyState` instead.

**Component:** `resources/js/Components/Common/CommonEmptyPlaceholder.vue`

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `icon` | `string` | `'fa6-solid:folder-open'` | Placeholder icon (Iconify format) |
| `iconClass` | `string` | `'h-12 w-12 text-gray-500'` | Icon size and colour classes |
| `text` | `string` | `'No data available'` | Primary placeholder text |
| `description` | `string` | `''` | Secondary descriptive text |
| `actions` | `Action[]` | `[]` | Call-to-action buttons |

### Action Interface

```typescript
interface Action {
    label: string;
    click: () => void;
    leadingIcon?: string;
    trailingIcon?: string;
    variant?: 'solid' | 'outline' | 'ghost' | 'link' | 'soft';
    size?: 'base' | 'lg' | 'sm';
    colour?: string;
}
```

### Slots

| Slot | Description |
|---|---|
| `default` | Overrides the text + description area |
| `actions` | Custom action buttons |

### Usage

```vue
<!-- Basic empty state -->
<CommonEmptyPlaceholder text="No invoices found" />

<!-- With description and action -->
<CommonEmptyPlaceholder
    icon="heroicons:document-text"
    text="No documents yet"
    description="Upload a document to get started."
    :actions="[{ label: 'Upload Document', click: openUpload }]"
/>

<!-- With custom icon class -->
<CommonEmptyPlaceholder
    icon="heroicons:users"
    icon-class="h-16 w-16 text-teal-300"
    text="No team members"
    description="Invite team members to collaborate."
    :actions="[
        { label: 'Invite Member', leadingIcon: 'heroicons:plus', click: openInvite },
    ]"
/>
```

### When to Use Which

| Scenario | Component |
|---|---|
| Empty card body | `CommonCardEmptyState` |
| Empty table (inside `CommonTable`) | `CommonEmptyPlaceholder` via `#empty` slot |
| Empty list or generic content area | `CommonEmptyPlaceholder` |
| Empty grid view | `CommonEmptyPlaceholder` via `#empty-grid-view` slot |
```
