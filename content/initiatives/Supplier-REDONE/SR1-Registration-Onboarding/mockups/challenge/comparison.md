---
title: "Design Challenge Comparison: SR1 Registration & Onboarding"
---

# Design Challenge Comparison

## Registration (Screen 1)

| Aspect | Wizard Wayne | Gamified Gina | Mobile Mo | Split-Panel Sam |
|--------|-------------|---------------|-----------|-----------------|
| **ABN Entry** | Centered card, standard input with auto-format | Animated input with "Let's get started!" header, progress ring at 0% | Full-width, large input, numeric keypad hint | Left: welcome + benefits. Right: ABN form |
| **Business Name Dropdown** | Standard select below ABN field | Animated reveal with checkmark on match | Bottom sheet overlay on mobile | Inline in right panel, left updates with org info |
| **Duplicate Warning** | Alert banner below ABN | Warning with friendly tone | Full-screen overlay with clear CTA | Warning in right panel, left shows existing org |
| **Layout** | Single centered card on gray bg | Single card with progress elements | Edge-to-edge, no card borders | Two-panel: context left, form right |

## Onboarding Progress (Screen 2)

| Aspect | Wizard Wayne | Gamified Gina | Mobile Mo | Split-Panel Sam |
|--------|-------------|---------------|-----------|-----------------|
| **Desktop Progress** | Vertical sidebar with step list and checkmarks | Circular progress ring (20%), step cards with badges | Horizontal pill bar at top | Persistent left panel with steps + context summary |
| **Mobile Progress** | Horizontal numbered stepper | Top progress bar with %, dots below | Bottom tab bar with step icons | Collapsible left panel, horizontal stepper fallback |
| **Current Step** | Teal highlight + ring animation | Glowing border + percentage | Bold icon in bottom bar | Teal left border + expanded description |
| **Completed Step** | Green checkmark + solid line | Green check + micro-animation + XP badge | Filled icon in bottom bar | Green check + data summary |

## Locations Management (Screen 3)

| Aspect | Wizard Wayne | Gamified Gina | Mobile Mo | Split-Panel Sam |
|--------|-------------|---------------|-----------|-----------------|
| **Location List** | Stacked cards with edit/remove | Cards with celebration, count badge | Swipeable cards, large touch targets | Left: minimap + list. Right: add/edit form |
| **Add Location** | Modal with address autocomplete | Slide-up form with encouragement | Full-screen form, bottom save | Right panel transitions to add form |
| **Empty State** | Illustration + "Add first location" | Animated "Let's add your first spot!" | Card with large "+" icon | Left: "No locations yet". Right: auto-shown form |

## Document Upload (Screen 4)

| Aspect | Wizard Wayne | Gamified Gina | Mobile Mo | Split-Panel Sam |
|--------|-------------|---------------|-----------|-----------------|
| **Grouping** | Accordion: "Organisation" and "Service" docs | Checklist with progress bar per group | Card-based checklist, tappable cards | Left: checklist with status. Right: upload + preview |
| **Upload** | Click-to-browse per document | Drag zone with animated indicator | Large tap target, system file picker | Right panel drag-drop, left updates live |
| **Rejected** | Inline red alert + "Re-upload" | Friendly "Oops!" + fix instructions | Red card with re-upload button | Left: red badge. Right: reason + re-upload |

## Verification Dashboard (Screen 5)

| Aspect | Wizard Wayne | Gamified Gina | Mobile Mo | Split-Panel Sam |
|--------|-------------|---------------|-----------|-----------------|
| **Status** | Hero card with 3-column grid | "Almost verified!" banner, progress to 100% | Stacked full-width cards with traffic light | Left: timeline. Right: details + preview |
| **EFTSure** | Three colored dots with labels | Animated bar through 3 stages | Large traffic light, color-coded bg | Timeline dots in left, detail in right |
| **Read-Only Preview** | Grid of preview cards | Cards with lock icon | Tabbed preview, swipe sections | Left: nav. Right: preview with read-only badge |

## Add Supplier Entity (Screen 6)

| Aspect | Wizard Wayne | Gamified Gina | Mobile Mo | Split-Panel Sam |
|--------|-------------|---------------|-----------|-----------------|
| **Entity List** | Card grid with status badges | Cards with completion rings | Horizontal scrollable cards | Left: entity list. Right: details or add form |
| **Add Flow** | Button opens modal | Animated slide-up | Full-screen form, bottom CTA | Right panel transitions to add form |
| **Entity Status** | Badge: green/teal with step count | Progress ring per entity | Color-coded card headers | Status column in left panel |

## Overall Recommendation

| Pattern | Source | Why |
|---------|--------|-----|
| Vertical sidebar progress (desktop) | Wayne / Sam | Industry standard, clear overview |
| Percentage completion display | Gina | Drives motivation to finish |
| Bottom-anchored CTAs (mobile) | Mo | Thumb-zone optimised |
| Context summary in progress panel | Sam | Shows entered data, reduces anxiety |
| Card-per-document uploads | Mo | Tappable, scannable, all devices |
| Progress bar per document group | Gina | Clear upload completion signal |
| EFTSure timeline | Sam | Shows journey, not just state |
| Horizontal entity cards (mobile) | Mo | Native-feeling scroll |
