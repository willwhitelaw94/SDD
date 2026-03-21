---
title: "Design Spec"
---


**Status:** Draft
**Created By:** AI Design Clarification
**Feature Spec:** [spec.md](./spec.md)
**Created:** 2025-12-21
**Last Updated:** 2025-12-21

---

## Design Resources

### LOOM Videos

| Title | Link | Description |
|-------|------|-------------|
| | | |

### Figma

| File | Link | Description |
|------|------|-------------|
| | | |

### Miro

| Board | Link | Description |
|-------|------|-------------|
| | | |

---

## Overview

A floating action bar that appears at the bottom of the viewport when table items are selected, providing quick access to bulk operations with clear selection visibility and organized action grouping.

## User Context

- **Primary User:** Operations/Admin Staff (power users managing large datasets)
- **Device Priority:** Desktop-primary
- **Usage Pattern:** Daily power-user workflows
- **Information Density:** Dense/efficient - staff need quick access, minimal clicks

## Layout & Structure

### Page Type
Overlay component on existing table pages - no page structure changes required.

### Floating Action Bar Layout

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              TABLE CONTENT                                   │
│                                                                             │
│  [☐] Row 1                                                                  │
│  [☑] Row 2  ←── selected rows have visual highlight                        │
│  [☑] Row 3                                                                  │
│  [☐] Row 4                                                                  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘

                    ↓ 16px gap from bottom of viewport ↓

┌─────────────────────────────────────────────────────────────────────────────┐
│  ✓ 12 selected  [Clear]  ────────────  [Add Tags] [Export] [More ▾]  [✕]   │
└─────────────────────────────────────────────────────────────────────────────┘
     ↑                                        ↑                          ↑
  Selection info                    Quick actions (table-specific)    Dismiss
```

### Bar Content Sections

**Left Side:**
- Checkmark icon + "X selected" count
- "Clear" text button to deselect all
- When all page items selected: "Select all Y items" link appears (cross-page selection)

**Right Side:**
- 2-3 Quick action buttons (table-specific, backend-defined)
- "More" dropdown for additional actions (grouped by category)
- "✕" dismiss button

### Cross-Page Selection State

When user selects all items on current page:
```
┌─────────────────────────────────────────────────────────────────────────────┐
│  ✓ All 25 selected · Select all 847 items  ────  [Add Tags] [More ▾]  [✕]  │
└─────────────────────────────────────────────────────────────────────────────┘
```

After clicking "Select all 847 items":
```
┌─────────────────────────────────────────────────────────────────────────────┐
│  ✓ All 847 items selected  [Clear]  ────────  [Add Tags] [More ▾]  [✕]     │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Component Inventory

### Existing Components (from Storybook/Codebase)
- `CommonButton` - for action buttons
- `CommonDropdown` (Reka UI) - for "More actions" menu
- `CommonConfirmDialog` - for destructive action confirmations
- `CommonToastContainer` / `CommonAlert` - for success/undo notifications
- `CommonTagGroup` - for tag display in selector
- `Icon` (Iconify) - for icons throughout

### New Components Needed
- [ ] `BulkActionBar.vue` - Main floating bar container
- [ ] `BulkActionTagSelector.vue` - Dropdown panel for tag multi-select
- [ ] `useBulkActions.ts` - Composable for selection state and action execution

### Pattern References
- Animation style: Like `CommonToastContainer` slide-in behavior
- Dropdown menus: Like existing `CommonTableAction.vue` dropdown
- Tag chips: Like `CommonTagGroup.vue` display

## Interaction Design

### Floating Bar Behavior
- **Appears:** When 1+ items selected (slide up from bottom, 200ms ease-out)
- **Disappears:** When selection cleared or ✕ clicked (slide down, 150ms ease-in)
- **Position:** Fixed to viewport bottom, 16px margin, centered, max-width matches table container
- **Z-index:** Above table, below modals

### Action Execution Flow

**Quick Actions (non-destructive):**
1. User clicks quick action button (e.g., "Add Tags")
2. Dropdown panel expands upward from button
3. User selects options, clicks "Apply"
4. Action executes, success toast appears
5. Bar remains (selection intact) or clears based on action type

**Destructive Actions (from "More" dropdown):**
1. User opens "More" dropdown
2. Clicks destructive action (red styling)
3. Confirmation dialog appears (using `CommonConfirmDialog`)
4. User confirms → action executes → toast with results
5. Selection clears, bar slides away

### "More Actions" Dropdown Structure

```
┌──────────────────────────┐
│  Tags                    │  ← Category header (muted)
│    ◉ Add Tags            │
│    ◉ Remove Tags         │
├──────────────────────────┤
│  Export                  │
│    ◉ Export to CSV       │
│    ◉ Export to PDF       │
├──────────────────────────┤  ← Separator before destructive
│  ⚠ Archive Selected      │  ← Red text, warning icon
│  ⚠ Delete Selected       │
└──────────────────────────┘
```

### Tag Selector Panel

Expands upward from "Add Tags" or "Remove Tags" button:

```
         ┌─────────────────────────────┐
         │  Select tags to add         │
         ├─────────────────────────────┤
         │  [☐] 🔴 Urgent              │
         │  [☑] 🟢 Approved            │
         │  [☐] 🔵 Review Needed       │
         │  [☑] 🟡 Priority            │
         ├─────────────────────────────┤
         │           [Apply]           │
         └─────────────────────────────┘
                      ↑
┌─────────────────────────────────────────────────────────────────────────────┐
│  ✓ 12 selected  ──────────────────  [Add Tags ▲] [Export] [More ▾]  [✕]    │
└─────────────────────────────────────────────────────────────────────────────┘
```

For "Remove Tags", show count per tag:
```
│  [☐] 🔴 Urgent (3 items)         │
│  [☑] 🟢 Approved (12 items)      │
```

## States

### Loading States
- **Action in progress:** Button shows spinner, other actions disabled
- **Bulk operation:** "Processing X of Y..." in bar (for large operations)

### Empty States
- **No tags available:** "No tags available for this type" message in selector
- **Remove Tags - no common tags:** "No tags to remove" message

### Success States
- Toast notification: "Added 2 tags to 12 items" with Undo button (for reversible actions)
- Undo available for 10 seconds

### Error States
- Partial failure: "8 of 12 items updated. 4 items failed." with details expandable
- Full failure: Error toast with retry option

## Visual Specifications

### Floating Bar
```
Position: fixed
Bottom: 16px (1rem)
Left/Right: Centered with max-width matching table container
Background: bg-white dark:bg-gray-800
Shadow: shadow-lg
Border-radius: rounded-lg (8px)
Padding: px-4 py-3
```

### Selection Count
```
Font: text-sm font-medium text-gray-900
Icon: heroicons:check-circle (solid, text-teal-600)
```

### Quick Action Buttons
```
Style: CommonButton variant="secondary" size="sm"
Icons: Left-aligned, 16px
```

### Destructive Actions
```
Text: text-red-600
Icon: heroicons:exclamation-triangle
Hover: bg-red-50
```

### Animation
```css
/* Slide up on appear */
@keyframes slideUp {
  from { transform: translateY(100%); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
animation: slideUp 200ms ease-out;

/* Slide down on dismiss */
@keyframes slideDown {
  from { transform: translateY(0); opacity: 1; }
  to { transform: translateY(100%); opacity: 0; }
}
animation: slideDown 150ms ease-in;
```

## Responsive Behavior

### Desktop (1024px+)
- Full bar layout as designed
- Quick actions visible as buttons
- Dropdown panels open upward

### Tablet (768-1023px)
- Same layout, may reduce to 2 quick actions
- Dropdowns same behavior

### Mobile (320-767px)
- Bar spans full width (8px margins)
- Reduce to 1 quick action + "More" only
- Consider bottom sheet pattern for dropdowns instead of upward panels

## Accessibility

- **WCAG Level:** AA
- **Keyboard Navigation:**
  - Tab through bar elements left-to-right
  - Enter/Space to activate buttons
  - Escape to close dropdowns/dismiss bar
  - Arrow keys within dropdown menus
- **Screen Reader:**
  - Bar announced when appearing: "Bulk actions available. X items selected."
  - Actions announced with current selection context
  - Live region for action results
- **Focus Management:**
  - First focus on bar appearance goes to selection count (informative)
  - Return focus to table after bar dismissed

## Clarifications Log

### Session 2025-12-21 - Design Clarification
- Q: Floating bar position? → A: Bottom of viewport (Gmail style)
- Q: Bar content layout? → A: Selection left, quick actions + overflow right, dismiss button
- Q: Quick action selection? → A: Table-specific, backend-defined (not global)
- Q: Tag selector UI? → A: Dropdown panel expanding upward from bar
- Q: Animation style? → A: Slide up with shadow, matching existing TC Portal patterns

## Open Questions

None - all design decisions made.

## Approval

- [ ] Product Manager
- [ ] Developer
- [ ] Stakeholder
