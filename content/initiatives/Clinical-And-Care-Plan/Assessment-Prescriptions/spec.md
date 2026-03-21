---
title: "Feature Specification: Assessment Intake, AI Extraction & Recommendation Workflow (ASS1)"
description: |-
  Feature Branch: TP-1904-ASS1-assessment-prescriptionsCreated: 2025-12-01
  Status: Draft
  Epic: TP-1904 | Initiative: TP-1859 Clinical & Care Plan
---

> **[View Mockup](/mockups/assessment-prescriptions/index.html)**{.mockup-link}

**Feature Branch**: `TP-1904-ASS1-assessment-prescriptions`**Created**: 2025-12-01
**Status**: Draft
**Epic**: TP-1904 | **Initiative**: TP-1859 Clinical & Care Plan

## Clarifications

### Session 2025-12-01

- Q: How does system handle multiple assessors working on the same Assessment Request? → A: One Assessment Request can spawn multiple Assessment objects (one per assessor/type). Each Assessment is worked on by a single assessor in isolation (no concurrent editing within an Assessment). CP sees aggregated view of all Assessments and their Recommendations. If multiple assessors recommend the same product, CP manually reconciles using common sense.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - CP Creates Assessment Request (Priority: P1)

**As a Care Partner**, I want to create an Assessment Request for a package so that I can initiate the assessment process and get supplier recommendations.

**Why this priority**: This is the entry point for the entire workflow. Without the ability to create Assessment Requests, no downstream functionality is possible. This is the foundational step that triggers the assessor workflow.

**Independent Test**: Can be fully tested by creating an Assessment Request on a package, selecting an assessment type and onboarded supplier, and verifying the secure link is generated and notification sent to the supplier. Delivers value by enabling CPs to initiate assessments.

**Acceptance Scenarios**:

1. **Given** I am a Care Partner viewing a package, **When** I create an Assessment Request and select "OT" as the assessment type, **Then** I should see a list of onboarded suppliers verified for OT assessments
2. **Given** I have selected an onboarded supplier, **When** I submit the Assessment Request, **Then** the system generates a secure link, creates an Assessment object for that assessor, and sends notification to the supplier
3. **Given** I have created an Assessment Request, **When** I view my workflow dashboard, **Then** I should see the Assessment Request with status tracking and any associated Assessments
4. **Given** I select a non-OT assessment type (Physio, Nurse, Contractor), **When** I submit the Assessment Request, **Then** the system generates a secure link and creates an Assessment object without requiring supplier selection
5. **Given** I need additional assessment types for the same package, **When** I create another Assessment Request with a different type, **Then** a new Assessment object is created and both Assessments can progress independently

---

### User Story 2 - Assessor Uploads Documents (Priority: P1)

**As an Assessor**, I want to upload assessment documents through a secure authenticated workflow so the system can extract ATHM information.

**Why this priority**: This is the second critical step in the workflow. Without document upload capability, there is no content for AI extraction. This enables the core value proposition of structured data capture.

**Independent Test**: Can be fully tested by providing an assessor with a secure link, verifying authentication, uploading multiple document types (PDFs, images), and confirming metadata capture. Delivers value by digitizing assessment evidence.

**Acceptance Scenarios**:

1. **Given** I receive a secure link from a CP's Assessment Request, **When** I click the link, **Then** I am prompted to log in using my existing Portal credentials
2. **Given** I am an unregistered assessor, **When** I attempt to log in, **Then** the system handles account creation flow
3. **Given** I am authenticated, **When** I upload a PDF document, **Then** the system captures metadata (uploader, timestamp, document type, package association)
4. **Given** I am uploading documents, **When** I select multiple files (PDFs and images), **Then** all files are uploaded successfully
5. **Given** I attempt to upload a file, **When** the file exceeds size limits or has invalid format, **Then** I receive a validation error message
6. **Given** I upload a document, **When** the upload completes, **Then** the system auto-classifies the document type (report/quote/amendment) with option for manual override

---

### User Story 3 - AI Extraction & Classification (Priority: P1)

**As the System**, I need to extract product/modification details and suggest Tier-5 mapping so assessors can review and confirm recommendations efficiently.

**Why this priority**: This is the core differentiator that reduces manual workload. AI extraction transforms unstructured documents into structured recommendations, making the workflow scalable and efficient.

**Independent Test**: Can be fully tested by uploading test documents, verifying extraction of ATHM items, validating Tier-5 suggestions and confidence scores, and confirming pathway classification. Delivers value by automating initial classification.

**Acceptance Scenarios**:

1. **Given** an assessor has uploaded a document, **When** AI extraction runs, **Then** the system extracts individual ATHM items with product/modification details
2. **Given** an ATHM item is a product, **When** AI classifies it, **Then** the system suggests a Tier-5 classification with confidence score
3. **Given** an ATHM item is a service, **When** AI classifies it, **Then** the system suggests a Tier-3 classification with confidence score
4. **Given** AI extraction completes, **When** I view recommendations, **Then** each item displays pathway classification (Low Risk, Advice, Prescribed)
5. **Given** AI extraction runs, **When** results are stored, **Then** the raw extraction output is preserved in an audit trail
6. **Given** the Tier-5 canonical dataset is unavailable, **When** AI extraction runs, **Then** the system allows manual entry with a warning message

---

### User Story 4 - Assessor Reviews and Confirms Recommendations (Priority: P1)

**As an Assessor**, I want to review, edit, and confirm AI-extracted recommendations to ensure accuracy before submission to Care Partners.

**Why this priority**: This is the mandatory human-in-the-loop checkpoint that ensures data quality. Without this confirmation workflow, recommendations cannot be submitted, making this critical for workflow completion.

**Independent Test**: Can be fully tested by reviewing AI extractions, editing Tier-5 codes, confirming recommendations, and attempting submission with unconfirmed items. Delivers value by ensuring 100% reviewed recommendations.

**Acceptance Scenarios**:

1. **Given** I view AI-extracted recommendations, **When** I want to edit a Tier-5 code, **Then** I can use inline search and filtering to find the correct classification
2. **Given** I am reviewing recommendations, **When** I see confidence scores, **Then** visual indicators clearly show low-confidence extractions requiring attention
3. **Given** I edit a Tier-5 code, **When** I save changes, **Then** the system logs the edit in the audit trail
4. **Given** I have reviewed a recommendation, **When** I confirm it, **Then** the recommendation is marked as confirmed and cannot be auto-changed
5. **Given** I attempt to submit recommendations, **When** not all recommendations are confirmed, **Then** validation gating prevents submission with error message
6. **Given** all recommendations are confirmed, **When** I submit, **Then** the CP receives automatic notification and submission becomes immutable
7. **Given** I am reviewing Tier-3/4/5 classifications, **When** I use the search UI, **Then** I can search and filter the hierarchy display

---

### User Story 5 - CP Reviews and Accepts Recommendations (Priority: P2)

**As a Care Partner**, I want to review submitted recommendations and accept them so I can control which items are eligible for budget allocation.

**Why this priority**: This enables CP oversight and budget control. While critical for governance, the workflow can function without acceptance (recommendations remain submitted). This is core value delivery but not blocking for testing earlier steps.

**Independent Test**: Can be fully tested by submitting recommendations, reviewing them as a CP, accepting individual items, and verifying backend Inclusion Seed creation. Delivers value by enabling CP decision-making.

**Acceptance Scenarios**:

1. **Given** an assessor submits recommendations, **When** I receive notification, **Then** I can view all submitted recommendations with Tier-5 classifications and evidence links
2. **Given** multiple Assessments exist for the same Assessment Request, **When** I review recommendations, **Then** I see an aggregated view of all Recommendations from all Assessments
3. **Given** two assessors recommend the same product, **When** I view recommendations, **Then** I see both recommendations and can accept one, both, or neither using my judgment
4. **Given** I am reviewing recommendations, **When** I accept an individual recommendation, **Then** the recommendation remains visible on the assessment with "Accepted" status
5. **Given** I accept a recommendation with Advice pathway, **When** acceptance completes, **Then** the system silently creates an Inclusion Seed linked to Assessment, Recommendation, and Tier-5
6. **Given** I accept a recommendation with Prescribed pathway, **When** acceptance completes, **Then** the system silently creates an Inclusion Seed
7. **Given** I accept a recommendation with Low Risk pathway, **When** acceptance completes, **Then** NO Inclusion Seed is created
8. **Given** I ignore a recommendation, **When** I view the assessment later, **Then** the recommendation remains in "Submitted" state and I can accept it later
9. **Given** there is no reject action, **When** I don't want a recommendation, **Then** I can simply ignore it (it stays submitted)

---

### User Story 6 - CP Adds to Service Plan (Priority: P2)

**As a Care Partner**, I want to add accepted recommendations to the Service Plan (budget) so funding can be allocated for approved items.

**Why this priority**: This is the final step connecting recommendations to budget allocation. Core value delivery, but depends on acceptance workflow. Service Plan integration is essential but not blocking for testing upstream flows.

**Independent Test**: Can be fully tested by accepting recommendations, using "Add Service" action, verifying terminal tier value prepopulation, and confirming bidirectional links. Delivers value by enabling budget allocation.

**Acceptance Scenarios**:

1. **Given** I have accepted a product recommendation, **When** I use "Add Service" action, **Then** only the Tier-5 value is prefilled in the Service Plan item
2. **Given** I have accepted a service recommendation, **When** I use "Add Service" action, **Then** only the Tier-3 value is prefilled in the Service Plan item
3. **Given** I am adding a recommendation to Service Plan, **When** the terminal tier is prefilled, **Then** I must enter description, quantity, cost following normal budget flow
4. **Given** I add a recommendation to Service Plan, **When** the item is created, **Then** bidirectional links are maintained (Service Plan Item ↔ Assessment ↔ Recommendation)
5. **Given** I have added a recommendation to Service Plan, **When** I edit or remove the Service Plan item, **Then** the source recommendation is NOT deleted
6. **Given** I view a Service Plan item, **When** it originated from a recommendation, **Then** I can see the source assessment and recommendation IDs

---

### User Story 7 - Billing Visibility (Priority: P3)

**As a Billing Processor**, I want to view Tier-5 context on Service Plan items and invoices so I can manually match invoices to budget lines.

**Why this priority**: This improves billing efficiency but is not required for core workflow functionality. Provides context for manual matching without automation. Supporting feature that enhances existing billing processes.

**Independent Test**: Can be fully tested by viewing Service Plan items with Tier values, uploading invoices with AI classification, and manually matching. Delivers value by reducing manual interpretation effort.

**Acceptance Scenarios**:

1. **Given** a Service Plan item originated from a recommendation, **When** I view the Service Plan, **Then** the Tier-5 or Tier-3 value is clearly displayed
2. **Given** an invoice is uploaded, **When** Invoice AI processes it, **Then** the system classifies invoice line items with Tier-5 values
3. **Given** I am a billing processor, **When** I review invoices, **Then** I can see tier-coded items in the existing Invoice UI (no new screen)
4. **Given** I am matching invoices, **When** I compare Invoice Tier-5 to Service Plan Tier-5, **Then** the context helps me identify correct budget line
5. **Given** I am using ASS1, **When** I view invoices, **Then** there is NO auto-gating or auto-release logic (context only)

---

### User Story 8 - Audit Logging (Priority: P3)

**As Compliance**, I want comprehensive audit logging across all state changes so I can maintain regulatory compliance and investigate issues.

**Why this priority**: Essential for compliance but not blocking for workflow functionality. Audit trails can be added throughout development. Supporting feature for governance and troubleshooting.

**Independent Test**: Can be fully tested by performing various actions, exporting audit logs, filtering by criteria, and verifying immutability. Delivers value by enabling compliance reporting.

**Acceptance Scenarios**:

1. **Given** any action occurs (upload, edit, confirmation, submission, acceptance, budget addition), **When** the action completes, **Then** an immutable audit log entry is created
2. **Given** I want to review history, **When** I access audit logs, **Then** I can filter by package, user, action type, and date range
3. **Given** I view an audit log entry for a modification, **When** I examine details, **Then** I see before/after state
4. **Given** I need to export audit logs, **When** I request export, **Then** the system provides data in standard formats (CSV, JSON)
5. **Given** audit log entries are created, **When** I attempt to modify them, **Then** the system prevents modification (immutable)

---

### User Story 9 - Tier-5 Dataset Management (Priority: P3)

**As a System Owner**, I want a canonical Tier-5 dataset to ensure consistent classification across all assessments.

**Why this priority**: Required for classification consistency but managed externally. Dataset maintenance is ongoing infrastructure work. Supporting feature that enables data quality.

**Independent Test**: Can be fully tested by verifying dataset access, testing version updates, confirming graceful degradation, and validating hierarchy display. Delivers value by standardizing classifications.

**Acceptance Scenarios**:

1. **Given** the Tier-5 dataset is available, **When** assessors search for classifications, **Then** they see the current versioned Tier-3 → Tier-4 → Tier-5 hierarchy
2. **Given** the Tier-5 dataset includes descriptions, **When** assessors view codes, **Then** they see classification rules and descriptions
3. **Given** the Tier-5 dataset is updated, **When** new classifications are used, **Then** historical classifications remain valid and unchanged
4. **Given** the Tier-5 dataset is temporarily unavailable, **When** assessors attempt classification, **Then** the system allows manual entry with warning message
5. **Given** multiple versions exist, **When** I view a historical recommendation, **Then** I see which dataset version was used

---

### Edge Cases

#### Document Processing

- What happens when AI extraction fails completely (corrupted PDF, unreadable scan)?
  - System allows assessor to manually create recommendations from scratch
  - Warning message displayed indicating extraction failure
  - All manual entries logged in audit trail
- How does system handle multi-page documents with mixed content types?
  - Document typing applies to entire document, not individual pages
  - Assessor can override classification if needed
  - Extraction attempts to identify all ATHM items across all pages
- What happens when file upload is interrupted mid-transfer?
  - System retries upload automatically
  - Progress indicator shows upload status
  - Partial uploads are discarded, assessor must re-upload

#### Classification & Mapping

- What happens when AI suggests a Tier-5 code that no longer exists in the dataset?
  - System flags as "unmapped" requiring manual correction
  - Assessor must select valid code before confirmation
  - Audit log captures original AI suggestion and manual override
- How does system handle ambiguous classifications where multiple Tier-5 codes could apply?
  - AI returns multiple suggestions ranked by confidence score
  - Assessor chooses most appropriate from ranked list
  - Assessor can override entirely and search for different code
- What happens when a product has characteristics spanning multiple Tier-5 categories?
  - Assessor creates separate recommendations for each classification
  - Each recommendation links to same source document
  - CP can accept/ignore independently

#### Workflow State Management

- What happens when an assessor starts confirmation but doesn't complete before session timeout?
  - Draft confirmations are saved automatically
  - Assessor can resume from last saved state
  - Warning displayed if session approaching timeout
- How does system handle multiple Assessments for the same Assessment Request?
  - Each Assessment is created independently (one per assessor/type)
  - Each assessor works in isolation within their own Assessment (no concurrent editing)
  - CP sees aggregated view of all Assessments and their Recommendations
  - If multiple assessors recommend the same product, CP manually reconciles using common sense
  - CP can accept Recommendations from any/all Assessments independently
- What happens when a CP accepts a recommendation after the Service Plan has been finalized?
  - Acceptance creates Inclusion Seed regardless of Service Plan state
  - CP must manually add to Service Plan if still desired
  - No automatic Service Plan modification after finalization

#### Integration & Dependencies

- What happens when Service Plan "Add Service" capability is unavailable?
  - Recommendations can still be accepted (creates Inclusion Seed)
  - CP receives notification that Service Plan integration is temporarily unavailable
  - Manual workaround available via direct Service Plan entry
- What happens when notification delivery fails (email bounce, system outage)?
  - System retries notification delivery up to 3 times
  - Failed notifications logged in audit trail
  - In-app notification serves as backup delivery method

#### Data Quality & Validation

- What happens when an assessor confirms all recommendations but document evidence is missing?
  - Validation prevents submission if no documents attached to Assessment Request
  - Error message indicates missing document requirement
  - Assessor must upload evidence before submission allowed

---

## Requirements *(mandatory)*

### Functional Requirements

#### Assessment Request Creation

- **FR-001**: System MUST allow Care Partners to create Assessment Requests on packages
- **FR-002**: System MUST support selection of assessment type (OT, Physio, Nurse, Contractor, etc.)
- **FR-003**: System MUST display onboarded suppliers filtered by assessment type (for OT assessments)
- **FR-004**: System MUST generate secure authenticated links for assessors upon Assessment Request creation
- **FR-005**: System MUST create an Assessment object for each Assessment Request (one per assessor)
- **FR-006**: System MUST support multiple Assessment objects per Assessment Request (e.g., OT assessment + Physio assessment for same package)
- **FR-007**: System MUST send notifications to suppliers with secure link
- **FR-008**: System MUST track Assessment Request status throughout lifecycle

#### Document Upload & Authentication

- **FR-009**: System MUST authenticate assessors via existing Portal credentials
- **FR-010**: System MUST handle account creation for unregistered assessors
- **FR-011**: System MUST support PDF and image file uploads
- **FR-012**: System MUST support multi-file uploads
- **FR-013**: System MUST validate file size and format before accepting uploads
- **FR-014**: System MUST capture metadata for each uploaded document (uploader, timestamp, document type, package association)
- **FR-015**: System MUST auto-classify document type (report/quote/amendment) based on content analysis
- **FR-016**: System MUST allow assessors to manually override document type classification

#### AI Extraction & Classification

- **FR-017**: System MUST extract individual ATHM items with product/modification details from uploaded documents
- **FR-018**: System MUST suggest terminal tier classification (Tier-5 for products, Tier-3 for services)
- **FR-019**: System MUST display confidence score for each AI extraction
- **FR-020**: System MUST store raw extraction output in audit trail
- **FR-021**: System MUST classify pathway for each item (Low Risk, Advice, Prescribed)
- **FR-022**: System MUST access versioned Tier-5 canonical dataset for classification
- **FR-023**: System MUST gracefully degrade if Tier-5 dataset unavailable (allow manual entry with warning)

#### Assessor Review & Confirmation

- **FR-024**: System MUST provide inline search and code correction for Tier-5 classifications
- **FR-025**: System MUST require manual confirmation for every recommendation (mandatory human-in-the-loop)
- **FR-026**: System MUST display visual indicators for confidence scores
- **FR-027**: System MUST provide search and filter capabilities for Tier-3/4/5 hierarchy
- **FR-028**: System MUST log all edits in audit trail
- **FR-029**: System MUST prevent submission until all recommendations are confirmed (validation gating)
- **FR-030**: System MUST capture submission timestamp and assessor identity
- **FR-031**: System MUST make submissions immutable once completed
- **FR-032**: System MUST send automatic notification to CP upon recommendation submission
- **FR-033**: System MUST ensure one assessor per Assessment (no concurrent editing within same Assessment)

#### CP Review & Acceptance

- **FR-034**: System MUST allow Care Partners to view submitted recommendations with Tier-5 classifications and evidence links
- **FR-035**: System MUST display aggregated view of all Recommendations from all Assessments for an Assessment Request
- **FR-036**: System MUST support per-item Accept action (no reject action)
- **FR-037**: System MUST maintain recommendation visibility on assessment after acceptance
- **FR-038**: System MUST allow recommendations to remain in submitted state if ignored (can be accepted later)
- **FR-039**: System MUST create Inclusion Seed when CP accepts recommendation with Advice pathway
- **FR-040**: System MUST create Inclusion Seed when CP accepts recommendation with Prescribed pathway
- **FR-041**: System MUST NOT create Inclusion Seed for Low Risk pathway recommendations

#### Service Plan Integration

- **FR-042**: System MUST provide "Add Service" action for accepted recommendations
- **FR-043**: System MUST prefill only terminal tier value (Tier-5 or Tier-3) when adding to Service Plan
- **FR-044**: System MUST require CP to enter description, quantity, cost following normal budget flow
- **FR-045**: System MUST maintain bidirectional links (Service Plan Item ↔ Assessment ↔ Recommendation)
- **FR-046**: System MUST preserve source recommendation when Service Plan item is edited or removed
- **FR-047**: System MUST store source assessment and recommendation IDs on Service Plan items

#### Inclusion Seed Creation

- **FR-048**: System MUST create Inclusion Seed silently when CP accepts recommendation (not when added to Service Plan)
- **FR-049**: Inclusion Seed MUST contain raw text/data from recommendation
- **FR-050**: Inclusion Seed MUST include links to Assessment, Recommendation, and Tier-5 classification
- **FR-051**: Inclusion Seed MUST only be created for Advice and Prescribed pathways
- **FR-052**: Inclusion Seed MUST remain backend-only data structure (no UI/lifecycle in ASS1)

#### Billing Visibility

- **FR-053**: System MUST display Tier value (Tier-5 or Tier-3) on Service Plan items
- **FR-054**: Invoice AI MUST classify uploaded invoices with Tier-5 values
- **FR-055**: System MUST integrate Tier-coded items into existing Service Plan and Invoice UI (no new screen)
- **FR-056**: System MUST provide read-only access for billing processors to view Tier-5 context
- **FR-057**: System MUST NOT implement auto-gating or auto-release logic in ASS1 (context only)

#### Tier-5 Dataset Management

- **FR-058**: System MUST maintain versioned Tier-5 dataset with Tier-3 → Tier-4 → Tier-5 hierarchy
- **FR-059**: System MUST include descriptions and classification rules in dataset
- **FR-060**: System MUST NOT invalidate historical classifications when dataset is updated
- **FR-061**: System MUST allow manual entry with warning if dataset unavailable
- **FR-062**: System MUST track which dataset version was used for each classification

#### Audit Logging

- **FR-063**: System MUST log all actions (uploads, edits, confirmations, submissions, acceptance, budget additions)
- **FR-064**: System MUST maintain immutable audit trail
- **FR-065**: System MUST support audit log export in standard formats (CSV, JSON)
- **FR-066**: System MUST provide filtering by package, user, action type, date range
- **FR-067**: System MUST capture before/after state for all modifications

### Key Entities

- **Assessment Request**: Represents a CP's request for assessment, includes package reference, assessment type, selected supplier (for OT), status, secure link, timestamps. Can spawn multiple Assessment objects (one per assessor).
- **Assessment**: Individual assessor's work on an Assessment Request. One assessor per Assessment (no concurrent editing). Contains uploaded documents and generated Recommendations. Submitted independently.
- **Recommendation**: Structured output from AI extraction + assessor confirmation, contains terminal tier code (Tier-5 or Tier-3), product name/description, quantity, cost estimate, confidence score, status (Draft/Submitted/Accepted), pathway (Low Risk/Advice/Prescribed), linked Assessment ID, linked Inclusion Seed ID
- **Inclusion Seed**: Backend-only entity created on CP acceptance for Advice/Prescribed pathways, contains raw text/data from recommendation, links to Assessment/Recommendation/Tier-5, no lifecycle or UI in ASS1
- **Service Plan Item**: Budget line item that can be prepopulated from accepted recommendation, contains terminal tier value, description, quantity, cost, bidirectional links to source Assessment and Recommendation
- **Tier-5 Classification**: Hierarchical classification system (Tier-3 → Tier-4 → Tier-5), versioned canonical dataset, includes descriptions and classification rules, used for products (Tier-5) and services (Tier-3)
- **Pathway**: Classification determining evidence requirements - Low Risk (no assessment), Advice (practitioner letter), Prescribed (full OT assessment)
- **Document**: Uploaded file (PDF/image) with metadata (uploader, timestamp, type, package), auto-classified as report/quote/amendment, linked to Assessment Request
- **Audit Log Entry**: Immutable record of all actions with timestamp, user, action type, before/after state, exportable

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Care Partners can create Assessment Requests and select suppliers in under 2 minutes (90% of users)
- **SC-002**: AI extraction achieves ≥80% Tier-5 accuracy at launch (measured against assessor confirmations)
- **SC-003**: Median assessment→budget cycle time reduced by 30% within 4 weeks post-launch (compared to pre-ASS1 baseline)
- **SC-004**: 100% of recommendations receive assessor confirmation before submission (enforced by validation gating)
- **SC-005**: Assessors can review and confirm extracted recommendations in under 5 minutes per assessment (average)
- **SC-006**: Billing processors report reduced manual interpretation effort when matching invoices (survey-based metric, target 40% reduction)
- **SC-007**: System successfully creates Inclusion Seeds for 100% of accepted Advice/Prescribed recommendations
- **SC-008**: Bidirectional links (Service Plan ↔ Assessment ↔ Recommendation) are maintained for 100% of Service Plan items created from recommendations
- **SC-009**: Zero data loss incidents for uploaded documents and audit trails (99.99% uptime)
- **SC-010**: Audit logs are exportable within 30 seconds for typical package history (filtering 1000 entries)

## Clarification Outcomes

### Q1: [Dependency] The Tier-5 canonical dataset is central to this epic but is maintained externally. Who owns this dataset, and what is the process for updates? Is it versioned in the Portal database or fetched from an external API?
**Answer:** The spec states the dataset must be versioned (FR-058-062), must include descriptions and classification rules, and must allow manual entry if unavailable. The codebase has no existing Tier-5 model or classification hierarchy. The existing Budget domain uses `ServiceCategory` and `BudgetPlanItem` models but no hierarchical tier system. **Assumption: The Tier-5 dataset will be seeded into the Portal database as a versioned, code-managed dataset (similar to how `RiskCategory` is seeded via `RiskCategorySeeder`). External API fetch would add fragility. Ownership should be clarified with Marianne/clinical governance -- this is a blocking question for implementation.**

### Q2: [Scope] US7 (Billing Visibility) says there is "NO auto-gating or auto-release logic" in ASS1 -- context only. However, the Inclusion Integration (ASS2) epic introduces full auto-gating. Are ASS1 and ASS2 designed to be deployed sequentially, or can ASS1 operate indefinitely without ASS2?
**Answer:** The ASS2 spec explicitly states ASS1 as a required dependency ("Required -- provides Recommendation and Inclusion seed data, budget linkage"). ASS1 creates backend Inclusion Seeds that ASS2 activates. ASS1 is designed to operate independently -- Inclusion Seeds are backend-only with no lifecycle. **ASS1 can operate indefinitely without ASS2. The billing visibility in US7 is context-only (read-only Tier-5 display). The Inclusion Seeds accumulate but cause no harm if ASS2 is delayed.**

### Q3: [Data] Inclusion Seeds are described as "backend-only data structure (no UI/lifecycle in ASS1)." What happens to orphaned Inclusion Seeds if ASS2 is never delivered? Should there be a cleanup or visibility mechanism?
**Answer:** FR-048-052 define Inclusion Seeds as backend-only. They contain raw text from recommendations, links to Assessment/Recommendation/Tier-5. If ASS2 is never delivered, they remain as inert database records. **Recommendation: No cleanup mechanism is needed in ASS1. The data is small (text + foreign keys) and has audit value regardless. If ASS2 is cancelled, a simple migration can drop the table. No visibility mechanism is needed -- seeds are intentionally invisible in ASS1.**

### Q4: [Edge Case] US1 says unregistered assessors go through an "account creation flow." What is this flow? Does it use the existing supplier onboarding, or is it a lightweight registration specific to assessors?
**Answer:** The codebase has an existing supplier onboarding flow (`domain/Supplier/Enums/OnboardingStepEnum.php`, `domain/Supplier/Models/Supplier.php`) with a multi-step process. Assessors are described as "onboarded suppliers" in the spec. FR-009 says authentication uses "existing Portal credentials" and FR-010 handles account creation for unregistered assessors. **Assumption: Assessors are suppliers. The "account creation flow" should leverage the existing supplier onboarding with a streamlined path for assessment-only suppliers. This needs clarification -- if assessors are not always suppliers (e.g., independent OTs not in the supplier registry), a lightweight registration flow is needed.**

### Q5: [Integration] The spec mentions "Invoice AI" classifying uploaded invoices with Tier-5 values (FR-054). Does this refer to the AI Invoice V3 (AIV3) epic? If so, this creates a cross-dependency between ASS1 and AIV3 that is not listed in the dependencies section.
**Answer:** FR-054 says "Invoice AI MUST classify uploaded invoices with Tier-5 values." This is a capability that doesn't exist in the current codebase. The billing domain (`domain/Budget/`, `app/Tables/PackageBillsTable.php`) processes invoices but has no AI classification. **This is an undocumented cross-dependency. Either (a) Invoice AI classification is a separate epic that ASS1 depends on for US7, or (b) US7 should be limited to displaying Tier-5 on Service Plan items only (no invoice classification). Recommendation: Add "Invoice AI / AIV3" as a dependency for US7, or reduce US7 scope to exclude FR-054.**

### Q6: [Data] The spec introduces 8+ new entities (Assessment Request, Assessment, Recommendation, Inclusion Seed, etc.). None of these exist in the codebase. What domain folder should these models live in?
**Answer:** The codebase uses domain-driven design with folders like `domain/Risk/`, `domain/Need/`, `domain/Document/`, `domain/Budget/`. There is no `domain/Assessment/` folder. The package already has `domain/Package/Http/Controllers/AssessmentDocumentReviewController.php` which handles assessment document reviews. **Recommendation: Create a new `domain/Assessment/` domain with Models, Actions, Data, Enums, EventSourcing subfolders following the established pattern. Assessment Request, Assessment, and Recommendation models belong here. Inclusion Seed could live here or in a future `domain/Inclusion/` domain.**

### Q7: [Scope] The spec has 9 user stories spanning assessment creation, document upload, AI extraction, assessor review, CP review, service plan integration, billing visibility, audit logging, and Tier-5 management. This is a very large scope. What is the recommended phasing?
**Answer:** The priority assignment already provides phasing: P1 (US1-4: core workflow), P2 (US5-6: CP review + service plan), P3 (US7-9: billing, audit, dataset). **Recommendation: Phase 1 should deliver US1-4 as a self-contained unit. US5-6 can follow in Phase 2. US7-9 (especially billing visibility with its AIV3 dependency) should be Phase 3. Each phase should be independently deployable.**

## Refined Requirements

1. **Dependency declaration**: Add "Invoice AI / AIV3" as a dependency for US7 (Billing Visibility), or descope FR-054 from ASS1.
2. **Assessor identity model**: Clarify whether assessors are always registered suppliers, or whether a lightweight registration path is needed for independent assessors (e.g., independent OTs).
3. **Tier-5 dataset ownership**: Before implementation, document who owns the Tier-5 canonical dataset, the update process, and the versioning strategy. This is a blocking prerequisite for FR-017-023.
4. **Domain structure**: New models should be created under `domain/Assessment/` following the established DDD pattern.
