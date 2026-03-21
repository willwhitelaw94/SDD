---
title: "Needs V2 — Design Challenge Comparison"
---

# Needs V2 — Design Challenge Comparison

## Meet the Students

```
    PETRA                CHRIS                CLARA                SAM                  TESS
   /\    /\           _______             _________            ___|___              __||__
  /  \  /  \         |  O  O |           | o    o  |          | |O O| |            | O  O |
 / /\ \/ /\ \        | \__/ |           |  \__/   |          | |__| | |           | \__/ |
 \ \/ /\ \/ /        |______|           |_________|          |___|___|_|          |__||__|
  \  /  \  /         /|    |\            /|      |\           /|     |\            /|    |\
   \/    \/         / |    | \          / |      | \         / |     | \          / |    | \
  PYRAMID          CLIPBOARD          CARD BOARD           SPLIT PANEL          TIMELINE
  Visual            Clinical           Canvas               Contextual           Activity
  Hierarchy         Register           Board                Sidebar              Feed
```

## Pattern Comparison — List View

| Aspect | Petra (Pyramid) | Chris (Clinical) | Clara (Canvas) | Sam (Sidebar) | Tess (Timeline) |
|---|---|---|---|---|---|
| **Layout** | Pyramid panel + card list | Full-width table | Horizontal swim lanes | Split panel: list left, detail right | Vertical timeline stream |
| **Tier grouping** | SVG pyramid segments | Collapsible `<tbody>` rows | Swim lane per tier | Grouped list with tier headers | Chronological, grouped by date/tier |
| **Need representation** | Card with icon, badge, description | Table row with 9 columns | Card with left-border accent | Compact row item, detail in side panel | Timeline card with expandable content |
| **Status display** | Colour-coded pill badge | Pill badge in table cell | Tiny status dot | Inline badge in list row | Status icon on timeline node |
| **Priority** | Not shown | H/M/L circle badges | Not shown | Inline indicator | Colour-coded timeline node |
| **Service count** | Link icon + count | Numeric column | Pill badge | Shown in detail panel | Nested under timeline card |
| **Filtering** | Pyramid click to filter tier | Dropdown filters + search | Board/List toggle only | Filter bar above list panel | Filter bar above timeline |
| **Summary stats** | "8 needs total" on pyramid | 5-stat bar (Total/Active/Draft/High/Services) | None | Count in list panel header | None (timeline is the narrative) |

## Pattern Comparison — Create Flow

| Aspect | Petra | Chris | Clara | Sam | Tess |
|---|---|---|---|---|---|
| **Entry point** | Header "Add Need" button | Header "New Assessment" button | Inline "+ Add" per lane | "+ Add" button in list panel header | "+ Add" button at top of timeline |
| **Creation context** | Navigates to full-page form | Navigates to full-page form | Inline within swim lane | Opens form in detail panel (list stays visible) | Inline card creation at timeline head |
| **Tier selection** | Explicit step in form | Dropdown in form | Implicit from lane position | Dropdown in detail panel form | Dropdown in inline form |
| **Field density** | Moderate — guided steps | High — all assessment fields visible | Low — quick capture | Moderate — form in side panel | Low — progressive, expand for more |

## Pattern Comparison — Detail View

| Aspect | Petra | Chris | Clara | Sam | Tess |
|---|---|---|---|---|---|
| **Layout** | Full-page with sidebar context | Full-page clinical record | Card expansion / slide-over | Detail fills right panel, list persists on left | Timeline card expands inline |
| **Clinical data** | Moderate detail | Full SOAP-note style | Summary only | Full detail in panel with tabs | Progressive disclosure via expand/collapse |
| **Service linking** | Linked services list | Service count column | Badge with count | Linked services tab in panel | Nested service cards under timeline entry |
| **Audit trail** | Not shown | Review date column | Not shown | Activity log tab in panel | Native — timeline IS the audit trail |

## Trade-off Matrix

Ratings are 1-5 stars where 5 is best-in-class.

| Criterion | Petra | Chris | Clara | Sam | Tess | Notes |
|---|---|---|---|---|---|---|
| **Speed** (time to scan full list) | ★★★ | ★★★ | ★★ | ★★★★ | ★★★ | Sam keeps list always visible; Tess trades scan speed for narrative context |
| **Clarity** (understanding a single need) | ★★★★ | ★★★★★ | ★★★★ | ★★★★★ | ★★★★ | Sam's persistent detail panel matches Chris for clarity; Tess relies on expansion |
| **Scalability** (20+ needs) | ★★ | ★★★★★ | ★★★★ | ★★★★ | ★★★ | Tables scale best; Sam's split panel handles growth well; Tess becomes a long scroll |
| **Service Linking** (visibility of connections) | ★★★★ | ★★★★ | ★★★★ | ★★★★ | ★★★ | Sam shows services in detail panel tabs; Tess nests them under timeline cards |
| **Learnability** (new user picks it up fast) | ★★★ | ★★★ | ★★★★ | ★★★★★ | ★★★★ | Sam mirrors email/Slack/Linear — instantly familiar; Tess borrows from social feeds |

**Overall weighted (Care Partner persona):**
Sam (4.4) > Clara (3.6) > Chris (3.4) > Tess (3.4) > Petra (3.2)

**Overall weighted (Clinical/Coordinator persona):**
Chris (4.4) > Sam (4.0) > Petra (3.6) > Clara (3.4) > Tess (3.2)

## Cherry-Pick Recommendations

### Adopt

| Pattern | Source | Why |
|---|---|---|
| Visual tier grouping with colour coding | Petra | Colour-per-tier (red/amber/green/blue/purple) is universally useful regardless of layout |
| Pyramid overview as a dashboard widget | Petra | Works as a supplementary snapshot, not the primary navigation |
| Structured data columns (Priority, Reviewed, Funding) | Chris | Essential for clinical workflows; expose as optional columns |
| Collapsible tier groups | Chris | Scales well for clients with many needs |
| Summary statistics bar | Chris | 5-stat bar gives instant orientation without occupying much space |
| Filter bar with search | Chris | Dropdown filters + search are table stakes for any list > 5 items |
| Swim-lane tier layout | Clara | Horizontal card rows per tier are intuitive and support inline create |
| Inline "+ Add" per tier | Clara | Reduces misclassification and keeps the user in context |
| Board/List view toggle | Clara | Different tasks need different views; let the user choose |
| Drag handle affordance | Clara | Even without full drag-drop, the visual hint communicates reorderability |
| Split Panel Context | Sam | Always-visible list while viewing detail — no navigation, no lost context |
| In-panel create/edit | Sam | Form opens in detail panel; list stays visible for reference |
| Tabbed detail panel | Sam | Tabs for Overview / Services / Activity keep the detail panel organised |
| Timeline Activity Feed | Tess | Needs as a scrollable story with inline expansion — good for audit and history |
| Chronological narrative | Tess | Timeline view doubles as an activity log, reducing need for a separate audit trail |

### Do Not Adopt

| Pattern | Source | Why |
|---|---|---|
| Pyramid as primary navigation | Petra | Too unconventional; better as a widget |
| SVG polygon clip-paths | Petra | Maintenance cost outweighs visual benefit |
| 10px font size (xs3) | Chris | Below WCAG readability recommendations |
| Print button in header | Chris | Useful but low priority; implement later |
| Fixed-width horizontal scroll cards | Clara | Hides content off-screen; use a responsive grid instead |
| Drag-and-drop reordering | Clara | High implementation cost, low frequency of use |
| Timeline as sole list view | Tess | Chronological ordering alone is insufficient for task-oriented scanning |
| Inline-only expansion | Tess | Detail via expand works for quick glance but not for deep editing |

## Implementation Priority

### Phase 1 — Core List (MVP)

- Sam-style split panel as the default view (list left, detail right)
- Tier grouping with colour-coded labels (Petra's palette)
- Priority indicator per need (Chris's H/M/L badge)
- Summary line: total, active, linked services
- Click row to show detail in side panel (Sam)
- Header "+ Add Need" button

### Phase 2 — Enhanced Interaction

- Collapsible tier groups (Chris)
- Filter bar: tier, priority, status, search (Chris)
- Board view toggle with Clara's swim lanes
- Inline "+ Add" per tier in board view
- Tabbed detail panel: Overview / Services / Activity (Sam)
- Timeline view toggle for audit-oriented users (Tess)

### Phase 3 — Advanced Features

- Pyramid dashboard widget on the client overview page (Petra)
- Drag-and-drop card reordering in board view (Clara)
- Print/Export PDF (Chris)
- Clinical assessment scores visible as optional columns (Chris)
- Review date tracking and compliance indicators (Chris)
- Activity feed timeline within Sam's detail panel (Tess + Sam hybrid)
