---
title: "Linear Lisa - Rationale"
---

# Rationale: Why Linear Patterns Work for a Supplier Portal

## 1. Suppliers Are Repeat Users Who Value Speed

Suppliers submitting invoices to Trilogy Care are not one-time visitors. They return weekly or monthly to submit bills, check payment status, and resolve on-hold issues. This usage pattern is identical to how developers use Linear daily to manage their work.

For repeat users, every extra click is friction that compounds over time. Linear's approach of surface-level simplicity with depth on demand means suppliers can glance at their dashboard, see what needs attention, and act without navigating through layers of UI. The command palette (Cmd+K) becomes a power-user tool that shaves seconds off every session.

## 2. Minimal UI Reduces Cognitive Load for Accounting Tasks

Invoice management is inherently a numbers-and-status task. Suppliers need to answer three questions quickly:

1. What is the status of my invoices?
2. Do any invoices need my attention?
3. How do I submit a new invoice?

Linear's design philosophy of "less, but better" directly serves this. By stripping away visual noise (heavy badges, gradient cards, icon-heavy sidebars), the remaining elements carry more weight. A small red dot next to an invoice communicates "on hold" just as effectively as a large red badge, but with less visual disruption when scanning a list of 50 invoices.

The monochrome-plus-one-accent approach (grays + teal-700) creates a calm interface where the eye is naturally drawn to the few elements that use colour, which are always status indicators or primary actions.

## 3. Keyboard Shortcuts Speed Up Bulk Operations

Suppliers who manage invoices for multiple clients often process batches. They upload 10 PDFs, review the AI-split results, confirm details, and submit. This workflow benefits enormously from keyboard navigation:

- Arrow keys to move through the in-tray queue
- Enter to open a document for review
- Tab through form fields
- Ctrl+Enter to confirm and move to the next

Linear has proven that keyboard-first design does not alienate mouse users. The interface works identically with a mouse; the keyboard shortcuts are an accelerator layer, hinted at (never forced) through small gray labels near relevant actions.

## 4. Status Dots Scale Better Than Badges

As invoice volume grows, the visual weight of status indicators matters. Linear's small status dots create a scannable vertical column in a list view. When a supplier has 200 invoices across various states, the coloured dots form a heat map that the eye can parse in seconds. Large badges would create visual chaos at this scale.

The on-hold issue count badge (e.g., "2") is intentionally small and appears inline with the status, not as a separate column. This keeps the table width manageable and the information hierarchy clear: status first, details on demand.

## 5. Progressive Disclosure Matches the Privacy Model

The OHB (On Hold Bills) feature requires careful privacy filtering. Suppliers must see only invoice-touching reasons, while internal reasons are hidden behind a generic label. Linear's pattern of progressive disclosure (summary on the list, details on click) naturally accommodates this:

- List view: small "On Hold" dot + issue count
- Detail view: filtered reasons shown, internal reasons shown as "Other processes being completed"
- No information is hidden in a way that feels suspicious; the interface simply shows what is relevant to the supplier's next action

This aligns with Linear's principle that every visible element should be actionable. If the supplier cannot act on an internal hold reason, they should not see it in detail.
