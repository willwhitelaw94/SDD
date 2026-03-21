# Gate 3: Architecture Gate

**Transition**: Plan → Implementation
**Linear Transition**: *(stays in Dev)*
**meta.yaml**: *(no change)*

**Key Question**: "Is the architecture sound?"

Verifies the design and spec are technically feasible before committing to an implementation approach. Run via `/speckit-plan` when creating a technical plan.

---

## Prerequisites

| Artifact | Required | Location |
|----------|----------|----------|
| `spec.md` | Yes | `.specify/spec.md` |
| `design.md` | Yes | `.specify/design.md` |
| Business Gate passed | Yes | Gate 1 |
| Design Gate passed | Yes | Gate 2 |

---

## Checks

### 1. Technical Feasibility

| Check | Pass Criteria |
|-------|---------------|
| **Architecture approach clear** | Know how to build this |
| **Existing patterns leveraged** | Uses established codebase conventions |
| **No impossible requirements** | All spec items are buildable |
| **Performance considered** | No obvious performance concerns |
| **Security considered** | No security anti-patterns |

### 2. Data & Integration

| Check | Pass Criteria |
|-------|---------------|
| **Data model understood** | Know what data exists/needs to exist |
| **API contracts clear** | Endpoints and payloads defined |
| **Dependencies identified** | External services, packages, migrations |
| **Integration points mapped** | How this connects to existing system |
| **DTO persistence explicit** | No `->toArray()` directly into ORM `create()`/`update()` |

### 3. Implementation Approach

| Check | Pass Criteria |
|-------|---------------|
| **File changes identified** | Know which files will be modified |
| **Risk areas noted** | Complex or risky areas flagged |
| **Testing approach defined** | Know how to verify it works |
| **Rollback possible** | Can revert if something goes wrong |

### 4. Resource & Scope

| Check | Pass Criteria |
|-------|---------------|
| **Scope matches spec** | Not over-engineering |
| **Effort reasonable** | Can be done in available time |
| **Skills available** | Team has required expertise |

### 5. Laravel & Cross-Platform Best Practices

| Check | Pass Criteria |
|-------|---------------|
| **No hardcoded business logic** | No hardcoded business rules in Vue - must be backend-powered and dynamic |
| **Cross-platform reusability** | Business logic works for Vue, React Native, and API consumers |
| **Laravel Data for validation** | Using Laravel Data classes, not Request objects in controllers |
| **Model route binding** | Controller methods use Model instances, not `int $id` parameters |
| **No magic numbers/IDs** | All database IDs referenced via Model constants (e.g., `Document::ID_EPOA`) |
| **Common components pure** | Shared/common components contain zero business logic |
| **Use Lorisleiva Actions** | Use `AsAction` trait - NOT custom action classes without package |
| **Action authorization in authorize()** | Auth checks live in the action's `authorize()` method, never in `handle()` or `asController()` |
| **Data classes remain anemic** | DTOs/Data classes contain NO business logic - only properties and type casting |
| **Migrations schema-only** | Migrations only modify schema; data operations use Laravel Operations/Seeders |
| **Models have single responsibility** | Each model owns one clear domain concept - not overloaded with unrelated concerns |
| **Granular model policies** | Each model with authorization has its own Policy; permissions are specific and scoped |
| **Response objects in auth** | Policies and action `authorize()` return `Response::allow()` / `Response::deny('reason')`, never bare `true`/`false` |
| **Event sourcing: granular events** | Events are the most granular facts that add business value; validated against future business questions |
| **Semantic column documentation** | Non-trivial lifecycle and domain columns on models have PHPDoc definitions explaining meaning and what sets them |
| **Feature flags dual-gated** | Features behind flags use backend route middleware (`check.feature.flag`) AND frontend `HasFeatureFlag` component; sidebar/nav conditionally rendered |

### 6. Vue TypeScript Standards (Frontend Architecture)

**Why this is in Gate 3**: TypeScript issues must be caught at architecture time, not at code review. If the plan doesn't mandate TypeScript-first Vue components, developers will write JavaScript and it won't be caught until Gate 4 — when it's expensive to fix.

The plan MUST specify that all new/modified Vue components will follow these standards:

| Check | Pass Criteria |
|-------|---------------|
| **All Vue components use TypeScript** | Every `<script setup>` block must include `lang="ts"` — no exceptions |
| **Props use named `type`** | Plan must show `type Props = { ... }` with `defineProps<Props>()`, not inline types and not `interface` |
| **Emits use named `type`** | Plan must show `type Emits = { ... }` with `defineEmits<Emits>()`, never inline type literals |
| **No `any` types planned** | Data structures from backend must have TypeScript types defined |
| **Shared types identified** | If multiple components share data shapes, plan must specify where shared types live (in `resources/js/types/`, never exported from `.vue` files) |
| **Common components reused** | Plan must check for existing common/shared form components (inputs, checkboxes, date pickers, selects, popovers, modals, etc.) before creating new ones |
| **New components assessed for common eligibility** | When creating a new UI component, evaluate whether it is a general-purpose UI pattern (popover, dropdown, tooltip, confirmation dialog, etc.) that could be used elsewhere. If yes, build it as a `Common*.vue` component with zero business logic and use it from the feature component. If the component is genuinely feature-specific (e.g., a domain-specific card layout), keep it bespoke. |
| **Multi-step wizards use `useForm`** | Wizards and data capture forms must use a single Inertia `useForm` instance at the parent level as the source of truth — not Pinia, not per-step state |
| **Stepper has per-step validation** | Multi-step forms must validate the current step's fields before allowing the user to proceed to the next step — this is a UX and data integrity requirement, not optional |
| **Type declarations for untyped deps** | If importing from `.js` files without types, plan must include creating `.d.ts` declarations |

**Red Flags** (auto-fail at architecture gate):
- ❌ Plan references Vue components without mentioning TypeScript
- ❌ Plan shows `defineProps({...})` (Options API syntax) instead of `defineProps<Props>()`
- ❌ Plan uses `interface Props` or `interface Emits` instead of `type Props` / `type Emits`
- ❌ Plan shows inline type literals in `defineEmits<{...}>()` instead of named `type Emits`
- ❌ Plan accepts `any` types for backend data (e.g., "we'll type it later")
- ❌ Plan modifies existing `.vue` files that are missing `lang="ts"` without planning to add it
- ❌ No TypeScript types defined for data passed from controllers to Vue pages
- ❌ Plan creates bespoke form field components when common/shared ones already exist
- ❌ Plan creates a bespoke component for a general-purpose UI pattern (popover, dropdown, tooltip, confirmation dialog, etc.) instead of building or reusing a `Common*.vue` component
- ❌ Multi-step wizard uses Pinia or per-step state instead of a single Inertia `useForm` at the parent level
- ❌ Multi-step form allows proceeding to the next step without validating the current step's fields
- ❌ Form state duplicated between `useForm` and a Pinia store (unless wizard spans separate Inertia page visits)
- ❌ Manual re-implementation of server-side error mapping that Inertia already provides via `form.errors`
- ❌ Pinia store created for form state (use `useForm`)
- ❌ Pinia store created for single-component UI state (use local `ref`/`reactive`)
- ❌ Pinia store duplicating data already available via `usePage().props`
- ❌ Store named after a UI element (`useHeaderStore`, `useSidebarStore`) instead of a domain concern
- ❌ New store proposed without justification of why local state or Inertia props aren't sufficient
- ❌ Plan uses `function` or `async function` declarations instead of arrow functions (`const fn = () => {}`)
- ❌ Plan exports types from `.vue` files for use in other components (shared types must live in `resources/js/types/`)
- ❌ Component template handles multiple distinct concerns without a sub-component breakdown
- ❌ Plan shows a single large component where section comments would be needed to navigate the template

**What the plan should include for each new Vue component**:

```markdown
### ComponentName.vue
- Props: `defineProps<Props>()` with named type:
  - `package: Package` (from shared types)
  - `items: ItemType[]` (defined in component or shared)
- Emits: `defineEmits<Emits>()` with named type:
  - `(e: 'save', data: SaveData): void`
- Key types: [list types that need to be created]
- Shared type files: [list any new or existing .ts files in resources/js/types/ that will hold shared types]
- Common components reused: [list any existing shared components being used]
- Common component eligibility: [if creating new UI-pattern components — state whether each should be a Common*.vue or kept bespoke, with reasoning]
- Sub-components: [list sub-components if this component will be decomposed — see Component Decomposition below]
```

This prevents the pattern where components are written in JavaScript and TypeScript is bolted on later at code review.

### 7. Component Decomposition (Frontend Architecture)

**Why this is in Gate 3**: If the plan doesn't mandate component decomposition upfront, developers will build monolithic components with long templates and use HTML comments to separate sections — creating components that are hard to read, test, and maintain. Refactoring a monolithic component into sub-components after the fact is significantly more expensive than planning the decomposition from the start.

Every component should have a single rendering responsibility. When a component's template handles multiple distinct concerns (e.g., a header with navigation, client info, and action buttons), each concern should be its own sub-component. The parent component owns the logic, data fetching, and orchestration; sub-components own the rendering of their specific concern.

**The signal to decompose is intent, not line count.** If a template section represents a distinct concept — navigation, client details, funding streams, action buttons — it should be its own component regardless of whether it's 20 lines or 200. The question is: "Does this section represent a separate thing?" If yes, extract it.

**Directory and naming conventions:**

```
Package/
├── Header/
│   ├── PackageHeader.vue      ← Parent: owns logic and orchestration
│   ├── Navigation.vue          ← Sub-component: short, descriptive name
│   ├── Actions.vue             ← Sub-component: no parent prefix
│   └── ClientStatus.vue        ← Sub-component: named after what it renders
├── Sidebar/
│   ├── PackageSidebar.vue      ← Parent: owns logic and orchestration
│   ├── Header.vue              ← NOT "PackageSidebarHeader.vue"
│   ├── ClientInformation.vue   ← NOT "SidebarClientInformation.vue"
│   ├── FundingStreams.vue
│   └── KeyPersonnel.vue
```

- Parent component keeps its full name (e.g., `PackageSidebar.vue`)
- Sub-components use short, descriptive names — no parent prefix repetition
- The directory name provides the namespace, so prefixing is redundant

| Check | Pass Criteria |
|-------|---------------|
| **Component decomposition planned** | Plan identifies which components will be decomposed and lists their sub-components |
| **Each sub-component has single concern** | Each sub-component renders one distinct thing (navigation, client info, actions, etc.) |
| **Parent owns logic** | Parent component handles data, state, and orchestration; sub-components receive props and emit events |
| **Directory structure defined** | Plan shows the directory layout for decomposed components |
| **Naming is simple** | Sub-components use short names without parent prefix — directory provides namespace |
| **No template section comments planned** | If the plan would need HTML comments to label template sections, the component needs decomposition |

**Red Flags** (auto-fail at architecture gate):
- ❌ Plan shows a component with 3+ distinct template sections (header, content, sidebar, footer, actions) as a single component
- ❌ Plan includes HTML section comments like `<!-- Header -->` or `<!-- Actions -->` in templates
- ❌ Sub-components are prefixed with the full parent path (e.g., `PackageSidebarClientInformation.vue` instead of `ClientInformation.vue`)
- ❌ Plan puts all sub-components in the same flat directory as unrelated components instead of a dedicated subdirectory

**What the plan should include for decomposed components**:

```markdown
### FeatureName Component Decomposition
- Parent: `FeatureName.vue` — owns [logic, data fetching, state]
- Directory: `Components/Feature/FeatureName/`
- Sub-components:
  - `Header.vue` — renders [client name, status badges]
  - `Navigation.vue` — renders [tab navigation]
  - `Actions.vue` — renders [action buttons, dropdowns]
- Shared types: `resources/js/types/Feature/featureName.ts` — [list shared types]
```

### 8. Composition-Based Component Architecture (Frontend Architecture)

**Why this is in Gate 3**: If the plan doesn't mandate composition over configuration, developers will build monolithic components that use props and flags to toggle behaviour — creating components that are hard to test, hard to extend, and tightly coupled to their use case. Refactoring a prop-driven component into a composed architecture after the fact is significantly more expensive than designing for composition from the start.

**Principle**: Build small, single-responsibility primitives that are composed together — not one large component with boolean props toggling behaviour. Prefer slots and composables over prop-driven conditionals. Keep each piece independently testable. Let the consumer control layout.

**Composition hierarchy:**

1. **Composables** — Encapsulate reusable reactive logic (data fetching, validation, state management). Return typed objects. Independently testable without a component.
2. **Primitives** — Small, focused components that do one thing (a button, a status badge, a field group). Accept data via props, expose behaviour via slots and emits.
3. **Composed components** — Assemble primitives via slots and composables. The parent decides layout and wiring, not the child.

**Slots over props for content and layout:**

```vue
<!-- ❌ BAD: Prop-driven conditionals -->
<DataCard
  :show-header="true"
  :show-footer="hasActions"
  :header-title="title"
  :footer-actions="actions"
  :variant="isEditing ? 'edit' : 'view'"
/>

<!-- ✅ GOOD: Composition via slots -->
<DataCard>
  <template #header>
    <CardHeader :title="title" />
  </template>
  <template #default>
    <CardContent :data="data" />
  </template>
  <template #footer>
    <CardActions :actions="actions" />
  </template>
</DataCard>
```

**Composables over prop callbacks for logic:**

```ts
// ❌ BAD: Logic baked into a component via props
<UserList :on-filter="handleFilter" :sort-by="sortField" :sort-dir="sortDir" />

// ✅ GOOD: Logic extracted to a composable, component stays presentational
const { filtered, sortBy, sortDir } = useFilteredList(users, filterConfig)
<UserList :users="filtered" />
```

**When to compose vs. when a single component is fine:**

- **Compose** when a component has 2+ distinct behavioural modes toggled by boolean props
- **Compose** when different consumers need different layouts of the same data
- **Compose** when internal logic (filtering, validation, state) could be reused elsewhere
- **Single component is fine** for leaf-level primitives with no behavioural branching (a badge, an icon, a label)

| Check | Pass Criteria |
|-------|---------------|
| **Composition planned over configuration** | Plan favours slots and composables over prop-driven conditionals for behaviour switching |
| **Composables identified** | Reusable reactive logic is extracted into composables, not embedded in components |
| **Primitives are single-responsibility** | Each small component does one thing and is independently testable |
| **Consumer controls layout** | Parent components assemble children via slots — children don't dictate layout via flags |
| **No boolean prop branching** | Components don't use boolean props to toggle between substantially different render paths |

**Red Flags** (auto-fail at architecture gate):
- ❌ Plan shows a component with `variant`, `mode`, or boolean props that toggle between entirely different templates
- ❌ Plan bakes filtering, sorting, or validation logic into a presentational component instead of a composable
- ❌ Plan creates a "god component" that accepts 10+ props to control all behaviour internally
- ❌ Plan shows a component that cannot be tested without mounting its entire parent tree
- ❌ Plan duplicates logic across components that could be a shared composable

**What the plan should include for composed components**:

```markdown
### FeatureName Composition
- Composables:
  - `useFeatureFilters()` — filter/sort logic, returns `{ filtered, sortBy, toggleSort }`
  - `useFeatureValidation()` — step validation, returns `{ validate, errors }`
- Primitives:
  - `FeatureCard.vue` — renders a single item, accepts data via props
  - `FeatureActions.vue` — renders action buttons, emits events
- Composed page:
  - `FeatureIndex.vue` — wires composables to primitives via slots
  - Consumer controls layout: card grid vs. list vs. table
```

### 9. Type File Organization (Frontend Architecture)

**Why this is in Gate 3**: If the plan doesn't specify where shared types live, developers will either duplicate types across components or export them from `.vue` files — both of which create maintenance problems and coupling that's expensive to fix later.

Types follow a strict hierarchy:

1. **Domain-level types** — Generated TypeScript declaration files from Laravel Data classes (e.g., `Domain.Package.Data.PackageData`)
2. **Shared feature types** — Manually created `.ts` files in `resources/js/types/` for types shared across multiple components within a feature (e.g., `resources/js/types/Packages/sidebar.ts`)
3. **Common component types** — Types for shared UI components (e.g., `resources/js/types/commonComponents.ts`)
4. **Component-local types** — Types used by a single component, defined in `<script setup>` and never exported

**Rules:**

- **Never export types from `.vue` files.** If a type defined in a component is needed by another component, move it to a shared `.ts` file in `resources/js/types/`.
- **Never duplicate types.** If two components need the same type, it must come from a single shared file.
- **Organize shared type files by domain/feature.** Use subdirectories in `resources/js/types/` that mirror the feature structure (e.g., `types/Packages/sidebar.ts`, `types/Billing/invoice.ts`).
- **Keep type files focused.** A type file should contain related types for a specific concern, not a grab-bag of unrelated types.

| Check | Pass Criteria |
|-------|---------------|
| **Shared types identified** | Plan lists all types that will be shared across components |
| **Type file locations specified** | Plan shows which `.ts` files in `resources/js/types/` will hold shared types |
| **No `.vue` exports planned** | No plan to export types from Vue component files |
| **No duplication planned** | Same type is not defined in multiple places |

**Red Flags** (auto-fail at architecture gate):
- ❌ Plan exports a type from a `.vue` file for use in another component
- ❌ Plan defines the same type in multiple components
- ❌ Plan creates shared types without specifying where the `.ts` file lives
- ❌ Plan dumps unrelated types into an existing type file instead of creating a focused one

**What the plan should include for type organization**:

```markdown
### Shared Types
- `resources/js/types/Packages/sidebar.ts`:
  - `PackageSidebarData` — aliased from Domain type, used by PackageSidebar and all sidebar sub-components
  - `ViewLayoutData` — layout-specific data shape for sidebar layout components
- `resources/js/types/Packages/header.ts`:
  - `TabGroup` — navigation tab structure used by PackageHeader and Navigation sub-component
```

### 10. Multi-Step Wizards & Data Capture Forms (Frontend Architecture)

**Why this is in Gate 3**: If the plan doesn't mandate `useForm` as the single source of truth, developers will reach for Pinia stores or per-step state management — creating duplicated state that's painful to refactor later.

For multi-step wizards and data capture forms, use Inertia's `useForm` as the single source of truth for all form state. Define all fields upfront in one `useForm` instance at the wizard parent level — not per step — and control visibility through step state.

**Do not** use Pinia to manage form data unless the wizard spans multiple Inertia page visits (separate routes). Duplicating form state between `useForm` and a store is an anti-pattern.

For client-side step validation before advancing, use Zod `safeParse` as a pre-flight guard. Zod should only validate the current step's fields before progressing — Inertia still owns submission and server-side error mapping.

```ts
const form = useForm({
  // Step 1
  name: '',
  email: '',
  // Step 2
  plan: '',
})

const nextStep = () => {
  const result = stepOneSchema.safeParse({ name: form.name, email: form.email })
  if (!result.success) {
    errors.value = result.error.flatten().fieldErrors
    return
  }
  currentStep.value++
}
```

Server-side validation errors returned by Inertia are automatically mapped back to `form.errors` on final submission — do not re-implement this manually.

**What the plan should include for multi-step wizards**:

```markdown
### WizardName
- Form state: Single `useForm` at parent level with all fields across all steps
- Steps: [list steps and which fields belong to each]
- Step validation: Zod schemas per step for client-side pre-flight
- Submission: Inertia handles final submission and `form.errors` mapping
- State management: `useForm` only (no Pinia unless separate page visits)
```

### 11. Pinia Stores (Frontend Architecture)

**Why this is in Gate 3**: Reaching for a Pinia store is an architecture decision. If the plan doesn't justify *why* a store is needed, developers will create stores for state that belongs in a component, in `useForm`, or already exists in `usePage().props`.

Pinia stores should hold shared application state — data that is needed by multiple unrelated components, persists across route changes, or represents a global concern like the authenticated user, notifications, or feature flags.

**Create a Pinia store when:**

- State needs to be shared across multiple unrelated components or pages
- State needs to survive route navigation (e.g. a shopping cart, draft data, user preferences)
- You need a centralised place to encapsulate logic that multiple parts of the app depend on (e.g. fetching and caching the current user)
- You are working with real-time or polled data that many components consume (e.g. notifications, websocket events)

**Do not create a store for:**

- Form state — use `useForm` from Inertia
- UI state that is local to a single component (open/closed, active tab, current step)
- Data that is already available via `usePage().props` from Inertia — don't re-store what Inertia already provides

**Structure stores around domain concerns, not UI concerns.** A `useUserStore` or `useNotificationStore` is correct. A `useHeaderStore` or `useSidebarStore` is a smell — that state belongs in the component.

Keep stores lean. Actions should either mutate state or coordinate async operations (API calls). Avoid putting view logic or component concerns inside a store.

When using Inertia, always check whether `usePage().props` already exposes the data you need before reaching for a store. Inertia shares server-side data efficiently and a store in front of it is usually unnecessary overhead.

**What the plan should include when proposing a new store**:

```markdown
### useExampleStore
- Justification: [why this can't be local state, useForm, or usePage().props]
- Consumers: [which unrelated components/pages need this state]
- State: [list of reactive properties]
- Actions: [list of mutations/async operations]
```

### 12. Data Tables (Full-Stack Architecture)

**Why this is in Gate 3**: Data tables are one of the most common UI patterns in TC Portal. If the plan doesn't mandate the CommonTable + BaseTable stack, developers will build bespoke table markup with manual search, filter, sort, and pagination — creating inconsistent UX and duplicated logic that's expensive to replace later.

All data tables **must** use the established CommonTable full-stack pattern:

**Backend** — Extend `BaseTable` (`app/Tables/BaseTable.php`) which builds on InertiaUI Table:

| Method | Purpose |
|--------|---------|
| `resource(): Builder` | Eloquent query with eager-loaded relationships |
| `columns(): array` | Column definitions using `TextColumn`, `NumericColumn`, `BadgeColumn`, `BooleanColumn`, `DateColumn`, `ActionColumn` |
| `filters(): array` | Filter definitions using `TextFilter`, `DateFilter`, `SetFilter`, `BadgeFilter` |
| `actions(): array` | Row actions with `Action::make()` |
| `exports(): array` | CSV/Excel exports (merge `$this->defaultCsvExport()`) |
| `transformModel(Model $model, array $data): array` | Format raw data for display (Money, dates, enum badges) |

Table classes live in `app/Tables/` and are passed directly as Inertia props — the `toArray()` serialisation is automatic.

**Frontend** — Use `CommonTable` (`resources/js/Components/Common/table/CommonTable.vue`):

```vue
<CommonTable :resource="table" searchPlaceholder="Search...">
    <!-- Optional: custom cell rendering via named slots -->
    <template #cell(status)="{ value }">
        <CommonBadge :colour="value.colour" :label="value.label" />
    </template>
</CommonTable>
```

The component handles search, filters, sorting, pagination, bulk actions, grid/table toggle, and row actions out of the box. Custom cell rendering is available via `#cell(columnName)` slots.

**Key conventions** (check existing tables in `app/Tables/` for patterns):

- Enums → use `.toData()` in `transformModel()` returning `{ label, colour }` for badge rendering
- Money → use `Money::from($amount)->formatted` in `transformModel()`
- Dates → format in `transformModel()`, not in the query
- Sticky action column → `ActionColumn::new()->meta(['sticky' => true])`
- Feature flag gating → conditionally modify the query in `resource()` using `Feature::active()`
- No pagination → set `$pagination = false` on the table class

| Check | Pass Criteria |
|-------|---------------|
| **CommonTable used for all data tables** | No bespoke table markup with manual search/filter/sort/pagination |
| **BaseTable extended** | Server-side table class extends `BaseTable` in `app/Tables/` |
| **Columns typed correctly** | Using appropriate column types (`BadgeColumn` for status, `DateColumn` for dates, etc.) |
| **Transforms in `transformModel()`** | Display formatting happens in the transformer, not in Blade/Vue or the query |
| **Filters server-side** | Filters defined as `TextFilter`/`DateFilter`/`SetFilter`/`BadgeFilter`, not client-side JS filtering |
| **Actions use named routes** | Row action URLs use `route()` helper |

**Red Flags** (auto-fail at architecture gate):
- ❌ Plan shows a hand-rolled `<table>` with manual `v-for` iteration and client-side filtering
- ❌ Plan builds search, sort, or pagination logic from scratch in Vue
- ❌ Plan formats data (dates, money, enums) in the Vue template instead of `transformModel()`
- ❌ Plan creates a new table component instead of using `CommonTable`
- ❌ Plan uses `DB::table()` raw queries in the table resource instead of Eloquent

**What the plan should include for each data table**:

```markdown
### TableName (e.g. CheckInReportTable)
- Location: `app/Tables/Staff/CheckInReportTable.php`
- Resource query: [model + key relationships eager-loaded]
- Columns: [list with types — TextColumn, BadgeColumn, etc.]
- Filters: [list with types — TextFilter, SetFilter, etc.]
- Actions: [row actions with route names]
- Transforms: [what transformModel() will format]
- Frontend page: [which Vue page renders this table]
```

---

## Gate Actions

### On Pass
- Proceed to `/speckit-tasks` to break down work
- Create `plan.md` with technical approach
- Begin implementation phase

### On Fail
- Return to design or spec phase
- Flag technical concerns for discussion
- Consider descoping or phased approach

---

## Output

Gate check summary:

```markdown
## Architecture Gate Check
**Date**: YYYY-MM-DD
**Status**: PASS / FAIL

### Technical Feasibility
- [x] Architecture approach clear
- [x] Existing patterns leveraged
- [x] All requirements buildable
- [x] Performance considered
- [x] Security considered

### Data & Integration
- [x] Data model understood
- [x] API contracts clear
- [x] Dependencies identified
- [x] Integration points mapped
- [x] DTO persistence explicit (no ->toArray() into ORM)

### Implementation Approach
- [x] File changes identified
- [x] Risk areas noted
- [x] Testing approach defined
- [x] Rollback possible

### Resource & Scope
- [x] Scope matches spec
- [x] Effort reasonable
- [x] Skills available

### Laravel & Cross-Platform Best Practices
- [x] No hardcoded business logic in Vue (backend-powered, dynamic)
- [x] Cross-platform reusability (Vue, React Native, API)
- [x] Laravel Data for validation (no Request in controllers)
- [x] Model route binding (no int $id parameters)
- [x] No magic numbers/IDs (using Model constants)
- [x] Common components pure (zero hardcoded logic)
- [x] Use Lorisleiva Actions (with AsAction trait, not custom classes)
- [x] Action authorization in `authorize()` method (not in `handle()` or `asController()`)
- [x] Data classes remain anemic (no business logic in DTOs)
- [x] Migrations schema-only (data ops use Operations/Seeders)
- [x] Models have single responsibility (not overloaded with unrelated concerns)
- [x] Granular model policies (one Policy per model, scoped permissions, relationship checks for non-staff)
- [x] Response objects in auth (`Response::allow()` / `Response::deny('reason')`, no bare bool)
- [x] Event sourcing events validated against "Can We Answer This Later?" acceptance criteria
- [x] Semantic column documentation (lifecycle/domain flags have PHPDoc definitions on the model)
- [x] Feature flags dual-gated (backend middleware + frontend `HasFeatureFlag`, sidebar conditional)

### Vue TypeScript Standards
- [x] All new/modified Vue components planned with `<script setup lang="ts">`
- [x] Props use named `type` (`type Props = { ... }` with `defineProps<Props>()`)
- [x] Emits use named `type` (`type Emits = { ... }` with `defineEmits<Emits>()`)
- [x] No `any` types planned — backend data shapes have TypeScript types
- [x] Shared types identified (where reusable types live)
- [x] Common components audited (existing shared form components reused, no bespoke duplicates)
- [x] New components assessed for common eligibility (general-purpose UI patterns built as `Common*.vue`, feature-specific kept bespoke)
- [x] Multi-step wizards use single parent-level `useForm` (not Pinia, not per-step state)
- [x] Composition over configuration (slots and composables over prop-driven conditionals)
- [x] Composables identified for reusable reactive logic
- [x] Primitives are single-responsibility and independently testable
- [x] Consumer controls layout (no boolean prop branching for different render paths)
- [x] Pinia stores justified (not for form state, local UI state, or data already in `usePage().props`)
- [x] Stores named after domain concerns, not UI elements
- [x] Type declarations planned for untyped `.js` dependencies

**Ready to Implement**: YES / NO
```

---

## When to Skip

Architecture Gate can be simplified for:
- Minor UI tweaks (existing patterns)
- Copy/content changes (no architecture impact)
- Bug fixes with clear root cause

Always document if gate is skipped and why.

---

## Integration

Referenced by:
- `/speckit-plan` - Runs this gate when creating plan
- `/speckit-tasks` - Expects this gate to have passed

---

## Laravel & Cross-Platform Best Practices (Detailed)

### 1. No Hardcoded Business Logic in Vue Components

**Problem**: Hardcoding business rules in Vue components prevents code reuse across platforms (React Native mobile app, API consumers) and creates maintenance nightmares when rules change.

**Key Principle**: Vue can have UI logic and reactivity, but business rules must come from the backend. When a user interaction changes what's required, fetch the new requirements from the backend.

**❌ BAD Example** - Hardcoded business rules in Vue:
```vue
<script setup>
const contactType = ref('guardian');

// ❌ Hardcoded business logic - what documents are required
const requiredDocs = computed(() => {
  if (contactType.value === 'guardian') {
    return [1, 3, 7]; // Magic IDs + business rule in frontend
  } else if (contactType.value === 'next_of_kin') {
    return [2, 5];
  } else if (contactType.value === 'attorney') {
    return [1, 4, 8, 9];
  }
  return [];
});
</script>

<template>
  <select v-model="contactType">
    <option value="guardian">Guardian</option>
    <option value="next_of_kin">Next of Kin</option>
    <option value="attorney">Attorney</option>
  </select>
  
  <!-- Documents based on hardcoded logic -->
  <div v-for="docId in requiredDocs" :key="docId">
    Document {{ docId }} is required
  </div>
</template>
```

**✅ GOOD Example** - Dynamic, backend-powered:
```php
// app/Actions/GetRequiredDocumentsAction.php
use Lorisleiva\Actions\Concerns\AsAction;

class GetRequiredDocumentsAction
{
    use AsAction;
    
    public function handle(string $contactType): array
    {
        // Business logic lives in backend
        return Document::query()
            ->where('contact_type', $contactType)
            ->where('is_required', true)
            ->get()
            ->map(fn($doc) => [
                'id' => $doc->id,
                'name' => $doc->name,
                'description' => $doc->description,
            ])
            ->toArray();
    }
}

// routes/api.php
Route::get('/contacts/required-documents/{contactType}', function (string $contactType) {
    return GetRequiredDocumentsAction::run($contactType);
});
```

```vue
<!-- ContactForm.vue - Dynamic, powered by backend -->
<script setup>
import { ref, watch } from 'vue';
import { router } from '@inertiajs/vue3';

const contactType = ref('guardian');
const requiredDocuments = ref([]);
const loading = ref(false);

// ✅ Fetch requirements from backend when type changes
watch(contactType, async (newType) => {
  loading.value = true;
  
  // Use Inertia's reload with only parameter to fetch new data
  router.reload({
    only: ['requiredDocuments'],
    data: { contactType: newType },
    preserveState: true,
    onSuccess: () => {
      loading.value = false;
    }
  });
});

// OR use a simple fetch if not using Inertia reload
// watch(contactType, async (newType) => {
//   loading.value = true;
//   const response = await fetch(`/api/contacts/required-documents/${newType}`);
//   requiredDocuments.value = await response.json();
//   loading.value = false;
// });
</script>

<template>
  <select v-model="contactType">
    <option value="guardian">Guardian</option>
    <option value="next_of_kin">Next of Kin</option>
    <option value="attorney">Attorney</option>
  </select>
  
  <!-- ✅ Documents powered by backend -->
  <div v-if="loading">Loading requirements...</div>
  <div v-else v-for="doc in requiredDocuments" :key="doc.id">
    <strong>{{ doc.name }}</strong>: {{ doc.description }}
  </div>
</template>
```

**Why This Matters**:

1. **Single Source of Truth** - Business rules live in one place (backend), not duplicated across Vue and React Native
2. **Easy to Change** - Update document requirements in database/backend, both platforms get the update
3. **Testable** - Backend logic can be unit tested, hardcoded frontend logic cannot
4. **Consistent** - Mobile app and web portal show same requirements
5. **Dynamic** - Requirements can be personalized per user, region, or other factors without deploying frontend

**What Vue CAN Have**:
- ✅ UI state management (form validation feedback, loading states)
- ✅ Reactivity (watch for changes, computed properties)
- ✅ User interactions (click handlers, form submissions)
- ✅ Display logic (show/hide based on props from backend)
- ✅ Client-side filtering/sorting of data from backend

**What Vue CANNOT Have**:
- ❌ Hardcoded business rules (what's required, what's allowed)
- ❌ Hardcoded pricing, calculations, eligibility rules
- ❌ Hardcoded workflow states or transitions
- ❌ Magic numbers or IDs determining behavior

### 2. No Magic Numbers/IDs

**Problem**: Database IDs differ between environments. ID 1 in dev might be "EPOA" but ID 1 in production could be something else.

**Bad Example**:
```php
$epoaDocument = Document::find(1); // Assumes ID 1 is always EPOA
$documents = Document::whereIn('id', [1, 2, 5])->get();
```

**Good Example**:
```php
// app/Models/Document.php
class Document extends Model
{
    /** Enduring Power of Attorney document type */
    public const ID_EPOA = 'epoa';
    
    /** Photo identification document type */
    public const ID_PHOTO_ID = 'photo_id';
    
    /** Proof of address document type */
    public const ID_PROOF_OF_ADDRESS = 'proof_of_address';
}

// Usage
$epoaDocument = Document::where('slug', Document::ID_EPOA)->firstOrFail();
$documents = Document::whereIn('slug', [
    Document::ID_EPOA,
    Document::ID_PHOTO_ID,
    Document::ID_PROOF_OF_ADDRESS,
])->get();
```

**Note**: Use semantic identifiers (slugs, types) instead of auto-increment IDs. Define constants with PHPDoc explaining business meaning.

### 3. Laravel Data for Validation

**Problem**: Passing Request objects to services/actions couples code to HTTP layer and bypasses type safety.

**Bad Example**:
```php
public function store(int $packageId, Request $request)
{
    $data = PackageData::fromArray($request->toArray());
    // Now dealing with both Request and Data
}
```

**Good Example**:
```php
public function store(Package $package, PackageData $data)
{
    // $data is already validated and type-safe
    // No need to touch Request object
    $package->update([
        'name' => $data->name,
        'description' => $data->description,
    ]);
}
```

**Why**: Laravel Data auto-validates and resolves. By the time you're in the controller, you have a validated DTO.

### 4. Model Route Binding

**Problem**: Querying by ID is redundant work Laravel already does for you. Inconsistent and error-prone.

**Bad Example**:
```php
Route::put('/packages/{id}', [PackageController::class, 'update']);

public function update(int $id, PackageData $data)
{
    $package = Package::findOrFail($id); // Manual query
    $package->update($data->toArray());
}
```

**Good Example**:
```php
Route::put('/packages/{package}', [PackageController::class, 'update']);

public function update(Package $package, PackageData $data)
{
    // $package already resolved by Laravel
    $package->update($data->toArray());
}
```

**Why**: Leverages framework conventions, automatically handles 404s, keeps code consistent across controllers.

### 5. Cross-Platform Business Logic

**Problem**: With cross-functional teams building Vue (portal) and React Native (mobile app), business logic must be platform-agnostic.

**Architecture Pattern**:
```
┌─────────────────────────────────────────┐
│ Presentation Layer (Platform-Specific)  │
│  • Vue 3 Components (Portal)            │
│  • React Native (Mobile App)            │
│  • API Controllers (External APIs)      │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│ Business Logic Layer (Shared)           │
│  • Actions (Lorisleiva\Actions)         │
│  • Models (Eloquent with business logic)│
│  • DTOs (Laravel Data classes)          │
│  • Events (for decoupled side effects)  │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│ Data Layer                              │
│  • Database                             │
│  • External APIs                        │
└─────────────────────────────────────────┘
```

**Key Principle**: Use Lorisleiva Laravel Actions for business logic. Actions are preferred over Services because they provide a standard interface and work as controllers, jobs, commands, and listeners. Never create custom Action classes without the `AsAction` trait.

### 6. Common Components Must Be Pure

**Problem**: Shared components with business logic create coupling and prevent true reusability.

**Bad Example** (Button.vue):
```vue
<script setup>
const canSubmit = computed(() => {
  // Business logic about when forms can submit
  return user.value.role === 'admin' || document.value.status === 'draft';
});
</script>
```

**Good Example** (Button.vue):
```vue
<script setup>
const props = defineProps<{
  disabled: boolean;
  variant: 'primary' | 'secondary';
}>();
// Pure presentation - no business logic
</script>
```

**Parent Component**:
```vue
<script setup>
const canSubmit = computed(() => {
  // Business logic stays in parent or comes from backend
  return permissions.canEditDocument(document.value);
});
</script>

<template>
  <Button :disabled="!canSubmit" variant="primary">
    Submit
  </Button>
</template>
```

### 7. Use Laravel Actions Package (Lorisleiva), Not Custom Action Classes

**Problem**: Creating custom Action classes without using the `Lorisleiva\Actions` package is an anti-pattern. Always use the Laravel Actions package which provides proper structure and conventions.

**❌ BAD - Custom Action Class (no package)**:
```php
// app/Actions/CreateIncidentAction.php
class CreateIncidentAction
{
    public function execute(Package $package, CreateIncidentData $data): Incident
    {
        return Incident::create([
            'package_id' => $package->id,
            'title' => $data->title,
            'description' => $data->description,
        ]);
    }
}

// Controller - custom method names, no standard interface
public function store(Package $package, CreateIncidentData $data)
{
    $incident = app(CreateIncidentAction::class)->execute($package, $data);
    return redirect()->route('incidents.show', $incident);
}
```

**✅ GOOD - Use Lorisleiva Laravel Actions**:

```php
// app/Actions/CreateIncidentAction.php
use Lorisleiva\Actions\Concerns\AsAction;

class CreateIncidentAction
{
    use AsAction;
    
    public function handle(Package $package, CreateIncidentData $data): Incident
    {
        return $package->incidents()->create([
            'title' => $data->title,
            'description' => $data->description,
        ]);
    }
}

// Controller - standard interface
public function store(Package $package, CreateIncidentData $data)
{
    $incident = CreateIncidentAction::run($package, $data);
    return redirect()->route('incidents.show', $incident);
}
```

**As Job (background work)**:
```php
use Lorisleiva\Actions\Concerns\AsAction;

class CreateIncidentAction
{
    use AsAction;
    
    public string $jobQueue = 'incidents';
    
    public function handle(Package $package, CreateIncidentData $data): Incident
    {
        return $package->incidents()->create([
            'title' => $data->title,
            'description' => $data->description,
        ]);
    }
    
    public function asJob(Package $package, CreateIncidentData $data): void
    {
        $this->handle($package, $data);
    }
}

// Dispatch as job
CreateIncidentAction::dispatch($package, $data);
```

**As Command**:
```php
use Lorisleiva\Actions\Concerns\AsAction;

class CreateIncidentAction
{
    use AsAction;
    
    public string $commandSignature = 'incident:create {package} {title}';
    
    public function handle(Package $package, CreateIncidentData $data): Incident
    {
        return $package->incidents()->create([...]);
    }
    
    public function asCommand(Command $command): void
    {
        $package = Package::find($command->argument('package'));
        $data = new CreateIncidentData(['title' => $command->argument('title')]);
        
        $incident = $this->handle($package, $data);
        $command->info("Incident created: {$incident->id}");
    }
}

// Run as: php artisan incident:create 1 "System Down"
```

**As Event Listener**:
```php
use Lorisleiva\Actions\Concerns\AsAction;

class NotifyStakeholdersAction
{
    use AsAction;
    
    public function handle(Incident $incident): void
    {
        // Send notifications to stakeholders
    }
    
    public function asListener(IncidentCreated $event): void
    {
        $this->handle($event->incident);
    }
}

// In EventServiceProvider
protected $listen = [
    IncidentCreated::class => [
        NotifyStakeholdersAction::class,
    ],
];
```

**Why Use Lorisleiva Laravel Actions**:

1. **Single Action, Multiple Contexts** - Same action class works as controller method, job, command, listener
2. **Standard Interface** - `handle()` method is the convention, `::run()` to execute
3. **Type Safety** - Full dependency injection support
4. **Testable** - Easy to unit test without mocking framework
5. **Discoverable** - All business logic in `app/Actions/` directory
6. **Framework Integration** - Works seamlessly with Laravel's queue, commands, events

**When to Use Each Pattern**:

| Pattern | Use When | Example |
|---------|----------|---------|
| **Laravel Action** | Business logic (preferred over Services) | `CreateIncidentAction::run()` |
| **Model Method** | Simple attribute logic, scopes, relationships | `$package->incidents()` |
| **Job** | Only if NOT using Action's `AsJob` | Legacy code |
| **Event/Listener** | If NOT using Action's `asListener()` | Legacy code |

**Prefer Actions Over Services**: Actions are generally preferred because they provide a standard interface and can be used in multiple contexts (controller, job, command, listener) without duplication.

**Authorization Must Live in `authorize()`, Not in `handle()` or `asController()`**:

Lorisleiva Actions provide a dedicated `authorize()` method — just like a FormRequest. This is where all authorization checks belong. The `handle()` method is pure business logic. The `asController()` method is HTTP plumbing (building the response). Neither should contain auth checks.

**❌ BAD — Authorization in `handle()`**:
```php
class UpdateArticleAction
{
    use AsAction;

    public function handle(User $user, Article $article, ArticleData $data): Article
    {
        // ❌ Authorization buried in business logic
        if (! $user->can('update', $article)) {
            throw new AuthorizationException();
        }

        $article->update([
            'title' => $data->title,
            'body' => $data->body,
        ]);

        return $article;
    }
}
```

**❌ BAD — Authorization in `asController()`**:
```php
class UpdateArticleAction
{
    use AsAction;

    public function asController(Article $article, ArticleData $data): RedirectResponse
    {
        // ❌ Authorization in HTTP layer
        $this->authorize('update', $article);

        $article = $this->handle($article, $data);
        return redirect()->route('articles.show', $article);
    }

    public function handle(Article $article, ArticleData $data): Article
    {
        $article->update([
            'title' => $data->title,
            'body' => $data->body,
        ]);

        return $article;
    }
}
```

**✅ GOOD — Authorization in `authorize()`**:
```php
use Illuminate\Auth\Access\Response;

class UpdateArticleAction
{
    use AsAction;

    public function authorize(ActionRequest $request): Response
    {
        // ✅ Dedicated method — runs automatically before handle()
        return $request->user()->can('update', $request->route('article'))
            ? Response::allow()
            : Response::deny('You do not have permission to update this article.');
    }

    public function handle(Article $article, ArticleData $data): Article
    {
        // ✅ Pure business logic — no auth concerns
        $article->update([
            'title' => $data->title,
            'body' => $data->body,
        ]);

        return $article;
    }

    public function asController(Article $article, ArticleData $data): RedirectResponse
    {
        // ✅ Pure HTTP plumbing — no auth concerns
        $article = $this->handle($article, $data);
        return redirect()->route('articles.show', $article);
    }
}
```

**Why This Matters**:

1. **Separation of concerns** — `authorize()` gates access, `handle()` does the work, `asController()` shapes the response. Each method has one job.
2. **Automatic execution** — Lorisleiva runs `authorize()` before `handle()` when the action is used as a controller. You can't accidentally skip it.
3. **Testable in isolation** — You can test authorization separately from business logic. `handle()` tests don't need to set up permissions.
4. **Reusable `handle()`** — When the action runs as a job, command, or listener, `handle()` works without dragging in HTTP authorization concerns that don't apply in those contexts.
5. **Consistent pattern** — Same shape as FormRequest `authorize()`. Developers know where to look.

### 8. Data Classes Must Remain Anemic

**Problem**: Business logic in DTOs/Data classes violates single responsibility and prevents reuse. Business logic belongs in Models, Services, or Jobs.

**Bad Example** (PackageData.php):
```php
class PackageData extends Data
{
    public function __construct(
        public string $name,
        public string $status,
        public ?Carbon $expiresAt,
    ) {}
    
    // ❌ Business logic in DTO
    public function isExpired(): bool
    {
        return $this->expiresAt?->isPast() ?? false;
    }
    
    // ❌ Business calculations in DTO
    public function calculateDaysUntilExpiry(): int
    {
        if (!$this->expiresAt) {
            return 0;
        }
        return now()->diffInDays($this->expiresAt, false);
    }
    
    // ❌ Domain rules in DTO
    public function canBeRenewed(): bool
    {
        return $this->status === 'active' && $this->isExpired();
    }
}
```

**Good Example** (PackageData.php):
```php
class PackageData extends Data
{
    public function __construct(
        public string $name,
        public string $status,
        public ?Carbon $expiresAt,
    ) {}
    
    // ✅ Only validation rules - no business logic
    public static function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'status' => ['required', 'string'],
            'expiresAt' => ['nullable', 'date'],
        ];
    }
}
```

**Move Business Logic to Model**:
```php
// app/Models/Package.php
class Package extends Model
{
    /** Package status is active and can be used */
    public const STATUS_ACTIVE = 'active';
    
    /** Package status is expired and needs renewal */
    public const STATUS_EXPIRED = 'expired';
    
    // ✅ Business logic on Model
    public function isExpired(): bool
    {
        return $this->expires_at?->isPast() ?? false;
    }
    
    // ✅ Business calculations on Model
    public function getDaysUntilExpiry(): int
    {
        if (!$this->expires_at) {
            return 0;
        }
        return now()->diffInDays($this->expires_at, false);
    }
    
    // ✅ Domain rules on Model
    public function canBeRenewed(): bool
    {
        return $this->status === self::STATUS_ACTIVE && $this->isExpired();
    }
    
    // ✅ Attribute accessor for computed properties
    protected function daysUntilExpiry(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->getDaysUntilExpiry(),
        );
    }
}
```

**Why**:
- **Single Responsibility**: DTOs transfer data, Models contain domain logic
- **Reusability**: Business logic on Models is accessible everywhere (controllers, jobs, commands, Nova, API)
- **Testability**: Business logic tests belong with Model tests, not DTO tests
- **Maintainability**: All business rules for an entity live in one place (the Model)

**What DTOs Should Contain**:
- ✅ Public properties with type hints
- ✅ Validation rules (`rules()` method)
- ✅ Type casting configuration (`casts()` method)
- ✅ Simple type transformations (e.g., `trim()`, `strtolower()`)
- ✅ Factory methods for construction (`fromModel()`, `fromArray()`)

**What DTOs Should NOT Contain**:
- ❌ Business logic methods (`isExpired()`, `canBeRenewed()`)
- ❌ Calculations (`calculateTotal()`, `getDaysUntil()`)
- ❌ Domain rules (conditional logic based on business requirements)
- ❌ Database queries
- ❌ External API calls

### 9. Migrations Are Schema-Only, Not Data Operations

**Problem**: Migrations that insert/update data are fragile, hard to test, and violate separation of concerns. Data changes should use Laravel Operations or Seeders.

**Bad Example** (Migration):
```php
// database/migrations/2024_01_15_create_documents_table.php
public function up(): void
{
    Schema::create('documents', function (Blueprint $table) {
        $table->id();
        $table->string('name');
        $table->string('slug')->unique();
        $table->timestamps();
    });
    
    // ❌ Data operations in migration
    DB::table('documents')->insert([
        ['name' => 'EPOA', 'slug' => 'epoa', 'created_at' => now()],
        ['name' => 'Photo ID', 'slug' => 'photo_id', 'created_at' => now()],
        ['name' => 'Proof of Address', 'slug' => 'proof_of_address', 'created_at' => now()],
    ]);
}
```

**Bad Example** (Data mutation in migration):
```php
public function up(): void
{
    Schema::table('packages', function (Blueprint $table) {
        $table->string('status')->nullable()->change();
    });
    
    // ❌ Updating existing data in migration
    DB::table('packages')
        ->where('expires_at', '<', now())
        ->update(['status' => 'expired']);
}
```

**Good Example** (Migration - schema only):
```php
// database/migrations/2024_01_15_create_documents_table.php
public function up(): void
{
    Schema::create('documents', function (Blueprint $table) {
        $table->id();
        $table->string('name');
        $table->string('slug')->unique();
        $table->timestamps();
    });
    
    // ✅ No data operations - schema only
}

public function down(): void
{
    Schema::dropIfExists('documents');
}
```

**Use One-Time Operations for Data Changes** (`timokoerber/laravel-one-time-operations`):

Operations are anonymous classes that extend `OneTimeOperation`, live in the `/operations/` directory with timestamped filenames, and run via `php artisan operations:process`. They are tracked automatically — each operation runs exactly once per environment.

**IMPORTANT**: Do NOT create plain PHP classes in `app/Operations/`. That is not how this project handles operations. Always use `php artisan operations:make {name}` to scaffold the correct format.

```php
// operations/2024_01_15_120000_seed_document_types.php
// Created via: php artisan operations:make SeedDocumentTypes

use App\Models\Document;
use TimoKoerber\LaravelOneTimeOperations\OneTimeOperation;

return new class extends OneTimeOperation
{
    protected bool $async = false;

    protected ?string $tag = 'documents';

    public function process(): void
    {
        $documents = [
            ['name' => 'EPOA', 'slug' => Document::ID_EPOA],
            ['name' => 'Photo ID', 'slug' => Document::ID_PHOTO_ID],
            ['name' => 'Proof of Address', 'slug' => Document::ID_PROOF_OF_ADDRESS],
        ];

        foreach ($documents as $document) {
            Document::firstOrCreate(
                ['slug' => $document['slug']],
                $document
            );
        }
    }
};
```

**Or Use Seeders for Initial/Dev Data**:
```php
// database/seeders/DocumentSeeder.php
namespace Database\Seeders;

use App\Models\Document;
use Illuminate\Database\Seeder;

class DocumentSeeder extends Seeder
{
    public function run(): void
    {
        $documents = [
            ['name' => 'EPOA', 'slug' => Document::ID_EPOA],
            ['name' => 'Photo ID', 'slug' => Document::ID_PHOTO_ID],
            ['name' => 'Proof of Address', 'slug' => Document::ID_PROOF_OF_ADDRESS],
        ];

        foreach ($documents as $document) {
            Document::firstOrCreate(
                ['slug' => $document['slug']],
                $document
            );
        }
    }
}
```

**For Production Data Backfills, Use Operations**:
```php
// operations/2024_03_10_090000_update_expired_package_status.php
// Created via: php artisan operations:make UpdateExpiredPackageStatus

use Domain\Package\Models\Package;
use Illuminate\Support\Facades\DB;
use TimoKoerber\LaravelOneTimeOperations\OneTimeOperation;

return new class extends OneTimeOperation
{
    protected bool $async = false;

    protected ?string $tag = 'packages';

    public function process(): void
    {
        DB::transaction(function () {
            Package::query()
                ->where('expires_at', '<', now())
                ->whereNull('status')
                ->update(['status' => Package::STATUS_EXPIRED]);
        });
    }
};
```

**Running Operations**:
```bash
# Process all pending operations
php artisan operations:process

# Process operations with a specific tag
php artisan operations:process --tag=packages

# Show status of all operations
php artisan operations:status
```

**Red Flags — Auto-Fail**:
- ❌ Plain PHP classes in `app/Operations/` — these bypass the one-time tracking entirely
- ❌ Operations with `__invoke()` instead of `process()` — wrong interface
- ❌ Custom artisan commands to run operations — the package handles this
- ❌ Operations without timestamps in the filename — won't be discovered

**Why Separate Migrations from Data Operations**:

1. **Rollback Safety**: Schema changes can be rolled back cleanly without affecting data
2. **Run-Once Guarantee**: The package tracks which operations have run — no manual tracking needed
3. **Idempotency**: Operations can be re-run safely (using `firstOrCreate`, transactions)
4. **Visibility**: `php artisan operations:status` shows what's run and what's pending
5. **Environment Control**: Operations run per-environment automatically during deploys
6. **Async Support**: Operations can run synchronously or be dispatched to queues
7. **Tagging**: Filter and run operations by tag for targeted deployments

**What Migrations Should Do**:
- ✅ Create tables (`Schema::create()`)
- ✅ Modify columns (`Schema::table()` with `change()`, `dropColumn()`)
- ✅ Add indexes (`$table->index()`, `$table->unique()`)
- ✅ Add foreign keys (`$table->foreign()`)
- ✅ Rename tables/columns (`Schema::rename()`)

**What Migrations Should NOT Do**:
- ❌ Insert records (`DB::table()->insert()`)
- ❌ Update records (`DB::table()->update()`)
- ❌ Delete records (`DB::table()->delete()`)
- ❌ Call Model methods
- ❌ Perform data transformations
- ❌ Make API calls or external operations

**Exception**: The ONLY acceptable data operation in migrations is dropping/truncating tables during rollback in the `down()` method.

### 10. Models Must Have a Single Responsibility

**Problem**: Models that absorb unrelated concerns become unmaintainable "god objects". When a model starts doing too many things, it loses its sharpness - the system becomes harder to reason about, test, and extend. This often manifests as a table with a large number of columns, which is a smell that the domain hasn't been properly decomposed.

**Key Principle**: Each model should own one clear domain concept. When a new requirement surfaces, ask: "Does this belong to this model, or is this a separate concept that should emit/consume from this model?"

**Real-World Example - Notifications**:

Notifications exist for one job: push time-sensitive, important information to the top of someone's view. That's it.

A notification should be:
- Read-only
- Time-sensitive
- Important
- Possibly link to a page where action can be taken
- Not aware of whether that action was completed

**❌ BAD - Notification model absorbing workflow concerns**:
```php
// app/Models/Notification.php
class Notification extends Model
{
    // ❌ Notification is now a priority queue
    protected $casts = [
        'priority' => 'integer',        // urgent, high, medium, low
        'is_recurring' => 'boolean',     // repeats on schedule
        'recurrence_cron' => 'string',   // cron expression
        'escalation_level' => 'integer', // how many times re-sent
        'due_date' => 'datetime',        // when action must be taken
        'completed_at' => 'datetime',    // tracks if user acted
        'snoozed_until' => 'datetime',   // reminder system
        'assigned_to' => 'integer',      // task assignment
    ];

    // ❌ Notification is now a task system
    public function markComplete(): void { /* ... */ }
    public function snooze(Carbon $until): void { /* ... */ }
    public function escalate(): void { /* ... */ }
    public function isOverdue(): bool { /* ... */ }
}
```

When everything is "urgent", nothing is. Priority gets inconsistently applied, everything gets marked high, and the truly important items get buried because the system lost its sharpness.

**✅ GOOD - Separate the concerns**:
```php
// app/Models/Notification.php - stays dumb on purpose
class Notification extends Model
{
    protected $casts = [
        'read_at' => 'datetime',
        'expires_at' => 'datetime',
    ];

    // ✅ Notifications only know about display
    public function isRead(): bool
    {
        return $this->read_at !== null;
    }

    public function isExpired(): bool
    {
        return $this->expires_at?->isPast() ?? false;
    }

    public function getActionUrl(): ?string
    {
        return $this->data['action_url'] ?? null;
    }
}

// app/Models/Task.php - owns workflow and state
class Task extends Model
{
    protected $casts = [
        'due_date' => 'datetime',
        'completed_at' => 'datetime',
        'priority' => TaskPriority::class,
    ];

    public function isOverdue(): bool
    {
        return $this->due_date?->isPast() && !$this->isComplete();
    }

    public function isComplete(): bool
    {
        return $this->completed_at !== null;
    }
}

// app/Actions/DeliverScheduledNotificationsAction.php
// ✅ A delivery scheduler owns cadence, pacing, and expiry
class DeliverScheduledNotificationsAction
{
    use AsAction;

    public function handle(User $user): void
    {
        // Pacing: deliver 2-3 at a time, not 16 at once
        // Expiry: skip notifications older than threshold
        // Priority: the *scheduler* decides what's most important now
        // Notifications themselves remain dumb
    }
}
```

**The Smell: Too Many Columns**

When a table has a large number of columns, it usually indicates the model is carrying concerns that belong elsewhere. Ask:

- Are some columns only relevant in certain states? → Separate model or polymorphic relationship
- Are columns grouped around a sub-concept? → Extract to a related model
- Are columns tracking workflow state? → Separate workflow/state model
- Are columns duplicating data from another model? → Use relationships instead

**❌ BAD - Incident model doing too much**:
```php
Schema::create('incidents', function (Blueprint $table) {
    $table->id();
    $table->string('title');
    $table->text('description');
    $table->string('status');
    // ❌ Investigation concerns
    $table->text('root_cause')->nullable();
    $table->text('investigation_notes')->nullable();
    $table->foreignId('investigator_id')->nullable();
    $table->timestamp('investigation_started_at')->nullable();
    // ❌ Resolution concerns
    $table->text('resolution_summary')->nullable();
    $table->text('corrective_actions')->nullable();
    $table->foreignId('resolved_by')->nullable();
    $table->timestamp('resolved_at')->nullable();
    // ❌ Notification/escalation concerns
    $table->integer('escalation_level')->default(0);
    $table->timestamp('last_escalated_at')->nullable();
    $table->timestamp('next_reminder_at')->nullable();
    // ❌ Reporting concerns
    $table->boolean('is_reportable')->default(false);
    $table->timestamp('reported_to_authority_at')->nullable();
    $table->string('authority_reference_number')->nullable();
    $table->timestamps();
});
```

**✅ GOOD - Each model owns its concept**:
```php
// incidents table - the core event
Schema::create('incidents', function (Blueprint $table) {
    $table->id();
    $table->string('title');
    $table->text('description');
    $table->string('status');
    $table->timestamps();
});

// incident_investigations - investigation lifecycle
Schema::create('incident_investigations', function (Blueprint $table) {
    $table->id();
    $table->foreignId('incident_id')->constrained();
    $table->text('root_cause')->nullable();
    $table->text('notes')->nullable();
    $table->foreignId('investigator_id')->constrained('users');
    $table->timestamp('started_at');
    $table->timestamp('completed_at')->nullable();
    $table->timestamps();
});

// incident_reports - regulatory reporting
Schema::create('incident_reports', function (Blueprint $table) {
    $table->id();
    $table->foreignId('incident_id')->constrained();
    $table->timestamp('reported_at');
    $table->string('authority_reference')->nullable();
    $table->timestamps();
});
```

**Decision Framework - Does This Belong on This Model?**

Ask these questions before adding a column or method to an existing model:

| Question | If Yes | If No |
|----------|--------|-------|
| Is this core to what the model **is**? | Add it | Extract it |
| Would removing this break the model's primary purpose? | It belongs | It's a separate concern |
| Does this introduce a new lifecycle or state machine? | New model | May belong |
| Could another model emit/consume this instead? | Decouple | May belong |
| Is this making the model harder to explain in one sentence? | Extract it | It belongs |

**Why This Matters**:

1. **Clarity** - A model you can explain in one sentence is a model your team can reason about
2. **Testability** - Focused models are easier to test without complex setup
3. **Maintainability** - Changes to notifications don't accidentally break workflow logic
4. **Scalability** - Separate concerns can be optimized, queued, or scaled independently
5. **Onboarding** - New developers can understand `Notification` without learning the task system

### 11. Granular Model Policies with Scoped Permissions

**Problem**: Stuffing authorization logic for related models into a parent Policy creates a monolithic gatekeeper that's hard to test, hard to extend, and easy to get wrong. Using broad role checks instead of specific permissions leads to access creep. And forgetting relationship-scoped checks for non-staff users opens data to the wrong people.

**Key Principles**:
1. **Default deny** - Every policy method returns `false` unless access is explicitly granted. No fall-through to `true`.
2. **One Policy per model** - If a model needs authorization, it gets its own Policy
3. **Permissions over roles** - Check `can('manage-all-supplier-prices')` not `hasRole('admin')`
4. **Permission names reflect scope** - `manage-all-supplier-prices` is clear; `manage-prices` is ambiguous
5. **Non-staff always need relationship checks** - Even with the right permission, a non-staff user must have a verified relationship to the specific resource

**❌ BAD - Authorization crammed into parent Policy**:
```php
// app/Policies/SupplierPolicy.php
class SupplierPolicy
{
    // ❌ Supplier policy is now also the price policy
    public function updatePrice(User $user, Supplier $supplier): bool
    {
        return $user->hasRole('admin');  // ❌ Role check, not permission
    }

    public function deletePrice(User $user, Supplier $supplier): bool
    {
        return $user->hasRole('admin');  // ❌ Same broad role check
    }

    public function viewPrices(User $user, Supplier $supplier): bool
    {
        return $user->hasRole('admin') || $user->hasRole('manager');
        // ❌ No scoping - any manager sees all supplier prices
    }
}
```

**✅ GOOD - Dedicated Policy with scoped permissions and Response objects**:
```php
// app/Policies/SupplierPricePolicy.php
use Illuminate\Auth\Access\Response;

class SupplierPricePolicy
{
    /**
     * Staff with global permission can manage any supplier's prices.
     * Non-staff must have the permission AND a relationship to the supplier.
     */
    public function update(User $user, SupplierPrice $price): Response
    {
        // ✅ Specific permission name that clearly reflects scope
        if ($user->hasPermission('manage-all-supplier-prices')) {
            return Response::allow();
        }

        // ✅ Non-staff: permission + relationship scoping
        if ($user->hasPermission('manage-supplier-prices')
            && $user->suppliers()->where('supplier_id', $price->supplier_id)->exists()) {
            return Response::allow();
        }

        return Response::deny('You do not have permission to update this supplier price.');
    }

    public function view(User $user, SupplierPrice $price): Response
    {
        if ($user->hasPermission('view-all-supplier-prices')) {
            return Response::allow();
        }

        if ($user->hasPermission('view-supplier-prices')
            && $user->suppliers()->where('supplier_id', $price->supplier_id)->exists()) {
            return Response::allow();
        }

        return Response::deny('You do not have permission to view this supplier price.');
    }
}
```

```php
// Controller - clean, delegates to the right policy
public function update(SupplierPrice $price, SupplierPriceData $data)
{
    $this->authorize('update', $price); // ✅ Uses SupplierPricePolicy

    UpdateSupplierPriceAction::run($price, $data);

    return redirect()->back();
}
```

**Permission Naming Convention**:

| Permission | Who it's for | What it grants |
|------------|-------------|----------------|
| `manage-all-supplier-prices` | Staff (global access) | CRUD any supplier's prices |
| `manage-supplier-prices` | Non-staff (scoped) | CRUD prices for suppliers they're related to |
| `view-all-supplier-prices` | Staff (global read) | View any supplier's prices |
| `view-supplier-prices` | Non-staff (scoped read) | View prices for their suppliers |

The pattern: `{action}-all-{resource}` for global staff access, `{action}-{resource}` for relationship-scoped access. The `all` makes it immediately obvious this grants unrestricted access.

**When to Create a Separate Policy**:

| Signal | Action |
|--------|--------|
| Parent Policy has methods referencing a child model | Extract to child Policy |
| Authorization logic differs from the parent model's | Separate Policy |
| The resource has its own route/controller | It needs its own Policy |
| You're passing a parent model just to authorize a child operation | Wrong Policy |

**The Two-Layer Authorization Pattern**:

```
┌─────────────────────────────────────────────┐
│ Layer 1: Permission Check                   │
│ "Does this user have the right permission?" │
│                                             │
│ Staff:     manage-all-supplier-prices  ──────── Global access (done)
│ Non-staff: manage-supplier-prices      ──────── Proceed to Layer 2
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│ Layer 2: Relationship/Scope Check           │
│ "Does this user have access to THIS record?"│
│                                             │
│ $user->suppliers()->where(...)->exists()    │
└─────────────────────────────────────────────┘
```

Non-staff users always go through both layers. A permission alone is never enough - it must be paired with a relationship check to the specific resource.

**Default Deny - The Fail-Safe Default**:

Every authorization check must default to deny. Access is only granted when explicitly allowed. This is a fail-safe: if a new role, document type, or edge case is introduced, it's denied until someone consciously grants it. The alternative — defaulting to allow — means a missed condition silently leaks access.

**❌ BAD - Falls through to `return true`**:
```php
public function download(User $user, Document $document): bool
{
    $roleName = $user->roles->first()?->name;
    $documentType = get_class($document->documentable);

    // ❌ Only blocks specific cases, everything else falls through to true
    if (in_array($roleName, ['Recipient', 'Recipient Representative'])) {
        if ($documentType !== PackageStatement::class
            || ! ($document->documentable->package->recipient_id === $user->id
                || in_array($user->id, $document->documentable->package->representatives()->pluck('users.id')->toArray()))
        ) {
            return false;
        }
    }

    return true; // ❌ Any role/type not explicitly blocked gets access
}
```

This is fragile. It tries to enumerate what's *not* allowed and lets everything else through. When a new role or document type appears, it silently gets access because it wasn't in the deny list.

**✅ GOOD - Returns `Response` with clear reasons**:
```php
use Illuminate\Auth\Access\Response;

public function download(User $user, Document $document): Response
{
    $roleName = $user->roles->first()?->name;
    $documentType = get_class($document->documentable);

    if (in_array($roleName, ['Recipient', 'Recipient Representative'])) {
        $package = $document->documentable->package;
        $isRecipientOrRepresentative = $package->recipient_id === $user->id
            || in_array($user->id, $package->representatives()->pluck('users.id')->toArray());

        // ✅ Explicitly grant only the allowed case
        if ($documentType === PackageStatement::class && $isRecipientOrRepresentative) {
            return Response::allow();
        }

        return Response::deny('You can only download statements for packages you are associated with.');
    }

    // Staff with explicit permission
    if ($user->hasPermission('download-all-documents')) {
        return Response::allow();
    }

    return Response::deny('You do not have permission to download this document.');
}
```

**The Pattern**:
- Always return `Response::allow()` or `Response::deny('reason')` — never bare `true`/`false`
- Structure policy methods as a series of `if → Response::allow()` gates
- Each gate explicitly checks all required conditions before granting access
- The method always ends with `Response::deny('reason')` — the reason explains why access was denied
- Never use a catch-all `Response::allow()` at the end of a policy method
- Deny reasons should be human-readable and specific enough to debug without reading the policy code

```php
use Illuminate\Auth\Access\Response;

// ✅ The shape every policy method should follow
public function someAction(User $user, Model $model): Response
{
    // Gate 1: explicit global access
    if ($user->hasPermission('do-all-things')) {
        return Response::allow();
    }

    // Gate 2: explicit scoped access
    if ($user->hasPermission('do-things') && $user->relatedTo($model)) {
        return Response::allow();
    }

    // Nothing matched — deny with a reason
    return Response::deny('You do not have permission to perform this action on this resource.');
}
```

**Why This Matters**:

1. **Least privilege** - Users only access what they're explicitly allowed to, scoped to their relationships
2. **Fail-safe** - New roles, document types, or conditions are denied until explicitly granted
3. **Clarity** - `manage-all-supplier-prices` is unambiguous; `admin` role is not
4. **Testability** - Each Policy is small, focused, and easy to test in isolation
5. **Auditability** - Permission names in the database tell you exactly what access was granted
6. **Safety** - Relationship scoping prevents data leakage between organisations/suppliers
7. **Debuggability** - `Response::deny('reason')` surfaces in logs, error messages, and tests — bare `false` gives you nothing

**Always Use `Response`, Never Bare `bool`**:

Policies and action `authorize()` methods must return `Illuminate\Auth\Access\Response`, not `bool`.

`Response::deny('reason')` gives developers and users a clear explanation of why access was denied. A bare `return false` forces someone to read the policy code to understand the failure — and in logs or error screens, it shows up as a generic 403 with no context.

```php
// ❌ BAD — bare bool, no context on denial
public function update(User $user, Article $article): bool
{
    return $user->hasPermission('update-articles');
}

// ✅ GOOD — Response with reason
use Illuminate\Auth\Access\Response;

public function update(User $user, Article $article): Response
{
    if ($user->hasPermission('update-articles')) {
        return Response::allow();
    }

    return Response::deny('You do not have the update-articles permission.');
}
```

### 12. DTO Persistence Must Be Explicit

**Problem**: Passing `->toArray()` from a DTO/value object directly into ORM `create()` / `update()` couples database writes to DTO structure. When DTOs evolve (computed fields, renamed properties, nested structures), persistence breaks without touching the DB layer.

**Real Example**: `AddressData::toArray()` included a computed `label` field. A projector passed this directly to `create()` → SQL error: "unknown column 'label'".

**❌ BAD - Implicit mapping**:
```php
// DTO might have computed fields, nested objects, or renamed properties
$contact->address()->create($event->address->toArray());
```

**✅ GOOD - Explicit field mapping**:
```php
$address = $event->address;
$contact->address()->create([
    'line_1'   => $address->line1,
    'line_2'   => $address->line2,
    'suburb'   => $address->suburb,
    'state'    => $address->state,
    'postcode' => $address->postcode,
    'country'  => $address->country,
]);
```

**Why This Matters**:

1. **Decoupling** - DB schema and DTO structure can evolve independently
2. **Visibility** - Clear which fields are persisted vs computed
3. **Safety** - Prevents accidental persistence of computed/derived fields
4. **Debugging** - When persistence fails, the mapping is explicit and traceable

**Rule of Thumb**: ORM `create()` / `update()` calls should always explicitly list the fields being persisted.

### 13. Event Sourcing: Design Events for Future Business Questions

**Problem**: Event sourcing records *what happened*, not just what the current state is. Every event is an immutable fact. If the events aren't granular enough, you can't answer business questions later without retroactively adding events — which defeats the purpose. If events are too coarse, you lose the history you went to the effort of capturing.

**Key Principles**:
1. **Most granular event that adds business value** - Each event should represent one meaningful thing that happened. Be pragmatic, but lean toward granularity.
2. **"Can We Answer This Later?" acceptance criteria** - Validate event design against future business questions. If the events can't answer the question, the design is incomplete.
3. **Models as side effects of events** - Read models (projections) are created/updated by projectors reacting to events, not by actions writing directly to tables.
4. **Aggregate roots enforce business rules** - The aggregate decides what events can be recorded and in what order. Business constraints live here, not in controllers or actions.

**The "Can We Answer This Later?" Test**:

The format: *If the business comes to us later and asks [question], the events stored in `{domain}_stored_events` should allow us to answer it — without adding new events retroactively.*

This is the acceptance criteria for event design. Run every proposed event list through this test at the architecture gate.

**Real-World Example - Signatures (DocuSign Envelope Model)**:

A `Signature` is the request/envelope attached to a thing. A `SignatureItem` is each recipient's individual sign-off.

**Initial event list**:
```php
'signature_created'        => SignatureCreatedEvent::class,
'signature_sent'           => SignatureSentEvent::class,
'signature_item_viewed'    => SignatureItemViewedEvent::class,
'signature_item_captured'  => SignatureItemCapturedEvent::class,
'signature_item_declined'  => SignatureItemDeclinedEvent::class,
'signature_expired'        => SignatureExpiredEvent::class,
'signature_cancelled'      => SignatureCancelledEvent::class,
```

**Now run the acceptance criteria**:

| Business Question | Can Events Answer It? | Missing Events |
|---|---|---|
| What is the average time between a signature request being sent and the last recipient completing their signature? | ✅ `signature_sent` timestamp → last `signature_item_captured` timestamp | — |
| Have signatures sent seen an uptick or downtick over 30-day blocks, across the book and per staff member? | ✅ `signature_created` with staff user context, aggregate over time | — |
| How many recipients open/view a signature request but never sign it? | ✅ `signature_item_viewed` without a subsequent `signature_item_captured` | — |
| Who (staff user) cancelled this signature request, and why? Show me the full history. | ⚠️ `signature_cancelled` needs to capture the acting user and reason | Ensure event payload includes `cancelled_by` and `reason` |
| How many times did a staff user amend a signature request after it was sent — e.g. add a recipient, remove a recipient, or change the expiry date? | ❌ No events for post-send modifications | `SignatureItemAddedEvent`, `SignatureItemRemovedEvent`, `SignatureExpiryUpdatedEvent` |
| When we use ordered signing (signer 1 → 2 → 3), which position in the sequence causes the longest delays? | ✅ `signature_item_captured` timestamps with sequence position in payload | Ensure `sequence_position` is in event payload |

The test exposed that the initial event list was missing post-send amendment events. Without those, we can't tell the business how often envelopes are modified after sending. It also surfaced a business rule decision: *Can a sent envelope be modified?* If yes, those modifications must be events. If no, the aggregate root should enforce that — and we need to make that decision explicitly, not by accident.

**Updated event list after acceptance criteria review**:
```php
// Signature lifecycle
'signature_created'          => SignatureCreatedEvent::class,
'signature_sent'             => SignatureSentEvent::class,
'signature_expired'          => SignatureExpiredEvent::class,
'signature_cancelled'        => SignatureCancelledEvent::class,

// Post-send amendments (if business allows modification after sending)
'signature_item_added'       => SignatureItemAddedEvent::class,
'signature_item_removed'     => SignatureItemRemovedEvent::class,
'signature_expiry_updated'   => SignatureExpiryUpdatedEvent::class,

// Recipient-level events
'signature_item_viewed'      => SignatureItemViewedEvent::class,
'signature_item_captured'    => SignatureItemCapturedEvent::class,
'signature_item_declined'    => SignatureItemDeclinedEvent::class,
```

**Implementation Pattern (Spatie Laravel Event Sourcing)**:

```php
// The aggregate root enforces business rules
class SignatureAggregateRoot extends AggregateRoot
{
    private bool $isSent = false;
    private bool $isCancelled = false;

    public function createSignature(SignatureData $data): self
    {
        $this->recordThat(new SignatureCreatedEvent(
            signatureUuid: $this->uuid(),
            packageId: $data->packageId,
            createdBy: $data->createdBy,
            items: $data->items,
            expiresAt: $data->expiresAt,
            signingOrder: $data->signingOrder,
        ));

        return $this;
    }

    public function send(): self
    {
        // ✅ Aggregate enforces business rules
        if ($this->isSent) {
            throw SignatureAlreadySent::forSignature($this->uuid());
        }

        $this->recordThat(new SignatureSentEvent(
            signatureUuid: $this->uuid(),
            sentAt: now(),
        ));

        return $this;
    }

    public function cancel(int $cancelledBy, string $reason): self
    {
        if ($this->isCancelled) {
            throw SignatureAlreadyCancelled::forSignature($this->uuid());
        }

        // ✅ Event payload captures who and why — full audit trail
        $this->recordThat(new SignatureCancelledEvent(
            signatureUuid: $this->uuid(),
            cancelledBy: $cancelledBy,
            reason: $reason,
            cancelledAt: now(),
        ));

        return $this;
    }

    // State is rebuilt from events
    protected function applySignatureSentEvent(SignatureSentEvent $event): void
    {
        $this->isSent = true;
    }

    protected function applySignatureCancelledEvent(SignatureCancelledEvent $event): void
    {
        $this->isCancelled = true;
    }
}
```

```php
// Projector creates/updates read models as side effects of events
class SignatureProjector extends Projector
{
    public function onSignatureCreated(SignatureCreatedEvent $event): void
    {
        $signature = Signature::create([
            'uuid' => $event->signatureUuid,
            'package_id' => $event->packageId,
            'created_by' => $event->createdBy,
            'expires_at' => $event->expiresAt,
            'signing_order' => $event->signingOrder,
            'status' => SignatureStatus::Draft,
        ]);

        foreach ($event->items as $index => $item) {
            SignatureItem::create([
                'signature_id' => $signature->id,
                'user_id' => $item['userId'],
                'sequence_position' => $index + 1,
                'status' => SignatureItemStatus::Pending,
            ]);
        }
    }

    public function onSignatureItemCaptured(SignatureItemCapturedEvent $event): void
    {
        SignatureItem::where('uuid', $event->signatureItemUuid)
            ->update([
                'status' => SignatureItemStatus::Captured,
                'captured_at' => $event->capturedAt,
            ]);
    }
}
```

```php
// Action dispatches to aggregate — not directly to models
class CreateSignatureAction
{
    use AsAction;

    public function handle(SignatureData $data): void
    {
        SignatureAggregateRoot::retrieve(Str::uuid()->toString())
            ->createSignature($data)
            ->persist();
    }
}
```

**Event Payload Checklist**:

Every event should capture enough context to be useful in isolation:

| Field | Why |
|-------|-----|
| Who triggered it | Audit trail (`created_by`, `cancelled_by`) |
| When it happened | Timeline analysis (timestamp in event metadata) |
| What changed | The specific data (`new_expiry`, `added_user_id`) |
| Why (if applicable) | Business context (`reason`, `cancellation_reason`) |
| Sequence/position | Ordering analysis (`sequence_position` for ordered signing) |

**Writing "Can We Answer This Later?" Acceptance Criteria**:

When designing events for a new domain, write 5-10 business questions the events should be able to answer. Format them as acceptance criteria in the spec or plan:

```markdown
## Event Sourcing Acceptance Criteria

Events in `{domain}_stored_events` must be able to answer:

- [ ] What is the average time between [start event] and [end event]?
- [ ] How many [things] were [actioned] but never [completed]?
- [ ] Who [did action] and when? Show me the full history.
- [ ] Has [metric] trended up or down over [time period], per [dimension]?
- [ ] Which step in [workflow] causes the longest delays?
- [ ] How often is [thing] modified after [milestone], and what was changed?
```

If the proposed event list can't answer all of these, the event design is incomplete. Add the missing events before implementation.

**What Events Should NOT Be**:

- ❌ CRUD wrappers (`SignatureUpdatedEvent` carrying the entire model) — too coarse, you lose what actually changed
- ❌ State snapshots — events are facts about what happened, not the current state
- ❌ Technical events (`SignatureCacheInvalidatedEvent`) — events are business facts, not infrastructure
- ❌ Composite events (`SignatureSentAndItemsCreatedEvent`) — one thing happened per event

### 14. Semantic Documentation for Lifecycle & Domain Columns

**Problem**: Boolean flags, status columns, and other domain-significant fields on models silently accumulate meaning over time. Different code paths set them with different intent, defaults change, and legacy data introduces ambiguity. Without documentation at the model level, engineers reverse-engineer meaning from scattered code — or worse, guess wrong and introduce bugs.

**Key Principle**: Not every column needs this — `created_at`, `name`, `email` are self-evident. But columns that represent **lifecycle state**, **domain flags**, or **externally-derived status** must carry their meaning on the model itself, because the column name alone doesn't tell you enough.

**Which columns need this?**

| Column type | Examples | Why it needs documentation |
|---|---|---|
| Boolean flags | `is_registered`, `is_active`, `is_verified` | What sets true? What sets false? Is it a snapshot or live? |
| Status columns | `status`, `state`, `phase` | What are the valid transitions? Who/what triggers them? |
| Externally-derived | `abn_status`, `verification_result` | Where does the data come from? How fresh is it? |
| Temporal flags | `locked_at`, `suspended_until` | What triggers the lock? What clears it? |

Self-evident columns like `name`, `email`, `created_at`, `organisation_id` (FK) do **not** need this treatment.

**What the documentation must include:**

1. **Meaning** (1-2 lines) — What the column semantically represents
2. **Lifecycle** — What code paths set it, and under what conditions
3. **Caveats** (only when ambiguous) — If the column name is misleading or commonly misinterpreted, note what it does NOT mean. Not every column needs this — only add caveats when the name could reasonably lead someone to a wrong assumption

**Where to put it:**

Two locations on the model:
- **`@property` PHPDoc** on the class — the canonical definition, visible in IDE hover
- **Comment block above `$casts`** — a quick-reference lifecycle summary for developers reading the model

**✅ GOOD Example** — `Business.is_registered`:

```php
/**
 * @property int $id
 * @property int $organisation_id
 * @property string $business_name
 * @property bool $is_registered Whether this business's name appears in the parent Organisation's
 *                                registered_business_names list from the Australian Business Register (ABR).
 *                                True means the business_name was confirmed as a registered business name
 *                                under the organisation's ABN at the time of creation or last ABR sync.
 *                                This is a point-in-time snapshot, not a live status — it is only refreshed
 *                                when the BulkUpdateOrganisationsWithAbrCommand runs or when the business
 *                                is created via an ABR lookup flow.
 *                                Caveats:
 *                                - Does NOT indicate the business has completed onboarding or is "active".
 *                                - RegisterSupplierAction hardcodes this to true regardless of ABR data.
 *                                - A false value means the business_name was not found in the ABR registered
 *                                  names list, or the business was created before the flag was backfilled.
 */
class Business extends Model
{
    /**
     * Domain flags / lifecycle notes:
     *
     * is_registered — Indicates whether business_name matches one of the Organisation's
     * registered_business_names from the ABR (Australian Business Register).
     *
     * Set to true:
     *  - CreateOrUpdateOrganisationFromAbrLookupAction: always true (business created with legal trading name)
     *  - Nova Organisation afterCreate: always true (admin creates org via ABR)
     *  - RegisterSupplierAction: always true (supplier self-registration, does NOT verify against ABR list)
     *  - RegisterSupplierWithPaymentDetails: true only if business_name is in registered_business_names
     *
     * Set to true/false (recalculated):
     *  - BulkUpdateOrganisationsWithAbrCommand: re-evaluates all businesses against current ABR data
     *
     * Defaults to false in the database schema.
     */
    protected function casts(): array
    {
        return [
            'is_registered' => 'boolean',
        ];
    }
}
```

**❌ BAD — No documentation, meaning is a mystery:**

```php
class Business extends Model
{
    protected $fillable = ['organisation_id', 'business_name', 'is_registered'];

    protected function casts(): array
    {
        return [
            'is_registered' => 'boolean', // What does this mean? Who sets it? Is it live?
        ];
    }
}
```

**❌ BAD — Misleading or shallow documentation:**

```php
/**
 * @property bool $is_registered Whether the business is registered.
 */
```

This restates the column name. It doesn't tell you *registered with what*, *who sets it*, or *whether it's a snapshot or live status*. A developer reading this still has to search the codebase.

**When to write this documentation:**

- **New columns**: Document at creation time — the author knows the intent best
- **Existing columns**: Document when you encounter an undocumented flag during development. Search for all writes and reads, infer the lifecycle, and add the documentation. If anything is unknown, say so explicitly (e.g., "Legacy data may have false values from before ABR sync was introduced")
- **Architecture gate**: Plan must identify which columns need documentation and provide the semantic definition

**The test**: Could a new developer read the `@property` PHPDoc and understand what this column means and how it gets set — without searching the codebase? If no, the documentation is insufficient.

### 15. Feature Flag Gating (Backend + Frontend)

**Problem**: A feature behind a flag that only checks one layer (backend OR frontend) leaks access. Users can hit ungated API routes directly, or the UI shows controls that 403 when clicked. Feature flags must gate at both layers consistently, using the same flag name.

**Our Stack**:

| Layer | Tool | Mechanism |
|-------|------|-----------|
| **Backend routes** | Laravel Pennant | `check.feature.flag` middleware on route groups |
| **Backend logic** | Laravel Pennant | `Feature::active('flag-name')` in services/controllers |
| **Frontend UI** | PostHog | `<HasFeatureFlag feature="flag-name">` component with `#enabled`/`#disabled` slots |

Pennant reads from PostHog in production (`PENNANT_STORE=posthog`) and from the database in development. The frontend reads directly from PostHog via the JS SDK. Both use the same flag name string.

**The Pattern — Three Gating Layers**:

```
┌─────────────────────────────────────────────────────────┐
│ Layer 1: Route Middleware (Backend)                      │
│ check.feature.flag:{flag-name}                          │
│ → 403 if flag is off — no controller code runs          │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│ Layer 2: In-Code Check (Backend)                        │
│ Feature::active('flag-name')                            │
│ → Conditionally show sidebar links, nav items, etc.     │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│ Layer 3: Frontend Component (Vue)                       │
│ <HasFeatureFlag feature="flag-name">                    │
│   <template #enabled> → show the UI                     │
│   <template #disabled> → hide or show fallback          │
│ → Controls what the user sees, not what they can access │
└─────────────────────────────────────────────────────────┘
```

**Reference Implementation — `lead-to-hca-conversion`**:

**Layer 1 — Route middleware** (all lead routes gated):
```php
// domain/Lead/Routes/leadRoutes.php
Route::middleware([
    'web.authenticated',
    'user.check_has_login',
    'verified',
    'check.feature.flag:lead-to-hca-conversion',  // ← gate entire route group
])
->prefix('staff/leads')
->name('staff.leads.')
->group(function () {
    Route::get('/', [StaffLeadController::class, 'index']);
    Route::get('/{lead}/convert', [LeadConversionController::class, 'show']);
    // ...
});
```

The middleware (`CheckFeatureFlag`) aborts with 403 if the flag is inactive:
```php
// app/Http/Middleware/CheckFeatureFlag.php
public function handle(Request $request, Closure $next, string $feature): Response
{
    if (! Feature::active($feature)) {
        abort(403);
    }

    return $next($request);
}
```

**Layer 2 — Sidebar/navigation** (conditionally rendered server-side):
```php
// app/Services/Sidebar/StaffSidebarService.php
Feature::active('lead-to-hca-conversion') ? [
    'type' => 'link',
    'label' => 'Leads',
    'icon' => 'heroicons:document-text',
    'href' => route('staff.leads.index'),
] : null,
```

**Layer 3 — Frontend UI** (button visibility via PostHog):
```vue
<!-- resources/js/Pages/Staff/Leads/Show.vue -->
<HasFeatureFlag feature="lead-to-hca-conversion">
    <template #enabled>
        <Link :href="route('staff.leads.convert', { lead: lead.id })">
            <CommonButton
                label="Convert Lead"
                leadingIcon="heroicons:arrow-path-rounded-square"
            />
        </Link>
    </template>
</HasFeatureFlag>
```

The `HasFeatureFlag` component checks PostHog client-side:
```vue
<!-- resources/js/Components/HasFeatureFlag.vue -->
<template>
    <slot name="enabled" v-if="hasFeatureFlag" />
    <slot name="disabled" v-else />
</template>

<script setup>
const props = defineProps({ feature: { type: String, required: true } });
const hasFeatureFlag = ref(false);
const { posthog } = usePostHog();

onMounted(() => {
    posthog.onFeatureFlags(() => {
        hasFeatureFlag.value = props.feature && posthog.isFeatureEnabled(props.feature);
    });
});
</script>
```

**Testing Feature Flags**:

```php
// Enable for test
Feature::define('lead-to-hca-conversion', true);

// Test routes return 403 when disabled
Feature::define('lead-to-hca-conversion', false);
$response = $this->get(route('staff.leads.index'));
$response->assertForbidden();
```

**Checklist for New Feature Flags**:

| Step | What to do |
|------|------------|
| **1. Create in PostHog** | Create the flag with the same `kebab-case` name used in code |
| **2. Gate routes** | Apply `check.feature.flag:{name}` middleware to all route groups for the feature |
| **3. Gate navigation** | Use `Feature::active('{name}')` to conditionally render sidebar/nav items |
| **4. Gate frontend UI** | Wrap interactive elements in `<HasFeatureFlag feature="{name}">` |
| **5. Test both states** | Test with `Feature::define('{name}', true)` and `Feature::define('{name}', false)` |
| **6. Design for flag off** | The app must work with the flag off — the off state is the safe default |
| **7. Clean up after rollout** | Once at 100%, remove the flag from PostHog and delete all conditional code |

**Common Pitfalls**:

- Frontend-only gating — user can't see the button but can still hit the route directly
- Backend-only gating — user sees a button that 403s when clicked
- Inconsistent flag names between backend and frontend (PostHog is case-sensitive)
- Forgetting to gate sidebar/navigation — feature link appears even when disabled
- Stale flags — feature is 100% rolled out but conditional code remains, adding complexity

---

## Enforcement

These principles must be verified during:
- **Gate 3 (Architecture)**: Plan must show proper separation
- **Gate 4 (Code Quality)**: Code review must verify implementation
- **PR Reviews**: Reviewers must catch violations

**Red Flags** (Auto-fail architecture gate):
- ❌ Hardcoded business rules in `.vue` files (must be backend-powered/dynamic)
- ❌ Magic number IDs (1, 2, 5) instead of constants
- ❌ `Request $request` parameters in controller methods
- ❌ `int $id` parameters instead of Model instances
- ❌ Common/shared components with hardcoded business rules
- ❌ Custom Action classes without `use AsAction` trait (must use Lorisleiva package)
- ❌ Authorization checks (`$this->authorize()`, `Gate::check()`, `$user->can()`, Policy calls) inside `handle()` or `asController()` instead of the action's `authorize()` method
- ❌ Business logic methods in Data classes/DTOs (belongs in Actions or Models)
- ❌ Data insert/update/delete operations in migrations (use Operations or Seeders)
- ❌ Plain PHP classes in `app/Operations/` instead of `timokoerber/laravel-one-time-operations` (must use `php artisan operations:make`)
- ❌ `->toArray()` from DTOs directly into ORM `create()`/`update()` (must explicitly map fields)
- ❌ Models overloaded with unrelated concerns (wide tables, mixed lifecycles, god objects)
- ❌ Authorization for child models crammed into parent Policy (each model gets its own Policy)
- ❌ Role-based checks (`hasRole('admin')`) instead of specific permissions (`hasPermission('manage-all-supplier-prices')`)
- ❌ Non-staff users authorized by permission alone without relationship/scope check to the specific resource
- ❌ Policy methods that fall through to allow (must default deny — only `Response::allow()` when explicitly granted)
- ❌ Bare `return true` / `return false` in Policies or action `authorize()` methods (must use `Response::allow()` / `Response::deny('reason')`)
- ❌ Event-sourced domain without "Can We Answer This Later?" acceptance criteria validated
- ❌ Coarse events that wrap entire model updates instead of capturing what specifically changed
- ❌ Actions writing directly to read models instead of going through aggregate → event → projector
- ❌ Non-trivial lifecycle or domain columns (`is_registered`, `is_active`, `status`, etc.) on models without a `@property` PHPDoc explaining what the column means and what sets it
- ❌ Vue components planned without `<script setup lang="ts">` (all Vue must be TypeScript)
- ❌ Plan shows `defineProps({...})` (Options API) instead of `defineProps<Props>()` (TypeScript generic)
- ❌ Plan uses `interface` instead of `type` for Props or Emits
- ❌ Plan shows inline type literals in `defineEmits<{...}>()` instead of named `type Emits`
- ❌ Plan accepts `any` types for backend data without defining TypeScript types
- ❌ Plan modifies existing `.vue` files missing `lang="ts"` without planning to add it
- ❌ No TypeScript types defined for data passed from controllers to Vue pages
- ❌ Plan creates new form field components when existing common/shared components already cover the need
- ❌ Plan creates a bespoke component for a general-purpose UI pattern (popover, dropdown, tooltip, confirmation dialog, etc.) instead of building or reusing a `Common*.vue` component
- ❌ Plan uses `function` keyword instead of arrow functions in Vue components
- ❌ Multi-step wizard planned with Pinia form state or per-step `useForm` instead of a single parent-level `useForm`
- ❌ Form state duplicated between `useForm` and a store (unless wizard spans separate Inertia page visits)
- ❌ Manual server-side error mapping when Inertia's `form.errors` already handles it
- ❌ Pinia store for form state, single-component UI state, or data already in `usePage().props`
- ❌ Store named after UI element (`useHeaderStore`) instead of domain concern (`useNotificationStore`)
- ❌ New Pinia store without justification of why local state or Inertia props aren't sufficient
- ❌ Feature behind a flag with only frontend gating (routes still accessible without the flag)
- ❌ Feature behind a flag with only backend gating (UI shows controls that 403 when clicked)
- ❌ Feature flag name mismatch between backend (Pennant) and frontend (PostHog)
- ❌ Sidebar/navigation links visible for a flagged feature without `Feature::active()` check
