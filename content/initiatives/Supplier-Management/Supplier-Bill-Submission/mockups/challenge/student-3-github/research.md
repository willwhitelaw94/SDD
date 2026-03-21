---
title: "GitHub Gary - Research"
---

# Research: GitHub UI Patterns for Invoice Management

## Pattern 1: Pull Request Review Workflow

GitHub's pull request interface is a structured review pipeline. Every PR has a clear status (Open, Draft, Merged, Closed), a checks panel showing automated validations (CI passing, code coverage, linting), and explicit approval gates. Reviewers must approve before merging, and the merge button changes state depending on check results: green "Merge" when all checks pass, grayed out with "Some checks haven't completed yet", or red with "Merge is blocked" when required checks fail.

**Application to invoices:** An invoice follows the same pipeline as a PR. It is submitted (opened), validated against business rules (checks), reviewed by the Trilogy team, and either paid (merged) or rejected (closed). The checks pattern maps directly to OHB validation: ABN verified (green check), line items match agreement (green check), duplicate detection (green check or red X). The merge button becomes "Approved for Payment" or "Resubmit" depending on check outcomes.

**Source:** GitHub Pull Request interface, checks tab, merge requirements

---

## Pattern 2: Issue List with Labels and Status Icons

GitHub's issue list is a compact, information-dense table. Each row contains a status icon (green open circle, purple merged icon, red closed circle), the issue title, coloured label badges, metadata (author, milestone, comments count), and a timestamp. The list supports batch selection via checkboxes, and when items are selected, a floating action bar appears at the top for bulk operations (close, label, assign).

**Application to invoices:** Invoice rows use status icons (green circle-check for paid, yellow circle for in review, red X for rejected, orange triangle for on-hold). Source labels (Email, Portal, Public) appear as coloured badges next to the title. On-hold invoices show a failing check count. The batch action bar allows suppliers to select multiple invoices and perform bulk resubmission or export.

**Source:** GitHub Issues list, label system, batch actions toolbar

---

## Pattern 3: Timeline and Activity Feed

Every GitHub issue and PR has a chronological activity timeline. Events include comments, status changes, label additions, review requests, and automated bot messages. Each event is timestamped and attributed to a user or system. The timeline uses different visual markers for different event types: speech bubbles for comments, coloured dots for status changes, and connector lines between events.

**Application to invoices:** The invoice detail page shows a timeline of all events: submitted, received, checks passed/failed, placed on hold (with filtered reasons), resubmitted, approved, paid. This gives suppliers full visibility into where their invoice is in the pipeline without needing to contact support. System events (automated checks) are visually distinct from human actions (reviewer notes).

**Source:** GitHub issue timeline, PR activity feed, event markers

---

## Pattern 4: Checks and Status Indicators

GitHub's checks panel on a PR is a vertical list of automated validations. Each check has a status icon (green checkmark, red X, yellow spinning circle, gray skipped), a check name, a description, and a "Details" link. Checks are grouped by category (CI, Security, Code Quality). The overall PR status is determined by whether all required checks pass.

**Application to invoices:** OHB validation results map perfectly to this pattern. Invoice-touching reasons (missing line items, incorrect ABN, duplicate submission) appear as individual checks with red X status and actionable descriptions. Internal-only reasons are collapsed under a single "Other processes being completed" entry with a gray info icon. When all supplier-actionable checks pass, the resubmit button enables, mirroring the PR merge gate.

**Source:** GitHub PR checks tab, required status checks, branch protection

---

## Pattern 5: Sidebar Properties Panel

GitHub PRs have a right sidebar showing structured metadata: reviewers, assignees, labels, milestone, projects, and linked issues. Each section is a compact key-value display with add/edit affordances. The sidebar stays visible while scrolling through the main content, providing persistent context about the item's current state and categorization.

**Application to invoices:** The invoice detail page uses a sidebar showing: status badge, source channel, submission date, client name, package ID, total amount, and payment reference. This mirrors the PR sidebar pattern where the main content area shows the invoice document and timeline, while the sidebar provides at-a-glance metadata without scrolling.

**Source:** GitHub PR sidebar, issue metadata panel, label picker
