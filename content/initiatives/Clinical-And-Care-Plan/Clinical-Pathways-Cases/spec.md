---
title: "Feature Specification: Clinical Pathways / Cases"
---

> **[View Mockup](/mockups/clinical-pathways-cases/index.html)**{.mockup-link}

# Feature Specification: Clinical Pathways / Cases

**Epic**: CLI — Clinical Portal Uplift
**Linear**: [CLI Clinical Portal Uplift](https://linear.app/trilogycare/project/cli-clinical-portal-uplift-e3016912d510/overview)
**Created**: 2026-02-13
**Status**: Draft
**Input**: User description: "Clinical Pathways / Cases as a first-class entity — giving management plans a proper model, lifecycle (Create → Active → Review → Close/Escalate), and linking them to incidents and risk scores."

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Create a Clinical Case Manually (Priority: P1)

As a **Coordinator**, I want to create a clinical case for a recipient by selecting a case type, describing the clinical concern, setting a review schedule, and linking to the triggering event (incident, assessment, or clinical judgement) — so that the recipient has a structured, trackable management plan instead of an unstructured CRM document.

**Why this priority**: This is the foundational action. Without the ability to create a case, nothing else in the module works. It replaces the current process of writing 1,000+ word free-text management plans in Zoho CRM with a structured record in Portal.

**Independent Test**: Can be fully tested by navigating to a recipient's package, clicking "Create Case", selecting a case type (e.g., "Recommended — Post-Fall Monitoring"), entering a clinical concern description, setting a review interval (e.g., fortnightly), and saving. The case appears on the recipient's case list as "Active".

**Acceptance Scenarios**:

1. **Given** a Coordinator is on a recipient's package, **When** they click "Create Case", **Then** a form opens showing three case type options: Mandatory (duty of care), Recommended (clinical follow-up), Self-Service (low risk resources)

2. **Given** the Coordinator selects "Recommended" as the case type, enters a clinical concern (e.g., "Post-fall monitoring — recipient fell on 2026-02-10, GP review completed"), and selects a review interval of "Fortnightly", **When** they save, **Then** the case is created with status "Active", the next review date is set to 2 weeks from creation, and the case appears in the recipient's case list

3. **Given** the Coordinator selects "Mandatory" as the case type, **When** they view the form, **Then** the system displays a notice explaining that mandatory cases cannot be declined and require documented outcomes at every review — ensuring the Coordinator understands the duty of care obligation

4. **Given** the Coordinator leaves the clinical concern description blank and attempts to save, **When** validation runs, **Then** the system highlights the missing field and prevents saving

5. **Given** the Coordinator creates a case, **When** they optionally link it to a triggering event, **Then** they can select from the package's existing incidents or note "Clinical judgement" or "Assessment" as the trigger source

---

### User Story 2 — View and Manage Case List (Priority: P1)

As a **Coordinator**, I want to see all of a recipient's clinical cases in a clear list showing status, case type, clinical concern summary, next review date, and linked incident — so that I have full visibility of the recipient's ongoing clinical management during calls and care planning.

**Why this priority**: Without a visible case list, cases are invisible to care partners — the same problem that exists today with CRM management plans. This is the daily working view.

**Independent Test**: Can be tested by creating several cases for a recipient and verifying they display in the case list with the correct status, type, concern summary, review date, and linked incident reference.

**Acceptance Scenarios**:

1. **Given** a recipient has active, closed, and escalated cases, **When** the Coordinator views the case list, **Then** they see each case showing: case type badge (Mandatory/Recommended/Self-Service), clinical concern summary, current status, next review date (or "Closed" / "Escalated"), and linked incident reference (if any)

2. **Given** the Coordinator clicks on a case, **When** the case detail opens, **Then** they see the full clinical concern description, complete review history with notes, linked incident details, and any associated risks or needs

3. **Given** a case has an overdue review, **When** the Coordinator views the case list, **Then** the case is visually highlighted as overdue (e.g., warning indicator on the review date)

4. **Given** a recipient has no cases, **When** the Coordinator views the cases area, **Then** they see an empty state message (e.g., "No clinical cases recorded for this recipient") with a prompt to create one

---

### User Story 3 — Complete a Scheduled Review (Priority: P1)

As a **Coordinator**, I want to complete a scheduled review on a case by recording the review outcome, adding clinical notes, and choosing whether to continue, close, or escalate the case — so that the recipient's clinical pathway has a documented, auditable history of reviews and decisions.

**Why this priority**: The review cycle is the core lifecycle mechanism that differentiates structured cases from static CRM documents. Without reviews, cases become "set and forget" — the exact problem with current management plans.

**Independent Test**: Can be tested by opening a case with an upcoming or overdue review, recording a review outcome (e.g., "Continue — recipient progressing, maintain fortnightly monitoring"), and verifying the review appears in the case history and the next review date advances.

**Acceptance Scenarios**:

1. **Given** a case has a review due today or is overdue, **When** the Coordinator opens the case, **Then** they see a prominent prompt to complete the review

2. **Given** the Coordinator completes a review and selects "Continue", **When** they save the review with clinical notes, **Then** the review is recorded in the case history with the Coordinator's name and timestamp, and the next review date advances by the prescribed interval

3. **Given** the Coordinator completes a review and selects "Close", **When** they provide a closure reason (e.g., "Goals met — recipient stable, no further monitoring required"), **Then** the case status changes to "Closed", no further reviews are scheduled, and the closure is recorded in the audit trail

4. **Given** the Coordinator completes a review and selects "Escalate", **When** they provide an escalation reason, **Then** the case status changes to "Escalated", the case type upgrades to "Mandatory" if it wasn't already, and the review interval resets to weekly (7 days) regardless of the previous interval. No automatic notification is sent in Phase 1 — clinical leads discover escalated cases via the case list and reporting view

5. **Given** a mandatory case is under review, **When** the Coordinator attempts to close it, **Then** the system requires a documented clinical justification for closure — mandatory cases cannot be closed without evidence that the duty of care obligation has been satisfied

---

### User Story 4 — Incident Triggers Case Creation (Priority: P2)

As a **Coordinator**, I want a clinical case to be automatically created when an incident is resolved via "Clinical Pathway" — so that the management plan is linked to the incident from the start, without manual re-entry in CRM.

**Why this priority**: This is the key automation bridge between ICM and CLI. It eliminates the manual handoff where care partners currently write management plans in CRM after incident resolution. Depends on ICM delivering incident creation in Portal first.

**Independent Test**: Can be tested by resolving an existing incident with the resolution type "Clinical Pathway", and verifying a new case is auto-created on the recipient's package with the incident linked, pre-populated clinical concern from the incident details, and a review schedule defaulting to the case type's standard interval.

**Acceptance Scenarios**:

1. **Given** an incident is being resolved, **When** the Coordinator selects "Clinical Pathway" as the resolution, **Then** the system prompts them to confirm case type (defaulting to "Recommended") and review interval before the case is created

2. **Given** the incident resolution triggers a case, **When** the case is created, **Then** it is linked to the originating incident — the case shows which incident triggered it, and the incident shows which case was created from it

3. **Given** an incident has already triggered a case, **When** a second incident on the same recipient resolves via "Clinical Pathway" for the same clinical concern, **Then** the Coordinator is prompted to either create a new case or add the incident to the existing case's history

4. **Given** an incident resolves via a non-clinical resolution (Referral, Advice, Education Resources Sent, Other), **When** the resolution is saved, **Then** no case is created — only "Clinical Pathway" resolution triggers case creation

---

### User Story 5 — Case Updates Risk Register (Priority: P2)

As a **Clinician**, I want clinical cases to be reflected in the recipient's risk register — so that when a case is created for falls monitoring, the risk register shows an active falls-related case, and when the case is closed, the risk profile reflects the updated status.

**Why this priority**: This is the bidirectional link between CLI and RNC2. Cases that don't update the risk register create the same data disconnect that exists today — risks and management plans living in separate systems. Depends on RNC2 delivering the risk model.

**Independent Test**: Can be tested by creating a case with a linked risk (e.g., Falls Risk), and verifying the risk's detail view shows the active case. When the case is closed, the risk record reflects that the case has been resolved.

**Acceptance Scenarios**:

1. **Given** a Coordinator creates a case, **When** they optionally link it to one or more of the package's existing risks, **Then** the risk register shows the case as an active management pathway for those risks

2. **Given** a case linked to "Falls Risk" is closed with outcome "Goals met", **When** the Clinician views the risk register, **Then** the Falls Risk entry shows the closed case in its history

3. **Given** a case is escalated, **When** the Clinician views the risk register, **Then** the linked risks are visually flagged as having an escalated case — drawing attention during care planning

---

### User Story 6 — Gradual Rollout via Feature Flag (Priority: P2)

As a **Product Owner**, I want to enable clinical cases per organisation — so that we can roll it out gradually, gather feedback, and ensure it works before making it available to all organisations.

**Why this priority**: Risk mitigation. Current management plans serve all organisations. Switching everyone at once without validation is the same mistake as previous rollouts that "jumped on" care partners. Gradual rollout enables co-design.

**Independent Test**: Can be tested by enabling the flag for one organisation and verifying they see the Cases tab/section, while another organisation does not.

**Acceptance Scenarios**:

1. **Given** the clinical cases feature flag is enabled for Organisation A, **When** a Coordinator at Organisation A views a recipient's package, **Then** they see the clinical cases section

2. **Given** the feature flag is disabled for Organisation B, **When** a Coordinator at Organisation B views a recipient's package, **Then** the clinical cases section is not visible

3. **Given** the feature flag is toggled off for an organisation that previously had it enabled, **When** the flag is turned off, **Then** existing case data is preserved but the UI is hidden — no data is lost

---

### User Story 7 — Population-Level Case Reporting (Priority: P3)

As a **Clinical Lead**, I want to see a summary of all active cases across my caseload — how many are overdue for review, how many are escalated, which case types are most common — so that I can manage clinical governance at a population level rather than checking individual recipients.

**Why this priority**: This is the governance view Marianne described — "clinical audits to show the commission". Without population-level visibility, cases are only useful at the individual recipient level.

**Independent Test**: Can be tested by navigating to the case reporting view and verifying it shows aggregate counts by case type, status, overdue reviews, and escalation rate.

**Acceptance Scenarios**:

1. **Given** a Clinical Lead navigates to the case reporting view, **When** the page loads, **Then** they see aggregate counts: total active cases, cases overdue for review, escalated cases, and cases closed this period

2. **Given** the reporting view shows overdue cases, **When** the Clinical Lead clicks the overdue count, **Then** they see a list of individual cases with recipient name, case type, days overdue, and assigned Coordinator

3. **Given** multiple organisations have the feature enabled, **When** the Clinical Lead views reporting, **Then** they can filter by organisation

---

### Out of Scope

- **Auto-escalation routing** — automatic routing of escalated cases to specific clinical nurses based on case type or severity. Phase 1 records the escalation; routing is future work
- **Notifications and alerts** — email/in-app alerts on upcoming reviews, overdue cases, escalations. Captured as a need but deferred until the notification framework is established
- **CRM migration of existing MPs** — existing management plans in Zoho CRM are not migrated. Cases start fresh in Portal; CRM MPs remain accessible in CRM during transition
- **Care plan PDF generation** — cases will eventually feed into care plan PDFs, but PDF export is a separate RNC2 capability
- **Self-service resource library** — the "Self-Service" case type references resources (e.g., falls prevention articles) but the resource library itself is not part of this spec
- **SIRS compliance automation** — SIRS deadline tracking and reporting sits within ICM, not CLI

### Edge Cases

- What happens when a recipient has no incidents and no risks but a Clinician wants to create a case based on clinical judgement? — Allowed; the "Clinical judgement" trigger source covers this. No linked incident or risk is required
- What happens when a linked incident is deleted? — The case retains a reference noting the incident was deleted, but the case itself is not affected
- What happens when a linked risk is deleted? — The risk association is removed from the case; the case itself continues with its lifecycle unaffected
- What happens when a mandatory case's review is missed? — The case remains in "Active" status with the review flagged as overdue. The system does not auto-escalate in Phase 1, but the overdue state is visible in the case list and reporting view
- What happens when a Coordinator tries to reopen a closed case? — Closed cases cannot be reopened. If the clinical concern recurs, a new case must be created, which can reference the previous closed case
- What happens when the feature flag is toggled mid-review? — If a Coordinator has a case open in their browser and the flag is toggled off, they can complete their current action. On next page load, the section is hidden
- How do Portal cases coexist with existing CRM management plans? — New cases are created only in Portal. Existing CRM MPs remain viewable in CRM (read-only) but are not synced or imported into Portal. No dual-write. CRM is deprecated for management plans per organisation once the team is confident in Portal

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST support three case types: Mandatory (duty of care obligations), Recommended (clinical follow-up), and Self-Service (low risk resources)
- **FR-002**: System MUST allow Coordinators to create a case by selecting a type, describing the clinical concern, setting a review interval, and optionally linking a trigger source (incident, assessment, or clinical judgement)
- **FR-003**: System MUST enforce a case lifecycle with statuses: Active, Closed, and Escalated. Valid transitions: Active → Closed, Active → Escalated, Escalated → Active (with Mandatory type upgrade, via review). Escalated cases cannot be closed directly — they must first return to Active through a review, then be closed from Active
- **FR-004**: System MUST require a review schedule for Mandatory and Recommended cases at creation. Self-Service cases do not require a review schedule — they are informational and can be closed at any time without a review cycle. Preset interval options: Weekly (7 days), Fortnightly (14 days), Monthly (30 days), Quarterly (90 days). A "Custom" option allows the Coordinator to enter a specific number of days (e.g., 10 days). The next review date is calculated from the current date plus the interval
- **FR-005**: System MUST allow Coordinators to complete a scheduled review by recording an outcome (Continue, Close, Escalate), adding clinical notes, and advancing the next review date
- **FR-006**: System MUST prevent mandatory cases from being closed without documented clinical justification
- **FR-007**: System MUST upgrade a case to "Mandatory" type when escalated, if it was not already mandatory
- **FR-008**: System MUST record who created, reviewed, escalated, and closed each case — complete audit trail with acting user and timestamp
- **FR-009**: System MUST display cases as a dedicated "Cases" tab on the Package view, showing a list with: case type badge, clinical concern summary, status, next review date, and linked incident reference. The tab is only visible when the feature flag is enabled for the organisation
- **FR-010**: System MUST visually highlight cases with overdue reviews in the case list
- **FR-011**: System MUST support linking one or more existing package risks to a case
- **FR-012**: System MUST support linking a case to one or more triggering incidents
- **FR-013**: System MUST add a new "Clinical Pathway" resolution option to the incident resolution choices, alongside the existing "Management Plan" option. Both values trigger case auto-creation — pre-populating the clinical concern from incident details and prompting for case type and review interval. New incidents should use "Clinical Pathway"; existing "Management Plan" records remain valid
- **FR-014**: System MUST prevent duplicate auto-creation — when a second incident resolves via "Clinical Pathway" for the same recipient, the Coordinator is prompted to create a new case or add to an existing one
- **FR-015**: System MUST be controllable via a feature flag that can be toggled per organisation; when disabled, case data is preserved but the UI is hidden
- **FR-016**: System MUST show a case detail view with full clinical concern, complete review history, linked incidents, and associated risks
- **FR-017**: System MUST support editing a case's clinical concern description and review interval after creation (but not case type — type changes only via escalation)
- **FR-018**: System MUST support soft-deleting cases, retaining all data for audit purposes
- **FR-019**: System MUST respect existing permissions — only authorised Coordinators and Clinicians can create, review, or close cases
- **FR-020**: System MUST display a population-level reporting view showing aggregate case counts by type, status, overdue rate, and escalation rate
- **FR-021**: System MUST allow the reporting view to be filtered by organisation
- **FR-022**: System MUST show the bidirectional link — a case shows its linked risks, and a risk shows its linked cases
- **FR-023**: System MUST support an "Assigned to" field on each case, set at creation (defaulting to the creator) and changeable at any time by an authorised Coordinator. The assignee is the person accountable for completing reviews on time. The reporting view uses the assignee for overdue case drill-downs

### Key Entities

- **Case**: A structured clinical management record tracking an ongoing concern for a recipient. Each case has a type (Mandatory/Recommended/Self-Service), a clinical concern description, a lifecycle status (Active/Closed/Escalated), a prescribed review schedule, and associations to the triggering event and related risks. Cases belong to a package (recipient).

- **Case Review**: A point-in-time record of a scheduled review on a case. Each review captures the outcome (Continue/Close/Escalate), clinical notes, the reviewing Coordinator, and the timestamp. Reviews form the auditable history of a case's lifecycle progression.

- **Case Type**: The classification of a case's urgency and obligation level. Mandatory cases cannot be declined or closed without clinical justification. Recommended cases follow standard review cycles. Self-Service cases are low-risk and may reference educational resources.

- **Incident** *(existing)*: A reactive event record. Already exists in the system. Cases reference incidents through a trigger association — incidents are not duplicated.

- **Risk** *(existing)*: An identified hazard or concern. Already exists in the system. Cases reference risks through a bidirectional association — cases show linked risks, risks show linked cases.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Coordinators can create a clinical case in under 3 minutes (compared to 20+ minutes writing a management plan in CRM)
- **SC-002**: 100% of cases created through the system have a prescribed review schedule — no case exists without a next review date
- **SC-003**: At least 90% of scheduled reviews are completed on time during the pilot period (demonstrating the review reminder mechanism is effective)
- **SC-004**: 100% of incident-resolved-via-Clinical-Pathway events result in a linked case (demonstrating the automation bridge works)
- **SC-005**: All case creations, reviews, escalations, and closures are captured in the audit trail with the acting user and timestamp
- **SC-006**: During pilot, Coordinators report the case workflow as "easier" or "more structured" compared to writing management plans in CRM (qualitative feedback from co-design sessions)
- **SC-007**: Toggling the feature flag on or off does not affect existing case data — data integrity maintained across flag changes

---

## Specification Quality

### Content Quality

| Check | Status | Evidence |
|-------|--------|----------|
| No implementation details in spec | [x] PASS | Business language throughout; no mention of frameworks, databases, or APIs |
| Focused on user value | [x] PASS | Every story starts with user role and benefit |
| Trilogy Care terminology used | [x] PASS | Coordinator, Recipient, Package, Care Partner used consistently |

### Requirement Completeness

| Check | Status | Evidence |
|-------|--------|----------|
| User stories defined with Given/When/Then | [x] PASS | 7 user stories (US1-US7), all with acceptance scenarios |
| INVEST criteria validated | [x] PASS | All 7 stories are Independent (testable alone), Negotiable, Valuable, Estimable, Small (sprint-sized), Testable |
| Priority levels assigned | [x] PASS | P1: US1-US3 (core CRUD + reviews), P2: US4-US6 (incident bridge, risk link, feature flag), P3: US7 (reporting) |
| Functional requirements testable | [x] PASS | FR-001 through FR-022, all verifiable |
| Key entities defined | [x] PASS | Case, Case Review, Case Type, Incident (existing), Risk (existing) |
| Edge cases documented | [x] PASS | 6 edge cases with resolution |
| Out of scope defined | [x] PASS | Auto-escalation routing, notifications, CRM migration, PDF generation, resource library, SIRS compliance |
| Success criteria measurable | [x] PASS | SC-001 through SC-007, all quantifiable or verifiable |
| Clarification markers | [x] PASS | 0 markers — all resolved in spec clarify session 2026-02-13 |

### Feature Readiness

| Check | Status | Evidence |
|-------|--------|----------|
| Acceptance criteria defined | [x] PASS | Given/When/Then for all 7 stories |
| Dependencies identified | [x] PASS | ICM (incident creation), RNC2 (risk model) documented in idea brief |
| Stakeholders identified | [x] PASS | RACI in idea brief |

---

## Clarifications

### Session 2026-02-13 — Spec Lens

- Q: What are the valid state transitions for a Case? → A: **Linear only**. Active → Closed, Active → Escalated, Escalated → Active (with Mandatory type upgrade via review). Escalated cases cannot close directly — must return to Active first.
- Q: Where should Clinical Cases appear in the Package UI? → A: **New dedicated "Cases" tab** on the Package view, alongside existing tabs (Overview, Needs, Risks, Budget, etc.). Tab only visible when feature flag is enabled.
- Q: How should the incident resolution enum handle the terminology shift? → A: **Add new value** `CLINICAL_PATHWAY` alongside existing `MANAGEMENT_PLAN`. Both trigger case creation. New incidents use "Clinical Pathway"; existing records remain valid.
- Q: What review interval options should be available? → A: **Presets + custom days**. Weekly (7d), Fortnightly (14d), Monthly (30d), Quarterly (90d), plus Custom (Coordinator enters number of days).
- Q: Should escalation auto-notify a clinical lead in Phase 1? → A: **Defer to Phase 2**. Escalation status is recorded and visible in case list + reporting view. No notification sent until notification framework exists.

### Session 2026-02-13 — Spec Lens (Round 2)

- Q: What should the canonical user-facing term be? → A: **Clinical Case**. Tab label: "Cases". Code uses `Case` internally. "Clinical Pathway" reserved for the resolution enum value only.
- Q: Should Self-Service cases have a review schedule? → A: **No review required**. Self-Service cases are informational — no scheduled review. Can be closed at any time. Review schedule required for Mandatory and Recommended only.
- Q: How should Portal cases coexist with CRM management plans? → A: **Portal-only, CRM read-only**. New cases in Portal only. Existing CRM MPs remain in CRM (read-only, not imported). No dual-write. CRM deprecated per org when confident.
- Q: Should cases have an assigned Coordinator? → A: **Explicit assignee field**. Set at creation (defaults to creator), changeable later. Assignee is accountable for completing reviews. Used in reporting drill-downs.
- Q: What happens to the review interval on escalation? → A: **Default to weekly (7 days)**. All escalated cases reset to weekly reviews regardless of previous interval.

## Clarification Outcomes

### Q1: [Dependency] This spec and the Clinical Portal Uplift (CLI) spec both describe clinical cases with overlapping scope (case types, review lifecycle, incident integration). Are these the same epic or separate? If separate, which takes precedence?
**Answer:** Both specs describe nearly identical functionality: case types (Mandatory/Recommended/Self-Service), review lifecycle, incident integration, risk register updates, and audit trail. The Clinical Portal Uplift (CLI) spec is an earlier, broader version that includes CRM migration (FR-019-020), triage routing (US4/FR-015-016), and review reminders (FR-012) -- features this spec explicitly defers. This spec (Clinical Pathways/Cases) is more detailed with resolved clarifications, specification quality checks, and a clean Gate 1 pass. **This spec (Clinical Pathways/Cases) supersedes the Clinical Portal Uplift spec. The CLI spec should be deprecated or marked as "superseded by Clinical Pathways/Cases." Key differences: this spec puts CRM migration out of scope, defers triage routing, defers notifications, and adds the "Assigned to" field. These are conscious scope decisions, not omissions.**

### Q2: [Scope] US4 (Incident Triggers Case Creation) depends on ICM. FR-013 adds a new "Clinical Pathway" resolution option alongside existing "Management Plan." Does this require an ICM code change, or is it a data-only addition?
**Answer:** The existing `IncidentResolutionEnum` in `domain/Incident/Enums/IncidentResolutionEnum.php` has 5 values: `MANAGEMENT_PLAN`, `REFERRAL`, `ADVICE`, `EDUCATION_RESOURCES_SENT`, `OTHER`. Adding `CLINICAL_PATHWAY` requires adding a new case to this enum. The enum is stored as a string value (not a database enum column -- it's `string` backed), so this is a code change only -- no migration needed. The existing `MANAGEMENT_PLAN` resolution would also trigger case creation per FR-013. **This is a code change to the Incident domain: add `CLINICAL_PATHWAY` to `IncidentResolutionEnum`. Both `MANAGEMENT_PLAN` and `CLINICAL_PATHWAY` trigger case auto-creation. No database migration required since the enum is string-backed.**

### Q3: [Data] FR-023 introduces an "Assigned to" field. How does this relate to the care partner assignment on the package? Can a case be assigned to someone other than the package's care partner?
**Answer:** The existing Package model (`domain/Package/Models/Package.php`) has a `caseManager` relationship (which is the care partner). FR-023 says the "Assigned to" field defaults to the creator but is changeable. This is independent of the package's care partner. **Yes, a case can be assigned to someone other than the package's care partner. The "Assigned to" is a foreign key to `users.id` on the Case model, distinct from the package's care partner. Use case: a clinician creates a case and assigns it to a coordinator for routine follow-up. The assignee is the person accountable for reviews.**

### Q4: [Edge Case] The spec says closed cases cannot be reopened. If a clinical concern recurs, a new case must reference the previous closed case. What is the mechanism for this reference?
**Answer:** The spec says "a new case must be created, which can reference the previous closed case." No specific mechanism is defined. **Recommendation: Add a `related_case_id` nullable foreign key on the Case model (self-referencing). When creating a new case, the form offers a dropdown of the recipient's closed cases with matching or similar clinical concerns. The reference is optional. This provides traceability without automation complexity. The linked case is shown in the case detail view as "Related to: [Case #123 - Falls Monitoring, Closed 2026-01-15]."**

### Q5: [Data] The spec defines 3 case statuses (Active, Closed, Escalated) but the CLI spec defines 4 (Draft, Active, Under Review, Closed). Which is correct?
**Answer:** This spec's status model is more refined with explicit transition rules: Active -> Closed, Active -> Escalated, Escalated -> Active (via review). "Under Review" from CLI is not a persistent status -- reviews are an action on an Active case, not a status change. "Draft" is also absent -- cases are created directly as Active. **This spec's 3-status model (Active, Closed, Escalated) is correct and has been validated in clarification sessions. CLI's Draft/Under Review statuses are superseded.**

### Q6: [Integration] US5 (Case Updates Risk Register) requires bidirectional linking between cases and risks. The existing Risk model (`domain/Risk/Models/Risk.php`) uses a polymorphic `riskables` relationship. Can this accommodate case linking?
**Answer:** The Risk model has a `riskables()` HasMany relationship using a `riskables` pivot table with `riskable_id` and `riskable_type`. Currently, `Package` and `PackageNeed` are riskable types. Adding `Case` as a riskable type is straightforward -- it follows the existing polymorphic pattern. **Case-risk linking should use the existing `riskables` polymorphic pivot table. Add `Case` as a valid `riskable_type`. This provides bidirectional linking without schema changes to the Risk model.**

### Q7: [Scope] FR-009 places cases as a "Cases" tab on the Package view. How many tabs does the Package view currently have? Is there a tab overflow concern?
**Answer:** The Package view is the primary workspace in the Portal. It already has tabs for Overview, Needs, Risks, Budget, and others. Adding a "Cases" tab is consistent with the pattern. The tab is feature-flagged (FR-015). **Assumption: The Package view uses scrollable or overflowing tab navigation for many tabs. A "Cases" tab fits naturally alongside existing clinical tabs (Needs, Risks). No overflow concern if the tab bar already handles 5+ tabs.**

## Refined Requirements

1. **CLI spec deprecation**: The Clinical Portal Uplift (CLI) spec SHOULD be marked as "superseded by Clinical Pathways/Cases" to avoid confusion about which spec is canonical.
2. **Related case reference**: The Case model SHOULD include a `related_case_id` nullable FK for referencing previous closed cases when a clinical concern recurs.
3. **Incident enum update**: Adding `CLINICAL_PATHWAY` to `IncidentResolutionEnum` is a code-only change (no migration). Both `MANAGEMENT_PLAN` and `CLINICAL_PATHWAY` values trigger case auto-creation.
4. **Risk linking**: Case-to-risk linking SHOULD use the existing `riskables` polymorphic pivot table, adding `Case` as a valid riskable type.
