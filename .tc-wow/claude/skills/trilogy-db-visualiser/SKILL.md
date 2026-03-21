---
name: trilogy-db-visualiser
description: >-
  Generates an interactive canvas-based database schema visualiser scoped to the current epic.
  Reads spec.md, plan.md, and db-spec.md to identify relevant tables, then uses Laravel Boost
  database-schema tool to fetch real column definitions, and outputs a single self-contained HTML
  playground. Triggers on: db visualiser, database diagram, schema map, visualise db, db playground.
metadata:
  version: 1.0.0
  type: agent
---

# Database Visualiser Skill

Generates an interactive, canvas-based database schema visualiser scoped to the tables relevant to the current epic. The output is a single self-contained HTML file opened in the browser.

## Purpose

1. **Reads** the epic's spec.md, plan.md, and db-spec.md to identify which tables are in scope
2. **Discovers** related tables by following foreign key chains (1 hop)
3. **Fetches** real schema from the database using Laravel Boost `database-schema` tool
4. **Generates** a single HTML playground with canvas rendering, draggable table nodes, FK relationship lines, domain colouring, search, zoom/pan, minimap, and auto-layout
5. **Opens** the result in the browser

## When to Use

```bash
/trilogy-db-visualiser              # Auto-detect epic from current branch
/trilogy-db-visualiser leads        # Explicit table filter
/trilogy-db-visualiser --all        # Show ALL database tables (full schema)
```

Run this skill when you want to visually explore the database schema relevant to a feature you're building.

## Prerequisites

| Artifact | Required | Source |
|----------|----------|--------|
| spec.md or plan.md or db-spec.md | At least one | Initiative folder in `.tc-docs/content/initiatives/` |
| Laravel Boost MCP | Yes | `database-schema` tool for live schema |

## Process

### Phase 1 — Identify Tables

1. Find the current epic folder by matching the git branch name to initiative folders:
   ```bash
   git branch --show-current
   find .tc-docs/content/initiatives -name "spec.md" -o -name "plan.md" -o -name "db-spec.md" | sort
   ```

2. Read all available docs (spec.md, plan.md, db-spec.md) from the epic folder

3. Extract table names mentioned in those documents. Look for:
   - Table names in backticks (e.g., `` `leads` ``, `` `lead_status_histories` ``)
   - Model references (e.g., `Lead model` → `leads` table, `LeadOwner` → `lead_owners`)
   - Migration references (e.g., `create_lead_timeline_entries_table`)
   - Foreign key references (e.g., `FK → users.id` → include `users`)
   - Schema::create / Schema::table calls

4. These are the **primary tables** — the tables directly in scope for the epic.

### Phase 2 — Discover Related Tables

5. For each primary table, use `database-schema` tool (filter by table name) to get the full schema including foreign keys.

6. Follow FK references ONE hop outward to discover **related tables**. For example, if `leads` has `owner_id → lead_owners.id`, include `lead_owners`.

7. Also fetch schema for the related tables.

8. Classify tables into two tiers:
   - **Primary** (directly in the spec/plan) — shown with full column detail, coloured border
   - **Related** (discovered via FK) — shown with header + FK columns only, muted style

### Phase 3 — Assign Domains

9. Group tables by domain using prefix matching:
   - `lead_*` → Lead domain
   - `package_*` → Package domain
   - `bill_*` → Bill domain
   - `budget_*` → Budget domain
   - `service_*` → Service domain
   - `users`, `roles`, `permissions`, `teams` → Auth domain
   - `organisations`, `businesses`, `care_coordinators` → Org domain
   - etc.

10. If the epic is focused on a single domain, that domain gets the teal accent colour. Other domains get muted colours.

### Phase 4 — Generate HTML

11. Generate a single self-contained HTML file following the playground pattern:
    - **No external dependencies** — all CSS and JS inline
    - **Dark theme** — consistent with TC Portal dev tooling
    - **Canvas rendering** — draggable table nodes with FK relationship lines

12. The HTML must include these features:

**Canvas Features:**
- Each table rendered as a card with header (table name) + column rows (name, type, PK/FK badges)
- Primary tables: full column list, coloured header matching domain
- Related tables: header + FK columns only, dimmed style
- FK relationship lines: curved bezier paths between tables, highlighted on select
- Draggable nodes — click and drag any table
- Pan — click and drag on empty canvas
- Zoom — mouse wheel, zoom toward cursor
- Auto-layout — force-directed algorithm that clusters by domain and pulls FK-connected tables together
- Fit All — zoom to fit all visible tables
- Minimap — bottom-right corner showing viewport position

**Sidebar:**
- Domain filter checkboxes (toggle visibility by domain)
- Table list with search
- Click table in list to fly to it on canvas

**Tooltip on Hover:**
- Full table name
- Domain label
- All columns with type, PK/FK/IDX badges
- FK targets shown

**Info Bar:**
- Table count, relationship count, zoom level

**No prompt output needed** — this is a visualisation tool, not a prompt builder.

13. Write the file to **two locations**:
    - **Epic context folder**: `EPIC_DIR/context/db-visualiser.html` (persisted with the epic in `.tc-docs`)
    - **Project root**: `db-visualiser.html` (convenience copy for quick access)

    ```bash
    mkdir -p EPIC_DIR/context
    cp db-visualiser.html EPIC_DIR/context/db-visualiser.html
    ```

14. Open it:
    ```bash
    open db-visualiser.html
    ```

### Phase 5 — Cleanup Reminder

15. Inform the user: "File saved to `EPIC_DIR/context/db-visualiser.html` (persisted with the epic) and `db-visualiser.html` (project root — safe to delete when done)."

## Key Rules

- **Always use live schema** — never hardcode column definitions. Fetch from `database-schema` tool.
- **Scope to the epic** — don't show the entire 230-table database unless `--all` is passed.
- **One hop only** — related tables are only those directly referenced by FK from primary tables. Don't recurse further.
- **Primary vs related** — visually distinguish primary tables (full detail, coloured) from related (abbreviated, muted).
- **No external CDN** — the HTML must work completely offline.
- **Dark theme** — use the TC Portal dev tooling dark palette:
  - Background: `#0f172a`
  - Surface: `#1e293b`
  - Border: `#334155`
  - Teal: `#007F7E` / `#43C0BE`
  - Blue: `#2C4C79`
  - PK colour: `#fbbf24` (amber)
  - FK colour: `#f472b6` (pink)
  - Index colour: `#818cf8` (indigo)

## Domain Colour Map

```javascript
const DOMAIN_COLOURS = {
  auth:      '#64748b',  // grey
  org:       '#8b5cf6',  // violet
  package:   '#007F7E',  // teal (TC brand)
  budget:    '#22c55e',  // green
  bill:      '#06b6d4',  // cyan
  service:   '#3b82f6',  // blue
  agreement: '#a855f7',  // purple
  lead:      '#f59e0b',  // amber
  claims:    '#ec4899',  // pink
  docs:      '#14b8a6',  // teal
  clinical:  '#ef4444',  // red
  notif:     '#fb923c',  // orange
  integration:'#6366f1', // indigo
  misc:      '#475569',  // slate
};
```

## Example Output

For the Lead Essential epic, the visualiser would show:
- **Primary tables** (from spec/plan): `leads`, `lead_owners`, `lead_status_histories`, `lead_stage_histories`, `lead_timeline_entries`, `lead_conversions`, `lead_conversion_sync_logs`, `lead_contents`, `lead_resources`
- **Related tables** (via FK): `users` (referenced by assigned_user_id, user_id, created_by), `care_coordinators` (via lead_conversions.coordinator_id), `packages` (via lead_conversions.package_id), `agreements` (via lead_conversions.agreement_id)
