---
title: "GitHub Gary - Rationale"
---

# Rationale: Why GitHub Patterns Work for Invoice Management

## 1. Invoices Are Pull Requests

The conceptual mapping between a GitHub PR and a supplier invoice is remarkably tight. Both follow a lifecycle of creation, automated validation, human review, and a final disposition (merge/pay or close/reject). Both have a clear owner (the submitter) and a reviewer (the Trilogy team). Both accumulate a timeline of events from submission to resolution.

This mapping is not superficial. GitHub's PR interface was designed to answer the question "Is this ready to merge?" at a glance. The supplier invoice interface must answer "Is this ready for payment?" at a glance. The checks pattern, the merge button state, the sidebar metadata, and the timeline all transfer directly because the underlying workflow is structurally identical.

Suppliers who have never used GitHub will still recognize the pattern: a list of submitted items, each with a status, each clickable for detail, each with a clear next action. The metaphor works because it maps to a universal concept of "submit, review, approve."

## 2. The Checks Pattern Solves the OHB Privacy Problem

The most challenging UX problem in this feature is displaying on-hold reasons without violating client privacy. GitHub's checks pattern provides an elegant solution. Each validation result is a discrete, named check with a pass/fail status. Checks can be individually expanded for detail or collapsed for summary.

For invoices, supplier-facing validation failures (touches_invoice = true) appear as individual checks with red X icons and actionable descriptions: "Line items do not match agreement rates," "ABN could not be verified," "Duplicate invoice detected." Internal-only reasons are collapsed into a single "Other processes being completed" check with a neutral gray status. This tells the supplier exactly what they need to fix without exposing internal workflow details.

The gate metaphor reinforces this: the "Resubmit" button is disabled until all supplier-actionable checks are resolved, exactly like a PR merge button that requires all checks to pass. Suppliers understand intuitively that they must resolve the red items before proceeding.

## 3. Batch Actions for Volume Suppliers

Suppliers managing invoices for multiple clients often submit 10-20 invoices in a session. GitHub's batch action pattern (checkbox select, floating toolbar) handles this naturally. Select multiple invoices, apply a bulk action (export, resubmit, archive). The selected count badge in the toolbar gives immediate feedback.

This scales well because the pattern is already proven at GitHub's scale: users regularly triage hundreds of issues using batch selection and bulk label/close operations. The same interaction model handles a supplier's monthly invoice queue without requiring a separate "bulk mode" or specialized interface.

## 4. Timeline Builds Trust Through Transparency

Suppliers frequently contact support asking "Where is my invoice?" This question reveals a transparency gap. GitHub's timeline pattern addresses this by showing every event in chronological order: submitted, received, validation passed, placed on hold, reviewer assigned, issue resolved, payment approved, payment sent.

The timeline is not just a history log. It is a trust mechanism. When suppliers can see that their invoice moved from "Submitted" to "Validation Passed" to "In Review" with timestamps, they understand the process is active and their submission has not been lost. This reduces support inquiries and builds confidence in the system.

The visual distinction between automated events (check results) and human events (reviewer notes) is important. Automated events appear as compact system messages, while human events appear as comment-style entries. This hierarchy tells the supplier which events are routine processing and which represent a human decision about their invoice.

## 5. Labels Provide At-a-Glance Categorization

GitHub's label system (coloured badges with text) is one of the most imitated patterns in software. It works because labels are compact, visually distinct, and immediately scannable. For invoices, labels serve two purposes: source channel (Email = blue, Portal = teal, Public = purple) and status indicators.

In the invoice list, labels appear inline with the invoice row, creating a secondary visual dimension beyond the primary status icon. A supplier can scan the list and instantly identify which invoices came through email versus the portal, which helps when troubleshooting submission issues or reconciling with their internal records.

The label colour mapping is deliberate: source channels use cool colours (blue, teal, purple) that do not compete with status colours (green, yellow, orange, red). This prevents visual confusion when scanning a list with mixed statuses and sources.
