# Classification Data Model

**Created**: 2026-02-09
**Updated**: 2026-02-10
**Source**: Stakeholder discussions, API investigation, Teams chat

---

## Overview

This document outlines how funding stream (classification) data is structured and tracked for Multiple Funding Streams. The model separates **Services Australia data** (synced from API) from **Trilogy Care actions** (our data).

**Key assumption**: The Services Australia API exposes the data we need (including pending/allocated status).

For field-level details on what Sales captures during conversion, see [Consolidated Conversion Form Fields](Consolidated%20Conversion%20Form%20Fields.md).

> **Scope Note**: This data model is relevant to LTH's Step 1 (Primary Classification, opt-out consent model) and to post-conversion workflows. The nightly sync and multi-funding stream detection described below operate independently of the LTH conversion wizard.

---

## Data Model

Two separate, immutable data environments:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  SERVICES AUSTRALIA MIRROR (synced from API, read-only)                      │
├──────────────────────┬──────────────────────────────────────────────────────┤
│  allocated_date      │  When funding allocated (pending/yellow status)      │
│  assigned_date       │  When funding became available (green status)        │
│  take_up_expiry_date │  Deadline to lodge ACER entry                        │
│  withdrawn_date      │  When funding ended (expired or withdrawn)           │
│  active              │  Is someone currently servicing this classification? │
└──────────────────────┴──────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│  TRILOGY CARE ACTIONS (our data, our actions)                                │
├──────────────────────┬──────────────────────────────────────────────────────┤
│  lodged              │  Boolean - have we lodged ACER entry?                │
│  closed_date         │  Date we ended our engagement (nullable)             │
└──────────────────────┴──────────────────────────────────────────────────────┘
```

---

## Derived Logic

Combining the two data sets tells us the classification state:

| `active` | `lodged` | Meaning |
|----------|----------|---------|
| true | true | We're servicing it |
| true | false | Another provider has it |
| false | true | We lodged but it's since ended |
| false | false | Available, no one's claimed it |

---

## API Data vs Manual Entry

**If API exposes pending status (assumed true):**

| Data Point | Source |
|------------|--------|
| allocated_date | API |
| assigned_date | API |
| take_up_expiry_date | API (or Sales captures if not available) |
| withdrawn_date | API |
| active | API (or derived) |
| lodged | Our system (when we call Entry API) |
| closed_date | Our system (when we exit) |

**If API does NOT expose pending:**
- Sales would need to manually record `allocated_date` from MAC UI
- This is a fallback, not preferred

---

## Nightly Sync

A nightly poll at midnight:
1. Queries Services Australia API for each client's referral code
2. Updates the Services Australia Mirror fields
3. Detects new classifications (allocated but not yet actioned)
4. Detects withdrawn/expired classifications
5. Surfaces changes in Portal inbox for care partner action

---

## Why This Matters

1. **Compliance**: Take-up expiry is critical — lodge even one day late and funding is withdrawn
2. **Revenue**: Detect all available funding streams, not just primary
3. **Clean data**: Two separate environments, no conflation of MAC data with TC actions
4. **Automation**: Minimal manual entry, API does the heavy lifting

---

## Open Questions

| Question | Status |
|----------|--------|
| Does API expose `allocated_date` (pending status)? | Awaiting confirmation from Matt |
| Does API expose `active` directly or do we derive it? | Awaiting API testing (team locked out of Proda) |
| Is `take_up_expiry_date` in the API or MAC UI only? | TBD |

---

## Related Documents

- [Risk Score First Management Option Flow](Risk%20Score%20First%20Management%20Option%20Flow.md)
- [Multiple Funding Streams Summary](../Multiple%20Funding%20Streams/Multiple_Funding_Streams_Summary.md)
