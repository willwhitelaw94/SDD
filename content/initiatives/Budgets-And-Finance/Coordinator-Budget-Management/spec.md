---
title: "Feature Specification: Coordinator Budget Management (CBM)"
description: "Coordinator tools for budget oversight, submission, and approval workflows"
---

> **[View Mockup](/mockups/coordinator-budget-management/index.html)**{.mockup-link}

**Status**: Draft
**Epic**: TP-2059 | **Initiative**: Budgets & Finance
**Prefix**: CBM | **Created**: 2026-01-14

---

## Overview

Coordinator Budget Management provides external care coordinators with structured tools to manage, duplicate, edit, and submit client budgets for approval within the Trilogy Care Portal. The feature introduces budget state management (Draft, Submitted, Approved, Rejected), coordinator-specific portfolio views segmented by client lifecycle status, visibility of utilisation rates and contract prices, and a formal approval workflow between coordinators and care partners. This supports efficient collaboration, regulatory compliance under Support at Home, and operational scalability for coordinator organisations with multiple users.

**Scope boundaries**: This specification covers the coordinator-facing budget management workflow including portfolio views, budget duplication/editing, state management, approval workflows, and utilisation visibility. It does not cover automated care partner inline edits, historical budget versioning beyond last draft/current, direct client access to coordinator workflows, or the client-facing budget view (covered by [Consumer Budget Preview](/initiatives/budgets-and-finance/consumer-budget-preview)).

---

## User Scenarios & Testing

### User Story 1 - Coordinator Views Client Portfolio (Priority: P1)

As a coordinator, I want to see all my clients segmented by new/active/archived, so that I can manage my portfolio efficiently.

**Why this priority**: Core workflow requirement - coordinators manage large client loads and need lifecycle-based segmentation to prioritise work.

**Acceptance Scenarios**:

1. **Given** a coordinator logs in, **When** they navigate to their dashboard, **Then** they see clients grouped by lifecycle status: New, Active, Archived
2. **Given** a coordinator has 50+ clients, **When** the dashboard loads, **Then** clients are paginated or scrollable with counts per segment
3. **Given** a coordinator belongs to a multi-user coordinator organisation, **When** they view the dashboard, **Then** they see only their assigned clients (or can filter to their portfolio)
4. **Given** a coordinator searches for a client, **When** they type a name, **Then** results filter across all segments

---

### User Story 2 - Coordinator Duplicates Budget into Draft (Priority: P1)

As a coordinator, I want to duplicate an existing budget into a new draft, so that I can edit without recreating from scratch.

**Why this priority**: Coordinators currently build draft budgets from scratch for small edits, wasting significant time across large portfolios.

**Acceptance Scenarios**:

1. **Given** a coordinator selects a client with an approved budget, **When** they click "Duplicate Budget", **Then** a new draft is created as a copy of the current approved budget
2. **Given** a draft has been created, **When** the coordinator edits service lines, **Then** changes are saved to the draft without affecting the current approved budget
3. **Given** a coordinator has an in-progress draft, **When** they return to the client later, **Then** the draft is preserved and accessible
4. **Given** a coordinator duplicates a budget, **When** the draft is created, **Then** all service lines, frequencies, rates, and funding allocations are copied

---

### User Story 3 - Coordinator Views Utilisation Rates (Priority: P1)

As a coordinator, I want to see utilisation rates and contract prices, so that I can plan services accurately within budget.

**Why this priority**: Without utilisation visibility, coordinators cannot make informed decisions about budget allocation, leading to over/under-spending.

**Acceptance Scenarios**:

1. **Given** a coordinator opens a client's budget view, **When** the view loads, **Then** service-level utilisation rates are displayed (percentage of allocated budget consumed)
2. **Given** utilisation data is available, **When** displayed, **Then** total package-level utilisation is also shown
3. **Given** a coordinator views a service line, **When** reviewing rates, **Then** both contract price (target) and sourced price are visible as distinct values
4. **Given** a service's sourced price exceeds the contract price, **When** displayed, **Then** a visual warning indicates the service is over budget

---

### User Story 4 - Coordinator Submits Draft for Approval (Priority: P1)

As a coordinator, I want to submit new budget drafts for approval, so that I can propose changes for review by my care partner.

**Why this priority**: Without a formal submission workflow, care partners have no structured way to receive, review, and action coordinator budget proposals.

**Acceptance Scenarios**:

1. **Given** a coordinator has a completed draft budget, **When** they click "Submit for Approval", **Then** the budget state changes to "Submitted"
2. **Given** a budget is submitted, **When** the state changes, **Then** the coordinator can see the status as "Submitted" and cannot further edit without creating a new revision
3. **Given** a budget has validation errors, **When** the coordinator attempts to submit, **Then** submission is blocked with specific error messages
4. **Given** a budget is submitted, **When** the care partner views their queue, **Then** the submission appears with the coordinator name, client name, and submission date

---

### User Story 5 - Care Partner Approves or Rejects Submission (Priority: P1)

As a care partner, I want to approve or reject coordinator submissions, so that I can validate accuracy and compliance before activating a budget.

**Why this priority**: Approval workflow ensures accountability, compliance with Support at Home funding rules, and prevents incorrect budgets from being activated.

**Acceptance Scenarios**:

1. **Given** a care partner has pending submissions, **When** they view their approval queue, **Then** they see a list of coordinator-submitted budgets with relevant details
2. **Given** a care partner reviews a submission, **When** they approve, **Then** the budget state changes to "Approved" and becomes the active budget
3. **Given** a care partner reviews a submission, **When** they reject, **Then** the budget state changes to "Rejected" and the coordinator is notified with the reason
4. **Given** a care partner approves a budget, **When** the state changes, **Then** the coordinator sees the updated "Approved" status on their dashboard
5. **Given** a budget is rejected, **When** the coordinator views it, **Then** they can see the rejection reason and create a new draft to address feedback

---

### User Story 6 - Budget Status Visibility and Notifications (Priority: P1)

As a care partner or coordinator, I want budget approval status and client-coordinator status apparent via the UI and automated notifications, so that I stay informed of changes.

**Why this priority**: Without notifications and visible status indicators, both parties must manually check for updates, causing delays and missed actions.

**Acceptance Scenarios**:

1. **Given** a budget state changes (Submitted, Approved, Rejected), **When** the change occurs, **Then** both coordinator and care partner receive portal and email notifications
2. **Given** a coordinator views their dashboard, **When** budgets have different states, **Then** status badges clearly show Draft/Submitted/Approved/Rejected
3. **Given** a client's coordinator status changes (New, Active, Archived), **When** updated, **Then** the change is reflected in dedicated status fields on both coordinator and care partner views

---

### User Story 7 - Coordinator User Sees Only Their Clients (Priority: P2)

As a coordinator user within a multi-user organisation, I want to see only (or at least filter by) my assigned clients, so that my portfolio is clear and manageable.

**Why this priority**: Coordinator organisations may have multiple users; each needs a focused view of their own client portfolio to work efficiently.

**Acceptance Scenarios**:

1. **Given** a coordinator organisation has 5 coordinator users, **When** one user logs in, **Then** they see only clients assigned to them by default
2. **Given** a coordinator wants to see all organisation clients, **When** they change the filter, **Then** they can view the full organisation portfolio
3. **Given** a new client is assigned to a coordinator, **When** the assignment is saved, **Then** the client appears in that coordinator's filtered view

---

### User Story 8 - Coordinator Rates Automatically Applied (Priority: P2)

As a system, I want coordinator rates automatically applied to clients, so that fees are consistent and accurate.

**Why this priority**: Manual rate application leads to inconsistencies and billing errors across large coordinator portfolios.

**Acceptance Scenarios**:

1. **Given** a coordinator organisation has default rates configured, **When** a new client is linked to a coordinator, **Then** the organisation's default rates are automatically applied
2. **Given** rates are applied automatically, **When** a coordinator views the budget, **Then** the applied rates match the organisation settings
3. **Given** an organisation updates their default rates, **When** new budgets are created, **Then** updated rates are applied (existing budgets retain their original rates)

---

### Edge Cases

- **Coordinator submits draft while care partner is on leave**: Submission should queue and remain in "Submitted" state until actioned; no timeout or auto-approval
- **Multiple coordinators editing the same client**: Only one draft should exist per client at a time; system should prevent conflicting edits
- **Care partner rejects a budget but coordinator has already started a new draft**: The new draft should not be affected by the rejection of the previous submission
- **Coordinator organisation user leaves**: Client assignments should be transferable to another coordinator within the organisation
- **Budget with zero services**: Draft should be saveable but not submittable; submission requires at least one service line

---

## Functional Requirements

- **FR-001**: The system MUST display coordinator clients segmented by lifecycle status: New, Active, Archived
- **FR-002**: The system MUST allow coordinators to duplicate an existing approved budget into a new draft
- **FR-003**: The system MUST preserve all service lines, frequencies, rates, and funding allocations when duplicating a budget
- **FR-004**: The system MUST display service-level and package-level utilisation rates (percentage of allocated budget consumed)
- **FR-005**: The system MUST display contract price alongside sourced price for each service as distinct values
- **FR-006**: The system MUST support budget state management with states: Draft, Submitted, Approved, Rejected
- **FR-007**: The system MUST provide a "Submit for Approval" action that transitions a draft to "Submitted" state
- **FR-008**: The system MUST provide care partners with an approval queue showing pending coordinator submissions
- **FR-009**: The system MUST support Approve and Reject actions with mandatory rejection reason
- **FR-010**: The system MUST send portal and email notifications when budget state changes
- **FR-011**: The system MUST display status badges (Draft/Submitted/Approved/Rejected) on coordinator dashboards
- **FR-012**: The system SHOULD filter the coordinator dashboard to show only the logged-in user's assigned clients by default
- **FR-013**: The system SHOULD automatically apply coordinator organisation default rates to linked clients
- **FR-014**: The system MUST prevent submission of budgets with validation errors
- **FR-015**: The system MUST NOT allow editing of a submitted budget without creating a new revision

---

## Key Entities

| Entity | Description |
|--------|-------------|
| **Coordinator Organisation** | Entity with one or multiple coordinator users, with organisation-level settings including default rates |
| **Coordinator User** | Individual with a unique login responsible for a portfolio of assigned clients |
| **Budget State** | Workflow status of a client budget: Draft, Submitted, Approved, Rejected |
| **Utilisation Rate** | Percentage of allocated budget consumed, calculated from billing/claims data |
| **Care Partner** | Internal Trilogy Care staff responsible for approving budgets and services for coordinated clients |
| **Contract Price** | The target/budget price for a service, distinct from the sourced/actual price |
| **Sourced Price** | The actual procurement cost from the supplier for a service |

---

## Success Criteria

### Measurable Outcomes

- 30% reduction in time for coordinators to draft and submit budgets
- 90% of budgets processed without manual rework
- 80% of coordinators actively using the utilisation dashboard
- Zero incorrect budget approvals due to missing state management
- Notification delivery within 5 minutes of state change

---

## Assumptions

- Budget V2 is live and stable as the foundation for coordinator workflows
- Coordinator organisation and user hierarchy structures already exist in the Portal
- Utilisation rate data can be sourced reliably from billing and claims data
- State management aligns with Support at Home governance requirements
- Care partners will adopt the approval workflow as their primary review mechanism

---

## Dependencies

- Budget V2 stability and completion
- Coordinator organisation and user hierarchy in Portal
- Claims and billing data for accurate utilisation rate calculations
- Integration with care partner approval workflows
- [Budget Reloaded](/initiatives/budgets-and-finance/budget-reloaded) for underlying budget data model enhancements
- Email/notification infrastructure for state change alerts

---

## Out of Scope

- Automated care partner inline edits (manual approval required; care partners must reject back to coordinator for changes)
- Historical budget versioning beyond last draft/current
- Direct client access to coordinator budget workflows
- Client-facing budget views (covered by [Consumer Budget Preview](/initiatives/budgets-and-finance/consumer-budget-preview))
- Coordinator fee invoicing and billing (separate workflow)
- Budget forecasting or predictive analytics

## Clarification Outcomes

### Q1: [Scope] Does the Coordinator Organisation entity already exist in the codebase?
**Answer:** Yes, partially. The `Organisation` model (`domain/Organisation/Models/Organisation.php`) exists with attributes including `type`, `parent_organisation_id`, `legal_trading_name`, `abn`, and `code`. The `CareCoordinator` model exists at `app/Models/Organisation/CareCoordinator.php`. The `CareCoordinatorService` at `app/Services/Organisation/CareCoordinatorService.php` provides coordinator-specific business logic. The `OrganisationWorker` model (`domain/Organisation/Models/OrganisationWorker.php`) represents users within organisations. The infrastructure for multi-user coordinator organisations exists. What may be missing: coordinator-specific default rate configuration at the organisation level and client assignment tracking. The `Organisation` model's `type` field likely distinguishes coordinator organisations from other types.

### Q2: [Dependency] FR-013 — where are coordinator organisation default rates configured?
**Answer:** Rate configuration exists in the budget domain. `GetBudgetPlanItemRateSourcesAction` and `BudgetPlanItemRateData` handle rate lookups. The `BudgetItemRateType` enum (WEEKDAY, SATURDAY, SUNDAY, etc.) defines rate types. However, organisation-level default rates (a rate card configured per coordinator organisation, auto-applied to new clients) would need to be built. The `config/permissions/care-coordinator-permission-list.php` confirms coordinator-specific permissions exist. Recommendation: add a `coordinator_default_rates` table or JSON configuration linked to the Organisation model. This is a P2 feature (US8) so it is not blocking MVP.

### Q3: [Edge Case] What happens if a coordinator tries to create a second draft when one already exists?
**Answer:** The `EnsureUserCanCreateBudgetPlan` action in `domain/Budget/Actions/EnsureUserCanCreateBudgetPlan.php` and `CheckBudgetPlanLimitReachedAction` suggest the system already has guards on budget plan creation. The `BudgetPlanStatus` enum (DRAFT, SUBMITTED, IN_REVIEW, ACTIVE, ARCHIVED, REJECTED) supports single-draft enforcement. Recommendation: block creation of a second draft with a clear error message directing the coordinator to their existing draft. The existing `DuplicateBudgetPlanAction` should check for in-progress drafts before creating a new one.

### Q4: [Data] Should utilisation data share the same data pipeline as DST and DTX?
**Answer:** Yes, it should. Utilisation rates are calculated as: (actual spending / planned budget) * 100. Actual spending comes from funding consumptions — the same data source used by DST (per ADR-001) and DTX. The codebase already has `FundingStreamUtilisationData` in `domain/Budget/Data/View/FundingStreamUtilisationData.php` with `UtilisationItemData` and `UtilisationTrendData`. The `AssembleBudgetPlanUtilisationTrendDataAction` assembles this data. This infrastructure exists and should be the shared source for CBM utilisation display, DST statements, and DTX transaction views. Consistency is critical — different calculation methods would create confusion.

### Q5: [UX] Does the approval workflow require ETN to be delivered first?
**Answer:** No, it can use the existing notification infrastructure. The codebase has `BudgetPlanSubmittedNotification`, `BudgetPlanInReviewNotification`, and `BudgetPlanRejectedNotification` in `domain/Budget/Notifications/`. These use Laravel's built-in notification system with database and mail channels. The approval workflow (Submitted -> Approved/Rejected) can follow the same pattern with new notification classes. ETN would provide configurable templates, but the basic notification infrastructure works without it. Recommendation: build with standard Laravel notifications now; migrate to ETN templates when available.

### Q6: [Data] The spec introduces a "Budget State" with Draft/Submitted/Approved/Rejected. How does this map to the existing BudgetPlanStatus enum?
**Answer:** The existing `BudgetPlanStatus` enum has: ACTIVE, DRAFT, SUBMITTED, IN_REVIEW, ARCHIVED, REJECTED. This already covers Draft and Rejected. "Submitted" maps to SUBMITTED. "Approved" maps to ACTIVE (when a budget is approved, it becomes the active budget). The spec's state model aligns well with the existing enum. No new enum values are needed — just clear documentation that "Approved" = ACTIVE status in the system.

### Q7: [Integration] How does the coordinator portfolio view relate to existing package/client data structures?
**Answer:** Clients are accessed through packages. The `Package` model (`domain/Package/Models/Package.php`) is the core entity linking clients to services, budgets, and coordinators. The `PackageService` (`app/Services/Package/PackageService.php`) handles package-level operations. Portfolio segmentation (New/Active/Archived) should be based on package status or lifecycle stage. The existing `ServicePlanInboxAllPackageTable` provides a table pattern for package listing. Coordinator client filtering would use the OrganisationWorker -> Package relationship.

### Q8: [Edge Case] What happens when a care partner is on leave and submissions queue up?
**Answer:** Per the spec's edge case: "Submission should queue and remain in Submitted state until actioned; no timeout or auto-approval." This is the correct approach. The existing BudgetPlanStatus supports this — SUBMITTED status persists until explicitly transitioned. No automated escalation is needed for MVP. Future enhancement: add configurable SLA alerts if submissions remain in SUBMITTED for >X days.

### Q9: [Permissions] How are coordinator vs care partner permissions differentiated?
**Answer:** The codebase has separate permission lists: `config/permissions/care-coordinator-permission-list.php` for coordinators and `config/permissions/organisation-permission-list.php` for organisations. The existing `User` model supports role-based access. Coordinators can create/edit drafts and submit; care partners can approve/reject. This maps to existing permission infrastructure.

### Q10: [Scope] FR-005 shows both "contract price" and "sourced price." Where do these values come from?
**Answer:** "Contract price" is the rate agreed in the budget plan item (the planned rate). "Sourced price" is the actual supplier price from invoices/bills. The `BudgetPlanItemRateData` and `PlannedServiceRateViewData` in the Bill domain provide planned vs actual comparisons. The budget view already shows some of this data through utilisation tracking. The distinction is important for coordinators to assess whether they are sourcing services at or below budget.

## Refined Requirements

- **FR-REFINED-001**: The "Approved" budget state MUST map to the existing `BudgetPlanStatus::ACTIVE` enum value to avoid introducing a new status.
- **FR-REFINED-002**: Coordinator organisation default rates (FR-013, P2) require a new data model (table or JSON config) linked to the Organisation entity. This should be designed but can be deferred to post-MVP.
- **FR-REFINED-003**: Utilisation rate calculations MUST use the same data pipeline (funding consumptions) as DST and DTX to ensure consistency across features.
- **FR-REFINED-004**: The single-draft-per-client constraint MUST be enforced in `DuplicateBudgetPlanAction` and `CreateBudgetPlanAction` with a clear user-facing error message.
