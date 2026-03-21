---
title: "User Research: Levi — Prototype Walkthrough"
date: 2026-03-09
participant: Levi
role: Care Coordinator (~8 months, longest-tenured)
interviewer: Ed King
context: "In-person walkthrough of the RIN Figma prototype with Levi to gather panel-level feedback and prioritisation"
---

# User Research: Levi — Prototype Walkthrough

## Key Quotes

> "If we're gonna have the alerts anyway, talking points wouldn't really be needed, because we know what we need to address anyway."

> "I would leave alerts at the top, 100%. Because then you can do everything on the phone call."

> "Realistically we're going on the portal anyway for the phone number. So then if I saw the alerts, I'd discuss those within the phone call — where at the moment I don't check everything before I ring them because sometimes you're just busy so you just ring them for whatever you think you need to. But then you've missed things that you could have just done in one phone call."

> "100% that would be honestly the best thing ever" — on alerts being deep-linked to bills, check-ins, etc.

> "I feel like conversation starters and talking points could be merged."

> "I don't like the interests and family — I just don't know how relevant that would be, because of how many phone calls we actually have to make we just can't be personal with our clients."

> "None of us would add into personal context. But the preferences bit would be good — like when they prefer us calling, because a lot of them would be like, why are you ringing me so early?"

> "We struggle in terms of having to duplicate the portal so that I can go in like budget, bills, and keep typing my notes down. Sometimes I don't do the note and I'm in the portal and I just have to memorise what I've discussed."

> "I'd love to start using that now, to be honest" — on the floating notes panel

## Feedback by Panel

### Alerts — TOP PRIORITY
- **Favourite feature**, confirmed again from previous session
- Key value: stops you missing things that could be handled in one call
- Deep-linking from alerts to the relevant section (e.g. click "bills on hold" → goes to bills) described as "honestly the best thing ever"
- Wants **management plan follow-ups** included as alerts — currently these live in analytics/CRM and are easy to forget
- Many coordinators forget to check the analytics dashboard in the morning, so surfacing MP due dates here would catch overdue items
- Noted a bug: check-ins showing as overdue even after completion (e.g. client showing last check-in 8th Aug 2025 despite being contacted in December)

### Conversation Starters + Talking Points — MERGE THEM
- Strongly feels these two panels overlap and should be **combined**
- Conversation starters more useful for **new coordinators** who struggle with how to open calls
- Talking points redundant if alerts already tell you what to address
- Identified the hardest conversation types for new staff:
  1. **Check-ins** — routine but new staff don't know how to structure them
  2. **Introduction calls** — first contact with a new client
  3. **Overspends** — clients don't understand budgets/services
  4. **Support at Home fees** — the 20% coordination fee; clients claim they were never told
  5. **Handling difficult/hostile callers** — new staff lack confidence to set boundaries or end calls
- No formal scripts exist — Levi created a word document herself for new staff
- There is a basic "handling difficult conversations" doc (acknowledge distress, attempt to de-escalate, escalate) but no detailed scripts

### Personal Context — MIXED
- **Preferences** (e.g. preferred call times) = useful and wanted
- **Interests and family** = not useful day-to-day given call volume; useful only as a snapshot
- Nobody would actively **add** personal context data — it would need to be pulled automatically
- "It is useful as a snapshot... just not all of them, and it depends how much time I have"

### Floating Notes Panel — HIGH VALUE
- Current pain: duplicating portal tabs to have notes open alongside bills/budgets
- Sometimes just memorises the call and writes the note after — risking missed details
- "I'd love to start using that now" — strongest positive reaction after alerts
- Category selection on the fly is fine
- Saving to notes and then editing later (to add documents, tag people) is the right workflow

### Contact View — Show Primary Contact First
- When switching between client and authorised rep views, show the **primary contact first**
- Most clients have one primary authorised rep even if multiple exist
- Showing primary first = you know who to call without thinking
- Secondary contacts only needed if primary is unreachable
- "As long as we have the primary one on there, that's fine. Otherwise it's just going to start getting too bulky."

### Call Bridge — FUTURE STATE
- Positive reaction to the live transcript and auto-generated notes concept
- "That's really good, actually"
- Acknowledged as future state, not a current priority

### Identity Verification Prompt
- Raised unprompted: coordinators are **supposed to verify** callers (date of birth, address, name) on inbound calls but almost nobody does it
- "None of us do it. It's quite bad because we're supposed to."
- Reason: too busy, and they recognise client voices
- Suggested adding a verification prompt to alerts for inbound calls
- "It's one thing they're picking up on that we're not actually doing"

## Levi's Preferred Panel Order
1. **Alerts** — non-negotiable at top
2. **Personal context** (preferences section specifically)
3. **Conversation starters + talking points** (merged)

## Prioritisation

| Priority | Feature | Rationale |
|----------|---------|-----------|
| Critical | Alerts with deep-links | Prevents missed items; "best thing ever" |
| Critical | Management plan alerts | Currently buried in analytics; often forgotten |
| High | Floating notes panel | Solves the duplicate-tab / memorise-the-call problem |
| High | Merge conversation starters + talking points | Two panels doing one job |
| Medium | Call preferences in personal context | Prevents calling at wrong times |
| Medium | Primary contact shown first | Quick identification of who to call |
| Medium | Identity verification prompt | Compliance gap; easy win |
| Low | Interests / family | Nice snapshot but won't be maintained |
| Future | Call bridge + AI notes | Positive but not current priority |

## New Insight: Conversation Difficulty Scripts
- New coordinators lack scripts/frameworks for difficult conversations (overspends, fees, hostile callers)
- Levi created an informal word doc to fill this gap
- Opportunity: could the "conversation starters" panel include **guided prompts** for specific conversation types, not just personal icebreakers
- Levi offered to share the handling difficult conversations document and her own word doc as source material
