---
title: "RIN V3 Thinking — Client Experience Reframe"
status: draft
date: 2026-03-09
---

# RIN V3 Thinking — Client Experience Reframe

> **Status**: Early thinking — not a spec, not a commitment. Seeds planted in v2 Loom walkthrough.
> **Context**: V1 and V2 were framed around the coordinator experience. V3 rebases the initiative around the client. The tools still serve the coordinator — but the outcomes we measure shift to: *does the client feel known?*

---

## 1. North Star Shift

**V1–V2 framing**: "Give coordinators everything they need before they pick up the phone."

**V3 framing**: "Margaret feels known every time we call."

The coordinator is the vehicle, not the destination. Every feature in the panel should be evaluated against: *does this make the client feel like a person, not a ticket number?*

This aligns with the broader roadmap positioning RIN as one of three pillars of Intelligent Care Delivery — alongside Decision Support and Clinical Automation. RIN is the human pillar. The other two make coordinators faster and more accurate; RIN makes them *warmer*.

---

## 2. Conversation Guide → Client Experience Guide

The v2 Conversation Guide has three phases: Open warmly → Steer to business → Handle conflict. The structure works. V3 reframes each phase around the client's experience of the call, not just the coordinator's task list.

| V2 Phase | V3 Reframe | What changes |
|----------|------------|--------------|
| **Opening the call** | **"Make them smile"** | Same mad-lib cards, but framed as: what will make Margaret feel recognised in the first 10 seconds? |
| **Steering to business** | **"Respect their time"** | Transition phrases stay, but add awareness of call frequency — if we've called three times this month, acknowledge it: "I know we've been in touch a lot lately…" |
| **Handling conflict** | **"Recover the relationship"** | Same 4-step framework, but add a post-conflict touchpoint prompt: log what happened, flag for a follow-up "checking in" call within 48 hours |

The labels are internal — the coordinator still sees "Opening", "Steering", "Conflict" in the UI. But the design intent behind each phase shifts from "help the coordinator" to "protect the client's experience."

---

## 3. Sentiment Indicator on Touchpoints

V2 touchpoint logging captures: date, type (phone/visit/video/email), and notes. It answers *did we make contact?*

V3 adds a one-tap sentiment indicator: **Happy / Neutral / Concerned**.

This is deliberately simple — not a satisfaction survey, not a score. Just a coordinator gut-check after hanging up: *how did that go?*

### Why this matters

- **Pattern detection**: Three "Concerned" touchpoints in a row is a signal. The system can surface this to a Team Leader without requiring the coordinator to escalate manually.
- **Relationship health over time**: A compliance dashboard shows *frequency* of contact. Sentiment shows *quality*. Both matter.
- **Client experience metric**: "90% of touchpoints rated Happy or Neutral" is a measurable client experience outcome — not just an operational one.

### Design notes

- Default to no selection (don't force it — some calls don't warrant a rating)
- Show as three small icons below the touchpoint log button, not a separate step
- Aggregate sentiment per client visible in a future Team Leader view

---

## 4. Meaningful vs Operational Contact

Not all touchpoints are equal. A call to chase a signature is not the same as a call to check in on wellbeing. V2 counts both the same way.

V3 distinguishes:

| Type | Example | Counts toward |
|------|---------|---------------|
| **Operational** | "Your bill is on hold" / "We need a signature" / "Confirming your appointment" | Operational contact log |
| **Meaningful** | Monthly check-in / Relationship-building call / Welfare check | Regulatory compliance + relationship health |

### Why this matters

- **Regulatory compliance**: Monthly direct care management touchpoints under the Aged Care Quality Standards need to be *meaningful* contact, not just any contact. A call to chase paperwork doesn't satisfy the spirit of the requirement.
- **Coordinator awareness**: Tagging a touchpoint as "meaningful" is a nudge to the coordinator — *did you actually connect with this person, or just transact with them?*
- **Honest measurement**: If 80% of our "touchpoints" are operational, we're not building relationships — we're processing tickets. Knowing the split is the first step to changing it.

### Design notes

- Two-option toggle on the touchpoint log form: "Operational" / "Meaningful" (default to Operational — meaningful should be a deliberate choice)
- Compliance dashboard shows both totals, but the regulatory metric uses Meaningful only
- Don't gatekeep — coordinators self-classify. Trust them.

---

## 5. Revenue Capture Signal

Under Support at Home, documented care management contact becomes a billable activity. This is new — historically, relationship-building calls had no revenue signal.

V3 adds awareness (not billing — just awareness) to the panel:

- When a coordinator logs a **Meaningful** touchpoint, the system notes: *"This contact may be billable under Support at Home care management."*
- The note is informational — it doesn't trigger billing, it doesn't change workflow. It just makes visible that the work coordinators are already doing has revenue value.

### Why this matters

- **Business case for RIN**: If every meaningful touchpoint has revenue potential, the ROI of making touchpoints *easier* and *more frequent* becomes concrete.
- **Coordinator morale**: Knowing that their relationship-building work has tangible business value — not just "soft" value — matters.
- **Leadership reporting**: "We logged X meaningful touchpoints this month, representing $Y in potential care management revenue" is a powerful metric.

### Design notes

- Subtle — a small label or footnote on the touchpoint confirmation, not a modal or alert
- Only appears for Meaningful touchpoints, not Operational
- Exact billing rules are out of scope for RIN — this is a signal, not a calculator
- Requires alignment with finance/billing team on what qualifies

---

## 6. Phase 2 AI Layer — Care-Event-Triggered Prompts

The v2 Conversation Guide uses template-based mad-libs. Phase 2 on the current roadmap mentions "AI-powered conversation suggestions" — but that's vague.

V3 scopes this more concretely as **care-event-triggered prompts**:

| Trigger | Prompt | Source |
|---------|--------|--------|
| Client had a fall last week (incident logged) | "I wanted to check in — I understand you had a bit of a tumble last week. How are you feeling?" | Incidents module |
| Birthday within 7 days | "Happy birthday for [day]! Any plans?" | Personal Context → Important Dates |
| Management plan due for review | "While I've got you, your care plan is coming up for its annual review…" | Clinical module |
| First call after complaint resolved | "I just wanted to follow up — I know [issue] was frustrating. I hope we've got that sorted for you now." | Complaints module |
| No meaningful contact in 25+ days | Priority flag: "It's been a few weeks — this is a good one for a proper check-in" | Touchpoint log |

### Why this matters

- **Proactive, not reactive**: Instead of the coordinator remembering that Mrs. Johnson had a fall, the system tells them. The client feels cared for because nothing falls through the cracks.
- **Client experience directly**: Every one of these prompts exists because ignoring the trigger would make the client feel *un*known. A birthday missed. A fall not mentioned. A complaint never followed up.
- **Scoped and testable**: These aren't open-ended AI suggestions — they're rule-based triggers with templated responses. We can build and test them without an LLM.

### Design notes

- Prompts appear in the Conversation Guide section, tagged with a source icon (incident, birthday, clinical, complaint)
- Maximum 2 event-triggered prompts per call — don't overwhelm
- Coordinator can dismiss with one click if not relevant
- Phase 3 adds LLM-generated phrasing; Phase 2 uses templates

---

## 7. Summary — What V3 Changes

| Area | V2 (Current) | V3 (Proposed) |
|------|--------------|---------------|
| **North star** | Coordinator efficiency | Client feels known |
| **Conversation Guide framing** | Coordinator task phases | Client experience phases |
| **Touchpoint logging** | Date + type + notes | + Sentiment (Happy/Neutral/Concerned) |
| **Contact classification** | All touchpoints equal | Meaningful vs Operational distinction |
| **Revenue awareness** | None | Informational note on meaningful touchpoints |
| **Phase 2 AI** | Vague "AI suggestions" | Scoped care-event-triggered prompts |
| **Success metrics** | Compliance rate, prep time | + Sentiment trends, meaningful contact ratio, client experience score |

---

## 8. What Doesn't Change

- The panel UX — still a persistent, draggable, dockable right sidebar
- Quick Essentials, timezone, auth rep switching — all stay
- Personal Context capture — still interests, family, dates
- The Conversation Guide structure — three phases, carousels, mad-libs
- Handling Conflict framework — still Acknowledge → Empathise → Solve → Breathe
- Feature flag per organisation, phased rollout approach
- Phase 1 scope — V3 thinking informs Phase 2+, it doesn't expand Phase 1

---

## 9. Open Questions

1. **Sentiment indicator — too much friction?** Even one tap is an extra step after every call. Is opt-in enough, or will adoption be too low to be useful?
2. **Meaningful vs Operational — who decides?** Self-classification is fast but subjective. Do we need guardrails or is coordinator judgement sufficient?
3. **Revenue signal — too early?** Support at Home billing rules are still being finalised. Is it premature to surface revenue awareness, or does early visibility help build the business case?
4. **Care-event prompts — data availability?** Do incidents, complaints, and clinical modules currently expose the data we'd need for triggers? Or is this a significant integration effort?
5. **Client experience score — how do we measure it?** Sentiment is a proxy. Is there a more direct measure we should be targeting?

---

*This is thinking, not a plan. The goal is to seed the conversation about where RIN goes after Phase 1 ships — and to ensure that when we get there, the initiative is grounded in client outcomes, not just coordinator tooling.*
