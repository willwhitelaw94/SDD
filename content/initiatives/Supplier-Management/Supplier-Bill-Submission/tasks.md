---
title: "Implementation Tasks: Invoice Uplift (SBS + OHB)"
---

# Implementation Tasks: Invoice Uplift (SBS + OHB)

**Plan**: [plan.md](plan.md) | **Branch**: `feature/invoice-uplift`
**Mode**: AI (agent-executable)
**Generated**: 2026-03-07
**Parallel Tracks**: OHB (T001-T060) and SBS (T061-T095) can run concurrently after T001-T008

---

## Phase 0: Foundation — New Files + Cherry-Pick

- [ ] T001 Feature flag: Create `app/Features/OhbEnabledFeature.php` — class-based Pennant feature, `__invoke()` returns `boolval(nova_get_setting('ff_ohb_enabled', false))`. File: `app/Features/OhbEnabledFeature.php`
- [ ] T002 [P] Feature flag: Create `app/Features/SbsEmailSubmissionFeature.php` — same pattern, `ff_sbs_email_submission` Nova setting. File: `app/Features/SbsEmailSubmissionFeature.php`
- [ ] T003 [P] Feature flag: Create `app/Features/PublicBillFormFeature.php` — `ff_public_bill_form` Nova setting. File: `app/Features/PublicBillFormFeature.php`
- [ ] T004 [P] Feature flag: Create `app/Features/SupplierOhbViewFeature.php` — `ff_supplier_ohb_view` Nova setting. File: `app/Features/SupplierOhbViewFeature.php`
- [ ] T005 Controller: Modify `BillController@edit` — add `Feature::active(OhbEnabledFeature::class)` check. If active, `Inertia::render('Bills/EditV2', $props)` with OHB-specific props; else `Inertia::render('Bills/Edit', $existingProps)` unchanged. File: `app/Http/Controllers/BillController.php`
- [ ] T006 Vue page: Create `Bills/EditV2.vue` — IDE three-panel layout. Left panel: collapsible docs/notes (CommonCollapsible). Center: bill form canvas (reuse existing EditPartials). Right panel: placeholder for checklist (Phase 5). Sticky footer with totals. Use `<script setup lang="ts">`, `defineOptions({ layout: (h: any, page: any) => h(AppLayout, { title }, () => page) })`. File: `resources/js/Pages/Bills/EditV2.vue`
- [ ] T007 Test: Verify `Bills/Edit.vue` still renders when `ohb-enabled` OFF. Feature test: `GET /bills/{id}/edit` returns `Bills/Edit` component. File: `tests/Feature/OHB/BillEditFeatureFlagTest.php`
- [ ] T008 Test: Verify `Bills/EditV2.vue` renders when `ohb-enabled` ON. Feature test: activate flag, `GET /bills/{id}/edit` returns `Bills/EditV2` component. File: `tests/Feature/OHB/BillEditFeatureFlagTest.php`

---

## Phase 1: OHB — Database & Models

### Migrations

- [ ] T009 Migration: `bill_ohb_states` — columns: `id` (bigIncrements), `bill_id` (foreignId→bills, unique), `ohb_status` (string(50) default 'pending_diagnosis'), `comms_type` (string(30) nullable), `cadence_status` (string(20) nullable), `cadence_started_at` (timestamp nullable), `resolution_window_status` (string(20) nullable), `resolution_window_started_at` (timestamp nullable), `limited_time_soft_warning` (boolean default false), `original_bill_id` (foreignId→bills nullable), `resubmission_count` (smallInteger unsigned default 0), `outcome` (string(30) nullable), `outcome_at` (timestamp nullable), timestamps. Indexes: `idx_bill_ohb_status` on (ohb_status), `idx_bill_ohb_cadence` on (cadence_status, cadence_started_at), `idx_bill_ohb_original` on (original_bill_id). File: `database/migrations/xxxx_create_bill_ohb_states_table.php`
- [ ] T010 [P] Migration: `ohb_reasons` — columns: `id`, `code` (string(50) unique), `name` (string(100)), `description` (text nullable), `department_owner` (string(20)), `touches_invoice` (boolean default false), `auto_reject_eligible` (boolean default false), `requires_internal_action` (boolean default false), `requires_resolution_outreach` (boolean default false), `has_timeout` (boolean default true), `cadence_days` (smallInteger nullable default 10), `requires_revalidation` (boolean default false), `revalidation_checks` (json nullable), `can_coexist_with` (json nullable default '["all"]'), `possible_outcomes` (text nullable), `success_outcome` (string(255) nullable), `failure_outcome` (string(255) nullable), `bill_processor_action` (text nullable), `department_action` (text nullable), `supplier_action_required` (text nullable), `day_0_comms` (text nullable), `day_3_comms` (text nullable), `day_7_comms` (text nullable), `day_10_comms` (text nullable), `legacy_enum_mapping` (string(50) nullable), `is_active` (boolean default true), timestamps. Indexes: `idx_ohb_reasons_dept` on (department_owner, is_active), `idx_ohb_reasons_legacy` on (legacy_enum_mapping). File: `database/migrations/xxxx_create_ohb_reasons_table.php`
- [ ] T011 [P] Migration: `bill_reasons` — columns: `id`, `bill_id` (foreignId→bills), `ohb_reason_id` (foreignId→ohb_reasons onDelete RESTRICT), `status` (string(20) default 'pending'), `diagnosed_at` (timestamp), `diagnosed_by_type` (string(20)), `diagnosed_by_user_id` (foreignId→users nullable onDelete SET NULL), `resolved_at` (timestamp nullable), `resolved_by_type` (string(30) nullable), `resolved_by_user_id` (foreignId→users nullable onDelete SET NULL), `resolution_notes` (text nullable), `included_in_communication` (boolean default false), `task_id` (foreignId→tasks nullable onDelete SET NULL), timestamps, softDeletes. Indexes: `idx_bill_reasons_bill` on (bill_id, status), `idx_bill_reasons_bill_deleted` on (bill_id, deleted_at), `idx_bill_reasons_reason` on (ohb_reason_id), `idx_bill_reasons_task` on (task_id). Unique: `idx_bill_reasons_unique` on (bill_id, ohb_reason_id, deleted_at). File: `database/migrations/xxxx_create_bill_reasons_table.php`
- [ ] T012 [P] Migration: `ohb_communications` — columns: `id`, `bill_id` (foreignId→bills), `stream` (string(30)), `type` (string(30)), `recipients` (json), `reason_ids` (json), `payload` (json), `soft_warning_included` (boolean default false), `sent_at` (timestamp), `sent_by_type` (string(20) default 'system'), `sent_by_user_id` (foreignId→users nullable), `notification_id` (unsignedBigInteger nullable), `created_at` (timestamp). Indexes: `idx_ohb_comms_bill` on (bill_id, sent_at), `idx_ohb_comms_stream` on (stream, type). File: `database/migrations/xxxx_create_ohb_communications_table.php`
- [ ] T013 [P] Migration: `ohb_revalidation_logs` — columns: `id`, `bill_id` (foreignId→bills), `triggered_by` (string(30)), `checks_performed` (json), `results` (json), `new_reason_ids` (json nullable), `performed_at` (timestamp), `created_at` (timestamp). Index: `idx_ohb_reval_bill` on (bill_id, performed_at). File: `database/migrations/xxxx_create_ohb_revalidation_logs_table.php`
- [ ] T014 [P] Migration: `supplier_inbound_tokens` — columns: `id`, `supplier_id` (foreignId→suppliers unique), `token` (string(64) unique), `email_address` (string(255)), `is_active` (boolean default true), timestamps. Index on (email_address). File: `database/migrations/xxxx_create_supplier_inbound_tokens_table.php`
- [ ] T015 [P] Migration: `supplier_package_emails` — columns: `id`, `supplier_id` (foreignId→suppliers), `package_id` (foreignId→packages), `token` (string(64) unique), `email_address` (string(255)), `is_active` (boolean default true), timestamps. Unique: (supplier_id, package_id). Index on (email_address). File: `database/migrations/xxxx_create_supplier_package_emails_table.php`

### Enums

- [ ] T016 [P] Enum: `OhbStatusEnum` — cases: PENDING_DIAGNOSIS, IN_DIAGNOSIS, ROUTING_TO_DEPARTMENTS, AWAITING_DEPARTMENT_WORK, IN_REVALIDATION, AWAITING_COMMUNICATION, ON_HOLD, AWAITING_RESUBMISSION, COMPLETED. File: `app/Enums/Bill/OhbStatusEnum.php`
- [ ] T017 [P] Enum: `BillReasonStatusEnum` — cases: PENDING, IN_PROGRESS, RESOLVED, UNRESOLVED, AWAITING. File: `app/Enums/Bill/BillReasonStatusEnum.php`
- [ ] T018 [P] Enum: `OhbCommsTypeEnum` — cases: REJECT_RESUBMIT, REJECT_PERIOD, ON_HOLD. File: `app/Enums/Bill/OhbCommsTypeEnum.php`
- [ ] T019 [P] Enum: `OhbOutcomeEnum` — cases: PAID, REJECTED_FINAL, REJECTED_RESUBMIT. File: `app/Enums/Bill/OhbOutcomeEnum.php`
- [ ] T020 [P] Enum: `OhbDepartmentEnum` — cases: CARE, COMPLIANCE, ACCOUNTS. File: `app/Enums/Bill/OhbDepartmentEnum.php`
- [ ] T021 [P] Enum: `OhbCommunicationStreamEnum` — cases: RESOLUTION_OUTREACH, SUBMITTER_NOTIFICATION. File: `app/Enums/Bill/OhbCommunicationStreamEnum.php`

### Models

- [ ] T022 Model: `BillOhbState` — fillable: all columns except id/timestamps. Casts: `ohb_status` → OhbStatusEnum, `comms_type` → OhbCommsTypeEnum, `outcome` → OhbOutcomeEnum, `limited_time_soft_warning` → boolean, `cadence_started_at` → datetime, `resolution_window_started_at` → datetime, `outcome_at` → datetime. Relationships: `bill()` BelongsTo Bill, `originalBill()` BelongsTo Bill (original_bill_id), `resubmissions()` HasMany BillOhbState (original_bill_id). File: `domain/Bill/Models/BillOhbState.php`
- [ ] T023 [P] Model: `OhbReason` — fillable: all columns except id/timestamps. Casts: `touches_invoice` → boolean, `auto_reject_eligible` → boolean, `requires_internal_action` → boolean, `requires_resolution_outreach` → boolean, `has_timeout` → boolean, `requires_revalidation` → boolean, `revalidation_checks` → array, `can_coexist_with` → array, `is_active` → boolean. Relationships: `billReasons()` HasMany BillReason. Scope: `scopeActive($q)` → `$q->where('is_active', true)`, `scopeByDepartment($q, OhbDepartmentEnum $dept)` → `$q->where('department_owner', $dept->value)`, `scopeAutoRejectEligible($q)` → `$q->where('auto_reject_eligible', true)`. File: `domain/Bill/Models/OhbReason.php`
- [ ] T024 [P] Model: `BillReason` — uses `SoftDeletes`. Fillable: all columns except id/timestamps/deleted_at. Casts: `status` → BillReasonStatusEnum, `diagnosed_at` → datetime, `resolved_at` → datetime, `included_in_communication` → boolean. Relationships: `bill()` BelongsTo Bill, `ohbReason()` BelongsTo OhbReason, `diagnosedBy()` BelongsTo User (diagnosed_by_user_id), `resolvedBy()` BelongsTo User (resolved_by_user_id), `task()` BelongsTo Task. Scope: `scopeVisibleToSupplier($q)` — filters based on can_coexist_with rules, hides dominated issues. `scopeBlocking($q)` → status in [pending, in_progress, awaiting]. `scopeComplete($q)` → status = resolved. `scopeByDepartment($q, OhbDepartmentEnum $dept)` → join ohb_reasons where department_owner. File: `domain/Bill/Models/BillReason.php`
- [ ] T025 [P] Model: `OhbCommunication` — fillable: all except id/created_at. Casts: `stream` → OhbCommunicationStreamEnum, `recipients` → array, `reason_ids` → array, `payload` → array, `soft_warning_included` → boolean, `sent_at` → datetime. Relationships: `bill()` BelongsTo Bill, `sentBy()` BelongsTo User (sent_by_user_id). No `updated_at` — append-only. Set `const UPDATED_AT = null`. File: `domain/Bill/Models/OhbCommunication.php`
- [ ] T026 [P] Model: `OhbRevalidationLog` — fillable: all except id/created_at. Casts: `checks_performed` → array, `results` → array, `new_reason_ids` → array, `performed_at` → datetime. Relationships: `bill()` BelongsTo Bill. No `updated_at` — append-only. Set `const UPDATED_AT = null`. File: `domain/Bill/Models/OhbRevalidationLog.php`
- [ ] T027 [P] Model: `SupplierInboundToken` — fillable: supplier_id, token, email_address, is_active. Casts: `is_active` → boolean. Relationships: `supplier()` BelongsTo Supplier. Constants: `EMAIL_DOMAIN = 'invoices.trilogycare.com.au'`. Method: `static generateToken(): string` → `Str::random(32)`. Method: `static buildEmailAddress(string $token): string` → `"{$token}@" . self::EMAIL_DOMAIN`. File: `domain/Bill/Models/SupplierInboundToken.php`
- [ ] T028 [P] Model: `SupplierPackageEmail` — fillable: supplier_id, package_id, token, email_address, is_active. Casts: `is_active` → boolean. Relationships: `supplier()` BelongsTo Supplier, `package()` BelongsTo Package. File: `domain/Bill/Models/SupplierPackageEmail.php`

### Relationships on existing models

- [ ] T029 Bill model: Add `ohbState()` HasOne BillOhbState, `billReasons()` HasMany BillReason. File: `domain/Bill/Models/Bill.php` (or wherever Bill model lives — check existing path)
- [ ] T030 [P] Supplier model: Add `inboundToken()` HasOne SupplierInboundToken, `packageEmails()` HasMany SupplierPackageEmail. File: check existing Supplier model path

### Observer & Seeder

- [ ] T031 Observer: Create `BillReasonObserver` — on `created` event, find OhbReason via `ohb_reason_id`, read `legacy_enum_mapping`, if not null write to `$billReason->bill->bill_on_hold_reason` using the mapped BillOnHoldReasonsEnum value. Register in `AppServiceProvider@boot`. File: `app/Observers/BillReasonObserver.php`
- [ ] T032 [P] Seeder: `OhbReasonsSeeder` — seed 36 reasons with all attributes from db-spec.md. Each reason needs: code, name, department_owner, touches_invoice, auto_reject_eligible, requires_internal_action, requires_resolution_outreach, has_timeout, cadence_days, requires_revalidation, revalidation_checks, can_coexist_with, legacy_enum_mapping, comms templates. Use `OhbReason::updateOrCreate(['code' => ...], [...])` for idempotent seeding. File: `database/seeders/OhbReasonsSeeder.php`

### Factories

- [ ] T033 [P] Factory: `BillOhbStateFactory` — default state: ohb_status=pending_diagnosis, for Bill. States: `diagnosed()`, `onHold()`, `completed()`. File: `database/factories/BillOhbStateFactory.php`
- [ ] T034 [P] Factory: `BillReasonFactory` — default: status=pending, diagnosed_by_type=ai. States: `resolved()`, `unresolved()`, `awaiting()`. For Bill + OhbReason. File: `database/factories/BillReasonFactory.php`
- [ ] T035 [P] Factory: `OhbCommunicationFactory`, `OhbRevalidationLogFactory`, `SupplierInboundTokenFactory`, `SupplierPackageEmailFactory` — standard factories with sensible defaults. Files: `database/factories/`

### Tests

- [ ] T036 Unit test: OHB model relationships — BillOhbState→bill, OhbReason→billReasons, BillReason→bill/ohbReason/task, Bill→ohbState/billReasons. File: `tests/Unit/OHB/Models/OhbModelRelationshipsTest.php`
- [ ] T037 [P] Unit test: BillReasonObserver dual-write — create BillReason with OhbReason that has legacy_enum_mapping, assert bill.bill_on_hold_reason updated. Create BillReason where legacy_enum_mapping is null, assert bill.bill_on_hold_reason unchanged. File: `tests/Unit/OHB/Observers/BillReasonObserverTest.php`
- [ ] T038 [P] Unit test: SupplierInboundToken model — generateToken returns 32-char string, buildEmailAddress returns correct format. File: `tests/Unit/SBS/Models/SupplierInboundTokenTest.php`

---

## Phase 2: OHB — Diagnosis Engine [US1] [US2] [US3]

- [ ] T039 Action: `DiagnoseBillAction` — `use AsAction`. `handle(Bill $bill): DiagnosisResultData`. Calls each category validator, collects detected reasons, creates BillReason records + BillOhbState. Returns data object with reason count + auto_reject flag. File: `domain/Bill/Actions/OHB/DiagnoseBillAction.php`
- [ ] T040 [P] Data: `DiagnosisResultData` — properties: `int $totalReasons`, `int $blockingCount`, `bool $autoRejectTriggered`, `Collection $detectedReasons`. File: `domain/Bill/Data/OHB/DiagnosisResultData.php`
- [ ] T041 Service: `OhbDiagnosisService` — constructor DI: array of category validators. `diagnose(Bill $bill): DiagnosisResultData`. Loops validators, creates BillOhbState (pending_diagnosis→in_diagnosis), creates BillReason per detected issue, determines if auto-reject applies. File: `domain/Bill/Services/OhbDiagnosisService.php`
- [ ] T042 [P] Validator: `SupplierValidator` — checks: ABN/GST error, supplier terminated, supplier not verified, bank details missing, MYOB sync issue. Each returns array of OhbReason codes detected. File: `domain/Bill/Validators/OHB/SupplierValidator.php`
- [ ] T043 [P] Validator: `RecipientValidator` — checks: client name mismatch, package status invalid, eligibility issue. File: `domain/Bill/Validators/OHB/RecipientValidator.php`
- [ ] T044 [P] Validator: `InvoiceValidator` — checks: calculation error, itemisation errors (2 types), commencement/termination date errors. File: `domain/Bill/Validators/OHB/InvoiceValidator.php`
- [ ] T045 [P] Validator: `ComplianceValidator` — checks: finance QA failure, duplicate detection. File: `domain/Bill/Validators/OHB/ComplianceValidator.php`
- [ ] T046 Action: `AutoRejectBillAction` — `use AsAction`. `handle(Bill $bill, DiagnosisResultData $result): bool`. Checks if all detected reasons are `auto_reject_eligible`. If yes: set bill stage to REJECTED, set OhbState outcome=REJECTED_FINAL, return true. If mixed: return false (human review needed). File: `domain/Bill/Actions/OHB/AutoRejectBillAction.php`
- [ ] T047 Action: `RouteToDepartmentsAction` — `use AsAction`. `handle(Bill $bill): void`. Queries BillReasons where ohbReason.requires_internal_action=true. Groups by department_owner. Creates a Task per department with taskable_type=BillReason, links task_id back to bill_reasons. File: `domain/Bill/Actions/OHB/RouteToDepartmentsAction.php`
- [ ] T048 Hook: Modify existing bill submission flow — at SUBMITTED→IN_REVIEW transition, check `Feature::active(OhbEnabledFeature::class)`. If active: call `DiagnoseBillAction::run($bill)`. If auto-reject: call `AutoRejectBillAction`. Else: call `RouteToDepartmentsAction`. File: find existing ReviewBillAction or bill stage transition handler
- [ ] T049 Test: [US1] Diagnosis with 3 issues (ABN error + calculation error + missing itemization) — all 3 detected and BillReason records created. File: `tests/Feature/OHB/DiagnoseBillTest.php`
- [ ] T050 [P] Test: [US2] Auto-reject with invalid ABN — bill auto-rejected, no human review. File: `tests/Feature/OHB/AutoRejectTest.php`
- [ ] T051 [P] Test: [US2] Mixed reasons (auto-reject + human-needed) — NOT auto-rejected. File: `tests/Feature/OHB/AutoRejectTest.php`
- [ ] T052 [P] Test: [US3] Department routing — bill with Care + Compliance reasons creates 2 tasks. File: `tests/Feature/OHB/DepartmentRoutingTest.php`
- [ ] T053 [P] Test: Feature flag OFF — diagnosis does NOT run, existing flow unchanged. File: `tests/Feature/OHB/DiagnoseBillTest.php`

---

## Phase 3: OHB — Communication Engine [US5] [US6] [US7] [US8]

- [ ] T054 Action: `DetermineCommsTypeAction` — `use AsAction`. `handle(Bill $bill): OhbCommsTypeEnum`. Logic: if any BillReason.ohbReason.touches_invoice=true → REJECT_RESUBMIT. If any reason is permanent block (supplier terminated) → REJECT_PERIOD. Else → ON_HOLD. Updates BillOhbState.comms_type. File: `domain/Bill/Actions/OHB/DetermineCommsTypeAction.php`
- [ ] T055 Scope: `BillReason::scopeVisibleToSupplier($query)` — reads can_coexist_with from related ohbReason. If a dominant reason exists (e.g., supplier_terminated), hide subordinate reasons. Returns filtered query. File: already in `domain/Bill/Models/BillReason.php` (add scope from T024)
- [ ] T056 Notification: `OhbSubmitterNotification` — mail notification to supplier. Includes filtered reasons (via scopeVisibleToSupplier), comms type, resubmit link only if REJECT_RESUBMIT. File: `app/Notifications/OHB/OhbSubmitterNotification.php`
- [ ] T057 [P] Notification: `OhbResolutionOutreachNotification` — mail to client/coordinator for reasons with requires_resolution_outreach=true. File: `app/Notifications/OHB/OhbResolutionOutreachNotification.php`
- [ ] T058 [P] Notification: `OhbCadenceReminderNotification` — Day 3/7 reminder mail. File: `app/Notifications/OHB/OhbCadenceReminderNotification.php`
- [ ] T059 Job: `OhbCadenceJob` — ShouldQueue. Queries BillOhbState where comms_type=ON_HOLD, cadence_status in [day_0, day_3, day_7], and next cadence date <= now(). Processes in chunks(100). Day 3: send reminder, update cadence_status. Day 7: send warning. Day 10: call TimeoutOnHoldBillAction. Register in Kernel: `$schedule->job(new OhbCadenceJob)->hourly()`. File: `app/Jobs/OHB/OhbCadenceJob.php`
- [ ] T060 Action: `TimeoutOnHoldBillAction` — `use AsAction`. `handle(Bill $bill): void`. Sets BillOhbState outcome=REJECTED_FINAL, cadence_status=day_10, bill stage=REJECTED. Creates OhbCommunication record. File: `domain/Bill/Actions/OHB/TimeoutOnHoldBillAction.php`
- [ ] T061 Test: [US5] REJECT-RESUBMIT when touches_invoice reason exists. File: `tests/Feature/OHB/CommunicationTest.php`
- [ ] T062 [P] Test: [US5] REJECT_PERIOD when supplier terminated. File: `tests/Feature/OHB/CommunicationTest.php`
- [ ] T063 [P] Test: [US5] ON_HOLD when only contextual reasons. File: `tests/Feature/OHB/CommunicationTest.php`
- [ ] T064 [P] Test: [US8] Can Coexist — terminated + ABN error → only termination visible to supplier. File: `tests/Feature/OHB/CommunicationTest.php`
- [ ] T065 [P] Test: [US6] Cadence Day 3 sends reminder. File: `tests/Feature/OHB/CadenceTest.php`
- [ ] T066 [P] Test: [US6] Cadence Day 10 auto-rejects. File: `tests/Feature/OHB/CadenceTest.php`
- [ ] T067 [P] Test: [US7] Resolution Outreach sent to client, NOT supplier. File: `tests/Feature/OHB/CommunicationTest.php`

---

## Phase 4: OHB — Temporal Re-validation [US4]

- [ ] T068 Action: `RevalidateBillAction` — `use AsAction`. `handle(Bill $bill, string $triggeredBy): RevalidationResultData`. Calls time-sensitive validators, adds new BillReasons if context changed, logs to OhbRevalidationLog. Checks loop limit (max 5 revalidations per bill). File: `domain/Bill/Actions/OHB/RevalidateBillAction.php`
- [ ] T069 [P] Data: `RevalidationResultData` — properties: `bool $contextChanged`, `int $newReasonsAdded`, `array $checksPerformed`, `array $results`. File: `domain/Bill/Data/OHB/RevalidationResultData.php`
- [ ] T070 [P] Validator: `FundingBalanceValidator` — checks current funding balance vs diagnosis time. File: `domain/Bill/Validators/OHB/Temporal/FundingBalanceValidator.php`
- [ ] T071 [P] Validator: `FundingPeriodValidator` — checks funding period validity. File: `domain/Bill/Validators/OHB/Temporal/FundingPeriodValidator.php`
- [ ] T072 [P] Validator: `AuthorizationStatusValidator` — checks authorization hasn't expired. File: `domain/Bill/Validators/OHB/Temporal/AuthorizationStatusValidator.php`
- [ ] T073 [P] Validator: `SupplierStatusValidator` — checks supplier hasn't been terminated since diagnosis. File: `domain/Bill/Validators/OHB/Temporal/SupplierStatusValidator.php`
- [ ] T074 [P] Validator: `ServiceEligibilityValidator` — checks service eligibility still valid. File: `domain/Bill/Validators/OHB/Temporal/ServiceEligibilityValidator.php`
- [ ] T075 Hook: Add pre-communication re-validation trigger — before any OhbSubmitterNotification, call `RevalidateBillAction::run($bill, 'pre_communication')`. If context changed, re-run DetermineCommsTypeAction. File: integrate into comms flow from Phase 3
- [ ] T076 Hook: Add post-resolution re-validation trigger — when all BillReasons resolved, call `RevalidateBillAction::run($bill, 'post_resolution')`. File: integrate into reason resolution flow
- [ ] T077 Test: [US4] Funding depleted between diagnosis and communication — new reason added. File: `tests/Feature/OHB/RevalidationTest.php`
- [ ] T078 [P] Test: [US4] Supplier terminated mid-hold — comms type changes to REJECT_PERIOD. File: `tests/Feature/OHB/RevalidationTest.php`
- [ ] T079 [P] Test: Max 5 revalidation loops — 6th attempt returns without running. File: `tests/Feature/OHB/RevalidationTest.php`

---

## Phase 5: OHB — UI (Checklist + Reason Modal) [US1] [US3]

- [ ] T080 TypeScript types: Create `resources/js/types/ohb.ts` — interfaces: `BillReasonData` (id, billId, ohbReasonId, status, diagnosedAt, diagnosedByType, resolvedAt, resolutionNotes, includedInCommunication, taskId, ohbReason: OhbReasonData), `OhbReasonData` (id, code, name, description, departmentOwner, touchesInvoice, requiresInternalAction), `BillOhbStateData` (id, billId, ohbStatus, commsType, cadenceStatus, outcome). File: `resources/js/types/ohb.ts`
- [ ] T081 Component: `BillChecklistPanel.vue` — `<script setup lang="ts">`. Props: `{ reasons: BillReasonData[], ohbState: BillOhbStateData }`. Emits: `{ 'select-reason': [reason: BillReasonData] }`. Computed: group reasons into blocking (status in pending/in_progress/awaiting), complete (resolved), warnings (unresolved). Progress bar: `completionPercent = complete.length / total * 100`. CommonAccordion with 3 sections: BLOCKING (red bg-red-50), COMPLETE (green bg-green-50), WARNINGS (amber bg-amber-50). Each section renders BillReasonItem per reason. Footer: "Updated X ago" display. File: `resources/js/Components/Bill/BillChecklistPanel.vue`
- [ ] T082 [P] Component: `BillReasonItem.vue` — `<script setup lang="ts">`. Props: `{ reason: BillReasonData }`. Emits: `{ click: [reason: BillReasonData] }`. Renders: status icon (CommonIcon — check-circle green / x-circle red / clock amber), reason name, department badge (CommonBadge). Click opens reason modal. File: `resources/js/Components/Bill/BillReasonItem.vue`
- [ ] T083 [P] Component: `BillReasonModal.vue` — `<script setup lang="ts">`. Props: `{ reason: BillReasonData | null, bill: BillData }`. Emits: `{ resolved: [reasonId: number, notes: string], unresolved: [reasonId: number, notes: string], close: [] }`. CommonModal wrapper. CommonDefinitionList with: Status, Diagnosed At, Diagnosed By, Department Owner, Department Action. Resolution notes textarea (CommonTextarea). Mark Resolved / Mark Unresolved buttons (CommonButton). File: `resources/js/Components/Bill/BillReasonModal.vue`
- [ ] T084 Wire EditV2.vue: Add BillChecklistPanel to right panel. Accept `billReasons` and `ohbState` props from controller. Implement Inertia v2 polling: `setInterval(() => router.reload({ only: ['billReasons', 'ohbState'] }), 30000)` with cleanup in `onUnmounted`. Wire reason selection → BillReasonModal open. File: `resources/js/Pages/Bills/EditV2.vue`
- [ ] T085 Controller: In `BillController@edit`, when OHB enabled, add to props: `'billReasons' => BillReasonData::collect($bill->billReasons()->with('ohbReason')->get())`, `'ohbState' => $bill->ohbState ? BillOhbStateData::from($bill->ohbState) : null`. File: `app/Http/Controllers/BillController.php`
- [ ] T086 [P] Data: `BillReasonData` (backend) — extends Data. Properties match TypeScript interface. `#[MapName(SnakeCaseMapper::class)]`. Nested `OhbReasonData` via `#[DataCollectionOf]`. File: `app/Data/Bill/BillReasonData.php`
- [ ] T087 [P] Data: `BillOhbStateData` (backend) — extends Data. Properties match TypeScript interface. File: `app/Data/Bill/BillOhbStateData.php`
- [ ] T088 API: `PATCH /api/bill-reasons/{billReason}` — route + controller method. Accepts `UpdateBillReasonData` (status, resolution_notes). Validates status transition. Updates BillReason. If all reasons resolved → trigger post-resolution revalidation. File: `app/Http/Controllers/Api/BillReasonController.php`
- [ ] T089 [P] Data: `UpdateBillReasonData` — extends Data. `#[Rule('required', 'in:resolved,unresolved')]` status, `#[Rule('nullable', 'string')]` resolution_notes. File: `app/Data/Bill/UpdateBillReasonData.php`
- [ ] T090 [P] Policy: `BillReasonPolicy` — `update(User $user, BillReason $billReason): bool` — user must be bill processor OR department user for the reason's department. File: `app/Policies/BillReasonPolicy.php`

---

## Phase 6: SBS — Inbound Email Infrastructure [US1]

- [ ] T091 Action: `GenerateSupplierInboundTokenAction` — `use AsAction`. `handle(Supplier $supplier): SupplierInboundToken`. Generates unique token via `SupplierInboundToken::generateToken()`, creates record with email_address. Idempotent: if token exists, return existing. File: `domain/Bill/Actions/SBS/GenerateSupplierInboundTokenAction.php`
- [ ] T092 [P] Action: `GeneratePackageEmailAction` — `use AsAction`. `handle(Supplier $supplier, Package $package): SupplierPackageEmail`. `authorize()` — supplier must have relationship with package. Generates token, creates email. File: `domain/Bill/Actions/SBS/GeneratePackageEmailAction.php`
- [ ] T093 Controller: `InboundEmailWebhookController` — no auth middleware. `__invoke(Request $request)`. Validates AWS SNS signature. For SNS SubscriptionConfirmation: auto-confirm. For Notification: extract SES message from S3, parse email, extract recipient token, call ValidateInboundEmailAction, dispatch ProcessInboundEmailJob. File: `app/Http/Controllers/Webhook/InboundEmailWebhookController.php`
- [ ] T094 [P] Route: `POST /webhooks/inbound-email` → InboundEmailWebhookController. No auth middleware, no CSRF. File: `routes/api.php`
- [ ] T095 Action: `ValidateInboundEmailAction` — `use AsAction`. `handle(string $recipientEmail, string $senderEmail, array $attachments): ValidationResultData`. Extracts token from recipient, finds SupplierInboundToken or SupplierPackageEmail, validates sender domain (soft signal per FR-013), checks PDF attachments exist. File: `domain/Bill/Actions/SBS/ValidateInboundEmailAction.php`
- [ ] T096 [P] Data: `ValidationResultData` — properties: `bool $valid`, `?Supplier $supplier`, `?Package $package`, `?string $errorReason`, `array $pdfAttachments`. File: `domain/Bill/Data/SBS/ValidationResultData.php`
- [ ] T097 Job: `ProcessInboundEmailJob` — `implements ShouldQueue`. Constructor: `string $s3Key`, `string $recipientEmail`, `string $senderEmail`. `handle()`: fetch email from S3, extract PDFs, for each PDF: create Bill (source=EMAIL, supplier from token, package if per-client email), log sender email. File: `app/Jobs/SBS/ProcessInboundEmailJob.php`
- [ ] T098 Command: `BackfillSupplierTokensCommand` — `php artisan sbs:backfill-tokens`. Queries all suppliers without inbound token, calls GenerateSupplierInboundTokenAction for each. Shows progress bar. File: `app/Console/Commands/BackfillSupplierTokensCommand.php`
- [ ] T099 Test: [US1] Token generation — supplier gets unique token and email address. File: `tests/Feature/SBS/EmailGenerationTest.php`
- [ ] T100 [P] Test: [US1] Webhook processing — valid email with PDF creates bill. File: `tests/Feature/SBS/InboundEmailWebhookTest.php`
- [ ] T101 [P] Test: [US1] Non-PDF attachment — bill NOT created, auto-reply sent. File: `tests/Feature/SBS/InboundEmailWebhookTest.php`
- [ ] T102 [P] Test: [US1] Domain validation — soft signal, permissive matching. File: `tests/Feature/SBS/InboundEmailWebhookTest.php`

---

## Phase 7: SBS — Supplier Portal UI [US2] [US3] [US4] [US5]

- [ ] T103 Controller: Modify `SupplierDashboardController` — include `inbound_email_address` from supplier's inboundToken relationship (eager load). Wrap in `Feature::active(SbsEmailSubmissionFeature::class)` check. File: find existing SupplierDashboardController
- [ ] T104 Vue: Modify `SupplierDashboard.vue` — add email address card with CommonCopy button. Show only when `inboundEmailAddress` prop is present. File: find existing `Suppliers/Dashboard/SupplierDashboard.vue`
- [ ] T105 [P] Vue: Modify `Suppliers/Bills/Index.vue` — add email address in page header with copy button. File: find existing path
- [ ] T106 Action: `GetSupplierClientsAction` — `use AsAction`. `handle(Supplier $supplier, string $tab = 'all'): LengthAwarePaginator`. Tab queries: 'with_agreements' → supplier on budget items OR has approved bills. 'invoiced' → has submitted bills. 'archived' → inactive packages. 'all' → deduplicated union. Include per-client email if exists. File: `domain/Bill/Actions/SBS/GetSupplierClientsAction.php`
- [ ] T107 Controller: Modify `SupplierClientsController@index` — accept `tab` query param, call GetSupplierClientsAction, return with tab counts. File: find existing SupplierClientsController
- [ ] T108 Vue: Modify `Suppliers/Clients/Index.vue` — add CommonTabs with items: `[{ title: 'All Clients', value: 'all' }, { title: 'With Agreements', value: 'with_agreements' }, { title: 'Invoiced', value: 'invoiced' }, { title: 'Archived', value: 'archived' }]`. Each client row: show email with CommonCopy if exists, "Generate Email" CommonButton if not (calls GeneratePackageEmailAction). File: find existing path
- [ ] T109 Route: `POST /suppliers/{supplier}/clients/{package}/generate-email` → action endpoint for GeneratePackageEmailAction. File: find existing supplier routes file
- [ ] T110 Test: [US4] Client tabs — "With Agreements" shows budget-attached clients. File: `tests/Feature/SBS/SupplierClientTabsTest.php`
- [ ] T111 [P] Test: [US3] Per-client email generation and copy. File: `tests/Feature/SBS/EmailGenerationTest.php`
- [ ] T112 [P] Test: [US2] Dashboard shows email address. File: `tests/Feature/SBS/EmailDisplayTest.php`

---

## Phase 8: SBS — Public Bill Submission Form [US6]

- [ ] T113 Controller: `PublicBillSubmissionController` — no auth. `create()`: render form with services picklist. `store(PublicBillSubmissionData $data)`: validate, match supplier by ABN (MatchSupplierByAbnAction), create bill (source=BillSourceEnum::WEB_FORM), redirect to confirmation. Rate limit: 5/hour per IP. File: `app/Http/Controllers/PublicBillSubmissionController.php`
- [ ] T114 [P] Data: `PublicBillSubmissionData` — extends Data. Properties: `abn` (string, Rule: required|digits:11), `supplier_name` (string, required), `client_name` (string, required), `invoice_files` (array, required|array), `service_type_ids` (array, nullable), `description` (string, nullable), `honeypot` (string, nullable — must be empty). File: `app/Data/Bill/PublicBillSubmissionData.php`
- [ ] T115 [P] Action: `MatchSupplierByAbnAction` — `use AsAction`. `handle(string $abn): ?Supplier`. Queries suppliers by ABN. Returns match or null (flag for manual matching). File: `domain/Bill/Actions/SBS/MatchSupplierByAbnAction.php`
- [ ] T116 Vue page: `Public/Bills/PublicBillCreate.vue` — uses GuestLayout (not AppLayout). `<script setup lang="ts">`. useForm with fields: abn, supplier_name, client_name, invoice_files, service_type_ids, description. CommonInput for text fields, CommonUpload for files, CommonSelectMenu for services. Honeypot hidden field. reCAPTCHA v3 token in hidden field. File: `resources/js/Pages/Public/Bills/PublicBillCreate.vue`
- [ ] T117 [P] Vue page: `Public/Bills/PublicBillConfirmation.vue` — uses GuestLayout. Shows bill reference (#TC-XXXX), "Submit another" link. File: `resources/js/Pages/Public/Bills/PublicBillConfirmation.vue`
- [ ] T118 Routes: `GET /bills` → PublicBillSubmissionController@create, `POST /bills` → PublicBillSubmissionController@store. No auth middleware. Rate limiting middleware. Feature flag: PublicBillFormFeature. File: `routes/web.php` (public routes section)
- [ ] T119 Test: [US6] Public form submission with valid data creates bill. File: `tests/Feature/SBS/PublicBillSubmissionTest.php`
- [ ] T120 [P] Test: [US6] ABN matching — found supplier linked to bill. File: `tests/Feature/SBS/PublicBillSubmissionTest.php`
- [ ] T121 [P] Test: [US6] Rate limiting — 6th submission within hour blocked. File: `tests/Feature/SBS/PublicBillSubmissionTest.php`
- [ ] T122 [P] Test: [US6] Honeypot filled — submission rejected. File: `tests/Feature/SBS/PublicBillSubmissionTest.php`

---

## Phase 9: Integration & Polish

- [ ] T123 E2E test: OHB full flow — submit bill → diagnosis → department routing → resolution → revalidation → payment. File: `tests/Feature/OHB/OhbFullFlowTest.php`
- [ ] T124 [P] E2E test: OHB timeout — submit → diagnosis → cadence Day 0→3→7→10 → auto-reject. File: `tests/Feature/OHB/OhbTimeoutFlowTest.php`
- [ ] T125 [P] E2E test: SBS email → bill creation → OHB diagnosis → processing. File: `tests/Feature/SBS/SbsEmailFlowTest.php`
- [ ] T126 [P] E2E test: Public form → bill creation → processing. File: `tests/Feature/SBS/PublicFormFlowTest.php`
- [ ] T127 Action: `LinkResubmissionAction` — `use AsAction`. `handle(Bill $newBill, Bill $originalBill): void`. Sets BillOhbState.original_bill_id, increments resubmission_count. File: `domain/Bill/Actions/OHB/LinkResubmissionAction.php`
- [ ] T128 [P] Performance: Add eager loading in BillController@edit for OHB data — `$bill->load(['ohbState', 'billReasons.ohbReason'])`. Verify < 50ms. File: `app/Http/Controllers/BillController.php`
- [ ] T129 [P] Migration: Drop `bill_on_hold_reason` column from bills table (only after staging verification). Remove BillReasonObserver dual-write. File: `database/migrations/xxxx_drop_bill_on_hold_reason_column.php`
- [ ] T130 Pint: Run `vendor/bin/pint --dirty` on all changed files. File: all
- [ ] T131 [P] Larastan: Run Larastan on all new files, fix any level-5+ issues. File: all

---

## Summary

| Metric | Count |
|--------|-------|
| **Total tasks** | 131 |
| **Phase 0 (Foundation)** | 8 |
| **Phase 1 (DB + Models)** | 30 |
| **Phase 2 (Diagnosis)** | 15 |
| **Phase 3 (Comms)** | 14 |
| **Phase 4 (Revalidation)** | 12 |
| **Phase 5 (OHB UI)** | 11 |
| **Phase 6 (SBS Email)** | 12 |
| **Phase 7 (SBS Portal UI)** | 10 |
| **Phase 8 (Public Form)** | 10 |
| **Phase 9 (Polish)** | 9 |
| **Parallelizable [P]** | ~70 |
| **OHB track (T001-T090)** | 90 |
| **SBS track (T091-T122)** | 32 |

### Story Coverage

| Story | Tasks |
|-------|-------|
| OHB US1 (Multi-Issue Diagnosis) | T039-T053, T080-T090 |
| OHB US2 (AI Auto-Reject) | T046, T050-T051 |
| OHB US3 (Department Routing) | T047, T052 |
| OHB US4 (Re-validation) | T068-T079 |
| OHB US5 (Three Comms Types) | T054-T056, T061-T063 |
| OHB US6 (Cadence) | T059-T060, T065-T066 |
| OHB US7 (Two Streams) | T057, T067 |
| OHB US8 (Can Coexist) | T055, T064 |
| OHB US9 (Linked Resubmissions) | T127 |
| SBS US1 (Email Submission) | T091-T102 |
| SBS US2 (View Email Address) | T103-T105, T112 |
| SBS US3 (Per-Client Emails) | T092, T108-T109, T111 |
| SBS US4 (Client Tabs) | T106-T108, T110 |
| SBS US5 (Archived Clients) | T108 |
| SBS US6 (Public Form) | T113-T122 |
