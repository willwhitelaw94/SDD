---
title: "Scoped Service Picker - 7 Variations"
---


## Context
Service picker that:
- Shows only services within AI-suggested Tier 2 by default
- Has step-back navigation to widen scope
- Pre-selects AI-suggested Tier 3 items
- Warns when changing contribution category

---

## Option A: Simple Checkbox List with Step-Back Buttons

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ Select Services                                      Showing: Physiotherapy │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ☑ Physio assessment (AI Suggested)                                        │
│  ☑ Physio treatment session (AI Suggested)                                 │
│  ☐ Physio home visit                                                       │
│  ☐ Physio group session                                                    │
│  ☐ Physio follow-up                                                        │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│ [← Step back to Allied Health (45 items)]                                  │
│ [← Show ALL categories (156 items)]                                        │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Pros:** Simple, clear
**Cons:** Step-back at bottom might be missed

---

## Option B: Breadcrumb Navigation at Top (RECOMMENDED)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ ← Allied Health  ›  Physiotherapy (12 items)                    🔍 Search  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  AI SUGGESTED                                                               │
│  ────────────                                                               │
│  ☑ Physio assessment                                          ★ 92%       │
│  ☑ Physio treatment session                                   ★ 87%       │
│                                                                             │
│  OTHER OPTIONS                                                              │
│  ────────────                                                               │
│  ☐ Physio home visit                                                       │
│  ☐ Physio group session                                                    │
│  ☐ Physio follow-up                                                        │
│  ☐ Physio telehealth                                                       │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                             [Cancel]  [Confirm Selection]  │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Pros:** Breadcrumb at top is natural for navigation, separates AI from other
**Cons:** Slightly more complex

---

## Option C: Tabbed Category View

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ ┌────────────────┐ ┌─────────────────┐ ┌───────────────┐                   │
│ │ Physiotherapy  │ │ All Allied (45) │ │ All (156)     │                   │
│ │ (12 items) ✓   │ │                 │ │               │                   │
│ └────────────────┘ └─────────────────┘ └───────────────┘                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ☑ Physio assessment (AI Suggested)                                        │
│  ☑ Physio treatment session (AI Suggested)                                 │
│  ☐ Physio home visit                                                       │
│  ☐ Physio group session                                                    │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Pros:** Clear scope switching with tabs
**Cons:** Tabs might not scale if there are many tiers

---

## Option D: Hierarchical Tree View

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ Select Services                                                 🔍 Search  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ▼ 💪 Allied Health                                                        │
│    ▼ Physiotherapy (AI Suggested - 92%)                                    │
│      ☑ Physio assessment ★                                                 │
│      ☑ Physio treatment session ★                                          │
│      ☐ Physio home visit                                                   │
│      ☐ Physio group session                                                │
│    ▶ Occupational Therapy (8 items)                                        │
│    ▶ Speech Pathology (6 items)                                            │
│  ▶ 🏠 Personal Care (24 items)                                             │
│  ▶ 🏥 Health & Clinical (18 items)                                         │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Pros:** Shows full hierarchy, easy to browse all
**Cons:** More clicks to navigate, less focused

---

## Option E: Two-Panel Master-Detail

```
┌────────────────────────┬────────────────────────────────────────────────────┐
│ CATEGORIES             │ SERVICES IN: Physiotherapy                        │
├────────────────────────┼────────────────────────────────────────────────────┤
│                        │                                                    │
│  SUGGESTED (AI)        │  AI SUGGESTED                                     │
│  ─────────────         │  ☑ Physio assessment              ★ 92%          │
│  → Physiotherapy       │  ☑ Physio treatment session       ★ 87%          │
│                        │                                                    │
│  ALLIED HEALTH         │  OTHER OPTIONS                                    │
│  ─────────────         │  ☐ Physio home visit                              │
│  ○ Occupational Ther.  │  ☐ Physio group session                           │
│  ○ Speech Pathology    │  ☐ Physio follow-up                               │
│  ○ Podiatry            │  ☐ Physio telehealth                              │
│                        │                                                    │
│  ALL CATEGORIES        │                                                    │
│  ─────────────         │                                                    │
│  ○ Personal Care       │                                                    │
│  ○ Health & Clinical   │                                                    │
│                        │                                                    │
└────────────────────────┴────────────────────────────────────────────────────┘
```

**Pros:** Clear navigation, both category and services visible
**Cons:** Takes more horizontal space

---

## Option F: Dropdown with Inline Expansion

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ Category: [Physiotherapy                                              ▼]   │
│           └─ AI suggested with 92% confidence                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ☑ Physio assessment                                          AI Suggested │
│  ☑ Physio treatment session                                   AI Suggested │
│  ☐ Physio home visit                                                       │
│  ☐ Physio group session                                                    │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│ ⚠️ Changing category will affect contribution calculations                 │
│                                                                             │
│                                              [Cancel]  [Apply Selection]   │
└─────────────────────────────────────────────────────────────────────────────┘

        ↓ When dropdown opened ↓

┌─────────────────────────────────────────────────────────────────────────────┐
│ Category: [Physiotherapy                                              ▲]   │
│           ┌─────────────────────────────────────────────────────────────┐  │
│           │ SUGGESTED                                                   │  │
│           │ → Physiotherapy (92% confident)                             │  │
│           │                                                             │  │
│           │ ALLIED HEALTH                                               │  │
│           │   Occupational Therapy                                      │  │
│           │   Speech Pathology                                          │  │
│           │   Podiatry                                                  │  │
│           │                                                             │  │
│           │ OTHER CATEGORIES                                            │  │
│           │   Personal Care                                             │  │
│           │   Health & Clinical                                         │  │
│           │   Daily Living                                              │  │
│           └─────────────────────────────────────────────────────────────┘  │
```

**Pros:** Compact default, full options in dropdown
**Cons:** Two clicks to change category

---

## Option G: Search-First with Filters

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 🔍 Search services...                                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│ Filter: [Physiotherapy ×]  [Allied Health ×]  [+ Add filter]               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  AI SUGGESTED (2)                                                          │
│  ☑ Physio assessment                                           92%        │
│  ☑ Physio treatment session                                    87%        │
│                                                                             │
│  MATCHING (10 more)                                                        │
│  ☐ Physio home visit                                                       │
│  ☐ Physio group session                                                    │
│  ☐ Physio follow-up                                                        │
│  ...                                                                       │
│                                                                             │
│  [Show all 156 services]                                                   │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Pros:** Flexible, search-friendly for power users
**Cons:** More complex, filters might confuse

---

## Recommendation

**Option B (Breadcrumb Navigation at Top)** is recommended because:
- Breadcrumb at top is intuitive for "back" navigation
- Clearly separates AI-suggested from other options
- Search available but not required
- Shows confidence scores inline
- Consistent with overall breadcrumb pattern

**Option E (Two-Panel)** is good for complex scenarios where users frequently browse multiple categories.

---

## Contribution Category Warning

All options should include this warning when user selects from different category:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ ⚠️ CONTRIBUTION CATEGORY CHANGE                                            │
│                                                                             │
│ You're selecting from "Personal Care" which uses a different               │
│ contribution category than the AI-suggested "Allied Health".               │
│                                                                             │
│ Current: Allied Health (17.5% co-contribution)                             │
│ New: Personal Care (5% co-contribution)                                    │
│                                                                             │
│                                    [Keep Allied Health]  [Change to P.C.]  │
└─────────────────────────────────────────────────────────────────────────────┘
```
