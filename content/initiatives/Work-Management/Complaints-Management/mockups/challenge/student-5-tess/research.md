---
title: "Timeline Tess — Research"
student: Timeline Tess
pattern: Vertical Timeline / Activity Feed
date: 2026-03-10
---

# Research: Timeline & Activity Feed Patterns

## 1. GitHub Activity Feed

**Source**: GitHub.com — Repository Activity, Issues, Pull Requests

GitHub's activity feed is a vertical timeline showing commits, comments, reviews, and status changes on issues and PRs. Each event is a card with an avatar, timestamp, and colored icon indicating the event type (purple for merges, green for opens, red for closes). A thin vertical line connects events chronologically.

**Key patterns**:
- Colored timeline dots differentiate event types at a glance
- Collapsed events with "show hidden" for bulk actions (e.g., "10 commits pushed")
- Inline expandable content — click a comment to see full text without navigation
- Filter by event type: comments, commits, reviews, status changes
- Relative timestamps ("2 hours ago") with absolute on hover

**Applicable to complaints**: Stage changes map directly to GitHub's status changes. Notes map to comments. The "filter by event type" pattern lets staff focus on just notes or just stage transitions.

---

## 2. Zendesk Ticket Timeline

**Source**: Zendesk Support — Ticket Conversation View

Zendesk renders each ticket as a chronological conversation thread. Internal notes (staff-only) appear with a yellow background while public replies are white. Status changes, assignments, and SLA breaches appear as system events between messages. The timeline reads top-to-bottom (oldest first) with a "jump to latest" button.

**Key patterns**:
- Visual distinction between user-generated content (notes) and system events (stage changes)
- SLA/overdue alerts surface inline as timeline events with warning styling
- Collapsible quoted content in long threads
- Side panel for ticket properties (assignee, priority, tags) — separate from timeline
- "Time since last update" prominently displayed

**Applicable to complaints**: The internal-note vs system-event distinction maps perfectly to notes vs stage changes. SLA breach alerts parallel overdue record highlighting. The side panel for properties keeps the timeline uncluttered.

---

## 3. Slack Thread / Channel History

**Source**: Slack — Channel and Thread Views

Slack presents messages in a continuous vertical feed grouped by date. Each message has an avatar, author name, timestamp, and content. Threads branch off but remain accessible inline. Date dividers ("March 5, 2026") break the feed into scannable sections. Unread indicators and "new messages" banners draw attention.

**Key patterns**:
- Date-based grouping headers ("Today", "Yesterday", "March 3")
- Hover actions on each item (react, reply, bookmark) — keeps UI clean until needed
- Rich content inline: files, images, code blocks all render within the feed
- Thread replies collapse under parent with "3 replies" indicator
- Real-time updates append to the bottom

**Applicable to complaints**: Date grouping is essential for the index feed ("Today", "This Week", "Earlier"). Hover actions for edit/delete on notes keeps the UI minimal. Attachments rendering inline within note timeline events follows Slack's pattern.

---

## 4. Medical Chart — Chronological Clinical Notes

**Source**: Epic MyChart / Clinical Documentation Systems

Medical charting systems present patient encounters as a chronological timeline. Each entry includes the clinician, date/time, encounter type (progress note, lab result, medication change), and expandable content. Color-coded icons distinguish entry types. Critical alerts (allergies, abnormal results) are pinned or highlighted with red styling.

**Key patterns**:
- Entry type icons with consistent colour coding (blue for notes, orange for labs, red for alerts)
- Expandable/collapsible cards — summary line visible, full content on click
- Filtering by entry type: notes, medications, labs, procedures
- Critical items surface to top regardless of chronology
- Audit trail: every entry is immutable with author, timestamp, and role

**Applicable to complaints**: The "critical items surface to top" pattern maps to overdue records appearing first. Entry type filtering (notes, stage changes, action items) is identical to clinical note filtering. The immutable audit trail aligns with complaint record compliance requirements.

---

## 5. Facebook / Social Media Activity Feed

**Source**: Facebook News Feed, Twitter/X Timeline

Social feeds present content as an infinite vertical stream of cards. Each card has: author info, timestamp, content, and action bar (like, comment, share). Cards are self-contained — you can interact without leaving the feed. Time-based ordering with algorithmic boosting of important items. Pull-to-refresh and infinite scroll patterns.

**Key patterns**:
- Self-contained cards: all essential info visible without navigating away
- Expandable inline: "See more" for long content, comments expand below
- Visual hierarchy: images/media dominate, text secondary
- Interaction counts visible on collapsed view ("12 comments, 3 shares")
- "New posts available" banner for real-time updates

**Applicable to complaints**: The self-contained card pattern means the index feed can show enough context (REF#, type, stage, assignee, last activity) to triage without opening each record. Expand-in-place lets staff review details without losing their place in the feed.

---

## Synthesis: Why Timeline Patterns Fit Complaints

| Feed Pattern | Complaints Mapping |
|---|---|
| Colored timeline dots | Triage level indicators (red/amber/teal) |
| Date grouping headers | "Today", "This Week", "Earlier" sections |
| Event type filtering | Notes / Stage Changes / Action Items tabs |
| Expandable cards | Collapsed summary → full detail in-place |
| Hover actions | Edit/delete notes, complete action items |
| Critical item surfacing | Overdue records pinned to top |
| Side panel properties | People, dates, stage, triage metadata |
| Immutable audit trail | Compliance-ready event history |
