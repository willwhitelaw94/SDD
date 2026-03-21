---
title: "Design Challenge Comparison — Feedback Records Management"
---

# Design Challenge Comparison

```
      /\              ┌─────┐          ┌──┬──┬──┐        ┌────┬────────┐       │
     /  \             │S O A│          │  │  │  │        │    │        │       ●───
    / 🔺 \            │O B J│  ☕       │🃏│🃏│🃏│        │ ≡  │  ···   │      │ │
   / PETRA\           │A S S│          │  │  │  │        │    │        │     ●─┤ │
  /________\          │P L N│          └──┴──┴──┘        └────┴────────┘    │  │ │
                      └─────┘                                               ●──┘

  PYRAMID PETRA    CLINICAL CHRIS    CANVAS CLARA      SIDEBAR SAM      TIMELINE TESS
 "Urgency rises"  "If it's not      "Drag, drop,     "Never lose      "Everything tells
                   documented..."    done"             your place"      a story"
```

## Pattern Comparison

### Index / List View

| Student | Pattern | Pros | Cons |
|---------|---------|------|------|
| **Pyramid Petra** | Tier-based pyramid dashboard with clickable urgency tiers | Instant visual of workload shape; urgency literally rises | Unfamiliar pattern; takes screen space for the pyramid |
| **Clinical Chris** | Dense clinical register with 12+ columns | Maximum data density; familiar to clinical staff | Overwhelming for non-clinical users; small text |
| **Canvas Clara** | Kanban board with stage columns + cards | Visual workflow; see all stages simultaneously | Horizontal scrolling on narrow screens; card space limits |
| **Sidebar Sam** | Split panel — list left, preview right | Preview without navigating; fastest triage flow | Requires wide screen; list panel feels cramped |
| **Timeline Tess** | Chronological activity feed with expandable cards | Natural reading order; time-grouped context | Less efficient for scanning — must scroll linearly |

### Detail View

| Student | Pattern | Pros | Cons |
|---------|---------|------|------|
| **Pyramid Petra** | Tier-colored banner + ascending stage steps | Visual urgency at a glance; stage as elevation metaphor | Metaphor may confuse — "climbing" vs "progressing" |
| **Clinical Chris** | Structured clinical sections (Presentation, Assessment, Management) | Comprehensive; every field has a place; error-reducing | Dense; feels like paperwork for simple remediations |
| **Canvas Clara** | Slide-over panel from Kanban board | Board stays visible as context; quick close to return | Panel width limited; complex records feel cramped |
| **Sidebar Sam** | Expanded right panel (75%) with collapsible sections | Progressive disclosure; list still visible for context | Two panels compete for attention |
| **Timeline Tess** | Full record timeline with all events chronologically | Complete audit trail; see the whole story at once | Long records require lots of scrolling |

### Stage Lifecycle Visualization

| Student | Pattern | Pros | Cons |
|---------|---------|------|------|
| **Pyramid Petra** | Ascending bar-chart steps (taller = closer to resolution) | Creative visual metaphor; unique | Non-standard; needs explanation |
| **Clinical Chris** | Clinical pathway with stage history timestamps | Precise; timestamped; clinical compliance | Text-heavy; less visual impact |
| **Canvas Clara** | Kanban columns ARE the stages (drag to advance) | Most intuitive — literally move cards between stages | Can't see full pipeline when viewing detail |
| **Sidebar Sam** | Horizontal pipeline bar with dots | Clean, standard, takes minimal space | Less interactive than drag-to-advance |
| **Timeline Tess** | Stage changes as timeline events with timestamps | Chronological context for each transition | Stages scattered among other events |

### Notes / Comments

| Student | Pattern | Pros | Cons |
|---------|---------|------|------|
| **Pyramid Petra** | Timeline with severity-colored escalation markers | Highlights critical notes visually | Color coding adds complexity |
| **Clinical Chris** | SOAP notes (Subjective, Objective, Assessment, Plan) | Structured; clinically familiar; reduces omissions | Rigid format doesn't suit all note types |
| **Canvas Clara** | Trello-style card comments + activity feed | Familiar; lightweight; quick to add | Less structure for formal investigation notes |
| **Sidebar Sam** | Note thread in tabbed detail panel | Notes alongside other tabs; compact | Tab switching adds clicks |
| **Timeline Tess** | Notes as timeline events with type filtering | Notes in full chronological context with other events | Filtering needed to see notes-only view |

### Action Plan

| Student | Pattern | Pros | Cons |
|---------|---------|------|------|
| **Pyramid Petra** | Actions grouped by priority tier (Critical/Important/Standard) | Priority-first organization; per-tier progress | Adds tier classification overhead |
| **Clinical Chris** | Care plan with structured fields per action | Comprehensive; familiar clinical accountability | Heavy UI for simple checklists |
| **Canvas Clara** | Trello checklist with progress bar | Simple, fast, universal pattern | Limited metadata per item |
| **Sidebar Sam** | Checklist in tabbed detail panel | Clean; integrated with other record sections | Tab-switching friction |
| **Timeline Tess** | Action items as color-coded timeline events | See when items were created/completed in context | Linear layout less scannable than a list |

### Create Form

| Student | Pattern | Pros | Cons |
|---------|---------|------|------|
| **Pyramid Petra** | Pyramid triage picker as hero interaction | Memorable; triage decision front and center | Novelty may slow down experienced users |
| **Clinical Chris** | Structured assessment form with required fields + triage scale (1-5) | Thorough; reduces errors; maps to clinical triage | Long form; feels like paperwork |
| **Canvas Clara** | Modal with card preview showing result | See what you're creating before submitting | Modal limits screen space |
| **Sidebar Sam** | Form in right panel (list dimmed) | Context preserved; cancel returns to list | Form width constrained by split layout |
| **Timeline Tess** | Form as first event in a new timeline | Creative framing — "starting the story" | Unusual; preview of future events is speculative |

## Trade-off Matrix

| Criteria | Pyramid Petra | Clinical Chris | Canvas Clara | Sidebar Sam | Timeline Tess |
|----------|:------------:|:--------------:|:------------:|:-----------:|:-------------:|
| **Familiarity** | ★★☆☆☆ | ★★★★★ | ★★★★☆ | ★★★★☆ | ★★★★☆ |
| **Speed** | ★★★☆☆ | ★★★☆☆ | ★★★★☆ | ★★★★★ | ★★★☆☆ |
| **Clarity** | ★★★★☆ | ★★★★☆ | ★★★★★ | ★★★★☆ | ★★★★☆ |
| **Scalability** | ★★★☆☆ | ★★★★★ | ★★★★☆ | ★★★★☆ | ★★★☆☆ |
| **Info Density** | ★★★☆☆ | ★★★★★ | ★★★☆☆ | ★★★★☆ | ★★★☆☆ |
| **Learnability** | ★★☆☆☆ | ★★★☆☆ | ★★★★★ | ★★★★★ | ★★★★☆ |
| **Mobile-friendly** | ★★☆☆☆ | ★★☆☆☆ | ★★★☆☆ | ★★☆☆☆ | ★★★★★ |

## Cherry-Pick Recommendations

### Adopt (High Confidence)

| Pattern | Source | Why |
|---------|--------|-----|
| **Split-panel triage view** | Sidebar Sam | Preview records without navigating — dramatically faster triage. THE killer feature for daily workflow |
| **Kanban board as secondary view** | Canvas Clara | Stage columns give instant visual of pipeline; toggle between list and board views |
| **SOAP note structure** | Clinical Chris | Structured notes reduce omissions; familiar to aged care clinical staff |
| **Clinical triage scale (1-5)** | Clinical Chris | Maps to Australasian Triage Scale conventions staff already know |
| **Horizontal stage pipeline bar** | Sidebar Sam | Clean, standard lifecycle visualization that takes minimal space |
| **Interleaved timeline** | Timeline Tess | Mixing notes + stage changes + action items creates a complete audit trail |
| **Progress bar on action plan** | All students | Universal pattern — all five used it. Clear completion status at a glance |
| **Overdue indicators** | All students | Red badges, flame icons, pulsing dots — overdue must be impossible to miss |

### Consider (Worth Testing)

| Pattern | Source | Why |
|---------|--------|-----|
| **Pyramid urgency dashboard** | Pyramid Petra | Visually striking for a dashboard/overview, but may be too novel for the index |
| **Dense clinical register** | Clinical Chris | Power users would benefit from high density; could be a "compact view" toggle |
| **Drag-to-advance** | Canvas Clara | Intuitive stage transitions, but requires careful permission handling |
| **Card preview on create** | Canvas Clara | Seeing what the card will look like before submitting reduces errors |
| **Event type filtering** | Timeline Tess | Filter timeline by Notes/Stage Changes/Action Items — useful for investigation review |
| **SOAP note template** | Clinical Chris | Pre-structured note form with S/O/A/P sections, but optional (not forced) |

### Skip (Not Right for TC Portal)

| Pattern | Source | Why |
|---------|--------|-----|
| Pyramid as primary navigation | Pyramid Petra | Too novel; care staff need familiar patterns, not a learning curve |
| Ascending stage metaphor | Pyramid Petra | "Climbing" stages is confusing — stages are linear progression, not elevation |
| 12-column dense register default | Clinical Chris | Too dense for the majority; better as an optional compact view |
| Timeline-only index | Timeline Tess | Linear feed is slow for scanning 50+ records; need table/list as primary |
| Form as "first timeline event" | Timeline Tess | Creative but confusing — a form should look like a form |

## Implementation Priority

### Phase 1 — Core (MVP)
1. Split-panel index with list + preview (Sam) — primary interaction model
2. Standard table/list view as default (Chris density available as toggle)
3. Detail view with horizontal stage pipeline + collapsible sections (Sam)
4. SOAP-structured notes with chronological timeline (Chris + Tess hybrid)
5. Clinical triage scale (1-5) with color coding (Chris)
6. Action plan checklist with progress bar (universal)
7. Package-scoped filtered view (all students)

### Phase 2 — Power Features
1. Kanban board view toggle (Clara) — switch between list and board
2. Interleaved timeline with event type filtering (Tess)
3. Drag-to-advance on Kanban board (Clara)
4. Dense/compact register mode toggle (Chris)

### Phase 3 — Nice-to-Have
1. Pyramid urgency dashboard widget (Petra) — for a management overview page
2. Card preview on create form (Clara)
3. SOAP note template (Chris) — optional structured format
