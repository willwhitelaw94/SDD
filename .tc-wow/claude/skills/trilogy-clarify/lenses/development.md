# Development Lens

Clarify technical strategy, architecture, and implementation approach.

## Output
Creates/updates `plan.md` in the epic folder.

## Focus Areas

### Architectural Approach
- Overall strategy
- Integration with existing systems
- Technology choices
- Data flow
- Scalability considerations

### Implementation Strategy
- Phases and milestones
- Dependencies between components
- MVP vs full feature scope
- Risk mitigation approach
- Proof-of-concept needs

### Technical Constraints & Trade-offs
- Non-negotiable constraints
- Patterns and standards to follow
- Legacy system integrations
- Performance targets
- Trade-offs: speed vs quality vs scope

### Development Team & Skills
- Required skills
- Training needs
- Code review requirements
- Team size and duration estimates

### Testing & Quality Strategy
- Testing pyramid approach
- Coverage targets
- Critical edge cases
- QA process
- Accessibility, performance, security testing

### Infrastructure & DevOps
- Infrastructure needs
- Environment constraints
- Deployment strategy
- Data migrations
- Monitoring requirements

### Risk & Mitigation
- Top technical risks
- Fallback/rollback strategy
- Vendor dependencies
- Security threat model
- Operational support needs

## Document Structure

```markdown
# Implementation Plan: [Feature Name]

## Overview

## Architecture & Design Approach

### Overall Architecture
[Description of architectural approach]

### Data Model
[Key entities and relationships]

### Integration Points
[External systems, APIs]

## Implementation Strategy

### Phases
| Phase | Focus | Deliverables |
|-------|-------|--------------|

### Key Milestones
1. [Milestone 1]
2. [Milestone 2]

### Sequencing & Dependencies
[Dependency graph or description]

## Constraints & Trade-offs

| Constraint | Impact | Mitigation |
|------------|--------|------------|

### Technology Decisions
| Decision | Rationale | Alternatives Considered |
|----------|-----------|------------------------|

## Resource Requirements

### Team & Skills
| Role | Count | Skills Required |
|------|-------|-----------------|

### Timeline
[Estimated duration]

### Budget
[Cost considerations]

## Quality & Testing Strategy

### Testing Pyramid
- Unit: [coverage target]
- Integration: [scope]
- E2E: [critical paths]

### Quality Gates
[Required checks before release]

## Infrastructure & Deployment

### Infrastructure Needs
[New infrastructure required]

### Deployment Strategy
[Blue-green, canary, etc.]

### Monitoring
[Observability requirements]

## Risk Assessment & Mitigation

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|

### Fallback & Rollback Plan
[How to recover if things go wrong]

## Development Clarifications
### Session YYYY-MM-DD
- Q: ... -> A: ...
```
