---
title: "Idea Brief -- ASS1: Assessment Intake, AI Extraction & Recommendation Workflow"
---

## Problem Statement (What)

Support at Home (SAH) requires Assistive Technology & Home Modifications
(ATHM) items to be assessed, mapped to Tier-5 codes, and backed by
verifiable evidence before they can be funded.

Today this information arrives as unstructured documents (PDFs, emails,
quotes), leading to:

-   inconsistent Tier-5 classification\
-   inability to surface structured recommendation data inside the
    budget\
-   bill processors lacking the information needed to match invoices\
-   avoidable invoice-on-hold delays\
-   fragmented and unreliable documentation storage

The business requires a mechanism for assessors to submit evidence, for
the system to extract structured data from that evidence, and for care
partners to confirm recommendations so that structured objects can be
used downstream.

## Possible Solution (How)

Create the **Assessment Intake & Recommendation Module (ASS1)** that:

1.  Enables assessors to submit assessment documents through a secure,
    logged-in workflow.\
2.  Extracts key data from documents using AI, including
    product/modification details and Tier-3→4→5 mapping.\
3.  Presents assessors and care partners with a correction &
    confirmation UI, ensuring a mandatory human-in-the-loop validation
    step.\
4.  Produces structured **Recommendation** records containing Tier-5
    codes, mapped evidence, and metadata.\
5.  Allows accepted Recommendations to **pre-populate budget lines** for
    rapid path-to-budget.\
6.  Generates **backend-only Inclusion objects** (no lifecycle/UI) so
    ASS2 can later activate readiness, gating, and compliance logic.\
7.  Stores all evidence and extracted data centrally to enable accurate
    invoice matching.

## Benefits (Why)

  -----------------------------------------------------------------------
  **Category**                **Expected Benefit**
  --------------------------- -------------------------------------------
  Regulatory Compliance       Ensures ATHM assessments are captured,
                              mapped, validated, and consistently linked
                              to Tier-5 codes to meet SAH requirements.

  Operational Efficiency      Reduces manual document review, decreases
                              assessment-to-budget cycle time, and
                              improves coordination between assessors and
                              care partners.

  Invoice Accuracy            Provides structured data that AI can later
                              use to cross-reference invoices, reducing
                              "on hold" volume in ASS2.

  Data Quality                Creates a single structured repository for
                              assessment evidence and recommendation data
                              for budgeting and future inclusion
                              workflows.

  Scalability                 Supports high document volume and assessor
                              variability without manual processing
                              bottlenecks.
  -----------------------------------------------------------------------

## Owner (Who)

To be completed.

## Other Stakeholders (Accountable / Consulted / Informed)

To be completed.

## Assumptions & Dependencies / Risks

### Assumptions

-   Assessors can authenticate and upload evidence through the Portal.\
-   AI extraction achieves sufficient accuracy to reduce manual
    workload.\
-   Tier-5 canonical dataset is available and maintained.

### Dependencies

-   Registered-supplier assessor access model.\
-   AI extraction & mapping service.\
-   Backend Inclusion object (no UI/lifecycle).\
-   Budget prepopulation from Recommendations.

### Risks

-   Variability of assessor reports impacting extraction accuracy.\
-   Assessors failing to complete human-in-loop confirmation.\
-   High-volume ingestion stressing document-processing workflows.

## Estimated Effort

To be completed (high-level indication: several sprints across design,
backend, and AI extraction).

## Proceed to PRD?

**Yes.**
