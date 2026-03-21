---
title: "Context: Collections Module V1 (TP-2329-COL)"
---


## Session Notes

### 2025-12-23 - Idea Brief Creation
- **Topic**: Initial idea brief creation for Collections V1
- **Decision**: Proceed with read-only invoice display from MyOB
- **Rationale**: Minimum viable feature needed for Support at Home launch (November 2025)

### 2025-12-23 - Specification Generated
- **Topic**: Generated full spec.md for Collections Module
- **Decision**: Combined Phase 1 (AR Invoice Visibility) and Phase 2 (DD Enrollment) into single epic
- **Key Design Decisions**:
  - Phase 1 (P1 priority): Invoice viewing for recipients, coordinators, finance
  - Phase 2 (P2 priority): Direct Debit enrollment with Australian compliance
  - MyOB sync starts as manual trigger, can be automated later
  - DD cancellation out of scope (contact finance workflow)
- **Assumptions Made**:
  - HCP-Contribution category identifies contribution invoices in MyOB
  - VIEW_FINANCIALS permission controls Collections access
  - BSB validation uses 6-digit Australian format
- **Artifacts Created**:
  - spec.md (5 user stories, 16 functional requirements)
  - checklists/requirements.md (validation passed)

### 2025-12-23 - UI Mockups Created
- **Topic**: Package View and DD Enrollment mockups
- **Key UI Decisions**:
  - **4 Summary Cards**: New → Overdue → Current → Paid (invoice lifecycle)
  - **7-day payment terms**: Within 7 days = "New", past 7 days = "Overdue"
  - **Current card**: Only ever 1 invoice (current billing period not yet due)
  - **DD Setup CTA**: Prominent banner on package view encouraging DD enrollment
  - **DD Monthly Limit**: Optional cashflow management feature
  - **DD Enrollment**: 3-step modal (Bank Details → Monthly Limit → Review & Sign)
- **Artifacts Created**:
  - [mockup-package-view.md](mockup-package-view.md) - 4 cards + invoice table + DD CTA
  - [mockup-dd-enrollment.md](mockup-dd-enrollment.md) - 3-step modal flow

### 2025-12-23 - Spec Clarification
- **Questions Asked**: 3
- **Questions Answered**: 3
- **Key Clarifications**:
  - Q: Invoice status definitions (3 vs 4 states)?
    A: 4 statuses - Current, New (within 7 days), Overdue (past 7 days), Paid
  - Q: DD monthly limit behavior when invoice exceeds limit?
    A: Skip DD entirely, notify user to pay manually (prep data model for future partial debit)
  - Q: MyOB sync frequency target?
    A: Hourly automated sync
- **Sections Updated**: FR-002 (status definitions), FR-006 (sync frequency), FR-017/FR-018 (DD limit), User Story 6 (limit exceeded)
- **Spec Updated**: Now has 6 user stories, 18 functional requirements

### 2025-12-23 - Implementation Plan Generated
- **Topic**: Technical implementation plan for Collections Module
- **Technical Approach**:
  - New `/domain/Collections` domain within majestic monolith
  - Models: ArInvoice, InvoiceSyncLog, DirectDebitMandate
  - Actions: SyncInvoicesFromMyobAction, CreateDirectDebitMandateAction
  - Hourly scheduled job for MyOB sync via Laravel Horizon
- **Architecture Decisions**:
  - Permission-gated via VIEW_FINANCIALS (PERM-006)
  - BSB and account numbers encrypted at rest
  - Inertia.js pages integrated into existing package UI
- **Data Model**:
  - ArInvoice: invoice_number, amount, due_date, status (4-state enum), synced_at
  - InvoiceSyncLog: audit trail for all sync operations
  - DirectDebitMandate: BSB (encrypted), account_number (encrypted), monthly_limit, status
- **Key Phases**:
  - Phase 1 (~1.5 sprints): AR Invoice Visibility - data model, MyOB sync, frontend
  - Phase 2 (~1-1.5 sprints): DD Enrollment - mandate model, 3-step modal, consent
  - Phase 3: Polish & hardening
- **Constitution Check**: All 16 applicable principles PASS
- **Artifacts Created**:
  - [plan.md](../plan.md) - Full implementation plan

### 2025-12-23 - Tasks Generated
- **Topic**: Dependency-ordered implementation tasks
- **Task Summary**:
  - **Total Tasks**: 67
  - **Phases**: 9 (Setup, Foundation, 6 User Stories, Polish)
  - **Parallel Opportunities**: 12 tasks marked [P]
- **Task Breakdown by User Story**:
  - US1 (Recipient Views Invoices): 12 tasks
  - US2 (Coordinator Views History): 4 tasks
  - US3 (Finance Views AR Data): 8 tasks
  - US4 (Recipient Signs DD): 19 tasks
  - US5 (Coordinator Views DD Status): 3 tasks
  - US6 (DD Limit Exceeded): 4 tasks
- **MVP Recommendation**: Phases 1-5 (35 tasks) for SAH launch
- **Artifacts Created**:
  - [tasks.md](../tasks.md) - Full task list with dependencies

## Design Decisions

- V1 is explicitly read-only (no payment actions, disputes, or PDF retrieval)
- MyOB is the source of truth for all contribution invoices
- Contribution invoices identified via HCP-Contribution category in MyOB
- Hourly automated sync with on-demand refresh capability

## Clarifications Made

- Q: What is in scope for V1?
  A: Read-only display of unpaid/paid contribution invoices, package-level summary, MyOB sync

- Q: What is out of scope for V1?
  A: Payment processing, dispute handling, PDF retrieval, payment reminders

## Open Questions

- Problem statement requires validation with Gus
- Confirm VIEW_FINANCIALS permission implementation (PERM-006)
- Validate API-014 MyOB integration readiness

## V2 Reference Material

Dashboard mockup and DD uptake reporting framework saved to:
- [DUMP/dashboard-mockup-v2-reference.md](../DUMP/dashboard-mockup-v2-reference.md)

Key V2 concepts captured:
- DD Adoption Rate tracking (target >= 85%)
- At-Risk contracts flagging with priority levels
- Arrears ageing (0-30, 31-60, >60 days)
- Risk thresholds for management escalation
- KPIs: DD Signed %, DD Unknown %, Arrears > 30 days, Hardship Cases %

**Related Epic**: TP-2285-COL2-Collections-V2
