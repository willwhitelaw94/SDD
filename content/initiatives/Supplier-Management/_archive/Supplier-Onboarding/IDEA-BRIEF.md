---
title: "Idea Brief: Supplier Onboarding (SOP)"
description: "Supplier Management > Supplier Onboarding"
icon: i-heroicons-light-bulb
navigation:
  order: 1
---

**Epic Code**: SOP (TP-1403) | **Created**: 2026-01-14

---

## Problem Statement (What)

Supplier onboarding and recontracting processes are fragmented across manual workflows, preventing scalable management of ~15,000 suppliers before SAH cutover.

**Pain Points:**
- Fragmented manual processes for supplier intake, agreement execution, and compliance verification
- Multiple BRP tasks (Supplier Onboarding, Supplier Data, Supplier Recontract) operate in silos
- No unified workflow for new supplier onboarding and mass recontracting to SAH-compliant agreements
- Data quality issues with supplier names, services, pricing, and contact information
- Compliance verification is manual and inconsistent

**Current State**: Fragmented manual workflows, dispersed systems, high error rates, compliance gaps.

---

## Possible Solution (How)

Deliver an end-to-end Supplier Onboarding capability in the Portal:

- **Self-Registration Wizard**: Multi-step wizard with ABN lookup and GST validation via ABR API, token-based ownership claim for existing records, save/resume capability
- **Recontracting Workflow**: Bulk invitations for SAH-compliant agreement signing, conditional pathways based on service/pricing changes
- **Compliance Verification**: Conditional compliance document requests, targeted statutory declarations, automated compliance refresh
- **Pricing Matrix**: Multi-rate (weekday/Sat/Sun/public holiday) and multi-location support, "apply to all" function
- **Bank Verification**: Real-time verification via EFTSure/EFT Shore

```
// Before (Current)
1. Fragmented manual processes
2. Multiple siloed BRP tasks
3. Manual compliance verification
4. Data quality issues

// After (With SOP)
1. Unified onboarding workflow
2. Automated compliance checks
3. Self-service supplier portal
4. SAH-compliant data capture
```

---

## Benefits (Why)

**User/Client Experience:**
- Reduced friction for suppliers with save/resume, ABN autofill, and bulk pricing tools
- Coordinators gain instant access to fully verified supplier profiles

**Operational Efficiency:**
- 50% reduction in time to onboard/recontract a supplier
- Up to 40% reduction in audit workload through risk-weighted audit sampling
- Parallel onboarding and recontracting using shared form logic

**Business Value:**
- Compliance — 95% of suppliers fully compliant before SAH go-live
- Data Quality — standardised supplier names, services, pricing, and contact info
- Scalability — supports onboarding ~15,000 suppliers within constrained timeframe

---

## Owner & Stakeholders

| Role | Person |
|------|--------|
| **R** | Elton Fernando Doehnert (PO), Steven Boge (BA), Ed King (Des), Tim Maier (Dev) |
| **A** | Erin Headley |
| **C** | Erin Headley |
| **I** | — |

---

## Assumptions, Dependencies & Risks

**Assumptions:**
- SAH compliance rules and document requirements are finalised by Sept 2025
- EFTSure/EFT Shore integration available for launch
- Supplier Data cleansing completed before triggering onboarding/recontracting

**Dependencies:**
- Miro Supplier Auth Flow implemented in full (including conditional logic and pricing matrix)
- Multi-rate/multi-location pricing logic operational before launch
- Accurate supplier contact data for bulk recontracting

**Risks:**
- Dual high-volume processes (new + existing suppliers) within 8 weeks (HIGH impact, HIGH probability) → Phased rollout, prioritized supplier segments
- Compliance document delays (HIGH impact, MEDIUM probability) → Automated reminders and escalation workflows
- Edge cases (multi-trading names, complex combos) (MEDIUM impact, MEDIUM probability) → Comprehensive testing and fallback procedures
- EFT integration delays (MEDIUM impact, LOW probability) → Manual verification fallback

---

## Success Metrics

- 15,000 suppliers onboarded/recontracted by 1 Nov 2025
- 95% of suppliers fully compliant before SAH go-live
- 50% reduction in onboarding time per supplier
- 40% reduction in audit workload

---

## Estimated Effort

**M (Medium) — 2 months**

- Month 1: Build complete by 1 Sept 2025 for recontracting start
- Month 2: All suppliers onboarded or recontracted by 1 Nov 2025

---

## Decision

- [x] **Approved** — Proceed to specification
- [ ] **Needs More Information**
- [ ] **Declined**

---

## Next Steps (If Approved)

1. Complete supplier data cleansing
2. Finalize SAH compliance requirements
3. `/speckit.specify` — Create detailed technical specification
