---
title: "Idea Brief: Express Pay (EXP)"
description: "Supplier Management > Express Pay"
icon: i-heroicons-light-bulb
navigation:
  order: 1
---

**Epic Code**: EXP (TP-2779) | **Created**: 2026-01-14

---

## Problem Statement (What)

Payment processing for suppliers is time-consuming and lacks flexibility for urgent or expedited payments.

**Pain Points:**
- Current payment workflows lack flexibility for urgent or expedited payments
- Suppliers experience cash flow challenges due to payment delays
- No mechanism for priority/express payment handling when needed
- Standard payment timelines don't meet all business needs

**Current State**: Standard payment timelines, inflexible processing, supplier cash flow challenges.

---

## Possible Solution (How)

Implement express payment processing option for eligible suppliers:

- **Priority Workflows**: Faster settlement times for qualifying payments
- **Eligibility Criteria**: Clear rules for express payment qualification
- **Financial Integration**: Streamlined processing with billing and financial systems
- **Supplier Self-Service**: Suppliers can request express payment when eligible

```
// Before (Current)
1. Standard payment timelines
2. Inflexible processing
3. Supplier cash flow challenges
4. No priority options

// After (With EXP)
1. Express payment options
2. Faster settlement
3. Improved supplier relationships
4. Flexible payment solutions
```

---

## Benefits (Why)

**User/Client Experience:**
- Suppliers can access faster payments when needed
- Improved supplier satisfaction and retention

**Operational Efficiency:**
- Reduces payment processing friction
- Supports supplier cash flow management
- Enables flexible payment solutions for business partners

**Business Value:**
- Competitive advantage — attracts and retains quality suppliers
- Relationships — improved supplier satisfaction
- Flexibility — supports varied business needs

---

## Owner & Stakeholders

| Role | Person |
|------|--------|
| **R** | Erin Headley (PO), Steven Boge (BA), Ed King (Des), Tim Maier (Dev) |
| **A** | Erin Headley |
| **C** | Erin Headley |
| **I** | — |

---

## Assumptions, Dependencies & Risks

**Assumptions:**
- Express payment processing aligns with financial policies
- Banking infrastructure supports expedited settlement

**Dependencies:**
- Financial system must support priority payment processing
- Cash management policies must accommodate faster outflows

**Risks:**
- Banking/settlement delays (MEDIUM impact, MEDIUM probability) → Establish SLAs with payment processors
- Eligibility disputes (LOW impact, LOW probability) → Define clear, objective criteria
- Cash flow management challenges (MEDIUM impact, LOW probability) → Implement careful capacity planning

---

## Success Metrics

- Express payment settlement time <48 hours
- Supplier satisfaction score improvement >10%
- Express payment adoption rate >20% of eligible suppliers
- Zero eligibility disputes escalated

---

## Estimated Effort

**M (Medium) — 2-4 sprints**

- Sprint 0.5: Requirements & Eligibility Criteria
- Sprint 1-2: Payment Processing Implementation
- Sprint 2.5-3: Integration & Testing
- Sprint 3-3.5: Launch & Supplier Communication

---

## Decision

- [ ] **Approved** — Proceed to specification
- [x] **Needs More Information** — Financial policy alignment and banking requirements need clarification
- [ ] **Declined**

---

## Next Steps (If Approved)

1. Financial policy alignment and stakeholder approval
2. Banking requirements and SLA clarification
3. `/speckit.specify` — Create detailed technical specification
