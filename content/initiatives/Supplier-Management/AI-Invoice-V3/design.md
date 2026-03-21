---
title: "Design Spec"
---


**Status:** Draft
**Created By:** AI Design Clarification
**Feature Spec:** [spec.md](./spec.md)
**Created:** 2025-12-23
**Last Updated:** 2026-02-03

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

UI enhancements to the Bill Edit page that display AI-suggested classifications with breadcrumb hierarchy, confidence scores, and scoped service selection. The design prioritizes quick visual scanning and minimal clicks for the 80% of cases where AI is correct.

## User Context

- **Primary User:** Care Coordinators and Billing Coordinators (staff processing invoices)
- **Device Priority:** Desktop-primary (office workflow)
- **Usage Pattern:** Daily power-user (processing multiple invoices per session)
- **Information Density:** Dense - users need to scan many line items quickly

## Layout & Structure

### Integration Pattern

**Dual Display Approach:**

1. **Line Item Level** - Breadcrumb displayed above each line item row showing:
   - `[Icon] Tier 1 → Tier 2` with confidence badge
   - Clickable to expand reasoning or change classification

2. **Services Table Header** - Summary breadcrumb at top showing:
   - `Co-Contribution Category → SERG → [SERV1, SERV2, SERV3]`
   - Shows the array of selected/suggested services for the current line item

### Content Layout

```
┌─────────────────────────────────────────────────────────────────────┐
│ Bill Edit Page                                                       │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  Line Items Table                                                    │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │ ┌─────────────────────────────────────────────────────────┐   │  │
│  │ │ [🏠] Independence → Personal Care  (92%) ▼              │   │  │
│  │ └─────────────────────────────────────────────────────────┘   │  │
│  │ ┌─────────────────────────────────────────────────────────┐   │  │
│  │ │ Row 1: Description | Amount | Date | Actions            │   │  │
│  │ └─────────────────────────────────────────────────────────┘   │  │
│  │                                                               │  │
│  │ ┌─────────────────────────────────────────────────────────┐   │  │
│  │ │ [💪] Allied Health → Physiotherapy  (87%) ▼             │   │  │
│  │ └─────────────────────────────────────────────────────────┘   │  │
│  │ ┌─────────────────────────────────────────────────────────┐   │  │
│  │ │ Row 2: Description | Amount | Date | Actions            │   │  │
│  │ └─────────────────────────────────────────────────────────┘   │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  Services Selection Panel (when line item selected)                  │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │ Personal Care → Independence → [Assistance with self-care, ...]│  │
│  │ ─────────────────────────────────────────────────────────────  │  │
│  │ ☐ Assistance with self-care (AI Suggested)                    │  │
│  │ ☐ Assistance with bathing                                      │  │
│  │ ☐ Assistance with dressing                                     │  │
│  │ ─────────────────────────────────────────────────────────────  │  │
│  │ [← Step back to Tier 1] [← Show ALL categories]               │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

## Component Inventory

### Existing Components (from Storybook/Codebase)
- `ServiceIcon.vue` - Service type icons (deprecated but patterns exist in DB)
- `CommonBadge.vue` - For confidence percentage badges
- `CommonTooltip.vue` - For reasoning hover/expand
- `CommonDropdown.vue` - For category selection
- `CommonCard.vue` - For panel containers

### New Components Needed
- [ ] `AiClassificationBreadcrumb.vue` - Breadcrumb with icon, tiers, confidence badge, expand arrow
- [ ] `AiReasoningPanel.vue` - Expandable panel showing classification reasoning
- [ ] `ScopedServicePicker.vue` - Service picker with step-back navigation (or extend existing ServiceSelector)
- [ ] `MultiServiceWarning.vue` - Alert component for multi-service detection
- [ ] `ConfidenceBadge.vue` - Color-coded percentage badge (green/yellow/orange)

### Pattern References
- Breadcrumb pattern: Similar to file path breadcrumbs in document management
- Confidence badge: Similar to existing status badges in the portal

## Interaction Design

### Breadcrumb Behavior

**Default State:**
- Shows: `[Icon] Tier 1 → Tier 2 (XX%)`
- Tier 1 has background color matching category
- Confidence badge color-coded:
  - Green: ≥80%
  - Yellow: 60-79%
  - Orange: <60%

**Hover State:**
- Tooltip preview of reasoning (keywords matched, supplier data)

**Click/Expand State:**
- Expands inline reasoning panel below breadcrumb
- Shows: keywords matched, supplier verification status, rate analysis, alternatives

**Dropdown State:**
- Click dropdown arrow → shows category picker
- Scoped to suggested Tier 2 by default
- "Step back" buttons to widen scope

### Services Table Header

**Shows:**
```
Co-Contribution Category → SERG → [Service 1, Service 2, Service 3]
```

**Updates when:**
- User confirms/changes classification
- User selects services from picker

### Scoped Service Picker

**Default View:**
- Only shows services within AI-suggested Tier 2
- AI-suggested items have "AI Suggested" badge and are pre-checked

**Step-back Navigation:**
```
[Showing: Physiotherapy (12 items)]
[← Step back to Allied Health (45 items)]
[← Show ALL categories (156 items)]
```

**Category Change Warning:**
- If user selects service from different contribution category
- Show inline warning: "⚠️ This changes the contribution category from X to Y"

### Data Display
- **View type:** Table with inline breadcrumbs above each row
- **Sorting:** Existing bill table sorting
- **Filtering:** Existing bill table filtering
- **Pagination:** Existing bill table pagination

### Editing Pattern
- **Method:** Inline breadcrumb expansion + scoped picker panel
- **Validation:** Inline (contribution category warnings)
- **Feedback:** Optimistic UI for classification confirmation

### Special Interactions
- [x] Keyboard: Arrow keys to navigate breadcrumb dropdown
- [x] Focus management: Return focus to breadcrumb after picker closes
- [ ] Bulk actions: Not in Phase 1 (covered by Invoice Recode epic)
- [ ] Drag & drop: Not applicable

## States

### Loading States
- Initial load: Skeleton for breadcrumb while AI data loads
- If AI not yet processed: Show "Classifying..." with spinner

### Empty States
- No AI suggestion (0% confidence): "Manual classification required" placeholder
- No matching services: "No services found. [Create Unplanned Service]"

### Warning States
- Multi-service detected: Yellow warning banner with "Split" and "Pay as-is" buttons
- Low-value travel: Info banner suggesting merge with related service
- Budget mismatch: Warning text "Client has no approved budget for this category"

### Edge Cases
- Claimed bill: Breadcrumb displayed as read-only (no dropdown, no expand)
- AI failed: Show manual picker with no AI suggestion
- Multiple high-confidence matches: Show top suggestion with "Alternatives" section in reasoning panel

## Responsive Behavior

### Desktop (1024px+)
- Full breadcrumb with all tiers visible
- Services panel opens inline below table
- Reasoning panel expands inline

### Tablet (768-1023px)
- Breadcrumb may truncate middle tier with ellipsis
- Services panel as modal/drawer

### Mobile (320-767px)
- Out of scope per spec (desktop-first)

## Accessibility

- WCAG Level: AA
- Keyboard navigation: Full breadcrumb and picker keyboard accessible
- Screen reader: Announce confidence level and classification
- Focus management: Trap focus in expanded panels, return on close
- Color: Confidence colors have secondary indicators (icons/text)

## Visual Notes

### Colors (Tier 1 Categories)
| Category | Color | Hex |
|----------|-------|-----|
| Independence | Purple | Use existing ServiceCategory.colour |
| Allied Health | Blue | Use existing ServiceCategory.colour |
| Personal Care | Green | Use existing ServiceCategory.colour |
| (etc.) | (from DB) | ServiceCategory.colour field |

### Confidence Badge Colors
| Range | Color | Tailwind Class |
|-------|-------|----------------|
| ≥80% | Green | `bg-green-100 text-green-800` |
| 60-79% | Yellow | `bg-yellow-100 text-yellow-800` |
| <60% | Orange | `bg-orange-100 text-orange-800` |

### Typography
- Breadcrumb text: `text-sm font-medium`
- Confidence badge: `text-xs font-semibold`
- Reasoning panel: `text-sm text-gray-600`

### Spacing
- Breadcrumb above row: `mb-2`
- Between breadcrumb elements: `gap-2`
- Reasoning panel padding: `p-4`

## Clarifications Log

### Session 2025-12-23
- Q: Where should AI classification UI be integrated? → A: Option D - Dual display with breadcrumb above line item AND at top of services table showing Co-Contribution Category → SERG → Service array

## Open Questions

- [ ] Exact positioning of breadcrumb relative to line item row (above vs. first column)
- [ ] Animation for reasoning panel expand/collapse
- [ ] Mobile experience (currently out of scope)

## Approval

- [ ] Product Manager
- [ ] Developer
- [ ] Stakeholder
