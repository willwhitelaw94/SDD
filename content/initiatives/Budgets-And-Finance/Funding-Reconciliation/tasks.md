---
title: "Implementation Tasks: Funding Reconciliation & Refunds"
---

# Implementation Tasks: Funding Reconciliation & Refunds

**Epic**: FRR | **Generated**: 2026-02-12
**Source**: [plan.md](./plan.md) | [spec.md](./spec.md) | [data-model.md](./context/data-model.md) | [contracts/](./context/contracts/)
**Feature Branch**: `frr-funding-reconciliation-refunds`

---

## Summary

| Metric | Count |
|--------|-------|
| Total tasks | 78 |
| Phase 1 (Setup) | 4 |
| Phase 2 (Foundation) | 17 |
| Phase 3 (US1–US6) | 28 |
| Phase 4 (US7–US12) | 20 |
| Phase 5 (Polish) | 9 |
| Parallelizable | 34 |
| MVP scope (P0) | ~45 tasks |

---

## Dependency Graph

```
Phase 1: Setup
  └── Phase 2: Foundation (Sprint 1 — Data Model & Event Sourcing)
       ├── Phase 3a: US3 MYOB Webhook (Sprint 2) ◄── blocking for US1, US2
       ├── Phase 3b: US1+US2 Manual Adjustments (Sprint 3 — Approval & Budget)
       ├── Phase 3c: US4 Adjustments Index (Sprint 4 — Frontend)
       ├── Phase 3d: US5 Void Workflow (Sprint 3 continuation)
       └── Phase 3e: US6 Budget Visibility (Sprint 4 continuation)
            └── Phase 4a: US7+US8 SA Claims & Netting (Sprint 5+6)
                 ├── Phase 4b: US9 Rejection Handling (Sprint 6)
                 ├── Phase 4c: US10 Exclude Credits (Sprint 7)
                 ├── Phase 4d: US11 Reconciliation (Sprint 6)
                 └── Phase 4e: US12 Auto Claims (Sprint 8)
                      └── Phase 5: Polish & Launch (Sprint 9+10)
```

---

## Phase 1: Setup

- [ ] T001 Create feature branch `frr-funding-reconciliation-refunds` from `dev`
- [ ] T002 [P] Define Pennant feature flag `funding-adjustments` in `app/Providers/AppServiceProvider.php`
- [ ] T003 [P] Define Pennant feature flag `sa-automated-claims` in `app/Providers/AppServiceProvider.php`
- [ ] T004 Create domain directory structure: `domain/Finance/Adjustment/` (Models, Actions, Data, Aggregates, Events, Jobs, Services, Policies) and `domain/Billing/Claim/` (Models, Actions, Data, Jobs, Services)

---

## Phase 2: Foundation — Data Model & Event Sourcing (Sprint 1)

### Migrations

- [ ] T005 Create migration `create_adjustments_table` per Blueprint in `context/data-model.md` Migration 1 — bigint PK + uuid, bill/bill_item/consumption FKs, signed amount + direction, myob_status, service_date, all indexes
- [ ] T006 [P] Create migration `create_outstanding_credit_balances_table` per Migration 2 — adjustment_id, funding_id, amount, original_amount, fully_applied
- [ ] T007 [P] Create migration `create_consumption_claim_submissions_table` per Migration 3 — uuid, funding_id, claim/original/netted amounts, sa_claim_reference, status
- [ ] T008 [P] Create migration `create_consumption_claim_applications_table` per Migration 4 — submission FK, adjustment FK, amount_applied, applied_at

### Models

- [ ] T009 Create `domain/Finance/Adjustment/Models/Adjustment.php` — relationships (belongsTo Bill, BillItem, Consumption, User), scopes (pending, approved, credit, debit, myobDetected), casts (amount decimal, service_date date), status constants, soft deletes
- [ ] T010 [P] Create `domain/Finance/Adjustment/Models/OutstandingCreditBalance.php` — relationships (belongsTo Adjustment, Funding), scope (unapplied), casts
- [ ] T011 [P] Create `domain/Billing/Claim/Models/ConsumptionClaimSubmission.php` — relationships (belongsTo Funding, User; hasMany ConsumptionClaimApplication; belongsToMany BudgetPlanItemFundingConsumption), status constants, soft deletes
- [ ] T012 [P] Create `domain/Billing/Claim/Models/ConsumptionClaimApplication.php` — relationships (belongsTo ConsumptionClaimSubmission, Adjustment), casts

### Factories & Seeders

- [ ] T013 [P] Create `AdjustmentFactory` with states: pending, approved, voided, applied, manual, myobDetected, credit, debit
- [ ] T014 [P] Create `OutstandingCreditBalanceFactory` with states: partial, fullyApplied
- [ ] T015 [P] Create `ConsumptionClaimSubmissionFactory` with states: pending, submitted, reconciled, rejected
- [ ] T016 [P] Create `ConsumptionClaimApplicationFactory`
- [ ] T017 Create `AdjustmentSeeder` — 10 pending + 5 approved + 3 applied adjustments (mix of credits/debits) with credit balances

### Event Sourcing

- [ ] T018 Create `domain/Finance/Adjustment/Aggregates/AdjustmentAggregateRoot.php` — methods: createAdjustment, approveAdjustment, voidAdjustment, restoreBudget. Records events per state machine: pending → approved → applied | voided
- [ ] T019 [P] Create event classes in `domain/Finance/Adjustment/Events/`: `AdjustmentCreated.php`, `AdjustmentApproved.php`, `AdjustmentVoided.php`, `BudgetRestoredFromAdjustment.php`

### Data Classes

- [ ] T020 [P] Create `domain/Finance/Adjustment/Data/CreateAdjustmentData.php` — bill_id, bill_item_id?, amount, direction, type, reason, myob_uid?, consumption_id?, service_date?. Validation: direction in [credit, debit], reason required if manual
- [ ] T021 [P] Create `domain/Finance/Adjustment/Data/ApproveAdjustmentData.php` — notes?

---

## Phase 3: User Stories — Adjustment System (Phase 1)

### US3: Portal Automatically Detects MYOB Adjustments (P0) — Sprint 2

> **Blocking**: Must be completed before US1/US2 since MYOB-detected adjustments feed the approval workflow.

- [ ] T022 [US3] Create `domain/Finance/Adjustment/Services/MYOBAdjustmentMatchingService.php` — match bill_item_id (primary, left join to bill_items → resolve bill_id), match consumption_id (secondary, External Reference ID, may be soft-deleted), store both for traceability
- [ ] T023 [US3] Create `app/Http/Controllers/Api/MYOBWebhookController.php` — POST endpoint `/api/webhooks/myob/adjustments`, validate X-MYOB-Signature header, parse MYOBWebhookPayload, filter closed-only, dispatch ProcessMYOBWebhookAction
- [ ] T024 [US3] Create `domain/Finance/Adjustment/Actions/ProcessMYOBWebhookAction.php` — validate payload, check myob_status = closed, check service_date >= 2024-11-01, check duplicate via myob_uid, call MYOBAdjustmentMatchingService, create adjustment via CreateAdjustmentAction
- [ ] T025 [US3] Create `domain/Finance/Adjustment/Actions/CreateAdjustmentAction.php` — create Adjustment model from CreateAdjustmentData, handle both credit and debit directions with signed amounts, record AdjustmentCreated event
- [ ] T026 [US3] Create `domain/Finance/Adjustment/Jobs/BulkImportMYOBAdjustmentsJob.php` — query MYOB API for adjustments with service_date >= 2024-11-01 and status = closed, match each via MYOBAdjustmentMatchingService, create pending adjustments, skip duplicates
- [ ] T027 [US3] Register webhook route in `routes/api.php` — POST `/api/webhooks/myob/adjustments` → MYOBWebhookController
- [ ] T028 [US3] Write unit tests: `tests/Unit/Finance/Adjustment/Services/MYOBAdjustmentMatchingServiceTest.php` — test bill_item_id primary match, consumption_id secondary match, soft-deleted consumption fallback, no match scenario, bill_id resolution from bill_item_id
- [ ] T029 [US3] Write feature tests: `tests/Feature/Api/MYOBWebhookTest.php` — test closed status creates adjustment, balanced/open status skipped, invalid signature rejected, duplicate myob_uid skipped, credit and debit direction handling, service date filtering

### US1+US2: Finance Raises Adjustment (P0) — Sprint 3

- [ ] T030 [US1] Create `domain/Finance/Adjustment/Actions/ApproveAdjustmentAction.php` — validate pending status, set approved_by_user_id + approved_at, for debits trigger RestoreBudgetFromAdjustmentAction, create OutstandingCreditBalance per funding allocation, record AdjustmentApproved event
- [ ] T031 [US1] Create `domain/Finance/Adjustment/Actions/RestoreBudgetFromAdjustmentAction.php` — increase Funding.services_australia_available_amount, decrease Funding.tc_used_amount by adjustment amount, record BudgetRestoredFromAdjustment event
- [ ] T032 [P] [US1] Create `domain/Finance/Adjustment/Policies/AdjustmentPolicy.php` — authorize approve/void based on finance_user role, prevent void of applied adjustments
- [ ] T033 [US1] Create `app/Http/Controllers/Finance/AdjustmentController.php` — index (paginated, filterable by status/direction/type/date), show (detail with credit balances), create (form), store (via CreateAdjustmentData), approve (via ApproveAdjustmentAction), void (via VoidAdjustmentAction)
- [ ] T034 [US1] Register routes in `routes/web.php` — resource routes for `/finance/adjustments` with approve/void PATCH actions, protected by Pennant `funding-adjustments` flag
- [ ] T035 [US1] Write unit tests: `tests/Unit/Finance/Adjustment/Actions/ApproveAdjustmentActionTest.php` — test budget restoration for debits, no budget change for credits, OutstandingCreditBalance creation, invalid status rejection
- [ ] T036 [P] [US1] Write unit tests: `tests/Unit/Finance/Adjustment/Actions/RestoreBudgetFromAdjustmentActionTest.php` — test funding amount updates, proportional allocation for multi-funding bills
- [ ] T037 [US2] Write feature tests: `tests/Feature/Finance/Adjustment/AdjustmentWorkflowTest.php` — test full refund (all funding streams restored proportionally), partial refund, approval → budget restored, cumulative credits validation (sum ≤ bill total)

### US5: Finance Voids Incorrect Adjustment (P1) — Sprint 3

- [ ] T038 [US5] Create `domain/Finance/Adjustment/Actions/VoidAdjustmentAction.php` — validate not applied, set voided_by_user_id + voided_at + reason, if was approved revert budget restoration (decrease available, increase used), delete OutstandingCreditBalance records, record AdjustmentVoided event
- [ ] T039 [US5] Write unit tests: `tests/Unit/Finance/Adjustment/Actions/VoidAdjustmentActionTest.php` — test void pending (no budget revert), void approved (budget reverted, credit balances deleted), reject void of applied adjustment
- [ ] T040 [US5] Write feature tests: `tests/Feature/Finance/Adjustment/VoidWorkflowTest.php` — test void from pending, void from approved with budget revert, void rejection for applied, void reason required

### US4: Finance Views Adjustments Index (P1) — Sprint 4

- [ ] T041 [US4] Create `resources/js/Pages/Finance/Adjustments/Index.vue` — server-side paginated table with columns: Client, Bill #, Amount (signed), Direction badge (credit/debit), Type badge (MYOB/manual), Status badge, MYOB Link, Service Date, Actions (approve/void). Filters: status, direction, type, date range. Sort: amount, service_date, created_at
- [ ] T042 [P] [US4] Create `resources/js/Pages/Finance/Adjustments/Show.vue` — detail view with bill info, bill item link, consumption link (if not soft-deleted), credit balances table, claim applications table, audit trail (created, approved, voided timestamps + users)
- [ ] T043 [P] [US4] Create `resources/js/Pages/Finance/Adjustments/Create.vue` — manual adjustment form: select bill (search/autocomplete), optional bill item, amount (signed), direction (credit/debit radio), reason (required textarea), MYOB reference (optional)
- [ ] T044 [US4] Create approval modal component in Index.vue — confirm approval with optional notes
- [ ] T045 [US4] Create void modal component in Index.vue — confirm void with required reason
- [ ] T046 [US4] Write browser tests: `tests/Browser/Finance/AdjustmentIndexTest.php` — navigate to index, verify table renders, filter by status, approve pending adjustment via modal, void pending adjustment via modal, verify MYOB link opens

### US6: Care Coordinator Sees Budget Restored (P2) — Sprint 4

- [ ] T047 [US6] Add `hasMany(Adjustment::class)` relationship to existing `Bill` model (`app/Models/Bill/Bill.php`)
- [ ] T048 [P] [US6] Add `hasMany(Adjustment::class, 'bill_item_id')` relationship to existing `BillItem` model
- [ ] T049 [US6] Add credit note transaction type to budget transaction history — display "Adjustment Applied: [Reason]" with amount and date in client budget view (no MYOB reference exposed to Care Coordinators)

---

## Phase 4: User Stories — SA Claims Pipeline (Phase 2)

### US7+US8: SA Claims with Netting & Submission (P0) — Sprint 5+6

- [ ] T050 [US7] Create `domain/Finance/Adjustment/Actions/CalculateOutstandingCreditsForClaimAction.php` — fetch unapplied OutstandingCreditBalance records for a given funding_id where fully_applied = false, return total available credit and individual balances
- [ ] T051 [US7] Create `domain/Billing/Claim/Services/AdjustmentNettingService.php` — calculate net claim: original_amount - outstanding_credits = claim_amount, handle credits > consumption (cap at $0, carry forward), support partial application across multiple balances
- [ ] T052 [US7] Create `domain/Billing/Claim/Actions/NetAdjustmentsAgainstClaimAction.php` — apply outstanding credits to claim by modifying original line amounts, create ConsumptionClaimApplication records, update OutstandingCreditBalance.amount and fully_applied flag
- [ ] T053 [US7] Create `domain/Billing/Claim/Data/SAClaimSubmissionData.php` — funding_id, original_amount, adjustments_netted, claim_amount, consumption IDs
- [ ] T054 [P] [US7] Create `domain/Billing/Claim/Data/AdjustmentNettingData.php` — adjustment_id, amount_available, amount_to_apply
- [ ] T055 [US7] Write unit tests: `tests/Unit/Billing/Claim/Services/AdjustmentNettingServiceTest.php` — test basic netting ($100 - $20 = $80), credits exceed consumption (cap at $0), multiple credits against one claim, partial credit application, no credits available (full amount claimed)
- [ ] T056 [US8] Create `domain/Billing/Claim/Services/ServicesAustraliaAPIService.php` — validate consumption (POST /api/v1/consumption/validate), submit claim (POST /api/v1/consumption/claim with modified line amounts), check status (GET /api/v1/claim/{ref}/status). HTTP client with retry and timeout
- [ ] T057 [US8] Create `domain/Billing/Claim/Actions/ClaimConsumptionToSAAction.php` — validate claim is pending, call SA API with modified line amounts, update claim status to submitted, mark applied adjustments
- [ ] T058 [US8] Create `domain/Billing/Claim/Actions/ValidateConsumptionWithSAAction.php` — call SA validation endpoint, return is_valid + available_budget + errors
- [ ] T059 [US8] Create `domain/Billing/Claim/Jobs/SubmitConsumptionToSAJob.php` — queued job, call ClaimConsumptionToSAAction, handle SA API response, update ConsumptionClaimSubmission status
- [ ] T060 [US8] Create `domain/Billing/Claim/Data/SAClaimResponseData.php` — claim_reference, status, claimed_amount, message, errors
- [ ] T061 [US8] Write feature tests: `tests/Feature/Billing/Claim/SAClaimNettingTest.php` — test submit claim with netting applied (original $100, credit $20, claimed $80), credit marked as applied, OutstandingCreditBalance.fully_applied = true, SA API response processed

### US9: Finance Handles SA Claim Rejection (P1) — Sprint 6

- [ ] T062 [US9] Create `domain/Billing/Claim/Actions/ReconcileSAClaimResponseAction.php` — if reconciled: mark claim reconciled, mark adjustments applied. If rejected: mark claim rejected, revert adjustment status from applied back to approved, restore OutstandingCreditBalance amounts
- [ ] T063 [US9] Create `domain/Billing/Claim/Jobs/ReconcileSAClaimJob.php` — queued job, check SA claim status via API, call ReconcileSAClaimResponseAction
- [ ] T064 [US9] Write feature tests: `tests/Feature/Billing/Claim/SAClaimRejectionTest.php` — test rejection reverts adjustments to approved, credits restored, claim can be regenerated with same credits

### US11: Finance Reconciles SA Claim Response (P1) — Sprint 6

- [ ] T065 [US11] Create `app/Http/Controllers/Billing/SAClaimController.php` — index (paginated claims), show (claim detail with netting breakdown), submit (dispatch SubmitConsumptionToSAJob), reconcile (via ReconcileSAClaimResponseAction)
- [ ] T066 [US11] Register routes in `routes/web.php` — resource routes for `/billing/claims` with submit POST and reconcile PATCH, protected by Pennant `sa-automated-claims` flag

### US10: Finance Excludes Credit from Claim (P2) — Sprint 7

- [ ] T067 [US10] Add exclude/defer credit logic to `AdjustmentNettingService` — accept array of excluded adjustment IDs, skip them during netting, keep their OutstandingCreditBalance unchanged
- [ ] T068 [US10] Write unit tests: test netting with excluded credits (excluded credit not applied, remaining credits still applied, excluded credit available for next cycle)

### Frontend: SA Claim Review (Sprint 7)

- [ ] T069 [US7] Create `resources/js/Pages/Billing/Claims/SAClaimReview.vue` — claim summary card (original amount, adjustments netted, final claim amount), netting breakdown table (adjustment UUID, direction, reason, bill reference, amount applied), consumptions table (consumption ID, service type, date, original amount, claimed amount), submit button with loading state
- [ ] T070 [P] [US7] Create `resources/js/Pages/Billing/Claims/Index.vue` — paginated claims table with columns: Funding Name, Original Amount, Netted Amount, Claim Amount, Status, SA Reference, Submitted By, Date. Filters: status, funding_stream_id
- [ ] T071 [US7] Write browser tests: `tests/Browser/Billing/SAClaimReviewTest.php` — navigate to claim review, verify netting breakdown, submit claim

### US12: Automated Weekly Claims (P2) — Sprint 8

- [ ] T072 [US12] Create scheduled job for batch claim assembly — aggregate CLEANSED consumptions per funding allocation, calculate netting via AdjustmentNettingService, create ConsumptionClaimSubmission records in pending status
- [ ] T073 [US12] Add Horizon monitoring dashboard config for BulkImportMYOBAdjustmentsJob, SubmitConsumptionToSAJob, ReconcileSAClaimJob

### Outstanding Credits Dashboard (Sprint 8)

- [ ] T074 Create `resources/js/Components/Finance/OutstandingCreditsWidget.vue` — aggregated credits per funding, total outstanding badge, click funding to filter Adjustments Index
- [ ] T075 Register outstanding credits API endpoints in `routes/api.php` — GET `/api/outstanding-credits` and GET `/api/outstanding-credits/summary`

---

## Phase 5: Polish & Launch (Sprint 9+10)

### Edge Cases & Error Handling

- [ ] T076 Add retry logic with exponential backoff to `ServicesAustraliaAPIService` for SA API failures (3 retries, 1s/5s/30s delays)
- [ ] T077 Add dead-letter queue handling for permanently failed SA claim submissions — log to admin dashboard, notify Finance

### Performance & Optimization

- [ ] T078 [P] Add eager loading to AdjustmentController index query — `Adjustment::with(['bill', 'billItem', 'approvedBy'])` to prevent N+1
- [ ] T079 [P] Add eager loading to SAClaimController — `ConsumptionClaimSubmission::with(['funding.fundingStream', 'applications.adjustment'])`

### Launch

- [ ] T080 Run full test suite (unit + feature + browser): `php artisan test --compact`
- [ ] T081 Run Pint formatting: `vendor/bin/pint --dirty`
- [ ] T082 Deploy to staging with both feature flags disabled
- [ ] T083 Enable `funding-adjustments` flag (25% → 100% rollout)
- [ ] T084 Enable `sa-automated-claims` flag (10% → 100% rollout)

---

## Parallel Execution Opportunities

| Phase | Parallel Tasks | Description |
|-------|---------------|-------------|
| Phase 1 | T002, T003 | Feature flags can be defined simultaneously |
| Phase 2 | T006, T007, T008 | Independent migrations after T005 |
| Phase 2 | T010, T011, T012 | Independent models after T009 |
| Phase 2 | T013–T016 | All factories independent |
| Phase 2 | T019, T020, T021 | Events and data classes independent |
| Phase 3 | T032, T035, T036 | Policy and unit tests parallelizable |
| Phase 3 | T042, T043 | Show and Create pages independent |
| Phase 4 | T054, T055 | Data class and tests parallelizable |
| Phase 4 | T069, T070 | Review and Index pages independent |
| Phase 5 | T078, T079 | Eager loading optimizations independent |
