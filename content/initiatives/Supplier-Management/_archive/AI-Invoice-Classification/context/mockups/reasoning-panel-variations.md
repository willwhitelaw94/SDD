---
title: "AI Reasoning Panel - 5 Variations"
---


## Context
Expandable panel showing why AI classified the line item:
- Keywords matched
- Supplier verification status
- Rate analysis
- Client budget match
- Alternative categories considered

---

## Option A: Simple List Format

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 🏠 Independence → Personal Care                                    92% ▲   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  WHY THIS CLASSIFICATION?                                                  │
│                                                                             │
│  • Keywords matched: "physio", "assessment", "home visit"                  │
│  • Supplier verified: Yes - ABC Physio Pty Ltd offers Physiotherapy        │
│  • Rate matches: $165/hr is typical for Physiotherapy (avg $140-180)       │
│  • Client budget: Has approved Physiotherapy budget ($2,400 remaining)     │
│                                                                             │
│  ALTERNATIVES CONSIDERED:                                                  │
│  • Occupational Therapy (67%) - Similar keywords but rate too high         │
│  • Allied Health - Other (45%) - Generic fallback                          │
│                                                                             │
│                                                          [Close]           │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Pros:** Simple, scannable list
**Cons:** Doesn't show confidence contribution per signal

---

## Option B: Signal Strength Bars (RECOMMENDED)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 🏠 Independence → Personal Care                                    92% ▲   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  CLASSIFICATION SIGNALS                                    Overall: 92%    │
│  ───────────────────────                                                   │
│                                                                             │
│  Keywords        ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░  85%                               │
│                  Matched: "physio", "assessment"                           │
│                                                                             │
│  Supplier        ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  100%  ✓                           │
│                  ABC Physio offers Physiotherapy                           │
│                                                                             │
│  Rate Match      ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░  90%                               │
│                  $165/hr within expected range ($140-180)                  │
│                                                                             │
│  Client Budget   ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  100%  ✓                           │
│                  Approved budget: $2,400 remaining                         │
│                                                                             │
│  ALTERNATIVES                                                              │
│  ────────────                                                              │
│  ○ Occupational Therapy    67%  (rate mismatch)                           │
│  ○ Other Allied Health     45%  (generic fallback)                        │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Pros:** Visual progress bars show signal strength, very scannable
**Cons:** Takes more space

---

## Option C: Card Grid Layout

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 🏠 Independence → Personal Care                                    92% ▲   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────┐  ┌─────────────────────┐                          │
│  │ 🔤 KEYWORDS    85%  │  │ 🏢 SUPPLIER   100%  │                          │
│  │ ─────────────────── │  │ ─────────────────── │                          │
│  │ physio ✓            │  │ ABC Physio Pty Ltd  │                          │
│  │ assessment ✓        │  │ Verified ✓          │                          │
│  │ home visit ✓        │  │ Offers Physiotherapy│                          │
│  └─────────────────────┘  └─────────────────────┘                          │
│                                                                             │
│  ┌─────────────────────┐  ┌─────────────────────┐                          │
│  │ 💰 RATE       90%   │  │ 📋 BUDGET    100%   │                          │
│  │ ─────────────────── │  │ ─────────────────── │                          │
│  │ $165/hr charged     │  │ Client has budget   │                          │
│  │ Expected: $140-180  │  │ $2,400 remaining    │                          │
│  │ Match ✓             │  │ Approved ✓          │                          │
│  └─────────────────────┘  └─────────────────────┘                          │
│                                                                             │
│  ALTERNATIVES: OT (67%) • Other Allied (45%)                [Change ▼]    │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Pros:** Visual cards group related info, compact
**Cons:** Might feel fragmented

---

## Option D: Compact Inline Summary

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 🏠 Independence → Personal Care                                    92% ▲   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ✓ Keywords: physio, assessment (85%)                                      │
│  ✓ Supplier: ABC Physio verified for Physiotherapy (100%)                  │
│  ✓ Rate: $165/hr matches expected range (90%)                              │
│  ✓ Budget: Client has $2,400 remaining in Physio budget (100%)             │
│                                                                             │
│  Also considered: Occupational Therapy (67%), Other Allied (45%)           │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Pros:** Very compact, fits inline
**Cons:** Less visual impact, harder to scan

---

## Option E: Tooltip Preview + Full Panel

```
         HOVER STATE (Tooltip)
         ┌────────────────────────────────────┐
         │ Keywords: physio, assessment       │
         │ Supplier: ✓ Verified               │
         │ Rate: ✓ $165/hr matches            │
         │ Budget: ✓ $2,400 available         │
         │                                    │
         │ [Click for full details]           │
         └────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ 🏠 Independence → Personal Care                           92% [▼ Details] │
└─────────────────────────────────────────────────────────────────────────────┘

         EXPANDED STATE (Click)
┌─────────────────────────────────────────────────────────────────────────────┐
│ 🏠 Independence → Personal Care                           92% [▲ Collapse] │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  SIGNAL BREAKDOWN                                                          │
│  ────────────────                                                          │
│                                                                             │
│  Keywords (85%)     physio ✓  assessment ✓  home visit ✓                   │
│  Supplier (100%)    ABC Physio Pty Ltd - Verified for Physiotherapy        │
│  Rate Match (90%)   $165/hr charged • Expected: $140-180/hr                │
│  Client Budget      ✓ Approved • $2,400 remaining of $5,000                │
│                                                                             │
│  ─────────────────────────────────────────────────────────────────────     │
│  ALTERNATIVES                                                              │
│                                                                             │
│  ○ Occupational Therapy    67%   Rate higher than typical OT               │
│  ○ Other Allied Health     45%   No specific keyword match                 │
│                                                                             │
│                                                         [Change Category]  │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Pros:** Progressive disclosure, hover preview + full details on demand
**Cons:** Requires two interaction modes

---

## Recommendation

**Option B (Signal Strength Bars)** is recommended because:
- Progress bars provide instant visual feedback on signal quality
- Each signal is clearly labeled with percentage
- Alternatives section shows why other categories were rejected
- Scannable at a glance but detailed enough for investigation

**Option E (Tooltip + Full Panel)** is a good enhancement for advanced users who want quick preview without expansion.
