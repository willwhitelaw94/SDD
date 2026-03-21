---
title: "Implementation Plan: Funding Reconciliation & Refunds"
---

# Implementation Plan: Funding Reconciliation & Refunds

**Spec**: [spec.md](./spec.md) | **Created**: 2026-02-11 | **Status**: Draft
**Epic Code**: FRR | **Feature Branch**: `frr-funding-reconciliation-refunds`

## Summary

Implement MYOB adjustment detection (webhook-based) and consumption-driven Services Australia claims pipeline with credit netting to resolve $500K overclaim issue. Portal receives MYOB adjustment webhooks at `closed` status, matches via consumption ID / bill item ID, automatically restores client budgets, and nets outstanding adjustments against SA claims by modifying original claim line amounts. This eliminates the current one-way billing deadlock where refunds processed in MYOB never sync back to Portal.

**Key Innovation**: Webhook-driven sync from MYOB (not polling), matching via External Reference ID (consumption ID) with bill_item_id fallback, supporting both credit AND debit adjustment directions, with SA netting via modified claim line amounts (not separate submissions).

> **Updated 2026-02-12**: Reflects MYOB Adjustments Discovery meeting findings. See [data-model.md](context/data-model.md) "Key Changes from Discovery Meeting" table for full diff.

## Technical Context

**Language/Version**: PHP 8.3 (Laravel 12)
**Primary Dependencies**: Laravel Data, Event Sourcing, MYOB API v2, Services Australia API
**Storage**: MySQL (existing Portal database)
**Testing**: Pest v3 (unit + feature), Nightwatch v1 (browser tests)
**Target Platform**: Web application (Inertia.js v2 + Vue 3 + TypeScript)
**Project Type**: Monolithic Laravel application (domain-driven design)

### Performance Goals
- MYOB webhook processing: <2 seconds per event (P95)
- Adjustment creation: <2 seconds (P95)
- SA claim submission: <5 seconds per consumption (P95)
- Budget restoration: Immediate upon adjustment approval

### Constraints
- **No hard deletes**: Soft deletes and void operations only
- **Immutable financial records**: Bills/consumptions cannot be edited once claimed to SA
- **MYOB as source of truth**: Portal detects MYOB adjustments, doesn't create them
- **Webhook sync**: MYOB sends webhook notifications on status change; only process at `closed` status
- **Both credit AND debit adjustments**: MYOB has both types with signed amounts
- **Matching via consumption_id + bill_item_id**: Not via myob_reference_number
- **SA API limitations**: No reverse-claim endpoint; net by modifying original claim line amounts
- **60-day claim window**: External providers can claim funding within 60 days
- **Event sourcing required**: All financial transactions must be auditable
- **Service date boundary**: Only import adjustments with service_date >= 2024-11-01 (SAH)

### Scale/Scope
- ~$500K in overclaims to reconcile ($36K already claimed via modified line amounts)
- Webhook-based MYOB sync (initial bulk import for historical data)
- Adjustments Index showing credits and debits with MYOB links
- Phase 1: Adjustment system (webhook sync + approval workflow)
- Phase 2: Automated SA claim pipeline with netting (modified line amounts)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Alignment with TC Portal Constitution

- [x] **I. Majestic Monolith**: All logic in domain modules (`/domain/Finance/Adjustment`, `/domain/Billing/Claim`). MYOB and SA are external API integrations, not separate services.
- [x] **II. Domain-Driven Design**: New domains: `/domain/Finance/Adjustment` (adjustments, approval workflow), `/domain/Billing/Claim` (SA claims, netting). Follows existing billing patterns.
- [x] **III. Convention Over Configuration**: Follows Laravel patterns (models, actions, jobs, events). Uses existing MYOB sync patterns from VC transactions.
- [x] **IV. Code Quality Standards**: Type-safe DTOs, explicit return types, descriptive names (e.g., `CalculateOutstandingCreditsForClaimAction`).
- [x] **V. Testing First-Class**: >90% coverage for business logic. TDD approach: write tests, implement, verify.
- [x] **VI. Event Sourcing for Audit**: `AdjustmentAggregateRoot` for financial audit trail. All adjustment state changes event-sourced.
- [x] **VII. Laravel Data for DTOs**: `CreateAdjustmentData`, `SA ClaimSubmissionData`, `AdjustmentNettingData` for type-safe data transfer.
- [x] **VIII. Action Classes**: One action per use case (e.g., `DetectMYOBAdjustmentsAction`, `NetAdjustmentsAgainstClaimAction`).
- [x] **IX. Services Australia Integration**: SA API integration for consumption validation and claim submission. Netting applied before submission.
- [x] **X. Inertia.js + Vue 3**: Server-driven pages. No API calls from frontend. Adjustments Index and SA Claim Review as Inertia pages.
- [x] **XI. Component Library & Tailwind**: Accessible UI (WCAG 2.1 AA). Keyboard navigation. Focus visible. Tables with server-side pagination.
- [x] **XII. Design System**: Follows Vercel guidelines. Responsive. Intentional alignment. Lazy-load images. Toast notifications.
- [x] **XIV. Feature Flags**: Use PostHog + Pennant for gradual rollout. `Feature::active('funding-adjustments')` for Phase 1, `Feature::active('sa-automated-claims')` for Phase 2.
- [x] **XV. Permissions & Authorization**: Policy-based. `AdjustmentPolicy` for approval/void. Gate for `finance_user` role.
- [x] **XVI. Compliance & Audit**: Event sourcing for all financial transactions. Soft deletes. User action logging. Immutable audit logs.
- [x] **XX. Performance Optimization**: Index foreign keys. Eager load relationships. Cache SA claim aggregations. Queue jobs for MYOB polling and SA submissions.

**Violations**: None. Plan fully aligned with constitution.

## Project Structure

### Documentation (this feature)

```text
.tc-docs/content/initiatives/Budgets-And-Finance/Funding-Reconciliation/
├── IDEA-BRIEF.md       # Epic brief (existing)
├── spec.md             # Feature specification (existing)
├── plan.md             # This file
├── data-model.md       # Phase 1 output (entities, relationships, validation)
├── quickstart.md       # Phase 1 output (getting started guide)
├── contracts/          # Phase 1 output (API schemas)
│   ├── adjustments.yaml
│   └── sa-claims.yaml
└── tasks.md            # Phase 2 output (/speckit.tasks command)
```

### Source Code (Laravel domain structure)

```text
domain/
├── Finance/
│   └── Adjustment/
│       ├── Models/
│       │   ├── Adjustment.php
│       │   └── OutstandingCreditBalance.php
│       ├── Actions/
│       │   ├── CreateAdjustmentAction.php
│       │   ├── ApproveAdjustmentAction.php
│       │   ├── VoidAdjustmentAction.php
│       │   ├── RestoreBudgetFromAdjustmentAction.php
│       │   └── CalculateOutstandingCreditsForClaimAction.php
│       ├── Data/
│       │   ├── CreateAdjustmentData.php
│       │   ├── ApproveAdjustmentData.php
│       │   └── OutstandingCreditBalanceData.php
│       ├── Aggregates/
│       │   └── AdjustmentAggregateRoot.php
│       ├── Events/
│       │   ├── AdjustmentCreated.php
│       │   ├── AdjustmentApproved.php
│       │   ├── AdjustmentVoided.php
│       │   └── BudgetRestoredFromAdjustment.php
│       ├── Jobs/
│       │   └── BulkImportMYOBAdjustmentsJob.php
│       ├── Services/
│       │   └── MYOBAdjustmentMatchingService.php
│       └── Policies/
│           └── AdjustmentPolicy.php
│
└── Billing/
    └── Claim/
        ├── Models/
        │   ├── ConsumptionClaimSubmission.php
        │   └── ConsumptionClaimApplication.php
        ├── Actions/
        │   ├── ValidateConsumptionWithSAAction.php
        │   ├── ClaimConsumptionToSAAction.php
        │   ├── NetAdjustmentsAgainstClaimAction.php
        │   └── ReconcileSAClaimResponseAction.php
        ├── Data/
        │   ├── SAClaimSubmissionData.php
        │   ├── AdjustmentNettingData.php
        │   └── SAClaimResponseData.php
        ├── Jobs/
        │   ├── SubmitConsumptionToSAJob.php
        │   └── ReconcileSAClaimJob.php
        └── Services/
            ├── ServicesAustraliaAPIService.php
            └── AdjustmentNettingService.php

app/Http/Controllers/
├── Finance/
│   └── AdjustmentController.php
├── Billing/
│   └── SAClaimController.php
└── Api/
    └── MYOBWebhookController.php    # Webhook receiver for MYOB adjustments

resources/js/Pages/
├── Finance/
│   └── Adjustments/
│       ├── Index.vue          # Adjustments Index (all adjustments with MYOB links)
│       ├── Show.vue           # Adjustment detail view
│       └── Create.vue         # Manual adjustment creation
└── Billing/
    └── Claims/
        └── SAClaimReview.vue  # SA claim review before submission

tests/
├── Unit/
│   ├── Finance/
│   │   └── Adjustment/
│   │       ├── Actions/
│   │       └── Services/
│   └── Billing/
│       └── Claim/
│           ├── Actions/
│           └── Services/
├── Feature/
│   ├── Finance/
│   │   └── Adjustment/
│   │       └── AdjustmentWorkflowTest.php
│   └── Billing/
│       └── Claim/
│           └── SAClaimNettingTest.php
└── Browser/
    ├── Finance/
    │   └── AdjustmentIndexTest.php
    └── Billing/
        └── SAClaimReviewTest.php
```

**Structure Decision**: Laravel domain-driven design. Finance/Adjustment domain handles refund detection, budget restoration, and credit tracking. Billing/Claim domain handles SA claim submission and netting logic. Follows existing Portal patterns for VC transactions and billing.

## Design Decisions

### Data Model

#### Core Entities

**1. Adjustment** (credits AND debits)
- **Purpose**: Tracks MYOB adjustments (credits and debits) against bills
- **Key Fields**:
  - `id` (bigint PK, auto-increment) + `uuid` (unique, public identifier)
  - `bill_id` (FK to bills — resolved from bill_item_id)
  - `bill_item_id` (FK to bill_items — MYOB Bill Item ID, reliable link surviving consumption splits)
  - `consumption_id` (FK to budget_plan_item_funding_consumptions — MYOB External Reference ID, may be soft-deleted)
  - `myob_uid` (MYOB adjustment UID for API cross-reference)
  - `myob_reference_number` (MYOB transaction reference, nullable)
  - `amount` (decimal, **signed**: positive=credit, negative=debit)
  - `direction` (string: 'credit' = same as bill, 'debit' = reversal)
  - `type` (string: 'myob_detected', 'manual')
  - `status` (string: 'pending', 'approved', 'voided', 'applied')
  - `myob_status` (string: 'balanced', 'open', 'closed' — only sync at closed)
  - `service_date` (date — filter: Nov 1+ for SAH)
  - `approved_by_user_id`, `voided_by_user_id`
  - `reason` (text, mandatory for manual adjustments)
  - `detected_at`, `approved_at`, `voided_at`, `applied_at`
  - `soft_deletes`
- **MYOB Matching Algorithm**:
  1. External Reference ID → `consumption_id` (budget_plan_item_funding_consumptions.id)
  2. If consumption soft-deleted (post-split), fallback to `bill_item_id` from MYOB Bill Item ID
  3. From `bill_item_id`, resolve `bill_id` for parent bill
  4. Store both IDs for maximum traceability
- **Relationships**:
  - `belongsTo(Bill)`, `belongsTo(BillItem)`, `belongsTo(BudgetPlanItemFundingConsumption, 'consumption_id')`
  - `belongsTo(User, 'approved_by_user_id')` - Approver
  - `hasMany(OutstandingCreditBalance)` - Per-funding balances (debit adjustments only)
  - `hasMany(ConsumptionClaimApplication)` - SA claim netting
- **State Transitions**:
  - `pending` → `approved` (finance approval, triggers budget restoration for debits)
  - `approved` → `applied` (netted against SA claim)
  - `pending/approved` → `voided` (manual void before application)
- **Validation**:
  - `direction` must be 'credit' or 'debit'
  - For debits: amount negative. For credits: amount positive
  - `bill_item_id` or `consumption_id` required for MYOB-detected
  - Only import when `myob_status` = 'closed'
  - `reason` required if type = 'manual'

**2. OutstandingCreditBalance**
- **Purpose**: Tracks unapplied adjustment amounts per client/funding allocation (debit adjustments only)
- **Key Fields**:
  - `id` (bigint, auto-increment)
  - `adjustment_id` (FK adjustments.id)
  - `funding_id` (FK fundings.id — **package-level**, not funding_stream_id)
  - `amount` (decimal, remaining credit)
  - `original_amount` (decimal, initial credit)
  - `fully_applied` (boolean)
- **Relationships**:
  - `belongsTo(Adjustment)`
  - `belongsTo(Funding)` — package-level funding allocation
- **Validation**:
  - `amount >= 0`
  - `amount <= original_amount`

**3. ConsumptionClaimSubmission** (new table)
- **Purpose**: Tracks SA claim submissions with netting applied via modified claim line amounts
- **Key Fields**:
  - `id` (bigint PK) + `uuid` (unique, public identifier)
  - `funding_id` (FK fundings.id — package-level funding)
  - `claim_amount` (decimal, amount claimed to SA — after netting, line amounts modified)
  - `original_amount` (decimal, pre-netting amount)
  - `adjustments_netted` (decimal, total adjustments deducted)
  - `sa_claim_reference` (string, SA API response, unique)
  - `status` (string: 'pending', 'submitted', 'reconciled', 'rejected')
  - `submitted_at`, `reconciled_at`
  - `soft_deletes`
- **Relationships**:
  - `belongsTo(Funding)` - Funding allocation claimed
  - `hasMany(ConsumptionClaimApplication)` - Adjustments applied
  - `belongsTo(User, 'submitted_by_user_id')` - Submitter
  - `belongsToMany(BudgetPlanItemFundingConsumption)` — Consumptions in batch
- **Validation**:
  - `claim_amount >= 0`
  - `claim_amount = original_amount - adjustments_netted`

**4. ConsumptionClaimApplication** (join table)
- **Purpose**: Links adjustments to SA claims (many-to-many with amounts)
- **Key Fields**:
  - `id` (bigint, auto-increment)
  - `consumption_claim_submission_id` (FK)
  - `adjustment_id` (FK)
  - `amount_applied` (decimal, portion of adjustment used)
  - `applied_at` (timestamp)
- **Relationships**:
  - `belongsTo(ConsumptionClaimSubmission)`
  - `belongsTo(Adjustment)`
- **Validation**:
  - `amount_applied > 0`
  - Sum of `amount_applied` for adjustment ≤ adjustment total

#### Database Schema Additions

> **Full migration Blueprint syntax**: See [data-model.md](context/data-model.md) Migration Plan section for complete Laravel Blueprint code.

**Migration 1: Create adjustments table** — bigint PK + uuid, bill/bill_item/consumption FKs, signed amount + direction, myob_status lifecycle, service_date
**Migration 2: Create outstanding_credit_balances table** — funding_id (not funding_stream_id), remaining/original amounts
**Migration 3: Create consumption_claim_submissions table** — bigint PK + uuid, funding_id, netting totals, SA reference
**Migration 4: Create consumption_claim_applications table** — Join table linking adjustments to claims with amount_applied

### API Contracts

#### Internal API Endpoints

**1. Adjustments CRUD**

```
GET    /api/adjustments                 # List all adjustments (paginated, filterable)
POST   /api/adjustments                 # Create manual adjustment
GET    /api/adjustments/{uuid}          # Show adjustment detail
PATCH  /api/adjustments/{uuid}/approve  # Approve adjustment
PATCH  /api/adjustments/{uuid}/void     # Void adjustment
```

**2. SA Claims**

```
GET    /api/sa-claims                   # List SA claim submissions
POST   /api/sa-claims/submit            # Submit consumption to SA (with netting)
GET    /api/sa-claims/{uuid}            # Show SA claim detail
PATCH  /api/sa-claims/{uuid}/reconcile  # Reconcile SA claim response
```

**3. Outstanding Credits Dashboard**

```
GET    /api/outstanding-credits         # List outstanding credit balances per funding stream
GET    /api/outstanding-credits/summary # Aggregated summary for dashboard
```

#### External API Integration

**1. MYOB API v2** (Webhook + Bulk Import)

**Sync Mechanism**: Webhook-based (not polling). MYOB sends notifications on adjustment status changes.
**Sync Trigger**: Only process at `closed` status (balanced → open → closed lifecycle).
**Matching**: External Reference ID = Portal `consumption_id`; Bill Item ID = `bill_item_id` fallback.
**AP Module Only**: All adjustments via Bills AP module. No payment objects or manual journals.

**Initial Bulk Import** (one-time):
```
GET /api/v2/sale/invoice?$filter=Type eq 'Bill' AND Status eq 'Closed' AND ServiceDate ge datetime'2024-11-01'
```

**Webhook Payload** (ongoing):
```json
{
  "uid": "abc-123-def",
  "type": "DebitNote",
  "status": "closed",
  "external_reference_id": "456",
  "bill_item_id": "789",
  "invoice_number": "DN-2024-001",
  "total": -20.00,
  "adjustment_type": "debit",
  "service_date": "2026-01-15"
}
```

**Matching Algorithm** (debit notes have no clean direct link — must match at line item level):
1. Each debit note **line item** has a `Bill Item ID` → left join to Portal `bill_items` table
2. If debit note line item matches original bill line item → association created (`bill_item_id` → `bill_id`)
3. `external_reference_id` on line item → match to `budget_plan_item_funding_consumptions.id` (secondary — may be soft-deleted)
4. `bill_item_id` is the **primary reliable path**; `consumption_id` is a bonus link

**2. Services Australia API** (Consumption Validation & Claim)

```
POST /api/v1/consumption/validate
POST /api/v1/consumption/claim
GET  /api/v1/claim/{reference}/status
```

**Netting Approach**: Modify original claim line amounts (not separate adjustment submissions).
The $36K already claimed to SA was done by reducing original claim amounts.

**Request Schema** (Claim with modified line amounts):
```json
{
  "provider_abn": "12345678901",
  "participant_id": "SA-PARTICIPANT-123",
  "claim_amount": 80.00,
  "original_amount": 100.00,
  "consumptions": [
    {
      "service_date": "2026-02-10",
      "service_type_code": "COORD",
      "amount": 80.00
    }
  ]
}
```

**Response Schema**:
```json
{
  "claim_reference": "SA-CLAIM-456",
  "status": "accepted",
  "claimed_amount": 80.00,
  "message": "Claim processed successfully"
}
```

### UI Components

#### 1. Adjustments Index Page (`resources/js/Pages/Finance/Adjustments/Index.vue`)

**Purpose**: Display all adjustments with MYOB deep links, filter/sort, approve/void actions

**Components**:
- `CommonPageHeader` - Page title and action buttons
- `AdjustmentsTable` - Server-side paginated table
  - Columns: Bill #, MYOB Link, Amount, Type, Status, Detected/Approved Date, Actions
  - Filters: Status (pending/approved/voided/applied), Type (MYOB/manual), Date range
  - Sort: Amount, Date
  - Row Actions: Approve, Void, View Detail
- `AdjustmentApprovalModal` - Confirm approval with reason
- `AdjustmentVoidModal` - Confirm void with reason

**Key Interactions**:
- Click MYOB Link → Opens MYOB transaction in new tab
- Click Approve → Opens modal, submit approval
- Click Void → Opens modal, submit void with reason
- Filter/Sort → Server-side reload (Inertia `preserveState`)

**Accessibility**:
- Keyboard navigation (Tab, Enter for actions)
- Focus visible on table rows
- ARIA labels for icon buttons
- Screen reader announcements for approval/void success

#### 2. SA Claim Review Page (`resources/js/Pages/Billing/Claims/SAClaimReview.vue`)

**Purpose**: Review auto-generated SA claim before submission, see netting breakdown

**Components**:
- `CommonPageHeader` - Page title ("Review SA Claim")
- `ClaimSummaryCard` - Original amount, adjustments netted, final claim amount
- `AdjustmentsNettedTable` - List of adjustments applied to this claim
- `ConsumptionDetailsCard` - Consumption info (service, date, participant)
- `SubmitClaimButton` - Primary action (submits to SA API)

**Key Interactions**:
- Review claim details → Finance user verifies netting is correct
- Click Submit → Submits claim to SA API via `ClaimConsumptionToSAAction`
- Success → Toast notification, redirect to claims index
- Error → Display error message, allow retry

**Accessibility**:
- Clear focus order (summary → adjustments → consumption → submit)
- Disabled submit button with loading state during submission
- Error messages announced via `aria-live="assertive"`

#### 3. Outstanding Credits Dashboard Widget (`resources/js/Components/Finance/OutstandingCreditsWidget.vue`)

**Purpose**: Show aggregated outstanding credits per funding stream

**Components**:
- `WidgetCard` - Container with title "Outstanding Credits"
- `CreditBalanceList` - List of funding streams with outstanding amounts
- `TotalCreditBadge` - Total outstanding across all streams

**Key Interactions**:
- Click funding stream → Filter Adjustments Index by that stream
- Click "View All" → Navigate to Adjustments Index

**Accessibility**:
- Semantic list markup (`<ul>`, `<li>`)
- Links with descriptive text (not just "View")

## Implementation Phases

### Phase 0: Research (Optional - if needed)

**Goal**: Resolve any NEEDS CLARIFICATION items (none currently)

**Tasks**:
- [x] MYOB API patterns reviewed — **webhook-based sync** (not polling), process at `closed` status only
- [x] SA API endpoints documented (validation, claim, reconciliation)
- [x] Netting algorithm designed — modify original claim line amounts (not separate submissions)
- [x] Matching algorithm finalized — External Reference ID = consumption_id, Bill Item ID = bill_item_id fallback
- [x] Adjustment types confirmed — both credit AND debit, signed amounts
- [x] MYOB status lifecycle mapped — balanced → open → closed
- [x] AP module confirmed — no payment objects or manual journals for adjustments

**Output**: MYOB Adjustments Discovery meeting (2026-02-12) resolved all outstanding questions.

### Phase 1: Adjustment System (Foundation)

**Goal**: Build adjustment detection, approval workflow, budget restoration

#### Sprint 1: Data Model & Event Sourcing

**Tasks**:
1. Create migrations for `adjustments`, `outstanding_credit_balances` tables
2. Create `Adjustment` model with relationships, scopes, accessors
3. Create `OutstandingCreditBalance` model
4. Create `AdjustmentAggregateRoot` with events:
   - `AdjustmentCreated`, `AdjustmentApproved`, `AdjustmentVoided`, `BudgetRestoredFromAdjustment`
5. Create Laravel Data classes:
   - `CreateAdjustmentData`, `ApproveAdjustmentData`, `OutstandingCreditBalanceData`
6. Write unit tests for models and aggregate root

**Deliverables**:
- Database schema created
- Event-sourced adjustment model
- Type-safe DTOs

**Tests**:
- Unit: Model relationships, state transitions, validation
- Feature: Adjustment CRUD operations

#### Sprint 2: MYOB Webhook Integration & Matching

**Tasks**:
1. Create `MYOBWebhookController` (receive MYOB adjustment status change webhooks)
2. Create `MYOBAdjustmentMatchingService` (match External Reference ID → consumption_id, Bill Item ID → bill_item_id)
3. Create `ProcessMYOBWebhookAction` (validate payload, filter `closed` only, create adjustment)
4. Create `BulkImportMYOBAdjustmentsJob` (one-time import, service_date >= 2024-11-01)
5. Create `CreateAdjustmentAction` (auto-create adjustment from webhook or bulk import)
6. Handle both credit AND debit adjustment types with signed amounts
7. Handle soft-deleted consumption IDs (fall back to bill_item_id → bill_id)
8. Write unit tests for matching service and webhook processing
9. Write feature tests for webhook endpoint and bulk import

**Deliverables**:
- MYOB webhook endpoint receiving adjustment notifications
- Bulk import command for historical adjustments
- Matching via consumption_id with bill_item_id fallback
- Both credit and debit directions supported

**Tests**:
- Unit: Matching algorithm (consumption_id match, soft-deleted fallback, bill_item_id → bill resolution)
- Unit: Direction/sign handling for credit vs debit
- Feature: Webhook → adjustment creation (closed status only, skip balanced/open)
- Feature: Bulk import with service date filtering

#### Sprint 3: Approval Workflow & Budget Restoration

**Tasks**:
1. Create `ApproveAdjustmentAction` (approve adjustment, trigger budget restoration)
2. Create `VoidAdjustmentAction` (void adjustment, reverse budget restoration)
3. Create `RestoreBudgetFromAdjustmentAction` (increase available funding)
4. Create `AdjustmentPolicy` (authorize approve/void based on user role)
5. Create `AdjustmentController` (API endpoints for CRUD, approve, void)
6. Create Laravel Pennant feature flag: `funding-adjustments`
7. Write unit tests for actions and policy
8. Write feature tests for approval workflow

**Deliverables**:
- Approval workflow with finance user authorization
- Budget restored immediately upon approval
- Void workflow with rollback

**Tests**:
- Unit: Budget restoration calculation, policy authorization
- Feature: Approve → budget restored, Void → budget reverted
- Browser: Manual approval flow in UI

#### Sprint 4: Frontend - Adjustments Index

**Tasks**:
1. Create `AdjustmentsTable` component (server-side pagination, filters, sort)
2. Create `Index.vue` page (list all adjustments, MYOB deep links)
3. Create `Show.vue` page (adjustment detail view)
4. Create `Create.vue` page (manual adjustment creation)
5. Create `AdjustmentApprovalModal` component
6. Create `AdjustmentVoidModal` component
7. Add routes to `web.php` and Ziggy route generation
8. Write browser tests for Adjustments Index interactions

**Deliverables**:
- Adjustments Index accessible to finance users
- MYOB deep links functional
- Approve/void actions working

**Tests**:
- Browser: Navigate to index, approve adjustment, void adjustment, filter/sort

### Phase 2: SA Claims Pipeline with Netting (Features)

**Goal**: Automate SA claim submission with adjustment netting

#### Sprint 5: Consumption Claim Models & Actions

**Tasks**:
1. Create migrations for `consumption_claim_submissions`, `consumption_claim_applications` tables
2. Create `ConsumptionClaimSubmission` model with relationships
3. Create `ConsumptionClaimApplication` model (join table)
4. Create `SAClaimSubmissionData`, `AdjustmentNettingData`, `SAClaimResponseData`
5. Create `CalculateOutstandingCreditsForClaimAction` (fetch unapplied adjustments for consumption's funding stream)
6. Create `NetAdjustmentsAgainstClaimAction` (calculate claim_amount = original_amount - adjustments_netted)
7. Write unit tests for netting calculation logic

**Deliverables**:
- Database schema for SA claims
- Netting calculation action with tests

**Tests**:
- Unit: Netting algorithm, edge cases (credits exceed claim, multiple adjustments, partial application)
- Feature: Create claim with netting applied

#### Sprint 6: SA API Integration & Claim Submission

**Tasks**:
1. Create `ServicesAustraliaAPIService` (validate consumption, submit claim, check status)
2. Create `ValidateConsumptionWithSAAction` (call SA API to validate consumption before claim)
3. Create `ClaimConsumptionToSAAction` (submit claim with netting applied)
4. Create `ReconcileSAClaimResponseAction` (process SA response, update adjustment status to 'applied')
5. Create `SubmitConsumptionToSAJob` (queued job for SA claim submission)
6. Create `ReconcileSAClaimJob` (queued job for SA reconciliation)
7. Create Laravel Pennant feature flag: `sa-automated-claims`
8. Write unit tests for SA API service and actions
9. Write feature tests for end-to-end claim flow

**Deliverables**:
- SA API integration functional
- Automated claim submission with netting
- Reconciliation updates adjustment status

**Tests**:
- Unit: SA API service, validation logic, reconciliation logic
- Feature: Submit claim → SA accepts → adjustment marked 'applied'
- Feature: Submit claim with netting → SA reconciles at reduced amount

#### Sprint 7: Frontend - SA Claim Review

**Tasks**:
1. Create `SAClaimReview.vue` page (review claim before submission)
2. Create `ClaimSummaryCard` component (original amount, netting breakdown, final amount)
3. Create `AdjustmentsNettedTable` component (list adjustments applied to claim)
4. Create `ConsumptionDetailsCard` component (consumption info)
5. Create `SubmitClaimButton` component (submit to SA API)
6. Add routes to `web.php` and Ziggy route generation
7. Write browser tests for SA claim review flow

**Deliverables**:
- SA Claim Review page accessible to finance users
- Netting breakdown visible before submission
- Submit claim action functional

**Tests**:
- Browser: Navigate to claim review, verify netting breakdown, submit claim

#### Sprint 8: Outstanding Credits Dashboard & Monitoring

**Tasks**:
1. Create `OutstandingCreditsWidget` component (dashboard widget showing aggregated credits)
2. Add widget to finance dashboard page
3. Create `outstanding-credits` API endpoint (list credits per funding stream)
4. Create `outstanding-credits/summary` API endpoint (aggregated summary)
5. Add Horizon monitoring for MYOB polling job and SA submission job
6. Add alerting for failed MYOB polling or SA submission (>5 consecutive failures)
7. Create admin page for credit aging report (credits not applied within X cycles)
8. Write browser tests for outstanding credits widget

**Deliverables**:
- Outstanding Credits Dashboard visible to finance users
- Horizon monitoring configured
- Alerting for job failures

**Tests**:
- Browser: View outstanding credits widget, click funding stream to filter
- Feature: Outstanding credits API returns correct data

### Phase 3: Integration & Polish (Polish)

**Goal**: Handle edge cases, optimize performance, launch to production

#### Sprint 9: Edge Cases & Error Handling

**Tasks**:
1. Handle "credits exceed claim amount" scenario (cap at zero, carry forward remainder)
2. Handle "SA rejects claim with netting" scenario (rollback adjustment status, re-apply on next claim)
3. Handle "credit raised for wrong amount/bill" scenario (void workflow, audit trail)
4. Handle "MYOB refund not done but credit created" scenario (validation check before approval)
5. Handle "large credit exceeds multiple claim cycles" scenario (aging dashboard, escalation)
6. Add retry logic with exponential backoff for SA API failures
7. Add dead-letter queue for permanently failed claims
8. Write feature tests for all edge cases

**Deliverables**:
- Robust error handling for edge cases
- Retry logic and dead-letter queue

**Tests**:
- Feature: Credits exceed claim → remainder carried forward
- Feature: SA rejects → adjustment rolled back to 'approved'
- Feature: Void incorrect adjustment → budget reverted

#### Sprint 10: Performance Optimization & Launch

**Tasks**:
1. Index foreign keys: `adjustments.bill_id`, `adjustments.myob_invoice_id`, `consumption_claim_submissions.consumption_id`
2. Eager load relationships in Adjustments Index (prevent N+1 queries)
3. Cache SA claim aggregations (invalidate on new adjustment approval)
4. Profile MYOB polling job (ensure <5 seconds per polling cycle)
5. Profile SA claim submission (ensure <5 seconds P95)
6. Run full test suite (unit + feature + browser)
7. Deploy to staging with feature flags disabled
8. Enable `funding-adjustments` flag for 10% (beta test)
9. Monitor and gather feedback
10. Enable `funding-adjustments` flag for 100% (full launch)
11. Enable `sa-automated-claims` flag for 10% (beta test)
12. Monitor and gather feedback
13. Enable `sa-automated-claims` flag for 100% (full launch)

**Deliverables**:
- Performance optimized (indexes, caching, eager loading)
- Full test suite passing
- Feature launched to production with gradual rollout

**Tests**:
- Full test suite (unit + feature + browser)
- Performance profiling (MYOB polling, SA claim submission)
- Staging validation

## Testing Strategy

**Approach**: Implement testing with Pest at each phase:
- Write tests FIRST (TDD mindset)
- Test after each phase completes
- Include unit, feature, and browser tests

### Test Coverage by Phase

#### Phase 1: Foundation Tests

**Unit Tests**: (Target: >90% coverage for business logic)
- `Adjustment` model relationships, state transitions, validation rules
- `AdjustmentAggregateRoot` event sourcing logic
- `MYOBAdjustmentMatchingService` matching algorithm (MYOB Invoice ID → Portal Bill)
- `RestoreBudgetFromAdjustmentAction` budget calculation logic
- `AdjustmentPolicy` authorization rules

**Feature Tests**: (Target: >80% overall coverage)
- Adjustment CRUD API endpoints (create, approve, void)
- MYOB polling job (detect credit notes, create adjustments)
- Budget restoration workflow (approve adjustment → budget increases)
- Void workflow (void adjustment → budget reverts)

**Browser Tests**: (Nightwatch v1)
- Navigate to Adjustments Index
- Approve adjustment via UI modal
- Void adjustment via UI modal
- Filter adjustments by status
- Sort adjustments by amount/date

#### Phase 2: Feature Tests

**Unit Tests**:
- `CalculateOutstandingCreditsForClaimAction` credit aggregation logic
- `NetAdjustmentsAgainstClaimAction` netting calculation (original - adjustments = claim)
- `ServicesAustraliaAPIService` API request/response handling
- `ReconcileSAClaimResponseAction` reconciliation logic

**Feature Tests**:
- SA claim submission workflow (consumption → validate → claim → reconcile)
- Netting applied to claim (original $100, credit $20, claimed $80)
- Multiple adjustments netted against single claim
- SA claim reconciliation updates adjustment status to 'applied'
- SA claim rejection rollback (adjustment remains 'approved', re-applied on next claim)

**Browser Tests**:
- Navigate to SA Claim Review page
- Review netting breakdown (verify amounts)
- Submit claim to SA API
- View outstanding credits dashboard widget
- Click funding stream to filter adjustments

#### Phase 3: Integration & Polish Tests

**Unit Tests**:
- Edge case: Credits exceed claim amount (cap at zero, carry forward)
- Edge case: Large credit spans multiple claim cycles
- Retry logic with exponential backoff

**Feature Tests**:
- Credits exceed claim → remainder carried forward to next claim
- SA rejects claim → adjustment rolled back to 'approved'
- Void incorrect adjustment → audit trail recorded
- MYOB polling failure → retry with backoff
- SA submission failure → dead-letter queue

**Browser Tests**:
- Full user journey: MYOB refund detected → adjustment approved → budget restored → SA claim submitted → adjustment applied
- Performance: Adjustments Index loads <2 seconds with 1000+ rows
- Accessibility: Keyboard navigation, focus visible, screen reader announcements

### Test Tools & Location

**Pest v3** (PHP testing framework)
- `tests/Unit/Finance/Adjustment/` - Adjustment domain unit tests
- `tests/Unit/Billing/Claim/` - SA claim domain unit tests
- `tests/Feature/Finance/Adjustment/` - Adjustment workflow feature tests
- `tests/Feature/Billing/Claim/` - SA claim workflow feature tests

**Nightwatch v1** (Browser testing)
- `tests/Browser/Finance/AdjustmentIndexTest.php` - Adjustments Index interactions
- `tests/Browser/Billing/SAClaimReviewTest.php` - SA Claim Review interactions

### Test Execution Checklist

- [ ] Phase 1: Unit tests passing (Adjustment models, actions, services)
- [ ] Phase 1: Feature tests passing (MYOB polling, approval workflow, budget restoration)
- [ ] Phase 1: Browser tests passing (Adjustments Index)
- [ ] Phase 2: Unit tests passing (Netting calculation, SA API service, reconciliation)
- [ ] Phase 2: Feature tests passing (SA claim submission, netting applied, reconciliation)
- [ ] Phase 2: Browser tests passing (SA Claim Review, Outstanding Credits Widget)
- [ ] Phase 3: Full test suite passing (unit + feature + browser)
- [ ] Phase 3: Performance profiling (MYOB polling <5s, SA claim <5s P95)
- [ ] Phase 3: Accessibility testing (keyboard navigation, screen reader)

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| **SA rejects claim with netted amounts** | Low | High | Rollback adjustment status to 'approved', re-apply on next claim automatically. Test with SA sandbox environment first. |
| **Credit raised for wrong amount/bill** | Medium | Medium | Approval workflow with mandatory reason codes. Credits can be voided before claim submission. Audit trail records all voids. |
| **Other providers claimed same funding via SA** | Low | Medium | System only nets against Trilogy Care's own claims. Other-provider scenarios flagged for manual handling by finance team. |
| **Credit note raised in Portal but refund not done in MYOB** | Medium | High | Workflow requires MYOB refund reference before credit approval. Validation check ensures MYOB Invoice ID exists. |
| **Large credit exceeds multiple claim cycles** | Medium | Low | Dashboard visibility of outstanding credits with aging. Escalation for credits not applied within X cycles (configurable). |
| **MYOB API rate limiting** | Low | Medium | Implement exponential backoff retry logic. Cache last successful sync timestamp. Monitor Horizon for failed jobs. |
| **SA API downtime during claim submission** | Medium | High | Queue-based submission with retry logic. Dead-letter queue for permanently failed claims. Alerting for >5 consecutive failures. |
| **Budget restoration calculation error** | Low | High | Comprehensive unit tests for budget restoration logic. Event sourcing provides audit trail to detect errors. Dry-run mode for testing. |
| **MYOB matching algorithm fails (no match found)** | Medium | Medium | Log unmatched MYOB credit notes to admin dashboard. Finance team manually links or voids. Monitor unmatched rate. |
| **Performance degradation with 1000+ adjustments** | Low | Medium | Index foreign keys. Eager load relationships. Cache aggregations. Profile with 10K+ adjustment seed data. |

## Development Clarifications

### Session 2026-02-11

**Q1: Should we extend existing `SyncMyobTransactionsJob` or create separate sync mechanism?**
→ **A: Webhook-based sync** (updated from meeting 2026-02-12) — MYOB sends webhook notifications on adjustment status changes. Do NOT extend existing polling job. Create `MYOBWebhookController` + `ProcessMYOBWebhookAction`. Initial bulk import via `BulkImportMYOBAdjustmentsJob` for historical data. Only process adjustments at `closed` status.

**Q2: Should budget restoration be within Adjustment aggregate or separate Budget aggregate?**
→ **A: Budget restoration within Adjustment aggregate** - Single aggregate owns complete lifecycle (create → approve → budget restore → void → budget revert). Simpler event replay, atomic operations, easier testing. Budget changes via `RestoreBudgetFromAdjustmentAction` called by aggregate, maintaining single source of truth for adjustment-driven budget modifications.

**Q3: Should SA claim submissions be real-time per consumption or batched daily/weekly?**
→ **A: Batched daily/weekly submission** - Aggregate consumptions per client/funding stream, net all credits once, submit batch to SA API. Fewer API calls, better performance, follows industry standard for claims processing. 60-day claim window provides buffer for batching without compliance risk. Scheduled job triggers batch assembly with Finance review before submission.

**Q4: Should we follow strict TDD (tests before implementation) or test-after-implementation?**
→ **A: Strict TDD for business logic only** - Test-first for Actions, Services, Aggregates (business logic where bugs are costly). Test-after for migrations, models, controllers, UI (infrastructure code). Balances quality with velocity. Critical paths (budget restoration, netting calculations, MYOB matching) get full TDD treatment with >95% coverage.

**Q5: What should the feature flag rollout strategy be for each phase?**
→ **A: Aggressive rollout** - Phase 1: 25% → 100%. Phase 2: 10% → 100%. Faster value delivery, budget restoration is reversible (low risk), team confident in test coverage. Rollback easy at each stage if issues detected. Monitor Horizon and error logs during rollout phases.

## Next Steps

1. ✅ **Constitution Check**: Passed - plan fully aligned
2. **Phase 0 Research**: Skipped - all clarifications resolved in spec
3. **Phase 1 Design**: Generate `data-model.md`, `contracts/`, `quickstart.md`
4. **Run `/speckit.tasks`**: Generate dependency-ordered tasks from plan
5. **Run `/trilogy.mockup`**: Create UI mockups for Adjustments Index and SA Claim Review (optional)
6. **Run `/speckit.implement`**: Start phased implementation

---

**Plan Status**: Ready for implementation. All gates passed. All clarifications resolved.

**Feature Flag Strategy**:
- Phase 1 Launch: `funding-adjustments` (25% → 100%)
- Phase 2 Launch: `sa-automated-claims` (10% → 100%)

**Success Metrics** (from spec, updated):
- 100% of MYOB adjustments (credits + debits) synced to Portal via webhook
- Client budget accuracy 100% (Portal matches MYOB available funds)
- Zero bills blocked due to incorrect budget consumption
- $500K overclaim to SA reconciled within 2 claim cycles
- Webhook processing time: <2 seconds per event
- Credit application to SA claims 100% automated (modified claim line amounts, zero manual CSV work)
