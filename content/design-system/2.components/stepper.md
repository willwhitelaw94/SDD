---
title: "Stepper"
description: "Multi-step navigation for portal forms and onboarding flows"
icon: "heroicons:bars-3-bottom-left"
---

# Stepper

The stepper is defined in the [Figma Stepper page](https://www.figma.com/design/ojTCI9yefnl9ORYEVrv2WJ/Trilogy-Care-Design-System?node-id=1404-10676) and implemented as `CommonStepNavigation.vue`. It is designed _"for use on portal related multi-step forms"_ — supplier onboarding, invoice submission, and lead management.

**Component:** `resources/js/Components/Common/CommonStepNavigation.vue`
**Storybook:** `stories/Common/CommonStepNavigation.stories.js`

---

## Figma Specification

### Stepper Item

The atomic unit — a single step within the stepper bar. Each item displays a step number (`text-xs`) and a title label (`text-sm font-semibold`).

**Stages** — three visual stages based on step progress:

| Stage | Top Border | Step Label | Title | Check Icon | Description |
|---|---|---|---|---|---|
| **Default** | `#F2F2F2` (gray-100) | `text-gray-500` | `text-black font-semibold` | — | Unvisited future step |
| **Current** | `#007F7E` (teal-700) | `text-teal-700 font-semibold` | `text-black font-semibold` | — | Active step |
| **Done** | `#43C0BE` (teal-500) | `text-gray-500` | `text-black font-semibold` | `heroicons:check` (teal) | Completed step |

**States** — three interaction states per stage:

| State | Visual Change |
|---|---|
| **Default** | Base styling per stage |
| **Hover** | `bg-gray-50` background tint, `text-teal-600` on hover |
| **Focus** | `border border-teal-700 rounded` focus ring (4px padding) |

**Dimensions:**
- Width: `190px` per item (flexible within container)
- Padding: `px-4 pt-4 pb-2.5`
- Top border: `4px` solid (colour varies by stage)

### Done Stage — Check Icon Variants

The Figma "In use" example shows two patterns for completed steps:

| Pattern | Description | When Used |
|---|---|---|
| **Inline check** | Small check icon next to "Step N" label | When completed but step number still visible |
| **Leading check** | Larger 24px check icon replacing step number | Alternative layout for strongly confirmed steps |

### Onboarding Stepper (Composed)

The full composed stepper bar — a horizontal row of stepper items inside a white container.

| Property | Figma Token | Tailwind |
|---|---|---|
| Background | White | `bg-white` |
| Bottom border | `--border-page` (#DBDBDB) | `border-b border-gray-200` |
| Horizontal padding | `--gap/8` (32px) | `px-8` |
| Vertical padding | `--gap/2` (8px) | `py-2` |
| Item gap | 12px | `gap-3` |
| Alignment | Centre | `justify-center` |

**Responsive behaviour** (Figma viewport groups):

| Viewport | Width | Behaviour |
|---|---|---|
| Large | 1435px+ | All steps visible in a single row |
| Medium | ~774px | Steps overflow, horizontal scroll reveals remaining |
| Small | ~282px | Only 1-2 steps visible, scroll to discover the rest |

---

## Component Implementation

Built on **Reka UI** primitives (`TabsRoot`, `TabsList`, `TabsTrigger`, `TabsIndicator`) wrapped in a `ScrollArea` for responsive horizontal overflow.

### Props

| Prop | Type | Description |
|---|---|---|
| `steps` | `Step[]` | Array of step objects defining the navigation |

### Step Interface

```ts
interface Step {
    id: number;        // Unique identifier, displayed as "Step {id}"
    label: string;     // Step title text
    status?: string;   // 'current' | 'upcoming' | 'complete' | undefined
    completed?: boolean; // Shows check circle icon when true
    href?: string;     // If provided, navigates via Inertia router.visit()
}
```

### Status State Machine

The `status` property drives both visual appearance and interactivity:

```
Status Value      → Figma Stage   → Interactive   → Visual Effect
─────────────────────────────────────────────────────────────────
'current'         → Current        → Yes (active)  → Teal-700 bottom indicator bar, teal step label
'complete'        → Done           → Yes (click)   → Gray text, check icon if completed: true
'upcoming'        → Default        → No (disabled) → Gray-300 label, gray-400 title, pointer-events-none
undefined         → Default        → Yes (always)  → Standard default styling, always navigable
```

The `undefined` status is **intentionally different** from `'upcoming'` — it represents a step that is accessible but not yet completed. This is critical for validation-gated flows where a step becomes clickable after the previous step passes validation, but before the user has visited it.

### Events

| Event | Payload | Description |
|---|---|---|
| `step-click` | `stepId: number` | Emitted when any enabled step is clicked |

### Active Indicator

The current step is highlighted with a sliding bottom bar:
- Colour: `bg-teal-700`
- Height: `h-1` (4px)
- Corners: `rounded-full`
- Position: `bottom-0`, translated to match active tab
- Animation: `transition-[width,transform] duration-300`

---

## Navigation Modes

### Backend-Persisted Steps

Each step has an `href` pointing to a server route. Clicking triggers `router.visit()`. The server tracks progress (e.g., `bill.current_form_step`) and the page re-renders with the updated step.

Used by: **Bill submission** (Supplier, Care Coordinator, Recipient), **Lead management**

```vue
<script setup>
const props = defineProps({ bill: Object, supplier: Object, step: Number });

const lastCompletedStep = computed(() => props.bill.current_form_step - 1);

const steps = computed(() => [
    {
        id: 1,
        label: 'Invoice Details',
        status: props.step === 1 ? 'current' : lastCompletedStep.value > 0 ? 'complete' : 'upcoming',
        href: route('suppliers.bills.edit', { supplier: props.supplier.id, bill: props.bill.id, step: 1 }),
        completed: lastCompletedStep.value > 0,
    },
    {
        id: 2,
        label: 'Invoice Line Items',
        status: props.step === 2 ? 'current' : lastCompletedStep.value > 1 ? 'complete' : 'upcoming',
        href: route('suppliers.bills.edit', { supplier: props.supplier.id, bill: props.bill.id, step: 2 }),
        completed: lastCompletedStep.value > 1,
    },
    {
        id: 3,
        label: 'Review Details',
        status: props.step === 3 ? 'current' : lastCompletedStep.value > 2 ? 'complete' : 'upcoming',
        href: route('suppliers.bills.edit', { supplier: props.supplier.id, bill: props.bill.id, step: 3 }),
        completed: lastCompletedStep.value > 2,
    },
]);
</script>

<template>
    <CommonStepNavigation :steps="steps" />
</template>
```

### Frontend-Only Steps (Modal / Drawer)

No `href` — step changes are handled client-side via `@step-click`. Used when the stepper lives inside a modal or drawer where page navigation would break the flow.

Used by: **Add Supplier Drawer** (4-step supplier creation with async validation)

```vue
<script setup>
const currentStep = ref(1);

// Each step has a validation gate
const isAbnChecked = ref(false);
const isBankDetailChecked = ref(false);

const canProceedToStep2 = computed(() => form.abn?.trim() && isAbnChecked.value);
const canProceedToStep3 = computed(() => canProceedToStep2.value && isBankDetailChecked.value);

const steps = computed(() => [
    {
        id: 1,
        label: 'Validate ABN',
        status: currentStep.value > 1 ? 'complete' : currentStep.value === 1 ? 'current' : 'upcoming',
        completed: currentStep.value > 1,
    },
    {
        id: 2,
        label: 'Validate Bank Details',
        // undefined (not 'upcoming') when validation passes — clickable but not yet complete
        status: currentStep.value > 2 ? 'complete' : currentStep.value === 2 ? 'current'
            : canProceedToStep2.value ? undefined : 'upcoming',
    },
    {
        id: 3,
        label: 'Business Information',
        status: currentStep.value > 3 ? 'complete' : currentStep.value === 3 ? 'current'
            : canProceedToStep3.value ? undefined : 'upcoming',
    },
    {
        id: 4,
        label: 'Contact Information',
        status: currentStep.value === 4 ? 'current' : 'upcoming',
    },
]);

const handleStepClick = (stepId) => {
    if (stepId === 2 && !canProceedToStep2.value) return;
    if (stepId === 3 && !canProceedToStep3.value) return;
    currentStep.value = stepId;
};
</script>

<template>
    <CommonStepNavigation :steps="steps" @step-click="handleStepClick" />
</template>
```

### Dynamic Steps (Conditional)

Step count varies based on context. Steps are added or removed from the array dynamically.

Used by: **Lead Edit Form** (2 steps for new leads, up to 6 for existing leads)

```vue
<script setup>
const steps = computed(() => {
    const base = [
        { id: 1, label: 'Aged Care Details', status: ..., completed: lead.aged_care_support_stage?.is_complete },
        { id: 2, label: 'Recipient Details', status: ..., completed: lead.recipient_stage?.is_complete },
    ];

    if (leadType !== 'new') {
        base.push(
            { id: 3, label: 'Living Situation', ... },
            { id: 4, label: 'Support Needs', ... },
            { id: 5, label: 'Cultural Background', ... },
            { id: 6, label: 'Management Options', ... },
        );
    }

    return base;
});
</script>
```

---

## Usage Across the Portal

| Flow | Steps | Navigation | Status Source | Context |
|---|---|---|---|---|
| **Supplier Bill Submission** | 3 (Details → Line Items → Review) | Backend (`href`) | `bill.current_form_step` | Full-page form |
| **Care Coordinator Bill Submission** | 3 (same as supplier) | Backend (`href`) | `bill.current_form_step` | Full-page form |
| **Recipient Bill Submission** | 3 (same as supplier) | Backend (`href`) | `bill.current_form_step` | Layout wrapper |
| **Add Supplier Drawer** | 4 (ABN → Bank → Business → Contact) | Frontend (`step-click`) | Client-side refs | Inside `CommonModal` |
| **Lead Management** | 2–6 (dynamic based on lead type) | Backend (`href`) | `lead.*.is_complete` | Full-page form |

---

## Patterns & Best Practices

### Status Computation Formula

The standard pattern for computing step status from a numeric step index:

```js
const getStepStatus = (stepId, currentStep, lastCompletedStep) => {
    if (stepId === currentStep) return 'current';
    if (stepId <= lastCompletedStep) return 'complete';
    return 'upcoming';
};
```

### Validation Gating

For frontend-only steps, gate navigation with computed booleans:

```
Step 1 validates → canProceedToStep2 = true → Step 2 status changes from 'upcoming' to undefined
User clicks Step 2 → handleStepClick checks canProceedToStep2 → allows navigation
```

This two-layer approach means:
1. **Visual layer** — `status: undefined` makes the step appear clickable (not greyed out)
2. **Logic layer** — `handleStepClick` still validates before allowing the transition

### Form Reset Cascading

When a previous step's data changes, reset all downstream validation state:

```js
const handleAbnKeyup = () => {
    isAbnChecked.value = false;        // Reset current step validation
    isBankDetailChecked.value = false;  // Reset downstream steps
    form.reset('legal_trading_name', 'business_name');
};
```

### Step Content Rendering

Each step typically renders a different form component. Two patterns exist:

**Conditional visibility (frontend-only):**
```vue
<div :class="currentStep === 1 ? 'block' : 'hidden'">
    <StepOneForm />
</div>
<div :class="currentStep === 2 ? 'block' : 'hidden'">
    <StepTwoForm />
</div>
```

**Route-based (backend-persisted):**
```vue
<!-- Each step is a separate Inertia page visit -->
<!-- Step 1: /suppliers/{id}/bills/{bill}/edit?step=1 → renders BillDetails -->
<!-- Step 2: /suppliers/{id}/bills/{bill}/edit?step=2 → renders BillLineItemList -->
<!-- Step 3: /suppliers/{id}/bills/{bill}/edit?step=3 → renders BillReview -->
```

---

## Design Guidelines

### When to Use

- Multi-step forms (3+ steps) where users benefit from seeing overall progress
- Onboarding flows with sequential validation gates
- Processes where users may need to revisit and edit previous steps

### When Not to Use

- Simple 2-step flows — use a single "Back" button instead
- Non-linear processes where any section can be accessed — use tabs (`CommonTabs`)
- Progress indication without navigation — use `CommonProgress` bar
- Wizard-style flows where going back is not allowed — consider a simpler "Step X of Y" text indicator

### Placement

| Context | Position | Width |
|---|---|---|
| Full-page form | Below page header, above content | Full viewport width |
| Modal / Drawer | Top of modal body | Constrained to modal width |
| Layout wrapper | Inside shared layout component | Inherited from parent |

### Accessibility

- Built on Reka UI `Tabs` primitives with proper ARIA `tab`, `tablist`, `tabpanel` roles
- `aria-label="Progress"` on the `<nav>` container
- Keyboard navigation via Tab and Arrow keys between steps
- Disabled steps (`'upcoming'`) are excluded from tab order
- Horizontal `ScrollArea` enables touch scrolling on narrow viewports
- Focus ring matches Figma spec: `border border-teal-700 rounded`

### Token Reference

| Design Token | Figma Variable | Value | Tailwind |
|---|---|---|---|
| Step label (default) | `--secondary-text` | `#666666` | `text-gray-500` |
| Step label (current) | `--primary-teal` | `#007F7E` | `text-teal-700` |
| Step label (upcoming) | — | `#D1D5DB` | `text-gray-300` |
| Top border (default) | `Main/Grey/100` | `#F2F2F2` | `border-gray-100` |
| Top border (current) | `Main/Teal/700` | `#007F7E` | `border-teal-700` |
| Top border (done) | `Main/Teal/500` | `#43C0BE` | `border-teal-500` |
| Container border | `--border-page` | `#DBDBDB` | `border-gray-200` |
| Hover background | — | `#F9FAFB` | `bg-gray-50` |
| Check icon | `Main/Teal/700` | `#007F7E` | `text-teal-700` |
| Active indicator | `Main/Teal/700` | `#007F7E` | `bg-teal-700` |

---

## Related Components

| Component | Relationship |
|---|---|
| `CommonProgress` | Linear progress bar — use for percentage-based progress without step navigation |
| `CommonTabs` | Tab navigation — use for non-linear, switchable content sections |
| `CommonModal` | Container for frontend-only stepper flows (e.g., Add Supplier Drawer) |
