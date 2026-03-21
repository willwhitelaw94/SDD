---
title: "Design: Supplier Pricing"
---

**Status:** Draft
**Designer:** Bruce (AI)
**Feature Spec:** [SR3 spec.md](/initiatives/supplier-redone/sr3-supplier-pricing/spec)
**Created:** 2026-03-19
**Last Updated:** 2026-03-19

---

## Overview

Suppliers need to enter, review, and manage pricing across locations and service types, while TC staff need to review out-of-cap submissions efficiently. The core design challenge is a dense pricing grid (locations x service types x 6 rate categories) that must remain usable on desktop and functional on tablet. The design uses a location-first drill-down, inline rate entry with immediate cap validation feedback, and a separate staff-facing approval dashboard.

---

## Design Resources

_No external design resources yet. ASCII wireframes below serve as the initial design reference._

---

## User Context

| Aspect | Decision | Rationale |
|--------|----------|-----------|
| **Primary Users** | Supplier Administrator (entry), TC Pricing Staff (review) | Two distinct workflows in one epic |
| **Device Priority** | Desktop-primary, tablet-functional | Pricing grids are data-dense; desktop is the primary entry context |
| **Usage Pattern** | Periodic bulk entry (onboarding), then occasional updates | Most rates entered once, updated annually or when caps change |
| **Information Density** | Dense-efficient | Grid must show many rates at once to reduce context-switching |

---

## Layout & Structure

### Page Type

- **Supplier view**: Location-first drill-down into a pricing grid (data table with inline editing)
- **Staff view**: Filterable approval dashboard (table with batch actions)
- **Staff cap config**: Simple form table

### Navigation Pattern

- **Supplier**: Portal sidebar > Pricing > Location selector > Service type tabs > Rate grid
- **Staff**: Admin sidebar > Pricing Approvals > Filters > Submission table

### Information Architecture

```
Supplier View:
  Pricing Overview (compliance summary)
    └── Location (selected)
          └── Service Type (tab or accordion)
                └── Rate Grid (weekday, sat, sun, PH, etc.)
                      ├── Auto-approved rates (green tick)
                      ├── Pending price requests (amber)
                      └── Flagged rates (red warning)

Staff View:
  Pricing Approvals Dashboard
    ├── Filters (service type, location, status)
    ├── Submission Table (sortable, filterable)
    └── Batch Actions (approve, reject)

  Price Cap Configuration
    └── Service Type > Rate Category > Cap Value
```

---

## Wireframes

### 1. Supplier Pricing Overview (Compliance Summary)

The entry point for suppliers. Shows compliance status per location with rate completion progress.

```
┌─────────────────────────────────────────────────────────────────────────┐
│  [Logo]  Supplier Portal          [🔽 Acme Allied Health ▾]  [👤]      │
├────────┬────────────────────────────────────────────────────────────────┤
│        │                                                                │
│  Nav   │  Pricing                                                      │
│        │                                                                │
│ Dash   │  ┌─ Compliance Summary ───────────────────────────────────┐   │
│ Profile│  │                                                        │   │
│ Pricing│  │   ● 24 Approved    ◐ 3 Pending    ▲ 1 Flagged         │   │
│ Billing│  │                                                        │   │
│ Docs   │  │   ⚠ 1 flag — one more flag will result in a           │   │
│        │  │     billing hold. Review flagged rates below.           │   │
│        │  └────────────────────────────────────────────────────────┘   │
│        │                                                                │
│        │  Pricing by Location                      [📥 Download PDF]   │
│        │                                                                │
│        │  ┌────────────────────────────────────────────────────────┐   │
│        │  │ Location               Services   Completion  Status   │   │
│        │  ├────────────────────────────────────────────────────────┤   │
│        │  │ 123 Collins St, Melb   3 types    █████████░ 90%  [→] │   │
│        │  │ 456 George St, Syd     2 types    ██████░░░░ 60%  [→] │   │
│        │  │ 789 Adelaide St, Bris  3 types    ██████████ 100% [→] │   │
│        │  └────────────────────────────────────────────────────────┘   │
│        │                                                                │
└────────┴────────────────────────────────────────────────────────────────┘
```

**Notes:**
- Compliance summary shows aggregate counts across all locations (FR-010)
- Flag warning shown when count is 1 (one more triggers hold) — AC 4.2
- Billing hold banner shown when count >= 2 with explanation and action link — AC 4.3
- Progress bar shows completion % (rates entered or marked N/A vs total required)
- "Download PDF" generates a reference for the selected location/service type (FR-011)
- Arrow button drills into the location's pricing grid

---

### 2. Supplier Pricing Grid (Core Rate Entry)

The main rate entry screen. Per-location, with service type tabs. Each row is a rate category with an N/A toggle.

```
┌─────────────────────────────────────────────────────────────────────────┐
│  [Logo]  Supplier Portal          [🔽 Acme Allied Health ▾]  [👤]      │
├────────┬────────────────────────────────────────────────────────────────┤
│        │                                                                │
│  Nav   │  Pricing > 123 Collins St, Melbourne                          │
│        │                                                                │
│        │  [Allied Health]  Nursing  Personal Care                       │
│        │                                                                │
│        │  Allied Health — Rate Entry                     [Save Rates]   │
│        │                                                                │
│        │  ┌────────────────────────────────────────────────────────┐   │
│        │  │ Rate Category     Rate        N/A    Status            │   │
│        │  ├────────────────────────────────────────────────────────┤   │
│        │  │ Weekday           [$  62.50 ]  [ ]   ● Approved       │   │
│        │  │ Non-Std Weekday   [$  68.00 ]  [ ]   ● Approved       │   │
│        │  │ Saturday          [$  75.00 ]  [ ]   ● Approved       │   │
│        │  │ Sunday            [$  85.00 ]  [ ]   ◐ Pending        │   │
│        │  │ Public Holiday    [$ 110.00 ]  [ ]   ▲ Over cap       │   │
│        │  │ Travel            [         ]  [✓]   — N/A            │   │
│        │  └────────────────────────────────────────────────────────┘   │
│        │                                                                │
│        │  ⚠ 1 rate exceeds the acceptable range.                       │
│        │    [Submit Price Request] to request approval for              │
│        │    the flagged rate.                                           │
│        │                                                                │
│        │                                      [Cancel]  [Save Rates]   │
│        │                                                                │
└────────┴────────────────────────────────────────────────────────────────┘
```

**Notes:**
- Rate input fields are currency-formatted (`$` prefix, 2 decimal places)
- N/A checkbox disables the input field and stores null, not $0 (FR-002, FR-017)
- Status column indicators: `●` green = approved, `◐` amber = pending review, `▲` red = over cap
- Over-cap warning does NOT reveal the cap value (FR-004, FR-020) — uses vague language: "exceeds the acceptable range"
- Blank fields (not N/A, not filled) show as incomplete on save (AC 1.5)
- "Save Rates" validates all fields. Within-cap rates are auto-approved immediately (FR-003)
- Over-cap rates prompt the supplier to submit a price request

---

### 3. Price Request Submission Dialog

Triggered when a supplier clicks "Submit Price Request" for an over-cap rate.

```
┌──────────────────────────────────────────────────┐
│  Submit Price Request                         ✕  │
├──────────────────────────────────────────────────┤
│                                                  │
│  Location:    123 Collins St, Melbourne          │
│  Service:     Allied Health                      │
│  Category:    Public Holiday                     │
│  Your Rate:   $110.00                            │
│                                                  │
│  Reason for this rate:                           │
│  ┌──────────────────────────────────────────┐   │
│  │ We service remote clients on public      │   │
│  │ holidays which requires specialist       │   │
│  │ staff with penalty rate agreements...    │   │
│  │                                          │   │
│  └──────────────────────────────────────────┘   │
│                                                  │
│  This request will be reviewed by the pricing    │
│  team. You will be notified of the outcome.      │
│                                                  │
│              [Cancel]  [Submit Request]           │
└──────────────────────────────────────────────────┘
```

**Notes:**
- Reason field is required (FR-005)
- On submit, rate status changes to "Pending Review" (AC 2.2)
- Supplier can view all pending requests from the compliance summary
- No cap value is shown or hinted at anywhere in this dialog (FR-004)

---

### 4. Staff Pricing Approval Dashboard

The primary review interface for TC pricing staff. Filterable table of all pending submissions.

```
┌─────────────────────────────────────────────────────────────────────────┐
│  [Logo]  TC Admin Portal                                         [👤]  │
├────────┬────────────────────────────────────────────────────────────────┤
│        │                                                                │
│  Admin │  Pricing Approvals                                            │
│  Nav   │                                                                │
│        │  ┌─ Filters ──────────────────────────────────────────────┐   │
│ Suppls │  │ Service Type [All        ▾]  Location [All        ▾]  │   │
│ Pricing│  │ Status       [Pending    ▾]  Supplier [Search...    ] │   │
│ Caps   │  └────────────────────────────────────────────────────────┘   │
│ Reports│                                                                │
│        │  Showing 23 pending submissions            [Batch Approve]    │
│        │                                                                │
│        │  ┌──────────────────────────────────────────────────────────┐ │
│        │  │ [ ] Supplier        Location   Service  Cat   Rate  Cap  │ │
│        │  ├──────────────────────────────────────────────────────────┤ │
│        │  │ [ ] Acme Allied     Collins    Allied H PH   $110  $105  │ │
│        │  │     ⚠ 1 prior flag                                       │ │
│        │  │     Reason: "Remote clients, specialist staff..."         │ │
│        │  │                                [Approve]  [Reject]       │ │
│        │  ├──────────────────────────────────────────────────────────┤ │
│        │  │ [ ] Beta Care       George St  Nursing  Sun  $92   $90   │ │
│        │  │     Reason: "Weekend penalty rates per EBA..."            │ │
│        │  │                                [Approve]  [Reject]       │ │
│        │  ├──────────────────────────────────────────────────────────┤ │
│        │  │ [ ] Gamma Services  Adelaide   Personal Wkdy $70   $65   │ │
│        │  │     ⚠⚠ 2 prior flags — BILLING ON HOLD                  │ │
│        │  │     Reason: "Increased insurance costs..."                │ │
│        │  │                                [Approve]  [Reject]       │ │
│        │  └──────────────────────────────────────────────────────────┘ │
│        │                                                                │
│        │  Showing 1-3 of 23                         [< 1 2 3 ... >]    │
│        │                                                                │
└────────┴────────────────────────────────────────────────────────────────┘
```

**Notes:**
- Each row is expandable to show the supplier's justification text
- Checkbox column enables batch selection for "Batch Approve" (FR-007)
- Prior flag count shown as warning indicator (AC 3.6) — 2 flags = billing hold badge
- Reject action opens a dialog requiring a rejection reason
- Staff sees the cap value inline in a dedicated "Cap" column (CL-005) for quick rate vs cap comparison
- Filters support multi-select for service type and location
- Sorted by submission date (oldest first) to process FIFO

**Rejection Dialog:**

```
┌──────────────────────────────────────────────┐
│  Reject Price Request                     ✕  │
├──────────────────────────────────────────────┤
│                                              │
│  Supplier:  Acme Allied Health               │
│  Rate:      Public Holiday — $110.00         │
│                                              │
│  Rejection reason (sent to supplier):        │
│  ┌──────────────────────────────────────┐   │
│  │                                      │   │
│  │                                      │   │
│  └──────────────────────────────────────┘   │
│                                              │
│  [ ] Flag this supplier (adds to flag count) │
│                                              │
│              [Cancel]  [Reject]               │
└──────────────────────────────────────────────┘
```

**Notes:**
- Rejection reason is required and sent to the supplier via notification (FR-015)
- Flag checkbox is optional — not every rejection results in a flag
- If flagging brings the count to 2, show a confirmation: "This will place the supplier's billing on hold."

---

### 5. Staff Price Cap Configuration

Simple table for managing cap thresholds by service type and rate category.

```
┌─────────────────────────────────────────────────────────────────────────┐
│  [Logo]  TC Admin Portal                                         [👤]  │
├────────┬────────────────────────────────────────────────────────────────┤
│        │                                                                │
│  Admin │  Price Cap Configuration                                      │
│  Nav   │                                                                │
│        │  Service Type: [Allied Health  ▾]                              │
│        │                                                                │
│        │  ┌────────────────────────────────────────────────────────┐   │
│        │  │ Rate Category       Current Cap    New Cap             │   │
│        │  ├────────────────────────────────────────────────────────┤   │
│        │  │ Weekday             $65.00         [$  65.00 ]        │   │
│        │  │ Non-Std Weekday     $72.00         [$  72.00 ]        │   │
│        │  │ Saturday            $80.00         [$  80.00 ]        │   │
│        │  │ Sunday              $90.00         [$  90.00 ]        │   │
│        │  │ Public Holiday      $105.00        [$ 100.00 ]  ←     │   │
│        │  │ Travel              $45.00         [$  45.00 ]        │   │
│        │  └────────────────────────────────────────────────────────┘   │
│        │                                                                │
│        │  ⚠ Reducing "Public Holiday" from $105.00 to $100.00          │
│        │    will trigger re-validation of 47 existing approved rates.  │
│        │                                                                │
│        │                                      [Cancel]  [Save Caps]    │
│        │                                                                │
└────────┴────────────────────────────────────────────────────────────────┘
```

**Notes:**
- Service type dropdown scopes the table to one service type at a time
- "Current Cap" column is read-only for reference
- Changes highlighted with an arrow indicator
- Warning shows impact count before save — how many existing rates will be re-flagged (AC 6.2-3)
- Re-validation runs as a background job; staff sees a progress indicator until complete (Edge Case)
- Audit log records all cap changes (AC 6.4)

---

### 6. Pricing Grid — Tablet Layout

The pricing grid is the most challenging screen for responsive design. On tablet, the grid rotates to a card-per-category layout.

```
┌─────────────────────────────────────────────────┐
│  [☰]  Portal  [Acme Allied ▾]             [👤]  │
├─────────────────────────────────────────────────┤
│                                                  │
│  Pricing > Collins St, Melbourne                 │
│  [Allied Health ▾]              [Save Rates]     │
│                                                  │
│  ┌─────────────────────────────────────────┐    │
│  │  Weekday                    ● Approved   │    │
│  │  Rate: [$  62.50      ]     N/A: [ ]     │    │
│  ├─────────────────────────────────────────┤    │
│  │  Non-Std Weekday            ● Approved   │    │
│  │  Rate: [$  68.00      ]     N/A: [ ]     │    │
│  ├─────────────────────────────────────────┤    │
│  │  Saturday                   ● Approved   │    │
│  │  Rate: [$  75.00      ]     N/A: [ ]     │    │
│  ├─────────────────────────────────────────┤    │
│  │  Sunday                     ◐ Pending    │    │
│  │  Rate: [$  85.00      ]     N/A: [ ]     │    │
│  ├─────────────────────────────────────────┤    │
│  │  Public Holiday             ▲ Over cap   │    │
│  │  Rate: [$ 110.00      ]     N/A: [ ]     │    │
│  ├─────────────────────────────────────────┤    │
│  │  Travel                     — N/A        │    │
│  │  Rate: [  disabled    ]     N/A: [✓]     │    │
│  └─────────────────────────────────────────┘    │
│                                                  │
│  ⚠ 1 rate exceeds the acceptable range.         │
│    [Submit Price Request]                        │
│                                                  │
│                         [Cancel]  [Save Rates]   │
└─────────────────────────────────────────────────┘
```

**Notes:**
- Service type selector becomes a dropdown instead of tabs on tablet/mobile
- Each rate category becomes a card row with label, input, N/A toggle, and status on one line
- This avoids horizontal scrolling while keeping all data visible
- Touch targets are 44px minimum for N/A checkboxes and input fields

---

## Component Inventory

### Existing Components (shadcn/ui)

| Component | Usage | Variant |
|-----------|-------|---------|
| Table | Pricing grid, approval dashboard, cap config | with sorting, selection |
| Badge | Rate status (approved/pending/flagged), compliance | green/amber/red |
| Button | Save, approve, reject, submit request | primary/secondary/destructive |
| Dialog | Price request form, rejection reason, confirmation | default |
| Select | Location picker, service type filter | default |
| Tabs | Service type navigation (desktop) | default |
| Checkbox | N/A toggle, batch selection | default |
| Input | Rate entry (currency), reason text | default |
| Textarea | Price request justification, rejection reason | default |
| Progress | Rate completion bar | default |
| Tooltip | Status explanations, cap warnings (staff only) | default |
| Alert | Compliance warnings, billing hold notice | warning/destructive |

### New Components Needed

- **CurrencyInput** — Input with `$` prefix, numeric-only, 2 decimal places, right-aligned value. Wraps shadcn Input with formatting logic.
- **RateStatusBadge** — Combines icon + label for Approved/Pending/Flagged/N/A states. Consistent across grid and dashboard.
- **ComplianceSummaryBar** — Horizontal bar showing approved/pending/flagged counts with colour segments. Used at top of pricing overview.
- **RateCard** — Mobile/tablet card layout for a single rate category (label + input + N/A + status). Used in responsive grid.

---

## Interaction Design

### Data Display

| Aspect | Decision | Details |
|--------|----------|---------|
| **Pricing Grid View** | Table (desktop), Card list (tablet/mobile) | Responsive switch at 768px |
| **Default Sort** | Rate category order (weekday → travel) | Fixed order, not user-sortable |
| **Approval Dashboard Sort** | Submission date (oldest first) | FIFO processing |
| **Filtering** | Inline filter bar (service type, location, status, supplier search) | Approval dashboard |
| **Pagination** | Numbered pages | Approval dashboard (20 per page) |
| **Row Actions** | Inline Approve/Reject buttons | Approval dashboard |

### Editing Pattern

| Aspect | Decision | Details |
|--------|----------|---------|
| **Rate Entry** | Inline in table cells | Direct editing in the grid — no modal needed |
| **Validation** | On save (not on blur) | Validate all rates together for consistent UX |
| **Save Feedback** | Wait-for-server with toast | "Rates saved. X approved, Y pending review." |
| **Unsaved Warning** | Yes | Browser beforeunload if rates modified but unsaved |
| **Partial Save** | Supported | Can save with some fields incomplete (FR-018) |

### Special Interactions

| Feature | Needed? | Details |
|---------|---------|---------|
| Bulk actions | Yes | Batch approve/reject on staff dashboard (FR-007) |
| Drag & drop | No | Not applicable to pricing |
| Search | Yes | Supplier name search on approval dashboard |
| Keyboard shortcuts | No | Standard tab navigation through rate inputs |
| Real-time updates | No | Polling not needed — approval status checked on page load |

---

## States

### Loading States

| Context | Treatment | Duration Threshold |
|---------|-----------|-------------------|
| Pricing overview | Skeleton rows for location list | Show after 200ms |
| Rate grid | Skeleton table matching column structure | Show after 200ms |
| Save rates | Button spinner + "Saving..." | Immediate |
| PDF download | Button spinner + "Generating..." | Immediate |
| Cap re-validation | Progress bar on cap config page | Show immediately, poll for completion |

### Empty States

| Context | Message | CTA |
|---------|---------|-----|
| No locations (pricing overview) | "Add a location in your profile to start entering rates." | [Go to Profile → Locations] |
| No service types for location | "No service agreements linked to this location. Contact TC to update your agreements." | None (support message) |
| No pending approvals (staff) | "No pricing submissions pending review." | None |
| No rates entered for service type | "No rates entered yet. Fill in your rates below or mark categories as N/A." | N/A (grid is ready for input) |

### Edge Cases

| Scenario | Handling |
|----------|----------|
| Same rate resubmitted | No change detected, no audit entry, toast: "No changes to save." |
| $0 rate entered | Valid — saved and validated against cap like any other rate. Distinct from N/A. |
| All rates N/A for a service type | Valid — service type shows 100% completion with all N/A status |
| Rate field left blank (not N/A) | Treated as incomplete. Yellow highlight. Save allowed but completion % reflects gap. |
| Digital platform rates | Tagged "platform-sourced", excluded from cap validation, manual review badge |
| Cap re-validation in progress | "Re-validation in progress..." banner on cap config page. Staff cannot edit caps until complete. |
| Supplier has no registered service types | Pricing grid shows empty state with support contact message |

---

## Responsive Behavior

### Desktop (1024px+)

- Full sidebar navigation visible
- Pricing grid as a standard table with all columns
- Service type navigation as horizontal tabs
- Approval dashboard with all columns visible, inline actions
- Cap configuration as a two-column table (current vs new)

### Tablet (768-1023px)

- Sidebar collapses to hamburger
- Pricing grid switches to card-per-category layout (see wireframe 6)
- Service type navigation becomes a dropdown selector
- Approval dashboard hides "Location" column, shows on row expand
- Cap config remains a table (fewer rows, always fits)

### Mobile (320-767px)

```
┌───────────────────────────────┐
│  [☰]  Portal  [Acme.. ▾] [👤] │
├───────────────────────────────┤
│                               │
│  Pricing                      │
│                               │
│  ● 24 Approved  ◐ 3 Pending  │
│  ▲ 1 Flagged                  │
│                               │
│  ┌───────────────────────┐   │
│  │ Collins St, Melb      │   │
│  │ 3 services  90% done  │   │
│  │ [Manage Rates →]      │   │
│  └───────────────────────┘   │
│  ┌───────────────────────┐   │
│  │ George St, Sydney     │   │
│  │ 2 services  60% done  │   │
│  │ [Manage Rates →]      │   │
│  └───────────────────────┘   │
│                               │
│  [📥 Download PDF]            │
└───────────────────────────────┘
```

- Single column card stack for location list
- Rate grid uses card-per-category layout (same as tablet)
- Service type selector is a full-width dropdown
- Touch targets: 44px minimum
- Approval dashboard (staff) not optimised for mobile — expected to be used on desktop/tablet

---

## Accessibility

| Requirement | Implementation |
|-------------|----------------|
| **WCAG Level** | AA |
| **Keyboard Navigation** | Tab through rate inputs in grid order. Enter to save. Escape to cancel. |
| **Focus Indicators** | Visible focus rings on inputs, buttons, checkboxes |
| **Screen Reader** | Rate inputs use `aria-label` with category name. Status badges use `aria-label`. N/A toggle announces state. Compliance summary uses `aria-live` for dynamic counts. |
| **Focus Trapping** | Price request dialog and rejection dialog trap focus |
| **Color Independence** | All status indicators use icon + text, not just colour. Approved = check + "Approved", Pending = clock + "Pending", Flagged = triangle + "Over cap". |

---

## Visual Design

### Colors

| Usage | Color | Tailwind Class |
|-------|-------|----------------|
| Primary actions (Save, Submit) | Navy #2C4C79 | `bg-[#2C4C79] text-white` |
| Accent / links | Teal #007F7E | `text-[#007F7E]` |
| Approved rate | Green | `text-green-600` (icon + text) |
| Pending review | Amber | `text-amber-600` (icon + text) |
| Over cap / flagged | Red | `text-red-600` (icon + text) |
| N/A rate | Grey | `text-gray-400` |
| Billing hold banner | Red background | `bg-red-50 border-red-200 text-red-800` |
| Flag warning banner | Amber background | `bg-amber-50 border-amber-200 text-amber-800` |
| Rate input field | Standard | `border-gray-300`, red border on over-cap |
| Disabled input (N/A) | Grey | `bg-gray-100 text-gray-400` |

### Typography

| Element | Style |
|---------|-------|
| Page title | `text-2xl font-bold text-gray-900` |
| Section heading | `text-lg font-semibold text-gray-900` |
| Table header | `text-xs font-medium text-gray-500 uppercase` |
| Rate value | `text-sm font-mono text-gray-900` (monospaced for alignment) |
| Status label | `text-xs font-medium` |
| Warning text | `text-sm text-amber-700` or `text-sm text-red-700` |

### Spacing

| Context | Tailwind Class |
|---------|----------------|
| Page padding | `p-6` (desktop), `p-4` (mobile) |
| Grid cell padding | `px-3 py-2` |
| Card padding (mobile) | `p-4` |
| Section gaps | `space-y-6` |
| Filter bar gaps | `gap-4` |
| Action button gaps | `gap-2` |

---

## PDF Pricing Reference

The downloadable PDF (FR-011) follows this structure:

```
┌─────────────────────────────────────────┐
│  ACME ALLIED HEALTH                     │
│  Pricing Reference                      │
│  Generated: 19 Mar 2026                 │
│                                         │
│  Location: 123 Collins St, Melbourne    │
│  Service Type: Allied Health            │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ Rate Category    Rate   Status   │   │
│  ├─────────────────────────────────┤   │
│  │ Weekday          $62.50  Appr.  │   │
│  │ Non-Std Wkday    $68.00  Appr.  │   │
│  │ Saturday         $75.00  Appr.  │   │
│  │ Sunday           $85.00  Pend.  │   │
│  │ Public Holiday   $110.00 Pend.  │   │
│  │ Travel           N/A     —      │   │
│  └─────────────────────────────────┘   │
│                                         │
│  * Cap values are not included in       │
│    this reference document.             │
└─────────────────────────────────────────┘
```

**Notes:**
- Scoped to a single location + service type per page
- Shows supplier's submitted rates and approval status only
- N/A shown as "Not Applicable" (AC 5.3)
- Explicitly excludes cap values (FR-004)
- Generated server-side, downloaded as PDF

---

## Open Questions

- [x] ~~Should the pricing grid show all service types in one scrollable table, or use tabs/accordion per service type?~~ **Resolved: Tabs** — see CL-001
- [x] ~~What is the maximum number of service types a supplier typically has per location?~~ **Resolved: Assumed 2-5** — see CL-001
- [x] ~~Should the PDF download be scoped to a single service type, or combined?~~ **Resolved: Single service type** — see CL-004
- [x] ~~For the approval dashboard, should staff see the exact cap value inline?~~ **Resolved: Show cap inline** — see CL-005
- [ ] Should the 10% tolerance be visible to staff on the cap configuration page, or is it a global system setting?

---

## Approval

| Role | Name | Date | Status |
|------|------|------|--------|
| Product Manager | | | [ ] Approved |
| Developer | | | [ ] Approved |
| Stakeholder | | | [ ] Approved |

---

## Next Steps

- [ ] `/trilogy-mockup` — Create interactive mockups for pricing grid and approval dashboard
- [ ] `/speckit-plan` — Create technical implementation plan
- [ ] Resolve remaining open question (10% tolerance visibility)
- [ ] Validate tablet pricing grid layout with user testing

---

## Clarification Log

### UX Clarifications

**CL-001: Should the pricing grid show all service types in one scrollable table, or use tabs per service type?**
- **Option A (Recommended): Tabs per service type.** Most suppliers have 2-5 service types per location. Tabs keep each grid focused (6 rate categories per service type is manageable). Avoids a very long scrollable table. Tab labels are short (e.g., "Allied Health", "Nursing").
- Option B: Single scrollable table with section headers per service type.
- Option C: Accordion (collapsible sections) per service type.
- **Decision: Option A** — Tabs per service type on desktop, dropdown selector on tablet/mobile. Already reflected in wireframes. If a supplier has more than 5 service types, tabs overflow with a horizontal scroll (rare case).

**CL-002: Should suppliers be able to save rates with incomplete fields (partial save)?**
- **Option A (Recommended): Yes — partial save allowed.** Suppliers may not have all rates ready at once (e.g., waiting for internal approval on weekend rates). Save what is filled, show incomplete fields as yellow-highlighted with a visual gap in the completion percentage. The compliance summary reflects the gap.
- Option B: Require all fields to be either filled or marked N/A before saving.
- Option C: Allow save but show a blocking warning that must be dismissed.
- **Decision: Option A** — Partial save allowed. This is already stated in FR-018 and the wireframe notes. Incomplete fields are visually distinct (yellow highlight), and completion percentage on the overview reflects the gap. No blocking modals.

**CL-003: How should the flag/billing-hold system communicate to suppliers — banner only, or also affect rate entry?**
- **Option A (Recommended): Banner only — do not block rate entry.** Suppliers with 1 flag see an amber warning banner on the pricing overview. Suppliers with 2+ flags see a red billing-hold banner. In both cases, they can still view and edit rates. Blocking rate entry would prevent them from fixing the problem.
- Option B: Block rate entry entirely when on billing hold.
- Option C: Banner + disable the "Submit Price Request" button (can edit rates but cannot submit new over-cap requests).
- **Decision: Option A** — Banner only, no functional blocking. Suppliers need to be able to adjust rates to resolve flags. The banner provides urgency without preventing action. Applied to wireframe notes.

### UI Clarifications

**CL-004: Should the PDF download be scoped to a single service type or allow a combined download?**
- **Option A (Recommended): Single service type per PDF.** Keeps the PDF focused and printable on a single page. The download button is contextual — it appears on the pricing grid page after selecting a location and service type tab, so the scope is already clear.
- Option B: Combined PDF for all service types at a location (multi-page).
- Option C: Let the user choose scope via a dropdown before download.
- **Decision: Option A** — Single service type per PDF. Consistent with the location-first, service-type-second drill-down pattern. If suppliers need all service types, they download one per tab. Simple and avoids a scope-selection dialog.

**CL-005: Should staff see the exact cap value inline on the approval dashboard, or only on hover/expand?**
- **Option A (Recommended): Show cap value inline in an additional column.** Staff need the cap value to make informed approve/reject decisions. Hiding it behind a hover or expand adds friction to a high-volume review task. The column header is "Cap" — short and fits the table.
- Option B: Show on hover (tooltip on the rate value).
- Option C: Show only in the expanded row detail section.
- **Decision: Option A** — Inline "Cap" column on the approval dashboard. Staff see: Supplier | Location | Service | Category | Rate | Cap | Actions. Clear comparison for quick decisions. Applied to approval dashboard wireframe.
