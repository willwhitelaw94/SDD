---
title: "Implementation Plan: Staff Admin Portal"
---

# Implementation Plan: Staff Admin Portal

**Branch**: `sr8-staff-admin-portal` | **Date**: 2026-03-19 | **Spec**: [spec.md](/initiatives/supplier-redone/sr8-staff-admin-portal/spec)
**Input**: Feature specification from `.tc-docs/content/initiatives/Supplier-REDONE/SR8-Staff-Admin-Portal/spec.md`

## Summary

Enhance the existing tc-portal staff supplier views with three critical fixes (Phase A) and three quality-of-life improvements (Phase B). Phase A fixes a production impersonation bug (404 when supplier owner is deactivated), adds an organisation hierarchy card to the Overview tab showing sibling suppliers under the same ABN, and surfaces role labels (Organisation Administrator, Supplier Administrator, Team Member) on the Team tab. Phase B extends the existing pending suppliers page with unified approval queue filtering, adds organisation context to stage transitions, and groups search results by ABN. All work modifies existing Laravel + Vue/Inertia code — no new app, no new domain.

## Technical Context

**Language/Version**: PHP 8.3 (Laravel 12), TypeScript (Vue 3)
**Primary Dependencies**: Inertia.js v2, Lorisleiva Actions, Laravel Data, Spatie Roles/Permissions, InertiaUI Table (BaseTable/CommonTable)
**Storage**: MySQL
**Testing**: Pest v3 (unit + feature)
**Target Platform**: Web (desktop, staff-only views)
**Constraints**: No SR0 hard dependency for Phase A. Organisation model and `suppliers()` relationship already exist. No new domain directories — all changes within existing `domain/Supplier/`, `domain/Organisation/`, `domain/Shared/`, and `domain/User/` structures.
**Scale/Scope**: ~500 suppliers, ~50 organisations, ~10 staff users. Low-volume operations.

## Project Structure

### Documentation (this feature)

```text
.tc-docs/content/initiatives/Supplier-REDONE/SR8-Staff-Admin-Portal/
├── idea-brief.md        # Problem statement and RACI
├── business.md          # Business outcomes and metrics
├── design.md            # Design brief
├── spec.md              # Feature specification (Gate 1 passed)
└── plan.md              # This file (Gate 3)
```

### Source Code Changes (repository root)

```text
# Backend — Modified Files
domain/Shared/Actions/User/GetRedirectUrlForImpersonateUserAction.php  # US1: Fix redirect logic
domain/User/Http/Controllers/UserController.php                        # US1: Fix impersonation target
domain/Supplier/Services/SupplierService.php                           # US2: Add org hierarchy data to overview tab
domain/Supplier/Http/Controllers/StaffSupplierController.php           # US2: Pass org data, US6: stage context
domain/Supplier/Tables/StaffSuppliersTable.php                         # US7: Add org name column + filter
domain/Supplier/Tables/StaffSuppliersPendingTable.php                  # US4: Add type filter support

# Backend — New Files
domain/Supplier/Actions/ResolveImpersonationTargetAction.php    # US1: Active admin selection logic
domain/Supplier/Data/SiblingSupplierData.php                    # US2: Sibling supplier DTO
domain/Supplier/Data/OrganisationHierarchyData.php              # US2: Org hierarchy DTO
domain/Supplier/Data/StaffSupplierRoleData.php                  # US3: Role label DTO

# Frontend — Modified Files
resources/js/Components/Staff/Supplier/SupplierSidebar.vue             # US1: Use resolved target
resources/js/Pages/Staff/Suppliers/tabs/SupplierOverview.vue           # US2: Add org hierarchy card
resources/js/Pages/Staff/Suppliers/tabs/Partials/SupplierOverview.vue  # US2: Render org card
resources/js/Pages/Staff/Suppliers/tabs/SupplierTeam.vue               # US3: Role labels
resources/js/Pages/Staff/Suppliers/Index.vue                           # US7: Org name in table

# Frontend — New Files
resources/js/Pages/Staff/Suppliers/tabs/Partials/OrganisationHierarchy/ # US2: New card directory
├── OrganisationHierarchyCard.vue                                       # Parent: owns layout
├── SiblingSupplierRow.vue                                              # Sub-component: single sibling row
└── ComplianceBadge.vue                                                 # Sub-component: compliance status badge
resources/js/types/Suppliers/staffSupplier.ts                           # Shared types for staff supplier views

# Tests — New Files
tests/Feature/Supplier/Actions/ResolveImpersonationTargetActionTest.php
tests/Feature/Supplier/Http/Controllers/StaffSupplierControllerOrgHierarchyTest.php
tests/Feature/Supplier/Http/Controllers/StaffSupplierTeamRolesTest.php
```

---

## Phase A — Critical Fixes (P1, 3-5 days)

### US1: Fix Impersonation — Active Admin Selection

**Problem**: `SupplierSidebar.vue` currently passes `supplier.owner` directly to `CommonImpersonateButton`. When the owner is deactivated or changes roles, `UserController::startImpersonate()` finds the user but they may not have accepted terms, or the redirect in `GetRedirectUrlForImpersonateUserAction` fails because the user has no supplier role. This causes 404 errors.

**Solution**: Create a new `ResolveImpersonationTargetAction` that determines the best impersonation target for a supplier, then pass the resolved user (not the raw owner) to the sidebar.

#### Backend Changes

##### ResolveImpersonationTargetAction (New)

Location: `domain/Supplier/Actions/ResolveImpersonationTargetAction.php`

```php
class ResolveImpersonationTargetAction
{
    use AsAction;

    public function handle(Supplier $supplier): ?User
    {
        // 1. Find active Supplier Administrator from OrganisationWorker
        $activeAdmin = $supplier->workers()
            ->active()
            ->whereHas('user', fn (Builder $q) => $q->whereHas('roles', fn ($r) => $r->where('name', 'Supplier Administrator')))
            ->with('user')
            ->first();

        if ($activeAdmin?->user) {
            return $activeAdmin->user;
        }

        // 2. Fallback: active owner
        $owner = $supplier->owner;
        if ($owner && $supplier->workers()->active()->where('user_id', $owner->id)->exists()) {
            return $owner;
        }

        // 3. No active administrator
        return null;
    }
}
```

- Uses `AsAction` trait (Lorisleiva)
- No `authorize()` needed — this is a query action, authorization is on the impersonation itself
- Fallback chain: active `Supplier Administrator` worker > active owner > null
- Returns `null` when no active admin exists (triggers warning in UI)

##### SupplierService Modification

In `getTabData()` for the overview tab (and any tab that renders the sidebar), add:

```php
'impersonation_target' => ResolveImpersonationTargetAction::run($supplier),
```

This passes the resolved user as an Inertia prop alongside the existing `supplier` prop.

##### SupplierSidebar.vue Modification

Replace the current impersonation button block:

```vue
<!-- Before -->
<CommonImpersonateButton
    v-if="supplier.owner"
    :target-user="supplier.owner"
    :target-user-id="supplier.owner.id ?? undefined"
/>

<!-- After -->
<CommonImpersonateButton
    v-if="impersonationTarget"
    :target-user="impersonationTarget"
    :target-user-id="impersonationTarget.id"
/>
<CommonAlert
    v-else-if="!impersonationTarget && supplier.owner"
    type="warning"
    description="The supplier owner is inactive. No active administrator available for impersonation."
/>
<CommonAlert
    v-else
    type="warning"
    description="No active administrator exists for this supplier."
/>
```

The `impersonationTarget` comes from a new prop on the sidebar, threaded from the controller via `viewLayoutData` or a dedicated prop.

#### Testing

- `ResolveImpersonationTargetActionTest`:
  - Active Supplier Administrator exists → returns that user
  - No active admin, active owner exists → returns owner
  - No active admin, inactive owner → returns null
  - Multiple active admins → returns first (deterministic ordering by ID)
  - Supplier with no workers → returns null

---

### US2: Organisation Hierarchy Card on Overview Tab

**Problem**: Staff viewing a supplier detail page cannot see which organisation the supplier belongs to, what other supplier entities exist under the same ABN, or their compliance status.

**Solution**: Add a collapsible card to the existing `SupplierOverview.vue` (Partials) page showing the organisation hierarchy. The data path already exists: `Supplier → organisation() → suppliers()`.

#### Backend Changes

##### OrganisationHierarchyData (New)

Location: `domain/Supplier/Data/OrganisationHierarchyData.php`

```php
class OrganisationHierarchyData extends Data
{
    public function __construct(
        public string $organisation_name,
        public string $abn,
        public bool $abn_active,
        /** @var array<int, SiblingSupplierData> */
        #[DataCollectionOf(SiblingSupplierData::class)]
        public array $siblings,
        public int $total_suppliers,
        public bool $is_only_entity,
    ) {}
}
```

##### SiblingSupplierData (New)

Location: `domain/Supplier/Data/SiblingSupplierData.php`

```php
class SiblingSupplierData extends Data
{
    public function __construct(
        public int $id,
        public string $name,
        public ?EnumData $stage,
        public ?EnumData $portal_stage,
        public ?EnumData $verification_stage,
        public string $href,
    ) {}
}
```

##### SupplierService Modification

Add a method to build the hierarchy data:

```php
public function getOrganisationHierarchy(Supplier $supplier): ?OrganisationHierarchyData
{
    $organisation = $supplier->organisation;
    if (!$organisation) {
        return null;
    }

    $siblings = $organisation->suppliers()
        ->where('suppliers.id', '!=', $supplier->id)
        ->with('business')
        ->get()
        ->map(fn (Supplier $sibling) => new SiblingSupplierData(
            id: $sibling->id,
            name: $sibling->business?->business_name ?? $organisation->legal_trading_name,
            stage: $sibling->stage_enum ? EnumData::from($sibling->stage_enum) : null,
            portal_stage: $sibling->portal_stage ? PortalStageEnum::findArrayFromValue($sibling->portal_stage->value) : null,
            verification_stage: $sibling->organisation?->verification_stage
                ? OrganisationVerificationStageEnum::findArrayFromValue($sibling->organisation->verification_stage->value)
                : null,
            href: route('suppliers.show', ['supplier' => $sibling->id, 'tab' => 'overview']),
        ))
        ->toArray();

    return new OrganisationHierarchyData(
        organisation_name: $organisation->legal_trading_name,
        abn: $organisation->abn,
        abn_active: $organisation->abn_active,
        siblings: $siblings,
        total_suppliers: count($siblings) + 1,
        is_only_entity: count($siblings) === 0,
    );
}
```

This is called from `getTabData()` when the overview tab is rendered:

```php
'organisationHierarchy' => $this->getOrganisationHierarchy($supplier),
```

#### Frontend Changes

##### OrganisationHierarchyCard Component Decomposition

- **Parent**: `OrganisationHierarchyCard.vue` — owns layout, receives hierarchy data
- **Directory**: `resources/js/Pages/Staff/Suppliers/tabs/Partials/OrganisationHierarchy/`
- **Sub-components**:
  - `SiblingSupplierRow.vue` — renders one sibling row (name, stage badge, link)
  - `ComplianceBadge.vue` — renders compliance/verification status badge. Feature-specific (not Common-eligible because it combines multiple badge conditions specific to supplier verification).

##### OrganisationHierarchyCard.vue

- **Props**: `defineProps<Props>()` with named type:
  - `hierarchy: OrganisationHierarchyData | null` (from shared types)
- **Emits**: None
- **Common components reused**:
  - `CommonCard` — card wrapper
  - `CommonHeader` — card header with "Organisation" title
  - `CommonIcon` — building icon
  - `CommonBadge` — ABN active/inactive badge
  - `CommonDefinitionItem` — org name, ABN
- **No `useForm`** — read-only display, no forms
- **No Pinia store** — data from server props

##### SupplierOverview.vue (Partials) Modification

Add the `OrganisationHierarchyCard` after the existing business name card:

```vue
<OrganisationHierarchyCard
    v-if="organisationHierarchy"
    :hierarchy="organisationHierarchy"
    class="col-span-12"
/>
<CommonAlert
    v-else
    type="info"
    class="col-span-12"
    description="Organisation assignment pending — this supplier has not been assigned to an organisation yet."
/>
```

The `organisationHierarchy` prop flows from the parent `SupplierOverview.vue` (tabs) which receives it as an Inertia page prop.

#### Legacy Supplier Handling (FR-013)

Suppliers without an organisation (`$supplier->organisation` is null) display a `CommonAlert` info banner: "Organisation assignment pending". No broken pages, no errors.

#### Testing

- `StaffSupplierControllerOrgHierarchyTest`:
  - Multi-supplier org → card shows siblings with correct stage badges
  - Single-supplier org → card shows "Only supplier entity"
  - No organisation (legacy) → shows "assignment pending" alert
  - Sibling links navigate to correct supplier detail pages
  - Compliance badges render correct colours per verification stage

---

### US3: Role Labels on Team Tab

**Problem**: The Team tab currently shows a binary "Administrator" / "Team member" badge via `item.user.is_administrator`. It does not distinguish between Organisation Administrator and Supplier Administrator, and "owner" is conflated with "administrator".

**Solution**: Enhance the `OrganisationWorkerData` (or the table transformer) to include the specific role name, and update the Team tab to render granular role labels.

#### Backend Changes

##### SupplierWorkerTable Modification

Location: `domain/Supplier/Tables/SupplierWorkerTable.php`

Add a role column and update `transformModel()`:

```php
// In columns():
TextColumn::make('role_label', 'Role'),

// In transformModel():
'role_label' => $this->resolveRoleLabel($model),

// New private method:
private function resolveRoleLabel(OrganisationWorker $worker): array
{
    $labels = [];

    if ($worker->user) {
        if ($worker->user->hasRole('Supplier Administrator')) {
            $labels[] = ['label' => 'Supplier Administrator', 'colour' => 'blue'];
        }
        // Future: Organisation Administrator role from SR0
        // if ($worker->user->hasRole('Organisation Administrator')) {
        //     $labels[] = ['label' => 'Organisation Administrator', 'colour' => 'purple'];
        // }
    }

    if ($worker->workerable?->owner_user_id === $worker->user_id) {
        $labels[] = ['label' => 'Owner', 'colour' => 'amber'];
    }

    if (empty($labels)) {
        $labels[] = ['label' => 'Team Member', 'colour' => 'gray'];
    }

    return $labels;
}
```

This returns an array of role labels (a user can be both "Supplier Administrator" and "Owner"). The `colour` values match existing `CommonBadge` colour options.

#### Frontend Changes

##### SupplierTeam.vue Modification

Replace the existing binary badge rendering:

```vue
<!-- Before -->
<template #cell(user.is_administrator)="{ item }">
    <CommonBadge v-if="item.user.is_administrator" colour="blue" size="sm" label="Administrator" />
    <CommonBadge v-else colour="blue" size="sm" label="Team member" />
</template>

<!-- After -->
<template #cell(role_label)="{ item }">
    <div class="flex flex-wrap gap-1">
        <CommonBadge
            v-for="(role, index) in item.role_label"
            :key="index"
            :colour="role.colour"
            size="sm"
            :label="role.label"
        />
    </div>
</template>
```

##### Type Fix

The existing `SupplierTeam.vue` uses `interface Props` instead of `type Props`. This must be corrected:

```typescript
// Before
interface Props { ... }

// After
type Props = { ... }
```

Also fix `defineOptions({ layout: AppLayout })` to include title wrapping consistent with sibling tabs:

```typescript
defineOptions({
    layout: (h: any, page: any) => h(AppLayout, { title: 'Supplier Team' }, () => page),
});
```

Note: The `(h: any, page: any)` pattern is an established project convention (22+ files).

#### Role Reassignment (FR-006)

Role reassignment (promoting a user to Organisation Administrator) is deferred to post-SR0 when the Organisation Administrator role exists. The current system only has Supplier Administrator and Supplier roles via Spatie. The UI will not include a reassignment action until SR0 ships the role.

#### Testing

- `StaffSupplierTeamRolesTest`:
  - Supplier Administrator user → shows "Supplier Administrator" badge
  - Owner who is also admin → shows both "Supplier Administrator" and "Owner" badges
  - Regular team member → shows "Team Member" badge
  - User with no roles → shows "Team Member" badge (fallback)

---

## Phase B — Enhancements (P2, 5-8 days, ship after Phase A or defer)

### US4: Unified Approval Queue

**Problem**: Pending supplier approvals are split across `StaffSupplierPendingController` (onboarding pending) and `StaffSupplierApprovalDocumentController` (document approvals). Staff must check two separate views.

**Solution**: Extend `StaffSupplierPendingController` to accept a `type` query parameter and merge document approvals into the same page with tab-style filtering.

#### Backend Changes

##### StaffSupplierPendingController Modification

```php
public function index(Request $request): Response
{
    $type = $request->input('type', 'all');

    $table = match ($type) {
        'documents' => new StaffSupplierDocumentApprovalsTable,
        'onboarding' => new StaffSuppliersPendingTable,
        default => new StaffSuppliersPendingTable, // 'all' — combined view TBD
    };

    $props = [
        'table' => $table,
        'currentType' => $type,
        'typeCounts' => [
            'onboarding' => StaffSuppliersPendingTable::getCount(),
            'documents' => StaffSupplierDocumentApprovalsTable::getCount(),
        ],
    ];

    return Inertia::render('Staff/SuppliersPending/index', $props);
}
```

Add static `getCount()` methods to both table classes for the tab badge counts.

##### Concurrent Approval Warning (FR-014)

When actioning an approval, the controller checks if the item was already actioned (e.g., document already approved). If so, return a flash message: "This item was already actioned by another staff member." The queue refreshes automatically via Inertia's page reload.

#### Frontend Changes

The existing `Staff/SuppliersPending/index.vue` page gets tab-style filters above the `CommonTable`:

```vue
<CommonTabs
    :items="tabItems"
    :model-value="currentType"
    @update:model-value="switchType"
/>
<CommonTable :resource="table" ... />
```

Tab items are computed from `typeCounts` prop. Navigation via `router.visit` with `type` query param and `preserveScroll`.

- **No Pinia store** — tab state in URL params via Inertia router
- **No new Common components** — `CommonTabs` already exists

#### Testing

- Onboarding filter → shows only onboarding pending items
- Documents filter → shows only document approval items
- Tab counts match actual pending items
- Concurrent approval returns warning flash message

---

### US6: Stage Transitions with Organisation Context

**Problem**: When a staff member changes a supplier's stage via the sidebar modal, they have no visibility of sibling supplier stages.

**Solution**: Extend the stage change modal in `SupplierSidebar.vue` to show sibling stages. The data is already available from the organisation hierarchy (US2).

#### Backend Changes

Pass sibling stage data to the sidebar via `viewLayoutData`:

```php
'sibling_stages' => $supplier->organisation?->suppliers()
    ->where('suppliers.id', '!=', $supplier->id)
    ->get()
    ->map(fn (Supplier $s) => [
        'name' => $s->business?->business_name,
        'stage' => $s->stage_enum,
    ])
    ->toArray() ?? [],
```

#### Frontend Changes

In the stage change `CommonModal`, add a section above the form showing sibling stages:

```vue
<div v-if="viewLayoutData.sibling_stages?.length" class="mb-4 rounded-md bg-gray-50 p-3">
    <p class="mb-2 text-sm font-medium text-gray-700">Sibling supplier stages:</p>
    <div v-for="sibling in viewLayoutData.sibling_stages" :key="sibling.name" class="flex items-center justify-between py-1">
        <span class="text-sm">{{ sibling.name }}</span>
        <CommonBadge size="sm" :colour="sibling.stage?.colour" :label="sibling.stage?.label" />
    </div>
</div>
```

#### Audit Trail (FR-011)

Stage changes already produce Spatie Activity Log entries via the `LogsActivity` trait on the Supplier model. No additional audit trail code is needed — the existing `LogOptions::defaults()->logOnly($this->fillable)->logOnlyDirty()` captures stage changes with the authenticated user and timestamp.

#### Testing

- Stage change modal shows sibling stages when siblings exist
- Single-supplier org → no sibling section shown
- Stage change creates activity log entry with user and timestamp

---

### US7: Organisation-Aware Search

**Problem**: The supplier index search does not understand the organisation layer. Searching by ABN does not group related suppliers.

**Solution**: The `StaffSuppliersTable` already searches `business.organisation.legal_trading_name` and `business.organisation.abn` (see existing `$search` array). Add a visible organisation name column and a filter.

#### Backend Changes

##### StaffSuppliersTable Modification

Add column:
```php
TextColumn::make('business.organisation.legal_trading_name', 'Organisation'),
```

Add filter:
```php
TextFilter::make('business.organisation.legal_trading_name', 'Organisation'),
```

Add default sort option by organisation name so results naturally group by ABN when searched.

#### Frontend Changes

The `CommonTable` component automatically renders the new column. No frontend code changes needed — the table infrastructure handles it.

#### Testing

- Organisation name column visible in supplier index
- Searching by ABN returns all suppliers under that ABN
- Organisation filter narrows results correctly

---

## Shared TypeScript Types

### `resources/js/types/Suppliers/staffSupplier.ts`

```typescript
type OrganisationHierarchyData = {
    organisation_name: string;
    abn: string;
    abn_active: boolean;
    siblings: SiblingSupplierData[];
    total_suppliers: number;
    is_only_entity: boolean;
};

type SiblingSupplierData = {
    id: number;
    name: string;
    stage: Domain.Shared.Data.EnumData | null;
    portal_stage: Domain.Shared.Data.EnumData | null;
    verification_stage: Domain.Shared.Data.EnumData | null;
    href: string;
};

type RoleLabel = {
    label: string;
    colour: string;
};

type ImpersonationTarget = {
    id: number;
    full_name: string;
    can_be_impersonated: boolean;
    impersonation_reasons: string[];
} | null;

type SiblingStage = {
    name: string;
    stage: Domain.Shared.Data.EnumData | null;
};

type ApprovalQueueType = 'all' | 'onboarding' | 'documents';

type ApprovalTypeCounts = {
    onboarding: number;
    documents: number;
};
```

---

## UI Components

### OrganisationHierarchyCard Component Decomposition

- **Parent**: `OrganisationHierarchyCard.vue` — owns layout and collapsible state
- **Directory**: `resources/js/Pages/Staff/Suppliers/tabs/Partials/OrganisationHierarchy/`
- **Sub-components**:
  - `SiblingSupplierRow.vue` — renders a single sibling supplier row with name, stage badge, and link
  - `ComplianceBadge.vue` — renders verification stage badge with colour mapping

### OrganisationHierarchyCard.vue

- **Props**: `defineProps<Props>()` with named type:
  - `hierarchy: OrganisationHierarchyData`
- **Emits**: None (read-only card)
- **Key types**: `OrganisationHierarchyData` from `resources/js/types/Suppliers/staffSupplier.ts`
- **Common components reused**: `CommonCard`, `CommonHeader`, `CommonIcon`, `CommonBadge`, `CommonDefinitionItem`
- **Common component eligibility**: `SiblingSupplierRow` — bespoke (supplier-specific row layout with stage badges and navigation). `ComplianceBadge` — bespoke (combines verification stage + type logic specific to supplier compliance).
- **No boolean prop branching** — single render path

### SiblingSupplierRow.vue

- **Props**: `defineProps<Props>()` with named type:
  - `sibling: SiblingSupplierData`
- **Emits**: None
- **Common components reused**: `CommonBadge`, `Link` (from Inertia)

### ComplianceBadge.vue

- **Props**: `defineProps<Props>()` with named type:
  - `verificationStage: Domain.Shared.Data.EnumData | null`
- **Emits**: None
- **Common components reused**: `CommonBadge`

### Modified Components

#### SupplierSidebar.vue (Modified)

- **New prop added to `Props` type**:
  - `impersonationTarget: ImpersonationTarget`
- **Existing `interface Props`** must be changed to `type Props` (Gate 3 compliance)
- **Common components reused**: Existing `CommonImpersonateButton`, `CommonAlert` (for no-admin warning)
- **No new Pinia store** — impersonation target comes from server props

#### SupplierTeam.vue (Modified)

- **Existing `interface Props`** must be changed to `type Props` (Gate 3 compliance)
- **New column slot**: `#cell(role_label)` replacing `#cell(user.is_administrator)`
- **Common components reused**: `CommonBadge` (multiple per row for multi-role users)

#### SupplierOverview.vue — tabs (Modified)

- **New prop added**: `organisationHierarchy: OrganisationHierarchyData | null`
- **Existing `interface Props`** must be changed to `type Props` (Gate 3 compliance)

#### SupplierOverview.vue — Partials (Modified)

- **New prop added**: `organisationHierarchy: OrganisationHierarchyData | null`
- **Existing `interface Props`** must be changed to `type Props` (Gate 3 compliance)

---

## Implementation Phases

### Phase A-1: Impersonation Fix (US1)

**Goal**: Fix the production bug. Ship independently.

1. **Action** — Create `ResolveImpersonationTargetAction` with the fallback chain (active Supplier Admin > active owner > null)
2. **Service** — Add `impersonation_target` to `SupplierService::getTabData()` for sidebar consumption
3. **Sidebar** — Update `SupplierSidebar.vue` to use resolved target, add warning alerts for no-admin case
4. **Types** — Add `ImpersonationTarget` type to `staffSupplier.ts`
5. **Tests** — `ResolveImpersonationTargetActionTest` covering all fallback scenarios
6. **Type fixes** — Change `interface Props` to `type Props` on `SupplierSidebar.vue`

### Phase A-2: Organisation Hierarchy Card (US2)

**Goal**: Staff can see org context on the overview tab.

1. **Data classes** — Create `OrganisationHierarchyData` and `SiblingSupplierData`
2. **Service** — Add `getOrganisationHierarchy()` to `SupplierService`, wire into `getTabData()`
3. **Components** — Create `OrganisationHierarchy/` directory with `OrganisationHierarchyCard.vue`, `SiblingSupplierRow.vue`, `ComplianceBadge.vue`
4. **Integration** — Add card to `SupplierOverview.vue` (Partials), add legacy supplier alert
5. **Types** — Add `OrganisationHierarchyData`, `SiblingSupplierData` to `staffSupplier.ts`
6. **Tests** — `StaffSupplierControllerOrgHierarchyTest` covering multi-supplier, single-supplier, and no-org scenarios
7. **Type fixes** — Change `interface Props` to `type Props` on both SupplierOverview files

### Phase A-3: Role Labels (US3)

**Goal**: Staff can see granular role labels on the Team tab.

1. **Table** — Update `SupplierWorkerTable` with `role_label` column and `resolveRoleLabel()` transformer
2. **Frontend** — Update `SupplierTeam.vue` cell slot to render multiple role badges
3. **Types** — Add `RoleLabel` type to `staffSupplier.ts`
4. **Tests** — `StaffSupplierTeamRolesTest` covering role combinations
5. **Type fixes** — Change `interface Props` to `type Props` on `SupplierTeam.vue`

### Phase B-1: Unified Approval Queue (US4)

**Goal**: Single page with type-filter tabs for all pending approvals.

1. **Controller** — Extend `StaffSupplierPendingController` with `type` filter
2. **Tables** — Add static `getCount()` to both table classes
3. **Frontend** — Add `CommonTabs` to `Staff/SuppliersPending/index.vue`
4. **Types** — Add `ApprovalQueueType`, `ApprovalTypeCounts` to `staffSupplier.ts`
5. **Tests** — Filter and count tests, concurrent approval warning test

### Phase B-2: Stage Transitions with Org Context (US6)

**Goal**: Sidebar stage modal shows sibling stages.

1. **Controller** — Add `sibling_stages` to `viewLayoutData`
2. **Frontend** — Add sibling stages section to stage change modal in `SupplierSidebar.vue`
3. **Types** — Add `SiblingStage` to `staffSupplier.ts`
4. **Tests** — Modal renders sibling stages, audit trail created

### Phase B-3: Organisation-Aware Search (US7)

**Goal**: Supplier index shows and filters by organisation name.

1. **Table** — Add organisation column and filter to `StaffSuppliersTable`
2. **Tests** — Organisation column visible, filter works, ABN search groups results

---

## Testing Strategy

### Phase A Tests

**Feature Tests (Pest):**

- `ResolveImpersonationTargetActionTest`:
  - `it selects active supplier administrator` — Create supplier with active admin worker → returns admin user
  - `it falls back to active owner when no admin exists` — No admin role workers, but owner is active worker → returns owner
  - `it returns null when no active administrators exist` — Deactivated workers only → returns null
  - `it returns null when supplier has no workers` — Empty workers → returns null
  - `it prefers supplier administrator over plain owner` — Both exist → returns admin

- `StaffSupplierControllerOrgHierarchyTest`:
  - `it shows organisation hierarchy for multi-supplier org` — 3 suppliers under one org → hierarchy card with 2 siblings
  - `it shows only entity message for single-supplier org` — 1 supplier → `is_only_entity: true`
  - `it shows pending alert for supplier without organisation` — No org → alert rendered
  - `it includes correct stage badges on siblings` — Siblings at different stages → correct badge data

- `StaffSupplierTeamRolesTest`:
  - `it shows supplier administrator badge` — User with Supplier Administrator role → badge
  - `it shows owner and admin badges together` — Owner who is also admin → two badges
  - `it shows team member badge for regular workers` — No admin role → Team Member badge

### Phase B Tests

**Feature Tests (Pest):**

- Approval queue type filtering
- Tab count accuracy
- Stage modal shows sibling stages
- Organisation column and filter on supplier index

### Test Execution Checklist

- [ ] Phase A-1: Impersonation target resolution (5 test cases)
- [ ] Phase A-2: Organisation hierarchy rendering (4 test cases)
- [ ] Phase A-3: Role labels (3 test cases)
- [ ] Phase B-1: Approval queue filtering (3 test cases)
- [ ] Phase B-2: Stage modal org context (2 test cases)
- [ ] Phase B-3: Organisation search (2 test cases)
- [ ] All phases: `vendor/bin/pint --dirty` passes
- [ ] All phases: `npm run build` succeeds

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Impersonation edge case: user with Supplier Administrator role but no `has_accepted_terms` | Medium | Medium | `ResolveImpersonationTargetAction` chains through workers — UserController already checks `has_accepted_terms` before starting impersonation. The action selects the target; the controller validates eligibility. |
| Organisation hierarchy query N+1 on overview tab | Low | Low | Single eager-loaded query via `$organisation->suppliers()->with('business')`. Max ~10 suppliers per org. |
| Legacy suppliers without organisation break hierarchy card | Medium | Medium | Null-check on `$supplier->organisation` — returns null hierarchy data, frontend shows info alert (FR-013). |
| SupplierWorkerTable `resolveRoleLabel()` performance with Spatie role checks | Low | Low | `hasRole()` uses cached permission data. Team tab is paginated. Max ~50 workers per supplier. |
| Phase B unified queue complexity if table structures diverge | Medium | Low | Tab filter switches between existing table classes — no data merging needed. Each tab uses its own BaseTable. |
| `interface Props` → `type Props` migration on existing files | Low | Low | Mechanical change, no runtime impact. Verified by TypeScript compiler. |

---

## Rollback Strategy

- **Phase A**: All changes are additive. Reverting the branch restores original sidebar impersonation (owner-only), removes org hierarchy card, and restores binary role badges. No migrations, no schema changes, no data model modifications.
- **Phase B**: Tab filter on approval queue is additive — removing it restores the original single-table view. Organisation column on supplier index is a table class addition — removing it restores the original columns.
- **No feature flag needed**: Phase A fixes are unconditional improvements (bug fix + visibility). Phase B could optionally be feature-flagged if phased rollout is desired, but the changes are staff-only views with low risk.

---

## Architecture Gate Check

**Date**: 2026-03-19
**Status**: PASS

### Technical Feasibility
- [x] Architecture approach clear — Modify existing controllers, services, tables, and Vue components. One new action, three new data classes, one new component directory.
- [x] Existing patterns leveraged — Uses established `SupplierService::getTabData()` pattern, `BaseTable` infrastructure, `AsAction` trait, `CommonTable`/`CommonBadge` components.
- [x] All requirements buildable — FR-001 through FR-008 and FR-010 through FR-014 mapped to concrete changes. FR-009 deferred (PLA-1312).
- [x] Performance considered — Organisation hierarchy is a single eager-loaded query. Role labels use cached Spatie permissions. All queries scoped to small result sets.
- [x] Security considered — Impersonation authorization unchanged (existing `canImpersonate`/`canBeImpersonated` checks). Staff-only views behind existing middleware.

### Data & Integration
- [x] Data model understood — No new tables. Leverages existing Organisation, Supplier, OrganisationWorker, Business models and relationships.
- [x] API contracts clear — All changes flow through existing Inertia controller → Vue prop pipeline. No new API endpoints.
- [x] Dependencies identified — No new packages. Relies on existing Spatie roles, Organisation model, OrganisationWorker model, Supplier model.
- [x] Integration points mapped — SupplierService (tab data), SupplierSidebar (impersonation), SupplierOverview (hierarchy card), SupplierTeam (role labels), StaffSuppliersTable (search), StaffSupplierPendingController (queue).
- [x] DTO persistence explicit — New Data classes (`OrganisationHierarchyData`, `SiblingSupplierData`) are read-only DTOs. No `->toArray()` into ORM.

### Implementation Approach
- [x] File changes identified — Full project structure with paths for all new and modified files.
- [x] Risk areas noted — Impersonation edge cases, legacy supplier handling, N+1 on hierarchy query.
- [x] Testing approach defined — Feature tests per user story with specific test cases enumerated.
- [x] Rollback possible — All changes additive, no migrations, revert branch restores original behaviour.

### Resource & Scope
- [x] Scope matches spec — Phase A covers US1-US3, Phase B covers US4/US6/US7. US5 deferred per CQ-4. FR-006 (role reassignment) deferred to post-SR0.
- [x] Effort reasonable — Phase A: 3-5 days, Phase B: 5-8 days. Standard Laravel/Vue patterns.
- [x] Skills available — Standard Laravel/Vue/Inertia stack, existing codebase expertise.

### Laravel & Cross-Platform Best Practices
- [x] No hardcoded business logic in Vue — Role labels, stage data, hierarchy all computed server-side and passed as props.
- [x] Cross-platform reusability — Data classes return typed objects. Organisation hierarchy could be served via API for React Native consumers.
- [x] Laravel Data for validation — New Data classes for DTOs. No new controller validation (existing patterns preserved).
- [x] Model route binding — Existing controllers already use `Supplier $supplier` model binding.
- [x] No magic numbers/IDs — Role names referenced as string constants matching Spatie seeders. Stage values use enums.
- [x] Common components pure — `CommonBadge`, `CommonCard`, `CommonAlert`, `CommonTable` used with zero business logic.
- [x] Use Lorisleiva Actions — `ResolveImpersonationTargetAction` uses `AsAction` trait.
- [x] Action authorization in `authorize()` — `ResolveImpersonationTargetAction` is a query action (no mutation). Impersonation authorization remains in `UserController::startImpersonate()` via existing `canImpersonate`/`canBeImpersonated` checks.
- [x] Data classes remain anemic — `OrganisationHierarchyData`, `SiblingSupplierData`, `StaffSupplierRoleData` contain only properties and type casting.
- [x] Migrations schema-only — No migrations in this epic. No schema changes.
- [x] Models have single responsibility — No model changes. Existing models already own their domain concepts.
- [x] Granular model policies — No new policies needed. Existing staff middleware gates access.
- [x] Response objects in auth — N/A for this epic (no new authorization logic).
- [x] Event sourcing: N/A — Supplier domain uses standard Eloquent, not event-sourced.
- [x] Semantic column documentation — No new columns. Existing model PHPDoc is sufficient.
- [x] Feature flags dual-gated — No feature flag needed. Changes are unconditional improvements to staff-only views (bug fix + visibility).

### Vue TypeScript Standards
- [x] All new/modified Vue components planned with `<script setup lang="ts">`
- [x] Props use named `type` — `type Props = { hierarchy: OrganisationHierarchyData }` with `defineProps<Props>()`. Existing `interface Props` on modified files will be converted to `type Props`.
- [x] Emits use named `type` — No emits needed (read-only display components). Where emits exist on modified files, they will use `type Emits`.
- [x] No `any` types planned — All backend data shapes typed in `resources/js/types/Suppliers/staffSupplier.ts`. The `(h: any, page: any)` layout pattern is an established project convention (22+ files) and is acceptable per Gate 4 guidance.
- [x] Shared types identified — `resources/js/types/Suppliers/staffSupplier.ts` for `OrganisationHierarchyData`, `SiblingSupplierData`, `RoleLabel`, `ImpersonationTarget`, `SiblingStage`, `ApprovalQueueType`, `ApprovalTypeCounts`.
- [x] Common components audited — Reusing `CommonCard`, `CommonHeader`, `CommonIcon`, `CommonBadge`, `CommonDefinitionItem`, `CommonAlert`, `CommonImpersonateButton`, `CommonTable`, `CommonTabs`, `CommonButton`, `CommonFormField`, `CommonSelectMenu`, `CommonForm`.
- [x] New components assessed for common eligibility — `OrganisationHierarchyCard` (bespoke: supplier-specific org card layout), `SiblingSupplierRow` (bespoke: supplier-specific row with stage badges), `ComplianceBadge` (bespoke: combines supplier-specific verification logic). None are general-purpose UI patterns.
- [x] Multi-step wizards: N/A — No wizards in this epic. Forms are single-step (existing stage change modal).
- [x] Composition over configuration — `OrganisationHierarchyCard` composes `SiblingSupplierRow` and `ComplianceBadge` via template composition. No boolean prop branching.
- [x] Composables identified — No new composables needed. Existing `usePermission`, `useCurrentRole`, `useOrganisationBusinessUi` composables reused where needed.
- [x] Primitives are single-responsibility — `SiblingSupplierRow` renders one row. `ComplianceBadge` renders one badge.
- [x] Consumer controls layout — `OrganisationHierarchyCard` owns layout of its sub-components. No flags control render path.
- [x] Pinia stores: Not needed — All data from server props via Inertia. Tab state in URL params. Form state in existing `useForm`.
- [x] Stores named after domain concerns: N/A — No stores proposed.
- [x] Type declarations for untyped deps — `filters.js` import in `SupplierSidebar.vue` already has existing usage pattern. No new untyped imports.

### Component Decomposition
- [x] Component decomposition planned — `OrganisationHierarchyCard` decomposed into parent + 2 sub-components.
- [x] Each sub-component has single concern — `SiblingSupplierRow` renders one sibling. `ComplianceBadge` renders one badge.
- [x] Parent owns logic — `OrganisationHierarchyCard` owns collapsible state and data flow.
- [x] Directory structure defined — `Partials/OrganisationHierarchy/` directory with flat sub-components.
- [x] Naming is simple — `SiblingSupplierRow.vue`, `ComplianceBadge.vue` — no parent prefix.
- [x] No template section comments planned — Each concern is its own sub-component.

### Data Tables
- [x] CommonTable used for all data tables — Existing `StaffSuppliersTable`, `StaffSuppliersPendingTable`, `StaffSupplierDocumentApprovalsTable`, `SupplierWorkerTable` all extend `BaseTable` and render via `CommonTable`.
- [x] BaseTable extended — All table changes are in existing `BaseTable` subclasses.
- [x] Columns typed correctly — `TextColumn` for text, `BadgeColumn` for stages, `ActionColumn` for row actions.
- [x] Transforms in `transformModel()` — Role labels and stage enums formatted in the transformer.
- [x] Filters server-side — Organisation filter uses `TextFilter`, type filter handled via controller query param.
- [x] Actions use named routes — Existing `route()` helper usage preserved.

**Ready to Implement**: YES
