---
title: "HMF Revised Scope Summary"
---


**Date**: 2025-12-05
**Epic**: TP-3155 HMF - Home Modifications Flow
**Status**: Scope Revision

---

## Context: What Changed

### Original Understanding (Incorrect)
HMF was initially conceived as a **parallel workflow** to the assessment/inclusion system, where:
- Suppliers would upload quotes and documents into a separate "project tracking" system
- Projects would move through stages independent of Inclusions
- After approval, projects would be "linked" to inclusions and budgets as an afterthought
- Payment tracking and compliance would happen in this separate HMF system

### Actual Reality (Correct)
Through gap analysis with ASS1/ASS2 (Assessment and Inclusion workflows), we now understand:
- **ASS2 (Inclusions module) is the single source of truth** for all purchase/project records
- HMF is NOT a separate workflow—it defines:
  1. **Supplier type**: "Home Modifications Contractor" and how they onboard
  2. **Compliance UI**: A dashboard ("Works" tab) for compliance team to view home mod Inclusions
  3. **Data formats**: What contractors provide when fulfilling assessment requests
  4. **Compliance criteria**: What requirements apply to home modification Inclusions

---

## The Revised HMF Scope

### What HMF Actually Defines

#### 1. Supplier Type: Home Modifications Contractors

**Supplier Onboarding (supplier-level, one-time)**:
- Define "Home Modifications Contractor" as a supplier type
- Onboarding requirements:
  - Business credentials and verification
  - State-specific licensing requirements
  - Insurance coverage requirements
  - Service area coverage (which states/territories they operate in)
  - Capabilities (types of modifications they can perform: ramps, bathroom mods, stair lifts, etc.)
- Supplier-level compliance documentation (business license, insurance certificates, state registrations)
- Price list structure (if using quote templates or reference pricing)

**Note**: This onboarding happens **once per supplier**, not per work/purchase.

#### 2. Assessment Type: Contractor Assessments

**How contractors interact with the platform**:
- Contractors receive **assessment requests** from Inclusions (via ASS1/ASS2 system)
- Assessment request contains: client details, modification required, location, deadline
- Contractor responds by uploading their quote and required documents through the **assessment object**
- Quote becomes part of the Inclusion's record (not stored separately in HMF)

**Data format specifications**:
- Define the structure of contractor quotes (fields, line items, pricing breakdown)
- Define required documents for contractor assessments:
  - Quote document (PDF with pricing, scope of work, timeline)
  - State-specific compliance documents (building permits, certifications, etc.)
  - Progress photos (before, during, after)
  - Completion certificates

**Document type taxonomy** for home modifications:
1. Quote
2. Building Permit (state-specific)
3. Completion Certificate
4. Progress Photos (Before and After)

#### 3. Compliance Criteria Templates for Home Modifications

**What compliance requirements apply to home mod Inclusions**:

**State/Territory-Conditional Requirements**:
- Different states require different compliance documents
- Example: VIC requires "Building Permit - VIC", NSW requires "Construction Certificate - NSW"
- System must support: "If client.state = [X], then require document_type = [Y]"

**Multiple Independent Quotes**:
- Many home modifications require multiple independent contractor quotes
- Example: "Ramp installation requires 2 independent quotes"
- System must track: "2 of 2 contractor quotes received and approved"
- Validation: ensure different contractors fulfill each quote requirement

**Document Approval Requirements**:
- Each document type has approval requirements
- Compliance team must approve each document individually
- Example criteria: "All 4 required documents approved (Quote, Permit, Certificate, Photos)"

**Milestone-Based Criteria**:
- Home modifications often have staged completion
- Example milestones:
  - Quote approved
  - Work commenced (verified by initial photos)
  - Work in progress (progress photos submitted)
  - Work completed (completion certificate + final photos)

#### 4. Compliance Dashboard: "Works" Tab

**Purpose**: A compliance-team-specific UI that surfaces home modification Inclusions for review and approval.

**How it works**:
- Filters Inclusions by:
  - Supplier type = Home Modifications Contractor
  - Criteria type = Compliance criteria
- Groups by supplier (shows all works for each contractor)
- Displays per-work information:
  - Work description (e.g., "Bathroom Modifications")
  - Client details
  - Linked budget item
  - State/Territory (determines required documents)
  - Quote amount vs. Approved amount
  - Document list with per-document approval status
  - Overall approval status (e.g., "4 / 4 approved")
  - Work status (New, Quoted, Under Review, Approved, Completed)
  - Payment status (Pending, Partial, Paid)

**Compliance team actions**:
- Review documents attached to assessments
- Approve/reject individual documents with comments
- If rejected, supplier is notified and must resubmit
- Track overall work progression
- Escalate works requiring additional review

**UI Reference**: The Vibe mockup showing the "Works" section with card-based layout, document lists, and approval tracking.

#### 5. Payment Logic for Home Modifications

**Installment/Milestone-Based Payments**:
- Unlike products (single payment), home modifications use installment payments
- Payments released based on milestone completion, not single approval
- Example payment structure:
  - 30% on quote approval
  - 40% on work-in-progress verification (progress photos approved)
  - 30% on work completion (completion certificate + final photos approved)

**Payment Release Logic**:
- Each payment milestone is tied to **specific compliance criteria completion**
- Payment cannot be released until criteria for that milestone are satisfied
- ASS2 (Inclusions) handles the actual payment gating logic
- HMF defines: "For home modifications, these are the standard payment milestones and their criteria"

#### 6. Notification Framework for Home Modifications

**Automated notifications for**:
- Contractor receives assessment request
- Contractor submits quote/documents
- Compliance team: new work ready for review
- Compliance team approves/rejects documents
- Care Partner: work approved/rejected
- Contractor: payment milestone reached
- Contractor: payment processed

**Notification recipients**:
- Contractors (suppliers)
- Compliance Team
- Care Partners
- Billing/Finance Team

---

## What HMF Does NOT Include

### ❌ Separate Project Tracking Workflow
- All purchase/project records live in **ASS2 Inclusions**, not in a separate HMF system
- Inclusion lifecycle (Draft → Ready → Active → Closed) is owned by ASS2
- Project stages (New → Quoted → Approved → Completed) are tracked within the Inclusion record

### ❌ Separate Approval/Payment Logic
- Readiness validation, budget linkage, and payment gating are all **ASS2 responsibilities**
- HMF provides the **criteria templates**, but ASS2's criteria engine evaluates them

### ❌ Duplicate Linkage to Budgets
- Assessment ↔ Budget ↔ Supplier linkage happens in **ASS2**
- HMF simply defines what data contractors provide; ASS2 handles the linkage

### ❌ Invoice Validation Logic
- Invoice auto-hold/auto-release based on Inclusion readiness is **ASS2's domain**
- HMF may provide reason codes specific to home modifications, but ASS2 executes the gating

---

## Integration with ASS1/ASS2

### How HMF Fits Into the Larger System

**ASS1 (Assessment Intake)**:
- Care Partner creates Inclusion with action plan
- Action plan says: "Need contractor assessment for ramp"
- ASS1 sends assessment request to Home Modifications Contractor (supplier type defined by HMF)
- Contractor uploads quote and documents (format defined by HMF)
- Documents are stored in the Assessment object (owned by ASS1)

**ASS2 (Inclusion Lifecycle)**:
- Inclusion has compliance criteria (templates defined by HMF)
- Example criteria: "2 independent contractor quotes + building permit + completion certificate"
- ASS2 evaluates: Are all required assessments complete? Are all documents approved?
- Compliance team uses HMF's "Works" dashboard to review and approve documents
- When criteria are satisfied, ASS2 moves Inclusion to "Ready"
- ASS2 handles payment milestones based on HMF's milestone definitions
- When all milestones complete, Inclusion moves to "Closed"

**The Flow**:
1. CP creates Inclusion (ASS2) → triggers contractor assessment request (ASS1)
2. Contractor (HMF supplier type) uploads quote via assessment (ASS1)
3. Compliance team reviews via "Works" dashboard (HMF UI) and approves documents
4. ASS2 evaluates compliance criteria (using HMF templates) → marks criteria as satisfied
5. ASS2 readiness check passes → Inclusion moves to Ready/Active
6. ASS2 releases payment based on milestones (HMF milestone definitions)
7. Work completes → ASS2 closes Inclusion

---

## PSF Integration Note

### PSF is Being Merged into HMF

**Why**:
- Product suppliers don't require complex compliance workflows
- Products have pricing detailed in invoices, no separate compliance docs
- Product suppliers simply need to be registered and able to supply records to the organization

**What this means**:
- HMF will include **both** contractor and product supplier onboarding
- "Supplier type" will include:
  - Home Modifications Contractors (with full compliance workflow)
  - Product Suppliers (with simpler registration and order fulfillment)
- The "Works" dashboard is specific to home modifications (contractors)
- Product suppliers may have a simpler view or share the general billing/invoice view

**Product Supplier specifics** (from PSF, now merged into HMF):
- Product categories: AT, mobility aids, clinical consumables, nutrition products, communication supports, domestic life products, managing body functions products
- Product suppliers create price lists for their categories
- Product suppliers fulfill orders from approved Inclusions (no complex assessment process)
- Bill validation happens in ASS2 (Assessment + Budget + Supplier linkage)

---

## Summary: The New HMF Scope

### HMF Defines:

1. **Supplier Types**:
   - Home Modifications Contractors
   - Product Suppliers (merged from PSF)

2. **Onboarding Processes**:
   - Verification requirements for each supplier type
   - Credentials, licenses, certifications needed
   - Service areas and capabilities

3. **Assessment Data Formats**:
   - What contractors provide when fulfilling assessment requests
   - Quote structure, document types, metadata

4. **Compliance Criteria Templates**:
   - What criteria apply to home modification Inclusions
   - State-conditional requirements
   - Multiple quote requirements
   - Document approval requirements
   - Milestone definitions

5. **Compliance Dashboard ("Works" Tab)**:
   - UI for compliance team to review home modification works
   - Document approval workflow
   - Status tracking and reporting

6. **Payment Milestone Definitions**:
   - Standard installment structures for home modifications
   - What criteria trigger each payment release

7. **Notification Framework**:
   - Who gets notified when, and with what content

### ASS2 Owns:
- Inclusion records (single source of truth)
- Assessment objects and their lifecycle
- Action plan criteria evaluation
- Readiness validation and state transitions
- Budget linkage
- Invoice gating and payment processing
- Audit trails and compliance reporting

---

## Key Takeaway for Epic Development

When developing full HMF epic content (IDEA-BRIEF → Spec → Plan → Tasks → Stories):

**Focus on**:
- Supplier type definitions and onboarding workflows
- Compliance criteria templates and their conditional logic
- Dashboard/UI specifications for compliance team
- Data format specifications for contractor quotes
- Integration points with ASS1/ASS2 (how assessment requests are sent, how criteria are evaluated)

**Do NOT duplicate**:
- Inclusion lifecycle logic (that's ASS2)
- Assessment creation/submission workflows (that's ASS1)
- Budget linkage logic (that's ASS2)
- Invoice validation and payment processing (that's ASS2)

**Think of HMF as**:
- The supplier ecosystem layer (who are the suppliers, how do they onboard, what do they provide)
- The compliance UI layer (how compliance team interacts with home mod Inclusions)
- The criteria definition layer (what requirements apply to home mods)

**NOT as**:
- A parallel workflow system competing with Inclusions
- A separate project management tool
- A duplicate payment processing system

---

## References for Epic Development

### ASS1/ASS2 Context (for understanding integration points):
- ASS1 IDEA-BRIEF: `.claude/INITIATIVES/TP-1859-Clinical-And-Care-Plan/TP-1904-ASS1-Assessment-Prescriptions/IDEA-BRIEF.md`
- ASS1 Spec: `.claude/INITIATIVES/TP-1859-Clinical-And-Care-Plan/TP-1904-ASS1-Assessment-Prescriptions/spec.md`
- ASS2 Old IDEA-BRIEF: `.claude/INITIATIVES/TP-1859-Clinical-And-Care-Plan/TP-2914-ASS2-Inclusion-Integration/ASS2_old_con_files/old_ASS2_Idea_Brief.md`
- ASS2 Old PRD: `.claude/INITIATIVES/TP-1859-Clinical-And-Care-Plan/TP-2914-ASS2-Inclusion-Integration/ASS2_old_con_files/old_ASS2_PRD.md`

### PSF Context (being merged into HMF):
- PSF Project Management Plan: `.claude/INITIATIVES/TP-1857-Supplier-Management/TP-3156-PSF-Product-Supplier-Flow/DUMP/other_context/product-supplier-process---project-management-plan.md`
- PSF Workflow Summary: `.claude/INITIATIVES/TP-1857-Supplier-Management/TP-3156-PSF-Product-Supplier-Flow/DUMP/other_context/PSF - Workflow Summary Text Extract.md`
- PSF Communications Plan: `.claude/INITIATIVES/TP-1857-Supplier-Management/TP-3156-PSF-Product-Supplier-Flow/DUMP/other_context/psf---communications-plan.md`

### HMF Original Context:
- HMF Original IDEA-BRIEF: `.claude/INITIATIVES/TP-1857-Supplier-Management/TP-3155-HMF-Home-Modifications-Flow/IDEA-BRIEF.md`
- HMF Project Management Plan: `.claude/INITIATIVES/TP-1857-Supplier-Management/TP-3155-HMF-Home-Modifications-Flow/DUMP/other_context/Home-Modifications-Supplier-Process-Project-Management-Plan.md`
- HMF Communications Plan: `.claude/INITIATIVES/TP-1857-Supplier-Management/TP-3155-HMF-Home-Modifications-Flow/DUMP/other_context/HMS-Communications-Plan.md`

### Requirements Extracted for ASS2:
- Supplier Workflow Requirements (extracted from HMF/PSF for ASS2 use): `.claude/INITIATIVES/TP-1859-Clinical-And-Care-Plan/TP-2914-ASS2-Inclusion-Integration/DUMP/other_context/supplier-workflow-requirements-from-hmf-psf.md`

---

## Use This Summary To:

1. Generate revised IDEA-BRIEF for HMF with correct scope
2. Run /trilogy.clarify to identify ambiguities in supplier onboarding and compliance workflows
3. Create full spec.md focusing on supplier types, onboarding, and compliance UI
4. Develop plan.md and tasks.md for implementation
5. Generate stories for Jira if needed

**The key is**: HMF is not a parallel system. It's the **supplier layer** that plugs into the **Inclusions system (ASS2)**. Everything purchase-specific lives in Inclusions; HMF defines what suppliers provide and how compliance reviews it.
