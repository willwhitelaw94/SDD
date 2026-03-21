---
name: trilogy-design-kickoff
description: >-
  Kick off design phase — transitions epic to Design in Linear and creates design.md.
  Translates spec into design decisions: user context, principles, constraints, edge cases, and scope.
  Run after spec handover. Refine with /trilogy-clarify design.
  Triggers on: design kickoff, design brief, start design, create design, kick off design.
metadata:
  version: 4.0.0
  type: agent
---

# Design Kickoff Skill

Transition epic to **Design** in Linear and create `design.md` — the design document that translates a specification into actionable design decisions. Focused on **what** the design needs to achieve, not deep research.

## Agent Available

For a full autonomous design workflow (brief through to design handover), consider running the **design-agent** instead: it chains `/trilogy-design-kickoff` → `/trilogy-design-research` → `/trilogy-mockup` → `/trilogy-design-handover` automatically.

## Purpose

This skill:
1. **Transitions** Linear project status from Planned → Design
2. **Updates** meta.yaml status from `planned` → `design`
3. **Reads** spec.md and extracts design-relevant context
4. **Asks** focused questions about users, principles, and constraints
5. **Documents** edge cases, scope, and dependencies
6. **Creates** `design.md` in the initiative folder

## When to Use

```bash
/trilogy-design-kickoff                   # Transition to Design + create design.md
/trilogy-design-kickoff --with-research   # Also run /trilogy-design-research first
```

Run this skill **after** spec handover (Gate 1) and **before** mockups or UX mapping.

## Position in Workflow

```
/trilogy-spec-handover       → Gate 1 (validates spec, stays in Planned)
        ↓
/trilogy-design-kickoff      → Planned → Design + design.md (this skill)
/trilogy-clarify design      → refine design decisions
        ↓
/trilogy-mockup              → mockups/ (UI mapping)
        ↓
/trilogy-design-handover     → Gate 2 (Design → Dev)
```

**Optional deep research:** Run `/trilogy-design-research` before or after this skill for competitive analysis, user research, and implementation audits. Results are appended to design.md.

## Prerequisites

| Artifact | Required | Location |
|----------|----------|----------|
| spec.md | Yes | Initiative folder |
| idea.md | Recommended | Initiative folder |

## Output

Creates `design.md` (Design Brief) in the initiative folder.

---

## Execution Flow

### Step 1: Load Context

Read existing artifacts:
```bash
find .tc-docs/content/initiatives -name "spec.md" -type f 2>/dev/null | head -5
```

Load:
- `spec.md` — What we're building (user stories, acceptance criteria)
- `idea.md` — Problem and user needs (if exists)
- `meta.yaml` — Epic metadata

### Step 2: Transition to Design

**Transition Linear project status from Planned → Design:**

1. Read `linear_project_id` from `meta.yaml`
2. Update project status:
   ```
   mcp__linear__save_project(
     id: "<linear_project_id>",
     state: "Design"
   )
   ```
3. Update meta.yaml:
   ```yaml
   status: design    # Changed from 'planned'
   ```

### Step 3: Ask Design Questions

Ask the user focused questions across 3 areas. Keep it conversational — don't dump all questions at once. Infer answers from spec context where possible and confirm.

---

## Section 1: User Context

**Questions to ask:**
- Who is the **primary user**? (Care Partner, Recipient, Admin, etc.)
- What **devices** do they use? (Desktop-first, mobile-first, both)
- How **often** do they use this? (Daily power-user, weekly, occasional)
- What's their **context**? (Rushed, focused, multitasking, stressed)

**Output:**
```markdown
## User Context

| Aspect | Answer | Impact on Design |
|--------|--------|------------------|
| Primary User | Care Partner (coordinator) | Needs efficiency, keyboard shortcuts |
| Secondary User | Recipient (client) | Needs simplicity, clear guidance |
| Device Priority | Desktop-first | Can use complex layouts |
| Usage Frequency | Daily | Worth investing in power-user features |
| Context | Multitasking, time-pressured | Needs quick actions, clear status |
```

## Section 2: Design Principles & Scope

### 2.1 Design Principles

**Ask user:**
> What's the guiding principle for this feature?
>
> Examples:
> - "Make signing feel effortless, not bureaucratic"
> - "Transparency over efficiency"
> - "Guide, don't block"

**Output:**
```markdown
## Design Principles

**North Star:** [User's principle]

**Supporting Principles:**
1. [Derived principle 1]
2. [Derived principle 2]
```

### 2.2 Build Size Assessment

**Based on spec context, assess:**

| Size | Description | Characteristics |
|------|-------------|-----------------|
| **S** | Use existing components | 1-2 new screens, standard patterns |
| **M** | Some new components | 3-5 screens, moderate complexity |
| **L** | Significant new patterns | 6+ screens, high polish, new interactions |

**Output:**
```markdown
## Build Size

**Size:** Medium

**Rationale:**
- X new screens
- [New components needed]
- [Existing patterns reused]
```

### 2.3 Scope

**Ask user:**
> MVP vs full vision? Feature flags needed?

**Output:**
```markdown
## Scope

**MVP:**
- [What's included]

**Deferred:**
- [What's out for now]

**Feature Flags:**
- `feature_flag_name` - [What it controls]
```

## Section 3: Constraints & Edge Cases

### 3.1 Constraints

**Ask user about applicable constraints:**

| Category | Question |
|----------|----------|
| **Accessibility** | WCAG target? Keyboard nav critical? Screen reader? |
| **Security/Privacy** | Sensitive data? Permission/visibility rules? |
| **Stakeholder** | Business/legal/compliance constraints? Approvers? |
| **Dependencies** | Depends on other features? Blocks other work? |

Only ask about categories relevant to the feature. Skip what doesn't apply.

**Output:**
```markdown
## Constraints

### Accessibility
- WCAG Target: Level AA
- Keyboard navigation: [required/nice-to-have]

### Security & Privacy
- Sensitive data: [types]
- Visibility rules: [who sees what]

### Dependencies
- Depends on: [list]
- Blocks: [list]
```

### 3.2 Edge Cases

**CRITICAL SECTION** — Forces thinking about failure states.

| Category | Edge Cases to Consider |
|----------|------------------------|
| **Empty States** | No data yet, no results |
| **Error States** | Network failure, validation error, permission denied |
| **Partial States** | Incomplete data, draft states |
| **Permissions** | User can view but not act, expired access |
| **Scale** | Large data sets, bulk operations |

**Output:**
```markdown
## Edge Cases

| Edge Case | How to Handle | Priority |
|-----------|---------------|----------|
| [Case 1] | [Handling] | P1 |
| [Case 2] | [Handling] | P2 |
```

---

## Step 4: Generate design.md

Compile all sections into `design.md`:

```markdown
---
title: "Design Brief: [Feature Name]"
status: Draft
created: YYYY-MM-DD
---

# Design Brief: [Feature Name]

**Epic:** [Code]
**Spec:** [link to spec.md]

---

## User Context
[Section content]

---

## Design Principles
[Section content]

## Build Size
[Section content]

## Scope
[Section content]

---

## Constraints
[Section content]

## Edge Cases
[Section content]

---

## Next Steps

- [ ] `/trilogy-clarify design` — Refine UX/UI decisions
- [ ] `/trilogy-design-research` — Competitive research, user research (optional)
- [ ] `/trilogy-mockup` — UI mapping
```

---

## Step 5: Report Completion

```markdown
## Design Brief Created

**File:** [path to design.md]

### Summary
- User: [primary user]
- Size: [S/M/L]
- Edge cases: [count] identified
- Constraints: [key constraints]

### Next Steps
- `/trilogy-clarify design` — Refine UX/UI decisions
- `/trilogy-design-research` — Deep research (competitive, user, audit) — optional
- `/trilogy-mockup` — UI mapping
- `/trilogy-mockup --challenge` — Multi-perspective UI challenge
```

---

## Integration

| Before | After |
|--------|-------|
| `/trilogy-spec-handover` | `/trilogy-clarify design` |
| | `/trilogy-design-research` (optional) |
| | `/trilogy-mockup` |
| | `/trilogy-design-handover` |

## Options

| Flag | Description |
|------|-------------|
| `--with-research` | Run `/trilogy-design-research` first, then create design.md |

## Behavior Rules

- Ask questions conversationally, not all at once
- Infer answers from spec context and confirm with user
- Skip sections that don't apply (e.g., no accessibility section for admin-only backend feature)
- Keep it focused — this is a document, not a research project
- Save the file after each section so progress isn't lost
