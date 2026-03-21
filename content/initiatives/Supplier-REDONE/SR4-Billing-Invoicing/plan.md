---
title: "Technical Plan: Billing & Invoicing"
---

# Technical Plan: Billing & Invoicing

**Feature Branch**: `sr4-billing-invoicing`
**Created**: 2026-03-19
**Author**: Will Whitelaw
**Status**: Draft
**Dependencies**: SR0 (API Foundation), SR2 (Profile & Org Management), SR3 (Supplier Pricing)

---

## 1. Architecture Overview

### System Boundary

SR4 spans two codebases:

1. **tc-portal** (Laravel 12, PHP 8.4) — v2 API endpoints, bill domain extensions, validation actions, notifications, operations processing queue (Inertia views)
2. **supplier-portal** (Next.js 16, React 19, shadcn/ui) — bill creation form, bill history, draft management, invoice upload

### Coexistence Principle (CRITICAL)

The existing bill domain is **untouched**. The v2 API layer is **additive**:

- Existing `Bill` model (`app/Models/Bill/Bill.php`) gains a nullable `supplier_entity_id` FK — no existing columns removed or renamed
- Existing `BillItem` model (`app/Models/Bill/BillItem.php`) gains a nullable `line_item_status` column for per-item approval/rejection
- Existing `BillStageEnum` already has all required statuses: `DRAFT`, `SUBMITTED`, `ESCALATED`, `IN_REVIEW`, `APPROVED`, `PAYING`, `ON_HOLD`, `REJECTED`, `PAID` — **no new enum cases needed** for the core lifecycle
- A new `WRITTEN_OFF` case is added to `BillStageEnum` for the write-off workflow (FR-017)
- Existing operations Inertia views (`BillsTable`, `OnHoldBillsTable`, `DraftBillsTable`), Nova resources, and bill actions continue to work unchanged
- Existing `BillOnHoldReasonsEnum` and `BillRejectedReasonsEnum` are reused; new v2-specific hold reasons (the 5 categories from the spec: missing documentation, budget query, recipient dispute, supplier query, other) are added as new enum cases
- Existing `CreateBill`, `UpdateBill`, `CreateBillItem`, `UpdateBillItem` actions are **not modified** — new v2 actions are created alongside them
- The `BillPolicy` is extended to handle supplier-entity scoping for v2 requests

### Data Flow

```
Supplier Portal (Next.js) → v2 API → Laravel Actions → Bill Model → MySQL
                                                      ↓
                                          Notifications (in-app + email)
                                                      ↓
                                          Operations Inertia views (existing)
```

---

## 2. Database Changes

### Migration 1: Add supplier_entity_id to bills table

```
Schema: bills
- ADD supplier_entity_id (unsignedBigInteger, nullable, indexed)
- ADD FOREIGN KEY supplier_entity_id → supplier_entities(id)
- ADD auto_approved_at (timestamp, nullable)
- ADD auto_approved_rule_snapshot (json, nullable) — snapshot of rule config at time of auto-approval
- ADD express_pay_eligible (boolean, default false)
- ADD write_off_reason (text, nullable)
- ADD write_off_approved_by (unsignedBigInteger, nullable, FK → users.id)
- ADD write_off_approved_at (timestamp, nullable)
```

**Rationale**: `supplier_entity_id` is nullable because existing bills predate supplier entities. New bills created via v2 API will always have this set. Existing bills with `supplier_id` continue to work via the existing `Supplier` relationship.

### Migration 2: Add line_item_status to bill_items table

```
Schema: bill_items
- ADD line_item_status (string(20), nullable) — 'approved', 'rejected', null (pending)
- ADD line_item_rejection_reason (string(255), nullable)
- ADD line_item_rejection_note (text, nullable)
- ADD line_item_reviewed_by (unsignedBigInteger, nullable, FK → users.id)
- ADD line_item_reviewed_at (timestamp, nullable)
```

**Rationale**: Per-line-item approval (FR-013/FR-039) requires tracking status at the item level. Null means "not yet reviewed" (inherits bill-level decision for non-partial reviews).

### Migration 3: Auto-approval rules configuration table

```
Schema: auto_approval_rules (NEW)
- id (bigIncrements)
- name (string) — e.g. "Standard Auto-Approval"
- max_amount (decimal 10,2) — maximum bill total for auto-approval
- rate_tolerance_percentage (decimal 5,2) — e.g. 5.00 for 5% tolerance
- require_supplier_verified (boolean, default true)
- require_no_duplicates (boolean, default true)
- require_budget_match (boolean, default true)
- is_active (boolean, default true)
- created_by (unsignedBigInteger, FK → users.id)
- timestamps
```

### Migration 4: Express Pay eligibility configuration

```
Schema: express_pay_configs (NEW)
- id (bigIncrements)
- min_approval_rate (decimal 5,2) — e.g. 95.00 for 95%
- max_recent_rejections (integer) — within lookback period
- min_processed_bills (integer) — e.g. 20
- lookback_days (integer) — e.g. 90
- require_verified_bank_details (boolean, default true)
- is_active (boolean, default true)
- created_by (unsignedBigInteger, FK → users.id)
- timestamps
```

### Migration 5: Bill audit trail table

```
Schema: bill_status_audit_trail (NEW)
- id (bigIncrements)
- bill_id (unsignedBigInteger, FK → bills.id, indexed)
- from_status (string(20), nullable) — null for initial creation
- to_status (string(20))
- reason (text, nullable) — rejection reason, hold reason, write-off reason
- reason_code (string(100), nullable) — enum value for structured reasons
- note (text, nullable) — free-text reviewer note
- method (string(20)) — 'manual', 'batch', 'auto_approval', 'system'
- performed_by (unsignedBigInteger, FK → users.id)
- timestamps
```

**Rationale**: The existing `Spatie\Activitylog` on Bill records changes but lacks the structured reason/method data the spec requires (FR-014, FR-021). A dedicated audit trail table provides the exact shape needed for the v2 API to expose audit history.

### Migration 6: Bill extractions for AI invoice processing

The existing `bill_extractions` table and `BillExtraction` model already exist. SR4 extends extraction with:

```
Schema: bill_extractions (MODIFY)
- ADD source_type (string(20), nullable) — 'ai_invoice', 'email', 'manual'
- ADD confidence_scores (json, nullable) — per-field confidence from AI extraction
- ADD processing_time_ms (integer, nullable) — extraction duration tracking
```

---

## 3. Backend Architecture

### 3.1 V2 API Endpoints

All endpoints are under `/api/v2/` using the SR0 envelope format, Sanctum token auth, and 60 req/min rate limiting.

#### Supplier-Facing Endpoints (Supplier Portal)

| Method | Endpoint | Action | FR |
|--------|----------|--------|----|
| `POST` | `/bills` | Create bill atomically (header + line items) | FR-001, FR-041 |
| `GET` | `/bills` | List bills for active supplier entity | FR-034, FR-037 |
| `GET` | `/bills/{bill}` | Get bill detail with line items, audit trail | FR-034 |
| `PUT` | `/bills/{bill}` | Update draft bill | FR-006 |
| `POST` | `/bills/{bill}/submit` | Submit draft → Submitted | FR-038 |
| `POST` | `/bills/{bill}/upload-invoice` | Upload invoice for AI extraction | FR-029 |
| `GET` | `/bills/{bill}/extraction` | Get AI extraction results | FR-030 |
| `POST` | `/bills/{bill}/documents` | Upload supporting documents | FR-033 |
| `GET` | `/bills/resubmit/{bill}` | Get rejected bill data for resubmission | FR-036 |
| `GET` | `/supplier-entity/express-pay-status` | Get Express Pay eligibility | FR-026 |
| `GET` | `/recipients` | List recipients with active assessments | FR-002 |
| `GET` | `/recipients/{recipient}/budget-items` | Get budget items for validation | FR-003 |

#### Operations-Facing Endpoints (Inertia — existing tc-portal views)

| Method | Endpoint | Action | FR |
|--------|----------|--------|----|
| `POST` | `/api/v2/ops/bills/{bill}/review` | Start review (Submitted → In Review) | FR-038 |
| `POST` | `/api/v2/ops/bills/{bill}/approve` | Approve bill (full or partial) | FR-013, FR-039 |
| `POST` | `/api/v2/ops/bills/{bill}/reject` | Reject bill with structured reason | FR-011 |
| `POST` | `/api/v2/ops/bills/{bill}/hold` | Place on hold with structured reason | FR-015 |
| `POST` | `/api/v2/ops/bills/{bill}/write-off` | Write off (requires senior approval) | FR-017 |
| `POST` | `/api/v2/ops/bills/batch` | Batch action on multiple bills | FR-020, FR-021 |
| `GET` | `/api/v2/ops/bills/queue` | Processing queue with filters | FR-009 |
| `PUT` | `/api/v2/ops/auto-approval-rules` | Update auto-approval config | FR-023 |
| `PUT` | `/api/v2/ops/express-pay-config` | Update Express Pay config | FR-025 |
| `POST` | `/api/v2/ops/bills/{bill}/reverse-auto-approval` | Reverse an auto-approved bill | FR-024 |

### 3.2 Actions (Lorisleiva AsAction)

All new actions use the `AsAction` trait. Authorization lives in `authorize()`, never in `handle()` or `asController()`.

#### Bill Lifecycle Actions

| Action | Location | Responsibility |
|--------|----------|----------------|
| `CreateBillV2` | `app/Actions/Bill/V2/CreateBillV2.php` | Atomic bill + line items creation via v2 API |
| `UpdateBillV2` | `app/Actions/Bill/V2/UpdateBillV2.php` | Update draft bill via v2 API |
| `SubmitBill` | `app/Actions/Bill/V2/SubmitBill.php` | Draft → Submitted transition + validation |
| `ReviewBill` | `app/Actions/Bill/V2/ReviewBill.php` | Submitted → In Review |
| `ApproveBill` | `app/Actions/Bill/V2/ApproveBill.php` | In Review → Approved (full or partial) |
| `RejectBill` | `app/Actions/Bill/V2/RejectBill.php` | In Review → Rejected with structured reason |
| `HoldBill` | `app/Actions/Bill/V2/HoldBill.php` | In Review → On Hold with structured reason |
| `WriteOffBill` | `app/Actions/Bill/V2/WriteOffBill.php` | On Hold → Written Off (senior approval) |
| `BatchProcessBills` | `app/Actions/Bill/V2/BatchProcessBills.php` | Batch approve/reject/hold |
| `ReverseAutoApproval` | `app/Actions/Bill/V2/ReverseAutoApproval.php` | Undo auto-approved bill |

#### Validation Actions

| Action | Location | Responsibility |
|--------|----------|----------------|
| `ValidateBillBudgetMatch` | `app/Actions/Bill/V2/Validation/ValidateBillBudgetMatch.php` | Check line items against recipient budget (FR-003) |
| `ValidateBillRateCompliance` | `app/Actions/Bill/V2/Validation/ValidateBillRateCompliance.php` | Check rates against agreed pricing from SR3 (FR-004). **Reuses SR3 cap tolerance logic**: rates within `cap_amount * (1 + tolerance_percentage / 100)` pass; rates above are flagged. |
| `ValidateProductBillLinkage` | `app/Actions/Bill/V2/Validation/ValidateProductBillLinkage.php` | **SR6 extension**: For product bills, check 3-way linkage (assessment + budget + supplier category). Only runs when bill has product line items. |
| `DetectDuplicateBill` | `app/Actions/Bill/V2/Validation/DetectDuplicateBill.php` | Duplicate detection: same supplier, recipient, service date, service type (FR-007) |
| `ValidateSupplierVerification` | `app/Actions/Bill/V2/Validation/ValidateSupplierVerification.php` | Check supplier ABN/bank verification from SR2 |
| `RunAutoApproval` | `app/Actions/Bill/V2/Validation/RunAutoApproval.php` | Evaluate bill against auto-approval rules (FR-022) |
| `CalculateExpressPayEligibility` | `app/Actions/Bill/V2/Validation/CalculateExpressPayEligibility.php` | Recalculate Express Pay status (FR-025) |

**Bill Validation Pipeline Order** (executed sequentially on submission):

```
1. ValidateSupplierVerification  — Is the supplier verified? (fast fail)
2. ValidateProductBillLinkage    — SR6: Assessment linked + not expired + supplier registered? (product bills only)
3. ValidateBillBudgetMatch       — Budget line item exists with sufficient funds?
4. ValidateBillRateCompliance    — Rate within SR3 price cap + tolerance?
5. DetectDuplicateBill           — Potential duplicate? (warning, not blocking)
6. RunAutoApproval               — All above pass + within threshold? → auto-approve
7. CalculateExpressPayEligibility — Eligible for Express Pay fast-track?
```

Each validator returns a `BillValidationResultData` with pass/fail + message. All results are aggregated and returned to the reviewer. Validators 1–4 are **blocking** (bill cannot be auto-approved if any fail). Validator 5 is a **warning** (flagged for reviewer attention). Validators 6–7 are **post-validation** actions.

#### AI Extraction Actions

| Action | Location | Responsibility |
|--------|----------|----------------|
| `ExtractInvoiceData` | `app/Actions/Bill/V2/Extraction/ExtractInvoiceData.php` | Dispatch AI extraction job (FR-029) |
| `ProcessExtractionResult` | `app/Actions/Bill/V2/Extraction/ProcessExtractionResult.php` | Map extraction output to bill line items (FR-030) |

### 3.3 Data Classes (Spatie Laravel Data)

All data classes use `#[MapName(SnakeCaseMapper::class)]` per project convention. Data classes are **anemic** — properties and type casting only, zero business logic.

| Data Class | Location | Purpose |
|------------|----------|---------|
| `CreateBillV2Data` | `app/Data/Bill/V2/CreateBillV2Data.php` | Validation for atomic bill creation (header + line items array) |
| `BillLineItemV2Data` | `app/Data/Bill/V2/BillLineItemV2Data.php` | Single line item within create/update payload |
| `SubmitBillData` | `app/Data/Bill/V2/SubmitBillData.php` | Validation for bill submission |
| `ApproveBillData` | `app/Data/Bill/V2/ApproveBillData.php` | Approval payload (full or partial with per-item decisions) |
| `RejectBillData` | `app/Data/Bill/V2/RejectBillData.php` | Rejection with structured reason + optional note |
| `HoldBillData` | `app/Data/Bill/V2/HoldBillData.php` | Hold with structured reason from 5 categories |
| `WriteOffBillData` | `app/Data/Bill/V2/WriteOffBillData.php` | Write-off reason + senior approver reference |
| `BatchProcessData` | `app/Data/Bill/V2/BatchProcessData.php` | Batch action: bill IDs + action type + shared reason |
| `BillValidationResultData` | `app/Data/Bill/V2/BillValidationResultData.php` | Aggregated validation results for review display |
| `AutoApprovalRuleData` | `app/Data/Bill/V2/AutoApprovalRuleData.php` | Auto-approval rule config CRUD |
| `ExpressPayConfigData` | `app/Data/Bill/V2/ExpressPayConfigData.php` | Express Pay config CRUD |
| `InvoiceExtractionResultData` | `app/Data/Bill/V2/InvoiceExtractionResultData.php` | AI extraction result per field with confidence |

### 3.4 Models

#### Existing Models (Extended)

**`Bill`** (`app/Models/Bill/Bill.php`):
- Add `supplier_entity_id` to `$fillable`
- Add `supplierEntity()` `BelongsTo` relationship
- Add `statusAuditTrail()` `HasMany` relationship
- Add `isWrittenOff()` accessor
- Add `scopeForSupplierEntity(Builder $query, int $supplierEntityId)` scope
- Add PHPDoc for new columns: `supplier_entity_id`, `auto_approved_at`, `auto_approved_rule_snapshot`, `express_pay_eligible`, `write_off_reason`, `write_off_approved_by`, `write_off_approved_at`

**`BillItem`** (`app/Models/Bill/BillItem.php`):
- Add `line_item_status`, `line_item_rejection_reason`, `line_item_rejection_note`, `line_item_reviewed_by`, `line_item_reviewed_at` to `$fillable`
- Add `reviewer()` `BelongsTo` relationship
- Add `isApproved()`, `isRejected()`, `isPending()` accessors
- Add PHPDoc for new columns

#### New Models

**`BillStatusAuditTrail`** (`app/Models/Bill/BillStatusAuditTrail.php`):
- Relationships: `bill()` BelongsTo, `performedBy()` BelongsTo(User)
- No event sourcing — this is a simple append-only audit log
- Scoped queries: `forBill()`, `byMethod()`

**`AutoApprovalRule`** (`app/Models/Bill/AutoApprovalRule.php`):
- Simple config model with active/inactive toggle
- Relationship: `createdBy()` BelongsTo(User)

**`ExpressPayConfig`** (`app/Models/Bill/ExpressPayConfig.php`):
- Simple config model with active/inactive toggle
- Relationship: `createdBy()` BelongsTo(User)

### 3.5 Enums

#### Extended Enums

**`BillStageEnum`** — Add one new case:
```php
#[Label('Written Off')]
#[Colour('gray')]
#[Icon('heroicons:archive-box-x-mark')]
case WRITTEN_OFF = 'WRITTEN_OFF';
```

**`BillOnHoldReasonsEnum`** — Add 5 new supplier-facing hold reason cases:
- `MISSING_DOCUMENTATION` — supplier-visible, action required from supplier
- `BUDGET_QUERY` — operations internal, no supplier action
- `RECIPIENT_DISPUTE` — operations internal, no supplier action
- `SUPPLIER_QUERY` — supplier-visible, action required from supplier
- `OTHER_V2` — generic catch-all with free-text note

These are additive — existing hold reasons continue to work for bills created through the existing flow.

#### New Enums

**`BillLineItemStatusEnum`** (`app/Enums/Bill/BillLineItemStatusEnum.php`):
- `APPROVED`, `REJECTED` — null on model means pending

**`BillAuditMethodEnum`** (`app/Enums/Bill/BillAuditMethodEnum.php`):
- `MANUAL`, `BATCH`, `AUTO_APPROVAL`, `SYSTEM`

**`BillV2HoldCategoryEnum`** (`app/Enums/Bill/BillV2HoldCategoryEnum.php`):
- `MISSING_DOCUMENTATION`, `BUDGET_QUERY`, `RECIPIENT_DISPUTE`, `SUPPLIER_QUERY`, `OTHER`
- Maps to the spec's 5 categories (FR-015)

### 3.6 Policy Extensions

**`BillPolicy`** (`app/Policies/BillPolicy.php`) — Add v2 methods:

| Method | Who | Logic |
|--------|-----|-------|
| `viewForSupplierEntity` | Supplier roles | Bill's `supplier_entity_id` matches user's active supplier entity |
| `createForSupplierEntity` | Supplier Admin, Supplier, Team Member | User has active supplier entity with active assessments |
| `submitBill` | Supplier roles | Bill is in Draft, belongs to user's supplier entity |
| `reviewBill` | Operations staff | Bill is in Submitted status |
| `approveBill` | Operations staff | Bill is in In Review status |
| `rejectBill` | Operations staff | Bill is in In Review status |
| `holdBill` | Operations staff | Bill is in In Review status |
| `writeOffBill` | Senior processor | Bill is in On Hold, user has senior processor permission |
| `batchProcess` | Operations staff | All bills in valid statuses for the requested action |
| `reverseAutoApproval` | Operations staff | Bill was auto-approved |

All policy methods return `Response::allow()` / `Response::deny('reason')` — never bare booleans.

### 3.7 Status Transition Guard

A dedicated service validates state transitions per FR-038:

**`BillStatusTransitionGuard`** (`app/Services/Bill/BillStatusTransitionGuard.php`):

```
Valid transitions:
  Draft → Submitted (supplier-initiated)
  Submitted → In Review (operations)
  In Review → Approved (operations)
  In Review → Rejected (operations)
  In Review → On Hold (operations)
  On Hold → Approved (operations)
  On Hold → Rejected (operations)
  On Hold → Written Off (operations, senior)
  Approved → Paid (system/operations)
```

This guard is called by every lifecycle action before mutating status. Invalid transitions throw a domain exception with a clear message.

### 3.8 Notifications

**In-App Notifications** (via existing Laravel notification system):

| Notification | Channel | Trigger | FR |
|--------------|---------|---------|-----|
| `BillSubmittedNotification` | database | Supplier submits bill | FR-012 |
| `BillApprovedNotification` | database, mail | Bill approved (full or partial) | FR-012, FR-040 |
| `BillRejectedNotification` | database, mail | Bill rejected with reason | FR-012, FR-040 |
| `BillOnHoldNotification` | database, mail | Bill placed on hold with reason | FR-012, FR-040 |
| `BillPaidNotification` | database, mail | Bill marked as paid | FR-012, FR-040 |
| `BillWrittenOffNotification` | database, mail | Bill written off | FR-012 |
| `ExpressPayStatusChangedNotification` | database, mail | Express Pay granted/revoked | FR-027 |

Email notifications include: bill reference number, new status, reason (where applicable), deep link to bill in supplier portal (FR-040).

### 3.9 Queued Jobs

| Job | Purpose | Queue |
|-----|---------|-------|
| `ProcessAutoApprovalJob` | Evaluate submitted bill against auto-approval rules | `billing` |
| `CalculateExpressPayJob` | Recalculate Express Pay eligibility after bill processing | `billing` |
| `ExtractInvoiceDataJob` | AI invoice extraction via external service | `billing-extraction` |
| `SendBillStatusNotificationJob` | Dispatch notifications for bill status changes | `notifications` |
| `FlagOverdueOnHoldBillsJob` | Scheduled: flag bills on hold > 14 days (FR-018) | `billing` |

`FlagOverdueOnHoldBillsJob` runs on a daily schedule via the console kernel.

### 3.10 Feature Flag

**`SupplierBillingV2`** — Laravel Pennant feature flag:
- Gates all v2 billing API endpoints
- Backend: route middleware `check.feature.flag:SupplierBillingV2`
- Frontend: supplier portal checks feature flag via auth response
- Allows gradual rollout per organisation or supplier entity

---

## 4. Frontend Architecture (Supplier Portal — Next.js)

The supplier portal (`supplier-portal/`) is a standalone Next.js 16 app with React 19, shadcn/ui (Base UI), Tailwind CSS 4, and TypeScript. It communicates exclusively via the v2 API — no Inertia, no shared state with tc-portal.

### 4.1 Page Structure

```
src/app/
├── (authenticated)/
│   ├── bills/
│   │   ├── page.tsx                    — Bill history list (FR-034)
│   │   ├── new/
│   │   │   └── page.tsx                — Bill creation form (FR-001, FR-002)
│   │   ├── [billId]/
│   │   │   ├── page.tsx                — Bill detail view
│   │   │   └── edit/
│   │   │       └── page.tsx            — Edit draft bill (FR-006)
│   │   └── resubmit/
│   │       └── [billId]/
│   │           └── page.tsx            — Resubmission from rejected bill (FR-036)
│   └── dashboard/
│       └── page.tsx                    — Express Pay badge display (FR-026)
```

### 4.2 Components

#### Bill Creation Flow

```
src/components/billing/
├── BillCreateForm/
│   ├── BillCreateForm.tsx              — Parent: owns form state, submission
│   ├── RecipientSelector.tsx           — Select recipient from assessments
│   ├── LineItemEditor.tsx              — Add/edit/remove line items
│   ├── LineItemRow.tsx                 — Single line item with service type, date, units, rate
│   ├── ValidationWarnings.tsx          — Budget match + rate warnings
│   ├── InvoiceUpload.tsx               — AI invoice upload + extraction status
│   └── BillSummary.tsx                 — Total, line item count, submit button
├── BillDetail/
│   ├── BillDetail.tsx                  — Parent: owns data fetching
│   ├── BillHeader.tsx                  — Status badge, reference, dates
│   ├── LineItemsTable.tsx              — Line items with per-item status
│   ├── AuditTimeline.tsx               — Status change history
│   ├── PaymentInfo.tsx                 — Payment date, reference (paid bills)
│   ├── HoldReasonBanner.tsx            — On-hold reason + required action
│   └── DocumentAttachments.tsx         — Uploaded documents
├── BillHistoryList/
│   ├── BillHistoryList.tsx             — Parent: filtering, search, pagination
│   ├── BillFilters.tsx                 — Status, date range, supplier entity
│   ├── BillCard.tsx                    — Bill summary card for list view
│   └── EmptyState.tsx                  — No bills found
└── ExpressPay/
    └── ExpressPayBadge.tsx             — Dashboard Express Pay status
```

#### Shared Types

```
src/types/
├── billing.ts                          — Bill, BillLineItem, BillStatus, BillAuditEntry
├── validation.ts                       — ValidationResult, ValidationWarning
└── express-pay.ts                      — ExpressPayStatus, ExpressPayEligibility
```

**Key types in `billing.ts`**:
```typescript
type BillStatus = 'DRAFT' | 'SUBMITTED' | 'ESCALATED' | 'IN_REVIEW' | 'APPROVED' | 'PAYING' | 'ON_HOLD' | 'REJECTED' | 'PAID' | 'WRITTEN_OFF'

type Bill = {
  id: number
  ref: string | null
  supplierEntityId: number
  recipientName: string
  invoiceRef: string | null
  invoiceDate: string | null
  dueDate: string | null
  billStage: BillStatus
  totalAmount: number
  lineItems: BillLineItem[]
  auditTrail: BillAuditEntry[]
  submittedAt: string | null
  approvedAt: string | null
  paidAt: string | null
  paymentReference: string | null
  holdReason: string | null
  holdCategory: string | null
  rejectionReason: string | null
  rejectionNote: string | null
  expressPayEligible: boolean
}

type BillLineItem = {
  id: number
  serviceTypeId: number
  serviceTypeName: string
  serviceDate: string
  units: number
  rate: number
  total: number
  lineItemStatus: 'approved' | 'rejected' | null
  rejectionReason: string | null
  budgetMatchStatus: 'matched' | 'not_in_budget' | 'expired_assessment'
  rateComplianceStatus: 'within_tolerance' | 'exceeds_agreed_rate'
}

type BillAuditEntry = {
  id: number
  fromStatus: BillStatus | null
  toStatus: BillStatus
  reason: string | null
  note: string | null
  method: 'manual' | 'batch' | 'auto_approval' | 'system'
  performedBy: string
  createdAt: string
}
```

### 4.3 Hooks (Custom React Hooks)

| Hook | File | Purpose |
|------|------|---------|
| `useBills` | `src/hooks/use-bills.ts` | Fetch, filter, paginate bill list |
| `useBill` | `src/hooks/use-bill.ts` | Fetch single bill with detail |
| `useBillForm` | `src/hooks/use-bill-form.ts` | Bill creation form state, line item management, validation |
| `useInvoiceExtraction` | `src/hooks/use-invoice-extraction.ts` | Upload invoice, poll for extraction result |
| `useBillValidation` | `src/hooks/use-bill-validation.ts` | Client-side validation warnings (budget, rate) |
| `useExpressPayStatus` | `src/hooks/use-express-pay-status.ts` | Fetch Express Pay eligibility |

### 4.4 API Client Layer

All v2 API calls go through a typed API client that handles token auth (from SR0), error envelope parsing, and pagination:

```
src/lib/api/
├── client.ts                           — Base fetch wrapper with auth token injection
├── billing.ts                          — Bill CRUD, submission, document upload
├── recipients.ts                       — Recipient + budget item queries
└── types.ts                            — API envelope types (shared with SR0)
```

### 4.5 Form Validation

Bill creation uses client-side validation with Zod schemas as a pre-flight guard before API submission. Server-side validation (via Laravel Data) is the source of truth — client-side is UX only.

**Validation rules**:
- At least 1 line item required
- Maximum 100 line items (FR-041)
- Each line item: service type required, service date required, units > 0, rate > 0
- Invoice date required before submission
- Recipient selection required

Budget match and rate compliance are server-driven validations — displayed as warnings, not blocking submission (supplier can submit with warnings per spec).

---

## 5. Operations Processing Queue (tc-portal Inertia views)

The operations processing queue is served via the existing tc-portal Inertia stack. New v2 features are exposed through extended existing patterns.

### 5.1 Operations Table Extensions

**`BillProcessingQueueTable`** (`app/Tables/Staff/BillProcessingQueueTable.php`) — NEW:
- Location: `app/Tables/Staff/BillProcessingQueueTable.php`
- Resource query: `Bill::query()->whereIn('bill_stage', [SUBMITTED, IN_REVIEW])` with eager-loaded `supplierEntity`, `package.careCoordinator`, `billItems`
- Columns: TextColumn(ref), TextColumn(supplier), TextColumn(recipient), BadgeColumn(bill_stage), TextColumn(total_amount), DateColumn(submitted_at), BadgeColumn(validation_flags)
- Filters: BadgeFilter(bill_stage), TextFilter(supplier), TextFilter(recipient), BooleanFilter(has_validation_warnings), DateFilter(submitted_at)
- Actions: Review, Approve, Reject, Hold
- Transforms: `transformModel()` formats Money, dates, validation badge aggregation
- Frontend page: existing Inertia bills page with new processing tab

### 5.2 Batch Processing UI

Batch processing extends the existing `BulkUpdateStageBills` pattern. The `BillProcessingQueueTable` supports row selection via `CommonTable` bulk actions. The batch action dispatches `BatchProcessBills` which:

1. Validates all selected bills are in valid statuses for the action
2. Warns if any bills have validation issues (FR-020 AC-3)
3. Applies the action to each bill individually
4. Creates individual `BillStatusAuditTrail` entries per bill (FR-021)

**Concurrency note (cross-epic clarification with SR2)**: Batch operations do **NOT** use ETag/optimistic concurrency (unlike SR2 profile edits which use `If-Match` headers). Instead, `BatchProcessBills` uses a database transaction with `SELECT ... FOR UPDATE` on the selected bill IDs. If another staff member has already actioned a bill in the batch (status changed since the batch was selected), the conflicting bill is skipped and the batch result reports which bills succeeded and which were already actioned. Individual audit trail entries are still created for each successfully processed bill.
5. Returns a summary: N succeeded, N failed, N skipped

### 5.3 Auto-Approval Configuration Page

A simple Inertia page for operations managers to view/edit auto-approval rules and Express Pay config. No complex UI — just form fields for threshold values.

---

## 6. AI Invoice Extraction (P3)

### Architecture

AI extraction is a queued, async process:

1. Supplier uploads PDF/PNG/JPG via `POST /bills/{bill}/upload-invoice`
2. File is stored via Laravel's filesystem (S3)
3. `ExtractInvoiceDataJob` is dispatched to the `billing-extraction` queue
4. Job calls an external AI extraction service (to be determined — likely AWS Textract or a custom model)
5. Result is stored in `bill_extractions` with per-field confidence scores
6. Supplier portal polls `GET /bills/{bill}/extraction` until result is available
7. Extracted data is returned with confidence flags — low-confidence fields are left blank (FR-032)

### 30-Second SLA (FR-030)

The extraction job targets completion within 30 seconds. If the external service exceeds this:
- The job retries once with a 10-second delay
- If still not complete, the extraction is marked as "timed_out" and the supplier is told to enter data manually
- Timeout tracking feeds into extraction service monitoring

### External Service Integration

The AI extraction service is abstracted behind a contract interface (`ExtractInvoiceContract`) so the provider can be swapped without touching business logic. Initial implementation will use a configurable driver pattern.

---

## 7. Testing Strategy

### Backend (Pest)

| Test Type | Scope | Location |
|-----------|-------|----------|
| Feature | V2 API endpoints — CRUD, submission, status transitions | `tests/Feature/Api/V2/Billing/` |
| Feature | Status transition guard — valid/invalid transitions | `tests/Feature/Api/V2/Billing/StatusTransitionTest.php` |
| Feature | Auto-approval rules — threshold matching | `tests/Feature/Api/V2/Billing/AutoApprovalTest.php` |
| Feature | Batch processing — success, partial failure, audit trail | `tests/Feature/Api/V2/Billing/BatchProcessingTest.php` |
| Feature | Express Pay eligibility calculation | `tests/Feature/Api/V2/Billing/ExpressPayTest.php` |
| Feature | Duplicate detection | `tests/Feature/Api/V2/Billing/DuplicateDetectionTest.php` |
| Feature | Partial approval — per-line-item decisions | `tests/Feature/Api/V2/Billing/PartialApprovalTest.php` |
| Feature | Policy — supplier entity scoping, role checks | `tests/Feature/Api/V2/Billing/BillPolicyTest.php` |
| Feature | Notifications — in-app + email dispatched correctly | `tests/Feature/Api/V2/Billing/NotificationTest.php` |
| Unit | Budget match validation logic | `tests/Unit/Actions/Bill/V2/ValidateBillBudgetMatchTest.php` |
| Unit | Rate compliance validation logic | `tests/Unit/Actions/Bill/V2/ValidateBillRateComplianceTest.php` |
| Unit | Audit trail creation per status change | `tests/Unit/Actions/Bill/V2/AuditTrailTest.php` |

**Key test patterns**:
- All API tests authenticate via Sanctum tokens with supplier entity context
- Factory states for each bill stage: `draft()`, `submitted()`, `inReview()`, `approved()`, `onHold()`, `rejected()`, `paid()`
- Existing bill tests are NOT modified — SR4 tests are fully additive
- Coexistence test: verify existing bill flows still work after migrations

### Frontend (to be defined per supplier-portal testing framework)

Component and integration tests for the bill creation form, validation warning display, and history list. Testing framework TBD with supplier-portal team (likely Vitest + Testing Library).

---

## 8. Rollback Strategy

### Database Rollback

All migrations are reversible:
- `supplier_entity_id` column drop does not affect existing bills (nullable column)
- New tables (`bill_status_audit_trail`, `auto_approval_rules`, `express_pay_configs`) can be dropped cleanly
- `line_item_status` columns on `bill_items` can be dropped (null values mean no data loss)

### Feature Flag Rollback

`SupplierBillingV2` feature flag can be disabled instantly:
- V2 API endpoints return 404 when flag is off
- Supplier portal shows "Billing coming soon" placeholder
- Existing bill processing continues unchanged
- No data migration needed — bills created via v2 remain valid in the existing domain

### Code Rollback

All v2 code lives in namespaced directories (`V2/`) that can be removed without affecting existing code:
- `app/Actions/Bill/V2/` — delete directory
- `app/Data/Bill/V2/` — delete directory
- V2 API routes — remove route group
- Model extensions (new relationships, scopes) — remove additions

---

## 9. Risk Areas

| Risk | Severity | Mitigation |
|------|----------|------------|
| **Existing bill domain regression** | High | All changes are additive (new columns nullable, new tables, new actions). Existing tests must pass. Coexistence test suite. |
| **Auto-approval false positives** | Medium | Start with conservative thresholds (low max amount). Manual review of auto-approved bills. Reversal capability (FR-024). |
| **AI extraction reliability** | Low (P3) | Manual entry fallback always available. Extraction is optional enhancement, not blocking. |
| **Partial approval complexity** | Medium | Per-line-item status adds complexity to total calculations and supplier display. Extensive test coverage for edge cases (all approved, all rejected, mixed). |
| **Batch processing race conditions** | Medium | Database transactions per bill within batch. Optimistic locking on bill stage. Clear error reporting for failed items in batch. |
| **14-day overdue flag accuracy** | Low | Scheduled job runs daily. Off-by-one risk mitigated by using `Carbon::now()->subDays(14)` comparison. |

---

## 10. Performance Considerations

| Concern | Approach |
|---------|----------|
| **Bill list pagination** | V2 API uses cursor-based pagination for bill history. Operations queue uses offset pagination via CommonTable. |
| **Eager loading** | All bill queries eager-load `billItems`, `supplierEntity`, and `statusAuditTrail` to prevent N+1. |
| **Auto-approval throughput** | Queued job — does not block submission response. Processes sequentially to avoid race conditions with manual review. |
| **Batch processing** | Individual DB transactions per bill (not one giant transaction). Returns partial results on failure. |
| **AI extraction** | Async via queue. 30-second polling from frontend. No blocking on submission flow. |
| **Duplicate detection** | Indexed query on `(supplier_id, package_id, service_date, service_type_id)`. Runs during submission, not on every line item change. |

---

## 11. Implementation Phases

### Phase 1: Core Billing (P1) — Stories 1, 2, 3, 8

- Database migrations (supplier_entity_id, line_item_status, audit trail)
- V2 API: CRUD, submission, status transitions
- Status transition guard
- Budget match + rate validation
- Duplicate detection
- Partial approval
- On-hold with structured reasons + 14-day overdue flag
- Audit trail for every status change
- Notifications (in-app + email)
- Supplier portal: bill creation form, bill history, bill detail
- Operations processing queue table
- Feature flag: `SupplierBillingV2`

### Phase 2: Efficiency (P2) — Stories 4, 5, 6

- Batch bill processing
- Auto-approval rules engine + configuration UI
- Express Pay eligibility calculation + configuration UI
- Express Pay badge in supplier portal
- Reversal of auto-approved bills

### Phase 3: AI Enhancement (P3) — Story 7

- Invoice upload endpoint
- AI extraction job + external service integration
- Extraction result polling
- Pre-populated form fields with confidence flags

---

## 12. Architecture Gate Check

**Date**: 2026-03-19
**Status**: PASS

### Technical Feasibility
- [x] Architecture approach clear — extend existing Bill domain with v2 API layer
- [x] Existing patterns leveraged — Lorisleiva Actions, Spatie Data, BillStageEnum, CommonTable, BillPolicy
- [x] All requirements buildable — no impossible requirements identified
- [x] Performance considered — cursor pagination, eager loading, queued jobs
- [x] Security considered — supplier entity scoping, policy-based auth, Sanctum tokens

### Data & Integration
- [x] Data model understood — existing Bill/BillItem models extended, 4 new tables
- [x] API contracts clear — 22 endpoints defined with methods, paths, and FR mapping
- [x] Dependencies identified — SR0 (API v2 envelope, auth), SR2 (supplier entities, verification), SR3 (agreed pricing)
- [x] Integration points mapped — v2 API → existing Bill model → existing operations views
- [x] DTO persistence explicit — Data classes map to explicit column assignments in actions (no `->toArray()` into ORM)

### Implementation Approach
- [x] File changes identified — actions, data classes, models, migrations, notifications, API routes, policies
- [x] Risk areas noted — 6 risks with mitigations documented
- [x] Testing approach defined — Pest feature + unit tests, coexistence verification
- [x] Rollback possible — feature flag, nullable columns, namespaced code

### Resource & Scope
- [x] Scope matches spec — 3 phases matching P1/P2/P3 priorities
- [x] Effort reasonable — phased delivery reduces risk
- [x] Skills available — Laravel + React/Next.js team

### Laravel & Cross-Platform Best Practices
- [x] No hardcoded business logic in frontend — validation rules, status transitions, hold reasons all backend-powered
- [x] Cross-platform reusability — v2 API serves Next.js web, future mobile, and any API consumer
- [x] Laravel Data for validation — all v2 Data classes use Spatie Laravel Data
- [x] Model route binding — v2 controllers use `Bill $bill` parameter binding
- [x] No magic numbers/IDs — thresholds in config models, statuses in enums, constants on models
- [x] Common components pure — shadcn/ui components in supplier portal have zero business logic
- [x] Use Lorisleiva Actions — all new actions use `AsAction` trait
- [x] Action authorization in `authorize()` — auth checks in action authorize(), never in handle() or asController()
- [x] Data classes remain anemic — DTOs contain only properties and type casting
- [x] Migrations schema-only — no data operations in migrations
- [x] Models have single responsibility — Bill = billing domain, AutoApprovalRule = config, BillStatusAuditTrail = audit
- [x] Granular model policies — BillPolicy extended with scoped v2 methods
- [x] Response objects in auth — `Response::allow()` / `Response::deny('reason')` in policy methods
- [x] Event sourcing: not adding new events — v2 uses the existing Bill model directly (event sourcing is for existing domain flows)
- [x] Semantic column documentation — all new columns have PHPDoc definitions on models
- [x] Feature flags dual-gated — `SupplierBillingV2` via backend middleware + frontend flag check

### React TypeScript Standards (Section 6 — applies instead of Vue section)
- [x] All components use TypeScript — `.tsx` files throughout supplier-portal
- [x] Props typed explicitly — React component props use named types
- [x] No `any` types planned — all API response shapes have TypeScript types in `src/types/`
- [x] Shared types identified — `billing.ts`, `validation.ts`, `express-pay.ts` in `src/types/`
- [x] shadcn/ui components reused — no bespoke UI primitives (buttons, inputs, selects, badges, tables)
- [x] Custom hooks extract reusable logic — `useBills`, `useBillForm`, `useBillValidation`, `useInvoiceExtraction`
- [x] Component decomposition planned — each feature has parent + sub-components with single concerns
- [x] API client typed — all v2 API calls return typed responses

**Ready to Implement**: YES
