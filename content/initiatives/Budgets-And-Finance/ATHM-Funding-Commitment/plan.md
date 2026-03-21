---
title: "Implementation Plan: ATHM Funding Commitment"
---

# Implementation Plan: ATHM Funding Commitment

**Spec**: [spec.md](/initiatives/budgets-and-finance/athm-funding-commitment/spec)
**Created**: 2026-02-15
**Status**: Draft

## Technical Context

### Technology Stack

- Backend: Laravel 12, PHP 8.3
- Frontend: Vue 3, Inertia.js v2, TypeScript
- Database: MySQL
- Event Sourcing: Spatie Laravel Event Sourcing (BudgetPlanItem uses aggregate roots)
- Testing: Pest v3

### Dependencies

- `domain/Budget/Models/BudgetPlanItem.php` — gains `is_funding_held` column
- `domain/Budget/Data/SubmitBudgetPlanItemData.php` — gains `isFundingHeld` field
- `domain/Budget/Data/View/BudgetPlanItemServicesViewData.php` — gains `isFundingHeld` property
- `domain/Budget/Actions/View/AssembleBudgetItemsViewData.php` — passes hold state through
- `domain/Budget/Data/FundingStreamData.php` — no changes needed (held amounts are already in "planned" total)
- `domain/Budget/Actions/AllocateFundingsAction.php` — must give held items priority claim on ATHM streams during submission validation
- `domain/Funding/Actions/CalculateBillFundingAllocations.php` — must respect held amounts from published budgets
- `domain/Budget/Actions/DuplicateBudgetPlanAction.php` — must carry `is_funding_held` to new draft
- `domain/Budget/Actions/SubmitBudgetPlanItem.php` — must persist `is_funding_held`
- `domain/Budget/EventSourcing/` — `BudgetPlanItemSubmitted` event and projector must include `is_funding_held`
- `resources/js/Components/ServicePlan/Budget/BudgetItem.vue` — gains checkbox + visual indicator
- `config/support-at-home.php` — already defines SERG → funding stream mappings (no changes needed)
- `domain/Funding/Models/FundingStream.php` — has `ASSISTIVE_TECHNOLOGY_EXTERNAL_ID = 'AT'` constant (no changes needed)

### Constraints

- Zero regression for non-held budget items and bills (FR-012)
- Hold only affects AT and HM funding streams; CU, HC, VC are unaffected
- Bill processing only respects holds from published budgets; draft holds are planning-only
- Existing 200% over-allocation threshold is unchanged
- No new permissions required — follows existing budget item edit permissions

## Gates

Review against `.specify/memory/constitution.md`:

- [x] **I. Majestic Monolith** — all changes within existing domain modules (Budget, Funding)
- [x] **II. Domain-Driven Design** — follows existing domain boundaries; no cross-domain model dependencies
- [x] **III. Convention Over Configuration** — follows `is_once_off_purchase` pattern for new boolean; uses existing `config/support-at-home.php` for SERG mappings
- [x] **IV. Code Quality Standards** — descriptive naming (`is_funding_held`), type hints, PHPDoc
- [x] **V. Testing is First-Class** — unit + feature tests for all allocation logic changes
- [x] **VI. Event Sourcing** — `BudgetPlanItemSubmitted` event already handles item state; `is_funding_held` added to event payload
- [x] **VII. Laravel Data for DTOs** — `SubmitBudgetPlanItemData` extended with `isFundingHeld`; `BudgetPlanItemServicesViewData` extended for frontend
- [x] **VIII. Action Classes** — modifying existing actions, not creating services
- [x] **X. Inertia + Vue** — checkbox added to existing `BudgetItem.vue` component via `useForm()`
- [x] **XIV. Feature Flags** — not needed. Feature is additive (checkbox defaults to off), low risk, only affects users who actively enable it
- [x] **XVI. Compliance & Audit** — `LogsActivity` trait on BudgetPlanItem captures `is_funding_held` changes automatically
- [x] **XVII. Code Formatting** — `vendor/bin/pint --dirty` before finalising

## Design Decisions

### Data Model

See [data-model.md](/initiatives/budgets-and-finance/athm-funding-commitment/data-model) for full entity definitions.

**Summary**: Single boolean column `is_funding_held` on `budget_plan_items` table. No new tables or relationships. The held amount is derived at query time by summing `BudgetPlanFundingAllocation` amounts where the parent item has `is_funding_held = true` AND the funding stream's `external_id` is `AT` or `HM`.

### Identifying ATHM-Specific Funding Streams

A funding stream is considered "ATHM-specific" if its `external_id` matches:
- `AT` — Assistive Technology (for SERG-0002 items)
- `HM` — Home Modifications (for SERG-0003 items)

These are already defined as constants on `FundingStream` (e.g. `ASSISTIVE_TECHNOLOGY_EXTERNAL_ID`). A new scope or helper method on `FundingStream` will provide `isAthmSpecific()` for reuse.

### Budget Planning — Available-to-Allocate Display

`FundingStreamData::fromFundingStream()` does **not** need modification. The available-to-allocate display stays as-is — held amounts are already included in the "planned" total. The hold is enforced at allocation time (when the budget plan is submitted or a bill is processed), not in the display layer.

### Bill Processing — Funding Allocation

`CalculateBillFundingAllocations` distributes bill costs across funding streams in priority order. The change:

1. Before allocating a bill item to a funding stream, check if any published budget items hold funds from that stream
2. If the bill item's `budget_plan_item_id` matches a held item, allow allocation (the hold protects funds *for* that item)
3. If the bill item is for a *different* budget item, subtract the total held amount from the stream's available capacity
4. Only check holds from the **active/published** budget plan for the package

### UI Component — BudgetItem.vue

Follow the exact pattern used by `is_once_off_purchase`:

1. Add `is_funding_held` to the `useForm()` data object
2. Add a checkbox in the expanded form section, conditionally rendered when `serviceItem.serviceGroupExternalId` is `SERG-0002` or `SERG-0003`
3. Add a badge/icon in the collapsed AccordionTrigger row when `serviceItem.isFundingHeld` is true
4. The `serviceGroupExternalId` field already flows from the backend — the frontend just needs to check it

### Budget Plan Duplication

`DuplicateBudgetPlanAction` creates a `SubmitBudgetPlanItemData` for each item. Add `isFundingHeld: $budgetItem->is_funding_held` to carry the hold state to the new draft.

### Auto-Clear on Service Category Change

When a user changes the service types on a budget item such that the service category shifts away from SERG-0002/SERG-0003, the backend should set `is_funding_held = false` in `SubmitBudgetPlanItem`. This mirrors how other conditional fields are reset.

## Implementation Phases

### Phase 1: Schema & Model (Foundation)

**Migration:**
- Add `is_funding_held` boolean column (default `false`, not nullable) to `budget_plan_items` table

**Model:**
- Add `is_funding_held` to `BudgetPlanItem::$fillable`
- Add `@property bool $is_funding_held` PHPDoc
- Add `is_funding_held` to `casts()` as boolean

**Event Sourcing:**
- Add `is_funding_held` to `BudgetPlanItemSubmitted` event payload
- Update `BudgetPlanItemProjector` to persist the field, defaulting to `false` if the key is missing (backward compatibility with existing events that predate this feature)

**DTOs:**
- Add `isFundingHeld` to `SubmitBudgetPlanItemData` with validation rule `'is_funding_held' => ['nullable', 'boolean']`
- Add `isFundingHeld` to `BudgetPlanItemServicesViewData`

**Action — SubmitBudgetPlanItem:**
- Read `$data->isFundingHeld` and persist to model
- Auto-clear: if the item's service category is not SERG-0002 or SERG-0003, force `is_funding_held = false`

**Action — DuplicateBudgetPlanAction:**
- Pass `isFundingHeld: $budgetItem->is_funding_held` in the `SubmitBudgetPlanItemData` constructor

**FundingStream model:**
- Add `HOME_MODIFICATIONS_EXTERNAL_ID = 'HM'` constant (consistent with existing `ASSISTIVE_TECHNOLOGY_EXTERNAL_ID`)
- Add `isAthmSpecific(): bool` method checking `external_id` against both constants

### Phase 2: Allocation Logic (Core Business Rules)

**Budget Planning — FundingStreamData:**
- No changes needed. Available-to-allocate display stays as-is. The hold is enforced at allocation time, not in the display layer.

**Budget Planning — AllocateFundingsAction (submission-time):**
- When a budget plan is submitted, `AllocateFundingsAction` runs to validate allocations. This must account for held amounts — held items get priority claim on ATHM streams during the allocation pass.

**Bill Processing — CalculateBillFundingAllocations:**
- Before allocating a bill item to a funding stream, calculate the total held amount for that stream from the package's **published** budget plan
- If the bill item maps to a held budget item, do not subtract (the hold is *for* this item)
- Otherwise, reduce available capacity by the total held amount
- Pass-through: when no holds exist, zero impact — the subtracted amount is 0

### Phase 3: Frontend & Visual Indicator (UI)

**BudgetItem.vue — Expanded form:**
- Add `is_funding_held: props.serviceItem.isFundingHeld ?? false` to `useForm()` fields
- Add checkbox component (using existing `CommonCheckbox` or similar) below the funding streams section
- Conditionally render: only when `serviceItem.serviceGroupExternalId === 'SERG-0002' || serviceItem.serviceGroupExternalId === 'SERG-0003'`
- Label: "Hold ATHM funds for this budget item"

**BudgetItem.vue — Collapsed row (AccordionTrigger):**
- Add a small badge or lock icon next to the existing metadata when `serviceItem.isFundingHeld` is true
- Follow the existing pattern for badges (e.g. the service type count badge)

**AssembleBudgetItemsViewData:**
- Pass `is_funding_held` through to `BudgetPlanItemServicesViewData` in `buildServiceLevelFromBooking()`

### Phase 4: Polish & Edge Cases

- Verify auto-clear works when service types change category
- Verify holds carry over on budget plan duplication
- Verify `LogsActivity` captures `is_funding_held` changes without extra work
- Run `vendor/bin/pint --dirty` on all changed files
- Run full test suite to confirm zero regressions

## Testing Strategy

### Phase 1: Foundation Tests

**Unit Tests** (co-located with classes):
- `SubmitBudgetPlanItemData` validation accepts `is_funding_held` boolean
- `BudgetPlanItem` model casts `is_funding_held` as boolean
- `FundingStream::isAthmSpecific()` returns true for AT/HM, false for others

**Feature Tests:**
- Saving a budget item with `is_funding_held = true` persists the value
- Saving a budget item with `is_funding_held = true` on a non-SERG-0002/0003 item auto-clears to false
- Duplicating a budget plan carries `is_funding_held` to the new draft

### Phase 2: Allocation Logic Tests

**Unit Tests:**
- `AllocateFundingsAction` gives held items priority claim on ATHM streams
- `AllocateFundingsAction` does NOT affect non-ATHM stream allocations (CU, HC, VC)
- Held amount calculation sums correctly across multiple held items

**Feature Tests:**
- `CalculateBillFundingAllocations` excludes held AT funds for bills on different budget items
- `CalculateBillFundingAllocations` allows held AT funds for bills on the same budget item
- `CalculateBillFundingAllocations` ignores holds from draft (unpublished) budget plans
- Zero regression: allocation with no holds produces identical results to current behaviour

### Phase 3: Frontend Tests

**Browser/Integration Tests:**
- Checkbox visible for SERG-0002 budget items, hidden for SERG-0001
- Checkbox state persists across save and reload
- Visual indicator appears in collapsed row when held

### Test Execution Checklist

- [ ] Phase 1: Unit + Feature tests passing
- [ ] Phase 2: Allocation unit tests + feature tests passing
- [ ] Phase 3: Frontend integration tests passing
- [ ] Phase 4: Full test suite passing — zero regressions

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Held amount calculation introduces performance regression on large budgets | Low | Medium | Query is scoped to a single budget plan's items; index on `is_funding_held` if needed |
| Bill processing change introduces subtle allocation differences | Medium | High | Comprehensive test coverage comparing held vs non-held scenarios; FR-012 zero-regression requirement |
| Event sourcing payload change breaks existing projections | Low | Medium | Add `is_funding_held` as nullable with default `false` in event; existing events replay without issue |
| Unexpected allocation behaviour in production | Low | Low | Feature is additive (defaults to off); monitor allocation logs after release; rollback is simply clearing `is_funding_held` flags |

## Development Clarifications

### Session 2026-02-15

1. **Q: How should held allocation amounts reach FundingStreamData?**
   → A: `FundingStreamData` doesn't need to be concerned with held amounts. The hold is only enforced within the allocation logic (`AllocateFundingsAction` during budget submission and `CalculateBillFundingAllocations` during bill processing), not in the display layer.

2. **Q: FundingStream has ASSISTIVE_TECHNOLOGY_EXTERNAL_ID = 'AT' but no HM constant. How should HM be referenced?**
   → A: Add `HOME_MODIFICATIONS_EXTERNAL_ID = 'HM'` constant to FundingStream. Consistent with existing AT pattern, avoids magic strings.

3. **Q: AllocateFundingsAction runs during budget submission. Should held items get priority in this allocation pass?**
   → A: Yes — held items should be allocated first in the submission validation pass, ensuring their ATHM funds are reserved before other items claim them.

4. **Q: Should this feature be behind a Pennant/PostHog feature flag?**
   → A: No flag needed. The feature is additive (checkbox defaults to off), low risk, and only affects users who actively enable it.

5. **Q: How should the event sourcing projector handle existing events that predate this feature?**
   → A: Default to `false` if `is_funding_held` key is missing in the event payload. Safe, no data migration needed.

## Next Steps

1. `/speckit-tasks` — Generate implementation tasks from this plan
2. `/trilogy-mockup` — Create UI mockups for the checkbox and visual indicator (optional)
3. `/speckit-implement` — Start phased development
