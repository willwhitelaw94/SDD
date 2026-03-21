---
title: "Feature Specification: Home Modifications Flow (HMF)"
---

> **[View Mockup](/mockups/home-modifications-flow/index.html)**{.mockup-link}


**Feature Branch**: `TP-3155-hmf-supplier-ecosystem`
**Created**: 2025-12-05
**Status**: Draft
**Epic**: TP-3155 | **Initiative**: TP-1857 Supplier Management

---

## Overview

Build the supplier ecosystem layer (UI shell + supplier management) for home modifications and products. HMF provides the supplier-facing and compliance-facing interfaces, while ASS2 owns the Inclusion business logic that powers these views.

**What HMF Builds**:
- Supplier onboarding (contractors with 23+8 documents, product suppliers with category selection)
- Supplier Portal tabs: Pricing (fixed rates for non-HM services), Documents & Agreements (quote submissions), Works (active projects)
- Compliance Dashboard UI (Works tab for compliance team review)
- Validation APIs and data structure contracts (for ASS2 to consume)

**Critical Scope Boundary**:
- **HMF Builds**: The supplier UI shell, compliance dashboard UI, supplier onboarding, validation APIs, data structure definitions
- **ASS2 Owns**: Inclusion lifecycle, quote selection workflow, criteria evaluation logic, payment gating, linking selected quote → work
- **ASS1 Owns**: Assessment creation, document storage, assessment routing
- **The Workflow**: Inclusion (ASS2) → Assessment requests sent → Contractors submit quotes (Documents tab - HMF UI) → Care partner selects winning quote (ASS2 logic) → Becomes "Work" (Works tab - HMF UI, data from ASS2)

**Pricing Clarification**:
- Home Modifications work is ALWAYS quote-by-quote (never fixed pricing)
- Contractors CAN have fixed hourly rates for OTHER services (home maintenance, repairs) - these appear in Pricing tab

---

## User Scenarios & Testing

### User Story 1 - Product Supplier Onboarding (Priority: P1)

**As a** product supplier, I want to register and select product categories I can supply so that I can receive orders for approved Inclusions.

**Why this priority**: This is the simplest foundational workflow. Product suppliers need minimal onboarding (no complex credentials), making this the fastest path to value. Enables product suppliers to participate in the ecosystem and validates basic supplier registration flow.

**Independent Test**: Can be fully tested by completing supplier registration form, selecting Tier-3 categories, optionally creating price lists, and verifying supplier profile is created with verified categories stored. Delivers value by enabling product suppliers to register and be available for Inclusion orders.

**Acceptance Scenarios**:

1. **Given** I am a new product supplier, **When** I complete registration with business name, ABN, and contact details, **Then** my supplier profile is created
2. **Given** I am registering as product supplier, **When** I view Tier-3 category selection, **Then** I see the Support at Home canonical list (Communication and Information Management Products, Domestic Life Products, Home Modification Products, Home Modifications Prescription and Clinical Support, Managing Body Functions, Mobility Products, Self-care Products)
3. **Given** I am completing registration, **When** I select multiple Tier-3 categories, **Then** the system stores my verified categories for later validation
4. **Given** I have selected Tier-3 categories, **When** I optionally create price lists, **Then** price lists are linked to my selected categories
5. **Given** I have completed registration, **When** I view my supplier profile, **Then** I see my verified categories and can add more categories later

---

### User Story 2 - Home Modifications Contractor Onboarding (Priority: P2)

**As a** home modifications contractor, I want to complete verification with state-specific credentials so that I can receive assessment requests for home modification projects.

**Why this priority**: Contractors require more complex onboarding than product suppliers (state licensing, insurance, credentials). This is second priority because it builds on the basic supplier registration flow but adds credential verification. Essential for home modifications but not blocking product supplier flow.

**Independent Test**: Can be fully tested by completing contractor registration with all required credentials, selecting service areas, specifying capabilities, and verifying contractor profile is created with all verification data. Delivers value by enabling contractors to register and receive assessment requests.

**Acceptance Scenarios**:

1. **Given** I am a new home modifications contractor, **When** I start registration, **Then** I am prompted for standard supplier business details (handled generically for all supplier types)
2. **Given** I am completing contractor registration, **When** I specify service areas, **Then** I select which states/territories I operate in (VIC, NSW, QLD, WA, SA, TAS, ACT, NT)
3. **Given** I have selected service areas, **When** I view document requirements, **Then** I see 23 required home modifications documents plus state-specific contract documents for my selected states
4. **Given** I am uploading required documents, **When** I upload documents with expiry dates (Builders Warranty Insurance, Workers Compensation, WorkSafe, Professional Body Membership, WA/NT contracts), **Then** I am prompted to enter expiry date for each
5. **Given** I have selected a state (e.g., VIC), **When** I view state-specific requirements, **Then** I see the required contract document (e.g., "VIC Major Domestic Building Contract") and registration disclaimer
6. **Given** I have selected service states, **When** I view registration disclaimers, **Then** I see threshold warnings for each state (e.g., "VIC: Domestic building work > $10,000 requires registration with Victorian Building Authority")
7. **Given** I am completing registration, **When** I specify capabilities, **Then** I select types of modifications I can perform (ramps, bathroom modifications, stair lifts, accessibility modifications, etc.)
8. **Given** I have completed all required fields and uploaded all documents, **When** I submit registration, **Then** my contractor profile is created with pending verification status
9. **Given** I have completed registration, **When** I optionally configure quote templates, **Then** templates are saved for future use

---

### User Story 3 - Contractor Receives Assessment Request and Submits Quote (Priority: P3)

**As a** contractor, I want to receive assessment requests and submit quotes with required documents so that compliance team can review and approve my work.

**Why this priority**: This enables the core contractor workflow after onboarding. Depends on contractor registration (P2) and ASS1 sending assessment requests. Critical for home modification flow but requires multiple systems to be in place.

**Independent Test**: Can be fully tested by creating an assessment request (via ASS1), contractor receiving notification, viewing request details, uploading quote and documents, and verifying submission is received. Delivers value by enabling contractors to respond to assessment requests.

**Acceptance Scenarios**:

1. **Given** an Inclusion requires contractor assessment, **When** assessment request is sent (via ASS1), **Then** I receive notification with request details
2. **Given** I have received assessment request, **When** I view request, **Then** I see client details, modification required, location (state/territory), and deadline
3. **Given** I am viewing assessment request, **When** I see location, **Then** system displays required documents based on state (e.g., "VIC requires Building Permit - VIC")
4. **Given** I am responding to assessment request, **When** I upload quote document, **Then** system accepts PDF with pricing, scope of work, and timeline
5. **Given** I am submitting quote, **When** I upload required compliance documents, **Then** I upload each document type (Quote, Building Permit if required, initial photos if applicable)
6. **Given** I have uploaded all documents, **When** I submit assessment response, **Then** compliance team is notified and documents are stored in assessment object (via ASS1)
7. **Given** I submit assessment, **When** submission is complete, **Then** I can view submission status and uploaded documents in my contractor portal

---

### User Story 4 - Compliance Team Views Works Dashboard (Priority: P4)

**As a** compliance team member, I want to view all home modification works grouped by supplier so that I can efficiently review and approve documents.

**Why this priority**: This is the compliance team's primary interface for reviewing home modifications. Depends on contractors submitting assessments (P3) and Inclusions existing with compliance criteria. Core value delivery for compliance oversight.

**Independent Test**: Can be fully tested by creating multiple home modification Inclusions with assessment submissions, viewing Works dashboard, filtering by supplier, and verifying all work details are displayed correctly. Delivers value by providing centralized compliance review interface.

**Acceptance Scenarios**:

1. **Given** I am a compliance team member, **When** I access Works tab, **Then** I see only Inclusions with supplier type = Home Modifications Contractor
2. **Given** I am viewing Works dashboard, **When** works are displayed, **Then** they are grouped by contractor/supplier
3. **Given** I am viewing a supplier's works, **When** I see work cards, **Then** each shows: work description, client name, linked budget item, state/territory, quote amount, approved amount
4. **Given** I am viewing a work card, **When** I see document section, **Then** I see document list with per-document approval status and aggregate count (e.g., "4 / 4 approved")
5. **Given** I am viewing a work card, **When** I see status indicators, **Then** I see separate work status (New, Quoted, Under Review, Approved, Completed) and payment status (Pending, Partial, Paid)
6. **Given** I am viewing Works dashboard, **When** I filter or search, **Then** I can filter by supplier, state, work status, payment status

---

### User Story 5 - Compliance Team Approves or Rejects Individual Documents (Priority: P5)

**As a** compliance team member, I want to approve or reject each document individually so that contractors know exactly what needs fixing.

**Why this priority**: This enables granular document review which is essential for compliance quality. Depends on Works dashboard (P4) and documents being submitted. Core compliance functionality but depends on earlier stories.

**Independent Test**: Can be fully tested by viewing submitted documents, approving some, rejecting others with reasons, verifying contractor receives notifications, and tracking document status changes. Delivers value by enabling precise compliance feedback.

**Acceptance Scenarios**:

1. **Given** I am viewing a work with submitted documents, **When** I click on a document, **Then** I can view the document and see approve/reject actions
2. **Given** I am reviewing a document, **When** I approve it, **Then** document status changes to "Approved" and approval is timestamped
3. **Given** I am reviewing a document, **When** I reject it, **Then** I must provide rejection reason
4. **Given** I have rejected a document, **When** rejection is saved, **Then** contractor receives notification with rejection reason and remediation instructions
5. **Given** contractor receives rejection, **When** they resubmit corrected document, **Then** new version is uploaded and previous version is retained in history
6. **Given** I am viewing documents, **When** I check approval status, **Then** I see which documents are approved, rejected, or pending for each work
7. **Given** all required documents are approved, **When** I view work status, **Then** compliance criteria for this work is marked as satisfied (this updates Inclusion via ASS2)

---

### User Story 6 - System Validates Supplier Category for Billing (Priority: P6)

**As the system**, I need to validate product supplier is verified for Tier-3 category so that only qualified suppliers can bill for specific product categories.

**Why this priority**: This is critical validation logic that prevents billing errors, but it's an integration point with ASS2 rather than standalone HMF functionality. ASS2 calls this validation during Inclusion readiness checks. Important for data integrity but not user-facing workflow.

**Independent Test**: Can be fully tested by creating product Inclusion with specific Tier-3 category, attempting billing from supplier with matching category (should succeed), attempting billing from supplier without matching category (should fail with reason code). Delivers value by ensuring billing compliance.

**Acceptance Scenarios**:

1. **Given** ASS2 is validating Inclusion readiness, **When** validation checks supplier category, **Then** system confirms supplier.verified_categories includes inclusion.tier3_category
2. **Given** supplier is verified for Tier-3 category, **When** validation runs, **Then** validation passes and Inclusion can progress
3. **Given** supplier is NOT verified for Tier-3 category, **When** validation runs, **Then** validation fails with reason code "Supplier not verified for category: [category name]"
4. **Given** validation fails, **When** ASS2 processes result, **Then** Inclusion remains in current state and reason code is logged
5. **Given** product supplier, **When** they attempt to add new Tier-3 category to their profile, **Then** they can update verified categories and future validations use updated list

---

### User Story 7 - Automated Notifications for Contractors and Compliance (Priority: P7)

**As a** contractor or compliance team member, I want to receive automated notifications for key events so that I know when action is required.

**Why this priority**: Notifications improve user experience and reduce delays, but the core workflows can function without them. This is enhancement priority - valuable but not blocking core functionality.

**Independent Test**: Can be fully tested by triggering each notification event (assessment request sent, document approved, document rejected, etc.) and verifying correct recipients receive notifications with correct content. Delivers value by keeping stakeholders informed proactively.

**Acceptance Scenarios**:

1. **Given** assessment request is created for contractor, **When** request is sent, **Then** contractor receives notification with request details and deadline
2. **Given** contractor submits quote and documents, **When** submission is complete, **Then** compliance team receives notification that new work is ready for review
3. **Given** compliance team approves a document, **When** approval is saved, **Then** contractor receives notification confirming approval
4. **Given** compliance team rejects a document, **When** rejection is saved, **Then** contractor receives notification with rejection reason and what needs to be corrected
5. **Given** all compliance criteria satisfied for a work, **When** payment milestone is reached, **Then** relevant parties (contractor, finance, care partner) receive notification
6. **Given** work requires escalation, **When** escalation is flagged, **Then** compliance manager receives notification

---

### Edge Cases

#### Supplier Onboarding
- What happens when contractor operates in multiple states and each state has different licensing requirements?
  - System must support uploading different credentials per state
  - Service area selection enables state-by-state credential requirements
  - Contractor can be verified for some states but not others

- What happens when product supplier attempts to select Tier-3 category that doesn't exist in canonical list?
  - Category selection is constrained to canonical list only
  - No free-text entry allowed for categories
  - If new category needed, canonical list must be updated first

#### Document Submission
- What happens when contractor submits quote but required state-specific permit not yet obtained?
  - System shows required documents based on state
  - Contractor can submit partial documents (e.g., quote only)
  - Compliance criteria remains unsatisfied until all required documents submitted and approved
  - Compliance team can see which documents are missing

- What happens when state changes compliance requirements mid-project?
  - Criteria templates should be versioned
  - Existing projects continue under original requirements
  - New projects use updated requirements
  - System logs which version of criteria was used

#### Document Approval
- What happens when contractor resubmits document multiple times (rejected repeatedly)?
  - System tracks all document versions with timestamps
  - Compliance team sees rejection history and reasons
  - No automatic rejection after X attempts - manual review continues
  - Escalation flag can be manually set if needed

- What happens when compliance team approves 3 of 4 documents but final document never submitted?
  - Compliance criteria remains unsatisfied (requires all documents)
  - Inclusion cannot progress to Ready state (ASS2 blocks)
  - Aging/staleness rules may flag incomplete work for follow-up

#### Multiple Independent Quotes
- What happens when same contractor attempts to provide multiple independent quotes?
  - System must validate different suppliers for each quote requirement
  - If same contractor linked to multiple assessments for same Inclusion, validation fails
  - Reason code: "Independent quotes must be from different suppliers"
  - Care Partner must select different contractor for second quote

#### Category Validation
- What happens when product supplier attempts to bill for category not in verified list?
  - ASS2 validation fails during Inclusion readiness check
  - Reason code: "Supplier not verified for category: [category]"
  - Inclusion cannot progress until supplier adds category or different supplier is linked
  - Supplier can update their verified categories to resolve

#### Escalation
- How does system handle escalation when compliance team needs additional review?
  - Compliance team can manually flag work for escalation
  - Escalation changes work status to "Escalated"
  - Escalated works surface in priority queue for compliance manager
  - Escalation doesn't block contractor from viewing or updating documents

---

## Functional Requirements

### Supplier Onboarding

- **FR-001**: System MUST support two distinct supplier types: Home Modifications Contractor and Product Supplier
- **FR-002**: Product suppliers MUST select Tier-3 categories from canonical Support at Home list during registration (Communication and Information Management Products, Domestic Life Products, Home Modification Products, Home Modifications Prescription and Clinical Support, Managing Body Functions, Mobility Products, Self-care Products)
- **FR-003**: Product suppliers MUST be able to select multiple Tier-3 categories
- **FR-004**: Product suppliers MUST be able to add additional Tier-3 categories after initial registration
- **FR-005**: Home Modifications contractors MUST provide 23 required home modifications documents: Builders License, Builders Warranty Insurance, Building Contract, Building Permit, Workers Compensation, WorkSafe, Certificate of Currency, Bank Statement, Certificate of Registration, Business Name Registration Certificate, Tax Certificate, Notice of Assessment, Utility Bill, Professional Body Membership
- **FR-006**: Home Modifications contractors MUST provide state-specific contract documents based on selected service areas:
  - QLD: QBCC Contract (Level 2)
  - NSW: NSW Building Contract
  - VIC: VIC Major Domestic Building Contract
  - ACT: ACT Residential Building Work Contract
  - SA: SA Domestic Building Contract & SA Building Indemnity Insurance
  - TAS: TAS Residential Building Work Contract & TAS Residential Building Insurance/Statutory Warranties
  - WA: WA Home Building Work Contract & WA Home Indemnity Insurance
  - NT: NT Work Safe, NT Building Contract, & NT Building Permit information
- **FR-007**: System MUST capture expiry dates for the following documents: Builders Warranty Insurance, Workers Compensation, WorkSafe, Professional Body Membership, WA Home Building Work Contract & WA Home Indemnity Insurance, NT Work Safe/Building Contract/Building Permit information
- **FR-008**: System MUST validate that expiry dates are in the future (not expired) at time of upload
- **FR-009**: System MUST display registration disclaimers based on selected service states showing threshold requirements:
  - VIC: "Domestic building work > $10,000 or any structural/building permit work requires registration with Victorian Building Authority (VBA)"
  - NSW: "Residential building work > $5,000 (license); > $20,000 (insurance) requires registration with NSW Fair Trading"
  - QLD: "Building work > $3,300 or structural work of any value requires registration with Queensland Building and Construction Commission (QBCC)"
  - WA: "Residential work > $20,000 or structural work requires registration with Building Services Board / Building and Energy WA"
  - SA: "Building work > $12,000 or requiring development approval requires registration with Consumer and Business Services (CBS)"
  - TAS: "All licensed work (building, plumbing, electrical) regardless of value requires registration with Consumer, Building and Occupational Services (CBOS)"
  - ACT: "Any building work requiring approval must be licensed via ACT Planning and Land Authority (Access Canberra)"
  - NT: "Residential work > $12,000 or any regulated work requires registration with NT Building Practitioners Board"
- **FR-010**: Registration disclaimers MUST NOT block contractor onboarding (informational only, contractor acknowledges responsibility for compliance)
- **FR-011**: Home Modifications contractors MUST specify service areas (which states/territories they operate in: VIC, NSW, QLD, WA, SA, TAS, ACT, NT)
- **FR-012**: Home Modifications contractors MUST specify capabilities (types of modifications: ramps, bathroom mods, stair lifts, accessibility mods, etc.)
- **FR-013**: System MUST store supplier capabilities (verified categories for product suppliers, service areas and credentials for contractors) for later validation
- **FR-014**: Product suppliers MUST be able to create price lists linked to selected Tier-3 categories (optional feature)
- **FR-015**: Home Modifications contractors MUST be able to configure quote templates (optional feature)
- **FR-016**: System MUST conditionally require state-specific contract documents only for states selected in service areas
- **FR-017**: Each uploaded document MUST store: document_type, file_path, uploaded_at, expiry_date (nullable), state_code (nullable for state-specific docs), approval_status, rejection_reason (nullable), approved_by (nullable), approved_at (nullable)

### Compliance Dashboard ("Works" Tab)

- **FR-018**: System MUST provide "Works" tab accessible to compliance team
- **FR-019**: Works tab MUST filter to show only Inclusions with supplier type = Home Modifications Contractor
- **FR-020**: Works MUST be grouped by contractor/supplier
- **FR-021**: Each work MUST display: work description (e.g., "Bathroom Modifications"), client name, linked budget item reference, state/territory, quote amount, approved amount
- **FR-022**: Document section for each work MUST show: list of all submitted documents, per-document approval status, aggregate approval count (e.g., "4 / 4 approved")
- **FR-023**: Work status and payment status MUST be displayed separately for each work
- **FR-024**: Work status values MUST include: New, Quoted, Documents Received, Under Review, Escalated, Approved, Completed
- **FR-025**: Payment status values MUST include: Pending, Partial, Paid
- **FR-026**: Compliance team MUST be able to filter works by: supplier, state/territory, work status, payment status
- **FR-027**: Compliance team MUST be able to search works by client name or work description

### Document Management

- **FR-028**: System MUST support document types for onboarding: Builders License, Builders Warranty Insurance, Building Contract, Building Permit, Workers Compensation, WorkSafe, Certificate of Currency, Bank Statement, Certificate of Registration, Business Name Registration Certificate, Tax Certificate, Notice of Assessment, Utility Bill, Professional Body Membership, plus state-specific contracts
- **FR-029**: System MUST support document types for assessment submissions: Quote, Building Permit, Completion Certificate, Progress Photos
- **FR-030**: Each document MUST have approval status: Pending, Approved, Rejected
- **FR-031**: Rejected documents MUST capture rejection reason (free text)
- **FR-032**: Contractors MUST be able to view rejection reasons for their documents
- **FR-033**: Contractors MUST be able to resubmit rejected documents
- **FR-034**: System MUST track document version history when documents are resubmitted
- **FR-035**: Document version history MUST include: upload timestamp, uploader, approval status, rejection reason (if applicable)
- **FR-036**: Compliance team MUST be able to view document version history
- **FR-037**: When contractor uploads document during assessment, system MUST store document in assessment object (via ASS1 integration)
- **FR-038**: When contractor uploads document during onboarding, system MUST store document in supplier credential records

### Compliance Criteria Templates

- **FR-039**: Criteria templates MUST support state/territory-conditional requirements
- **FR-040**: State-conditional logic MUST follow pattern: "If client.state = [state code], then require document_type = [document type]"
- **FR-041**: Example state-conditional requirement: "If client.state = VIC, then require Building Permit - VIC"
- **FR-042**: Criteria templates MUST support multiple independent quote requirements
- **FR-043**: Multiple quote requirement MUST specify: number of quotes required (e.g., 2), requirement that quotes come from different suppliers
- **FR-044**: System MUST track progress toward multiple quote requirement (e.g., "2 of 2 quotes received")
- **FR-045**: Criteria templates MUST support milestone-based progression
- **FR-046**: Milestone examples MUST include: Quote approved, Work commenced, Work in progress, Work completed
- **FR-047**: Each milestone MUST reference specific document approval requirements

### Payment Milestone Definitions

- **FR-048**: System MUST define standard installment structures for home modifications
- **FR-049**: Default installment structure MUST be: 30% on quote approval, 40% on progress verification, 30% on completion
- **FR-050**: Each payment milestone MUST reference specific compliance criteria that trigger payment release
- **FR-051**: Example milestone definitions:
  - Milestone 1 (30%): Quote document approved
  - Milestone 2 (40%): Progress photos submitted and approved
  - Milestone 3 (30%): Completion certificate submitted and approved
- **FR-052**: Payment milestones are DEFINITIONS only - actual payment release is handled by ASS2

### Supplier Category Validation

- **FR-053**: System MUST provide validation function that checks if supplier is verified for Tier-3 category
- **FR-054**: Validation function MUST accept: supplier_id, tier3_category
- **FR-055**: Validation function MUST return: true if supplier.verified_categories includes tier3_category, false otherwise
- **FR-056**: When validation fails, system MUST return reason code: "Supplier not verified for category: [category name]"
- **FR-057**: Validation function is called by ASS2 during Inclusion readiness checks (integration point)

### Multiple Independent Quote Validation

- **FR-058**: System MUST validate that multiple independent quotes come from different suppliers
- **FR-059**: When Inclusion requires X independent quotes, system MUST track which suppliers have provided quotes
- **FR-060**: If same supplier is linked to multiple assessments for same Inclusion quote requirement, validation MUST fail
- **FR-061**: Validation failure MUST return reason code: "Independent quotes must be from different suppliers"

### Notification System

- **FR-062**: System MUST send notification to contractor when assessment request is created
- **FR-063**: Assessment request notification MUST include: client details, modification required, location, deadline, required documents based on state
- **FR-064**: System MUST send notification to compliance team when contractor submits quote and documents
- **FR-065**: System MUST send notification to contractor when document is approved
- **FR-066**: System MUST send notification to contractor when document is rejected (include rejection reason)
- **FR-067**: System MUST send notification to relevant parties when payment milestone is reached
- **FR-068**: System MUST send notification to compliance manager when work is escalated

---

## Key Entities

- **Supplier**: Business entity providing home modifications or products
  - Attributes: supplier_id, business_name, ABN, contact_details, supplier_type (Contractor | Product Supplier)
  - For contractors: service_areas (states/territories), credentials (licenses, insurance, registrations per state), capabilities (types of modifications)
  - For product suppliers: verified_categories (Tier-3 categories they can supply), price_lists (optional)

- **Supplier Type**: Enum defining Contractor or Product Supplier
  - Determines onboarding requirements and workflows

- **Tier-3 Category**: Support at Home (Australian Aged Care) product/service category from canonical list
  - Values:
    - Communication and Information Management Products (SERV-0065)
    - Domestic Life Products (SERV-0064)
    - Home Modification Products (SERV-0067)
    - Home Modifications Prescription and Clinical Support (SERV-0068)
    - Managing Body Functions (SERV-0061)
    - Mobility Products (SERV-0063)
    - Self-care Products (SERV-0062)
  - Product suppliers select which categories they are verified for
  - **Note**: These are Support at Home categories, NOT NDIS categories

- **Document**: File uploaded by contractor as part of assessment response
  - Attributes: document_id, document_type, upload_timestamp, uploader, approval_status, rejection_reason, version_number
  - Types: Quote, Building Permit, Completion Certificate, Progress Photos
  - Stored in assessment object (via ASS1)

- **Document Type**: Enum defining required document types for home modifications
  - Values: Quote, Building Permit, Completion Certificate, Progress Photos

- **Document Approval Status**: Enum defining approval state
  - Values: Pending, Approved, Rejected

- **Compliance Criteria Template**: Defines requirements for home modification Inclusions
  - Supports: state-conditional logic, multiple quote tracking, milestone-based progression
  - Used by ASS2 to evaluate Inclusion readiness

- **Payment Milestone**: Defines installment structure for home modifications
  - Attributes: milestone_id, percentage, description, required_criteria
  - Example: {milestone_id: 1, percentage: 30%, description: "Quote approval", required_criteria: "Quote document approved"}
  - Used by ASS2 to determine payment release triggers

- **Work** (Compliance Dashboard View): Home modification Inclusion viewed from compliance perspective
  - Attributes: work_id (same as Inclusion_id), work_description, client_name, budget_item_reference, state_territory, quote_amount, approved_amount, work_status, payment_status
  - Aggregates: documents (with approval statuses), aggregate_approval_count (X of Y approved)
  - This is a VIEW - underlying data lives in Inclusion (ASS2) and Assessment (ASS1)

- **Work Status**: Enum for compliance workflow stages
  - Values: New, Quoted, Documents Received, Under Review, Escalated, Approved, Completed

- **Payment Status**: Enum for payment tracking
  - Values: Pending, Partial, Paid

---

## Success Criteria

### Measurable Outcomes

- **SC-001**: Product suppliers can complete registration in under 5 minutes
- **SC-002**: 100% of home modification contractors are verified with state-specific credentials before receiving assessment requests
- **SC-003**: Compliance team can review and approve documents 60% faster than manual tracking (measured by average time from submission to approval)
- **SC-004**: Supplier support queries reduced by 50% due to clear onboarding requirements and document submission guidance
- **SC-005**: 100% of home modifications are tracked with state-specific compliance documentation meeting regulatory requirements
- **SC-006**: System prevents unqualified suppliers from billing for product categories with 0% validation bypass rate
- **SC-007**: Contractors receive assessment request notifications within 2 minutes of Inclusion creation
- **SC-008**: Compliance team can view all works for a single supplier in one dashboard view without switching screens
- **SC-009**: Document rejection notifications include specific reasons and remediation steps 100% of the time
- **SC-010**: 95% of contractors successfully submit quotes with all required documents on first attempt (indicating clear state-based document requirements)

---

## Assumptions

- ASS2 Inclusions module will handle Inclusion lifecycle, readiness validation, payment gating, and invoice auto-hold/release
- ASS1 Assessments will handle assessment creation, document storage, and assessment request routing
- Tier-3 canonical dataset (Support at Home service/product categories) is available and maintained externally
- State-specific compliance requirements are documented and relatively stable (infrequent changes)
- Existing supplier registration system can be extended, or new supplier management system will be built as part of HMF
- Notification infrastructure exists or will be built to support automated notifications
- Compliance team has capacity to review documents within reasonable timeframes
- Contractors have capability to upload documents in PDF format

---

## Dependencies

- **ASS2 Inclusions Module**:
  - Action plan criteria engine (evaluates compliance criteria templates)
  - Readiness validation (calls HMF's supplier category validation)
  - Payment logic (uses HMF's payment milestone definitions)
  - Inclusion state management

- **ASS1 Assessment Intake**:
  - Assessment request routing (sends requests to contractors)
  - Document upload and storage (stores contractor-submitted documents)
  - Assessment object management

- **Supplier Registration System**: Existing supplier management system or new system to be built

- **State/Territory Compliance Documentation Standards**: Documented requirements for each state specifying required permits, licenses, and certificates

- **Notification System**: Email or in-app notification infrastructure

- **Tier-3 Canonical Dataset**: Maintained list of Support at Home (Australian Aged Care) product/service categories

---

## Out of Scope

The following are explicitly OUT of scope for HMF. HMF builds the UI shell and defines data structures, but ASS2 owns the business logic that populates these views. All business logic context has been documented for the ASS2 epic.

**ASS2 Owns (Business Logic):**
- **Inclusion lifecycle and state management** - HMF displays Works data, ASS2 manages the Inclusion state
- **Quote selection workflow** - Care partner selecting which contractor quote becomes "the work"
- **Linking selected quote → work** - When a quote is selected, ASS2 links it to the Inclusion and it appears in Works tab (HMF UI)
- **Compliance criteria evaluation logic** - ASS2 evaluates the criteria templates that HMF defines
- **Payment gating and milestone-based invoice auto-hold/release** - HMF defines milestones (30%/40%/30%), ASS2 executes the gating logic
- **Inclusion readiness validation logic** - ASS2 calls HMF's validation APIs (category verification, multi-quote validation)
- **Budget linkage validation** - ASS2 validates budget constraints
- **Needs modeling and consolidation** - ASS2 manages Needs objects

**ASS1 Owns (Assessment Layer):**
- **Assessment creation and routing workflows** - ASS1 sends assessment requests to contractors
- **Document upload and storage** - Documents submitted by contractors are stored via ASS1
- **Service Plan integration and prepopulation** - ASS1/ASS2 coordinate this
- **Clinical criteria and assessment type definitions** - ASS1 defines clinical assessment types

**Other:**
- **Billing/finance processing workflows** - Separate billing system handles invoicing
- **Retrospective data migration** - Not migrating existing pre-HMF projects

---

## References

- IDEA-BRIEF: `.claude/INITIATIVES/TP-1857-Supplier-Management/TP-3155-HMF-Home-Modifications-Flow/IDEA-BRIEF.md`
- Revised Scope Summary: `.claude/INITIATIVES/TP-1857-Supplier-Management/TP-3155-HMF-Home-Modifications-Flow/DUMP/other_context/hmf-revised-scope-summary.md`
- **Home Modifications Contractor Document Requirements**: `.claude/INITIATIVES/TP-1857-Supplier-Management/TP-3155-HMF-Home-Modifications-Flow/DUMP/other_context/home-modifications-contractor-document-requirements.md`
- Supplier Workflow Requirements (for ASS2): `.claude/INITIATIVES/TP-1859-Clinical-And-Care-Plan/TP-2914-ASS2-Inclusion-Integration/DUMP/other_context/supplier-workflow-requirements-from-hmf-psf.md`
- ASS1 Context: `.claude/INITIATIVES/TP-1859-Clinical-And-Care-Plan/TP-1904-ASS1-Assessment-Prescriptions/`
- ASS2 Context: `.claude/INITIATIVES/TP-1859-Clinical-And-Care-Plan/TP-2914-ASS2-Inclusion-Integration/`
- PSF Context (merged into HMF): `.claude/INITIATIVES/TP-1857-Supplier-Management/TP-3156-PSF-Product-Supplier-Flow/DUMP/other_context/`


## Clarification Outcomes

### Q1: [Dependency] Is the ASS2 API contract defined? Can HMF development proceed in parallel?
**Answer:** The spec carefully delineates scope boundaries: HMF builds UI shell + validation APIs + data structure contracts, ASS2 consumes them. The contract is defined in this spec through FR-053 to FR-061 (validation functions) and FR-048 to FR-052 (payment milestone definitions). HMF can proceed in parallel because it builds foundational supplier infrastructure and exposes APIs that ASS2 will call. The dependency is one-directional: ASS2 depends on HMF APIs, not the reverse.

### Q2: [Scope] Are compliance checkpoints explicitly defined or deferred to ASS2?
**Answer:** HMF explicitly defines compliance criteria TEMPLATES (FR-039 to FR-047), document management (FR-028 to FR-038), and the compliance dashboard UI (FR-018 to FR-027). The EVALUATION of those criteria is ASS2's responsibility. Compliance checkpoints like building permits and state-specific requirements are thoroughly enumerated in FR-005 through FR-009 with per-state document lists. OT sign-off is not mentioned — **Assumption:** OT assessment falls under ASS1 (Assessment Intake) as a clinical assessment, not HMF.

### Q3: [Data] How are home modification projects tracked?
**Answer:** The codebase already has a `HomeModificationRequest` model (`domain/Supplier/Models/HomeModificationRequest.php`) with a `HomeModificationStatusEnum` containing: `DRAFT`, `QUOTE_SUBMITTED`, `QUOTE_APPROVED`, `QUOTE_REJECTED`, `SCHEDULED`, `IN_PROGRESS`, `COMPLETED`, `CANCELLED`. There are also V2 actions: `CreateHomeModificationRequestAction`, `SubmitQuoteAction`, and `MarkCompleteAction`. The "Work" entity in the spec is a compliance VIEW over these records, not a separate entity. HMF uses its own status enum while ASS2 manages the Inclusion lifecycle.

### Q4: [Edge Case] What happens when a home modification project is abandoned mid-way? How are partial payments handled?
**Answer:** FR-048 to FR-052 define milestone-based payment (30%/40%/30%). If abandoned after milestone 1 (quote approval, 30% paid), the remaining 70% is not released. The `HomeModificationStatusEnum` has `CANCELLED` status. **Assumption:** Partial payments already released are not clawed back — they represent completed milestones (quote was legitimately approved). ASS2 handles the financial gating; HMF defines the milestone structure. The spec should add an edge case for "contractor abandons after receiving progress payment" with escalation to compliance manager.

### Q5: [Integration] Does progress photo upload use the Documents (DOC) epic infrastructure?
**Answer:** The codebase has a `SupplierDocument` model (`domain/Supplier/Models/SupplierDocument.php`) with `DocumentTypeEnum`, `DocumentScopeEnum`, and `DocumentStatusEnum`. FR-029 defines assessment document types: Quote, Building Permit, Completion Certificate, Progress Photos. FR-037 states documents are stored "in assessment object (via ASS1 integration)" while FR-038 states onboarding documents are stored "in supplier credential records." So assessment documents use ASS1's storage, while supplier credential documents use the new `SupplierDocument` model. This is appropriate — assessment docs belong to the work, credential docs belong to the supplier.

### Q6: [Data] The spec lists 23 required home modifications documents plus state-specific contracts. Is this document taxonomy defined as an enum?
**Answer:** The existing `DocumentTypeEnum` has 7 values (PUBLIC_LIABILITY, ABN_VERIFICATION, WORKERS_COMP, PROFESSIONAL_INDEMNITY, POLICE_CHECK, AHPRA, NDIS_SCREENING). HMF would need to extend this significantly to include Builders License, Builders Warranty Insurance, Building Contract, Building Permit, WorkSafe, Certificate of Currency, etc. **Recommendation:** Given the volume (23+ types), consider whether the `DocumentTypeEnum` should remain an enum or transition to a database-driven document type table for runtime extensibility, as recommended in the OHB spec for on-hold reasons.

### Q7: [Scope] The spec says "Pricing Clarification: Contractors CAN have fixed hourly rates for OTHER services." How does this relate to Supplier Pricing (PRI)?
**Answer:** The PRI spec defines the pricing matrix (weekday/Sat/Sun/PH rates per service per location). HMF's pricing tab for contractors would use the same `OrganisationPrice` model for fixed-rate services (home maintenance, repairs). Home modification work is always quote-by-quote and would not use the pricing matrix — it uses the `HomeModificationRequest` model with a quote amount field. The two systems coexist without conflict.

### Q8: [Dependency] How does the Tier-3 category list for product suppliers relate to the ServiceType model?
**Answer:** The spec lists 7 Tier-3 categories with SERV codes (SERV-0061 through SERV-0068). The `ServiceType` model (`app/Models/AdminModels/ServiceType.php`) is the canonical service type reference in the codebase. These SERV codes should map to `ServiceType` records. FR-053 to FR-056 validate supplier categories against `supplier.verified_categories` — this would be a new relationship table linking suppliers to ServiceType IDs.

### Q9: [Edge Case] What happens when a contractor operates in multiple states with different licensing?
**Answer:** Explicitly addressed in the edge cases section. FR-016 requires "conditionally require state-specific contract documents only for states selected in service areas." The system supports per-state credential tracking. A contractor verified in VIC but not NSW would only receive assessment requests for VIC clients. This is well-specified.

### Q10: [Performance] The compliance dashboard groups works by supplier. With potentially thousands of suppliers and works, what is the expected data volume?
**Answer:** Home modifications are a specific subset of supplier work. **Assumption:** Initial volume is low (50-200 active home modification works at any time) given the program is new under SAH. The dashboard (FR-026) should still support pagination and filtering for scalability, but performance is unlikely to be a concern in phase 1.

### Q11: [Compliance] State-specific building thresholds (VIC $10K, NSW $5K, QLD $3.3K) are informational disclaimers (FR-010). Who enforces compliance?
**Answer:** FR-010 explicitly states disclaimers "MUST NOT block contractor onboarding (informational only, contractor acknowledges responsibility for compliance)." This is the correct approach — Trilogy Care is not the building regulator. The contractor self-certifies compliance with state building regulations. The disclaimers serve as evidence that the contractor was informed.

## Refined Requirements

1. **New Edge Case**: Given a contractor abandons a project after receiving progress payment (milestone 2), When the compliance team identifies the abandonment, Then the work status changes to "Escalated" and a notification is sent to the compliance manager with the outstanding payment amount.

2. **New AC for US6**: Given a product supplier adds a Tier-3 category to their profile, When a validation check runs for a previously-blocked Inclusion, Then the validation passes and the Inclusion can progress.

3. **Data Model Recommendation**: The 23+ document types for home modifications should be stored in a `document_type_requirements` database table with columns: `id`, `document_type_code`, `label`, `supplier_type` (contractor/product), `state_code` (nullable), `requires_expiry`, `is_required`, `sort_order`. This allows runtime updates without code deployment when state requirements change.
