---
title: "Notion Nora - Design Rationale"
description: "Design rationale for both Relationship Intelligence mockup variations"
---

# Design Rationale: Notion Nora

## Design Brief

**North Star:** "I know this person before I pick up the phone."

Both variations apply Notion's "everything is a block" philosophy to the Relationship Intelligence panel. The core challenge is presenting personal context, operational status, touchpoint history, and conversation prompts in a way that feels warm and approachable rather than clinical.

---

## Variation A: Block Dashboard

### Concept
A full-width, vertically scrollable page within the package tab. Each section is a distinct block that can be toggled open/closed and (conceptually) reordered. Information flows top-to-bottom in priority order:

1. **Touchpoint banner** (urgency awareness)
2. **Conversation prompts callout** (prep the coordinator)
3. **Personal context blocks** (know the person)
4. **Operational summary metrics** (know the situation)
5. **Important dates** (upcoming events)
6. **Quick actions bar** (take action)

### Why This Works

- **Information hierarchy matches the call workflow.** Before picking up the phone, a coordinator needs: (1) when did we last talk? (2) what should I mention? (3) who is this person? (4) any operational issues? The vertical layout follows this exact sequence.
- **Toggle sections prevent overwhelm.** A coordinator seeing Margaret for the first time gets the full picture; a coordinator who calls her weekly can collapse "Personal Context" and focus on the operational summary and prompts.
- **Emoji-keyed property blocks** make scanning instant. The gardening tomato, the football, the family icon, the clock -- each block is identifiable without reading the label.
- **Callout block with subtle pulse animation** draws attention to conversation prompts without being intrusive. This is the block that makes the "I know this person" moment happen.
- **Metric cards** provide at-a-glance operational status. The colour-coded badges (amber for attention, green for clear, teal for active) let the coordinator assess risk in under 2 seconds.

### Trade-offs

- **Vertical scroll required.** All information is below the fold in a linear layout. Coordinators must scroll to see everything, which could slow down power users who want everything visible at once.
- **Less spatial grouping.** Compared to a board/column view, the vertical layout does not show categories side-by-side. Cross-referencing personal context with operational data requires scrolling between sections.
- **Block reordering is conceptual.** The drag handles suggest reorderability but would require JavaScript implementation; in production this becomes a personalisation feature that adds complexity.

---

## Variation B: Database-Style View

### Concept
Relationship Intelligence presented as a Notion-style database with two switchable views:

1. **Board view** (default): Kanban-style columns grouping cards by category -- Personal, Operational, Touchpoints, Dates & Reminders.
2. **Timeline view** (toggle): Chronological list showing all events, contacts, and upcoming dates on a vertical timeline.

Both views share a persistent conversation prompts banner at the top.

### Why This Works

- **Board view enables spatial scanning.** Four columns visible simultaneously means a coordinator can assess personal context, operational status, recent touchpoints, and upcoming dates in a single viewport without scrolling.
- **Cards with inline property chips** feel like a living database. Each card has tags (`interest`, `sport`, `preference`, `needs-attention`, `incident`) that make filtering and categorisation intuitive.
- **Timeline view provides temporal context.** When a coordinator needs to understand the history of interactions (not just the last one), switching to timeline shows the full chronological picture, including upcoming events like the birthday and care plan review.
- **The view toggle** respects different coordinator workflows. Some prefer the categorised overview (board); others prefer the chronological narrative (timeline). Both views show the same underlying data.
- **Conversation prompts banner** persists across both views, ensuring the "before you call" context is always visible regardless of which view is active.

### Trade-offs

- **Horizontal scrolling on smaller screens.** Four board columns at 288px each require approximately 1200px of content width. On smaller laptops, the rightmost column may be partially hidden.
- **Card density can feel overwhelming.** With 4 columns and 3-4 cards each, the board view shows ~15 cards simultaneously. Some coordinators may find this visually noisy.
- **Dual views add cognitive load.** The coordinator must learn two views and decide which one to use. This is a power-user feature that may confuse less tech-savvy staff.
- **Less prominent metric display.** Unlike Variation A's large metric cards (the "2 bills on hold" with big numbers), the board view treats metrics as regular cards, which may reduce their visual urgency.

---

## Comparison: Block Dashboard vs Database View

| Dimension                | Variation A (Block Dashboard) | Variation B (Database View) |
|--------------------------|-------------------------------|-----------------------------|
| **Information density**  | Lower (progressive disclosure)| Higher (all visible at once) |
| **Scanning speed**       | Slower (vertical scroll)      | Faster (spatial layout)      |
| **Learning curve**       | Lower (simple scroll + toggle)| Higher (view switching)      |
| **Personalisation**      | Block reordering              | View switching + filtering   |
| **Call prep workflow**    | Stronger (linear top-to-bottom)| Good (banner + board scan)  |
| **History exploration**   | Weaker (dates section only)   | Stronger (timeline view)    |
| **Mobile/tablet**         | Better (single column)        | Worse (needs horizontal space)|
| **Warmth/approachability**| Higher (spacious, editorial)  | Moderate (denser, app-like)  |

## Comparison: Block/Database vs Sidebar Pattern

Both Notion-inspired variations place Relationship Intelligence as a **full tab within the package profile** rather than a sidebar panel. This is a deliberate choice:

- **Pro:** Full-width gives breathing room for all context blocks, avoids cramming data into a narrow sidebar.
- **Pro:** Tab placement makes RI a first-class feature, not an afterthought bolted onto an existing view.
- **Con:** Coordinators must navigate to the tab before calling, rather than seeing context alongside the default package view.
- **Con:** If the coordinator is on the Services or Budget tab when a call comes in, they need an extra click to reach relationship context.

A potential hybrid: keep the full tab for detailed editing/exploration, but surface a **condensed RI summary** (last touchpoint + top conversation prompt) in the package header or as a collapsible sidebar on other tabs.

---

## Recommendation

**Variation A (Block Dashboard)** is better suited for the primary use case of "prep before calling" due to its linear, priority-ordered layout and stronger information hierarchy. The toggle sections and callout block create a warm, focused experience.

**Variation B (Database View)** is better suited for coordinators who manage many clients and need to quickly scan across categories, or who want to explore touchpoint history. The timeline view is a particularly strong addition for understanding relationship trajectory.

A production implementation could combine both: start with Block Dashboard as the default "Relationship" tab experience, and offer a "View as Board" or "View Timeline" toggle for power users who want the database-style layout.