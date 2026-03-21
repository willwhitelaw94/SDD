---
name: trilogy-clarify
description: >-
  Clarify specifications through different stakeholder lenses (spec, business, design, development, db).
  Use when refining requirements, catching blind spots, or ensuring alignment across perspectives.
  Run with lens argument: /trilogy-clarify spec, /trilogy-clarify design, etc.
metadata:
  version: 1.0.0
  type: agent
---

# Trilogy Clarify Skill

Run specifications through different stakeholder perspectives to catch blind spots and ensure alignment.

## Available Lenses

| Lens | Perspective | Output | Prerequisite | Focus Areas |
|------|-------------|--------|--------------|-------------|
| `spec` | Requirements Analyst | Updates `spec.md` | spec.md exists | Functional requirements, edge cases, data model, integrations. Defers UI/component questions to `design` lens |
| `business` | PM/Stakeholder | Creates `business.md` | spec.md exists | Outcomes, success metrics, ROI, stakeholder alignment |
| `design` | UX/UI Designer | Updates `design.md` | **design.md exists** | UX decisions, component selection, interactions, responsive behavior |
| `development` | Engineer/Architect | Updates `plan.md` | **plan.md exists** | Architecture, constraints, risks, implementation strategy |
| `release` | Release Engineer | Updates `spec.md` or creates `release-plan.md` | spec.md + plan.md exist | Deployment risks, rollback, data migration, feature flags, stakeholder comms |

## Usage

```bash
# Single lens
/trilogy-clarify spec          # Requires: spec.md
/trilogy-clarify business      # Requires: spec.md
/trilogy-clarify design        # Requires: design.md (from /trilogy-design)
/trilogy-clarify development   # Requires: plan.md (from /speckit-plan)
/trilogy-clarify release       # Requires: spec.md + plan.md

# Multiple lenses (runs sequentially)
/trilogy-clarify spec business

# All available lenses
/trilogy-clarify all
```

## Recommended Workflow

```
/speckit-specify             → Create initial spec
        ↓
/trilogy-clarify spec        → Nail down functional requirements (5 questions)
        ↓
/trilogy-spec-explorer       → Interactive story map + FR traceability (optional visual review)
        ↓
/trilogy-clarify business    → Align on business objectives
        ↓
/trilogy-flow                → Generate user flow diagrams
        ↓
/trilogy-design              → Design decisions → creates design.md
        ↓
/trilogy-clarify design      → Refine UX/UI decisions
        ↓
/speckit-plan                → Create technical plan → creates plan.md
        ↓
/trilogy-clarify development → Refine technical approach
        ↓
/speckit-tasks               → Generate implementation tasks → creates tasks.md
```

## Execution Flow

### Step 1: Parse Lens Argument

```
Input: "/trilogy-clarify design"
       "/trilogy-clarify business design"
       "/trilogy-clarify all"

Parse into: lenses = ["design"] | ["business", "design"] | ["spec", "business", "design", "development", "db"]
```

### Step 2: Check Prerequisites

For each lens, check that required artifacts exist:

| Lens | Required Artifact | If Missing |
|------|-------------------|------------|
| `spec` | spec.md | "Run `/speckit-specify` first" |
| `business` | spec.md | "Run `/speckit-specify` first" |
| `design` | design.md | "Run `/trilogy-design` first to create design artifact" |
| `development` | plan.md | "Run `/speckit-plan` first to create technical plan" |
| `release` | spec.md + plan.md | "Run `/speckit-specify` and `/speckit-plan` first" |

```bash
# Check for required files
find .tc-docs/content/initiatives -name "spec.md" -type f 2>/dev/null | sort
find .tc-docs/content/initiatives -name "design.md" -type f 2>/dev/null | sort
find .tc-docs/content/initiatives -name "plan.md" -type f 2>/dev/null | sort
```

**Skip lenses where prerequisites are missing** with a message explaining what to run first.

### Step 3: Load Lens Instructions

Read the appropriate lens file from `lenses/{lens}.md` and execute its clarification process.

### Step 4: Run Clarification Loop

For each lens:
1. Perform structured scan using lens-specific taxonomy
2. Ask questions one at a time (minimum 5 per lens)
3. After every 5 questions, ask the user: "Keep clarifying {lens}?" — if yes, re-scan for new gaps and continue; if no, move to the next lens or finish
4. Update appropriate output document after each answer
5. Record decisions in Clarifications section of relevant doc
6. Respect user termination signals ("skip", "done", "next lens") at any point

### Step 5: Report Completion

```
## Clarification Complete

**Lenses Run**: design, development
**Questions Asked**: 8 total (4 design, 4 development)

**Key Decisions**:
- [design] Primary user: customer-facing staff
- [design] Layout: master-detail with CommonSplitPanel
- [development] Architecture: event-driven with queued jobs
- [development] Risk: Legacy API integration

**Documents Updated**:
- design-spec.md (created)
- plan.md (updated)

**Next Steps**:
- /trilogy-mockup → Generate wireframes
- /speckit-plan → Create implementation plan
```

## Common Patterns

### Quick Clarification (Single Lens)
```
/trilogy-clarify design
```
Run just the design lens when you know that's what needs refinement.

### Full Clarification (All Lenses)
```
/trilogy-clarify all
```
Run all lenses for comprehensive coverage before major planning.

### Focused Clarification (Multiple Lenses)
```
/trilogy-clarify business design
```
Run specific lenses when you know which perspectives need work.

## Behavior Rules

- **Minimum 5 questions per lens** — after every 5 questions, ask "Keep clarifying?" to continue or wrap up
- Respect user termination signals ("skip", "done", "next lens") at any point
- Each question: multiple-choice (2-5 options) OR short-phrase answer
- Always provide **recommended option** with reasoning
- Save documents after each answered question (not batched at end)
- **Skip lenses where prerequisites are missing** - explain what to run first

## Integration with Other Skills

- **Before**: `/trilogy-idea` or `/speckit-specify` to create initial spec
- **After spec lens**: `/trilogy-spec-explorer` to visually review stories, FR traceability, and acceptance scenarios
- **After**: `/trilogy-mockup` for wireframes, `/speckit-plan` for implementation planning
- **Related**: `/speckit-analyze` to check for inconsistencies across artifacts
