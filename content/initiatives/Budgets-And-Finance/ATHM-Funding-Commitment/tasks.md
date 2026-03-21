---
title: "Implementation Tasks: ATHM Funding Commitment"
---

# Implementation Tasks: ATHM Funding Commitment

**Spec**: [spec.md](/initiatives/budgets-and-finance/athm-funding-commitment/spec)
**Plan**: [plan.md](/initiatives/budgets-and-finance/athm-funding-commitment/plan)
**Data Model**: [data-model.md](/initiatives/budgets-and-finance/athm-funding-commitment/data-model)
**Generated**: 2026-02-15

## Summary

| Metric | Value |
|--------|-------|
| Total tasks | 31 |
| User stories | 4 (US1 P1, US2 P1, US3 P1, US4 P2) |
| Phases | 5 |
| Parallel opportunities | 14 tasks across Phases 1, 3 |
| MVP scope | Phase 1 + Phase 2 (US1) + Phase 3 (US2+US3) |

## Dependency Graph

```
Phase 1: Foundation
    │
    ├── Phase 2: [US1] Hold ATHM Funds — Persistence & Checkbox
    │       │
    │       └── Phase 3: [US2]+[US3] Allocation Logic (parallel within)
    │               │
    │               └── Phase 4: [US4] Visual Indicator
    │                       │
    │                       └── Phase 5: Polish & Cross-Cutting
```

**Parallel opportunities**:
- Phase 1: T002–T005 can run in parallel; T009–T010 can run in parallel
- Phase 3: All US2 tasks (T018–T021) can run in parallel with all US3 tasks (T022–T026)

---

## Phase 1: Foundation

Schema, models, DTOs, event sourcing payload, and foundation unit tests. All subsequent phases depend on this.

- [ ] T001 Create migration `add_is_funding_held_to_budget_plan_items_table` via `php artisan make:migration` — add `is_funding_held` boolean column (NOT NULL, default `false`) to `budget_plan_items` table, positioned after `is_once_off_purchase`
- [ ] T002 [P] Update `domain/Budget/Models/BudgetPlanItem.php` — add `is_funding_held` to `$fillable` array, add `'is_funding_held' => 'boolean'` to `casts()` method, add `@property bool $is_funding_held` to class PHPDoc
- [ ] T003 [P] Update `domain/Funding/Models/FundingStream.php` — add `HOME_MODIFICATIONS_EXTERNAL_ID = 'HM'` constant with PHPDoc explaining it represents the Home Modifications funding stream; add `isAthmSpecific(): bool` method that returns `true` when `external_id` is `AT` or `HM`
- [ ] T004 [P] Update `domain/Budget/Data/SubmitBudgetPlanItemData.php` — add `public ?bool $isFundingHeld = null` constructor parameter with validation rule `['nullable', 'boolean']`
- [ ] T005 [P] Update `domain/Budget/Data/View/BudgetPlanItemServicesViewData.php` — add `public bool $isFundingHeld` property; wire it in `fromModel()` or the static factory method reading from `$budgetPlanItem->is_funding_held`
- [ ] T006 Update `domain/Budget/EventSourcing/Events/BudgetPlanItemSubmitted.php` — add `public bool $isFundingHeld = false` constructor parameter (default `false` for backward compatibility with existing stored events)
- [ ] T007 Update `domain/Budget/EventSourcing/Aggregates/BudgetPlanItemAggregateRoot.php` — pass `isFundingHeld` from the DTO through to `BudgetPlanItemSubmitted` event constructor in `submitBudgetItem()` method
- [ ] T008 Update `domain/Budget/EventSourcing/Projectors/BudgetPlanItemProjector.php` — add `'is_funding_held' => $event->isFundingHeld` to the `updateOrCreate` attributes array in `onBudgetPlanItemSubmitted()`
- [ ] T009 [P] Write co-located test `domain/Funding/Models/FundingStreamTest.php` — verify `isAthmSpecific()` returns `true` for AT and HM external IDs, `false` for ON, CU, HC, VC, and any other value
- [ ] T010 [P] Write co-located test `domain/Budget/Data/SubmitBudgetPlanItemDataTest.php` — verify `isFundingHeld` accepts `true`, `false`, and `null`; verify non-boolean values are rejected

---

## Phase 2: [US1] Hold ATHM Funds — Persistence & Checkbox

Backend persistence logic (submit, auto-clear, duplicate), frontend checkbox, and feature tests. Depends on Phase 1.

- [ ] T011 [US1] Update `domain/Budget/Actions/SubmitBudgetPlanItem.php` — read `$data->isFundingHeld` and persist to the model; add auto-clear logic: if the budget item's `service_category_id` does not resolve to SERG-0002 or SERG-0003, force `is_funding_held = false` before saving
- [ ] T012 [US1] Update `domain/Budget/Actions/DuplicateBudgetPlanAction.php` — when constructing `SubmitBudgetPlanItemData` for each duplicated item, pass `isFundingHeld: $budgetItem->is_funding_held` to carry the hold state to the new draft
- [ ] T013 [US1] Update `domain/Budget/Actions/View/AssembleBudgetItemsViewData.php` — pass `is_funding_held` from the `BudgetPlanItem` model through to `BudgetPlanItemServicesViewData` in the `buildServiceLevelFromBooking()` method
- [ ] T014 [US1] Add `is_funding_held` checkbox to `resources/js/Components/ServicePlan/Budget/BudgetItem.vue` — add `is_funding_held: props.serviceItem.isFundingHeld ?? false` to `useForm()` fields; add checkbox component conditionally rendered when `serviceItem.serviceGroupExternalId === 'SERG-0002' || serviceItem.serviceGroupExternalId === 'SERG-0003'`; label: "Hold ATHM funds for this budget item"; follow existing `is_once_off_purchase` checkbox pattern
- [ ] T015 [US1] Write co-located feature test `domain/Budget/Actions/SubmitBudgetPlanItemTest.php` — test saving a budget item with `is_funding_held = true` persists the value; test saving with `is_funding_held = false` persists false; test the event sourcing round-trip (event recorded → projector persists)
- [ ] T016 [US1] Write test in `domain/Budget/Actions/SubmitBudgetPlanItemTest.php` — test auto-clear: saving `is_funding_held = true` on a non-SERG-0002/SERG-0003 item results in `is_funding_held = false` on the persisted model
- [ ] T017 [US1] Write co-located feature test `domain/Budget/Actions/DuplicateBudgetPlanActionTest.php` — test duplicating a budget plan with held items carries `is_funding_held = true` to the new draft items

---

## Phase 3: [US2]+[US3] Allocation Logic — Budget Submission & Bill Processing

US2 (AllocateFundingsAction) and US3 (CalculateBillFundingAllocations) are independent and all tasks within this phase are parallelizable. Depends on Phase 2.

### US2: Budget Submission Allocation

- [ ] T018 [P] [US2] Update `domain/Budget/Actions/AllocateFundingsAction.php` — modify the allocation pass so that budget items with `is_funding_held = true` receive priority claim on ATHM-specific funding streams (AT, HM); held items should be allocated their ATHM stream amounts first before remaining capacity is distributed to other items; non-ATHM streams (CU, HC, VC) are unaffected by holds
- [ ] T019 [P] [US2] Write test in `domain/Budget/Actions/AllocateFundingsActionTest.php` — given two budget items competing for the same AT stream, when one has `is_funding_held = true`, the held item's AT allocation is guaranteed first
- [ ] T020 [P] [US2] Write test in `domain/Budget/Actions/AllocateFundingsActionTest.php` — held items do NOT affect non-ATHM stream allocations (CU, HC, VC remain allocated per normal waterfall)
- [ ] T021 [P] [US2] Write test in `domain/Budget/Actions/AllocateFundingsActionTest.php` — multiple held items on the same AT stream all receive priority; held amounts are summed cumulatively

### US3: Bill Processing Allocation

- [ ] T022 [P] [US3] Update `domain/Funding/Actions/CalculateBillFundingAllocations.php` — before allocating a bill item to an ATHM-specific funding stream, calculate the total held amount for that stream from the package's published budget plan; if the bill item maps to the held budget item, do not subtract (hold is *for* that item); otherwise reduce available capacity by the total held amount; when no holds exist, subtracted amount is 0 (zero regression)
- [ ] T023 [P] [US3] Write test in `domain/Funding/Actions/CalculateBillFundingAllocationsTest.php` — bills on a different budget item cannot draw from held AT funds on the published budget
- [ ] T024 [P] [US3] Write test in `domain/Funding/Actions/CalculateBillFundingAllocationsTest.php` — bills on the held budget item CAN draw from the held amount (hold protects funds *for* that item)
- [ ] T025 [P] [US3] Write test in `domain/Funding/Actions/CalculateBillFundingAllocationsTest.php` — holds from draft (unpublished) budget plans are ignored during bill processing
- [ ] T026 [P] [US3] Write zero-regression test in `domain/Funding/Actions/CalculateBillFundingAllocationsTest.php` — when no holds exist on any budget items, allocation produces identical results to current behaviour

---

## Phase 4: [US4] Visual Indicator — Collapsed Badge

Badge/lock icon on collapsed budget item rows. Depends on Phase 2 (T013/T014 must be complete for `isFundingHeld` to flow to frontend).

- [ ] T027 [US4] Add held visual indicator to `resources/js/Components/ServicePlan/Budget/BudgetItem.vue` — in the collapsed AccordionTrigger row, display a small badge or lock icon when `serviceItem.isFundingHeld` is true; follow existing badge patterns (e.g. service type count badge); ensure indicator is visible across all quarter period views
- [ ] T028 [US4] Write browser test — verify badge is visible for held items and hidden for non-held items in the collapsed budget view

---

## Phase 5: Polish & Cross-Cutting Concerns

Final verification, formatting, and regression testing. Depends on all prior phases.

- [ ] T029 Run `vendor/bin/pint --dirty` on all changed files to ensure code formatting compliance
- [ ] T030 Run full test suite via `php artisan test --compact` — confirm zero regressions across all existing tests
- [ ] T031 Verify `LogsActivity` trait on `BudgetPlanItem` automatically captures `is_funding_held` changes in the activity log — confirm by checking `$logAttributes` or running a manual test
