# Supplier Workflow Requirements Extracted from HMF/PSF Context

**Date**: 2025-12-05 (Updated: 2025-12-08)
**Source**: Analysis of TP-3155-HMF and TP-3156-PSF context documents
**Purpose**: Key workflow details, validation rules, and compliance requirements that must be incorporated into ASS2 (Inclusion Lifecycle & Integration)

---

## Context

During gap assessment between Group 1 (HMF/PSF supplier workflows) and Group 2 (ASS1/ASS2 assessment & inclusion workflows), we identified that HMF and PSF are not parallel workflows but rather:
- Supplier type definitions and onboarding processes
- Domain-specific compliance dashboards (e.g., "Works" tab for home modifications)
- Data format specifications for what suppliers provide

The actual purchase/project lifecycle, assessment linkage, and payment validation logic belongs in ASS2 (Inclusions module). Below are the specific requirements extracted from HMF/PSF that ASS2 must support.

---

## CRITICAL: HMF vs ASS2 Scope Boundary (Updated 2025-12-08)

**What HMF Builds (UI Shell)**:
- Supplier Portal tabs: Pricing (fixed rates for non-HM services), Documents & Agreements (quote submissions), Works (active projects)
- Compliance Dashboard UI (Works tab for compliance team document approval)
- Supplier onboarding (contractors with 23+8 documents, product suppliers with category selection)
- Validation APIs (category verification, credential validation, multi-quote validation) - HMF provides the APIs, ASS2 calls them
- Data structure definitions (compliance criteria templates, payment milestones) - HMF defines the schema, ASS2 uses the data

**What ASS2 Owns (Business Logic)**:
- **Inclusion lifecycle and state management** - all Inclusion states, transitions, substates
- **Quote selection workflow** - care partner selecting which contractor quote becomes "the work"
- **Linking selected quote → work** - when a quote is selected, ASS2 links it to the Inclusion
- **Compliance criteria evaluation logic** - ASS2 evaluates the criteria templates that HMF defines
- **Payment gating and milestone-based invoice auto-hold/release** - HMF defines milestones (30%/40%/30%), ASS2 executes the gating logic
- **Inclusion readiness validation** - ASS2 calls HMF's validation APIs
- **All workflow logic that populates the HMF UI** - ASS2 provides the data, HMF displays it

**The Complete Workflow (Competitive Quoting → Work)**:
1. Inclusion created (ASS2) with compliance criteria requiring 2 independent quotes
2. Assessment requests sent to 2 contractors (ASS2 creates assessment requests, ASS1 routes them)
3. Contractors submit quotes with documents → appear in Documents & Agreements tab (HMF UI shows submissions, documents stored via ASS1)
4. **Care partner selects winning quote (ASS2 logic - THIS IS CRITICAL ASS2 FUNCTIONALITY)**
5. Selected quote becomes "the work" → linked to Inclusion (ASS2 creates linkage)
6. Work appears in Works tab (HMF UI displays the linked work, data comes from ASS2)
7. Compliance team reviews documents in Works tab (HMF UI)
8. Document approvals update compliance criteria (ASS2 evaluates criteria completion)
9. Payment milestones trigger invoice release (ASS2 payment gating logic)

**Key Insight**: HMF is the "shell" - the tabs, forms, dashboards. ASS2 is the "engine" - the state machine, validation rules, payment logic, workflow orchestration.

---

## 0. Quote Selection and Pricing Context (NEW - Critical for ASS2)

**Source**: Updated HMF scope clarification 2025-12-08

### Pricing Models for Contractors

Contractors have TWO distinct pricing approaches:

1. **Fixed Hourly Rates (for non-HM services)**: Home maintenance, repairs, etc.
   - Stored in contractor profile
   - Displayed in Pricing tab (HMF UI)
   - Rates vary by day type: weekday, weekday non-standard, Saturday, Sunday, public holiday
   - Example: Home maintenance $75/weekday, $90/weekday non-standard, $112.50/Saturday

2. **Quote-by-Quote (for Home Modifications work)**: ALWAYS custom quotes, never fixed pricing
   - Each home mod project requires site assessment and custom quote
   - Quotes submitted via assessment response (documents stored via ASS1)
   - Pricing tab shows "Quote Basis - Per Project" for Home Modifications

### Competitive Quoting Workflow (ASS2 MUST BUILD)

**The Problem to Solve**: When an Inclusion requires home modification work (e.g., ramp installation), the system needs to:
1. Solicit quotes from 2+ independent contractors (multi-quote requirement)
2. Allow care partner to review all submitted quotes
3. Enable care partner to select the winning quote
4. Link the selected quote to the Inclusion (becomes "the work")
5. Display the work in the contractor's Works tab (HMF UI)

**ASS2 Responsibilities**:

1. **Quote Request Management**:
   - Create 2+ assessment requests for same Inclusion (e.g., "ramp quote needed")
   - Track which contractors have been invited to quote
   - Validate that each assessment request goes to a different contractor (enforce independence)

2. **Quote Submission Handling**:
   - Receive quote submissions from contractors (via ASS1 assessment completion)
   - Extract quote amount from submitted documents
   - Track quote status: Pending / Submitted / Under Review / Selected / Rejected

3. **Quote Selection Interface** (ASS2 must provide data for this UI):
   - Show care partner all submitted quotes side-by-side
   - Display: contractor name, quote amount, submission date, documents attached
   - Allow care partner to SELECT one quote as the winner
   - Record selection: who selected, when, reason (optional)

4. **Selected Quote → Work Linkage**:
   - When quote selected, create "Work" record linked to Inclusion
   - Link winning contractor to the Inclusion as the supplier
   - Copy quote amount to Inclusion.approved_amount
   - Update Inclusion compliance criteria: "winning_quote_selected = true"
   - Trigger notification to winning contractor: "Your quote was accepted"
   - Trigger notification to other contractors: "Quote not selected this time"

5. **Works Tab Data Population** (ASS2 provides data, HMF displays):
   - Provide API/data for Works tab showing:
     - Work description (from Inclusion)
     - Client name
     - State/territory
     - Quote amount (from selected quote)
     - Approved amount (from budget allocation)
     - Work status (New, Quoted, Under Review, Approved, In Progress, Completed)
     - Payment status (Pending, Partial, Paid)
     - Document list with approval statuses
     - Compliance milestones progress

**Data Model Impact (ASS2)**:
```
Inclusion:
  - compliance_criteria_config (JSON including multi_quote_requirement: 2)
  - selected_quote_id (FK to Assessment - the winning quote)
  - linked_supplier_id (FK to Supplier - the winning contractor)
  - approved_amount (copied from selected quote)
  - work_status (enum)
  - payment_status (enum)

Assessment (quote submissions):
  - quote_amount (extracted from submitted quote document)
  - quote_status (Pending/Submitted/UnderReview/Selected/Rejected)
  - selected_at (timestamp)
  - selected_by (user_id)
  - selection_reason (text, optional)
```

**UI Components ASS2 Must Support**:
- Multi-quote comparison view (show all quotes side-by-side for selection)
- Quote selection action (button/form to select winning quote)
- Works data API (provide all work details for HMF Works tab to display)

---

## 1. State/Territory-Specific Compliance Requirements

**Source**: HMF Home Modifications workflow

**Requirement**:
- Home Modifications require state-specific compliance documentation
- Different states/territories have different regulatory requirements
- Document requirements are triggered based on project location

**ASS2 Impact**:
- Compliance criteria templates must support **conditional logic based on geographic location**
- Action plan criteria system needs to handle geo-conditional requirements
- Example: `If client.state = 'VIC', then require document_type = 'Building Permit - VIC'`
- Criteria engine needs: "If [condition], then require [specific documents]"

---

## 2. Multiple Independent Quotes Requirement

**Source**: Ramp installation example workflow

**Requirement**:
- Some compliance criteria require multiple independent assessments from different suppliers
- Example: "Need 2 independent contractor quotes for this ramp"
- System must prevent the same supplier from fulfilling multiple quote requirements

**ASS2 Impact**:
- Assessment Request creation must support requesting multiple assessments of same type from different suppliers
- Compliance criteria must track quantity: "2 of 2 contractor quotes received and approved"
- Action plan criteria needs **quantity tracking**: "X of Y required assessments completed"
- Validation: ensure different suppliers fulfill each required assessment

---

## 3. Document Type Classification

**Source**: HMF "Works" tab mockup showing document list

**Document types for home modifications compliance**:
1. Quote (from contractor assessment)
2. Building Permit (state-specific)
3. Completion Certificate
4. Progress/Completion Photos (Before and After)

**ASS2 Impact**:
- Document upload needs auto-classification or manual tagging by document type
- Document type enum should be defined and enforced
- Different compliance criteria require different document type combinations
- This taxonomy should be extensible for other inclusion types

---

## 4. Per-Document Approval Tracking

**Source**: HMF mockup showing "Documents (4)" with "4 / 4 approved"

**Requirement**:
- Each document within an assessment can have individual approval status
- Aggregate tracking shows: "X of Y documents approved"
- Compliance criteria completion depends on all required documents being approved

**ASS2 Impact**:
- Compliance criteria needs **per-document approval tracking**, not just per-assessment
- Approval granularity: Assessment > Document > Approval Status
- Readiness gate: "All required documents approved" before Inclusion can progress
- This is more granular than "Assessment completed" status

---

## 5. Milestone-Based Payment Logic (Installments)

**Source**: HMF installment payment tracking

**Requirement**:
- Home Modifications use installment payments tied to progress verification
- Payments released after specific milestones with evidence (e.g., progress photos)
- Not single lump-sum payment like products

**Example payment stages**:
- 30% on quote approval
- 40% on progress verification (photos submitted and approved)
- 30% on completion certificate

**ASS2 Impact**:
- Payment logic must support **milestone-based payments**
- Inclusion readiness might have multiple payment gates (not just one "Ready → Paid" transition)
- Invoice gating needs to support **partial payments** linked to **specific compliance criteria completion**
- Each payment milestone should reference specific action plan criteria (e.g., "Release 40% when progress_photos.approved = true")

---

## 6. Project Lifecycle Stages

**Source**: HMF workflow stages

**Stages**:
New → Quoted → Documents Received → Under Review → Escalated → Approved/Rejected → Completed

**ASS2 Impact**:
- These may map to **Inclusion lifecycle substates** for home modification Inclusions
- Or they may be **compliance criteria sub-tracking** within action plan
- "Escalated" state suggests ASS2 needs **exception handling workflows**
- "Completed" is distinct from "Paid":
  - Completed = work is done, evidence submitted
  - Paid = payment fully processed
- Need to track both work completion status and payment status separately

---

## 7. Mandatory Three-Way Linkage Validation

**Source**: PSF bill validation workflow

**Requirement**:
- Assessment ↔ Budget ↔ Supplier linkage is mandatory before bill payment
- Bills are validated against:
  - Assessment exists?
  - Supplier linked to assessment?
  - Budget allocation available?
  - Category/Tier-5 valid?

**ASS2 Impact**:
- **Readiness checklist** must include:
  - ✓ Assessment completed
  - ✓ Supplier linked
  - ✓ Budget allocated
  - ✓ Category/Tier-5 validated
- These are **blocking requirements** before Inclusion can move to "Ready" or "Active"
- Validation logic should be in ASS2's readiness rules engine
- Each validation failure should produce specific reason code

---

## 8. Bill Rejection Reason Code Taxonomy

**Source**: PSF automated bill rejection with reason codes

**Requirement**:
- When validation fails, bill is rejected with specific reason code
- Automated notifications sent with corrective instructions
- Reason codes guide suppliers/care team on what needs fixing

**Example reason codes**:
- "No linked assessment"
- "Insufficient budget allocation"
- "Supplier not verified for this category"
- "Missing required compliance documentation"
- "Assessment not yet approved"
- "Budget item expired or closed"

**ASS2 Impact**:
- Invoice gating auto-hold must include **reason code** in response
- ASS2 needs a **comprehensive reason code taxonomy** for invoice holds
- Reason codes should map to specific **action plan criteria gaps**
- Each reason code should trigger specific notification with remediation steps

---

## 9. Supplier Category Verification

**Source**: PSF supplier registration and category approval

**Requirement**:
- Suppliers must be verified for specific product categories (AT, mobility, consumables, etc.)
- Bills can only be paid if supplier is approved for the product category they're billing for
- Category verification happens at supplier onboarding, but must be validated per-transaction

**ASS2 Impact**:
- Supplier linkage validation must check: "Is this supplier verified for the Tier-5 category of this Inclusion?"
- ASS2 needs access to **supplier capability/category data** (likely from supplier registration system)
- Readiness criteria must include: "Supplier verified for [Tier-5 category]"
- Validation rule: `supplier.verified_categories.includes(inclusion.tier5_category)`

---

## 10. Automated Notification Framework

**Source**: Both HMF and PSF communication plans and workflow descriptions

**Notification triggers**:
- Supplier is linked to assessment
- Bill/invoice is rejected (with reason code)
- Product/work is paid
- Missing linkage prevents payment
- Documents are approved/rejected
- Inclusion status changes (Draft → Ready → Active → Closed)
- Compliance criteria completed
- Action plan milestones reached

**Notification recipients**:
- Care Team (Care Partners, Coordinators)
- Compliance Team
- Supplier
- Billing/Finance Team
- Operations Team

**ASS2 Impact**:
- ASS2's Inclusion lifecycle needs **notification hooks** at state transitions
- Notification system must support:
  - Event-based triggers (state change, validation failure, criteria completion)
  - Role-based recipients (send to relevant stakeholders only)
  - Contextual content (what changed, why, what action required)
- Notifications should include deep links to relevant Inclusion/Assessment records

---

## 11. "Completed" vs "Paid" Status Distinction

**Source**: HMF project stages showing both completion and payment tracking

**Requirement**:
- Work completion status is separate from payment status
- A project can be "Completed" (work done, evidence submitted) but not yet "Paid"
- A project can be partially paid (installments) while still in progress

**Status types needed**:
- **Work Status**: In Progress → Completed → Verified
- **Payment Status**: Pending → Partial → Paid in Full
- **Compliance Status**: Documents Pending → Under Review → Approved → Rejected

**ASS2 Impact**:
- Inclusion lifecycle needs to track **multiple status dimensions** simultaneously
- Work completion doesn't automatically trigger payment release
- Payment gates depend on **specific compliance criteria completion**, not just overall work status
- Dashboard/reporting needs to show these statuses independently

---

## 12. Document Approval Workflow with Compliance Review

**Source**: HMF "Works" tab showing per-document approval by compliance team

**Requirement**:
- Compliance team reviews and approves individual documents
- Documents can be approved/rejected independently
- Overall work cannot progress until all required documents approved
- Document approval is a distinct action from assessment submission

**Workflow**:
1. Supplier (contractor) submits assessment with documents
2. Compliance team reviews each document individually
3. Compliance team can approve/reject with comments
4. If rejected, supplier must resubmit corrected document
5. Once all required documents approved, compliance criteria is satisfied

**ASS2 Impact**:
- Need **document-level approval workflow** within assessments
- Compliance team role needs permission to approve/reject documents
- Document approval status must feed into compliance criteria completion
- Rejection workflow: document.status = 'rejected' + rejection_reason + notification to supplier
- Resubmission tracking: version history for rejected/resubmitted documents

---

## Summary: Integration Points for ASS2

### Core Requirements ASS2 Must Support:

**Criteria Engine**:
- Conditional criteria based on location/context
- Quantity-based tracking (X of Y)
- Per-document approval requirements
- Milestone-based progression

**Validation & Readiness**:
- Three-way linkage validation (Assessment + Budget + Supplier)
- Supplier category verification
- State-conditional document requirements
- Blocking requirements before state transitions

**Payment Logic**:
- Milestone-based installment payments
- Partial payment tracking
- Payment release tied to specific criteria completion
- Separate work completion vs payment completion tracking

**Workflow Support**:
- Exception handling (Escalated state)
- Per-document approval within assessments
- Reason code taxonomy for validation failures
- Multiple concurrent status dimensions (work, payment, compliance)

**Notifications**:
- Event-based triggers at lifecycle transitions
- Role-based recipient routing
- Contextual content with remediation instructions

---

## Next Steps

When writing full ASS2 epic content:
1. Incorporate these requirements into Inclusion lifecycle design
2. Define compliance criteria schema supporting conditional logic and quantity tracking
3. Specify readiness checklist validation rules
4. Design milestone-based payment engine
5. Create reason code taxonomy and notification framework
6. Define per-document approval workflow for compliance team

---

## References

- HMF IDEA-BRIEF: `.claude/INITIATIVES/TP-1857-Supplier-Management/TP-3155-HMF-Home-Modifications-Flow/IDEA-BRIEF.md`
- HMF Project Management Plan: `.claude/INITIATIVES/TP-1857-Supplier-Management/TP-3155-HMF-Home-Modifications-Flow/DUMP/other_context/Home-Modifications-Supplier-Process-Project-Management-Plan.md`
- PSF Project Management Plan: `.claude/INITIATIVES/TP-1857-Supplier-Management/TP-3156-PSF-Product-Supplier-Flow/DUMP/other_context/product-supplier-process---project-management-plan.md`
- PSF Workflow Summary: `.claude/INITIATIVES/TP-1857-Supplier-Management/TP-3156-PSF-Product-Supplier-Flow/DUMP/other_context/PSF - Workflow Summary Text Extract.md`
