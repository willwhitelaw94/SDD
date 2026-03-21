---
title: "Idea Brief: Enhanced Bulk Actions (EBA)"
description: "Infrastructure > Enhanced Bulk Actions"
icon: i-heroicons-light-bulb
navigation:
  order: 1
---

**Epic Code**: EBA | **Created**: 2025-12-21

---

## Problem Statement (What)

Staff users performing bulk operations on table data lack clear visibility and efficient workflows for managing multiple items at once.

**Pain Points:**
- Selection count is not prominently visible — users can't confidently know how many items they've selected
- Bulk actions dropdown lacks visual hierarchy — difficult to find the right action quickly
- No shift+click range selection — tedious to select multiple consecutive rows
- No confirmation dialogs — risk of accidental bulk operations on large datasets
- No undo capability — mistakes are permanent
- Tag management requires item-by-item editing — no bulk add/remove tags
- Table headers scroll away — users lose context when viewing long tables

**Current State**: Basic bulk selection exists but lacks the UX patterns users expect from modern applications (Gmail, spreadsheets).

---

## Possible Solution (How)

Enhance the CommonTable bulk actions system with Gmail-style UX patterns:

- **Floating Action Bar**: Bottom-anchored bar appears on selection with count, clear, quick actions
- **Enhanced Dropdown**: Actions grouped by category (Tags, Export, Edit, Danger) with icons
- **Bulk Tag Management**: Add/Remove tags as standard actions on any taggable table
- **Confirmation Dialogs**: All bulk actions require confirmation showing action, count, consequences
- **Undo Capability**: Toast with "Undo" button for reversible actions (10-second window)
- **Selection Enhancements**: Shift+click range selection, Cmd/Ctrl+A, Escape to clear
- **Row Highlighting**: Teal tint on selected rows, visible during scroll
- **Sticky Headers**: Table header + key columns stay fixed during scroll

**Floating Bar Layout:**
```
┌─────────────────────────────────────────────────────────────────────────────┐
│  ✓ 12 selected  [Clear]  "Select all 847"  ─────  [Add Tags] [More ▾]  [✕]  │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Key Capabilities:**
- Cross-page selection up to 1000 items
- Backend-defined action categories and quick actions
- Leverages existing infrastructure: Spatie Tags, confirmation dialogs, toast system

---

## Benefits (Why)

**User/Client Experience:**
- Selection count visible within 1 second (no clicks required)
- Bulk action execution in 3 or fewer clicks (select → action → confirm)
- Standard UX patterns matching Gmail and spreadsheet expectations

**Operational Efficiency:**
- Bulk-add tags to 100 items in under 5 seconds
- Shift+click dramatically speeds up range selection
- Undo capability provides safety net for mistakes

**Business Value:**
- 100% of destructive actions require explicit confirmation — reduced errors
- Tag filtering enables powerful data organization workflows
- Consistent table behavior across all CommonTable instances

---

## Owner & Stakeholders

| Role | Person |
|------|--------|
| **R** | — |
| **A** | — |
| **C** | — |
| **I** | — |

---

## Assumptions, Dependencies & Risks

**Assumptions:**
- Gmail-style floating bar pattern is appropriate for Portal's table UX
- Existing tag system (Spatie) and confirmation dialogs can be extended
- Backend-defined action categories provide sufficient flexibility

**Dependencies:**
- Existing `CommonTable.vue` component and `actions.js` composable
- Existing `CommonConfirmDialog.vue` and `useConfirmDialog.ts`
- Existing `CommonToastContainer.vue` and `useToast.js`
- Existing tag components (`CommonTagGroup.vue`, `TagForm.vue`)
- InertiaUI Table (with built-in sticky header/columns support)

**Risks:**
- Performance with 1000 items (MEDIUM) → Chunk operations, use database transactions
- InertiaUI Table sticky conflicts (LOW) → Fallback to CSS-only solution if needed
- Undo data storage growth (LOW) → TTL on undo records (10 min), cleanup job

---

## Success Metrics

- Users can identify selection count within 1 second of selecting items
- Bulk action execution in 3 or fewer clicks
- 100% of destructive bulk actions require explicit confirmation
- Undo option available for at least 10 seconds after reversible action
- Bulk-add tags to 100 items in under 5 seconds
- Tag filter returns results in under 1 second for tables with 10,000+ rows

---

## Estimated Effort

**M (Medium) — 5 phases**

- **Phase 1**: Foundation — Selection visibility, shift+click, row highlighting, floating bar skeleton
- **Phase 2**: Floating Bar & Dropdown — Complete bar, grouped actions, confirmation flow
- **Phase 3**: Tag Management — Bulk Add/Remove Tags actions, tag selector component
- **Phase 4**: Sticky Table Features — Sticky header, sticky key columns
- **Phase 5**: Undo & Polish — Undo infrastructure, keyboard shortcuts, final polish

---

## Decision

- [ ] **Approved** — Proceed to specification
- [ ] **Needs More Information**
- [ ] **Declined**

---

## Next Steps (If Approved)

1. Spec and plan already drafted — review and finalize
2. Create feature branch `001-enhanced-bulk-actions`
3. Begin Phase 1 implementation

---

**Context:** Full spec and implementation plan available in `spec.md` and `plan.md`
