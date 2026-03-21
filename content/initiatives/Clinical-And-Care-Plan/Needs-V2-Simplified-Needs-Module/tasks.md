---
title: "Implementation Tasks: Simplified Needs Module (Needs v2)"
---

# Implementation Tasks: Simplified Needs Module (Needs v2)

**Plan**: [plan.md](plan.md) | **Spec**: [spec.md](spec.md) | **Data Model**: [data-model.md](data-model.md)
**Generated**: 2026-02-13

---

## Summary

| Metric | Value |
|--------|-------|
| Total tasks | 58 |
| Phase 1 (Setup) | 4 |
| Phase 2 (Foundation) | 16 |
| Phase 3 (US1 — Create a Need) | 11 |
| Phase 4 (US2 — Link Risks) | 5 |
| Phase 5 (US3 — Associate Budget Items) | 5 |
| Phase 6 (US4 — View & Manage List) | 7 |
| Phase 7 (US5 — Wizard Navigation) | 3 |
| Phase 8 (US6 — Feature Flag) | 3 |
| Phase 9 (Polish) | 4 |
| Parallel opportunities | 12 tasks marked [P] |

---

## Dependency Graph

```
Phase 1 (Setup: Migrations + Seeder)
    ↓
Phase 2 (Foundation: Models, Enums, Data, Events, Actions)
    ↓
Phase 3 (US1: Create Need — Controller, Routes, Wizard Step 1)
    ↓ (risks endpoint needs controller)
Phase 4 (US2: Link Risks — Wizard Step 2)
    ↓ (budget endpoint needs controller)
Phase 5 (US3: Associate Budget Items — Wizard Step 3)
    ↓ (list needs wizard to exist)
Phase 6 (US4: View & Manage List — List view, cards, reorder)
    ↓
Phase 7 (US5: Wizard Navigation — preserved state, back/forward)
    ↓
Phase 8 (US6: Feature Flag — Pennant integration)
    ↓
Phase 9 (Polish: Pint, final tests, verification)
```

**Parallel within phases**: Phases 4 + 5 can run in parallel (both depend on Phase 3 only). Within Phase 2, models/enums/data classes are parallelisable. Within Phase 6, list components are parallelisable.

---

## Phase 1: Setup (Migrations + Seeder)

- [x] T001 Create migration for `need_categories_v2` table — `database/migrations/2026_02_13_202136_create_need_categories_v2_table.php`
- [x] T002 Create migration for `package_needs_v2` table — `database/migrations/2026_02_13_202138_create_package_needs_v2_table.php`
- [x] T003 Create migration to add `package_need_v2_id` FK to `package_budget_items` — `database/migrations/2026_02_13_202139_add_package_need_v2_id_to_package_budget_items_table.php`
- [x] T004 Create migration for `package_need_v2_stored_events` table — `database/migrations/2026_02_13_202140_create_package_need_v2_stored_events_table.php`

> **Note**: Migrations already created. Seeder (T005) moves to Phase 2 since it needs the Model.

---

## Phase 2: Foundation (Models, Enums, Data Classes, Event Sourcing, Actions)

### Enums

- [x] T005 [P] Create `FundingSourceEnum` — `domain/Need/Enums/FundingSourceEnum.php` — HCP, INFORMAL, PHN, PBS, PRIVATE_HEALTH, OTHER with #[Label] #[Colour]
- [x] T006 [P] Create `MaslowLevelEnum` — `domain/Need/Enums/MaslowLevelEnum.php` — PHYSIOLOGICAL, SAFETY, BELONGING, ESTEEM, SELF_ACTUALISATION
- [x] T007 [P] Create `NeedStatusEnum` — `domain/Need/Enums/NeedStatusEnum.php` — DRAFT, ACTIVE, ARCHIVED

### Models

- [ ] T008 Create `NeedCategoryV2` model — `domain/Need/Models/NeedCategoryV2.php` — table, fillable, casts, `needs()` HasMany relationship, soft deletes, activity log
- [ ] T009 Create `PackageNeedV2` model — `domain/Need/Models/PackageNeedV2.php` — table, traits (HasFactory, LogsActivity, SoftDeletes), all relationships (package, needCategory, risks morphToMany, budgetItems), casts, semantic column PHPDoc
- [ ] T010 Create `PackageNeedV2Factory` — `domain/Need/Factories/PackageNeedV2Factory.php`
- [ ] T011 Create `NeedCategoryV2Seeder` — `database/seeders/NeedCategoryV2Seeder.php` — 14 categories with updateOrCreate
- [ ] T012 Run migrations and seed: `php artisan migrate && php artisan db:seed --class=NeedCategoryV2Seeder`

### Relationship Additions to Existing Models

- [ ] T013 [P] Add `needsV2(): HasMany` to `Package` model — `domain/Package/Models/Package.php`
- [ ] T014 [P] Add `packageNeedV2(): BelongsTo` to `PackageBudgetItem` model — `app/Models/PackageBudgetItem.php`
- [ ] T015 [P] Add `packageNeedsV2(): MorphToMany` to `Risk` model — `domain/Risk/Models/Risk.php`

### Data Classes

- [ ] T016 [P] Create `NeedCategoryV2Data` — `domain/Need/Data/NeedCategoryV2Data.php` — id, name, label, maslowLevel, priorityOrder, icon, colour, description, isActive; fromModel()
- [ ] T017 [P] Create `PackageNeedV2Data` — `domain/Package/Data/PackageNeedV2Data.php` — ~17 properties with validation rules, fromModel()
- [ ] T018 [P] Create `PackageNeedV2Options` — `domain/Package/Data/PackageNeedV2Options.php` — needCategories (grouped), fundingSourceOptions, statusOptions, packageRisks, packageBudgetItems

### Event Sourcing

- [ ] T019 Create `PackageNeedV2StoredEvent` — `domain/Need/EventSourcing/PackageNeedV2StoredEvent.php` — extends CustomStoredEvent, $table
- [ ] T020 Create `PackageNeedV2EventRepository` — `domain/Need/EventSourcing/PackageNeedV2EventRepository.php` — extends EloquentStoredEventRepository
- [ ] T021 Create `PackageNeedV2EventData` — `domain/Need/EventSourcing/Data/PackageNeedV2EventData.php` — event payload DTO with fromPackageNeedV2Data()
- [ ] T022 [P] Create `PackageNeedV2Created` event — `domain/Need/EventSourcing/Events/PackageNeedV2Created.php`
- [ ] T023 [P] Create `PackageNeedV2Updated` event — `domain/Need/EventSourcing/Events/PackageNeedV2Updated.php`
- [ ] T024 [P] Create `PackageNeedV2Deleted` event — `domain/Need/EventSourcing/Events/PackageNeedV2Deleted.php`
- [ ] T025 Create `PackageNeedV2Aggregate` — `domain/Need/EventSourcing/Aggregates/PackageNeedV2Aggregate.php` — createNeed, updateNeed, deleteNeed with guard clauses
- [ ] T026 Create `PackageNeedV2Projector` — `domain/Need/EventSourcing/Projectors/PackageNeedV2Projector.php` — explicit field mapping, risk sync, budget item FK sync

### Actions

- [ ] T027 Create `CreateNeedV2` action — `domain/Package/Actions/PackageNeedV2/CreateNeedV2.php` — authorize(), handle() with aggregate
- [ ] T028 Create `UpdateNeedV2` action — `domain/Package/Actions/PackageNeedV2/UpdateNeedV2.php` — authorize(), handle() with aggregate
- [ ] T029 Create `DeleteNeedV2` action — `domain/Package/Actions/PackageNeedV2/DeleteNeedV2.php` — authorize(), handle() with aggregate
- [ ] T030 Create `ReorderNeedsV2` action — `domain/Package/Actions/PackageNeedV2/ReorderNeedsV2.php` — bulk priority update, no event sourcing

### Foundation Tests

- [ ] T031 Write Pest tests for enums — `tests/Unit/Need/Enums/FundingSourceEnumTest.php`, `NeedStatusEnumTest.php`
- [ ] T032 Write Pest tests for models — `tests/Unit/Need/Models/NeedCategoryV2Test.php`, `PackageNeedV2Test.php` — relationships, casts, factory

---

## Phase 3: US1 — Create a Need with Maslow Category (P1)

### Controller + Routes

- [ ] T033 Create `PackageNeedV2Controller` — `domain/Package/Http/Controllers/PackageNeedV2Controller.php` — create, store, show, edit, update, destroy, reorder methods with getOptions()
- [ ] T034 Register resource routes in `domain/Package/Routes/packageRoutes.php` — `needs-v2` resource + reorder PATCH

### Frontend — Wizard

- [ ] T035 Create `Create.vue` page — `resources/js/Pages/Packages/NeedsV2/Create.vue` — modal wrapper using Inertia::modal
- [ ] T036 Create `Edit.vue` page — `resources/js/Pages/Packages/NeedsV2/Edit.vue` — modal wrapper pre-populated
- [ ] T037 Create `NeedV2WizardForm.vue` — `resources/js/Components/Staff/NeedsV2/NeedV2WizardForm.vue` — CommonStepNavigation, single useForm(), 3 step panels with v-show
- [ ] T038 Create `NeedV2StepDefine.vue` — `resources/js/Components/Staff/NeedsV2/NeedV2StepDefine.vue` — category picker, description, how_will_be_met, funding source, status
- [ ] T039 Create `MaslowCategoryPicker.vue` — `resources/js/Components/Staff/NeedsV2/MaslowCategoryPicker.vue` — grouped visual selector with collapsible Maslow sections

### Tests — US1

- [ ] T040 Write feature test: create need with valid data — `tests/Feature/Package/PackageNeedV2/CreatePackageNeedV2Test.php` — FR-001, FR-002, FR-003, FR-008, FR-011
- [ ] T041 Write feature test: validation errors (missing description, missing category, missing funding source) — same file
- [ ] T042 Write feature test: funding_source_other required when OTHER selected — FR-003
- [ ] T043 Write controller test: Inertia modal renders with correct options — `tests/Feature/Package/PackageNeedV2/PackageNeedV2ControllerTest.php`

---

## Phase 4: US2 — Link Risks to a Need (P1)

- [ ] T044 Create `NeedV2StepRisks.vue` — `resources/js/Components/Staff/NeedsV2/NeedV2StepRisks.vue` — multi-select existing package risks, empty state
- [ ] T045 Write feature test: create need with risk links — `tests/Feature/Package/PackageNeedV2/CreatePackageNeedV2Test.php` — FR-004, verify riskables pivot
- [ ] T046 Write feature test: update need risk associations (add/remove) — `tests/Feature/Package/PackageNeedV2/UpdatePackageNeedV2Test.php`
- [ ] T047 Write feature test: empty risks scenario (no risks on package) — same file
- [ ] T048 Write feature test: risk detach on need delete — `tests/Feature/Package/PackageNeedV2/DeletePackageNeedV2Test.php` — FR-010

---

## Phase 5: US3 — Associate Budget Items to a Need (P1)

- [ ] T049 Create `NeedV2StepBudget.vue` — `resources/js/Components/Staff/NeedsV2/NeedV2StepBudget.vue` — multi-select existing budget items, empty state
- [ ] T050 Write feature test: create need with budget item associations — same create test file — FR-005, verify package_need_v2_id FK
- [ ] T051 Write feature test: update budget item associations — same update test file
- [ ] T052 Write feature test: budget item FK nullified on need delete — same delete test file — FR-010
- [ ] T053 Write feature test: budget item can serve multiple needs — edge case from spec

---

## Phase 6: US4 — View and Manage Needs List (P2)

- [ ] T054 [P] Create `PackageNeedsV2.vue` — `resources/js/Components/Staff/NeedsV2/PackageNeedsV2.vue` — main list view, status filter tabs (All/Active/Draft/Archived) — FR-013, FR-020
- [ ] T055 [P] Create `NeedV2Card.vue` — `resources/js/Components/Staff/NeedsV2/NeedV2Card.vue` — compact/expandable card with drag handle, category badge, risk/budget counts
- [ ] T056 Create `MaslowPyramid.vue` — `resources/js/Components/Staff/NeedsV2/MaslowPyramid.vue` — SVG/CSS pyramid filter with clickable tiers and count badges
- [ ] T057 Write feature test: reorder needs — `tests/Feature/Package/PackageNeedV2/ReorderPackageNeedV2Test.php` — FR-022
- [ ] T058 Write feature test: status transitions (draft→active, active→archived, archived→active) — `tests/Feature/Package/PackageNeedV2/UpdatePackageNeedV2Test.php` — FR-018, FR-019
- [ ] T059 Write feature test: archived needs hidden from default view — FR-020
- [ ] T060 Write feature test: only active + add_to_care_plan needs included in care plan query — FR-021

---

## Phase 7: US5 — Navigate Wizard Steps Freely (P2)

- [ ] T061 Verify v-show preserves state across steps in `NeedV2WizardForm.vue` — manual verification + browser test consideration
- [ ] T062 Write controller test: edit wizard pre-populates all data including associations — FR-009
- [ ] T063 Write controller test: authorization (manage-need permission required) — FR-017

---

## Phase 8: US6 — Gradual Rollout via Feature Flag (P2)

- [ ] T064 Add `needs-v2` Pennant feature flag check in controller/Inertia shared props — FR-015
- [ ] T065 Update existing `PackageNeeds.vue` (or parent) to conditionally render v1 or v2 list component — FR-014, FR-015
- [ ] T066 Write feature test: feature flag toggle (v1 vs v2 tab rendering) — FR-015

---

## Phase 9: Polish & Cross-Cutting Concerns

- [ ] T067 Run `vendor/bin/pint --dirty` — format all new/modified files
- [ ] T068 Run full test suite: `php artisan test --compact --filter=NeedV2`
- [ ] T069 Run full test suite: `php artisan test --compact --filter=NeedCategoryV2`
- [ ] T070 Verify event sourcing audit trail: create → update → delete cycle produces correct events in `package_need_v2_stored_events` — FR-016, SC-005

---

## Task Status Legend

| Marker | Meaning |
|--------|---------|
| `[x]` | Complete |
| `[ ]` | Pending |
| `[P]` | Can run in parallel with other [P] tasks in same phase |
| `[US1]` etc. | Maps to user story from spec.md |
