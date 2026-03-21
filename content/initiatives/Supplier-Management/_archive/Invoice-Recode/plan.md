---
title: "Plan"
---


**Epic**: TP-3300-REC
**Spec**: [spec.md](spec.md)
**Design**: [design.md](design.md)
**Created**: 2025-12-15
**Status**: Ready for Implementation

---

## Technical Context

### Technology Stack
- **Backend**: Laravel 12 (PHP 8.4), Eloquent ORM
- **Frontend**: Vue 3 + Inertia.js v2 (TypeScript)
- **Database**: MySQL with activity logging
- **UI Components**: Existing Storybook components (Table, Modal, Checkbox, Filter inputs, Toast)
- **Testing**: Pest (PHP), Feature/Unit tests

### Core Dependencies
- **Existing Models**: Invoice, BillItem, ServiceType, ServiceCategory, User
- **Existing Infrastructure**: LogsActivity trait for audit logging, UpdateBillItem action
- **External Dependencies**: None identified
- **Performance Requirement**: Handle 1000+ line items with <1 second load time

### Key Constraints
- **Atomic Transactions**: All-or-nothing bulk recoding (rollback if ANY item fails)
- **Data Consistency**: No partial updates; RecodeAction audit trail must be atomic with bulk update
- **Accessibility**: WCAG Level AA (keyboard navigation, screen reader support)
- **No Undo**: After confirmation, changes committed; corrections via new recode or activity log

---

## Constitution Check

✓ **Lean Architecture**: Feature uses existing patterns; minimal new abstractions
✓ **Testing First**: All core logic covered by feature/unit tests
✓ **Data Integrity**: Atomic transactions prevent data corruption
✓ **User-Centric**: Power-user focused; efficient workflows
✓ **Accessibility**: WCAG AA compliance built in

---

## Design Decisions

### 1. Data Model

#### New Entities

**RecodeRule**
```php
- id (PK)
- name (string) - Human-readable rule name
- description (string) - What this rule matches
- rule_type (enum: 'description_pattern', 'amount_range', 'category')
- condition_data (JSON) - Rule conditions (pattern, min_amount, max_amount, category_id)
- target_service_type_id (FK: ServiceType)
- is_active (boolean)
- created_by (FK: User)
- created_at, updated_at
- user_rule_order (JSON) - Per-user rule ordering preference [OPTIONAL: Phase 2]
```

**RecodeAction** (Activity Log Entry)
```php
- id (PK)
- user_id (FK: User)
- item_ids (JSON array) - Which items were recoded
- old_service_type_id (FK: ServiceType)
- new_service_type_id (FK: ServiceType)
- rule_id (FK: RecodeRule, nullable) - Null if manual selection
- status (enum: 'success', 'partial_failure', 'rollback')
- failed_items (JSON, nullable) - If partial failure, list with reasons
- timestamp (timestamp)
- created_at
```

#### Model Updates

**BillItem** (No schema changes needed)
- Relationships: Already has service_type_id, invoice_id, supplier_id
- Use: Update via atomic transaction in RecodeAction

**ServiceType**
- Verify: Has active service_types available for each category
- Add relationship: hasMany RecodeRules (target_service_type_id)

### 2. API Contracts (Inertia Props & Actions)

#### Page Load: GET /recode
**Props passed to Vue component**:
```php
[
  'lineItems' => Collection of BillItem (paginated, 50-100 per page),
  'commonRules' => Collection of RecodeRule (8-10 most-used),
  'allRulesCount' => int (total available rules),
  'filters' => array (current filter state),
  'sortBy' => string (current sort column/direction),
]
```

#### Action 1: Apply Rule (POST /recode/apply-rule)
**Request**:
```php
{
  'rule_id' => int,
  'filters' => array (current filter state to re-query matching items)
}
```

**Response**:
```php
{
  'matched_item_ids' => [123, 456, 789, ...],
  'count' => 3,
  'message' => "Matched 3 items for Physio → Allied Health"
}
```

#### Action 2: Get Rules Browser (POST /recode/rules/search)
**Request**:
```php
{
  'search' => string (optional search term),
  'page' => int (pagination)
}
```

**Response**:
```php
{
  'rules' => Collection of RecodeRule,
  'total' => int,
  'per_page' => int,
}
```

#### Action 3: Bulk Recode (POST /recode/bulk-recode)
**Request**:
```php
{
  'item_ids' => [123, 456, 789, ...],
  'new_service_type_id' => int,
  'rule_id' => int (nullable, for audit trail)
}
```

**Response** (Success):
```php
{
  'success' => true,
  'action_id' => int,
  'recoded_count' => int,
  'message' => "Successfully recoded 12 items from Personal Care → Allied Health"
}
```

**Response** (Rollback/Failure):
```php
{
  'success' => false,
  'failed_items' => [
    ['id' => 789, 'error' => 'Item deleted after selection'],
    ['id' => 1011, 'error' => 'Database constraint violation']
  ],
  'message' => "Recoding failed and rolled back. 2 items prevented the operation."
}
```

#### Action 4: Load More Items (POST /recode/items)
**Request**:
```php
{
  'page' => int,
  'filters' => array (invoice_id, date_range, amount_range, category_id, description),
  'sort_by' => string ('invoice_id', 'date', 'amount', 'category'),
  'sort_direction' => string ('asc', 'desc')
}
```

**Response**:
```php
{
  'lineItems' => Collection of BillItem (next 50-100),
  'page' => int,
  'has_more' => boolean
}
```

#### Action 5: Reorder Rules [PHASE 1]
**Request**:
```php
{
  'rule_ids' => [5, 2, 8, 3, ...] (ordered array)
}
```

**Response**:
```php
{
  'success' => true,
  'message' => "Rule order saved"
}
```

### 3. UI Components

#### Existing Components (Reuse)
- **Table**: Sortable columns, multi-select checkboxes
- **Modal**: Confirmation dialogs with form controls
- **Button Group**: Select All, Deselect All, Recode
- **Filter Inputs**: Text, date range, amount range, dropdown
- **Toast Notifications**: Success/error feedback
- **Pagination**: "Load More" button

#### New Components to Build

**CommonRulesList** (Sidebar)
- Displays 8-10 rules with drag-drop reordering
- Click to apply rule (auto-selects matching items)
- Visual feedback: "X items matched"
- Collapsible tooltip for first-time users
- Props: rules, onRuleClick, onReorder, selectedCount
- State: isDragging, hovered rule

**RulesBrowser** (Modal)
- Search/filter 50+ rules with pagination
- Display: Rule name, description, target category
- Click rule to apply it (close modal, return to table)
- Props: allRules, onRuleSelect

**RecodeConfirmationModal** (Modal)
- Preview table: Item ID, Description, Current Category → New Category
- Show: "Recoding X items from [Old] to [New]"
- Warnings: Items deleted after selection, same-category attempts
- Actions: [Cancel], [Recode] button (with spinner on submit)
- Props: selectedItems, oldServiceType, newServiceType, onConfirm, onCancel

**SelectionToolbar** (Inline Toolbar)
- Shows: "X items selected" count
- Actions: [Select All], [Deselect All], [Recode Selected →]
- Visibility: Only shows when items selected
- [Recode Selected] button only enabled when ≥1 item selected

**FilterBar** (Top Bar, Always Visible)
- Invoice ID (text input)
- Date Range (date picker range)
- Description (text search)
- Amount Range (number inputs: min, max)
- Current Category (dropdown)
- Behavior: Always visible as users scroll; responsive collapse on tablet

**ActivityLogPanel** (Collapsible Sidebar or Expandable Section)
- Latest recoding actions with timestamp, user, before/after, count
- Expandable to show more history
- Props: recentActions, onExpand

---

## Implementation Phases

### Phase 1: Core Bulk Recode Engine (2-3 sprints)

**Goals**: Foundation for bulk recoding; atomic transactions; common rules

**Tasks**:

1. **Database & Models**
   - Create RecodeRule migration & model with relationships
   - Create RecodeAction migration & model with audit logging
   - Add RecodeRule factory & seeder for pre-built rules
   - Verify BillItem relationships

2. **Backend Controllers & Actions**
   - Create RecodeController with 4 main endpoints:
     - GET /recode → Load page with paginated items + common rules
     - POST /recode/items → Load more items with filters/sorting
     - POST /recode/apply-rule → Query matching items for rule
     - POST /recode/bulk-recode → Atomic transaction + audit logging
   - Create BulkRecodeAction (service class) handling atomic logic:
     - **Validate bill stages**: Reject if any item's bill is ineligible (claimed or beyond PAID)
     - Validate items still exist
     - Check for deletions after selection
     - Prevent same-category recoding
     - Execute atomic DB update
     - Log RecodeAction entry
     - Rollback on ANY failure

3. **Frontend Vue Component**
   - RecodeToolPage (main component)
   - CommonRulesList component (rules sidebar)
   - RecodeConfirmationModal component
   - SelectionToolbar component
   - FilterBar component (always visible)
   - Integrate existing Table, Modal, Toast components

4. **Testing**
   - Unit tests: BulkRecodeAction (success, rollback, edge cases)
   - Feature tests: RecodeController (auth, validation, atomic behavior)
   - Frontend tests: Component rendering, user interactions

5. **Accessibility**
   - WCAG AA keyboard navigation (Tab, Enter, Escape)
   - Screen reader annotations on rule buttons, selection count
   - Focus management: Modal open/close, button focus

---

### Phase 2: Advanced Rule Management (1-2 sprints) [OPTIONAL]

**Goals**: Custom rule creation; rule reordering; improved discoverability

**Tasks**:

1. **Custom Rule Creation** (FR-004 in spec, currently P3)
   - Create Rule modal/form
   - Rule builder: Name, Description Match Pattern, Amount Range, Category
   - Validation: Duplicate rule names, invalid patterns
   - Save rule to DB with created_by user_id

2. **Rule Reordering**
   - Per-user rule order preference storage (user_preferences table or JSON column)
   - Drag-drop reordering in CommonRulesList
   - Persist via AJAX call to backend
   - Load user's preferred order on page load

3. **Rule Analytics** (Optional)
   - Track which rules are most-used
   - Update "common rules" sorting by usage frequency
   - Dashboard showing rule effectiveness

---

### Phase 3: Polish & Optimization (1 sprint)

**Goals**: Edge cases, performance, UX refinement

**Tasks**:

1. **Edge Cases**
   - Items deleted after selection (handled in Phase 1, verify)
   - Service categories with no types (show warning, disable in dropdown)
   - Partial failures (already atomic rollback, test thoroughly)
   - Multi-invoice selections (verify working)

2. **Performance**
   - Query optimization: Eager load relationships (invoice, supplier, service_type)
   - Pagination: 50-100 items per page confirmed
   - Rule matching: Index on description, amount for fast querying
   - Load testing: 1000+ items with <1 second response

3. **UX Refinement**
   - Empty state messaging (detailed guidance as per design)
   - Collapsible tooltips on CommonRulesList
   - Help icon on "Recode Selected" button
   - Toast notification timing (3-5s auto-dismiss)
   - Error modal for bulk recode failures (persistent, user dismisses)

4. **Activity Log Integration**
   - Display recent RecodeActions in collapsible panel
   - Show: "12 items recoded from Personal Care → Allied Health by [User] at [Time]"
   - Link to filter by user or date range (optional)

---

## Data Flow

### Bulk Recode Happy Path

```
1. User opens /recode
   → RecodeController@index returns lineItems (paginated), commonRules, filters

2. User clicks "Physio → Allied Health" rule
   → RecodeController@applyRule queries BillItem with rule conditions
   → Returns matched_item_ids, auto-selects them in table

3. User reviews selection, clicks "Recode Selected"
   → RecodeConfirmationModal opens with preview

4. User confirms recoding
   → RecodeController@bulkRecode triggers BulkRecodeAction
   → BulkRecodeAction begins DB transaction:
      a) Verify items exist
      b) Check for deletions
      c) Prevent same-category
      d) Update BillItem.service_type_id for all items atomically
      e) Create RecodeAction entry with status: success
      f) COMMIT transaction
   → Toast: "Successfully recoded 12 items"
   → Activity log updated immediately
```

### Rollback Path (Any Item Fails)

```
1. User confirms recoding
   → RecodeAction begins transaction
   → During update, constraint violation or deletion detected
   → ROLLBACK entire transaction (no items updated)
   → Catch exception, create RecodeAction entry with status: rollback
   → Return error response with failed_items list
   → Error Modal: "Recoding failed. 2 items prevented the operation."
```

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|-----------|
| Race condition: Item deleted between selection and commit | Medium | Medium | Wrap delete in transaction lock; use pessimistic locking in BulkRecodeAction if needed |
| Partial bulk update corrupts data if transaction fails | Low | High | Use DB transactions strictly; test rollback behavior thoroughly with Pest feature tests |
| Rule matching returns 0 items silently | Low | Low | Always show "No items matched this rule" message; test edge cases |
| Performance degradation with 1000+ items | Low | Medium | Paginate; use eager loading; add database indexes on description, amount; load testing before launch |
| Activity log grows unbounded | Low | Low | Archive old logs quarterly; add retention policy (e.g., 1 year) |
| Users confused by "no undo" design | Medium | Low | Clear messaging in confirmation modal; help icon explaining activity log as audit trail |

---

## Testing Strategy

### Unit Tests
- **BulkRecodeAction**: Happy path, rollback, edge cases (deletions, same-category, multiple invoices)
- **RecodeRule** model: Relationships, rule matching logic
- **RecodeAction** model: Audit logging, atomicity

### Feature Tests
- **RecodeController@index**: Returns correct props, pagination works
- **RecodeController@items**: Filters, sorting, pagination chaining
- **RecodeController@applyRule**: Matching logic, empty results
- **RecodeController@bulkRecode**: Atomic success, rollback on failure, audit trail
- Authentication & authorization: Only authenticated users can recode

### Frontend Tests (Pest + Dusk optional)
- Component rendering: CommonRulesList, RecodeConfirmationModal, FilterBar
- User interactions: Click rule, select items, confirm recode
- Feedback: Toast notifications, error modals
- Accessibility: Keyboard navigation (Tab, Enter, Escape), focus management

### Smoke Tests
- Load page with 100 items: <1 second
- Apply rule with 50 matching items: Display updates correctly
- Bulk recode 50 items: Atomic success or rollback, audit trail recorded

---

## Dependencies & Blockers

- ✓ **ServiceType/ServiceCategory models stable** - Verified in spec
- ✓ **LogsActivity trait available** - Existing infrastructure
- ✓ **UpdateBillItem action exists or can be created** - Confirmed in spec assumptions
- ✓ **Existing Table/Modal/Button components working** - Storybook reference
- ⚠ **User permissions for recoding** - Assume all users with access to page can recode; authorization TBD with Tim

---

## Deployment Checklist

Before launch:
- [ ] Database migrations run (RecodeRule, RecodeAction tables)
- [ ] RecodeRule seeder runs with pre-built rules (defined by Finance team)
- [ ] Feature flag enabled for beta users (if applicable)
- [ ] Activity log queries verified for performance
- [ ] WCAG AA accessibility audit passed
- [ ] Load testing with 1000+ items verified <1s response
- [ ] Rollback/atomic transaction behavior tested end-to-end
- [ ] User training materials prepared (coordination workflows)

---

## Next Steps

1. **Approve Plan** → Get sign-off from Will (Product) and Tim (Engineering)
2. **Generate Tasks** → Run `/speckit.tasks` to break Phase 1 into actionable tasks
3. **Create Issues** → Sync to Jira via `/trilogy.jira-sync push all`
4. **Start Development** → Run `/speckit.implement` to begin implementation
5. **Iterate** → Use `/speckit.clarify-development` if technical questions arise during coding

---

## Implementation Notes

- **Phase 1 Focus**: Get core bulk recoding engine working with atomic transactions; this unlocks majority of user value (80/20 rule)
- **Rule Reordering**: Defer to Phase 2 if timeline tight; doesn't block core workflow
- **Custom Rules**: Phase 2 feature; finance team manages pre-built rules initially
- **Design Decisions Locked**: All 5 design clarifications recorded; no need for design review before coding
- **Code Conventions**: Follow existing Laravel/Vue patterns in codebase; reuse existing components from Storybook
