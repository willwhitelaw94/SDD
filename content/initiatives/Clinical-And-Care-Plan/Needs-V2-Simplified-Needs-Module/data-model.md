---
title: "Data Model: Simplified Needs Module (Needs v2)"
---

# Data Model: Simplified Needs Module (Needs v2)

**Plan**: [plan.md](plan.md) | **Spec**: [spec.md](spec.md)

---

## Entity Relationship Overview

```
┌─────────────────────┐
│   Package            │
│   (existing)         │
│                      │
│  hasMany → needsV2   │
│  hasMany → budgetItems│
│  morphToMany → risks │
└──────┬───────────────┘
       │ 1:N
       ▼
┌─────────────────────────┐       N:1      ┌──────────────────────┐
│   PackageNeedV2          │◄──────────────│   NeedCategoryV2      │
│   package_needs_v2       │               │   need_categories_v2   │
│                          │               │                        │
│  belongsTo → package     │               │  hasMany → needs       │
│  belongsTo → needCategory│               │  maslow_level (enum)   │
│  morphToMany → risks     │               │  priority_order        │
│  hasMany → budgetItems   │               │  14 seeded records     │
└──────┬──────┬────────────┘               └────────────────────────┘
       │      │
       │      │ N:M (riskables pivot, polymorphic)
       │      ▼
       │  ┌──────────────────┐
       │  │   Risk             │
       │  │   (existing)       │
       │  │                    │
       │  │  morphedByMany     │
       │  │  → packageNeedsV2  │
       │  └──────────────────┘
       │
       │ 1:N (package_need_v2_id FK)
       ▼
┌─────────────────────────┐
│   PackageBudgetItem      │
│   (existing)             │
│                          │
│  + package_need_v2_id    │
│    (nullable FK, new)    │
│                          │
│  belongsTo → packageNeedV2│
└─────────────────────────┘
```

---

## Entities

### NeedCategoryV2

**Table**: `need_categories_v2`
**Model**: `domain/Need/Models/NeedCategoryV2.php`
**Purpose**: Fixed, code-managed categories based on Maslow's hierarchy. Seeded via releases — not admin-editable.

| Field | Type | Nullable | Default | Validation | Notes |
|-------|------|----------|---------|------------|-------|
| id | bigint | No | auto | — | PK |
| name | string(100) | No | — | unique | Internal key: `nutrition_hydration` |
| label | string(150) | No | — | — | Display: `Nutrition & Hydration` |
| maslow_level | string(50) | No | — | in:MaslowLevelEnum | `physiological`, `safety`, etc. |
| priority_order | smallint | No | — | min:1 | 1=most fundamental |
| icon | string(100) | Yes | null | — | Icon identifier |
| colour | string(30) | Yes | null | — | Tailwind colour class |
| description | text | Yes | null | — | Category description |
| is_active | boolean | No | true | — | Soft-disable |
| created_at | timestamp | Yes | — | — | |
| updated_at | timestamp | Yes | — | — | |
| deleted_at | timestamp | Yes | null | — | Soft deletes |

**Relationships:**
- `needs(): HasMany → PackageNeedV2`

**State transitions:** None (static reference data)

---

### PackageNeedV2

**Table**: `package_needs_v2`
**Model**: `domain/Need/Models/PackageNeedV2.php`
**Purpose**: A specific care need for a recipient within a package.

| Field | Type | Nullable | Default | Validation | Notes |
|-------|------|----------|---------|------------|-------|
| id | bigint | No | auto | — | PK |
| uuid | string(36) | No | — | unique | Event sourcing aggregate ID |
| package_id | bigint FK | No | — | exists:packages,id | cascadeOnDelete |
| need_category_v2_id | bigint FK | No | — | exists:need_categories_v2,id | restrictOnDelete |
| description | text | No | — | required, min:1 | What is the need? |
| how_will_be_met | text | Yes | null | — | How will it be addressed? |
| funding_source | string(30) | No | — | required, in:FundingSourceEnum | HCP, INFORMAL, etc. |
| funding_source_other | string(255) | Yes | null | required_if:funding_source,OTHER | Free text when OTHER |
| status | string(20) | No | 'active' | in:NeedStatusEnum | draft, active, archived |
| priority | smallint | No | 0 | min:0 | Sort order within package |
| add_to_care_plan | boolean | No | true | — | Include in care plan docs |
| created_by | bigint | Yes | null | — | User who created |
| updated_by | bigint | Yes | null | — | User who last updated |
| created_at | timestamp | Yes | — | — | |
| updated_at | timestamp | Yes | — | — | |
| deleted_at | timestamp | Yes | null | — | Soft deletes |

**Indexes:**
- `(package_id, need_category_v2_id)` — composite
- `(package_id, status)` — composite for list view filtering

**Relationships:**
- `package(): BelongsTo → Package`
- `needCategory(): BelongsTo → NeedCategoryV2`
- `risks(): MorphToMany → Risk` (via existing `riskables` pivot)
- `budgetItems(): HasMany → PackageBudgetItem` (via `package_need_v2_id` FK)
- `auditLog(): MorphMany → Activity`

**State transitions:**

```
     ┌─────────┐
     │  Draft   │──────────────► Active
     └─────────┘                   │
          ▲                        │
          │                        ▼
          │                  ┌───────────┐
          └──────────────────│  Archived  │
                             └───────────┘

Draft → Active:    Coordinator confirms need is complete
Active → Archived: Coordinator marks need as no longer current
Archived → Active: Coordinator reactivates (if still relevant)
Draft → Archived:  Coordinator discards incomplete need
```

**Business rules:**
- Only `active` needs with `add_to_care_plan = true` are included in care plan documents (FR-021)
- `archived` needs are hidden from default list view but accessible via filter (FR-020)
- New needs default to `active` status; optionally saved as `draft` (FR-019)
- Soft delete is permanent removal; archive is status change (retained for audit)

---

### Enums

#### FundingSourceEnum

| Case | Value | Label |
|------|-------|-------|
| HCP | `HCP` | Home Care Package |
| INFORMAL | `INFORMAL` | Informal Support |
| PHN | `PHN` | Primary Health Network |
| PBS | `PBS` | Pharmaceutical Benefits Scheme |
| PRIVATE_HEALTH | `PRIVATE_HEALTH` | Private Health Insurance |
| OTHER | `OTHER` | Other (specify) |

#### MaslowLevelEnum

| Case | Value | Label | Colour |
|------|-------|-------|--------|
| PHYSIOLOGICAL | `physiological` | Physiological | red |
| SAFETY | `safety` | Safety | orange |
| BELONGING | `belonging` | Belonging | yellow |
| ESTEEM | `esteem` | Esteem | green |
| SELF_ACTUALISATION | `self_actualisation` | Self-Actualisation | blue |

#### NeedStatusEnum

| Case | Value | Label | Colour |
|------|-------|-------|--------|
| DRAFT | `draft` | Draft | gray |
| ACTIVE | `active` | Active | green |
| ARCHIVED | `archived` | Archived | amber |

---

### Existing Models (Relationship Additions Only)

#### Package (existing)

Add:
```php
public function needsV2(): HasMany
{
    return $this->hasMany(PackageNeedV2::class);
}
```

#### PackageBudgetItem (existing)

Add column: `package_need_v2_id` (nullable FK → `package_needs_v2`, nullOnDelete)

Add:
```php
public function packageNeedV2(): BelongsTo
{
    return $this->belongsTo(PackageNeedV2::class, 'package_need_v2_id')->withTrashed();
}
```

#### Risk (existing)

Add:
```php
public function packageNeedsV2(): MorphToMany
{
    return $this->morphedByMany(PackageNeedV2::class, 'riskable', 'riskables');
}
```

---

## Data Classes

### PackageNeedV2Data

```
domain/Package/Data/PackageNeedV2Data.php
```

| Property | Type | Validation |
|----------|------|------------|
| id | ?int | — |
| uuid | ?string | — |
| packageId | int | required, exists:packages,id |
| needCategoryV2Id | int | required, exists:need_categories_v2,id |
| description | string | required, min:1 |
| howWillBeMet | ?string | nullable |
| fundingSource | string | required, in:FundingSourceEnum |
| fundingSourceOther | ?string | required_if:fundingSource,OTHER |
| status | string | in:NeedStatusEnum, default:active |
| priority | int | min:0, default:0 |
| addToCarePlan | bool | default:true |
| riskIds | int[] | array of existing risk IDs |
| budgetItemIds | int[] | array of existing budget item IDs |
| needCategory | ?NeedCategoryV2Data | read-only, eager loaded |

### NeedCategoryV2Data

```
domain/Need/Data/NeedCategoryV2Data.php
```

| Property | Type |
|----------|------|
| id | int |
| name | string |
| label | string |
| maslowLevel | string |
| priorityOrder | int |
| icon | ?string |
| colour | ?string |
| description | ?string |
| isActive | bool |

### PackageNeedV2Options

```
domain/Package/Data/PackageNeedV2Options.php
```

| Property | Type | Notes |
|----------|------|-------|
| needCategories | NeedCategoryV2Data[] | Grouped by maslow_level |
| fundingSourceOptions | array | From FundingSourceEnum::toData() |
| statusOptions | array | From NeedStatusEnum::toData() |
| packageRisks | array | Package's existing risks |
| packageBudgetItems | array | Package's existing budget items |
