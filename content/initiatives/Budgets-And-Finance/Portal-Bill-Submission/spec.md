---
title: "Feature Specification: Portal Bill Submission (PBS)"
---

> **[View Mockup](/mockups/portal-bill-submission/index.html)**{.mockup-link}

**Status**: Draft
**Epic**: PBS | **Initiative**: Budgets & Finance
**Priority**: Backlog
**Owner**: Romy Blacklaw (PO), David Henry (BA), Bruce Blyth (Design), Khoa Duong (Dev)

---

## Overview

Portal Bill Submission (PBS) provides an authenticated, in-portal bill submission experience for suppliers, replacing unstructured email-based submissions. Suppliers access the portal via email links, receive real-time validation against client-specific rules during entry, and can save reusable preset templates for recurring bills. The goal is to improve bill quality at source, reduce rejection/resubmission cycles, and shift bill flow from email to a structured channel.

**Scope boundaries**: This epic covers the supplier-facing portal submission form, real-time validation, preset templates, and authenticated access flow. It does not cover internal bill processing workflows (covered by On-Hold Bills / OHB), AI classification (covered by IRC), or claims submission (covered by SCP).

---

## User Scenarios & Testing

### User Story 1 - Supplier Submits a Bill via Portal (Priority: P0)

As an authenticated supplier, I want to submit a bill through the portal so that my bill is validated at entry and I avoid rejection/resubmission cycles.

**Acceptance Scenarios**:

1. **Given** a supplier receives an email link to submit a bill, **When** they click the link, **Then** they are directed to the authenticated portal bill submission form with their supplier identity pre-populated
2. **Given** the supplier is on the bill submission form, **When** they enter client details, service type, service dates, and amounts, **Then** the form validates each field in real time against client-specific rules
3. **Given** all required fields are completed and validation passes, **When** the supplier clicks "Submit Bill", **Then** the bill is submitted into the processing pipeline and the supplier receives a confirmation with a reference number
4. **Given** a validation error is detected during entry (e.g., invalid client, service type mismatch), **When** the supplier enters the invalid data, **Then** an inline error message explains the issue and suggests corrective action before submission is allowed

---

### User Story 2 - Supplier Uses a Preset Template for Recurring Bills (Priority: P1)

As a supplier who bills for the same client and service type regularly, I want to save a bill configuration as a preset so that I only need to update changed fields (e.g., service dates) for subsequent submissions.

**Acceptance Scenarios**:

1. **Given** a supplier has submitted a bill successfully, **When** they are on the confirmation screen, **Then** they see an option to "Save as Preset" for this bill configuration
2. **Given** a supplier has saved presets, **When** they start a new bill submission, **Then** they see a list of their saved presets and can select one to pre-populate the form
3. **Given** a supplier selects a preset, **When** the form loads, **Then** all saved fields (client, service type, line items, rates) are pre-populated and the supplier only needs to update variable fields such as service dates
4. **Given** a supplier modifies a preset-loaded form, **When** they submit the bill, **Then** they are given the option to update the existing preset or save as a new preset

---

### User Story 3 - Supplier Receives Real-Time Validation Feedback (Priority: P0)

As a supplier, I want to see validation feedback as I fill in the bill form so that I can correct issues before submitting and avoid rejection.

**Acceptance Scenarios**:

1. **Given** the supplier enters a client identifier, **When** the system looks up the client, **Then** the supplier sees confirmation of the client name and active service plan, or an error if the client is not found or inactive
2. **Given** the supplier selects a service type, **When** the system checks against the client's plan, **Then** the supplier sees confirmation that the service type is valid for the client, or a warning if it is not covered
3. **Given** the supplier enters a service date, **When** the date falls outside the client's active plan period, **Then** the supplier sees a warning message with the valid date range
4. **Given** the supplier enters an amount, **When** the amount exceeds the expected rate for the service type, **Then** the supplier sees an advisory (not a hard block) noting the amount is higher than expected

---

### User Story 4 - Supplier Authenticates via Email Link (Priority: P0)

As a supplier, I want to access the bill submission portal through a secure email link so that I can submit bills without managing separate credentials.

**Acceptance Scenarios**:

1. **Given** a supplier is registered in the system, **When** they receive an email with a bill submission link, **Then** clicking the link authenticates them and directs them to the submission form
2. **Given** the authentication link has expired, **When** the supplier clicks it, **Then** they see a message explaining the link has expired and can request a new link
3. **Given** the supplier is authenticated, **When** they complete their session, **Then** their identity is verified throughout and all submissions are attributed to their supplier account

---

### User Story 5 - Client Submits a Reimbursement Claim (Priority: P2)

As a client (recipient), I want to submit a reimbursement request through the portal so that I can claim back expenses paid out-of-pocket.

**Acceptance Scenarios**:

1. **Given** a client is authenticated in the portal, **When** they navigate to the reimbursement section, **Then** they see a submission form tailored for reimbursement claims with appropriate fields (receipt upload, expense type, date, amount)
2. **Given** a client fills in the reimbursement form, **When** they submit, **Then** the system validates the claim against the client's plan and available budget
3. **Given** a reimbursement is submitted, **When** the Accounts team views incoming submissions, **Then** the reimbursement is distinguished from supplier bills and routed to the appropriate review workflow

---

### Edge Cases

- **What happens when a supplier's authentication link is used by an unauthorized party?**
  Links are single-use or time-limited. The system logs access attempts and flags unusual activity (e.g., different IP, multiple uses). Suppliers can report unauthorized access to invalidate the link.

- **What happens when a preset references a client who is no longer active?**
  The preset loads but the client field shows a validation error indicating the client is inactive. The supplier must select a different client or contact Trilogy Care.

- **What happens when validation rules change after a preset was saved?**
  Presets store field values only, not validation rules. New validation rules apply at submission time. The supplier may see new validation errors on previously valid preset configurations.

- **What happens when the supplier submits a bill for a client they are not authorized to service?**
  The system checks supplier-client authorization during validation. Unauthorized combinations are blocked with a clear message directing the supplier to contact their Trilogy Care coordinator.

---

## Functional Requirements

- **FR-001**: System MUST authenticate suppliers via secure email links with time-limited tokens
- **FR-002**: System MUST pre-populate the supplier's identity on the submission form after authentication
- **FR-003**: System MUST provide real-time, inline validation of bill fields against client-specific rules during entry
- **FR-004**: System MUST validate client identity, service type eligibility, service date ranges, and amount reasonableness
- **FR-005**: System MUST NOT be overly strict with validation -- advisory warnings SHOULD be used for soft rules (e.g., amount higher than expected) while hard blocks are reserved for definitive errors (e.g., invalid client)
- **FR-006**: System MUST allow suppliers to save bill configurations as reusable preset templates
- **FR-007**: System MUST allow suppliers to load a preset to pre-populate the form and update only changed fields
- **FR-008**: System MUST provide a confirmation screen with reference number upon successful submission
- **FR-009**: System MUST route submitted bills into the existing bill processing pipeline
- **FR-010**: System MUST support a reimbursement submission variant for client (recipient) users with different field requirements (receipt upload, expense type)
- **FR-011**: System SHOULD align the bill submission UI/UX with the On-Hold Bills (OHB) resubmission flow for consistency
- **FR-012**: System MUST log all submission attempts (successful and failed) with supplier identity, timestamp, and validation outcomes
- **FR-013**: System MUST support future entry points beyond email links (e.g., QR codes) without architectural changes

---

## Key Entities

- **PortalBillSubmission**: Records each bill submission through the portal
  - Key Fields: id, uuid, supplier_id, client_id, submission_status (draft, submitted, rejected, accepted), submitted_at, validation_outcome, reference_number
  - Relationships: Belongs to Supplier, Client. Has many PortalBillLineItems

- **PortalBillLineItem**: Individual line items within a portal submission
  - Key Fields: submission_id, service_type, service_date, amount, description, validation_status
  - Relationships: Belongs to PortalBillSubmission

- **SubmissionPreset**: Saved bill templates for recurring submissions
  - Key Fields: id, supplier_id, client_id, preset_name, field_values (JSON), last_used_at, created_at
  - Relationships: Belongs to Supplier

---

## Success Criteria

### Measurable Outcomes

- **SC-001**: Bill rejection rate for portal-submitted bills is <10% (compared to current email submission rejection rate)
- **SC-002**: Average resubmission cycles per bill reduced by 70%
- **SC-003**: Supplier adoption rate reaches 50% of active suppliers within 6 months of launch
- **SC-004**: Time from bill submission to processing reduced by 40% compared to email-based submissions
- **SC-005**: Preset usage rate among returning suppliers exceeds 60%

---

## Assumptions

- Suppliers are already registered in the system and can be authenticated via email-based token links
- Validation rules can be defined to balance quality improvement with usability (not overly restrictive)
- Preset functionality is technically feasible within the existing portal architecture
- The existing portal infrastructure supports authenticated supplier sessions
- Suppliers will adopt the portal if the experience is clearly better than email

---

## Dependencies

- **Supplier Authentication System**: Must support token-based email link authentication for suppliers
- **Client Plan Data**: Real-time access to client plans, service types, and active date ranges for validation
- **On-Hold Bills (OHB)**: PBS and OHB share UI/UX patterns for bill submission and resubmission flows
- **Bill Processing Pipeline**: Submitted bills must integrate with existing downstream processing

---

## Out of Scope

- Internal bill processing and on-hold workflows (covered by OHB epic)
- AI-powered invoice classification (covered by IRC epic)
- Claims submission to Services Australia (covered by SCP epic)
- Supplier registration and onboarding (assumed to be handled by existing supplier management)
- Payment processing and payment notifications to suppliers
- QR code entry point implementation (future enhancement, architecture should support it)

## Clarification Outcomes

### Q1: [Dependency] Are the PBS supplier authentication system and SOP2 supplier portal access the same system?
**Answer:** The git status shows extensive Supplier V2 infrastructure being built: `app/Http/Controllers/Api/v2/`, `app/Http/Middleware/EnsureSupplierContext.php`, `app/Http/Middleware/EnsureActiveSupplierContext.php`, `domain/Supplier/Models/SupplierApiRefreshToken.php`, and `database/migrations/2026_03_19_000000_create_supplier_api_refresh_tokens_table.php`. This is a separate supplier portal with its own authentication (API refresh tokens, supplier context middleware). PBS should use this same Supplier V2 authentication infrastructure rather than building a separate email-link system. The email link could be a lightweight entry point that creates/activates a supplier session using the V2 auth system. Recommendation: align PBS authentication with the Supplier V2 portal authentication being built.

### Q2: [Scope] Should US5 (Client Reimbursement Claims) be a separate epic?
**Answer:** Yes, strongly recommended. US5 is a fundamentally different user flow (client submitting reimbursement) vs US1-US4 (supplier submitting bills). The user personas, authentication, validation rules, form fields, and downstream processing are all different. Including it in PBS creates scope creep and mixed priorities. US5 can reference PBS for shared infrastructure (form patterns, submission pipeline entry point) but should be its own epic. Recommendation: extract US5 into a "Client Reimbursement" epic and keep PBS supplier-focused.

### Q3: [Edge Case] Who defines and maintains validation rule configuration?
**Answer:** The existing bill processing pipeline has evaluation actions: `EvaluatePlannedServiceBudgetAmount`, `EvaluatePlannedServiceFundingAmount`, `EvaluateRate`, `EvaluateSupplierAbn`, `EvaluateUnits` in `domain/Bill/Actions/Evaluations/`. These actions encode validation logic in code. For PBS, real-time validation should use the same evaluation logic. The distinction between "hard blocks" and "soft warnings" should be configurable — some evaluations produce traffic-light indicators (`BillEvaluationTrafficLightEnum`: presumably red/yellow/green). Recommendation: hard blocks = red (invalid client, expired plan), soft warnings = yellow (rate exceeds expected, unusual quantity). Configuration should be code-based initially, with a future admin UI if rule management becomes complex.

### Q4: [Integration] Has OHB (On-Hold Bills) been designed? Which epic leads design?
**Answer:** The codebase shows On-Hold Bills infrastructure exists. The bill processing pipeline has approval/rejection flows (`ApproveBill`, `BulkApproveBills`, `BulkRejectBills`, `UnapproveBill`). The `ReprocessInReviewBill` action and `EscalateModal.vue` show existing bill escalation patterns. OHB patterns already exist in the codebase. PBS should follow the existing bill edit/submission UI patterns in `resources/js/Pages/Bills/Edit.vue` and `resources/js/Pages/Bills/EditPartials/`. Recommendation: PBS follows OHB's established patterns since OHB is further along.

### Q5: [Data] How are stale presets handled when validation rules change?
**Answer:** The spec correctly notes that "Presets store field values only, not validation rules. New validation rules apply at submission time." This means a preset saved with a valid client ID that later becomes inactive will fail validation at load time. The edge case section addresses this: "The preset loads but the client field shows a validation error." This is the correct UX — validate preset values against current rules at load time, not at save time. No preset migration needed; stale presets self-correct through validation. Recommendation: add a "last validated" timestamp to presets and optionally warn if a preset has not been used in >90 days.

### Q6: [Authentication] How does the email-link authentication work technically?
**Answer:** FR-001 specifies "secure email links with time-limited tokens." The Supplier V2 infrastructure includes `SupplierApiRefreshToken` model and `EnsureSupplierContext` middleware. A signed URL pattern (using Laravel's `URL::signedRoute()`) could provide one-click access that creates a supplier session. The token would map to a specific supplier and optionally a specific client context. Expiration should be configurable (recommend 7 days). FR-013 notes future entry points (QR codes) — the architecture should support any token-based entry point.

### Q7: [Integration] How does the submitted bill enter the existing processing pipeline?
**Answer:** FR-009 requires routing to the existing pipeline. The `AddBillItem`, `ProcessBillExtraction`, and `ApproveBill` actions in `domain/Bill/Actions/` handle bill processing stages. A portal-submitted bill would bypass extraction (data is already structured from the form) and enter at the evaluation/approval stage. The `PortalBillSubmission` entity should create standard bill/bill_item records that the existing pipeline can process. This avoids building a parallel pipeline.

### Q8: [UX] Should the supplier see the status of previously submitted bills?
**Answer:** The spec focuses on submission but does not explicitly cover a "my submissions" view. This is a natural requirement — suppliers will want to check if their bills were accepted, rejected, or pending. Recommendation: include a lightweight "My Submissions" list showing reference number, status, and date for the authenticated supplier. This can be a simple table with the supplier's `PortalBillSubmission` records.

### Q9: [Performance] Real-time validation against client-specific rules — what is the expected latency?
**Answer:** Client lookup, service type validation, and rate checking each require database queries. With proper indexing, each validation step should complete in <200ms. The form validates on field change/blur, so total validation time per field should be <500ms. The existing evaluation actions provide the validation logic; they just need to be exposed as API endpoints for the portal form.

### Q10: [Scope] FR-013 mentions future QR code entry points. What architectural pattern supports this?
**Answer:** The authentication should be token-based with the entry point being a URL parameter. Email links generate `?token=xyz`, QR codes generate a URL that resolves to the same endpoint with a different token type. The `PortalBillSubmission` entity tracks the `source` (email_link, qr_code, direct). The authentication middleware validates the token regardless of source. Laravel's signed routes support this pattern natively.

## Refined Requirements

- **FR-REFINED-001**: US5 (Client Reimbursement Claims) SHOULD be extracted into a separate epic. PBS should remain supplier-focused.
- **FR-REFINED-002**: PBS authentication MUST align with the Supplier V2 portal authentication infrastructure (SupplierApiRefreshToken, EnsureSupplierContext middleware) rather than building a separate system.
- **FR-REFINED-003**: Portal-submitted bills MUST create standard bill/bill_item records compatible with the existing bill processing pipeline, bypassing extraction and entering at the evaluation stage.
- **FR-REFINED-004**: A lightweight "My Submissions" view SHOULD be included showing the supplier's submitted bills with status, reference number, and date.
