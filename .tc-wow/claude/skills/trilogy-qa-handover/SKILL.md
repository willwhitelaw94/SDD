---
name: trilogy-qa-handover
description: >-
  Run Gate 5 (QA Gate) and transition epic from QA to Release.
  Use after business testing is complete.
  Validates QA checklist (functional, cross-browser, accessibility, regression),
  confirms no open Sev 1-3 issues, transitions Linear from QA to Release,
  and updates meta.yaml.
metadata:
  version: 1.0.0
  type: gate
---

# QA Handover Skill (Gate 5: QA Gate)

Validate that business testing is complete, all acceptance criteria are verified, and transition the epic from QA to Review in Linear.

## Purpose

This skill:
1. **Validates** the QA Gate checklist from `.tc-wow/gates/05-qa.md`
2. **Confirms** functional testing, cross-browser, accessibility, and regression checks are done
3. **Verifies** no open Severity 1-3 issues remain
4. **Transitions** Linear project status from QA → Release
5. **Updates** meta.yaml status
6. **Posts** gate summary as a comment in Linear

## When to Use

```bash
/trilogy-qa-handover           # Full gate process
/trilogy-qa-handover --check   # Quick gate check only (no Linear transition)
```

Run this skill when:
- Business/QA testing is complete
- All acceptance criteria have been manually verified
- Cross-browser testing is done
- No open Sev 1-3 bugs remain

## Position in Workflow

```
/trilogy-dev-handover      → Gate 4 (Code Quality: Dev → QA)
/trilogy-qa                → Generate QA test report for testers
→ Business Testing (manual)
        ↓
/trilogy-qa-handover       → Gate 5 (QA: QA → Release)
        ↓
Release Agent              → Gate 6 (Release: Release → Completed)
```

## Execution Steps

### Step 1: Detect Epic

```bash
# Check for meta.yaml in current initiative
find .tc-docs/content/initiatives -name "meta.yaml" -type f 2>/dev/null | head -5
```

If `$ARGUMENTS` specifies an epic, use that. Otherwise detect from current branch or ask.

### Step 2: Verify Prerequisites

Check that Gate 4 (Code Quality) has passed:

```bash
# Check meta.yaml for current status
# Should be in "qa" status (set by trilogy-dev-handover)
```

| Prerequisite | Required |
|-------------|----------|
| Gate 4 passed | Yes |
| Feature deployed to staging | Yes |
| QA test report exists | Recommended |

### Step 3: Run QA Gate Checklist

Walk through the Gate 5 checklist from `.tc-wow/gates/05-qa.md`:

**Functional Validation**:
- [ ] Feature works as described in ticket
- [ ] All acceptance criteria from spec.md verified
- [ ] UI matches approved design/mockups
- [ ] Field validation, error states, success messages work

**Regression & Integration**:
- [ ] Related areas unaffected by changes
- [ ] Link integrity confirmed
- [ ] Data integrity maintained

**Cross-Browser & Device**:
- [ ] Chrome (desktop + mobile)
- [ ] Safari (desktop + mobile)
- [ ] Firefox (desktop)
- [ ] Responsive: Desktop (1920), Tablet (768), Mobile (375)

**Quality & Performance**:
- [ ] Accessibility (WCAG 2.1 AA)
- [ ] Performance acceptable (no lag/layout shift)
- [ ] No console warnings or 404s

**Issue Management**:
- [ ] No open Severity 1-3 issues
- [ ] Minor issues documented and accepted

**Ask the user to confirm** each section. If any Sev 1-3 issues are open, the gate FAILS.

### Step 4: Generate Gate Summary

```markdown
## QA Gate (Gate 5) — [Epic Name]

**Date**: YYYY-MM-DD
**Status**: PASS / FAIL

### Checklist Results

| Category | Status |
|----------|--------|
| Functional validation | PASS |
| Regression & integration | PASS |
| Cross-browser & device | PASS |
| Quality & performance | PASS |
| Issue management | PASS |

### Issues
- Sev 1-3: 0 open (gate requirement met)
- Sev 4-5: [count] documented and accepted

### Sign-off
- [x] QA confirms ready for Release

**Ready for Release**: YES
```

### Step 5: Transition Linear (QA → Release)

Use Linear MCP tools:

1. Find the epic/project in Linear
2. Transition status from **QA** to **Release**
3. Add "QA Approved" label if available
4. Post gate summary as a comment

```bash
# Using Linear MCP
# 1. Find issue by epic ID from meta.yaml
# 2. Get available transitions
# 3. Transition to Review
# 4. Post comment with gate summary
```

### Step 6: Update meta.yaml

Update the epic's `meta.yaml`:

**Do not overwrite existing gate records** — only add the new `qa` key under `gates`:

```yaml
status: release  # was: qa
gates:
  idea:          # preserved from Gate 0
    passed: true
    date: YYYY-MM-DD
    notes: "..."
  spec:          # preserved from Gate 1
    passed: true
    date: YYYY-MM-DD
    notes: "..."
  design:        # preserved from Gate 2
    passed: true
    date: YYYY-MM-DD
    notes: "..."
  dev:           # preserved from Gate 4
    passed: true
    date: YYYY-MM-DD
    pr: "..."
    notes: "..."
  qa:            # added now
    passed: true
    date: YYYY-MM-DD
    notes: "All QA checks passed. No Sev 1-3 issues."
```

### Step 7: Report

```markdown
## QA Handover Complete

**Epic**: [Epic Name]
**Gate 5**: PASSED
**Linear**: QA → Release
**meta.yaml**: Updated

### Next Steps
- Feature is ready for release
- Run the **Release Agent** when approved for release
```

## On Gate Failure

If the gate fails:

```markdown
## QA Gate FAILED

**Reason**: [specific failures]

### Blocking Issues
| # | Description | Severity |
|---|-------------|----------|
| 1 | [issue] | Sev [X] |

### Action Required
- Fix Sev 1-3 issues
- Return to developer if code changes needed
- Re-run `/trilogy-qa-handover` after fixes
```

Do NOT transition Linear or update meta.yaml on failure.

## Options

| Flag | Description |
|------|-------------|
| `--check` | Run gate checklist only (no Linear transition, no meta.yaml update) |
