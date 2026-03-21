---
name: trilogy-design-handover
description: >-
  Run Gate 2 (Design Gate) and facilitate handover from Design to Dev.
  Use after /trilogy-design AND /trilogy-mockup are complete.
  Validates design completeness, generates handover summary, transitions work to Development (Planning/Architecture), and posts summary comment to Linear.
metadata:
  version: 1.1.0
  type: gate
---

# Design Handover Skill

Validate design completeness and facilitate the handover from Design phase to Development phase.

## Purpose

This skill:
1. **Validates** design (kickoff + mockups) against Gate 2 checklist
2. **Generates** a handover summary for Dev team
3. **Captures** stakeholder sign-off on design decisions
4. **Creates** handover document with key decisions and constraints
5. **Transitions** Linear project status from Design to Dev
6. **Posts** handover summary as a comment in Linear

## When to Use

```bash
/trilogy-design-handover           # Full handover process
/trilogy-design-handover --check   # Quick gate check only
/trilogy-design-handover --summary # Generate handover summary only
```

Run this skill when:
- Design kickoff (`/trilogy-design`) is complete
- Mockups (`/trilogy-mockup`) are complete
- Ready to hand off to Development for technical planning

## Prerequisites

| Artifact | Required | Location |
|----------|----------|----------|
| spec.md | Yes | Initiative folder |
| design.md | Yes | Initiative folder (from `/trilogy-design`) |
| mockups/ | Yes | Initiative folder (from `/trilogy-mockup`) |

## Execution Flow

### Step 1: Locate Initiative

Find the current initiative context:

```bash
# Check for spec.md in common locations
find .tc-docs/content/initiatives -name "spec.md" -type f 2>/dev/null | head -5
find .specify -name "spec.md" -type f 2>/dev/null | head -5
```

If multiple initiatives exist, ask user which one to process.

### Step 2: Load Design Artifacts

Read all design-related files:
- `spec.md` - Requirements reference
- `design.md` - Design kickoff brief (required)
- `user-flows.md` - User flow diagrams (if exists)

### Step 3: Run Gate 2 Checklist

Evaluate each check against the artifacts:

#### Design Kickoff Completeness

| Check | How to Verify | Pass Criteria |
|-------|---------------|---------------|
| User research complete | Check design.md Context section | Primary user, device, usage pattern defined |
| Design principles defined | Check design.md Strategy section | North star principle documented |
| Edge cases identified | Check design.md Planning section | Edge case inventory populated |
| Constraints documented | Check design.md Constraints section | Accessibility, security, dependencies noted |
| Build size assessed | Check design.md Strategy section | S/M/L assessment with rationale |

#### Design-Spec Alignment

| Check | How to Verify | Pass Criteria |
|-------|---------------|---------------|
| User stories covered | Compare spec.md user stories to design scope | All features have design consideration |
| Success metrics defined | Check design.md Analytics section | How we measure success documented |
| Phased rollout planned | Check design.md Planning section | MVP vs future phases clear |

#### Stakeholder Alignment

| Check | How to Verify | Pass Criteria |
|-------|---------------|---------------|
| Stakeholder constraints noted | Check design.md Constraints section | Approvers identified |
| Risks documented | Check design.md Validation section | Assumptions and risks listed |
| Dependencies identified | Check design.md Constraints section | Blocking/blocked features noted |

### Step 4: Generate Handover Summary

Create a developer-focused summary:

```markdown
## Design Handover Summary

**Initiative**: [Name]
**Date**: YYYY-MM-DD
**Design Owner**: [Name]
**Receiving Developer**: [Name]

---

### What We're Building

[2-3 sentence summary from spec overview]

### Key Screens

1. **[Screen Name]** - [Purpose]
   - Location: `mockups/screen-name.txt` or design.md section
   - Key interactions: [list]

2. **[Screen Name]** - [Purpose]
   ...

### Component Decisions

**Reusing Existing:**
- CommonTable for [purpose]
- CommonModal for [purpose]

**New Components Needed:**
- [ ] NewComponent - [why existing won't work]

### Critical UX Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| [Decision point] | [Choice made] | [Why] |

### Data Requirements

| Screen | Data Needed | Source |
|--------|-------------|--------|
| [Screen] | [Data] | [API/Model] |

### Open Questions for Development

- [ ] [Question that needs technical input]
- [ ] [Constraint that may affect implementation]

### Out of Scope (Deferred)

- [Item explicitly not in this phase]
```

### Step 5: Capture Sign-Off

Present checklist for stakeholder approval:

```markdown
## Design Handover Sign-Off

| Role | Name | Date | Status |
|------|------|------|--------|
| Designer/Product | | | [ ] Approved |
| Lead Developer | | | [ ] Approved |
| Stakeholder (optional) | | | [ ] Approved |

### Confirmation

By signing off, we confirm:
- [ ] Design is complete enough to begin technical planning
- [ ] All major UX decisions are finalized
- [ ] Open questions are documented (not blocking)
- [ ] Scope boundaries are understood
```

### Step 6: Update Initiative

Append handover results to `design.md` or create `handover.md`:

```markdown
---

## Gate 2: Design Handover

**Date**: YYYY-MM-DD
**Status**: PASS / FAIL

### Checklist Results

[Gate 2 checklist with [x] or [ ]]

### Handover Summary

[Summary from Step 4]

### Sign-Off

[Sign-off from Step 5]

### Next Steps

- [ ] Run `/speckit-plan` to create technical implementation plan
- [ ] Developer to review design artifacts
- [ ] Schedule architecture discussion if needed
```

### Step 7: Update Linear Project Status + meta.yaml

Transition the Linear project from Design to Dev and keep meta.yaml in sync:

1. **Read `meta.yaml`** to get `linear_project_id`
2. **Update Linear status to "Dev"**:
   ```
   mcp__linear__update_project(
     id: "<linear_project_id>",
     state: "Dev"
   )
   ```
   **CRITICAL**: Use `state: "Dev"` — NOT "In Progress", "Started", or "Development". These are workspace-specific state names (see `trilogy-linear-sync` Status Mapping).
3. **Update `meta.yaml`** status and append the `gates.design` record. **Do not overwrite existing gate records** — only add the new `design` key under `gates`:
   ```yaml
   status: in progress    # Changed from 'design'
   gates:
     idea:                # preserved from Gate 0
       passed: true
       date: YYYY-MM-DD
       notes: "..."
     spec:                # preserved from Gate 1
       passed: true
       date: YYYY-MM-DD
       notes: "..."
     design:              # added now
       passed: true
       date: YYYY-MM-DD
       notes: "[Key screens, component decisions, stakeholder sign-off]"
   ```
4. **Post handover comment** - Use `mcp__linear__create_comment` to add handover summary

```bash
# Post handover summary as Linear comment
mcp__linear__create_comment(
  issueId: "[project-id]",
  body: """
## 🎨 Design Handover Complete

**Gate 2 Status**: PASS ✅
**Date**: YYYY-MM-DD

### Summary
[Brief summary of what was designed]

### Key Screens
- [Screen 1]: [Purpose]
- [Screen 2]: [Purpose]

### Component Decisions
- Reusing: [existing components]
- New: [components to create]

### Open Questions for Dev
- [ ] [Question 1]
- [ ] [Question 2]

### Design Artifacts
- `design.md` - Design kickoff brief
- `mockups/` - UI specifications

---
*Ready for `/speckit-plan` to begin technical planning*
"""
)
```

## Output

The skill produces:
1. **Gate 2 checklist result** - PASS/FAIL with details
2. **Handover summary** - Developer-focused summary document
3. **Sign-off record** - Stakeholder approvals captured
4. **Updated design.md** - Handover section appended
5. **Linear status update** - Project moved from Design to Dev
6. **Linear comment** - Handover summary posted to project

## Options

| Flag | Description |
|------|-------------|
| `--check` | Run gate checklist only, no handover document |
| `--summary` | Generate handover summary only |
| `--force` | Proceed even if gate fails (document gaps) |

## Integration

| Before | After |
|--------|-------|
| `/trilogy-design` | `/speckit-plan` |
| `/trilogy-mockup` | |

**Flow:**
```
/trilogy-design → /trilogy-mockup → /trilogy-design-handover → [Dev] /speckit-plan
```

## Example Usage

```bash
# After design is complete
/trilogy-design-handover

# Quick check before meeting
/trilogy-design-handover --check

# Just need the summary for a meeting
/trilogy-design-handover --summary
```

## Failure Handling

If Gate 2 fails:

1. **List specific gaps** - Which checks failed and why
2. **Suggest remediation** - What to create/update
3. **Offer partial handover** - Document known gaps, proceed with risk acknowledgment

```markdown
## Gate 2: FAIL

### Gaps Identified

| Check | Status | Gap | Remediation |
|-------|--------|-----|-------------|
| Edge cases visualized | FAIL | No error states | Add error mockups |
| Responsive defined | FAIL | Mobile not addressed | Define mobile behavior |

### Options

1. **Fix gaps first** - Run `/trilogy-design` to address gaps
2. **Proceed with gaps** - Use `--force` to document gaps and continue
3. **Partial handover** - Hand over completed screens, defer others
```
