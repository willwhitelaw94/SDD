---
name: trilogy-idea-handover
description: >-
  Run Gate 0 (Idea Gate) and create the epic in Linear as Planned.
  Use after /trilogy-idea is complete.
  Validates idea brief quality, problem statement clarity, RACI completeness,
  brevity (1-2 pages), creates Linear epic in Planned, and updates meta.yaml.
metadata:
  version: 1.0.0
  type: gate
---

# Idea Handover Skill (Gate 0: Idea Gate)

Validate idea brief completeness, problem statement clarity, RACI accuracy, and brevity — then create the epic in Linear as Planned and update meta.yaml.

## Purpose

This skill:
1. **Validates** idea-brief.md quality (problem statement, solution, RACI, brevity)
2. **Checks** HOD (Head of Department) acknowledgement
3. **Reviews** brief is 1-2 pages (120-150 lines max)
4. **Creates** epic in Linear as **Backlog**
5. **Updates** meta.yaml with `linear_project_id`, `linear_url`, and `status: planned`
6. **Posts** gate summary as a comment in Linear
7. **Advises** user on next steps including organising the discovery/alignment meeting

## When to Use

```bash
/trilogy-idea-handover           # Full gate process
/trilogy-idea-handover --check   # Quick gate check only (no Linear creation)
```

Run this skill when:
- Idea brief (`/trilogy-idea`) is complete
- Ready to formalise the epic and move to specification phase

## Position in Workflow

```
/trilogy-idea              → idea-brief.md
        ↓
/trilogy-idea-handover     → Gate 0 (Idea Gate: Create epic → Planned)
        ↓
/speckit-specify           → spec.md
/trilogy-clarify spec      → refine requirements
/trilogy-clarify business  → align on business objectives
/trilogy-spec-handover     → Gate 1 (Business Gate: Planned → Design)
        ↓
/trilogy-design            → design.md
/trilogy-mockup            → mockups/
/trilogy-design-handover   → Gate 2 (Design Gate: Design → Dev)
```

## Prerequisites

| Artifact | Required | Location |
|----------|----------|----------|
| idea-brief.md | Yes | Initiative epic folder |
| meta.yaml | Recommended | Initiative epic folder (will be created if missing) |

## Linear Initiative Lookup

When creating a Linear project, **always link it to its parent initiative**. Resolve the initiative from the epic's folder path:

```
.tc-docs/content/initiatives/{INITIATIVE_FOLDER}/{epic}/
```

### Top-Level Initiatives

| Local Folder | Linear Initiative Name | Linear Initiative ID |
|---|---|---|
| `Clinical-And-Care-Plan` | Clinical And Care Plan | `c5b5d7de-81ff-4b73-8c81-b1e71aaa006d` |
| `Consumer-Lifecycle` | Consumer Lifecycle | `d635662e-1e6a-4e70-a933-b052cee710cf` |
| `Supplier-Management` | Supplier Management | `f84a9901-1e56-4ff8-b920-abbb4f1e84f1` |
| `Budgets-And-Finance` | Budgets & Finance | `0075fe50-fcbc-4caf-a677-a563dd4a774a` |
| `Work-Management` | Work Management | `fa7e6ba5-4141-4569-8641-6dc8ba64f901` |
| `Coordinator-Management` | Coordinator Management | `997ee9a1-edc7-46ab-ab70-411e26675af9` |
| `Infrastructure` | Infrastructure | `eaa89030-3b6a-4395-aedb-5f8c90ce32e1` |
| `Consumer-Mobile` | Consumer Experience (Mobile) | `fb010552-b042-4dc6-aec9-285acb134127` |
| `ADHOC` | ADHOC | `c2b5e877-54e7-453e-979f-2af708ba7031` |

### Sub-Initiatives

Some initiatives have sub-initiatives. If the initiative meta.yaml contains a `sub_initiative` field, use the sub-initiative ID instead:

| Sub-Initiative | Parent Initiative | Linear Sub-Initiative ID |
|---|---|---|
| Care Planning | Clinical And Care Plan | `97ed2f9e-0476-41fc-9d31-573463629041` |
| Clinicianly | Clinical And Care Plan | `63b50ae8-9c6d-4e36-8827-e4908aaeefd6` |
| Selling | Consumer Lifecycle | `6ff0f592-14fe-487d-839a-1211575df6a9` |
| Onboarding | Consumer Lifecycle | `2e33f31a-fc2e-4599-be9b-803a58c49b04` |
| Managing | Supplier Management | `971801d3-9fc4-48f5-9121-ce4c84211418` |
| Profiling | Supplier Management | `e217dce4-546f-4979-af39-e437216dcb5f` |
| Invoicing | Supplier Management | `dee70123-b006-4265-8f10-aa13375126c4` |
| Budgeting | Budgets & Finance | `fbf60839-189f-48ce-935e-2aebd25d6957` |
| Collecting | Budgets & Finance | `602b3c68-537b-458e-a88d-3890599bba62` |
| Finance (Chat ID) | Budgets & Finance | `81256c52-97d7-4aec-9ab7-fa9270cc6f60` |

### Resolution Logic

1. Extract `{INITIATIVE_FOLDER}` from the epic's file path
2. Look up the folder in the **Top-Level Initiatives** table to get the `linear_initiative_id`
3. If the epic's `meta.yaml` specifies a `sub_initiative` key, match it to the **Sub-Initiatives** table and use that ID instead
4. If the folder doesn't match any known initiative, ask the user which initiative this belongs to
5. Pass the resolved ID as the `initiative` parameter to `mcp__linear__create_project`

## Execution Flow

### Step 1: Locate Initiative

Find the current initiative context:

```bash
find .tc-docs/content/initiatives -name "idea-brief.md" -type f 2>/dev/null | head -10
```

If multiple initiatives exist, ask user which one to process.

### Step 2: Load Artifacts

Read:
- `idea-brief.md` — Idea brief
- `meta.yaml` — Epic metadata (if exists)

### Step 3: Run Gate 0 Checklist

#### Idea Brief Completeness

| Check | How to Verify | Pass Criteria |
|-------|---------------|---------------|
| Problem Statement exists | Check `## Problem Statement` section | Clear user-facing pain points with bullets |
| Problem Statement is simple | Review language complexity | No jargon, plain English, a non-technical stakeholder can understand it |
| Current State described | Check `**Current State**` in Problem Statement | Brief description of how things work today |
| Possible Solution outlined | Check `## Possible Solution` section | High-level approach with before/after example |
| Benefits quantified | Check `## Benefits` section | At least one quantified metric (time saved, % improvement, $ value) |
| RACI complete | Check Owner + Other Stakeholders sections | Owner identified, at least Accountable and Consulted populated |
| Risks identified | Check `## Assumptions & Dependencies, Risks` | At least one risk with severity and mitigation |
| Effort estimated | Check `## Estimated Effort` | T-shirt size or sprint count provided |
| Proceed to PRD answered | Check `## Proceed to PRD?` | YES/NO with brief reason |

#### Brief Quality

| Check | How to Verify | Pass Criteria |
|-------|---------------|---------------|
| Brevity | Count lines (excluding frontmatter) | 120-150 lines max (1-2 pages) |
| No implementation details | Scan for technical terms | No mention of API, database, migration, component, framework |
| Plain English | Review language | Active voice, concrete examples, Trilogy Care terminology |
| TC terminology | Check entity names | Uses Package, Recipient, Coordinator, Supplier, Service, Budget, Contribution |
| Decision section present | Check `## Decision` section | Approval checkboxes exist (can be unchecked) |

#### RACI Validation

| Check | How to Verify | Pass Criteria |
|-------|---------------|---------------|
| Owner (R) identified | Check `## Owner` section | Name and role present |
| Accountable (A) identified | Check `## Other Stakeholders` | Name present — this should be the HOD or executive sponsor |
| Consulted (C) populated | Check `## Other Stakeholders` | At least one name/role, or `—` with explanation |
| Informed (I) populated | Check `## Other Stakeholders` | At least one name/role, or `—` if genuinely none |
| HOD acknowledged | Check Accountable person | The **A** (Accountable) person IS the HOD or has been informed — flag if missing |

**CRITICAL — HOD Acknowledgement:**

The Accountable person in the RACI should be the Head of Department (or equivalent executive). If the **A** role is empty or unclear:
1. Flag as a FAIL
2. Ask: "Who is the Head of Department or executive sponsor for this work? They need to be listed as Accountable."
3. Do not proceed to Linear creation until HOD is identified

### Step 4: Present Gate Results

```markdown
## Gate 0: Idea Gate Results

**Initiative**: [Name]
**Epic**: [Epic Name]
**Date**: YYYY-MM-DD
**Status**: PASS / FAIL

### Idea Brief Completeness: X/9 checks passed

| Check | Status | Notes |
|-------|--------|-------|
| Problem Statement | PASS/FAIL | |
| Simple language | PASS/FAIL | |
| Current State | PASS/FAIL | |
| Solution outlined | PASS/FAIL | |
| Benefits quantified | PASS/FAIL | |
| RACI complete | PASS/FAIL | |
| Risks identified | PASS/FAIL | |
| Effort estimated | PASS/FAIL | |
| Proceed to PRD | PASS/FAIL | |

### Brief Quality: X/5 checks passed

| Check | Status | Notes |
|-------|--------|-------|
| Brevity (1-2 pages) | PASS/FAIL | [X] lines |
| No implementation details | PASS/FAIL | |
| Plain English | PASS/FAIL | |
| TC terminology | PASS/FAIL | |
| Decision section | PASS/FAIL | |

### RACI Validation: X/5 checks passed

| Check | Status | Notes |
|-------|--------|-------|
| Owner (R) | PASS/FAIL | [Name] |
| Accountable (A) / HOD | PASS/FAIL | [Name] |
| Consulted (C) | PASS/FAIL | |
| Informed (I) | PASS/FAIL | |
| HOD acknowledged | PASS/FAIL | |

### Overall: PASS / FAIL
```

### Step 5: Fix Issues (if needed)

If any checks fail:

1. Present each failing check with specific issues
2. Show the corrected version (for brevity/language issues)
3. Ask user to approve corrections
4. Update idea-brief.md with approved corrections
5. Re-run the failed checks

For RACI gaps, ask the user directly rather than guessing.

### Step 6: Create Linear Epic (PASS only)

**Only if Gate 0 passes (or user uses `--force`):**

#### 6a: Resolve Initiative

Determine the Linear initiative ID using the **Linear Initiative Lookup** table:

1. Extract the initiative folder name from the epic path (e.g., `Supplier-Management`)
2. Look up the initiative ID from the table (e.g., `f84a9901-1e56-4ff8-b920-abbb4f1e84f1`)
3. Check if a sub-initiative applies (from epic meta.yaml `sub_initiative` field or context)

#### 6b: Create Linear Project

```
mcp__linear__create_project(
  name: "[Epic Code] [Epic Name]",
  description: "[Problem statement summary from idea brief]",
  state: "Planned",
  team: "Planning",
  initiative: "[resolved_initiative_id]"
)
```

**CRITICAL**: Use `state: "Planned"` — this is the initial state for new epics.
**CRITICAL**: Always pass `initiative` — every project must be linked to its parent initiative.

#### 6c: Post Gate Summary as Comment

```
mcp__linear__create_comment(
  issueId: "<new_project_id>",
  body: """
  ## Gate 0: Idea Gate PASSED

  **Date**: YYYY-MM-DD

  ### Problem Statement
  [1-2 sentence summary from idea brief]

  ### RACI
  - **Owner (R)**: [Name] ([Role])
  - **Accountable (A)**: [Name] ([Role/HOD])
  - **Consulted (C)**: [Names]
  - **Informed (I)**: [Names]

  ### Estimated Effort
  [T-shirt size / sprint count]

  ### Next Step
  Ready for `/speckit-specify` (Feature Specification)
  """
)
```

#### 6d: Push Idea Brief as Linear Document

```
mcp__linear__create_document(
  title: "Idea Brief: [Epic Name]",
  project: "<new_project_id>",
  content: "[Full idea-brief.md content]"
)
```

#### 6e: Update meta.yaml

If meta.yaml exists, update it. If not, create it:

```yaml
title: '[Epic Name]'
prefix: [CCC]
status: planned
summary: "[One-line from problem statement]"
linear_project_id: [uuid from step 6b]
linear_url: [url from step 6b]
linear_initiative_id: [uuid from step 6a]
gates:
  idea:
    passed: true
    date: YYYY-MM-DD
    notes: "[Owner name, effort estimate, key risk identified]"
```

**IMPORTANT**: Use lowercase `backlog` (not `Backlog`). This is the canonical meta.yaml format.

#### 6f: Verify

1. Re-read meta.yaml — status should be `backlog`, `linear_project_id` and `linear_initiative_id` should be set
2. Confirm Linear project was created in Planned state
3. Confirm project is linked to the correct initiative

### Step 7: Report Completion

```markdown
## Gate 0: Idea Gate Complete

**Status**: PASS
**Linear**: Epic created in "Backlog" — [Linear URL]
**meta.yaml**: Updated with `status: planned` and Linear IDs

### What Was Validated
- Problem statement is clear and simple
- Brief is within 1-2 page limit ([X] lines)
- RACI complete with HOD ([Name]) as Accountable
- Benefits quantified, risks identified
- Effort estimated at [X sprints]

### Artifacts
- idea-brief.md — [path]
- meta.yaml — [path]
- Linear project — [URL]

### What Happens Next

Based on the RACI, **[Owner Name]** should:

1. **Organise a discovery/alignment meeting** with the Consulted stakeholders:
   - [List C names from RACI]
   - Purpose: Validate the problem statement, refine scope, and agree on next steps
   - The Accountable person ([A name]) should be invited for final sign-off

2. After alignment, run the specification phase:
   - `/speckit-specify` — Create detailed feature specification
   - `/trilogy-clarify spec` — Refine requirements through spec lens
   - `/trilogy-clarify business` — Align on business objectives
   - `/trilogy-spec-handover` — Gate 1 (Planned → Design)
```

## Options

| Flag | Description |
|------|-------------|
| `--check` | Run gate checklist only, no Linear creation |
| `--force` | Proceed even if gate fails (document gaps and create anyway) |

## Failure Handling

If Gate 0 fails:

1. **List specific gaps** — Which checks failed and why
2. **Fix inline** — Offer to update idea-brief.md
3. **Suggest remediation** — What to complete before retrying

```markdown
## Gate 0: FAIL

### Gaps Identified

| Check | Status | Gap | Remediation |
|-------|--------|-----|-------------|
| RACI | FAIL | No HOD identified | Ask user for Accountable person |
| Brevity | FAIL | 200 lines (too long) | Trim to 150 lines |
| Problem Statement | FAIL | Too technical | Rewrite in plain English |

### Options

1. **Fix inline** — I'll update the idea brief now to address the gaps
2. **Revisit idea** — Run `/trilogy-idea` again with clearer input
3. **Force pass** — Use `--force` to create Linear epic anyway (gaps documented)
```

## Integration

| Before | After |
|--------|-------|
| `/trilogy-idea` | `/speckit-specify` |
| | `/trilogy-clarify spec` |
| | `/trilogy-clarify business` |

## Full Gate Lifecycle

| Gate | Skill | Linear Transition | meta.yaml |
|------|-------|-------------------|-----------|
| **Gate 0: Idea Gate** | `/trilogy-idea-handover` | **Create epic → Planned** | `status: planned` |
| Gate 1: Business Gate | `/trilogy-spec-handover` | Planned → **Design** | `status: design` |
| Gate 2: Design Gate | `/trilogy-design-handover` | Design → **Dev** | `status: in progress` |
