---
title: "Idea Brief -- DOC: Document Repository & Architecture"
---

# Idea Brief -- DOC: Document Repository & Architecture

**Epic**: TP-2174 | **Initiative**: TP-1859 Clinical and Care Plan
**Owner**: [To be assigned] | **Product Owner**: Romi

---

## Problem Statement

TC Portal has a  document infrastructure (`Document`, `DocumentTag`, `DocumentStage` models) used internally for packages, agreements, and bills—but lacks user-facing features, signature workflows, and compliance tracking needed for aged care operations.

---

## Solution

**Extend existing document architecture** with user-facing features and signature capture capabilities.

**Current State (Hidden Infrastructure)**:
- ✅ Polymorphic `Document` model with `documentable_id/type` (parent linkage)
- ✅ `DocumentTag` (document types: Police Check, Insurance, etc.)
- ✅ `stage` field (enum: NEW, SUBMITTED, IN_REVIEW, APPROVED, EXPIRED, REJECTED)
- ✅ `expiry_date`, `created_at`, audit trail, soft deletes, malware scanning
- ✅ Used by: Package, Agreement, BudgetPlan, Bill, PackageStatement

**DOC Epic Additions**:

**New Fields**:
- `signed_date` - Signature timestamp
- `amended_date` - Amendment tracking
- Document File child objects (one record → multiple file versions)

**New Capabilities**:
- **Signature capture**: call recording + transcript upload, PDF signature upload, manual status entry
- User-facing upload/search UI
- Compliance dashboard (expiry alerts, missing signatures)
- Role-based access control
- Advanced metadata search/filter

**8 Core Metadata Fields** (leveraging existing + additions):
1. **Parent Record** - `documentable_id/type` (supplier/package) ✅ EXISTS
2. **Stage** - `stage` enum (lifecycle tracking) ✅ EXISTS
3. **Type** - `DocumentTag` (extensible types) ✅ EXISTS
4. **Signature** - NEW: `signed_date` + signature artifacts
5. **Signed Date** - NEW field
6. **Expiry Date** - `expiry_date` ✅ EXISTS
7. **Created Date** - `created_at` ✅ EXISTS
8. **Amended Date** - NEW field + file versioning

---

## Benefits

- **Build on proven foundation** (Document models already in production for packages/agreements)
- **80-90% reduction** in document search time (surface existing backend to users)
- **Regulatory compliance** with signature verification, expiry tracking
- **Signature workflows** (call recordings, PDF uploads, manual entry)
- **Scalable architecture** already handles multiple entity types via polymorphism

---

## Assumptions, Dependencies, Risks

**Assumptions**: Existing `Document`/`DocumentTag` schema is stable; signature capture manual initially (no e-signature API integration)

**Dependencies**: Existing Document domain models, Budget V2 (TP-2501), Digital Statement, Service Confirmation, Client HCA (TP-1865), Clinical Assessment (TP-1904-ASS1), file storage (S3), RAP (TP-2403)

**Risks**: Schema migration complexity (add fields to existing `documents` table), user adoption (currently hidden feature), signature artifact storage approach

---

## Estimated Effort

**3-4 sprints (6-8 weeks)**

**Phase 1**: Schema additions (`signed_date`, `amended_date`), document file child model, signature artifact storage (1-2 sprints)
**Phase 2**: User-facing UI (upload, search, metadata capture), signature capture workflows (call recording, PDF upload) (1-2 sprints)
**Phase 3**: Compliance dashboard, expiry alerts, role-based access integration (1 sprint)

---

## Scope Boundaries

**IN SCOPE**: Extend existing Document models with `signed_date`/`amended_date` fields, document file versioning (child objects), signature capture (call recording + transcript, PDF upload, manual entry), user-facing upload/search UI, compliance dashboard, expiry alerts, role-based access

**OUT OF SCOPE**: RAG implementation (architecture only), AI metadata extraction, OCR, e-signature API integration (DocuSign/HelloSign), document generation/templating, email integration, mobile upload, automated signature verification

**REUSE/EXTEND**: Existing `Document`, `DocumentTag`, `DocumentStage`, `DocumentRejection` models, polymorphic `documentable` relationships, malware scanning, audit trail (Spatie ActivityLog)

---

## Decision

- [ ] **Approved** - Proceed to PRD
- [ ] **Needs More Information**
- [ ] **Declined**

**Approval Date**: [YYYY-MM-DD]
