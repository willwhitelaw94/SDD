---
title: "Modals & Dialogs"
description: "Modal overlays, confirmation dialogs, and the composable dialog system"
icon: "heroicons:chat-bubble-bottom-center-text"
---

# Modals & Dialogs

Modals and dialogs are defined in the [Figma Modal page](https://www.figma.com/design/ojTCI9yefnl9ORYEVrv2WJ/Trilogy-Care-Design-System?node-id=1581-15575) and implemented as two components: `CommonModal` for general-purpose overlays and `CommonConfirmDialog` for confirmation prompts.

## Components Overview

| Component | Purpose | Trigger |
|---|---|---|
| `CommonModal` | General-purpose overlay panel for forms, selections, and content | `v-model` binding |
| `CommonConfirmDialog` | Centred confirmation prompt with icon, title, description, and actions | `openConfirmDialog()` composable |

---

## Modal (`CommonModal`)

A slide-in panel (right-docked on desktop, bottom-sheet on mobile) built on Headless UI's `Dialog`.

**Component:** `resources/js/Components/Common/CommonModal.vue`
**Storybook:** `stories/Common/CommonModal.stories.js`

### Figma Variants

The Figma Modal page defines several modal patterns:

| Pattern | Width | Description |
|---|---|---|
| Standard form modal | 476px | Heading + subheading + form fields + button group |
| Slot modal | 476px | Heading + subheading + custom slot area + button group |
| Compact modal | 475px | Title only (no subheading) + single field + button group |
| Selection modal | 606px | Title + search field + scrollable list + button group |
| Full-page modal (mobile) | 375px | Bottom-sheet style with scrollable content |
| Contextual modal | 606px | Title + illustration + rich content + checkbox + button group |

### Anatomy

All modals share a consistent structure from the Figma spec:

1. **Header** — Title (semibold, `text-xl`) + optional subtitle (`text-sm text-gray-500`) + close button (ghost icon button, `heroicons:x-mark`)
2. **Body** — Scrollable content area with `px-6 pb-4 pt-2` padding
3. **Footer** — Action buttons aligned right (button group: secondary left, primary right)

### Positioning

| Side | Mobile | Desktop | Use Case |
|---|---|---|---|
| `right` (default) | Bottom-sheet, slides up | Right-docked, slides in from right | Forms, detail panels, editing |
| `center` | Bottom-sheet, slides up | Centred with `max-height: 80vh` | Confirmations, selections, compact actions |

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `modelValue` | `boolean` | — | **Required.** Controls open/close state via `v-model` |
| `title` | `string` | — | Header title text |
| `description` | `string` | `null` | Subtitle below the title |
| `side` | `'right' \| 'center'` | `'right'` | Positioning mode |
| `overlay` | `boolean` | `true` | Show background overlay (`bg-black/25`) |
| `closeOnOutsideClick` | `boolean` | `true` | Close when clicking outside the panel |
| `border` | `boolean` | `true` | Show bottom border on the header |
| `maxWidth` | `string \| null` | `null` | CSS max-width value (e.g., `'600px'`) |
| `maxHeight` | `number \| null` | `null` | Max height in pixels (non-scrollable modals only) |
| `portal` | `boolean` | `false` | Teleport modal to `<body>` |
| `initialFocus` | `HTMLElement \| null` | `null` | Element to focus on open |

### Slots

| Slot | Description |
|---|---|
| `content` | Replaces the entire inner structure (title + body + footer) |
| `title` | Custom title area (replaces default title rendering) |
| `header` | Content between title and body (with optional border) |
| `body` | Main scrollable content area |
| `footer` | Sticky footer area with top border |
| `description` | Subtitle text below the title |

### Events

| Event | Payload | Description |
|---|---|---|
| `update:modelValue` | `boolean` | Open state changed |
| `after-leave` | — | Modal has fully closed (transition complete) |
| `before-leave` | — | Modal is about to close |
| `before-enter` | — | Modal is about to open |
| `openAutoFocus` | — | Modal received auto focus |

### Transitions

| Element | Enter | Leave |
|---|---|---|
| Overlay | 200ms ease-out, fade in | 200ms ease-in, fade out |
| Panel (center) | 200ms ease-in-out, scale up + slide from bottom | 200ms ease-in, scale down + slide to bottom |
| Panel (right) | 200ms ease-in-out, slide from bottom (mobile) / right (desktop) | 200ms ease-in, reverse |

### Usage

```vue
<!-- Standard right-docked modal -->
<CommonModal v-model="isOpen" title="Edit Profile">
    <template #body>
        <form @submit.prevent="save">
            <!-- form fields -->
        </form>
    </template>
    <template #footer>
        <div class="flex justify-end gap-2 px-6">
            <CommonButton label="Cancel" variant="outline" @click="isOpen = false" />
            <CommonButton label="Save" @click="save" />
        </div>
    </template>
</CommonModal>

<!-- Centred modal for selection -->
<CommonModal v-model="isSelectOpen" title="Select a Care Recipient" side="center" max-width="606px">
    <template #body>
        <!-- search + list content -->
    </template>
</CommonModal>
```

---

## Confirmation Dialog (`CommonConfirmDialog`)

A centred, icon-driven confirmation prompt. Not used directly — instead triggered via the `openConfirmDialog()` composable which renders it globally through `AppLayout`.

**Component:** `resources/js/Components/Common/CommonConfirmDialog.vue`
**Storybook:** `stories/Common/CommonConfirmDialog.stories.js`
**Composable:** `resources/js/composables/dialog.js`

### Type Variants

Four semantic types (plus custom colours) control the icon and colour scheme:

| Type | Icon | Icon Colour | Background | Use Case |
|---|---|---|---|---|
| `info` | `heroicons:information-circle` | `text-blue-800` | `bg-blue-200` | General confirmations, informational prompts |
| `warning` | `heroicons:exclamation-circle` | `text-yellow-800` | `bg-yellow-200` | Cautionary actions requiring attention |
| `success` | `heroicons:check-circle` | `text-green-800` | `bg-green-200` | Positive confirmations, completion |
| `danger` | `heroicons:trash` | `text-red-800` | `bg-red-200` | Destructive actions — delete, remove |
| Custom | Pass via `icon` prop | `text-{colour}-800` | `bg-{colour}-200` | Any Tailwind colour string (e.g., `purple`, `orange`) |

### Anatomy

1. **Close button** — Top-right ghost icon button (`heroicons:x-mark`) emitting `close`
2. **Icon** — Centred, 48px circle with coloured background + icon
3. **Title** — Centred, `text-xl font-semibold`
4. **Description** — Centred, `text-gray-700`, supports Markdown via `CommonMarkdown`
5. **Actions** — Two buttons aligned right: outline cancel + solid confirm

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `type` | `string` | — | Semantic type: `info`, `warning`, `success`, `danger`, or any Tailwind colour |
| `title` | `string` | — | Dialog heading |
| `description` | `string` | — | Body text (supports Markdown) |
| `icon` | `string` | — | Custom icon override (Iconify format, e.g., `heroicons-outline:user-plus`) |
| `confirm` | `string` | — | Confirm button label. Hidden when not provided |
| `cancel` | `string` | — | Cancel button label. Styled red outline when set to `'Decline'` |

### Events

| Event | Description |
|---|---|
| `confirm` | User clicked the confirm button |
| `cancel` | User clicked the cancel button |
| `close` | User clicked the X close button |

### Slots

| Slot | Description |
|---|---|
| `cancel` | Replace the close (X) button in the top-right corner |
| `actions` | Replace the entire button row |

### Using the Composable

The recommended way to show confirmation dialogs is the `openConfirmDialog()` composable. It works on any page using `AppLayout`.

```js
import { openConfirmDialog } from '@/composables/dialog';

const handleDelete = async () => {
    const choice = await openConfirmDialog({
        title: 'Delete this item?',
        type: 'danger',
        description: 'This action **cannot be undone**. The item will be permanently removed.',
        confirm: 'Yes, delete it',
        cancel: 'Cancel',
    });

    if (choice !== 'confirm') return;

    form.delete(route('items.destroy', item.id));
};
```

### Composable Options

```js
openConfirmDialog({
    title: 'string',         // Required — dialog heading
    description: 'string',   // Body text (supports Markdown)
    type: 'info',            // Semantic type or Tailwind colour
    icon: null,              // Custom Iconify icon string
    confirm: 'Confirm',      // Confirm button label
    cancel: 'Cancel',        // Cancel button label
    delay: 0,                // Milliseconds to wait before showing
    close: 'Close',          // Close action label
});
// Returns: 'confirm' | 'cancel' | 'close'
```

### Usage Patterns

| Pattern | Type | Title Example | Confirm Label |
|---|---|---|---|
| Destructive action | `danger` | "Delete this record?" | "Yes, delete" |
| Discard unsaved changes | `warning` | "Discard changes?" | "Discard" |
| Accept/decline invitation | Custom (`purple`) | "Accept this user" | "Accept" / Cancel as "Decline" |
| Success acknowledgement | `success` | "Changes saved!" | "Okay" |
| Informational prompt | `info` | "Before you continue..." | "Got it" |

---

## Design Guidelines

### When to Use Each

| Scenario | Component |
|---|---|
| Form editing, detail panels, multi-step workflows | `CommonModal` (right-docked) |
| Quick selection, compact forms (1-3 fields) | `CommonModal` (centred) |
| Confirm before destructive action | `CommonConfirmDialog` via composable |
| Accept/decline prompt | `CommonConfirmDialog` with custom cancel label |
| Informational acknowledgement | `CommonConfirmDialog` (info/success type) |

### Button Placement

Per the Figma spec, modal actions follow the button group pattern:

- **2 buttons** — Secondary (outline) left, Primary (solid) right
- **1 button** — Primary aligned right
- Danger modals use `colour="red"` on the confirm button

### Sizing

| Modal Type | Figma Width | Notes |
|---|---|---|
| Standard form | 476px | Default `max-w-lg` |
| Compact (no subtitle) | 475px | Single field + actions |
| Selection / contextual | 606px | Needs `max-width="606px"` |
| Confirmation dialog | 476px | Fixed via `max-w-[476px]` on the component |
| Mobile | Full width | Bottom-sheet with `rounded-t-xl` |

### Accessibility

- Focus is trapped within the modal while open (Headless UI)
- `Escape` key closes the modal (unless `closeOnOutsideClick: false`)
- `initialFocus` prop directs focus to a specific element on open
- Background overlay prevents interaction with underlying content

### Legacy Components

The following older modal components exist but should be replaced with `CommonModal` in new code:

| Component | Replacement |
|---|---|
| `Modal.vue` | `CommonModal` |
| `ConfirmationModal.vue` | `CommonConfirmDialog` via `openConfirmDialog()` composable |
| `ConfirmsPassword.vue` | Specialised — keep as-is (password confirmation flow) |
| `DialogModal.vue` | `CommonModal` with `side="center"` |

---

## Do / Don't

| | Guidance |
|---|---|
| ✅ Do | Use `side="right"` for form editing and detail panels |
| ❌ Don't | Use `side="center"` for forms with more than 3 fields — right-docked modals scroll better |
| ✅ Do | Use `openConfirmDialog()` composable for confirmation prompts |
| ❌ Don't | Render `CommonConfirmDialog` directly — always use the composable for global rendering |
| ✅ Do | Use `type="danger"` for destructive confirmation dialogs (delete, remove) |
| ❌ Don't | Use `type="info"` for destructive actions — the type must match the severity |
| ✅ Do | Provide both `confirm` and `cancel` labels on confirmation dialogs |
| ❌ Don't | Use vague labels like "OK" / "Cancel" — be specific: "Yes, delete" / "Keep it" |
| ✅ Do | Use the `after-leave` event to reset form state after the modal closes |
| ❌ Don't | Reset form state on `update:modelValue` — the transition hasn't completed yet |
| ✅ Do | Set `closeOnOutsideClick: false` for forms with unsaved changes |
| ❌ Don't | Allow accidental closure of forms with user input — protect against data loss |
