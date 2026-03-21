---
title: "Plan"
---


**Branch**: `TP-2329-collections-module`
**Date**: 2025-12-23
**Spec**: [spec.md](spec.md)
**Epic**: TP-2329-COL | Budgets And Services Initiative

---

## Summary

Build a Collections Module in TC Portal to display contribution invoices synced from MyOB and enable Direct Debit enrollment. Phase 1 delivers read-only invoice visibility for recipients, coordinators, and finance users. Phase 2 adds DD enrollment with Australian compliance.

**Technical Approach**:
- New domain `/domain/Collections` for AR invoices and DD mandates
- MyOB sync via scheduled job (hourly) with manual trigger option
- Inertia.js pages integrated into existing package UI
- Permission-gated access via VIEW_FINANCIALS

---

## Technical Context

**Language/Version**: PHP 8.3 / Laravel 12
**Frontend**: Vue 3 + Inertia.js v2 + TypeScript
**Primary Dependencies**: Laravel Data (DTOs), Laravel Horizon (queues), existing MyOB integration (API-014)
**Storage**: MySQL (existing database)
**Testing**: Pest v3 (unit + feature), Dusk v8 (browser)
**Target Platform**: Web (desktop + mobile responsive)
**Performance Goals**: Invoice list loads in <3 seconds (SC-001)
**Constraints**: MyOB API rate limits, hourly sync frequency
**Scale/Scope**: ~5,000 packages, ~50,000 invoices estimated

---

## Constitution Check

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Majestic Monolith | PASS | New `/domain/Collections` within main app |
| II. Domain-Driven Design | PASS | Collections domain with Models, Actions, Controllers |
| III. Convention Over Configuration | PASS | Standard Laravel patterns, config for sync settings |
| IV. Code Quality Standards | PASS | Type hints, descriptive names, PHPDoc |
| V. Testing is First-Class | PASS | Unit + Feature + Browser tests planned |
| VI. Event Sourcing | PASS | Not required - invoices are read-only sync |
| VII. Laravel Data for DTOs | PASS | DTOs for sync data, DD enrollment |
| VIII. Action Classes | PASS | SyncInvoicesAction, CreateDDMandateAction |
| IX. Services Australia Integration | N/A | MyOB integration, not SA |
| X. Inertia.js + Vue 3 | PASS | New pages in existing package UI |
| XI. Accessibility | PASS | WCAG 2.1 AA for invoice table and DD modal |
| XII. Design System | PASS | Following existing component patterns |
| XV. Permissions & Authorization | PASS | VIEW_FINANCIALS permission gate |
| XVI. Compliance & Audit | PASS | Sync logs, DD consent timestamps |

**Result**: All constitution principles satisfied.

---

## Domain Structure

```text
domain/Collections/
├── Models/
│   ├── ArInvoice.php              # Contribution invoice from MyOB
│   ├── InvoiceSyncLog.php         # Sync operation audit log
│   └── DirectDebitMandate.php     # DD agreement per package
├── Actions/
│   ├── SyncInvoicesFromMyobAction.php
│   ├── CalculateInvoiceStatusAction.php
│   ├── CreateDirectDebitMandateAction.php
│   └── ProcessDDLimitExceededAction.php
├── Data/
│   ├── InvoiceSyncData.php
│   ├── CreateDDMandateData.php
│   └── InvoiceSummaryData.php
├── Jobs/
│   └── SyncMyobInvoicesJob.php    # Hourly scheduled job
├── Events/
│   ├── InvoicesSynced.php
│   └── DDMandateCreated.php
└── Policies/
    └── CollectionsPolicy.php      # VIEW_FINANCIALS check
```

---

## Data Model

### ArInvoice (Phase 1)

| Field | Type | Description |
|-------|------|-------------|
| id | bigint | Primary key |
| uuid | uuid | Public identifier |
| package_id | bigint | FK to packages |
| myob_invoice_id | string | MyOB invoice reference |
| invoice_number | string | Display invoice number |
| amount | decimal(10,2) | Invoice amount |
| due_date | date | Payment due date |
| payment_date | date (nullable) | Date paid (null if unpaid) |
| status | enum | Current, New, Overdue, Paid |
| synced_at | timestamp | Last sync from MyOB |
| created_at | timestamp | |
| updated_at | timestamp | |

**Indexes**: `package_id`, `myob_invoice_id`, `status`, `due_date`

### InvoiceSyncLog (Phase 1)

| Field | Type | Description |
|-------|------|-------------|
| id | bigint | Primary key |
| started_at | timestamp | Sync start time |
| completed_at | timestamp (nullable) | Sync end time |
| status | enum | running, success, failed |
| records_processed | int | Invoices synced |
| records_created | int | New invoices |
| records_updated | int | Updated invoices |
| error_message | text (nullable) | Error details if failed |

### DirectDebitMandate (Phase 2)

| Field | Type | Description |
|-------|------|-------------|
| id | bigint | Primary key |
| uuid | uuid | Public identifier |
| package_id | bigint | FK to packages |
| bsb | string(6) | BSB (encrypted) |
| account_number | string(9) | Account (encrypted) |
| account_name | string | Account holder name |
| monthly_limit | decimal(10,2) (nullable) | Optional monthly cap |
| status | enum | Pending, Active, Cancelled |
| consent_timestamp | timestamp | When user agreed |
| consent_reference | string | Unique consent ID |
| created_at | timestamp | |
| updated_at | timestamp | |

**Indexes**: `package_id`, `status`
**Encryption**: BSB and account_number use Laravel's encrypted cast

---

## API Contracts

### Phase 1 Endpoints

```
GET  /api/packages/{package}/collections
     → InvoiceListResource (invoices[], summary, lastSynced)

POST /api/packages/{package}/collections/sync
     → Trigger manual sync (finance users only)

GET  /api/collections/sync-status
     → Latest InvoiceSyncLog
```

### Phase 2 Endpoints

```
GET  /api/packages/{package}/direct-debit
     → DDMandateResource (mandate or null)

POST /api/packages/{package}/direct-debit
     → CreateDDMandateData → DDMandateResource
     Body: { bsb, account_number, account_name, monthly_limit?, agree_terms }

DELETE /api/packages/{package}/direct-debit
     → Cancel mandate (marks as Cancelled, doesn't delete)
```

### Inertia Pages

```
/packages/{package}/collections
     → Finances/Collections/Index.vue
     Props: invoices[], summary, ddMandate, lastSynced

/packages/{package}/collections/direct-debit/create
     → Finances/Collections/DirectDebit/Create.vue (or modal)
     Props: package, agreementTerms
```

---

## UI Components

### Phase 1 Components

| Component | Purpose |
|-----------|---------|
| `InvoiceSummaryCards.vue` | 4 cards: New, Overdue, Current, Paid |
| `InvoiceTable.vue` | Filterable table with status badges |
| `InvoiceStatusBadge.vue` | Status pill (color-coded) |
| `SyncStatusIndicator.vue` | "Last synced X ago" with refresh button |
| `EmptyState.vue` | "No invoices" message |

### Phase 2 Components

| Component | Purpose |
|-----------|---------|
| `DDSetupBanner.vue` | CTA to set up Direct Debit |
| `DDActiveStatus.vue` | Shows active mandate details |
| `DDEnrollmentModal.vue` | 3-step modal wizard |
| `DDStep1BankDetails.vue` | BSB + Account input |
| `DDStep2MonthlyLimit.vue` | Optional limit setting |
| `DDStep3Agreement.vue` | Terms + consent checkbox |
| `DDSuccessConfirmation.vue` | Post-submission success |

---

## Implementation Phases

### Phase 1: AR Invoice Visibility (P1 - ~1.5 sprints)

**1.1 Data Foundation**
- [ ] Create migrations for `ar_invoices` and `invoice_sync_logs`
- [ ] Create ArInvoice and InvoiceSyncLog models with relationships
- [ ] Create InvoiceSyncData and InvoiceSummaryData DTOs
- [ ] Add `HAS_COLLECTIONS` feature flag

**1.2 MyOB Sync**
- [ ] Create SyncInvoicesFromMyobAction (uses existing API-014)
- [ ] Create SyncMyobInvoicesJob (queueable)
- [ ] Create CalculateInvoiceStatusAction (Current/New/Overdue/Paid logic)
- [ ] Schedule hourly job in `Console/Kernel.php`
- [ ] Add manual sync endpoint for finance users

**1.3 API & Controllers**
- [ ] Create CollectionsController with index and sync methods
- [ ] Create CollectionsPolicy (VIEW_FINANCIALS check)
- [ ] Create InvoiceListResource and InvoiceSummaryResource

**1.4 Frontend**
- [ ] Create Collections/Index.vue page
- [ ] Create InvoiceSummaryCards.vue (4 cards)
- [ ] Create InvoiceTable.vue (filterable)
- [ ] Create SyncStatusIndicator.vue
- [ ] Integrate into package UI navigation

**1.5 Testing**
- [ ] Unit tests: CalculateInvoiceStatusAction
- [ ] Feature tests: Collections API endpoints, permissions
- [ ] Browser tests: Invoice list view, empty state

### Phase 2: Direct Debit Enrollment (P2 - ~1-1.5 sprints)

**2.1 Data Foundation**
- [ ] Create migration for `direct_debit_mandates`
- [ ] Create DirectDebitMandate model with encrypted casts
- [ ] Create CreateDDMandateData DTO with BSB validation
- [ ] Add BSB lookup service (bank name from BSB)

**2.2 DD Logic**
- [ ] Create CreateDirectDebitMandateAction
- [ ] Create ProcessDDLimitExceededAction (notification logic)
- [ ] Add DDMandateCreated event

**2.3 API & Controllers**
- [ ] Add DirectDebitController with store and destroy methods
- [ ] Create DDMandateResource
- [ ] Add routes for DD enrollment

**2.4 Frontend**
- [ ] Create DDSetupBanner.vue and DDActiveStatus.vue
- [ ] Create DDEnrollmentModal.vue (3-step wizard)
- [ ] Create step components (Bank, Limit, Agreement)
- [ ] Add DD agreement terms content

**2.5 Testing**
- [ ] Unit tests: BSB validation, limit exceeded logic
- [ ] Feature tests: DD enrollment flow, consent recording
- [ ] Browser tests: 3-step modal, validation errors

### Phase 3: Polish & Hardening

- [ ] Error handling for MyOB sync failures
- [ ] Retry logic for failed syncs
- [ ] Notification for DD limit exceeded
- [ ] Performance optimization (eager loading, caching)
- [ ] Accessibility audit (WCAG 2.1 AA)
- [ ] Full test suite passing

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| MyOB API downtime | Medium | Medium | Graceful degradation, cached data display, "last synced" indicator |
| Invoice mapping errors | Low | High | Comprehensive sync logging, reconciliation reports |
| DD compliance gaps | Low | High | Legal review of agreement terms before Phase 2 |
| Permission (PERM-006) not ready | Low | Medium | Validate dependency early, fallback to existing package permissions |
| BSB validation service unavailable | Low | Low | Cache BSB directory, allow manual entry |

---

## Dependencies

| Dependency | Status | Owner | Notes |
|------------|--------|-------|-------|
| API-014 MyOB Integration | Existing | Backend | Verify polling capability for AR invoices |
| PERM-006 VIEW_FINANCIALS | TBD | Backend | Need to confirm implementation |
| Legal DD Agreement Terms | TBD | Legal | Required before Phase 2 |
| Support at Home Launch | Nov 2025 | Program | Phase 1 must complete by Sep 2025 |

---

## Next Steps

1. Run `/speckit.tasks` to generate tasks.md with dependency ordering
2. Validate PERM-006 (VIEW_FINANCIALS) implementation status
3. Confirm MyOB API-014 can poll contribution invoices
4. Schedule legal review for DD agreement terms (Phase 2 blocker)
5. Run `/speckit.implement` to begin development

---

## Appendix: Invoice Status Logic

```php
// CalculateInvoiceStatusAction logic
public function execute(ArInvoice $invoice): InvoiceStatus
{
    if ($invoice->payment_date !== null) {
        return InvoiceStatus::Paid;
    }

    $today = now()->startOfDay();
    $dueDate = $invoice->due_date->startOfDay();

    if ($dueDate->isAfter($today)) {
        return InvoiceStatus::Current; // Future due date
    }

    $daysPastDue = $dueDate->diffInDays($today);

    if ($daysPastDue <= 7) {
        return InvoiceStatus::New; // Within 7-day payment terms
    }

    return InvoiceStatus::Overdue; // Past 7-day terms
}
```
