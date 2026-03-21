---
title: "ADR-002: Statement Serves Resolution"
description: "Resolution for statement data presentation using serves as the primary grouping"
---

| Status | Date | Lead | Decision |
|--------|------|------|----------|
| **Accepted** | 2026-02-04 | William Whitelaw | Team |

---

## Context

Following [ADR-001](./ADR-001-statement-data-source.md), we identified that our MYOB server (account) codes don't align with budget IDs, making it impossible to reconcile statements at the budget level. This document captures the resolution approach for presenting statement data to recipients.

### The Core Problem

- **Server/Budget Mismatch:** MYOB servers (account codes) don't map 1:1 to Portal budget IDs
- **Reconciliation Gap:** Cannot match statement line items to specific budgets
- **Co-contribution Visibility:** Recipients need to see co-contribution amounts clearly for invoicing purposes

---

## Resolution

### Statement Presentation Approach

**Statements will display transactions grouped by Serve (service delivery record).**

Each statement will show:
1. **All transactions grouped by Serve** — The serve becomes the primary unit of reconciliation
2. **Co-contribution amounts** — Serves grouped by co-contribution category provide clear visibility
3. **Transaction Detail Report alignment** — The sum of consumption items by funding stream should match the total sum of all serves

### Why Serves?

| Aspect | Benefit |
|--------|---------|
| **Data Integrity** | Serves have 1:1 relationship with consumption records |
| **Co-contribution Clarity** | Serves can be grouped by co-contribution category |
| **Invoice Matching** | When invoicing for co-contribution, amounts should align |
| **User Understanding** | Recipients understand services delivered, not accounting codes |

### Expected Reconciliation

```
Transaction Detail Report (sum by funding stream)
    ↓ should equal ↓
Sum of all Serves on Statement
    ↓ can be broken down by ↓
Co-contribution Categories
```

---

## Data Synchronisation Status

### Current State (November 2025 onwards)

| Period | Data Source | Sync Status |
|--------|-------------|-------------|
| November 2025+ | Portal (Prota) | 1:1 sync with statements |
| December 2025+ | Portal (Prota) | 1:1 sync with statements |

**What this means:** Everything on the November statement forward has a corresponding record in Portal — serves, consumptions, and transactions are synchronised.

### Known Limitations

#### MYOB Adjustments

Finance adjustments made directly in MYOB do **not** automatically flow back to Portal:

| Adjustment Type | In MYOB | In Portal | Statement Impact |
|-----------------|---------|-----------|------------------|
| Claim corrections | Yes | No | Shows on statement, not in Portal |
| Voluntary contributions | Yes | No | Cannot be claimed, no Portal visibility |
| Manual journals | Yes | No | Included in statement only |

**Current workaround:** These items need to be either:
1. Claimed for (where applicable)
2. Manually extracted to Portal for visibility

---

## Future State Vision

### Portal as Source of Truth

The long-term intention is for **Portal to be the source of truth for everything**, including voluntary contributions.

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'fontSize': '14px'}}}%%
flowchart TB
    subgraph current["Current Flow (Problematic)"]
        direction LR
        M1[MYOB] -->|Adjustments| C1[Claiming]
        C1 -->|Sync back| P1[Portal]
        P1 -.->|Mirror only| M1

        style M1 fill:#f9d71c,stroke:#333
        style C1 fill:#87CEEB,stroke:#333
        style P1 fill:#90EE90,stroke:#333
    end

    subgraph future["Future Flow (Target)"]
        direction LR
        M2[MYOB] -->|Sync TO| P2[Portal]
        P2 -->|Source of Truth| C2[Claiming]

        style M2 fill:#f9d71c,stroke:#333
        style P2 fill:#90EE90,stroke:#333
        style C2 fill:#87CEEB,stroke:#333
    end

    current --> |"Migration"| future
```

### Target Architecture

```mermaid
flowchart LR
    subgraph External["External Systems"]
        MYOB[MYOB]
        SA[Services Australia]
    end

    subgraph Portal["Portal (Source of Truth)"]
        Serves[Serves]
        Consumptions[Consumptions]
        Statements[Statements]
        VolContrib[Voluntary Contributions]
    end

    subgraph Outputs["Outputs"]
        Claims[Claims]
        Invoices[Co-contribution Invoices]
        Reports[Transaction Detail Reports]
    end

    MYOB -->|Sync adjustments INTO| Portal
    Portal -->|Generate| Claims
    Claims -->|Submit| SA
    SA -->|Response| Portal

    Serves --> Statements
    Consumptions --> Statements
    VolContrib --> Statements

    Statements --> Reports
    Statements --> Invoices

    style Portal fill:#e8f5e9,stroke:#2e7d32,stroke-width:2px
    style MYOB fill:#fff3e0,stroke:#f57c00
    style SA fill:#e3f2fd,stroke:#1976d2
```

### Key Changes Required

1. **MYOB → Portal Sync:** Adjustments flow INTO Portal, not around it
2. **Voluntary Contributions:** Captured in Portal, not just MYOB
3. **Single Source:** All statement data originates from Portal
4. **Claiming Source:** Claims generated from Portal, not MYOB

---

## Implementation Notes

### Immediate Actions (Current Statements)

- [x] November statement uses serves-based grouping
- [x] December statement follows same approach
- [ ] Co-contribution categories visible per serve grouping
- [ ] Transaction Detail Report totals align with serve sums

### Future Backlog

- [ ] Build MYOB → Portal adjustment sync
- [ ] Capture voluntary contributions in Portal
- [ ] Migrate claiming source from MYOB to Portal
- [ ] Backfill historical adjustments where needed

---

## Related Documents

- [ADR-001: Statement Data Source](./ADR-001-statement-data-source.md)
- Statements Epic: TP-3291

---

## Footnotes

1. **November/December Parity:** Data on statements from November 2025 onwards has 1:1 synchronisation with Portal (Prota)
2. **Voluntary Contributions:** Currently not observable in Portal as they cannot be claimed — this is a known gap for future resolution
3. **Adjustment Visibility:** MYOB-only adjustments require manual extraction to Portal until the sync is built
