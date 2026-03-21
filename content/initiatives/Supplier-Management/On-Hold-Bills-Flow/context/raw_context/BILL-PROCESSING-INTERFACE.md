# Bill Processing Interface Architecture - TC Portal

> Reference document for understanding the bill processing interface used by internal staff.
> Last updated: January 2025

---

## Table of Contents

1. [Overview](#1-overview)
2. [Controllers & Routes](#2-controllers--routes)
3. [Frontend Pages (Inertia/Vue)](#3-frontend-pages-inertiavue)
4. [Table Classes](#4-table-classes)
5. [Actions & Business Logic](#5-actions--business-logic)
6. [Jobs & Queue Processing](#6-jobs--queue-processing)
7. [Services](#7-services)
8. [Permissions & Roles](#8-permissions--roles)
9. [Key Workflows](#9-key-workflows)
10. [Filters & Sorting](#10-filters--sorting)
11. [Bulk Operations](#11-bulk-operations)

---

## 1. Overview

The bill processing interface is the internal staff-facing system for reviewing, processing, and managing bills. It supports two primary roles:

- **Bill Processing Manager** - Full dashboard, team management, all bills visibility
- **Bill Processing Team Member** - Personal dashboard, assigned bills, processing capabilities

### Key Concepts

| Concept | Description |
|---------|-------------|
| **Assignment** | Bills are assigned to individual processors for review |
| **Auto-Assignment** | Automatic distribution of bills based on priority suppliers |
| **Working Status** | Processors can be marked as working/not working |
| **Priority Suppliers** | Processors can be assigned specific suppliers to prioritize |

---

## 2. Controllers & Routes

### Main Controllers

#### BillController
**File:** `app/Http/Controllers/BillController.php`

| Method | Purpose |
|--------|---------|
| `index()` | List all bills with filters |
| `edit()` | Load bill for processing with all related data |
| `update()` | Save bill changes and handle stage transitions |
| `destroy()` | Soft delete a bill |
| `restore()` | Restore a soft-deleted bill |

#### DashboardController
**File:** `app/Http/Controllers/DashboardController.php`

Routes users to role-specific dashboards:
- Bill Processing Manager Dashboard
- Bill Processing Team Member Dashboard

### Routes

**File:** `routes/web/authenticated.php` (Lines 196-233)

| Route Name | Path | Purpose |
|------------|------|---------|
| `bills.index` | GET `/bills` | Bills list |
| `bills.edit` | GET `/bills/{bill}/edit` | Edit bill |
| `bills.update` | PUT `/bills/{bill}` | Update bill |
| `bills.destroy` | DELETE `/bills/{bill}` | Delete bill |
| `bills.assign.or.reassign` | POST `/bills/assign-or-reassign` | Assign bills to processor |
| `bills.auto.assign.bills` | POST `/bills/auto-assign` | Auto-assign bills to self |
| `bill.processor.set.working.status` | POST `/bill-processor/working-status` | Set working status |
| `bill.processor.take.unprocessed.bills.back` | POST `/bill-processor/return-to-queue` | Return bills to queue |
| `bills.set.can.assign.bills` | POST `/bills/set-can-assign` | Grant/revoke auto-assign permission |
| `bills.set.team.member.bill.suppliers` | POST `/bills/set-priority-suppliers` | Set priority suppliers |
| `bills.reset.team.member.bill.suppliers` | POST `/bills/reset-priority-suppliers` | Reset priority suppliers |

---

## 3. Frontend Pages (Inertia/Vue)

### Dashboard Pages

#### Bill Processing Manager Dashboard
**File:** `resources/js/Pages/Dashboard/BillProcessingManagerDashboard.vue`

Features:
- Team members table with management controls
- All bills table
- KPI cards (submitted, in review, on hold, etc.)
- Bulk actions for team and bills

#### Bill Processing Team Member Dashboard
**File:** `resources/js/Pages/Dashboard/BillProcessingTeamMemberDashboard.vue`

Features:
- Assigned bills table
- Auto-assign bills button
- Personal KPI cards
- Quick access to next bill

### Bill Pages

| Page | File | Purpose |
|------|------|---------|
| Bills Index | `resources/js/Pages/Bills/Index.vue` | Main bills list view |
| Bill Edit | `resources/js/Pages/Bills/Edit.vue` | Bill processing/edit page |
| Draft Bills | `resources/js/Pages/Bills/Drafts/Index.vue` | Draft bills view |

### Modal Components

**Location:** `resources/js/Pages/Bills/Partials/`

| Modal | Purpose |
|-------|---------|
| `AssignOrReassignModal.vue` | Assign/reassign bills to processors |
| `SetWorkingStatusModal.vue` | Set team member availability |
| `SetCanAssignBillsModal.vue` | Grant/revoke auto-assign permission |
| `SetPrioritySuppliersForTeamMemberModal.vue` | Configure priority suppliers |
| `PutBillsToAssignableQueueModal.vue` | Return unprocessed bills to queue |

---

## 4. Table Classes

### BillsTable
**File:** `app/Tables/BillsTable.php`

Main bills table with comprehensive filtering and sorting.

**Columns:**
- ref, stage, supplier, amount, recipient, processor, dates

**Bulk Actions (Finance Payable only):**
- In Review bills
- Approve bills

### BillProcessingManagerBillsTable
**File:** `app/Tables/Staff/BillProcessingManager/BillProcessingManagerBillsTable.php`

All bills view for managers.

**Features:**
- Processor assignment visible
- Default sort: submitted date
- Per-page options: 100, 200, 300
- 11 different filter criteria
- Shows deleted bills option

**Bulk Actions:**
- Assign / Re-assign bill
- View

### BillProcessingAssignedBillsTable
**File:** `app/Tables/Dashboard/BillProcessingAssignedBillsTable.php`

Shows bills assigned to current processor.

**Features:**
- Default sort: days_elapsed (oldest first)
- Priority supplier filtering
- Stage and date filters

### BillProcessingUsersTable
**File:** `app/Tables/Dashboard/BillProcessingUsersTable.php`

Team member management table for managers.

**Columns:**
| Column | Description |
|--------|-------------|
| name | Team member name |
| is_working | Working status badge |
| can_assign | Has auto-assign permission |
| priority_suppliers | Assigned priority suppliers |
| bills_to_process | Count of assigned bills |
| on_hold_count | Bills on hold |
| progress_metrics | Processing stats |

**Bulk Actions:**
- Set Can Assign Bills
- Set Priority Suppliers
- Reset Priority Suppliers
- Set Working Status
- Put Bills Back To Queue

### Other Tables

| Table | File | Purpose |
|-------|------|---------|
| OnHoldBillsTable | `app/Tables/OnHoldBillsTable.php` | On-hold bills list |
| DraftBillsTable | `app/Tables/DraftBillsTable.php` | Draft bills list |

---

## 5. Actions & Business Logic

### Bill Processing Actions

#### AutoAssignBillsToUsersAction
**File:** `app/Actions/Bill/Processing/AutoAssignBillsToUsersAction.php`

Validates and dispatches auto-assignment job.

**Validation:**
- User has `run-assign-bill-job` permission
- User is marked as working
- Unprocessed bills exist

#### AssignOrReassignAction
**File:** `app/Actions/Bill/AssignOrReassignAction.php`

Assigns or reassigns bills to a processor.

**Actions:**
- Updates `assigned_to` and `assigned_at` on bills
- Creates activity logs
- Sends `AssignedBillNotification`

#### PutBillsBackToAssignableQueueAction
**File:** `app/Actions/Bill/Processing/PutBillsBackToAssignableQueueAction.php`

Returns SUBMITTED bills to the assignable queue.

**Actions:**
- Clears `assigned_to` and `assigned_at`
- Only affects SUBMITTED stage bills

#### SetBillProcessorWorkingStatusAction
**File:** `app/Actions/Bill/Processing/SetBillProcessorWorkingStatusAction.php`

Sets the `is_working` status for processors.

#### SetTeamMemberPrioritySuppliersAction
**File:** `app/Actions/Bill/Processing/SetTeamMemberPrioritySuppliersAction.php`

Configures priority suppliers for a processor (stored as JSON).

#### SetCanAssignBillsAction
**File:** `app/Actions/Bill/Processing/SetCanAssignBillsAction.php`

Grants or revokes the `run-assign-bill-job` permission.

#### ResetTeamMemberPrioritySuppliersAction
**File:** `app/Actions/Bill/Processing/ResetTeamMemberPrioritySuppliersAction.php`

Clears priority suppliers configuration.

---

## 6. Jobs & Queue Processing

### AutoAssignBillsToUserJob
**File:** `app/Jobs/Bill/AutoAssignBillsToUserJob.php`

Implements `ShouldQueue` and `ShouldBeUnique`.

**Constants:**
| Constant | Value | Description |
|----------|-------|-------------|
| `TOTAL_BILLS_TO_ASSIGN` | 100 | Bills on first assignment |
| `BILLS_TO_ASSIGN_IF_ALREADY_ASSIGNED_TODAY` | 30 | Bills on subsequent assignments |

**Logic:**
1. First attempt: assigns 100 bills (balanced per supplier)
2. Subsequent attempts: assigns 30 bills
3. Prioritizes user's assigned priority suppliers
4. Balances bills across working users
5. Creates activity logs for each assignment

**Key Methods:**
- `getUnassignedBills()` - Fetches eligible bills
- `assignBills()` - Performs assignment
- `countUsers()` - Counts active processors
- `createActivityLogs()` - Records assignments

---

## 7. Services

### BillService
**File:** `app/Services/BillService.php`

Core bill operations service.

| Method | Purpose |
|--------|---------|
| `search()` | Search bills by criteria |
| `createBill()` | Create new bill |
| `createBillItem()` | Create bill line item |
| `syncBillItems()` | Update bill items |
| `update()` | Update bill with data persistence |
| `saveAttachments()` | Handle document uploads |
| `uploadBillFile()` | File upload processing |
| `getNextProcessingBill()` | Get next bill for processor |
| `sendBillApproveEmails()` | Send approval notifications |
| `sendBillRejectEmails()` | Send rejection notifications |

### DashboardService
**File:** `app/Services/DashboardService.php`

Role-specific dashboard data provider.

**Bill Processing Manager receives:**
- Users table
- Bills table
- KPIs
- Suppliers list

**Bill Processing Team Member receives:**
- Assigned bills table
- Personal KPIs

---

## 8. Permissions & Roles

### Roles

| Role | Dashboard | Capabilities |
|------|-----------|--------------|
| Bill Processing Manager | BillProcessingManagerDashboard | Full team management, all bills, bulk operations |
| Bill Processing Team Member | BillProcessingTeamMemberDashboard | Personal assigned bills, self auto-assign |

### Permissions

| Permission | Description | Used By |
|------------|-------------|---------|
| `view-bill` | View bills resource | All bill processing roles |
| `manage-bill` | Delete bills | Managers, Admin |
| `restore-bill` | Restore deleted bills | Managers, Admin |
| `edit-bill-processing-team-member-meta` | Modify team member settings | Managers |
| `run-assign-bill-job` | Auto-assign bills to self | Granted to team members |
| `can-import-in-review-bills` | Import in-review bills | Finance |

### BillPolicy
**File:** `app/Policies/BillPolicy.php`

| Method | Logic |
|--------|-------|
| `viewAny()` | Only internal roles |
| `view()` | Internal roles OR recipients viewing own bills |
| `update()` | Admin, Bill Processing Manager, Bill Processing Team Member |
| `delete()` | Requires `manage-bill` permission |
| `restore()` | Requires `restore-bill` permission |

---

## 9. Key Workflows

### Bill Assignment Workflow

```
1. Bill reaches SUBMITTED stage
          │
          ▼
2. Manager views BillProcessingManagerBillsTable
          │
          ▼
3. Manager bulk selects unassigned bills
          │
          ▼
4. Clicks "Assign / Re-assign bill" bulk action
          │
          ▼
5. AssignOrReassignModal opens
          │
          ▼
6. Manager selects processor
          │
          ▼
7. AssignOrReassignAction executed
          │
          ├── Bills updated (assigned_to, assigned_at)
          ├── Activity logs created
          └── AssignedBillNotification sent
          │
          ▼
8. Processor sees bills in BillProcessingAssignedBillsTable
```

### Bill Processing Workflow

```
1. Team member logs in
          │
          ▼
2. BillProcessingTeamMemberDashboard loads
          │
          ▼
3. Views assigned bills in BillProcessingAssignedBillsTable
          │
          ▼
4. (Optional) Auto-assign more bills
          │
          ▼
5. Click bill → BillController@edit
          │
          ▼
6. Review bill details, update fields
          │
          ▼
7. Select new stage:
   ├── IN_REVIEW
   ├── APPROVED
   ├── ON_HOLD (with reason)
   ├── REJECTED (with reason)
   ├── ESCALATED
   └── PAYING
          │
          ▼
8. BillController@update processes
          │
          ▼
9. Redirect to next bill or dashboard
```

### Team Member Management Workflow (Manager)

```
1. Manager views BillProcessingUsersTable
          │
          ▼
2. Selects team members
          │
          ▼
3. Performs bulk action:
   │
   ├── Set Can Assign Bills
   │   └── Grants/revokes run-assign-bill-job permission
   │
   ├── Set Priority Suppliers
   │   └── Configures JSON preference
   │
   ├── Set Working Status
   │   └── Sets is_working flag
   │
   └── Put Bills Back To Queue
       └── Returns SUBMITTED bills to assignable pool
```

---

## 10. Filters & Sorting

### BillsTable Filters

| Type | Fields |
|------|--------|
| Text | ref, TCID, supplier name, ABN, recipient, invoice ref, care partner, care coordinator, processor |
| Date | invoice, created, submitted, approved, review, on-hold, paid, rejected, service date |
| Badge | stage, on-hold reason, rejected reason, source |
| Boolean | is_assigned, is_reimbursement |

### BillProcessingAssignedBillsTable Filters

| Filter | Type | Description |
|--------|------|-------------|
| Priority suppliers | Custom | JSON contains logic |
| Stage | Badge | Bill stage filter |
| On-hold reason | Badge | Hold reason filter |
| Dates | Date range | Various date filters |
| Supplier | Text | Supplier name search |
| Recipient | Text | Recipient search |
| Reimbursement | Boolean | Is reimbursement flag |

### BillProcessingUsersTable Filters

| Filter | Description |
|--------|-------------|
| Priority suppliers | JSON contains filter |
| Can assign permission | Boolean filter |
| Working status | Boolean filter |

**Sortable Columns:**
- name
- working status
- assigned today
- bills to process

---

## 11. Bulk Operations

### For Bills

| Action | Permission Required | Description |
|--------|---------------------|-------------|
| In Review bills | Finance Payable | Move bills to IN_REVIEW |
| Approve bills | Finance Payable | Approve selected bills |
| Assign / Re-assign | Bill Processing Manager | Assign to processor |

### For Team Members

| Action | Description |
|--------|-------------|
| Set Can Assign Bills | Grant/revoke auto-assign permission |
| Set Priority Suppliers | Configure supplier priorities |
| Reset Priority Suppliers | Clear supplier configuration |
| Set Working Status | Toggle working/not working |
| Put Bills Back To Queue | Return SUBMITTED bills to pool |

---

## Appendix: Key Files Reference

### Controllers
```
app/Http/Controllers/BillController.php
app/Http/Controllers/DashboardController.php
```

### Frontend
```
resources/js/Pages/Dashboard/BillProcessingManagerDashboard.vue
resources/js/Pages/Dashboard/BillProcessingTeamMemberDashboard.vue
resources/js/Pages/Bills/Index.vue
resources/js/Pages/Bills/Edit.vue
resources/js/Pages/Bills/Partials/AssignOrReassignModal.vue
resources/js/Pages/Bills/Partials/SetWorkingStatusModal.vue
```

### Tables
```
app/Tables/BillsTable.php
app/Tables/Dashboard/BillProcessingAssignedBillsTable.php
app/Tables/Dashboard/BillProcessingUsersTable.php
app/Tables/Staff/BillProcessingManager/BillProcessingManagerBillsTable.php
```

### Actions
```
app/Actions/Bill/AssignOrReassignAction.php
app/Actions/Bill/Processing/AutoAssignBillsToUsersAction.php
app/Actions/Bill/Processing/PutBillsBackToAssignableQueueAction.php
app/Actions/Bill/Processing/SetBillProcessorWorkingStatusAction.php
app/Actions/Bill/Processing/SetTeamMemberPrioritySuppliersAction.php
app/Actions/Bill/Processing/SetCanAssignBillsAction.php
```

### Jobs
```
app/Jobs/Bill/AutoAssignBillsToUserJob.php
```

### Services
```
app/Services/BillService.php
app/Services/DashboardService.php
```

### Models
```
app/Models/Bill/Bill.php
app/Models/BillProcessingUserMeta.php
```

### Policies
```
app/Policies/BillPolicy.php
```
