# Rationale: Why Linear Patterns Work for the OHB Cockpit

_Student: Linear Lisa | "Less, but better"_

---

## The Core Argument

Bill processing is triage. Linear is the best triage UI ever built. The mapping is not metaphorical -- it is structural.

A Linear user opens their Inbox, sees a queue of issues, makes a decision on each one (accept, decline, assign, label, snooze), and moves to the next. A bill processor opens their queue, sees a list of bills, makes a decision on each one (approve, hold, reject, assign department, note), and moves to the next. The task shape is identical.

---

## Why Each Pattern Fits

### Command Palette = Universal Bill Actions

Bill processors currently navigate through menus, dropdowns, and multi-step modals to perform common actions. At 5-6K bills/day, even 2 extra seconds per bill costs 3+ hours daily.

Linear's `Cmd+K` pattern collapses all actions into one input:
- Type "hold" --> On Hold action
- Type "assign care" --> Route to Care department
- Type "INV-2024-0847" --> Jump directly to that bill
- Type "reject resubmit" --> Set communication type

This is not a nice-to-have. At scale, it is the difference between processing 500 bills/hour and 300.

### Keyboard Triage = Repetitive Task Velocity

Bill processing is the definition of repetitive knowledge work. The same 5-7 actions, thousands of times. Linear proved that keyboard-first UIs make power users 2-3x faster because:

1. **No targeting cost** -- pressing `A` is instant, clicking a 16px button requires visual search + motor targeting
2. **Muscle memory compounds** -- after 100 bills, the fingers know the shortcuts; the eyes never stop scanning data
3. **Reduced context switching** -- hands stay on keyboard, eyes stay on bill data, brain stays in assessment mode

The OHB cockpit maps: `J/K` for bill navigation, `H` for Hold, `R` for Reject, `A` for Approve, `1-5` for issue assignment.

### Minimal Chrome = Faster Pattern Recognition

Linear's 2024 redesign stripped away every pixel that was not actively communicating information. They moved from 98 colour variables to 3. They eliminated decorative borders, shadows, and backgrounds that separated content sections without adding meaning.

For bill processors, this matters because:
- **Scanning speed is proportional to signal-to-noise ratio** -- fewer decorative elements means the eye finds the status pill, the dollar amount, the issue count faster
- **Fatigue correlates with visual complexity** -- 8 hours of processing dense data is less exhausting when the UI is calm
- **Consistency reduces cognitive load** -- when every view uses the same minimal patterns, users never need to re-learn where to look

### Status Indicators = Traffic Light Checklist

Linear's status circles (filled, half, empty, dotted) map directly to the OHB traffic light system:

| Linear Status | OHB Status | Visual |
|---|---|---|
| Done (filled green) | COMPLETE | Green dot |
| In Progress (half yellow) | IN_PROGRESS | Blue dot |
| Triage (dotted purple) | AWAITING | Purple dot |
| Blocked (red) | BLOCKING | Red dot |
| Review needed | WARNINGS | Amber dot |

The aggregate view -- seeing 7 green, 1 red, 3 blue dots on a bill -- gives instant health assessment without reading any text. This is pattern recognition at its fastest.

### Split Panels = Bill Context Without Navigation

Linear's split view (list + detail panel) solves the primary bill processing pain point: needing to see multiple pieces of information simultaneously without navigating between pages.

The three-panel Bill Edit IDE applies this:
- **Left panel** (collapsible): Documents, notes, activity log -- reference material
- **Centre panel** (persistent): The bill itself -- supplier, recipient, line items, amounts
- **Right panel** (collapsible): Issue checklist -- the decision-support data

The processor never leaves the bill. They glance left for context, centre for data, right for status. Panels collapse when not needed, creating a focus mode that shows only what the current task requires.

---

## The Deeper Principle

Linear works because it respects a truth about professional tool users: **they do not want to be guided -- they want to be fast.**

Wizards, tooltips, step-by-step flows, and hand-holding UIs are for occasional users. Bill processors are daily power users who will spend thousands of hours in this cockpit. They need:

1. **Direct manipulation** -- click a status to change it, not "Open edit modal --> find status dropdown --> select new status --> save"
2. **Information density** -- show 50 bills on screen, not 10 with large cards
3. **Keyboard sovereignty** -- every mouse action must have a keyboard equivalent
4. **Predictable patterns** -- same interactions everywhere, no exceptions

Linear proved this approach works for software engineers managing issues. Bill processors managing invoices have the same needs, the same repetitive patterns, and the same demand for speed. The patterns transfer directly.

---

## What "Less, but better" Means Here

Every design decision follows one filter: **does this help process the next bill faster?**

- If a visual element does not aid decision-making, remove it
- If an interaction requires more than one step, compress it
- If information can be shown inline, do not hide it behind a click
- If a shortcut can replace a menu, implement the shortcut

The OHB cockpit is not a dashboard to admire. It is a professional instrument, like a trading terminal or an IDE. Linear showed that professional instruments can be beautiful precisely because they eliminate everything that is not essential.
