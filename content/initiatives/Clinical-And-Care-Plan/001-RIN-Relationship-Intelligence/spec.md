---
title: "Feature Specification: Relationship Intelligence"
description: "Clinical And Care Plan > Relationship Intelligence"
---

> **[View Mockup](/mockups/001-rin-relationship-intelligence/index.html)**{.mockup-link}

# Feature Specification: Relationship Intelligence

**Epic**: RIN — Relationship Intelligence
**Created**: 2026-02-17
**Status**: V3
**North Star**: "Margaret feels known every time we call."
**Input**: Voice-of-customer description emphasising rapport-building, personal context capture, unified client view, regulatory monthly touchpoints, and complaint reduction through relationship-first interactions

---

## Architecture Overview

RIN is delivered as **two floating panels** plus a **tool strip** on the right edge of the package page:

1. **Relationship Intelligence Panel** — the reference card. Quick Essentials, operational alerts, personal context pills, and touchpoint logging. Open before and after calls.
2. **Conversation Guide Panel** — the call companion. Last conversation context, opening phrases, personal touch prompts, business transition + call checklist, and conflict framework. Open during calls.
3. **Quick Notes Panel** — mid-call note capture with category tagging.
4. **Tool Strip** — vertical icon bar on the right edge. Each icon toggles its panel. The Intelligence icon shows a touchpoint status dot (green/amber/red).

All panels are draggable, dockable to the right edge, and position intelligently to avoid overlap. They persist across all package tabs.

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Capture Personal Context About a Client (Priority: P1)

As a **Coordinator**, I want to record personal details about a client — their interests, family members, pets, sports teams, and important dates — so that I (or any colleague) can build genuine rapport in future conversations rather than relying on memory alone.

**Why this priority**: Without captured personal context, nothing else in Relationship Intelligence works. This is the foundational data layer. Currently coordinators rely entirely on memory — when a coordinator is absent or a client is reassigned, all relationship context is lost.

**Independent Test**: Can be tested by opening a client's profile, navigating to the Relationship Intelligence panel, adding personal context entries (e.g., "Supports the Swans", "Grandkids visit every Sunday", "Loves gardening"), saving, and verifying the entries persist and are visible to other coordinators.

**Acceptance Scenarios**:

1. **Given** a Coordinator opens the Relationship Intelligence panel, **When** the Personal Context section loads, **Then** they see entries displayed as tag pills grouped by category: Interests & Hobbies, Family & Household, Important Dates, and General Notes

2. **Given** a Coordinator clicks "+ Add" on a category group, **When** an inline input appears and they type and save, **Then** a new pill is added to that group, visible to all coordinators with access to that client

3. **Given** a Coordinator adds multiple entries across different categories, **When** they view the Personal Context section, **Then** entries are grouped by category with the most recently updated entries shown first

4. **Given** a Coordinator hovers over an existing pill and clicks the remove (x) button, **When** they confirm, **Then** the pill is removed with an animation

5. **Given** a client is newly onboarded, **When** the Coordinator completes the onboarding workflow, **Then** they are prompted to capture initial personal context as part of the onboarding steps — this prompt is skippable

---

### User Story 2 — Quick Essentials and Client Snapshot (Priority: P1)

> **V3 change (2026-03-12)**: Quick Essentials expanded to include Best Time, Timezone (live clock), and a separate Info note field. Operational context expanded beyond bills/complaints/incidents to include management plan due and check-in overdue items. Auth rep behaviour updated — Conversation Guide stays open with name swap instead of hiding.

As a **Coordinator**, I want to see a single unified view of everything relevant about a client — starting with quick essentials (preferred name, language, best time, timezone, caution flags), then operational alerts and personal context — and I want the panel to adapt when I'm calling an authorised representative instead of the client directly — so that I can prepare for any call in under a minute.

**Why this priority**: This is the core value proposition. Coordinators currently toggle between 4-5 screens to understand a client's full picture. The Intelligence panel eliminates this friction and ensures every interaction starts with full context.

**Independent Test**: Can be tested by opening a client with known data (a bill on hold, one complaint, personal context entries, and an authorised representative) and verifying all information appears in the Intelligence panel, and that switching to the auth rep view swaps the essentials and adapts the Conversation Guide.

**Acceptance Scenarios**:

1. **Given** a Coordinator opens a client's profile, **When** the Relationship Intelligence panel loads, **Then** they see **Quick Essentials** at the top: preferred name (e.g., "Call them 'Maggie'"), language, best time to call, timezone with live clock, and any caution flags (e.g., "Hard of hearing — speak clearly and slowly") and info notes (e.g., "Prefers phone calls") — all inline-editable (click to edit, Enter to save, Escape to cancel)

2. **Given** a client has 2 bills on hold, 1 active complaint, 1 management plan due in 5 days, and 1 overdue check-in, **When** the Operational Context section renders, **Then** each item displays as a clickable row with colour-coded badge (amber for bills/management plan, red for complaints/overdue) and clicking navigates to the relevant tab

3. **Given** a client has no personal context recorded, **When** the snapshot renders, **Then** the personal context section shows an encouraging empty state: "No personal context yet — add some to build rapport" with a quick-add button

4. **Given** a client's last touchpoint was 22 days ago (approaching the 30-day regulatory threshold), **When** the touchpoint indicator renders, **Then** it shows an amber "Due soon" status with days-since count

5. **Given** the client has an authorised representative, **When** the Coordinator switches to the auth rep view via the contact toggle, **Then** the Quick Essentials swap to show the rep's details (avatar, name, role, preferred name, best time, timezone, contact preferences) with a "Calling about [Client Name]" label. The Conversation Guide panel remains open with opening phrases swapping the contact name (e.g., "Morning John" instead of "Morning Maggie") and a blue banner showing "Calling [Rep Name] (auth rep) — conversation is about [Client Name]". Personal Touch and Call Checklist remain visible as they relate to the client.

6. **Given** the Coordinator is in auth rep view, **When** they switch back to the client view, **Then** all client essentials, personal context, and conversation starters are restored

7. **Given** a Coordinator views the panel on a mobile or narrow screen, **When** the layout adjusts, **Then** panels become slide-over overlays from the right edge

---

### User Story 3 — Log a Touchpoint With Duration, Activity and Sentiment (Priority: P1)

> **V3 change (2026-03-12)**: Touchpoint form expanded with duration, primary activity (Support at Home aligned), and optional sentiment indicator. Duration >=15 min triggers a "Care mgmt" informational badge.

As a **Coordinator**, I want to log that I've spoken with a client — capturing the date, type, duration, primary activity, notes, and optionally how the call went — so that the monthly regulatory touchpoint is recorded, the next person to call has full context, and we can track contact quality alongside frequency.

**Why this priority**: Trilogy Care has a regulatory requirement for monthly direct care management touchpoints. Duration and activity type align with Support at Home care management billing categories. Sentiment is the first signal of relationship quality — "did we call?" is necessary, "how did it go?" is the real question.

**Independent Test**: Can be tested by logging a touchpoint for a client with duration, activity, notes and sentiment, verifying the touchpoint date updates, the Last Conversation card on the Conversation Guide shows the new entry, and the monthly tracker resets.

**Acceptance Scenarios**:

1. **Given** a Coordinator clicks "Log Touchpoint" on the Intelligence panel, **When** the form opens, **Then** it shows: date (default today, back-dating allowed), type (Phone Call, In-Person Visit, Video Call, Email), duration (minutes, numeric 1-240), primary activity (select: Monitoring & Review, Care Planning, Organising & Adjusting Services, Navigating Options, Supporting Feedback & Complaints), notes (free text), and sentiment (optional: Happy / Neutral / Concerned as emoji buttons)

2. **Given** the duration is 15 minutes or more, **When** the form renders, **Then** a green "Care mgmt" badge appears next to the duration indicating potential billable care management activity. Given under 15 minutes, a neutral "< 15 min" badge appears

3. **Given** a Coordinator saves a touchpoint, **When** the save completes, **Then** the Intelligence panel's touchpoint indicator updates to "Last contact: Today" with a green status dot, and the Conversation Guide's Last Conversation card updates to show the new entry

4. **Given** a Coordinator logs a touchpoint with notes and sentiment, **When** another Coordinator opens the Conversation Guide for this client, **Then** the Last Conversation card shows: coordinator name, date, duration, sentiment emoji + label, activity type, and abbreviated notes

5. **Given** it is a new calendar month and no touchpoint has been logged, **When** the Coordinator views the Intelligence panel, **Then** the monthly touchpoint indicator resets to "Not contacted this month" and begins counting days since last contact

---

### User Story 4 — Track Monthly Touchpoint Compliance Across Caseload (Priority: P2)

As a **Coordinator** or **Team Leader**, I want to see which clients in my caseload have not been contacted this month — so that I can prioritise outreach and ensure no client falls through the cracks on the regulatory monthly touchpoint requirement.

**Why this priority**: Individual touchpoint logging (Story 3) captures data; this story surfaces compliance gaps across the full caseload. Without it, coordinators must check each client individually to know who still needs contact.

**Independent Test**: Can be tested by having a caseload of 10 clients where 3 have not been contacted this month, and verifying the compliance dashboard shows those 3 as overdue with sortable urgency.

**Acceptance Scenarios**:

1. **Given** a Coordinator views their caseload, **When** they open the touchpoint compliance view, **Then** they see a list of all their assigned clients with columns: Client Name, Last Touchpoint Date, Days Since Contact, and Status (Contacted / Due / Overdue)

2. **Given** 5 of 20 clients have not been contacted this month, **When** the compliance view loads, **Then** those 5 clients appear at the top sorted by "days since last contact" (most overdue first) with a red "Overdue" badge

3. **Given** a client was contacted 29 days ago, **When** the compliance view renders, **Then** the client shows as "Due" with an amber indicator — distinguishing "approaching deadline" from "already overdue"

4. **Given** a Team Leader views the compliance view, **When** they filter by coordinator, **Then** they can see each coordinator's compliance rate (e.g., "Romy: 18/20 contacted") and identify which coordinators need support

5. **Given** a Coordinator logs a touchpoint for an overdue client, **When** the compliance view refreshes, **Then** the client moves from "Overdue" to "Contacted" immediately

---

### User Story 5 — View Interaction History Timeline (Priority: P2)

As a **Coordinator**, I want to see a chronological timeline of all interactions with a client — touchpoints, complaints, incidents, and notes — so that I can understand the full relationship history without searching multiple systems.

**Why this priority**: The Intelligence panel (Story 2) shows the current state; the timeline shows the journey. Before a care review or escalation, coordinators need to understand what has happened over time. This also provides the audit trail for regulatory compliance.

**Independent Test**: Can be tested by viewing a client with 3 touchpoints, 1 complaint, and 1 incident logged over the past 3 months, and verifying all events appear in chronological order on a single timeline.

**Acceptance Scenarios**:

1. **Given** a Coordinator opens the interaction history for a client, **When** the timeline loads, **Then** they see a chronological list of all interactions: touchpoints (with sentiment and activity type), complaints, incidents, and significant care plan changes — each with date, type icon, author, and summary

2. **Given** the timeline has entries spanning 6 months, **When** the Coordinator scrolls, **Then** entries are grouped by month with a month header and the most recent entries appear first

3. **Given** the Coordinator wants to see only touchpoints, **When** they filter by interaction type, **Then** only touchpoint entries are shown — other types are hidden but not removed

4. **Given** a touchpoint entry includes conversation notes, **When** the Coordinator clicks to expand it, **Then** the full notes, duration, activity type, and sentiment are displayed inline without navigating away

---

### User Story 6 — Conversation Guide With Last Conversation and Personal Touch (Priority: P1)

> **V3 change (2026-03-12)**: Conversation Guide is now a **separate floating panel** (not a section within the Intelligence panel). Added Last Conversation card, Personal Touch section with care-event-triggered prompts, and scenario-aware content adaptation. Operational agenda relocated into the guide as "Call Checklist". Priority elevated from P2 to P1 — the guide and the Intelligence panel are the two halves of the core experience.

As a **Coordinator**, I want a conversation guide in a separate panel that gives me context from the last call, personal touch prompts drawn from the client's life, structured call phases (opening, transition, conflict), and an operational checklist — all adapting to the call situation — so that every call feels natural, nothing falls through the cracks, and the client feels known.

**Why this priority**: Research showed coordinators struggle with three moments: opening personally, transitioning to business, and de-escalating conflict. V3 adds two features that shift the lens toward client experience: Personal Touch (threads from previous conversations that make the client feel remembered) and Last Conversation context (so the coordinator isn't going in blind).

**Independent Test**: Can be tested by opening the Conversation Guide for a client with personal context and recent touchpoints, verifying it shows Last Conversation, Opening carousel, Personal Touch cards, Getting to Business (transition + checklist), and Handling Conflict — and that content adapts when switching scenarios.

**Acceptance Scenarios**:

1. **Given** a Coordinator opens the Conversation Guide panel, **When** it loads, **Then** they see sections in order: Last Conversation, Opening the Call, Personal Touch, Getting to Business (transition phrases + call checklist), and Handling Conflict (collapsed by default)

2. **Given** the client has previous touchpoints, **When** the Last Conversation section loads, **Then** it shows a summary card: coordinator name, date, duration, sentiment emoji + label, touchpoint type + primary activity, and abbreviated notes from the most recent touchpoint

3. **Given** the client has no previous touchpoints, **When** the Last Conversation section loads, **Then** it shows "No previous conversations logged"

4. **Given** the "Opening the Call" phase is visible, **When** the Coordinator views the cards, **Then** they see 2-3 alternative opener cards in a carousel — the first is a generic professional opener, followed by personalised openers drawn from personal context. Cards contain clickable blanks (mad-lib style) that cycle through 2-3 alternative suggestions

5. **Given** the Personal Touch section loads for a client with context, **When** it renders, **Then** it shows up to 3 event-driven prompt cards sourced from: topics mentioned in the last conversation (e.g., "Last time we chatted you mentioned Sarah's been bringing the kids over every Sunday — how's that going?"), upcoming important dates within 7 days (e.g., "Happy birthday for Saturday, Maggie!"), and interests/family entries

6. **Given** a Personal Touch card is shown, **When** the Coordinator clicks the checkmark, **Then** the card dims with strikethrough (covered). **When** they click dismiss (X), **Then** the card is removed with an animation

7. **Given** the Coordinator clicks "+ Add personal touch" and enters text (e.g., "Mentioned new puppy called Biscuit"), **When** they save, **Then** a new prompt card appears in the Personal Touch section AND a new pill is added to the client's Personal Context (Interests) on the Intelligence panel — creating relationship continuity across the team

8. **Given** the "Getting to Business" section is visible, **When** it loads, **Then** it shows transition phrase cards in a carousel AND a Call Checklist of up to 5 operational items (bills/holds, complaint follow-up, management plan review, overdue check-in, personal small talk) — each checkable, removable, and with source attribution. Coordinators can add items on the fly.

9. **Given** a client has no outstanding operational items, **When** the checklist loads, **Then** only the "Personal small talk" item appears

10. **Given** the "Handling Conflict" section, **When** the Coordinator expands it, **Then** they see a 4-step carousel: Acknowledge → Empathise → Solve → Buy breathing room — each step with 2-3 clickable variants

11. **Given** a client has no personal context recorded, **When** the Conversation Guide loads, **Then** the generic professional opener is shown, Personal Touch shows a nudge "Add personal context to unlock personal touch prompts", and the checklist still shows operational items

---

### User Story 7 — Quick Notes Panel (Priority: P2)

> **V3 addition (2026-03-12)**: New story. The Quick Notes panel extends the existing Notes tab into a floating panel for mid-call capture with category tagging and touchpoint integration.

As a **Coordinator**, I want a floating Quick Notes panel that lets me type a note with a care management category during a call — so that I can capture context without navigating to the Notes tab, and optionally log the note as a touchpoint.

**Why this priority**: Mid-call note capture needs to be zero-friction. Navigating to the Notes tab interrupts the call flow. The floating panel keeps notes accessible alongside the Conversation Guide.

**Independent Test**: Can be tested by opening the Quick Notes panel, typing a note, selecting a category, saving, and verifying the note appears on the Notes tab with the correct category. Then testing "Log as Touchpoint" to verify it creates both a note and a touchpoint.

**Acceptance Scenarios**:

1. **Given** the Coordinator clicks the Quick Notes icon on the tool strip, **When** the panel opens, **Then** they see recent notes (read-only, most recent first) and a text input area with a category dropdown (Direct Care Check-in, Service Coordination, Service Changes, Budget Management, Financial Enquiry, Assessment/Care Planning, Clinical Activity, Provider Coordination, Crisis Contact, Incident Management)

2. **Given** the Coordinator types a note and selects a category, **When** they click Save, **Then** the note is saved to the Notes tab, the Notes tab badge count updates, and a confirmation toast appears

3. **Given** the Coordinator has typed a note, **When** they click "Log as Touchpoint", **Then** the note is saved AND a touchpoint is logged with the note content pre-filled in the touchpoint notes field

---

### User Story 8 — Gradual Rollout via Feature Flag (Priority: P3)

As a **Product Owner**, I want to enable Relationship Intelligence per organisation — so that we can pilot with selected organisations, gather coordinator feedback, and iterate before broader rollout.

**Why this priority**: Relationship Intelligence changes how coordinators prepare for and conduct client calls. It needs validation in practice before organisation-wide rollout.

**Independent Test**: Can be tested by enabling the flag for one organisation and verifying they see the RIN panels and tool strip, while another organisation sees the standard client profile without these additions.

**Acceptance Scenarios**:

1. **Given** the feature flag is enabled for Organisation A, **When** a Coordinator from Organisation A views a client profile, **Then** they see the tool strip, Relationship Intelligence panel, Conversation Guide panel, Quick Notes panel, and touchpoint compliance view

2. **Given** the feature flag is disabled for Organisation B, **When** a Coordinator from Organisation B views a client profile, **Then** they see the existing client profile without any Relationship Intelligence features (unchanged)

3. **Given** the flag is toggled off after being on, **When** the Coordinator views the client profile, **Then** all captured personal context, touchpoint data, and notes are preserved but the RIN UI is hidden — reverting to the standard profile view

---

### Out of Scope

- **AI-generated conversation prompts** — Phase 1 uses template-based mad-libs and rule-based event triggers; AI-powered suggestions (e.g., LLM-generated phrasing, conversation coaching) are Phase 3
- **Client-facing portal** — Clients cannot view or edit the personal context their coordinators have captured; this is internal-only
- **Automated touchpoint detection** — Touchpoints are manually logged by coordinators; automatic detection from phone system or email integration is Phase 2
- **Cross-organisation relationship views** — If a client has packages with multiple organisations, each organisation maintains its own context; unified cross-org views are Phase 2
- **Gamification and adoption metrics** — Coordinator adoption dashboards (e.g., "% of clients with context captured") are Phase 2
- **SMS/email touchpoint templates** — Pre-written message templates for outreach are Phase 2
- **Care plan integration** — Surfacing relationship context within the care plan review workflow is Phase 2
- **Identity verification prompt** — V2 research confirmed calls are outbound-only; inbound identity verification is not needed
- **Call Bridge / telephony integration** — Future-state concept explored in prototype (dial from panel, live transcript, auto-generated notes). Aspirational, not Phase 1
- **Meaningful vs Operational contact classification** — V3 thinking document proposed distinguishing contact types. Deferred to Phase 2 — Phase 1 captures duration and activity type which provides the data foundation
- **Sentiment aggregation / Team Leader view** — Individual touchpoint sentiment is captured in Phase 1. Aggregated sentiment trends and pattern detection (e.g., "3 Concerned in a row") are Phase 2

### Edge Cases

- What happens when a client has no personal context recorded? — The Intelligence panel shows an encouraging empty state with a quick-add button; Personal Touch section shows a nudge to add context
- What happens when a coordinator is reassigned a client? — All personal context, touchpoints, and interaction history transfers with the client, not the coordinator. The new coordinator sees full history including the Last Conversation card
- What happens when a client has multiple packages? — Relationship Intelligence is client-level, not package-level. Personal context and touchpoints are shared across all packages for the same client
- What happens when a touchpoint is logged incorrectly? — The coordinator can edit or delete their own touchpoint entries within 24 hours. After 24 hours, only a Team Leader can modify entries
- What happens when a client is deceased or exited? — Relationship Intelligence panels become read-only. Touchpoint tracking stops. Historical data is preserved for compliance
- What happens when the compliance view shows a client as "Overdue" but the coordinator spoke with them via an unlogged channel? — The coordinator can back-date a touchpoint entry to record the contact
- What happens when two coordinators log touchpoints for the same client on the same day? — Both entries are recorded. The monthly compliance tracker treats any touchpoint as meeting the requirement
- What happens when calling an auth rep? — The Conversation Guide stays open (the call is still about the client). Opening phrases swap the contact name. Personal Touch and Call Checklist remain visible. A blue banner shows who you're calling and who the conversation is about
- What happens when the client has no recent touchpoints? — The Last Conversation card shows "No previous conversations logged". Personal Touch falls back to interest/family entries and upcoming dates only (no "last time we chatted" prompts)

---

## Requirements *(mandatory)*

### Functional Requirements

**Two-Panel Architecture** *(V3 — 2026-03-12)*

- **FR-001**: System MUST render a tool strip on the right edge of the package page with icons for: Relationship Intelligence, Conversation Guide, and Quick Notes. Each icon toggles its respective floating panel
- **FR-001a**: The Intelligence tool strip icon MUST display a touchpoint status dot: green (contacted this month), amber (due soon, >21 days without contact), red (overdue, >30 days)
- **FR-001b**: Panels MUST be draggable by their header and dockable to the right edge. When docked, panels fill the available height. Multiple docked panels split height evenly
- **FR-001c**: Panels MUST position intelligently to avoid overlapping other open panels

**Personal Context Capture**

- **FR-002**: The Intelligence panel MUST contain a Personal Context section where coordinators can capture entries as tag pills grouped into categories: Interests & Hobbies, Family & Household, Important Dates, and General Notes
- **FR-003**: Each personal context entry MUST store: category, content (free text), created date, created by, last updated date, last updated by
- **FR-004**: System MUST allow coordinators to add and remove personal context entries for any client they have access to. Adding uses an inline input within the category group; removing uses a hover-visible (x) button on the pill
- **FR-005**: System MUST display a prompt to capture personal context during the client onboarding workflow — this prompt MUST be skippable
- **FR-006**: Personal context MUST be associated with the client (not the package) and visible across all packages for that client

**Quick Essentials** *(V2+V3)*

- **FR-007**: The Intelligence panel MUST display a "Quick Essentials" card at the top showing: preferred name, language, best time to call, timezone with live clock, caution flags (warning icon + amber highlight), and info notes (info icon + blue highlight)
- **FR-007a**: All Quick Essentials fields MUST be inline-editable — click to edit, Enter to save, Escape to cancel. Pencil icon appears on hover
- **FR-007b**: Caution flags MUST be visually distinct (warning icon + amber highlight) to ensure they are noticed before the call begins

**Operational Context** *(V3 — expanded from "Client Snapshot")*

- **FR-008**: The Intelligence panel MUST display an Operational Context section showing clickable alert rows: bills on hold (count), active complaints (count), management plan due (days), and check-in overdue (days) — each colour-coded (amber/red) and clickable to navigate to the relevant tab
- **FR-008a**: When no operational items are outstanding, the section MUST show "No alerts"

**Auth Rep Switching** *(V2+V3)*

- **FR-009**: System MUST display a contact type toggle (segmented control) at the top of the Intelligence panel when the client has an authorised representative in their care circle
- **FR-009a**: When switched to auth rep view, Quick Essentials MUST swap to show the rep's details (avatar, name, role badge, preferred name, best time, timezone, contact preferences) and display "Calling about [Client Name]"
- **FR-009b**: When in auth rep view, the Conversation Guide panel MUST remain open. Opening phrases MUST swap the contact name to the rep's preferred name. A blue banner MUST show "Calling [Rep Name] (auth rep) — conversation is about [Client Name]". Personal Touch and Call Checklist remain visible as they relate to the client
- **FR-009c**: When switched back to client view, all client essentials, personal context, and guide content MUST be restored

**Touchpoint Logging** *(V3 — expanded)*

- **FR-010**: System MUST provide a "Log Touchpoint" action on the Intelligence panel that captures: date (default today, back-dating allowed), type (Phone Call, In-Person Visit, Video Call, Email), duration (minutes, numeric 1-240), primary activity (select: Monitoring & Review, Care Planning, Organising & Adjusting Services, Navigating Options, Supporting Feedback & Complaints), notes (free text), and sentiment (optional: Happy / Neutral / Concerned)
- **FR-010a**: When duration >= 15 minutes, a green "Care mgmt" badge MUST appear next to the duration field. When < 15 minutes, a neutral "< 15 min" badge MUST appear. This is informational only — it does not trigger billing
- **FR-010b**: Sentiment MUST default to no selection. Coordinators select by clicking one of three emoji buttons. Selection is optional
- **FR-011**: System MUST update the client's touchpoint indicator and the Conversation Guide's Last Conversation card immediately upon saving a touchpoint
- **FR-012**: System MUST allow coordinators to correct or retract their own touchpoint entries within 24 hours of creation via corrective events (append-only — original entry preserved in audit trail). After 24 hours, only Team Leaders can issue corrections
- **FR-013**: System MUST reset the monthly touchpoint indicator at the start of each calendar month

**Touchpoint Compliance**

- **FR-014**: System MUST provide a compliance view showing all clients in the coordinator's caseload with: client name, last touchpoint date, days since contact, and status (Contacted / Due / Overdue)
- **FR-015**: System MUST sort the compliance view by urgency — overdue clients first, then due, then contacted
- **FR-016**: System MUST define "Due" as a client not contacted in the current month with last contact between 21-30 days ago, and "Overdue" as last contact more than 30 days ago
- **FR-017**: Team Leaders MUST be able to filter the compliance view by coordinator to see per-coordinator compliance rates
- **FR-018**: System MUST update the compliance view in real-time when a touchpoint is logged

**Interaction History**

- **FR-019**: System MUST display a chronological timeline of all interactions: touchpoints (with sentiment, duration, activity), complaints, incidents, and significant care plan changes — grouped by month with most recent first
- **FR-020**: System MUST allow filtering the timeline by interaction type
- **FR-021**: Timeline entries MUST show: date, type icon, author, and summary — with expandable detail for entries with notes, duration, activity type, and sentiment

**Conversation Guide** *(V3 — separate panel)*

- **FR-022**: System MUST provide a Conversation Guide as a **separate floating panel** (not a section within the Intelligence panel) containing sections in order: Last Conversation, Opening the Call, Personal Touch, Getting to Business, and Handling Conflict
- **FR-022a**: **Last Conversation** MUST display a summary card from the most recent touchpoint: coordinator name, date, duration, sentiment emoji + label, touchpoint type + primary activity, and abbreviated notes. When no touchpoints exist, show "No previous conversations logged"
- **FR-022b**: **Opening the Call** MUST display 2-3 alternative cards in a carousel. First card is a generic professional opener; subsequent cards are personalised from personal context. Cards support clickable blanks (mad-lib style) that cycle through 2-3 alternative suggestions
- **FR-022c**: **Personal Touch** MUST display up to 3 event-driven prompt cards sourced from: topics in the last conversation, upcoming important dates (within 7 days), and interests/family entries. Each card is checkable (dims with strikethrough), dismissable (X removes with animation), and coordinators can add new prompts via "+ Add personal touch" — which saves to both the guide and the Intelligence panel's Personal Context (Interests)
- **FR-022d**: **Getting to Business** MUST contain transition phrase cards in a carousel AND a Call Checklist of up to 5 operational items (bills/holds, complaint follow-up, management plan, overdue check-in, personal small talk) — each checkable, removable, with source attribution, and coordinators can add items on the fly
- **FR-022e**: **Handling Conflict** MUST be collapsed by default and contain a 4-step carousel: Acknowledge → Empathise → Solve → Buy breathing room — each with 2-3 clickable variants
- **FR-022f**: When no personal context exists, the generic opener MUST still be shown; Personal Touch shows a nudge "Add personal context to unlock personal touch prompts"

**Quick Notes Panel** *(V3 addition)*

- **FR-023**: System MUST provide a Quick Notes floating panel accessible from the tool strip, showing recent notes (read-only) and a note input area with a category dropdown
- **FR-023a**: Note categories MUST include: Direct Care Check-in, Service Coordination, Service Changes, Budget Management, Financial Enquiry, Assessment/Care Planning, Clinical Activity, Provider Coordination, Crisis Contact, Incident Management
- **FR-023b**: Saving a note MUST persist it to the Notes tab, update the Notes tab badge count, and show a confirmation toast
- **FR-023c**: A "Log as Touchpoint" button MUST save the note AND log a touchpoint with the note content pre-filled

**Permissions & Feature Flag**

- **FR-024**: System MUST respect existing client access permissions — coordinators only see Relationship Intelligence for clients they have access to
- **FR-025**: System MUST be controllable via a feature flag that can be toggled per organisation
- **FR-026**: When the feature flag is disabled, all captured data MUST be preserved but the RIN UI MUST be hidden

### Key Entities

- **Personal Context Entry**: A piece of personal information about a client captured by a coordinator. Each entry belongs to a category (Interests & Hobbies, Family & Household, Important Dates, General Notes), has free-text content, and tracks who created/updated it and when. Belongs to a Client (not a Package).

- **Touchpoint**: A recorded interaction between a coordinator and a client. Captures: date, type (Phone Call, In-Person Visit, Video Call, Email), duration (minutes), primary activity (Monitoring & Review, Care Planning, Organising & Adjusting Services, Navigating Options, Supporting Feedback & Complaints), notes, sentiment (Happy / Neutral / Concerned, optional), and the recording coordinator. Used to track monthly regulatory compliance and powers the Last Conversation card. Belongs to a Client.

- **Interaction Timeline** *(aggregated view)*: A chronological view combining touchpoints (with sentiment and activity), complaints, incidents, and care plan changes for a client. Not a stored entity — assembled from existing data sources plus touchpoint records.

- **Personal Touch Prompt** *(generated)*: A contextual suggestion displayed in the Conversation Guide's Personal Touch section. Generated at view time from: topics mentioned in the most recent touchpoint notes, upcoming Important Dates (within 7 days), and personal context entries. Not stored — computed on each view. Coordinator-added prompts during a call create a new Personal Context Entry and are persisted.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Coordinators can capture a personal context entry in under 15 seconds using the quick-add form
- **SC-002**: The Intelligence panel loads all sections (essentials, operational context, personal context, touchpoint status) in a single view without navigating between screens
- **SC-003**: Monthly touchpoint compliance reaches 100% for pilot organisations within 3 months of rollout
- **SC-004**: Coordinators report at least 2 minutes saved per client interaction by eliminating multi-screen navigation
- **SC-005**: Client complaints reduce by 15% in pilot organisations within 6 months
- **SC-006**: At least 70% of active clients have personal context captured within 3 months of rollout
- **SC-007**: All touchpoint entries include the recording coordinator's identity, timestamp, duration, and activity type for regulatory audit
- **SC-008**: Feature flag can enable/disable Relationship Intelligence per organisation without data loss
- **SC-009**: At least 50% of touchpoints include a sentiment rating within 3 months of rollout (adoption metric for optional field)
- **SC-010**: Personal Touch prompts are surfaced for at least 80% of clients who have previous touchpoints with notes (coverage metric)

---

## Clarifications

### Session 2026-02-17 (Spec Lens)

- Q: Where does the RIN panel live in the UI? → A: **Floating panels** triggered from a tool strip on the right edge of the package page. Two main panels (Intelligence + Conversation Guide) plus Quick Notes. Always accessible on every tab. The **Package View tab bar** should be restructured with dropdown groups: **"Care Plan"** (Needs, Risks, Budget) and **"Finance"** (Bills, Statements, Claim History, Transactions, Contributions) — reducing 16 tabs to ~9 visible items
- Q: How should touchpoint edits/deletes work with event sourcing? → A: **Corrective events** — append `TouchpointCorrected` or `TouchpointRetracted` events. Projections show corrected state; full audit trail preserved. Soft-delete only, never hard-delete
- Q: How should the snapshot aggregate data from other domains (bills, complaints, incidents)? → A: **Query existing Eloquent models directly** at render time. No cross-domain projections or new service layer — use existing relationships
- Q: How sophisticated should Phase 1 conversation prompts be? → A: **Simple date/recency rules + last conversation context** — upcoming Important Dates (within 7 days), topics from most recent touchpoint notes, stale touchpoints (approaching 30 days), and operational flags. No sports/weekend logic; defer category-aware rules to Phase 2

### Session 2026-03-09 (V2 Prototype Research)

**Source**: User research sessions with care coordinators + interactive prototype testing (sidebar-playground.html v2)

| Change | What | Why |
|--------|------|-----|
| Quick Essentials added | Preferred name, language, caution flags at top of panel | Research: practical call essentials needed before personal context |
| Conversation Guide | 3-phase structured guide (Open → Steer → Conflict) | Research: coordinators need call structure, not isolated prompts |
| Operational Agenda | Talking points reframed as operational checklist | Research: talking points should be business items, not personal starters |
| Auth rep switching | Full context swap when calling representative | Research: significant portion of calls go to reps |
| Communication Preferences removed | Merged into Quick Essentials | Preferred name, call time are essentials not preferences |

### Session 2026-03-12 (V3 Playground Cross-Check)

**Source**: Interactive playground v3 + Loom walkthrough script v3 + v3-thinking.md

| Change | What | Why |
|--------|------|-----|
| **Two-panel split** | Intelligence (reference) + Conversation Guide (call companion) as separate floating panels | UX decision: "reference card before and after the call, guide open during" |
| **Last Conversation card** | Summary of most recent touchpoint at top of guide | #1 pre-call need: "what happened last time?" |
| **Personal Touch** | Care-event-triggered prompts from last conversation, upcoming dates, interests | Client experience lens: "Margaret notices when no one remembers" |
| **Touchpoint enhanced** | Duration, primary activity (Support at Home categories), sentiment | Business case: care management billing alignment. Client experience: quality signal |
| **Quick Notes panel** | Floating panel with category tagging and "Log as Touchpoint" | Mid-call capture without navigating to Notes tab |
| **Auth rep guide stays open** | Guide remains visible with name swap + banner | Call is still about the client; checklist and personal touch remain relevant |
| **Operational context expanded** | Added management plan due and check-in overdue items | Playground demonstrated richer operational awareness |
| **Quick Essentials expanded** | Added best time, timezone (live clock), info notes | Practical call prep: "what time is it there?" |
| **"Preferences" category removed** | Redundant with Quick Essentials best time field | Already captured in essentials; remove duplicate |
| **Personal context pinning deferred** | Pinning to Package Sidebar tooltip deferred to Phase 2 | Simplify Phase 1; Personal Touch prompts serve the same "surface context" purpose |
| **US6 elevated to P1** | Conversation Guide is core experience, not secondary | The guide and Intelligence panel are the two halves of the value proposition |
| **North star updated** | "Margaret feels known every time we call" | V3 reframes from coordinator efficiency to client experience |
