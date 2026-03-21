---
name: trilogy-raci
description: Generate RACI matrices for team roles and decisions. Use when defining responsibilities, decision authority, or stakeholder mapping. Triggers on: RACI, responsibilities, stakeholder matrix, decision authority, team roles.
---

# Trilogy RACI Skill

Generate a RACI (Responsible, Accountable, Consulted, Informed) matrix to define team roles and decision-making authority.

## Execution Steps

### Step 1: Identify Epic/Feature

Which epic or feature needs a RACI matrix?

### Step 2: Read Context

If epic exists:
- Load `.tc-docs/content/initiatives/TP-XXXX/TP-YYYY/idea.md` or `PRD.md`
- CCC = 3-letter epic code from meta.yaml
- Get Linear details if available
- Understand feature scope and impacted departments

### Step 3: Create RACI Matrix

Generate lean RACI.md with:
- Simple markdown format (no YAML frontmatter)
- Stakeholder table: Name, Role, Teams Chat, Allocation, RACI Role(s)
- Decision authority (key decisions only)

### Step 4: Content Structure

```markdown
# RACI Matrix: [Feature Name] ([Epic Key])

## Stakeholders

| Name | Role | Teams Chat | Allocation | RACI Role |
|------|------|-----------|-----------|-----------|
| Will | Lead Product Owner | Will (CEO Office) | 80% | A (Go/No-Go) |
| Tim | Engineering Lead | Tim (Dev Lead) | 70% | A (Architecture) |

## Decision Authority

- **Go/No-Go Decision:** Accountable: Will | Consulted: Engineering, Finance
- **Technical Architecture:** Accountable: Tim | Consulted: Backend, QA
```

### Step 5: Save Output

Save to:
- Epic: `.tc-docs/content/initiatives/TP-XXXX/TP-YYYY/CCC-RACI.md`
- CCC = 3-letter epic code (CAPITALS)

## RACI Definitions

- **R (Responsible)**: Does the work to complete the task
- **A (Accountable)**: Ultimately answerable, has final decision authority (only one per task)
- **C (Consulted)**: Provides input (two-way communication)
- **I (Informed)**: Kept up-to-date (one-way communication)

## Notes

- Use real names and exact Teams chat names
- Include all relevant stakeholders
- Allocation % represents time commitment to this epic
- Keep it lean and practical - focus on clarity
