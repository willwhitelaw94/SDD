---
title: "AI Classification Breadcrumb - 8 Variations"
---


## Context
The breadcrumb displays above each line item showing:
- Tier 1 (Co-Contribution Category) with icon and color
- Tier 2 (SERG/Service Type)
- Confidence percentage with color coding
- Expandable for reasoning

---

## Option A: Compact Inline Badge Style

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 🏠 Independence › Personal Care                              92% ✓   ▼     │
└─────────────────────────────────────────────────────────────────────────────┘
│ Physio assessment home visit - 1hr     │ $165.00 │ 15/12/2024 │ [Edit] [×] │
```

**Pros:** Minimal vertical space, familiar badge pattern
**Cons:** May feel cramped, less visual hierarchy

---

## Option B: Pill/Tag Style with Color Background

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ ┌──────────────────────┐   ┌────────────────┐   ┌──────┐                   │
│ │ 🏠 Independence      │ → │ Personal Care  │   │ 92%  │  ▼                │
│ └──────────────────────┘   └────────────────┘   └──────┘                   │
│   (purple bg)                (light purple)      (green)                    │
└─────────────────────────────────────────────────────────────────────────────┘
│ Physio assessment home visit - 1hr     │ $165.00 │ 15/12/2024 │ [Edit] [×] │
```

**Pros:** Clear visual separation, color-coded categories pop
**Cons:** Takes more horizontal space

---

## Option C: Hierarchical with Chevrons

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│  🏠 Independence  ›  Personal Care  ›  Assistance with self-care           │
│  ────────────────────────────────────────────────────────────               │
│  AI Confidence: ████████████░░░░░░░░ 92%   [View reasoning ▼]              │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
│ Physio assessment home visit - 1hr     │ $165.00 │ 15/12/2024 │ [Edit] [×] │
```

**Pros:** Shows full hierarchy including Tier 3, progress bar is scannable
**Cons:** Takes significant vertical space

---

## Option D: Two-Line Compact (RECOMMENDED)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 🏠 Independence → Personal Care                                    ▼       │
│    ░░ 92% confident • Keywords: physio, assessment                         │
└─────────────────────────────────────────────────────────────────────────────┘
│ Physio assessment home visit - 1hr     │ $165.00 │ 15/12/2024 │ [Edit] [×] │
```

**Pros:** Shows reasoning preview inline, balanced density
**Cons:** Still adds vertical height per row

---

## Option E: Left-Aligned with Icon Column

```
┌────┬────────────────────────────────────────────────────────────────────────┐
│ 🏠 │ Independence → Personal Care                          92% ✓    ▼      │
│    │ Physio assessment home visit - 1hr  │ $165.00 │ 15/12/2024 │ [Edit]   │
├────┼────────────────────────────────────────────────────────────────────────┤
│ 💪 │ Allied Health → Physiotherapy                         87%      ▼      │
│    │ OT assessment - initial             │ $250.00 │ 14/12/2024 │ [Edit]   │
└────┴────────────────────────────────────────────────────────────────────────┘
```

**Pros:** Icon column provides quick visual scan, compact
**Cons:** Requires table structure change

---

## Option F: Floating Badge Above Row

```
                              ┌──────────────────────────────────┐
                              │ 🏠 Independence → Personal Care  │
                              │            92% ✓  ▼              │
                              └──────────────────────────────────┘
┌─────────────────────────────────────────────────────────────────────────────┐
│ Physio assessment home visit - 1hr     │ $165.00 │ 15/12/2024 │ [Edit] [×] │
└─────────────────────────────────────────────────────────────────────────────┘

                              ┌──────────────────────────────────┐
                              │ 💪 Allied Health → Physiotherapy │
                              │            87%    ▼              │
                              └──────────────────────────────────┘
┌─────────────────────────────────────────────────────────────────────────────┐
│ OT assessment - initial                │ $250.00 │ 14/12/2024 │ [Edit] [×] │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Pros:** Very prominent, impossible to miss
**Cons:** Takes too much vertical space, feels disconnected

---

## Option G: Integrated First Column

```
┌────────────────────────────┬─────────────────────────┬─────────┬────────────┐
│ Classification             │ Description             │ Amount  │ Actions    │
├────────────────────────────┼─────────────────────────┼─────────┼────────────┤
│ 🏠 Independence            │ Physio assessment       │ $165.00 │ [Edit] [×] │
│    → Personal Care   92% ▼ │ home visit - 1hr        │         │            │
├────────────────────────────┼─────────────────────────┼─────────┼────────────┤
│ 💪 Allied Health           │ OT assessment           │ $250.00 │ [Edit] [×] │
│    → Physiotherapy   87% ▼ │ initial consult         │         │            │
└────────────────────────────┴─────────────────────────┴─────────┴────────────┘
```

**Pros:** No extra row, classification has its own column
**Cons:** Reduces space for description

---

## Option H: Stacked with Micro-Summary

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ 🏠 Independence → Personal Care                                         │ │
│ │ ▓▓▓▓▓▓▓▓▓░ 92%  •  Supplier ✓  •  Budget ✓  •  Keywords: 3 matched     │ │
│ │                                                         [Change ▼]      │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ Physio assessment home visit - 1hr      │ $165.00 │ 15/12  │ [✓] [×]   │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Pros:** Shows all signals at a glance (supplier, budget, keywords)
**Cons:** Very dense, might overwhelm

---

## Recommendation

**Option D (Two-Line Compact)** provides the best balance:
- Shows classification hierarchy clearly
- Includes confidence with quick reasoning preview
- Doesn't take excessive vertical space
- Dropdown accessible but not intrusive
- Can expand to show full reasoning panel

For high-density workflows, **Option G (Integrated First Column)** is a good alternative if vertical space is at a premium.
