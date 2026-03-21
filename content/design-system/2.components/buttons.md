---
title: "Buttons"
description: "Button variants, sizes, states, icon buttons, and button groups for the TC Portal"
---

# Buttons

Buttons are defined in the [Figma Buttons page](https://www.figma.com/design/ojTCI9yefnl9ORYEVrv2WJ/Trilogy-Care-Design-System?node-id=1-161) and implemented as `CommonButton.vue`.

**Component:** `resources/js/Components/Common/CommonButton.vue`
**Storybook:** `stories/Common/Inputs/CommonButton.stories.js`

## Button Variants

Six visual variants control the button's appearance. Choose based on hierarchy and context.

| Variant | Figma Name | Use Case | Appearance |
|---|---|---|---|
| `solid` | Solid (Primary) | Primary actions — submit, save, confirm | Filled background, white text |
| `outline` | Outline (Secondary) | Secondary actions alongside a primary | Border only, coloured text |
| `ghost` | Ghost (Tertiary) | Tertiary actions, toolbar buttons | No background or border, coloured text |
| `link` | Link | Inline text actions, navigation | Underline on hover, no background |
| `soft` | Soft | Toasts, messages, and alerts | Light tinted background, coloured text |
| `outline-soft` | — | Subtle bordered variant | Light border, coloured text |

### Variant Hierarchy

Use variants to establish visual hierarchy within a group of actions:

1. **Solid** — one per section, the primary call-to-action
2. **Outline** — secondary actions alongside solid
3. **Ghost** — tertiary or de-emphasised actions
4. **Link** — inline or navigational actions
5. **Soft** — contextual actions within toasts/alerts

## Action Variants (Colour Intent)

Action variants apply semantic colour to any button variant.

| Action Variant | Colour | Use Case |
|---|---|---|
| `default` | Teal | Standard actions (default) |
| `danger` | Red | Destructive actions — delete, remove |
| `info` | Blue | Informational actions |
| `success` | Green | Confirmation, completion |
| `warning` | Orange | Cautionary actions |

Danger has dedicated Figma frames for **Solid (Danger)** and **Outline (Danger)** variants. Other action variants follow the same pattern using their respective colour palette.

## Sizes

Four sizes are available. `base` is the default.

| Size | Figma Name | Height | Text | Padding | Use Case |
|---|---|---|---|---|---|
| `xs` | Extra Small (XS) | 24px | `text-xs` (12px) | `px-3 py-1` | Compact UI, table actions |
| `sm` | Small (SM) | 30px | `text-xs` (12px) | `px-3 py-[7px]` | Secondary actions, cards |
| `base` | Medium (Base) | 36px | `text-sm` (14px) | `px-3 py-2` | Default for most contexts |
| `lg` | Large (LG) | 40px | `text-base` (16px) | `px-3 py-2` | Primary page-level actions |

## States

Every button variant supports five interaction states, shown across the Figma columns:

| State | Description | Visual Change |
|---|---|---|
| **Default** | At rest | Base variant styling |
| **Hover** | Mouse over | Lighter/darker background shift |
| **Focus** | Keyboard focus | `ring-2` focus ring with `ring-offset-1` |
| **Active** | Being clicked | Darker background than hover |
| **Disabled** | Non-interactive | 50% opacity, `cursor-not-allowed`. Use very sparingly |

### Focus Ring

All buttons use a visible focus ring for accessibility:
```
focus-visible:ring-2 focus-visible:ring-offset-1
```
The ring colour matches the button's action variant colour (e.g., `ring-teal-700` for default).

## Icon Support

Buttons support leading and trailing icons via [Iconify](https://iconify.design/) format strings.

| Prop | Position | Example |
|---|---|---|
| `leadingIcon` | Before label | `heroicons:pencil` |
| `trailingIcon` | After label | `heroicons:chevron-right` |

### Icon Sizes

Icon sizing adapts to button size and whether the button is icon-only:

| Button Size | With Label | Icon Only |
|---|---|---|
| `xs` | 14px (`h-3.5 w-3.5`) | 16px (`h-4 w-4`) |
| `sm` | 14px (`h-3.5 w-3.5`) | 16px (`h-4 w-4`) |
| `base` | 16px (`h-4 w-4`) | 24px (`h-6 w-6`) |
| `lg` | 16px (`h-4 w-4`) | 28px (`h-7 w-7`) |

## Icon Buttons

Icon-only buttons (no label, just an icon) are detected automatically when `leadingIcon` or `trailingIcon` is set without a `label` or slot content.

The [Figma Icon Buttons frame](https://www.figma.com/design/ojTCI9yefnl9ORYEVrv2WJ/Trilogy-Care-Design-System?node-id=107-5098) defines three types across two colour schemes:

### Types

| Type | Figma Name | Equivalent Props |
|---|---|---|
| Solid | Solid, Colour=Primary | `variant="solid"` + icon only |
| Outline | Outline, Colour=Primary | `variant="outline"` + icon only |
| Ghost | Ghost, Colour=Primary | `variant="ghost"` + icon only |
| Soft | Soft, Colour=Grey | `variant="soft" colour="gray"` + icon only |

### Colour Schemes

| Scheme | Figma Label | Props |
|---|---|---|
| Primary (Teal) | `Colour=Primary` | Default (`colour="teal"`) |
| Grey | `Colour=Grey` | `colour="gray"` |

### Icon Button Sizes

Icon buttons use five sizes in Figma (slightly different scale from text buttons):

| Size | Figma | Dimensions | Border Radius |
|---|---|---|---|
| S | S (24) | 24x24px | `rounded-md` |
| M | M (26) | 30x30px | `rounded-md` |
| L | L (34) | 36x36px | `rounded-md` |
| XL | XL (42) | 40x40px | `rounded-lg` |
| 2XL | 2XL (48) | 48x48px | `rounded-lg` |

Map to component sizes: S→`xs`, M→`sm`, L→`base`, XL→`lg`. The 2XL size is not directly mapped in the component.

## Additional Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `href` | `string` | `null` | Renders as `<Link>` (Inertia) or `<a>` tag |
| `target` | `string` | `_self` | Link target. Use `_blank` for external links |
| `type` | `string` | `button` | HTML button type: `button`, `submit`, `reset` |
| `loading` | `boolean` | `false` | Shows spinner overlay with fade transition |
| `rounded` | `boolean` | `false` | Forces `rounded-full` (circular for icon buttons) |
| `block` | `boolean` | `false` | Full-width button (`w-full`) |
| `hover` | `boolean` | `true` | Toggle hover effects |
| `disabled` | `boolean` | `false` | Disables interaction |

## Usage Examples

```vue
<!-- Primary action -->
<CommonButton label="Save Changes" />

<!-- Secondary action -->
<CommonButton label="Cancel" variant="outline" />

<!-- Danger action -->
<CommonButton label="Delete" action-variant="danger" />

<!-- With icons -->
<CommonButton label="Edit" leading-icon="heroicons:pencil" />
<CommonButton label="Next" trailing-icon="heroicons:chevron-right" />

<!-- Icon-only button -->
<CommonButton leading-icon="heroicons:x-mark" variant="ghost" size="sm" />

<!-- Loading state -->
<CommonButton label="Saving..." :loading="true" />

<!-- As a link -->
<CommonButton label="View Details" :href="route('details.show', id)" />

<!-- Full width submit -->
<CommonButton label="Sign In" type="submit" :block="true" size="lg" />
```

## Button Groups

Button groups define how multiple buttons are arranged together. They are defined in the [Figma Button Group page](https://www.figma.com/design/ojTCI9yefnl9ORYEVrv2WJ/Trilogy-Care-Design-System?node-id=1295-8555).

Button groups are not a dedicated component — they are layout patterns applied with Tailwind utility classes around `CommonButton` instances.

### Group Types

| Type | Buttons | Layout | Use Case |
|---|---|---|---|
| **Single Button** | 1 | Standalone | Simple confirmation, single action |
| **2 Buttons** | 2 | Split — secondary left, primary right | Most dialogs and forms (e.g. Cancel + Save) |
| **3 Buttons** | 3 | Split — tertiary left, secondary + primary right | Forms with a back/reset + cancel + submit |
| **3 Buttons Alt** | 3 | All right-aligned | Grouped related actions without a left-side action |
| **4 Buttons** | 4 | Split — tertiary left, remaining right | **Restricted use** — avoid when possible |

### Variant Hierarchy Within Groups

Buttons within a group use variant hierarchy to indicate importance:

| Position | Variant | Example |
|---|---|---|
| Primary action (rightmost) | `solid` | Save, Submit, Confirm |
| Secondary action | `outline` | Cancel, Back |
| Tertiary action | `ghost` or `link` | Delete, Reset |

### Desktop Layout

On desktop, button groups use a horizontal flex row with `justify-between` to split secondary actions to the left and primary actions to the right.

```vue
<!-- 2 Buttons — Cancel + Save -->
<div class="flex items-center justify-end gap-3">
    <CommonButton label="Cancel" variant="outline" />
    <CommonButton label="Save" />
</div>

<!-- 3 Buttons — Delete (left) + Cancel & Save (right) -->
<div class="flex items-center justify-between gap-3">
    <CommonButton label="Delete" variant="ghost" action-variant="danger" />
    <div class="flex items-center gap-3">
        <CommonButton label="Cancel" variant="outline" />
        <CommonButton label="Save" />
    </div>
</div>

<!-- 3 Buttons Alt — all right-aligned -->
<div class="flex items-center justify-end gap-3">
    <CommonButton label="Button" variant="ghost" />
    <CommonButton label="Button" variant="outline" />
    <CommonButton label="Button" />
</div>
```

### Mobile Layout

On mobile, buttons stack vertically with the primary action on top. Use responsive classes to switch between layouts.

```vue
<!-- Responsive 2 Buttons -->
<div class="flex flex-col gap-3 sm:flex-row sm:justify-end">
    <CommonButton label="Cancel" variant="outline" class="order-2 sm:order-1" />
    <CommonButton label="Save" class="order-1 sm:order-2" />
</div>

<!-- Responsive 3 Buttons -->
<div class="flex flex-col gap-3 sm:flex-row sm:justify-between">
    <CommonButton label="Delete" variant="ghost" action-variant="danger" class="order-3 sm:order-1" />
    <div class="flex flex-col gap-3 sm:flex-row sm:gap-3">
        <CommonButton label="Cancel" variant="outline" class="order-2 sm:order-1" />
        <CommonButton label="Save" class="order-1 sm:order-2" />
    </div>
</div>
```

### With Padding (Container)

Button groups can be placed inside a padded container — typically a modal footer or card footer with a top border. The Figma "With Padding" variant shows groups inside a bordered container with `12px` padding.

```vue
<!-- Padded button group (e.g. modal/card footer) -->
<div class="flex items-center justify-end gap-3 border-t border-gray-200 px-3 pt-3">
    <CommonButton label="Cancel" variant="outline" />
    <CommonButton label="Save" />
</div>
```

Use `CommonCardFooter` for card contexts, which provides the border and padding automatically.

### Icon Button Groups

Icon-only button groups follow the same layout patterns but use icon buttons instead of labelled buttons. Common patterns include action toolbars on table rows and card headers.

```vue
<!-- Icon group — edit + delete -->
<div class="flex items-center gap-2">
    <CommonButton leading-icon="heroicons:pencil-square" variant="ghost" size="sm" />
    <CommonButton leading-icon="heroicons:trash" variant="ghost" action-variant="danger" size="sm" />
</div>

<!-- Icon group with kebab menu — menu (left) + edit & delete (right) -->
<div class="flex items-center justify-between">
    <CommonButton leading-icon="heroicons:ellipsis-vertical" variant="ghost" colour="gray" size="sm" />
    <div class="flex items-center gap-2">
        <CommonButton leading-icon="heroicons:pencil-square" variant="ghost" size="sm" />
        <CommonButton leading-icon="heroicons:trash" variant="ghost" action-variant="danger" size="sm" />
    </div>
</div>
```

### Sizes

Button groups come in two sizes matching the button size tokens:

| Size | Button Height | Use Case |
|---|---|---|
| **Regular** (`base`) | 36px | Admin, supplier, and care co-ordinator dashboards |
| **Large** (`lg`) | 40px | Recipient portal only |

### Spacing

| Context | Gap | Tailwind |
|---|---|---|
| Text button groups | 12px | `gap-3` |
| Icon button groups | 8px | `gap-2` |

### Destructive Action Styling

When an action is destructive and cannot be undone, use the red colourway:

```vue
<!-- Destructive confirmation -->
<div class="flex items-center justify-end gap-3">
    <CommonButton label="Cancel" variant="outline" action-variant="danger" />
    <CommonButton label="Delete" action-variant="danger" />
</div>
```

For preview/delete options or instances where actions are unrelated, use a primary + ghost styling with space-between alignment:

```vue
<!-- Unrelated actions — split layout -->
<div class="flex items-center justify-between">
    <CommonButton label="Delete" variant="link" action-variant="danger" />
    <CommonButton label="Close" />
</div>
```

## Do / Don't

| | Guidance |
|---|---|
| ✅ Do | Use only one `solid` button per section — it's the primary call-to-action |
| ❌ Don't | Place two `solid` buttons side by side — this creates competing focal points |
| ✅ Do | Use `outline` for secondary actions alongside a solid primary |
| ❌ Don't | Use `ghost` as the primary action — it's too visually subtle |
| ✅ Do | Use `action-variant="danger"` for destructive actions like delete |
| ❌ Don't | Use a red-coloured `solid` button for non-destructive actions |
| ✅ Do | Include a leading icon when the action benefits from visual reinforcement (e.g. `heroicons:trash` for delete) |
| ❌ Don't | Add icons to every button — icons should clarify, not clutter |
| ✅ Do | Use `size="base"` (36px) for admin dashboards and `size="lg"` (40px) only in the recipient portal |
| ❌ Don't | Mix button sizes within the same button group |
| ✅ Do | Use the `loading` prop to show progress on async actions |
| ❌ Don't | Disable the button without visual feedback — use `loading` instead of just `disabled` |
| ✅ Do | Use `variant="link"` for inline navigation actions |
| ❌ Don't | Use `variant="link"` for form submission — links imply navigation, not mutation |

## Legacy Button Components

The following older button components exist but should be replaced with `CommonButton` in new code:

| Component | Replacement |
|---|---|
| `Button.vue` | `CommonButton` with appropriate `colour` prop |
| `PrimaryButton.vue` | `CommonButton` (default variant) |
| `SecondaryButton.vue` | `CommonButton variant="outline"` |
| `DangerButton.vue` | `CommonButton action-variant="danger"` |
