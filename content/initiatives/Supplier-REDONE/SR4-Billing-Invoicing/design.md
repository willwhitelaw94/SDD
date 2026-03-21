---
title: "Design: Billing & Invoicing"
---

# Design: Billing & Invoicing

**Epic**: SR4-Billing-Invoicing
**Initiative**: Supplier REDONE
**Created**: 2026-03-19
**Status**: Draft
**Spec**: [spec.md](/initiatives/supplier-redone/sr4-billing-invoicing/spec)

---

## User Context

| Aspect | Decision | Impact on Design |
|--------|----------|------------------|
| **Primary User** | Supplier Administrator (creates/submits bills, tracks payments) | Needs fast submission, instant status clarity, zero ambiguity on rejections |
| **Secondary User** | Operations Bill Processor (reviews, approves, rejects) | Needs efficient queue, batch actions, one-click approve for clean bills |
| **Device Priority** | Desktop-first (accounting work), mobile-capable via API | Multi-column layouts for desktop, but bill creation must work on narrow screens |
| **Usage Frequency** | Daily — bills are the most frequently used feature | Worth investing in keyboard shortcuts, smart defaults, saved line item templates |
| **Context** | Suppliers want to submit and get paid. Operations wants to clear the queue. | Minimise steps to submission. Surface validation before submit, not after. |

---

## Design Principles

**North Star:** Bills flow from submission to payment with minimal friction and maximum transparency.

**Supporting Principles:**
1. **Validate early, not late** — Show budget/rate mismatches as the supplier builds the bill, not after they submit
2. **One-glance status** — Every bill's state is visible from the list without drilling in
3. **Progressive disclosure** — Simple list surface, rich detail on demand (expand for line items, timeline, rejection reasons)
4. **Trust through transparency** — Suppliers always know where their bill is, why it is there, and what to do next

---

## Build Size

**Size:** Extra Large

**Rationale:**
- Bill list page with multi-status filtering and rich status display
- Multi-step bill creation form (header + line items) with inline validation
- Bill detail/show page with line items, status timeline, rejection reasons
- On-hold view with reason display and write-off workflow
- AI invoice extraction upload + preview flow
- Express Pay eligibility badge and configuration
- Operations processing queue with batch actions
- Notification infrastructure (in-app bell + email)

---

## Scope

### MVP (P1)
- **US1**: Bill creation and submission (header + line items, validation, draft save)
- **US2**: Operations review and processing (queue, approve/reject/hold)
- **US3**: On-hold bill tracking and resolution (structured reasons, write-off)
- **US8**: Bill history and payment status (filterable list, detail view)

### Phase 2 (P2)
- **US4**: Batch bill processing (multi-select, bulk actions)
- **US5**: Automated validation and auto-approval (configurable rules)
- **US6**: Express Pay for verified suppliers (eligibility, fast-track payment)

### Phase 3 (P3)
- **US7**: AI invoice extraction (upload, extract, review, confirm)

### Feature Flags
- `supplier-bill-v2` — Gates all SR4 billing features in the supplier portal
- `bill-auto-approval` — Gates automated validation and auto-approval (US5)
- `express-pay` — Gates Express Pay eligibility display and fast-track processing (US6)
- `ai-invoice-extraction` — Gates AI document upload and extraction flow (US7)
- `bill-batch-processing` — Gates batch actions in the operations queue (US4)

---

## Constraints

### Technical
- Standalone React (Next.js) frontend with shadcn/ui + Tailwind
- TC brand: Navy `#2C4C79` primary, Teal `#007F7E` accent
- v2 API with token-based auth — bill creation is atomic (header + line items in one request)
- Maximum 100 line items per bill (FR-041)
- Extends existing bill domain (same `bills` table, adds `supplier_entity_id` FK)

### Business Rules
- Supplier-initiated transitions: Draft to Submitted only (FR-038)
- All other transitions are operations-only
- Partial approval: bill moves to Approved with adjusted total, rejected line items carry individual reasons (FR-039)
- Notifications: in-app + email for critical statuses (approved, rejected, on hold, paid) (FR-040)
- Auto-approval threshold configurable without code changes (FR-023)

### Accessibility
- WCAG AA target
- Status colours must have text/icon fallbacks (not colour-only)
- All interactive elements keyboard accessible
- Screen reader announcements for status changes and validation errors

---

## Page-by-Page Design

### 1. Bill List Page (`/bills`)

**Primary supplier view. Filterable by status, searchable, scoped to active supplier entity.**

**Default sort:** Most recently updated, descending. Keeps supplier focus on what changed last.

**Empty state:** When no bills exist, show an illustration with "No bills yet" heading and a "Create your first bill" CTA button. Per-tab empty states show contextual messages (e.g., "No rejected bills" for the Rejected tab).

```
┌──────────────────────────────────────────────────────────────────┐
│  Bills                                          [+ Create Bill]  │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  [All (47)] [Draft (3)] [Submitted (8)] [Approved (12)]          │
│  [Rejected (2)] [On Hold (4)] [Paid (18)]                        │
│                                                                  │
│  Search: [________________________]  Date: [From] — [To]         │
│                                                                  │
│  ┌────────┬────────────┬────────────┬──────────┬───────────────┐ │
│  │ Ref    │ Recipient  │ Amount     │ Status   │ Submitted     │ │
│  ├────────┼────────────┼────────────┼──────────┼───────────────┤ │
│  │ #B-101 │ Smith, J   │ $1,240.00  │ ● Paid   │ 12 Mar 2026   │ │
│  │        │            │            │ 15 Mar   │               │ │
│  │ #B-102 │ Jones, M   │ $890.00    │ ◐ Review │ 14 Mar 2026   │ │
│  │ #B-103 │ Lee, K     │ $450.00    │ ⚠ Hold   │ 10 Mar 2026   │ │
│  │        │            │            │ Missing  │               │ │
│  │        │            │            │ docs     │               │ │
│  │ #B-104 │ Brown, A   │ $320.00    │ ✕ Reject │ 13 Mar 2026   │ │
│  │        │            │            │ Rate     │               │ │
│  │        │            │            │ exceeds  │ [Resubmit]    │ │
│  │ #B-105 │ Chen, L    │ $1,800.00  │ ◇ Draft  │ —             │ │
│  │        │            │            │          │ [Continue]    │ │
│  └────────┴────────────┴────────────┴──────────┴───────────────┘ │
│                                                                  │
│  Showing 1-20 of 47                        [← Prev] [Next →]    │
└──────────────────────────────────────────────────────────────────┘
```

**Status badge design:**
- `Draft` — Grey outline badge, dashed border
- `Submitted` — Navy filled badge
- `In Review` — Navy half-filled badge
- `Approved` — Teal filled badge
- `Paid` — Teal filled badge with checkmark, payment date shown
- `Approved (partial)` — Teal outline badge with "(partial)" suffix, showing adjusted total
- `Rejected` — Red filled badge with reason preview + Resubmit action
- `On Hold` — Amber filled badge with reason preview

**Express Pay indicator** (when eligible):
```
┌──────────────────────────────────────────┐
│  ⚡ Express Pay Active                    │
│  Eligible bills are fast-tracked for     │
│  payment within 5 business days          │
└──────────────────────────────────────────┘
```
Displayed as a banner above the bill list when the supplier qualifies.

---

### 2. Bill Creation Form (`/bills/create`)

**Multi-step form: Header → Line Items → Review & Submit. Atomic submission.**

#### Step 1: Bill Header

```
┌──────────────────────────────────────────────────────────────────┐
│  Create Bill                                                     │
│                                                                  │
│  Step 1 of 3: Bill Details                                       │
│  ●───────────○───────────○                                       │
│  Details     Line Items  Review                                  │
│                                                                  │
│  ┌─ Upload Invoice (Optional) ─────────────────────────────────┐│
│  │                                                              ││
│  │  📄 Drop an invoice PDF/image here or [Browse Files]         ││
│  │                                                              ││
│  │  AI will extract line items to pre-populate the form         ││
│  └──────────────────────────────────────────────────────────────┘│
│                                                                  │
│  Recipient       [Select recipient ▾]                            │
│                  Linked to assessment: QY-566392                 │
│                                                                  │
│  Invoice Ref     [________________________]                      │
│  Invoice Date    [____/____/________]                             │
│                                                                  │
│                                      [Save Draft] [Next →]       │
└──────────────────────────────────────────────────────────────────┘
```

#### Step 2: Line Items

```
┌──────────────────────────────────────────────────────────────────┐
│  Create Bill                                                     │
│                                                                  │
│  Step 2 of 3: Line Items                                         │
│  ●───────────●───────────○                                       │
│  Details     Line Items  Review                                  │
│                                                                  │
│  Bill for: Smith, John (QY-566392)                               │
│                                                                  │
│  ┌─ Line Item 1 ──────────────────────────────────────────────┐ │
│  │ Service Type  [Personal Care ▾]          ✓ In budget        │ │
│  │ Date          [14/03/2026]                                  │ │
│  │ Units         [3.5]    Rate [$65.00]     Total: $227.50    │ │
│  │                                          ✓ Within agreed   │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  ┌─ Line Item 2 ──────────────────────────────────────────────┐ │
│  │ Service Type  [Transport ▾]              ⚠ Not in budget    │ │
│  │ Date          [14/03/2026]                                  │ │
│  │ Units         [1.0]    Rate [$45.00]     Total: $45.00     │ │
│  │                                                             │ │
│  │ ⚠ "Transport" is not in Smith, John's current budget.       │ │
│  │   This bill may be rejected.                                │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  [+ Add Line Item]                                               │
│                                                                  │
│  ────────────────────────────────────────────────────────────── │
│  Bill Total: $272.50                                             │
│                                                                  │
│                              [← Back] [Save Draft] [Next →]     │
└──────────────────────────────────────────────────────────────────┘
```

**Line item editor layout:** Editable data table (shadcn DataTable with inline editing). Each row is a line item with Service Type, Date, Units, Rate, Total, and validation indicator columns. "Add Row" button at bottom. This table format is faster for daily billing use with many line items (up to 100) and matches accounting software conventions. Card layout only used if 1-2 items.

**Inline validation indicators:**
- `✓ In budget` — Teal text, service type found in recipient's budget
- `⚠ Not in budget` — Amber warning with explanation
- `✓ Within agreed` — Teal text, rate matches supplier pricing
- `⚠ Rate exceeds agreed ($X)` — Amber warning showing the difference
- Validation fires on field blur, not on submit

#### Step 3: Review & Submit

```
┌──────────────────────────────────────────────────────────────────┐
│  Create Bill                                                     │
│                                                                  │
│  Step 3 of 3: Review & Submit                                    │
│  ●───────────●───────────●                                       │
│  Details     Line Items  Review                                  │
│                                                                  │
│  Recipient:    Smith, John (QY-566392)                           │
│  Invoice Ref:  INV-2026-0341                                     │
│  Invoice Date: 14 Mar 2026                                       │
│                                                                  │
│  ┌──────────────────┬────────┬────────┬─────────┬──────────┐    │
│  │ Service          │ Date   │ Units  │ Rate    │ Total    │    │
│  ├──────────────────┼────────┼────────┼─────────┼──────────┤    │
│  │ Personal Care    │ 14 Mar │ 3.5    │ $65.00  │ $227.50  │    │
│  │ Transport        │ 14 Mar │ 1.0    │ $45.00  │ $45.00   │    │
│  └──────────────────┴────────┴────────┴─────────┴──────────┘    │
│                                                                  │
│  ┌─ Validation Summary ──────────────────────────────────────┐  │
│  │ ⚠ 1 warning: "Transport" not in recipient's budget        │  │
│  │   This bill can still be submitted but may be rejected.    │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
│  Bill Total: $272.50                                             │
│                                                                  │
│                              [← Back] [Save Draft] [Submit]      │
└──────────────────────────────────────────────────────────────────┘
```

**Post-submit confirmation:**
```
┌──────────────────────────────────────────────────────────────────┐
│                                                                  │
│  ✓ Bill #B-106 Submitted                                         │
│                                                                  │
│  Your bill for $272.50 has been submitted for review.            │
│  You'll receive a notification when it's processed.              │
│                                                                  │
│  ⚡ Express Pay: This bill qualifies for fast-track payment.     │
│     Estimated payment: 21 Mar 2026                               │
│                                                                  │
│  [View Bill]  [Create Another]  [Back to Bills]                  │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

---

### 3. AI Invoice Extraction Preview (`/bills/create` — upload flow)

**Triggered when a supplier uploads an invoice document in Step 1.**

```
┌──────────────────────────────────────────────────────────────────┐
│  AI Invoice Extraction                                           │
│                                                                  │
│  ┌─ Uploaded Document ──┐  ┌─ Extracted Data ────────────────┐  │
│  │                      │  │                                  │  │
│  │  ┌──────────────┐   │  │  Invoice Ref: [INV-2026-0341]    │  │
│  │  │              │   │  │               🤖 AI-extracted     │  │
│  │  │  [PDF/Image  │   │  │                                  │  │
│  │  │   Preview]   │   │  │  Invoice Date: [14/03/2026]      │  │
│  │  │              │   │  │                🤖 AI-extracted     │  │
│  │  │              │   │  │                                  │  │
│  │  │              │   │  │  Line Items:                      │  │
│  │  │              │   │  │  ┌────────────────────────────┐  │  │
│  │  │              │   │  │  │ 1. Personal Care           │  │  │
│  │  │              │   │  │  │    Date: 14/03/2026        │  │  │
│  │  │              │   │  │  │    Units: 3.5  Rate: $65   │  │  │
│  │  │              │   │  │  │    🤖 AI-extracted          │  │  │
│  │  │              │   │  │  ├────────────────────────────┤  │  │
│  │  │              │   │  │  │ 2. Transport               │  │  │
│  │  │              │   │  │  │    Date: 14/03/2026        │  │  │
│  │  └──────────────┘   │  │  │    Units: 1.0  Rate: ___  │  │  │
│  │                      │  │  │    ⚠ Could not extract    │  │  │
│  │                      │  │  │      rate — enter manually │  │  │
│  │                      │  │  └────────────────────────────┘  │  │
│  └──────────────────────┘  │                                  │  │
│                             │  [Clear All]  [Use Extracted →]  │  │
│                             └──────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────┘
```

**Extraction states:**
- **Processing** — Spinner with "Extracting invoice data..." (target < 30 seconds)
- **Success** — Side-by-side: original document left, extracted fields right
- **Partial** — Fields with low confidence left blank with "Could not extract" note
- **Failed** — "We couldn't read this document. Please enter details manually." with manual entry fallback
- All extracted fields editable and marked with `🤖 AI-extracted — please verify`

---

### 4. Bill Detail / Show Page (`/bills/:id`)

**Full bill detail with status timeline, line items, and contextual actions.**

```
┌──────────────────────────────────────────────────────────────────┐
│  ← Back to Bills                                                 │
│                                                                  │
│  Bill #B-103                                          ⚠ On Hold  │
│  Smith, John (QY-566392)                                         │
│  Submitted: 10 Mar 2026    Total: $450.00                        │
│                                                                  │
│  ┌─ Status Timeline ─────────────────────────────────────────┐  │
│  │                                                            │  │
│  │  ● Draft        ● Submitted       ● In Review  ◌ Approved │  │
│  │  8 Mar          10 Mar            11 Mar        —         │  │
│  │                                      │                     │  │
│  │                                      ▼                     │  │
│  │                                   ⚠ On Hold               │  │
│  │                                   11 Mar                   │  │
│  │                                   Missing documentation    │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌─ Action Required ─────────────────────────────────────────┐  │
│  │                                                            │  │
│  │  This bill is on hold: Missing documentation               │  │
│  │                                                            │  │
│  │  Please upload the signed service agreement for            │  │
│  │  Smith, John to continue processing.                       │  │
│  │                                                            │  │
│  │  On hold since: 11 Mar 2026 (8 days)                       │  │
│  │                                                            │  │
│  │  [Upload Document]                                         │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌─ Line Items ──────────────────────────────────────────────┐  │
│  │ ┌──────────────────┬────────┬───────┬────────┬─────────┐ │  │
│  │ │ Service          │ Date   │ Units │ Rate   │ Total   │ │  │
│  │ ├──────────────────┼────────┼───────┼────────┼─────────┤ │  │
│  │ │ Personal Care    │ 10 Mar │ 4.0   │ $65.00 │ $260.00 │ │  │
│  │ │ Domestic Assist. │ 10 Mar │ 2.0   │ $55.00 │ $110.00 │ │  │
│  │ │ Transport        │ 10 Mar │ 2.0   │ $40.00 │ $80.00  │ │  │
│  │ └──────────────────┴────────┴───────┴────────┴─────────┘ │  │
│  │                                         Total: $450.00    │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌─ Attached Documents ──────────────────────────────────────┐  │
│  │  📄 INV-2026-0312.pdf (uploaded 10 Mar)         [View]    │  │
│  └────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────┘
```

**Contextual action panels by status:**
- **On Hold** — Shows hold reason, days on hold, required action, upload button if docs needed
- **Rejected** — Shows rejection reason per line item, "Create Corrected Resubmission" button (pre-populates form with original data)
- **Approved (partial)** — Shows "Approved (partial)" badge with adjusted total. Approved line items show teal checkmarks. Rejected line items show red indicators with individual rejection reasons. The list view shows the approved total amount.
- **Paid** — Shows payment date, reference number, payment method
- **Approved** — Shows approval date, Express Pay estimated payment date if eligible
- **Draft** — Shows "Continue Editing" and "Discard" buttons

**Overdue hold indicator** (> 14 days):
```
  ┌─ ⚠ Overdue ────────────────────────────────────────────┐
  │  This bill has been on hold for 18 days.                 │
  │  On hold since: 1 Mar 2026                               │
  │  Reason: Budget query                                    │
  └──────────────────────────────────────────────────────────┘
```

---

### 5. On-Hold Bills View (filtered from Bill List)

**Accessed via the "On Hold" tab in the bill list. Adds hold-specific columns.**

```
┌──────────────────────────────────────────────────────────────────┐
│  Bills > On Hold (4)                                             │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌────────┬───────────┬──────────┬─────────────┬──────┬───────┐ │
│  │ Ref    │ Recipient │ Amount   │ Hold Reason │ Days │ Action│ │
│  ├────────┼───────────┼──────────┼─────────────┼──────┼───────┤ │
│  │ #B-103 │ Smith, J  │ $450.00  │ Missing     │ 🔴 18│ Upload│ │
│  │        │           │          │ docs        │      │       │ │
│  │ #B-107 │ Jones, M  │ $320.00  │ Budget      │ ⚫ 6 │ —     │ │
│  │        │           │          │ query       │      │       │ │
│  │ #B-109 │ Lee, K    │ $180.00  │ Recipient   │ 🔴 21│ —     │ │
│  │        │           │          │ dispute     │      │       │ │
│  │ #B-112 │ Chen, L   │ $95.00   │ Supplier    │ ⚫ 2 │ Reply │ │
│  │        │           │          │ query       │      │       │ │
│  └────────┴───────────┴──────────┴─────────────┴──────┴───────┘ │
│                                                                  │
│  🔴 = Overdue (>14 days)                                         │
└──────────────────────────────────────────────────────────────────┘
```

**Write-off workflow (operations side):**
```
┌──────────────────────────────────────────────────────────────┐
│  Write Off Bill #B-109                                       │
│                                                              │
│  Bill: Lee, Karen — $180.00                                  │
│  On hold since: 28 Feb 2026 (21 days)                        │
│  Hold reason: Recipient dispute                              │
│                                                              │
│  Write-off Reason:                                           │
│  [________________________________________]                  │
│  [________________________________________]                  │
│                                                              │
│  ⚠ Write-offs require senior processor approval.             │
│    This will be sent to [Senior Processor] for review.       │
│                                                              │
│                          [Cancel]  [Submit for Approval]     │
└──────────────────────────────────────────────────────────────┘
```

---

### 6. Operations Processing Queue (`/ops/bills`)

**Operations staff view for reviewing and processing submitted bills.**

```
┌──────────────────────────────────────────────────────────────────┐
│  Bill Processing Queue                        Assigned to: You   │
│                                                                  │
│  [All (34)] [Submitted (12)] [In Review (8)] [On Hold (4)]      │
│  [Auto-Approved (10)]                                            │
│                                                                  │
│  Filter: Supplier [▾]  Recipient [▾]  Flags [▾]                 │
│                                                                  │
│  ☐ Select All                              [Batch Actions ▾]    │
│                                                                  │
│  ┌──┬────────┬───────────┬───────────┬────────┬──────┬────────┐ │
│  │☐ │ Ref    │ Supplier  │ Recipient │ Amount │ Flags│ Action │ │
│  ├──┼────────┼───────────┼───────────┼────────┼──────┼────────┤ │
│  │☐ │ #B-102 │ ABC Care  │ Jones, M  │ $890   │ ✓✓✓✓ │[Approve│ │
│  │  │        │           │           │        │      │        │ │
│  │☐ │ #B-106 │ XYZ Svcs  │ Smith, J  │ $272   │ ✓✓⚠✓ │[Review]│ │
│  │  │        │           │           │        │ Rate │        │ │
│  │☐ │ #B-108 │ ABC Care  │ Lee, K    │ $540   │ ✓✓✓⚠ │[Review]│ │
│  │  │        │           │           │        │ Dup? │        │ │
│  └──┴────────┴───────────┴───────────┴────────┴──────┴────────┘ │
│                                                                  │
│  Flags: ✓ Budget  ✓ Rate  ✓ Verified  ✓ No Dup                  │
│                                                                  │
│  ┌─ Batch Actions ─────────────────────┐                        │
│  │  ☑ 3 bills selected ($1,702.00)     │                        │
│  │                                     │                        │
│  │  [Approve All] [Reject All] [Hold]  │                        │
│  └─────────────────────────────────────┘                        │
└──────────────────────────────────────────────────────────────────┘
```

**Validation flag columns** (4 mini-indicators per bill):
- Budget match: ✓ or ⚠
- Rate within tolerance: ✓ or ⚠
- Supplier verified: ✓ or ⚠
- No duplicate: ✓ or ⚠

Bills with all ✓ show a one-click `[Approve]` button. Bills with any ⚠ show `[Review]`.

---

### 7. Notifications

**In-app notification bell (header component):**

```
┌─────────────────────────────────────────┐
│  🔔 (3)                                 │
│  ┌───────────────────────────────────┐  │
│  │ ● Bill #B-102 Approved            │  │
│  │   $890.00 — Jones, M              │  │
│  │   2 hours ago                     │  │
│  ├───────────────────────────────────┤  │
│  │ ● Bill #B-098 Paid                │  │
│  │   $1,200.00 — Ref: PAY-20260315  │  │
│  │   5 hours ago                     │  │
│  ├───────────────────────────────────┤  │
│  │ ● Bill #B-103 On Hold             │  │
│  │   Missing documentation required  │  │
│  │   1 day ago                       │  │
│  └───────────────────────────────────┘  │
│  [View all notifications]               │
└─────────────────────────────────────────┘
```

**Email notifications sent for:**
- Bill approved (includes amount, payment timeline)
- Bill rejected (includes reason, link to resubmit)
- Bill placed on hold (includes reason, required action)
- Bill paid (includes payment reference, amount)
- Express Pay status granted or revoked

---

## Component Inventory

| Component | Type | Notes |
|-----------|------|-------|
| `BillListPage` | Page | Filterable table with status tabs |
| `BillCreateForm` | Page | Multi-step: Header → Line Items → Review |
| `BillDetailPage` | Page | Status timeline, line items, contextual actions |
| `BillLineItemEditor` | Form section | Inline validation, add/remove line items |
| `StatusBadge` | Shared | Coloured badge with icon per status |
| `StatusTimeline` | Detail section | Horizontal timeline showing bill progression |
| `ValidationIndicator` | Inline | Budget/rate check result display |
| `InvoiceUploadZone` | Form section | Drag-drop with AI extraction trigger |
| `ExtractionPreview` | Modal/panel | Side-by-side document + extracted fields |
| `ExpressPayBanner` | Banner | Eligibility display above bill list |
| `HoldReasonPanel` | Detail section | Action required display for on-hold bills |
| `RejectionReasonPanel` | Detail section | Per-line-item rejection reasons + resubmit |
| `WriteOffDialog` | Dialog | Write-off reason + senior approval routing |
| `BatchActionBar` | Toolbar | Multi-select actions for operations queue |
| `NotificationBell` | Header | In-app notification dropdown |
| `ProcessingQueue` | Page | Operations bill review with filters + batch |

---

## Interaction Patterns

### Bill Creation Flow
1. Supplier clicks "Create Bill" → Step 1 (Header)
2. Optional: Upload invoice → AI extraction → pre-populate fields
3. Select recipient → system loads available assessments/budget
4. Step 2: Add line items → inline validation fires on blur
5. Step 3: Review → see validation summary → Submit or Save Draft
6. Post-submit: confirmation with Express Pay status if eligible

**Draft save behaviour:** Auto-save triggers on step navigation (Next/Back). Explicit "Save Draft" button available for mid-step saves. A subtle "Saved" / "Saving..." indicator shows near the button. No periodic auto-save to avoid complexity.

### Rejection → Resubmission Flow
1. Supplier sees rejected bill in list with reason preview
2. Clicks into detail → sees per-line-item rejection reasons
3. Clicks "Create Corrected Resubmission" → new bill form pre-populated with original data
4. Supplier fixes flagged issues → submits new bill
5. New bill created with a `resubmission_of` link to the original — two distinct records in the list, linked in audit trail. The original bill detail page shows a "Resubmitted as #B-XXX" link.

### On-Hold Resolution Flow
1. Supplier sees hold reason and required action on bill detail
2. Uploads requested document or responds to query
3. System automatically returns bill to processing queue (FR-019)
4. Supplier sees status change to "In Review" + notification

### Batch Processing Flow (Operations)
1. Filter queue by supplier + validation status
2. Select multiple clean bills (all ✓ flags)
3. Click "Approve All" → confirmation dialog showing count and total
4. System records individual audit entries per bill (FR-021)
5. Next bill in queue auto-presented after batch completes

---

## Clarification Log

| # | Phase | Question | Decision | Rationale |
|---|-------|----------|----------|-----------|
| 1 | UX | Bill list default sort and empty state | Sort by "most recently updated" desc; empty state with illustration + "Create your first bill" CTA | Keeps focus on recent activity; illustration reduces first-use confusion |
| 2 | UX | Draft auto-save vs explicit save | Auto-save on step navigation (Next/Back); explicit "Save Draft" for mid-step | Covers main data-loss scenario without conflict resolution complexity |
| 3 | UX | Resubmission identity — new bill or version? | New bill with `resubmission_of` back-link to original | Simpler for API (atomic creation), no version confusion; audit trail link satisfies traceability |
| 4 | UI | Line item editor layout — cards vs table | Editable data table (shadcn DataTable with inline editing) for 3+ items | Faster for daily billing at scale; matches accounting software conventions |
| 5 | UI | Partial approval display (supplier side) | "Approved (partial)" badge with adjusted total; detail view shows per-line accept/reject | Keeps list clean with single badge; detail view provides full transparency |
