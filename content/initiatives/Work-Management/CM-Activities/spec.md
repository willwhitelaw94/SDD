---
title: "Feature Specification: CM Activities (CMA)"
description: |-
  Epic Code: CMA
  Created: 2026-01-14
  Status: Draft
  Input: Idea Brief + Old PRD (Confluence)
---

> **[View Mockup](/mockups/cm-activities/index.html)**{.mockup-link}

# Feature Specification: CM Activities (CMA)

**Status**: Draft
**Epic**: TP-1880 | **Initiative**: [Work Management](/initiatives/work-management)

---

## Overview

Support at Home (SAH) requires at least one direct Care Management Activity (CMA) per client per month (minimum 15 minutes). Under Trilogy's self-management model, clients operate independently and natural monthly contact does not occur with every client. This creates compliance risk, lost care management revenue, and missed opportunities for proactive client engagement.

This specification defines a **data-triggered communications system** that automatically identifies clients requiring outreach, generates draft communications for care partner review, delivers approved messages via email, and logs each interaction as a compliant care management activity. All communications require human approval before sending (no AI personalisation in MVP).

### Regulatory Context

Per the Support at Home Program Manual (V3, Page 90):

- **CMA Definition**: Direct communication with participant and/or registered supporter about care-related matters.
- **Minimum Requirement**: At least one direct care management activity per client each month (minimum 15 minutes).
- **Evidence**: Must be documented in care notes with purpose, duration, origin, and timestamp.
- **Claims**: Submitted in arrears, itemised by participant/date in 15-minute increments.
- **Funding Calculation**: Care management quarterly base rate (10% of participant's ongoing quarterly budget) + care management quarterly supplement (3 hours per quarter at $120/hour, subject to indexation).

---

## User Scenarios & Testing

### User Story 1 - View Alert Dashboard (Priority: P1)

As a care partner, I want to see a queue of client alerts assigned to me so that I can identify which clients need outreach this month and take action before the deadline.

**Acceptance Scenarios**:

1. **Given** Databricks has generated trigger alerts for a care partner's clients, **When** the care partner opens the Alert Dashboard, **Then** they see a list of alerts grouped by client showing trigger reason, draft communication, due date, and expiry date.
2. **Given** an alert has a due date of the 20th of the month, **When** the care partner views the dashboard after the 20th, **Then** the alert is visually flagged as overdue.
3. **Given** an alert expires at end of month without action, **When** the month rolls over, **Then** the alert is removed from the active queue and captured in an expiry report.

---

### User Story 2 - Review and Approve Draft Communication (Priority: P1)

As a care partner, I want to review a system-generated draft communication and approve, edit, or reject it so that every message sent to clients is accurate and appropriate.

**Acceptance Scenarios**:

1. **Given** a care partner views an alert with a draft communication, **When** the draft is appropriate, **Then** they can approve it with one click and the communication is queued for delivery.
2. **Given** a care partner views a draft communication, **When** the draft needs modification, **Then** they can edit the text before approving and sending.
3. **Given** a care partner determines the alert is irrelevant, **When** they reject the alert, **Then** it is removed from the queue with a rejection reason logged for feedback analysis.

---

### User Story 3 - Multi-Channel Communication Delivery (Priority: P1)

As a care partner, I want approved communications delivered to clients via their preferred channel (email) so that outreach is effective and trackable.

**Acceptance Scenarios**:

1. **Given** a communication is approved by a care partner, **When** the client's preferred channel is email, **Then** the communication is sent via email with delivery confirmation tracked.
2. **Given** an email fails to deliver (bounce), **When** the delivery status is updated, **Then** the care partner is notified of the failed delivery and the alert remains active for follow-up.
3. **Given** a communication is successfully delivered, **When** the care partner views the alert, **Then** they see a delivery confirmation timestamp and channel used.

---

### User Story 4 - Automatic Activity Logging (Priority: P1)

As a care partner, I want every sent communication to automatically create a care management note with a 15-minute activity entry so that compliance evidence is captured without manual data entry.

**Acceptance Scenarios**:

1. **Given** a communication is successfully sent, **When** the activity is logged, **Then** a care note is created with the trigger reason, communication content, timestamp, and a 15-minute care management activity entry.
2. **Given** an activity is auto-logged, **When** a compliance auditor reviews the record, **Then** they see the linked data trigger, communication content, delivery confirmation, and care partner who approved it.
3. **Given** activities are logged throughout the month, **When** claims are prepared, **Then** all logged activities are available itemised by participant, date, and duration in 15-minute increments.

---

### User Story 5 - Snooze Alert (Priority: P2)

As a care partner, I want to snooze an alert to a later date within the month so that I can defer non-urgent outreach while ensuring it is actioned before month-end.

**Acceptance Scenarios**:

1. **Given** a care partner views an alert with a due date of the 20th, **When** they snooze it for 5 days, **Then** the due date updates to the 25th.
2. **Given** a snoozed alert reaches its new due date, **When** the care partner opens the dashboard, **Then** the alert reappears at the top of the queue.
3. **Given** a care partner attempts to snooze past the last day of the month, **When** they select a date, **Then** the system prevents snoozing beyond month-end and shows an error.

---

### User Story 6 - Monthly Coverage Reporting (Priority: P2)

As an operations manager, I want to see which clients have not received their monthly CMA so that I can intervene before the month expires.

**Acceptance Scenarios**:

1. **Given** it is mid-month, **When** the operations manager views the coverage report, **Then** they see a list of clients without a logged CMA for the current month, grouped by care partner.
2. **Given** alerts have expired without action, **When** the operations manager views the expiry report, **Then** they see all expired alerts with the care partner responsible and trigger reason.

---

### Edge Cases

- **Client has no valid contact details**: Alert is flagged as "undeliverable" with a prompt to update contact information before sending.
- **Multiple triggers for the same client in one month**: System prioritises the most clinically relevant trigger and presents it first; subsequent triggers are queued but one approved communication satisfies the monthly requirement.
- **Care partner is absent or on leave**: Alerts for their clients remain in the queue; team leaders can view and action alerts on behalf of absent care partners.
- **Client opts out of communications**: System respects opt-out preferences; alert is flagged for alternative CMA method (e.g., phone call).
- **Databricks delivers duplicate triggers**: System deduplicates alerts by client and trigger type within the same processing cycle.
- **Communication sent but activity log fails**: System retries activity creation; failed logs are flagged for manual review.

---

## Functional Requirements

**Data Integration**

- **FR-001**: System MUST receive trigger alerts from Databricks via API on a fortnightly batch schedule.
- **FR-002**: System MUST support five trigger scenarios: Service Gap Analysis, Incident Follow-up, Well-being Check-in, Spending Alert, and generic CMA Needed (catch-all).
- **FR-003**: System MUST assign each alert to the client's designated care partner.
- **FR-004**: System MUST deduplicate alerts for the same client and trigger type within a processing cycle.

**Alert Dashboard**

- **FR-005**: System MUST display a queue of active alerts filtered by the logged-in care partner.
- **FR-006**: System MUST show trigger reason, draft communication, due date, and expiry date for each alert.
- **FR-007**: System MUST set initial due date to the 20th of the month and expiry date to the last day of the month.
- **FR-008**: System MUST support snooze functionality that adjusts the due date, capped at end of month.
- **FR-009**: System MUST visually distinguish overdue, due-today, and upcoming alerts.

**Communication Workflow**

- **FR-010**: System MUST present a draft communication for each alert, pre-populated from the matching template.
- **FR-011**: System MUST allow care partners to approve, edit-then-approve, or reject each draft communication.
- **FR-012**: System MUST require a rejection reason when a care partner rejects a draft.
- **FR-013**: System MUST NOT send any communication without explicit care partner approval.

**Delivery**

- **FR-014**: System MUST send approved communications via email using the client's preferred email address.
- **FR-015**: System MUST track delivery status (sent, delivered, bounced, failed) for each communication.
- **FR-016**: System MUST notify the care partner when a delivery fails.

**Activity Logging**

- **FR-017**: System MUST automatically create a care management note upon successful communication delivery.
- **FR-018**: System MUST record a 15-minute care management activity entry linked to the note.
- **FR-019**: System MUST include trigger reason, communication content, delivery timestamp, and approving care partner in the note.
- **FR-020**: System MUST link the activity to the original data trigger for audit traceability.

**Reporting**

- **FR-021**: System MUST generate a monthly coverage report showing CMA completion status by client and care partner.
- **FR-022**: System MUST capture expired (unactioned) alerts in a separate report with care partner attribution.

---

## Key Entities

- **Trigger Alert**: A data-driven notification generated by Databricks indicating a client requires outreach. Contains trigger type, client reference, care partner assignment, draft communication, due date, and expiry date.
- **Communication Template**: A pre-defined message template for each trigger scenario (Service Gap, Incident Follow-up, Well-being Check-in, Spending Alert, CMA Needed). Contains placeholder fields for client personalisation.
- **Draft Communication**: An instance of a template populated with client-specific data, presented to the care partner for review, editing, and approval.
- **Care Management Activity**: A compliance record documenting a direct care management interaction, including purpose, duration (15-minute minimum), origin (trigger type), timestamp, and care partner attribution.
- **Alert Status**: Lifecycle states for a trigger alert: pending, snoozed, approved, rejected, sent, delivery_confirmed, delivery_failed, expired.

---

## Success Criteria

### Measurable Outcomes

- **SC-001**: 100% of active clients receive at least one documented CMA per month within 3 months of launch.
- **SC-002**: 100% of sent communications have a corresponding care management activity logged with required evidence fields.
- **SC-003**: Zero compliance issues related to CMA documentation in Services Australia audits.
- **SC-004**: Alert processing time (trigger received to care partner action) averages less than 2 hours.
- **SC-005**: Greater than 85% of generated draft communications are approved without major edits.
- **SC-006**: Greater than 95% successful email delivery rate.
- **SC-007**: 50% reduction in manual time spent identifying clients needing outreach.
- **SC-008**: Less than 15% of alerts are rejected as irrelevant by care partners (false positive rate).

---

## Assumptions

- Databricks platform is available and configured for fortnightly batch trigger processing.
- Client communication preferences and contact data (email addresses) are accurate and up to date in the CRM.
- Care Circle contacts are up to date and all contacts related to a package are current in the Portal.
- Portal infrastructure has sufficient capacity for the alert dashboard and approval workflows.
- Email delivery service is reliable with appropriate SLAs.
- Staff will be trained on the new alert dashboard workflow before go-live.
- Services Australia SAH regulatory requirements remain unchanged during implementation.

---

## Dependencies

| Dependency | Owner | Status | Notes |
|---|---|---|---|
| Databricks trigger processing pipeline | Data Team | Required | Fortnightly batch analysis of client data against trigger rules |
| Email delivery service | Infrastructure | Required | Branded email sending with delivery tracking |
| Care Notes system | Work Management | Complete | Activity logging and compliance evidence infrastructure |
| CRM integration | Data Team | Required | Client preferences, incident data, contact information |
| Budget/utilisation data | Finance/Data | Required | Service gap and spending alert trigger data |
| Portal alert dashboard UI | Engineering | Not started | New dashboard component for care partner workflow |

---

## Out of Scope

The following items are explicitly excluded from this specification:

- **AI-personalised communication drafting** (GenAI enhancement planned for post-MVP).
- **SMS delivery channel** (future requirement; MVP is email only).
- **Dynamic template optimisation** based on client response patterns.
- **Predictive trigger refinement** using machine learning.
- **Integration with wearable devices or smart home sensors**.
- **Family/carer notification workflows** (separate from client outreach).
- **Additional communication templates** beyond the five MVP scenarios (to be added post-MVP).
- **Real-time trigger processing** (MVP uses fortnightly batch processing).


## Clarification Outcomes

### Q1: [Scope] How does CMA relate to the Coordination Audit Process (CAP) epic?
**Answer:** CMA and CAP are complementary, not overlapping. CMA focuses specifically on the SAH regulatory requirement for monthly care management activities -- it is a **data-triggered proactive outreach system** (Databricks alerts -> draft communications -> care partner approval -> delivery -> activity logging). CAP focuses on **retrospective audit and compliance reporting** for ALL coordination activities (quarterly reviews, contact tracking, audit reports). **CMA generates the activities; CAP audits and reports on them.** The activity records created by CMA (FR-017/FR-018) would appear in CAP's audit reports (CAP FR-5). They share the `CoordinationActivity` entity concept but CMA is the producer and CAP is the consumer.

### Q2: [Dependency] Is the CMA Activity email notification pattern already built?
**Answer:** The codebase has ~72 notification classes (per the ETN spec) including domain-specific ones like `BudgetPlanEmailNotification`. However, the specific "CMA Activity" notification pattern -- a templated, care-partner-approved email sent to clients on behalf of the care management function -- does not exist. **This is being introduced by this epic.** The ETN epic's template management system would be the ideal infrastructure for CMA's 5 communication templates. **Recommendation:** CMA should use the ETN template system if available, or build simple templates that can later be migrated to ETN.

### Q3: [Data] What activity types are in scope? Is the taxonomy extensible?
**Answer:** The spec defines 5 trigger scenarios: Service Gap Analysis, Incident Follow-up, Well-being Check-in, Spending Alert, and CMA Needed (catch-all). These are the communication TRIGGERS, not activity types. The activity type logged is always "Care Management Activity" with a 15-minute minimum duration. **The trigger taxonomy should be extensible** (stored as an enum or configuration, not hardcoded) to support post-MVP additions. The Calls Uplift spec also logs activities as "Phone Call" type. **CMA activities and call activities should use the same underlying activity logging infrastructure** with different activity types.

### Q4: [Edge Case] How are activities attributed for multi-staff interactions?
**Answer:** The spec defines activities as attributed to the care partner who APPROVED the communication (FR-019). For single-staff email interactions, this is straightforward. **For multi-staff scenarios (three-way calls, joint visits), CMA is not the right system** -- those are manual activity entries that fall under CAP's scope. CMA specifically handles automated trigger -> draft -> approve -> send -> log flows. **Multi-staff attribution is out of scope for CMA** and should be addressed by CAP's manual activity logging (CAP FR-2).

### Q5: [Integration] Does CMA integrate with Aircall for call logging?
**Answer:** No. CMA is an email-based system (FR-014: "send approved communications via email"). The Calls Uplift epic handles Aircall integration and call-based activity logging. **CMA and Calls Uplift are separate activity sources** that both write to the same care management activity log. CMA generates email-triggered activities; Calls Uplift generates call-triggered activities. Both satisfy the SAH monthly minimum requirement. **If a client receives a CMA email AND has a call logged via Calls Uplift in the same month, both count toward the minimum but only one is required.**

### Q6: [Data] What is the Databricks integration mechanism?
**Answer:** The spec states "fortnightly batch schedule" (FR-001). No Databricks integration currently exists in the codebase (grep found no results). **The integration would be a new API endpoint** that Databricks calls to push trigger alerts. **Recommendation:** Build a webhook-style endpoint (`POST /api/internal/cma/triggers`) that accepts batch alert payloads from Databricks. Include authentication via API key and payload validation per FR-005 trigger schema.

### Q7: [Performance] What is the expected alert volume?
**Answer:** With ~10,000 active clients and 5 trigger types on a fortnightly cycle, the system could generate up to 50,000 alerts per cycle in the worst case (every client triggering every alert). In practice, the catch-all "CMA Needed" trigger ensures at least one alert per client per month. **Expected volume: 10,000-15,000 alerts per fortnightly batch.** The alert dashboard (FR-005) needs to handle care partners with 50-80 clients each, showing up to 80 active alerts per care partner.

## Refined Requirements

1. **CMA and Calls Uplift should share a unified activity logging infrastructure** with different activity types (email vs phone call).
2. **The trigger taxonomy must be extensible** -- use a database-backed configuration, not hardcoded enums.
3. **Add a Databricks webhook endpoint** (`POST /api/internal/cma/triggers`) with API key authentication for batch alert ingestion.
4. **CMA should coordinate with ETN** for email template management -- use ETN's template system if delivered first, or build migration-ready templates.
5. **Add an acceptance criterion:** "If a client already has a logged CMA for the current month (from any source including Calls Uplift), new alerts should be deprioritised but not suppressed."
