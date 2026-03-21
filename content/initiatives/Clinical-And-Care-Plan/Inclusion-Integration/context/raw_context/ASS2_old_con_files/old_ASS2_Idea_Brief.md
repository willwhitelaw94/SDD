---
title: "Idea Brief -- ASS2: Inclusion Lifecycle, Needs, Compliance & Action‑Plan Engine"
---


## Problem Statement (What)

ASS1 creates structured Recommendations and backend Inclusion seeds, but
Trilogy still lacks the downstream logic required to determine whether
ATHM items are clinically justified, eligible, ready, and fundable.

There is currently:

-   no governed Inclusion lifecycle\
-   no structured Needs model\
-   no automated invoice gating\
-   no clinical criteria index to power action plans or Request module

As a result, compliance checks, funding decisions, and invoice approvals
rely heavily on manual processes, leading to inconsistency, delays, and
operational risk.

## Possible Solution (How)

ASS2 activates the full post‑assessment engine, turning raw Inclusion
data from ASS1 into governed, rule‑driven, auditable objects that
control funding and invoice outcomes.

### Key Capability Areas

#### 1. Inclusion Lifecycle

-   Convert backend Inclusion seeds into full objects.\
-   States: **Draft → Ready → Active → Closed**\
-   Readiness checklist includes evidence, Tier‑5, quotes, eligibility,
    staleness, and funding pathway.

#### 2. Needs Lifecycle

-   Introduce a consistent Need object.\
-   Consolidate multiple assessments into stable Needs.\
-   Enable planning, audit, and multi‑assessment logic.

#### 3. Funding & Eligibility Rules

-   Automated rule engine determines fundability and contribution
    requirements.\
-   Prevent invalid inclusions from moving forward.\
-   Provide clear ineligibility reasons.

#### 4. Invoice Gating & Automation

-   Auto‑match invoices to relevant Inclusions using Tier‑5 and
    metadata.\
-   Auto‑hold invoices without a Ready Inclusion.\
-   Auto‑release when criteria are met.\
-   Surface confidence signals to billing.

#### 5. Inclusion Index & Search

-   Organisation‑wide searchable listing of all Inclusions.\
-   Filters by Tier‑5, Need, funding stream, lifecycle state, supplier,
    etc.

#### 6. Action‑Plan Engine + Clinical Criteria Index

-   Canonical index of criteria (mobility, ADLs, safety, etc.).\
-   Map Needs and Inclusions to criteria for structured action plans.\
-   Request module uses the index for routing and classification.

#### 7. Assessment Consolidation

-   Combine overlapping assessments into unified Needs and Inclusions
    where appropriate.

## Benefits (Why)

  -----------------------------------------------------------------------
  **Category**                **Expected Benefit**
  --------------------------- -------------------------------------------
  Compliance                  Ensures all ATHM items meet evidence,
                              eligibility, and funding rules before
                              approval.

  Efficiency                  Reduces manual invoice checks and lowers
                              "on hold" volumes.

  Consistency                 Unified Need + Inclusion logic across all
                              assessments and CP workflows.

  Audit                       Full chain from Need → Inclusion →
                              Assessment → Recommendation → Budget →
                              Invoice.

  Actionability               Coordinators receive structured,
                              criteria‑mapped action plans.
  -----------------------------------------------------------------------

## Owner (Who)

To be completed.

## Other Stakeholders

To be completed.

## Assumptions / Dependencies / Risks

### Assumptions

-   ASS1 produces consistent, validated Recommendations and Inclusion
    seeds.\
-   Tier‑5 dataset and clinical criteria index are centrally governed.

### Dependencies

-   Budget linkage from ASS1\
-   Invoice ingestion & classification\
-   Clinical criteria index creation & maintenance

### Risks

-   Incorrect rules blocking necessary payments\
-   Needs/Inclusion consolidation requiring clinical judgement\
-   Coordinator confusion if action‑plan UX is not intuitive

## Proceed to PRD?

**Yes.**
