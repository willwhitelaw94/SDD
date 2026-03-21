---
title: "Feature Specification: Threads"
description: |-
  Epic Code: THREADS
  Created: 2026-02-26
  Status: Draft
  Input: Figma Design (CWD - Threads)
---

> **[View Mockup](/mockups/threads/index.html)**{.mockup-link}

# Feature Specification: Threads

**Epic Code**: THREADS
**Created**: 2026-02-26
**Status**: Draft
**Input**: Figma Design (CWD - Threads)
**Figma**: [CWD - Threads](https://www.figma.com/design/j22eTAvr3HqEVNI9CkIqHT/CWD---Threads)

## Overview

Care coordinators currently manage communication across disconnected channels - emails arrive in Outlook, calls are logged in Aircall, internal notes live on packages, and SMS messages are siloed. There is no unified view of a conversation about a specific topic (e.g. "reimbursement for physiotherapy bill"). Coordinators lose context, duplicate effort, and miss follow-ups.

**Threads** introduces a unified communication timeline that groups all related activity - emails, calls, internal notes, AI summaries, and tasks - into a single chronological thread per conversation topic. This replaces the current "Email and SMS" page with a richer, multi-channel view.

---

## User Types

| User Type | Capabilities |
|-----------|-------------|
| **Care Partner / Senior Care Partner** | Full access: view threads, reply to emails, add internal notes, create tasks from threads, assign to packages, use AI summarise |
| **Care Coordinator (Internal)** | Same as Care Partner |
| **Care Coordinator (External)** | View threads on packages they coordinate, reply to emails, add notes |
| **Team Leader** | All coordinator capabilities + view team members' threads |

---

## User Scenarios & Testing

### User Story 1 - View All Threads (Priority: P1 - Phase 1)

As a care coordinator, I want to see all my communication threads in a single inbox so I can manage conversations without switching between email, calls, and notes.

**Why this priority**: Core feature - provides the unified view that doesn't exist today.

**Acceptance Scenarios**:

1. **Given** a coordinator navigates to the Threads page, **When** the page loads, **Then** they see a list of all threads sorted by most recent activity, with each thread showing: sender avatar/initials, sender name, timestamp, subject line, message preview (2 lines), and metadata counters (emails, attachments, comments, tasks).
2. **Given** a thread has unread activity, **When** the coordinator views the thread list, **Then** the thread shows an unread indicator (blue dot next to sender name) and the sender name is bold.
3. **Given** a thread has child messages (replies), **When** the coordinator views the thread list, **Then** a chevron-right icon appears on the left indicating the thread is expandable/collapsible.
4. **Given** the coordinator views the thread list, **When** they see thread metadata, **Then** they see counts for: emails (envelope icon), attachments (paperclip icon), comments (message icon), and tasks (clipboard icon).
5. **Given** a thread has multiple assigned team members, **When** the coordinator views the thread, **Then** avatar groups show all assigned members, with overflow shown as "+N".

---

### User Story 2 - View Thread Detail / Timeline (Priority: P1 - Phase 1)

As a care coordinator, I want to open a thread and see the full chronological timeline of all activity (emails, calls, notes, AI summaries, tasks) so I have complete context for a conversation.

**Why this priority**: The timeline view is the core value - unifying disparate communication into one place.

**Acceptance Scenarios**:

1. **Given** a coordinator selects a thread from the list, **When** the thread detail opens, **Then** they see a chronological timeline showing all activity items grouped by date (e.g. "Oct 09, 11:10AM", "Oct 10, 1:12PM").
2. **Given** a thread contains an email, **When** the coordinator views it in the timeline, **Then** they see the sender avatar, sender name, timestamp, and the full email body with attachments.
3. **Given** a thread contains a call, **When** the coordinator views it in the timeline, **Then** they see a call card showing: caller name, "Inbound Call" or "Outbound Call" badge in teal, phone number, and a phone icon on the left margin.
4. **Given** a thread contains an internal note, **When** the coordinator views it in the timeline, **Then** the note appears with a teal/green background to visually distinguish it from emails, with an "Internal Only" badge and a copy/document icon on the left margin.
5. **Given** a thread contains completed tasks, **When** the coordinator views the timeline, **Then** each task shows a green "Complete" badge, task description, and timestamp.
6. **Given** a thread detail is open, **When** the coordinator views the header, **Then** they see: thread subject, assignment status badge (e.g. "Assigned", "Activity unassigned"), assigned member avatars, action buttons (Summarise, undo, reply, forward), and metadata counters (emails, calls, comments, tasks, attachments).

---

### User Story 3 - Reply to Thread (Priority: P1 - Phase 1)

As a care coordinator, I want to reply to an email within a thread so I can continue the conversation without leaving the portal.

**Why this priority**: Replying is the primary action coordinators take on threads.

**Acceptance Scenarios**:

1. **Given** a coordinator views a thread, **When** they click the reply button (or the reply-to panel is open), **Then** a "Reply to" panel opens on the right side showing: "To" field pre-populated with thread participants as removable badges, a Subject field pre-filled with "Re: [original subject]", a rich text editor body, and formatting toolbar with bold/italic/underline/color options.
2. **Given** the reply panel is open, **When** the coordinator types a message and clicks "SEND", **Then** the email is sent and appears in the thread timeline.
3. **Given** the reply panel is open, **When** the coordinator clicks "GENERATE", **Then** an AI-generated draft reply is inserted into the editor based on thread context.
4. **Given** the reply panel is open, **When** the coordinator clicks the X button, **Then** the panel closes.

---

### User Story 4 - AI Summarise Thread (Priority: P1 - Phase 1)

As a care coordinator, I want to generate an AI summary of a thread so I can quickly understand the conversation without reading every message.

**Why this priority**: Reduces time to understand long thread history, especially for threads picked up from another coordinator.

**Acceptance Scenarios**:

1. **Given** a coordinator views a thread, **When** they click the "SUMMARISE" button (sparkle icon), **Then** a right-side panel opens titled "AI Summary" showing a concise summary of the thread conversation.
2. **Given** the AI summary is generated, **When** the coordinator views the summary panel, **Then** they see: the summary text, a "REGENERATE" button to get a new summary, and a "SAVE AS NOTE" button to persist the summary as an internal note on the thread.
3. **Given** the AI summary panel is open, **When** the panel also shows suggested tasks, **Then** each task appears as a teal-bordered card with a sparkle icon, task description, and a "+" button to create it.

---

### User Story 5 - Assign Thread to Package (Priority: P1 - Phase 1)

As a care coordinator, I want to assign a thread to a package so the communication is linked to the correct client for billing and tracking.

**Why this priority**: Package attribution is critical for care management activity tracking and revenue capture.

**Acceptance Scenarios**:

1. **Given** a coordinator views a thread, **When** they click to assign, **Then** a right-side panel opens titled "Assign to package" with: a Package dropdown to search/select a package, a Thread field, and a Tags field.
2. **Given** the coordinator selects a package, **When** the package is selected, **Then** it appears as a teal-highlighted badge (e.g. "Sarah Johnson - SJ-123456 +") below the dropdown.
3. **Given** the coordinator has assigned a package, **When** they click "ASSIGN AND SAVE", **Then** the thread is linked to the package and the thread header updates to show "Assigned" status.

---

### User Story 6 - Filter and Search Threads (Priority: P1 - Phase 1)

As a care coordinator, I want to search and filter my threads so I can quickly find specific conversations.

**Why this priority**: With potentially hundreds of threads, search and filtering are essential for daily use.

**Acceptance Scenarios**:

1. **Given** a coordinator is on the Threads page, **When** they type in the search field, **Then** threads are filtered by subject, sender name, or message content.
2. **Given** a coordinator views the thread list, **When** they see the tab navigation, **Then** they can switch between: "All threads" (with count badge), "Suggested replies" (with count badge), and "Archived threads".
3. **Given** a coordinator views the thread list, **When** they click the "Filter" button, **Then** they can filter threads by type (Filter, Email, SMS toggle tiles).

---

### User Story 7 - Create New Thread (Priority: P2 - Phase 2)

As a care coordinator, I want to create a new thread so I can initiate communication from within the portal.

**Why this priority**: Outbound communication is secondary to managing inbound threads.

**Acceptance Scenarios**:

1. **Given** a coordinator is on the Threads page, **When** they click "CREATE NEW +", **Then** a compose interface opens for creating a new email thread.

---

## Edge Cases

- **Thread with no package assignment**: Thread remains in "Activity unassigned" state (orange/red badge). Coordinator can assign at any time.
- **Email from unknown sender**: Thread is created but with no auto-matched package. Appears in inbox for manual triage.
- **Thread spanning multiple packages**: A thread can only be assigned to one package. If the conversation spans multiple clients, coordinator should split into separate threads (future feature).
- **Very long threads (100+ items)**: Timeline should virtualise rendering. Show most recent activity first with "Load older" option.
- **Concurrent replies**: If two coordinators reply to the same thread simultaneously, both replies appear in chronological order. No locking mechanism needed for replies.
- **AI summary on empty thread**: Disable the SUMMARISE button if thread has fewer than 2 activity items.
- **Attachments in email**: Attachments display inline in the email body with file icon, filename, and size (e.g. "Physio_Invoice_10Oct.pdf 1.5 MB").

---

## Requirements

### Functional Requirements

**Thread List & Navigation**

- **FR-001**: System MUST display a paginated list of threads sorted by most recent activity timestamp.
- **FR-002**: System MUST show for each thread: sender avatar/initials, sender name, timestamp (relative for recent, absolute for older), subject line, 2-line message preview, and metadata counters.
- **FR-003**: System MUST indicate unread threads with a blue dot indicator and bold sender name.
- **FR-004**: System MUST show expandable/collapsible chevron for threads with child messages.
- **FR-005**: System MUST display assigned team member avatars with overflow "+N" indicator.
- **FR-006**: System MUST support three views via tabs: "All threads" (with count), "Suggested replies" (with count), and "Archived threads".

**Thread Detail / Timeline**

- **FR-007**: System MUST display a chronological timeline of all activity items within a thread.
- **FR-008**: System MUST visually distinguish activity types: emails (white background), internal notes (teal/green background with "Internal Only" badge), calls (phone icon in left margin, teal "Inbound/Outbound Call" badge), and tasks (with "Complete" badge when done).
- **FR-009**: System MUST show date separators between activity groups in the timeline.
- **FR-010**: System MUST display thread header with: subject, assignment status badge, assigned member avatars, and action toolbar.
- **FR-011**: System MUST show metadata counters in the header: email count, call count, comment count, task count, and attachment count.
- **FR-012**: System MUST provide left-margin activity type icons for quick visual scanning: envelope for email, phone for call, document for note, clipboard for task.

**Reply & Compose**

- **FR-013**: System MUST provide a right-side reply panel with: "To" field (pre-populated, editable with removable badges), "Subject" field (pre-filled with "Re: [subject]"), rich text editor with formatting toolbar, and SEND button.
- **FR-014**: System MUST support AI-generated reply drafts via a "GENERATE" button (sparkle icon) in the reply panel.
- **FR-015**: System MUST support creating new threads via "CREATE NEW +" button in the page header.

**AI Summarise**

- **FR-016**: System MUST generate AI summaries of thread content via "SUMMARISE" button.
- **FR-017**: System MUST display AI summary in a right-side panel with REGENERATE and SAVE AS NOTE actions.
- **FR-018**: System MUST suggest tasks derived from thread content, displayed as actionable cards with "+" to create.

**Package Assignment**

- **FR-019**: System MUST allow assigning threads to packages via a right-side panel with package search/select dropdown.
- **FR-020**: System MUST display assigned package as a teal-highlighted badge.
- **FR-021**: System MUST update thread status from "Activity unassigned" to "Assigned" upon package assignment.
- **FR-022**: System MUST support adding Tags to threads during assignment.

**Search & Filter**

- **FR-023**: System MUST provide a search field that filters threads by subject, sender, or content.
- **FR-024**: System MUST support filter toggle tiles: Filter (all), Email, SMS.
- **FR-025**: System MUST support tab navigation between All threads, Suggested replies, and Archived threads.

**Navigation**

- **FR-026**: System MUST appear as "Threads" in the sidebar navigation under the "Communication" section, below "Calls".
- **FR-027**: System MUST replace the existing "Email and SMS" navigation item.

### Key Entities

- **Thread**: A conversation topic grouping related activity items. Has a subject, status (active/archived), package assignment, assigned members, and tags.
- **Thread Activity**: An individual item in the thread timeline. Polymorphic - can be an Email, Call, Internal Note, AI Summary, or Task. Has a timestamp, author, and type-specific content.
- **Thread Assignment**: Links a thread to a Package and optionally to specific team members. Tracks assignment status (unassigned/assigned).
- **Thread Tag**: Categorisation labels applied to threads for organisation and filtering.

---

## Success Criteria

### Measurable Outcomes

- **SC-001**: Coordinators can view full conversation context (email + calls + notes) in a single view, reducing context-switching time by 60%.
- **SC-002**: AI summaries reduce time-to-context for inherited threads from 5+ minutes to under 30 seconds.
- **SC-003**: 90%+ of threads are assigned to packages within 24 hours of creation.
- **SC-004**: Coordinator satisfaction with communication tools increases (measured via survey).
- **SC-005**: "Suggested replies" tab reduces reply drafting time by 40%.

---

## Out of Scope

- Real-time collaborative editing of thread replies (single author per reply)
- SMS sending/receiving (Phase 2 - SMS integration)
- Thread merging or splitting
- External portal / care circle member access to threads
- Automated thread-to-package assignment (AI-powered, future phase)
- Video call integration
- WhatsApp or other messaging platform integration

---

## Dependencies

| Dependency | Owner | Status | Notes |
|-----------|-------|--------|-------|
| Email integration (inbound/outbound) | Infrastructure | Not started | Need email receiving and sending infrastructure |
| Calls Uplift | Work Management | Backlog | Call data feeds into thread timeline |
| Care Management Activities | CM Activities | Not started | Thread activity contributes to care management time |
| AI/LLM integration | Infrastructure | Partial | Needed for Summarise and Generate features |
| Package Notes | Work Management | Complete | Internal notes infrastructure exists |

---

## Relationship to Existing Features

### Replaces: Email and SMS Page
The current "Email and SMS" page concept (visible in earlier Figma explorations of this file) is superseded by Threads. Threads provides a superset of email/SMS functionality by adding:
- Unified timeline with calls and notes
- AI summarisation
- Task creation from threads
- Package assignment workflow

### Integrates with: Calls Uplift
The Calls Uplift spec (CALLS-UPLIFT) already references Threads as a future linking target:
> "Future: calls could be linked to Threads (future concept) or Tasks when those features exist."

Threads fulfils this by displaying call cards inline in the thread timeline. A call linked to a thread shows the inbound/outbound badge, phone number, and call duration.

### Integrates with: Care Management Activities
Thread activity (emails sent, calls made, notes added) can contribute to care management activity time tracking, supporting the 15-minute monthly minimum requirement.

---

## Navigation Structure (from Figma)

The sidebar navigation in the Threads design shows a restructured navigation:

**Communication** (section)
- Calls
- **Threads** (active/highlighted)

**Operations** (section)
- Service plans
- Bills

**Care Circle** (section)
- Clients
- Care Coordinators
- Suppliers

This represents a navigation restructure from the current sidebar, grouping communication tools together.

---

## Phase Plan

### Phase 1 - Core Threads (MVP)
- Thread list with search and filter
- Thread detail timeline (email + internal notes)
- Reply to thread
- Package assignment
- AI Summarise
- Navigation restructure (Threads replaces Email and SMS)

### Phase 2 - Multi-Channel
- Call integration in thread timeline (depends on Calls Uplift)
- SMS integration
- Task creation from threads
- AI Generate reply
- Suggested replies tab

### Phase 3 - Advanced
- Thread auto-assignment to packages via AI
- Bulk operations on threads
- Thread templates
- SLA tracking and escalation


## Clarification Outcomes

### Q1: [Scope] What is a thread in TC Portal context?
**Answer:** The spec is clear (derived from Figma design): A thread is a **unified communication timeline** that groups related multi-channel activity (emails, calls, internal notes, AI summaries, tasks) into a single chronological view per conversation topic. It replaces the current "Email and SMS" page. **It is most similar to a customer support thread** -- not Slack-style real-time messaging. Each thread has a subject line, message preview, and metadata counters. The primary interaction is reply-to-email and review, not real-time chat.

### Q2: [Data] Who can participate in a thread?
**Answer:** Per the User Types table: Care Partners, Coordinators (internal and external), and Team Leaders. **External parties (recipients, suppliers) participate indirectly** -- their inbound emails create thread activity items, and coordinator replies go to them via email. External parties do not have direct Portal access to threads. **This is an internal staff tool** for managing multi-channel conversations. The data model should use polymorphic `Thread Activity` items linked to the thread.

### Q3: [Dependency] Does Threads overlap with Timeline Uplift (TLU)?
**Answer:** Yes, partially. TLU creates a unified timeline of ALL activities on a package (calls, emails, notes, system events). Threads groups activities by CONVERSATION TOPIC across packages. **They are complementary views of the same data:** TLU is entity-centric (all activity for Package X), Threads is conversation-centric (all activity about Topic Y). **The underlying data sources overlap** -- both consume emails, calls, and notes. **Recommendation:** Build a shared activity data layer that both TLU and Threads can query with different grouping/filtering. The `Thread Activity` entity should be a polymorphic reference to the same underlying email, call, and note records that TLU displays.

### Q4: [Edge Case] How are threads archived or closed?
**Answer:** The spec defines three views via tabs: "All threads", "Suggested replies", and "Archived threads" (FR-006). Threads can be archived (moved to the archived tab). **No explicit retention policy or closure mechanism is defined.** The Calls Uplift spec uses "archive" to dismiss calls from the inbox. **Recommendation:** Apply the same pattern -- archived threads are retained indefinitely (7-year compliance retention per aged care standards) but removed from the active inbox. Archived threads can be reopened by creating new activity on them.

### Q5: [UX] Where do threads appear in the portal?
**Answer:** The spec explicitly defines navigation placement: Threads appears in the sidebar under a "Communication" section, below "Calls" (FR-026). It replaces "Email and SMS" (FR-027). The navigation structure shows: Communication > Calls > **Threads**. Additionally, threads are assigned to packages (US5), so package detail pages should show linked threads. **Threads is a standalone page** accessible from sidebar navigation, with package assignment linking threads to specific client contexts.

### Q6: [Integration] How does email integration work?
**Answer:** Email integration (inbound/outbound) is listed as a dependency with status "Not started." The Portal currently does not receive or send emails natively (emails are sent via Laravel Mail but not received). **Inbound email handling is a significant infrastructure requirement** -- it needs an email receiving service (e.g., Mailgun inbound routing, Amazon SES receiving) that converts inbound emails to Thread Activity records. **This is the biggest technical risk for the Threads epic** and should be spiked early.

### Q7: [Integration] How does AI summarisation work?
**Answer:** The spec requires AI-generated thread summaries (FR-016/FR-017) and AI-generated reply drafts (FR-014). The Calls Uplift spec uses Graph for AI features. **Threads should use the same AI infrastructure** -- either Graph or a direct LLM integration. The summarisation use case (condensing a multi-message thread) is well-suited to LLM processing. **This should be coordinated with the AI infrastructure decision identified in MOB3.**

## Refined Requirements

1. **Inbound email handling is the critical path** -- spike the email receiving infrastructure (Mailgun/SES inbound routing) before Threads development begins.
2. **Build a shared activity data layer** that both TLU and Threads can query with different grouping strategies.
3. **Thread archival should follow the same 7-year retention policy** as other compliance data. Archived threads remain queryable for audits.
4. **AI summarisation and reply generation should use the same LLM infrastructure** being evaluated for Calls Uplift and MOB3.
5. **Phase 1 (Core Threads) should focus on email integration only** -- call and SMS integration depends on Calls Uplift delivery and should be Phase 2.
