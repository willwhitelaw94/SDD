---
title: "Feature Specification: Re-Assignment Rules (RAR)"
description: |-
  Epic Code: RAR
  Created: 2026-01-14
  Status: Draft
  Input: Idea Brief + Strategy Context
---

> **[View Mockup](/mockups/re-assignment-rules/index.html)**{.mockup-link}

# Feature Specification: Re-Assignment Rules (RAR)

**Status**: Draft
**Epic**: RAR | **Initiative**: [Work Management](/initiatives/work-management)

---

## Overview

Care partner and coordinator assignments to client packages are currently managed manually. When a care partner goes on leave, resigns, has capacity constraints, or when caseloads need rebalancing across teams, operations staff must individually identify affected clients and manually reassign them. This process is slow, error-prone, and creates gaps in client coverage during transitions.

This specification defines an **automated re-assignment rules engine** that allows operations leaders to configure rule-based triggers for care partner re-assignment, execute bulk re-assignments with appropriate handover context, and ensure continuity of care during transitions. The system will support both reactive scenarios (e.g., care partner leave) and proactive scenarios (e.g., workload balancing, geographic optimisation).

### Strategic Context

Per the AI Initiatives strategy document (Stage 3.2 - Assigning a Case Manager), Trilogy processes approximately 400-500 care partner assignments per month. Current manual assignment relies on location, language, and client needs, but lacks systematic workload balancing or automated reassignment when circumstances change. The Re-Assignment Rules epic addresses the operational side of this challenge, providing rule-based automation as a foundation that can later be enhanced with AI-driven matching.

---

## User Scenarios & Testing

### User Story 1 - Configure Re-Assignment Trigger Rules (Priority: P1)

As an operations manager, I want to define rules that trigger care partner re-assignment so that client coverage gaps are prevented automatically when predictable events occur.

**Acceptance Scenarios**:

1. **Given** an operations manager opens the re-assignment rules configuration, **When** they create a new rule for "care partner leave", **Then** they can specify that all clients assigned to a care partner marked as on-leave should be flagged for reassignment.
2. **Given** an operations manager creates a workload threshold rule, **When** they set the maximum caseload to 80 packages per care partner, **Then** any care partner exceeding this threshold has their overflow clients flagged for reassignment.
3. **Given** multiple rules exist, **When** an event matches more than one rule, **Then** the system applies the highest-priority rule and logs all matched rules for audit purposes.

---

### User Story 2 - Review Re-Assignment Queue (Priority: P1)

As an operations manager, I want to see a queue of clients requiring re-assignment so that I can review and approve reassignments before they take effect.

**Acceptance Scenarios**:

1. **Given** trigger rules have flagged clients for reassignment, **When** the operations manager views the re-assignment queue, **Then** they see each affected client with the trigger reason, current care partner, and suggested replacement(s).
2. **Given** the system suggests replacement care partners, **When** the operations manager reviews a suggestion, **Then** they see the rationale (geographic proximity, language match, current caseload, specialties) and can accept or override the suggestion.
3. **Given** a client is flagged for reassignment, **When** no suitable replacement is identified by the system, **Then** the item is marked as "requires manual assignment" with a reason.

---

### User Story 3 - Execute Bulk Re-Assignment (Priority: P1)

As an operations manager, I want to reassign multiple clients from one care partner to another in a single action so that transitions are handled efficiently during leave or departures.

**Acceptance Scenarios**:

1. **Given** an operations manager selects multiple clients in the re-assignment queue, **When** they choose a target care partner and confirm, **Then** all selected clients are reassigned simultaneously with an audit trail recording the change.
2. **Given** a bulk re-assignment is executed, **When** the reassignment completes, **Then** the new care partner receives a notification with a summary of newly assigned clients and key context for each.
3. **Given** a bulk re-assignment is in progress, **When** one client fails to reassign (e.g., data conflict), **Then** the remaining clients are still reassigned and the failed item is flagged for manual resolution.

---

### User Story 4 - Handover Context for Reassigned Clients (Priority: P2)

As a care partner receiving reassigned clients, I want to see a handover summary for each client so that I can provide continuity of care without starting from scratch.

**Acceptance Scenarios**:

1. **Given** a client has been reassigned to a new care partner, **When** the care partner opens the client's package, **Then** they see a handover banner with the previous care partner's name, reassignment date, and trigger reason.
2. **Given** a reassignment has occurred, **When** the new care partner views the handover summary, **Then** they see recent notes, open tasks, upcoming activities, and any flagged risks for the client.
3. **Given** the handover summary is available, **When** the new care partner acknowledges the handover, **Then** the banner is dismissed and an acknowledgement is logged.

---

### User Story 5 - Temporary Re-Assignment for Leave (Priority: P2)

As an operations manager, I want to set up temporary reassignments with automatic reversion so that clients return to their original care partner when leave ends.

**Acceptance Scenarios**:

1. **Given** a care partner is going on planned leave, **When** the operations manager creates a temporary reassignment with a return date, **Then** the system reassigns clients to the covering care partner for the specified period.
2. **Given** a temporary reassignment is active, **When** the return date arrives, **Then** the system automatically flags clients for reversion back to the original care partner and queues them for confirmation.
3. **Given** a temporary reassignment is in place, **When** the leave is extended, **Then** the operations manager can update the return date and the reversion is rescheduled accordingly.

---

### User Story 6 - Re-Assignment Audit Trail (Priority: P2)

As a compliance officer, I want to see a full history of all care partner reassignments for a client so that I can demonstrate continuity of care during audits.

**Acceptance Scenarios**:

1. **Given** a client has been reassigned multiple times, **When** the compliance officer views the assignment history, **Then** they see a chronological list of all care partner assignments with dates, trigger reasons, and who approved each change.
2. **Given** a reassignment occurred due to a rule trigger, **When** the audit trail is reviewed, **Then** the specific rule that triggered the reassignment is documented alongside the approval.

---

### Edge Cases

- **Care partner assigned to themselves**: System prevents self-assignment and displays an error message.
- **Client with active open tasks at time of reassignment**: Open tasks transfer to the new care partner with a notification; completed tasks remain attributed to the original care partner.
- **Circular reassignment (A to B, B to A)**: System detects and warns but does not block, as this may be intentional for temporary coverage.
- **Care partner departs with no viable replacement**: Clients are flagged as "unassigned" with escalation to operations leadership; a daily digest report highlights unassigned clients.
- **Reassignment during an active CMA communication cycle**: In-flight CMA alerts transfer to the new care partner's dashboard.
- **Client has multiple packages with different care partners**: Each package is treated independently for reassignment purposes.
- **Bulk reassignment exceeds target care partner capacity**: System warns that the target care partner will exceed the configured caseload threshold but allows override with confirmation.

---

## Functional Requirements

**Rule Configuration**

- **FR-001**: System MUST allow operations managers to create, edit, disable, and delete re-assignment trigger rules.
- **FR-002**: System MUST support the following trigger types: care partner leave (planned and unplanned), care partner departure (permanent), caseload threshold exceeded, geographic rebalancing, and manual trigger.
- **FR-003**: System MUST allow rules to specify priority order for conflict resolution when multiple rules match.
- **FR-004**: System MUST support rule conditions based on care partner status, caseload count, geographic region, and team membership.

**Matching and Suggestions**

- **FR-005**: System MUST suggest replacement care partners based on configurable matching criteria: geographic proximity, language preferences, current caseload, and team membership.
- **FR-006**: System MUST rank suggested replacements by match quality and display the rationale for each suggestion.
- **FR-007**: System MUST allow operations managers to override suggestions and manually select any active care partner as a replacement.

**Re-Assignment Queue**

- **FR-008**: System MUST display a queue of clients requiring reassignment, grouped by trigger rule and current care partner.
- **FR-009**: System MUST support bulk selection and assignment of multiple clients to a target care partner.
- **FR-010**: System MUST support filtering the queue by trigger type, team, geographic region, and urgency.

**Execution**

- **FR-011**: System MUST update the care partner assignment on the client's package when a reassignment is confirmed.
- **FR-012**: System MUST transfer open tasks and active CMA alerts from the previous care partner to the new care partner.
- **FR-013**: System MUST notify the new care partner of the reassignment with a summary of affected clients.
- **FR-014**: System MUST notify the previous care partner (if still active) that clients have been reassigned.

**Temporary Reassignment**

- **FR-015**: System MUST support temporary reassignments with a specified return date.
- **FR-016**: System MUST automatically queue temporary reassignments for reversion on the return date.
- **FR-017**: System MUST allow the return date to be extended or the reassignment to be made permanent.

**Audit and Compliance**

- **FR-018**: System MUST log every reassignment with timestamp, trigger rule, previous care partner, new care partner, and approving user.
- **FR-019**: System MUST provide a client-level assignment history view showing all historical care partner assignments.
- **FR-020**: System MUST generate a daily digest report of unassigned clients (clients without an active care partner).

---

## Key Entities

- **Re-Assignment Rule**: A configurable trigger definition specifying conditions under which clients should be flagged for care partner reassignment. Contains rule type, conditions, priority, and active/inactive status.
- **Re-Assignment Queue Item**: A record representing a client flagged for reassignment. Contains the client reference, triggering rule, current care partner, suggested replacements with match scores, and queue status (pending, approved, completed, failed).
- **Care Partner Assignment**: The relationship between a care partner and a client package. Contains assignment date, assignment type (permanent or temporary), return date (for temporary), and the approving user.
- **Assignment History Entry**: An immutable audit record documenting a change in care partner assignment. Contains timestamp, previous care partner, new care partner, trigger rule, and approval metadata.

---

## Success Criteria

### Measurable Outcomes

- **SC-001**: Average time to reassign a care partner's full caseload (during leave or departure) reduces from days to under 2 hours.
- **SC-002**: Zero clients without an assigned care partner for more than 24 hours during planned leave transitions.
- **SC-003**: 100% of reassignments have a complete audit trail with trigger reason and approval metadata.
- **SC-004**: Care partner caseload variance (standard deviation across team) reduces by 30% within 3 months of launch.
- **SC-005**: New care partners acknowledge handover for 95% of reassigned clients within 48 hours of reassignment.
- **SC-006**: Temporary reassignments revert correctly in 100% of cases on the specified return date.

---

## Assumptions

- Care partner profiles contain sufficient data for matching (geographic location, languages spoken, current caseload count).
- The Portal's existing user and package infrastructure supports programmatic care partner assignment changes.
- Operations managers have sufficient knowledge of team capacity to review and approve reassignment suggestions.
- Notifications infrastructure (in-app and email) is available for reassignment alerts.
- The [Teams Management](/initiatives/infrastructure/teams-management) epic provides the team structure needed for team-based filtering and assignment.

---

## Dependencies

| Dependency | Owner | Status | Notes |
|---|---|---|---|
| Care partner profile data (location, languages, specialties) | Engineering | Partial | Some fields exist; capacity/workload data may need new attributes |
| Package assignment infrastructure | Engineering | Complete | Existing care partner to package relationship |
| [Teams Management](/initiatives/infrastructure/teams-management) | Infrastructure | Backlog | Team structure for group-based rules and filtering |
| Notifications system | Infrastructure | Complete | In-app and email notification delivery |
| [Task Management](/initiatives/work-management/task-management) | Work Management | In Progress | Task transfer during reassignment |
| [CM Activities](/initiatives/work-management/cm-activities) | Work Management | Backlog | CMA alert transfer during reassignment |

---

## Out of Scope

The following items are explicitly excluded from this specification:

- **AI-powered matching and recommendations** (future enhancement per AI Initiatives Stage 3.2; this spec covers rule-based matching only).
- **Automated reassignment without human approval** (all reassignments require operations manager confirmation in MVP).
- **Client or family notification of care partner changes** (future consideration; MVP focuses on internal operations).
- **Coordinator reassignment** (this spec covers care partner reassignment only; coordinator reassignment follows similar patterns but is a separate initiative).
- **Real-time workload monitoring dashboard** (separate from the reassignment rules engine; may be addressed by Budget Analytics Dashboard initiative).
- **Integration with HR/leave management systems** (care partner leave status is entered manually in MVP).


## Clarification Outcomes

### Q1: [Scope] What types of assignments are being reassigned?
**Answer:** The spec is now thoroughly detailed. It covers **care partner to package** reassignment specifically. FR-011 states: "System MUST update the care partner assignment on the client's package when a reassignment is confirmed." The codebase has this relationship in the Package model -- packages have assigned care partners. **Task-to-user reassignment happens as a consequence** (FR-012: "System MUST transfer open tasks and active CMA alerts from the previous care partner to the new care partner"). Team-level reassignment (moving packages between teams) is handled by the `package_team` pivot and is TMG scope, not RAR.

### Q2: [Dependency] Should RAR wait for TMG and RAP?
**Answer:** The spec explicitly lists TMG as a dependency (status: Backlog) and notes that "team structure for group-based rules and filtering" is needed. RAP affects role-based access but RAR's core functionality (rule engine, queue, bulk reassignment) does not require the role refactor. **RAR can start Phase 1 without TMG** -- team-based filtering and geographic rebalancing rules (FR-004) can be deferred. Phase 1 should focus on: care partner leave triggers, manual triggers, and basic matching. **TMG becomes a dependency only for team-based rules in Phase 2.**

### Q3: [Data] What triggers a reassignment? Configurable or hardcoded?
**Answer:** FR-002 explicitly defines 5 trigger types: care partner leave (planned/unplanned), care partner departure (permanent), caseload threshold exceeded, geographic rebalancing, and manual trigger. **Rules are configurable** (FR-001: "create, edit, disable, and delete") with priority ordering (FR-003). This is well-specified. The matching criteria for replacement suggestions (FR-005) are also configurable: geographic proximity, language preferences, current caseload, and team membership.

### Q4: [Edge Case] What happens to in-progress work during reassignment?
**Answer:** The spec addresses this clearly: FR-012 states "System MUST transfer open tasks and active CMA alerts from the previous care partner to the new care partner." The edge cases section adds: "Open tasks transfer to the new care partner with a notification; completed tasks remain attributed to the original care partner" and "In-flight CMA alerts transfer to the new care partner's dashboard." **Task transfer is automatic; historical attribution is preserved.** The Tasks domain (`domain/Task/Models/Task.php`) would need a `reassigned_at` timestamp to track the transfer.

### Q5: [Integration] How does reassignment affect the audit trail?
**Answer:** FR-018 states: "System MUST log every reassignment with timestamp, trigger rule, previous care partner, new care partner, and approving user." FR-019 provides a client-level assignment history view. **Future activities log under the new care partner; historical activities retain original attribution.** The Spatie Activity Log (used across the Portal) handles this naturally -- each activity records the authenticated user at time of action. **No special handling needed** for the audit trail beyond the reassignment event itself.

### Q6: [Data] What care partner data is available for matching?
**Answer:** The spec assumes "care partner profiles contain sufficient data for matching (geographic location, languages spoken, current caseload count)." The User model has basic profile fields. **Geographic location and language preferences may not exist as structured data** on the user profile today. The Package model has client addresses, and the Team model has Pod/geographic assignments. **Recommendation:** Verify that care partner location, language, and specialty data exists in the User model. If not, add these fields as prerequisites.

## Refined Requirements

1. **Phase 1 can proceed without TMG** -- focus on leave triggers, manual triggers, and basic caseload matching.
2. **Verify care partner profile data completeness** -- location, languages, and specialties must be structured fields on the User model before matching rules can work.
3. **Add `reassigned_at` timestamp to the Task model** to track when tasks are transferred during reassignment.
4. **Add a temporary reassignment indicator** to the package view so care partners know which clients are temporarily assigned and the expected reversion date.
5. **The daily unassigned client digest (FR-020)** should use the same notification infrastructure as CMA and ETN.
