# Notion Nick -- Rationale: Why Notion Patterns Work for OHB

## The Core Thesis: Everything Is a Database

The OHB cockpit is fundamentally a **multi-database workspace**. Bills, reasons, suppliers, line items, communications -- these are all structured records with properties, relations, and statuses. Notion's paradigm of "everything is a database with flexible views" maps almost 1:1 to the bill processing domain.

---

## Why Each Pattern Fits

### 1. Database Views Eliminate Context Switching

Bill processors handle 5-6K bills/day. They need different perspectives on the same data depending on the task at hand:

- **Table view** for scanning and triaging -- maximum information density, sort by urgency
- **Board view** for queue management -- see at a glance how many bills sit in each Comms Type or Cadence Day bucket
- **Timeline view** for cadence tracking -- visualise when Day 3/7/10 follow-ups are due

Instead of building three separate screens, Notion's view switcher gives processors **one database, many lenses**. The toggle is instant, the filters carry over, and the mental model stays consistent: "I'm looking at the same bills, just arranged differently."

### 2. Inline Editing Matches the Speed Requirement

At 5-6K bills/day, every extra click costs time. Notion's inline property editing means:

- Click a status cell, pick from a dropdown -- no modal, no page navigation
- Click a department cell, reassign -- instant
- Click an amount, correct it -- direct manipulation

This "edit where you see" model eliminates the traditional pattern of "click row -> open form -> find field -> edit -> save -> go back to list." For high-volume processing, this difference in interaction cost is significant.

### 3. Linked Databases Make Multi-Issue Tracking Natural

The OHB flow's key innovation is tracking **multiple reasons per bill** with parallel departmental routing. Notion's relation + linked database pattern handles this elegantly:

- The **Reasons database** is a standalone entity with its own properties (status, department, diagnosed by, resolution notes)
- Each reason **relates to** a bill via a relation property
- The Bill Edit IDE's right panel is a **linked view** of the Reasons database, filtered to the current bill
- The Department Queue is another **linked view** of the same Reasons database, filtered by department

One source of truth, many views. When a Care team member resolves a reason in the Department Queue, the Bill Edit IDE's checklist updates immediately. No sync logic, no stale data.

### 4. Toggle Blocks Manage Information Density

Bill processors need access to documents, notes, activity history, and line items -- but not all at once. Notion's toggle blocks let us:

- **Collapse** sections the processor doesn't need right now (Documents, Activity)
- **Show count badges** on collapsed toggles ("Notes (3)") so they know what's there without opening
- **Expand** on demand when investigating a specific issue

This pattern keeps the Bill Edit IDE's left panel scannable even when a bill has extensive history. The processor controls their own information density.

### 5. Filter Pills Make the Invisible Visible

A critical UX risk in bill processing is **not knowing what you're NOT seeing**. If a processor has filtered to "Department = Care" and forgets, they might miss Compliance issues. Notion's filter pill pattern solves this:

- Every active filter is a **visible pill** above the data: `Department is Care` | `Status is not COMPLETE` | `x`
- Removing a filter is one click on the `x`
- The processor always knows their current lens

For the Bills Index and Department Queue, this pattern prevents dangerous blind spots in high-volume processing.

---

## Why Notion Over Other Paradigms for This Problem

| Concern | Notion's Answer |
|---------|----------------|
| 5-6K bills/day throughput | Inline editing + keyboard navigation = minimal interaction cost |
| Multiple views of same data | View switcher with independent filters/sorts per view |
| Multi-issue per bill | Relations + linked database views |
| Cross-department routing | Same Reasons database, different filtered views per department |
| Information overload | Toggle blocks + collapsible sections + filter pills |
| Status visibility | Property pills with colour coding (traffic light) |
| Batch operations | Multi-select rows + bulk property edit |

---

## Design Principles Applied

1. **Direct manipulation over modals** -- Edit in place, not in popups (except for the Reason detail which warrants a focused view)
2. **Progressive disclosure** -- Show summary, expand for detail (toggle blocks, hover cards)
3. **Visible state** -- Filter pills, status pills, count badges -- never hide the current context
4. **One database, many views** -- Bills table = Bills board = same data, different arrangement
5. **Linked not copied** -- Reasons exist once, appear everywhere they're relevant
