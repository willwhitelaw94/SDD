---
title: "Notion Nick - Rationale"
---

# Rationale: Why Notion Patterns Work for Supplier Invoicing

## Database Views Let Suppliers Work Their Way

Suppliers manage invoices differently depending on their workflow:

- A **bookkeeper** wants a dense table view to scan 50+ invoices, sort by date, and spot overdue items.
- A **small sole-trader** prefers a board view to see invoices move through Draft to Submitted to Paid.
- A **scheduler** needs a calendar view to see which invoices are due when and plan cash flow.

By offering the same invoice data through Table, Board, and Calendar views with a simple tab toggle, we eliminate the need for separate "list" and "Kanban" pages. One database, multiple perspectives. This is Notion's core insight and it maps perfectly to invoice tracking.

## Inline Editing Reduces Navigation

Suppliers currently navigate between list pages and separate create/edit forms. Notion's inline editing pattern means:

- Click a cell in the table to change a value directly.
- No round-trip to a separate page for simple corrections.
- Auto-save removes the anxiety of forgetting to press "Save".

For invoice creation, we use Notion's "page creation" pattern: start typing, fill properties as you go, with the form feeling like you're building a page rather than filling out a bureaucratic form. This reduces perceived friction.

## Toggle Blocks for Progressive Disclosure of On-Hold Reasons

The On-Hold Bills feature needs to show suppliers why their invoice is held without overwhelming them with internal detail. Toggle blocks are the perfect pattern:

- The **collapsed state** shows "This invoice is on hold" with a brief reason summary.
- **Expanding** reveals the detailed reason list (privacy-filtered to only show supplier-relevant reasons).
- **REJECT-RESUBMIT** reasons expand to show the specific issues with a clear Resubmit action.
- **Internal reasons** collapse behind a generic "Other processes being completed" toggle.

This matches Notion's philosophy: simple surface, detail on demand. Suppliers who just want the gist see one line. Those who need to act see the full breakdown.

## Callout Blocks for Email Addresses and Alerts

The supplier's unique email address is the most important piece of information on the portal -- it's how they submit invoices. Notion's callout block pattern makes this impossible to miss:

- Teal-coloured background callout with a mail emoji/icon.
- The email address is displayed in a monospace-style font.
- A "Copy" button sits inline for one-click clipboard access.
- The block stands out from surrounding white cards without being obnoxious.

We also use callout blocks for:
- **Rejection notices** (red callout with action items).
- **On-hold status** (amber callout with "no action needed" messaging).
- **Success confirmations** (green callout after form submission).

## Property Chips for One-Glance Status

Notion's coloured property chips map directly to invoice statuses:

| Status | Chip Colour | Meaning |
|--------|------------|---------|
| Draft | Gray | Not yet submitted |
| Submitted | Blue | Awaiting review |
| In Review | Purple | Being processed |
| Approved | Green | Accepted for payment |
| On Hold | Amber | Requires attention |
| Rejected | Red | Needs resubmission |
| Paid | Emerald | Complete |

These chips appear in table cells, board cards, and detail page headers -- giving suppliers instant visual recognition of where each invoice stands. No need to read text; colour alone communicates status.

## Summary

The Notion-inspired approach gives suppliers:
1. **Flexibility** -- see data the way that suits their workflow (table/board/calendar).
2. **Speed** -- inline editing and auto-save reduce clicks and page loads.
3. **Clarity** -- toggle blocks reveal detail progressively; callout blocks highlight critical info.
4. **Familiarity** -- Notion has 100M+ users; these patterns are widely recognized.
5. **Cohesion** -- every screen uses the same block-based composition, creating a unified experience.
