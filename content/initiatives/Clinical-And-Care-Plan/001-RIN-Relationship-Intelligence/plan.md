---
title: "Implementation Plan: Relationship Intelligence"
---

# Implementation Plan: Relationship Intelligence

**Spec**: [spec.md](spec.md) | **Design**: [design.md](design.md)
**Created**: 2026-02-17
**Updated**: 2026-03-13 (post-prototype, backend planning)
**Status**: Ready for Implementation
**Gate 1**: PASS (Spec → Design) | **Gate 2**: PASS (Design → Dev) | **Gate 3**: PASS (Architecture)

---

## Summary

Coordinators currently toggle between 4-5 screens to understand a client before a call — and personal context (interests, family, preferences) isn't captured anywhere. When a coordinator is absent or a client is reassigned, all relationship knowledge is lost.

This plan builds a **Relationship Intelligence** system delivered as **two floating panels** plus a **tool strip** on the package page:

- **Intelligence Panel** — reference card: Quick Essentials, operational alerts, personal context pills, touchpoint logging with duration/activity/sentiment
- **Conversation Guide Panel** — call companion: Last Conversation context, opening carousel with mad-libs, Personal Touch prompts, transition phrases + Call Checklist, conflict framework
- **Quick Notes Panel** — mid-call capture with category tagging and "Log as Touchpoint"
- **Tool Strip** — vertical icon bar on the right edge, always present when feature flag is active

North star: "Margaret feels known every time we call."

**Phase 1 (MVP)**: US1-3, US6, US7, US8 — Personal context, snapshot, touchpoints, conversation guide, quick notes, feature flag
**Phase 2**: US4, US5 — Compliance dashboard, interaction timeline, care-event prompts

---

## Technical Context

**Language/Version**: PHP 8.3 (Laravel 12), TypeScript (Vue 3 + Inertia v2)
**Primary Dependencies**: Inertia.js v2, Tailwind CSS v3, Spatie Laravel Data, Lorisleiva Actions, Laravel Pennant + PostHog, embla-carousel-vue (existing), VueUse
**Storage**: MySQL — new tables for `personal_context_entries` and `touchpoints`
**Testing**: Pest v3 (unit + feature), Dusk v8 (browser)
**Target Platform**: Desktop-first web (responsive slide-over at <1280px)
**Performance Goals**: Panel data loads in <200ms, touchpoint log saves in <500ms
**Constraints**: WCAG AA, existing package page layout unchanged, feature flagged per org

---

## Project Structure

### Documentation

```text
.tc-docs/content/initiatives/Clinical-And-Care-Plan/001-RIN-Relationship-Intelligence/
├── spec.md              # V3 feature specification
├── design.md            # V3 design kickoff + handover
├── plan.md              # This file
├── data-model.md        # Entity definitions
├── tasks.md             # Implementation tasks (from /speckit-tasks)
└── mockups/
    ├── sidebar-playground.html   # Interactive V3 prototype
    └── looms/                    # Loom walkthrough scripts
```

### Source Code

```text
# Backend (new domain)
domain/RelationshipIntelligence/
├── Models/
│   ├── PersonalContextEntry.php
│   └── Touchpoint.php
├── Data/
│   ├── PersonalContextEntryData.php
│   ├── StorePersonalContextEntryData.php
│   ├── TouchpointData.php
│   ├── StoreTouchpointData.php
│   ├── QuickEssentialsData.php
│   ├── UpdateQuickEssentialsData.php
│   ├── OperationalContextData.php
│   ├── LastConversationData.php
│   ├── PersonalTouchPromptData.php
│   ├── ChecklistItemData.php
│   ├── OpenerData.php
│   ├── AuthRepData.php
│   ├── IntelligencePanelData.php
│   ├── ConversationGuideData.php
│   ├── RinData.php
│   └── StoreQuickNoteData.php
├── Actions/
│   ├── StorePersonalContextEntry.php
│   ├── DestroyPersonalContextEntry.php
│   ├── StoreTouchpoint.php
│   ├── CorrectTouchpoint.php
│   ├── UpdateQuickEssentials.php
│   ├── StoreQuickNote.php
│   ├── GeneratePersonalTouchPrompts.php
│   ├── GenerateOperationalReasons.php
│   ├── GetIntelligenceData.php
│   ├── GetConversationGuideData.php
│   ├── GetRinData.php
│   └── RetractTouchpoint.php
├── Enums/
│   ├── PersonalContextCategory.php
│   ├── TouchpointType.php
│   ├── TouchpointActivity.php
│   ├── TouchpointSentiment.php
│   └── OperationalReason.php
├── Policies/
│   ├── PersonalContextEntryPolicy.php
│   └── TouchpointPolicy.php
├── Routes/
│   └── relationshipIntelligenceRoutes.php
└── Providers/
    └── RelationshipIntelligenceServiceProvider.php

# Frontend (new components)
resources/js/Components/
├── RelationshipIntelligence/
│   ├── RinToolStrip.vue
│   ├── Panel/
│   │   ├── RinFloatingPanel.vue          # Draggable/dockable shell
│   │   ├── PanelHeader.vue               # Title, close button, dock toggle
│   │   └── useRinPanels.ts               # Panel state composable
│   ├── Intelligence/
│   │   ├── IntelligencePanel.vue          # Parent — orchestrates sections
│   │   ├── ContactToggle.vue             # Client/Auth Rep segmented control
│   │   ├── QuickEssentials.vue           # Editable essentials card
│   │   ├── OperationalContext.vue        # Alert rows with badges
│   │   ├── PersonalContext/
│   │   │   ├── PersonalContextSection.vue # Parent — category groups
│   │   │   ├── CategoryGroup.vue          # Category heading + pills + add
│   │   │   └── ContextPill.vue            # Single pill with remove
│   │   └── TouchpointSection/
│   │       ├── TouchpointStatus.vue       # Status indicator + last contact
│   │       ├── TouchpointForm.vue         # Log form (date, type, duration, activity, notes, sentiment)
│   │       └── SentimentPicker.vue        # 3 emoji buttons
│   ├── ConversationGuide/
│   │   ├── ConversationGuidePanel.vue     # Parent — orchestrates sections
│   │   ├── LastConversation.vue           # Summary card from last touchpoint
│   │   ├── OpeningTheCall/
│   │   │   ├── OpeningSection.vue         # Parent — carousel wrapper
│   │   │   └── OpenerCard.vue             # Single opener with mad-libs
│   │   ├── PersonalTouch/
│   │   │   ├── PersonalTouchSection.vue   # Parent — prompt list
│   │   │   ├── PersonalTouchCard.vue      # Single prompt (check/dismiss/source)
│   │   │   └── AddPersonalTouch.vue       # Inline input → saves to pills
│   │   ├── GettingToBusiness/
│   │   │   ├── BusinessSection.vue        # Parent — transitions + checklist
│   │   │   ├── TransitionCarousel.vue     # Transition phrase cards
│   │   │   └── CallChecklist.vue          # Operational checklist items
│   │   └── HandlingConflict/
│   │       ├── ConflictSection.vue        # Parent — collapsible wrapper
│   │       └── ConflictStepCard.vue       # Single step with variants
│   └── QuickNotes/
│       ├── QuickNotesPanel.vue            # Parent — notes list + input
│       ├── RecentNotes.vue                # Read-only recent entries
│       └── NoteInput.vue                  # Text + category + save/log
└── Common/
    ├── CommonCarousel.vue                 # EXISTING — embla-carousel-vue
    ├── CommonSegmentedControl.vue         # NEW — generic segmented control
    └── MadLibBlank.vue                    # NEW — clickable cycling blank

# Shared types
resources/js/types/
├── RelationshipIntelligence/
│   ├── personalContext.ts
│   ├── touchpoint.ts
│   ├── conversationGuide.ts
│   └── panels.ts
└── commonComponents.ts                    # Add CommonSegmentedControl types
```

---

## Design Decisions

### Data Model

See [data-model.md](data-model.md) for full entity definitions. Key decisions:

1. **Personal context lives on the User (recipient), not the package.** `PersonalContextEntry` has `user_id` FK to the recipient. Shared across all packages for that client.

2. **Touchpoints are client-level.** `Touchpoint` has `user_id` (recipient) + `recorded_by` (coordinator). Not tied to a package — a call with Maggie counts regardless of which package tab you're on.

3. **Quick Essentials fields.** `preferred_name` already exists on User. New fields: `best_call_time`, `caution_flags` (JSON), `info_notes` (JSON) added to User model (or a new `user_essentials` JSON column). `timezone` already exists on User. `language` — check if exists, likely on User or a related model.

4. **No separate "Client" model needed.** The recipient IS a `User`. RIN adds relationships to User: `personalContextEntries()`, `touchpoints()`.

5. **Touchpoint corrections update in-place with audit trail.** No hard deletes. `CorrectTouchpoint` action updates fields and sets `corrected_at`/`corrected_by` on the same row. Spatie Activity Log captures before/after values for regulatory audit trail. `RetractTouchpoint` sets `retracted_at`/`retracted_by` to void the entry.

6. **Personal Touch prompts are computed, not stored.** Generated at view time from the latest touchpoint's notes + upcoming Important Dates + personal context entries. No database table needed.

### API Contracts

Routes are scoped to `recipients/{user}` since RIN data is client-level (not package-level). The package page provides the recipient context — actions derive the `User` directly. Auth checks verify the current user has access to at least one of the recipient's packages.

| Method | Route | Action | Data Class | Returns |
|--------|-------|--------|-----------|---------|
| `GET` | `/recipients/{user}/rin/intelligence` | `GetIntelligenceData` | — | `IntelligencePanelData` (essentials, context, operational, touchpoint status) |
| `GET` | `/recipients/{user}/rin/guide` | `GetConversationGuideData` | — | `ConversationGuideData` (last convo, openers, prompts, checklist) |
| `POST` | `/recipients/{user}/rin/context` | `StorePersonalContextEntry` | `StorePersonalContextEntryData` | `PersonalContextEntryData` |
| `DELETE` | `/recipients/{user}/rin/context/{personalContextEntry}` | `DestroyPersonalContextEntry` | — | 204 |
| `POST` | `/recipients/{user}/rin/touchpoint` | `StoreTouchpoint` | `StoreTouchpointData` | `TouchpointData` |
| `POST` | `/recipients/{user}/rin/touchpoint/{touchpoint}/correct` | `CorrectTouchpoint` | `CorrectTouchpointData` | `TouchpointData` |
| `PATCH` | `/recipients/{user}/rin/essentials` | `UpdateQuickEssentials` | `UpdateQuickEssentialsData` | `QuickEssentialsData` |
| `POST` | `/recipients/{user}/rin/note` | `StoreQuickNote` | `StoreQuickNoteData` | `NoteData` |

**Why scoped to recipient**: Data is client-level, shared across all packages. Auth is checked by verifying the current user has access to at least one package where this user is the recipient. The Quick Notes endpoint still needs a `package_id` parameter to attach the note to the correct package (notes are polymorphic on Package).

**Data loading**: Intelligence and Guide data are loaded as **standard Inertia props** on every package page view — always available when the panel opens, no skeleton/loading state needed. This adds minimal overhead since the data is lightweight (essentials + counts + ~20 pills + 1 touchpoint).

### UI Components

#### New Common Components (zero business logic)

**`CommonSegmentedControl.vue`**
- Props: `defineProps<Props>()` with:
  - `options: SegmentOption[]` — `{ value: string, label: string, icon?: string }`
  - `modelValue: string`
- Emits: `defineEmits<Emits>()` with:
  - `(e: 'update:modelValue', value: string): void`
- Shared types: `resources/js/types/commonComponents.ts` → add `SegmentOption`
- Common component eligibility: **Common** — generic segmented control usable in any feature

**`MadLibBlank.vue`**
- Props: `defineProps<Props>()` with:
  - `alternatives: string[]` — list of cycling options
  - `modelValue: number` — current index
- Emits: `defineEmits<Emits>()` with:
  - `(e: 'update:modelValue', index: number): void`
- Common component eligibility: **Common** — reusable clickable cycling text pattern

#### Feature Components

**RinToolStrip.vue**
- Props: `defineProps<Props>()` with:
  - `touchpointStatus: 'contacted' | 'due' | 'overdue'`
  - `hasConversationGuide: boolean` (feature flag)
  - `hasQuickNotes: boolean` (feature flag)
- Emits: `defineEmits<Emits>()` with:
  - `(e: 'toggle', panel: 'intelligence' | 'guide' | 'notes'): void`
- Common components reused: `CommonBadge` (status dot), `CommonTooltip`

**RinFloatingPanel.vue** — Draggable/dockable panel shell
- Props: `defineProps<Props>()` with:
  - `title: string`
  - `panelId: string`
  - `width?: number` (default 320)
- Emits: `defineEmits<Emits>()` with:
  - `(e: 'close'): void`
- Slots: `#default` (panel content), `#header` (optional custom header)
- Composable: `useRinPanels()` — manages open/close, position, docking state for all panels
- Common component eligibility: **Bespoke** — RIN-specific floating behaviour; may be promoted to Common if other features adopt floating panels

**IntelligencePanel.vue** — Parent orchestrator
- Props: `defineProps<Props>()` with:
  - `data: IntelligencePanelData`
  - `authRep?: AuthRepData`
- Sub-components: `ContactToggle`, `QuickEssentials`, `OperationalContext`, `PersonalContextSection`, `TouchpointStatus`, `TouchpointForm`

**ConversationGuidePanel.vue** — Parent orchestrator
- Props: `defineProps<Props>()` with:
  - `data: ConversationGuideData`
  - `contactMode: 'client' | 'auth-rep'`
  - `contactName: string`
- Sub-components: `LastConversation`, `OpeningSection`, `PersonalTouchSection`, `BusinessSection`, `ConflictSection`

**SentimentPicker.vue**
- Props: `defineProps<Props>()` with:
  - `modelValue: TouchpointSentiment | null`
- Emits: `defineEmits<Emits>()` with:
  - `(e: 'update:modelValue', value: TouchpointSentiment | null): void`
- Common component eligibility: **Bespoke for now** — sentiment-specific, may generalize later

**PersonalTouchCard.vue**
- Props: `defineProps<Props>()` with:
  - `prompt: PersonalTouchPromptData`
- Emits: `defineEmits<Emits>()` with:
  - `(e: 'check'): void`
  - `(e: 'dismiss'): void`
- Common components reused: `CommonBadge` (source tag)

### Composables

**`useRinPanels.ts`**
- Manages state for all three panels: open/closed, position (x, y), docked (boolean), width
- Persists state to localStorage via VueUse `useStorage`
- Handles intelligent positioning (avoid overlap)
- Returns: `{ panels, toggle, isOpen, dock, undock, position }`
- Justification: Shared across RinToolStrip, all three panels, and the PackageViewLayout integration point

**`useInlineEdit.ts`**
- Manages inline editing state for Quick Essentials fields
- Returns: `{ isEditing, startEdit, saveEdit, cancelEdit, editValue }`
- Justification: Reused across all Quick Essentials fields (preferred name, best time, caution flags, etc.)

**`usePersonalTouch.ts`**
- Computes Personal Touch prompts from touchpoint data + personal context + dates
- Returns: `{ prompts, check, dismiss, addPrompt }`
- Justification: Logic separated from ConversationGuidePanel — testable independently

### Shared Types

**`resources/js/types/RelationshipIntelligence/personalContext.ts`**:
- `PersonalContextEntryData` — aliased from Domain generated type
- `PersonalContextCategory` — enum values

**`resources/js/types/RelationshipIntelligence/touchpoint.ts`**:
- `TouchpointData` — aliased from Domain generated type
- `TouchpointType`, `TouchpointActivity`, `TouchpointSentiment` — enum values
- `TouchpointStatus` — `'contacted' | 'due' | 'overdue'`

**`resources/js/types/RelationshipIntelligence/conversationGuide.ts`**:
- `LastConversationData` — last touchpoint summary
- `OpenerCard` — carousel card with mad-lib blanks
- `PersonalTouchPromptData` — computed prompt with source
- `ChecklistItem` — operational checklist item
- `ConflictStep` — conflict framework step with variants

**`resources/js/types/RelationshipIntelligence/panels.ts`**:
- `PanelId` — `'intelligence' | 'guide' | 'notes'`
- `PanelState` — position, docked, open/closed
- `RinPanelConfig` — panel configuration

---

## Current State (2026-03-13)

All **27 frontend Vue components** are built with mock data and integrated into `PackageViewLayout.vue`. The RIN playground page exists at `/rin-playground` for visual testing. What remains is the **backend domain** and **wiring real data** into the existing frontend components.

**Already built (frontend — mock data):**
- `resources/js/Components/RelationshipIntelligence/` — all 27 components
- `resources/js/Components/Common/CommonSegmentedControl.vue` + `MadLibBlank.vue`
- `resources/js/composables/useRinPanels.ts` — panel state (localStorage via VueUse)
- `resources/js/types/RelationshipIntelligence/` — 4 type files
- `resources/js/Layouts/ChildLayouts/PackageViewLayout.vue` — RIN integration with `HasFeatureFlag`
- `resources/js/Pages/RinPlayground/Index.vue` + controller + route

**What remains:** Backend domain + frontend wiring (replace mock data with real props, add API calls).

---

## Implementation Phases

### Phase 1: Backend Foundation (Sprint 1)

**Domain structure:**
```
domain/RelationshipIntelligence/
├── Providers/RelationshipIntelligenceServiceProvider.php
├── Models/PersonalContextEntry.php
├── Models/Touchpoint.php
├── Enums/PersonalContextCategory.php
├── Enums/TouchpointType.php
├── Enums/TouchpointActivity.php
├── Enums/TouchpointSentiment.php
├── Factories/PersonalContextEntryFactory.php
├── Factories/TouchpointFactory.php
├── Policies/PersonalContextEntryPolicy.php
├── Policies/TouchpointPolicy.php
└── Routes/relationshipIntelligenceRoutes.php
```

**Migrations (3):**
1. `create_personal_context_entries_table` — see [data-model.md](data-model.md)
2. `create_touchpoints_table` — see [data-model.md](data-model.md)
3. `add_rin_essentials_to_users_table` — adds `best_call_time` (string 50), `caution_flags` (JSON), `info_notes` (JSON), `zoho_management_plan_url` (string 255, nullable)

**Models:**
- `PersonalContextEntry` — `belongsTo User` (recipient via `user_id`), `belongsTo User` (createdBy), soft deletes, `category` cast to `PersonalContextCategory` enum
- `Touchpoint` — `belongsTo User` (recipient via `user_id`), `belongsTo User` (recordedBy), `type`/`activity`/`sentiment` cast to enums, `corrected_at`/`retracted_at` correction fields
- `User` (extend) — add `personalContextEntries(): HasMany`, `touchpoints(): HasMany`, cast `caution_flags`/`info_notes` as array

**Enums:** `PersonalContextCategory`, `TouchpointType`, `TouchpointActivity`, `TouchpointSentiment` — all backed string enums, SCREAMING_SNAKE_CASE. See [data-model.md](data-model.md)

**Policies:**
- `PersonalContextEntryPolicy` — `view`: user has access to any of the recipient's packages; `create`: same (no extra permission — anyone with package access can contribute); `delete`: creator within 24h OR Team Leader
- `TouchpointPolicy` — `view`: package access; `create`: package access; `correct`/`retract`: creator within 24h OR Team Leader

**Route group:**
```php
Route::middleware(['web.authenticated', 'check.feature.flag:relationship-intelligence'])
    ->prefix('recipients/{user}/rin')
    ->name('rin.')
    ->group(function () { ... });
```

**Tests:** Unit: model relationships, factory states, enum casts, policy authorization (creator vs non-creator, 24h window). Feature: migrations, models persist, feature flag middleware.

### Phase 2: Intelligence Panel Backend + Wiring (Sprint 2)

**Data classes (`#[TypeScript]` + `#[MapName(SnakeCaseMapper::class)]`):**
- `QuickEssentialsData` — preferredName, language, bestCallTime, timezone, cautionFlags[], infoNotes[]
- `OperationalContextData` — billsOnHoldCount, activeComplaintsCount, managementPlanZohoUrl?, checkInOverdueDays?
- `PersonalContextEntryData` — id, category, content, createdBy, createdAt
- `StorePersonalContextEntryData` — category (enum), content (string, required, max 500)
- `UpdateQuickEssentialsData` — field (string), value (string|null)
- `IntelligencePanelData` — essentials, operationalContext, personalContextEntries[], touchpointStatus, lastTouchpoint?

**Actions (Lorisleiva AsAction + AsController):**
- `GetIntelligenceData` — assembles `IntelligencePanelData` from User (recipient) + Package. Loaded as standard Inertia prop on every package page view
- `StorePersonalContextEntry` — validates via Data class, creates entry. Route: `POST .../rin/context`
- `DestroyPersonalContextEntry` — soft-deletes. Route: `DELETE .../rin/context/{personalContextEntry}`
- `UpdateQuickEssentials` — updates single field on User. Route: `PATCH .../rin/essentials`

**Operational context queries** (inside `GetIntelligenceData`):
- Bills on hold: `$package->bills()->where('bill_stage', BillStageEnum::ON_HOLD)->count()`
- Active complaints: `$package->notes()->whereIn('category', [NoteCategoryEnum::FEEDBACK_COMPLAINT_DIRECT, NoteCategoryEnum::FEEDBACK_COMPLAINT_INDIRECT])->where('created_at', '>=', now()->subDays(90))->count()` — 90-day rolling window
- Management plan due: **Zoho-sourced** — management plans live in Zoho. Surface link to Zoho record in operational context panel (opens in new window). Requires Zoho API integration or manual link configuration
- Check-in overdue: uses existing `$package->int_check_in_date` (auto-updated by NoteService). Show "overdue" when `int_check_in_date` is older than 28 days. NOTE: This is distinct from "last spoke to client" — check-in is a formal compliance requirement, while "last conversation" comes from Touchpoints

**Frontend wiring:**
- `IntelligencePanel.vue` — accept `data: IntelligencePanelData` prop, remove all mock data
- `PersonalContextSection.vue` — `@add` calls `router.post()`, `@remove` calls `router.delete()`
- `QuickEssentials.vue` — `@save` calls `router.patch()` to essentials endpoint
- Add `useInlineEdit.ts` composable for optimistic inline editing

**Tests:** Unit: action logic, validation. Feature: full endpoint tests with auth + validation errors. Browser: panel open, pill add/remove, essentials edit.

### Phase 3: Touchpoints + Conversation Guide Backend + Wiring (Sprint 3)

**Data classes:**
- `TouchpointData` — id, date, type, durationMinutes, activity, sentiment, notes, recordedBy, createdAt
- `StoreTouchpointData` — date (required, before_or_equal today), type (enum), durationMinutes (nullable, 1-240), activity (nullable, enum), sentiment (nullable, enum), notes (nullable)
- `CorrectTouchpointData` — same fields as Store
- `LastConversationData` — coordinatorName, date, durationMinutes?, sentiment?, type, activity?, notes?
- `PersonalTouchPromptData` — text, source, sourceDetail?
- `ConversationGuideData` — lastConversation?, personalTouchPrompts[], checklistItems[]

**Actions:**
- `StoreTouchpoint` — creates touchpoint. Route: `POST .../rin/touchpoint`
- `CorrectTouchpoint` — sets `corrected_at`/`corrected_by`. Route: `POST .../rin/touchpoint/{touchpoint}/correct`
- `GetConversationGuideData` — assembles guide data. Loaded as standard Inertia prop on every package page view
- `GeneratePersonalTouchPrompts` — max 3 prompts: (1) latest touchpoint notes — surface full note text as prefix "Last time you chatted about: [notes]" truncated at ~100 chars, (2) Important Dates within 7 days, (3) fallback interests/family entries

**Frontend wiring:**
- `TouchpointForm.vue` — `@save` calls `router.post()`
- `ConversationGuidePanel.vue` — accept `data: ConversationGuideData` prop, remove mock data
- `PersonalTouchSection.vue` — check/dismiss are local UI state (prompts are ephemeral)
- `CallChecklist.vue` — items from `ConversationGuideData.checklistItems[]`
- Opening carousel + conflict steps remain semi-static templates (Phase 1)

**Tests:** Unit: touchpoint validation, correction 24h window, prompt generation logic. Feature: touchpoint CRUD, guide data assembly. Browser: log touchpoint, guide opens with real data.

### Phase 4: Quick Notes + Auth Rep + Polish (Sprint 4)

**Data class:** `StoreQuickNoteData` — content (required), category (nullable, from `NoteCategoryEnum`), logAsTouchpoint (boolean)

**Action:** `StoreQuickNote` — saves to existing `Note` model (polymorphic on Package, reuses `NoteService::store()`). If `logAsTouchpoint = true`, also creates `Touchpoint`. Route: `POST .../rin/note`

**Auth rep data:**
- Extend `GetIntelligenceData` to include auth rep essentials from `PackageRepresentative` where `type = 'auth_rep'`
- Extend `GetConversationGuideData` to swap contact name in openers

**Frontend wiring:**
- `QuickNotesPanel.vue` — accept `notes` prop, `@save` calls `router.post()`
- `NoteInput.vue` — category dropdown uses real `NoteCategoryEnum` values
- Auth rep toggle: `ContactToggle` drives context swap on Intelligence + name/banner swap on Guide
- Responsive: `RinFloatingPanel` becomes slide-over at `<1280px` via `useMediaQuery`
- Loading skeletons on deferred prop load, empty states

**Tests:** Unit: `StoreQuickNote` (note-only, note+touchpoint). Feature: note creation, auth rep data switching. Browser: quick note, "Log as Touchpoint", auth rep toggle.

### Phase 5: Testing + Hardening (Sprint 5)

- Full Pest regression suite across all phases
- Dusk browser tests for complete user journeys (panel → context → touchpoint → guide → notes)
- Performance: deferred props <200ms
- Accessibility: keyboard nav, ARIA labels, AA contrast
- Feature flag edge cases: mid-session toggle, flag-off data preservation
- `php artisan typescript:transform` generates correct types for all Data classes

---

## Testing Strategy

### Test Coverage by Phase

**Phase 1: Foundation Tests**
- Unit: Model relationships, enum values, Data class validation rules
- Feature: Migration runs cleanly, feature flag gating works

**Phase 2: Intelligence Panel Tests**
- Unit: `StorePersonalContextEntry` action, `DestroyPersonalContextEntry` action, `UpdateQuickEssentials` action
- Feature: Context CRUD endpoints (auth, validation, persistence), essentials update
- Browser: Open panel, add pill, remove pill, edit essential field

**Phase 3: Touchpoint + Guide Tests**
- Unit: `StoreTouchpoint` action, `CorrectTouchpoint` action, `GeneratePersonalTouchPrompts` logic
- Feature: Touchpoint endpoints (validation, duration badge, sentiment), guide data assembly
- Browser: Log touchpoint flow, carousel navigation, personal touch check/dismiss/add

**Phase 4: Quick Notes + Auth Rep Tests**
- Unit: `StoreQuickNote` action
- Feature: Note + touchpoint combined save, auth rep data switching
- Browser: Quick note flow, auth rep toggle, panel positioning

### Test Execution Checklist

- [ ] Phase 1: Unit + Feature tests passing
- [ ] Phase 2: Intelligence panel tests passing
- [ ] Phase 3: Touchpoint + Guide tests passing
- [ ] Phase 4: Quick Notes + Auth Rep tests passing
- [ ] Phase 5: Full suite passing, browser tests passing

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Floating panel drag/dock complexity | Medium | Medium | Start with fixed position, iterate to drag/dock. Use VueUse `useDraggable` |
| Personal Touch prompt quality (rule-based) | Medium | Low | Start with simple rules (dates, pill content). Improve in Phase 2 with care-event triggers |
| Staff see panels as "more admin" | Medium | High | Panels default closed. Quick-add is 2 clicks. Show value via prompts immediately |
| Performance: operational context queries on every panel open | Low | High | Pre-compute counts, cache per client, invalidate on bill/complaint change |
| Auth rep data not available in care circle | Low | Medium | Verify care circle query returns auth rep. Fallback: hide toggle if no auth rep |
| Note category alignment with existing `note_categories` | Low | Low | Reuse existing Note model categories where possible. Map new categories to existing |

---

## Resolved Open Questions (from Design Handover)

| Question | Resolution |
|----------|-----------|
| Where do Quick Essentials fields live? | New columns on `users` table: `best_call_time` (string), `caution_flags` (JSON), `info_notes` (JSON). `preferred_name` and `timezone` already exist on User |
| How to compute Personal Touch prompts? | `GeneratePersonalTouchPrompts` action — rule-based: (1) latest touchpoint notes as prefix, (2) Important Dates within 7 days, (3) interests/family fallback. Max 3 prompts |
| Floating panel — build from scratch or extend? | Built as bespoke `RinFloatingPanel.vue` (absolute positioned, stacking with offset). No drag library needed for Phase 1 — fixed position near tool strip |
| Touchpoint compliance view — new page or extend? | Phase 2 — new Inertia page with `CommonTable` + `BaseTable` |
| Carousel keyboard accessibility? | `CommonCarousel` (embla-carousel-vue) already exists in codebase — keyboard nav built in |
| Mad-lib alternatives — hardcoded or configurable? | Semi-static templates in Phase 1 — hardcoded in frontend. Backend-driven in Phase 2 |
| Support at Home activity categories final? | Yes — 5 categories from spec: Monitoring & Review, Care Planning, Organising & Adjusting Services, Navigating Options, Supporting Feedback & Complaints |
| Complaints model? | No dedicated `Complaint` model. Use notes with `NoteCategoryEnum::FEEDBACK_COMPLAINT_DIRECT` / `INDIRECT`, or incidents |
| Language field on User? | Not on User — likely `preferred_language` on Package. Use package-level language for Quick Essentials |

---

## Architecture Gate Check (Re-run 2026-03-13)

**Date**: 2026-03-13 (re-run post-clarification — 19 decisions applied)
**Status**: PASS

### 1. Technical Feasibility
- [x] Architecture approach clear — floating panels + tool strip on package page, `OperationalReason` enum + `GenerateOperationalReasons` action drives dynamic checklist + openers
- [x] Existing patterns leveraged — `FundingPanelExpanded` for overlay pattern, `useSidebar` for state, `CommonCarousel` for carousels, existing `Note` model + `NoteService` for quick notes, `PackageRepresentative` for auth rep, `PackageContactService` for auth rep edits
- [x] All requirements buildable — no impossible requirements. Zoho management plan link is a stored URL (no API integration needed for V1)
- [x] Performance considered — standard Inertia props (not deferred), single `GetRinData` action with eager-loaded Package, <200ms target. Operational context queries use existing indexed relationships
- [x] Security considered — reuses existing package access (no new permission), feature flags dual-gated, policy-based 24h edit window

### 2. Data & Integration
- [x] Data model understood — 2 new tables (`personal_context_entries`, `touchpoints`), 4 new columns on users (`best_call_time`, `caution_flags`, `info_notes`, `zoho_management_plan_url`)
- [x] API contracts clear — 8 endpoints defined with Data classes, recipient-scoped routes (`recipients/{user}/rin/...`)
- [x] Dependencies identified — `BillStageEnum::ON_HOLD`, `NoteCategoryEnum::FEEDBACK_COMPLAINT_*` (90-day window), `IncidentStageEnum`, `TaskStageEnum`, `Funding::isExpiringSoon()`, `PackageRepresentative` (primary), `NoteService::store()`, Spatie Activity Log (v4.10 installed)
- [x] Integration points mapped — `PackageViewLayout.vue` for tool strip, existing `Note` model for quick notes, `PackageContactService` for auth rep edits, `NoteService` for notes, `int_check_in_date` for compliance check-in
- [x] DTO persistence explicit — all actions use typed `Store*Data` classes, no `->toArray()` into ORM

### 3. Implementation Approach
- [x] File changes identified — new `domain/RelationshipIntelligence/` domain folder, 27 Vue components already built (wiring remaining), 3 migrations, ~15 Data classes, ~10 Actions
- [x] Risk areas noted — `OperationalReason` dynamic evaluation across ~8 data sources, Zoho URL manual entry (no API V1), checklist UI overflow when many operational items active
- [x] Testing approach defined — Pest unit/feature per phase, Dusk for key flows, 110 tasks in tasks.md
- [x] Rollback possible — feature flag disables all UI, data preserved in DB

### 4. Resource & Scope
- [x] Scope matches spec — Phase 1 MVP covers US1-3, US6-8. Phase 2 defers US4 (compliance dashboard) + US5 (timeline)
- [x] Effort reasonable — ~4-5 sprints (110 tasks across 8 phases), aligns with Medium-Large build size
- [x] Skills available — standard Laravel + Vue + Inertia stack, no new dependencies

### 5. Laravel & Cross-Platform Best Practices
- [x] No hardcoded business logic in Vue — operational context, touch prompts, checklist items, and opener reasons ALL backend-computed via `GetRinData` → `GenerateOperationalReasons` + `GeneratePersonalTouchPrompts`
- [x] Cross-platform reusability — API endpoints return typed Data classes usable by any client. Single `RinData` prop shape
- [x] Laravel Data for validation — all input actions use `Store*Data` classes (`StorePersonalContextEntryData`, `StoreTouchpointData`, `StoreQuickNoteData`, etc.)
- [x] Model route binding — actions receive `PersonalContextEntry $entry`, `Touchpoint $touchpoint`, `User $user`
- [x] No magic numbers/IDs — categories and activities are PHP enums with `SCREAMING_SNAKE_CASE`. Operational reasons are `OperationalReason` enum. **ACTION**: Define `COMPLAINT_WINDOW_DAYS = 90` and `CHECK_IN_OVERDUE_DAYS = 28` as constants on relevant models or the `OperationalReason` enum
- [x] Common components pure — `CommonSegmentedControl`, `MadLibBlank`, `CommonCarousel` have zero business logic
- [x] Use Lorisleiva Actions with `AsAction` trait — all actions (`StorePersonalContextEntry`, `StoreTouchpoint`, `GetRinData`, `GenerateOperationalReasons`, etc.)
- [x] Action authorization in `authorize()` method — policies check client access via recipient's packages
- [x] Data classes remain anemic — DTOs carry data only. `OperationalReason` enum holds phrases via translation keys (not business logic)
- [x] Migrations schema-only — no data seeding in migrations. Enums are code-defined
- [x] Models have single responsibility — `PersonalContextEntry` (personal context), `Touchpoint` (interactions). No overloading
- [x] Granular model policies — `PersonalContextEntryPolicy` and `TouchpointPolicy` with scoped permissions (creator within 24h OR team leader)
- [x] Response objects in auth — `Response::allow()` / `Response::deny('reason')`
- [x] Audit trail — touchpoints use update-in-place corrections with Spatie Activity Log (v4.10) capturing before/after state. `LogsActivity` trait on both models
- [x] Semantic column documentation — all new columns (`corrected_at`, `retracted_at`, `best_call_time`, `caution_flags`, `zoho_management_plan_url`) will have PHPDoc definitions
- [x] Feature flags dual-gated — backend `check.feature.flag:relationship-intelligence` middleware on all routes + frontend `HasFeatureFlag` component wrapping tool strip + panels. Inertia prop not computed when flag off

### 6. Vue TypeScript Standards
- [x] All new/modified Vue components planned with `<script setup lang="ts">`
- [x] Props use named `type` (`type Props = { ... }` with `defineProps<Props>()`)
- [x] Emits use named `type` (`type Emits = { ... }` with `defineEmits<Emits>()`)
- [x] No `any` types planned — all backend data shapes have TypeScript types via `#[TypeScript]` on Data classes → `generated.d.ts`
- [x] Shared types identified — 4 type files in `resources/js/types/RelationshipIntelligence/` (`personalContext.ts`, `touchpoint.ts`, `conversationGuide.ts`, `panels.ts`)
- [x] Common components audited — `CommonCarousel` exists, `CommonSegmentedControl` and `MadLibBlank` created as new Common components (already built)
- [x] New components assessed for common eligibility — `CommonSegmentedControl` (common), `MadLibBlank` (common), `SentimentPicker` (bespoke), `RinFloatingPanel` (bespoke, may promote)
- [x] No multi-step wizards — touchpoint form is single-step. Quick note form is single-step
- [x] Type declarations planned for untyped `.js` dependencies — `useSidebar` composable needs `.d.ts`

### 7. Component Decomposition
- [x] All panels decomposed into parent + sub-components (27 components across 3 panels + tool strip)
- [x] Directory structure follows `Feature/ComponentName/SubComponent.vue` convention
- [x] Sub-components use short names without parent prefix (e.g., `CategoryGroup.vue` not `PersonalContextCategoryGroup.vue`)
- [x] No template section comments planned — each section is its own component

### 8. Composition-Based Architecture
- [x] Composition over configuration — panels use slots for content, composables for logic
- [x] Composables identified — `useRinPanels` (panel state + localStorage), `useInlineEdit` (optimistic inline editing), `usePersonalTouch` (prompt computation)
- [x] Primitives are single-responsibility — `ContextPill`, `SentimentPicker`, `PersonalTouchCard`, `OpenerCard` each render one concern
- [x] Consumer controls layout — `RinFloatingPanel` provides `#default` slot, content components fill them
- [x] No boolean prop branching — auth rep toggle swaps data at parent level, not conditional rendering in children

### 9. Type File Organisation
- [x] Shared types in `resources/js/types/RelationshipIntelligence/` — 4 focused files by domain concern
- [x] No `.vue` exports planned — all shared types in `.ts` files
- [x] No type duplication — backend Data classes generate types via `#[TypeScript]`, frontend aliases from generated types
- [x] Common component types in `resources/js/types/commonComponents.ts` — `SegmentOption` for CommonSegmentedControl

### 10. Multi-Step Wizards
- [x] N/A — no multi-step wizards. Touchpoint form and note form are single-step using `useForm`

### 11. Pinia Stores
- [x] No Pinia stores needed — panel state in composable with localStorage via VueUse `useStorage`, form state in `useForm`, page data from `usePage().props` via single `RinData` prop
- [x] Justified: `useRinPanels` is a composable (not a store) because panel open/close state is component-tree-local and persisted to localStorage, not shared across unrelated pages

### 12. Data Tables
- [x] Compliance dashboard (Phase 2) will use `CommonTable` + `BaseTable` — not in Phase 1 MVP scope
- [x] No data tables in Phase 1 — all data rendered as cards, pills, and lists

### Red Flag Scan
- No red flags detected across all 12 sections
- All clarification decisions align with gate checks
- **Note**: `NoteCategory.php` enum listed in Source Code structure should be removed — we use existing `NoteCategoryEnum` from `domain/Note/Enums/`. Updated below

**Ready to Implement**: YES

---

## Development Clarifications

### Session 2026-03-13

- Q: How should RIN data load when panel opens? → A: **Always load with page** — standard Inertia props on every package page view. No deferred loading, no skeleton states needed. Data is lightweight enough to include on every render.
- Q: How should actions resolve the client from the package route? → A: **Scope to recipient directly** — routes use `recipients/{user}/rin/...` instead of `packages/{package}/rin/...`. Simpler for client-level data. Auth checks verify access to any of the recipient's packages.
- Q: Should writing require a new permission? → A: **Reuse existing package access** — anyone who can view the package can add context/touchpoints. No new permission needed. Simpler rollout.
- Q: How should touchpoint corrections work? → A: **Update in-place + Spatie Activity Log** — set `corrected_at`/`corrected_by` and update fields on the same row. Activity Log captures before/after for audit. One row per touchpoint.
- Q: Should Quick Notes use new or existing note categories? → A: **Use existing NoteCategoryEnum** — reuse the categories already in `domain/Note/Enums/NoteCategoryEnum.php`. No new enum needed.
- Q: Should UI updates be optimistic or wait for server? → A: **Optimistic updates** — frontend updates immediately on add/remove, rollback on error. Better UX for pill add/remove and inline edits.
- Q: How should 'management plan due' be derived? → A: **Zoho-sourced** — management plans live in Zoho. Surface a link to the Zoho record in the operational context panel (opens in new window). Not derived from `last_evaluation_date`.
- Q: How should 'active complaints' count work? → A: **Count complaint notes from last 90 days** — notes with `FEEDBACK_COMPLAINT_DIRECT`/`FEEDBACK_COMPLAINT_INDIRECT` categories created within 90 days count as active.
- Q: What should the 'check-in overdue' threshold use? → A: **Existing `int_check_in_date` from Package** — auto-updated by NoteService. Overdue = >28 days since last check-in. This is distinct from "last spoke to client" (Touchpoints) — check-in is a formal compliance requirement.
- Q: How should Personal Touch prompts extract from last touchpoint notes? → A: **Surface full notes as prefix** — "Last time you chatted about: [note text]" truncated at ~100 chars. No keyword extraction for V1.
- Q: Should check-in overdue and last conversation be displayed separately? → A: **Two separate rows** — "Monthly check-in: X days ago" (from `int_check_in_date`) AND "Last conversation: Y days ago" (from Touchpoints). Makes the compliance vs relationship distinction clear.
- Q: How should the Zoho management plan link be configured? → A: **Store Zoho URL on User model** — add `zoho_management_plan_url` column to users table. Coordinators paste the link once, or populate via Zoho API later.
- Q: Where should auth rep data come from? → A: **Use existing `PackageRepresentative` model** — `$package->primaryRepresentative` (HasOne with `is_primary=1`). Default to primary/preferred contact. Model has `user_id`, `meta` (JSON with full_name, email, phone), `relationship_type_id`, and flags like `is_decision_making_authority`, `is_power_of_attorney`.
- Q: Can coordinators edit auth rep details from the RIN panel? → A: **Yes, editable inline** — allow editing auth rep phone/notes directly from the RIN panel when Auth Rep toggle is active. Updates the `PackageRepresentative` model.
- Q: What happens when no primary representative is set? → A: **Show empty state with 'Add representative' link** — toggle works, but Auth Rep view shows an empty card with a link to the Package Contacts page.
- Q: Should 'Log as Touchpoint' auto-create a Touchpoint from a note? → A: **Yes, auto-create both** — clicking 'Log as Touchpoint' creates a Note AND a Touchpoint with the same content/date. The Touchpoint's notes field references the note content.
- Q: Should auth rep edits go through PackageContactService? → A: **Yes, use PackageContactService** — reuses existing validation, event dispatching, and audit logic. Consistent with Contacts page.
- Q: Are personal context entries shared across packages? → A: **Yes, shared** — entries are per-User (client), not per-Package. Any coordinator on any of the client's packages sees the same pills.
- Q: Are call checklist items static or configurable? → A: **Dynamically generated from operational context + one personal prompt** — checklist items mirror what's operationally relevant RIGHT NOW for the client (e.g., "Bill on hold needs discussion", "Management plan review due"). Not a fixed list. Plus one always-present personal connection item with varying wording: "Find something out about [recipient name]" or "Discuss one of [recipient]'s interests". UI needs overflow handling (scroll or "show more") since item count varies per client.
- Q: Should mad-lib opener [reason] blanks be preset or data-driven? → A: **Data-driven from operational reasons** — opener reasons should reflect why the coordinator is actually calling (bills on hold, check-in due, care plan review, etc). Same operational context that drives the checklist.
- Q: Is the conflict section interactive or static? → A: **Static reference card** — read-only accordion of de-escalation steps. No state tracking.
- Q: What operational reasons drive checklist + openers? → A: **All three groups** — core (bills on hold, complaints, check-in overdue, management plan due) + service (upcoming services, unassigned care hours) + clinical/financial (recent incidents, pending assessments/tasks, budget alerts/expiring funds). Fixed PHP enum for V1 — each reason has a rule checking package/client data.
- Q: Are checklist items checkable? → A: **Checkable but not persisted** — coordinator ticks items during the call for their own tracking. Resets when panel closes. No backend state.

**Operational Reason sources confirmed in codebase:**
- Bills on hold: `Package::bills()` → `BillStageEnum::ON_HOLD`
- Complaints: `Package::notes()` → `NoteCategoryEnum::FEEDBACK_COMPLAINT_DIRECT/INDIRECT` (90-day window)
- Check-in overdue: `Package::int_check_in_date` (>28 days)
- Management plan: Zoho-sourced (link on User model)
- Recent incidents: `Package::incidents()` → `IncidentStageEnum::NEW/PENDING/ESCALATED`
- Open tasks: `Package::tasks()` → `TaskStageEnum::NOT_STARTED/IN_PROGRESS`
- Budget alerts: `Funding::isExpiringSoon()`, `Funding::fundsAtRiskOfExpiring()`
- Services: `Package::packageServices()` → effective date ranges
- Q: Where should operational reason phrases live? → A: **Translation file** — phrases in `lang/en/rin.php`. Supports future i18n. Enum cases map to translation keys.
- Q: What should `GenerateOperationalReasons` receive? → A: **Full Package model with eager loads** — pass `$package` with relationships pre-loaded. Action queries what it needs internally.
- Q: Single or separate Inertia props for panels? → A: **Single `RinData` prop** — one object with `intelligence`, `guide`, and `notes` sub-objects. Single action assembles all. Frontend destructures what each panel needs.

---

## Next Steps

1. Run `/speckit-tasks` to generate implementation task list from this plan
2. Start Phase 1: Backend Foundation — migrations, models, enums, policies, service provider
3. Wire Intelligence Panel (Phase 2) — the highest-value deliverable after foundation
4. Visual testing via `/rin-playground` page throughout development
