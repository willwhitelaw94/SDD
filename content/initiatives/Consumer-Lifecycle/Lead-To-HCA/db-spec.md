---
title: "Database Schema: Lead to HCA (LTH)"
---

# Database Schema: Lead to HCA (LTH)

**Plan**: [plan.md](plan.md) | **Spec**: [spec.md](spec.md) | **Date**: 2026-02-19

---

## Entity Relationship Diagram

```
┌──────────────┐       ┌─────────────────────┐       ┌──────────────────┐
│    leads     │──1:N──│  lead_conversions    │──1:N──│ lead_conversion  │
│              │       │                     │       │ _sync_logs       │
└──────┬───────┘       └──────────┬──────────┘       └──────────────────┘
       │                     │         │
       │                     │ 1:1     │ 1:1
       │                     ▼         ▼
       │              ┌──────────┐  ┌────────────┐
       │              │ packages │  │ agreements │
       │              └────┬─────┘  └────────────┘
       │                   │
       │                   │ N:1
       │                   ▼
       │           ┌──────────────────┐     ┌──────────────────────────────┐
       │           │care_coordinators │──1:N│package_care_coordination     │
       │           │                  │     │_loadings                     │
       │           └──────────────────┘     └──────────────────────────────┘
       │
       │ N:1
       ▼
┌──────────────┐
│  lead_owners │
└──────────────┘
```

---

## New Tables

### `lead_conversions`

Tracks the state of each conversion wizard session. One Lead can have multiple conversion attempts (abandoned → new).

| Column | Type | Nullable | Default | Constraints | Notes |
|--------|------|----------|---------|-------------|-------|
| `id` | bigint unsigned | NO | auto | PK | |
| `uuid` | char(36) | NO | | UNIQUE | Public-facing identifier |
| `lead_id` | bigint unsigned | NO | | FK → leads.id | The lead being converted |
| `created_by` | bigint unsigned | NO | | FK → users.id | Sales rep who started conversion |
| `status` | varchar(20) | NO | 'in_progress' | | `in_progress`, `completed`, `abandoned` |
| `current_step` | tinyint unsigned | NO | 1 | | 1–6 |
| `step_data` | json | YES | NULL | | Per-step form data (serialized shared form) |
| **Risk Assessment** | | | | | |
| `risk_outcome` | varchar(30) | YES | NULL | | `suitable`, `clinical_attention`, `not_suited` |
| `risk_score` | decimal(5,2) | YES | NULL | | 0.00–100.00 |
| `risk_confidence` | decimal(5,2) | YES | NULL | | 0.00–100.00 |
| `risk_assessment_date` | date | YES | NULL | | |
| `risk_flags` | json | YES | NULL | | Array of flag identifiers |
| **Coordinator** | | | | | |
| `coordinator_id` | bigint unsigned | YES | NULL | FK → care_coordinators.id | Selected coordinator (SM+ only) |
| `coordinator_source` | varchar(20) | YES | NULL | | `tc_internal`, `bd_pipeline`, `manual_override`, `unknown` |
| `coordination_fee` | decimal(8,3) | YES | NULL | | Fee percentage from coordinator |
| **Agreement** | | | | | |
| `is_signable` | boolean | NO | true | | false = clinical hold or coordinator unknown |
| `hold_reasons` | json | YES | NULL | | Array of reasons why not-signable |
| **Zoho Sync** | | | | | |
| `zoho_consumer_id` | varchar(50) | YES | NULL | | Set after Sync #1 (Create Consumer) |
| `zoho_care_plan_id` | varchar(50) | YES | NULL | | Set after Sync #1 (Create Care Plan) |
| `zoho_deal_id` | varchar(50) | YES | NULL | | Set after completion sync |
| **Output Records** | | | | | |
| `package_id` | bigint unsigned | YES | NULL | FK → packages.id | Created on Send/Complete |
| `agreement_id` | bigint unsigned | YES | NULL | FK → agreements.id | Created on Send/Complete |
| `completed_at` | timestamp | YES | NULL | | When wizard was completed |
| **Standard** | | | | | |
| `deleted_at` | timestamp | YES | NULL | | Soft delete |
| `created_at` | timestamp | NO | | | |
| `updated_at` | timestamp | NO | | | |

**Indexes:**
- `lead_conversions_uuid_unique` — UNIQUE on `uuid`
- `lead_conversions_lead_id_index` — INDEX on `lead_id`
- `lead_conversions_created_by_index` — INDEX on `created_by`
- `lead_conversions_status_index` — INDEX on `status`
- `lead_conversions_package_id_index` — INDEX on `package_id`
- `lead_conversions_agreement_id_index` — INDEX on `agreement_id`

**Foreign Keys:**
- `lead_id` → `leads.id` (CASCADE on delete)
- `created_by` → `users.id` (NO ACTION)
- `coordinator_id` → `care_coordinators.id` (SET NULL on delete)
- `package_id` → `packages.id` (SET NULL on delete)
- `agreement_id` → `agreements.id` (SET NULL on delete)

---

### `lead_conversion_sync_logs`

Audit trail for every Zoho sync attempt during conversion. Immutable — never updated, only inserted.

| Column | Type | Nullable | Default | Constraints | Notes |
|--------|------|----------|---------|-------------|-------|
| `id` | bigint unsigned | NO | auto | PK | |
| `lead_conversion_id` | bigint unsigned | NO | | FK → lead_conversions.id | |
| `step` | tinyint unsigned | NO | | | Which wizard step triggered this sync |
| `sync_type` | varchar(30) | NO | | | See enum below |
| `zoho_module` | varchar(50) | NO | | | e.g., `Contacts`, `Care_Plans`, `Deals` |
| `zoho_record_id` | varchar(50) | YES | NULL | | Zoho record ID (set on success) |
| `payload` | json | NO | | | Request payload sent to Zoho |
| `response` | json | YES | NULL | | Zoho API response |
| `status` | varchar(15) | NO | 'pending' | | `pending`, `success`, `failed` |
| `error_message` | text | YES | NULL | | Error details on failure |
| `attempts` | tinyint unsigned | NO | 0 | | Number of attempts |
| `created_at` | timestamp | NO | | | |
| `updated_at` | timestamp | NO | | | |

**Indexes:**
- `lead_conversion_sync_logs_conversion_id_index` — INDEX on `lead_conversion_id`
- `lead_conversion_sync_logs_status_index` — INDEX on `status`
- `lead_conversion_sync_logs_sync_type_index` — INDEX on `sync_type`

**Foreign Keys:**
- `lead_conversion_id` → `lead_conversions.id` (CASCADE on delete)

**Sync Types** (LeadConversionSyncTypeEnum):
- `create_consumer` — Step 1: Create Contact in Zoho
- `create_care_plan` — Step 1: Create Care Plan in Zoho
- `update_consumer` — Step 2: Update Contact with package details
- `update_care_plan` — Step 3: Update Care Plan with ACAT data
- `update_risk` — Step 5: Update Care Plan with risk outcome
- `update_coordinator` — Step 6: Update Care Plan with coordinator
- `create_deal` — Step 6: Create Deal in Zoho
- `create_package` — Step 6: Create Package record locally

---

## Migrations on Existing Tables

### `agreements` — Add `state` and `type` columns

The existing `agreements` table uses timestamp inference for state (signed_at/expired_at). For Client-HCA alignment, add explicit state and type columns.

```
ALTER TABLE agreements
  ADD COLUMN `state` varchar(20) NOT NULL DEFAULT 'draft' AFTER `signature`,
  ADD COLUMN `type` varchar(30) NULL AFTER `state`,
  ADD COLUMN `hold_reasons` json NULL AFTER `type`,
  ADD COLUMN `sent_at` timestamp NULL AFTER `hold_reasons`,
  ADD INDEX `agreements_state_index` (`state`),
  ADD INDEX `agreements_type_index` (`type`);
```

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| `state` | varchar(20) | NO | 'draft' | `draft`, `sent`, `signed`, `terminated` |
| `type` | varchar(30) | YES | NULL | `hca`, `supplier`, `care_coordinator`, etc. |
| `hold_reasons` | json | YES | NULL | Why agreement is not-signable (clinical, coordinator) |
| `sent_at` | timestamp | YES | NULL | When agreement was sent for signing |

**Backfill logic** (separate Operation, NOT in migration):

Create `app/Operations/BackfillAgreementStateAndTypeOperation.php`:
- `signed_at IS NOT NULL` → state = `signed`
- `expired_at IS NOT NULL` → state = `terminated`
- Otherwise → state = `draft`
- All existing records → type = `supplier` (only Supplier agreements exist today)

Run via: `php artisan operation:run BackfillAgreementStateAndTypeOperation`

---

### `packages` — No changes needed

The existing `packages` table already has all columns needed:
- `stage` (ON_BOARDING / ACTIVE / TERMINATED) — `ON_BOARDING` maps to "Pending"
- `package_option` (SELF_MANAGED / SELF_MANAGED_PLUS / NONE)
- `care_coordinator_id` (FK → care_coordinators)
- `care_coordination_fee` (decimal)
- `commencement_date`, `cessation_date`
- `recipient_id`, `care_recipient_id`

LTH conversion creates a Package with `stage = ON_BOARDING` (Pending). Client-HCA transitions it to `ACTIVE` when HCA is signed.

---

### `leads` — No changes needed

The existing `leads` table already has:
- `zoho_id` for Zoho CRM reference
- `sync_status` for sync state tracking
- `tracking_meta`, `recipient_meta`, `journey_meta` JSON columns

The new `lead_conversions` table references `leads.id` via FK — no schema changes on leads itself.

---

## Enums

### LeadConversionStatusEnum

| Value | Label | Notes |
|-------|-------|-------|
| `IN_PROGRESS` | In Progress | Wizard started, not yet complete |
| `COMPLETED` | Completed | Wizard finished (agreement sent or completed) |
| `ABANDONED` | Abandoned | User left and conversion was marked abandoned |

### LeadRiskOutcomeEnum

| Value | Label | Routing |
|-------|-------|---------|
| `SUITABLE` | Suitable / Approved | → Step 6 (signable) |
| `CLINICAL_ATTENTION` | Clinical Attention | → Step 6 (not-signable, clinical hold) |
| `NOT_SUITED` | Not Suited / Rejected | → STOP (no Step 6) |

### LeadCoordinatorSourceEnum

| Value | Label | Notes |
|-------|-------|-------|
| `TC_INTERNAL` | TC Internal | Default Trilogy Care coordinator |
| `BD_PIPELINE` | BD Pipeline | Pre-assigned from business development |
| `MANUAL_OVERRIDE` | Manual Override | Sales rep selected a specific coordinator |
| `UNKNOWN` | Unknown / I Don't Know | Cannot determine → not-signable |

### LeadConversionSyncTypeEnum

See sync_type values in `lead_conversion_sync_logs` table above.

### LeadConversionSyncStatusEnum

| Value | Label |
|-------|-------|
| `PENDING` | Pending |
| `SUCCESS` | Success |
| `FAILED` | Failed |

### AgreementStateEnum (new — for agreements.state)

| Value | Label | Transition From |
|-------|-------|-----------------|
| `DRAFT` | Draft | Initial state, or not-signable conversion |
| `SENT` | Sent | Draft → Sent (when HCA is sent for signing) |
| `SIGNED` | Signed | Sent → Signed (when client signs) |
| `TERMINATED` | Terminated | Signed → Terminated (when agreement ends) |

### AgreementTypeEnum (new — for agreements.type)

| Value | Label |
|-------|-------|
| `HCA` | Home Care Agreement |
| `SUPPLIER` | Supplier Agreement |
| `CARE_COORDINATOR` | Care Coordinator Agreement |

---

## Existing Tables Referenced

### `leads` (existing)

| Column | Type | Notes |
|--------|------|-------|
| `id` | bigint unsigned | PK |
| `tc_customer_no` | varchar | UNIQUE |
| `owner_id` | bigint unsigned | FK → lead_owners.id |
| `user_id` | bigint unsigned | FK → users.id |
| `tracking_meta` | json | Tracking data |
| `recipient_meta` | json | Recipient personal details |
| `journey_meta` | json | Journey stage data |
| `sync_status` | varchar | LeadSyncStatusEnum |
| `zoho_id` | varchar | Zoho CRM ID |

### `packages` (existing — key columns)

| Column | Type | Notes |
|--------|------|-------|
| `id` | bigint unsigned | PK |
| `zoho_id` | varchar | UNIQUE |
| `tc_customer_no` | varchar | UNIQUE |
| `recipient_id` | bigint unsigned | FK → users.id |
| `care_coordinator_id` | bigint unsigned | FK → care_coordinators.id |
| `stage` | varchar | PackageStageEnum (ON_BOARDING, ACTIVE, TERMINATED) |
| `package_option` | varchar | PackageOptionEnum (SELF_MANAGED, SELF_MANAGED_PLUS) |
| `package_level` | varchar | Package level |
| `commencement_date` | date | Package start |
| `cessation_date` | date | Package end |
| `care_coordination_fee` | decimal(8,3) | Coordination fee |

### `agreements` (existing — before migration)

| Column | Type | Notes |
|--------|------|-------|
| `id` | bigint unsigned | PK |
| `agreementable_type` | varchar | Polymorphic type |
| `agreementable_id` | bigint unsigned | Polymorphic ID |
| `agreement_version` | varchar | e.g., `v1` |
| `signing_details` | json | Who signed, position, user ID |
| `signature` | longtext | Base64 signature data |
| `signed_at` | timestamp | When signed |
| `amended_at` | datetime | When amended |
| `expired_at` | datetime | When expired/terminated |

### `care_coordinators` (existing — key columns)

| Column | Type | Notes |
|--------|------|-------|
| `id` | bigint unsigned | PK |
| `zoho_id` | varchar | Zoho ID |
| `business_id` | bigint unsigned | FK → businesses.id |
| `care_coordination_percentage` | double | Coordination % |
| `default_loading_fee` | decimal | Default loading fee |
| `stage` | varchar | CareCoordinatorStageEnum |

### `package_care_coordination_loadings` (existing)

| Column | Type | Notes |
|--------|------|-------|
| `id` | bigint unsigned | PK |
| `package_id` | bigint unsigned | FK → packages.id |
| `care_coordination_loading_percentage` | decimal | Custom % for this package |
| `effective_from` | date | When this fee becomes active |

---

## Migration Order

1. `xxxx_create_lead_conversions_table.php` — New table
2. `xxxx_create_lead_conversion_sync_logs_table.php` — New table
3. `xxxx_add_state_and_type_to_agreements_table.php` — Alter existing table + backfill

---

## Data Flow

```
Step 1: Lead Details
  └─→ lead_conversions.step_data (JSON, step 1 fields)
  └─→ SyncStep1: Zoho Contacts (create) + Zoho Care_Plans (create)
  └─→ lead_conversions.zoho_consumer_id, zoho_care_plan_id

Step 2: Package Details
  └─→ lead_conversions.step_data (JSON, step 2 fields)
  └─→ SyncStep2: Zoho Contacts (update)

Step 3: ACAT/IAT Extraction
  └─→ lead_conversions.step_data (JSON, step 3 fields)
  └─→ SyncStep3: Zoho Care_Plans (update ACAT data)

Step 4: Screening Questions
  └─→ lead_conversions.step_data (JSON, step 4 answers)
  └─→ No Zoho sync

Step 5: Screening Result
  └─→ lead_conversions.risk_outcome, risk_score, risk_confidence, risk_flags
  └─→ SyncStep5: Zoho Care_Plans (update risk)

Step 6: Agreement + Coordinator
  └─→ lead_conversions.coordinator_id, coordinator_source, coordination_fee
  └─→ SyncStep6: Zoho Care_Plans (update coordinator)
  └─→ packages (INSERT, stage=ON_BOARDING)
  └─→ agreements (INSERT, state=sent OR state=draft, agreementable=Package)
  └─→ package_care_coordination_loadings (INSERT, if SM+ with coordinator)
  └─→ lead_conversions.package_id, agreement_id, completed_at
  └─→ SyncCompletion: Zoho Deals (create)
```
