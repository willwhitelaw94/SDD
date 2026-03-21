---
title: "Page Layout"
description: "Page headers, split panels, content areas, and responsive stacking patterns"
---

# Page Layout Patterns

Recurring layout compositions used across TC Portal pages. Each pattern shows the structure, when to use it, which components are involved, and how it responds on mobile.

## Pattern Selection Guide

| I need to... | Pattern |
|---|---|
| Show a list of entities with search/filter/sort | [Table List Page](#table-list-page) |
| Show a single entity's details | [Detail Page](#detail-page-with-back-navigation) |
| Show KPIs and charts | [Dashboard Grid](#dashboard-grid) |
| Create/edit something in a side panel | [Modal Form](#modal-form-pattern) |
| Walk the user through a multi-step flow | [Split Panel Layout](#split-panel-layout) |
| Show a hero/welcome landing area | [Banner Layout](#banner-layout) |
| Switch between related views on one page | [Tab Page](#tab-page-pattern) |
| Display key-value entity data | [Definition Detail](#definition-detail-pattern) |
| Show a document alongside its details | [Document Split View](#document-split-view) |
| Handle an empty data state | [Empty State](#empty-state-pattern) |
| Show a loading placeholder | [Loading Skeleton](#loading-skeleton-pattern) |
| Confirm before a destructive action | [Confirmation Flow](#confirmation-flow-pattern) |
| Show success/error feedback | [Toast Notification](#toast-notification-pattern) |

---

## Table List Page

The most common page layout in admin views. A header with actions, a card containing a searchable, filterable, sortable table.

### Structure

```
┌──────────────────────────────────────────────────┐
│  Page Title                    [+ Create Button]  │  ← CommonHeader
├──────────────────────────────────────────────────┤
│ ┌──────────────────────────────────────────────┐ │
│ │ 🔍 Search...        [Actions ▼] [Filter] [⊞] │ │  ← Table toolbar
│ ├──────────────────────────────────────────────┤ │
│ │  Name        │ Status  │ Date     │ Actions  │ │  ← CommonTable
│ │  John Doe    │ Active  │ 12 Aug   │ ⋯        │ │
│ │  Jane Smith  │ Pending │ 15 Sep   │ ⋯        │ │
│ ├──────────────────────────────────────────────┤ │
│ │  Page 1 of 5                    [15 ▼] /page │ │  ← Pagination
│ └──────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────┘
```

### Code

```vue
<CommonContent>
    <template #header>
        <CommonHeader :title="'Recipients'">
            <template #actions>
                <CommonButton
                    label="Add Recipient"
                    leading-icon="heroicons:plus"
                    :href="route('recipients.create')"
                />
            </template>
        </CommonHeader>
    </template>

    <CommonCard>
        <CommonTable
            :resource="table"
            search-placeholder="Search by name or email..."
        >
            <template #cell(status)="{ value }">
                <CommonBadge v-bind="value" />
            </template>
        </CommonTable>
    </CommonCard>
</CommonContent>
```

### When to Use

- Index pages listing entities (recipients, suppliers, invoices, bills)
- Any page where the primary content is a data table
- Pages that need search, filtering, sorting, and pagination

### Key Components

`CommonContent` → `CommonHeader` → `CommonCard` → `CommonTable`

See: [Tables](/design-system/components/tables), [Layout](/design-system/components/layout)

---

## Detail Page with Back Navigation

Used for entity detail views (recipient profile, supplier details, invoice show). Shows a kicker for context, a title with badge, back navigation, and action buttons.

### Structure

```
┌──────────────────────────────────────────────────┐
│  ← Back to recipients                             │  ← Back link
│                                                    │
│  Recipient                                         │  ← Kicker
│  John Smith  [Active]        [Edit] [Create Invoice]│ ← Title + badge + actions
│  Package Level 4 — Active                          │  ← Subtitle
└──────────────────────────────────────────────────┘
│                                                    │
│  ┌────────────────────┐  ┌────────────────────┐   │
│  │  Details Card       │  │  Activity Card     │   │  ← Content below
│  └────────────────────┘  └────────────────────┘   │
```

### Code

```vue
<CommonPageHeader
    :title="recipient.name"
    kicker="Recipient"
    :subtitle="`Package Level ${recipient.level} — ${recipient.status}`"
    back-label="Back to recipients"
    :back-href="route('recipients.index')"
>
    <template #badge>
        <CommonBadge :label="recipient.status" colour="green" />
    </template>
    <template #actions>
        <CommonButton label="Edit" variant="outline" leading-icon="heroicons:pencil" />
        <CommonButton label="Create Invoice" />
    </template>
</CommonPageHeader>

<div class="space-y-6 p-6">
    <div class="flex flex-col gap-6 md:flex-row">
        <CommonCard class="flex-1" title="Details">...</CommonCard>
        <CommonCard class="flex-1" title="Activity">...</CommonCard>
    </div>
</div>
```

### When to Use

- Show/detail pages for any entity
- Pages accessed from a list (need back navigation)
- Pages where the entity has a status badge

### Key Components

`CommonPageHeader` (with `kicker`, `backLabel`, `backHref`) → `CommonBadge` → `CommonButton`

See: [Layout](/design-system/components/layout), [Badges](/design-system/components/badges)

---

## Standard Page

A simpler variant of the table list page — header with cards below. No table, just content sections.

### Code

```vue
<CommonPageHeader title="Settings" subtitle="Manage your account preferences">
    <template #actions>
        <CommonButton label="Save Changes" />
    </template>
</CommonPageHeader>

<div class="space-y-6 p-6">
    <CommonCard title="Profile">
        <!-- Form fields -->
    </CommonCard>
    <CommonCard title="Notifications">
        <!-- Toggle switches -->
    </CommonCard>
</div>
```

### When to Use

- Settings pages, preference pages
- Pages with multiple card sections but no data table
- Simple content pages

### Spacing

| Element | Value | Tailwind |
|---|---|---|
| Page content padding | 24px | `p-6` |
| Card vertical gap | 24px | `space-y-6` |

---

## Dashboard Grid

KPI metrics across the top, followed by charts and data visualisations in a responsive grid.

### Structure

```
┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
│  KPI 1   │ │  KPI 2   │ │  KPI 3   │ │  KPI 4   │   ← 4-col grid
└──────────┘ └──────────┘ └──────────┘ └──────────┘

┌────────────────────┐ ┌────────────────────┐
│  Budget Breakdown  │ │  Spend Overview    │          ← 2-col grid
│  [Doughnut Chart]  │ │  [Spend Bars]      │
└────────────────────┘ └────────────────────┘
```

### Code

```vue
<!-- KPI row -->
<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
    <CommonKpiCard v-for="kpi in kpis" :key="kpi.id" v-bind="kpi" />
</div>

<!-- Chart row -->
<div class="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
    <CommonCard title="Budget Breakdown">
        <CommonDoughnutChart :chart="budgetChart" :single="false" />
    </CommonCard>
    <CommonCard title="Spend Overview">
        <CommonSpendBar v-for="bar in spendBars" :key="bar.id" v-bind="bar" />
    </CommonCard>
</div>
```

### Responsive Behaviour

| Breakpoint | KPI Grid | Chart Grid |
|---|---|---|
| Mobile (< 640px) | 1 column | 1 column |
| Tablet (640px+) | 2 columns | 1 column |
| Desktop (1024px+) | 4 columns | 2 columns |

### When to Use

- Home/dashboard landing pages per portal context
- Any page showing aggregated metrics and visualisations

### Key Components

`CommonKpiCard` → `CommonDoughnutChart` → `CommonSpendBar` → `CommonCard`

See: [Cards](/design-system/components/cards), [Data Display](/design-system/components/data-display)

---

## Banner Layout

A hero banner with background image, overlapping content cards below. Used for dashboard landing pages in the recipient portal.

### Structure

```
┌──────────────────────────────────────────────────┐
│                                                    │
│   Welcome, John                                    │  ← White text on banner
│   Recipient | Package Level 4                      │
│                                                    │
├──────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────┐     │
│  │  Card overlapping the banner (-mt-10)    │     │  ← Negative margin overlap
│  │  ...                                     │     │
│  └──────────────────────────────────────────┘     │
```

### Code

```vue
<!-- Hero banner -->
<div class="h-48 bg-cover bg-center md:h-72" :style="{ backgroundImage: `url(${bannerUrl})` }">
    <div class="mx-auto max-w-screen-xl px-4 py-10">
        <h3 class="text-2xl font-semibold text-white">Welcome, {{ user.name }}</h3>
        <p class="text-white/80">{{ context }}</p>
    </div>
</div>

<!-- Overlapping content -->
<div class="-mt-10 px-6 md:-mt-32">
    <CommonCard>
        <!-- Dashboard content -->
    </CommonCard>
</div>
```

### Responsive Behaviour

| Breakpoint | Banner Height | Overlap |
|---|---|---|
| Mobile | 192px (`h-48`) | `-mt-10` |
| Desktop (768px+) | 288px (`md:h-72`) | `md:-mt-32` |

### When to Use

- Recipient/consumer portal dashboard landing
- Welcome pages with personalised greeting
- Pages that need strong visual presence

See: [Illustrations — Banner Images](/design-system/foundations/illustrations)

---

## Split Panel Layout

Two-column layout with a step navigation sidebar and main content area. Used for multi-step forms and settings.

### Structure

```
┌──────────┬───────────────────────────────────┐
│ Step 1 ● │                                   │
│ Step 2 ○ │        Main Content               │
│ Step 3 ○ │        (form / settings)           │
│ Step 4 ○ │                                   │
└──────────┴───────────────────────────────────┘
```

### Code

```vue
<div class="flex h-full">
    <!-- Sidebar navigation -->
    <aside class="w-64 flex-shrink-0 border-r border-gray-200 bg-white">
        <CommonStepNavigation :steps="steps" />
    </aside>

    <!-- Main content -->
    <main class="flex-1 overflow-y-auto p-6">
        <slot />
    </main>
</div>
```

### Responsive Behaviour

On mobile, the sidebar collapses into a horizontal stepper bar or a dropdown menu above the content.

### When to Use

- Multi-step form wizards (admin flows)
- Settings pages with sections
- Package view layouts

### Key Components

`CommonStepNavigation` / sidebar nav → main `<slot />`

See: [Stepper](/design-system/components/stepper), [Navigation](/design-system/components/navigation)

---

## Tab Page Pattern

Content organised under tab navigation for switching between related views without a full page reload.

### Structure

```
┌──────────────────────────────────────────────────┐
│  [All]  [Active]  [Pending]  [Archived]           │  ← CommonTabs
├──────────────────────────────────────────────────┤
│                                                    │
│  Tab content (table, cards, etc.)                  │
│                                                    │
└──────────────────────────────────────────────────┘
```

### Code

```vue
<CommonTabs
    v-model="activeTab"
    :items="[
        { id: 'all', title: 'All' },
        { id: 'active', title: 'Active', count: 12 },
        { id: 'pending', title: 'Pending', count: 3 },
    ]"
>
    <template #all>
        <CommonTable :resource="allTable" search-placeholder="Search..." />
    </template>
    <template #active>
        <CommonTable :resource="activeTable" search-placeholder="Search active..." />
    </template>
    <template #pending>
        <CommonTable :resource="pendingTable" search-placeholder="Search pending..." />
    </template>
</CommonTabs>
```

### When to Use

- Filtering views by status or category without URL changes
- Showing different data perspectives on the same entity
- Secondary navigation within a section (e.g. bills: All / Drafts / Approved)

### Key Components

`CommonTabs` (controlled mode) → `CommonTable` or any content per tab

See: [Tabs](/design-system/components/tabs)

---

## Modal Form Pattern

Create/edit flows inside a slide-in panel or centred modal, using Inertia's `useForm` for state management.

### Structure

```
                              ┌──────────────────┐
                              │  Edit Profile   X │  ← Title + close
                              ├──────────────────┤
                              │                    │
                              │  [Form Fields]     │  ← Scrollable body
                              │                    │
                              ├──────────────────┤
                              │   [Cancel] [Save]  │  ← Sticky footer
                              └──────────────────┘
```

### Code

```vue
<script setup>
import { useForm } from '@inertiajs/vue3';

const form = useForm({
    name: props.item?.name ?? '',
    email: props.item?.email ?? '',
});

const submit = () => {
    form.put(route('items.update', props.item.id), {
        preserveScroll: true,
        onSuccess: () => { isOpen.value = false; },
    });
};
</script>

<template>
    <CommonModal v-model="isOpen" title="Edit Profile">
        <template #body>
            <div class="space-y-4 px-6 py-4">
                <CommonFormField label="Name" name="name">
                    <CommonInput v-model="form.name" />
                </CommonFormField>
                <CommonFormField label="Email" name="email">
                    <CommonInput v-model="form.email" type="email" />
                </CommonFormField>
            </div>
        </template>
        <template #footer>
            <div class="flex justify-end gap-3 px-6">
                <CommonButton label="Cancel" variant="outline" @click="isOpen = false" />
                <CommonButton label="Save" :loading="form.processing" @click="submit" />
            </div>
        </template>
    </CommonModal>
</template>
```

### When to Use

- Quick create/edit that doesn't need a full page
- Forms with 1–5 fields
- Editing a row item from a table

### Key Conventions

- Use `useForm` from Inertia for form state and submission
- `preserveScroll: true` to keep the table position after submit
- Show `loading` state on the submit button during processing
- Close modal in `onSuccess` callback
- Use `space-y-4` between form fields (16px vertical gap)

### Key Components

`CommonModal` → `CommonFormField` → `CommonInput` / `CommonSelectMenu` → `CommonButton`

See: [Modals & Dialogs](/design-system/components/modals-and-dialogs), [Forms](/design-system/components/forms)

---

## Document Split View

Two-column layout with a document viewer on one side and details/form on the other. Used for bill review, invoice inspection, and document-heavy workflows.

### Structure

```
┌────────────────────┬──────────────────────────┐
│                    │                            │
│  Document Viewer   │   Bill / Invoice Details   │
│  (PDF, images)     │   [Definition List]        │
│  col-span-5        │   [Actions]                │
│                    │   col-span-7               │
│                    │                            │
└────────────────────┴──────────────────────────┘
```

### Code

```vue
<div class="grid grid-cols-12 gap-6 p-6">
    <CommonCard class="col-span-12 sm:col-span-5">
        <CommonPdfViewer :src="document.url" />
    </CommonCard>
    <CommonCard class="col-span-12 sm:col-span-7" title="Bill Details">
        <CommonDefinitionList :items="billDetails" />
        <template #footer>
            <CommonButton label="Approve" />
            <CommonButton label="Reject" variant="outline" action-variant="danger" />
        </template>
    </CommonCard>
</div>
```

### Responsive Behaviour

| Breakpoint | Layout |
|---|---|
| Mobile (< 640px) | Single column — document stacks above details |
| Tablet+ (640px+) | 5/7 split — document left, details right |

### When to Use

- Reviewing bills, invoices, or documents with associated data
- Any page where the user needs to see a document alongside structured information

---

## Confirmation Flow Pattern

The standard pattern for destructive actions — show a confirmation dialog, then execute via Inertia router with a success toast.

### Code

```vue
<script setup>
import { openConfirmDialog } from '@/composables/dialog';
import { useToast } from '@/composables';
import { router } from '@inertiajs/vue3';

const { toast } = useToast();

const handleDelete = async (item) => {
    const choice = await openConfirmDialog({
        title: `Delete ${item.name}?`,
        type: 'danger',
        description: 'This action **cannot be undone**. The item will be permanently removed.',
        confirm: 'Yes, delete',
        cancel: 'Keep it',
    });

    if (choice !== 'confirm') return;

    router.delete(route('items.destroy', item.id), {
        preserveScroll: true,
        onSuccess: () => toast({ type: 'success', message: `${item.name} has been deleted.` }),
        onError: () => toast({ type: 'error', message: 'Failed to delete. Please try again.' }),
    });
};
</script>
```

### When to Use

- Deleting entities (recipients, invoices, team members)
- Discarding unsaved changes
- Any irreversible action

### Key Conventions

- Always `await` the dialog — it returns `'confirm'`, `'cancel'`, or `'close'`
- Use `type: 'danger'` for destructive actions, `type: 'warning'` for cautionary
- Be specific with labels: "Yes, delete" not "OK"
- Always show a success toast after the action completes
- Handle `onError` with a failure toast

### Key Components

`openConfirmDialog()` composable → `router.delete()` → `toast()`

See: [Modals & Dialogs](/design-system/components/modals-and-dialogs), [Feedback & States](/design-system/components/feedback)

---

## Toast Notification Pattern

Show ephemeral feedback after user actions using the `useToast` composable.

### Code

```vue
<script setup>
import { useToast } from '@/composables';
const { toast } = useToast();

// After a successful action
toast({ type: 'success', message: 'Invoice has been approved.' });

// After a failure
toast({ type: 'error', message: 'Could not save changes. Please try again.' });

// Informational
toast({ type: 'info', message: 'Your session will expire in 5 minutes.' });

// Warning
toast({ type: 'warning', message: 'Some fields are incomplete.' });
</script>
```

### When to Use

- After successful create/update/delete operations
- After failed operations (with clear error message)
- Informational notices that don't require user action

### Key Conventions

- Always pair destructive actions with a success toast on completion
- Keep messages concise — one sentence, past tense for completions ("Invoice approved")
- Use `type: 'error'` for failures, never `type: 'danger'`
- Don't use toasts for validation errors — those display inline via `useFormField`

---

## Empty State Pattern

Shown when a section, table, or card has no data. Provides context and a call-to-action.

### Structure

```
┌──────────────────────────────────────────────────┐
│                                                    │
│              📁 (illustration or icon)             │
│                                                    │
│            No recipients found                     │  ← Heading
│   Add your first recipient to get started.         │  ← Description
│                                                    │
│              [+ Add Recipient]                      │  ← CTA button
│                                                    │
└──────────────────────────────────────────────────┘
```

### Code

```vue
<!-- Inside a card -->
<CommonCard>
    <CommonCardEmptyState>
        <template #illustration>
            <img :src="undrawNoData" alt="" class="h-32" />
        </template>
        <template #heading>No recipients found</template>
        <template #description>
            Add your first recipient to get started with care management.
        </template>
        <template #action>
            <CommonButton label="Add Recipient" leading-icon="heroicons:plus" />
        </template>
    </CommonCardEmptyState>
</CommonCard>

<!-- Inside a table -->
<CommonTable :resource="table" search-placeholder="Search...">
    <template #empty>
        <CommonEmptyPlaceholder
            icon="heroicons:document-text"
            text="No invoices found"
            description="Try adjusting your search or filters."
        />
    </template>
</CommonTable>
```

### When to Use Which

| Context | Component |
|---|---|
| Empty card body | `CommonCardEmptyState` (supports illustration) |
| Empty table | `CommonEmptyPlaceholder` via `#empty` slot |
| Empty list or generic area | `CommonEmptyPlaceholder` |

See: [Cards](/design-system/components/cards), [Feedback & States](/design-system/components/feedback)

---

## Loading Skeleton Pattern

Show pulsing placeholders while data loads, using Inertia v2 deferred props.

### Code

```vue
<Deferred data="recipients">
    <template #fallback>
        <div class="space-y-4 p-6">
            <!-- Simulate a heading -->
            <div class="h-8 w-48 animate-pulse rounded bg-gray-200" />
            <!-- Simulate a card with table -->
            <div class="h-64 animate-pulse rounded-lg bg-gray-100" />
        </div>
    </template>

    <CommonCard title="Recipients">
        <CommonTable :resource="recipients" search-placeholder="Search..." />
    </CommonCard>
</Deferred>
```

### Skeleton Sizing Guide

| Content Type | Skeleton | Classes |
|---|---|---|
| Page heading | Single bar | `h-8 w-48 rounded bg-gray-200` |
| Card body | Rounded block | `h-64 rounded-lg bg-gray-100` |
| Text paragraph | Narrow bar | `h-4 w-full rounded bg-gray-200` |
| Avatar | Circle | `h-10 w-10 rounded-full bg-gray-200` |
| Table row | Full-width bar | `h-10 w-full rounded bg-gray-100` |

### Key Conventions

- Always use `animate-pulse` for the pulsing effect
- Match skeleton dimensions roughly to the real content
- Use `bg-gray-200` for foreground elements, `bg-gray-100` for backgrounds
- Group related skeletons with `space-y-4`

---

## Definition Detail Pattern

Display structured entity data as key-value pairs inside a card.

### Code

```vue
<CommonCard title="Patient Details">
    <CommonDefinitionList :items="[
        { title: 'Full Name', value: patient.name },
        { title: 'Date of Birth', value: patient.dob },
        { title: 'NDIS Number', value: patient.ndis, size: 'lg' },
        { title: 'Email', value: patient.email },
        { title: 'Phone', value: patient.phone },
    ]" />
</CommonCard>
```

### When to Use

- Detail/show pages for entities
- Side panels and drawers showing entity info
- Anywhere you have 3+ label-value pairs

### Key Conventions

- Use `size: 'lg'` for the primary identifier (e.g. NDIS number, invoice total)
- Use `copy: true` on items users need to clipboard (IDs, emails, phone numbers)
- Use `money: true` for dollar amounts (auto-prefixes `$`)
- Group related items using nested arrays

See: [Layout](/design-system/components/layout)

---

## Responsive Stacking

Components that sit side-by-side on desktop and stack vertically on mobile.

### Two-Column Stack

```vue
<div class="flex flex-col gap-4 md:flex-row">
    <CommonCard class="flex-1" title="Details">...</CommonCard>
    <CommonCard class="flex-1" title="Activity">...</CommonCard>
</div>
```

### Three-Column Grid

```vue
<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
    <CommonActionCard v-for="item in items" :key="item.id" :action="item" />
</div>
```

### Responsive Breakpoints

| Pattern | Mobile | Tablet (640px) | Desktop (1024px) |
|---|---|---|---|
| Two-column flex | Stacked | Side-by-side | Side-by-side |
| Three-column grid | 1 col | 2 cols | 3 cols |
| Four-column grid | 1 col | 2 cols | 4 cols |

See: [Breakpoints](/design-system/foundations/breakpoints)

---

## Carousel Section Pattern

Horizontal scrolling for browsable items that may overflow the viewport.

### Code

```vue
<CommonCarousel :data="serviceCards">
    <template #slide="{ datum }">
        <CommonActionCard :action="datum" class="w-72" />
    </template>
</CommonCarousel>
```

### When to Use

- Browsing related items (services, suppliers, packages)
- Horizontal card lists where showing 2-3 items at a time is sufficient

### Key Conventions

- Set a fixed width on slide content (e.g. `w-72`) for consistent sizing
- Don't put critical content in a carousel — users may not scroll
- Use for supplementary/browsable content only

See: [Interactive](/design-system/components/interactive)
