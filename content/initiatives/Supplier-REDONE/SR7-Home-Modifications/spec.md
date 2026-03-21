---
title: "Feature Specification: Home Modifications"
---

# Feature Specification: Home Modifications

**Feature Branch**: `sr7-home-modifications`
**Created**: 2026-03-19
**Author**: Will Whitelaw
**Status**: Draft
**Input**: HMF (Home Modifications Supplier Flow) Linear project

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Supplier Submits a Home Modification Quote (Priority: P1)

A supplier who provides home modification services can submit a quote through the portal for a specific client. The quote includes a description of the proposed work, itemised costs, and the client/consumer it is for. The quote is linked to the client record and becomes the basis for project approval and payment.

**Why this priority**: This is the entry point for every home modification project. Without quote submission, there is no structured starting point for the modification lifecycle. Every other story depends on a quote existing in the system.

**Independent Test**: Can be fully tested by logging in as a supplier, submitting a quote for an existing client, and verifying the quote appears linked to that client with all details captured.

**Acceptance Scenarios**:

1. **Given** a supplier with home modification capabilities, **When** they submit a quote for a client, **Then** the quote is saved with a description, itemised costs, total amount, and the client linkage.
2. **Given** a supplier submitting a quote, **When** the quote is saved, **Then** a new home modification project is created in "New" status with the quote attached. The project remains in "New" until a Care Partner or coordinator explicitly accepts the quote.
3. **Given** a client with multiple modification needs, **When** different suppliers submit quotes, **Then** all quotes are visible on the client's record and can be compared.
4. **Given** a supplier submitting a quote, **When** they attempt to save without a linked client, **Then** the system prevents submission and highlights the required field.
5. **Given** a supplier, **When** they view their submitted quotes, **Then** they see a list of all quotes with their status (pending, approved, rejected).

---

### User Story 2 - Home Modification Project Lifecycle (Priority: P1)

Each home modification follows a defined project lifecycle: New -> Quoted -> Documents Received -> Under Review -> Escalated -> Approved -> Rejected -> Completed. Care Partners and coordinators manage the project through each stage, with each transition enforcing prerequisites and recording an audit trail.

**Why this priority**: The lifecycle is the backbone of the module. Without defined stages and enforced transitions, the modification process remains ad-hoc. This is what replaces the email-and-spreadsheet tracking.

**Independent Test**: Can be tested by creating a project from a quote and advancing it through each stage, verifying that prerequisites are enforced and transitions are recorded.

**Acceptance Scenarios**:

1. **Given** a project in "New" status with a submitted quote, **When** a Care Partner or coordinator explicitly accepts the quote, **Then** the project moves to "Quoted" status.
2. **Given** a project in "Quoted" status, **When** all required documents for the client's state are uploaded, **Then** the project can move to "Documents Received" status.
3. **Given** a project in "Documents Received" status, **When** a coordinator begins review, **Then** the project moves to "Under Review" status.
4. **Given** a project in "Under Review" status, **When** the reviewer identifies an issue requiring escalation, **Then** the project moves to "Escalated" status with a reason.
5. **Given** a project in "Under Review" or "Escalated" status, **When** approval is granted, **Then** the project moves to "Approved" status and payment instalments can begin.
6. **Given** a project in any pre-completed status, **When** it is rejected, **Then** the project moves to "Rejected" status with a reason and no further payments are processed.
7. **Given** a project in "Approved" status with all payments completed and completion photos uploaded, **When** the final review is done, **Then** the project moves to "Completed" status.
8. **Given** any project stage transition, **When** the transition occurs, **Then** an audit trail entry records who made the transition, when, and any notes.

---

### User Story 3 - State-Specific Documentation Enforcement (Priority: P1)

Each state and territory has different documentation requirements for home modifications. The system maintains a configurable matrix mapping document types to states. When a project is created for a client in a specific state, the system shows which documents are required and prevents the project from advancing past "Quoted" until all required documents are uploaded.

**Why this priority**: Documentation compliance is a regulatory requirement. Without state-specific enforcement, missing documents are only discovered at audit — a significant compliance risk for high-value modifications.

**Independent Test**: Can be tested by creating projects for clients in different states and verifying that different document checklists appear and are enforced before advancing.

**Acceptance Scenarios**:

1. **Given** a home modification project for a client in NSW, **When** the project is viewed, **Then** the system displays the document checklist specific to NSW.
2. **Given** a home modification project for a client in QLD, **When** the project is viewed, **Then** the system displays a different document checklist specific to QLD.
3. **Given** a project in "Quoted" status with missing required documents, **When** a user attempts to advance to "Documents Received", **Then** the system prevents the transition and indicates which documents are still required.
4. **Given** a project in "Quoted" status with all required documents uploaded, **When** a user advances the project, **Then** the transition to "Documents Received" succeeds.
5. **Given** an administrator, **When** they update the documentation matrix (adding or removing a required document for a state), **Then** the change applies to new projects immediately and existing projects show updated requirements.

---

### User Story 4 - Payment Instalment Tracking (Priority: P1)

Home modification projects are paid in instalments tied to milestones (e.g., deposit, progress payment, completion payment). Each instalment is a separate payment linked to the project, the approved quote, and the client's budget. Instalments cannot exceed the approved quote total.

**Why this priority**: Staged payments are how home modifications are paid in practice. Without instalment tracking, the system cannot manage the financial lifecycle of a modification project.

**Independent Test**: Can be tested by creating an approved project, submitting payment instalments at different milestones, and verifying they are tracked against the quote total and budget.

**Acceptance Scenarios**:

1. **Given** an approved project with a quote total of $15,000, **When** a deposit instalment of $5,000 is submitted, **Then** the instalment is recorded with $10,000 remaining on the project.
2. **Given** a project with $10,000 remaining, **When** a progress instalment of $7,000 is submitted, **Then** the instalment is recorded with $3,000 remaining.
3. **Given** a project with $3,000 remaining, **When** an instalment of $5,000 is submitted (exceeding the remaining amount), **Then** the system rejects the instalment and indicates the maximum payable amount.
4. **Given** an instalment being submitted, **When** the client's linked budget has insufficient funds, **Then** the instalment is rejected with a budget insufficiency message.
5. **Given** a Care Partner viewing a project, **When** they check the payment section, **Then** they see all instalments with amounts, dates, milestone labels, and the remaining balance.
6. **Given** an instalment linked to a specific milestone, **When** the instalment is approved, **Then** the system records which milestone it relates to (deposit, progress, completion).

---

### User Story 5 - Progress and Completion Photo Uploads (Priority: P2)

Suppliers and Care Partners can upload photos at each project milestone as evidence of work progress and completion. Photos are linked to specific milestones and are viewable in the project timeline. Completion photos are required before a project can move to "Completed" status.

**Why this priority**: Photo evidence is critical for compliance and quality assurance but is dependent on the project lifecycle and payment milestones being in place first.

**Independent Test**: Can be tested by uploading photos at different milestones and verifying they appear in the project timeline and that completion photos are required for the final status transition.

**Acceptance Scenarios**:

1. **Given** an approved project, **When** a supplier uploads progress photos, **Then** the photos are linked to the current milestone and timestamped.
2. **Given** a project with multiple milestones, **When** photos are uploaded at different stages, **Then** the project timeline shows photos grouped by milestone.
3. **Given** a project in "Approved" status with all payments completed, **When** a user attempts to move to "Completed" without completion photos, **Then** the system prevents the transition and indicates that completion photos are required.
4. **Given** a project with completion photos uploaded, **When** the final review is done, **Then** the project can move to "Completed" status.
5. **Given** a Care Partner viewing a project, **When** they open the photo gallery, **Then** they see all photos chronologically with milestone labels and upload dates.

---

### User Story 6 - Child-Parent Project Structure (Priority: P2)

Complex home modifications can be structured as a parent project with child sub-projects. For example, a whole-of-house modification may have children for "Bathroom", "Kitchen", and "Access Ramp". Each child project has its own lifecycle, quotes, documents, and payment milestones. The parent project's status reflects the aggregate progress of its children.

**Why this priority**: Supports the real-world complexity of large modifications. Depends on the core project lifecycle (Story 2) being stable.

**Independent Test**: Can be tested by creating a parent project with two child projects, advancing each child independently, and verifying the parent status reflects the aggregate.

**Acceptance Scenarios**:

1. **Given** a parent home modification project, **When** a coordinator creates child sub-projects, **Then** each child has its own independent lifecycle, quote, document checklist, and payment milestones.
2. **Given** a parent project with three children, **When** two children are "Completed" and one is "Under Review", **Then** the parent project shows an aggregate status indicating partial completion (e.g., "2 of 3 sub-projects completed").
3. **Given** a parent project, **When** all child projects reach "Completed" status, **Then** the parent project can be moved to "Completed".
4. **Given** a parent project, **When** a user views it, **Then** they see a summary of all child projects with their individual statuses, quote totals, and payment progress.
5. **Given** a child project, **When** a user views it, **Then** the parent project is referenced and navigable.

---

### User Story 7 - Automated Linkage to Client Inclusions and Budget (Priority: P2)

When a home modification project is approved, the system automatically links it to the client's relevant inclusion (home modification entitlement under their package) and the corresponding budget line item. This leverages the assessment-budget-supplier chain from SR6 and ensures financial tracking is consistent.

**Why this priority**: Automates the connection between the modification project and the client's funding. Depends on SR6 assessment linkage and SR4 billing infrastructure.

**Independent Test**: Can be tested by approving a project and verifying the system auto-links to the correct inclusion and budget line item.

**Acceptance Scenarios**:

1. **Given** a home modification project being approved, **When** the approval is confirmed, **Then** the system automatically identifies the client's home modification inclusion and links the project to it.
2. **Given** a project being linked, **When** the client's budget has a home modification line item with sufficient funds, **Then** the linkage succeeds and the allocated amount is reserved.
3. **Given** a project being linked, **When** the client has no home modification inclusion or insufficient budget, **Then** the system warns the coordinator and prevents approval until the budget issue is resolved.
4. **Given** an approved project with a linked budget, **When** payment instalments are processed, **Then** each instalment draws down from the linked budget line item.

---

### User Story 8 - Home Modifications Tab in Supplier Portal (Priority: P3)

Suppliers who provide home modification services have a dedicated Home Modifications tab in their supplier portal profile. This tab shows all their active and completed projects, submitted quotes, and payment history. It serves as the supplier's single view of their home modification work.

**Why this priority**: Provides the supplier-facing view of the module. Important for supplier experience but not required for the core workflow which is managed by Care Partners and coordinators.

**Independent Test**: Can be tested by logging in as a supplier with home modification capabilities and verifying the tab displays their projects and quotes.

**Acceptance Scenarios**:

1. **Given** a supplier with home modification capabilities, **When** they view their portal profile, **Then** a Home Modifications tab is visible.
2. **Given** a supplier viewing the Home Modifications tab, **When** they have active projects, **Then** they see a list of all projects with status, client name, quote amount, and payment progress.
3. **Given** a supplier viewing the Home Modifications tab, **When** they have no projects, **Then** they see an empty state explaining how to submit their first quote.
4. **Given** a supplier without home modification capabilities, **When** they view their portal profile, **Then** the Home Modifications tab is not visible.

---

### Edge Cases

- What happens when a client moves interstate during an active project? The project retains the original state's documentation requirements (they were correct at the time of creation). A coordinator can manually update the state if the documentation requirements need to change, triggering a new checklist.
- What happens when a supplier's quote is approved but the supplier becomes deregistered before work is completed? The project is flagged for coordinator review. In-progress payments continue but no new instalments can be submitted by the deregistered supplier. The coordinator must arrange an alternative supplier or cancel the project.
- What happens when a parent project is rejected but some child projects are already completed and paid? Completed and paid child projects remain as-is. Only incomplete child projects are cancelled. The parent project status reflects "Partially Completed — Rejected".
- What happens when the documentation matrix is updated to add a new required document for a state, and existing projects in that state are already past "Documents Received"? Existing projects that have already passed the documentation stage are grandfathered — they are not blocked retroactively. A notification is sent to the coordinator flagging that new requirements exist.
- What happens when a payment instalment is submitted but the linked budget line item has been reduced since the project was approved? The instalment validation checks the current available budget at submission time. If funds are insufficient, the instalment is rejected and the coordinator is notified to resolve the budget shortfall.
- What happens when completion photos are uploaded but the image files are corrupt or unreadable? The system validates file integrity on upload and rejects corrupt files with a message asking the supplier to re-upload.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow supplier entities (per the two-tier Organisation > Supplier model from SR2) to submit quotes for home modifications, linked to a specific client, with description, itemised costs, and total amount. Projects are scoped to the submitting supplier entity.
- **FR-002**: System MUST support a home modification project lifecycle with defined stages: New -> Quoted -> Documents Received -> Under Review -> Escalated -> Approved -> Rejected -> Completed.
- **FR-003**: System MUST enforce stage transition prerequisites (e.g., documents required before advancing past "Quoted", completion photos required before "Completed").
- **FR-004**: System MUST record an audit trail for every project stage transition, capturing who, when, and notes.
- **FR-005**: System MUST maintain a configurable documentation matrix mapping required document types to states/territories (Boolean matrix: document type columns, state/territory rows).
- **FR-006**: System MUST display the correct state-specific document checklist based on the client's location and prevent advancement until all required documents are uploaded.
- **FR-007**: System MUST support payment instalments linked to project milestones, with each instalment tracked against the approved quote total.
- **FR-008**: System MUST prevent payment instalments that would cause the total paid to exceed the approved quote amount.
- **FR-009**: System MUST validate budget availability at instalment submission time and reject instalments when the linked budget has insufficient funds.
- **FR-010**: System MUST support photo uploads linked to specific project milestones, with file integrity validation on upload.
- **FR-011**: System MUST require completion photos before a project can transition to "Completed" status.
- **FR-012**: System MUST support child-parent project relationships, where child projects have independent lifecycles and the parent reflects aggregate status.
- **FR-013**: System MUST automatically link approved projects to the client's relevant inclusion and budget line item.
- **FR-014**: System MUST draw down payment instalments from the linked budget line item.
- **FR-015**: System MUST display a Home Modifications tab on supplier portal profiles when the supplier has home modification capabilities.
- **FR-016**: System MUST allow TC staff to update the state documentation matrix via Laravel Nova without code changes, with changes applying to new projects immediately.
- **FR-017**: System MUST grandfather existing projects that have passed the documentation stage when the matrix is updated — no retroactive blocking.
- **FR-018**: System MUST support the "Escalated" stage for projects requiring additional review, with a mandatory reason for escalation.
- **FR-019**: System MUST enforce role-based action boundaries: supplier-side actions (submit quote, upload documents, upload photos) are restricted to Supplier Admins and team members scoped to their entity; TC-side actions (lifecycle transitions, approval/rejection, payment processing, escalation) are restricted to Care Partners and coordinators; documentation matrix administration is restricted to TC staff via Nova.
- **FR-020**: System MUST send in-app notifications on stage transitions that require action from the other party — suppliers are notified on approval, rejection, escalation, and review start; TC staff are notified on quote submission, document upload, and completion photo upload.
- **FR-021**: System MUST require explicit quote acceptance by a Care Partner or coordinator to transition a project from "New" to "Quoted" — quote submission alone does not advance the project.

### Key Entities

- **Home Modification Project**: The central entity representing a modification job for a client. Owned by a specific supplier entity (per the two-tier Organisation > Supplier model from SR2). Has a defined lifecycle with stage transitions, links to quotes, documents, payments, and photos. Can be a parent with child sub-projects. Organisation Administrators can view projects across all their supplier entities.
- **Quote**: A supplier entity's proposed scope and cost for a modification. Linked to a specific client and project. Multiple quotes can exist per project (for comparison). One quote is explicitly accepted by a Care Partner or coordinator and becomes the basis for payment.
- **Documentation Matrix**: A configurable mapping of required document types per state/territory. Used to generate the checklist for each project based on the client's location. Managed by administrators.
- **Payment Instalment**: A staged payment linked to a project milestone. Tracked against the approved quote total and drawn from the client's budget line item. Each instalment records the milestone type (deposit, progress, completion).
- **Project Photo**: An image uploaded as evidence of work at a specific milestone. Timestamped and linked to the project timeline. Completion photos are a prerequisite for project completion.
- **Child Project**: A sub-project under a parent home modification. Has its own independent lifecycle, quote, documents, and payments. The parent project aggregates child statuses.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Suppliers can submit a home modification quote through the portal in under 5 minutes.
- **SC-002**: 100% of home modification projects follow the defined lifecycle — no ad-hoc status changes outside the defined transitions.
- **SC-003**: 100% of projects have all state-required documents uploaded before advancing to review — enforced by the system, not by user discipline.
- **SC-004**: Payment instalments never exceed the approved quote total — enforced at submission time.
- **SC-005**: All payment instalments are linked to a budget line item with validated available funds.
- **SC-006**: Every project stage transition has a complete audit trail (who, when, notes).
- **SC-007**: Completion photos are present for 100% of completed projects — enforced as a prerequisite for the "Completed" transition.
- **SC-008**: The state documentation matrix can be updated by an administrator within 2 minutes without developer involvement.
- **SC-009**: Care Partners can view the full lifecycle of a client's home modification (stages, documents, payments, photos) from a single project page.
- **SC-010**: Child-parent project aggregation correctly reflects the status of all sub-projects within 1 second of any child status change.
- **SC-011**: Home modification projects are scoped to the supplier entity level — Org Admins can view projects across all supplier entities under their ABN, while Supplier Admins see only their own entity's projects.

## Clarifications

### Session 2026-03-19 — Spec Clarification Lens

**Q1: The spec references "supplier" throughout but never addresses the two-tier Organisation > Supplier hierarchy from SR2. Should home modification projects belong to a supplier entity (scoped) or the organisation (shared)?**

Options considered:
- (a) Projects belong to the Organisation, visible to all supplier entities under the ABN
- (b) Projects belong to a specific Supplier entity, Org Admins get cross-entity visibility via the org dashboard
- (c) Projects can be assigned at either level depending on the modification type

**Answer: (b) — Projects belong to the supplier entity.** Each home modification project is owned by the supplier entity that submitted the quote. This is consistent with SR2 scoping (locations, workers, documents are all per-entity). Organisation Administrators get cross-entity visibility through the organisation dashboard (SR2 Story 1), but the project itself is scoped to the entity. No refactoring needed — the spec's use of "supplier" now explicitly means the supplier entity in the two-tier model.

*Applied*: Updated Key Entities to clarify "Supplier" means the supplier entity under an Organisation. Added SC-011 for entity-level scoping. Updated FR-001 to reference supplier entity. Story 8 implicitly correct (tab is per supplier entity profile).

---

**Q2: Who has permission to perform each action? The spec mentions "supplier", "Care Partner", "coordinator", and "administrator" without defining which roles can do what at each lifecycle stage.**

Options considered:
- (a) Define a full RBAC matrix for every action across all roles
- (b) Define role permissions per story group: supplier-side actions vs TC-side actions, using existing portal role conventions
- (c) Leave role assignment to implementation and handle via policies

**Answer: (b) — Split by supplier-side vs TC-side, following existing conventions.** Supplier-side actions (submit quote, upload documents, upload photos) are performed by Supplier Admins and their team members, scoped to their entity. TC-side actions (lifecycle transitions, approval/rejection, payment processing, escalation) are performed by Care Partners and coordinators. Documentation matrix administration is TC staff only (via Nova, consistent with other admin config). This avoids a complex RBAC matrix while making the ownership clear.

*Applied*: Added FR-019 for role-based action boundaries. Updated stories 1, 2, 3, 5 acceptance scenarios to clarify which role performs which action.

---

**Q3: What notifications should be sent on project stage transitions? The spec records audit trails but never specifies whether stakeholders are notified.**

Options considered:
- (a) Full notification matrix — email + in-app for every transition to every stakeholder
- (b) Notify only on transitions that require action from the other party (supplier notified on approval/rejection, TC notified on document upload/quote submission)
- (c) No notifications — stakeholders check the portal manually

**Answer: (b) — Action-required notifications only.** Suppliers are notified when their project is approved, rejected, escalated, or placed under review. TC staff (Care Partner/coordinator) are notified when a supplier submits a quote, uploads documents, or uploads completion photos. This keeps notifications meaningful and actionable without creating noise. Channel is in-app notification (existing portal notification system) — email is a future enhancement.

*Applied*: Added FR-020 for action-required notifications on stage transitions.

---

**Q4: Where is the documentation matrix administered? The spec says "administrators" can update it but does not specify the admin interface.**

Options considered:
- (a) Build a dedicated admin page in the portal frontend
- (b) Manage via Laravel Nova (existing admin tool pattern)
- (c) Seed from a config file, requiring a deployment to change

**Answer: (b) — Laravel Nova.** The documentation matrix is a low-frequency admin configuration (Sophie provides state requirements, they change rarely). Nova is the established pattern for this type of admin-only config management (see SR3 pricing admin, SR5 compliance config). This avoids building a dedicated frontend page for something that changes a few times per year. SC-008 is still met — Nova updates take under 2 minutes without developer involvement.

*Applied*: Updated FR-016 to specify Nova as the admin interface. No new stories needed.

---

**Q5: Who approves a quote and triggers the New -> Quoted transition? Story 1 says the supplier submits a quote, and Story 2 says "when the quote is accepted" the project moves to Quoted — but it is unclear who accepts it and what "accepted" means.**

Options considered:
- (a) The Care Partner/coordinator reviews and explicitly accepts the quote, triggering the transition
- (b) Quote submission itself triggers Quoted status automatically (no separate acceptance step)
- (c) Multiple quotes are collected, one is selected as "preferred", and that selection triggers Quoted

**Answer: (a) — Care Partner or coordinator explicitly accepts the quote.** The supplier submits a quote, which creates the project in "New" status. A Care Partner or coordinator then reviews the quote (comparing multiple quotes if available) and explicitly accepts one, which moves the project to "Quoted". This gives TC staff a review gate before the project enters the compliance pipeline. It also makes Story 1 AC3 (quote comparison) meaningful — comparison implies a selection step.

*Applied*: Updated Story 1 AC2 to clarify that project creation is in "New" status without auto-advancing. Updated Story 2 AC1 to specify that a Care Partner or coordinator performs the acceptance. Added FR-021 for explicit quote acceptance by TC staff.
