---
title: "Idea Brief: Invoice Reclassification (IRC)"
description: "Budgets And Finance > Invoice Reclassification"
icon: i-heroicons-light-bulb
navigation:
  order: 1
---

**Epic Code**: IRC | **Created**: 2026-02-02

---

## Problem Statement (What)

Invoice line items require manual classification to budget categories, creating bottlenecks and errors in billing workflows.

**Pain Points:**
- Manual reclassification of invoice lines is time-consuming
- AI classification currently at ~50% confidence - not production ready
- Team is ready to process but blocked by UI integration
- Bills can't match to services without proper budget category assignment
- Classification errors cascade into claims and payments

**Current State**: Manual classification, AI not reliable enough, UI not integrated, team blocked.

---

## Possible Solution (How)

Implement AI-assisted invoice classification with human review workflow:

- **AI Classification**: Auto-suggest budget category for each invoice line item
- **Confidence Scoring**: Show confidence level, flag low-confidence items for review
- **Classification Modal**: UI for reviewing and correcting AI suggestions
- **Reclassify First**: Process reclassification at entry before downstream processing
- **Learning Loop**: Feed corrections back to improve AI accuracy

```
// Before (Current)
1. Invoice arrives
2. Manual line-by-line classification
3. Errors caught late in process
4. Rework and delays

// After (With IRC)
1. Invoice arrives
2. AI suggests classifications
3. Human reviews low-confidence items
4. Clean data flows downstream
```

---

## Benefits (Why)

**User/Client Experience:**
- Faster invoice processing for suppliers
- Fewer billing errors and disputes

**Operational Efficiency:**
- Reduces manual classification workload by 50%+
- Catches errors at entry, not at claim time

**Business Value:**
- Accuracy - bills match services correctly
- Speed - faster invoice-to-payment cycle
- SAH Readiness - clean data for Support at Home claims

---

## Owner & Stakeholders

| Role | Person |
|------|--------|
| **R** | Bruce (Design), KWA (Dev) |
| **A** | Will Whitelaw |
| **C** | Romy Blacklaw, Tim Maier |
| **I** | Accounts Team |

---

## Assumptions, Dependencies & Risks

**Assumptions:**
- AI model can be improved beyond 50% confidence
- Budget categories are well-defined and stable

**Dependencies:**
- Budget module must have accurate category data
- UI modal design (Bruce working on this)

**Risks:**
- AI accuracy insufficient (HIGH impact, MEDIUM probability) - Fallback to manual with AI assist
- UI delays (MEDIUM impact, LOW probability) - Team ready, just needs UI integration

---

## Success Metrics

- AI classification accuracy > 80%
- Manual reclassification time reduced by 50%
- Zero classification errors reaching claims stage

---

## Estimated Effort

**M (Medium) - 2-4 sprints**

- Sprint 1: Classification modal UI (Bruce)
- Sprint 2: AI integration and confidence scoring
- Sprint 3: Reclassify-at-entry workflow
- Sprint 4: Learning loop and accuracy improvements

---

## Decision

- [x] **Approved** - P1 priority per BRP
- [ ] **Needs More Information**
- [ ] **Declined**

---

## Next Steps (If Approved)

1. Bruce to complete classification modal design
2. KWA to begin IT/budget alignment work
3. Integrate AI suggestions into modal UI
