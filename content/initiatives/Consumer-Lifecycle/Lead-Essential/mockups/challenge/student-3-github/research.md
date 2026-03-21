---
title: "GitHub Gary — Pattern Research"
---

# GitHub Gary — Pattern Research

**Student:** 3 — GitHub Gary
**Paradigm:** GitHub
**Focus:** Review workflow, timeline, status badges, batch actions

---

## Pattern 1: Issue/PR List View with Advanced Filtering

**Where it appears:** `github.com/<org>/<repo>/issues` and `github.com/<org>/<repo>/pulls`

GitHub's list view is a dense, information-rich table optimised for scanning hundreds of items quickly. The core structure is:

**Filter Bar (top)**
- A single text input that doubles as a structured query builder. Users can type free-text or use qualifier syntax: `is:open assignee:@me label:bug milestone:"v3.0"`. This is GitHub's most distinctive pattern — the filter language is learnable but immediately productive.
- Preset filter tabs sit above the input: "Open" and "Closed" (for issues) or "Open", "Closed", "Merged" (for PRs). These are toggle counts showing `234 Open / 1,892 Closed`, giving instant pipeline size awareness.
- Dropdown filter buttons sit inline: **Label**, **Milestone**, **Assignee**, **Sort**. Each opens a popover with search-within-filter functionality. The Sort dropdown offers: Newest, Oldest, Most commented, Least commented, Recently updated.

**List Rows**
- Each row is a single horizontal band containing: open/closed icon (colour-coded: green circle = open, purple merged = merged, red = closed), title as a clickable link, label badges inline after the title, metadata line below (e.g., `#4521 opened 3 days ago by octocat`), and right-aligned metadata: assignee avatar stack, comment count icon, and linked PR indicator.
- Rows have a left-edge checkbox for batch selection. When any checkbox is selected, a batch action bar slides in above the list replacing the filter bar, offering: Label, Milestone, Assignee, and Mark as (close/reopen).
- Hover state highlights the entire row with a subtle background change.

**Pagination**
- Simple Previous/Next pagination at the bottom. No infinite scroll. Each page shows 25 items by default.

**Why this pattern matters:**
The filter bar as a structured query language allows power users to build complex views fast (e.g., `is:open assignee:@me label:hot sort:updated-asc`), while the dropdown buttons give discoverable entry points for less technical users. The preset tabs (Open/Closed) with counts provide instant pipeline awareness — the most important metric is always visible without any interaction.

---

## Pattern 2: Issue/PR Detail View — Sidebar Metadata Panel

**Where it appears:** `github.com/<org>/<repo>/issues/<id>` and `github.com/<org>/<repo>/pull/<id>`

GitHub's detail view uses a 2-panel layout: wide main content area (left, ~75%) and a narrow metadata sidebar (right, ~25%). The sidebar is the command centre for classification and assignment.

**Sidebar Sections (top to bottom)**

1. **Reviewers** (PRs only) — Shows requested reviewers with their avatars and review state icons: pending (orange dot), approved (green check), changes requested (red X). Clicking opens a searchable dropdown to add/remove reviewers. The review state is GitHub's most powerful workflow signal — at a glance you know if a PR is blocked, approved, or needs attention.

2. **Assignees** — One or more user avatars with names. Clicking opens a searchable user picker with "Assign yourself" shortcut at top. Shows "No one — assign yourself" as empty state with a direct action link.

3. **Labels** — Colour-coded badges displayed as pills. Clicking opens a searchable label picker with colour swatches. Labels have both a name and colour, making them scannable in lists. Common patterns: `bug` (red), `enhancement` (blue), `priority: high` (orange), `status: in progress` (yellow). The colon-namespace convention (`priority:`, `status:`, `type:`) creates a lightweight taxonomy without a rigid schema.

4. **Projects** — Links to project boards with the current column/status shown inline (e.g., "In Progress" or "Done"). This connects the individual item to its pipeline position.

5. **Milestone** — Shows the milestone name with a progress bar (e.g., `v3.2 — 67% complete`). Milestones group issues into time-bound deliverables.

6. **Development** — Linked branches and PRs. Shows the relationship between the issue and its implementing code.

7. **Notifications** — Subscribe/unsubscribe toggle. "You're receiving notifications because you were mentioned."

**Key Interaction:** Every sidebar section uses the same pattern — click the gear icon or the section header to open a popover with a searchable list. Selections apply immediately (no save button). This makes sidebar edits extremely fast: click, search, select, done. Three interactions to change any metadata field.

**Sticky Behaviour:** The sidebar scrolls independently from the main content on long issues. On shorter issues, the sidebar is fixed while the main content scrolls.

---

## Pattern 3: Activity Timeline — Mixed Event Stream

**Where it appears:** The main content area of any issue or PR detail page.

GitHub's timeline is the most mature mixed-event stream in any developer tool. It interleaves human-authored content (comments, reviews) with system-generated events (status changes, label additions, assignment changes) in a single chronological feed.

**Comment Entries**
- User avatar on the left, connected by a vertical line to the next entry. The comment body sits in a bordered card with a header showing `username commented 2 hours ago` and an overflow menu (edit, delete, quote reply, copy link).
- Comments support full Markdown rendering: code blocks, images, task lists, mentions, emoji reactions.
- A reaction bar sits at the bottom of each comment (thumbs up, heart, rocket, etc.) for lightweight acknowledgment without adding noise to the thread.

**System Event Entries**
- Displayed as compact, single-line entries with a small icon on the left timeline rail. They use muted typography (smaller, greyed) to visually differentiate from authored content. Examples:
  - `octocat added the bug label 3 hours ago` (label icon, label badge inline)
  - `octocat changed the title from "old title" to "new title" 2 hours ago` (pencil icon)
  - `octocat assigned this to @maintainer 1 hour ago` (person icon, avatar)
  - `octocat closed this as completed 30 minutes ago` (purple merged icon)
  - `octocat moved this from In Progress to Done in Project Board 15 minutes ago` (project icon)

**Review Events (PRs only)**
- Review submissions appear as prominent timeline entries with a coloured header: green for "Approved", red for "Changes requested", grey for "Commented". The review body contains inline code comments rolled up into a summary. This pattern — making the review verdict visually dominant — is one of GitHub's strongest workflow signals.

**Timeline Rail**
- A thin vertical line connects all entries, creating a visual thread from creation to current state. The line runs through the left-aligned icons/avatars, giving the timeline a clear reading path.

**Key Design Decision:** System events are visually subordinate to human content. They occupy less vertical space, use muted colours, and don't have borders or cards. This keeps the timeline scannable — your eye jumps between comments (the high-value content) while system events provide context without dominating.

**Newest entry at bottom** — GitHub's timeline reads chronologically top-to-bottom, with the comment input box at the very bottom. This mimics a conversation thread. The "Add a comment" textarea with Markdown toolbar is always visible at the bottom of the page.

---

## Pattern 4: Status Badges and State Management

**Where it appears:** Throughout GitHub — issue lists, PR lists, detail views, project boards, notifications.

GitHub uses a deliberate, constrained status system with strong visual encoding:

**Issue States (2 states)**
- **Open** — Green circle with dot. Indicates active/unresolved.
- **Closed** — Purple circle with check (if "completed") or grey circle (if "not planned"). The "Close" button offers a dropdown: "Close as completed" (resolved) or "Close as not planned" (won't fix).

**PR States (3 states + review states)**
- **Open** — Green circle with dot.
- **Merged** — Purple merged icon (two arrows joining). Terminal state, cannot be reopened.
- **Closed** — Red circle. Closed without merging.
- **Draft** — Grey dashed circle. Not ready for review. Can be "marked as ready" to transition to Open.

**Review States (layered on top of PR state)**
- **Review required** — Orange dot next to reviewer name.
- **Approved** — Green check icon.
- **Changes requested** — Red X icon with file-diff badge.

**Status Checks (layered on top of PR state)**
- CI/CD results shown as a coloured strip: green check (all passing), red X (failures), yellow dot (pending). Clicking expands to show individual check details.

**Label System**
GitHub's labels are the extensible metadata layer. Unlike the fixed states above, labels are fully customisable:
- Each label has a **name** and a **background colour**. Text colour is auto-calculated for contrast.
- Labels display as small rounded pills with the background colour filled in.
- Common organisational patterns: `priority: critical` (red), `priority: low` (grey), `type: bug` (orange), `type: feature` (green), `status: blocked` (red), `area: frontend` (blue).
- Labels are additive — an issue can have multiple labels simultaneously, unlike state which is singular.

**Visual Hierarchy:**
State (Open/Closed/Merged) is always the first visual element — it appears as the leading icon in list rows and as a prominent badge on detail pages. Labels appear after the title. This creates a clear scan pattern: state first, then title, then classification.

**Project Board Column Status:**
When issues are part of a GitHub Project, they gain an additional status dimension — the project column (e.g., "Todo", "In Progress", "Done"). This status is shown in the sidebar of the detail view and as the column header on the board view. Items can be dragged between columns or their status changed via dropdown. This is the closest GitHub pattern to a CRM pipeline stage.

---

## Pattern 5: Batch Operations and Triage Workflow

**Where it appears:** Issue/PR list views, Project board views, and the dedicated "Triage" notification view.

GitHub provides several patterns for processing multiple items efficiently:

**Checkbox Selection + Action Bar**
- Every list row has a left-edge checkbox. A "Select all" checkbox sits in the table header.
- When one or more items are selected, the filter bar transforms into a batch action bar showing: `X selected` count, then action buttons: **Label** (add/remove labels), **Milestone** (set milestone), **Assignee** (assign/unassign), **Mark as** (open/close).
- The bar is sticky — it remains visible as you scroll through the list, so you can select items across multiple scroll positions before applying an action.
- Each action opens the same popover/search pattern used on individual items. Selecting a label from the batch label picker applies it to all selected items simultaneously.

**Project Board Bulk Actions**
- In GitHub Projects (the newer "Projects v2"), items in a table view can be multi-selected with Shift+Click. A bulk edit bar appears offering: set Status, set Priority, set Assignee, set Iteration, Archive.
- Items can also be dragged in bulk between status columns on the board view.

**Triage/Notification Inbox**
- GitHub's notification inbox (`github.com/notifications`) uses a triage pattern: items appear as a vertical list. Each item has a "Done" checkbox, "Mark as read" action, and "Save" (bookmark) action. Users process notifications linearly, marking each as done or saving for later.
- The "Done" action removes the item from the inbox (but doesn't close the issue — it just marks your notification as handled). This separation between "my attention queue" and "item state" is a powerful workflow concept.

**Keyboard Shortcuts**
- `x` to select/deselect focused item
- `j`/`k` to move focus up/down the list
- `e` to close/reopen focused item
- `/` to focus the search/filter bar
- `l` to open the label picker for focused item
- `a` to open the assignee picker for focused item
- `m` to open the milestone picker for focused item

**Why this matters:**
GitHub's batch operations are contextual — the action bar only appears when items are selected, keeping the interface clean by default. The same interaction patterns (searchable popovers) are used for both individual and batch actions, so users learn one pattern and apply it everywhere. Keyboard shortcuts layer on top for power users without adding visual complexity.
