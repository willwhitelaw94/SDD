---
title: "Quickstart: On Hold Bills Flow (OHB)"
---


Get up to speed on OHB development in 5 minutes.

---

## What is OHB?

OHB (On Hold Bills Flow) enables **multi-issue tracking** for bills. Instead of identifying one problem at a time, OHB diagnoses ALL issues upfront and sends ONE consolidated communication to suppliers.

**Key Value**: Reduces resubmission cycles by 60-70%.

---

## Quick Links

| Document | Purpose |
|----------|---------|
| [spec.md](spec.md) | Functional requirements & user stories |
| [db-spec.md](db-spec.md) | Database schema & relationships |
| [design.md](design.md) | UI/UX decisions & component inventory |
| [plan.md](plan.md) | Implementation phases & tasks |
| [mockups/summary.md](mockups/summary.md) | ASCII wireframe recommendations |

---

## Core Concepts

### 1. Multi-Issue Diagnosis

When a bill enters review, OHB identifies ALL blocking reasons (not just the first one):

```
Bill Submitted → Diagnosis → [ABN Error, Calculation Error, Funding Pending]
```

### 2. Two Communication Streams

| Stream | Recipient | Purpose |
|--------|-----------|---------|
| **Resolution Outreach** | Client, Coordinator | Request action to resolve holds |
| **Submitter Notification** | Supplier | Inform of outcome/status |

Privacy: Suppliers never see client-specific details.

### 3. Three Communication Types

| Type | Trigger | Supplier Action |
|------|---------|-----------------|
| **REJECT-RESUBMIT** | Any reason touches invoice | Fix issues, resubmit |
| **REJECT PERIOD** | Permanent block (e.g., terminated) | Do not resubmit |
| **ON HOLD** | Contextual issues only | Wait, no action needed |

### 4. Traffic-Light Checklist

UI displays reasons grouped by status:

- 🔴 **BLOCKING** - Unresolved issues preventing approval
- 🟢 **COMPLETE** - Resolved issues
- 🟡 **WARNINGS** - Time-sensitive qualifiers

---

## Key Files

### Backend

```
app/
├── Models/
│   ├── Bill/
│   │   └── BillOhbState.php      # OHB state (1:1 with Bill)
│   ├── OhbReason.php             # Master reason list
│   └── BillReason.php            # Per-bill reason instances
├── Services/
│   ├── OhbDiagnosisService.php   # Multi-issue detection
│   ├── OhbRevalidationService.php # Temporal re-validation
│   └── OhbCommunicationService.php # Two-stream comms
├── Actions/
│   └── Bill/
│       └── OHB/
│           ├── DiagnoseBillAction.php
│           ├── AutoRejectBillAction.php
│           ├── RevalidateBillAction.php
│           └── DetermineCommsTypeAction.php
└── Jobs/
    └── Bill/
        └── OhbCadenceJob.php     # Day 0→3→7→10 reminders
```

### Frontend

```
resources/js/
├── Components/
│   └── Bill/
│       ├── BillChecklistPanel.vue   # Right panel checklist
│       ├── BillReasonItem.vue       # Single reason row
│       └── BillReasonModal.vue      # Focused reason view
├── Composables/
│   └── useBillReasons.js            # Polling + state
└── Pages/
    └── Bills/
        └── Edit.vue                 # Modified with OHB panel
```

### Database

```
database/migrations/
├── xxxx_create_bill_ohb_states_table.php
├── xxxx_create_ohb_reasons_table.php
├── xxxx_create_bill_reasons_table.php
├── xxxx_create_ohb_communications_table.php
└── xxxx_create_ohb_revalidation_logs_table.php
```

---

## Development Setup

### 1. Feature Flag

OHB uses Pennant. Enable for development:

```php
// config/pennant.php or via UI
Feature::define('ohb-enabled', fn () => true);
```

### 2. Seed Reasons

```bash
php artisan db:seed --class=OhbReasonsSeeder
```

### 3. Run Migrations

```bash
php artisan migrate
```

### 4. Test Diagnosis

```php
// In tinker
$bill = Bill::find(123);
$result = app(DiagnoseBillAction::class)->execute($bill);
// Returns array of detected BillReason records
```

---

## Testing

### Run OHB Tests Only

```bash
php artisan test --filter=OHB
```

### Key Test Files

```
tests/Feature/OHB/DiagnoseBillTest.php    # Diagnosis scenarios
tests/Feature/OHB/AutoRejectTest.php      # Auto-reject eligibility
tests/Feature/OHB/CommunicationTest.php   # Two-stream comms
tests/Browser/OHB/ChecklistPanelTest.php  # UI tests
```

---

## Common Tasks

### Add a New Reason

1. Add row to `ohb_reasons` table (or update seeder)
2. Create validator in `app/Validators/OHB/`
3. Register validator in `OhbDiagnosisService`
4. Add tests

### Modify Communication Templates

1. Update `day_0_comms`, `day_3_comms`, etc. in `ohb_reasons` table
2. Templates use placeholders: `{supplier_name}`, `{issues_list}`, etc.

### Add Time-Sensitive Qualifier

1. Add check to `OhbRevalidationService`
2. Update `revalidation_checks` JSON for affected reasons
3. Add tests for context decay scenario

---

## Debugging

### Check OHB State

```php
$bill = Bill::find(123);
$ohbState = $bill->ohbState;
$reasons = $bill->billReasons()->with('ohbReason')->get();

// See status of each reason
$reasons->each(fn($r) => dump($r->ohbReason->name, $r->status));
```

### Check Communication History

```php
$comms = OhbCommunication::where('bill_id', 123)->get();
$comms->each(fn($c) => dump($c->stream, $c->type, $c->sent_at));
```

### Check Revalidation Logs

```php
$logs = OhbRevalidationLog::where('bill_id', 123)->get();
$logs->each(fn($l) => dump($l->triggered_by, $l->results));
```

---

## Architecture Decisions

| Decision | Rationale |
|----------|-----------|
| Separate `bill_ohb_states` table | Isolates OHB from core Bill model, easy to feature-flag |
| Database table for reasons (not enum) | 36 reasons with 20+ attributes too complex for enum |
| Soft delete on `bill_reasons` | Audit trail required per SC-008 |
| Tasks for department routing | Leverage existing Tasks system, no new queue |
| Polling (not WebSocket) | Simpler, 30-60s refresh sufficient for workflow |

---

## Need Help?

- **Spec questions**: Check [spec.md](spec.md) clarifications section
- **DB questions**: Check [db-spec.md](db-spec.md) open questions
- **UI questions**: Check [design.md](design.md) open questions
- **Context**: Read [CONTEXT-MEMO.md](context/raw_context/CONTEXT-MEMO.md) for full history
