---
name: speckit-specify
description: Generate feature specifications from user descriptions. Use when creating new specs, documenting requirements, or starting a new feature. Triggers on: create spec, new feature, write specification, document requirements.
---

# SpecKit Specify Skill

Generate a feature specification from a user description. Specs are stored in the `.tc-docs/content/initiatives/` folder structure.

## Agent Available

For a full autonomous planning workflow (idea through to spec handover), consider running the **planning-agent** instead: it chains `/trilogy-idea` → `/speckit-specify` → `/trilogy-clarify` → `/trilogy-spec-handover` automatically.

## Epic Detection & Routing (NEW CHAT)

In a new chat, **identify the epic context FIRST**:

### Step 0: Check for Existing Epic Context

```bash
find .tc-docs/content/initiatives -name "idea.md" -o -name "spec.md" | head -20
```

**If epics exist**: Ask which epic this spec belongs to
**If no epics exist**: Recommend running `/trilogy-idea` first to create the epic

### Step 0b: Load Context (OPTIONAL)

If context files exist in `context/raw_context/` or `context/rich_context/` folders, load and summarize prior decisions.

**Note**: Every epic should have this folder structure:
```
epic-folder/
├── context/
│   ├── raw_context/          (Raw, unrefined context documents)
│   ├── rich_context/         (Cleaned, curated context)
│   └── epic_channels/        (Channel-specific context)
├── idea-brief.md
└── spec.md
```

**Do not create context files** - they are populated separately by content teams.

## Execution Steps

### 1. Identify Epic Context (REQUIRED)

**IMPORTANT**: Specs MUST always be saved within the `.tc-docs/content/initiatives/` folder structure.

```bash
ls -la .tc-docs/content/initiatives/*/
ls -la .tc-docs/content/initiatives/*/*/idea.md 2>/dev/null
```

Present options:
- Select existing epic
- Create new epic under existing initiative
- Create new initiative AND epic

### 2. Load Template

Load `.tc-wow/templates/spec.md` to understand required sections.

### 3. Generate Specification

1. Parse user description - Extract: actors, actions, data, constraints
2. For unclear aspects:
   - Make informed guesses based on context
   - Mark with [NEEDS CLARIFICATION: specific question] only if:
     - The choice significantly impacts feature scope
     - Multiple reasonable interpretations exist
     - No reasonable default exists
   - **LIMIT: Maximum 3 [NEEDS CLARIFICATION] markers total**
3. Fill User Scenarios & Testing section
4. Generate Functional Requirements (each must be testable)
5. Define Success Criteria (measurable, technology-agnostic)
6. Identify Key Entities (if data involved)

### 4. Write Specification

Save to: `.tc-docs/content/initiatives/[II]-Initiative-Name-TP-XXXX/[TP-YYYY or NNN]-CCC-Epic-Name/spec.md`

**CRITICAL - Frontmatter Requirement**: All generated `.md` files MUST include YAML frontmatter. Extract the title from the first H1 heading:

```yaml
---
title: "Feature Specification: [FEATURE NAME]"
---

# Feature Specification: [FEATURE NAME]
```

### 5. Specification Quality Validation

Create checklist at `[SPEC_DIR]/checklists/requirements.md`:
- Content Quality (no implementation details, focused on user value)
- Requirement Completeness (no clarification markers, testable, measurable)
- Feature Readiness (acceptance criteria defined)

### 6. Report Completion

Report with:
- Epic folder path
- spec.md path
- Checklist results
- Next steps:
  - `/trilogy-clarify spec` — Refine requirements (5 questions)
  - `/trilogy-spec-explorer` — Interactive story map + FR traceability (visual spec review)
  - `/trilogy-clarify business` — Align on business objectives
  - `/trilogy-spec-handover` — Gate 1 (Business Gate: transitions Backlog → Design on Linear + meta.yaml)

## Quick Guidelines

- Focus on **WHAT** users need and **WHY**
- Avoid HOW to implement (no tech stack, APIs, code structure)
- Written for business stakeholders, not developers
- DO NOT create embedded checklists in the spec

### INVEST Criteria (REQUIRED)

Every user story MUST meet INVEST criteria. Validate each story against:

| Criteria | Question | Validation |
|----------|----------|------------|
| **I**ndependent | Can this be delivered without other stories? | No dependencies on other stories in the spec |
| **N**egotiable | Is there room for discussion on details? | Focus on outcomes, not implementation |
| **V**aluable | Does this deliver clear user/business value? | Must state explicit benefit |
| **E**stimable | Can the team reasonably size this? | Clear enough scope to estimate |
| **S**mall | Does it fit within a sprint? | Single user flow, not epic-sized |
| **T**estable | Are acceptance criteria verifiable? | Given/When/Then format, specific outcomes |

**If a story fails INVEST**, either:
- Split it into smaller stories
- Clarify the scope
- Mark with [INVEST VIOLATION: criteria] for review

### Business-Readable Language

Specs are written for **business stakeholders first**. Use:

**Trilogy Care terminology:**
- "Package" not "account" or "subscription"
- "Recipient" or "Client" not "user" (for care recipients)
- "Care Partner" (primary — field role managing clients daily) or "Coordinator" (secondary — support/admin role). Default to Care Partner for client-facing stories. Not "staff" or "admin"
- "Supplier" or "Provider" not "vendor"
- "Service" not "product" or "item"
- "Budget" not "balance" or "funds"
- "Contribution" not "payment" or "fee" (for client contributions)

**Plain English:**
- Active voice: "Care Partners can view client risks" not "Risks can be viewed"
- Concrete examples: "e.g., a weekly cleaning service" not "various service types"
- Business outcomes: "Reduces claim processing from 5 days to 1 day" not "Faster processing"

**Avoid:**
- Technical jargon (API, database, endpoint, component)
- Implementation details (React, Laravel, SQL)
- Developer-speak (refactor, migrate, deploy)

### Success Criteria Guidelines

Success criteria must be:
1. **Measurable**: Include specific metrics (time, percentage, count, rate)
2. **Technology-agnostic**: No mention of frameworks, languages, databases
3. **User-focused**: Describe outcomes from user/business perspective
4. **Verifiable**: Can be tested without knowing implementation details

**Good examples**:
- "Users can complete checkout in under 3 minutes"
- "System supports 10,000 concurrent users"
- "95% of searches return results in under 1 second"

**Bad examples**:
- "API response time is under 200ms" (too technical)
- "Database can handle 1000 TPS" (implementation detail)
- "React components render efficiently" (framework-specific)
