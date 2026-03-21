---
title: "HubSpot Hannah — Design Rationale"
---

# HubSpot Hannah — Design Rationale

**Student:** 5 — HubSpot Hannah
**Paradigm:** HubSpot CRM
**Application:** Lead Essential (LES) — CRM for sales agents during phone calls

---

## Why HubSpot Patterns for a CRM

HubSpot is a CRM, and TC Portal's Lead Essential is a CRM. The mapping is not metaphorical — it is structural. HubSpot has spent fifteen years iterating on the exact problem LES needs to solve: how do you give a person on the phone everything they need to understand a contact, record what happened, and move to the next action, without making them navigate through multiple screens?

The critical design philosophy HubSpot embodies is "CRM that works the way salespeople think." Salespeople think in terms of people (who am I talking to?), actions (what should I do?), and pipeline (where is this going?). HubSpot's three-column layout maps directly to these mental models: identity on the left, actions and history in the middle, connections on the right. Every other pattern — saved views, pipeline boards, task queues — serves one of these three mental frames.

For TC Portal's aged care context, the mapping is direct:
- **People** — Elderly Australians and their families navigating aged care for the first time. The "About this lead" panel answers: who is this person, what do they need, how do we reach them?
- **Actions** — Phone calls, assessments, referrals, follow-ups. The activity timeline and task queues answer: what happened, what's next?
- **Pipeline** — The journey from Pre-Care inquiry to Active consumer with an allocated package. The pipeline board answers: where is this lead in the process, what's blocking progress?

---

## Pattern Mapping

### 1. Three-Column Contact Record --> Comprehensive Lead Context

**HubSpot Pattern:** The three-column layout with properties (left), content/activity (middle), and associations (right). Quick actions bar at the top of the left sidebar. Inline editing on property values. Collapsible property cards. Independent scroll on each column.

**LES Application:**

The lead profile page is the primary workspace for agents during phone calls. The three-column layout provides:

- **Left sidebar** becomes the "lead identity" panel. The quick actions bar (Call, Note, Task, Meeting) maps to the agent's most frequent mid-call actions: log a note about what the caller just said, create a follow-up task, or schedule a callback. These actions must be accessible without scrolling — the quick actions bar ensures they are always at the top of the viewport. Below the actions, property cards group information logically: "About this lead" (demographics), "Lead Details" (source, intent, TC number), "Care Needs" (service requirements, funding, ACAT status). The inline edit pattern — hover to reveal pencil, click to edit in place — means the agent can correct a phone number or update a Medicare number during the call without opening a separate edit form.

- **Middle column** becomes the "activity and context" hub. The Overview tab shows the journey stage progress bar, data highlights (days in stage, last contact, profile completion), recent communications, and upcoming tasks. The Activities tab shows the full chronological timeline. The Notes tab filters to just agent notes. This tab structure means the agent starts on Overview for orientation ("what's the state of this lead?"), switches to Activities if they need to investigate history ("what happened last week?"), and uses Notes for focused context review ("what did the previous agent write?").

- **Right sidebar** becomes the "connections" panel. Associated Consumer record (if the lead has been converted), Referral Source organisation, and Attachments (ACAT letter, consent form, referral documents). During a call, an agent might need to check whether the ACAT assessment letter has been uploaded — the right sidebar answers this without leaving the lead profile.

**Why it works for phone calls:** The three-column layout means the agent never needs to navigate away from the lead profile during a call. Identity, history, and connections are all visible simultaneously. The quick actions bar means "I need to write a note about what they just said" is a single click away, not a menu navigation. Independent column scrolling means the agent can scroll through the activity timeline while the lead's phone number remains visible in the left sidebar.

---

### 2. Activity Timeline with Filtering and Pinning --> Activity Tracking

**HubSpot Pattern:** Reverse-chronological activity feed with type icons, colour coding by type, filter toggles (All, Emails, Calls, Notes, Tasks, Meetings), pinned activities at the top, and inline activity logging form always visible above the feed.

**LES Application:**

The activity timeline is the audit trail and the handover mechanism. When Agent A transfers a lead to Agent B, the timeline is how Agent B understands context. HubSpot's patterns support this directly:

- **Type filtering** lets agents focus on what matters for the current call. An agent picking up a transferred lead can filter to "Notes" to read Agent A's observations, or "Calls" to see previous contact attempts and outcomes. In aged care, where leads might span weeks as families navigate ACAT assessments, the ability to filter by type cuts through timeline noise.

- **Pinned activities** solve the "critical context" problem. A pinned note reading "Caller is the daughter, not the care recipient — address as Mrs. Williams, her mother is Margaret" stays visible at the top of the timeline regardless of how many subsequent interactions have been logged. In aged care, where cultural sensitivity and family dynamics are paramount, pinned context prevents agents from making awkward or harmful mistakes on follow-up calls.

- **Inline activity logging** means the agent records interactions during or immediately after the call. The "always visible" logging form — with tabs for Note, Call, Task — eliminates the friction that causes agents to defer logging and then forget details. In a high-call-volume environment, even 10 seconds of navigation to find a "log activity" button results in abandoned logging. HubSpot's pattern reduces this to zero navigation.

- **Type icons with colour coding** create a visual rhythm in the timeline. An agent scanning the feed can see at a glance: "two calls (green), then a note (yellow), then a task created (orange), then another call (green)" — the pattern of interaction is visible before reading any text. This is particularly useful for team leaders reviewing an agent's activity on a lead during coaching sessions.

---

### 3. Saved Views with Column Customisation --> Pipeline Management

**HubSpot Pattern:** Named view tabs with private/team/everyone visibility, summary metrics bar above the table, configurable columns with drag-and-drop reordering, inline editing in table cells, row hover preview slide-out, and filter state saved per view.

**LES Application:**

The leads list view is where agents start their day and where team leaders monitor pipeline health. HubSpot's saved views pattern maps to several distinct workflows:

- **Named views as workflow tabs.** "All Leads" is the universal starting point. "My Leads" filters to the current agent's assigned leads — this is the agent's personal worklist. "Needs Follow-up" shows leads where the last contact was more than X days ago — this is the proactive outreach list. "New Today" shows leads created in the last 24 hours — this is the triage queue. Each view tab eliminates a filter-build step. An agent arriving for their shift clicks "My Leads" and sees their workload instantly.

- **Summary metrics bar** provides team-level awareness. "Total Leads: 247" answers "how big is the pipeline?" "Contacted Today: 18" shows team productivity. "Avg Days in Stage: 4.2" flags bottlenecks (if leads are sitting too long at a particular stage, this number rises). "Conversion Rate: 23%" is the outcome metric. These four numbers give a team leader a complete pipeline health check in one glance — no report required.

- **Column customisation per view** means each tab can surface different data. The "Needs Follow-up" view might show "Last Contact" and "Days Since Contact" prominently, while "New Today" shows "Lead Source" and "Referral Source" to help with initial triage. This prevents the "universal table with 20 columns" problem where every view shows every field and nothing stands out.

- **Row hover preview** is critical for the "scan and triage" workflow. A team leader reviewing the "Needs Follow-up" view can hover over a lead to see a condensed profile — recent notes, current status, assigned agent — without opening the full record. This allows rapid assessment: "This lead was contacted yesterday, skip. This one hasn't been called in 5 days, investigate." The preview slide-out brings HubSpot's three-column information density to the list view context.

---

### 4. Deal Pipeline Board with Stage Requirements --> Customisability and Data Quality

**HubSpot Pattern:** Kanban columns per pipeline stage, drag-and-drop cards between stages, modal with required and optional fields triggered on stage transition, win probability per stage, automation notes explaining post-transition effects, and disabled submit until requirements are met.

**LES Application:**

The journey stage transition is the highest-stakes interaction in LES. Moving a lead from "Pre-Care" to "ACAT Booked" means the lead has been assessed and an ACAT appointment has been scheduled. Moving to "Allocated" means a care package has been assigned. Each transition carries different data requirements and different downstream effects.

HubSpot's stage requirements pattern enforces data quality at the moment of transition:

- **Required fields per stage** prevent "empty" transitions. An agent cannot move a lead to "ACAT Booked" without entering the ACAT assessment date. They cannot move to "Allocated" without specifying the allocated package type and coordinator. This gating ensures that every lead at a given stage has the minimum data needed for the next step in the care journey. Without gating, pipeline reports become unreliable — "We have 12 leads at Allocated" means nothing if 8 of them don't have a package assigned.

- **Suggested fields** encourage thoroughness without blocking progress. When moving to "Approved", the required field might be "Approval Date", while suggested fields include "Approval Level" and "Package Budget". The agent can proceed without the suggested fields, but their presence in the modal reminds the agent that this information will be needed eventually.

- **Stage probability indicator** provides pipeline weighting for forecasting. "Pre-Care: 10% likelihood" vs "Allocated: 60% likelihood" gives team leaders a weighted pipeline view. In aged care, this translates to resource planning: "We have 8 leads at Allocated (60%), so we likely need 4-5 package coordinator assignments in the next two weeks."

- **Automation notes** ("Moving to Allocated will assign default package coordinator") set agent expectations. The agent knows what will happen downstream before confirming the transition. This reduces confusion and support requests ("Why was a coordinator assigned? I didn't do that.").

- **The mini kanban board** at the top of the wizard provides pipeline context. The agent sees all 6 stages with counts: Pre-Care (45) | ACAT Booked (12) | Approved (8) | Allocated (3) | Active (2) | Converted (67). The current lead's position is highlighted. This contextual awareness helps agents understand where this lead fits in the broader pipeline — useful for prioritisation decisions.

---

### 5. Task Queues for Sequential Processing --> Operational Efficiency

**HubSpot Pattern:** Named task queues, sequential processing with auto-advance, full contact context shown alongside the current task, "Complete/Skip/Reschedule" actions, and progress indicator showing position in queue.

**LES Application:**

Task queues address the most significant operational inefficiency in lead management: the gap between "knowing what to do next" and "doing it." Without queues, an agent finishes a call, returns to the leads list, scans for the next lead to contact, opens the profile, reviews context, and then makes the call. That's 4-5 navigation steps and 30-60 seconds of orientation time between every productive interaction.

HubSpot's task queue pattern collapses this into zero navigation:

- **Morning queue creation.** A team leader creates a queue: "Day's callbacks" containing 25 leads that need follow-up calls today, ordered by priority. The agent clicks "Start queue" and enters a focused execution mode.

- **Auto-advance with context.** After completing a call (logging the outcome), the next lead's profile automatically slides into view. The agent sees the lead's name, phone number, recent activity, and any pinned notes — all pre-loaded. They pick up the phone immediately. No list scanning, no profile loading, no context review delays.

- **Skip and reschedule.** If a lead doesn't answer, the agent clicks "Skip" (or logs "No answer" and completes) and moves to the next. "Reschedule" pushes the lead to a later queue. This keeps the agent in flow — they never have to decide what to do next.

- **Progress visibility.** "Task 7 of 25" gives the agent a sense of accomplishment and a sense of remaining workload. It also gives the team leader real-time visibility: "James is on task 18 of 25, he'll finish his queue by 3pm."

For TC Portal's aged care context, task queues are particularly valuable because the call-back cadence is critical. Elderly callers or their family members expect timely follow-up. A missed callback window can mean the family goes to a competitor provider. The queue ensures callbacks happen in priority order without relying on the agent to remember or to scan a list.

---

## Summary: HubSpot Patterns Applied to LES

| LES Requirement | HubSpot Pattern | Key Benefit |
|----------------|----------------|-------------|
| Lead profile during phone calls | Three-column contact record with quick actions | Complete context visible simultaneously — identity, history, connections |
| Interaction history and handover | Activity timeline with filtering and pinning | Scannable history with critical context pinned at top |
| List view and pipeline monitoring | Saved views with metrics bar and column customisation | One-click workflow views with quantitative pipeline health |
| Journey stage data quality | Pipeline board with conditional stage requirements | Enforced data completeness at transition points |
| Agent productivity and call throughput | Task queues with auto-advance and pre-loaded context | Zero navigation between productive interactions |

**Core HubSpot philosophy applied to LES:** Build a CRM where the agent never has to think about navigation — every piece of information and every action is visible from where they already are. The interface moulds itself to the agent's current task through saved views, contextual sidebars, and sequential queues, rather than requiring the agent to mould their workflow to the interface.
