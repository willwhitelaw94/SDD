---
name: trilogy-clarify-business
description: >-
  Clarify business outcomes, success metrics, ROI, and stakeholder alignment for a feature.
  Asks targeted questions through the PM/stakeholder lens. Updates business.md.
  Triggers on: clarify business, business alignment, business review, ROI, success metrics,
  stakeholder alignment.
metadata:
  version: 1.0.0
  type: agent
---

# Clarify Business

Clarify business outcomes, success metrics, ROI, and stakeholder alignment.

## Prerequisites

| Artifact | Required | Location |
|----------|----------|----------|
| idea-brief.md OR spec.md | At least one | Epic folder in `.tc-docs/content/initiatives/` |

At least one of these must exist. If neither exists: "Run `/trilogy-idea` or `/speckit-specify` first to create the idea brief or specification."

## Output

Creates or updates `business.md` in the epic folder.

## Execution Flow

### Step 1: Find Context Documents

```bash
git branch --show-current
find .tc-docs/content/initiatives -name "idea-brief.md" -type f 2>/dev/null | sort
find .tc-docs/content/initiatives -name "spec.md" -type f 2>/dev/null | sort
```

Read whichever documents exist (both if available) to understand the feature context:
- **idea-brief.md** — problem statement, proposed solution, RACI, high-level scope
- **spec.md** — detailed requirements, user stories, acceptance criteria

If both exist, use spec.md as the primary source and idea-brief.md for additional business context (problem framing, stakeholders, RACI).

### Step 2: Structured Scan

Scan against these business focus areas. Mark status: **Clear** / **Partial** / **Missing**.

| Category | Focus Areas |
|----------|-------------|
| **Business Outcomes & Value** | Primary problem, expected ROI, OKR alignment, opportunity cost |
| **Success Metrics & KPIs** | Quantifiable metrics, leading indicators, lagging indicators, baseline |
| **Stakeholder Alignment** | Key stakeholders, decision authority, RACI, competing priorities |
| **Risk & Constraints** | Business risks, compliance/regulatory, budget, timeline pressure |
| **Market & Customer Context** | Target users, competitive landscape, pain points, market timing |

### Step 3: Ask Questions

- **Minimum 5 questions** per session
- Each answerable with: multiple-choice (2-5 options) OR short-phrase (<=5 words)
- Always provide **recommended option** with reasoning
- After every 5 questions, ask "Keep clarifying business?" — if yes, re-scan; if no, finish

### Step 4: Create/Update Business Spec

After each answer, update `business.md`:

```markdown
# Business: [Feature Name]

## Executive Summary

## Business Problem
- Current state
- Pain points
- Opportunity

## Business Objectives
- Primary goals
- Secondary goals
- Non-goals

## Success Metrics & KPIs
| Metric | Baseline | Target | Measurement |
|--------|----------|--------|-------------|

## Stakeholder Analysis
| Stakeholder | Role | Interest | RACI |
|-------------|------|----------|------|

## Business Risks & Mitigations
| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|

## ROI Analysis
- Investment
- Expected returns
- Payback period

## Market Context
- Target users
- Competitive landscape
- Timing considerations

## Business Clarifications
### Session YYYY-MM-DD
- Q: ... → A: ...

## Approval
- [ ] Business objectives approved
- [ ] Success metrics defined
- [ ] Stakeholders aligned
```

### Step 5: Report

```
## Business Clarification Complete

**Questions Asked**: N

**Key Decisions**:
- [decision 1]
- [decision 2]

**Document Updated**: business.md

**Next Steps**:
- /trilogy-flow → Generate user flow diagrams
- /trilogy-spec-handover → Gate 1
```

## Behavior Rules

- Minimum 5 questions per session; after every 5, ask "Keep clarifying business?"
- Respect user termination signals at any point
- Save business.md after each answered question
- Always provide recommended option with reasoning

## Workflow Position

```
/trilogy-idea               → idea-brief.md
        ↓
/speckit-specify            → spec.md
        ↓
/trilogy-clarify-spec       → spec.md (refined)
        ↓
/trilogy-clarify-business   → business.md (can run after idea OR spec)
        ↓
/trilogy-spec-handover      → Gate 1
```
