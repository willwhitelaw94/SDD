---
name: trilogy-linear-sync
description: Sync epics, stories, tasks, and documents between local docs and Linear. Use when pushing to Linear, pulling from Linear, syncing project management, or creating Linear issues from specs. Triggers on: Linear sync, push to Linear, pull from Linear, sync stories, sync tasks, sync docs, sync epics.
---

# Trilogy Linear Sync Skill

Unified command for syncing Linear projects (epics) with local docs `meta.yaml`, and syncing SpecKit artifacts (stories, tasks, idea briefs, specs) to Linear.

## Pre-Sync Questions

**IMPORTANT**: Before syncing, ask the user:

1. **"Do you want me to run this in background while you keep working?"**
   - Default: Yes (run in background)
   - Use `run_in_background: true` for Task agents

2. **"What do you want to sync?"**
   - `docs` - Just the idea brief and spec as a Linear document (recommended for early stages)
   - `epic` - Create an epic-level issue with idea brief content
   - `stories` - Create user story issues (only when finalised post-design phase)
   - `all` - Everything including stories and tasks

3. **"Do you want to save just the Linear links to the epic, or sync the full content?"**
   - Links only: Just update meta.yaml with Linear references
   - Full sync: Create/update all Linear content

## Process Note

**User stories should NOT be created in Linear until they are finalised post-design phase and ready for subtasks to be linked.** Talk to Cassandra for more info on this process.

Recommended sync stages:
1. **Idea/Spec phase**: `push docs` only - sync idea brief + spec as document
2. **Post-design phase**: `push stories` - when stories are finalised and ready for work
3. **Implementation phase**: `push tasks` - when breaking stories into subtasks

## What This Command Syncs

### From Local -> Linear (Push)

1. **User Stories** (from `spec.md` User Scenarios section)
   - Creates Linear Issues with "User Story" label
   - Maps acceptance criteria to issue description
   - **Includes estimate in description** (if present): `> **Estimate**: 8 days | ~$24k`
   - Associates with project/epic

2. **Tasks** (from `tasks.md`)
   - Creates Linear Issues as sub-issues under stories
   - Maps task IDs to Linear issue identifiers
   - **Syncs story points to Linear estimate field** (if present): `` `3` `` → estimate: 3
   - Preserves [US1], [US2] story associations

3. **Documents** (Idea Briefs & Specs)
   - Creates/updates Linear Documents for epics
   - Syncs `idea-brief.md` content to epic document
   - Syncs `spec.md` content to epic document

## Epic/Project Sync (Pull from Linear)

Keeps `meta.yaml` files in sync with Linear project data. This is the most common sync operation.

### Usage

```bash
# Pull all Linear projects and sync to meta.yaml files
/trilogy-linear-sync pull epics

# Pull a specific epic by prefix
/trilogy-linear-sync pull epic --prefix HCA

# Show gaps (docs without Linear, Linear without docs)
/trilogy-linear-sync pull gaps

# Dry run (preview changes)
/trilogy-linear-sync --dry-run pull epics
```

### Pull Epic Workflow

1. **Fetch all Linear projects** via `mcp__linear__list_projects`
2. **Read all meta.yaml files** from `.tc-docs/content/initiatives/*/*/meta.yaml`
3. **Match by `linear_project_id`** - the UUID linking docs to Linear
4. **For each matched epic, sync these fields from Linear → meta.yaml:**

| meta.yaml field | Linear source | Description |
|-----------------|---------------|-------------|
| `status` | Project status (mapped) | Canonical status string |
| `linear_url` | Project URL | Direct link to Linear project |
| `lead` | Project lead member | Person responsible |
| `start_date` | Project start date | When work began |
| `target_date` | Project target date | Expected completion |

5. **Report gaps** in both directions:
   - Doc epics missing `linear_project_id` (need to create Linear project or add ID)
   - Linear projects without matching doc epics (need to create doc folder)

### Linear Workspace Status Mapping

The workspace uses these **actual Linear state names** (not generic):

| Linear State | meta.yaml status | Sidebar Icon |
|--------------|-----------------|--------------|
| Backlog | backlog | Priority bars |
| Start | start | Dotted circle |
| Design | start | Dotted circle |
| Dev | in progress | Half circle |
| Blocked | blocked | Stop line |
| Completed | completed | Checkmark |
| Done | completed | Checkmark |
| Canceled | canceled | X mark |

**When updating Linear project status via API**, use the actual workspace state names:
- `mcp__linear__update_project` with `state: "Dev"` (NOT "In Progress")
- `mcp__linear__update_project` with `state: "Start"` (NOT "Planned")
- `mcp__linear__update_project` with `state: "Blocked"` (NOT "On Hold")

### Status Lifecycle (Gate Transitions)

Skills that transition project status MUST update **both** Linear and `meta.yaml` in a single operation. The workflow gates are:

```
Backlog ──────────────────► Start ──► Design ──► Dev ──► Completed
                             │         Gate 2    Gate 3
                             │        (Design)   (QA)
  /speckit-specify           │
  /trilogy-clarify spec      │
  /trilogy-clarify business  │
           ↓                 │
  /trilogy-spec-handover ────┘  Gate 1 (Business Gate)

  └──► Canceled (any stage)
```

| Gate | Trigger Skill | From → To (Linear) | From → To (meta.yaml) |
|------|--------------|---------------------|----------------------|
| Gate 1: Business Gate | `/trilogy-spec-handover` | Backlog → Design | backlog → design |
| Gate 2: Design Gate | `/trilogy-design-handover` | Design → Dev | design → in progress |
| Gate 3: QA Gate | (future) | Dev → Completed | in progress → completed |

**Gate 1 runs after spec + clarify are complete** — it validates business alignment, transitions status, and hands off to design.

**How to transition status (canonical pattern):**

1. Read `meta.yaml` to get `linear_project_id`
2. Update Linear: `mcp__linear__update_project` with `id: "<uuid>"` and `state: "<Linear State>"`
3. Update `meta.yaml`: Set `status: <canonical lowercase>`
4. Verify both are in sync

### meta.yaml Required Fields (Epic Level)

Every epic's `meta.yaml` must have:

```yaml
# Required
title: 'Epic Title'
prefix: ABC                     # 2-4 letter code, unique across all epics
status: design                  # Canonical status (lowercase)
summary: "One-line description" # Shown as subtitle in sidebar

# Linear integration
linear_project_id: uuid-here    # UUID from Linear project
linear_url: https://linear.app/trilogycare/project/slug-here

# Optional
priority: P1                    # P1/P2/P3 (for backlog items)
lead: Name                      # Person responsible
start_date: 'YYYY-MM-DD'       # When work began
target_date: 'YYYY-MM-DD'      # Expected completion
jira_key: TP-XXXX              # Legacy Jira reference (if migrated from Jira)
```

### Creating a New Epic (Both Places)

When creating a new epic, always create in BOTH Linear and docs:

1. **Create Linear project** via `mcp__linear__create_project`:
   - `name`: `[PREFIX] Epic Title`
   - `teamIds`: Relevant team(s)
   - `state`: Initial status

2. **Create doc folder** at `.tc-docs/content/initiatives/[Domain]/[Epic-Name]/`:
   - `meta.yaml` with all required fields (include `linear_project_id` and `linear_url` from step 1)
   - `index.md` with frontmatter title and brief description
   - Optional: `context/` folder with `.gitkeep`

3. **Verify** the `linear_url` is the actual URL from Linear (slug-based, not UUID-based)

## Usage (Push to Linear)

```bash
# Sync spec.md stories to Linear
/trilogy-linear-sync push stories

# Sync tasks.md to Linear
/trilogy-linear-sync push tasks

# Sync idea brief and spec to Linear document
/trilogy-linear-sync push docs

# Sync everything (stories, tasks, docs)
/trilogy-linear-sync push all

# Dry run (preview changes)
/trilogy-linear-sync --dry-run push all

# Sync to specific team
/trilogy-linear-sync push stories --team Planning
```

## Push Workflow

### 1. Detect Context

Find spec.md, tasks.md, and idea-brief.md:

```
Current working directory or:
- .tc-docs/content/initiatives/*/[Epic]/spec.md
- .tc-docs/content/initiatives/*/[Epic]/tasks.md
- .tc-docs/content/initiatives/*/[Epic]/IDEA-BRIEF.md
```

### 2. Push Stories (from spec.md)

Extract user scenarios from spec.md and create Linear Issues:

1. Parse the "User Scenarios" or "User Stories" section from spec.md
2. For each story, extract:
   - Title from heading
   - Inline estimate (if present): `> **Estimate**: 8 days | ~$24k | High confidence`
   - Acceptance criteria
   - Priority
3. Use `mcp__linear__create_issue`:
   - `title`: The story title (e.g., "US01: First-Login HCA Signing Flow")
   - `description`: Estimate block + acceptance criteria in markdown
   - `labels`: ["User Story", priority label]
   - `team`: Target team (default: "Planning")
   - `project`: Associated project if specified in meta.yaml

**Story Description Format:**
```markdown
> **Estimate**: 8 days | ~$24k | High confidence

**As a** new recipient or representative
**I want to** be guided directly to sign my HCA on first login
**So that** I can quickly begin receiving services

## Acceptance Criteria

- [ ] Given I am a new recipient with an HCA in "Sent" state...
- [ ] Given I am redirected to Agreements...
```

### 3. Push Tasks (from tasks.md)

Extract tasks and create Linear Issues linked to stories:

1. Parse tasks from tasks.md
2. For each task, extract:
   - Task ID (T001, T002, etc.)
   - Story reference ([US1], [US2], etc.)
   - **Story points** (if present): `` `3` `` after [US] label
   - Description
3. Use `mcp__linear__create_issue`:
   - `title`: Task description
   - `description`: Full task details if any
   - `parentId`: The Linear issue ID of the associated story (from [US1] reference)
   - **`estimate`: Story points as integer** (e.g., 3)
   - `team`: Same team as stories

**Task Parsing:**
```markdown
- [ ] T001 [US1] `3` Create Agreement model in app/Models/
```
Extracts:
- ID: T001
- Story: US1
- **Points: 3** → Linear estimate field
- Title: "Create Agreement model in app/Models/"

### 4. Push Documents (idea-brief.md, spec.md)

Sync documentation to Linear:

1. Find or create a Linear Document for the epic using `mcp__linear__create_document` or `mcp__linear__update_document`
2. Combine idea-brief.md and spec.md content into the document
3. Associate with the project

### 5. Update Local Files

After push, update:
- `meta.yaml` - Add Linear issue identifiers for stories/tasks
- `stories.yaml` - Map local stories to Linear identifiers

## Estimate Sync Summary

| Level | Source | Linear Field |
|-------|--------|--------------|
| **Story** | `> **Estimate**: 8 days...` | Included in description text |
| **Task** | `` `3` `` after [US] label | `estimate` field (integer) |

**Why different?**
- Stories: Days + cost is context for planning, not a trackable metric
- Tasks: Points are standard agile estimates that Linear tracks and rolls up

## MCP Tools Used

### Issues
- `mcp__linear__create_issue` - Create stories/tasks
- `mcp__linear__update_issue` - Update existing issues
- `mcp__linear__list_issues` - Query existing issues
- `mcp__linear__get_issue` - Get issue details

### Documents
- `mcp__linear__create_document` - Create new document
- `mcp__linear__update_document` - Update existing document
- `mcp__linear__list_documents` - Find existing documents
- `mcp__linear__get_document` - Get document content

### Reference Data
- `mcp__linear__list_teams` - Get available teams
- `mcp__linear__list_projects` - Get available projects
- `mcp__linear__list_issue_labels` - Get available labels

## Linear Teams

Available teams for syncing:

| Team | Use For |
|------|---------|
| Planning | Product/business stories, requirements |
| Design | Design-related issues |
| Tim - Duck Duck Deploy | Tim's development work |
| Vishal | Vishal's development work |
| Matt | Matt's development work |
| Khoa | Khoa's development work |

## File Formats

### meta.yaml (after sync)
```yaml
linear_project: Assessment Prescriptions
linear_team: Planning
last_synced: 2026-01-31T14:30:00Z

stories:
  - identifier: PLA-123
    title: "US01: First-Login HCA Signing Flow"
    local_ref: US1
    estimate_days: 8
    state: Todo

tasks:
  - identifier: PLA-124
    title: "Create Agreement model"
    local_ref: T001
    story_ref: US1
    points: 3
    state: Todo

documents:
  - id: abc123
    title: "Epic: Client HCA"
    type: spec
```

### stories.yaml (story mapping)
```yaml
stories:
  US1:
    linear_id: PLA-123
    title: "US01: First-Login HCA Signing Flow"
    estimate_days: 8
    synced_at: 2026-01-31T14:30:00Z
  US2:
    linear_id: PLA-124
    title: "US02: Digital In-Portal Signature"
    estimate_days: 12
    synced_at: 2026-01-31T14:30:00Z
```

## Flags Reference

| Flag | Description |
|------|-------------|
| `push stories` | Push spec.md user stories to Linear |
| `push tasks` | Push tasks.md to Linear as sub-issues (with points) |
| `push docs` | Push idea-brief.md and spec.md to Linear document |
| `push all` | Push stories, tasks, and docs |
| `--dry-run` | Preview changes without writing |
| `--team <name>` | Specify target Linear team |
| `--project <name>` | Specify target Linear project |

## Label Mapping

| Local Type | Linear Label |
|------------|--------------|
| User Story | "User Story" |
| Bug | "Bug" |
| Feature | "Feature" |
| Improvement | "Improvement" |
| P1 | "Priority: High" |
| P2 | "Priority: Medium" |
| P3 | "Priority: Low" |

## Integration with Workflow

```
/trilogy-idea -> /speckit-specify -> /trilogy-estimate -> /speckit-tasks -> /trilogy-estimate tasks
                                                                                    ↓
                                                              /trilogy-linear-sync push all
                                                                                    ↓
                                                              /speckit-implement
```

## Example: Full Epic Sync

```bash
# Navigate to epic folder
cd .tc-docs/content/initiatives/Consumer-Lifecycle/Client-HCA

# Sync everything to Linear
/trilogy-linear-sync push all --team Planning

# Output:
# ✓ Created 19 user stories in Linear (PLA-101 to PLA-119)
#   - Estimates included in descriptions
# ✓ Created 45 tasks linked to stories
#   - Story points synced to estimate field
# ✓ Created document "Spec: Client HCA"
# ✓ Updated meta.yaml with Linear references
```

## Document Structure in Linear

When syncing docs, the Linear document is structured as:

```markdown
# [Epic Title]

## Idea Brief
[Content from IDEA-BRIEF.md]

---

## Specification
[Content from spec.md]

---

_Last synced: 2026-01-31T14:30:00Z_
```

**Note**: Uses Linear MCP tools directly. Requires Linear MCP server to be configured.
