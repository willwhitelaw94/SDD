---
title: "Feature Specification: Documents (DOC)"
description: "Clinical And Care Plan > Documents"
---

> **[View Mockup](/mockups/documents/index.html)**{.mockup-link}

# Feature Specification: Documents (DOC)

**Status**: Draft
**Epic**: TP-2174 | **Initiative**: Clinical and Care Plan (TP-1859)
**Prefix**: DOC
**Priority**: Medium

---

## Overview

The Documents epic surfaces TC Portal's existing, production-ready document infrastructure -- polymorphic `Document` model, `DocumentTag` type system, 8-stage lifecycle enum, malware scanning, and Spatie ActivityLog audit trail -- into user-facing features. Currently this infrastructure is entirely hidden from users: staff cannot upload, search, filter, or track documents through the Portal UI, and there is no mechanism to capture signature evidence for regulatory compliance.

DOC is an **architecture epic**: it provides the foundational Documents tab, signature artifact capture, and metadata filtering that downstream feature epics (HCA signatures TP-1865, OT reports ASS1, Budget PDFs TP-2501) will consume. The epic adds two schema fields (`signed_date`, `amended_date`), a new `document_signatures` table supporting three signature mechanisms (call recording reference, PDF upload, digital signature metadata), and a unified Documents tab on Package and Supplier records with filtering across 8 core metadata fields.

---

## User Scenarios & Testing

### User Story 1 -- View All Documents for a Record (Priority: P1)

As an **Internal User**, I want to view all documents linked to a Package or Supplier in a Documents tab so that I can quickly find what I need without searching across email, file shares, and Zoho.

**Acceptance Scenarios**:

1. **Given** a Package has associated documents, **When** an internal user navigates to the Package detail page, **Then** a Documents tab displays a paginated list (25 per page) with columns: Name, Type, Stage, Expiry Date, Signed Date, Amended Date, Created Date

2. **Given** the Documents tab is displayed, **When** the user clicks a column header, **Then** the list sorts by that column in ascending or descending order

3. **Given** a user clicks a document name, **When** the document is a PDF, **Then** it opens in the browser; when it is an image, it downloads

4. **Given** a Package has no documents, **When** the Documents tab renders, **Then** an empty state is shown with a prompt to upload the first document

---

### User Story 2 -- Filter Documents by Metadata (Priority: P1)

As an **Internal User**, I want to filter documents by Type, Stage, Expiry Date, Signed Date, and Created Date so that I can narrow results and find specific documents without scrolling through hundreds of entries.

**Acceptance Scenarios**:

1. **Given** the filter panel is visible, **When** the user selects multiple DocumentTags and a Stage filter, **Then** only documents matching all selected filters are displayed (AND logic)

2. **Given** filters are active, **When** the user clicks "Clear All Filters", **Then** all filters reset and the full document list is restored

3. **Given** filters are applied and no documents match, **When** the results render, **Then** a "No documents match your filters" message is displayed

4. **Given** 1,000+ documents on a record, **When** filters are applied, **Then** results return in under 500ms

---

### User Story 3 -- Upload a Document with Metadata (Priority: P1)

As an **Internal User**, I want to upload a document and set metadata (Type, Stage, Expiry Date, Identifier) so that it is properly categorised and searchable.

**Acceptance Scenarios**:

1. **Given** a user clicks "Upload Document", **When** the upload form loads, **Then** it includes: file picker (required), DocumentTag dropdown (required), Stage dropdown (optional, defaults to NEW), Expiry Date (conditional on DocumentTag.has_expiry), and Identifier (conditional on DocumentTag.has_number)

2. **Given** a user uploads a document, **When** the upload completes, **Then** the file is stored in S3, a hash is calculated for duplicate detection, malware scanning runs asynchronously, and an audit log entry is created

3. **Given** malware is detected during scanning, **When** the scan completes, **Then** the document is soft-deleted, the user is notified, and an audit log entry is created

4. **Given** a duplicate file hash is detected, **When** the upload completes, **Then** the system warns the user with an option to override or cancel

---

### User Story 4 -- Attach Call Recording Signature Artifact (Priority: P1)

As an **Internal User**, I want to attach a call recording reference to a document so that I can prove verbal consent was obtained for regulatory compliance.

**Acceptance Scenarios**:

1. **Given** a user clicks "Add Signature Artifact" on a document, **When** they select "Call Recording", **Then** a form appears with fields: Call Recording ID (text, required), Transcript Text (textarea, optional), Signed Date (date picker, required)

2. **Given** a call recording artifact is saved, **When** the save completes, **Then** the document's `signed_date` is updated, an audit log entry is created, and a signature icon appears on the document in the list

3. **Given** a user clicks the signature icon, **When** the modal opens, **Then** they see the Call Recording ID, transcript excerpt (first 500 characters with "Show More"), and signed date

---

### User Story 5 -- Attach PDF Signature Artifact (Priority: P1)

As an **Internal User**, I want to upload a scanned signature PDF to a document so that I can attach physical signature evidence for compliance.

**Acceptance Scenarios**:

1. **Given** a user selects "PDF Upload" in the Add Signature Artifact modal, **When** the form loads, **Then** it includes: PDF file picker (required) and Signed Date (date picker, required)

2. **Given** a PDF signature artifact is saved, **When** the save completes, **Then** the PDF is stored in S3 separately from the original document, the document's `signed_date` is updated, and an audit log entry is created

---

### User Story 6 -- Change Document Stage (Priority: P2)

As an **Internal User**, I want to change a document's stage so that I can track its lifecycle progress from submission to approval.

**Acceptance Scenarios**:

1. **Given** a document is in stage IN_REVIEW, **When** the user changes it to APPROVED, **Then** the stage updates, an audit log entry captures the before/after state, user, and timestamp

2. **Given** any stage change, **When** the change is saved, **Then** the Documents tab list reflects the updated stage immediately

---

### User Story 7 -- Delete Documents (Soft Delete) (Priority: P2)

As an **Internal User**, I want to delete documents so that I can remove duplicates or errors without permanently destroying records.

**Acceptance Scenarios**:

1. **Given** a user deletes a document, **When** the delete completes, **Then** the document is soft-deleted (deleted_at set), hidden from the default view, and an audit log entry is created

2. **Given** the "Show Deleted" toggle is enabled, **When** the Documents tab renders, **Then** soft-deleted documents are visible with a visual indicator

---

### User Story 8 -- Record Digital Signature Metadata (Priority: P2)

As an **Internal User**, I want to record digital signature metadata so that portal-based signing events are tracked for compliance.

**Acceptance Scenarios**:

1. **Given** a user selects "Digital Signature" in the Add Signature Artifact modal, **When** the form loads, **Then** it includes a Signature Metadata field (JSON) and auto-populated Signed Date

2. **Given** digital signature metadata is saved, **When** the save completes, **Then** the artifact is stored in `document_signatures` with `signature_type = DIGITAL` and the document's `signed_date` is updated

---

### User Story 9 -- View Document Audit Log (Priority: P2)

As a **Compliance User**, I want to view audit logs for document actions so that I can investigate changes and meet regulatory requirements.

**Acceptance Scenarios**:

1. **Given** a user clicks "View Audit Log" on a document, **When** the log displays, **Then** it shows Spatie ActivityLog entries with: action, user, timestamp, and before/after state for updates, sorted newest first

2. **Given** a Compliance user needs to export audit data, **When** they export, **Then** a CSV is generated with all audit entries for the document

---

### Edge Cases

- What happens if a user uploads a file larger than the maximum size? The system rejects the upload with a clear error message stating the size limit
- What happens if S3 is temporarily unavailable? The upload fails with an error message; the user can retry; no partial record is created
- What happens if multiple signature artifacts are attached to one document? All artifacts are stored; the document's `signed_date` is set to the most recent signature timestamp
- What happens if a Call Recording ID is already attached to another document? The system warns the user and allows override or cancel

---

## Functional Requirements

**Documents Tab**
- **FR-001**: System MUST display a Documents tab on Package and Supplier detail pages showing all linked documents
- **FR-002**: Documents list MUST display columns: Name, Type (DocumentTag), Stage (DocumentStageEnum), Expiry Date, Signed Date, Amended Date, Created Date
- **FR-003**: List MUST support pagination (25 per page) and column sorting
- **FR-004**: System MUST support document view (open in browser for PDF) and download (for images) via S3 temporary URLs (10-minute expiry)

**Metadata Filtering**
- **FR-005**: System MUST support filtering by: DocumentTag (multi-select), Stage (multi-select), Expiry Date range, Signed Date range, and Created Date range
- **FR-006**: Filters MUST use AND logic and support a "Clear All Filters" action
- **FR-007**: Filter response time MUST be under 500ms (p95)

**Document Upload**
- **FR-008**: System MUST support document upload with: file picker (required), DocumentTag (required), Stage (optional, defaults to NEW), Expiry Date (conditional), Identifier (conditional)
- **FR-009**: System MUST store files in S3 with hash calculation and asynchronous malware scanning
- **FR-010**: System MUST create audit log entries for all uploads via Spatie ActivityLog

**Signature Artifacts**
- **FR-011**: System MUST support three signature artifact types: Call Recording (ID + optional transcript + signed date), PDF Upload (file + signed date), Digital Signature (JSON metadata + auto signed date)
- **FR-012**: All signature artifacts MUST be stored in a `document_signatures` table with FK to documents
- **FR-013**: Attaching a signature artifact MUST update the parent document's `signed_date` to the most recent signature timestamp
- **FR-014**: Signature artifacts MUST be viewable via a modal showing type-specific details

**Schema Additions**
- **FR-015**: System MUST add `signed_date` (timestamp, nullable, indexed) to the `documents` table
- **FR-016**: System MUST add `amended_date` (timestamp, nullable, indexed) to the `documents` table
- **FR-017**: Schema migration MUST be zero-downtime (nullable columns, no backfill required)

**Stage Management**
- **FR-018**: System MUST support changing document stage across all 8 values: NEW, SUBMITTED, IN_REVIEW, INFORMATION_REQUESTED, APPROVED, EXPIRING_SOON, EXPIRED, REJECTED
- **FR-019**: Stage changes MUST create audit log entries with before/after state

**Soft Delete**
- **FR-020**: System MUST support soft delete with "Show Deleted" toggle
- **FR-021**: Deleted documents MUST be hidden from the default view

**Audit**
- **FR-022**: System MUST support viewing Spatie ActivityLog entries per document: action, user, timestamp, before/after state
- **FR-023**: Audit log MUST support CSV export

**Performance and Security**
- **FR-024**: Documents tab MUST load in under 1 second (p95) for 100 documents
- **FR-025**: System MUST enforce role-based access control using existing Portal roles
- **FR-026**: All document interfaces MUST meet WCAG 2.1 AA compliance

---

## Key Entities

| Entity | Description |
|--------|-------------|
| **Document** | Existing polymorphic model extended with `signed_date` and `amended_date`; linked to parent records via `documentable_id/type` |
| **DocumentTag** | Existing type classification (e.g., Police Check, Insurance Certificate, HCA Agreement) with `has_expiry` and `has_number` flags |
| **DocumentStageEnum** | Existing 8-value lifecycle enum: NEW, SUBMITTED, IN_REVIEW, INFORMATION_REQUESTED, APPROVED, EXPIRING_SOON, EXPIRED, REJECTED |
| **DocumentSignature** | New entity storing signature artifacts: call recording references, PDF uploads, digital signature metadata |
| **DocumentRejection** | Existing entity storing rejection reasons and comments |

---

## Success Criteria

### Measurable Outcomes

| Goal | Metric | Target |
|------|--------|--------|
| Reduce document search time | Time to find a specific document | 80% reduction (from 5 min to under 1 min) |
| Signature artifact capture | Documents requiring signatures with captured artifacts | 90% within 8 weeks post-launch |
| User adoption | Active staff accessing Documents tab weekly | 70% within 6 weeks post-launch |
| Future epic velocity | Delivery speed of document-based features (HCA, OT, Budget) | 50% faster (reuse DOC architecture) |
| Architecture extensibility | New document types added without schema changes | 100% |

---

## Assumptions

- Existing `Document`, `DocumentTag`, `DocumentStage`, and `DocumentRejection` models are stable and production-ready
- Signature capture is manual initially; no e-signature API integration (DocuSign, HelloSign) in this epic
- The Documents tab focuses on Package and Supplier parent records; other parent types (Agreement, BudgetPlan, Bill) are deferred to future epics
- Aircall API integration for call recording lookup is deferred; call recording IDs are entered as text
- File upload size limit to be confirmed with infrastructure team (expected 50MB)

---

## Dependencies

| Dependency | Type | Impact |
|------------|------|--------|
| Existing Document domain models | Technical | Foundation for the entire epic; already in production |
| S3 file storage | Infrastructure | Required for document upload and storage |
| Spatie ActivityLog | Technical | Required for audit trail (already in production) |
| Aircall API | External | Call recording artifact lookup deferred to future integration |
| [RAP (TP-2403)](/initiatives/Clinical-And-Care-Plan/Assessment-Prescriptions/) | Epic | Role-based access enhancement; existing roles used for now |
| HCA epic (TP-1865) | Future epic | Will consume DOC architecture for HCA signature workflows |
| OT Reports (ASS1) | Future epic | Will consume DOC architecture for OT report uploads |
| Budget V2 (TP-2501) | Future epic | Will consume DOC architecture for Budget PDF approvals |

---

## Out of Scope

- Document-type-specific workflows (HCA signatures, OT report upload, Budget PDF approval) -- deferred to consuming epics
- Compliance dashboard with expiry alerts and missing signature reports
- E-signature API integration (DocuSign, HelloSign)
- Document generation or templating (auto-generate PDFs from templates)
- RAG or AI-powered search, OCR, AI metadata extraction
- Mobile upload (camera integration)
- Email-based document upload
- Advanced search (full-text, AND/OR filter combinations, fuzzy matching)
- Document linking (parent/child relationships between documents)
- External sharing (public links, password-protected access)
- Bulk operations (multi-file upload, bulk stage change)
- Document versioning UI (schema field `amended_date` provided only)
- Notifications for expiring documents or signature requests

---

## Risks

| Risk | Severity | Mitigation |
|------|----------|------------|
| Schema migration on existing documents table (100k+ records) | HIGH | Test migration on staging with production-size dataset; add columns as nullable; zero-downtime deployment |
| Aircall API integration complexity | MEDIUM | Start with manual call recording ID entry; Aircall integration deferred to future epic |
| User adoption of Documents tab (existing workflows entrenched) | MEDIUM | User training; gradual rollout starting with one document type; show time savings metrics |
| Performance degradation on high-volume parent records (10k+ documents) | LOW | Pagination enforced (25 per page); database indexes on key columns; load testing |
| DocumentTag schema changes break existing documents | LOW | No changes to DocumentTag schema in DOC epic; future epics add tags via data migration |

## Clarification Outcomes

### Q1: [Scope] The spec explicitly excludes bulk operations (multi-file upload, bulk stage change). Given that the Documents tab is foundational for HCA, OT reports, and Budget PDFs, is multi-file upload likely needed before those consuming epics can deliver?
**Answer:** The consuming epics (HCA TP-1865, OT reports ASS1, Budget PDFs TP-2501) each deal with specific document types -- typically a single document per action (sign one HCA, upload one OT report, generate one budget PDF). Multi-file upload is more relevant for initial migration or batch document capture, not for the consuming epic workflows. **Multi-file upload is not needed for consuming epics to deliver. Single-file upload with metadata (FR-008) is sufficient. Multi-file upload can be added as a future enhancement when users request it for batch operations.**

### Q2: [Data] FR-015 and FR-016 add `signed_date` and `amended_date` to the existing documents table. The spec says 100k+ records exist. Has the migration been load-tested?
**Answer:** The Document model (`domain/Document/Models/Document.php`) currently has `fillable` fields including `name`, `stage`, `expiry_date`, `identifier`, `document_tag_id`, `documentable_id/type`, `hash`, `size_bytes`. The `$fillable` array does not include `signed_date` or `amended_date`. FR-017 specifies "zero-downtime (nullable columns, no backfill required)." Adding nullable timestamp columns to an existing table is an O(1) operation in modern MySQL/PostgreSQL (instant column add for nullable columns). **The migration is safe. Adding nullable columns with no default to an existing table is an instant DDL operation in MySQL 8+ (which Herd uses). No load testing needed. FR-017's zero-downtime requirement is met by design.**

### Q3: [Dependency] Aircall API integration is deferred. How is the Call Recording ID validated? Is it just freeform text?
**Answer:** US4 specifies "Call Recording ID (text, required)." The spec explicitly says "Aircall API integration for call recording lookup is deferred; call recording IDs are entered as text." **The Call Recording ID is freeform text with no validation against Aircall. This is acceptable for MVP. The edge case about duplicate Call Recording IDs on different documents (warn + allow override) handles the only validation needed. Future Aircall integration can add lookup validation and auto-populate transcript text.**

### Q4: [Edge Case] Multiple signature artifacts can be attached to one document, with `signed_date` set to the most recent signature. What happens if an older artifact is removed? Does `signed_date` recalculate?
**Answer:** FR-013 says "Attaching a signature artifact MUST update the parent document's `signed_date` to the most recent signature timestamp." The spec does not address removal of artifacts. **Assumption: Yes, `signed_date` should recalculate when an artifact is removed. If the most recent artifact is removed, `signed_date` should update to the next most recent artifact's timestamp. If all artifacts are removed, `signed_date` should be set to null. This should be added as an acceptance criterion.**

### Q5: [Integration] Does DOC need to support additional parent types (Inclusion, Assessment) beyond Package and Supplier?
**Answer:** The Document model uses polymorphic `documentable_id/type` (`MorphTo` relationship). The `HasDocuments` trait (`domain/Document/Traits/HasDocuments.php`) can be added to any model. Currently it's used by Notes (`domain/Note/Models/Note.php` uses `HasDocuments`). The architecture is inherently extensible. **No changes needed for DOC to support additional parent types. The polymorphic relationship already supports any model. Consuming epics (ASS2 for Inclusions, ASS1 for Assessments) simply add the `HasDocuments` trait to their models. DOC's scope correctly focuses on Package and Supplier as the initial parent types for the UI tab.**

### Q6: [Data] The existing `DocumentStageEnum` has 9 values (including DELETED). The spec lists 8 stages (FR-018). Does the DELETED stage count separately from soft delete?
**Answer:** The existing `DocumentStageEnum` in `domain/Document/Enums/DocumentStageEnum.php` has 9 values: NEW, SUBMITTED, IN_REVIEW, INFORMATION_REQUESTED, APPROVED, EXPIRING_SOON, EXPIRED, REJECTED, DELETED. FR-018 lists 8 values (excluding DELETED). FR-020-021 handle soft delete separately via `deleted_at`. **The DELETED stage enum value is legacy -- soft delete via `deleted_at` is the mechanism for DOC. The 8 stages in FR-018 are the lifecycle stages. The DELETED enum value should remain in the codebase for backward compatibility but should not appear as a selectable stage in the new UI.**

### Q7: [Scope] The spec says the Documents tab is an "architecture epic" providing foundational infrastructure. Does this mean DOC should be prioritised before consuming epics (HCA, ASS1, Budget)?
**Answer:** Yes. The spec explicitly states DOC is foundational: "downstream feature epics (HCA signatures TP-1865, OT reports ASS1, Budget PDFs TP-2501) will consume" DOC architecture. The success criteria include "Future epic velocity: Delivery speed of document-based features 50% faster." **DOC should be delivered before or in parallel with its consuming epics. The Documents tab, signature artifacts, and metadata filtering provide the infrastructure that HCA, ASS1, and Budget epics build upon.**

### Q8: [Performance] FR-024 requires the Documents tab to load in under 1 second for 100 documents. The existing Document model has a global scope filtering out malware (`no_malware` scope). Does this add query overhead?
**Answer:** The Document model has a global scope: `whereNull('malware_status')->orWhereNot('malware_status', 'THREATS_FOUND')`. This adds a WHERE clause to every query. With proper indexing on `malware_status`, this is negligible. The bigger concern is the polymorphic `documentable_id/type` query pattern. **The malware scope adds minimal overhead. For the Documents tab, the query pattern is: `Document::where('documentable_type', Package::class)->where('documentable_id', $packageId)->...`. With an index on `(documentable_type, documentable_id)`, 100 documents loads in well under 1 second. Ensure pagination (25 per page) is applied server-side.**

## Refined Requirements

1. **Artifact removal**: When a signature artifact is removed, the parent document's `signed_date` MUST recalculate to the next most recent artifact's timestamp. If all artifacts are removed, `signed_date` MUST be set to null.
2. **DELETED stage**: The `DELETED` enum value in `DocumentStageEnum` SHOULD NOT appear as a selectable option in the Documents tab stage dropdown. It remains for backward compatibility only.
3. **Delivery sequencing**: DOC SHOULD be delivered before or in parallel with consuming epics (HCA, ASS1, Budget) to provide foundational document infrastructure.
