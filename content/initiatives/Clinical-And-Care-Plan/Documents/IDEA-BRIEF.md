---
title: "Idea Brief: Documents (DOC)"
description: "Clinical and Care Plan > Documents"
icon: i-heroicons-light-bulb
navigation:
  order: 1
---

**Created**: 2026-01-14
**Epic Code**: DOC
**Initiative**: Clinical and Care Plan (TP-1859)

---

## Problem Statement (What)

- TC Portal has document infrastructure (`Document`, `DocumentTag`, `DocumentStage` models) used internally for packages, agreements, and bills
- Lacks user-facing features, signature workflows, and compliance tracking needed for aged care operations
- Existing infrastructure is hidden from users — no upload/search UI, no signature capture
- No consolidated view of document compliance status (expiry, missing signatures)

**Current State**: Document infrastructure exists but is backend-only; users cannot upload, search, or track document compliance

---

## Possible Solution (How)

**Extend existing document architecture** with user-facing features and signature capture capabilities:

- **Schema Additions** — New fields: `signed_date`, `amended_date`, document file child objects for versioning
- **Signature Capture** — Call recording + transcript upload, PDF signature upload, manual status entry
- **User-Facing UI** — Upload, search, and metadata capture interface
- **Compliance Dashboard** — Expiry alerts, missing signature tracking, role-based access control
- **Advanced Search** — Metadata filtering across document types and parent entities

```
// Before (Current)
1. Documents stored but hidden from users
2. No signature capture workflow
3. No compliance visibility
4. Manual tracking in spreadsheets

// After (With DOC)
1. User-facing upload/search UI
2. Signature capture (call, PDF, manual)
3. Compliance dashboard with alerts
4. Centralized document management
```

**Existing Infrastructure to Extend**:
- Polymorphic `Document` model with `documentable_id/type`
- `DocumentTag` (document types: Police Check, Insurance, etc.)
- `stage` field enum (NEW, SUBMITTED, IN_REVIEW, APPROVED, EXPIRED, REJECTED)
- `expiry_date`, audit trail, soft deletes, malware scanning

---

## Benefits (Why)

**User/Client Experience**:
- User-facing document upload and search replaces hidden backend
- Clear signature capture workflows for compliance artifacts

**Operational Efficiency**:
- 80-90% reduction in document search time
- Proactive expiry alerts reduce compliance gaps

**Business Value**:
- Regulatory compliance with signature verification and expiry tracking
- Scalable architecture already handles multiple entity types via polymorphism
- Foundation for future RAG and AI metadata extraction

---

## Owner & Stakeholders

| Role | Person |
|------|--------|
| **R** | Zoe Judd (PO), David Henry (BA), Katja Panova (PO), Beth Poultney (Des), Khoa Duong (Dev) |
| **A** | Erin Headley |
| **C** | Mike Wise, Zoe Judd |
| **I** | — |

---

## Assumptions & Dependencies, Risks

**Assumptions**:
- Existing `Document`/`DocumentTag` schema is stable
- Signature capture manual initially (no e-signature API integration)

**Dependencies**:
- Existing Document domain models
- Budget V2 (TP-2501), Digital Statement, Service Confirmation
- Client HCA (TP-1865), Clinical Assessment (TP-1904)
- File storage (S3), RAP (TP-2403)

**Risks**:
- Schema migration complexity (MEDIUM) → Mitigation: Add fields to existing `documents` table incrementally
- User adoption of previously hidden feature (LOW) → Mitigation: Training, gradual rollout
- Signature artifact storage approach (LOW) → Mitigation: Define clear artifact types upfront

---

## Estimated Effort

**3–4 sprints**

- **Phase 1** (1–2 sprints): Schema additions (`signed_date`, `amended_date`), document file child model, signature artifact storage
- **Phase 2** (1–2 sprints): User-facing UI (upload, search, metadata capture), signature capture workflows
- **Phase 3** (1 sprint): Compliance dashboard, expiry alerts, role-based access integration

---

## Scope Boundaries

**In Scope**:
- Extend existing Document models with new fields
- Document file versioning (child objects)
- Signature capture (call recording + transcript, PDF upload, manual entry)
- User-facing upload/search UI
- Compliance dashboard, expiry alerts, role-based access

**Out of Scope**:
- RAG implementation (architecture only)
- AI metadata extraction, OCR
- E-signature API integration (DocuSign/HelloSign)
- Document generation/templating
- Email integration, mobile upload

---

## Proceed to PRD?

**YES** — DOC adds user-facing document management to existing infrastructure, enabling signature capture and compliance tracking for SAH requirements.

---

## Decision

- [ ] **Approved** - Proceed to PRD
- [ ] **Needs More Information**
- [ ] **Declined**

**Approval Date**: ____

---

## Next Steps

**If Approved**:
1. [ ] Create PRD (spec.md)
2. [ ] Create RACI Matrix
3. [ ] Create Jira epic (TP-2174)
4. [ ] Break down into user stories
