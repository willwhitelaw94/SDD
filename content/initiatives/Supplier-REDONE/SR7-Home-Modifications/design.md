---
title: "Design: Home Modifications"
---

**Status:** Draft
**Feature Spec:** [spec.md](spec.md)
**Created:** 2026-03-19
**Last Updated:** 2026-03-19

---

## Design Resources

### LOOM Videos

| Title | Link | Description |
|-------|------|-------------|
| | | |

### Figma

| File | Link | Description |
|------|------|-------------|
| | | |

### Miro

| Board | Link | Description |
|-------|------|-------------|
| | | |

---

## Overview

Home modifications management with an 8-stage project lifecycle, state-specific document enforcement, payment instalment tracking, and photo evidence. The UI provides a single project page where Care Partners can see the full modification lifecycle — stages, documents, payments, and photos — while suppliers interact through quote submission and progress uploads.

---

## User Context

| Aspect | Decision | Rationale |
|--------|----------|-----------|
| **Primary User** | Care Partner | Manages lifecycle transitions, reviews quotes, processes payments |
| **Secondary Users** | Coordinator (approvals, escalation), Supplier (quote submission, photo uploads) |
| **Device Priority** | Desktop-first (Care Partner); mobile-capable (Supplier photo uploads) |
| **Usage Pattern** | Low frequency per project, but long-lived — projects span weeks to months |
| **Information Density** | Very high — lifecycle stages, documents, payments, photos all on one page |

---

## Technology Context

| Aspect | Decision |
|--------|----------|
| **Frontend** | Standalone React (Next.js) with shadcn/ui + Tailwind |
| **Brand** | Navy `#2C4C79` primary, Teal `#007F7E` accent |
| **API** | Laravel JSON API (SR0 foundation) |
| **File Uploads** | Direct-to-S3 with presigned URLs for photos |

---

## Layout & Structure

### Page Type

Master-detail: Project list (table) + Project detail page (multi-section single page)

### Navigation Pattern

- Home Modifications tab on the Client detail page (Care Partner view)
- Home Modifications tab on the Supplier profile page (Supplier view — Story 8)
- Project detail is a dedicated page with section anchors (not a slide-over — too much content)

### Content Layout

The **Project Detail Page** is the primary workspace. It uses a vertically stacked layout with distinct sections: lifecycle tracker (top), quote details, document checklist, payment instalments, and photo gallery.

---

## Screen Inventory

### Screen 1 — Client Home Modifications Tab

List of all home modification projects for a client.

```
┌─────────────────────────────────────────────────────────────────┐
│  Client: Robert Nguyen                                           │
│  ┌──────┬──────────┬─────────┬──────────┬──────────┬──────────┐ │
│  │ Tabs │ Overview │ Care    │ Assess-  │ Home     │ Bills    │ │
│  │      │          │ Plan    │ ments    │ Mods ●   │          │ │
│  └──────┴──────────┴─────────┴──────────┴──────────┴──────────┘ │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Home Modification Projects                                 │  │
│  ├────────────────────────────────────────────────────────────┤  │
│  │ Project         │ Supplier     │ Stage       │ Quote   │ Paid│
│  ├─────────────────┼──────────────┼─────────────┼─────────┼─────┤
│  │ Bathroom Rails  │ SafeHome Co  │ ● Approved  │ $4,200  │ 60% │
│  │ Kitchen Ramp    │ AccessBuild  │ ○ Quoted    │ $8,500  │  0% │
│  │ Whole-of-House  │ SafeHome Co  │ ◐ 2/3 done │ $22,000 │ 45% │
│  │   └ Bathroom    │ SafeHome Co  │ ● Completed │ $9,000  │100% │
│  │   └ Kitchen     │ SafeHome Co  │ ● Approved  │ $7,000  │ 30% │
│  │   └ Access      │ SafeHome Co  │ ○ Under Rev │ $6,000  │  0% │
│  └─────────────────┴──────────────┴─────────────┴─────────┴─────┘
└─────────────────────────────────────────────────────────────────┘
```

**Key decisions:**
- Parent-child projects shown with visual indent (tree structure)
- **Parent row is clickable** — opens a parent detail page showing aggregated stats and a list of child projects. Children show breadcrumb: Client > Parent Project > Child Project (CLR-UXQ1)
- Parent row shows aggregate status ("2/3 done") instead of a single stage
- Paid column shows percentage progress bar for quick financial overview
- Row click navigates to the project detail page

### Screen 2 — Project Detail Page — Lifecycle Tracker

The top section of the project detail page. Shows the 8-stage lifecycle as a visual progress tracker.

```
┌─────────────────────────────────────────────────────────────────┐
│  ← Back to Client                                                │
│                                                                  │
│  Bathroom Safety Rails                     Supplier: SafeHome Co │
│  Client: Robert Nguyen (NSW)               Quote: $4,200        │
│                                                                  │
│  PROJECT LIFECYCLE                                               │
│  ┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐  ┌────┐│
│  │ New │─▶│Quot-│─▶│Docs │─▶│Under│─▶│Escal│  │Appr-│─▶│Comp││
│  │  ✓  │  │ ed  │  │Rec'd│  │Rev. │  │ated │  │oved │  │lete││
│  │     │  │  ✓  │  │  ✓  │  │  ✓  │  │     │  │ ● ← │  │    ││
│  └─────┘  └─────┘  └─────┘  └─────┘  └─────┘  └─────┘  └────┘│
│                                          │                       │
│                                       ┌──┴──┐                   │
│                                       │Rejct│                   │
│                                       └─────┘                   │
│                                                                  │
│  Current Stage: APPROVED                                         │
│  [Advance to Completed ▾]  [Reject with Reason]                 │
│                                                                  │
│  Stage History                                                   │
│  ● Approved     15 Mar 2026  by J. Park — "All docs verified"  │
│  ○ Under Rev.   12 Mar 2026  by J. Park                         │
│  ○ Docs Rec'd   10 Mar 2026  by S. Williams                     │
│  ○ Quoted        05 Mar 2026  by S. Williams — accepted quote   │
│  ○ New           01 Mar 2026  auto — quote submitted by supplier│
└─────────────────────────────────────────────────────────────────┘
```

**Key decisions:**
- 8 stages rendered as a horizontal stepper with completed/current/upcoming indicators
- "Escalated" and "Rejected" are **branch offshoot paths** — rendered as a small branch arrow below the "Under Review" step, keeping the happy path visually clean (CLR-UIQ1)
- Current stage is highlighted with a teal `#007F7E` fill
- Advance action uses a dropdown (since the next valid stage depends on prerequisites)
- Stage history is a vertical timeline below the stepper, showing actor, timestamp, and notes

### Screen 3 — Document Checklist (State-Specific)

The documents section of the project detail page. Renders the state-specific Boolean matrix as a checklist.

```
┌─────────────────────────────────────────────────────────────────┐
│  REQUIRED DOCUMENTS — NSW                                        │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │                                                            │  │
│  │  ✅  OT Assessment Report              uploaded 10 Mar     │  │
│  │  ✅  Quote & Scope of Works            uploaded 05 Mar     │  │
│  │  ✅  Council Approval (if applicable)   uploaded 08 Mar     │  │
│  │  ❌  Building Compliance Certificate    missing             │  │
│  │  ✅  Client Consent Form               uploaded 01 Mar     │  │
│  │                                                            │  │
│  │  4 of 5 documents uploaded                                 │  │
│  │  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 80%                │  │
│  │                                                            │  │
│  │  ⚠ Cannot advance to "Documents Received" until all       │  │
│  │    required documents are uploaded.                        │  │
│  │                                                            │  │
│  │  [Upload Document ▾]                                       │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
│  Document matrix managed by TC staff via Nova (FR-016)           │
└─────────────────────────────────────────────────────────────────┘
```

**Key decisions:**
- Checklist renders from the `documentation_matrix` lookup filtered by the client's state
- Each row: checkbox icon (uploaded/missing), document type name, upload date or "missing"
- Progress bar shows completion percentage
- Warning banner blocks stage advancement when incomplete (FR-006)
- Upload button opens a file picker; uploaded files appear inline immediately
- Different states show different checklists (NSW vs QLD vs VIC etc.)

### Screen 4 — Payment Instalment Tracker

The payments section of the project detail page. Tracks staged payments against the approved quote total.

```
┌─────────────────────────────────────────────────────────────────┐
│  PAYMENT INSTALMENTS                     Quote Total: $4,200    │
│                                                                  │
│  Budget: Home Modifications — $15,000 total / $6,800 used       │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 45%                           │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Milestone     │ Amount  │ Date       │ Status    │ Photo  │  │
│  ├───────────────┼─────────┼────────────┼───────────┼────────┤  │
│  │ Deposit       │ $1,260  │ 16 Mar 26  │ ● Paid    │ 2 📷   │  │
│  │ Progress      │ $1,260  │ 22 Mar 26  │ ● Paid    │ 4 📷   │  │
│  │ Completion    │ $1,680  │ —          │ ○ Pending │ 0 📷   │  │
│  └───────────────┴─────────┴────────────┴───────────┴────────┘  │
│                                                                  │
│  Paid: $2,520 of $4,200                                          │
│  ━━━━━━━━━━━━━━━━━━━━━━━ 60%             Remaining: $1,680      │
│                                                                  │
│  [+ Add Instalment]                                              │
│                                                                  │
│  ⚠ Completion payment requires completion photos (FR-011)        │
└─────────────────────────────────────────────────────────────────┘
```

**Key decisions:**
- Table shows each instalment with milestone type, amount, date, status, and photo count
- Two progress bars: one for budget utilisation (context), one for quote payment progress (primary)
- Instalment creation validates: amount does not exceed remaining quote total (FR-008) + budget availability (FR-009)
- Photo count per milestone links to the photo gallery filtered by that milestone
- Warning about completion photo requirement shown when final instalment is pending

### Screen 5 — Photo Evidence Gallery

The photos section of the project detail page. Shows progress and completion photos grouped by milestone.

```
┌─────────────────────────────────────────────────────────────────┐
│  PHOTOS                                          [Upload Photos] │
│                                                                  │
│  Deposit — 16 Mar 2026                                          │
│  ┌─────────┐  ┌─────────┐                                      │
│  │         │  │         │                                      │
│  │  📷 1   │  │  📷 2   │                                      │
│  │ Before  │  │ Rails   │                                      │
│  │ install │  │ deliver │                                      │
│  └─────────┘  └─────────┘                                      │
│                                                                  │
│  Progress — 22 Mar 2026                                         │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐          │
│  │         │  │         │  │         │  │         │          │
│  │  📷 3   │  │  📷 4   │  │  📷 5   │  │  📷 6   │          │
│  │ Wall    │  │ Rail    │  │ Rail    │  │ Grab    │          │
│  │ prep    │  │ mount L │  │ mount R │  │ bars    │          │
│  └─────────┘  └─────────┘  └─────────┘  └─────────┘          │
│                                                                  │
│  Completion — (no photos yet)                                   │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  ⚠ Completion photos required before project can be    │    │
│  │    marked as Completed.                                 │    │
│  │                                    [Upload Completion]  │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

**Key decisions:**
- Photos grouped by milestone with date headers
- Thumbnail grid (responsive — 2 cols on mobile, 4 on desktop)
- Click thumbnail to open full-size **lightbox** (use an existing React library such as `yet-another-react-lightbox` for zoom, keyboard nav, and swipe support) (CLR-UIQ2)
- Completion milestone shows an empty state with upload CTA when no photos exist
- File integrity validation on upload — corrupt files rejected immediately (edge case from spec)

### Screen 6 — Quote Submission Form (Supplier View)

What a supplier sees when submitting a new home modification quote.

```
┌─────────────────────────────────────────────────────────────────┐
│  Supplier Portal — SafeHome Co                                   │
│                                                                  │
│  Submit Home Modification Quote                                  │
│                                                                  │
│  Client *                                                        │
│  ┌─────────────────────────────────────────────┐                │
│  │ 🔍 Search client by name...                 │                │
│  └─────────────────────────────────────────────┘                │
│                                                                  │
│  Description of Proposed Work *                                  │
│  ┌─────────────────────────────────────────────┐                │
│  │ Install safety grab rails in bathroom and   │                │
│  │ shower area. Includes wall reinforcement... │                │
│  └─────────────────────────────────────────────┘                │
│                                                                  │
│  Itemised Costs                                                  │
│  ┌────────────────────────┬──────────┐                          │
│  │ Item                   │ Amount   │                          │
│  ├────────────────────────┼──────────┤                          │
│  │ Safety grab rails (x4) │ $800     │                          │
│  │ Wall reinforcement     │ $1,200   │                          │
│  │ Labour                 │ $1,800   │                          │
│  │ Compliance cert        │ $400     │                          │
│  ├────────────────────────┼──────────┤                          │
│  │ TOTAL                  │ $4,200   │                          │
│  └────────────────────────┴──────────┘                          │
│  [+ Add Line Item]                                               │
│                                                                  │
│  [Cancel]                              [Submit Quote]            │
└─────────────────────────────────────────────────────────────────┘
```

**Key decisions:**
- Client search is required (FR-001 — must be linked to a client)
- Description is a textarea for the scope of work
- Itemised costs are an editable table with add/remove rows
- Total auto-calculated from line items
- On submit: creates a project in "New" status (does not auto-advance to "Quoted" per FR-021)
- Validation: client required, at least one line item, total > 0

### Screen 7 — Supplier Home Modifications Tab

The supplier's view of their home modification projects (Story 8).

```
┌─────────────────────────────────────────────────────────────────┐
│  Supplier Portal — SafeHome Co                                   │
│  ┌──────┬──────────┬──────────┬──────────┬──────────┐           │
│  │ Tabs │ Profile  │ Products │ Home     │ Bills    │           │
│  │      │          │          │ Mods ●   │          │           │
│  └──────┴──────────┴──────────┴──────────┴──────────┘           │
│                                                                  │
│  Home Modification Projects                  [+ Submit Quote]    │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Client       │ Project      │ Stage     │ Quote  │ Paid %  │  │
│  ├──────────────┼──────────────┼───────────┼────────┼─────────┤  │
│  │ R. Nguyen    │ Bathroom     │ ●Approved │ $4,200 │ 60%     │  │
│  │ R. Nguyen    │ Kitchen Ramp │ ○Quoted   │ $8,500 │ 0%      │  │
│  │ P. Williams  │ Access Ramp  │ ●Completed│ $3,800 │ 100%    │  │
│  └──────────────┴──────────────┴───────────┴────────┴─────────┘  │
│                                                                  │
│  ● Active (2)   ● Completed (1)                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Component Inventory

### Existing Components (shadcn/ui)

| Component | Usage | Variant/Props |
|-----------|-------|---------------|
| `Table` | Project list, instalment list, quote line items | Default with sortable headers |
| `Badge` | Stage indicators, payment status | Colour variants per stage |
| `Card` | Document checklist, photo groups | With section headers |
| `Button` | Actions (advance, upload, submit) | Primary (navy), accent (teal) |
| `Progress` | Budget bar, quote payment bar, document completion | Teal colour |
| `Dialog` | Stage transition confirmation, rejection reason | With textarea for notes |
| `Textarea` | Quote description, stage notes | Auto-resize |
| `Input` | Line item amounts, search | Currency format |
| `Tabs` | Active/Completed project filter | Default |

### New Components Needed

- **ProjectLifecycleStepper** — 8-stage horizontal stepper with branch paths for Escalated and Rejected. Shows completed/current/upcoming with teal highlight on current. Must handle the non-linear Escalated branch.
- **DocumentChecklist** — Renders the state-specific document matrix as a checklist with upload capability. Shows progress bar and blocks advancement when incomplete.
- **InstalmentTable** — Payment instalment table with running total, remaining balance, and milestone labels. Validates against quote total and budget.
- **PhotoGallery** — Milestone-grouped photo grid with lightbox. Handles upload, file validation, and completion photo enforcement.
- **QuoteLineItems** — Editable table for itemised quote costs with auto-total calculation.
- **ParentProjectAggregator** — Summary row for parent projects showing child status rollup ("2 of 3 completed").

---

## Interaction Design

### Data Display

| Aspect | Decision | Details |
|--------|----------|---------|
| **View Type** | Table (list) + dedicated page (detail) | Row click navigates to project page |
| **Default Sort** | Active projects first, then by last updated | Completed projects below active |
| **Filtering** | By stage, by supplier | Tab filter: Active / Completed |
| **Pagination** | Server-side if > 20 projects per client | Unlikely to exceed for most clients |

### Editing Pattern

| Aspect | Decision | Details |
|--------|----------|---------|
| **Quote Submission** | Dedicated form page (supplier side) | Client search + description + line items |
| **Stage Transitions** | Dropdown button on project detail | Confirmation dialog with mandatory notes for Escalated/Rejected |
| **Document Upload** | Inline upload on checklist item | Direct-to-S3, file type and integrity validation |
| **Photo Upload** | Inline upload in gallery section | Milestone-linked, multiple files supported. **Suppliers upload; Care Partners view/review** (CLR-UXQ3). Admin override available for CP uploads if needed |
| **Instalment Creation** | Form within the payments section | Amount, milestone type, validation against remaining balance |
| **Save Feedback** | Toast notifications | Stage-specific messages, error details for validation failures |

---

## States

### Loading States

| Context | Treatment |
|---------|-----------|
| Project list | Skeleton rows (3-4 rows) |
| Project detail | Skeleton blocks for each section (stepper, docs, payments, photos) |
| Photo upload | Upload progress indicator per file |

### Empty States

| Context | Message | CTA |
|---------|---------|-----|
| No projects for client | "No home modification projects for this client" | — (projects start from supplier quotes) |
| No instalments | "No payments recorded yet. Payments can begin once the project is approved." | — |
| No photos at milestone | "No photos uploaded for this milestone" | [Upload Photos] |
| Supplier — no projects | "You haven't submitted any home modification quotes yet" | [Submit Your First Quote] |

### Error States

| Context | Treatment |
|---------|-----------|
| Instalment exceeds remaining quote | Inline error: "Amount exceeds remaining balance of $X" (FR-008) |
| Budget insufficient | Alert: "The client's budget has insufficient funds for this instalment" (FR-009) |
| Missing documents for advancement | Warning banner listing missing documents (FR-006) |
| Missing completion photos | Warning: "Completion photos required before marking as Completed" (FR-011) |
| Corrupt file upload | Toast error: "File could not be processed. Please try a different file." |

---

## Stage Colour Mapping

| Stage | Colour | Badge Variant |
|-------|--------|---------------|
| New | Grey `#6B7280` | `muted` |
| Quoted | Amber `#F59E0B` | `warning` |
| Documents Received | Blue `#2C4C79` | `default` |
| Under Review | Amber `#F59E0B` | `warning` |
| Escalated | Orange `#EA580C` | `destructive-outline` |
| Approved | Green `#16A34A` | `success` |
| Rejected | Red `#DC2626` | `destructive` |
| Completed | Teal `#007F7E` | `info` |

---

## Notification Triggers (FR-020)

| Transition | Notified Party | Message |
|-----------|----------------|---------|
| Quote submitted (New) | Care Partner / Coordinator | "New quote submitted by {supplier} for {client}" |
| Documents uploaded | Care Partner / Coordinator | "Documents uploaded for {project}" |
| Under Review | Supplier | "Your project is now under review" |
| Escalated | Supplier | "Your project has been escalated — {reason}" |
| Approved | Supplier | "Your project has been approved — work may commence" |
| Rejected | Supplier | "Your project has been rejected — {reason}" |
| Completion photos uploaded | Care Partner / Coordinator | "Completion photos uploaded for {project}" |

---

## Open Questions

- [x] ~~Should the quote comparison view be side-by-side or ranked list?~~ **Ranked list (vertical cards)** — scales to any number of quotes, simpler to build. Each card shows supplier + total + line items + "Select this quote" button. (CLR-UXQ2)
- [ ] What is the maximum file size and accepted format for photo uploads?
- [x] ~~Should parent project detail pages show aggregated totals or just link to children?~~ **Both** — parent detail page shows aggregated stats and a linked list of child projects. (CLR-UXQ1)
- [ ] What specific documents are required per state? (Needs Sophie's input for the initial documentation matrix seed)

---

## Clarification Log

| ID | Phase | Question | Decision | Rationale |
|----|-------|----------|----------|-----------|
| CLR-UXQ1 | UX | Parent-child navigation: aggregated parent page or flat list? | **Parent detail page with child links** | Parent row clickable, opens aggregated view with child list. Breadcrumb: Client > Parent > Child |
| CLR-UXQ2 | UX | Quote comparison: side-by-side or ranked list? | **Ranked list (vertical cards)** | Scales to any number of quotes; simpler to build; each card has "Select this quote" CTA |
| CLR-UXQ3 | UX | Photo upload permissions: who uploads? | **Suppliers upload, Care Partners view** | Suppliers are on-site with photos; CPs review and approve. Admin override available if needed |
| CLR-UIQ1 | UI | Lifecycle stepper branch paths: inline, offshoot, or two-row? | **Branch offshoot below "Under Review"** | Keeps happy path clean; matches wireframe; Escalated/Rejected shown as a small branch arrow |
| CLR-UIQ2 | UI | Photo lightbox: custom or library? | **Use existing React library** (e.g., yet-another-react-lightbox) | Full-featured (zoom, keyboard, swipe) with minimal effort; photo evidence is a core feature |

---

## Approval

| Role | Name | Date | Status |
|------|------|------|--------|
| Product Manager | | | [ ] Approved |
| Developer | | | [ ] Approved |
