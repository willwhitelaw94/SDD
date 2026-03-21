---
title: "Idea Brief: Portal Bill Submission (PBS)"
description: "Budgets And Finance > Portal Bill Submission"
icon: i-heroicons-light-bulb
navigation:
  order: 1
---

**Epic Code**: PBS | **Created**: 2025-01-30

---

## Problem Statement (What)

Invoices arrive at Trilogy Care through multiple unstructured channels, primarily email to the accounts inbox, causing validation issues, claiming delays, and poor bill quality.

**Pain Points:**
- No structured submission path for suppliers — bills arrive via email without validation
- Incorrect bills create downstream issues (detailed in OHB epic)
- Multiple resubmission cycles when issues are found post-submission
- No mechanism for suppliers to validate bills against specific clients before submitting
- Repetitive data entry for recurring bills (same client, same service type)

**Current State**: Suppliers email bills to accounts inbox with no real-time validation, leading to quality issues and inefficient claiming processes.

---

## Possible Solution (How)

In-portal bill submission experience for authenticated suppliers with real-time validation and reusable presets:

- **Authenticated Portal Access**: Suppliers access via email links to logged-in portal experience
- **Real-Time Validation**: Client-specific checks before submission (not overly strict)
- **Preset Templates**: Save bill configurations per client — resubmit with only changed fields (e.g., service dates)
- **Good UX**: Encourage repeat usage through streamlined, non-burdensome experience
- **Aligned with OHB**: Similar UI/UX to bill resubmission flow in On-Hold Bills

```
// Before (Current)
1. Supplier emails bill to accounts inbox
2. No validation at submission
3. Issues discovered during processing
4. Rejection → resubmission cycle
5. Full data re-entry each time

// After (With PBS)
1. Supplier clicks link → authenticated portal
2. Real-time validation during entry
3. Issues caught before submission
4. Presets for recurring bills
5. Only enter changed fields (service dates)
```

**Entry Points:**
- Email links (primary)
- QR codes (potential future enhancement)

**Secondary Users:**
- Clients submitting reimbursements (requires different field capture)

---

## Benefits (Why)

**User/Client Experience:**
- Suppliers get immediate feedback on bill validity
- Reduced frustration from rejection cycles
- Faster time-to-payment for valid bills

**Operational Efficiency:**
- Fewer invalid bills entering the system
- Reduced manual validation workload
- Decreased resubmission cycles

**Business Value:**
- Improved bill quality at source
- Enables OHB bill resubmission functionality
- Shifts bill flow from email to structured portal channel

---

## Owner & Stakeholders

| Role | Person |
|------|--------|
| **R** | Romy Blacklaw (PO), David Henry (BA), Bruce Blyth (Des), Khoa Duong (Dev) |
| **A** | Marko Rukavina |
| **C** | Erin Headley |
| **I** | — |

---

## Assumptions, Dependencies & Risks

**Assumptions:**
- Suppliers are already signed up and can authenticate to portal
- Validation rules can be defined without being overly restrictive
- Preset functionality is technically feasible

**Dependencies:**
- OHB epic assumes PBS exists for bill resubmission flow
- Supplier authentication system

**Risks:**
- UX too strict → suppliers abandon and revert to email (MEDIUM) → Balance validation strictness
- Preset complexity → difficult to implement (LOW) → Start with simple presets, iterate
- Adoption resistance → suppliers prefer email (MEDIUM) → Make portal experience clearly better

---

## Estimated Effort

**M (Medium)**

**Status**: Early discovery — needs further definition. Core concept is clear but features need refinement.

**Key Areas to Define:**
- Exact validation rules and strictness balance
- Preset functionality scope
- Client reimbursement field differences
- Integration with OHB resubmission flow

---

## Decision

- [ ] **Approved** — Proceed to specification
- [x] **Needs More Information** — Requires further discovery on validation rules and UX design
- [ ] **Declined**

---

## Next Steps (If Approved)

1. Discovery on validation rules and strictness balance
2. UX design for preset functionality
3. Align with OHB team on resubmission flow integration
4. `/speckit.specify` — Create detailed technical specification
