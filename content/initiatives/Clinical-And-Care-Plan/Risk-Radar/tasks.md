---
title: "Implementation Tasks: Risk Radar"
---

# Implementation Tasks: Risk Radar

**Plan**: [plan.md](./plan.md) | **Spec**: [spec.md](./spec.md)
**Mode**: AI (agent-executable)
**Generated**: 2026-03-10

---

## Phase 1: Foundation (Data Model + Seeders)

### Migrations

- [ ] T001 Migration: Create `clinical_risk_areas` table — columns: `id` (bigIncrements), `name` (string 100), `slug` (string 100, unique), `questionnaire` (json), `order` (unsignedInteger), `timestamps`. File: `database/migrations/YYYY_MM_DD_create_clinical_risk_areas_table.php`. Use `php artisan make:migration create_clinical_risk_areas_table --no-interaction`

- [ ] T002 Migration: Create `clinical_risk_area_domain` pivot table — columns: `id` (bigIncrements), `clinical_risk_area_id` (foreignId, constrained to clinical_risk_areas, cascadeOnDelete), `domain` (string 50, index). No timestamps. File: `database/migrations/YYYY_MM_DD_create_clinical_risk_area_domain_table.php`

- [ ] T003 Migration: Add `clinical_risk_area_id` to `risk_categories` table — nullable foreignId constrained to `clinical_risk_areas`, nullOnDelete. File: `database/migrations/YYYY_MM_DD_add_clinical_risk_area_id_to_risk_categories_table.php`

- [ ] T004 Migration: Create `risk_assessments` table — columns: `id` (bigIncrements), `uuid` (uuid, unique), `package_id` (foreignId, constrained), `clinical_risk_area_id` (foreignId, constrained), `risk_id` (foreignId, nullable, constrained to risks, nullOnDelete), `questionnaire_response` (text), `consequence_level` (unsignedTinyInteger), `rationale` (text, nullable), `assessed_by` (foreignId, constrained to users), `created_at` (timestamp). Index on `[package_id, clinical_risk_area_id, created_at]`. File: `database/migrations/YYYY_MM_DD_create_risk_assessments_table.php`

- [ ] T005 Migration: Create `domain_mitigation_assessments` table — columns: `id` (bigIncrements), `uuid` (uuid, unique), `package_id` (foreignId, constrained), `domain` (string 50), `mitigation_level` (unsignedTinyInteger), `decision_prompts` (json), `override_rationale` (text, nullable), `assessed_by` (foreignId, constrained to users), `created_at` (timestamp). Index on `[package_id, domain, created_at]`. File: `database/migrations/YYYY_MM_DD_create_domain_mitigation_assessments_table.php`

- [ ] T006 Migration: Create `dignity_of_risk_declarations` table — columns: `id` (bigIncrements), `uuid` (uuid, unique), `package_id` (foreignId, constrained), `decision_maker` (string 255), `risks_accepted` (text), `explanation_given` (text), `client_response` (text), `witness` (string 255, nullable), `declared_at` (date), `revoked_at` (date, nullable), `created_by` (foreignId, constrained to users), `timestamps`. File: `database/migrations/YYYY_MM_DD_create_dignity_of_risk_declarations_table.php`

- [ ] T007 Migration: Create `dignity_of_risk_risk_area` pivot table — columns: `dignity_of_risk_declaration_id` (foreignId, constrained, cascadeOnDelete), `clinical_risk_area_id` (foreignId, constrained, cascadeOnDelete). Primary key on both columns. No timestamps. File: `database/migrations/YYYY_MM_DD_create_dignity_of_risk_risk_area_table.php`

### Enums

- [ ] T008 [P] Enum: `ClinicalDomain` — backed string enum with cases: FUNCTIONAL_ABILITY = 'functional_ability', CLINICAL_HEALTH = 'clinical_health', MENTAL_HEALTH = 'mental_health', NUTRITIONAL_SENSORY = 'nutritional_sensory', SAFETY = 'safety'. Add `label(): string` method returning human-readable names. File: `domain/Risk/Enums/ClinicalDomain.php`

- [ ] T009 [P] Enum: `ConsequenceLevel` — backed int enum with cases: NEGLIGIBLE = 0, MINOR = 1, MODERATE = 2, MAJOR = 3, EXTREME = 4. Add `label(): string` and `trafficLight(): TrafficLightStatus` methods. File: `domain/Risk/Enums/ConsequenceLevel.php`

- [ ] T010 [P] Enum: `MitigationLevel` — backed int enum with cases: NONE = 0, PARTIAL = 1, STRONG = 2. Add `label(): string` and `description(): string` methods (Strong = "controls in place, used correctly, adhered to", Partial = "controls present but inconsistently applied", None = "controls absent, refused, or ineffective"). File: `domain/Risk/Enums/MitigationLevel.php`

- [ ] T011 [P] Enum: `TrafficLightStatus` — backed string enum with cases: GREEN = 'green', AMBER = 'amber', RED = 'red'. Add static `fromResidualRisk(int $score): self` method (0-1 = GREEN, 2 = AMBER, 3-4 = RED) and `label(): string`, `colour(): string` methods. File: `domain/Risk/Enums/TrafficLightStatus.php`

### Models

- [ ] T012 Model: `ClinicalRiskArea` — fillable: `name`, `slug`, `questionnaire`, `order`. Casts: `questionnaire` → `array`, `order` → `integer`. Relationships: `domains(): HasMany(ClinicalRiskAreaDomain)`, `riskCategory(): HasOne(RiskCategory)`, `assessments(): HasMany(RiskAssessment)`, `latestAssessment(): HasOne(RiskAssessment)->latestOfMany()`, `dignityOfRiskDeclarations(): BelongsToMany(DignityOfRiskDeclaration, 'dignity_of_risk_risk_area')`. Scope: `scopeForPackage(Builder $query, int $packageId)` to eager-load package-specific assessments. File: `domain/Risk/Models/ClinicalRiskArea.php`. Use `php artisan make:model ClinicalRiskArea --no-interaction` then move to domain/Risk/Models/

- [ ] T013 Model: `ClinicalRiskAreaDomain` — fillable: `clinical_risk_area_id`, `domain`. Casts: `domain` → `ClinicalDomain`. Relationships: `clinicalRiskArea(): BelongsTo(ClinicalRiskArea)`. No timestamps (`$timestamps = false`). File: `domain/Risk/Models/ClinicalRiskAreaDomain.php`

- [ ] T014 Model: `RiskAssessment` — fillable: `uuid`, `package_id`, `clinical_risk_area_id`, `risk_id`, `questionnaire_response`, `consequence_level`, `rationale`, `assessed_by`. Casts: `consequence_level` → `ConsequenceLevel`, `uuid` → UuidCast or string. Traits: `LogsActivity`. Relationships: `package(): BelongsTo(Package)`, `clinicalRiskArea(): BelongsTo(ClinicalRiskArea)`, `risk(): BelongsTo(Risk)`, `assessor(): BelongsTo(User, 'assessed_by')`. No `updated_at` (`const UPDATED_AT = null`). Boot: auto-generate uuid on creating. File: `domain/Risk/Models/RiskAssessment.php`

- [ ] T015 Model: `DomainMitigationAssessment` — fillable: `uuid`, `package_id`, `domain`, `mitigation_level`, `decision_prompts`, `override_rationale`, `assessed_by`. Casts: `domain` → `ClinicalDomain`, `mitigation_level` → `MitigationLevel`, `decision_prompts` → `array`. Traits: `LogsActivity`. Relationships: `package(): BelongsTo(Package)`, `assessor(): BelongsTo(User, 'assessed_by')`. No `updated_at`. Boot: auto-generate uuid. File: `domain/Risk/Models/DomainMitigationAssessment.php`

- [ ] T016 Model: `DignityOfRiskDeclaration` — fillable: `uuid`, `package_id`, `decision_maker`, `risks_accepted`, `explanation_given`, `client_response`, `witness`, `declared_at`, `revoked_at`, `created_by`. Casts: `declared_at` → `date`, `revoked_at` → `date`. Traits: `LogsActivity`. Relationships: `package(): BelongsTo(Package)`, `creator(): BelongsTo(User, 'created_by')`, `clinicalRiskAreas(): BelongsToMany(ClinicalRiskArea, 'dignity_of_risk_risk_area')`. Scopes: `scopeActive($q)` → `$q->whereNull('revoked_at')`. Boot: auto-generate uuid. File: `domain/Risk/Models/DignityOfRiskDeclaration.php`

- [ ] T017 Update `RiskCategory` model — add relationship: `clinicalRiskArea(): BelongsTo(ClinicalRiskArea)`. Add `clinical_risk_area_id` to fillable. File: `domain/Risk/Models/RiskCategory.php`

### Seeder

- [ ] T018 Seeder: `ClinicalRiskAreaSeeder` — PHP array with 16 risk areas. Each entry: `['name' => '...', 'slug' => '...', 'order' => N, 'questionnaire' => [...5 items...], 'domains' => [ClinicalDomain::...], 'risk_category_label' => '...']`. The 16 risk areas from Maryanne's table: Choking & Swallowing, Continence, Falls, Mobility, Cognitive Decline, Dementia, Chronic Disease, Infection, Polypharmacy, Chronic Pain, End of Life, Mental Health, Nutrition & Hydration, Oral Health, Sensory Impairment, Pressure Injuries & Wounds. Domain mappings per spec FR-007a. Questionnaire data from `.tc-docs/content/initiatives/Clinical-And-Care-Plan/Risk-Radar/context/rich_context/clinical-risk-consequence-table.md`. After inserting ClinicalRiskArea + pivot records, update matching `risk_categories` rows with `clinical_risk_area_id` FK. File: `database/seeders/ClinicalRiskAreaSeeder.php`

### Data Classes

- [ ] T019 [P] Data: `ClinicalRiskAreaData` — properties: `id` (int), `name` (string), `slug` (string), `questionnaire` (array), `order` (int), `domains` (array of ClinicalDomain), `riskCategoryId` (?int), `hasRiskRecord` (bool), `riskId` (?int), `latestAssessment` (?RiskAssessmentData). `#[TypeScript]` decorator. `#[MapName(SnakeCaseMapper::class)]`. Static `fromModel(ClinicalRiskArea $area, ?Package $package = null): self`. File: `domain/Risk/Data/ClinicalRiskAreaData.php`

- [ ] T020 [P] Data: `RiskAssessmentData` — properties: `id` (int), `uuid` (string), `questionnaireResponse` (string), `consequenceLevel` (ConsequenceLevel), `rationale` (?string), `assessedBy` (string), `createdAt` (string). `#[TypeScript]`. `#[MapName(SnakeCaseMapper::class)]`. Static `fromModel(RiskAssessment $assessment): self`. File: `domain/Risk/Data/RiskAssessmentData.php`

- [ ] T021 [P] Data: `DomainMitigationData` — properties: `domain` (ClinicalDomain), `mitigationLevel` (MitigationLevel), `decisionPrompts` (array), `overrideRationale` (?string), `assessedBy` (string), `createdAt` (string). `#[TypeScript]`. `#[MapName(SnakeCaseMapper::class)]`. File: `domain/Risk/Data/DomainMitigationData.php`

- [ ] T022 [P] Data: `DomainScoreData` — properties: `domain` (ClinicalDomain), `label` (string), `maxConsequence` (ConsequenceLevel), `mitigationLevel` (MitigationLevel), `residualRisk` (int), `status` (TrafficLightStatus), `assessedCount` (int), `totalCount` (int), `riskAreas` (array of ClinicalRiskAreaData). `#[TypeScript]`. `#[MapName(SnakeCaseMapper::class)]`. File: `domain/Risk/Data/DomainScoreData.php`

- [ ] T023 [P] Data: `DignityOfRiskData` — properties: `id` (int), `uuid` (string), `decisionMaker` (string), `risksAccepted` (string), `explanationGiven` (string), `clientResponse` (string), `witness` (?string), `declaredAt` (string), `revokedAt` (?string), `clinicalRiskAreaIds` (array of int). `#[TypeScript]`. `#[MapName(SnakeCaseMapper::class)]`. File: `domain/Risk/Data/DignityOfRiskData.php`

- [ ] T024 [P] Data: `StoreRiskAssessmentData` — validation DTO for assessment store. Properties: `questionnaireResponse` (string, required), `consequenceLevel` (int, required, between 0-4), `rationale` (?string). `#[MapName(SnakeCaseMapper::class)]`. File: `domain/Risk/Data/StoreRiskAssessmentData.php`

- [ ] T025 [P] Data: `StoreDomainMitigationData` — validation DTO for mitigation store. Properties: `mitigationLevel` (int, required, between 0-2), `decisionPrompts` (array, required), `overrideRationale` (?string, required_if mitigation differs from calculated). `#[MapName(SnakeCaseMapper::class)]`. File: `domain/Risk/Data/StoreDomainMitigationData.php`

- [ ] T026 [P] Data: `StoreDignityOfRiskData` — validation DTO for DOR store. Properties: `decisionMaker` (string, required), `risksAccepted` (string, required), `explanationGiven` (string, required), `clientResponse` (string, required), `witness` (?string), `declaredAt` (date, required), `clinicalRiskAreaIds` (array of int, required, min 1, each exists:clinical_risk_areas). `#[MapName(SnakeCaseMapper::class)]`. File: `domain/Risk/Data/StoreDignityOfRiskData.php`

### Feature Flag

- [ ] T027 Feature flag: `RiskRadarFeature` — Laravel Pennant feature class, scoped to Organisation. `resolve(Organisation $organisation): bool` returns false by default. File: `domain/Risk/Features/RiskRadarFeature.php`. Register in appropriate service provider. Sync permissions: `php artisan sync:roles-permissions`

### Shared Frontend Types

- [ ] T028 [P] TypeScript types: Create `resources/js/types/Risk/riskRadar.ts` with all types from plan.md § Frontend Component Architecture: `ClinicalDomain`, `ConsequenceLevel`, `MitigationLevel`, `TrafficLightStatus`, `ClinicalRiskAreaData`, `QuestionnaireOption`, `RiskAssessmentData`, `DomainMitigationData`, `DomainScore`, `DignityOfRiskData`. Export all types

### Phase 1 Tests

- [ ] T029 Test: `ClinicalRiskAreaTest` — unit test verifying: model creates with all fields, `domains()` relationship returns ClinicalRiskAreaDomain records, `riskCategory()` returns related RiskCategory, `assessments()` returns RiskAssessment records, `latestAssessment()` returns most recent. File: `tests/Unit/Risk/Models/ClinicalRiskAreaTest.php`. Use `php artisan make:test --pest --unit Risk/Models/ClinicalRiskAreaTest --no-interaction`

- [ ] T030 Test: `ClinicalRiskAreaSeederTest` — feature test verifying: seeder creates 16 risk areas, each has 5 questionnaire options, domain pivot records match FR-007a mapping (Falls → functional_ability + safety), 16 risk_categories have non-null clinical_risk_area_id, 12 risk_categories have null clinical_risk_area_id. File: `tests/Feature/Risk/Seeders/ClinicalRiskAreaSeederTest.php`

- [ ] T031 [P] Test: `EnumTest` — unit tests for all 4 enums. `TrafficLightStatus::fromResidualRisk(0)` → GREEN, `fromResidualRisk(2)` → AMBER, `fromResidualRisk(4)` → RED. `ConsequenceLevel::trafficLight()` returns correct status. `MitigationLevel::description()` returns correct text. File: `tests/Unit/Risk/Enums/RiskEnumTest.php`

- [ ] T032 Run migrations and seeder: `php artisan migrate --no-interaction && php artisan db:seed --class=ClinicalRiskAreaSeeder --no-interaction`. Then run Phase 1 tests: `php artisan test --compact --filter=ClinicalRiskArea` and `php artisan test --compact --filter=RiskEnum`

---

## Phase 2: Risk Cards + Split View (All Risks Tab)

### Backend

- [ ] T033 Update `RiskData` — add properties: `clinicalRiskAreaId` (?int), `latestConsequenceLevel` (?ConsequenceLevel), `trafficLightStatus` (?TrafficLightStatus), `hasClinicalRiskArea` (bool). Update `fromModel()` to populate from `$risk->riskCategory->clinicalRiskArea` and latest assessment. File: `domain/Risk/Data/RiskData.php`

- [ ] T034 Update `RiskCategoryData` — add property: `clinicalRiskAreaId` (?int). Update `fromModel()`. File: `domain/Risk/Data/RiskCategoryData.php`

- [ ] T035 Extend risk tab data loading — in the controller/action that assembles the package risk tab data, eager-load `riskCategory.clinicalRiskArea` on risks query. Add `with(['riskCategory.clinicalRiskArea.latestAssessments' => fn ($q) => $q->where('package_id', $package->id)])`. Find the file that provides `tabData` to `PackageRisks.vue` and update the risks query. File: likely `domain/Package/Http/Controllers/PackageController.php` or a dedicated tab data action — grep for `PackageRisks` render

### Frontend — All Risks Components

- [ ] T036 Create `AllRisks.vue` — parent component: flex container with `w-3/5` left panel + `w-2/5` right panel + `h-[calc(100vh-var(--header-height))]`. State: `selectedRiskId` ref. Props: `type Props = { risks: Domain.Risk.Data.RiskData[], package: Domain.Package.Data.PackageData }`. Renders `RiskList` (left) and `RiskDetail` (right). Shows `EmptyState` when no risks. File: `resources/js/Pages/Packages/Risks/AllRisks/AllRisks.vue`

- [ ] T037 Create `RiskList.vue` — left panel: summary stats bar at top (total risks count, assessed count), scrollable `overflow-y-auto` list of `RiskRow` components. Props: `type Props = { risks: Domain.Risk.Data.RiskData[], selectedRiskId: number | null }`. Emits: `type Emits = { (e: 'select', riskId: number): void }`. File: `resources/js/Pages/Packages/Risks/AllRisks/RiskList.vue`

- [ ] T038 Create `RiskRow.vue` — single risk row: severity dot (traffic-light colour from `trafficLightStatus`), risk category name, consequence badge (CommonBadge with level 0-4), domain label if clinicalRiskArea exists, last updated date. Selected state: `border-l-2 border-teal-700 bg-teal-50`. Click emits `select`. Props: `type Props = { risk: Domain.Risk.Data.RiskData, isSelected: boolean }`. File: `resources/js/Pages/Packages/Risks/AllRisks/RiskRow.vue`

- [ ] T039 Create `RiskDetail.vue` — right panel detail for selected risk. Shows nothing or prompt when no risk selected. Sub-components: `PropertiesGrid`, `DetailsSection`, `CheckInAccordion` (feature-flagged), `ActionBar`. Props: `type Props = { risk: Domain.Risk.Data.RiskData, package: Domain.Package.Data.PackageData }`. File: `resources/js/Pages/Packages/Risks/AllRisks/RiskDetail.vue`

- [ ] T040 Create `PropertiesGrid.vue` — 2-column `grid grid-cols-2 gap-4` showing: Domain (if mapped), Consequence (badge), Need, Care Plan (yes/no), Last Updated. Uses `CommonDefinitionList` + `CommonDefinitionItem` with `title` prop. Props: `type Props = { risk: Domain.Risk.Data.RiskData }`. File: `resources/js/Pages/Packages/Risks/AllRisks/PropertiesGrid.vue`

- [ ] T041 Create `DetailsSection.vue` — details text + action plan text, each truncated to 3 lines with "Show more" toggle. Uses `ref<boolean>` for expand state. Props: `type Props = { details: string | null, actionPlan: string | null }`. File: `resources/js/Pages/Packages/Risks/AllRisks/DetailsSection.vue`

- [ ] T042 Create `CheckInAccordion.vue` — `CommonCollapsible` wrapping check-in questions list. Header shows "Check-In Questions (N)". Each question shows text + answer type badge (CommonBadge: blue=Free Text, green=Yes/No, purple=MC, orange=Rating). Feature-flagged: only render when CarePartnerCheckInsFeature is enabled (check via `HasFeatureFlag` or usePage().props). Props: `type Props = { risk: Domain.Risk.Data.RiskData }`. File: `resources/js/Pages/Packages/Risks/AllRisks/CheckInAccordion.vue`

- [ ] T043 Create `ActionBar.vue` — row of `CommonButton` components: View (ghost, eye icon), Edit (ghost, pencil icon), Assess (primary, only if risk has clinicalRiskArea), Delete (ghost danger, trash icon). Assess opens assessment modal via `router.visit()`. Edit opens risk edit modal. View opens risk show modal. Delete opens `CommonConfirmDialog`. Props: `type Props = { risk: Domain.Risk.Data.RiskData, package: Domain.Package.Data.PackageData }`. Emits: `type Emits = { (e: 'delete', riskId: number): void }`. File: `resources/js/Pages/Packages/Risks/AllRisks/ActionBar.vue`

- [ ] T044 Create `EmptyState.vue` — uses `CommonEmptyPlaceholder` with message "No risks added yet" and "Add a Risk" button that opens create modal. File: `resources/js/Pages/Packages/Risks/AllRisks/EmptyState.vue`

- [ ] T045 Create `CommonTrafficLightBadge.vue` — reusable component: dot + label. Props: `type Props = { status: 'green' | 'amber' | 'red' | null }`. When null, shows "Not assessed" in gray. Colour mapping: green → `bg-green-500`, amber → `bg-amber-500`, red → `bg-red-500`. Uses `CommonBadge` internally with appropriate `colour` prop. File: `resources/js/Components/Common/CommonTrafficLightBadge.vue`

- [ ] T046 Update `PackageRisks.vue` — replace PrimeVue DataTable import and usage with `AllRisks` component. Add `CommonTabs` with items `[{title: 'All Risks'}, {title: 'Risk Radar'}]`. Risk Radar tab content is placeholder for Phase 6. Remove PrimeVue DataTable and Column imports. Add `<script setup lang="ts">` if not already present. File: `resources/js/Pages/Packages/tabs/PackageRisks.vue`

### Phase 2 Tests

- [ ] T047 Test: Feature test verifying risk tab renders `AllRisks` component (not DataTable). Navigate to package risk tab, assert response contains risk card elements. File: `tests/Feature/Risk/Http/Controllers/PackageRiskTabTest.php`

- [ ] T048 Run Phase 2 tests + pint: `vendor/bin/pint --dirty && php artisan test --compact --filter=PackageRiskTab`

---

## Phase 3: Step-Based Risk Form

### Frontend

- [ ] T049 Create `RiskFormModal.vue` — Inertia modal parent. Owns `useForm()` with all PackageRiskData fields as single source of truth. `CommonStepNavigation` with steps array: `[{label: 'Basics', status}, {label: 'Details', status}, {label: 'Check-In Questions', status}]`. Step 2 conditional on category having fields + not "not identified". Step 3 conditional on edit mode + CarePartnerCheckInsFeature. Submit on final step calls `form.post()` (create) or `form.put()` (edit). Props: `type Props = { package: Domain.Package.Data.PackageData, options: Domain.Package.Data.PackageRiskOptions, risk?: Domain.Risk.Data.RiskData }`. File: `resources/js/Pages/Packages/Risks/Form/RiskFormModal.vue`

- [ ] T050 Create `StepBasics.vue` — Step 1 fields: Risk Category (CommonSelectMenu from options.risk_categories, `value-key="value"`), Need (CommonSelectMenu from options.package_needs), Add to Care Plan (checkbox), Not Identified During Assessment (checkbox), Details (CommonTextarea), Action Plan (CommonTextarea). Per-step validation: category required. Props: `type Props = { form: InertiaForm, options: Domain.Package.Data.PackageRiskOptions }`. Emits: `type Emits = { (e: 'validate'): boolean }`. File: `resources/js/Pages/Packages/Risks/Form/StepBasics.vue`

- [ ] T051 Create `StepDetails.vue` — Step 2: dynamically renders the correct section component based on selected risk category. Import existing section components from `resources/js/Components/Staff/Risks/` (WoundManagement, Falls, MedicationSafety, etc.). Map category ID → component. If no category selected or category has no fields, show "No additional details for this category". Props: `type Props = { form: InertiaForm, options: Domain.Package.Data.PackageRiskOptions }`. File: `resources/js/Pages/Packages/Risks/Form/StepDetails.vue`

- [ ] T052 Create `StepCheckInQuestions.vue` — Step 3 (edit only): question management. Install vuedraggable: `npm install vuedraggable@^4`. List existing questions with drag handles, add question button, delete question. Each question shows text input + answer type selector. Uses vuedraggable for reorder. Props: `type Props = { risk: Domain.Risk.Data.RiskData, package: Domain.Package.Data.PackageData }`. File: `resources/js/Pages/Packages/Risks/Form/StepCheckInQuestions.vue`

- [ ] T053 Update `PackageRiskController@create` — change `Inertia::modal()` render target from current RiskForm to new `Packages/Risks/Form/RiskFormModal`. Ensure `baseRoute()` still points to package.show with tab=risks. File: `domain/Package/Http/Controllers/PackageRiskController.php`

- [ ] T054 Update `PackageRiskController@edit` — same change: render `Packages/Risks/Form/RiskFormModal` instead of current form component. Pass `risk` prop. File: `domain/Package/Http/Controllers/PackageRiskController.php`

### Phase 3 Tests

- [ ] T055 Test: Feature test for step form — create risk via step form, verify all 3 steps accessible on edit, verify Step 2 skipped for category with no fields, verify Step 3 hidden on create. File: `tests/Feature/Risk/Http/Controllers/PackageRiskFormTest.php`

- [ ] T056 Run Phase 3 tests + pint: `vendor/bin/pint --dirty && php artisan test --compact --filter=PackageRiskForm`

---

## Phase 4: Consequence Assessment

### Backend

- [ ] T057 Routes: Register assessment routes in `domain/Package/Routes/packageRoutes.php` (or dedicated risk routes file). Add: `Route::get('risk-assessments/{clinicalRiskArea}', [RiskAssessmentController::class, 'show'])->name('packages.risk-assessments.show')`, `Route::post('risk-assessments/{clinicalRiskArea}', [RiskAssessmentController::class, 'store'])->name('packages.risk-assessments.store')`, `Route::get('risk-assessments', [RiskAssessmentController::class, 'index'])->name('packages.risk-assessments.index')`. All with `->middleware(['user.permission:manage-risks'])`

- [ ] T058 Routes: Add "Add & Assess" route: `Route::post('risks/add-and-assess/{clinicalRiskArea}', [PackageRiskController::class, 'addAndAssess'])->name('packages.risks.add-and-assess')` with `manage-risks` middleware

- [ ] T059 Controller: `RiskAssessmentController` — `show(Package $package, ClinicalRiskArea $clinicalRiskArea)`: return `Inertia::modal('Packages/Risks/Assessment/AssessmentModal')` with props: `clinicalRiskArea` (ClinicalRiskAreaData with questionnaire), `currentAssessment` (latest RiskAssessmentData or null), `package`. `store(Package $package, ClinicalRiskArea $clinicalRiskArea, StoreRiskAssessmentData $data)`: call AssessRiskArea action, redirect back. `index(Package $package)`: return modal with all 16 ClinicalRiskAreaData for "Assess All" wizard. Use `baseRoute('packages.show', [$package, 'tab' => 'risks'])`. File: `domain/Risk/Http/Controllers/RiskAssessmentController.php`

- [ ] T060 Action: `AssessRiskArea` — Lorisleiva AsAction. `handle(Package $package, ClinicalRiskArea $clinicalRiskArea, StoreRiskAssessmentData $data, User $user): RiskAssessment`. Find existing risk record for this category on this package (via `riskCategory->clinical_risk_area_id`). Create new `RiskAssessment` record (versioned — always insert, never update). Fire `RiskAreaAssessed` event through `PackageRiskAggregate`. `authorize(ActionRequest $request): Response` → check `manage-risks` permission. File: `domain/Risk/Actions/AssessRiskArea.php`

- [ ] T061 Action: `AddAndAssessRisk` — Lorisleiva AsAction. `handle(Package $package, ClinicalRiskArea $clinicalRiskArea, User $user): RedirectResponse`. Get the `RiskCategory` linked to this `ClinicalRiskArea`. Create minimal risk record via `PackageRiskAggregate` with: `risk_category_id`, `details` = null, `action_plan` = '', `add_to_care_plan` = true. Then redirect to `packages.risk-assessments.show` for the same clinicalRiskArea. File: `domain/Risk/Actions/AddAndAssessRisk.php`

- [ ] T062 Event: `RiskAreaAssessed` — stored event in `domain/Risk/EventSourcing/Events/`. Properties: `packageId` (int), `clinicalRiskAreaId` (int), `riskId` (?int), `consequenceLevel` (int), `questionnaireResponse` (string), `rationale` (?string), `assessedBy` (int). File: `domain/Risk/EventSourcing/Events/RiskAreaAssessed.php`

- [ ] T063 Projector: Update `PackageRiskProjector` — add `onRiskAreaAssessed(RiskAreaAssessed $event)` method that inserts into `risk_assessments` table. OR create `RiskAssessmentProjector` if preferred separation. Remember to rebuild cache: `rm bootstrap/cache/event-handlers.php && php artisan event-sourcing:cache-event-handlers`. File: `domain/Risk/EventSourcing/Projectors/PackageRiskProjector.php`

### Frontend

- [ ] T064 Create `AssessmentModal.vue` — dark overlay modal (`bg-gray-900/80 fixed inset-0 z-50 flex items-center justify-center`). White card centered. Shows risk area name, current consequence (if reassessing). Renders 5 `ConsequenceCard` components (one per level). `useForm()` with fields: `questionnaire_response`, `consequence_level`, `rationale`. On card click → set form fields → `form.post(route('packages.risk-assessments.store', [package.id, clinicalRiskArea.id]))`. For "Assess All" mode: receives array of clinicalRiskAreas, tracks `currentIndex` ref, on save success advances to next. Each save is an individual POST (save on "Save & Next"). Props: `type Props = { clinicalRiskArea: ClinicalRiskAreaData, package: Domain.Package.Data.PackageData, clinicalRiskAreas?: ClinicalRiskAreaData[] }`. File: `resources/js/Pages/Packages/Risks/Assessment/AssessmentModal.vue`

- [ ] T065 Create `ConsequenceCard.vue` — clickable card for each consequence level. Shows: level number (0-4), level label (Negligible/Minor/Moderate/Major/Extreme), questionnaire response text. Selected state: `border-2 border-teal-700 bg-teal-50`. Keyboard shortcut: listen for keys 1-5 mapping to levels 0-4. Props: `type Props = { level: number, label: string, response: string, isSelected: boolean }`. Emits: `type Emits = { (e: 'select', level: number, response: string): void }`. File: `resources/js/Pages/Packages/Risks/Assessment/ConsequenceCard.vue`

- [ ] T066 Create `ProgressDots.vue` — dot-style progress indicator for "Assess All" wizard. Shows 16 dots: filled (completed), current (active/pulsing), empty (remaining). Props: `type Props = { total: number, current: number, completed: number[] }`. File: `resources/js/Pages/Packages/Risks/Assessment/ProgressDots.vue`

- [ ] T067 Wire "Assess" button in `ActionBar.vue` — when clinicalRiskArea exists on risk, show "Assess" (or "Reassess" if has assessment) button that navigates to `route('packages.risk-assessments.show', [package.id, clinicalRiskAreaId])`. File: `resources/js/Pages/Packages/Risks/AllRisks/ActionBar.vue`

### Phase 4 Tests

- [ ] T068 Test: `AssessRiskAreaTest` — feature test: POST assessment creates `risk_assessments` record with correct fields. POST again creates second record (versioned). Verify `manage-risks` permission required. File: `tests/Feature/Risk/Actions/AssessRiskAreaTest.php`

- [ ] T069 Test: `AddAndAssessRiskTest` — feature test: POST creates minimal risk record + redirects to assessment. Verify risk has `risk_category_id` set, no details. File: `tests/Feature/Risk/Actions/AddAndAssessRiskTest.php`

- [ ] T070 Test: `RiskAssessmentControllerTest` — feature test: GET show returns modal with questionnaire data. POST store creates record. GET index returns all 16 areas. Permission checks. File: `tests/Feature/Risk/Http/Controllers/RiskAssessmentControllerTest.php`

- [ ] T071 Run Phase 4 tests + pint: `vendor/bin/pint --dirty && php artisan test --compact --filter=RiskAssessment && php artisan test --compact --filter=AddAndAssess`

---

## Phase 5: Mitigation Assessment + Residual Risk

### Backend

- [ ] T072 Routes: Register mitigation routes. `Route::get('domain-mitigations/{domain}', [DomainMitigationController::class, 'show'])->name('packages.domain-mitigations.show')`, `Route::post('domain-mitigations/{domain}', [DomainMitigationController::class, 'store'])->name('packages.domain-mitigations.store')`. With `manage-risks` middleware. The `{domain}` is a string matching ClinicalDomain enum values

- [ ] T073 Controller: `DomainMitigationController` — `show(Package $package, string $domain)`: validate $domain is valid ClinicalDomain value. Return `Inertia::modal('Packages/Risks/Assessment/DomainMitigationModal')` with props: domain, current mitigation (latest DomainMitigationAssessment for this domain), risk areas in domain with their assessments, active DOR declarations for risk areas in this domain, decision prompts for the domain. `store(Package $package, string $domain, StoreDomainMitigationData $data)`: call AssessDomainMitigation action, redirect back. File: `domain/Risk/Http/Controllers/DomainMitigationController.php`

- [ ] T074 Action: `AssessDomainMitigation` — Lorisleiva AsAction. `handle(Package $package, ClinicalDomain $domain, StoreDomainMitigationData $data, User $user): DomainMitigationAssessment`. Create new `DomainMitigationAssessment` record. Fire `DomainMitigationAssessed` event through `PackageRiskAggregate`. File: `domain/Risk/Actions/AssessDomainMitigation.php`

- [ ] T075 Action: `CalculateDomainScores` — Lorisleiva AsAction. `handle(Package $package): array<DomainScoreData>`. For each ClinicalDomain: get all ClinicalRiskAreas in that domain, get latest RiskAssessment for each (for this package), find max consequence level, get latest DomainMitigationAssessment for this domain, calculate residual = max(consequence) - mitigation (floor 0), determine TrafficLightStatus. Return array of 5 DomainScoreData. Also compute overall traffic-light (highest domain status). File: `domain/Risk/Actions/CalculateDomainScores.php`

- [ ] T076 Event: `DomainMitigationAssessed` — stored event. Properties: `packageId` (int), `domain` (string), `mitigationLevel` (int), `decisionPrompts` (array), `overrideRationale` (?string), `assessedBy` (int). File: `domain/Risk/EventSourcing/Events/DomainMitigationAssessed.php`

- [ ] T077 Projector: Add `onDomainMitigationAssessed()` method to projector — inserts into `domain_mitigation_assessments`. Rebuild cache after. File: update `PackageRiskProjector.php` or `RiskAssessmentProjector.php`

### Frontend

- [ ] T078 Create `DomainMitigationModal.vue` — modal for mitigation assessment. Shows domain name, risk areas in domain with their consequence scores, decision prompts (from spec FR-003a), 3 radio options: Strong (2), Partial (1), None (0) with descriptions. Override rationale textarea (required if override). Active DOR declarations shown as contextual cards. `useForm()` with `mitigation_level`, `decision_prompts`, `override_rationale`. Props: `type Props = { domain: ClinicalDomain, package: Domain.Package.Data.PackageData, riskAreas: ClinicalRiskAreaData[], currentMitigation: DomainMitigationData | null, dignityOfRiskDeclarations: DignityOfRiskData[] }`. File: `resources/js/Pages/Packages/Risks/Assessment/DomainMitigationModal.vue`

- [ ] T079 Create `useTrafficLight.ts` composable — `const useTrafficLight = () => { const getStatus = (score: number): TrafficLightStatus => score <= 1 ? 'green' : score === 2 ? 'amber' : 'red'; const getColour = (status: TrafficLightStatus) => ...; const getLabel = (status: TrafficLightStatus) => ...; return { getStatus, getColour, getLabel } }`. File: `resources/js/composables/useTrafficLight.ts`

### Phase 5 Tests

- [ ] T080 Test: `AssessDomainMitigationTest` — feature test: POST creates record, override requires rationale, permission check. File: `tests/Feature/Risk/Actions/AssessDomainMitigationTest.php`

- [ ] T081 Test: `CalculateDomainScoresTest` — unit test: package with Falls Major(3) + Strong(2) → residual 1 (GREEN). Package with Falls Extreme(4) + None(0) → residual 4 (RED). All unassessed → no score. Single Red domain drives overall to Red. File: `tests/Unit/Risk/Actions/CalculateDomainScoresTest.php`

- [ ] T082 Test: `DomainMitigationControllerTest` — feature test: GET show returns modal. POST store creates record. Permission checks. File: `tests/Feature/Risk/Http/Controllers/DomainMitigationControllerTest.php`

- [ ] T083 Run Phase 5 tests + pint: `vendor/bin/pint --dirty && php artisan test --compact --filter=DomainMitigation && php artisan test --compact --filter=CalculateDomainScores`

---

## Phase 6: Risk Radar Visualisation

### Backend

- [ ] T084 Extend package risk tab data — add deferred props for Risk Radar sub-tab. In the controller/action that assembles tab data, add Inertia deferred props: `clinicalRiskAreas` (all 16 with package-specific assessments), `domainScores` (from CalculateDomainScores action), `domainMitigations`, `dignityOfRiskDeclarations`. These load only when Risk Radar sub-tab is activated. Use `Inertia::defer()` or `Inertia::lazy()` per Inertia v2 docs. Gate behind RiskRadarFeature flag

### Frontend

- [ ] T085 Create `RiskRadar.vue` — parent: receives deferred `domainScores: DomainScore[]`, `clinicalRiskAreas`, `dignityOfRiskDeclarations`. Chart toggle (CommonTabs: Radar / Bar). Renders RadarChart or BarChart based on toggle. Below chart: DomainGroup list. Shows `UnassessedBanner` when < 16 assessed. Props: `type Props = { domainScores: DomainScore[], clinicalRiskAreas: ClinicalRiskAreaData[], dignityOfRiskDeclarations: DignityOfRiskData[], package: Domain.Package.Data.PackageData }`. Show skeleton/spinner while deferred data loads. File: `resources/js/Pages/Packages/Risks/RiskRadar/RiskRadar.vue`

- [ ] T086 Create `RadarChart.vue` — Chart.js radar chart using canvas ref + `onMounted()`. 5 axes (one per ClinicalDomain label). Data: residual risk scores. Ghost outline (light gray) for all 5 axes at max value. Filled area with traffic-light colours per domain. Tooltip on hover showing domain name + score + status. Click on axis → emit domain select. Props: `type Props = { domainScores: DomainScore[] }`. Emits: `type Emits = { (e: 'selectDomain', domain: ClinicalDomain): void }`. Import `Chart, RadarController, RadialLinearScale, PointElement, LineElement, Filler, Tooltip` from 'chart.js' and register them. File: `resources/js/Pages/Packages/Risks/RiskRadar/RadarChart.vue`

- [ ] T087 Create `BarChart.vue` — horizontal bar chart. One bar per domain showing: consequence (red portion), mitigation (green reduction), residual (remaining). Labels on left (domain names). Values on right. Props: `type Props = { domainScores: DomainScore[] }`. Emits: `type Emits = { (e: 'selectDomain', domain: ClinicalDomain): void }`. Can use Chart.js horizontal bar or pure Tailwind divs with width percentages. File: `resources/js/Pages/Packages/Risks/RiskRadar/BarChart.vue`

- [ ] T088 Create `DomainGroup.vue` — collapsible domain section (CommonCollapsible). Header: domain name + traffic-light badge + "X of Y assessed". Expanded: list of RiskAreaCard components sorted by consequence (highest first, FR-018a). Props: `type Props = { domainScore: DomainScore, package: Domain.Package.Data.PackageData }`. File: `resources/js/Pages/Packages/Risks/RiskRadar/DomainGroup.vue`

- [ ] T089 Create `RiskAreaCard.vue` — individual risk area in domain drill-down. Shows: name, consequence badge (0-4 with traffic-light colour), questionnaire response text, "Assess" or "Reassess" button, "Add & Assess" if no risk record. DOR badge if linked to active DOR. Props: `type Props = { riskArea: ClinicalRiskAreaData, package: Domain.Package.Data.PackageData, hasDignityOfRisk: boolean }`. File: `resources/js/Pages/Packages/Risks/RiskRadar/RiskAreaCard.vue`

- [ ] T090 Create `UnassessedBanner.vue` — persistent banner: "X of 16 risk areas assessed. Assess remaining risks to complete the Risk Radar." with "Assess All" button linking to `route('packages.risk-assessments.index', [package.id])`. Props: `type Props = { assessedCount: number, totalCount: number, package: Domain.Package.Data.PackageData }`. File: `resources/js/Pages/Packages/Risks/RiskRadar/UnassessedBanner.vue`

- [ ] T091 Update `PackageRisks.vue` — wire Risk Radar sub-tab content to render `RiskRadar` component with deferred props. Show skeleton loader while data loads. Gate visibility behind `HasFeatureFlag` for RiskRadarFeature. File: `resources/js/Pages/Packages/tabs/PackageRisks.vue`

- [ ] T092 Add traffic-light badge to package risk profile header — in the package header/risk tab area, add `CommonTrafficLightBadge` showing overall status (highest domain status). Gate behind RiskRadarFeature flag. Find the header component and add the badge. File: likely `resources/js/Pages/Packages/tabs/PackageRisks.vue` or package header component

### Phase 6 Tests

- [ ] T093 Test: Feature test — Risk Radar sub-tab renders when RiskRadarFeature ON. Returns 5 domain scores. Hidden when flag OFF. File: `tests/Feature/Risk/Http/Controllers/RiskRadarTabTest.php`

- [ ] T094 Run Phase 6 tests + pint: `vendor/bin/pint --dirty && php artisan test --compact --filter=RiskRadarTab`

---

## Phase 7: Dignity of Risk

### Backend

- [ ] T095 Routes: Register DOR routes. `Route::resource('dignity-of-risk', DignityOfRiskController::class)->only(['create', 'store', 'show', 'update'])->middleware(['user.permission:manage-risks'])`. Route names: `packages.dignity-of-risk.*`

- [ ] T096 Controller: `DignityOfRiskController` — `create(Package $package)`: return modal with `clinicalRiskAreas` (all 16). `store(Package $package, StoreDignityOfRiskData $data)`: call CreateDignityOfRisk action, redirect back. `show(Package $package, DignityOfRiskDeclaration $dignityOfRisk)`: return modal with declaration + linked risk areas. `update(Package $package, DignityOfRiskDeclaration $dignityOfRisk, ...)`: for revocation, set `revoked_at`. File: `domain/Risk/Http/Controllers/DignityOfRiskController.php`

- [ ] T097 Action: `CreateDignityOfRisk` — Lorisleiva AsAction. Creates DignityOfRiskDeclaration + syncs clinicalRiskArea pivot. Fires `DignityOfRiskDeclared` event. File: `domain/Risk/Actions/CreateDignityOfRisk.php`

- [ ] T098 Action: `RevokeDignityOfRisk` — Lorisleiva AsAction. Sets `revoked_at` on declaration. Fires `DignityOfRiskRevoked` event. File: `domain/Risk/Actions/RevokeDignityOfRisk.php`

- [ ] T099 Events: `DignityOfRiskDeclared` and `DignityOfRiskRevoked` — stored events with appropriate properties. Files: `domain/Risk/EventSourcing/Events/DignityOfRiskDeclared.php`, `domain/Risk/EventSourcing/Events/DignityOfRiskRevoked.php`

- [ ] T100 Projector: Add `onDignityOfRiskDeclared()` and `onDignityOfRiskRevoked()` methods. Insert/update `dignity_of_risk_declarations` + sync pivot. Rebuild cache

### Frontend

- [ ] T101 Create `DignityOfRiskModal.vue` — Inertia modal for DOR CRUD. `useForm()` with fields matching StoreDignityOfRiskData. Multi-select for clinical risk areas (CommonSelectMenu with multiple). Date picker for `declared_at`. View mode shows all declaration details + linked risk areas. Revoke button sets `revoked_at`. Props: `type Props = { package: Domain.Package.Data.PackageData, clinicalRiskAreas: ClinicalRiskAreaData[], declaration?: DignityOfRiskData }`. File: `resources/js/Pages/Packages/Risks/DignityOfRisk/DignityOfRiskModal.vue`

- [ ] T102 Update `RiskRow.vue` — add DOR badge (CommonBadge with "Dignity of Risk" text, teal colour) when risk's clinicalRiskArea is linked to an active DOR declaration. Pass DOR status via props. File: `resources/js/Pages/Packages/Risks/AllRisks/RiskRow.vue`

- [ ] T103 Update `RiskAreaCard.vue` — add same DOR badge when `hasDignityOfRisk` is true. File: `resources/js/Pages/Packages/Risks/RiskRadar/RiskAreaCard.vue`

- [ ] T104 Update `DomainMitigationModal.vue` — show active DOR declarations as contextual information cards during mitigation assessment. Already has `dignityOfRiskDeclarations` in props from T078

### Phase 7 Tests

- [ ] T105 Test: `CreateDignityOfRiskTest` — feature test: POST creates record + pivot entries. Multiple risk areas linked. Permission check. File: `tests/Feature/Risk/Actions/CreateDignityOfRiskTest.php`

- [ ] T106 Test: `RevokeDignityOfRiskTest` — feature test: revoke sets `revoked_at`, badge disappears. File: `tests/Feature/Risk/Actions/RevokeDignityOfRiskTest.php`

- [ ] T107 Test: `DignityOfRiskControllerTest` — feature test: CRUD operations. File: `tests/Feature/Risk/Http/Controllers/DignityOfRiskControllerTest.php`

- [ ] T108 Run Phase 7 tests + pint: `vendor/bin/pint --dirty && php artisan test --compact --filter=DignityOfRisk`

---

## Phase 8: Feature Flag + Polish

### Backend

- [ ] T109 Add `check.feature.flag:RiskRadarFeature` middleware to assessment routes (T057), mitigation routes (T072), and DOR routes (T095). Ensure routes are accessible only when flag ON for the user's organisation

- [ ] T110 Gate radar data loading — in the controller/action that loads deferred Risk Radar data (T084), wrap in `Feature::for($organisation)->active(RiskRadarFeature::class)` check. Return empty arrays when flag OFF

### Frontend

- [ ] T111 Wrap Risk Radar sub-tab in `HasFeatureFlag` — only show the "Risk Radar" tab item in CommonTabs when flag is ON. When OFF, only "All Risks" tab shows (existing behaviour). File: `resources/js/Pages/Packages/tabs/PackageRisks.vue`

- [ ] T112 Wrap "Assess" button on risk cards in feature flag check — only show when RiskRadarFeature ON. Standard risk actions (view, edit, delete) always visible. File: `resources/js/Pages/Packages/Risks/AllRisks/ActionBar.vue`

- [ ] T113 Wrap traffic-light badge in header in feature flag check. File: wherever T092 placed the badge

- [ ] T114 Add contextual help tooltips — FR-022: tooltip on consequence levels ("Negligible through Extreme with clinical action guidance"). FR-023: tooltip on mitigation levels. FR-024: tooltip on traffic-light badge. FR-025: tooltip on radar chart. Use `CommonTooltip` or title attributes. Files: `ConsequenceCard.vue`, `DomainMitigationModal.vue`, `CommonTrafficLightBadge.vue`, `RadarChart.vue`

- [ ] T115 Add keyboard navigation — arrow keys to navigate risk list (up/down changes selected risk in AllRisks), Enter to open selected risk detail actions, Q to toggle check-in questions accordion, A to open assessment. Add `@keydown` listeners on AllRisks parent. File: `resources/js/Pages/Packages/Risks/AllRisks/AllRisks.vue`

- [ ] T116 Verify flag OFF behaviour — ensure when RiskRadarFeature is OFF: All Risks tab shows standard cards (no consequence badges, no assess button, no traffic-light), Risk Radar sub-tab hidden, existing risk CRUD unchanged. This is a manual verification + feature test

### Phase 8 Tests

- [ ] T117 Test: `RiskRadarFeatureFlagTest` — feature test: flag OFF → risk tab renders without radar sub-tab, assessment routes return 403, mitigation routes return 403. Flag ON → all features available. Toggle flag → assessment data preserved. File: `tests/Feature/Risk/Features/RiskRadarFeatureFlagTest.php`

- [ ] T118 Test: Flag interaction matrix — test all 4 combinations: (CheckIns OFF + Radar OFF), (CheckIns ON + Radar OFF), (CheckIns OFF + Radar ON), (CheckIns ON + Radar ON). Verify each combination shows correct UI elements. File: `tests/Feature/Risk/Features/RiskRadarFlagMatrixTest.php`

### Final

- [ ] T119 Run full test suite: `php artisan test --compact` — all Risk Radar tests must pass

- [ ] T120 Run pint: `vendor/bin/pint --dirty` — fix any remaining style issues

- [ ] T121 Run npm build: `npm run build` — verify no TypeScript errors, Vite manifest generates correctly

- [ ] T122 Rebuild event sourcing cache: `rm bootstrap/cache/event-handlers.php && php artisan event-sourcing:cache-event-handlers` — verify all new projectors registered
