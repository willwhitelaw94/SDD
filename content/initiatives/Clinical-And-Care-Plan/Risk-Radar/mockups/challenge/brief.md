# Design Challenge Brief: Risk Radar

## Challenge Overview

Design the Risk Radar feature — a clinical risk management system that replaces a flat data table with card-based risk profiles, consequence scoring, traffic-light status indicators, and a 5-domain radar visualisation.

## Feature Summary

Care Partners manage client risks daily. Currently risks sit in a PrimeVue DataTable with no scoring, no visual summary, and check-in questions hidden inside an edit modal. Risk Radar transforms this into:

- **Card-based risk layout** with inline check-in questions accordion
- **Step-based risk form** (3 steps: Basics, Details, Check-In Questions)
- **Consequence assessment** via clinical questionnaire (16 risk areas, 0-4 scoring)
- **Mitigation assessment** per clinical domain (Strong/Partial/None)
- **Residual risk** = max(consequence) - mitigation → traffic-light (Green/Amber/Red)
- **Radar chart** showing 5 clinical domains with domain drill-down
- **Traffic-light badge** on package header for at-a-glance status

## User Stories to Address

1. **US-0**: View risks as cards with inline check-in questions accordion
2. **US-0b**: Step-based risk form (3 steps)
3. **US-1**: Assess consequence via questionnaire (one-at-a-time wizard)
4. **US-2**: Assess mitigation per domain (Strong/Partial/None)
5. **US-3**: See traffic-light status (Green/Amber/Red)
6. **US-4**: View domain scores on radar/bar chart

## Screens to Design (6 per student)

| # | Screen | Key Elements |
|---|--------|-------------|
| 1 | All Risks (cards) | Risk cards with category, badges, details, action plan, dropdown actions, accordion |
| 2 | Risk Radar sub-tab | Radar chart, bar chart toggle, traffic-light badge, domain labels |
| 3 | Card with expanded accordion | Check-in questions visible, answer type badges, drag-and-drop reorder |
| 4 | Step-based risk form | 3-step wizard with CommonStepNavigation, conditional Step 2 |
| 5 | Assessment wizard modal | One-at-a-time questionnaire (1 of 16), Skip/Save & Next, consequence options |
| 6 | Domain drill-down | Inline expand below chart, risk areas with consequence + mitigation detail |

## Key Design Decisions (from design.md)

- **Default tab**: All Risks (familiar starting point)
- **Card actions**: Dropdown menu (three-dot)
- **Card layout**: Single column, full width, sorted by last updated
- **Traffic-light badge**: Dot + label (e.g., "Red — Safety")
- **Assessment flow**: One-at-a-time wizard modal
- **Drill-down**: Inline expand below chart
- **Chart**: Chart.js radar type (5 axes)

## Constraints

- Desktop-first (full-width cards, radar chart)
- WCAG AA — traffic-light colours supplemented with text labels
- Two independent feature flags (Check-Ins, Risk Radar)
- 28 existing risk categories, 16 map to clinical risk areas, 5 clinical domains
- Existing risks display as "Not assessed" until scored

## Evaluation Criteria

1. **Clinical confidence** — Does it inspire trust? Can a Care Partner understand risk in < 5 seconds?
2. **Scannability** — Can you scan 8-10 risk cards quickly without reading everything?
3. **Progressive disclosure** — Simple first, complexity on demand?
4. **Consistency** — Does it feel like TC Portal? Common components, teal brand, existing patterns?

## Students

| Student | Theme | Focus |
|---------|-------|-------|
| Linear Lisa | Clean minimal | Command palette, keyboard shortcuts, focused interfaces |
| Notion Nick | Database views | Inline editing, flexible layouts, toggleable views |
| Superhuman Sam | Speed-first | Triage workflow, keyboard navigation, batch actions |

## Deliverables Per Student

1. `research.md` — 3-5 patterns researched with sources
2. `rationale.md` — Why these patterns work for Risk Radar
3. 6 HTML mockup pages — one per screen
