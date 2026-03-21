---
title: "Implementation Tasks: Lead to HCA (LTH)"
---

# Implementation Tasks: Lead to HCA (LTH)

**Plan**: [plan.md](plan.md) | **Spec**: [spec.md](spec.md) | **DB Schema**: [db-spec.md](db-spec.md)
**Date**: 2026-02-19 | **Status**: Ready to implement

---

## Phase 1: Foundation (Lead Index + Data + Routing + Step 1)

### P1.1 — Database: Migrations + Models + Enums

**Files**:
- `database/migrations/xxxx_create_lead_conversions_table.php`
- `database/migrations/xxxx_create_lead_conversion_sync_logs_table.php`
- `database/migrations/xxxx_add_state_and_type_to_agreements_table.php`
- `domain/Lead/Models/LeadConversion.php`
- `domain/Lead/Models/LeadConversionSyncLog.php`
- `domain/Lead/Enums/LeadConversionStatusEnum.php`
- `domain/Lead/Enums/LeadRiskOutcomeEnum.php`
- `domain/Lead/Enums/LeadCoordinatorSourceEnum.php`
- `domain/Lead/Enums/LeadConversionSyncTypeEnum.php`
- `domain/Lead/Enums/LeadConversionSyncStatusEnum.php`
- `app/Enums/AgreementStateEnum.php`
- `app/Enums/AgreementTypeEnum.php`
- `app/Operations/BackfillAgreementStateAndTypeOperation.php`

**Tasks**:
- [ ] Create `lead_conversions` migration (schema per db-spec.md — all columns, indexes, foreign keys)
- [ ] Create `lead_conversion_sync_logs` migration (schema per db-spec.md)
- [ ] Create `agreements` ALTER migration (add `state`, `type`, `hold_reasons`, `sent_at` — schema only, no data ops)
- [ ] Create `BackfillAgreementStateAndTypeOperation` (separate from migration — backfill state from signed_at/expired_at)
- [ ] Create `LeadConversion` model with relationships (`lead`, `createdBy`, `coordinator`, `package`, `agreement`, `syncLogs`), casts (JSON, enums, dates), `@property` PHPDoc for lifecycle columns
- [ ] Create `LeadConversionSyncLog` model with relationships, casts
- [ ] Create all 5 conversion enums (SCREAMING_SNAKE_CASE cases)
- [ ] Create `AgreementStateEnum` and `AgreementTypeEnum`
- [ ] Add `conversions()` HasMany and `activeConversion()` HasOne relationships to `Lead` model
- [ ] Add `leadConversion()` HasOne relationship to `Package` model
- [ ] Run migrations, verify schema

**Tests**:
- [ ] Unit: LeadConversion model relationships, casts, enum values
- [ ] Unit: LeadConversionSyncLog model relationships
- [ ] Feature: Migrations create tables with correct columns and indexes

---

### P1.2 — Data Classes

**Files**:
- `domain/Lead/Data/Conversion/LeadConversionData.php`
- `domain/Lead/Data/Conversion/Step1Data.php`

**Tasks**:
- [ ] Create `LeadConversionData` — Main DTO with `#[MapName(SnakeCaseMapper::class)]`, all conversion fields
- [ ] Create `Step1Data` — Lead details form validation (first name, last name, email, phone, DOB, address fields, Zoho reference). Use Laravel Data validation rules.
- [ ] Verify TypeScript types auto-generate into `generated.d.ts` after running transformer

**Tests**:
- [ ] Unit: Step1Data validation rules (required fields, email format, phone format)

---

### P1.3 — Policy + Routes + Controller

**Files**:
- `domain/Lead/Policies/LeadConversionPolicy.php`
- `domain/Lead/Http/Controllers/LeadConversionController.php`
- `domain/Lead/Http/Controllers/LeadIndexController.php`
- `domain/Lead/Routes/leadRoutes.php` (extended)

**Tasks**:
- [ ] Create `LeadConversionPolicy` with `Response::allow()/deny()` pattern:
  - `convert(User, Lead)` — can this user start a conversion?
  - `view(User, LeadConversion)` — can this user view the conversion?
  - `update(User, LeadConversion)` — can this user submit steps?
- [ ] Create `LeadIndexController@index` — Return paginated leads with stats (converted, to-be-converted, in-review, rejected counts)
- [ ] Create `LeadConversionController` with methods:
  - `show(Lead)` — Redirect to current step
  - `step(Lead, int $step)` — Show specific step
  - `submitStep(Lead, int $step)` — Submit step data (delegates to per-step Action)
  - `saveAndExit(Lead)` — Save current step data
- [ ] Register routes in `leadRoutes.php`:
  - `GET /leads` → `LeadIndexController@index` (name: `leads.index`)
  - `GET /leads/{lead}/convert` → show
  - `GET /leads/{lead}/convert/{step}` → step
  - `PUT /leads/{lead}/convert/{step}` → submitStep
  - `POST /leads/{lead}/convert/save-exit` → saveAndExit
- [ ] Add middleware for Sales role access

**Tests**:
- [ ] Feature: LeadConversionPolicy authorization (allowed/denied)
- [ ] Feature: Routes return correct responses

---

### P1.4 — Actions + Zoho Sync (Step 1)

**Files**:
- `domain/Lead/Actions/Conversion/StartLeadConversionAction.php`
- `domain/Lead/Actions/Conversion/SubmitConversionStep1Action.php`
- `domain/Lead/Actions/Conversion/SaveAndExitConversionAction.php`
- `domain/Lead/Jobs/SyncConversionStep1ToZohoJob.php`

**Tasks**:
- [ ] Create `StartLeadConversionAction` — `authorize()` checks policy, `handle()` creates LeadConversion record with status=IN_PROGRESS, current_step=1, pre-populates step_data from Lead's Zoho data
- [ ] Create `SubmitConversionStep1Action` — Validates Step1Data, updates step_data JSON, advances current_step to 2, dispatches `SyncConversionStep1ToZohoJob`
- [ ] Create `SaveAndExitConversionAction` — Saves current form data to step_data JSON without advancing step
- [ ] Create `SyncConversionStep1ToZohoJob`:
  - Creates Contact (Consumer) in Zoho → stores `zoho_consumer_id`
  - Creates Care Plan in Zoho → stores `zoho_care_plan_id`
  - Uses `ShouldBeUnique` for idempotency
  - Uses `$tries = 1` + `ReportableException` pattern
  - Creates `LeadConversionSyncLog` entries for each sync operation
- [ ] Explicit field mapping in all Actions (no `->toArray()` into ORM)

**Tests**:
- [ ] Unit: StartLeadConversionAction creates record with correct defaults
- [ ] Feature: SubmitConversionStep1Action validates, saves, dispatches job
- [ ] Feature: SaveAndExitConversionAction persists step_data without advancing
- [ ] Feature: SyncConversionStep1ToZohoJob creates Zoho records + sync logs

---

### P1.5 — Frontend: Lead Index Page

**Files**:
- `resources/js/Pages/Lead/Index.vue`

**Tasks**:
- [ ] Create `Lead/Index.vue` with `<script setup lang="ts">`:
  - `defineProps<Props>()` with `leads: PaginatedCollection<Domain.Lead.Data.LeadData>`, stats object, filters
  - 4 stats cards (converted, to-be-converted, in-review, rejected) with trend indicators
  - `CommonTable` with columns: name, email, phone, journey stage, status, created date
  - `CommonTableFilter` for stage + status
  - `CommonTableSort` for sortable columns
  - `CommonTablePagination`
  - `CommonTableRowAction` with "Convert Lead" button per row (links to `/leads/{lead}/convert`)
- [ ] Wire up Inertia navigation for "Convert Lead" action

**Tests**:
- [ ] Feature: Lead Index page renders with correct data
- [ ] Feature: Table filtering works (stage, status)

---

### P1.6 — Frontend: Wizard Scaffold + Step 1

**Files**:
- `resources/js/Pages/Lead/Conversion/Index.vue`
- `resources/js/Pages/Lead/Conversion/Steps/Step1LeadDetails.vue`
- `resources/js/Components/Lead/Conversion/ZohoBanner.vue`

**Tasks**:
- [ ] Create `Conversion/Index.vue` — Wizard container:
  - `defineProps<Props>()` with lead, conversion, step definitions
  - `CommonStepNavigation` with 6 steps
  - Single shared `useForm()` with all wizard fields
  - Dynamic step component rendering via `<component :is="...">`
  - URL-driven step navigation (`?step=N`)
  - Back/Continue/Save & Exit buttons
- [ ] Create `Step1LeadDetails.vue`:
  - `defineProps<Props>()` with typed lead + conversion
  - `defineEmits<{ (e: 'next'): void; (e: 'save-exit'): void }>()`
  - Pre-filled form fields from Zoho data (name, email, phone, DOB, address)
  - `ZohoBanner` component at top
  - Form validation feedback
- [ ] Create `ZohoBanner.vue` — "From Zoho CRM" info banner with external link
- [ ] Wire up form submission → `PUT /leads/{lead}/convert/1`
- [ ] Wire up Save & Exit → `POST /leads/{lead}/convert/save-exit`

**Tests**:
- [ ] Feature: Wizard loads with correct step, form pre-fills from lead data
- [ ] Feature: Step 1 submission advances to Step 2
- [ ] Feature: Save & Exit persists form data

---

## Phase 2: Package Details + ACAT Extraction (Steps 2-3)

### P2.1 — Backend: Step 2 (Package Details)

**Files**:
- `domain/Lead/Data/Conversion/Step2Data.php`
- `domain/Lead/Actions/Conversion/SubmitConversionStep2Action.php`
- `domain/Lead/Jobs/SyncConversionStep2ToZohoJob.php`

**Tasks**:
- [ ] Create `Step2Data` — Referral code, management option (SM/SM+), financial status, primary/secondary/tertiary classifications, commencement date, cessation date, HCA recipients
- [ ] Create `SubmitConversionStep2Action` — Validates Step2Data, saves to step_data, advances to step 3, dispatches sync
- [ ] Create `SyncConversionStep2ToZohoJob` — Update Consumer with package details in Zoho

**Tests**:
- [ ] Unit: Step2Data validation (referral code required, dates valid, management option enum)
- [ ] Feature: Submit Step 2 with sync job dispatched

---

### P2.2 — Backend: Step 3 (ACAT Extraction)

**Files**:
- `domain/Lead/Data/Conversion/Step3Data.php`
- `domain/Lead/Actions/Conversion/ExtractAcatDataAction.php`
- `domain/Lead/Actions/Conversion/SubmitConversionStep3Action.php`
- `domain/Lead/Jobs/SyncConversionStep3ToZohoJob.php`
- `domain/Lead/Services/AcatExtractionService.php`

**Tasks**:
- [ ] Create `AcatExtractionService` — HTTP client for ACAT/IAT extraction API (endpoint, auth, request/response mapping)
- [ ] Create `ExtractAcatDataAction` — Calls extraction service with referral code, returns extracted data or error
- [ ] Create `Step3Data` — Extraction result fields + manual entry fields + IAT document upload
- [ ] Create `SubmitConversionStep3Action` — Validates Step3Data (extraction or manual), saves, advances to step 4, dispatches sync
- [ ] Create `SyncConversionStep3ToZohoJob` — Update Care Plan with ACAT data + upload IAT document to Zoho

**Tests**:
- [ ] Unit: AcatExtractionService mock (success/failure/timeout)
- [ ] Feature: Extraction success path, extraction failure → manual fallback, IAT upload

---

### P2.3 — Frontend: Steps 2-3

**Files**:
- `resources/js/Pages/Lead/Conversion/Steps/Step2PackageDetails.vue`
- `resources/js/Pages/Lead/Conversion/Steps/Step3AcatExtraction.vue`
- `resources/js/Components/Lead/Conversion/ExtractionStatusCard.vue`
- `resources/js/Components/Lead/Conversion/HcaRecipientList.vue`

**Tasks**:
- [ ] Create `Step2PackageDetails.vue`:
  - Package details form (referral code, management option dropdown, financial status, classifications)
  - Secondary/tertiary classification checkboxes
  - Key dates (CommonDatePicker)
  - HCA recipient section using `HcaRecipientList` component
- [ ] Create `Step3AcatExtraction.vue`:
  - Auto extraction panel (referral code display + "Extract Data" button)
  - `ExtractionStatusCard` for loading/success/failed states
  - Manual fallback form (classification fields + upload)
  - IAT document upload (CommonUpload, required)
- [ ] Create `ExtractionStatusCard.vue` — Loading spinner, success checkmark, failure with retry
- [ ] Create `HcaRecipientList.vue` — Contact list with checkboxes for HCA recipient selection

**Tests**:
- [ ] Feature: Step 2 form renders with correct fields, submits to backend
- [ ] Feature: Step 3 extraction trigger, manual fallback display

---

## Phase 3: Screening + Risk Assessment (Steps 4-5)

### P3.1 — Backend: Step 4 (Screening Questions)

**Files**:
- `domain/Lead/Data/Conversion/Step4Data.php`
- `domain/Lead/Actions/Conversion/SubmitConversionStep4Action.php`

**Tasks**:
- [ ] Create `Step4Data` — Yes/No screening question answers + provider count + reason for switching (conditional)
- [ ] Create `SubmitConversionStep4Action` — Validates screening answers, saves to step_data, advances to step 5 (no Zoho sync for this step)

**Tests**:
- [ ] Unit: Step4Data validation (all questions required, provider count numeric)
- [ ] Feature: Submit Step 4 advances to Step 5

---

### P3.2 — Backend: Step 5 (Risk Assessment)

**Files**:
- `domain/Lead/Data/Conversion/Step5Data.php`
- `domain/Lead/Actions/Conversion/CalculateScreeningResultAction.php`
- `domain/Lead/Actions/Conversion/SubmitConversionStep5Action.php`
- `domain/Lead/Jobs/SyncConversionStep5ToZohoJob.php`
- `config/lead-screening.php` (or similar — rules config)

**Tasks**:
- [ ] Create `CalculateScreeningResultAction` — Config-driven risk scoring algorithm:
  - Inputs: ACAT data (Step 3) + screening answers (Step 4)
  - Outputs: outcome (SUITABLE / CLINICAL_ATTENTION / NOT_SUITED), score (0-100), confidence (0-100), risk flags
  - Rules: previously offboarded → flag, high risk → Clinical Attention, SM+ required by risk → flag
- [ ] Create screening rules config (config-driven, not hardcoded)
- [ ] Create `Step5Data` / `ScreeningResultData` — Result confirmation
- [ ] Create `SubmitConversionStep5Action` — Saves risk outcome, score, confidence, flags to conversion record, dispatches sync
- [ ] Create `SyncConversionStep5ToZohoJob` — Update Care Plan with risk outcome in Zoho

**Tests**:
- [ ] Unit: CalculateScreeningResultAction — all outcome paths (suitable, clinical attention, not suited), edge cases
- [ ] Unit: Risk scoring with different ACAT + screening combinations
- [ ] Feature: Step 5 displays result, submit confirms and syncs

---

### P3.3 — Frontend: Steps 4-5

**Files**:
- `resources/js/Pages/Lead/Conversion/Steps/Step4ScreeningQuestions.vue`
- `resources/js/Pages/Lead/Conversion/Steps/Step5ScreeningResult.vue`
- `resources/js/Components/Lead/Conversion/ScreeningResultCard.vue`
- `resources/js/Components/Lead/Conversion/ConversionSummaryCard.vue`

**Tasks**:
- [ ] Create `Step4ScreeningQuestions.vue`:
  - Yes/No radio groups (CommonRadioGroup) for each screening question
  - Conditional fields (reason for switching dropdown)
  - Progress indicator showing questions answered
- [ ] Create `Step5ScreeningResult.vue`:
  - `ScreeningResultCard` — color-coded result (green=Approved, yellow=Clinical Attention, red=Not Suited)
  - Risk score, confidence %, assessment date display
  - Risk flags list with explanations
  - `ConversionSummaryCard` — read-only summary of Steps 1-3 data
  - Management option compatibility warning (if SM but risk requires SM+)
  - "Not Suited" → no Continue button, conversion summary + return to leads
- [ ] Create `ScreeningResultCard.vue` — Outcome display with score/confidence/flags
- [ ] Create `ConversionSummaryCard.vue` — Read-only summary of lead + package details

**Tests**:
- [ ] Feature: Step 4 form renders all questions, submits answers
- [ ] Feature: Step 5 displays correct result for each outcome path
- [ ] Feature: Not Suited blocks progression to Step 6

---

## Phase 4: Agreement + Coordinator + Completion (Step 6)

### P4.1 — Backend: Agreement Generation + Coordinator Resolution

**Files**:
- `domain/Lead/Data/Conversion/Step6Data.php`
- `domain/Lead/Actions/Conversion/SubmitConversionStep6Action.php`
- `domain/Lead/Actions/Conversion/CheckMonashModelRemotenessAction.php`
- `domain/Lead/Actions/Conversion/ResolveDefaultCoordinatorAction.php`
- `domain/Lead/Actions/Conversion/GenerateHcaAgreementAction.php`
- `resources/views/pdf/agreements/v1/hca-agreement.blade.php`

**Tasks**:
- [ ] Create `Step6Data` — Coordinator source, coordinator ID (nullable), coordination fee, confirmation flags
- [ ] Create `SubmitConversionStep6Action` — Saves coordinator + agreement data, determines is_signable, updates hold_reasons
- [ ] Create `CheckMonashModelRemotenessAction` — Postcode lookup → remoteness classification (config or DB table)
- [ ] Create `ResolveDefaultCoordinatorAction` — TC Internal default assignment or BD pipeline pre-population
- [ ] Create `GenerateHcaAgreementAction` — Blade template → agreement body (Spatie LaravelPdf pattern matching existing Supplier agreement)
- [ ] Create HCA Blade template (`hca-agreement.blade.php`) — Agreement body with coordination fee section, cooling off info, consumer details

**Tests**:
- [ ] Unit: CheckMonashModelRemotenessAction with various postcodes
- [ ] Unit: ResolveDefaultCoordinatorAction (TC Internal, BD pipeline)
- [ ] Unit: GenerateHcaAgreementAction produces correct HTML
- [ ] Unit: is_signable determination logic

---

### P4.2 — Backend: Send + Complete Actions

**Files**:
- `domain/Lead/Actions/Conversion/SendAgreementAction.php`
- `domain/Lead/Actions/Conversion/CompleteNotSignableConversionAction.php`
- `domain/Lead/Actions/Conversion/CreatePackageFromConversionAction.php`
- `domain/Lead/Actions/Conversion/CreateDealInZohoAction.php`
- `domain/Lead/Actions/Conversion/SendPortalInvitationAction.php`
- `domain/Lead/Jobs/SyncConversionStep6ToZohoJob.php`
- `domain/Lead/Jobs/SyncConversionCompletionToZohoJob.php`

**Tasks**:
- [ ] Create `SendAgreementAction` — Orchestrates the signable completion path:
  1. Create Package via `CreatePackageFromConversionAction` (stage=ON_BOARDING)
  2. Create Agreement (state=Sent, type=HCA, agreementable=Package)
  3. Dispatch Zoho sync (Create Deal, update Care Plan)
  4. Send portal invite via `SendPortalInvitationAction`
  5. Mark conversion COMPLETED, set completed_at
- [ ] Create `CompleteNotSignableConversionAction` — Not-signable completion path:
  1. Create Package via `CreatePackageFromConversionAction` (stage=ON_BOARDING)
  2. Create Agreement (state=Draft, type=HCA, hold_reasons=JSON)
  3. Dispatch Zoho sync (Create Deal)
  4. No portal invite
  5. Mark conversion COMPLETED, set completed_at
- [ ] Create `CreatePackageFromConversionAction` — Explicit field mapping from LeadConversion → Package (stage=ON_BOARDING, package_option, coordinator, fee, dates)
- [ ] Create `CreateDealInZohoAction` — Creates Deal record in Zoho CRM
- [ ] Create `SendPortalInvitationAction` — Uses `UpdateAndInviteUserFromPackageContact` pattern (creates user + Recipient Rep role + WelcomeNewUserNotification)
- [ ] Create `SyncConversionStep6ToZohoJob` — Update Care Plan with coordinator data
- [ ] Create `SyncConversionCompletionToZohoJob` — Create Deal, sync agreement status, final sync

**Tests**:
- [ ] Feature: SendAgreementAction creates Package (ON_BOARDING) + Agreement (Sent) + dispatches sync + sends invite
- [ ] Feature: CompleteNotSignableConversionAction creates Package + Agreement (Draft, with hold_reasons) + no invite
- [ ] Unit: CreatePackageFromConversionAction maps fields correctly (explicit mapping, no toArray)
- [ ] Feature: Portal invitation sends WelcomeNewUserNotification

---

### P4.3 — Frontend: Step 6 (Agreement + Coordinator)

**Files**:
- `resources/js/Pages/Lead/Conversion/Steps/Step6Agreement.vue`
- `resources/js/Components/Lead/Conversion/CoordinatorSelector.vue`
- `resources/js/Components/Lead/Conversion/AgreementPreview.vue`
- `resources/js/Components/Lead/Conversion/HoldReasonsBanner.vue`

**Tasks**:
- [ ] Create `Step6Agreement.vue`:
  - Coordinator section (visible only when management_option = SM+):
    - Coordination type radio: TC Internal vs External
    - If External → `CoordinatorSelector` component
    - Fee auto-populates from selected coordinator
    - BD pipeline → locked display
    - "I don't know" → sets not-signable
  - Signable path: HCA recipient list, `AgreementPreview`, cooling off info, "Send Agreement" button
  - Not-signable path: `HoldReasonsBanner`, conversion summary, "Complete Conversion" button
- [ ] Create `CoordinatorSelector.vue`:
  - Searchable dropdown (CommonSelectMenu with async coordinator search)
  - Fee display per coordinator (auto-populates coordination_fee)
  - "I don't know" option at bottom
- [ ] Create `AgreementPreview.vue` — Agreement body preview with coordination fee section
- [ ] Create `HoldReasonsBanner.vue` — Clinical/coordinator hold reasons with colored banner

**Tests**:
- [ ] Feature: SM path hides coordinator section
- [ ] Feature: SM+ path shows coordinator selector
- [ ] Feature: Send Agreement button triggers signable path
- [ ] Feature: Complete button triggers not-signable path

---

## Phase 5: Polish + Edge Cases

### P5.1 — Save & Exit Resume Flow

**Tasks**:
- [ ] Implement resume logic in `LeadConversionController` — Load step_data JSON back into wizard form state
- [ ] Frontend: Resume flow pre-fills form from saved step_data
- [ ] Handle abandoned conversions (new conversion replaces abandoned one)

**Tests**:
- [ ] Feature: Start conversion → save & exit → resume → form pre-filled at correct step

---

### P5.2 — Packages Index Update

**Tasks**:
- [ ] Update `PackageController@index` — Add agreement status column + filter (FR-039)
- [ ] Frontend: Packages index shows agreement status badge + filter

**Tests**:
- [ ] Feature: Packages index shows agreement status, filter works

---

### P5.3 — Zoho Sync Edge Cases

**Tasks**:
- [ ] All Zoho sync jobs use `ShouldBeUnique` + `$tries = 1` + `ReportableException` pattern
- [ ] Extraction timeout handling (graceful failure → manual fallback)
- [ ] Duplicate prevention (idempotent sync operations using `updateOrCreate` where appropriate)
- [ ] Sync failure recovery: all sync attempts logged to `lead_conversion_sync_logs`

**Tests**:
- [ ] Feature: Zoho sync failure logs to sync_logs with error
- [ ] Feature: Duplicate sync is idempotent

---

## Phase 6: Feature Flag + Integration Testing

### P6.1 — Feature Flag

**Tasks**:
- [ ] Create feature flag: `lead-to-hca-conversion` in PostHog
- [ ] Gate all LTH routes behind `Feature::active('lead-to-hca-conversion')`
- [ ] Gate frontend navigation behind flag check
- [ ] Add feature flag test using `RelationshipIntelligence::class` pattern (class reference, not string)

**Tests**:
- [ ] Feature: Routes blocked when flag disabled
- [ ] Feature: Routes accessible when flag enabled

---

### P6.2 — Full Integration Tests

**Tasks**:
- [ ] Integration test: Complete conversion — signable, SM path (no coordinator)
- [ ] Integration test: Complete conversion — signable, SM+ with TC Internal coordinator
- [ ] Integration test: Complete conversion — signable, SM+ with External coordinator
- [ ] Integration test: Complete conversion — not-signable, clinical hold
- [ ] Integration test: Complete conversion — not-signable, coordinator unknown
- [ ] Integration test: Save & exit + resume full flow
- [ ] Integration test: All Zoho sync points fire correctly

---

### P6.3 — Gate 4 Preparation

**Tasks**:
- [ ] Run `vendor/bin/pint --dirty` on all new/modified PHP files
- [ ] TypeScript audit: All Vue components use `<script setup lang="ts">`, `defineProps<Props>()`, typed emits
- [ ] No `any` types in new Vue components
- [ ] No `@ts-ignore` comments
- [ ] All Data classes use `#[MapName(SnakeCaseMapper::class)]`
- [ ] All Actions use `AsAction` trait with `authorize()` method
- [ ] All Policies return `Response::allow()/deny()`, no bare bool
- [ ] No junk files in commit
- [ ] Run `php artisan test --compact` — full suite passes
- [ ] Run `npm run build` — no build errors
- [ ] PR description with what changed, how to test, dev notes

---

## Task Summary

| Phase | Tasks | Focus |
|-------|-------|-------|
| P1 | 6 groups, ~40 items | Foundation: DB, models, routes, Lead Index, Step 1 |
| P2 | 3 groups, ~15 items | Steps 2-3: Package details, ACAT extraction |
| P3 | 3 groups, ~15 items | Steps 4-5: Screening, risk assessment |
| P4 | 3 groups, ~20 items | Step 6: Agreement, coordinator, completion |
| P5 | 3 groups, ~10 items | Polish: resume, packages update, sync edge cases |
| P6 | 3 groups, ~15 items | Feature flag, integration tests, Gate 4 |

**Recommended implementation order**: P1.1 → P1.2 → P1.3 → P1.4 → P1.5 → P1.6 → P2.1 → P2.2 → P2.3 → P3.1 → P3.2 → P3.3 → P4.1 → P4.2 → P4.3 → P5.1 → P5.2 → P5.3 → P6.1 → P6.2 → P6.3

Each group can be a PR or batch of commits. Groups within a phase can be parallelized where backend/frontend are independent.
