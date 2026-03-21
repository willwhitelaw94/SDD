---
title: "User Research: Care Coordinator — Prototype Walkthrough"
date: 2026-03-09
participant: Care Coordinator (name unknown)
role: Care Coordinator
interviewer: Ed King
context: "In-person walkthrough of the RIN Figma prototype with a care coordinator to gather feedback on proposed panels and features"
---

# User Research: Care Coordinator — Prototype Walkthrough

## Profile
- **Role**: Care Coordinator
- **Caseload**: References ~30 calls/day
- **Context**: Shown the RIN prototype in Figma and asked for reactions to each panel

## Key Quotes

> "I like the alerts. My favourite."

> "I don't want to talk about your gardens for 30 minutes... my main job is to make it effective."

> "If we have our alerts, whether there's two things missing or one thing missing, then we can have something to talk about and then we can always steer it back."

> "Talking points, I don't feel valid, because yes, there's conversation starters, that's great to start the conversation... but if we keep going about talking points about their garden or whatever, then we're actually just going to go off topic and not talk about work."

> "If we have the starter conversation where we can go into, you know, how are you, what have you been doing, etc. and then say, I was just calling due to XYZ to touch base with you, then it's less like... I don't want to talk about your gardens for 30 minutes."

> "I just want to know when the designated coordinator last contacted them."

> "Say that was a complaint through accounts. And I haven't contacted them in 20 days, but then this refreshes when accounts leave a note to one day — I'm like, okay, I contacted this person yesterday. Without looking into it, I think it'd be better scoped to the coordinator leaving the note."

## Feedback by Panel

### Alerts Panel — HIGH VALUE
- Explicitly their **favourite** feature of the entire prototype
- Gives calls structure and purpose — "something to talk about"
- Wanted alerts for: management plans (MPs) overdue, check-ins coming up, bills on hold, active follow-ups
- Enables the pivot from personal opener to business: "I was just calling due to XYZ"

### Conversation Starters / Personal Context — USEFUL BUT RISKY
- Acknowledged as helpful for **opening** a call, especially for newer coordinators
- Strong concern about going off-topic when you have 30+ calls to get through
- Preferred pattern: brief personal opener → pivot to operational alerts
- Not seen as a "talking point" to dwell on — more of an icebreaker

### Last Contact Indicator — VALUABLE (with caveat)
- Liked the "18 days since last contact" concept
- **Must be scoped to the designated coordinator**, not any staff member
- If scoped to "anyone", a complaint call from accounts would misleadingly reset the counter
- Suggested: toggle between "anyone" and "designated coordinator" — but preference is coordinator-scoped

### Moveable / Collapsible Panels — WELL RECEIVED
- Liked the ability to reorder and hide panels based on personal workflow
- "It's there when you need it, close it if you don't"
- New coordinators might keep personal context prominent; experienced ones might collapse it

### Floating Notes Panel — NICE BUT NOT ESSENTIAL
- Being able to write a note from any tab without navigating to Notes is appealing
- However, the recent save-and-return-to-edit update already partially solves this
- Still seen as beneficial for workflow continuity
- Draft persistence across tabs would be the key value-add

### Call Bridge / AI Transcription — FUTURE INTEREST
- Interest in the concept but trust/accuracy is the main concern
- "There'll be a lot of people that wait a minute and say it's completely wrong"
- Suggested feeding it the **note expectations checklist** as a format template
- Preferred workflow: AI generates draft → saves to notes → coordinator edits/enriches
- Not a current priority — acknowledged as future state

## Prioritisation (Coordinator's View)

| Priority | Feature | Rationale |
|----------|---------|-----------|
| High | Alerts panel | Gives calls structure; favourite feature |
| High | Last contact (coordinator-scoped) | Know when *you* last spoke to them |
| Medium | Conversation starters | Helpful opener, but must not dominate |
| Medium | Configurable panel layout | Personalise to experience level |
| Low-Medium | Floating notes panel | Useful but existing save-and-edit covers most of it |
| Future | Call bridge + AI notes | Exciting but needs accuracy/trust |

## Additional Context from Conversation

A separate conversation (with a technical stakeholder, likely Drew) touched on:
- **Rate plans and jobs**: Linking rate plans to jobs rather than directly to services — creates more flexibility but introduces edge cases around orphaned jobs if line items are deleted
- **Budget cloning**: Currently cloning is how budgets are "edited" (park old, clone to new) — raises immutability concerns and budget ID continuity
- **Budget activation and job posting**: Disagreement on when a job should be "posted" — at budget activation or when the coordinator begins recruiting. Technical limitation around scoping visibility to the right organisation at activation time
- **External coordinators**: Care partners, external coordinators, and clients can all technically use the platform to find jobs for budgets — visibility scoping is the key challenge
- These are architectural considerations for the broader budget/job integration, not directly RIN feedback
