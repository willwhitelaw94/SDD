---
title: "Linear Lisa — Design Rationale"
---

# Linear Lisa — Design Rationale

**Paradigm:** Linear App
**Use Case:** Lead management CRM for sales agents handling inbound phone calls

---

## Why Linear Patterns Work for Lead Management

Linear was built for software teams who spend their entire day in the tool, triaging and updating work items under time pressure. Sales agents managing leads during phone calls face the same fundamental challenge: they need to find, read, update, and progress records quickly while their attention is split between the tool and a live conversation.

The core tension in both contexts is identical: **the interface must be fast enough that it becomes invisible** — an extension of the user's intent, not an obstacle between the user and their work.

Linear's design philosophy — speed over polish, keyboard-first interaction, minimal chrome, high information density — maps directly to the four design principles established for Lead Essential:

| LES Principle | Linear Pattern That Delivers It |
|---|---|
| Speed over polish | 100ms interaction target, no confirmation dialogs, inline property editing |
| Context without navigation | Peek preview, persistent sidebar, activity feed on detail view |
| Edit where you read | Click-to-set properties, inline title/description editing |
| Pipeline first | Status dot on every row, group-by-status views, board layout |

---

## Pattern-to-Use-Case Mapping

### 1. Command Palette → Agent Quick Actions During Calls

**The problem it solves:**
A sales agent is on the phone with a lead's family member. The lead mentions they have been approved for an ACAT assessment. The agent needs to update the Journey Stage, add a note, and potentially reassign the lead to a specialist — all while maintaining the conversation. They cannot afford to hunt through menus.

**Why Linear's pattern works here:**

- **`Cmd+K` for "Update Journey Stage"** lets the agent type a partial action name and execute it in under 2 seconds. No mouse required. No menu traversal. The agent's eyes stay on their conversation notes, not the UI.
- **Fuzzy matching eliminates memorisation.** An agent typing "approved" would match "Journey Stage: Approved", "Status: Made Contact", and any lead named "Approved Living" — surfacing the right action without requiring the exact menu path.
- **Shortcut discovery is built-in.** Every palette result shows its keyboard shortcut. After using `Cmd+K` to change status 5 times and seeing the `S` shortcut each time, the agent naturally graduates to the direct shortcut. This is self-training UX — no documentation or training sessions required.
- **Context-specific results.** When the agent has a lead open, the palette prioritises lead-specific actions (change stage, change status, add note, assign) over global navigation. The palette adapts to where the agent is, reducing result noise.

**For lead management specifically:**

| Agent Intent | Palette Search | Result |
|---|---|---|
| Update journey stage | "stage" or "journey" | Opens Journey Stage selector |
| Mark as contacted | "made contact" or "contacted" | Opens Made Contact wizard |
| Reassign to another agent | "assign" or agent name | Opens assignee selector |
| Add a call note | "note" or "add note" | Opens note input |
| Quick-create a new lead | "create" or "new lead" | Opens Quick Create modal |
| Find a specific lead | Lead name or TC number | Navigates to lead profile |

The palette becomes the agent's single entry point for everything. One shortcut to remember (`Cmd+K`), one interaction pattern (type and select), every action accessible.

---

### 2. Keyboard List Navigation + Peek → Pipeline Triage

**The problem it solves:**
A sales team leader starts their morning reviewing the pipeline. They have 47 leads assigned to their team in "Attempted Contact" status. They need to scan through them, identify which ones need follow-up today, and reassign 8 of them to a newly onboarded agent. This is a triage workflow — high volume, fast decisions, minimal per-item time.

**Why Linear's pattern works here:**

- **`J`/`K` navigation** lets the team leader move through the leads list without the imprecision of mouse scrolling. Each keypress moves exactly one row. The cognitive load of "aim cursor at tiny row" is eliminated.
- **`Space` for peek preview** is the critical enabler. The leader can scan the list at speed: highlight a lead, tap `Space`, see the lead's full context (stage, status, last contact date, notes, assigned agent) in a side panel — then `K` to move to the next lead and the panel updates instantly. This is dramatically faster than click-open-read-back-click-open-read-back.
- **`X` to select for batch action** builds a working set without interrupting the scan. The leader marks 8 leads for reassignment while continuing to review others. The selection persists across navigation — selected items show a subtle check indicator.
- **Bulk toolbar at the bottom** appears once any item is selected. The leader selects 8 leads, clicks "Assign" on the toolbar, selects the new agent, and all 8 are reassigned simultaneously. One action instead of 8 individual profile visits.

**Speed comparison for reassigning 8 leads:**

| Approach | Steps | Estimated Time |
|---|---|---|
| Traditional CRM (open each, edit, save, back) | 8 x 5 steps = 40 actions | ~4 minutes |
| Linear pattern (scan, select, bulk assign) | ~20 keystrokes + 1 bulk action | ~30 seconds |

This is not a marginal improvement — it is an order-of-magnitude efficiency gain that compounds across every triage session.

---

### 3. Issue Detail Layout → Lead Profile View

**The problem it solves:**
An agent opens a lead's profile during a phone call. They need to see the lead's current stage and status (pipeline context), personal details (who they are talking about), contact information (who they are talking to), and recent notes (what was discussed last time) — all without clicking through tabs or scrolling past irrelevant sections.

**Why Linear's pattern works here:**

- **Right-side properties sidebar** maps perfectly to the LES persistent sidebar. Linear puts structured metadata (status, assignee, priority, labels, dates) in a fixed right panel. For LES, this becomes: Journey Stage badge, Lead Status, Assigned Agent, TC Customer Number, email (with copy), phone (with copy), DOB, profile completion. These are the fields agents glance at constantly — they must be visible from any tab without scrolling.
- **Click-to-set property editing** eliminates edit mode toggles. In Linear, clicking "In Progress" on the status field immediately opens a dropdown — no "Edit" button, no form submission. For LES, clicking the Assigned Agent name in the sidebar immediately opens a searchable agent selector. Clicking the Journey Stage badge immediately opens the stage wizard. Every property is one click from being updated.
- **Left-side content area with activity feed** maps to the LES tabbed main area. Linear shows description + comments + activity in a scrollable content area. LES shows section cards (Overview tab) or timeline entries (Timeline tab) in the same structural position. The key insight: the content scrolls while the sidebar stays fixed. Independent scroll contexts mean the agent never loses their sidebar reference (stage, status, contact info) while exploring the main content.
- **Inline title editing** maps to section card inline expansion. Linear lets you click a title and edit it in place. LES section cards follow the ACRM pattern: click "Edit" and the card expands inline to show form fields. The conceptual pattern is identical — edit where you read, no navigation, no modal.

**Layout correspondence:**

| Linear Element | LES Element | Position |
|---|---|---|
| Issue title (editable) | Lead name + stage bar | Top of page |
| Properties sidebar | Identity + status sidebar | Right panel, fixed |
| Description + editor | Section cards (Overview tab) | Left panel, scrollable |
| Activity feed | Timeline entries (Timeline tab) | Left panel, scrollable |
| Comment thread | Notes section | Within timeline |
| Status dot + label | Journey Stage badge + Lead Status badge | Sidebar, top |

---

### 4. Filtering and Grouping → Pipeline Visibility

**The problem it solves:**
The Head of Sales needs to answer: "How many leads are in ACAT Booked stage with no contact in 7+ days?" A sales agent needs: "Show me only my leads that are in Made Contact status, sorted by last contact date." These are not one-off queries — they are daily pipeline views that each role returns to repeatedly.

**Why Linear's pattern works here:**

- **`F` to open filter menu** gives instant access to filter controls from the leads list. No clicking through a filter sidebar. No opening a "search" panel. One keypress, type the filter property, select the value. The filter bar updates immediately above the list, showing active filters as dismissible pills.
- **Composable filters with AND/OR logic** handle the multi-dimensional filtering that pipeline management requires. "Journey Stage is ACAT Booked AND Last Contact is more than 7 days ago AND Assigned Agent is me" — three filters composed incrementally, each narrowing the visible set.
- **Group by** turns a flat list into a pipeline view. Grouping by Journey Stage shows collapsible sections: Pre-Care (142), ACAT Booked (23), Approved (18), Allocated (7), Active (4), Converted (2). Each section header shows the count. This is the pipeline visualisation — not a separate chart or dashboard, but the list view itself reorganised to show distribution.
- **Saved views** solve the "I need this every morning" problem. The team leader saves "My Team — Stale Leads" (Assigned Agent is any of [team], Last Contact > 7 days, Status is not Lost). It appears in their sidebar. One click to access. No re-applying filters each day.

**Example saved views for LES:**

| View Name | Filters | Group By | Used By |
|---|---|---|---|
| My Active Leads | Assigned Agent = me, Status != Lost | Journey Stage | Agent |
| Stale Pipeline | Last Contact > 7 days, Status = Attempted Contact | Assigned Agent | Team Leader |
| New Uncontacted | Status = Not Contacted, Created < 48 hours | None (sorted by Created) | Agent |
| Hot Leads | Purchase Intent = Hot | Journey Stage | Team Leader |
| Lost This Month | Status = Lost, Changed Date = this month | Lost Type | Head of Sales |

Each view is a single click from the sidebar. The mental model is: **views are saved perspectives on the same data**, not different pages or reports.

---

### 5. Inline Status Transitions → Lead Status Updates Without Friction

**The problem it solves:**
An agent just finished a call. They need to update the lead's status from "Attempted Contact" to "Made Contact" with the relevant context (contact method, outcome, journey stage update). The current call ended 5 seconds ago and the next call starts in 15 seconds. There is no time for a 4-step wizard with loading states.

**Why Linear's pattern works here (with adaptation):**

Linear's pure approach — click status, select new status, done — is too minimal for LES. Lead status transitions carry mandatory context (contact method, lost reason, journey stage). But Linear's *philosophy* of frictionless transitions absolutely applies. The adaptation:

- **One-click to initiate.** Like Linear's status dot, the Lead Status badge in the sidebar or list view is directly clickable. One click opens the transition wizard — not a menu-to-select-status-then-open-wizard flow. The click *is* the intent declaration.
- **Minimal, focused wizard.** Linear teaches that every field you add to a transition is friction. LES status wizards should show only the mandatory fields for the selected transition, pre-filled with intelligent defaults where possible. "Made Contact" wizard: Journey Stage (pre-filled with current), Attribution (pre-filled if known), Purchase Intent (3-option selector — one click). Optional fields collapsed under a "More details" toggle.
- **Keyboard-completable.** Linear's `S` shortcut opens the status selector. For LES: pressing `S` opens the status dropdown, selecting "Made Contact" opens the wizard, `Tab` moves through fields, `Enter` submits. An agent who learns the flow can complete the entire transition without touching the mouse.
- **Instant visual feedback.** After submission, the status badge updates immediately, the sidebar reflects the change, and a toast notification confirms. No page reload. No navigation. The agent is ready for the next call.
- **No confirmation dialogs.** Linear never asks "Are you sure?" for status changes. LES should follow the same principle — the wizard itself is the confirmation. Once the agent fills in mandatory fields and submits, the change happens. Undo is available via timeline (add a correction note and revert status) rather than blocking the forward path with "Are you sure?" dialogs.

**Adaptation for mandatory fields (where LES differs from Linear):**

Linear has no mandatory fields per status transition. LES does (by spec). The reconciliation:

| Linear Principle | LES Adaptation |
|---|---|
| No modal for status change | Lightweight modal (not full-page wizard) — focused, fast |
| Single-click to change | Single-click to initiate the transition wizard |
| No mandatory fields | Mandatory fields shown upfront, pre-filled where possible |
| Instant save | Save on `Enter` or button click — no multi-step pagination |
| Undo via Cmd+Z | Undo via new status change (with required note for reversals) |

The key insight: **Linear-style speed is compatible with mandatory data capture** as long as the wizard is lean (3-5 fields, single screen, no pagination), pre-filled intelligently, and keyboard-navigable.

---

## Summary: Why Linear for Lead Management

Linear succeeds because it treats every interaction as a **cost to the user**. Every click, every modal, every loading state, every confirmation dialog is a tax on the agent's attention. In a CRM used during live phone calls, attention is the scarcest resource.

The five patterns above collectively deliver:

1. **Sub-2-second actions** — Command palette and keyboard shortcuts make every action accessible in 1-2 keystrokes.
2. **Zero context loss** — Peek preview and persistent sidebar keep pipeline context visible during navigation.
3. **Batch efficiency** — Keyboard multi-select and bulk toolbar make pipeline triage 10x faster than per-item workflows.
4. **Self-training UX** — The command palette teaches shortcuts by displaying them alongside actions. Agents accelerate naturally over time.
5. **Pipeline as a view, not a report** — Filtering and grouping turn the list view into a live pipeline visualisation, eliminating the need for separate dashboards.

These patterns do not require agents to learn a new paradigm. They are the same list-detail-sidebar patterns that every CRM uses — but executed with Linear's obsession for speed, density, and keyboard accessibility.
