---
title: "PRD: Document Repository & Signature Architecture (DOC)"
---

# PRD: Document Repository & Signature Architecture (DOC)

**Epic**: TP-2174
**Initiative**: TP-1859 Clinical & Care Plan
**Status**: Draft
**Version**: 1.0
**Last Updated**: 2025-11-18

**Team**:
- BA/Requirements: David
- Product Owner/SME: Romi
- Tech Lead: Khoa
- Architecture: To be assigned

---

## 1. Problem Statement

TC Portal has production-ready document infrastructure (`Document`, `DocumentTag`, `DocumentStage` models) deployed across packages, agreements, bills, and budget plans—but this infrastructure remains entirely hidden from users. Staff cannot:

- **Access documents** - No user-facing UI to view, upload, or search documents on parent records (Package, Supplier, etc.)
- **Capture signatures** - No mechanism to record when documents are signed, how they were signed (call recording, PDF upload, digital), or track signature artifacts
- **Filter by metadata** - Existing 8-stage lifecycle tracking (NEW, SUBMITTED, IN_REVIEW, APPROVED, EXPIRED, etc.) is inaccessible
- **Track document amendments** - No visibility into when documents were last amended or version history

**Impact**:
- **90% of document search time is wasted** navigating disconnected systems (email, file shares, Zoho)
- **Regulatory compliance risk** from missing signature evidence for HCA agreements, OT reports, and budget approvals
- **Audit trail gaps** when staff cannot prove when/how documents were signed
- **Delayed invoice processing** when billing staff cannot locate supporting documents

**Root Cause**: The existing Document domain is **architecturally sound** (polymorphic relationships, soft deletes, malware scanning, audit logging via Spatie ActivityLog) but lacks:
1. User-facing Documents tab on parent records
2. Signature capture workflows (call recording artifacts, PDF uploads, digital signatures)
3. Schema fields for `signed_date` and `amended_date`
4. Metadata filtering UI leveraging existing stage enum and expiry_date

This epic surfaces the hidden infrastructure with minimal new development—reusing existing models, stages, and relationships.

---

## 2. Goals & Success Metrics

### Goals

1. **Surface existing document infrastructure** via unified Documents tab on parent records (Package, Supplier)
2. **Establish signature capture architecture** supporting 3 mechanisms: call recordings, PDF uploads, digital signatures
3. **Enable metadata filtering** using existing 8 stages, expiry_date, document type, and new signed_date/amended_date fields
4. **Provide foundation for future document workflows** (HCA signatures, OT reports, Budget PDFs) without prescribing specific workflows

### Success Metrics

| Metric | Target | Measurement Window |
|--------|--------|-------------------|
| Document search time reduction | -80% (from 5min to <1min) | 4 weeks post-launch |
| Signature artifact capture rate | 90% of documents requiring signatures | 8 weeks post-launch |
| User adoption of Documents tab | 70% of active staff access Documents tab weekly | 6 weeks post-launch |
| Future epic velocity | 50% faster delivery of document-based features | 3 months post-launch |

**Success = Architecture Supports**:
- ✅ Future epics can add document types (HCA, OT Report, Budget PDF) without schema changes
- ✅ Signatures captured via 3 mechanisms and stored as verifiable artifacts
- ✅ All documents accessible via unified Documents tab with common metadata filters
- ✅ Document lifecycle tracking (8 stages) visible to users

---

## 3. User Personas

### Primary Persona: Internal User

**Role**: Generic internal staff (Care Partners, Finance, Compliance, Operations)

**Core Needs**:
- Upload documents and associate with parent records (Package, Supplier)
- Attach signature artifacts (call recording reference, PDF upload, digital signature)
- Filter/search documents by metadata (type, stage, expiry date, signed date, amended date)
- Change document stage (NEW → SUBMITTED → IN_REVIEW → APPROVED, etc.)
- View audit trail for document actions (who uploaded, when, what changed)

**Out of Scope for DOC Epic**:
- Detailed persona-based workflows (Care Coordinator vs Finance vs Compliance)
- Document-type-specific stages or validation rules
- Bulk operations or advanced search (AND/OR filters, full-text search)
- Notifications or expiry alerts
- Document generation or templating

**Why Generic?**
This is an **architecture epic**—future epics (HCA signatures TP-1865, OT reports TP-1904-ASS1, Budget PDFs TP-2501) will define persona-specific workflows. DOC provides the foundational UI and data model.

---

## 4. Functional Requirements

| Title | User Story | Acceptance Criteria | Priority |
|-------|-----------|---------------------|----------|
| **4.1 Documents Tab on Parent Records** | As an internal user, I want to view all documents linked to a Package or Supplier in one place so I can quickly find what I need. | • Documents tab visible on Package and Supplier detail pages<br>• Displays document list with columns: Name, Type (DocumentTag), Stage (DocumentStageEnum), Expiry Date, Signed Date, Amended Date, Created Date<br>• Pagination: 25 per page<br>• Basic sorting by any column (ascending/descending)<br>• Click to view/download document<br>• Leverages existing `documentable_id/documentable_type` polymorphic relationship | P0 |
| **4.2 Metadata Filtering** | As an internal user, I want to filter documents by metadata fields so I can narrow results. | • Filter by DocumentTag (dropdown, multi-select)<br>• Filter by DocumentStageEnum (dropdown, multi-select)<br>• Filter by expiry date range (date picker)<br>• Filter by signed date range (date picker)<br>• Filter by created date range (date picker)<br>• Filters work in combination (AND logic)<br>• Clear all filters action<br>• Filtered results update in real-time | P0 |
| **4.3 Document Upload** | As an internal user, I want to upload a document and set metadata so it's properly categorized. | • Upload modal/form with fields:<br>&nbsp;&nbsp;- File (PDF, JPG, PNG, max size TBD)<br>&nbsp;&nbsp;- DocumentTag (required dropdown)<br>&nbsp;&nbsp;- Stage (optional, defaults to NEW)<br>&nbsp;&nbsp;- Expiry Date (optional, shown only if DocumentTag.has_expiry = true)<br>&nbsp;&nbsp;- Identifier (optional, shown only if DocumentTag.has_number = true)<br>• Document saved to S3 with hash calculation<br>• Malware scanning enabled (existing global scope filters THREATS_FOUND)<br>• Created_by populated from authenticated user<br>• Audit log entry created via Spatie ActivityLog | P0 |
| **4.4 Document View/Download** | As an internal user, I want to view or download documents so I can review them. | • Click document name → opens in browser (PDF) or downloads (images)<br>• Uses S3 temporary URLs (10min expiry, existing pattern)<br>• Audit log entry created for access (read action) | P0 |
| **4.5 Document Stage Update** | As an internal user, I want to change document stage so I can track lifecycle progress. | • Inline stage dropdown or dedicated "Change Stage" action<br>• Available stages: NEW, SUBMITTED, IN_REVIEW, INFORMATION_REQUESTED, APPROVED, EXPIRING_SOON, EXPIRED, REJECTED<br>• Audit log entry created for stage change (before/after)<br>• Optional: stage-specific validation (e.g., cannot move to APPROVED without signed_date) - defer to future epics if complex | P1 |
| **4.6 Document Deletion (Soft Delete)** | As an internal user, I want to delete documents so I can remove duplicates or errors. | • Delete action soft-deletes document (sets deleted_at)<br>• Deleted documents hidden from Documents tab by default<br>• Optional "Show Deleted" toggle reveals soft-deleted documents<br>• Audit log entry created for deletion | P1 |
| **4.7 Signature Artifact: Call Recording** | As an internal user, I want to attach a call recording reference to a document so I can prove verbal consent. | • "Add Signature Artifact" modal with option: **Call Recording**<br>• Fields:<br>&nbsp;&nbsp;- Call Recording ID (text, reference to Aircall/Databricks)<br>&nbsp;&nbsp;- Transcript Text (textarea, optional, stores uploaded transcript)<br>&nbsp;&nbsp;- Signed Date (date picker, required)<br>• Saves to new `document_signatures` table:<br>&nbsp;&nbsp;- `document_id` (FK to documents)<br>&nbsp;&nbsp;- `signature_type` (enum: CALL_RECORDING, PDF_UPLOAD, DIGITAL)<br>&nbsp;&nbsp;- `call_recording_id` (nullable string)<br>&nbsp;&nbsp;- `transcript_text` (nullable text)<br>&nbsp;&nbsp;- `pdf_path` (nullable string)<br>&nbsp;&nbsp;- `signed_date` (timestamp)<br>• Updates `documents.signed_date` field to match signature artifact<br>• Audit log entry created | P0 |
| **4.8 Signature Artifact: PDF Upload** | As an internal user, I want to upload a scanned signature PDF so I can attach physical signature evidence. | • "Add Signature Artifact" modal with option: **PDF Upload**<br>• Fields:<br>&nbsp;&nbsp;- PDF File (upload, max size TBD)<br>&nbsp;&nbsp;- Signed Date (date picker, required)<br>• Saves PDF to S3 (separate from original document)<br>• Saves to `document_signatures` table with `signature_type = PDF_UPLOAD`<br>• Updates `documents.signed_date` field to match signature artifact<br>• Audit log entry created | P0 |
| **4.9 Signature Artifact: Digital Signature** | As an internal user, I want to record a digital signature so I can track portal-based signing. | • "Add Signature Artifact" modal with option: **Digital Signature**<br>• Fields:<br>&nbsp;&nbsp;- Signature Metadata (JSON, stores digital signature payload from future form/portal signing feature)<br>&nbsp;&nbsp;- Signed Date (auto-populated to current timestamp)<br>• Saves to `document_signatures` table with `signature_type = DIGITAL`<br>• Updates `documents.signed_date` field to match signature artifact<br>• Audit log entry created<br>• **Note**: Actual digital signature capture UI (form signing, portal signing) is OUT OF SCOPE for DOC - this stores the artifact only | P1 |
| **4.10 Signature Artifact Display** | As an internal user, I want to view signature artifacts attached to a document so I can verify signature evidence. | • Documents tab shows "Signature" column with icon/badge if signature artifact exists<br>• Click signature icon → modal showing:<br>&nbsp;&nbsp;- Signature Type (Call Recording, PDF Upload, Digital)<br>&nbsp;&nbsp;- Signed Date<br>&nbsp;&nbsp;- Call Recording ID (if applicable, with link to Aircall/Databricks if possible)<br>&nbsp;&nbsp;- Transcript excerpt (if applicable, first 500 chars with "Show More")<br>&nbsp;&nbsp;- PDF preview or download link (if applicable)<br>&nbsp;&nbsp;- Digital signature metadata (if applicable, formatted JSON)<br>• Audit log entry created for signature artifact access | P1 |
| **4.11 Schema Addition: signed_date** | As the system, I need to store when a document was signed so users can filter by signature date. | • Add `signed_date` column to `documents` table (timestamp, nullable)<br>• Populated when signature artifact is attached (FR 4.7-4.9)<br>• Filterable in Documents tab metadata filters (FR 4.2)<br>• Displayed in Documents tab list view (FR 4.1) | P0 |
| **4.12 Schema Addition: amended_date** | As the system, I need to store when a document was last amended so users can track version history. | • Add `amended_date` column to `documents` table (timestamp, nullable)<br>• Populated when document is replaced/updated (future epic - upload new version)<br>• Filterable in Documents tab metadata filters (FR 4.2)<br>• Displayed in Documents tab list view (FR 4.1)<br>• **Note**: Actual document versioning/replacement UI is OUT OF SCOPE for DOC - this provides the schema field only | P1 |
| **4.13 Audit Trail Access** | As a compliance user, I want to view audit logs for document actions so I can investigate changes. | • "View Audit Log" action on each document<br>• Displays Spatie ActivityLog entries:<br>&nbsp;&nbsp;- Action (created, updated, stage_changed, signature_added, deleted)<br>&nbsp;&nbsp;- User (createdBy)<br>&nbsp;&nbsp;- Timestamp<br>&nbsp;&nbsp;- Before/After state (for updates)<br>• Sortable by timestamp (newest first)<br>• Exportable as CSV (optional, P2) | P1 |

---

## 5. Non-Functional Requirements

### Performance
- Documents tab page load: <1s (p95) for 100 documents
- Metadata filtering: <500ms response time (p95)
- File upload: Support up to 50MB files (TBD - confirm with infra)
- S3 temporary URL generation: <200ms (p95)

### Security
- **Role-based access control**: Leverage existing TC Portal roles (Care Partner, Finance, Compliance, Admin)
- **Document visibility**: Users see only documents for parent records they have access to (enforces existing Package/Supplier authorization)
- **Malware scanning**: Existing global scope filters `malware_status = THREATS_FOUND` (already implemented)
- **Audit logging immutable**: Spatie ActivityLog entries cannot be modified or deleted
- **Signature artifact integrity**: Store hash of call recording ID, transcript, PDF to detect tampering (optional P2)

### Accessibility
- Documents tab WCAG 2.1 AA compliant
- Keyboard navigation for filters, upload modal, stage change
- Screen reader support for document list, metadata fields, signature artifacts

### Data Quality
- **DocumentTag referential integrity**: Documents must reference valid DocumentTag (FK constraint)
- **Stage enum validation**: Only valid DocumentStageEnum values allowed
- **Signature artifact validation**: signed_date required when signature artifact attached
- **Audit trail completeness**: All document actions logged (upload, stage change, signature add, delete)

### Scalability
- System handles 10,000+ documents per parent record (Package with 10+ years of history)
- Pagination prevents UI performance degradation on high-volume parent records
- S3 storage scales indefinitely (existing pattern)

---

## 6. User Flows

### 6.1 Upload Document with Metadata

1. User navigates to Package or Supplier detail page
2. User clicks "Documents" tab
3. User clicks "Upload Document" button
4. System displays upload modal with fields:
   - File picker (required)
   - DocumentTag dropdown (required, shows available tags)
   - Stage dropdown (optional, defaults to NEW)
   - Expiry Date (conditional, shown only if DocumentTag.has_expiry = true)
   - Identifier (conditional, shown only if DocumentTag.has_number = true)
5. User selects file, chooses DocumentTag (e.g., "Police Check"), sets optional fields
6. User clicks "Upload"
7. System:
   - Uploads file to S3
   - Calculates file hash
   - Runs malware scan (async)
   - Creates Document record with documentable_id/type = parent record
   - Sets created_by = authenticated user
   - Creates audit log entry
8. System displays success message, refreshes Documents tab list
9. User sees new document in list with metadata

**Edge Cases**:
- Malware detected: Document soft-deleted, user notified, audit log entry
- Upload fails: Error message, user can retry
- Duplicate file (same hash): System warns user, allows override or cancel

---

### 6.2 Attach Signature Artifact (Call Recording)

**Precondition**: Document exists, user has edit permission

1. User views document in Documents tab
2. User clicks "Add Signature" action (or similar button/link)
3. System displays "Add Signature Artifact" modal with 3 options:
   - Call Recording
   - PDF Upload
   - Digital Signature
4. User selects **Call Recording**
5. System displays fields:
   - Call Recording ID (text input, e.g., Aircall call UUID)
   - Transcript Text (textarea, optional, user pastes transcript)
   - Signed Date (date picker, required)
6. User fills fields:
   - Call Recording ID: `aircall-12345-abc`
   - Transcript: "Client verbally agreed to HCA terms on 2025-11-15..."
   - Signed Date: 2025-11-15
7. User clicks "Save"
8. System:
   - Creates `document_signatures` record:
     - `document_id` = current document
     - `signature_type` = CALL_RECORDING
     - `call_recording_id` = "aircall-12345-abc"
     - `transcript_text` = "Client verbally agreed..."
     - `signed_date` = 2025-11-15
   - Updates `documents.signed_date` = 2025-11-15
   - Creates audit log entry
9. System displays success message, closes modal
10. User sees signature icon/badge in Documents tab list
11. User clicks signature icon → views signature artifact details modal

**Edge Cases**:
- Call Recording ID already attached to another document: System warns user, allows override or cancel
- Invalid date format: Validation error
- User cancels: No changes saved

---

### 6.3 Filter Documents by Metadata

**Precondition**: User is on Documents tab of Package or Supplier

1. User sees filter panel with dropdowns/pickers:
   - DocumentTag (multi-select dropdown)
   - Stage (multi-select dropdown)
   - Expiry Date Range (date range picker)
   - Signed Date Range (date range picker)
   - Created Date Range (date range picker)
2. User selects filters:
   - DocumentTag: "Police Check", "Insurance Certificate"
   - Stage: "APPROVED"
   - Expiry Date: 2025-01-01 to 2025-12-31
3. User clicks "Apply Filters" (or filters auto-apply on change)
4. System queries documents:
   - WHERE documentable_id = [parent ID]
   - AND documentable_type = [parent type]
   - AND document_tag_id IN (Police Check, Insurance Certificate)
   - AND stage = APPROVED
   - AND expiry_date BETWEEN 2025-01-01 AND 2025-12-31
5. System displays filtered results (3 documents match)
6. User sees filtered list with column headers showing active filters
7. User clicks "Clear Filters" → all filters reset, full list restored

**Edge Cases**:
- No results: "No documents match your filters" message
- Complex filter combination: System handles AND logic correctly
- Performance: Query returns <500ms even with 1,000+ documents (indexed columns)

---

### 6.4 Change Document Stage

**Precondition**: Document exists, user has edit permission

1. User views document in Documents tab
2. User clicks inline stage dropdown (or "Change Stage" action)
3. System displays stage options:
   - NEW
   - SUBMITTED
   - IN_REVIEW
   - INFORMATION_REQUESTED
   - APPROVED
   - EXPIRING_SOON
   - EXPIRED
   - REJECTED
4. User selects new stage (e.g., APPROVED)
5. System:
   - Updates `documents.stage` = APPROVED
   - Creates audit log entry with before/after state:
     - Before: IN_REVIEW
     - After: APPROVED
     - User: [authenticated user]
     - Timestamp: 2025-11-18 14:32:00
6. System displays success message
7. User sees updated stage in Documents tab list

**Edge Cases**:
- Invalid stage transition (e.g., NEW → EXPIRED): System allows (no validation in DOC - future epics may add workflow rules)
- User cancels: No changes saved

---

## 7. Dependencies & Risks

### Dependencies

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Existing Document models | Technical | ✅ Production | High - entire epic depends on existing architecture |
| S3 file storage | Infrastructure | ✅ Production | High - document uploads fail |
| Spatie ActivityLog | Technical | ✅ Production | Medium - audit trail incomplete |
| Aircall API (call recordings) | External | ⚠️ Integration TBD | Medium - call recording artifacts manual entry only |
| RAP TP-2403 (authorization) | Epic | 🔄 In Progress | Low - use existing role-based access, enhance later |
| HCA epic TP-1865 | Future Epic | ⏳ Not Started | None - HCA will consume DOC architecture |
| OT Reports ASS1 TP-1904 | Future Epic | 🔄 In Progress | None - ASS1 will consume DOC architecture |
| Budget V2 TP-2501 | Future Epic | ⏳ Not Started | None - Budget PDFs will consume DOC architecture |

### Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| **Schema migration on existing documents table** (100k+ records) | High | High | • Test migration on staging with production-size dataset<br>• Add indexes on new columns (signed_date, amended_date)<br>• Zero-downtime migration (add columns as nullable, backfill later if needed)<br>• Coordinate with infra team for migration window |
| **Aircall API integration complexity** | Medium | Medium | • Start with manual call recording ID entry (text input)<br>• Future epic handles Aircall API integration<br>• Store call recording ID as string (flexible schema) |
| **User adoption of Documents tab** (existing workflows entrenched) | Medium | High | • User training and documentation<br>• Gradual rollout: start with one document type (e.g., HCA)<br>• Show time savings metrics to users (search time reduction) |
| **Performance degradation on high-volume parent records** (10k+ documents) | Low | Medium | • Pagination enforced (25 per page)<br>• Database indexes on documentable_id/type, stage, expiry_date, signed_date<br>• Load test with 10k+ documents per parent record |
| **DocumentTag schema changes break existing documents** | Low | High | • No changes to DocumentTag schema in DOC epic<br>• Future epics add new DocumentTags via data migration, not schema changes |
| **Signature artifact storage approach insufficient** | Low | Medium | • Use flexible JSON storage for future signature types<br>• Schema supports 3 types now, extensible to e-signature APIs later |

---

## 8. Out of Scope (Deferred to Future Epics)

### Explicitly Out of Scope for DOC

**Document Workflows** (deferred to feature epics):
- ❌ HCA signature workflow (TP-1865) - DOC provides architecture, HCA defines workflow
- ❌ OT report upload workflow (TP-1904-ASS1) - DOC provides architecture, ASS1 defines workflow
- ❌ Budget PDF approval workflow (TP-2501) - DOC provides architecture, Budget V2 defines workflow
- ❌ Document-type-specific stages or validation rules (e.g., HCA requires signed_date before APPROVED)
- ❌ Bulk operations (upload 10 documents at once, bulk stage change)
- ❌ Document versioning UI (upload new version, view version history) - schema field `amended_date` provided only

**Advanced Features**:
- ❌ Compliance dashboard (expiry alerts, missing signatures report)
- ❌ Notifications (email alerts for expiring documents, signature requests)
- ❌ RAG/AI search implementation (architecture only, metadata search provided)
- ❌ E-signature API integration (DocuSign, HelloSign)
- ❌ Document generation/templating (auto-generate HCA PDFs from templates)
- ❌ OCR or AI metadata extraction
- ❌ Mobile upload (camera integration)
- ❌ Email integration (upload documents via email)
- ❌ Advanced search (full-text search, AND/OR filter combinations)
- ❌ Document linking (link related documents, parent/child relationships)
- ❌ External sharing (generate public link, password-protected access)

**Why Deferred?**
DOC is an **architecture epic** focused on foundational infrastructure. Feature epics will consume this architecture and add:
- Document-type-specific workflows
- Persona-based user flows
- Advanced filtering and search
- Compliance dashboards and alerts
- E-signature API integrations

**Success Criteria for DOC**:
✅ Future epics can add document types with zero schema changes
✅ Signatures captured via 3 mechanisms and stored as artifacts
✅ All documents accessible via unified Documents tab
✅ Common metadata fields (8 core fields) filterable

---

## Appendix A: Existing Document Architecture Reference

### Document Model
**File**: `domain/Document/Models/Document.php`

**Key Fields** (existing):
- `id` - Primary key
- `uuid` - Unique identifier
- `name` - Display name
- `extension` - File extension (pdf, jpg, png)
- `path` - S3 storage path
- `stage` - DocumentStageEnum (NEW, SUBMITTED, IN_REVIEW, APPROVED, EXPIRED, REJECTED)
- `expiry_date` - Expiration timestamp (nullable)
- `identifier` - Document number (nullable, e.g., Police Check #12345)
- `document_tag_id` - FK to DocumentTag (type)
- `documentable_id` - Polymorphic parent ID
- `documentable_type` - Polymorphic parent type (Package, Supplier, Agreement, BudgetPlan, Bill, PackageStatement)
- `created_by` - FK to User
- `hash` - File hash for duplicate detection
- `malware_status` - Malware scan result (nullable, THREATS_FOUND filtered via global scope)
- `deleted_at` - Soft delete timestamp
- `created_at` - Creation timestamp
- `updated_at` - Last update timestamp

**New Fields** (added in DOC epic):
- `signed_date` - Signature timestamp (nullable)
- `amended_date` - Amendment timestamp (nullable)

### DocumentTag Model
**File**: `domain/Document/Models/DocumentTag.php`

**Key Fields**:
- `id` - Primary key
- `label` - Display name (e.g., "Police Check", "Insurance Certificate")
- `description` - Help text
- `has_expiry` - Boolean flag (shows expiry_date field in upload form)
- `has_number` - Boolean flag (shows identifier field in upload form)
- `allow_multiple` - Boolean flag (allows multiple documents of this type per parent record)
- `is_optional` - Boolean flag (document required or optional)
- `file` - Template file path (S3, optional)

**Examples** (from production data):
- Police Check (has_expiry: true, has_number: true)
- Insurance Certificate (has_expiry: true)
- OT Report (has_expiry: false)
- Budget PDF (has_expiry: false)
- HCA Agreement (has_expiry: false, has_number: true)

### DocumentStageEnum
**File**: `domain/Document/Enums/DocumentStageEnum.php`

**Values**:
1. `NEW` - Newly uploaded (blue)
2. `SUBMITTED` - Submitted for review (blue)
3. `IN_REVIEW` - Under review (orange)
4. `INFORMATION_REQUESTED` - More info needed (orange)
5. `APPROVED` - Approved (green)
6. `EXPIRING_SOON` - Expiring within threshold (orange)
7. `EXPIRED` - Past expiry_date (red)
8. `REJECTED` - Rejected (red)

### DocumentRejection Model
**File**: `domain/Document/Models/DocumentRejection.php`

**Key Fields**:
- `id` - Primary key
- `document_id` - FK to Document
- `rejection_reasons` - Array of DocumentRejectionReasonEnum
- `rejection_comments` - Rejection notes

### Polymorphic Relationships (Existing Usage)

**Current Parent Types**:
- `App\Models\Package` - Service packages for clients
- `App\Models\Supplier` - Supplier profiles
- `Domain\Agreement\Models\Agreement` - Contracts/agreements
- `Domain\Budget\Models\BudgetPlan` - Budget plans
- `Domain\Billing\Models\Bill` - Invoices/bills
- `Domain\Package\Models\PackageStatement` - Package statements

**DOC Epic Focus**: Package and Supplier (most common use cases)

**Future Expansion**: Agreement, BudgetPlan, Bill, PackageStatement (future epics)

---

## Appendix B: Document Signatures Table Schema

**New Table**: `document_signatures`

**Purpose**: Store signature artifacts (call recordings, PDF uploads, digital signatures) separately from Document model for flexibility and auditability.

**Columns**:
- `id` - Primary key (bigint, auto-increment)
- `document_id` - FK to documents (bigint, indexed)
- `signature_type` - Enum (CALL_RECORDING, PDF_UPLOAD, DIGITAL)
- `call_recording_id` - Call recording reference (varchar 255, nullable)
- `transcript_text` - Call recording transcript (text, nullable)
- `pdf_path` - S3 path to signature PDF (varchar 255, nullable)
- `digital_signature_metadata` - JSON payload for digital signatures (json, nullable)
- `signed_date` - Signature timestamp (timestamp)
- `created_by` - FK to users (bigint)
- `created_at` - Creation timestamp
- `updated_at` - Last update timestamp

**Indexes**:
- `document_id` (FK index)
- `signature_type` (filter queries)
- `signed_date` (date range queries)

**Relationships**:
- `belongsTo(Document)` - Each signature belongs to one document
- `belongsTo(User, 'created_by')` - Each signature created by one user

**Business Rules**:
- One document can have multiple signature artifacts (e.g., initial call recording + later PDF amendment)
- Each signature artifact updates `documents.signed_date` to most recent signature timestamp
- Signature artifacts are immutable (no updates, only soft delete if needed)

**Audit Logging**:
- All signature artifact actions logged via Spatie ActivityLog
- Captures: created, deleted (soft delete)

---

## Appendix C: Migration Plan

### Phase 1: Schema Additions (Sprint 1)
1. Add `signed_date` column to `documents` table (timestamp, nullable, indexed)
2. Add `amended_date` column to `documents` table (timestamp, nullable, indexed)
3. Create `document_signatures` table with columns above
4. Add indexes: `documents.signed_date`, `documents.amended_date`, `document_signatures.document_id`, `document_signatures.signature_type`
5. Test migration on staging with 100k+ document records
6. Zero-downtime deployment (columns nullable, no backfill required)

### Phase 2: UI Foundation (Sprint 1-2)
1. Documents tab component (Vue/Inertia)
2. Document list table with pagination (25 per page)
3. Basic sorting (column headers)
4. Upload modal with metadata fields
5. S3 upload integration (existing pattern)
6. Audit log display (read-only)

### Phase 3: Metadata Filtering (Sprint 2)
1. Filter panel UI (DocumentTag, Stage, date ranges)
2. Backend filtering logic (query builder)
3. Clear filters action
4. Performance testing (10k+ documents)

### Phase 4: Signature Artifacts (Sprint 2-3)
1. "Add Signature Artifact" modal with 3 options
2. Call recording artifact form + save logic
3. PDF upload artifact form + save logic
4. Digital signature artifact form + save logic (stores metadata only)
5. Signature artifact display modal
6. Update `documents.signed_date` on artifact save

### Phase 5: Stage Management (Sprint 3)
1. Inline stage change dropdown
2. Stage update API endpoint
3. Audit log entry for stage changes
4. Optional: stage transition validation (defer to future epics if complex)

### Phase 6: Testing & Documentation (Sprint 3-4)
1. Feature tests for all FR requirements
2. Performance testing (high-volume documents)
3. Security testing (role-based access, malware scanning)
4. User acceptance testing (UAT) with Care Partners and Finance
5. User documentation (how to upload, attach signatures, filter)
6. Training materials (video walkthrough)

---

## Appendix D: 8 Core Metadata Fields

DOC epic provides filtering on these 8 fields:

1. **Parent Record** - `documentable_id/type` (Package, Supplier) - ✅ Existing
2. **Type** - `document_tag_id` (DocumentTag: Police Check, Insurance, etc.) - ✅ Existing
3. **Stage** - `stage` (DocumentStageEnum: NEW, APPROVED, EXPIRED, etc.) - ✅ Existing
4. **Expiry Date** - `expiry_date` (compliance tracking) - ✅ Existing
5. **Created Date** - `created_at` (upload timestamp) - ✅ Existing
6. **Signed Date** - `signed_date` (signature timestamp) - ⭐ NEW in DOC
7. **Amended Date** - `amended_date` (last amendment timestamp) - ⭐ NEW in DOC
8. **Created By** - `created_by` (uploader) - ✅ Existing

**Why These 8?**
- Cover 90% of user search/filter needs
- Leverage existing schema (5 of 8 already exist)
- Support regulatory compliance (expiry, signature, audit trail)
- Enable future document workflows (HCA, OT, Budget) without schema changes

---

## Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-11-18 | Claude Code | Initial draft PRD for DOC epic |

---

**Next Steps**:
1. Review PRD with Product Owner (Romi) and Tech Lead (Khoa)
2. Create RACI matrix (stakeholder roles)
3. Break down PRD into user stories (5-10 major stories)
4. Estimate story points and assign to sprints
5. Design Documents tab UI mockups (Figma)
6. Plan schema migration and testing approach
