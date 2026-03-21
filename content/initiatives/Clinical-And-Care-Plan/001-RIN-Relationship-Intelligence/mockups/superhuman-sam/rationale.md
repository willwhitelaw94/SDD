# Design Rationale: Superhuman Sam — Relationship Intelligence Panel

## Design Thesis

> Time-pressured coordinators don't need more information — they need the right information, instantly, with zero navigation overhead.

Superhuman Sam's two variations explore opposite ends of the speed spectrum: **ambient awareness** (split-pane, always visible) versus **focused preparation** (full-screen, immersive). Both share a keyboard-first philosophy that eliminates the mouse as a bottleneck.

---

## Variation A: Split-Pane Briefing

### What It Is

A Superhuman-style split-pane layout: caseload list on the left, relationship intelligence briefing on the right. Selecting a client instantly loads their full context. Keyboard hints visible at the bottom. Command palette available via Cmd+K.

### Why This Layout

The split-pane is borrowed directly from Superhuman's email interface because the workflow is structurally identical: **scan a list, pick an item, act on it, move to the next.**

For coordinators, the "list" is their caseload and the "item" is a client briefing. The split-pane lets them:

1. **Triage the caseload at a glance** — colour-coded "days since contact" indicators (green/amber/red) on every row let coordinators spot who needs calling without clicking
2. **Preview without committing** — hovering or arrowing through the list shows the briefing instantly. No page loads, no tab switches
3. **Maintain peripheral awareness** — while reading Margaret's briefing, the coordinator can still see their full caseload in the left pane. This prevents the tunnel vision that tab-based navigation creates

### Key Design Decisions

**Conversation prompts above operational data.** In most CRM-style tools, operational flags (bills, complaints) dominate the top of the page. Sam inverts this: conversation prompts sit at the top because *relationship-building is the primary task*. Operational data is secondary context that supports the conversation — it shouldn't lead it.

**Completion ring for context fields.** The "4 of 5 filled" indicator serves two purposes: (1) it tells the coordinator how much they know about this client, and (2) it creates a gentle Zeigarnik-effect pull to fill in the missing field. Over time, this nudges coordinators to build richer client profiles without a formal "data entry" workflow.

**Caseload compliance bar.** The bottom of the left pane shows a red/amber/green bar representing overall caseload health. This gives coordinators an instant read on their daily workload without counting individual rows.

**Command palette.** Rather than adding toolbar buttons for every action, all actions are accessible through Cmd+K. This keeps the interface visually clean while making functionality discoverable through search. A coordinator who doesn't know the shortcut for "View Care Plan" can type "care plan" and find it.

### Trade-offs

- **Narrow right pane.** At 280px, the left list is tight. On smaller screens this could feel cramped. We chose 280px because it fits a name + days-since indicator + one flag, which is the minimum viable row.
- **Dark mode only.** Sam leans into Superhuman's dark aesthetic. This works for focus and reduces eye strain during long sessions, but may feel unfamiliar to coordinators used to light interfaces. A light mode variant could be explored.
- **Information density.** The briefing packs personal context, operational flags, conversation prompts, and quick actions into a single scroll. For clients with extensive histories, this could become long. Collapsible sections would mitigate this.

---

## Variation B: Focus Mode

### What It Is

A full-screen, distraction-free "call prep" view. When a coordinator is about to call a client, this view strips everything away except what matters for that call: who the person is, what to say, what to watch out for, and a big "Start Call" button.

### Why Focus Mode

Split-pane is optimised for *triage and scanning*. But the moment a coordinator decides to call a specific client, the task changes from "which client?" to "what do I say?" Focus mode serves this shift.

The design borrows from Superhuman's "focus" view where a single email fills the screen with large typography and clear action buttons. Applied here:

1. **Client identity is huge** — the name and avatar are centred and large because the coordinator is mentally switching into "Margaret mode." The visual weight reinforces who they're about to speak with
2. **Conversation prompts are prominent** — full-sentence suggestions with numbered keyboard shortcuts (1/2/3) let the coordinator pick an opener instantly. These aren't small chips tucked into a sidebar — they're front and centre because they're the most valuable pre-call content
3. **Operational flags are secondary** — pushed below the fold in a compact grid. They're available if the coordinator scrolls, but they don't compete with the personal context. This is a deliberate hierarchy: relationship first, operations second

### Key Design Decisions

**Numbered prompt selection.** Each conversation prompt has a keyboard shortcut (1, 2, 3). This lets a coordinator scan, pick, and mentally rehearse an opening line in under 2 seconds. The prompts are written as full sentences (not keywords) because coordinators need to hear the words, not just see the topic.

**Last-contact progress bar.** The amber bar showing "18 of 25 days" creates urgency without panic. It's a visual countdown that answers the question "how overdue am I?" at a glance. At 25+ days, this would turn red with a pulse animation.

**Large completion ring.** The context completion ring is bigger than in Variation A because Focus Mode is also a natural moment to add missing context. After a call, the coordinator has fresh information ("Oh, Margaret mentioned she got a cat") — the empty slot with the "N" shortcut makes it effortless to capture.

**Auto-advance after logging.** When the coordinator finishes and logs the touchpoint, Focus Mode automatically loads the next client in their caseload. This creates a rhythm: briefing → call → log → next briefing. The coordinator stays in flow rather than returning to a list to manually pick the next client.

**Start Call button design.** The button is deliberately oversized with a gradient glow on hover. This isn't just aesthetic — it creates a clear "point of no return" that feels intentional. The coordinator is making a conscious decision to call, not accidentally clicking a link.

### Trade-offs

- **No caseload visibility.** In Focus Mode, the coordinator can't see their other clients. If they need to check another client mid-call, they have to exit. This is deliberate — focus means focus — but it requires a fast "Back to Caseload" path (Esc key).
- **Requires pre-generated prompts.** The conversation prompts are only useful if the system has data to generate them. For new clients with no context, Focus Mode would show empty prompt slots, which could feel hollow. The completion ring mitigates this by making it clear that adding context will improve future briefings.
- **Single-task assumption.** Focus Mode assumes the coordinator is doing call prep. If they're in a meeting reviewing client cases (not calling), Split-Pane A is more appropriate. The two variations serve different workflows, not different preferences.

---

## Shared Patterns Across Both Variations

### Keyboard Shortcuts

Both variations use the same shortcut vocabulary:

| Key | Action |
|-----|--------|
| J / K | Next / Previous client |
| L | Log Touchpoint |
| N | Add Context |
| V | View Incident |
| Cmd+K | Command Palette |
| Enter | Start Call (Focus Mode) |
| Esc | Back / Dismiss |
| / | Search caseload |

This consistency means skills transfer between modes. A coordinator who learns shortcuts in Split-Pane doesn't have to relearn them in Focus Mode.

### Speed Metrics

Both variations show a "time saved" indicator. This isn't vanity — it's feedback that reinforces the value of the tool. Coordinators who see "4 minutes saved this session" are more likely to adopt keyboard shortcuts because the benefit is quantified and visible.

### Days-Since Colour Coding

| Days | Colour | Meaning |
|------|--------|---------|
| 0–14 | Green | Healthy contact frequency |
| 15–24 | Amber | Approaching threshold |
| 25+ | Red + pulse | Overdue — compliance risk |

This colour system is consistent across the caseload list (Variation A) and the last-contact badge (both variations).

---

## When to Use Each Variation

| Scenario | Recommended |
|----------|-------------|
| Morning caseload triage | Variation A (Split-Pane) |
| Identifying who to call today | Variation A (Split-Pane) |
| Pre-call preparation | Variation B (Focus Mode) |
| Sequential call sessions | Variation B (Focus Mode) with auto-advance |
| Quick context lookup mid-meeting | Variation A (Split-Pane) |
| Training new coordinators | Variation A (keyboard hints visible) |

The ideal workflow uses both: triage in Split-Pane, then enter Focus Mode for the call sequence.
