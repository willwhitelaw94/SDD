---
name: speckit-analyze
description: Workflow-aware analysis of spec artifacts across the full development pipeline. Detects current stage, runs appropriate gate checks, finds gaps and inconsistencies, and recommends next actions. Use at any stage: idea review, spec validation, plan verification, pre-implementation check, or QA readiness. Triggers on: analyze, review, validate, check, assess, audit.
---

# SpecKit Analyze Skill

Comprehensive workflow-aware analysis that detects your current stage, validates artifacts against appropriate gates, and identifies gaps, inconsistencies, and blockers across the full spec-driven development pipeline.

**STRICTLY READ-ONLY**: Does NOT modify any files. Outputs a structured analysis report.

## Workflow Overview

```
Idea → Spec → Design → Plan → Tasks → Implement → QA → Review → Release
  │       │        │       │       │         │       │     │
Gate 1  Gate 1   Gate 2  Gate 3  Gate 3    Gate 4  Gate 5 Gate 6
```

This skill analyzes artifacts at ANY stage and validates against the appropriate gate(s).

---

## Epic Detection & Stage Detection

### Step 0: Detect Epic Context

```bash
# Find all initiatives with artifacts
find .tc-docs/content/initiatives -type f \( -name "idea.md" -o -name "IDEA-BRIEF.md" -o -name "spec.md" -o -name "design.md" -o -name "plan.md" -o -name "tasks.md" \) 2>/dev/null | sort
```

**If multiple epics exist**: Ask user which epic to analyze

**If no epics found**: Check for standalone `.specify/` folder, otherwise suggest `/trilogy-idea` to start

### Step 1: Artifact Inventory

Build an inventory of what exists for the selected epic:

| Artifact | Location | Status |
|----------|----------|--------|
| idea.md / IDEA-BRIEF.md | `[EPIC_DIR]/` | ✓ Present / ✗ Missing |
| spec.md | `[EPIC_DIR]/` | ✓ Present / ✗ Missing |
| design.md | `[EPIC_DIR]/` | ✓ Present / ✗ Missing |
| plan.md | `[EPIC_DIR]/` | ✓ Present / ✗ Missing |
| tasks.md | `[EPIC_DIR]/` | ✓ Present / ✗ Missing |
| checklists/ | `[EPIC_DIR]/checklists/` | ✓ Present / ✗ Missing |
| context/ | `[EPIC_DIR]/context/` | ✓ Present / ✗ Missing |

### Step 2: Determine Current Stage

Based on artifact presence, determine the workflow stage:

| Stage | Required Artifacts | Next Gate |
|-------|-------------------|-----------|
| **Ideation** | idea.md only | Gate 1 (Business) |
| **Specification** | idea.md + spec.md | Gate 1 (Business) |
| **Design** | spec.md + design.md | Gate 2 (Design) |
| **Planning** | spec.md + design.md + plan.md | Gate 3 (Architecture) |
| **Ready to Implement** | spec.md + plan.md + tasks.md | Gate 3 (Architecture) |
| **Implementation** | All above + code changes | Gate 4 (Code Quality) |
| **QA** | All above + tests passing | Gate 5 (QA) |
| **Release** | All above + QA passed | Gate 6 (Release) |

---

## Analysis Execution

### 1. Load Context

Load available artifacts:
- **idea.md / IDEA-BRIEF.md**: Problem, solution, benefits, stakeholders, risks
- **spec.md**: Requirements, user stories, acceptance criteria, success criteria
- **design.md**: UX decisions, UI patterns, component inventory, mockups
- **plan.md**: Tech stack, data model, API contracts, phases, risks
- **tasks.md**: Task breakdown, dependencies, phases, file paths
- **constitution**: `.specify/memory/constitution.md` (if exists)
- **checklists/**: Any existing quality checklists

Load gate definitions:
- `.tc-wow/gates/01-spec.md`
- `.tc-wow/gates/02-design.md`
- `.tc-wow/gates/03-architecture.md`
- `.tc-wow/gates/04-code-quality.md`
- `.tc-wow/gates/05-qa.md`

### 2. Run Stage-Appropriate Gate Checks

Based on detected stage, run the appropriate gate analysis:

#### Stage: Ideation → Gate 1 (Business Gate)

**Checks against `.tc-wow/gates/01-business.md`:**

| Check | Validation |
|-------|------------|
| **Problem clearly defined** | Specific problem statement exists, not solution-first |
| **User need validated** | Evidence of user pain point or request documented |
| **Business objective clear** | Ties to portal goals or KPIs |
| **ROI justifiable** | Worth the investment (quantified if possible) |
| **Fits portal scope** | Within TC Portal's domain |
| **No conflicting initiatives** | Checked against other epics |
| **Stakeholders identified** | RACI or stakeholder list present |
| **Dependencies identified** | External blockers known |

#### Stage: Specification → Gate 1 (Business) + Spec Quality

**Additional Spec Quality Checks:**

| Check | Validation |
|-------|------------|
| **INVEST criteria met** | Each user story is Independent, Negotiable, Valuable, Estimable, Small, Testable |
| **Acceptance criteria** | Given/When/Then format, measurable outcomes |
| **No implementation details** | Spec focuses on WHAT not HOW |
| **Business language** | Uses Trilogy Care terminology (Package, Recipient, Coordinator) |
| **Success criteria measurable** | Technology-agnostic, quantified metrics |
| **Edge cases identified** | Boundary conditions documented |
| **NEEDS CLARIFICATION markers** | Maximum 3, all high-impact |

#### Stage: Design → Gate 2 (Design Gate)

**Checks against `.tc-wow/gates/02-design.md`:**

| Check | Validation |
|-------|------------|
| **UI mockups exist** | Visual representation of key screens |
| **User flows documented** | Happy path and error states mapped |
| **Component decisions made** | Existing vs new components identified |
| **Responsive approach defined** | Mobile/tablet/desktop strategy |
| **Accessibility considered** | WCAG requirements noted |
| **Design-spec alignment** | All features have visual representation |
| **Edge cases visualized** | Error states, empty states, loading states |
| **Stakeholder approval** | Design sign-off recorded |

#### Stage: Planning → Gate 3 (Architecture Gate)

**Checks against `.tc-wow/gates/03-architecture.md`:**

| Check | Validation |
|-------|------------|
| **Architecture approach clear** | Know how to build this |
| **Existing patterns leveraged** | Uses established codebase conventions |
| **Data model understood** | Entities, relationships defined |
| **API contracts clear** | Endpoints and payloads defined |
| **Dependencies identified** | External services, packages, migrations |
| **Risk areas noted** | Complex or risky areas flagged |
| **Testing approach defined** | Know how to verify |
| **Laravel best practices** | No anti-patterns (see below) |

**Laravel & Cross-Platform Best Practices (CRITICAL):**

| Check | Red Flag |
|-------|----------|
| **No hardcoded business logic in Vue** | Business rules must be backend-powered |
| **No magic numbers/IDs** | Use Model constants instead |
| **Laravel Data for validation** | No `Request $request` in controllers |
| **Model route binding** | No `int $id` parameters |
| **Lorisleiva Actions** | Must use `AsAction` trait |
| **Anemic Data classes** | No business logic in DTOs |
| **Schema-only migrations** | No data operations in migrations |

#### Stage: Ready to Implement → Tasks Quality

**Additional Task Quality Checks:**

| Check | Validation |
|-------|------------|
| **All tasks have IDs** | T001, T002, etc. format |
| **User story mapping** | Tasks mapped to [US1], [US2], etc. |
| **Parallel opportunities marked** | [P] markers where applicable |
| **File paths specified** | Concrete paths for each task |
| **Dependencies respected** | Sequential vs parallel correctly identified |
| **MVP scope clear** | P1 stories form viable MVP |

### 3. Cross-Artifact Consistency Analysis

**A. Terminology Drift Detection**
- Scan all artifacts for entity name inconsistencies
- Example: "Package" vs "Account" vs "Subscription"

**B. Requirement Coverage Mapping**
- Map spec requirements → plan sections → tasks
- Identify orphan requirements (no tasks)
- Identify orphan tasks (no requirements)

**C. User Story Traceability**
- Map user stories → design mockups → tasks
- Identify stories without visual representation
- Identify stories without implementation tasks

**D. Acceptance Criteria Coverage**
- Map acceptance criteria → test tasks
- Identify untestable criteria

**E. Dependency Graph Analysis**
- Build dependency graph from plan.md and tasks.md
- Identify circular dependencies
- Identify missing prerequisites

### 4. Severity Assignment

| Severity | Criteria |
|----------|----------|
| **CRITICAL** | Gate blocker, missing required artifact, violates constitution MUST, blocks baseline |
| **HIGH** | Missing acceptance criteria, ambiguous security/performance, duplicate/conflicting requirement |
| **MEDIUM** | Terminology drift, missing edge case coverage, underspecified non-functional requirement |
| **LOW** | Style/wording improvements, minor redundancy, optional enhancements |

---

## Analysis Report Format

```markdown
# Specification Analysis Report

**Epic**: [Epic Name]
**Path**: [Epic Path]
**Analyzed**: [Date/Time]
**Current Stage**: [Stage Name]
**Next Gate**: [Gate Name]

---

## Stage Summary

| Stage | Status | Artifacts |
|-------|--------|-----------|
| Ideation | ✓ Complete | idea.md |
| Specification | ✓ Complete | spec.md |
| Design | ⚠ In Progress | design.md (partial) |
| Planning | ✗ Not Started | - |
| Implementation | ✗ Not Started | - |

**Readiness**: Ready for [Next Stage] after addressing [N] issues

---

## Gate Check: [Current Gate Name]

### Passed Checks ✓

- [x] Problem clearly defined
- [x] User need validated
- [x] Stakeholders identified

### Failed Checks ✗

| # | Check | Issue | Severity | Recommendation |
|---|-------|-------|----------|----------------|
| 1 | Business objective | Not tied to KPI | HIGH | Add measurable objective |
| 2 | Dependencies | Graph API unclear | MEDIUM | Confirm API contract |

---

## Cross-Artifact Issues

| ID | Category | Severity | Location(s) | Summary | Recommendation |
|----|----------|----------|-------------|---------|----------------|
| XA-001 | Terminology | MEDIUM | spec:12, plan:45 | "Package" vs "Client" | Standardize on "Package" |
| XA-002 | Coverage Gap | HIGH | spec:FR-005 | No task for FR-005 | Add task for FR-005 |
| XA-003 | Orphan Task | LOW | tasks:T015 | No requirement ref | Link to requirement |

---

## Coverage Summary

### Requirement → Task Coverage

| Requirement | Has Task? | Task IDs | Status |
|-------------|-----------|----------|--------|
| FR-001 | ✓ | T003, T004 | Covered |
| FR-002 | ✓ | T005 | Covered |
| FR-003 | ✗ | - | GAP |

**Coverage**: 12/15 requirements (80%)

### User Story → Design → Task Traceability

| Story | Has Mockup? | Has Tasks? | Status |
|-------|-------------|------------|--------|
| US1 | ✓ | ✓ | Complete |
| US2 | ✗ | ✓ | Missing Design |
| US3 | ✓ | ✗ | Missing Tasks |

---

## Metrics

| Metric | Value |
|--------|-------|
| Total Requirements | 15 |
| Total User Stories | 5 |
| Total Tasks | 24 |
| Requirement Coverage | 80% |
| Story Coverage | 60% |
| Critical Issues | 2 |
| High Issues | 3 |
| Medium Issues | 5 |
| Low Issues | 2 |

---

## Recommendations

### Before Proceeding to [Next Stage]

**Must Fix (CRITICAL/HIGH):**
1. [Issue description and fix recommendation]
2. [Issue description and fix recommendation]

**Should Fix (MEDIUM):**
1. [Issue description and fix recommendation]

**Consider (LOW):**
1. [Issue description and suggestion]

### Suggested Next Actions

1. **Fix blockers**: Address [N] critical/high issues
2. **Run checklist**: `/speckit-checklist [type]` to validate [domain]
3. **Proceed to**: `/[next-skill]` when ready

---

## Gate Pass/Fail

**Gate [N] Status**: PASS / FAIL / BLOCKED

**Blocker Summary** (if applicable):
- [Blocker 1]
- [Blocker 2]
```

---

## Quick Analysis Modes

Support focused analysis with flags:

```bash
/speckit-analyze                    # Full analysis
/speckit-analyze --gate             # Gate checks only
/speckit-analyze --coverage         # Coverage analysis only
/speckit-analyze --consistency      # Cross-artifact consistency only
/speckit-analyze --summary          # Brief summary, no details
/speckit-analyze --next             # Just show next steps
```

---

## Operating Principles

1. **NEVER modify files** - Read-only analysis only
2. **NEVER hallucinate** - Only report what's found in artifacts
3. **Detect stage automatically** - Don't assume user knows workflow
4. **Prioritize blockers** - CRITICAL issues always surface first
5. **Be actionable** - Every issue has a recommendation
6. **Reference gates** - Link to gate documentation for learning
7. **Report zero issues gracefully** - Emit success report with coverage stats

---

## Integration with Workflow

| From Skill | Analyze After | Focus Area |
|------------|---------------|------------|
| `/trilogy-idea` | Idea created | Gate 1 readiness |
| `/speckit-specify` | Spec created | Gate 1 + Spec quality |
| `/trilogy-design` | Design created | Gate 2 readiness |
| `/speckit-plan` | Plan created | Gate 3 readiness |
| `/speckit-tasks` | Tasks created | Gate 3 + Task quality |
| `/speckit-implement` | Before coding | Pre-implementation check |
| `/trilogy-qa` | After QA | Gate 5 evidence |

---

## Example Output (Summary Mode)

```
## Analysis Summary: Calls Uplift

**Stage**: Ideation → Specification
**Gate**: Business Gate (Gate 1)
**Status**: ⚠ NEEDS WORK

### Quick Stats
- ✓ 8/11 gate checks passed
- ✗ 3 issues found (1 HIGH, 2 MEDIUM)
- 📋 Artifacts: idea.md ✓ | spec.md ✗ | design.md ✗ | plan.md ✗

### Blockers
1. [HIGH] Business objective not tied to measurable KPI
2. [MEDIUM] Graph API dependency timeline unclear
3. [MEDIUM] No stakeholder sign-off recorded

### Next Steps
1. Add KPI target to Problem Statement
2. Confirm Graph team timeline
3. Get stakeholder approval checkbox
4. Run `/speckit-specify` to create spec
```
