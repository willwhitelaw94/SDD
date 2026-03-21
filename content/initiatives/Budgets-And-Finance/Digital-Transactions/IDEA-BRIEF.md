---
title: "Idea Brief: Digital Transactions (DTX)"
description: "Budgets And Finance > Digital Transactions"
icon: i-heroicons-light-bulb
navigation:
  order: 1
---

**Epic Code**: DTX | **Created**: 2026-02-02

---

## Problem Statement (What)

Clients have no real-time visibility into their transaction history within the portal.

**Pain Points:**
- Clients must wait for periodic statements to see transactions
- No way to track spending in real-time
- Support queries about "what happened to my budget"
- Statements are point-in-time snapshots, not live data

**Current State**: No real-time transaction visibility, clients wait for statements.

---

## Possible Solution (How)

Implement real-time transaction log view in authenticated portal:

- **Transaction Log**: Paginated list of all transactions with date, description, amount
- **Filtering**: Filter by date range, category, service type
- **Real-Time**: Shows current state, not statement snapshots
- **Separate from Statements**: This is NOT the PDF statement - that's a different initiative (DST)

```
// Key Distinction
Digital Statements (DST) = PDF exports mailed/emailed to clients
Digital Transactions (DTX) = Real-time log view in portal
```

---

## Benefits (Why)

**User/Client Experience:**
- Real-time budget visibility
- Self-service transaction lookup
- Reduced support queries

**Operational Efficiency:**
- Fewer "where's my money" support calls
- Clients can self-serve transaction history

**Business Value:**
- Transparency - clients see exactly where budget goes
- Trust - real-time visibility builds confidence
- SAH Readiness - clients need visibility under Support at Home

---

## Owner & Stakeholders

| Role | Person |
|------|--------|
| **R** | Tim Maier |
| **A** | Will Whitelaw |
| **C** | Romy Blacklaw |
| **I** | Care Coordinators, Clients |

---

## Success Metrics

- Reduction in "transaction lookup" support queries by 50%
- Client portal engagement increase

---

## Estimated Effort

**S (Small) - 1-2 sprints**

- Sprint 1: Transaction log UI component
- Sprint 2: Filtering and pagination

---

## Decision

- [x] **Approved** - P1 priority per BRP
- [ ] **Needs More Information**
- [ ] **Declined**

---

## Next Steps (If Approved)

1. Clarify in Linear that DTX != DST (different initiatives)
2. Design transaction log UI
3. Integrate with budget/transaction data source
