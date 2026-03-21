---
title: "Split Panel Research — Sidebar Sam"
student: sam
pattern: split-panel
created: 2026-03-10
---

# Split Panel / Master-Detail UI Research

## Pattern Overview

The split panel (master-detail) pattern divides the viewport into a persistent list on one side and a detail view on the other. The user never loses their place in the list while exploring individual records. This pattern dominates productivity tools where users process queues of items sequentially.

---

## 1. Superhuman (Email Client)

**Layout**: Left list (35%) + Right preview (65%), no page transitions.

**Key patterns studied**:
- Compact row density: sender, subject snippet, time — all in a single line with smart truncation
- Selected row uses a subtle left border accent + background highlight
- Keyboard-first: J/K to move through list, Enter to expand, E to archive — never touching the mouse
- Split ratio adjusts based on window width; list collapses to icons on narrow screens
- Status indicators (unread dot, starred, snoozed clock) are tiny inline icons, not badges
- The detail panel streams in content progressively — header first, body lazy-loads

**Takeaway for complaints**: The "triage from top to bottom" workflow maps perfectly. Care Partners can arrow through feedback records reviewing each one without navigating away.

---

## 2. Apple Mail (macOS)

**Layout**: Three-column (sidebar + list + detail) or two-column (list + detail).

**Key patterns studied**:
- List rows show: sender (bold if unread), subject, preview snippet (gray), date, flag dot
- Grouped by date ("Today", "Yesterday", "Last Week") with sticky section headers
- Selected row: system accent color background, white text
- Detail panel includes a toolbar strip at top: Reply, Forward, Archive, Flag, Move
- Attachments render as inline previews within the detail body
- Quick actions on hover: flag toggle, delete — appear as icon overlays on the row

**Takeaway for complaints**: The date grouping and inline quick actions are worth borrowing. Grouping by triage level or stage instead of date could speed up processing.

---

## 3. Slack (Messages Panel)

**Layout**: Left channel list (20-25%) + Right message thread (75-80%).

**Key patterns studied**:
- Channel list: bold for unread, badge count for mentions, muted channels are dimmed
- Selected channel: rounded highlight with brand purple background
- Thread panel slides in as a third column from the right, pushing the message view narrower
- Compose bar is fixed at the bottom of the message area — always accessible
- Channel header shows: name, member count, topic, pinned items, search — persistent toolbar
- Sections in the sidebar: Starred, Channels, Direct Messages — collapsible groups

**Takeaway for complaints**: The fixed compose bar maps to a "quick add note" input pinned at the bottom of the detail panel. The collapsible sections in the list could group records by stage.

---

## 4. Microsoft Outlook (New)

**Layout**: Configurable split — right reading pane, bottom reading pane, or off.

**Key patterns studied**:
- List density modes: Compact (single line), Medium (two lines), Full (three lines with preview)
- Column headers are sortable: From, Subject, Received, Size, Importance
- Focused Inbox / Other tab separation — filters without losing context
- Reading pane shows full email with action bar: Reply, Reply All, Forward, More
- Drag-and-drop from list to folders in the left nav
- Flagged items get a red flag icon inline in the row
- Conversation threading groups related messages

**Takeaway for complaints**: The density modes are interesting — a compact mode for experienced triagers, a full mode for new users. The sortable columns could apply to triage level, stage, and date.

---

## 5. VS Code Explorer + Editor

**Layout**: Left sidebar (file tree, 20%) + Right editor (80%), with tabs.

**Key patterns studied**:
- File tree: expand/collapse folders, selected file highlighted with accent background
- Multiple files open as tabs in the editor area — switching tabs doesn't change the tree selection
- Split editor: can view two files side by side within the editor area
- Breadcrumb trail at top of editor shows file path — acts as secondary navigation
- Minimap on the right edge gives a zoomed-out view of the document
- Problems panel slides up from the bottom — a third split axis

**Takeaway for complaints**: The tab concept within the detail panel is directly applicable — Overview, Notes, Action Plan as tabs within the right panel while the list stays stable on the left.

---

## Synthesis: Split Panel Principles for Feedback Records

| Principle | Source | Application |
|-----------|--------|-------------|
| List always visible | All five | Left panel persists across all views |
| Keyboard navigation | Superhuman, VS Code | Arrow keys to move through records |
| Compact row density | Superhuman, Apple Mail | REF#, subject, triage dot, stage pill, time |
| Quick actions on selection | Apple Mail, Outlook | "Advance Stage", "Add Note" in detail header |
| Tabs within detail | VS Code, Outlook | Overview / Notes / Action Plan tabs |
| Fixed compose bar | Slack | Quick note input at bottom of detail |
| Sortable/filterable list | Outlook | Filter by triage, stage, type without losing detail |
| Resizable split | All five | Draggable divider between list and detail |
