---
title: "Feature Specification: Package Level Upgrade Lodgement (SHIP)"
description: |-
  Epic: TP-XXXX-SHIP
  Initiative: TP-1869 Budgets and Services
  Created: 2024-12-19
  Status: Draft
  Input: User description: "Build a SHIP - Lodge a level upgrade workflow for package upgrades"
---

> **[View Mockup](/mockups/package-level-upgrade/index.html)**{.mockup-link}

**Epic:** TP-XXXX-SHIP
**Initiative:** TP-1869 Budgets and Services
**Created:** 2024-12-19
**Status:** Draft
**Input:** User description: "Build a SHIP - Lodge a level upgrade workflow for package upgrades"

## Overview

Package Level Upgrade is a **sub-table within the package view** that enables care coordinators to prepare and load upgrade requests. The workflow has defined stages and integrates with funding streams. Once coordinators have loaded the request, care partners can submit it through the government portal (myplace/NDIS portal).

## Key Concepts

- **Location**: Sub-table within the existing package page (not a separate page)
- **Stages**: Multi-step workflow with defined progression
- **Funding Stream Integration**: Requests relate to/reference existing funding streams
- **Two-Role Handoff**: Coordinators prepare → Care Partners submit to government

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View Level Upgrade Sub-Table (Priority: P1)

A care coordinator views the package and sees the Level Upgrade section showing any existing requests and their stages.

**Why this priority**: Entry point - coordinators need to see what exists before creating new requests.

**Independent Test**: Navigate to a package and verify the Level Upgrade sub-table is visible with correct data.

**Acceptance Scenarios**:

1. **Given** a coordinator views a participant's package, **When** the page loads, **Then** they see a "Level Upgrades" section/sub-table showing any existing upgrade requests
2. **Given** no level upgrade requests exist for this package, **When** coordinator views the section, **Then** they see an empty state with option to create a new request
3. **Given** multiple upgrade requests exist (historical), **When** coordinator views the section, **Then** requests are listed with their current stage and key details

---

### User Story 2 - Create New Level Upgrade Request (Priority: P1)

A care coordinator creates a new level upgrade request from within the package sub-table.

**Why this priority**: Core action that starts the workflow.

**Independent Test**: Click "New Request" in the Level Upgrades section and verify form appears with funding stream options.

**Acceptance Scenarios**:

1. **Given** coordinator is viewing the Level Upgrades section, **When** they click "New Level Upgrade", **Then** a form/modal opens to capture request details
2. **Given** the package has multiple funding streams, **When** coordinator creates request, **Then** they can select which funding stream(s) the upgrade relates to
3. **Given** coordinator completes required fields, **When** they save, **Then** the request appears in the sub-table with initial stage

---

### User Story 3 - Progress Request Through Stages (Priority: P1)

Coordinators and care partners move upgrade requests through defined workflow stages.

**Why this priority**: The staged workflow is central to the feature's purpose.

**Independent Test**: Advance a request from one stage to the next and verify stage updates correctly.

**Acceptance Scenarios**:

1. **Given** an upgrade request exists at Stage 1, **When** coordinator completes stage requirements, **Then** they can advance to Stage 2
2. **Given** a request is at a stage requiring Care Partner action, **When** Care Partner views it, **Then** they see their required actions clearly indicated
3. **Given** a request advances to final internal stage, **When** Care Partner reviews, **Then** they can mark it as ready for government submission
4. **Given** Care Partner submits to government portal, **When** they return, **Then** they can update the request status to reflect submission

---

### User Story 4 - Link to Funding Streams (Priority: P1)

Upgrade requests reference and display relevant funding stream information.

**Why this priority**: Funding stream integration is core to understanding the upgrade context.

**Independent Test**: View an upgrade request and verify funding stream details are displayed/linked.

**Acceptance Scenarios**:

1. **Given** coordinator creates an upgrade request, **When** they select funding streams, **Then** selected streams are linked to the request
2. **Given** an upgrade request is linked to funding streams, **When** anyone views the request, **Then** they see funding stream details (amounts, periods, utilization)
3. **Given** funding stream data changes, **When** upgrade request is viewed, **Then** it reflects current funding stream information

---

### User Story 5 - Care Partner Government Submission (Priority: P2)

Care partners can identify requests ready for government submission and track what they've submitted.

**Why this priority**: Enables the handoff workflow but secondary to core request creation.

**Independent Test**: As Care Partner, filter to "Ready for Submission" requests and mark one as submitted.

**Acceptance Scenarios**:

1. **Given** Care Partner views Level Upgrades, **When** filtering by "Ready for Submission", **Then** they see only requests awaiting government lodgement
2. **Given** Care Partner is submitting via government portal, **When** they complete submission, **Then** they can record submission details (reference number, date) in the system
3. **Given** government responds to submission, **When** Care Partner receives outcome, **Then** they can update request with approval/decline status

---

### User Story 6 - View Request History and Audit Trail (Priority: P3)

Users can see the full history of stage transitions and actions on an upgrade request.

**Why this priority**: Important for compliance but not blocking core workflow.

**Independent Test**: View a request's history and verify all stage changes are logged.

**Acceptance Scenarios**:

1. **Given** an upgrade request has progressed through stages, **When** user views request history, **Then** they see all stage transitions with timestamps and users
2. **Given** documents were attached at various stages, **When** viewing history, **Then** document additions are recorded in the timeline

---

### Edge Cases

- What happens if funding stream is modified while an upgrade request is in progress?
- How does system handle if coordinator and care partner work on same request simultaneously?
- What happens if government submission is rejected - can the request be resubmitted?
- How are historical/completed upgrade requests archived or purged?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display Level Upgrades as a sub-table/section within the package view
- **FR-002**: System MUST allow coordinators to create new upgrade requests from the sub-table
- **FR-003**: System MUST support linking upgrade requests to one or more funding streams
- **FR-004**: System MUST implement a staged workflow with defined progression rules
- **FR-005**: System MUST differentiate actions available to Coordinators vs Care Partners
- **FR-006**: System MUST allow Care Partners to record government submission details
- **FR-007**: System MUST track and display the current stage for each upgrade request
- **FR-008**: System MUST maintain audit history of stage transitions
- **FR-009**: System MUST display relevant funding stream information on upgrade requests
- **FR-010**: System MUST support filtering upgrade requests by stage/status

### Key Entities

- **Level Upgrade Request**: A request record within a package. Contains stage, linked funding streams, justification, submission details, and timestamps.
- **Upgrade Stage**: Defined workflow stages (e.g., Draft, Ready for Review, Ready for Submission, Submitted, Approved, Declined).
- **Funding Stream Link**: Association between an upgrade request and funding streams it relates to.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Coordinators can create and load an upgrade request within 5 minutes
- **SC-002**: Care Partners can identify requests ready for submission within 10 seconds
- **SC-003**: 100% of stage transitions are logged with user and timestamp
- **SC-004**: Users can view the current stage of any request at a glance from the package view
- **SC-005**: Funding stream information is visible on 100% of upgrade requests

## Assumptions

- Package pages already exist and can accommodate a new sub-table section
- Funding streams are already defined entities that can be linked/referenced
- Coordinators and Care Partners have distinct roles with different permissions
- Government submission happens outside the system (in NDIS portal) - we only track that it occurred
- Stage definitions will be finalized during clarification phase

## Open Questions

- [NEEDS CLARIFICATION: What are the exact stages in the workflow? (e.g., Draft → Review → Ready → Submitted → Outcome)]
- [NEEDS CLARIFICATION: What specific data is captured at each stage?]
- [NEEDS CLARIFICATION: Are there different "types" of level upgrades with different workflows?]

## Clarification Outcomes

### Q1: [Scope] Three NEEDS CLARIFICATION markers remain unresolved: stages, data per stage, types of upgrades.
**Answer:** These are critical blockers. The spec cannot proceed to development without resolving them. Based on aged care industry context and the Support at Home program: **Suggested stages:** Draft -> Under Review -> Ready for Submission -> Submitted to Services Australia -> Approved / Declined. **Suggested data per stage:** Draft (current level, requested level, justification, supporting docs), Under Review (coordinator review notes, approval), Ready for Submission (completed form data), Submitted (SA reference number, submission date), Approved (new level, effective date, new budget). **Types:** Level upgrade within SAH (Level 1->2, 2->3, etc.), reclassification. **These must be confirmed with the product owner before development.**

### Q2: [Dependency] Should the government portal reference be myplace (Services Australia) instead of NDIS?
**Answer:** Yes. TC Portal is an aged care platform operating under Support at Home (SAH), not NDIS. The codebase confirms this -- `app-modules/aged-care-api/` contains Services Australia API integration, and the SAH API spec (TP-432) handles all SA interactions. **The spec should reference "Services Australia (myplace portal)" throughout, not "NDIS portal."** The SAH API integration (FR-008 in SAH spec) handles entry records; level upgrade submissions may also flow through the SA API once the endpoint is available.

### Q3: [Data] Does the funding stream link use the existing PackageAllocation model?
**Answer:** The codebase has `domain/Package/Models/PackageAllocation.php` and `domain/Funding/Models/FundingStream.php` for managing funding allocations. **The upgrade request should reference FundingStream records, not PackageAllocation directly.** A new `level_upgrade_requests` table should include a `funding_stream_id` foreign key. When an upgrade is approved, a new FundingStream record is created or the existing one is modified, and the Package's classification is updated via `PackageAllocatedClassification`.

### Q4: [Edge Case] What happens when an upgrade is approved but the budget is committed?
**Answer:** Under SAH, a level upgrade results in a new quarterly budget allocation from Services Australia. The existing committed budget is not affected -- the upgrade increases the total available budget. **The approval should:** (a) create a new FundingStream with the upgraded level's budget, (b) update the PackageAllocatedClassification, (c) trigger a budget sync with the SA Budget API (per SAH spec FR-013). Existing committed services continue against the old budget until the new quarter.

### Q5: [UX] Is the Coordinator-prepares/Care Partner-submits handoff correct?
**Answer:** Per TC's role model (from MEMORY.md): Care Partner = PRIMARY field role, Coordinator = SECONDARY support/admin role. **The spec has the roles inverted.** In practice, Care Partners prepare the clinical justification (they know the client's needs), while Coordinators handle administrative submission. However, the spec says "coordinators prepare -> care partners submit to government" which means coordinators do the data entry and care partners do the final government portal submission. **This may be intentional if government portal access is restricted to Care Partners.** Needs product owner confirmation. If the roles are inverted, all user stories must be rewritten.

## Refined Requirements

1. **BLOCKER: Resolve the three NEEDS CLARIFICATION items** (stages, data per stage, types) with the product owner before any development work begins.
2. **Replace all "NDIS portal" references with "Services Australia (myplace portal)"** throughout the spec.
3. **Add a `level_upgrade_requests` table** with foreign keys to `packages`, `funding_streams`, and stage tracking fields.
4. **Confirm the Coordinator/Care Partner role assignment** with the product owner. Document the decision in the spec.
5. **Add integration with the SAH API** for automated submission when Services Australia exposes a level upgrade endpoint (currently manual via myplace).
