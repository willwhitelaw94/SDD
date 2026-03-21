---
title: "Database Specification: Lead Essential (LES)"
---

# Database Specification: Lead Essential (LES)

**Plan**: [plan.md](plan.md)
**Created**: 2026-02-22
**Status**: Draft

---

## Overview

Lead Essential introduces **3 new tables** and **3 new columns** on the existing `leads` table. The Lead domain is **not event sourced** — all persistence is standard Eloquent with JSON metadata columns. No existing tables are modified destructively.

---

## Existing `leads` Table (Reference)

Current columns (do not modify):

| Column | Type | Notes |
|--------|------|-------|
| `id` | bigint UNSIGNED PK | Auto-increment |
| `tc_customer_no` | varchar UNIQUE | Trilogy Care customer number |
| `owner_id` | bigint UNSIGNED FK → `lead_owners.id` | Consumer identity record |
| `user_id` | bigint UNSIGNED FK → `users.id` | Staff rep who owns/created the lead |
| `tracking_meta` | json | UTM params, traffic source, session data |
| `recipient_meta` | json | Profile data: personal, living, support, cultural, contacts |
| `journey_meta` | json | Stage, purchase intent, attribution, follow-up |
| `sync_status` | varchar(20) | `LeadSyncStatusEnum` — Zoho sync state |
| `zoho_id` | varchar | External Zoho record ID |
| `klaviyo_sync_status` | varchar | Klaviyo sync state |
| `deleted_at` | timestamp NULLABLE | Soft deletes |
| `created_at` | timestamp | |
| `updated_at` | timestamp | |

---

## New Columns on `leads`

### Migration 1: `add_assigned_user_id_to_leads_table`

```php
// database/migrations/YYYY_MM_DD_000001_add_assigned_user_id_to_leads_table.php

Schema::table('leads', function (Blueprint $table) {
    $table->foreignId('assigned_user_id')
        ->nullable()
        ->after('user_id')
        ->constrained('users')
        ->nullOnDelete()
        ->comment('Active sales agent responsible for this lead. Nullable for unassigned leads.');

    $table->index('assigned_user_id');
});
```

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| `assigned_user_id` | bigint UNSIGNED FK → `users.id` | YES | NULL | ON DELETE SET NULL. Auto-set to `user_id` on staff creation. LDS will build round-robin/least-loaded assignment on top of this column. |

> **`user_id` vs `assigned_user_id`**: `user_id` = original record owner/creator (unchanged). `assigned_user_id` = the active sales agent currently responsible for converting the lead. They can differ (e.g. reassigned leads).

---

### Migration 2: `add_lead_status_and_last_contact_at_to_leads_table`

```php
// database/migrations/YYYY_MM_DD_000002_add_lead_status_and_last_contact_at_to_leads_table.php

Schema::table('leads', function (Blueprint $table) {
    $table->string('lead_status', 30)
        ->notNull()
        ->default('not_contacted')
        ->after('journey_meta')
        ->comment('not_contacted, attempted_contact, made_contact, lost, converted');

    $table->timestamp('last_contact_at')
        ->nullable()
        ->after('lead_status')
        ->comment('Cached timestamp of most recent Made Contact or Attempted Contact status. Updated by UpdateLeadStatusAction. Indexed for list view filtering.');

    $table->index('lead_status');
    $table->index('last_contact_at');
});
```

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| `lead_status` | varchar(30) | NO | `'not_contacted'` | `LeadStatusEnum` value. Indexed for list filters. |
| `last_contact_at` | timestamp | YES | NULL | Cached column — NOT computed on read. Updated by `UpdateLeadStatusAction` on Made Contact / Attempted Contact transitions. Indexed for sorting/filtering on list view. Enables LDS lead-steal staleness check. |

> **`lead_status` valid values** (enforced by `LeadStatusEnum`): `not_contacted`, `attempted_contact`, `made_contact`, `lost`, `converted`. The `converted` value is set exclusively by the LTH completion flow — LES status wizard cannot set it directly.

---

## New Tables

### Migration 3: `create_lead_timeline_entries_table`

An **immutable** audit trail of all lead events. No `updated_at` column. No soft deletes. Entries are append-only.

```php
// database/migrations/YYYY_MM_DD_000003_create_lead_timeline_entries_table.php

Schema::create('lead_timeline_entries', function (Blueprint $table) {
    $table->id();

    $table->foreignId('lead_id')
        ->constrained('leads')
        ->cascadeOnDelete();

    $table->foreignId('created_by')
        ->nullable()
        ->constrained('users')
        ->nullOnDelete()
        ->comment('NULL for system-generated events (e.g. auto-assignment on creation).');

    $table->string('event_type', 50)
        ->comment('note, status_change, stage_change, assignment, creation, section_edit, traits_edit');

    $table->string('title', 200)
        ->comment('Human-readable summary shown in timeline UI.');

    $table->text('description')
        ->nullable()
        ->comment('Extended content. For notes, this IS the note text.');

    $table->json('metadata')
        ->nullable()
        ->comment('Structured event data. Schema varies by event_type (see below).');

    $table->boolean('is_pinned')
        ->default(false)
        ->comment('Reserved for LDS pinning feature. No UI in LES — always false.');

    $table->timestamp('created_at')
        ->useCurrent();

    // Indexes
    $table->index(['lead_id', 'created_at']);
    $table->index('event_type');
});
```

**Columns:**

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| `id` | bigint UNSIGNED PK | NO | auto | |
| `lead_id` | bigint UNSIGNED FK → `leads.id` | NO | — | CASCADE on delete |
| `created_by` | bigint UNSIGNED FK → `users.id` | YES | NULL | NULL = system event. ON DELETE SET NULL. |
| `event_type` | varchar(50) | NO | — | See event type enum below |
| `title` | varchar(200) | NO | — | Short human-readable summary |
| `description` | text | YES | NULL | Note text, or extended context |
| `metadata` | json | YES | NULL | Structured data per event type |
| `is_pinned` | tinyint(1) | NO | 0 | Reserved for LDS; always false in LES |
| `created_at` | timestamp | NO | CURRENT | No `updated_at` — entries are immutable |

**Event Types (valid `event_type` values):**

| Value | Triggered By | Metadata Shape |
|-------|-------------|----------------|
| `creation` | `CreateLeadAction` | `{ source: 'staff' \| 'consumer' \| 'zoho', created_by_name: string }` |
| `status_change` | `UpdateLeadStatusAction` | `{ from: string, to: string, contact_method?: string, contact_outcome?: string, follow_up_date?: string }` |
| `stage_change` | `UpdateLeadJourneyStageAction` | `{ from: string, to: string }` |
| `assignment` | `AssignLeadAction` | `{ from_user_id?: int, from_user_name?: string, to_user_id: int, to_user_name: string }` |
| `section_edit` | `UpdateLead*Action` (any section) | `{ section: string }` |
| `traits_edit` | `UpdateLeadTraitsAction` | `{ section: 'traits' }` |
| `note` | `CreateLeadTimelineEntryAction` | null (description IS the note) |

**Indexes:**

| Index | Columns | Type | Purpose |
|-------|---------|------|---------|
| Primary | `id` | PK | |
| `lead_timeline_entries_lead_id_created_at_index` | `(lead_id, created_at)` | BTREE | Paginated timeline queries |
| `lead_timeline_entries_event_type_index` | `event_type` | BTREE | Filter by event type |

---

### Migration 4: `create_lead_status_histories_table`

Structured record of each status transition, capturing wizard-specific fields that are too granular for the timeline `metadata` JSON.

```php
// database/migrations/YYYY_MM_DD_000004_create_lead_status_histories_table.php

Schema::create('lead_status_histories', function (Blueprint $table) {
    $table->id();

    $table->foreignId('lead_id')
        ->constrained('leads')
        ->cascadeOnDelete();

    $table->foreignId('created_by')
        ->constrained('users');

    $table->string('previous_status', 30)
        ->nullable()
        ->comment('NULL for first status assignment.');

    $table->string('new_status', 30)
        ->comment('LeadStatusEnum value at time of transition.');

    $table->string('contact_method', 50)
        ->nullable()
        ->comment('phone, email, sms, in_person. Captured for Attempted Contact and Made Contact transitions.');

    $table->string('contact_outcome', 50)
        ->nullable()
        ->comment('no_answer, left_voicemail, line_busy, spoke_briefly. Captured for Attempted Contact and Made Contact transitions.');

    $table->string('journey_stage', 50)
        ->nullable()
        ->comment('LeadJourneyStageEnum value captured at Made Contact transition.');

    $table->string('purchase_intent', 10)
        ->nullable()
        ->comment('hot, warm, cold. Captured at Made Contact transition.');

    $table->string('attribution', 100)
        ->nullable()
        ->comment('Lead source at Made Contact (e.g. Website Enquiry, Referral).');

    $table->string('lost_type', 30)
        ->nullable()
        ->comment('lost_lead, junk, uncontactable. Captured for Lost transition.');

    $table->string('lost_reason', 100)
        ->nullable()
        ->comment('Dynamic to lost_type. Captured for Lost transition.');

    $table->date('follow_up_date')
        ->nullable()
        ->comment('Optional follow-up date set during status wizard.');

    $table->text('notes')
        ->nullable()
        ->comment('Free-text notes entered in the status wizard.');

    $table->timestamp('created_at')
        ->useCurrent();

    // Indexes
    $table->index('lead_id');
    $table->index(['lead_id', 'created_at']);
});
```

**Columns:**

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| `id` | bigint UNSIGNED PK | NO | auto | |
| `lead_id` | bigint UNSIGNED FK → `leads.id` | NO | — | CASCADE on delete |
| `created_by` | bigint UNSIGNED FK → `users.id` | NO | — | Staff who triggered the transition |
| `previous_status` | varchar(30) | YES | NULL | NULL = initial status set at creation |
| `new_status` | varchar(30) | NO | — | `LeadStatusEnum` value |
| `contact_method` | varchar(50) | YES | NULL | `phone`, `email`, `sms`, `in_person` |
| `contact_outcome` | varchar(50) | YES | NULL | `no_answer`, `left_voicemail`, `line_busy`, `spoke_briefly` |
| `journey_stage` | varchar(50) | YES | NULL | `LeadJourneyStageEnum` value — captured at Made Contact only |
| `purchase_intent` | varchar(10) | YES | NULL | `hot`, `warm`, `cold` — Made Contact only |
| `attribution` | varchar(100) | YES | NULL | Lead source — Made Contact only |
| `lost_type` | varchar(30) | YES | NULL | `lost_lead`, `junk`, `uncontactable` — Lost only |
| `lost_reason` | varchar(100) | YES | NULL | Dynamic to `lost_type` — Lost only |
| `follow_up_date` | date | YES | NULL | Optional follow-up date |
| `notes` | text | YES | NULL | Free-text notes |
| `created_at` | timestamp | NO | CURRENT | Immutable — no `updated_at` |

**Fields required per status transition:**

| Target Status | Required Fields | Optional Fields |
|--------------|----------------|----------------|
| `not_contacted` | _(none)_ | notes |
| `attempted_contact` | `contact_method`, `contact_outcome` | `follow_up_date`, notes |
| `made_contact` | `contact_method`, `contact_outcome`, `journey_stage`, `purchase_intent`, `attribution` | `follow_up_date`, notes |
| `lost` | `lost_type`, `lost_reason` | notes |
| `converted` | _Set by LTH only — not via LES status wizard_ | — |

---

### Migration 5: `create_lead_stage_histories_table`

Structured record of each journey stage transition. Separate from timeline entries for queryability and to support mandatory-fields capture per-stage.

```php
// database/migrations/YYYY_MM_DD_000005_create_lead_stage_histories_table.php

Schema::create('lead_stage_histories', function (Blueprint $table) {
    $table->id();

    $table->foreignId('lead_id')
        ->constrained('leads')
        ->cascadeOnDelete();

    $table->foreignId('created_by')
        ->constrained('users');

    $table->string('previous_stage', 50)
        ->nullable()
        ->comment('NULL for first stage set on lead creation.');

    $table->string('new_stage', 50)
        ->comment('LeadJourneyStageEnum value at time of transition.');

    $table->json('mandatory_fields')
        ->nullable()
        ->comment('Fields captured during the stage wizard. Schema defined per-stage at build time.');

    $table->timestamp('created_at')
        ->useCurrent();

    // Indexes
    $table->index(['lead_id', 'created_at']);
});
```

**Columns:**

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| `id` | bigint UNSIGNED PK | NO | auto | |
| `lead_id` | bigint UNSIGNED FK → `leads.id` | NO | — | CASCADE on delete |
| `created_by` | bigint UNSIGNED FK → `users.id` | NO | — | Staff who triggered the transition |
| `previous_stage` | varchar(50) | YES | NULL | NULL = initial stage. `LeadJourneyStageEnum` value. |
| `new_stage` | varchar(50) | NO | — | `LeadJourneyStageEnum` value |
| `mandatory_fields` | json | YES | NULL | Wizard-captured fields. Schema defined per-stage during Phase 1.7 implementation. |
| `created_at` | timestamp | NO | CURRENT | Immutable — no `updated_at` |

---

## JSON Schema Extensions

### `recipient_meta` JSON — New Keys

The `recipient_meta` JSON column on `leads` is extended with two new top-level keys.

#### `contacts` (array of contact objects)

```json
{
  "contacts": [
    {
      "id": "uuid-v4",
      "name": "Jane Smith",
      "relationship": "Daughter",
      "email": "jane@example.com",
      "phone": "0400 000 000",
      "contact_type": "primary"
    },
    {
      "id": "uuid-v4",
      "name": "Bob Smith",
      "relationship": "Son",
      "email": "bob@example.com",
      "phone": "0411 111 111",
      "contact_type": "secondary"
    }
  ]
}
```

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `id` | UUID v4 string | YES | Client-generated. Used as stable key for edit/delete operations. |
| `name` | string | YES | Full name |
| `relationship` | string | NO | Free text (e.g. "Daughter", "Carer") |
| `email` | string | NO | Not unique at DB level |
| `phone` | string | NO | |
| `contact_type` | `'primary' \| 'secondary'` | YES | Exactly one `primary` enforced by `UpdateLeadContactsAction`. |

#### `traits` (object)

```json
{
  "traits": {
    "preferred_communication": "phone",
    "best_time_to_call": "morning",
    "preferred_days": ["monday", "wednesday"],
    "personal_interests": "Gardening, reading",
    "technology_comfort": "medium",
    "additional_notes": "Prefers short calls, hard of hearing"
  }
}
```

| Field | Type | Notes |
|-------|------|-------|
| `preferred_communication` | `'phone' \| 'email' \| 'sms' \| 'in_person'` | |
| `best_time_to_call` | `'morning' \| 'afternoon' \| 'evening'` | |
| `preferred_days` | string[] | Days of week: `'monday'` through `'sunday'` |
| `personal_interests` | string | Free text |
| `technology_comfort` | `'low' \| 'medium' \| 'high'` | |
| `additional_notes` | string | Free text |

---

### `journey_meta` JSON — New Keys

The existing `journey_meta` JSON column is extended with additional keys. Existing keys must not be removed.

```json
{
  "stage": "ACAT_BOOKED",
  "follow_up_date": "2026-03-15",
  "purchase_intent": "hot",
  "attribution": "Website Enquiry"
}
```

| Key | Type | Notes |
|-----|------|-------|
| `stage` | `LeadJourneyStageEnum` value string | Current journey stage (synced from stage wizard) |
| `follow_up_date` | ISO date string `YYYY-MM-DD` | Set during status wizard. Not manually editable. |
| `purchase_intent` | `'hot' \| 'warm' \| 'cold'` | Set during Made Contact status wizard. |
| `attribution` | string | Lead source captured at Made Contact. |

> **Zoho sync safety**: `LeadData::forZoho()` maps from specific `journey_meta` keys. Do not rename existing keys. New keys added here are new — they will not appear in existing Zoho payloads unless explicitly added to `forZoho()`.

---

## New Enum: `LeadStatusEnum`

**File**: `domain/Lead/Enums/LeadStatusEnum.php`

```php
enum LeadStatusEnum: string
{
    /** Lead has been received but no contact attempt has been made */
    case NOT_CONTACTED = 'not_contacted';

    /** Contact has been attempted but the consumer was not reached */
    case ATTEMPTED_CONTACT = 'attempted_contact';

    /** Successful contact has been made with the consumer */
    case MADE_CONTACT = 'made_contact';

    /** The lead has been lost (not converted) */
    case LOST = 'lost';

    /** The lead has been fully converted to a consumer. Set by LTH only — read-only in LES. */
    case CONVERTED = 'converted';
}
```

---

## Updated `Lead` Model — New Relationships & Casts

These additions are required in `domain/Lead/Models/Lead.php`:

```php
// New cast
protected function casts(): array
{
    return [
        // ... existing casts ...
        'lead_status' => LeadStatusEnum::class,
        'last_contact_at' => 'datetime',
    ];
}

// New relationships
public function assignedUser(): BelongsTo
{
    return $this->belongsTo(User::class, 'assigned_user_id');
}

public function timelineEntries(): HasMany
{
    return $this->hasMany(LeadTimelineEntry::class)->latest();
}

public function statusHistories(): HasMany
{
    return $this->hasMany(LeadStatusHistory::class)->latest();
}

public function stageHistories(): HasMany
{
    return $this->hasMany(LeadStageHistory::class)->latest();
}

// New scopes (for list view filtering)
public function scopeByLeadStatus(Builder $query, LeadStatusEnum $status): Builder
{
    return $query->where('lead_status', $status);
}

public function scopeByAssignedUser(Builder $query, int $userId): Builder
{
    return $query->where('assigned_user_id', $userId);
}

public function scopeByJourneyStage(Builder $query, LeadJourneyStageEnum $stage): Builder
{
    return $query->whereJsonContains('journey_meta->stage', $stage->value);
}
```

---

## New Models Required

| Model | File | Table |
|-------|------|-------|
| `LeadTimelineEntry` | `domain/Lead/Models/LeadTimelineEntry.php` | `lead_timeline_entries` |
| `LeadStatusHistory` | `domain/Lead/Models/LeadStatusHistory.php` | `lead_status_histories` |
| `LeadStageHistory` | `domain/Lead/Models/LeadStageHistory.php` | `lead_stage_histories` |

Each model:
- Extends `Model`
- Does **not** have `updated_at` (set `public $timestamps = false;` and add `const CREATED_AT = 'created_at';`)
- No soft deletes
- Defines `BelongsTo` relationships back to `Lead` and `User`

---

## Migration Execution Order

All 5 migrations must run in order. Run after feature flag is enabled in the environment.

```
1. add_assigned_user_id_to_leads_table
2. add_lead_status_and_last_contact_at_to_leads_table
3. create_lead_timeline_entries_table
4. create_lead_status_histories_table
5. create_lead_stage_histories_table
```

**Rollback safety**: All new columns are nullable or have safe defaults. Migrations 1 and 2 are additive — rolling back removes new columns cleanly. Migrations 3-5 drop new tables — no data loss to existing tables.

---

## Seeder / Factory Notes

- **`LeadTimelineEntryFactory`**: Required for tests. Generates a `created_at`, random `event_type`, and minimal `metadata` per type.
- **`LeadStatusHistoryFactory`**: Required for tests. Should generate valid field combinations per `new_status` value.
- **`LeadStageHistoryFactory`**: Required for tests. Minimal fields.
- **`Lead` model factory update**: Add `assigned_user_id` (nullable), `lead_status` (default `not_contacted`), `last_contact_at` (nullable) to `LeadFactory::definition()`.

---

## Performance Considerations

| Concern | Mitigation |
|---------|------------|
| List view filtering by `lead_status` | Index on `leads.lead_status` |
| List view sorting by `last_contact_at` | Index on `leads.last_contact_at` |
| List view filtering by `assigned_user_id` | Index on `leads.assigned_user_id` |
| Timeline queries (paginated, newest first) | Composite index `(lead_id, created_at)` on `lead_timeline_entries` |
| `journey_meta->stage` JSON filter on list | JSON path queries on MySQL 8 are indexed via functional indexes if needed. Acceptable for current scale (~5,000 leads). Re-evaluate in LDS. |
