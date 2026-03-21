# DOC Context Review Checklist

Mark each item: ✅ (real/keep) | ❌ (slop/discard) | ⚠️ (partially true/needs edit)

---

## 1. Problem Statement

| # | Claim | Y/N |
|---|-------|-----|
| 1.1 | Document infrastructure already exists in production (Document, DocumentTag, DocumentStage models) | ✅ |
| 1.2 | This infrastructure is currently hidden from users (no UI) | ✅ |
| 1.3 | Documents are currently used internally for packages, agreements, bills | ✅ |

---

## 2. Parent Types (Where docs attach)

❌ **REPLACE with:**

| Field | Description |
|-------|-------------|
| **Relevant Department** | Which department the document relates to |
| **Relevant Tabs** | Which pages/tabs the document can appear on (multi-value) |

*Note: Documents can be generated from multiple places, but that's separate from where they appear.*

---

## 3. Document Types (DocumentTag)

| # | Claim | Y/N |
|---|-------|-----|
| 3.1 | There will be ~150 discrete document types | ✅ |
| 3.2 | Type determines which fields appear (conditional fields) | ✅ |
| 3.3 | Examples exist: Police Check, Insurance Certificate, OT Report, Budget PDF, HCA Agreement | ❌ Replace with actual list |

---

## 4. Document Stages/Status

**PRD lists 8 stages:** ❌ DISCARD

**Correct - use 4 statuses:**

| Status | Keep |
|--------|------|
| Submitted | ✅ |
| Actioned | ✅ |
| Approved | ✅ |
| Rejected | ✅ |

---

## 5. Core Fields on Document

**Use fields from David's comment + add fundamental technical fields (e.g., ID):**

| # | Field | In scope |
|---|-------|----------|
| 5.1 | ID (PK) | ✅ |
| 5.2 | Name | ✅ |
| 5.3 | Type (enum, ~150 values) | ✅ |
| 5.4 | Relevant Department | ✅ |
| 5.5 | Submitted At | ✅ |
| 5.6 | Has Expiry (bool) | ✅ |
| 5.7 | Expiry Date | ✅ |
| 5.8 | Expired (bool) | ✅ |
| 5.9 | Has Signature (bool) | ✅ |
| 5.10 | Signed By (enum: SDM, Recipient) | ✅ |
| 5.11 | Signature Artifact (link to doc ID) | ✅ |
| 5.12 | Signature Type (enum: Verbal, Digital, Manual) | ✅ |
| 5.13 | Signed At | ✅ |
| 5.14 | Has Status (bool) | ✅ |
| 5.15 | Status (enum: Submitted, Actioned, Approved, Rejected) | ✅ |
| 5.16 | Stage History (array) | ✅ |

**Discarded from PRD:**

| Field | Status |
|-------|--------|
| amended_date | ❌ Not needed - subsequent versions are separate documents |
| signed_date | ❌ Replaced by Signed At |
| identifier | ❌ |
| uuid | ❓ Check if needed |
| hash | ❓ Check if needed |
| malware_status | ❓ Check if needed |

---

## 6. Signature Handling

**PRD's separate `document_signatures` table:** ❌ DISCARD approach

**Use David's approach:**

| # | Item | Status |
|---|------|--------|
| 6.1 | Signature Type enum: Verbal, Digital, Manual | ✅ |
| 6.2 | Signature Artifact is a link (Doc ID) | ✅ |
| 6.3 | Signed By: Substitute Decision Maker or Recipient | ✅ |

*Signature workflow will need to support all methods - detail TBD*

---

## 7. Scope

**DOC epic scope is:**

| Item | In scope? |
|------|-----------|
| Index page on Package/Supplier records | ✅ |
| Catch-all documents page | ✅ |
| Filter by document type | ✅ |
| Filter by created date | ✅ |
| Button to print | ✅ |
| Button to share with client | ✅ |

**NOT in scope (from PRD - all discarded):**

| Item | Status |
|------|--------|
| User-facing Documents tab UI (elaborate version) | ❌ |
| Metadata filtering (elaborate version) | ❌ |
| Compliance dashboard | ❌ |
| Expiry alerts | ❌ |
| Workflows/automation | ❌ |
| Role-based access control | ❌ |

---

## 8. Out of Scope Confirmation

| # | Item | Confirmed out |
|---|------|---------------|
| 8.1 | RAG/AI search | ✅ Out |
| 8.2 | OCR | ✅ Out |
| 8.3 | E-signature API (DocuSign etc) | ✅ Out |
| 8.4 | Document generation/templating | ✅ Out |
| 8.5 | Email integration | ✅ Out |
| 8.6 | Mobile upload | ✅ Out |
| 8.7 | Complex workflows | ✅ Out |

---

## 9. Dependencies

| # | Dependency | Status |
|---|------------|--------|
| 9.1 | HCA epic (TP-1865) | ✅ Touches this - HCA will go through a lot of DOC |
| 9.2 | Clinical Assessment ASS1 (TP-1904) | ❓ |
| 9.3 | Budget V2 (TP-2501) | ❓ |
| 9.4 | RAP (TP-2403) | ❓ |

*Note: DOC touches many epics but for now that's all it is - foundational layer*

---

## Summary of Changes from Original PRD

1. **Parent types** → Replaced with Relevant Department + Relevant Tabs
2. **8 stages** → Replaced with 4 statuses (Submitted, Actioned, Approved, Rejected)
3. **Fields** → Use David's list, add ID, discard amended_date
4. **Signature handling** → Simplified, no separate table, use enums on document
5. **Scope** → Much simpler: index page, filters (type + date), print/share buttons
6. **Dependencies** → Minimal for now, HCA is main one

---

**Next: Create clean DOC-CONTEXT-MEMO.md with verified info only**
