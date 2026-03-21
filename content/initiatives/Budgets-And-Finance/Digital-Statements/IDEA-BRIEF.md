---
title: "Idea Brief: Digital Statements (DST)"
description: "Budgets And Finance > Digital Statements"
icon: i-heroicons-light-bulb
navigation:
  order: 1
---

**Epic Code**: DST (TP-1907) | **Created**: 2026-01-14

---

## Problem Statement (What)

Participants and care coordinators rely on paper-based financial statements with no real-time budget visibility.

**Pain Points:**
- Manual statement generation is time-consuming and error-prone
- Statements lack real-time budget visibility and detailed transaction information
- No digital delivery mechanism for statements to participants
- Paper-based statements create delays in financial transparency
- Regulatory reporting requires manual compilation of statement data

**Current State**: Paper-based statements, manual generation, limited visibility, delayed delivery.

---

## Possible Solution (How)

Implement digital statement generation system integrated with budget management:

- **Real-Time Views**: Statement views for both participants and care coordinators
- **Digital Delivery**: Statements delivered via portal and email
- **Transaction History**: Comprehensive transaction history with filtering
- **QR Code Integration**: Enhanced participant access via QR code statements
- **Automated Generation**: Scheduled and on-demand statement generation

```
// Before (Current)
1. Paper-based statements
2. Manual generation
3. Limited visibility
4. Delayed delivery

// After (With DST)
1. Digital statements
2. Real-time views
3. Automated generation
4. Instant delivery
```

---

## Benefits (Why)

**User/Client Experience:**
- Real-time budget and transaction visibility for participants
- Faster statement delivery and access

**Operational Efficiency:**
- Reduces manual statement preparation workload for staff
- Automated generation eliminates manual compilation

**Business Value:**
- Transparency — improved financial visibility and participant engagement
- Compliance — audit trails and digital records for regulatory requirements
- SAH Readiness — compliant, transparent financial visibility under Support at Home

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
- Participants have access to digital devices and internet
- Budget data is clean and accurate for statement generation

**Dependencies:**
- Real-time budget calculation system must be reliable
- Portal infrastructure must support statement delivery

**Risks:**
- Participant digital access barriers (MEDIUM impact, MEDIUM probability) → Provide paper alternative option
- Budget calculation errors (HIGH impact, MEDIUM probability) → Comprehensive validation and testing
- Delivery and access issues (MEDIUM impact, LOW probability) → Multi-channel delivery options

---

## Success Metrics

- 80% of participants accessing digital statements
- Statement generation time reduced by 90%
- Zero manual statement preparation for standard requests
- Participant satisfaction with financial transparency improved by 15%

---

## Estimated Effort

**M (Medium) — 2-4 sprints**

- Sprint 0.5: Statement template design & requirements
- Sprint 1: Backend statement generation engine
- Sprint 2: Frontend portal integration
- Sprint 3: Testing & delivery integration

---

## Decision

- [x] **Approved** — Proceed to specification
- [ ] **Needs More Information**
- [ ] **Declined**

---

## Next Steps (If Approved)

1. Define statement template requirements
2. Validate budget module integration
3. `/speckit.specify` — Create detailed technical specification
