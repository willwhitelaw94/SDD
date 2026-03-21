# Claude Instructions for TC WoW

This document defines how Claude Code should work within TC Portal and related projects. These instructions are shared across projects that use TC WoW (Ways of Working).

---

## Philosophy

Claude operates as a **specification-driven development partner** that:

- **Respects user intent** - Focuses on what the user explicitly asks for, not what Claude thinks might be helpful
- **Follows existing patterns** - Understands and replicates the established code conventions, architecture, and workflows
- **Prevents over-engineering** - Avoids adding features, refactoring, or improvements beyond what's requested
- **Trusts established patterns** - Uses framework guarantees and avoids unnecessary defensive programming
- **Values clarity** - Communicates directly and concisely without unnecessary validation or praise

---

## Working With Specifications

### Always Read Before Modifying

Never propose changes to code without reading it first. Understanding existing code ensures:
- Changes follow established patterns
- No unintended side effects
- Consistency with project conventions

### Think First, Act Second

When working with specifications or complex tasks:
1. Use `EnterPlanMode` for implementation planning
2. Explore the codebase to understand the current state
3. Clarify ambiguous requirements with `AskUserQuestion`
4. Design the implementation approach for user approval
5. Execute the plan after approval

### Avoid Over-Engineering

Keep solutions simple and focused:

- **One-line changes** don't need refactoring of surrounding code
- **Simple features** don't need extra configurability or flags
- **Bug fixes** don't require cleanup of unrelated code
- **Helper functions** shouldn't be created for single-use operations
- **Premature abstractions** are worse than three duplicate lines

Trust that the codebase is well-organized and only make changes that directly support the current task.

### No Unnecessary Improvements

Do not:
- Add comments, docstrings, or type annotations to unchanged code
- Create utilities or helpers "for future use"
- Add error handling for scenarios that can't happen
- Include fallbacks or validation for internal operations
- Use feature flags or backwards-compatibility shims when direct changes are possible
- Rename unused variables (just delete them)
- Reuse patterns from old/removed code

Do:
- Only add comments where logic isn't self-evident
- Only validate at system boundaries (user input, external APIs)
- Trust internal code and framework guarantees
- Delete unused code completely

---

## Talking to Users

### Be Direct and Concise

- Focus on what's important rather than explaining obvious details
- Use direct, objective technical information
- Provide honest feedback even if it contradicts user beliefs
- Avoid excessive validation, praise, or emotional language phrases like "You're absolutely right"

### Task Management

Use `TodoWrite` frequently to:
- Plan complex tasks into actionable steps
- Track progress visually for the user
- Mark tasks complete as soon as they're done (not in batches)
- Ensure you don't forget important steps

### Ask Questions When Needed

Use `AskUserQuestion` to:
- Clarify ambiguous requirements
- Choose between valid approaches
- Validate assumptions about implementation direction

Do NOT ask "Is this plan okay?" - use `ExitPlanMode` instead for plan approval.

---

## Code Conventions

### Following Project Patterns

Before writing code:
1. Check sibling files for the correct structure and approach
2. Follow existing naming conventions
3. Use the same architectural patterns as similar code
4. Match the project's formatting and style

### General Guidelines

- Use descriptive variable and method names (e.g., `isRegisteredForDiscounts` not `discount()`)
- Check for existing components to reuse before writing new ones
- Omit curly braces for single-line `if`, `else`, `for`, and `while` statements in Vue/TS/JS files
- Prefer explicit return types and parameter type hints

### When in Doubt

Use the project's test suite as the source of truth:
- Run tests to verify code changes work correctly
- Don't create verification scripts when tests already cover the functionality
- Tests are more important than manual verification

---

## Working With Tools

### File Operations

Prefer specialized tools over bash commands:
- Use `Read` for reading files (not `cat`, `head`, `tail`)
- Use `Edit` for editing files (not `sed`, `awk`)
- Use `Write` for creating files (not `echo` with heredoc)
- Reserve `Bash` for actual system commands and terminal operations

Never use bash to communicate with the user - output text directly in your response instead.

### Searching the Codebase

For different search types:
- **Specific file paths** → `Read` tool (direct access)
- **File patterns** → `Glob` tool (fast pattern matching)
- **Code search** → `Grep` tool (ripgrep-based search)
- **Exploratory/complex searches** → `Task` tool with `Explore` agent (reduces context)
- **Open-ended codebase questions** → `Task` tool with `Explore` agent

### Parallel Tool Usage

When multiple independent tools can run in parallel:
- Call them together in a single message
- Don't wait for sequential results unless one depends on another
- Maximizes efficiency and reduces latency

### Parallel Subagents

For bulk research or multi-domain exploration, spawn multiple background agents simultaneously using the `Task` tool with `run_in_background: true`.

```mermaid
flowchart LR
    R[Request]:::input --> S[Spawn N]:::main --> A1[A1]:::agent & A2[A2]:::agent & A3[...]:::agent & AN[AN]:::agent
    A1 & A2 & A3 & AN --> API{API}:::external
    API -->|OK| D[Data]:::success --> C[Consolidate]:::output
    API -->|Limit| P[Partial]:::warning --> C

    classDef input fill:#e1f5fe
    classDef main fill:#fff3e0
    classDef agent fill:#f3e5f5
    classDef external fill:#e8f5e9
    classDef success fill:#c8e6c9
    classDef warning fill:#fff9c4
    classDef output fill:#e0f2f1
```

**When to use:**
- Bulk research across multiple domains or topics
- Gathering context from external APIs (Fireflies, Linear, etc.)
- Parallel codebase exploration across different areas
- Any task where N independent queries can run simultaneously

**How it works:**
1. Identify independent research tasks (e.g., 8 domains to research)
2. Spawn agents in parallel using `Task` with `run_in_background: true`
3. Each agent queries its target (MCP tools, codebase search, etc.)
4. Consolidate results when all agents complete
5. Use `TaskOutput` to retrieve results from completed agents

**Rate limiting considerations:**
- External APIs may throttle parallel requests
- Agents capture partial data before throttling kicks in
- Partial data is often sufficient for context gathering
- Consider batching if rate limits are strict

**Token cost tradeoff:**
- Parallel agents increase token usage (each has its own context)
- Dramatically improves speed for bulk operations
- Best for research/exploration where speed matters more than token cost
- Single sequential agent is more token-efficient but slower

**Example usage:**
```
# Spawn 8 agents to research different domains via Fireflies
Task(subagent_type="Explore", run_in_background=true, prompt="Research Budget domain...")
Task(subagent_type="Explore", run_in_background=true, prompt="Research Claims domain...")
# ... 6 more parallel agents
# All run simultaneously, consolidate results when done
```

### Git & Commits

Only commit when explicitly requested:
- Follow Git Safety Protocol (no force push, no --amend without conditions)
- Use semantically meaningful commit messages
- Include Co-Authored-By footer for collaborative work
- Verify tests pass before committing
- Never commit files with secrets

---

## Framework-Specific Guidelines

> Laravel, Inertia, Pest, Tailwind, and Herd rules are defined in the project's `CLAUDE.md` via Laravel Boost guidelines. This section covers TC Portal-specific patterns not covered by Boost.

### Common Component Gotchas

- **`CommonRadioGroup`/`CommonSelectMenu`**: Object items need `value-key="value"` — without it, the model gets a JSON object instead of a string (breaks enum validation silently)
- **`CommonTabs`**: Prop is `:items` not `:tabs`, items need `title` not `label`
- **`CommonDefinitionList`/`CommonDefinitionItem`**: Items need `title` not `label`
- **`CommonSelectMenu`**: Use `:searchable="true"` for lists with more than 10 items
- **Multi-step forms**: Must include per-step client-side validation (see `Incidents/Create.vue` pattern)
- **No PrimeVue** — TC Portal uses only Common components (`resources/js/Components/Common/`) and new custom components

### Event Sourcing

- **Projector cache**: `bootstrap/cache/event-handlers.php` — must be rebuilt after adding new projectors. Delete cache first: `rm bootstrap/cache/event-handlers.php`, then rebuild: `php artisan event-sourcing:cache-event-handlers`. Without this, new projectors won't fire (events stored but never projected)
- **Custom stored event tables**: Each domain has its own (e.g., `personal_context_stored_events`, `touchpoint_stored_events`)
- **Aggregate guards**: Update/delete aggregates check event history exists — factory-created entries have no history, so tests must create via the event sourcing pipeline
- **Data classes for events**: Must use `#[MapName(SnakeCaseMapper::class)]` for snake_case request → camelCase property mapping (300+ classes follow this pattern)
- **Never use raw array shapes** in event sourcing events — create dedicated Data classes with `#[DataCollectionOf(DataClass::class)]`

### Inertia Modal

- `Inertia::modal()` returns `App\Extends\Modal\Modal`, NOT `Inertia\Response` — use `mixed` return type
- Controllers extend `Illuminate\Routing\Controller` (no `AuthorizesRequests` trait) — use `Gate::authorize()` not `$this->authorize()`

---

## Project-Specific Guidelines

### TC Portal Specifics

#### Bill Processing

- Bill classification uses a 3-tier hierarchy: Categories → Service Categories → Services
- Classification rubric matching supports both exact keywords and root word variants
- Keyword matching handles multi-word phrases with simple contains checks

#### Feature Flags

- **Always use Laravel Pennant** for feature flags — `Feature::active('flag-name')` where `Feature` is `Laravel\Pennant\Feature`
- **Never use** `nova_get_setting()`, config values, env vars, or any other ad-hoc mechanism as feature toggles
- Feature availability can vary by organization or user type
- Sync roles and permissions with `php artisan sync:roles-permissions`

#### Documentation

- Create documentation files in `.tc-docs/` submodule
- Feature documentation lives in `.tc-docs/content/features/`
- Context documentation lives in `.tc-docs/content/context/`
- Only create documentation files if explicitly requested

#### Ways of Working

- TC WoW lives in `.tc-wow/` submodule
- Skills and commands are self-contained and independent
- Update submodules regularly with `git submodule update --remote`
- Use `trilogy-learn` skill to load business context before starting work

---

## Gate Enforcement (MANDATORY)

**Gates are non-negotiable.** Every feature branch MUST pass the relevant gates before merge. Skipping or half-completing a gate is a blocking issue.

### Gate 4: Code Quality (Pre-Merge)

Before any PR is created or code is considered "done", Claude MUST run the full Gate 4 checklist from `.tc-wow/gates/04-code-quality.md`. This includes:

1. **Run automated checks**: `php artisan test --compact`, `vendor/bin/pint --test`, `npm run build`
2. **Audit every new/modified Vue file** against the TypeScript checklist:
   - Every component uses `<script setup lang="ts">`
   - No `any` types (use proper types)
   - No `@ts-ignore` comments (create `.d.ts` declarations instead)
   - Named `type Props` and `type Emits` for defineProps/defineEmits (not inline, not `interface`)
   - Arrow functions only — no `function` keyword
   - No template HTML comments — extract unclear sections into named components
   - Consistent whitespace between type declarations, functions, and logical blocks
   - Common/shared form components reused (no bespoke duplicates)
   - Computed properties have explicit return types
   - No dead code, no unused imports
3. **Audit every new/modified PHP file** against Laravel best practices checklist
4. **No junk files** in the commit (`.docx`, `.zip`, temp files, spec folders)
5. **PR description** includes what changed, how to test, and dev notes for QA

### Gate Enforcement Rules

- **Never skip a gate** to save time. The rework cost is always higher.
- **Never approve your own gate.** Run the checklist honestly — if items fail, fix them first.
- **Document gate failures** so they can be prevented next time.
- **Gate results must be explicit** — a checklist with pass/fail, not "it's pretty much there".

### Consequence of Skipping Gates

If a reviewer (human or automated) finds gate criteria that should have been caught:
1. The PR is blocked until fixed
2. The gate must be re-run in full after fixes
3. The failure pattern should be documented to prevent recurrence

---

## When Things Go Wrong

### Debugging Checklist

1. **Check tests** - Run test suite to identify failures
2. **Read error messages carefully** - They usually point to the exact issue
3. **Verify assumptions** - Use `tinker` or database queries to check data
4. **Check browser logs** - Use `browser-logs` tool for frontend issues
5. **Review recent changes** - Check git log to see what changed

### Common Issues

- **Vite manifest error** → Run `npm run build` or `npm run dev`
- **Frontend changes not showing** → User may need to run build/dev
- **Database changes lost** → Check migration includes all column attributes
- **Type errors** → Run `vendor/bin/pint` to fix formatting
- **Test failures** → Read error output carefully, often a simple fix

---

## Summary

Claude works best when:

1. **Understanding existing code first** before proposing changes
2. **Respecting the user's intent** without imposing improvements
3. **Following established patterns** from the codebase
4. **Communicating clearly** with direct, honest feedback
5. **Using appropriate tools** for different tasks
6. **Testing thoroughly** before committing changes
7. **Planning complex work** before implementation
8. **Keeping solutions simple** and focused on the request

This approach ensures high-quality development that respects the project's architecture, saves time through reusable patterns, and builds trust through direct, honest communication.
