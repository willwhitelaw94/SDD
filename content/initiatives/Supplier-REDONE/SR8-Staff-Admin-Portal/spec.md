---
title: "Feature Specification: Staff Admin Portal"
---

# Feature Specification: Staff Admin Portal

**Feature Branch**: `sr8-staff-admin-portal`
**Created**: 2026-03-19
**Author**: Will Whitelaw
**Status**: Draft
**Dependency**: SR0 (API Foundation). Can run in parallel with supplier-facing epics. Can be DEFERRED if staff continue using the existing Inertia portal.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Staff Member Impersonates a Supplier's Active Administrator (Priority: P1)

A TC staff member needs to impersonate a supplier to investigate an issue or assist with configuration. The system selects an active administrator (Organisation Administrator or Supplier Administrator) rather than the hardcoded owner. If the owner has been deactivated or changed roles, impersonation still works — no 404 errors.

**Why this priority**: This is an active production bug causing support overhead. Staff encounter 404 errors when impersonating suppliers whose owners have changed roles (Mar 4 meeting).

**Independent Test**: Can be tested by impersonating a supplier whose original owner has been deactivated, verifying that the system picks an active administrator and the impersonation session works correctly.

**Acceptance Scenarios**:

1. **Given** a staff member viewing a supplier detail page, **When** they click impersonate, **Then** the system selects the active Organisation Administrator (or Supplier Administrator if no org admin exists) and starts the impersonation session.
2. **Given** a supplier whose original owner has been deactivated, **When** a staff member attempts to impersonate, **Then** the system picks the next active administrator and the session works without errors.
3. **Given** a supplier with no active administrators, **When** a staff member attempts to impersonate, **Then** the system displays a clear warning explaining that no active administrator exists, and offers to assign one.
4. **Given** a staff member impersonating a supplier, **When** the impersonation starts, **Then** the staff member can see and interact with the portal exactly as the selected administrator would — including their role-appropriate permissions.

---

### User Story 2 - Staff Member Views Organisation Hierarchy (Priority: P1)

A TC staff member viewing a supplier detail page can see the full organisation hierarchy — which organisation the supplier belongs to, what other supplier entities exist under that ABN, and the aggregate compliance status across all entities.

**Why this priority**: The two-tier model (SR0) means suppliers now exist within organisations. Without organisation-level visibility, staff cannot understand the full picture when handling support requests.

**Independent Test**: Can be tested by navigating to a supplier that belongs to a multi-supplier organisation and verifying that all sibling suppliers, their compliance status, and the organisation details are visible.

**Acceptance Scenarios**:

1. **Given** a staff member viewing a supplier detail page, **When** the supplier belongs to a multi-supplier organisation, **Then** the page shows the organisation name, ABN, and a list of all supplier entities under that organisation with their compliance status.
2. **Given** a staff member viewing the organisation section, **When** they click on a sibling supplier entity, **Then** they navigate directly to that supplier's detail page.
3. **Given** a staff member viewing a single-supplier organisation, **When** they view the organisation section, **Then** it shows the organisation details but indicates this is the only supplier entity.
4. **Given** a staff member on the supplier index page, **When** they search for suppliers, **Then** the results include the organisation name alongside the supplier name and ABN.

---

### User Story 3 - Staff Member Distinguishes Roles on Supplier Detail Page (Priority: P1)

A TC staff member viewing the team tab of a supplier can clearly see each user's role — Organisation Administrator, Supplier Administrator, or team member — and understand the distinction. The owner role is clearly separated from the administrator role.

**Why this priority**: Role confusion between owner and administrator causes incorrect access decisions and support escalations (Feb 25 meeting). This must be resolved for the two-tier model to work.

**Independent Test**: Can be tested by viewing the team tab of a supplier with users in different roles and verifying that each role is clearly labelled and visually distinct.

**Acceptance Scenarios**:

1. **Given** a staff member viewing the team tab of a supplier, **When** users have different roles, **Then** each user's role is displayed with a clear label (Organisation Administrator, Supplier Administrator, Team Member).
2. **Given** a staff member viewing the team tab, **When** the original owner is also an Organisation Administrator, **Then** both designations are visible — the system does not conflate "owner" with "administrator".
3. **Given** a staff member with appropriate permissions, **When** they need to reassign the Organisation Administrator role, **Then** they can do so from the team tab with a confirmation step.
4. **Given** a staff member attempting to remove the last Organisation Administrator, **When** they try to remove or downgrade them, **Then** the system prevents it and explains that at least one Organisation Administrator is required.

---

### User Story 4 - Staff Member Reviews a Unified Approval Queue (Priority: P2)

A TC staff member can view all pending supplier actions — document approvals, stage updates, and credentialing checks — in a single prioritised queue. They can filter by type, priority, and age to focus on the most urgent items.

**Why this priority**: Currently, approvals are spread across separate views (StaffSupplierPendingController, StaffSupplierApprovalDocumentController). Consolidating them reduces missed items and improves turnaround time.

**Independent Test**: Can be tested by creating pending items of each type and verifying they all appear in the unified queue with correct filtering.

**Acceptance Scenarios**:

1. **Given** a staff member navigating to the approval queue, **When** there are pending items across different types (documents, stage updates, credentialing), **Then** all items appear in a single list sorted by age (oldest first).
2. **Given** a staff member viewing the approval queue, **When** they apply a filter by type, **Then** only items of that type are shown — and the count for each type is visible.
3. **Given** a staff member viewing a queue item, **When** they click on it, **Then** they navigate to the appropriate approval view (document approval, stage update, or credentialing check) with the item pre-selected.
4. **Given** a staff member who has actioned an approval, **When** they return to the queue, **Then** the item is no longer listed (or moves to a "completed" section if viewing history).

---

### User Story 5 - Staff Member Views Coordinator-Supplier Linkage (Priority: P2-DEFERRED, blocked on PLA-1312)

A TC staff member viewing a supplier detail page can see which coordinators are linked to that supplier and the nature of the relationship. This surfaces the work from PLA-1312.

**Why this priority**: Coordinator linkage is being built (PLA-1312, Jay's Loom demo) but the staff-facing UI does not yet show it. Staff need this visibility for support and operations.

**Independent Test**: Can be tested by viewing a supplier that has linked coordinators and verifying the relationships are displayed on the detail page.

**Acceptance Scenarios**:

1. **Given** a staff member viewing a supplier detail page, **When** the supplier has linked coordinators, **Then** the coordinators are listed with their names and linkage type.
2. **Given** a staff member viewing a supplier with no linked coordinators, **When** they view the coordinator section, **Then** an empty state indicates no coordinators are linked and offers an action to link one.
3. **Given** a staff member viewing the coordinator section, **When** they click on a coordinator name, **Then** they navigate to the coordinator's profile.

---

### User Story 6 - Staff Member Manages Supplier Stage Transitions with Organisation Context (Priority: P2)

A TC staff member managing a supplier's stage (e.g., moving from Pending to Approved) can see the organisation context — whether other supplier entities under the same ABN are at different stages — and can process stage changes with full awareness of the organisation's overall status.

**Why this priority**: With the two-tier model, a supplier entity's stage change may have implications for sibling entities. Staff need this context to make informed decisions.

**Independent Test**: Can be tested by changing a supplier's stage while a sibling entity is at a different stage, verifying the organisation context is visible during the transition.

**Acceptance Scenarios**:

1. **Given** a staff member initiating a stage change for a supplier, **When** sibling supplier entities exist under the same organisation, **Then** the stage change dialog shows the current stage of all sibling entities.
2. **Given** a staff member completing a stage change, **When** the change is saved, **Then** the supplier's stage is updated and an audit trail entry is created.
3. **Given** a staff member viewing the timeline tab, **When** stage changes have occurred, **Then** the timeline shows who made each change, when, and includes organisation context if relevant.

---

### User Story 7 - Staff Member Searches and Filters Suppliers with Organisation Awareness (Priority: P3)

A TC staff member can search for suppliers by name, ABN, trading name, or organisation name. Search results group related supplier entities under their organisation, making it easy to find all entities for a given ABN.

**Why this priority**: Search is already functional but does not understand the organisation layer. This enhancement makes the two-tier model discoverable.

**Independent Test**: Can be tested by searching for an ABN that has multiple supplier entities and verifying they are grouped under their organisation in the results.

**Acceptance Scenarios**:

1. **Given** a staff member searching by ABN, **When** the ABN has multiple supplier entities, **Then** the results group all entities under the organisation with a visual hierarchy.
2. **Given** a staff member searching by supplier name, **When** the result belongs to a multi-supplier organisation, **Then** the organisation name and sibling count are shown alongside the result.
3. **Given** a staff member filtering the supplier index by stage, **When** they apply the filter, **Then** the results respect the filter and maintain organisation grouping.

---

### Edge Cases

- What happens when a supplier is not yet assigned to an organisation (legacy data not yet migrated)? The system should display the supplier normally without the organisation section, and flag it for staff as "organisation assignment pending".
- What happens when impersonation is attempted during a token-based auth session? Impersonation creates a session-based context on the staff side — the impersonated supplier's API tokens are not affected.
- What happens when two staff members are simultaneously approving items for the same supplier? The second approval should show a warning that the item was already actioned, and refresh the queue.
- What happens when a coordinator linked to a supplier is deactivated? The linkage should show the coordinator as inactive but preserve the historical relationship.
- What happens when a staff member tries to reassign the Organisation Administrator role to a user who only has supplier-level access? The system should allow this elevation with appropriate confirmation, and the user's access scope expands to all supplier entities.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST select an active administrator (Organisation Administrator or Supplier Administrator) when staff initiate impersonation — never a hardcoded owner or deactivated user.
- **FR-002**: System MUST display a clear error with resolution options when impersonation is attempted on a supplier with no active administrators.
- **FR-003**: System MUST display the full organisation hierarchy on the supplier detail page, including organisation name, ABN, and all sibling supplier entities with their compliance status.
- **FR-004**: System MUST allow staff to navigate directly from one supplier entity to a sibling entity within the same organisation.
- **FR-005**: System MUST clearly display each user's role (Organisation Administrator, Supplier Administrator, Team Member) on the team tab, with the owner designation shown separately from administrator roles.
- **FR-006**: System MUST allow authorised staff to reassign the Organisation Administrator role, with a confirmation step and a guard preventing removal of the last Organisation Administrator.
- **FR-007**: System MUST provide a unified approval queue that aggregates pending document approvals and stage updates into a single sortable, filterable view. Credentialing checks will be added as a future extension when the credentialing workflow exists (see CQ-3).
- **FR-008**: System MUST allow the approval queue to be filtered by item type (document, stage update) and sorted by age. Credentialing type added when available.
- **FR-009**: *(DEFERRED — blocked on PLA-1312)* System MUST display linked coordinators on the supplier detail page, leveraging the data from PLA-1312.
- **FR-010**: System MUST show the organisation context (sibling entity stages) when a staff member initiates a stage change for a supplier entity.
- **FR-011**: System MUST record an audit trail entry for every stage change, including the staff member who made it and a timestamp.
- **FR-012**: System MUST support supplier search by organisation name and group search results by organisation when multiple entities share an ABN.
- **FR-013**: System MUST handle legacy suppliers not yet assigned to an organisation by displaying them normally and flagging them as "organisation assignment pending".
- **FR-014**: System MUST support concurrent approval actions by showing a warning when an item has already been actioned by another staff member.

### Key Entities

- **Staff Supplier View**: The enhanced supplier detail page with organisation hierarchy, role visibility, coordinator linkage, and stage management — built on top of the existing StaffSupplierController.
- **Organisation Hierarchy Panel**: A section on the supplier detail page showing the parent organisation, sibling supplier entities, and aggregate compliance metrics.
- **Unified Approval Queue**: An aggregated view combining pending items from StaffSupplierPendingController and StaffSupplierApprovalDocumentController, with filtering and sorting.
- **Coordinator Linkage**: The relationship between coordinators and supplier entities as defined by PLA-1312, surfaced in the staff supplier detail view.
- **Impersonation Target**: The logic that selects which user to impersonate — changed from hardcoded owner to active administrator selection.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Zero 404 errors from impersonation after deployment — impersonation succeeds for 100% of suppliers with at least one active administrator.
- **SC-002**: Staff can identify the organisation hierarchy for any supplier in under 2 clicks from the supplier index.
- **SC-003**: Role labels (Organisation Administrator, Supplier Administrator, Team Member) are visually distinct and present for 100% of users on the team tab.
- **SC-004**: The unified approval queue shows all pending items from all approval types — zero items are missed due to type-based separation.
- **SC-005**: Coordinator linkage is visible on the supplier detail page for 100% of suppliers with linked coordinators.
- **SC-006**: Stage changes include organisation context (sibling stages) when the supplier belongs to a multi-supplier organisation.
- **SC-007**: Supplier search returns organisation-grouped results when searching by ABN — all entities under that ABN are visible in the results.
- **SC-008**: Legacy suppliers without organisation assignment are accessible and clearly flagged — no broken pages or missing data.

---

## Clarifications

*Resolved during spec clarification review (2026-03-19).*

### CQ-1: Impersonation Target Selection — Role Fallback vs SR0 Dependency

**Gap**: The spec references "Organisation Administrator" as the preferred impersonation target (US1-AC1, FR-001), but this role does not exist in the current codebase. Today there are only `Supplier Administrator` and `Supplier` roles (assigned via Spatie), plus the `owner_user_id` field on both Organisation and Supplier models. The "Organisation Administrator" role is planned as part of SR0. The impersonation bug (404 on deactivated owner) is a production issue today.

**Options**:
- **(a) Fix impersonation now with current roles, extend later for Org Admin** — Implement the fix using the existing role hierarchy: pick the first active `Supplier Administrator` from `OrganisationWorker` (status=ACTIVE, user has `Supplier Administrator` role), fall back to the `owner_user_id` user if active, then show the "no admin" warning. When SR0 ships and introduces `Organisation Administrator`, extend the fallback chain to prefer Org Admin first. This decouples the bug fix from SR0.
- (b) Wait for SR0 to ship the Organisation Administrator role, then implement impersonation with the full hierarchy — Delays the bug fix until SR0 lands.
- (c) Introduce the Organisation Administrator role in SR8 ahead of SR0 — Risks diverging from the SR0 role model design.

**Decision**: **(a) Fix now with current roles, extend later.** The impersonation bug is a production issue. The fallback chain (`Supplier Administrator` with active OrganisationWorker > active owner > warning) can be implemented immediately against `GetRedirectUrlForImpersonateUserAction` and the impersonation trigger. When SR0 introduces Organisation Administrator, the chain gets an extra tier at the top. No SR0 dependency for the bug fix.

**Spec impact**: US1 and FR-001/FR-002 are updated to reflect the two-phase approach. Phase 1 (pre-SR0): select active Supplier Administrator or active owner. Phase 2 (post-SR0): prefer Organisation Administrator, then Supplier Administrator, then warning. The user stories and ACs remain valid for both phases — the "Organisation Administrator" references become applicable once SR0 ships.

---

### CQ-2: Organisation Hierarchy Panel — Existing Inertia Tabs vs New Section

**Gap**: US2 says staff should see the "full organisation hierarchy" on the supplier detail page, but the current `StaffSupplierController::show()` renders tab-based views (`Staff/Suppliers/tabs/{Tab}.vue`). The spec does not clarify whether the org hierarchy is a new tab, a panel within the existing Overview tab, or a sidebar. The Organisation model already has `suppliers()` (HasManyThrough via Business), so the data path exists.

**Options**:
- **(a) Add an "Organisation" info card to the existing Overview tab** — Adds a collapsible card showing org name, ABN, and a list of sibling suppliers with stage/compliance badges. Minimal disruption to the existing tab structure. The `SupplierOverview.vue` already renders supplier details; this is one more card.
- (b) Create a new "Organisation" tab — A dedicated tab with full org details, sibling suppliers, aggregate metrics. More real estate but adds navigation friction for a panel most staff will glance at briefly.
- (c) Add a persistent sidebar panel visible across all tabs — Maximum visibility but requires layout changes to the entire staff supplier detail page.

**Decision**: **(a) Info card on the existing Overview tab.** Staff need a quick glance at org context, not a deep-dive page. A collapsible card on SupplierOverview keeps the information discoverable without layout rework. The card links to sibling suppliers via `route('suppliers.show', ...)`. For single-supplier orgs, the card shows "Only supplier entity" instead of a list.

**Spec impact**: US2-AC1 through AC3 are satisfied by the overview card. US2-AC4 (search results showing org name) is a separate index-level change to `StaffSuppliersTable`. No new tab or layout changes required.

---

### CQ-3: Unified Approval Queue — New Page vs Enhanced Existing Views

**Gap**: US4 calls for a "unified approval queue" but today `StaffSupplierPendingController` and `StaffSupplierApprovalDocumentController` are separate Inertia pages with different table classes (`StaffSuppliersPendingTable`, `StaffSupplierDocumentApprovalsTable`). The spec does not clarify whether to merge these into a single new page, add tabs/filters to one of them, or keep both and add a dashboard widget. Also, "credentialing checks" are mentioned but there is no existing credentialing controller — this may be a future SR0/SR3 concern.

**Options**:
- **(a) Add type-filter tabs to the existing Pending page, defer credentialing** — Extend `StaffSupplierPendingController` to accept a `type` filter. Add tab-style filters (Documents, Stage Updates, All) to the existing pending page. Credentialing is deferred until the credentialing workflow exists (SR3 or later). This avoids building infrastructure for a workflow that does not exist yet.
- (b) Build a brand-new unified queue page from scratch — More work, clean slate, but duplicates existing table infrastructure.
- (c) Keep both pages separate and add a dashboard summary widget — Least disruptive but does not solve the "missed items" problem.

**Decision**: **(a) Extend the existing Pending page with type-filter tabs, defer credentialing.** The pending page already has table infrastructure. Adding a type filter and merging document approvals into it is straightforward. Credentialing checks do not exist yet in the codebase — specifying them now is premature. When credentialing lands, it becomes another tab/type in the same queue.

**Spec impact**: FR-007 and FR-008 are narrowed: the unified queue aggregates document approvals and stage updates only. Credentialing is noted as a future extension. US4-AC1 is updated to reflect the two current types. FR-014 (concurrent approval warning) remains as-is — it applies to any approval type.

---

### CQ-4: Coordinator-Supplier Linkage — Hard Dependency on PLA-1312 Data Model

**Gap**: US5 says staff should see "linked coordinators" on the supplier detail page, leveraging PLA-1312. But the codebase has no `coordinator_supplier` pivot or explicit linkage table yet — Organisation already has `careCoordinators()` (HasManyThrough via Business), which relates coordinators to the same business/org as the supplier. PLA-1312 is in progress (Jay's Loom demo) and the data model is not finalised. Building a UI against an uncommitted data model risks rework.

**Options**:
- **(a) Defer US5 entirely until PLA-1312 ships its data model** — Mark US5 as blocked on PLA-1312. When the linkage table/relationship lands, add the UI as a fast-follow. This avoids building against a moving target.
- (b) Build the UI now using the existing `Organisation->careCoordinators()` relationship — Shows coordinators linked to the same organisation/business, which is a reasonable approximation but may not match PLA-1312's final model.
- (c) Stub the UI with a placeholder section that says "Coming soon" — Ships something visible but non-functional.

**Decision**: **(a) Defer US5 until PLA-1312 ships.** The coordinator linkage data model is not finalised. Building UI against `careCoordinators()` may not match the final PLA-1312 design, causing rework. US5 is moved to a "Deferred" section and will be picked up as a fast-follow once PLA-1312's data model is merged. FR-009 is also deferred.

**Spec impact**: US5 priority changed from P2 to P2-DEFERRED. FR-009 marked as deferred pending PLA-1312. SC-005 deferred accordingly. The edge case about deactivated coordinators remains valid for the future implementation.

---

### CQ-5: Scope Boundary — Should SR8 Be Deferred Entirely or Split into Bug Fix + Enhancement Phases?

**Gap**: The idea brief states SR8 "can be DEFERRED if staff continue using the existing Inertia portal." But the impersonation bug (US1) is an active production issue, and the org hierarchy visibility (US2, US3) is needed as soon as SR0 ships the two-tier model. The remaining stories (US4 unified queue, US6 stage context, US7 org-aware search) are quality-of-life improvements. Shipping everything as one epic risks delaying the critical bug fix behind lower-priority work.

**Options**:
- **(a) Split into Phase A (P1 bug fix + org visibility) and Phase B (P2 enhancements)** — Phase A ships US1 (impersonation fix), US2 (org hierarchy card), and US3 (role labels) as a small, focused deliverable. Phase B (US4 unified queue, US6 stage context, US7 org-aware search) ships later or is deferred. This gets the critical fixes out fast while keeping enhancements optional.
- (b) Ship everything as one epic — Higher risk of delay but delivers the complete vision.
- (c) Defer the entire epic — Staff keep using the existing portal as-is, including the impersonation bug. Not recommended given active production pain.

**Decision**: **(a) Two-phase split.** Phase A (P1): US1 impersonation fix, US2 org hierarchy card, US3 role labels. This is a focused 3-5 day deliverable with zero SR0 dependency for the impersonation fix and minimal SR0 dependency for org visibility (the Organisation model and `suppliers()` relationship already exist). Phase B (P2): US4 unified queue, US6 stage context, US7 org-aware search — delivered after Phase A, or deferred if staff workload does not justify the investment. US5 (coordinator linkage) is independently deferred per CQ-4.

**Spec impact**: Added a "Phasing" section below. Phase A targets are US1, US2, US3 with FR-001 through FR-006 and FR-013. Phase B targets are US4, US6, US7 with FR-007, FR-008, FR-010 through FR-012, FR-014. US5 with FR-009 is deferred pending PLA-1312.

---

## Phasing

### Phase A — Critical Fixes (P1, no SR0 hard dependency)

| Story | Summary | FRs |
|-------|---------|-----|
| US1 | Impersonation fix — active admin selection | FR-001, FR-002 |
| US2 | Organisation hierarchy card on Overview tab | FR-003, FR-004, FR-013 |
| US3 | Role labels on Team tab | FR-005, FR-006 |

**Estimated effort**: 3-5 days. Can ship independently of SR0 (Organisation model and relationships already exist).

### Phase B — Enhancements (P2, ship after Phase A or defer)

| Story | Summary | FRs |
|-------|---------|-----|
| US4 | Unified approval queue (documents + stage updates) | FR-007, FR-008, FR-014 |
| US6 | Stage transitions with org context | FR-010, FR-011 |
| US7 | Organisation-aware search and filtering | FR-012 |

**Estimated effort**: 5-8 days. Can be deferred if staff continue managing with existing separate views.

### Deferred — Pending External Dependency

| Story | Summary | Blocked on |
|-------|---------|------------|
| US5 | Coordinator-supplier linkage UI | PLA-1312 data model |
