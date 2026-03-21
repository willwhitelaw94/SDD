---
title: "Data Model: Funding Reconciliation & Refunds (FRR)"
---

**Epic**: FRR | **Created**: 2026-02-12 | **Updated**: 2026-02-12 | **Status**: Draft

> **Meeting Update (2026-02-12)**: MYOB Adjustments Discovery session revealed key changes to matching algorithm, adjustment types, sync mechanism, and MYOB status lifecycle. All entities updated accordingly.

---

## Entity Relationships

```
Bill (1) ──→ (N) Adjustments
                    │
                    ├──→ (N) OutstandingCreditBalances ──→ Funding (via funding_id)
                    │
                    └──→ (N) ConsumptionClaimApplications ──→ ConsumptionClaimSubmission
                                                                       │
                                                                       ↓
                                                              BudgetPlanItemFundingConsumption (1)


User (1) ──→ approved_by / voided_by / submitted_by ──→ Adjustments, ConsumptionClaimSubmissions
```

### Simplified Flow

```
MYOB Adjustment (closed) ──(webhook/bulk import)──→ Adjustment (pending)
                                                          │
                                                          ├──(approve)──→ Budget Restored (OutstandingCreditBalance created)
                                                          │
                                                          └──(net)──→ ConsumptionClaimApplication ──→ ConsumptionClaimSubmission ──→ SA API
```

---

## Key Changes from Discovery Meeting

| Area | Before (Plan) | After (Meeting) |
|------|--------------|-----------------|
| **Matching key** | `myob_reference_number` on bill | External Reference ID = Portal **Consumption ID**; Bill Item ID as fallback |
| **Adjustment types** | Credit only (positive amount) | Both **credit** (same direction as bill) and **debit** (reversal/opposite) |
| **Amount sign** | Always positive | Signed: positive = increase, negative = decrease. `direction` field disambiguates |
| **Sync mechanism** | 15-min polling via `SyncMyobTransactionsJob` | **Webhook** for ongoing sync + initial **bulk import**. Sync at `closed` status only |
| **MYOB status lifecycle** | Not tracked | `balanced` (draft) → `open` (batched) → `closed` (paid) |
| **SA claiming** | Separate netting line items | Modify **original claim line amounts** (not separate submissions) |
| **Soft-deleted consumptions** | Not considered | Original consumption IDs may be soft-deleted after claim splits; `bill_item_id` is reliable |

---

## Entities

### 1. Adjustment

**Table**: `adjustments`

**Purpose**: Tracks MYOB adjustments (credits and debits) against bills. Core entity for Phase 1. Each adjustment represents a financial correction synced from MYOB or raised manually by Finance.

**Fields:**

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | bigint UNSIGNED | PK, AUTO_INCREMENT | Primary key |
| `uuid` | char(36) | UNIQUE, NOT NULL | Public identifier for API/URL usage |
| `bill_id` | bigint UNSIGNED | FK bills.id, NOT NULL | Original bill being adjusted |
| `bill_item_id` | bigint UNSIGNED | FK bill_items.id, NULL | Specific bill line item (reliable link, survives consumption splits) |
| `consumption_id` | bigint UNSIGNED | FK budget_plan_item_funding_consumptions.id, NULL | Original Portal consumption ID (MYOB External Reference ID). May be soft-deleted after splits |
| `myob_uid` | varchar(255) | NULL | MYOB adjustment UID for API cross-reference |
| `myob_reference_number` | varchar(255) | NULL | MYOB transaction reference |
| `amount` | decimal(10,2) | NOT NULL | Adjustment amount (**signed**: positive = increase/credit, negative = decrease/debit) |
| `direction` | varchar(10) | NOT NULL | `'credit'` (same direction as bill) or `'debit'` (reversal/opposite) |
| `type` | varchar(20) | NOT NULL | `'myob_detected'` or `'manual'` |
| `status` | varchar(20) | NOT NULL, DEFAULT `'pending'` | `'pending'`, `'approved'`, `'voided'`, `'applied'` |
| `myob_status` | varchar(20) | NULL | MYOB lifecycle: `'balanced'`, `'open'`, `'closed'`. Only sync when `closed` |
| `approved_by_user_id` | bigint UNSIGNED | FK users.id, NULL | Finance user who approved |
| `voided_by_user_id` | bigint UNSIGNED | FK users.id, NULL | Finance user who voided |
| `reason` | text | NULL | Required if type = `'manual'`, optional for MYOB-detected |
| `service_date` | date | NULL | Service date from MYOB (filter: 1st November onwards for SAH) |
| `detected_at` | timestamp | NULL | When MYOB adjustment was detected |
| `approved_at` | timestamp | NULL | When adjustment was approved |
| `voided_at` | timestamp | NULL | When adjustment was voided |
| `applied_at` | timestamp | NULL | When fully netted against SA claim(s) |
| `created_at` | timestamp | NOT NULL | Record creation |
| `updated_at` | timestamp | NOT NULL | Last update |
| `deleted_at` | timestamp | NULL | Soft delete |

**Indexes:**
- `idx_adjustments_bill_id` ON (`bill_id`)
- `idx_adjustments_bill_item_id` ON (`bill_item_id`)
- `idx_adjustments_consumption_id` ON (`consumption_id`)
- `idx_adjustments_myob_uid` ON (`myob_uid`)
- `idx_adjustments_status` ON (`status`)
- `idx_adjustments_direction` ON (`direction`)
- `idx_adjustments_type` ON (`type`)
- `idx_adjustments_myob_status` ON (`myob_status`)
- `idx_adjustments_service_date` ON (`service_date`)
- `idx_adjustments_uuid` ON (`uuid`) — UNIQUE

**Relationships:**
- `belongsTo(Bill::class)` via `bill_id`
- `belongsTo(BillItem::class)` via `bill_item_id` (nullable)
- `belongsTo(BudgetPlanItemFundingConsumption::class, 'consumption_id')` (nullable, may be soft-deleted)
- `belongsTo(User::class, 'approved_by_user_id')` — Approver
- `belongsTo(User::class, 'voided_by_user_id')` — Voider
- `hasMany(OutstandingCreditBalance::class)`
- `hasMany(ConsumptionClaimApplication::class)`

**State Transitions:**
```
pending ──(approve)──→ approved     [triggers budget restoration for debits]
approved ──(apply)──→ applied       [fully netted against SA claims]
pending ──(void)──→ voided          [cancelled before approval]
approved ──(void)──→ voided         [cancelled after approval, budget reverted]
```

**Validation Rules:**
- `direction` must be `'credit'` or `'debit'`
- For debits: `amount` should be negative (reversal reduces consumption)
- For credits: `amount` should be positive (addition increases consumption)
- `bill_item_id` or `consumption_id` required for MYOB-detected adjustments
- `reason` required when `type` = `'manual'`
- Cannot void after status = `'applied'`
- MYOB-detected adjustments only imported when `myob_status` = `'closed'`

**MYOB Matching Algorithm:**

For **debit notes** specifically, there's no clean direct link on the debit note header itself. The association must be built from the line item level:

1. Each debit note **line item** has a `Bill Item ID` field
2. **Left join** `bill_item_id` to Portal's `bill_items` table — if the debit note line item matches an existing original bill line item, that creates the association
3. From matched `bill_item_id` → resolve `bill_id` for the parent bill relationship
4. The `External Reference ID` on the line item maps to Portal `consumption_id` (budget_plan_item_funding_consumptions.id) — this is a bonus link but may be soft-deleted after claim splits

**Priority order:**
1. `bill_item_id` (from debit note line item → left join to bill_items) — **primary, reliable path**
2. `consumption_id` (from External Reference ID) — **secondary, may be soft-deleted**
3. Store both for maximum traceability

**Event Sourcing Events:**
- `AdjustmentCreated` — Initial detection or manual creation
- `AdjustmentApproved` — Finance approval + budget restoration
- `AdjustmentVoided` — Cancellation with rollback
- `BudgetRestoredFromAdjustment` — Budget increase recorded (debit adjustments only)

---

### 2. OutstandingCreditBalance

**Table**: `outstanding_credit_balances`

**Purpose**: Tracks unapplied adjustment amounts per client/funding allocation. When a debit adjustment is approved, credit balances are created per funding allocation on the bill. These balances are consumed when netted against SA claims.

> **Note**: Only **debit** adjustments (reversals) create outstanding credit balances, since they represent money owed back that needs to be netted against future SA claims.

**Fields:**

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | bigint UNSIGNED | PK, AUTO_INCREMENT | Primary key |
| `adjustment_id` | bigint UNSIGNED | FK adjustments.id, NOT NULL | Parent adjustment |
| `funding_id` | bigint UNSIGNED | FK fundings.id, NOT NULL | Specific funding allocation (links to package + funding stream) |
| `amount` | decimal(10,2) | NOT NULL, >= 0 | Remaining credit available for netting |
| `original_amount` | decimal(10,2) | NOT NULL, > 0 | Initial credit amount when created |
| `fully_applied` | boolean | NOT NULL, DEFAULT false | True when `amount` = 0 |
| `created_at` | timestamp | NOT NULL | Record creation |
| `updated_at` | timestamp | NOT NULL | Last update |

**Indexes:**
- `idx_ocb_adjustment_id` ON (`adjustment_id`)
- `idx_ocb_funding_id` ON (`funding_id`)
- `idx_ocb_fully_applied` ON (`fully_applied`)

**Relationships:**
- `belongsTo(Adjustment::class)`
- `belongsTo(Funding::class)` — Links to specific package funding allocation

**Validation Rules:**
- `amount` >= 0
- `amount` <= `original_amount`
- `original_amount` > 0
- When `amount` reaches 0, `fully_applied` must be set to `true`

**Design Notes:**
- Uses `funding_id` (not `funding_stream_id`) because credits must be tracked at the package-funding level, not globally per stream
- `Funding` model already tracks `services_australia_*` amounts, so this aligns with existing reconciliation patterns
- Multiple credit balances per adjustment possible when a bill spans multiple funding allocations

---

### 3. ConsumptionClaimSubmission

**Table**: `consumption_claim_submissions`

**Purpose**: Tracks SA claim submissions with netting applied. Each record represents a batch of consumptions submitted to Services Australia, with any outstanding credits netted by modifying original claim line amounts (not separate submissions).

> **Meeting Update**: SA claims are handled by modifying original claim line amounts, not creating separate netting line items. The $36K already claimed was done this way.

**Fields:**

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | bigint UNSIGNED | PK, AUTO_INCREMENT | Primary key |
| `uuid` | char(36) | UNIQUE, NOT NULL | Public identifier |
| `funding_id` | bigint UNSIGNED | FK fundings.id, NOT NULL | Funding allocation being claimed |
| `claim_amount` | decimal(10,2) | NOT NULL, >= 0 | Final amount claimed to SA (after netting) |
| `original_amount` | decimal(10,2) | NOT NULL, > 0 | Pre-netting total of all consumptions in batch |
| `adjustments_netted` | decimal(10,2) | NOT NULL, DEFAULT 0 | Total adjustments deducted |
| `sa_claim_reference` | varchar(255) | NULL, UNIQUE when NOT NULL | SA API response reference |
| `status` | varchar(20) | NOT NULL, DEFAULT `'pending'` | `'pending'`, `'submitted'`, `'reconciled'`, `'rejected'` |
| `submitted_by_user_id` | bigint UNSIGNED | FK users.id, NULL | Finance user who submitted |
| `submitted_at` | timestamp | NULL | When submitted to SA API |
| `reconciled_at` | timestamp | NULL | When SA response reconciled |
| `created_at` | timestamp | NOT NULL | Record creation |
| `updated_at` | timestamp | NOT NULL | Last update |
| `deleted_at` | timestamp | NULL | Soft delete |

**Indexes:**
- `idx_ccs_funding_id` ON (`funding_id`)
- `idx_ccs_status` ON (`status`)
- `idx_ccs_sa_claim_reference` ON (`sa_claim_reference`) — UNIQUE
- `idx_ccs_uuid` ON (`uuid`) — UNIQUE

**Relationships:**
- `belongsTo(Funding::class)` — Funding allocation claimed
- `belongsTo(User::class, 'submitted_by_user_id')` — Submitter
- `hasMany(ConsumptionClaimApplication::class)` — Adjustments applied to this claim
- `belongsToMany(BudgetPlanItemFundingConsumption::class)` — Consumptions included in batch (via pivot)

**Validation Rules:**
- `claim_amount` >= 0
- `claim_amount` = `original_amount` - `adjustments_netted`
- `original_amount` > 0
- `adjustments_netted` >= 0
- `adjustments_netted` <= `original_amount` (claim cannot go negative)

**State Transitions:**
```
pending ──(submit)──→ submitted     [sent to SA API]
submitted ──(reconcile)──→ reconciled  [SA confirmed]
submitted ──(reject)──→ rejected       [SA rejected, adjustments rolled back]
```

---

### 4. ConsumptionClaimApplication

**Table**: `consumption_claim_applications`

**Purpose**: Join table linking adjustments to SA claims. Records exactly how much of each adjustment was applied (netted) against a specific claim. Supports partial application when a credit spans multiple claim cycles.

**Fields:**

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | bigint UNSIGNED | PK, AUTO_INCREMENT | Primary key |
| `consumption_claim_submission_id` | bigint UNSIGNED | FK consumption_claim_submissions.id, NOT NULL | Claim this application belongs to |
| `adjustment_id` | bigint UNSIGNED | FK adjustments.id, NOT NULL | Adjustment being applied |
| `amount_applied` | decimal(10,2) | NOT NULL, > 0 | Portion of adjustment used for this claim |
| `applied_at` | timestamp | NOT NULL, DEFAULT CURRENT_TIMESTAMP | When applied |

**Indexes:**
- `idx_cca_submission_id` ON (`consumption_claim_submission_id`)
- `idx_cca_adjustment_id` ON (`adjustment_id`)

**Relationships:**
- `belongsTo(ConsumptionClaimSubmission::class)`
- `belongsTo(Adjustment::class)`

**Validation Rules:**
- `amount_applied` > 0
- Sum of `amount_applied` for an adjustment across all applications <= adjustment `amount`
- `adjustment.status` must be `'approved'` at time of application

---

## Interactions with Existing Models

### Bill (`app/Models/Bill/Bill.php`)
- **Table**: `bills` | **PK**: `id` (bigint)
- **Key field**: `myob_reference_number` — secondary reference (not primary matching key)
- **New relationship**: `hasMany(Adjustment::class)`
- **No schema changes required**

### BillItem (bill line items)
- **Table**: `bill_items` | **PK**: `id` (bigint)
- **Key field**: `id` — MYOB `Bill Item ID` maps here. Reliable link that survives consumption splits
- **New relationship**: `hasMany(Adjustment::class, 'bill_item_id')`
- **No schema changes required**

### BudgetPlanItemFundingConsumption (`domain/Budget/Models/BudgetPlanItemFundingConsumption.php`)
- **Table**: `budget_plan_item_funding_consumptions` | **PK**: `id` (bigint)
- **Status field**: `status` (FundingConsumptionStatus enum) — consumption state tracking
- **Key fields**: `funding_id`, `total_amount`, `service_date`
- **MYOB External Reference ID**: Maps to `id` on this table. May be soft-deleted after claim splits
- **New relationship**: `belongsToMany(ConsumptionClaimSubmission::class)` via pivot
- **No schema changes required**

### Funding (`domain/Funding/Models/Funding.php`)
- **Table**: `fundings` | **PK**: `id` (bigint)
- **Key fields**: `services_australia_total_amount`, `services_australia_available_amount`, `tc_used_amount`
- **Budget restoration**: `RestoreBudgetFromAdjustmentAction` modifies funding amounts
- **New relationships**: `hasMany(OutstandingCreditBalance::class)`, `hasMany(ConsumptionClaimSubmission::class)`
- **No schema changes required** — budget modification done via existing event-sourced patterns

### FundingStream (`domain/Funding/Models/FundingStream.php`)
- **Table**: `funding_streams` | **PK**: `id` (bigint)
- **Key field**: `is_services_australia` (boolean) — determines SA eligibility
- **No direct relationship to new entities** — access via `Funding.funding_stream_id`

### Transaction (`domain/Transaction/Models/Transaction.php`)
- **Table**: `transactions` | **PK**: `id` (bigint)
- **Key field**: `reference_number` — MYOB transaction reference, used for cross-referencing
- **Constant**: `VC_ACCOUNT = '2480'` — Voluntary Contribution GL code
- **MYOB sync**: Existing `SyncMyobTransactionsJob` pattern — but adjustments use **webhook** approach instead

---

## Migration Plan

**Order of execution** (respects foreign key dependencies):

### Migration 1: Create `adjustments` table

```php
Schema::create('adjustments', function (Blueprint $table) {
    $table->id();
    $table->uuid('uuid')->unique();
    $table->foreignId('bill_id')->constrained('bills');
    $table->foreignId('bill_item_id')->nullable()->constrained('bill_items')->nullOnDelete();
    $table->foreignId('consumption_id')->nullable()->constrained('budget_plan_item_funding_consumptions')->nullOnDelete();
    $table->string('myob_uid')->nullable();
    $table->string('myob_reference_number')->nullable();
    $table->decimal('amount', 10, 2);                      // Signed: positive=credit, negative=debit
    $table->string('direction', 10);                        // 'credit', 'debit'
    $table->string('type', 20);                             // 'myob_detected', 'manual'
    $table->string('status', 20)->default('pending');       // pending, approved, voided, applied
    $table->string('myob_status', 20)->nullable();          // balanced, open, closed
    $table->foreignId('approved_by_user_id')->nullable()->constrained('users')->nullOnDelete();
    $table->foreignId('voided_by_user_id')->nullable()->constrained('users')->nullOnDelete();
    $table->text('reason')->nullable();
    $table->date('service_date')->nullable();
    $table->timestamp('detected_at')->nullable();
    $table->timestamp('approved_at')->nullable();
    $table->timestamp('voided_at')->nullable();
    $table->timestamp('applied_at')->nullable();
    $table->timestamps();
    $table->softDeletes();

    $table->index('bill_item_id', 'idx_adjustments_bill_item_id');
    $table->index('consumption_id', 'idx_adjustments_consumption_id');
    $table->index('myob_uid', 'idx_adjustments_myob_uid');
    $table->index('myob_reference_number', 'idx_adjustments_myob_reference');
    $table->index('status', 'idx_adjustments_status');
    $table->index('direction', 'idx_adjustments_direction');
    $table->index('type', 'idx_adjustments_type');
    $table->index('myob_status', 'idx_adjustments_myob_status');
    $table->index('service_date', 'idx_adjustments_service_date');
});
```

### Migration 2: Create `outstanding_credit_balances` table

```php
Schema::create('outstanding_credit_balances', function (Blueprint $table) {
    $table->id();
    $table->foreignId('adjustment_id')->constrained('adjustments');
    $table->foreignId('funding_id')->constrained('fundings');
    $table->decimal('amount', 10, 2);
    $table->decimal('original_amount', 10, 2);
    $table->boolean('fully_applied')->default(false);
    $table->timestamps();

    $table->index('funding_id', 'idx_ocb_funding_id');
    $table->index('fully_applied', 'idx_ocb_fully_applied');
});
```

### Migration 3: Create `consumption_claim_submissions` table

```php
Schema::create('consumption_claim_submissions', function (Blueprint $table) {
    $table->id();
    $table->uuid('uuid')->unique();
    $table->foreignId('funding_id')->constrained('fundings');
    $table->decimal('claim_amount', 10, 2);
    $table->decimal('original_amount', 10, 2);
    $table->decimal('adjustments_netted', 10, 2)->default(0);
    $table->string('sa_claim_reference')->nullable()->unique();
    $table->string('status', 20)->default('pending'); // pending, submitted, reconciled, rejected
    $table->foreignId('submitted_by_user_id')->nullable()->constrained('users')->nullOnDelete();
    $table->timestamp('submitted_at')->nullable();
    $table->timestamp('reconciled_at')->nullable();
    $table->timestamps();
    $table->softDeletes();

    $table->index('status', 'idx_ccs_status');
});
```

### Migration 4: Create `consumption_claim_applications` table

```php
Schema::create('consumption_claim_applications', function (Blueprint $table) {
    $table->id();
    $table->foreignId('consumption_claim_submission_id')->constrained('consumption_claim_submissions');
    $table->foreignId('adjustment_id')->constrained('adjustments');
    $table->decimal('amount_applied', 10, 2);
    $table->timestamp('applied_at')->useCurrent();

    $table->index('consumption_claim_submission_id', 'idx_cca_submission_id');
    $table->index('adjustment_id', 'idx_cca_adjustment_id');
});
```

---

## Example Data Flow

### Scenario: $20 Debit Adjustment (Reversal) — Full Lifecycle

**1. MYOB Adjustment Detected** (via webhook when status = `closed`)

```
Adjustment created:
- bill_id: 456 (resolved from bill_item_id)
- bill_item_id: 789 (MYOB Bill Item ID — reliable link)
- consumption_id: 123 (MYOB External Reference ID — may be soft-deleted)
- myob_uid: 'abc-123-def'
- amount: -20.00 (negative = debit/reversal)
- direction: 'debit'
- type: 'myob_detected'
- status: 'pending'
- myob_status: 'closed'
- service_date: 2026-01-15
- detected_at: 2026-02-12 10:15:00
```

**2. Finance Approves Adjustment**

```
Adjustment updated:
- status: 'approved'
- approved_by_user_id: 789 (Finance Manager)
- approved_at: 2026-02-12 11:00:00

OutstandingCreditBalance created:
- adjustment_id: 1
- funding_id: 42 (Home Support Ongoing for this package)
- amount: 20.00 (absolute value for netting)
- original_amount: 20.00
- fully_applied: false

Funding 42 budget restored:
- tc_used_amount decreased by $20
```

**3. Next SA Claim Cycle** (original claim line amounts modified)

```
ConsumptionClaimSubmission created:
- funding_id: 42
- original_amount: 100.00 (sum of new consumptions)
- adjustments_netted: 20.00
- claim_amount: 80.00  (100 - 20, claim line amounts reduced)
- status: 'pending'

ConsumptionClaimApplication created:
- consumption_claim_submission_id: 1
- adjustment_id: 1
- amount_applied: 20.00
- applied_at: 2026-02-15 09:00:00

OutstandingCreditBalance updated:
- amount: 0.00
- fully_applied: true
```

**4. SA Reconciles**

```
ConsumptionClaimSubmission updated:
- sa_claim_reference: 'SA-CLAIM-789'
- status: 'reconciled'
- reconciled_at: 2026-02-16 14:30:00

Adjustment updated:
- status: 'applied'
- applied_at: 2026-02-16 14:30:00
```

---

## MYOB Sync Architecture

### Webhook-Based Sync (Primary — Ongoing)

```
MYOB Adjustment Status Change → Webhook → Portal Endpoint
                                               │
                                               ├── Filter: myob_status = 'closed' only
                                               ├── Match: External Reference ID → consumption_id
                                               ├── Fallback: Bill Item ID → bill_item_id → bill_id
                                               └── Create Adjustment (pending)
```

### Bulk Import (Initial — One-time)

```
Query MYOB API → All adjustments with service_date >= 2024-11-01
                      │
                      ├── Filter: status = 'closed'
                      ├── Match each to Portal consumption/bill
                      └── Create Adjustments (pending) for Finance review
```

### MYOB Status Lifecycle

```
balanced (draft) ──→ open (batched in payment run) ──→ closed (paid)
                                                         ↑
                                                    Only sync here
```

**Important**: Do NOT sync adjustments at `balanced` or `open` status. Only `closed` adjustments represent completed financial transactions.

---

## Database Constraints

**Foreign Key Constraints:**
- `adjustments.bill_id` → `bills.id` (RESTRICT on delete)
- `adjustments.bill_item_id` → `bill_items.id` (SET NULL on delete)
- `adjustments.consumption_id` → `budget_plan_item_funding_consumptions.id` (SET NULL on delete)
- `adjustments.approved_by_user_id` → `users.id` (SET NULL on delete)
- `adjustments.voided_by_user_id` → `users.id` (SET NULL on delete)
- `outstanding_credit_balances.adjustment_id` → `adjustments.id` (CASCADE on delete)
- `outstanding_credit_balances.funding_id` → `fundings.id` (CASCADE on delete)
- `consumption_claim_submissions.funding_id` → `fundings.id` (RESTRICT on delete)
- `consumption_claim_submissions.submitted_by_user_id` → `users.id` (SET NULL on delete)
- `consumption_claim_applications.consumption_claim_submission_id` → `consumption_claim_submissions.id` (CASCADE on delete)
- `consumption_claim_applications.adjustment_id` → `adjustments.id` (CASCADE on delete)

**Unique Constraints:**
- `adjustments.uuid`
- `consumption_claim_submissions.uuid`
- `consumption_claim_submissions.sa_claim_reference` (nullable unique)

---

## Performance Considerations

**Indexes:** All foreign keys indexed. Status, direction, type, myob_status, service_date indexed for filtered queries.

**Denormalization:**
- `adjustments_netted` stored on `consumption_claim_submissions` (avoids SUM query on applications)
- `fully_applied` flag on `outstanding_credit_balances` (avoids checking `amount = 0` in queries)

**Eager Loading:**
```php
Adjustment::with(['bill', 'billItem', 'approvedBy', 'creditBalances'])->get();
ConsumptionClaimSubmission::with(['funding.fundingStream', 'applications.adjustment'])->get();
OutstandingCreditBalance::where('fully_applied', false)->with(['adjustment', 'funding'])->get();
```

**Pagination:** Adjustments Index: 25 rows per page (server-side).

---

## Factories & Seeders

- `AdjustmentFactory` — States: `pending`, `approved`, `voided`, `applied`, `manual`, `myobDetected`, `credit`, `debit`
- `OutstandingCreditBalanceFactory` — States: `partial`, `fullyApplied`
- `ConsumptionClaimSubmissionFactory` — States: `pending`, `submitted`, `reconciled`, `rejected`
- `ConsumptionClaimApplicationFactory`
- `AdjustmentSeeder` — 10 pending + 5 approved + 3 applied adjustments (mix of credits and debits) with credit balances
