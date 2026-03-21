# Bills Current State - TC Portal

> Reference document for the On Hold Bills Flow (OHB) feature design.
> Last updated: January 2025

---

## Table of Contents

1. [Bill Lifecycle](#1-bill-lifecycle)
2. [Entry Points](#2-entry-points)
3. [Existing Hold/Rejection Logic](#3-existing-holdrejection-logic)
4. [Department Touchpoints](#4-department-touchpoints)
5. [Communication Infrastructure](#5-communication-infrastructure)
6. [Key Models & Relationships](#6-key-models--relationships)

---

## 1. Bill Lifecycle

### 1.1 Bill Stages

All stages are defined in `BillStageEnum`:

**File:** `app/Enums/Bill/BillStageEnum.php`

| Stage | Label | Colour | Icon | Description |
|-------|-------|--------|------|-------------|
| `DRAFT` | Draft | Gray | pencil | Initial state - bill created but not submitted |
| `SUBMITTED` | Submitted | Blue | inbox-arrow-down | Submitted for processing |
| `ESCALATED` | Escalated | Teal | inbox-arrow-down | Escalated to manager/supervisor |
| `IN_REVIEW` | In Review | Orange | check-circle | Under review by processor |
| `APPROVED` | Approved | Green | check-circle | Approved, ready for payment |
| `PAYING` | Paying | Pink | currency-dollar | Payment in progress |
| `ON_HOLD` | On Hold | Yellow | clock | On hold pending resolution |
| `REJECTED` | Rejected | Red | x-mark | Bill rejected |
| `PAID` | Paid | Purple | currency-dollar | Payment complete |

**Pending Stages** (defined in `Bill.php:106-110`):
```php
public const PENDING_STAGES = [
    BillStageEnum::IN_REVIEW,
    BillStageEnum::APPROVED,
    BillStageEnum::PAYING,
];
```

### 1.2 Stage Transition Flow

```
                                    ┌──────────────┐
                                    │   ESCALATED  │
                                    └──────┬───────┘
                                           │
┌───────┐    ┌───────────┐    ┌────────────▼───┐    ┌──────────┐    ┌────────┐    ┌──────┐
│ DRAFT │───▶│ SUBMITTED │───▶│   IN_REVIEW    │───▶│ APPROVED │───▶│ PAYING │───▶│ PAID │
└───────┘    └─────┬─────┘    └────────┬───────┘    └────┬─────┘    └────────┘    └──────┘
                   │                   │                 │
                   │                   ▼                 │
                   │            ┌──────────┐            │
                   └───────────▶│ ON_HOLD  │◀───────────┘
                                └────┬─────┘
                                     │
                                     ▼
                               ┌──────────┐
                               │ REJECTED │
                               └──────────┘
```

### 1.3 Stage Transition Triggers

| From | To | Action/File | Trigger Condition |
|------|----|-------------|-------------------|
| DRAFT | SUBMITTED | `SubmitBillAction` (`app-modules/api/src/V1/src/Actions/Bill/SubmitBillAction.php:29-84`) | Manual submission, validation passes |
| SUBMITTED | IN_REVIEW | `ReviewBillAction` (`app-modules/api/src/V1/src/Actions/Bill/ReviewBillAction.php:20-47`) | `BillValidator::validateForReview()` passes |
| IN_REVIEW | APPROVED | `ApproveBill` (`domain/Bill/Actions/ApproveBill.php:25-134`) | Auto via ReviewBill action |
| APPROVED | PAYING | `ManuallyMarkBillAsAction` (`app/Actions/Bill/ManuallyMarkBillAsAction.php:21-81`) | MYOB status = "Balanced" |
| PAYING | PAID | `MarkBillAsPaid` (`domain/Bill/Actions/MarkBillAsPaid.php:58-99`) | MYOB status = "Closed" |
| ANY | ESCALATED | `EscalateBillAction` (`app/Actions/Bill/EscalateBillAction.php:11-22`) | Manual assignment |
| ANY | ON_HOLD | `BillService::update()` (`app/Services/BillService.php:196-197`) | `bill_on_hold_reason` set |
| ON_HOLD | REJECTED | `AutoRejectBill` (`app/Actions/Bill/AutoRejectBill.php:20-35`) | Auto after timeout |
| ON_HOLD | (cleared) | `RecipientApproveBill` (`app/Actions/Bill/Recipient/RecipientApproveBill.php:17-30`) | Consumer approval |
| ANY | REJECTED | `RejectBill` (`app/Actions/Bill/Recipient/RejectBill.php:18-33`) | Manual rejection |

### 1.4 Validation Points

**Pre-Review Validation** (`app-modules/api/src/V1/src/Validators/BillValidator.php:24-163`):
- 25+ validation conditions before allowing bill review
- Returns detailed validation messages on failure

**Pre-Approval Validation** (`app-modules/api/src/V1/src/Validators/BillValidator.php:170-256`):
- Additional checks before final approval

**Update Restriction** (`app-modules/api/src/V1/src/Actions/Bill/UpdateBillAction.php:55-76`):
- Bills can only be edited in DRAFT stage
- Returns 422 error for non-DRAFT updates

### 1.5 Stage History Tracking

**Trait:** `app/Traits/HasStageHistory.php`
**Observer:** `app/Observers/BillObserver.php:1-137`

Every stage transition is automatically recorded in `stage_histories` table:
- `from_stage` - Previous stage
- `to_stage` - New stage
- `meta` - JSON metadata (reasons, comments, approvals)
- `user_id` - User who made the change
- `application_identity_id` - API identity if automated
- `created_at` - Timestamp

**Metadata captured:**
- On Hold: hold reason, comment
- Rejection: rejection reason, comment
- Approval: approved by Care Partner/Care Coordinator/Consumer flags

### 1.6 Key Timestamps

| Field | When Set |
|-------|----------|
| `submitted_at` | SUBMITTED |
| `in_review_at` | IN_REVIEW |
| `approved_at` | APPROVED |
| `escalated_at` | ESCALATED |
| `on_hold_at` | ON_HOLD |
| `rejected_at` | REJECTED |
| `paid_at` | PAID |
| `assigned_at` | When assigned to processor |

---

## 2. Entry Points

### 2.1 Bill Sources

Defined in `BillSourceEnum` (`app/Enums/Bill/BillSourceEnum.php`):

| Source | Label | Initial Stage | Description |
|--------|-------|---------------|-------------|
| `API` | API | DRAFT | External API integration |
| `EMAIL` | Email | SUBMITTED | AI-extracted from email |
| `IMPORT` | Import | SUBMITTED | Excel/CSV/ZIP file import |
| `ZOHO` | Zoho | DRAFT | Zoho CRM sync |
| `CARE_COORDINATOR_FORM` | Care Coordinator Form | DRAFT | Care coordinator submission |
| `RECIPIENT_FORM` | Recipient Form | DRAFT | Self-service recipient submission |
| `SUPPLIER_FORM` | Supplier Form | DRAFT | Supplier portal submission |
| `PORTAL_APP` | Portal App | DRAFT | Mobile app submission |

### 2.2 Entry Point Details

#### API Entry
- **Route:** `POST /api/v1/bills` (`app-modules/api/src/V1/routes/routes.php:93`)
- **Controller:** `app-modules/api/src/V1/src/Http/Controllers/BillController.php`
- **Action:** `app-modules/api/src/V1/src/Actions/Bill/CreateBillAction.php:27-191`
- Creates in **DRAFT**, amounts calculated automatically

#### Email Entry
- **File:** `app/Actions/Bill/CreateBillFromEmail.php:65-330`
- Creates directly in **SUBMITTED**
- Processes AI-extracted predictions
- Matches suppliers by ABN, packages by customer name
- Filters duplicates by MD5 hash

#### File Import (Excel/CSV/ZIP)
- **Jobs:**
  - `app/Jobs/Bill/ProcessBillImportFileJob.php`
  - `app/Jobs/Bill/ProcessBillImportZipJob.php`
- **Importer:** `app/Imports/Bill/BillImport.php:32-164`
- Creates in **SUBMITTED**
- Supports XLSX, CSV, ODS, XLS, TSV
- Maps service types per supplier

#### Zoho CRM Sync
- **Job:** `app/Jobs/ZohoSyncJobs/SyncJobs/SyncBillsFromZohoJob.php:28-139`
- Uses `BillData::fromZoho()` transformation
- Auto-matches recipients and suppliers

#### Care Coordinator Form
- **Controller:** `app/Http/Controllers/CareCoordinator/CareCoordinatorBillController.php:28-100`
- **Route:** `POST /care-coordinators/{careCoordinator}/bills`
- Feature-flagged: `care-coordinator-bill-submission`
- Creates in **DRAFT**, multi-step form

#### Recipient Form
- **Controller:** `app/Http/Controllers/Recipient/Bill/RecipientBillController.php:28-100`
- **Route:** `POST /bills`
- Creates in **DRAFT**
- Auto-sets package to recipient's own

---

## 3. Existing Hold/Rejection Logic

### 3.1 On Hold Reasons

**Enum:** `app/Enums/Bill/BillOnHoldReasonsEnum.php`

**41 predefined reasons** organized by category:

#### Support At Home Category
- `SERVICE_DATE_PRIOR_TO_1ST_NOVEMBER`
- `UNPLANNED_SERVICES_REACHED_CAP`
- `UNVERIFIED_FUNDING_STREAM`
- `UNAPPROVED_SERVICES`
- `AT_HM`

#### Budget Category
- `NO_FUNDS`
- `NO_BUDGET`

#### Service Date Category
- `COMMENCEMENT_DATE`
- `TERMINATION_DATE`
- `QUARTER_END_DATE`
- `FUNDING_PERIOD`

#### Invoice Category
- `ABN_GST`
- `BILL_ITEMISATION`
- `CLIENT_NAME`
- `CALCULATION_ERROR`

#### Supplier Category
- `TERMINATED`
- `NOT_FOUND`
- `PROVIDER_VERIFICATION`
- `PERFORMANCE_IMPROVEMENT`
- `NOT_REGISTERED_FOR_SERVICE_TYPE`
- `PRICE_INCREASE`
- `UNVERIFIED_SERVICE`
- `ITEMISATION_REQUIRED_FOR_CONTRIBUTION_CATEGORIES`
- `TRAVEL_TRANSPORT_NOT_ITEMISED_INVOICED_CORRECTLY`

#### Client Category
- `EXCEEDS_BUDGETED_QUANTITY`
- `EXCEEDS_BUDGETED_RATE`
- `CONSUMER_APPROVAL`

#### Coordinator Category
- `COORDINATOR_APPROVAL`

#### Payment Category
- `NO_CLIENT_BANK_DETAILS`
- `NO_SUPPLIER_BANK_DETAILS`
- `NO_PROOF_OF_PAYMENT_REIMBURSEMENT`
- `NO_SOURCE_INVOICE_REIMBURSEMENT`

#### Other Category
- `FAILED_FINANCE_REVIEW`
- `EXCEEDS_MASTER_PRICE_LIST`
- `OTHER`
- `HOLD_CLEARED`
- `CARE_MANAGEMENT`

**Each reason has attributes:**
- `@Label()` - User-friendly description
- `@Colour()` - UI color
- `@Icon()` - Icon representation
- `@SendReminder()` - Whether to send reminders
- `@AuthRole()` - Which roles can action
- `@AuthAction()` - Allowed actions (Approve/Reject)
- `@AuthMessage()` - Message when actioning

### 3.2 Hold Reason Categories

**Enum:** `app/Enums/Bill/BillOnHoldReasonsCategoryEnum.php`

| Category | Colour | Icon |
|----------|--------|------|
| `SUPPORT_AT_HOME` | Red | clock |
| `BUDGET` | Red | banknotes |
| `SERVICE_DATE` | Blue | calendar-days |
| `INVOICE` | Pink | receipt-refund |
| `SUPPLIER` | Blue | building-office-2 |
| `CLIENT` | Orange | user |
| `PAYMENT` | Purple | credit-card |
| `APPROVAL` | Green | check |
| `OTHER_REASON` | Yellow | pencil |

### 3.3 Rejection Reasons

**Enum:** `app/Enums/Bill/BillRejectedReasonsEnum.php`

**28 predefined rejection reasons** with `@Meta(['is_client' => bool])`:

- `SERVICE_DATE_PRIOR_TO_CLIENTS_COMMENCEMENT_DATE`
- `SERVICE_DATE_AFTER_CLIENTS_TERMINATION_DATE`
- `TERMINATED_WITH_INSUFFICIENT_FUNDS`
- `CARE_PARTNER_ADVISED_NOT_TO_PROCESS_SERVICES_OR_PRODUCTS_NOT_COVERED_BY_HCP`
- `CONSUMER_ADVISED_NOT_TO_PROCESS_DISPUTING_RATES_OR_SERVICES`
- `PROVIDED_QUOTATION`
- `NO_RESPONSE_WAS_RECEIVED_FROM_CONSUMER_OR_PROVIDER_FOR_THE_PAST_THREE_WEEKS`
- `OVERSPENDING_FUNDS_WILL_NOT_ACCRUE_WITHIN_14_DAYS`
- `SERVICE_NOT_PROVIDED`
- `ITEM_NOT_RECEIVED_OR_DELIVERED`
- `HOURLY_RATE_DOES_NOT_MATCH_AGREEMENT`
- `OVERTIME`
- `SYSTEM_DECLINED` (auto-rejection)
- `OTHERS`
- ...and more

### 3.4 Bill Model Hold/Rejection Fields

**File:** `app/Models/Bill/Bill.php`

| Field | Type | Purpose |
|-------|------|---------|
| `bill_on_hold_reason` | BillOnHoldReasonsEnum | Current hold reason |
| `on_hold_comment` | string | Additional hold notes |
| `on_hold_at` | datetime | When placed on hold |
| `bill_rejected_reason` | BillRejectedReasonsEnum | Rejection reason |
| `rejected_comment` | string | Rejection notes |
| `rejected_at` | datetime | When rejected |
| `rejected_by_cc_reason` | BillRejectedReasonsEnum | Care coordinator rejection reason |
| `is_rejected_by_cp` | boolean | Rejected by Care Partner |
| `is_rejected_by_consumer` | boolean | Rejected by consumer |
| `is_rejected_by_care_coordinator` | boolean | Rejected by Care Coordinator |
| `is_approved_by_cp` | boolean | Approved by Care Partner |
| `is_approved_by_consumer` | boolean | Approved by consumer |
| `is_approved_by_care_coordinator` | boolean | Approved by Care Coordinator |

### 3.5 Auto-Rejection

**File:** `app/Actions/Bill/AutoRejectBill.php:20-35`

- Sets `bill_stage = REJECTED`
- Sets `bill_rejected_reason = SYSTEM_DECLINED`
- Preserves original hold reason in `rejected_comment`
- Fires `BillStageUpdated` event

### 3.6 Consumer Approval/Rejection

**Approval Check** (`app/Models/Bill/Bill.php:588-610`):
```php
public function canApproveOrReject(): bool
{
    // Returns true if:
    // - Bill has associated package
    // - Not previously approved by consumer
    // - User is primary representative or recipient
    // - Bill is in ON_HOLD stage
    // - Not previously rejected by consumer
    // - Hold reason is CONSUMER_APPROVAL
}
```

**Recipient Approval:** `app/Actions/Bill/Recipient/RecipientApproveBill.php:17-30`
**Recipient Rejection:** `app/Actions/Bill/Recipient/RejectBill.php:18-33`

### 3.7 Bulk Operations

**Bulk Rejection Results Table:** `database/migrations/2025_12_16_230921_create_bulk_bill_rejection_results_table.php`

| Column | Type | Purpose |
|--------|------|---------|
| `bill_id` | FK | Reference to bill |
| `is_success` | boolean | Success flag |
| `error` | text | Error message |
| `data` | JSON | Additional data |

**Bulk Action:** `domain/Bill/Actions/BulkRejectBills.php:27-32`
Auto-rejects bills with `COMMENCEMENT_DATE` or `TERMINATION_DATE` hold reasons.

---

## 4. Department Touchpoints

### 4.1 Role-Based Permissions

**File:** `config/permissions/bill-permission-list.php`

| Permission | Roles |
|------------|-------|
| View Bill | Care Management, Senior Care Partner, Care Partner, Compliance Manager/Team Member, Finance Payable Manager/Team Member, Bill Processing roles |
| Manage Bill | Admin, Compliance roles, Finance Payable roles, Bill Processing roles |
| Edit Bill Processing Team Member Meta | Finance Payable Manager, Bill Processing Manager |
| Mark As (PAYING/PAID) | Admin, Bill Processing Manager, Finance Payable Manager |

### 4.2 Bill Assignment System

**Auto-Assignment:** `app/Actions/Bill/Processing/AutoAssignBillsToUsersAction.php:13-59`

- Bills start with `assigned_to = NULL`
- Bill Processing Team Members request assignment via `AutoAssignBillsToUserJob`
- Can return to queue via `PutBillsBackToAssignableQueueAction`

**Assignment Action:** `app/Actions/Bill/AssignOrReassignAction.php:25-127`
- Updates `assigned_to` and `assigned_at`
- Creates activity log
- Sends `AssignedBillNotification`

### 4.3 Department Routing by Hold Reason

**File:** `app/Services/Bill/BillReminderService.php:242-352`

The `getNotifiablesForBill()` method routes notifications based on hold reason:

#### Care Department (Primary Contact + Care Partner)
- Budget holds: `NO_FUNDS`, `EXCEEDS_BUDGETED_*`, `NO_BUDGET`, `COMMENCEMENT_DATE`, `TERMINATION_DATE`
- Approval holds: `CONSUMER_APPROVAL`, `COORDINATOR_APPROVAL`

#### Compliance Department
- Supplier verification: `ABN_GST`, `BILL_ITEMISATION`, `CLIENT_NAME`, `CALCULATION_ERROR`, `NOT_FOUND`, `PROVIDER_VERIFICATION`, `NOT_REGISTERED_FOR_SERVICE_TYPE`, `PRICE_INCREASE`, `UNVERIFIED_SERVICE`, `ITEMISATION_REQUIRED_FOR_CONTRIBUTION_CATEGORIES`
- Supplier status: `TERMINATED`, `PERFORMANCE_IMPROVEMENT`

#### Accounts/Finance Department
- Client payment: `NO_CLIENT_BANK_DETAILS`, `NO_PROOF_OF_PAYMENT_REIMBURSEMENT`, `NO_SOURCE_INVOICE_REIMBURSEMENT`
- Supplier payment: `NO_SUPPLIER_BANK_DETAILS`

### 4.4 Department-Specific Views

#### Bill Processing Manager
**File:** `app/Tables/Staff/BillProcessingManager/BillProcessingManagerBillsTable.php:32-207`
- View assigned processor
- Bulk assign/reassign bills
- Filter by assignment status

#### Care Coordinator
**File:** `app/Http/Controllers/CareCoordinator/CareCoordinatorBillController.php`
- Create, edit, view bills for their packages

#### Recipient/Consumer
**File:** `app/Http/Controllers/Recipient/Bill/RecipientBillController.php`
- Approve/reject bills on hold for consumer approval

### 4.5 Configurable Settings

**File:** `app/Providers/NovaServiceProvider.php`

- `send_on_hold_notifications_to_care_coordinators` - Toggle CC notifications
- `compliance_email_address` - Compliance contact
- `accounts_email_address` - Accounts/Finance contact

---

## 5. Communication Infrastructure

### 5.1 Bill Notification Classes

**Location:** `app/Notifications/Bill/`

| Notification | Purpose |
|--------------|---------|
| `AssignedBillNotification` | Bill assigned to processor |
| `AllAssignedBillsHaveBeenProcessedNotification` | All assigned bills processed |
| `BillStatusMailNotification` | KPI statistics |
| `BillAutoRejectedNotification` | Auto-rejection notification |
| `EscalatedBillNotification` | Bill escalated |
| `FailedInReviewBillsImportAlertNotification` | Import failure alert |
| `InvoiceHasBeenPaidNotification` | Payment confirmation |
| `InvoiceHasBeenRejectedNotification` | Rejection with reason |
| `InvoiceHasBeenApprovedByConsumerNotification` | Consumer approved |
| `InvoiceHasBeenRejectedByConsumerNotification` | Consumer rejected |
| `InvoiceOnHoldNotification` | Invoice placed on hold |
| `InvoiceOnHoldRequiresApprovalNotification` | Approval required |
| `OnHoldBillReminderNotification` | Scheduled reminders |
| `OnHoldInvoiceAuthorisedNotification` | On-hold authorized |
| `OnHoldInvoiceRejectedByCcOrCpNotification` | Rejected by CC/CP |
| `AuthoriseOnHoldInvoiceNotification` | Authorization request |

All implement `ShouldQueue` with 'mail' and 'database' channels.

### 5.2 Notification Sending Service

**File:** `app/Services/BillService.php`

| Method | Lines | Purpose |
|--------|-------|---------|
| `sendBillPaidEmail()` | 221-245 | Notify supplier/recipient of payment |
| `sendBillOnHoldEmail()` | 247-271 | Trigger on-hold notifications |
| `sendBillRejectedEmail()` | 342-373 | Notify supplier and receiver |
| `sendOnHoldApprovalEmail()` | 317-322 | Send approval request |
| `sendBillApproveByCcOrCpEmail()` | 375-389 | Notify of authorization |
| `sendBillRejectByCcOrCpEmail()` | 391-399 | Notify of rejection |
| `sendApprovedByConsumerEmail()` | 324-331 | Notify processor of consumer approval |
| `sendRejectedByConsumerEmail()` | 333-340 | Notify processor of consumer rejection |

### 5.3 Automated Reminder System

**Service:** `app/Services/Bill/BillReminderService.php`
**Config:** `config/bill-reminders.php`

**Reminder Schedule:**
| Day | Type |
|-----|------|
| 0 | Immediate (when placed on hold) |
| 3 | First reminder |
| 7 | Second reminder |
| 10 | Final reminder |

**Key Methods:**
- `sendImmediateOnHoldNotification()` - Lines 40-63
- `getBillsNeedingReminders()` - Lines 68-90+

**Duplicate Prevention:**
`OnHoldBillReminderNotification` uses `fingerprint()` to prevent duplicates within 24 hours.

### 5.4 Communication Tracking

**Activity Logger:** `app/Actions/CreateEmailActivityLog.php:1-40`
**Listener:** `EmailActivityLogListener.php` - Listens to `NotificationSent` events

**Tracked Data:**
- `email_subject`
- `to_email`
- `email_type`
- `event: 'emailed'`

**Notification Log Table:** `database/migrations/2025_06_03_140334_create_notification_log_items_table.php`
- `notification_type`
- `notifiable_id/type`
- `channel`
- `fingerprint`
- `extra`
- `confirmed_at`

### 5.5 Notification Preferences

**File:** `app/Providers/NovaServiceProvider.php`

| Setting | Purpose |
|---------|---------|
| `send_bill_notifications_to_smplus_recipients` | Self-managed plus recipients |
| `send_bill_notifications_to_supplier` | Supplier notifications |
| `bill_processing_report_email_addresses` | Report recipients |

### 5.6 Notification Recipients

- **Suppliers** - via `$supplier->email` or `$supplier->owner->email`
- **Recipients** - via package's primary contact
- **Care Coordinators** - via configured email or owner user email
- **Care Partners** - via configured email
- **Processors** - via configured invoice email address
- **Anonymous** - via `Notification::route('mail', $email)`

---

## 6. Key Models & Relationships

### 6.1 Bill Model

**File:** `app/Models/Bill/Bill.php`

**Traits:**
- `HasDocuments` - Document management
- `HasFactory` - Factory pattern
- `HasHashId` - Generates `ref` field
- `HasStageHistory` - Stage transition tracking
- `LogsActivity` - Spatie activity logging
- `Searchable` - Laravel Scout
- `SoftDeletes` - Soft delete support

**Observer:** `BillObserver` - Manages stage history and approval tracking

### 6.2 Bill Relationships

#### BelongsTo
| Method | Model | FK |
|--------|-------|-----|
| `package()` | Package | package_id |
| `supplier()` | Supplier | supplier_id |
| `processor()` | User | assigned_to |
| `createdBy()` | User | created_by |

#### HasMany
| Method | Model |
|--------|-------|
| `billItems()` | BillItem |
| `transactions()` | Transaction |
| `servicesAustraliaInvoiceStates()` | ServicesAustraliaInvoiceState |
| `billExtractions()` | BillExtraction |

#### HasOne
| Method | Model |
|--------|-------|
| `latestBillExtraction()` | BillExtraction |

#### HasOneThrough
| Method | Model | Through |
|--------|-------|---------|
| `recipient()` | User | Package |

#### Polymorphic (MorphMany)
| Method | Model |
|--------|-------|
| `auditLog()` | Activity (Spatie) |
| `notes()` | Note |
| `userPageLogs()` | UserPageLog |
| `stageHistories()` | StageHistory |
| `temporaryDocuments()` | TemporaryDocument |

### 6.3 BillItem Model

**File:** `app/Models/Bill/BillItem.php`

**Observer:** `BillItemObserver` - Updates bill total on create/update/delete

**Key Relationships:**
| Method | Model |
|--------|-------|
| `bill()` | Bill |
| `service()` | Service |
| `serviceType()` | ServiceType |
| `fees()` | Fee |
| `packageBudgetItem()` | PackageBudgetItem |
| `budgetPlanItem()` | BudgetPlanItem |
| `taxRate()` | TaxRate |
| `wraparoundItem()` | WraparoundItem |
| `fundingConsumptions()` | BudgetPlanItemFundingConsumption |
| `unplannedService()` | UnplannedService |
| `serviceItems()` | ServiceItem (pivot) |

**Computed Fields:**
- `total_amount` = `service_hours * service_unit_amount + tax - discount_amount`

### 6.4 Related Models

| Model | File | Purpose |
|-------|------|---------|
| `BillExtraction` | `app/Models/Bill/BillExtraction.php` | AI extraction data |
| `BillItemServiceTypeCorrection` | `app/Models/Bill/BillItemServiceTypeCorrection.php` | Service type corrections |
| `BulkBillRejectionResult` | `app/Models/Bill/BulkBillRejectionResult.php` | Bulk rejection tracking |
| `ServicesAustraliaInvoiceState` | `domain/Bill/Models/ServicesAustraliaInvoiceState.php` | Services Australia sync |
| `BillImport` | `app/Models/AdminModels/BillImport.php` | Import metadata |
| `StageHistory` | `app/Models/StageHistory.php` | Stage transition history |

### 6.5 Key Enums Summary

| Enum | File | Purpose |
|------|------|---------|
| `BillStageEnum` | `app/Enums/Bill/BillStageEnum.php` | 9 bill stages |
| `BillSourceEnum` | `app/Enums/Bill/BillSourceEnum.php` | 8 entry sources |
| `BillPayeeEnum` | `app/Enums/Bill/BillPayeeEnum.php` | Payment recipient type |
| `BillOnHoldReasonsEnum` | `app/Enums/Bill/BillOnHoldReasonsEnum.php` | 41 hold reasons |
| `BillOnHoldReasonsCategoryEnum` | `app/Enums/Bill/BillOnHoldReasonsCategoryEnum.php` | 9 hold categories |
| `BillRejectedReasonsEnum` | `app/Enums/Bill/BillRejectedReasonsEnum.php` | 28 rejection reasons |
| `BillImportSupplierEnum` | `app/Enums/Bill/BillImportSupplierEnum.php` | 8 import suppliers |

### 6.6 Key Query Scopes

**File:** `app/Models/Bill/Bill.php` (Lines 337-580)

| Scope | Purpose |
|-------|---------|
| `approved()` | WHERE bill_stage = APPROVED |
| `paying()` | WHERE bill_stage = PAYING |
| `paid()` | WHERE bill_stage = PAID |
| `pending()` | WHERE bill_stage IN [IN_REVIEW, APPROVED, PAYING] |
| `recipientPendingApproval()` | Bills awaiting recipient approval |
| `forRecipient()` | Bills visible to recipients |
| `filterForCareCoordinator()` | Bills for care coordinator |
| `filterForSupplier()` | Bills for supplier |

---

## Appendix: File Quick Reference

### Core Bill Files
```
app/Models/Bill/Bill.php                    - Main model
app/Models/Bill/BillItem.php                - Line items
app/Enums/Bill/BillStageEnum.php            - Stages
app/Enums/Bill/BillSourceEnum.php           - Sources
app/Enums/Bill/BillOnHoldReasonsEnum.php    - Hold reasons
app/Enums/Bill/BillRejectedReasonsEnum.php  - Rejection reasons
app/Observers/BillObserver.php              - Stage history tracking
app/Services/BillService.php                - Core business logic
```

### Actions
```
app/Actions/Bill/CreateBill.php             - Generic creation
app/Actions/Bill/AutoRejectBill.php         - Auto-rejection
app/Actions/Bill/EscalateBillAction.php     - Escalation
app/Actions/Bill/Recipient/RejectBill.php   - Consumer rejection
app/Actions/Bill/Recipient/RecipientApproveBill.php - Consumer approval
domain/Bill/Actions/ApproveBill.php         - Approval with event sourcing
domain/Bill/Actions/MarkBillAsPaid.php      - Payment completion
```

### API Module
```
app-modules/api/src/V1/src/Actions/Bill/CreateBillAction.php
app-modules/api/src/V1/src/Actions/Bill/SubmitBillAction.php
app-modules/api/src/V1/src/Actions/Bill/ReviewBillAction.php
app-modules/api/src/V1/src/Validators/BillValidator.php
```

### Notifications
```
app/Notifications/Bill/                     - All bill notifications
app/Services/Bill/BillReminderService.php   - Reminder system
config/bill-reminders.php                   - Reminder config
```

### Controllers
```
app/Http/Controllers/CareCoordinator/CareCoordinatorBillController.php
app/Http/Controllers/Recipient/Bill/RecipientBillController.php
app-modules/api/src/V1/src/Http/Controllers/BillController.php
```
