---
title: "Implementation Plan: Coordinator Check-In Settings, Import/Export & Hybrid Type"
---

# Implementation Plan: Coordinator Check-In Settings, Import/Export & Hybrid Type

**Branch**: `feature/check-ins` | **Date**: 2026-03-12 | **Spec**: [spec.md](spec.md)
**Extends**: [plan.md](plan.md) (original Care Partner Check-Ins plan)
**Feature Flag**: `coordinator-check-ins-feature` (new, separate from `care-partner-check-ins-feature`)

## Summary

Extend the existing Check-In system with coordinator-level settings, a new Hybrid check-in type for Trilogy Care Internal Coordination, CSV import/export from the Check-Ins Index page, and a UUID column for portable check-in identification. Initially feature-flagged to only generate check-ins for packages under Internal Coordination — other coordinators (self-managed, external) opt in later.

## Technical Context

**Extends**: Existing `domain/CheckIn/` domain (models, actions, enums, controllers already built)
**New Dependencies**: `maatwebsite/excel` (already installed — used by `CheckInCompletionExport`)
**Key Models Affected**: `CareCoordinator`, `CheckIn`, `CheckInTypeEnum`, `ClientCadenceSetting`
**Feature Flag**: New `coordinator-check-ins-feature` Pennant flag with Nova settings integration

## Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Cadence hierarchy | Coordinator default → package `ClientCadenceSetting` overrides | Coordinators set org-wide default, individual packages can diverge |
| Hybrid type | Single check-in for Internal Coordination packages | CP is also the coordinator — no need for separate INT + EXT |
| Import format | CSV via `maatwebsite/excel` | Simple, already in codebase for bill imports |
| Import scope | Status updates only (mark as done) | Minimal validation — no wellbeing/summary required |
| UUID | New column on `check_ins` table | Portable identifier for import/export matching |
| Export/Import UI | From Check-Ins Index page | Both internal staff and coordinators access from same page |
| Coordinator identification | Specific coordinator ID (production) | `is_internal` flag on CareCoordinator for portability |
| Clinical type | OUT OF SCOPE | Deferred — same questions but may add more later |

---

## Data Model Changes

### 1. Add UUID to `check_ins` table

| Column | Type | Notes |
|--------|------|-------|
| `uuid` | `uuid` | Unique, indexed. Generated on creation via `Str::uuid()` |

### 2. Add coordinator check-in settings to `care_coordinators` table

| Column | Type | Notes |
|--------|------|-------|
| `check_ins_enabled` | `boolean->default(false)` | Whether this coordinator's packages get auto-generated check-ins |
| `check_in_cadence_months` | `unsignedTinyInteger->default(3)` | Default cadence for this coordinator's packages (1, 2, 3, 6, 12) |
| `is_internal_coordination` | `boolean->default(false)` | True for Trilogy Care Internal Coordination — generates Hybrid type |

### 3. New enum value: `CheckInTypeEnum::Hybrid`

```php
/** Hybrid check-in for Internal Coordination — counts as both internal and external */
#[Label('Hybrid')]
case Hybrid = 'hybrid';
```

### 4. Cadence Hierarchy

```
1. ClientCadenceSetting (per-package override) — if set, always wins
2. CareCoordinator->check_in_cadence_months — coordinator's default
3. CheckIn::DEFAULT_CADENCE_MONTHS (3) — system fallback
```

---

## Project Structure (New/Modified Files)

```text
# Migrations
database/migrations/
├── xxxx_add_uuid_to_check_ins_table.php
├── xxxx_add_check_in_settings_to_care_coordinators_table.php

# Enum (modified)
domain/CheckIn/Enums/CheckInTypeEnum.php          # + Hybrid case

# Model (modified)
app/Models/Organisation/CareCoordinator.php        # + new fields in $fillable, casts
domain/CheckIn/Models/CheckIn.php                  # + uuid field, boot() for auto-generation

# Actions (new)
domain/CheckIn/Actions/GenerateCoordinatorCheckInsAction.php   # New generator for coordinator check-ins
domain/CheckIn/Actions/ExportCheckInsAction.php                # CSV export action
domain/CheckIn/Actions/ImportCheckInsAction.php                # CSV import action

# Import/Export
app/Exports/CheckInExport.php                      # Per-row CSV export (not aggregated like CompletionExport)
app/Imports/CheckIn/CheckInImport.php              # CSV import — match by UUID, update status

# Controllers (modified + new)
app/Http/Controllers/Staff/CheckIn/CheckInIndexController.php  # + export/import actions
app/Http/Controllers/Staff/CheckIn/CheckInExportController.php # New — handles CSV download
app/Http/Controllers/Staff/CheckIn/CheckInImportController.php # New — handles CSV upload

# Data classes
domain/CheckIn/Data/ImportCheckInData.php          # Validation for import rows

# Job (modified)
app/Jobs/ProcessCheckInsJob.php                    # + call GenerateCoordinatorCheckInsAction

# Feature flag
# Register `coordinator-check-ins-feature` in Pennant + Nova settings

# Frontend (modified)
resources/js/Pages/Staff/CheckIns/Index.vue        # + Export/Import buttons

# Seeder
database/seeders/CoordinatorCheckInSeeder.php      # Seeds check-ins for coordinator packages

# Tests
tests/Feature/CheckIn/Actions/GenerateCoordinatorCheckInsActionTest.php
tests/Feature/CheckIn/Http/Controllers/CheckInExportControllerTest.php
tests/Feature/CheckIn/Http/Controllers/CheckInImportControllerTest.php
```

---

## API Contracts

### New Routes

| Method | URI | Controller@Method | Purpose |
|--------|-----|-------------------|---------|
| `GET` | `staff/check-ins/export` | `CheckInExportController@export` | Download CSV of check-ins (filtered by role) |
| `POST` | `staff/check-ins/import` | `CheckInImportController@import` | Upload CSV to update check-ins |

### Export CSV Columns

```csv
uuid,tc_customer_no,client_name,type,status,due_date,assigned_to,wellbeing_rating,summary_notes,follow_up_actions,completed_at
```

### Import CSV — Accepted Columns

```csv
uuid,status,summary_notes
```

- `uuid` — **required**, matches existing check-in
- `status` — optional, only `completed` is accepted (marks as done: sets `completed_at = now()`, `completed_by_id = importer`)
- `summary_notes` — optional, appends import note (e.g. "[Imported] coordinator notes here")

---

## Implementation Phases

### Phase 1: Database & Enum (Foundation)

1. **Migration: Add UUID to check_ins** — `uuid` column, unique index, backfill existing records
2. **Migration: Add coordinator settings to care_coordinators** — `check_ins_enabled`, `check_in_cadence_months`, `is_internal_coordination`
3. **Enum: Add Hybrid** — New `CheckInTypeEnum::Hybrid` case with label
4. **Model: CheckIn** — Add `uuid` to fillable, add `boot()` method to auto-generate UUID on creating
5. **Model: CareCoordinator** — Add new fields to `$fillable` and `casts()`
6. **Feature flag** — Register `coordinator-check-ins-feature` in Pennant + Nova settings (`ff_coordinator_check_ins`)

### Phase 2: Generator Action

1. **GenerateCoordinatorCheckInsAction** — New action that:
   - Queries packages where `care_coordinator.check_ins_enabled = true`
   - Filters by feature flag (`coordinator-check-ins-feature` active)
   - For `is_internal_coordination` coordinators → generates `Hybrid` type assigned to `case_manager_id` (Care Partner)
   - For other coordinators → generates `External` type assigned to coordinator's `owner_user_id`
   - Cadence: `ClientCadenceSetting` → coordinator default → system default (3 months)
   - Same dedup logic as existing `GenerateCheckInsAction` (skip if pending/in-progress exists)
2. **ProcessCheckInsJob** — Add call to `GenerateCoordinatorCheckInsAction::run()` after existing generation
3. **Artisan command** — Extend `app:process-check-ins` to include coordinator generation

### Phase 3: Export

1. **CheckInExport** — `maatwebsite/excel` class implementing `FromQuery`, `WithHeadings`, `WithMapping`
   - Internal staff: all check-ins
   - Coordinators: only their packages' check-ins (same scoping as Index page)
   - Includes UUID for round-trip import
2. **CheckInExportController** — `GET /staff/check-ins/export` with role-based query scoping
3. **Index.vue** — Add "Export CSV" button to header actions

### Phase 4: Import

1. **CheckInImport** — `maatwebsite/excel` class implementing `ToCollection`, `WithHeadingRow`, `WithValidation`
   - Match by UUID
   - Status `completed` → sets `completed_at = now()`, `completed_by_id = auth()->id()`, `status = Completed`
   - `summary_notes` → updates if provided (prefixed with `[Imported]`)
   - Validation: UUID must exist, status must be `completed` if provided
   - Coordinators can only import their own packages' check-ins
2. **CheckInImportController** — `POST /staff/check-ins/import` with file upload
3. **Index.vue** — Add "Import CSV" button + file upload modal

### Phase 5: Seeder & Polish

1. **CoordinatorCheckInSeeder** — Creates check-ins for packages under coordinators with `check_ins_enabled = true`
2. **Update existing CheckInSeeder** — Include Hybrid type check-ins
3. **Tests** — Full coverage for all new actions, controllers, import/export

---

## Testing Strategy

### Phase 1: Foundation Tests

- Migration runs without errors
- UUID auto-generated on CheckIn creation
- CareCoordinator new fields persist correctly
- `CheckInTypeEnum::Hybrid` label resolves

### Phase 2: Generator Tests

- **Unit**: `GenerateCoordinatorCheckInsAction`
  - Generates Hybrid for `is_internal_coordination` coordinators
  - Generates External for non-internal coordinators
  - Respects cadence hierarchy (package → coordinator → default)
  - Skips packages with existing pending/in-progress check-ins
  - Only generates when `check_ins_enabled = true`
  - Only generates when feature flag active
  - Assigns to `case_manager_id` for Hybrid, `owner_user_id` for External
- **Feature**: `ProcessCheckInsJob` includes coordinator generation

### Phase 3: Export Tests

- **Feature**: `CheckInExportController`
  - Internal staff gets all check-ins in CSV
  - Coordinator gets only their packages' check-ins
  - CSV contains UUID column
  - Feature flag gating (403 when disabled)

### Phase 4: Import Tests

- **Feature**: `CheckInImportController`
  - Valid CSV marks check-in as completed
  - Invalid UUID returns validation error
  - Coordinator can only import their own packages' check-ins
  - Status only accepts `completed`
  - Summary notes prefixed with `[Imported]`
  - Feature flag gating

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| UUID backfill on large table | Low | Medium | Run in migration with chunked update, or as a separate artisan command |
| Coordinator without `owner_user_id` | Medium | Low | Flag check-in as unassigned (same pattern as existing generator) |
| Import CSV with invalid UUIDs | Medium | Low | Validation errors returned per-row, valid rows still processed |
| Hybrid type breaks existing filters | Low | Medium | Update all `type` filters to include `hybrid` where appropriate |
| Cadence hierarchy confusion | Low | Low | Document hierarchy clearly, show effective cadence in UI |

---

## Architecture Gate Check

**Date**: 2026-03-12
**Status**: PASS

### Technical Feasibility
- [x] Architecture approach clear — Extends existing CheckIn domain with new action, enum value, and coordinator settings
- [x] Existing patterns leveraged — Same `AsAction` pattern, `maatwebsite/excel` for import/export (5 existing imports), `ProcessCheckInsJob` scheduling
- [x] All requirements buildable — Coordinator settings, Hybrid type, CSV import/export, UUID, feature flag
- [x] Performance considered — UUID index, chunked import, same query patterns as existing generator
- [x] Security considered — Role-based export scoping, coordinator-limited imports, feature flag middleware

### Data & Integration
- [x] Data model understood — 2 migrations (UUID on check_ins, settings on care_coordinators), 1 new enum value
- [x] API contracts clear — 2 new endpoints (export GET, import POST)
- [x] Dependencies identified — `maatwebsite/excel` (already installed), Pennant (already used)
- [x] Integration points mapped — ProcessCheckInsJob, CheckInIndexController, CareCoordinator model
- [x] DTO persistence explicit — ImportCheckInData validates input, action maps fields to model update

### Implementation Approach
- [x] File changes identified — Full list of new/modified files documented
- [x] Risk areas noted — UUID backfill, coordinator assignment, hybrid type in filters
- [x] Testing approach defined — Per-phase test strategy covering all new functionality
- [x] Rollback possible — Feature flag disables all coordinator generation, import/export routes gated

### Resource & Scope
- [x] Scope matches spec — Focused on coordinator settings + import/export, clinical type deferred
- [x] Effort reasonable — Extends existing patterns, no novel architecture
- [x] Skills available — Standard Laravel patterns, existing import/export examples in codebase

### Laravel & Cross-Platform Best Practices
- [x] No hardcoded business logic — Cadence, coordinator type, feature flag all backend-driven
- [x] Cross-platform reusability — Actions work for any consumer (API, CLI, Vue)
- [x] Laravel Data for validation — ImportCheckInData validates import rows
- [x] Model route binding — Controllers use model instances
- [x] No magic numbers/IDs — Cadence hierarchy documented, coordinator identified by `is_internal_coordination` flag
- [x] Common components pure — Export/Import buttons use CommonButton, no business logic
- [x] Use Lorisleiva Actions — All new actions use `AsAction` trait
- [x] Action authorization in authorize() — Export/import authorized in action, not controller
- [x] Data classes remain anemic — ImportCheckInData holds validation only
- [x] Migrations schema-only — UUID backfill as data operation, not in schema migration
- [x] Models have single responsibility — CareCoordinator gets settings, CheckIn gets UUID
- [x] Granular model policies — CheckInPolicy extended with `export` and `import` methods
- [x] Response objects in auth — Policy returns `Response::allow()` / `Response::deny()`
- [x] Feature flags dual-gated — Backend: `feature-flag:coordinator-check-ins-feature` middleware. Frontend: conditional rendering based on feature flag prop

### Vue TypeScript Standards
- [x] All modified Vue components use `<script setup lang="ts">`
- [x] Props use named `type` — extends existing `Props` type in Index.vue
- [x] No `any` types planned — import/export data shapes typed
- [x] Common components reused — CommonButton for export/import actions

---

## Next Steps

1. Run `/speckit-tasks` to generate implementation tasks from this plan
2. Start Phase 1 (migrations + enum + model changes)
3. Phase 2 (generator action) — can be tested independently with artisan command
4. Phase 3-4 (export/import) — UI integration last
