---
title: "Feature Specification: Personal Context Notes Redesign"
---

> **[View Mockup](/mockups/001-personal-context-notes-redesign/index.html)**{.mockup-link}

# Feature Specification: Personal Context Notes Redesign

**Epic**: CW — Care Wins
**Created**: 2026-02-24
**Status**: Draft
**Input**: User feedback that the current Personal Context notes panel doesn't feel like a note-taking experience — the "Add note" button opens a modal instead of inline entry, the note text appears faded and hard to read, and category badges are oversized and not compact

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Add a Note Inline Without Leaving the Page (Priority: P1)

As a **Coordinator**, I want to type a personal context note directly in the notes panel — selecting a category and typing content inline — so that capturing context feels as quick and natural as jotting a sticky note, without the interruption of a modal dialog.

**Why this priority**: The current modal-based "Add note" flow breaks the coordinator's thought process. They see something worth recording during a call, click "Add", and are pulled into a separate dialog. An inline form removes this friction and makes the 15-second capture target (SC-001 from RIN spec) achievable.

**Independent Test**: Can be tested by navigating to a client's Relationship tab, clicking "Add note", seeing the inline form appear above existing notes, selecting a category, typing content, and saving — all without a modal appearing.

**Acceptance Scenarios**:

1. **Given** a Coordinator is viewing the Personal Context panel, **When** they click the "Add note" button, **Then** an inline form appears at the top of the notes list with category pill selector and a text input — no modal opens

2. **Given** the inline form is visible, **When** the Coordinator selects a category (e.g., "Family & Household"), types content (e.g., "Grandson Oliver starts school next week"), and clicks Save, **Then** the note is created, the form collapses, and the new note appears at the top of the list

3. **Given** the inline form is visible, **When** the Coordinator clicks Cancel or presses Escape, **Then** the form collapses without saving and the "Add note" button reappears

4. **Given** a Coordinator has typed content but not saved, **When** they click Cancel, **Then** the form closes — unsaved content is discarded (no confirmation needed for short notes)

5. **Given** the inline form is visible, **When** the Coordinator does not select a category and clicks Save, **Then** validation prevents submission and highlights that a category is required

---

### User Story 2 — Read Notes Easily With Prominent Text and Compact Metadata (Priority: P1)

As a **Coordinator**, I want to see note content displayed prominently with readable dark text and compact category indicators — so that I can scan a client's notes quickly before a call without squinting at faded text or being distracted by oversized badges.

**Why this priority**: The current design uses `text-gray-700` for content and large `CommonBadge` components for categories, making the actual note content — the most important information — visually secondary to the metadata. Coordinators scan notes before calls; the content must be the hero.

**Independent Test**: Can be tested by viewing a client with 5+ notes and confirming that note text is dark and prominent, category indicators are compact (coloured dot or small text, not large badges), and the author/date metadata is subtle but present.

**Acceptance Scenarios**:

1. **Given** a client has personal context notes, **When** the Coordinator views the Personal Context panel, **Then** each note displays with: dark, readable content text as the primary element; a compact category indicator (small coloured dot or subtle text label — not a large badge); and date and author shown as secondary metadata

2. **Given** a note was updated by "Grayce Murazik" on "24 Feb 2026", **When** the note renders, **Then** the metadata line shows the category label, author initials or short name, and relative or formatted date — all in muted secondary text below the content

3. **Given** a note has multiple categories displayed nearby, **When** the Coordinator scans the list, **Then** categories are visually distinguishable by a consistent colour (left border accent or coloured dot) without large pill badges dominating the card

4. **Given** a note is pinned to the sidebar, **When** the note renders in the list, **Then** a subtle pin indicator is visible without adding visual bulk

---

### User Story 3 — Filter Notes by Category (Priority: P2)

As a **Coordinator**, I want to filter personal context notes by category — so that when preparing for a specific type of conversation (e.g., checking family details before a care review), I can quickly find the relevant notes without scrolling through all entries.

**Why this priority**: With multiple notes across categories, finding specific context requires scrolling. A filter lets coordinators narrow to what's relevant. This becomes more valuable as note volume grows over time.

**Independent Test**: Can be tested by viewing a client with notes across all 4 categories, selecting "Family & Household" from the filter, and confirming only family-related notes appear.

**Acceptance Scenarios**:

1. **Given** a client has notes across multiple categories, **When** the Coordinator views the Personal Context panel, **Then** a row of category filter pills appears above the notes list: "All", "Interests & Hobbies", "Family & Household", "Communication Preferences", "General Notes"

2. **Given** "All" is selected (default), **When** the notes render, **Then** all notes from all categories are shown sorted by most recently updated

3. **Given** the Coordinator clicks "Family & Household", **When** the filter applies, **Then** only notes with the "Family & Household" category are shown; other notes are hidden

4. **Given** a filter is active and no notes match, **When** the panel renders, **Then** an appropriate empty state is shown: "No notes in this category yet"

5. **Given** a filter is active, **When** the Coordinator clicks "All", **Then** the filter resets and all notes are shown

---

### User Story 4 — Edit a Note Inline (Priority: P2)

As a **Coordinator**, I want to edit an existing note inline — clicking edit on a note transforms it into an editable form in place — so that correcting or updating notes feels seamless without opening a separate dialog.

**Why this priority**: Consistent with the inline-add experience from Story 1. Currently editing opens a modal, which is disruptive for small text corrections. Inline editing keeps the coordinator in flow.

**Independent Test**: Can be tested by clicking edit on an existing note, seeing the note card transform into an editable form with pre-filled content, modifying the text, saving, and seeing the updated note in place.

**Acceptance Scenarios**:

1. **Given** a Coordinator clicks the edit action on a note, **When** the edit activates, **Then** the note card transforms in place into an editable form with the current category selected, content pre-filled in a text input, and Save/Cancel buttons

2. **Given** the inline edit form is visible, **When** the Coordinator modifies the content and clicks Save, **Then** the note updates, the form collapses back to the display card, and the "Last updated" timestamp reflects the change

3. **Given** the inline edit form is visible, **When** the Coordinator clicks Cancel, **Then** the form reverts to the original display card without changes

---

### Out of Scope

- **Pin-to-sidebar workflow changes** — The pin toggle and sidebar label remain as-is; only the note display and creation flow are redesigned
- **Touchpoint panel redesign** — Touchpoint cards keep their current design; this spec covers Personal Context notes only
- **Bulk operations** — Multi-select, bulk delete, or bulk category changes are not included
- **Rich text or attachments** — Notes remain plain text
- **Mobile-specific responsive breakpoints** — The existing responsive stacking behaviour is preserved; no mobile-specific redesign

### Edge Cases

- What happens when the inline add form is open and the coordinator clicks edit on an existing note? — The add form closes (discarding unsaved content) and the edit form opens on the target note. Only one form can be active at a time
- What happens when a note has very long content? — Content is shown in full (no truncation) in the card. For notes exceeding ~200 characters, the card simply grows taller
- What happens if the category filter is active and a new note is added with a different category? — The filter resets to "All" after adding a note, ensuring the newly created note is visible
- What happens when a coordinator rapidly clicks Save multiple times? — The form disables the Save button during submission to prevent duplicate entries

---

## Requirements *(mandatory)*

### Functional Requirements

**Inline Note Creation**

- **FR-001**: System MUST replace the current modal-based "Add note" flow with an inline form that appears within the Personal Context panel — above the existing notes list
- **FR-002**: The inline add form MUST include: a category selector (pill-style toggle), an auto-expanding textarea for content (starts single-line, grows with input), and Save/Cancel actions
- **FR-003**: The inline form MUST validate that a category is selected and content is not empty before allowing submission
- **FR-004**: On successful save, the inline form MUST collapse and the new note MUST appear optimistically at the top of the notes list while the server request completes in the background. If the server rejects the save, the note MUST be removed and an error message shown
- **FR-005**: Pressing Escape or clicking Cancel MUST close the form without saving. Navigating away from the page (Inertia visit, tab switch, browser back) MUST discard the form silently — no "unsaved changes" warning

**Inline Note Editing**

- **FR-006**: System MUST replace the current modal-based edit flow with an inline edit that transforms the note card into an editable form in place
- **FR-007**: Only one inline form (add or edit) MUST be active at a time — opening one closes any other
- **FR-008**: The inline edit form MUST pre-fill the current category and content, and include Save/Cancel actions

**Note Display Redesign**

- **FR-009**: Note content text MUST be displayed in dark, readable colour — the content is the primary visual element of each note
- **FR-010**: Category indicators MUST use a coloured left border accent (3px) on each note card — replacing the current large badge components. The border colour corresponds to the category's standardised colour
- **FR-011**: Each note MUST display secondary metadata: category label, author (short name or initials), and date — in muted text below the content
- **FR-012**: Pinned notes MUST show a subtle pin indicator without adding visual bulk to the card
- **FR-013**: Action buttons (edit, delete, pin) MUST appear on hover only on desktop — reducing visual clutter when scanning notes. On touch devices, a persistent kebab (three-dot) menu MUST be shown that reveals the same actions on tap

**Category Filtering**

- **FR-014**: System MUST display a row of category filter pills above the notes list with options: "All" (default), and one pill per category. Each pill MUST show the count of notes in that category (e.g., "Family (3)")
- **FR-015**: Selecting a filter pill MUST immediately show only notes matching that category; selecting "All" resets to show all notes. When a filter is active, the "Show all / Show less" collapse limit (5 entries) MUST be bypassed — all matching notes are shown
- **FR-016**: When a filter is active and no notes match, an empty state message MUST be shown
- **FR-017**: Category filter state MUST be client-side only — not persisted or sent to the server

**Edit Behaviour**

- **FR-018a**: After an inline edit is saved, the note MUST remain in its current list position — not re-sort to the top. Re-sorting occurs on the next full page load

**Visibility Badge**

- **FR-018b**: Each note MUST display a subtle "Internal Only" visibility indicator, preserving the existing visibility badge in a compact form

**Consistent Category Colours**

- **FR-019**: Category colours MUST be consistent across all locations where they appear: note cards, filter pills, sidebar badges, and the category selector in forms

### Key Entities

No new entities. This redesign changes only the presentation layer of the existing **Personal Context Entry** entity and its create/edit interactions.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Coordinators can add a personal context note in under 10 seconds using the inline form (improved from 15-second modal target)
- **SC-002**: Note content text is visually the most prominent element in each note card — darker and larger than metadata
- **SC-003**: Category indicators occupy no more than ~20% of the visual space of the previous badge design
- **SC-004**: All four category colours are consistent across note cards, filter pills, sidebar badges, and form selectors
- **SC-005**: The category filter narrows results instantly (client-side) with no page reload or server round-trip

---

## Clarifications

### Session 2026-02-24 (Design Decisions)

- Q: Note card visual style? → A: **Left-border accent cards** — each note has a 3px coloured left border matching its category colour. Content is dark prominent text, metadata (category label, author, date) in a subtle secondary line below. Actions (pin, edit, delete) appear on hover via kebab menu or icon row
- Q: Should the inline add form include the pin-to-sidebar option? → A: **No — keep pin separate**. Inline form is minimal: category pills + text input + Save/Cancel. Pinning remains a post-creation action on the note card. This keeps the inline form fast and focused
- Q: Category colour palette? → A: **Teal-family palette** standardised across all locations:
  - Interests & Hobbies → `green-600` (#16a34a)
  - Family & Household → `blue-600` (#2563eb)
  - Communication Preferences → `amber-600` (#d97706)
  - General Notes → `gray-500` (#6b7280)

### Session 2026-02-24 (Spec Lens)

- Q: Save behavior for inline form? → A: **Optimistic client-side add** — note appears instantly in the list while the server request completes in the background. Rollback with error message if server rejects
- Q: Should the 5-entry collapse limit apply when a category filter is active? → A: **No collapse when filtered** — when a filter narrows results, show all matching notes. Collapse only applies to the unfiltered "All" view
- Q: Delete confirmation style? → A: **Keep native browser confirm()** — simple, works everywhere, no extra UI to build
- Q: How do mobile/touch users access hover-only actions? → A: **Always show kebab menu on touch** — hover actions on desktop, persistent three-dot menu on touch devices
- Q: Text input type for inline form? → A: **Auto-expanding textarea** — starts as a single line, expands as the user types. Compact for short notes, accommodates longer ones
- Q: Unsaved form state on navigation? → A: **Discard silently** — notes are short; if you navigate away, you weren't committed. No "unsaved changes" warning
- Q: Show note counts on filter pills? → A: **Yes — show counts** (e.g., "Family (3)"). Helps coordinators see distribution at a glance
- Q: After inline edit, should note re-sort to top? → A: **Stay in place** — less disorienting. Moves to top on next full page load
- Q: Keep the "Internal Only" visibility badge? → A: **Yes — keep it** in a compact form. Future-proofs for when visibility options may be added

## Clarification Outcomes

### Q1: [Scope] This sub-epic redesigns the Personal Context panel only. Are there plans for the Touchpoint panel to follow the same design patterns (inline editing, compact metadata)? If so, should shared components be built?
**Answer:** The Touchpoint panel is explicitly out of scope per the spec. The RIN (Relationship Intelligence) data model (`.tc-docs/content/initiatives/Clinical-And-Care-Plan/001-RIN-Relationship-Intelligence/data-model.md`) shows PersonalContextEntry and Touchpoint as separate entities with different schemas. The PersonalContextEntry has `category`, `content`, `created_by`, `updated_by` while Touchpoints have `type`, `duration_minutes`, `activity`, `sentiment`, `notes`. Given their structural differences, shared inline-editing components would add complexity without clear benefit. **Recommendation: Build the inline form as a PersonalContext-specific component. If Touchpoints later adopt inline editing, extract shared patterns at that time.**

### Q2: [UX] FR-004 specifies optimistic client-side add with rollback on server rejection. What is the error recovery UX? Does the user see the note disappear with an error toast, or is there a retry option?
**Answer:** The spec says "the note MUST be removed and an error message shown." The Inertia v2 + Vue 3 stack uses `useForm()` with error handling built in. The pattern across the Portal is error toasts (the codebase uses toast notifications extensively). **Recommendation: Show an error toast with the failure reason. The note disappears from the optimistic position. No retry -- the form re-opens with the content pre-filled so the user can try again. This aligns with the "discard silently" philosophy but gives a recovery path for server errors.**

### Q3: [Edge Case] The spec says "unsaved content is discarded" on navigation. For notes approaching 200+ characters, should there be a character count indicator to help users gauge whether their note is too long to risk losing?
**Answer:** The spec explicitly says "notes are short; if you navigate away, you weren't committed. No unsaved changes warning." The edge case section says content is shown in full for notes exceeding ~200 characters but does not suggest a limit. **Assumption: No character count indicator is needed. Notes are plain text with no length limit. The textarea auto-expands (FR-002). The "discard silently" decision was made consciously -- adding a character count would imply a limit that doesn't exist.**

### Q4: [Data] No new entities are created, but the category colour mapping is hardcoded in the spec. Should these colours be stored in a config/database for future flexibility, or is hardcoding acceptable?
**Answer:** The spec explicitly defines 4 fixed category colours (green-600, blue-600, amber-600, gray-500) and FR-019 requires consistency across all locations. The PersonalContextEntry model (per the RIN data model) stores `category` as a string enum with 4 values: `interests_hobbies`, `family_household`, `important_dates`, `general_notes`. Note: the spec references "Communication Preferences" as a category but the data model uses "important_dates" -- this is a discrepancy. **Recommendation: Hardcode colours in a shared Vue composable (e.g., `usePersonalContextCategories()`) that maps category enum values to colours, labels, and filter pills. Database storage is unnecessary for 4 fixed categories. Resolve the category naming discrepancy before design begins.**

### Q5: [Scope] The PersonalContextEntry model does not yet exist in the codebase. This redesign depends on the RIN epic delivering the data model first. What is the delivery order?
**Answer:** Codebase search confirms `PersonalContextEntry` and `personal_context_entries` do not exist as PHP classes or database tables. The RIN data model defines the schema. This spec is a UX redesign of a feature that hasn't been built yet. **This is a critical dependency: the RIN epic must deliver the PersonalContextEntry CRUD before this Care Win can be implemented. The spec should be sequenced after RIN's core data model is in place.**

### Q6: [Data] The spec mentions "Interests & Hobbies", "Family & Household", "Communication Preferences", "General Notes" as categories. The RIN data model uses "interests_hobbies", "family_household", "important_dates", "general_notes". Is "Communication Preferences" the same as "Important Dates"?
**Answer:** The RIN data model in `data-model.md` defines 4 categories: `interests_hobbies`, `family_household`, `important_dates`, `general_notes`. This spec lists: "Interests & Hobbies", "Family & Household", "Communication Preferences", "General Notes". "Communication Preferences" does not match "Important Dates." **This is a naming mismatch that must be resolved. Either the RIN data model should add "communication_preferences" and rename "important_dates", or this spec should align with the RIN categories.**

### Q7: [UX] FR-013 says hover-only actions on desktop and persistent kebab menu on touch devices. How is touch detection handled?
**Answer:** The codebase uses Tailwind CSS v3 with standard responsive breakpoints. Touch detection via CSS media queries (`@media (hover: none)`) or a JS-based detection. **Assumption: Use CSS `@media (hover: hover)` for hover-only actions and show the kebab menu when `(hover: none)`. This is a standard pattern that works without JS-based touch detection.**

### Q8: [Performance] FR-017 says category filter state is client-side only. With potentially many notes, is there a concern about performance with client-side filtering?
**Answer:** The spec's "Show all / Show less" collapse limit of 5 entries means the default view is compact. When a filter is active, the collapse limit is bypassed (FR-015). Given that personal context notes are per-recipient and unlikely to exceed a few dozen, client-side filtering is appropriate. **No performance concern. Client-side filtering via Vue computed properties is the correct approach.**

## Refined Requirements

Based on clarification outcomes, the following additional acceptance criteria are recommended:

1. **Dependency prerequisite**: This spec MUST NOT begin implementation until the RIN epic has delivered the PersonalContextEntry model, migration, and basic CRUD endpoints.
2. **Category alignment**: Before design, resolve the category naming mismatch between this spec ("Communication Preferences") and the RIN data model ("important_dates"). Update both specs to use a consistent taxonomy.
3. **Optimistic add recovery**: When FR-004's optimistic add fails due to a server error, the inline form SHOULD re-open with the previously entered content pre-filled, and an error toast SHOULD be displayed.
