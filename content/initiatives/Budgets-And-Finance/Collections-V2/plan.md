---
title: "Plan"
---


**Spec**: [spec.md](./spec.md)
**Created**: 2026-01-16
**Status**: Draft
**Priority**: P0 - Ship Next Week

---

## Technical Context

### Technology Stack

**Backend:**
- Laravel 12, PHP 8.4
- MySQL database
- Redis + Laravel Horizon (queue management)
- Spatie Laravel Data (DTOs)
- Pest v3 (testing)

**Frontend:**
- Vue 3 + TypeScript
- Inertia.js v2 (server-driven pages)
- Tailwind CSS v3
- Existing `<Table>` component (reusable)

**External Integration:**
- MYOB API (API-014) - AR invoice and payment sync
- Hourly sync job + webhook support (optional)

### Dependencies

**From Spec:**
- **MYOB Integration (API-014)** - Must support AR invoice linkage and payment sync
- **Collections V1 (TP-2329)** - AR invoice visibility foundation and permissions
- **Budget V2** - Package budget editing capability and funding stream data model
- **Permission System** - FINANCE_APPROVE_VC permission

**Technical Dependencies:**
- Existing table component with filtering, sorting, multi-select, CSV export
- Budget editing interface for Care Partners
- MYOB sync infrastructure (cron job or event-based)

### Constraints

**Performance:**
- VC Approval: < 30 seconds per approval
- Reconciliation: < 15 minutes for 50+ VC funding streams
- Table must handle 100+ rows with pagination/virtual scrolling

**Security:**
- FINANCE_APPROVE_VC permission required for approval actions
- VIEW_FINANCIALS permission required for reconciliation dashboard
- Audit trail for all VC approvals (who, when, what)

**Accessibility:**
- WCAG 2.1 Level AA compliance
- Full keyboard navigation
- Screen reader support for tables and modals

**Business:**
- No notifications (Finance works directly from approval table)
- Bills automatically released when AR invoice fully paid
- Retroactive VC funding supported (previous quarters)

---

## Constitution Check

Review against `.specify/memory/constitution.md`:

- [x] **I. The Majestic Monolith** - All logic in Laravel app, no microservices ✓
- [x] **II. Domain-Driven Design** - Code in `/domain/Finance/` for VC + reconciliation ✓
- [x] **III. Convention Over Configuration** - Follow Laravel patterns (migrations, models, actions) ✓
- [x] **IV. Code Quality Standards** - Type safety, explicit return types, PHPDoc ✓
- [x] **V. Testing is First-Class** - Unit + feature + browser tests with Pest ✓
- [x] **VI. Event Sourcing for Audit-Critical Logic** - VC approvals logged for audit ✓
- [x] **VII. Laravel Data for DTOs** - Use for VC approval, budget editing ✓
- [x] **VIII. Action Classes for Business Logic** - ApproveVCFundingStreamAction, etc. ✓
- [x] **IX. Services Australia Integration** - N/A (MYOB integration, not SA) ✓
- [x] **X. Inertia.js + Vue 3 + TypeScript** - Server-driven pages, no fetch() calls ✓
- [x] **XI. Component Library & Tailwind** - Reuse existing `<Table>` component ✓
- [x] **XII. Design System** - Accessible, keyboard navigation, visible focus ✓
- [x] **XIII. Progress Over Perfection** - MVP first, iterate based on feedback ✓
- [x] **XIV. Feature Flags for Control** - Consider flag for Collections V2 rollout ✓
- [x] **XV. Permissions & Authorization** - FINANCE_APPROVE_VC permission, policies ✓
- [x] **XVI. Compliance & Audit** - Full audit trail, soft deletes, immutable logs ✓
- [x] **XVII. Code Formatting & Style** - Run `vendor/bin/pint --dirty` before commit ✓
- [x] **XVIII. Spec-Driven Development** - Following workflow (spec → plan → tasks) ✓
- [x] **XIX. Documentation** - Update CLAUDE.md, context/CONTEXT.md ✓
- [x] **XX. Performance Optimization** - Indexes, eager loading, pagination ✓

**Status**: ✅ All constitution principles satisfied

---

## Design Decisions

### Data Model

See [data-model.md](./data-model.md) for full entity definitions.

**Core Entities:**

1. **VC Funding Stream** (`vc_funding_streams`)
   - Voluntary Contribution added to package budget
   - Status: Pending, Approved
   - Links to Package, Budget Period/Quarter
   - Audit fields: added_by, approved_by, timestamps

2. **AR Invoice** (`ar_invoices`)
   - Synced from MYOB
   - Links to VC Funding Stream
   - Status: Derived from payments (Not Yet Invoiced, Partially Paid, Fully Paid)

3. **AR Invoice Payment** (`ar_invoice_payments`) ⭐ **Primary reconciliation entity**
   - Child record of AR Invoice
   - Supports partial payments (multiple payments per invoice)
   - Fields: payment_reference, payment_amount, payment_date, payment_method
   - MYOB sync timestamp

4. **Bill-to-Invoice Association** (`bill_invoice_associations`)
   - Links bills to AR invoices
   - Enables automatic bill release when invoice fully paid

5. **VC Approval Log** (`vc_approval_logs`)
   - Audit trail for all approvals
   - Fields: VC funding stream ID, action (Approved/Rejected), approver, timestamp, notes

**Relationships:**
```
VC Funding Stream (1) ──→ (N) AR Invoices
                                    │
                                    ├──→ (N) AR Invoice Payments ⭐
                                    │
                                    └──→ (N) Bill-to-Invoice Associations
```

**Key Indexes:**
- `vc_funding_streams`: `status`, `package_id`, `created_at`
- `ar_invoices`: `vc_funding_stream_id`, `invoice_number`
- `ar_invoice_payments`: `ar_invoice_id`, `payment_date`, `vc_funding_stream_id` (denormalized)

### API Contracts

**Internal APIs** (Controller → Action → Response):

No REST APIs needed. Inertia.js handles data passing server-side.

**Controller Endpoints:**

1. **VC Approval Dashboard**
   - `GET /finance/vc-approvals` → VCApprovalController@index
   - `POST /finance/vc-approvals/{vcFundingStream}/approve` → VCApprovalController@approve
   - `POST /finance/vc-approvals/bulk-approve` → VCApprovalController@bulkApprove

2. **VC Reconciliation Dashboard**
   - `GET /finance/vc-reconciliation` → VCReconciliationController@index
   - `GET /finance/vc-reconciliation/export` → VCReconciliationController@export
   - `POST /finance/vc-reconciliation/sync` → VCReconciliationController@manualSync

3. **Budget Editing (Care Partner)**
   - `POST /packages/{package}/budget/vc-funding` → PackageBudgetController@addVCFunding
   - `GET /packages/{package}/budget` → PackageBudgetController@show

**MYOB Integration:**
- Sync job: `Domain\Finance\Jobs\SyncMyobArInvoicesJob`
- Webhook handler (optional): `Domain\Finance\Http\Controllers\MyobWebhookController`

### UI Components

**Existing Components (Reuse):**
- `<Table>` - Main table component with filtering, sorting, multi-select, CSV export
- `<ConfirmationModal>` - For bulk approval confirmation
- `<Badge>` - Status indicators (Pending, Approved, Paid, Overdue)
- `<Button>` - Inline approve button, bulk actions

**New Components:**
- `VCApprovalTable.vue` - Wrapper around `<Table>` with VC-specific columns
- `VCReconciliationTable.vue` - Wrapper around `<Table>` with payment-level records
- `VCStatusBadge.vue` - Custom badge for VC statuses (Pending, Approved, Retroactive warning)

**Pages:**
- `Finance/VCApprovals/Index.vue` - VC Approval Dashboard
- `Finance/VCReconciliation/Index.vue` - VC Reconciliation Dashboard
- `Packages/Budget/Show.vue` - (Existing, add VC funding section)

---

## Implementation Phases

### Phase 1: Foundation (Days 1-2)

**Goal**: Database schema, models, and basic CRUD

**Tasks:**

1. **Database Migrations**
   - Create `vc_funding_streams` table
   - Create `ar_invoices` table
   - Create `ar_invoice_payments` table
   - Create `bill_invoice_associations` table
   - Create `vc_approval_logs` table
   - Add indexes for performance

2. **Models**
   - `VCFundingStream` model with relationships
   - `ArInvoice` model with relationships
   - `ArInvoicePayment` model (primary reconciliation entity)
   - `BillInvoiceAssociation` model
   - `VCApprovalLog` model
   - Define casts (status enums, dates, decimals)

3. **Data Classes (Laravel Data)**
   - `VCFundingStreamData` - DTO for creating VC funding streams
   - `ApproveVCFundingStreamData` - DTO for approval actions
   - `ArInvoicePaymentData` - DTO for MYOB sync

4. **Permissions**
   - Create `FINANCE_APPROVE_VC` permission
   - Assign to Finance Payable Manager role
   - Update `VIEW_FINANCIALS` permission for reconciliation access

**Tests:**
- Unit tests: Model relationships, casts, validation
- Feature tests: Basic CRUD operations
- Database: Migrations rollback successfully

**Success Criteria:**
- All migrations run without errors
- Models have correct relationships
- Tests pass (>90% coverage for models)

---

### Phase 2: VC Approval Dashboard (Days 3-4)

**Goal**: Finance can approve pending VC funding streams

**Tasks:**

1. **Backend - Actions**
   - `ApproveVCFundingStreamAction` - Single approval
   - `BulkApproveVCFundingStreamsAction` - Multi-select approval
   - `LogVCApprovalAction` - Audit trail logging

2. **Backend - Controllers**
   - `VCApprovalController@index` - List pending VC funding streams
   - `VCApprovalController@approve` - Approve single VC
   - `VCApprovalController@bulkApprove` - Bulk approve with confirmation

3. **Frontend - Pages**
   - `Finance/VCApprovals/Index.vue`
   - Use existing `<Table>` component
   - Inline [✓] approve button per row
   - Bulk [✓ Approve Selected] button
   - Confirmation modal for bulk actions

4. **Frontend - Filters & Export**
   - Package filter dropdown
   - Period/quarter filter
   - Date range picker
   - Added by filter
   - CSV export (leverages table component)

5. **Policies**
   - `VCFundingStreamPolicy@approve` - Check FINANCE_APPROVE_VC permission

**Tests:**
- Unit tests: ApproveVCFundingStreamAction logic
- Feature tests:
  - GET /finance/vc-approvals returns pending VC funding streams
  - POST /finance/vc-approvals/{id}/approve updates status
  - Bulk approve updates multiple records
  - Unauthorized users blocked
- Browser tests (Dusk/Nightwatch):
  - Finance user can approve single VC
  - Finance user can bulk approve 3 VCs
  - Confirmation modal appears for bulk actions

**Success Criteria:**
- Finance can approve VCs in < 30 seconds
- Audit trail records all approvals
- Unauthorized users cannot approve
- Tests pass (>90% coverage)

---

### Phase 3: Care Partner Budget Editing (Day 4)

**Goal**: Care Partners can add VC funding to current/past budgets

**Tasks:**

1. **Backend - Actions**
   - `AddVCFundingToBudgetAction` - Add VC to package budget
   - `NotifyFinanceOfPendingVCAction` - N/A (no notifications per clarification)

2. **Backend - Controllers**
   - `PackageBudgetController@addVCFunding` - POST endpoint
   - `PackageBudgetController@show` - Display VC funding section

3. **Frontend - Budget Editing**
   - Update `Packages/Budget/Show.vue`
   - Add "Add VC Funding" button
   - Modal with form: Amount, Period/Quarter, Notes (optional)
   - Retroactive warning for past quarters

4. **Validation**
   - Amount must be > 0
   - Period/Quarter must be valid
   - Care Partner must have budget editing permission

5. **Policies**
   - `PackagePolicy@editBudget` - Check care partner access

**Tests:**
- Unit tests: AddVCFundingToBudgetAction validation
- Feature tests:
  - POST /packages/{id}/budget/vc-funding creates VC funding stream
  - Status set to "Pending Approval"
  - Retroactive VC (past quarter) allowed
  - Unauthorized users blocked
- Browser tests:
  - Care Partner can add VC funding to current quarter
  - Care Partner can add retroactive VC funding
  - Status shows "Pending Finance Approval"

**Success Criteria:**
- Care Partners can add VC in 2-3 minutes
- VC funding stream created with status "Pending"
- Tests pass (>90% coverage)

---

### Phase 4: MYOB Integration (Days 5-6)

**Goal**: Sync AR invoices and payments from MYOB

**Tasks:**

1. **MYOB Sync Job**
   - `SyncMyobArInvoicesJob` - Hourly job
   - Fetch AR invoices with GL code 2480 (VC invoices)
   - Fetch AR invoice payments (child records)
   - Upsert logic: Match by invoice_number and payment_reference

2. **Sync Service**
   - `MyobArInvoiceSyncService`
   - Handle pagination (MYOB API limits)
   - Error handling (API failures, retries)
   - Logging (sync success/failure)

3. **Payment Processing**
   - Process each payment record
   - Calculate invoice status (Partially Paid, Fully Paid)
   - Trigger bill release when invoice fully paid

4. **Webhook Handler (Optional)**
   - `MyobWebhookController` - Real-time payment notifications
   - Validate webhook signature
   - Queue sync job for specific invoice

5. **Manual Sync Button**
   - Add [🔄 Sync Now] button to reconciliation dashboard
   - Triggers immediate sync job

**Tests:**
- Unit tests:
  - MyobArInvoiceSyncService processes invoices correctly
  - Payment status calculation (Partially Paid, Fully Paid)
- Feature tests:
  - Sync job creates/updates AR invoices
  - Sync job creates/updates payments
  - Invoice status derived from payments
  - Manual sync endpoint works
- Integration tests:
  - Mock MYOB API responses
  - Verify upsert logic (idempotent)

**Success Criteria:**
- Hourly sync completes in < 2 minutes
- Payment records accurately reflect MYOB data
- Invoice status correctly derived
- Tests pass (>90% coverage)

---

### Phase 5: VC Reconciliation Dashboard (Days 7-8)

**Goal**: Finance can reconcile VC funding with AR invoice payments

**Tasks:**

1. **Backend - Controllers**
   - `VCReconciliationController@index` - List payment records
   - `VCReconciliationController@export` - CSV export

2. **Frontend - Reconciliation Table**
   - `Finance/VCReconciliation/Index.vue`
   - Use existing `<Table>` component
   - Display AR Invoice Payment records (unique rows)
   - Group by invoice (expandable/collapsible)

3. **Frontend - Filters & Grouping**
   - Package filter
   - Status filter (Not Yet Invoiced, Partially Paid, Fully Paid, Overdue)
   - Payment date range filter
   - Payment method filter
   - Group by: Status (default), Invoice, Package, Period

4. **Frontend - Summary Metrics**
   - Total VC Approved: Sum(vc_funding_streams.amount WHERE status = Approved)
   - Total Invoiced: Sum(ar_invoices.invoice_amount)
   - Total Paid: Sum(ar_invoice_payments.payment_amount)

5. **CSV Export**
   - Export payment records with all fields
   - Include VC funding stream, invoice, payment details

**Tests:**
- Feature tests:
  - GET /finance/vc-reconciliation returns payment records
  - Filters work correctly (status, package, date)
  - Export generates CSV with correct data
  - Unauthorized users blocked
- Browser tests:
  - Finance user can filter by status (Overdue)
  - Finance user can export to CSV
  - Summary metrics display correctly

**Success Criteria:**
- Finance can reconcile 50+ VC streams in < 15 minutes
- Payment-level granularity (multiple payments per invoice)
- Filters work smoothly
- Tests pass (>90% coverage)

---

### Phase 6: Bill Release Automation (Day 9)

**Goal**: Automatically release bills when AR invoice fully paid

**Tasks:**

1. **Backend - Actions**
   - `ReleaseBillsForInvoiceAction` - Release bills linked to invoice
   - Check bill has no other on-hold reasons (non-compliance, etc.)

2. **Backend - Event Listener**
   - `ArInvoiceFullyPaidListener` - Listen for invoice status change
   - Trigger bill release action

3. **Bill-to-Invoice Association**
   - Create associations when VC funding stream created
   - Link bills that triggered VC workflow to AR invoice

4. **Bill Status Update**
   - Update bill status from "On Hold" to "Released"
   - Only release if no other hold reasons exist

**Tests:**
- Unit tests:
  - ReleaseBillsForInvoiceAction releases correct bills
  - Bills with other hold reasons not released
- Feature tests:
  - Invoice marked fully paid triggers bill release
  - Bills correctly linked to invoices
  - Bills with compliance issues remain on hold
- Integration tests:
  - End-to-end: VC added → Invoice created → Payment received → Bills released

**Success Criteria:**
- Bills automatically released when invoice paid
- No false releases (bills with other hold reasons)
- Tests pass (>90% coverage)

---

### Phase 7: Polish & Edge Cases (Day 10)

**Goal**: Handle edge cases, performance optimization, final testing

**Tasks:**

1. **Edge Cases**
   - Permission removed mid-session (access denied)
   - MYOB sync failure handling (manual refresh, error messaging)
   - Multiple AR invoices linked to one VC
   - Retroactive VC approval (past quarter)

2. **Performance Optimization**
   - Add database indexes (status, package_id, payment_date)
   - Eager load relationships (N+1 prevention)
   - Virtual scrolling for large tables (100+ rows)
   - Cache summary metrics (10-minute TTL)

3. **Accessibility Testing**
   - Keyboard navigation (Tab, Enter, Escape)
   - Screen reader testing (NVDA/JAWS)
   - Focus visibility (`:focus-visible` rings)
   - Color contrast (WCAG AA)

4. **Error Handling**
   - User-friendly error messages
   - Logging (failed approvals, sync errors)
   - Rollback on transaction failures

5. **Documentation**
   - Update CLAUDE.md with VC approval workflow
   - Update context/CONTEXT.md with implementation notes
   - Add inline code comments (why, not what)

**Tests:**
- Browser tests:
  - Edge cases (permission denied, sync failure)
  - Keyboard navigation works
  - Focus visible on all interactive elements
- Performance tests:
  - Table loads in < 2 seconds with 100 rows
  - Filters apply in < 500ms
- Accessibility audit:
  - axe DevTools passes (no violations)

**Success Criteria:**
- All edge cases handled gracefully
- Performance targets met
- Accessibility audit passes (WCAG 2.1 AA)
- Tests pass (>90% coverage)

---

## Testing Strategy

**Approach**: Write tests at each phase. Pest for unit + feature, Dusk/Nightwatch for browser tests.

### Test Coverage by Phase

**Phase 1: Foundation Tests**
- ✅ Unit: Model relationships, casts, validation
- ✅ Feature: Migrations, basic CRUD
- ✅ Browser: N/A

**Phase 2: VC Approval Tests**
- ✅ Unit: ApproveVCFundingStreamAction
- ✅ Feature: Approval endpoints, authorization
- ✅ Browser: Single approval, bulk approval, confirmation modal

**Phase 3: Budget Editing Tests**
- ✅ Unit: AddVCFundingToBudgetAction
- ✅ Feature: Create VC funding stream, validation
- ✅ Browser: Add VC form, retroactive warning

**Phase 4: MYOB Integration Tests**
- ✅ Unit: MyobArInvoiceSyncService, payment status calculation
- ✅ Feature: Sync job, manual sync, upsert logic
- ✅ Browser: N/A (background job)

**Phase 5: Reconciliation Tests**
- ✅ Unit: N/A
- ✅ Feature: Reconciliation endpoint, filters, export
- ✅ Browser: Filter by status, export CSV, summary metrics

**Phase 6: Bill Release Tests**
- ✅ Unit: ReleaseBillsForInvoiceAction
- ✅ Feature: Event listener, bill release logic
- ✅ Browser: N/A (automated)

**Phase 7: Polish Tests**
- ✅ Unit: Edge case handling
- ✅ Feature: Performance, error handling
- ✅ Browser: Accessibility, keyboard navigation

### Test Tools & Location

```
tests/
├── Unit/
│   └── Finance/
│       ├── Actions/
│       │   ├── ApproveVCFundingStreamActionTest.php
│       │   ├── AddVCFundingToBudgetActionTest.php
│       │   └── ReleaseBillsForInvoiceActionTest.php
│       └── Services/
│           └── MyobArInvoiceSyncServiceTest.php
├── Feature/
│   └── Finance/
│       ├── VCApprovalControllerTest.php
│       ├── VCReconciliationControllerTest.php
│       └── PackageBudgetControllerTest.php
└── Browser/
    └── Finance/
        ├── VCApprovalFlowTest.php
        ├── VCReconciliationFlowTest.php
        └── BudgetVCAdditionTest.php
```

### Test Execution Checklist

- [ ] Phase 1: All foundation tests passing
- [ ] Phase 2: VC approval tests passing
- [ ] Phase 3: Budget editing tests passing
- [ ] Phase 4: MYOB integration tests passing
- [ ] Phase 5: Reconciliation tests passing
- [ ] Phase 6: Bill release tests passing
- [ ] Phase 7: All tests passing (full suite)
- [ ] Phase 7: Browser tests passing
- [ ] Coverage report: >90% logic, >80% overall

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| MYOB API failures during sync | Medium | High | Retry logic with exponential backoff; manual refresh button; log all failures |
| Finance unavailable to test next week | Medium | High | Pre-validate workflow with Finance stakeholder before build; async communication |
| Table performance with 100+ rows | Low | Medium | Pagination, virtual scrolling, lazy loading; test with 200+ rows |
| Permission edge cases (removed mid-session) | Low | Low | Frontend checks permissions on every action; backend enforces via policy |
| Partial payment complexity confuses users | Medium | Low | Clear UI labels ("Paid $600 of $1,200"); summary row per invoice |
| Bill release false positives | Low | High | Check all hold reasons before release; comprehensive tests |
| Retroactive VC causes data inconsistency | Low | Medium | Allow only Finance-approved retroactive VCs; audit trail |

---

## Feature Flag Strategy

**Flag Name**: `collections_v2_enabled`

**Rollout Plan:**
1. **Dev/Staging**: 100% enabled for testing
2. **Production Beta (Week 1)**: 10% of Finance users (selected manually)
3. **Production Staged (Week 2)**: 50% of Finance users
4. **Production Full (Week 3)**: 100% of Finance users

**Configuration:**
```php
// config/features.php
return [
    'collections_v2_enabled' => [
        'enabled' => env('FEATURE_COLLECTIONS_V2', false),
        'rollout_percentage' => 0, // 0-100
    ],
];
```

**Usage:**
```php
if (Features::enabled('collections_v2_enabled')) {
    // Collections V2 routes
} else {
    // Fallback to Collections V1 (if exists)
}
```

---

## Next Steps

1. **Run `/speckit.tasks`** - Generate dependency-ordered tasks.md
2. **Create data-model.md** - Entity definitions with fields and relationships
3. **Schedule Finance stakeholder review** - Validate mockups and workflow (30 min)
4. **Run `/speckit.implement`** - Start Phase 1 (Foundation) development
5. **Update context/CONTEXT.md** - Record plan summary and decisions

---

## Notes

- **No Notifications**: Finance works directly from approval table (per clarification)
- **Payment-Level Records**: AR Invoice Payments are unique reconciliation entities (not invoices)
- **Table UI**: Leverages existing table component for fast development
- **Retroactive VC**: Supported with clear ⚠️ warning in UI
- **Bill Release**: Automatic when invoice fully paid (checks other hold reasons)
