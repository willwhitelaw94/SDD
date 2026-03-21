---
title: "Notion Nick — Research"
description: "Design patterns researched from Notion's database-view UI philosophy for Risk Radar"
---

# Notion Nick — Research

> "Everything is a database." — Notion's core UI philosophy applied to clinical risk management.

---

## Pattern 1: Multi-View Database (Cards / Table / Board)

Notion lets users switch between views of the same underlying data without navigating away. A single dataset can be rendered as a gallery of cards, a spreadsheet table, a Kanban board, a timeline, or a calendar — all from the same page.

**How it applies to Risk Radar:**
- Risk cards (default) give scannable clinical context
- Table view gives dense, sortable data for power users
- Board view groups risks by status (Green / Amber / Red / Not Assessed)
- The view toggle lives in a toolbar above the content, not buried in settings

**Source:** Notion Databases documentation — views, filters, sorts, and grouping are first-class UI citizens shown prominently above content.

---

## Pattern 2: Inline Property Tags

Every Notion database row has rich, typed properties displayed as colourful inline tags — select dropdowns, multi-selects, dates, people, checkboxes, numbers. These properties are always visible on cards and rows, providing instant context without opening the item.

**How it applies to Risk Radar:**
- Consequence level → coloured tag (Negligible/Minor/Moderate/Major/Extreme)
- Traffic-light status → dot + label tag
- Category → emoji + text tag
- Domain membership → subtle badge
- "In care plan" → checkbox property
- Last assessed → relative date tag

**Source:** Notion's property system — each property type has a distinct visual treatment (pill shape, colour coding, icon prefix) making scanning effortless.

---

## Pattern 3: Toggle Blocks (Progressive Disclosure)

Notion's toggle blocks let content unfold in place. A triangle icon rotates to reveal nested content — no modals, no page navigations. This is Notion's answer to progressive disclosure: show the headline, let users expand for detail.

**How it applies to Risk Radar:**
- Check-in questions accordion on each risk card
- Domain drill-down in the radar view (expand a domain to see its risk areas)
- Assessment history can unfold below a risk card
- Form sections can use toggle blocks for optional fields

**Source:** Notion toggle blocks — used extensively for FAQs, nested content, and documentation structure. The triangle icon is universally understood as "click to expand."

---

## Pattern 4: Page-as-Form (Full-Page Editing)

In Notion, creating a new database entry opens a full page — not a modal or sidebar. The page IS the form. Properties are edited inline at the top, and the body is a freeform content area. This feels spacious and focused rather than cramped.

**How it applies to Risk Radar:**
- Step-based risk form rendered as a full page with breadcrumb navigation
- Properties (category, need, care plan toggle) at the top like Notion page properties
- Details and action plan in the body area as rich text blocks
- Slash command hint suggests adding more content
- Feels like writing a document, not filling out a form

**Source:** Notion database item pages — property panel at top, content body below, breadcrumb navigation showing hierarchy.

---

## Pattern 5: Warm, Rounded Visual Language

Notion's visual design is distinctly warm and approachable compared to most productivity tools. Slightly rounded corners, generous spacing, soft shadows, friendly sans-serif typography (Inter or similar), and subtle hover states create a non-intimidating interface.

**How it applies to Risk Radar:**
- Clinical risk data can feel intimidating — Notion's warmth softens the presentation
- Rounded cards with generous padding reduce cognitive load
- Soft colour palette for tags (not harsh primaries)
- Hover states that feel inviting rather than utilitarian
- Typography that feels like reading a document, not scanning a spreadsheet

**Source:** Notion's design system — observed across their product, marketing site, and template gallery. The "friendly productivity" aesthetic is a deliberate differentiator.
