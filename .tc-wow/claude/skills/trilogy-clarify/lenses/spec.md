# Spec Lens

Detect and reduce ambiguity or missing decision points in functional and technical requirements.

## Output
Updates `spec.md` in the epic folder.

## Taxonomy Categories

Scan the spec for each category. Mark status: Clear / Partial / Missing.

| Category | Focus Areas |
|----------|-------------|
| **Functional Scope & Behavior** | Core user goals, out-of-scope declarations, user roles |
| **Domain & Data Model** | Entities, attributes, relationships, lifecycle/state transitions |
| **Interaction & UX Flow** | Critical user journeys, error/empty/loading states |
| **Non-Functional Quality** | Performance, scalability, reliability, observability, security |
| **Integration & Dependencies** | External services/APIs, data import/export |
| **Edge Cases & Failure Handling** | Negative scenarios, rate limiting, conflict resolution |
| **Constraints & Tradeoffs** | Technical constraints, rejected alternatives |
| **Terminology & Consistency** | Canonical glossary terms |
| **Completion Signals** | Acceptance criteria testability, Definition of Done indicators |
| **Misc / Placeholders** | TODO markers, ambiguous adjectives lacking quantification |

## Question Constraints

- Minimum 5 questions per session; after every 5, ask "Keep clarifying spec?" to continue or wrap up
- Each answerable with: multiple-choice (2-5 options) OR short-phrase (<=5 words)
- Only include questions whose answers materially impact: architecture, data modeling, task decomposition, test design, UX behavior, operational readiness, or compliance

## Integration Format

Ensure `## Clarifications` section exists in spec with:
```markdown
### Session YYYY-MM-DD
- Q: <question> -> A: <final answer>
```

Apply clarification to appropriate sections throughout the spec.

## Next Steps After Spec Clarification

When reporting completion, include `/trilogy-spec-explorer` as an option:
- `/trilogy-spec-explorer` — Generate interactive story map + FR traceability playground (visual spec review)
- `/trilogy-clarify business` — Align on business objectives
- `/trilogy-spec-handover` — Gate 1 (Business Gate: transitions Backlog → Design)
