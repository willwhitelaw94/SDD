---
title: Supplier REDONE
description: Rebuild the supplier portal as a standalone React frontend with API-first architecture, two-tier org/supplier registration, and mobile-ready auth.
---

# Supplier REDONE

Rebuild the supplier portal as a standalone React frontend with API-first architecture, enabling mobile-ready access and a clean two-tier organisation model.

## Initiative Overview

The current supplier portal is embedded in the TC Portal Laravel monolith (Vue 3 + Inertia.js). It uses session-based auth, has no clean API boundary, and forces a flat ABN → Supplier registration that doesn't support multi-supplier organisations.

## Epics

| Code | Epic | Priority | Dependencies |
|------|------|----------|-------------|
| SR0 | [API Foundation & Two-Tier Auth](SR0-API-Foundation/) | Urgent | None |
| SR1 | [Registration & Onboarding](SR1-Registration-Onboarding/) | High | SR0 |
| SR2 | [Profile & Org Management](SR2-Profile-Org-Management/) | High | SR0 |
| SR3 | [Supplier Pricing](SR3-Supplier-Pricing/) | High | SR0, SR2 |
| SR4 | [Billing & Invoicing](SR4-Billing-Invoicing/) | High | SR0, SR2, SR3 |
| SR5 | [Agreements & Compliance](SR5-Agreements-Compliance/) | Medium | SR0, SR1, SR2 |
| SR6 | [Assessments & Products](SR6-Assessments-Products/) | Medium | SR0, SR4 |
| SR7 | [Home Modifications](SR7-Home-Modifications/) | Medium | SR0, SR4, SR6 |
| SR8 | [Staff Admin Portal](SR8-Staff-Admin-Portal/) | Medium | SR0 |
| SR9 | [Integrations & Migration](SR9-Integrations-Migration/) | Low | All |
| SR10 | [Priority One — Paid Supplier Boost](SR10-Priority-One/) | Medium | SR0, SR1, SR2, SR4 |

## Architecture

```
Organisation (ABN — Tier 1)
├── Organisation Administrator(s)
├── Shared: legal name, ABN, GST, org-level compliance
│
├── Supplier A (Tier 2)
│   ├── Bank Details, Locations, Prices, Documents, Agreements
│   └── Supplier Admin / Workers (scoped)
│
└── Supplier B (Tier 2)
    └── Own bank details, locations, pricing, etc.
```

## Linear

- **Initiative:** [Supplier REDONE](https://linear.app/trilogycare/initiative/supplier-redone-032e4db34fba)
- **Related:** [Supplier Management](https://linear.app/trilogycare/initiative/supplier-management-69c8da0154a7) (existing, 14 projects)
