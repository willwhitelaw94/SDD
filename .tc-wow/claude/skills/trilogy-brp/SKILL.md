---
name: trilogy-brp
description: Plan and prepare Big Room Planning (BRP) sessions. Creates quarterly BRP documents in tc-docs with review of last BRP, roadmap, and idea briefs. Uses Linear, Fireflies, and Teams chat for context gathering.
metadata:
  version: 2.0.0
  type: agent
---

# Trilogy BRP Skill

An **agent-based** skill for planning and preparing quarterly Big Room Planning (BRP) sessions. Gathers context from multiple sources and creates structured documentation in `.tc-docs/`.

## Overview

This skill:

- **Creates BRP folder structure** in `.tc-docs/content/context/8.BRP/` for each quarter
- **Reviews last BRP achievements** by searching Linear for delivered work
- **Gathers context** from Fireflies meeting transcripts and Teams chats
- **Links active Idea Briefs** for the quarter
- **Produces roadmap structure** for prioritisation

## When to Use

Activate this skill when:

- **Planning a new quarter** - Create BRP folder and prepare content
- **Preparing BRP agenda** - Gather context for upcoming session
- **Reviewing previous BRP** - Summarise achievements from last quarter
- **Updating roadmap** - Refresh priorities and timelines

## Inputs

The skill accepts:

| Input | Description | Example |
|-------|-------------|---------|
| `quarter` | Target quarter | "Q1 2026", "Feb-Apr" |
| `brp_date` | BRP meeting date | "January 29, 2026" |
| `previous_brp` | Link to previous BRP | tc-docs page or file path |
| `teams_links` | Relevant Teams chat URLs | Teams conversation links |
| `agenda_items` | Custom agenda items | List of topics and durations |

## Core Workflow

### Phase 1: Gather Context (Parallel Agents)

Spawn **4 sub-agents** simultaneously using the Task tool:

```
Agent 1: Last BRP Review (Linear)
- Search Linear for completed projects/issues since last BRP using mcp__linear__list_projects
- Fetch project details with mcp__linear__get_project
- Extract: delivered initiatives, status, blockers encountered
- Identify what didn't make it and why

Agent 2: Roadmap & Linear Status (Linear)
- Search Linear for active projects and initiatives using mcp__linear__list_projects
- Fetch issue details with mcp__linear__get_issue
- Extract: current status, progress, blockers
- Identify dependencies between initiatives

Agent 3: Meeting Context (Fireflies)
- Search Fireflies for recent planning meetings using mcp__fireflies__fireflies_search
- Fetch meeting summaries with mcp__fireflies__fireflies_get_summary
- Extract: decisions made, action items, stakeholder input
- Note key discussions about priorities

Agent 4: Teams Chat Context (if links provided)
- Fetch Teams chat history
- Search for planning discussions, decisions, blockers
- Extract: team feedback, concerns, suggestions
- Identify any open questions or debates
```

### Phase 2: Create Documentation Structure

Create the BRP folder structure in `.tc-docs/content/context/8.BRP/`:

```
8.BRP/
└── q1-2026/
    ├── index.md              # BRP overview + agenda
    ├── 01-last-brp-review.md
    ├── 02-roadmap.md
    └── 03-idea-briefs.md
```

### Phase 3: Populate Content

**1. Last BRP Review Page:**

```markdown
---
title: "Last BRP Review"
---

# Last BRP Review

## Previous Quarter: [Q4 2025]

### What We Delivered

| Initiative | Status | Notes |
|------------|--------|-------|
| [From Linear search] | Completed | [Summary] |

### What Didn't Make It

| Initiative | Reason | Carry Forward? |
|------------|--------|----------------|
| [From Linear] | [Blocker] | Yes/No |

### Key Learnings

From Fireflies/Teams analysis:
- [Learning 1]
- [Learning 2]
```

**2. Roadmap Page:**

```markdown
---
title: "Roadmap - Q1 2026"
---

# Roadmap - Q1 2026

## Initiative Prioritisation

| Priority | Initiative | Value | Effort | Owner |
|----------|------------|-------|--------|-------|
| P1 | [From Linear] | High | M | [Assignee] |

## Dependencies

| Initiative | Depends On | Risk Level |
|------------|------------|------------|
| [From Linear links] | [Dependency] | High/Med/Low |
```

**3. Idea Briefs Page:**

```markdown
---
title: "Idea Briefs - Q1 2026"
---

# Idea Briefs - Q1 2026

## Active Initiatives

| Code | Title | Status | Owner | Link |
|------|-------|--------|-------|------|
| [From initiatives/ folder] | [Title] | Active | [Owner] | [Link] |
```

### Phase 4: Generate BRP Agenda

Create main BRP index page with:

- Overview (date, duration, location)
- Agenda with times and owners
- Pre-work checklist
- Action items table
- Notes section

## MCP Tools Reference

### Linear

| Tool | Purpose |
|------|---------|
| `mcp__linear__list_projects` | List projects by status |
| `mcp__linear__get_project` | Get project details |
| `mcp__linear__list_issues` | List issues with filters |
| `mcp__linear__get_issue` | Get full issue details |
| `mcp__linear__list_initiatives` | List initiatives |
| `mcp__linear__get_initiative` | Get initiative details |

### Fireflies MCP

| Tool | Purpose |
|------|---------|
| `mcp__fireflies__fireflies_search` | Search meeting transcripts |
| `mcp__fireflies__fireflies_get_summary` | Get meeting summary |
| `mcp__fireflies__fireflies_get_transcript` | Get full transcript |
| `mcp__fireflies__fireflies_get_transcripts` | List meetings with filters |

## Execution Steps

### Step 1: Confirm Quarter Details

Ask the user:

1. **What quarter is this BRP for?** (e.g., Q1 2026, Feb-Apr)
2. **When is the BRP meeting?** (e.g., January 29, 2026)
3. **Any custom agenda items?** (or use default)
4. **Any Teams chat links to review?**

### Step 2: Launch Context Gathering

Spawn parallel agents to gather:

- Last BRP achievements (Linear)
- Current initiative status (Linear)
- Meeting decisions (Fireflies)
- Team discussions (Teams - if links provided)

### Step 3: Create Documentation Structure

1. Create quarter folder in `.tc-docs/content/context/8.BRP/`
2. Create index page with BRP overview
3. Create child pages:
   - 01-last-brp-review.md
   - 02-roadmap.md
   - 03-idea-briefs.md

### Step 4: Populate Content

Fill in content from gathered context:

- Last BRP: Delivered items, missed items, learnings
- Roadmap: Priorities, dependencies, risks
- Idea Briefs: Links to active briefs from `.tc-docs/content/initiatives/`

### Step 5: Present Summary

Show user:

- Links to created pages
- Summary of findings
- Recommended pre-work items
- Any gaps that need filling

## Usage Examples

**Basic BRP planning:**
```
/trilogy-brp Q1 2026
```

**With meeting date:**
```
/trilogy-brp Q1 2026 --date "January 29, 2026"
```

**With Teams context:**
```
/trilogy-brp Q1 2026 --teams https://teams.microsoft.com/l/chat/...
```

**Review previous BRP:**
```
/trilogy-brp --review Q4 2025
```

## Error Handling

| Error | Action |
|-------|--------|
| Linear unavailable | Prompt user to check connection |
| Fireflies returns no results | Note limitation, continue without |
| Teams not connected | Skip Teams, note in output |
| Previous BRP not found | Create fresh without comparison |
| BRP folder exists | Ask to update or create new |

## Default Agenda Template

If no custom agenda provided, use:

| Duration | Topic |
|----------|-------|
| 15 min | Review: Last BRP Achievements |
| 15 min | Product Vision / Mission + Team Values |
| 15 min | New Documentation / Agentic Workflow |
| 1 hr | Idea Brief + Building Context |
| 30 min | High Level Roadmap + Prioritising |

**Total: 2h 15min**

## Documentation Structure

**Parent folder:** `.tc-docs/content/context/8.BRP/`

**Quarter folder:** `q1-2026/`

**Child pages:**
- `index.md` - BRP overview + agenda
- `01-last-brp-review.md`
- `02-roadmap.md`
- `03-idea-briefs.md`

## Integration with Other Skills

After BRP preparation:

- `/trilogy-idea` - Create new idea briefs from BRP discussions
- `/trilogy-research` - Deep dive on specific topics raised
- `/speckit-specify` - Turn priorities into specifications
- `/speckit-plan` - Plan implementation of roadmap items

## Output

The skill produces:

1. **tc-docs pages** - Structured BRP folder with all sub-pages
2. **Context summary** - Key findings from all sources
3. **Preparation checklist** - Pre-work items for attendees
4. **Links document** - All referenced pages and tickets
