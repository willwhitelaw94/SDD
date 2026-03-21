---
name: trilogy-clarify-dev
description: >-
  Clarify technical strategy, architecture, and implementation approach for a feature.
  Asks targeted questions through the engineer/architect lens. Requires plan.md.
  Triggers on: clarify dev, clarify development, technical questions, architecture review,
  refine plan, dev clarify.
metadata:
  version: 1.0.0
  type: agent
---

# Clarify Dev

Clarify technical strategy, architecture, and implementation approach.

## Prerequisites

| Artifact | Required | Location |
|----------|----------|----------|
| plan.md | Yes | Initiative folder (from `/speckit-plan`) |

If plan.md doesn't exist: "Run `/speckit-plan` first to create the technical plan."

## Output

Updates existing `plan.md` in the epic folder with clarified technical decisions.

## Execution Flow

### Step 1: Find the Plan

```bash
git branch --show-current
find .tc-docs/content/initiatives -name "plan.md" -type f 2>/dev/null | sort
```

Read plan.md thoroughly. Also read spec.md and design.md for context.

### Step 2: Structured Scan

Scan the plan against each category. Mark status: **Clear** / **Partial** / **Missing**.

| Category | Focus Areas |
|----------|-------------|
| **Architectural Approach** | Overall strategy, integration with existing systems, technology choices, data flow, scalability |
| **Implementation Strategy** | Phases, dependencies, MVP vs full scope, risk mitigation, proof-of-concept needs |
| **Technical Constraints & Trade-offs** | Non-negotiable constraints, patterns/standards, legacy integrations, performance targets |
| **Testing & Quality Strategy** | Testing pyramid, coverage targets, critical edge cases, QA process, accessibility/performance/security testing |
| **Infrastructure & DevOps** | Infrastructure needs, environment constraints, deployment strategy, data migrations, monitoring |
| **Risk & Mitigation** | Top technical risks, fallback/rollback strategy, vendor dependencies, security threat model |

### Step 3: Ask Questions

- **Minimum 5 questions** per session
- Each answerable with: multiple-choice (2-5 options) OR short-phrase (<=5 words)
- Always provide **recommended option** with reasoning
- Only ask questions whose answers materially impact architecture, implementation, or risk
- After every 5 questions, ask "Keep clarifying dev?" — if yes, re-scan; if no, finish

### Step 4: Update Plan

After each answer, update plan.md:
1. Apply the clarification to the appropriate section
2. Append to `## Development Clarifications` section:

```markdown
### Session YYYY-MM-DD
- Q: <question> → A: <final answer>
```

### Step 5: Report

```
## Dev Clarification Complete

**Questions Asked**: N
**Categories Improved**: [list]

**Key Decisions**:
- [decision 1]
- [decision 2]

**Document Updated**: plan.md

**Next Steps**:
- /speckit-tasks → Generate implementation tasks
- /trilogy-estimate → Effort estimation
```

## Behavior Rules

- Minimum 5 questions per session; after every 5, ask "Keep clarifying dev?"
- Respect user termination signals at any point
- Save plan.md after each answered question
- Always provide recommended option with reasoning
- Reference existing codebase patterns when suggesting architectural approaches

## Workflow Position

```
/speckit-plan             → plan.md (initial)
        ↓
/trilogy-clarify-dev      → plan.md (refined)
        ↓
/speckit-tasks            → tasks.md
        ↓
/speckit-implement        → Code
```
