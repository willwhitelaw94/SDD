---
name: trilogy-dev-review
description: Review PR code quality against Laravel best practices. Analyzes changed files, identifies anti-patterns, and provides educational feedback for developers. Use during PR review process. Triggers on: review pr, check code quality, pr review, code review.
---

# Trilogy Review Skill

Comprehensive PR review that checks code quality against the Architecture Gate (Gate 3) and Code Quality Gate (Gate 4).

## Purpose

This skill provides:
1. **Automated Review** - Check all changed files against best practices
2. **Educational Feedback** - Explain WHY patterns are problems and HOW to fix them
3. **Quantified Analysis** - Measure PR size, complexity, and quality
4. **Actionable Summary** - Clear list of required changes with references

Perfect for PR reviews to ensure junior/intermediate developers understand best practices.

## When to Use

```bash
/trilogy-dev-review              # Review current checked-out PR
/trilogy-dev-review --summary    # Just show summary (no detailed analysis)
/trilogy-dev-review --verbose    # Include all files, even those passing
```

## Execution Flow

### 1. Identify PR Changes

```bash
# Get the base branch (usually main or dev)
git remote update 2>/dev/null
BASE_BRANCH=$(git rev-parse --abbrev-ref HEAD@{upstream} 2>/dev/null | sed 's|.*/||')

# If that fails, try common branch names
if [ -z "$BASE_BRANCH" ]; then
    if git show-ref --verify --quiet refs/remotes/origin/dev; then
        BASE_BRANCH="dev"
    elif git show-ref --verify --quiet refs/remotes/origin/main; then
        BASE_BRANCH="main"
    else
        BASE_BRANCH="master"
    fi
fi

# Get changed files
git diff --name-only origin/$BASE_BRANCH...HEAD 2>/dev/null

# Get diff stats
git diff --stat origin/$BASE_BRANCH...HEAD 2>/dev/null

# Get line counts (FIX: proper awk syntax)
git diff --numstat origin/$BASE_BRANCH...HEAD 2>/dev/null | awk '{added+=$1; removed+=$2} END {print "Added: " added "\nRemoved: " removed}'

# Get commit count
git log --oneline origin/$BASE_BRANCH...HEAD 2>/dev/null | wc -l
```

### 2. Load Review Criteria from Gates

**Before analyzing any files, read the gate files to load the current checks, red flags, and best practice examples.** These are the single source of truth — do not use hardcoded checks.

Read the following files:
- `.tc-wow/gates/03-architecture.md` — Section 5 ("Laravel & Cross-Platform Best Practices") for all check criteria, the "Red Flags" list for auto-fail items, and the "Detailed" best practice sections (1-14) for examples and rationale
- `.tc-wow/gates/04-code-quality.md` — For code quality checks, Vue TypeScript best practices, and the approval checklist

Use the checks table, red flags list, and detailed sections from these files to evaluate the PR. When reporting violations, reference the specific gate section (e.g., "Architecture Gate 3, Section 2 — No Magic Numbers/IDs").

### 3. Analyze Changed Files

For each changed file in the PR diff, evaluate against the loaded gate criteria:

- **PHP files** (Controllers, Models, Actions, Data Classes, Migrations, Policies) — check against Gate 3 Section 5 checks and red flags
- **Vue files** (.vue) — check against Gate 3 (no hardcoded business logic, pure common components) and Gate 4 Vue TypeScript best practices
- **Route files** (routes/*.php) — check for model route binding
- **Migration files** — check for schema-only (no data operations)

### 4. Calculate PR Metrics

```bash
# Lines changed
LINES_ADDED=$(git diff --numstat origin/$BASE_BRANCH...HEAD | awk '{sum+=$1} END {print sum}')
LINES_REMOVED=$(git diff --numstat origin/$BASE_BRANCH...HEAD | awk '{sum+=$2} END {print sum}')

# Files changed
FILES_CHANGED=$(git diff --name-only origin/$BASE_BRANCH...HEAD | wc -l)

# Commits
COMMITS=$(git log --oneline origin/$BASE_BRANCH...HEAD | wc -l)
```

### 5. Generate Educational Review

For each violation found, provide:

1. **What**: Describe the anti-pattern
2. **Where**: File and line number reference
3. **Why**: Explain why it's a problem (use the rationale from the gate's detailed section)
4. **How**: Show the correct pattern (use the good example from the gate's detailed section)
5. **Reference**: Link to the specific gate section

**Example Violation Report:**

```markdown
### Violation: Magic Number IDs

**File**: `app/Http/Controllers/ContactController.php:42`

**What Found**:
```php
$documents = Document::whereIn('id', [1, 3, 7])->get();
```

**Why This Is a Problem**:
Magic IDs assume database IDs are consistent across environments. In dev, ID 1 might be "EPOA" but in production ID 1 could be something completely different. This causes bugs that only appear in specific environments.

**How to Fix**:
Use semantic constants on the Model instead:

```php
// In app/Models/Document.php
class Document extends Model
{
    /** Enduring Power of Attorney document type */
    public const ID_EPOA = 'epoa';

    /** Photo identification document type */
    public const ID_PHOTO_ID = 'photo_id';
}

// In controller
$documents = Document::whereIn('slug', [
    Document::ID_EPOA,
    Document::ID_PHOTO_ID,
])->get();
```

**Reference**: Architecture Gate 3, Section 2 - "No Magic Numbers/IDs"
```

### 6. Save Review to File

All review output should be saved to a markdown file for easy copying to GitHub PR comments:

```bash
# Create review output file
REVIEW_FILE=".reviews/pr-review-$(date +%Y%m%d-%H%M%S).md"
mkdir -p .reviews

# Write review content to file
cat > "$REVIEW_FILE" << 'EOF'
[Review content here]
EOF

echo "Review saved to: $REVIEW_FILE"
echo "Copy this file's contents to your GitHub PR comment"
```

**Important**:
- Save to `.reviews/` directory (add to `.gitignore`)
- Use timestamped filename for tracking
- Display file path to user at the end
- Suggest copying to GitHub PR

### 7. Generate Summary Report

The report saved to file should follow this structure. Use the checklist items from Gate 3's output template and Gate 4's output template — do not maintain a separate checklist here.

```markdown
## PR Review Summary

**PR**: #123 - Add contact document validation
**Author**: @developer
**Files Changed**: 12 files
**Lines**: +284 / -67
**Commits**: 8

---

## Quality Metrics

| Metric | Value | Status |
|--------|-------|--------|
| Files Changed | 12 | Large PR |
| Lines Added | 284 | Reasonable |
| Lines Removed | 67 | Good |
| Violations Found | 7 | Needs Work |
| Tests Added | 3 | Good |

---

## Violations Found

### Critical Issues (Must Fix)

[List each violation with file, line, description, and gate reference]

---

## Warnings (Non-Critical)

[List warnings — e.g., large PR size, missing optional docs]

---

## What's Good

[Highlight positive patterns found in the PR]

---

## Required Changes

[For each violation, provide Priority, Files, Action steps, Why, and Reference to specific gate section]

---

## Approval Checklist

[Pull the checklist from Gate 3 and Gate 4 output templates — only include items relevant to the files changed in this PR]

---

## Next Steps for Developer

1. Address all **Critical Issues** first
2. Run `vendor/bin/pint --dirty` to format code
3. Run tests to ensure changes don't break functionality
4. Push updates and re-request review

---

*Review generated by [Claude Code](https://claude.ai/claude-code) using Trilogy Care WoW gates*
```

## Output Levels

### Summary Mode (`--summary`)
- PR metrics only
- Violation count by type
- Pass/fail status
- **Saved to**: `.reviews/pr-review-summary-[timestamp].md`

### Standard Mode (default)
- All violations with examples
- Educational explanations
- Fix instructions
- Approval checklist
- **Saved to**: `.reviews/pr-review-[timestamp].md`

### Verbose Mode (`--verbose`)
- All changed files analyzed
- Files passing checks (green checkmarks)
- Detailed metrics per file
- Full diff context
- **Saved to**: `.reviews/pr-review-verbose-[timestamp].md`

## Review File Output

**All reviews are automatically saved to markdown files:**

```
.reviews/
├── pr-review-20240203-183000.md       # Standard review
├── pr-review-summary-20240203-183015.md  # Summary only
└── pr-review-verbose-20240203-183030.md  # Verbose review
```

**After review completes:**
1. File path is displayed to user
2. User can copy contents to GitHub PR comment
3. File is preserved for reference
4. Add `.reviews/` to `.gitignore` to avoid committing

**Note**: Always display the file path at the end:
```
Review complete!
Review saved to: .reviews/pr-review-20240203-183000.md

Copy the contents of this file to your GitHub PR comment.
```

## Integration with Workflow

```
Developer creates PR
    ↓
Reviewer runs /trilogy-dev-review
    ↓
Issues found? → Developer fixes → Re-review
    ↓
All checks pass → Approve PR → Merge
```

## Educational Focus

This skill is designed to **teach** developers, not just flag issues. Every violation includes:

- **Context**: Why this pattern exists (from the gate's detailed section)
- **Consequences**: What goes wrong if not fixed
- **Solution**: Exact code to write (from the gate's good/bad examples)
- **Reasoning**: Underlying principles

Perfect for onboarding junior/intermediate developers to Laravel and cross-platform best practices.
