---
title: "Quickstart: Funding Reconciliation & Refunds (FRR)"
---

Get up to speed on FRR development in 5 minutes.

---

## What is FRR?

FRR (Funding Reconciliation & Refunds) solves Portal's inability to process refunds. When Finance issues a refund in MYOB, Portal never knew — budgets stayed consumed, bills got blocked, and ~$500K was overclaimed to Services Australia.

**Phase 1**: Detect MYOB adjustments (credits AND debits) via webhook → create adjustments → approve → restore budgets immediately.
**Phase 2**: Net outstanding credits against SA claims by modifying original claim line amounts — no more manual CSV assembly.

**Key Value**: Eliminates the one-way billing deadlock. All three systems (Portal, MYOB, SA) reconcile naturally.

---

## Quick Links

| Document | Purpose |
|----------|---------|
| [spec.md](../spec.md) | Functional requirements, user stories, acceptance criteria |
| [plan.md](../plan.md) | Implementation phases, sprints, architecture decisions |
| [data-model.md](data-model.md) | Entity definitions, relationships, migrations |
| [contracts/adjustments.yaml](contracts/adjustments.yaml) | Adjustments API schemas (Inertia pages + webhook + outstanding credits) |
| [contracts/sa-claims.yaml](contracts/sa-claims.yaml) | SA claims API schemas (internal + external SA API) |
| [IDEA-BRIEF.md](../IDEA-BRIEF.md) | Original idea brief with problem statement |

---

## Core Concepts

### 1. Adjustments (Phase 1)

An **Adjustment** tracks an MYOB adjustment (credit or debit) against a bill. Both types exist:
- **Credit** = same direction as bill (addition/top-up)
- **Debit** = reversal/opposite direction (refund/reduction)

Adjustments follow a strict lifecycle:

```
pending → approved → applied (or voided at any point before applied)
```

When a debit adjustment is approved, the client's budget is restored immediately via `RestoreBudgetFromAdjustmentAction`.

### 2. MYOB Matching Algorithm

Adjustments are matched from MYOB to Portal via:
1. **External Reference ID** = Portal `consumption_id` (budget_plan_item_funding_consumptions.id)
2. **Bill Item ID** = Portal `bill_item_id` (fallback — reliable, survives consumption splits)

MYOB adjustments are only synced when their status = `closed` (after payment run). Lifecycle: `balanced` (draft) → `open` (batched) → `closed` (paid).

### 3. Webhook Sync (Not Polling)

MYOB sends webhook notifications when adjustment status changes. Portal only processes adjustments at `closed` status. Initial historical data loaded via bulk import.

### 4. Outstanding Credit Balances

When a debit adjustment is approved, **OutstandingCreditBalance** records are created per funding allocation. These track how much credit remains unapplied and available for netting against future SA claims.

### 5. Consumption-Driven Netting (Phase 2)

Instead of reversing past SA claims (impossible via their API), FRR nets credits by **modifying original claim line amounts**:
- New services = $100, outstanding credit = $20
- Portal modifies claim line amounts, submits $80 to SA
- SA reconciles at $80, credit marked as "applied"
- All systems agree.

The $36K already claimed to SA was handled this way.

### 6. Batched SA Claim Submissions

Consumptions are aggregated per funding allocation into **ConsumptionClaimSubmission** batches. Finance reviews the netting breakdown before submission. Batched approach reduces API calls and follows industry standard.

---

## Key Files

### Backend (Domain Structure)

```
domain/
├── Finance/
│   └── Adjustment/
│       ├── Models/Adjustment.php, OutstandingCreditBalance.php
│       ├── Actions/Create, Approve, Void, RestoreBudget, CalculateCredits
│       ├── Data/CreateAdjustmentData.php, ApproveAdjustmentData.php
│       ├── EventSourcing/Aggregates/AdjustmentAggregateRoot.php
│       ├── Events/AdjustmentCreated, Approved, Voided, BudgetRestored
│       ├── Services/MYOBAdjustmentMatchingService.php
│       └── Policies/AdjustmentPolicy.php
│
└── Billing/
    └── Claim/
        ├── Models/ConsumptionClaimSubmission.php, ConsumptionClaimApplication.php
        ├── Actions/Validate, Claim, Net, Reconcile
        ├── Data/SAClaimSubmissionData.php, AdjustmentNettingData.php
        ├── Jobs/SubmitConsumptionToSAJob.php, ReconcileSAClaimJob.php
        └── Services/ServicesAustraliaAPIService.php, AdjustmentNettingService.php

app/Http/Controllers/
├── Finance/AdjustmentController.php
├── Billing/SAClaimController.php
└── Api/MYOBWebhookController.php    # NEW: Webhook receiver
```

### Frontend

```
resources/js/Pages/
├── Finance/Adjustments/
│   ├── Index.vue       # Paginated table with direction badges, MYOB links, approve/void
│   ├── Show.vue        # Detail view with consumption link, credit balances, audit trail
│   └── Create.vue      # Manual adjustment form (credit or debit)
└── Billing/Claims/
    └── SAClaimReview.vue  # Review modified line amounts, netting breakdown, submit to SA
```

### Existing Code to Extend

```
domain/Funding/Models/Funding.php                     # Budget restoration target
domain/Budget/Models/BudgetPlanItemFundingConsumption.php  # Consumption source + matching target
```

> **Note**: Unlike VC transactions, adjustments use **webhook sync** (not polling). The existing `SyncMyobTransactionsJob` is NOT extended for this feature.

---

## Development Setup

### 1. Feature Flags

FRR uses Pennant for phased rollout:

```php
// Phase 1: Adjustment system
Feature::define('funding-adjustments', fn () => true);

// Phase 2: SA automated claims
Feature::define('sa-automated-claims', fn () => true);
```

### 2. Run Migrations

```bash
php artisan migrate
```

### 3. Seed Test Data

```bash
php artisan db:seed --class=AdjustmentSeeder
```

### 4. Test Adjustment Creation (Tinker)

```php
$bill = Bill::where('bill_stage', 'paid')->first();
$data = CreateAdjustmentData::from([
    'bill_id' => $bill->id,
    'amount' => -20.00,          // Negative = debit (reversal)
    'direction' => 'debit',
    'reason' => 'Care coordination fee incorrectly charged',
]);
$adjustment = app(CreateAdjustmentAction::class)->execute($data);
// Returns Adjustment in 'pending' status
```

---

## Testing

### Run FRR Tests Only

```bash
php artisan test --compact --filter=Adjustment
php artisan test --compact --filter=SAClaim
php artisan test --compact --filter=MYOBWebhook
```

### Key Test Files

```
tests/Unit/Finance/Adjustment/Actions/       # Action unit tests
tests/Unit/Finance/Adjustment/Services/       # MYOB matching tests
tests/Unit/Billing/Claim/Actions/             # Netting calculation tests
tests/Feature/Finance/Adjustment/             # Adjustment workflow e2e
tests/Feature/Billing/Claim/                  # SA claim submission e2e
tests/Feature/Api/MYOBWebhookTest.php         # Webhook receiver tests
tests/Browser/Finance/AdjustmentIndexTest.php # UI tests
tests/Browser/Billing/SAClaimReviewTest.php   # UI tests
```

---

## Common Tasks

### Approve a Debit Adjustment (Restores Budget)

```php
$adjustment = Adjustment::where('status', 'pending')->where('direction', 'debit')->first();
app(ApproveAdjustmentAction::class)->execute($adjustment, $approverUser);
// Budget restored, OutstandingCreditBalance created
```

### Check Outstanding Credits for a Funding

```php
$credits = OutstandingCreditBalance::where('funding_id', $fundingId)
    ->where('fully_applied', false)
    ->sum('amount');
```

### Void an Adjustment (Reverses Budget)

```php
app(VoidAdjustmentAction::class)->execute($adjustment, $reason, $voidingUser);
// Budget reverted if was approved, adjustment marked 'voided'
```

### Process MYOB Webhook (Simulated)

```php
// Simulate webhook payload for a closed debit adjustment
app(ProcessMYOBWebhookAction::class)->execute([
    'uid' => 'myob-adj-123',
    'status' => 'closed',
    'external_reference_id' => '456',  // Portal consumption ID
    'bill_item_id' => '789',
    'total' => -20.00,
    'adjustment_type' => 'debit',
    'service_date' => '2026-01-15',
]);
```

---

## Architecture Decisions

| Decision | Rationale |
|----------|-----------|
| `funding_id` not `funding_stream_id` on credits | Credits tracked at package-funding level, not globally per stream |
| **Webhook sync** (not polling) | MYOB sends status change notifications. Polling was original plan but meeting confirmed webhook approach preferred |
| Sync only at `closed` status | `balanced` and `open` adjustments are still drafts/in-progress. Only `closed` = completed financial transaction |
| Match via `consumption_id` + `bill_item_id` | MYOB External Reference ID = Portal consumption ID. Bill Item ID is reliable fallback when consumptions are soft-deleted after splits |
| Both credit AND debit directions | MYOB has both types. Credit = same direction as bill, Debit = reversal. Signed amounts with direction field |
| Budget restoration in Adjustment aggregate | Single aggregate owns complete lifecycle, atomic operations |
| **Modify original claim line amounts** for SA netting | $36K already claimed this way. SA doesn't support separate adjustment line items. Reduce claim line amounts instead |
| Batched SA submissions | Fewer API calls, Finance review before submit, 60-day window provides buffer |
| String columns for type/status (not enum) | Easier to add new values without migration, follows CLAUDE.md constraint |
| Event sourcing for adjustments | Financial audit trail requirement, immutable history of all state changes |
| Service date >= Nov 1 for SAH | SAH boundary date — only import adjustments from this date onwards |

---

## Need Help?

- **Spec questions**: Check [spec.md](../spec.md) clarifications section
- **Data model**: Check [data-model.md](data-model.md) for entity details and migration SQL
- **API shapes**: Check [contracts/](contracts/) for request/response schemas
- **Existing patterns**: Look at Collections V2 (`../Collections-V2/`) for similar MYOB + Finance patterns
