---
title: "Idea Brief: Service Booking (APA)"
description: "Supplier Management > Service Booking"
icon: i-heroicons-light-bulb
navigation:
  order: 1
---

**Epic Code**: APA | **Created**: 2026-01-14

---

## Problem Statement (What)

Users face friction when attempting to book services from suppliers, with supplier changes triggering unnecessary budget resubmission.

**Pain Points:**
- Current booking mechanism lacks flexibility for managing supplier relationships on budget items
- Cannot easily add or modify supplier assignments without triggering full budget resubmission
- Rate card updates create cascading workflows that burden users
- High friction in supplier management workflow

**Current State**: Supplier changes trigger budget recalculation, cumbersome workflow, high friction.

---

## Possible Solution (How)

Create lightweight supplier booking workflow for budget plan items:

- **Decoupled Operations**: Separate supplier relationship management from rate card change operations
- **Atomic Operations**: Implement atomic supplier add/remove operations
- **Simplified Workflow**: Design workflows that don't force budget resubmission for supplier changes
- **Service-Level Assignment**: Allow flexible supplier assignment at service level

```
// Before (Current)
1. Supplier changes trigger budget recalculation
2. Cumbersome workflow
3. High friction
4. Full resubmission required

// After (With APA)
1. Simple supplier selection
2. Atomic operations
3. Seamless booking experience
4. Selective updates only
```

---

## Benefits (Why)

**User/Client Experience:**
- Reduces workflow complexity for supplier management
- Seamless booking experience without unnecessary steps

**Operational Efficiency:**
- Allows flexible supplier assignment at service level
- Minimizes unnecessary budget resubmission cycles

**Business Value:**
- Efficiency — streamlined supplier booking workflow
- Flexibility — service-level supplier assignment
- User satisfaction — reduced friction in planning

---

## Owner & Stakeholders

| Role | Person |
|------|--------|
| **R** | Zoe Judd (PO), Fran Da Silva (PO), Steven Boge (BA), Ed King (Des), Tim Maier (Dev) |
| **A** | Erin Headley |
| **C** | Fran Da Silva |
| **I** | — |

---

## Assumptions, Dependencies & Risks

**Assumptions:**
- Supplier relationship and rate card updates can be decoupled
- Budget rebalance engine can handle selective supplier updates

**Dependencies:**
- Rate card management system is available and stable
- Budget plan structure supports supplier-level granularity

**Risks:**
- Rate card cascade on supplier change (HIGH impact, HIGH probability) → Implement event separation and selective updates
- Data consistency issues (HIGH impact, MEDIUM probability) → Comprehensive validation and audit logging
- User confusion about when resubmission is needed (MEDIUM impact, MEDIUM probability) → Clear UI guidance and workflow documentation

---

## Success Metrics

- Supplier change operations not requiring budget resubmission >80%
- Booking workflow completion time reduced by 50%
- User satisfaction with booking process >4/5
- Zero data consistency issues from atomic operations

---

## Estimated Effort

**L (Large) — 4-6 sprints**

- Sprint 1: Discovery & Design
- Sprint 2-3: Backend Workflow Implementation
- Sprint 4-4.5: Frontend UI Development
- Sprint 5-6: Testing & Integration

---

## Decision

- [x] **Approved** — Proceed to specification
- [ ] **Needs More Information**
- [ ] **Declined**

---

## Next Steps (If Approved)

1. Define decoupling strategy for supplier and rate card operations
2. Design atomic operation validation rules
3. `/speckit.specify` — Create detailed technical specification
