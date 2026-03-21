---
title: "Database Specification: Calls Uplift"
---

# Database Specification: Calls Uplift

**Created**: 2026-02-05
**Status**: Draft

---

## Overview

Extend the existing Aircall module to support Call Reviews workflow. Primary changes:
1. Add review fields to existing `aircall_calls` table
2. Create new `call_transcriptions` table for Graph-provided transcriptions

---

## Entity-Relationship Diagram

```mermaid
erDiagram
    aircall_calls ||--o| call_transcriptions : "has one"
    aircall_calls ||--o| notes : "case note"
    aircall_calls ||--o| care_management_activities : "activity"
    aircall_calls }o--|| users : "reviewed by"
    aircall_calls }o--o{ packages : "linked via aircall_aircallables"

    aircall_calls {
        bigint id PK
        string aircall_id UK
        string graph_call_id UK
        bigint user_id FK "Aircall user"
        bigint reviewed_by FK "nullable"
        bigint transcription_id FK "nullable"
        bigint case_note_id FK "nullable"
        bigint activity_id FK "nullable"
        enum direction "inbound/outbound"
        enum status "completed/failed/no-answer"
        enum review_status "pending_transcription/pending_review/reviewed/non_package"
        datetime started_at
        datetime ended_at
        int duration
        string raw_digits
        string s3_recording_path
        datetime reviewed_at "nullable"
        json meta
    }

    call_transcriptions {
        ulid id PK
        bigint aircall_call_id FK UK
        string graph_transcription_id UK
        longtext transcription_text
        text ai_summary "nullable"
        text ai_suggested_case_note "nullable"
        json ai_suggested_tasks "nullable, array of task objects"
        json speaker_segments "nullable"
        datetime received_at
        datetime created_at
        datetime updated_at
    }

    aircall_aircallables {
        bigint id PK
        bigint aircall_call_id FK
        string aircallable_type "Package/User"
        bigint aircallable_id
    }

    packages {
        bigint id PK
        string tc_number UK
        string recipient_name
    }

    users {
        bigint id PK
        string name
        string email
        boolean has_aircall_account
    }

    notes {
        bigint id PK
        bigint package_id FK
        bigint user_id FK
        text content
        string type "phone_call"
        json meta "call metadata"
    }

    care_management_activities {
        bigint id PK
        bigint package_id FK
        bigint user_id FK
        int duration_minutes
        string activity_type "phone_call"
        datetime performed_at
    }
```

---

## Data Model

### Primary Entities

| Entity | Purpose | Estimated Volume |
|--------|---------|------------------|
| `aircall_calls` (existing) | Call records from Aircall | ~500/day, 180k/year |
| `call_transcriptions` (new) | Transcription data from Graph | ~500/day (1:1 with calls) |
| `aircall_aircallables` (existing) | Polymorphic call-to-entity links | ~500/day |

### Entity Details

#### aircall_calls (Extended)

**New Fields:**

| Field | Type | Nullable | Constraints | Index |
|-------|------|----------|-------------|-------|
| `review_status` | enum | No | Default: pending_transcription | Yes (filtered queries) |
| `reviewed_at` | datetime | Yes | - | No |
| `reviewed_by` | bigint | Yes | FK → users.id | Yes |
| `transcription_id` | bigint | Yes | FK → call_transcriptions.id | No |
| `case_note_id` | bigint | Yes | FK → notes.id | No |
| `activity_id` | bigint | Yes | FK → care_management_activities.id | No |
| `graph_call_id` | string(36) | Yes | Unique | Yes |

**Review Status Enum:**
```php
enum CallReviewStatus: string
{
    case PENDING_TRANSCRIPTION = 'pending_transcription';
    case PENDING_REVIEW = 'pending_review';
    case REVIEWED = 'reviewed';
    case NON_PACKAGE = 'non_package';
}
```

#### call_transcriptions (New)

| Field | Type | Nullable | Constraints | Index |
|-------|------|----------|-------------|-------|
| `id` | ulid | No | PK | Yes |
| `aircall_call_id` | bigint | No | FK, Unique | Yes |
| `graph_transcription_id` | string(36) | No | Unique | Yes |
| `transcription_text` | longtext | No | - | No |
| `ai_summary` | text | Yes | - | No |
| `ai_suggested_case_note` | text | Yes | - | No |
| `ai_suggested_tasks` | json | Yes | Array of task suggestion objects | No |
| `speaker_segments` | json | Yes | - | No |
| `received_at` | datetime | No | - | No |
| `created_at` | datetime | No | - | No |
| `updated_at` | datetime | No | - | No |

---

## Relationships

### One-to-One

| Parent | Child | Cascade | Notes |
|--------|-------|---------|-------|
| `aircall_calls` | `call_transcriptions` | Cascade delete | One transcription per call |

### Many-to-One (BelongsTo)

| Child | Parent | Nullable | Notes |
|-------|--------|----------|-------|
| `aircall_calls` | `users` (reviewed_by) | Yes | Who completed the review |
| `aircall_calls` | `notes` (case_note) | Yes | Optional case note created |
| `aircall_calls` | `care_management_activities` | Yes | Activity logged on review |

### Many-to-Many (Polymorphic)

| Entity A | Entity B | Pivot Table | Extra Columns |
|----------|----------|-------------|---------------|
| `aircall_calls` | `packages` | `aircall_aircallables` | `aircallable_type`, `aircallable_id` |
| `aircall_calls` | `users` | `aircall_aircallables` | (for contact matching) |

---

## Data Integrity & Validation

### Business Rules

| Rule | Enforcement | Level |
|------|-------------|-------|
| Call can only be reviewed once | Unique constraint on activity_id | DB |
| Transcription required before review | Check review_status transition | App |
| Package link required for review (unless non_package) | Validation in CompleteCallReviewAction | App |
| One transcription per call | Unique index on aircall_call_id | DB |

### Constraints

```sql
-- Unique transcription per call
ALTER TABLE call_transcriptions
ADD CONSTRAINT uk_call_transcriptions_call UNIQUE (aircall_call_id);

-- Unique graph identifiers
ALTER TABLE call_transcriptions
ADD CONSTRAINT uk_call_transcriptions_graph UNIQUE (graph_transcription_id);

ALTER TABLE aircall_calls
ADD CONSTRAINT uk_aircall_calls_graph UNIQUE (graph_call_id);
```

### Audit Trail

- `created_at`, `updated_at` on all tables (standard Laravel)
- `reviewed_at`, `reviewed_by` for review audit
- No soft deletes on transcriptions (compliance: keep all data)

---

## Scale & Performance

### Expected Volume

| Entity | Initial | Year 1 | Year 3 |
|--------|---------|--------|--------|
| `aircall_calls` | 50k existing | +180k | +540k |
| `call_transcriptions` | 0 | 180k | 540k |

### Peak Load

- ~250 coordinators with Aircall
- ~2,000 calls/day at peak
- ~50 concurrent inbox viewers

### Data Retention

- Call records: 7 years (aged care compliance)
- Transcriptions: 7 years (same as recordings)
- No archival needed in MVP

---

## Query Patterns & Indexing

### Common Queries

| Query | Frequency | Index Strategy |
|-------|-----------|----------------|
| Pending reviews for user | Very high | `(user_id, review_status)` |
| Pending review count | High (polling) | `(review_status)` |
| Calls by package | Medium | Existing polymorphic index |
| Calls by date range | Medium | `(started_at)` existing |

### Recommended Indexes

```sql
-- Primary query: coordinator's pending reviews
CREATE INDEX idx_aircall_calls_user_review
ON aircall_calls (user_id, review_status, started_at DESC);

-- Badge count query
CREATE INDEX idx_aircall_calls_review_status
ON aircall_calls (review_status)
WHERE review_status IN ('pending_review', 'pending_transcription');

-- Graph webhook lookup
CREATE INDEX idx_aircall_calls_graph_id
ON aircall_calls (graph_call_id);
```

---

## Security & Privacy

### Sensitive Data

| Field | Classification | Protection |
|-------|----------------|------------|
| `transcription_text` | PII (conversations) | Access control only |
| `s3_recording_path` | PII (voice) | S3 IAM + signed URLs |
| `raw_digits` | PII (phone numbers) | Access control only |

### Access Control

- **Calls Inbox**: Only users with `has_aircall_account`
- **Transcriptions**: Same as call access
- **Recordings**: Additional permission check (team leader role)

### Compliance

- 7-year retention (aged care requirement)
- No data deletion in MVP
- Audit trail via `reviewed_at`, `reviewed_by`

---

## Implementation Notes

### Database

- MySQL 8.0+
- InnoDB engine (transactions)

### ORM Considerations

```php
// AircallCall model additions
protected $casts = [
    'review_status' => CallReviewStatus::class,
    'reviewed_at' => 'datetime',
];

public function transcription(): HasOne
{
    return $this->hasOne(CallTranscription::class);
}

public function caseNote(): BelongsTo
{
    return $this->belongsTo(Note::class, 'case_note_id');
}

public function activity(): BelongsTo
{
    return $this->belongsTo(CareManagementActivity::class);
}

public function reviewedBy(): BelongsTo
{
    return $this->belongsTo(User::class, 'reviewed_by');
}

// Scopes
public function scopePendingReview(Builder $query): Builder
{
    return $query->where('review_status', CallReviewStatus::PENDING_REVIEW);
}

public function scopeForUser(Builder $query, int $userId): Builder
{
    return $query->where('user_id', $userId);
}
```

### Migration Strategy

1. **Migration 1**: Add review fields to `aircall_calls`
   - All nullable initially
   - Set default `review_status` = 'pending_transcription'

2. **Migration 2**: Create `call_transcriptions` table

3. **Data backfill**: Mark existing calls as 'reviewed' or 'non_package' (one-time script)

---

## Database Clarifications

### Session 2026-02-05

- Q: Separate transcriptions table or JSON column? → A: **Separate table** - Better for querying, indexing, and future features
- Q: Store package matches from Graph? → A: **No** - Use existing `aircall_aircallables` pivot, Graph just suggests matches

---

## Open Questions

- [ ] Should we store Graph's confidence score for package matches?
- [ ] Retention policy for calls without transcriptions?

---

## Approval

- [ ] Schema approved
- [ ] Relationships verified
- [ ] Performance strategy defined
- [ ] Ready for migration creation
