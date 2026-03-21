---
title: "Data Model: Clinical Pathways / Cases"
---

# Data Model: Clinical Pathways / Cases

**Plan**: [plan.md](plan.md) | **Spec**: [spec.md](spec.md)

---

## Entity Relationship Diagram

```
┌─────────────┐       ┌──────────────────┐       ┌────────────────────────┐
│   Package   │──1:M──│  ClinicalCase    │──1:M──│  ClinicalCaseReview    │
│             │       │                  │       │                        │
│ id          │       │ id               │       │ id                     │
│ ...         │       │ uuid             │       │ uuid                   │
└─────────────┘       │ package_id (FK)  │       │ clinical_case_id (FK)  │
                      │ case_type        │       │ outcome                │
                      │ status           │       │ clinical_notes         │
                      │ clinical_concern │       │ previous_status        │
                      │ review_interval  │       │ previous_interval      │
                      │ next_review_at   │       │ reviewed_by (FK→User)  │
                      │ trigger_source   │       │ reviewed_at            │
                      │ trigger_incident │       └────────────────────────┘
                      │ assigned_to (FK) │
                      │ closure_reason   │
                      │ created_by (FK)  │
                      └────────┬─────┬───┘
                               │     │
                    ┌──────────┘     └──────────┐
                    │ M:M                  M:M  │
                    ▼                           ▼
           ┌──────────────┐          ┌──────────────────────────┐
           │    Risk      │          │  clinical_case_incidents  │
           │  (existing)  │          │       (pivot)             │
           │              │          │                           │
           │ via riskables│          │ clinical_case_id (FK)     │
           │ polymorphic  │          │ incident_id (FK)          │
           └──────────────┘          └──────────────────────────┘
                                                │
                                                │ FK
                                                ▼
                                     ┌──────────────────┐
                                     │    Incident       │
                                     │   (existing)      │
                                     └──────────────────┘
```

---

## Tables

### `clinical_cases`

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| id | bigint unsigned | NO | auto | PK |
| uuid | char(36) | NO | — | Unique, external reference |
| package_id | bigint unsigned | NO | — | FK → packages.id |
| case_type | varchar(20) | NO | — | Enum: mandatory, recommended, self_service |
| status | varchar(20) | NO | active | Enum: active, closed, escalated |
| clinical_concern | text | NO | — | Description of the clinical concern |
| review_interval_days | smallint unsigned | YES | — | Null for self_service. 7/14/30/90/custom |
| next_review_at | date | YES | — | Null for self_service. Calculated: created_at + interval |
| trigger_source | varchar(30) | YES | — | Enum: incident, assessment, clinical_judgement |
| trigger_incident_id | bigint unsigned | YES | — | FK → incidents.id. Primary triggering incident |
| assigned_to | bigint unsigned | NO | — | FK → users.id. Defaults to creator |
| closure_reason | text | YES | — | Required when closing. Clinical justification for mandatory |
| closed_at | timestamp | YES | — | Set when status → closed |
| escalated_at | timestamp | YES | — | Set when status → escalated |
| created_by | bigint unsigned | NO | — | FK → users.id |
| updated_by | bigint unsigned | YES | — | FK → users.id |
| created_at | timestamp | NO | — | Laravel timestamp |
| updated_at | timestamp | NO | — | Laravel timestamp |
| deleted_at | timestamp | YES | — | Soft deletes |

**Indexes:**
- `UNIQUE (uuid)`
- `INDEX (package_id, status)` — case list filtered by status
- `INDEX (assigned_to, next_review_at)` — overdue queries by assignee
- `INDEX (status, next_review_at)` — reporting: overdue across all packages

### `clinical_case_reviews`

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| id | bigint unsigned | NO | auto | PK |
| uuid | char(36) | NO | — | Unique |
| clinical_case_id | bigint unsigned | NO | — | FK → clinical_cases.id |
| outcome | varchar(20) | NO | — | Enum: continue, close, escalate |
| clinical_notes | text | NO | — | Review notes |
| previous_status | varchar(20) | NO | — | Status before this review (for audit) |
| previous_review_interval_days | smallint unsigned | YES | — | Interval before review (for audit) |
| reviewed_by | bigint unsigned | NO | — | FK → users.id |
| reviewed_at | timestamp | NO | — | When the review was completed |
| created_at | timestamp | NO | — | |
| updated_at | timestamp | NO | — | |

**Indexes:**
- `UNIQUE (uuid)`
- `INDEX (clinical_case_id, reviewed_at)` — review history ordered

### `clinical_case_incidents` (pivot)

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| id | bigint unsigned | NO | auto | PK |
| clinical_case_id | bigint unsigned | NO | — | FK → clinical_cases.id |
| incident_id | bigint unsigned | NO | — | FK → incidents.id |
| created_at | timestamp | NO | — | When linked |

**Indexes:**
- `UNIQUE (clinical_case_id, incident_id)` — prevent duplicate links
- `INDEX (incident_id)` — reverse lookup: which cases reference this incident

### `riskables` (existing — no migration)

Used for ClinicalCase ↔ Risk many-to-many via:
- `riskable_type` = `Domain\ClinicalCase\Models\ClinicalCase`
- `riskable_id` = `clinical_cases.id`
- `risk_id` = `risks.id`

---

## Enums

### CaseTypeEnum

| Case | Value | Display | Description |
|------|-------|---------|-------------|
| MANDATORY | mandatory | Mandatory | Duty of care — cannot be declined or closed without clinical justification |
| RECOMMENDED | recommended | Recommended | Standard clinical follow-up with prescribed review cycle |
| SELF_SERVICE | self_service | Self-Service | Low risk, informational — no review schedule required |

### CaseStatusEnum

| Case | Value | Display | Transitions From | Transitions To |
|------|-------|---------|-----------------|----------------|
| ACTIVE | active | Active | (initial), Escalated | Closed, Escalated |
| CLOSED | closed | Closed | Active | (terminal) |
| ESCALATED | escalated | Escalated | Active | Active |

### ReviewOutcomeEnum

| Case | Value | Effect |
|------|-------|--------|
| CONTINUE | continue | Advances next_review_at by interval. If Escalated → Active |
| CLOSE | close | Status → Closed. Sets closed_at. Requires closure_reason. Mandatory cases require clinical justification |
| ESCALATE | escalate | Status → Escalated. Type → Mandatory. Interval → 7 days. Sets escalated_at |

### ReviewIntervalEnum

| Case | Value (days) | Display |
|------|-------------|---------|
| WEEKLY | 7 | Weekly |
| FORTNIGHTLY | 14 | Fortnightly |
| MONTHLY | 30 | Monthly |
| QUARTERLY | 90 | Quarterly |
| CUSTOM | (user-defined) | Custom |

### TriggerSourceEnum

| Case | Value | Display |
|------|-------|---------|
| INCIDENT | incident | Incident |
| ASSESSMENT | assessment | Assessment |
| CLINICAL_JUDGEMENT | clinical_judgement | Clinical Judgement |

---

## Validation Rules

### StoreClinicalCaseData

| Field | Rules |
|-------|-------|
| case_type | required, in:mandatory,recommended,self_service |
| clinical_concern | required, string, max:5000 |
| review_interval_days | required_unless:case_type,self_service; nullable; integer; min:1; max:365 |
| trigger_source | nullable, in:incident,assessment,clinical_judgement |
| trigger_incident_id | nullable, exists:incidents,id; required_if:trigger_source,incident |
| assigned_to | required, exists:users,id |
| risk_ids | nullable, array |
| risk_ids.* | exists:risks,id |
| incident_ids | nullable, array |
| incident_ids.* | exists:incidents,id |

### StoreClinicalCaseReviewData

| Field | Rules |
|-------|-------|
| outcome | required, in:continue,close,escalate |
| clinical_notes | required, string, max:5000 |
| closure_reason | required_if:outcome,close; nullable; string; max:5000 |

**Conditional**: When case_type is `mandatory` and outcome is `close`, `closure_reason` is required and must contain clinical justification (minimum 20 characters).
