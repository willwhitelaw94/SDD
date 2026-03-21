# Pyramid Petra — Research Notes

## Design Concept
Using Maslow's hierarchy of needs pyramid as the core UI paradigm for complaint/feedback triage. Urgency maps to elevation — critical items rise to the apex, routine items settle at the base.

---

## Pattern 1: Maslow Pyramid Visualizations in UX

**Source:** Various health/wellness apps (Headspace onboarding, BetterHelp needs assessment)

Maslow's pyramid is one of the most universally recognized information hierarchies. Users intuitively understand that the top is scarce and important, while the base is foundational and broad. Translating this to complaint triage means:

- **Apex (narrow)** = Urgent — few records, maximum attention required
- **Middle band** = Medium — moderate volume, needs monitoring
- **Base (wide)** = Standard — high volume, routine processing

The visual shape itself communicates workload distribution — a healthy system looks like a proper pyramid (few urgent, many standard). An inverted pyramid signals a crisis.

**Applicable elements:** Stacked trapezoid sections with count badges, color gradient from red (top) through amber to teal (base), clickable tiers that filter content below.

---

## Pattern 2: Eisenhower Priority Matrix / Risk Heat Maps

**Source:** Todoist priority views, Jira risk matrices, enterprise GRC dashboards

Priority matrices use spatial positioning to encode two dimensions (urgency vs. impact). Heat maps use color intensity to show severity concentration. Both patterns help coordinators quickly assess "where should I focus?"

Key techniques:
- Color saturation increases with severity (pale green → deep red)
- Cell size or area proportional to record count
- Hover/click reveals detail without leaving the overview
- Totals and percentages shown per quadrant/tier

**Applicable elements:** Tier-based color coding with consistent meaning (red=urgent, amber=medium, teal=standard), count indicators per tier, percentage distribution.

---

## Pattern 3: Tiered Dashboard Patterns (Funnel/Pyramid Charts)

**Source:** Salesforce pipeline funnels, Google Analytics conversion funnels, HubSpot deal stages

Funnel visualizations show progressive narrowing — many items enter, fewer progress through each stage. Inverting this for triage gives us the pyramid: many standard items at the base, progressively fewer at higher severity levels.

Dashboard patterns that work:
- Hero visualization (the pyramid) dominates the top of the page
- Supporting metrics (totals, averages, overdue counts) in a stats bar
- Filtered list/table below that responds to tier selection
- Animated transitions when filtering

**Applicable elements:** CSS clip-path pyramid with three tiers, interactive filtering on click, stats summary bar, responsive table below.

---

## Pattern 4: Severity-Based Color Gradients in Healthcare

**Source:** Triage systems (Manchester Triage, Australasian Triage Scale), clinical dashboards

Healthcare triage already uses color-coded severity bands. The Australasian Triage Scale uses 5 categories from red (resuscitation) through to blue (non-urgent). Aged care complaint systems naturally map to this pattern.

Key principles:
- Colors must be distinguishable for color-blind users (use shape/icon + color)
- Severity banner at the top of detail views provides instant context
- Stage progression uses stepped/ascending visuals
- Overdue indicators use pulsing or contrasting badges

**Applicable elements:** Tier-colored banners on detail views, ascending step indicators for stage progression, overdue pulse animations, accessible color + icon combinations.

---

## Pattern 5: Spatial Hierarchy in Information Architecture

**Source:** Card-sorting UX research, progressive disclosure patterns, newspaper above-the-fold design

Spatial hierarchy means the most important content occupies the most prominent position. In print, this is "above the fold." In our pyramid UI:

- The apex physically sits at the top of the viewport — urgent items are literally "above" everything else
- Each tier can expand/collapse to show its records
- The pyramid acts as both visualization AND navigation
- Detail views maintain tier awareness through persistent color coding

**Applicable elements:** Pyramid as primary navigation element, persistent tier indicators across all views, spatial memory (users learn "red = top = urgent"), expandable tier sections.

---

## Synthesis

The pyramid paradigm works for complaint triage because:
1. **Natural mapping** — urgency → elevation is intuitive
2. **Shape = health indicator** — proper pyramid shape = healthy caseload distribution
3. **Dual function** — the pyramid is both dashboard (see distribution) and navigation (filter by tier)
4. **Color gradient** — red→amber→teal provides instant severity recognition
5. **Aged care context** — healthcare triage color systems are already familiar to care coordinators
