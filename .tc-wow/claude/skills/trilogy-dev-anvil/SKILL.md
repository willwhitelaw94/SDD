---
name: trilogy-dev-anvil
description: >-
  Gate-aware coding for ad-hoc work. Loads architecture and code quality rules from
  Gate 3 and Gate 4 as extra context so code is written correctly from the start.
  No spec.md, plan.md, or tasks.md required. Does not run tests, linting, or builds —
  purely uses gates as coding guardrails.
  Triggers on: anvil, dev anvil, code with gates, gate-aware coding, forge code.
metadata:
  version: 1.0.0
  type: implementation
---

# Trilogy Dev Anvil

Gate-aware coding without the full pipeline. Code is forged through Gate 3 (Architecture) and Gate 4 (Code Quality) rules from the start — not checked after the fact.

## When to Use

When you want to implement something and have the code follow all architectural and code quality standards without going through the full spec → design → plan → tasks pipeline.

```bash
/trilogy-dev-anvil                          # Then describe what you want
/trilogy-dev-anvil add a filter to bills    # Directly with your request
```

**Not needed for**: Trivial one-line fixes, typos, copy changes. Just code those normally.
**Not a replacement for**: Full pipeline epics that need spec.md, design.md, and formal gate transitions.

## How It Works

```
Load Gate Rules → Explore Codebase → Implement with Rules as Context → Done
```

No spec.md. No plan.md. No tasks.md. No Linear transitions. No test/lint/build runners. Just code written with the right patterns from the start.

---

## Phase 1: Load Gate Context

**CRITICAL: Do this BEFORE writing any code.** The gates are coding constraints, not post-hoc checks.

### Step 1: Read Gate Files

Read both gate files to load the current rules:

- `.tc-wow/gates/03-architecture.md` — Read Sections 5-8 (Laravel best practices, Vue TypeScript standards, multi-step wizards, Pinia stores) and all "Red Flags" lists
- `.tc-wow/gates/04-code-quality.md` — Read ONLY the "Laravel Best Practices" checklist and the "Vue TypeScript Best Practices" checklist. Skip the automated checks section (tests, coverage, Pint, Larastan) — those are out of scope for this skill.

These files are the single source of truth. Do not use hardcoded rules — always read the files so updates to the gates are automatically picked up.

### Step 2: Internalise as Active Constraints

Hold every rule from the gate files as active constraints for all code you write. Extract and internalise:

- **From Gate 3**: All checks in Sections 5-8 (Laravel best practices, Vue TypeScript standards, multi-step wizards, Pinia stores) plus every item in every "Red Flags" list
- **From Gate 4**: Every checklist item under "Laravel Best Practices Checklist" and "Vue TypeScript Best Practices"

**Do not use the summary tables that previously appeared here.** The gate files are the single source of truth — they evolve over time and hardcoded summaries will drift. Always work from the content you just read in Step 1.

### Step 3: Explore the Codebase Area

Before implementing, orient yourself in the area being changed:

1. **Check sibling files** for existing patterns, naming conventions, and structure
2. **Look for reusable components/actions/models** — don't create what already exists
3. **Understand the data model** in the relevant area

---

## Phase 2: Implement

The user describes what they want in natural language. No special format needed.

### For Non-Trivial Changes (3+ files)

Use `EnterPlanMode` to get user approval on the approach before coding. The gate rules inform the plan:
- Identify which files will be created/modified
- Note which gate constraints are relevant to this specific change
- Propose the architecture approach

### For Simple Changes

Proceed directly. Brief mental model is sufficient.

### While Coding

**Write code that follows the gate rules from the start.** Don't write it wrong then fix it — the rules are loaded as context so every decision is informed by them.

Follow existing patterns — check sibling files, reuse existing components.

---

## Phase 3: Done

That's it. No validation phase, no test runners, no linting passes, no verbose gate checklists. The value of this skill is that the gate rules were loaded as context **before** coding, so the code was written correctly from the start.

Optionally mention next steps if relevant:
- "Run `/trilogy-dev-handover` when ready to create a PR and transition to QA (runs full Gate 4 with tests, linting, coverage)"
- "Run `/trilogy-dev-review` for a full educational review of all changes"

---

## What This Skill Does NOT Do

This skill is intentionally lightweight. It does NOT:

- Run tests (`php artisan test`)
- Run linting (`vendor/bin/pint`)
- Run builds (`npm run build`)
- Audit files post-implementation with per-file pass/fail tables
- Create PRs or transition Linear status
- Produce any markdown artifacts or gate reports
- Require any prior artifacts (spec.md, plan.md, tasks.md)

Those responsibilities belong to other skills (`/trilogy-dev-handover`, `/trilogy-dev-review`, `/speckit-implement`). The anvil is purely about loading the right rules as context so code comes out right the first time.

---

## Key Rules

- **Gates are loaded BEFORE coding** — this is prevention, not detection
- **No artifact dependencies** — works with zero prior artifacts
- **Gate files are the single source of truth** — always read them fresh, never use hardcoded rules
- **Stay lightweight** — no runners, no reports, no artifacts produced
- **Respect EnterPlanMode** — use it for non-trivial changes (3+ files)

## Integration

| Skill | Relationship |
|-------|-------------|
| `/speckit-implement` | Full pipeline implementation (requires tasks.md) — anvil is the lightweight alternative |
| `/trilogy-dev-handover` | Run after anvil when ready for PR + full Gate 4 validation (tests, linting, coverage) |
| `/trilogy-dev-review` | Run after anvil for a full educational review with per-file audits |
| `/speckit-plan` | Full architecture planning — anvil loads the same Gate 3 rules but without producing plan.md |
