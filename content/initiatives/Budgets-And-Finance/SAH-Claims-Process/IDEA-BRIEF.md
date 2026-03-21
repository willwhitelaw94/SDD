---
title: "Idea Brief: SAH Claims Process (SCP)"
description: "Budgets And Finance > SAH Claims Process"
icon: i-heroicons-light-bulb
navigation:
  order: 1
---

**Epic Code**: SCP (TP-900) | **Created**: 2026-01-14

---

## Problem Statement (What)

Support at Home (SAH) claims submission requires a structured process to ensure compliance with Services Australia requirements.

**Pain Points:**
- Claims submission process needs to align with SAH regulatory requirements
- Manual claims compilation is time-consuming and error-prone
- No automated validation against Services Australia rules
- Lack of integration between invoice processing and claims submission
- Compliance gaps risk claim rejections and payment delays

**Current State**: Manual claims process, compliance gaps, no SA rule validation, disconnected from invoicing.

---

## Possible Solution (How)

Implement SAH-compliant claims submission process integrated with invoice pipeline:

- **Claims Compilation**: Automated aggregation of approved invoices into claims batches
- **SA Validation**: Pre-submission validation against Services Australia rules
- **Submission Pipeline**: Direct or API-based submission to Services Australia
- **Response Handling**: Processing of claim responses, rejections, and adjustments
- **Audit Trail**: Complete logging for compliance and reconciliation

```
// Before (Current)
1. Manual claims compilation
2. No SA rule validation
3. Disconnected from invoicing
4. Compliance gaps

// After (With SCP)
1. Automated claims batching
2. Pre-submission validation
3. Integrated pipeline
4. Full compliance
```

---

## Benefits (Why)

**User/Client Experience:**
- Faster claim processing and payment
- Reduced claim rejections

**Operational Efficiency:**
- Automated claims compilation reduces manual effort
- Pre-validation catches errors before submission

**Business Value:**
- Compliance — SAH regulatory alignment
- Accuracy — reduced claim rejections
- Efficiency — faster payment cycles

---

## Owner & Stakeholders

| Role | Person |
|------|--------|
| **R** | Mellette Opena-Fitzpatrick (PO), Katja Panova (PO), Steven Boge (BA), Ed King (Des), Khoa Duong (Dev) |
| **A** | Marko Rukovina |
| **C** | Marko Rukovina |
| **I** | — |

---

## Assumptions, Dependencies & Risks

**Assumptions:**
- Services Australia API/submission requirements are documented and stable
- SAH funding rules are finalized and available for validation
- Invoice pipeline (IV2) provides clean data for claims

**Dependencies:**
- Invoices V2 completion for clean invoice data
- Services Australia API access and documentation
- SAH funding rules documentation

**Risks:**
- SA API changes or instability (HIGH impact, MEDIUM probability) → Version control and monitoring
- Funding rule complexity (MEDIUM impact, MEDIUM probability) → Comprehensive rule engine
- Integration delays (MEDIUM impact, LOW probability) → Fallback manual submission

---

## Success Metrics

- Claim rejection rate <5%
- Claims processing time reduced by 50%
- Zero compliance violations
- 100% audit trail coverage

---

## Estimated Effort

**M (Medium) — 2-4 sprints**

- Sprint 1: Claims compilation and batching logic
- Sprint 2: SA validation rules implementation
- Sprint 3: Submission pipeline and response handling
- Sprint 4: Testing, audit trail, launch

---

## Decision

- [x] **Approved** — Proceed to specification
- [ ] **Needs More Information**
- [ ] **Declined**

---

## Next Steps (If Approved)

1. Obtain Services Australia API documentation
2. Document SAH funding rules for validation
3. `/speckit.specify` — Create detailed technical specification
