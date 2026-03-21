---
title: "Design Spec"
---


**Status:** Design Clarification Complete
**Created By:** AI Design Clarification
**Feature Spec:** [spec.md](spec.md)
**Created:** 2025-12-15
**Last Updated:** 2025-12-15

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

A Xero-style invoice line item management tool that enables bulk recategorization of service line items through multi-select operations, pre-built rule matching, and confirmation workflows. Coordinators and billing managers can efficiently recode 12+ items in under 2 minutes vs. 15-20 minutes with single-item editing.

---

## User Context

- **Primary User:** Care Coordinators (daily power users) & Billing Managers (weekly reviewers)
- **Device Priority:** Desktop-primary (power-user, dense interface)
- **Usage Pattern:** Daily for coordinators, weekly for managers
- **Information Density:** Dense (power-user workflow, efficiency-focused)

---

## Layout & Structure

### Page Type
Single page - all operations (filter, select, recode) on one view

### Navigation Pattern
- Fixed left sidebar with Common Rules (8-10 visible + "View all" browser for 50+ rules)
- Top filter bar for invoice/date/amount/category filters
- Main content area: line item data table with multi-select

### Content Layout

```
┌──────────────────────────────────────────────────────────────┐
│  Invoice Recode Tool                              [Help]     │
├─────────────────────┬──────────────────────────────────────┤
│  Common Rules       │  Filters: [Invoice] [Date] [Amt] [Cat]│
│  (8-10 visible)     │                                        │
│  □ Physio →         │ ┌────────────────────────────────────┐ │
│    Allied Health    │ │ ✓ Item 1 | Physio... | $150        │ │
│  □ Items >$200      │ │ ✓ Item 2 | Physio... | $200        │ │
│    → Review         │ │   Item 3 | Massage.. | $100        │ │
│  □ Uncategorized    │ │   Item 4 | PT Eval  | $300        │ │
│                     │ │   ...                              │ │
│  [View all rules]   │ │                                    │ │
│  [Search rules...] │ │ [Select All] [Deselect All]         │ │
│                     │ │ [12 items selected]                │ │
│ ▥ ≡ ⚙ (Reorder      │ │ [Recode Selected →]                │ │
│    tools)          │ │ [Load More] (50-100 items per page) │ │
│                     │ └────────────────────────────────────┘ │
└─────────────────────┴──────────────────────────────────────┘
```

---

## Component Inventory

### Existing Components (from Storybook)
- Table component with sortable columns
- Checkbox / multi-select pattern
- Modal dialog for confirmations
- Filter input fields (text, date range, amount range, dropdown)
- Button group (Select All, Deselect All, Recode)
- Toast notifications for success/error
- Pagination "Load More" button

### New Components Needed
- [ ] **CommonRulesList** - Sidebar component displaying 8-10 rules with reordering (drag/up-down controls), click-to-apply
- [ ] **RulesBrowser** - Modal/drawer for searching and viewing all 50+ rules
- [ ] **RecodeConfirmationModal** - Modal showing preview table (Item, Current → New category), before/after, with "Recode" and "Cancel" buttons
- [ ] **SelectionToolbar** - Inline toolbar showing "X items selected" count and action buttons (only visible when items selected)
- [ ] **FilterBar** - Top bar with Invoice ID, Date Range, Description search, Amount Range, Current Category filters

### Pattern References
- Similar to invoice line item tables in existing invoice detail view
- Similar to Xero's bill recoding interface (multi-select + bulk actions)
- Sidebar rules pattern similar to portal filter sidebars

---

## Interaction Design

### Data Display
- **View type:** Sortable data table
- **Sorting:** Invoice ID, Date, Description, Amount, Category (ascending/descending toggles on column headers)
- **Filtering:** Top filter bar (Invoice ID, Date Range, Description text search, Amount Range, Current Category dropdown)
- **Pagination:** "Load More" button - loads next 50-100 items on click (explicit control, no infinite scroll)

### Common Rules Interaction
- **Display:** 8-10 most-used rules visible in sidebar by default
- **Search:** Click "View all rules" to open rules browser modal with search/filter
- **Application:** Click rule button → system queries and auto-selects matching items in table
- **Reordering:** Drag-drop or up/down controls to customize rule priority; preference persists across sessions

### Bulk Recode Workflow
- **Selection:** Check individual items OR click rule to auto-select matching items
- **Confirmation:** Click "Recode Selected" button (only enabled when items selected)
- **Preview Modal:** Shows table of selected items with Current Category → New Category columns
- **Submit:** User reviews preview, clicks "Recode" button to execute atomically
- **Result:** Toast notification with success/error message; if error, activity log available for audit

### Editing Pattern
- **Method:** Confirmation modal (full preview before commit)
- **Validation:** Submit-time (prevent same-category recoding with warning in modal)
- **Feedback:** Success toast immediately after; activity log entry created atomically
- **No Undo:** After confirmation, changes committed. Corrections via activity log or new recode operation.

### Special Interactions
- [x] **Bulk actions:** Multi-select with "Select All / Deselect All" shortcuts
- [x] **Drag & drop:** Yes - for rule reordering in sidebar
- [x] **Keyboard shortcuts:** Tab navigation, Enter to apply rule, Escape to close modal
- [x] **Real-time updates:** Activity log updated immediately after successful recode; no optimistic UI

---

## States

### Loading States
- **Initial page load:** Skeleton loader for table rows (10-20 rows visible)
- **Rule application:** Brief spinner while querying for matching items
- **Bulk recode action:** Button spinner on "Recode" button; modal stays open until completion

### Empty States
- **First time (no invoices loaded):** "No line items to recode. Import an invoice first."
- **No filter results:** "No items match your filters. Try adjusting date range or amount."
- **No rules matched:** "No items matched this rule. (Searched X invoices)"
- **Error on bulk recode:** Error modal with list of failed items, reason, and retry button

### Edge Cases
- **Item deleted after selection:** Warning in confirmation modal; item automatically removed from recode list before execution
- **Service category with no types:** Category option grayed out/disabled in dropdown with tooltip "No service types available"
- **Partial failure (item 7 of 12 fails):** All recoding rolled back (atomic); error modal shows which items failed and why
- **Same category selection:** Prevent recode with warning: "Items already in this category"
- **Multiple invoices selected:** Allow it; each line item recoded independently (no invoice-level locking)

---

## Responsive Behavior

### Desktop (1024px+)
- Fixed left sidebar (250-300px) with Common Rules + reordering controls
- Full-width table with all columns visible: Invoice ID, Date, Description, Amount, Current Category, Supplier
- Filter bar at top with all fields visible horizontally
- Modal dialogs centered on screen

### Tablet (768-1023px)
- Collapsible sidebar (hamburger menu to expand/collapse Common Rules)
- Table columns: Show essential only (Checkbox, Description, Amount, Category); hide Supplier and Date (available in detail row/expand)
- Filter bar compacted (filter icon opens sidebar)
- Modal dialogs take 90% of screen width

### Mobile (320-767px)
- **Out of scope per spec** (desktop-first design)

---

## Accessibility

- **WCAG Level:** AA (standard for portal)
- **Keyboard navigation:**
  - Tab through checkboxes, rule buttons, filter inputs, pagination
  - Enter to apply rule or submit form
  - Escape to close modal
  - Arrow keys to navigate rule reordering (if using up/down controls)
- **Screen reader:**
  - Rule button announces: "Physio to Allied Health rule, X items matched, button"
  - Confirmation modal announces: "Modal dialog: Recode 12 items from Personal Care to Allied Health"
  - Selection count updates announced live: "12 items now selected"
  - Table headers marked with scope="col"
  - Status indicators announced: "Error: 3 items failed to recode"
- **Focus management:**
  - Modal opens and traps focus inside
  - Focus returns to "Recode Selected" button on modal close
  - Checkbox focus outline visible (4px, brand color)
  - Rule reorder controls have clear focus indicators

---

## Visual Notes

### Colors
- **Primary action (Recode button):** Portal brand primary color (teal/blue)
- **Disabled state:** Gray out "Recode Selected" button when no items selected
- **Selected rows:** Light background highlight (light blue wash or checkbox highlight)
- **Status indicators:**
  - Red for errors (failed items)
  - Green for success (toast message)
  - Yellow/orange for warnings (same category, no types available)
- **Sidebar rules:** Active/hovered rule highlighted with subtle background

### Typography
- **Headings:** Page title "Invoice Recode Tool" - H1, 24px, bold
- **Section labels:** "Common Rules", "Filters" - H3, 16px, bold
- **Table headers:** 14px, bold, with sortable indicator (▲▼)
- **Body:** Standard portal body font for table cells (14px)
- **Rule buttons:** 14px, semi-bold
- **Modal title:** 20px, bold

### Spacing
- **Sidebar to table:** 16px gap (gutter spacing)
- **Filter bar height:** 60-80px (comfortable input spacing)
- **Table rows:** 40-44px height (44px minimum for touch targets)
- **Modal padding:** 24px (outer) / 16px (inner sections)
- **Rule list item:** 12px vertical padding, 8px horizontal padding
- **Gap between rules:** 8px

---

## Clarifications Log

### Session 2025-12-15 (Specification Clarification)

From `/speckit.clarify`:
- **Q1:** Pagination strategy for 1000+ line items → **"Load More" button with 50-100 item batches** (explicit control, clear item count)
- **Q2:** RecodeRule types in Phase 1 → **Description pattern, Amount range, Category** (pre-built "guided checks")
- **Q3:** Confirmation modal preview & undo → **Full preview table, NO undo** (rely on activity log)
- **Q4:** Partial failure strategy → **Rollback ALL if ANY item fails** (data consistency)
- **Q5:** Common rules visibility with 50+ rules → **8-10 visible + "View all" searchable browser; rules can be reordered**

---

## Clarifications Log (Design Phase)

### Session 2025-12-15 (Design Clarification)

- **Q1:** Rule reordering interaction pattern? → **Drag-drop reordering** - click and drag rule to new position in sidebar
- **Q2:** Notification feedback style? → **Toast for success (auto-dismiss 3-5s) + Modal for errors (persistent)** - clear distinction between transient and critical feedback
- **Q3:** Activity log integration & visibility? → **Activity log panel on same page (collapsible sidebar or expandable section)** - immediate verification without breaking workflow
- **Q4:** Filter panel visibility & behavior? → **Always Visible Filter Bar** - stays visible as users scroll through table for instant access to filtering controls without scrolling back up
- **Q5:** Empty state & first-time UX? → **Contextual Help & Guided First Step** - Show detailed empty state guidance, collapsible tooltips on rules sidebar, help icon on "Recode Selected" button, optional one-time onboarding overlay

---

## Approval Checklist

- [ ] Product Manager (Will)
- [ ] Engineering Lead (Tim)
- [ ] Stakeholder (Coordinators)
