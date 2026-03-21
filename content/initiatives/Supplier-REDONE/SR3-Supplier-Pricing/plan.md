---
title: "Implementation Plan: Supplier Pricing"
---

# Implementation Plan: Supplier Pricing

**Branch**: `sr3-supplier-pricing` | **Date**: 2026-03-19 | **Spec**: [spec.md](/initiatives/supplier-redone/sr3-supplier-pricing/spec)
**Design**: [design.md](/initiatives/supplier-redone/sr3-supplier-pricing/design)
**Dependencies**: SR0 (API Foundation & Two-Tier Auth), SR2 (Profile & Org Management)

## Summary

Build a per-location, per-service-type pricing management system for the supplier portal. Suppliers enter rates across 6 categories (weekday, non-standard weekday, Saturday, Sunday, public holiday, travel) with N/A toggles. Rates within price caps are auto-approved; over-cap rates enter a price request workflow reviewed by staff on an approve/reject dashboard. The system tracks supplier flag counts (2 flags = billing hold), provides compliance visibility, generates PDF pricing references, and maintains a full audit trail. All pricing is scoped to the supplier entity level (not organisation level), consistent with the SR2 two-tier model.

**Architecture**: Laravel 12 PHP 8.4 API backend + React Next.js frontend (standalone, via SR0 API). MySQL database.

## Technical Context

**Language/Version**: PHP 8.4 (Laravel 12 backend), TypeScript (React Next.js frontend)
**Primary Dependencies**: Laravel 12, Sanctum (auth), Laravel Data (validation), Lorisleiva Actions, Spatie Activity Log, Next.js, shadcn/ui, TanStack Table
**Storage**: MySQL (existing `organisation_prices` table extended, new `price_caps`, `price_requests`, `price_audit_logs` tables)
**Testing**: Pest 3 (backend), Vitest + React Testing Library (frontend)
**Target Platform**: Web (desktop-primary, tablet-functional)
**Performance Goals**: PDF generation < 5s (SC-008), batch approval < 3s (SC-009), cap re-validation handles thousands of rates async
**Constraints**: Price cap values never exposed to suppliers (FR-004, FR-020). All pricing scoped to supplier entity level (FR-021).
**Scale/Scope**: ~13,000 suppliers, 6 rate categories per service type per location, ~2-5 service types per location

## Constitution Check

*GATE: Gate 3 Architecture — see [03-architecture.md](/ways-of-working/gates/03-architecture)*

### 1. Technical Feasibility

| Check | Status | Notes |
|-------|--------|-------|
| Architecture approach clear | PASS | API-first: Laravel actions + API resources → React frontend via SR0 API v2 |
| Existing patterns leveraged | PASS | Extends existing `OrganisationPrice` model, uses `AsAction` pattern, Spatie Activity Log for audit |
| No impossible requirements | PASS | All FRs are buildable with current stack |
| Performance considered | PASS | Cap re-validation runs as queued job; PDF generated server-side; batch operations use bulk queries |
| Security considered | PASS | Cap values excluded from all supplier-facing API responses; non-specific error messages prevent cap derivation (FR-020) |

### 2. Data & Integration

| Check | Status | Notes |
|-------|--------|-------|
| Data model understood | PASS | Existing `organisation_prices` table extended with approval columns; new tables for caps, requests, audit |
| API contracts clear | PASS | RESTful v2 endpoints defined below |
| Dependencies identified | PASS | SR0 (auth, API envelope), SR2 (supplier entity context, locations, service type links) |
| Integration points mapped | PASS | Existing `OrganisationPrice`, `OrganisationLocation`, `ServiceType` models; Spatie Activity Log; Laravel Notifications |
| DTO persistence explicit | PASS | Laravel Data classes for all request/response payloads |

### 3. Implementation Approach

| Check | Status | Notes |
|-------|--------|-------|
| File changes identified | PASS | See Project Structure below |
| Risk areas noted | PASS | Cap re-validation at scale, cap value leakage prevention, N/A vs $0 migration |
| Testing approach defined | PASS | Pest feature tests per action; React Testing Library for grid interactions |
| Rollback possible | PASS | Feature flag gated; database migrations are additive (new columns + new tables) |

### 4. Resource & Scope

| Check | Status | Notes |
|-------|--------|-------|
| Scope matches spec | PASS | 1:1 with FR-001 through FR-021 |
| Effort reasonable | PASS | ~3-4 weeks estimated |
| Skills available | PASS | Laravel + React + shadcn/ui |

### 5. Laravel & Cross-Platform Best Practices

| Check | Status | Notes |
|-------|--------|-------|
| No hardcoded business logic | PASS | Cap validation logic in backend action, not frontend |
| Cross-platform reusability | PASS | All business logic in API actions; frontend is a pure consumer |
| Laravel Data for validation | PASS | All request validation via Data classes |
| Model route binding | PASS | Controllers use Model instances |
| No magic numbers/IDs | PASS | Rate categories as enum; approval statuses as enum; flag thresholds as constants |
| Common components pure | PASS | `CurrencyInput`, `RateStatusBadge`, `ComplianceSummaryBar` — zero business logic |
| Use Lorisleiva Actions | PASS | All business operations as actions with `AsAction` trait |
| Action authorization in authorize() | PASS | Auth checks in action `authorize()` methods |
| Data classes remain anemic | PASS | DTOs for transport only |
| Migrations schema-only | PASS | Data backfill via Laravel Operation (existing null rates need no migration — already nullable) |
| Models have single responsibility | PASS | `PriceCap` separate from `OrganisationPrice`; `PriceRequest` separate from both |
| Granular model policies | PASS | `OrganisationPricePolicy`, `PriceRequestPolicy`, `PriceCapPolicy` |
| Response objects in auth | PASS | `Response::allow()` / `Response::deny('reason')` |
| Event sourcing: granular events | N/A | Pricing uses Spatie Activity Log, not event sourcing (consistent with existing `OrganisationPrice` which already uses `LogsActivity`) |
| Semantic column documentation | PASS | All new columns documented with PHPDoc |
| Feature flags dual-gated | PASS | `SupplierPricing` Pennant flag; backend middleware + frontend `HasFeatureFlag` |

### 6. React TypeScript Standards (Frontend Architecture)

> Note: SR3 targets the **new React (Next.js) frontend** — not the existing Vue/Inertia frontend. Gate 3 Section 6 is written for Vue but the principles apply equally. The React equivalents are documented below.

| Check | Status | Notes |
|-------|--------|-------|
| All components use TypeScript | PASS | `.tsx` files only; strict mode in `tsconfig.json` |
| Props use named types | PASS | `type Props = { ... }` for all components |
| No `any` types | PASS | All API response shapes typed; shared types in `src/types/` |
| Shared types identified | PASS | `src/types/pricing.ts` for cross-component types |
| shadcn/ui components reused | PASS | Table, Badge, Button, Dialog, Select, Tabs, Checkbox, Input, Textarea, Progress, Tooltip, Alert |
| New components assessed for common eligibility | PASS | `CurrencyInput` → common (reusable currency input); `RateStatusBadge` → common (reusable status badge); `ComplianceSummaryBar` → bespoke (pricing-specific); `RateCard` → bespoke (pricing-specific mobile layout) |

### 7. Component Decomposition (Frontend Architecture)

| Check | Status | Notes |
|-------|--------|-------|
| Component decomposition planned | PASS | See Component Architecture section below |
| Each sub-component has single concern | PASS | Grid, summary bar, rate card, request dialog — each renders one thing |
| Parent owns logic | PASS | Page components own data fetching and state; sub-components receive props |
| Directory structure defined | PASS | See directory tree below |
| Naming is simple | PASS | Directory provides namespace |
| No template section comments planned | PASS | Each section is its own component |

### 8. Composition-Based Architecture (Frontend Architecture)

| Check | Status | Notes |
|-------|--------|-------|
| Composables (hooks) for reusable logic | PASS | `usePricingGrid`, `usePriceValidation`, `useComplianceStatus` |
| Primitives are small and single-purpose | PASS | `CurrencyInput`, `RateStatusBadge`, `NaToggle` |
| Composed via props, not boolean flags | PASS | No `showHeader` / `variant` prop toggles |
| Slots (children/render props) for layout control | PASS | Parent pages compose sub-components directly |

---

## Data Model

### Existing Table: `organisation_prices` (Extended)

The existing table already stores per-location, per-service-type rates with nullable columns. New columns are added for approval tracking.

```sql
-- New columns added to organisation_prices
ALTER TABLE organisation_prices
  ADD COLUMN approval_status VARCHAR(20) NOT NULL DEFAULT 'pending'
    COMMENT 'pending, approved, flagged, na',
  ADD COLUMN approved_at TIMESTAMP NULL DEFAULT NULL
    COMMENT 'When the rate was approved (auto or manual)',
  ADD COLUMN approved_by BIGINT UNSIGNED NULL DEFAULT NULL
    COMMENT 'Staff user ID who approved (null for auto-approval)',
  ADD COLUMN flag_count INT UNSIGNED NOT NULL DEFAULT 0
    COMMENT 'Number of unresolved flags on this specific rate',
  ADD COLUMN is_platform_sourced TINYINT(1) NOT NULL DEFAULT 0
    COMMENT 'True if rate sourced from digital platform (Mable etc), excluded from cap validation';
```

**Approval status values** (stored as string, validated via enum):
- `pending` — Rate submitted but not yet validated (initial state during save)
- `approved` — Rate within cap (auto-approved) or manually approved by staff
- `flagged` — Rate exceeds cap + 10% tolerance, awaiting price request or re-submission
- `na` — Rate toggled as not applicable (null value, distinct from $0)

### New Table: `price_caps`

```sql
CREATE TABLE price_caps (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  service_type_id BIGINT UNSIGNED NOT NULL,
  rate_category VARCHAR(30) NOT NULL
    COMMENT 'weekday, non_standard_weekday, saturday, sunday, public_holiday, travel',
  cap_amount DECIMAL(10,2) NOT NULL
    COMMENT 'Maximum acceptable rate as fixed dollar amount',
  tolerance_percentage DECIMAL(5,2) NOT NULL DEFAULT 10.00
    COMMENT 'Percentage above cap before flagging (default 10%)',
  created_at TIMESTAMP NULL,
  updated_at TIMESTAMP NULL,
  UNIQUE KEY price_caps_service_rate_unique (service_type_id, rate_category),
  CONSTRAINT price_caps_service_type_foreign FOREIGN KEY (service_type_id)
    REFERENCES service_types(id)
);
```

### New Table: `price_requests`

```sql
CREATE TABLE price_requests (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  organisation_price_id BIGINT UNSIGNED NOT NULL
    COMMENT 'The rate record this request is for',
  supplier_id BIGINT UNSIGNED NOT NULL
    COMMENT 'Supplier entity that submitted the request',
  submitted_rate DECIMAL(10,2) NOT NULL
    COMMENT 'The rate the supplier wants approved',
  justification TEXT NOT NULL
    COMMENT 'Supplier reason for the higher rate',
  status VARCHAR(20) NOT NULL DEFAULT 'pending'
    COMMENT 'pending, approved, rejected',
  reviewed_by BIGINT UNSIGNED NULL
    COMMENT 'Staff user who reviewed',
  reviewed_at TIMESTAMP NULL,
  review_notes TEXT NULL
    COMMENT 'Staff notes (rejection reason sent to supplier)',
  created_at TIMESTAMP NULL,
  updated_at TIMESTAMP NULL,
  CONSTRAINT price_requests_org_price_foreign FOREIGN KEY (organisation_price_id)
    REFERENCES organisation_prices(id),
  CONSTRAINT price_requests_supplier_foreign FOREIGN KEY (supplier_id)
    REFERENCES suppliers(id),
  INDEX price_requests_status_index (status),
  INDEX price_requests_supplier_index (supplier_id)
);
```

### New Table: `price_audit_logs`

```sql
CREATE TABLE price_audit_logs (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  auditable_type VARCHAR(255) NOT NULL
    COMMENT 'Model class (OrganisationPrice, PriceCap, PriceRequest)',
  auditable_id BIGINT UNSIGNED NOT NULL,
  action VARCHAR(30) NOT NULL
    COMMENT 'rate_submitted, rate_approved, rate_flagged, rate_rejected, cap_updated, request_submitted, request_approved, request_rejected, flag_resolved',
  actor_id BIGINT UNSIGNED NULL
    COMMENT 'User who performed the action (null for system auto-approve)',
  actor_type VARCHAR(20) NULL
    COMMENT 'supplier or staff',
  old_value JSON NULL
    COMMENT 'Previous state',
  new_value JSON NULL
    COMMENT 'New state',
  metadata JSON NULL
    COMMENT 'Additional context (e.g., cap value at time of validation, rejection reason)',
  created_at TIMESTAMP NULL,
  INDEX price_audit_auditable_index (auditable_type, auditable_id),
  INDEX price_audit_actor_index (actor_id),
  INDEX price_audit_action_index (action)
);
```

### New Table: `supplier_entity_flags`

Tracks flag state per supplier entity (not per rate) for billing hold logic.

```sql
CREATE TABLE supplier_entity_flags (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  supplier_id BIGINT UNSIGNED NOT NULL
    COMMENT 'Supplier entity (not organisation)',
  organisation_price_id BIGINT UNSIGNED NOT NULL
    COMMENT 'The specific rate that caused the flag',
  reason TEXT NULL
    COMMENT 'Why the flag was applied',
  resolved_at TIMESTAMP NULL
    COMMENT 'When the flag was resolved (rate corrected and re-approved)',
  resolved_by BIGINT UNSIGNED NULL
    COMMENT 'Staff user who resolved (via re-approval)',
  created_at TIMESTAMP NULL,
  updated_at TIMESTAMP NULL,
  CONSTRAINT entity_flags_supplier_foreign FOREIGN KEY (supplier_id)
    REFERENCES suppliers(id),
  CONSTRAINT entity_flags_price_foreign FOREIGN KEY (organisation_price_id)
    REFERENCES organisation_prices(id),
  INDEX entity_flags_supplier_index (supplier_id),
  INDEX entity_flags_unresolved_index (supplier_id, resolved_at)
);
```

### Enum: `ApprovalStatusEnum`

```php
enum ApprovalStatusEnum: string
{
    case PENDING = 'pending';
    case APPROVED = 'approved';
    case FLAGGED = 'flagged';
    case NA = 'na';
}
```

### Enum: `PriceRequestStatusEnum`

```php
enum PriceRequestStatusEnum: string
{
    case PENDING = 'pending';
    case APPROVED = 'approved';
    case REJECTED = 'rejected';
}
```

### Enum: `RateCategoryEnum`

```php
enum RateCategoryEnum: string
{
    case WEEKDAY = 'weekday';
    case NON_STANDARD_WEEKDAY = 'non_standard_weekday';
    case SATURDAY = 'saturday';
    case SUNDAY = 'sunday';
    case PUBLIC_HOLIDAY = 'public_holiday';
    case TRAVEL = 'travel';
}
```

### Enum: `PriceAuditActionEnum`

```php
enum PriceAuditActionEnum: string
{
    case RATE_SUBMITTED = 'rate_submitted';
    case RATE_AUTO_APPROVED = 'rate_auto_approved';
    case RATE_FLAGGED = 'rate_flagged';
    case REQUEST_SUBMITTED = 'request_submitted';
    case REQUEST_APPROVED = 'request_approved';
    case REQUEST_REJECTED = 'request_rejected';
    case CAP_UPDATED = 'cap_updated';
    case FLAG_RESOLVED = 'flag_resolved';
    case FLAG_APPLIED = 'flag_applied';
    case BILLING_HOLD_APPLIED = 'billing_hold_applied';
    case BILLING_HOLD_LIFTED = 'billing_hold_lifted';
}
```

### Model Constants

```php
// On OrganisationPrice model
/** Number of unresolved flags that triggers a billing hold for the supplier entity */
public const int BILLING_HOLD_FLAG_THRESHOLD = 2;
```

---

## API Contracts (v2)

All endpoints are prefixed with `/api/v2/` and use the SR0 standard envelope format. Authentication via Sanctum token with active supplier context.

### Supplier-Facing Endpoints

#### GET `/api/v2/suppliers/{supplier}/pricing/overview`
Returns compliance summary and location list with completion stats for the active supplier entity.

```json
{
  "data": {
    "compliance": {
      "approved_count": 24,
      "pending_count": 3,
      "flagged_count": 1,
      "incomplete_count": 2,
      "flag_count": 1,
      "is_billing_on_hold": false
    },
    "locations": [
      {
        "id": 1,
        "name": "123 Collins St, Melbourne",
        "service_type_count": 3,
        "completion_percentage": 90,
        "has_flagged_rates": false
      }
    ]
  }
}
```

#### GET `/api/v2/suppliers/{supplier}/pricing/locations/{location}`
Returns the pricing grid for a specific location, grouped by service type.

```json
{
  "data": {
    "location": { "id": 1, "name": "123 Collins St, Melbourne" },
    "service_types": [
      {
        "id": 5,
        "name": "Allied Health",
        "rates": {
          "direct": [
            {
              "id": 101,
              "rate_category": "weekday",
              "value": 62.50,
              "is_na": false,
              "approval_status": "approved"
            },
            {
              "id": 102,
              "rate_category": "travel",
              "value": null,
              "is_na": true,
              "approval_status": "na"
            }
          ],
          "indirect": []
        },
        "pending_requests": [
          {
            "id": 10,
            "rate_category": "public_holiday",
            "submitted_rate": 110.00,
            "status": "pending",
            "created_at": "2026-03-19T10:00:00Z"
          }
        ]
      }
    ]
  }
}
```

**Note**: No cap values are ever included in supplier-facing responses (FR-004).

#### PUT `/api/v2/suppliers/{supplier}/pricing/locations/{location}/service-types/{serviceType}`
Submit or update rates for a service type at a location. Backend validates against caps and returns per-rate approval results.

**Request**:
```json
{
  "rate_type": "DIRECT",
  "rates": [
    { "rate_category": "weekday", "value": 62.50, "is_na": false },
    { "rate_category": "non_standard_weekday", "value": 68.00, "is_na": false },
    { "rate_category": "saturday", "value": 75.00, "is_na": false },
    { "rate_category": "sunday", "value": 85.00, "is_na": false },
    { "rate_category": "public_holiday", "value": 110.00, "is_na": false },
    { "rate_category": "travel", "value": null, "is_na": true }
  ]
}
```

**Response**:
```json
{
  "data": {
    "results": [
      { "rate_category": "weekday", "approval_status": "approved" },
      { "rate_category": "non_standard_weekday", "approval_status": "approved" },
      { "rate_category": "saturday", "approval_status": "approved" },
      { "rate_category": "sunday", "approval_status": "approved" },
      { "rate_category": "public_holiday", "approval_status": "flagged", "requires_price_request": true },
      { "rate_category": "travel", "approval_status": "na" }
    ],
    "message": "5 rates saved. 4 approved, 1 requires a price request."
  }
}
```

**Note**: The `flagged` status uses non-specific language — "exceeds the acceptable range" — to prevent cap derivation (FR-020).

#### POST `/api/v2/suppliers/{supplier}/pricing/price-requests`
Submit a price request for an over-cap rate.

**Request**:
```json
{
  "organisation_price_id": 105,
  "justification": "Remote clients on public holidays require specialist staff with penalty rate agreements."
}
```

#### GET `/api/v2/suppliers/{supplier}/pricing/price-requests`
List all price requests for the active supplier entity.

#### GET `/api/v2/suppliers/{supplier}/pricing/pdf?location_id=1&service_type_id=5`
Generate and download a PDF pricing reference for a specific location and service type.

### Staff-Facing Endpoints

#### GET `/api/v2/staff/pricing/submissions`
Paginated list of pending price submissions with filters.

**Query params**: `status`, `service_type_id`, `location_id`, `supplier_search`, `page`, `per_page`

**Response** includes cap values (staff-only):
```json
{
  "data": [
    {
      "id": 10,
      "supplier": { "id": 1, "name": "Acme Allied Health" },
      "location": { "id": 1, "name": "Collins St, Melbourne" },
      "service_type": { "id": 5, "name": "Allied Health" },
      "rate_category": "public_holiday",
      "submitted_rate": 110.00,
      "cap_amount": 105.00,
      "justification": "Remote clients, specialist staff...",
      "flag_count": 1,
      "is_billing_on_hold": false,
      "created_at": "2026-03-19T10:00:00Z"
    }
  ],
  "meta": { "current_page": 1, "last_page": 3, "total": 23 }
}
```

#### POST `/api/v2/staff/pricing/submissions/{priceRequest}/approve`
Approve a price request.

#### POST `/api/v2/staff/pricing/submissions/{priceRequest}/reject`
Reject a price request with reason and optional flag.

**Request**:
```json
{
  "reason": "Rate significantly exceeds market rate for this service type.",
  "apply_flag": true
}
```

#### POST `/api/v2/staff/pricing/submissions/batch-approve`
Batch approve multiple price requests.

**Request**:
```json
{
  "price_request_ids": [10, 11, 12]
}
```

#### POST `/api/v2/staff/pricing/service-type-approve`
Service-type level approval (FR-014).

**Request**:
```json
{
  "supplier_id": 1,
  "location_id": 1,
  "service_type_id": 5
}
```

#### GET `/api/v2/staff/pricing/caps`
List all price caps, optionally filtered by service type.

#### PUT `/api/v2/staff/pricing/caps/{serviceType}`
Update caps for a service type. Triggers async re-validation.

**Request**:
```json
{
  "caps": [
    { "rate_category": "weekday", "cap_amount": 65.00 },
    { "rate_category": "non_standard_weekday", "cap_amount": 72.00 },
    { "rate_category": "saturday", "cap_amount": 80.00 },
    { "rate_category": "sunday", "cap_amount": 90.00 },
    { "rate_category": "public_holiday", "cap_amount": 100.00 },
    { "rate_category": "travel", "cap_amount": 45.00 }
  ]
}
```

#### GET `/api/v2/staff/pricing/audit-log`
Paginated audit trail with filters.

**Query params**: `supplier_id`, `service_type_id`, `action`, `date_from`, `date_to`, `page`

---

## Project Structure

### Backend (Laravel — `tc-portal`)

```text
domain/Organisation/
├── Enums/
│   ├── RateTypeEnum.php                    # Existing (DIRECT, INDIRECT)
│   ├── ApprovalStatusEnum.php              # NEW
│   ├── PriceRequestStatusEnum.php          # NEW
│   ├── RateCategoryEnum.php                # NEW
│   └── PriceAuditActionEnum.php            # NEW
├── Models/
│   ├── OrganisationPrice.php               # MODIFIED — add approval columns, relationships
│   ├── OrganisationLocation.php            # Existing (no changes)
│   ├── PriceCap.php                        # NEW
│   ├── PriceRequest.php                    # NEW
│   ├── PriceAuditLog.php                   # NEW
│   └── SupplierEntityFlag.php              # NEW
├── Factories/
│   ├── OrganisationPriceFactory.php        # MODIFIED — include approval_status
│   ├── PriceCapFactory.php                 # NEW
│   ├── PriceRequestFactory.php             # NEW
│   └── SupplierEntityFlagFactory.php       # NEW
├── Policies/
│   ├── OrganisationPricePolicy.php         # NEW
│   ├── PriceRequestPolicy.php             # NEW
│   └── PriceCapPolicy.php                 # NEW
├── Data/
│   ├── SubmitRatesData.php                 # NEW — request DTO for rate submission
│   ├── SubmitPriceRequestData.php          # NEW — request DTO for price request
│   ├── UpdatePriceCapData.php              # NEW — request DTO for cap update
│   ├── RejectPriceRequestData.php          # NEW — request DTO for rejection
│   ├── BatchApprovePriceRequestData.php    # NEW — request DTO for batch approve
│   └── RateEntryData.php                   # NEW — individual rate entry within submission
├── Actions/
│   ├── SubmitSupplierRatesAction.php       # NEW — core rate submission + cap validation
│   ├── SubmitPriceRequestAction.php        # NEW — create price request for over-cap rate
│   ├── ApprovePriceRequestAction.php       # NEW — approve a pending price request
│   ├── RejectPriceRequestAction.php        # NEW — reject with reason + optional flag
│   ├── BatchApprovePriceRequestsAction.php # NEW — batch approve
│   ├── ApproveServiceTypeRatesAction.php   # NEW — service-type level approval (FR-014)
│   ├── UpdatePriceCapsAction.php           # NEW — update caps + dispatch re-validation
│   ├── ValidateRateAgainstCapAction.php    # NEW — single rate vs cap check (shared logic)
│   ├── RecordPriceAuditAction.php          # NEW — write to price_audit_logs
│   ├── ApplySupplierFlagAction.php         # NEW — add flag, check billing hold threshold
│   ├── ResolveSupplierFlagAction.php       # NEW — resolve flag when rate corrected
│   └── GeneratePricingPdfAction.php        # NEW — generate PDF pricing reference
├── Jobs/
│   └── RevalidateRatesAfterCapChangeJob.php # NEW — queued job for bulk re-validation
├── Notifications/
│   ├── PriceRequestApprovedNotification.php  # NEW — in-app + optional email
│   ├── PriceRequestRejectedNotification.php  # NEW — in-app + optional email
│   ├── RatesReflaggedNotification.php        # NEW — batch notification on cap change
│   └── BillingHoldAppliedNotification.php    # NEW — in-app + email when hold triggered
└── Services/
    └── PriceCapValidationService.php         # NEW — encapsulates cap + tolerance validation logic

app-modules/api/src/V2/
├── routes/
│   └── pricing.php                         # NEW — all pricing API routes
└── Http/Controllers/
    ├── Supplier/
    │   ├── PricingOverviewController.php    # NEW
    │   ├── PricingGridController.php        # NEW
    │   ├── PriceRequestController.php       # NEW
    │   └── PricingPdfController.php         # NEW
    └── Staff/
        ├── PricingSubmissionController.php  # NEW
        ├── PriceCapController.php           # NEW
        └── PriceAuditLogController.php      # NEW

database/migrations/
├── xxxx_xx_xx_add_approval_columns_to_organisation_prices.php  # NEW
├── xxxx_xx_xx_create_price_caps_table.php                      # NEW
├── xxxx_xx_xx_create_price_requests_table.php                  # NEW
├── xxxx_xx_xx_create_price_audit_logs_table.php                # NEW
└── xxxx_xx_xx_create_supplier_entity_flags_table.php           # NEW

tests/Feature/
├── Pricing/
│   ├── SubmitSupplierRatesTest.php         # NEW
│   ├── PriceRequestWorkflowTest.php        # NEW
│   ├── PriceCapValidationTest.php          # NEW
│   ├── BatchApproveTest.php                # NEW
│   ├── ServiceTypeLevelApprovalTest.php    # NEW
│   ├── SupplierFlagAndBillingHoldTest.php  # NEW
│   ├── CapRevalidationJobTest.php          # NEW
│   ├── PricingPdfTest.php                  # NEW
│   ├── PriceAuditLogTest.php              # NEW
│   └── PricingApiTest.php                  # NEW — API endpoint integration tests
```

### Frontend (React Next.js — `supplier-portal`)

```text
src/
├── types/
│   └── pricing.ts                          # NEW — shared types for pricing domain
├── lib/
│   └── api/
│       └── pricing.ts                      # NEW — API client functions for pricing endpoints
├── hooks/
│   ├── use-pricing-grid.ts                 # NEW — grid state, save logic, unsaved changes
│   ├── use-price-validation.ts             # NEW — client-side format validation (not cap validation)
│   └── use-compliance-status.ts            # NEW — compliance summary data fetching
├── components/
│   ├── ui/                                 # Existing shadcn/ui components
│   ├── common/
│   │   ├── CurrencyInput.tsx               # NEW — $ prefix, numeric, 2dp, right-aligned
│   │   └── RateStatusBadge.tsx             # NEW — icon + label for Approved/Pending/Flagged/N/A
│   └── pricing/
│       ├── Overview/
│       │   ├── PricingOverview.tsx          # NEW — parent: compliance summary + location list
│       │   ├── ComplianceSummary.tsx        # NEW — approved/pending/flagged counts with colour segments
│       │   ├── FlagWarningBanner.tsx        # NEW — amber (1 flag) or red (billing hold) banner
│       │   └── LocationCard.tsx            # NEW — location name, service count, completion %, arrow
│       ├── Grid/
│       │   ├── PricingGrid.tsx             # NEW — parent: service type tabs + rate table
│       │   ├── ServiceTypeTabs.tsx          # NEW — horizontal tabs (desktop) / dropdown (mobile)
│       │   ├── RateTable.tsx               # NEW — desktop table layout for rate entry
│       │   ├── RateRow.tsx                 # NEW — single rate category row in table
│       │   ├── RateCard.tsx                # NEW — mobile/tablet card layout per rate category
│       │   ├── NaToggle.tsx                # NEW — checkbox for N/A toggle with disabled state
│       │   └── OverCapWarning.tsx          # NEW — non-specific warning + submit request CTA
│       ├── PriceRequest/
│       │   ├── PriceRequestDialog.tsx      # NEW — parent: dialog for submitting price request
│       │   ├── RequestSummary.tsx          # NEW — location, service, category, rate display
│       │   └── JustificationForm.tsx       # NEW — textarea for reason
│       ├── Staff/
│       │   ├── ApprovalDashboard/
│       │   │   ├── ApprovalDashboard.tsx   # NEW — parent: filters + table + batch actions
│       │   │   ├── SubmissionFilters.tsx   # NEW — service type, location, status, supplier search
│       │   │   ├── SubmissionTable.tsx     # NEW — sortable table with checkbox selection
│       │   │   ├── SubmissionRow.tsx       # NEW — expandable row with justification, flag count
│       │   │   └── BatchActions.tsx        # NEW — batch approve/reject toolbar
│       │   ├── RejectionDialog.tsx         # NEW — rejection reason + flag checkbox
│       │   ├── CapConfiguration/
│       │   │   ├── CapConfiguration.tsx    # NEW — parent: service type dropdown + cap table
│       │   │   ├── CapTable.tsx            # NEW — current vs new cap values
│       │   │   └── RevalidationBanner.tsx  # NEW — progress indicator during re-validation
│       │   └── AuditLog/
│       │       ├── AuditLog.tsx            # NEW — parent: filters + audit entry list
│       │       └── AuditEntry.tsx          # NEW — single audit record display
│       └── Pdf/
│           └── DownloadButton.tsx          # NEW — download trigger with loading state
└── app/
    ├── (supplier)/
    │   └── pricing/
    │       ├── page.tsx                    # NEW — pricing overview page
    │       └── [locationId]/
    │           └── page.tsx                # NEW — pricing grid page for a location
    └── (staff)/
        └── pricing/
            ├── approvals/
            │   └── page.tsx                # NEW — approval dashboard page
            ├── caps/
            │   └── page.tsx                # NEW — cap configuration page
            └── audit/
                └── page.tsx                # NEW — audit log page
```

---

## Component Architecture

### Shared Types (`src/types/pricing.ts`)

```typescript
type RateCategory = 'weekday' | 'non_standard_weekday' | 'saturday' | 'sunday' | 'public_holiday' | 'travel'

type ApprovalStatus = 'pending' | 'approved' | 'flagged' | 'na'

type PriceRequestStatus = 'pending' | 'approved' | 'rejected'

type RateEntry = {
  id: number
  rateCategory: RateCategory
  value: number | null
  isNa: boolean
  approvalStatus: ApprovalStatus
}

type ServiceTypeRates = {
  id: number
  name: string
  rates: {
    direct: RateEntry[]
    indirect: RateEntry[]
  }
  pendingRequests: PriceRequestSummary[]
}

type PriceRequestSummary = {
  id: number
  rateCategory: RateCategory
  submittedRate: number
  status: PriceRequestStatus
  createdAt: string
}

type ComplianceStatus = {
  approvedCount: number
  pendingCount: number
  flaggedCount: number
  incompleteCount: number
  flagCount: number
  isBillingOnHold: boolean
}

type LocationSummary = {
  id: number
  name: string
  serviceTypeCount: number
  completionPercentage: number
  hasFlaggedRates: boolean
}

type PricingOverviewData = {
  compliance: ComplianceStatus
  locations: LocationSummary[]
}

// Staff-only types
type PriceSubmission = {
  id: number
  supplier: { id: number; name: string }
  location: { id: number; name: string }
  serviceType: { id: number; name: string }
  rateCategory: RateCategory
  submittedRate: number
  capAmount: number
  justification: string
  flagCount: number
  isBillingOnHold: boolean
  createdAt: string
}

type PriceCapEntry = {
  rateCategory: RateCategory
  capAmount: number
}

type AuditLogEntry = {
  id: number
  action: string
  actorName: string | null
  actorType: 'supplier' | 'staff' | null
  oldValue: Record<string, unknown> | null
  newValue: Record<string, unknown> | null
  metadata: Record<string, unknown> | null
  createdAt: string
}
```

### PricingOverview Component Decomposition

- **Parent**: `PricingOverview.tsx` — owns data fetching via `useComplianceStatus` hook, renders sub-components
- **Directory**: `src/components/pricing/Overview/`
- **Sub-components**:
  - `ComplianceSummary.tsx` — renders approved/pending/flagged counts with colour segments
  - `FlagWarningBanner.tsx` — renders amber warning (1 flag) or red billing hold banner (2+ flags)
  - `LocationCard.tsx` — renders location name, service count, completion %, link to grid

### PricingGrid Component Decomposition

- **Parent**: `PricingGrid.tsx` — owns grid state via `usePricingGrid` hook, save action, unsaved changes tracking
- **Directory**: `src/components/pricing/Grid/`
- **Sub-components**:
  - `ServiceTypeTabs.tsx` — renders horizontal tabs (desktop) or dropdown (tablet/mobile)
  - `RateTable.tsx` — renders desktop table layout with header row
  - `RateRow.tsx` — renders single rate category: label, `CurrencyInput`, `NaToggle`, `RateStatusBadge`
  - `RateCard.tsx` — renders mobile/tablet card layout for a single rate category
  - `NaToggle.tsx` — checkbox that disables the input and sets value to null
  - `OverCapWarning.tsx` — non-specific warning text + "Submit Price Request" button
- **Hooks used**: `usePricingGrid` (grid state, dirty tracking, save), `usePriceValidation` (format checks)
- **Common components reused**: `CurrencyInput`, `RateStatusBadge`, shadcn `Table`, `Tabs`, `Select`, `Button`, `Checkbox`

### PriceRequestDialog Component Decomposition

- **Parent**: `PriceRequestDialog.tsx` — owns form state and submit action
- **Directory**: `src/components/pricing/PriceRequest/`
- **Sub-components**:
  - `RequestSummary.tsx` — renders read-only context (location, service, category, rate)
  - `JustificationForm.tsx` — renders textarea for reason with character count
- **Common components reused**: shadcn `Dialog`, `Button`, `Textarea`

### ApprovalDashboard Component Decomposition

- **Parent**: `ApprovalDashboard.tsx` — owns data fetching, filter state, batch selection state
- **Directory**: `src/components/pricing/Staff/ApprovalDashboard/`
- **Sub-components**:
  - `SubmissionFilters.tsx` — renders filter bar (service type, location, status, supplier search)
  - `SubmissionTable.tsx` — renders sortable table with checkbox column for batch selection
  - `SubmissionRow.tsx` — renders expandable row: supplier, location, service, category, rate, cap, flag warnings, approve/reject buttons
  - `BatchActions.tsx` — renders toolbar with "Batch Approve" button when items selected
- **Common components reused**: shadcn `Table`, `Select`, `Input`, `Button`, `Badge`, `Checkbox`

### CapConfiguration Component Decomposition

- **Parent**: `CapConfiguration.tsx` — owns form state and save action
- **Directory**: `src/components/pricing/Staff/CapConfiguration/`
- **Sub-components**:
  - `CapTable.tsx` — renders current cap vs new cap columns with `CurrencyInput` for editing
  - `RevalidationBanner.tsx` — renders progress indicator during async re-validation
- **Common components reused**: `CurrencyInput`, shadcn `Table`, `Select`, `Button`, `Alert`

### Common Components

#### CurrencyInput.tsx (Common)
- **Props**: `defineProps<Props>()` equivalent:
  - `value: number | null`
  - `onChange: (value: number | null) => void`
  - `disabled?: boolean`
  - `placeholder?: string`
  - `id?: string`
- **Rationale for common**: Currency input is a general-purpose pattern reusable across pricing, billing (SR4), and other financial screens.
- **Behaviour**: `$` prefix, numeric-only keyboard input, 2 decimal places, right-aligned, formats on blur.

#### RateStatusBadge.tsx (Common)
- **Props**:
  - `status: ApprovalStatus`
  - `size?: 'sm' | 'default'`
- **Rationale for common**: Status badges are used in the pricing grid, approval dashboard, audit log, and PDF preview. General-purpose status indicator pattern.
- **Renders**: Icon + label per status. Green check = Approved, Amber clock = Pending, Red triangle = Flagged, Grey dash = N/A.

---

## Key Implementation Details

### Price Cap Validation Logic (FR-003)

The `ValidateRateAgainstCapAction` implements the core validation:

```
1. Look up PriceCap for (service_type_id, rate_category)
2. If no cap exists → auto-approve (no cap defined)
3. If rate is null (N/A) → set status to 'na'
4. If rate <= cap_amount → auto-approve
5. If rate <= cap_amount * (1 + tolerance_percentage / 100) → auto-approve (within tolerance)
6. If rate > cap_amount * (1 + tolerance_percentage / 100) → set status to 'flagged'
```

This runs server-side only. The frontend never receives cap values.

### Cap Value Leakage Prevention (FR-004, FR-020)

- Supplier-facing API responses never include `cap_amount` or `tolerance_percentage`
- Error messages use non-specific language: "exceeds the acceptable range"
- The flagged/approved boundary is not exposed — a supplier cannot determine the exact cap through trial-and-error because the response only says "approved" or "flagged" without revealing the threshold
- API resource classes explicitly exclude cap fields via `$hidden` / `except()` on supplier-scoped responses
- Staff API resources include cap values via a **separate API Resource class**:
  - `App\Http\Resources\Api\V2\Pricing\SupplierPriceResource` — used for all `/api/v2/suppliers/{supplier}/pricing/*` routes. Explicitly excludes `cap_amount` and `tolerance_percentage` fields.
  - `App\Http\Resources\Api\V2\Pricing\StaffPriceResource` — used for all `/api/v2/staff/pricing/*` routes. Includes cap values for review context.
  - Route separation enforced by middleware: supplier routes use `auth:sanctum` + `role:supplier_admin,supplier,team_member`; staff routes use `auth:sanctum` + `role:staff`.
  - `PriceCapPolicy::view()` returns `Response::deny('Price caps are not accessible to suppliers')` for any supplier-role user.

### Billing Hold Logic (FR-009)

```
1. When staff applies a flag via RejectPriceRequestAction (apply_flag: true):
   a. Create SupplierEntityFlag record
   b. Count unresolved flags for supplier entity
   c. If count >= BILLING_HOLD_FLAG_THRESHOLD (2):
      - Record billing_hold_applied audit entry
      - Send BillingHoldAppliedNotification

2. When a flagged rate is corrected and re-approved:
   a. Resolve the associated SupplierEntityFlag (set resolved_at)
   b. Recount unresolved flags
   c. If count < BILLING_HOLD_FLAG_THRESHOLD and was previously on hold:
      - Record billing_hold_lifted audit entry
      - Notify supplier
```

### Cap Re-validation Job (FR-012)

When caps are updated via `UpdatePriceCapsAction`:

1. Save new cap values immediately
2. Record audit entry for cap change
3. Dispatch `RevalidateRatesAfterCapChangeJob` to queue
4. Job queries all `organisation_prices` for the affected service_type_id + rate_category where `approval_status = 'approved'`
5. For each rate that now exceeds the new cap + tolerance: set `approval_status = 'flagged'`
6. Batch notify affected suppliers (one notification per supplier, not per rate)
7. Job reports progress for the staff UI to poll

### PDF Generation (FR-011)

- Server-side using `barryvdh/laravel-dompdf` (check if already installed) or `spatie/laravel-pdf`
- Scoped to single location + single service type per FR and design CL-004
- Includes: supplier name, location, service type, rate categories with values and approval status
- Excludes: cap values (FR-004)
- N/A entries shown as "Not Applicable" (not blank, not $0)
- Response: streaming PDF download with `Content-Disposition: attachment`

### Feature Flag

```php
// Pennant feature flag
class SupplierPricing
{
    public function resolve(mixed $scope): bool
    {
        return false; // Off by default, enabled per-org or globally
    }
}
```

Backend: `check.feature.flag:SupplierPricing` middleware on pricing routes.
Frontend: Check feature flag via SR0 auth response payload.

### N/A vs $0 Distinction (FR-002, FR-017)

- `is_na = true` + `value = null` → "Not Applicable" (supplier does not offer this)
- `is_na = false` + `value = 0.00` → "$0.00" (supplier offers this at no charge)
- `is_na = false` + `value = null` → Incomplete (not yet filled in)
- The `approval_status` for N/A entries is `'na'` — they skip cap validation entirely

---

## Risk Areas

| Risk | Mitigation |
|------|------------|
| Cap value leakage through error messages or timing attacks | Non-specific response language; no timing difference between within-cap and over-cap validation; explicit API resource field exclusion |
| Cap re-validation overwhelming the queue with 13,000 suppliers | Queued job processes in chunks of 500; rate-limited notifications; staff sees progress indicator |
| Existing `organisation_prices` data has null values that could conflict with new approval_status | Migration sets `approval_status = 'pending'` for all existing records; a follow-up Laravel Operation can back-fill approved status for rates within caps |
| N/A toggle confusion with blank fields | Three distinct visual states in UI: green filled, grey N/A, yellow incomplete |
| Concurrent rate edits from multiple users for same supplier | Optimistic locking via `updated_at` check on save; last-write-wins with conflict toast |

---

## Testing Approach

### Backend (Pest)

| Test File | Coverage |
|-----------|----------|
| `SubmitSupplierRatesTest` | Rate submission, auto-approval within cap, flagging over-cap, N/A handling, $0 handling, partial save, same-rate-no-change detection |
| `PriceRequestWorkflowTest` | Submit request, approve, reject with reason, re-submit after rejection |
| `PriceCapValidationTest` | Cap lookup, tolerance calculation, no-cap-defined auto-approve, platform-sourced exclusion |
| `BatchApproveTest` | Batch approve, mixed statuses, empty batch |
| `ServiceTypeLevelApprovalTest` | All-within-cap approve, mixed (some over-cap) warning, flag count display |
| `SupplierFlagAndBillingHoldTest` | Flag application, flag count, billing hold threshold, flag resolution, hold lift |
| `CapRevalidationJobTest` | Job processes rates, flags over-cap, batch notifications, progress tracking |
| `PricingPdfTest` | PDF generation, correct scoping, N/A display, cap exclusion |
| `PriceAuditLogTest` | All audit actions recorded with correct actor, old/new values |
| `PricingApiTest` | API endpoint auth, supplier cannot see caps, staff can see caps, pagination, filtering |

### Frontend (Vitest + React Testing Library)

| Area | Coverage |
|------|----------|
| `CurrencyInput` | Numeric input, formatting, $ prefix, disabled state |
| `PricingGrid` | Rate entry, N/A toggle, save, unsaved changes warning |
| `PriceRequestDialog` | Form validation, submit, success/error states |
| `ApprovalDashboard` | Filtering, batch selection, approve/reject actions |
| `CapConfiguration` | Cap editing, re-validation warning, save |

---

## Rollback Strategy

1. **Feature flag**: `SupplierPricing` Pennant flag can be disabled to hide all pricing features without deployment
2. **Database migrations are additive**: New tables and new columns can be dropped without affecting existing functionality
3. **Existing pricing flow preserved**: The current `UpdateSupplierServicePricesForLocation` action and Vue UI remain functional — the new React UI is a separate path
4. **No breaking changes to v1 API**: All new endpoints are on v2 only
