---
title: "Accordion"
description: "Collapsible content sections for progressive disclosure"
---

# Accordion

Accordions are defined in the [Figma Accordion page](https://www.figma.com/design/ojTCI9yefnl9ORYEVrv2WJ/Trilogy-Care-Design-System?node-id=1738-4170). For storing additional information that doesn't need to be immediately seen and read but can be easily accessed.

**Component:** `resources/js/Components/Common/CommonAccordion.vue`
**Storybook:** `stories/Common/CommonAccordion.stories.js`
**Library:** [Reka UI](https://reka-ui.com/) accordion primitives

## Variants

Two background variants control the visual hierarchy:

| Variant | Figma Name | Background | Hover | Usage |
|---|---|---|---|---|
| `default` | White | White (`bg-white`) | `bg-gray-50` | Standard content sections |
| `gray` | Grey | Light grey (`bg-gray-50`) | `bg-gray-100` | Grouped within grey containers |

## States

Each accordion item supports the following states:

| State | Description | Visual |
|---|---|---|
| **Collapsed** | Default, content hidden | Label + chevron pointing down |
| **Hover** | Mouse over trigger | Background highlight (variant-dependent) |
| **Expanded** | Content visible | Chevron rotated 180°, content slides down |
| **Focus** | Keyboard focus within item | Elevated z-index with relative positioning |

## Anatomy

Each accordion item consists of:

1. **Leading icon** — `heroicons:home` (20x20, `text-gray-600`)
2. **Label text** — Item title, `text-sm`
3. **Chevron indicator** — `heroicons:chevron-down` (20x20, `text-gray-600`), rotates 180° on expand
4. **Content area** — Named slot, slides open/closed with animation

### Structure

```
┌─────────────────────────────────┐
│  🏠  Item label              ▼  │  ← Trigger (45px height)
├─────────────────────────────────┤
│  Slot content                   │  ← Expandable content (animated)
├─────────────────────────────────┤
│  🏠  Item label              ▼  │  ← Next item (collapsed)
├─────────────────────────────────┤
│  🏠  Item label              ▼  │  ← Next item (collapsed)
└─────────────────────────────────┘
```

Items share borders — first item gets `rounded-t-md`, last item gets `rounded-b-md`.

## Behaviour

- **Single expand** — Only one item can be open at a time (`type="single"`)
- **Collapsible** — The open item can be collapsed by clicking it again
- **Animated** — Content uses `slideDown`/`slideUp` CSS animations via `data-[state]` attributes
- **Accessible** — Built on Reka UI accordion primitives with proper ARIA roles

## Animation

Accordion animations are defined in `tailwind.config.js`:

| Animation | Direction | Duration | Easing |
|---|---|---|---|
| `slideDown` | Open | 300ms | `cubic-bezier(0.87, 0, 0.13, 1)` |
| `slideUp` | Close | 300ms | `cubic-bezier(0.87, 0, 0.13, 1)` |

These use the `--radix-accordion-content-height` CSS variable auto-injected by Reka UI.

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `items` | `AccordionItem[]` | Required | Array of `{ id: string, title: string }` objects |
| `variant` | `'default' \| 'gray'` | `'default'` | Background colour variant |
| `defaultItem` | `string` | `undefined` | ID of the item to expand on mount |

## Slots

Each item exposes a **named slot** matching its `id`. Place any content inside the slot:

```vue
<CommonAccordion :items="items">
    <template #item-1>
        <p>Content for the first item</p>
    </template>
    <template #item-2>
        <p>Content for the second item</p>
    </template>
</CommonAccordion>
```

## Usage Examples

```vue
<!-- Default variant -->
<CommonAccordion
    :items="[
        { id: 'about', title: 'About this service' },
        { id: 'pricing', title: 'Pricing details' },
        { id: 'faq', title: 'Frequently asked questions' },
    ]"
>
    <template #about>
        <p>Service description content here.</p>
    </template>
    <template #pricing>
        <p>Pricing breakdown content here.</p>
    </template>
    <template #faq>
        <p>FAQ answers here.</p>
    </template>
</CommonAccordion>

<!-- Grey variant with default open item -->
<CommonAccordion
    :items="faqItems"
    variant="gray"
    default-item="first-question"
>
    <template #first-question>
        <p>Answer to the first question.</p>
    </template>
</CommonAccordion>
```

## Usage Guidelines

- Use for secondary content that doesn't need to be visible by default
- Keep item titles short and descriptive
- Avoid nesting accordions inside accordions
- For fewer than 3 items, consider showing content inline instead
- For a single collapsible section, use `CommonCollapsible` instead
- The gray variant works well when the accordion sits inside a white card or panel
- Pre-expand the most important item using `defaultItem`
