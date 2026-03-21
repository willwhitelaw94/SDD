---
name: speckit-plan
description: Create implementation plans from specifications. Use when planning how to build a feature, creating technical designs, or mapping spec to code. Triggers on: create plan, implementation plan, technical design, how to build.
---

# SpecKit Plan Skill

Create an implementation plan from a feature specification.

## Agent Available

For a full autonomous development workflow (planning through to PR), consider running the **dev-agent** instead: it chains `/speckit-plan` → `/speckit-tasks` → spawns backend/frontend/testing teammates → `/trilogy-dev-handover` automatically.

## Epic Detection & Routing (NEW CHAT)

In a new chat, **identify the epic context FIRST**:

### Step 0: Check for Existing Epic Context

```bash
find .tc-docs/content/initiatives -name "spec.md" -type f 2>/dev/null | sort
```

**If spec.md exists**:
- **Existing Epic** -> Load the spec and proceed to planning
- Extract epic path from spec location

**If no spec.md found**:
- **New Epic** -> Ask: "This appears to be a new epic. Should I:"
  - "A) Create a spec first using `/speckit.specify`"
  - "B) Start an idea brief using `/trilogy.idea`"

## Execution Steps

### 1. Detect Context

Check for spec.md in either location:

**Epic Context** (from `/trilogy.idea`):
```bash
find .tc-docs/content/initiatives -name "spec.md" -type f 2>/dev/null | head -5
```

**Standalone Context** (from SpecKit branch):
```bash
.tc-wow/scripts/bash/setup-plan.sh --json
```

**Priority**: Epic context takes precedence. If spec.md exists in an epic folder, use that.

### 2. Load Context

Read these files:
- **spec.md** - The feature specification
- **design.md** - The design kickoff brief (if exists)
- `.tc-wow/gates/03-architecture.md` - Gate 3 Architecture checklist (the gate this skill runs)
- `.tc-wow/templates/plan-template.md` - Plan structure

### 3. Generate Plan

Create `plan.md` in the **same directory as spec.md**:
- Epic: `.tc-docs/content/initiatives/[II]-initiative/CCC-epic-TP-XXXX/plan.md`
- Standalone: `specs/###-feature-name/plan.md`

**CRITICAL - Frontmatter Requirement**: All generated `.md` files MUST include YAML frontmatter. Extract the title from the first H1 heading:

```yaml
---
title: "Implementation Plan: [Feature Name]"
---
```

Follow the plan template structure:

```markdown
# Implementation Plan: [Feature Name]

**Spec**: [Link to spec.md]
**Created**: [DATE]
**Status**: Draft

## Technical Context

### Technology Stack
- Backend: Laravel 12, PHP 8.4
- Frontend: Vue 3, Inertia.js, TypeScript
- Database: MySQL
- [Additional tech based on feature needs]

### Dependencies
- [List dependencies from spec.md]
- [External integrations]

### Constraints
- [Performance requirements]
- [Security considerations]
- [Accessibility requirements]

## Gate 3: Architecture Check

Run the full Gate 3 checklist from `.tc-wow/gates/03-architecture.md`.
The plan must pass all checks before proceeding to implementation.

## Design Decisions

### Data Model

[Entities, relationships, and key fields from spec requirements]

### API Contracts

[Endpoints needed to fulfill spec requirements]

### UI Components

[Components needed based on spec user scenarios]

## Implementation Phases

### Phase 1: [Foundation]
- [Core data models]
- [Basic CRUD]

### Phase 2: [Features]
- [User-facing features]
- [Business logic]

### Phase 3: [Polish]
- [Edge cases]
- [Performance optimization]

## Testing Strategy (OPTIONAL)

**Approach**: Implement testing with Pest at each phase:
- Write tests FIRST (TDD mindset)
- Test after each phase completes
- Include unit, feature, and browser tests

### Test Coverage by Phase

**Phase 1: Foundation Tests**
- Unit Tests: Model relationships and validation, data model constraints, basic business logic
- Feature Tests: API endpoints (CRUD), authentication/authorization, database transactions
- Browser Tests (Nightwatch v1 or Dusk v8): Form submission flows, navigation and basic interactions

**Phase 2: Feature Tests**
- Unit Tests: Complex business logic, service/action classes, edge case handling
- Feature Tests: Full user workflows, multi-step processes, error scenarios, data validation
- Browser Tests: Complete user journeys, multi-select operations, confirmation modals, filtering and sorting

**Phase 3: Integration & Polish Tests**
- Unit Tests: Performance-critical code, cache invalidation logic
- Feature Tests: Concurrent operations, race conditions, rollback scenarios
- Browser Tests: Performance interactions, edge cases in UI, accessibility compliance

### Test Tools & Location

tests/Unit/[Feature]/Models/, Services/, Actions/
tests/Feature/[Feature]/Http/Controllers/
tests/Browser/[Feature]/

### Test Execution Checklist

- [ ] Phase 1: Unit + Feature tests passing
- [ ] Phase 1: Browser tests passing
- [ ] Phase 2: All unit tests for new features passing
- [ ] Phase 2: Feature tests for workflows passing
- [ ] Phase 2: Browser tests for user journeys passing
- [ ] Phase 3: Full test suite passing
- [ ] Phase 3: Browser tests passing

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| [Risk 1] | Low/Med/High | Low/Med/High | [Strategy] |

## Next Steps

1. Run `/speckit-tasks` to generate tasks.md
2. Run `/trilogy-linear-sync push docs` to sync to Linear
3. Run `/speckit-implement` to start development
```

### 4. Execute Planning Workflow

1. **Gate 3 Pre-Check (INPUT VALIDATION)**
   - Read `.tc-wow/gates/03-architecture.md` (Architecture Gate checklist)
   - Run sections 1-8 against the **spec.md and design.md inputs** before generating any plan
   - Flag architectural risks, missing constraints, or unclear boundaries early
   - This catches issues BEFORE they get baked into the plan (e.g., missing auth model, unclear data ownership, N+1 risk patterns)
   - Record findings as "Pre-Check Notes" — these inform the plan, not block it
   - If any RED FLAG items are found, surface them to the user before proceeding

2. **Fill Technical Context**
   - Mark unknowns as "NEEDS CLARIFICATION"
   - List all dependencies from spec
   - Address any Pre-Check findings from step 1

3. **Phase 0: Research** (if needed)
   - For each NEEDS CLARIFICATION -> research task
   - For each dependency -> best practices task
   - For each integration -> patterns task
   - Generate and dispatch research agents:
     ```
     For each unknown in Technical Context:
       Task: "Research {unknown} for {feature context}"
     For each technology choice:
       Task: "Find best practices for {tech} in {domain}"
     ```
   - Consolidate findings in `research.md` (same directory as plan.md) using format:
     - Decision: [what was chosen]
     - Rationale: [why chosen]
     - Alternatives considered: [what else evaluated]
   - **Output**: research.md with all NEEDS CLARIFICATION resolved

4. **Phase 1: Design**
   - Extract entities from spec -> Data Model section
   - Map user actions to endpoints -> API Contracts section
   - Identify UI components -> UI Components section
   - **Generate design artifacts** (same directory as plan.md):
     - `data-model.md`: Entity name, fields, relationships, validation rules, state transitions
     - `/contracts/`: OpenAPI/GraphQL schema for each endpoint
     - `quickstart.md`: Getting started guide
   - **Output**: data-model.md, /contracts/*, quickstart.md

5. **Gate 3 Post-Check (PLAN VALIDATION)**
   - Re-read `.tc-wow/gates/03-architecture.md`
   - Run every check in sections 1-8 against the **completed plan**
   - Include the full Gate 3 output template (from the gate file's "Output" section) in plan.md
   - ERROR if any red flags are triggered — plan cannot proceed until resolved
   - Verify all Pre-Check findings from step 1 have been addressed in the plan
   - This is the formal gate pass — the plan must clear this before generating tasks

6. **Agent Context Update**:
   ```bash
   .tc-wow/scripts/bash/update-agent-context.sh claude
   ```
   - These scripts detect which AI agent is in use
   - Update the appropriate agent-specific context file
   - Add only new technology from current plan
   - Preserve manual additions between markers

### 5. Report Completion

Report with:
- **plan.md path** (in epic or specs folder)
- **Generated artifacts**:
  - `research.md` (if Phase 0 research was needed)
  - `data-model.md` (entity definitions and relationships)
  - `/contracts/*` (API schemas)
  - `quickstart.md` (getting started guide)
- **Gate 3 check status** (PASS/FAIL with full checklist from `.tc-wow/gates/03-architecture.md`)

Then **ask the user** using AskUserQuestion:

```
"Plan complete. What would you like to do next?"

Options:
1. Run /speckit-tasks — Generate implementation task list from this plan (recommended)
2. Run /trilogy-clarify dev — Refine the plan further before generating tasks
3. Run /trilogy-db-visualiser — Interactive canvas DB schema scoped to this epic (optional)
4. Done for now — I'll continue later
```

If the user selects option 1, immediately invoke `/speckit-tasks`.

## Key Rules

- Save plan.md in the **same directory** as spec.md
- Use absolute paths
- ERROR on gate violations or unresolved clarifications
- Plan should be actionable and specific to this feature
