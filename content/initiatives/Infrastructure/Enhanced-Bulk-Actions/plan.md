---
title: "Plan"
---


**Spec**: [spec.md](./spec.md)
**Created**: 2025-12-21
**Status**: Draft
**Branch**: `001-enhanced-bulk-actions`

---

## Summary

Enhance the CommonTable bulk actions system with a Gmail-style floating action bar, improved selection UX, bulk tag management, confirmation dialogs, and undo capability. The implementation leverages existing infrastructure (tags via Spatie, confirmation dialogs, toasts) while adding new components for the floating bar pattern and selection enhancements.

---

## Technical Context

### Technology Stack
- **Backend**: Laravel 12, PHP 8.4
- **Frontend**: Vue 3, Inertia.js v2, TypeScript
- **Database**: MySQL
- **UI Components**: Reka UI (dropdowns, dialogs), Tailwind CSS v3
- **Table Package**: InertiaUI Table (with built-in sticky header/columns support)
- **Tags**: Spatie Laravel Tags with custom `HasTags` trait override
- **Testing**: Pest v3 (unit + feature), Dusk v8 or Nightwatch v1 (browser)

### Dependencies
- Existing `CommonTable.vue` component and `actions.js` composable
- Existing `CommonConfirmDialog.vue` and `useConfirmDialog.ts`
- Existing `CommonToastContainer.vue` and `useToast.js`
- Existing tag components (`CommonTagGroup.vue`, `TagForm.vue`)
- Existing `TagData` DTO and tag infrastructure

### Constraints
- Cross-page selection limited to 1000 items (performance)
- Undo capability only for reversible actions (tag add/remove)
- Backend-defined action categories (PHP configuration)
- Per-action authorization (existing pattern)
- Must support dark mode (existing pattern)

---

## Constitution Check

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Majestic Monolith | ✅ PASS | All code in domain modules, no microservices |
| II. Domain-Driven Design | ✅ PASS | Tag infrastructure in `Domain\Shared`, table actions in domain tables |
| III. Convention Over Configuration | ✅ PASS | Extends existing action patterns, Laravel conventions |
| IV. Code Quality Standards | ✅ PASS | TypeScript for frontend, explicit types for PHP |
| V. Testing is First-Class | ✅ PASS | Unit + Feature + Browser tests planned |
| VIII. Action Classes | ✅ PASS | `BulkAddTagsAction`, `BulkRemoveTagsAction` following patterns |
| X. Inertia.js + Vue 3 + TypeScript | ✅ PASS | New Vue components with TypeScript |
| XI. Component Library & Tailwind | ✅ PASS | Reka UI dropdowns, Tailwind styling, dark mode |
| XII. Design System | ✅ PASS | Keyboard support, focus visible, 44px touch targets |
| XV. Permissions & Authorization | ✅ PASS | Per-action permissions via existing `authorized` flag |

---

## Design Decisions

### Data Model

**Selection State** (Frontend reactive state):
```typescript
interface SelectionState {
  selectedItems: (string | number)[];   // Primary keys of selected items
  allItemIds: (string | number)[];      // All item IDs on current page
  allItemsAreSelected: boolean;         // Computed: page fully selected
  crossPageSelection: boolean;          // Select all across pages
  crossPageCount: number;               // Total items across pages (max 1000)
}
```

**Bulk Action Configuration** (Backend PHP):
```php
Action::make('Add Tags', id: 'bulk_add_tags')
    ->asBulkAction()
    ->category('tags')           // NEW: Group in dropdown
    ->icon('heroicons:tag')      // Icon for dropdown
    ->quickAction()              // NEW: Show as quick action button
    ->confirmable()              // NEW: Require confirmation
    ->undoable()                 // NEW: Support undo
    ->visibleWhen(fn () => $this->model->usesTags());  // Conditional visibility
```

**Action Category** (Backend enum):
```php
enum ActionCategory: string {
    case TAGS = 'tags';
    case EXPORT = 'export';
    case EDIT = 'edit';
    case DANGER = 'danger';  // Always at bottom, red styling
}
```

### API Contracts

**Bulk Tag Add/Remove Endpoint**:
```
POST /api/v1/bulk-actions/tags
{
  "action": "add" | "remove",
  "model_type": "supplier" | "package" | ...,
  "keys": [1, 2, 3, ...],           // Primary keys (max 1000)
  "tag_ids": [5, 8, 12],            // Tags to add/remove
  "cross_page": false,              // If true, use query instead of keys
  "query_params": {...}             // Filter params for cross-page selection
}

Response:
{
  "success": true,
  "affected_count": 42,
  "undo_token": "abc123",           // For undo capability
  "message": "Added 3 tags to 42 items"
}
```

**Get Tags for Entity Type**:
```
GET /api/v1/tags?type=supplier
Response: TagData[]
```

**Get Tags on Selected Items** (for Remove Tags):
```
POST /api/v1/bulk-actions/tags/present
{
  "model_type": "supplier",
  "keys": [1, 2, 3],
  "cross_page": false,
  "query_params": {...}
}

Response:
{
  "tags": [
    { "id": 5, "name": "Urgent", "count": 3 },
    { "id": 8, "name": "VIP", "count": 1 }
  ]
}
```

**Undo Bulk Action**:
```
POST /api/v1/bulk-actions/undo
{
  "undo_token": "abc123"
}

Response:
{
  "success": true,
  "message": "Undone: Removed 3 tags from 42 items"
}
```

### UI Components

**New Components**:
1. `BulkActionBar.vue` - Floating bar at bottom of viewport
2. `BulkActionTagSelector.vue` - Tag multi-select dropdown (upward expansion)
3. `useBulkActions.ts` - Composable for selection state + cross-page logic

**Modified Components**:
1. `CommonTable.vue` - Add floating bar integration, shift+click, row highlighting
2. `CommonTableAction.vue` - Enhanced dropdown with categories and icons
3. `actions.js` → `actions.ts` - Convert to TypeScript, add cross-page support

### Floating Bar Layout (from design.md)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  ✓ 12 selected  [Clear]  "Select all 847"  ─────  [Add Tags] [More ▾]  [✕]  │
└─────────────────────────────────────────────────────────────────────────────┘

Position: fixed, bottom: 24px, centered horizontally
Animation: slide-up 200ms ease-out on appear
Background: white (dark: gray-800), shadow-lg, rounded-lg
Z-index: 50 (above table, below modals)
```

---

## Implementation Phases

### Phase 1: Foundation (P1 Features)

**Goal**: Selection visibility, enhanced row highlighting, shift+click selection

**Tasks**:
1. Convert `actions.js` to `actions.ts` with proper TypeScript interfaces
2. Create `useBulkActions.ts` composable with:
   - Extended selection state (cross-page support)
   - Shift+click range selection logic
   - Keyboard shortcuts (Cmd/Ctrl+A, Escape)
3. Enhance `CommonTable.vue`:
   - Add selected row highlighting (teal tint: `bg-teal-50 dark:bg-teal-900/20`)
   - Implement shift+click handler
   - Add keyboard event listeners
4. Create `BulkActionBar.vue` skeleton:
   - Selection count display
   - Clear button
   - Dismiss (X) button
   - Slide-up animation

**Deliverables**:
- Selection count always visible when items selected
- Shift+click range selection working
- Selected rows highlighted
- Keyboard shortcuts functional

### Phase 2: Floating Bar & Dropdown (P2 Features)

**Goal**: Full floating bar with grouped dropdown, action confirmation

**Tasks**:
1. Complete `BulkActionBar.vue`:
   - "Select all X items" link for cross-page
   - Quick action buttons (backend-defined)
   - "More" dropdown with grouped actions
2. Enhance action configuration in PHP:
   - Add `category()` fluent method to `Action` class
   - Add `quickAction()` fluent method
   - Add `confirmable()` with custom messages
   - Serialize action metadata to frontend
3. Enhance `CommonTableAction.vue`:
   - Group actions by category
   - Add icons to all actions
   - Separate destructive actions at bottom
   - Red styling for danger actions
4. Implement confirmation flow:
   - Use existing `useConfirmDialog`
   - Display action name, item count, consequences
   - Type-specific styling (danger = red)

**Deliverables**:
- Floating bar fully functional
- Actions grouped by category with icons
- Confirmation dialogs for all actions
- Cross-page selection (up to 1000 items)

### Phase 3: Tag Management (P2 Features)

**Goal**: Bulk Add/Remove Tags as standard actions

**Tasks**:
1. Create `BulkActionTagSelector.vue`:
   - Upward-expanding dropdown from floating bar
   - Multi-select with checkboxes
   - Tag color/icon indicators
   - For Remove: show item counts per tag
2. Create backend actions:
   - `BulkAddTagsAction` in `Domain\Shared\Actions`
   - `BulkRemoveTagsAction` in `Domain\Shared\Actions`
   - `GetTagsForSelectionAction` (for Remove Tags UI)
3. Create API endpoints:
   - `BulkTagController` with add/remove/present methods
   - Request validation (`BulkTagRequest`)
   - Response DTOs
4. Wire up in table configuration:
   - Auto-add tag actions for models with `HasTags` trait
   - Visibility condition based on trait detection

**Deliverables**:
- Add Tags action with tag selector
- Remove Tags action with item counts
- Success toast on completion
- Tags filter available on taggable tables (FR-019, FR-020)

### Phase 4: Sticky Table Features (P2 Features)

**Goal**: Sticky header and key columns for improved table UX

**Tasks**:
1. Enable InertiaUI Table sticky header:
   - Add `$stickyHeader = true` to `BaseTable.php`
   - Verify CSS compatibility with existing styles
   - Test with floating bar visibility
2. Configure sticky columns:
   - Add `stickable()` method to key columns (Name, ID)
   - Ensure shadow/border on sticky edge
   - Test horizontal scroll behavior
3. CSS adjustments:
   - Z-index layering (header > sticky columns > content)
   - Shadow transitions for scroll indicators
   - Dark mode compatibility

**Deliverables**:
- Table header stays visible during vertical scroll
- Key columns stay visible during horizontal scroll
- Visual indicators for scroll state

### Phase 5: Undo & Polish (P3 Features)

**Goal**: Undo capability, keyboard shortcuts, final polish

**Tasks**:
1. Implement undo infrastructure:
   - Create `BulkActionUndo` model for storing undo data
   - Add `undo_token` to action responses
   - Create `UndoBulkActionAction`
   - Add undo endpoint
2. Enhance toast system:
   - Add "Undo" button to success toasts
   - 10-second timeout for undo availability
   - Undo button disappears after timeout
3. Complete keyboard shortcuts:
   - Escape to clear selection and dismiss bar
   - Cmd/Ctrl+A to select all visible rows
4. Final polish:
   - Performance optimization for large selections
   - Animation refinements
   - Accessibility audit (keyboard navigation, focus management)
   - Dark mode testing

**Deliverables**:
- Undo capability for tag actions
- Full keyboard shortcut support
- Polished animations and transitions
- Accessibility compliance

---

## Testing Strategy

### Phase 1 Tests

**Unit Tests** (`tests/Unit/`):
- `SelectionStateTest.php` - Selection logic, range calculation
- `ShiftClickSelectionTest.php` - Range selection edge cases

**Feature Tests** (`tests/Feature/`):
- `BulkSelectionTest.php` - API for cross-page selection IDs

**Browser Tests** (`tests/Browser/`):
- `BulkActionSelectionTest.php`:
  - Single row selection shows count
  - Multiple row selection updates count
  - Shift+click selects range
  - Clear button resets selection
  - Escape key clears selection

### Phase 2 Tests

**Feature Tests**:
- `BulkActionConfirmationTest.php` - Confirmation flow for actions

**Browser Tests**:
- `BulkActionBarTest.php`:
  - Floating bar appears on selection
  - Bar dismisses on clear
  - "Select all X items" link works
  - Quick actions visible
  - More dropdown opens with grouped actions

### Phase 3 Tests

**Unit Tests**:
- `BulkAddTagsActionTest.php`
- `BulkRemoveTagsActionTest.php`
- `GetTagsForSelectionActionTest.php`

**Feature Tests**:
- `BulkTagApiTest.php`:
  - Add tags to multiple items
  - Remove tags from multiple items
  - Cross-page tag operations
  - Permission checks
  - 1000 item limit enforcement

**Browser Tests**:
- `BulkTagManagementTest.php`:
  - Open Add Tags selector
  - Select multiple tags
  - Confirm and see success toast
  - Remove Tags shows item counts
  - Tag filter works on taggable tables

### Phase 4 Tests

**Browser Tests**:
- `StickyTableTest.php`:
  - Header stays fixed on scroll
  - Key column stays fixed on horizontal scroll
  - Z-index layering correct

### Phase 5 Tests

**Feature Tests**:
- `BulkActionUndoTest.php`:
  - Undo token generated on action
  - Undo reverses action
  - Undo expires after timeout

**Browser Tests**:
- `BulkActionUndoFlowTest.php`:
  - Undo button appears in toast
  - Clicking undo reverses action
  - Undo button disappears after timeout

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Performance with 1000 items | Medium | Medium | Chunk operations, use database transactions, progress indicators |
| Cross-page selection complexity | Medium | Medium | Phased rollout, start with page-only, add cross-page in P2 |
| Undo data storage growth | Low | Low | TTL on undo records (10 min), cleanup job |
| InertiaUI Table sticky conflicts | Low | Medium | Test thoroughly, fallback to CSS-only solution |
| Dark mode styling gaps | Low | Low | Comprehensive dark mode testing in each phase |

---

## File Structure

### New Files

```
resources/js/
├── Components/
│   └── Common/
│       └── table/
│           ├── BulkActionBar.vue           # Floating action bar
│           ├── BulkActionTagSelector.vue   # Tag multi-select dropdown
│           └── actions.ts                  # Converted from actions.js
├── composables/
│   └── useBulkActions.ts                   # Selection state composable

domain/
└── Shared/
    ├── Actions/
    │   ├── BulkAddTagsAction.php
    │   ├── BulkRemoveTagsAction.php
    │   ├── GetTagsForSelectionAction.php
    │   └── UndoBulkActionAction.php
    ├── Data/
    │   ├── BulkTagData.php
    │   └── BulkActionResultData.php
    └── Models/
        └── BulkActionUndo.php              # Undo token storage

app/
├── Http/
│   └── Controllers/
│       └── Api/
│           └── V1/
│               └── BulkTagController.php
└── Extends/
    └── Table/
        └── Action.php                      # Extended with category(), quickAction(), etc.

tests/
├── Unit/
│   └── BulkActions/
│       ├── SelectionStateTest.php
│       ├── BulkAddTagsActionTest.php
│       └── BulkRemoveTagsActionTest.php
├── Feature/
│   └── BulkActions/
│       ├── BulkTagApiTest.php
│       └── BulkActionUndoTest.php
└── Browser/
    └── BulkActions/
        ├── BulkActionSelectionTest.php
        ├── BulkActionBarTest.php
        └── BulkTagManagementTest.php
```

### Modified Files

```
resources/js/Components/Common/table/
├── CommonTable.vue                         # Floating bar integration, shift+click
├── CommonTableAction.vue                   # Enhanced dropdown with categories
└── CommonTableRowAction.vue                # Action icon updates (if needed)

app/Tables/BaseTable.php                    # $stickyHeader = true

domain/Supplier/Tables/StaffSuppliersTable.php  # Example with tag actions
```

---

## Next Steps

1. Run `/speckit.tasks` to generate dependency-ordered tasks.md
2. Run `/speckit.plan-test` to generate comprehensive test plan (optional, enables TDD)
3. Create feature branch `001-enhanced-bulk-actions`
4. Begin Phase 1 implementation

---

## Context Updated

✓ Added to context/CONTEXT.md - Plan generation session recorded
