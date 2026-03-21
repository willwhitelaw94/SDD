---
name: trilogy-design-research
description: >-
  Deep design research — competitive analysis, user research, existing implementation
  audits, and user testing plans. Optional enrichment for design.md. Run before or
  after /trilogy-design. Triggers on: design research, competitive analysis,
  user research, design audit, research competitors.
metadata:
  version: 1.0.0
  type: agent
---

# Design Research Skill

Deep research that enriches a design brief with competitive analysis, user research, existing implementation audits, emotional design goals, and user testing plans. This is **optional** — not every feature needs it.

## Purpose

This skill:
1. **Researches** competitors and how other apps handle similar features
2. **Audits** existing implementation (if replacing/enhancing current UI)
3. **Defines** emotional design goals and success metrics
4. **Plans** user testing approach
5. **Appends** findings to `design.md` (or creates `design-research.md` if design.md doesn't exist yet)

## When to Use

```bash
/trilogy-design-research                # Full research
/trilogy-design-research --competitors  # Competitive research only
/trilogy-design-research --audit        # Existing implementation audit only
/trilogy-design-research --metrics      # Analytics & success metrics only
```

Run this skill when:
- The feature is complex (L-sized) and benefits from competitive insight
- There's existing UI being replaced and we need to audit what works/doesn't
- Stakeholders want evidence-based design decisions
- You want to define success metrics and a user testing plan

**Not needed for:**
- Small features using established patterns
- Bug fixes or minor UI tweaks
- Features with clear, pre-defined UX from stakeholders

## Position in Workflow

```
/trilogy-spec-handover        → Gate 1 (Backlog → Design)
        ↓
/trilogy-design               → design.md (design brief)
/trilogy-design-research      → enrich design.md (this skill — optional)
/trilogy-clarify design       → refine design decisions
        ↓
/trilogy-mockup               → mockups/ (UI mapping)
```

## Prerequisites

| Artifact | Required | Location |
|----------|----------|----------|
| spec.md | Yes | Initiative folder |
| design.md | Recommended | Initiative folder (from `/trilogy-design`) |

## Output

Appends research sections to `design.md`. If design.md doesn't exist, creates `design-research.md` as a standalone artifact.

---

## Execution Flow

### Step 1: Load Context

Read existing artifacts:
```bash
find .tc-docs/content/initiatives -name "spec.md" -type f 2>/dev/null | head -5
```

Load:
- `spec.md` — What we're building
- `design.md` — Existing design brief (if exists)
- `idea.md` — Problem and user needs (if exists)

### Step 2: Choose Research Scope

**Ask user:**
> Which research areas are relevant for this feature?
>
> - [ ] **Competitive Research** — How do other apps handle this?
> - [ ] **Existing Implementation Audit** — What works/doesn't in current UI?
> - [ ] **Emotional Design** — How should users feel?
> - [ ] **Analytics & Success Metrics** — How do we measure success?
> - [ ] **User Testing Plan** — How will we validate the design?
> - [ ] **All of the above**

---

## Research Areas

### Competitive Research

**Ask user:**
> Want me to research how other apps handle [feature type]?
>
> Suggested apps:
> - [App 1] — [why relevant]
> - [App 2] — [why relevant]
> - [App 3] — [why relevant]
>
> [ ] Yes, research these
> [ ] Yes, but research [other apps]
> [ ] Skip

**If yes**, launch **parallel Explore agents** — one per app — to research simultaneously:

```
Task(subagent_type="Explore", prompt="Research [App 1] UX patterns for [feature]. Find: layout structure, interaction patterns, what works well, what doesn't.")
Task(subagent_type="Explore", prompt="Research [App 2] UX patterns for [feature]. Find: layout structure, interaction patterns, what works well, what doesn't.")
Task(subagent_type="Explore", prompt="Research [App 3] UX patterns for [feature]. Find: layout structure, interaction patterns, what works well, what doesn't.")
```

Each agent uses WebSearch + WebFetch to gather:
- UX patterns (layout, navigation, interaction)
- Key design decisions (sidebar vs tabs, collapsible sections, etc.)
- What works well, what doesn't

**Output:**
```markdown
## Competitive Research

### [App Name] — [Feature]
**What they do well:**
- [Pattern 1]
- [Pattern 2]

**What we can learn:**
- [Insight]

### Patterns to Consider
| Pattern | Used By | Applicability |
|---------|---------|---------------|
| [Pattern] | [Apps] | [How it fits our feature] |
```

### Existing Implementation Audit

**Ask user:**
> Is there existing UI being replaced or enhanced?
> [ ] Yes — I'll audit current state
> [ ] No — This is net new

**If yes:**
- Navigate to existing pages using Chrome DevTools MCP (if available)
- Take screenshots of current implementation
- Note what works, what's broken
- Identify user complaints

**Output:**
```markdown
## Existing Implementation Audit

**Current State:** [Description]

**What works well:**
- [Thing 1]

**Pain points:**
- [Issue 1]

**User feedback:**
- "[Quote from user]"

**Screenshots:** See `rich-content/current-state/`
```

### Emotional Design

**Ask user:**
> How should users **feel** when using this?
>
> [ ] Confident — "I know what I'm doing"
> [ ] Relieved — "That was easier than expected"
> [ ] Empowered — "I'm in control"
> [ ] Safe — "My data is protected"
> [ ] Other: _______________
>
> What could make them feel **frustrated**?

**Output:**
```markdown
## Emotional Design

**Target Emotion:** Relieved — "That was easier than expected"

**Frustration Risks:**
- Too many steps
- Unclear what happens next
- Fear of making mistakes

**Design Implications:**
- [How emotion goal shapes UI decisions]
```

### Analytics & Success Metrics

**Ask user:**
> How do we know if the design is working?
> What events should we track?

**Output:**
```markdown
## Analytics & Success Metrics

**Success Metrics:**
- [Metric 1] — [target]
- [Metric 2] — [target]

**Events to Track:**
- event_name_1
- event_name_2

**Performance Considerations:**
- Page frequency: [high/medium/low]
- Data volume: [expected size]
- Real-time needs: [yes/no]
```

### User Testing Plan

**Ask user:**
> Will we test this design before building?
> With whom?

**Output:**
```markdown
## User Testing Plan

**Approach:** [Prototype testing / A-B test / Stakeholder review]

**Participants:**
- [Count] [User type]

**Questions to Answer:**
1. [Key question]
2. [Key question]

**Timeline:** [When]
```

---

## Step 3: Append to design.md

If `design.md` exists, append research sections under a `## Research` heading.

If `design.md` doesn't exist, create `design-research.md` as a standalone document:

```markdown
---
title: "Design Research: [Feature Name]"
created: YYYY-MM-DD
---

# Design Research: [Feature Name]

**Epic:** [Code]
**Spec:** [link to spec.md]

---

[Research sections]

---

## Next Steps
- `/trilogy-design` — Create design brief (if not done)
- `/trilogy-clarify design` — Refine decisions
- `/trilogy-mockup` — UI mapping
```

---

## Step 4: Report Completion

```markdown
## Design Research Complete

**File:** [path]

### Research Completed
- [x/skip] Competitive research — [count] apps analysed
- [x/skip] Implementation audit
- [x/skip] Emotional design
- [x/skip] Analytics & metrics
- [x/skip] User testing plan

### Key Insights
- [Top insight 1]
- [Top insight 2]

### Next Steps
- `/trilogy-clarify design` — Refine UX/UI decisions
- `/trilogy-mockup` — UI mapping
```

---

## Integration

| Before | After |
|--------|-------|
| `/trilogy-design` | `/trilogy-clarify design` |
| `/trilogy-spec-handover` | `/trilogy-mockup` |

## Options

| Flag | Description |
|------|-------------|
| `--competitors` | Competitive research only |
| `--audit` | Existing implementation audit only |
| `--metrics` | Analytics & success metrics only |

## Behavior Rules

- Ask which research areas are relevant before diving in
- Use parallel agents for competitive research (one per app)
- Keep research actionable — every finding should have a "so what" for design
- Don't repeat information already in design.md
- Append, don't overwrite
