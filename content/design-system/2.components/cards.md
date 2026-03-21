---
title: "Cards"
description: "Card components — general cards, action cards, KPI cards, empty states, and hover cards"
---

# Cards

Cards are defined in the [Figma Cards page](https://www.figma.com/design/ojTCI9yefnl9ORYEVrv2WJ/Trilogy-Care-Design-System?node-id=1295-8554) and implemented as a family of `CommonCard*` and `CommonActionCard` components.

## Card Types

| Type | Component | Description |
|---|---|---|
| General Card | `CommonCard.vue` | Standard content container with optional header/footer |
| Action Card | `CommonActionCard.vue` | Interactive card with icon, text, and action buttons |
| KPI Card | `CommonKpiCard.vue` | Dashboard metric display with stats and trends |
| Empty State | `CommonCardEmptyState.vue` | Placeholder for zero-data states |
| Select Card | `CommonSelectCard.vue` | Selectable/toggleable card |
| Profile Card | `CommonProfileCard.vue` | User profile display |

## General Card (`CommonCard`)

The base card component used throughout the portal.

**Component:** `resources/js/Components/Common/CommonCard.vue`
**Storybook:** `stories/Common/Card/CommonCard.stories.js`

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `variant` | `'default' \| 'soft'` | `'default'` | Card style |
| `border` | `boolean` | `true` | Show border |
| `title` | `string` | — | Header title text |
| `subtitle` | `string` | — | Header subtitle text |
| `headerBg` | `string` | — | Header background colour (e.g., `'blue'`, `'red'`) |

### Variants

| Variant | Background | Shadow | Usage |
|---|---|---|---|
| `default` | White (`bg-white`) | `shadow-sm` | Standard content cards |
| `soft` | Grey (`bg-gray-50`) | None | Subtle/nested cards |

### Slots

| Slot | Description |
|---|---|
| `header` | Custom header content (overrides title/subtitle) |
| `default` | Main card body |
| `footer` | Card footer (uses `CommonCardFooter` styling) |

### Usage

```vue
<CommonCard title="Patient Details" subtitle="Personal information">
    <p>Card content here</p>
    <template #footer>
        <CommonButton label="Save" />
    </template>
</CommonCard>
```

## Action Card (`CommonActionCard`)

Interactive cards with icon badge, title, description, and action buttons. Used for entity selection (recipients, suppliers, services).

**Component:** `resources/js/Components/Common/CommonActionCard.vue`
**Storybook:** `stories/Common/Card/CommonActionCard.stories.js`

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `action` | `object` | — | Card data: `icon`, `title`, `description`, `buttonActions[]` |
| `cardVariant` | `string` | `'soft'` | Card background variant |
| `emphasis` | `boolean` | `false` | Show left emphasis bar |
| `size` | `'base' \| 'lg'` | `'base'` | Card size |
| `flex` | `'col' \| 'row'` | `'col'` | Layout direction |

### Figma Variants

The Figma file defines action cards across two dimensions:

**Layout:**
| Type | Dimensions | Description |
|---|---|---|
| Row | Full width, 74-80px height | Horizontal: icon + text + actions |
| Column | ~311px wide, ~179-194px height | Vertical stack: icon → text → actions |

**Colour:**
| Colour | Background | Usage |
|---|---|---|
| Grey (Default) | `bg-gray-50` | Standard on white page backgrounds |
| White | `bg-white` | Use on grey/coloured backgrounds |

**Sizes (v2):**
| Size | Row Height | Column Height |
|---|---|---|
| Base | 74px | 179px |
| LG | 80px | 194px |

**Action patterns:**
- Single Action — one button (e.g., "Select", "Change")
- Two Actions — two buttons (e.g., "Edit" + "Remove")
- No Actions — display-only (selected/confirmed state)
- Emphasis — left coloured bar for visual weight

### Usage Patterns (from Figma)

| Context | Unselected | Selected (editable) | Selected (read-only) |
|---|---|---|---|
| Recipient | Icon + "None selected" + Select btn | Icon + Name + Badges + Change btn | Icon + Name + Badges (no btn) |
| Supplier | Icon + "None selected" + Select btn | Icon + Name + Badges + Change btn | Icon + Name + Badges (no btn) |
| Service | Icon + Category + Type + Select btn | Icon + Category + Types + Change btn | Icon + Category + Types (no btn) |

## KPI Card (`CommonKpiCard`)

Dashboard metric cards showing key performance indicators.

**Component:** `resources/js/Components/Common/CommonKpiCard.vue`
**Storybook:** `stories/Common/CommonKpiCard.stories.js`

### Figma Variants

**Colour:**
| Colour | Usage |
|---|---|
| Default (Teal) | Primary KPI cards |
| Grey | Secondary/neutral metrics |

**Content patterns:**
| Pattern | Description |
|---|---|
| Default — No stats | Simple value display with icon |
| Default — Has stats | Value + trend indicator |
| Monetary Value | Dollar amount formatting |
| Large numbers | Abbreviated formatting (10K+) |
| Fractioned/Target | Value of total (e.g., "45 of 100") |

**Time period indicators:**
- Last 30 days, Previous week, Previous month, Previous quarter, Year-on-year
- Each with +/- percentage change indicator

**Sizes:**
| With icon | Without icon |
|---|---|
| ~153px height | ~71-101px height |

## Empty State (`CommonCardEmptyState`)

Placeholder content shown when a card or section has no data.

**Component:** `resources/js/Components/Common/CommonCardEmptyState.vue`
**Storybook:** `stories/Common/Card/CommonCardEmptyState.stories.js`

### Figma Variants

| Device | Width | Description |
|---|---|---|
| Desktop | 390px | Illustration + heading + description + optional CTA |
| Mobile | 231px | Compact version of the same pattern |

### Anatomy

1. Illustration (optional)
2. Heading text
3. Description text
4. Action button (optional)

## Card Footer (`CommonCardFooter`)

Standardised footer section for cards with consistent padding and border.

**Component:** `resources/js/Components/Common/CommonCardFooter.vue`
**Storybook:** `stories/Common/Card/CommonCardFooter.stories.js`

## HoverCard

HoverCards are floating content cards that appear on hover to provide additional context about an item. They are defined in the [Figma HoverCard page](https://www.figma.com/design/ojTCI9yefnl9ORYEVrv2WJ/Trilogy-Care-Design-System?node-id=2101-1673).

**Components:** `resources/js/Components/Common/hover/CommonTooltip.vue`, `resources/js/Components/Common/hover/CommonHover.vue`

HoverCards are built on [Reka UI](https://reka-ui.com/) (Radix Vue) tooltip primitives. Use sparingly — only when additional context genuinely helps the user without requiring a click.

### Directions

HoverCards support four placement directions via a caret/arrow indicator:

| Direction | Description |
|---|---|
| `top` | Card appears above the trigger, arrow points down |
| `bottom` | Card appears below the trigger, arrow points up |
| `left` | Card appears left of the trigger, arrow points right |
| `right` | Card appears right of the trigger, arrow points left |

### Content Types

Three content layout patterns are defined in Figma:

| Type | Description | Use Case |
|---|---|---|
| **Basic** | Heading + subheading + body text | Simple contextual info |
| **Definition List** | Heading + subheading + list of label/value pairs | Structured data (e.g. patient details, dates) |
| **Icon List** | Heading + subheading + list of icon + label rows | Feature lists, service categories |

### Extended HoverCard

An extended variant adds a status indicator (checkmark icon), badge, and longer definition list content. This is used for richer entity previews (e.g. hovering over a recipient name to see their profile summary).

### Components

| Component | Style | Use Case |
|---|---|---|
| `CommonTooltip` | Dark background (`bg-dark`) | Short helper text, icon labels |
| `CommonHover` | Light background (white with shadow) | Rich content previews, entity details |

### Usage

```vue
<!-- Simple tooltip -->
<CommonTooltip content="Edit this record" position="top">
    <CommonButton leading-icon="heroicons:pencil" variant="ghost" />
</CommonTooltip>

<!-- Rich hover card -->
<CommonHover position="bottom">
    <template #trigger>
        <span class="cursor-pointer underline">John Smith</span>
    </template>
    <template #content>
        <div>
            <p class="font-bold">John Smith</p>
            <p class="text-sm text-gray-500">Recipient</p>
            <div class="mt-2 space-y-1 text-sm">
                <p><span class="text-gray-400">Package:</span> Level 4</p>
                <p><span class="text-gray-400">Status:</span> Active</p>
            </div>
        </div>
    </template>
</CommonHover>
```

## Do / Don't

| | Guidance |
|---|---|
| ✅ Do | Use `variant="default"` (white) for primary content cards |
| ❌ Don't | Use `variant="soft"` (grey) for top-level cards — it's for nested/secondary cards |
| ✅ Do | Use `CommonCardEmptyState` when a card has no data to display |
| ❌ Don't | Show a blank card body — always provide empty state messaging |
| ✅ Do | Use `CommonActionCard` with `flex="row"` for list-style entity selections |
| ❌ Don't | Build custom selection cards — use the existing `CommonActionCard` or `CommonSelectCard` |
| ✅ Do | Use `CommonKpiCard` for dashboard metrics with trend indicators |
| ❌ Don't | Put KPI data inside a `CommonCard` — use the purpose-built KPI component |
| ✅ Do | Use `CommonCardFooter` for card action buttons — it provides consistent border and padding |
| ❌ Don't | Add custom padding/border to card footers — use the standardised component |
| ✅ Do | Use `CommonHover` for rich entity previews on hover (names, links) |
| ❌ Don't | Use `CommonTooltip` for multi-line content — tooltips are for short helper text only |
