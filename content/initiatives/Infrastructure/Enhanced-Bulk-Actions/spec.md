---
title: "Feature Specification: Enhanced Bulk Actions"
---

> **[View Mockup](/mockups/enhanced-bulk-actions/index.html)**{.mockup-link}


**Feature Branch**: `001-enhanced-bulk-actions`
**Created**: 2025-12-21
**Status**: Draft

## Overview

Enhance the CommonTable bulk actions system with improved UX patterns including:
- Enhanced dropdown with visual hierarchy and grouping
- Prominent selection count visibility
- Confirmation dialogs for all bulk actions
- Undo capability for reversible actions
- Integrated tag management (Add/Remove tags as standard bulk actions)

**Existing Infrastructure**: The application has a mature tag system via `spatie/laravel-tags` with custom `HasTags` trait override, type-based separation, and rich metadata (colour, icon).

---

## Clarifications

### Session 2025-12-21

- Q: Can users create new tags inline during bulk operations? → A: No, pre-existing tags only
- Q: Should "Select all" work across pages? → A: Yes, cross-page selection included
- Q: How are action categories determined? → A: Backend-defined via PHP action configuration
- Q: What permission model for bulk actions? → A: Per-action permissions (existing pattern)
- Q: Maximum items for cross-page bulk operations? → A: 1000 items

---

## User Scenarios & Testing

### User Story 1 - Selection Visibility (Priority: P1)

Staff users need clear visibility of how many items they have selected when working with table data, so they can confidently perform bulk operations.

**Why this priority**: Users cannot safely perform bulk actions without knowing exactly what they've selected. This is foundational to all other bulk action functionality.

**Independent Test**: Can be fully tested by selecting items in any table and verifying the selection count is prominently displayed without needing other features.

**Acceptance Scenarios**:

1. **Given** a user is viewing a table with selectable rows, **When** they select one or more items, **Then** a prominent selection indicator displays "X items selected"
2. **Given** a user has items selected, **When** they look at the bulk actions area, **Then** the count is visible without opening any dropdown
3. **Given** a user selects all items on the page, **When** viewing the selection indicator, **Then** it shows "All X items selected" distinctly

---

### User Story 2 - Enhanced Dropdown with Grouping (Priority: P2)

Staff users need an organized bulk actions dropdown that groups related actions together with clear visual hierarchy, making it easy to find and execute the right action.

**Why this priority**: The dropdown is the primary interaction point for bulk actions. Good organization reduces errors and speeds up workflows.

**Independent Test**: Can be tested by opening the bulk actions dropdown and verifying actions are grouped logically with icons and labels.

**Acceptance Scenarios**:

1. **Given** a user has items selected, **When** they open the bulk actions dropdown, **Then** actions are grouped by category (e.g., Tags, Export, Edit, Delete)
2. **Given** the dropdown is open, **When** viewing any action, **Then** each action has an icon and descriptive label
3. **Given** destructive actions exist, **When** viewing the dropdown, **Then** destructive actions are visually distinct (red styling, separated section at bottom)

---

### User Story 3 - Bulk Tag Management (Priority: P2)

Staff users need to add or remove tags from multiple items at once, with tags being a standard bulk action available on any taggable table.

**Why this priority**: Tags are a fundamental organizational tool. Bulk tagging dramatically improves workflow efficiency for categorizing and filtering data.

**Independent Test**: Can be tested by selecting items, opening bulk actions, and using Add/Remove Tags actions.

**Acceptance Scenarios**:

1. **Given** a user has items selected on a taggable table, **When** they open bulk actions, **Then** "Add Tags" and "Remove Tags" actions are available in a Tags group
2. **Given** a user clicks "Add Tags", **When** the tag selector opens, **Then** they see available tags for that entity type with colour/icon indicators
3. **Given** a user selects tags to add, **When** they confirm, **Then** selected tags are added to all selected items and a success message shows count
4. **Given** a user clicks "Remove Tags", **When** the tag selector opens, **Then** they see only tags that exist on at least one selected item
5. **Given** items have mixed tags, **When** viewing the Remove Tags selector, **Then** tags show count of items they're attached to (e.g., "Urgent (3 items)")

---

### User Story 4 - Action Confirmation (Priority: P2)

Staff users need confirmation dialogs before executing bulk actions, especially destructive ones, to prevent accidental operations on large datasets.

**Why this priority**: Prevents costly mistakes. Critical for destructive actions but valuable for all bulk operations.

**Independent Test**: Can be tested by triggering a bulk action and verifying the confirmation dialog appears with clear details.

**Acceptance Scenarios**:

1. **Given** a user clicks a destructive bulk action (delete, archive), **When** the action is triggered, **Then** a confirmation dialog appears before execution
2. **Given** a confirmation dialog is shown, **When** viewing the dialog, **Then** it displays the action name, affected item count, and consequences
3. **Given** a user confirms an action, **When** the action completes, **Then** a success message appears with results summary

---

### User Story 5 - Quick Access Actions (Priority: P3)

Staff users frequently performing the same bulk actions need quick access buttons for common operations without opening the full dropdown.

**Why this priority**: Improves efficiency for power users but not essential for basic functionality.

**Independent Test**: Can be tested by selecting items and verifying common actions appear as buttons outside the dropdown.

**Acceptance Scenarios**:

1. **Given** a user has items selected, **When** viewing the bulk actions area, **Then** the most common action(s) appear as direct buttons
2. **Given** quick action buttons are visible, **When** the user clicks one, **Then** the same confirmation flow applies as dropdown actions

---

### User Story 6 - Undo Capability (Priority: P3)

Staff users need the ability to undo bulk actions immediately after execution to recover from mistakes.

**Why this priority**: Important safety net but technically complex. Depends on action type and backend support.

**Independent Test**: Can be tested by executing a reversible bulk action and clicking the undo option in the success notification.

**Acceptance Scenarios**:

1. **Given** a user executes a reversible bulk action, **When** the action completes, **Then** a toast notification appears with an "Undo" button
2. **Given** an undo option is available, **When** the user clicks it within the timeout period, **Then** the action is reversed and items are restored
3. **Given** the undo timeout expires, **When** viewing the notification, **Then** the undo option disappears and the action is permanent

---

### User Story 7 - Tag Filtering in Tables (Priority: P3)

Staff users need to filter table data by tags, with tags appearing as a standard filter option on taggable tables.

**Why this priority**: Completes the tag workflow - users can tag items and then filter by those tags.

**Independent Test**: Can be tested by opening filters on a taggable table and filtering by tag.

**Acceptance Scenarios**:

1. **Given** a table has taggable items, **When** the user opens filters, **Then** a "Tags" filter is available
2. **Given** the Tags filter is selected, **When** choosing tags, **Then** the table shows only items with selected tags
3. **Given** multiple tags are selected, **When** filtering, **Then** items matching ANY of the selected tags are shown (OR logic)

---

### User Story 8 - Shift+Click Range Selection (Priority: P2)

Staff users need to quickly select a range of consecutive rows using shift+click, matching the standard behavior in spreadsheets and modern apps.

**Why this priority**: Standard user expectation from any data table. Dramatically speeds up selection workflows.

**Independent Test**: Can be tested by clicking one row, then shift+clicking another row and verifying all rows in between are selected.

**Acceptance Scenarios**:

1. **Given** a user clicks a row checkbox, **When** they shift+click another row checkbox, **Then** all rows between the two clicks are selected
2. **Given** rows 3-7 are already selected via shift+click, **When** the user shift+clicks row 10, **Then** selection extends to include rows 3-10
3. **Given** no rows are selected, **When** the user shift+clicks a row, **Then** only that single row is selected (behaves as normal click)

---

### User Story 9 - Enhanced Row Highlighting (Priority: P2)

Staff users need clear visual feedback when rows are selected, with selected rows having a prominent background highlight that's visible even when scrolling.

**Why this priority**: Supports selection visibility (P1). Users need to instantly see which rows are selected.

**Independent Test**: Can be tested by selecting rows and verifying they have a distinct background color.

**Acceptance Scenarios**:

1. **Given** a user selects one or more rows, **When** viewing the table, **Then** selected rows have a prominent background highlight (teal tint)
2. **Given** rows are selected, **When** the user scrolls the table, **Then** the highlight remains visible and consistent
3. **Given** a row is selected, **When** the user hovers over it, **Then** the hover state is distinguishable from the selected state

---

### User Story 10 - Keyboard Shortcuts (Priority: P3)

Power users need keyboard shortcuts for common selection operations to work efficiently without reaching for the mouse.

**Why this priority**: Efficiency improvement for power users but not essential for basic functionality.

**Independent Test**: Can be tested by pressing keyboard shortcuts and verifying the expected actions occur.

**Acceptance Scenarios**:

1. **Given** the table is focused, **When** the user presses Cmd/Ctrl+A, **Then** all visible rows on the current page are selected
2. **Given** rows are selected, **When** the user presses Escape, **Then** the selection is cleared
3. **Given** the floating bar is visible, **When** the user presses Escape, **Then** the bar dismisses and selection clears

---

### User Story 11 - Sticky Table Header (Priority: P2)

Staff users need the table header to remain visible when scrolling through long tables, so they can always see column names and access the "select all" checkbox.

**Why this priority**: Improves usability for tables with many rows. Users lose context when headers scroll away.

**Independent Test**: Can be tested by scrolling a table with many rows and verifying the header stays fixed.

**Acceptance Scenarios**:

1. **Given** a user is viewing a table with more rows than fit on screen, **When** they scroll down, **Then** the header row remains fixed at the top
2. **Given** the header is sticky, **When** viewing the "select all" checkbox, **Then** it remains accessible while scrolling
3. **Given** multiple tables exist on different pages, **When** viewing any table, **Then** sticky header behavior is consistent

---

### User Story 12 - Sticky Key Columns (Priority: P3)

Staff users need key identifier columns (like Name or ID) to remain visible when scrolling horizontally through tables with many columns.

**Why this priority**: Prevents losing context on wide tables. Users need to see which row they're looking at.

**Independent Test**: Can be tested by scrolling horizontally on a wide table and verifying the first column stays fixed.

**Acceptance Scenarios**:

1. **Given** a table has more columns than fit on screen, **When** the user scrolls right, **Then** the first column (typically Name/ID) remains fixed
2. **Given** multiple columns are marked as sticky, **When** scrolling, **Then** they stack correctly on the left edge

---

### Edge Cases

- What happens when a user selects items, then navigates to another page? (Selection clears on navigation)
- How does system handle partial failures in bulk operations? (Show which items succeeded/failed)
- What if undo is not possible for certain action types? (Don't show undo button, use clear confirmation instead)
- What if a model doesn't use the HasTags trait? (Tags group doesn't appear in bulk actions)
- What if removing a tag would leave items with no tags? (Allow it - tags are optional)
- What if adding duplicate tags? (Silently skip - no error, no duplicate)

---

## Requirements

### Functional Requirements

**Selection & Display**
- **FR-001**: System MUST display a prominent selection count badge when one or more items are selected
- **FR-002**: System MUST show the selection count without requiring user interaction (always visible when items selected)
- **FR-003**: System MUST visually distinguish "all items selected" state from partial selection
- **FR-003a**: System MUST support cross-page selection with "Select all X items" option when all page items selected
- **FR-003b**: Cross-page selection MUST be limited to 1000 items maximum; show warning if exceeded

**Dropdown & Organization**
- **FR-004**: System MUST group bulk actions by category in the dropdown menu
- **FR-005**: System MUST display icons alongside action labels in the dropdown
- **FR-006**: System MUST visually distinguish destructive actions with danger styling
- **FR-007**: System MUST separate destructive actions at the bottom of the dropdown
- **FR-008**: System MUST disable bulk actions dropdown when no items are selected

**Tag Management**
- **FR-009**: System MUST show "Add Tags" and "Remove Tags" actions for tables with taggable models
- **FR-010**: Tag actions MUST only appear when the underlying model uses the HasTags trait
- **FR-011**: Add Tags selector MUST show all available tags for that entity type
- **FR-012**: Remove Tags selector MUST show only tags present on selected items
- **FR-013**: Remove Tags selector SHOULD show count of items per tag
- **FR-014**: System MUST handle mixed tag states across selected items gracefully

**Confirmation & Feedback**
- **FR-015**: System MUST show confirmation dialog before executing any bulk action
- **FR-016**: Confirmation dialog MUST display: action name, item count, and consequences
- **FR-017**: System MUST display success/failure toast after bulk action completion
- **FR-018**: System SHOULD provide undo capability for reversible actions (tag add/remove)

**Filtering**
- **FR-019**: Taggable tables MUST include a Tags filter option
- **FR-020**: Tags filter MUST support multi-select with OR logic

**Selection Enhancements**
- **FR-021**: System MUST support shift+click to select a range of consecutive rows
- **FR-022**: Shift+click MUST select all rows between the last clicked row and the shift+clicked row
- **FR-023**: Selected rows MUST have a prominent background highlight (teal tint) that persists during scroll
- **FR-024**: Selected row highlight MUST be visually distinct from hover state
- **FR-025**: System SHOULD support Cmd/Ctrl+A to select all visible rows on current page
- **FR-026**: System SHOULD support Escape key to clear selection and dismiss floating bar

**Table Display Enhancements**
- **FR-027**: Tables MUST have sticky headers that remain visible when scrolling vertically
- **FR-028**: Key identifier columns (Name/ID) SHOULD be stickable when scrolling horizontally
- **FR-029**: Sticky behavior MUST be consistent across all CommonTable instances

### Key Entities

- **Selection State**: Current selected items, count, "select all" status
- **Bulk Action**: Label, icon, category, destructive flag, confirmation settings, undo support, visibility conditions
- **Action Result**: Success/failure status, affected items, undo token (if applicable)
- **Tag** (existing): id, name, type, colour, icon (via Spatie Tags)

---

## Success Criteria

### Measurable Outcomes

- **SC-001**: Users can identify their selection count within 1 second of selecting items (no clicks required)
- **SC-002**: Users can execute a bulk action in 3 or fewer clicks (select -> action -> confirm)
- **SC-003**: 100% of destructive bulk actions require explicit confirmation
- **SC-004**: Undo option remains available for at least 10 seconds after reversible action completion
- **SC-005**: Bulk action dropdown opens in under 200ms with all actions visible and grouped
- **SC-006**: Users can bulk-add tags to 100 items in under 5 seconds
- **SC-007**: Tag filter returns results in under 1 second for tables with 10,000+ rows

---

## Existing Infrastructure to Leverage

### Tag System (Already Implemented)
- **Package**: `spatie/laravel-tags` with custom overrides
- **Trait**: `App\Extends\Traits\HasTags` (custom, not Spatie default)
- **Models using tags**: Package, BillItem (can be extended to others)
- **Components**: `CommonTagGroup.vue`, `TagForm.vue`
- **DTO**: `Domain\Shared\Data\TagData`
- **Table**: `App\Tables\Staff\TagsTable`

### Confirmation System (Already Implemented)
- **Component**: `CommonConfirmDialog.vue`
- **Composable**: `useConfirmDialog.ts` / `dialog.js`
- **Pattern**: Promise-based, returns 'confirm' | 'cancel' | 'close'

### Toast System (Already Implemented)
- **Component**: `CommonToastContainer.vue` with `CommonAlert`
- **Composable**: `useToast.js`
- **Note**: Actions support exists but undo not yet implemented

## Clarification Outcomes

### Q1: [Scope] Is undo in scope or deferred?
**Answer:** US6 explicitly covers undo capability at P3 priority. FR-018 states "System SHOULD provide undo capability for reversible actions (tag add/remove)." The overview lists it and US6 has full acceptance criteria. **Undo is in scope but at P3 priority** -- it should be implemented after P1 (selection visibility) and P2 (dropdown, tagging, confirmation, shift+click, row highlighting, sticky headers) features. The existing toast system (`CommonToastContainer.vue`, `useToast.js`) already has action support infrastructure but undo is "not yet implemented" per the spec.

### Q2: [Data] What is the performance impact of bulk operations on 1000 items?
**Answer:** The codebase uses `spatie/laravel-tags` with a custom `HasTags` trait (`app/Extends/Traits/HasTags.php`). Models using tags include Package and BillItem. Tagging 1000 items requires 1000 tag attach operations. **With database transactions and batch processing, this should complete within 5-10 seconds for tag operations.** SC-006 targets "100 items in under 5 seconds." For 1000 items, a 30-second timeout with progress indicator is reasonable. **Bulk operations should use queue processing** for operations exceeding 100 items, with a progress toast showing completion percentage.

### Q3: [Dependency] Are bulk actions beyond tagging in scope?
**Answer:** The spec's overview mentions "Enhanced dropdown with visual hierarchy and grouping" and US2 describes action categories "Tags, Export, Edit, Delete." The Functional Requirements section includes tag management (FR-009 through FR-014) and confirmation dialogs (FR-015 through FR-018). **The infrastructure supports ANY bulk action type** -- tags are the example. The `Bulk Action` entity has label, icon, category, destructive flag, confirmation settings, and undo support. **Each CommonTable page would define its own bulk actions** (e.g., Bills table might have "Mark as Reviewed", "Export CSV"; Packages table might have "Assign to Team", "Add Tags"). The framework is generic; tags are the first implementation.

### Q4: [Edge Case] What happens with partial permission on 1000 items?
**Answer:** The spec does not address this. **Recommendation:** The operation should proceed on the permissible items and report the result. The confirmation dialog (FR-016) should show: "Applying to X items (Y items skipped due to permissions)." Post-operation, the success toast should report: "Completed for X items. Y items were skipped." This follows the same pattern as the edge case "partial failures in bulk operations" which specifies "Show which items succeeded/failed."

### Q5: [UX] How does cross-page selection interact with filtering?
**Answer:** When a user selects all items and the table is filtered, "Select all X items" should select all items matching the current filter, not all items in the database. The selection IDs are sent to the server, and the server validates the selection against the current filter. **If the filter changes after selection, the selection should be cleared** to prevent unintended operations on mismatched items.

## Refined Requirements

1. **Bulk operations exceeding 100 items should use queue processing** with a progress indicator toast.
2. **Partial permission handling:** Proceed on permissible items, report skipped items in the result summary.
3. **Clear selection when filters change** to prevent mismatched operations.
4. **The bulk action framework is generic** -- tags are the first implementation. Each CommonTable page should define its own available bulk actions via backend configuration.
5. **Add FR for cross-page selection memory:** When paginating, previously selected items on other pages must remain selected (tracked in frontend state or server-side session).
