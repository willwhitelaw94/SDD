---
name: trilogy-clarify-spec
description: >-
  Refine a feature specification through the requirements analyst lens. Scans spec.md
  for ambiguity across 10 taxonomy categories and asks targeted questions to fill gaps.
  Triggers on: clarify spec, refine spec, spec questions, spec review, nail down requirements.
metadata:
  version: 1.0.0
  type: agent
---

# Clarify Spec

Detect and reduce ambiguity or missing decision points in functional and technical requirements.

## Prerequisites

| Artifact | Required | Location |
|----------|----------|----------|
| spec.md | Yes | Initiative folder (from `/speckit-specify`) |

If spec.md doesn't exist: "Run `/speckit-specify` first to create the specification."

## Output

Updates `spec.md` in the epic folder — appends clarifications and refines existing sections.

## Execution Flow

### Step 1: Find the Spec

```bash
git branch --show-current
find .tc-docs/content/initiatives -name "spec.md" -type f 2>/dev/null | sort
```

Read the spec.md thoroughly.

### Step 2: Structured Scan

Scan the spec against each taxonomy category. Mark status: **Clear** / **Partial** / **Missing**.

| Category | Focus Areas |
|----------|-------------|
| **Functional Scope & Behavior** | Core user goals, out-of-scope declarations, user roles |
| **Domain & Data Model** | Entities, attributes, relationships, lifecycle/state transitions |
| **User Journeys & Flows** | Critical user journeys, decision points, happy/unhappy paths |
| **Non-Functional Quality** | Performance, scalability, reliability, observability, security |
| **Integration & Dependencies** | External services/APIs, data import/export |
| **Edge Cases & Failure Handling** | Negative scenarios, rate limiting, conflict resolution |
| **Constraints & Tradeoffs** | Technical constraints, rejected alternatives |
| **Terminology & Consistency** | Canonical glossary terms |
| **Completion Signals** | Acceptance criteria testability, Definition of Done indicators |
| **Misc / Placeholders** | TODO markers, ambiguous adjectives lacking quantification |

### Scope Boundary — Spec vs Design

The spec lens focuses on **what** and **why**, NOT **how it looks**. Defer these to `/trilogy-clarify design`:

| Ask in Spec (requirements/UX) | Defer to Design (UI) |
|-------------------------------|----------------------|
| What data does the user need to see? | Which component renders it? (table vs cards vs list) |
| What actions can the user take? | Where do buttons/controls go? (layout, placement) |
| What happens on error/empty/loading? | How are error/empty/loading states visually presented? |
| What's the user journey flow? | What's the screen-by-screen wireframe? |
| What permissions/roles apply? | How do disabled/hidden states render? |
| What fields are required vs optional? | What's the form layout and validation UX? |

If a question crosses into UI territory, **still note the gap** but mark it as `[DEFER TO DESIGN]` rather than asking the user to choose a UI pattern during spec clarification.

### Step 3: Ask Questions

- **Minimum 5 questions** per session
- Each answerable with: multiple-choice (2-5 options) OR short-phrase (<=5 words)
- Always provide **recommended option** with reasoning
- Only ask questions whose answers materially impact: architecture, data modeling, task decomposition, test design, UX behavior, operational readiness, or compliance
- After every 5 questions, ask "Keep clarifying spec?" — if yes, re-scan for new gaps; if no, finish

### Step 4: Update Spec

After each answer, update spec.md:
1. Apply the clarification to the appropriate section
2. Append to `## Clarifications` section:

```markdown
### Session YYYY-MM-DD
- Q: <question> → A: <final answer>
```

### Step 5: Report

```
## Spec Clarification Complete

**Questions Asked**: N
**Categories Improved**: [list]

**Key Decisions**:
- [decision 1]
- [decision 2]

**Document Updated**: spec.md

**Next Steps**:
- /trilogy-clarify-business → Align on business objectives
- /trilogy-flow → Generate user flow diagrams
- /trilogy-spec-handover → Gate 1
```

## Behavior Rules

- Minimum 5 questions per session; after every 5, ask "Keep clarifying spec?"
- Respect user termination signals ("skip", "done", "enough") at any point
- Save spec.md after each answered question (not batched at end)
- Each question: multiple-choice (2-5 options) OR short-phrase answer
- Always provide recommended option with reasoning

## Workflow Position

```
/speckit-specify         → spec.md (initial)
        ↓
/trilogy-clarify-spec    → spec.md (refined)
        ↓
/trilogy-clarify-business → business alignment
        ↓
/trilogy-spec-handover   → Gate 1
```
