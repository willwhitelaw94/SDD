---
title: "Timeline Tess — Rationale"
student: Timeline Tess
pattern: Vertical Timeline / Activity Feed
date: 2026-03-10
---

# Rationale: Why Timeline Patterns Work for Complaints

## The Core Insight

Complaints are inherently temporal events. A complaint is not a static record — it is a *story that unfolds over time*. From the moment someone raises a concern, through triage, investigation, and resolution, every action is an event with a timestamp and an author. The vertical timeline pattern honours this reality by making chronology the primary organising principle.

## Why This Pattern Fits

### 1. Complaints Are Event Sequences

Every complaint follows a narrative arc: creation, triage, assignment, investigation notes, action items completed, resolution. Staff already think in terms of "what happened when" — the timeline makes this mental model visible. Instead of jumping between tabs to piece together a complaint's history, the entire story reads top-to-bottom (or bottom-to-top) in one continuous feed.

### 2. Temporal Context Matters for Investigation

When investigating a complaint, coordinators need to understand the sequence of events: "The medication error was reported on the 15th, the pharmacy was contacted on the 18th, the family was updated on the 20th." A timeline makes causal relationships between events immediately visible. In a traditional form-based UI, this requires mentally reconstructing the timeline from scattered date fields.

### 3. The Index Feed Mirrors Email/Chat Mental Models

Care staff already work in feed-based interfaces all day — email inboxes, Slack channels, notification streams. A vertical feed of complaint cards with "Today / This Week / Earlier" grouping feels instantly familiar. There is no learning curve for the primary navigation pattern.

### 4. Expandable Cards Reduce Cognitive Load

The collapsed card (REF#, type, stage, assignee, time) provides enough context for scanning and triage. Staff can process 10-15 records visually without opening any. When they need detail, expanding in-place maintains spatial context — they do not lose their position in the feed. This is significantly faster than navigating to a detail page and back.

### 5. Event Type Filtering Enables Focused Work

A coordinator reviewing action items does not need to see every note and stage change. Filtering the timeline to "Action Items only" or "Notes only" transforms the same data structure into a focused task view. One UI pattern, multiple work modes.

### 6. Overdue Surfacing Is Natural

In a time-based feed, overdue items naturally demand attention by being "stuck" — they should have progressed but haven't. Surfacing them to the top with alert styling (pulsing red dots, flame icons) leverages the timeline's temporal nature rather than fighting against it.

## Design Advantages

| Advantage | How the Timeline Delivers |
|---|---|
| **Scanability** | Collapsed cards show summary; expand for detail |
| **Audit compliance** | Every event is timestamped and attributed |
| **Investigation support** | Chronological context visible at a glance |
| **Familiar mental model** | Feed-based UI matches email/chat patterns |
| **Flexible filtering** | Same timeline, filtered by event type |
| **Priority surfacing** | Overdue items rise to top naturally |

## Potential Limitations & Mitigations

- **Long timelines**: Records with 50+ events could become unwieldy. Mitigation: event type filtering and "show older" pagination.
- **Non-chronological tasks**: Some workflows need a kanban or table view. Mitigation: the timeline is the *detail* pattern; a table/list can coexist as an alternative index view.
- **Mobile responsiveness**: Timeline lines and dots need careful responsive handling. Mitigation: on mobile, the timeline line shifts to a simpler left-border treatment.

## Conclusion

The vertical timeline pattern is not just an aesthetic choice — it is a structural match for how complaints actually work. Every complaint is a story. The timeline tells that story clearly, chronologically, and completely.
