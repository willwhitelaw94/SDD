---
name: trilogy-estimate
description: Generate effort estimates at any level - idea briefs (T-shirt sizing), stories (days), or tasks (story points). Estimates whatever exists and updates all levels when re-run. Triggers on: estimate, sizing, how long, effort, cost estimate, story points.
---

# Trilogy Estimate Skill

Generate effort estimates at any level of the spec hierarchy. Estimates whatever exists, updates all when re-run.

## Usage

```bash
/trilogy.estimate           # Auto-detect and estimate whatever exists
/trilogy.estimate idea      # Just estimate idea brief
/trilogy.estimate stories   # Just estimate stories in spec.md
/trilogy.estimate tasks     # Just estimate tasks in tasks.md
```

## How It Works

### Auto-Detection (Default)

When you run `/trilogy.estimate` without arguments:

1. **Find epic folder** - Look for spec.md, tasks.md, IDEA-BRIEF.md
2. **Estimate what exists**:
   - If only IDEA-BRIEF.md → estimate idea
   - If spec.md exists → estimate stories
   - If tasks.md exists → estimate tasks
   - If multiple exist → estimate all of them
3. **Validate consistency** - Check that task points align with story days

### Re-Running Updates Everything

When estimates already exist:
- **Inline estimates** get replaced (look for `> **Estimate**:` or `` `3` ``)
- **Summary sections** get replaced (look for `## Effort Estimate` or `## Sprint Allocation`)
- All levels are re-validated against each other

---

## Estimation Levels

| Level | Input | Unit | Output Location |
|-------|-------|------|-----------------|
| **Idea** | IDEA-BRIEF.md | T-shirt (S/M/L) | `## Estimated Effort` section |
| **Stories** | spec.md | **Days** | Inline + `## Effort Estimate` section |
| **Tasks** | tasks.md | **Points** (1-8) | Inline + `## Sprint Allocation` section |

### Conversion Reference

```
1 point ≈ 0.5 days
~20 points = 1 sprint = 10 working days
1 day = ~$3k
1 sprint (10 days) = ~$30k
```

---

## Level 1: Idea Brief Estimation

**Input**: IDEA-BRIEF.md
**Output**: T-shirt size, cost range, confidence

### T-Shirt Sizing Rubric

| Size | Days | Cost | Criteria |
|------|------|------|----------|
| **S** | 5-10 | ~$15-30k | Single flow, few files, no integrations |
| **M** | 20-40 | ~$60-120k | Multiple flows, new tables, one integration |
| **L** | 60+ | ~$180k+ | Cross-cutting, multiple integrations, migration |

### Output Format

Insert/update `## Estimated Effort` section in IDEA-BRIEF.md:

```markdown
## Estimated Effort

| Metric | Value |
|--------|-------|
| **Size** | M (Medium) |
| **Days** | 25-35 |
| **Cost Range** | ~$75-105k |
| **Confidence** | Medium |

**Key Drivers**: Multiple user types, new data model, external integration

**Assumptions**: E-signature service available, existing auth patterns reusable
```

---

## Level 2: Story Estimation

**Input**: spec.md (User Scenarios section)
**Output**: Days per story (inline) + summary section

### Story Sizing Guide

| Size | Days | Cost | Indicators |
|------|------|------|------------|
| **XS** | 1-2 | ~$3-6k | Single endpoint, simple UI |
| **S** | 3-5 | ~$9-15k | One flow, few files |
| **M** | 8-12 | ~$24-36k | Multiple files, some complexity |
| **L** | 15-20 | ~$45-60k | Cross-cutting, integrations |
| **XL** | 25+ | ~$75k+ | Major feature, high risk |

### Inline Format

Insert after each story heading:

```markdown
### User Story 1 - First-Login Flow (Priority: P1)

> **Estimate**: 8 days | ~$24k | High confidence

As a new recipient...
```

### Summary Section

Add/update `## Effort Estimate` at end of spec.md:

```markdown
---

## Effort Estimate

**Generated**: 2026-01-31 | **Size**: Large (L) | **Confidence**: Medium

### Summary

| Metric | Value |
|--------|-------|
| **Total Days** | 85 |
| **Total Cost** | ~$255k |

### Story Breakdown

| Story | Priority | Days | Cost | Confidence | Notes |
|-------|----------|------|------|------------|-------|
| US01 - First-Login | P1 | 8 | ~$24k | High | Core |
| US02 - Signing | P1 | 12 | ~$36k | Medium | E-sig |
| US03 - View List | P1 | 5 | ~$15k | High | Simple |
| **Total** | | **85** | **~$255k** | | |

### Phase Recommendations

| Phase | Stories | Days | Focus |
|-------|---------|------|-------|
| MVP | US01-05 | 30 | Core flow |
| Phase 2 | US06-09 | 25 | Extensions |
| Phase 3 | US10-15 | 30 | Lifecycle |

### Red Flags

- [List any that apply]

### Assumptions

- [Key assumptions]
```

---

## Level 3: Task Estimation

**Input**: tasks.md
**Output**: Story points per task (inline) + sprint allocation

### Task Pointing Guide

| Points | Complexity | Time | Example |
|--------|------------|------|---------|
| **1** | Trivial | ~2-4 hrs | Config, env var, single line |
| **2** | Simple | ~half day | One file, clear change |
| **3** | Medium | ~1 day | Few files, straightforward |
| **5** | Complex | ~2-3 days | Multiple files, some unknowns |
| **8** | Large | ~4-5 days | Cross-cutting, needs spike |

**Rule**: If > 8 points, break the task down further.

### Inline Format

Insert points as backtick-wrapped number after [US] label:

**Before:**
```markdown
- [ ] T001 [US1] Create Agreement model in app/Models/
```

**After:**
```markdown
- [ ] T001 [US1] `3` Create Agreement model in app/Models/
```

### Sprint Allocation Section

Add/update `## Sprint Allocation` at end of tasks.md:

```markdown
---

## Sprint Allocation

**Generated**: 2026-01-31 | **Velocity**: ~20 pts/sprint (~10 days)

### Points by Story

| Story | Tasks | Points | Days |
|-------|-------|--------|------|
| US01 | T001-T004 | 16 | ~8 |
| US02 | T005-T010 | 24 | ~12 |
| **Total** | | **40** | **~20** |

### Sprint Plan

| Sprint | Stories | Points | Days |
|--------|---------|--------|------|
| Sprint 1 | US01, US03 | 21 | ~10 |
| Sprint 2 | US02 | 24 | ~12 |

### Validation vs Story Estimates

| Story | Estimated (spec) | Calculated (tasks) | Delta |
|-------|------------------|-------------------|-------|
| US01 | 8 days | 8 days (16 pts) | ✅ OK |
| US02 | 12 days | 12 days (24 pts) | ✅ OK |
```

---

## Calibration Rules

### "Weeks → Days" Rule

AI estimates in "weeks" = days of pure coding time:

| AI Says | Interpret As | Why |
|---------|--------------|-----|
| "2 weeks" | 3-4 days | Review, testing, deployment |
| "1 month" | 8-10 days | Integration, edge cases |
| "1 quarter" | 20-30 days | Architecture, coordination |

### Red Flags (Size Up)

If ANY apply, add 25-50% buffer:

- First time touching this codebase area
- Legacy code with no tests
- Coordination with another team
- Compliance/audit implications
- Billing or financial data
- Performance-sensitive
- External API with rate limits
- Data migration required

### Confidence Levels

| Level | Variance | When to Use |
|-------|----------|-------------|
| **High** | ±20% | Well-understood, similar past work |
| **Medium** | ±50% | Some unknowns, need spike |
| **Low** | ±100% | New territory, recommend splitting |

---

## Validation

When multiple levels exist, validate consistency:

### Tasks → Stories

Sum task points per story, convert to days:
- `Total Points × 0.5 = Days`
- Compare to story estimate in spec.md
- Flag if delta > 25%

### Stories → Idea

Sum story days:
- Compare to idea brief T-shirt size
- S = 5-10 days, M = 20-40 days, L = 60+ days
- Flag if mismatch

### Report Discrepancies

```markdown
### Validation Notes

⚠️ US02 estimated at 10 days but tasks total 15 days (30 pts)
   - Consider: increase story estimate OR reduce task scope

✅ Total days (85) aligns with L size estimate in idea brief
```

---

## Integration with Linear

After estimating, sync to Linear:

```bash
/trilogy.linear-sync push stories  # Story days → Linear Issue estimate
/trilogy.linear-sync push tasks    # Task points → Linear Sub-issue estimate
```

Linear supports estimate fields that can hold days or points.

---

## Key Rules

- **Edit files directly** - No separate estimate files
- **Estimate what exists** - Don't fail if only partial docs exist
- **Update all on re-run** - Keep estimates in sync
- **Validate cross-level** - Flag inconsistencies
- **Stories use days** - More intuitive than sprints
- **Tasks use points** - Standard agile pointing (1, 2, 3, 5, 8)
- Use blockquote (`>`) for story estimates
- Use backticks (`` `3` ``) for task points
- When in doubt, size up

## Next Steps

After estimating:
- `/speckit.tasks` - Generate tasks (if estimating stories)
- `/trilogy.linear-sync push all` - Sync to Linear
- `/speckit.implement` - Start development
