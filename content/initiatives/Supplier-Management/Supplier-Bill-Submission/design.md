---
title: "Design Brief: Supplier Invoice Uplift"
status: Draft
created: 2026-03-07
---

# Design Brief: Supplier Invoice Uplift

**Branch:** `feature/invoice-uplift`
**Spec Sources:** [SBS spec.md](../Supplier-Bill-Submission/spec.md) | [OHB spec.md](../On-Hold-Bills-Flow/spec.md)
**Scope:** Full SBS (all 6 stories) + OHB supplier-facing experience

---

## User Context

| Aspect | Decision | Impact on Design |
|--------|----------|------------------|
| **Primary User** | Supplier Administrator (manages invoices and team) | Needs zero-friction submission, clear status |
| **Secondary User** | Unauthenticated supplier (public form) | Needs simple one-shot form, no account required |
| **Device Priority** | Desktop-first (accounting/admin work) | Can use multi-column layouts, but keep actions obvious |
| **Usage Frequency** | Regular (weekly/monthly invoice cycles) | Worth investing in copy buttons, saved addresses, quick actions |
| **Context** | Busy, wants to submit and move on | Minimal steps, clear feedback, no unnecessary screens |

---

## Design Principles

**North Star:** Effortless submission — submitting and tracking invoices should feel like zero friction.

**Supporting Principles:**
1. **Show, don't ask** — Display the email address front and center; don't make suppliers hunt for it
2. **One glance status** — Supplier knows exactly where every bill is without clicking into it
3. **Privacy-preserving transparency** — Show suppliers what they need to act on, never expose client-specific internal reasons (OHB privacy rules)
4. **Progressive disclosure** — Simple surface, detail on demand (expand bill row → see on-hold reasons)

---

## Build Size

**Size:** Large

**Rationale:**
- 5+ supplier-facing screens modified or created
- New email address infrastructure (display, copy, per-client generation)
- New Clients page with tabbed interface (Agreements / Invoiced / Archived)
- New public bill submission form (unauthenticated)
- OHB supplier communication view (on-hold reasons, action required)
- Enhanced Bills list with status enrichment

---

## Scope

### MVP (This Branch)

**SBS Stories:**
- **US1 (P1)**: Submit invoice via email — backend ingestion already exists; this is about surfacing the email address
- **US2 (P1)**: View unique email address — dashboard + invoices page + copy button
- **US3 (P2)**: Per-client email addresses — generate/view on Clients page
- **US4 (P2)**: View Clients with Agreements — tabbed interface (All / With Agreements / Invoiced / Archived)
- **US5 (P3)**: View Archived Clients — separate tab
- **US6 (P2)**: Public bill submission form at `/bills`

**OHB Supplier-Side:**
- Supplier sees on-hold reasons on their bill (privacy-filtered)
- Three communication types visible: REJECT-RESUBMIT, REJECT PERIOD, ON HOLD
- Action-oriented messaging: "Fix these issues and resubmit" vs "No action needed" vs "Do not resubmit"
- Resubmit link in REJECT-RESUBMIT communications

### Deferred
- Per-client email auto-routing (FR-006 backend — email parsing/matching)
- AI auto-reject (OHB US2 — bill processor side)
- Department routing (OHB US3 — internal side)
- Cadence management (OHB US6 — system/cron side)
- Linked resubmissions tracking (OHB US9 — audit/analytics)

### Feature Flags
- `create-supplier-invoice` — Already exists, gates supplier bill creation
- `supplier-email-submission` — New flag for email address visibility + per-client emails
- `supplier-ohb-view` — New flag for on-hold reason display to suppliers
- `public-bill-form` — New flag for unauthenticated `/bills` route

---

## Constraints

### Security & Privacy (OHB Rules)
- Suppliers must NEVER see client-specific on-hold reasons
- Generic messaging: "Other processes are being completed" for internal-action reasons
- Only `Touches_Invoice = true` reasons shown to supplier with actionable detail
- `Requires_Internal_Action = true` reasons hidden behind generic wording
- Resolution Window: if resolved within 1 day, supplier never knows it existed

### Security (SBS)
- Inbound email domain validation: only accept from supplier's registered domain
- Public form: CAPTCHA required (in addition to rate limiting + honeypot)
- Email provider: **Postmark** inbound webhooks for email ingestion

### Accessibility
- WCAG AA target
- Copy buttons must have aria labels and screen reader feedback
- Email addresses must be selectable text (not just images)

### Dependencies
- `CreateBillFromEmail` action exists (webhook at `POST /api/webhook/{uuid}/bill-email`)
- Supplier portal auth and onboarding flow already complete
- `BillSourceEnum::EMAIL` already defined
- `ListPackagesForSupplier` derives client relationships from bills
- Postmark inbound webhook configuration required

---

## Page-by-Page Design

### 1. Supplier Dashboard (`Suppliers/Dashboard/SupplierDashboard.vue`)

**Changes:** Add email address callout

```
┌─────────────────────────────────────────────────────────┐
│  Welcome back, [Supplier Name]                          │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─ Submit invoices by email ──────────────────────┐   │
│  │  📧 invoices-abc123@inbound.trilogycare.com.au  │   │
│  │                                         [Copy]  │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  [Profile completion]  [Document issues]  [Quick links] │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 2. Supplier Bills List (`Suppliers/Bills/Index.vue`)

**Changes:** Email address in header + enriched status column with OHB reasons

```
┌──────────────────────────────────────────────────────────────┐
│  Invoices                                   [Submit Invoice] │
│                                                              │
│  ┌─ Submit via email ─────────────────────────────────────┐ │
│  │  invoices-abc123@inbound.trilogycare.com.au    [Copy]  │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌────────┬──────────┬──────────┬──────────┬─────────────┐  │
│  │ Ref    │ Client   │ Amount   │ Status   │ Action      │  │
│  ├────────┼──────────┼──────────┼──────────┼─────────────┤  │
│  │ #TC-01 │ Smith J  │ $450.00  │ ● Paid   │             │  │
│  │ #TC-02 │ Jones M  │ $320.00  │ ● Review │             │  │
│  │ #TC-03 │ Lee K    │ $180.00  │ ⚠ On Hold│ [View]      │  │
│  │        │          │          │ 2 issues │             │  │
│  │ #TC-04 │ Brown A  │ $95.00   │ ✕ Reject │ [Resubmit]  │  │
│  │        │          │          │ Fix ABN  │             │  │
│  └────────┴──────────┴──────────┴──────────┴─────────────┘  │
└──────────────────────────────────────────────────────────────┘
```

**Status enrichment:**
- **On Hold**: Shows issue count + generic summary. Expandable for detail.
- **Rejected (REJECT-RESUBMIT)**: Shows actionable reason + [Resubmit] button
- **Rejected (REJECT PERIOD)**: Shows "Do not resubmit" messaging, no action button
- **Other stages**: Standard badges (Draft, Submitted, In Review, Approved, Paid)

### 3. Supplier Bill Show (`Suppliers/Bills/Show.vue`)

**Changes:** On-hold/rejection reason panel for affected bills

```
┌──────────────────────────────────────────────────────────────┐
│  Invoice #TC-03                              ⚠ On Hold      │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌─ Action Required ───────────────────────────────────────┐│
│  │                                                         ││
│  │  This invoice is on hold. No action needed from you     ││
│  │  at this time — we're completing other processes.       ││
│  │                                                         ││
│  │  ── or ──                                               ││
│  │                                                         ││
│  │  This invoice needs corrections before it can be        ││
│  │  processed. Please fix the following and resubmit:      ││
│  │                                                         ││
│  │  ⊘ ABN/GST Error — ABN on invoice doesn't match        ││
│  │  ⊘ Calculation Error — Line items don't sum to total    ││
│  │                                                         ││
│  │                                        [Resubmit]       ││
│  └─────────────────────────────────────────────────────────┘│
│                                                              │
│  [Invoice details, line items, documents as existing...]     │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

### 4. Supplier Clients Page (`Suppliers/Clients/Index.vue`)

**Changes:** Tabbed interface + per-client email addresses

```
┌──────────────────────────────────────────────────────────────┐
│  Clients                                                     │
│                                                              │
│  [All (12)] [With Agreements (8)] [Invoiced (10)] [Archived] │
│                                                              │
│  ┌───────────────┬──────────────┬────────────────────────┐  │
│  │ Client        │ Package      │ Email                  │  │
│  ├───────────────┼──────────────┼────────────────────────┤  │
│  │ Smith, John   │ QY-566392    │ smith-abc@inbound...   │  │
│  │               │              │              [Copy]    │  │
│  │ Jones, Mary   │ QY-441283    │ [Generate Email]       │  │
│  │ Lee, Karen    │ QY-338291    │ lee-def@inbound...     │  │
│  │               │              │              [Copy]    │  │
│  └───────────────┴──────────────┴────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
```

**Tab logic:**
- **All**: Union of agreements + invoiced, deduplicated
- **With Agreements**: Supplier attached to client's budget items
- **Invoiced**: Supplier has submitted bills for this client (existing `ListPackagesForSupplier` logic)
- **Archived**: Client's package is inactive/archived

### 5. Public Bill Form (`/bills` — unauthenticated)

**Changes:** New standalone page, no portal auth required

```
┌──────────────────────────────────────────────────────────────┐
│  ╔══ Trilogy Care ══╗                                        │
│                                                              │
│  Submit an Invoice                                           │
│  ─────────────────                                           │
│                                                              │
│  ABN              [                        ]                 │
│  Supplier Name    [                        ]                 │
│  Client Name      [                        ]                 │
│  Invoice PDF      [Choose file...]                           │
│                                                              │
│  Services         [Select services ▾]                        │
│                   ☑ Personal Care                             │
│                   ☑ Domestic Assistance                       │
│                                                              │
│                                      [Submit Invoice]        │
│                                                              │
│  ─────────────────────────────────────────────────────────── │
│  Already have an account? [Log in to Supplier Portal]        │
└──────────────────────────────────────────────────────────────┘
```

**Post-submission:**
```
┌──────────────────────────────────────────────────────────────┐
│  ✓ Invoice Submitted                                         │
│                                                              │
│  Reference: #TC-4521                                         │
│  We'll process your invoice and notify you by email.         │
│                                                              │
│  [Submit Another]                                            │
└──────────────────────────────────────────────────────────────┘
```

---

## Component Inventory

### Existing Components (from Storybook)

| Component | Usage | Props/Variants |
|-----------|-------|----------------|
| `CommonBadge` | Bill status badges | `color="red/green/teal/amber"` |
| `CommonButton` | Copy, Resubmit, Submit actions | `variant="primary/outline/ghost"` |
| `CommonTabs` | Clients page tab navigation | `:items="[{title, count}]"` |
| `CommonTable` | Bills list, Clients list | Standard table props |
| `CommonModal` | Bill detail / reason detail | `side="center"` |
| `CommonAlert` | On-hold/rejection reason callout | `variant="warning/error/info"` |
| `CommonCopyButton` | Copy email to clipboard | `text="email"` (check if exists) |
| `CommonEmptyPlaceholder` | No clients, no bills | With action CTA |
| `CommonTooltip` | Hover explanations | Informational |

### New Components Required

| Component | Purpose | Notes |
|-----------|---------|-------|
| `SupplierEmailBanner` | Email address display + copy | Reused on dashboard + bills index |
| `BillStatusCell` | Enriched status in bills table | Shows stage + issue count/reason summary |
| `BillActionPanel` | On-hold/rejection detail on Show page | Privacy-filtered reasons + resubmit CTA |
| `ClientEmailCell` | Per-client email display/generate | Copy button or Generate button |

---

## States

### Loading States

| Context | Treatment |
|---------|-----------|
| Initial page load | Skeleton loader (existing pattern) |
| Email address loading | Pulsing placeholder text |
| Generating per-client email | Button spinner + "Generating..." |

### Empty States

| Context | Message | CTA |
|---------|---------|-----|
| No bills yet | "You haven't submitted any invoices yet" | [Submit Invoice] |
| No clients (All tab) | "No client relationships found" | — |
| No agreements | "You don't have formal agreements with any clients" | — |
| No archived clients | "No archived clients" | — |

### Error States

| Context | Treatment |
|---------|-----------|
| Copy failed | Toast: "Failed to copy — please select and copy manually" |
| Email generation failed | Inline error below Generate button |
| Public form validation | Inline field errors |

---

## Edge Cases

| Edge Case | How to Handle | Priority |
|-----------|---------------|----------|
| Supplier has no email token yet | Generate on first dashboard load (lazy creation) | P1 |
| Email copied but supplier doesn't know where to paste | Add "How it works" tooltip/link next to email | P2 |
| Bill on hold with only internal reasons | Show "Other processes being completed" — no actionable items | P1 |
| Bill rejected with REJECT PERIOD | Show "Do not resubmit" with clear explanation, NO resubmit button | P1 |
| Supplier has 100+ clients | Paginate or virtual-scroll Clients tabs | P3 |
| Public form — ABN not found | Create bill anyway, flag for manual supplier matching | P2 |
| Public form — spam/abuse | Rate limiting + honeypot field | P2 |
| Per-client email already exists | Show existing email, don't allow regeneration (MVP) | P2 |

---

## Next Steps

- [ ] `/trilogy-clarify design` — Refine UX/UI decisions
- [ ] `/trilogy-design-research` — Competitive research (optional)
- [ ] `/trilogy-mockup` — Interactive HTML prototypes for key screens
