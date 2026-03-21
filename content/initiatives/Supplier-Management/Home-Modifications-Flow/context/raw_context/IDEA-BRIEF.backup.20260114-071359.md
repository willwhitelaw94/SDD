---
title: "HMF - Idea Brief"
---


**Epic Code**: HMF  
**Created**: 2026-01-14

## Problem Statement (What)

**Current State**: - No standardized onboarding for Home Modifications contractors and product suppliers - State-specific compliance documentation (permits, certificates, photos) not tracked - Compliance team lacks dedicated UI to review home modification works - No criteria templates for home modification Inclusions (quotes, milestones, geo-conditional requirements) - Payment logic for installment-based home mods vs single-payment products not differentiated - Contractor assessment data format not standardized **Impact**: - Manual compliance tracking increases review time and error risk - Inconsistent contractor quotes complicate downstream invoice matching - No visibility into work progress or payment status - State compliance requirements unmet ---

## Possible Solution (How)

Build supplier ecosystem layer (UI shell + supplier management) for home modifications and products. HMF provides the supplier-facing and compliance-facing interfaces, while ASS2 owns the Inclusion business logic that powers these views. **Core Components**: ### 1. Supplier Onboarding (HMF builds + owns) - **Home Modifications Contractors**: - State-specific licensing, credentials, insurance verification (23 base + 8 state-specific documents) - Service areas, capabilities selection - **Pricing**: Fixed hourly rates for non-HM services (home maintenance, repairs) - **Note**: Home Modifications work is ALWAYS quote-by-quote (never fixed pricing) - **Product Suppliers** (merged from PSF): - Bare-bones registration with Tier-3 category selection - Price lists linked to selected categories ### 2. Supplier Portal Tabs (HMF builds UI, ASS2 provides data) - **Pricing Tab**: Shows fixed rates for services like home maintenance, repairs (weekday/weekend/holiday rates) - **Documents & Agreements Tab**: Displays assessment requests and submitted quotes (documents stored via ASS1) - **Works Tab**: Shows active home modification projects once quote is selected and becomes "the work" ### 3. Compliance Dashboard (HMF builds UI for compliance team) - Filtered view of home mod works with per-document approval workflow - Document approval/rejection with version history - Work status tracking, milestone progress visibility ### 4. Integration Contracts & Data Structures (HMF defines, ASS2 consumes) - Supplier validation API (category verification, credential validation) - Compliance criteria template structure (state-conditional logic, multi-quote requirements, milestones) - Payment milestone definitions (30% quote / 40% progress / 30% completion) - Notification event hooks **Critical Scope Boundary**: - **HMF Builds**: The supplier UI shell (portal tabs), compliance dashboard UI, supplier onboarding, validation APIs - **ASS2 Owns**: Inclusion lifecycle, quote selection workflow, criteria evaluation logic, payment gating, linking selected quote → work - **The Workflow**: Inclusion (ASS2) → Assessment requests sent → Contractors submit quotes (appears in Documents tab - HMF UI) → Care partner selects winning quote (ASS2 logic) → Becomes "Work" (appears in Works tab - HMF UI, data from ASS2) ---

## Benefits (Why)

Benefit Metric ----------------- **Compliance** 100% home mods tracked with state-specific documentation **Efficiency** Dedicated compliance UI reduces manual review time by 60% **Supplier Adoption** Clear onboarding reduces support queries by 50% **Payment Control** Milestone-based payments ensure verified progress **Data Quality** Standardized contractor quotes improve invoice matching accuracy **Scalability** Criteria templates enable consistent evaluation across all home mod Inclusions ---

## Owner (Who)

- **Product Owner**: Romi - **Tech Lead**: TBD - **Engineering**: TBD - **Stakeholders**: Compliance Team, Care Partners, Business Development, Contractors, Product Suppliers ---

## Other Stakeholders (Accountable / Consulted / Informed)

[Stakeholders to be defined]

## Assumptions & Dependencies, Risks

### Assumptions
- ASS2 Inclusions module will handle Inclusion lifecycle, readiness validation, payment gating - ASS1 Assessments will handle assessment creation and document storage - Tier-5 canonical dataset available for product category validation - State-specific compliance requirements are documented and stable ---

### Risks
Risk Likelihood Impact Mitigation ------------------------------------- State compliance requirements change frequently High High Design flexible criteria template engine, version control Contractor resistance to standardized quote formats Medium Medium Phased rollout, supplier training, clear documentation Compliance team capacity constraints Medium Medium Batch review UI, priority queuing, automated validation Integration complexity with ASS2 Low High Early integration testing, clear API contracts ---

## Estimated Effort

**Size**: Large **Complexity**: Medium-High **Includes**: - Two supplier type definitions and onboarding workflows (Home Mod Contractors + Product Suppliers) - Product supplier bare-bones registration with product category selection and price lists - Compliance dashboard UI ("Works" tab) for home modifications - Criteria template engine integration with ASS2 - Assessment data format specifications for contractors - Payment milestone logic for home modifications - Notification framework - PSF product supplier merge (assistive tech, mobility, consumables, etc.) **Estimated Timeline**: 8-12 weeks (pending detailed planning) ---

## Proceed to PRD?

Yes.
