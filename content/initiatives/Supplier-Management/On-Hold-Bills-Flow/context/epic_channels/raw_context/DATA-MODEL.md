# Data Model - On Hold Bills Flow

**Epic**: TP-3787 | **Initiative**: TP-1857 Supplier Management | **Code**: OHB
**Date Created**: 2026-01-13
**Last Updated**: 2026-01-13
**Status**: Draft - Pending Stakeholder Review

---

## Overview

This document defines all data objects, their fields, types, and possible values for the On Hold Bills Flow system. The model supports:
- Multi-issue bill tracking (36 on-hold reasons)
- Two communication streams (Resolution Outreach + Submitter Notification)
- 1-day Resolution Window for client/coordinator actions
- Temporal re-validation of time-sensitive qualifiers
- Day 0→3→7→10 cadence tracking

---

## 1. Bill Object

The primary submission entity representing an invoice submitted for payment.

| Field | Type | Possible Values | Description |
|-------|------|-----------------|-------------|
| `id` | UUID | Auto-generated | Primary key |
| `supplier_id` | UUID/FK | Reference to Supplier | The supplier who submitted |
| `client_id` | UUID/FK | Reference to Client | The client being billed for |
| `invoice_number` | String | Supplier's reference | External invoice identifier |
| `invoice_amount` | Decimal | Positive number | Total amount claimed |
| `submission_date` | DateTime | Timestamp | When bill was submitted |
| `status` | Enum | See Status enum below | Current workflow state |
| `comms_type` | Enum | `null`, `REJECT-RESUBMIT`, `REJECT PERIOD`, `ON HOLD` | Determined communication type |
| `cadence_status` | Enum | `null`, `Day 0`, `Day 3`, `Day 7`, `Day 10`, `Resolved` | Current cadence stage (ON HOLD path only) |
| `cadence_started_at` | DateTime | Timestamp or `null` | When Day 0 communication was sent |
| `resolution_window_status` | Enum | `null`, `Active`, `Resolved`, `Expired` | Status of 1-day grace period |
| `resolution_window_started_at` | DateTime | Timestamp or `null` | When Resolution Outreach was sent |
| `communication_stream` | Enum | `null`, `Resolution Outreach`, `Submitter Notification`, `Both` | Which stream(s) active |
| `limited_time_soft_warning` | Boolean | `true`, `false` | Time-sensitive qualifier warning included |
| `auto_reject_eligible` | Boolean | `true`, `false` | Can be instantly rejected by AI |
| `original_bill_id` | UUID/FK or `null` | Reference to Bill | Links resubmission to original (null if original) |
| `resubmission_count` | Integer | 0, 1, 2, ... | Convenience counter (0 for original) |
| `outcome` | Enum | `null`, `PAID`, `REJECTED FINAL`, `REJECTED RESUBMIT` | Terminal state |
| `outcome_date` | DateTime | Timestamp or `null` | When final outcome reached |
| `created_at` | DateTime | Timestamp | Record creation |
| `updated_at` | DateTime | Timestamp | Last modification |

### Status Enum Values

| Value | Description |
|-------|-------------|
| `Received` | Initial state when bill first submitted |
| `In Diagnosis` | Multi-issue diagnosis in progress |
| `Routing to Departments` | Being routed to Care/Compliance/Accounts |
| `Awaiting Department Work` | Waiting for internal departments |
| `In Temporal Revalidation` | Re-checking time-sensitive qualifiers |
| `Awaiting Communication` | Communication being drafted |
| `On Hold` | Communication sent, waiting for external party |
| `Awaiting Resubmission` | Rejected, waiting for supplier to resubmit |
| `Paid` | Final: payment processed |
| `Rejected Final` | Final: permanently rejected |

---

## 2. Bill Reason Object

Junction table linking a Bill to its diagnosed Reasons (many-to-many with state).

| Field | Type | Possible Values | Description |
|-------|------|-----------------|-------------|
| `id` | UUID | Auto-generated | Primary key |
| `bill_id` | UUID/FK | Reference to Bill | Parent bill |
| `reason_id` | UUID/FK | Reference to Reason | Master list reason |
| `status` | Enum | `Pending`, `In Progress`, `Resolved`, `Unresolved`, `Awaiting` | Current state of this reason |
| `diagnosed_at` | DateTime | Timestamp | When reason was flagged |
| `diagnosed_by` | Enum | `AI`, `Bill Processor`, `Department` | Who/what flagged it |
| `resolved_at` | DateTime | Timestamp or `null` | When resolved (if applicable) |
| `resolved_by` | String or `null` | User ID, `System`, `External Party` | Who resolved it |
| `resolution_notes` | Text | Free text or `null` | Notes on how resolved |
| `requires_internal_action` | Boolean | `true`, `false` | Department work needed before outcome known |
| `requires_resolution_outreach` | Boolean | `true`, `false` | Client/coordinator action needed (triggers Resolution Outreach) |
| `department_owner` | Enum | `Care`, `Compliance`, `Accounts`, `Auto` | Which department owns this reason |
| `included_in_communication` | Boolean | `true`, `false` | Was included in external comms (after Can_Coexist_With filter) |
| `created_at` | DateTime | Timestamp | Record creation |
| `updated_at` | DateTime | Timestamp | Last modification |

### Bill Reason Status Enum Values

| Value | Description |
|-------|-------------|
| `Pending` | Reason flagged, not yet worked |
| `In Progress` | Department currently investigating |
| `Resolved` | Issue has been fixed/approved |
| `Unresolved` | Issue still exists, cannot be resolved internally |
| `Awaiting` | Waiting for external party to act |

---

## 3. Reason Object (Master List)

Static reference data defining all possible on-hold reasons. Populated from `master-list-schema-updated.csv`.

| Field | Type | Possible Values | Description |
|-------|------|-----------------|-------------|
| `id` | UUID | Auto-generated | Primary key |
| `name` | String | 36 reason names | Unique identifier (e.g., "ABN/GST error") |
| `description` | Text | Free text | Full description of the reason |
| `department_owner` | Enum | `Care`, `Compliance`, `Accounts` | Default owning department |
| `touches_invoice` | Boolean | `true`, `false` | Requires invoice changes (must resubmit) |
| `auto_reject_eligible` | Boolean | `true`, `false` | AI can detect with 99% accuracy |
| `has_timeout` | Boolean | `true`, `false` | Has Day 10 timeout |
| `cadence_days` | Integer | `0`, `10`, `null` | Days before timeout |
| `requires_revalidation` | Boolean | `true`, `false` | Time-sensitive qualifiers must be re-checked |
| `revalidation_checks` | Array/JSON | `["funding_balance", "funding_period", ...]` or `null` | Which qualifiers to re-check |
| `requires_resolution_outreach` | Boolean | `true`, `false` | Client/coordinator action needed (NEW) |
| `can_coexist_with` | Array/JSON | `["All"]`, `["None"]`, `["All except X"]`, `[list]` | Communication grouping rules |
| `possible_outcomes` | Text | Comma-separated list | All resolution states |
| `success_outcome` | Text | Description | Outcome that enables payment |
| `failure_outcome` | Text | Description | Rejection state |
| `bill_processor_action` | Text | Description | What bill processor does |
| `department_action` | Text or `null` | Description | What department does |
| `supplier_action_required` | Text or `null` | Description | What supplier must do |
| `key_principles` | Text | Free text | Guiding principles |
| `day_0_comms` | Text | Template text | Initial communication template |
| `day_3_comms` | Text | Template text | Reminder template |
| `day_7_comms` | Text | Template text | Final warning template |
| `day_10_comms` | Text | Template text | Timeout template |
| `examples` | Text | Free text | Real-world examples |
| `notes` | Text | Free text | Edge cases, special handling |

### Department Owner Enum Values

| Value | Count | Description |
|-------|-------|-------------|
| `Compliance` | 16 | Compliance-related issues |
| `Care` | 14 | Care team issues |
| `Accounts` | 6 | Finance/banking issues |

---

## 4. Communication Object

Audit trail for all external communications sent.

| Field | Type | Possible Values | Description |
|-------|------|-----------------|-------------|
| `id` | UUID | Auto-generated | Primary key |
| `bill_id` | UUID/FK | Reference to Bill | Parent bill |
| `stream` | Enum | `Resolution Outreach`, `Submitter Notification` | Which communication stream |
| `type` | Enum | `Day 0`, `Day 3`, `Day 7`, `Day 10`, `Resolution Request`, `Resolution Expired`, `Rejection`, `On Hold Notice` | Communication type |
| `recipients` | Array/JSON | `["Supplier"]`, `["Client", "Coordinator"]`, etc. | Who received |
| `reasons_included` | Array/JSON | List of reason IDs | Which reasons were in the message |
| `payload` | JSON | Full message content | Structured communication payload |
| `soft_warning_included` | Boolean | `true`, `false` | Time-sensitive warning included |
| `sent_at` | DateTime | Timestamp | When sent |
| `sent_by` | String | `System`, User ID | Who triggered |
| `created_at` | DateTime | Timestamp | Record creation |

### Communication Stream Enum Values

| Value | Recipient | Timing | Purpose |
|-------|-----------|--------|---------|
| `Resolution Outreach` | Client/Coordinator | During department work | Request action to resolve |
| `Submitter Notification` | Supplier | After COMMS TYPE determined | Inform of outcome/hold |

### Communication Type Enum Values

| Value | Stream | Description |
|-------|--------|-------------|
| `Day 0` | Both | Initial communication |
| `Day 3` | Both | Reminder |
| `Day 7` | Both | Final warning |
| `Day 10` | Both | Timeout reached |
| `Resolution Request` | Resolution Outreach | Request for client/coordinator action |
| `Resolution Expired` | Submitter Notification | "Other processes required" message |
| `Rejection` | Submitter Notification | REJECT-RESUBMIT or REJECT PERIOD |
| `On Hold Notice` | Submitter Notification | ON HOLD notification |

---

## 5. Revalidation Log Object

Tracks temporal re-validation checks and their results.

| Field | Type | Possible Values | Description |
|-------|------|-----------------|-------------|
| `id` | UUID | Auto-generated | Primary key |
| `bill_id` | UUID/FK | Reference to Bill | Parent bill |
| `triggered_by` | Enum | `Pre-Communication`, `Post-Resolution`, `Post-Timeout`, `Resubmission` | What triggered re-validation |
| `checks_performed` | Array/JSON | `["funding_balance", "funding_period", ...]` | Which qualifiers checked |
| `results` | JSON | `{"funding_balance": {"passed": false, "new_value": 0}}` | Check results |
| `new_reasons_added` | Array/JSON | List of reason IDs or empty | Reasons added due to changed context |
| `performed_at` | DateTime | Timestamp | When re-validation occurred |
| `created_at` | DateTime | Timestamp | Record creation |

### Triggered By Enum Values

| Value | Description |
|-------|-------------|
| `Pre-Communication` | Before drafting external communication |
| `Post-Resolution` | After ON HOLD resolved by external party |
| `Post-Timeout` | After Day 10 timeout reached |
| `Resubmission` | When processing a resubmitted bill |

---

## 6. Enum Value Summary

### COMMS TYPE

| Value | Condition | Supplier Action |
|-------|-----------|-----------------|
| `REJECT-RESUBMIT` | Any unresolved reason touches invoice | Fix and resubmit |
| `REJECT PERIOD` | Permanent blocker (e.g., terminated supplier) | Do not resubmit |
| `ON HOLD` | All reasons are contextual | Wait for resolution |

### Resolution Window Status

| Value | Description |
|-------|-------------|
| `null` | No reasons require Resolution Outreach |
| `Active` | Within 1-day window, awaiting resolution |
| `Resolved` | Issue resolved within window (supplier never notified) |
| `Expired` | Window expired, supplier gets "other processes required" |

### Outcome

| Value | Description |
|-------|-------------|
| `PAID` | Bill successfully processed and payment initiated |
| `REJECTED FINAL` | Bill permanently rejected (no further action possible) |
| `REJECTED RESUBMIT` | Bill rejected, supplier may resubmit corrected version |

---

## 7. Relationships Diagram

```
Bill (1) ──────< Bill Reason (M) >────── Reason Master (1)
  │                    │
  │                    └── status, resolved_by, etc.
  │
  ├──< Communication (M)
  │       └── stream, type, recipients, payload
  │
  ├──< Revalidation Log (M)
  │       └── checks_performed, results, new_reasons_added
  │
  └── original_bill_id ──> Bill (self-reference for resubmissions)
```

---

## 8. Open Questions for Stakeholder Review

### 8.1 Denormalization Strategy

**Question**: Should we denormalize `department_owner`, `touches_invoice`, `auto_reject_eligible` from Reason master list onto Bill Reason?

**Pros**: Faster queries, simpler joins
**Cons**: Data duplication, sync risk if master list changes

**Recommendation**: Denormalize for query efficiency. These fields rarely change on the master list.

---

### 8.2 Actioner Granularity

**Question**: Should `diagnosed_by` and `resolved_by` store:
- Enum only (`AI`, `Bill Processor`, `Department`)
- Specific user ID
- Both (enum + optional user ID)

**Recommendation**: Both - enum for categorization, optional user ID for audit trail.

---

### 8.3 Communication Object Necessity

**Question**: Do we need a separate Communication object, or is logging in Bill sufficient?

**Pros of separate object**: Full audit trail, supports multiple communications per bill, easier reporting
**Cons**: Additional complexity, more tables

**Recommendation**: Keep Communication object for audit compliance and reporting needs.

---

### 8.4 Revalidation Log Necessity

**Question**: Do we need a separate Revalidation Log, or can results be stored on Bill?

**Pros of separate object**: Track multiple re-validations, understand what changed when
**Cons**: Additional complexity

**Recommendation**: Keep Revalidation Log - critical for understanding why new reasons were added mid-workflow.

---

### 8.5 Bill Linking Strategy

**Question**: For resubmissions, should we use:
- `original_bill_id` (always points to the first submission)
- `previous_bill_id` (chain linking, each points to immediate predecessor)

**Recommendation**: Use `original_bill_id` with `resubmission_count` counter. Simpler querying, clearer relationships.

---

### 8.6 Requires Resolution Outreach Classification

**Question**: Need to classify all 36 reasons for the new `Requires_Resolution_Outreach` field.

**Criteria**:
- `TRUE`: Client or coordinator must take action (approvals, confirmations, voluntary contributions)
- `FALSE`: Pure internal work or supplier-facing issue only

**Status**: Pending - see SCHEMA-MIGRATION-NOTES.md for details.

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 0.1 | 2026-01-13 | Claude | Initial draft with all objects and open questions |

---

## Related Documents

- [WORKFLOW-PARAMETERS.md](./WORKFLOW-PARAMETERS.md) - All workflow parameters and enums
- [DESIGN-DECISIONS.md](./DESIGN-DECISIONS.md) - Architecture decisions and rationale
- [SCHEMA-MIGRATION-NOTES.md](./SCHEMA-MIGRATION-NOTES.md) - Master list migration notes
- [CONTEXT-MEMO.md](./CONTEXT-MEMO.md) - Business context and terminology
- [master-list-schema-updated.csv](./master-list-schema-updated.csv) - 36 reasons with 24 columns
