---
title: "Idea Brief: Supplier Pricing (PRI)"
description: "Supplier Management > Supplier Pricing"
icon: i-heroicons-light-bulb
navigation:
  order: 1
---

**Epic Code**: PRI (TP-3652) | **Created**: 2026-01-14

---

## Problem Statement (What)

Supplier pricing structures lack distinction between direct and indirect costs, and the Portal doesn't support supplier price list management.

**Pain Points:**
- Current pricing mechanism doesn't support supplier price list management
- Portal pricing input is limited and doesn't capture full pricing complexity
- Bill matching against supplier pricing is difficult without clear price structure
- Budget planning lacks detailed pricing visibility and supplier-specific rates
- No distinction between direct and indirect costs

**Current State**: Limited pricing flexibility, manual price management, bill matching challenges.

---

## Possible Solution (How)

Implement direct and indirect pricing model in the Portal:

- **Pricing Model**: Support for direct and indirect cost structures
- **Price List Management**: Supplier interface to maintain and update pricing
- **Bill Integration**: Pricing data integrated into bill matching and budget calculations
- **Price Validation**: Price cap validation to prevent pricing anomalies

```
// Before (Current)
1. Limited pricing flexibility
2. Manual price management
3. Bill matching challenges
4. No direct/indirect distinction

// After (With PRI)
1. Comprehensive pricing model
2. Supplier self-service
3. Improved bill accuracy
4. Clear cost structure
```

---

## Benefits (Why)

**User/Client Experience:**
- Suppliers can manage their own price lists
- Better visibility for budget planning

**Operational Efficiency:**
- Improves bill matching accuracy and speed
- Supports cost management and pricing validation
- Reduces manual price management effort

**Business Value:**
- Accuracy — improved bill matching with clear pricing
- Flexibility — supports realistic pricing structures
- Control — price cap validation prevents anomalies

---

## Owner & Stakeholders

| Role | Person |
|------|--------|
| **R** | Steven Boge (PO, BA), Ed King (Des), Tim Maier (Dev) |
| **A** | Erin Headley |
| **C** | Erin Headley |
| **I** | — |

---

## Assumptions, Dependencies & Risks

**Assumptions:**
- Direct/indirect pricing model is well-defined by business
- Suppliers have systems capable of managing price lists

**Dependencies:**
- Pricing business rules must be finalized
- Integration with budget and billing systems must be designed

**Risks:**
- Pricing data inconsistency (HIGH impact, MEDIUM probability) → Validation rules and audit trails
- Supplier resistance to price transparency (MEDIUM impact, LOW probability) → Clear communication of benefits
- Bill matching complexity with new pricing (MEDIUM impact, MEDIUM probability) → Phased rollout and testing

---

## Success Metrics

- Supplier price list adoption >80%
- Bill matching accuracy improvement >20%
- Price anomaly detection rate >95%
- Budget planning accuracy improvement >15%

---

## Estimated Effort

**L (Large) — 4-6 sprints**

- Sprint 1: Discovery & Pricing Model Definition
- Sprint 2-3: Design & UI Development
- Sprint 3-4: Backend Implementation
- Sprint 5-6: Integration, Testing & Launch

---

## Decision

- [x] **Approved** — Proceed to specification
- [ ] **Needs More Information**
- [ ] **Declined**

---

## Next Steps (If Approved)

1. Finalize pricing business rules
2. Design integration with budget and billing systems
3. `/speckit.specify` — Create detailed technical specification
