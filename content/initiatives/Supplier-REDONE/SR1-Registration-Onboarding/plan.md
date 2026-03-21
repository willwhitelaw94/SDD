---
title: "Implementation Plan: Supplier Registration & Onboarding"
---

# Implementation Plan: Supplier Registration & Onboarding

**Spec**: [spec.md](/initiatives/supplier-redone/sr1-registration-onboarding/spec) | **Design**: [design.md](/initiatives/supplier-redone/sr1-registration-onboarding/design)
**Created**: 2026-03-19
**Status**: Draft
**Gate 1**: PASS (Spec complete) | **Gate 2**: PASS (Design complete)
**Depends on**: SR0 (API Foundation & Two-Tier Auth)

---

## Summary

Suppliers currently register through a flat, session-dependent form that creates a single entity — no organisation concept, no multi-supplier support, no progress visibility. The result: ~8,000 incomplete onboardings and staff intervention required for every multi-trading-name supplier.

This plan builds a **Registration & Onboarding** system that:

- Validates ABN against the Australian Business Register API and creates Organisation + Supplier + User in one registration flow
- Guides suppliers through a 5-step sequential onboarding wizard (Business Details → Locations → Pricing → Documents → Agreements)
- Tracks step completion via `SupplierOnboarding` timestamps with auto-save draft persistence
- Transitions portal stages: NOT_ONBOARDED → ONBOARDING → PENDING_VERIFICATION → VERIFIED
- Supports lite verification (auto — documents pass + EFTSure green) and heavy verification (manual Compliance review)
- Integrates EFTSure 3-stage bank verification with traffic-light indicators
- Works mobile-first with token-based auth (no session dependency)
- Enables Organisation Administrators to add Tier 2 supplier entities with independent onboarding

**Architecture**: Split-stack — Laravel API (tc-portal, v2 endpoints) + React/Next.js frontend (supplier-portal).

**Phase 1 (MVP)**: Stories 1-7 + 8 — Registration, all onboarding steps, lite verification, progress indicator
**Phase 2**: Stories 9-11 — Heavy verification, EFTSure 3-stage, progress indicator polish
**Phase 3**: Story 12 — Invitation-based registration

---

## Technical Context

### Technology Stack

- **Backend**: Laravel 12, PHP 8.4 (tc-portal — adding v2 API endpoints)
- **Frontend**: Next.js 16, React 19, Shadcn/ui v4, Tailwind CSS v4 (supplier-portal — standalone app)
- **Auth**: Laravel Sanctum tokens (from SR0)
- **Database**: MySQL (existing tc-portal database)
- **External APIs**: ABR (ABN lookup), EFTSure (bank verification), Google Places (address autocomplete), reCAPTCHA v3
- **Actions**: Lorisleiva/Actions (existing pattern in tc-portal)
- **DTOs**: Spatie Laravel Data (existing pattern in tc-portal)
- **Testing**: Pest v3 (backend), Vitest + React Testing Library (frontend)

### Key Architecture Decision: Split-Stack API + SPA

SR1 is **not** an Inertia/Vue feature inside the existing portal. It is a standalone React SPA communicating with Laravel via a versioned JSON API (`/api/v2/`). This means:

- **No Inertia**: No `Inertia::render()`, no `useForm()`, no `usePage()`. All data exchange is via REST API calls.
- **No Vue**: The frontend is React with Next.js. Gate 3 section 6 (Vue TypeScript Standards) is replaced with React TypeScript Standards.
- **Sanctum tokens**: Auth is token-based per SR0, not session-based.
- **API Resources**: All controller responses use Eloquent API Resources, not Data DTOs passed to Inertia.
- **Validation**: Laravel Data classes still handle server-side validation — responses return standard JSON error envelopes.

### Existing Models & Infrastructure

The following already exist in tc-portal and will be extended:

| Model/Entity | Location | Status |
|---|---|---|
| `Organisation` | `domain/Organisation/Models/Organisation.php` | Exists — has `abn`, `legal_trading_name`, `abn_object`, `verification_stage` |
| `Supplier` | `domain/Supplier/Models/Supplier.php` | Exists — has `business_id`, `stage`, relationships to Organisation, Business, Documents |
| `SupplierOnboarding` | `domain/Supplier/Models/SupplierOnboarding.php` | Exists — table `supplier_onboardings` already has columns: `id`, `supplier_id`, `invited_at`, `registered_at`, `business_completed_at`, `location_completed_at`, `pricing_completed_at`, `documents_completed_at`, `agreement_signed_at`, timestamps. **No migration needed.** Each new supplier entity gets a fresh row via `CreateSupplierEntity` (SR2). |
| `PortalStageEnum` | `domain/Supplier/Enums/PortalStageEnum.php` | Exists — NOT_ONBOARDED, REGISTERED, INVITED, ONBOARDING, VERIFIED, TERMINATED, MISSING_DOCS, PENDING_VERIFICATION |
| `Business` | `domain/Business/Models/Business.php` | Exists — linked from Supplier via `business_id` |
| `OrganisationLocation` | `domain/Organisation/Models/OrganisationLocation.php` | Exists — locations under organisations |
| `OrganisationPrice` | `domain/Organisation/Models/OrganisationPrice.php` | Exists — pricing under organisations |
| `Document` | `domain/Document/Models/Document.php` | Exists — supplier documents via `HasDocuments` trait |

### Dependencies

- **SR0 (API Foundation)**: v2 API routing, JSON envelope format, Sanctum token auth, two-tier role hierarchy, supplier context switching
- **ABR API**: External dependency for ABN validation — registration is blocked if unavailable
- **EFTSure API**: External dependency for bank verification — async, does not block onboarding
- **Google Places API**: External dependency for address autocomplete — graceful degradation to manual entry

### Constraints

- **No session dependency**: Token-based auth only — mobile must work identically to desktop
- **Sequential onboarding**: Steps have real data dependencies (locations before pricing, documents before agreements)
- **Organisation-level documents shared**: Public liability, ABN verification, workers comp uploaded once per org, shared across supplier entities (FR-017)
- **Existing data**: Must not break existing supplier/organisation records created via the v1 flow or Zoho sync
- **API versioning**: All new endpoints under `/api/v2/` — v1 endpoints untouched

---

## Design Decisions

### Data Model

#### New Tables

##### `supplier_documents` table

| Column | Type | Notes |
|--------|------|-------|
| id | bigint PK | Auto-increment |
| supplier_id | FK → suppliers, nullable | Null for organisation-level documents |
| organisation_id | FK → organisations | Owner organisation |
| document_type | string(50) | Enum: PUBLIC_LIABILITY, ABN_VERIFICATION, WORKERS_COMP, PROFESSIONAL_INDEMNITY, POLICE_CHECK, etc. |
| scope | string(20) | `organisation` or `supplier` — determines sharing behaviour (FR-017) |
| file_path | string(500) | S3 storage path |
| original_filename | string(255) | User-uploaded filename |
| mime_type | string(50) | PDF, JPG, PNG |
| file_size_bytes | int unsigned | For client-side validation display |
| status | string(20) | Enum: PENDING, APPROVED, REJECTED |
| rejection_reason | text nullable | Compliance rejection reason |
| reviewed_by | FK → users nullable | Compliance reviewer |
| reviewed_at | timestamp nullable | |
| expires_at | date nullable | Document expiry date |
| created_at, updated_at | timestamps | |
| deleted_at | timestamp nullable | Soft deletes (archive on re-upload) |
| **Indexes** | | |
| (organisation_id, scope, document_type) | composite | Org-level document lookup |
| (supplier_id, document_type) | composite | Supplier-level document lookup |
| (status) | index | Compliance review queue |

##### `supplier_agreements` table

| Column | Type | Notes |
|--------|------|-------|
| id | bigint PK | Auto-increment |
| supplier_id | FK → suppliers | |
| agreement_type | string(30) | Enum: SUPPLIER_AGREEMENT, APA |
| version | string(10) | Agreement version (e.g. "2.1") |
| signed_at | timestamp nullable | When signed |
| signatory_name | string(255) | Name entered at signing |
| signatory_user_id | FK → users | Who signed |
| ip_address | string(45) | IP at time of signing |
| created_at, updated_at | timestamps | |

##### `supplier_bank_verifications` table

| Column | Type | Notes |
|--------|------|-------|
| id | bigint PK | Auto-increment |
| supplier_id | FK → suppliers | |
| eftsure_reference | string(100) nullable | EFTSure transaction reference |
| eftsure_stage | tinyint unsigned | 0 = not started, 1/2/3 = stage, 4 = refused |
| status | string(20) | Enum: NOT_STARTED, PENDING, VERIFIED, REFUSED |
| bsb | string(7) | BSB (encrypted at rest) |
| account_number | string(10) | Account number (encrypted at rest) |
| account_name | string(255) | |
| verified_at | timestamp nullable | |
| refused_at | timestamp nullable | |
| refusal_reason | text nullable | |
| created_at, updated_at | timestamps | |
| **Indexes** | | |
| (supplier_id, status) | composite | Dashboard lookup |

##### `supplier_onboarding_drafts` table

| Column | Type | Notes |
|--------|------|-------|
| id | bigint PK | Auto-increment |
| supplier_id | FK → suppliers | |
| step | string(30) | Enum: BUSINESS_DETAILS, LOCATIONS, PRICING, DOCUMENTS, AGREEMENTS |
| draft_data | json | Auto-saved partial form data |
| updated_at | timestamp | Last auto-save |
| **Indexes** | | |
| (supplier_id, step) | unique | One draft per step per supplier |

#### Existing Table Modifications

##### `suppliers` table — add columns

| Column | Type | Notes |
|--------|------|-------|
| service_delivery_model | string(20) nullable | Enum: DIRECT_PROVIDER, SUBCONTRACTOR, BOTH — self-declared during Business Details (FR-015) |
| portal_stage | string(30) | Already exists as `PortalStageEnum` — confirmed compatible |

##### `organisations` table — no changes needed

Organisation model already has `abn`, `legal_trading_name`, `abn_object`, `is_gst_registered`, `verification_stage`. All required fields for registration exist.

### API Contracts

All endpoints follow the SR0 v2 JSON envelope format. Auth via Sanctum bearer token except registration (public).

#### Registration (Public — no auth)

```
POST   /api/v2/abn/lookup                    → AbnLookupController@lookup
POST   /api/v2/register                       → RegistrationController@register
POST   /api/v2/register/check-abn             → RegistrationController@checkAbn
```

| Endpoint | Input | Output |
|----------|-------|--------|
| `POST /abn/lookup` | `{ abn: string }` | `{ data: { abn, entity_name, business_names: string[], gst_registered: bool, active: bool } }` or error envelope |
| `POST /register` | `{ abn, selected_business_name, name, email, password, password_confirmation, recaptcha_token }` | `{ data: { user, organisation, supplier, token } }` |
| `POST /register/check-abn` | `{ abn: string }` | `{ data: { exists: bool, message: string } }` |

#### Supplier Entities (Auth required — Organisation Administrator)

```
POST   /api/v2/suppliers                      → SupplierEntityController@store
GET    /api/v2/suppliers                      → SupplierEntityController@index
```

| Endpoint | Input | Output |
|----------|-------|--------|
| `POST /suppliers` | `{ trading_name, service_delivery_model }` | `{ data: { supplier, onboarding } }` |
| `GET /suppliers` | — | `{ data: [{ supplier, onboarding_progress, portal_stage }] }` |

#### Onboarding Steps (Auth required — Supplier context)

```
GET    /api/v2/onboarding/status              → OnboardingController@status
GET    /api/v2/onboarding/draft/{step}        → OnboardingController@getDraft
PUT    /api/v2/onboarding/draft/{step}        → OnboardingController@saveDraft

POST   /api/v2/onboarding/business            → OnboardingBusinessController@complete
POST   /api/v2/onboarding/locations           → OnboardingLocationController@complete
GET    /api/v2/onboarding/locations           → OnboardingLocationController@index
POST   /api/v2/onboarding/locations/{id}      → OnboardingLocationController@update
DELETE /api/v2/onboarding/locations/{id}      → OnboardingLocationController@destroy
POST   /api/v2/onboarding/pricing             → OnboardingPricingController@complete
POST   /api/v2/onboarding/documents           → OnboardingDocumentController@upload
DELETE /api/v2/onboarding/documents/{id}      → OnboardingDocumentController@destroy
POST   /api/v2/onboarding/documents/complete  → OnboardingDocumentController@complete
GET    /api/v2/onboarding/agreements          → OnboardingAgreementController@index
POST   /api/v2/onboarding/agreements/{type}/sign → OnboardingAgreementController@sign
```

| Endpoint | Input | Output |
|----------|-------|--------|
| `GET /onboarding/status` | — | `{ data: { current_step, completed_steps: string[], portal_stage, onboarding: { ...timestamps } } }` |
| `PUT /onboarding/draft/{step}` | `{ draft_data: object }` | `{ data: { saved_at } }` |
| `POST /onboarding/business` | `{ legal_name, trading_name?, business_type, service_delivery_model, primary_contact_name, primary_contact_email, primary_contact_phone }` | `{ data: { supplier, next_step } }` |
| `POST /onboarding/locations` | `{ address, suburb, state, postcode, latitude, longitude, service_radius_km, contact_name?, contact_phone? }` | `{ data: { location } }` |
| `POST /onboarding/documents` | Multipart: `file`, `document_type`, `scope` | `{ data: { document } }` |
| `POST /onboarding/agreements/{type}/sign` | `{ signatory_name, consent: true }` | `{ data: { agreement, portal_stage } }` |

#### Verification (Auth required)

```
GET    /api/v2/verification/status            → VerificationController@status
GET    /api/v2/verification/bank              → VerificationController@bankStatus
```

| Endpoint | Input | Output |
|----------|-------|--------|
| `GET /verification/status` | — | `{ data: { portal_stage, documents_status, bank_status, compliance_status, expected_completion } }` |
| `GET /verification/bank` | — | `{ data: { eftsure_stage, status, verified_at? } }` |

#### Compliance Review (Auth required — Staff)

```
GET    /api/v2/staff/verification/queue       → StaffVerificationController@queue
POST   /api/v2/staff/verification/{supplier}/review → StaffVerificationController@review
POST   /api/v2/staff/documents/{document}/approve   → StaffDocumentController@approve
POST   /api/v2/staff/documents/{document}/reject    → StaffDocumentController@reject
```

### React Components

#### Shared Types (`src/types/`)

```
src/types/
├── api.ts                  — API envelope types (ApiResponse<T>, ApiError, PaginatedResponse<T>)
├── auth.ts                 — User, AuthToken, AuthContext types
├── organisation.ts         — Organisation, OrganisationSummary
├── supplier.ts             — Supplier, SupplierSummary, PortalStage enum
├── onboarding.ts           — OnboardingStatus, OnboardingStep, StepName, DraftData
├── documents.ts            — SupplierDocument, DocumentType, DocumentScope, DocumentStatus
├── agreements.ts           — SupplierAgreement, AgreementType
├── verification.ts         — VerificationStatus, BankVerification, EftSureStage
└── locations.ts            — SupplierLocation, GooglePlaceResult
```

#### Page Components (`src/app/`)

```
src/app/
├── (public)/
│   ├── register/
│   │   └── page.tsx                — Registration page
│   └── login/
│       └── page.tsx                — Login page (from SR0)
├── (auth)/
│   ├── layout.tsx                  — Authenticated layout with header
│   ├── dashboard/
│   │   └── page.tsx                — Organisation dashboard (supplier entity list)
│   ├── onboarding/
│   │   ├── layout.tsx              — Onboarding layout with progress indicator
│   │   ├── page.tsx                — Onboarding router (redirects to current step)
│   │   ├── business/
│   │   │   └── page.tsx            — Step 1: Business Details
│   │   ├── locations/
│   │   │   └── page.tsx            — Step 2: Locations
│   │   ├── pricing/
│   │   │   └── page.tsx            — Step 3: Pricing
│   │   ├── documents/
│   │   │   └── page.tsx            — Step 4: Documents
│   │   └── agreements/
│   │       └── page.tsx            — Step 5: Agreements
│   └── verification/
│       └── page.tsx                — Verification dashboard (PENDING_VERIFICATION)
```

#### Feature Components

All new feature components live under `src/components/` with directory-based decomposition per Gate 3 section 7.

##### OnboardingProgress Component Decomposition

- **Parent**: `OnboardingProgress.tsx` — owns step state, current step, navigation callbacks
- **Directory**: `src/components/onboarding/OnboardingProgress/`
- **Sub-components**:
  - `DesktopSidebar.tsx` — renders vertical step list with connecting lines (desktop 1024px+)
  - `MobileStepper.tsx` — renders horizontal dot stepper with abbreviated labels (mobile < 1024px)
  - `StepIndicator.tsx` — single step circle: complete (green checkmark), current (teal ring + pulse), upcoming (gray), rejected (red warning)
  - `CompletionSummary.tsx` — "X of 5 completed" / "Action required" summary at bottom
- **Props**: `OnboardingProgress.tsx`
  - `steps: OnboardingStepConfig[]` — step definitions with name, label, status
  - `currentStep: StepName` — active step
  - `onStepClick?: (step: StepName) => void` — navigation callback (only for completed steps after initial completion)
- **Shared types**: `src/types/onboarding.ts` — `OnboardingStepConfig`, `StepStatus` ('complete' | 'current' | 'upcoming' | 'rejected')
- **Shadcn components reused**: `Badge`, `cn` utility
- **Common component eligibility**: `StepIndicator` is specific to onboarding step states — kept bespoke, not a general component

##### AbnLookupField Component Decomposition

- **Parent**: `AbnLookupField.tsx` — owns ABN input state, debounced API call, results
- **Directory**: `src/components/registration/AbnLookupField/`
- **Sub-components**:
  - `AbnInput.tsx` — formatted input (XX XXX XXX XXX) with auto-spacing, loading spinner
  - `BusinessNameDropdown.tsx` — selectable list of business names from ABR results
  - `AbnError.tsx` — error display (invalid, not found, API unavailable, duplicate)
- **Props**: `AbnLookupField.tsx`
  - `value: string` — current ABN value
  - `onChange: (abn: string) => void`
  - `onBusinessSelect: (business: AbrBusinessResult) => void`
  - `error?: string`
- **Key types**: `AbrLookupResult`, `AbrBusinessResult` in `src/types/abr.ts`
- **Shadcn components reused**: `Input`, `Select`, `Alert`, `Skeleton`
- **Behaviour**: Debounce 500ms after 11 digits entered. Auto-select if single result. Show duplicate ABN warning via `check-abn` endpoint before form submit.

##### EftSureIndicator Component Decomposition

- **Parent**: `EftSureIndicator.tsx` — owns stage display logic
- **Directory**: `src/components/verification/EftSureIndicator/`
- **Sub-components**:
  - `StageDotsRow.tsx` — three dots with connecting lines, progressive fill based on stage
  - `StatusMessage.tsx` — contextual message (pending, stage complete, verified, refused with guidance)
- **Props**: `EftSureIndicator.tsx`
  - `stage: EftSureStage` — 0-4 (not started, stage 1/2/3, refused)
  - `status: BankVerificationStatus`
  - `refusalReason?: string`
- **Shared types**: `src/types/verification.ts`
- **Shadcn components reused**: `Badge`
- **Common component eligibility**: Traffic-light/stage-dot pattern could be generalised, but EFTSure-specific messaging makes it bespoke for now

##### VerificationStatusCard Component Decomposition

- **Parent**: `VerificationStatusCard.tsx` — owns verification status polling (30s interval)
- **Directory**: `src/components/verification/VerificationStatusCard/`
- **Sub-components**:
  - `StatusItem.tsx` — single verification item (Documents / Bank / Compliance) with icon + status badge
  - `TimelineEstimate.tsx` — expected completion text
  - `DashboardPreview.tsx` — read-only preview links (FR-026)
- **Props**: `VerificationStatusCard.tsx`
  - `verificationStatus: VerificationStatus`
  - `bankVerification: BankVerification`
- **Shadcn components reused**: `Card`, `Badge`, `Skeleton`

##### DocumentUploadChecklist Component Decomposition

- **Parent**: `DocumentUploadChecklist.tsx` — owns document list state, upload handlers
- **Directory**: `src/components/onboarding/DocumentUploadChecklist/`
- **Sub-components**:
  - `DocumentSection.tsx` — section header ("Organisation Documents" / "Service-Specific Documents")
  - `DocumentItem.tsx` — single document row: name, status badge, upload/re-upload button, rejection reason
  - `FileUploader.tsx` — file input + drag-and-drop (desktop) + progress bar + validation (10MB, PDF/JPG/PNG)
- **Props**: `DocumentUploadChecklist.tsx`
  - `documents: SupplierDocument[]`
  - `requiredDocuments: DocumentRequirement[]`
  - `onUpload: (file: File, documentType: DocumentType, scope: DocumentScope) => Promise<void>`
  - `onRemove: (documentId: number) => Promise<void>`
- **Shared types**: `src/types/documents.ts`
- **Shadcn components reused**: `Accordion`, `Badge`, `Button`, `Progress`
- **Common component eligibility**: `FileUploader` could be a general component — build as `src/components/ui/file-uploader.tsx` with zero business logic (accepts file constraints via props). `DocumentItem` is domain-specific (bespoke).

##### AgreementViewer Component Decomposition

- **Parent**: `AgreementViewer.tsx` — owns scroll tracking, consent state, sign submission
- **Directory**: `src/components/onboarding/AgreementViewer/`
- **Sub-components**:
  - `AgreementText.tsx` — scrollable HTML content area with scroll position tracking
  - `ConsentForm.tsx` — checkbox ("I have read and agree...") + name input + sign button
  - `AgreementHeader.tsx` — agreement title + version badge
- **Props**: `AgreementViewer.tsx`
  - `agreement: AgreementContent` — type, version, htmlContent
  - `onSign: (signatoryName: string) => Promise<void>`
  - `isSigning: boolean`
- **Behaviour**: Sign button disabled until `AgreementText` reports scroll >= 95% of content height. Checkbox must be checked and name must be entered. For subcontractors, parent page renders two `AgreementViewer` instances sequentially.
- **Shadcn components reused**: `ScrollArea`, `Checkbox`, `Input`, `Button`, `Badge`

#### Custom Hooks (`src/hooks/`)

```
src/hooks/
├── use-api.ts              — Fetch wrapper with Sanctum token injection, error envelope handling
├── use-auth.ts             — Auth context, login, logout, token refresh
├── use-abn-lookup.ts       — Debounced ABR lookup with loading/error states
├── use-onboarding.ts       — Onboarding status, step navigation, draft auto-save
├── use-draft-autosave.ts   — Generic auto-save on blur / 30-second interval
├── use-file-upload.ts      — File upload with progress tracking, validation
├── use-verification-poll.ts — Polling hook for verification status (30s interval)
└── use-google-places.ts    — Google Places autocomplete integration
```

#### Hooks Detail

##### `use-onboarding.ts`

Central hook for onboarding state management. Replaces what Inertia `useForm` would do in the Vue portal.

```typescript
type UseOnboardingReturn = {
  status: OnboardingStatus | null
  currentStep: StepName
  isLoading: boolean
  navigateToStep: (step: StepName) => void
  canNavigateToStep: (step: StepName) => boolean
  completeStep: (step: StepName, data: Record<string, unknown>) => Promise<void>
  stepErrors: Record<string, string[]>
  clearErrors: () => void
}
```

Fetches onboarding status on mount, determines current step, handles step completion API calls, manages server-side validation errors.

##### `use-draft-autosave.ts`

Generic auto-save hook used by each onboarding step page.

```typescript
type UseDraftAutosaveReturn<T> = {
  draft: T | null
  isLoading: boolean
  isSaving: boolean
  saveDraft: (data: T) => Promise<void>
  lastSavedAt: Date | null
}
```

Loads existing draft on mount. Saves on field blur and every 30 seconds if data changed. Debounced to avoid API spam.

---

## Implementation Phases

### Phase 1: Backend — Database & Migrations

**Files to create:**
1. `database/migrations/xxxx_create_supplier_documents_table.php`
2. `database/migrations/xxxx_create_supplier_agreements_table.php`
3. `database/migrations/xxxx_create_supplier_bank_verifications_table.php`
4. `database/migrations/xxxx_create_supplier_onboarding_drafts_table.php`
5. `database/migrations/xxxx_add_service_delivery_model_to_suppliers_table.php`

**Notes:**
- `supplier_onboardings` table already exists with all step timestamp columns — no migration needed
- `suppliers.portal_stage` column already exists — confirmed compatible with `PortalStageEnum`
- **Onboarding re-entrancy for Tier 2 entities**: When an Organisation Administrator creates a new supplier entity (SR2 `CreateSupplierEntityAction`), a fresh `SupplierOnboarding` row is created with all timestamps null. The entity's `portal_stage` is set to `NOT_ONBOARDED`. The onboarding wizard is **fully re-entrant** — it reads the `SupplierOnboarding` timestamps for the active supplier context and renders the appropriate step. An existing VERIFIED supplier creating a new entity does NOT lose their verified status — each entity has an independent onboarding journey.
- Bank details columns (`bsb`, `account_number`) use Laravel's `encrypted` cast
- No enum column types — all use `string` with documented valid values

**Verification:** `php artisan migrate`

### Phase 2: Backend — Domain Layer (Models, Enums, Data, Actions)

**New enums:**
- `domain/Supplier/Enums/ServiceDeliveryModelEnum.php` — DIRECT_PROVIDER, SUBCONTRACTOR, BOTH
- `domain/Supplier/Enums/DocumentTypeEnum.php` — PUBLIC_LIABILITY, ABN_VERIFICATION, WORKERS_COMP, PROFESSIONAL_INDEMNITY, POLICE_CHECK, etc.
- `domain/Supplier/Enums/DocumentScopeEnum.php` — ORGANISATION, SUPPLIER
- `domain/Supplier/Enums/DocumentStatusEnum.php` — PENDING, APPROVED, REJECTED
- `domain/Supplier/Enums/AgreementTypeEnum.php` — SUPPLIER_AGREEMENT, APA
- `domain/Supplier/Enums/BankVerificationStatusEnum.php` — NOT_STARTED, PENDING, VERIFIED, REFUSED
- `domain/Supplier/Enums/OnboardingStepEnum.php` — BUSINESS_DETAILS, LOCATIONS, PRICING, DOCUMENTS, AGREEMENTS

**New models:**
- `domain/Supplier/Models/SupplierDocument.php` — relationships: supplier, organisation, reviewedBy
- `domain/Supplier/Models/SupplierAgreement.php` — relationships: supplier, signatoryUser
- `domain/Supplier/Models/SupplierBankVerification.php` — relationships: supplier
- `domain/Supplier/Models/SupplierOnboardingDraft.php` — relationships: supplier

**Factories:**
- `domain/Supplier/Factories/SupplierDocumentFactory.php`
- `domain/Supplier/Factories/SupplierAgreementFactory.php`
- `domain/Supplier/Factories/SupplierBankVerificationFactory.php`

**Relationship additions to existing models:**
- `Supplier.php`: add `documents(): HasMany → SupplierDocument`, `agreements(): HasMany → SupplierAgreement`, `bankVerification(): HasOne → SupplierBankVerification`, `onboardingDrafts(): HasMany → SupplierOnboardingDraft`, `service_delivery_model` cast to `ServiceDeliveryModelEnum`
- `Organisation.php`: add `organisationDocuments(): HasMany → SupplierDocument` (scope = organisation)

**Data classes (DTOs):**
- `domain/Supplier/Data/V2/RegistrationData.php` — abn, selected_business_name, name, email, password, recaptcha_token
- `domain/Supplier/Data/V2/BusinessDetailsData.php` — legal_name, trading_name, business_type, service_delivery_model, contact fields
- `domain/Supplier/Data/V2/LocationData.php` — address, suburb, state, postcode, lat, lng, service_radius_km, contact fields
- `domain/Supplier/Data/V2/PricingData.php` — service rates per location
- `domain/Supplier/Data/V2/DocumentUploadData.php` — document_type, scope (validation only — file handled separately)
- `domain/Supplier/Data/V2/AgreementSignData.php` — signatory_name, consent
- `domain/Supplier/Data/V2/CreateSupplierEntityData.php` — trading_name, service_delivery_model
- `domain/Supplier/Data/V2/DraftData.php` — step, draft_data (json)

**Actions:**
- `domain/Supplier/Actions/V2/Registration/RegisterSupplier.php` — creates Organisation + Business + Supplier + SupplierOnboarding + User, assigns Organisation Administrator role, issues Sanctum token
- `domain/Supplier/Actions/V2/Registration/LookupAbn.php` — calls ABR API, returns parsed results
- `domain/Supplier/Actions/V2/Registration/CheckAbnExists.php` — checks if ABN already in organisations table
- `domain/Supplier/Actions/V2/Onboarding/CompleteBusinessDetails.php` — updates supplier, records `business_completed_at`, transitions portal stage to ONBOARDING
- `domain/Supplier/Actions/V2/Onboarding/CompleteLocations.php` — creates/updates locations, records `location_completed_at`
- `domain/Supplier/Actions/V2/Onboarding/CompletePricing.php` — saves pricing, records `pricing_completed_at`
- `domain/Supplier/Actions/V2/Onboarding/UploadDocument.php` — stores file to S3, creates `SupplierDocument` record
- `domain/Supplier/Actions/V2/Onboarding/CompleteDocuments.php` — validates all required docs uploaded, records `documents_completed_at`
- `domain/Supplier/Actions/V2/Onboarding/SignAgreement.php` — creates `SupplierAgreement`, records `agreement_signed_at`, transitions portal stage to PENDING_VERIFICATION if all steps complete
- `domain/Supplier/Actions/V2/Onboarding/SaveDraft.php` — upserts draft data for a step
- `domain/Supplier/Actions/V2/Onboarding/GetOnboardingStatus.php` — computes current step, completed steps, portal stage
- `domain/Supplier/Actions/V2/Entity/CreateSupplierEntity.php` — creates new Supplier under existing Organisation with fresh SupplierOnboarding
- `domain/Supplier/Actions/V2/Verification/RunLiteVerification.php` — checks documents status + EFTSure status, transitions to VERIFIED if all green
- `domain/Supplier/Actions/V2/Verification/TriggerEftSureVerification.php` — initiates EFTSure API call
- `domain/Supplier/Actions/V2/Verification/ProcessEftSureWebhook.php` — handles EFTSure callback, updates stage

**Services:**
- `domain/Supplier/Services/V2/AbrService.php` — wraps ABR API HTTP calls, parses XML response, handles timeouts
- `domain/Supplier/Services/V2/EftSureService.php` — wraps EFTSure API calls
- `domain/Supplier/Services/V2/DocumentRequirementService.php` — determines required documents per supplier type and service category (FR-016)
- `domain/Supplier/Services/V2/PortalStageTransitionService.php` — enforces valid state transitions per FR-025 through FR-035

**API Resources:**
- `domain/Supplier/Http/Resources/V2/SupplierResource.php`
- `domain/Supplier/Http/Resources/V2/OnboardingStatusResource.php`
- `domain/Supplier/Http/Resources/V2/SupplierDocumentResource.php`
- `domain/Supplier/Http/Resources/V2/SupplierAgreementResource.php`
- `domain/Supplier/Http/Resources/V2/VerificationStatusResource.php`
- `domain/Supplier/Http/Resources/V2/BankVerificationResource.php`
- `domain/Supplier/Http/Resources/V2/AbnLookupResource.php`

All actions use the `AsAction` trait from Lorisleiva/Actions. All data classes use `#[MapName(SnakeCaseMapper::class)]` per existing convention.

### Phase 3: Backend — Controllers & Routes

**Controllers:**
- `domain/Supplier/Http/Controllers/V2/AbnLookupController.php` — `lookup()`
- `domain/Supplier/Http/Controllers/V2/RegistrationController.php` — `register()`, `checkAbn()`
- `domain/Supplier/Http/Controllers/V2/SupplierEntityController.php` — `index()`, `store()`
- `domain/Supplier/Http/Controllers/V2/OnboardingController.php` — `status()`, `getDraft()`, `saveDraft()`
- `domain/Supplier/Http/Controllers/V2/OnboardingBusinessController.php` — `complete()`
- `domain/Supplier/Http/Controllers/V2/OnboardingLocationController.php` — `index()`, `complete()`, `update()`, `destroy()`
- `domain/Supplier/Http/Controllers/V2/OnboardingPricingController.php` — `complete()`
- `domain/Supplier/Http/Controllers/V2/OnboardingDocumentController.php` — `upload()`, `destroy()`, `complete()`
- `domain/Supplier/Http/Controllers/V2/OnboardingAgreementController.php` — `index()`, `sign()`
- `domain/Supplier/Http/Controllers/V2/VerificationController.php` — `status()`, `bankStatus()`
- `domain/Supplier/Http/Controllers/V2/StaffVerificationController.php` — `queue()`, `review()`
- `domain/Supplier/Http/Controllers/V2/StaffDocumentController.php` — `approve()`, `reject()`

**Routes:** `domain/Supplier/Routes/v2/supplierV2Routes.php`

Registered via `RouteServiceProvider` under `/api/v2/` prefix with Sanctum middleware (except registration endpoints which are public with rate limiting + reCAPTCHA).

**Middleware:**
- `EnsureSupplierContext` — verifies active supplier context header on supplier-scoped endpoints (from SR0)
- `EnsureOnboardingAccess` — verifies supplier is in an onboarding-eligible portal stage
- Rate limiting: 5 requests/minute on registration, 10 requests/minute on ABN lookup

**Policies:**
- `domain/Supplier/Policies/V2/SupplierEntityPolicy.php` — Organisation Administrator can create/list
- `domain/Supplier/Policies/V2/SupplierDocumentPolicy.php` — supplier owner can upload; Compliance staff can approve/reject
- `domain/Supplier/Policies/V2/OnboardingPolicy.php` — supplier owner can complete steps

### Phase 4: Backend — EFTSure Integration & Verification

**Webhook endpoint:**
```
POST   /api/v2/webhooks/eftsure              → EftSureWebhookController@handle
```

Secured via HMAC signature verification from EFTSure.

**Queue jobs:**
- `domain/Supplier/Jobs/V2/TriggerEftSureVerificationJob.php` — dispatched when agreement signed, calls EFTSure API
- `domain/Supplier/Jobs/V2/RetryEftSureVerificationJob.php` — retry with exponential backoff if EFTSure unavailable
- `domain/Supplier/Jobs/V2/RunLiteVerificationJob.php` — dispatched after EFTSure responds or documents approved, checks if auto-verify conditions met
- `domain/Supplier/Jobs/V2/SendOnboardingReminderJob.php` — sends reminder emails at 3, 7, 14 days of inactivity

**Scheduled commands:**
- `CheckStaleOnboardingsCommand` — flags onboardings inactive > 30 days for cleanup review

### Phase 5: Frontend — Registration Page

**Files to create in supplier-portal:**
- `src/app/(public)/register/page.tsx` — registration page
- `src/components/registration/AbnLookupField/AbnLookupField.tsx`
- `src/components/registration/AbnLookupField/AbnInput.tsx`
- `src/components/registration/AbnLookupField/BusinessNameDropdown.tsx`
- `src/components/registration/AbnLookupField/AbnError.tsx`
- `src/hooks/use-abn-lookup.ts`
- `src/types/abr.ts`

**Shadcn components to install:** `Input`, `Button`, `Select`, `Alert`, `Skeleton`, `Card`, `Label`

**Behaviour:**
- ABN field auto-formats with spaces as user types
- Debounced ABR lookup after valid 11-digit ABN (500ms)
- Duplicate ABN check before form submission
- reCAPTCHA v3 invisible verification on submit
- On success: store token, redirect to onboarding

### Phase 6: Frontend — Onboarding Wizard

**Files to create:**
- `src/app/(auth)/onboarding/layout.tsx` — OnboardingProgress sidebar/stepper + step content area
- `src/app/(auth)/onboarding/page.tsx` — redirect to current step
- `src/app/(auth)/onboarding/business/page.tsx`
- `src/app/(auth)/onboarding/locations/page.tsx`
- `src/app/(auth)/onboarding/pricing/page.tsx`
- `src/app/(auth)/onboarding/documents/page.tsx`
- `src/app/(auth)/onboarding/agreements/page.tsx`
- `src/components/onboarding/OnboardingProgress/OnboardingProgress.tsx`
- `src/components/onboarding/OnboardingProgress/DesktopSidebar.tsx`
- `src/components/onboarding/OnboardingProgress/MobileStepper.tsx`
- `src/components/onboarding/OnboardingProgress/StepIndicator.tsx`
- `src/components/onboarding/OnboardingProgress/CompletionSummary.tsx`
- `src/components/onboarding/DocumentUploadChecklist/DocumentUploadChecklist.tsx`
- `src/components/onboarding/DocumentUploadChecklist/DocumentSection.tsx`
- `src/components/onboarding/DocumentUploadChecklist/DocumentItem.tsx`
- `src/components/onboarding/AgreementViewer/AgreementViewer.tsx`
- `src/components/onboarding/AgreementViewer/AgreementText.tsx`
- `src/components/onboarding/AgreementViewer/ConsentForm.tsx`
- `src/components/onboarding/AgreementViewer/AgreementHeader.tsx`
- `src/components/ui/file-uploader.tsx` — general-purpose file upload component
- `src/hooks/use-onboarding.ts`
- `src/hooks/use-draft-autosave.ts`
- `src/hooks/use-file-upload.ts`
- `src/hooks/use-google-places.ts`
- `src/types/onboarding.ts`
- `src/types/documents.ts`
- `src/types/agreements.ts`
- `src/types/locations.ts`

**Additional Shadcn components to install:** `RadioGroup`, `Checkbox`, `Badge`, `Accordion`, `ScrollArea`, `Progress`, `Separator`

**Step navigation:**
- First pass: sequential only (forward + back, no skip). Progress indicator shows steps but clicking upcoming steps is disabled.
- After all steps completed once: all steps freely navigable via progress indicator clicks.
- URL routing: `/onboarding/business`, `/onboarding/locations`, etc. — direct URL access checks step eligibility via `use-onboarding` hook and redirects to current step if not yet unlocked.

**Draft auto-save:**
- Each step page uses `use-draft-autosave` hook
- Saves on input blur and every 30 seconds if data changed
- Draft loaded on step mount — pre-fills form
- "Welcome back" banner on return visit (CL-001)

**Step transitions:**
- CSS slide-left/slide-right animation between steps
- Skeleton loading state during step content fetch

### Phase 7: Frontend — Verification Dashboard

**Files to create:**
- `src/app/(auth)/verification/page.tsx`
- `src/components/verification/VerificationStatusCard/VerificationStatusCard.tsx`
- `src/components/verification/VerificationStatusCard/StatusItem.tsx`
- `src/components/verification/VerificationStatusCard/TimelineEstimate.tsx`
- `src/components/verification/VerificationStatusCard/DashboardPreview.tsx`
- `src/components/verification/EftSureIndicator/EftSureIndicator.tsx`
- `src/components/verification/EftSureIndicator/StageDotsRow.tsx`
- `src/components/verification/EftSureIndicator/StatusMessage.tsx`
- `src/hooks/use-verification-poll.ts`
- `src/types/verification.ts`

**Behaviour:**
- Polls `/verification/status` every 30 seconds
- Read-only dashboard preview links (FR-026)
- EFTSure indicator shows traffic-light progression

### Phase 8: Frontend — Organisation Dashboard & Tier 2

**Files to create:**
- `src/app/(auth)/dashboard/page.tsx` — supplier entity cards with onboarding progress + portal stage
- `src/components/dashboard/SupplierEntityCard.tsx` — card showing trading name, portal stage badge, onboarding progress, manage/continue CTA
- `src/components/dashboard/AddSupplierDialog.tsx` — dialog for creating new supplier entity (trading name + service delivery model)

### Phase 9: Testing & Polish

See Testing Strategy below.

---

## Testing Strategy

### Backend (Pest v3)

**Approach**: Pest feature tests per controller/action. Tests written alongside each phase.

| Test File | Coverage |
|-----------|----------|
| `tests/Feature/Supplier/V2/Registration/RegisterSupplierTest.php` | FR-001, FR-002, FR-003, FR-004, FR-007 |
| `tests/Feature/Supplier/V2/Registration/AbnLookupTest.php` | FR-001, ABR API unavailable edge case |
| `tests/Feature/Supplier/V2/Entity/CreateSupplierEntityTest.php` | FR-005, FR-006 |
| `tests/Feature/Supplier/V2/Onboarding/BusinessDetailsTest.php` | FR-010, FR-011, FR-012, FR-031 |
| `tests/Feature/Supplier/V2/Onboarding/LocationsTest.php` | FR-010, FR-011, FR-014 |
| `tests/Feature/Supplier/V2/Onboarding/PricingTest.php` | FR-010, FR-011 |
| `tests/Feature/Supplier/V2/Onboarding/DocumentsTest.php` | FR-011, FR-016, FR-017, FR-018 |
| `tests/Feature/Supplier/V2/Onboarding/AgreementsTest.php` | FR-011, FR-015, FR-032 |
| `tests/Feature/Supplier/V2/Onboarding/DraftTest.php` | FR-012 |
| `tests/Feature/Supplier/V2/Verification/LiteVerificationTest.php` | FR-020, FR-025, FR-033 |
| `tests/Feature/Supplier/V2/Verification/HeavyVerificationTest.php` | FR-021, FR-024, FR-034, FR-035 |
| `tests/Feature/Supplier/V2/Verification/EftSureWebhookTest.php` | FR-022, FR-023 |
| `tests/Feature/Supplier/V2/Verification/StaffReviewTest.php` | FR-021, FR-024 |
| `tests/Feature/Supplier/V2/PortalStageTransitionTest.php` | FR-030 through FR-035 |
| `tests/Unit/Supplier/Services/V2/AbrServiceTest.php` | ABR API parsing, error handling |
| `tests/Unit/Supplier/Services/V2/DocumentRequirementServiceTest.php` | FR-016 document matrix |
| `tests/Unit/Supplier/Services/V2/PortalStageTransitionServiceTest.php` | State machine validation |

**Execution:**
```bash
php artisan test --compact --filter=V2
php artisan test --compact --filter=Registration
php artisan test --compact --filter=Onboarding
php artisan test --compact --filter=Verification
```

### Frontend (Vitest + React Testing Library)

| Test File | Coverage |
|-----------|----------|
| `src/__tests__/components/AbnLookupField.test.tsx` | ABN formatting, debounce, dropdown, error states |
| `src/__tests__/components/OnboardingProgress.test.tsx` | Step states, desktop/mobile rendering, navigation |
| `src/__tests__/components/DocumentUploadChecklist.test.tsx` | Upload, status display, rejection, org-level sharing |
| `src/__tests__/components/AgreementViewer.test.tsx` | Scroll tracking, consent, sign button enable |
| `src/__tests__/components/EftSureIndicator.test.tsx` | Stage dot states, refusal message |
| `src/__tests__/hooks/use-onboarding.test.ts` | Step navigation, completion, error handling |
| `src/__tests__/hooks/use-draft-autosave.test.ts` | Save timing, debounce, load |
| `src/__tests__/pages/register.test.tsx` | Registration flow E2E |
| `src/__tests__/pages/onboarding.test.tsx` | Step progression E2E |

### Integration Testing

- ABR API: Mock at `AbrService` level in tests; manual integration test against ABR sandbox
- EFTSure: Mock at `EftSureService` level; webhook tests use signed payloads
- Google Places: Mock at hook level; manual verification on staging

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| ABR API unavailable blocks registration entirely | Medium | High | Clear error message, retry button, monitoring alerts. No fallback (manual ABN entry not permitted per spec). |
| EFTSure slow response delays verification | Medium | Medium | Async queue jobs with exponential backoff retry. Supplier sees "pending" status, not blocked from dashboard preview. |
| Google Places API cost at scale | Low | Medium | Debounce + session tokens to reduce API calls. Monitor usage. Fallback to manual address entry if budget exceeded. |
| Organisation-level document sharing logic complex | Medium | Medium | Clear `scope` column differentiates org vs supplier docs. `DocumentRequirementService` handles the matrix. Thorough tests for FR-017/FR-018. |
| Sequential onboarding too rigid — suppliers abandon | Medium | High | Auto-save drafts, reminder emails (3/7/14 days), deep-links to exact step. SC-002 target: 60% completion within 14 days (up from ~38%). |
| Split-stack API latency (separate frontend/backend) | Low | Medium | API responses are JSON (small payloads). CDN for frontend static assets. Keep API responses lean with sparse API Resources. |
| Portal stage state machine has invalid transitions | Low | High | `PortalStageTransitionService` enforces valid transitions. Unit tests cover every valid and invalid transition combination. |
| Mobile onboarding failures (iPhone-specific bugs from current system) | Medium | High | Token-based auth eliminates session issues. Touch targets 48px minimum. Test on real iOS devices in QA. |
| reCAPTCHA v3 false positives blocking legitimate registrations | Low | Medium | Log reCAPTCHA scores. Set threshold conservatively (0.3 not 0.5). Monitoring for registration failure rate. |
| Existing supplier data conflict when adding v2 models | Low | Medium | v2 endpoints and models are additive — no existing table modifications except one new column on `suppliers`. Existing v1 flow continues to work. |

---

## Gate 3: Architecture Gate

**Gate definition**: [`.tc-wow/gates/03-architecture.md`](/ways-of-working/gates/03-architecture)
**Date**: 2026-03-19
**Status**: PASS

### 1. Technical Feasibility

| Check | Status | Evidence |
|-------|--------|---------|
| Architecture approach clear | [x] PASS | Split-stack: Laravel v2 API (tc-portal) + Next.js React SPA (supplier-portal). Follows SR0 foundation. |
| Existing patterns leveraged | [x] PASS | Existing `Supplier`, `Organisation`, `SupplierOnboarding`, `PortalStageEnum` models extended — not replaced. Lorisleiva Actions, Laravel Data DTOs, API Resources all follow existing conventions. |
| No impossible requirements | [x] PASS | All FR-001 through FR-035 buildable. ABR API, EFTSure, Google Places all have documented APIs. |
| Performance considered | [x] PASS | Composite indexes on all query-heavy tables. Draft auto-save debounced. Verification polling at 30s (not real-time). |
| Security considered | [x] PASS | Sanctum tokens, reCAPTCHA on registration, encrypted bank details, Policies on all endpoints, HMAC webhook verification. |

### 2. Data & Integration

| Check | Status | Evidence |
|-------|--------|---------|
| Data model understood | [x] PASS | 4 new tables, 1 column addition. Existing tables leveraged where possible. |
| API contracts clear | [x] PASS | 20+ endpoints with input/output defined. JSON envelope format from SR0. |
| Dependencies identified | [x] PASS | SR0 foundation, ABR API, EFTSure API, Google Places API, reCAPTCHA v3. |
| Integration points mapped | [x] PASS | Existing Organisation, Supplier, Business, Document models. EFTSure webhook. Reminder email jobs. |
| DTO persistence explicit | [x] PASS | Actions receive typed Data classes, map explicitly to model `create()`/`update()` — no `->toArray()` passthrough. |

### 3. Implementation Approach

| Check | Status | Evidence |
|-------|--------|---------|
| File changes identified | [x] PASS | 9 phases with all files listed — backend and frontend. |
| Risk areas noted | [x] PASS | 10 risks in Risk Assessment table with mitigations. |
| Testing approach defined | [x] PASS | Pest v3 backend (17 test files), Vitest frontend (9 test files). |
| Rollback possible | [x] PASS | New v2 endpoints — v1 untouched. Migrations are reversible. Frontend is a separate app — can revert independently. |

### 4. Resource & Scope

| Check | Status | Evidence |
|-------|--------|---------|
| Scope matches spec | [x] PASS | All P1 stories in Phases 1-8. P2 (heavy verification, EFTSure) in Phase 4/7. P3 (invitations) explicitly deferred to Phase 3 of the epic. |
| Effort reasonable | [x] PASS | Large build but well-decomposed into 9 phases. Most backend patterns mirror existing codebase. |
| Skills available | [x] PASS | Laravel + React + Next.js — team capabilities confirmed. |

### 5. Laravel & Cross-Platform Best Practices

| Check | Status | Evidence |
|-------|--------|---------|
| No hardcoded business logic in frontend | [x] PASS | Document requirements from `DocumentRequirementService`. Portal stages from API. Step sequence from backend onboarding status. |
| Cross-platform reusability | [x] PASS | All logic in Actions + Services. JSON API consumed by React SPA — could equally be consumed by mobile app. |
| Laravel Data for validation | [x] PASS | 8 Data classes handle server-side validation. |
| Model route binding | [x] PASS | Controllers use typed model parameters via route binding. |
| No magic numbers/IDs | [x] PASS | All constants via enums. Rate limits, file size limits, retry intervals as class constants. |
| Common components pure | [x] PASS | `FileUploader` is a general-purpose UI component with zero business logic. Domain components are separate. |
| Use Lorisleiva Actions (AsAction trait) | [x] PASS | 15 actions all use `AsAction`. |
| Action authorization in authorize() | [x] PASS | Auth checks in action `authorize()` method, returning `Response::allow()`/`Response::deny()`. |
| Data classes remain anemic | [x] PASS | DTOs have properties + validation rules only. Business logic in Actions and Services. |
| Migrations schema-only | [x] PASS | No seed data in migrations. |
| Models have single responsibility | [x] PASS | New models each own one domain concept (document, agreement, bank verification, draft). |
| Granular model policies | [x] PASS | Separate policies for SupplierEntity, SupplierDocument, Onboarding. |
| Response objects in auth | [x] PASS | Policies return `Response::allow()` / `Response::deny('reason')`. |
| Semantic column documentation | [x] PASS | PHPDoc on all model properties. |

### 6. React TypeScript Standards (Frontend Architecture)

**Note**: This section replaces the Vue TypeScript Standards section from the gate template because the supplier-portal is a React/Next.js application, not Vue/Inertia.

| Check | Status | Evidence |
|-------|--------|---------|
| All components use TypeScript | [x] PASS | Every `.tsx` file uses TypeScript. No `.jsx` files. |
| Props use named types | [x] PASS | Plan defines `type Props = { ... }` for every component. |
| No `any` types planned | [x] PASS | All API response shapes have TypeScript types in `src/types/`. |
| Shared types identified | [x] PASS | 9 type files in `src/types/` covering all data shapes. |
| Shadcn components reused | [x] PASS | Plan specifies which Shadcn components to install and reuse per feature component. |
| New components assessed for common eligibility | [x] PASS | `FileUploader` built as general `src/components/ui/file-uploader.tsx`. Domain-specific components (DocumentItem, StepIndicator) kept bespoke with reasoning. |
| Form state management clear | [x] PASS | `use-onboarding` hook manages step state. `use-draft-autosave` handles persistence. React Hook Form or native form state per step (no global state library). |
| Per-step validation | [x] PASS | Each step page validates before allowing Continue. Server-side validation errors mapped to form fields via `stepErrors` from `use-onboarding`. |

**Red flags checked (React equivalents)**:
- No components without TypeScript
- No `any` types for backend data
- No prop-drilling without types
- No global state (Redux/Zustand) where local state or hooks suffice
- No form state duplication between hooks and global store

### 7. Component Decomposition (Frontend Architecture)

| Check | Status | Evidence |
|-------|--------|---------|
| Component decomposition planned | [x] PASS | 6 major components decomposed with sub-components listed: OnboardingProgress (4 sub), AbnLookupField (3 sub), EftSureIndicator (2 sub), VerificationStatusCard (3 sub), DocumentUploadChecklist (3 sub), AgreementViewer (3 sub). |
| Each sub-component has single concern | [x] PASS | e.g., `StepIndicator` renders one step circle; `AbnInput` handles formatted input; `ConsentForm` handles checkbox + name + sign button. |
| Parent owns logic | [x] PASS | Parents handle API calls, state management, validation. Sub-components receive data via props. |
| Directory structure defined | [x] PASS | `src/components/{feature}/{ComponentName}/` pattern for all decomposed components. |
| Naming is simple | [x] PASS | Sub-components use short names (e.g., `StageDotsRow`, not `EftSureIndicatorStageDotsRow`). |
| No template section comments planned | [x] PASS | Each distinct concern is its own component. |

### 8. Composition-Based Component Architecture (Frontend Architecture)

| Check | Status | Evidence |
|-------|--------|---------|
| Composables (hooks) identified | [x] PASS | 8 custom hooks encapsulate reusable logic: `use-api`, `use-auth`, `use-abn-lookup`, `use-onboarding`, `use-draft-autosave`, `use-file-upload`, `use-verification-poll`, `use-google-places`. |
| Primitives are single-purpose | [x] PASS | `StepIndicator`, `AbnInput`, `StageDotsRow`, `StatusItem` — each does one thing. |
| General-purpose UI components identified | [x] PASS | `FileUploader` as `src/components/ui/file-uploader.tsx` — reusable across the app. |
| No prop-driven toggle components | [x] PASS | OnboardingProgress uses `DesktopSidebar` and `MobileStepper` as separate sub-components — not a single component with `variant="desktop"/"mobile"` prop. |

---

**Ready to Implement**: YES — pending SR0 (API Foundation & Auth) completion.

## Next Steps

1. Complete SR0 (API Foundation) — v2 routing, Sanctum tokens, two-tier roles
2. Generate `tasks.md` — dependency-ordered task list
3. Begin Phase 1 (migrations) once SR0 is merged
4. Sophie Pickett to provide document requirements matrix by supplier type/service — required before Phase 2 `DocumentRequirementService` implementation
5. Vishal to finalise progress indicator redesign — Phase 6 `OnboardingProgress` component may need adjustment
