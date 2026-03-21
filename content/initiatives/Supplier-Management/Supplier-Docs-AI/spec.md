---
title: "Feature Specification: Supplier Docs AI (SDOC)"
---

> **[View Mockup](/mockups/supplier-docs-ai/index.html)**{.mockup-link}

**Status**: Draft
**Epic**: SDOC | **Initiative**: Supplier Management (TP-1857)
**BRP Priority**: P2

---

## Overview

Supplier Docs AI (SDOC) introduces AI-powered document processing for supplier compliance documents within the Trilogy Care Portal. Currently, supplier documentation such as ABN certificates, insurance policies, police checks, and qualifications requires manual verification, with expiry dates tracked in spreadsheets and compliance gaps discovered reactively.

SDOC leverages the existing AI extraction pipeline (shared infrastructure with AI Invoice V3) to automate document classification, key data extraction, validation against external sources, and proactive expiry monitoring. The system provides a centralized compliance dashboard showing document status across the entire supplier portfolio, replacing reactive compliance management with proactive, automated workflows.

---

## User Scenarios & Testing

### User Story 1 - Automatic Document Classification (Priority: P1)

As a Compliance Officer, I want uploaded supplier documents to be automatically classified by type so that I do not need to manually identify and categorize each document.

**Acceptance Scenarios**:
1. **Given** a supplier uploads a document to the portal, **When** the AI processes the document, **Then** it classifies the document as one of the supported types: insurance policy, ABN certificate, police check, qualification certificate, or other.
2. **Given** the AI classifies a document, **When** the confidence score is above the threshold (e.g., 85%), **Then** the classification is applied automatically and displayed to the user.
3. **Given** the AI classifies a document with low confidence (<85%), **When** the classification is displayed, **Then** it is flagged for manual review with the AI's best guess shown as a suggestion.
4. **Given** a document type is unrecognised, **When** the AI cannot classify it, **Then** the document is placed in a manual review queue with status "Unclassified".

### User Story 2 - Key Data Extraction (Priority: P1)

As a Compliance Officer, I want key fields to be automatically extracted from supplier documents so that I do not need to manually enter expiry dates, coverage amounts, or ABN numbers.

**Acceptance Scenarios**:
1. **Given** an insurance policy is uploaded, **When** the AI processes it, **Then** it extracts: policy number, insurer name, coverage amount, start date, expiry date, and insured party name.
2. **Given** an ABN certificate is uploaded, **When** the AI processes it, **Then** it extracts: ABN number, entity name, GST registration status, and ABN registration date.
3. **Given** a police check certificate is uploaded, **When** the AI processes it, **Then** it extracts: check reference number, check date, expiry date, and individual name.
4. **Given** extracted data is available, **When** a Compliance Officer reviews it, **Then** they can confirm or correct the extracted values before they are saved to the supplier record.

### User Story 3 - External Validation (Priority: P1)

As a Compliance Officer, I want extracted data to be cross-checked against external sources so that I can trust the accuracy of supplier-provided documents.

**Acceptance Scenarios**:
1. **Given** an ABN number is extracted from a document, **When** the system validates it, **Then** it queries the ABN Lookup API and confirms the ABN is active and matches the supplier's legal name.
2. **Given** ABN validation fails (inactive ABN or name mismatch), **When** the result is displayed, **Then** the document is flagged with a validation warning and the discrepancy details are shown.
3. **Given** ABN validation succeeds, **When** the result is displayed, **Then** a green verification badge is shown on the document record.

### User Story 4 - Proactive Expiry Monitoring (Priority: P1)

As a Compliance Officer, I want to receive automated alerts before supplier documents expire so that I can proactively manage compliance renewals.

**Acceptance Scenarios**:
1. **Given** a document has an extracted expiry date, **When** the date is 90 days away, **Then** the document status changes to "Expiring Soon" on the compliance dashboard.
2. **Given** a document is 60 days from expiry, **When** the alert fires, **Then** an automated reminder email is sent to the supplier requesting document renewal.
3. **Given** a document is 30 days from expiry, **When** the alert fires, **Then** a second reminder is sent to the supplier and the Compliance Officer is notified.
4. **Given** a document passes its expiry date, **When** the expiry is detected, **Then** the document status changes to "Expired", the supplier is notified, and the associated service verification status is updated.

### User Story 5 - Compliance Dashboard (Priority: P2)

As a Compliance Manager, I want a centralized dashboard showing document status across all suppliers so that I can quickly identify compliance gaps and take action.

**Acceptance Scenarios**:
1. **Given** the compliance dashboard is loaded, **When** viewed, **Then** it shows document status counts: valid, expiring soon, expired, and missing, filterable by supplier, document type, and service type.
2. **Given** a supplier has an expired document, **When** viewing the dashboard, **Then** the supplier row is highlighted with an alert indicator.
3. **Given** multiple suppliers have expiring documents, **When** viewing the dashboard, **Then** they are sorted by urgency (nearest expiry first).

### Edge Cases

- **Document quality too low for AI processing**: System falls back to manual classification with a notification to the uploader to re-upload a clearer copy.
- **ABN API rate limit reached**: System queues validation requests and processes them in the next batch cycle; cached results are used where available.
- **Non-standard document format**: Document is flagged for manual review; confidence score is set to zero with a note explaining the limitation.
- **Multiple documents in a single upload**: System attempts to detect multi-page/multi-document uploads and flags for manual separation if detected.
- **Duplicate document upload**: System detects duplicates by content hash and alerts the user, offering to replace the existing document or keep both.

---

## Functional Requirements

- **FR-001**: System MUST automatically classify uploaded supplier documents into supported types: insurance policy, ABN certificate, police check, qualification certificate, or other.
- **FR-002**: System MUST extract key data fields from each document type (expiry dates, coverage amounts, ABN numbers, certificate details).
- **FR-003**: System MUST provide a confidence score for each classification and extraction result.
- **FR-004**: System MUST flag documents with low confidence for manual review.
- **FR-005**: System MUST validate extracted ABN numbers against the ABN Lookup API.
- **FR-006**: System MUST display validation results (pass/fail/warning) on document records.
- **FR-007**: System MUST monitor document expiry dates and change status at configurable thresholds (90/60/30 days).
- **FR-008**: System MUST send automated reminder emails to suppliers at configurable intervals before document expiry.
- **FR-009**: System MUST update associated service verification status when a document expires.
- **FR-010**: System MUST provide a centralized compliance dashboard with filtering by supplier, document type, service type, and status.
- **FR-011**: System MUST allow Compliance Officers to confirm or correct AI-extracted data before saving.
- **FR-012**: System MUST maintain an audit trail of all document processing actions (classification, extraction, validation, manual corrections).
- **FR-013**: System SHOULD support batch processing of validation requests to manage API rate limits.
- **FR-014**: System SHOULD detect and flag duplicate document uploads.

---

## Key Entities

- **Supplier Document**: A compliance document uploaded by or for a supplier. Fields: `id`, `supplier_id` (FK), `document_type` (enum: insurance, abn_certificate, police_check, qualification, other), `file_reference`, `upload_date`, `classification_confidence`, `status` (enum: pending_review, valid, expiring_soon, expired, rejected), `expiry_date`, `extracted_data` (JSON), `validation_status`, standard audit fields.
- **Extracted Data**: Structured JSON containing type-specific fields (e.g., `policy_number`, `coverage_amount`, `abn`, `gst_status`, `check_reference`, `insurer_name`).
- **Validation Result**: Record of external validation attempts. Fields: `document_id` (FK), `validation_source` (e.g., ABN Lookup), `result` (pass/fail/warning), `details` (JSON), `validated_at`.
- **Expiry Alert**: Scheduled alert record. Fields: `document_id` (FK), `alert_type` (90_day/60_day/30_day/expired), `sent_at`, `recipient_type` (supplier/officer).

---

## Success Criteria

### Measurable Outcomes

- **SC-001**: Document classification accuracy >= 90%.
- **SC-002**: Data extraction accuracy >= 85%.
- **SC-003**: Manual review time reduced by 70%.
- **SC-004**: Compliance gaps detected proactively >= 95% (versus reactively after lapse).
- **SC-005**: Manual document review time reduced from estimated 2-3 hours/week to under 1 hour/week.

---

## Assumptions

- The existing AI extraction pipeline from AI Invoice V3 (AIV3) can be adapted for supplier document processing with minimal additional infrastructure.
- Standard document formats are used for the majority of compliance documents (PDF, images).
- ABN Lookup API is available, reliable, and provides sufficient rate limits for the supplier volume.
- Suppliers upload documents in sufficient quality for AI processing in most cases.
- Confidence thresholds can be tuned iteratively based on real-world accuracy data.

---

## Dependencies

- **AI Invoice V3 (AIV3)**: Shared AI extraction engine and infrastructure.
- **Supplier Onboarding (SON/SOP2)**: Document upload flow integration.
- **ABN Lookup API**: External validation service for ABN verification.
- **Notification infrastructure**: Email delivery for supplier reminders and officer alerts.
- **Compliance Matrix**: Source of truth for required document types per service.
- [Supplier Service Verification Features (SVF)](/initiatives/Supplier-Management/Supplier-Service-Verification-Features/spec) for service-level compliance status updates.

---

## Out of Scope

- AI-powered document generation or auto-fill for suppliers.
- Insurance database lookups beyond ABN validation (future phase).
- Automated compliance remediation actions.
- Document editing or annotation within the portal.
- Historical backfill of legacy documents (handled as a separate migration task).
- Integration with external document management systems.


## Clarification Outcomes

### Q1: [Scope] What documents are processed with AI?
**Answer:** The spec is explicit — SUPPLIER COMPLIANCE DOCUMENTS: insurance policies, ABN certificates, police checks, and qualification certificates (FR-001). NOT invoices (that is AIV3) and NOT assessment reports (that is ASS1). The use cases are: auto-classification of document type, extraction of key fields (expiry dates, policy numbers, coverage amounts, ABN), validation against external sources (ABN Lookup API), and proactive expiry monitoring. The `SupplierDocument` model already exists with `DocumentTypeEnum` (PUBLIC_LIABILITY, ABN_VERIFICATION, WORKERS_COMP, PROFESSIONAL_INDEMNITY, POLICE_CHECK, AHPRA, NDIS_SCREENING).

### Q2: [Dependency] Does this share AI infrastructure with AIV3?
**Answer:** The spec states "leverages the existing AI extraction pipeline (shared infrastructure with AI Invoice V3)." The assumption is correct — both SDOC and AIV3 use document processing AI (OCR + extraction). AIV3 processes invoice PDFs to extract line items. SDOC processes compliance document PDFs to extract metadata. The underlying AI service (OCR + field extraction) should be shared. **Recommendation:** Build a shared `DocumentIntelligenceService` that both epics consume, with type-specific extraction rules.

### Q3: [Data] What metadata is extracted?
**Answer:** The spec defines type-specific extraction fields: Insurance → policy number, insurer name, coverage amount, start date, expiry date, insured party name. ABN certificate → ABN, entity name, GST status, registration date. Police check → reference number, check date, expiry date, individual name. These map well to the existing `SupplierDocument` model which has `expires_at` and `DocumentTypeEnum`. The extracted data would be stored in a JSON column (`extracted_data`) on `SupplierDocument`, matching the pattern used for `ai_extraction` on `BillItem`.

### Q4: [Edge Case] What is the accuracy target?
**Answer:** SC-001: classification accuracy >= 90%. SC-002: extraction accuracy >= 85%. FR-003 requires confidence scores per classification/extraction. FR-004 flags low-confidence results for manual review. US2 AC4 allows compliance officers to "confirm or correct extracted values before they are saved." This is a reasonable human-in-the-loop approach — AI extracts, human confirms. The existing `SupplierDocument` has `status` (via `DocumentStatusEnum`) and `reviewed_by`/`reviewed_at` fields, confirming the review workflow is already modeled.

### Q5: [Integration] Does SDOC integrate with the existing document infrastructure?
**Answer:** SDOC uses the `SupplierDocument` model directly. The existing model has `file_path`, `original_filename`, `mime_type`, `file_size_bytes`, `status`, `rejection_reason`, `reviewed_by`, `reviewed_at`, `expires_at`. SDOC extends this with AI-extracted metadata (`extracted_data` JSON), classification confidence, and validation results. The `DocumentScopeEnum` provides scoping (organisation-level vs service-level). This is well-aligned.

### Q6: [Dependency] ABN Lookup API integration — does this already exist?
**Answer:** Yes. The codebase has `AbrService` (`domain/Supplier/Services/V2/AbrService.php`) and `AbnLookupController` (`domain/Supplier/Http/Controllers/V2/AbnLookupController.php`) plus registration actions `LookupAbnAction` and `CheckAbnExistsAction`. The ABR (Australian Business Register) API integration is already built for supplier registration. SDOC can reuse this service for ABN validation (FR-005). No new API integration needed.

### Q7: [Data] Expiry monitoring cadence — how does this interact with SVF?
**Answer:** SDOC FR-007/FR-008 define expiry monitoring at 90/60/30 day thresholds with automated emails. SVF FR-004/FR-011 define automatic status change to "Expired" and reminders at 30/7 day thresholds. These overlap. **Recommendation:** SDOC should own the AI extraction and validation pipeline. SVF should own the expiry monitoring and compliance status management. The division: SDOC extracts the expiry date from the document → stores it on `SupplierDocument.expires_at` → SVF's scheduled job checks expiry dates and sends notifications. This avoids duplicate monitoring.

### Q8: [Performance] How many documents are processed?
**Answer:** With ~15,000 suppliers and an average of 3-5 compliance documents per supplier, the document volume is 45,000-75,000 documents. Most are uploaded during onboarding/recontracting (burst) with ongoing renewal uploads (steady state). AI processing should be async (queued job) with results available within minutes. The ABN Lookup API has rate limits — FR-013 addresses this with batch processing.

### Q9: [Scope] The compliance dashboard (US5) — does this overlap with SAP and SVF dashboards?
**Answer:** Yes. SDOC's compliance dashboard shows document status (valid/expiring/expired/missing). SVF's compliance dashboard shows verification status. SAP's compliance dashboard shows audit status. **Recommendation:** Unify into a single compliance dashboard with views: "Documents" (SDOC), "Verification" (SVF), "Audits" (SAP). This prevents compliance officers from checking three separate dashboards.

### Q10: [Edge Case] Duplicate document upload — how is this detected?
**Answer:** FR-014 states "detect and flag duplicate document uploads." The spec suggests content hash comparison. The `SupplierDocument` model would need a `content_hash` column. When a new document is uploaded, compute SHA-256 of the file and check against existing documents for the same supplier.

## Refined Requirements

1. **Responsibility Split with SVF**: SDOC owns AI extraction and validation. SVF owns expiry monitoring and compliance status management. SDOC writes `expires_at` to `SupplierDocument`; SVF reads it for monitoring.

2. **Dashboard Unification**: SDOC's compliance dashboard (US5) should be a tab/view within a unified compliance dashboard shared with SVF and SAP.

3. **New AC for US1**: Given a supplier uploads a multi-page PDF that contains two different document types (e.g., insurance certificate and police check in one scan), When AI processes it, Then the system detects multiple documents and flags for manual separation.

4. **Reuse Existing Infrastructure**: ABN validation should call the existing `AbrService` rather than building a new integration. This is already confirmed in the codebase.
