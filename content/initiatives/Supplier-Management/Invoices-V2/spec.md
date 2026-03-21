---
title: "Feature Specification: Invoices V2 (IV2)"
---

> **[View Mockup](/mockups/invoices-v2/index.html)**{.mockup-link}

**Status**: Draft
**Epic**: TP-1864 IV2 | **Initiative**: TP-1857 Supplier Management

---

## Overview

Invoice processing currently relies heavily on manual data entry, validation, and fragmented workflows spread across multiple BRP action items (Invoices V2, Query Invoice, Auto-Approve Invoice, Dispute Invoice). This creates bottlenecks, high error rates, and slow payment timelines. Invoices V2 delivers a fully integrated, automation-driven invoice pipeline from receipt through to payment, incorporating AI-based anomaly detection, structured query and dispute workflows, auto-approval for qualifying invoices, MYOB financial sync, and claims submission integration with the Support at Home (SAH) program.

This epic consolidates previously siloed invoice workflows into a unified system, reducing manual processing and enabling faster, more accurate payments.

---

## User Scenarios & Testing

### User Story 1 - AI-Based Invoice Anomaly Detection (Priority: P1)

As a Billing Coordinator, I want the system to automatically flag invoices with potential issues so that I can focus my review on problematic invoices rather than manually checking every one.

**Acceptance Scenarios**:
1. **Given** a new invoice is received, **When** the system processes it, **Then** AI anomaly detection runs automatically and flags any issues (rate discrepancies, unusual amounts, missing fields, duplicate charges).
2. **Given** an invoice is flagged with anomalies, **When** the coordinator views the invoice, **Then** each anomaly is clearly displayed with a description, severity level, and suggested action.
3. **Given** an invoice has no anomalies detected, **When** the coordinator views it, **Then** a "No issues detected" indicator is shown with the confidence level.
4. **Given** AI anomaly detection fails or is unavailable, **When** the invoice is processed, **Then** it falls back to the standard manual review workflow with no AI indicators displayed.

### User Story 2 - Invoice Query Workflow (Priority: P1)

As a Care Coordinator, I want to raise an internal query on an invoice so that unclear charges can be resolved before the invoice is approved or paid.

**Acceptance Scenarios**:
1. **Given** a coordinator identifies an unclear charge on an invoice, **When** they raise a query, **Then** the invoice is moved to "Queried" status with a structured query form capturing the question, affected line items, and priority.
2. **Given** a query is raised, **When** the assigned resolver views the query, **Then** they see the full invoice context, query details, and can respond with resolution notes.
3. **Given** a query is resolved, **When** the resolution is submitted, **Then** the invoice returns to its previous workflow stage with the resolution recorded in the audit trail.
4. **Given** a query has been open for longer than the configured SLA, **When** the SLA is breached, **Then** an escalation notification is sent to the coordinator's manager.

### User Story 3 - Invoice Dispute Workflow (Priority: P1)

As a Care Coordinator, I want to formally dispute an invoice so that incorrect charges can be challenged through a structured process.

**Acceptance Scenarios**:
1. **Given** a coordinator identifies an incorrect charge, **When** they raise a dispute, **Then** the invoice is moved to "Disputed" status with a structured form capturing the dispute reason, evidence, and requested resolution.
2. **Given** a dispute is raised, **When** the supplier is notified, **Then** they receive clear details of the dispute and instructions for response.
3. **Given** a dispute is resolved (accepted, partially accepted, or rejected), **When** the resolution is recorded, **Then** the invoice is updated accordingly and all parties are notified.
4. **Given** a dispute is resolved with an adjustment, **When** the adjusted amount is applied, **Then** the invoice total is recalculated and the adjustment is logged.

### User Story 4 - Auto-Approval for Qualifying Invoices (Priority: P2)

As a Finance Manager, I want invoices that meet defined criteria to be automatically approved so that processing time is reduced for routine, low-risk invoices.

**Acceptance Scenarios**:
1. **Given** an invoice meets all auto-approval criteria (no anomalies, amount within threshold, known supplier, matching purchase order), **When** the system evaluates it, **Then** the invoice is automatically approved and moved to the payment queue.
2. **Given** an invoice is auto-approved, **When** the coordinator views it, **Then** an "Auto-Approved" indicator is shown with the criteria that were evaluated.
3. **Given** an invoice fails any auto-approval criterion, **When** the system evaluates it, **Then** the invoice is routed to manual review with the failing criterion identified.
4. **Given** auto-approval criteria are updated, **When** the changes are saved, **Then** they apply only to newly received invoices (not retroactively).

### User Story 5 - MYOB Financial Sync (Priority: P2)

As a Finance Administrator, I want approved invoices to sync automatically to MYOB so that financial records are kept current without manual data entry.

**Acceptance Scenarios**:
1. **Given** an invoice is approved and ready for payment, **When** the sync process runs, **Then** the invoice data is pushed to MYOB with correct account codes, tax treatment, and payment terms.
2. **Given** the MYOB sync fails, **When** the error is detected, **Then** the invoice is flagged for manual export and the error details are logged.
3. **Given** an invoice is amended after sync, **When** the amendment is saved, **Then** a correcting entry is sent to MYOB.

### User Story 6 - SAH Claims Submission Pipeline (Priority: P2)

As a Finance Coordinator, I want processed invoices to feed into the Support at Home claims submission pipeline so that government funding claims are timely and accurate.

**Acceptance Scenarios**:
1. **Given** an invoice is approved and relates to SAH-funded services, **When** the claims batch is prepared, **Then** the invoice data is included with the correct SAH category coding and compliance fields.
2. **Given** an invoice has missing or invalid SAH compliance data, **When** the claims batch is generated, **Then** the invoice is excluded with a clear reason and flagged for correction.
3. **Given** a claims batch is submitted, **When** the response is received, **Then** the submission status is updated on each invoice in the batch.

### Edge Cases

- **Duplicate invoice detection**: System should identify potential duplicate invoices (same supplier, same amount, similar date) and flag for manual review before processing.
- **Invoice recalled after auto-approval**: If a supplier recalls an invoice after auto-approval, the system should support reversal with a full audit trail.
- **Query and dispute on same invoice**: An invoice should not have both an active query and an active dispute simultaneously; the system should guide the user to resolve the query first or convert it to a dispute.
- **Partial payment**: If only part of an invoice is approved (e.g., after a dispute), the system should support partial payment with clear tracking of the remaining balance.
- **SAH category changes**: If SAH funding categories change, existing invoices in the pipeline should be flagged for re-evaluation.

---

## Functional Requirements

- **FR-001**: System MUST run AI-based anomaly detection on all incoming invoices, flagging rate discrepancies, unusual amounts, missing fields, and duplicate charges.
- **FR-002**: System MUST provide a structured query workflow with status tracking, SLA management, and resolution recording.
- **FR-003**: System MUST provide a structured dispute workflow with supplier notification, evidence capture, and resolution options (accept, partial accept, reject).
- **FR-004**: System MUST support configurable auto-approval criteria (amount thresholds, anomaly status, supplier history, matching requirements).
- **FR-005**: System MUST automatically approve invoices meeting all configured criteria and route them to the payment queue.
- **FR-006**: System MUST integrate with MYOB for automated financial sync of approved invoices.
- **FR-007**: System MUST feed processed invoices into the SAH claims submission pipeline with correct compliance coding.
- **FR-008**: System MUST maintain a complete audit trail for all invoice actions (receipt, review, query, dispute, approval, payment, claim).
- **FR-009**: System MUST detect and flag potential duplicate invoices before processing.
- **FR-010**: System MUST provide a unified invoice dashboard showing all invoices across statuses (received, in review, queried, disputed, approved, paying, paid, claimed).
- **FR-011**: System MUST maintain human review capability alongside auto-approval (hybrid approach).
- **FR-012**: System MUST support CSV export as fallback if MYOB API integration is unavailable.

---

## Key Entities

- **Invoice**: The core entity representing a supplier invoice. Extended with anomaly detection results, query/dispute history, auto-approval status, MYOB sync status, and SAH claims status.
- **InvoiceLineItem**: Individual line items on an invoice, each with AI anomaly detection results and SAH category coding.
- **InvoiceQuery**: An internal query raised against an invoice. Contains query type, description, affected line items, priority, assigned resolver, resolution notes, and SLA tracking.
- **InvoiceDispute**: A formal dispute raised against an invoice. Contains dispute reason, evidence, supplier response, resolution outcome, and adjustment amount.
- **AnomalyDetectionResult**: The output of AI analysis on an invoice, including detected anomalies (type, severity, description, suggested action) and overall confidence score.
- **AutoApprovalCriteria**: Configurable rules for automatic invoice approval, including amount thresholds, required anomaly clearance, supplier eligibility, and matching requirements.
- **ClaimsBatch**: A batch of invoices submitted for SAH claims, with submission status tracking and response handling.

---

## Success Criteria

### Measurable Outcomes

- Invoice processing time reduced by 30-50% compared to current manual workflows.
- Invoices pending approval >5 days reduced to <10% of total volume.
- Auto-approval rate >40% for routine, low-risk invoices within 3 months.
- Client billing satisfaction scores improved by >15%.
- Zero compliance issues from invoice processing in SAH claims submissions.
- Query resolution time <3 business days (90th percentile).
- Dispute resolution time <10 business days (90th percentile).

---

## Assumptions

- SAH funding rules and data structures are stable post-Budget V2.
- AI/RAG anomaly detection achieves sufficient accuracy to reliably flag issues without excessive false positives.
- Users are trained to distinguish between "query" (internal resolution) and "dispute" (formal challenge with supplier).
- Budget V2 migration is complete and all client packages are migrated before IV2 goes live.
- MYOB API is available and supports the required data fields for invoice sync.

---

## Dependencies

- Budget V2 completion and migration of all client packages.
- MYOB API integration for financial sync.
- SAH claims submission workflow and deadline alignment.
- AI anomaly detection model development and training.
- [AI Invoice V3](/initiatives/Supplier-Management/AI-Invoice-V3) classification system for line item categorisation.

---

## Out of Scope

- AI-based invoice line item classification (covered by [AI Invoice V3](/initiatives/Supplier-Management/AI-Invoice-V3)).
- Supplier portal invoice submission (covered by [Supplier Bill Submission](/initiatives/Supplier-Management/Supplier-Bill-Submission)).
- Express payment processing (covered by [Express Pay](/initiatives/Supplier-Management/Express-Pay)).
- Service delivery confirmation (covered by [QR Code Service Confirmation](/initiatives/Supplier-Management/QR-Code-Service-Confirmation)).
- Automatic classification without human confirmation.
- Supplier onboarding or credentialing workflows.


## Clarification Outcomes

### Q1: [Scope] What is the release timeline relative to dependent epics (AIV3, OHB)?
**Answer:** IV2 is the orchestration layer that defines the invoice pipeline. AIV3 (classification) and OHB (on-hold flow) are features that plug into this pipeline. IV2 should be delivered first or concurrently, as it establishes the statuses and transitions that AIV3 and OHB rely on. The existing `BillStageEnum` already has the core stages: `DRAFT`, `SUBMITTED`, `IN_REVIEW`, `APPROVED`, `PAYING`, `ON_HOLD`, `REJECTED`, `PAID`. IV2 extends this with query/dispute substates and auto-approval logic.

### Q2: [Dependency] What is the current state of invoice line item data quality?
**Answer:** The `BillItem` model has structured fields: `description`, `service_date`, `total_amount`, `service_unit_amount`, `service_hours`, `service_type_id`, `tax_rate_id`. The `ai_extraction` JSON column stores OCR/AI-extracted data. Data quality is variable — bills submitted via the API have structured data, while email-submitted bills rely on AI extraction. The SBS spec (Supplier Bill Submission) introduces email and public form submission channels that further vary data quality. **Recommendation:** IV2 should define minimum data quality requirements (mandatory fields) that gate entry to the auto-approval pathway.

### Q3: [Data] Is IV2 replacing the Bill entity or adding an Invoice entity?
**Answer:** IV2 uses the EXISTING `Bill` model (`app/Models/Bill/Bill.php`). The codebase consistently uses "Bill" not "Invoice" — the Bill model has `supplier_id`, `package_id`, `bill_stage`, `total_amount`, and `BillItem` children. IV2 adds capabilities to this existing model (anomaly detection results, query/dispute records, auto-approval status, MYOB sync status, claims status). There is NO separate Invoice entity — "Invoice" in the spec is used colloquially for what the codebase calls a "Bill."

### Q4: [Edge Case] What is the migration path from current workflow to V2?
**Answer:** The existing bill processing flow already has the core stages. IV2 adds: (1) AI anomaly detection as a background job on bill submission, (2) structured query/dispute as new related entities, (3) auto-approval as a rule engine that runs before manual review, (4) MYOB sync improvements, (5) SAH claims integration. These are additive features, not replacements. **Assumption:** No parallel-run period is needed — features can be progressively enabled via feature flags (Laravel Pennant is already in use). Auto-approval can start with a conservative threshold and widen.

### Q5: [Integration] Does V2 define the canonical invoice processing pipeline?
**Answer:** Yes. The spec explicitly states it "consolidates previously siloed invoice workflows into a unified system." All other epics plug into this pipeline: SBS (submission channel), AIV3 (classification engine), OHB (on-hold management), Express Pay (accelerated payment path). IV2 owns the pipeline stages and transitions. The `BillStageEnum` with its existing stages is the state machine. IV2 adds sub-states (queried, disputed) as related entity statuses rather than new bill stages.

### Q6: [Data] How are queries and disputes modeled? New entities or extensions?
**Answer:** The spec defines `InvoiceQuery` and `InvoiceDispute` as separate entities. The codebase does not have these yet. They should be new models: `bill_queries` and `bill_disputes` tables with FK to `bills`. This follows the OHB pattern where `bill_ohb_states` is a separate table with 1:1 relationship to bills. Queries and disputes are not bill stages — they are concurrent states (a bill can be in `IN_REVIEW` stage with an active query).

### Q7: [Dependency] What is the MYOB sync mechanism?
**Answer:** The codebase has `Domain\Myob\Models\MyobSyncLog` and `BillMyobSyncLogs.vue` for displaying sync history. Bills already sync to MYOB. IV2 enhances this with: automatic sync on approval (instead of manual), correcting entries for amendments, and CSV fallback (FR-012). The existing infrastructure is a solid foundation.

### Q8: [Scope] What is the SAH claims submission pipeline?
**Answer:** The `ServicesAustraliaInvoiceState` model (`domain/Bill/Models/ServicesAustraliaInvoiceState.php`) already tracks claims status. IV2 integrates approved bills into the claims batch with correct SAH category coding. This requires the AIV3 classification to be complete (correct Tier 1/2/3 categories) before claims submission. The dependency chain is: AIV3 classifies → IV2 validates → Claims batch submitted.

### Q9: [Data] The auto-approval criteria include "matching purchase order." Does the codebase have purchase orders?
**Answer:** No purchase order entity exists in the codebase. The matching is more likely against `BudgetPlanItem` (planned services) and `OrganisationPrice` (supplier price lists). **Recommendation:** Reword FR-004 to reference "matching budget plan item" instead of "matching purchase order" to align with the actual data model.

### Q10: [Performance] What is the expected invoice volume for auto-approval processing?
**Answer:** OHB spec states 5-6K bills/day. If auto-approval targets >40% of routine invoices (FR-005 success criterion), that is 2,000-2,400 auto-approvals per day. The auto-approval engine must run synchronously during bill submission or as a near-real-time job (<1 minute after submission). The existing `BillObserver` could trigger the auto-approval check.

### Q11: [Edge Case] Query and dispute on same invoice — the spec says they cannot coexist. Is this enforced at the data model level?
**Answer:** Yes, the edge case specifies "guide the user to resolve the query first or convert it to a dispute." This should be enforced as a business rule: if a bill has an active query (status = open), the dispute action is disabled with a message "Resolve query before raising dispute." A query can be converted to a dispute via a "Convert to Dispute" action.

### Q12: [Scope] How does duplicate invoice detection work?
**Answer:** FR-009 requires detecting potential duplicates. The codebase has `BillsEditDuplicateCheck.vue` and a `DuplicateBillTest.php`, confirming duplicate detection already exists. IV2 should enhance this with: same supplier + same amount + similar date (within 7 days) + similar line item descriptions. The existing implementation likely checks supplier + amount + date range.

## Refined Requirements

1. **FR-004 Correction**: Replace "matching purchase order" with "matching budget plan item" — the codebase uses `BudgetPlanItem`, not purchase orders.

2. **New AC for US4**: Given auto-approval criteria include a minimum supplier history threshold, When a new supplier submits their first invoice, Then the invoice is NOT auto-approved and routes to manual review regardless of other criteria.

3. **New Edge Case**: Given an invoice is auto-approved but later found to have an anomaly (false negative from AI), When a coordinator identifies the issue post-approval, Then the invoice can be reversed to `IN_REVIEW` status with full audit trail.

4. **NFR**: Auto-approval evaluation must complete within 60 seconds of bill submission to avoid blocking the processing queue.
