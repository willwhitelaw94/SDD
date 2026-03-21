---
title: "Relationship Intelligence — Humanised Idea Brief"
description: "A designer-friendly version of the RIN idea brief, translated for clarity and accessibility"
---

# Relationship Intelligence

**Know the person before you pick up the phone.**

---

## 5-Minute Summary

| | |
|---|---|
| **What** | A panel that shows coordinators everything they need to know about a client — personal details and operational data — in one place |
| **Why** | Staff have no way to capture or recall personal context about clients, and there's no system to track mandatory monthly contact |
| **Who** | Care Partners, Coordinators (daily), Team Leaders (oversight) |
| **When** | Before, during, and after every client call |
| **Success** | 100% monthly touchpoint compliance, 70% of clients with personal context captured, 15% complaint reduction |

---

## The Problem, In Human Terms

### Meet Sarah: Care Coordinator at Trilogy Care

Sarah manages around 100 clients. She makes 40-60 calls a day. Before each call, she opens a client's profile and starts hunting:

1. Check the **bills tab** — anything on hold?
2. Check the **complaints tab** — anything active?
3. Check the **incidents tab** — anything recent?
4. Try to **remember** from her last call: what are their interests? Do they have grandkids? Were they upset last time?

This takes 2-3 minutes per call. And when she finally dials, she jumps straight in: *"Hi Margaret, I'm calling about your bill that's on hold..."*

Margaret feels like a ticket number.

### What Sarah wishes she could do

> "I want to open Margaret's profile and immediately see: she loves gardening, her grandkids visit on Sundays, she supports the Swans, she has one bill on hold, and I last spoke to her 18 days ago. I want to open with 'How was the weekend? Did the grandkids come round?' — and then deal with the bill."

### The stakes are real

- **Regulatory requirement**: Trilogy Care must make monthly direct care management contact with every client under the Aged Care Quality Standards. Right now, there's **no system tracking whether this happens**. Compliance is unknown.
- **Lost knowledge**: When Sarah is sick or a client is reassigned, everything she knows about that person — their preferences, their family, what was discussed last time — disappears.
- **Complaint risk**: Clients who feel like "just a number" are more likely to complain. Personalised interactions build trust.

---

## The Solution: Relationship Intelligence

A single panel that combines **who this person is** with **what's going on** — surfaced at exactly the moment a coordinator needs it.

### Before and After

```
BEFORE (Today)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Open client profile
2. Check bills tab → 1 on hold
3. Check complaints tab → none
4. Check incidents tab → none
5. Try to remember personal details...
6. "Hi Margaret, your bill is on hold..."
   Time: ~3 minutes prep | Feels: transactional


AFTER (With Relationship Intelligence)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Open client profile → RIN panel loads
2. See: "Loves gardening 🌱 | Grandkids visit Sundays 👨‍👩‍👧 | Supports the Swans"
3. See: 1 bill on hold (amber) | 0 complaints | Last contact: 18 days ago
4. Conversation starters suggest: "How's the garden going?"
   and "Did the grandkids make it down on the weekend?"
5. "Hi Margaret! How's the garden — are the tomatoes coming along?"
6. Then: "I can see there's a bill we need to sort out..."
   Time: ~30 seconds prep | Feels: personal, human
```

---

## What We're Building (Features at a Glance)

### 1. Personal Context Capture

**What it is**: A place to record what you know about a client — their interests, family, pets, important dates, and how they like to communicate.

**Why it matters**: This knowledge currently lives in coordinators' heads. When they're absent, it's gone. RIN makes it persistent and shared.

**What it looks like**: Structured categories (Interests, Family, Dates, Preferences, Notes) with a quick-add form that takes under 15 seconds.

### 2. Persistent Sidebar (Always There)

**What it is**: A **new right-hand panel** that follows you across every package tab — Bills, Notes, Incidents, wherever you are. It shows conversation starters, personal context, touchpoint status, and operational badges in one glanceable view. This is separate from the existing left sidebar (which shows TC ID, funding, care partner, and other operational data).

**Why it matters**: A tab means navigating *away* from what you're doing. If Sarah is sorting a bill on hold, she shouldn't have to leave the Bills tab to see that Margaret loves gardening. The sidebar keeps relationship context *alongside* the work, not instead of it. The existing left sidebar is already packed with operational data, so RIN gets its own dedicated space on the right.

**What it looks like**: A new right-hand sidebar (`RelationshipSidebar.vue`) creates a three-column layout: left sidebar (existing operational data) | centre (tab content) | right sidebar (RIN). It's collapsible when you need more screen space, and updates automatically as you navigate between packages. The two sidebars are independent — collapsing one doesn't affect the other.

**The Intercom model**: Like Intercom's inbox sidebar, the context panel is always present. You never "go to" it — it's just there.

### 3. Touchpoint Logging

**What it is**: A quick way to record "I spoke with this client" — the date, how (phone, visit, video, email), and brief notes about what was discussed.

**Why it matters**: Monthly contact is a regulatory requirement. Without logging, compliance is unmeasured. The notes also give the next coordinator context for their call.

**What it looks like**: A "Log Touchpoint" button on the snapshot → quick form (date, type, notes) → done in 30 seconds.

### 4. Conversation Starters

**What it is**: Lightweight, fill-in-the-blank prompts that help coordinators turn personal context into natural conversation openers — not scripts, but gentle nudges.

**Why it matters**: Capturing personal context is only half the job. Without guidance, coordinators either ignore the data or use it awkwardly ("I see here you like gardening. How is your gardening?"). Conversation starters bridge the gap between *knowing* something and *using* it naturally.

**What it looks like**: 2-3 suggested openers on the snapshot, generated from personal context entries. They feel like something a colleague would whisper before you pick up the phone:

```
Instead of reading raw data...     You see a natural opener...
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━     ━━━━━━━━━━━━━━━━━━━━━━━━━━
Interest: Gardening (tomatoes)  →  "How's the garden going — are the tomatoes coming along?"
Family: Grandkids visit Sundays →  "Did the grandkids make it down on the weekend?"
Important Date: Birthday 15 Mar →  "Happy birthday for Saturday!"
Sports: Supports the Swans      →  "Did you catch the Swans game?"
Bill on hold since 12 Feb       →  "I can see there's a bill we need to sort out from a few weeks back"
```

**Key design principle**: These aren't scripts. They're **mad-libs** — templated phrases with personal details filled in. The coordinator adds their own warmth and personality. The system just gives them somewhere to start so the personal context doesn't feel forced.

**What makes a good starter**:
- Uses the client's own words or specific details (not generic "How are you?")
- Feels like something you'd say to a neighbour, not read from a form
- Personal starters appear above operational ones — relationship first, business second
- Maximum 3 starters shown (not overwhelming), refreshed each visit

### 5. Compliance Dashboard

**What it is**: A view showing which clients in your caseload have been contacted this month — and which haven't.

**Why it matters**: Without this, coordinators check each client individually. Team Leaders have no oversight. Clients fall through the cracks.

**What it looks like**: A sortable list — overdue clients at the top (red), approaching deadline (amber), contacted (green). Team Leaders can filter by coordinator.

---

## Who Benefits and How

### For Coordinators (Sarah)

| Today | With RIN |
|-------|----------|
| 2-3 min prep per call across 4-5 screens | 30 seconds in one view |
| Personal context lives in her head | Captured, shared, persistent |
| No idea if she's met monthly contact for all clients | Dashboard shows who needs a call |
| Calls feel transactional | Calls feel personal |

### For Team Leaders

| Today | With RIN |
|-------|----------|
| No visibility into touchpoint compliance | Per-coordinator compliance rates |
| Can't identify who needs support | See which coordinators are behind |
| Regulatory reporting relies on manual tracking | System-tracked, auditable data |

### For Clients (Margaret)

| Today | With RIN |
|-------|----------|
| Feels like "just a number" | Feels known and valued |
| Every call starts with a business problem | Every call starts with a personal connection |
| New coordinator = starting from scratch | New coordinator knows her already |

---

## What Success Looks Like

| Measure | Target | When |
|---------|--------|------|
| Monthly touchpoint compliance | 90%+ in pilot pod | 4-6 weeks post-pilot |
| Clients with personal context | 70% of active clients | 3 months |
| Call prep time | Under 1 minute (down from ~3 min) | At launch |
| Complaint reduction | 15% fewer complaints | 6 months |
| Context entry speed | Under 15 seconds | At launch |

---

## Assumptions We're Making

1. **Staff will capture personal context** if the form is fast and integrated into their workflow (not a separate admin task)
2. **Clients are comfortable** with staff recording preferences — covered by existing service agreements, internal-only, no client-facing exposure
3. **Existing data is accessible** — bills, complaints, incidents can be surfaced in the snapshot via existing systems

## Risks We're Watching

| Risk | What could happen | How we're managing it |
|------|-------------------|----------------------|
| **Staff see it as admin** | Coordinators don't capture context | Make it under 15 seconds, build into natural workflow, show immediate value via conversation prompts |
| **Stale information** | Outdated context backfires in calls | Timestamps on every entry, periodic review prompts planned for Phase 2 |
| **Privacy concerns** | Clients uncomfortable with recorded preferences | Internal-only data, no client-facing exposure, guidance on appropriate content |
| **Compliance reveals gaps** | We discover touchpoint compliance is poor | Frame as "now we can see and fix it" — any measurement is progress over the current unknown |

---

## How We'll Roll It Out

**Phase 1 — Pilot** (Single pod, ~5 coordinators, 4-6 weeks)
- Personal context capture
- Client snapshot
- Conversation starters (template-based, from personal context)
- Touchpoint logging
- Compliance dashboard
- Feature flag per organisation

**Phase 2 — Expand** (If pilot succeeds)
- Interaction history timeline
- Advanced conversation prompts (rule-based: date proximity, day-of-week awareness, event triggers)
- Adoption metrics dashboard

**Phase 3 — Mature**
- AI-powered conversation suggestions
- Automated touchpoint detection from phone systems
- Care plan integration

---

## What's NOT in Scope (Phase 1)

- AI-generated conversation prompts — Phase 1 has template-based starters from personal context; Phase 2 adds rule-based prompts (date/event awareness); Phase 3 adds AI-powered suggestions
- Client-facing portal — clients can't see what coordinators record
- Automated touchpoint detection — coordinators log manually for now
- Cross-organisation views — each organisation maintains its own context
- Gamification — adoption dashboards and "completeness scores" come later

---

## Owner & Stakeholders

| Role | Person | What they care about |
|------|--------|---------------------|
| **Responsible** | Romy Blacklaw (PO) | Feature delivers on care quality vision |
| **Accountable** | Patrick Hawker | Regulatory compliance, team efficiency |
| **Consulted** | William Whitelaw | Technical architecture, implementation |
| **Consulted** | Pilot Coordinator Pod | Daily usability, workflow fit |
| **Informed** | Team Leaders | Compliance monitoring |
| **Informed** | Clinical Governance | Regulatory audit trail |

---

## Design Checklist (What Designers Need to Create)

- [ ] **New right sidebar** — `RelationshipSidebar.vue` as a separate right-hand panel (not extending the existing left PackageSidebar): starters → personal context → touchpoint status → operational badges. Three-column layout when active
- [ ] **Personal context form** — quick-add with category picker, under 15 seconds
- [ ] **Personal context entries** — grouped by category, with edit/delete, pinnable
- [ ] **Conversation starters** — 2-3 template-based openers on the snapshot, personal above operational
- [ ] **Touchpoint logging form** — date, type, notes
- [ ] **Touchpoint status indicator** — days since last contact, colour-coded
- [ ] **Compliance dashboard** — sortable table with status badges
- [ ] **Empty state** — encouraging, not blank ("No personal context yet — add some to build rapport")
- [ ] **Loading state** — snapshot may take 3-5 seconds on first load
- [ ] **Mobile/narrow layout** — sections stack vertically

---

## Technical Constraints That Matter for Design

| Constraint | What it means for design |
|------------|-------------------------|
| **RIN is a new right sidebar, not a tab** | A separate right-hand `RelationshipSidebar.vue` — independent from the existing left-hand `PackageSidebar`. Creates a three-column layout. Visible on every package tab without navigating away. Collapsible for screen space |
| **Sidebar is package-aware** | As you navigate between packages, the right sidebar updates to show the current package's recipient |
| **24-hour edit window on touchpoints** | After 24 hours, touchpoints become read-only for the coordinator (Team Leaders can still edit) |
| **Feature flag per organisation** | Some orgs see it, some don't — no partial states needed |
| **Client-level, not package-level** | One set of personal context per client, shared across all their packages |

---

---

## V2 Research Refinements (2026-03-09)

> The original brief above remains accurate for the core vision. V2 prototype testing with care coordinators refined **how** that vision is delivered. See the [design kickoff](./design.md#v2-prototype-learnings-2026-03-09) for full details.

**Key refinements:**

- **Quick Essentials** added — preferred name, language, and caution flags appear at the very top of the panel. The first 5 seconds of every call are informed.
- **Conversation Guide** replaces simple "Conversation Starters" — three phases: Open warmly → Steer to business → Handle conflict. Each phase has a carousel of alternative cards with clickable mad-lib blanks.
- **Operational Agenda** replaces operational badges — the "Talking Points" section becomes an active call checklist (bills/holds, complaints, management plan, overdue check-ins) rather than passive count badges.
- **Auth Rep switching** elevated to first-class — when calling a representative, the entire panel context swaps: essentials show rep details, personal starters hide, a label shows who you're calling about.
- **Communication Preferences removed** from Personal Context — merged into Quick Essentials. Personal Context now focuses on: Interests & Hobbies, Family & Household, Important Dates.
- **Identity verification removed** — outbound calls only, not needed.
- **Handling Conflict** added — a 4-step framework (Acknowledge → Empathise → Solve → Buy breathing room) gives coordinators resources for difficult calls.

**What didn't change:** Core value prop, persistent sidebar, personal context capture, touchpoint logging, compliance tracking, feature flags, phased rollout.

---

*This is a humanised version of the [original idea brief](./idea-brief.md), enriched with context from the [full specification](./spec.md), [business spec](./business-spec.md), and [design kickoff](./design.md).*
