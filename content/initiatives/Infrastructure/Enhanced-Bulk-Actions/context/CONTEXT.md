---
title: "Enhanced Bulk Actions - Context Log"
---


This document tracks decisions, clarifications, and context gathered throughout the development of this epic.

---

## Session: Spec Generation - 2025-12-21

### Feature Description
Reorganize CommonTable bulk actions with enhanced dropdown UI, prominent selection visibility, action confirmations, undo capability, and integrated polymorphic tag management.

### Key Decisions Made

1. **UI Pattern**: Enhanced Dropdown
   - Chose enhanced dropdown over slide-out panel, floating action bar, or contextual toolbar
   - Keeps familiar interaction pattern while adding visual hierarchy and grouping

2. **Priority Features** (all selected):
   - Selection count visibility (prominent, always visible)
   - Quick access actions (common actions as direct buttons)
   - Action confirmation (dialogs before execution)
   - Undo capability (for reversible actions)

3. **Tag Integration**:
   - Leverage existing Spatie `laravel-tags` infrastructure
   - Add/Remove Tags as standard bulk actions on taggable tables
   - Tags filter for taggable tables

### Existing Infrastructure Identified

- **Tags**: `spatie/laravel-tags` with custom `App\Extends\Traits\HasTags`
- **Confirmations**: `CommonConfirmDialog.vue` + `useConfirmDialog` composable
- **Toasts**: `CommonToastContainer.vue` with action support (undo ready)
- **Current bulk actions**: `CommonTableAction.vue` using Reka UI dropdown

### Assumptions Made

1. Selection clears on page navigation (current behavior)
2. Tags are optional - removing all tags from an item is allowed
3. Duplicate tag additions are silently skipped
4. Tag filter uses OR logic (items matching ANY selected tag)

### Open Questions

None - all clarifications resolved during spec creation.

---

## Session: UI Research - Modern Bulk Action Patterns - 2025-12-21

### Current TC Portal Implementation Analysis

The table uses a **traditional dropdown menu pattern**:
- Checkbox column on the left for selection
- "Select all" checkbox in header (page-level only)
- "Bulk Actions" dropdown button in top-right toolbar
- Actions hidden in dropdown until clicked
- Footer shows selection count: "X of Y rows selected"

**Strengths:**
- Clean, minimal UI when not selecting
- Familiar pattern

**Weaknesses:**
- Actions are hidden - users must click to discover them
- No visual feedback when items are selected (beyond left border highlight)
- No sticky/floating action bar - easy to lose context when scrolling
- "Select all" only selects current page, not all results across pages

### Modern Patterns in Leading Apps

#### 1. Floating Action Bar (Gmail, Linear, Notion, Figma)
Most common modern pattern. When items are selected, a contextual bar appears:

```
┌─────────────────────────────────────────────────────────┐
│  ✓ 3 selected    [Archive] [Delete] [Move to...] [✕]   │
└─────────────────────────────────────────────────────────┘
```

- **Position:** Bottom of screen (Gmail), top replacing toolbar (Linear), or inline above table
- **Behavior:** Appears on first selection, disappears when deselected
- **Actions:** Primary actions as buttons, secondary in overflow menu

**Pros:** Highly discoverable, actions always visible, clear selection state
**Cons:** Can obscure content if poorly positioned

#### 2. Sticky Selection Header (Airtable, Retool, Stripe Dashboard)
The table header transforms when items are selected:

```
Before:  [☐] Name        Email           Role
After:   [☑] 3 selected  [Delete] [Export] [Assign] [...]
```

**Pros:** No layout shift, uses existing space efficiently
**Cons:** Loses column headers temporarily

#### 3. Inline Action Bar (GitHub Issues, Jira)
A bar appears above the table (not floating):

```
┌──────────────────────────────────────────────────────────┐
│  [☑] Select all 847 issues  |  [Label ▾] [Assignee ▾]   │
├──────────────────────────────────────────────────────────┤
│  [☐] Issue #123 - Bug fix...                             │
```

**Pros:** Non-intrusive, always in view context
**Cons:** Takes vertical space

#### 4. Select All Across Pages (Every modern app)
Critical feature: selecting all items, not just current page:

```
"All 25 items on this page are selected. Select all 847 items?"
```

This is missing from current implementation.

### Feature Comparison Matrix

| Feature | TC Portal Current | Gmail/Linear | Airtable | GitHub |
|---------|-------------------|--------------|----------|--------|
| Floating action bar | ❌ | ✓ | ❌ | ❌ |
| Inline action bar | ❌ | ❌ | ✓ | ✓ |
| Header transforms | ❌ | ❌ | ✓ | ❌ |
| Select all across pages | ❌ | ✓ | ✓ | ✓ |
| Visual selection feedback | Minimal | Strong | Strong | Strong |
| Keyboard shortcuts | ❌ | ✓ | ✓ | ✓ |
| Shift+click range select | ❌ | ✓ | ✓ | ✓ |
| Undo action toast | ❌ | ✓ | ✓ | ❌ |

### Recommendations for Implementation

**Quick wins:**
1. Add a floating/sticky action bar that appears on selection
2. Implement "Select all X items" across pages
3. Add shift+click for range selection

**High-impact improvements:**
1. Surface primary bulk actions as visible buttons (not hidden in dropdown)
2. Add undo capability with toast notifications
3. Improve visual feedback - highlight selected rows more prominently

### Decision: Enhanced Dropdown with Floating Bar

Based on key decisions from spec generation session, we're going with:
- **Enhanced Dropdown** as primary action container (preserves familiar pattern)
- **Prominent Selection Visibility** via inline bar above table when items selected
- **Quick Access Actions** for most common operations
- This is a hybrid approach combining best of dropdown + inline bar patterns

---

## Session: Business Clarification - 2025-12-21

### Questions Asked: 5

### Key Business Decisions

1. **Primary Business Problem**: Workflow inefficiency + Missing functionality
   - Staff lack efficient tools for categorizing and managing large datasets
   - No bulk tagging capability exists

2. **Primary Users**: Operations/Admin Staff
   - Managing suppliers, billing, system configuration
   - High-volume data management workflows

3. **Success Metrics Defined**:
   - Error reduction (50% fewer bulk action mistakes)
   - Feature adoption (60% tag usage within 6 months)
   - User satisfaction (8+ NPS for table workflows)

4. **Priority/Timeline**: High - Next Sprint
   - Proactive improvement, not reactive to complaints
   - Part of modernizing UX standards

5. **Customer Validation**: Proactive improvement
   - No specific complaints driving this
   - Aligning with modern SaaS UX patterns

### Stakeholder Alignment

- **Primary**: Operations/Admin Staff (efficient bulk management)
- **Secondary**: Support Team (fewer error tickets)
- **Decision Authority**: Product Team

### ROI Summary

- **Investment**: 2-3 sprints
- **Return**: Time savings (10-15 min/day per user), reduced support tickets
- **Strategic Value**: Foundation for future workflow automation

### Artifacts Created

- `business-spec.md` - Full business specification

---

## Session: Functional Clarification - 2025-12-21

### Questions Asked: 5

### Key Functional Decisions

1. **Tag Creation During Bulk Operations**: Pre-existing tags only
   - Users cannot create new tags inline during bulk add
   - Simplifies UI and maintains tag governance
   - Users must create tags separately before using in bulk operations

2. **Cross-Page Selection**: Enabled
   - "Select all X items" option appears when all page items selected
   - Allows operations on entire filtered result set
   - Maximum 1000 items limit to prevent performance issues

3. **Action Category Configuration**: Backend-defined
   - Categories defined via PHP action configuration
   - Consistent structure across all tables
   - Frontend displays categories from backend metadata

4. **Permission Model**: Per-action permissions
   - Each bulk action has its own permission check
   - Follows existing authorization patterns
   - Actions hidden if user lacks permission

5. **Cross-Page Selection Limit**: 1000 items maximum
   - Prevents performance degradation
   - Shows warning when limit exceeded
   - User must refine filters to reduce selection

### Requirements Added

- **FR-003a**: Cross-page selection with "Select all X items" option
- **FR-003b**: 1000 item maximum with warning

### Spec Updates

- Added Clarifications section with all Q&A
- Updated functional requirements for cross-page selection
- Edge cases already covered in original spec

---

## Session: Design Clarification - 2025-12-21

### Questions Asked: 5

### Key Design Decisions

1. **UI Pattern Change**: Floating Action Bar (Gmail style)
   - Changed from "Enhanced Dropdown with inline bar" to full floating bar
   - Fixed position at bottom of viewport
   - Slides up on selection, slides down on dismiss

2. **Bar Layout**: Balanced left-to-right
   - Left: Selection count + Clear button + "Select all X" link
   - Right: Quick action buttons + "More" dropdown + Dismiss
   - Clean separation between info and actions

3. **Quick Actions**: Table-specific (backend-defined)
   - Each table defines its 2-3 primary quick actions
   - Destructive actions never as quick actions (always in dropdown)
   - Examples: Suppliers → "Add Tags", "Export"; Invoices → "Approve", "Export"

4. **Tag Selector**: Dropdown panel
   - Expands upward from floating bar button
   - Multi-select with checkboxes
   - Shows tag colors/icons
   - "Remove Tags" shows item counts per tag

5. **Visual Treatment**: Slide-up with shadow
   - 200ms ease-out animation on appear
   - White background, shadow-lg, rounded-lg
   - Matches existing toast/modal patterns
   - Dark mode support included

### Components Defined

- `BulkActionBar.vue` - Main floating container
- `BulkActionTagSelector.vue` - Tag multi-select dropdown
- `useBulkActions.ts` - Selection state composable

### Artifacts Created

- `design.md` - Full design specification with wireframes

---

## Session: Table Uplift Additions - 2025-12-21

### Scope Expansion

Added 3 "quick win" table UX enhancements to the epic:

1. **Shift+Click Range Selection** (P2)
   - Standard pattern from spreadsheets/modern apps
   - Click first row, shift+click last row → selects all between
   - FR-021, FR-022

2. **Enhanced Row Highlighting** (P2)
   - Selected rows get prominent teal background tint
   - Distinct from hover state
   - Persists during scroll
   - FR-023, FR-024

3. **Keyboard Shortcuts** (P3)
   - Cmd/Ctrl+A → select all visible rows
   - Escape → clear selection, dismiss floating bar
   - FR-025, FR-026

### Updated Counts

- User Stories: 7 → 10
- Functional Requirements: 20 → 26

### Rationale

These additions directly support the core selection visibility story (P1) and match user expectations from modern SaaS tools (Gmail, Linear, Airtable, Notion).

---

## Session: Sticky Table Features - 2025-12-21

### Scope Expansion (continued)

Added 2 more table UX enhancements leveraging InertiaUI Table built-in features:

1. **Sticky Table Header** (P2)
   - Header remains visible when scrolling vertically
   - "Select all" checkbox always accessible
   - InertiaUI Table has `$stickyHeader = true` built-in
   - FR-027

2. **Sticky Key Columns** (P3)
   - First column (Name/ID) stays visible during horizontal scroll
   - InertiaUI Table has `stickable()` method built-in
   - FR-028, FR-029

### Updated Counts

- User Stories: 10 → 12
- Functional Requirements: 26 → 29

### Research Notes

- **InertiaUI Table**: Already supports sticky header and columns natively
- **TanStack Table**: Has row grouping feature, but would require replacing InertiaUI Table
- **Decision**: Use InertiaUI Table's sticky features; defer row grouping to future epic

---

## Session: Plan Generation - 2025-12-21

### Technical Approach

Created comprehensive implementation plan (`plan.md`) with 5 phases:

1. **Phase 1: Foundation** (P1)
   - Selection visibility, row highlighting, shift+click
   - Convert `actions.js` to TypeScript
   - Create `useBulkActions.ts` composable
   - Skeleton `BulkActionBar.vue`

2. **Phase 2: Floating Bar & Dropdown** (P2)
   - Complete floating bar with quick actions
   - Enhanced dropdown with categories
   - Cross-page selection (up to 1000 items)
   - Action confirmation flow

3. **Phase 3: Tag Management** (P2)
   - `BulkAddTagsAction` and `BulkRemoveTagsAction`
   - `BulkActionTagSelector.vue` component
   - API endpoints for bulk tag operations
   - Tags filter on taggable tables

4. **Phase 4: Sticky Table Features** (P2)
   - Enable InertiaUI Table sticky header
   - Configure sticky columns for key identifiers
   - CSS adjustments for z-index layering

5. **Phase 5: Undo & Polish** (P3)
   - Undo infrastructure with `BulkActionUndo` model
   - Toast undo button with 10-second timeout
   - Keyboard shortcuts completion
   - Accessibility audit

### Architecture Decisions

- **Data Model**: Selection state as frontend reactive refs
- **API Contracts**: 4 new endpoints for bulk tag operations + undo
- **File Structure**: New components in `table/`, actions in `Domain\Shared\Actions`
- **Testing**: Unit + Feature + Browser tests per phase

### Constitution Check

All 10 relevant principles passed validation:
- Majestic Monolith ✅
- Domain-Driven Design ✅
- Convention Over Configuration ✅
- Code Quality Standards ✅
- Testing is First-Class ✅
- Action Classes ✅
- Inertia.js + Vue 3 + TypeScript ✅
- Component Library & Tailwind ✅
- Design System ✅
- Permissions & Authorization ✅

### Artifacts Created

- `plan.md` - Full implementation plan with 5 phases

### Next Steps

1. `/speckit.tasks` - Generate dependency-ordered tasks
2. `/speckit.plan-test` - Generate test plan (optional, for TDD)
3. Create feature branch `001-enhanced-bulk-actions`
4. Begin Phase 1 implementation

---

## Session: Test Plan Generation - 2025-12-21

### Test Approach

Comprehensive test plan created following TDD (Test-First Development) methodology.

### Test Coverage Summary

| Category | Files | Test Cases |
|----------|-------|------------|
| Unit Tests | 9 | ~45 cases |
| Feature Tests | 7 | ~25 cases |
| Browser Tests | 14 | ~55 cases |
| **Total** | **30** | **~125 cases** |

### Functional Requirements Coverage

All 29 functional requirements mapped to specific tests:
- **Selection & Display** (FR-001 to FR-003b): Browser tests
- **Dropdown & Organization** (FR-004 to FR-008): Browser tests
- **Tag Management** (FR-009 to FR-014): Unit + Feature + Browser tests
- **Confirmation & Feedback** (FR-015 to FR-018): Feature + Browser tests
- **Filtering** (FR-019, FR-020): Feature + Browser tests
- **Selection Enhancements** (FR-021 to FR-026): Unit + Browser tests
- **Table Display** (FR-027 to FR-029): Browser tests

### Success Criteria Verification

All 7 success criteria have dedicated test assertions:
- SC-001: Selection count <1s → `SelectionVisibilityTest`
- SC-002: Bulk action ≤3 clicks → `ActionConfirmationTest`
- SC-003: 100% destructive confirm → `ActionConfirmationTest`
- SC-004: Undo ≥10s available → `UndoCapabilityTest`
- SC-005: Dropdown <200ms → `DropdownGroupingTest`
- SC-006: 100 items <5s → `BulkTagManagementTest`
- SC-007: Tag filter <1s → `TagFilteringTest`

### Test Tools

- **Pest v3**: Unit and Feature tests
- **Dusk v8 / Nightwatch v1**: Browser tests

### Coverage Targets

- Unit tests: ≥80% business logic
- Feature tests: 100% API endpoints
- Browser tests: 12/12 user stories

### Artifacts Created

- `test-plan.md` - Comprehensive test plan with 30 test files

### Next Steps

1. `/speckit.tasks` - Generate dependency-ordered tasks with test tasks
2. Create feature branch `001-enhanced-bulk-actions`
3. Begin Phase 1 with TDD approach (write tests first)

---

## Session: Task Generation - 2025-12-21

### Task Structure

Generated `tasks.md` with TDD-driven task organization:

| Category | Count |
|----------|-------|
| Total Tasks | 125 |
| Setup Tasks | 3 |
| Foundation Tasks | 4 |
| User Story Tasks | 108 |
| Polish Tasks | 10 |
| Test Tasks (TDD) | ~50 |
| Parallel Opportunities | 12 |

### Phase Breakdown

1. **Phase 1: Setup** (T001-T003)
2. **Phase 2: Foundation** (T004-T007)
3. **Phase 3: US1 Selection Visibility** (T008-T015) - P1
4. **Phase 4: US8 Shift+Click** (T016-T022) - P2
5. **Phase 5: US9 Row Highlighting** (T023-T027) - P2
6. **Phase 6: US2 Dropdown Grouping** (T028-T034) - P2
7. **Phase 7: US4 Confirmation** (T035-T042) - P2
8. **Phase 8: US5 Quick Actions** (T043-T047) - P3
9. **Phase 9: Cross-Page Selection** (T048-T056) - P2
10. **Phase 10: US3 Bulk Tags** (T057-T076) - P2
11. **Phase 11: US7 Tag Filtering** (T077-T083) - P3
12. **Phase 12: US11 Sticky Header** (T084-T089) - P2
13. **Phase 13: US12 Sticky Columns** (T090-T094) - P3
14. **Phase 14: US10 Keyboard Shortcuts** (T095-T102) - P3
15. **Phase 15: US6 Undo** (T103-T115) - P3
16. **Final Phase: Polish** (T116-T125)

### TDD Approach

Every user story phase follows TDD pattern:
1. **Write tests FIRST** (unit, feature, browser as applicable)
2. **Implement code** to make tests pass
3. **Verify** by running test suite for that story

### MVP Scope

Phases 1-7 (T001-T042) deliver core functionality:
- Selection visibility
- Shift+click selection
- Row highlighting
- Dropdown grouping with categories
- Action confirmation dialogs

### Test Framework

- **Pest v3**: Unit and Feature tests
- **Dusk v8 / Nightwatch v1**: Browser tests

### Artifacts Created

- `tasks.md` - 125 dependency-ordered tasks with TDD structure

### Next Steps

1. `/trilogy.jira-sync` - Sync stories and tasks to Jira
2. `/speckit.implement` - Start development with TDD

---

## Future Sessions

_Add new session entries as work progresses_
