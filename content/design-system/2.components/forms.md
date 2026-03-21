---
title: "Forms"
description: "Form input components, drop-down menus, layout patterns, and spacing guidelines for the TC Portal"
---

# Forms

Form patterns are defined in the [Figma Forms page](https://www.figma.com/design/ojTCI9yefnl9ORYEVrv2WJ/Trilogy-Care-Design-System?node-id=492-1550) and input field specifications live on the [Figma Input Fields page](https://www.figma.com/design/ojTCI9yefnl9ORYEVrv2WJ/Trilogy-Care-Design-System?node-id=1-785). All inputs are implemented as a suite of `Common*` components.

All form inputs integrate with the `useFormField` composable (`resources/js/composables/useFormField.js`), which provides error state handling, field ID binding, and accessibility support. The `CommonFormField` wrapper adds labels, hints, error display, and size variants.

:form-field-showcase

## Form Input Components

| Component | File | Description |
|---|---|---|
| `CommonInput` | `CommonInput.vue` | Text, email, password inputs with icon and mask support |
| `CommonSelectMenu` | `CommonSelectMenu.vue` | Dropdown select with search, multi-select, grouping |
| `CommonCheckbox` | `CommonCheckbox.vue` | Single checkbox with label and size variants |
| `CommonCheckboxGroup` | `CommonCheckboxGroup.vue` | Multi-checkbox with select all/deselect all |
| `CommonRadioGroup` | `CommonRadioGroup.vue` | Radio button group |
| `CommonSwitch` | `CommonSwitch.vue` | Toggle switch with label positioning |
| `CommonTextarea` | `CommonTextarea.vue` | Auto-resizing textarea |
| `CommonDatePicker` | `date/CommonDatePicker.vue` | Segmented date input with calendar dropdown |
| `CommonDateRangePicker` | `CommonDateRangePicker.vue` | Date range selection |
| `CommonPhone` | `CommonPhone.vue` | Phone number input with masking |
| `CommonNumber` | `CommonNumber.vue` | Numeric input with formatting |
| `CommonNumberRange` | `CommonNumberRange.vue` | Numeric range slider |
| `CommonUpload` | `CommonUpload.vue` | File upload |
| `CommonAddress` | `CommonAddress.vue` | Address autocomplete |
| `CommonToggleGroup` | `CommonToggleGroup.vue` | Toggle button group (see [Select Areas](/design-system/components/select-areas)) |
| `CommonSelectCard` | `CommonSelectCard.vue` | Card with modal lookup (see [Select Areas](/design-system/components/select-areas)) |

All components live in `resources/js/Components/Common/`.

## Text Input (`CommonInput`)

The primary text field component supporting multiple input types.

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `type` | `'text' \| 'email' \| 'password'` | `'text'` | Input type |
| `placeholder` | `string` | — | Placeholder text |
| `maxlength` | `number` | `280` | Max character length |
| `leadingIcon` | `string` | — | Icon before input (Iconify format) |
| `trailingIcon` | `string` | — | Icon after input |
| `shortcutSymbol` | `string` | — | Keyboard shortcut indicator |
| `mask` | `string` | — | Input mask (decorative, unmasked value in model) |
| `inputmode` | `string` | — | Mobile keyboard hint |
| `readonly` | `boolean` | `false` | Read-only state |
| `disabled` | `boolean` | `false` | Disabled state |
| `required` | `boolean` | `false` | Required field |
| `autofocus` | `boolean` | `false` | Auto-focus on mount |
| `autocomplete` | `string` | — | Browser autocomplete hint |

Password fields automatically include a visibility toggle.

## Select Menu (`CommonSelectMenu`)

Dropdown select with fuzzy search, multi-select, and item creation.

### Key Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `items` | `array` | — | Options array (supports groups, labels, separators) |
| `multiple` | `boolean` | `false` | Multi-select mode |
| `searchable` | `boolean` | `false` | Enable fuzzy search (Fuse.js) |
| `searchPlaceholder` | `string` | — | Search input placeholder |
| `placeholder` | `string` | — | Dropdown placeholder |
| `labelKey` | `string` | — | Custom label field name |
| `valueKey` | `string` | — | Custom value field name |
| `maxLabels` | `number` | `2` | Max labels shown in multi-select |
| `max` | `number` | — | Maximum selectable items |
| `showClear` | `boolean` | — | Show clear button |
| `createItem` | `boolean` | — | Allow creating new items |
| `displayTags` | `boolean` | — | Show selected items as tags below |
| `unknownValueDisplay` | `string` | — | Handle unknown values: `'unknown'`, `'value'`, `'hide'`, `'placeholder'` |

## Checkbox (`CommonCheckbox`)

### Sizes

| Size | Prop Value | Usage |
|---|---|---|
| Small | `sm` | Compact forms, tables |
| Base | `base` | Default |
| Large | `lg` | Emphasised selections |
| Extra Large | `xl` | Touch-friendly contexts |

### Checkbox Group

`CommonCheckboxGroup` wraps multiple checkboxes with optional select all/deselect all controls. Scrollable container with max-height of 240px.

## Switch (`CommonSwitch`)

Toggle switch with flexible label positioning.

### Label Positions

`left`, `right`, `top`, `bottom`, `top-left`, `top-right`, `bottom-left`, `bottom-right`

Default: `right`

## Form Layout Patterns

The Figma Forms page defines three primary form layouts:

### Simple Modal Form

Small forms within a centered modal dialog.

- **Width:** ~476px
- **Padding:** 24px
- **Structure:** Title + subtitle → Fields → Button group (right-aligned)
- **Use case:** Quick edits, confirmations with 1-3 fields

### Drawer Forms

Slide-out panel forms, available as simple or scrollable.

- **Width:** 475px (desktop), full-width (mobile)
- **Header:** Title + close icon (56px height)
- **Content padding:** 24px horizontal
- **Use case:** Create/edit flows, multi-section forms

### Full Page Forms

Page-level forms with two sub-patterns:

| Pattern | Description | Use Case |
|---|---|---|
| **Split View** | Sidebar stepper + form content | Multi-step wizards in admin |
| **Stepper** | Horizontal stepper bar + centered form | Sequential form flows |

## Form Spacing

From the Figma spacing annotations:

| Element | Spacing | Tailwind |
|---|---|---|
| Form padding (top/sides) | 24px | `p-6` |
| Form padding (mobile top) | 16px | `pt-4` |
| Field separation (vertical) | 16px | `space-y-4` or `gap-4` |
| Section heading to subtext | 2px | `gap-0.5` |
| Heading/subtext to first field | 8px | `mt-2` |
| Item related to field above | 8px | `mt-2` |
| Section divider separation | 24px | `my-6` |
| Radio/checkbox list item spacing | 12px | `space-y-3` |
| Button group gap | 12px | `gap-3` |

## Button Group Placement

- **Modals:** Right-aligned within the modal, primary action on right
- **Drawers:** Full-width sticky footer (60px height) or inline (36px)
- **Full page:** Full-width footer bar or inline within content area

## Drop Down

Drop-down menus are defined in the [Figma Drop Down page](https://www.figma.com/design/ojTCI9yefnl9ORYEVrv2WJ/Trilogy-Care-Design-System?node-id=514-8901) and implemented as `CommonSelectMenu.vue`.

### Drop Down Item States

Each item in a drop-down list supports multiple states across two types (Default and Icon):

| State | Appearance |
|---|---|
| **Default** | White background, dark text |
| **Hover** | Teal background, white text |
| **Selected** | Teal background with checkmark icon |
| **Selected + Hover** | Darker teal background with checkmark |
| **Disabled** | Grey background, muted text |
| **Disabled + Selected** | Grey background with checkmark |

### Item Types

| Type | Description |
|---|---|
| **Default** | Text-only list item |
| **Icon** | List item with a leading icon |

### Sizes

| Size | Item Height | Use Case |
|---|---|---|
| **Base** | 40px | Standard forms (admin, supplier, coordinator) |
| **Large** | 43px | Recipient portal only |

### Drop Down Variants

The full field dropdown (select + open menu) supports combinations of features:

| Feature | Description |
|---|---|
| **Search** | Optional search input at the top of the list for filtering |
| **Scroll bar** | Visible scrollbar for long lists |
| **Actions** | Footer action items (e.g. "Add new", "Action item") with `+` icon |

All eight combinations are defined in Figma (search on/off x scrollbar on/off x actions on/off).

### Grouped Lists

Drop-down lists can be grouped with section headers:

| Pattern | Description |
|---|---|
| **Single tier** | Flat list with a label header |
| **Two tier** | Two labelled groups (e.g. "In budget" / "No") |
| **Three tier** | Three labelled groups with varying item counts |

### Timezone Example

The Figma file includes timezone-specific dropdown examples showing:
- Items with two-part content: location name + timezone offset (e.g. "Adelaide, Australia (GMT +10:00)")
- Filterable search narrowing the timezone list

## Do / Don't

| | Guidance |
|---|---|
| ✅ Do | Wrap all inputs in `CommonFormField` for consistent labels, hints, and error display |
| ❌ Don't | Use raw `<input>` elements — always use the `Common*` form components |
| ✅ Do | Use `space-y-4` (16px) between form fields for consistent vertical rhythm |
| ❌ Don't | Use arbitrary spacing between fields — stick to the 16px standard |
| ✅ Do | Use `CommonSelectMenu` with `searchable` for lists longer than 7 items |
| ❌ Don't | Use a plain select for long lists — users can't find items without search |
| ✅ Do | Place the primary button on the right in button groups (e.g. Cancel left, Save right) |
| ❌ Don't | Place destructive actions on the right — keep "Delete" left-aligned or in a ghost/link variant |
| ✅ Do | Use server-side validation via Laravel Data classes — errors flow through `useFormField` automatically |
| ❌ Don't | Add inline client-side validation that duplicates server rules |
| ✅ Do | Use the `CommonDatePicker` segmented input for date fields |
| ❌ Don't | Use `CommonInput type="date"` — the native date picker is inconsistent across browsers |
| ✅ Do | Use `CommonCheckboxGroup` with select/deselect all for 4+ related checkboxes |
| ❌ Don't | Use individual `CommonCheckbox` instances without grouping when options are related |

## Validation States

All form inputs support error states via `useFormField`:

- Error text appears below the input in red (`text-danger-700`)
- Input border changes to `border-danger-500`
- Error messages come from server-side validation (Laravel Data classes)
