---
title: "Idea Brief: Invoices V2 (IV2)"
description: "Budgets And Finance > Invoices V2"
icon: i-heroicons-light-bulb
navigation:
  order: 1
---

**Epic Code**: IV2 (TP-1864) | **Created**: 2026-01-14

---

## Problem Statement (What)

Invoice processing lacks automation and integration, with manual workflows creating bottlenecks and errors.

**Pain Points:**
- Invoice processing relies heavily on manual data entry and validation
- Multiple siloed BRP action items (Invoices V2, Query Invoice, Auto-Approve Invoice, Dispute Invoice) create fragmented workflows
- Manual processing creates bottlenecks in billing workflow
- No structured resolution processes for invoice queries and disputes
- High error rate requires significant rework and manual correction

**Current State**: Manual invoice processing, fragmented workflows, high error rate, slow payment timelines.

---

## Possible Solution (How)

Deliver a fully integrated, automation-driven invoice pipeline from receipt through to payment:

- **AI-Based Anomaly Detection**: Automated flagging of invoices with potential issues
- **Query Workflow**: Structured process for internal invoice query resolution
- **Dispute Workflow**: Formal challenge mechanism for invoice disputes
- **Auto-Approval**: Automated approval for invoices meeting defined criteria
- **MYOB Integration**: Seamless sync with financial systems
- **Claims Submission**: Integrated pipeline to SAH claims process

```
// Before (Current)
1. Manual invoice processing
2. Fragmented workflows
3. High error rate
4. Slow payment timelines

// After (With IV2)
1. AI-assisted processing
2. Unified workflow
3. Reduced errors
4. Faster payments
```

---

## Benefits (Why)

**User/Client Experience:**
- Faster invoice processing and payment
- Clear visibility into invoice status and disputes

**Operational Efficiency:**
- 30-50% reduction in average invoice processing time
- Invoices pending approval >5 days reduced to <10% of total

**Business Value:**
- Compliance — SAH-compliant invoice pipeline
- Accuracy — AI anomaly detection reduces errors
- Client satisfaction — improved billing satisfaction scores

---

## Owner & Stakeholders

| Role | Person |
|------|--------|
| **R** | Mellette Opena-Fitzpatrick (PO), Tim Maier (PO), Romy Blacklaw (PO), Steven Boge (BA), Ed King (Des), Khoa Duong (Dev) |
| **A** | Marko Rukovina |
| **C** | Marko Rukovina |
| **I** | — |

---

## Assumptions, Dependencies & Risks

**Assumptions:**
- SAH funding rules and data structures are stable post-Budget V2
- AI/RAG automation achieves sufficient accuracy to reliably flag issues
- Users are trained to distinguish between "query" (internal resolution) and "dispute" (formal challenge)

**Dependencies:**
- Budget V2 completion and migration of all client packages
- Integration with MYOB for financial sync
- Alignment with claims submission workflows and deadlines

**Risks:**
- Auto-approving invoices without adequate anomaly checks (HIGH impact, MEDIUM probability) → Hybrid approach with human review layer
- Excessive use of "dispute" by clients could slow payment cycles (MEDIUM impact, MEDIUM probability) → Clear UX guidance and training
- API readiness delays (MEDIUM impact, LOW probability) → Extended CSV fallback

---

## Success Metrics

- Invoice processing time reduced by 30-50%
- Invoices pending >5 days reduced to <10%
- Client billing satisfaction scores improved
- Zero compliance issues from invoice processing

---

## Estimated Effort

**M (Medium) — 2-3 sprints (6-9 weeks)**

- Discovery: 2-3 weeks
- Development & Testing: 2-3 sprints
- Target Launch: Post-Budget V2 go-live, aligned with SAH operational readiness

---

## Decision

- [x] **Approved** — Proceed to specification
- [ ] **Needs More Information**
- [ ] **Declined**

---

## Next Steps (If Approved)

1. Complete Budget V2 migration
2. Define anomaly detection rules
3. `/speckit.specify` — Create detailed technical specification
