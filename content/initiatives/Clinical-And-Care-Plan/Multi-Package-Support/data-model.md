---
title: "Data Model: Multi-Package Support (MPS)"
---

# Data Model: Multi-Package Support (MPS)

## Entity Relationship Diagram

```
┌─────────────────────────┐
│       Package            │
│─────────────────────────│
│ id (PK)                  │
│ recipient_id (FK)        │
│ care_coordinator_id (FK) │
│ ...existing fields...    │
├─────────────────────────┤
│ hasMany: EntryRecord     │
│ hasMany: PackageAlloc    │
│ hasMany: Funding         │
└────────┬────────────────┘
         │ 1:M
         ▼
┌─────────────────────────┐       ┌──────────────────────────┐
│   PackageAllocation      │       │       FundingStream       │
│  (existing - SA sync)    │       │     (existing - ref)      │
│─────────────────────────│       │──────────────────────────│
│ id (PK)                  │       │ id (PK)                   │
│ package_id (FK)          │       │ code (ON,RC,EL,AT,HM...) │
│ place_identifier         │       │ name                      │
│ classification_code      │       │ ...                       │
│ status                   │       └──────────┬───────────────┘
│ takeup_end_date          │                  │
│ current_place_indicator  │                  │
│ offer_type               │                  │
│ effective_start_date     │                  │
│ effective_end_date       │                  │
└────────┬────────────────┘                  │
         │ 1:1                               │
         ▼                                   │
┌─────────────────────────┐                  │
│     EntryRecord (NEW)    │                  │
│─────────────────────────│                  │
│ id (PK)                  │                  │
│ package_id (FK)          │                  │
│ package_allocation_id(FK)│                  │
│ classification_code      │                  │
│ status (enum)            │                  │
│ commencement_date        │                  │
│ lodgement_date           │                  │
│ consent_date             │                  │
│ consent_confirmed_by(FK) │                  │
│ deferred_reason          │                  │
│ deferred_at              │                  │
│ care_partner_id (FK)     │                  │
│ take_up_deadline         │                  │
│ intent_captured_at       │                  │
│ withdrawal_reason        │                  │
│ withdrawn_at             │                  │
│ status_reason            │                  │
├─────────────────────────┤                  │
│ hasMany: Funding         │                  │
└────────┬────────────────┘                  │
         │ 1:M                               │
         ▼                                   │
┌─────────────────────────┐                  │
│      Funding (existing)  │◄─────────────────┘
│─────────────────────────│  belongsTo: FundingStream
│ id (PK)                  │
│ package_id (FK)          │
│ funding_stream_id (FK)   │
│ entry_record_id (FK) NEW │
│ external_id              │
│ start_date               │
│ end_date                 │
│ total_amount             │
│ ...existing fields...    │
└─────────────────────────┘
```

## New Entity: EntryRecord

### Purpose

An EntryRecord represents a single ACER lodgement per classification per package. It is the unit of work that Finance lodges with Services Australia. A single EntryRecord can produce multiple Funding records (e.g., RC classification -> RC funding stream + CM funding stream).

### Column Definitions

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | `bigint unsigned` | No | auto | Primary key |
| `package_id` | `foreignId` | No | - | The client's package. FK to `packages.id` |
| `package_allocation_id` | `foreignId` | Yes | null | The SA allocation that triggered this entry. FK to `package_allocations.id`. Nullable for manually created entries (e.g., from LTH POS before SA allocates) |
| `classification_code` | `string(10)` | No | - | SA classification code matching the allocation (e.g., `RC`, `EL`, `AT`, `HM`, `ON`, `CM`) |
| `status` | `string(20)` | No | - | Current lifecycle status. See EntryRecordStatusEnum |
| `commencement_date` | `date` | Yes | null | When the funding stream starts. Set during activation or ACER lodgement. Must be <= `take_up_deadline` |
| `lodgement_date` | `date` | Yes | null | When the ACER was lodged in PRODA. Set by Finance during lodgement recording |
| `consent_date` | `datetime` | Yes | null | When client consent was confirmed by the Care Coordinator |
| `consent_confirmed_by` | `foreignId` | Yes | null | FK to `users.id`. The user who confirmed consent |
| `deferred_reason` | `text` | Yes | null | Free-text reason why the entry was deferred. Required when status = `deferred` |
| `deferred_at` | `datetime` | Yes | null | Timestamp when the entry was deferred |
| `care_partner_id` | `foreignId` | Yes | null | FK to `users.id`. Clinical care partner assigned for RC/EOL entries. Required for RC and EOL classifications |
| `take_up_deadline` | `date` | Yes | null | Copied from `PackageAllocation.takeup_end_date`. The deadline by which the ACER must be lodged. Nullable for entries created from POS intent (before SA allocates) |
| `intent_captured_at` | `datetime` | Yes | null | When the sales team captured intent at POS (LTH Step 2). Present for entries created from LTH flow; null for entries auto-created by sync |
| `withdrawal_reason` | `string(255)` | Yes | null | Reason from SA API (`PackageAllocation.status_reason`) when funding is withdrawn |
| `withdrawn_at` | `datetime` | Yes | null | When the withdrawal was detected/recorded |
| `status_reason` | `string(255)` | Yes | null | Additional context for the current status (e.g., "Level change from SAH 3 to SAH 4") |

### Indexes

| Name | Columns | Type | Purpose |
|------|---------|------|---------|
| `entry_records_package_classification_unique` | `(package_id, classification_code)` | Unique | Prevent duplicate entries for same classification per package |
| `entry_records_status_index` | `(status)` | Index | Fast queue filtering by tab |
| `entry_records_take_up_deadline_index` | `(take_up_deadline)` | Index | Urgency sorting |
| `entry_records_package_id_index` | `(package_id)` | Index | Package view eager loading |

### Relationships

| Relationship | Type | Foreign Key | Related Model | Notes |
|-------------|------|-------------|---------------|-------|
| `package` | BelongsTo | `package_id` | `Package` | The client's package |
| `packageAllocation` | BelongsTo | `package_allocation_id` | `PackageAllocation` | The SA allocation (nullable) |
| `fundings` | HasMany | `entry_record_id` on Funding | `Funding` | Budget records produced by this entry |
| `carePartner` | BelongsTo | `care_partner_id` | `User` | Clinical care partner (RC/EOL) |
| `consentConfirmedBy` | BelongsTo | `consent_confirmed_by` | `User` | Who confirmed consent |

### Status Lifecycle

```
                         ┌──────────────┐
                         │ PendingIntent│ (POS, classification pending at SA)
                         └──────┬───────┘
                                │ SA allocates + Coordinator confirms
                                ▼
┌──────────┐            ┌──────────────┐
│  Sync    │───────────▶│   Queued     │ (SA allocated, awaiting consent)
│ detected │            └──────┬───────┘
└──────────┘                   │
                    ┌──────────┴──────────┐
                    ▼                     ▼
            ┌──────────────┐     ┌──────────────┐
            │  Activated   │     │   Deferred   │
            └──────┬───────┘     └──────┬───────┘
                   │                    │
                   │ auto               │ take-up deadline passes
                   ▼                    ▼
            ┌──────────────┐     ┌──────────────┐
            │ ACER Pending │     │   Expired    │
            └──────┬───────┘     └──────────────┘
                   │
                   │ Finance lodges ACER
                   ▼
            ┌──────────────┐
            │ ACER Lodged  │
            └──────┬───────┘
                   │
                   │ SA allocates budget
                   ▼
            ┌──────────────┐
            │  Funding     │
            │  Available   │
            └──────┬───────┘
                   │
                   │ Services commence
                   ▼
            ┌──────────────┐
            │    Active    │
            └──────┬───────┘
                   │
            ┌──────┴──────┐
            ▼             ▼
     ┌──────────┐  ┌──────────┐
     │Withdrawn │  │Completed │
     └──────────┘  └──────────┘
```

### Valid Status Transitions

| From | To | Trigger | Who |
|------|----|---------|-----|
| `pending_intent` | `queued` | SA allocates + Coordinator confirms | System (sync) + Coordinator |
| `queued` | `activated` | Coordinator confirms consent | Coordinator |
| `queued` | `deferred` | Client declines / timing not right | Coordinator |
| `deferred` | `activated` | Client later consents | Coordinator |
| `deferred` | `expired` | Take-up deadline passes | System (scheduled job) |
| `activated` | `acer_pending` | Auto (activation immediately creates ACER queue item) | System |
| `acer_pending` | `acer_lodged` | Finance records ACER lodgement | Finance |
| `acer_lodged` | `funding_available` | SA sync detects budget allocation | System (sync) |
| `funding_available` | `active` | Services commence | System/Coordinator |
| `active` | `withdrawn` | SA withdraws funding | System (sync) |
| `active` | `completed` | Funding period ends | System (sync) |

## Modified Entity: Funding

### New Column

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| `entry_record_id` | `foreignId` | Yes | FK to `entry_records.id`. Links this funding record to the entry that produced it. Nullable for existing funding records created before MPS |

### New Relationship

| Relationship | Type | Foreign Key | Related Model |
|-------------|------|-------------|---------------|
| `entryRecord` | BelongsTo | `entry_record_id` | `EntryRecord` |

## Existing Entities (No Changes)

### PackageAllocation
No schema changes. MPS reads from this table during sync. The `takeup_end_date`, `status`, `classification_code`, and `current_place_indicator` fields are used to determine when to create EntryRecords.

### FundingStream
No schema changes. Reference table of 10 funding stream types. Used for display and classification mapping.

### PackageClassification
No schema changes. Read-only reference for classification details.

## Migration Plan

### Migration 1: `create_entry_records_table`
- Creates the `entry_records` table with all columns and indexes
- Schema-only, no data operations

### Migration 2: `add_entry_record_id_to_fundings_table`
- Adds nullable `entry_record_id` FK column to `fundings` table
- Nullable because existing funding records predate MPS

### Operation: `BackfillEntryRecordsFromAllocations`
- Runs as a Laravel Operation (not in migration)
- For each `PackageAllocation` with `status: ALLOCATED` and `current_place_indicator: Y`:
  - Check if an EntryRecord exists for that `package_id + classification_code`
  - If not, create one in `queued` status with `take_up_deadline` from the allocation
- Links existing `Funding` records to their corresponding `EntryRecord` where classification codes match
