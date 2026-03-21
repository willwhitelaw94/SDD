---
title: "Design Brief: Notes Uplift"
status: Draft
created: 2026-02-26
updated: 2026-03-05
---

# Design Brief: Notes Uplift

**Epic:** NUL — Notes Uplift
**Spec:** [spec.md](./spec.md)

**Design References:**
- Figma — Notebook tab: `figma.com/design/v16iRY8ciG1xEdFKfm7lGQ/Portal-Navigation?node-id=551-4210`
- Figma — Create Note modal: `figma.com/design/v16iRY8ciG1xEdFKfm7lGQ/Portal-Navigation?node-id=551-4170`
- Mockup — Notes panel (compact): `challenge-psi-two.vercel.app/01-notes-panel.html`
- Mockup — Search active: `challenge-psi-two.vercel.app/02-search-active.html`
- Mockup — Add note form: `challenge-psi-two.vercel.app/03-add-note-form.html`
- Mockup — Touchpoint with notes: `challenge-psi-two.vercel.app/04-touchpoint-with-notes.html`

---

## User Context

| Aspect | Answer | Impact on Design |
|--------|--------|------------------|
| Primary User | Care Coordinator | Needs efficiency — scan, search, filter fast |
| Device Priority | Desktop-first | Can use hover states, dense layouts, keyboard shortcuts |
| Usage Frequency | Daily (most-used page) | Worth investing in density and speed — every pixel matters |
| Context | Multitasking, time-pressured (before/between calls) | Quick glance, not deep reading — content must be scannable |

---

## Design Principles

**North Star:** Make notes feel like a fast, searchable log — not a wall of cards.

**Supporting Principles:**
1. **Content is king** — Note text is the hero element. Everything else (category, author, date) is secondary metadata
2. **Density over decoration** — Compact cards, tight spacing, more notes per screen. No large badges or generous padding
3. **Progressive disclosure** — Show what's needed at a glance; details on demand (truncation, hover actions, expandable filters)
4. **Consistency across contexts** — Same note card design on Package, Care Coordinator, Supplier, and Bill pages
5. **Unified activity stream** — Check-in cards interleave with notes in a single timeline, giving coordinators one place to see all activity

---

## Build Size

**Size:** Large (upgraded from Medium)

**Rationale:**
- 2 main views affected (notes panel + touchpoint detail)
- 1 new component: compact note card (replacing existing)
- 1 new component: check-in timeline card (interleaved in notes)
- 1 significant addition: Tiptap rich text editor in note creation/edit forms
- 1 new interaction: touchpoint picker in note form
- Search field + category filter bar are new UI elements
- Sidebar filter panel (designer's Figma) adds tag type + date range + sort controls
- Note CRUD forms rebuilt with Tiptap editor, @mentions, area field

---

## Scope

**MVP (P1 — Stories 1 & 2 + Check-In Cards + Rich Editor):**
- Compact note card redesign (DONE — built and verified)
- Check-in timeline cards interleaved in Package notes (DONE — built and verified)
- Keyword search with server-side pagination
- Client-side search highlighting (`<mark>` tags, yellow `#FEF08A` background)
- Search results info bar ("3 notes match 'physio' across full history")
- Inline spinner loading state
- **Tiptap rich text editor** — Bold, Italic, Underline, Strikethrough, Bullet/Ordered lists, Link, Attachment (expanded from Phase 2 — confirmed MVP)
- **@mention support** — Typing `@` opens user/team autocomplete, uses existing notification system

**Phase 2 (P2 — Stories 3 & 4):**
- ~~Tiptap rich text editor~~ (moved to MVP)
- Touchpoint association (Package notes only)
- Category filter with parent group pills
- Bidirectional touchpoint–note navigation
- Sidebar filter panel: tag type checkboxes, date range, sort (from designer's Figma)

**Deferred (P3 — Story 5):**
- Create note from touchpoint detail

**Feature Flags:**
- `notes-uplift` — Controls the new compact design + search. When off, existing notes UI is shown
- `CarePartnerCheckInsFeature` — Controls check-in timeline cards in Package notes (already implemented)

---

## Constraints

### Accessibility
- WCAG Target: Level AA
- Keyboard navigation: Search field must be focusable, filter groups keyboard-navigable
- Screen reader: Search results count announced, filter state communicated
- Tiptap editor: Must support keyboard shortcuts (Cmd+B bold, Cmd+I italic, etc.)

### Security & Privacy
- Note visibility rules unchanged — existing permission model applies
- Touchpoint picker must only show touchpoints the coordinator has access to
- Tiptap: sanitize HTML output server-side to prevent XSS

### Dependencies
- **Personal Context notes** — Separate redesign under `Care-Wins/001-Personal-Context-Notes-Redesign`. Must not conflict
- **Touchpoints system** — Existing touchpoint model gains reverse relationship to notes via dedicated link entity
- **Note categories** — Existing category system; parent group mappings are new (hardcoded)
- **Tiptap packages** — New npm dependency: `@tiptap/vue-3`, `@tiptap/starter-kit`, extensions for link, list, placeholder
- **Check-in system** — Existing check-in models; timeline cards already integrated behind feature flag

---

## Edge Cases

| Edge Case | How to Handle | Priority |
|-----------|---------------|----------|
| No notes exist | Empty state: "No notes yet" with create action | P1 |
| Search returns no results | "No notes matching '[term]'" with clear link | P1 |
| Search + filter returns no results | "No notes matching '[term]' in [category]" with clear-all link | P1 |
| Note content exceeds 5 lines | Truncate with "Show more" / "Show less" toggle | P1 |
| Very long search query | Cap input at 100 characters | P1 |
| Search while loading (pagination) | Server-side search replaces paginated list; inline spinner shown | P1 |
| Check-in cards in search results | Check-in cards are excluded from keyword search — search only filters notes | P1 |
| Linked touchpoint is deleted | Note remains; shows "Linked touchpoint removed" in muted text | P2 |
| No touchpoints available for Package | Picker shows "No touchpoints available"; note saves without association | P2 |
| Note has multiple categories, filter active | Inclusive OR — note appears if any category matches | P2 |
| Coordinator searches then navigates away | Search state not persisted; returns to default on revisit | P1 |
| Tiptap paste from Word/web | Strip unsupported formatting, preserve text + basic formatting (bold, italic, lists) | P2 |
| Rich text rendering in compact cards | Render HTML safely with prose-like styles; truncation applies to rendered output | P2 |

---

## Design Tokens & Patterns

### Panel Layout (Updated — from Designer's Figma)

The designer's Figma (node 551-4210) shows a "Notebook" tab with a **sidebar filter panel** alongside the notes list:

```
┌────────────────────────┬────────────────────────────────────────┐
│ Tag type               │ 🔍 Search notes...                     │
│ ☐ Assessment/Care Plan ├────────────────────────────────────────┤
│ ☐ Clinical Activity    │ Financial Enquiry                      │
│ ☐ Equipment & Supplies │ Lorem ipsum dolor sit amet...          │
│ ☐ Service Coordination │ 🟣 Beth Poultney · 20 Feb 26 · 📎 doc │
│ ☐ Service Changes      │────────────────────────────────────────│
│ ☐ Commission resolution│ Financial Enquiry                      │
│ ☐ Direct Care Check-in │ Lorem ipsum dolor sit amet...          │
│ ...                    │ 🟣 Beth Poultney · 20 Feb 26 · 📞 call│
│                        │────────────────────────────────────────│
│ Dates                  │ Financial Enquiry                      │
│ From [00/00/0000]      │ Lorem ipsum dolor sit amet...          │
│ To   [00/00/0000]      │ 🟣 Beth Poultney · 20 Feb 26 · 📎 doc │
│                        │────────────────────────────────────────│
│ Sort by                │ ...                                    │
│ ○ Most recent          │                                        │
│ ○ Pinned notes first   │                                        │
└────────────────────────┴────────────────────────────────────────┘
```

**Decision needed**: The designer's Figma uses a sidebar filter panel. Our mockup (01/02) uses horizontal category pills. Two approaches:
- **Option A**: Sidebar filter panel (matches Figma, more powerful with date range + sort + all tag types)
- **Option B**: Horizontal pills only (matches mockup, simpler, saves horizontal space)
- **Hybrid**: Horizontal pills for quick category filtering + a "More filters" button that opens the sidebar panel

### Note Card Anatomy (Compact — Implemented)

Current implementation matches designer pattern:
```
Category Header (bold, gray-900)                    [edit] [delete] ← hover-only
Content text (gray-700, leading-relaxed)
that may span multiple lines...
👤 Author (font-medium) · Date · 📎 attachment · 👁 Visibility
─────────────────────────────────────────────
```

- **No card borders or backgrounds** — `divide-y divide-gray-100` container
- Category label as bold header above content (not dots — updated per designer)
- Avatar (xs) inline with author name in metadata row
- Attachments inline with paperclip icon in metadata row
- Actions (edit/delete): `opacity-0 group-hover:opacity-100` in header row
- Touch devices: persistent kebab menu instead of hover actions

### Check-In Timeline Card (Implemented)

Check-in cards render inline in the notes timeline:
```
📞 Check-in  [Completed ✓]  [internal]           [View check-in →]
Summary notes text...
Author · Due 28 Feb · Wellbeing: 4/5
─────────────────────────────────────────────
```

- Phone icon + "Check-in" label + status badge (green/blue) + type badge (outline)
- "View check-in" pill button (hover-visible, neutral gray border → teal on hover)
- Content: summary notes for completed, "X attempts logged — awaiting completion" for in-progress
- Expandable attempts for in-progress check-ins
- Sorted into timeline by `completed_at` (completed) or latest attempt date (in-progress)

### Search Bar (from mockup 02-search-active)

```
┌─────────────────────────────────────────────────┐
│ Notes              3 matches        [+ Add Note] │  ← header row
├─────────────────────────────────────────────────┤
│ 🔍 physio                                   [×] │  ← active search (teal border, teal-50/30 bg)
├─────────────────────────────────────────────────┤
│ All Clinical Operational Administrative Comms    │  ← category pills (dimmed when search active)
├─────────────────────────────────────────────────┤
│ ℹ 3 notes match "physio" across full history  ×  │  ← search results info bar (teal-50/40 bg)
├─────────────────────────────────────────────────┤
│ Search results with <mark>highlighted</mark>...  │
└─────────────────────────────────────────────────┘
```

- Search field: `border-teal-700` when active, `bg-teal-50/30`, teal search icon
- Clear button (×) appears when query is active
- Category pills dimmed (`opacity-50`) when search is active — search takes priority
- Results info bar: `bg-teal-50/40 border-teal-100/60` with match count + "Clear search" link
- Match highlighting: `<mark>` with `background: #FEF08A; border-radius: 2px`
- Footer: "Showing all X matches for 'term'" centered, `text-xs text-gray-400`

### Create Note Modal (from Designer's Figma — node 551-4170)

The designer's Figma shows a **rich text editor** replacing the current plain textarea:

```
┌─────────────────────────────────────────────┐
│ Create note                          📌  ×  │
├─────────────────────────────────────────────┤
│ B  I  U  S  • ≡  🔗  📎                    │  ← Tiptap toolbar
├─────────────────────────────────────────────┤
│ Lorem ipsum dolor sit amet...               │
│ • consectetur pulvinar.                     │  ← rich text content
│ • Mauris risus viverra interdum...           │
│ Eu eget vulputate quis urna...              │
│                                             │
│ @Pod P5  @Pod P5  @Emeric Sanderson         │  ← @mentions / tagged users
│ [attachment] [attachment]                    │
├─────────────────────────────────────────────┤
│ Select tags *          Area                 │  ← tag (category) + area dropdowns
│ [Please select ▾]      [Please select ▾]    │
├─────────────────────────────────────────────┤
│ CC visibility [toggle]                      │
│                     [Cancel]  [Save Note]   │
└─────────────────────────────────────────────┘
```

**Tiptap Editor Features:**
- Toolbar: Bold, Italic, Underline, Strikethrough, Bullet list, Ordered list, Link, Attachment
- @mention support for users/teams (existing tagging system)
- Pin toggle (top-right, new sort option: "Pinned notes first")
- Category renamed to "Select tags" with multi-select
- New "Area" dropdown field
- Care Coordinator visibility toggle (existing feature, repositioned)

**Scope decision**: Tiptap rich text editor expanded to **MVP** scope. FR-025–FR-029 added to spec. @mention (FR-026) included — uses existing tagging/notification system.

### Category Filter Bar (from mockup 02)
- Horizontal row of parent group pills: All, Clinical, Operational, Administrative, Communication
- Active pill: `bg-teal-700 text-white`
- Inactive pill: `bg-gray-100 text-gray-600`
- Dimmed to `opacity-50` when keyword search is active (search takes priority)
- "All" selected by default

### Infinite Scroll Loading
- 2–3 pulsing skeleton cards at bottom while loading more notes
- Skeleton matches compact note card shape (text lines + metadata line)

---

## Implementation Status

| Component | Status | Notes |
|-----------|--------|-------|
| Compact note card | DONE | Category header, content, avatar metadata row, hover actions |
| Check-in timeline cards | DONE | Phone icon, status/type badges, expandable attempts, view button |
| Merged timeline (notes + check-ins) | DONE | Sorted by date, `_type` discriminator |
| Backend: `getCheckInTimelineCards()` | DONE | PackageService, behind feature flag |
| Keyword search | NOT STARTED | Server-side search + client-side highlighting |
| Search results info bar | NOT STARTED | Match count, clear search, highlighted terms |
| Category filter pills | NOT STARTED | Parent group pills, server-side filtering |
| Tiptap rich text editor | NOT STARTED | **MVP** — FR-025–FR-029. @mention included (FR-026) |
| Sidebar filter panel | NOT STARTED | Tag type checkboxes, date range, sort — from Figma |
| Touchpoint association | NOT STARTED | Phase 2 |

---

## Clarifications

### Session 2026-02-27 (Design Lens)

- Q: When a note is expanded via "Show more", should action buttons (edit/delete) remain hover-only or become persistent? → A: **Persistent when expanded**. Expanding a note signals interest — surface edit/delete without requiring hover. Collapsed notes keep hover-only actions
- Q: How should search bar and category filter be arranged above the notes list? → A: **Search above, filters below**. Search bar as full-width row 1, category parent pills as row 2, child categories as row 3 (only when parent selected). Clear hierarchy — search is primary, categories secondary
- Q: What loading indicator for infinite scroll (loading more notes at bottom)? → A: **Skeleton note cards** — show 2–3 pulsing skeleton cards matching the compact note card shape. Maintains visual rhythm and hints at incoming content
- Q: Visual separation between compact note cards? → A: **Divider lines only** — no card borders or backgrounds, just a subtle 1px divider between notes. Maximum density, log/feed aesthetic (similar to Slack/GitHub activity). Replaces current `rounded-lg border bg-gray-50 p-4` cards
- Q: Where should the "Add Note" button live? → A: **Right of search bar** — compact button or icon-button inline with the search row. Common pattern (Linear, Notion, Jira) — primary action next to primary filter. Saves a full row of vertical space

### Session 2026-03-05 (Designer Figma Review)

- Designer's Figma (node 551-4210) introduces a **sidebar filter panel** with tag type checkboxes, date range picker, and sort options. This is a more powerful filtering approach than the horizontal pills in our mockup
- Designer's Figma (node 551-4170) introduces a **Tiptap rich text editor** for note creation/editing with toolbar (B/I/U/S/lists/link/attachment), @mentions, and a "pin" toggle. This was previously listed as out of scope in the spec
- The tab is renamed from "Notes" to **"Notebook"** in the designer's Figma — may be a branding decision worth confirming
- **New field: "Area"** dropdown appears in the create note modal alongside "Select tags" — need to clarify what areas map to (package areas? service areas?)
- **Pin toggle** in create note modal + "Pinned notes first" sort option — new feature for important notes

### Open Questions

1. ~~**Tiptap scope**~~ **RESOLVED**: Expanded to MVP. FR-025–FR-029 added. @mention included as FR-026.
2. **Sidebar vs pills**: Use sidebar filter panel (Figma) or horizontal pills (mockup) or hybrid?
3. **Tab name**: Keep "Notes" or rename to "Notebook" per Figma?
4. **Area field**: What does "Area" map to in the data model?
5. **Pin notes**: New feature — pin toggle + sort. Confirm priority and phase

---

## Next Steps

- [ ] Resolve open questions with stakeholders
- [ ] `/trilogy-mockup` — Update mockups to reflect resolved decisions
- [ ] `/trilogy-clarify design` — Refine UX/UI decisions
- [ ] `/trilogy-design-handover` — Gate 2 (Design → Dev)

---

## Figma Cross-Check: Spec vs Design

**Figma**: [Portal Navigation — Notes WIP](https://www.figma.com/design/v16iRY8ciG1xEdFKfm7lGQ/Portal-Navigation?node-id=585-2770)
**Spec**: [spec.md](./spec.md)
**Linear Issue**: [PLA-1402](https://linear.app/trilogycare/issue/PLA-1402)
**Date**: 2026-03-09
**Status**: Initial cross-check
**Transcript**: No

---

### Figma Screen Inventory

| Figma Frame | Node ID | Description |
|-------------|---------|-------------|
| Frame 27659 | 27659-0 | Compact notes list — search bar + note rows with hover actions |
| Frame 27656 | 27656-0 | Full filter panel — categories, touchpoint, type, area, date range, sort |
| Frame 482312 | 482312-0 | Touchpoint type picker — Email, Text, Phone call, Meeting, In-person, Portal |
| WIP — Notes \| Filter expanded | 585-2770 (WIP) | Full portal page with left-side filter panel open |
| WIP — Notes \| Filter collapsed | 585-2770 (WIP) | Full portal page with filter hidden |
| WIP — Create note modal \| No categories | 585-2770 (WIP) | Rich text note creation modal, no tags selected |
| WIP — Create note modal \| Categories | 585-2770 (WIP) | Rich text note creation modal with tags and area |
| WIP — Notes \| In-line editing | 585-2770 (WIP) | Note being edited inline in the list |
| WIP — Note states | 585-2770 (WIP) | Component spec: Default saved, Focus, Edit states with annotations |

---

### Flow Comparison

| # | Figma Screen | Spec Story | Match? |
|---|--------------|------------|--------|
| 1 | Compact notes list (Frame 27659) | US-2: Compact Design | ✅ Aligned |
| 2 | Search bar in Frame 27659 | US-1: Keyword Search | ✅ Aligned |
| 3 | Filter panel (Frame 27656) | US-4: Category Filtering | ⚠️ Partial — Figma is significantly richer |
| 4 | Touchpoint picker (Frame 482312) | US-3: Touchpoint Association | ✅ Aligned |
| 5 | Create note modal (WIP) | FR-025–FR-029 | ✅ Resolved — Tiptap expanded to MVP |
| 6 | Inline editing (WIP) | Not in spec | 🔴 GAP (Figma → Spec) |
| 7 | Note states component (WIP) | FR-011: hover actions | ✅ Aligned |
| 8 | Touchpoint type picker | FR-013–FR-015 | ✅ Aligned |

---

### Detailed Differences

#### ~~GAP (Figma → Spec) — Rich Text Editor in Note Creation~~ ✅ RESOLVED

**Resolution**: Expanded to MVP. Tiptap added as FR-025–FR-029 in spec.

Figma shows a full Tiptap-style rich text editor with:
- Formatting toolbar: Bold, Italic, Underline, Strikethrough, Bullet list, Ordered list, Link, Attachment
- @mention support for users and teams (FR-026 — uses existing notification system)
- Pin toggle (top-right) — deferred to Phase 2 (GAP-US-02)

**@mention** was not explicitly in the original spec — added as FR-026. Tiptap npm deps: `@tiptap/vue-3`, `@tiptap/starter-kit` + extensions for link, list, mention, placeholder.

---

#### GAP (Figma → Spec) — Inline Note Editing

**Severity**: HIGH

Figma shows notes editable **directly in the list** without opening a modal — double-click on a note enters edit mode inline. The current spec and mockups only show edit via a modal overlay.

**Spec says**: No mention of inline editing — FR-011 only covers hover-reveal edit/delete actions.

**PLA-1402 says**: "In-line edit with double-click on last" annotation visible in Figma.

**Recommendation**: Add as GAP-US-01 — inline editing is a significant UX improvement that aligns with the "fast, scannable log" design principle.

---

#### GAP (Figma → Spec) — Pin Notes Feature

**Severity**: MEDIUM

Figma shows:
- Pin toggle (📌) in top-right of note creation modal
- "Pinned notes first" sort option in filter panel

**Spec says**: No mention of pinning. Sort order = most recent first only.

**PLA-1402 says**: Not mentioned.

**Recommendation**: Add as GAP-US-02 — pinning is a lightweight power-user feature. Phase 2 alongside sort controls.

---

#### GAP (Figma → Spec) — "Area" Field on Notes

**Severity**: MEDIUM

Figma create note modal shows an **"Area"** dropdown alongside "Select tags". This is a new field not in the current data model.

**Spec says**: No mention of an "Area" field on notes. Categories/tags are the only classification.

**Open question from design.md**: "What does 'Area' map to in the data model?" — still unresolved.

**Recommendation**: Needs stakeholder clarification before building. Flag as open question.

---

#### CONFLICT — Filter UI: Sidebar Panel vs Horizontal Pills

**Severity**: HIGH

| | Figma Design | HTML Mockup | Spec |
|--|--|--|--|
| Filter UI | Left sidebar panel (persistent, full tag list + date range + sort) | Horizontal category pills (compact, top of list) | FR-019: "row of parent category groups" = pills |

The spec and mockup are aligned (horizontal pills). The Figma designer chose a sidebar panel which is significantly more powerful but changes the layout.

**Recommendation (from design.md)**: Hybrid — horizontal pills for quick P1 filtering + "More filters" button opens sidebar for date range, sort, full tag list. Resolve before dev starts.

---

#### CONFLICT — Tab Renamed "Notebook"

**Severity**: MINOR

Figma labels the tab **"Notebook"** (visible in WIP frames showing the full portal page). Current portal uses **"Notes"**.

**Spec says**: "Notes panel" throughout.

**PLA-1402 says**: "Notes tab" throughout.

**Recommendation**: Confirm with PM/stakeholder. Likely intentional rebranding but needs sign-off.

---

#### CONFLICT — Category Filter Scope: All Flat vs Hierarchical Groups

**Severity**: MEDIUM

| | Figma | Spec |
|--|--|--|
| Category filter structure | **Flat checkbox list** of all individual categories (~40 items) in sidebar | **Parent group pills** (Clinical, Operational etc.) with expandable child categories |

Figma shows all 40 categories as individual checkboxes in the filter panel. Spec (FR-019/FR-020) specifies parent groups with expand-to-child behaviour.

**Recommendation**: Sidebar approach handles flat list better (scrollable checkboxes). The horizontal pills approach needs grouping. If going hybrid, pills = parent groups, sidebar = full flat list. Resolve with filter UI decision above.

---

#### GAP (Figma → Spec) — Date Range Filter

**Severity**: MEDIUM

Figma filter panel includes **From/To date range** pickers. Not in spec at all.

**PLA-1402 says**: "Date range filter (from/to)" listed as "Additional Filters" in Possible Solution.

**Recommendation**: Add as GAP-US-03. Confirmed desired by PO (in Linear issue). Phase 2.

---

#### GAP (Figma → Spec) — Author Filter

**Severity**: LOW

**PLA-1402** lists "Author/created-by filter (searchable select)" under Additional Filters. Not in spec. Not visible in Figma filter panel (but may be omitted from current WIP).

**Recommendation**: Add as GAP-US-04. Phase 2.

---

#### GAP (Spec → Figma) — Search Results Info Bar

**Severity**: LOW

Spec (FR-002) and mockup 02-search-active show a **results info bar** ("3 notes match 'physio' across full history") below the search field. Not visible in Figma Frame 27659 — search field exists but no count bar shown.

**Recommendation**: Keep in spec/mockup — useful UX feedback. Figma may have omitted it. Confirm with designer.

---

#### GAP (Spec → Figma) — Empty States

**Severity**: LOW

Spec and edge cases define explicit empty states:
- "No notes yet" (zero notes)
- "No notes matching '[term]'" (search)
- "No notes matching '[term]' in [category]" (search + filter combined)

Not designed in Figma WIP (no empty state frames visible).

**Recommendation**: Empty states are P1. Developer must implement per spec even without Figma frame.

---

### Summary of Gaps

**Figma has but spec doesn't:**
1. ~~Rich text editor (Tiptap)~~ — **RESOLVED**: expanded to MVP (FR-025–FR-029)
2. Inline note editing (double-click to edit)
3. Pin notes toggle + "Pinned notes first" sort
4. "Area" field on notes
5. Date range filter (From/To)
6. Author/created-by filter

**Spec has but Figma doesn't:**
1. Search results info bar (match count)
2. Empty states (no notes, no search results, combined)
3. Category parent groups with child expansion (Figma uses flat list)

**Conflicting approaches:**
1. Filter UI: Sidebar panel (Figma) vs horizontal pills (spec/mockup)
2. Category structure: Flat checkboxes (Figma) vs grouped pills (spec)
3. Tab label: "Notebook" (Figma) vs "Notes" (spec)

---

### Recommended Actions

1. **Resolve filter UI** — decide sidebar vs pills vs hybrid before dev starts (blocks FR-019–FR-022)
2. ~~**Resolve Tiptap scope**~~ — **RESOLVED**: Expanded to MVP. FR-025–FR-029 added to spec.
3. **Add inline editing** — add GAP-US-01 as Phase 2 story
4. **Add pin notes** — add GAP-US-02 as Phase 2 story
5. **Clarify "Area" field** — get data model answer before adding to spec
6. **Add date range filter** — add GAP-US-03, aligns with PLA-1402
7. **Confirm tab rename** — "Notebook" vs "Notes" — get PM sign-off
8. **Designer to add empty states** — or developer implements per spec without Figma frame
9. **Update Linear doc** — link this Figma to PLA-1402
