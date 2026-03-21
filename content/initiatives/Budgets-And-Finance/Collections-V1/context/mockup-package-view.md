---
title: "Mockup: Package View - Your Contributions"
---


**Created**: 2025-12-23
**Status**: Approved

## Overview

The package-level Collections view showing invoice summary cards, DD setup CTA, and invoice table.

## Design Decisions

- **4 Summary Cards**: New → Overdue → Current → Paid (invoice lifecycle)
- **7-day payment terms**: Invoices within 7 days of due = "New", past 7 days = "Overdue"
- **Current card**: Only ever 1 invoice (current billing period, not yet due)
- **DD Setup CTA**: Prominent banner encouraging Direct Debit enrollment
- **DD Monthly Limit**: Optional feature for cashflow management

## Invoice Status Flow

| Status | Condition | Card Color |
|--------|-----------|------------|
| Current | Future billing period (not yet due) | Grey/neutral |
| New | Due date passed, within 7 days | Blue/info |
| Overdue | More than 7 days past due | Red/warning |
| Paid | Payment received | Green/success |

## Mockup: No DD Setup

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│ Your Contributions                                          Last synced: 2h ago │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ┌────────────────┐ ┌────────────────┐ ┌────────────────┐ ┌────────────────┐   │
│  │ ● New          │ │ ⚠ Overdue      │ │ ○ Current      │ │ ✓ Paid         │   │
│  │ $395.00       │ │ $450.00        │ │ $400.00        │ │ $3,890.00      │   │
│  │ Due in 5 days │ │ 8 days late    │ │ Due 15 Jan     │ │ 12 invoices    │   │
│  └────────────────┘ └────────────────┘ └────────────────┘ └────────────────┘   │
│                                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │ Set up Direct Debit                                                     │   │
│  │                                                                         │   │
│  │ Never miss a payment. Set up automatic debits and optionally set a     │   │
│  │ monthly limit to manage your cashflow.                                 │   │
│  │                                                                         │   │
│  │                                              [Set Up Direct Debit →]   │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │ Invoice #    │ Amount   │ Due Date    │ Status    │ Payment Date       │   │
│  ├──────────────┼──────────┼─────────────┼───────────┼────────────────────┤   │
│  │ INV-2024-092 │ $400.00  │ 15 Jan 2025 │ ○ Current │ -                  │   │
│  │ INV-2024-091 │ $395.00  │ 28 Dec 2024 │ ● New     │ -                  │   │
│  │ INV-2024-089 │ $450.00  │ 15 Dec 2024 │ ⚠ Overdue │ -                  │   │
│  │ INV-2024-085 │ $325.00  │ 01 Dec 2024 │ ✓ Paid    │ 29 Nov 2024        │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────────┘
```

## Mockup: DD Active State

When Direct Debit is set up, the CTA banner changes to show status:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ ✓ Direct Debit Active                                                       │
│                                                                             │
│ Account: ••••4829  │  Monthly Limit: $500  │  Next debit: 28 Dec           │
│                                                     [Manage DD Settings]   │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Card Subtitle Logic

| Card | Subtitle Shows |
|------|----------------|
| New | "Due in X days" or "Due today" |
| Overdue | "X days late" |
| Current | Due date (e.g., "Due 15 Jan") |
| Paid | Invoice count (e.g., "12 invoices") |

## Notes

- Invoice table uses common components table (filterable)
- Global view (all clients) uses same table component with additional filters
- "View all invoices" link navigates to global collections view (if applicable)
