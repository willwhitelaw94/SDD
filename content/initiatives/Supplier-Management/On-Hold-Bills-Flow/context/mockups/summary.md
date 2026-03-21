# OHB Mockup Summary

**Epic**: TP-3787 On Hold Bills Flow
**Created**: 2026-01-16
**Status**: Ready for Review

---

## Recommendations Overview

| Component | Recommended Option | Confidence |
|-----------|-------------------|------------|
| Bill Edit Layout | **Option A**: Three-Panel IDE | High |
| Checklist Panel | **Option A**: Accordion Groups with Progress | High |
| Reason Modal | **Option A**: Detail Card with Actions | High |

---

## 1. Bill Edit Layout

### Recommendation: Option A - Three-Panel IDE Layout

**Why this works best:**
1. **Matches boss's vision** - IDE-style with collapsible panels
2. **Familiar pattern** - Similar to code editors, dashboards users already know
3. **Flexible** - Panels collapse on smaller screens, expand on dual monitors
4. **Non-disruptive** - Integrates into existing Bills/Edit.vue structure

**Trade-offs:**

| Option | Pros | Cons | Best For |
|--------|------|------|----------|
| **A: Three-Panel IDE** | Full context visible, familiar pattern | May feel crowded on small laptops | Primary recommendation |
| B: Two-Panel + Drawer | Cleaner main view | Extra click to see checklist | Users who prefer minimal UI |
| C: Header Banner | Quick status glance | Limited detail, feels cramped | Quick triage only |
| D: Split Screen | Equal emphasis | Loses bill canvas space | Side-by-side comparison |
| E: Tabbed Interface | Clean separation | Context switching required | Mobile-first (not our priority) |

---

## 2. Checklist Panel

### Recommendation: Option A - Accordion Groups with Progress

**Why this works best:**
1. **Traffic-light pattern** - BLOCKING/COMPLETE/WARNINGS clearly separated
2. **Progress visibility** - Users see completion % at a glance
3. **Scannable** - Collapsed sections reduce noise, expand on demand
4. **Existing components** - Uses CommonAccordion, CommonProgressBar, CommonIconBadge

**Trade-offs:**

| Option | Pros | Cons | Best For |
|--------|------|------|----------|
| **A: Accordion Groups** | Organized, scannable, matches vision | Requires clicks to expand | Primary recommendation |
| B: Compact List | Everything visible | Gets long, harder to scan | Few reasons only |
| C: Kanban Columns | Visual workflow | Takes horizontal space | Larger screens |
| D: Card Stack | Visual separation | Takes vertical space | Touch interfaces |
| E: Summary Badge + Drawer | Minimal footprint | Hides important info | Power users |
| F: Inline Actions | Quick resolution | Cluttered, no hierarchy | Experienced processors |

---

## 3. Reason Modal (Focused Reason View)

### Recommendation: Option A - Detail Card with Actions

**Why this works best:**
1. **All context in one view** - Status, department, diagnosed by, issue details
2. **Clear actions** - Mark Resolved / Mark Unresolved buttons prominent
3. **Notes captured** - Resolution notes field for audit trail
4. **Escape hatch** - "View Full Bill" for when more context needed
5. **Matches CommonModal** - Uses existing component patterns

**Trade-offs:**

| Option | Pros | Cons | Best For |
|--------|------|------|----------|
| **A: Detail Card** | Complete context, clear actions, notes | Fairly tall, may scroll | Primary recommendation |
| B: Two-Column | Efficient horizontal space | Complex layout, may feel cramped | Wide screens |
| C: Wizard Steps | Guided experience, good for training | More clicks, slower | New users, training |
| D: Quick Popover | Fast, minimal | Less context | Power users |
| E: Split View | Bill preview alongside | Large modal, may be overkill | Complex cases |

---

## Design Decisions Confirmed

Based on mockup analysis, these decisions are reinforced:

1. **IDE-style layout** with collapsible panels ✓
2. **Traffic-light checklist** (BLOCKING → COMPLETE → WARNINGS) ✓
3. **Focused Reason Modal** for task notifications ✓
4. **"View Full Bill" escape hatch** for holistic context ✓
5. **Resolution notes field** for audit trail ✓
6. **Polling with "Updated X ago" indicator** for real-time updates ✓

---

## Questions for Stakeholder Feedback

### Layout Questions
1. Should the left panel (Documents & Notes) be collapsed by default on all screens, or only on smaller screens?
2. Is the footer action bar position correct, or should primary actions be in the header?

### Checklist Questions
3. Should COMPLETE reasons be collapsed by default to reduce noise?
4. Do we need a "Collapse All" / "Expand All" toggle?
5. Should warnings be shown above or below complete items?

### Modal Questions
6. Is the "View Full Bill" link sufficient, or do we need a split-view option for complex cases?
7. Should resolution notes be required or optional?
8. Do we need a "Create Task" button in the modal for manual task assignment?

### General Questions
9. Should there be a "power user" mode with less chrome and faster actions?
10. Do we need keyboard shortcuts for common actions (mark resolved, next reason, etc.)?

---

## Component Mapping

### Existing Components (from Storybook)
- `CommonCollapsible` → Left/Right panel collapse
- `CommonAccordion` → Checklist groups
- `CommonBadge` → Status badges (Terminated, Verified, etc.)
- `CommonIconBadge` → Checklist item status icons
- `CommonModal` → Focused Reason View
- `CommonAlert` → Blocking reason callout
- `CommonButton` → Action buttons
- `CommonDefinitionList` → Reason details in modal
- `CommonDropdown` → Assign dropdown, reason actions
- `CommonEmptyPlaceholder` → No bill items state
- `CommonProgressBar` → Checklist completion %
- `CommonTooltip` → Hover explanations
- `CommonTimer` → "Updated 30s ago" indicator

### New Components Required
| Component | Purpose | Complexity |
|-----------|---------|------------|
| `BillChecklistPanel` | Container for traffic-light checklist | Medium |
| `BillReasonItem` | Single reason row in checklist | Low |
| `BillReasonModal` | Focused reason modal | Medium |

---

## Next Steps

1. **Review mockups** with stakeholders
2. **Answer open questions** above
3. **Run `/speckit.plan`** to create implementation plan
4. **Prioritize components** for phased delivery

---

## Files in This Directory

```
mockups/
├── bill-edit-layout-variations.txt   (5 options)
├── checklist-panel-variations.txt    (6 options)
├── reason-modal-variations.txt       (5 options)
└── summary.md                        (this file)
```
