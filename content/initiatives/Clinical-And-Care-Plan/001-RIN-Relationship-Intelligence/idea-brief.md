---
title: "Idea Brief: Relationship Intelligence"
---

# Idea Brief: Relationship Intelligence

**Created**: 2026-02-17
**Author**: William Whitelaw

---

## Problem Statement (What)

- Staff have **no structured way to capture personal context** about clients (interests, family, preferences) — rapport-building relies entirely on individual memory
- When a coordinator calls a client, they jump straight into operational issues (bills on hold, complaints) without any personal connection — this feels transactional and impersonal
- **Client data is fragmented** across multiple screens — bills, complaints, incidents, care plans, and notes live in separate places with no unified view
- Trilogy Care has a **regulatory requirement for monthly direct care management touchpoints** with every client, but there's no tooling to make these interactions meaningful or context-rich
- Complaints are more likely when clients feel like "just a number" rather than a known person

**Current State**: Coordinators rely on memory or scattered notes to remember personal details. Before calling a client, they must check multiple screens to understand the full picture. There is no prompt or system to surface relationship context at the point of interaction.

---

## Possible Solution (How)

A **Relationship Intelligence** panel that gives staff a single, unified view of a client — combining personal context with operational data — surfaced at the right moment (before/during calls and touchpoints).

- **Personal context capture**: Structured fields for interests, family, pets, sports teams, important dates, preferences, and conversation notes — populated at onboarding and enriched over time
- **Unified client snapshot**: A single view showing personal context alongside bills on hold, active complaints, recent incidents, care plan status, and upcoming touchpoints
- **Conversation prompts**: Contextual suggestions before/during calls (e.g., "Ask about the grandkids" or "They support the Swans — game was on the weekend")
- **Monthly touchpoint tracker**: Track regulatory care management touchpoints per client with reminders and completion status
- **Interaction history**: Log of all touchpoints with context about what was discussed, creating a relationship timeline

```
// Before (Current Process)
1. Coordinator opens client record
2. Checks bills tab, complaints tab, incidents tab separately
3. Tries to remember personal details from last call
4. Jumps straight into "Your bill is on hold..."

// After (Relationship Intelligence)
1. Coordinator opens client → Relationship Intelligence panel loads
2. Sees: "Loves gardening, grandkids visit Sundays, supports Swans"
3. Sees: 1 bill on hold, 0 complaints, last touchpoint 18 days ago
4. Opens with: "How was the weekend? Did the grandkids come round?"
5. Then: "I can see there's a bill we need to sort out for you..."
```

---

## Benefits (Why)

**Client Experience**:
- Personalised interactions that build trust and loyalty — target 20%+ improvement in client satisfaction scores
- Clients feel known and valued — not like a ticket number
- Smoother conversations that address the whole person, not just the issue

**Operational Efficiency**:
- Single unified view eliminates toggling between 4-5 separate screens per call — estimated 2-3 min saved per interaction
- Conversation prompts reduce preparation time before calls
- Monthly touchpoint tracking ensures 100% regulatory compliance without manual tracking spreadsheets

**Business Value**:
- Reduced complaints through better rapport — target 15% complaint reduction in first 6 months
- Regulatory compliance for monthly direct care management touchpoints — currently at risk of gaps
- Improved client retention through stronger relationships

**ROI**: Complaint reduction + regulatory compliance + improved NPS — to be quantified during discovery

---

## Owner & Stakeholders

| Role | Person |
|------|--------|
| **R** | Romy Blacklaw (PO) |
| **A** | Patrick Hawker |
| **C** | William Whitelaw |
| **I** | — |

---

## Assumptions & Dependencies, Risks

**Assumptions**:
- Staff will adopt the practice of capturing personal context if the tooling is simple and integrated into existing workflows
- Clients are comfortable with staff recording personal preferences (privacy/consent considerations)
- Existing client data (bills, complaints, incidents) can be surfaced together in the unified view

**Dependencies**:
- Existing client record and profile infrastructure
- Bills, complaints, and incidents modules must expose data for the unified view
- Onboarding workflow to seed initial personal context

**Risks**:
- Privacy/consent concerns around recording personal information (MEDIUM) → Mitigation: Clear consent framework, client-visible preferences, opt-out capability
- Staff adoption — coordinators may not consistently capture context (MEDIUM) → Mitigation: Make it easy, build into natural workflow, gamify completeness
- Data quality — stale or inaccurate personal context could backfire (LOW) → Mitigation: Last-updated timestamps, periodic review prompts

---

## Estimated Effort

**To be determined** — requires discovery and technical scoping

- **Phase 1**: Personal context model + capture UI (onboarding integration)
- **Phase 2**: Unified client snapshot panel
- **Phase 3**: Conversation prompts + monthly touchpoint tracker

---

## Proceed to PRD?

**YES** — Strong alignment with regulatory requirements and clear client experience improvement. Discovery needed to scope the unified view and data integration.

---

## Decision

- [ ] **Approved** - Proceed to PRD
- [ ] **Needs More Information** - [What's needed?]
- [ ] **Declined** - [Reason]

**Approval Date**: —

---

## Next Steps

**If Approved**:
1. [ ] Run `/trilogy-idea-handover` — Gate 0 (create epic in Linear)
2. [ ] Run `/speckit-specify` — Create detailed PRD
3. [ ] Run `/trilogy-clarify business` — Refine business outcomes and success metrics
4. [ ] Run `/trilogy-research` — Gather context from Teams, Fireflies, and codebase

---

## Change Log

### 2026-03-09 — V2 Prototype Research Findings

**Source**: User research sessions with care coordinators + interactive prototype testing (sidebar-playground.html v2)

**Key finding**: The original brief focused on *capturing and surfacing* personal context. Research revealed the real gap is broader — coordinators need **structured conversation guidance** and **operational call agendas**, not just personal data. The brief's "Conversation Prompts" concept was validated but needed to be reframed as a full conversation guide with distinct phases.

**What changed from the original brief:**

| Original Brief Concept | V2 Refinement | Why |
|------------------------|---------------|-----|
| "Conversation prompts" as suggestions | **Conversation Guide** — structured phases: Open warmly → Steer to business → Handle conflict | Research showed coordinators need a running order, not isolated prompts. Newer staff especially need structure for the full call arc, not just openers |
| Personal context as the primary value | **Quick Essentials** (preferred name, language, caution flags) as the primary value, personal context as secondary | Research: *"We don't necessarily get personal anymore. We literally just go straight to the information we need and drop them."* The first 5 seconds of a call need practical essentials, not interests |
| Identity verification as a panel section | **Removed** — outbound calls only, identity verification is an inbound concern | Prototype testing confirmed this was unnecessary for the primary use case |
| Communication Preferences as a personal context category | **Merged into Quick Essentials** — preferred name, call time, contact method are essentials, not "preferences" | Preferences were redundant with the essentials card; removing them simplified the panel |
| Single "conversation prompts" concept | **Three-phase Conversation Guide**: (1) Opening the call — generic professional + personal openers; (2) Steering to business — transitional phrases; (3) Handling Conflict — Acknowledge → Empathise → Solve → Buy breathing room | Research validated that coordinators struggle with the *transition* between personal and business, and have no resources for difficult calls |
| Operational data as count badges | **Operational Agenda** — 5 structured talking points: bills/holds, active complaint, management plan check-in, overdue check-in, personal small talk | Reframed from passive "badges you notice" to an active "agenda you follow" — gives the call structure |
| Auth rep mentioned as an edge case | **First-class Auth Rep switching** — panel context swaps entirely when calling a representative | Research: a significant portion of calls go to authorised reps, not clients. The system must distinguish who you're calling |

**What stayed the same:**
- Core value proposition: "Know this person before you pick up the phone"
- Personal context capture (interests, family, dates)
- Touchpoint logging and compliance tracking
- Persistent sidebar across tabs
- Feature flag per organisation
- Phased rollout approach

**Revertibility**: These are additive refinements to the original brief. The original concept is preserved — v2 adds structure and specificity based on research. No original scope was removed, only refined or reorganised.
