---
title: "Data Model: Care Partner Check-Ins"
---

# Data Model: Care Partner Check-Ins

**Spec**: [spec.md](spec.md) | **Plan**: [plan.md](plan.md)

---

## Entity Relationship Diagram

```
┌─────────────────────┐       ┌─────────────────────┐
│   PackagesClient    │       │       Package        │
│   (existing)        │       │     (existing)       │
└────────┬────────────┘       └────────┬─────────────┘
         │ 1                           │ 1
         │                             │
         │ *                           │ *
┌────────┴────────────────────────────┴─────────────┐
│                    CheckIn                         │
│                                                    │
│  id, client_id, package_id, assigned_user_id,      │
│  type, status, due_date, completed_at,             │
│  wellbeing_rating, summary_notes, follow_up_actions│
│  previous_summary, is_flagged                      │
└──────┬───────────────────────────┬────────────────┘
       │ 1                         │ 1
       │                           │
       │ *                         │ *
┌──────┴──────────┐     ┌─────────┴──────────────┐
│ CheckInAttempt  │     │   CheckInResponse       │
│                 │     │                          │
│ id, check_in_id │     │ id, check_in_id,         │
│ reason, notes   │     │ risk_check_in_question_id│
│ attempted_at    │     │ risk_id, response_value  │
└─────────────────┘     └─────────┬───────────────┘
                                  │ *
                                  │
                                  │ 1
                        ┌─────────┴───────────────┐
                        │  RiskCheckInQuestion     │
                        │                          │
                        │  id, risk_id,            │
                        │  question_text,          │
                        │  answer_type,            │
                        │  answer_options           │
                        └─────────┬───────────────┘
                                  │ *
                                  │
                                  │ 1
                        ┌─────────┴───────────────┐
                        │        Risk              │
                        │      (existing)          │
                        └─────────────────────────┘


┌─────────────────────────┐
│  ClientCadenceSetting   │
│                         │
│  id, client_id (unique) │
│  cadence_months, set_by │
└─────────────────────────┘
```

## Entities

### CheckIn

| Field | Type | Nullable | Default | Description |
|-------|------|----------|---------|-------------|
| id | bigIncrements | No | auto | Primary key |
| client_id | foreignId | No | — | References `packages_clients.id` |
| package_id | foreignId | No | — | Primary package. References `packages.id` |
| assigned_user_id | foreignId | Yes | NULL | Care partner or coordinator. References `users.id` |
| type | string(20) | No | — | `internal`, `external`, `ad_hoc` |
| status | string(20) | No | `pending` | `pending`, `in_progress`, `completed`, `missed`, `cancelled` |
| due_date | date | No | — | When the check-in should be completed |
| completed_at | datetime | Yes | NULL | Set when status transitions to completed |
| completed_by_id | foreignId | Yes | NULL | User who submitted the form |
| wellbeing_rating | unsignedTinyInteger | Yes | NULL | 1=Poor, 2=Fair, 3=Good, 4=Very Good, 5=Excellent |
| summary_notes | text | Yes | NULL | Free-text call summary |
| follow_up_actions | text | Yes | NULL | Free-text follow-up actions |
| previous_summary | text | Yes | NULL | Snapshot of the prior check-in's summary notes at generation time |
| cancellation_reason | string(255) | Yes | NULL | Mandatory when status = cancelled |
| cancelled_at | datetime | Yes | NULL | When cancellation occurred |
| cancelled_by_id | foreignId | Yes | NULL | User who cancelled |
| is_flagged | boolean | No | false | Set true when attempts >= 3 |
| created_at | timestamp | No | auto | |
| updated_at | timestamp | No | auto | |

**Indexes:**
- `check_ins_assigned_user_id_status_due_date_index` — composite for dashboard queries
- `check_ins_client_id_index` — for client profile lookups
- `check_ins_status_due_date_index` — for cron job (missed detection)

### CheckInAttempt

| Field | Type | Nullable | Default | Description |
|-------|------|----------|---------|-------------|
| id | bigIncrements | No | auto | |
| check_in_id | foreignId | No | — | References `check_ins.id`, cascade delete |
| user_id | foreignId | No | — | Who logged the attempt |
| reason | string(50) | No | — | `no_answer`, `client_unavailable`, `wrong_number`, `client_declined`, `other` |
| notes | text | Yes | NULL | Optional context about the attempt |
| attempted_at | datetime | No | — | When the attempt was made |
| created_at | timestamp | No | auto | |
| updated_at | timestamp | No | auto | |

### RiskCheckInQuestion

| Field | Type | Nullable | Default | Description |
|-------|------|----------|---------|-------------|
| id | bigIncrements | No | auto | |
| risk_id | foreignId | No | — | References `risks.id`, cascade delete |
| question_text | text | No | — | The question for care partners to answer |
| answer_type | string(30) | No | — | `free_text`, `yes_no`, `multiple_choice`, `rating_1_5` |
| answer_options | json | Yes | NULL | Array of strings for multiple_choice type |
| created_by_id | foreignId | No | — | Clinical user who created the question |
| sort_order | unsignedSmallInteger | No | 0 | Display ordering within a risk |
| created_at | timestamp | No | auto | |
| updated_at | timestamp | No | auto | |

### CheckInResponse

| Field | Type | Nullable | Default | Description |
|-------|------|----------|---------|-------------|
| id | bigIncrements | No | auto | |
| check_in_id | foreignId | No | — | References `check_ins.id`, cascade delete |
| risk_check_in_question_id | foreignId | No | — | References `risk_check_in_questions.id`, cascade delete |
| risk_id | foreignId | No | — | Denormalized from question for query efficiency |
| response_value | text | No | — | The answer (text, yes/no, selected option, or 1-5) |
| responded_by_id | foreignId | No | — | User who provided the response |
| responded_at | datetime | No | — | When the response was given |
| created_at | timestamp | No | auto | |
| updated_at | timestamp | No | auto | |

**Indexes:**
- `check_in_responses_risk_id_index` — for clinical team's risk-grouped response review

### ClientCadenceSetting

| Field | Type | Nullable | Default | Description |
|-------|------|----------|---------|-------------|
| id | bigIncrements | No | auto | |
| client_id | foreignId | No | — | References `packages_clients.id`, unique constraint |
| cadence_months | unsignedTinyInteger | No | — | Override value: 1, 2, 3, 6, or 12 months |
| set_by_id | foreignId | No | — | User who configured the override |
| effective_date | date | No | — | When this cadence takes effect |
| created_at | timestamp | No | auto | |
| updated_at | timestamp | No | auto | |

## State Transitions

### CheckIn Status Lifecycle

```
          ┌──────────────────────────────────────────────────────┐
          │                                                      │
          ▼                                                      │
    ┌──────────┐     ┌─────────────┐     ┌─────────────┐        │
    │ PENDING  │────▶│ IN_PROGRESS │────▶│  COMPLETED  │        │
    └──────────┘     └─────────────┘     └─────────────┘        │
          │                │                                     │
          │                │ (navigate away = back to pending)   │
          │                └─────────────────────────────────────┘
          │
          ├──── (30 days overdue, auto) ──▶ ┌──────────┐
          │                                 │  MISSED   │
          │                                 └──────────┘
          │
          └──── (user cancels + reason) ──▶ ┌───────────┐
                                            │ CANCELLED │
                                            └───────────┘
```

### Transition Rules

| From | To | Trigger | Constraints |
|------|----|---------|-------------|
| — | Pending | Auto-generated by cron OR ad-hoc creation | No duplicate pending for same client+type |
| Pending | In Progress | User opens check-in form | Only assigned user or staff with access |
| In Progress | Pending | User navigates away | Draft state preserved |
| In Progress | Completed | User submits completion form | Required: summary_notes, wellbeing_rating |
| Pending | Missed | Cron job (30+ days past due_date) | Generates replacement check-in |
| Pending | Cancelled | User cancels | Required: cancellation_reason |

## Validation Rules

### CompleteCheckInData
- `summary_notes`: required, string, max 10,000 chars
- `wellbeing_rating`: required, integer, 1-5
- `follow_up_actions`: nullable, string, max 5,000 chars
- `responses[]`: array of `{ risk_check_in_question_id: int, response_value: string }`

### LogAttemptData
- `reason`: required, string, one of: no_answer, client_unavailable, wrong_number, client_declined, other
- `notes`: nullable, string, max 2,000 chars

### CancelCheckInData
- `cancellation_reason`: required, string, max 255 chars

### StoreRiskCheckInQuestionData
- `question_text`: required, string, max 2,000 chars
- `answer_type`: required, string, one of: free_text, yes_no, multiple_choice, rating_1_5
- `answer_options`: required when answer_type = multiple_choice, array of strings (2-10 items)
