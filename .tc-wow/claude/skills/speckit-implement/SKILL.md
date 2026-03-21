---
name: speckit-implement
description: Execute implementation following task plan. Use when ready to write code, implementing features, or executing tasks.md. Triggers on: implement, start coding, execute plan, build feature.
---

# SpecKit Implement Skill

Execute implementation following the task plan from tasks.md.

## Step 1: Ask About Execution Mode

**IMPORTANT**: Before starting implementation, ask the user which mode they want:

```
How would you like to run implementation?

1. **Standard Mode** - Interactive with review after each task
2. **Ralph Mode** - Autonomous until all tasks complete (requires tests)
```

Use AskUserQuestion with these options:
- **Standard (Recommended)** - "I'll implement tasks one by one, pausing for your review"
- **Ralph Mode** - "I'll loop autonomously until done or blocked (best for well-tested tasks)"

## Execution Modes

### Standard Mode (default)
Interactive implementation with user oversight. Claude executes tasks and reports progress, pausing for feedback.

### Ralph Mode (autonomous)
Autonomous iterative execution using the Ralph Wiggum technique. Claude loops continuously until all tasks complete or max iterations reached.

**Ralph Mode Behavior**:
- Executes tasks iteratively without user intervention
- Self-corrects based on test failures
- Reads tasks.md each iteration to find next `[ ]` task
- Marks tasks `[X]` as completed
- Exits when: all tasks done, tests pass, or max iterations reached
- Outputs `<promise>IMPLEMENTATION_COMPLETE</promise>` on success

**When to use Ralph Mode**:
- Well-defined tasks with clear success criteria (tests)
- Greenfield features where you can walk away
- Overnight/background execution
- Tasks with automatic verification

**When NOT to use Ralph Mode**:
- Tasks requiring design decisions or human judgment
- Complex refactoring with unclear boundaries
- Production debugging

## Step 1b: Branch Safety Check

**IMPORTANT**: Before writing any code, check the current git branch:

```bash
git branch --show-current
```

**Protected branches**: `dev`, `main`, `master`, `staging`, `production`

**If on a protected branch**:
1. Determine the feature branch name from the epic context (e.g., `feature/epic-slug` from the tasks.md path)
2. Ask the user to confirm the branch name using AskUserQuestion:
   - **Create `feature/<epic-slug>`** (Recommended) - "Branch off the current branch with the suggested name"
   - **Custom name** - "I'll specify a different branch name"
3. Create and checkout the branch: `git checkout -b <branch-name>`

**If already on a feature branch**: Proceed — no action needed.

## Step 2: Epic Detection & Routing

In a new chat, **identify the epic context FIRST**:

### Check for Existing Tasks

```bash
find .tc-docs/content/initiatives -name "tasks.md" -type f 2>/dev/null | sort
```

**If tasks.md exists**: Load tasks and proceed to implementation
**If no tasks.md found**: Ask user to generate tasks first using `/speckit.tasks`

## Step 2b: Linear Integration Check

After loading tasks.md, check if tasks are synced to Linear:

1. **Check for meta.yaml** in the epic folder
2. Look for `linear_synced: true` or `tasks:` section with Linear identifiers

**If tasks are synced to Linear**, ask the user:

```
I see these tasks are synced to Linear. Would you like me to automatically update Linear status as I work?

1. **Yes, update Linear automatically** - Mark tasks "In Progress" when starting, "Done" when complete
2. **No, I'll manage Linear myself** - Just update local tasks.md
```

Use AskUserQuestion with these options:
- **Yes, sync status (Recommended)** - "Automatically update Linear issue status as I implement"
- **No, local only** - "I'll update Linear status manually"

**Store the choice** for use during implementation:
- If yes: Set `linear_auto_update: true` in session context
- If no: Set `linear_auto_update: false`

**If tasks are NOT synced to Linear**, skip this step and proceed with local-only mode.

## Step 3: Execute Implementation

1. Run `.tc-wow/scripts/bash/check-prerequisites.sh --json --require-tasks --include-tasks` from repo root. Parse FEATURE_DIR and AVAILABLE_DOCS.

2. **Check checklists status** (if FEATURE_DIR/checklists/ exists):
   - Scan all checklist files
   - Count Total/Completed/Incomplete items
   - If any checklist incomplete: STOP and ask user to confirm proceeding

3. **Load implementation context**:
   - **REQUIRED**: tasks.md (task list and execution plan)
   - **REQUIRED**: technical-plan.md (tech stack, architecture, file structure)
   - **IF EXISTS**: data-model.md, contracts/, research.md, quickstart.md

4. **Project Setup Verification**:
   - Create/verify ignore files (.gitignore, .dockerignore, .eslintignore, etc.)
   - Check for technology-specific patterns

5. **Test-Driven Development** (IF test-technical-plan.md exists):
   - Write Unit Tests FIRST (tests/Unit/)
   - Write Feature Tests NEXT (tests/Feature/)
   - Write Browser Tests (tests/Browser/ - Nightwatch v1 or Dusk v8)
   - Run tests to verify FAIL (red)
   - Write implementation code to make tests PASS (green)
   - Refactor while keeping tests green

6. **Parse tasks.md structure**:
   - Task phases: Setup, Tests, Core, Integration, Polish
   - Task dependencies: Sequential vs parallel [P]
   - Task details: ID, description, file paths

7. **Execute implementation**:
   - **Phase-by-phase execution**: Complete each phase before moving to next
   - **Respect dependencies**: Sequential tasks in order, parallel tasks [P] together
   - **Follow TDD approach**: Execute test tasks before implementation tasks
   - **File-based coordination**: Tasks affecting same files run sequentially
   - **Validation checkpoints**: Verify each phase completion

8. **Progress tracking**:
   - Report progress after each completed task
   - **After each Phase, run tests** and report results
   - Halt execution if non-parallel task fails
   - For parallel tasks [P], continue with successful, report failed
   - **IMPORTANT**: Mark completed tasks as [X] in tasks.md
   - **Update context/PROGRESS.md** after each phase
   - **Linear status updates** (if `linear_auto_update: true`):
     - When starting a task: Update Linear issue to "In Progress" using `mcp__linear__update_issue`
     - When completing a task: Update Linear issue to "Done" using `mcp__linear__update_issue`
     - Look up Linear issue ID from meta.yaml tasks mapping by task ID (e.g., T001 → PLA-124)

9. **Test Results Recording** (IF test-technical-plan.md exists):
   ```markdown
   ## Phase [N] - Tests Completed
   ### Unit Tests: Status, Coverage, Tests Run
   ### Feature Tests: Status, Tests Run, Failed
   ### Browser Tests: Status, Tests Run, Failed
   ### Code Quality: Pint status
   ### Summary: Phase Status, All tests passing, Ready for next phase
   ```

10. **Completion validation**:
    - Verify all required tasks completed
    - Check implemented features match specification
    - Validate ALL tests pass (if tests exist)
    - Confirm implementation follows technical plan
    - **Update context/CONTEXT.md** with final summary
    - Report final status with summary

## Test Coverage Requirements (IF test-technical-plan.md exists)

- **Unit tests**: >= 80% coverage for business logic
- **Feature tests**: All HTTP endpoints and workflows
- **Browser tests**: All critical user journeys
- **Must pass**: All tests before marking phase complete

## Ralph Mode Execution

When user selects Ralph Mode:

### Ralph Loop Setup

1. **Set defaults**:
   - Max iterations: 50 (safety limit)
   - Completion promise: "IMPLEMENTATION_COMPLETE"

2. **Initialize Ralph context**:
   ```
   Create/update FEATURE_DIR/context/RALPH_STATE.md:
   - Iteration: 0
   - Started: [timestamp]
   - Max Iterations: [n]
   - Status: RUNNING
   ```

3. **Execute via /ralph-loop**:
   ```bash
   /ralph-loop "Execute implementation for [FEATURE_DIR].

   Each iteration:
   1. Read tasks.md - find first unchecked [ ] task
   2. Load technical-plan.md for architecture context
   3. [IF linear_auto_update] Update Linear issue to 'In Progress'
   4. Implement the task following existing patterns
   5. Run relevant tests (php artisan test --filter=...)
   6. If tests pass: mark task [X] in tasks.md
   7. [IF linear_auto_update] Update Linear issue to 'Done'
   8. If tests fail: fix and retry (same iteration)
   9. Run vendor/bin/pint --dirty
   10. Update RALPH_STATE.md with progress

   Exit conditions:
   - All tasks marked [X] → output <promise>IMPLEMENTATION_COMPLETE</promise>
   - Max iterations reached → output <promise>MAX_ITERATIONS_REACHED</promise>
   - Blocked (same task fails 3x) → output <promise>BLOCKED_NEED_HELP</promise>

   Current feature: [FEATURE_DIR]
   Linear auto-update: [true/false]
   " --max-iterations [n] --completion-promise "IMPLEMENTATION_COMPLETE"
   ```

### Ralph Progress Tracking

Update `RALPH_STATE.md` each iteration:
```markdown
# Ralph Execution State

## Current Status
- **Iteration**: 12 of 50
- **Current Task**: T015 - Create UserController
- **Tasks Completed**: 14 of 32
- **Tests Passing**: 47 of 47
- **Last Updated**: [timestamp]

## Iteration Log
| # | Task | Result | Duration |
|---|------|--------|----------|
| 1 | T001 | ✓ | 45s |
| 2 | T002 | ✓ | 1m 12s |
| ... |

## Blocked Tasks (if any)
- T008: Failed 3x - needs database migration fix
```

### Resuming Ralph

If interrupted, check for existing `RALPH_STATE.md` and ask user if they want to resume from last task.

## Linear Status Workflow

When `linear_auto_update: true` is set:

### Status Transitions

| Event | Linear Status | MCP Call |
|-------|---------------|----------|
| Starting task | In Progress | `mcp__linear__update_issue(id, state: "In Progress")` |
| Task completed | Done | `mcp__linear__update_issue(id, state: "Done")` |
| Task blocked | Blocked | `mcp__linear__update_issue(id, state: "Blocked")` |

### Finding Linear Issue IDs

Look up task Linear IDs from `meta.yaml`:

```yaml
tasks:
  - identifier: PLA-124      # Linear issue ID
    local_ref: T001          # Local task ID
    story_ref: US1
    state: Todo
```

When working on task T001:
1. Find matching entry in meta.yaml by `local_ref`
2. Extract `identifier` (e.g., PLA-124)
3. Use identifier in `mcp__linear__update_issue` calls

### Error Handling

If Linear update fails:
- Log the error but continue implementation
- Don't block task completion on Linear sync failures
- Report sync failures in completion summary

## Key Rules

- Assumes complete task breakdown exists in tasks.md
- If tasks incomplete, suggest running `/speckit-tasks` first
- Run `vendor/bin/pint --dirty` before finalizing PHP changes
- **Ralph Mode**: Uses 50 max iterations as safety limit
- **Ralph Mode**: Requires tests for self-correction feedback loop
- **Linear sync**: Optional - only updates if user opted in and tasks are synced

## Vue Composition Architecture (Implementation Rule)

When implementing Vue components, follow a **composition-based architecture**:

- **Slots over prop conditionals** — use slots for content/layout variation, not boolean props toggling render paths
- **Composables over embedded logic** — extract reusable reactive logic (filtering, validation, state) into composables that return typed objects
- **Single-responsibility primitives** — each small component does one thing and is independently testable
- **Consumer controls layout** — the parent assembles children via slots; children don't dictate layout via flags
- **No "god components"** — if a component has `variant`, `mode`, or 3+ boolean props changing what it renders, decompose it into composed primitives

This applies to all new component creation. When modifying existing components, refactor toward composition if the task scope naturally touches the relevant code.
