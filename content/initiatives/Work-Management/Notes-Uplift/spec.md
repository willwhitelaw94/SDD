---
title: "Feature Specification: Notes Uplift"
---

> **[View Mockup](/mockups/notes-uplift/index.html)**{.mockup-link}

# Feature Specification: Notes Uplift

**Epic**: NUL — Notes Uplift
**Created**: 2026-02-26
**Status**: Draft
**Input**: User feedback — "Make Notes Better. Most used page. Can't keyword search. Design Size too big. Associate Notes to Touch Points."

---

## Context

Notes is the most-used feature in TC Portal. Coordinators use it daily across Packages, Care Coordinators, Suppliers, and Bills to record care interactions, clinical observations, and operational details. Despite its importance, the notes experience has three fundamental gaps:

1. **No keyword search** — Coordinators cannot search within notes. On a client with 50+ notes built up over months of care, finding a specific detail (e.g., "when did we last discuss medication changes?") requires scrolling through every note manually
2. **Oversized design** — Each note card consumes significant vertical space with large category badges, excessive padding, and prominent metadata — meaning coordinators see fewer notes per screen and spend more time scrolling
3. **No touchpoint association** — Notes exist in isolation from the touchpoint (call, visit, email) that generated them. A coordinator takes notes during a phone call but there's no way to link those notes back to the call record, making it hard to reconstruct the full picture of an interaction

> **Scope note**: The Personal Context notes panel (within Relationship Intelligence) has its own redesign spec under `Care-Wins/001-Personal-Context-Notes-Redesign`. This spec covers the **general notes system** used on Package, Care Coordinator, Supplier, and Bill pages.

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Search Notes by Keyword (Priority: P1)

As a **Coordinator**, I want to type a keyword into a search field on the notes panel and instantly see only the notes containing that term — so that I can find specific information across months of accumulated notes without scrolling through every entry.

**Why this priority**: This is the most requested improvement. Notes is the most-used page, and without search, coordinators waste significant time manually scanning notes — especially for long-term clients with dozens or hundreds of entries. Every other content-heavy area of TC Portal has search; notes is the glaring exception.

**Independent Test**: Can be tested by navigating to a Package with 10+ notes, typing a keyword that appears in only some notes, and confirming the list filters to show only matching notes with the search term highlighted.

**Acceptance Scenarios**:

1. **Given** a Coordinator is viewing the notes panel on a Package, **When** they type "medication" into the search field, **Then** only notes containing "medication" are shown, and the matching text is highlighted within each note

2. **Given** a Coordinator has typed a search term, **When** they clear the search field, **Then** all notes are shown again in their default order

3. **Given** a Coordinator searches for "physio", **When** a note contains "physiotherapy", **Then** the note is included in results — search matches partial words

4. **Given** a Coordinator searches for a term that appears in no notes, **When** the results render, **Then** an empty state message is shown: "No notes matching '[term]'"

5. **Given** a Coordinator has an active search, **When** they also apply a category filter, **Then** both filters combine — only notes matching the keyword AND the selected category are shown

6. **Given** a Coordinator is viewing notes on a Care Coordinator, Supplier, or Bill page, **When** they use the search field, **Then** the same keyword search behaviour applies — search works consistently across all note contexts

---

### User Story 2 — See More Notes at a Glance With a Compact Design (Priority: P1)

As a **Coordinator**, I want each note to take up less vertical space — with compact category indicators, tighter spacing, and content as the visual hero — so that I can scan more notes per screen without endless scrolling.

**Why this priority**: The current design uses large `CommonBadge` components for categories and generous padding, meaning each note card occupies substantial screen real estate. On a busy day, coordinators glance at notes before calls — seeing 3 notes versus 8 in the same viewport makes a meaningful difference to their workflow speed.

**Independent Test**: Can be tested by comparing the current notes panel with the redesigned version on a Package with 10+ notes and confirming that more notes are visible in the same viewport height.

**Acceptance Scenarios**:

1. **Given** a Package has notes with categories, **When** the Coordinator views the notes panel, **Then** each note displays with: prominent dark content text as the primary element; a compact category indicator (coloured dot or small text label — not a large badge); and author name and date as subtle secondary metadata

2. **Given** a note has content exceeding 5 lines (~300 characters), **When** the note renders in the list, **Then** the content is truncated at 5 lines with a "Show more" toggle. Notes at or under the threshold display in full

3. **Given** a note has multiple pieces of metadata (category, author, date, visibility), **When** the note renders, **Then** all metadata fits on a single compact line below the content — not stacked vertically across multiple lines

4. **Given** a Coordinator is viewing the notes panel, **When** they compare the visible note count with the previous design, **Then** at least 50% more notes are visible in the same viewport height

---

### User Story 3 — Link a Note to a Touchpoint (Priority: P2)

As a **Coordinator**, I want to associate a note with a specific touchpoint (phone call, visit, email) — so that when I review a touchpoint later, I can see the notes that were recorded during or about that interaction, and vice versa.

**Why this priority**: Today, notes and touchpoints exist as separate records with no connection. A coordinator finishes a phone call, logs a touchpoint, then creates a note with their observations — but these two records are disconnected. When another team member reviews the client's history, they see the touchpoint and the note separately, with no way to understand they're related. Linking them reconstructs the full picture.

**Independent Test**: Can be tested by creating a note on a Package, selecting an existing touchpoint from the association picker, saving, and then viewing the touchpoint to confirm the linked note appears — and vice versa.

**Acceptance Scenarios**:

1. **Given** a Coordinator is creating or editing a note on a **Package**, **When** they look at the note form, **Then** an optional "Link to Touchpoint" field is available that lets them search and select a recent touchpoint for this Package. This field is not available on Care Coordinator, Supplier, or Bill notes

2. **Given** a Coordinator selects a touchpoint from the picker, **When** they save the note, **Then** the note is associated with that touchpoint and the touchpoint reference appears as metadata on the note card (e.g., "Linked to: Phone Call — 24 Feb 2026")

3. **Given** a note is linked to a touchpoint, **When** a Coordinator views that touchpoint's detail view, **Then** the linked note(s) appear within the touchpoint record

4. **Given** a note is linked to a touchpoint, **When** a Coordinator views the note in the notes list, **Then** they can click the touchpoint reference to navigate to the touchpoint detail

5. **Given** a Coordinator is creating a note, **When** no touchpoints exist for this Package, **Then** the "Link to Touchpoint" field shows "No touchpoints available" and the note can still be saved without an association

6. **Given** a note is already linked to a touchpoint, **When** the Coordinator edits the note, **Then** they can change the linked touchpoint or remove the association entirely

---

### User Story 4 — Filter Notes by Category (Priority: P2)

As a **Coordinator**, I want to filter notes by their category — so that I can narrow the list to only the type of notes I need (e.g., clinical notes before a care review, or service change notes before a budget meeting).

**Why this priority**: With keyword search (Story 1) as the primary finding mechanism, category filtering provides a complementary way to narrow notes when the coordinator knows the type but not the specific content. Becomes increasingly valuable as note volume grows.

**Independent Test**: Can be tested by viewing a Package with notes across multiple categories, selecting one category from the filter, and confirming only matching notes appear.

**Acceptance Scenarios**:

1. **Given** a Package has notes across multiple categories, **When** the Coordinator views the notes panel, **Then** a row of parent category groups (e.g., Clinical, Operational, Administrative) appears above the notes list, with "All" as the default

2. **Given** the Coordinator selects a parent group (e.g., "Clinical"), **When** the filter applies, **Then** only notes in that group's child categories are shown, and the group expands to reveal individual child category filters for further narrowing

3. **Given** a category filter is active, **When** the Coordinator also has an active keyword search, **Then** both filters combine — only notes matching the keyword AND the selected category are shown

4. **Given** a filter is active and no notes match, **When** the panel renders, **Then** an appropriate empty state is shown

5. **Given** the Coordinator clicks "All", **When** the filter resets, **Then** all notes are shown in default order

---

### User Story 5 — Create Notes From a Touchpoint (Priority: P3)

As a **Coordinator**, I want to create a new note directly from a touchpoint record — so that after logging a call or visit, I can immediately capture my observations linked to that interaction without navigating to the notes panel separately.

**Why this priority**: This is a workflow convenience that builds on Story 3's association capability. Rather than creating a note on the Package and then linking it to a touchpoint, the coordinator can start from the touchpoint. This reverses the flow for situations where the touchpoint is the trigger.

**Independent Test**: Can be tested by opening a touchpoint detail, clicking "Add Note", completing the note form with the touchpoint pre-linked, saving, and confirming the note appears both in the Package notes list and linked to the touchpoint.

**Acceptance Scenarios**:

1. **Given** a Coordinator is viewing a touchpoint detail, **When** they click "Add Note", **Then** the note creation form opens with the touchpoint pre-linked (the association is pre-filled and the Package context inherited)

2. **Given** the Coordinator saves the note from a touchpoint, **When** the note is created, **Then** it appears in the Package's notes list with the touchpoint association visible

3. **Given** the Coordinator cancels the note creation from a touchpoint, **When** they return to the touchpoint, **Then** no note is created

---

### Out of Scope

- **Personal Context notes redesign** — Covered by the separate `Care-Wins/001-Personal-Context-Notes-Redesign` spec
- **Rich text editor** — ~~Notes remain plain text~~ Moved to MVP. Tiptap rich text editor included in P1 scope (see FR-025–FR-029)
- **File attachments overhaul** — The existing attachment capability remains as-is
- **Bulk operations** — Multi-select, bulk delete, or bulk recategorisation
- **Notification system changes** — The existing tagging and notification behaviour for tagged users/teams remains unchanged
- **Draft/auto-save changes** — The existing draft mechanism remains as-is
- **Touchpoint creation from notes** — Only note creation from touchpoints is in scope (Story 5), not creating touchpoints from the notes panel

### Edge Cases

- What happens when a linked touchpoint is deleted? — The note remains but the touchpoint reference is removed. The note shows "Linked touchpoint removed" in muted text where the reference was
- What happens when searching and filtering simultaneously yields no results? — Show a combined empty state: "No notes matching '[term]' in [category]" with a clear-all link
- What happens when a note is linked to a touchpoint on a different Package? — This should not be possible; the touchpoint picker only shows touchpoints belonging to the same noteable (Package, Care Coordinator, etc.)
- What happens when the search field has a very long query? — Search input is capped at 100 characters
- What happens when a coordinator searches while notes are still loading (pagination)? — Search sends a server-side request that replaces the paginated list with search results across the full history. A loading indicator is shown while the search request is in flight

---

## Requirements *(mandatory)*

### Functional Requirements

**Keyword Search**

- **FR-001**: System MUST provide a search field at the top of the notes panel on all note contexts (Package, Care Coordinator, Supplier, Bill)
- **FR-002**: System MUST send a debounced server-side search request (300ms after the Coordinator stops typing) and return all matching notes across the full note history — not limited to the currently loaded page. While the request is in flight, an inline spinner MUST be shown within the search field; the current note list remains visible until results arrive
- **FR-003**: Search MUST be case-insensitive and match partial words (e.g., "physio" matches "physiotherapy")
- **FR-004**: Matching text within note content MUST be visually highlighted in the search results. Highlighting is client-side — the frontend matches the current search term against rendered note content and wraps matches (no server-side highlight markers needed)
- **FR-005**: When search and category filters are both active, they MUST combine (AND logic) — only notes matching both criteria are shown
- **FR-006**: Search MUST be server-side, querying the full note history for the noteable entity. Results MUST be paginated (25 per page) with infinite scroll to load more, consistent with the default notes pagination. Results MUST be sorted by most recent first (same as default view). Search state (the current query string) is not persisted across page navigations

**Compact Note Design**

- **FR-007**: Note content MUST be displayed in dark, readable text as the primary visual element of each note card
- **FR-008**: Category indicators MUST use a compact format (coloured dot or small text label) — replacing the current large badge components
- **FR-009**: Note metadata (category label, author, date, visibility) MUST be consolidated into a single compact line
- **FR-010**: Note content exceeding 5 lines (~300 characters) MUST be truncated with a "Show more" / "Show less" toggle. Notes at or under the threshold display in full
- **FR-011**: Action buttons (edit, delete) MUST appear on hover only on desktop. On touch devices, a persistent kebab menu MUST be shown
- **FR-012**: The redesigned note card MUST be applied consistently across all note contexts (Package, Care Coordinator, Supplier, Bill)

**Touchpoint Association**

- **FR-013**: The note creation and edit forms on **Package notes only** MUST include an optional "Link to Touchpoint" field. Care Coordinator, Supplier, and Bill notes do not support touchpoint linking
- **FR-014**: The touchpoint picker MUST show recent touchpoints for the same Package, searchable by date and type
- **FR-015**: A note MUST support linking to at most one touchpoint; a touchpoint MAY have multiple linked notes
- **FR-016**: Linked touchpoint reference MUST appear as metadata on the note card with a clickable link to the touchpoint detail
- **FR-017**: When viewing a touchpoint detail, all linked notes MUST be displayed within the touchpoint record
- **FR-018**: A Coordinator MUST be able to remove a touchpoint association from a note without deleting the note

**Category Filtering**

- **FR-019**: System MUST display category filter options above the notes list as parent groups (e.g., Clinical, Operational, Administrative), with "All" as the default. Each group expands to reveal its child categories for sub-filtering
- **FR-020**: Selecting a parent group MUST filter the notes list to show all notes in that group's child categories. Selecting a specific child category MUST narrow further to just that category. Notes with multiple categories MUST appear in results if **any** of their categories match the active filter (inclusive OR logic)
- **FR-021**: Category filter MUST be server-side — the selected category is sent as a query parameter and the server returns only matching notes, paginated. This ensures correct results regardless of how many notes are loaded. Filter state is not persisted across page navigations
- **FR-022**: When a filter is active and no notes match, an empty state MUST be shown

**Create Note From Touchpoint**

- **FR-023**: Touchpoint detail view MUST include an "Add Note" action
- **FR-024**: Notes created from a touchpoint MUST be pre-linked to that touchpoint and inherit the Package context

**Rich Text Editor (MVP — P1)**

- **FR-025**: The note creation and edit forms MUST use a rich text editor (Tiptap) with a toolbar supporting: Bold, Italic, Underline, Strikethrough, Bullet list, Ordered list, Link, and Attachment
- **FR-026**: The editor MUST support @mention for users and teams using the existing tagging system. Typing `@` opens an autocomplete picker showing matching users and teams; selecting one inserts a mention token and triggers the existing notification behaviour
- **FR-027**: Note content saved from the rich text editor MUST be stored as sanitised HTML. The server MUST strip disallowed tags (e.g. `<script>`, `<iframe>`) to prevent XSS
- **FR-028**: Rich text content MUST render correctly in compact note cards. Truncation (FR-010, 5-line threshold) applies to the rendered HTML output, not raw HTML string length
- **FR-029**: When pasting content from Word or web pages, the editor MUST strip unsupported formatting and preserve only: plain text, bold, italic, and lists. All other formatting is dropped on paste

### Key Entities

- **Note** (existing): Polymorphic record attached to Package, Care Coordinator, Supplier, or Bill. Gains an optional touchpoint association
- **Touchpoint** (existing): Record of a care interaction (call, visit, email). Gains a reverse relationship to linked notes
- **Note–Touchpoint Link**: Dedicated link entity (own table/model) associating a Note with a Touchpoint, following the same pattern used in Relationship Intelligence. Allows bidirectional navigation and supports future extensibility

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Coordinators can find a specific note by keyword in under 2 seconds, regardless of how many notes exist on the Package
- **SC-002**: The redesigned notes panel shows at least 50% more notes in the same viewport height compared to the current design
- **SC-003**: Coordinators can link a note to a touchpoint during creation in under 3 additional seconds (one field selection)
- **SC-004**: Keyword search works consistently across all four note contexts (Package, Care Coordinator, Supplier, Bill)
- **SC-005**: When viewing a touchpoint, all linked notes are visible without navigating to a separate page

---

## Clarifications

### Session 2026-02-26 (Spec Lens)

- Q: Touchpoint association scope — all four note contexts or Package only? → A: **Package notes only**. Touchpoints are Package-level records; Care Coordinator, Supplier, and Bill notes don't naturally relate to touchpoints
- Q: Category filter with 40+ categories? → A: **Group into parent groups** (Clinical, Operational, Administrative, etc.) with expandable child categories for sub-filtering
- Q: Search scope — client-side or server-side? → A: **Server-side search** with 300ms debounce. Returns all matching notes across full history, not limited to loaded page
- Q: Multi-category notes — how does filtering work? → A: **Inclusive OR** — if any of a note's categories match the active filter, the note appears
- Q: Note content truncation threshold? → A: **5 lines (~300 characters)**. Notes at or under threshold display in full; longer notes get "Show more" toggle
- Q: Overall design density? → A: **Nice and compact** — the entire notes panel should feel tight and space-efficient, not just individual cards
- Q: Search pagination strategy? → A: **Paginated results** — return first 25 matches, load more on scroll (consistent with existing notes pagination)
- Q: Sort order for default view and search results? → A: **Most recent first for both** — default list and search results both sort by newest note first, keeping behaviour predictable
- Q: Note–Touchpoint link data model? → A: **Dedicated link entity** (own table/model), consistent with Relationship Intelligence pattern. Not a simple FK on notes table
- Q: Search highlighting — server or client? → A: **Client-side** — frontend matches search term in rendered content and wraps in highlight markup. No API contract changes needed
- Q: Category filter — client-side or server-side? → A: **Server-side** — category sent as query param, server returns only matching notes paginated. Avoids empty results when matching notes exist beyond the loaded page
- Q: Category parent groups — configurable or hardcoded? → A: **Hardcoded** — parent groups (Clinical, Operational, Administrative, etc.) and their child category mappings are defined in code, not admin-configurable
- Q: Search response time target? → A: **Under 2 seconds** — tightened from 5s. Achievable with LIKE query + index on typical note volumes
- Q: Search loading state? → A: **Inline spinner** in the search field while request is in flight. Current note list stays visible until results arrive — no skeleton or overlay

---

## Gap-Identified Stories

*Generated by `/trilogy-design-gap` on 2026-03-09*
*Figma: [Portal Navigation — Notes WIP](https://www.figma.com/design/v16iRY8ciG1xEdFKfm7lGQ/Portal-Navigation?node-id=585-2770)*
*Source: Design cross-check against PLA-1402 and Figma WIP frames*

---

### New Stories

**[GAP-US-01]** As a **Coordinator**, I want to double-click a note to edit it inline — so that I can quickly fix a typo or update a note without opening a separate modal.

- **Source**: GAP (Figma → Spec) — WIP frame "Notes | In-line editing" shows note editing directly in the list. PLA-1402 annotation: "In-line edit with double-click"
- **Phase**: 2
- **Acceptance criteria**:
  - Given a Coordinator double-clicks a note, the note body becomes an editable field in place
  - Given a Coordinator is editing inline and clicks "Save", the note is saved and returns to read state
  - Given a Coordinator is editing inline and presses Escape or clicks "Cancel", the note reverts to its previous content
  - Given a Coordinator is editing inline on a touch device, a dedicated "Edit" button opens the modal instead (inline editing is desktop-only)

---

**[GAP-US-02]** As a **Coordinator**, I want to pin an important note so that it appears at the top of the notes list regardless of date — so that critical information is always visible without searching.

- **Source**: GAP (Figma → Spec) — Figma create note modal shows a pin toggle (📌); filter panel shows "Pinned notes first" sort option
- **Phase**: 2
- **Acceptance criteria**:
  - Given a Coordinator creates or edits a note, a pin toggle is available in the note form
  - Given a note is pinned, it appears at the top of the notes list when "Pinned notes first" is selected as the sort order
  - Given sort is set to "Most recent", pinned notes sort normally by date (no special positioning)
  - Given a Coordinator unpins a note, it returns to its natural date position in the list

---

**[GAP-US-03]** As a **Coordinator**, I want to filter notes by date range — so that I can quickly narrow down notes to a specific period (e.g., "what happened in February?") without scrolling through everything.

- **Source**: GAP (Figma → Spec) + GAP (PLA-1402 → Spec) — Figma filter panel has From/To date pickers; PLA-1402 lists "Date range filter (from/to)" as a desired feature
- **Phase**: 2
- **Acceptance criteria**:
  - Given a Coordinator opens the filter panel, From and To date inputs are available
  - Given a Coordinator sets a date range, only notes created within that range are shown
  - Given only a From date is set (no To), notes from that date onwards are shown
  - Given only a To date is set (no From), all notes up to that date are shown
  - Given a date range filter is active alongside keyword search, both filters combine (AND logic)
  - Given a Coordinator clears the date range, the full note list is restored

---

**[GAP-US-04]** As a **Coordinator**, I want to filter notes by author — so that I can review all notes written by a specific team member for quality assurance or handover purposes.

- **Source**: GAP (PLA-1402 → Spec) — PLA-1402 lists "Author/created-by filter (searchable select)" under Additional Filters
- **Phase**: 2
- **Acceptance criteria**:
  - Given a Coordinator opens the filter panel, an author filter is available as a searchable select
  - Given a Coordinator selects an author, only notes written by that person are shown
  - Given an author filter is active alongside keyword search or date range, all filters combine (AND logic)

---

### Open Questions Requiring Resolution Before Dev

**[OQ-01] Filter UI approach** — Sidebar panel (Figma) vs horizontal pills (spec/mockup) vs hybrid. **Blocks FR-019–FR-022.**

**[OQ-02] Tiptap rich text editor** — ~~Phase 2 question~~ **RESOLVED: Expanded to MVP.** Tiptap added as FR-025–FR-029. @mention support included (FR-026).

**[OQ-03] "Area" field** — Figma create note modal shows an "Area" dropdown alongside category tags. What does it map to in the data model? **Blocks note creation form design.**

**[OQ-04] Tab rename** — Figma labels the tab "Notebook" instead of "Notes". Confirm with PM before implementation.

**[OQ-05] Empty states** — No Figma frames designed for empty states. Developer implements per spec (FR-022 + Edge Cases section) without Figma reference.
