---
title: "Avatars"
description: "Avatar and avatar group components for user representation"
---

# Avatars

Avatars display user profile images or initials as circular badges. Built on [Reka UI](https://reka-ui.com/) Avatar primitives.

**Component:** `resources/js/Components/Common/CommonAvatar.vue`

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `avatar` | `Avatar` | — | Avatar data object: `id`, `src`, `short_name`, `full_name` |
| `size` | `string` | `'base'` | Avatar size |
| `borderSize` | `string` | `'none'` | White border thickness |
| `colour` | `string` | `'blue'` | Background colour for initials fallback |

## Sizes

| Size | Dimensions | Text Size | Use Case |
|---|---|---|---|
| `xs` | 20x20px (`w-5 h-5`) | 10px | Compact lists, inline mentions |
| `sm` | 32x32px (`w-8 h-8`) | `text-sm` | Table rows, small cards |
| `base` | 40x40px (`w-10 h-10`) | `text-xl` | Default — cards, headers |
| `lg` | 56x56px (`w-14 h-14`) | `text-2xl` | Profile sections |
| `xl` | 64x64px (`w-16 h-16`) | `text-3xl` | Profile pages |
| `2xl` | 80x80px (`w-20 h-20`) | 40px | Hero profiles |
| `3xl` | 96x96px (`w-24 h-24`) | 56px | Full-page profile headers |

## Colours

Background colours for the initials fallback state:

| Colour | Classes |
|---|---|
| `gray` | `bg-gray-200 text-gray-800` |
| `blue` | `bg-blue-100 text-blue-800` |
| `green` | `bg-green-100 text-green-800` |
| `red` | `bg-red-100 text-red-800` |
| `yellow` | `bg-yellow-100 text-yellow-800` |
| `orange` | `bg-orange-100 text-orange-800` |
| `purple` | `bg-purple-100 text-purple-800` |
| `pink` | `bg-pink-100 text-pink-800` |
| `primary-blue` | `bg-primary-blue-100 text-primary-blue-800` |

## Border Sizes

Used when avatars overlap (e.g. in groups) to create visual separation:

| Size | Class |
|---|---|
| `none` | No border |
| `base` | `border-2 border-white` |
| `lg` | `border-4 border-white` |
| `xl` | `border-6 border-white` |

## Fallback Behaviour

When no `avatar.src` image is provided, the component displays the first two characters of `avatar.short_name` as uppercase initials on a coloured background.

## Avatar Group (`CommonAvatarGroup`)

Displays multiple avatars in a horizontally overlapping stack with negative spacing (`-space-x-5`). Each avatar shows the user's full name on hover via `CommonHover`.

**Component:** `resources/js/Components/Common/CommonAvatarGroup.vue`

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `avatars` | `Avatar[]` | — | Array of avatar data objects |
| `size` | `string` | `'base'` | Size applied to all avatars |

### Usage

```vue
<!-- Single avatar -->
<CommonAvatar :avatar="{ id: 1, src: '/photo.jpg', short_name: 'JS', full_name: 'John Smith' }" />

<!-- Initials fallback -->
<CommonAvatar :avatar="{ id: 2, short_name: 'AB', full_name: 'Alice Brown' }" colour="green" size="lg" />

<!-- Avatar group -->
<CommonAvatarGroup :avatars="teamMembers" size="sm" />
```

## When to Use

| Scenario | Component | Size |
|---|---|---|
| Table row with user name | `CommonAvatar` | `sm` (32px) |
| Card header or sidebar | `CommonAvatar` | `base` (40px) |
| Profile detail page | `CommonAvatar` | `xl` or `2xl` |
| Show multiple assignees | `CommonAvatarGroup` | `sm` or `base` |
| Inline mention or tag | `CommonAvatar` | `xs` (20px) |

## Do / Don't

| | Guidance |
|---|---|
| ✅ Do | Always provide `short_name` for initials fallback when images may not load |
| ❌ Don't | Use `CommonAvatar` for non-user entities (companies, services) — use `CommonIcon` instead |
| ✅ Do | Use `CommonAvatarGroup` when showing 2+ users in the same context |
| ❌ Don't | Render individual avatars with manual negative margins — use the group component |
| ✅ Do | Use consistent avatar sizes within the same UI region |
| ❌ Don't | Mix `sm` and `lg` avatars in the same list or table |
