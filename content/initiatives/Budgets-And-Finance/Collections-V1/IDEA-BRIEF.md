---
title: "Idea Brief: Collections V1 (COL)"
description: "Budgets And Finance > Collections V1"
icon: i-heroicons-light-bulb
navigation:
  order: 1
---

**Epic Code**: COL (TP-2329) | **Created**: 2026-01-14

---

## Problem Statement (What)

Care packages lack visibility into AR (Accounts Receivable) invoices from MYOB, and there is no streamlined mechanism for Direct Debit enrollment for contributions.

**Pain Points:**
- Recipients, coordinators, and finance teams cannot view contribution invoices from MYOB in the Portal
- Manual AR tracking is time-consuming and error-prone
- No Direct Debit enrollment mechanism for contribution payments
- Late payment follow-ups are manual and inconsistent
- Payment timeliness and data accuracy suffer from disconnected systems

**Current State**: Manual AR workflows, no invoice visibility, manual payment collection, inconsistent follow-ups.

---

## Possible Solution (How)

Deliver AR Invoice Visibility & Direct Debit Enrollment capability for care packages:

- **AR Invoice Visibility**: Display contribution invoices from MYOB in the Portal (read-only)
- **MYOB Integration**: Sync invoices via MYOB API on hourly schedule
- **Direct Debit Enrollment**: 3-step modal for DD mandate creation with bank account validation
- **Permission Control**: VIEW_FINANCIALS permission controls access to invoice and DD data
- **Consent Workflow**: Proper consent capture for Direct Debit mandates

```
// Before (Current)
1. Manual AR tracking
2. No invoice visibility in Portal
3. Manual payment collection
4. Inconsistent follow-ups

// After (With COL)
1. Invoice visibility from MYOB
2. Direct Debit enrollment
3. Automated payment collection
4. Reduced late payments
```

**Phase Breakdown:**
- Phase 1 (AR Invoice Visibility): Data model, MYOB sync, frontend pages — 1.5 sprints
- Phase 2 (DD Enrollment): Mandate model, 3-step modal, consent workflow — 1-1.5 sprints

---

## Benefits (Why)

**User/Client Experience:**
- Recipients can view their contribution invoices in the Portal
- Streamlined Direct Debit enrollment reduces payment friction

**Operational Efficiency:**
- 40-50% reduction in manual AR tracking time
- Zero late-payment follow-ups for DD-enrolled packages

**Business Value:**
- Payment timeliness — DD automation improves collection rates
- Financial transparency — improved NPS (target +10 points)
- Compliance — proper consent capture for DD mandates

---

## Owner & Stakeholders

| Role | Person |
|------|--------|
| **R** | Mellette Opena-Fitzpatrick (PO), Marlèze Scheepers (PO), Steven Boge (BA), Ed King (Des), Khoa Duong (Dev) |
| **A** | Marko Rukovina |
| **C** | Marko Rukovina |
| **I** | — |

---

## Assumptions, Dependencies & Risks

**Assumptions:**
- HCP-Contribution category accurately identifies all contribution invoices in MYOB
- VIEW_FINANCIALS permission controls access to invoice and DD data
- BSB/account validation rules follow Australian financial standards
- MYOB API is available and stable for hourly sync

**Dependencies:**
- MYOB integration readiness (API-014)
- Direct Debit scheme compliance (APRA guidelines)
- Permission system implementation (PERM-006)
- Budget V2 completion for package reference data

**Risks:**
- MYOB sync delays could lead to stale invoice data (MEDIUM impact, MEDIUM probability) → Fallback manual refresh
- High DD enrollment failure rates if UX is unclear (MEDIUM impact, MEDIUM probability) → Coordinator training and simplified 3-step flow
- Regulatory changes to DD mandate requirements (LOW impact, LOW probability) → Compliance review gate before launch

---

## Success Metrics

- 70%+ DD adoption within 3 months post-launch
- 40-50% reduction in manual AR tracking time
- Zero late-payment follow-ups for DD-enrolled packages
- NPS improvement of +10 points for financial transparency

---

## Estimated Effort

**M (Medium) — 2.5-3 sprints**

- Sprint 1-1.5: Phase 1 — AR Invoice Visibility (data model, MYOB sync, frontend pages)
- Sprint 2-3: Phase 2 — DD Enrollment (mandate model, 3-step modal, consent workflow)

**Target Launch**: Sept 2025 (pre-SAH go-live Nov 2025)

---

## Decision

- [x] **Approved** — Proceed to specification
- [ ] **Needs More Information**
- [ ] **Declined**

---

## Next Steps (If Approved)

1. Validate MYOB API readiness
2. Review DD compliance requirements with legal
3. `/speckit.specify` — Create detailed technical specification
