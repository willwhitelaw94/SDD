---
title: "Database Specification: On Hold Bills Flow (OHB)"
---


**Epic**: TP-3787
**Initiative**: TP-1857 Supplier Management
**Created**: 2026-01-16
**Status**: Draft

## Overview

This document defines the database schema, relationships, and data architecture for the On Hold Bills Flow (OHB) feature. OHB extends the existing TC Portal bills system to support multi-issue tracking, two communication streams, and temporal re-validation.

**Key Design Principles**:
- Isolate OHB state from existing Bill model (separate `bill_ohb_states` table)
- Use database table for reasons (not enum) due to complex attributes
- Soft delete for full audit trail
- Index for Bill → Reasons access pattern (primary), with Tasks handling department routing

---

## Data Model

### Primary Entities

| Entity | Table Name | Purpose |
|--------|------------|---------|
| BillOhbState | `bill_ohb_states` | OHB-specific state for a bill (1:1 with bills) |
| BillReason | `bill_reasons` | Junction: Bill ↔ OhbReason (many-to-many with state) |
| OhbReason | `ohb_reasons` | Master list of 36 OHB reasons with attributes |
| OhbCommunication | `ohb_communications` | Audit trail of external communications |
| OhbRevalidationLog | `ohb_revalidation_logs` | Temporal re-validation history |

### Existing Entities (Extended)

| Entity | Table Name | Changes |
|--------|------------|---------|
| Bill | `bills` | No schema changes - OHB state in separate table |
| Task | `tasks` | New tasks created for department work, references `bill_reasons` |

---

## Entity Details

### 1. bill_ohb_states

OHB-specific state, isolated from the main `bills` table. 1:1 relationship with `bills`.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | BIGINT UNSIGNED | NO | AUTO | Primary key |
| `bill_id` | BIGINT UNSIGNED | NO | - | FK to bills.id (unique) |
| `ohb_status` | VARCHAR(50) | NO | 'pending_diagnosis' | OHB workflow status |
| `comms_type` | VARCHAR(30) | YES | NULL | REJECT-RESUBMIT, REJECT_PERIOD, ON_HOLD |
| `cadence_status` | VARCHAR(20) | YES | NULL | day_0, day_3, day_7, day_10, resolved |
| `cadence_started_at` | TIMESTAMP | YES | NULL | When Day 0 comms sent |
| `resolution_window_status` | VARCHAR(20) | YES | NULL | active, resolved, expired |
| `resolution_window_started_at` | TIMESTAMP | YES | NULL | When Resolution Outreach sent |
| `limited_time_soft_warning` | BOOLEAN | NO | FALSE | Time-sensitive warning included |
| `original_bill_id` | BIGINT UNSIGNED | YES | NULL | FK to bills.id for resubmissions |
| `resubmission_count` | SMALLINT UNSIGNED | NO | 0 | Convenience counter |
| `outcome` | VARCHAR(30) | YES | NULL | PAID, REJECTED_FINAL, REJECTED_RESUBMIT |
| `outcome_at` | TIMESTAMP | YES | NULL | When final outcome reached |
| `created_at` | TIMESTAMP | NO | CURRENT | Record creation |
| `updated_at` | TIMESTAMP | NO | CURRENT | Last modification |

**Indexes**:
```sql
UNIQUE INDEX idx_bill_ohb_bill (bill_id)
INDEX idx_bill_ohb_status (ohb_status)
INDEX idx_bill_ohb_cadence (cadence_status, cadence_started_at)
INDEX idx_bill_ohb_original (original_bill_id)
```

**OHB Status Enum Values**:
- `pending_diagnosis` - Awaiting multi-issue diagnosis
- `in_diagnosis` - Diagnosis in progress
- `routing_to_departments` - Creating tasks for departments
- `awaiting_department_work` - Tasks assigned, waiting completion
- `in_revalidation` - Temporal re-validation running
- `awaiting_communication` - Ready to draft comms
- `on_hold` - Comms sent, awaiting external party
- `awaiting_resubmission` - Rejected, supplier may resubmit
- `completed` - Final outcome reached (paid/rejected)

---

### 2. ohb_reasons

Master list of OHB reasons with all attributes. Seeded from master-list-schema-updated.csv.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | BIGINT UNSIGNED | NO | AUTO | Primary key |
| `code` | VARCHAR(50) | NO | - | Unique reason code (e.g., 'ABN_GST_ERROR') |
| `name` | VARCHAR(100) | NO | - | Display name |
| `description` | TEXT | YES | NULL | Full description |
| `department_owner` | VARCHAR(20) | NO | - | care, compliance, accounts |
| `touches_invoice` | BOOLEAN | NO | FALSE | Requires invoice changes |
| `auto_reject_eligible` | BOOLEAN | NO | FALSE | AI can detect at 99% accuracy |
| `requires_internal_action` | BOOLEAN | NO | FALSE | Department work needed |
| `requires_resolution_outreach` | BOOLEAN | NO | FALSE | Client/coordinator action needed |
| `has_timeout` | BOOLEAN | NO | TRUE | Has Day 10 timeout |
| `cadence_days` | SMALLINT | YES | 10 | Days before timeout |
| `requires_revalidation` | BOOLEAN | NO | FALSE | Time-sensitive qualifiers |
| `revalidation_checks` | JSON | YES | NULL | ["funding_balance", "funding_period", ...] |
| `can_coexist_with` | JSON | YES | '["all"]' | Communication grouping rules |
| `possible_outcomes` | TEXT | YES | NULL | Comma-separated outcomes |
| `success_outcome` | VARCHAR(255) | YES | NULL | Outcome enabling payment |
| `failure_outcome` | VARCHAR(255) | YES | NULL | Rejection outcome |
| `bill_processor_action` | TEXT | YES | NULL | What bill processor does |
| `department_action` | TEXT | YES | NULL | What department does |
| `supplier_action_required` | TEXT | YES | NULL | What supplier must do |
| `day_0_comms` | TEXT | YES | NULL | Initial comms template |
| `day_3_comms` | TEXT | YES | NULL | Reminder template |
| `day_7_comms` | TEXT | YES | NULL | Final warning template |
| `day_10_comms` | TEXT | YES | NULL | Timeout template |
| `legacy_enum_mapping` | VARCHAR(50) | YES | NULL | Maps to BillOnHoldReasonsEnum |
| `is_active` | BOOLEAN | NO | TRUE | Soft disable without delete |
| `created_at` | TIMESTAMP | NO | CURRENT | Record creation |
| `updated_at` | TIMESTAMP | NO | CURRENT | Last modification |

**Indexes**:
```sql
UNIQUE INDEX idx_ohb_reasons_code (code)
INDEX idx_ohb_reasons_dept (department_owner, is_active)
INDEX idx_ohb_reasons_legacy (legacy_enum_mapping)
```

---

### 3. bill_reasons

Junction table linking bills to their diagnosed reasons. Supports multiple reasons per bill with individual state tracking.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | BIGINT UNSIGNED | NO | AUTO | Primary key |
| `bill_id` | BIGINT UNSIGNED | NO | - | FK to bills.id |
| `ohb_reason_id` | BIGINT UNSIGNED | NO | - | FK to ohb_reasons.id |
| `status` | VARCHAR(20) | NO | 'pending' | pending, in_progress, resolved, unresolved, awaiting |
| `diagnosed_at` | TIMESTAMP | NO | CURRENT | When reason flagged |
| `diagnosed_by_type` | VARCHAR(20) | NO | - | ai, bill_processor, department, system |
| `diagnosed_by_user_id` | BIGINT UNSIGNED | YES | NULL | FK to users.id (if human) |
| `resolved_at` | TIMESTAMP | YES | NULL | When resolved |
| `resolved_by_type` | VARCHAR(30) | YES | NULL | user, system, external_party |
| `resolved_by_user_id` | BIGINT UNSIGNED | YES | NULL | FK to users.id (if human) |
| `resolution_notes` | TEXT | YES | NULL | Notes on resolution |
| `included_in_communication` | BOOLEAN | NO | FALSE | Included after Can_Coexist filter |
| `task_id` | BIGINT UNSIGNED | YES | NULL | FK to tasks.id (created for this reason) |
| `created_at` | TIMESTAMP | NO | CURRENT | Record creation |
| `updated_at` | TIMESTAMP | NO | CURRENT | Last modification |
| `deleted_at` | TIMESTAMP | YES | NULL | Soft delete |

**Indexes**:
```sql
INDEX idx_bill_reasons_bill (bill_id, status)
INDEX idx_bill_reasons_bill_deleted (bill_id, deleted_at)
INDEX idx_bill_reasons_reason (ohb_reason_id)
INDEX idx_bill_reasons_task (task_id)
UNIQUE INDEX idx_bill_reasons_unique (bill_id, ohb_reason_id, deleted_at)
```

**Constraints**:
```sql
FOREIGN KEY (bill_id) REFERENCES bills(id) ON DELETE CASCADE
FOREIGN KEY (ohb_reason_id) REFERENCES ohb_reasons(id) ON DELETE RESTRICT
FOREIGN KEY (diagnosed_by_user_id) REFERENCES users(id) ON DELETE SET NULL
FOREIGN KEY (resolved_by_user_id) REFERENCES users(id) ON DELETE SET NULL
FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE SET NULL
```

---

### 4. ohb_communications

Audit trail for all external communications sent.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | BIGINT UNSIGNED | NO | AUTO | Primary key |
| `bill_id` | BIGINT UNSIGNED | NO | - | FK to bills.id |
| `stream` | VARCHAR(30) | NO | - | resolution_outreach, submitter_notification |
| `type` | VARCHAR(30) | NO | - | day_0, day_3, day_7, day_10, rejection, on_hold_notice |
| `recipients` | JSON | NO | - | ["supplier"], ["client", "coordinator"], etc. |
| `reason_ids` | JSON | NO | - | [1, 2, 3] - which reasons included |
| `payload` | JSON | NO | - | Full message content |
| `soft_warning_included` | BOOLEAN | NO | FALSE | Time-sensitive warning |
| `sent_at` | TIMESTAMP | NO | CURRENT | When sent |
| `sent_by_type` | VARCHAR(20) | NO | 'system' | system, user |
| `sent_by_user_id` | BIGINT UNSIGNED | YES | NULL | FK to users.id |
| `notification_id` | BIGINT UNSIGNED | YES | NULL | FK to notification_log_items.id |
| `created_at` | TIMESTAMP | NO | CURRENT | Record creation |

**Indexes**:
```sql
INDEX idx_ohb_comms_bill (bill_id, sent_at)
INDEX idx_ohb_comms_stream (stream, type)
```

---

### 5. ohb_revalidation_logs

Tracks temporal re-validation checks and results.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | BIGINT UNSIGNED | NO | AUTO | Primary key |
| `bill_id` | BIGINT UNSIGNED | NO | - | FK to bills.id |
| `triggered_by` | VARCHAR(30) | NO | - | pre_communication, post_resolution, post_timeout, resubmission |
| `checks_performed` | JSON | NO | - | ["funding_balance", "funding_period", ...] |
| `results` | JSON | NO | - | {"funding_balance": {"passed": false, "old": 5000, "new": 0}} |
| `new_reason_ids` | JSON | YES | NULL | Reason IDs added due to changed context |
| `performed_at` | TIMESTAMP | NO | CURRENT | When re-validation ran |
| `created_at` | TIMESTAMP | NO | CURRENT | Record creation |

**Indexes**:
```sql
INDEX idx_ohb_reval_bill (bill_id, performed_at)
```

---

## Entity-Relationship Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           EXISTING TABLES                                │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌──────────┐         ┌──────────┐         ┌──────────┐                 │
│  │  bills   │         │  users   │         │  tasks   │                 │
│  └────┬─────┘         └────┬─────┘         └────┬─────┘                 │
│       │                    │                    │                        │
└───────┼────────────────────┼────────────────────┼────────────────────────┘
        │                    │                    │
        │ 1:1                │                    │ 1:1
        ▼                    │                    │
┌───────────────────┐        │                    │
│  bill_ohb_states  │        │                    │
│  ───────────────  │        │                    │
│  bill_id (FK,UQ)  │        │                    │
│  ohb_status       │        │                    │
│  comms_type       │        │                    │
│  cadence_status   │        │                    │
│  outcome          │        │                    │
│  original_bill_id─┼────────┼───► bills (self)   │
└───────────────────┘        │                    │
        │                    │                    │
        │ 1:M                │                    │
        ▼                    │                    │
┌───────────────────┐        │                    │
│   bill_reasons    │        │                    │
│   ────────────    │◄───────┼────────────────────┘
│   bill_id (FK)    │        │        task_id (FK)
│   ohb_reason_id ──┼────┐   │
│   status          │    │   │
│   diagnosed_by ───┼────┼───┘ user_id (FK)
│   resolved_by ────┼────┼───► user_id (FK)
│   task_id (FK)    │    │
│   deleted_at      │    │
└───────────────────┘    │
                         │ M:1
                         ▼
               ┌───────────────────┐
               │    ohb_reasons    │
               │    ───────────    │
               │    code (UQ)      │
               │    name           │
               │    department     │
               │    touches_invoice│
               │    can_coexist    │
               │    comms templates│
               └───────────────────┘

┌───────────────────┐         ┌───────────────────────┐
│ ohb_communications│         │ ohb_revalidation_logs │
│ ──────────────────│         │ ─────────────────────│
│ bill_id (FK)      │         │ bill_id (FK)          │
│ stream            │         │ triggered_by          │
│ type              │         │ checks_performed      │
│ recipients        │         │ results               │
│ payload           │         │ new_reason_ids        │
└───────────────────┘         └───────────────────────┘
```

---

## Relationships

### One-to-One
| Parent | Child | FK Column | Notes |
|--------|-------|-----------|-------|
| bills | bill_ohb_states | bill_id | OHB state isolated from main bill |
| bill_reasons | tasks | task_id | Task created for department work |

### One-to-Many
| Parent | Child | FK Column | Notes |
|--------|-------|-----------|-------|
| bills | bill_reasons | bill_id | Multiple reasons per bill |
| bills | ohb_communications | bill_id | Multiple comms per bill |
| bills | ohb_revalidation_logs | bill_id | Multiple re-validations |
| ohb_reasons | bill_reasons | ohb_reason_id | Reason used on many bills |
| users | bill_reasons | diagnosed_by_user_id | Optional human actor |
| users | bill_reasons | resolved_by_user_id | Optional human resolver |

### Self-Reference
| Table | FK Column | Notes |
|-------|-----------|-------|
| bill_ohb_states | original_bill_id | Links resubmission to original bill |

---

## Data Integrity & Validation

### Business Rules

1. **Unique reason per bill**: A bill cannot have duplicate reasons (enforced by unique index on `bill_id, ohb_reason_id, deleted_at`)

2. **Status transitions**: `bill_reasons.status` must follow valid transitions:
   - `pending` → `in_progress` | `resolved` | `unresolved` | `awaiting`
   - `in_progress` → `resolved` | `unresolved` | `awaiting`
   - `awaiting` → `resolved` | `unresolved`
   - `resolved` / `unresolved` are terminal for that reason

3. **Comms type determination**: `bill_ohb_states.comms_type` set by batch decision logic after all reasons have status

4. **Cadence only for ON_HOLD**: `cadence_status` only populated when `comms_type = 'on_hold'`

### Constraints

- `ohb_reasons` cannot be deleted if referenced by `bill_reasons` (RESTRICT)
- `bill_reasons` soft-deleted, never hard-deleted (audit trail)
- `bill_ohb_states.outcome` immutable once set (application-level)

### Audit Trail

- `bill_reasons` - Full history via soft delete + status changes
- `ohb_communications` - Every external message logged
- `ohb_revalidation_logs` - Every re-validation check logged
- Existing `stage_histories` table captures bill stage transitions

---

## Scale & Performance

### Expected Volume

| Metric | Value | Notes |
|--------|-------|-------|
| Bills/day | 5,000 - 6,000 | ~150-180K/month |
| Reasons/bill | 1-5 (avg ~2) | Multi-issue tracking |
| bill_reasons rows/month | ~300-400K | Bills × avg reasons |
| Communications/bill | 1-4 | Day 0, 3, 7, 10 max |
| Revalidations/bill | 1-3 | Pre-comms, post-resolution |

### Data Retention

- `bill_reasons` - Retain indefinitely (soft delete)
- `ohb_communications` - Retain indefinitely (compliance)
- `ohb_revalidation_logs` - Consider archiving after 2 years

### Peak Load

- Bill submission batches (Email import, File import) can create 1000+ bills in minutes
- Cadence jobs run on schedule (Day 3, 7, 10 checks) - batch queries

---

## Query Patterns & Indexing

### Common Queries

| Query | Frequency | Index Used |
|-------|-----------|------------|
| Get all reasons for a bill | Very High | `idx_bill_reasons_bill` |
| Get pending reasons (not soft-deleted) | High | `idx_bill_reasons_bill_deleted` |
| Get bills by OHB status | Medium | `idx_bill_ohb_status` |
| Get bills at cadence day | Medium (scheduled) | `idx_bill_ohb_cadence` |
| Get resubmission chain | Low | `idx_bill_ohb_original` |
| Get communications for bill | Medium | `idx_ohb_comms_bill` |

### Optimization Strategy

1. **Primary access via Bill**: Most queries start with bill_id, indexes optimized for this
2. **Department routing via Tasks**: Not via direct `bill_reasons` queries
3. **Batch cadence queries**: Scheduled jobs query by `cadence_status` + `cadence_started_at`
4. **Consider read replica**: For reporting/analytics queries at this volume

---

## Security & Privacy

### Sensitive Data

| Table | Column | Sensitivity | Handling |
|-------|--------|-------------|----------|
| ohb_communications | payload | Medium | Contains message content, no PII in payload |
| ohb_communications | recipients | Low | Role-based, not email addresses |
| bill_reasons | resolution_notes | Low | May contain client context |

### Access Control

- OHB tables follow existing Bill permission model
- `ohb_reasons` readable by all bill processing roles
- `bill_reasons` writable by Bill Processors + Department roles
- `ohb_communications` read-only after creation (audit integrity)

### Compliance

- Soft delete maintains GDPR right-to-audit trail
- No PII stored in OHB-specific tables (PII in existing bills/users)
- Communication payload uses placeholders, not actual client data

---

## Implementation Notes

### Database

- MySQL 8.x (existing TC Portal database)
- JSON columns for flexible arrays (can_coexist_with, recipients, etc.)
- Use existing migration patterns from `database/migrations/`

### ORM

- Laravel Eloquent models
- Soft deletes via `SoftDeletes` trait on `BillReason`
- Casts for JSON columns and enums

### Migration Strategy

1. **New tables only** - No changes to existing `bills` table
2. **Seed `ohb_reasons`** - From master-list-schema-updated.csv
3. **Add `legacy_enum_mapping`** - Maps to existing `BillOnHoldReasonsEnum` for compatibility
4. **Feature flag** - OHB enabled per-environment during rollout

---

## Database Clarifications

### Session 2026-01-16

- Q: Should OHB fields be added to existing Bill model or separate table? -> A: Separate `BillOhbState` model with 1:1 relationship. Keeps OHB logic isolated, easier to feature-flag.
- Q: Should `reason_id` reference database table or enum? -> A: Database table (`ohb_reasons`). 36 reasons with 20+ attributes too complex for enum, allows runtime updates.
- Q: Should `bill_reasons` records be soft-deleted or hard-deleted? -> A: Soft delete. Audit trail critical per SC-008 requirement.
- Q: Expected bill volume? -> A: 5-6K bills/day (~150-180K/month). Need careful index optimization.
- Q: Primary query pattern for bill_reasons? -> A: Bill → Reasons (viewing bill). Department routing handled via Tasks system, not direct bill_reasons queries.

---

## Open Questions

1. **Task integration**: Exact relationship between `bill_reasons` and `tasks` - does task store `bill_reason_id` or vice versa?

2. **Legacy compatibility**: When OHB is active, should `bills.bill_on_hold_reason` still be populated (for legacy views)?

3. **Archiving strategy**: Define retention period for `ohb_revalidation_logs` and archival process.

---

## Approval

- [ ] Database schema approved by Tech Lead
- [ ] Index strategy approved by DBA/Performance
- [ ] Migration plan approved

---

**Next Steps**: `/trilogy.clarify-design` to define UI for bill diagnosis view and department task workflow.
