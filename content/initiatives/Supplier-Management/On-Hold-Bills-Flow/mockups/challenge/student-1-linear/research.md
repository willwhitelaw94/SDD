# Linear App Pattern Research for OHB Bill Processor Cockpit

_Student: Linear Lisa | Paradigm: LINEAR APP | Motto: "Less, but better"_

---

## Pattern 1: Command Palette (Cmd+K)

**What it is:** A fuzzy-finder modal that surfaces every action in the app through a single search interface. In Linear, pressing `Cmd+K` opens a floating palette that searches across issues, projects, actions, settings, and navigation destinations simultaneously.

**How it works in Linear:**
- Launched via `Cmd+K` (macOS) or `Ctrl+K` (Windows/Linux)
- Fuzzy matching -- typing "tri" finds "Triage", "Trilogy", "Transition"
- Shows keyboard shortcuts inline next to each result, teaching users faster paths
- Scoped to current context (e.g., within a project, the palette prioritises project-specific actions)
- Recent actions appear first, building muscle memory over time

**Relevance to OHB:**
Bill processors handling 5-6K bills/day need sub-100ms access to any action. A command palette eliminates menu hunting: type "hold" to trigger On Hold, "rej" for Reject, "assign care" to route to Care department. The palette becomes the single entry point for all bill actions.

**Source:** [Linear's Delightful Design Patterns](https://gunpowderlabs.com/2024/12/22/linear-delightful-patterns), [Linear Docs](https://linear.app/docs/conceptual-model)

---

## Pattern 2: Keyboard-First Triage Navigation

**What it is:** Linear's triage workflow lets users process a queue of incoming issues using only the keyboard. Issues flow into a Triage inbox where they're accepted, declined, snoozed, or assigned -- all without touching the mouse.

**How it works in Linear:**
- `J` / `K` to navigate between issues in a list (vim-style)
- `G then I` goes to Inbox, `G then V` to current cycle, `G then B` to backlog
- Single-key actions: `A` to assign, `S` to set status, `P` to set priority, `L` to label
- Keyboard-only mode disables mouse to force keyboard learning
- Friendly banners appear when hovering over UI elements, showing the shortcut equivalent

**Relevance to OHB:**
Bill processors are repetitive-task workers -- same actions thousands of times per day. Keyboard triage means: `J` to next bill, `H` for On Hold, `R` for Reject, `A` for Approve, `1-5` for priority. Processing speed could double versus mouse-dependent workflows.

**Source:** [Linear Shortcuts](https://shortcuts.design/tools/toolspage-linear/), [Morgen Linear Guide](https://www.morgen.so/blog-posts/linear-project-management)

---

## Pattern 3: Minimal Chrome with Data Density

**What it is:** Linear's UI philosophy is "reduce visual noise while increasing information density." The 2024 redesign specifically targeted the sidebar, headers, tabs, and panels to remove unnecessary chrome while packing more data into less space.

**How it works in Linear:**
- Inverted-L navigation: sidebar (persistent) + top bar (contextual) -- no redundant nav layers
- Headers contain only: breadcrumb, title, and inline actions -- nothing decorative
- List views use compact rows with status icon, title, priority, assignee, and labels in a single 32px row
- LCH colour space ensures perceptually uniform colours across themes
- Inter Display for headings, Inter for body -- two fonts, maximum clarity
- Three theme variables (base, accent, contrast) replace 98 specific colour variables

**Relevance to OHB:**
Bill processors scan tables of 50+ bills at a time. Every pixel of visual noise slows pattern recognition. Linear's approach -- meaningful data only, no decorative elements -- directly applies: bill number, supplier, amount, status, issue count, cadence day. Each row is a scannable unit, not a card to parse.

**Source:** [Linear UI Redesign](https://linear.app/now/how-we-redesigned-the-linear-ui), [LogRocket: Linear Design](https://blog.logrocket.com/ux-design/linear-design/)

---

## Pattern 4: Status Indicators with Time-in-Status Tracking

**What it is:** Linear uses small, colour-coded circular icons to represent issue status. Hovering reveals cumulative time spent in each status, providing workflow analytics without leaving the current view.

**How it works in Linear:**
- Filled circles: Done, Cancelled (terminal states)
- Half circles: In Progress
- Empty circles: Backlog, Todo (not started)
- Dotted circles: Triage (awaiting decision)
- Colour coding: purple (triage), yellow (in progress), green (done), grey (backlog)
- Hover tooltip shows time-in-status breakdown
- Inline status change: click the indicator to cycle through states

**Relevance to OHB:**
The traffic-light checklist (BLOCKING/red, COMPLETE/green, WARNINGS/amber, IN_PROGRESS/blue, AWAITING/purple) maps directly to Linear's status indicator pattern. Each bill issue gets a small coloured dot; the aggregate gives an instant visual read of bill health. Time-in-status tracking maps to cadence day tracking (Day 0/3/7/10).

**Source:** [Linear Changelog - Status Tracking](https://linear.app/changelog/2024-03-20-new-linear-ui)

---

## Pattern 5: Contextual Panels and Split Views

**What it is:** Linear uses a multi-panel layout where selecting an item in a list opens a detail panel alongside it, maintaining context without navigating away. This "split view" pattern keeps the user oriented in their queue while drilling into specifics.

**How it works in Linear:**
- List view on left, detail panel on right -- proportions adjustable
- Detail panel shows: description, activity feed, sub-issues, relations, metadata
- Side panels for meta-properties (labels, project, cycle, estimate)
- Multiple view modes: list, board, timeline, split, fullscreen
- Panels collapse/expand to create focus mode
- Every entity has its own URL, enabling deep linking and tab management

**Relevance to OHB:**
The Bill Edit IDE's three-panel layout (docs/notes | bill canvas | checklist) is a direct application of this pattern. The processor stays in context: left panel for reference materials, centre for the bill being worked, right for the issue checklist. Panels collapse for focus mode -- hide docs when reviewing checklist, hide checklist when reading notes.

**Source:** [Linear UI Redesign](https://linear.app/now/how-we-redesigned-the-linear-ui), [Radix + Linear Case Study](https://www.radix-ui.com/primitives/case-studies/linear)
