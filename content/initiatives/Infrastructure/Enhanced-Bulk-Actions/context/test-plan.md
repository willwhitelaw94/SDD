---
title: "Test Plan: Enhanced Bulk Actions"
---


**Spec**: [spec.md](./spec.md)
**Plan**: [plan.md](./plan.md)
**Created**: 2025-12-21
**Strategy**: Spec-Driven Development with TDD (Test-First Approach)

---

## Overview

**Test Approach**: Write tests FIRST, then code (TDD)

**Coverage Targets**:
- Unit tests: ≥80% of business logic
- Feature tests: 100% of API endpoints
- Browser tests: All critical user journeys (12 user stories)
- Integration tests: All multi-step workflows

**Test Tools**:
- Unit/Feature: Pest v3
- Browser: Nightwatch v1 (preferred) or Dusk v8

**User Stories to Test**: 12 stories (P1: 1, P2: 7, P3: 4)
**Functional Requirements**: 29 requirements
**Success Criteria**: 7 measurable outcomes

---

## Unit Tests

### Actions

#### BulkAddTagsAction
**Location**: `tests/Unit/BulkActions/BulkAddTagsActionTest.php`

```php
// FR-009, FR-011, FR-014
it('adds tags to multiple items', function () {});
it('adds tags only to items user has permission to modify', function () {});
it('handles items that already have the tag (silently skips)', function () {});
it('returns count of affected items', function () {});
it('generates undo token for reversible action', function () {});
it('respects 1000 item limit for cross-page operations', function () {});
it('throws exception for non-taggable models', function () {});
it('handles empty tag array gracefully', function () {});
it('handles empty keys array gracefully', function () {});
it('uses database transaction for atomicity', function () {});
```

#### BulkRemoveTagsAction
**Location**: `tests/Unit/BulkActions/BulkRemoveTagsActionTest.php`

```php
// FR-012, FR-013, FR-014
it('removes tags from multiple items', function () {});
it('removes only specified tags, not others', function () {});
it('handles items that do not have the tag (silently skips)', function () {});
it('returns count of affected items', function () {});
it('generates undo token for reversible action', function () {});
it('allows removing all tags from items', function () {});
it('handles mixed tag states across items', function () {});
```

#### GetTagsForSelectionAction
**Location**: `tests/Unit/BulkActions/GetTagsForSelectionActionTest.php`

```php
// FR-012, FR-013
it('returns tags present on selected items', function () {});
it('returns count of items per tag', function () {});
it('excludes tags not on any selected item', function () {});
it('handles cross-page selection with query params', function () {});
it('respects 1000 item limit', function () {});
```

#### UndoBulkActionAction
**Location**: `tests/Unit/BulkActions/UndoBulkActionActionTest.php`

```php
// FR-018, SC-004
it('reverses tag add action (removes tags)', function () {});
it('reverses tag remove action (adds tags back)', function () {});
it('throws exception for expired undo token', function () {});
it('throws exception for already-used undo token', function () {});
it('throws exception for non-existent undo token', function () {});
it('marks undo token as used after execution', function () {});
```

### Models

#### BulkActionUndo
**Location**: `tests/Unit/BulkActions/Models/BulkActionUndoTest.php`

```php
it('creates with valid attributes (token, action_type, payload)', function () {});
it('generates unique token on creation', function () {});
it('expires after configured timeout (10 seconds)', function () {});
it('scope excludes expired records', function () {});
it('scope excludes used records', function () {});
it('can be marked as used', function () {});
```

### Selection Logic

#### SelectionState
**Location**: `tests/Unit/BulkActions/SelectionStateTest.php`

```php
// FR-001, FR-002, FR-003, FR-003a, FR-003b
it('tracks selected item IDs', function () {});
it('calculates all items selected state', function () {});
it('tracks cross-page selection state', function () {});
it('enforces 1000 item maximum for cross-page', function () {});
it('clears selection on page navigation', function () {});
```

#### ShiftClickSelection
**Location**: `tests/Unit/BulkActions/ShiftClickSelectionTest.php`

```php
// FR-021, FR-022
it('selects range between two clicked rows', function () {});
it('extends existing selection with shift+click', function () {});
it('handles shift+click when no prior selection (single select)', function () {});
it('calculates correct range regardless of click order', function () {});
it('handles non-contiguous IDs correctly', function () {});
```

### Action Configuration

#### ActionCategory
**Location**: `tests/Unit/BulkActions/ActionCategoryTest.php`

```php
// FR-004, FR-006, FR-007
it('groups actions by category', function () {});
it('identifies danger category for destructive actions', function () {});
it('orders categories with danger at bottom', function () {});
```

#### ActionExtensions
**Location**: `tests/Unit/BulkActions/ActionExtensionsTest.php`

```php
// FR-005, FR-008, FR-010
it('fluently sets category on action', function () {});
it('fluently sets quick action flag', function () {});
it('fluently sets confirmable with custom message', function () {});
it('fluently sets undoable flag', function () {});
it('conditional visibility based on model trait', function () {});
it('serializes action metadata to frontend format', function () {});
```

---

## Feature Tests

### API Endpoints

#### POST /api/v1/bulk-actions/tags (Add/Remove)
**Location**: `tests/Feature/BulkActions/BulkTagApiTest.php`

**Happy Path - Add Tags**:
```php
// US-3, FR-009
it('adds tags to selected items', function () {
    $user = User::factory()->create();
    $suppliers = Supplier::factory()->count(5)->create();
    $tag = Tag::factory()->create(['type' => 'supplier']);

    $response = $this->actingAs($user)
        ->postJson('/api/v1/bulk-actions/tags', [
            'action' => 'add',
            'model_type' => 'supplier',
            'keys' => $suppliers->pluck('id')->toArray(),
            'tag_ids' => [$tag->id],
        ]);

    $response->assertOk()
        ->assertJsonStructure(['success', 'affected_count', 'undo_token', 'message']);

    foreach ($suppliers as $supplier) {
        expect($supplier->fresh()->tags)->toContain($tag);
    }
});

it('returns undo token for reversible action', function () {});
it('respects per-action authorization', function () {});
it('rejects cross-page selection over 1000 items', function () {});
```

**Happy Path - Remove Tags**:
```php
// US-3, FR-012
it('removes tags from selected items', function () {});
it('handles items without the tag gracefully', function () {});
```

**Error Cases**:
```php
it('returns 422 for missing required fields', function () {});
it('returns 422 for invalid model_type', function () {});
it('returns 422 for non-existent tag_ids', function () {});
it('returns 403 for unauthorized user', function () {});
it('returns 422 for non-taggable model', function () {});
```

#### POST /api/v1/bulk-actions/tags/present
**Location**: `tests/Feature/BulkActions/GetTagsOnSelectionApiTest.php`

```php
// US-3, FR-012, FR-013
it('returns tags present on selected items with counts', function () {
    $user = User::factory()->create();
    $suppliers = Supplier::factory()->count(3)->create();
    $tag1 = Tag::factory()->create(['type' => 'supplier']);
    $tag2 = Tag::factory()->create(['type' => 'supplier']);

    $suppliers[0]->attachTag($tag1);
    $suppliers[1]->attachTag($tag1);
    $suppliers[1]->attachTag($tag2);

    $response = $this->actingAs($user)
        ->postJson('/api/v1/bulk-actions/tags/present', [
            'model_type' => 'supplier',
            'keys' => $suppliers->pluck('id')->toArray(),
        ]);

    $response->assertOk()
        ->assertJsonFragment(['id' => $tag1->id, 'count' => 2])
        ->assertJsonFragment(['id' => $tag2->id, 'count' => 1]);
});

it('returns empty array when no tags on selection', function () {});
it('handles cross-page selection with query_params', function () {});
```

#### POST /api/v1/bulk-actions/undo
**Location**: `tests/Feature/BulkActions/BulkActionUndoApiTest.php`

```php
// US-6, FR-018, SC-004
it('reverses add tags action', function () {
    // Setup: Execute add tags action
    // Act: Call undo with token
    // Assert: Tags removed from items
});

it('reverses remove tags action', function () {});
it('returns 404 for non-existent token', function () {});
it('returns 410 for expired token', function () {});
it('returns 409 for already-used token', function () {});
```

#### GET /api/v1/tags?type={type}
**Location**: `tests/Feature/BulkActions/GetTagsApiTest.php`

```php
// FR-011
it('returns all tags for entity type', function () {});
it('includes tag colour and icon metadata', function () {});
it('returns empty array for type with no tags', function () {});
```

### Tag Filter

**Location**: `tests/Feature/BulkActions/TagFilterTest.php`

```php
// US-7, FR-019, FR-020
it('filters table by single tag', function () {});
it('filters table by multiple tags (OR logic)', function () {});
it('returns empty when no items match tags', function () {});
it('tag filter available on taggable tables only', function () {});
```

### Cross-Page Selection

**Location**: `tests/Feature/BulkActions/CrossPageSelectionTest.php`

```php
// FR-003a, FR-003b
it('returns all item IDs for cross-page selection', function () {});
it('applies current filters to cross-page query', function () {});
it('limits cross-page selection to 1000 items', function () {});
it('returns warning when limit exceeded', function () {});
```

### Action Confirmation

**Location**: `tests/Feature/BulkActions/ActionConfirmationTest.php`

```php
// US-4, FR-015, FR-016
it('requires confirmation for destructive actions', function () {});
it('confirmation payload includes action name and count', function () {});
it('action executes after confirmation', function () {});
it('action cancelled on confirmation decline', function () {});
```

---

## Browser Tests

### User Story 1: Selection Visibility (P1)
**Location**: `tests/Browser/BulkActions/SelectionVisibilityTest.php`

```php
// FR-001, FR-002, FR-003, SC-001
it('displays selection count when items selected', function () {
    $this->browse(function ($browser) {
        $browser->visit('/staff/suppliers')
            ->click('@row-checkbox-1')
            ->assertSee('1 selected')
            ->click('@row-checkbox-2')
            ->assertSee('2 selected');
    });
});

it('shows count without opening dropdown', function () {
    // Verify count is visible in floating bar, not hidden
});

it('distinguishes all items selected state', function () {
    $this->browse(function ($browser) {
        $browser->visit('/staff/suppliers')
            ->click('@select-all-checkbox')
            ->assertSee('All 25 selected');
    });
});

it('displays count within 1 second of selection', function () {
    // Performance test: SC-001
});
```

### User Story 2: Enhanced Dropdown with Grouping (P2)
**Location**: `tests/Browser/BulkActions/DropdownGroupingTest.php`

```php
// FR-004, FR-005, FR-006, FR-007, FR-008, SC-005
it('groups actions by category', function () {
    $this->browse(function ($browser) {
        $browser->visit('/staff/suppliers')
            ->click('@row-checkbox-1')
            ->click('@more-actions-button')
            ->assertSeeIn('@category-tags', 'Add Tags')
            ->assertSeeIn('@category-export', 'Export');
    });
});

it('displays icons alongside action labels', function () {});

it('visually distinguishes destructive actions (red)', function () {
    $this->browse(function ($browser) {
        $browser->visit('/staff/suppliers')
            ->click('@row-checkbox-1')
            ->click('@more-actions-button')
            ->assertPresent('@action-delete.text-red-600');
    });
});

it('separates destructive actions at bottom', function () {});

it('disables dropdown when no items selected', function () {
    $this->browse(function ($browser) {
        $browser->visit('/staff/suppliers')
            ->assertDisabled('@more-actions-button');
    });
});

it('opens dropdown in under 200ms', function () {
    // Performance test: SC-005
});
```

### User Story 3: Bulk Tag Management (P2)
**Location**: `tests/Browser/BulkActions/BulkTagManagementTest.php`

```php
// FR-009, FR-010, FR-011, FR-012, FR-013, FR-014, SC-006
it('shows Add Tags and Remove Tags for taggable tables', function () {
    $this->browse(function ($browser) {
        $browser->visit('/staff/suppliers')
            ->click('@row-checkbox-1')
            ->click('@more-actions-button')
            ->assertSee('Add Tags')
            ->assertSee('Remove Tags');
    });
});

it('Add Tags shows available tags with colours', function () {
    $this->browse(function ($browser) {
        $browser->visit('/staff/suppliers')
            ->click('@row-checkbox-1')
            ->click('@add-tags-button')
            ->assertPresent('@tag-selector')
            ->assertSee('Urgent')
            ->assertPresent('@tag-urgent.bg-red-500'); // colour indicator
    });
});

it('adds selected tags to all items with success message', function () {
    $this->browse(function ($browser) {
        $browser->visit('/staff/suppliers')
            ->click('@row-checkbox-1')
            ->click('@row-checkbox-2')
            ->click('@add-tags-button')
            ->click('@tag-urgent')
            ->click('@confirm-button')
            ->assertSee('Added 1 tag to 2 items');
    });
});

it('Remove Tags shows only tags on selected items', function () {});

it('Remove Tags shows item count per tag', function () {
    $this->browse(function ($browser) {
        $browser->visit('/staff/suppliers')
            ->selectMultipleRows([1, 2, 3])
            ->click('@remove-tags-button')
            ->assertSee('Urgent (2 items)');
    });
});

it('bulk-adds tags to 100 items in under 5 seconds', function () {
    // Performance test: SC-006
});

it('hides tag actions for non-taggable tables', function () {
    $this->browse(function ($browser) {
        $browser->visit('/staff/users') // Non-taggable
            ->click('@row-checkbox-1')
            ->click('@more-actions-button')
            ->assertDontSee('Add Tags');
    });
});
```

### User Story 4: Action Confirmation (P2)
**Location**: `tests/Browser/BulkActions/ActionConfirmationTest.php`

```php
// FR-015, FR-016, FR-017, SC-003
it('shows confirmation dialog for destructive actions', function () {
    $this->browse(function ($browser) {
        $browser->visit('/staff/suppliers')
            ->click('@row-checkbox-1')
            ->click('@more-actions-button')
            ->click('@action-delete')
            ->assertPresent('@confirm-dialog')
            ->assertSee('Delete 1 item')
            ->assertSee('This action cannot be undone');
    });
});

it('confirmation displays action name item count consequences', function () {});

it('shows success toast after confirmed action', function () {
    $this->browse(function ($browser) {
        $browser->visit('/staff/suppliers')
            ->selectRow(1)
            ->triggerAction('export')
            ->click('@confirm-button')
            ->assertPresent('@toast-success')
            ->assertSee('Exported 1 item');
    });
});

it('all destructive actions require confirmation', function () {
    // SC-003: 100% of destructive actions
});
```

### User Story 5: Quick Access Actions (P3)
**Location**: `tests/Browser/BulkActions/QuickAccessActionsTest.php`

```php
it('shows common actions as direct buttons', function () {
    $this->browse(function ($browser) {
        $browser->visit('/staff/suppliers')
            ->click('@row-checkbox-1')
            ->assertPresent('@quick-action-add-tags')
            ->assertPresent('@quick-action-export');
    });
});

it('quick action triggers same confirmation flow', function () {});
```

### User Story 6: Undo Capability (P3)
**Location**: `tests/Browser/BulkActions/UndoCapabilityTest.php`

```php
// FR-018, SC-004
it('shows undo button in toast after reversible action', function () {
    $this->browse(function ($browser) {
        $browser->visit('/staff/suppliers')
            ->selectRow(1)
            ->addTag('Urgent')
            ->assertPresent('@toast-success')
            ->assertPresent('@undo-button');
    });
});

it('clicking undo reverses the action', function () {
    $this->browse(function ($browser) {
        $browser->visit('/staff/suppliers')
            ->selectRow(1)
            ->addTag('Urgent')
            ->click('@undo-button')
            ->assertSee('Undone: Removed 1 tag from 1 item');
    });
});

it('undo button disappears after 10 seconds', function () {
    // SC-004: 10 second timeout
    $this->browse(function ($browser) {
        $browser->visit('/staff/suppliers')
            ->selectRow(1)
            ->addTag('Urgent')
            ->assertPresent('@undo-button')
            ->pause(11000)
            ->assertMissing('@undo-button');
    });
});

it('undo remains available for at least 10 seconds', function () {
    // SC-004
});
```

### User Story 7: Tag Filtering in Tables (P3)
**Location**: `tests/Browser/BulkActions/TagFilteringTest.php`

```php
// FR-019, FR-020, SC-007
it('Tags filter available on taggable tables', function () {
    $this->browse(function ($browser) {
        $browser->visit('/staff/suppliers')
            ->click('@filters-button')
            ->assertSee('Tags');
    });
});

it('filtering by tag shows matching items', function () {
    $this->browse(function ($browser) {
        $browser->visit('/staff/suppliers')
            ->openFilters()
            ->selectTagFilter('Urgent')
            ->assertSee('Showing 3 results');
    });
});

it('multiple tag filter uses OR logic', function () {
    $this->browse(function ($browser) {
        $browser->visit('/staff/suppliers')
            ->openFilters()
            ->selectTagFilter(['Urgent', 'VIP'])
            ->assertSee('Showing 5 results'); // 3 Urgent + 2 VIP
    });
});

it('tag filter returns results in under 1 second', function () {
    // SC-007: Performance for 10,000+ rows
});
```

### User Story 8: Shift+Click Range Selection (P2)
**Location**: `tests/Browser/BulkActions/ShiftClickSelectionTest.php`

```php
// FR-021, FR-022
it('shift+click selects range between two rows', function () {
    $this->browse(function ($browser) {
        $browser->visit('/staff/suppliers')
            ->click('@row-checkbox-3')
            ->shiftClick('@row-checkbox-7')
            ->assertSee('5 selected');
    });
});

it('extends selection with subsequent shift+click', function () {
    $this->browse(function ($browser) {
        $browser->visit('/staff/suppliers')
            ->click('@row-checkbox-3')
            ->shiftClick('@row-checkbox-5')
            ->assertSee('3 selected')
            ->shiftClick('@row-checkbox-8')
            ->assertSee('6 selected'); // 3-8
    });
});

it('shift+click with no prior selection selects single row', function () {
    $this->browse(function ($browser) {
        $browser->visit('/staff/suppliers')
            ->shiftClick('@row-checkbox-5')
            ->assertSee('1 selected');
    });
});
```

### User Story 9: Enhanced Row Highlighting (P2)
**Location**: `tests/Browser/BulkActions/RowHighlightingTest.php`

```php
// FR-023, FR-024
it('selected rows have teal background highlight', function () {
    $this->browse(function ($browser) {
        $browser->visit('/staff/suppliers')
            ->click('@row-checkbox-1')
            ->assertPresent('@table-row-1.bg-teal-50');
    });
});

it('highlight persists during scroll', function () {
    $this->browse(function ($browser) {
        $browser->visit('/staff/suppliers')
            ->click('@row-checkbox-1')
            ->scrollTo('@table-row-25')
            ->scrollTo('@table-row-1')
            ->assertPresent('@table-row-1.bg-teal-50');
    });
});

it('hover state distinct from selected state', function () {
    $this->browse(function ($browser) {
        $browser->visit('/staff/suppliers')
            ->click('@row-checkbox-1')
            ->mouseover('@table-row-1')
            ->assertPresent('@table-row-1.bg-teal-100'); // Darker on hover
    });
});
```

### User Story 10: Keyboard Shortcuts (P3)
**Location**: `tests/Browser/BulkActions/KeyboardShortcutsTest.php`

```php
// FR-025, FR-026
it('Cmd/Ctrl+A selects all visible rows', function () {
    $this->browse(function ($browser) {
        $browser->visit('/staff/suppliers')
            ->click('@table') // Focus table
            ->keys('@table', ['{meta}', 'a'])
            ->assertSee('All 25 selected');
    });
});

it('Escape clears selection', function () {
    $this->browse(function ($browser) {
        $browser->visit('/staff/suppliers')
            ->click('@row-checkbox-1')
            ->assertSee('1 selected')
            ->keys('@table', '{escape}')
            ->assertDontSee('selected');
    });
});

it('Escape dismisses floating bar', function () {
    $this->browse(function ($browser) {
        $browser->visit('/staff/suppliers')
            ->click('@row-checkbox-1')
            ->assertPresent('@bulk-action-bar')
            ->keys('@table', '{escape}')
            ->assertMissing('@bulk-action-bar');
    });
});
```

### User Story 11: Sticky Table Header (P2)
**Location**: `tests/Browser/BulkActions/StickyHeaderTest.php`

```php
// FR-027, FR-029
it('header remains fixed when scrolling down', function () {
    $this->browse(function ($browser) {
        $browser->visit('/staff/suppliers')
            ->assertPresent('@table-header')
            ->scrollTo('@table-row-25')
            ->assertVisible('@table-header');
    });
});

it('select all checkbox accessible while scrolling', function () {
    $this->browse(function ($browser) {
        $browser->visit('/staff/suppliers')
            ->scrollTo('@table-row-25')
            ->click('@select-all-checkbox')
            ->assertSee('All 25 selected');
    });
});

it('sticky header consistent across all tables', function () {
    $this->browse(function ($browser) {
        $browser->visit('/staff/suppliers')
            ->assertPresent('@table-header.sticky')
            ->visit('/staff/packages')
            ->assertPresent('@table-header.sticky');
    });
});
```

### User Story 12: Sticky Key Columns (P3)
**Location**: `tests/Browser/BulkActions/StickyColumnsTest.php`

```php
// FR-028, FR-029
it('first column remains fixed on horizontal scroll', function () {
    $this->browse(function ($browser) {
        $browser->visit('/staff/suppliers')
            ->scrollRight(500)
            ->assertVisible('@column-name'); // First column still visible
    });
});

it('multiple sticky columns stack correctly', function () {
    $this->browse(function ($browser) {
        $browser->visit('/staff/suppliers')
            ->scrollRight(500)
            ->assertVisible('@column-checkbox')
            ->assertVisible('@column-name');
    });
});
```

### Cross-Page Selection Flow
**Location**: `tests/Browser/BulkActions/CrossPageSelectionTest.php`

```php
// FR-003a, FR-003b
it('shows Select all X items link when page fully selected', function () {
    $this->browse(function ($browser) {
        $browser->visit('/staff/suppliers')
            ->click('@select-all-checkbox')
            ->assertSee('Select all 847 items');
    });
});

it('clicking Select all includes cross-page items', function () {
    $this->browse(function ($browser) {
        $browser->visit('/staff/suppliers')
            ->click('@select-all-checkbox')
            ->click('@select-all-link')
            ->assertSee('847 selected');
    });
});

it('shows warning when cross-page exceeds 1000 limit', function () {
    // Create 1500+ items for test
    $this->browse(function ($browser) {
        $browser->visit('/staff/large-dataset')
            ->click('@select-all-checkbox')
            ->click('@select-all-link')
            ->assertSee('Limited to 1000 items');
    });
});
```

### Floating Bar Behavior
**Location**: `tests/Browser/BulkActions/FloatingBarTest.php`

```php
it('floating bar appears on first selection', function () {
    $this->browse(function ($browser) {
        $browser->visit('/staff/suppliers')
            ->assertMissing('@bulk-action-bar')
            ->click('@row-checkbox-1')
            ->assertPresent('@bulk-action-bar');
    });
});

it('floating bar has slide-up animation', function () {
    // Test CSS animation class
});

it('Clear button resets selection', function () {
    $this->browse(function ($browser) {
        $browser->visit('/staff/suppliers')
            ->click('@row-checkbox-1')
            ->click('@row-checkbox-2')
            ->assertSee('2 selected')
            ->click('@clear-selection-button')
            ->assertDontSee('selected');
    });
});

it('Dismiss (X) button closes bar and clears selection', function () {
    $this->browse(function ($browser) {
        $browser->visit('/staff/suppliers')
            ->click('@row-checkbox-1')
            ->click('@dismiss-button')
            ->assertMissing('@bulk-action-bar')
            ->assertNotChecked('@row-checkbox-1');
    });
});
```

---

## Test Data & Fixtures

### Factories Required

#### SupplierFactory (existing, extend)
```php
// Add tag states
->state('with-tags', function () {
    return [];
})->afterCreating(function (Supplier $supplier) {
    $supplier->attachTags(['Urgent', 'VIP']);
});

->state('with-urgent-tag', function () {
    return [];
})->afterCreating(function (Supplier $supplier) {
    $supplier->attachTag('Urgent');
});
```

#### TagFactory (if not exists)
```php
Tag::factory()->state([
    'name' => 'Urgent',
    'type' => 'supplier',
    'colour' => 'red',
    'icon' => 'heroicons:exclamation-circle',
]);
```

#### BulkActionUndoFactory (new)
```php
BulkActionUndo::factory()->definition([
    'token' => fn () => Str::uuid(),
    'action_type' => 'add_tags',
    'payload' => [],
    'expires_at' => fn () => now()->addSeconds(10),
    'used_at' => null,
]);

->state('expired', ['expires_at' => now()->subMinute()]);
->state('used', ['used_at' => now()]);
```

### Seeders

#### BulkActionsTestSeeder
```php
// Create test data for browser tests
- 50 suppliers (10 with Urgent tag, 5 with VIP tag, 3 with both)
- 5 tags of type 'supplier'
- User with bulk action permissions
```

---

## Test Execution Strategy

### Phase 1: Foundation (Selection, Highlighting, Shift+Click)

**Unit Tests**:
```bash
php artisan test tests/Unit/BulkActions/SelectionStateTest.php
php artisan test tests/Unit/BulkActions/ShiftClickSelectionTest.php
```

**Browser Tests**:
```bash
php artisan dusk tests/Browser/BulkActions/SelectionVisibilityTest.php
php artisan dusk tests/Browser/BulkActions/ShiftClickSelectionTest.php
php artisan dusk tests/Browser/BulkActions/RowHighlightingTest.php
php artisan dusk tests/Browser/BulkActions/KeyboardShortcutsTest.php
```

**Expected Coverage**:
- FR-001 through FR-003b ✓
- FR-021 through FR-026 ✓
- SC-001 ✓

### Phase 2: Floating Bar & Dropdown

**Unit Tests**:
```bash
php artisan test tests/Unit/BulkActions/ActionCategoryTest.php
php artisan test tests/Unit/BulkActions/ActionExtensionsTest.php
```

**Browser Tests**:
```bash
php artisan dusk tests/Browser/BulkActions/FloatingBarTest.php
php artisan dusk tests/Browser/BulkActions/DropdownGroupingTest.php
php artisan dusk tests/Browser/BulkActions/ActionConfirmationTest.php
php artisan dusk tests/Browser/BulkActions/CrossPageSelectionTest.php
```

**Expected Coverage**:
- FR-004 through FR-008 ✓
- FR-015 through FR-017 ✓
- SC-002, SC-003, SC-005 ✓

### Phase 3: Tag Management

**Unit Tests**:
```bash
php artisan test tests/Unit/BulkActions/BulkAddTagsActionTest.php
php artisan test tests/Unit/BulkActions/BulkRemoveTagsActionTest.php
php artisan test tests/Unit/BulkActions/GetTagsForSelectionActionTest.php
```

**Feature Tests**:
```bash
php artisan test tests/Feature/BulkActions/BulkTagApiTest.php
php artisan test tests/Feature/BulkActions/GetTagsOnSelectionApiTest.php
php artisan test tests/Feature/BulkActions/GetTagsApiTest.php
php artisan test tests/Feature/BulkActions/TagFilterTest.php
```

**Browser Tests**:
```bash
php artisan dusk tests/Browser/BulkActions/BulkTagManagementTest.php
php artisan dusk tests/Browser/BulkActions/TagFilteringTest.php
```

**Expected Coverage**:
- FR-009 through FR-014 ✓
- FR-019, FR-020 ✓
- SC-006, SC-007 ✓

### Phase 4: Sticky Table Features

**Browser Tests**:
```bash
php artisan dusk tests/Browser/BulkActions/StickyHeaderTest.php
php artisan dusk tests/Browser/BulkActions/StickyColumnsTest.php
```

**Expected Coverage**:
- FR-027 through FR-029 ✓

### Phase 5: Undo & Polish

**Unit Tests**:
```bash
php artisan test tests/Unit/BulkActions/UndoBulkActionActionTest.php
php artisan test tests/Unit/BulkActions/Models/BulkActionUndoTest.php
```

**Feature Tests**:
```bash
php artisan test tests/Feature/BulkActions/BulkActionUndoApiTest.php
```

**Browser Tests**:
```bash
php artisan dusk tests/Browser/BulkActions/UndoCapabilityTest.php
php artisan dusk tests/Browser/BulkActions/QuickAccessActionsTest.php
```

**Expected Coverage**:
- FR-018 ✓
- SC-004 ✓

### Full Test Suite

```bash
# All unit tests
php artisan test tests/Unit/BulkActions --parallel

# All feature tests
php artisan test tests/Feature/BulkActions --parallel

# All browser tests
php artisan dusk tests/Browser/BulkActions

# Coverage report
php artisan test tests/Unit/BulkActions tests/Feature/BulkActions --coverage
```

---

## Coverage Targets

| Test Type | Target | Verification Command |
|-----------|--------|---------------------|
| Unit Tests | ≥80% business logic | `php artisan test tests/Unit/BulkActions --coverage` |
| Feature Tests | 100% API endpoints (4 endpoints) | `php artisan test tests/Feature/BulkActions` |
| Browser Tests | 12/12 user stories | `php artisan dusk tests/Browser/BulkActions` |
| Success Criteria | 7/7 measurable outcomes | Individual SC tests |

---

## Test Execution Matrix

| Phase | Unit | Feature | Browser | FR Coverage | SC Coverage |
|-------|------|---------|---------|-------------|-------------|
| 1: Foundation | 2 files | 0 files | 4 files | FR-001 to FR-003b, FR-021 to FR-026 | SC-001 |
| 2: Floating Bar | 2 files | 2 files | 4 files | FR-004 to FR-008, FR-015 to FR-017 | SC-002, SC-003, SC-005 |
| 3: Tags | 3 files | 4 files | 2 files | FR-009 to FR-014, FR-019 to FR-020 | SC-006, SC-007 |
| 4: Sticky | 0 files | 0 files | 2 files | FR-027 to FR-029 | - |
| 5: Undo | 2 files | 1 file | 2 files | FR-018 | SC-004 |
| **Total** | **9 files** | **7 files** | **14 files** | **29/29 FR** | **7/7 SC** |

---

## Success Criteria Verification

| SC | Description | Test File | Assertion |
|----|-------------|-----------|-----------|
| SC-001 | Selection count visible in <1s | `SelectionVisibilityTest` | `assertSeeWithin(1000, 'selected')` |
| SC-002 | Bulk action in ≤3 clicks | `ActionConfirmationTest` | Click count assertion |
| SC-003 | 100% destructive require confirm | `ActionConfirmationTest` | All delete/archive trigger dialog |
| SC-004 | Undo available ≥10s | `UndoCapabilityTest` | `pause(9000)->assertPresent('@undo')` |
| SC-005 | Dropdown opens <200ms | `DropdownGroupingTest` | Performance timing assertion |
| SC-006 | Bulk-add 100 items <5s | `BulkTagManagementTest` | `assertTimeUnder(5000)` |
| SC-007 | Tag filter <1s (10k rows) | `TagFilteringTest` | `assertTimeUnder(1000)` |

---

## Test File Checklist

### Unit Tests (9 files)
- [ ] `tests/Unit/BulkActions/BulkAddTagsActionTest.php`
- [ ] `tests/Unit/BulkActions/BulkRemoveTagsActionTest.php`
- [ ] `tests/Unit/BulkActions/GetTagsForSelectionActionTest.php`
- [ ] `tests/Unit/BulkActions/UndoBulkActionActionTest.php`
- [ ] `tests/Unit/BulkActions/Models/BulkActionUndoTest.php`
- [ ] `tests/Unit/BulkActions/SelectionStateTest.php`
- [ ] `tests/Unit/BulkActions/ShiftClickSelectionTest.php`
- [ ] `tests/Unit/BulkActions/ActionCategoryTest.php`
- [ ] `tests/Unit/BulkActions/ActionExtensionsTest.php`

### Feature Tests (7 files)
- [ ] `tests/Feature/BulkActions/BulkTagApiTest.php`
- [ ] `tests/Feature/BulkActions/GetTagsOnSelectionApiTest.php`
- [ ] `tests/Feature/BulkActions/GetTagsApiTest.php`
- [ ] `tests/Feature/BulkActions/BulkActionUndoApiTest.php`
- [ ] `tests/Feature/BulkActions/TagFilterTest.php`
- [ ] `tests/Feature/BulkActions/CrossPageSelectionTest.php`
- [ ] `tests/Feature/BulkActions/ActionConfirmationTest.php`

### Browser Tests (14 files)
- [ ] `tests/Browser/BulkActions/SelectionVisibilityTest.php`
- [ ] `tests/Browser/BulkActions/DropdownGroupingTest.php`
- [ ] `tests/Browser/BulkActions/BulkTagManagementTest.php`
- [ ] `tests/Browser/BulkActions/ActionConfirmationTest.php`
- [ ] `tests/Browser/BulkActions/QuickAccessActionsTest.php`
- [ ] `tests/Browser/BulkActions/UndoCapabilityTest.php`
- [ ] `tests/Browser/BulkActions/TagFilteringTest.php`
- [ ] `tests/Browser/BulkActions/ShiftClickSelectionTest.php`
- [ ] `tests/Browser/BulkActions/RowHighlightingTest.php`
- [ ] `tests/Browser/BulkActions/KeyboardShortcutsTest.php`
- [ ] `tests/Browser/BulkActions/StickyHeaderTest.php`
- [ ] `tests/Browser/BulkActions/StickyColumnsTest.php`
- [ ] `tests/Browser/BulkActions/CrossPageSelectionTest.php`
- [ ] `tests/Browser/BulkActions/FloatingBarTest.php`

---

## Performance Benchmarks

| Metric | Target | Test Location |
|--------|--------|---------------|
| Selection count display | <1 second | `SelectionVisibilityTest` |
| Dropdown open time | <200ms | `DropdownGroupingTest` |
| Bulk-add 100 items | <5 seconds | `BulkTagManagementTest` |
| Tag filter (10k rows) | <1 second | `TagFilteringTest` |
| Undo availability | ≥10 seconds | `UndoCapabilityTest` |

---

## QA Gate Checklist

**Gate 5: QA Gate** — "Does it actually work?"

This checklist must pass before the feature proceeds to Product Review.

### Prerequisites

| Artifact | Required | Status |
|----------|----------|--------|
| Code Quality Gate (Gate 4) passed | Yes | [ ] |
| Feature deployed to staging | Yes | [ ] |
| Test data available | Recommended | [ ] |

---

### 1. Functional Validation

| Check | Pass Criteria | Status |
|-------|---------------|--------|
| Feature works as described | Bulk actions match spec.md description | [ ] |
| All acceptance criteria met | 12 user stories verified | [ ] |
| UI matches approved design | Visual comparison to design.md/mockups | [ ] |
| Field validation works | All inputs validated, error states shown | [ ] |
| Success messages display | Confirmation feedback for all actions | [ ] |
| Error states handled | Graceful error handling, helpful messages | [ ] |

---

### 2. Regression & Integration

| Check | Pass Criteria | Status |
|-------|---------------|--------|
| Regression check passed | Existing table functionality unaffected | [ ] |
| Link integrity confirmed | All navigation links work correctly | [ ] |
| Data integrity maintained | No data corruption during bulk operations | [ ] |

---

### 3. Cross-Browser & Device Testing

| Check | Pass Criteria | Status |
|-------|---------------|--------|
| Chrome tested | Desktop + mobile | [ ] |
| Safari tested | Desktop + mobile | [ ] |
| Firefox tested | Desktop + mobile | [ ] |
| Responsive on top 3 screen sizes | Desktop (1920), Tablet (768), Mobile (375) | [ ] |

---

### 4. Quality & Performance

| Check | Pass Criteria | Status |
|-------|---------------|--------|
| Accessibility check | WCAG 2.1 AA basic pass, keyboard navigation | [ ] |
| Performance acceptable | Selection <1s, dropdown <200ms, bulk tags <5s | [ ] |
| No console warnings or 404s | Browser console clean | [ ] |

---

### 5. Success Criteria Verification

| SC | Description | Target | Status |
|----|-------------|--------|--------|
| SC-001 | Selection count visible | <1 second | [ ] |
| SC-002 | Bulk action clicks | ≤3 clicks | [ ] |
| SC-003 | Destructive confirmation | 100% | [ ] |
| SC-004 | Undo availability | ≥10 seconds | [ ] |
| SC-005 | Dropdown open time | <200ms | [ ] |
| SC-006 | Bulk-add 100 items | <5 seconds | [ ] |
| SC-007 | Tag filter (10k rows) | <1 second | [ ] |

---

### 6. Issue Management

| Check | Pass Criteria | Status |
|-------|---------------|--------|
| No open Severity 1-3 issues | Critical/major bugs resolved | [ ] |
| Minor issues documented | Known issues accepted by Product Owner | [ ] |

**Severity Definitions:**

| Severity | Description | Gate Impact |
|----------|-------------|-------------|
| Sev 1 - Critical | Feature unusable, data loss, security issue | BLOCKS gate |
| Sev 2 - Major | Core functionality broken, no workaround | BLOCKS gate |
| Sev 3 - Moderate | Functionality impaired, workaround exists | BLOCKS gate |
| Sev 4 - Minor | Cosmetic, minor UX issue | Document & proceed |
| Sev 5 - Trivial | Edge case, future enhancement | Document & proceed |

---

### 7. QA Sign-off

| Check | Pass Criteria | Status |
|-------|---------------|--------|
| QA Tester confirms | Ticket is stable and ready for Product Review | [ ] |

---

### Issues Found

| # | Description | Severity | Status |
|---|-------------|----------|--------|
| 1 | *None yet* | - | - |

---

### Gate Result

**QA Gate Status:** PENDING

- [ ] All functional checks passed
- [ ] All regression checks passed
- [ ] Cross-browser testing complete
- [ ] Performance targets met
- [ ] No blocking issues
- [ ] QA sign-off received

**Ready for Product Review:** NO

---

### Gate Actions

**On Pass:**
- Move ticket to "Ready for Product Review"
- Add "QA Approved" label
- Tag Product Owner for review
- Proceed to Release Gate

**On Fail:**
- List failed checks with specific issues
- Create bug tickets for Sev 1-3 issues
- Return to developer for fixes
- Re-run gate after fixes

---

## Context Updated

✓ Added to context/CONTEXT.md - Test plan generation session recorded
✓ Added QA Gate checklist for Gate 5 compliance
