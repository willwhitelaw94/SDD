---
title: "Design Kickoff: Simplified Needs Module (Needs v2)"
status: Draft
created: 2026-02-12
---

# Design Kickoff: Simplified Needs Module (Needs v2)

**Epic:** RNC2 — Future State Care Planning
**Spec:** [spec.md](spec.md)

---

## Context

### User Research

| Aspect | Answer | Impact on Design |
|--------|--------|------------------|
| Primary User | Coordinator / Care Partner | Needs efficiency — fast data entry, minimal clicks |
| Secondary User | Clinical Team | Reviews linkages — needs clear visual of need-risk-budget chain |
| Device Priority | Desktop-first | Can use multi-column layouts, wizard with sidebar panels |
| Usage Frequency | Daily (power users) | Worth investing in keyboard shortcuts, quick-add flows |
| Context | Multitasking, time-pressured, often on calls | Must be completable in <2 min, no page-blocking flows |
| Current Pain | 20+ min form, "pretty wordy", service-focused not person-focused | Radical simplification — 3 fields + optional linking |

### Competitive Research

**[ShiftCare](https://shiftcare.com/us/care-management-software/care-plans)** — Australian aged care software
- Care plans connect directly to shift tasks — every need flows into daily work
- Simple, quick to set up — prioritizes speed over comprehensiveness
- Care notes capture while "fresh in the mind" — shift-linked form templates
- **Lesson**: Keep the form lightweight; linking to shifts/tasks is the value, not the form itself

**[AlayaCare](https://alayacare.com/blog/keys-to-a-quality-home-care-software-experience-ui-usability-ux/)** — End-to-end home care platform
- Emphasizes three UX pillars: UI, Usability, UX
- More complex than ShiftCare — agency employees and patients can complete tasks effectively
- **Lesson**: Balance power-user features with accessibility; don't sacrifice speed for comprehensiveness

**General pattern**: Both platforms use flat forms, not wizards. But neither has the needs-risk-budget linking that TC Portal requires. The wizard is justified here because Step 1 (define) is the core value, and Steps 2-3 (link) are the differentiator. Wizard keeps the happy path fast (can skip steps) while surfacing the linking affordance.

### Existing Implementation Audit

**Current State**: PrimeVue DataTable with Sidebar for add/edit

**What works well:**
- Category column gives quick visual grouping
- Action buttons are compact (icon-only, ghost variant)
- Delete confirmation dialog prevents accidents
- "Add to Care Plan" toggle is inline

**Pain points:**
- Sidebar opens a massive form (300+ fields behind conditional sections)
- No visual connection between needs and risks/budget
- DataTable rows are dense — hard to scan at a glance
- No empty state guidance — just "No data available"
- No status lifecycle — everything is "active" forever
- PrimeVue components (will be replaced with Common components)

---

## Strategy

### Design Principles

**North Star:** "Capture needs, not paperwork"

**Supporting Principles:**
1. **Person-first language** — Categories describe the person's life (Nutrition, Mobility, Social Connection), not services or compliance requirements
2. **Progressive disclosure** — Step 1 is mandatory and fast; Steps 2-3 are optional enrichment that surfaces when you're ready
3. **Visual hierarchy = Maslow hierarchy** — Physiological needs appear first, self-actualisation last. The layout teaches the framework
4. **Linked by default** — The system encourages (but doesn't require) connecting needs to risks and budgets. The wizard makes linking effortless, not mandatory

### Emotional Design

**Target Emotion:** Relieved — "That was so much easier than the old form"

**Design implications:**
- Minimal required fields (category + description + funding source = done)
- No multi-page scrolling through irrelevant sections
- Clear "Save" at every point — no fear of losing work
- Wizard steps show progress without pressure (skip allowed)

**Frustration Risks:**
- If wizard feels like "more steps" rather than "simpler steps" → mitigate with skip-forward and compact layout
- If categories don't match the need → mitigate with description field as escape valve
- If risk/budget linking feels forced → mitigate with clear "Skip" or "Do this later" affordance

### Build Size Assessment

**Size:** Medium (BMW 3 Series)

**Rationale:**
- 2 modal pages (Create, Edit) wrapping 1 wizard form
- 1 new list view component (replacing DataTable section)
- 3 wizard step components (lightweight)
- Uses existing `CommonStepNavigation`, `CommonModal`, `CommonSelectMenu`, `CommonFormField`, `CommonButton`, `CommonBadge`
- New: drag-and-drop for reordering (needs library integration)
- New: Maslow category selector (grouped visual picker)

---

## Constraints

### Accessibility Requirements

**WCAG Target:** Level AA

**Specific Requirements:**
- [x] Keyboard navigation — wizard steps navigable via Tab/Enter, step switcher via arrow keys
- [x] Screen reader — ARIA labels on wizard steps, form fields, category groups
- [x] Focus management — focus moves to first field when advancing wizard steps
- [ ] High contrast — not required for MVP (Tailwind defaults are sufficient)
- [ ] Cognitive accessibility — simplified by design (3 fields vs 300+)

### Security & Privacy

**Sensitive Data:**
- [x] Personal information (recipient care needs)
- [x] Health information (clinical needs, risk associations)

**Visibility Rules:**
- Coordinators see needs for packages they're assigned to (existing `manage-need` permission)
- Clinical Team can view all needs for review
- No recipient-facing view in v2 (future consideration)

**Audit Requirements:**
- All CRUD events captured in event store with user ID and timestamp
- Soft delete — archived needs retained for compliance

### Dependencies

**Depends On:**
- Existing risk data (`package_risks` via `riskables` pivot)
- Existing budget items (`package_budget_items`)
- `CommonStepNavigation` component (exists, reka-ui based)
- `CommonModal` component (exists, HeadlessUI based)
- `CommonSelectMenu` component (exists, reka-ui Combobox with Fuse.js search)

**Blocks:**
- Care plan PDF generation (will consume v2 needs data)
- AI-assisted need creation (will create v2 needs from assessments)

---

## Planning

### Component Architecture

```
PackageNeeds.vue (existing tab — conditionally shows v1 or v2)
│
├── [v2 flag ON] PackageNeedsV2.vue (new list view)
│   ├── MaslowPyramid.vue (collapsible, toggle via [△ Maslow] button)
│   │   ├── 5 clickable tiers with need counts
│   │   ├── Filter emit on tier click
│   │   └── Dimmed state for tiers with 0 needs
│   ├── Maslow level headers (Physiological, Safety, ...)
│   ├── Draggable need cards within each level
│   │   ├── CommonBadge (category, status, funding source)
│   │   ├── Description preview
│   │   ├── Risk count + Budget item count badges
│   │   └── Action buttons (Edit, Archive, Delete)
│   ├── Status filter (Active / Draft / Archived)
│   └── "Add Need" button → opens Create modal
│
├── NeedsV2/Create.vue (Inertia modal page)
│   └── NeedV2WizardForm.vue
│       ├── CommonStepNavigation (3 steps)
│       ├── [v-show] NeedV2StepDefine.vue
│       │   ├── Category picker (grouped by Maslow level)
│       │   ├── CommonTextarea (description)
│       │   ├── CommonTextarea (how will be met — optional)
│       │   ├── CommonSelectMenu (funding source)
│       │   └── CommonFormField (funding source other — conditional)
│       ├── [v-show] NeedV2StepRisks.vue
│       │   ├── CommonSelectMenu (multi, searchable, existing risks)
│       │   └── CommonEmptyPlaceholder (if no risks exist)
│       └── [v-show] NeedV2StepBudget.vue
│           ├── CommonSelectMenu (multi, searchable, existing budget items)
│           └── CommonEmptyPlaceholder (if no budget items exist)
│
└── NeedsV2/Edit.vue (Inertia modal page — same wizard, pre-populated)
```

### Key Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| **Wizard container** | `CommonModal` (right slide) | Consistent with existing add/edit patterns; doesn't navigate away from the package |
| **Step navigation** | `CommonStepNavigation` | Already built, reka-ui based, supports completed/current/upcoming states |
| **Step persistence** | `v-show` (not `v-if`) | Preserves form state when navigating between steps |
| **Category picker** | Grouped visual selector (not dropdown) | Maslow levels are the key UX differentiator — they need visual prominence, not buried in a dropdown |
| **Risk/Budget linking** | `CommonSelectMenu` with `multiple` | Existing component with fuzzy search, tag display, and keyboard nav |
| **List layout** | Cards grouped by Maslow level (not DataTable) | Cards show more info at a glance; grouping reinforces the Maslow framework |
| **Maslow pyramid filter** | Collapsible pyramid with per-tier need counts, clickable to filter list | Visual summary of care needs distribution; hidden by default via [△ Maslow] toggle; audit value for clinical overview |
| **Drag-and-drop** | `@vueuse/core` `useSortable` or `vuedraggable` | No existing Common component; need library. `useSortable` is lighter |
| **Status filter** | Tab pills (Active / Draft / Archived) | Quick toggle, default to Active, Archived hidden but accessible |
| **Form validation** | Server-side on submit only | No per-step validation — keeps forward navigation frictionless |

### Edge Case Inventory

| Edge Case | How to Handle | Priority |
|-----------|---------------|----------|
| No needs yet (empty state) | `CommonCardEmptyState` with Maslow illustration, "Add your first need" CTA | P1 |
| No risks on package (Step 2) | `CommonEmptyPlaceholder` with "No risks recorded yet — you can add them later" | P1 |
| No budget items on package (Step 3) | `CommonEmptyPlaceholder` with "No budget items yet — you can link them later" | P1 |
| Saving fails (network error) | Toast notification with retry option; form state preserved | P1 |
| Category picker — many categories visible | Group by Maslow level with collapsible sections; Physiological expanded by default | P2 |
| Drag reorder — many needs | Virtual scrolling not needed (typical package has <20 needs) | P3 |
| Concurrent edit — two coordinators editing same need | Last-write-wins (standard Inertia pattern); no real-time locking | P3 |

### Performance Considerations

**Page Frequency:** Medium-high (accessed during care plan reviews, daily for active packages)

**Data Considerations:**
- Needs per package: typically 5-15 (no pagination needed)
- Category list: 14 items (static, can be cached)
- Risk/budget item lists: typically <30 per package (no lazy loading needed)

**Real-time:** Not required. Standard Inertia page reload after save.

### Phased Rollout

**MVP Scope (this spec):**
- Wizard: Create/Edit with 3 steps
- List view: Cards grouped by Maslow level
- Status: Draft / Active / Archived
- Drag-and-drop reordering
- Feature flag per organisation

**Phase 2 (future):**
- Care plan PDF generation consuming v2 needs
- AI-assisted need creation from assessment documents
- Inline editing (edit description without opening wizard)
- Bulk status changes (archive multiple needs)

**Phase 3 (future):**
- Scoped risk surfacing at shift level
- Needs-to-service provider flow
- Population-level clinical views ("75 clients with mobility needs")

---

## Validation

### Risks & Assumptions

**Assumptions:**
- Coordinators will find the Maslow categories intuitive with minimal training
- 14 categories cover the vast majority of real-world needs
- Care partners prefer cards over table rows for this type of data
- Drag-and-drop reordering will be used (not just ignored)

**Risks:**

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Category picker feels unfamiliar vs dropdown | Medium | Low | Provide tooltip descriptions on each category; fallback to dropdown if user testing shows friction |
| Wizard feels like "extra steps" vs. old sidebar | Low | High | Steps 2-3 clearly skippable; "Save" button visible on every step (saves with skip) |
| Drag-and-drop on touch/tablet | Low | Low | Desktop-first; touch fallback with up/down arrows if needed in Phase 2 |
| Cards take more vertical space than table | Medium | Low | Compact card design; Maslow level headers are collapsible |

### User Testing Plan

**Approach:** Pilot with 3-5 Coordinators from co-design group

**Participants:**
- 2-3 Care Partners (daily needs capture)
- 1-2 Clinical Team (review workflow)

**Questions to Answer:**
1. Can Coordinators create a need in under 2 minutes?
2. Are the Maslow categories intuitive without training?
3. Do Coordinators use Steps 2-3 (risk/budget linking) or skip them?
4. Is the card list scannable at a glance?
5. Does the status lifecycle (Draft/Active/Archived) make sense?

**Timeline:** During pilot rollout (feature flag enabled for one org)

---

## Ready for Mockups

- [x] User research complete
- [x] Competitive research done (ShiftCare, AlayaCare)
- [x] Design principles defined ("Capture needs, not paperwork")
- [x] Edge cases identified (7 cases)
- [x] Constraints documented (a11y, security, dependencies)
- [x] Component architecture mapped
- [x] Stakeholder alignment (spec clarifications complete)

**Next Step:** Run `/trilogy-design-handover` to validate design completeness and hand off to Development.

---

## Gate 2: Design Handover (Design → Dev)

**Date**: 2026-02-12
**Status**: PASS
**Prerequisite**: Gate 1 (Spec → Design) passed — see `spec.md`

### Gate 2 Checklist

#### Design Kickoff Completeness

| Check | Status | Evidence |
|-------|--------|----------|
| User research complete | [x] PASS | Primary user (Coordinator), device (desktop), usage pattern (daily, time-pressured) defined in Context section |
| Design principles defined | [x] PASS | North star: "Capture needs, not paperwork" with 4 supporting principles |
| Edge cases identified | [x] PASS | 7 edge cases documented with handling strategy and priority |
| Constraints documented | [x] PASS | Accessibility (WCAG AA), security (health data), dependencies (3 Common components) |
| Build size assessed | [x] PASS | Medium (BMW 3 Series) with rationale |
| Competitive research done | [x] PASS | ShiftCare and AlayaCare analysed with lessons |

#### Mockup Completeness

| Check | Status | Evidence |
|-------|--------|----------|
| Wizard form mocked | [x] PASS | `mockups/wizard-form.txt` — all 3 steps, empty state, validation error state |
| List view mocked | [x] PASS | `mockups/needs-list.txt` — active/draft/archived tabs, card layout, expanded detail |
| Maslow pyramid filter mocked | [x] PASS | Overview mode, filtered mode, dimmed tiers, toggle behaviour documented |
| Empty states covered | [x] PASS | No needs, no risks (Step 2), no budget items (Step 3) |
| Error states covered | [x] PASS | Validation errors on Step 1 — missing category, description, funding source |
| Component mapping done | [x] PASS | `mockups/summary.md` — 12 elements mapped to existing/new components |

#### Design-Spec Alignment

| Check | Status | Evidence |
|-------|--------|----------|
| All user stories have design coverage | [x] PASS | US1-US6 all addressed in wizard + list mockups |
| All functional requirements have UI representation | [x] PASS | FR-001 through FR-022 mapped to mockup elements |
| Success metrics have measurement path | [x] PASS | SC-001 (time), SC-002 (structured data), SC-003 (linkage), SC-006 (qualitative) all observable in the designed UI |
| Phased rollout planned | [x] PASS | MVP / Phase 2 / Phase 3 documented in design.md Planning section |
| Out of scope items clearly defined | [x] PASS | PDF generation, v1 migration, AI creation, risk scoring excluded |

#### Stakeholder Alignment

| Check | Status | Evidence |
|-------|--------|----------|
| Spec clarifications resolved | [x] PASS | 5 spec-lens + 2 business-lens questions answered and documented |
| Risks documented | [x] PASS | 4 design risks with likelihood/impact/mitigation in Validation section |
| Dependencies identified | [x] PASS | Existing risk data, budget items, 3 Common components |

---

### Handover Summary

**Initiative**: Simplified Needs Module (Needs v2)
**Epic**: RNC2 — Future State Care Planning
**Date**: 2026-02-12

#### What We're Building

A simplified needs capture module that replaces the current 300+ field Zoho-derived form with a 3-step wizard (Define Need → Link Risks → Associate Budget Items). Needs are categorised using Maslow's hierarchy of needs adapted for home care, with 14 categories across 5 levels. The list view includes a collapsible Maslow pyramid that acts as both a visual summary and a filter.

#### Key Screens

1. **Wizard Form** (CommonModal, right-slide)
   - Location: `mockups/wizard-form.txt`
   - Step 1: Category picker (grouped by Maslow level), description, how met, funding source, status, add to care plan
   - Step 2: Multi-select existing package risks (searchable, skippable)
   - Step 3: Multi-select existing package budget items (searchable, skippable)
   - Key interaction: Steps use `v-show` for state preservation; validation on save only

2. **Needs List** (package needs tab, replaces v1 when flag enabled)
   - Location: `mockups/needs-list.txt`
   - Cards grouped by Maslow level with drag handles for reorder
   - Status tabs: Active (default) / Draft / Archived
   - Maslow pyramid filter: hidden by default, toggle via [△ Maslow] button
   - Expandable card detail showing linked risks, budget items, timestamps

#### Component Decisions

**Reusing Existing:**
- `CommonModal` — wizard container (right-slide dialog)
- `CommonStepNavigation` — wizard step tabs (reka-ui based)
- `CommonSelectMenu` — funding source dropdown + risk/budget multi-select
- `CommonBadge` — category, status, funding source badges
- `CommonButton` — all action buttons
- `CommonEmptyPlaceholder` — empty states on Steps 2/3

**New Components Needed:**
- `MaslowCategoryPicker.vue` — grouped visual selector with collapsible Maslow sections (Step 1)
- `MaslowPyramid.vue` — SVG/CSS pyramid with clickable tiers, count badges, filter emit
- `NeedV2Card.vue` — compact/expandable card with drag handle
- `NeedV2StatusTabs.vue` — Active/Draft/Archived tab filter
- Drag-and-drop integration — `@vueuse/core` useSortable or `vuedraggable`

#### Critical UX Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Category picker format | Grouped visual selector (not dropdown) | Maslow levels need visual prominence; the framework is the differentiator |
| Wizard step validation | Server-side on final save only | No per-step blocking — keeps navigation frictionless |
| List layout | Cards (not DataTable) | More scannable; groups reinforce the Maslow framework visually |
| Maslow pyramid | Hidden by default, toggle on demand | Keeps daily workflow clean; clinical overview when needed |
| Steps 2 & 3 | Skippable with "do it later" hint | Linking is valuable but optional — don't block core need capture |
| Status on creation | Default to Active; optional Draft | Most needs are ready immediately; Draft for incomplete work |
| Archived needs | Read-only, hidden from default view | Preserves audit trail; accessible via tab filter |

#### Data Requirements

| Screen | Data Needed | Source |
|--------|-------------|--------|
| Step 1 (Define) | Need categories (14, grouped by maslow_level) | `need_categories_v2` table (seeded) |
| Step 1 (Define) | Funding source options | `FundingSourceEnum` (code) |
| Step 2 (Risks) | Package risks | `package.risks` relationship (existing) |
| Step 3 (Budget) | Package budget items | `package.budgetItems` relationship (existing) |
| List view | Package needs v2 with category, risk count, budget item count | `package.needsV2` with eager loads |
| Pyramid | Need counts grouped by maslow_level | Computed from needs collection client-side |

#### Open Questions for Development

- [ ] **Card expand behaviour** — Inline expand (push content down) vs side panel? Recommend inline for simplicity
- [ ] **Maslow level colours** — Distinct colour per tier on pyramid and card headers? Needs design input
- [ ] **Drag-and-drop scope** — Reorder across Maslow groups or within group only? Recommend across (flat priority)
- [ ] **Archive confirmation** — One-click or confirmation dialog? Recommend confirmation (irreversible-feeling action)
- [ ] **Pyramid on wizard** — Pyramid as category picker on Step 1, or keep grouped list? Recommend grouped list for form context

#### Out of Scope (Deferred)

- Care plan PDF generation (future RNC2 story — will consume v2 data)
- Migration of v1 needs to v2 (v1 data remains, not surfaced through v2)
- AI-assisted need creation from assessment documents
- Evidence-based risk scoring (separate RNC2 workstream)
- Inline editing (edit without opening wizard)
- Bulk status changes (archive multiple)

---

### Sign-Off

| Role | Name | Date | Status |
|------|------|------|--------|
| Product | Romy Blacklaw | | [ ] Approved |
| Developer | Khoa Duong | | [ ] Approved |
| Clinical Governance | Marianne | | [ ] Approved |

### Next Steps

- [ ] Run `/speckit-plan` to create technical implementation plan
- [ ] Developer to review design artifacts (design.md, mockups/)
- [ ] Schedule architecture discussion if needed (event sourcing, pivot tables)
