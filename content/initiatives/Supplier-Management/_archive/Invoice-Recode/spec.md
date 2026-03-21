---
title: "Feature Specification: Invoice Line Item Recode Tool"
---


**Feature Branch**: `feat/TP-3300-REC-invoice-recode`
**Created**: 2025-12-15
**Status**: Draft
**Epic**: TP-3300-REC - Invoice Recode Tool

---

## User Scenarios & Testing

### User Story 1 - Bulk Recode with Common Rules (Priority: P1)

**Actor**: Care Coordinator processing supplier invoices with miscategorized line items

**Scenario**:
A coordinator receives an invoice with 25 line items. 12 items contain "Physio" in the description but are incorrectly categorized as "Personal Care" instead of "Allied Health". They need to recategorize these items in bulk.

**User Flow**:
1. Open Invoice Recode page
2. Click "Common Rules" sidebar
3. Select "Physio descriptions → Allied Health" rule
4. System auto-selects 12 matching items in table
5. Click "Recode Selected" button
6. Confirm action in modal (shows: 12 items will be recoded, old category → new category)
7. System applies changes, shows success message
8. Activity log updated with recoding action

**Why this priority**: Saves 15-20 minutes per invoice; handles 80% of use cases; highest user frustration point

**Independent Test**: User can successfully apply a common rule to bulk-select and recode items, with confirmation and audit trail

**Acceptance Scenarios**:
1. **Given** user has 12 line items matching "Physio" rule, **When** they apply the rule and confirm, **Then** all 12 items are recoded to Allied Health
2. **Given** a recoding action is applied, **When** viewing activity log, **Then** entry shows "Recoded 12 items from Personal Care → Allied Health" with timestamp and user
3. **Given** user applies rule, **When** confirmation modal appears, **Then** they can preview items before committing (table of items to be changed)

---

### User Story 2 - Manual Multi-Select & Recode (Priority: P1)

**Actor**: Billing Manager reviewing invoices for data quality

**Scenario**:
Manager manually inspects line items and identifies 5 items with incorrect amounts/service dates that should be in "Other" category. They want to bulk-select these 5 and recode them without using a pre-built rule.

**User Flow**:
1. Open Invoice Recode page / apply filters (e.g., "Amount > $500")
2. Click checkboxes for 5 specific items
3. Click "Recode Selected" button
4. Dropdown appears to select new service category
5. Click "Apply" in confirmation modal
6. Items recoded, success notification shown

**Why this priority**: Handles edge cases and custom corrections; flexible workflow

**Independent Test**: User can manually select specific items via checkboxes and bulk-recode them to a chosen category

**Acceptance Scenarios**:
1. **Given** user selects 5 items via checkboxes, **When** they click "Recode Selected", **Then** dropdown shows all available service categories
2. **Given** 5 items are selected for recoding to "Other" category, **When** confirming, **Then** all 5 are successfully recoded
3. **Given** user has selected items, **When** they click category dropdown, **Then** current category is highlighted/disabled to show what they're changing from

---

### User Story 3 - Table Sorting & Filtering (Priority: P2)

**Actor**: Coordinator triaging invoices

**Scenario**:
Coordinator wants to view all line items from a specific invoice sorted by amount (highest first) to identify potential errors or outliers.

**User Flow**:
1. Open Invoice Recode page
2. Filter by Invoice ID or Date range
3. Click "Amount" column header to sort descending
4. View items ordered by amount, highest first
5. Spot $2,500 item with generic description → manually recodes it

**Why this priority**: Improves discoverability of problematic items; supports data quality review workflows

**Independent Test**: User can filter by date/invoice and sort table columns, revealing data patterns for recoding

**Acceptance Scenarios**:
1. **Given** table is loaded, **When** user clicks "Amount" column header, **Then** items sort by amount (ascending/descending toggle)
2. **Given** user applies date filter, **When** table updates, **Then** only line items within date range are displayed
3. **Given** user applies multiple filters, **When** table updates, **Then** filters combine with AND logic (e.g., "Invoice X AND Date between Y-Z")

---

### User Story 4 - Create Custom Rules (Priority: P3)

**Actor**: Compliance Manager setting up recurring rules for team

**Scenario**:
Manager notices "Grandcare" items are frequently miscategorized. They want to create a custom rule so coordinators can auto-recode these with one click going forward.

**User Flow**:
1. Open Invoice Recode page
2. Click "Create Rule" button (under Common Rules sidebar)
3. Fill form: Rule Name, Description Match Pattern, Target Category
4. Click "Save Rule"
5. New rule appears in Common Rules list for all users
6. Coordinators can apply it immediately

**Why this priority**: Reduces repeated manual work; supports organizational standardization; can be added in Phase 2

**Independent Test**: User can create, save, and apply custom rules that persist across sessions

**Acceptance Scenarios**:
1. **Given** user creates rule "Grandcare → Respite Care", **When** applied to new invoices, **Then** items with "Grandcare" in description auto-select and recode
2. **Given** rule is created by one user, **When** another user opens Recode page, **Then** rule appears in their Common Rules list
3. **Given** rule matches 0 items, **When** applied, **Then** system shows message "No items matched this rule"

---

### Edge Cases

- What if user selects items from multiple invoices? → Allow it; each line item recoded independently
- What if service category has no available service types? → Show warning; disable category from dropdown
- What if bulk recode fails partway (e.g., database error on item 7 of 12)? → Rollback all; show error modal with list of failed items
- What if an item is deleted after selection but before confirmation? → Show warning in confirmation modal; remove from recode list

---

---

## Clarifications

### Session 2025-12-15

**Questions Asked & Answered (5 of 5):**

- Q1: Pagination strategy for 1000+ line items? → A: Option B - "Load More" button with 50-100 item batches (explicit control, clear item count)
- Q2: RecodeRule entity - supported rule types in Phase 1? → A: Option A - Limited types (description pattern, amount range, category) + pre-built "guided checks" for common miscoding patterns
- Q3: Confirmation modal - preview scope and undo capability? → A: Option A - Full preview table (Item, Current → New category) with NO undo after confirm (rely on activity log for audit trail)
- Q4: Error handling - partial failure strategy? → A: Option A - Rollback ALL changes if ANY item fails; show error modal with list of failed items (data consistency)
- Q5: Common rules visibility with 50+ rules? → A: Option A - Show 8-10 most-used rules by default + "View all rules" searchable browser (scalability, clean UI). Rules can be reordered by user preference

---

## Requirements

### Constraints & Eligibility

- **CONSTRAINT-001**: System MUST only allow recoding items from bills in these stages: `IN_REVIEW`, `APPROVED`, `PAYING`, or `PAID` (not yet claimed)
- **CONSTRAINT-002**: System MUST prevent recoding items from bills that have been submitted/claimed to funding body (e.g., after PAID stage)
- **CONSTRAINT-003**: System MUST validate bill stages BEFORE executing bulk recode; reject entire operation if any item's bill is ineligible (all-or-nothing)
- **CONSTRAINT-004**: System MUST show error message if user attempts to recode claimed items: "Cannot recode items from bills that have been claimed. Bills: [ref1, ref2, ...]"

### Functional Requirements

- **FR-001**: System MUST display all invoice line items in a sortable table with columns: Invoice ID, Date, Description, Amount, Current Category, Supplier
- **FR-002**: System MUST support multi-select via checkboxes for bulk operations
- **FR-003**: System MUST display pre-built "Common Rules" in sidebar (e.g., "Physio → Allied Health", "Personal Care items > $200 → Review")
- **FR-004**: System MUST allow users to apply a Common Rule to auto-select matching items in table
- **FR-005**: System MUST provide "Recode Selected" button (only enabled when items are selected AND all bills are eligible)
- **FR-006**: System MUST show confirmation modal before bulk recoding with preview of items to be changed
- **FR-007**: System MUST update all selected items to new service category in one atomic operation
- **FR-008**: System MUST log each recoding action to activity log (who, what, when, before/after categories)
- **FR-009**: System MUST support filtering by: Invoice ID, Date Range, Description (text search), Amount Range, Current Category
- **FR-010**: System MUST support sorting by: Invoice ID, Date, Amount, Category (ascending/descending)
- **FR-011**: System MUST prevent recoding items to the same category they're already in (show warning)
- **FR-012**: System MUST support "Select All" / "Deselect All" shortcuts for filtered results
- **FR-013**: System MUST display count of selected items (e.g., "12 items selected")
- **FR-014**: System MUST handle recoding failures gracefully (rollback, show error message with affected items)
- **FR-015**: System MUST allow users to reorder Common Rules in sidebar (drag-drop or up/down controls) to customize rule priority for their workflow; user preference persists across sessions

### Key Entities

- **LineItem**: Represents a single invoice line item
  - `id`, `invoice_id`, `description`, `amount`, `service_type_id` (current category), `service_date`, `supplier_id`
  - Relationships: Invoice, ServiceType, Supplier

- **RecodeRule**: Represents a pre-built or custom recoding rule
  - `id`, `name`, `description`, `rule_type` (description-match, amount-range, etc.), `condition_data` (JSON), `target_service_type_id`, `is_active`, `created_by`
  - Used to auto-select matching items

- **RecodeAction**: Audit trail entry for bulk recoding
  - `id`, `user_id`, `item_ids` (JSON array), `old_service_type_id`, `new_service_type_id`, `rule_id` (null if manual), `timestamp`

---

## Success Criteria

### Measurable Outcomes

- **SC-001**: Coordinators can recode 12+ misclassified items in < 2 minutes (vs. 15-20 minutes with single-item editing)
- **SC-002**: Common Rules auto-select matching items with ≥ 95% accuracy (no false positives)
- **SC-003**: Bulk recode operations complete successfully for 100 items in < 5 seconds
- **SC-004**: Data accuracy improves: 90% of line items correctly categorized after using tool for one billing cycle
- **SC-005**: All recoding actions are logged with full audit trail (who, what, when, before/after)
- **SC-006**: Tool supports filtering/sorting across 1000+ line items without UI lag (< 1 second load)
- **SC-007**: Undo/rollback on failed recoding prevents data corruption; zero data loss incidents

### User Experience Metrics

- **SC-008**: User completes first bulk recode task with zero training (UI is intuitive)
- **SC-009**: 80% of recodings use Common Rules (vs. manual selection), indicating rules are effective
- **SC-010**: Feature adoption: ≥ 70% of coordinators use tool within 4 weeks of launch

---

## Assumptions

- Service categories and types are stable and fully defined in ServiceType/ServiceCategory models
- Common Rules will be defined by compliance/finance team before launch
- Bulk recode operations can leverage existing UpdateBillItem action
- Activity logging infrastructure (LogsActivity trait) is available and working
- User permissions/authorization for recoding are defined separately (assume user has permission)
- Line items from multiple invoices can be recoded in a single operation (no invoice-level locking)

---

## Dependencies

- BillItem model and relationships to ServiceType, Invoice, Supplier must be stable
- UpdateBillItem action must support bulk operations or new action must be created
- ServiceCategory/ServiceType taxonomy must be finalized
- Activity logging must be configured to capture recoding actions
- UI framework (Vue 3) must support sortable tables and multi-select patterns
- No breaking changes to invoice submission workflow expected during development

---

## Scope Boundaries

### In Scope
- Multi-select and bulk recode of line items
- Common pre-built rules for auto-selection
- Table sorting and filtering
- Confirmation modal with preview
- Audit trail logging
- Custom rule creation (Phase 2)
- Dashboard showing recoding history/trends (Future)

### Out of Scope
- Automatic recoding (no AI/ML-based auto-correction)
- Recoding across multiple suppliers/invoices in single view (separate concern)
- Integration with invoice approval workflows
- Email notifications for recoding events
- Recoding reversal/undo after action is committed
- Mobile-responsive design (desktop-first)

---

## Notes

- Common Rules should be pre-built by finance team before launch (e.g., "Physio descriptions", "High-value items", "Unmatched suppliers")
- Consider performance impact if user tries to recode 1000+ items at once; may need batching/progress indicator
- Audit trail should be queryable for compliance reviews
- Consider read-only role for auditors to view recoding history without making changes
