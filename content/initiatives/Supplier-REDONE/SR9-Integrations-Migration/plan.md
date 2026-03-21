---
title: "Implementation Plan: Integrations & Migration"
---

# Implementation Plan: Integrations & Migration

**Branch**: `sr9-integrations-migration` | **Date**: 2026-03-19 | **Spec**: [spec.md](/initiatives/supplier-redone/sr9-integrations-migration/spec)
**Input**: Feature specification from `.tc-docs/content/initiatives/Supplier-REDONE/SR9-Integrations-Migration/spec.md`

## Summary

Cross-cutting workstream that ensures all existing integrations (Zoho CRM, MYOB, EFTSure) continue functioning through the new API layer, migrates ~13,000 supplier profiles to the two-tier role model via a resumable Artisan command, implements parallel frontend routing via Laravel middleware + Pennant feature flags with a kill switch, provisions API tokens transparently on first login, stubs the compliance register automation framework, and keeps Laravel Scout + Elasticsearch in sync across both portals. This epic spans both tc-portal (Laravel 12) and the new React frontend (Next.js), with the majority of work being backend/migration.

## Technical Context

**Language/Version**: PHP 8.4 (Laravel 12), TypeScript (Vue 3 for legacy portal, React/Next.js for new portal)
**Primary Dependencies**: Inertia.js v2 (legacy portal), Laravel Pennant (feature flags), Lorisleiva Actions, Laravel Data, Laravel Sanctum v4 (API tokens), Laravel Scout v10 + Elasticsearch, Zoho CRM API, MYOB AccountRight API, EFTSure API, WorkOS (SSO)
**Storage**: MySQL
**Testing**: Pest v3 (unit + feature)
**Target Platform**: Web (both legacy Inertia portal and new React standalone portal)
**Performance Goals**: Migration command processes 13,000 profiles in <5 minutes with --batch-size=500, portal routing middleware adds <5ms latency per request, token provisioning completes within the login response cycle
**Constraints**: Zero downtime for existing integrations during migration. Legacy portal must remain fully functional. No refactoring of existing action classes (SyncSupplierToZohoJob, MyobCreateOrUpdateVendorAction).
**Scale/Scope**: ~13,000 supplier profiles, 4 external integrations, 2 parallel frontends, 4 compliance register stubs

## Project Structure

### Documentation (this feature)

```text
.tc-docs/content/initiatives/Supplier-REDONE/SR9-Integrations-Migration/
├── idea-brief.md        # Initial idea
├── business.md          # Business context (Gate 1 passed)
├── design.md            # Design brief (Gate 2 passed)
├── spec.md              # Feature specification
└── plan.md              # This file (Gate 3)
```

### Source Code (repository root)

```text
# Backend — Integration Continuity (existing files, minimal changes)
domain/Supplier/Jobs/SyncSupplierToZohoJob.php          # NO CHANGES — ShouldBeUnique by supplier ID
domain/Supplier/Actions/UpdateSupplierContactInfoAction.php   # NO CHANGES
domain/Supplier/Actions/UpdateSupplierPaymentInfoAction.php   # NO CHANGES
domain/Supplier/Actions/UpdateSupplierOrgStructureAction.php  # NO CHANGES
domain/Supplier/Actions/RegisterSupplierWithPaymentDetails.php # NO CHANGES
domain/Myob/Actions/MyobCreateOrUpdateVendorAction.php   # NO CHANGES
domain/Supplier/Http/Controllers/SupplierCompanyDetailsController.php # NO CHANGES

# Backend — New v2 API Actions (dispatch same jobs as legacy)
app-modules/api/src/V2/Actions/Supplier/UpdateSupplierProfileAction.php    # Dispatches SyncSupplierToZohoJob
app-modules/api/src/V2/Actions/Supplier/UpdateSupplierBankDetailsAction.php # Triggers EFTSure + MYOB flow

# Backend — Data Migration
domain/Supplier/Console/Commands/MigrateSupplierRolesCommand.php  # Artisan command with --batch-size/--offset
domain/Supplier/Actions/AssignOrganisationAdminRoleAction.php     # Single-supplier role assignment
domain/Supplier/Actions/ReconcileMultiSupplierOrgAction.php       # Multi-supplier hierarchy reconciliation
domain/Supplier/Actions/GenerateMigrationReportAction.php         # Report generation
domain/Supplier/Data/MigrationReportData.php                      # Report data structure

# Backend — Portal Routing (Feature Flag)
domain/Supplier/Feature/SupplierNewPortal.php             # Pennant feature class
app/Http/Middleware/RouteToSupplierPortal.php              # Middleware checking Pennant flag
app/Http/Middleware/ProvisionApiTokens.php                 # Transparent token provisioning on login

# Backend — Compliance Register Framework (stubs)
domain/Compliance/Models/ComplianceRegisterCheck.php       # Model for check results
domain/Compliance/Enums/ComplianceRegisterEnum.php         # AHPRA, NDIS, AGED_CARE, AFRA
domain/Compliance/Enums/ComplianceCheckStatusEnum.php      # PASSED, FAILED, PENDING, ERROR
domain/Compliance/Jobs/CheckComplianceRegistersJob.php     # Scheduled job skeleton
domain/Compliance/Actions/RunComplianceCheckAction.php     # Action with connector interface
domain/Compliance/Contracts/ComplianceRegisterConnector.php # Interface for register connectors
domain/Compliance/Data/ComplianceCheckData.php             # Data class for check results
domain/Compliance/Data/ComplianceAlertData.php             # Data class for staff alerts
domain/Compliance/Policies/ComplianceRegisterCheckPolicy.php
domain/Compliance/Notifications/ComplianceAlertNotification.php # Staff alert notification

# Backend — Search Index
domain/Supplier/Models/Supplier.php                        # Update toSearchableArray() with org metadata

# Database
database/migrations/xxxx_add_role_migrated_at_to_suppliers_table.php
database/migrations/xxxx_create_compliance_register_checks_table.php

# Tests
tests/Feature/Supplier/Console/MigrateSupplierRolesCommandTest.php
tests/Feature/Supplier/Actions/AssignOrganisationAdminRoleActionTest.php
tests/Feature/Supplier/Actions/ReconcileMultiSupplierOrgActionTest.php
tests/Feature/Supplier/Http/Middleware/RouteToSupplierPortalTest.php
tests/Feature/Supplier/Http/Middleware/ProvisionApiTokensTest.php
tests/Feature/Compliance/Jobs/CheckComplianceRegistersJobTest.php
tests/Feature/Compliance/Actions/RunComplianceCheckActionTest.php
tests/Unit/Supplier/Feature/SupplierNewPortalTest.php
```

---

## Data Model

### Migration: `role_migrated_at` on Suppliers

A nullable timestamp added to the existing `suppliers` table to track migration progress.

| Column | Type | Notes |
|--------|------|-------|
| `role_migrated_at` | `timestamp->nullable()` | Set when the migration command processes this supplier. NULL = not yet migrated. Enables idempotent re-runs. |

**No other schema changes to suppliers** — the two-tier role model (Organisation → Supplier Entity) is established by prior epics (SR0/SR1). This migration assigns roles within the existing schema.

### ComplianceRegisterCheck

Stores results of automated compliance register checks against supplier profiles.

| Column | Type | Notes |
|--------|------|-------|
| `id` | `bigIncrements` | Primary key |
| `supplier_id` | `foreignId` | `->constrained()->cascadeOnDelete()` |
| `register` | `string(30)` | `ahpra`, `ndis_banning`, `aged_care_banning`, `afra` — comment documents valid values |
| `status` | `string(20)` | `passed`, `failed`, `pending`, `error` — comment documents valid values |
| `checked_at` | `datetime` | When the check was executed |
| `result_payload` | `json->nullable()` | Raw response from the register API (for audit) |
| `alert_sent_at` | `datetime->nullable()` | When the staff alert was dispatched (NULL = no alert needed) |
| `error_message` | `text->nullable()` | Error details when status = `error` |
| `next_check_at` | `datetime->nullable()` | Scheduled next check (for retry or regular cadence) |
| `created_at` / `updated_at` | `timestamps` | Standard timestamps |

**Relationships:**
- `supplier()` → BelongsTo Supplier

**Scopes:**
- `scopeFailed($query)` — where status = 'failed'
- `scopePending($query)` — where status = 'pending'
- `scopeForRegister($query, ComplianceRegisterEnum $register)` — filter by register type
- `scopeNeedsRecheck($query)` — where next_check_at <= now

**Enums** (cast via `casts()` method on model):

```php
// ComplianceRegisterEnum
case AHPRA = 'ahpra';                      // Australian Health Practitioner Regulation Agency
case NDIS_BANNING = 'ndis_banning';         // NDIS Provider Banning Register
case AGED_CARE_BANNING = 'aged_care_banning'; // Aged Care Banning Register
case AFRA = 'afra';                         // Australian Financial Review Authority

// ComplianceCheckStatusEnum
case PASSED = 'passed';     // No issues found
case FAILED = 'failed';     // Issue detected — alert raised
case PENDING = 'pending';   // Check queued or awaiting retry
case ERROR = 'error';       // External service error — retry scheduled
```

**Constants** on ComplianceRegisterCheck model:
```php
/** Default interval in days between scheduled compliance checks */
public const DEFAULT_CHECK_INTERVAL_DAYS = 30;

/** Maximum retry attempts before marking check as permanently errored */
public const MAX_RETRY_ATTEMPTS = 3;

/** Retry delay in minutes between failed check attempts */
public const RETRY_DELAY_MINUTES = 60;
```

---

## API Contracts

### v2 API Actions (Integration Continuity)

The new v2 API actions dispatch the same jobs as the legacy Inertia action classes. No new API endpoints are created for integration continuity — the existing jobs are reused.

**Zoho CRM sync in v2 API actions:**
```php
// In UpdateSupplierProfileAction (v2 API)
// Same dispatch pattern as legacy UpdateSupplierContactInfoAction
SyncSupplierToZohoJob::dispatch($supplier);
```

The `ShouldBeUnique` constraint on `SyncSupplierToZohoJob` (keyed by `$this->supplier->id`) deduplicates across legacy and API paths. No additional coordination needed.

**EFTSure verification in v2 API actions:**
```php
// In UpdateSupplierBankDetailsAction (v2 API)
// Same flow as legacy UpdateSupplierPaymentInfoAction
// EFTSure check triggered via existing bank detail observer/action chain
```

**MYOB vendor mapping:**
No changes. `MyobCreateOrUpdateVendorAction` is triggered by the existing bank detail submission flow. New supplier entities under an organisation follow the same path.

### Portal Routing Middleware

```
Middleware: RouteToSupplierPortal
Applies to: All authenticated supplier Inertia page requests
Logic:
  1. Check if request is an Inertia page visit (not API, not asset)
  2. Resolve authenticated user's supplier
  3. Check Feature::for($supplier)->active(SupplierNewPortal::class)
  4. If active → redirect to new portal URL with session context
  5. If inactive → pass through to legacy Inertia controller
```

### Token Provisioning Middleware

```
Middleware: ProvisionApiTokens
Applies to: Post-authentication (login success callback)
Logic:
  1. Check if user has any valid Sanctum tokens
  2. If no tokens → create access + refresh token pair
  3. If tokens exist but expired → revoke and create new pair
  4. If tokens exist and valid → no-op
  5. Store token reference in session for the new portal to retrieve
  6. Works identically for password auth and WorkOS SSO
```

### Migration Command

```
Command: php artisan suppliers:migrate-roles
Options:
  --batch-size=500     # Records per batch (default 500)
  --offset=0           # Starting offset for manual resumption
  --dry-run            # Show what would happen without changes
  --report-only        # Generate report from existing migration data
```

### Data Classes

**MigrationReportData** — Output from the migration report generator:
```php
#[MapName(SnakeCaseMapper::class)]
class MigrationReportData extends Data
{
    public function __construct(
        public int $totalProcessed,
        public int $orgAdminAssigned,
        public int $multiSupplierReconciled,
        public int $flaggedForReview,
        public int $skippedAlreadyMigrated,
        /** @var array<int, MigrationFlaggedCaseData> */
        #[DataCollectionOf(MigrationFlaggedCaseData::class)]
        public array $flaggedCases,
    ) {}
}
```

**ComplianceCheckData** — Validates compliance check results:
```php
#[MapName(SnakeCaseMapper::class)]
class ComplianceCheckData extends Data
{
    public function __construct(
        #[Rule('required', 'integer', 'exists:suppliers,id')]
        public int $supplierId,

        #[Rule('required', 'string')]
        public string $register,

        #[Rule('required', 'string')]
        public string $status,

        #[Rule('nullable', 'array')]
        public ?array $resultPayload,

        #[Rule('nullable', 'string', 'max:5000')]
        public ?string $errorMessage,
    ) {}
}
```

**ComplianceAlertData** — Data for staff alert notifications:
```php
#[MapName(SnakeCaseMapper::class)]
class ComplianceAlertData extends Data
{
    public function __construct(
        public int $supplierId,
        public string $supplierName,
        public string $register,
        public string $status,
        public string $details,
    ) {}
}
```

---

## Integration Details

### Zoho CRM (FR-001, FR-004, FR-005)

**Current state**: `SyncSupplierToZohoJob` dispatched imperatively from 4 domain actions + 1 controller. Uses `ShouldBeUnique` keyed by `supplier->id`.

**Plan**: Zero refactoring. New v2 API actions dispatch the same job. The `ShouldBeUnique` constraint prevents duplicate runs when both legacy and API paths update the same supplier within the uniqueness window. Webhooks from Zoho are processed by the existing webhook controller — no changes needed since webhooks update the Eloquent model directly, which works regardless of which frontend the supplier uses.

**Queue retry**: Existing retry configuration on the job applies. No changes.

### MYOB (FR-002)

**Current state**: `myob_vendor_id` stored on both `Supplier` and `BankDetail` models. `MyobCreateOrUpdateVendorAction` triggered by bank detail submission flow.

**Plan**: Zero refactoring. The `myob_vendor_id` column is preserved through migration (migration command does not touch bank details or MYOB fields). New supplier entities get vendor IDs through the existing bank detail submission flow — same path for legacy and new portal.

**Migration safety**: The `MigrateSupplierRolesCommand` must NOT modify any fields in `$fillable` except `role_migrated_at`. This is enforced by the action class only updating the role assignment + timestamp.

### EFTSure (FR-003, FR-004)

**Current state**: EFTSure verification triggered via the bank detail submission flow. Status stored as `BankDetailStatusEnum` on `BankDetail.status`.

**Plan**: Zero refactoring of EFTSure integration. The v2 API bank detail action triggers the same verification chain. When EFTSure is unavailable, the existing queue retry behaviour applies. The `pending` status is preserved until verification completes.

**Edge case**: If EFTSure returns ambiguous status for a previously green bank detail, the existing status is preserved and a re-check is scheduled (per spec edge case).

### Search — Scout + Elasticsearch (FR-024, FR-025)

**Current state**: `Supplier` model uses `Searchable` trait. `toSearchableArray()` returns `id`, `legal_trading_name`, `email`, `abn`, `myob_vendor_id`, `bank_account_title`, `bsb`, `account_number`, `phone_*`, `addresses`.

**Plan**: Add organisation-level metadata to `toSearchableArray()`:
```php
public function toSearchableArray(): array
{
    return [
        // ... existing fields ...
        'organisation_name' => (string) $this->organisation?->name,
        'organisation_id' => $this->organisation?->id,
    ];
}
```

Both portals query the same Elasticsearch index via Scout. The search API endpoint is shared. Index sync happens automatically via Scout's model observer — no manual reindex needed during normal operation. A one-time `php artisan scout:import` may be needed after adding the new fields.

---

## Feature Flag Architecture (FR-011 through FR-015)

### Pennant Feature Class

```php
// domain/Supplier/Feature/SupplierNewPortal.php
namespace Domain\Supplier\Feature;

use Domain\Supplier\Models\Supplier;

class SupplierNewPortal
{
    /**
     * Determines if the supplier should use the new standalone portal.
     * Default: false (all existing suppliers stay on legacy).
     * Activated per-supplier during wave migration or globally for new registrations.
     */
    public function resolve(Supplier $supplier): bool
    {
        return false; // Default off — activated per-supplier or globally
    }
}
```

### Routing Middleware

```php
// app/Http/Middleware/RouteToSupplierPortal.php
// Registered in app/Http/Kernel.php route middleware group

// Logic:
// 1. Only applies to Inertia page visits (not API calls)
// 2. Resolves supplier from authenticated user
// 3. Checks Feature::for($supplier)->active(SupplierNewPortal::class)
// 4. If active: redirect to new portal URL (configured in config/supplier-portal.php)
// 5. If inactive: $next($request) — normal legacy flow
```

### Kill Switch Implementation

- **Per-supplier**: `Feature::for($supplier)->deactivate(SupplierNewPortal::class)` — immediate effect on next request
- **Global**: `Feature::deactivateForEveryone(SupplierNewPortal::class)` — all suppliers revert to legacy within 30 seconds (Pennant cache TTL)
- **In-flight safety**: Kill switch only affects routing on the next request. Transactions in progress on the new portal's API complete normally.

### New Registration Routing

New supplier registrations are routed to the new portal when a separate `SupplierNewRegistrationPortal` flag is active. This is decoupled from the per-supplier migration flag so new registrations can be toggled independently.

```php
// In registration controller:
// After successful registration, check SupplierNewRegistrationPortal flag
// If active → redirect to new portal onboarding
// If inactive → redirect to legacy portal onboarding
```

---

## Data Migration (FR-006 through FR-010)

### Migration Command: `suppliers:migrate-roles`

**Artisan command** with `AsAction` trait on the underlying actions.

```
Processing flow:
1. Query suppliers WHERE role_migrated_at IS NULL
2. Apply --offset and --batch-size for chunking
3. For each supplier:
   a. Determine if single-supplier or multi-supplier org
   b. Single-supplier: call AssignOrganisationAdminRoleAction
   c. Multi-supplier: call ReconcileMultiSupplierOrgAction
   d. Set role_migrated_at = now() on success
   e. Log result to migration report accumulator
4. After batch completes: call GenerateMigrationReportAction
5. Output report to console + store as JSON in storage/app/migration-reports/
```

### AssignOrganisationAdminRoleAction

```php
// Single-supplier organisation:
// 1. Verify organisation has exactly one supplier entity
// 2. Get current owner_user_id from supplier
// 3. Assign Organisation Administrator role to that user
// 4. No other data changes
// Returns: success/failure + details for report
```

### ReconcileMultiSupplierOrgAction

```php
// Multi-supplier organisation:
// 1. Query all supplier entities sharing the same organisation_id
// 2. Check if all entities have the same owner_user_id
// 3. If same owner → assign Organisation Administrator role to that user
// 4. If different owners → attempt reconciliation by common ABN
// 5. If still ambiguous → flag for manual review (do NOT auto-assign)
// Returns: reconciled/flagged + details for report
```

### Ambiguity Detection

Ambiguous cases (flagged for manual review):
- Different `owner_user_id` across entities in the same organisation
- Circular ownership (user A owns Supplier 1, is team member of Supplier 2; user B owns Supplier 2, is team member of Supplier 1)
- No `owner_user_id` on any entity in the organisation

### Idempotent Re-runs

The `role_migrated_at` timestamp ensures:
- Already-processed suppliers are skipped on re-run
- Flagged suppliers can be re-processed after manual resolution by resetting their `role_migrated_at` to NULL
- The `--dry-run` flag shows what would happen without making changes
- The `--report-only` flag generates a report from existing migration data

---

## Token Provisioning (FR-016 through FR-018)

### Middleware: ProvisionApiTokens

Applied after successful authentication (both password and WorkOS SSO).

```php
// app/Http/Middleware/ProvisionApiTokens.php

// Logic:
// 1. After authentication succeeds:
// 2. $user = auth()->user()
// 3. Check $user->tokens()->where('name', 'supplier-portal')->count()
// 4. If no tokens: $user->createToken('supplier-portal', ['supplier:*'])
// 5. If tokens exist: check expiry. Revoke expired, create new if needed.
// 6. Store token in encrypted session cookie for the new portal to retrieve.
// 7. No duplicate tokens: unique constraint on name + tokenable_id.
```

**WorkOS SSO integration**: The token provisioning middleware runs after the WorkOS callback handler. By the time it executes, `auth()->user()` is already set regardless of auth method.

**Token lifecycle**:
- Access token: used for API authentication from the new portal
- Refresh token: used to obtain new access tokens without re-authentication
- Tokens are scoped to `supplier:*` abilities
- Old tokens pruned on login to prevent proliferation

---

## Compliance Register Framework (FR-019 through FR-023)

### Stub Architecture

SR9 delivers the framework; actual register connectors are deferred until API access is confirmed.

```php
// domain/Compliance/Contracts/ComplianceRegisterConnector.php
interface ComplianceRegisterConnector
{
    /**
     * Check a supplier against this compliance register.
     * Returns a ComplianceCheckData with the result.
     */
    public function check(Supplier $supplier): ComplianceCheckData;

    /**
     * The register this connector checks against.
     */
    public function register(): ComplianceRegisterEnum;
}
```

Each register gets a stub connector that returns `PENDING` status:

```text
domain/Compliance/Connectors/
├── AhpraConnector.php          # Stub — returns PENDING
├── NdisBanningConnector.php    # Stub — returns PENDING
├── AgedCareBanningConnector.php # Stub — returns PENDING
└── AfraConnector.php           # Stub — returns PENDING
```

### Scheduled Job

```php
// domain/Compliance/Jobs/CheckComplianceRegistersJob.php
// Scheduled daily via app/Console/Kernel.php
// For each active supplier with next_check_at <= now:
//   1. Resolve registered connectors from service container
//   2. Run each connector's check() method
//   3. Store result in compliance_register_checks table
//   4. If status = FAILED → dispatch ComplianceAlertNotification
//   5. If status = ERROR → schedule retry (up to MAX_RETRY_ATTEMPTS)
//   6. Log all results for audit (including PASSED)
```

### Alert Framework

`ComplianceAlertNotification` extends `Notification` and is sent to staff users with the appropriate permission. The notification includes the supplier name, register name, issue details, and a link to the supplier profile.

### Audit Logging

All compliance check results (including clean PASSED results) are persisted in the `compliance_register_checks` table with the full `result_payload` JSON. This satisfies the audit requirement without a separate audit log — the table IS the audit trail.

---

## Implementation Phases

### Phase 1: Foundation (Migration Infrastructure)

**Goal**: Database migration for `role_migrated_at`, migration command skeleton, and feature flag setup.

1. **Migration** — Add `role_migrated_at` nullable timestamp to `suppliers` table
2. **Feature flag** — Register `SupplierNewPortal` Pennant feature class in `domain/Supplier/Feature/`
3. **Routing middleware** — `RouteToSupplierPortal` middleware registered in Kernel, checking Pennant flag
4. **Config** — `config/supplier-portal.php` with new portal URL, Pennant cache TTL
5. **Tests** — Feature flag resolution, middleware routing logic, middleware pass-through when flag inactive

### Phase 2: Data Migration (Artisan Command)

**Goal**: Resumable migration command that processes all ~13,000 profiles.

1. **AssignOrganisationAdminRoleAction** — Single-supplier role assignment with `AsAction` trait
2. **ReconcileMultiSupplierOrgAction** — Multi-supplier hierarchy reconciliation with ambiguity detection
3. **GenerateMigrationReportAction** — Report generation (console output + JSON file)
4. **MigrateSupplierRolesCommand** — Artisan command orchestrating the above actions with `--batch-size`, `--offset`, `--dry-run`, `--report-only`
5. **MigrationReportData** + **MigrationFlaggedCaseData** — Data classes for report structure
6. **Tests** — Single-supplier assignment, multi-supplier reconciliation, ambiguous case flagging, idempotent re-run, dry run, batch processing

### Phase 3: Integration Continuity (v2 API Actions)

**Goal**: New API actions dispatch existing integration jobs.

1. **UpdateSupplierProfileAction (v2)** — Dispatches `SyncSupplierToZohoJob` after profile update
2. **UpdateSupplierBankDetailsAction (v2)** — Triggers existing EFTSure verification + MYOB vendor flow
3. **Search index update** — Add `organisation_name` and `organisation_id` to `toSearchableArray()`
4. **Scout reindex** — One-time `php artisan scout:import "Domain\\Supplier\\Models\\Supplier"` after deployment
5. **Tests** — Zoho job dispatched from v2 action, EFTSure triggered from v2 action, no duplicate job dispatch within uniqueness window, search index contains org metadata

### Phase 4: Token Provisioning

**Goal**: Transparent API token issuance on first login.

1. **ProvisionApiTokens middleware** — Token creation/reuse logic for both auth methods
2. **Session token storage** — Encrypted cookie for the new portal to retrieve the token
3. **Token pruning** — Remove expired tokens on login to prevent proliferation
4. **Tests** — First login creates token, subsequent login reuses token, expired token replaced, WorkOS SSO provisions token, no duplicate tokens

### Phase 5: Compliance Register Framework (Stubs)

**Goal**: Model, job skeleton, schedule, alerts, and audit logging.

1. **Migration** — Create `compliance_register_checks` table
2. **Model** — `ComplianceRegisterCheck` with relationships, scopes, enums, constants
3. **Contract** — `ComplianceRegisterConnector` interface
4. **Stub connectors** — AHPRA, NDIS, Aged Care, AFRA (all return PENDING)
5. **Job** — `CheckComplianceRegistersJob` skeleton with connector resolution and result storage
6. **Action** — `RunComplianceCheckAction` with retry logic
7. **Notification** — `ComplianceAlertNotification` for staff
8. **Schedule** — Register job in `app/Console/Kernel.php` (daily, configurable)
9. **Policy** — `ComplianceRegisterCheckPolicy` for viewing check results
10. **Tests** — Job dispatches connectors, results stored, alert sent on failure, retry on error, audit logging

### Phase 6: Kill Switch & Edge Cases

**Goal**: Production-grade safety mechanisms.

1. **Kill switch testing** — Per-supplier deactivation, global deactivation, in-flight transaction safety
2. **Concurrent update handling** — Log conflicting concurrent updates from legacy + new portal for staff review
3. **Mid-migration webhook handling** — Zoho webhooks queued during migration transaction, processed after commit
4. **EFTSure ambiguous status** — Preserve existing green status, schedule re-check rather than overwriting
5. **Token provisioning on flag toggle** — Ensure tokens are provisioned on-demand if a supplier is flagged for new portal but has no tokens yet

---

## Testing Strategy

### Phase 1: Foundation Tests

**Feature Tests:**
- `SupplierNewPortalTest` — Feature flag resolves to false by default, can be activated per-supplier
- `RouteToSupplierPortalTest` — Redirects to new portal when flag active, passes through when inactive, ignores API requests, handles unauthenticated gracefully

### Phase 2: Migration Tests

**Feature Tests:**
- `MigrateSupplierRolesCommandTest`:
  - Single-supplier org → owner gets Org Admin role
  - Multi-supplier org with same owner → owner gets Org Admin role, entities linked
  - Multi-supplier org with different owners → flagged for review
  - Already-migrated supplier skipped (`role_migrated_at` not null)
  - `--dry-run` makes no changes
  - `--batch-size` processes correct number of records
  - Migration report generated with accurate counts
  - Existing data (bank details, myob_vendor_id, locations, pricing) unchanged after migration
- `AssignOrganisationAdminRoleActionTest` — Role assignment, data preservation
- `ReconcileMultiSupplierOrgActionTest` — Reconciliation logic, circular ownership detection

### Phase 3: Integration Tests

**Feature Tests:**
- v2 API action dispatches `SyncSupplierToZohoJob` — verify job dispatched with correct supplier
- v2 API action triggers EFTSure verification — verify bank detail status set to pending
- `ShouldBeUnique` deduplication — dispatch from legacy + API path within window, only one runs
- Search index includes organisation metadata after reindex

### Phase 4: Token Tests

**Feature Tests:**
- First login provisions access + refresh tokens
- Second login reuses existing valid tokens (no duplicates)
- Login with expired tokens creates new pair
- WorkOS SSO login provisions tokens identically to password auth
- Token pruning removes only expired tokens

### Phase 5: Compliance Framework Tests

**Feature Tests:**
- `CheckComplianceRegistersJobTest` — Resolves connectors, stores results, schedules retry on error
- `RunComplianceCheckActionTest` — Calls connector, stores result, dispatches alert on failure
- Audit logging — PASSED results stored, not just failures
- Retry logic — MAX_RETRY_ATTEMPTS respected, RETRY_DELAY_MINUTES applied

### Phase 6: Edge Case Tests

**Feature Tests:**
- Kill switch reverts routing immediately (within cache TTL)
- In-flight transaction completes after kill switch
- Zoho webhook during migration queued and processed after transaction
- EFTSure ambiguous status preserved for previously green bank detail

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Migration command fails mid-batch for large dataset | Medium | Medium | `role_migrated_at` ensures idempotent re-run. `--batch-size` limits blast radius. `--dry-run` validates before execution. |
| Zoho sync race condition during parallel running | Low | High | `ShouldBeUnique` by supplier ID already handles this. No new deduplication needed. Verified in spec clarification Q1. |
| Feature flag cache causes delayed kill switch | Low | High | Pennant cache TTL configurable in `config/supplier-portal.php`. Set to 30 seconds max. `Feature::flushCache()` available for emergency. |
| Token proliferation from edge-case login patterns | Medium | Low | Unique constraint on token name + tokenable_id. Pruning on login. Monitoring for token count per user. |
| MYOB vendor ID lost during migration | Low | Critical | Migration command explicitly does not touch `myob_vendor_id` or bank detail fields. Verified by test asserting all existing data unchanged. |
| Compliance register API unavailable at connector implementation time | High | Low | SR9 only delivers stubs. Connectors are separate deliverables. No dependency on external API availability for this epic. |
| Search index inconsistency during parallel running | Low | Medium | Both portals use the same Scout/Elasticsearch index. Model observer handles sync. One-time reindex after adding org metadata fields. |
| Circular ownership in multi-supplier migration | Low | Medium | Detected by `ReconcileMultiSupplierOrgAction` and flagged for manual review. Zero auto-assignment on ambiguous cases. |

---

## Architecture Gate Check

**Date**: 2026-03-19
**Status**: PASS

### Technical Feasibility
- [x] Architecture approach clear — Integration continuity via existing job dispatch, migration via Artisan command, routing via Pennant middleware, compliance via stub framework
- [x] Existing patterns leveraged — `ShouldBeUnique` for deduplication, `AsAction` trait for actions, Pennant for feature flags, Scout for search, Sanctum for tokens
- [x] All requirements buildable — FR-001 through FR-025 mapped to concrete implementations
- [x] Performance considered — Migration batch processing, middleware <5ms overhead, Pennant cache TTL for kill switch latency
- [x] Security considered — Sanctum token scoping, encrypted session cookie for token handoff, ComplianceRegisterCheckPolicy for audit access

### Data & Integration
- [x] Data model understood — `role_migrated_at` on suppliers, `compliance_register_checks` new table, existing integration fields preserved
- [x] API contracts clear — v2 API actions, routing middleware, migration command, compliance job
- [x] Dependencies identified — Zoho CRM, MYOB, EFTSure, WorkOS, Elasticsearch, Pennant, Sanctum
- [x] Integration points mapped — 4 external services, 2 frontend portals, 1 search index, 1 authentication layer
- [x] DTO persistence explicit — Data classes validate input; actions explicitly map fields to model operations. MigrationReportData is read-only output. ComplianceCheckData goes through RunComplianceCheckAction.

### Implementation Approach
- [x] File changes identified — Full project structure with paths for all new and modified files
- [x] Risk areas noted — Migration batch failure, Zoho race condition, feature flag cache, token proliferation, MYOB mapping safety
- [x] Testing approach defined — Feature tests for each phase, edge case tests in Phase 6
- [x] Rollback possible — Feature flag reverts portal routing. Migration is additive (nullable column). Compliance framework is isolated new domain. Token middleware can be removed from Kernel.

### Resource & Scope
- [x] Scope matches spec — All 8 user stories covered. Compliance connectors explicitly deferred per spec clarification Q4.
- [x] Effort reasonable — 6 phases, mostly backend work, minimal frontend changes
- [x] Skills available — Standard Laravel patterns (Artisan commands, middleware, Pennant, Sanctum, Scout)

### Laravel & Cross-Platform Best Practices
- [x] No hardcoded business logic in Vue — SR9 is almost entirely backend. No new Vue components.
- [x] Cross-platform reusability — All logic in actions and middleware, consumed by both Inertia and API
- [x] Laravel Data for validation — MigrationReportData, ComplianceCheckData, ComplianceAlertData
- [x] Model route binding — N/A for Artisan commands. Compliance policy uses model binding where applicable.
- [x] No magic numbers/IDs — Constants on ComplianceRegisterCheck (DEFAULT_CHECK_INTERVAL_DAYS, MAX_RETRY_ATTEMPTS, RETRY_DELAY_MINUTES)
- [x] Common components pure — N/A (no new Vue components)
- [x] Use Lorisleiva Actions — AssignOrganisationAdminRoleAction, ReconcileMultiSupplierOrgAction, GenerateMigrationReportAction, RunComplianceCheckAction all use `AsAction` trait
- [x] Action authorization in `authorize()` — RunComplianceCheckAction authorize() checks staff permission. Migration actions are console-only (no HTTP authorization needed).
- [x] Data classes remain anemic — MigrationReportData, ComplianceCheckData, ComplianceAlertData are pure data containers
- [x] Migrations schema-only — `role_migrated_at` column add and `compliance_register_checks` table creation. Role assignment is an Artisan command, not a migration.
- [x] Models have single responsibility — ComplianceRegisterCheck owns compliance check lifecycle. Supplier model unchanged.
- [x] Granular model policies — ComplianceRegisterCheckPolicy with view/viewAny scoped to staff permissions
- [x] Response objects in auth — ComplianceRegisterCheckPolicy returns `Response::allow()` / `Response::deny('reason')`
- [x] Event sourcing: N/A — SR9 uses standard Eloquent. No aggregate needed for migration or compliance checks.
- [x] Semantic column documentation — `role_migrated_at` documented with PHPDoc. ComplianceRegisterCheck columns documented in migration comments.
- [x] Feature flags dual-gated — Backend: `RouteToSupplierPortal` middleware checks Pennant. Frontend: N/A (routing is server-side redirect, not client-side conditional).

### Vue TypeScript Standards
- [x] N/A — SR9 introduces no new Vue components. All work is backend (Artisan commands, middleware, jobs, models, actions). The only frontend change is the search index content, which is invisible to Vue.

### Component Decomposition
- [x] N/A — No new Vue components.

### Composition-Based Component Architecture
- [x] N/A — No new Vue components.

### Type File Organization
- [x] N/A — No new TypeScript types. Compliance register data is backend-only in this epic.

### Multi-Step Wizards
- [x] N/A — No forms or wizards in SR9.

### Pinia Stores
- [x] N/A — No frontend state management needed.

### Data Tables
- [x] N/A — No new data tables. Compliance check history table may be added in a future epic when connectors are implemented.

**Ready to Implement**: YES

---

## Development Clarifications

### Session 2026-03-19

- Q: Should the v2 API actions live in the existing `domain/Supplier/Actions/` directory or the API module? → A: API module (`app-modules/api/src/V2/Actions/Supplier/`). The v2 API actions are thin wrappers that delegate to existing domain actions and dispatch integration jobs. They belong in the API layer, not the domain.
- Q: Should `SupplierNewPortal` feature flag scope to `Supplier` or `User`? → A: Scope to `Supplier`. A user may be associated with multiple suppliers (org admin), and the routing decision is per-supplier. `Feature::for($supplier)->active(SupplierNewPortal::class)`.
- Q: Where should migration reports be stored? → A: `storage/app/migration-reports/` as timestamped JSON files. Console output for immediate feedback. No database storage for reports (they are one-time artifacts).
- Q: Should the compliance register schedule be configurable per register? → A: Not in SR9. Single `DEFAULT_CHECK_INTERVAL_DAYS` constant on the model. Per-register cadence can be added when actual connectors are implemented.
- Q: Should the token provisioning middleware run on every request or only on login? → A: Only on login (post-authentication). Running on every request adds unnecessary overhead. The middleware hooks into the login success callback, not the global middleware stack.
