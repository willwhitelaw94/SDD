---
title: "Idea Brief: Home Modifications Flow (HMF)"
description: "Supplier Management > Home Modifications Flow"
icon: i-heroicons-light-bulb
navigation:
  order: 1
---

**Epic Code**: HMF | **Created**: 2026-01-14

---

## Problem Statement (What)

Home Modifications contractors and product suppliers lack standardized onboarding and compliance tracking in the Portal.

**Pain Points:**
- No standardized onboarding for Home Modifications contractors and product suppliers
- State-specific compliance documentation (permits, certificates, photos) not tracked
- Compliance team lacks dedicated UI to review home modification works
- No criteria templates for home modification Inclusions (quotes, milestones, geo-conditional requirements)
- Payment logic for installment-based home mods vs single-payment products not differentiated
- Contractor assessment data format not standardized

**Current State**: Manual compliance tracking, inconsistent contractor quotes, no visibility into work progress or payment status, state compliance requirements unmet.

---

## Possible Solution (How)

Build supplier ecosystem layer (UI shell + supplier management) for home modifications and products:

- **Supplier Onboarding**: State-specific licensing, credentials, insurance verification for contractors; bare-bones registration with Tier-3 category selection for product suppliers
- **Supplier Portal Tabs**: Pricing tab for fixed rates, Documents & Agreements tab for assessment requests and quotes, Works tab for active home modification projects
- **Compliance Dashboard**: Filtered view of home mod works with per-document approval workflow, document approval/rejection with version history, work status tracking
- **Integration Contracts**: Supplier validation API, compliance criteria template structure, payment milestone definitions (30%/40%/30%), notification event hooks

```
// Before (Current)
1. No standardized onboarding
2. Manual compliance tracking
3. No visibility into work progress
4. State requirements unmet

// After (With HMF)
1. State-specific onboarding workflows
2. Dedicated compliance dashboard
3. Work status and milestone tracking
4. Standardized contractor quotes
```

**Critical Scope Boundary:**
- **HMF Builds**: Supplier UI shell (portal tabs), compliance dashboard UI, supplier onboarding, validation APIs
- **ASS2 Owns**: Inclusion lifecycle, quote selection workflow, criteria evaluation logic, payment gating

---

## Benefits (Why)

**User/Client Experience:**
- Clear onboarding reduces support queries
- Compliance team has dedicated UI for home mod review

**Operational Efficiency:**
- Dedicated compliance UI reduces manual review time by 60%
- Standardized contractor quotes improve invoice matching accuracy

**Business Value:**
- Compliance — 100% home mods tracked with state-specific documentation
- Payment Control — milestone-based payments ensure verified progress
- Scalability — criteria templates enable consistent evaluation

---

## Owner & Stakeholders

| Role | Person |
|------|--------|
| **R** | David Henry (PO, BA), Ed King (Des), Tim Maier (Dev) |
| **A** | Erin Headley |
| **C** | Erin Headley |
| **I** | — |

---

## Assumptions, Dependencies & Risks

**Assumptions:**
- ASS2 Inclusions module will handle Inclusion lifecycle, readiness validation, payment gating
- ASS1 Assessments will handle assessment creation and document storage
- Tier-5 canonical dataset available for product category validation
- State-specific compliance requirements are documented and stable

**Dependencies:**
- ASS2 Inclusions module must be available for integration
- ASS1 Assessments integration for document storage
- State-specific compliance requirements documentation

**Risks:**
- State compliance requirements change frequently (HIGH impact, HIGH probability) → Design flexible criteria template engine, version control
- Contractor resistance to standardized quote formats (MEDIUM impact, MEDIUM probability) → Phased rollout, supplier training, clear documentation
- Compliance team capacity constraints (MEDIUM impact, MEDIUM probability) → Batch review UI, priority queuing, automated validation
- Integration complexity with ASS2 (HIGH impact, LOW probability) → Early integration testing, clear API contracts

---

## Success Metrics

- 100% home mods tracked with state-specific documentation
- Compliance review time reduced by 60%
- Supplier onboarding support queries reduced by 50%
- Invoice matching accuracy improved through standardized quotes

---

## Estimated Effort

**L (Large) — 8-12 weeks**

- Sprint 1-2: Supplier onboarding workflows (HM Contractors + Product Suppliers)
- Sprint 3-4: Supplier Portal tabs UI
- Sprint 5-6: Compliance dashboard UI
- Sprint 7-8: Integration with ASS2, criteria template engine
- Sprint 9-10: Payment milestone logic, testing & launch

---

## Decision

- [x] **Approved** — Proceed to specification
- [ ] **Needs More Information**
- [ ] **Declined**

---

## Next Steps (If Approved)

1. Finalize ASS2 integration contracts and API specifications
2. Document state-specific compliance requirements
3. `/speckit.specify` — Create detailed technical specification
