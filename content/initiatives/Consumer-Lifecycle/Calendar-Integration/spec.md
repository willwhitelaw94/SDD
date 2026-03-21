---
title: "Feature Specification: Calendar Integration (CIP)"
description: "Specification for calendar sync for appointments and schedules"
---

> **[View Mockup](/mockups/calendar-integration/index.html)**{.mockup-link}

**Status**: Draft
**Epic**: TP-2316 | **Initiative**: Consumer Onboarding

---

## Overview

Calendar Integration (CIP) enables synchronisation between the Trilogy Care Portal and external calendar systems (Google Calendar, Apple Calendar, Outlook) so that recipients, care partners, and coordinators can view and manage care-related appointments and schedules within their preferred calendar application. This reduces missed appointments, improves care delivery visibility, and streamlines scheduling workflows for all stakeholders in the care lifecycle.

---

## User Scenarios & Testing

### User Story 1 - Recipient Calendar Sync (Priority: P1)

As a recipient, I want my upcoming care appointments to appear in my personal calendar so that I never miss a scheduled service.

**Acceptance Scenarios**:
1. **Given** a recipient has linked their Google/Apple/Outlook calendar, **When** a new care appointment is created in the Portal, **Then** the appointment should appear in their external calendar within 5 minutes with correct date, time, service type, and provider name.
2. **Given** a care appointment is rescheduled in the Portal, **When** the change is saved, **Then** the corresponding calendar event should update automatically in the recipient's linked calendar.
3. **Given** a care appointment is cancelled, **When** the cancellation is confirmed, **Then** the calendar event should be removed and the recipient should receive a cancellation notification.

### User Story 2 - Care Partner Schedule Visibility (Priority: P1)

As a care partner, I want to see all my recipients' upcoming appointments in my calendar so that I can coordinate care activities efficiently.

**Acceptance Scenarios**:
1. **Given** a care partner has linked their calendar, **When** they view their calendar, **Then** all appointments for their assigned recipients should be visible with recipient name, service type, and provider.
2. **Given** a care partner manages multiple recipients, **When** viewing the calendar, **Then** appointments should be colour-coded or labelled by recipient for easy identification.

### User Story 3 - Coordinator Scheduling (Priority: P2)

As a coordinator, I want to publish service schedules to recipient calendars so that recipients have advance visibility of planned care visits.

**Acceptance Scenarios**:
1. **Given** a coordinator creates a recurring service schedule, **When** the schedule is published, **Then** recurring events should appear in the recipient's linked calendar.
2. **Given** a coordinator updates a service time, **When** the update is saved, **Then** the calendar event should update and the recipient should be notified of the change.

### User Story 4 - Calendar Disconnection (Priority: P3)

As a recipient, I want to disconnect my calendar integration at any time so that I maintain control over my data sharing.

**Acceptance Scenarios**:
1. **Given** a recipient chooses to disconnect their calendar, **When** they confirm the action, **Then** all synced events should remain in their calendar but no further sync should occur.
2. **Given** a recipient reconnects their calendar, **When** the connection is re-established, **Then** all current and future appointments should sync.

### Edge Cases

- Calendar provider API is unavailable or rate-limited during sync
- Recipient has multiple calendar accounts linked simultaneously
- Timezone differences between recipient location and service provider
- All-day events vs time-specific appointments
- Recurring appointments with exceptions (e.g., public holidays)
- Calendar event deleted by user in external calendar (should not cancel the service)

---

## Functional Requirements

1. **Calendar OAuth Integration** -- Support OAuth 2.0 connections to Google Calendar, Apple Calendar (via CalDAV), and Microsoft Outlook (via Microsoft Graph API)
2. **Event Sync Engine** -- Bidirectional awareness: Portal-to-calendar push for appointment creation/updates/cancellations; external calendar changes should not modify Portal data
3. **Event Data Mapping** -- Map Portal appointment fields (service type, provider, location, duration) to calendar event fields (title, description, location, start/end time)
4. **Recurring Event Support** -- Support creation and management of recurring calendar events for regular care schedules
5. **Notification Integration** -- Calendar events should include default reminders (e.g., 1 hour before, 1 day before) configurable by the user
6. **Multi-Calendar Support** -- Allow users to select which calendar within their account receives care events
7. **Sync Status Dashboard** -- Provide visibility into sync status, last sync time, and any failed sync attempts

---

## Key Entities

| Entity | Description |
|--------|-------------|
| **CalendarConnection** | OAuth token and configuration linking a user to an external calendar provider |
| **CalendarEvent** | Mapped representation of a Portal appointment as a calendar event, including external event ID |
| **SyncLog** | Audit trail of sync operations with status, timestamps, and error details |
| **Appointment** | Existing Portal entity representing a scheduled care service |

---

## Success Criteria

### Measurable Outcomes

| Metric | Target |
|--------|--------|
| Calendar adoption rate among active recipients | Greater than 30% within 6 months |
| Missed appointment rate reduction | 20% reduction compared to baseline |
| Sync reliability (events successfully synced) | Greater than 99% |
| Average sync latency (Portal change to calendar update) | Less than 5 minutes |
| User satisfaction with scheduling visibility (survey) | Greater than 4 out of 5 |

---

## Assumptions

- Recipients and care partners have access to at least one supported calendar provider (Google, Apple, Outlook)
- The Portal has a structured appointment/scheduling data model that can be mapped to calendar events
- OAuth credentials and API keys for Google, Microsoft, and Apple calendar services can be obtained
- Calendar sync is one-directional (Portal is the source of truth for appointments)

---

## Dependencies

- Portal scheduling and appointment management features must be in place
- OAuth 2.0 infrastructure for third-party integrations
- Google Calendar API, Microsoft Graph API, and CalDAV protocol support
- Push notification system for sync failure alerts
- User profile settings page for managing calendar connections

---

## Out of Scope

- Two-way sync (changes in external calendar modifying Portal appointments)
- Calendar-based appointment booking (creating Portal appointments from external calendar)
- Video conferencing integration (Zoom/Teams links in calendar events)
- Shared family calendars with access control
- Integration with scheduling/rostering systems (handled separately)

## Clarification Outcomes

### Q1: [Scope] What is the boundary between CIP (consumer-facing) and CVI (coordinator-facing) calendar integration? Should they share a common sync engine?
**Answer:** CIP and CVI have distinct audiences and data flows. CIP pushes care appointments from Portal to recipient/care partner external calendars (outbound, read-only). CVI (under ADHOC) covers worker availability and credential management for internal coordinators. However, both require OAuth integration with Google/Apple/Outlook. **Recommendation:** Build a shared `CalendarSyncService` with provider adapters that both epics consume. CIP focuses on the recipient-facing event push; CVI focuses on worker availability polling. The shared OAuth infrastructure avoids duplicating Google/Microsoft credential management.

### Q2: [Dependency] Does a structured appointment/scheduling data model exist today? Should CIP depend on APA for appointment data?
**Answer:** The Portal currently has no dedicated Appointment model. Service bookings are tracked implicitly through bill items and service plan items in `domain/Budget/Models/BudgetPlanItem.php`. The Service Booking (APA) epic would introduce a proper booking entity. **CIP should depend on APA or at minimum define a `CalendarEvent` entity that maps from existing budget plan items.** Without APA, the appointment data source would be limited to scheduled services from the budget plan -- workable for MVP but incomplete. The spec's Key Entities section correctly identifies `Appointment` as an existing entity, but this entity does not yet exist in the codebase.

### Q3: [Data] What happens if a recipient deletes a synced calendar event in their external calendar?
**Answer:** Per the spec's own statement: sync is one-directional (Portal is source of truth). **The deleted external event should NOT cancel the Portal appointment.** The sync engine should detect missing external events during the next sync cycle and re-create them. The edge cases section acknowledges this but the spec should explicitly state: "External calendar deletions do not propagate to Portal. The system will re-sync the event on the next cycle with an optional user notification."

### Q4: [Edge Case] Is CalDAV support for Apple Calendar feasible within the timeline?
**Answer:** CalDAV is significantly more complex than REST-based Google Calendar API or Microsoft Graph API. CalDAV requires maintaining persistent connections, handling XML-based PROPFIND/PROPPATCH requests, and managing sync tokens. **Assumption:** Apple Calendar support should be deferred to Phase 2. MVP should target Google Calendar and Microsoft Outlook only. Apple Calendar users can use Google Calendar as an intermediary (supported on iOS). This reduces Phase 1 complexity by approximately 40%.

### Q5: [UX] Who configures reminders? Does MOB2 calendar view interact with synced events?
**Answer:** Reminders should use system defaults (1 hour and 1 day before) with recipient-level override capability in Profile > Notification Preferences (aligning with the ETN epic's notification preference system). Regarding MOB2: the MOB2 spec (US6 - Service Calendar) explicitly states "The calendar view does not require external calendar provider integration (handled by Calendar Integration / CIP epic)." **This confirms MOB2 shows an in-app calendar view while CIP pushes events to external calendars -- they are complementary, not overlapping.**

### Q6: [Performance] What is the expected volume of calendar sync operations?
**Answer:** With approximately 10,000 active recipients and an average of 2-3 appointments per week, the sync engine would need to handle 20,000-30,000 event operations per week. Google Calendar API has a quota of 1,000,000 requests/day per project, so volume is not a concern. Microsoft Graph has a 10,000 requests per 10 minutes limit per app, which requires batching. **The sync engine should use queue-based processing via Laravel Horizon with per-provider rate limiting.**

### Q7: [Data] How are timezone differences handled between recipient location and service provider?
**Answer:** Australia has 3 main timezone zones (AEST, ACST, AWST) plus daylight saving variations. Calendar events should be stored and transmitted in UTC with the recipient's timezone applied at display time. The CalendarEvent entity should include a `timezone` field derived from the recipient's address. Edge case: services delivered across state borders should use the service delivery location's timezone.

### Q8: [Dependency] What OAuth infrastructure exists in the Portal today?
**Answer:** The Portal currently uses Laravel Sanctum for API authentication and WorkOS for SSO. There is no existing OAuth 2.0 client infrastructure for third-party integrations like Google or Microsoft. **CIP would need to introduce a new `CalendarConnection` model with encrypted OAuth token storage, refresh token handling, and provider-specific scopes.** This is net-new infrastructure.

## Refined Requirements

Based on the clarification outcomes:

1. **Phase 1 should target Google Calendar and Microsoft Outlook only** -- Apple Calendar (CalDAV) deferred to Phase 2.
2. **A shared OAuth/calendar adapter infrastructure should be built** that CVI can also consume.
3. **The spec should add FR for "re-sync on external deletion"** -- explicitly documenting that external calendar deletions do not cancel Portal appointments.
4. **An `Appointment` or `ScheduledService` entity is a prerequisite** -- CIP should either depend on APA or define a minimal mapping from `BudgetPlanItem` to calendar events.
5. **Reminder configuration should integrate with the ETN epic's notification preferences system** rather than building a standalone preference UI.
6. **Add acceptance criteria for timezone handling** -- events must render in the recipient's local timezone regardless of service provider location.
