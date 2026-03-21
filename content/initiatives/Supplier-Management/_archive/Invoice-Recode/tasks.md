---
title: "Tasks"
---


**Epic**: TP-3300-REC
**Plan**: [plan.md](plan.md)
**Created**: 2025-12-15
**Phase Focus**: Phase 1 - Core Bulk Recode Engine

---

## Task Breakdown

### Phase 1: Core Bulk Recode Engine (2-3 sprints)

Total estimated effort: **5-6 weeks** (1-1.5 developer sprints for 1 full-time engineer)

---

## Database & Data Model Tasks

### TASK 1: Create RecodeRule Migration & Model
**Status**: Pending
**Effort**: 3 points
**Dependencies**: None
**Description**: Create database migration for `recode_rules` table with RecodeRule Eloquent model.

**Acceptance Criteria**:
- [ ] Migration creates `recode_rules` table with all required columns:
  - `id` (PK), `name`, `description`, `rule_type` (enum), `condition_data` (JSON), `target_service_type_id`, `is_active`, `created_by`, `created_at`, `updated_at`
- [ ] RecodeRule model with relationships:
  - `belongsTo(ServiceType, 'target_service_type_id')`
  - `belongsTo(User, 'created_by')`
  - `hasMany(RecodeAction, 'rule_id')`
- [ ] Model includes rule type constants (DESCRIPTION_PATTERN, AMOUNT_RANGE, CATEGORY)
- [ ] Migration includes indexes on `is_active`, `rule_type`, `target_service_type_id`
- [ ] Model includes helper method: `matchesItem(BillItem $item): bool`

**Implementation Notes**:
- Use Laravel migration naming: `YYYY_MM_DD_create_recode_rules_table.php`
- Rule type should be Laravel enum or string (VARCHAR)
- condition_data stores JSON: `{ pattern: "...", min_amount: X, max_amount: Y, category_ids: [...] }`

---

### TASK 2: Create RecodeAction Migration & Model
**Status**: Pending
**Effort**: 3 points
**Dependencies**: TASK 1 (needs RecodeRule model)
**Description**: Create database migration for `recode_actions` table (activity log) with RecodeAction model.

**Acceptance Criteria**:
- [ ] Migration creates `recode_actions` table with columns:
  - `id` (PK), `user_id` (FK), `item_ids` (JSON array), `old_service_type_id`, `new_service_type_id`, `rule_id` (nullable FK), `status` (enum: success, rollback), `failed_items` (JSON nullable), `created_at`
- [ ] RecodeAction model with relationships:
  - `belongsTo(User)`
  - `belongsTo(ServiceType, 'old_service_type_id')`
  - `belongsTo(ServiceType, 'new_service_type_id')`
  - `belongsTo(RecodeRule, 'rule_id')` (nullable)
- [ ] Model casts:
  - `item_ids` as array
  - `failed_items` as array
  - `created_at` as datetime
- [ ] Accessors:
  - `getCountAttribute()` - returns count of items recoded
  - `getFailedCountAttribute()` - returns count of failed items (if applicable)
- [ ] Migration includes indexes on `user_id`, `rule_id`, `created_at` for querying activity log

---

### TASK 3: Create RecodeRule Factory & Seeder
**Status**: Pending
**Effort**: 3 points
**Dependencies**: TASK 1
**Description**: Create factory for testing and seeder for pre-built rules.

**Acceptance Criteria**:
- [ ] RecodeRuleFactory generates realistic test rules:
  - Name, description, rule_type, condition_data, target_service_type_id, is_active, created_by
  - Supports states: `active()`, `description_pattern()`, `amount_range()`, `category_based()`
- [ ] DatabaseSeeder includes RecodeRuleSeeder that creates 8-10 pre-built rules:
  - "Physio descriptions → Allied Health" (description pattern)
  - "Items > $200 → Review" (amount range)
  - "Unmatched supplier → Other" (category based)
  - "Personal Care items → Respite Care" (description pattern)
  - Plus 4-6 more common patterns (to be defined by Finance team)
- [ ] Seeder makes rules `is_active = true` by default
- [ ] Seeder is idempotent (safe to run multiple times)
- [ ] Seeder runs as part of standard `php artisan db:seed`

**Implementation Notes**:
- Seeder will need ServiceType IDs; use `ServiceType::where('name', 'Allied Health')->first()?->id`
- Condition data varies by rule type; include examples in factory

---

### TASK 4: Verify BillItem Model & Relationships
**Status**: Pending
**Effort**: 1 point
**Dependencies**: None
**Description**: Verify BillItem model has all required relationships and attributes.

**Acceptance Criteria**:
- [ ] BillItem model has:
  - `belongsTo(Invoice)`
  - `belongsTo(ServiceType, 'service_type_id')` (current category)
  - `belongsTo(Supplier, 'supplier_id')`
- [ ] BillItem attributes verified:
  - `id`, `invoice_id`, `description`, `amount`, `service_type_id`, `service_date`, `supplier_id`, `created_at`, `updated_at`
- [ ] BillItem relationships are eager-loadable (no N+1 queries when loading related records)

---

## Backend Controller & Action Tasks

### TASK 5: Create RecodeController Scaffold
**Status**: Pending
**Effort**: 2 points
**Dependencies**: TASK 1, TASK 2
**Description**: Create RecodeController with 5 endpoints and basic structure.

**Acceptance Criteria**:
- [ ] Controller created at `app/Http/Controllers/RecodeController.php`
- [ ] Methods defined (empty implementations for now):
  - `index()` - GET /recode (load page)
  - `items()` - POST /recode/items (load more items with filtering/sorting)
  - `applyRule()` - POST /recode/apply-rule (query matching items for rule)
  - `bulkRecode()` - POST /recode/bulk-recode (execute bulk recoding)
  - `rulesSearch()` - POST /recode/rules/search (search rules browser)
- [ ] Routes registered in `routes/web.php`:
  - `Route::get('/recode', [RecodeController::class, 'index'])->name('recode.index');`
  - `Route::post('/recode/items', [RecodeController::class, 'items'])->name('recode.items');`
  - `Route::post('/recode/apply-rule', [RecodeController::class, 'applyRule'])->name('recode.apply-rule');`
  - `Route::post('/recode/bulk-recode', [RecodeController::class, 'bulkRecode'])->name('recode.bulk-recode');`
  - `Route::post('/recode/rules/search', [RecodeController::class, 'rulesSearch'])->name('recode.rules-search');`
- [ ] All routes protected with authentication middleware (`auth`)
- [ ] Controller includes PHPDoc blocks for each method

---

### TASK 6: Implement RecodeController@index (Load Page)
**Status**: Pending
**Effort**: 3 points
**Dependencies**: TASK 5, TASK 3
**Description**: Implement page load endpoint that returns initial data: paginated line items + common rules.

**Acceptance Criteria**:
- [ ] Endpoint returns Inertia response: `Inertia::render('Recode/Index', [...])`
- [ ] Props returned:
  - `lineItems`: BillItem paginated collection (50-100 per page), ordered by `created_at DESC`
  - `commonRules`: Top 8-10 most-used RecodeRules (ordered by `updated_at DESC` or usage count if tracked)
  - `allRulesCount`: Total count of active rules (for "View all" button)
  - `filters`: Empty filter object or from request
  - `sortBy`: Default sort order (e.g., 'created_at:desc')
- [ ] Line items eager-load relationships: `with('invoice', 'serviceType', 'supplier')`
- [ ] Response includes proper pagination meta (current_page, per_page, total, has_more)
- [ ] Query optimized: No N+1 queries
- [ ] Returns HTTP 200 on success

**Implementation Notes**:
- Use `BillItem::query()->with(...)->paginate(50)`
- "Most-used" rules can be: `RecodeRule::where('is_active', true)->orderByDesc('updated_at')->limit(10)`
- Phase 2 can enhance to track rule usage frequency

---

### TASK 7: Implement RecodeController@items (Load More Items)
**Status**: Pending
**Effort**: 4 points
**Dependencies**: TASK 5
**Description**: Implement endpoint for loading additional line items with filtering and sorting.

**Acceptance Criteria**:
- [ ] Endpoint accepts POST request with:
  - `page`: int (page number for pagination)
  - `filters`: object with optional fields:
    - `invoice_id`: string (exact match)
    - `date_range`: array [start_date, end_date]
    - `description`: string (LIKE search)
    - `amount_range`: array [min, max]
    - `category_id`: int (current service_type_id)
  - `sort_by`: string ('invoice_id', 'date', 'amount', 'category')
  - `sort_direction`: string ('asc', 'desc')
- [ ] Returns paginated BillItem collection (50-100 per page) with matching filters
- [ ] Query builder implements all filters with proper WHERE clauses
- [ ] Response includes:
  - `lineItems`: paginated collection
  - `page`: current page number
  - `has_more`: boolean (true if more pages available)
- [ ] Query is optimized: No N+1 queries, proper indexes used
- [ ] Invalid filter values handled gracefully (return 422 or sanitize)

**Implementation Notes**:
- Use query scopes or local methods for each filter type
- Date range filter: `whereBetween('service_date', [$start, $end])`
- Description search: `where('description', 'LIKE', "%$search%")`
- Amount range: `whereBetween('amount', [$min, $max])`
- Sorting: Use `orderBy()` with proper column names

---

### TASK 8: Implement RecodeController@applyRule (Auto-Select Matching Items)
**Status**: Pending
**Effort**: 4 points
**Dependencies**: TASK 5, TASK 1
**Description**: Implement endpoint that applies a RecodeRule and returns matching item IDs.

**Acceptance Criteria**:
- [ ] Endpoint accepts POST request with:
  - `rule_id`: int (RecodeRule ID)
  - `filters`: object (current filter state to scope the search)
- [ ] Logic:
  - Load RecodeRule by ID (or return 404 if not found)
  - Query BillItem using rule's condition_data to find matches
  - Apply current filters to scope search (intersection of rule matches + filter criteria)
  - Return matched item IDs
- [ ] Response includes:
  - `matched_item_ids`: array of BillItem IDs
  - `count`: count of matched items
  - `message`: "Matched X items for [Rule Name]"
- [ ] If no items match, return:
  - `matched_item_ids`: []
  - `count`: 0
  - `message`: "No items matched this rule. (Searched X invoices)"
- [ ] Query is optimized: Use proper indexes on description, amount, category

**Implementation Notes**:
- Condition data structure:
  - `{ type: 'description_pattern', pattern: 'Physio' }`
  - `{ type: 'amount_range', min: 100, max: 500 }`
  - `{ type: 'category', category_ids: [1, 2] }`
- Implement rule matching logic in RecodeRule model as method: `getMatchingItems(array $filters = []): Collection`
- Use regex or LIKE for pattern matching on description

---

### TASK 9: Implement RecodeController@rulesSearch (Rules Browser)
**Status**: Pending
**Effort**: 3 points
**Dependencies**: TASK 5, TASK 1
**Description**: Implement endpoint for searching and browsing all available rules.

**Acceptance Criteria**:
- [ ] Endpoint accepts POST request with:
  - `search`: string (optional search term for rule name/description)
  - `page`: int (pagination, 10 rules per page)
- [ ] Returns paginated RecodeRule collection:
  - Filters by `is_active = true` by default
  - If search term provided, filters by name or description (LIKE search)
  - Ordered by `updated_at DESC` (most recently updated first)
- [ ] Response includes:
  - `rules`: paginated collection
  - `total`: total count of rules matching search
  - `per_page`: items per page
  - `current_page`: current page number
- [ ] Empty search returns all active rules (paginated)
- [ ] Search term with no matches returns:
  - `rules`: []
  - `total`: 0
  - Message: "No rules match your search"

---

### TASK 10: Create BulkRecodeAction Service Class
**Status**: Pending
**Effort**: 5 points
**Dependencies**: TASK 2, TASK 4
**Description**: Create service class that handles atomic bulk recoding logic: validation, transaction, rollback, logging.

**Acceptance Criteria**:
- [ ] Service class created at `app/Actions/BulkRecodeAction.php`
- [ ] Method: `execute(User $user, array $itemIds, int $newServiceTypeId, ?int $ruleId = null): RecodeAction`
- [ ] Executes within database transaction:
  ```
  DB::transaction(function () {
    // 1. Validate items exist
    // 2. Check for deletions
    // 3. Prevent same-category
    // 4. Lock items for update (pessimistic locking)
    // 5. Update all items atomically
    // 6. Create RecodeAction entry
  })
  ```
- [ ] Validation logic:
  - [ ] Verify all item IDs exist in database (throw ItemNotFoundException if any missing)
  - [ ] Verify all items have different current service_type_id than target (throw SameCategoryException if attempting same category)
  - [ ] Verify target ServiceType exists and is active (throw InvalidServiceTypeException if not)
- [ ] Transaction steps:
  - [ ] Load BillItems using `lockForUpdate()` to prevent race conditions
  - [ ] Remove items that were deleted after selection (warn in response)
  - [ ] Update all remaining items: `BillItem::whereIn('id', $validIds)->update(['service_type_id' => $newServiceTypeId])`
  - [ ] Create RecodeAction entry with:
    - `user_id`, `item_ids` (original requested), `old_service_type_id`, `new_service_type_id`, `rule_id`, `status: 'success'`
- [ ] Error handling:
  - [ ] If ANY exception during transaction, catch it, rollback automatically
  - [ ] Create RecodeAction entry with `status: 'rollback'` and `failed_items` array
  - [ ] Return appropriate error response
- [ ] Returns RecodeAction object (success or rollback)

**Implementation Notes**:
- Use Laravel's `DB::transaction()` with automatic rollback on exception
- Pessimistic locking: `BillItem::whereIn('id', $itemIds)->lockForUpdate()->get()`
- Throw custom exceptions for validation failures (create in `app/Exceptions/`)
- Log recoding action via LogsActivity trait if available, or manually create audit entry

---

### TASK 11: Implement RecodeController@bulkRecode (Execute Bulk Recode)
**Status**: Pending
**Effort**: 3 points
**Dependencies**: TASK 5, TASK 10
**Description**: Implement endpoint that calls BulkRecodeAction and returns success or error response.

**Acceptance Criteria**:
- [ ] Endpoint accepts POST request with:
  - `item_ids`: array of BillItem IDs to recode
  - `new_service_type_id`: int (target ServiceType)
  - `rule_id`: int (optional, for audit trail)
- [ ] Calls BulkRecodeAction::execute() with parameters
- [ ] Success response (HTTP 200):
  ```json
  {
    "success": true,
    "action_id": 123,
    "recoded_count": 12,
    "message": "Successfully recoded 12 items from Personal Care → Allied Health"
  }
  ```
- [ ] Error/Rollback response (HTTP 422):
  ```json
  {
    "success": false,
    "failed_items": [
      { "id": 789, "error": "Item deleted after selection" },
      { "id": 1011, "error": "Database constraint violation" }
    ],
    "message": "Recoding failed and rolled back. 2 items prevented the operation."
  }
  ```
- [ ] Handles all exception types from BulkRecodeAction
- [ ] Returns appropriate HTTP status codes

---

## Frontend Vue Component Tasks

### TASK 12: Create RecodeToolPage Vue Component
**Status**: Pending
**Effort**: 5 points
**Dependencies**: TASK 5, TASK 6
**Description**: Create main Vue page component with layout structure and state management.

**Acceptance Criteria**:
- [ ] Component created at `resources/js/Pages/Recode/Index.vue`
- [ ] Template structure includes:
  - Fixed left sidebar (300px) for CommonRulesList
  - Always-visible filter bar at top (60-80px height)
  - Main content area with table and pagination
  - Activity log collapsible panel (right sidebar or bottom expandable)
- [ ] Data/State:
  - `lineItems`: from props, paginated collection
  - `commonRules`: from props
  - `selectedItems`: Set<int> (tracked IDs of selected items)
  - `filters`: object with current filter values
  - `isLoading`: boolean (for loading states)
  - `currentPage`: int (pagination)
  - `sortBy`: string, `sortDirection`: string
- [ ] Props: `lineItems`, `commonRules`, `allRulesCount`, `filters`, `sortBy`
- [ ] Emit events for child components:
  - `@rule-clicked="applyRule"`
  - `@item-selected="toggleItemSelection"`
  - `@filter-changed="applyFilters"`
  - `@sort-changed="applySortOrder"`
- [ ] Computed properties:
  - `selectedCount`: count of selected items
  - `isRecodeButtonEnabled`: `selectedCount > 0`
  - `isAnyItemSelected`: `selectedCount > 0` (for toolbar visibility)
- [ ] Mounted hook loads initial data (already provided via props)
- [ ] Uses Inertia `usePage()` to access props

---

### TASK 13: Create CommonRulesList Sidebar Component
**Status**: Pending
**Effort**: 4 points
**Dependencies**: TASK 12
**Description**: Create sidebar component displaying 8-10 common rules with drag-drop reordering.

**Acceptance Criteria**:
- [ ] Component created at `resources/js/Components/Recode/CommonRulesList.vue`
- [ ] Props:
  - `rules`: array of RecodeRule objects (8-10 items)
  - `allRulesCount`: int (for "View all" button)
- [ ] Emits:
  - `@rule-clicked`: when user clicks a rule button
  - `@rules-reordered`: when user drags/reorders rules
- [ ] Features:
  - [ ] Display 8-10 rule buttons with name and description
  - [ ] Each rule button shows: name, target category icon/label
  - [ ] Hover state shows: "Click to apply" tooltip
  - [ ] Click rule → emit `@rule-clicked` with rule_id
  - [ ] Drag-drop reordering: Use draggable library (e.g., `vue-draggable-next`)
  - [ ] After reorder, emit `@rules-reordered` with new order (save to localStorage or backend)
  - [ ] Collapsible help tooltip explaining rules (first-time UX)
  - [ ] "View all rules" button → open RulesBrowser modal
- [ ] Styling:
  - [ ] Sidebar width: 300px (fixed)
  - [ ] Rule buttons: full width, 44px height (touch-friendly)
  - [ ] Spacing: 8px gap between buttons
  - [ ] Active rule (just clicked): highlight background
- [ ] Accessibility:
  - [ ] Each rule button: `role="button"`, `tabindex="0"`, `@keydown.enter="onClick"`
  - [ ] Proper focus indicators (4px brand color outline)
  - [ ] Screen reader announcement: "Physio to Allied Health rule, X items matched, button"

---

### TASK 14: Create RulesBrowser Modal Component
**Status**: Pending
**Effort**: 3 points
**Dependencies**: TASK 12
**Description**: Create modal for searching and viewing all 50+ rules.

**Acceptance Criteria**:
- [ ] Component created at `resources/js/Components/Recode/RulesBrowser.vue`
- [ ] Props:
  - `isOpen`: boolean (control visibility)
  - `allRulesCount`: int
- [ ] Emits:
  - `@rule-selected`: when user clicks a rule to apply
  - `@close`: when user closes modal
- [ ] Features:
  - [ ] Search input field: filter rules by name/description in real-time
  - [ ] Paginated list of rules (10 per page)
  - [ ] Click rule → emit `@rule-selected` with rule_id, close modal
  - [ ] Search with no results: show "No rules match your search"
  - [ ] Modal header: "Browse All Rules (X available)"
  - [ ] Close button (X icon) and outside click to close
- [ ] Styling:
  - [ ] Modal: 90% width on tablet, 600px max-width on desktop
  - [ ] Search input at top, list below, pagination at bottom
- [ ] Accessibility:
  - [ ] Focus trapped within modal (tab cycles through elements)
  - [ ] Escape key closes modal
  - [ ] Screen reader: announces "Modal dialog: Browse all rules"

---

### TASK 15: Create FilterBar Component (Always Visible)
**Status**: Pending
**Effort**: 4 points
**Dependencies**: TASK 12
**Description**: Create always-visible top filter bar with Invoice ID, Date Range, Description, Amount Range, Category filters.

**Acceptance Criteria**:
- [ ] Component created at `resources/js/Components/Recode/FilterBar.vue`
- [ ] Props:
  - `currentFilters`: object with current filter values
  - `categories`: array of available ServiceType/ServiceCategory options
- [ ] Emits:
  - `@filters-changed`: when any filter value changes (debounced)
- [ ] Features:
  - [ ] Filter inputs:
    - [ ] Invoice ID: text input (exact match)
    - [ ] Date Range: dual date picker (start, end)
    - [ ] Description: text input (search, debounced)
    - [ ] Amount Range: dual number inputs (min, max)
    - [ ] Category: dropdown/select (multi-select or single)
  - [ ] "Clear Filters" button (resets all to defaults)
  - [ ] "Apply Filters" button (triggers @filters-changed)
  - [ ] Shows active filter count: "3 filters active"
- [ ] Styling:
  - [ ] Always visible at top (position: sticky)
  - [ ] Height: 60-80px (flexbox, comfortable spacing)
  - [ ] Responsive: On tablet, some inputs stack vertically or collapse to icon
  - [ ] Light background with subtle border/shadow
- [ ] Accessibility:
  - [ ] All inputs labeled with `<label for="...">` or `aria-label`
  - [ ] Keyboard navigable (Tab through all inputs)
  - [ ] Date picker accessible (keyboard selectable)

---

### TASK 16: Create SelectionToolbar Component
**Status**: Pending
**Effort**: 2 points
**Dependencies**: TASK 12
**Description**: Create inline toolbar showing item count and action buttons.

**Acceptance Criteria**:
- [ ] Component created at `resources/js/Components/Recode/SelectionToolbar.vue`
- [ ] Props:
  - `selectedCount`: int (number of selected items)
  - `isVisible`: boolean (show/hide toolbar)
- [ ] Emits:
  - `@select-all`: when user clicks "Select All" button
  - `@deselect-all`: when user clicks "Deselect All" button
  - `@recode-selected`: when user clicks "Recode Selected" button
- [ ] Features:
  - [ ] Text: "X items selected" (dynamic count)
  - [ ] "Select All" button (only enabled if items available)
  - [ ] "Deselect All" button (only enabled if selectedCount > 0)
  - [ ] "Recode Selected →" button (only enabled if selectedCount > 0)
  - [ ] Toolbar only visible when selectedCount > 0 (slide in animation)
- [ ] Styling:
  - [ ] Inline toolbar, floats above table (sticky position or inline)
  - [ ] Background: light/subtle, border-top
  - [ ] Height: 44px (comfortable for touch)
  - [ ] Buttons left-aligned, text centered vertically
- [ ] Accessibility:
  - [ ] Buttons have proper `type="button"` and `aria-label`
  - [ ] Live region: announce selection count changes for screen readers

---

### TASK 17: Create RecodeConfirmationModal Component
**Status**: Pending
**Effort**: 5 points
**Dependencies**: TASK 12
**Description**: Create confirmation modal with preview table before bulk recoding.

**Acceptance Criteria**:
- [ ] Component created at `resources/js/Components/Recode/RecodeConfirmationModal.vue`
- [ ] Props:
  - `isOpen`: boolean
  - `selectedItems`: array of BillItem objects (with current serviceType)
  - `newServiceType`: ServiceType object (target category)
  - `oldServiceType`: ServiceType object (current category)
  - `isProcessing`: boolean (show loading state)
- [ ] Emits:
  - `@confirm`: when user clicks "Recode" button
  - `@cancel`: when user cancels
- [ ] Modal structure:
  - [ ] Header: "Recode X items from [Old Category] → [New Category]"
  - [ ] Preview table:
    - Columns: Item ID, Description, Amount, Current Category, New Category
    - Show first 5-10 items (scrollable if more)
    - Dimmed/struck-through if item was deleted (with warning)
  - [ ] Warnings section (if applicable):
    - Show items that were deleted after selection
    - "Warning: 2 items were deleted and will be skipped"
  - [ ] Footer buttons: "[Cancel]" and "[Recode →]"
  - [ ] Recode button has spinner when processing
- [ ] Features:
  - [ ] Modal centered on screen, 90% width on tablet, 800px max-width on desktop
  - [ ] Outside click or Escape key closes (if not processing)
  - [ ] Focus trapped during modal open
  - [ ] Escape key closes modal (when not processing)
- [ ] Styling:
  - [ ] Modal padding: 24px outer, 16px inner sections
  - [ ] Table header: bold, 14px
  - [ ] Table rows: 40px height minimum
  - [ ] Preview section: max-height 400px, scrollable
- [ ] Accessibility:
  - [ ] Modal announced: "Modal dialog: Recode X items"
  - [ ] Focus on Recode button initially
  - [ ] Buttons keyboard accessible (Tab, Enter)
  - [ ] Warning section: live region announcements

---

### TASK 18: Create ActivityLogPanel Component
**Status**: Pending
**Effort**: 3 points
**Dependencies**: TASK 12
**Description**: Create collapsible/expandable panel showing recent recoding activity.

**Acceptance Criteria**:
- [ ] Component created at `resources/js/Components/Recode/ActivityLogPanel.vue`
- [ ] Props:
  - `recentActions`: array of RecodeAction objects
  - `totalActions`: int (total count)
- [ ] Features:
  - [ ] Display as collapsible right sidebar or expandable bottom section
  - [ ] Collapsed state: shows icon/badge with action count
  - [ ] Expanded state shows:
    - Recent actions list (10 most recent)
    - Each action displays:
      - User name (from User relationship)
      - Action description: "12 items recoded from Personal Care → Allied Health"
      - Timestamp (relative: "2 minutes ago")
      - Status badge (✓ Success, ✗ Rollback)
  - [ ] "View More" button/link → show full activity history
  - [ ] Pagination for older actions
- [ ] Styling:
  - [ ] Panel width: 300px (if sidebar) or full-width section height: 200px (if bottom)
  - [ ] List items: 44px height
  - [ ] Status badge: Green (✓) for success, Red (✗) for rollback
  - [ ] Timestamps: gray text, smaller font
- [ ] Accessibility:
  - [ ] Toggle button: `aria-expanded` indicates open/closed state
  - [ ] Activity items: `role="listitem"` or similar
  - [ ] Timestamps announced with full date/time for screen readers

---

## Testing Tasks

### TASK 19: Write Unit Tests for BulkRecodeAction
**Status**: Pending
**Effort**: 4 points
**Dependencies**: TASK 10
**Description**: Write comprehensive unit tests for bulk recoding service class.

**Acceptance Criteria**:
- [ ] Test file created at `tests/Unit/Actions/BulkRecodeActionTest.php`
- [ ] Tests cover:
  - [ ] **Happy Path**: Successfully recode 12 items, verify RecodeAction created with status: success
  - [ ] **Same Category Error**: Attempt to recode to same category, verify exception thrown
  - [ ] **Item Deleted**: Item deleted after selection, verify removed from update, RecodeAction reflects
  - [ ] **Atomic Rollback**: Simulate database error mid-transaction, verify ALL rolled back
  - [ ] **Item Lock**: Verify pessimistic locking prevents race conditions
  - [ ] **Activity Log Entry**: Verify RecodeAction created with correct data
  - [ ] **Invalid ServiceType**: Target ServiceType doesn't exist, verify exception thrown
- [ ] Test uses factories for creating test data (RecodeRuleFactory, BillItemFactory, UserFactory)
- [ ] Tests are isolated (use database transactions that rollback after each test)
- [ ] Assertions verify:
  - Correct number of items updated
  - RecodeAction entry created
  - Old/new service types logged
  - Rule ID recorded (if applicable)

**Implementation Notes**:
- Use Pest syntax or PHPUnit
- Mock external dependencies if needed (logging, notifications)
- Test both success and failure paths

---

### TASK 20: Write Feature Tests for RecodeController
**Status**: Pending
**Effort**: 5 points
**Dependencies**: TASK 5, TASK 6, TASK 11
**Description**: Write integration tests for controller endpoints.

**Acceptance Criteria**:
- [ ] Test file created at `tests/Feature/RecodeControllerTest.php`
- [ ] Tests cover:
  - [ ] **index()**: GET /recode returns Inertia response with props
  - [ ] **items()**: POST /recode/items with filters/sorting returns paginated items
  - [ ] **applyRule()**: POST /recode/apply-rule returns matching item IDs
  - [ ] **applyRule() - No Matches**: Rule with no matching items returns empty array
  - [ ] **bulkRecode() - Success**: POST /recode/bulk-recode successfully recodes items
  - [ ] **bulkRecode() - Error**: Bulk recode with invalid data returns error
  - [ ] **Authentication**: Unauthenticated requests return 401/redirect
  - [ ] **Authorization**: Verify user permissions (if applicable)
- [ ] Tests verify:
  - Correct HTTP status codes (200, 422, 401)
  - Response structure matches API contract
  - Database state after request (items updated, action logged)
  - Error messages are clear
- [ ] Uses factory methods to create test data
- [ ] Tests verify end-to-end flows (not just controller logic)

---

### TASK 21: Write Frontend Component Tests (Pest/Dusk)
**Status**: Pending
**Effort**: 3 points
**Dependencies**: TASK 12-18
**Description**: Write tests for Vue component rendering and user interactions.

**Acceptance Criteria**:
- [ ] Test file created at `tests/Browser/RecodeToolTest.php` (or `tests/Feature/RecodeToolTest.php`)
- [ ] Tests cover:
  - [ ] Page loads with line items and common rules displayed
  - [ ] Clicking a rule auto-selects matching items
  - [ ] Clicking checkbox selects/deselects item
  - [ ] "Select All" selects all visible items
  - [ ] Filtering works (e.g., filter by date range reduces item count)
  - [ ] Sorting works (click Amount column, items sort by amount)
  - [ ] "Recode Selected" opens confirmation modal
  - [ ] Confirmation modal shows preview with selected items
  - [ ] Clicking "Recode" in modal submits and shows success toast
  - [ ] Activity log shows recent recoding actions
- [ ] Uses Pest or Laravel Dusk
- [ ] Tests verify:
  - DOM elements rendered correctly
  - User interactions work (click, type, select)
  - API calls made with correct parameters
  - Toast notifications appear
  - Modal opens/closes

---

## Integration & Deployment Tasks

### TASK 22: Database Migrations & Seeding
**Status**: Pending
**Effort**: 1 point
**Dependencies**: TASK 1, TASK 2, TASK 3
**Description**: Run database migrations and seed initial data.

**Acceptance Criteria**:
- [ ] Migrations run successfully: `php artisan migrate`
- [ ] Tables created: `recode_rules`, `recode_actions`
- [ ] Seeders run successfully: `php artisan db:seed`
- [ ] 8-10 pre-built rules exist in database
- [ ] No errors or warnings during migration/seeding
- [ ] Schema verified with `php artisan db:show --table=recode_rules`

---

### TASK 23: Code Review & Formatting
**Status**: Pending
**Effort**: 2 points
**Dependencies**: All tasks
**Description**: Run code formatting, linting, and peer review.

**Acceptance Criteria**:
- [ ] All PHP code formatted: `vendor/bin/pint --dirty` (passes without changes needed)
- [ ] All Vue components formatted: `npm run format` or similar linter
- [ ] No PHPStan errors: `vendor/bin/larastan analyse` (or similar)
- [ ] No eslint errors in Vue code: `npm run lint`
- [ ] Code review completed by Tim (Engineering Lead)
- [ ] All comments addressed and resolved

---

### TASK 24: End-to-End Testing & Documentation
**Status**: Pending
**Effort**: 2 points
**Dependencies**: All tasks
**Description**: Manual end-to-end testing and documentation updates.

**Acceptance Criteria**:
- [ ] Manual smoke tests pass:
  - [ ] Load page with 100 items: <1 second response
  - [ ] Apply rule with 50 matching items: display updates correctly
  - [ ] Bulk recode 12 items: atomic success or rollback, audit trail recorded
- [ ] Documentation updated:
  - [ ] README or internal wiki with setup instructions
  - [ ] API documentation for endpoints
  - [ ] Component documentation (props, emits)
- [ ] Browser compatibility tested (Chrome, Firefox, Safari)
- [ ] Accessibility audit passed (WCAG AA)

---

## Summary

**Total Tasks**: 24
**Phase 1 Focus**: Tasks 1-24 (Core Engine)
**Estimated Effort**: 5-6 weeks (1 full-time developer)
**Critical Path**: TASK 1 → TASK 2 → TASK 10 → TASK 11 → TASK 12

### Next Steps

1. **Prioritize by Dependency**: Start with database tasks (1-4), then backend (5-11), then frontend (12-18)
2. **Parallel Work**: Database migrations can happen in parallel with controller scaffolding
3. **Testing**: Write tests concurrently with implementation (TDD approach recommended)
4. **Integration**: Tasks 22-24 happen after all features implemented

### Phase 2 (Optional - Deferred)

If timeline permits:
- [ ] Custom rule creation (FR-004 from spec)
- [ ] Rule reordering persistence (FR-015 enhancement)
- [ ] Rule usage analytics

---

**Plan Reference**: [plan.md](plan.md)
**Spec Reference**: [spec.md](spec.md)
**Design Reference**: [design.md](design.md)
