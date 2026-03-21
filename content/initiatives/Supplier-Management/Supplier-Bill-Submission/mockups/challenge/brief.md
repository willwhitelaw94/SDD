# Design Challenge Brief: Supplier Invoice Uplift

## Challenge Overview

Design the complete supplier-facing experience for invoice submission, tracking, and client management in the TC Portal. This combines SBS (Supplier Bill Submission) and OHB (On Hold Bills) supplier-side features into one cohesive experience.

## Feature Summary

Suppliers need to:
1. Submit invoices via email (see unique email address, copy it, per-client emails)
2. Submit invoices via bulk upload (drag-drop dropzone, AI document splitting, In Tray review)
3. Submit invoices via public form (unauthenticated, ABN-based matching)
4. Track invoice status with enriched on-hold/rejection details (privacy-filtered OHB reasons)
5. View and manage client relationships (With Agreements / Invoiced / Archived tabs)
6. Resubmit rejected invoices (upsert existing bill, REJECTED -> SUBMITTED)

## User Stories to Address

| # | Story | Priority |
|---|-------|----------|
| US1 | Submit Invoice via Email | P1 |
| US2 | View My Unique Email Address | P1 |
| US3 | Per-Client Email Addresses | P2 |
| US4 | View Clients with Agreements (tabbed) | P2 |
| US5 | View Archived Clients | P3 |
| US6 | Submit Invoice via Public Link | P2 |
| US7 | Bulk Invoice Upload with Document Splitting | P2 |
| OHB | On-hold/rejection reason display (supplier side) | P2 |

## Screens to Design (7 per student)

| # | Screen | Key Interactions |
|---|--------|-----------------|
| 01 | **Supplier Dashboard** | Email address callout with copy button, quick stats, profile completion |
| 02 | **Invoices List** | Bills table with email banner, status badges (on-hold count), bulk upload dropzone, source filter (Email/Portal/Public) |
| 03 | **Invoice Detail (Show)** | Read-only bill view + OHB action panel (on-hold reasons, REJECT-RESUBMIT with [Resubmit], REJECT PERIOD with "do not resubmit", ON HOLD with "no action needed") |
| 04 | **Invoice Create/Edit** | 3-step wizard (upload PDF -> details -> line items -> review). Existing flow, explore improvements |
| 05 | **Clients Page** | Tabbed interface (All / With Agreements / Invoiced / Archived) + per-client email addresses with copy/generate buttons |
| 06 | **In Tray** | Bulk upload progress view, AI split review with merge/re-split, per-document status (processing/success/failed), confirm & submit |
| 07 | **Public Bill Form** | Unauthenticated `/bills` form: ABN, supplier name, client name, PDF upload, service picklist, reCAPTCHA. Confirmation with #TC-XXXX reference |

## Design Constraints

- **Privacy**: Suppliers must NEVER see client-specific on-hold reasons. Only `Touches_Invoice = true` reasons shown with detail. Internal reasons shown as "Other processes being completed".
- **Email format**: `supplier-{token}@inbound.trilogycare.com.au`
- **On-hold bills are read-only** for suppliers
- **Resubmit = upsert** existing bill (REJECTED -> SUBMITTED), not create new
- **Desktop-first** but responsive
- **TC Portal design system** — use Common component patterns (Badge, Tabs, Table, Card, etc.)

## Design Principles

**North Star:** Effortless submission — submitting and tracking invoices should feel like zero friction.

Supporting:
1. **Show, don't ask** — Email address front and center, don't make suppliers hunt
2. **One glance status** — Know where every bill is without clicking into it
3. **Privacy-preserving transparency** — Show what suppliers need to act on, hide internal reasons
4. **Progressive disclosure** — Simple surface, detail on demand

## Evaluation Criteria

1. **Familiarity** — How recognizable are the patterns? (Jakob's Law)
2. **Speed** — How fast can suppliers complete tasks?
3. **Clarity** — Is the status/action obvious at a glance?
4. **Scalability** — Does it work for 5 invoices or 500?
5. **Cohesion** — Does the whole experience feel unified?

## Students

| Student | Theme | Focus |
|---------|-------|-------|
| Linear Lisa | **Linear** | Clean minimal UI, command palette, keyboard shortcuts |
| Notion Nick | **Notion** | Database views, inline editing, flexible layouts |
| GitHub Gary | **GitHub** | Review workflow, timeline, status badges, batch actions |
| Superhuman Sam | **Superhuman** | Speed-first, triage workflow, keyboard navigation |

## Deliverables Per Student

1. `research.md` — 3-5 patterns researched with sources
2. `rationale.md` — Why these patterns work for suppliers
3. `01-dashboard.html` through `07-public-form.html` — HTML mockups with portal shell
