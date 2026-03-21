---
name: trilogy-spec-handover
description: >-
  Run Gate 1 (Business Gate) and transition epic within Planned status.
  Use after /speckit-specify AND /trilogy-clarify spec are complete.
  Validates spec quality, story accuracy, business alignment, transitions
  Linear project status, and updates meta.yaml.
metadata:
  version: 1.1.0
  type: gate
---

# Spec Handover Skill (Gate 1: Business Gate)

Validate specification completeness, story quality, and business alignment — then transition the epic within Planned status in both Linear and local docs.

## Purpose

This skill:
1. **Validates** spec.md quality (stories accurate, simple language, INVEST criteria)
2. **Checks** business alignment (clarify spec + clarify business done)
3. **Reviews** story language for Trilogy Care terminology and plain English
4. **Transitions** Linear project status from Planned (no transition)
5. **Updates** meta.yaml status from `backlog` → `design`
6. **Posts** gate summary as a project status update in Linear

## When to Use

```bash
/trilogy-spec-handover           # Full gate process
/trilogy-spec-handover --check   # Quick gate check only (no status transition)
```

Run this skill when:
- Specification (`/speckit-specify`) is complete
- Spec clarification (`/trilogy-clarify spec`) is complete
- Business clarification (`/trilogy-clarify business`) is complete (recommended, not required)
- Ready to hand off to Design phase

## Position in Workflow

```
/speckit-specify          → spec.md
/trilogy-clarify spec     → refine requirements
/trilogy-clarify business → align on business objectives (recommended)
        ↓
/trilogy-spec-handover    → Gate 1 (Business Gate: Planned (no transition))
        ↓
/trilogy-design           → design.md
/trilogy-mockup           → mockups/
/trilogy-design-handover  → Gate 2 (Design Gate: Design → Dev)
```

## Prerequisites

| Artifact | Required | Location |
|----------|----------|----------|
| spec.md | Yes | Initiative folder |
| meta.yaml | Yes | Initiative folder (needs `linear_project_id`) |
| business-spec.md | Recommended | Initiative folder (from `/trilogy-clarify business`) |

## Execution Flow

### Step 1: Locate Initiative

Find the current initiative context:

```bash
find .tc-docs/content/initiatives -name "spec.md" -type f 2>/dev/null | head -10
```

If multiple initiatives exist, ask user which one to process.

### Step 2: Load Artifacts

Read:
- `spec.md` — Feature specification
- `meta.yaml` — Epic metadata (for Linear project ID)
- `business-spec.md` — Business specification (if exists)
- `idea-brief.md` or `idea.md` — Original idea (if exists)

### Step 3: Run Gate 1 Checklist

#### Spec Completeness

| Check | How to Verify | Pass Criteria |
|-------|---------------|---------------|
| User stories exist | Count stories in spec.md | At least 1 user story |
| Acceptance criteria defined | Check each story has Given/When/Then | All stories have testable criteria |
| Success criteria measurable | Check success metrics section | Quantifiable metrics present |
| No unresolved clarifications | Search for `[NEEDS CLARIFICATION]` markers | Zero markers remain |
| Functional requirements listed | Check FR section exists | FRs are testable and numbered |
| Key entities identified | Check entities/data section | Core domain objects documented |

#### Story Quality (INVEST + Language)

**CRITICAL**: Review each user story against these quality checks:

| Check | How to Verify | Pass Criteria |
|-------|---------------|---------------|
| INVEST compliance | Each story is Independent, Negotiable, Valuable, Estimable, Small, Testable | All 6 criteria met per story |
| Simple language | No jargon, technical terms, or implementation details | Business stakeholder can understand |
| Active voice | Stories use "Coordinators can..." not "Bills can be..." | Active voice throughout |
| TC terminology | Uses Package, Recipient, Coordinator, Supplier, Service, Budget, Contribution | No generic terms (user, account, vendor, product) |
| Concrete examples | Stories include specific examples where helpful | Not vague or abstract |
| Measurable outcomes | "Reduces X from Y to Z" not "Faster processing" | Specific numbers where applicable |

**Story Language Review Process:**

For each user story, verify:
1. **Title** is clear and describes the user goal (not the implementation)
2. **As a / I want / So that** follows standard format
3. **Acceptance criteria** are testable without knowing implementation
4. **No technical jargon** — no mention of API, database, component, migration, etc.
5. **Trilogy Care terms** used correctly throughout

Flag any stories that need rewriting and present corrections.

#### Business Alignment

| Check | How to Verify | Pass Criteria |
|-------|---------------|---------------|
| Business problem stated | Check spec overview or business-spec.md | Clear problem definition |
| Stakeholders identified | Check RACI or stakeholder section | At least product owner identified |
| Clarify spec complete | Check for `## Clarifications` section in spec.md | At least one session recorded |
| Clarify business done | Check business-spec.md exists | Recommended but not blocking |

### Step 4: Present Gate Results

```markdown
## Gate 1: Business Gate Results

**Initiative**: [Name]
**Date**: YYYY-MM-DD
**Status**: PASS / FAIL

### Spec Completeness: X/6 checks passed

| Check | Status | Notes |
|-------|--------|-------|
| User stories | PASS/FAIL | X stories found |
| Acceptance criteria | PASS/FAIL | |
| ... | ... | ... |

### Story Quality: X/Y stories pass

| Story | INVEST | Language | TC Terms | Status |
|-------|--------|----------|----------|--------|
| US01: ... | PASS | PASS | PASS | PASS |
| US02: ... | PASS | FAIL | PASS | FAIL |

**Stories needing revision:**
- US02: Uses passive voice in acceptance criteria, mentions "API endpoint"
  - Suggested fix: [corrected version]

### Business Alignment: X/4 checks passed

| Check | Status | Notes |
|-------|--------|-------|
| Business problem | PASS/FAIL | |
| ... | ... | ... |

### Overall: PASS / FAIL
```

### Step 5: Fix Stories (if needed)

If any stories fail quality checks:

1. Present each failing story with the specific issues
2. Show the corrected version
3. Ask user to approve corrections
4. Update spec.md with approved corrections
5. Re-run the failed checks

### Step 6: Transition Status (PASS only)

**Only if Gate 1 passes (or user uses `--force`):**

#### 6a: Update Linear

1. Read `linear_project_id` from `meta.yaml`
2. Update project status using `save_project`:
   ```
   mcp__linear__save_project(
     id: "<linear_project_id>",
     state: "Planned"
   )
   ```
   **CRITICAL**: Use `state: "Planned"` — NOT "Started", "Start", "In Progress", or "Planned". These are workspace-specific state names.

3. Post gate summary as a **project status update** (NOT a comment — projects are not issues):
   ```
   mcp__linear__save_status_update(
     type: "project",
     project: "<linear_project_id>",
     health: "onTrack",
     body: """
     ## Gate 1: Business Gate PASSED

     **Date**: YYYY-MM-DD

     ### Summary
     - X user stories validated
     - All stories meet INVEST criteria
     - Business alignment confirmed
     - Spec clarification complete

     ### User Stories
     - US01: [title]
     - US02: [title]
     ...

     ### Next Step
     Ready for `/trilogy-design` (Design Kickoff)
     """
   )
   ```

#### 6b: Update meta.yaml

Update `status` and append the `gates.spec` record. **Do not overwrite existing gate records** — only add the new `spec` key under `gates`:
```yaml
status: planned    # Stays in planned (spec validated)
gates:
  idea:           # preserved from Gate 0
    passed: true
    date: YYYY-MM-DD
    notes: "..."
  spec:           # added now
    passed: true
    date: YYYY-MM-DD
    notes: "[X user stories validated, clarification sessions complete, business alignment confirmed]"
```

**IMPORTANT**: Use lowercase `design` (not `Design`, `started`, or `Started`). This is the canonical meta.yaml format per `trilogy-linear-sync` status mapping.

#### 6c: Update spec.md status

Change the `**Status**:` line in spec.md frontmatter area:
```
**Status**: Approved (Gate 1 passed YYYY-MM-DD)
```

This marks the spec as formally reviewed and approved, distinguishing it from draft specs still in progress.

### Step 7: Report Completion

```markdown
## Gate 1: Business Gate Complete

**Status**: PASS
**Linear**: Stays in "Planned"
**meta.yaml**: Stays in "planned"

### What Was Validated
- X user stories (all INVEST compliant)
- Story language quality (simple, active, TC terminology)
- Business alignment confirmed
- X clarification sessions recorded

### Artifacts
- spec.md — [path]
- business-spec.md — [path] (if exists)
- meta.yaml — [path]

### Next Steps
- [ ] Run `/trilogy-design` to begin design kickoff
- [ ] Schedule design discussion if needed
```

## Options

| Flag | Description |
|------|-------------|
| `--check` | Run gate checklist only, no status transition |
| `--force` | Proceed even if gate fails (document gaps and transition anyway) |

## Failure Handling

If Gate 1 fails:

1. **List specific gaps** — Which checks failed and why
2. **Fix stories inline** — Offer to rewrite failing stories
3. **Suggest remediation** — Which skill to run next

```markdown
## Gate 1: FAIL

### Gaps Identified

| Check | Status | Gap | Remediation |
|-------|--------|-----|-------------|
| Story quality | FAIL | US03 uses technical jargon | Rewrite story |
| Clarify spec | FAIL | No clarification sessions | Run `/trilogy-clarify spec` |

### Options

1. **Fix inline** — I'll rewrite the failing stories now
2. **Run clarify** — Run `/trilogy-clarify spec` to address gaps
3. **Force pass** — Use `--force` to transition anyway (gaps documented)
```

## Integration

| Before | After |
|--------|-------|
| `/speckit-specify` | `/trilogy-design` |
| `/trilogy-clarify spec` | `/trilogy-mockup` |
| `/trilogy-clarify business` | |
