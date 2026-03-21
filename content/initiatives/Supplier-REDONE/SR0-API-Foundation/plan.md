---
title: "Implementation Plan: API Foundation & Two-Tier Auth"
---

# Implementation Plan: API Foundation & Two-Tier Auth

**Spec**: [spec.md](/initiatives/supplier-redone/sr0-api-foundation/spec)
**Design**: [design.md](/initiatives/supplier-redone/sr0-api-foundation/design)
**Created**: 2026-03-19
**Status**: Draft

## Summary

This epic establishes the API v2 infrastructure and two-tier authentication model that every subsequent Supplier REDONE epic depends on. On the backend, it adds a versioned `/api/v2/` route group to the existing tc-portal Laravel monolith with a consistent JSON envelope response format, Sanctum token-based authentication (access + refresh tokens), a two-tier role hierarchy (Organisation Administrator and Supplier-scoped roles), supplier context switching, and an invitation system. On the frontend, it scaffolds the new standalone Next.js supplier portal with a login page, token management, and a supplier context switcher — all built with Shadcn/ui and Tailwind CSS.

The key architectural decision is that the backend remains inside tc-portal (shared database, shared models, shared domain logic) while the frontend is a completely separate Next.js app that communicates exclusively via API tokens. This avoids duplicating business logic while enabling mobile and third-party API consumers in the future.

## Technical Context

### Technology Stack

- **Backend**: Laravel 12, PHP 8.4 (existing tc-portal monolith at `/Users/williamwhitelaw/Herd/tc-portal`)
- **Frontend**: Next.js (React), Shadcn/ui, Tailwind CSS (standalone app at `/Users/williamwhitelaw/Herd/supplier-portal`)
- **Auth**: Laravel Sanctum v4 (token-based, NOT cookie/session SPA auth)
- **Database**: MySQL (existing tc-portal database — `organisations`, `businesses`, `suppliers`, `users`, `personal_access_tokens`, `organisation_workers`, `roles`, `model_has_roles` tables)
- **Roles/Permissions**: Spatie Permission (existing, with `roles` and `model_has_roles` tables using team scoping)
- **Actions**: Lorisleiva Laravel Actions v2 (`AsAction` trait)
- **API Documentation**: Scribe (auto-generated from annotations + FormRequest/Data classes)

### Dependencies

| Dependency | Type | Status |
|------------|------|--------|
| Laravel Sanctum v4 | Package | Installed — `personal_access_tokens` table exists, `HasApiTokens` on `ApplicationIdentity` model |
| Spatie Permission | Package | Installed — `roles`, `model_has_roles` tables with team scoping |
| Lorisleiva Actions | Package | Installed (`^2.9`) |
| `organisations` table | Schema | Exists — has `abn`, `legal_trading_name`, `parent_organisation_id`, `owner_user_id`, `verification_stage` |
| `businesses` table | Schema | Exists — has `organisation_id`, `business_name`, FK to `organisations` |
| `suppliers` table | Schema | Exists — has `business_id`, `owner_user_id`, `stage`, FK to `businesses` |
| `organisation_workers` table | Schema | Exists — polymorphic `workerable` with `user_id`, `status`, `location_ids`, `service_ids` |
| `organisation_invitations` table | Schema | Exists — has `organisation_id`, `user_id` |
| `users` table | Schema | Exists — has `organisation_id`, `password`, `email` (unique), WorkOS fields |
| Knuckles Scribe | Package | New — needs `composer require knuckleswtf/scribe` |
| CORS config | Config | Exists at `config/cors.php` — already allows `*.trilogycare.com.au`, `*.trilogycare.dev`, and localhost patterns |

### Constraints

| Constraint | Source | Value |
|------------|--------|-------|
| API response time | SC-003 | Context switch < 1 second |
| Concurrent users | SC-006 | 500+ concurrent authenticated users |
| Rate limit | FR-011 | 60 requests/minute per authenticated user |
| Token expiry (access) | FR-002 | 1 hour |
| Token expiry (refresh) | FR-002 | 30 days |
| Data isolation | SC-010 | Zero cross-supplier data leakage |
| Backwards compatibility | Story 1, AC4 | v1 API continues functioning unchanged |
| Dual sessions | Edge case | Users can have active Inertia session AND API tokens simultaneously |

## Gate 3: Architecture Check

### 1. Technical Feasibility

| Check | Result | Notes |
|-------|--------|-------|
| Architecture approach clear | PASS | v2 route group in tc-portal, Sanctum token auth, Next.js standalone frontend. Clear separation of concerns. |
| Existing patterns leveraged | PASS | Reuses existing `organisations`, `businesses`, `suppliers` models and relationships. Leverages Sanctum (already installed), Spatie Permission (already installed), Lorisleiva Actions (already installed). |
| No impossible requirements | PASS | All 17 FRs are buildable with existing Laravel/Sanctum/Spatie stack. Refresh token pattern requires a custom `refresh_tokens` table (Sanctum only does access tokens natively) but this is a well-known pattern. |
| Performance considered | PASS | Token auth avoids session storage overhead. Context switch is a single DB update + token re-issue. Rate limiting via Laravel's built-in `ThrottleRequests` middleware. |
| Security considered | PASS | Tokens scoped with abilities, refresh tokens stored hashed, CORS already configured, rate limiting prevents abuse, role checks at middleware level before reaching handlers. |

### 2. Data & Integration

| Check | Result | Notes |
|-------|--------|-------|
| Data model understood | PASS | Existing hierarchy: `organisations` (ABN) -> `businesses` (trading names) -> `suppliers` (operational units). The spec's "Organisation" maps to `organisations`, "Supplier Entity" maps to `suppliers` (via `businesses`). Users link via `organisation_id` on `users` and `organisation_workers` polymorphic table. |
| API contracts clear | PASS | Endpoints defined below in API Contracts section. JSON envelope format standardised. |
| Dependencies identified | PASS | Need Scribe package. Need new migration for `supplier_api_refresh_tokens` table. Need new Spatie roles for supplier portal context. |
| Integration points mapped | PASS | Connects to existing `users` table (shared auth), existing `organisations`/`businesses`/`suppliers` tables (shared data), existing Spatie roles/permissions (extended with new supplier portal roles). |
| DTO persistence explicit | PASS | All API endpoints use Laravel Data classes for request validation and Eloquent API Resources for response serialisation. No `->toArray()` into ORM. |

### 3. Implementation Approach

| Check | Result | Notes |
|-------|--------|-------|
| File changes identified | PASS | See Implementation Phases below for full file list. |
| Risk areas noted | PASS | See Risk Assessment. Key risks: refresh token rotation, cross-supplier data leakage, CORS in production. |
| Testing approach defined | PASS | Pest feature tests for every API endpoint. React Testing Library + MSW for frontend. See Testing Strategy. |
| Rollback possible | PASS | New v2 routes are additive — v1 untouched. New migrations can be rolled back. Feature flag gates the entire v2 API. Frontend is a separate deploy. |

### 4. Resource & Scope

| Check | Result | Notes |
|-------|--------|-------|
| Scope matches spec | PASS | Plan covers exactly the 6 user stories and 17 FRs. No registration, no ABN lookup, no onboarding (SR1). No profile management (SR2). |
| Effort reasonable | PASS | 4 phases, estimated 2-3 weeks total. Phase 1 (API infra + auth) is the critical path. |
| Skills available | PASS | Laravel/Sanctum expertise exists on the team. React/Next.js is new but Shadcn/ui reduces component work. |

### 5. Laravel & Cross-Platform Best Practices

| Check | Result | Notes |
|-------|--------|-------|
| No hardcoded business logic | PASS | Role hierarchy and permissions are database-driven via Spatie. Rate limits are config values. Token expiry durations are constants on the relevant model/config. |
| Cross-platform reusability | PASS | The entire point — API serves React web, future React Native mobile, and third-party consumers. Zero frontend-specific logic in the API. |
| Laravel Data for validation | PASS | All request validation via Laravel Data classes (e.g., `LoginData`, `SwitchSupplierContextData`, `CreateInvitationData`). |
| Model route binding | PASS | Controllers use model route binding (e.g., `Supplier $supplier`, `Invitation $invitation`). |
| No magic numbers/IDs | PASS | Token expiry durations as constants. Role names as constants on a `SupplierPortalRole` enum. Rate limit values as constants. |
| Common components pure | PASS | Shadcn/ui components contain zero business logic. Custom components (`SupplierSwitcher`, `RateLimitBanner`) receive data via props. |
| Use Lorisleiva Actions | PASS | All business logic in Actions with `AsAction` trait: `LoginSupplierUserAction`, `RefreshTokenAction`, `SwitchSupplierContextAction`, `CreateSupplierInvitationAction`, `RevokeUserTokensAction`. |
| Action authorization in authorize() | PASS | Auth checks in each action's `authorize()` method using `Response::allow()` / `Response::deny()`. |
| Data classes remain anemic | PASS | `LoginData`, `SwitchSupplierContextData`, `CreateInvitationData` — properties and type casting only. |
| Migrations schema-only | PASS | New migration adds `supplier_api_refresh_tokens` table, adds `active_supplier_id` to `users`. Schema only. Seeding new roles via Laravel Operation. |
| Models have single responsibility | PASS | No new models are overloaded. `SupplierApiRefreshToken` owns refresh token lifecycle only. |
| Granular model policies | PASS | `SupplierPolicy` for supplier data access, `InvitationPolicy` for invitation CRUD. Each returns `Response` objects. |
| Response objects in auth | PASS | All policies and action `authorize()` return `Response::allow()` / `Response::deny('reason')`. |
| Event sourcing: granular events | N/A | SR0 does not introduce event sourcing. The existing `supplier_stored_events` table is untouched. |
| Semantic column documentation | PASS | New `active_supplier_id` column on `users` will have PHPDoc explaining it stores the last-used supplier context for the supplier portal. |
| Feature flags dual-gated | PASS | `SupplierPortalV2` Pennant feature flag gates the v2 route group via middleware. Frontend checks feature availability on the auth response. |

### 6. Frontend Standards (React/Next.js)

Since this is a React/Next.js frontend (not Vue/Inertia), the Vue-specific checks are adapted to React equivalents.

| Check | Result | Notes |
|-------|--------|-------|
| All components use TypeScript | PASS | Every `.tsx` file uses TypeScript. The Next.js project is configured with `strict: true` in `tsconfig.json`. |
| Props use named types | PASS | All components define `type Props = { ... }` and destructure in the function signature. |
| No `any` types planned | PASS | API response types are fully typed. Auth context types defined. Supplier/Organisation/Role types defined. |
| Shared types identified | PASS | `src/types/api.ts` (envelope, pagination, error), `src/types/auth.ts` (user, token, role), `src/types/supplier.ts` (supplier entity, organisation). |
| Shadcn/ui components reused | PASS | `Card`, `Input`, `Button`, `DropdownMenu`, `Badge`, `Alert`, `Skeleton` from Shadcn/ui. No custom duplicates. |
| New components assessed | PASS | `SupplierSwitcher` and `RateLimitBanner` are feature-specific (not generic UI patterns). Kept bespoke. |

### 7. Component Decomposition

| Check | Result | Notes |
|-------|--------|-------|
| Component decomposition planned | PASS | Login page, auth layout, supplier switcher, rate limit banner — each is a single-concern component. |
| Each sub-component has single concern | PASS | `LoginForm` handles form state, `SupplierSwitcher` handles context switching, `RateLimitBanner` handles rate limit display. |
| Parent owns logic | PASS | Page components own data fetching and orchestration. Presentational components receive props. |
| Directory structure defined | PASS | See React Components section below. |
| Naming is simple | PASS | Components named after what they render. |
| No template section comments planned | PASS | Components are small enough to not need section markers. |

### 8. Composition-Based Architecture

| Check | Result | Notes |
|-------|--------|-------|
| Composition planned over configuration | PASS | React hooks for logic, components for presentation. No boolean prop branching. |
| Composables (hooks) identified | PASS | `useAuth()`, `useSupplierContext()`, `useApiClient()`, `useRateLimit()` — see below. |
| Primitives are single-responsibility | PASS | Each component renders one thing. |
| Consumer controls layout | PASS | Page components compose smaller components. Layout decisions at the page level. |
| No boolean prop branching | PASS | No variant/mode props that toggle between different render paths. |

## Design Decisions

### Data Model

The existing database already has the three-tier hierarchy that maps to the spec's entities:

```
organisations (1 per ABN)
  └── businesses (trading names under an org)
       └── suppliers (operational units under a business)
```

**Existing relationships discovered from schema:**
- `organisations.parent_organisation_id` -> self-referential (org hierarchy)
- `organisations.owner_user_id` -> `users.id` (org owner)
- `businesses.organisation_id` -> `organisations.id` (FK with cascade delete)
- `suppliers.business_id` -> `businesses.id` (FK with cascade delete)
- `suppliers.owner_user_id` -> `users.id` (supplier owner)
- `users.organisation_id` -> `organisations.id` (user's org)
- `organisation_workers` -> polymorphic (`workerable_type`/`workerable_id`) linking users to orgs/suppliers

**New schema additions:**

1. **`supplier_api_refresh_tokens` table** (new migration):
   - `id` (bigint, PK)
   - `user_id` (bigint, FK -> `users.id`)
   - `token` (varchar, unique, hashed)
   - `expires_at` (timestamp)
   - `revoked_at` (timestamp, nullable)
   - `created_at` / `updated_at`

2. **`users` table modification** (new migration):
   - Add `active_supplier_id` (bigint, nullable, FK -> `suppliers.id`) — stores the user's last-used supplier context for the supplier portal.

3. **New Spatie roles** (via Laravel Operation, not migration):
   - `organisation_administrator` (guard: `sanctum`)
   - `supplier_administrator` (guard: `sanctum`)
   - `supplier` (guard: `sanctum`)
   - `team_member` (guard: `sanctum`)

4. **`organisation_invitations` table modification** (new migration):
   - Add `email` (varchar) — the invited email address
   - Add `supplier_id` (bigint, nullable, FK -> `suppliers.id`) — null means org-level invite
   - Add `role` (varchar) — the role to assign on acceptance
   - Add `token` (varchar, unique) — invitation acceptance token
   - Add `accepted_at` (timestamp, nullable)
   - Add `expires_at` (timestamp)
   - Add `invited_by_user_id` (bigint, FK -> `users.id`)

### API Contracts

All v2 endpoints follow a consistent JSON envelope:

**Success response:**
```json
{
  "data": { ... },
  "meta": { "pagination": { ... } }
}
```

**Error response:**
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "The given data was invalid.",
    "details": { "email": ["The email field is required."] }
  }
}
```

**Route structure:**

```
POST   /api/v2/auth/login                    LoginSupplierUserAction
POST   /api/v2/auth/refresh                  RefreshTokenAction
POST   /api/v2/auth/logout                   LogoutSupplierUserAction
GET    /api/v2/auth/me                       GetAuthenticatedUserAction

POST   /api/v2/supplier-context/switch       SwitchSupplierContextAction
GET    /api/v2/supplier-context/available     ListAvailableSuppliersAction

POST   /api/v2/invitations                   CreateSupplierInvitationAction
GET    /api/v2/invitations                   ListInvitationsAction
POST   /api/v2/invitations/{invitation}/accept  AcceptInvitationAction
DELETE /api/v2/invitations/{invitation}       RevokeInvitationAction

POST   /api/v2/admin/users/{user}/revoke-tokens  RevokeUserTokensAction

GET    /api/v2/docs                          Scribe-generated documentation
```

**Middleware stack for v2 routes:**
```php
Route::prefix('v2')
    ->middleware([
        'throttle:supplier-api',        // 60 req/min per user
        EnsureSupplierPortalEnabled::class, // Pennant feature flag
    ])
    ->group(function () {
        // Public (unauthenticated) routes
        Route::prefix('auth')->group(function () {
            Route::post('login', LoginSupplierUserAction::class);
            Route::post('refresh', RefreshTokenAction::class);
        });

        // Authenticated routes
        Route::middleware('auth:sanctum')->group(function () {
            // Auth
            Route::post('auth/logout', LogoutSupplierUserAction::class);
            Route::get('auth/me', GetAuthenticatedUserAction::class);

            // Supplier context
            Route::middleware(EnsureActiveSupplierContext::class)->group(function () {
                // All data endpoints go here in future epics
            });

            // Context management (no active context required)
            Route::post('supplier-context/switch', SwitchSupplierContextAction::class);
            Route::get('supplier-context/available', ListAvailableSuppliersAction::class);

            // Invitations
            Route::apiResource('invitations', InvitationController::class)
                ->only(['index', 'store', 'destroy']);
            Route::post('invitations/{invitation}/accept', AcceptInvitationAction::class);

            // Admin
            Route::middleware(EnsureOrganisationAdministrator::class)->group(function () {
                Route::post('admin/users/{user}/revoke-tokens', RevokeUserTokensAction::class);
            });
        });
    });
```

### React Components

**Directory structure in supplier-portal:**

```
src/
├── app/
│   ├── (auth)/
│   │   └── login/
│   │       └── page.tsx              ← Login page
│   ├── (portal)/
│   │   ├── layout.tsx                ← Authenticated layout with header + switcher
│   │   └── dashboard/
│   │       └── page.tsx              ← Post-login landing (placeholder for SR2+)
│   └── layout.tsx                    ← Root layout
├── components/
│   ├── auth/
│   │   └── LoginForm.tsx             ← Login form with validation + error display
│   ├── layout/
│   │   ├── AppHeader.tsx             ← App header with nav + switcher slot
│   │   └── SupplierSwitcher.tsx      ← Supplier context dropdown
│   ├── feedback/
│   │   └── RateLimitBanner.tsx       ← Sticky 429 banner with countdown
│   └── ui/                           ← Shadcn/ui components (auto-generated)
├── hooks/
│   ├── use-auth.ts                   ← Auth state, login/logout, token refresh
│   ├── use-supplier-context.ts       ← Active supplier, switch, available list
│   ├── use-api-client.ts             ← Axios instance with interceptors
│   └── use-rate-limit.ts             ← Rate limit state from 429 responses
├── lib/
│   ├── api-client.ts                 ← Axios instance config, token injection, refresh interceptor
│   └── utils.ts                      ← Shadcn/ui cn() utility (existing)
├── types/
│   ├── api.ts                        ← ApiResponse<T>, ApiError, PaginationMeta
│   ├── auth.ts                       ← AuthUser, AuthTokens, LoginCredentials
│   └── supplier.ts                   ← SupplierEntity, Organisation, SupplierRole
└── providers/
    └── AuthProvider.tsx              ← React context for auth state
```

#### LoginForm.tsx
- Props: `type Props = { onSuccess: () => void }`
- Hooks used: `useAuth()` for login action
- Shadcn/ui components: `Card`, `Input`, `Button`, `Alert`
- Validation: email format on blur (Zod), credentials on submit (server)
- States: idle, submitting (spinner in button), error (alert above form)

#### SupplierSwitcher.tsx
- Props: `type Props = { suppliers: SupplierEntity[]; activeSupplier: SupplierEntity; onSwitch: (supplierId: number) => void }`
- Shadcn/ui components: `DropdownMenu`, `Badge`
- Visibility: Hidden when `suppliers.length <= 1` (parent controls this)
- Feedback: Optimistic UI — immediately shows new selection, skeleton fallback if API is slow

#### RateLimitBanner.tsx
- Props: `type Props = { retryAfterSeconds: number; onDismiss: () => void }`
- Behaviour: Countdown timer, auto-dismisses when timer reaches 0
- Styling: `bg-orange-50 border-orange-200` per design.md

#### Shared Types

**`src/types/api.ts`:**
```typescript
type ApiResponse<T> = {
  data: T
  meta?: { pagination?: PaginationMeta }
}

type ApiError = {
  error: {
    code: string
    message: string
    details?: Record<string, string[]>
  }
}

type PaginationMeta = {
  current_page: number
  last_page: number
  per_page: number
  total: number
}
```

**`src/types/auth.ts`:**
```typescript
type AuthUser = {
  id: number
  email: string
  first_name: string
  last_name: string
  full_name: string
  role: SupplierRole
  organisation: OrganisationSummary
  active_supplier: SupplierEntity | null
  available_suppliers: SupplierEntity[]
}

type AuthTokens = {
  access_token: string
  refresh_token: string
  expires_in: number
}

type LoginCredentials = {
  email: string
  password: string
}
```

**`src/types/supplier.ts`:**
```typescript
type SupplierRole = 'organisation_administrator' | 'supplier_administrator' | 'supplier' | 'team_member'

type SupplierEntity = {
  id: number
  business_name: string
  verification_stage: string | null
  organisation_id: number
}

type OrganisationSummary = {
  id: number
  legal_trading_name: string
  abn: string
}
```

#### Hooks

**`use-auth.ts`:**
- Returns: `{ user, isAuthenticated, isLoading, login, logout, refreshToken }`
- Manages: access token in memory, refresh token in httpOnly cookie
- Auto-refresh: interceptor triggers refresh when access token expires

**`use-supplier-context.ts`:**
- Returns: `{ activeSupplier, availableSuppliers, switchSupplier, isLoading }`
- Manages: active supplier state, fetches available suppliers on auth

**`use-api-client.ts`:**
- Returns: configured Axios instance
- Interceptors: auto-inject `Authorization: Bearer <token>`, auto-refresh on 401, capture 429 for rate limit banner

**`use-rate-limit.ts`:**
- Returns: `{ isRateLimited, retryAfterSeconds, dismiss }`
- Fed by: 429 response interceptor in api-client

## Implementation Phases

### Phase 1: API Infrastructure & Auth (P1 — Critical Path)

**Backend files (tc-portal):**

| File | Action | Purpose |
|------|--------|---------|
| `routes/api.php` | Modify | Add v2 route group with all auth endpoints |
| `app/Http/Middleware/EnsureSupplierPortalEnabled.php` | Create | Pennant feature flag check middleware |
| `app/Http/Middleware/EnsureActiveSupplierContext.php` | Create | Verify user has an active supplier context |
| `app/Http/Middleware/EnsureOrganisationAdministrator.php` | Create | Verify user has org admin role |
| `app/domain/Supplier/Actions/Api/LoginSupplierUserAction.php` | Create | Validate credentials, issue access + refresh tokens |
| `app/domain/Supplier/Actions/Api/RefreshTokenAction.php` | Create | Validate refresh token, issue new access token |
| `app/domain/Supplier/Actions/Api/LogoutSupplierUserAction.php` | Create | Revoke current tokens |
| `app/domain/Supplier/Actions/Api/GetAuthenticatedUserAction.php` | Create | Return authenticated user with role + supplier context |
| `app/domain/Supplier/Data/Api/LoginData.php` | Create | Validation: email (required, email), password (required) |
| `app/domain/Supplier/Data/Api/RefreshTokenData.php` | Create | Validation: refresh_token (required) |
| `app/domain/Supplier/Resources/Api/AuthUserResource.php` | Create | JSON resource for authenticated user response |
| `app/domain/Supplier/Resources/Api/AuthTokenResource.php` | Create | JSON resource for token response |
| `app/Http/Resources/Api/V2/ApiResponse.php` | Create | Trait/base class for consistent JSON envelope |
| `app/Http/Resources/Api/V2/ApiErrorResponse.php` | Create | Standardised error response helper |
| `app/Models/SupplierApiRefreshToken.php` | Create | Eloquent model for refresh tokens |
| `database/migrations/xxxx_create_supplier_api_refresh_tokens_table.php` | Create | Refresh token storage |
| `database/migrations/xxxx_add_active_supplier_id_to_users_table.php` | Create | User's last-used supplier context |
| `config/sanctum.php` | Modify | Configure token expiration for supplier API tokens |
| `config/cors.php` | Modify | Add supplier portal domain to allowed origins |
| `app/Providers/Features/SupplierPortalV2.php` | Create | Pennant feature flag definition |

**Covers**: FR-001, FR-002, FR-009, FR-012, FR-013, FR-014, FR-016; Stories 1, 3; SC-001, SC-004, SC-007, SC-008.

### Phase 2: Two-Tier Role Model & Context Switching (P1-P2)

**Backend files (tc-portal):**

| File | Action | Purpose |
|------|--------|---------|
| `app/domain/Supplier/Enums/SupplierPortalRole.php` | Create | Enum: ORGANISATION_ADMINISTRATOR, SUPPLIER_ADMINISTRATOR, SUPPLIER, TEAM_MEMBER |
| `app/domain/Supplier/Actions/Api/SwitchSupplierContextAction.php` | Create | Update active supplier, remember preference |
| `app/domain/Supplier/Actions/Api/ListAvailableSuppliersAction.php` | Create | Return suppliers the user can access |
| `app/domain/Supplier/Data/Api/SwitchSupplierContextData.php` | Create | Validation: supplier_id (required, exists) |
| `app/domain/Supplier/Resources/Api/SupplierEntityResource.php` | Create | JSON resource for supplier entity |
| `app/domain/Supplier/Policies/SupplierPolicy.php` | Create | Authorisation: viewAny, view, update scoped to role + supplier context |
| `app/Operations/SeedSupplierPortalRoles.php` | Create | Laravel Operation to create the 4 Spatie roles |
| `app/domain/Supplier/Scopes/SupplierContextScope.php` | Create | Global scope that filters by active supplier context |

**Covers**: FR-003, FR-004, FR-005, FR-006, FR-015; Stories 2, 4; SC-003, SC-010.

### Phase 3: Invitations & API Docs (P2-P3)

**Backend files (tc-portal):**

| File | Action | Purpose |
|------|--------|---------|
| `database/migrations/xxxx_add_invitation_fields_to_organisation_invitations_table.php` | Create | Add email, supplier_id, role, token, accepted_at, expires_at, invited_by_user_id |
| `app/domain/Supplier/Actions/Api/CreateSupplierInvitationAction.php` | Create | Create org-level or supplier-level invitation |
| `app/domain/Supplier/Actions/Api/AcceptInvitationAction.php` | Create | Accept invite, assign role, link to supplier |
| `app/domain/Supplier/Actions/Api/ListInvitationsAction.php` | Create | List pending invitations for the user's scope |
| `app/domain/Supplier/Actions/Api/RevokeInvitationAction.php` | Create | Soft-delete an invitation |
| `app/domain/Supplier/Actions/Api/RevokeUserTokensAction.php` | Create | Revoke all tokens for a user (admin action) |
| `app/domain/Supplier/Data/Api/CreateInvitationData.php` | Create | Validation: email, role, supplier_id (nullable) |
| `app/domain/Supplier/Resources/Api/InvitationResource.php` | Create | JSON resource for invitation |
| `app/domain/Supplier/Policies/InvitationPolicy.php` | Create | Authorisation: org admins can do everything, supplier admins scoped |
| `app/domain/Supplier/Notifications/SupplierInvitationNotification.php` | Create | Email notification for invitations |

**API Documentation:**
- Install Scribe: `composer require knuckleswtf/scribe --dev`
- Configure: `php artisan vendor:publish --tag=scribe-config`
- Annotate all v2 actions with `@group`, `@bodyParam`, `@response` docblocks
- Generate: `php artisan scribe:generate`
- Serve at `/api/v2/docs`

**Rate limiting:**
- Configure named limiter `supplier-api` in `RouteServiceProvider` — 60 requests/minute per authenticated user
- Ensure `X-RateLimit-Remaining` and `Retry-After` headers are included via `ThrottleRequests` middleware (Laravel includes these by default)

**Covers**: FR-007, FR-008, FR-010, FR-011, FR-014; Stories 5, 6; SC-005, SC-009.

### Phase 4: React Frontend Auth (P1 frontend)

**Frontend files (supplier-portal):**

| File | Action | Purpose |
|------|--------|---------|
| `src/types/api.ts` | Create | API response envelope types |
| `src/types/auth.ts` | Create | Auth user, tokens, credentials types |
| `src/types/supplier.ts` | Create | Supplier entity, organisation, role types |
| `src/lib/api-client.ts` | Create | Axios instance with token injection + refresh interceptor |
| `src/hooks/use-auth.ts` | Create | Auth state management hook |
| `src/hooks/use-supplier-context.ts` | Create | Supplier context management hook |
| `src/hooks/use-api-client.ts` | Create | Hook exposing configured API client |
| `src/hooks/use-rate-limit.ts` | Create | Rate limit state from 429 responses |
| `src/providers/AuthProvider.tsx` | Create | React context provider for auth |
| `src/components/auth/LoginForm.tsx` | Create | Login form with inline validation |
| `src/components/layout/AppHeader.tsx` | Create | Authenticated app header |
| `src/components/layout/SupplierSwitcher.tsx` | Create | Supplier context dropdown |
| `src/components/feedback/RateLimitBanner.tsx` | Create | Sticky 429 countdown banner |
| `src/app/(auth)/login/page.tsx` | Create | Login page |
| `src/app/(auth)/layout.tsx` | Create | Unauthenticated layout (centered card) |
| `src/app/(portal)/layout.tsx` | Create | Authenticated layout with header |
| `src/app/(portal)/dashboard/page.tsx` | Create | Placeholder dashboard page |
| `src/middleware.ts` | Create | Next.js middleware for auth redirect |

**Shadcn/ui components to install:**
```bash
npx shadcn@latest add card input button dropdown-menu badge alert skeleton
```

**Covers**: Design wireframes (login, switcher, rate limit banner), SC-003 (< 1s context switch UX), SC-007 (transparent token refresh).

## Testing Strategy

### Backend (Pest)

| Test File | Scope | Key Assertions |
|-----------|-------|----------------|
| `tests/Feature/Api/V2/Auth/LoginTest.php` | Login endpoint | Valid login returns tokens + user; invalid returns 401; rate limited returns 429 |
| `tests/Feature/Api/V2/Auth/RefreshTest.php` | Token refresh | Valid refresh returns new access token; expired/revoked refresh returns 401 |
| `tests/Feature/Api/V2/Auth/LogoutTest.php` | Logout | Tokens revoked; subsequent requests return 401 |
| `tests/Feature/Api/V2/Auth/MeTest.php` | Authenticated user | Returns correct role, organisation, active supplier, available suppliers |
| `tests/Feature/Api/V2/SupplierContext/SwitchTest.php` | Context switching | Org admin can switch; supplier admin cannot switch to other supplier; preference remembered |
| `tests/Feature/Api/V2/SupplierContext/AvailableTest.php` | Available suppliers | Org admin sees all; supplier admin sees only theirs |
| `tests/Feature/Api/V2/Invitations/CreateTest.php` | Create invitation | Org admin can invite at both levels; supplier admin only at supplier level |
| `tests/Feature/Api/V2/Invitations/AcceptTest.php` | Accept invitation | Correct role assigned; correct supplier access scoped |
| `tests/Feature/Api/V2/DataIsolationTest.php` | Cross-supplier leakage | User scoped to Supplier A cannot access Supplier B data via any endpoint |
| `tests/Feature/Api/V2/ResponseFormatTest.php` | JSON envelope | All success responses have `data` key; all errors have `error` key with code + message |
| `tests/Feature/Api/V2/RateLimitTest.php` | Rate limiting | 61st request in 1 minute returns 429 with correct headers |
| `tests/Feature/Api/V2/V1CoexistenceTest.php` | v1 compatibility | Existing v1 endpoints still function after v2 deployment |

### Frontend (React Testing Library + Vitest)

| Test File | Scope | Key Assertions |
|-----------|-------|----------------|
| `src/components/auth/__tests__/LoginForm.test.tsx` | Login form | Renders fields; shows validation on blur; shows error on failed login; shows spinner on submit |
| `src/components/layout/__tests__/SupplierSwitcher.test.tsx` | Supplier switcher | Renders current supplier; shows dropdown; triggers onSwitch; hidden for single supplier |
| `src/components/feedback/__tests__/RateLimitBanner.test.tsx` | Rate limit banner | Shows countdown; auto-dismisses at 0; dismiss button works |
| `src/hooks/__tests__/use-auth.test.ts` | Auth hook | Login sets user state; logout clears state; refresh updates token |
| `src/hooks/__tests__/use-supplier-context.test.ts` | Supplier context hook | Switch updates active supplier; available list populated on auth |

### Integration / E2E

- Playwright tests for login flow end-to-end (login -> dashboard -> switch supplier)
- API contract tests validating response schemas against TypeScript types

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Refresh token rotation race condition (concurrent tabs) | Medium | High | Use database-level locking on refresh token consumption. Invalidate old refresh token only after new one is issued. Grace period of 30 seconds for old tokens. |
| Cross-supplier data leakage | Low | Critical | `EnsureActiveSupplierContext` middleware checks EVERY data endpoint. `SupplierContextScope` global scope on all supplier-scoped models. Dedicated `DataIsolationTest` suite. |
| CORS misconfiguration in production | Low | High | Supplier portal domain added to `config/cors.php` allowed origins. Tested in staging before production. Local dev uses pattern matching for localhost. |
| Token storage security (XSS) | Low | High | Access token in memory only (not localStorage). Refresh token in httpOnly secure cookie. CSP headers configured. |
| Breaking existing v1 API | Low | High | v2 routes are entirely additive. v1 route file untouched. `V1CoexistenceTest` validates v1 continues working. |
| Spatie roles conflict with existing roles | Low | Medium | New supplier portal roles use `sanctum` guard (existing roles use `web` guard). No namespace collision. |
| Performance under 500 concurrent users | Low | Medium | Token auth is stateless — no session storage. Rate limiting prevents abuse. Load testing in staging before launch. |
| Existing `organisation_invitations` table schema conflict | Medium | Medium | Migration adds columns rather than recreating. Existing data preserved. New columns are nullable where needed. |

## Cross-Epic Notes

- **Impersonation**: Supplier impersonation (staff viewing the portal as a supplier for support) is a **staff portal feature only** (SR8). The v2 API and new React frontend do not support impersonation — suppliers authenticate with their own tokens. SR8 fixes the impersonation target resolution bug in the existing Vue/Inertia staff portal.
- **Zoho CRM sync**: Supplier profile changes via v2 API dispatch `SyncSupplierToZohoJob` (same as legacy actions). The `ShouldBeUnique` constraint on supplier ID prevents duplicate sync during the parallel-running period. See SR9.
- **Elasticsearch search**: The Scout search index is updated independently from Zoho. Both are triggered by supplier profile changes but are separate data sinks. See SR9.

## Next Steps

1. Run `/speckit-tasks` to generate tasks.md with granular implementation tickets
2. Run `/trilogy-linear-sync push docs` to sync plan to Linear
3. Install Scribe package and configure for v2 endpoints
4. Scaffold the Next.js supplier-portal project structure (if not already done)
5. Create the `SupplierPortalV2` Pennant feature flag
