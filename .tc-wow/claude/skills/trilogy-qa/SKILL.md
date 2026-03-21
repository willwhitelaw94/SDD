---
name: trilogy-qa
description: >-
  Generates a structured QA test plan from spec.md acceptance criteria. Produces qa-plan.md
  with test cases, expected results, priority, edge cases, and responsive/accessibility
  checklists. No browser testing — that's /trilogy-qa-test-agent.
  Triggers on: qa, qa plan, test plan, qa document, acceptance criteria plan, generate test plan.
metadata:
  version: 3.0.0
  type: skill
---

# Trilogy QA Skill

Generates a **QA test plan document** from spec.md acceptance criteria. Produces `qa-plan.md` with structured test cases, expected results, severity, and edge cases. Does NOT run browser tests — that's `/trilogy-qa-test-agent`.

## Separation of Concerns

| Skill | Responsibility |
|-------|---------------|
| `/trilogy-qa` | **Plans** — THIS: generates qa-plan.md from spec ACs |
| `/trilogy-qa-test-agent` | **Executes** — opens browser, walks through test plan, fixes failures, updates report |
| `/trilogy-qa-test-codify` | **Codifies** — converts passing browser tests into Pest/Playwright deterministic tests |

## When to Use

```bash
/trilogy-qa                    # Generate QA test plan from spec.md
/trilogy-qa --checklist        # Output QA Gate 5 checklist only
```

**Can run at any stage** — even during design. No browser or running app needed.

## Prerequisites

| Artifact | Required | Source |
|----------|----------|--------|
| spec.md | Yes | Initiative folder — acceptance criteria are the test plan |
| design.md | Recommended | For responsive/accessibility requirements |
| plan.md | Optional | For understanding implementation scope |

## Execution Flow

### Phase 1 — Gather Context

1. **Find the epic folder** by matching git branch to initiative folders:
   ```bash
   git branch --show-current
   ```
   Search `.tc-docs/content/initiatives/` for matching spec.md

2. **Read spec.md** — extract ALL acceptance criteria. Parse:
   - User stories with Given/When/Then scenarios
   - Acceptance criteria (numbered or bulleted)
   - Edge cases mentioned
   - Validation rules
   - Non-functional requirements

3. **Read design.md** (if exists) — extract:
   - Responsive requirements
   - Accessibility requirements (WCAG level)
   - Specific interaction patterns
   - Edge cases from design

4. **Read plan.md** (if exists) — understand:
   - Implementation scope
   - Feature flag names
   - API endpoints and routes

### Phase 2 — Generate Test Plan

5. **For each acceptance criterion**, create a test case:

   ```markdown
   ### TC-{number}: {Test Case Title}

   **AC Reference**: AC-{n} from US-{m}
   **Priority**: P1 / P2 / P3
   **Severity if fails**: Sev {1-5}
   **Method**: Browser / Automated / Manual

   **Preconditions**:
   - [What must be true before the test]

   **Steps**:
   1. [Navigate to...]
   2. [Enter/click/select...]
   3. [Verify...]

   **Expected Result**:
   - [What should happen]

   **Test Data**:
   - [Specific data needed]

   **Edge Cases**:
   - [Variations to also test]
   ```

6. **Group test cases** by user story or feature area

7. **Add responsive test cases** (from design.md or default):
   - Desktop (1920x1080)
   - Tablet (768x1024)
   - Mobile (375x812)

8. **Add accessibility test cases** (from design.md or default WCAG AA):
   - Form fields have labels
   - Images have alt text
   - Buttons have accessible names
   - Heading hierarchy is correct
   - Focus order is logical
   - Keyboard navigation works

9. **Add quality checks**:
   - Console: no JS errors or warnings
   - Network: no 404s or failed requests
   - Performance: no requests > 3s

### Phase 3 — Generate qa-plan.md

10. Save to the epic folder:

```markdown
---
title: "QA Test Plan: {Feature Name}"
created: YYYY-MM-DD
status: Draft
---

# QA Test Plan: {Feature Name}

**Epic**: {code}
**Spec**: [spec.md](spec.md)
**Branch**: {branch name}

---

## Summary

| Metric | Count |
|--------|-------|
| **Total Test Cases** | X |
| **P1 (Critical)** | X |
| **P2 (Important)** | X |
| **P3 (Nice to have)** | X |
| **Browser Tests** | X |
| **Automated Tests** | X |
| **Manual Tests** | X |

---

## Test Cases

### {User Story / Feature Area}

{Test cases grouped by story}

---

## Responsive Testing

| Breakpoint | Resolution | Key Pages to Test |
|------------|-----------|-------------------|
| Desktop | 1920x1080 | [list] |
| Tablet | 768x1024 | [list] |
| Mobile | 375x812 | [list] |

---

## Accessibility Checklist

- [ ] Form fields have labels
- [ ] Images have alt text
- [ ] Buttons have accessible names
- [ ] Heading hierarchy is correct
- [ ] Focus order is logical
- [ ] Keyboard navigation works
- [ ] Colour contrast meets WCAG AA

---

## E2E Test Specifications

Playwright E2E tests to be created by `/trilogy-qa-test-codify` after test execution passes.

### Page Objects Needed

| Page Object | File | Covers |
|-------------|------|--------|
| `{FeatureName}` | `e2e/pages/{feature}.page.ts` | [pages/routes covered] |

### Test Specs to Create

| Spec File | Test Cases | Priority |
|-----------|-----------|----------|
| `e2e/tests/{feature}/{flow}.spec.ts` | TC-1, TC-2, TC-3 | P1 |
| `e2e/tests/{feature}/{flow}.spec.ts` | TC-4, TC-5 | P2 |

### Key Locators

| Element | Selector Strategy | Notes |
|---------|------------------|-------|
| [button/input/etc] | `getByRole('button', { name: '...' })` | [any gotchas] |

### Test Data Dependencies

| Test | Seeded Data Needed | Factory/Seeder |
|------|-------------------|----------------|
| TC-1 | [data description] | [factory class or seeder] |

---

## Quality Checks

- [ ] No console errors
- [ ] No console warnings (feature-related)
- [ ] No 404 network requests
- [ ] No requests > 3s
- [ ] Feature flag toggles correctly

---

## Test Data Requirements

| Data | Needed For | How to Set Up |
|------|-----------|---------------|
| [data item] | TC-{n} | [seeder / factory / manual] |

---

## Severity Definitions

| Severity | Description | Gate Impact |
|----------|-------------|-------------|
| **Sev 1** | Feature unusable, data loss, security issue | BLOCKS |
| **Sev 2** | Core functionality broken, no workaround | BLOCKS |
| **Sev 3** | Functionality impaired, workaround exists | BLOCKS |
| **Sev 4** | Cosmetic, minor UX issue | Document & proceed |
| **Sev 5** | Edge case, future enhancement | Document & proceed |

---

## Next Steps

- [ ] `/trilogy-qa-test-agent` — Execute this test plan in the browser
- [ ] `/trilogy-qa-test-codify` — Convert passing tests to Pest/Playwright
- [ ] `/trilogy-qa-handover` — Gate 5 sign-off
```

### Phase 4 — Report

11. Display summary to user:

```
## QA Test Plan Generated

**File**: [path to qa-plan.md]

### Summary
- X total test cases (Y P1, Z P2)
- N browser tests, M automated, K manual
- Responsive: 3 breakpoints
- Accessibility: WCAG AA checklist

### Next Steps
- `/trilogy-qa-test-agent` — Execute the test plan in the browser
- `/trilogy-qa-test-codify` — Convert passing tests to Playwright
- `/trilogy-qa-handover` — Gate 5
```

## Key Rules

- **Always read spec.md first** — acceptance criteria are the test plan. Don't skip any AC.
- **One test case per AC** — at minimum. Complex ACs may need multiple test cases.
- **Include edge cases** — if spec mentions validation, add negative test cases.
- **Be specific** — steps should be concrete enough for the test agent to execute.
- **Include test data** — what data is needed and how to set it up.
- **Priority mapping**: P1 = Sev 1-2 failures, P2 = Sev 3, P3 = Sev 4-5
- **No browser needed** — this is pure document generation.
- **Can run during design** — doesn't need code to exist yet.

## Workflow Position

```
/trilogy-dev-handover       → Gate 4 (Code Quality)
/trilogy-qa                 → THIS SKILL: qa-plan.md (test plan document)
/trilogy-qa-test-agent      → Execute plan in browser, fix & retest
/trilogy-qa-test-codify     → Convert passing tests → Pest/Playwright
/trilogy-qa-handover        → Gate 5: QA sign-off
```
