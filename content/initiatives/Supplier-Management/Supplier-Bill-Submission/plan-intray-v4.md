---
title: "Implementation Plan: In Tray V4 Redesign"
---

# Implementation Plan: In Tray V4 Redesign

**Branch**: `feature/sbs`
**Spec**: [SBS spec.md](spec.md) — US7 (Bulk Invoice Upload with Document Splitting)
**Mockup**: `resources/js/Pages/Mockups/InvoiceUplift/InTrayV4.vue` (approved)
**Parent Plan**: [plan.md](plan.md) — Phases 7-8 (SBS Supplier Portal UI)
**Created**: 2026-03-09
**Status**: Draft

---

## Summary

Redesign the In Tray page from a basic sequential triage flow to a split-pane AI inbox (V4 mockup). The backend already supports draft bills from email and upload with AI predictions stored on the `predictions` JSON column. This plan focuses on:

1. Enriching the backend response with AI extraction data
2. Rebuilding the frontend to the approved V4 split-pane layout
3. Adding the upload modal and link-to-existing-bill modal with AI suggestions

---

## Technical Context

### What Already Exists

| Layer | Component | Status |
|-------|-----------|--------|
| Backend | `SupplierInTrayController` (index, store, search, link, promote) | Working |
| Backend | `CreateDraftBillsFromUploadAction` | Working |
| Backend | `CreateBillFromEmail` with AI predictions | Working |
| Backend | `predictions` JSON column on `bills` (BillPredictionData) | Working |
| Backend | Routes: `suppliers.in-tray.*` (index, store, search, link, promote) | Working |
| Frontend | `Suppliers/InTray/Index.vue` (basic sequential triage) | Replace |
| Frontend | `Supplier/InTray/LinkToBillModal.vue` | Replace |
| Frontend | `Mockups/InvoiceUplift/InTrayV4.vue` (approved design) | Reference |

### Data Model — No New Tables

The `bills` table already stores everything needed:
- `predictions` JSON column → `BillPredictionData` (client_name, amount, invoice_ref, invoice_date, line items, confidence)
- `bill_stage` → DRAFT (in tray) vs SUBMITTED (promoted)
- `source` → EMAIL or PORTAL_APP
- `documents` relationship → attached PDFs

### Dependencies

- `BillPredictionData` (`app/Data/Bill/BillPredictionData.php`)
- `PredictionData` (`app/Data/PredictionData.php`)
- `BillItemPredictionData` (`app/Data/Bill/BillItemPredictionData.php`)
- Existing `SupplierInTrayController` routes and actions

---

## Design Decisions

### Backend: Enriched Response Shape

The current `buildDraftDocuments()` returns minimal data. V4 needs AI extraction fields. Enhance the controller response to include prediction data per document:

```php
// New response shape per document
[
    'id' => int,
    'filename' => string,
    'source' => 'email' | 'upload',
    'pages' => int,
    'uploaded_at' => string,           // relative time
    'ai_status' => 'processing' | 'ready' | 'low_confidence',
    'ai' => [                          // null if processing
        'type' => string,              // 'Invoice', 'Receipt', etc.
        'confidence' => float,         // overall confidence %
        'client_name' => ?string,
        'client_tcid' => ?string,      // matched package TC number
        'client_match_confidence' => ?float,
        'amount' => ?string,           // formatted total
        'invoice_ref' => ?string,
        'invoice_date' => ?string,     // formatted date
        'line_items' => int,           // count of detected items
        'suggested_bills' => array,    // for link modal
    ],
]
```

**AI status logic**:
- `processing` → bill has no predictions yet (just created, awaiting AI)
- `ready` → bill has predictions with confidence >= 60%
- `low_confidence` → bill has predictions but overall confidence < 60%

### Backend: Suggested Bills for Link Modal

When a document has predictions, find matching existing bills:
- Match by `invoice_ref` (exact or fuzzy)
- Match by `client_name` (from package.recipient)
- Match by `amount` (total_amount within 1% tolerance)
- Score: 90%+ for exact ref+client+amount, 70-89% for partial match

### Frontend: Split-Pane Layout

From V4 mockup:
- **Left panel** (380px): Document list with search + source filter
- **Right panel** (flex-1): AI extraction header + document preview placeholder + action bar
- **"New" dropdown** in header: Copy email, Upload documents, New manual bill
- **Upload modal**: Dropzone with file list showing upload → processing → ready states
- **Link modal**: AI suggested matches + manual search

### Frontend: TypeScript Types

```typescript
type AiExtraction = {
    type: string;
    confidence: number;
    client_name: string | null;
    client_tcid: string | null;
    client_match_confidence: number | null;
    amount: string | null;
    invoice_ref: string | null;
    invoice_date: string | null;
    line_items: number;
    suggested_bills: SuggestedBill[];
};

type SuggestedBill = {
    id: number;
    ref: string;
    client_name: string;
    amount: string;
    date: string;
    stage: string;
    match_score: number;
    match_reason: string;
    on_hold_reason: string | null;
};

type InTrayDocument = {
    id: number;
    filename: string;
    source: string;
    pages: number;
    uploaded_at: string;
    ai_status: 'processing' | 'ready' | 'low_confidence';
    ai: AiExtraction | null;
};

type Props = {
    documents: InTrayDocument[];
    inboundEmail: string;
    stats: { pending: number; processed_today: number; total_today: number };
};
```

### Components

| Component | Type | Notes |
|-----------|------|-------|
| `Suppliers/InTray/Index.vue` | Rewrite | Full V4 split-pane layout |
| `Supplier/InTray/LinkToBillModal.vue` | Rewrite | AI suggestions + search |
| `Supplier/InTray/UploadModal.vue` | New | Dropzone modal with progress |
| `Supplier/InTray/InTrayDocumentList.vue` | New | Left panel document list |
| `Supplier/InTray/InTrayAiPanel.vue` | New | AI extraction detail panel |

All components: `<script setup lang="ts">`, named `type Props`, `type Emits`.

---

## Implementation Phases

### Phase 1: Backend — Enrich Controller Response

**Files Modified**:
- `domain/Supplier/Http/Controllers/SupplierInTrayController.php`

**Tasks**:
```
P1.1 - Rewrite buildDraftDocuments() to return V4 data shape with AI extraction
P1.2 - Add buildAiExtraction(Bill $bill) private method to extract predictions
P1.3 - Add buildSuggestedBills(Bill $bill) private method for link matches
P1.4 - Add stats.total_today to buildStats()
P1.5 - Eager load documents + package.recipient for performance
P1.6 - Write/update tests for enriched response
```

**Exit Criteria**:
- [ ] Controller returns V4 data shape
- [ ] AI extraction populated from predictions JSON
- [ ] Suggested bills return match scores
- [ ] Existing tests updated and passing

---

### Phase 2: Frontend — Split-Pane Layout

**Files Modified/Created**:
- `resources/js/Pages/Suppliers/InTray/Index.vue` (rewrite)
- `resources/js/Components/Supplier/InTray/InTrayDocumentList.vue` (new)
- `resources/js/Components/Supplier/InTray/InTrayAiPanel.vue` (new)

**Tasks**:
```
P2.1 - Create InTrayDocumentList.vue (left panel: search, source filter, scrollable list)
P2.2 - Create InTrayAiPanel.vue (AI extraction header with collapsible detail)
P2.3 - Rewrite Index.vue with split-pane layout matching V4 mockup
P2.4 - Implement "New" dropdown menu (copy email, upload, manual bill)
P2.5 - Implement keyboard shortcuts (A=create, L=link, X=reject)
P2.6 - Implement processing/ready/low-confidence states
P2.7 - Implement action bar (Reject left, Link + Create Bill right)
P2.8 - Implement "decided" state with undo per document
```

**Exit Criteria**:
- [ ] Split-pane layout matches V4 screenshots
- [ ] Document list with search + source filter works
- [ ] AI panel shows extracted data with confidence badges
- [ ] Keyboard shortcuts functional
- [ ] All three AI states render correctly (processing, ready, low_confidence)

---

### Phase 3: Modals — Upload + Link

**Files Modified/Created**:
- `resources/js/Components/Supplier/InTray/UploadModal.vue` (new)
- `resources/js/Components/Supplier/InTray/LinkToBillModal.vue` (rewrite)

**Tasks**:
```
P3.1 - Create UploadModal.vue (dropzone, file list with status, email hint in footer)
P3.2 - Rewrite LinkToBillModal.vue with AI suggested matches section + manual search
P3.3 - Wire upload modal to existing store route (POST suppliers.in-tray.store)
P3.4 - Wire link modal to existing link route (POST suppliers.in-tray.link)
P3.5 - Wire create action to existing promote route (POST suppliers.in-tray.promote)
```

**Exit Criteria**:
- [ ] Upload modal accepts drag-and-drop + file picker
- [ ] Upload shows per-file status (uploading → processing → ready)
- [ ] Link modal shows AI suggested matches with scores
- [ ] Link modal search queries existing bills endpoint
- [ ] All actions persist correctly via existing routes

---

### Phase 4: Polish + Gate 4

**Tasks**:
```
P4.1 - Run vendor/bin/pint --dirty
P4.2 - Verify all Vue files pass TypeScript checklist (no any, named types, etc.)
P4.3 - Run php artisan test --compact --filter=InTray
P4.4 - Run php artisan test --compact --filter=SupplierBill
P4.5 - Run npm run build (verify no Vite errors)
P4.6 - Delete old LinkToBillModal.vue if fully replaced
P4.7 - Clean up mockup files reference (don't delete — they're design artifacts)
```

---

## Testing Strategy

### Backend Tests

| Test | File | Coverage |
|------|------|----------|
| Index returns V4 data shape | `tests/Controller/Supplier/SupplierInTrayControllerTest.php` | AI extraction fields |
| Suggested bills matching | Same file | Ref, client, amount matching |
| Promote action | Same file | DRAFT → SUBMITTED |
| Link action | Same file | Document transfer + draft delete |

### Frontend (Manual)

- Split-pane renders at desktop widths
- Document selection updates right panel
- AI panel shows/hides correctly
- Upload modal drag-drop works
- Link modal shows AI suggestions
- Keyboard shortcuts work (A/L/X)
- Decided state shows with undo

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Predictions column empty for older bills | Medium | Low | Show "low_confidence" state, graceful fallback |
| Suggested bills query slow | Low | Medium | Limit to 5 results, index on invoice_ref |
| Upload modal file size issues | Low | Low | Existing 10MB limit enforced server-side |

---

## Architecture Gate Check (Gate 3)

**Date**: 2026-03-09
**Status**: PASS

### Technical Feasibility
- [x] Architecture approach clear — enrich existing controller, rewrite frontend
- [x] Existing patterns leveraged — same routes, same actions, same predictions column
- [x] All requirements buildable — V4 mockup fully defined
- [x] Performance considered — eager loading, limited suggested bills query
- [x] Security considered — supplier scoping on all queries

### Data & Integration
- [x] Data model understood — no new tables, predictions JSON already exists
- [x] API contracts clear — enriched Inertia response, same action endpoints
- [x] Dependencies identified — BillPredictionData, PredictionData classes
- [x] Integration points mapped — existing store/link/promote routes
- [x] DTO persistence explicit — predictions accessed via typed data classes

### Implementation Approach
- [x] File changes identified — controller + 5 Vue files
- [x] Risk areas noted — empty predictions graceful handling
- [x] Testing approach defined — controller tests + manual UI verification
- [x] Rollback possible — revert Vue files, controller changes are additive

### Resource & Scope
- [x] Scope matches spec — US7 In Tray redesign only
- [x] Effort reasonable — 3 phases, incremental
- [x] Skills available — standard Laravel + Vue

### Laravel & Cross-Platform Best Practices
- [x] No hardcoded business logic in Vue — AI data from backend
- [x] Cross-platform reusability — Inertia response serves any client
- [x] Laravel Data for validation — existing data classes used
- [x] Model route binding — supplier model binding in routes
- [x] No magic numbers — confidence thresholds as constants
- [x] Common components pure — CommonBadge, CommonIcon, CommonButton, CommonCopy
- [x] Action authorization — existing supplier scoping
- [x] Data classes remain anemic
- [x] Models have single responsibility

### Vue TypeScript Standards
- [x] All Vue components use `<script setup lang="ts">`
- [x] Props use named `type Props` with `defineProps<Props>()`
- [x] Emits use named `type Emits` with `defineEmits<Emits>()`
- [x] No `any` types — all backend data has TypeScript types
- [x] Shared types in component files (small scope, no shared types file needed)
- [x] Common components reused (CommonBadge, CommonIcon, CommonButton, CommonCopy, CommonHeader, CommonContent)
- [x] New components assessed — InTrayDocumentList, InTrayAiPanel, UploadModal are feature-specific (bespoke)

---

## Next Steps

1. Implement Phase 1 (backend enrichment)
2. Implement Phase 2 (frontend split-pane)
3. Implement Phase 3 (modals)
4. Run Gate 4 checks
