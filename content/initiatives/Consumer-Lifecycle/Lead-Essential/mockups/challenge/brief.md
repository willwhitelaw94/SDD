---
title: "Design Challenge Brief: Lead Essential (LES)"
---

# Design Challenge Brief: Lead Essential (LES)

## Challenge Overview

Design the core staff-facing lead management screens for Trilogy Care Portal — replacing Zoho CRM as the primary workspace for viewing, managing, and progressing leads through the sales funnel.

## Feature Summary

LES establishes native lead management in the Portal. Sales staff need to view leads in a filterable list, manage individual lead profiles with section-based editing, and progress leads through Journey Stages and Lead Statuses via guided wizards. The design must prioritise speed — agents work leads during phone calls.

## User Stories to Address

1. **Staff Leads List View** (P1) — Filterable table with key details at a glance, bulk actions, create lead
2. **Staff Lead Profile — Overview** (P1) — Sidebar + tabbed main, section cards with inline edit
3. **Journey Stage Wizard** (P1) — Stage selector with mandatory fields per transition

## Key Interactions to Design

1. **List → Profile navigation** — click lead to open profile, fast back-to-list
2. **Section card read/edit toggle** — inline expansion (ACRM pattern), no modals
3. **Journey Stage progression** — horizontal progress bar, click to open wizard
4. **Quick actions** — assign agent, update status, add note without leaving context
5. **Bulk operations** — select multiple leads, assign agent, export

## Design Principles (from design.md)

1. **Speed over polish** — optimise for agent efficiency
2. **Context without navigation** — key info visible from any tab
3. **Edit where you read** — section cards toggle in-place
4. **Pipeline first** — Journey Stage + Lead Status most prominent
5. **Familiar > clever** — patterns staff know from CRMs

## Constraints

- Desktop-first (sales staff on desktop all day)
- TC Portal design system (CommonCard, CommonForm, CommonTable, etc.)
- 2-panel layout (sidebar + main) — matches existing Portal patterns
- Inline card expansion for editing (not modals)
- Journey Stage: 6 primary stages (Pre-Care → ACAT Booked → Approved → Allocated → Active → Converted)
- Lead Status: Not Contacted, Attempted Contact, Made Contact, Lost

## Evaluation Criteria

1. **Familiarity** — How recognizable are the patterns from existing CRMs?
2. **Speed** — How fast can agents complete tasks during a phone call?
3. **Clarity** — Is the pipeline status obvious at a glance?
4. **Scalability** — Does it work for 50 leads or 5,000?
5. **Consistency** — Does it fit with existing TC Portal patterns?

## Students

| # | Student | Theme | Focus |
|---|---------|-------|-------|
| 1 | Linear Lisa | **Linear** | Clean minimal UI, command palette, keyboard shortcuts |
| 2 | Notion Nick | **Notion** | Database views, inline editing, flexible layouts |
| 3 | GitHub Gary | **GitHub** | Review workflow, timeline, status badges, batch actions |
| 4 | Superhuman Sam | **Superhuman** | Speed-first, triage workflow, keyboard navigation |
| 5 | HubSpot Hannah | **HubSpot** | 3-column layouts, customizable cards, activity-centric |

## Screens Per Student

Each student designs 3 screens from their paradigm:

1. **Lead Profile — Overview** — The main profile view (sidebar + section cards)
2. **List View** — The filterable leads table
3. **Journey Stage Wizard** — Stage transition modal/wizard

## Deliverables Per Student

1. `research.md` — 3-5 patterns researched from their paradigm
2. `rationale.md` — Why these patterns work for TC Portal
3. `01-profile-overview.html` — Lead profile mockup
4. `02-list-view.html` — Leads list view mockup
5. `03-journey-stage-wizard.html` — Stage transition wizard mockup
