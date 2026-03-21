---
title: "Data Model: ATHM Funding Commitment"
---

# Data Model: ATHM Funding Commitment

## Entity Changes

### BudgetPlanItem (Modified)

Existing model at `domain/Budget/Models/BudgetPlanItem.php`. Gains one new column.

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `is_funding_held` | `boolean` | `false` | When true, ATHM-specific funding stream allocations (AT, HM) on this item are reserved and unavailable to other services |

**Validation rules** (in `SubmitBudgetPlanItemData`):
- `'is_funding_held' => ['nullable', 'boolean']`

**Auto-clear rule**: If the budget item's service category is not SERG-0002 or SERG-0003, `is_funding_held` is forced to `false` on save.

**Carry-over rule**: When a budget plan is duplicated (`DuplicateBudgetPlanAction`), `is_funding_held` is copied to the new draft.

**Audit**: Captured automatically by existing `LogsActivity` trait — no additional logging needed.

---

### FundingStream (Modified — new method only)

Existing model at `domain/Funding/Models/FundingStream.php`. No schema change. New helper method.

```php
public function isAthmSpecific(): bool
{
    return in_array($this->external_id, [
        self::ASSISTIVE_TECHNOLOGY_EXTERNAL_ID,       // 'AT'
        self::HOME_MODIFICATIONS_EXTERNAL_ID,         // 'HM'
    ]);
}
```

New constant: `HOME_MODIFICATIONS_EXTERNAL_ID = 'HM'` (consistent with existing `ASSISTIVE_TECHNOLOGY_EXTERNAL_ID`).

---

## Derived Calculations (No Schema)

### Held Amount (per funding stream)

Not stored — calculated at query time.

```
held_amount(funding_stream) = SUM(
    budget_plan_funding_allocations.allocated_amount
    WHERE budget_plan_item.is_funding_held = true
    AND funding_stream.external_id IN ('AT', 'HM')
    AND budget_plan_funding_allocation.funding_stream_id = funding_stream.id
)
```

### Available to Allocate (display — unchanged)

The `FundingStreamData::totalAvailableToAllocate` display stays as-is. Held amounts are already included in the "planned" total. The hold is enforced at allocation time (during budget submission via `AllocateFundingsAction` and during bill processing via `CalculateBillFundingAllocations`), not in the display layer.

---

## Migration

```sql
-- Add is_funding_held to budget_plan_items
ALTER TABLE budget_plan_items
    ADD COLUMN is_funding_held BOOLEAN NOT NULL DEFAULT FALSE
    AFTER is_once_off_purchase;
```

**Rollback**: `DROP COLUMN is_funding_held`

---

## DTO Changes

### SubmitBudgetPlanItemData (Modified)

Add field:
```php
public ?bool $isFundingHeld = null,
```

### BudgetPlanItemServicesViewData (Modified)

Add field:
```php
public bool $isFundingHeld,
```

### FundingStreamData (No changes)

No changes needed. The available-to-allocate display stays as-is. The hold is enforced at allocation time, not in the display layer.

---

## Relationships

No new relationships. The hold is a simple boolean on `BudgetPlanItem`. The held amount is derived by joining through the existing `BudgetPlanFundingAllocation` → `FundingStream` relationship.

```
BudgetPlanItem (is_funding_held)
    │
    └── BudgetPlanFundingAllocation (allocated_amount)
            │
            └── FundingStream (external_id: 'AT' | 'HM')
```
