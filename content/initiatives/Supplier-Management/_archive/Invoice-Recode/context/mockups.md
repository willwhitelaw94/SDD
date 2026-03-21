---
title: "UI Mockups: Invoice Line Item Recode Tool"
---


**Status**: Design Exploration Complete
**Created**: 2025-12-15
**Design Spec**: [design.md](design.md)

---

## Overview

This document contains 5-10 ASCII UI variation mockups for key components of the Invoice Recode Tool. Each variation explores different layout approaches, interaction patterns, and information density levels.

---

## 1. Main Page Layout - 5 Variations

### Option A: Sidebar Left + Full Width Table (RECOMMENDED)

```
┌────────────────────────────────────────────────────────────────────────────────┐
│  Invoice Recode Tool                                          [? Help] [Settings]│
├──────────────────────┬──────────────────────────────────────────────────────────┤
│  COMMON RULES        │  Filters: [Invoice] [Date Range] [Description] [Amount] │
│  (8 visible)         │          [Category ▼] [Clear Filters]                   │
│                      │                                                           │
│  ☐ Physio →          │  ┌───────────────────────────────────────────────────┐  │
│    Allied Health     │  │ ✓ Item 101  │ Physio eval      │ $150 │ Personal  │  │
│    12 items matched  │  │ ✓ Item 102  │ PT session       │ $200 │ Personal  │  │
│                      │  │ ✓ Item 103  │ Physical therapy │ $175 │ Personal  │  │
│  ☐ Items > $500      │  │   Item 104  │ Massage therapy  │ $100 │ Massage   │  │
│    → Review          │  │   Item 105  │ Consultant fee   │ $850 │ Services  │  │
│    0 items matched   │  │ ✓ Item 106  │ Physio treatment │ $200 │ Personal  │  │
│                      │  │   Item 107  │ Nursing visit    │ $300 │ Nursing   │  │
│  ☐ Uncategorized     │  │   [Load More]  (showing 50-100 items per page)      │  │
│    → Pending         │  │                                                       │  │
│    3 items matched   │  │ [Select All] [Deselect All]                         │  │
│                      │  │                                                       │  │
│  [View all rules →]  │  │ ✓ 4 items selected                                  │  │
│  [Search rules...]   │  │ [Recode Selected →]                                 │  │
│                      │  └───────────────────────────────────────────────────┘  │
│  ▲ ▼ ≡ (Reorder)     │                                                         │
│                      │  ┌─ Activity Log ──────────────────────────────────────┐ │
│                      │  │ • 12 items recoded by Sarah Chen (2:15 PM)         │ │
│                      │  │   Physio → Allied Health                           │ │
│                      │  │ • 5 items recoded by Mike Johnson (1:30 PM)        │ │
│                      │  │   Generic → Review                                 │ │
│                      │  │ [Expand History]                                   │ │
│                      │  └─────────────────────────────────────────────────────┘ │
└──────────────────────┴──────────────────────────────────────────────────────────┘

[Desktop: 1024px+]
- Fixed left sidebar (280px) with Common Rules
- Always-visible filter bar (60px) at top of table
- Main content table with sortable columns
- Activity log collapsible section below table
- Dense power-user interface
```

**Pros:**
- Sidebar always visible for quick rule access
- Maximum table width for data visibility
- Activity log integrated on same page
- Familiar layout pattern (used in many admin tools)

**Cons:**
- Takes up horizontal space on smaller screens
- Requires collapse/toggle on tablet

---

### Option B: Top Filter Bar + Tab Navigation

```
┌────────────────────────────────────────────────────────────────────────────────┐
│  Invoice Recode Tool                                          [? Help] [Settings]│
├────────────────────────────────────────────────────────────────────────────────┤
│ [Recode Items] [Common Rules] [Activity Log]                                   │
├────────────────────────────────────────────────────────────────────────────────┤
│ Filters:  [Invoice ID] [Date Range] [Description] [Amount] [Category ▼]      │
│           [Clear Filters]                                                       │
├────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  ┌──────────────────────────────────────────────────────────────────────────┐  │
│  │ ✓ Item 101 │ Physio eval    │ $150 │ Personal Care │ 2025-12-10       │  │
│  │ ✓ Item 102 │ PT session     │ $200 │ Personal Care │ 2025-12-10       │  │
│  │ ✓ Item 103 │ Physical thera │ $175 │ Personal Care │ 2025-12-10       │  │
│  │   Item 104 │ Massage        │ $100 │ Massage       │ 2025-12-09       │  │
│  │   Item 105 │ Consultant fee │ $850 │ Services      │ 2025-12-09       │  │
│  │ ✓ Item 106 │ Physio treat.  │ $200 │ Personal Care │ 2025-12-10       │  │
│  │   Item 107 │ Nursing visit  │ $300 │ Nursing       │ 2025-12-08       │  │
│  │   Item 108 │ Cleaning       │ $95  │ Domestic      │ 2025-12-10       │  │
│  │ [Load More]                                                               │  │
│  │                                                                            │  │
│  │ [Select All] [Deselect All]  ✓ 4 items selected  [Recode Selected →]   │  │
│  └──────────────────────────────────────────────────────────────────────────┘  │
│                                                                                  │
│  ┌─ COMMON RULES (Quick Access) ──────────────────────────────────────────────┐ │
│  │  ☐ Physio → Allied Health (12 items)                                      │ │
│  │  ☐ Items > $500 → Review (0 items)                                        │ │
│  │  ☐ Uncategorized → Pending (3 items)                                      │ │
│  │  [Browse all 47 rules...]                                                 │ │
│  └────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                  │
└────────────────────────────────────────────────────────────────────────────────┘

[Tab-based navigation - easily switch between views]
```

**Pros:**
- More screen space for table
- Tab navigation clear for role switching (Recode/Rules/Activity Log)
- Easier responsive redesign for tablet
- Rules available as collapsible section

**Cons:**
- Rules less prominent (below the fold)
- Requires scrolling back up to access rules
- More clicks to switch contexts

---

### Option C: Compact Header + Overlay Rules Panel

```
┌────────────────────────────────────────────────────────────────────────────────┐
│ Invoice Recode Tool  [Filters ▼] [Common Rules ≡] [Help ?]    [Activity Log] │
├────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  ┌──────────────────────────────────────────────────────────────────────────┐  │
│  │  Item   Description        Amount  Category        Date       Supplier    │  │
│  ├──────────────────────────────────────────────────────────────────────────┤  │
│  │ ☑101  Physio eval         $150    Personal Care   2025-12-10 ABC Corp   │  │
│  │ ☑102  PT session          $200    Personal Care   2025-12-10 ABC Corp   │  │
│  │ ☑103  Physical therapy    $175    Personal Care   2025-12-10 ABC Corp   │  │
│  │ 104   Massage therapy     $100    Massage         2025-12-09 Wellness   │  │
│  │ 105   Consultant fee      $850    Services        2025-12-09 Services Inc│  │
│  │ ☑106  Physio treatment    $200    Personal Care   2025-12-10 ABC Corp   │  │
│  │ 107   Nursing visit       $300    Nursing         2025-12-08 CarePlus   │  │
│  │ [Load More...]                                                            │  │
│  │                                                                            │  │
│  │ 4 items selected                               [Recode Selected →]        │  │
│  └──────────────────────────────────────────────────────────────────────────┘  │
│                                                                                  │
│  [Filter Panel]                [Common Rules Panel]              [Activity Log] │
│  ┌─────────────────┐           ┌──────────────────┐            ┌────────────┐ │
│  │ Invoice: [____] │           │ Physio → Allied  │            │ Recent:    │ │
│  │ Date: [__-__]   │           │ (12 items)       │            │ • 12 items │ │
│  │ Amount: __ to __ │          │ □ Items > $500   │            │   recoded  │ │
│  │ Category: [  ▼] │          │ (0 items)        │            │ • 5 items  │ │
│  │                 │           │ □ Uncategorized  │            │   recoded  │ │
│  │ [Apply]         │           │ (3 items)        │            │            │ │
│  └─────────────────┘           │ [View all 47]    │            └────────────┘ │
│                                └──────────────────┘                            │
│                                                                                  │
└────────────────────────────────────────────────────────────────────────────────┘

[Icon-based header with overlay panels for filters, rules, activity]
```

**Pros:**
- Very compact header
- Maximum table visibility
- All controls accessible via dropdowns/overlays
- Modern drawer pattern

**Cons:**
- Rules less discoverable
- Multiple layers of UI (overlays can be confusing)
- Requires more clicks to access rules

---

### Option D: Horizontal Layout (Top Sidebar)

```
┌────────────────────────────────────────────────────────────────────────────────┐
│  Invoice Recode Tool                                                            │
├────────────────────────────────────────────────────────────────────────────────┤
│  Common Rules (Horizontal):                                                     │
│  ☐ Physio → Allied Health (12) │ ☐ Items >$500 → Review (0) │ ☐ Uncategorized │
│  (3) │ [View all 47 rules...] │ [Search...]                                   │
├────────────────────────────────────────────────────────────────────────────────┤
│  Filters: [Invoice] [Date] [Description] [Amount] [Category ▼]               │
├────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  ┌──────────────────────────────────────────────────────────────────────────┐  │
│  │ ✓ Item 101 │ Physio eval      │ $150 │ Personal Care │ 2025-12-10      │  │
│  │ ✓ Item 102 │ PT session       │ $200 │ Personal Care │ 2025-12-10      │  │
│  │ ✓ Item 103 │ Physical therapy │ $175 │ Personal Care │ 2025-12-10      │  │
│  │   Item 104 │ Massage therapy  │ $100 │ Massage       │ 2025-12-09      │  │
│  │   Item 105 │ Consultant fee   │ $850 │ Services      │ 2025-12-09      │  │
│  │ ✓ Item 106 │ Physio treatment │ $200 │ Personal Care │ 2025-12-10      │  │
│  │   Item 107 │ Nursing visit    │ $300 │ Nursing       │ 2025-12-08      │  │
│  │ [Load More...]                                                             │  │
│  │                                                                             │  │
│  │ [Select All] [Deselect All]  4 items selected  [Recode Selected →]        │  │
│  └──────────────────────────────────────────────────────────────────────────┘  │
│                                                                                  │
│  Activity Log: • 12 items recoded by Sarah Chen (2:15 PM) • 5 items recoded  │
│  [Expand...]                                                                    │
│                                                                                  │
└────────────────────────────────────────────────────────────────────────────────┘

[Horizontal rules bar - all rules visible at a glance]
```

**Pros:**
- All rules visible at once
- Full width for table
- High information density
- Rules presented as bar buttons

**Cons:**
- Rules truncated if more than fit
- Limited space for rule descriptions
- Horizontal scrolling needed for many rules

---

### Option E: Stacked Compact (Mobile-First Consideration)

```
┌────────────────────────────────────────────────────────────────────────────────┐
│  Invoice Recode Tool                    [Menu ≡]                               │
├────────────────────────────────────────────────────────────────────────────────┤
│  Quick Filters:  [Invoice ▼] [Date ▼] [Category ▼]                           │
├────────────────────────────────────────────────────────────────────────────────┤
│  Common Rules (Collapsible):                                                    │
│  ▼ Rules (showing 3 of 47)                                                     │
│    • Physio → Allied Health (12 items)                                         │
│    • Items > $500 → Review (0 items)                                           │
│    • Uncategorized → Pending (3 items)                                         │
│    [View all 47 rules →]                                                       │
├────────────────────────────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────────────────────────────────┐  │
│  │ Item 101: Physio eval | $150 | Personal Care | 2025-12-10              │  │
│  │ ☑ Select                                                                │  │
│  ├──────────────────────────────────────────────────────────────────────────┤  │
│  │ Item 102: PT session | $200 | Personal Care | 2025-12-10               │  │
│  │ ☑ Select                                                                │  │
│  ├──────────────────────────────────────────────────────────────────────────┤  │
│  │ Item 103: Physical therapy | $175 | Personal Care | 2025-12-10         │  │
│  │ ☑ Select                                                                │  │
│  ├──────────────────────────────────────────────────────────────────────────┤  │
│  │ [Load More...]                                                           │  │
│  └──────────────────────────────────────────────────────────────────────────┘  │
│                                                                                  │
│  [Select All] [Deselect All]  ✓ 4 items selected  [Recode Selected →]        │  │
│                                                                                  │
└────────────────────────────────────────────────────────────────────────────────┘

[Card-based layout - responsive and scannable]
```

**Pros:**
- Responsive/mobile-friendly
- Collapsible sections reduce clutter
- Clear card-based layout
- Easy to scan

**Cons:**
- Less horizontal density
- Rules collapsed by default (less discoverable)
- Vertical scroll fatigue with many items

---

## Recommendation: Option A (Sidebar Left + Full Width Table)

**Why**: Matches design.md exactly, maximizes power-user efficiency, keeps sidebar always visible for rule access, and maintains clear workflow (filter → select → recode).

**Trade-off for Tablets**: Collapse sidebar to hamburger menu icon and use tab layout for smaller screens.

---

## 2. Common Rules Sidebar - 4 Variations

### Option A: Vertical List with Drag Indicators (RECOMMENDED)

```
┌──────────────────────┐
│  COMMON RULES        │
│  (8 visible + all)   │
├──────────────────────┤
│                      │
│ ≡ ☐ Physio →         │
│   Allied Health      │
│   ↳ 12 items matched │
│                      │
│ ≡ ☐ Items > $500     │
│   → Review           │
│   ↳ 0 items matched  │
│                      │
│ ≡ ☐ Uncategorized    │
│   → Pending          │
│   ↳ 3 items matched  │
│                      │
│ ≡ ☐ Nursing Visits   │
│   → Allied Health    │
│   ↳ 8 items matched  │
│                      │
│ ≡ ☐ Items < $50      │
│   → Other            │
│   ↳ 15 items matched │
│                      │
│ ≡ ☐ [Grandcare...]   │
│   → Respite Care     │
│   ↳ 2 items matched  │
│                      │
│ ≡ ☐ [Occupational... │
│   → Allied Health    │
│   ↳ 5 items matched  │
│                      │
│ ≡ ☐ [Meal Prep]      │
│   → Domestic         │
│   ↳ 7 items matched  │
│                      │
│ [View all 47 rules] │
│ [Search rules...]   │
│                      │
│ ▲ ▼ ≡ Reorder tools  │
│                      │
└──────────────────────┘

[Click rule to apply, drag ≡ to reorder]
```

**Pros:**
- Drag indicators clear
- Rule names readable
- Item counts visible
- Reorder controls obvious

**Cons:**
- Vertical space required for 8 items
- Text might truncate on narrow sidebar

---

### Option B: Compact Buttons with Visual Badges

```
┌──────────────────────┐
│  COMMON RULES        │
├──────────────────────┤
│                      │
│ [Physio] ●12         │
│ [>$500]  ◯0          │
│ [Uncategorized] ●3   │
│ [Nursing] ●8         │
│ [<$50]   ●15         │
│ [Grandcare] ●2       │
│ [Occupational] ●5    │
│ [Meal Prep] ●7       │
│                      │
│ ● = rule matches    │
│ ◯ = no matches     │
│                      │
│ [Browse All 47]      │
│ [Search]             │
│                      │
│ ▲ ▼ Reorder          │
│                      │
└──────────────────────┘

[Click button to apply rule]
```

**Pros:**
- Very compact
- Filled/empty badges show match status
- Button-like affordance clear
- More rules visible

**Cons:**
- Rule names abbreviated
- Target category not visible
- Less descriptive

---

### Option C: Card Layout with Reordering UI

```
┌──────────────────────┐
│  COMMON RULES        │
├──────────────────────┤
│                      │
│ ┌────────────────┐   │
│ │ ⟳ Physio       │   │
│ │   → Allied H.  │   │
│ │ ✓ 12 items     │   │
│ └────────────────┘   │
│                      │
│ ┌────────────────┐   │
│ │ ⟳ Items > $500 │   │
│ │   → Review     │   │
│ │ ✗ 0 items      │   │
│ └────────────────┘   │
│                      │
│ ┌────────────────┐   │
│ │ ⟳ Uncategorized│   │
│ │   → Pending    │   │
│ │ ✓ 3 items      │   │
│ └────────────────┘   │
│                      │
│ ┌────────────────┐   │
│ │ ⟳ Nursing      │   │
│ │   → Allied H.  │   │
│ │ ✓ 8 items      │   │
│ └────────────────┘   │
│                      │
│ [+] Add more rules   │
│                      │
└──────────────────────┘

[Reorder icon (⟳) on hover; click card to apply]
```

**Pros:**
- Card design feels modern
- Reorder icon on hover
- Target category visible
- Match status via checkmark

**Cons:**
- Larger footprint (cards take space)
- Fewer visible at once
- More complex interaction (hover state needed)

---

### Option D: Searchable List with Recent Priority

```
┌──────────────────────┐
│  COMMON RULES        │
│ [Search rules...]    │
├──────────────────────┤
│                      │
│ ★ RECENTLY USED:     │
│ ☐ Physio →           │
│   Allied Health (12) │
│ ☐ Items > $500       │
│   → Review (0)       │
│                      │
│ ★ OTHER RULES:       │
│ ☐ Uncategorized →    │
│   Pending (3)        │
│ ☐ Nursing → Allied   │
│   Health (8)         │
│ ☐ Items < $50 →      │
│   Other (15)         │
│                      │
│ [View all 47 →]      │
│                      │
└──────────────────────┘

[Search filters list as you type]
```

**Pros:**
- Search available for 47+ rules
- Recently used highlighted
- Familiar pattern
- Reduced cognitive load

**Cons:**
- More complex with search
- Two sections (recently + other) adds complexity

---

## Recommendation: Option A (Vertical List with Drag Indicators)

**Why**: Matches design.md, drag handles are discoverable, item counts clear, reorder obvious via ▲ ▼ controls.

---

## 3. Recoding Confirmation Modal - 4 Variations

### Option A: Full Preview Table (RECOMMENDED)

```
┌────────────────────────────────────────────────────────────────────┐
│  Confirm Recoding                                            [×]    │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  Recode 12 items from Personal Care → Allied Health               │
│                                                                    │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │ Item   Description          Current         New            │ │
│  ├─────────────────────────────────────────────────────────────┤ │
│  │ 101    Physio eval          Personal Care → Allied Health   │ │
│  │ 102    PT session           Personal Care → Allied Health   │ │
│  │ 103    Physical therapy     Personal Care → Allied Health   │ │
│  │ 106    Physio treatment     Personal Care → Allied Health   │ │
│  │ 115    Physio assessment    Personal Care → Allied Health   │ │
│  │ 118    Physical therapy     Personal Care → Allied Health   │ │
│  │ 121    Physio session       Personal Care → Allied Health   │ │
│  │ 124    PT eval follow-up    Personal Care → Allied Health   │ │
│  │ 127    Physio treatment     Personal Care → Allied Health   │ │
│  │ 130    Physical therapy     Personal Care → Allied Health   │ │
│  │ 133    Physio session       Personal Care → Allied Health   │ │
│  │ 136    PT assessment        Personal Care → Allied Health   │ │
│  │ [Scroll to see more]                                       │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                    │
│  ⚠ Warning: 1 item (#145) was deleted after selection            │
│    and will be skipped.                                           │ │
│                                                                    │
│  □ I understand there is no undo after confirmation              │
│                                                                    │
│                            [Cancel]  [Recode →]                  │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘

[Full table with before/after - clear commitment]
```

**Pros:**
- Complete transparency
- User can verify all items
- Warnings visible (deleted items)
- Scrollable for many items

**Cons:**
- Large modal for many items
- Takes up screen space

---

### Option B: Summary Card View

```
┌────────────────────────────────────────────────────────────────────┐
│  Confirm Bulk Recoding                                      [×]    │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │                                                               │ │
│  │  FROM: Personal Care         TO: Allied Health               │ │
│  │         (current category)       (new category)              │ │
│  │                                                               │ │
│  │  ✓ 12 items will be recoded                                  │ │
│  │  ⚠ 1 item will be skipped (deleted)                          │ │
│  │                                                               │ │
│  │  Applied by: Physio → Allied Health rule                     │ │
│  │                                                               │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                                                                    │
│  [Show detailed preview ▼]                                        │ │
│                                                                    │
│  ⚠ This action cannot be undone. You can view the activity log   │
│    to verify the change.                                          │
│                                                                    │
│  □ I understand and want to proceed                              │
│                                                                    │
│                            [Cancel]  [Confirm Recoding →]        │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘

[Summary view - expandable for details]
```

**Pros:**
- Compact modal
- Summary clear
- Expandable details available
- Less overwhelming

**Cons:**
- Must expand to see full list
- Extra interaction required

---

### Option C: Steps/Wizard Flow

```
┌────────────────────────────────────────────────────────────────────┐
│  Bulk Recode Wizard                                         [×]    │
├────────────────────────────────────────────────────────────────────┤
│  Step 2 of 2: Review & Confirm                                    │
│  ●───────●                                                         │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  FROM:  Personal Care                                             │
│         ■■■■■■■■■■ (10 items already in this category)          │
│         ↓                                                          │
│  TO:    Allied Health                                             │
│         ░░░░░░░░░░ (will add 12 items here)                      │
│                                                                    │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │ Items affected:                                               │ │
│  │ • Physio eval                                                 │ │
│  │ • PT session                                                  │ │
│  │ • Physical therapy (5 more)                                   │ │
│  │ [Expand full list ▼]                                         │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                                                                    │
│  Risk Indicators:                                                  │ │
│  ✓ All items verified as existing                                 │
│  ⚠ 1 item flagged for review (very high amount)                   │
│                                                                    │
│  [← Back]                             [Confirm & Complete →]      │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘

[Wizard with flow and visual progress indicators]
```

**Pros:**
- Clear step progression
- Visual category representation
- Risk indicators included
- Feels guided and safe

**Cons:**
- More steps/clicks
- Larger footprint
- May feel over-engineered

---

### Option D: Minimal with Link to Details

```
┌────────────────────────────────────────────────────────────────────┐
│  Confirm Recoding                                            [×]   │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  Recode 12 items to Allied Health                                 │
│                                                                    │
│  [View affected items ↗]  [Show warnings ⚠]                      │
│                                                                    │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │ ⚠ No undo available after confirmation.                       │ │
│  │ ℹ Audit trail will be recorded in activity log.              │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                                                                    │
│  □ I confirm this action                                          │
│                                                                    │
│                            [Cancel]  [Recode →]                  │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘

[Minimal - link out for details in separate view]
```

**Pros:**
- Very compact
- Links provide access to details if needed
- Minimal cognitive load
- Fast confirmation flow

**Cons:**
- Users might miss important details
- Details in separate view breaks workflow

---

## Recommendation: Option A (Full Preview Table)

**Why**: Design-spec.md specifies "Full preview table" with before/after columns. Transparency builds user confidence and prevents mistakes.

---

## 4. Filter Bar - 3 Variations

### Option A: Horizontal Always-Visible (RECOMMENDED)

```
┌────────────────────────────────────────────────────────────────────────────────┐
│ Filters: [Invoice ID ___] [Date 📅 __ to __] [Description _______] [Amount __] │
│          [Category ▼] [Clear all]                                              │
└────────────────────────────────────────────────────────────────────────────────┘

[Stays at top of table as users scroll - always visible]
```

**Pros:**
- Answers design-spec requirement (always-visible)
- Quick filter access without scrolling
- Space-efficient
- Clear layout

**Cons:**
- Takes vertical space
- Crowded with many filters
- May need wrapping on smaller screens

---

### Option B: Collapsible Filter Panel

```
┌────────────────────────────────────────────────────────────────────────────────┐
│ [Filters ↓ (3 active)]                                             [Clear all] │
├────────────────────────────────────────────────────────────────────────────────┤
│ Invoice ID: [________________]  Date Range: [📅 __ to __]                     │
│ Description: [________________]  Amount: [From __] [To __]                     │
│ Category: [▼ Allied Health  ] [▼ Personal Care]                               │
│                                                                                  │
│ [Apply Filters]                                                                 │
└────────────────────────────────────────────────────────────────────────────────┘

[Expands when clicked - shows all filters at once]
```

**Pros:**
- Saves vertical space when collapsed
- All filters accessible
- Familiar pattern

**Cons:**
- Loses "always-visible" design requirement
- Requires click to access
- Hides active filters

---

### Option C: Sticky Pill-Based Tags

```
┌────────────────────────────────────────────────────────────────────────────────┐
│ Active Filters: [Invoice: INV-123 ×] [Date: 12/10-12/15 ×] [Category: Allied ×]│
│ [Add Filter ⊕] [Clear All]                                                     │
└────────────────────────────────────────────────────────────────────────────────┘

[Sticky bar - shows only active filters + add button]
```

**Pros:**
- Very compact
- Shows active filters at a glance
- Easy to remove individual filters
- Stays visible

**Cons:**
- Doesn't show available filters
- Must click "Add Filter" to see options
- Requires more interaction

---

## Recommendation: Option A (Horizontal Always-Visible)

**Why**: Design-spec Q4 answer: "Always Visible Filter Bar" - stays visible as users scroll for instant access to filtering controls.

---

## 5. Empty States & First-Time UX - 3 Variations

### Option A: Contextual Help & Guided (RECOMMENDED)

```
┌────────────────────────────────────────────────────────────────────────────────┐
│  Invoice Recode Tool                                          [? Help]         │
├──────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  ┌────────────────────────────────────────────────────────────────────────────┐ │
│  │                                                                              │ │
│  │  🎯 Welcome to Invoice Recode Tool                                          │ │
│  │                                                                              │ │
│  │  Three ways to bulk-recode items:                                           │ │
│  │                                                                              │ │
│  │  1️⃣  COMMON RULES (Left Sidebar)                                            │ │
│  │     Click a pre-built rule to auto-select matching items.                   │ │
│  │     Example: "Physio → Allied Health" matches items with "Physio" in desc.  │ │
│  │                                                                              │ │
│  │  2️⃣  MANUAL SELECT (Checkboxes)                                             │ │
│  │     Scroll through items, check the ones you want to recode.                │ │
│  │     Use filters (top bar) to narrow down your view.                         │ │
│  │                                                                              │ │
│  │  3️⃣  BULK RECODE (Selection Toolbar)                                        │ │
│  │     Once items are selected, click "Recode Selected" to confirm.            │ │
│  │     Review the changes in the modal, then submit.                           │ │
│  │                                                                              │ │
│  │  ⚠ Important: All recoding is atomic. If any item fails, the entire         │ │
│  │    operation rolls back and you can try again.                              │ │
│  │                                                                              │ │
│  │  📋 Pro Tips:                                                                │ │
│  │  • Use filters to narrow items by Invoice ID, Date, or Amount               │ │
│  │  • Sort by Amount to spot outliers ($10k items, etc.)                       │ │
│  │  • Activity log tracks all recode operations for audit                      │ │
│  │                                                                              │ │
│  │  Ready to start? Click on a rule or filter to see line items.               │ │
│  │                                                                              │ │
│  └────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                  │
│  [OK, I understand] [Show tips next time] [Don't show again]                   │
│                                                                                  │
└────────────────────────────────────────────────────────────────────────────────┘

[First-time overlay with step-by-step guidance]
```

**Pros:**
- Answers design-spec Q5 requirement
- Contextual and educational
- Clear action steps (1, 2, 3)
- Can be dismissed or repeated
- Pro tips build power-user habits

**Cons:**
- Takes up screen space
- Users must dismiss it

---

### Option B: Inline Tips & Collapsible Tooltips

```
┌────────────────────────────────────────────────────────────────────────────────┐
│  Invoice Recode Tool                                          [? Help]         │
├──────────────────────────────────────────────────────────────────────────────────┤
│  COMMON RULES [?]                                                               │
│  ▼ Pro Tip: Click a rule to auto-select matching items                          │
│                                                                                  │
│  ☐ Physio → Allied Health (12 items matched) [?]                               │
│  ☐ Items > $500 → Review (0 items) [?]                                         │
│  ☐ Uncategorized → Pending (3 items) [?]                                       │
│                                                                                  │
│  [Recode Selected] [?] ← Help on this button                                   │
│                                                                                  │
│  ┌──────────────────────────────────────────────────────────────────────────┐  │
│  │ No items to display. Load invoices or adjust filters to get started.    │  │
│  └──────────────────────────────────────────────────────────────────────────┘  │
│                                                                                  │
│  💡 Hint: Try importing an invoice or clearing filters to see items             │
│                                                                                  │
└────────────────────────────────────────────────────────────────────────────────┘

[Collapsible help text + ? icons for contextual tooltips]
```

**Pros:**
- Non-intrusive
- Help available on demand
- Distributed throughout interface
- Doesn't block workflow

**Cons:**
- Users might miss tips
- Requires hovering over ? icons
- Scattered help content

---

### Option C: Minimal Empty State + Help Link

```
┌────────────────────────────────────────────────────────────────────────────────┐
│  Invoice Recode Tool                                          [Learn More >]   │
├──────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  ┌────────────────────────────────────────────────────────────────────────────┐ │
│  │                                                                              │ │
│  │                                                                              │ │
│  │                   No line items to recode yet.                              │ │
│  │                                                                              │ │
│  │              Import an invoice or use filters to get started.                │ │
│  │                                                                              │ │
│  │                      [Browse Invoices >]                                     │ │
│  │                                                                              │ │
│  │                                                                              │ │
│  └────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                  │
└────────────────────────────────────────────────────────────────────────────────┘

[Minimal - single call-to-action]
```

**Pros:**
- Clean, uncluttered
- Directs to next action
- Non-overwhelming

**Cons:**
- Doesn't teach workflow
- Users unclear on how to use tool
- Help is external (not in-app)

---

## Recommendation: Option A (Contextual Help & Guided)

**Why**: Answers design-spec Q5 requirement exactly: "Contextual Help & Guided First Step" with detailed guidance, collapsible tooltips, and optional one-time onboarding.

---

## 6. Selection Toolbar - 2 Variations

### Option A: Floating Toolbar (RECOMMENDED)

```
┌────────────────────────────────────────────────────────────────────────────────┐
│                                                                                  │
│  ┌────────────────────────────────────────────────────────────────────────────┐ │
│  │ ✓ Item 101 │ Physio eval      │ $150 │ Personal Care │ 2025-12-10         │ │
│  │ ✓ Item 102 │ PT session       │ $200 │ Personal Care │ 2025-12-10         │ │
│  │                                                                               │ │
│  │ ╔════════════════════════════════════════════════════════════════════════╗ │ │
│  │ ║  4 items selected                    [Select All] [Clear] [Recode →]  ║ │ │
│  │ ╚════════════════════════════════════════════════════════════════════════╝ │ │
│  │                                                                               │ │
│  │   Item 103 │ Physical therapy │ $175 │ Personal Care │ 2025-12-10         │ │
│  │   Item 104 │ Massage therapy  │ $100 │ Massage       │ 2025-12-09         │ │
│  │                                                                               │ │
│  └────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                  │
└────────────────────────────────────────────────────────────────────────────────┘

[Sticky toolbar appears above/below visible table rows when items selected]
```

**Pros:**
- Visible at all times
- Clear count of selected items
- Quick access to Select All/Recode
- Floating design keeps focus on selection

**Cons:**
- Covers some table content
- Requires CSS/JS positioning

---

### Option B: Bottom Action Bar

```
┌────────────────────────────────────────────────────────────────────────────────┐
│  ┌──────────────────────────────────────────────────────────────────────────┐  │
│  │ ✓ Item 101 │ Physio eval      │ $150 │ Personal Care │ 2025-12-10       │  │
│  │ ✓ Item 102 │ PT session       │ $200 │ Personal Care │ 2025-12-10       │  │
│  │   Item 103 │ Physical therapy │ $175 │ Personal Care │ 2025-12-10       │  │
│  │   Item 104 │ Massage therapy  │ $100 │ Massage       │ 2025-12-09       │  │
│  └──────────────────────────────────────────────────────────────────────────┘  │
│                                                                                  │
├────────────────────────────────────────────────────────────────────────────────┤
│ [Select All] [Deselect All]       4 items selected         [Recode Selected →] │
└────────────────────────────────────────────────────────────────────────────────┘

[Fixed action bar at bottom of table]
```

**Pros:**
- Doesn't cover table content
- Fixed position stays visible on scroll
- Clear separation from data
- Traditional pattern

**Cons:**
- Takes vertical space
- May require scrolling to see on mobile

---

## Recommendation: Option A (Floating Toolbar)

**Why**: Appears only when items selected (not always visible), floats above table rows, keeps focus on selection count and clear CTA.

---

## 7. Activity Log Panel - 2 Variations

### Option A: Collapsible Section (RECOMMENDED)

```
┌────────────────────────────────────────────────────────────────────────────────┐
│                                                                                  │
│  ▼ Activity Log (Recent Recoding Actions)                                      │
│  ┌──────────────────────────────────────────────────────────────────────────┐  │
│  │ • Sarah Chen - 2:15 PM (5 min ago)                                       │  │
│  │   Recoded 12 items from Personal Care → Allied Health                    │  │
│  │   Rule: Physio descriptions → Allied Health                              │  │
│  │                                                                             │  │
│  │ • Mike Johnson - 1:30 PM (45 min ago)                                    │  │
│  │   Recoded 5 items from Generic → Review                                  │  │
│  │   Manual selection (no rule)                                              │  │
│  │                                                                             │  │
│  │ • Jennifer Lee - 12:45 PM (today)                                        │  │
│  │   Recoded 8 items from Uncategorized → Pending                           │  │
│  │   Rule: Uncategorized items → Pending                                    │  │
│  │                                                                             │  │
│  │ [View full history →]                                                     │  │
│  └──────────────────────────────────────────────────────────────────────────┘  │
│                                                                                  │
└────────────────────────────────────────────────────────────────────────────────┘

[Collapsible panel - expandable to show more history]
```

**Pros:**
- Compact when collapsed
- Expandable for full history
- Shows recent actions at a glance
- Timestamp helps users track changes

**Cons:**
- Requires click to expand

---

### Option B: Sidebar Panel (Always Open)

```
┌────────────────────────┬──────────────────────────────────┐
│                        │  Activity Log                    │
│                        │                                  │
│                        │  Recent Recodes:                 │
│  [Main Content]        │                                  │
│                        │  ● 2:15 PM - Sarah Chen          │
│                        │    12 items: Personal Care →     │
│                        │    Allied Health                 │
│                        │                                  │
│                        │  ● 1:30 PM - Mike Johnson        │
│                        │    5 items: Generic → Review     │
│                        │                                  │
│                        │  ● 12:45 PM - Jennifer Lee       │
│                        │    8 items: Uncategorized →      │
│                        │    Pending                       │
│                        │                                  │
│                        │  [Show more]                     │
│                        │                                  │
└────────────────────────┴──────────────────────────────────┘

[Right sidebar - always visible in desktop view]
```

**Pros:**
- Always visible
- Immediate verification of action
- Familiar sidebar pattern

**Cons:**
- Takes horizontal space
- Responsive redesign needed for tablet

---

## Recommendation: Option A (Collapsible Section)

**Why**: Design-spec mentions "Activity log panel on same page (collapsible sidebar or expandable section)" - collapsible section saves space while keeping history accessible.

---

## Summary & Implementation Roadmap

### Recommended Mockup Selections

| Component | Variation | Reason |
|-----------|-----------|--------|
| **Main Layout** | Option A (Sidebar Left) | Matches design-spec exactly; power-user density |
| **Common Rules Sidebar** | Option A (Vertical List) | Drag indicators clear; reordering obvious |
| **Confirmation Modal** | Option A (Full Preview Table) | Full transparency; before/after visible |
| **Filter Bar** | Option A (Always-Visible) | Answers design-spec Q4 requirement |
| **Empty State** | Option A (Contextual Help) | Answers design-spec Q5 requirement |
| **Selection Toolbar** | Option A (Floating Toolbar) | Only shows when needed; non-intrusive |
| **Activity Log** | Option A (Collapsible Section) | Saves space; history accessible |

### Next Steps

1. **Design Review**: Stakeholder feedback on selected mockups (Will - Product, Tim - Engineering)
2. **Responsive Design**: Plan tablet/mobile adaptations (hamburger menu, stacked layout)
3. **Accessibility Audit**: WCAG AA keyboard nav, focus management, screen reader announcements
4. **Component Implementation**: Begin building Vue components per tasks.md
5. **User Testing** (Optional): Validate workflow with actual care coordinators

### Design Decisions Locked

- Layout: Sidebar left (desktop) + hamburger (tablet)
- Rules: 8-10 visible + searchable browser for 50+
- Confirmation: Full preview table with before/after
- Filters: Always-visible bar at top of table
- Empty State: Guided onboarding with step-by-step tips
- Activity Log: Collapsible section for audit trail
- No Undo: Explicit design decision; activity log provides audit trail

---

## Files Created

- **mockups.md** - This document (UI variations and rationale)
- Design follows: [design.md](design.md)
- Implementation plan: [plan.md](plan.md)
- Tasks: [tasks.md](tasks.md)
- Specification: [spec.md](spec.md)
