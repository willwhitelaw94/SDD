---
name: trilogy-spec-explorer
description: >-
  Generates an interactive canvas-based spec explorer. Two modes: (1) Per-epic — scoped to current
  epic's spec.md with story map canvas, FR traceability, and prompt generator. (2) Portfolio — all
  epics across initiatives in domain swim lanes with status columns for visual prioritisation.
  Triggers on: spec explorer, spec playground, story map, explore spec, review spec visually,
  portfolio view, all epics, prioritise epics.
metadata:
  version: 1.0.0
  type: agent
---

# Spec Explorer Skill

Generates an interactive, canvas-based spec explorer scoped to the current epic's specification. The output is a single self-contained HTML file opened in the browser — a visual review tool to explore user stories, acceptance scenarios, and functional requirements before spec handover.

## Purpose

1. **Reads** the epic's spec.md to extract all structured content
2. **Parses** user stories, acceptance scenarios, functional requirements, edge cases, success criteria, and dependencies
3. **Generates** a single HTML playground with canvas story map, detail panel, sidebar navigation, and prompt builder
4. **Opens** the result in the browser

## When to Use

```bash
/trilogy-spec-explorer              # Auto-detect epic from current branch (per-epic view)
/trilogy-spec-explorer --portfolio  # Portfolio view: all open/backlog specs in domain swim lanes
```

### Per-Epic Mode (default)
Run **before** `/trilogy-spec-handover` (Gate 1) as a final visual review of the spec. It helps you:
- See all stories at a glance, organised by priority swim lanes
- Trace acceptance scenarios to functional requirements
- Spot gaps in coverage
- Generate implementation prompts per story

### Portfolio Mode (`--portfolio`)
Run at **any time** to see the big picture across all initiatives. Generates an interactive playground with:
- **Domain swim lanes** — epics grouped by initiative (e.g., Clinical & Care Plan, Consumer Lifecycle)
- **Status-based columns** — Backlog → Design → Dev → Completed (kanban-style within each lane)
- **Draggable cards** — visually re-order and prioritise epics
- **Quick stats** — story count, AC count, completion % per epic
- **Filters** — by status (open, backlog, in progress), by domain, by priority
- **Cross-epic dependency arrows** — visualise blockers across domains
- **Clipboard export** — copy the prioritised order as markdown for BRP or planning sessions

Output: `.tc-docs/content/initiatives/spec-portfolio.html`

## Position in Workflow

```
/speckit-specify          → spec.md
/trilogy-clarify spec     → refine spec
/trilogy-clarify business → align on business
/trilogy-spec-explorer    → visual spec review (THIS SKILL)
/trilogy-spec-handover    → Gate 1 (Business Gate)
```

## Prerequisites

| Artifact | Required | Source |
|----------|----------|--------|
| spec.md | Yes | Initiative folder in `.tc-docs/content/initiatives/` |

## Process

### Phase 1 — Find the Spec

1. Find the current epic folder by matching the git branch name to initiative folders:
   ```bash
   git branch --show-current
   ```

2. Match branch name to an initiative/epic folder in `.tc-docs/content/initiatives/`. Use fuzzy matching:
   - `feat/les-lead-essential` → `Lead-Essential`
   - `feat/lth-lead-to-hca` → `Lead-To-HCA`
   - Match on acronym prefix or kebab-case folder name

3. Read `spec.md` from the matched epic folder

### Phase 2 — Parse Spec Content

4. Extract the following structured data from spec.md:

**User Stories** — each with:
- Story number and title
- Actor (who)
- Priority (P1/P2/P3)
- Why this priority (the rationale paragraph)
- Acceptance scenarios (Given/When/Then blocks)
- Linked FR IDs
- Dependencies on other stories

**Functional Requirements** — each with:
- FR ID (e.g., FR-001)
- Category (group by section heading: List View, Profile, Journey Stage, etc.)
- Requirement text
- Which stories reference it

**Edge Cases** — each with:
- Question
- Answer

**Success Criteria** — each with:
- SC ID
- Measurable outcome text

**Out of Scope** — items explicitly excluded

### Phase 3 — Build Dependency Graph

5. Determine story dependencies by analysing:
   - Explicit dependency mentions in the spec
   - Implicit dependencies from FR overlap (stories sharing FRs depend on each other)
   - Tab/section nesting (Overview tab stories depend on Profile story)
   - The user flow diagrams in the spec

6. Build directed edges: `story A → story B` means "A depends on B" or "A feeds into B"

### Phase 4 — Generate HTML

7. Generate a single self-contained HTML file with these features:

**Canvas (main area):**
- Each user story rendered as a draggable card showing: story number, title, actor, priority badge, scenario count, FR count
- Stories laid out in **priority swim lanes**: P1 (top), P2 (middle), P3 (bottom)
- Swim lanes visually distinguished with subtle background tint and dashed borders
- Priority stripe on each card top edge (P1=red, P2=amber, P3=grey)
- Dependency arrows between stories (bezier curves with arrowheads)
- Click a story card to select it → opens detail panel + generates prompt
- Drag cards to rearrange
- Pan (drag empty canvas) and zoom (mouse wheel)
- Force-directed auto-layout respecting priority bands
- Fit All button

**Detail Panel (slide-out from right):**
- Story title, actor, priority, stats
- "Why This Priority" rationale
- Dependencies as clickable tags (click to navigate to that story)
- Acceptance Scenarios with Given/When/Then syntax highlighted in colours:
  - Given: teal
  - When: amber
  - Then: purple
- Linked Functional Requirements with FR IDs as clickable badges
- Related Edge Cases (matched by keyword overlap with story title)

**Sidebar (left):**
- Header with epic name and total counts
- Search box (filters across stories, FRs, and scenarios)
- Three tabs:
  - **Stories**: Cards for each story with priority badge, scenario/FR counts
  - **Requirements**: FRs grouped by category with category colour headers
  - **Scenarios**: All acceptance scenarios listed with parent story label
- Stats bar: P1/P2/P3 counts, total FRs
- Click any item to select + fly to it on canvas

**Bottom Prompt Bar:**
- Auto-generates a natural language implementation prompt for the selected story
- Includes: story title, actor, priority, purpose, all acceptance criteria, all linked FRs, dependencies, and project tech context
- Copy button with "Copied!" feedback
- Tech context line: "This is part of the [Epic Name] epic in TC Portal. Uses Inertia v2 + Vue 3 + Tailwind v3. [Domain] code is in domain/[Domain]/. Vue pages in resources/js/Pages/. Follow existing Common components from resources/js/Components/Common/."

**Tooltip on Hover:**
- Story title, actor, priority
- Why this priority (rationale)
- Scenario count, FR count, dependency count

8. Write the file to the **epic's initiative folder** (the same folder containing spec.md):
   ```
   .tc-docs/content/initiatives/<Initiative>/<Epic>/spec-explorer.html
   ```

9. Open it:
   ```bash
   open .tc-docs/content/initiatives/<Initiative>/<Epic>/spec-explorer.html
   ```

### Phase 5 — Cleanup Reminder

10. Inform the user: "File saved as `<Initiative>/<Epic>/spec-explorer.html` in the docs folder — alongside spec.md. Run `/trilogy-spec-handover` when you're ready for Gate 1."

## Key Rules

- **Parse from real spec** — never hardcode stories or FRs. Read and parse the actual spec.md.
- **Scope to the epic** — only show content from the current epic's spec.
- **Preserve spec language** — use the exact acceptance scenario text, FR text, and edge case text from the spec. Don't paraphrase.
- **Priority swim lanes** — the canvas MUST visually separate stories by priority into horizontal bands.
- **Given/When/Then highlighting** — colour-code these keywords in scenario text for readability.
- **No external CDN** — the HTML must work completely offline.
- **Dark theme** — use the TC Portal dev tooling dark palette:
  - Background: `#0f172a`
  - Surface: `#1e293b`
  - Border: `#334155`
  - Teal: `#007F7E` / `#43C0BE`
  - Blue: `#2C4C79`
  - P1 colour: `#ef4444` (red)
  - P2 colour: `#fbbf24` (amber)
  - P3 colour: `#64748b` (slate)
  - Given: `#43C0BE` (teal)
  - When: `#fbbf24` (amber)
  - Then: `#a78bfa` (purple)

## FR Category Colour Map

```javascript
const CATEGORY_COLOURS = {
  'List View':     '#f59e0b',
  'Profile':       '#3b82f6',
  'Journey Stage': '#22c55e',
  'Lead Status':   '#ef4444',
  'Timeline':      '#a855f7',
  'Assignment':    '#ec4899',
  'Contacts':      '#06b6d4',
  'Consumer':      '#14b8a6',
  'Creation':      '#fb923c',
  'Attribution':   '#6366f1',
  'Traits':        '#8b5cf6',
  'Permissions':   '#64748b',
  'Data Defs':     '#475569',
  'Computed':      '#334155',
};
```

## Example Output (Per-Epic Mode)

For the Lead Essential epic, the explorer would show:
- **P1 swim lane**: US1 (Staff Leads List), US2 (Staff Profile View), US3 (Overview Tab), US4 (Journey Stage), US5 (Lead Status) — 5 stories, 27 scenarios, 27 FRs
- **P2 swim lane**: US6 (Timeline & Notes), US7 (Assignment), US8 (Consumer Profile), US9 (Internal Creation) — 4 stories, 17 scenarios, 18 FRs
- **P3 swim lane**: US10 (Attribution), US11 (Traits) — 2 stories, 5 scenarios, 5 FRs
- **Dependency arrows**: US2→US3, US2→US4, US2→US5, US2→US6, US2→US7, US1→US9, US2→US10, US2→US11
- **6 edge cases** linked to relevant stories by keyword matching

---

## Portfolio Mode (`--portfolio`)

### Purpose

Visual planning playground for BRP sessions, roadmap reviews, and prioritisation. Shows ALL epics across all initiatives on a single interactive canvas, organised by domain swim lanes.

### Portfolio Execution Flow

#### Phase 1 — Index All Epics

1. **Scan all initiative folders**:
   ```bash
   find .tc-docs/content/initiatives -name "meta.yaml" -type f | sort
   find .tc-docs/content/initiatives -name "spec.md" -type f | sort
   ```

2. **For each epic, extract**:
   - Title and prefix from `meta.yaml`
   - Status from `meta.yaml` (backlog, design, in progress, completed)
   - Initiative (parent folder) for domain grouping
   - Priority (P1/P2/P3) from `meta.yaml` if set
   - User story count from `spec.md` (if exists)
   - AC count from `spec.md` (if exists)
   - Linear URL from `meta.yaml` (for linking out)
   - Lead / owner from `meta.yaml`
   - Dependencies from `spec.md` cross-references (if any)

#### Phase 2 — Build Portfolio Canvas

3. Generate a single self-contained HTML file with:

**Layout — Domain Swim Lanes × Status Columns:**

```
┌──────────────────────────────────────────────────────────────────┐
│  🔍 Filter...    [Status ▾]  [Domain ▾]  [Priority ▾]  📋 Copy │
├──────────────┬───────────┬───────────┬───────────┬──────────────┤
│  Domain      │  Backlog  │  Design   │  Dev      │  Completed   │
├──────────────┼───────────┼───────────┼───────────┼──────────────┤
│  Clinical &  │ ┌───────┐ │ ┌───────┐ │ ┌───────┐ │              │
│  Care Plan   │ │IM P2  │ │ │RM P1  │ │ │CP P1  │ │              │
│              │ │3 US   │ │ │5 US   │ │ │8 US   │ │              │
│              │ └───────┘ │ └───────┘ │ └───────┘ │              │
├──────────────┼───────────┼───────────┼───────────┼──────────────┤
│  Consumer    │ ┌───────┐ │           │ ┌───────┐ │ ┌───────────┐│
│  Lifecycle   │ │LTH P1 │ │           │ │LE P1  │ │ │HCA ✓     ││
│              │ │11 US  │ │           │ │11 US  │ │ │19 US      ││
│              │ └───────┘ │           │ └───────┘ │ └───────────┘│
├──────────────┼───────────┼───────────┼───────────┼──────────────┤
│  ...         │           │           │           │              │
└──────────────┴───────────┴───────────┴───────────┴──────────────┘
```

**Epic Cards show:**
- Prefix + title
- Priority badge (P1=red, P2=amber, P3=grey)
- Story count + AC count
- Lead/owner name
- Status colour coding
- Click to expand: overview, story list, Linear link
- Drag to re-order within a column

**Features:**
- Domain swim lanes auto-generated from initiative folder names
- Status columns: Backlog → Design → Dev → Completed
- Filter bar: status, domain, priority (combine filters)
- Search: full-text across all epic titles, story titles
- Dependency arrows across domains (cross-epic references)
- Stats dashboard: total epics per status, per domain, per priority
- **Clipboard export**: Copy prioritised epic list as markdown table

**Clipboard Export Format:**
```markdown
## Portfolio Priorities — [Date]

### Clinical & Care Plan
| Priority | Epic | Status | Stories | Lead |
|----------|------|--------|---------|------|
| P1 | Risk Management | Design | 5 | [Name] |
| P2 | Incident Mgmt | Backlog | 3 | [Name] |

### Consumer Lifecycle
| Priority | Epic | Status | Stories | Lead |
|----------|------|--------|---------|------|
| P1 | Lead Essential | Dev | 11 | [Name] |
| P1 | Lead to HCA | Backlog | 11 | [Name] |
```

**Design:**
- Same dark theme as per-epic mode
- Background: `#0f172a`, Surface: `#1e293b`, Border: `#334155`
- Teal accents: `#007F7E` / `#43C0BE`
- Domain lane colours: alternate subtle bg tints per domain
- Status columns: Backlog=orange, Design=purple, Dev=blue, Completed=green

#### Phase 3 — Output

4. Write to: `.tc-docs/content/initiatives/spec-portfolio.html`
5. Open: `open .tc-docs/content/initiatives/spec-portfolio.html`

### Portfolio Integration

The portfolio view works well with:
- `/trilogy-brp` — use portfolio view during Big Room Planning for visual prioritisation
- `/trilogy-spec-index` — for detailed spec browsing (text-based index of all specs)
- `/trilogy-idea` — create new idea briefs for gaps identified in the portfolio view
