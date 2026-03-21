# TC Portal Component Map

Reference for translating HTML mockup patterns into real Vue components.
Used by the `/trilogy-mockup` skill when generating Vue implementation stubs.

**Live docs:** https://design.trilogycare.dev — Storybook with interactive examples for every Common component. Use `?path=/docs/common-{componentname}--docs` to find specific components (e.g. `common-commonalert--docs`, `common-commonbutton--docs`).

---

## Page Shell

Every page follows this structure:

```vue
<script setup lang="ts">
import AppLayout from '@/Layouts/AppLayout.vue';
import CommonContent from '@/Components/Common/CommonContent.vue';
import CommonHeader from '@/Components/Common/CommonHeader.vue';

const title = 'Page Title';
defineOptions({
    layout: (h: any, page: any) => h(AppLayout, { title: title }, () => page),
});

interface Props {
    // Server-side props here
}
defineProps<Props>();
</script>

<template>
    <CommonContent>
        <template #header>
            <CommonHeader :title="title" subtitle="Description text" variant="page">
                <template #actions>
                    <!-- Action buttons here -->
                </template>
            </CommonHeader>
        </template>

        <div class="space-y-4 p-4">
            <!-- Page content -->
        </div>
    </CommonContent>
</template>
```

---

## Layout & Structure

| HTML Pattern | Component | Import | Usage |
|---|---|---|---|
| Outer page wrapper | `CommonContent` | `@/Components/Common/CommonContent.vue` | Wraps entire page. Slots: `#header`, default, `#footer` |
| Page header bar with title + subtitle + actions | `CommonHeader` | `@/Components/Common/CommonHeader.vue` | Props: `title`, `subtitle`, `kicker`, `variant` (`page`\|`card`\|`card-sm`\|`card-lg`\|`definition`), `icon`. Slot: `#actions` |
| White card with border + shadow | `CommonCard` | `@/Components/Common/CommonCard.vue` | Props: `variant` (`default`\|`soft`), `border` (default true), `title`, `subtitle`, `headerBg`. Slots: `#header`, default, `#footer` |
| Side panel (resizable/collapsible) | `CommonPanel` | `@/Components/Common/CommonPanel.vue` | Props: `id`, `collapsible`, `side` (`center`\|`right`), `resizable`, `width` |
| Accordion sections | `CommonAccordion` | `@/Components/Common/CommonAccordion.vue` | Props: `items` (array), `variant` (`default`\|`gray`). Use `#item-{id}` slot per section |
| Collapsible section | `CommonCollapsible` | `@/Components/Common/CommonCollapsible.vue` | Simple open/close toggle |

---

## Form Components

### Form Wrapper Pattern

```vue
<script setup lang="ts">
import { useForm } from '@inertiajs/vue3';
import CommonForm from '@/Components/Common/CommonForm.vue';
import CommonFormField from '@/Components/Common/CommonFormField.vue';
import CommonInput from '@/Components/Common/CommonInput.vue';
import CommonButton from '@/Components/Common/CommonButton.vue';

const form = useForm({
    first_name: '',
    email: '',
});

const submit = () => {
    form.post(route('resource.store'));
};
</script>

<template>
    <CommonForm :form="form" @submit="submit">
        <CommonFormField name="first_name" label="First Name" required>
            <CommonInput v-model="form.first_name" />
        </CommonFormField>

        <CommonFormField name="email" label="Email">
            <CommonInput v-model="form.email" type="email" />
        </CommonFormField>

        <CommonButton type="submit" label="Save" :loading="form.processing" />
    </CommonForm>
</template>
```

### Input Mapping

| HTML Pattern | Component | Import | Key Props |
|---|---|---|---|
| `<label>` + `<input type="text">` | `CommonFormField` + `CommonInput` | `CommonFormField.vue`, `CommonInput.vue` | Field: `name`, `label`, `required`, `optional`, `hint`, `help`, `tooltip`. Input: `v-model`, `type` (`text`\|`email`\|`number`\|`date`\|`password`), `placeholder`, `leadingIcon`, `trailingIcon` |
| `<label>` + `<textarea>` | `CommonFormField` + `CommonTextarea` | `CommonFormField.vue`, `CommonTextarea.vue` | `v-model`, auto-resizes, max height 400px |
| `<select>` / custom dropdown | `CommonFormField` + `CommonSelectMenu` | `CommonFormField.vue`, `CommonSelectMenu.vue` | `v-model`, `items`, `searchable`, `multiple`, `valueKey`, `labelKey`, `filterFields`, `createItem`, `displayTags`, `showClear` |
| `<input type="checkbox">` | `CommonCheckbox` | `CommonCheckbox.vue` | `v-model`, `label`, `disabled`, `size` |
| Group of checkboxes | `CommonCheckboxGroup` | `CommonCheckboxGroup.vue` | Wraps multiple `CommonCheckbox` |
| Radio buttons | `CommonRadioGroup` | `CommonRadioGroup.vue` | `v-model`, `items` |
| Toggle switch | `CommonSwitch` | `CommonSwitch.vue` | `v-model`, `label`, `labelPosition` |
| Pill/segment selector | `CommonPillSelect` | `CommonPillSelect.vue` | `v-model`, items as `SelectOptionData[]` |
| Date input / calendar | `CommonDatePicker` | `CommonDatePicker.vue` | `v-model` |
| Date range | `CommonDateRangePicker` | `CommonDateRangePicker.vue` | `v-model` |
| Number input | `CommonNumber` | `CommonNumber.vue` | `v-model` |
| Number range (min-max) | `CommonNumberRange` | `CommonNumberRange.vue` | Two `CommonNumber` fields |
| File upload / drag-drop | `CommonUpload` | `CommonUpload.vue` | — |
| Phone input | `CommonPhone` | `CommonPhone.vue` | `v-model` |
| Address autocomplete | `CommonAddress` | `CommonAddress.vue` | Google Places integration |
| PIN / OTP input | `CommonPinInput` | `CommonPinInput.vue` | `v-model` |
| Fieldset grouping | `CommonFormFieldset` | `CommonFormFieldset.vue` | Groups related fields |

---

## Buttons

| HTML Pattern | Component | Props |
|---|---|---|
| Primary solid button (teal bg, white text) | `CommonButton` | `label`, `variant="solid"` (default) |
| Outline button | `CommonButton` | `label`, `variant="outline"` |
| Ghost/text button | `CommonButton` | `label`, `variant="ghost"` |
| Soft button (light bg) | `CommonButton` | `label`, `variant="soft"` |
| Link-style button | `CommonButton` | `label`, `variant="link"` |
| Danger button (red) | `CommonButton` | `label`, `actionVariant="danger"` |
| Icon-only button | `CommonButton` | `leadingIcon="heroicons:x-mark"` (no label) |
| Button with leading icon | `CommonButton` | `label`, `leadingIcon="heroicons:plus"` |
| Loading/submit button | `CommonButton` | `type="submit"`, `:loading="form.processing"` |
| Button as link | `CommonButton` | `:href="route('name')"` |

Default colour is `teal`. Default shape includes `rounded-full` when `rounded` prop is true.

---

## Data Display

| HTML Pattern | Component | Import | Key Props |
|---|---|---|---|
| Data table with search/filter/sort/pagination | `CommonTable` | `table/CommonTable.vue` | Server-side table data (paginated from Laravel) |
| Status badge / chip | `CommonBadge` | `CommonBadge.vue` | `label`, `colour` (any Tailwind colour or `warning`\|`error`\|`success`\|`info`), `variant` (`soft`\|`outline`), `size`, `leadingIcon` |
| KPI metric card | `CommonKpiCard` | `CommonKpiCard.vue` | `kpi: { value, label, subLabel?, icon?, iconColour?, changeValue?, isPositive? }` |
| Key-value pairs (dl/dt/dd) | `CommonDefinitionList` + `CommonDefinitionItem` | `CommonDefinitionList.vue`, `CommonDefinitionItem.vue` | `divider` prop for separators |
| Avatar with initials | `CommonAvatar` | `CommonAvatar.vue` | `avatar: { src?, short_name, full_name }`, `size` (`xs`\|`sm`\|`base`\|`lg`\|`xl`\|`2xl`\|`3xl`) |
| Stacked avatar group | `CommonAvatarGroup` | `CommonAvatarGroup.vue` | Array of avatars |
| Alert / banner | `CommonAlert` | `CommonAlert.vue` | `title`, `description`, `type` (`success`\|`info`\|`warning`\|`error`), `variant` (`default`\|`soft`), `close` |
| Progress bar | `CommonProgress` | `CommonProgress.vue` | `value`, `size` (`2xs` through `2xl`), animations |
| Markdown rendered text | `CommonMarkdown` | `CommonMarkdown.vue` | Content as slot |
| Line-clamped text | `CommonLineClamp` | `CommonLineClamp.vue` | Clamps to N lines |
| Copy to clipboard | `CommonCopy` | `CommonCopy.vue` | — |
| Doughnut/pie chart | `CommonDoughnutChart` | `CommonDoughnutChart.vue` | — |

---

## Navigation

| HTML Pattern | Component | Import | Key Props |
|---|---|---|---|
| Tab bar | `CommonTabs` | `CommonTabs.vue` | `items: [{ id, title, content?, count?, href? }]`, `mode` (`controlled`\|`uncontrolled`). Active: `border-teal-700 text-teal-700` |
| Step wizard / stepper | `CommonStepNavigation` | `CommonStepNavigation.vue` | Steps with `current`\|`upcoming`\|`complete` status. Indicator: `bg-teal-700` |
| Dropdown action menu | `CommonDropdown` | `CommonDropdown.vue` | `items` (or grouped arrays), `align`, `triggerVariant` |
| Breadcrumb nav | No component — use `<Link>` + text spans | `@inertiajs/vue3` | Follow pattern from page header |

---

## Overlays & Dialogs

| HTML Pattern | Component | Usage |
|---|---|---|
| Modal / dialog | `CommonModal` | Props: `title`, `side` (`center`\|`right`), `customWidth`, `overlay`. Slots: `#header`, `#body`, `#footer` |
| Server-routed modal (Inertia) | `Inertia::modal()` server-side | Returns from controller, no client-side component needed |
| Confirmation dialog | `useConfirmDialog()` composable | `dialog.open({ title, description, type, confirm, cancel })` returns promise |
| Toast notification | `useToast()` composable | `toast({ title, description, type })` |
| Tooltip | `CommonTooltip` | Props: `content`, wraps trigger element |
| Hover popover | `CommonHover` | Popover on hover |

---

## Icons

Use `CommonIcon` with Iconify icon names:

```vue
import CommonIcon from '@/Components/Common/CommonIcon.vue';

<CommonIcon name="heroicons:user" />
<CommonIcon name="heroicons:check-circle" />
<CommonIcon name="fa6-solid:folder-open" />
<CommonIcon name="radix-icons:check" />
```

**Available icon sets:** `heroicons:`, `heroicons-solid:`, `heroicons-outline:`, `fa6-solid:`, `radix-icons:`, `local:`

---

## Design Tokens Quick Reference

| Token | Value | Usage |
|---|---|---|
| Primary brand | `teal-700` (`#007F7E`) | CTAs, active states, focus rings, checkboxes, tab indicators |
| Accent | `teal-500` (`#43C0BE`) | Secondary teal accents |
| Secondary brand | `primary-blue-700` (`#2C4C79`) | Secondary elements |
| Text primary | `text-primary` (`#13171D`) | Body text |
| Text secondary | `text-secondary` (`#666666`) | Subdued text |
| Text tertiary | `text-tertiary` (`#808080`) | Hints, placeholders |
| Input radius | `rounded-input` (8px) | All text inputs |
| Focus ring | `focus-visible:ring-2 focus-visible:ring-teal-700` | Interactive elements |
| Error state | `ring-red-700 bg-red-200/10` | Input error styling |
| Card border | `border border-gray-400/40` | Card borders |
| Font | `Roboto Flex` | Global font family |
