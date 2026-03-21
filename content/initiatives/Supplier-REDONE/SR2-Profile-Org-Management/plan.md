---
title: "Implementation Plan: Profile & Organisation Management"
---

# Implementation Plan: Profile & Organisation Management

**Branch**: `sr2-profile-org-management` | **Date**: 2026-03-19 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `.tc-docs/content/initiatives/Supplier-REDONE/SR2-Profile-Org-Management/spec.md`
**Dependencies**: SR0 (API Foundation & Two-Tier Auth) must be complete before implementation begins.

## Summary

Build the profile and organisation management layer for the new supplier portal. This epic delivers an organisation dashboard for cross-supplier oversight, an always-visible account switcher, CRUD operations for business details / locations / team members / documents / bank details, new supplier entity creation, and compliance status tracking -- all exposed via v2 API endpoints consumed by the new React (Next.js) frontend. Backend uses Lorisleiva Actions with event sourcing for audit logging. Optimistic concurrency prevents conflicting edits. Organisation-level data (ABN, legal name, GST) is read-only and shared; supplier-level data is independently editable.

## Technical Context

**Backend**: PHP 8.4 (Laravel 12), Lorisleiva Actions (`AsAction`), Laravel Data classes, Spatie Event Sourcing
**Frontend**: React (Next.js), Shadcn/ui component library, Tailwind CSS, React Query (TanStack Query)
**API Layer**: Laravel v2 API endpoints (`/api/v2/supplier/`), Sanctum token auth (from SR0)
**Storage**: MySQL (existing schema -- Organisation > Business > Supplier hierarchy)
**Testing**: Pest v3 (backend), Jest/Vitest + React Testing Library (frontend)
**Target Platform**: Web (desktop-first, mobile-responsive)
**Performance Goals**: Organisation dashboard <3s load (SC-001), account switch <1s (SC-002), new supplier creation <2min user flow (SC-003)
**Constraints**: Must coexist with existing Inertia-based supplier portal (legacy routes remain active). Zero cross-supplier data leakage (SC-006). All mutations audited via event sourcing.
**Scale/Scope**: ~500 supplier organisations, ~1,500 supplier entities, ~3,000 organisation workers

## Project Structure

### Documentation (this feature)

```text
.tc-docs/content/initiatives/Supplier-REDONE/SR2-Profile-Org-Management/
├── spec.md              # Feature specification
├── plan.md              # This file (Gate 3)
└── tasks.md             # Implementation tasks (from /speckit-tasks)
```

### Source Code (repository root)

```text
# Backend - v2 API Controllers
app/Http/Controllers/Api/v2/Supplier/
├── OrganisationDashboardController.php    # FR-001, FR-017
├── SupplierContextController.php          # FR-002, FR-003
├── BusinessDetailController.php           # FR-004, FR-016
├── LocationController.php                 # FR-005, FR-006, FR-007
├── TeamMemberController.php               # FR-008, FR-009
├── DocumentController.php                 # FR-010, FR-011
├── BankDetailController.php               # FR-012, FR-013, FR-014
└── SupplierEntityController.php           # FR-015

# Backend - Actions (Lorisleiva AsAction)
domain/Supplier/Actions/V2/
├── GetOrganisationDashboardAction.php
├── SwitchSupplierContextAction.php
├── UpdateBusinessDetailsAction.php
├── CreateLocationAction.php
├── UpdateLocationAction.php
├── DeleteLocationAction.php
├── SetPrimaryLocationAction.php
├── InviteTeamMemberAction.php
├── RemoveTeamMemberAction.php
├── UploadDocumentAction.php
├── DeleteDocumentAction.php
├── CreateBankDetailAction.php
├── UpdateBankDetailAction.php
├── SetPrimaryBankDetailAction.php
├── CreateSupplierEntityAction.php
└── CalculateComplianceStatusAction.php

# Backend - Data Classes (Laravel Data)
domain/Supplier/Data/V2/
├── OrganisationDashboardData.php
├── SupplierSummaryData.php
├── SwitchSupplierContextData.php
├── UpdateBusinessDetailsData.php
├── CreateLocationData.php
├── UpdateLocationData.php
├── InviteTeamMemberData.php
├── UploadDocumentData.php
├── CreateBankDetailData.php
├── UpdateBankDetailData.php
├── CreateSupplierEntityData.php
└── ComplianceStatusData.php

# Backend - Event Sourcing (audit trail, FR-020)
domain/Supplier/EventSourcing/Events/V2/
├── BusinessDetailsUpdatedEvent.php
├── LocationCreatedEvent.php
├── LocationUpdatedEvent.php
├── LocationDeletedEvent.php
├── PrimaryLocationChangedEvent.php
├── TeamMemberInvitedEvent.php
├── TeamMemberRemovedEvent.php
├── DocumentUploadedEvent.php
├── DocumentDeletedEvent.php
├── BankDetailCreatedEvent.php
├── BankDetailUpdatedEvent.php
├── PrimaryBankDetailChangedEvent.php
└── SupplierEntityCreatedEvent.php

domain/Supplier/EventSourcing/Projectors/V2/
├── SupplierProfileAuditProjector.php      # Writes to audit_log table

# Backend - Policies
domain/Supplier/Policy/
├── SupplierPolicy.php                     # Extended with v2 methods
├── OrganisationLocationPolicy.php         # New
├── OrganisationWorkerPolicy.php           # New
├── BankDetailPolicy.php                   # New (in domain/BankDetail/Policy/)
└── DocumentPolicy.php                     # New (in domain/Document/Policy/)

# Backend - Middleware
app/Http/Middleware/
├── SupplierContextMiddleware.php          # Resolves active supplier from token/header
└── OptimisticConcurrencyMiddleware.php    # Validates version headers (If-Match / ETag)

# Frontend (Next.js - supplier-portal repo)
# Note: Frontend lives in a separate repository (supplier-portal).
# Structure listed here for architectural completeness.
src/
├── app/
│   ├── dashboard/
│   │   └── page.tsx                       # Organisation dashboard
│   ├── profile/
│   │   ├── page.tsx                       # Business details view/edit
│   │   ├── locations/
│   │   │   └── page.tsx                   # Location management
│   │   ├── team/
│   │   │   └── page.tsx                   # Team member management
│   │   ├── documents/
│   │   │   └── page.tsx                   # Document management
│   │   └── bank-details/
│   │       └── page.tsx                   # Bank detail management
│   └── suppliers/
│       └── new/
│           └── page.tsx                   # New supplier entity creation
├── components/
│   ├── account-switcher.tsx               # Always-visible context switcher
│   ├── compliance-badge.tsx               # Compliant/Expiring/Non-compliant badge
│   ├── supplier-card.tsx                  # Dashboard supplier summary card
│   ├── confirmation-dialog.tsx            # Bank detail change confirmation
│   └── masked-field.tsx                   # Partially masked bank account display
├── hooks/
│   ├── use-supplier-context.ts            # Active supplier state + switch logic
│   ├── use-optimistic-concurrency.ts      # ETag tracking for concurrent edit detection
│   └── use-compliance-status.ts           # Compliance calculation from documents
├── lib/
│   └── api/
│       ├── organisations.ts               # Organisation dashboard API calls
│       ├── suppliers.ts                   # Supplier CRUD API calls
│       ├── locations.ts                   # Location CRUD API calls
│       ├── team-members.ts                # Team member API calls
│       ├── documents.ts                   # Document upload/management API calls
│       └── bank-details.ts               # Bank detail API calls
└── types/
    ├── organisation.ts                    # Organisation, SupplierSummary types
    ├── supplier.ts                        # Supplier, BusinessDetails types
    ├── location.ts                        # Location types
    ├── team-member.ts                     # OrganisationWorker types
    ├── document.ts                        # Document, ComplianceStatus types
    └── bank-detail.ts                     # BankDetail types

# Tests
tests/Feature/Api/V2/Supplier/
├── OrganisationDashboardTest.php
├── SupplierContextTest.php
├── BusinessDetailTest.php
├── LocationTest.php
├── TeamMemberTest.php
├── DocumentTest.php
├── BankDetailTest.php
├── SupplierEntityCreationTest.php
├── OptimisticConcurrencyTest.php
└── CrossSupplierLeakageTest.php           # Dedicated security tests for SC-006
```

## Gate 3: Architecture Check

### 1. Technical Feasibility

| Check | Status | Notes |
|-------|--------|-------|
| **Architecture approach clear** | PASS | v2 API controllers + Lorisleiva Actions + React frontend. Follows SR0 patterns. |
| **Existing patterns leveraged** | PASS | Uses existing `Organisation > Business > Supplier` hierarchy, `HasBankDetails` trait, `HasDocuments` trait, `OrganisationWorker` polymorphic model, Spatie Event Sourcing. |
| **No impossible requirements** | PASS | All 20 FRs are buildable with existing models and infrastructure. |
| **Performance considered** | PASS | Dashboard query eager-loads suppliers with compliance counts. Account switch is a single API call updating user preference. |
| **Security considered** | PASS | All endpoints scoped via `SupplierContextMiddleware`. Dedicated `CrossSupplierLeakageTest` suite. Bank account numbers partially masked by default (FR-014). |

### 2. Data & Integration

| Check | Status | Notes |
|-------|--------|-------|
| **Data model understood** | PASS | Existing hierarchy: `Organisation` (ABN, legal name) > `Business` (business name) > `Supplier` (operational entity). `OrganisationWorker` links users to suppliers via morphTo. `OrganisationLocation` via morphTo. `BankDetail` via `HasBankDetails` morphMany trait. `Document` via `HasDocuments` morphMany trait. |
| **API contracts clear** | PASS | All endpoints defined in Design Decisions section below with request/response shapes. |
| **Dependencies identified** | PASS | SR0 (auth + v2 infrastructure), existing Spatie Event Sourcing, existing `lorisleiva/laravel-actions`, existing `spatie/laravel-data`. No new packages required. |
| **Integration points mapped** | PASS | EFTSure re-verification on bank detail BSB/account change. Zoho sync on business detail updates (`SyncSupplierToZohoJob`). SR1 onboarding wizard redirect on new entity creation. |
| **DTO persistence explicit** | PASS | All mutations go through Laravel Data classes -> Actions -> Eloquent model updates. No `->toArray()` directly into `create()`/`update()`. |

### 3. Implementation Approach

| Check | Status | Notes |
|-------|--------|-------|
| **File changes identified** | PASS | See Project Structure above. ~15 new controllers, ~16 actions, ~12 data classes, ~13 events, 5 policies, 2 middleware. |
| **Risk areas noted** | PASS | See Risks section. Primary risks: optimistic concurrency implementation, cross-supplier data leakage, EFTSure integration timing. |
| **Testing approach defined** | PASS | Feature tests per endpoint, dedicated cross-supplier leakage test suite, optimistic concurrency test suite. Frontend: component tests + integration tests for hooks. |
| **Rollback possible** | PASS | v2 API is additive -- existing v1/Inertia routes are untouched. Feature flag `supplier-portal-v2` gates the new endpoints. Rollback = disable flag. |

### 4. Resource & Scope

| Check | Status | Notes |
|-------|--------|-------|
| **Scope matches spec** | PASS | 8 user stories, 20 FRs, 7 edge cases -- all accounted for in the plan. No over-engineering. |
| **Effort reasonable** | PASS | Estimated 4-5 weeks: 2 weeks backend API, 1 week event sourcing + concurrency, 1.5 weeks frontend, 0.5 weeks testing polish. |
| **Skills available** | PASS | Team has Laravel + React + Event Sourcing experience from existing portal. |

### 5. Laravel & Cross-Platform Best Practices

| Check | Status | Notes |
|-------|--------|-------|
| **No hardcoded business logic** | PASS | Compliance status, role checks, validation -- all backend-powered via API responses. Frontend renders what the API provides. |
| **Cross-platform reusability** | PASS | v2 JSON API is frontend-agnostic. Same endpoints serve React, future mobile, and third-party integrations. |
| **Laravel Data for validation** | PASS | All request validation via `domain/Supplier/Data/V2/` classes. No Form Request classes in controllers. |
| **Model route binding** | PASS | Controllers use `Supplier $supplier`, `OrganisationLocation $location`, etc. No `int $id` parameters. |
| **No magic numbers/IDs** | PASS | Compliance thresholds (30-day expiry window) defined as `Document::EXPIRY_WARNING_DAYS`. Role names defined as constants. |
| **Common components pure** | PASS | Shadcn/ui components contain zero business logic. Business logic in hooks and API layer. |
| **Use Lorisleiva Actions** | PASS | All business operations use `AsAction` trait. Controllers are thin dispatchers. |
| **Action authorization in authorize()** | PASS | Each action defines `authorize()` returning `Response::allow()`/`Response::deny()`. Not in `handle()`. |
| **Data classes remain anemic** | PASS | Data classes are pure DTOs with validation rules. Compliance calculation logic lives in `CalculateComplianceStatusAction`. |
| **Migrations schema-only** | PASS | New migrations add `version` column for optimistic concurrency, `last_active_supplier_id` on users table. No data manipulation in migrations. |
| **Models have single responsibility** | PASS | Existing models (`Supplier`, `Organisation`, `OrganisationWorker`, `OrganisationLocation`, `BankDetail`, `Document`) each own one domain concept. No new models needed. |
| **Granular model policies** | PASS | Separate policies for each model: `SupplierPolicy`, `OrganisationLocationPolicy`, `OrganisationWorkerPolicy`, `BankDetailPolicy`, `DocumentPolicy`. Relationship checks enforce supplier scoping for non-staff. Return `Response::allow()`/`Response::deny('reason')`. |
| **Response objects in auth** | PASS | All policy methods return `Response::allow()` / `Response::deny('reason')`. |
| **Event sourcing: granular events** | PASS | 13 granular events (one per mutation type). Each records who, what, and when. Events answer future business questions: "Who changed bank details?", "When was this location deleted?" |
| **Semantic column documentation** | PASS | New columns (`version`, `last_active_supplier_id`) will have PHPDoc definitions. |
| **Feature flags dual-gated** | PASS | `supplier-portal-v2` flag gates v2 API routes via middleware. Frontend conditionally renders based on feature flag from auth response. |

### 6. React TypeScript Standards (Frontend Architecture)

**Note**: This project uses React (Next.js) with Shadcn/ui, not Vue. The Gate 3 Section 6 checks are adapted for React equivalents.

| Check | Status | Notes |
|-------|--------|-------|
| **All components use TypeScript** | PASS | Every `.tsx` file uses strict TypeScript. No `.jsx` files. `tsconfig.json` strict mode enabled. |
| **Props use named types** | PASS | All components define `type Props = { ... }` and destructure in function signature. No inline types. |
| **No `any` types planned** | PASS | All API response shapes have TypeScript types in `src/types/`. API client functions are fully typed. |
| **Shared types identified** | PASS | See `src/types/` directory. Types are organized by domain: `organisation.ts`, `supplier.ts`, `location.ts`, `team-member.ts`, `document.ts`, `bank-detail.ts`. |
| **Shadcn/ui components reused** | PASS | Using existing Shadcn primitives: `Card`, `Badge`, `Dialog`, `DropdownMenu`, `Table`, `Form`, `Input`, `Button`, `AlertDialog`, `Command` (for account switcher), `Sheet`. No bespoke duplicates. |
| **New components assessed for reusability** | PASS | `MaskedField` and `ComplianceBadge` are general-purpose -- built as shared components in `src/components/ui/`. `SupplierCard` is domain-specific, kept in feature directory. |
| **React Query for server state** | PASS | All API data fetched via React Query (`useQuery`/`useMutation`). No manual `useEffect` + `useState` for data fetching. Queries invalidated on mutations. |
| **Forms use react-hook-form + zod** | PASS | All forms use `react-hook-form` with `zod` schema validation. Server errors mapped to form fields via API response format from SR0. |

### 7. Component Decomposition (Frontend Architecture)

#### Organisation Dashboard Decomposition
- Parent: `app/dashboard/page.tsx` -- owns data fetching via React Query, layout
- Directory: `src/components/dashboard/`
- Sub-components:
  - `SupplierGrid.tsx` -- renders the grid of supplier summary cards
  - `SupplierCard.tsx` -- renders individual supplier with name, compliance, workers, pending
  - `ComplianceSummary.tsx` -- renders aggregate compliance stats across all suppliers
  - `AddSupplierButton.tsx` -- renders the "Add Supplier" CTA
- Shared types: `src/types/organisation.ts` -- `OrganisationDashboard`, `SupplierSummary`, `ComplianceStatus`

#### Profile Page Decomposition
- Parent: `app/profile/page.tsx` -- owns supplier context, data fetching
- Directory: `src/components/profile/`
- Sub-components:
  - `OrganisationDetails.tsx` -- renders read-only org-level fields (ABN, legal name, GST)
  - `SupplierDetails.tsx` -- renders editable supplier-level fields with form
  - `ProfileHeader.tsx` -- renders supplier name + compliance badge

#### Account Switcher Decomposition
- Parent: `src/components/account-switcher.tsx` -- always-visible in layout sidebar
- Uses Shadcn `Command` component for searchable dropdown
- Hidden when user has access to only one supplier entity (FR-002 AC3)
- Props: `type Props = { suppliers: SupplierSummary[]; activeSupplier: SupplierSummary; onSwitch: (supplierId: number) => void }`

### 8. Composition-Based Component Architecture

- **Composables (hooks)**:
  - `useSupplierContext()` -- manages active supplier state, switch logic, persistence. Used by account switcher, all profile pages, and dashboard. Returns `{ activeSupplier, suppliers, switchSupplier, isLoading }`.
  - `useOptimisticConcurrency()` -- tracks ETags per resource, attaches `If-Match` header to mutations, handles 409 conflict responses. Returns `{ getHeaders, handleConflict }`.
  - `useComplianceStatus()` -- derives compliance badge from document data. Pure computation, no API calls. Returns `{ status, label, variant }`.
- **Primitives**:
  - `ComplianceBadge` -- renders badge with colour based on status. Accepts `status: ComplianceStatus`.
  - `MaskedField` -- renders partially masked value with reveal toggle. Accepts `value: string`, `visibleChars: number`.
  - `ConfirmationDialog` -- wraps Shadcn `AlertDialog` with title, description, confirm/cancel. Used for bank detail changes and team member removal.
- **Composed pages**:
  - Each page wires hooks to primitives. Pages own data fetching (React Query) and form orchestration (react-hook-form). Sub-components are presentational.

### 9. Type File Organization

#### Shared Types

`src/types/organisation.ts`:
- `Organisation` -- ABN, legal name, GST status, id
- `OrganisationDashboard` -- suppliers array, aggregate compliance
- `SupplierSummary` -- id, trading name, compliance status, worker count, pending count

`src/types/supplier.ts`:
- `Supplier` -- full supplier profile data
- `BusinessDetails` -- editable supplier-level fields
- `SupplierContext` -- active supplier id + name for context switcher

`src/types/location.ts`:
- `Location` -- id, address, contact, is_primary, supplier_id
- `CreateLocationPayload` / `UpdateLocationPayload`

`src/types/team-member.ts`:
- `TeamMember` -- id, user info, role, status, locations, services
- `InviteTeamMemberPayload`

`src/types/document.ts`:
- `Document` -- id, name, type, expiry, status, supplier_id
- `ComplianceStatus` -- enum: `compliant` | `expiring` | `non_compliant`
- `UploadDocumentPayload`

`src/types/bank-detail.ts`:
- `BankDetail` -- id, bsb, masked_account_number, account_name, is_main, is_pending, status
- `CreateBankDetailPayload` / `UpdateBankDetailPayload`

`src/types/api.ts`:
- `ApiResponse<T>` -- standard v2 envelope: `{ data: T; meta?: PaginationMeta }`
- `ApiError` -- standard v2 error: `{ error: { code: string; message: string; fields?: Record<string, string[]> } }`
- `PaginationMeta` -- current_page, per_page, total, last_page

## Design Decisions

### DD-001: v2 API Endpoint Structure

All endpoints under `/api/v2/supplier/` prefix, scoped by `SupplierContextMiddleware`.

| Method | Endpoint | Action | FR |
|--------|----------|--------|----|
| GET | `/api/v2/organisation/dashboard` | OrganisationDashboardController@index | FR-001 |
| POST | `/api/v2/supplier/context` | SupplierContextController@switch | FR-002, FR-003 |
| GET | `/api/v2/supplier/profile` | BusinessDetailController@show | FR-004 |
| PUT | `/api/v2/supplier/profile` | BusinessDetailController@update | FR-004, FR-016 |
| GET | `/api/v2/supplier/locations` | LocationController@index | FR-005, FR-006 |
| POST | `/api/v2/supplier/locations` | LocationController@store | FR-006 |
| PUT | `/api/v2/supplier/locations/{location}` | LocationController@update | FR-006 |
| DELETE | `/api/v2/supplier/locations/{location}` | LocationController@destroy | FR-006 |
| POST | `/api/v2/supplier/locations/{location}/primary` | LocationController@setPrimary | FR-007 |
| GET | `/api/v2/supplier/team` | TeamMemberController@index | FR-008 |
| POST | `/api/v2/supplier/team/invite` | TeamMemberController@invite | FR-008 |
| DELETE | `/api/v2/supplier/team/{worker}` | TeamMemberController@remove | FR-008, FR-009 |
| GET | `/api/v2/supplier/documents` | DocumentController@index | FR-010 |
| POST | `/api/v2/supplier/documents` | DocumentController@upload | FR-010 |
| DELETE | `/api/v2/supplier/documents/{document}` | DocumentController@destroy | FR-010 |
| GET | `/api/v2/supplier/bank-details` | BankDetailController@index | FR-012 |
| POST | `/api/v2/supplier/bank-details` | BankDetailController@store | FR-012 |
| PUT | `/api/v2/supplier/bank-details/{bankDetail}` | BankDetailController@update | FR-012, FR-013 |
| POST | `/api/v2/supplier/bank-details/{bankDetail}/primary` | BankDetailController@setPrimary | FR-012 |
| POST | `/api/v2/organisation/suppliers` | SupplierEntityController@store | FR-015 |
| GET | `/api/v2/supplier/audit-log` | AuditLogController@index | FR-020 |

### DD-002: Optimistic Concurrency via ETag/If-Match

Concurrent edit protection for business details, locations, bank details, and team members.

**How it works**:
1. Every mutable resource includes a `version` column (integer, auto-incremented on update).
2. GET responses include `ETag` header with the version hash.
3. PUT/DELETE requests must include `If-Match` header with the ETag.
4. `OptimisticConcurrencyMiddleware` compares the ETag. On mismatch, returns `409 Conflict` with a message asking the user to refresh.
5. Frontend `useOptimisticConcurrency` hook stores ETags per resource and attaches them automatically.

**Migration**: Add `version` column (default 1) to `suppliers`, `organisation_locations`, `bank_details` tables.

### DD-003: Compliance Status Calculation (FR-011)

Compliance status is **document-driven** and calculated server-side by `CalculateComplianceStatusAction`:

1. Query all required document tags for the supplier entity (organisation-level + supplier-level).
2. For each required document tag, check if a matching approved document exists.
3. Classification:
   - **Compliant**: All required documents uploaded, approved, and expiry_date > today.
   - **Expiring**: All required documents present, but any has expiry_date within `Document::EXPIRY_WARNING_DAYS` (30 days).
   - **Non-compliant**: Any required document is missing, expired, or rejected.
4. Status is computed on-the-fly (not cached) -- queries are indexed and fast for the small document count per supplier.
5. The organisation dashboard aggregates compliance per supplier in a single query with subselects.

### DD-004: Organisation vs Supplier Document Sections (FR-010)

Documents are displayed in two sections:
- **Organisation Documents**: Shared across all supplier entities under the same ABN. These are documents where `documentable_type = Organisation`. Editable only by Organisation Administrators. Visible to all supplier entities.
- **Supplier Documents**: Scoped to a single supplier entity. `documentable_type = Supplier`. Editable by Supplier Administrators.

The document list endpoint returns both sections, tagged with `scope: 'organisation' | 'supplier'`. The frontend renders them in separate card groups.

### DD-005: Bank Detail Change Workflow (FR-013, Edge Case)

When BSB or account number is changed:
1. Frontend shows a `ConfirmationDialog` (Shadcn AlertDialog) with warning text: "This will change where payments are sent."
2. On confirmation, the API creates a **new** BankDetail record with `is_pending = true` and `status = PENDING`.
3. The previous bank detail is archived (soft-deleted) but remains the active payment target until EFTSure verification completes.
4. EFTSure verification is triggered asynchronously via a queued job.
5. On EFTSure success, the new bank detail transitions to `is_pending = false` and becomes the active payment target.

### DD-006: Account Switcher Persistence (FR-003)

- `SwitchSupplierContextAction` updates `users.last_active_supplier_id` column.
- On login (SR0 auth response), the API includes the user's `last_active_supplier_id` as the default context.
- The frontend `useSupplierContext` hook reads this from the auth response and stores it in React state (not localStorage -- single source of truth from API).

### DD-007: New Supplier Entity Creation Flow (FR-015)

1. Organisation Administrator fills minimal form: trading name only.
2. `CreateSupplierEntityAction`:
   - Creates a new `Business` under the existing `Organisation`.
   - Creates a new `Supplier` linked to the new `Business`.
   - Copies organisation-level documents to the new supplier (inherited, read-only).
   - Switches the user's active context to the new entity.
3. API response includes a redirect URL to the SR1 onboarding wizard for the new entity.
4. Organisation Administrator can exit onboarding at any point -- progress is saved per-field.

### DD-008: Cross-Supplier Data Isolation (FR-005, SC-006)

All supplier-scoped endpoints resolve the active supplier from `SupplierContextMiddleware`:
1. Middleware reads the `X-Supplier-Context` header (set by frontend from `useSupplierContext`).
2. Middleware verifies the authenticated user has access to the requested supplier via `OrganisationWorker` relationship.
3. If no access, returns `403 Forbidden`.
4. The resolved supplier is bound to the request as `request()->supplier()`.
5. All queries in controllers/actions scope to `request()->supplier()` -- never accept a supplier ID from URL parameters for data queries.

**Exception**: Organisation dashboard endpoint queries across all suppliers for the user's organisation. This is gated by the `OrganisationAdministrator` role check.

### DD-009: Audit Logging via Event Sourcing (FR-020)

Extends the existing `supplier_stored_events` table and `SupplierOnboardingAggregateRoot` pattern:
- Each mutation action records a granular event (e.g., `BusinessDetailsUpdatedEvent`, `LocationCreatedEvent`).
- Events carry: `supplier_id`, `user_id`, `changed_fields` (before/after for updates), `timestamp`.
- `SupplierProfileAuditProjector` projects events into a denormalized `supplier_audit_log` table for fast querying.
- Audit log endpoint returns paginated entries, filterable by event type and date range.
- Visible to Organisation Administrators and TC staff.

### DD-010: Impersonation Fix (FR-018, FR-019)

- Current system hardcodes `owner_user_id` for impersonation, causing 404s when the owner role changes.
- Fix: Impersonation targets the **first active Organisation Administrator** (via `OrganisationWorker` with `is_administrator = true` and `status = ACTIVE`), not the hardcoded `owner_user_id`.
- If no active administrator exists, impersonation returns a clear error to TC staff.

## Implementation Phases

### Phase 1: Foundation (Week 1)

**Goal**: Middleware, context switching, and base API infrastructure.

1. **SupplierContextMiddleware** -- resolves active supplier from `X-Supplier-Context` header, binds to request.
2. **OptimisticConcurrencyMiddleware** -- ETag/If-Match validation.
3. **Migration**: Add `version` column to `suppliers`, `organisation_locations`, `bank_details`. Add `last_active_supplier_id` to `users`.
4. **SupplierContextController** -- switch context endpoint + user preference persistence.
5. **Route registration** -- all v2 supplier routes with auth + supplier context middleware.
6. **Policies**: `OrganisationLocationPolicy`, `OrganisationWorkerPolicy`, `BankDetailPolicy`, `DocumentPolicy` with `Response::allow()`/`Response::deny()`.
7. **Impersonation fix** (FR-018, FR-019) -- update impersonation logic to target active administrator.

**Tests**: Middleware unit tests, context switching feature tests, policy tests, impersonation fix tests.

### Phase 2: Core Profile CRUD (Week 2)

**Goal**: Business details, locations, and team members.

1. **BusinessDetailController** + `UpdateBusinessDetailsAction` -- org-level read-only, supplier-level editable.
2. **LocationController** + CRUD actions -- create, update, delete, set primary. Enforce min-1 constraint.
3. **TeamMemberController** + invite/remove actions -- email invitation, role assignment, last-admin protection.
4. **Event sourcing events** for business details, locations, team members.
5. **`CalculateComplianceStatusAction`** -- document-driven compliance calculation.

**Tests**: CRUD feature tests, constraint enforcement (min-1 location, last-admin), cross-supplier leakage tests.

### Phase 3: Documents & Bank Details (Week 3)

**Goal**: Document management, bank detail management, compliance status.

1. **DocumentController** + upload/delete actions -- org vs supplier scoping, expiry tracking.
2. **BankDetailController** + CRUD actions -- BSB/account change confirmation, primary flag, EFTSure trigger.
3. **OrganisationDashboardController** -- aggregate view with compliance per supplier.
4. **Event sourcing events** for documents and bank details.
5. **Audit log projector** + `supplier_audit_log` migration.

**Tests**: Document upload/expiry tests, bank detail change workflow tests, dashboard aggregation tests, audit log tests.

### Phase 4: Supplier Entity Creation & Polish (Week 4)

**Goal**: New entity creation, edge cases, audit trail.

1. **SupplierEntityController** + `CreateSupplierEntityAction` -- create business + supplier, inherit org docs, redirect to SR1 wizard.
2. **AuditLogController** -- paginated audit trail endpoint.
3. **Edge case hardening**: concurrent edit conflicts, last-admin protection, deactivation of sole org admin, worker assignment cleanup on location/service deletion, bank detail change during invoice processing.
4. **Optimistic concurrency integration tests** -- simulate concurrent edits.

**Tests**: Entity creation flow, edge case tests, full integration test suite.

### Phase 5: Frontend Implementation (Week 4-5)

**Goal**: React (Next.js) pages consuming the v2 API. (Lives in supplier-portal repo.)

1. **Hooks**: `useSupplierContext`, `useOptimisticConcurrency`, `useComplianceStatus`.
2. **Account Switcher** component in layout sidebar.
3. **Organisation Dashboard** page with supplier cards + compliance badges.
4. **Profile pages**: Business details, locations, team members, documents, bank details.
5. **New Supplier Entity** creation flow.
6. **Error handling**: 409 conflict dialog, field-level validation, 403 redirects.

**Tests**: Component tests (React Testing Library), hook tests, integration tests for API consumption.

## Testing Strategy

### Backend (Pest v3)

| Test Suite | What It Covers | Key Assertions |
|------------|---------------|----------------|
| `OrganisationDashboardTest` | Dashboard data aggregation, compliance rollup | Correct supplier count, compliance per entity, Org Admin only |
| `SupplierContextTest` | Context switching, preference persistence | Switch updates `last_active_supplier_id`, default restored on login |
| `BusinessDetailTest` | Read/update business details | Org fields read-only, supplier fields editable, version incremented |
| `LocationTest` | Location CRUD, primary flag, min-1 constraint | Create/update/delete, only-one-primary, cannot delete last |
| `TeamMemberTest` | Invite, view, remove, last-admin protection | Invitation sent, status changes, cannot remove last admin |
| `DocumentTest` | Upload, delete, expiry warning, compliance calc | Upload stores file, expiry triggers warning, compliance status correct |
| `BankDetailTest` | CRUD, primary flag, change confirmation, EFTSure | New detail pending, old archived, EFTSure job dispatched |
| `SupplierEntityCreationTest` | New entity flow, org doc inheritance | Business + Supplier created, org docs inherited, context switched |
| `OptimisticConcurrencyTest` | ETag/If-Match workflow | Stale ETag returns 409, fresh ETag succeeds, version incremented |
| `CrossSupplierLeakageTest` | Data isolation across supplier entities | User A cannot see User B's locations/workers/docs/bank via any endpoint |
| `AuditLogTest` | Event recording and retrieval | All mutations produce events, audit log returns correct entries |

### Frontend (Vitest + React Testing Library)

| Test Suite | What It Covers |
|------------|---------------|
| Hook tests | `useSupplierContext`, `useOptimisticConcurrency`, `useComplianceStatus` |
| Component tests | Account switcher, compliance badge, masked field, confirmation dialog |
| Page integration tests | Dashboard renders supplier cards, profile form submits correctly |
| Error handling tests | 409 conflict shows refresh dialog, 403 redirects, validation errors display |

## Risks & Mitigations

| Risk | Severity | Mitigation |
|------|----------|------------|
| **Cross-supplier data leakage** | Critical | Dedicated `SupplierContextMiddleware` on all endpoints. `CrossSupplierLeakageTest` suite with explicit checks for every endpoint. Code review focus area. |
| **Optimistic concurrency UX** | Medium | Clear conflict dialog in frontend. Auto-refresh option. Only applied to write operations, not reads. |
| **EFTSure integration timing** | Medium | Bank detail changes are async. UI shows "Pending Verification" status. Payments continue to old details until verified. Graceful degradation if EFTSure is unavailable. |
| **Large organisation dashboard queries** | Low | Most organisations have 1-5 supplier entities. Query uses eager loading with subselects for compliance counts. If needed, add caching later. |
| **SR0 dependency delay** | Medium | Backend actions and tests can be developed in parallel with SR0 using auth mocks. Integration tested once SR0 is complete. |
| **Event sourcing table growth** | Low | `supplier_stored_events` is append-only. Existing pattern handles this well. Audit log projector keeps a denormalized read model for fast queries. |
| **Concurrent entity creation** | Low | `CreateSupplierEntityAction` uses database transaction. Duplicate business name under same org is allowed (different trading names). |

## Next Steps

1. **SR0 completion** -- Ensure v2 API infrastructure, Sanctum token auth, and two-tier role model are in place.
2. **Run `/speckit-tasks`** -- Break this plan into granular implementation tasks.
3. **Phase 1 kickoff** -- Start with middleware and context switching foundation.
4. **Coordinate with supplier-portal repo** -- Ensure frontend team has API contract documentation and type definitions.
