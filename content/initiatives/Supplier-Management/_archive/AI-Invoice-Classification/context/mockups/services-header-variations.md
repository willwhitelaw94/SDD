---
title: "Services Table Header - 6 Variations"
---


## Context
Shows the summary breadcrumb at top of services selection:
`Co-Contribution Category → SERG → [SERV1, SERV2, SERV3]`

Updates when user confirms classification or selects services.

---

## Option A: Simple Breadcrumb Bar

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ Personal Care → Independence → Assistance with self-care, Bathing support  │
└─────────────────────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────────────────────┐
│ Select Services                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│ ☑ Assistance with self-care (AI Suggested)                                 │
│ ☑ Bathing support (AI Suggested)                                           │
│ ☐ Dressing assistance                                                       │
│ ☐ Grooming support                                                          │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Pros:** Simple, familiar pattern
**Cons:** Doesn't show the hierarchy clearly

---

## Option B: Three-Tier Pill Display (RECOMMENDED)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│  ┌──────────────────┐     ┌────────────────┐     ┌────────────────────────┐│
│  │ 🏠 Personal Care │  →  │ Independence   │  →  │ Assistance with self.. ││
│  └──────────────────┘     └────────────────┘     │ Bathing support        ││
│     Co-Contribution          SERG                │ +1 more                ││
│                                                  └────────────────────────┘│
│                                                     Services (3 selected)  │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Pros:** Clear tier labels, shows array of services, visually distinct
**Cons:** Takes vertical space

---

## Option C: Horizontal Tags with Overflow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ ┌──────────────┐   ┌────────────┐   ┌─────────────────────────────────────┐ │
│ │Personal Care │ → │Independence│ → │ Self-care │ Bathing │ +1 more    ▼│ │
│ └──────────────┘   └────────────┘   └─────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Pros:** Compact single line, expandable
**Cons:** Services might overflow quickly

---

## Option D: Card Style with Breakdown

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ CLASSIFICATION SUMMARY                                               [Edit]│
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Co-Contribution    SERG              Services                             │
│  ───────────────    ────              ────────                             │
│  🏠 Personal Care   Independence      • Assistance with self-care          │
│                                       • Bathing support                     │
│                                       • Dressing assistance                 │
│                                                                             │
│  Confidence: 92%    Supplier: ✓       Budget Match: ✓                      │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Pros:** Very clear, shows all metadata
**Cons:** Takes significant space, might feel like a form

---

## Option E: Inline Status Bar

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 🏠 Personal Care › Independence › [3 services]     92% ✓   [← Back] [Edit]│
└─────────────────────────────────────────────────────────────────────────────┘
   └─ Co-Contrib ─┘   └─ SERG ──┘   └─ Selected ─┘   └─ AI ─┘
```

**Pros:** Very compact, shows count instead of list
**Cons:** Loses service detail

---

## Option F: Accordion with Expandable Services

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 🏠 Personal Care → Independence                              [▼ Expand]    │
├─────────────────────────────────────────────────────────────────────────────┤
│ Selected: Assistance with self-care, Bathing support, +1 more              │
└─────────────────────────────────────────────────────────────────────────────┘

                            ↓ When expanded ↓

┌─────────────────────────────────────────────────────────────────────────────┐
│ 🏠 Personal Care → Independence                              [▲ Collapse]  │
├─────────────────────────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ Selected Services (3)                                                   │ │
│ │ • Assistance with self-care                                    [×]      │ │
│ │ • Bathing support                                              [×]      │ │
│ │ • Dressing assistance                                          [×]      │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ Available Services (12 more)                                            │ │
│ │ ☐ Grooming support                                                      │ │
│ │ ☐ Mobility assistance                                                   │ │
│ │ ☐ ...                                                                   │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│ [← Step back to SERG]  [← Show ALL categories]                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Pros:** Progressive disclosure, shows both selected and available
**Cons:** Requires interaction to see full list

---

## Recommendation

**Option B (Three-Tier Pill Display)** is recommended because:
- Clearly labels each tier (Co-Contribution, SERG, Services)
- Shows the array of services with overflow handling (+N more)
- Visual pills make tiers scannable
- Consistent with the breadcrumb pattern in line items

**Option F (Accordion)** is a good secondary choice for the full services picker panel where users need to see all options.
