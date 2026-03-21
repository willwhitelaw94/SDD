---
title: "Design Discussion: Persistent Panel / Draggable Sidebar Concept"
date: 2026-03-05
participants: Ed King + designer colleague
context: "Recorded after the care coordinator interview. Discussion about how to implement the RIN panel in the Portal UI."
---

# Design Discussion: Persistent Panel / Draggable Sidebar Concept

## Context

This conversation was captured at the tail end of the user research recording. Ed and a designer colleague discussed the emerging concept for how to surface RIN information in the Portal, based on what they'd just heard from Levi and the junior care partner.

## Key Takeaways

### The Panel Concept

- **Persistent right-hand sidebar** that stays visible across all package tabs
- Panel would contain relationship intelligence (personal/social info) and operational context
- Could have **tabs within the panel** to flip between:
  - Operational stuff (bills, budget alerts, overdue items)
  - Conversation/social info (personal context, talking points)
  - A "full ad script" that links together the difficult parts of the conversation
  - Notes — a persistent notepad that stays open while navigating

### Draggable / Dismissable

- The panel should be **draggable** — user can move it, tuck it away, bring it back
- "Not too invasive" — they acknowledged the Portal already has a right sidebar and the package content area, so the panel needs to coexist without overwhelming the layout
- Concept: push-in bars from the side that can be triggered and dismissed
- User could "move it over for a bit, go to Bills and do the bill processing, just tuck it over"

### Connection to Check-In Work

- There's a separate check-in feature being designed that involves:
  - Incidents getting added to a check-in note automatically
  - When on a call, the coordinator can go through questions with context pre-populated
- The designer noted this check-in work "will involve relationship stuff too" — the two features should be connected

### Talking Points as Ticked Items

- Suggested talking points could be **checkable** — "people like a done button"
- Points could be triggered from notes, incidents, or operational events (e.g. "you had that fall the other week — how's it going?")
- Mix of system-generated and user-added talking points

### Storybook / Component Architecture

- Brief mention of building the panel as common components in Storybook
- Referenced the recently merged CommonFundingBadge as an example of the component-driven approach
- Components would be reusable blocks that the Portal pulls in to render things

## Notes on the Notes Uplift

- Brief mention of an existing "notes uplift" project — unclear if the persistent notepad concept lives there or in RIN
- Someone (Will?) has done some work on it already
- They discussed whether the two efforts should be combined

## Design Implications

1. **The panel is not just RIN — it's a multi-purpose persistent workspace** (relationship intelligence + notes + operational alerts). Scope this carefully.
2. **Draggable/dismissable is important** to avoid overwhelming an already complex layout.
3. **Talking points should be actionable** (checkable items, not just static text).
4. **Coordinate with the check-in feature** — the two share data and UX patterns.
5. **Build as Storybook components** for reusability across the Portal.
