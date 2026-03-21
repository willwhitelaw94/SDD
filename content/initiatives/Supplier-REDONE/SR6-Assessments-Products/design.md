---
title: "Design: Assessments & Products"
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

Assessment creation, status tracking, and the mandatory three-way linkage (assessment-budget-supplier) that gates product billing. The UI surfaces clinical justification alongside financial and supplier data so Care Partners can manage the full assessment-to-payment chain from a single context.

---

## User Context

| Aspect | Decision | Rationale |
|--------|----------|-----------|
| **Primary User** | Care Partner | Creates assessments, links products, monitors status |
| **Secondary Users** | Coordinator (reviews/approves), Supplier (read-only linked summary) |
| **Device Priority** | Desktop-first | Data-heavy workflows, multi-column layouts |
| **Usage Pattern** | Moderate frequency — assessments created per-client as clinical need arises |
| **Information Density** | High — assessment history, product status, budget linkage all visible |

---

## Technology Context

| Aspect | Decision |
|--------|----------|
| **Frontend** | Standalone React (Next.js) with shadcn/ui + Tailwind |
| **Brand** | Navy `#2C4C79` primary, Teal `#007F7E` accent |
| **API** | Laravel JSON API (SR0 foundation) |
| **State** | React Query for server state, Zustand for local UI state |

---

## Layout & Structure

### Page Type

Multi-view: Client assessment list (table) + Assessment detail (master-detail) + Product creation form (sheet/drawer)

### Navigation Pattern

- Assessments live as a tab on the Client detail page
- Assessment detail opens as a **slide-over Sheet** (right-side panel) — keeps the table visible for quick context switching (CLR-UXQ1)
- Product creation opens as a **centered Dialog** — avoids stacking two Sheets (CLR-UIQ2)

### Content Layout

The primary view is the **Client Assessments Tab** — a table of assessments with inline status badges. Selecting an assessment reveals the **Assessment Detail Panel** with the linkage chain visualisation, product list, and status workflow controls.

---

## Screen Inventory

### Screen 1 — Client Assessments Tab

The assessment list on a client's profile. Shows all assessments with key metadata at a glance.

```
┌─────────────────────────────────────────────────────────────────┐
│  Client: Margaret Chen                                          │
│  ┌──────┬──────────┬─────────┬──────────┬──────────┬──────────┐ │
│  │ Tabs │ Overview │ Care    │ Assess-  │ Budget   │ Bills    │ │
│  │      │          │ Plan    │ ments ●  │          │          │ │
│  └──────┴──────────┴─────────┴──────────┴──────────┴──────────┘ │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────────┐│
│  │ Assessments                              [+ New Assessment] ││
│  ├──────────────────────────────────────────────────────────────┤│
│  │ Category         │ Date       │ Status       │ Products     ││
│  ├──────────────────┼────────────┼──────────────┼──────────────┤│
│  │ 🏠 Assistive Tech │ 12 Mar 26 │ ● Approved   │ 2 linked     ││
│  │ 🦽 Mobility       │ 28 Feb 26 │ ● Actioned   │ 1 linked     ││
│  │ 🍽 Nutrition      │ 15 Jan 26 │ ○ Expired    │ 0            ││
│  │ 🏠 Home Maint.    │ 03 Dec 25 │ ● Under Rev. │ 0            ││
│  └──────────────────┴────────────┴──────────────┴──────────────┘│
│                                                                  │
│  Showing 4 assessments                                           │
└─────────────────────────────────────────────────────────────────┘
```

**Key decisions:**
- Category column uses the S@H taxonomy icon + label
- Status uses colour-coded dot badges: green (Approved/Actioned), amber (New/Under Review), grey (Expired/Cancelled)
- Products column shows count of linked products as a quick indicator
- "+ New Assessment" button opens the creation form

### Screen 2 — Assessment Detail Panel

Opened when a row is selected. Shows the full assessment record, the linkage chain, and linked products.

```
┌─────────────────────────────────────────────────────────────────┐
│  ← Back to Assessments                                          │
│                                                                  │
│  Assistive Technology Assessment           ● Approved            │
│  Client: Margaret Chen                                           │
│  Created: 12 Mar 2026 by Sarah Williams                          │
│  Expires: 12 Mar 2027                                            │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  ASSESSMENT → BUDGET → SUPPLIER  (Linkage Chain)          │  │
│  │                                                            │  │
│  │  ┌──────────┐    ┌──────────┐    ┌──────────┐            │  │
│  │  │ OT Assess│───▶│ AT Budget│───▶│ MedEquip │            │  │
│  │  │ Approved │    │ $2,400   │    │ Pty Ltd  │            │  │
│  │  │ 12 Mar   │    │ Avail.   │    │ Verified │            │  │
│  │  └──────────┘    └──────────┘    └──────────┘            │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
│  Purpose                                                         │
│  OT assessment recommends powered wheelchair for daily mobility  │
│                                                                  │
│  Recommendation                                                  │
│  Powered wheelchair with tilt-in-space, headrest, and pressure   │
│  cushion. Client requires powered mobility due to progressive... │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  Linked Products                        [+ Create Product] │  │
│  ├────────────────────────────────────────────────────────────┤  │
│  │  Product              │ Supplier     │ Status     │ Amount │  │
│  ├───────────────────────┼──────────────┼────────────┼────────┤  │
│  │  Powered wheelchair   │ MedEquip     │ ● Paid     │ $1,800 │  │
│  │  Pressure cushion     │ MedEquip     │ ● Bill Rx  │ $600   │  │
│  └───────────────────────┴──────────────┴────────────┴────────┘  │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  Status History                                            │  │
│  │  ────────────────────────────────────                      │  │
│  │  ● Approved    12 Mar 2026   by J. Park (Coordinator)     │  │
│  │  ○ Under Rev.  10 Mar 2026   by J. Park                   │  │
│  │  ○ New         08 Mar 2026   by S. Williams (CP)          │  │
│  └────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

**Key decisions:**
- **Linkage chain visualisation** is the centrepiece — a horizontal flow showing the three required linkages (Assessment → Budget → Supplier) with status indicators on each node. **Nodes are clickable** — clicking navigates to the Budget tab or Supplier profile page respectively (CLR-UXQ2)
- Built with **CSS flexbox + three shadcn Card components** connected by CSS arrow/chevron connectors (CLR-UIQ1). No SVG or custom canvas.
- Each node shows: entity name, key status, and a date or amount
- Nodes turn green when linked and valid, amber when pending, red when missing/invalid
- Product list is inline below the assessment details
- Status history is a vertical timeline showing every transition with actor and timestamp

### Screen 3 — Product Status Workflow Tracker

Shown on each product row (expandable) and on the assessment detail panel. Tracks the product through its lifecycle.

```
┌─────────────────────────────────────────────────────────────────┐
│  Product: Powered Wheelchair                                     │
│  Supplier: MedEquip Pty Ltd                                      │
│  Assessment: Assistive Technology (12 Mar 2026)                  │
│                                                                  │
│  Status Tracker                                                  │
│  ┌───────────┐   ┌───────────┐   ┌───────────┐   ┌──────────┐  │
│  │ Approved  │──▶│   Bill    │──▶│           │   │          │  │
│  │ (Pending) │   │ Received  │   │   Paid    │   │ Rejected │  │
│  │     ✓     │   │     ✓     │   │   ◯ next  │   │          │  │
│  └───────────┘   └───────────┘   └───────────┘   └──────────┘  │
│                                                                  │
│  Budget: AT Line Item — $2,400 total / $1,800 used / $600 avail │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 75%                  │
└─────────────────────────────────────────────────────────────────┘
```

**Key decisions:**
- Horizontal stepper with check/circle indicators for completed/current/upcoming stages
- Rejected is a branch path (shown separately, not in the main flow)
- Budget utilisation bar beneath the stepper shows how much of the linked budget is consumed
- Green fill for completed steps, teal outline for current step, grey for upcoming

### Screen 4 — Supplier Assessment View (Read-Only)

What a supplier sees when viewing assessments linked to their products. Restricted per CLR-002 — linked summaries only.

```
┌─────────────────────────────────────────────────────────────────┐
│  Supplier Portal — MedEquip Pty Ltd                              │
│  ┌──────┬──────────┬──────────┬──────────┬──────────┐           │
│  │ Tabs │ Profile  │ Products │ Bills    │ Settings │           │
│  │      │          │    ●     │          │          │           │
│  └──────┴──────────┴──────────┴──────────┴──────────┘           │
│                                                                  │
│  Products Tab — Linked Assessments                               │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Client      │ Category     │ Date     │ Status   │ Product │  │
│  ├─────────────┼──────────────┼──────────┼──────────┼─────────┤  │
│  │ M. Chen     │ Assist. Tech │ 12 Mar   │Approved  │ Wheelchair│ │
│  │ R. Patel    │ Mobility     │ 28 Feb   │Actioned  │ Walker    │ │
│  └─────────────┴──────────────┴──────────┴──────────┴─────────┘  │
│                                                                  │
│  ℹ You can view assessments linked to your products.             │
│    Full assessment records are managed by the care team.         │
└─────────────────────────────────────────────────────────────────┘
```

**Key decisions:**
- Suppliers see **only** assessments linked to their products (not all client assessments)
- Columns: client name, assessment category, date, status, and the product name
- Read-only — no edit controls, no status transition actions
- Info banner clarifies the access scope

### Screen 5 — S@H Product Category Display

The nine categories shown in assessment creation, supplier capabilities, and billing validation.

```
┌─────────────────────────────────────────────────────────────────┐
│  Select Product Category                                         │
│                                                                  │
│  ┌─────────────────────┐  ┌─────────────────────┐              │
│  │ 🔧 Assistive        │  │ 💊 Nursing           │              │
│  │    Technology        │  │    Consumables       │              │
│  └─────────────────────┘  └─────────────────────┘              │
│  ┌─────────────────────┐  ┌─────────────────────┐              │
│  │ 🏠 Home Maintenance │  │ 🍽 Nutrition          │              │
│  │    (product-only)   │  │                      │              │
│  └─────────────────────┘  └─────────────────────┘              │
│  ┌─────────────────────┐  ┌─────────────────────┐              │
│  │ 🦽 Mobility         │  │ 🏡 Domestic Life     │              │
│  └─────────────────────┘  └─────────────────────┘              │
│  ┌─────────────────────┐  ┌─────────────────────┐              │
│  │ 🫀 Managing Body    │  │ 🧴 Self-care         │              │
│  │    Functions        │  │                      │              │
│  └─────────────────────┘  └─────────────────────┘              │
│  ┌─────────────────────┐                                        │
│  │ 📱 Communication &  │                                        │
│  │    Info Management  │                                        │
│  └─────────────────────┘                                        │
└─────────────────────────────────────────────────────────────────┘
```

**Key decisions:**
- Card-based grid layout (2 columns) for category selection
- Each card has an icon and the S@H category name
- Same visual treatment used across assessment creation, supplier price list config, and billing — enforcing FR-014 taxonomy consistency
- Selection highlights with teal `#007F7E` border and background tint

---

## Component Inventory

### Existing Components (shadcn/ui)

| Component | Usage | Variant/Props |
|-----------|-------|---------------|
| `Table` | Assessment list, product list, supplier view | Default with row selection |
| `Badge` | Status indicators (New, Approved, Paid, etc.) | Colour variants per status |
| `Sheet` / `Drawer` | Assessment detail panel, product creation | Side panel, responsive |
| `Button` | Actions (create, transition, link) | Primary (navy), accent (teal) |
| `Card` | Linkage chain nodes, category selector | With border highlight |
| `Select` | Category picker, supplier picker | Searchable |
| `Progress` | Budget utilisation bar | Teal colour |
| `Timeline` | Status history | Custom composition |

### New Components Needed

- **LinkageChainVisualiser** — Horizontal three-node flow diagram showing Assessment → Budget → Supplier with status per node. Reusable for any three-way validation display.
- **ProductStatusStepper** — Horizontal step indicator for the product lifecycle (Approved Pending → Bill Received → Paid / Rejected branch).
- **CategoryGrid** — 2-column card grid for the nine S@H product categories with selection state.

---

## Interaction Design

### Data Display

| Aspect | Decision | Details |
|--------|----------|---------|
| **View Type** | Table (list) + slide-over (detail) | Row click opens detail panel |
| **Default Sort** | Date descending (newest first) | Sortable by category, status, date |
| **Filtering** | By category, status. **Expired assessments hidden by default** — toggle "Show expired" to include them (CLR-UXQ3) | Dropdown filters above the table |
| **Pagination** | Client-side (assessments per client are low volume) | Scroll within the tab |

### Editing Pattern

| Aspect | Decision | Details |
|--------|----------|---------|
| **Assessment Creation** | **Dialog** (centered modal) — avoids stacking with the detail Sheet (CLR-UIQ2) | Category (required), purpose, recommendation, assessor |
| **Status Transitions** | Button in detail panel | Confirmation dialog with optional notes |
| **Product Creation** | Sheet/drawer from assessment detail | Select supplier, link budget, specify product |
| **Validation** | Inline field validation + submission-time linkage checks | Three-way linkage validated before product bill submission |
| **Save Feedback** | Toast notification | Success/error with specific linkage failure messages |

---

## States

### Loading States

| Context | Treatment |
|---------|-----------|
| Assessment list | Skeleton rows (3-4 rows) in the table |
| Assessment detail | Skeleton blocks for the linkage chain and product list |
| Product status update | Spinner on the status transition button |

### Empty States

| Context | Message | CTA |
|---------|---------|-----|
| No assessments for client | "No assessments recorded for this client yet" | [+ Create Assessment] |
| No products linked | "No products linked to this assessment" | [+ Create Product] |
| Supplier — no linked assessments | "No assessments are linked to your products yet" | — (read-only) |

### Error States

| Context | Treatment |
|---------|-----------|
| Missing linkage on bill submit | Inline alert listing which linkages are missing (FR-010) |
| Expired assessment | Status badge turns grey; "Create Product" button disabled with tooltip |
| Budget exhausted | Alert banner on product creation: "Insufficient budget — $0 available" |
| Quote exceeds approved amount | Warning banner: "Billed amount exceeds quote — coordinator review required" (FR-016) |

---

## Status Colour Mapping

| Status | Colour | Badge Variant |
|--------|--------|---------------|
| New | Amber `#F59E0B` | `warning` |
| Under Review | Amber `#F59E0B` | `warning` |
| Approved | Green `#16A34A` | `success` |
| Actioned | Teal `#007F7E` | `info` |
| Expired | Grey `#6B7280` | `muted` |
| Cancelled | Grey `#6B7280` | `muted` |
| Approved (Pending Product) | Amber `#F59E0B` | `warning` |
| Bill Received | Blue `#2C4C79` | `default` |
| Paid | Green `#16A34A` | `success` |
| Rejected | Red `#DC2626` | `destructive` |

---

## Open Questions

- [x] ~~Should the linkage chain visualisation be interactive?~~ **Yes — nodes are clickable, navigating to Budget tab or Supplier profile.** (CLR-UXQ2)
- [ ] What is the assessment creation form's full field set beyond category, purpose, and recommendation? (Assessor details, attached documents, validity override?)
- [x] ~~Should expired assessments be hidden by default?~~ **Yes — hidden by default with a "Show expired" toggle.** (CLR-UXQ3)

---

## Clarification Log

| ID | Phase | Question | Decision | Rationale |
|----|-------|----------|----------|-----------|
| CLR-UXQ1 | UX | Assessment detail: slide-over Sheet or dedicated sub-page? | **Slide-over Sheet** | Low volume per client; keeps table visible for context switching; matches shadcn Sheet pattern |
| CLR-UXQ2 | UX | Linkage chain nodes: interactive or informational? | **Interactive (clickable)** | Lets Care Partners navigate directly to Budget/Supplier; low implementation cost (just hrefs) |
| CLR-UXQ3 | UX | Expired assessments: hidden or visible by default? | **Hidden with toggle** | Expired items are stale; default view should focus on actionable assessments |
| CLR-UIQ1 | UI | LinkageChainVisualiser: SVG, CSS flexbox, or stepper? | **CSS flexbox + Card components** | Three shadcn Cards with CSS arrow connectors; simple, accessible, responsive |
| CLR-UIQ2 | UI | Assessment creation: Sheet or Dialog? | **Dialog (centered modal)** | Detail panel already uses Sheet; stacking Sheets is confusing; Dialog keeps interaction model clean |

---

## Approval

| Role | Name | Date | Status |
|------|------|------|--------|
| Product Manager | | | [ ] Approved |
| Developer | | | [ ] Approved |
