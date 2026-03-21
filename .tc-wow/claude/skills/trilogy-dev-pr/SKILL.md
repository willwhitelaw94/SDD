---
name: trilogy-dev-pr
description: Lint, type-check, test, review, and create PR. Use after implementation when ready to ship. Triggers on: create pr, pull request, ship code, dev gate, ready to merge.
---

# Trilogy Dev PR Skill

Prepare code for pull request by linting, type-checking, testing, reviewing, and creating the PR.

## Purpose

This skill handles the developer handover process:
1. **Lint & Format** - Run all linters and formatters to clean up code
2. **Simplify** - Apply cleanup patterns without changing behavior
3. **Commit Cleanup** - Commit any changes from linting/formatting/simplification
4. **Verify** - Run tests, type checks, static analysis, and build to confirm stability
5. **Dev Review** - Run `/trilogy-dev-review` for a thorough code review against gates
6. **PR Creation** - Create pull request targeting `dev`

## When to Use

```bash
/trilogy-dev-pr              # Full flow: lint + simplify + test + review + PR
/trilogy-dev-pr --simplify   # Just simplify code (no commit or PR)
```

## Execution Flow

### 1. Identify Changed Files

Build a **deduplicated list** of all files that differ from `dev`, combining committed, staged, and unstaged changes:

```bash
# Files committed on this branch vs dev
git diff --name-only dev...HEAD

# Staged files (ready to commit)
git diff --cached --name-only

# Unstaged modifications and untracked files
git diff --name-only
git ls-files --others --exclude-standard
```

Merge all four outputs into a single deduplicated list. This is the **changed file list** used by all subsequent steps. Categorise into PHP (`.php`) and Vue/TS (`.vue`, `.ts`, `.js`) for targeted work.

**If there are staged or unstaged changes:** Commit them first before proceeding so linting and verification run against a complete state.
```bash
git add [staged and unstaged changed files]
git commit -m "wip: stage uncommitted changes for PR"
```

### 2. Lint & Format

Run linters and formatters against the files changed on this branch:

```bash
# PHP formatting — pass the specific changed PHP files from step 1
# Use vendor/bin/pint [file1] [file2] ... for targeted formatting
# If no PHP files changed, skip this
vendor/bin/pint [changed PHP files from step 1]

# JS/Vue linting and auto-fix
npm run lint:fix
```

**If any linter produces errors that can't be auto-fixed:** attempt a quick manual fix. If it's not straightforward, note it and continue — the dev review will catch it later.

### 3. Code Simplification

Apply simplification patterns to changed **source files only** (`.php`, `.vue`, `.ts`, `.js`). Skip documentation, markdown, config, and other non-source files. Skip if files are already clean.

#### PHP Patterns

**Pattern 1: Reduce Nesting**
```php
// Before
if ($user) {
    if ($user->isActive()) {
        if ($user->hasPermission('edit')) {
            // do something
        }
    }
}

// After
if (!$user || !$user->isActive() || !$user->hasPermission('edit')) {
    return;
}
// do something
```

**Pattern 2: Remove Redundancy**
```php
// Before
if ($status === 'active') {
    return true;
} else {
    return false;
}

// After
return $status === 'active';
```

**Pattern 3: Prefer Laravel Helpers**
```php
// Before
if (isset($array['key']) && $array['key'] !== null) {
    $value = $array['key'];
} else {
    $value = 'default';
}

// After
$value = data_get($array, 'key', 'default');
```

#### Vue / TypeScript Patterns

**Pattern 4: Arrow Functions Only**
```typescript
// Before
function handleClick(event: MouseEvent): void {
    // ...
}

async function fetchData(): Promise<void> {
    // ...
}

// After
const handleClick = (event: MouseEvent): void => {
    // ...
}

const fetchData = async (): Promise<void> => {
    // ...
}
```

**Pattern 5: Named Type Declarations for Props/Emits**
```typescript
// Before
defineProps<{ title: string; count: number }>()
defineEmits<{ (e: 'update', value: string): void }>()

// After
type Props = {
    title: string
    count: number
}

type Emits = {
    update: [value: string]
}

defineProps<Props>()
defineEmits<Emits>()
```

**Pattern 6: Remove Template Comments**
```vue
<!-- Before -->
<template>
    <!-- Header Section -->
    <div class="header">...</div>
    <!-- Content Section -->
    <div class="content">...</div>
</template>

<!-- After: extract into named components instead -->
<template>
    <Header />
    <Content />
</template>
```

**Pattern 7: Omit Braces for Single-Line Statements**
```typescript
// Before
if (isLoading) {
    return
}

// After
if (isLoading) return
```

**Pattern 8: Explicit Return Types on Computed Properties**
```typescript
// Before
const fullName = computed(() => `${first.value} ${last.value}`)

// After
const fullName = computed((): string => `${first.value} ${last.value}`)
```

**If `--simplify` flag was passed:** Stop here after simplification.

### 4. Commit Cleanup

If steps 2-3 produced any file changes, commit them:

```bash
# Rerun formatters one final time to catch anything simplification introduced
vendor/bin/pint [changed PHP files from step 1]
npm run lint:fix

# Check if there are changes to commit
git status --short
```

**If there are changes:**
```bash
# Stage only tracked files that were modified — do NOT use git add -A
# Use git add with specific file paths to avoid staging unrelated files
git add [list of changed files from git status]
git commit -m "chore: lint, format, and simplify code for PR"
```

**If no changes:** Skip this step — code was already clean.

### 5. Verify

Run all checks to confirm the codebase is stable after cleanup. **All of these must pass before proceeding.**

```bash
# Tests with coverage in a single pass
php artisan test --compact --coverage --min=80

# TypeScript type checking
npm run type-check

# PHP static analysis
vendor/bin/phpstan analyse --memory-limit=2G

# Frontend build (if Vue/TS/CSS files were changed)
npm run build
```

**If any check fails:**
1. Fix the issue
2. Rerun linters (`vendor/bin/pint [affected files]`, `npm run lint:fix`)
3. Stage specific files and commit the fix: `git commit -m "fix: [what was fixed]"`
4. Rerun the failing check to confirm it passes now
5. Do NOT proceed until all checks are green

**Maximum 3 fix attempts.** If checks still fail after 3 rounds of fixes, stop and present the remaining failures to the user. Ask: "Verification failed after 3 fix attempts. Do you want to proceed with the PR anyway (failures will be listed as known issues), or stop here to fix manually?" If the user wants to proceed, continue to step 6 (dev review) and note the failures in the PR description under a "Known Issues" section.

### 6. Run Dev Review

Once the codebase is stable (all linters pass, types check, tests green), run the thorough review:

Run `/trilogy-dev-review` which checks all changed files against Gate 3 (Architecture) and Gate 4 (Code Quality) from `.tc-wow/gates/04-code-quality.md`.

**If the review returns CRITICAL or IMPORTANT issues:**
- Present the issues to the user with a clear summary
- Ask the user: "The dev review found [N] critical/important issues. Do you want to fix these before creating the PR, or proceed anyway?"
- **If the user wants to fix:** Address the issues, commit fixes, rerun verification (step 5), then rerun `/trilogy-dev-review`. **Maximum 2 review cycles** — if issues persist after 2 rounds, report them and ask the user whether to proceed or stop.
- **If the user wants to proceed:** Continue to PR creation, noting the unresolved issues in the PR description under a "Known Issues" section

**If the review is clean:** Proceed directly to PR creation.

### 7. Create Pull Request

Push the branch and create PR targeting the `dev` branch:

```bash
# Push current branch to remote
git push -u origin HEAD

# Use real values from step 5 output — never use placeholder numbers
gh pr create --base dev --title "feat: [description from branch/commits]" --body "$(cat <<'EOF'
## Summary
- [1-3 bullet points of what changed — derived from commits]

## Dev Gate
- Tests: [X/X] passed
- Coverage: [X]%
- Pint: Clean
- PHPStan: Clean
- ESLint: Clean
- TypeScript: Clean
- Build: Success

## Dev Review
- [PASS or list of acknowledged issues]

## Test Plan
- [How to test this change]

## Acceptance Criteria
- [x] [AC from spec, if available]

---
Generated with [Claude Code](https://claude.ai/claude-code)
EOF
)"
```

**Important:** All values in the PR body (test count, coverage percentage, etc.) MUST come from actual command output. Never use placeholder or example numbers.

## Simplification Principles

**DO:**
- Simplify without changing behavior
- Follow existing code conventions
- Add type hints and return types
- Apply Vue/TS patterns from Gate 4 checklist

**DON'T:**
- Add new features or functionality
- Change business logic
- Over-abstract (no helpers for one-time use)
- Refactor unrelated code
- Touch files that aren't part of this branch's changes

## Integration with Workflow

```
/speckit-implement    → Write code
/trilogy-dev-pr       → Lint + Simplify + Test + Review + PR (→ dev)
                      → QA Testing (human)
/trilogy-qa           → Generate QA test report
/trilogy-ship         → Deploy to production
```

## Output

On success:
```
## PR Ready

**Checks**: All passing
**Dev Review**: PASS
**PR Created**: [actual PR URL from gh output]

### Summary
- Linted and formatted [N] files
- Simplified [N] files
- All [X/X] tests passing
- Coverage: [X]%
- TypeScript: Clean
- PHPStan: Clean
- Ready for QA testing
```

On failure (checks, after 3 fix attempts — user chose to stop):
```
## Checks Failed

**Status**: FAIL
**Fix Attempts**: 3/3 exhausted
**Blocking Issues**:
1. [Actual failing test names or type errors]
2. [Actual coverage gap or lint errors]

**Action Required**: Manual intervention needed before creating PR
```

On failure (checks, after 3 fix attempts — user chose to proceed):
```
## PR Created With Known Failures

**Checks**: [N] failing
**Dev Review**: [PASS or N issues acknowledged]
**PR Created**: [actual PR URL]

### Known Failures
- [Actual failing checks from verification]

### Summary
- All other checks passing
- User acknowledged failures — see PR description
```

On failure (review, user chose to proceed):
```
## PR Created With Known Issues

**Checks**: All passing
**Dev Review**: [N] issues acknowledged
**PR Created**: [actual PR URL]

### Known Issues
- [Issue descriptions from dev review]

### Summary
- All [X/X] tests passing
- Coverage: [X]%
- User acknowledged review issues — see PR description
```
