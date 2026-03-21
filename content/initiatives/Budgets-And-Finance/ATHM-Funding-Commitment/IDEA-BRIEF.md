---
title: "Idea Brief: ATHM Funding Commitment"
description: "Budgets And Finance > ATHM Funding Commitment"
icon: i-heroicons-light-bulb
navigation:
  order: 1
---

**Epic Code**: AFC | **Created**: 2026-02-15

---

t

---

## Possible Solution (How)

Add a per-budget-item toggle — "Hold ATHM funds for this budget item" — that reserves the allocated ATHM amount so it is treated as unavailable to other services. The checkbox is only applicable to **Assistive Technology (SERG-0002)** and **Home Modifications (SERG-0003)** service categories, which are the high-value items most likely to carry contractual commitments.

### Areas of Impact

| Area | What changes |
|------|-------------|
| **Budget planning — allocation** | `CheckBudgetFundingOverAllocationAction` and related allocation logic must subtract held amounts when calculating available ATHM funds |
| **Bill processing — funding allocation** | `CalculateBillFundingAllocations` must respect held amounts so bills are not funded from committed/reserved pools |
| **Frontend — BudgetItem.vue** | Add a "Hold ATHM funds" checkbox, visible only for SERG-0002 and SERG-0003 budget items |
| **Schema** | New boolean field on budget plan items to persist the hold state |
| **Other (TBD)** | There may be additional touchpoints (e.g. utilisation reporting, funding charts) that surface available balances and would need to account for held amounts |

```
// Before
1. User creates budget item for equipment hire (ATHM-funded)
2. Another user allocates remaining ATHM funds to a different service
3. Over-allocation discovered at billing → manual fix required

// After (With AFC)
1. User creates budget item for equipment hire (ATHM-funded)
2. User enables "Hold ATHM funds" → amount reserved
3. Other users see reduced available ATHM balance
4. Budget planning and bill processing both respect the hold
```

---

## Benefits (Why)

**User/Client Experience:**
- Users see accurate available ATHM balances without mental arithmetic
- Reduced surprise over-allocation errors during billing cycles

**Operational Efficiency:**
- Eliminates manual spreadsheet tracking of committed funds
- Fewer billing corrections and reconciliation interventions

**Business Value:**
- Contractual compliance — committed funds are protected at system level
- Improved funding accuracy as ATHM package volumes grow

---

## Owner & Stakeholders

| Role | Person |
|------|--------|
| **R** | — |
| **A** | — |
| **C** | — |
| **I** | — |

---

## Assumptions, Dependencies & Risks

**Assumptions:**
- The hold only applies to Assistive Technology (SERG-0002) and Home Modifications (SERG-0003) service categories
- ATHM funding streams are identifiable on budget plan items (existing funding stream codes and SERG mapping in `config/support-at-home.php` cover this)
- A budget item maps to a single primary funding stream, making the hold semantics unambiguous

**Dependencies:**
- Budget Reloaded (BUR) — the redesigned budget UI may influence where and how the checkbox is surfaced
- Budget planning allocation engine (`CheckBudgetFundingOverAllocationAction`) must be extended to respect held amounts
- Bill processing allocation engine (`CalculateBillFundingAllocations`) must also respect held amounts to prevent bills consuming committed funds

**Risks:**
- Partial holds or split-funding items may introduce edge cases (MEDIUM impact, LOW probability) → Start with full-amount holds only; revisit partial holds if needed
- Users may over-use holds, artificially reducing available funds (LOW impact, MEDIUM probability) → Provide clear reporting on held vs free amounts

---

## Estimated Effort

**S (Small) — 1-2 sprints**

- **Sprint 1**: Schema change (boolean on budget plan items), allocation engine update, backend tests
- **Sprint 2**: UI checkbox + held-funds indicator, integration tests, QA

---

## Decision

- [ ] **Approved** — Proceed to specification
- [ ] **Needs More Information**
- [ ] **Declined**

---

## Next Steps (If Approved)

1. Validate assumption that ATHM funding stream is always identifiable per budget item
2. Review interaction with Budget Reloaded (BUR) UI changes
3. `/speckit.specify` — Create detailed technical specification
