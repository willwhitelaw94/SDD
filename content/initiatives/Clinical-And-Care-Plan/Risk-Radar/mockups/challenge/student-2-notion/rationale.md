---
title: "Notion Nick — Rationale"
description: "Why Notion's database-view patterns work for clinical risk management"
---

# Notion Nick — Rationale

> Why a database-view philosophy is a natural fit for clinical risk management.

---

## The Core Insight

Clinical risk management IS a database problem. Care Partners manage a collection of risk records, each with structured properties (category, consequence, status, domain), and need to view that collection in different ways depending on their task. Notion's "everything is a database" philosophy maps directly to this need.

---

## Why Multi-View Works for Risk

A Care Partner's relationship with risk data changes throughout the day:

- **Morning check**: Scan cards for anything red — need the cards view for quick visual triage
- **Clinical meeting**: Need the table view for dense, sortable data to discuss with clinicians
- **Care planning**: Need the board view grouped by status to see what needs attention vs what's stable

Rather than building three separate pages, a single view-toggle toolbar lets the same data serve all three contexts. This reduces navigation, keeps context, and respects the user's workflow.

---

## Why Inline Properties Beat Modals

Traditional clinical software hides risk details behind "View" or "Edit" buttons, forcing users into modal after modal. Notion's inline property system keeps critical metadata visible at all times:

- A consequence tag reading "Major (3)" in orange tells the story without a click
- A traffic-light dot next to "Falls" communicates status in peripheral vision
- "In care plan: Yes" as a visible property prevents the question "is this being managed?"

For clinical safety, information that's always visible is information that's always actionable.

---

## Why Toggle Blocks Suit Progressive Disclosure

Risk cards need to show enough to scan but hide enough to not overwhelm. Notion's toggle blocks are the perfect mechanism:

- **Collapsed**: Category, status badge, consequence tag, one-line summary
- **Expanded**: Check-in questions, assessment history, detailed notes

This maps directly to the clinical workflow: scan for problems (collapsed), investigate a specific risk (expanded). The toggle triangle is intuitive — no "show more" links, no accordion headers to decode.

---

## Why Page-as-Form Reduces Friction

Opening a modal to create a risk feels transactional and rushed. Notion's page-as-form approach feels like writing a clinical note — spacious, focused, no visual pressure. Properties at the top provide structure, the body area provides freedom.

For a 3-step risk form (Basics, Details, Check-In Questions), breadcrumb-style step navigation feels like moving through pages of a document rather than filling out a bureaucratic form.

---

## Why Warm Typography Matters for Clinical Tools

Clinical software is often sterile and anxiety-inducing. Notion's warm, rounded visual language — generous spacing, soft colours, friendly typography — makes risk data feel manageable rather than overwhelming. A Care Partner reviewing a Red risk status should feel informed and empowered to act, not alarmed and confused.

---

## Trade-offs Acknowledged

| Concern | Response |
|---------|----------|
| **Notion feels too casual for clinical data** | The warmth is in the visual treatment, not the data. Consequence scores and traffic lights remain rigorous. |
| **View switching adds complexity** | Default to cards (most familiar). Table and board are power-user options, not mandatory. |
| **Inline editing risks accidental changes** | This mockup shows inline display, not inline editing. Edit actions are behind explicit controls. |
| **Not all users know Notion** | The patterns (cards, tags, toggles) are universal. The inspiration is Notion; the execution is TC Portal. |
