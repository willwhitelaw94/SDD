# TC Portal — Figma-to-Code Design System Rules

> Auto-generated design system rules for translating Figma designs into TC Portal code.
> Figma Source: [Trilogy Care Design System](https://www.figma.com/design/ojTCI9yefnl9ORYEVrv2WJ/Trilogy-Care-Design-System)

---

## 1. Token Definitions

### 1.1 Colours

**Source:** `tailwind.config.js` → `theme.colors`
**Figma:** [Colours page](https://www.figma.com/design/ojTCI9yefnl9ORYEVrv2WJ/Trilogy-Care-Design-System?node-id=1-30)

#### Brand Colours

| Token | Hex | Tailwind Class | Usage |
|---|---|---|---|
| Teal 700 | `#007F7E` | `teal-700` | Primary brand, default buttons, active states |
| Teal 500 | `#43C0BE` | `teal-500` | Focus rings, highlights |
| Teal 50 | `#F0FAFA` | `teal-50` | Soft backgrounds |
| Primary Blue 700 | `#2C4C79` | `primary-blue-700` | Secondary brand, headings |
| Primary Blue 500 | `#4B7BBE` | `primary-blue-500` | Info states, links |

#### Semantic Colour Tokens

Map Figma semantic colours to these Tailwind tokens:

| Figma Token | Tailwind Prefix | Colour | Usage |
|---|---|---|---|
| Default | `teal-*` | Teal | Standard actions, primary CTA |
| Info | `primary-blue-*` | Blue | Informational states |
| Success | `green-*` | Green | Positive confirmation |
| Warning | `orange-*` | Orange | Cautionary states |
| Danger | `red-*` | Red | Destructive actions, errors |

#### Surface Colours

| Figma Token | Hex | Tailwind |
|---|---|---|
| Page background | `#F3F4F6` | `bg-page` or `bg-gray-100` |
| Card surface | `#FFFFFF` | `bg-white` |
| Card soft | `#FAFAFA` | `bg-card-soft` |
| Primary text | `#13171D` | `text-primary` |
| Secondary text | `#666666` | `text-secondary` |
| Tertiary text | `#808080` | `text-tertiary` |
| Border | `#E5E7EB` | `border-gray-200` |

#### Full Teal Palette

```
teal-50: #F0FAFA  teal-100: #D5F1F0  teal-200: #BAE8E7
teal-300: #94DBDA  teal-400: #66CCCA  teal-500: #43C0BE
teal-600: #2F9E9C  teal-700: #007F7E  teal-800: #005656
teal-900: #003D3D
```

#### Full Primary Blue Palette

```
primary-blue-50: #F0F4FA   primary-blue-100: #D6E1F0
primary-blue-200: #BCCEE7  primary-blue-300: #96B2D9
primary-blue-400: #7197CC  primary-blue-500: #4B7BBE
primary-blue-600: #39639D  primary-blue-700: #2C4C79
primary-blue-800: #1E3452  primary-blue-900: #101C2D
```

### 1.2 Typography

**Font:** Roboto Flex (defined as `fontFamily.serif` in Tailwind config)
**Global CSS variable:** `--font-family: 'Roboto Flex', sans-serif`

#### Heading Scale

| Figma Style | Element | Tailwind Classes |
|---|---|---|
| Heading 1 | `h1` | `text-5xl font-semibold` |
| Heading 2 | `h2` | `text-4xl font-semibold` |
| Heading 3 | `h3` | `text-3xl font-semibold` |
| Heading 4 | `h4` | `text-2xl font-semibold` |
| Heading 5 | `h5` | `text-xl font-semibold` |
| Heading 6 | `h6` | `text-lg font-semibold` |

#### Body Text

| Figma Style | Tailwind | Usage |
|---|---|---|
| Body default | `text-sm font-normal` | Standard body text, form labels |
| Body small | `text-xs font-normal` | Hints, captions, badges |
| Body large | `text-base font-normal` | Recipient portal text |
| Link | `text-sm text-blue-500 hover:underline` | Inline links (`.link` class) |

### 1.3 Spacing

Standard Tailwind 4px grid. Common patterns in TC Portal:

| Figma Token | Value | Tailwind | Usage |
|---|---|---|---|
| Page padding | 24px | `p-6` | Content area padding |
| Card gap | 24px | `space-y-6` or `gap-6` | Between cards |
| Form field gap | 16px | `space-y-4` or `gap-4` | Between form fields |
| Button group gap | 12px | `gap-3` | Between buttons |
| Icon button gap | 8px | `gap-2` | Between icon buttons |
| Inline spacing | 8px | `gap-2` | Inline elements |

### 1.4 Border Radius

| Figma Token | Value | Tailwind |
|---|---|---|
| Input fields | 8px | `rounded-input` (custom) |
| Cards | 4px | `rounded` (default) |
| Small elements | 4px | `rounded` |
| Buttons | 6px | `rounded-md` |
| Large containers | 8px | `rounded-lg` |
| Pills/avatars | 9999px | `rounded-full` |

**CSS variables:**
```css
--rounded-rule: 4px;
--rounded-rule-inner: calc(var(--rounded-rule) - 1px);
```

### 1.5 Shadows

Use standard Tailwind shadow utilities. No custom shadow tokens defined.

### 1.6 Motion / Animation

| Figma Animation | Tailwind Class | Duration | Easing |
|---|---|---|---|
| Scale in | `animate-scale-in` | 100ms | ease-out |
| Scale out | `animate-scale-out` | 100ms | ease-in |
| Fade out | `animate-hide` | 100ms | ease-in |
| Slide in (right) | `animate-slideIn` | 150ms | cubic-bezier(0.16, 1, 0.3, 1) |
| Swipe out | `animate-swipeOut` | 100ms | ease-out |
| Accordion open | `animate-slideDown` | 300ms | cubic-bezier(0.87, 0, 0.13, 1) |
| Accordion close | `animate-slideUp` | 300ms | cubic-bezier(0.87, 0, 0.13, 1) |
| Pulse (skeleton) | `animate-pulse` | — | CSS default |

### 1.7 Breakpoints

Standard Tailwind mobile-first breakpoints:

| Figma Frame | Breakpoint | Tailwind Prefix |
|---|---|---|
| Mobile | < 640px | (default) |
| Tablet | ≥ 640px | `sm:` |
| Small desktop | ≥ 768px | `md:` |
| Desktop | ≥ 1024px | `lg:` |
| Wide | ≥ 1280px | `xl:` |
| Ultra-wide | ≥ 1536px | `2xl:` |

---

## 2. Component Library

### 2.1 Overview

**Location:** `resources/js/Components/Common/`
**Count:** 86 reusable components
**Architecture:** Vue 3 `<script setup lang="ts">` + Reka UI primitives + Tailwind CSS
**API Convention:** [UI3](https://github.com/benjamincanac/ui3) prop naming
**Auto-import:** Components are auto-imported via `unplugin-vue-components` — no manual imports needed for Common components.

### 2.2 Component Mapping (Figma → Code)

#### Buttons

**Figma:** [Buttons page](https://www.figma.com/design/ojTCI9yefnl9ORYEVrv2WJ/Trilogy-Care-Design-System?node-id=1-161)
**Component:** `CommonButton.vue`

```vue
<!-- Primary action (solid teal) -->
<CommonButton label="Save Changes" />

<!-- Secondary action -->
<CommonButton label="Cancel" variant="outline" />

<!-- Destructive action -->
<CommonButton label="Delete" action-variant="danger" />

<!-- With icon -->
<CommonButton label="Edit" leading-icon="heroicons:pencil" />

<!-- Icon-only button -->
<CommonButton leading-icon="heroicons:x-mark" variant="ghost" size="sm" />

<!-- Loading state -->
<CommonButton label="Saving..." :loading="true" />

<!-- As Inertia link -->
<CommonButton label="View" :href="route('items.show', id)" />
```

**Variant mapping:**

| Figma Variant | Prop |
|---|---|
| Solid (Primary) | `variant="solid"` (default) |
| Outline (Secondary) | `variant="outline"` |
| Ghost (Tertiary) | `variant="ghost"` |
| Link | `variant="link"` |
| Soft | `variant="soft"` |
| Outline Soft | `variant="outline-soft"` |

**Size mapping:**

| Figma Size | Prop | Height |
|---|---|---|
| XS | `size="xs"` | 24px |
| SM | `size="sm"` | 30px |
| Base (default) | `size="base"` | 36px |
| LG | `size="lg"` | 40px |

**Action variant (colour intent):**

| Figma Colour | Prop |
|---|---|
| Primary/Teal | `action-variant="default"` (default) |
| Red/Destructive | `action-variant="danger"` |
| Blue/Info | `action-variant="info"` |
| Green/Success | `action-variant="success"` |
| Orange/Warning | `action-variant="warning"` |

#### Button Groups

Button groups are **layout patterns**, not a dedicated component:

```vue
<!-- 2 buttons: Cancel + Save (right-aligned) -->
<div class="flex items-center justify-end gap-3">
    <CommonButton label="Cancel" variant="outline" />
    <CommonButton label="Save" />
</div>

<!-- 3 buttons: Delete (left) + Cancel & Save (right) -->
<div class="flex items-center justify-between gap-3">
    <CommonButton label="Delete" variant="ghost" action-variant="danger" />
    <div class="flex items-center gap-3">
        <CommonButton label="Cancel" variant="outline" />
        <CommonButton label="Save" />
    </div>
</div>
```

#### Forms

**Components:** `CommonForm`, `CommonFormField`, `CommonInput`, `CommonSelectMenu`, `CommonCheckbox`, `CommonRadioGroup`, `CommonSwitch`, `CommonTextarea`, `CommonDatePicker`, `CommonDateRangePicker`

Three-layer architecture:

```vue
<CommonForm :form="form" @submit="form.post(route('items.store'))">
    <div class="space-y-4">
        <CommonFormField name="name" label="Full Name" required>
            <CommonInput v-model="form.name" placeholder="Enter name" />
        </CommonFormField>

        <CommonFormField name="email" label="Email" required>
            <CommonInput v-model="form.email" type="email" />
        </CommonFormField>

        <CommonFormField name="role" label="Role">
            <CommonSelectMenu
                v-model="form.role"
                :options="roleOptions"
                placeholder="Select role..."
            />
        </CommonFormField>

        <CommonFormField name="active" label="Active">
            <CommonSwitch v-model="form.active" />
        </CommonFormField>
    </div>
</CommonForm>
```

**Form state:** Always use `useForm()` from `@inertiajs/vue3`:

```typescript
import { useForm } from '@inertiajs/vue3';

const form = useForm({
    name: '',
    email: '',
    role: null,
    active: true,
});
```

#### Cards

**Component:** `CommonCard.vue`

```vue
<CommonCard title="Section Title">
    <!-- Card body content -->
</CommonCard>

<CommonCard>
    <template #header>
        <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold">Custom Header</h3>
            <CommonButton label="Action" size="sm" variant="ghost" />
        </div>
    </template>
    <!-- Body -->
    <template #footer>
        <CommonCardFooter>
            <CommonButton label="Cancel" variant="outline" />
            <CommonButton label="Save" />
        </CommonCardFooter>
    </template>
</CommonCard>
```

#### Badges

**Component:** `CommonBadge.vue`

```vue
<CommonBadge label="Active" colour="green" />
<CommonBadge label="Pending" colour="orange" />
<CommonBadge label="Cancelled" colour="red" />
<CommonBadge label="Draft" colour="gray" />
```

#### Tables

**Component:** `CommonTable.vue` (in `table/` subfolder)

```vue
<CommonCard>
    <CommonTable
        :resource="table"
        search-placeholder="Search by name..."
    >
        <template #cell(status)="{ value }">
            <CommonBadge v-bind="value" />
        </template>
        <template #cell(actions)="{ row }">
            <CommonButton
                leading-icon="heroicons:pencil-square"
                variant="ghost"
                size="sm"
                :href="route('items.edit', row.id)"
            />
        </template>
        <template #empty>
            <CommonEmptyPlaceholder
                icon="heroicons:document-text"
                text="No items found"
            />
        </template>
    </CommonTable>
</CommonCard>
```

#### Modals

**Component:** `CommonModal.vue` (Headless UI based)

```vue
<CommonModal v-model="isOpen" title="Edit Profile">
    <template #body>
        <div class="space-y-4 px-6 py-4">
            <!-- Form fields -->
        </div>
    </template>
    <template #footer>
        <div class="flex justify-end gap-3 px-6">
            <CommonButton label="Cancel" variant="outline" @click="isOpen = false" />
            <CommonButton label="Save" :loading="form.processing" @click="submit" />
        </div>
    </template>
</CommonModal>
```

#### Tabs

**Component:** `CommonTabs.vue`

```vue
<CommonTabs
    v-model="activeTab"
    :items="[
        { id: 'all', title: 'All' },
        { id: 'active', title: 'Active', count: 12 },
        { id: 'pending', title: 'Pending', count: 3 },
    ]"
>
    <template #all><!-- Tab content --></template>
    <template #active><!-- Tab content --></template>
    <template #pending><!-- Tab content --></template>
</CommonTabs>
```

#### Stepper / Multi-Step

**Component:** `CommonStepNavigation.vue` (Reka UI TabsRoot)

```vue
<CommonStepNavigation :steps="steps" />
```

#### Avatars

**Components:** `CommonAvatar.vue`, `CommonAvatarGroup.vue`

```vue
<CommonAvatar :name="user.name" :src="user.avatar" size="md" />
<CommonAvatarGroup :users="teamMembers" :max="4" />
```

#### Tooltips

**Component:** `CommonTooltip.vue` (in `hover/` subfolder)

```vue
<CommonTooltip content="Helpful description">
    <CommonButton leading-icon="heroicons:information-circle" variant="ghost" size="sm" />
</CommonTooltip>
```

#### Alerts

**Component:** `CommonAlert.vue`

```vue
<CommonAlert type="info" title="Note">
    This action requires approval from your coordinator.
</CommonAlert>
```

#### Accordion

**Component:** `CommonAccordion.vue`

```vue
<CommonAccordion :items="faqItems" />
```

#### Data Display

**Components:** `CommonDefinitionList.vue`, `CommonDefinitionItem.vue`, `CommonKpiCard.vue`

```vue
<!-- Definition list -->
<CommonDefinitionList :items="[
    { title: 'Name', value: patient.name },
    { title: 'DOB', value: patient.dob },
    { title: 'NDIS', value: patient.ndis, size: 'lg' },
]" />

<!-- KPI cards -->
<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
    <CommonKpiCard v-for="kpi in kpis" :key="kpi.id" v-bind="kpi" />
</div>
```

#### Empty States

**Components:** `CommonCardEmptyState.vue`, `CommonEmptyPlaceholder.vue`

```vue
<!-- Card empty state (with illustration) -->
<CommonCardEmptyState>
    <template #illustration>
        <img :src="undrawNoData" alt="" class="h-32" />
    </template>
    <template #heading>No recipients found</template>
    <template #description>Add your first recipient to get started.</template>
    <template #action>
        <CommonButton label="Add Recipient" leading-icon="heroicons:plus" />
    </template>
</CommonCardEmptyState>

<!-- Table/generic empty state -->
<CommonEmptyPlaceholder
    icon="heroicons:document-text"
    text="No invoices found"
    description="Try adjusting your search or filters."
/>
```

#### Progress

**Components:** `CommonProgress.vue`, `CommonProgressBar.vue`

#### Dropdown Menu

**Component:** `CommonDropdown.vue`, `CommonMenuItem.vue`

### 2.3 Legacy Components (Do NOT Use)

These older components exist but must NOT be used in new code:

| Legacy Component | Use Instead |
|---|---|
| `Button.vue` | `CommonButton` |
| `PrimaryButton.vue` | `CommonButton` (default) |
| `SecondaryButton.vue` | `CommonButton variant="outline"` |
| `DangerButton.vue` | `CommonButton action-variant="danger"` |
| Any PrimeVue component | Equivalent Common component |

---

## 3. Frameworks & Libraries

### 3.1 Stack

| Layer | Technology | Version |
|---|---|---|
| Frontend framework | Vue 3 | v3.5.13 |
| Server bridge | Inertia.js | v2.0.12 |
| State management | Pinia | v2.3.0 |
| Server state | TanStack Vue Query | v5.54.2 |
| CSS framework | Tailwind CSS | v3.1.0 |
| Headless UI (selects, checkboxes, tabs) | Reka UI | v2.4.0 |
| Headless UI (modals) | Headless UI | v1.7.23 |
| Build system | Vite | v5 |
| Backend | Laravel | v12 |
| Language | TypeScript | v5.5.4 |

### 3.2 Key Frontend Dependencies

- `@vueuse/core` — Vue composition utilities
- `fuse.js` — Fuzzy search in select menus
- `maska` — Input masking
- `dayjs` / `moment` — Date handling
- `chart.js` — Charting
- `embla-carousel-vue` — Carousel
- `posthog-js` — Analytics
- `@sentry/vue` — Error tracking
- `ziggy-js` — Laravel named routes in JS

### 3.3 Auto-Import Configuration

Components and composables are auto-imported via Vite plugins:

```javascript
// vite.config.js — auto-resolved, no manual import needed
// Components from: resources/js/Components/Common/
// Composables from: resources/js/composables/
// Reka UI components via RekaResolver
```

---

## 4. Asset Management

### 4.1 Storage Locations

| Asset Type | Location | Access Pattern |
|---|---|---|
| Public images (logos, banners) | `public/` | Direct URL: `/logo.svg` |
| Component assets (illustrations) | `resources/js/Assets/` | Import: `import Svg from '@/Assets/Common/empty.svg'` |
| Custom icons | `assets/icons/` | Via Monicon: `icon="local:abn"` |
| Font Awesome icons | `assets/icons/fa/` | Via Monicon: `icon="local:fa-calendar-day-regular"` |

### 4.2 Import Patterns

```vue
<script setup>
// SVG/image assets imported as modules
import EmptySvg from '@/Assets/Common/empty.svg';
import InvoiceConfirmation from '@/Assets/Common/invoice-confirmation.png';
</script>

<template>
    <img :src="EmptySvg" alt="No data" class="h-32" />
</template>
```

### 4.3 Illustrations

Illustrations for empty states and onboarding are stored in `resources/js/Assets/` organised by feature:
- `Common/` — Shared illustrations (empty.svg, invoice.svg, undraw_vault.svg)
- `Leads/` — Lead feature illustrations
- `Login/` — Auth page assets
- `Errors/` — Error page illustrations (404.svg)
- `Onboarding/` — Onboarding flow assets

### 4.4 Asset Optimisation

- Vite handles asset processing and fingerprinting at build time
- SVGs imported as modules render inline
- Production builds drop `console` and `debugger` statements
- No external CDN — all assets bundled

---

## 5. Icon System

### 5.1 Overview

**Library:** [Monicon](https://monicon.dev/) (`@monicon/vue`)
**Component:** `CommonIcon.vue`
**Registry:** `icons.ts` (322 configured icons, tree-shaken at build time)
**Browse:** [icones.js.org](https://icones.js.org/)
**Figma:** [Iconography page](https://www.figma.com/design/ojTCI9yefnl9ORYEVrv2WJ/Trilogy-Care-Design-System?node-id=40-8812)

### 5.2 Usage

```vue
<CommonIcon icon="heroicons:pencil-square" class="h-4 w-4" />
<CommonIcon icon="heroicons-outline:document-text" class="h-5 w-5 text-gray-500" />
<CommonIcon icon="local:abn" class="h-4 w-4" />
```

### 5.3 Icon Library Prefixes

| Prefix | Library | Usage |
|---|---|---|
| `heroicons:` | Heroicons (solid) | Primary UI icons |
| `heroicons-outline:` | Heroicons (outline) | Secondary/lighter icons |
| `radix-icons:` | Radix Icons | Dropdowns, chevrons |
| `material-symbols:` | Material Symbols | Specialised icons |
| `fa6-solid:` | Font Awesome 6 | Specific domain icons |
| `mdi:` | Material Design Icons | Team/user icons |
| `local:` | Custom app icons | Brand/domain-specific |
| `local:fa-*` | Custom FA regular | FA regular weight |
| `flag:` | Country flags | `flag:au-4x3` |
| `svg-spinners:` | SVG Spinners | Loading animations |
| `logos:` | Service logos | External service icons |
| `tabler:` | Tabler icons | Supplementary icons |
| `ph:` | Phosphor icons | Supplementary icons |
| `healthicons:` | Health icons | Healthcare domain |

### 5.4 Icon Sizing Convention

| Context | Size | Tailwind Classes |
|---|---|---|
| Inline with text-xs | 14px | `h-3.5 w-3.5` |
| Inline with text-sm | 16px | `h-4 w-4` |
| Standalone small | 20px | `h-5 w-5` |
| Standalone medium | 24px | `h-6 w-6` |
| Icon-only button (base) | 24px | `h-6 w-6` |
| Icon-only button (lg) | 28px | `h-7 w-7` |

### 5.5 Adding New Icons

1. Find the icon at [icones.js.org](https://icones.js.org/)
2. Add the Iconify name to `icons.ts`
3. Use via `<CommonIcon icon="prefix:name" />`
4. For custom SVGs: add to `assets/icons/`, reference as `local:filename`

---

## 6. Styling Approach

### 6.1 Methodology

**Primary:** Tailwind CSS v3 utility classes
**No CSS Modules, no Styled Components, no scoped CSS** (except rare overrides in `app.css`)

### 6.2 Global Styles

**File:** `resources/css/app.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
    --header-height: 4rem;
    --rounded-rule: 4px;
    --rounded-rule-inner: calc(var(--rounded-rule) - 1px);
    font-family: 'Roboto Flex', sans-serif;
}

/* Base heading scale applied globally */
@layer base {
    h1 { @apply text-5xl font-semibold; }
    h2 { @apply text-4xl font-semibold; }
    /* ... through h6 */
}
```

### 6.3 Dynamic Class Patterns

Components use computed classes for variant/size/colour mapping:

```typescript
const sizeClass = computed(() => ({
    'xs': 'px-3 py-1 text-xs',
    'sm': 'px-3 py-[7px] text-xs',
    'base': 'px-3 py-2 text-sm',
    'lg': 'px-3 py-2 text-base',
}[props.size]));
```

### 6.4 Safelist (Dynamic Colours)

`tailwind.config.js` safelists dynamic colour patterns to support runtime colour binding:

```javascript
safelist: [
    { pattern: /(bg|text|ring|border)-(danger|info|success|warning|default)(-[0-9]+)?$/ },
]
```

### 6.5 Responsive Design Patterns

**Mobile-first approach.** Common responsive patterns:

```vue
<!-- Two-column → single column -->
<div class="flex flex-col gap-4 md:flex-row">
    <CommonCard class="flex-1">...</CommonCard>
    <CommonCard class="flex-1">...</CommonCard>
</div>

<!-- 4-column KPI grid →  2 → 1 -->
<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
    <CommonKpiCard v-for="kpi in kpis" :key="kpi.id" v-bind="kpi" />
</div>

<!-- 12-column document split → stacked -->
<div class="grid grid-cols-12 gap-6">
    <div class="col-span-12 sm:col-span-5"><!-- Document viewer --></div>
    <div class="col-span-12 sm:col-span-7"><!-- Details --></div>
</div>
```

### 6.6 Key CSS Variables

| Variable | Value | Usage |
|---|---|---|
| `--header-height` | `4rem` (64px) | Fixed header height |
| `--rounded-rule` | `4px` | Default border radius |
| `--font-family` | `'Roboto Flex', sans-serif` | Global font |

---

## 7. Project Structure

### 7.1 Frontend Organisation

```
resources/js/
├── app.ts                          # Entry point
├── Pages/                          # Inertia pages (feature-based)
│   ├── Dashboard/                  # Role-specific dashboards
│   ├── Recipient/                  # Recipient pages
│   ├── Lead/                       # Lead pages + Partials/ + Public/
│   ├── Bills/                      # Billing pages
│   └── ...                         # 30 feature directories
├── Components/
│   ├── Common/                     # 86 reusable components (PRIMARY UI LIBRARY)
│   │   ├── CommonButton.vue
│   │   ├── CommonInput.vue
│   │   ├── table/                  # Table sub-components
│   │   ├── date/                   # Date picker sub-components
│   │   ├── hover/                  # Tooltip, hover components
│   │   └── navigation/             # Nav sub-components
│   ├── Bill/                       # Feature-specific components
│   ├── Recipient/
│   └── ...                         # 28 feature component directories
├── Layouts/
│   ├── AppLayout.vue               # Root authenticated layout
│   ├── GuestLayout.vue             # Unauthenticated layout
│   ├── ChildLayouts/               # Nested context layouts
│   └── PageLayouts/                # Reusable page templates
│       ├── ListPageLayout.vue
│       ├── ShowPageLayout.vue
│       ├── FormPageLayout.vue
│       └── FullPageLayout.vue
├── composables/                    # 48+ Vue composables (auto-imported)
├── stores/                         # Pinia stores
├── types/                          # TypeScript definitions
├── Helpers/                        # Utility functions
├── Assets/                         # SVG/image assets by feature
└── api/                            # API client utilities
```

### 7.2 Page Structure Pattern

Every Inertia page follows this pattern:

```vue
<script setup lang="ts">
import AppLayout from '@/Layouts/AppLayout.vue';

const title = 'Page Title';

defineOptions({
    layout: (h: any, page: any) => h(AppLayout, { title }, () => page),
});

interface Props {
    items: Item[];
}
defineProps<Props>();
</script>

<template>
    <CommonContent>
        <template #header>
            <CommonHeader :title="title">
                <template #actions>
                    <CommonButton label="Create" leading-icon="heroicons:plus" />
                </template>
            </CommonHeader>
        </template>

        <!-- Page content -->
    </CommonContent>
</template>
```

### 7.3 Page Layout Patterns

| Pattern | When to Use | Key Components |
|---|---|---|
| Table List | Index pages with data tables | `CommonContent` → `CommonHeader` → `CommonCard` → `CommonTable` |
| Detail Page | Entity show pages | `CommonPageHeader` (kicker, back nav) → cards |
| Dashboard Grid | KPI + chart pages | Grid of `CommonKpiCard` + `CommonCard` with charts |
| Modal Form | Quick create/edit | `CommonModal` → `CommonForm` → fields |
| Split Panel | Multi-step wizards | `CommonStepNavigation` + main content |
| Tab Page | Filtered views | `CommonTabs` → content per tab |
| Document Split | Document review | 12-col grid: viewer (5) + details (7) |
| Banner Layout | Welcome/hero pages | Hero image + overlapping `CommonCard` |

### 7.4 Path Aliases

| Alias | Resolves To |
|---|---|
| `@/*` | `resources/js/*` |
| `@inertiaui/table-vue` | `vendor/inertiaui/table/vue/dist/inertiaui-table` |

---

## 8. Figma-to-Code Translation Rules

### 8.1 General Rules

1. **Always use Common components** — never create raw HTML elements when a Common component exists
2. **Check existing components first** — before building anything new, check `resources/js/Components/Common/`
3. **Follow UI3 naming convention** — props use `variant`, `size`, `colour`, `actionVariant`, `leadingIcon`, `trailingIcon`
4. **Use Tailwind utilities** — no inline styles, no custom CSS classes unless absolutely necessary
5. **Mobile-first** — write base styles for mobile, add responsive prefixes for larger screens
6. **No PrimeVue** — the project has migrated away from PrimeVue; use Common components only

### 8.2 Figma Colour → Tailwind Mapping

When you see a colour in Figma, map it to the closest Tailwind token:

| Figma Colour | Tailwind |
|---|---|
| `#007F7E` | `teal-700` |
| `#43C0BE` | `teal-500` |
| `#2C4C79` | `primary-blue-700` |
| `#F3F4F6` | `gray-100` (page bg) |
| `#E5E7EB` | `gray-200` (borders) |
| `#6B7280` | `gray-500` (secondary text) |
| `#111827` | `gray-900` (primary text) |
| `#FFFFFF` | `white` (card bg) |

### 8.3 Figma Component → Code Component Mapping

| Figma Component | Code Component | Notes |
|---|---|---|
| Button | `CommonButton` | Map variant, size, colour, icons |
| Input | `CommonFormField` + `CommonInput` | Always wrap in FormField |
| Select / Dropdown | `CommonFormField` + `CommonSelectMenu` | Reka UI Combobox |
| Checkbox | `CommonCheckbox` or `CommonCheckboxGroup` | |
| Radio | `CommonRadioGroup` | |
| Toggle / Switch | `CommonSwitch` | |
| Date Picker | `CommonDatePicker` | |
| Card | `CommonCard` | |
| Badge / Tag | `CommonBadge` | Map colour prop |
| Table | `CommonTable` | Feature-rich with sorting/pagination |
| Modal / Dialog | `CommonModal` | Side or center panel |
| Tabs | `CommonTabs` | |
| Stepper | `CommonStepNavigation` | Reka UI Tabs |
| Avatar | `CommonAvatar` | |
| Tooltip | `CommonTooltip` | |
| Alert / Notice | `CommonAlert` | |
| Accordion | `CommonAccordion` | |
| Icon | `CommonIcon` | Use Iconify format |
| Progress | `CommonProgressBar` | |
| Empty State (card) | `CommonCardEmptyState` | |
| Empty State (generic) | `CommonEmptyPlaceholder` | |

### 8.4 Figma Auto Layout → Tailwind Flex/Grid

| Figma Property | Tailwind |
|---|---|
| Auto Layout: Horizontal | `flex` or `flex items-center` |
| Auto Layout: Vertical | `flex flex-col` |
| Gap: 4 | `gap-1` |
| Gap: 8 | `gap-2` |
| Gap: 12 | `gap-3` |
| Gap: 16 | `gap-4` |
| Gap: 24 | `gap-6` |
| Padding: 16 | `p-4` |
| Padding: 24 | `p-6` |
| Fill container | `flex-1` or `w-full` |
| Hug contents | `w-auto` (default) |
| Space between | `justify-between` |
| Center aligned | `items-center justify-center` |

### 8.5 Deferred Props (Loading States)

When Figma shows a skeleton/loading state, implement with Inertia v2 deferred props:

```vue
<Deferred data="items">
    <template #fallback>
        <div class="space-y-4 p-6">
            <div class="h-8 w-48 animate-pulse rounded bg-gray-200" />
            <div class="h-64 animate-pulse rounded-lg bg-gray-100" />
        </div>
    </template>

    <!-- Real content when loaded -->
    <CommonCard title="Items">
        <CommonTable :resource="items" />
    </CommonCard>
</Deferred>
```

### 8.6 Confirmation Dialogs

```typescript
import { openConfirmDialog } from '@/composables/dialog';
import { useToast } from '@/composables';

const { toast } = useToast();

const handleDelete = async (item) => {
    const choice = await openConfirmDialog({
        title: `Delete ${item.name}?`,
        type: 'danger',
        description: 'This action cannot be undone.',
        confirm: 'Yes, delete',
        cancel: 'Keep it',
    });

    if (choice !== 'confirm') return;

    router.delete(route('items.destroy', item.id), {
        preserveScroll: true,
        onSuccess: () => toast({ type: 'success', message: `${item.name} deleted.` }),
    });
};
```

### 8.7 Toast Notifications

```typescript
import { useToast } from '@/composables';
const { toast } = useToast();

toast({ type: 'success', message: 'Changes saved.' });
toast({ type: 'error', message: 'Could not save. Try again.' });
toast({ type: 'info', message: 'Session expires in 5 minutes.' });
toast({ type: 'warning', message: 'Some fields are incomplete.' });
```

---

## 9. Key Conventions Checklist

When translating a Figma design to code, verify:

- [ ] Used `<script setup lang="ts">` with typed props/emits
- [ ] Used `CommonContent` + `CommonHeader` for page structure
- [ ] Used `CommonForm` + `CommonFormField` for all form fields
- [ ] Used `useForm()` from Inertia for form state
- [ ] Used `CommonButton` (not legacy button components)
- [ ] Used `CommonIcon` with Iconify format strings
- [ ] Used Tailwind utility classes (no inline styles)
- [ ] Applied mobile-first responsive design
- [ ] Used `space-y-4` between form fields, `space-y-6` between cards
- [ ] Used `gap-3` between buttons, `gap-2` between icon buttons
- [ ] Added loading states for async actions (`loading` prop)
- [ ] Added empty states for tables and cards
- [ ] Added skeleton loading for deferred props
- [ ] Used semantic colours (`action-variant`) not raw colours on buttons
- [ ] Used `route()` helper for all links (Ziggy named routes)
