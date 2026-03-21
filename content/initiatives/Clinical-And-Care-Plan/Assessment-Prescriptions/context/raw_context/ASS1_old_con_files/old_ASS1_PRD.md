---
title: "PRD -- ASS1: Assessment Intake, AI Extraction & Recommendation Workflow"
---

## 1. Executive Summary

ASS1 delivers the foundational Assessment Intake & Recommendation
Workflow for Support at Home (SAH).\
It enables assessors to upload ATHM assessment documents, supports AI
extraction and Tier-5 mapping, and provides a human-in-the-loop
correction UI.\
Care Partners (CPs) can accept/reject Recommendations, which then
prepopulate budget lines.\
Backend-only Inclusion seeds are created for future lifecycle activation
in ASS2.

## 2. Problem Statement

Trilogy receives assessment documents in unstructured formats, resulting
in: - inconsistent Tier-5 classification\
- fragmented evidence storage\
- slow assessment → budget processes\
- limited ability to match invoices to evidence\
- manual intervention delays across CPs and billing

ASS1 provides structured evidence intake, AI mapping, validation
workflow, and Recommendation generation to support downstream compliance
automation.

## 3. Audience

-   Care Partners\
-   Registered Assessors (OT, Physio, Nurse, Contractor)\
-   Billing Processors (read‑only visibility)\
-   Compliance & Operations (audit visibility)

## 4. Goals & Success Metrics

  -----------------------------------------------------------------------
  **Goal**            **Metric**                **Target**
  ------------------- ------------------------- -------------------------
  Improve assessment  Median cycle time         −30% after 4 weeks
  → budget speed                                

  Improve mapping     AI Tier‑5 top‑suggestion  ≥80% at launch
  consistency         accuracy                  
  -----------------------------------------------------------------------

### Assumptions

-   Tier‑5 dataset available and centrally maintained\
-   All assessors use Portal login\
-   AI extraction sufficiently accurate\
-   Inclusion lifecycle is fully out‑of‑scope for V1

## 5. Background / Context

Under SAH, ATHM funding requires validated assessment evidence mapped to
Tier‑5.\
ASS1 provides:

Assessment → AI Extraction → Human Correction → Recommendations → Budget
Prepopulation → Backend Inclusion Seeds

ASS1 includes **no**: - Inclusion lifecycle\
- Inclusion UI or index\
- Needs logic\
- Invoice gating or auto‑release\
- Consolidation logic\
- Action Plans

These belong to ASS2.

## 6. Requirements (User Stories)

### **ASS1‑1 --- Upload Assessment Documents**

**As an Assessor**, I want to upload assessment documents so that the
system can extract ATHM information.\
**Acceptance Criteria:**\
- Supports PDFs, images, and multi‑file uploads\
- Requires login (no anonymous submissions)\
- Metadata captured at upload

------------------------------------------------------------------------

### **ASS1‑2 --- Document Typing**

**As the System**, I want to classify uploaded documents (report, quote,
amendment, etc.) so extraction is accurate.\
**AC:** Auto‑classification + manual override.

------------------------------------------------------------------------

### **ASS1‑3 --- AI Extraction**

**As the System**, I want to extract product/modification details and
Tier‑5 mapping.\
**AC:**\
- Extracts recommended items\
- Suggests Tier‑3/4/5\
- Confidence score displayed\
- Extraction stored for auditing

------------------------------------------------------------------------

### **ASS1‑4 --- Correction & Confirmation UI**

**As an Assessor**, I want to edit and confirm extracted
recommendations.\
**AC:**\
- Inline search & code correction\
- Every recommendation requires manual confirmation\
- Audit logging for changes

------------------------------------------------------------------------

### **ASS1‑5 --- Submit Recommendations**

**As an Assessor**, I want to submit confirmed recommendations.\
**AC:**\
- Validation gating (all confirmed)\
- CP notified automatically

------------------------------------------------------------------------

### **ASS1‑6 --- CP Review of Recommendations**

**As a CP**, I want to accept or reject Recommendations.\
**AC:**\
- Per-item Accept/Reject\
- Optional reason code\
- Only accepted Recommendations become budget‑eligible

------------------------------------------------------------------------

### **ASS1‑7 --- Add Recommendations to Budget**

**As a CP**, I want to add accepted Recommendations into the budget.\
**AC:**\
- Prefilled modal with Tier‑5, description, quantity\
- Editing/removing budget lines does not delete Recommendations\
- Bidirectional links to Assessment & Recommendation

------------------------------------------------------------------------

### **ASS1‑8 --- Backend Inclusion Seed Creation**

**As the System**, I want to create Inclusion seeds upon budgeting.\
**AC:**\
- Created on budget save\
- Includes links to Assessment, Recommendation, Tier‑5\
- No lifecycle or UI exposed in V1

------------------------------------------------------------------------

### **ASS1‑9 --- Billing Visibility**

**As a Billing Processor**, I want to view Tier‑5 and evidence context
for manual invoice matching.\
**AC:** View‑only; no auto‑gating.

------------------------------------------------------------------------

### **ASS1‑10 --- Tier‑5 Canonical Dataset**

**As the System Owner**, I want a canonical Tier‑5 dataset.\
**AC:**\
- Versioned\
- Graceful degradation if dataset unavailable

------------------------------------------------------------------------

### **ASS1‑11 --- Audit Logging**

**As Compliance**, I want audit logging across all state changes.\
**AC:**\
- All uploads/edits/confirms/submissions/budget actions logged\
- Immutable\
- Exportable\
- Filterable by package

------------------------------------------------------------------------

## 7. Out of Scope

ASS1 excludes: - Inclusion lifecycle or UI\
- Needs modelling or editing\
- Funding pathway or eligibility rules\
- Invoice auto‑hold/auto‑release\
- Multi‑assessment consolidation\
- Action Plans\
- Claims, CSV ingestion, Services Australia API integrations\
- Supplier procurement workflows

## 8. User Interaction & Design Notes

### Entry Points

-   CP: Start Assessment from package\
-   Assessor: Deep link → login → Assessment workspace

### Assessor Flow

Upload → Document Typing → AI Extraction → Correction UI →
Confirm/Reject → Submit

### Mapping UI

-   Tier‑3/4/5 hierarchy\
-   Search & filters\
-   Confidence scores

### CP Workflow

-   Notification on submission\
-   Accept/Reject Recommendations\
-   Add to Budget

### Billing Visibility

-   Tier‑5 context visible during manual review\
-   No auto‑gating

### Backend Inclusion Creation

-   Triggered only when budget line saved\
-   Stored for ASS2

## 9. Milestones

Design: In progress\
Development: Pending\
QA / UAT: Pending\
Release: Pending

## 10. Reference Materials

-   High‑Level Architecture Summary\
-   Epic Split Master Map\
-   SAH Reform Requirements\
-   Internal BRP documentation\
-   Confluence PRD templates
