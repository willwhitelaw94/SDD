---
name: trilogy-dev-handover
description: >-
  Run Gate 4 (Code Quality Gate) and transition epic from Dev to QA.
  Use after implementation is complete.
  Runs automated checks (tests, linting, coverage), validates acceptance criteria,
  creates PR, transitions Linear from Dev to QA, and updates meta.yaml.
metadata:
  version: 1.0.0
  type: gate
---

# Dev Handover Skill (Gate 4: Code Quality Gate)

Validate code quality, run automated checks, verify acceptance criteria are met, create PR, and transition the epic from Dev to QA in Linear.

## Purpose

This skill:
1. **Runs automated checks** — tests, linting (Pint), static analysis (Larastan), coverage
2. **Validates** acceptance criteria from spec.md are implemented
3. **Checks** Laravel and Vue best practices from Gate 4 checklist
4. **Creates** a PR with structured description and QA notes
5. **Transitions** Linear project status from Dev → QA
6. **Updates** meta.yaml status
7. **Posts** gate summary as a comment in Linear

## When to Use

```bash
/trilogy-dev-handover           # Full gate process
/trilogy-dev-handover --check   # Quick gate check only (no PR, no Linear transition)
```

Run this skill when:
- Implementation is complete
- Feature branch has all changes committed
- Ready for QA testing

## Position in Workflow

```
/speckit-plan              → plan.md (technical plan) → Gate 3 (Architecture)
/trilogy-clarify dev       → refine plan
→ Implementation
        ↓
/trilogy-dev-handover      → Gate 4 (Code Quality: Dev → QA)
        ↓
/trilogy-qa                → Gate 5 (QA: QA → Review)
Release Agent              → Gate 6 (Release: Review → Completed)
```

## Prerequisites

| Artifact | Required | Location |
|----------|----------|----------|
| spec.md | Yes | Initiative folder (for AC verification) |
| plan.md | Yes | Initiative folder (for implementation reference) |
| Feature branch | Yes | Git (not on main/dev) |
| Gate 3 (Architecture) passed | Recommended | plan.md exists with gate check |
| meta.yaml | Yes | Initiative folder (needs `linear_project_id`) |

## Execution Flow

### Step 1: Locate Initiative

Find the current initiative context:

```bash
find .tc-docs/content/initiatives -name "spec.md" -type f 2>/dev/null | head -10
```

If multiple initiatives exist, ask user which one to process.

### Step 2: Load Artifacts

Read:
- `spec.md` — For acceptance criteria
- `plan.md` — For implementation reference
- `meta.yaml` — For Linear project ID
- `design.md` — For UI comparison (if exists)

### Step 3: Run Automated Checks

Execute each check and capture results:

```bash
# 1. Tests pass
php artisan test --compact

# 2. Coverage target
php artisan test --coverage --min=80

# 3. Linting clean
vendor/bin/pint --test

# 4. Static analysis (if configured)
vendor/bin/phpstan analyse 2>/dev/null || echo "Larastan not configured"
```

Also check:
- Browser console for errors (use `browser-logs` tool if available)
- No broken API calls

### Step 4: Run Gate 4 Checklist

Reference the full checklist from `.tc-wow/gates/04-code-quality.md`.

#### Code Quality

| Check | How to Verify | Pass Criteria |
|-------|---------------|---------------|
| Tests pass | `php artisan test --compact` | All green |
| Coverage >80% | `php artisan test --coverage --min=80` | New code covered |
| Linting clean | `vendor/bin/pint --test` | No violations |
| No console errors | Browser DevTools / `browser-logs` | Clean console |
| No broken API calls | Manual / DevTools | All endpoints respond |

#### Acceptance Criteria

| Check | How to Verify | Pass Criteria |
|-------|---------------|---------------|
| All AC implemented | Compare spec.md user stories to code | Every Given/When/Then works |
| Edge cases handled | Check spec.md edge cases section | Error states, empty states work |
| Design followed | Compare to design.md / mockups | UI matches specification |

#### Laravel Best Practices (PHP File Audit)

**MANDATORY**: Read every new/modified `.php` file on the branch and verify each against this checklist.

```bash
# List all PHP files changed on this branch
git diff --name-only dev...HEAD -- '*.php'
```

For each PHP file, verify:

| Check | Pass Criteria |
|-------|---------------|
| No hardcoded business rules in Vue | Backend-powered, dynamic |
| No magic number IDs | Using Model constants |
| Laravel Data for validation | No Request in controllers |
| Model route binding | No `int $id` parameters |
| Common components pure | Zero hardcoded logic |
| Lorisleiva Actions with `AsAction` | Not custom action classes |
| Authorization in `authorize()` | Not in `handle()` or `asController()` |
| Data classes anemic | No business logic in DTOs |
| Migrations schema-only | No data insert/update/delete |
| Granular model policies | One Policy per model |
| `Response::allow()`/`deny()` | No bare `bool` in policies |
| Event sourcing validated | "Can We Answer This Later?" criteria |
| Semantic column docs | `@property` PHPDoc on lifecycle columns |

#### Vue TypeScript File Audit (MANDATORY)

**This is the most critical step. Do NOT skip it.**

Every new or modified `.vue` file on the branch MUST be individually read and audited against the TypeScript checklist below. A table summary is not enough — each file must be opened and its `<script>` block inspected.

**Step 4a: List all changed Vue files**

```bash
# Get every Vue file changed on this branch vs dev
git diff --name-only dev...HEAD -- '*.vue'
```

**Step 4b: Read and audit each file**

For EACH file in the list above:
1. **Read the file** using the Read tool
2. Check every item in the checklist below
3. Record PASS/FAIL per file
4. If ANY file FAILS any check, the gate FAILS

**Vue TypeScript Checklist (per file)**:

| # | Check | What to Look For | Auto-Fail? |
|---|-------|------------------|------------|
| 1 | `<script setup lang="ts">` | Missing `lang="ts"` = CRITICAL failure | YES |
| 2 | No `any` types | Search for `: any`, `as any`, `any[]`, `any>` | YES |
| 3 | No `@ts-ignore` / `@ts-expect-error` | Search for these comments | YES |
| 4 | Separate interface for `defineProps` | Props must use `defineProps<Props>()` with a named interface, NOT inline types | YES |
| 5 | Typed `defineEmits` | Must use `defineEmits<{...}>()` with typed event signatures | YES |
| 6 | `withDefaults` for default values | If props have defaults, must use `withDefaults(defineProps<Props>(), {...})` | NO |
| 7 | Explicit return types on functions | Named functions and computed properties should have return types | NO |
| 8 | No unused imports/variables | Dead code must be removed | NO |
| 9 | Types/interfaces at top below imports | Type definitions before runtime code | NO |
| 10 | `defineModel` for v-model bindings | Two-way binding should use `defineModel()` not manual prop+emit | NO |

**Auto-fail items (1-5)** block the gate. Non-auto-fail items (6-10) should be fixed but don't block.

**Step 4c: Record audit results**

Present results as a per-file audit table:

```markdown
### Vue TypeScript Audit

| File | lang="ts" | No any | No ts-ignore | Props typed | Emits typed | Status |
|------|-----------|--------|--------------|-------------|-------------|--------|
| ComponentA.vue | PASS | PASS | PASS | PASS | PASS | PASS |
| ComponentB.vue | PASS | FAIL | PASS | PASS | N/A | FAIL |
```

**Known exceptions** (do NOT audit these — they are pre-existing project patterns):
- Files using `layout: (h: any, page: any)` from Inertia persistent layouts (15+ files use this pattern)
- Types from `generated.d.ts` that contain `any` from the `typescript-transformer` package
- Composables imported from `.js` files (e.g., `useSidebar`) that lack type declarations

If a file's issues are pre-existing (existed on dev before this branch), note it as "pre-existing, not introduced by this branch" but still flag it for future cleanup.

#### Configuration

| Check | Pass Criteria |
|-------|---------------|
| Env vars documented | New vars in `.env.example` |
| Feature flags set | Pennant flags configured |
| Migrations ready | Run and tested |

### Step 5: Present Gate Results

```markdown
## Gate 4: Code Quality Results

**Initiative**: [Name]
**Branch**: [branch-name]
**Date**: YYYY-MM-DD
**Status**: PASS / FAIL

### Automated Checks

| Check | Status | Output |
|-------|--------|--------|
| Tests | PASS/FAIL | X tests, Y assertions |
| Coverage | PASS/FAIL | XX% (min 80%) |
| Pint | PASS/FAIL | X files checked |
| Larastan | PASS/FAIL/SKIP | X errors |
| Console | PASS/FAIL | Clean / X errors |

### Acceptance Criteria: X/Y met

| Story | AC Count | Met | Status |
|-------|----------|-----|--------|
| US01: ... | 4 | 4 | PASS |
| US02: ... | 3 | 2 | FAIL |

### Laravel Best Practices: X/13 pass

[Checklist with pass/fail per item]

### Vue TypeScript: X/6 pass

[Checklist with pass/fail per item]

### Overall: PASS / FAIL
```

### Step 6: Fix Issues (if needed)

If any automated checks fail:

1. **Run `vendor/bin/pint`** to auto-fix linting
2. **Fix failing tests** — present the failures and offer to fix
3. **Add missing coverage** — identify untested code paths
4. **Re-run checks** after fixes

If AC or best practice checks fail:
1. Present specific gaps
2. Offer to fix inline
3. Re-run affected checks

### Step 7: Create PR (PASS only)

**Only if Gate 4 passes (or user uses `--force`):**

#### 7a: Check Git State

```bash
git status
git diff --stat dev...HEAD
git log --oneline dev...HEAD
```

#### 7b: Create PR

Use `gh pr create` with structured description:

```bash
gh pr create --title "[Epic Code] Brief description" --body "$(cat <<'EOF'
## Summary
- [Key change 1]
- [Key change 2]
- [Key change 3]

## Gate 4: Code Quality — PASS

### Automated Checks
- Tests: X passing, Y assertions
- Coverage: XX%
- Pint: Clean
- Larastan: Clean

### Acceptance Criteria
All [N] acceptance criteria from spec.md verified.

### QA Notes
**Test data**: [How to set up test data]
**Happy path**: [Steps to test the main flow]
**Edge cases**: [Key edge cases to verify]
**Feature flag**: [Flag name and how to toggle]

## Test plan
- [ ] [Test scenario 1]
- [ ] [Test scenario 2]
- [ ] [Test scenario 3]

Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

### Step 8: Transition Status (PASS only)

#### 8a: Update Linear

1. Read `linear_project_id` from `meta.yaml`
2. Update project status:
   ```
   mcp__linear__update_project(
     id: "<linear_project_id>",
     state: "QA"
   )
   ```
   **CRITICAL**: Use `state: "QA"` — this is the workspace-specific state name.

3. Post gate summary as comment:
   ```
   mcp__linear__create_comment(
     issueId: "<linear_project_id>",
     body: """
     ## Gate 4: Code Quality PASSED

     **Date**: YYYY-MM-DD
     **Branch**: [branch-name]
     **PR**: [PR URL]

     ### Summary
     - All tests passing (X tests, Y assertions)
     - Coverage: XX%
     - Linting clean (Pint)
     - All acceptance criteria verified
     - Laravel + Vue best practices confirmed

     ### QA Notes
     [Test data, happy path, edge cases from PR description]

     ### Next Step
     Ready for `/trilogy-qa` (QA Testing)
     """
   )
   ```

#### 8b: Update meta.yaml

Update `status` and append the `gates.dev` record. **Do not overwrite existing gate records** — only add the new `dev` key under `gates`:

```yaml
status: qa    # Changed from 'in progress'
gates:
  idea:        # preserved from Gate 0
    passed: true
    date: YYYY-MM-DD
    notes: "..."
  spec:         # preserved from Gate 1
    passed: true
    date: YYYY-MM-DD
    notes: "..."
  design:       # preserved from Gate 2
    passed: true
    date: YYYY-MM-DD
    notes: "..."
  dev:          # added now
    passed: true
    date: YYYY-MM-DD
    pr: "[PR URL from step 7b]"
    notes: "[X tests passing, XX% coverage, all AC verified]"
```

#### 8c: Verify

1. Confirm PR was created and URL is available
2. Confirm Linear was updated to QA state
3. Confirm gate comment was posted

### Step 9: Report Completion

```markdown
## Gate 4: Code Quality Complete

**Status**: PASS
**PR**: [PR URL]
**Linear**: Updated to "QA" — [Linear URL]

### What Was Validated
- X tests passing, XX% coverage
- Linting clean, static analysis clean
- All acceptance criteria from spec.md verified
- Laravel and Vue best practices confirmed
- QA notes included in PR description

### Artifacts
- PR — [URL]
- spec.md — [path]
- plan.md — [path]
- meta.yaml — [path]

### What Happens Next

The PR is ready for QA testing. The QA tester should:

1. **Review PR description** for test data setup and QA notes
2. **Deploy to staging** or test locally
3. **Run through acceptance criteria** from spec.md
4. **Cross-browser test** (Chrome, Safari, Firefox)
5. **Run `/trilogy-qa`** when QA testing is complete (Gate 5: QA → Review)
```

## Options

| Flag | Description |
|------|-------------|
| `--check` | Run gate checklist only, no PR creation or Linear transition |
| `--force` | Proceed even if gate fails (document gaps, create PR anyway) |

## Failure Handling

If Gate 4 fails:

1. **Auto-fix what's possible** — Run Pint, fix obvious test failures
2. **List specific gaps** — Which checks failed and why
3. **Suggest remediation** — Fix tests, add coverage, address AC gaps

```markdown
## Gate 4: FAIL

### Gaps Identified

| Check | Status | Gap | Remediation |
|-------|--------|-----|-------------|
| Tests | FAIL | 3 tests failing | Fix test assertions |
| Coverage | FAIL | 65% (need 80%) | Add tests for [uncovered paths] |
| AC | FAIL | US02 AC3 not implemented | Implement edge case |

### Options

1. **Fix now** — I'll fix the failing tests and missing coverage
2. **Fix manually** — Review the gaps and fix yourself
3. **Force pass** — Use `--force` to create PR anyway (gaps documented in PR description)
```

## Integration

| Before | After |
|--------|-------|
| Implementation | `/trilogy-qa` |
| Gate 3 (Architecture) | Gate 5 (QA) |

## Full Gate Lifecycle

| Gate | Skill | Linear Transition | meta.yaml |
|------|-------|-------------------|-----------|
| Gate 0: Idea | `/trilogy-idea-handover` | Create → **Backlog** | `backlog` |
| Gate 1: Spec | `/trilogy-spec-handover` | Backlog → **Design** | `design` |
| Gate 2: Design | `/trilogy-design-handover` | Design → **Dev** | `in progress` |
| Gate 3: Architecture | `/speckit-plan` | *(stays in Dev)* | *(no change)* |
| **Gate 4: Code Quality** | **`/trilogy-dev-handover`** | **Dev → QA** | *(updated)* |
| Gate 5: QA | `/trilogy-qa` | QA → **Review** | *(updated)* |
| Gate 6: Release | *Release Agent* | Review → **Completed** | `completed` |
