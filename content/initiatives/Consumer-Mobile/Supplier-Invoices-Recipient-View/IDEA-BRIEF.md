---
title: "Idea Brief: Supplier Invoices — Recipient View (MOB-INV)"
description: "Consumer Mobile > Supplier Invoices — Recipient View"
icon: i-heroicons-light-bulb
navigation:
  order: 1
---

# Idea Brief: Supplier Invoices — Recipient View (MOB-INV)

**Created**: 2026-03-26
**Epic Code**: MOB-INV
**Initiative**: Consumer Mobile

---

## Problem Statement (What)

- Clients currently see invoice information cluttered with internal details they don't need or understand — GST, GST status, bank details, care recipient info, invoice reference, and legal entity name
- Internal-only statuses (Draft, Submitted, Escalated) are visible to clients even though no actionable content exists at those stages — the client sees nothing useful because no line items have been mapped yet
- When a bill goes On Hold or is Rejected, clients receive no explanation and resort to calling Intercom support to ask why — this is a top driver of support tickets
- The existing recipient portal shows supplier-uploaded PDFs directly, which can contain inappropriate notes (e.g., carer commentary about client behaviour) with no redaction mechanism
- Clients cannot easily find a specific invoice — there is no search, filtering by service type/date/amount/status, or sorting beyond default order
- The current bill detail view does not break down fees in a way that's transparent to clients (coordinator fee vs loading fee vs service amount)

**Current State**: Clients access invoices through the existing recipient portal web view. The table shows all internal fields. Clicking through to a bill shows their own care recipient info (redundant), GST details, bank details, and raw supplier PDFs. The bill ID is the primary identifier used in support conversations, but there's no easy way to search by it.

---

## Possible Solution (How)

Build a simplified, client-friendly Supplier Invoices section within the mobile app and web portal that surfaces only what clients need to see, with clear status explanations and robust search/filter capabilities.

- **Curated invoice list** — show only bill ID, invoice date, supplier name, total amount, and a client-friendly status badge. Hide bills in Draft/Submitted/Escalated stages entirely
- **Search** — full-text search across bill ID, supplier name, and service types
- **Filters** — service type (multi-select), date range (specific or monthly quick-select), amount range (slider), status (multi-select) via mobile bottom sheets
- **Sorting** — Most Recent, Oldest First, Amount High-to-Low, Amount Low-to-High
- **Clean detail view** — bill ID, supplier name, status, invoice date, due date, and a transparent cost breakdown (service amount, discount, coordinator fee if applicable, loading fee, total)
- **Status rationale** — when a bill is On Hold or Rejected, show a client-safe reason and description so clients understand without calling support
- **Expandable line items** — "View Items In This Invoice" section showing individual transactions with navigation to transaction detail

```
// Before (Current)
1. Client opens invoice table → sees GST, bank details, internal statuses
2. Client clicks bill → sees their own care recipient info, raw supplier PDF
3. Bill goes On Hold → client sees "On Hold" with no explanation
4. Client calls Intercom → "Why is my invoice on hold?"

// After (New)
1. Client opens Supplier Invoices → clean list with ID, supplier, amount, status
2. Client clicks bill → transparent fee breakdown, no internal clutter
3. Bill goes On Hold → callout explains the reason in plain language
4. Client understands without contacting support
```

---

## Benefits (Why)

**Client Experience**:
- Reduced confusion: removing 6+ irrelevant fields from invoice views
- Self-service clarity: clients understand On Hold/Rejected reasons without calling support
- Faster navigation: search + filters replace manual scrolling through all historic invoices

**Operational Efficiency**:
- Reduced Intercom volume: status rationale addresses a top category of support queries ("Why is my bill on hold?")
- No PDF redaction needed: supplier-uploaded PDFs are excluded from the client view entirely, eliminating the risk of inappropriate content

**Business Value**:
- Increased client trust through billing transparency (fee breakdown visible)
- Foundation for future approval/rejection workflows (out of scope for MVP but designed for)
- Aligns with the Consumer Mobile initiative's goal of mobile-first self-service

---

## Owner & Stakeholders

| Role | Person |
|------|--------|
| **R** | Will Whitelaw |
| **A** | Beth Poultney |
| **C** | Vishal Asai, Care Partner team leads |
| **I** | Clinical team, Finance team |

---

## Assumptions & Dependencies, Risks

**Assumptions**:
- The existing Bill model and relationships (Bill → BillItem → Service) provide all data needed for the client-facing views
- Bill stages Draft, Submitted, and Escalated should be completely hidden from clients (no mapped line items = nothing to show)
- The bill ID is the primary identifier clients reference in support conversations — it must be prominent and searchable
- Mobile bottom sheets are the established UX pattern for filters in the app (consistent with other areas)

**Dependencies**:
- Consumer Mobile V1 (MOB1) — the mobile app shell, authentication, and navigation must be in place
- Existing mobile API infrastructure on the `mobile-api` branch
- On Hold reasons need a client-safe mapping defined (product/business decision on which of the 30+ internal reasons are client-visible and what wording to use)

**Risks**:
- On Hold reason mapping requires business input to define client-safe wording for each reason (MEDIUM) → Mitigation: launch with a generic "This invoice is being reviewed" fallback; add specific reasons incrementally as business defines them
- Legal entity name and invoice reference — unclear if legally required to display (LOW) → Mitigation: include behind a config toggle; confirm with compliance before launch
- Large invoice history for long-term clients could affect list performance (LOW) → Mitigation: paginated API with efficient query scoping

---

## Estimated Effort

**Small-Medium (2-3 sprints)**

- **Sprint 1**: Invoice list API + view, search, detail view with fee breakdown
- **Sprint 2**: Filters (service type, date, amount, status), sorting, status rationale
- **Sprint 3**: Line item expansion, transaction navigation, polish, QA

---

## Proceed to PRD?

**YES** — Figma designs are complete, existing internal bill infrastructure is mature, and this is a core part of the Consumer Mobile billing experience. Client support tickets around invoice transparency confirm real demand.

---

## Decision

- [ ] **Approved** - Proceed to PRD
- [ ] **Needs More Information**
- [ ] **Declined**

**Approval Date**: ____

---

## Next Steps

**If Approved**:
1. [ ] Create PRD (spec.md)
2. [ ] Confirm On Hold reason client-safe mapping with business
3. [ ] Confirm legal entity name requirement with compliance
4. [ ] Break down into implementation tasks
