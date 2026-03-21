---
title: "Implementation Plan: Agreements & Compliance"
---

# Implementation Plan: Agreements & Compliance

**Branch**: `sr5-agreements-compliance` | **Date**: 2026-03-19
**Spec**: [spec.md](/initiatives/supplier-redone/sr5-agreements-compliance/spec)
**Design**: [design.md](/initiatives/supplier-redone/sr5-agreements-compliance/design)
**Dependencies**: SR0 (API Foundation), SR1 (Registration & Onboarding), SR2 (Profile & Org Management)
**Status**: Draft

## Summary

This plan implements the Agreements & Compliance module for the Supplier REDONE initiative across three phases:

- **Phase 1 (P1)**: APA digital signing, APA amendments with AI-assisted drafting, TPC agreement upload
- **Phase 2 (P2)**: Self-termination flow, government register checks, EFTSure fraud indicators, compliance notifications
- **Phase 3 (P3)**: Credentialing matrix configuration

The frontend is a standalone React (Next.js) application consuming a Laravel v2 API. All business logic lives server-side — the React frontend is purely presentational. Feature flags gate each capability independently.

---

## Technical Context

### Technology Stack

| Layer | Technology | Version |
|-------|------------|---------|
| Backend | Laravel | 12 |
| PHP | PHP | 8.4 |
| Frontend | React (Next.js) | 16 |
| UI Library | shadcn/ui + Tailwind CSS | v4 |
| Database | MySQL | 8.x |
| Testing (Backend) | Pest | v3 |
| Testing (Frontend) | Vitest + React Testing Library | latest |
| Queue | Laravel Horizon | v5 |
| AI (Amendment Drafting) | OpenAI API (via Laravel) | GPT-4o |
| Signature Capture | react-signature-canvas | latest |

### Dependencies

**SR0 — API Foundation (required)**:
- v2 API versioning (`/api/v2/`) with standard envelope responses
- Token-based auth (Sanctum) with role hierarchy
- Supplier context switching (active supplier entity scoping)
- Rate limiting middleware

**SR1 — Registration & Onboarding (required)**:
- Supplier entity creation and onboarding status machine
- Re-onboarding flow (used when reactivation window expires)

**SR2 — Profile & Org Management (required)**:
- Supplier profile data (legal name, ABN, address — pre-populated into APA)
- Organisation → Supplier Entity two-tier model
- Document upload infrastructure (insurance, certifications)
- Bank detail management (EFTSure hooks into this)

**External Integrations (new)**:
- **AHPRA API** — Practitioner registration lookup by registration number
- **NDIS Quality & Safeguards Commission** — Banning orders register
- **Aged Care Quality & Safety Commission** — Banning orders register
- **AFRA** — Approved Financial Representatives register
- **EFTSure API** — Bank account fraud risk scoring (green/yellow/red)
- **OpenAI API** — Amendment drafting suggestions (GPT-4o via Laravel)

### Constraints

**Performance**:
- APA text rendering must handle documents up to 50 pages without scroll jank
- Government register checks must complete within 30 seconds per supplier
- Compliance dashboard must load summary stats for 500+ suppliers in < 2 seconds
- AI draft suggestions must return within 10 seconds

**Security**:
- Digital signatures stored encrypted at rest
- AI amendment drafting must not leak other suppliers' clause data (isolated context per request)
- Government register API keys stored in vault, never exposed to frontend
- EFTSure indicators are staff-only — suppliers never see their own fraud score
- Payment block/unblock requires audit trail

---

## Design Decisions

### Data Model

#### New Tables

**`agreements`**

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| `id` | BIGINT UNSIGNED | NO | PK |
| `supplier_entity_id` | BIGINT UNSIGNED | NO | FK to supplier_entities |
| `type` | VARCHAR(20) | NO | `apa` or `tpc` |
| `version` | VARCHAR(20) | NO | e.g. `3.2` |
| `status` | VARCHAR(20) | NO | `draft`, `active`, `expired`, `superseded` |
| `signed_at` | TIMESTAMP | YES | When digitally signed |
| `signer_name` | VARCHAR(255) | YES | Full name of signer |
| `signer_position` | VARCHAR(255) | YES | Role/title of signer |
| `signature_data` | TEXT | YES | Encrypted signature image data |
| `signed_by_user_id` | BIGINT UNSIGNED | YES | FK to users (authenticated signer) |
| `expires_at` | TIMESTAMP | YES | Agreement expiry date |
| `created_at` | TIMESTAMP | NO | |
| `updated_at` | TIMESTAMP | NO | |

Indexes: `INDEX (supplier_entity_id, type, status)`, `INDEX (status, expires_at)`

**Agreement vs Assessment Expiry (cross-epic clarification with SR6)**:
- **Agreement expiry** (this table's `expires_at`): Agreements (APA/TPC) have their own expiry lifecycle independent of assessments. When an APA expires, the supplier is prompted to re-sign. TPCs remain valid across APA version changes (spec clarification Q5).
- **Assessment expiry** (SR6 `assessments.expires_at`): Assessments expire 12 months after approval if not actioned. Expiry prevents new product linkages but does NOT void in-progress bills.
- **Relationship**: These are **independent expiry lifecycles**. An agreement can be valid while an assessment is expired (supplier can still deliver services, just can't bill against that specific assessment). An assessment can be valid while the agreement is expired (assessment exists but supplier cannot operate until APA is re-signed). Both must be valid simultaneously for a product bill to be submitted.

**`agreement_versions`**

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| `id` | BIGINT UNSIGNED | NO | PK |
| `type` | VARCHAR(20) | NO | `apa` or `tpc` |
| `version` | VARCHAR(20) | NO | Version number |
| `content` | LONGTEXT | NO | Full agreement text (structured JSON with clauses) |
| `changelog` | TEXT | YES | Diff summary from previous version |
| `published_at` | TIMESTAMP | YES | When this version became active |
| `created_at` | TIMESTAMP | NO | |
| `updated_at` | TIMESTAMP | NO | |

Indexes: `UNIQUE (type, version)`, `INDEX (type, published_at)`

**`agreement_clauses`**

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| `id` | BIGINT UNSIGNED | NO | PK |
| `agreement_version_id` | BIGINT UNSIGNED | NO | FK to agreement_versions |
| `clause_number` | VARCHAR(20) | NO | e.g. `5.1` |
| `title` | VARCHAR(255) | NO | Clause heading |
| `content` | TEXT | NO | Full clause text |
| `is_locked` | BOOLEAN | NO | Non-negotiable if true |
| `sort_order` | INT UNSIGNED | NO | Display ordering |
| `created_at` | TIMESTAMP | NO | |
| `updated_at` | TIMESTAMP | NO | |

Indexes: `INDEX (agreement_version_id, sort_order)`, `INDEX (agreement_version_id, is_locked)`

**`amendment_requests`**

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| `id` | BIGINT UNSIGNED | NO | PK |
| `agreement_id` | BIGINT UNSIGNED | NO | FK to agreements |
| `agreement_clause_id` | BIGINT UNSIGNED | NO | FK to agreement_clauses |
| `requested_by_user_id` | BIGINT UNSIGNED | NO | FK to users |
| `original_text` | TEXT | NO | Clause text at time of request |
| `proposed_text` | TEXT | NO | Supplier's proposed change |
| `justification` | TEXT | NO | Supplier's reason for change |
| `ai_draft_text` | TEXT | YES | AI-generated suggestion (if used) |
| `ai_draft_used` | BOOLEAN | NO | Whether supplier accepted AI draft |
| `status` | VARCHAR(20) | NO | `pending`, `approved`, `approved_with_modifications`, `declined` |
| `decision_text` | TEXT | YES | Modified text (if approved_with_modifications) or decline reason |
| `decided_by_user_id` | BIGINT UNSIGNED | YES | FK to users (TC staff) |
| `decided_at` | TIMESTAMP | YES | Decision timestamp |
| `supplier_acknowledged_at` | TIMESTAMP | YES | When supplier acknowledged modified text |
| `created_at` | TIMESTAMP | NO | |
| `updated_at` | TIMESTAMP | NO | |

Indexes: `INDEX (agreement_id, status)`, `INDEX (agreement_clause_id, status)`, `INDEX (status, created_at)`

**`tpc_agreements`**

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| `id` | BIGINT UNSIGNED | NO | PK |
| `agreement_id` | BIGINT UNSIGNED | NO | FK to agreements |
| `consumer_id` | BIGINT UNSIGNED | NO | FK to consumers |
| `care_package_id` | BIGINT UNSIGNED | NO | FK to care_packages |
| `document_path` | VARCHAR(500) | NO | S3 path to uploaded document |
| `document_name` | VARCHAR(255) | NO | Original filename |
| `approval_status` | VARCHAR(20) | NO | `pending`, `approved`, `rejected` |
| `approved_by_user_id` | BIGINT UNSIGNED | YES | FK to users (TC staff) |
| `approved_at` | TIMESTAMP | YES | Approval timestamp |
| `is_active` | BOOLEAN | NO | False if consumer discharged or TPC withdrawn |
| `created_at` | TIMESTAMP | NO | |
| `updated_at` | TIMESTAMP | NO | |

Indexes: `INDEX (agreement_id)`, `UNIQUE (consumer_id, care_package_id, agreement_id)`, `INDEX (approval_status)`

**`termination_requests`**

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| `id` | BIGINT UNSIGNED | NO | PK |
| `supplier_entity_id` | BIGINT UNSIGNED | NO | FK to supplier_entities |
| `requested_by_user_id` | BIGINT UNSIGNED | NO | FK to users |
| `reason_code` | VARCHAR(50) | NO | One of 15 predefined criteria codes |
| `reason_category` | VARCHAR(30) | NO | `business`, `relationship`, `compliance` |
| `risk_tier` | VARCHAR(20) | NO | `low`, `conditional`, `high` |
| `additional_context` | TEXT | YES | Optional supplier notes |
| `status` | VARCHAR(20) | NO | `pending_review`, `approved`, `declined`, `processed` |
| `reviewed_by_user_id` | BIGINT UNSIGNED | YES | FK to users (QA/compliance) |
| `reviewed_at` | TIMESTAMP | YES | Review timestamp |
| `review_notes` | TEXT | YES | Reviewer comments |
| `terminated_at` | TIMESTAMP | YES | When entity was actually deactivated |
| `reactivation_eligible_until` | TIMESTAMP | YES | 12 months from terminated_at |
| `reactivated_at` | TIMESTAMP | YES | If/when entity was reactivated |
| `created_at` | TIMESTAMP | NO | |
| `updated_at` | TIMESTAMP | NO | |

Indexes: `INDEX (supplier_entity_id, status)`, `INDEX (risk_tier, status)`, `INDEX (reactivation_eligible_until)`

**`termination_criteria`**

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| `id` | BIGINT UNSIGNED | NO | PK |
| `code` | VARCHAR(50) | NO | Unique criterion code |
| `label` | VARCHAR(255) | NO | Human-readable description |
| `category` | VARCHAR(30) | NO | `business`, `relationship`, `compliance` |
| `risk_tier` | VARCHAR(20) | NO | `low`, `conditional`, `high` |
| `sort_order` | INT UNSIGNED | NO | Display ordering within category |
| `is_active` | BOOLEAN | NO | Soft toggle |
| `created_at` | TIMESTAMP | NO | |
| `updated_at` | TIMESTAMP | NO | |

Indexes: `UNIQUE (code)`, `INDEX (category, sort_order)`

**`compliance_checks`**

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| `id` | BIGINT UNSIGNED | NO | PK |
| `register_type` | VARCHAR(30) | NO | `ahpra`, `ndis_banning`, `aged_care_banning`, `afra` |
| `subject_type` | VARCHAR(30) | NO | `supplier_entity`, `worker`, `key_personnel` |
| `subject_id` | BIGINT UNSIGNED | NO | Polymorphic FK (supplier_entity or worker) |
| `subject_identifier` | VARCHAR(100) | NO | ABN, practitioner number, etc. |
| `result` | VARCHAR(20) | NO | `clear`, `flagged`, `error`, `pending` |
| `result_details` | JSON | YES | Raw API response summary |
| `payment_block_applied` | BOOLEAN | NO | Whether this check triggered a payment block |
| `checked_at` | TIMESTAMP | NO | When check was performed |
| `checked_by` | VARCHAR(20) | NO | `scheduled`, `manual` |
| `manual_trigger_user_id` | BIGINT UNSIGNED | YES | FK to users (if manually triggered) |
| `created_at` | TIMESTAMP | NO | |
| `updated_at` | TIMESTAMP | NO | |

Indexes: `INDEX (subject_type, subject_id, register_type)`, `INDEX (result, checked_at)`, `INDEX (payment_block_applied)`

**`payment_blocks`**

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| `id` | BIGINT UNSIGNED | NO | PK |
| `supplier_entity_id` | BIGINT UNSIGNED | NO | FK to supplier_entities |
| `reason_type` | VARCHAR(30) | NO | `register_flag`, `eftsure_red`, `manual` |
| `compliance_check_id` | BIGINT UNSIGNED | YES | FK to compliance_checks (if register-triggered) |
| `blocked_at` | TIMESTAMP | NO | When block was applied |
| `blocked_by_user_id` | BIGINT UNSIGNED | YES | FK to users (if manual) |
| `lifted_at` | TIMESTAMP | YES | When block was removed |
| `lifted_by_user_id` | BIGINT UNSIGNED | YES | FK to users |
| `lift_reason` | TEXT | YES | Reason for lifting block |
| `created_at` | TIMESTAMP | NO | |
| `updated_at` | TIMESTAMP | NO | |

Indexes: `INDEX (supplier_entity_id, lifted_at)`, `INDEX (reason_type, lifted_at)`

**`eftsure_checks`**

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| `id` | BIGINT UNSIGNED | NO | PK |
| `supplier_entity_id` | BIGINT UNSIGNED | NO | FK to supplier_entities |
| `indicator` | VARCHAR(10) | NO | `green`, `yellow`, `red`, `pending` |
| `previous_indicator` | VARCHAR(10) | YES | Previous status (for change detection) |
| `raw_response` | JSON | YES | EFTSure API response |
| `manual_override` | BOOLEAN | NO | Whether staff overrode the indicator |
| `override_by_user_id` | BIGINT UNSIGNED | YES | FK to users |
| `override_reason` | TEXT | YES | Audit trail for override |
| `checked_at` | TIMESTAMP | NO | When check was performed |
| `created_at` | TIMESTAMP | NO | |
| `updated_at` | TIMESTAMP | NO | |

Indexes: `INDEX (supplier_entity_id, checked_at DESC)`, `INDEX (indicator)`

**`credentialing_requirements`**

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| `id` | BIGINT UNSIGNED | NO | PK |
| `supplier_type` | VARCHAR(50) | NO | e.g. `allied_health`, `nursing`, `domestic` |
| `service_category` | VARCHAR(50) | YES | NULL = applies to all categories for this type |
| `document_type` | VARCHAR(100) | NO | e.g. `ahpra_registration`, `public_liability` |
| `document_label` | VARCHAR(255) | NO | Display name |
| `is_required` | BOOLEAN | NO | Required vs optional |
| `expiry_tracked` | BOOLEAN | NO | Whether expiry notifications apply |
| `notification_thresholds` | JSON | NO | e.g. `[30, 14, 7]` days before expiry |
| `is_active` | BOOLEAN | NO | Soft toggle |
| `created_at` | TIMESTAMP | NO | |
| `updated_at` | TIMESTAMP | NO | |

Indexes: `INDEX (supplier_type, service_category)`, `INDEX (is_active)`

**`compliance_notifications`**

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| `id` | BIGINT UNSIGNED | NO | PK |
| `supplier_entity_id` | BIGINT UNSIGNED | NO | FK to supplier_entities |
| `user_id` | BIGINT UNSIGNED | NO | FK to users (recipient) |
| `type` | VARCHAR(50) | NO | e.g. `document_expiry`, `register_flag`, `amendment_decision` |
| `category` | VARCHAR(20) | NO | `operational` or `optional` |
| `channel` | VARCHAR(10) | NO | `email` or `in_app` |
| `subject` | VARCHAR(255) | NO | Notification subject line |
| `body` | TEXT | NO | Notification content |
| `related_type` | VARCHAR(100) | YES | Polymorphic (Agreement, ComplianceCheck, etc.) |
| `related_id` | BIGINT UNSIGNED | YES | Polymorphic FK |
| `sent_at` | TIMESTAMP | YES | When successfully sent |
| `read_at` | TIMESTAMP | YES | When user read in-app notification |
| `created_at` | TIMESTAMP | NO | |
| `updated_at` | TIMESTAMP | NO | |

Indexes: `INDEX (supplier_entity_id, type)`, `INDEX (user_id, read_at)`, `INDEX (category, sent_at)`

**`notification_preferences`**

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| `id` | BIGINT UNSIGNED | NO | PK |
| `user_id` | BIGINT UNSIGNED | NO | FK to users |
| `notification_type` | VARCHAR(50) | NO | e.g. `marketing_updates`, `training_invitations` |
| `email_enabled` | BOOLEAN | NO | Default true |
| `in_app_enabled` | BOOLEAN | NO | Default true |
| `created_at` | TIMESTAMP | NO | |
| `updated_at` | TIMESTAMP | NO | |

Indexes: `UNIQUE (user_id, notification_type)`

Note: Only optional notification types have rows in this table. Operational notifications are hardcoded as always-on and cannot have preference rows.

#### Model Constants

```php
// Agreement model
public const TYPE_APA = 'apa';
public const TYPE_TPC = 'tpc';
public const STATUS_DRAFT = 'draft';
public const STATUS_ACTIVE = 'active';
public const STATUS_EXPIRED = 'expired';
public const STATUS_SUPERSEDED = 'superseded';

// AmendmentRequest model
public const STATUS_PENDING = 'pending';
public const STATUS_APPROVED = 'approved';
public const STATUS_APPROVED_WITH_MODIFICATIONS = 'approved_with_modifications';
public const STATUS_DECLINED = 'declined';

// TerminationRequest model
public const RISK_TIER_LOW = 'low';
public const RISK_TIER_CONDITIONAL = 'conditional';
public const RISK_TIER_HIGH = 'high';

// ComplianceCheck model
public const REGISTER_AHPRA = 'ahpra';
public const REGISTER_NDIS_BANNING = 'ndis_banning';
public const REGISTER_AGED_CARE_BANNING = 'aged_care_banning';
public const REGISTER_AFRA = 'afra';
public const SUBJECT_SUPPLIER_ENTITY = 'supplier_entity';
public const SUBJECT_WORKER = 'worker';
public const SUBJECT_KEY_PERSONNEL = 'key_personnel';
public const RESULT_CLEAR = 'clear';
public const RESULT_FLAGGED = 'flagged';
public const RESULT_ERROR = 'error';
public const RESULT_PENDING = 'pending';

// EftsureCheck model
public const INDICATOR_GREEN = 'green';
public const INDICATOR_YELLOW = 'yellow';
public const INDICATOR_RED = 'red';
public const INDICATOR_PENDING = 'pending';

// PaymentBlock model
public const REASON_REGISTER_FLAG = 'register_flag';
public const REASON_EFTSURE_RED = 'eftsure_red';
public const REASON_MANUAL = 'manual';

// ComplianceNotification model
public const CATEGORY_OPERATIONAL = 'operational';
public const CATEGORY_OPTIONAL = 'optional';
```

### API Contracts

All endpoints follow SR0 v2 API envelope: `{ data: ..., meta?: ..., errors?: ... }`.

#### Phase 1 — APA & Amendments

| Method | Endpoint | Purpose | Auth |
|--------|----------|---------|------|
| GET | `/api/v2/agreements` | List supplier entity's agreements | Supplier |
| GET | `/api/v2/agreements/{agreement}` | View agreement with clauses | Supplier |
| GET | `/api/v2/agreement-versions/current?type=apa` | Get current APA version with clauses | Supplier |
| POST | `/api/v2/agreements/sign` | Digitally sign the current APA | Supplier Admin |
| GET | `/api/v2/agreements/{agreement}/clauses` | List clauses with locked/negotiable status | Supplier |
| POST | `/api/v2/agreements/{agreement}/amendments` | Submit amendment request | Supplier Admin |
| POST | `/api/v2/agreements/{agreement}/amendments/ai-draft` | Get AI-assisted draft for a clause | Supplier Admin |
| GET | `/api/v2/agreements/{agreement}/amendments` | List amendment history | Supplier |
| POST | `/api/v2/amendments/{amendment}/acknowledge` | Acknowledge modified amendment | Supplier Admin |
| GET | `/api/v2/tpc-templates` | Download draft TPC form templates | Supplier |
| POST | `/api/v2/tpc-agreements` | Upload TPC agreement with consumer/package linkage | Supplier Admin |
| GET | `/api/v2/tpc-agreements` | List supplier's TPC agreements | Supplier |

#### Phase 1 — Staff Amendment Review

| Method | Endpoint | Purpose | Auth |
|--------|----------|---------|------|
| GET | `/api/v2/staff/amendments` | List pending amendment requests | TC Staff |
| GET | `/api/v2/staff/amendments/{amendment}` | View amendment request detail | TC Staff |
| PATCH | `/api/v2/staff/amendments/{amendment}` | Approve, modify, or decline amendment | TC Compliance |
| GET | `/api/v2/staff/tpc-agreements` | List TPC agreements for review | TC Staff |
| PATCH | `/api/v2/staff/tpc-agreements/{tpcAgreement}` | Approve/reject TPC | TC Compliance |

#### Phase 2 — Termination & Reactivation

| Method | Endpoint | Purpose | Auth |
|--------|----------|---------|------|
| GET | `/api/v2/termination/criteria` | List 15 criteria grouped by category | Supplier |
| POST | `/api/v2/termination/assess` | Submit reason, get risk tier classification | Supplier Admin |
| POST | `/api/v2/termination/confirm` | Confirm low-risk or submit conditional | Supplier Admin |
| GET | `/api/v2/reactivation/eligibility` | Check reactivation eligibility + document status | Supplier |
| POST | `/api/v2/reactivation/request` | Request reactivation | Supplier Admin |

#### Phase 2 — Government Registers & EFTSure

| Method | Endpoint | Purpose | Auth |
|--------|----------|---------|------|
| GET | `/api/v2/staff/compliance/dashboard` | Dashboard summary stats | TC Staff |
| GET | `/api/v2/staff/compliance/register-checks` | List all register check results | TC Staff |
| POST | `/api/v2/staff/compliance/register-checks/{supplierEntity}` | Trigger manual register check | TC Compliance |
| GET | `/api/v2/staff/compliance/eftsure` | List EFTSure statuses | TC Staff |
| POST | `/api/v2/staff/compliance/eftsure/{supplierEntity}/override` | Manual override with audit | TC Compliance |
| GET | `/api/v2/staff/compliance/payment-blocks` | List active payment blocks | TC Staff |
| POST | `/api/v2/staff/compliance/payment-blocks/{paymentBlock}/lift` | Lift payment block | TC Compliance |
| GET | `/api/v2/staff/supplier-entities/{supplierEntity}/compliance` | Full compliance profile for a supplier | TC Staff |

#### Phase 2 — Notifications

| Method | Endpoint | Purpose | Auth |
|--------|----------|---------|------|
| GET | `/api/v2/notifications` | List in-app notifications | Supplier |
| PATCH | `/api/v2/notifications/{notification}/read` | Mark notification as read | Supplier |
| GET | `/api/v2/notification-preferences` | Get current preferences | Supplier |
| PUT | `/api/v2/notification-preferences` | Update optional notification preferences | Supplier |

#### Phase 3 — Credentialing Matrix

| Method | Endpoint | Purpose | Auth |
|--------|----------|---------|------|
| GET | `/api/v2/staff/credentialing-matrix` | List all requirements | TC Compliance |
| POST | `/api/v2/staff/credentialing-matrix` | Add requirement | TC Compliance |
| PATCH | `/api/v2/staff/credentialing-matrix/{requirement}` | Update requirement | TC Compliance |
| DELETE | `/api/v2/staff/credentialing-matrix/{requirement}` | Deactivate requirement | TC Compliance |

### Feature Flags

| Flag | Scope | Gates |
|------|-------|-------|
| `supplier-apa-signing` | Supplier-facing | APA viewer, digital signing, agreement list |
| `supplier-apa-amendments` | Supplier-facing | Amendment interface, AI drafting, amendment history |
| `supplier-tpc-upload` | Supplier-facing | TPC upload, TPC list, template downloads |
| `supplier-self-termination` | Supplier-facing | Termination flow, reactivation flow |
| `compliance-register-checks` | Staff-facing | Government register checks, payment blocks |
| `compliance-eftsure` | Staff-facing | EFTSure indicators, manual overrides |
| `compliance-credentialing-matrix` | Staff-facing | Matrix configuration |

All flags dual-gated: backend middleware (`check.feature.flag`) + frontend conditional rendering.

---

## Frontend Architecture (React / Next.js)

### Technology Decisions

- **Next.js 16** with App Router — pages in `src/app/`
- **shadcn/ui** for base components — buttons, dialogs, badges, tables, tabs, cards
- **Tailwind CSS v4** — TC brand: Navy `#2C4C79` primary, Teal `#007F7E` accent
- **react-signature-canvas** — for digital signature capture
- **Zod** — client-side validation (mirrors Laravel Data validation)
- **SWR or TanStack Query** — data fetching with caching and revalidation

### Directory Structure

```
src/
├── app/
│   ├── agreements/
│   │   ├── page.tsx                    # Agreement list + APA signing
│   │   ├── amendments/
│   │   │   └── page.tsx                # Clause browser + amendment interface
│   │   └── tpc/
│   │       └── page.tsx                # TPC list + upload
│   ├── account/
│   │   ├── termination/
│   │   │   └── page.tsx                # Self-termination flow
│   │   └── reactivation/
│   │       └── page.tsx                # Reactivation flow
│   ├── settings/
│   │   └── notifications/
│   │       └── page.tsx                # Notification preferences
│   └── compliance/                      # Staff-only routes
│       ├── page.tsx                     # Compliance dashboard
│       ├── amendments/
│       │   └── page.tsx                # Amendment review queue
│       └── credentialing/
│           └── page.tsx                # Credentialing matrix config
├── components/
│   ├── agreements/
│   │   ├── AgreementViewer/
│   │   │   ├── AgreementViewer.tsx     # Parent: orchestrates scroll tracking + signing
│   │   │   ├── ReadingProgressBar.tsx  # Scroll position tracker
│   │   │   ├── AgreementText.tsx       # Renders agreement content
│   │   │   ├── PrePopulatedDetails.tsx # Supplier details summary card
│   │   │   └── VersionDiffSummary.tsx  # Changes from prior version (renewals)
│   │   ├── DigitalSignature/
│   │   │   ├── DigitalSignature.tsx    # Parent: signature capture form
│   │   │   ├── SignaturePad.tsx        # Canvas signature input
│   │   │   └── SignerDetails.tsx       # Name, position fields
│   │   ├── ClauseBrowser/
│   │   │   ├── ClauseBrowser.tsx       # Parent: two-panel clause navigation
│   │   │   ├── ClauseList.tsx          # Left panel: clause TOC with lock/pencil icons
│   │   │   ├── ClauseDetail.tsx        # Right panel: selected clause text
│   │   │   └── ClauseStatusIcon.tsx    # Locked/negotiable icon primitive
│   │   ├── AmendmentRequest/
│   │   │   ├── AmendmentRequestDialog.tsx  # Parent: amendment submission dialog
│   │   │   ├── CurrentClauseCard.tsx       # Read-only original clause
│   │   │   ├── AIDraftAssist.tsx           # AI suggestion with use/edit/write-own
│   │   │   └── AmendmentHistory.tsx        # Per-clause amendment timeline
│   │   └── TPC/
│   │       ├── TPCList.tsx             # TPC agreements table
│   │       └── TPCUploadDialog.tsx     # Upload with consumer/package select
│   ├── termination/
│   │   ├── TerminationFlow/
│   │   │   ├── TerminationFlow.tsx     # Parent: multi-step orchestrator
│   │   │   ├── ReasonSelection.tsx     # Step 1: grouped criteria radio buttons
│   │   │   ├── RiskTierOutcome.tsx     # Step 2: low/conditional/high result
│   │   │   └── Confirmation.tsx        # Step 3: final confirmation
│   │   └── ReactivationPage/
│   │       ├── ReactivationPage.tsx    # Parent: eligibility check + action
│   │       └── DocumentValidityCheck.tsx # Document status list with upload
│   ├── compliance/
│   │   ├── Dashboard/
│   │   │   ├── ComplianceDashboard.tsx # Parent: summary + tabbed tables
│   │   │   ├── SummaryCards.tsx        # Flagged/warnings/clear/pending counts
│   │   │   ├── EFTSureTable.tsx        # EFTSure status list
│   │   │   ├── RegisterCheckTable.tsx  # Government register flags
│   │   │   └── DocumentExpiryTable.tsx # Expiring documents sorted by urgency
│   │   ├── SupplierCompliance/
│   │   │   ├── SupplierComplianceProfile.tsx # Full compliance view for one supplier
│   │   │   ├── RegisterCheckResults.tsx      # Per-register check history
│   │   │   └── EFTSureIndicator.tsx          # Green/yellow/red badge with text
│   │   └── CredentialingMatrix/
│   │       ├── CredentialingMatrix.tsx        # Parent: matrix CRUD
│   │       └── RequirementRow.tsx             # Single requirement with edit/delete
│   └── notifications/
│       ├── NotificationPreferences.tsx  # Mandatory/optional toggle groups
│       └── NotificationBell.tsx         # In-app notification indicator
├── hooks/
│   ├── useAgreement.ts                  # Agreement data fetching + signing logic
│   ├── useAmendments.ts                 # Amendment CRUD + AI drafting
│   ├── useTermination.ts               # Termination flow state + API calls
│   ├── useComplianceChecks.ts           # Register check data + trigger manual
│   ├── useEFTSure.ts                    # EFTSure status + override
│   ├── useNotifications.ts              # Notifications + preferences
│   ├── useScrollProgress.ts             # Scroll tracking for APA reading progress
│   └── useFeatureFlag.ts                # Feature flag checking (from SR0)
├── types/
│   ├── agreements.ts                    # Agreement, Clause, Amendment types
│   ├── termination.ts                   # TerminationRequest, Criteria types
│   ├── compliance.ts                    # ComplianceCheck, PaymentBlock, EFTSure types
│   ├── credentialing.ts                 # CredentialingRequirement types
│   └── notifications.ts                 # Notification, Preference types
└── lib/
    ├── api.ts                           # API client (from SR0)
    └── validation/
        ├── amendment.ts                 # Zod schemas for amendment forms
        ├── tpc-upload.ts                # Zod schemas for TPC upload
        └── termination.ts              # Zod schemas for termination flow
```

### Key Component Specifications

#### AgreementViewer.tsx
- Props: `defineProps` equivalent (React):
  - `agreement: Agreement | null`
  - `currentVersion: AgreementVersion`
  - `supplierDetails: SupplierDetails`
  - `previouslySigned: boolean`
- Hooks: `useScrollProgress()`, `useAgreement()`
- Sub-components: ReadingProgressBar, AgreementText, PrePopulatedDetails, VersionDiffSummary
- Common components reused: Card, Badge, Button (shadcn/ui)
- Behaviour: First-time signing uses scroll tracking + progress bar; renewals show diff summary and skip scroll tracking

#### ClauseBrowser.tsx
- Props:
  - `agreement: Agreement`
  - `clauses: AgreementClause[]`
  - `amendments: AmendmentRequest[]`
- Hooks: `useAmendments()`
- Sub-components: ClauseList, ClauseDetail, ClauseStatusIcon
- Common components reused: Tabs, ScrollArea, Badge (shadcn/ui)
- Layout: Two-panel — left TOC, right detail. Responsive: stacks vertically on narrow screens.

#### TerminationFlow.tsx
- Form state: Single form state object at parent level with all fields across all steps
- Steps: ReasonSelection (reason_code) → RiskTierOutcome (read-only) → Confirmation (checkbox)
- Step validation: Zod schemas per step for client-side pre-flight
- Submission: API handles risk tier classification and routing
- State management: Local `useState` + form state (no global store)
- Hooks: `useTermination()`

#### ComplianceDashboard.tsx
- Props:
  - `summaryStats: ComplianceSummary`
- Hooks: `useComplianceChecks()`, `useEFTSure()`, `useNotifications()`
- Sub-components: SummaryCards, EFTSureTable, RegisterCheckTable, DocumentExpiryTable
- Common components reused: Card, Tabs, Table, Badge, Button (shadcn/ui)
- Layout: Summary cards pinned above tab bar. Three tabs below.

### Shared Types

**`src/types/agreements.ts`**:
```typescript
type AgreementStatus = 'draft' | 'active' | 'expired' | 'superseded'
type AgreementType = 'apa' | 'tpc'
type AmendmentStatus = 'pending' | 'approved' | 'approved_with_modifications' | 'declined'

type Agreement = {
  id: number
  supplierEntityId: number
  type: AgreementType
  version: string
  status: AgreementStatus
  signedAt: string | null
  signerName: string | null
  signerPosition: string | null
  expiresAt: string | null
}

type AgreementVersion = {
  id: number
  type: AgreementType
  version: string
  changelog: string | null
  publishedAt: string | null
  clauses: AgreementClause[]
}

type AgreementClause = {
  id: number
  clauseNumber: string
  title: string
  content: string
  isLocked: boolean
}

type AmendmentRequest = {
  id: number
  agreementId: number
  clauseNumber: string
  clauseTitle: string
  originalText: string
  proposedText: string
  justification: string
  aiDraftText: string | null
  aiDraftUsed: boolean
  status: AmendmentStatus
  decisionText: string | null
  decidedAt: string | null
  decidedByName: string | null
  supplierAcknowledgedAt: string | null
  createdAt: string
}

type TPCAgreement = {
  id: number
  consumerName: string
  carePackageReference: string
  documentName: string
  approvalStatus: 'pending' | 'approved' | 'rejected'
  uploadedAt: string
  approvedAt: string | null
  isActive: boolean
}
```

**`src/types/termination.ts`**:
```typescript
type RiskTier = 'low' | 'conditional' | 'high'
type TerminationCategory = 'business' | 'relationship' | 'compliance'

type TerminationCriterion = {
  code: string
  label: string
  category: TerminationCategory
  riskTier: RiskTier
}

type TerminationAssessment = {
  reasonCode: string
  riskTier: RiskTier
  nextSteps: string
  requiresReview: boolean
}

type ReactivationEligibility = {
  isEligible: boolean
  eligibleUntil: string | null
  documentsValid: DocumentValidityItem[]
  allDocumentsValid: boolean
  requiresReview: boolean
}

type DocumentValidityItem = {
  documentType: string
  documentLabel: string
  status: 'valid' | 'expired' | 'missing'
  expiresAt: string | null
  canUploadRenewal: boolean
}
```

**`src/types/compliance.ts`**:
```typescript
type RegisterType = 'ahpra' | 'ndis_banning' | 'aged_care_banning' | 'afra'
type CheckResult = 'clear' | 'flagged' | 'error' | 'pending'
type EFTSureIndicator = 'green' | 'yellow' | 'red' | 'pending'

type ComplianceCheck = {
  id: number
  registerType: RegisterType
  subjectType: 'supplier_entity' | 'worker' | 'key_personnel'
  subjectName: string
  subjectIdentifier: string
  result: CheckResult
  paymentBlockApplied: boolean
  checkedAt: string
  checkedBy: 'scheduled' | 'manual'
}

type EFTSureStatus = {
  supplierEntityId: number
  supplierEntityName: string
  indicator: EFTSureIndicator
  lastCheckedAt: string
  manualOverride: boolean
}

type PaymentBlock = {
  id: number
  supplierEntityId: number
  supplierEntityName: string
  reasonType: 'register_flag' | 'eftsure_red' | 'manual'
  blockedAt: string
  liftedAt: string | null
}

type ComplianceSummary = {
  flaggedCount: number
  warningCount: number
  clearCount: number
  pendingCount: number
}
```

### Hooks (Composables)

**`useScrollProgress`** — Tracks scroll position within a container ref. Returns `{ progress: number, hasReachedEnd: boolean }`. Used by AgreementViewer for reading progress bar.

**`useAgreement`** — Fetches agreement data, handles signing submission. Returns `{ agreement, currentVersion, sign, isSigning }`.

**`useAmendments`** — Amendment CRUD + AI drafting. Returns `{ amendments, submitAmendment, requestAIDraft, acknowledge }`.

**`useTermination`** — Termination flow state machine. Returns `{ criteria, assess, confirm, assessment, isProcessing }`.

**`useComplianceChecks`** — Register check data + manual trigger. Returns `{ checks, triggerCheck, isChecking }`.

**`useEFTSure`** — EFTSure status + override. Returns `{ statuses, override, isOverriding }`.

**`useNotifications`** — Notification list + preferences. Returns `{ notifications, preferences, updatePreferences, markRead }`.

---

## Backend Architecture (Laravel)

### Actions (Lorisleiva AsAction)

#### Phase 1

| Action | Purpose |
|--------|---------|
| `SignAgreement` | Validate signer details, store signature, update agreement status, advance onboarding |
| `SubmitAmendmentRequest` | Create amendment request, store AI draft if used, notify compliance |
| `GenerateAmendmentDraft` | Call OpenAI API with clause context, return suggested amendment text |
| `ReviewAmendmentRequest` | Approve/modify/decline amendment, update clause if approved, notify supplier |
| `AcknowledgeAmendment` | Record supplier acknowledgement of modified amendment |
| `UploadTPCAgreement` | Validate consumer/package linkage, store document, create TPC record |
| `ReviewTPCAgreement` | Approve/reject TPC, notify supplier |

#### Phase 2

| Action | Purpose |
|--------|---------|
| `AssessTermination` | Map reason code to risk tier, return classification |
| `ProcessLowRiskTermination` | Deactivate supplier entity immediately, set reactivation window |
| `SubmitConditionalTermination` | Queue for QA review, send automated email to compliance team |
| `RequestReactivation` | Check eligibility, validate documents, reactivate or queue for review |
| `RunComplianceCheck` | Query government register API, store result, apply payment block if flagged |
| `RunScheduledComplianceChecks` | Batch check all active suppliers on schedule |
| `ApplyPaymentBlock` | Create payment block record, notify supplier |
| `LiftPaymentBlock` | Record lift with audit trail, notify supplier |
| `CheckEFTSure` | Query EFTSure API, store indicator, trigger alerts on worsening |
| `OverrideEFTSure` | Manual override with audit trail |
| `SendComplianceNotification` | Route notification via email and/or in-app based on type + preferences |
| `CheckDocumentExpiry` | Scheduled job: check all supplier documents, queue expiry notifications |

#### Phase 3

| Action | Purpose |
|--------|---------|
| `CreateCredentialingRequirement` | Add requirement to matrix, apply to matching suppliers |
| `UpdateCredentialingRequirement` | Modify requirement, recalculate compliance for affected suppliers |
| `DeactivateCredentialingRequirement` | Soft-delete, unflag suppliers who only failed this requirement |

### Laravel Data Classes

| Data Class | Used For |
|------------|----------|
| `SignAgreementData` | Digital signing form validation (signer_name, signer_position, signature_data, agreement_version_id) |
| `AmendmentRequestData` | Amendment submission validation (agreement_clause_id, proposed_text, justification, ai_draft_used) |
| `AmendmentReviewData` | Staff review validation (status, decision_text) |
| `TPCUploadData` | TPC upload validation (consumer_id, care_package_id, document file) |
| `TerminationAssessData` | Termination reason validation (reason_code) |
| `TerminationConfirmData` | Confirmation validation (confirmation_acknowledged) |
| `ReactivationRequestData` | Reactivation validation (supplier_entity_id) |
| `ComplianceCheckTriggerData` | Manual check trigger (register_type, optional) |
| `EFTSureOverrideData` | Override validation (indicator, reason) |
| `PaymentBlockLiftData` | Lift validation (lift_reason) |
| `NotificationPreferencesData` | Preferences update (array of type + email/in_app toggles) |
| `CredentialingRequirementData` | Matrix CRUD (supplier_type, service_category, document_type, thresholds, etc.) |

All Data classes use `#[MapName(SnakeCaseMapper::class)]` for snake_case request to camelCase property mapping, consistent with the 300+ existing classes.

### Policies

| Policy | Model | Key Rules |
|--------|-------|-----------|
| `AgreementPolicy` | Agreement | view: supplier entity member. sign: Supplier Admin only. download: signed agreement owner. |
| `AmendmentRequestPolicy` | AmendmentRequest | create: Supplier Admin on negotiable clause. review: TC Compliance role. acknowledge: original requester. |
| `TPCAgreementPolicy` | TPCAgreement | create/view: supplier entity member. review: TC Compliance. |
| `TerminationRequestPolicy` | TerminationRequest | create: Supplier Admin. review: TC Compliance. |
| `ComplianceCheckPolicy` | ComplianceCheck | view: TC Staff. trigger: TC Compliance. |
| `PaymentBlockPolicy` | PaymentBlock | view: TC Staff. lift: TC Compliance. |
| `EftsureCheckPolicy` | EftsureCheck | view: TC Staff. override: TC Compliance. |
| `CredentialingRequirementPolicy` | CredentialingRequirement | CRUD: TC Compliance only. |

All policies return `Response::allow()` / `Response::deny('reason')` — never bare boolean.

### Scheduled Jobs

| Job | Schedule | Purpose |
|-----|----------|---------|
| `RunScheduledComplianceChecks` | Weekly (configurable) | Check all active suppliers against government registers |
| `RunScheduledEFTSureChecks` | Daily | Refresh EFTSure indicators for all active suppliers |
| `CheckDocumentExpiry` | Daily | Scan all supplier documents, queue notifications at 30/14/7 day thresholds |
| `CheckAgreementExpiry` | Daily | Detect expiring APAs, queue renewal notifications |
| `ProcessReactivationWindowExpiry` | Daily | Mark expired reactivation windows as ineligible |

### External Integration Services

| Service | Purpose | Error Handling |
|---------|---------|----------------|
| `AhpraService` | Query AHPRA API by practitioner registration number | Retry 3x, store `error` result on failure, do not default to green |
| `NdisBanningService` | Query NDIS Commission banning orders | Retry 3x, store `error` result on failure |
| `AgedCareBanningService` | Query Aged Care Commission banning orders | Retry 3x, store `error` result on failure |
| `AfraService` | Query AFRA register | Retry 3x, store `error` result on failure |
| `EftsureService` | Query EFTSure API for bank account risk score | Retry 3x, store `pending` indicator on failure |
| `AiDraftingService` | Call OpenAI API for amendment language suggestions | Timeout 15s, return null on failure (supplier writes own) |

All external API keys stored in config (via `.env`), never in code. Services are injected via constructor DI.

---

## Implementation Phases

### Phase 0: Database & Models

**Deliverables**:
1. Migrations for all 12 new tables
2. Eloquent models with relationships and constants
3. Seeder for termination_criteria (15 criteria)
4. Factories for all models
5. Feature flag definitions

**Tasks**:
```
P0.1 - Create migration: agreements table
P0.2 - Create migration: agreement_versions table
P0.3 - Create migration: agreement_clauses table
P0.4 - Create migration: amendment_requests table
P0.5 - Create migration: tpc_agreements table
P0.6 - Create migration: termination_requests table
P0.7 - Create migration: termination_criteria table
P0.8 - Create migration: compliance_checks table
P0.9 - Create migration: payment_blocks table
P0.10 - Create migration: eftsure_checks table
P0.11 - Create migration: credentialing_requirements table
P0.12 - Create migration: compliance_notifications table
P0.13 - Create migration: notification_preferences table
P0.14 - Create models with relationships: Agreement, AgreementVersion, AgreementClause
P0.15 - Create models with relationships: AmendmentRequest, TPCAgreement
P0.16 - Create models with relationships: TerminationRequest, TerminationCriterion
P0.17 - Create models with relationships: ComplianceCheck, PaymentBlock, EftsureCheck
P0.18 - Create models with relationships: CredentialingRequirement, ComplianceNotification, NotificationPreference
P0.19 - Create seeder: TerminationCriteriaSeeder (15 criteria across 3 categories with risk tiers)
P0.20 - Create seeder: AgreementVersionSeeder (initial APA v1.0 with sample clauses, locked/negotiable)
P0.21 - Create factories for all new models
P0.22 - Define Pennant feature flags (7 flags listed above)
P0.23 - Write tests: model relationships, scopes, constants
```

**Exit Criteria**:
- [ ] All migrations run successfully (forward and rollback)
- [ ] Models have correct relationships, constants, and casts
- [ ] 15 termination criteria seeded with correct risk tier mapping
- [ ] Sample APA version seeded with locked/negotiable clauses
- [ ] All feature flags registered and functional
- [ ] Unit tests passing

---

### Phase 1: APA Signing & Viewing

**Deliverables**:
1. Agreement viewing with pre-populated supplier details
2. Digital signature capture and storage
3. Agreement version management and renewal notification
4. Download signed agreement

**Backend Tasks**:
```
P1.1 - Create Data class: SignAgreementData
P1.2 - Create Action: SignAgreement (validates, stores signature, updates status)
P1.3 - Create AgreementPolicy (view, sign, download)
P1.4 - Create API controller: AgreementController (index, show, sign)
P1.5 - Create API controller: AgreementVersionController (current)
P1.6 - Register routes behind supplier-apa-signing feature flag middleware
P1.7 - Write tests: signing happy path, re-signing on new version, policy enforcement
P1.8 - Write tests: agreement list, signed agreement download
```

**Frontend Tasks**:
```
P1.9 - Create shared types: src/types/agreements.ts
P1.10 - Create hook: useAgreement (fetch, sign)
P1.11 - Create hook: useScrollProgress (scroll position tracking)
P1.12 - Create AgreementViewer component tree (AgreementViewer, ReadingProgressBar, AgreementText, PrePopulatedDetails, VersionDiffSummary)
P1.13 - Create DigitalSignature component tree (DigitalSignature, SignaturePad, SignerDetails)
P1.14 - Create agreements page: src/app/agreements/page.tsx
P1.15 - Add Zod validation for signature form
P1.16 - Write frontend tests: scroll tracking, sign button enablement, form validation
```

**Exit Criteria**:
- [ ] Supplier can view APA with pre-populated details
- [ ] Scroll tracking enables sign button at 100% (first-time); diff summary shown for renewals
- [ ] Digital signature captured and stored with signer details
- [ ] Signed agreement downloadable
- [ ] Feature flag gates all routes and UI

---

### Phase 2: APA Amendments

**Deliverables**:
1. Clause browser with locked/negotiable visual distinction
2. Amendment request submission with AI-assisted drafting
3. Staff amendment review (approve/modify/decline)
4. Amendment history and acknowledgement flow

**Backend Tasks**:
```
P2.1 - Create Data class: AmendmentRequestData
P2.2 - Create Data class: AmendmentReviewData
P2.3 - Create Action: SubmitAmendmentRequest
P2.4 - Create Action: GenerateAmendmentDraft (OpenAI integration)
P2.5 - Create Action: ReviewAmendmentRequest (approve/modify/decline)
P2.6 - Create Action: AcknowledgeAmendment
P2.7 - Create AiDraftingService (OpenAI API wrapper)
P2.8 - Create AmendmentRequestPolicy
P2.9 - Create API controller: AmendmentController (supplier-facing)
P2.10 - Create API controller: StaffAmendmentController (review queue)
P2.11 - Register routes behind supplier-apa-amendments flag
P2.12 - Write tests: amendment submission, AI drafting, review flow, acknowledgement
P2.13 - Write tests: locked clause cannot be amended, policy enforcement
```

**Frontend Tasks**:
```
P2.14 - Create hook: useAmendments (CRUD + AI draft)
P2.15 - Create ClauseBrowser component tree (ClauseBrowser, ClauseList, ClauseDetail, ClauseStatusIcon)
P2.16 - Create AmendmentRequest component tree (AmendmentRequestDialog, CurrentClauseCard, AIDraftAssist, AmendmentHistory)
P2.17 - Create amendments page: src/app/agreements/amendments/page.tsx
P2.18 - Create staff amendment review page: src/app/compliance/amendments/page.tsx
P2.19 - Add Zod validation for amendment forms
P2.20 - Write frontend tests: clause browser navigation, AI draft interaction, amendment history display
```

**Exit Criteria**:
- [ ] Clauses display with locked (greyed) / negotiable (actionable) distinction
- [ ] AI draft suggests amendment language within 10 seconds
- [ ] Staff can approve, modify, or decline amendments
- [ ] Supplier acknowledges modified amendments before they take effect
- [ ] Full amendment history preserved with audit trail

---

### Phase 3: TPC Agreements

**Deliverables**:
1. TPC template download
2. TPC upload with mandatory consumer/package linkage
3. TPC list view with status
4. Staff TPC review

**Backend Tasks**:
```
P3.1 - Create Data class: TPCUploadData (with file validation)
P3.2 - Create Action: UploadTPCAgreement (S3 upload, consumer/package validation)
P3.3 - Create Action: ReviewTPCAgreement
P3.4 - Create TPCAgreementPolicy
P3.5 - Create API controller: TPCAgreementController (supplier-facing)
P3.6 - Create API controller: StaffTPCAgreementController (review)
P3.7 - Register routes behind supplier-tpc-upload flag
P3.8 - Write tests: upload with linkage, review, inactive TPC on consumer discharge
```

**Frontend Tasks**:
```
P3.9 - Create TPCList component
P3.10 - Create TPCUploadDialog component (consumer select, package select, file upload)
P3.11 - Create TPC page: src/app/agreements/tpc/page.tsx
P3.12 - Add Zod validation for TPC upload form
P3.13 - Write frontend tests: upload flow, consumer/package selection, list display
```

**Exit Criteria**:
- [ ] Supplier can download draft TPC templates
- [ ] TPC upload requires consumer + care package selection
- [ ] Uploaded TPCs appear in list with status
- [ ] Staff can approve/reject TPCs
- [ ] TPCs linked to consumer/package, not APA version

---

### Phase 4: Self-Termination & Reactivation

**Deliverables**:
1. Guided termination flow with 15 criteria and 3 risk tiers
2. Low-risk immediate deactivation
3. Conditional routing to QA/compliance
4. High-risk contact-compliance message
5. 12-month reactivation window with document validity checks

**Backend Tasks**:
```
P4.1 - Create Data classes: TerminationAssessData, TerminationConfirmData, ReactivationRequestData
P4.2 - Create Action: AssessTermination (map reason → risk tier)
P4.3 - Create Action: ProcessLowRiskTermination (deactivate entity, set 12-month window)
P4.4 - Create Action: SubmitConditionalTermination (queue review, email compliance)
P4.5 - Create Action: RequestReactivation (check eligibility, validate docs, reactivate or queue)
P4.6 - Create TerminationRequestPolicy
P4.7 - Create API controllers: TerminationController, ReactivationController
P4.8 - Create scheduled job: ProcessReactivationWindowExpiry
P4.9 - Register routes behind supplier-self-termination flag
P4.10 - Write tests: all 3 risk tier paths, reactivation eligibility, 12-month window expiry
P4.11 - Write tests: sibling entities unaffected, terminated entity access restrictions
```

**Frontend Tasks**:
```
P4.12 - Create shared types: src/types/termination.ts
P4.13 - Create hook: useTermination (flow state + API)
P4.14 - Create TerminationFlow component tree (TerminationFlow, ReasonSelection, RiskTierOutcome, Confirmation)
P4.15 - Create ReactivationPage component tree (ReactivationPage, DocumentValidityCheck)
P4.16 - Create pages: src/app/account/termination/page.tsx, src/app/account/reactivation/page.tsx
P4.17 - Add Zod validation for termination and reactivation forms
P4.18 - Write frontend tests: flow step navigation, risk tier display, document check UI
```

**Exit Criteria**:
- [ ] 15 criteria displayed grouped by category
- [ ] Low-risk: immediate deactivation within 30 seconds
- [ ] Conditional: QA email sent within 1 minute
- [ ] High-risk: contact-compliance message, no self-service
- [ ] Reactivation checks document validity against credentialing matrix
- [ ] After 12 months: redirected to SR1 re-onboarding

---

### Phase 5: Government Register Checks

**Deliverables**:
1. Integration services for AHPRA, NDIS, aged care, AFRA
2. Scheduled and manual check execution
3. Automatic payment block on flag
4. Compliance dashboard register tab

**Backend Tasks**:
```
P5.1 - Create service: AhpraService (practitioner lookup)
P5.2 - Create service: NdisBanningService (entity + personnel lookup)
P5.3 - Create service: AgedCareBanningService (entity + personnel lookup)
P5.4 - Create service: AfraService (entity + personnel lookup)
P5.5 - Create Action: RunComplianceCheck (query register, store result, apply block if flagged)
P5.6 - Create Action: RunScheduledComplianceChecks (batch all active suppliers)
P5.7 - Create Action: ApplyPaymentBlock (create block, notify supplier)
P5.8 - Create Action: LiftPaymentBlock (audit trail, notify supplier)
P5.9 - Create ComplianceCheckPolicy, PaymentBlockPolicy
P5.10 - Create API controllers: StaffComplianceController (dashboard, checks, blocks)
P5.11 - Create scheduled job: RunScheduledComplianceChecks (weekly)
P5.12 - Register routes behind compliance-register-checks flag
P5.13 - Write tests: each register service (mock API), payment block auto-apply, most-restrictive-result rule
P5.14 - Write tests: manual trigger, scheduled batch, block lift with audit
```

**Frontend Tasks**:
```
P5.15 - Create shared types: src/types/compliance.ts
P5.16 - Create hook: useComplianceChecks
P5.17 - Create ComplianceDashboard component tree (ComplianceDashboard, SummaryCards, RegisterCheckTable)
P5.18 - Create SupplierComplianceProfile component tree (SupplierComplianceProfile, RegisterCheckResults)
P5.19 - Create compliance dashboard page: src/app/compliance/page.tsx
P5.20 - Write frontend tests: dashboard stats, register check table, payment block display
```

**Exit Criteria**:
- [ ] AHPRA checks run per worker by practitioner number
- [ ] NDIS/aged care/AFRA checks run per entity + key personnel
- [ ] Any single flag triggers automatic payment block
- [ ] Compliance dashboard shows all flags with timestamps
- [ ] Manual trigger works within 5 minutes
- [ ] Scheduled checks run on configurable schedule

---

### Phase 6: EFTSure Integration

**Deliverables**:
1. EFTSure API integration
2. Green/yellow/red indicator on supplier profiles
3. Bank detail change gating based on indicator
4. Manual override with audit trail
5. Compliance dashboard EFTSure tab

**Backend Tasks**:
```
P6.1 - Create service: EftsureService (API wrapper)
P6.2 - Create Action: CheckEFTSure (query API, store indicator, detect worsening)
P6.3 - Create Action: OverrideEFTSure (manual override with audit)
P6.4 - Create EftsureCheckPolicy
P6.5 - Modify bank detail change flow (from SR2): gate on EFTSure indicator (yellow=flag, red=block)
P6.6 - Create scheduled job: RunScheduledEFTSureChecks (daily)
P6.7 - Register routes behind compliance-eftsure flag
P6.8 - Write tests: indicator storage, worsening alert, bank detail gating, override audit trail
```

**Frontend Tasks**:
```
P6.9 - Create hook: useEFTSure
P6.10 - Create EFTSureIndicator component (badge with text label + timestamp)
P6.11 - Create EFTSureTable component (for dashboard)
P6.12 - Integrate EFTSureIndicator into supplier profile view
P6.13 - Write frontend tests: indicator display, override dialog, pending state
```

**Exit Criteria**:
- [ ] EFTSure indicator visible on every supplier profile (staff-only)
- [ ] Indicator includes text label (not colour-only) for accessibility
- [ ] Yellow: bank detail changes flagged for review
- [ ] Red: bank detail changes and payments blocked
- [ ] Pending state shown when API unavailable (not default green)
- [ ] Manual override creates audit trail

---

### Phase 7: Compliance Notifications

**Deliverables**:
1. Notification dispatching (email + in-app)
2. Document expiry notifications at configurable thresholds
3. Operational notifications (mandatory, cannot disable)
4. Notification preferences page (optional notifications only)

**Backend Tasks**:
```
P7.1 - Create Action: SendComplianceNotification (route by type + channel + preferences)
P7.2 - Create Action: CheckDocumentExpiry (scan documents, queue at 30/14/7 days)
P7.3 - Create Action: CheckAgreementExpiry (detect expiring APAs)
P7.4 - Create scheduled jobs: CheckDocumentExpiry (daily), CheckAgreementExpiry (daily)
P7.5 - Create API controller: NotificationController (list, mark read)
P7.6 - Create API controller: NotificationPreferenceController (get, update — optional only)
P7.7 - Wire notifications into all existing actions (SignAgreement, ReviewAmendment, ApplyPaymentBlock, etc.)
P7.8 - Write tests: operational notifications always sent, optional respects preferences
P7.9 - Write tests: expiry thresholds fire at correct intervals, no duplicate notifications
```

**Frontend Tasks**:
```
P7.10 - Create shared types: src/types/notifications.ts
P7.11 - Create hook: useNotifications
P7.12 - Create NotificationPreferences component (mandatory/optional toggle groups)
P7.13 - Create NotificationBell component (in-app indicator)
P7.14 - Create notification preferences page: src/app/settings/notifications/page.tsx
P7.15 - Write frontend tests: mandatory notifications shown as locked, preference toggle, bell badge count
```

**Exit Criteria**:
- [ ] Expiry notifications sent at 30, 14, and 7 days
- [ ] Operational notifications cannot be disabled
- [ ] All supplier actions (amendments, TPC, reactivation) trigger decision notifications
- [ ] Payment block notifications explain reason and required action
- [ ] In-app notifications display with unread count

---

### Phase 8: Credentialing Matrix

**Deliverables**:
1. Matrix configuration CRUD for compliance staff
2. Per-supplier-type, per-service-category requirement definitions
3. Automatic compliance status recalculation on matrix changes
4. Matrix-driven reminder thresholds

**Backend Tasks**:
```
P8.1 - Create Data class: CredentialingRequirementData
P8.2 - Create Actions: CreateCredentialingRequirement, UpdateCredentialingRequirement, DeactivateCredentialingRequirement
P8.3 - Create CredentialingRequirementPolicy
P8.4 - Create API controller: StaffCredentialingMatrixController
P8.5 - Register routes behind compliance-credentialing-matrix flag
P8.6 - Write tests: CRUD operations, compliance recalculation on matrix change
P8.7 - Write tests: new requirement propagates to existing suppliers
```

**Frontend Tasks**:
```
P8.8 - Create shared types: src/types/credentialing.ts
P8.9 - Create CredentialingMatrix component tree (CredentialingMatrix, RequirementRow)
P8.10 - Create credentialing page: src/app/compliance/credentialing/page.tsx
P8.11 - Write frontend tests: CRUD interactions, requirement display
```

**Exit Criteria**:
- [ ] Compliance staff can add/edit/deactivate requirements
- [ ] Requirements scoped by supplier type and service category
- [ ] Existing suppliers see new requirements in their compliance checklist
- [ ] Removed requirements unflag previously affected suppliers
- [ ] Notification thresholds configurable per requirement

---

## Risk Areas

| Risk | Impact | Mitigation |
|------|--------|------------|
| Government register APIs may have rate limits or downtime | Compliance checks delayed, false "pending" states | Retry logic (3x), error result stored (never default to clear), scheduled checks spread across off-peak hours |
| AI amendment drafting may produce inappropriate legal language | Supplier submits incorrect amendment text | AI suggestions are explicitly labelled as drafts, supplier must review and edit, TC compliance reviews all amendments |
| EFTSure API unavailable | Cannot determine fraud risk for bank changes | Display "pending" indicator (never default to green), staff can manually override with audit trail |
| Digital signature legal validity | May not meet e-signature requirements | Use structured capture (name, position, drawn signature, timestamp, authenticated user) matching existing APA signing patterns |
| 15 termination criteria risk tier mapping changes | Business may reclassify criteria post-launch | Criteria stored in database table (not hardcoded), can be updated without code deploy |
| Large APA documents cause scroll performance issues | Poor UX during mandatory scroll-to-sign | Virtualise agreement text rendering, progressive loading of clause sections |

---

## Testing Approach

### Backend (Pest)

- **Unit tests**: Model relationships, scopes, constants, risk tier mapping
- **Feature tests**: Full API contract testing per endpoint (auth, validation, happy path, error cases)
- **Integration tests**: External service mocking (AHPRA, NDIS, EFTSure, OpenAI)
- **Scheduled job tests**: Batch processing, threshold detection, notification queuing
- **Policy tests**: Every policy method tested for each role (Supplier, Supplier Admin, TC Staff, TC Compliance)

### Frontend (Vitest + React Testing Library)

- **Component tests**: Each component renders correctly with props, handles user interaction
- **Hook tests**: Data fetching, state management, error handling
- **Integration tests**: Full page flows (signing flow, termination flow, amendment flow)
- **Accessibility tests**: Colour indicators include text labels, keyboard navigation, ARIA roles

### Rollback Strategy

- All changes behind feature flags — disable flag to instantly hide feature
- Database migrations include rollback (down methods)
- External integrations are additive — no existing systems modified
- Payment blocks have explicit lift action — can be manually cleared if system error

---

## Architecture Gate Check

**Date**: 2026-03-19
**Status**: PASS

### Technical Feasibility
- [x] Architecture approach clear
- [x] Existing patterns leveraged
- [x] All requirements buildable
- [x] Performance considered
- [x] Security considered

### Data & Integration
- [x] Data model understood
- [x] API contracts clear
- [x] Dependencies identified
- [x] Integration points mapped
- [x] DTO persistence explicit (Data classes → Action → Model, no ->toArray() into ORM)

### Implementation Approach
- [x] File changes identified
- [x] Risk areas noted
- [x] Testing approach defined
- [x] Rollback possible

### Resource & Scope
- [x] Scope matches spec
- [x] Effort reasonable
- [x] Skills available

### Laravel & Cross-Platform Best Practices
- [x] No hardcoded business logic in React (all business rules backend-powered via API)
- [x] Cross-platform reusability (React frontend consumes same v2 API as future mobile)
- [x] Laravel Data for validation (no Request objects in controllers)
- [x] Model route binding (controllers use Model instances)
- [x] No magic numbers/IDs (using Model constants for all statuses, types, tiers)
- [x] Common components pure (shadcn/ui components contain zero business logic)
- [x] Use Lorisleiva Actions (with AsAction trait)
- [x] Action authorization in `authorize()` method
- [x] Data classes remain anemic (no business logic in DTOs)
- [x] Migrations schema-only (termination criteria use Seeder, not migration)
- [x] Models have single responsibility
- [x] Granular model policies (one Policy per model with scoped permissions)
- [x] Response objects in auth (`Response::allow()` / `Response::deny('reason')`)
- [x] Semantic column documentation (lifecycle columns documented with PHPDoc on models)
- [x] Feature flags dual-gated (backend middleware + frontend conditional rendering)

### React TypeScript Standards (Section 6 — adapted for React)
- [x] All components use TypeScript (.tsx)
- [x] Props use named types (e.g., `type AgreementViewerProps = { ... }`)
- [x] No `any` types planned — all API response shapes have TypeScript types in `src/types/`
- [x] Shared types identified — 5 type files in `src/types/` (agreements, termination, compliance, credentialing, notifications)
- [x] shadcn/ui components reused (Card, Badge, Button, Dialog, Tabs, Table, ScrollArea)
- [x] New components assessed for common eligibility — EFTSureIndicator and RiskTierBadge are feature-specific badges (not general-purpose)
- [x] Multi-step wizard (TerminationFlow) uses single parent-level form state, not global store
- [x] Stepper has per-step validation (Zod schemas per step)
- [x] No Pinia equivalent needed — React hooks + local state sufficient

### Component Decomposition (Section 7)
- [x] Component decomposition planned — all major features decomposed into parent + sub-components
- [x] Each sub-component has single concern
- [x] Parent owns logic — sub-components receive props
- [x] Directory structure defined (see Frontend Architecture section)
- [x] Naming is simple — sub-components use short names, directory provides namespace
- [x] No template section comments planned

### Composition-Based Architecture (Section 8)
- [x] Composition planned over configuration — hooks extract reusable logic, components are presentational
- [x] Composables (hooks) identified — 8 custom hooks for reusable reactive logic
- [x] Primitives are single-responsibility
- [x] Consumer controls layout
- [x] No boolean prop branching for different render paths

### Type File Organization (Section 9)
- [x] Shared types identified — 5 dedicated type files
- [x] Type file locations specified (`src/types/*.ts`)
- [x] No type exports from component files planned
- [x] No type duplication planned

### Multi-Step Wizards (Section 10)
- [x] TerminationFlow: Single form state at parent level with all fields across all steps
- [x] Steps: ReasonSelection (reason_code) → RiskTierOutcome (read-only) → Confirmation (checkbox)
- [x] Step validation: Zod schemas per step
- [x] State management: Local useState only (no global store)

### Data Tables (Section 12)
- [x] N/A for supplier-facing React frontend (no CommonTable/BaseTable — different stack)
- [x] Staff-facing compliance dashboard tables use shadcn/ui Table component with server-side pagination via API query params
- [x] Filtering and sorting handled server-side via API, not client-side JS

**Ready to Implement**: YES
