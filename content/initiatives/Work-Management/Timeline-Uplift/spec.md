---
title: "Feature Specification: Timeline Uplift (TLU)"
description: |-
  Epic Code: TLU
  Created: 2026-01-14
  Status: Draft
  Input: Idea Brief + Research Document
---

> **[View Mockup](/mockups/timeline-uplift/index.html)**{.mockup-link}

# Feature Specification: Timeline Uplift (TLU)

**Status**: Draft
**Epic**: TP-2507 | **Initiative**: [Work Management](/initiatives/work-management)

---

## Overview

Staff at Trilogy Care lack visibility into the total communications occurring across clients and suppliers. When handling inbound enquiries, staff cannot quickly see what outreach has already been sent, leading to longer handle times, poor first touch resolution, and inconsistent responses. Training materials and scripts are scattered and disconnected from the communication context where they are needed most. Activity data is fragmented across three separate systems (Spatie Activity Log, Event Sourcing, and Notes), making it impossible to build a unified view of client or supplier interactions.

This specification defines a **Communications Canvas** - a unified visual timeline that shows all communications and activities across clients and suppliers in chronological order, with links to training materials and briefing documents. The system consolidates fragmented activity data into a single timeline component, enabling staff to instantly understand "what has happened with this person recently" and respond to enquiries with full context.

### Origin

This initiative was proposed by Luke Traini (CEO) in February 2026:

> "Would be great to create something that creates a visual timeline so staff can see all comms across clients/suppliers with links to the materials and any briefing documents. That will help the teams deal better with answering and resolving calls quickly and disseminating training, education and scripting training across the org."

### Technical Context

The codebase currently has three separate mechanisms for activity tracking:

| Mechanism | Used For |
|---|---|
| **Spatie Activity Log** | Model changes on selected models |
| **Event Sourcing** | PackageContact, Fee, and Budget events |
| **Notes** | Manual communication logging (50+ categories) |

The recommended approach is to start by extending the Notes system (proven in production, existing UI components) and later migrate to a unified activity system as DUC-5 (Activity Log Infrastructure) completes.

---

## User Scenarios & Testing

### User Story 1 - View Unified Client Timeline (Priority: P1)

As a care partner, I want to see all communications and activities for a client in a single chronological timeline so that I have full context when handling an inbound enquiry.

**Acceptance Scenarios**:

1. **Given** a care partner opens a client's package, **When** they navigate to the timeline view, **Then** they see a chronological list of all activities including calls, emails, SMS, notes, and system events with the most recent first.
2. **Given** the timeline contains multiple activity types, **When** the care partner scans the list, **Then** each entry displays a type badge (call, email, note, system event), timestamp, summary text, and the staff member who performed the action.
3. **Given** a client has extensive history, **When** the timeline initially loads, **Then** the most recent entries load first with pagination or lazy loading for older entries to maintain performance.

---

### User Story 2 - Filter and Search Timeline (Priority: P1)

As a care partner, I want to filter the timeline by activity type, date range, or keyword so that I can quickly find relevant information during a call.

**Acceptance Scenarios**:

1. **Given** a care partner is viewing a client timeline, **When** they select a filter for "Emails only", **Then** the timeline shows only email entries.
2. **Given** a care partner needs to find a specific communication, **When** they enter a keyword in the search field, **Then** the timeline filters to entries containing that keyword in the subject or body text.
3. **Given** a care partner wants to see recent activity, **When** they filter by "Last 7 days", **Then** only entries from the past week are displayed.
4. **Given** multiple filters are applied, **When** the care partner clears all filters, **Then** the timeline returns to the full chronological view.

---

### User Story 3 - Preview Communication Content (Priority: P1)

As a care partner, I want to preview the content of an email or SMS without leaving the timeline so that I can quickly understand what was communicated.

**Acceptance Scenarios**:

1. **Given** a care partner sees an email entry in the timeline, **When** they click or expand it, **Then** an inline preview shows the email subject, recipients, and body content.
2. **Given** a care partner sees an SMS entry in the timeline, **When** they expand it, **Then** they see the message text, recipient phone number, and delivery status.
3. **Given** a care partner is viewing a note entry, **When** they expand it, **Then** they see the full note text, category, and any attachments.

---

### User Story 4 - View Supplier Timeline (Priority: P2)

As a care coordinator, I want to see all communications and activities for a supplier in a single timeline so that I can understand the full interaction history when managing supplier relationships.

**Acceptance Scenarios**:

1. **Given** a care coordinator opens a supplier profile, **When** they navigate to the timeline view, **Then** they see all activities related to that supplier including calls, emails, invoice events, and notes in chronological order.
2. **Given** a supplier timeline includes invoice-related events, **When** the coordinator views these entries, **Then** they see the invoice reference, amount, and status change that occurred.

---

### User Story 5 - Link Training Materials to Communications (Priority: P2)

As a team leader, I want to link training materials, scripts, and briefing documents to communication campaigns so that staff can access relevant resources from the timeline.

**Acceptance Scenarios**:

1. **Given** a team leader is managing a communication campaign, **When** they attach a training document or script, **Then** the linked material appears alongside the communication entry in the timeline.
2. **Given** a care partner views a communication entry with linked materials, **When** they click on the material link, **Then** the document opens for viewing without leaving the timeline context.
3. **Given** a team leader wants to find all communications linked to a specific training document, **When** they search by document name, **Then** the timeline shows all entries where that document was linked.

---

### User Story 6 - Access Training Materials Directory (Priority: P3)

As a care partner, I want to access a searchable directory of training materials, scripts, and briefing documents so that I can find relevant resources during calls without needing to know where they are stored.

**Acceptance Scenarios**:

1. **Given** a care partner needs a script during a call, **When** they open the training materials directory, **Then** they see a categorised list of available materials with search functionality.
2. **Given** the training directory contains documents, **When** the care partner searches by topic or keyword, **Then** matching documents are returned with their category, last updated date, and a brief description.
3. **Given** a care partner finds the right document, **When** they click on it, **Then** the document opens inline or in a new tab for quick reference.

---

### User Story 7 - View Email Audit Log on Bills (Priority: P2)

As a care partner, I want to see the email history for a specific bill so that I know exactly what communications have been sent about it and when.

**Acceptance Scenarios**:

1. **Given** a care partner views a bill detail page, **When** they open the email history section, **Then** they see a list of all emails sent about that bill with timestamps, recipients, and subjects.
2. **Given** an email was sent about a bill, **When** the care partner clicks on the email entry, **Then** they see the full email content that was sent.

---

### Edge Cases

- **Timeline with thousands of entries**: Paginate with lazy loading; show a maximum of 50 entries per page with "Load more" functionality.
- **Activity from a deleted or deactivated user**: Display the username at the time of the activity with a "deactivated" indicator; do not hide the activity.
- **Email with no delivery confirmation**: Show the email entry with a "delivery status unknown" indicator rather than omitting it.
- **Concurrent timeline views by multiple users**: Timeline is read-only and handles concurrent access without conflict.
- **Activity types not yet integrated**: Display a "coming soon" indicator for data sources that have not been connected (e.g., if call data is not yet flowing).
- **Very large email content in preview**: Truncate the preview to the first 500 characters with an "expand" option to show full content.
- **Training material linked but since deleted**: Show a "document unavailable" placeholder with the original document name for traceability.

---

## Functional Requirements

**Unified Timeline**

- **FR-001**: System MUST display a unified chronological timeline of all activities on package detail pages.
- **FR-002**: System MUST support the following activity types in the timeline: calls (via Aircall), emails (sent and received), SMS messages, notes (all categories), system events (Spatie Activity Log changes), and domain events (Event Sourcing).
- **FR-003**: System MUST display each timeline entry with: type badge, timestamp, summary text, staff member attribution, and expandable detail view.
- **FR-004**: System MUST order timeline entries by timestamp, most recent first by default.
- **FR-005**: System MUST support pagination or lazy loading for timelines exceeding 50 entries.

**Filtering and Search**

- **FR-006**: System MUST support filtering by activity type (calls, emails, notes, system events).
- **FR-007**: System MUST support filtering by date range (preset and custom ranges).
- **FR-008**: System MUST support keyword search across activity content (email subject/body, note text, event descriptions).
- **FR-009**: System MUST support filtering by staff member who performed the action.

**Content Preview**

- **FR-010**: System MUST provide inline content preview for emails, showing subject, recipients, and body.
- **FR-011**: System MUST provide inline content preview for SMS, showing message text and delivery status.
- **FR-012**: System MUST provide inline content preview for notes, showing full text, category, and attachments.
- **FR-013**: System MUST provide inline content preview for system events, showing before/after values for changed fields.

**Cross-Entity Support**

- **FR-014**: System MUST support timeline views on supplier profile pages in addition to package pages.
- **FR-015**: System MUST display entity-relevant activities only (e.g., supplier timeline shows only supplier-related activities).
- **FR-016**: System MUST use a reusable timeline component that can be embedded on any entity page.

**Training Material Integration**

- **FR-017**: System MUST allow training materials, scripts, and briefing documents to be linked to communication entries.
- **FR-018**: System MUST display linked materials alongside their associated timeline entries.
- **FR-019**: System MUST provide a searchable training materials directory accessible from the main navigation.
- **FR-020**: System MUST support categorisation and tagging of training materials for organisation.

**Email Audit**

- **FR-021**: System MUST capture email send events and store them for timeline display.
- **FR-022**: System MUST display email audit history on bill detail pages showing all communications about that bill.
- **FR-023**: System MUST record email delivery status (sent, delivered, bounced, failed) where available.

**Performance**

- **FR-024**: System MUST load the initial timeline view (first 50 entries) within 2 seconds.
- **FR-025**: System MUST support efficient querying across multiple activity data sources without degrading page load performance.

---

## Key Entities

- **Timeline Entry**: A normalised representation of an activity from any source (Spatie Activity Log, Event Sourcing, Notes, email events, call events). Contains entry type, timestamp, summary, detail content, staff attribution, and linked entity reference (polymorphic).
- **Training Material**: A document (script, briefing, training guide) stored in the documents system with category tags, description, and version tracking. Can be linked to one or more communication entries.
- **Material Link**: An association between a training material and a timeline entry (communication), enabling staff to navigate from a communication to its related training resources.
- **Email Event**: A record capturing an email send action with recipient, subject, body content, delivery status, and timestamp. Linked to the originating entity (package, bill, supplier) for audit trail purposes.

---

## Success Criteria

### Measurable Outcomes

- **SC-001**: Average call handle time reduces by 15% within 3 months of launch, as staff spend less time searching for context.
- **SC-002**: First touch resolution rate improves towards the 70-79% industry benchmark within 6 months of launch.
- **SC-003**: Staff can access a client's full communication history within 3 seconds of opening the timeline.
- **SC-004**: 100% of sent emails are captured and visible in the timeline within 1 minute of sending.
- **SC-005**: Training material directory is used by at least 80% of care partners within the first month of availability.
- **SC-006**: Staff report reduced context-switching when handling inbound calls (measured via quarterly survey).

---

## Assumptions

- Staff will use the timeline view if it saves time during calls and enquiry handling.
- Training materials can be organised and categorised by operations leadership.
- Existing communication data (calls via Aircall, emails, notes) is accessible through existing APIs and database queries.
- The timeline view is the appropriate UX metaphor for displaying chronological activity data.
- The existing `SupplierTimeline.vue` component pattern can be extended for the unified timeline.
- The [Calls Uplift](/initiatives/work-management/calls-uplift) initiative will provide call data and transcriptions as a data source for the timeline.

---

## Dependencies

| Dependency | Owner | Status | Notes |
|---|---|---|---|
| DUC-5: Activity Log Infrastructure | Engineering | Backlog | Foundation for unified activity queries across data sources |
| [Calls Uplift](/initiatives/work-management/calls-uplift) | Work Management | Planning | Call data, recordings, and transcriptions as timeline data source |
| Documents system | Engineering | In Progress | Storage and retrieval of training materials |
| Email send event capture | Engineering | Not started | Must capture email events for timeline display |
| Notes system | Work Management | Complete | Existing 50+ category note system as primary data source |
| Spatie Activity Log | Engineering | Complete | Model change tracking already in production |
| Event Sourcing | Engineering | Complete | PackageContact, Fee, Budget events already captured |

---

## Out of Scope

The following items are explicitly excluded from this specification:

- **Real-time timeline updates via WebSocket** (MVP uses standard page refresh or polling; real-time push is a future enhancement).
- **Mobile-optimised timeline view** (desktop Portal only for MVP; mobile access is a future phase).
- **Family/carer portal access to timeline** (future consideration for stakeholder visibility).
- **AI-powered activity summarisation** (future enhancement to auto-summarise timeline content).
- **Automated communication workflows triggered from timeline** (timeline is read-only in MVP; initiating communications from the timeline is a future feature).
- **Analytics and FCR tracking dashboards** (separate initiative; timeline provides the data foundation).
- **Migration of historical Spatie Activity Log or Event Sourcing data into a unified table** (Phase 1 queries existing sources in place; data unification is deferred to DUC-5 completion).


## Clarification Outcomes

### Q1: [Scope] What specific improvements are planned for the timeline?
**Answer:** The spec is comprehensive. It defines a "Communications Canvas" -- a unified visual timeline consolidating three separate systems: Spatie Activity Log (model changes), Event Sourcing (PackageContact, Fee, Budget events), and Notes (50+ categories). **Specific improvements:** (a) Unified view across all three data sources, (b) Filtering by activity type, date range, keyword, and staff member, (c) Inline content preview for emails/SMS/notes, (d) Training material integration, (e) Supplier timeline support, (f) Email audit log on bills. **This is both a technical consolidation and a UX redesign.**

### Q2: [Dependency] Does TLU define the unified event schema for other epics?
**Answer:** Yes and no. The spec recommends "extending the Notes system (proven in production)" for Phase 1, and deferring to "DUC-5 (Activity Log Infrastructure)" for full unification. **TLU does NOT define a new unified schema in Phase 1** -- it queries existing data sources (Spatie Activity Log, Event Sourcing, Notes) and normalises them into a `Timeline Entry` view model for display. **Other epics should continue writing to their existing data stores.** TLU's Timeline Entry is a read-only aggregation, not a write target. The unified write schema is DUC-5's responsibility.

### Q3: [Data] What is the timeline data volume and performance strategy?
**Answer:** The Spatie Activity Log tracks changes on User, Package, Note, and other models (10 models confirmed). Event Sourcing captures PackageContact, Fee, and Budget events. Notes have 50+ categories. **Estimated volume: 50-200 timeline entries per client per year** for average clients, 500+ for complex cases. With 10,000 active clients, the total data volume is manageable. **Performance strategy:** FR-024 requires first 50 entries in under 2 seconds. FR-025 requires efficient cross-source querying. **Recommendation:** Use a UNION query across normalised views of each source, with a composite index on (entity_id, entity_type, created_at). Pagination at 50 entries per page with lazy loading.

### Q4: [Edge Case] How are external system events integrated?
**Answer:** MYOB adjustments have a model at `domain/MyobAdjustment/Models/MyobAdjustment.php` and sync logs at `domain/Myob/Models/MyobSyncLog.php`. SA API responses are tracked in `domain/Bill/Models/ServicesAustraliaInvoiceState.php`. **External events should appear inline in the timeline** with a distinct badge (e.g., "MYOB" badge for adjustments, "Services Australia" badge for SA responses). They are part of the client's full activity history. **No separate section needed** -- the filtering system (FR-006) allows users to filter to specific event types.

### Q5: [UX] Does timeline filtering overlap with DOC and CLI audit views?
**Answer:** Partially. DOC audit views focus on document-specific events (upload, approval, rejection). CLI audit views focus on clinical pathway events. TLU provides the COMPREHENSIVE view while DOC and CLI provide DOMAIN-SPECIFIC views. **Filtering overlap is acceptable** -- users access TLU for "everything that happened for this client" and DOC/CLI for domain-specific deep dives. **The reusable timeline component (FR-016) should be embeddable** so that DOC and CLI can use the same component with pre-applied filters rather than building their own timeline UIs.

### Q6: [Dependency] What is the status of DUC-5 (Activity Log Infrastructure)?
**Answer:** DUC-5 is listed as "Backlog" in the dependencies. This is the long-term solution for unified activity storage. **TLU should not wait for DUC-5** -- Phase 1 queries existing sources in place. DUC-5 would later provide a single table that all sources write to, eliminating the need for UNION queries. **TLU Phase 1 is valuable independently of DUC-5** because it provides the UX even if the underlying data architecture isn't unified.

### Q7: [Integration] How does TLU relate to the Threads epic?
**Answer:** Threads groups activities by conversation topic; TLU groups activities by entity (package/supplier). **Both consume the same underlying data** (emails, calls, notes). When a thread is assigned to a package, its activities should appear in the package's TLU timeline. **Recommendation:** Thread Activity records should include a package_id (via thread assignment) so TLU can include them. The `Timeline Entry` normalisation should handle Thread Activities as a source alongside Spatie, Event Sourcing, and Notes.

## Refined Requirements

1. **TLU Phase 1 should query existing data sources in place** -- do not wait for DUC-5 unified schema.
2. **Build the reusable timeline component** (FR-016) so DOC, CLI, and other epics can embed filtered timeline views.
3. **Thread Activity records should be included** in TLU when a thread is assigned to a package.
4. **External system events (MYOB, SA API) should appear inline** with distinct source badges, not in a separate section.
5. **The training materials directory (FR-019/FR-020) is a significant sub-feature** -- consider whether it belongs in TLU or should be a separate micro-epic under Infrastructure.
