---
title: "Rationale — Canvas Clara (Card Canvas / Kanban)"
student: Clara
pattern: Card Canvas / Kanban Board
date: 2026-03-10
---

# Rationale — Why Kanban for Feedback Records Management

## Core Argument

Complaint management is fundamentally a **workflow problem** — records move through defined stages from intake to closure. A Kanban board makes this workflow physically visible, turning an abstract process into a spatial map that coordinators can read at a glance.

## Why This Pattern Fits

### 1. Visual Stage Awareness

Every open complaint is visible on the board, slotted into its current stage column. A coordinator arriving at their desk can immediately see: "I have 3 records stuck in Triage, 2 in Investigation, and 1 ready for Resolution." No filtering, no clicking, no mental model-building required — the board IS the mental model.

Traditional list/table views require reading status values row by row. The Kanban board externalizes this cognitive work into spatial position.

### 2. Drag to Advance — Action Matches Intent

Moving a complaint from "Triage" to "Investigation" should feel as deliberate as physically moving a card across a table. Drag-and-drop provides this direct manipulation — the user's motor action mirrors the conceptual action. No "Change Status" dropdown, no modal confirmation for routine transitions.

For non-routine transitions (e.g., jumping from Triage to Closed), the board can enforce constraints — only adjacent columns accept drops, or a confirmation dialog appears for skip-stage moves.

### 3. WIP Limits Prevent Overload

Aged care coordinators juggle many responsibilities. A column showing "Investigation (4/3)" with a red header immediately signals overload — too many complaints are being investigated simultaneously, and quality will suffer. WIP limits are a built-in workload management tool that requires no extra reporting.

This is particularly relevant for Urgent-triaged complaints where response times are critical. If the Investigation column is at capacity, the team knows before accepting another.

### 4. Card Anatomy Serves Scanning

Each card displays exactly the information needed for triage decisions:
- **REF number** — unique identifier for conversation reference
- **Subject line** — 2-line max, enough context to recognize the complaint
- **Triage badge** — colored dot (red/orange/gray) for instant priority recognition
- **Assignee avatar** — who owns this record
- **Overdue indicator** — flame icon for time-sensitive records

This information density lets coordinators scan 20+ cards quickly without opening any of them.

### 5. Slide-Over Detail Preserves Context

When a coordinator clicks a card, the detail panel slides in from the right while the board remains visible (dimmed) behind it. This preserves spatial context — the user knows where this record sits in the workflow and can close the panel to return to the board without navigation.

Compare this to a full-page detail view where returning to the list requires a back-button and re-loading the board state.

### 6. Swimlanes for Grouping

The board can be grouped by:
- **Triage level** — swim lanes for Urgent/Medium/Standard, so urgent records always appear at the top
- **Department** — which team is handling each record
- **Type** — Complaint vs Remediation in separate lanes

This grouping adds a second organizational dimension without leaving the board view.

## Trade-offs Acknowledged

| Concern | Mitigation |
|---------|-----------|
| Board doesn't scale past ~50 visible cards | Filters reduce visible set; most coordinators handle 10-30 active records |
| Drag-and-drop is hard on mobile/touch | Touch targets on cards provide "Move to..." action menu as fallback |
| Complex record detail doesn't fit a card | Slide-over panel provides full detail; card is the summary only |
| Some users prefer table/list views | Board is the default, but a table toggle could be added later |

## Design Principles Applied

1. **Spatial > Textual** — Position on the board communicates status faster than reading a label
2. **Minimal clicks for common tasks** — Drag to advance, click to view, type to search
3. **Progressive disclosure** — Card shows summary, panel shows detail, tabs show depth
4. **Visual urgency** — Red borders, flame icons, and WIP warnings surface what matters
5. **Professional restraint** — TC brand colors, clean typography, no gratuitous animation
