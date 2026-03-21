---
title: "Warning States & Alerts - 6 Variations"
---


## Context
Various warning states needed:
- Multi-service detection (line item contains multiple services)
- Low-value travel charge
- Budget mismatch
- Unplanned service prompt
- Contribution category change

---

## Multi-Service Detection Warning

### Option A: Inline Banner with Actions

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ ⚠️ MULTIPLE SERVICES DETECTED                                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  This line item appears to contain multiple services:                      │
│  • "personal care" → Personal Care category                                │
│  • "cleaning" → Daily Living category                                      │
│                                                                             │
│  These have different contribution categories and should be split          │
│  for accurate billing.                                                     │
│                                                                             │
│  [Split into 2 line items]        [Pay as-is & notify supplier]           │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
│ Personal care and cleaning - 3hrs  │ $180.00 │ 15/12/2024 │ [Edit] [×]    │
```

**Pros:** Clear action buttons, explains the issue
**Cons:** Takes vertical space

---

### Option B: Compact Warning Tag with Popover (RECOMMENDED)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ ⚠️ Multi-Service Detected                                         [Fix ▼] │
│ 🏠 Personal Care + 🏠 Daily Living                                         │
└─────────────────────────────────────────────────────────────────────────────┘
│ Personal care and cleaning - 3hrs  │ $180.00 │ 15/12/2024 │ [Edit] [×]    │

                           ↓ Dropdown on [Fix ▼] ↓

                    ┌─────────────────────────────────────────┐
                    │ HOW TO RESOLVE                          │
                    ├─────────────────────────────────────────┤
                    │ This item contains 2 services with      │
                    │ different contribution categories.      │
                    │                                         │
                    │ • personal care (Independence)          │
                    │ • cleaning (Daily Living)               │
                    │                                         │
                    │ ┌───────────────────────────────────┐   │
                    │ │ [✂️ Split into 2 items]           │   │
                    │ └───────────────────────────────────┘   │
                    │ ┌───────────────────────────────────┐   │
                    │ │ [💰 Pay as-is, notify supplier]   │   │
                    │ └───────────────────────────────────┘   │
                    │ ┌───────────────────────────────────┐   │
                    │ │ [✓ Ignore (I'll handle manually)] │   │
                    │ └───────────────────────────────────┘   │
                    └─────────────────────────────────────────┘
```

**Pros:** Compact by default, full options on demand
**Cons:** Requires click to see options

---

## Travel Charge Warning

### Option A: Merge Suggestion

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ ℹ️ LOW-VALUE TRAVEL CHARGE                                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  $8.50 appears to be a travel component (under $10).                       │
│  Consider adding to a related service instead of standalone transport.     │
│                                                                             │
│  RELATED LINE ITEMS:                                                       │
│  ○ Physio assessment home visit ($165.00)                                  │
│  ○ OT assessment ($250.00)                                                 │
│                                                                             │
│  [Merge with selected]  [Keep as standalone transport]                     │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Unplanned Service Prompt

### Option A: Prominent CTA (RECOMMENDED)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 🔍 NO MATCHING BUDGET FOUND                                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  AI suggested: Allied Health → Occupational Therapy                        │
│  But this client has no approved budget for Occupational Therapy.          │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                                                                     │   │
│  │   [➕ Create Unplanned Service]                                     │   │
│  │                                                                     │   │
│  │   AI will pre-fill: OT Assessment, OT Treatment                     │   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  Or: [Select different category ▼]                                         │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Pros:** Very prominent CTA, explains the issue and solution
**Cons:** Takes space

---

## Budget Mismatch Warning

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ ⚠️ Client has no approved budget for Occupational Therapy                  │
│    Remaining OT budget: $0.00 • Total allocated: $0.00                     │
│                                                                             │
│    [Create Unplanned Service]  or  [Select different category ▼]          │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Contribution Category Change Warning

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ ⚠️ CONTRIBUTION CATEGORY CHANGE                                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  You're changing from:  Allied Health (17.5% co-contribution)              │
│  To:                    Personal Care (5% co-contribution)                 │
│                                                                             │
│  This will affect the client's contribution amount for this service.       │
│                                                                             │
│                          [Cancel]  [Confirm Change]                        │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Claimed Bill Read-Only State

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 🔒 CLAIMED - READ ONLY                                                     │
│ 🏠 Independence → Personal Care                                    92%     │
│    This classification cannot be changed after claiming.                   │
└─────────────────────────────────────────────────────────────────────────────┘
│ Physio assessment home visit - 1hr     │ $165.00 │ 15/12/2024 │ [View]    │
```

---

## Recommendation

- **Multi-service**: Option B (Compact with popover) for minimal disruption
- **Unplanned service**: Option A (Prominent CTA) because users miss the current nested option
- **All warnings**: Use consistent yellow/orange color scheme for warnings, blue for info
