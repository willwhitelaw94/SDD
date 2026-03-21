---
title: "Feature Specification: S@H Claims Process (SCP)"
---

> **[View Mockup](/mockups/sah-claims-process/index.html)**{.mockup-link}

**Status**: Draft
**Epic**: SCP (TP-900) | **Initiative**: Budgets & Finance
**Priority**: Blocked (pending SA API documentation and SAH funding rules)
**Owner**: Mellette Opena-Fitzpatrick (PO), Katja Panova (PO), Steven Boge (BA), Ed King (Design), Khoa Duong (Dev)

---

## Overview

The S@H (Support at Home) Claims Process implements a structured, compliant claims submission pipeline from Portal to Services Australia (SA). The system automates the aggregation of approved invoices into claims batches, validates claims against SA rules before submission, handles submission via API or file-based integration, processes SA responses (approvals, rejections, adjustments), and maintains a complete audit trail for compliance and reconciliation.

**Scope boundaries**: This epic covers claims compilation and batching, SA pre-submission validation, the submission pipeline, response handling, and audit logging. It does not cover upstream invoice processing (covered by Invoices V2), invoice classification (covered by IRC), or the refund/adjustment system (covered by FRR, though SCP may share SA API infrastructure with FRR Phase 2).

---

## User Scenarios & Testing

### User Story 1 - Finance Generates a Claims Batch from Approved Invoices (Priority: P0)

As a Finance team member, I want the system to automatically compile approved invoices into a claims batch so that I do not have to manually assemble claims for Services Australia submission.

**Acceptance Scenarios**:

1. **Given** approved and cleansed invoice line items exist for a claim period, **When** Finance initiates claim batch generation, **Then** the system aggregates all eligible consumption records by client, funding stream, and service period into a structured claims batch
2. **Given** a claims batch has been generated, **When** Finance views the batch summary, **Then** they see total claim amount, number of clients, number of line items, funding stream breakdown, and claim period covered
3. **Given** some invoice line items are not eligible for claiming (e.g., incomplete data, already claimed), **When** the batch is generated, **Then** ineligible items are excluded with clear reasons and listed in a "Skipped Items" section for review
4. **Given** Finance wants to generate a batch for a specific date range, **When** they select the claim period, **Then** only invoices with service dates within that period are included

---

### User Story 2 - System Validates Claims Against SA Rules Before Submission (Priority: P0)

As a Finance team member, I want claims to be validated against Services Australia rules before I submit them so that I can catch and fix errors before they cause rejections.

**Acceptance Scenarios**:

1. **Given** a claims batch has been generated, **When** the system runs SA pre-submission validation, **Then** each claim line item is checked against known SA rules (valid client identifiers, eligible service types, correct rates, valid date ranges, funding availability)
2. **Given** validation detects errors on specific line items, **When** Finance views the validation report, **Then** each error is listed with the affected line item, rule violated, and suggested corrective action
3. **Given** validation errors exist, **When** Finance attempts to submit the batch, **Then** the system blocks submission and requires errors to be resolved first
4. **Given** validation warnings exist (non-blocking), **When** Finance reviews the batch, **Then** warnings are displayed but submission is allowed with Finance acknowledgement
5. **Given** all validation passes, **When** the batch is marked as validated, **Then** a "Ready for Submission" status is set and the submit action becomes available

---

### User Story 3 - Finance Submits Claims to Services Australia (Priority: P0)

As a Finance team member, I want to submit validated claims to Services Australia through the Portal so that I do not have to manually prepare and upload claim files.

**Acceptance Scenarios**:

1. **Given** a claims batch has passed validation with status "Ready for Submission", **When** Finance clicks "Submit to Services Australia", **Then** the system transmits the claim via the SA API (or generates and uploads the required file format)
2. **Given** a claim has been submitted, **When** the submission completes, **Then** the system records the SA claim reference number, submission timestamp, and updates the batch status to "Submitted - Awaiting Response"
3. **Given** the SA API is unavailable, **When** Finance attempts to submit, **Then** the system displays an error and queues the submission for retry, notifying Finance when submission succeeds or fails definitively

---

### User Story 4 - Finance Processes SA Claim Responses (Priority: P0)

As a Finance team member, I want the system to process Services Australia responses so that I can see which claims were accepted, rejected, or require adjustment.

**Acceptance Scenarios**:

1. **Given** Services Australia sends a response for a submitted claim, **When** the system receives the response (via API callback or file import), **Then** each line item is matched to the original claim and updated with SA's determination (accepted, rejected, adjusted)
2. **Given** a claim line item is accepted by SA, **When** Finance views the claim, **Then** the item shows "Accepted" with the SA-confirmed amount and payment reference
3. **Given** a claim line item is rejected by SA, **When** Finance views the claim, **Then** the item shows "Rejected" with the SA rejection reason and a "Resubmit" or "Void" action
4. **Given** a claim line item is adjusted by SA (different amount than submitted), **When** Finance views the claim, **Then** the item shows "Adjusted" with the original submitted amount, SA-approved amount, and the variance
5. **Given** rejected items exist in a batch, **When** Finance reviews them, **Then** they can correct the underlying issue and include the corrected items in a new claims batch

---

### User Story 5 - Finance Views Claims History and Audit Trail (Priority: P1)

As a Finance team member, I want to view a complete history of all claims submitted to SA with full audit trail so that I can reconcile and respond to compliance inquiries.

**Acceptance Scenarios**:

1. **Given** multiple claims batches have been submitted over time, **When** Finance navigates to the Claims History view, **Then** they see a list of all batches with columns: batch ID, claim period, total amount, status, submission date, SA reference, acceptance rate
2. **Given** Finance clicks on a specific batch, **When** the detail view opens, **Then** they see all line items with their individual statuses, SA responses, and links to source invoices
3. **Given** Finance needs an audit export, **When** they click "Export", **Then** they receive a CSV containing full claim details including SA references, amounts, statuses, and timestamps

---

### User Story 6 - System Schedules Automatic Claims Generation (Priority: P2)

As a Finance team member, I want the system to automatically generate claims batches on a configurable schedule so that claims are submitted regularly without manual initiation.

**Acceptance Scenarios**:

1. **Given** a claims schedule is configured (e.g., weekly), **When** the scheduled time is reached, **Then** the system automatically generates a claims batch from all eligible approved invoices since the last batch
2. **Given** an auto-generated batch is ready, **When** Finance logs in, **Then** they see a notification with a link to review and submit the batch
3. **Given** the auto-generated batch has validation errors, **When** Finance reviews, **Then** they see the errors and can resolve them before submission

---

### Edge Cases

- **What happens when a client's SA identifier is missing or invalid?**
  The line item fails validation with a specific error. Finance must update the client record with the correct SA identifier before the item can be included in a claim.

- **What happens when a service type is not recognized by Services Australia?**
  The line item fails validation. The system provides a mapping table of internal service types to SA-recognized codes. Unmapped types are flagged for configuration.

- **What happens when a claim is submitted for a client whose SA eligibility has lapsed?**
  Pre-submission validation checks SA eligibility status. If lapsed, the line item is blocked with an "Ineligible Client" error and excluded from the batch.

- **What happens when SA changes their API or file format requirements?**
  The submission pipeline uses a versioned adapter pattern. New SA format versions are implemented as new adapters while maintaining backward compatibility during transition periods.

- **What happens when the same invoice line item is included in multiple claims?**
  The system prevents duplicate claiming by tracking claim status per line item. Items in "Submitted" or "Accepted" status cannot be included in new batches.

---

## Functional Requirements

- **FR-001**: System MUST aggregate approved, cleansed invoice line items into claims batches grouped by client, funding stream, and service period
- **FR-002**: System MUST validate each claim line item against Services Australia rules before allowing submission
- **FR-003**: System MUST block submission of claims batches containing validation errors (hard errors)
- **FR-004**: System MUST allow submission of batches with validation warnings after Finance acknowledgement
- **FR-005**: System MUST submit claims to Services Australia via the SA API or file-based integration channel
- **FR-006**: System MUST record SA claim reference numbers and submission timestamps for each batch
- **FR-007**: System MUST process SA responses (accepted, rejected, adjusted) and update individual line item statuses
- **FR-008**: System MUST prevent duplicate claiming of the same invoice line item across batches
- **FR-009**: System MUST provide a Claims History index with batch-level and line-item-level detail views
- **FR-010**: System MUST maintain a complete audit trail of all claim actions (generation, validation, submission, response processing) with user, timestamp, and details
- **FR-011**: System MUST support export of claims data to CSV for reporting and compliance
- **FR-012**: System SHOULD support configurable automatic claims batch generation on a schedule (weekly, fortnightly)
- **FR-013**: System MUST allow Finance to re-submit corrected line items that were previously rejected by SA
- **FR-014**: System MUST integrate with the invoice pipeline to consume only clean, approved invoice data
- **FR-015**: System SHOULD use a versioned adapter pattern for SA API integration to handle future format changes
- **FR-016**: System MUST support fallback manual submission (file export/upload) when SA API is unavailable

---

## Key Entities

- **ClaimsBatch**: Groups claim line items for submission to SA
  - Key Fields: id, uuid, claim_period_start, claim_period_end, total_amount, status (draft, validated, submitted, response_received, reconciled), sa_reference, submitted_at, submitted_by
  - Relationships: Has many ClaimLineItems. Belongs to User (submitter)

- **ClaimLineItem**: Individual line item within a claims batch
  - Key Fields: id, claims_batch_id, invoice_line_item_id, client_id, funding_stream_id, service_type, service_date, amount_claimed, sa_status (pending, accepted, rejected, adjusted), sa_response_amount, sa_rejection_reason
  - Relationships: Belongs to ClaimsBatch, InvoiceLineItem, Client, FundingStream

- **ClaimValidationResult**: Records validation outcomes per line item
  - Key Fields: id, claim_line_item_id, rule_code, severity (error, warning), message, resolved
  - Relationships: Belongs to ClaimLineItem

- **ClaimAuditLog**: Tracks all claim lifecycle events
  - Key Fields: id, claims_batch_id, claim_line_item_id, action (generated, validated, submitted, response_processed, resubmitted), user_id, timestamp, details (JSON)
  - Relationships: Belongs to ClaimsBatch, ClaimLineItem, User

---

## Success Criteria

### Measurable Outcomes

- **SC-001**: Claim rejection rate from Services Australia falls below 5%
- **SC-002**: Claims processing time (from invoice approval to SA submission) reduced by 50% compared to current manual process
- **SC-003**: Zero compliance violations related to claims submission
- **SC-004**: 100% audit trail coverage for all claims actions
- **SC-005**: Pre-submission validation catches >95% of errors that would cause SA rejection
- **SC-006**: Claims batch generation time under 5 minutes for standard weekly batches

---

## Assumptions

- Services Australia API or submission requirements are documented and stable enough to build against
- SAH funding rules are finalized and available for implementation as validation rules
- The invoice pipeline (Invoices V2) provides clean, approved data suitable for claims aggregation
- SA eligibility and client identifier data is maintained and accessible in Portal
- The SA API supports programmatic submission (if not, file-based submission is the fallback)

---

## Dependencies

- **Invoices V2**: Must be complete to provide clean, approved invoice data for claims compilation
- **Services Australia API Access**: Requires SA API documentation, credentials, and test environment
- **SAH Funding Rules Documentation**: Detailed rules required to implement pre-submission validation
- **Funding Reconciliation (FRR)**: SCP and FRR Phase 2 may share SA API infrastructure and claim submission patterns
- **Client SA Identifiers**: Client records must contain valid Services Australia identifiers

---

## Out of Scope

- Invoice processing and approval workflows (covered by Invoices V2)
- Invoice classification (covered by IRC)
- Refunds and adjustment netting against SA claims (covered by FRR Phase 2)
- Direct payment reconciliation with MYOB (covered by FRR Phase 1)
- Budget management and funding allocation (covered by Budget-Reloaded)
- Supplier bill submission (covered by PBS)

## Clarification Outcomes

### Q1: [Dependency] What is the expected timeline for SA API documentation? Contingency plan?
**Answer:** The epic is marked "Blocked" — this is a hard external dependency on Services Australia providing API documentation and a test environment. No timeline can be verified from the codebase. The existing claims infrastructure (`domain/Claim/`) uses a CSV-based submission (`ClaimCsvSubmission`, `ClaimCsvSubmissionJob`) — this IS the contingency plan. FR-016 explicitly requires file-based fallback. The architecture should be designed with the adapter pattern so that CSV export is the initial submission method, replaced by API submission when SA documentation is available. The `ClaimCsvSubmissionStatus` enum (existing) provides the status tracking pattern.

### Q2: [Scope] What is the definitive boundary between SCP and FRR Phase 2?
**Answer:** Clear boundary: SCP = standard claims compilation and submission (new consumption -> SA). FRR Phase 2 = credit netting against claims (adjustments/refunds applied to reduce claim amounts). SCP compiles claims; FRR modifies claim amounts before submission. They share the SA submission mechanism but have different input data. SCP takes clean consumptions, FRR takes credits and nets them. Both should use a shared SA API adapter. In practice, FRR Phase 2 is a modifier that runs between SCP's claim compilation and submission steps. Recommendation: SCP owns the claim compilation and submission pipeline; FRR Phase 2 hooks into the pipeline to apply credit netting before submission.

### Q3: [Data] Should the versioned adapter pattern be shared across SCP, FRR, and SA API Infrastructure?
**Answer:** Yes, absolutely. The versioned adapter pattern (FR-015) should be a shared architectural component. Recommendation: create a `domain/ServicesAustralia/` domain containing: (a) `SaApiAdapter` interface with `submit()`, `getResponse()`, `validate()` methods, (b) `SaCsvAdapter` implementing file-based submission (existing pattern), (c) `SaApiV1Adapter` implementing API-based submission (future), and (d) shared SA response parsing. Both SCP and FRR Phase 2 would use this adapter. The existing `domain/Claim/` infrastructure provides the claim data model; the new SA domain provides the submission mechanism.

### Q4: [Edge Case] Claims batch with mixed accepted/rejected line items — how is status handled?
**Answer:** The `ClaimsBatch` entity has a single `status` field with values: draft, validated, submitted, response_received, reconciled. When SA returns a mixed response, the batch should be "response_received" with individual `ClaimLineItem` records having their own `sa_status` (accepted/rejected/adjusted). The batch-level status represents the batch lifecycle, not the aggregate outcome. After Finance reviews and handles all rejected items (resubmit or void), the batch can be marked "reconciled." Recommendation: add a computed `acceptance_rate` property on `ClaimsBatch` that calculates the percentage of accepted line items for quick assessment.

### Q5: [Integration] What is the format for the manual file export (FR-016)?
**Answer:** The existing `ClaimCsvSubmission` model and `ClaimCsvSubmissionJob` in `domain/Claim/` confirm CSV is the current format. The `SubmitClaimInvoicesAction` and `SubmitOpenInvoicesData` handle the current submission flow. The manual file export should match whatever format SA currently accepts (likely the existing CSV format used via Databricks). Recommendation: the CSV adapter should produce the same format as the current manual process, ensuring compatibility. The `ClaimInvoiceSubmission` model already tracks CSV submissions.

### Q6: [Data] How are consumption records linked to claim line items?
**Answer:** FR-014 requires consuming "only clean, approved invoice data." The consumption data flows: Bill -> BillItem -> FundingConsumption (via `budget_plan_item_funding_consumptions` table). Claim line items should reference `consumption_id` to trace from claim back to original bill. The `SubmitOpenInvoiceConsumptionData` in `domain/Claim/Data/View/` already links consumptions to claim submissions. This relationship provides full traceability from SA claim -> consumption -> bill item -> original invoice.

### Q7: [Scope] FR-012 supports automatic claims batch generation on a schedule. Is this Phase 1 or future?
**Answer:** FR-012 is marked as SHOULD (not MUST), indicating it is desirable but not MVP. Manual claim generation (Finance initiates) is the MVP. Automated scheduling is a natural enhancement once the manual pipeline is proven reliable. The `app/Console/Kernel.php` already registers scheduled commands — adding a weekly claim generation command follows existing patterns.

### Q8: [Edge Case] How does pre-submission validation (FR-002) check SA eligibility?
**Answer:** Pre-submission validation checks: (a) valid client SA identifiers (stored in Portal client records), (b) eligible service types (mapped in `config/support-at-home.php` service categories), (c) correct rates (from rate schedules), (d) valid date ranges (from funding stream dates), (e) funding availability (from `Funding` model amounts). Most validation data is locally available. SA eligibility status (whether SA considers the client eligible) may require an SA API call or a locally cached eligibility flag. If SA API is unavailable, local validation is still valuable for catching data quality issues.

### Q9: [Integration] The `ReconcileServicesAustraliaFundings` action already exists. How does SCP relate to it?
**Answer:** `ReconcileServicesAustraliaFundings` in `domain/Funding/Actions/ReconcileServicesAustraliaFundings.php` handles funding reconciliation against SA data. SCP's claim response processing (US4) needs to update funding records when SA confirms or adjusts claim amounts. The reconciliation action may be reusable or need extension. SCP should use the existing funding reconciliation infrastructure rather than building parallel reconciliation logic.

### Q10: [Performance] SC-006 targets batch generation under 5 minutes. Is this achievable?
**Answer:** Batch generation involves: query approved consumptions for the period, group by client and funding stream, run validation rules, assemble claim records. With proper database indexing and batch processing, 5 minutes is achievable for typical weekly batches (estimated hundreds to low thousands of line items). The existing claim infrastructure's `ClaimCsvSubmissionJob` already handles batch processing.

## Refined Requirements

- **FR-REFINED-001**: SCP and FRR Phase 2 MUST share a common SA submission adapter in a `domain/ServicesAustralia/` domain with the versioned adapter pattern.
- **FR-REFINED-002**: The initial SCP implementation MUST use CSV file export (matching existing Databricks format) as the submission mechanism, with API submission added when SA documentation is available.
- **FR-REFINED-003**: A computed `acceptance_rate` property SHOULD be added to `ClaimsBatch` to provide quick assessment of mixed response batches.
- **FR-REFINED-004**: US5 (Client Reimbursement) SHOULD be extracted from PBS scope. SCP should expect to receive only supplier-submitted and system-generated bill data, not client reimbursement claims.
