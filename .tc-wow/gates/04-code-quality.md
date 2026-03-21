# Gate 4: Code Quality Gate

**Transition**: Implementation → QA Testing
**Linear Transition**: **Dev** → **QA**
**meta.yaml**: *(updated by skill)*

**Key Question**: "Is the code ready for QA?"

Verifies development work is complete and code quality standards are met before handing over to QA. Run via `/trilogy-dev-handover` when code is complete and ready for inspection.

---

## Prerequisites

| Artifact              | Required    | Location            |
| --------------------- | ----------- | ------------------- |
| `plan.md`             | Yes         | `.specify/plan.md`  |
| `tasks.md`            | Recommended | `.specify/tasks.md` |
| Feature branch        | Yes         | Git                 |
| Technical Gate passed | Yes         | Gate 3              |

---

## Checks

### 1. Code Quality

| Check                      | Pass Criteria                       | How to Verify                 |
| -------------------------- | ----------------------------------- | ----------------------------- |
| **Tests pass**             | All tests green                     | `php artisan test --compact`  |
| **Coverage target met**    | >80% coverage on new code           | `php artisan test --coverage` |
| **Linting clean**          | No Pint/Larastan errors             | `vendor/bin/pint --test`      |
| **No console errors**      | Browser console clean               | Manual or `browser-logs`      |
| **No broken API calls**    | All endpoints work                  | Browser DevTools              |
| **Laravel best practices** | Follows architecture gate standards | Code review                   |

### 2. Acceptance Criteria

| Check                  | Pass Criteria                   | How to Verify        |
| ---------------------- | ------------------------------- | -------------------- |
| **All AC implemented** | Every acceptance criteria met   | Compare to `spec.md` |
| **Edge cases handled** | Error states, empty states work | Manual testing       |
| **Design followed**    | UI matches `design.md`          | Visual comparison    |

### 3. Configuration

| Check                   | Pass Criteria              | How to Verify  |
| ----------------------- | -------------------------- | -------------- |
| **Env vars documented** | New vars in `.env.example` | Check file     |
| **Feature flags set**   | Pennant `Feature::active()` only — no `nova_get_setting()` | Code review |
| **Migrations ready**    | DB changes work            | Run migrations |

### 4. Developer Handover

| Check                       | Pass Criteria                    |
| --------------------------- | -------------------------------- |
| **PR description complete** | What changed, how to test        |
| **Dev notes for QA**        | Test data, edge cases documented |
| **Developer sign-off**      | Confirms feature meets criteria  |

---

## Automated Checks

```bash
# Run tests
php artisan test --compact

# Check coverage
php artisan test --coverage --min=80

# Run Pint (linting)
vendor/bin/pint --test

# Larastan (static analysis)
vendor/bin/phpstan analyse
```

---

## Gate Actions

### On Pass

- Create PR with `/trilogy-dev-pr`
- Add "Ready for QA" label
- Notify QA of handover
- Log gate passage

### On Fail

- Fix failing tests
- Add missing coverage
- Run `vendor/bin/pint` for linting
- Update PR description
- Re-run gate

---

## Output

Gate check summary:

```markdown
## Code Quality Gate Check

**Date**: YYYY-MM-DD
**Developer**: [name]
**Status**: PASS / FAIL

### Code Quality

- [x] All tests pass
- [x] Code coverage >80%
- [x] Linting clean (Pint)
- [x] No console errors
- [x] No broken API calls
- [x] Laravel best practices followed

### Laravel Best Practices Checklist

- [x] No hardcoded business rules in Vue (backend-powered, dynamic)
- [x] No magic number IDs (using Model constants)
- [x] Laravel Data used for validation (no Request in controllers)
- [x] Model route binding used (no int $id parameters)
- [x] Common components contain zero hardcoded logic
- [x] No native `type="date"` inputs (use CommonDateRangePicker or a proper date picker component)
- [x] Business logic is cross-platform reusable
- [x] Using Lorisleiva Actions (with AsAction trait, not custom classes)
- [x] Action authorization in `authorize()` method (not in `handle()` or `asController()`)
- [x] Data classes remain anemic (business logic in Actions or Models)
- [x] Migrations are schema-only (no data insert/update/delete)
- [x] Models have single responsibility (not overloaded with unrelated concerns)
- [x] Granular model policies (one Policy per model, scoped permissions, relationship checks)
- [x] Response objects in auth (`Response::allow()` / `Response::deny('reason')`, no bare bool)
- [x] Event sourcing events validated against "Can We Answer This Later?" acceptance criteria
- [x] Semantic column documentation (lifecycle/domain flags have `@property` PHPDoc + lifecycle notes)
- [x] Feature flags use `Feature::active()` from Laravel Pennant — never `nova_get_setting()`, config values, env vars, or any other ad-hoc mechanism as feature toggles

### Vue TypeScript Best Practices

**Type Safety & Correctness (Most Critical)**

- [x] Every component uses TypeScript (`<script setup lang="ts">`)
- [x] No 'any' types used
- [x] Every function has explicit return type
- [x] defineModel used for v-model two-way binding

**Component Architecture & Type Safety**

- [x] Named `type Props` for defineProps (not inline, not `interface`)
- [x] Named `type Emits` for defineEmits (not inline, not `interface`)
- [x] Types/emits declared near top of `<script>`, below imports
- [x] Always use `type` keyword — only use `interface` when extending or merging is genuinely required
- [x] Computed properties have explicit return types
- [x] Watch/watchEffect should be typed
- [x] Composables return typed objects
- [x] Event naming follows convention (e.g., 'update:modelValue')
- [x] No prop drilling 3+ levels (use Pinia for deep state)
- [x] No duplicate types (extract to shared files)
- [x] Common/shared form components reused (inputs, checkboxes, date pickers, selects, popovers — no bespoke duplicates)
- [x] New UI-pattern components assessed for common eligibility — general-purpose patterns (popovers, dropdowns, tooltips, confirmation dialogs, etc.) built as `Common*.vue` with zero business logic; only genuinely feature-specific components kept bespoke
- [x] Multi-step wizards use single `useForm` at parent level — no Pinia for form state, no per-step form instances
- [x] Client-side step validation uses Zod `safeParse` as pre-flight guard (Inertia owns submission and `form.errors`)
- [x] No manual re-implementation of server-side error mapping (Inertia handles this via `form.errors`)
- [x] Pinia stores only for shared/cross-component/persistent state — not form state, local UI state, or `usePage().props` data
- [x] Stores named after domain concerns (`useUserStore`) not UI elements (`useHeaderStore`)

**Code Quality**

- [x] withDefaults used for props with default values
- [x] No undefined defaults for optional props (already undefined)
- [x] Types/enums at top below imports
- [x] No unused imports, variables, or functions

**Component Decomposition**

- [x] No oversized templates — if a `<template>` section handles multiple distinct concerns (e.g., header, content area, sidebar, actions), each concern is extracted into its own sub-component
- [x] Parent components own logic and orchestration; sub-components own rendering of a single concern
- [x] Sub-components live in a directory named after the parent (e.g., `Sidebar/Header.vue`, `Sidebar/ClientInformation.vue`)
- [x] Sub-component names are short and descriptive — no parent prefix repetition (e.g., `Header.vue` not `PackageSidebarHeader.vue`)
- [x] The signal to decompose is intent, not line count — if a template section represents a distinct concept (navigation, client info, funding, actions), it should be its own component regardless of size
- [x] If you feel the need to add a comment to label a template section (e.g., `<!-- Header -->`, `<!-- Actions -->`), that section must be extracted into a named component instead

**Composition Architecture**

- [x] Composition over configuration — slots and composables used instead of boolean props toggling between different render paths
- [x] No "god components" — no single component with 10+ props controlling all behaviour internally
- [x] Reusable reactive logic lives in composables — not embedded in presentational components
- [x] Composables return typed objects and are independently testable without mounting a component
- [x] Primitives are single-responsibility — each small component does one thing (renders a card, a badge, a field group)
- [x] Consumer controls layout — parent assembles children via slots; children don't dictate layout via flags
- [x] No boolean prop branching — components do not use `variant`, `mode`, or boolean props to toggle between substantially different templates
- [x] Logic that could be reused (filtering, validation, state) is extracted to a composable, not duplicated across components

**Type Organization**

- [x] Types used by only one component are defined locally — never exported
- [x] Types shared across 2+ components are extracted to a dedicated `.ts` file in `resources/js/types/` (organized by domain/feature subdirectory)
- [x] No type exports from `.vue` files — if a type defined in a `.vue` file is needed elsewhere, move it to a shared type file
- [x] No duplicate type definitions across components — single source of truth in shared type files

**Style & Conventions**

- [x] Arrow functions always — no `function` keyword, no `async function` (use `const fn = () => {}` and `const fn = async () => {}`)
- [x] One-line `if`, `else`, `for`, and `while` statements omit curly braces — e.g., `if (x) return` not `if (x) { return }`
- [x] Near-zero comments — comments are almost never needed; only permitted for genuinely complex logic where the code alone cannot convey intent (e.g., a non-obvious algorithm or workaround). Template comments are never acceptable.
- [x] Zero template comments — no HTML comments in `<template>` at all. No `<!-- Header -->`, no `<!-- Actions Section -->`, no section labels. If a section needs labelling, it should be its own component with a descriptive name.
- [x] Consistent whitespace: one blank line between type declarations, between functions, and between logical blocks

### Acceptance Criteria

- [x] All AC implemented
- [x] Edge cases handled
- [x] Design followed

### Configuration

- [x] Env vars documented
- [x] Feature flags use Pennant (`Feature::active()`) — no `nova_get_setting()` or ad-hoc toggles
- [x] Migrations ready

### Developer Handover

- [x] PR description complete
- [x] Dev notes for QA provided
- [x] Developer sign-off

**Ready for QA**: YES / NO
```

---

## Integration

Referenced by:

- `/trilogy-dev-pr` - Runs this gate when creating PR
- `/trilogy-qa` - Expects this gate to have passed
