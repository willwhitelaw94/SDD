---
title: "HubSpot Hannah — Pattern Research"
---

# HubSpot Hannah — Pattern Research

**Student:** 5 — HubSpot Hannah
**Paradigm:** HubSpot CRM
**Focus:** Three-column contact record, activity timeline, saved views, deal pipeline, task queues

---

## Pattern 1: Three-Column Contact Record Layout

**Where it appears:** `app.hubspot.com/contacts/<portal-id>/record/<object-id>`

HubSpot's contact record page is the foundational pattern of the entire CRM. It divides the screen into three persistent columns that work together to give complete context without any navigation.

**Left Sidebar (~25% width)**

The left sidebar is the "identity and properties" panel. It starts with a contact header block: avatar (with initials fallback), full name, job title, and company name. Directly below the header is a **quick actions bar** — a horizontal row of icon buttons: Call, Email, Log Activity, Create Task, Schedule Meeting. Each icon is circular with a subtle border, and tapping any one opens an inline form or a slide-out panel — never a full page navigation. This bar is HubSpot's most distinctive UI element on the contact record, and it sits above the fold on every contact page, ensuring the most common CRM actions are always zero-scroll accessible.

Below the quick actions bar, the sidebar is divided into collapsible **property cards**. Each card has a header with a label (e.g., "About this contact") and a chevron to expand/collapse. Properties within a card display as label-value pairs in a compact two-column grid: label text left-aligned in muted grey, value right-aligned in default text colour. Hovering over any value reveals an inline edit pencil icon. Clicking the pencil transforms the value into an appropriate input field (text input, dropdown, date picker) right in place — no modal, no navigation. Pressing Enter or clicking outside saves immediately. This pattern makes editing feel like writing on a form, not "using software".

The property cards are **customisable per object type and per user**. Admins can configure which properties appear in which cards, and in what order. Individual users can add a "Pinned properties" section that shows only the fields they care about. This means a sales agent's left sidebar can look different from a service agent's left sidebar, even on the same contact record. The configuration happens through a "Customize" link at the bottom of the sidebar, which opens an overlay allowing drag-and-drop reordering and property selection from the full schema.

**Key properties always visible** regardless of customisation: Name, Email, Phone, Company, Contact Owner (the assigned agent), Lifecycle Stage, and Lead Status. These "core" properties are pinned at the top of the "About" card and cannot be hidden.

**Middle Column (~50% width)**

The middle column is the "content and activity" area. It has a tab bar at the top with tabs: **Overview**, **Activities**, **Emails**, **Calls**, **Tasks**, **Notes**, **Meetings**. The Overview tab is the default view and shows a curated summary (see Pattern 2 for the activity timeline detail). The content-type-specific tabs (Emails, Calls, etc.) filter the timeline to show only entries of that type. This filtering is HubSpot's alternative to a complex filter bar — rather than building a query, you click a tab.

The Overview tab typically shows:
- A **"Data Highlights"** card at the top: 3-4 key metrics displayed as large numbers with labels. These are configurable and can show things like "Last contacted: 3 days ago", "Total activities: 12", "Days since created: 45", "Lead score: 78".
- Below that, an **activity feed** showing the most recent interactions in reverse chronological order.
- Each activity entry has: a type icon (email, call, note, task, meeting) in a coloured circle on the left, a header line with the activity type and timestamp, the activity summary or body text, and metadata (who performed it, duration for calls, open/click status for emails).

**Right Sidebar (~25% width)**

The right sidebar is the "associations and context" panel. It shows cards for every related record type:
- **Companies** — linked company records with name and domain.
- **Deals** — associated deals with deal name, amount, stage, and close date. Shows a mini pipeline indicator.
- **Tickets** — support tickets with status badges.
- **Attachments** — uploaded files with filename, upload date, and quick preview.
- **Playbooks** — suggested scripts or checklists based on the contact's properties.

Each association card shows up to 5 items with a "View all" link to expand. Items within a card are clickable to navigate to that record. An "Add" button at the top-right of each card allows creating new associations. Cards can be collapsed independently.

**Why this pattern matters:**
The three-column layout eliminates context-switching. A sales agent on a phone call can see who they're talking to (left), what's happened recently (middle), and what else is connected (right) without ever changing pages. The quick actions bar ensures the most common follow-up actions (log a note, create a task) are always visible at the top of the sidebar, so the agent can act without scrolling. The property cards' collapse/expand behaviour means the sidebar can be dense without being overwhelming — agents expand the sections they need for their current conversation and collapse the rest.

---

## Pattern 2: Activity Timeline with Filtering and Pinning

**Where it appears:** The "Activities" tab on any CRM record (Contact, Company, Deal, Ticket).

HubSpot's activity timeline is the central nervous system of the CRM. It is where all interactions are recorded, viewed, and acted upon.

**Timeline Structure**

The timeline is a vertical feed displayed in the middle column. Each entry is a card with consistent structure:
- **Left rail:** A vertical line connecting entries, with circular icons at each node. Icon colour and shape indicate type: blue envelope for email, green phone for call, yellow notepad for note, orange checkbox for task, purple calendar for meeting. This visual encoding means agents can scan the timeline by colour to find specific interaction types.
- **Card header:** Activity type label, actor name ("Sarah Chen logged a call"), and relative timestamp ("3 hours ago"). An overflow menu (three dots) provides actions: Edit, Delete, Pin, Copy link.
- **Card body:** The content varies by type. Emails show subject, preview text, and open/click indicators. Calls show duration, outcome (e.g., "Connected", "Left voicemail", "No answer"), and recording link. Notes show the full text with Markdown-like formatting. Tasks show the task title, due date, and completion status.
- **Reactions/engagement:** Email entries show delivery, open, and click tracking with exact counts and timestamps. This is HubSpot's "engagement intelligence" — the agent can see if a prospect opened their email 3 times before calling back.

**Filtering**

Above the timeline, a filter bar provides two mechanisms:
1. **Activity type toggles** — A horizontal row of icon buttons matching the timeline types (All, Emails, Calls, Notes, Tasks, Meetings, etc.). These are toggle buttons — clicking "Calls" shows only call entries. Multiple types can be selected simultaneously (e.g., Calls + Emails). The "All" button is the default and shows everything.
2. **Team/Owner filter** — A dropdown that filters by "All users", "Me", or a specific team member. This answers "What did I do?" vs "What did anyone do?" for shared contacts.
3. **Date range** — A date range picker to narrow the timeline to a specific period.

The filter state is ephemeral — it resets when navigating away. This keeps the default "show everything" view as the starting point.

**Pinned Activities**

HubSpot allows users to **pin** specific timeline entries to the top of the feed. A pinned activity stays visible above the chronological feed, regardless of when it occurred. The pin action is available from the entry's overflow menu. Pinned entries display with a pin icon badge and a subtle background highlight.

Common use cases for pinning:
- A critical note about the contact's preferences or situation
- An important email thread that provides essential context
- A call recording where the contact expressed specific requirements

The pinned section shows up to 3 entries. If more are pinned, a "Show all pinned" toggle expands the section. Pinned status is per-user — what one agent pins doesn't change another agent's view.

**Inline Activity Logging**

At the top of the timeline (above the feed, below the filters), there's a persistent **"Log activity" bar**. It's a compact form with tabs for Note, Call, Email, Task, Meeting. Selecting a tab expands the bar into a contextual form:
- **Note:** Rich text editor with formatting toolbar.
- **Call:** Outcome dropdown (Connected, Left voicemail, No answer, Busy), Duration input, and note field.
- **Email:** Subject, body, recipient (pre-filled), and template picker.
- **Task:** Title, due date, type dropdown, assigned to, and priority.

This "always visible" logging form means the agent never has to navigate away from the timeline to record an interaction. They finish a call, click "Call" in the log bar, fill in the outcome, and the entry appears at the top of the timeline immediately.

**Why this pattern matters:**
The activity timeline with type filtering and pinning gives agents three levels of engagement with history: (1) the pinned entries for "must know" context, (2) the filtered view for "show me just the calls" investigation, and (3) the full chronological feed for "what happened?" review. The inline logging form closes the loop — reading history and writing history happen in the same visual context, reducing the mental context switch between "understanding" and "recording".

---

## Pattern 3: Saved Views with Column Customisation

**Where it appears:** `app.hubspot.com/contacts/<portal-id>/objects/<object-type>` — the index page for any CRM object.

HubSpot's list view is built around the concept of **saved views** — pre-configured filter+sort+column combinations that persist as tabs.

**View Tabs**

At the top of the list page, a horizontal tab bar shows the user's saved views. Default views include "All contacts", "My contacts", "Unassigned contacts". Users can create custom views with the "+ Add view" button. Each tab shows the view name and optionally the record count. Views have three visibility levels:
- **Private** — only the creator can see and use this view.
- **Team** — shared with a specific team.
- **Everyone** — visible to all users in the portal.

The active view tab is visually distinguished with a bottom border and bolder text. Views can be reordered by dragging tabs. A star icon on each tab allows "favouriting" a view, which pins it to the left of the tab bar.

**Saved View Configuration**

Each view saves: (1) filters, (2) column selection and order, (3) sort column and direction. Editing any of these on the list page shows a "Save view" / "Save as new view" prompt. This means a sales manager can configure "High-value leads this week" with specific filters and share it with the team — the team sees the same data presentation without any setup.

**Summary Metrics Bar**

Below the view tabs and above the filter row, HubSpot displays a **metrics bar** — a horizontal row of 3-5 summary cards. Each card shows a metric label and value (e.g., "Total contacts: 1,247", "Created this week: 34", "Average deal value: $12,400"). These metrics are contextual to the current view — they recalculate when filters change. The metrics bar gives instant quantitative context before the user even looks at individual rows.

**Filter Row**

Below the metrics bar, a row of filter dropdowns allows refining the current view. Standard filters include: Contact Owner, Lifecycle Stage, Lead Status, Create Date, and Last Activity Date. An "Advanced filters" button opens a full filter builder with AND/OR logic, custom property filters, and date range comparisons. Active filters display as removable chips/tags below the dropdown row.

**Table with Column Customisation**

The table itself has:
- **Configurable columns** — An "Edit columns" button (gear icon) in the table header opens a side panel with all available properties. Users drag properties into the "Selected columns" list and reorder them. Column width is adjustable by dragging column borders.
- **Sortable headers** — Clicking a column header toggles sort: ascending (up arrow), descending (down arrow), none (no arrow). Only one column can be sorted at a time.
- **Row structure** — Each row shows the contact/record data in the configured columns. The first column (usually Name) is a clickable link that opens the record page. Rows have a left-edge checkbox for bulk selection.
- **Inline editing** — Some column cells support inline editing on click. A cell transitions from display to input mode (text field, dropdown, or date picker) and saves on blur or Enter.
- **Row hover actions** — Hovering a row reveals a "Preview" button on the right edge, which opens a slide-out panel showing a condensed version of the record's three-column view without navigating away from the list. This is HubSpot's "peek" pattern — quick inspection without losing list context.

**Bulk Actions Toolbar**

When one or more checkboxes are selected, a floating toolbar appears above the table: `3 records selected | Edit | Delete | Enroll in workflow | Create tasks | Assign owner | More`. The toolbar is sticky and follows the scroll. Each action opens a modal or popover specific to that bulk operation.

**Pagination and Count**

The table footer shows: "Showing 1-25 of 1,247 records" with Previous/Next buttons and a page size selector (25, 50, 100). The total count updates when filters change.

**Why this pattern matters:**
Saved views solve the "I filter this same way every morning" problem. Instead of rebuilding filters each session, agents open their named tab and the view is ready. The metrics bar provides quantitative orientation — "How many leads do I have today?" — before any row-level scanning. Column customisation means each role sees relevant data: the sales agent sees phone and last contacted, the manager sees conversion rate and lead score. The preview slide-out eliminates unnecessary navigation — agents can check a record's details without losing their place in the list.

---

## Pattern 4: Deal Pipeline Board with Stage Requirements

**Where it appears:** `app.hubspot.com/contacts/<portal-id>/objects/deals/board` — the Deals board view.

HubSpot's deal pipeline board is a kanban-style visualisation where each column represents a pipeline stage and cards represent individual deals. The critical innovation is **conditional stage properties** — fields that become required when a deal enters a specific stage.

**Board Layout**

The board displays as horizontal columns, one per pipeline stage. Columns are arranged left-to-right following the sales process: e.g., "Appointment Scheduled" -> "Qualified to Buy" -> "Presentation Scheduled" -> "Decision Maker Bought-In" -> "Contract Sent" -> "Closed Won" / "Closed Lost". Each column header shows: stage name, record count, and total weighted value (e.g., "Qualified to Buy (12) — $340,000").

**Deal Cards**

Each card in a column shows a compact summary: deal name (bold, clickable), contact name, deal amount, close date, and owner avatar. Cards can be colour-coded by priority or deal amount threshold. A small indicator shows "days in stage" as a subtle badge.

**Drag-and-Drop with Stage Requirements**

The core interaction: dragging a card from one column to another triggers a stage transition. When the card is dropped into the target column, HubSpot checks if the target stage has **required properties**. If it does, a modal overlay appears:

**Stage Transition Modal:**
- **Header:** "Move deal to [Stage Name]" with the stage icon.
- **Required properties section:** A form with fields marked with red asterisks. These are properties that the admin has configured as mandatory for this stage. Common patterns: "Qualified to Buy" might require "Budget confirmed" (yes/no) and "Decision maker identified" (contact picker). "Contract Sent" might require "Contract value" (currency) and "Expected close date" (date picker).
- **Optional properties section:** Additional fields that are encouraged but not required. These appear below the required fields with lighter styling and no asterisks.
- **Stage probability:** A line showing "Win probability: 60%" — the pre-configured likelihood associated with the target stage. This helps the agent understand pipeline weighting.
- **Automation note:** A subtle message explaining what will happen when the deal enters this stage: "Moving to Contract Sent will: Send notification to legal team, Create follow-up task in 3 days, Update forecasting report."
- **Footer:** "Cancel" link (left) and "Save" / "Move to [Stage Name]" button (right). The save button is disabled until all required fields are filled. Validation messages appear inline below each unfilled required field.

If no required properties exist for the target stage, the move happens immediately — no modal, no interruption.

**Stage Validation Indicators**

On the board view, cards that are missing required properties for their current stage display a warning icon. This indicates the record was moved before the requirements were enforced (possibly via import or API). Clicking the warning opens the same property form to complete the missing data.

**Pipeline Configuration (Admin View)**

Admins configure pipelines through: Settings -> Deals -> Pipelines. Each stage can have:
- A name and display order.
- A win probability percentage.
- A set of required properties (from the deal schema).
- Automated actions (workflows triggered on entry).

Multiple pipelines can exist simultaneously for different sales processes (e.g., "New Business" vs. "Renewals" vs. "Upsell").

**Why this pattern matters:**
The stage requirements pattern solves the "garbage data" problem in CRM pipelines. Without gating, agents drag deals through stages without recording the context that makes the pipeline data meaningful. By requiring specific fields at specific stages, HubSpot ensures that by the time a deal reaches "Contract Sent", it has a confirmed budget, identified decision maker, and expected close date. The modal is the minimum viable interruption — it appears only when requirements exist, shows exactly what's needed, and blocks progress until the data is provided. This pattern maps directly to journey stage transitions in lead management where different stages require different information.

---

## Pattern 5: Task Queues for Sequential Processing

**Where it appears:** `app.hubspot.com/contacts/<portal-id>/tasks` — the Tasks view, specifically the "Queue" mode.

HubSpot's task queue is designed for a specific workflow: processing a list of tasks one at a time, in order, with auto-advance to the next task upon completion.

**Queue Setup**

From the Tasks list view, a user can create a **task queue** — a named, ordered list of tasks. Tasks are added to a queue manually (from the task list or from individual records) or automatically (via workflow automation). Queues have a name, an owner (the user who processes them), and a sort order (due date, priority, or custom).

**Queue Execution Mode**

When the user clicks "Start queue" on a task queue, the interface shifts into a focused execution view:

- **Full-screen task view:** The current task expands to show all details — the task title, description, due date, associated contact/deal, and the contact's key properties. The associated record's information is pulled in contextually, so the agent has full context without navigating away.
- **Contact sidebar:** On the right, a condensed version of the associated contact/deal record appears — name, phone number, email, key properties, and recent activities. This is the same data from the three-column record view, compressed into a sidebar.
- **Action buttons:** At the bottom of the task view: "Complete" (marks task done, auto-advances), "Skip" (moves to next without completing), "Reschedule" (opens date picker to set new due date). The primary action is "Complete" — it's the largest, most prominent button.
- **Queue progress indicator:** A progress bar at the top shows "Task 7 of 23" with a visual fill indicator. This gives the agent a sense of progress and remaining workload.
- **Auto-advance:** When "Complete" is clicked, the current task slides out and the next task slides in from the right. The transition is animated, creating a satisfying sense of progress. No explicit "Next" button is needed — completing the action is the navigation.

**Task Types and Contextual Forms**

HubSpot tasks have a "Type" property: Call, Email, To-do. When executing a queue, the task type determines the contextual form:
- **Call task:** Shows a "Call" button that integrates with HubSpot's calling tool. After the call, the outcome form appears: duration, outcome (Connected/Left voicemail/No answer), and a notes field. Completing this form completes the task and auto-advances.
- **Email task:** Shows the email composer pre-filled with the contact's email and a template (if one was assigned). Sending the email completes the task.
- **To-do task:** Shows just the task description and a "Mark complete" button.

**Queue Benefits for Managers**

Managers can create queues for their team: "Follow up with all Pre-Care leads that haven't been contacted in 5 days" becomes a queue of 15 call tasks. The assigned agent starts the queue and works through each lead sequentially. The manager can monitor progress — "12 of 15 completed" — without interrupting the agent. This is HubSpot's answer to the "I gave them a list of names on a spreadsheet" management pattern.

**Integration with Workflows**

HubSpot workflows can automatically add tasks to queues. A trigger like "Contact lifecycle stage becomes 'Qualified Lead'" can create a "Discovery call" task and add it to the sales team's queue. This means the queue is always populated with the next actionable items, and agents don't need to search for what to do next — they start their queue.

**Why this pattern matters:**
Task queues address the cognitive cost of context-switching. Without a queue, an agent finishes a call, returns to the task list, scans for the next priority, opens the contact, reviews context, and then starts working. With a queue, the agent completes a task and the next one appears automatically with full context pre-loaded. This eliminates 3-4 navigation steps between each task. For a sales agent making 30 calls a day, that's 90-120 saved interactions — roughly 15-20 minutes of pure navigation eliminated. The sequential processing model also prevents cherry-picking (agents skipping difficult leads) because the queue presents tasks in a pre-defined order.
