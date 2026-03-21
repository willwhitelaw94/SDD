---
title: "Design Kickoff: Relationship Intelligence"
status: In Progress
created: 2026-02-17
---

# Design Kickoff: Relationship Intelligence

**Epic:** RIN
**Spec:** [spec.md](./spec.md)

---

## Context

### User Research

| Aspect | Answer | Impact on Design |
|--------|--------|------------------|
| Primary Users | Care Partners, Coordinators, anyone client-facing | Design for the common denominator — simple, scannable, no training required |
| Secondary User | Team Leaders | Need compliance oversight view — aggregate, not detail |
| Device Priority | Desktop-first | Can use rich layouts, sidebars, hover states |
| Usage Frequency | Daily — before every client call | Must load fast, be always visible, zero friction |
| Context | Multitasking, time-pressured, often mid-call | Needs to be glanceable in 5 seconds, not something you "open and study" |

### Competitive Research

#### Intercom — Inbox Sidebar

**What they do well:**
- Right sidebar shows customer attributes alongside the conversation — no tab-switching
- Custom attributes (tags, properties) are editable inline — click to update
- Recent conversation snippets give context without opening full history
- "Contact preview" lets you see key info without leaving the inbox list

**What we can learn:**
- Personal context should be **beside** the operational view, not in a separate tab
- Inline editing is critical — if adding context takes more than 2 clicks, staff won't do it

#### HubSpot CRM — Contact Record

**What they do well:**
- **Left sidebar**: "About this contact" card with editable properties, tags, and custom fields
- **Middle panel**: Activity timeline (emails, calls, tasks, meetings) in chronological order with expandable detail
- **Overview tab**: High-level summary of associations, recent activities, key properties
- **Highlights panel**: Top 6-7 fields from compact layout — the "at a glance" summary
- Users can customize which properties appear in their sidebar (personal view)

**What we can learn:**
- The "highlights panel" pattern — 5-7 key fields at the top of every record — is the proven pattern for "know this person in 5 seconds"
- Activity timeline with type filters (calls, emails, tasks) is the standard for interaction history
- Sidebar + timeline in the same view = the gold standard for CRM context

#### Salesforce Lightning — Contact Page

**What they do well:**
- **Compact layout / highlights panel**: First 6-7 fields displayed prominently at the top
- **Activity timeline**: Unified feed of all interactions, filterable, with expandable detail
- Timeline entries show compact layout fields when expanded
- **Related lists**: Associated records (cases, opportunities) displayed below timeline

**What we can learn:**
- Compact layout concept — force yourself to pick the 5-7 most important fields. If you can't, you haven't understood your user well enough
- The timeline is the single most valued feature for conversation prep across all CRM platforms

#### Rex CRM — Contact Record + Talking Points (Primary Reference)

**What they do well:**
- **Right sidebar with "Talking Points"**: Italicised, conversational prompts like *"Coming up to 9 years at Jevons street, how is it all going there?"* — natural language, not data readouts
- **"Reason for call"** at the top of the sidebar — contextual, tells you *why* you're calling before you see anything else
- **Personal Insights as coloured tag pills**: `Kids under 5`, `Married`, `Dog Owner`, `Golf fan`, `Mountain biker` — quick-glance, scannable badges rather than a text list
- **"+ Add another"** on talking points — user can contribute their own conversation starters alongside system-generated ones
- **"Suggestions / Insights" section** (AI-powered, separate from talking points): *"Caroline is interested in golf, consider inviting her to your golf social event"* — contextual nudges based on cross-referencing personal data with business events
- **Three-column layout**: Left sidebar (navigation/filters) | Centre (main content/map) | Right sidebar (search results or contact detail) — proves the pattern works at scale
- **Property sidebar**: Compact summary → expandable sections (Activity Stream, Transaction History) → Personal Insights pills → "Talking points: AI tips" collapsible at bottom
- **Collapsed trigger**: Minimal bookmark-style icon when sidebar is closed (Google Maps pattern) — small footprint when not needed

**What we can learn:**
- **Talking points should read like something a colleague whispers**, not data from a database — italicised, conversational, specific
- **Personal context as tag pills** is more scannable than a list of key-value pairs — coordinators glance at pills in under 2 seconds
- **Separate "user talking points" from "system suggestions"** — let users add their own, keep AI/generated ones in a distinct section
- **"+ Add another"** is critical — coordinators will have insights the system can't generate; make it one click to add
- **Design for the full vision (AI suggestions), ship with the basics (template starters)** — the UI structure should accommodate both from day one
- **Collapsible sections with chevrons** keep the sidebar manageable — show talking points expanded by default, collapse less-used sections

#### Home Care / Aged Care Software (AlayaCare, ShiftCare)

**What they do well:**
- AlayaCare's "Care Card" feature provides at-a-glance client info on mobile for care workers
- ShiftCare stores demographics, preferences, emergency contacts, notes and goals in one profile
- Both emphasise care notes as the handover mechanism between shifts/workers
- Client preferences for how they like tasks done (e.g., "needs chair in shower") are front and centre

**What we can learn:**
- Care industry prioritises **preferences and personal details** over transactional data — this aligns with our "relationship first" principle
- Notes/handover is the core workflow — make it as frictionless as possible
- Mobile access matters even if desktop-first — care partners in the field need a stripped-down version

### Existing Implementation

**Current State:** The package profile (`PackageViewLayout.vue`) uses a tab-based layout with a collapsible right sidebar (`PackageSidebar.vue`).

**Existing tabs:** Overview, Notes, Bills, Incidents, Risks, Tasks, Care Circle, Comms, Documents, Timeline, Needs

**Existing sidebar:** Shows recipient info (avatar, TC ID, MAC ID), care partner, package level, funding streams, MYOB link

**What works well:**
- Tab structure is familiar — users know where things are
- `CommonPanel.vue` is a proven collapsible/resizable panel component
- `CommonDefinitionItem.vue` handles key-value display well
- `CommonProfileCard.vue` exists for profile card patterns
- `PackageTimeline.vue` already exists — potential to extend

**What's missing:**
- No personal context anywhere — no interests, family, preferences
- No "at a glance" snapshot combining personal + operational data
- No touchpoint logging or compliance tracking
- Notes tab exists but is package-level, not relationship-focused
- Sidebar is purely operational (IDs, funding) — no relationship context

**Key components to reuse:**
- `CommonCard`, `CommonPanel`, `CommonDefinitionItem`, `CommonBadge`, `CommonAvatar`
- `CommonNotes` pattern for touchpoint logging
- `PackageTimeline.vue` pattern for interaction history
- `useSidebar` composable for panel state management

---

## Strategy

### Key Architectural Decision: Floating Panels + Tool Strip (V3)

> **V3 change (2026-03-12)**: Evolved from a single docked right-hand sidebar to two floating panels triggered from a tool strip. The split separates the *reference card* (Intelligence — what you need to know about the client) from the *call companion* (Conversation Guide — what you need during the call).

**Decision**: RIN is delivered as **floating panels** triggered from a **tool strip** on the right edge of the package page — not a fixed sidebar.

**Why floating panels, not a fixed sidebar**: V2 prototyping revealed that a fixed third column competes for horizontal space on smaller monitors. Floating panels can be opened, closed, docked, or dragged — giving coordinators control over their workspace. The tool strip is always present (minimal footprint — ~40px), the panels appear on demand.

**Why two panels, not one**: The Conversation Guide and the Intelligence panel serve different moments in the call lifecycle. The Intelligence panel is your *reference card* — open before and after the call to see essentials, alerts, and personal context. The Conversation Guide is your *call companion* — open during the call for openers, prompts, and the checklist. Separating them means neither panel is overloaded, and coordinators can open just what they need.

**Why not a tab**: Same reasoning as before — a tab means navigating *away* from what you're doing. Context should be *alongside* the work, not instead of it.

**Layout**: The package page adds a tool strip and floating panels:
- **Left**: Existing `PackageSidebar.vue` (unchanged)
- **Centre**: Tab content (Overview, Notes, Bills, Incidents, etc.)
- **Right edge**: Tool strip (40px) with panel icons
- **Floating/Docked**: Intelligence panel, Conversation Guide panel, Quick Notes panel — position controlled by the user

**How it works**:

| Aspect | Behaviour |
|--------|-----------|
| **Tool strip** | Always present on the right edge when the feature flag is active. Icons: Intelligence (person), Guide (chat), Notes (document). Intelligence icon shows touchpoint status dot (green/amber/red) |
| **Panel toggle** | Click a strip icon to open/close its panel. Multiple panels can be open simultaneously |
| **Floating** | Panels open near the strip. Draggable by header to any position |
| **Docking** | Drag near the right edge to dock (full height, flush to edge). Two docked panels split height 50/50 |
| **Intelligent positioning** | Panels auto-position to avoid overlapping other open panels |
| **Package-aware** | When the coordinator navigates between packages, panels update to show the current client |
| **Contact type toggle** | Top of Intelligence panel — segmented control: "Client" or "Auth Rep". Changes essentials, guide names, and banner |
| **Independent of left sidebar** | Left sidebar state does not affect panels and vice versa |

**Panel content (V3)**:

| Panel | Sections | When to use |
|-------|----------|-------------|
| **Intelligence** | Contact toggle → Quick Essentials → Operational Context → Personal Context (pills) → Touchpoint (status + log form) | Before/after calls — the reference card |
| **Conversation Guide** | Last Conversation → Opening the Call (carousel) → Personal Touch (event cards) → Getting to Business (transitions + checklist) → Handling Conflict (4-step carousel) | During calls — the call companion |
| **Quick Notes** | Recent notes (read-only) → Note input (text + category) → Save / Log as Touchpoint | During calls — mid-call capture |

**Why this approach works**:
1. **Minimal footprint** — tool strip is ~40px, panels appear on demand
2. **Separation of concerns** — reference card vs call companion vs notes
3. **User control** — float, dock, open, close — coordinators work their way
4. **Always accessible** — tool strip persists across all tabs
5. **Doesn't overload the existing sidebar** — the left sidebar is untouched
6. **Matches proven patterns** — Intercom (sidebar), Rex CRM (talking points panel), Figma (floating panels + tool strip)

**What stays the same**: The existing `PackageSidebar.vue` remains unchanged. The Compliance Dashboard remains a separate full page (not panel content) — it's a caseload-level view, not a per-client view.

---

### Personal Touch: The Client Experience Layer

> **V3 addition (2026-03-12)**: The V2 "Talking Points" concept split into two distinct features: Personal Touch (relationship prompts from the client's life) in the Conversation Guide, and the Call Checklist (operational agenda) also in the Conversation Guide.

**Principle**: Personal Touch prompts are the feature most directly tied to the north star — *does Margaret feel known?* They surface threads from the client's life at the moment they're useful, so nothing falls through the cracks.

#### How Personal Touch Works

```
┌─────────────────────────────────────────────┐
│  PERSONAL TOUCH                              │
│                                              │
│  ☐ "Last time we chatted you mentioned       │  ← From last touchpoint notes
│     Sarah's been bringing the kids over      │     (18 Feb)
│     every Sunday — how's that going?"        │
│                                         ✓ ✕  │
│                                              │
│  ☐ "How are the tomatoes going? I heard      │  ← From last touchpoint notes
│     you've been giving them to the           │     (18 Feb)
│     neighbours!"                             │
│                                         ✓ ✕  │
│                                              │
│  ☐ "Happy birthday for Saturday, Maggie!     │  ← From Important Dates
│     Any plans?"                              │     (15 Mar, 6 days away)
│                                         ✓ ✕  │
│                                              │
│  + Add personal touch                        │  ← Saves to guide AND to
│                                              │     Personal Context (Interests)
└─────────────────────────────────────────────┘
```

#### Prompt Sources (Phase 1 — rule-based)

| Source | Trigger | Example |
|--------|---------|---------|
| **Last touchpoint notes** | Keywords/topics from the most recent touchpoint's notes field | "Last time we chatted you mentioned the grandkids..." |
| **Important Dates** | Date within 7 days | "Happy birthday for Saturday!" |
| **Interests/Family** | Personal context entries (fallback when no recent touchpoint) | "How's the garden going?" |

#### Design Rules

- Maximum **3 prompts** per call — don't overwhelm
- Prompts are **checkable** (dim with strikethrough when covered) and **dismissable** (X removes)
- "+ Add personal touch" saves to the guide AND creates a new Personal Context pill — relationship continuity across the team
- Prompts are **not stored** — computed at view time from touchpoint data and personal context
- Coordinator-added prompts during a call DO persist as Personal Context entries

#### Future Layers

| Layer | Phase | Description |
|-------|-------|-------------|
| **Rule-based prompts** (current) | Phase 1 | Last conversation topics, upcoming dates, interest/family entries |
| **Care-event triggers** | Phase 2 | Incident logged → "I understand you had a fall last week...". Complaint resolved → "I hope we've got that sorted..." |
| **AI-generated phrasing** | Phase 3 | LLM-generated natural language from interaction history and cross-referenced context |

---

### Design Principles

**North Star:** "Margaret feels known every time we call."

> **V3 shift**: The coordinator is the vehicle, not the destination. Every feature should be evaluated against: *does this make the client feel like a person, not a ticket number?*

**Supporting Principles:**
1. **Client experience first** — Personal Touch prompts, Last Conversation context, and sentiment tracking exist because Margaret notices when no one remembers what she told them last time. The coordinator benefits too — but the client is the measure
2. **Zero-friction capture** — If adding context takes more than 15 seconds, staff won't do it. Inline editing, quick-add, tag pills — not CRM forms
3. **Glanceable, not studyable** — Each panel must be understood in 5 seconds. Badges, counts, colour coding. No dense tables
4. **Two panels, two moments** — Intelligence panel before/after calls (reference). Conversation Guide during calls (companion). Don't overload either one
5. **Always accessible, never in the way** — Tool strip persists across tabs. Panels open on demand, close with one click, dock or float

### Emotional Design

**Target Emotion:** Prepared — "I know this person"

The coordinator should feel **confident and human** when they pick up the phone. They know Margaret loves gardening, her grandkids visited last Sunday, the last call went well, and she has a bill on hold that needs sorting. They're not reading off a script — they're continuing a relationship.

**The "Margaret notices" test:** For every feature, ask: *if we don't build this, will Margaret notice?* She notices when no one asks about the grandkids. She notices when her birthday passes without a mention. She notices when she has to repeat herself to a new coordinator. Those are the features that matter most.

**Frustration Risks:**
- Panels feel like "more admin work" rather than a helpful tool
- Too many fields to fill in — feels like a CRM form, not a quick note
- Multiple open panels compete for screen real estate
- Compliance view feels punitive rather than supportive
- Sentiment logging feels like an extra step after every call

### Build Size Assessment

**Size:** Medium-Large

**Rationale:**
- Two floating panels + Quick Notes panel + tool strip
- New draggable/dockable panel component (does not exist in current library)
- Integrates into existing `PackageViewLayout.vue` (does not modify `PackageSidebar.vue`)
- Reuses existing components (CommonCard, CommonPanel, CommonNotes, useSidebar composable)
- New entity types: Personal Context Entry, Touchpoint (with duration, activity, sentiment)
- Conversation Guide with carousel, mad-libs, Personal Touch prompts, scenario awareness
- Compliance dashboard page
- Support at Home activity categories alignment

**Effort Estimate:** ~4-5 sprints design + dev

---

## Constraints

### Accessibility Requirements

**WCAG Target:** Level AA

**Specific Requirements:**
- [x] Keyboard navigation — coordinators often tab through forms while on calls
- [x] Screen reader support — labels on all badge counts and colour indicators
- [x] Colour contrast — traffic light badges (amber/red/green) must meet AA contrast ratios
- [ ] High contrast mode — not required for MVP

### Security & Privacy

**Sensitive Data:**
- [x] Personal information (client interests, family details, preferences)
- [x] Health-adjacent information (care context, wellbeing notes)
- [ ] Financial data (bills displayed as counts only, not amounts)

**Visibility Rules:**
- Coordinators see Relationship Intelligence only for clients they have access to (existing permissions)
- Personal context is visible to all coordinators with access — not private to the capturing coordinator
- Team Leaders see compliance aggregates, not individual conversation notes

**Privacy Considerations:**
- Personal context is about the client, captured by staff — clients do not see this view (Phase 1)
- Staff should be guided on appropriate content (interests and preferences, not gossip or judgments)
- Data retention follows existing client record lifecycle

### Stakeholder Constraints

**Constraints:**
- Must integrate with existing package profile — not a separate "Relationship Intelligence" section that requires navigation
- Must not disrupt existing workflows — existing tabs and sidebar remain unchanged
- Regulatory: Monthly touchpoint must be auditable (timestamp + coordinator identity)

**Approvers:**
- [ ] Romy Blacklaw (PO)
- [ ] Patrick Hawker (HOD)

### Dependencies

**Depends On:**
- Existing bills data (count of bills on hold) — already available via package API
- Existing complaints data (active complaint count) — needs verification
- Existing incidents data (recent incident count) — already on PackageIncidents tab
- Existing care plan status — already on PackageOverview

**Blocks:**
- Care plan integration (Phase 2 — surfacing relationship context in care reviews)
- Client mobile portal (Phase 2 — if clients ever see their relationship data)

---

## Planning

### Edge Case Inventory

| Edge Case | How to Handle | Priority |
|-----------|---------------|----------|
| No personal context recorded | Encouraging empty state with quick-add button | P1 |
| Client deceased/exited | Relationship Intelligence becomes read-only, touchpoint tracking stops | P1 |
| Coordinator reassigned | All context transfers with client, not coordinator | P1 |
| Back-dated touchpoint | Allow back-dating with date picker, log original entry date in audit | P1 |
| Two coordinators log same-day touchpoint | Both recorded, monthly compliance treats any as meeting requirement | P2 |
| Edit window expired (24hr) | Touchpoint becomes read-only for coordinator, Team Leader can still edit | P2 |
| Client has multiple packages | Relationship Intelligence is client-level, shared across packages | P2 |
| Very long personal context entries | Truncate with expand/collapse, limit display to top 3-5 on snapshot | P2 |
| No personal context for starters | Show nudge: "Add personal context to unlock conversation starters" | P1 |
| Personal context entry too long for template | Truncate at ~60 chars in starter text, use full content in tooltip | P2 |
| Mobile/narrow screen | Stack snapshot sections vertically, hide conversation starters | P3 |

### Performance Considerations

**Page Frequency:** High — loaded on every client profile view

**Data Considerations:**
- Personal context: Typically < 20 entries per client (no pagination needed)
- Touchpoints: Could grow to 50+ per year — paginate after 20
- Interaction timeline: Aggregates from multiple sources — may need lazy loading
- Operational counts (bills, complaints, incidents): Should be pre-computed, not queried on every view

**Real-time:** Not required for MVP. Touchpoint compliance view can refresh on page load.

### Analytics & Success Metrics

**Events to Track:**
- `relationship_context_added` — Personal context entry created (with category)
- `relationship_context_viewed` — Sidebar panel loaded
- `touchpoint_logged` — Touchpoint recorded (with type)
- `compliance_view_opened` — Team Leader opens compliance dashboard
- `talking_point_shown` — Talking point displayed on sidebar (with source: `template` / `user` / `rule` / `ai`)
- `talking_point_added` — User added a custom talking point via "+ Add a talking point"
- `talking_point_dismissed` — User dismissed a generated talking point
- `suggestion_converted` — User converted a suggestion into a talking point (Phase 2+)
- `personal_context_pill_added` — New tag pill added to personal context

**Dashboard Metrics:**
- % of active clients with personal context captured (target: 70% in 3 months)
- Average personal context entries per client
- Monthly touchpoint compliance rate per organisation
- Touchpoint logging frequency by coordinator
- Talking points engagement rate (shown vs interacted with)
- User-contributed talking points per coordinator (adoption signal)

### Phased Rollout

**Phase 1 (MVP):**
- Tool strip on right edge of package page with panel toggle icons
- **Intelligence panel**: Quick Essentials (preferred name, language, best time, timezone, caution flags, info notes — all inline-editable), Operational Context (bills, complaints, management plan, check-in overdue — clickable to tabs), Personal Context (tag pills: Interests, Family, Dates, Notes — add/remove), Touchpoint section (status indicator + Log Touchpoint form with duration, primary activity, sentiment)
- **Conversation Guide panel**: Last Conversation card (from most recent touchpoint), Opening the Call (carousel with mad-lib blanks), Personal Touch (up to 3 event-driven prompts — checkable, dismissable, addable with sync to Personal Context), Getting to Business (transition carousel + Call Checklist — checkable operational items), Handling Conflict (4-step carousel, collapsed by default)
- **Quick Notes panel**: Recent notes, note input with category dropdown, Save, Log as Touchpoint
- Contact type toggle (Client / Auth Rep) — full context swap on Intelligence panel, name swap + banner on Guide panel
- Panel dragging, docking, intelligent positioning
- Touchpoint compliance view (separate page, calendar month model)
- Feature flags per organisation

**Phase 2:**
- Care-event-triggered prompts (incident → "I heard you had a fall...", complaint resolved → "I hope we've got that sorted...")
- Meaningful vs Operational contact classification
- Interaction history timeline (aggregated from all sources)
- Sentiment aggregation + pattern detection (Team Leader view)
- Personal context pinning to Package Sidebar tooltip
- Coordinator adoption metrics dashboard
- Mobile-optimised panel overlays

**Phase 3:**
- AI-generated conversation phrasing (LLM from interaction history and notes)
- Automated touchpoint detection (phone system integration)
- Care plan integration
- Client self-service preferences
- Follow-through accountability (did we actually ask about the grandkids?)
- Relationship continuity scoring (how many coordinators has the client spoken to?)

**Feature Flags** (Laravel Pennant + PostHog, per organisation):

| Flag | What It Controls | Phase |
|------|-----------------|-------|
| `relationship-intelligence` | Entire RIN tool strip + panels — master switch | Phase 1 |
| `rin-conversation-guide` | Conversation Guide panel (can be toggled independently) | Phase 1 |
| `rin-quick-notes` | Quick Notes panel | Phase 1 |
| `rin-care-event-prompts` | Care-event-triggered Personal Touch prompts | Phase 2 |
| `rin-ai-insights` | AI-powered conversation phrasing | Phase 3 |

Each flag is **additive and independent** — turning off `rin-conversation-guide` hides the guide panel but the Intelligence panel still works. Turning off `rin-quick-notes` hides the notes panel. The master switch controls everything.

---

## Validation

### Risks & Assumptions

**Assumptions:**
- Coordinators will capture personal context if the form is fast and inline (< 15 seconds)
- The snapshot panel won't feel like "more work" if it's always visible and useful
- Clients are comfortable with staff recording personal preferences (privacy risk managed by guidelines)
- Existing operational data (bills, complaints, incidents) is accessible for count aggregation

**Risks:**

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Staff see it as "more admin" and don't capture context | Medium | High | Make it 2-click quick-add, show value immediately via prompts |
| Personal context entries are low quality or inappropriate | Medium | Medium | Guided categories, placeholder examples, team leader review |
| Compliance view feels punitive | Low | Medium | Frame as "who needs a call" not "who's behind" |
| Snapshot slows down page load | Low | High | Pre-compute counts, lazy load timeline, cache personal context |

### User Testing Plan

**Approach:** Prototype testing with 3-5 coordinators during pilot

**Participants:**
- 2-3 Care Partners / Coordinators (daily users)
- 1 Team Leader (compliance view)

**Questions to Answer:**
1. Can coordinators add personal context in under 15 seconds?
2. Does the snapshot feel useful or overwhelming?
3. Is the touchpoint logging flow natural (post-call)?
4. Does the compliance view help or stress Team Leaders?

**Timeline:** Pilot with one organisation before broader rollout

---

## Design Clarification Log

| # | Question | Decision | Rationale |
|---|----------|----------|-----------|
| 1 | Default panel state on page load? | **Closed — tool strip only** | Coordinator clicks to open. Tool strip shows touchpoint status dot for at-a-glance awareness. First impression isn't overwhelming. |
| 2 | Who sees user-contributed Personal Touch and context? | **All coordinators** (shared, client-level) | Supports handover — when Levi is away, the next coordinator sees everything he captured. Relationship continuity across the team. |
| 3 | How do panels handle narrow screens (<1280px)? | **Slide-over overlay from right edge** | Below breakpoint, panels become overlays on top of content rather than competing for layout space. |
| 4 | Which component pattern for panels? | **New floating panel component** | Draggable, dockable panels — can dock to right edge or float freely. Built on existing patterns (CommonPanel, useSidebar). |
| 5 | Tag pill style for personal context? | **Uniform style, grouped by category heading** | Keep pills visually consistent. Group under category headings (Interests, Family, Dates, Notes). |
| 6 | First-run onboarding? | **No onboarding — just open** | Sections are self-explanatory. Empty states provide instructional context where needed. |
| 7 | How do quick notes relate to the existing Notes tab? | **One data source, two views** | Quick Notes panel shows recent entries from Notes tab + input. Saves go to the Notes tab. No separate notes system. |
| 8 | Where does the contact-type toggle live? | **Top of Intelligence panel** | Segmented control: "Margaret (Client)" / "John (Auth Rep)". Changes essentials, guide names, and banner. |
| 9 | What does the tool strip icon show? | **Touchpoint status dot** | Green (contacted), amber (due soon), red (overdue). At-a-glance: "do I need to call this person?" |
| 10 | ~~Section order configuration~~ | **Removed in V3** | V3 has fixed section order within each panel. The two-panel split makes section reordering unnecessary — each panel has a clear purpose and flow. |
| 11 | Auth rep + Conversation Guide? | **Guide stays open** | The call is still about the client. Opening phrases swap names. Banner shows who you're calling and who the conversation is about. Personal Touch and checklist remain. |
| 12 | How many Personal Touch prompts? | **Maximum 3** | Don't overwhelm. Sources: last conversation topics, upcoming dates, interests/family entries. |
| 13 | Where does the Call Checklist live? | **Inside Conversation Guide panel** | Under "Getting to Business" alongside transition phrases. Not a standalone "Talking Points" section. |

### New Component Required: Floating Panel

RIN requires a new **floating panel component** that doesn't exist in the current component library:

| Aspect | Behaviour |
|--------|-----------|
| **Trigger** | Tool strip icon on right edge of page. Click to toggle panel open/closed |
| **Default position** | Opens near the tool strip, auto-positioned to avoid overlapping other open panels |
| **Panel width** | ~300-320px |
| **Docking** | Drag near the right edge → dock indicator appears → drop to dock (full height, flush to edge). Two docked panels split height 50/50 |
| **Floating** | Drag anywhere else → panel floats freely at that position |
| **Narrow screen (<1280px)** | Becomes a slide-over overlay on top of content (drawer from right) |
| **Multiple panels** | Up to 3 panels can be open simultaneously. Auto-stacking with intelligent positioning |
| **Independent** | Left sidebar (PackageSidebar) collapse state doesn't affect panels and vice versa |
| **Build approach** | New component, reusing `useSidebar` composable for state management |

### Existing Components to Reuse

| Component | Usage in RIN |
|-----------|-------------|
| `CommonCollapsible` | Collapsible sections within panels (Personal Context, Touchpoint, Handling Conflict) |
| `CommonTagGroup` | Personal context tag pills |
| `CommonBadge` | Touchpoint status badge, operational count badges, "Care mgmt" badge |
| `CommonEmptyPlaceholder` | Empty state when no personal context or no touchpoints |
| `CommonInput` | "+ Add" inline text inputs for pills, notes, personal touch |
| `CommonAvatar` | Auth rep card avatar |
| `CommonDefinitionItem` | Quick Essentials key-value display |
| `CommonConfirmDialog` | Confirm before removing a personal context entry |
| `CommonTooltip` | Truncated text, pill details, section heading hover help |
| `CommonNotes` | Quick Notes panel — recent entries display + free-text input |
| `CommonSegmentedControl` | Contact type toggle (Client / Auth Rep) |
| New: `CommonCarousel` | Conversation Guide openers, transition phrases, conflict steps |
| New: `MadLibBlank` | Clickable underlined words that cycle through alternatives |
| New: `SentimentPicker` | Three emoji buttons (Happy/Neutral/Concerned) for touchpoint logging |

---

## Ready for Mockups

- [x] User research complete
- [x] Design principles defined
- [x] Competitive research done
- [x] Edge cases identified
- [x] Constraints documented
- [x] Existing implementation audited
- [x] Design clarification complete (5 decisions logged)
- [ ] Stakeholder alignment (pending pilot approval)

**Next Step:** `/hod-hmw` → `/trilogy-flow` → `/trilogy-mockup`

---

## V2 Prototype Learnings (2026-03-09)

> **Source**: User research sessions with care coordinators + interactive prototype testing (`sidebar-playground.html` v2). These learnings refine — not replace — the design decisions above. The original design direction (persistent sidebar, personal context, touchpoint tracking) is validated. V2 adds specificity based on what we learned from people actually on the phones.

### Research Context

Sat down with one of TC's longest-serving care coordinators — ~8 months in, ~30 calls a day. Key quotes and observations:

1. **"We don't necessarily get personal anymore. We literally just go straight to the information we need and drop them. It's kind of sad."** — There's a tension between call volume and genuine connection. The system needs to make connection effortless, not additional work.

2. **Newer coordinators pick up large caseloads quickly** — they don't have time to build depth of knowledge before calls start. The system must give them a leg up that experienced coordinators have built through months of repetition.

3. **A significant portion of calls go to authorised representatives**, not the client directly. The current system doesn't help distinguish who you're calling or what context to bring.

### What Changed

| Design Decision (Original) | V2 Refinement | Rationale |
|----------------------------|---------------|-----------|
| **Content order**: Contact toggle → alerts → talking points → personal context → notes → touchpoint | **V2 order**: Quick Essentials → Operational Context (alerts) → Personal Context (interests, family, dates — open by default) → Conversation Guide (open → steer → conflict) → Talking Points (operational agenda) → Touchpoint Status | Research showed essentials (name, language, caution) must be first — the coordinator needs practical info before personal context. Conversation guide and operational agenda are distinct from each other |
| **Talking Points**: Template-based conversation starters from personal context, layered (templates → rules → AI) | **Conversation Guide** (3-phase structured guide) + **Operational Agenda** (separate talking points) | Talking points were trying to do two jobs: relationship starters AND operational reminders. V2 splits them. The Conversation Guide handles the call arc; Talking Points become an operational checklist |
| **Contact type toggle**: Segmented control at top | **Auth Rep switching**: First-class context swap — essentials, conversation starters, and visible sections all change when switching to rep | More impactful than originally scoped. Not just a toggle — the entire panel context adapts. Conversation starters hide for rep calls because you don't small-talk a representative |
| **Collapsible sections**: All sections collapsible with configurable order | **V2**: Personal Context sections (Interests, Family, Dates) shown **open by default**. Handling Conflict collapsed by default. Preferences section removed | Research: coordinators need context visible immediately, not hidden behind clicks. Preferences were redundant with Quick Essentials |
| **Identity verification**: Listed as a possible section | **Removed** | Outbound calls only — identity verification is an inbound concern |
| **Personal context categories**: Interests, Family, Dates, Preferences, Notes | **V2**: Interests & Hobbies, Family & Household, Important Dates, General Notes | Communication Preferences merged into Quick Essentials (preferred name, call time, contact method). Cleaner separation between "who they are" and "how to reach them" |

### New Concepts Introduced in V2

#### Quick Essentials ("Know Before Calling")

A compact card at the very top of the panel — visible before anything else. Contains:
- **Preferred name** (e.g., "Call them 'Maggie'")
- **Language** (e.g., "English")
- **Caution flags** (e.g., "⚠ Hard of hearing — speak clearly and slowly")

All fields inline-editable (click to edit, Enter to save). This ensures the coordinator's first 5 seconds are informed.

#### Conversation Guide (3 Phases)

Replaces the single "Talking Points" concept with a structured call arc:

1. **Opening the call** — Carousel of 2-3 cards. First card is always a generic professional opener. Subsequent cards are personalised openers drawn from personal context. Cards contain clickable blanks (mad-lib style) that cycle through alternative suggestions.

2. **Steering to business** — Carousel of 2-3 transition phrases. Natural ways to pivot from personal chat to the operational reason for the call.

3. **Handling Conflict** — Collapsed by default. 4-step carousel: **Acknowledge** → **Empathise** → **Solve** → **Buy breathing room**. Each step has 2-3 clickable variants. Gives coordinators a framework for difficult conversations.

#### Operational Agenda (Talking Points)

The "Talking Points" section is repurposed as an operational call checklist:
1. Bills & holds — "2 bills on hold since [date]"
2. Active complaint follow-up
3. Management plan check-in
4. Overdue touchpoint check-in
5. Personal small talk (always last — relationship comes after business items are covered)

Each item is clickable to navigate to the relevant tab.

### What Stayed the Same

- **Persistent sidebar across all tabs** — validated, coordinators loved it
- **Personal context as tag pills** — validated, scannable and quick
- **Touchpoint logging and compliance tracking** — unchanged
- **Draggable/dockable panel** — validated as valuable for power users
- **Quick Notes panel** — unchanged
- **Feature flag per organisation** — unchanged
- **Three-layer architecture** (templates → rules → AI) — still valid, V2 just clarifies what each layer looks like

### Components to Update (from original design)

| Original Component | V3 Update Needed |
|-------------------|-----------------|
| ~~`RelationshipSidebar.vue`~~ | **Replaced** by tool strip + floating panels. No single sidebar component |
| New: `RinToolStrip.vue` | Vertical icon bar on right edge — toggles Intelligence, Guide, Notes panels |
| New: `RinFloatingPanel.vue` | Draggable, dockable panel shell — shared by all three panels |
| New: `IntelligencePanel.vue` | Quick Essentials, Operational Context, Personal Context pills, Touchpoint section |
| New: `ConversationGuidePanel.vue` | Last Conversation, Opening carousel, Personal Touch, Getting to Business, Conflict |
| New: `QuickNotesPanel.vue` | Recent notes, note input with category, Save/Log as Touchpoint |
| New: `CommonCarousel.vue` | Carousel with dots, left/right nav, smooth slide transitions |
| New: `MadLibBlank.vue` | Clickable underlined words that cycle through alternatives |
| New: `SentimentPicker.vue` | Three emoji buttons for touchpoint sentiment |
| New: `PersonalTouchCard.vue` | Event-driven prompt card — checkable, dismissable, with source attribution |
| Contact type toggle | Full context swap on Intelligence panel + name swap + banner on Guide panel |
| Personal Context | Remove Preferences category. Categories: Interests, Family, Dates, Notes. Add/remove pills |
| Touchpoint form | Add duration, primary activity (5 Support at Home categories), sentiment |

### Prototype Reference

The interactive prototype is at `mockups/sidebar-playground.html` — open locally in a browser. It demonstrates all V3 concepts including:
- Two-panel split (Intelligence + Conversation Guide)
- Tool strip with status dot
- Quick Essentials with inline editing and live timezone clock
- Auth rep switching with full context swap + guide name swap + banner
- Last Conversation card from most recent touchpoint
- Personal Touch event-driven prompts (checkable, dismissable, addable with sync)
- Opening carousel with mad-lib blanks
- Getting to Business (transition carousel + Call Checklist)
- Handling Conflict 4-step carousel
- Touchpoint logging with duration, activity, sentiment, and "Care mgmt" badge
- Quick Notes panel with category tagging
- Scenario switcher (Happy path, Frustrated client, New client)
- Draggable/dockable/intelligent panel positioning
- Call Bridge (future state, toggled separately)

### Revertibility

V3 is a significant structural evolution. The original V1/V2 design is preserved in git history. Key reversion points:
- **Two-panel split → single sidebar**: Merge Guide content back into Intelligence panel
- **Personal Touch**: Remove section, revert to "Talking Points" template starters
- **Last Conversation card**: Remove section
- **Touchpoint enhancements**: Remove duration, activity, sentiment fields — revert to date/type/notes
- **Quick Notes panel**: Remove panel, revert to sidebar notes mirroring
- **Auth Rep guide visible**: Revert to hiding conversation starters for rep calls

---

## Playground Cross-Check: Spec vs Design (V3)

**Playground**: [sidebar-playground.html](./mockups/sidebar-playground.html)
**Spec**: [spec.md](./spec.md)
**V3 Thinking**: [v3-thinking.md](./v3-thinking.md)
**Date**: 2026-03-12
**Status**: Initial cross-check
**Source**: Interactive HTML playground (v3 mode), Loom walkthrough script v3

---

### Playground Screen Inventory

| Screen / State | Description |
|----------------|-------------|
| V3 Happy Path — Client | Default scenario. Regular check-in, positive last call, standard operational items |
| V3 Happy Path — Auth Rep | Same as above, contact switched to John Wilson (auth rep) |
| V3 Frustrated Client — Client | Complaint follow-up. Negative last call, conflict framework open by default |
| V3 Frustrated Client — Auth Rep | Frustrated scenario with auth rep contact |
| V3 New Client — Client | Post-onboarding follow-up. First call, onboarding-focused checklist |
| V3 New Client — Auth Rep | New client scenario with auth rep contact |
| V3 — No Personal Context | Toggle off personal context pills. Empty states visible |
| V3 — No Alerts | Toggle off alerts. Empty operational context |
| V3 — Touchpoint: Due Soon | Amber touchpoint status indicator |
| V3 — Touchpoint: Overdue | Red touchpoint status indicator |
| V1 Original | Legacy single-panel layout with section reordering |
| V2 Research-Informed | Single panel with conversation guide merged in |

---

### Story-by-Story Comparison

#### US1 — Capture Personal Context About a Client (P1)

| Acceptance Criteria | Spec Says | Playground Shows | Status |
|---------------------|-----------|------------------|--------|
| AC1: Structured form with categories | Interests & Hobbies, Family & Household, Important Dates, ~~Communication Preferences~~, General Notes | Interests, Family, Important Dates, Preferences (pills with "Prefers morning calls") — no General Notes visible | **GAP** — Playground still shows "Preferences" group (spec removed it in V2). General Notes category not visible as pills |
| AC2: Add entry, save, visible to others | "+ Add" button per group, inline input, save | Implemented — each pill group has "+ Add", inline input with Save/Cancel, toast confirmation | **MATCH** |
| AC3: Grouped by category, most recent first | Entries grouped by category | Grouped by category as pill groups. No "most recent first" ordering visible (pills are static) | **MINOR** — ordering not demonstrable in a static prototype |
| AC4: Edit existing entry with "Last updated" | Edit with timestamp | Pills have hover "x" to remove but no edit-in-place. No "Last updated" timestamp visible on entries | **GAP** — No edit flow for existing pills, no timestamp |
| AC5: Onboarding prompt | Prompted during onboarding | Not demonstrated in playground | **N/A** — out of scope for a package-page prototype |

**FR alignment:**
- FR-001 categories: Playground shows "Preferences" which spec removed. Missing "General Notes".
- FR-002 stored fields: Not visible in UI prototype (backend concern).
- FR-003 add/edit/remove/pin: Add and remove work. Edit and pin are **missing** from playground.
- FR-003a pinning to Package Sidebar: **Not shown** — no pin toggle on pills, no sidebar tooltip.
- FR-005 client-level not package-level: Not demonstrable in prototype.

---

#### US2 — Quick Essentials and Client Snapshot (P1)

| Acceptance Criteria | Spec Says | Playground Shows | Status |
|---------------------|-----------|------------------|--------|
| AC1: Quick Essentials at top (preferred name, language, caution flags) | Preferred name, language, caution flags | Preferred name ("Maggie"), Language, Best time, Timezone with live clock, "Know before calling" (caution flag), Note (info flag) — all inline-editable | **EXCEEDS** — Playground adds Best Time, Timezone (live clock), and a separate Info note beyond spec |
| AC2: Operational badges with colour coding, clickable | Count badges, colour-coded, clickable to detail | Amber "2 Bills on hold", Red "1 Active complaint", Amber "1 Management plan due", Red "1 Check-in overdue" — each clickable to portal tab | **EXCEEDS** — Playground adds management plan and check-in overdue items beyond spec's "bills, complaints, incidents" |
| AC3: Empty state for no personal context | "No personal context yet — add some to build rapport" + quick-add | Shows when toggling off personal context: "No personal context yet — add some to build rapport" with "+ Quick Add" | **MATCH** |
| AC4: Amber warning at 25 days | Amber when approaching 30-day threshold | Touchpoint control allows switching between Contacted (green), Due soon (amber), Overdue (red). Amber shows "Due soon — 22 days since last contact" | **MATCH** |
| AC5: Auth rep switching — essentials swap, conversation starters hidden | Essentials swap to rep details, personal starters hidden, "Calling about [Client]" label | Full context swap: rep card with avatar/name/role, fields swap, "Calling about: Maggie" shown, guide panel shows auth rep banner. Conversation starters remain but swap names (not hidden) | **CONFLICT** — Spec says "personal conversation starters are hidden" for auth rep. Playground keeps the Conversation Guide open with name swapped and shows a "Calling John Wilson (auth rep)" banner. Personal Touch cards remain visible. Loom script confirms this is intentional: "the guide doesn't disappear... but the openers swap" |
| AC6: Switch back restores client view | Full restoration | Works — toggle back restores all client content | **MATCH** |
| AC7: Mobile/narrow responsive stacking | Sections stack vertically | Not demonstrated in fixed-width prototype | **N/A** |

**FR alignment:**
- FR-021 Quick Essentials: **Exceeds** — adds Best Time, Timezone (live clock), Info note.
- FR-021a inline editing: Fully implemented — click to edit, Enter to save, Escape to cancel, pencil on hover.
- FR-021b caution flag visual: Amber warning icon + highlight for "Know before calling". Blue info icon for Note.
- FR-022 contact toggle: Segmented control at top of panel. Works.
- FR-022a rep essentials: Shows rep card with avatar, name, role badge ("Son"), and all fields.
- FR-022b personal starters hidden in rep mode: **CONFLICT** — playground keeps them visible with name swap. Design decision from Loom: guide stays open for rep calls because the call is still about the client.
- FR-022c switch back restores: Works.

---

#### US3 — Log a Touchpoint (P1)

| Acceptance Criteria | Spec Says | Playground Shows | Status |
|---------------------|-----------|------------------|--------|
| AC1: Log Touchpoint form — date, type, notes | Date (default today), Type (Phone/Visit/Video/Email), Notes, Save button | Date, Type, **Duration (minutes)**, **Primary Activity** (5 categories), Notes, **Sentiment (Happy/Neutral/Concerned)**, Save/Cancel | **EXCEEDS** — V3 adds Duration, Primary Activity (Support at Home aligned), and Sentiment. These are from v3-thinking.md, not yet in spec |
| AC2: Last Touchpoint date updates immediately | Immediate update on save | Save updates touchpoint text to "Your last contact: Today", dot turns green, detailed toast with duration + activity + sentiment | **MATCH** |
| AC3: Notes visible in interaction history | Other coordinators see entry with date, type, author, notes | Not demonstrated in playground (no interaction history view) | **N/A** |
| AC4: Monthly reset | Resets at start of each month | Not demonstrable in prototype | **N/A** |

**New fields in playground not in spec (from v3-thinking.md):**
- **Duration** — numeric input (1-240 min), triggers "Care mgmt" badge at >=15 min
- **Primary Activity** — select with 5 Support at Home categories: Monitoring & Review, Care Planning, Organising & Adjusting Services, Navigating Options, Supporting Feedback & Complaints
- **Sentiment** — 3 emoji buttons: Happy/Neutral/Concerned (optional, one-tap)
- **Care management revenue signal** — informational badge when duration >=15 min

---

#### US4 — Touchpoint Compliance Dashboard (P2)

| Aspect | Spec Says | Playground Shows | Status |
|--------|-----------|------------------|--------|
| Caseload compliance view | Full-page dashboard with sortable columns | **Not present** — playground focuses on per-client panel, not caseload view | **GAP (expected)** — compliance dashboard is a separate page, not sidebar content |

---

#### US5 — Interaction History Timeline (P2)

| Aspect | Spec Says | Playground Shows | Status |
|--------|-----------|------------------|--------|
| Chronological timeline | Timeline of all interactions grouped by month | **Not present** — deferred to Phase 2 per tasks.md | **GAP (expected)** |

---

#### US6 — Conversation Guide (P2)

| Acceptance Criteria | Spec Says | Playground Shows | Status |
|---------------------|-----------|------------------|--------|
| AC1: Three phases — Open, Steer, Conflict | Three phases in order, Conflict collapsed by default | V3 splits this into a **separate panel** ("Conversation Guide"). Contains: Last Conversation, Opening the Call, Personal Touch, Getting to Business (transition + checklist), Handling Conflict. Conflict collapsed by default (except in Frustrated scenario) | **EXCEEDS** — Playground adds "Last Conversation" context card, "Personal Touch" section, and scenario-awareness not in spec |
| AC2: Opening carousel with generic + personal openers | 2-3 cards, first is generic, rest from personal context | 3-card carousel. Adapts per scenario (happy/frustrated/new client). Clickable blanks cycle through alternatives | **EXCEEDS** — scenario-specific openers go beyond spec |
| AC3: Clickable blanks (mad-libs) | Click underlined word, cycles through 2-3 suggestions | Implemented — dashed teal underline, click cycles, pop animation | **MATCH** |
| AC4: Steering to business carousel | 2-3 transition phrases | 3-card carousel with scenario-specific transitions | **MATCH** |
| AC5: Handling Conflict — 4-step carousel | Acknowledge → Empathise → Solve → Buy breathing room, each with 2-3 variants | 4-step carousel with colour-coded step labels (red/amber/green/blue), cyclable phrases per step | **MATCH** |
| AC6: No personal context — generic opener + nudge | Show nudge "Add personal context to unlock personalised openers" | Demonstrated when personal context is toggled off — blue info box nudge | **MATCH** |

**New in playground not in spec:**
- **Last Conversation card** — shows who called, when, duration, sentiment, type, notes from previous touchpoint. Critical for call prep (spec has no equivalent)
- **Personal Touch section** — event-driven prompts: family mentions from last call, upcoming birthday, interest-based icebreakers. Checkable and dismissable. Can add new ones mid-call (syncs to Personal Context pills). This is the "care-event-triggered prompts" concept from v3-thinking.md
- **Scenario flexibility** — the entire guide adapts content based on scenario (happy path, frustrated client, new client). Spec doesn't address scenario-driven content
- **Call Checklist** — replaces "Talking Points" as an operational checklist integrated into the guide panel. Items are scenario-specific

---

#### US6b — Operational Call Agenda (P2)

| Acceptance Criteria | Spec Says | Playground Shows | Status |
|---------------------|-----------|------------------|--------|
| AC1: Up to 5 operational items | Bills/holds, complaint, management plan, overdue touchpoint, personal small talk | Implemented as "Call Checklist" inside the Conversation Guide panel. 5 items per scenario, checkable, with source attribution | **MATCH** (but relocated from "Talking Points" section to inside the guide panel) |
| AC2: Clickable to navigate to tab | Each item navigable | V2 operational context rows are clickable to tabs. V3 checklist items have source tags but navigation is in the separate Operational Context section | **PARTIAL** — navigation is split across two locations |
| AC3: Only personal small talk when no items | Shows only personal item | Demonstrated when alerts are toggled off | **MATCH** |
| AC4: Check off items | Visually marked as addressed | Checkbox interaction: teal fill, text strikethrough, 0.45 opacity | **MATCH** |

---

#### US7 — Feature Flag (P3)

| Aspect | Spec Says | Playground Shows | Status |
|--------|-----------|------------------|--------|
| Per-organisation toggle | Feature flag controls visibility | Not applicable to a standalone prototype | **N/A** |

---

### Summary of Gaps

#### Spec has but playground doesn't:

1. **Personal context editing** (FR-003) — pills can be added and removed, but not edited in-place
2. **"Last updated" timestamps** on personal context entries (AC1.4)
3. **Pinning personal context** to Package Sidebar tooltip (FR-003a) — no pin toggle, no sidebar integration
4. **General Notes** category for personal context (FR-001)
5. **Touchpoint compliance dashboard** (US4) — expected gap, separate page
6. **Interaction history timeline** (US5) — expected gap, Phase 2
7. **Onboarding prompt** for initial context capture (AC1.5) — not applicable to prototype
8. **24-hour edit window** for touchpoints (FR-011) — not demonstrated
9. **Mobile/responsive layout** (AC2.7) — not demonstrated
10. **Personal conversation starters hidden for auth rep** (FR-022b) — playground intentionally keeps them visible

#### Playground has but spec doesn't:

1. **Two-panel split** — Relationship Intelligence + Conversation Guide as separate panels (v3 structural change)
2. **Last Conversation card** — previous call summary with caller, duration, sentiment, notes
3. **Personal Touch section** — care-event-triggered prompts (from v3-thinking.md Section 6). Checkable, dismissable, addable mid-call with sync to Personal Context
4. **Touchpoint Duration** field — numeric minutes input
5. **Touchpoint Primary Activity** — 5 Support at Home categories (from v3-thinking.md Section 5)
6. **Touchpoint Sentiment** indicator — Happy/Neutral/Concerned emoji buttons (from v3-thinking.md Section 3)
7. **Care management revenue signal** — "Care mgmt" badge when duration >=15 min (from v3-thinking.md Section 5)
8. **Scenario-aware content** — guide adapts all content per scenario (happy path, frustrated, new client)
9. **Quick Notes panel** — separate floating panel with category tagging and "Log as Touchpoint" button
10. **Call Bridge panel** (Future state) — telephony integration with live transcript and auto-generated notes
11. **Best Time** and **Timezone (live clock)** in Quick Essentials
12. **Info note** field in Quick Essentials (separate from caution flag)
13. **Management plan due** and **Check-in overdue** as operational context items (spec only mentions bills, complaints, incidents)
14. **Drag-to-reorder sections** within panels
15. **Multi-panel positioning** — intelligent stacking, docking, floating behaviour

#### Conflicting:

1. **Auth rep + conversation starters** — Spec (FR-022b): "personal conversation starters MUST be hidden" for rep calls. Playground: keeps guide open with name swap. Loom script explicitly states this is intentional: "the guide doesn't disappear... the call is still about Maggie"
2. **Talking Points location** — Spec (FR-024): standalone "Talking Points" section. Playground V3: merged into Conversation Guide panel as "Call Checklist"
3. **"Preferences" category** — Spec (FR-001 V2): removed Communication Preferences. Playground still shows a "Preferences" pill group with "Prefers morning calls"

#### Intentionally different (design evolution):

1. **Two panels vs one** — V3 design decision to separate reference (Intelligence) from guidance (Conversation Guide). Not a gap — a deliberate evolution from spec's single-panel model
2. **Last Conversation card** — addresses coordinator's #1 pre-call need: "what happened last time?" Not in spec because it emerged from v3 prototype iteration
3. **Scenario flexibility** — the spec defines static acceptance criteria. The playground demonstrates that content should adapt to the call context. This is a design innovation that spec should absorb
4. **Touchpoint enhancements** (duration, activity, sentiment) — from v3-thinking.md, aligned to Support at Home care management billing. Not yet spec'd because v3-thinking.md is explicitly "thinking, not a plan"

---

### Recommended Actions

1. **Update spec FR-022b** — Resolve the auth rep conflict. The playground's approach (guide stays open, names swap) is more practical than hiding starters entirely. Recommendation: update spec to match playground behaviour, with a note that Personal Touch cards are contextual (about the client) and remain relevant even when calling the rep
2. **Add v3 touchpoint fields to spec** — Duration, Primary Activity, and Sentiment should be spec'd as optional fields on US3. They align with Support at Home billing and the v3 client-experience lens
3. **Add "Last Conversation" card to spec** — This is a major usability feature. Needs a new acceptance criterion on US2 or a new user story
4. **Add "Personal Touch" to spec** — Either as an enhancement to US6 (Conversation Guide) or as care-event-triggered prompts (v3-thinking.md Section 6). Spec the checkable/dismissable/addable behaviour and the sync to Personal Context
5. **Resolve "Preferences" category** — Either remove the Preferences pill group from the playground to match spec, or reinstate it in spec with a different name (it currently duplicates Quick Essentials fields)
6. **Add scenario-awareness to spec** — The guide's ability to adapt content per call context (happy, frustrated, new client) is a significant feature. Needs at least an edge case or acceptance criterion
7. **Spec the two-panel split** — If v3's two-panel approach is the direction, update the design strategy section and relevant FRs to reference two panels instead of one sidebar
8. **Spec Quick Notes panel** — The playground demonstrates a standalone Quick Notes panel with category tagging. This extends beyond the existing Notes tab mirroring described in design.md
9. **Defer Call Bridge** — Already marked "Future" in playground. Confirm it stays out of scope
10. **Add personal context edit flow** — Playground only supports add/remove. Spec requires edit. Either add edit-in-place to the playground or simplify the spec to add/remove only (with remove + re-add as the edit pattern)

---

## Gate 2: Design Handover

**Date**: 2026-03-12
**Status**: PASS

### Checklist Results

#### Design Kickoff Completeness

- [x] User research complete — primary user, device, usage pattern defined
- [x] Design principles defined — north star + 5 supporting principles
- [x] Edge cases identified — 11 edge cases with handling and priority
- [x] Constraints documented — accessibility, security, stakeholder, dependencies
- [x] Build size assessed — Medium-Large, ~4-5 sprints

#### Design-Spec Alignment

- [x] User stories covered — all 8 stories have design decisions
- [x] Success metrics defined — SC-001 through SC-010
- [x] Phased rollout planned — 3 phases, feature flags per phase

#### Stakeholder Alignment

- [x] Stakeholder constraints noted — Romy Blacklaw (PO), Patrick Hawker (HOD)
- [x] Risks documented — 4 risks with mitigation
- [x] Dependencies identified — blocking/blocked features listed

#### Mockups / Prototypes

- [x] Interactive prototype — `sidebar-playground.html` (V3, 3 scenarios, auth rep, all panels)
- [x] Loom walkthrough script — `loom-walkthrough-script-v3.md`
- [x] Spec-design cross-check — performed and gaps resolved

---

### Design Handover Summary

**Initiative**: RIN — Relationship Intelligence
**Date**: 2026-03-12
**Design Owner**: Ed
**Receiving Developer**: TBD

---

#### What We're Building

A **Relationship Intelligence** system delivered as two floating panels plus a tool strip on the package page. The Intelligence panel is the reference card (essentials, alerts, personal context, touchpoints). The Conversation Guide is the call companion (last conversation, openers, personal touch prompts, checklist, conflict framework). A Quick Notes panel adds mid-call capture. North star: "Margaret feels known every time we call."

#### Key Screens

1. **Tool Strip** — vertical icon bar on right edge (40px). Icons: Intelligence, Guide, Notes. Intelligence icon has touchpoint status dot (green/amber/red)
   - Location: `mockups/sidebar-playground.html` (V3 mode)
   - Key interactions: click to toggle panels, status dot updates from touchpoint data

2. **Intelligence Panel** — reference card
   - Sections: Contact toggle (Client/Auth Rep) → Quick Essentials → Operational Context → Personal Context (pills) → Touchpoint (status + log form)
   - Key interactions: inline-edit essentials, add/remove pills, log touchpoint with duration/activity/sentiment

3. **Conversation Guide Panel** — call companion
   - Sections: Last Conversation → Opening the Call (carousel) → Personal Touch (event cards) → Getting to Business (transitions + checklist) → Handling Conflict (collapsed)
   - Key interactions: carousel navigation, mad-lib blank cycling, check/dismiss personal touch, add personal touch (syncs to pills), check off checklist items

4. **Quick Notes Panel** — mid-call capture
   - Sections: Recent notes (read-only) → note input + category dropdown → Save / Log as Touchpoint
   - Key interactions: type note, select category, save or save+log-touchpoint

5. **Touchpoint Compliance View** — separate page (not panel content)
   - Caseload-level: client name, last touchpoint, days since, status (Contacted/Due/Overdue)
   - Key interactions: sort by urgency, filter by coordinator (Team Leader view)

#### Component Decisions

**Reusing Existing:**
- `CommonCollapsible` — collapsible sections within panels
- `CommonTagGroup` — personal context tag pills
- `CommonBadge` — status badges, count badges, "Care mgmt" badge
- `CommonEmptyPlaceholder` — empty states
- `CommonInput` — inline text inputs
- `CommonAvatar` — auth rep card
- `CommonDefinitionItem` — Quick Essentials key-value
- `CommonConfirmDialog` — confirm pill removal
- `CommonNotes` — Quick Notes recent entries + input
- `CommonSegmentedControl` — Client/Auth Rep toggle
- `useSidebar` composable — panel state management

**New Components Needed:**
- `RinToolStrip.vue` — vertical icon bar on right edge
- `RinFloatingPanel.vue` — draggable, dockable panel shell (shared by all panels)
- `IntelligencePanel.vue` — reference card content
- `ConversationGuidePanel.vue` — call companion content
- `QuickNotesPanel.vue` — notes panel content
- `CommonCarousel.vue` — carousel with dots + nav (openers, transitions, conflict)
- `MadLibBlank.vue` — clickable underlined word cycling
- `SentimentPicker.vue` — three emoji buttons (Happy/Neutral/Concerned)
- `PersonalTouchCard.vue` — event-driven prompt card (checkable, dismissable, source tag)

#### Critical UX Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Two panels vs one sidebar | Two floating panels + tool strip | Separate reference (before/after call) from companion (during call). Neither overloaded |
| Auth rep + Conversation Guide | Guide stays open, names swap, blue banner | Call is still about the client. Personal Touch and checklist remain relevant |
| Personal context editing | Add/remove only (no edit-in-place) | Remove + re-add as the edit pattern. Simplifies Phase 1 |
| Sentiment on touchpoints | Optional, one-tap emoji buttons | First quality signal. No default = no friction. "How did it go?" proxy |
| Personal Touch prompts | Max 3, computed at view time | Rule-based Phase 1 (last convo, dates, interests). Not stored. Don't overwhelm |
| Conflict framework | Collapsed by default | Open by default only in "frustrated client" scenario |
| Panel default state | Closed (tool strip only) | Coordinator clicks to open. Not overwhelming on first impression |

#### Data Requirements

| Screen | Data Needed | Source |
|--------|-------------|--------|
| Quick Essentials | Preferred name, language, best time, timezone, caution flags, info notes | Client/Package model (new fields on client) |
| Operational Context | Bills on hold count, active complaints count, management plan due date, check-in overdue days | Existing bills, complaints, care plan models (query at render) |
| Personal Context | Entries with category, content, created_by, timestamps | New `PersonalContextEntry` model (client-level) |
| Last Conversation | Most recent touchpoint: coordinator, date, duration, sentiment, activity, notes | New `Touchpoint` model |
| Personal Touch | Prompts from last touchpoint notes, upcoming dates, interest entries | Computed from `Touchpoint` + `PersonalContextEntry` |
| Call Checklist | Operational items from bills, complaints, management plan, check-in | Same as Operational Context + computed |
| Touchpoint Log | Date, type, duration, activity, notes, sentiment | New `Touchpoint` model |
| Compliance View | All clients in caseload with last touchpoint date and status | `Touchpoint` aggregated per client |

#### Open Questions for Development

- [x] Where do Quick Essentials fields live? → **New `rin_essentials` table** with polymorphic `essentiable` relationship (client-level, keyed by field name)
- [ ] How to compute Personal Touch prompts from touchpoint notes? Keyword extraction? Full note display? AI-assisted in Phase 2?
- [x] Floating panel component — build from scratch or extend `CommonPanel`? → **Built from scratch as `RinFloatingPanel.vue`** using `useDraggable` from VueUse. Supports dock/undock, drag with snap-back, position persistence via `useStorage`, and stacked offset positioning
- [ ] Touchpoint compliance view — new Inertia page or extend existing dashboard?
- [x] How does the carousel component work with keyboard accessibility? → **Uses existing `CommonCarousel` (embla-carousel-vue)** with arrow button navigation
- [x] Mad-lib blank cycling — how many alternatives per blank? → **Hardcoded per blank**, typically 3-4 alternatives. Implemented as `MadLibBlank.vue` component that cycles on click
- [ ] Support at Home activity categories — are the 5 categories final or subject to change?

#### Out of Scope (Deferred)

- Call Bridge / telephony integration (future state)
- AI-generated conversation phrasing (Phase 3)
- Care-event-triggered prompts from incidents/complaints (Phase 2)
- Meaningful vs Operational contact classification (Phase 2)
- Sentiment aggregation / Team Leader pattern detection (Phase 2)
- Personal context pinning to Package Sidebar tooltip (Phase 2)
- Automated touchpoint detection from phone system (Phase 2)
- Mobile-optimised panel overlays (Phase 2)
- Coordinator adoption metrics dashboard (Phase 2)
- Interaction history timeline (Phase 2)

---

### Implementation Progress (as of 2026-03-20)

**Branch:** `RIN` ([GitHub](https://github.com/Trilogy-Care/tc-portal/tree/RIN))
**Feature Flag:** `relationship-intelligence` (PostHog via Pennant)

#### Completed Components

| Component | Path | Status |
|-----------|------|--------|
| `RinToolStrip` | `Components/RelationshipIntelligence/RinToolStrip.vue` | Done — 3 icons, status dot, draft indicator dot (warning-600) |
| `RinFloatingPanel` | `Components/RelationshipIntelligence/Panel/RinFloatingPanel.vue` | Done — draggable, dockable, snap-to-dock, position persistence, `headerExtra` slot |
| `IntelligencePanel` | `Components/RelationshipIntelligence/Intelligence/IntelligencePanel.vue` | Done — Contact toggle, Quick Essentials, Operational Context, Personal Context pills, Touchpoint section |
| `ConversationGuidePanel` | `Components/RelationshipIntelligence/ConversationGuide/ConversationGuidePanel.vue` | Done — Last Conversation, Opening carousel with MadLibBlanks, Personal Touch cards, Business section with checklist, Conflict framework |
| Quick Notes panel | Reuses `CreateNotePanel` in `PackageViewLayout.vue` | Done — integrated existing notes system into RIN floating panel |
| `CommonSegmentedControl` | `Components/Common/CommonSegmentedControl.vue` | Done — generic Client/Auth Rep toggle |
| `MadLibBlank` | `Components/Common/MadLibBlank.vue` | Done — click-to-cycle underlined text |
| `useRinPanels` | `composables/useRinPanels.ts` | Done — panel open/close state with localStorage persistence |
| `useNoteDraft` | `Components/Notes/composables/useNoteDraft.ts` | Done — localStorage draft persistence, HTML-stripped `hasDraft` check |
| Backend: `GetRinData` | `domain/RelationshipIntelligence/Actions/GetRinData.php` | Done — aggregates essentials, context, touchpoints, operational alerts |

#### Key Implementation Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Panel shell | Custom `RinFloatingPanel` with VueUse `useDraggable` | No existing panel component supported dock/undock + drag + snap. VueUse provides robust drag primitives |
| Quick Notes | Reuse existing `CreateNotePanel` + `useCreateNotePanel` composable | Existing notes system already handles categories, mentions, attachments, org/child switches. Wrapped in `RinFloatingPanel` shell |
| Draft persistence | `useNoteDraft` composable with `useStorage` (localStorage) | Draft survives tab switches and page reloads. Key: `note-draft:{modelType}:{modelId}` |
| Navigation guard | `router.on('before')` with `openConfirmDialog` | Warns when leaving package with unsaved draft. Scoped to package — intra-package tab navigation allowed |
| Category dropdown | `portal` prop on `CommonSelectMenu` | Required to escape panel's `overflow-hidden`. Dropdown renders via `ComboboxPortal` to `<body>` |
| Panel shadow | `shadow-[-6px_0_20px_rgba(0,0,0,0.10)]` | Subtly darker than default to visually separate panel from page content |
| Draft indicator | Warning-600 dot on tool strip icon + "Draft" badge in panel header | Visible feedback that unsaved content exists without being intrusive |

#### Resolved UX Refinements

- **Draft indicator**: Amber dot (`bg-warning-600`) on Notes tool strip icon when draft exists and panel is closed. "Draft" badge with dot in panel header via `headerExtra` slot
- **Navigation guard copy**: "Note draft in progress" / "Your draft will be saved and waiting when you come back." / "Leave page" / "Continue editing" (applied HoD UX Writing skill)
- **Save button validation**: Disabled state until both content and category are present (`canSave` computed). Removed imperative validation
- **Category error clearing**: Watcher on `selectedCategories` clears validation errors when user selects a category
- **Empty editor detection**: TipTap returns `<p></p>` for empty editor — strip HTML tags before checking `hasDraft`

---

### Sign-Off

| Role | Name | Date | Status |
|------|------|------|--------|
| Designer/Product | Ed | 2026-03-12 | [x] Approved |
| Lead Developer | | | [ ] Approved |
| Stakeholder (PO) | Romy Blacklaw | | [ ] Approved |

### Confirmation

By signing off, we confirm:
- [x] Design is complete enough to begin technical planning
- [x] All major UX decisions are finalized
- [x] Open questions are documented (not blocking)
- [x] Scope boundaries are understood

### Next Steps

- [x] Run `/speckit-plan` to create technical implementation plan
- [x] Developer to review design artifacts and prototype
- [x] Build floating panel component (resolved — `RinFloatingPanel.vue`)
- [ ] Wire up backend API for real data (currently mock data for Intelligence + Conversation Guide)
- [ ] Connect `rin_essentials` CRUD to Quick Essentials inline editing
- [ ] Connect `personal_context_entries` CRUD to Personal Context pills
- [ ] Connect `touchpoints` CRUD to Touchpoint section
- [ ] Implement Touchpoint compliance view (separate page)
- [ ] Phase 2: AI-assisted Personal Touch prompts, care-event triggers, sentiment aggregation
