---
title: "Idea Brief -- ASS1: Assessment Intake, AI Extraction & Recommendation Workflow"
---


**Epic Code**: ASS  
**Created**: 2026-01-14

## Problem Statement (What)

Support at Home (SAH) requires Assistive Technology & Home Modifications (ATHM) items to be assessed, mapped to Tier-5 codes, and backed by verifiable evidence before they can be funded. Today this information arrives as unstructured documents (PDFs, emails, quotes), leading to: * Inconsistent Tier-5 classification * Inability to surface structured recommendation data inside the budget * Bill processors lacking the information needed to match invoices * Avoidable invoice-on-hold delays * Fragmented and unreliable documentation storage The business requires a mechanism for assessors to submit evidence, for the system to extract structured data from that evidence, and for care partners to confirm recommendations so that structured objects can be used downstream. ---

## Possible Solution (How)

Create the **Assessment Intake & Recommendation Module (ASS1)** that: 1. Enables Care Partners to create Assessment Requests on packages, selecting assessment type and onboarded supplier (for OT assessments) 2. Provides secure link for assessors to log in using existing Portal credentials and upload documents 3. Extracts key data from documents using AI, including product/modification details and Tier-3→4→5 mapping 4. Presents assessors with a correction & confirmation UI, ensuring a mandatory human-in-the-loop validation step 5. Produces structured **Recommendation** records containing Tier-5 codes, mapped evidence, and metadata 6. Allows Care Partners to **accept** recommendations (no reject - can ignore instead), which silently creates **backend-only Inclusion Seeds** for Advice and Prescribed pathways only 7. Enables accepted Recommendations to **pre-populate Service Plan items** with terminal tier value only (Tier-5 for products, Tier-3 for services) 8. Stores all evidence and extracted data centrally to enable accurate invoice matching ---

## Benefits (Why)

Category Expected Benefit --- --- **Regulatory Compliance** Ensures ATHM assessments are captured, mapped, validated, and consistently linked to Tier-5 codes to meet SAH requirements **Operational Efficiency** Reduces manual document review, decreases assessment-to-budget cycle time, and improves coordination between assessors and care partners **Invoice Accuracy** Provides structured data that AI can later use to cross-reference invoices, reducing "on hold" volume in ASS2 **Data Quality** Creates a single structured repository for assessment evidence and recommendation data for budgeting and future inclusion workflows **Scalability** Supports high document volume and assessor variability without manual processing bottlenecks ---

## Owner (Who)

**Team**: * BA/Requirements: David * Product Owner/SME: Romi * Design Lead: Beth * Tech Lead: Khoa * Data Lead: Katja **Stakeholders**: To be completed. ---

## Other Stakeholders (Accountable / Consulted / Informed)

[Stakeholders to be defined]

## Assumptions & Dependencies, Risks

### Assumptions
### Assumptions * Assessors can authenticate and upload evidence through the Portal * AI extraction achieves sufficient accuracy to reduce manual workload * Tier-5 canonical dataset is available and maintained ### Dependencies * Assessor authentication via existing Portal credentials * AI extraction & mapping service * Backend Inclusion Seed object (no UI/lifecycle in ASS1) * Service Plan "Add Service" capability to accept recommendations * Tier-5 canonical dataset (internally maintained) * **Full assessment type schema** (pending from Romi) * **Document type enum** (pending from Romi) * **Tier-5 pathway requirements** (pending from Romi) ### Risks * Variability of assessor reports impacting extraction accuracy * Assessors failing to complete human-in-loop confirmation * High-volume ingestion stressing document-processing workflows ---

### Risks
[Risks to be identified]

## Estimated Effort

To be determined (high-level indication: several sprints across design, backend, and AI extraction). ---

## Proceed to PRD?

**Yes.**
