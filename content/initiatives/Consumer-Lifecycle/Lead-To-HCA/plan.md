---
title: "Implementation Plan: Lead to HCA (LTH)"
---

# Implementation Plan: Lead to HCA (LTH)

**Branch**: `feat/lth-lead-to-hca` | **Date**: 2026-02-19 | **Spec**: [spec.md](spec.md)
**Design**: [design.md](design.md) | **Figma**: [LTH Figma](https://www.figma.com/design/K6vAYVuoJAUTZauqbeQcM9/-LTH----Lead-to-HCA?node-id=0-1)
**Status**: Draft

---

## Summary

Build a 6-step conversion wizard that transforms a Zoho Lead into a Portal Package with an associated Home Care Agreement. Portal becomes the source of truth during conversion, syncing back to Zoho after each step. The wizard combines automated ACAT/IAT extraction, screening questions, risk scoring, and agreement generation into a single guided flow. Coordinator selection is handled within the Agreement step for Self-Managed Plus packages only.

**Key architectural decisions**:
- Extend the existing `Lead` domain with a `Conversion` subdomain
- Use the existing `Package`, `Agreement`, and `CareCoordinator` models
- Follow existing Zoho sync patterns (webhooks in, jobs out)
- Use `CommonStepNavigation` + dynamic Vue components for the wizard UI
- URL-driven steps matching the existing Lead edit pattern (`?step=N`)
- Single shared `useForm()` across all steps (matches Lead Edit pattern)
- Create Package in "Pending" state on HCA Send; activates when HCA is signed (Client-HCA alignment)
- Use Client-HCA agreement state model (Draft → Sent → Signed → Terminated) from the start
- Portal invitation via `UpdateAndInviteUserFromPackageContact` pattern (creates user + Recipient Rep role)

---

## Technical Context

**Language/Version**: PHP 8.3 / Laravel 12
**Frontend**: Vue 3 + Inertia.js v2 + TypeScript + Tailwind CSS v3
**Database**: MySQL
**Queue**: Redis + Laravel Horizon
**Testing**: Pest v3 (unit + feature)
**External**: Zoho CRM API (via `asad/laravel-zoho-api-wrapper`), ACAT/IAT extraction service

**Key Dependencies**:
- `domain/Lead/` — Existing Lead model, actions, Zoho sync
- `domain/Package/` — Existing Package model (34K+ bytes, 120+ properties, 40+ relations)
- `app/Models/Agreement.php` — Polymorphic agreements with HasAgreements trait
- `app/Models/Organisation/CareCoordinator.php` — Coordinator with fee schedules, searchable
- `app/ThirdPartyServices/ZohoService.php` — Zoho API wrapper (fetch, insert, update, bulk)
- `CommonStepNavigation.vue` — Reka-ui stepper (existing pattern for multi-step forms)

**Performance Goals**: Wizard completion < 10 minutes, Zoho sync < 5 seconds per step
**Constraints**: Zoho API rate limits, ACAT extraction service availability, coordinator database completeness

---

## Constitution Check

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Majestic Monolith | PASS | All code in domain modules, no microservices |
| II. Domain-Driven Design | PASS | Extend Lead domain, use Package/Agreement/CareCoordinator domains |
| III. Convention Over Configuration | PASS | Follow existing Lead edit wizard pattern, Laravel conventions |
| IV. Code Quality Standards | PASS | Type-safe DTOs, typed actions, explicit returns |
| V. Testing is First-Class | PASS | Pest tests per phase, >90% logic coverage target |
| VI. Event Sourcing | N/A | Not audit-critical for MVP; standard Eloquent sufficient. Consider for V2 if audit trail needed |
| VII. Laravel Data for DTOs | PASS | Data classes with SnakeCaseMapper for all step data |
| VIII. Action Classes | PASS | One action per use case (ConvertLeadStep1Action, etc.) |
| IX. Services Australia | N/A | Zoho integration, not SA |
| X. Inertia + Vue + TS | PASS | Wizard pages with typed props and useForm |
| XI. Component Library | PASS | Reuse CommonStepNavigation, CommonFormField, CommonSelectMenu, etc. |
| XII. Design System | PASS | Tailwind, accessible, keyboard navigable |
| XIII. Progress Over Perfection | PASS | MVP scope defined, future phases for LES/LDS/Client HCA |
| XIV. Feature Flags | PASS | Feature flag for wizard rollout |
| XV. Permissions | PASS | Sales role gating via policy |
| XVI. Compliance & Audit | PASS | Soft deletes, activity logging, agreement versioning |

---

## Wizard Flow (6 Steps)

```
Step 1: Lead Details          → Confirm/edit Zoho data → Sync #1: Create Consumer + Care Plan
Step 2: Package Details       → MAC details, classifications, dates, HCA recipients → Sync #2
Step 3: ACAT/IAT Extraction   → Auto-extract or manual upload + field entry
Step 4: Screening Questions   → Yes/No eligibility questions → Generate risk score
Step 5: Screening Result      → Display outcome (Approved/Rejected/SM+ Only) → Sync #3
Step 6: Agreement             → Review + Send (signable) or Complete (not-signable) → Sync #4: Create Package + Deal
```

**Step 5 → Step 6 routing**:
- Approved (SM) → Step 6 Agreement (signable, no coordinator section)
- Approved (SM+) → Step 6 Agreement with **coordinator section** (must resolve before sending)
- Rejected (Not Suited) → STOP (no Step 6)
- Clinical Attention → Step 6 Agreement (not-signable, clinical hold)

**Coordinator flow (SM+ only, within Step 6)**:
The coordinator section appears as a required section within the Agreement step ONLY when management option = Self-Managed Plus. Flow:
1. Choose coordination type: **TC Internal** vs **External Coordinator**
2. If External → searchable coordinator dropdown (from CareCoordinator database)
3. Fee auto-populates from the selected coordinator's fee schedule
4. If coordinator can't be determined (remote area / "I don't know") → agreement becomes not-signable
5. Once coordinator is resolved → agreement body includes coordination fee → can send

This keeps the wizard at **6 steps** (not 7) and avoids an empty step for SM packages.

---

## Design Decisions

### Data Model

#### New Models

**LeadConversion** — Tracks wizard state and per-step data:
```
lead_conversions
├── id (PK)
├── uuid (unique)
├── lead_id (FK → leads)
├── created_by (FK → users, the Sales rep)
├── status (enum: IN_PROGRESS, COMPLETED, ABANDONED)
├── current_step (int, 1-6)
├── step_data (JSON — per-step form data, persisted on save & exit)
├── risk_outcome (enum: SUITABLE, CLINICAL_ATTENTION, NOT_SUITED, null)
├── risk_score (decimal, null)
├── risk_confidence (decimal, null)
├── risk_assessment_date (date, null)
├── risk_flags (JSON array, null)
├── coordinator_id (FK → care_coordinators, null)
├── coordinator_source (enum: TC_INTERNAL, BD_PIPELINE, MANUAL_OVERRIDE, UNKNOWN, null)
├── coordination_fee (decimal, null)
├── is_signable (boolean, default true)
├── hold_reasons (JSON array, null)
├── zoho_consumer_id (string, null — set after Sync #1)
├── zoho_care_plan_id (string, null — set after Sync #1)
├── zoho_deal_id (string, null — set after Sync #5)
├── package_id (FK → packages, null — set after Sync #5)
├── agreement_id (FK → agreements, null — set after Sync #5)
├── completed_at (timestamp, null)
├── timestamps
├── soft_deletes
```

**LeadConversionSyncLog** — Tracks each Zoho sync attempt:
```
lead_conversion_sync_logs
├── id (PK)
├── lead_conversion_id (FK)
├── step (int)
├── sync_type (enum: CREATE_CONSUMER, UPDATE_CONSUMER, CREATE_CARE_PLAN, UPDATE_CARE_PLAN, CREATE_DEAL, etc.)
├── zoho_module (string)
├── zoho_record_id (string, null)
├── payload (JSON)
├── response (JSON, null)
├── status (enum: PENDING, SUCCESS, FAILED, RETRYING)
├── error_message (text, null)
├── attempts (int, default 0)
├── timestamps
```

#### Extended Models

**Lead** — Add relationship:
```php
public function conversions(): HasMany → LeadConversion
public function activeConversion(): HasOne → LeadConversion (where status = IN_PROGRESS)
```

**Package** — Add relationship:
```php
public function leadConversion(): HasOne → LeadConversion
```

#### Enums

```php
// New enums in domain/Lead/Enums/
LeadConversionStatusEnum: IN_PROGRESS, COMPLETED, ABANDONED
LeadRiskOutcomeEnum: SUITABLE, CLINICAL_ATTENTION, NOT_SUITED
LeadCoordinatorSourceEnum: TC_INTERNAL, BD_PIPELINE, MANUAL_OVERRIDE, UNKNOWN
LeadConversionSyncTypeEnum: CREATE_CONSUMER, UPDATE_CONSUMER, CREATE_CARE_PLAN, ...
LeadConversionSyncStatusEnum: PENDING, SUCCESS, FAILED, RETRYING
AgreementStatusEnum: DRAFT, SENT, NOT_SIGNABLE, SIGNED, TERMINATED
```

### API Contracts

All routes under `leads/{lead}/conversion/` prefix, authenticated with Sales permission.

| Method | Route | Action | Zoho Sync |
|--------|-------|--------|-----------|
| GET | `leads/{lead}/convert` | Show wizard (redirect to current step) | — |
| GET | `leads/{lead}/convert/{step}` | Show specific step | — |
| PUT | `leads/{lead}/convert/1` | Submit Step 1 | Create Consumer + Care Plan |
| PUT | `leads/{lead}/convert/2` | Submit Step 2 | Update Consumer + Care Plan |
| POST | `leads/{lead}/convert/3/extract` | Trigger ACAT extraction | — |
| PUT | `leads/{lead}/convert/3` | Submit Step 3 (manual or confirm extraction) | Update Care Plan |
| PUT | `leads/{lead}/convert/4` | Submit Step 4 (screening answers) | — |
| GET | `leads/{lead}/convert/5` | Calculate & display screening result | — |
| PUT | `leads/{lead}/convert/5` | Confirm screening result | Update Care Plan (risk) |
| PUT | `leads/{lead}/convert/6` | Submit Step 6 (agreement + coordinator if SM+) | Update Care Plan (coordinator) |
| POST | `leads/{lead}/convert/6/send` | Send agreement (signable) | Create Package + Deal + Invite |
| POST | `leads/{lead}/convert/6/complete` | Complete (not-signable) | Create Package + Deal (no invite) |
| POST | `leads/{lead}/convert/save-exit` | Save & exit any step | — |

### UI Components

**New Pages** (in `resources/js/Pages/Lead/Conversion/`):
```
Index.vue              — Wizard container + CommonStepNavigation
Steps/
├── Step1LeadDetails.vue
├── Step2PackageDetails.vue
├── Step3AcatExtraction.vue
├── Step4ScreeningQuestions.vue
├── Step5ScreeningResult.vue
└── Step6Agreement.vue          — Agreement + Coordinator section (SM+ only)
```

**New Components** (in `resources/js/Components/Lead/Conversion/`):
```
ZohoBanner.vue                — "From Zoho CRM" info banner with link back
ExtractionStatusCard.vue      — Loading/success/failed extraction states
ScreeningResultCard.vue       — Approved/Rejected/SM+ result display with scores
CoordinatorSelector.vue       — Searchable coordinator dropdown with fee display
AgreementPreview.vue          — Agreement body preview with cooling off info
HcaRecipientList.vue          — Contact selection list with checkboxes
ConversionSummaryCard.vue     — Summary of conversion data (shown in Steps 5-6)
HoldReasonsBanner.vue         — Not-signable hold reasons display
```

**Reused Common Components**:
- `CommonStepNavigation` — 6-step stepper
- `CommonForm` + `CommonFormField` — Form structure with error injection
- `CommonInput` — Text fields (lead name, referral code, etc.)
- `CommonSelectMenu` — Dropdowns (management option, financial status, classification, coordinator)
- `CommonRadioGroup` — Yes/No screening questions
- `CommonDatePicker` — Commencement/cessation dates
- `CommonCheckbox` — HCA recipient selection
- `CommonUpload` — IAT document upload
- `CommonAlert` — Info/warning/error banners
- `CommonButton` — Navigation (Back, Continue, Convert Lead, Send Agreement)

### Vue TypeScript Standards

All new Vue components use `<script setup lang="ts">`. Types are auto-generated from PHP Data classes into `resources/js/types/generated.d.ts` using the namespace convention `Domain.Lead.Data.*`.

**Key type references** (auto-generated from backend Data classes):
- `Domain.Lead.Data.LeadData` — Lead entity
- `Domain.Lead.Data.Conversion.LeadConversionData` — Conversion state
- `Domain.Lead.Data.Conversion.Step1Data` through `Step6Data` — Per-step form shapes
- `App.Data.CareCoordinator.CareCoordinatorData` — Coordinator entity
- `App.Data.AgreementData` — Agreement entity
- `Domain.Lead.Enums.*` — All conversion-related enums

**Page props pattern** (all pages follow this):
```typescript
// Conversion/Index.vue
interface Props {
    lead: Domain.Lead.Data.LeadData;
    conversion: Domain.Lead.Data.Conversion.LeadConversionData;
    steps: Domain.Lead.Data.Conversion.StepDefinition[];
}
const props = defineProps<Props>();
```

**Step component props** (all step components):
```typescript
// Steps/Step1LeadDetails.vue
interface Props {
    lead: Domain.Lead.Data.LeadData;
    conversion: Domain.Lead.Data.Conversion.LeadConversionData;
}
const props = defineProps<Props>();
const emit = defineEmits<{
    (e: 'next'): void;
    (e: 'save-exit'): void;
}>();
```

**Shared form** — `useForm()` is typed via the auto-generated Data class shapes. The form object contains all wizard fields and is passed to step components via `v-model:form`.

**No `any` types** — All backend data shapes have auto-generated TypeScript interfaces. The `inertia-modal` package uses `resources/js/inertia-modal.d.ts` declarations (existing pattern).

### Authorization Pattern

`LeadConversionPolicy` uses `Response::allow()` / `Response::deny('reason')` pattern (never bare `bool`). Authorization lives in Action `authorize()` methods, not in `handle()` or `asController()`.

```php
// LeadConversionPolicy — Response objects, default deny
public function convert(User $user, Lead $lead): Response
{
    if ($user->hasPermission('convert-leads')) {
        return Response::allow();
    }
    return Response::deny('You do not have permission to convert leads.');
}
```

### DTO Persistence

All ORM `create()`/`update()` calls use **explicit field mapping** — no `->toArray()` from DTOs into Eloquent. Actions map Data class properties to model fields individually.

### Semantic Column Documentation

New models (`LeadConversion`, `LeadConversionSyncLog`) will include `@property` PHPDoc blocks documenting lifecycle columns:
- `status` — conversion state, what transitions it
- `current_step` — wizard position, what advances it
- `risk_outcome` — screening result, what sets it
- `is_signable` — agreement readiness, what conditions affect it
- `coordinator_source` — how coordinator was determined

### Migration Data Separation

The `agreements` table migration (adding `state`, `type`, `hold_reasons`, `sent_at`) is **schema-only**. The backfill logic (inferring state from `signed_at`/`expired_at`) will be a **separate Operation** class, not embedded in the migration.

---

## Implementation Phases

### Phase 1: Foundation (Lead Index + Data + Routing + Step 1)

**Goal**: Lead Index page + wizard scaffold + Step 1 working end-to-end with Zoho sync.

**Backend**:
1. Create `LeadIndexController` (or extend existing `LeadController`):
   - Index page with stats cards (leads converted, to be converted, in review, rejected — with trends)
   - Filterable/sortable leads table (name, email, phone, journey stage, status, created, actions)
   - Filters: stage, status
   - "Convert Lead" action per row → starts conversion wizard
2. Create migration for `lead_conversions` table
3. Create migration for `lead_conversion_sync_logs` table
4. Create `LeadConversion` model with relationships, casts, enums
5. Create `LeadConversionSyncLog` model
6. Create enums: `LeadConversionStatusEnum`, `LeadRiskOutcomeEnum`, etc.
7. Create Data classes:
   - `LeadConversionData` (main DTO)
   - `Step1Data` (lead details form validation)
8. Create Actions:
   - `StartLeadConversionAction` — Creates LeadConversion record
   - `SubmitConversionStep1Action` — Validates, saves step data, triggers Zoho sync
   - `SaveAndExitConversionAction` — Saves current step data, marks INCOMPLETE
9. Create `SyncConversionStep1ToZohoJob` — Creates Consumer + Care Plan in Zoho
10. Create `LeadConversionController` with show/step/submit routes
11. Create `LeadConversionPolicy` — Sales role authorization
12. Register routes in `leadRoutes.php`

**Frontend**:
1. Create `Lead/Index.vue` — Lead Index page:
   - Stats cards (4 KPI cards with trends) using existing Common stat components
   - `CommonTable` with columns: name, email, phone, journey stage, status, created date
   - `CommonTableFilter` for stage + status filtering
   - `CommonTableSort` for column sorting
   - `CommonTablePagination` for pagination
   - `CommonTableRowAction` for "Convert Lead" button per row
2. Create `Conversion/Index.vue` — Wizard container with CommonStepNavigation
3. Create `Steps/Step1LeadDetails.vue` — Pre-filled form from Zoho data
4. Create `ZohoBanner.vue` — "From Zoho CRM" banner with link
5. Wire up single shared `useForm()` with ALL wizard fields (passed via `v-model:form` to step components — matches Lead Edit pattern)
6. Implement navigation (Convert Lead → Step 2)
7. Implement Save & Exit flow

**Tests**:
- Unit: LeadConversion model relationships, Step1Data validation, enums
- Feature: Lead Index page loads with stats, table filtering, start conversion, submit Step 1, Zoho sync job dispatched, save & exit

---

### Phase 2: Package Details + ACAT Extraction (Steps 2-3)

**Goal**: Capture package details, extract or manually enter ACAT/IAT data.

**Backend**:
1. Create Data classes:
   - `Step2Data` (referral code, management option, financial status, classifications, dates, HCA recipients)
   - `Step3Data` (extraction result or manual fields + IAT document)
2. Create Actions:
   - `SubmitConversionStep2Action` — Validate, save, sync to Zoho
   - `ExtractAcatDataAction` — Call ACAT extraction service with referral code
   - `SubmitConversionStep3Action` — Save extraction/manual data, sync to Zoho
3. Create `SyncConversionStep2ToZohoJob` — Update Consumer with package details
4. Create `SyncConversionStep3ToZohoJob` — Update Care Plan with ACAT data + upload IAT
5. Create `AcatExtractionService` — HTTP client for ACAT/IAT extraction API

**Frontend**:
1. Create `Steps/Step2PackageDetails.vue`:
   - Package details section (referral code, management option, financial status, classification)
   - Secondary/tertiary classifications with level checkboxes
   - Key dates (commencement, cessation)
   - HCA recipient section with contact list + Add Contact
2. Create `Steps/Step3AcatExtraction.vue`:
   - Automatic extraction panel (referral code + Extract Data button)
   - Loading/success/failed states
   - Manual fallback (upload + classification fields)
   - IAT document upload (required per spec)
3. Create `ExtractionStatusCard.vue` — Extraction state machine UI
4. Create `HcaRecipientList.vue` — Contact selection with checkboxes

**Tests**:
- Unit: Step2Data/Step3Data validation, classification logic, extraction service mock
- Feature: Submit Step 2 with sync, extraction success/failure paths, manual fallback, IAT upload

---

### Phase 3: Screening + Risk Assessment (Steps 4-5)

**Goal**: Screening questions → automated risk scoring → display result.

**Backend**:
1. Create Data classes:
   - `Step4Data` (screening question answers — all yes/no + provider count)
   - `ScreeningResultData` (calculated result DTO)
2. Create Actions:
   - `SubmitConversionStep4Action` — Save screening answers
   - `CalculateScreeningResultAction` — Risk scoring algorithm (ACAT data + screening answers → outcome + confidence + score)
   - `SubmitConversionStep5Action` — Confirm result, update conversion record, sync to Zoho
3. Create `SyncConversionStep5ToZohoJob` — Update Care Plan with risk outcome
4. Define screening rules engine (config-driven):
   - Previously offboarded → flag
   - High risk score → Clinical Attention or Not Suited
   - Coordinator Model required by risk factors → SM+ Only
   - All clear → Suitable / Approved

**Frontend**:
1. Create `Steps/Step4ScreeningQuestions.vue`:
   - Yes/No radio groups for each question
   - Conditional "reason for switching" dropdown
   - Progress indicator
2. Create `Steps/Step5ScreeningResult.vue`:
   - Result card (Approved/Rejected/SM+ Only)
   - Confidence %, risk score %, assessment date
   - Assessment reasoning with risk flags
   - Conversion summary card
   - Management option compatibility warning
3. Create `ScreeningResultCard.vue` — Result display with color-coded status
4. Create `ConversionSummaryCard.vue` — Read-only summary of Steps 1-2 data

**Tests**:
- Unit: Risk scoring algorithm (all outcome paths), screening rules
- Feature: Submit screening answers, calculate result, display outcomes, Not Suited blocks progression

---

### Phase 4: Agreement + Coordinator + Completion (Step 6)

**Goal**: Display agreement with conditional coordinator section (SM+ only), send (signable) or complete (not-signable), create Package (Pending) + Deal in Zoho, send portal invite.

**Key design decisions**:
- **Package timing**: Package created in "Pending" (ON_BOARDING) state on Send. Activates when HCA is signed downstream (Client-HCA epic handles activation via FR-119).
- **Agreement state model**: Use Client-HCA states (Draft → Sent → Signed → Terminated) from the start. "Send Agreement" creates Agreement record in `Sent` state. "Complete (not-signable)" creates in `Draft` state with hold reasons.
- **Portal invite**: Uses `UpdateAndInviteUserFromPackageContact` pattern — creates user with "Recipient Representative" role + sends `WelcomeNewUserNotification`. Client gets first-login redirect to Agreements area (Client-HCA FR-014).

**Backend**:
1. Create Data classes:
   - `Step6Data` (coordinator fields + confirmation flags)
   - `AgreementData` (extended for HCA — includes coordination fee, cooling off info, state)
2. Create Actions:
   - `SubmitConversionStep6Action` — Save coordinator + agreement data, determine signable status
   - `CheckMonashModelRemotenessAction` — Postcode → remoteness level check
   - `ResolveDefaultCoordinatorAction` — TC Internal default or BD pipeline pre-population
   - `GenerateHcaAgreementAction` — Build agreement body from conversion data using Blade template (Spatie LaravelPdf pattern, matching Supplier agreement approach)
   - `SendAgreementAction` — Create Agreement (state=Sent) + Package (stage=ON_BOARDING/Pending) + Deal in Zoho + send portal invite via `UpdateAndInviteUserFromPackageContact`
   - `CompleteNotSignableConversionAction` — Create Agreement (state=Draft) + Package (ON_BOARDING) + Deal (no invite), set hold status
   - `CreatePackageFromConversionAction` — Maps LeadConversion → Package record (stage=ON_BOARDING)
   - `CreateDealInZohoAction` — Creates Deal record in Zoho
3. Create `SyncConversionStep6ToZohoJob` — Update Care Plan with coordinator data
4. Create `SyncConversionCompletionToZohoJob` — Create Deal, sync agreement status
5. HCA Blade template: `resources/views/pdf/agreements/v1/hca-agreement.blade.php` (matching Supplier agreement pattern)
6. Monash Model data: config file or database table mapping postcodes → remoteness levels

**Frontend**:
1. Create `Steps/Step6Agreement.vue`:
   - **Coordinator section** (visible only for SM+):
     - Choose coordination type: TC Internal vs External Coordinator
     - If External → searchable coordinator dropdown (from CareCoordinator database)
     - Fee auto-populates from selected coordinator's fee schedule
     - BD pipeline → locked coordinator display
     - Remote area → escalation warning
     - "I don't know" option → agreement becomes not-signable
   - **Signable path**: HCA recipient list, agreement body preview, cooling off info, "Send Agreement" button
   - **Not-signable path**: Hold reasons banner, conversion summary, "Complete Conversion" button
2. Create `CoordinatorSelector.vue`:
   - Searchable dropdown (CommonSelectMenu with coordinator items)
   - Fee display per coordinator
   - "I don't know" option at bottom
3. Create `AgreementPreview.vue` — Agreement body with coordination fee section
4. Create `HoldReasonsBanner.vue` — Clinical/coordinator hold reasons display

**Tests**:
- Unit: Monash Model check, coordinator resolution logic, signable determination, agreement generation (Blade template), Package creation (ON_BOARDING stage)
- Feature: SM path (no coordinator section), SM+ path (coordinator resolution), BD pipeline lock, remote escalation, send agreement (Agreement=Sent + Package=ON_BOARDING + Deal + invite), complete not-signable (Agreement=Draft + Package=ON_BOARDING + no invite), portal invite sent via PackageContact pattern

---

### Phase 5: Polish + Edge Cases

**Goal**: Save & exit resume flow, packages index update, Zoho sync edge cases.

**Backend**:
1. Update `PackageController@index` — Add agreement status column + filter (FR-039)
2. Implement save & exit resume logic (load step_data JSON back into wizard)
3. Edge case handlers: Zoho sync retry (`ShouldBeUnique` + `ReportableException` pattern), extraction timeout, duplicate prevention
4. Zoho sync error handling: Follow existing `$tries = 1` pattern with `ReportableException` for logging to `'jobs'` channel

**Frontend**:
1. Update Packages index — agreement status column + filter
2. Save & Exit modal + resume flow (load step_data from `LeadConversion.step_data` JSON back into shared form)

**Tests**:
- Feature: Resume incomplete conversion, Zoho retry on failure, Package index agreement status filter

---

### Phase 6: Feature Flag + Integration Testing

**Goal**: Feature flag rollout, full integration tests, Gate 4 readiness.

1. Create feature flag: `lead-to-hca-conversion` in PostHog
2. Gate all LTH routes behind `Feature::active('lead-to-hca-conversion')`
3. Gate frontend navigation behind PostHog flag check
4. Full integration tests:
   - Complete conversion (signable, SM path — no coordinator)
   - Complete conversion (signable, SM+ with TC Internal coordinator)
   - Complete conversion (signable, SM+ with External coordinator)
   - Complete conversion (not-signable, clinical hold)
   - Complete conversion (not-signable, coordinator unknown)
   - Save & exit + resume
   - Zoho sync verification (all sync points)
5. Gate 4 checklist: TypeScript audit, PHP audit, Pint, test suite

---

## Project Structure

### Documentation

```
.tc-docs/content/initiatives/Consumer-Lifecycle/Lead-To-HCA/
├── spec.md                # Feature specification
├── design.md              # Design + Figma cross-check
├── plan.md                # This file
├── idea-brief.md          # Original idea brief
└── context/               # Supporting context docs
```

### Source Code

```
domain/Lead/
├── Models/
│   ├── Lead.php                           # Extended with conversion relationship
│   ├── LeadConversion.php                 # NEW — Wizard state tracking
│   └── LeadConversionSyncLog.php          # NEW — Zoho sync audit
├── Enums/
│   ├── LeadConversionStatusEnum.php       # NEW
│   ├── LeadRiskOutcomeEnum.php            # NEW
│   ├── LeadCoordinatorSourceEnum.php      # NEW
│   └── LeadConversionSyncStatusEnum.php   # NEW
├── Data/
│   ├── Conversion/
│   │   ├── LeadConversionData.php         # NEW — Main conversion DTO
│   │   ├── Step1Data.php                  # NEW
│   │   ├── Step2Data.php                  # NEW
│   │   ├── Step3Data.php                  # NEW
│   │   ├── Step4Data.php                  # NEW
│   │   ├── Step5Data.php                  # NEW (ScreeningResultData)
│   │   └── Step6Data.php                  # NEW (Agreement + Coordinator)
├── Actions/
│   ├── Conversion/
│   │   ├── StartLeadConversionAction.php
│   │   ├── SubmitConversionStep1Action.php
│   │   ├── SubmitConversionStep2Action.php
│   │   ├── ExtractAcatDataAction.php
│   │   ├── SubmitConversionStep3Action.php
│   │   ├── SubmitConversionStep4Action.php
│   │   ├── CalculateScreeningResultAction.php
│   │   ├── SubmitConversionStep5Action.php
│   │   ├── CheckMonashModelRemotenessAction.php
│   │   ├── ResolveDefaultCoordinatorAction.php
│   │   ├── SubmitConversionStep6Action.php       # Agreement + Coordinator
│   │   ├── GenerateHcaAgreementAction.php
│   │   ├── SendAgreementAction.php
│   │   ├── CompleteNotSignableConversionAction.php
│   │   ├── CreatePackageFromConversionAction.php
│   │   ├── CreateDealInZohoAction.php
│   │   ├── SendPortalInvitationAction.php
│   │   └── SaveAndExitConversionAction.php
├── Jobs/
│   ├── SyncConversionStep1ToZohoJob.php
│   ├── SyncConversionStep2ToZohoJob.php
│   ├── SyncConversionStep3ToZohoJob.php
│   ├── SyncConversionStep5ToZohoJob.php
│   ├── SyncConversionStep6ToZohoJob.php
│   └── SyncConversionCompletionToZohoJob.php
├── Http/Controllers/
│   ├── LeadIndexController.php            # NEW — Lead Index (stats + table)
│   └── LeadConversionController.php       # NEW — Wizard routes
├── Policies/
│   └── LeadConversionPolicy.php           # NEW
├── Services/
│   └── AcatExtractionService.php          # NEW — External ACAT API client
├── Routes/
│   └── leadRoutes.php                     # Extended with conversion routes

resources/js/Pages/Lead/
├── Index.vue                              # NEW — Lead Index (stats + CommonTable)
├── Conversion/
│   ├── Index.vue                          # NEW — Wizard container
│   └── Steps/
│       ├── Step1LeadDetails.vue
│       ├── Step2PackageDetails.vue
│       ├── Step3AcatExtraction.vue
│       ├── Step4ScreeningQuestions.vue
│       ├── Step5ScreeningResult.vue
│       └── Step6Agreement.vue             # Agreement + Coordinator (SM+ only)

resources/js/Components/Lead/Conversion/
├── ZohoBanner.vue
├── ExtractionStatusCard.vue
├── ScreeningResultCard.vue
├── CoordinatorSelector.vue
├── AgreementPreview.vue
├── HcaRecipientList.vue
├── ConversionSummaryCard.vue
└── HoldReasonsBanner.vue

tests/
├── Unit/Lead/Conversion/
│   ├── LeadConversionModelTest.php
│   ├── CalculateScreeningResultActionTest.php
│   ├── CheckMonashModelRemotenessActionTest.php
│   └── CreatePackageFromConversionActionTest.php
├── Feature/Lead/Conversion/
│   ├── ConversionStep1Test.php
│   ├── ConversionStep2Test.php
│   ├── ConversionStep3Test.php
│   ├── ConversionStep4Test.php
│   ├── ConversionStep5Test.php
│   ├── ConversionStep6Test.php             # Agreement + Coordinator
│   ├── ConversionSaveExitTest.php
│   ├── ConversionZohoSyncTest.php
│   └── LeadIndexTest.php

database/migrations/
├── xxxx_create_lead_conversions_table.php
├── xxxx_create_lead_conversion_sync_logs_table.php
└── xxxx_add_agreement_status_to_packages_table.php
```

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| ACAT extraction service unavailable/slow | Medium | Medium | Manual fallback built into Step 3; extraction is optional path |
| Zoho API rate limits during conversion | Low | High | Queue-based sync with retry; idempotent operations |
| Monash Model data incomplete for postcodes | Low | Medium | Default to TC Internal + flag for review |
| Coordinator database gaps | Medium | Low | "I don't know" option → not-signable with hold |
| Risk scoring algorithm accuracy | Medium | Medium | Config-driven rules; easy to tune post-launch |
| Agreement template complexity | Medium | Medium | Start with simple HTML template; iterate |
| Zoho field mapping drift | Low | High | Sync log table tracks all payloads; easy to debug |

---

## Open Questions

- [ ] ACAT extraction API: endpoint URL, auth method, request/response format — needs integration spec
- [ ] Risk scoring algorithm: exact weights and thresholds for screening questions — needs rules from business
- [ ] Agreement template: exact wording, sections, legal review — needs legal sign-off
- [ ] Monash Model data source: API or static data file — needs research
- [ ] Cooling off period wording: exact text for agreement display — needs legal
- [x] ~~Portal invitation mechanism~~ → **RESOLVED**: Use `UpdateAndInviteUserFromPackageContact` pattern (creates user + Recipient Rep role)
- [ ] Client details fields (Gender, DOB, Language, etc.): captured in Step 2 or deferred to LES? — needs business decision

---

## Development Clarifications

### Session 2026-02-19

- Q: Should the wizard use one shared `useForm()` or per-step forms? → A: **Single shared form** — matches existing Lead Edit pattern. One `useForm` with all fields, passed via `v-model:form` to step components. Simpler save-and-exit (whole form serialized to `step_data` JSON).
- Q: When should the Package record be created? → A: **On HCA Send** — Package created in "Pending" (ON_BOARDING) state when agreement is sent. Aligns with Client-HCA spec (FR-115, FR-119). Package activates when HCA is signed downstream.
- Q: What is the Lead Index page? → A: **Lead Index IS the dashboard** — stats cards + CommonTable with filters. Built in Phase 1 as the entry point to lead management. Uses existing Common table components (CommonTable, CommonTableFilter, CommonTableSort, CommonTablePagination, CommonTableRowAction).
- Q: Should LTH use the Client-HCA agreement state model? → A: **Yes, use Client-HCA states from the start** — Draft → Sent → Signed → Terminated. "Send Agreement" creates Agreement in `Sent` state. "Complete (not-signable)" creates in `Draft` state. This ensures LTH-created agreements are ready for Client-HCA lifecycle handling.
- Q: Which portal invitation pattern for converted leads? → A: **PackageContact pattern** — `UpdateAndInviteUserFromPackageContact` creates/updates user with "Recipient Representative" role and sends `WelcomeNewUserNotification`. Client gets first-login redirect to Agreements area (Client-HCA FR-014).

---

## Architecture Gate Check

**Date**: 2026-02-19
**Status**: PASS

### 1. Technical Feasibility
- [x] Architecture approach clear — 6-step wizard extending Lead domain, single shared useForm
- [x] Existing patterns leveraged — Lead Edit wizard, Zoho sync jobs, CommonStepNavigation, CommonTable
- [x] All requirements buildable — All spec items mapped to phases
- [x] Performance considered — Queue-based sync, extraction timeout handling, idempotent jobs
- [x] Security considered — LeadConversionPolicy with Response objects, Sales role gating

### 2. Data & Integration
- [x] Data model understood — db-spec.md with 2 new tables + 1 migration
- [x] API contracts clear — Route table with 12 endpoints defined
- [x] Dependencies identified — Zoho CRM, ACAT extraction, CommonStepNavigation, CareCoordinator
- [x] Integration points mapped — Zoho sync at 4 steps, Client-HCA alignment for agreement states
- [x] DTO persistence explicit — Actions map Data class properties to model fields individually

### 3. Implementation Approach
- [x] File changes identified — Full project structure tree with ~50 new files
- [x] Risk areas noted — Risk Assessment table with 7 risks + mitigations
- [x] Testing approach defined — Unit + Feature tests per phase
- [x] Rollback possible — Feature flag gating (`lead-to-hca-conversion`)

### 4. Resource & Scope
- [x] Scope matches spec — MVP defined, future phases for LES/LDS/Client-HCA noted
- [x] Effort reasonable — 6 phases with clear deliverables
- [x] Skills available — Standard Laravel/Vue/TypeScript stack

### 5. Laravel & Cross-Platform Best Practices
- [x] No hardcoded business logic in Vue — All business rules in Actions, screening/risk in backend
- [x] Cross-platform reusability — Actions pattern for all business logic
- [x] Laravel Data for validation — Data classes for all step forms
- [x] Model route binding — Routes use `{lead}` not `{id}`
- [x] No magic numbers/IDs — Enums for all status/type values
- [x] Common components pure — Using CommonTable, CommonStepNavigation etc. as-is
- [x] Use Lorisleiva Actions — All actions use `AsAction` trait
- [x] Action authorization in `authorize()` — Response objects, not in handle() or asController()
- [x] Data classes remain anemic — DTOs with validation only, business logic in Actions/Models
- [x] Migrations schema-only — Agreements backfill is a separate Operation, not in migration
- [x] Models have single responsibility — LeadConversion tracks wizard state, LeadConversionSyncLog tracks sync
- [x] Granular model policies — LeadConversionPolicy dedicated (not on LeadPolicy)
- [x] Response objects in auth — `Response::allow()` / `Response::deny('reason')`, no bare bool
- [x] Event sourcing — N/A for MVP (noted in constitution check, consider for V2)
- [x] Semantic column documentation — PHPDoc for lifecycle columns (status, is_signable, risk_outcome, etc.)

### 6. Vue TypeScript Standards
- [x] All new/modified Vue components planned with `<script setup lang="ts">`
- [x] Props use named interfaces (`defineProps<Props>()`)
- [x] Emits are typed (`defineEmits<{...}>()`)
- [x] No `any` types planned — Backend data shapes auto-generated into `generated.d.ts`
- [x] Shared types identified — `resources/js/types/generated.d.ts` with `Domain.Lead.Data.*` namespace
- [x] Type declarations for untyped deps — `inertia-modal.d.ts` exists (established pattern)

**Ready to Implement**: YES

---

## Next Steps

1. ~~`/trilogy-erd` — Generate detailed database schema (db-spec.md)~~ ✅ Done
2. ~~Architecture Gate (Gate 3)~~ ✅ PASS
3. `/speckit-tasks` — Generate implementation tasks from phases
4. Implementation — Phase 1 first (Lead Index + foundation + Step 1)
