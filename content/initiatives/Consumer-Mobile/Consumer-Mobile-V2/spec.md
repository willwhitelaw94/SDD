---
title: "Feature Specification: Consumer Mobile V2 (MOB2)"
description: "Specification for Phase 2 mobile app - Plan and Act"
---

> **[View Mockup](/mockups/consumer-mobile-v2/index.html)**{.mockup-link}

**Status**: Draft
**Epic**: MOB2 | **Initiative**: Consumer Mobile

---

## Overview

Consumer Mobile V2 (MOB2) is the second phase of the Trilogy Care consumer mobile application, themed "Plan and Act." Building on MOB1's read-only foundation, MOB2 adds full write capabilities that enable recipients to actively manage their care: booking and scheduling services, creating and editing care goals and needs, requesting funding changes, submitting invoices on behalf of suppliers, managing multi-package scenarios, and viewing service calendars. MOB2 transitions selected actions from the Intercom shortcut pattern to native in-app workflows, while complex or infrequent actions continue to route through Intercom. This phase transforms the app from a visibility tool into an active care management companion.

---

## User Scenarios & Testing

### User Story 1 - Service Discovery and Booking (Priority: P1)

As a recipient, I want to find and book care services through the app so that I can arrange care without calling my coordinator.

**Acceptance Scenarios**:
1. **Given** a recipient navigates to the Services tab, **When** they tap "Find Services", **Then** they should see available services filtered by their postcode, package level, budget category, and service type.
2. **Given** a recipient selects a service provider, **When** they choose a date, time, and confirm booking details, **Then** a booking request should be submitted and appear as "Pending" in their service list.
3. **Given** a service booking is confirmed by the provider, **When** the confirmation is processed, **Then** the recipient should receive a push notification and the service should appear in their calendar view.
4. **Given** a recipient wants to cancel a booking, **When** they initiate cancellation, **Then** the system should show cancellation terms and confirm the action.

### User Story 2 - Care Goal Management (Priority: P1)

As a recipient, I want to create, edit, and track my care goals so that my care plan reflects my current priorities.

**Acceptance Scenarios**:
1. **Given** a recipient navigates to their goals, **When** they tap "Add Goal", **Then** they should be able to enter a title, description, category (Independence, Health, Social, Safety, Lifestyle), priority (High, Medium, Low), and target date.
2. **Given** a recipient views an existing goal, **When** they tap "Edit", **Then** they should be able to modify any field and save the changes with an audit trail entry.
3. **Given** a recipient achieves a goal, **When** they mark it as "Achieved", **Then** the goal status should update, progress should reflect 100%, and the Care Partner should be notified.
4. **Given** a recipient deletes a goal, **When** they confirm deletion, **Then** the goal should be removed and the change should be logged.

### User Story 3 - Care Needs Management (Priority: P1)

As a recipient, I want to document and update my care needs so that my support team understands my current requirements.

**Acceptance Scenarios**:
1. **Given** a recipient navigates to care needs, **When** they tap "Add Need", **Then** they should be able to describe the need, select a category, and indicate urgency.
2. **Given** a recipient updates an existing care need, **When** the change is saved, **Then** the care team should be notified and the change should appear in the care timeline.
3. **Given** a care need is resolved, **When** the recipient marks it as resolved, **Then** the status should update and the resolution should be recorded.

### User Story 4 - Invoice Submission (Priority: P2)

As a recipient, I want to submit invoices on behalf of my care suppliers so that I can manage reimbursements directly from my phone.

**Acceptance Scenarios**:
1. **Given** a recipient has received a paper invoice from a supplier, **When** they tap "Submit Invoice", **Then** they should be able to photograph the invoice using their camera, select the supplier and service category, enter the amount, and submit for processing.
2. **Given** a recipient has a digital invoice file, **When** they tap "Upload", **Then** they should be able to select the file from their device.
3. **Given** an invoice is submitted, **When** the submission enters the processing workflow, **Then** the recipient should receive status updates (received, processing, approved, paid) via push notification.

### User Story 5 - Funding Requests (Priority: P2)

As a recipient, I want to request funding changes and additional funding so that I can access the support I need as my circumstances change.

**Acceptance Scenarios**:
1. **Given** a recipient views their budget and identifies a reallocation need, **When** they tap "Request Funding Change", **Then** they should see a form to specify the requested change with justification.
2. **Given** a recipient wants to increase their funding, **When** they tap "Request Funding", **Then** they should see options for SAH review request, AT-HM funding application, supplement request, and short-term restorative care request.
3. **Given** a funding request is submitted, **When** the care team processes it, **Then** the recipient should receive updates on progress and final outcome via push notification.

### User Story 6 - Service Calendar (Priority: P2)

As a recipient, I want to see my scheduled services in a calendar view so that I can plan my week around my care schedule.

**Acceptance Scenarios**:
1. **Given** a recipient navigates to the calendar, **When** the view loads, **Then** all planned, confirmed, and completed services should be displayed on a monthly and weekly calendar.
2. **Given** a recipient taps on a calendar event, **When** the detail loads, **Then** they should see service type, supplier name, time, duration, location, and any notes.
3. **Given** a service is cancelled or rescheduled, **When** the change is made, **Then** the calendar should update and the recipient should be notified.

### User Story 7 - Enhanced Dashboard Analytics (Priority: P2)

As a recipient, I want to see quarterly spending trends and care insights so that I understand my package utilisation over time.

**Acceptance Scenarios**:
1. **Given** a recipient views the Home dashboard, **When** quarterly data is available, **Then** they should see quarterly spend trajectory graph, missed care events count, and needs resolved progress indicators.
2. **Given** a recipient has missed scheduled services, **When** they view the missed care section, **Then** they should see which services were missed, dates, and reasons if available.

### User Story 8 - Multi-Package Management (Priority: P2)

As a recipient with multiple packages, I want to switch between packages and manage each independently.

**Acceptance Scenarios**:
1. **Given** a recipient has multiple active packages, **When** they access the package switcher, **Then** they should see all packages with their type, level, and status.
2. **Given** a recipient switches packages, **When** the switch completes, **Then** all dashboard data, services, finances, and goals should update to reflect the selected package.
3. **Given** a recipient wants to terminate a package, **When** they initiate termination, **Then** they should be guided through the process with clear information about implications and pending items.

### User Story 9 - Quotes and Approvals (Priority: P3)

As a recipient, I want to request and approve quotes for services so that I can compare options before committing.

**Acceptance Scenarios**:
1. **Given** a recipient wants a quote for a new service, **When** they submit a quote request from a provider profile, **Then** it should be sent to the provider and the recipient should be notified when the response arrives.
2. **Given** a recipient receives quotes from multiple providers, **When** they review and approve a quote, **Then** the service should be added to their plan and the provider should be notified.

### User Story 10 - Assessment and Incident Viewing (Priority: P3)

As a recipient, I want to view my assessments and incident history so that I have a complete view of my care record.

**Acceptance Scenarios**:
1. **Given** a recipient navigates to assessments, **When** the page loads, **Then** they should see their assessment history with dates, types, and outcomes.
2. **Given** a recipient has reported incidents, **When** they view incident history, **Then** each incident should show date, type, status, and any follow-up actions.

### Edge Cases

- Service booking conflicts (same time slot, overlapping services, provider capacity)
- Goal or need edits triggering mandatory Care Management Activities (CMA) -- notification workflow required
- Invoice photo quality insufficient for processing (validation and retry guidance)
- Funding request for a type already pending review (duplicate detection)
- Budget reallocation that exceeds package limits or policy constraints
- Package termination while bills are still pending approval or services are scheduled
- Concurrent goal editing by recipient and Care Partner (conflict resolution)
- Service provider not available in the marketplace for the recipient's area (empty state)
- Calendar timezone handling for services across state borders
- Network interruption during invoice upload (progress persistence and retry)
- Recipient attempts to book a service outside their package eligibility

---

## Functional Requirements

1. **Service Discovery** -- Browse and search available services by location, category, and budget eligibility with provider profiles, ratings, and availability
2. **Service Booking** -- Request, schedule, and track service bookings with date/time selection, provider confirmation workflow, and cancellation handling
3. **Service Calendar** -- Monthly and weekly calendar display of all scheduled services with event detail drill-down and status indicators
4. **Goal Management** -- Full CRUD for care goals with category (Independence, Health, Social, Safety, Lifestyle), priority (High, Medium, Low), status tracking, target date, progress percentage, and milestone breakdown; Care Partner notification on changes
5. **Needs Management** -- Full CRUD for care needs with categorisation, urgency indication, resolution tracking, and care team notifications
6. **Invoice Submission** -- Camera capture and file upload of invoices, supplier/category selection, amount entry, and processing status tracking with push notifications
7. **Funding Requests** -- Submit budget reallocation requests, SAH review requests, AT-HM funding applications, supplement requests, and short-term restorative care requests with justification and approval tracking
8. **Enhanced Dashboard** -- Quarterly spend trajectory graph, missed care event tracking, needs resolved progress indicators, and promotional content display
9. **Quotes and Approvals** -- Quote request submission to providers, response comparison, and approval/decline workflow
10. **Package Management** -- Multi-package switching with full context refresh, package termination workflow with impact disclosure
11. **Assessment History** -- View assessment records with dates, types, outcomes, and associated documents
12. **Incident History** -- View reported incidents with date, type, status, and follow-up actions
13. **Hybrid Action Model** -- Native in-app workflows for goals, needs, bookings, and invoices; Intercom shortcuts retained for complex multi-step processes (clinical disputes, policy exceptions)

---

## Key Entities

| Entity | Description |
|--------|-------------|
| **ServiceBooking** | Requested or confirmed service booking with date, time, supplier, requirements, status, and calendar linkage |
| **ServiceProvider** | Marketplace-listed provider with availability, rates, location, ratings, and eligibility rules |
| **Goal** | Full CRUD care goal with title, description, category, priority, status, target date, progress, and milestones (extended from MOB1 read-only) |
| **CareNeed** | Documented care need with category, description, urgency, resolution status, and care team linkage (NEW) |
| **InvoiceSubmission** | Recipient-submitted invoice with photo/file, supplier, category, amount, and processing status (NEW) |
| **FundingRequest** | Budget change or funding request with type, justification, status, and approval tracking (NEW) |
| **ServiceQuote** | Quote from a provider for a requested service with pricing, terms, and approval status (NEW) |
| **Assessment** | Assessment record with type, date, outcome, and associated documents |
| **Incident** | Reported incident with type, date, status, and follow-up actions |

---

## Success Criteria

### Measurable Outcomes

| Metric | Target |
|--------|--------|
| In-app service bookings (vs Intercom-routed requests) | Greater than 60% of bookings via app |
| Recipients actively managing goals (create/edit) | Greater than 40% of active users |
| Intercom ticket volume reduction (from MOB1 baseline) | 50% reduction |
| Invoice submission completion rate | Greater than 75% |
| Calendar view adoption (weekly active users) | Greater than 50% of app users |
| Care need self-documentation rate | Greater than 30% of active users |
| App store rating maintenance | Greater than 4.0 stars |

---

## Assumptions

- MOB1 is released and stable with authentication, financial views, care circle management, HCA signing, and push notification infrastructure in place
- API endpoints for goals, needs, service booking, and invoices can be built on existing Portal domain models
- Service providers are onboarded and have availability data accessible via API
- The calendar view does not require external calendar provider integration (handled by Calendar Integration / CIP epic)
- Recipients will transition from Intercom shortcuts to in-app workflows given adequate UX and onboarding
- Invoice photo processing (OCR or manual review) workflow can handle mobile-submitted images
- Care Management Activity (CMA) notification workflow exists for goal and need changes

---

## Dependencies

- **Consumer Mobile V1 (MOB1)** -- App framework, authentication, notification infrastructure, base navigation, Intercom SDK
- Service provider onboarding and availability data (Supplier domain)
- Goal and Need domain models with full CRUD actions in the Portal backend
- Invoice processing workflow with photo/file upload handling
- Budget management and reallocation logic (Budget V2)
- Package termination workflow and API
- Quote request/response API
- Calendar data aggregation service
- UX design for new workflows (service booking flow, goal management, invoice capture, calendar views)

---

## Out of Scope

- Moonmart consumer marketplace (MOB3)
- AI-powered service recommendations (MOB3)
- External calendar sync with Google, Apple, Outlook (handled by Calendar Integration / CIP)
- Health device integrations (MOB3)
- Referral and rewards program (MOB3)
- Advanced family sharing and granular permissions (MOB3)
- Spending predictions and budget optimisation tips (MOB3)
- AI conversational interface (MOB3)
- Offline-first mode with background sync

## Clarification Outcomes

### Q1: [Scope] Which epic owns service booking logic -- MOB2 or APA?
**Answer:** MOB2 should consume APA's backend, not build its own. Service booking involves provider availability, pricing, eligibility rules, and confirmation workflows -- complex backend logic that should exist once. **MOB2 is the mobile UI layer for the booking flow; APA is the backend service.** The MOB2 spec should add APA as an explicit dependency and define the API contract it expects.

### Q2: [Dependency] Should MOB2 wait for RNC2 (Future State Care Planning) or build against the current goal model?
**Answer:** The codebase has care goals modeled implicitly (no standalone Goal model found, goals appear to be stored as structured data on packages or in notes). The MOB1 spec treats goals as read-only. MOB2 adds full CRUD. **Building CRUD against an unstable model risks rework.** If RNC2 is planned within 6 months, MOB2 should build read-only goal management against the current model and defer CRUD to after RNC2 stabilises the Goal entity. **At minimum, the Goal domain model should be defined and agreed upon before MOB2 CRUD development begins.**

### Q3: [Data] How does recipient-submitted invoice flow differ from supplier-submitted?
**Answer:** The existing bill model at `app/Models/Bill/Bill.php` tracks bills submitted by suppliers. A recipient-submitted invoice (photographed from a paper invoice) is a fundamentally different workflow -- it requires OCR or manual data entry, supplier matching, and then feeds into the same bill processing pipeline. **The `InvoiceSubmission` entity should be a new model** with a `submitted_by_type` field (supplier vs recipient). It enters the bill pipeline at the validation stage, not at the submission stage. The `BillItem` model should track the origin.

### Q4: [Edge Case] What approval workflow is required for mobile-initiated package terminations?
**Answer:** Package termination triggers departure record lodgement with Services Australia (per SAH spec US5), final statement generation, and agreement state changes (per HCA spec US15). **Mobile-initiated termination should NOT be a one-tap action.** It requires: (a) confirmation of understanding (implications, pending items), (b) approval by the Care Partner or Coordinator (not self-service by recipient alone), (c) cooling-off period. **Recommendation:** MOB2 should initiate a termination REQUEST that goes to the Care Partner for approval, not execute termination directly.

### Q5: [UX] What is the decision framework for native vs. Intercom?
**Answer:** The spec mentions transitioning "selected actions" to native. **Decision framework should be based on:** (a) Frequency -- actions performed weekly or more should be native, (b) Complexity -- multi-step workflows with structured data should be native, (c) Exception handling -- rare or complex exception cases stay on Intercom. **Native in MOB2:** Goal CRUD, need CRUD, service booking, invoice submission, funding requests. **Stay on Intercom:** Clinical disputes, policy exceptions, complex service changes requiring coordinator judgement, complaint escalation.

### Q6: [Performance] What is the impact of service discovery on app performance?
**Answer:** Service discovery (US1) requires searching providers by postcode, category, and budget eligibility. This is a potentially expensive query across multiple tables. **The API endpoint should use pre-computed availability indexes or Elasticsearch/Scout** for fast filtering. Loading providers with full rate cards and availability for a postcode should respond within 2 seconds (p95).

## Refined Requirements

1. **Service booking must consume APA's backend** -- MOB2 does not own booking logic.
2. **Goal CRUD should be deferred** until the Goal domain model is stabilised (either by RNC2 or by explicit model definition).
3. **Package termination from mobile must be a REQUEST workflow** requiring Care Partner approval, not direct execution.
4. **Add `submitted_by_type` to InvoiceSubmission** to distinguish recipient-submitted from supplier-submitted invoices.
5. **Document the native-vs-Intercom decision framework** as a reference for future action migration decisions.
