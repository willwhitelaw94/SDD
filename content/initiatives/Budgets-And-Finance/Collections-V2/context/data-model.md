---
title: "Data Model: Collections V2 - VC Approval & Reconciliation"
---


**Epic**: TP-2285-COL2
**Created**: 2026-01-16
**Status**: Draft

---

## Entity Relationships

```
Package (1) ──→ (N) VC Funding Streams
                         │
                         ↓
                    VC Funding Stream (1) ──→ (N) AR Invoices
                                                        │
                                                        ├──→ (N) AR Invoice Payments ⭐
                                                        │
                                                        └──→ (N) Bill-to-Invoice Associations
                                                                      │
                                                                      ↓
                                                                   Bill (1)
```

---

## Entities

### 1. VC Funding Stream

**Table**: `vc_funding_streams`

**Purpose**: Represents a Voluntary Contribution added to a package budget by a Care Partner.

**Fields:**

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | bigint UNSIGNED | PK, AUTO_INCREMENT | Primary key |
| `uuid` | char(36) | UNIQUE, NOT NULL | Public identifier |
| `package_id` | bigint UNSIGNED | FK packages.id, NOT NULL | Package reference |
| `amount` | decimal(10,2) | NOT NULL, > 0 | VC amount |
| `period_quarter_id` | bigint UNSIGNED | FK quarters.id, NOT NULL | Budget period/quarter |
| `status` | enum('pending', 'approved') | NOT NULL, DEFAULT 'pending' | Approval status |
| `added_by_user_id` | bigint UNSIGNED | FK users.id, NOT NULL | Care Partner who added |
| `approved_by_user_id` | bigint UNSIGNED | FK users.id, NULL | Finance user who approved |
| `approved_at` | timestamp | NULL | Approval timestamp |
| `notes` | text | NULL | Optional notes from Care Partner |
| `created_at` | timestamp | NOT NULL | Record creation |
| `updated_at` | timestamp | NOT NULL | Last update |

**Indexes:**
- `idx_vc_funding_streams_status` ON (`status`)
- `idx_vc_funding_streams_package` ON (`package_id`)
- `idx_vc_funding_streams_period` ON (`period_quarter_id`)
- `idx_vc_funding_streams_created` ON (`created_at`)

**Relationships:**
- `belongsTo(Package)`
- `belongsTo(Quarter)` - period_quarter_id
- `belongsTo(User)` - added_by_user_id
- `belongsTo(User)` - approved_by_user_id
- `hasMany(ArInvoice)`
- `hasMany(VcApprovalLog)`

**State Transitions:**
```
pending ──(approve)──> approved
```

**Validation Rules:**
- `amount` > 0
- `period_quarter_id` must exist
- `package_id` must exist
- `status` must be 'pending' or 'approved'

---

### 2. AR Invoice

**Table**: `ar_invoices`

**Purpose**: Accounts Receivable invoice synced from MYOB, linked to VC Funding Stream.

**Fields:**

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | bigint UNSIGNED | PK, AUTO_INCREMENT | Primary key |
| `uuid` | char(36) | UNIQUE, NOT NULL | Public identifier |
| `vc_funding_stream_id` | bigint UNSIGNED | FK vc_funding_streams.id, NOT NULL | VC funding stream reference |
| `invoice_number` | varchar(50) | UNIQUE, NOT NULL | MYOB invoice number (e.g., INV-2024-001) |
| `invoice_amount` | decimal(10,2) | NOT NULL, > 0 | Total invoice amount |
| `due_date` | date | NOT NULL | Payment due date |
| `myob_invoice_id` | varchar(100) | UNIQUE, NOT NULL | MYOB unique ID |
| `myob_sync_timestamp` | timestamp | NOT NULL | Last synced from MYOB |
| `created_at` | timestamp | NOT NULL | Record creation |
| `updated_at` | timestamp | NOT NULL | Last update |

**Derived Fields (not stored):**
- `status` (calculated): "Not Yet Invoiced" | "Partially Paid" | "Fully Paid" | "Overdue"
  - Logic: `SUM(ar_invoice_payments.payment_amount)` vs `invoice_amount`
  - Overdue: `due_date < NOW() AND status != 'Fully Paid'`

**Indexes:**
- `idx_ar_invoices_vc_funding_stream` ON (`vc_funding_stream_id`)
- `idx_ar_invoices_number` ON (`invoice_number`)
- `idx_ar_invoices_due_date` ON (`due_date`)
- `idx_ar_invoices_myob_id` ON (`myob_invoice_id`)

**Relationships:**
- `belongsTo(VcFundingStream)`
- `hasMany(ArInvoicePayment)`
- `hasMany(BillInvoiceAssociation)`

**MYOB Sync Rules:**
- Upsert by `myob_invoice_id` (idempotent)
- Only sync invoices with GL code 2480 (VC invoices)
- Update `myob_sync_timestamp` on each sync

---

### 3. AR Invoice Payment ⭐

**Table**: `ar_invoice_payments`

**Purpose**: Child record of AR Invoice. Represents a single payment against an invoice. **Primary reconciliation entity.**

**Fields:**

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | bigint UNSIGNED | PK, AUTO_INCREMENT | Primary key |
| `uuid` | char(36) | UNIQUE, NOT NULL | Public identifier |
| `ar_invoice_id` | bigint UNSIGNED | FK ar_invoices.id, NOT NULL | Parent invoice |
| `vc_funding_stream_id` | bigint UNSIGNED | FK vc_funding_streams.id, NOT NULL | Denormalized for fast lookup |
| `payment_reference` | varchar(100) | UNIQUE, NOT NULL | MYOB payment reference (e.g., PAY-001-A) |
| `payment_amount` | decimal(10,2) | NOT NULL, > 0 | Payment amount |
| `payment_date` | date | NOT NULL | Date payment received |
| `payment_method` | enum('bank_transfer', 'direct_debit', 'credit_card', 'other') | NOT NULL | Payment method |
| `myob_payment_id` | varchar(100) | UNIQUE, NOT NULL | MYOB unique payment ID |
| `myob_sync_timestamp` | timestamp | NOT NULL | Last synced from MYOB |
| `created_at` | timestamp | NOT NULL | Record creation |
| `updated_at` | timestamp | NOT NULL | Last update |

**Indexes:**
- `idx_ar_invoice_payments_invoice` ON (`ar_invoice_id`)
- `idx_ar_invoice_payments_vc_funding` ON (`vc_funding_stream_id`)
- `idx_ar_invoice_payments_date` ON (`payment_date`)
- `idx_ar_invoice_payments_reference` ON (`payment_reference`)
- `idx_ar_invoice_payments_myob_id` ON (`myob_payment_id`)

**Relationships:**
- `belongsTo(ArInvoice)`
- `belongsTo(VcFundingStream)` - denormalized for performance

**MYOB Sync Rules:**
- Upsert by `myob_payment_id` (idempotent)
- Multiple payments per invoice supported (partial payments)
- Update `myob_sync_timestamp` on each sync

**Validation Rules:**
- `payment_amount` > 0
- `payment_amount` <= `ar_invoice.invoice_amount` (cumulative check)
- `payment_date` must be valid date
- `payment_method` must be valid enum value

---

### 4. Bill-to-Invoice Association

**Table**: `bill_invoice_associations`

**Purpose**: Links bills that triggered the VC workflow to their related AR invoice. Enables automatic bill release when invoice is fully paid.

**Fields:**

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | bigint UNSIGNED | PK, AUTO_INCREMENT | Primary key |
| `uuid` | char(36) | UNIQUE, NOT NULL | Public identifier |
| `bill_id` | bigint UNSIGNED | FK bills.id, NOT NULL | Bill reference |
| `ar_invoice_id` | bigint UNSIGNED | FK ar_invoices.id, NOT NULL | AR invoice reference |
| `created_at` | timestamp | NOT NULL | Record creation |
| `updated_at` | timestamp | NOT NULL | Last update |

**Indexes:**
- `idx_bill_invoice_associations_bill` ON (`bill_id`)
- `idx_bill_invoice_associations_invoice` ON (`ar_invoice_id`)

**Relationships:**
- `belongsTo(Bill)`
- `belongsTo(ArInvoice)`

**Business Logic:**
- When AR invoice status becomes "Fully Paid", release all linked bills
- Only release if bill has no other on-hold reasons (compliance, etc.)

---

### 5. VC Approval Log

**Table**: `vc_approval_logs`

**Purpose**: Audit trail for all VC funding stream approvals. Immutable log for compliance.

**Fields:**

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | bigint UNSIGNED | PK, AUTO_INCREMENT | Primary key |
| `uuid` | char(36) | UNIQUE, NOT NULL | Public identifier |
| `vc_funding_stream_id` | bigint UNSIGNED | FK vc_funding_streams.id, NOT NULL | VC funding stream reference |
| `action` | enum('approved', 'rejected') | NOT NULL | Action taken |
| `approver_user_id` | bigint UNSIGNED | FK users.id, NOT NULL | Finance user who acted |
| `notes` | text | NULL | Optional notes |
| `ip_address` | varchar(45) | NULL | User IP address |
| `created_at` | timestamp | NOT NULL | Log timestamp |

**Indexes:**
- `idx_vc_approval_logs_vc_funding` ON (`vc_funding_stream_id`)
- `idx_vc_approval_logs_approver` ON (`approver_user_id`)
- `idx_vc_approval_logs_created` ON (`created_at`)

**Relationships:**
- `belongsTo(VcFundingStream)`
- `belongsTo(User)` - approver_user_id

**Immutability:**
- No updates or deletes allowed (audit log)
- Use soft deletes if GDPR requires redaction

---

## Calculated Fields & Aggregations

### Invoice Status (Derived)

**Logic:**
```php
public function getStatusAttribute(): string
{
    $totalPaid = $this->payments()->sum('payment_amount');

    if ($totalPaid == 0) {
        return 'Not Yet Invoiced';
    }

    if ($totalPaid < $this->invoice_amount) {
        return 'Partially Paid';
    }

    if ($totalPaid >= $this->invoice_amount) {
        return 'Fully Paid';
    }
}

public function getIsOverdueAttribute(): bool
{
    return $this->due_date < now() && $this->status !== 'Fully Paid';
}
```

### Summary Metrics (Reconciliation Dashboard)

```php
// Total VC Approved
VcFundingStream::where('status', 'approved')->sum('amount');

// Total Invoiced
ArInvoice::sum('invoice_amount');

// Total Paid (aggregated from payments)
ArInvoicePayment::sum('payment_amount');

// Amount Remaining (per invoice)
$invoice->invoice_amount - $invoice->payments()->sum('payment_amount');
```

---

## Migration Files

**Order of execution:**

1. `2026_01_16_000001_create_vc_funding_streams_table.php`
2. `2026_01_16_000002_create_ar_invoices_table.php`
3. `2026_01_16_000003_create_ar_invoice_payments_table.php`
4. `2026_01_16_000004_create_bill_invoice_associations_table.php`
5. `2026_01_16_000005_create_vc_approval_logs_table.php`
6. `2026_01_16_000006_add_indexes_to_collections_v2_tables.php`

---

## Example Data Flow

**Scenario**: Care Partner adds $5,200 VC funding, Finance approves, MYOB creates invoice, payment received in 2 parts.

1. **Care Partner adds VC**
   ```
   VC Funding Stream created:
   - package_id: 123
   - amount: 5200.00
   - status: 'pending'
   - added_by_user_id: 456 (Care Partner)
   ```

2. **Finance approves VC**
   ```
   VC Funding Stream updated:
   - status: 'approved'
   - approved_by_user_id: 789 (Finance Manager)
   - approved_at: 2026-01-16 10:30:00

   VC Approval Log created:
   - action: 'approved'
   - approver_user_id: 789
   ```

3. **MYOB creates invoice** (synced via API)
   ```
   AR Invoice created:
   - vc_funding_stream_id: 1
   - invoice_number: 'INV-2024-001'
   - invoice_amount: 1200.00
   - due_date: 2026-01-20
   - myob_invoice_id: 'MYOB-12345'

   Bill-to-Invoice Associations created:
   - bill_id: 101 → ar_invoice_id: 1
   - bill_id: 102 → ar_invoice_id: 1
   ```

4. **Consumer makes partial payment** (synced via MYOB)
   ```
   AR Invoice Payment created:
   - ar_invoice_id: 1
   - payment_reference: 'PAY-001-A'
   - payment_amount: 600.00
   - payment_date: 2026-01-18
   - payment_method: 'bank_transfer'

   Invoice Status: 'Partially Paid' (600 of 1200)
   ```

5. **Consumer makes final payment**
   ```
   AR Invoice Payment created:
   - ar_invoice_id: 1
   - payment_reference: 'PAY-001-B'
   - payment_amount: 600.00
   - payment_date: 2026-01-22
   - payment_method: 'bank_transfer'

   Invoice Status: 'Fully Paid' ✓
   Bills 101, 102 released automatically
   ```

---

## Database Constraints

**Foreign Key Constraints:**
- ON DELETE RESTRICT (prevent orphaned records)
- ON UPDATE CASCADE (propagate ID changes, if applicable)

**Check Constraints:**
- `amount` > 0
- `payment_amount` > 0
- `invoice_amount` > 0

**Unique Constraints:**
- `vc_funding_streams.uuid`
- `ar_invoices.invoice_number`
- `ar_invoices.myob_invoice_id`
- `ar_invoice_payments.payment_reference`
- `ar_invoice_payments.myob_payment_id`

---

## Performance Considerations

**Indexes:**
- All foreign keys indexed
- Date fields indexed (due_date, payment_date, created_at)
- Status fields indexed (vc_funding_streams.status)

**Denormalization:**
- `vc_funding_stream_id` in `ar_invoice_payments` (avoids JOIN through `ar_invoices`)
- Calculated `status` field cached (10-minute TTL) for reconciliation dashboard

**Pagination:**
- VC Approval Dashboard: 25 rows per page
- VC Reconciliation Dashboard: 50 rows per page

**Eager Loading:**
```php
VcFundingStream::with(['package', 'addedByUser', 'approvedByUser'])->get();
ArInvoice::with(['vcFundingStream', 'payments'])->get();
```

---

## Testing Data

**Factories:**
- `VcFundingStreamFactory`
- `ArInvoiceFactory`
- `ArInvoicePaymentFactory`
- `BillInvoiceAssociationFactory`
- `VcApprovalLogFactory`

**Seeders:**
- `VcFundingStreamSeeder` - Generate 10 pending + 10 approved VC funding streams
- `ArInvoicePaymentSeeder` - Generate partial payment scenarios
