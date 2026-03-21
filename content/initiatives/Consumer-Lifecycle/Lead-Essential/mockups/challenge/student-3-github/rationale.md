---
title: "GitHub Gary — Design Rationale"
---

# GitHub Gary — Design Rationale

**Student:** 3 — GitHub Gary
**Paradigm:** GitHub
**Application:** Lead Essential (LES) — CRM for sales agents during phone calls

---

## Why GitHub Patterns for a CRM

GitHub is not a CRM, but it solves an almost identical problem: managing a pipeline of items (issues/PRs) through defined stages (open/review/merged), with multiple stakeholders, audit trails, and the need to process items in bulk. Sales agents managing leads face the same structural challenges as engineering teams managing pull requests:

- **Pipeline visibility** — "How many leads are at each stage?" maps directly to "How many PRs are open vs merged?"
- **Review workflow** — "Has this lead been contacted? What was the outcome?" maps to "Has this PR been reviewed? Approved or changes requested?"
- **Audit trail** — "Who changed this lead's status and when?" maps to "Who approved this PR and when?"
- **Batch processing** — "Assign these 20 leads to the new agent" maps to "Label these 15 issues as sprint-3"

The key insight: GitHub optimises for **developer velocity during context-switching** — the same design problem as a sales agent switching between phone calls. Both users need to rapidly orient themselves ("where am I, what's the state, what do I need to do"), take an action, and move to the next item.

---

## Pattern Mapping

### 1. Filter Bar with Structured Query Language --> Lead List Filtering

**GitHub Pattern:** The text-based filter input with qualifier syntax (`is:open assignee:@me label:bug`) combined with dropdown filter buttons (Label, Milestone, Assignee, Sort) and preset tabs showing counts (234 Open / 1,892 Closed).

**LES Application:**

The leads list view needs filtering by Journey Stage, Lead Status, Assigned Agent, Conversion status, and Created Date (FR-002). GitHub's approach maps directly:

- **Preset tabs with counts** become Journey Stage summary tabs: `Pre-Care (45) | ACAT Booked (12) | Approved (8) | Allocated (3) | Active (2) | Converted (67)`. This gives the team leader instant pipeline visibility — the most critical metric — without any interaction. The counts answer "how's the pipeline?" before anyone clicks anything.

- **Dropdown filter buttons** become: Journey Stage, Lead Status, Assigned Agent, Purchase Intent. Each opens a searchable popover. GitHub's "search within filter" pattern means an agent can find a specific colleague in the Assigned Agent dropdown by typing a name fragment, not scrolling through a list.

- **Full-text search** (FR-004) maps to GitHub's search input. Agents type a name, email, phone, or TC Customer Number and get instant results. The structured query concept could extend to power-user syntax like `status:lost agent:jacqueline stage:pre-care` for saved views — though this is a future enhancement.

**Why it works for phone calls:**
During a call, the agent needs to find a specific lead fast. GitHub's filter bar is keyboard-first — press `/` to focus, type a name, hit Enter. No mouse required. The preset tabs let managers glance at pipeline health between calls without building a report.

**Maps to spec requirements:** FR-002 (filtering), FR-003 (sorting), FR-004 (full-text search), SC-007 (list loads in < 2 seconds).

---

### 2. Sidebar Metadata Panel --> Lead Profile Sidebar

**GitHub Pattern:** The right-aligned sidebar with clickable sections (Reviewers, Assignees, Labels, Projects, Milestone) where each section uses the same interaction: click to open a searchable popover, select, change applies immediately.

**LES Application:**

The lead profile sidebar (FR-007) maps almost one-to-one with GitHub's sidebar:

| GitHub Sidebar Section | LES Sidebar Section | Behaviour |
|------------------------|---------------------|-----------|
| Assignees | Assigned Agent | Click to open searchable staff picker. "Assign yourself" shortcut at top. FR-024. |
| Labels | Purchase Intent | Colour-coded badges: Hot (red/orange), Warm (yellow), Cold (blue/grey). Click to change. |
| Projects (column status) | Journey Stage | Shows current stage as a badge with the 6-stage progress bar. Click to open stage wizard. FR-011. |
| Milestone (with progress bar) | Profile Completion | Progress bar showing percentage. Maps to FR-033. |
| Reviewers (with state icons) | Lead Status | Status badge with colour coding: Not Contacted (grey), Attempted Contact (yellow), Made Contact (green), Lost (red). Click to open status wizard. FR-014. |

**The "click, search, select" pattern** is what makes this sidebar fast enough for phone calls. Changing the assigned agent during a call is three interactions: (1) click "Assigned Agent", (2) type first few letters of colleague's name, (3) click their name. No modal, no save button, no confirmation dialog. The change applies immediately and a timeline entry is recorded (FR-027).

**Sticky sidebar with independent scroll** means the agent always sees the lead's identity, stage, status, and assignment regardless of how far they've scrolled into the Overview or Timeline tabs. This directly supports the design principle "Context without navigation" — key info visible from any tab.

**Empty states with action links** (GitHub's "No one — assign yourself") translate to: "No agent assigned — assign yourself" and "No status set — update status". These turn dead space into calls to action.

**Maps to spec requirements:** FR-007 (sidebar contents), FR-008 (tabs), FR-024 (assignment from sidebar), FR-033 (profile completion indicator).

---

### 3. Mixed Activity Timeline --> Lead Timeline Tab

**GitHub Pattern:** The chronological event stream that interleaves authored content (comments) with system events (label changes, assignments, status transitions), using visual hierarchy to distinguish between them — comments get full cards with avatars, system events get compact single-line entries with muted styling.

**LES Application:**

The lead timeline (FR-021 through FR-023) maps directly to GitHub's timeline:

**Authored Content (comment cards):**
- Agent notes get the full card treatment: avatar, agent name, timestamp, note body, and Markdown support. These are the high-value entries — the equivalent of GitHub comments. They're what the next agent reads when picking up a lead.
- The "Add a comment" input at the bottom of the timeline (GitHub pattern) becomes the "Add Note" panel. Always visible, always ready. One click to start typing. FR-022.

**System Events (compact single-line entries):**
- Status changes: `Jacqueline changed status from Not Contacted to Attempted Contact — 3 hours ago` with a coloured status icon. The before/after values are shown inline (GitHub's "changed title from X to Y" pattern). FR-020.
- Journey Stage transitions: `Jacqueline moved from Pre-Care to ACAT Booked — 2 hours ago` with the stage badge. FR-013.
- Assignment changes: `Jacqueline assigned this to David — 1 hour ago` with the assignee avatar. FR-027.
- Lead creation: `Lead created by Jacqueline via Quick Create — yesterday` as the first timeline entry.

**Visual Hierarchy:**
System events use muted typography (smaller font, grey text) and no card border — they occupy one line each. Agent notes use full card styling with borders and padding. This means a timeline with 50 entries is still scannable: your eye jumps to the 8 note cards (important context) while the 42 system events provide audit context without visual noise.

**Immutability:**
GitHub's timeline entries cannot be deleted (only comments can be edited, and edits show revision history). This maps perfectly to FR-048 — all timeline entries are immutable. Staff can add correction notes as new entries, just as GitHub users add follow-up comments rather than editing old ones.

**Chronological order (oldest first):**
GitHub reads top-to-bottom chronologically. However, the design.md notes that Zoho's oldest-first default was a frustration. For LES, the timeline should default to newest-first (reversing GitHub's convention) with a toggle to switch. The timeline rail pattern (vertical connecting line) works in either direction.

**Maps to spec requirements:** FR-021 (chronological timeline), FR-022 (add notes), FR-023 (entry metadata), FR-048 (immutability), SC-004 (100% audit coverage).

---

### 4. Review Workflow States --> Lead Status Progression

**GitHub Pattern:** The PR review workflow with its layered state model — the PR has a base state (Open/Closed/Merged), reviewers have individual states (Pending/Approved/Changes Requested), and CI checks have their own states (Passing/Failing/Pending). These layers combine into a composite "readiness" signal displayed prominently on the PR page.

**LES Application:**

LES has the same layered state model:

| GitHub Layer | LES Layer | States | Visual Treatment |
|-------------|-----------|--------|-----------------|
| PR State (Open/Merged/Closed) | Journey Stage | Pre-Care through Converted (6 stages) | Horizontal progress bar at page top with coloured segments |
| Review State (Pending/Approved/Changes Requested) | Lead Status | Not Contacted, Attempted Contact, Made Contact, Lost | Colour-coded badge in sidebar with icon |
| CI Checks (Pass/Fail/Pending) | Profile Completion | Percentage with progress bar | Progress bar in sidebar |

**The "merge readiness" pattern** — GitHub shows a green "Ready to merge" or red "Changes requested" banner on PRs — translates to lead conversion readiness. A lead with Journey Stage "Allocated" + Status "Made Contact" + Profile Completion > 80% could display a green "Ready to convert" banner on the profile, while a lead with Status "Lost" shows a red "Lost" banner with the reason.

**Review request pattern** maps to status wizard triggers. On GitHub, clicking "Request review" opens a user picker and sends a notification. On LES, clicking "Update Status" opens the status-specific wizard (FR-015 through FR-018) that captures the required context for each transition:
- "Attempted Contact" wizard requires Contact Method + Contact Outcome — analogous to a reviewer submitting a "Changes Requested" review with required comments.
- "Made Contact" wizard requires Journey Stage + Attribution + Purchase Intent — analogous to an "Approved" review that requires the reviewer to confirm they've checked specific criteria.
- "Lost" wizard requires Lost Type + dynamic Reason — analogous to closing a PR with a required explanation (Close as "not planned" with reason).

**Gated transitions:**
GitHub prevents merging when required reviews are missing or CI checks fail. LES prevents Journey Stage transitions when mandatory fields are incomplete (FR-012). The visual pattern is the same: a disabled "Confirm" button with a checklist showing which requirements are met (green check) and which are missing (grey circle).

**Maps to spec requirements:** FR-011 (Journey Stage), FR-014 through FR-020 (Lead Status workflows), FR-012 (gated transitions), SC-002 (100% valid states).

---

### 5. Batch Operations with Contextual Action Bar --> Bulk Lead Management

**GitHub Pattern:** Checkbox selection on list rows that reveals a sticky batch action bar, replacing the filter bar. The action bar shows the selection count and offers the same actions available on individual items (Label, Assignee, Milestone, Mark as). Each action uses the same searchable popover pattern as single-item editing.

**LES Application:**

The spec requires bulk assign and export for team leaders (FR-005, FR-025, FR-043). GitHub's batch pattern maps directly:

**Selection:**
- Each lead row in the list view gets a left-edge checkbox. A "Select all" checkbox in the table header selects all visible leads (current page, not all pages — preventing accidental bulk operations on thousands of records).
- Shift+Click to select a range of leads (GitHub pattern for selecting contiguous items).

**Contextual Action Bar:**
When any leads are selected, the filter bar transforms into: `12 leads selected | Assign Agent | Export | Deselect All`. This bar is sticky — it stays visible as the team leader scrolls through the list to select more leads.

- **Assign Agent** opens the same searchable staff picker used in the sidebar, but applies the selection to all checked leads. One action to reassign 20 leads when an agent goes on leave.
- **Export** triggers a CSV download with all visible columns (FR-005). The selection count confirms scope: "Export 12 leads as CSV".

**Why GitHub's "same pattern everywhere" matters:**
The searchable popover for assigning an agent is identical whether you're on the profile sidebar (single lead) or the batch action bar (multiple leads). The team leader learns one interaction and uses it in both contexts. This reduces training time and cognitive load — critical when the team leader is also taking calls.

**Keyboard shortcuts layer:**
For power users, GitHub's keyboard shortcuts (`x` to select, `j`/`k` to navigate) could extend to the leads list. During a quiet moment, a team leader could triage leads without touching the mouse: `j` to move down, `x` to select, repeat, then `a` to open assign, type a name, Enter. This is aspirational for LES but the UI structure supports it from day one.

**Maps to spec requirements:** FR-005 (bulk actions: assign + export), FR-025 (bulk assignment), FR-043 (team leader permissions for bulk operations).

---

## Summary: GitHub Patterns Applied to LES

| LES Requirement | GitHub Pattern | Key Benefit |
|----------------|---------------|-------------|
| Lead list filtering (FR-002) | Preset tabs with counts + dropdown filter buttons | Instant pipeline visibility without interaction |
| Lead profile sidebar (FR-007) | Sidebar metadata panel with click-to-edit popovers | 3-click metadata changes during phone calls |
| Timeline & audit trail (FR-021) | Mixed event stream with visual hierarchy | Scannable history — notes stand out, system events provide context |
| Status & stage transitions (FR-014, FR-011) | Layered state model + gated transitions | Composite readiness signals with enforced data quality |
| Bulk operations (FR-005) | Checkbox selection with contextual action bar | Same interaction pattern for individual and batch actions |

**Core GitHub philosophy applied to LES:** Build a system where the status of every item is immediately visible, every change is auditable, and every action can be performed with minimal interaction — whether on one item or a hundred.
