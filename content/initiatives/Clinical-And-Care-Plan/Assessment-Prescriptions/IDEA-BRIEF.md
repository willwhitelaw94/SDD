---
title: "Idea Brief: Assessment Prescriptions (ASS1)"
description: "Clinical and Care Plan > Assessment Prescriptions"
icon: i-heroicons-light-bulb
navigation:
  order: 1
---

**Created**: 2026-01-14
**Epic Code**: ASS1
**Initiative**: Clinical and Care Plan (TP-1859)

---

## Problem Statement (What)

- Support at Home (SAH) requires Assistive Technology & Home Modifications (ATHM) items to be assessed, mapped to Tier-5 codes, and backed by verifiable evidence before funding
- Information arrives as unstructured documents (PDFs, emails, quotes) leading to inconsistent Tier-5 classification
- Bill processors lack information needed to match invoices, causing avoidable invoice-on-hold delays
- Fragmented and unreliable documentation storage with no structured recommendation data in budgets

**Current State**: Unstructured assessment evidence with manual classification; no mechanism for assessors to submit and validate structured recommendations

---

## Possible Solution (How)

Create the **Assessment Intake & Recommendation Module (ASS1)** that:

- **Assessment Requests** — Care Partners create requests on packages, selecting assessment type and onboarded supplier (for OT assessments)
- **Assessor Portal** — Secure link for assessors to log in using existing Portal credentials and upload documents
- **AI Extraction** — Extracts key data from documents including product/modification details and Tier-3→4→5 mapping
- **Human-in-the-Loop Validation** — Assessors review correction & confirmation UI ensuring mandatory validation step
- **Structured Recommendations** — Produces records containing Tier-5 codes, mapped evidence, and metadata
- **Acceptance Workflow** — Care Partners accept recommendations (no reject — can ignore), which creates backend-only Inclusion Seeds for Advice and Prescribed pathways
- **Service Plan Integration** — Accepted Recommendations pre-populate Service Plan items with terminal tier value (Tier-5 for products, Tier-3 for services)

```
// Before (Current)
1. Assessment arrives as PDF/email
2. Manual review and classification
3. No structured data for budgets
4. Invoice matching guesswork

// After (With ASS1)
1. Assessor uploads via Portal
2. AI extracts and maps to Tier-5
3. Human validates recommendations
4. Structured data flows to budgets
```

---

## Benefits (Why)

**User/Client Experience**:
- Streamlined assessment submission for assessors via secure Portal access
- Clear recommendation workflow with human-in-the-loop validation

**Operational Efficiency**:
- Reduces manual document review and assessment-to-budget cycle time
- Improves coordination between assessors and care partners

**Business Value**:
- Regulatory compliance — ATHM assessments captured, mapped, validated per SAH requirements
- Invoice accuracy — structured data enables AI cross-referencing, reducing "on hold" volume
- Foundation for ASS2 inclusion workflows and downstream billing automation

---

## Owner & Stakeholders

| Role | Person |
|------|--------|
| **R** | Romy Blacklaw (PO), David Henry (PO, BA), Katja Panova (PO), Beth Poultney (Des), Khoa Duong (Dev) |
| **A** | Patrick Hawker |
| **C** | Maryanne Humphries, Janith Disanayake |
| **I** | Mathew Philips |

---

## Assumptions & Dependencies, Risks

**Assumptions**:
- Assessors can authenticate and upload evidence through the Portal
- AI extraction achieves sufficient accuracy to reduce manual workload
- Tier-5 canonical dataset is available and maintained

**Dependencies**:
- Portal authentication infrastructure for assessor access
- AI document extraction service
- Tier-5 code reference dataset

**Risks**:
- Assessor report variability impacting extraction accuracy (MEDIUM) → Mitigation: Training data expansion, fallback manual entry
- Assessors failing to complete human-in-loop confirmation (LOW) → Mitigation: Clear UX, reminder notifications
- High-volume ingestion stressing document-processing workflows (MEDIUM) → Mitigation: Queue management, async processing

---

## Estimated Effort

**4–5 sprints**

- **Sprint 1**: Design — Assessment request flow, assessor portal UX, recommendation UI
- **Sprint 2–3**: Backend — Document upload, AI extraction pipeline, recommendation data model
- **Sprint 4**: Frontend — Assessor portal, validation UI, care partner acceptance workflow
- **Sprint 5**: QA/UAT — Extraction accuracy testing, end-to-end validation

---

## Proceed to PRD?

**YES** — ASS1 is foundational for SAH compliance and enables structured ATHM assessment data for downstream billing and inclusion workflows.

---

## Decision

- [ ] **Approved** - Proceed to PRD
- [ ] **Needs More Information**
- [ ] **Declined**

**Approval Date**: ____

---

## Next Steps

**If Approved**:
1. [ ] Create PRD (spec.md)
2. [ ] Create RACI Matrix
3. [ ] Create Jira epic (TP-1904)
4. [ ] Break down into user stories
