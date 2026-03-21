---
title: "Implementation Plan: Simplified Needs Module (Needs v2)"
---

# Implementation Plan: Simplified Needs Module (Needs v2)

**Spec**: [spec.md](spec.md) | **Design**: [design.md](design.md)
**Created**: 2026-02-12
**Status**: Draft
**Gate 1**: PASS (Spec → Design) | **Gate 2**: PASS (Design → Dev) | **Gate 3**: PASS (Architecture)

---

## Summary

The current Needs system (v1) has a 300+ field JSON blob, a ~200-property Data class, 60+ enums, and 14 conditional form sections. Marianne (Clinical Governance) flagged the module as "pretty wordy" — care partners find it overwhelming.

This plan builds a **new, parallel needs system** (v2) with its own table, Maslow-based categories, and a 3-step wizard UI. The v1 system stays untouched. V2 delivers:

- Clean schema with explicit columns (no JSON blob)
- 14 care-need categories across 5 Maslow levels (not service-derived)
- 3-step wizard: Define Need → Link Risks → Associate Budget Items
- ~15 properties in the Data class (vs 200+)
- Collapsible Maslow pyramid filter on the list view
- Status lifecycle: Draft → Active → Archived
- Feature flag per organisation for gradual rollout

---

## Technical Context

### Technology Stack

- **Backend**: Laravel 12, PHP 8.3
- **Frontend**: Vue 3, Inertia.js v2, TypeScript, Tailwind CSS v3
- **Database**: MySQL
- **Event Sourcing**: Spatie Laravel Event Sourcing (existing pattern)
- **Actions**: Lorisleiva/Actions (existing pattern)
- **DTOs**: Spatie Laravel Data (existing pattern)
- **Feature Flags**: PostHog + Laravel Pennant (constitution XIV)
- **Testing**: Pest v3

### Dependencies

- Existing risk data (`riskables` polymorphic pivot — no migration needed)
- Existing budget items (`package_budget_items` — add nullable FK)
- `CommonStepNavigation` component (reka-ui based, exists)
- `CommonModal` component (HeadlessUI Dialog, exists)
- `CommonSelectMenu` component (reka-ui Combobox with Fuse.js, exists)
- `CommonFormField`, `CommonButton`, `CommonBadge`, `CommonEmptyPlaceholder` (all exist)

### Constraints

- **Performance**: Needs per package typically 5-15 (no pagination/virtualisation needed)
- **Security**: Health information — existing `manage-need` permission, audit trail via event sourcing
- **Accessibility**: WCAG AA — keyboard navigation, ARIA labels, focus management
- **Coexistence**: v1 untouched; feature flag controls which UI is shown per organisation

---

## Design Decisions

### Data Model

#### `need_categories_v2` table

| Column | Type | Notes |
|--------|------|-------|
| id | bigint PK | Auto-increment |
| name | string(100) | Internal key, e.g. `nutrition_hydration` |
| label | string(150) | Display: `Nutrition & Hydration` |
| maslow_level | string(50) | `physiological`, `safety`, `belonging`, `esteem`, `self_actualisation` |
| priority_order | smallint | Lower = more fundamental (1-14) |
| icon | string(100) nullable | Icon identifier for UI |
| colour | string(30) nullable | Tailwind colour class |
| description | text nullable | What falls under this category |
| is_active | boolean default true | Soft-disable without deleting |
| created_at, updated_at | timestamps | |
| deleted_at | timestamp nullable | Soft deletes |

**14 seeded categories:**

| # | Maslow Level | Label | Name |
|---|-------------|-------|------|
| 1 | physiological | Nutrition & Hydration | `nutrition_hydration` |
| 2 | physiological | Personal Hygiene & Care | `personal_hygiene_care` |
| 3 | physiological | Mobility & Physical Function | `mobility_physical_function` |
| 4 | physiological | Medication & Health Management | `medication_health_management` |
| 5 | safety | Home Safety & Environment | `home_safety_environment` |
| 6 | safety | Emergency & Risk Management | `emergency_risk_management` |
| 7 | safety | Financial & Legal Protection | `financial_legal_protection` |
| 8 | belonging | Social Connection & Community | `social_connection_community` |
| 9 | belonging | Cultural & Spiritual Wellbeing | `cultural_spiritual_wellbeing` |
| 10 | belonging | Family & Carer Support | `family_carer_support` |
| 11 | esteem | Independence & Daily Living | `independence_daily_living` |
| 12 | esteem | Communication & Cognition | `communication_cognition` |
| 13 | self_actualisation | Goals & Wellbeing | `goals_wellbeing` |
| 14 | self_actualisation | End of Life & Palliative | `end_of_life_palliative` |

#### `package_needs_v2` table

| Column | Type | Notes |
|--------|------|-------|
| id | bigint PK | Auto-increment |
| uuid | string(36) unique | For event sourcing aggregate |
| package_id | FK → packages | cascadeOnDelete |
| need_category_v2_id | FK → need_categories_v2 | restrictOnDelete |
| description | text | What is the need? |
| how_will_be_met | text nullable | How will it be addressed? |
| funding_source | string(30) | Enum: HCP, INFORMAL, PHN, PBS, PRIVATE_HEALTH, OTHER |
| funding_source_other | string(255) nullable | Required when funding_source = OTHER |
| status | string(20) default 'active' | Enum: draft, active, archived |
| priority | smallint default 0 | Sort order within package |
| add_to_care_plan | boolean default true | FR-012, FR-021 |
| created_by | bigint nullable | User who created |
| updated_by | bigint nullable | User who last updated |
| created_at, updated_at | timestamps | |
| deleted_at | timestamp nullable | Soft deletes |
| **Indexes** | | |
| (package_id, need_category_v2_id) | composite | Common query pattern |
| (package_id, status) | composite | List view filter |

#### Risk linking — existing `riskables` pivot (polymorphic, no migration)

- `riskable_type` = `Domain\Need\Models\PackageNeedV2`
- `riskable_id` = `package_needs_v2.id`
- Uses existing `morphToMany` / `morphedByMany` pattern

#### Budget item linking — add `package_need_v2_id` FK

- Add nullable `package_need_v2_id` column to `package_budget_items`
- `nullOnDelete` — clearing FK when need is deleted
- Existing `package_need_id` (v1) remains untouched

#### `package_need_v2_stored_events` table

Standard Spatie event sourcing schema:
- `id`, `aggregate_uuid`, `aggregate_version`, `event_version`, `event_class`, `event_properties`, `meta_data`, `created_at`
- Follows `CustomStoredEvent` base class pattern (captures user_id, IP, impersonator in meta)

### API Contracts

#### Routes (added to `domain/Package/Routes/packageRoutes.php`)

```
POST   /packages/{package}/needs-v2           → store
GET    /packages/{package}/needs-v2/create     → create (modal)
GET    /packages/{package}/needs-v2/{need}     → show (modal, readonly)
GET    /packages/{package}/needs-v2/{need}/edit → edit (modal)
PUT    /packages/{package}/needs-v2/{need}     → update
DELETE /packages/{package}/needs-v2/{need}     → destroy
PATCH  /packages/{package}/needs-v2/reorder    → reorder (priority update)
```

All routes use `user.permission:manage-need` middleware.

#### Controller Methods

| Method | Input | Output |
|--------|-------|--------|
| `create` | Package | `Inertia::modal('Packages/NeedsV2/Create', {package, options})` |
| `store` | Package, PackageNeedV2Data | Redirect to needs tab with success flash |
| `show` | Package, PackageNeedV2 | `Inertia::modal('Packages/NeedsV2/Edit', {package, need, options, readonly: true})` |
| `edit` | Package, PackageNeedV2 | `Inertia::modal('Packages/NeedsV2/Edit', {package, need, options, readonly: false})` |
| `update` | Package, PackageNeedV2, PackageNeedV2Data | Redirect to needs tab with success flash |
| `destroy` | Package, PackageNeedV2 | Redirect to needs tab with success flash |
| `reorder` | Package, array of {id, priority} | Redirect back |

#### Options Data (passed to modal)

```
PackageNeedV2Options {
    needCategories: NeedCategoryV2Data[] (grouped by maslow_level)
    fundingSourceOptions: FundingSourceEnum::toData()
    statusOptions: NeedStatusEnum::toData()
    packageRisks: Risk[] (package's existing risks)
    packageBudgetItems: PackageBudgetItem[] (package's existing budget items)
}
```

### UI Components

#### Existing (reuse as-is)

| Component | Usage |
|-----------|-------|
| `CommonModal` | Wizard container (right-slide) |
| `CommonStepNavigation` | Wizard step tabs |
| `CommonSelectMenu` | Funding source dropdown + risk/budget multi-select |
| `CommonFormField` | Form field wrapper with validation |
| `CommonButton` | All action buttons |
| `CommonBadge` | Category, status, funding source labels |
| `CommonEmptyPlaceholder` | Empty states (no risks, no budget items) |
| `CommonTextarea` | Description, how-will-be-met fields |

#### New Components

| Component | Purpose |
|-----------|---------|
| `NeedV2WizardForm.vue` | Main wizard: `CommonStepNavigation` + 3 step panels + single `useForm()` |
| `NeedV2StepDefine.vue` | Step 1: Category picker, description, how met, funding source, status |
| `NeedV2StepRisks.vue` | Step 2: Multi-select existing package risks |
| `NeedV2StepBudget.vue` | Step 3: Multi-select existing package budget items |
| `MaslowCategoryPicker.vue` | Grouped visual selector with collapsible Maslow sections |
| `MaslowPyramid.vue` | SVG/CSS pyramid with clickable tiers, count badges, filter emit |
| `NeedV2Card.vue` | Compact/expandable card with drag handle |

---

## Implementation Phases

### Phase 1: Database & Migrations

**Files to create:**
1. `database/migrations/xxxx_create_need_categories_v2_table.php`
2. `database/migrations/xxxx_create_package_needs_v2_table.php`
3. `database/migrations/xxxx_add_package_need_v2_id_to_package_budget_items.php`
4. `database/migrations/xxxx_create_package_need_v2_stored_events_table.php`
5. `database/seeders/NeedCategoryV2Seeder.php`

**Verification:** `php artisan migrate && php artisan db:seed --class=NeedCategoryV2Seeder`

### Phase 2: Backend Domain (Models, Enums, Data, Factory)

**Models:**
- `domain/Need/Models/NeedCategoryV2.php` — table, relationships, casts
- `domain/Need/Models/PackageNeedV2.php` — table, traits (HasFactory, LogsActivity, SoftDeletes), relationships (package, needCategory, risks via morphToMany, budgetItems), casts

**Enums:**
- `domain/Need/Enums/FundingSourceEnum.php` — HCP, INFORMAL, PHN, PBS, PRIVATE_HEALTH, OTHER
- `domain/Need/Enums/MaslowLevelEnum.php` — PHYSIOLOGICAL, SAFETY, BELONGING, ESTEEM, SELF_ACTUALISATION
- `domain/Need/Enums/NeedStatusEnum.php` — DRAFT, ACTIVE, ARCHIVED

**Data classes:**
- `domain/Need/Data/NeedCategoryV2Data.php` (~10 properties)
- `domain/Package/Data/PackageNeedV2Data.php` (~17 properties, validation rules)
- `domain/Package/Data/PackageNeedV2Options.php` (~5 properties)

**Factory:**
- `domain/Need/Factories/PackageNeedV2Factory.php`

**Relationship additions to existing models:**
- `Package.php`: add `needsV2(): HasMany → PackageNeedV2`
- `PackageBudgetItem.php`: add `packageNeedV2(): BelongsTo → PackageNeedV2` (with `withTrashed()`)
- `Risk.php`: add `packageNeedsV2(): MorphToMany` (inverse `morphedByMany`)

### Phase 3: Event Sourcing Stack

Following exact patterns from `domain/Need/EventSourcing/`:

| File | Pattern Source |
|------|---------------|
| `domain/Need/EventSourcing/PackageNeedV2StoredEvent.php` | `PackageNeedStoredEvent.php` |
| `domain/Need/EventSourcing/PackageNeedV2EventRepository.php` | `PackageNeedEventRepository.php` |
| `domain/Need/EventSourcing/Data/PackageNeedV2EventData.php` | `PackageNeedEventData.php` |
| `domain/Need/EventSourcing/Events/PackageNeedV2Created.php` | `PackageNeedCreated.php` |
| `domain/Need/EventSourcing/Events/PackageNeedV2Updated.php` | `PackageNeedUpdated.php` |
| `domain/Need/EventSourcing/Events/PackageNeedV2Deleted.php` | `PackageNeedDeleted.php` |
| `domain/Need/EventSourcing/Aggregates/PackageNeedV2Aggregate.php` | `PackageNeedAggregate.php` |
| `domain/Need/EventSourcing/Projectors/PackageNeedV2Projector.php` | `PackageNeedProjector.php` |

**Projector handles:**
- **On create**: insert row, sync risk associations via `riskables` pivot, update budget items' `package_need_v2_id`
- **On update**: update row, re-sync risks and budget item associations
- **On delete**: soft delete, nullify budget item FKs, detach risks

### Phase 4: Actions

Following `Lorisleiva\Actions` pattern from `domain/Package/Actions/PackageNeed/`:

| File | Pattern Source | Notes |
|------|---------------|-------|
| `domain/Package/Actions/PackageNeedV2/CreateNeedV2.php` | `CreateNeed.php` | Generate UUID, retrieve aggregate, record event, persist |
| `domain/Package/Actions/PackageNeedV2/UpdateNeedV2.php` | `UpdateNeed.php` | Retrieve aggregate by UUID, record event, persist |
| `domain/Package/Actions/PackageNeedV2/DeleteNeedV2.php` | `DeleteNeed.php` | Retrieve aggregate by UUID, record event, persist |
| `domain/Package/Actions/PackageNeedV2/ReorderNeedsV2.php` | New | Bulk update priority column, no event sourcing needed |

### Phase 5: Controller & Routes

**Controller:** `domain/Package/Http/Controllers/PackageNeedV2Controller.php`

Pattern: `PackageNeedController.php` — but dramatically simpler:
- No 60+ enum imports
- No 370-line options method
- `getOptions()` fetches categories (grouped by maslow_level), funding sources from enum, status options, package risks, and package budget items

**Routes:** Add to `domain/Package/Routes/packageRoutes.php` after existing needs resource:

```php
Route::resource('needs-v2', PackageNeedV2Controller::class)
    ->middleware(['user.permission:manage-need']);

Route::patch('needs-v2-reorder', [PackageNeedV2Controller::class, 'reorder'])
    ->name('needs-v2.reorder')
    ->middleware(['user.permission:manage-need']);
```

### Phase 6: Frontend (Vue)

**Pages:**
- `resources/js/Pages/Packages/NeedsV2/Create.vue` — modal wrapper
- `resources/js/Pages/Packages/NeedsV2/Edit.vue` — modal wrapper (pre-populated)

**Wizard Components:**
- `resources/js/Components/Staff/NeedsV2/NeedV2WizardForm.vue` — main wizard with single `useForm()`
- `resources/js/Components/Staff/NeedsV2/NeedV2StepDefine.vue` — Step 1
- `resources/js/Components/Staff/NeedsV2/NeedV2StepRisks.vue` — Step 2
- `resources/js/Components/Staff/NeedsV2/NeedV2StepBudget.vue` — Step 3
- `resources/js/Components/Staff/NeedsV2/MaslowCategoryPicker.vue` — grouped visual selector

**List Components:**
- `resources/js/Components/Staff/NeedsV2/PackageNeedsV2.vue` — main list view (replaces v1 tab content)
- `resources/js/Components/Staff/NeedsV2/NeedV2Card.vue` — compact/expandable card
- `resources/js/Components/Staff/NeedsV2/MaslowPyramid.vue` — SVG pyramid filter

**Wizard architecture:**
- Single `useForm()` in `NeedV2WizardForm.vue` holds all data across steps
- Steps use `v-show` (not `v-if`) to preserve state
- `CommonStepNavigation` provides step tabs
- Validation runs server-side on final submit only
- Category selector groups options by `maslow_level` with visual level headers

### Phase 7: Feature Flag

- Create `needs-v2` flag in PostHog UI
- Backend: `Feature::active('needs-v2')` in controller/Inertia shared props
- Frontend: Existing `PackageNeeds.vue` conditionally renders v1 or v2 list component
- Flag scoped per organisation for gradual rollout

### Phase 8: Tests

Pest feature tests following `tests/Controller/Package/PackageNeedControllerTest.php` patterns:

**Phase 1 Tests (Foundation):**
- Unit: Model relationships, casts, enum values
- Feature: Migration runs, seeder creates 14 categories

**Phase 2 Tests (CRUD):**
- Feature: `CreatePackageNeedV2Test` — create with valid data, validation errors, risk linking, budget association, event stored
- Feature: `UpdatePackageNeedV2Test` — update fields, re-sync associations, status changes
- Feature: `DeletePackageNeedV2Test` — soft delete, FK cleanup, risk detach
- Feature: `ReorderPackageNeedV2Test` — priority update persists

**Phase 3 Tests (Controller):**
- Feature: `PackageNeedV2ControllerTest` — Inertia modal renders, authorization (manage-need permission), redirect responses, options data structure

**Phase 4 Tests (Integration):**
- Feature: Full wizard flow (create → link risks → link budget items → verify associations)
- Feature: Feature flag toggle (v1 vs v2 tab rendering)

---

## Testing Strategy

**Approach**: Pest v3 tests at each phase. Tests written alongside implementation.

### Test Location

```
tests/Unit/Need/Models/NeedCategoryV2Test.php
tests/Unit/Need/Models/PackageNeedV2Test.php
tests/Unit/Need/Enums/FundingSourceEnumTest.php
tests/Unit/Need/Enums/NeedStatusEnumTest.php
tests/Feature/Package/PackageNeedV2/CreatePackageNeedV2Test.php
tests/Feature/Package/PackageNeedV2/UpdatePackageNeedV2Test.php
tests/Feature/Package/PackageNeedV2/DeletePackageNeedV2Test.php
tests/Feature/Package/PackageNeedV2/ReorderPackageNeedV2Test.php
tests/Feature/Package/PackageNeedV2/PackageNeedV2ControllerTest.php
```

### Execution

```bash
php artisan test --compact --filter=NeedV2
php artisan test --compact --filter=NeedCategoryV2
php artisan test --compact --filter=FundingSourceEnum
php artisan test --compact --filter=NeedStatusEnum
```

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Polymorphic `riskables` pivot doesn't support new model type | Low | High | Test early in Phase 2; the pivot is generic by design |
| Maslow pyramid component adds scope creep | Medium | Medium | Keep MVP simple (CSS/SVG, no animation library); defer rich interactions to Phase 2 |
| Drag-and-drop library adds bundle size | Low | Low | `@vueuse/core` useSortable is lightweight; already in project |
| Feature flag leaks v2 UI to non-enabled orgs | Low | High | Test flag toggle in both directions; verify Inertia shared props |
| Event sourcing projector misses association sync | Medium | Medium | Comprehensive tests for create/update/delete with risk+budget associations |

---

## Implementation Order

1. Migrations + seeder (run migrations, seed 14 categories)
2. Models + enums + factory + relationship additions to existing models
3. Data classes (DTOs + validation)
4. Event sourcing stack (stored event, repository, events, event data, aggregate, projector)
5. Actions (create, update, delete, reorder)
6. Controller + routes
7. Vue pages + wizard components + list components + Maslow pyramid
8. Feature flag integration
9. Tests (alongside each phase)
10. Run `vendor/bin/pint --dirty`

## Verification

1. Run migrations: `php artisan migrate`
2. Seed categories: `php artisan db:seed --class=NeedCategoryV2Seeder`
3. Navigate to a package's needs tab → verify v1 shows (flag off)
4. Enable `needs-v2` flag for test org → verify v2 list shows
5. Create a v2 need via wizard → verify need appears in list
6. Link risks (Step 2) → verify `riskables` pivot populated
7. Link budget items (Step 3) → verify `package_need_v2_id` set
8. Edit need → verify wizard pre-populated
9. Delete need → verify soft delete, FK cleanup
10. Drag reorder → verify priority persists on refresh
11. Run tests: `php artisan test --compact --filter=NeedV2`

---

## Gate 3: Architecture Gate

**Gate definition**: [`.tc-wow/gates/03-architecture.md`](../../../../.tc-wow/gates/03-architecture.md)
**Date**: 2026-02-12
**Status**: PASS

### Constitution Alignment

| Principle | Status | Evidence |
|-----------|--------|----------|
| I. Majestic Monolith | PASS | All code in domain modules (`domain/Need/`, `domain/Package/`) |
| II. Domain-Driven Design | PASS | Models, Actions, Events, Controllers in domain folders |
| III. Convention Over Configuration | PASS | Follows existing PackageNeed v1 patterns exactly |
| IV. Code Quality Standards | PASS | Type-safe DTOs, explicit return types, descriptive names |
| V. Testing is First-Class | PASS | Pest tests per phase; unit + feature + browser |
| VI. Event Sourcing for Audit-Critical | PASS | Full event sourcing stack (aggregate, projector, stored events) |
| VII. Laravel Data for DTOs | PASS | `PackageNeedV2Data`, `NeedCategoryV2Data`, `PackageNeedV2Options` |
| VIII. Action Classes | PASS | `CreateNeedV2`, `UpdateNeedV2`, `DeleteNeedV2`, `ReorderNeedsV2` |
| X. Inertia + Vue 3 + TypeScript | PASS | Modal pages, `useForm()`, TypeScript interfaces |
| XI. Component Library & Tailwind | PASS | Reuses 6 existing Common components; 5 new components |
| XIV. Feature Flags | PASS | PostHog flag `needs-v2`, checked via Pennant `Feature::active()` |
| XV. Permissions | PASS | Existing `manage-need` permission, middleware on routes |
| XVI. Compliance & Audit | PASS | Event sourcing + soft deletes + `LogsActivity` trait |
| XVII. Pint Formatting | PASS | Run `vendor/bin/pint --dirty` before finalising |

### 1. Technical Feasibility

| Check | Status | Evidence |
|-------|--------|---------|
| Architecture approach clear | [x] PASS | Mirrors existing PackageNeed v1 stack exactly — same domain folders, same patterns |
| Existing patterns leveraged | [x] PASS | Event sourcing, Lorisleiva Actions, Laravel Data DTOs, Inertia modals, Common components |
| No impossible requirements | [x] PASS | All FR-001 through FR-022 are buildable with existing tech stack |
| Performance considered | [x] PASS | <20 needs per package, composite indexes, eager loading, no pagination needed |
| Security considered | [x] PASS | `manage-need` permission, event sourcing audit trail, soft deletes |

### 2. Data & Integration

| Check | Status | Evidence |
|-------|--------|---------|
| Data model understood | [x] PASS | `data-model.md` — 2 new tables, 1 FK addition, 1 polymorphic reuse |
| API contracts clear | [x] PASS | 7 controller methods with input/output defined in plan |
| Dependencies identified | [x] PASS | 3 existing models (Package, Risk, PackageBudgetItem), 6 Common components |
| Integration points mapped | [x] PASS | `riskables` polymorphic pivot, `package_need_v2_id` FK, Pennant feature flag |
| DTO persistence explicit | [x] PASS | Projector uses explicit field mapping (see below) |

**DTO Persistence — Projector Pattern:**

The `PackageNeedV2Projector` must use explicit field mapping, never `->toArray()`:

```php
// ✅ GOOD — Explicit field mapping in projector
public function onPackageNeedV2Created(PackageNeedV2Created $event): void
{
    DB::table('package_needs_v2')->updateOrInsert(
        ['uuid' => $event->aggregateRootUuid()],
        [
            'package_id' => $event->packageId,
            'need_category_v2_id' => $event->packageNeedData->needCategoryV2Id,
            'description' => $event->packageNeedData->description,
            'how_will_be_met' => $event->packageNeedData->howWillBeMet,
            'funding_source' => $event->packageNeedData->fundingSource,
            'funding_source_other' => $event->packageNeedData->fundingSourceOther,
            'status' => $event->packageNeedData->status,
            'priority' => $event->packageNeedData->priority,
            'add_to_care_plan' => $event->packageNeedData->addToCarePlan,
            'created_by' => $event->metaData()['user_id'] ?? null,
            'updated_by' => $event->metaData()['user_id'] ?? null,
            'created_at' => $event->createdAt(),
            'updated_at' => $event->createdAt(),
        ]
    );
}
```

### 3. Implementation Approach

| Check | Status | Evidence |
|-------|--------|---------|
| File changes identified | [x] PASS | 8 phases with every file listed (migrations, models, enums, data, events, actions, controller, routes, Vue) |
| Risk areas noted | [x] PASS | 5 risks in Risk Assessment table with mitigations |
| Testing approach defined | [x] PASS | Pest v3 tests per phase — unit, feature, controller |
| Rollback possible | [x] PASS | Feature flag disables v2 UI instantly; migrations are reversible; v1 untouched |

### 4. Resource & Scope

| Check | Status | Evidence |
|-------|--------|---------|
| Scope matches spec | [x] PASS | Plan implements FR-001 through FR-022, no extras beyond spec |
| Effort reasonable | [x] PASS | Medium build (BMW 3 Series per design.md); follows established patterns |
| Skills available | [x] PASS | Laravel + Vue + event sourcing — all existing team capabilities |

### 5. Laravel & Cross-Platform Best Practices

| Check | Status | Evidence |
|-------|--------|---------|
| No hardcoded business logic in Vue | [x] PASS | Categories, funding sources, status options all come from backend via `PackageNeedV2Options`; Maslow grouping derived from backend data |
| Cross-platform reusability | [x] PASS | All business logic in Actions; controller returns Data DTOs consumable by any client |
| Laravel Data for validation | [x] PASS | `PackageNeedV2Data` handles validation; no Request objects in controller |
| Model route binding | [x] PASS | Controller uses `Package $package, PackageNeedV2 $need` — no `int $id` |
| No magic numbers/IDs | [x] PASS | Categories referenced by model relationship, not hardcoded IDs; funding sources via enum |
| Common components pure | [x] PASS | All new components (`MaslowPyramid`, `NeedV2Card`) receive data via props; business logic stays in parent or backend |
| Use Lorisleiva Actions (AsAction trait) | [x] PASS | `CreateNeedV2`, `UpdateNeedV2`, `DeleteNeedV2`, `ReorderNeedsV2` all use `AsAction` |
| Action authorization in `authorize()` | [x] PASS | See below |
| Data classes remain anemic | [x] PASS | `PackageNeedV2Data` has only properties + validation rules; no business logic |
| Migrations schema-only | [x] PASS | Category data in `NeedCategoryV2Seeder`, not in migrations |
| Models have single responsibility | [x] PASS | `PackageNeedV2` owns one concept (a care need); `NeedCategoryV2` owns one concept (a classification) |
| Granular model policies | [x] PASS | See below |
| Response objects in auth | [x] PASS | See below |
| Event sourcing events validated | [x] PASS | "Can We Answer This Later?" acceptance criteria below |
| Semantic column documentation | [x] PASS | See below |

---

### Architecture Details (Gate 3 Requirements)

#### Action Authorization Pattern

Actions use `authorize()` method, not `handle()` or `asController()`:

```php
class CreateNeedV2
{
    use AsAction;

    public function authorize(ActionRequest $request): Response
    {
        return $request->user()->can('manage-need')
            ? Response::allow()
            : Response::deny('You do not have permission to manage needs.');
    }

    public function handle(PackageNeedV2Data $data): bool
    {
        // Pure business logic — no auth checks
        $uuid = Str::uuid()->toString();
        PackageNeedV2Aggregate::retrieve($uuid)
            ->createNeed(packageId: $data->packageId, packageNeedData: $eventData)
            ->persist();
        return true;
    }
}
```

#### Policy Pattern (if needed beyond middleware)

Existing `manage-need` permission is checked via route middleware. If granular model-level policies are needed:

```php
class PackageNeedV2Policy
{
    public function update(User $user, PackageNeedV2 $need): Response
    {
        if ($user->hasPermission('manage-need')) {
            return Response::allow();
        }
        return Response::deny('You do not have permission to update this need.');
    }

    public function delete(User $user, PackageNeedV2 $need): Response
    {
        if ($need->status === NeedStatusEnum::ARCHIVED->value) {
            return Response::deny('Archived needs cannot be deleted.');
        }
        if ($user->hasPermission('manage-need')) {
            return Response::allow();
        }
        return Response::deny('You do not have permission to delete this need.');
    }
}
```

#### Event Sourcing — "Can We Answer This Later?" Acceptance Criteria

Events in `package_need_v2_stored_events` must be able to answer:

- [x] **When was this need created, and by whom?** — `PackageNeedV2Created` event with `user_id` in meta_data
- [x] **What was the original state of this need before it was changed?** — Replay events from `PackageNeedV2Created` through updates
- [x] **How many needs were created per package over a given period?** — Count `PackageNeedV2Created` events by `packageId` and `created_at`
- [x] **Which Maslow categories are most commonly used across the book?** — `PackageNeedV2Created` events with `needCategoryV2Id` in payload
- [x] **How often are risks linked to needs vs. left empty?** — `PackageNeedV2Created`/`Updated` events with `riskIds` array in payload
- [x] **How often are needs archived vs. deleted?** — Separate `PackageNeedV2Updated` (status change) vs. `PackageNeedV2Deleted` events
- [x] **Who deleted this need, and when?** — `PackageNeedV2Deleted` event with `user_id` in meta_data (CustomStoredEvent pattern)
- [x] **Has the average number of needs per package trended up since v2 launched?** — Count `PackageNeedV2Created` events over time

**Event granularity decision:** Three events (Created, Updated, Deleted) are sufficient for this domain. Unlike signatures with complex multi-party workflows, needs have a simple CRUD lifecycle. The `Updated` event captures the full new state, and the projector re-syncs associations. Status transitions (Draft→Active→Archived) are captured as `Updated` events — the status field in the event payload differentiates them. If the business later needs finer granularity (e.g., separate `NeedArchived` event), this can be added without breaking existing events.

#### Semantic Column Documentation

The `PackageNeedV2` model must document these non-trivial columns:

```php
/**
 * @property int $id
 * @property string $uuid Event sourcing aggregate UUID — generated on creation,
 *                        used to retrieve the aggregate root for updates/deletes.
 * @property string $status Lifecycle status of this need. Valid values: 'draft', 'active', 'archived'.
 *                          - 'active' (default): Confirmed need, included in care planning if add_to_care_plan is true.
 *                          - 'draft': Saved but not yet confirmed — Coordinator chose "Save as Draft" in wizard.
 *                          - 'archived': No longer current — Coordinator explicitly archived.
 *                          Set by: CreateNeedV2 action (default 'active'), UpdateNeedV2 action (status changes).
 *                          Archived needs are hidden from default list view but accessible via filter tab.
 * @property bool $add_to_care_plan Whether this need should be included when generating care plan documents.
 *                                  Defaults to true. Only active needs with add_to_care_plan=true are included
 *                                  in care plan PDF generation (FR-021). Set by Coordinator in wizard Step 1.
 * @property string $funding_source How this need is funded. Enum: HCP, INFORMAL, PHN, PBS, PRIVATE_HEALTH, OTHER.
 *                                  When 'OTHER', the funding_source_other field must contain the specification.
 *                                  Set by Coordinator in wizard Step 1.
 * @property int $priority Sort order within the package's needs list. Lower = higher in list.
 *                         Updated by ReorderNeedsV2 action when Coordinator drags needs.
 *                         Defaults to 0 on creation.
 * @property int|null $created_by User ID of the Coordinator who created this need.
 *                                Set by the projector from event meta_data['user_id'].
 * @property int|null $updated_by User ID of the Coordinator who last modified this need.
 *                                Set by the projector from event meta_data['user_id'].
 */
```

---

**Ready to Implement**: YES

## Next Steps

1. Run `/speckit.tasks` — Generate dependency-ordered task list
2. Run `/trilogy-clarify dev` — Refine plan with developer input
3. Run `/trilogy-erd` — Generate database schema diagram
4. Begin implementation with Phase 1 (migrations)
