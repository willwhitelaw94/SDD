---
name: trilogy-spec-index
description: >-
  Generates an interactive HTML spec index that catalogues all spec.md files across initiatives.
  Search, filter by initiative/status, compare specs, view stories, acceptance criteria, entities,
  and cross-epic dependencies. Triggers on: spec index, browse specs, search specs, all specs,
  compare specs, spec overview.
metadata:
  version: 1.1.0
  type: agent
---

# Spec Index Skill

Generates a self-contained interactive HTML page that indexes and displays all spec.md files across initiatives. Browse, search, filter, and compare specifications at a glance.

**Note**: For per-epic visual spec exploration, use `/trilogy-spec-explorer` instead.

## Purpose

1. **Indexes** all spec.md files from `.tc-docs/content/initiatives/`
2. **Parses** each spec into structured sections (stories, AC, entities, flows)
3. **Generates** an interactive HTML explorer with search, filters, and comparison
4. **Opens** in browser for exploration

## When to Use

```bash
/spec-explorer                    # Generate and open the explorer
/spec-explorer --refresh          # Re-scan and regenerate
/spec-explorer leads              # Filter to a specific initiative
```

Run when you want to:
- Browse all existing specs before writing a new one
- Find patterns across specs (common entities, shared flows)
- Check what's already been specified to avoid duplication
- Compare acceptance criteria across related features

## Prerequisites

| Artifact | Required | Source |
|----------|----------|--------|
| spec.md files | At least one | `.tc-docs/content/initiatives/` |

## Execution Flow

### Phase 1 — Index Specs

1. **Scan** all initiative folders for spec.md files:
   ```bash
   find .tc-docs/content/initiatives -name "spec.md" -type f | sort
   ```

2. **Read each spec.md** and parse into structured data:
   - **Title** — from YAML frontmatter or first heading
   - **Initiative** — parent folder name
   - **Epic** — immediate parent folder name
   - **Status** — from meta.yaml if exists (backlog, start, in progress, completed)
   - **User stories** — extract all stories with their IDs
   - **Acceptance criteria** — extract all AC per story
   - **Key entities** — data models, tables mentioned
   - **Dependencies** — references to other epics/features
   - **Word count / complexity** — rough size indicator

3. **Read meta.yaml** files alongside each spec for status and Linear links

### Phase 2 — Parse Spec Sections

For each spec, extract these sections:

| Section | What to Extract |
|---------|----------------|
| **Overview** | First paragraph / description |
| **User Stories** | Story ID, As a/I want/So that, AC list |
| **Acceptance Criteria** | Per-story Given/When/Then or bullet AC |
| **Entities** | Table names, model names, key fields |
| **Flows** | Mermaid diagrams, flow descriptions |
| **Edge Cases** | Edge case section content |
| **Non-Functional** | Performance, security, accessibility notes |

### Phase 3 — Generate HTML

4. Generate a single self-contained HTML file with:

**Layout:**
- Left sidebar: initiative/epic tree with status badges
- Main area: spec content with collapsible sections
- Top bar: search + filters

**Features:**

| Feature | Description |
|---------|-------------|
| **Search** | Full-text search across all specs — stories, AC, entities |
| **Initiative filter** | Toggle visibility by initiative |
| **Status filter** | Filter by meta.yaml status (backlog, start, in progress, completed) |
| **Story cards** | Each user story as a card with AC checklist |
| **Entity index** | Alphabetical list of all entities across specs with links |
| **Dependency graph** | Simple view of cross-epic references |
| **Compare mode** | Side-by-side view of two specs |
| **Stats dashboard** | Total stories, AC, entities, specs per status |
| **Quick nav** | Click story/entity to jump to source spec |

**Design:**
- Dark theme matching TC Portal dev tooling
- Background: `#0f172a`, Surface: `#1e293b`, Border: `#334155`
- Teal accents: `#007F7E` / `#43C0BE`
- Status colours: Backlog=orange, Start=yellow, In Progress=blue, Completed=green
- No external dependencies — fully self-contained HTML

### Phase 4 — Output

5. Write the file to the `.tc-docs/content/initiatives/` root (since this indexes all specs):
   ```
   .tc-docs/content/initiatives/spec-explorer.html
   ```

6. Open it:
   ```bash
   open .tc-docs/content/initiatives/spec-explorer.html
   ```

7. Inform user: "File saved as `.tc-docs/content/initiatives/spec-explorer.html` — alongside your initiative folders."

## Key Rules

- **Read every spec.md** — don't skip any, even if they look incomplete
- **Parse gracefully** — specs vary in format; extract what you can, skip what you can't
- **No external CDN** — must work completely offline
- **Preserve markdown** — render spec content as formatted HTML, not raw text
- **Link to source** — every section should reference which spec.md file it came from
- **Status from meta.yaml** — if no meta.yaml, show status as "Unknown"

## HTML Structure

```
┌─────────────────────────────────────────────────┐
│  🔍 Search specs...          [Status ▾] [Init ▾]│
├──────────┬──────────────────────────────────────┤
│ 📁 Tree  │  📋 Spec Content                     │
│          │                                      │
│ ▸ Lead   │  ## Lead Intake                      │
│   ├ LTH  │  Status: In Progress                 │
│   └ LE   │                                      │
│ ▸ RI     │  ### User Stories                     │
│   ├ Core │  ┌─────────────────────────────────┐  │
│   └ Dash │  │ US-1: As a staff member...      │  │
│ ▸ PKG    │  │ AC: ☑ Given... ☑ When... ☑ Then │  │
│          │  └─────────────────────────────────┘  │
│          │                                      │
│ ──────── │  ### Entities                         │
│ 📊 Stats │  leads, lead_owners, lead_statuses   │
│ 12 specs │                                      │
│ 47 stories│  ### Dependencies                    │
│ 189 AC   │  → Package Management (conversion)   │
├──────────┴──────────────────────────────────────┤
│  spec-explorer v1 • 12 specs indexed            │
└─────────────────────────────────────────────────┘
```

## Example Entity Index

```
┌──────────────────────────────────────────┐
│ Entity Index (47 entities across 12 specs)│
├──────────────────────────────────────────┤
│ agreements ........ Package Management   │
│ budgets ........... Budget Tracking      │
│ care_plans ........ RI Core              │
│ leads ............. Lead Intake, Lead LTH│
│ lead_owners ....... Lead LTH            │
│ packages .......... Package Management   │
│ users ............. (referenced in 8)    │
└──────────────────────────────────────────┘
```
