---
title: "Implementation Plan: Assessments & Products"
---

# Implementation Plan: Assessments & Products

**Branch**: `sr6-assessments-products` | **Date**: 2026-03-19
**Spec**: [spec.md](/initiatives/Supplier-REDONE/SR6-Assessments-Products/spec.md)
**Dependencies**: SR0 (API Foundation & Two-Tier Auth), SR4 (Billing & Invoicing)
**Status**: Draft

## Summary

Build the assessment-to-product-to-payment chain for the Supplier REDONE portal. Care Partners create assessments (clinical justifications) linked to clients, which authorise product procurement through a mandatory 3-way linkage (assessment + budget + supplier). Suppliers discover product categories via their price list, and submit bills against pre-authorised Product records. A new `product_categories` lookup table enforces the ten S@H categories as a shared taxonomy across assessments, supplier capabilities, and billing validation.

**Two codebases**: Laravel 12 API (tc-portal) serves endpoints consumed by a Next.js 16 React frontend (supplier-portal). The Laravel side also serves the existing Vue/Inertia staff portal for Care Partner and Coordinator views.

---

## Technical Context

### Technology Stack

| Layer | Technology | Version | Repository |
|-------|------------|---------|------------|
| Backend API | Laravel | 12 | tc-portal |
| PHP | PHP | 8.4 | tc-portal |
| Staff Frontend | Vue 3 + Inertia.js v2 | v3 / v2 | tc-portal |
| Supplier Frontend | Next.js + React | 16 / 19 | supplier-portal |
| UI Components (Supplier) | shadcn/ui + Tailwind | v4 / v4 | supplier-portal |
| UI Components (Staff) | Common components + Tailwind | v3 | tc-portal |
| Database | MySQL | 8.x | tc-portal |
| Testing (Backend) | Pest | v3 | tc-portal |
| Queue | Laravel Horizon | v5 | tc-portal |
| Admin | Laravel Nova | v5 | tc-portal |

### Dependencies

**SR0 (API Foundation)**:
- API v2 versioned endpoint structure (`/api/v2/`)
- Two-tier auth: Organisation Administrator / Supplier-level roles
- Sanctum token auth with supplier context switching
- Standard JSON envelope response format

**SR4 (Billing & Invoicing)**:
- Bill model and submission workflow (`App\Models\Bill\Bill`)
- Bill validation pipeline (budget checks, supplier verification)
- `BillStageEnum` status workflow
- Bill-to-supplier relationship (`bills.supplier_id`)

**Existing Systems**:
- `Domain\Supplier\Models\Supplier` — Supplier entity (product registration target)
- `App\Models\AdminModels\ServiceCategory` — Existing 8 service categories (NOT reused for products — see CLR-001)
- `App\Models\PackageBudgetItem` — Budget line items for 3-way linkage
- `Domain\Package\Models\Package` — Client packages (assessment linked via package)
- `Domain\Organisation\Models\OrganisationPrice` — Supplier pricing (product category registration derives from this)
- Activity log via `spatie/activitylog` — Used for audit trails on all new models

### Constraints

**Performance**:
- Supplier product discovery filtered by category: < 2 seconds (SC-005)
- Product status visible on client assessment record: < 1 second page load (SC-007)
- Assessment creation: < 3 minutes end-to-end (SC-001)

**Security**:
- Suppliers see only linked assessment summaries, never full clinical records (CLR-002)
- All endpoints scoped to supplier context via SR0 middleware
- Budget amounts never exposed to supplier-facing APIs
- Assessment data classified as clinical — authorisation via policies

**Compliance**:
- 100% of product bills must have linked assessment, budget, and supplier category (SC-002/003/004)
- Every status transition must be auditable with who/when/why (SC-006)
- Assessment auto-expiry enforced at system level, not user discipline (SC-009)

---

## Design Decisions

### Data Model

#### New Tables

**`product_categories`** — Ten S@H product categories (CLR-001: separate from `service_categories`)

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| `id` | bigint unsigned | No | PK |
| `name` | varchar(100) | No | Category display name |
| `slug` | varchar(100) | No | URL-safe identifier, unique |
| `description` | text | Yes | Category description |
| `sort_order` | int | No | Display ordering |
| `is_active` | boolean | No | Soft toggle for admin, default true |
| `created_at` | timestamp | No | |
| `updated_at` | timestamp | No | |

Seeded with: Assistive Technology, Nursing consumables, Home maintenance (product-only), Home modifications (project-based, SR7), Nutrition, Mobility, Domestic life, Managing body functions, Self-care, Communication & information management. **Note**: "Home maintenance" and "Home modifications" are distinct categories — home maintenance covers products/consumables, while home modifications covers project-based structural work managed through the SR7 lifecycle.

**`assessments`** — Clinical evaluation records linked to clients

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| `id` | bigint unsigned | No | PK |
| `package_id` | bigint unsigned | No | FK to `packages` (client link) |
| `product_category_id` | bigint unsigned | No | FK to `product_categories` |
| `status` | varchar(20) | No | Enum-backed: new, under_review, approved, actioned, expired, cancelled |
| `purpose` | text | No | Clinical purpose / reason for assessment |
| `recommendation` | text | No | Assessor's recommendation |
| `assessor_name` | varchar(255) | Yes | Name of the external assessor |
| `assessor_organisation` | varchar(255) | Yes | Organisation of the assessor |
| `assessed_at` | date | No | Date the assessment was conducted |
| `approved_at` | timestamp | Yes | Set when status transitions to approved |
| `expires_at` | timestamp | Yes | Calculated: approved_at + global validity period |
| `cancelled_at` | timestamp | Yes | Set when status transitions to cancelled |
| `cancellation_reason` | text | Yes | Required when cancelling |
| `created_by` | bigint unsigned | No | FK to `users` (Care Partner who created) |
| `updated_by` | bigint unsigned | Yes | FK to `users` (last user to modify) |
| `created_at` | timestamp | No | |
| `updated_at` | timestamp | No | |
| `deleted_at` | timestamp | Yes | Soft delete |

Indexes: `(package_id, status)`, `(product_category_id)`, `(status, expires_at)` for expiry job, `(created_by)`.

**`products`** — Purchase authorisation records (CLR-003: pre-created by Care Partner)

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| `id` | bigint unsigned | No | PK |
| `assessment_id` | bigint unsigned | No | FK to `assessments` |
| `supplier_id` | bigint unsigned | No | FK to `suppliers` (CLR-004: entity level) |
| `product_category_id` | bigint unsigned | No | FK to `product_categories` (must match assessment category) |
| `package_budget_item_id` | bigint unsigned | No | FK to `package_budget_items` (budget linkage) |
| `status` | varchar(30) | No | Enum-backed: approved_pending, bill_received, paid, rejected |
| `description` | text | Yes | Product description / what is being procured |
| `quoted_amount` | bigint | Yes | Expected cost in cents (for variance detection FR-016) |
| `rejection_reason` | text | Yes | Required when rejecting |
| `rejected_at` | timestamp | Yes | Set when status transitions to rejected |
| `created_by` | bigint unsigned | No | FK to `users` (Care Partner who authorised) |
| `created_at` | timestamp | No | |
| `updated_at` | timestamp | No | |
| `deleted_at` | timestamp | Yes | Soft delete |

Indexes: `(assessment_id)`, `(supplier_id, status)`, `(package_budget_item_id)`.

**`supplier_product_categories`** — Pivot: which product categories a supplier is registered for

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| `id` | bigint unsigned | No | PK |
| `supplier_id` | bigint unsigned | No | FK to `suppliers` |
| `product_category_id` | bigint unsigned | No | FK to `product_categories` |
| `created_at` | timestamp | No | |
| `updated_at` | timestamp | No | |

Unique constraint: `(supplier_id, product_category_id)`.

**`bill_product`** — Links a bill to the product record it is billing against

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| `id` | bigint unsigned | No | PK |
| `bill_id` | bigint unsigned | No | FK to `bills`, unique (one bill per product) |
| `product_id` | bigint unsigned | No | FK to `products` |
| `created_at` | timestamp | No | |

#### Modified Tables

**`bills`** — No schema change. The `bill_product` join table links bills to products. Bill validation pipeline (SR4) extended with product linkage checks.

#### Relationship Map

```
Package (client) ──1:N──> Assessment ──1:N──> Product
                                                  │
                                    ┌──────────────┤
                                    ▼              ▼
                               Supplier    PackageBudgetItem
                                    │
                              SupplierProductCategory
                                    │
                              ProductCategory
                                    ▲
                                    │
                               Assessment
```

- `Assessment` belongsTo `Package`, `ProductCategory`; hasMany `Product`
- `Product` belongsTo `Assessment`, `Supplier`, `ProductCategory`, `PackageBudgetItem`; hasOne `BillProduct`
- `Supplier` belongsToMany `ProductCategory` (via `supplier_product_categories`); hasMany `Product`
- `Bill` hasOne `BillProduct`; through that, belongsTo `Product`

### Configuration

**Assessment validity period** (CLR-005): Single global default of 365 days, stored in a `support-at-home` config key with Nova-manageable override. Implementation:

```php
// config/support-at-home.php
'assessment_validity_days' => env('ASSESSMENT_VALIDITY_DAYS', 365),
```

Nova Settings tool allows admin override. The `expires_at` is calculated on approval: `$assessment->approved_at->addDays(config('support-at-home.assessment_validity_days'))`.

### API Versioning

All new endpoints under `/api/v2/` following SR0 conventions. Two audience scopes:

1. **Staff API** (Care Partners, Coordinators) — Full assessment CRUD, product creation, reporting
2. **Supplier API** (Supplier users) — Read-only linked assessment summaries, bill submission against products

---

## Implementation Phases

### Phase 0: Foundation — Product Categories & Data Model

**Migrations**:
- `create_product_categories_table` — Schema only
- `create_assessments_table` — Schema only
- `create_products_table` — Schema only
- `create_supplier_product_categories_table` — Schema only
- `create_bill_product_table` — Schema only

**Seeder**: `ProductCategorySeeder` — Seeds the ten S@H categories.

**Models** (all in `domain/` following existing convention):

- `Domain\Assessment\Models\Assessment`
- `Domain\Assessment\Models\Product`
- `Domain\Assessment\Models\ProductCategory`
- `Domain\Assessment\Models\BillProduct`

New domain directory: `domain/Assessment/` with subdirectories: `Models/`, `Actions/`, `Data/`, `Enums/`, `Policies/`, `Tables/`, `Tests/`, `Http/`, `Routes/`.

**Enums**:
- `Domain\Assessment\Enums\AssessmentStatusEnum` — NEW, UNDER_REVIEW, APPROVED, ACTIONED, EXPIRED, CANCELLED
- `Domain\Assessment\Enums\ProductStatusEnum` — APPROVED_PENDING, BILL_RECEIVED, PAID, REJECTED

Both enums include a `toData(): EnumData` method returning `{ label, colour }` for badge rendering, and a `allowedTransitions(): array` method encoding the state machine.

**Pivot extension on Supplier model**: Add `productCategories()` belongsToMany relationship to `Domain\Supplier\Models\Supplier`.

**Nova Resources**:
- `App\Nova\ProductCategory` — CRUD for the ten categories (admin-manageable per CLR-005)
- `App\Nova\Assessment` — Read-only overview for admin visibility
- `App\Nova\Product` — Read-only overview for admin visibility

### Phase 1: Assessment CRUD (Staff Portal — Vue/Inertia)

**Actions** (Lorisleiva `AsAction`):
- `Domain\Assessment\Actions\CreateAssessmentAction` — Creates assessment with status NEW, audit trail entry. `authorize()` checks user can manage assessments for the package.
- `Domain\Assessment\Actions\TransitionAssessmentStatusAction` — Validates allowed transitions, records who/when/why. Calculates `expires_at` on approval. `authorize()` checks role-based transition permissions.
- `Domain\Assessment\Actions\CancelAssessmentAction` — Requires cancellation reason. Removes pending product linkages (FR-003 AC5). `authorize()` checks user can cancel.

**Data Classes** (anemic, validation only):
- `Domain\Assessment\Data\CreateAssessmentData` — package_id, product_category_id, purpose, recommendation, assessor_name, assessor_organisation, assessed_at
- `Domain\Assessment\Data\TransitionAssessmentData` — status (target), reason (optional, required for cancellation)
- `Domain\Assessment\Data\AssessmentData` — Read DTO for API responses / Inertia props

**Policy**: `Domain\Assessment\Policies\AssessmentPolicy` — Registered in `AuthServiceProvider`. Methods: `viewAny`, `view`, `create`, `transition`, `cancel`. Uses `Response::allow()` / `Response::deny('reason')`.

**API Endpoints (Staff)**:

| Method | URI | Action | Description |
|--------|-----|--------|-------------|
| GET | `/api/v2/packages/{package}/assessments` | `ListAssessmentsAction` | List assessments for a client package |
| POST | `/api/v2/packages/{package}/assessments` | `CreateAssessmentAction` | Create assessment |
| GET | `/api/v2/assessments/{assessment}` | `ShowAssessmentAction` | Show assessment detail |
| PATCH | `/api/v2/assessments/{assessment}/transition` | `TransitionAssessmentStatusAction` | Transition status |
| POST | `/api/v2/assessments/{assessment}/cancel` | `CancelAssessmentAction` | Cancel with reason |

**Inertia Pages (Staff Portal — tc-portal)**:

Assessment views are embedded within the client Package context (existing pattern).

#### AssessmentIndex.vue
- **Location**: `resources/js/Pages/Packages/Assessments/Index.vue`
- Props: `defineProps<Props>()` with named type:
  - `package: PackageData`
  - `assessments: AssessmentData[]`
- Common components reused: `CommonTable`, `CommonBadge`, `CommonButton`
- Sub-components: None needed — table-driven view

#### AssessmentCreate.vue
- **Location**: `resources/js/Pages/Packages/Assessments/Create.vue`
- Props: `defineProps<Props>()` with named type:
  - `package: PackageData`
  - `productCategories: ProductCategoryData[]`
- Form state: Single `useForm` with all fields (purpose, recommendation, product_category_id, assessor_name, assessor_organisation, assessed_at)
- Step validation: Single-step form, Zod schema for client-side pre-flight
- Common components reused: `CommonSelectMenu` (with `value-key="value"` for category), `CommonTextarea`, `CommonInput`, `CommonDatePicker`, `CommonButton`
- Emits: None (form submission via Inertia)

#### AssessmentShow.vue
- **Location**: `resources/js/Pages/Packages/Assessments/Show.vue`
- Props: `defineProps<Props>()` with named type:
  - `assessment: AssessmentDetailData` (includes products, status history)
  - `package: PackageData`
  - `canTransition: boolean`
  - `allowedTransitions: AssessmentStatusEnum[]`
- Common components reused: `CommonBadge`, `CommonButton`, `CommonDefinitionList`, `CommonDefinitionItem` (with `title` prop)
- Sub-components:
  - Directory: `resources/js/Pages/Packages/Assessments/Show/`
  - `AssessmentShow.vue` — Parent: owns data, orchestrates
  - `Details.vue` — Renders assessment fields (category, purpose, recommendation, assessor)
  - `StatusActions.vue` — Renders transition buttons based on `allowedTransitions`
  - `ProductList.vue` — Renders linked products table with status badges

#### AssessmentTable (Backend)
- **Location**: `domain/Assessment/Tables/AssessmentTable.php` extends `BaseTable`
- Resource query: `Assessment::query()->with('productCategory', 'createdBy')->where('package_id', $packageId)`
- Columns: `TextColumn` (assessor), `BadgeColumn` (status, category), `DateColumn` (assessed_at, expires_at)
- Filters: `BadgeFilter` (status), `SetFilter` (product_category_id)
- Actions: View (route to show page)
- Transforms: Status and category via `.toData()` in `transformModel()`

### Phase 2: Product Creation & 3-Way Linkage (Staff Portal)

**Actions**:
- `Domain\Assessment\Actions\CreateProductAction` — Pre-creates product record (CLR-003). Validates: assessment is approved, supplier is registered for category, budget item has sufficient funds. Sets status APPROVED_PENDING. `authorize()` checks user can create products for this assessment.
- `Domain\Assessment\Actions\RejectProductAction` — Transitions to REJECTED, releases budget allocation (FR-012). `authorize()` checks coordinator/admin role.

**Data Classes**:
- `Domain\Assessment\Data\CreateProductData` — assessment_id, supplier_id, product_category_id, package_budget_item_id, description, quoted_amount
- `Domain\Assessment\Data\ProductData` — Read DTO

**Policy**: `Domain\Assessment\Policies\ProductPolicy` — `viewAny`, `view`, `create`, `reject`.

**Validation Rules** (in `CreateProductAction.handle()`):
1. Assessment must be in APPROVED status and not expired
2. `product_category_id` must match `assessment.product_category_id`
3. Supplier must have matching entry in `supplier_product_categories`
4. Budget item must have sufficient remaining balance

**API Endpoints (Staff)**:

| Method | URI | Action | Description |
|--------|-----|--------|-------------|
| GET | `/api/v2/assessments/{assessment}/products` | `ListProductsAction` | List products for assessment |
| POST | `/api/v2/assessments/{assessment}/products` | `CreateProductAction` | Create product (purchase auth) |
| GET | `/api/v2/products/{product}` | `ShowProductAction` | Show product detail |
| POST | `/api/v2/products/{product}/reject` | `RejectProductAction` | Reject with reason |

**Inertia Pages (Staff Portal)**:

#### ProductCreate.vue
- **Location**: `resources/js/Pages/Packages/Assessments/Products/Create.vue`
- Props: `defineProps<Props>()` with named type:
  - `assessment: AssessmentData`
  - `suppliers: SupplierOptionData[]` (filtered by category registration)
  - `budgetItems: BudgetItemOptionData[]` (with remaining balance)
- Form state: Single `useForm` (supplier_id, package_budget_item_id, description, quoted_amount)
- Common components reused: `CommonSelectMenu`, `CommonTextarea`, `CommonInput`, `CommonButton`
- Validation: Zod pre-flight for required fields; server-side for business rules (budget sufficiency, supplier registration)

### Phase 3: Supplier Product Discovery (Supplier Portal — Next.js)

**Backend**:

When a supplier's price list includes product-related service categories, the system syncs entries into `supplier_product_categories`. This is handled by a new action triggered when price list data is saved (SR3 integration point):

- `Domain\Assessment\Actions\SyncSupplierProductCategoriesAction` — Reads supplier's price list entries, maps service categories to product categories where applicable, and upserts `supplier_product_categories`. Uses `AsAction`.

**API Endpoints (Supplier)**:

| Method | URI | Action | Description |
|--------|-----|--------|-------------|
| GET | `/api/v2/supplier/product-categories` | `ListSupplierProductCategoriesAction` | Product categories for current supplier context |
| GET | `/api/v2/supplier/products` | `ListSupplierProductsAction` | Products linked to this supplier |
| GET | `/api/v2/supplier/products/{product}` | `ShowSupplierProductAction` | Product detail with assessment summary |

**Supplier API Response** (assessment summary per CLR-002 — no full clinical data):

```json
{
  "data": {
    "id": 1,
    "assessment_summary": {
      "category": "Assistive Technology",
      "assessed_at": "2026-01-15",
      "status": "approved",
      "recommendation_summary": "Motorised wheelchair recommended for indoor mobility"
    },
    "status": "approved_pending",
    "description": "Motorised wheelchair — indoor model",
    "quoted_amount": 450000
  }
}
```

**Next.js Pages (Supplier Portal)**:

#### Products Tab (conditionally rendered)
- **Location**: `src/app/(portal)/products/page.tsx`
- Server component fetches `/api/v2/supplier/product-categories` — if empty array, redirect or hide tab
- Renders product category cards and linked products table
- Uses shadcn `Table`, `Badge`, `Card` components

#### Product Detail
- **Location**: `src/app/(portal)/products/[id]/page.tsx`
- Server component fetches `/api/v2/supplier/products/{id}`
- Displays assessment summary (limited fields per CLR-002), product status, billing status
- Uses shadcn `Card`, `Badge`, `Separator`, `Button`

**Staff Portal — Supplier Discovery**:

- `Domain\Assessment\Actions\SearchSuppliersForCategoryAction` — Queries suppliers with matching product category registration. Returns supplier name, locations, pricing. Uses `AsAction`.

**API Endpoint (Staff)**:

| Method | URI | Action | Description |
|--------|-----|--------|-------------|
| GET | `/api/v2/product-categories/{category}/suppliers` | `SearchSuppliersForCategoryAction` | Suppliers registered for a product category |

### Phase 4: Bill Validation — Mandatory 3-Way Linkage

**Integration with SR4 billing pipeline**:

Extend the existing bill validation flow with product linkage checks. This is NOT a new controller — it hooks into SR4's bill submission validation.

- `Domain\Assessment\Actions\ValidateProductBillLinkageAction` — Called during bill submission. Validates:
  1. Bill has a linked product (via `bill_product`) — if no product linked, reject: "A linked assessment is required"
  2. Product's assessment is approved and not expired — if expired/cancelled, reject: "The assessment is no longer valid"
  3. Product's budget item has sufficient balance — if insufficient, reject: "A linked budget is required"
  4. Billing supplier matches product's supplier — if mismatch, reject: "Supplier is not approved for this product category"
  5. Billed amount vs quoted amount variance check (FR-016) — if exceeds, flag for coordinator review (not auto-reject)

- `Domain\Assessment\Actions\TransitionProductOnBillEventAction` — Listens for bill status changes:
  - Bill submitted → Product status → BILL_RECEIVED
  - Bill paid → Product status → PAID
  - Bill rejected → Product status remains (bill rejection != product rejection)

**Supplier Bill Submission Extension**:

The supplier's bill creation form (SR4) gains a required "Product" select field when the bill is for a product category. The supplier selects from their assigned Product records (status: APPROVED_PENDING).

**API Endpoint (Supplier)**:

| Method | URI | Action | Description |
|--------|-----|--------|-------------|
| GET | `/api/v2/supplier/products/billable` | `ListBillableProductsAction` | Products in APPROVED_PENDING status for current supplier |

### Phase 5: Auto-Expiry

**Scheduled Job**:
- `Domain\Assessment\Jobs\ExpireAssessmentsJob` — Runs daily via scheduler. Queries `assessments` where `status = 'approved'` and `expires_at <= now()`. Transitions each to EXPIRED with system audit trail entry.

Registered in `app/Console/Kernel.php`:
```php
$schedule->job(new ExpireAssessmentsJob)->dailyAt('02:00');
```

**Edge case handling**:
- Products in APPROVED_PENDING linked to an expiring assessment: Status remains APPROVED_PENDING but the product can no longer be billed against (validation catches this in Phase 4)
- Products in BILL_RECEIVED: Continue processing (FR-017) — the expiry job does NOT touch products with in-progress bills

### Phase 6: Reporting

**Table Class**: `Domain\Assessment\Tables\AssessmentReportTable` extends `BaseTable`
- Resource query: `Assessment::query()->with('products.supplier', 'products.packageBudgetItem', 'package.client', 'productCategory')`
- Columns: `TextColumn` (client name, supplier name), `BadgeColumn` (assessment status, product status), `DateColumn` (assessed_at, approved_at, expires_at), `NumericColumn` (quoted amount, billed amount)
- Filters: `SetFilter` (product_category_id, assessment status, product status), `DateFilter` (assessed_at range), `TextFilter` (client name, supplier name)
- Exports: CSV via `$this->defaultCsvExport()`
- Transforms: Money via `Money::from()`, enums via `.toData()`, dates formatted in `transformModel()`

**Inertia Page (Staff Portal)**:

#### AssessmentReport.vue
- **Location**: `resources/js/Pages/Reports/AssessmentReport.vue`
- Props: `defineProps<Props>()` with named type:
  - `table: AssessmentReportTableData`
- Common components reused: `CommonTable`
- No decomposition needed — single `CommonTable` with custom cell slots for badges

**API Endpoint (Staff)**:

| Method | URI | Action | Description |
|--------|-----|--------|-------------|
| GET | `/api/v2/reports/assessments` | Inertia render | Assessment-to-product-to-payment report |

---

## Shared Types

### Staff Portal (Vue/Inertia) — `resources/js/types/`

**`resources/js/types/Assessment/assessment.ts`**:
- `AssessmentStatusEnum` — Union type matching backend enum values
- `ProductStatusEnum` — Union type matching backend enum values
- `ProductCategoryData` — `{ id: number; name: string; slug: string }`
- `AssessmentData` — `{ id: number; packageId: number; productCategory: ProductCategoryData; status: AssessmentStatusEnum; purpose: string; recommendation: string; assessorName: string | null; assessedAt: string; expiresAt: string | null; createdBy: { id: number; name: string } }`
- `AssessmentDetailData` — Extends `AssessmentData` with `products: ProductData[]`, `allowedTransitions: AssessmentStatusEnum[]`
- `ProductData` — `{ id: number; assessmentId: number; supplierId: number; supplierName: string; productCategory: ProductCategoryData; status: ProductStatusEnum; description: string | null; quotedAmount: number | null; budgetItemName: string }`

**`resources/js/types/Assessment/forms.ts`**:
- `CreateAssessmentForm` — Shape matching `useForm` fields
- `CreateProductForm` — Shape matching `useForm` fields
- `SupplierOptionData` — `{ id: number; name: string; locations: string[] }`
- `BudgetItemOptionData` — `{ id: number; name: string; remainingBalance: number }`

### Supplier Portal (Next.js) — `src/types/`

**`src/types/assessment.ts`**:
- `ProductCategory` — `{ id: number; name: string; slug: string }`
- `AssessmentSummary` — `{ category: string; assessedAt: string; status: string; recommendationSummary: string }` (limited per CLR-002)
- `Product` — `{ id: number; assessmentSummary: AssessmentSummary; status: ProductStatusEnum; description: string | null; quotedAmount: number | null }`
- `ProductStatusEnum` — Union type

---

## Feature Flag

**Flag**: `sr6-assessments-products` (Laravel Pennant)

**Backend gating**:
- Route middleware `check.feature.flag:sr6-assessments-products` on all assessment/product API routes
- Conditionally include product validation in SR4 bill submission pipeline

**Staff Frontend gating**:
- `HasFeatureFlag` component wrapping Assessment tab in Package navigation
- Sidebar/nav conditionally rendered

**Supplier Frontend gating**:
- API returns empty product categories when flag is off → Products tab does not render

---

## Testing Approach

### Backend (Pest)

**Feature Tests** — one test file per action:

| Test File | Key Scenarios |
|-----------|---------------|
| `CreateAssessmentActionTest` | Happy path, missing fields, unauthorised user, invalid category |
| `TransitionAssessmentStatusActionTest` | Each valid transition, invalid transitions, audit trail recorded, expires_at calculated on approval |
| `CancelAssessmentActionTest` | Cancel with reason, cancel without reason (fails), pending products removed |
| `CreateProductActionTest` | Happy path with 3-way linkage, expired assessment (fails), unregistered supplier (fails), insufficient budget (fails), category mismatch (fails) |
| `RejectProductActionTest` | Reject with reason, budget released |
| `ValidateProductBillLinkageActionTest` | All 5 validation rules individually, variance flagging |
| `TransitionProductOnBillEventActionTest` | Bill submitted → BILL_RECEIVED, Bill paid → PAID |
| `ExpireAssessmentsJobTest` | Expires overdue assessments, skips non-approved, skips future expiry, preserves in-progress bills |
| `SyncSupplierProductCategoriesActionTest` | Syncs from price list, removes when category removed |
| `SearchSuppliersForCategoryActionTest` | Returns only registered suppliers, excludes inactive |

**Policy Tests**:
- `AssessmentPolicyTest` — Care Partner can create, Coordinator can transition, Supplier cannot access
- `ProductPolicyTest` — Care Partner can create, Coordinator can reject

**Unit Tests**:
- `AssessmentStatusEnumTest` — Allowed transitions for each status
- `ProductStatusEnumTest` — Allowed transitions for each status

### Frontend (Staff — Vue)

Manual verification via browser testing (standard Inertia pattern). Assessment creation form, status transitions, product creation with supplier/budget selection.

### Frontend (Supplier — Next.js)

Manual verification: Products tab visibility based on category registration, product list, assessment summary display (verify no full clinical data exposed).

---

## Risk Areas

| Risk | Mitigation |
|------|------------|
| **Product category mapping to service categories** | SR3 price list may not have a clean 1:1 mapping to S@H product categories. `SyncSupplierProductCategoriesAction` needs a configurable mapping table (seeded). |
| **Budget sufficiency check race condition** | Two Care Partners creating products against the same budget item simultaneously. Use database-level locking (`lockForUpdate()`) in `CreateProductAction`. |
| **Assessment expiry during bill processing** | Edge case explicitly handled: FR-017 says in-progress bills continue. `ExpireAssessmentsJob` checks for linked products with BILL_RECEIVED status before expiring. |
| **Supplier portal API versioning** | SR0 must be stable before SR6 supplier-facing endpoints are built. Phase 3 depends on SR0 auth middleware being available. |
| **Variance flagging UX** | FR-016 flags amount variance but does not auto-reject. Need clear coordinator review UI. Defer detailed UX to design phase — backend captures the flag. |

---

## Rollback Strategy

- All new tables behind migrations — rollback drops tables cleanly
- Feature flag `sr6-assessments-products` disables all routes and UI
- No modifications to existing `bills` table schema — linkage is via separate `bill_product` join table
- No modifications to existing `ServiceCategory` model — completely separate taxonomy
- SR4 bill validation extension is conditional on feature flag — existing bills unaffected when flag is off

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
- [x] DTO persistence explicit (no ->toArray() into ORM)

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
- [x] No hardcoded business logic in Vue (backend-powered, dynamic)
- [x] Cross-platform reusability (Vue, React Native, API) — same API serves Vue staff portal and React supplier portal
- [x] Laravel Data for validation (no Request in controllers)
- [x] Model route binding (no int $id parameters)
- [x] No magic numbers/IDs (using Model constants for category IDs, enum classes for statuses)
- [x] Common components pure (zero hardcoded logic)
- [x] Use Lorisleiva Actions (with AsAction trait, not custom classes)
- [x] Action authorization in `authorize()` method (not in `handle()` or `asController()`)
- [x] Data classes remain anemic (no business logic in DTOs)
- [x] Migrations schema-only (data ops use Seeders)
- [x] Models have single responsibility (Assessment, Product, ProductCategory each own one concept)
- [x] Granular model policies (AssessmentPolicy, ProductPolicy — one per model, scoped permissions)
- [x] Response objects in auth (`Response::allow()` / `Response::deny('reason')`, no bare bool)
- [x] Event sourcing: N/A — this epic uses standard Eloquent with activity log, not event sourcing
- [x] Semantic column documentation (lifecycle columns `approved_at`, `expires_at`, `cancelled_at` documented in PHPDoc)
- [x] Feature flags dual-gated (backend route middleware + frontend conditional rendering)

### React TypeScript Standards (Section 6 — Supplier Portal)
- [x] All new components use TypeScript (`.tsx` files, strict mode)
- [x] Props use TypeScript types (standard React `type Props = { ... }` pattern)
- [x] No `any` types planned — backend data shapes have TypeScript types in `src/types/assessment.ts`
- [x] Shared types identified (`src/types/assessment.ts` for supplier portal)
- [x] shadcn/ui components reused (Table, Badge, Card, Button, Separator — no bespoke duplicates)
- [x] New components assessed: Products tab page and Product detail page are feature-specific, not general-purpose UI patterns
- [x] Server components for data fetching, client components only where interactivity needed

### Vue TypeScript Standards (Section 6 — Staff Portal)
- [x] All new/modified Vue components planned with `<script setup lang="ts">`
- [x] Props use named `type` (`type Props = { ... }` with `defineProps<Props>()`)
- [x] Emits use named `type` (`type Emits = { ... }` with `defineEmits<Emits>()`) where applicable
- [x] No `any` types planned — backend data shapes have TypeScript types
- [x] Shared types identified (`resources/js/types/Assessment/assessment.ts` and `forms.ts`)
- [x] Common components audited (CommonTable, CommonBadge, CommonButton, CommonSelectMenu, CommonTextarea, CommonInput, CommonDatePicker, CommonDefinitionList, CommonDefinitionItem reused)
- [x] New components assessed for common eligibility (all new components are feature-specific — no general-purpose UI patterns created)
- [x] Multi-step wizards: N/A — single-step forms with `useForm`
- [x] Composition over configuration (slots used for CommonTable cell rendering, no boolean prop branching)
- [x] Composables: N/A — no reusable reactive logic needed beyond what Inertia provides
- [x] Primitives are single-responsibility (Details, StatusActions, ProductList sub-components)
- [x] Consumer controls layout (parent AssessmentShow orchestrates sub-components)
- [x] Pinia stores: None proposed (all state via Inertia props and `useForm`)
- [x] Type declarations for untyped deps: N/A — no untyped JS imports

### Component Decomposition (Section 7)
- [x] AssessmentShow decomposed into Details, StatusActions, ProductList sub-components
- [x] Each sub-component has single concern
- [x] Parent owns logic (AssessmentShow handles data, orchestrates)
- [x] Directory structure defined (`resources/js/Pages/Packages/Assessments/Show/`)
- [x] Naming is simple (no parent prefix on sub-components)

### Data Tables (Section 12)
- [x] CommonTable used for assessment list and report
- [x] BaseTable extended (`AssessmentTable`, `AssessmentReportTable`)
- [x] Columns typed correctly (BadgeColumn for status/category, DateColumn for dates)
- [x] Transforms in `transformModel()` (enums via `.toData()`, dates formatted)
- [x] Filters server-side (BadgeFilter, SetFilter, DateFilter, TextFilter)
- [x] Actions use named routes

**Ready to Implement**: YES
