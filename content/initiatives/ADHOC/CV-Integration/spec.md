---
title: "Feature Specification: CV Integration (CVI)"
---

> **[View Mockup](/mockups/cv-integration/index.html)**{.mockup-link}

**Status**: Draft
**Epic**: CVI | **Initiative**: ADHOC

---

## Overview

CV Integration provides calendar and curriculum vitae (CV) integration capabilities within the Trilogy Care portal. This feature enables care coordinators and operational staff to manage scheduling and workforce credential information in a unified system, reducing reliance on external tools and manual processes for tracking worker availability, qualifications, and scheduling.

> **Scope note**: This is a backlog-priority (P4) initiative. This spec captures the intended scope based on available context. Detailed requirements will be refined when the epic moves to active planning.

---

## User Scenarios & Testing

### User Story 1 — View Worker Availability via Integrated Calendar (Priority: P2)

As a **care coordinator**, when I am scheduling services for a client, I want to see worker availability in an integrated calendar view — so that I can match available workers to client needs without switching between systems.

**Acceptance Scenarios**:

1. **Given** a care coordinator is scheduling a service, **When** they open the scheduling interface, **Then** they see a calendar view showing available workers for the selected service type and time
2. **Given** a worker has existing bookings, **When** their availability is displayed, **Then** booked time slots are clearly marked as unavailable
3. **Given** a coordinator selects a worker and time slot, **When** they confirm the booking, **Then** the calendar updates to reflect the new booking for both the worker and the client

### User Story 2 — Access Worker Credentials and Qualifications (Priority: P2)

As a **operations manager**, when I need to verify a worker's qualifications for a service assignment, I want to access their CV and credential information within the portal — so that I can confirm compliance requirements are met without requesting documents manually.

**Acceptance Scenarios**:

1. **Given** an operations manager views a worker profile, **When** they navigate to the credentials section, **Then** they see a list of qualifications, certifications, and their expiry dates
2. **Given** a worker's credential is approaching expiry (within 30 days), **When** the manager views the worker list, **Then** an alert or visual indicator highlights the upcoming expiry
3. **Given** a worker is assigned to a service requiring specific qualifications, **When** the system validates the assignment, **Then** it warns if the worker lacks the required credential

### User Story 3 — Sync External Calendar Events (Priority: P3)

As a **care worker**, when I have availability changes in my external calendar, I want those changes to sync with the portal — so that coordinators always see my current availability.

**Acceptance Scenarios**:

1. **Given** a worker connects their external calendar (e.g., Google Calendar, Outlook), **When** they add a personal event blocking time, **Then** the portal reflects that time as unavailable within 15 minutes
2. **Given** a sync error occurs, **When** the system detects the failure, **Then** the worker is notified and a fallback "last synced" timestamp is displayed

### Edge Cases

- A worker has overlapping credentials (e.g., renewed before expiry) — display the most recent valid credential
- Calendar sync conflict where external and portal bookings overlap — flag the conflict for coordinator review
- A worker is deactivated — retain their calendar history for audit but remove from scheduling views

---

## Functional Requirements

### Calendar Integration

- **FR-001**: The system MUST provide a calendar view showing worker availability for service scheduling
- **FR-002**: The calendar MUST support day, week, and month views
- **FR-003**: The system SHOULD support two-way sync with external calendar providers (Google Calendar, Microsoft Outlook)
- **FR-004**: Calendar events MUST distinguish between client bookings, personal blocks, and organisation-wide events

### Credential Management

- **FR-005**: The system MUST store and display worker qualifications, certifications, and their validity periods
- **FR-006**: The system MUST generate alerts when credentials are within 30 days of expiry
- **FR-007**: The system SHOULD validate worker credentials against service requirements before confirming assignments

### Data & Privacy

- **FR-008**: Worker CV and credential data MUST be accessible only to authorised roles (operations managers, coordinators)
- **FR-009**: External calendar sync MUST use OAuth 2.0 and MUST NOT store external calendar credentials

---

## Key Entities

- **Worker Profile**: Contains personal details, qualifications, certifications, availability preferences, and linked external calendar
- **Credential**: A qualification or certification held by a worker. Contains name, issuing body, issue date, expiry date, and verification status
- **Calendar Event**: A time-bound entry representing a booking, availability block, or synced external event. Contains start/end time, type, and associated worker/client
- **Service Assignment**: A confirmed booking linking a worker, client, service type, and time slot

---

## Success Criteria

### Measurable Outcomes

- **SC-001**: Scheduling time reduced by 40% compared to current manual process
- **SC-002**: 100% of expiring credentials flagged at least 30 days before expiry
- **SC-003**: Calendar sync latency under 15 minutes for 95% of external events

---

## Assumptions

- Worker data (names, roles, basic qualifications) exists in the current system or can be imported
- External calendar providers offer stable OAuth-based APIs for read access
- Coordinators currently manage scheduling through a combination of spreadsheets and external calendar tools

---

## Dependencies

- Worker profile data model in the portal
- OAuth integration infrastructure for external calendar providers
- Service type and qualification mapping data

---

## Out of Scope

- Automated rostering or shift optimisation algorithms
- Payroll integration based on calendar hours
- Client-facing calendar views (this is an internal/coordinator-facing feature)
- Mobile app for worker calendar management (web-only for initial release)

## Clarification Outcomes

### Q1: [Scope] Should CV Integration be split into separate epics?
**Answer:** Yes. The epic conflates two distinct feature areas: (a) **Calendar/scheduling integration** for worker availability, and (b) **Credential/CV management** for qualification tracking. These have different audiences, data models, and dependencies. **Recommendation:** Split into CVI-CAL (Calendar/Availability) and CVI-CRED (Credential Management). The connecting workflow is "scheduling a service requires checking both availability AND qualifications" -- but this connection point is a validation rule, not a reason to build them together.

### Q2: [Dependency] What is the boundary between CVI calendar features and CIP?
**Answer:** CIP (Calendar Integration, Consumer Lifecycle) pushes RECIPIENT care appointments to external calendars (outbound, consumer-facing). CVI-CAL manages WORKER availability and scheduling (inbound/internal, coordinator-facing). **They address different sides of the scheduling equation:** CIP = "When is my next appointment?" (consumer view), CVI-CAL = "When is this worker available?" (coordinator view). They could share OAuth infrastructure for Google/Outlook but are otherwise independent. **CIP should be built first** since it has a clearer business case; CVI-CAL is P4 (backlog priority per scope note).

### Q3: [Data] Where does "worker" data come from?
**Answer:** TC Portal manages suppliers at `domain/Supplier/Models/Supplier.php` and organisation workers at `domain/Organisation/Models/OrganisationWorker.php`. **The OrganisationWorker model likely represents individual workers** within supplier organisations. However, care workers delivering services to recipients may not all have Portal accounts. **CVI-CRED would need a `WorkerProfile` entity** linked to either OrganisationWorker (for supplier personnel) or User (for internal staff). This is a new entity.

### Q4: [Integration] Are OAuth integrations feasible within Portal CSP?
**Answer:** The Portal uses Intercom (external JS widget) and WorkOS for SSO, confirming third-party integrations are technically feasible. OAuth for Google/Outlook requires server-side token exchange, which does not involve CSP issues (CSP applies to client-side resource loading). **OAuth calendar integration is technically feasible.** The CIP epic should build the shared OAuth infrastructure that CVI-CAL can later consume.

### Q5: [Edge Case] How does credential management apply to third-party supplier personnel?
**Answer:** Third-party supplier workers may not have Portal accounts. The `OrganisationWorker` model provides a reference. **CVI-CRED would need to support:** (a) Supplier-uploaded credentials for their own workers (via the supplier portal), (b) TC-verified credentials for compliance checking, (c) Expiry alerts sent to the supplier organisation, not individual workers. **This is fundamentally a supplier compliance feature** -- it tracks that supplier workers meet qualification requirements for service delivery.

## Refined Requirements

1. **Split into CVI-CAL and CVI-CRED** as separate sub-epics with independent timelines.
2. **CVI is P4 (backlog)** -- do not plan detailed implementation until it moves to active planning.
3. **CIP should build shared OAuth infrastructure** that CVI-CAL can consume later.
4. **CVI-CRED is a supplier compliance feature** -- credential management should be positioned within the Supplier domain, not as standalone infrastructure.
5. **A `WorkerProfile` entity is needed** but should be designed in coordination with the Supplier domain team to avoid conflicting with existing OrganisationWorker patterns.
