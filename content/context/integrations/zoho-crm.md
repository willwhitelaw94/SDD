---
title: "Zoho CRM"
description: "Bidirectional CRM integration for packages, suppliers, consumers, and leads"
---

> Bidirectional sync of core business entities between Portal and Zoho CRM

---

## TL;DR

- **What**: Comprehensive CRM integration syncing packages, consumers, suppliers, incidents, leads, and more
- **Who**: Care Partners, Admin, Finance (via synced data)
- **Key flow**: Zoho webhook → Queue → Portal sync → Event dispatched → Domain updated
- **Watch out**: Bidirectional sync can cause conflicts; Portal is becoming source of truth for more data

---

## Key Concepts

| Term | What it means |
|------|---------------|
| **Zoho Module** | CRM object type (Care_Plans, Providers, Deals, etc.) |
| **Webhook** | Real-time push from Zoho when records change |
| **Sync History** | Tracks pagination state for large batch syncs |
| **TCID** | Trilogy Care ID - primary identifier for CRM linkage |
| **ZQL** | Zoho Query Language for custom queries |

---

## Modules Synced

| Portal Entity | Zoho Module | Direction |
|---------------|-------------|-----------|
| **Packages** | Care_Plans | ↔ Bidirectional |
| **Consumers** | Deals | ↔ Bidirectional |
| **Suppliers** | Providers | ↔ Bidirectional |
| **Care Coordinators** | Coordinators | → From Zoho |
| **Incidents** | Cases | → From Zoho |
| **Leads** | Leads | → From Zoho |
| **Bills** | Bills | → From Zoho |
| **Notes** | Notes | → From Zoho |
| **Leave** | Leave | → From Zoho |
| **Teams** | Teams | → From Zoho |

---

## Technical Reference

### Core Service

**File**: `app/ThirdPartyServices/ZohoService.php`

Uses `asad/laravel-zoho-api-wrapper` package (v1)

**Key Methods**:
- `fetchRecords()` - Paginated record fetching with sync history
- `fetchRecordById()` - Single record retrieval
- `insertRecord()` - Create new records
- `updateRecordById()` / `bulkUpdate()` - Update records
- `queryRecords()` - Custom ZQL queries
- `getNotesById()` / `getAttachmentList()` - Associations

### Webhook Controller

**File**: `app/Http/Controllers/Webhooks/ZohoWebhookController.php`

**Routes** (at `/api/webhooks/zoho/{action}`):

| Webhook | Module | Processing |
|---------|--------|------------|
| `updatePackage` | Package | Queued |
| `updatePackageNote` | Package_Note | Queued |
| `createNewPackage` | Package_New | Queued |
| `updateCareCoordinator` | Care_Coordinator | Queued |
| `updateProvider` | Providers | Queued |
| `updateConsumer` | Deals | Queued |
| `updateTeam` | Teams | Queued |
| `updateBill` | Bill | Queued |
| `updateIncident` | Cases | Immediate |
| `updateLead` | Leads | Immediate |
| `updateLeave` | Leave | Job |

### Sync Jobs (FROM Zoho)

| Job | Purpose |
|-----|---------|
| `SyncPackagesFromZohoJob` | Packages with conflict resolution |
| `SyncConsumerFromZohoJob` | Recipient user data, addresses |
| `SyncCareCoordinatorFromZohoJob` | Care coordinator records |
| `SyncSupplierFromZohoJob` | Supplier/provider data |
| `SyncIncidentsFromZohoJob` | Incident records |
| `SyncBillsFromZohoJob` | Bills from Zoho |
| `SyncNotesFromZohoJob` | Package notes |
| `SyncPackageLeaveFromZohoJob` | Leave/absence data |
| `UpdateLeadFromZohoAction` | Lead records |

### Sync Jobs (TO Zoho)

| Job | Purpose |
|-----|---------|
| `SyncPackageDataToZoho` | Package metadata (Portal_ID, TCID, emails) |
| `SyncDealDataToZoho` | Recipient data (DOB, gender, phone, addresses) |
| `SyncSupplierToZohoJob` | Create/update suppliers |

### CLI Command

```bash
php artisan sync:zoho {module} {--fetch} {--refetch} {zoho_ids?*}
```

- `--fetch` - Continue from last page
- `--refetch` - Reset and sync all
- Modules: `packages`, `care_coordinators`, `suppliers`, `deals`, `incidents`, `leaves`

### Sync History Tracking

**Model**: `app/Models/ZohoSyncHistory.php`

Tracks pagination state (`module`, `page_number`, `latest_synced_at`) for resumable syncs.

### Conflict Resolution

**Model**: `SyncDuplication`

Handles:
- Duplicate care_recipient_id across packages
- Duplicate tc_customer_no
- Clears duplicates from soft-deleted/terminated packages
- Logs conflicts with detailed context

### Configuration

**File**: `config/zoho.php`

```php
return [
    'update_to_crm' => (bool) env('ZOHO_UPDATE_TO_CRM', false),
    'supplier_url' => env('ZOHO_SUPPLIER_URL', ''),
];
```

### Error Handling

**Trait**: `app/Traits/HandlesZohoUpdateErrors.php`

Standardized error handling with `ReportableException`.

### Data Transformation Classes

- `LeadZohoFormData` - Lead data mapping
- `IncidentZohoData` / `IncidentZohoCarePlanData` - Incident mapping
- `SupplierZohoExpiryData` - Document expiry tracking

### OAuth Management

**Model**: `ZohoOauthSetting` (from vendor wrapper)

Service implements distributed token refresh locking via `withTokenRefreshLock()`.

---

## Data Fields Synced

### Packages → Zoho
- `Portal_ID`, `Trilogy_Care_CarePlan_ID` (TCID)
- `Mail_Statement_Opt_In`, `Marketing_Opt_Out`
- `Primary_Contact`, `Contacts_in_Portal`
- Email addresses (primary rep, consumer, portal)
- Representative details (name, phone, relationship, MAC status, EPOA)

### Consumers → Zoho
- DOB, Gender, Mobile
- Street, Suburb, State, Post Code
- `Opt_Out_of_Mail`, `Care_Recipient_ID`
- `First_Assigned_Date`, `Funding_Status`

---

## Status

**Maturity**: Production
**Pod**: Multiple (Care, Finance, Operations)
