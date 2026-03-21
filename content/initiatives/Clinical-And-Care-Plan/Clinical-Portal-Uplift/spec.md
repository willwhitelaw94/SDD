---
title: "Feature Specification: Clinical Portal Uplift — Management Plans (CLI)"
description: "Clinical And Care Plan > Clinical Portal Uplift (Management Plans)"
---

# Feature Specification: Clinical Portal Uplift — Management Plans (CLI)

**Status**: Draft
**Epic**: CLI — Clinical Portal Uplift | **Initiative**: Clinical and Care Plan
**Prefix**: CLI
**Priority**: P2

---

## Overview

The Clinical Portal Uplift migrates Management Plans (MPs) from Zoho CRM to Portal, evolving them into **Clinical Pathways / Cases** — prescribed, ongoing clinical management pathways with structured review cycles, triage routing, and risk register integration. Currently, MPs reside exclusively in CRM while care partners work in Portal, causing visibility gaps, missed follow-ups, and manual relay of clinical instructions (often 1000+ words). Care partners were not consulted on the original MP rollout, and only 4 CRM features are still needed in Portal — MPs being a critical one.

CLI introduces a case type framework (Mandatory, Recommended, Self-Service Kit), a structured review lifecycle with reminders, triage routing to direct simple cases to care partners and complex cases to clinicians, and automated case creation from incidents via ICM.

---

## User Scenarios & Testing

### User Story 1 — View Active Cases on Client Records (Priority: P1)

As a **Care Partner**, I want to see all active clinical cases on a client's record in Portal so that I have visibility into ongoing clinical management during calls without switching to CRM.

**Acceptance Scenarios**:

1. **Given** a client has active cases (migrated from CRM or created in Portal), **When** a Care Partner views the client record, **Then** a Cases section displays showing: case name, case type (Mandatory/Recommended/Self-Service), status, next review due date, and assigned handler

2. **Given** a client has no active cases, **When** a Care Partner views the client record, **Then** the Cases section shows an empty state with a prompt to create a new case

3. **Given** a Care Partner is on a call with a client, **When** they view the client record, **Then** they can see case details inline without navigating to a separate system

4. **Given** a client has both active and closed cases, **When** the Care Partner views the Cases section, **Then** active cases are shown by default with an option to view closed cases

---

### User Story 2 — Create a New Case Manually (Priority: P1)

As a **Coordinator or Clinician**, I want to create a new clinical case on a client record with a case type, description, and review schedule so that ongoing clinical needs are tracked in Portal with structured follow-up.

**Acceptance Scenarios**:

1. **Given** a Coordinator clicks "Create Case", **When** the form loads, **Then** it includes fields for: case type (Mandatory, Recommended, Self-Service Kit), description, assigned handler, review schedule (frequency and duration), and linked risk categories

2. **Given** a Coordinator selects "Mandatory" case type, **When** the case is created, **Then** it is flagged as duty-of-care and cannot be declined or deferred

3. **Given** a case is created with a review schedule (e.g., weekly for 4 weeks), **When** the case is saved, **Then** review dates are automatically generated and reminders are scheduled

4. **Given** a case is created, **When** it is saved, **Then** an audit trail entry is created capturing who created it, when, and the initial case details

---

### User Story 3 — Conduct a Case Review (Priority: P1)

As a **Care Partner or Clinician**, I want to conduct a scheduled case review — recording observations, updating the case status, and scheduling the next review — so that clinical follow-up is structured and documented.

**Acceptance Scenarios**:

1. **Given** a case has a review due, **When** the assigned handler views the case, **Then** a "Conduct Review" action is available with a form for observations and outcome (ongoing, resolved, escalate)

2. **Given** the handler selects "Ongoing", **When** the review is saved, **Then** the next review is automatically scheduled based on the review frequency and the case remains active

3. **Given** the handler selects "Resolved", **When** the review is saved, **Then** the case status changes to Closed and the linked risk register is updated

4. **Given** the handler selects "Escalate", **When** the review is saved, **Then** the case is reassigned to a clinician (if currently with a care partner) and the escalation is logged

5. **Given** a case review is overdue, **When** the handler views their dashboard, **Then** the overdue review is highlighted with visual urgency indicators

---

### User Story 4 — Triage Cases to the Appropriate Handler (Priority: P2)

As the **System**, I want to route cases to the appropriate handler (clinician or care partner/coordinator) based on triage criteria so that clinicians focus on complex cases and care partners handle simple follow-ups.

**Acceptance Scenarios**:

1. **Given** a case involves high risk assessment, medication management, wound management, or 5+ clinical instructions, **When** the case is created or triaged, **Then** it is routed to a clinician

2. **Given** a case is a simple follow-up (e.g., fall check-in with no complications), **When** the case is created or triaged, **Then** it is routed to a care partner or coordinator

3. **Given** a case type is "Self-Service Kit", **When** the case is created, **Then** relevant resource articles are auto-sent to the client and no handler assignment is required

4. **Given** a case is a Mandatory case (duty of care), **When** the case is created, **Then** it is always routed to a clinician regardless of other criteria

---

### User Story 5 — Automatically Create Cases from Incidents (Priority: P2)

As a **Clinician**, I want clinical cases to be automatically created when incidents of certain types or severity are logged so that clinical follow-up is initiated without manual case creation.

**Acceptance Scenarios**:

1. **Given** an incident is logged via ICM that matches case-triggering criteria (e.g., fall with injury, medication error), **When** the incident is saved, **Then** a Recommended case is automatically created and linked to the incident

2. **Given** an incident triggers a case involving elder abuse or high risk of death, **When** the case is created, **Then** it is created as a Mandatory case with clinician assignment

3. **Given** an auto-created case is linked to an incident, **When** the case is viewed, **Then** the linked incident is displayed with a direct link to the incident record

---

### User Story 6 — Close a Case and Update the Risk Register (Priority: P2)

As a **Clinician or Care Partner**, I want to close a resolved case and have the risk register automatically updated so that the client's risk profile reflects current clinical status.

**Acceptance Scenarios**:

1. **Given** a case is resolved, **When** the handler closes the case, **Then** the risk register entry linked to the case is updated to reflect the resolution

2. **Given** a case closure reduces the client's risk level, **When** the case is closed, **Then** the risk profile recalculates and the updated risk level is visible on the client record

3. **Given** a closed case requires re-opening (relapse or new information), **When** a handler re-opens the case, **Then** the case returns to Active status with a new review scheduled

---

### Edge Cases

- What happens if a CRM Management Plan has no equivalent structure in Portal? The migration maps it to the closest case type; unmappable fields are preserved in a notes section
- What happens if ICM is not yet deployed when CLI launches? Incident-to-case automation is disabled; cases can only be created manually until ICM is available
- What happens if a care partner receives a case that should have gone to a clinician? The care partner can escalate via the review workflow, which reassigns to a clinician
- What happens if a client has 20+ active cases? Cases are paginated and sortable by due date and priority; no hard limit on active cases

---

## Functional Requirements

**Case Visibility**

- **FR-001**: System MUST display active cases on client records in Portal with case name, type, status, next review date, and assigned handler
- **FR-002**: System MUST support viewing both active and closed cases with a toggle
- **FR-003**: System MUST surface case status and due dates during client interactions (visible on client record)

**Case CRUD**

- **FR-004**: System MUST support manual case creation with fields: case type (Mandatory/Recommended/Self-Service Kit), description, assigned handler, review schedule, linked risk categories
- **FR-005**: System MUST support case editing, status updates, and closure
- **FR-006**: System MUST auto-generate review dates from the review schedule (e.g., weekly for 4 weeks)
- **FR-007**: System MUST log all case actions in an audit trail

**Case Types**

- **FR-008**: System MUST support three case types: Mandatory (duty of care — cannot be declined), Recommended (prescribed but optional), and Self-Service Kit (auto-send resources)
- **FR-009**: Mandatory cases MUST always be assigned to a clinician
- **FR-010**: Self-Service Kit cases MUST auto-send relevant resource articles to the client

**Review Lifecycle**

- **FR-011**: System MUST support a circular review loop: schedule review, conduct review (ongoing/resolved/escalate), auto-schedule next review if ongoing
- **FR-012**: System MUST send reminders for upcoming reviews
- **FR-013**: System MUST visually flag overdue reviews
- **FR-014**: Case closure MUST update the linked risk register entry

**Triage Routing**

- **FR-015**: System MUST route cases based on triage criteria: high risk, 5+ instructions, medication/wound management, and mandatory status route to clinicians; simple follow-ups route to care partners/coordinators
- **FR-016**: Self-Service Kit cases MUST auto-send resources without handler assignment

**Incident Integration**

- **FR-017**: System MUST support automatic case creation from incidents (via ICM) when incident type/severity matches triggering criteria
- **FR-018**: Auto-created cases MUST link to the triggering incident record

**Data Migration**

- **FR-019**: System MUST support migration of existing Management Plans from Zoho CRM to Portal
- **FR-020**: Migrated MPs MUST preserve all historical data and be mapped to the appropriate case type

---

## Key Entities

| Entity | Description |
|--------|-------------|
| **Case** | A prescribed, ongoing clinical management pathway for a client (replaces "Management Plan") |
| **Case Type** | Enum: Mandatory, Recommended, Self-Service Kit |
| **Case Status** | Lifecycle state: Draft, Active, Under Review, Closed |
| **Review** | A scheduled follow-up event within a case with observations and outcome |
| **Triage Rule** | Criteria determining whether a case routes to a clinician or care partner |
| **Case-Incident Link** | Association between a case and the incident that triggered it |

---

## Success Criteria

### Measurable Outcomes

| Goal | Metric | Target |
|------|--------|--------|
| Eliminate CRM switching | Active cases visible in Portal | 100% (zero CRM switching for MPs) |
| Reduce missed follow-ups | Missed case follow-ups | -50% reduction |
| Clinician efficiency | Clinician time spent on simple cases | -30% reduction (via triage routing) |
| Care partner satisfaction | Satisfaction with case visibility | Positive trend (survey baseline then post-launch) |
| Audit trail | Case actions logged | 100% |

---

## Assumptions

- Management Plan data can be migrated or synced from CRM to Portal
- Care partners will adopt Portal for clinical workflows (co-design workshops required given previous rollout issues)
- Marianne's case type framework (Mandatory/Recommended/Self-Service) is fit for purpose
- Terminology (pathways vs cases) will be finalised during discovery with Marianne
- Only 4 CRM features are still needed in Portal: meals, cab charge, incidents, and Management Plans

---

## Dependencies

| Dependency | Type | Impact |
|------------|------|--------|
| [ICM — Incident Management](/initiatives/Clinical-And-Care-Plan/Incident-Management/) | Epic | Required for incident-to-case automation |
| [RNC2 — Future State Care Planning](/initiatives/Clinical-And-Care-Plan/Future-State-Care-Planning/) | Epic | Objective risk scores feed case triage |
| [ASS1 — Assessment Prescriptions](/initiatives/Clinical-And-Care-Plan/Assessment-Prescriptions/) | Epic | Assessment documents may trigger cases |
| [CCU — Care Circle Uplift](/initiatives/Clinical-And-Care-Plan/Care-Circle-Uplift/) | Epic | External providers (GPs, hospices) tagged to cases |
| [DOC — Documents](/initiatives/Clinical-And-Care-Plan/Documents/) | Epic | Clinical documents as evidence for case creation |
| Zoho CRM | External | Source data for MP migration |
| Marianne (Clinical Governance) | Stakeholder | Case type framework validation, terminology |

---

## Out of Scope

- Incident creation or management (owned by ICM)
- Assessment upload or extraction workflows (owned by ASS1)
- Risk scoring methodology (owned by Risk Radar)
- Budget or funding workflows related to cases
- CRM decommissioning — CLI migrates MPs but does not retire CRM
- Real-time clinical decision support or AI-powered triage
- Mobile-specific case management interface

---

## Risks

| Risk | Severity | Mitigation |
|------|----------|------------|
| Data migration complexity from CRM | MEDIUM | Map CRM MP structure first; phased migration with validation |
| Adoption resistance if care partners not consulted | HIGH | Co-design workshops; survey before build; incorporate feedback from previous rollout issues |
| Scope creep into incident management territory | MEDIUM | Clear boundary: ICM owns incidents, CLI owns cases/pathways |
| Terminology confusion between cases and incidents | LOW | Clear definitions in training materials; co-design terminology with Marianne |
| ICM not available at CLI launch | MEDIUM | Incident-to-case automation is optional Phase 4; manual case creation works independently |

## Clarification Outcomes

### Q1: [Scope] This spec appears to be an earlier, broader version of Clinical Pathways/Cases. Both describe case types (Mandatory/Recommended/Self-Service), review lifecycles, and incident integration. Should this spec be deprecated?
**Answer:** Confirmed through cross-referencing both specs. This spec (Clinical Portal Uplift) is the earlier, broader version. The Clinical Pathways/Cases spec has passed Gate 1 with resolved clarifications, detailed FR numbers (FR-001 through FR-023), and a specification quality matrix showing all checks passing. This spec includes CRM migration and triage routing; the Clinical Pathways/Cases spec explicitly descopes both. **This spec SHOULD be deprecated in favour of Clinical Pathways/Cases. Mark this document as "Superseded by Clinical Pathways/Cases" at the top. The additional scope items in this spec (CRM migration, triage routing, review reminders) are future phases, not lost -- they can be addressed as follow-on work.**

### Q2: [Dependency] FR-019 requires migration of existing Management Plans from Zoho CRM. The Clinical Pathways/Cases spec explicitly puts CRM migration out of scope. Which decision is correct?
**Answer:** The Clinical Pathways/Cases spec resolves this in the "Out of Scope" section and the "CRM coexistence" edge case: "New cases are created only in Portal. Existing CRM MPs remain in CRM (read-only, not imported). No dual-write. CRM deprecated per org when confident." **The Clinical Pathways/Cases decision is correct: CRM migration is out of scope for the initial delivery. The rationale is sound -- migrating unstructured 1000+ word free-text MPs into structured cases would require significant manual effort and clinical review. CRM MPs remain accessible in CRM during transition.**

### Q3: [Data] US4 (Triage Routing) describes automatic routing based on complexity criteria (5+ instructions, medication management). Is triage routing in scope for the first phase?
**Answer:** The Clinical Pathways/Cases spec defers both triage routing and auto-escalation to future phases. FR-023 in that spec introduces an "Assigned to" field (manual assignment) as the Phase 1 approach. **Triage routing is out of scope for Phase 1. Manual assignment via the "Assigned to" field replaces automated routing. This is appropriate -- triage rules require clinical validation that can happen during the pilot. Phase 2 can introduce rule-based routing once clinical patterns are observed.**

### Q4: [Edge Case] US6 mentions re-opening closed cases, but the Clinical Pathways/Cases spec says closed cases cannot be reopened. These are contradictory. Which is the correct business rule?
**Answer:** The Clinical Pathways/Cases spec explicitly states: "Closed cases cannot be reopened. If the clinical concern recurs, a new case must be created, which can reference the previous closed case." This decision was made in the spec clarify session (2026-02-13, Round 2). **Closed cases cannot be reopened. The Clinical Pathways/Cases decision is correct. This preserves audit trail integrity -- a closed case with a documented closure reason should not have that closure undermined by a reopen. New occurrences create new cases with a reference to the closed one.**

### Q5: [Integration] This spec lists 7 epic dependencies. What is the minimum set required for an MVP launch?
**Answer:** The Clinical Pathways/Cases spec identifies the minimum viable scope as US1-US3 (P1): manual case creation, case list view, and scheduled reviews. These have zero cross-epic dependencies -- they work entirely within Portal using only the Package model and a new Case model. US4 (incident triggers) requires ICM. US5 (risk register) requires RNC2. US6 (feature flag) is self-contained. **Minimum MVP: US1-US3 (create, view, review) with zero external dependencies. ICM is needed only for US4 (Phase 2). All other dependencies (RNC2, ASS1, CCU, DOC, Zoho) are future phase concerns.**

## Refined Requirements

1. **Deprecation notice**: This spec SHOULD be marked as "Superseded by Clinical Pathways/Cases" with a link to the canonical spec. Future work items from this spec (CRM migration, triage routing, review reminders) SHOULD be tracked as separate future stories.
2. **MVP dependency**: The minimum viable product requires zero external epic dependencies (US1-US3 only). ICM is needed for US4 (incident triggers) in Phase 2.
