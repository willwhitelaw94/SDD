---
title: "Design System"
description: "Trilogy Care Portal design foundations — colours, typography, spacing, and brand guidelines"
icon: i-heroicons-swatch
---

# Design System

The TC Portal Design System defines the visual foundations used across the application. This documentation mirrors the [Figma Design System](https://www.figma.com/design/ojTCI9yefnl9ORYEVrv2WJ/Trilogy-Care-Design-System) and maps directly to the Tailwind CSS configuration in `tailwind.config.js`.

## Foundations

Design tokens and visual primitives that underpin every component.

| Foundation | What it covers | Tailwind Config |
|---|---|---|
| [Colours](/design-system/foundations/colours) | Palettes, semantic tokens, usage | `theme.colors` |
| [Typography](/design-system/foundations/typography) | Font family, sizes, weights, headings | `theme.extend.fontFamily` |
| [Logos](/design-system/foundations/logos) | Brand marks, variants, brand colours | — |
| [Shadows & Radius](/design-system/foundations/shadows-and-radius) | Elevation levels, corner radius scale | `theme.extend.borderRadius` |
| [Breakpoints](/design-system/foundations/breakpoints) | Responsive grid, screen sizes | Tailwind defaults |

## Figma Source

All foundations are maintained in Figma and synced here for AI and developer reference.

**File:** [Trilogy Care Design System](https://www.figma.com/design/ojTCI9yefnl9ORYEVrv2WJ/Trilogy-Care-Design-System)

## Components

Reusable UI building blocks documented with Figma source and implementation details.

| Component | What it covers | Vue Component |
|---|---|---|
| [Buttons](/design-system/components/buttons) | Variants, sizes, states, icon buttons | `CommonButton.vue` |
| [Forms](/design-system/components/forms) | Input components, layout patterns, spacing | `CommonInput.vue`, `CommonSelectMenu.vue`, etc. |
| [Cards](/design-system/components/cards) | General, action, KPI, empty state cards | `CommonCard.vue`, `CommonActionCard.vue` |
| [Tables](/design-system/components/tables) | Columns, sorting, filtering, pagination, actions | `CommonTable.vue` |
| [Tabs](/design-system/components/tabs) | Tab navigation sizes, states, patterns | — |

## Component Library (Storybook)

For interactive component documentation, see the project's **Storybook** (`stories/` directory, 65+ components). Components are documented as living code rather than static docs — run `npm run storybook` to browse.
