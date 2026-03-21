---
title: "Feature Specification: Coordination Audit Process (CAP)"
description: "Specification for coordination activity audit trail and compliance"
---

> **[View Mockup](/mockups/coordination-audit-process/index.html)**{.mockup-link}

**Status**: Draft
**Epic**: TP-2363 | **Initiative**: Coordinator Management

---

## Overview

The Coordination Audit Process (CAP) establishes a comprehensive audit trail for all coordination activities within the Trilogy Care Portal. Under the Support at Home (SAH) framework, providers must demonstrate that coordination services are delivered, documented, and compliant with regulatory requirements. CAP provides systematic logging, reporting, and review workflows for coordination activities -- ensuring every interaction, decision, and action taken by coordinators is traceable, auditable, and defensible during regulatory audits.

---

## User Scenarios & Testing

### User Story 1 - Automatic Activity Logging (Priority: P1)

As a coordinator, I want all my client interactions and actions to be automatically logged so that I have a complete audit trail without manual data entry.

**Acceptance Scenarios**:
1. **Given** a coordinator updates a recipient's care plan, **When** the update is saved, **Then** the system should automatically log the change with timestamp, coordinator name, fields changed, previous values, and new values.
2. **Given** a coordinator makes a phone call to a recipient, **When** they log the call outcome, **Then** the system should record call date, duration, purpose, outcome, and any follow-up actions.
3. **Given** a coordinator completes a quarterly review, **When** the review is submitted, **Then** all review details (goals assessed, changes recommended, recipient feedback) should be captured in the audit log.

### User Story 2 - Audit Report Generation (Priority: P1)

As a compliance manager, I want to generate audit reports for coordination activities so that I can demonstrate regulatory compliance during SAH audits.

**Acceptance Scenarios**:
1. **Given** a compliance manager selects a date range and recipient, **When** they generate an audit report, **Then** the report should include all coordination activities, contact attempts, reviews, and care plan changes for that period.
2. **Given** a regulatory audit is scheduled, **When** the compliance manager generates a bulk report, **Then** the report should cover all recipients across the selected time period with summary statistics and detailed activity logs.
3. **Given** a report is generated, **When** the manager reviews it, **Then** any gaps in required activities (e.g., missed quarterly reviews, overdue contacts) should be flagged.

### User Story 3 - Coordination Activity Dashboard (Priority: P2)

As a coordination team leader, I want to see a dashboard of coordination activities across my team so that I can identify gaps and ensure service standards are met.

**Acceptance Scenarios**:
1. **Given** a team leader views the dashboard, **When** the page loads, **Then** it should display coordination activity summary cards (total contacts, reviews completed, care plan updates, overdue items) for the current period.
2. **Given** a coordinator has overdue recipient reviews, **When** the team leader views the dashboard, **Then** those overdue items should be highlighted with the coordinator name, recipient name, and days overdue.

### User Story 4 - Activity Verification and Sign-Off (Priority: P2)

As a coordinator, I want to submit my coordination activities for review and sign-off so that there is a formal verification process.

**Acceptance Scenarios**:
1. **Given** a coordinator has completed a recipient review, **When** they submit the review, **Then** it should enter a "pending verification" state visible to the team leader.
2. **Given** a team leader reviews a submitted activity, **When** they approve or request changes, **Then** the coordinator should be notified and the activity status should update accordingly.

### User Story 5 - Recipient Contact Tracking (Priority: P1)

As a coordinator, I want to track all contact attempts with recipients so that I can demonstrate proactive engagement during audits.

**Acceptance Scenarios**:
1. **Given** a coordinator attempts to contact a recipient, **When** the contact is logged (successful or unsuccessful), **Then** the system should record the attempt type (phone, email, in-person, video), outcome, and any notes.
2. **Given** multiple unsuccessful contact attempts, **When** the threshold is reached, **Then** the system should escalate the case and flag it for follow-up.

### Edge Cases

- Coordinator reassignment mid-review period -- audit trail must attribute activities to the correct coordinator
- Backdated activity entries -- system should allow but flag entries made significantly after the activity date
- Concurrent edits to the same recipient's coordination record
- System downtime -- activities performed offline need a mechanism for later entry
- Bulk operations (e.g., quarterly reviews for multiple recipients) need individual audit entries

---

## Functional Requirements

1. **Automatic Event Capture** -- Log all coordinator actions (care plan changes, contact entries, review submissions, document uploads, notes) with timestamp, user, and context
2. **Manual Activity Logging** -- Allow coordinators to log activities that occur outside the Portal (phone calls, in-person visits, external correspondence)
3. **Contact Attempt Tracking** -- Record all contact attempts with outcome classification (successful, no answer, voicemail, wrong number, refused)
4. **Quarterly Review Workflow** -- Structured workflow for recipient quarterly reviews with required fields, sign-off process, and audit linkage
5. **Audit Report Generation** -- Generate per-recipient and bulk audit reports with date filtering, activity type filtering, and export to PDF/CSV
6. **Compliance Gap Detection** -- Automatically identify recipients with overdue reviews, insufficient contact frequency, or missing documentation
7. **Dashboard and Analytics** -- Real-time dashboard showing coordination activity metrics, team performance, and compliance status
8. **Activity Verification Workflow** -- Submission and approval process for coordination activities requiring team leader sign-off
9. **Data Retention** -- All audit data must be retained for the regulatory minimum period (currently 7 years)

---

## Key Entities

| Entity | Description |
|--------|-------------|
| **CoordinationActivity** | Individual logged activity (contact, review, care plan change, note) with full metadata |
| **ContactAttempt** | Record of a contact attempt with a recipient, including method, outcome, and notes |
| **QuarterlyReview** | Structured review record with goals assessment, changes, and sign-off status |
| **AuditReport** | Generated report combining activities for a recipient or time period |
| **ComplianceFlag** | System-generated alert for overdue or missing coordination activities |

---

## Success Criteria

### Measurable Outcomes

| Metric | Target |
|--------|--------|
| Coordination activities with complete audit trail | 100% |
| Quarterly reviews completed on time | Greater than 95% |
| Average time to generate audit report | Less than 30 seconds |
| Compliance gaps identified proactively (before audit) | Greater than 90% |
| Coordinator time spent on manual logging (reduction) | 50% reduction vs current process |
| Successful regulatory audit outcomes | 100% pass rate |

---

## Assumptions

- SAH regulatory requirements for coordination documentation are well-defined and stable
- Coordinators will adopt the system for logging activities (change management and training provided)
- Existing Portal data model supports linking coordination activities to recipients and packages
- The current quarterly review process can be formalised into a structured workflow

---

## Dependencies

- Recipient and package data models in the Portal
- User authentication and role-based access control (coordinator, team leader, compliance manager roles)
- PDF/CSV export infrastructure for report generation
- Notification system for overdue activity alerts and verification requests
- SAH compliance requirements documentation (finalised)

---

## Out of Scope

- Automated scheduling of coordination activities (rostering systems)
- Integration with external compliance management systems
- AI-powered activity summarisation or recommendations
- Recipient-facing views of coordination activities (handled by Recipient Uplift)
- Financial audit processes (separate from coordination audit)

## Clarification Outcomes

### Q1: [Scope] How does CAP differ from the existing Spatie ActivityLog audit trail?
**Answer:** Spatie ActivityLog (used across 10+ models in the Portal) tracks MODEL CHANGES -- field updates, creates, deletes on Eloquent models. It records what changed, not what coordination ACTIVITIES occurred. **CAP builds a purpose-built coordination activity system** that tracks: phone calls, emails, visits, quarterly reviews, care plan changes -- from the coordinator's perspective, not the database's. Spatie logs "Package.care_partner_id changed from 5 to 7"; CAP logs "Coordinator Jane completed a quarterly review with Mrs Smith, discussed goals, recommended physiotherapy." **CAP extends the existing Notes system** (50+ categories, proven in production) with structured workflow and compliance reporting. It does NOT replace Spatie ActivityLog.

### Q2: [Dependency] What SAH requirements mandate coordination activity logging?
**Answer:** Per the CMA spec (which is closely related): SAH requires at least one direct Care Management Activity per client per month (minimum 15 minutes). The CMA spec cites "Support at Home Program Manual (V3, Page 90)" for the regulatory reference. **CAP ensures coordination activities are documented to SAH standards:** purpose, duration, origin, and timestamp. CAP provides the AUDIT AND REPORTING layer that proves compliance; CMA provides the PROACTIVE OUTREACH that generates activities. Together they ensure: (a) activities happen (CMA triggers), (b) activities are documented (CAP logging), (c) compliance is demonstrable (CAP reporting).

### Q3: [Data] Does 7-year retention require archive/cold storage?
**Answer:** The Portal database does not currently have a documented retention policy. Other compliance references in the codebase: call recordings have 7-year retention (Calls Uplift spec), and the RAP spec requires 7-year audit log retention. **For coordination activities, the volume is manageable:** ~10,000 clients x 12 activities/year x 7 years = ~840,000 records. This is well within PostgreSQL's capacity without cold storage. **No separate archive mechanism needed for MVP.** A `coordination_activities` table with appropriate indexes will serve for 7+ years. Consider partitioning by year if the table exceeds 5 million rows.

### Q4: [Edge Case] How should backdated entries be flagged? What is the maximum backdating window?
**Answer:** **Flagging mechanism:** Any activity entry with `activity_date` more than 7 days before `created_at` should be automatically flagged with a `is_backdated = true` field and a `backdated_reason` text field (required for backdated entries). **Who reviews:** Team leaders should see a "Backdated entries" filter on their dashboard (US3). **Maximum backdating window:** 30 days. Entries backdated more than 30 days should require team leader approval before saving. This balances flexibility (weekend activities logged on Monday) with audit integrity.

### Q5: [Integration] Does phone call logging integrate with Calls Uplift?
**Answer:** The Calls Uplift spec already logs phone calls as care management activities (FR-005: "System MUST automatically log call duration as care management activity when a call is linked to a package"). **CAP should consume Calls Uplift call data** rather than requiring manual re-entry. When a coordinator completes a Call Review in the Calls Uplift inbox, the resulting activity should automatically appear in CAP's activity log. **Manual call logging in CAP is needed only for calls made outside Aircall** (e.g., personal mobile, external coordinator without Aircall).

### Q6: [Data] What is the quarterly review workflow?
**Answer:** The spec mentions "quarterly reviews" (FR-4) but does not define the structured workflow in detail. SAH requires regular care plan reviews. **The quarterly review should be a structured form** with: (a) goals assessed (checkboxes from active goals), (b) progress notes per goal, (c) changes recommended (free text), (d) recipient feedback (captured during review), (e) next review date, (f) sign-off by team leader (US4 verification workflow). This is a mini-workflow within CAP, not a separate epic.

### Q7: [Integration] How does CAP relate to the Timeline Uplift (TLU)?
**Answer:** CAP activities should appear in the TLU unified timeline as "Coordination Activity" entries. TLU provides the READ view; CAP provides the WRITE workflow and compliance reporting. **CAP should write activities to a `coordination_activities` table that TLU's normalisation layer can query.** The TLU Timeline Entry should include a `coordination_activity` source type.

## Refined Requirements

1. **CAP should consume Calls Uplift call data** -- do not require coordinators to manually re-log Aircall calls in CAP.
2. **Backdated entries require a reason** and entries >30 days old require team leader approval.
3. **Define the quarterly review structured form** -- goals assessed, progress notes, changes, feedback, sign-off.
4. **Coordination activities should appear in the TLU timeline** as a new source type.
5. **CMA generates activities; CAP documents and audits them.** These two epics are complementary and should be developed with a shared activity data model in mind.
