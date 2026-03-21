---
title: "Feature Specification: Optimising Bill Processing (OPT)"
---

> **[View Mockup](/mockups/optimising-bill-processing/index.html)**{.mockup-link}

**Status**: Draft
**Epic**: OPT | **Initiative**: TP-1857 Supplier Management

---

## Overview

Bill processing workflows at Trilogy Care involve significant manual effort, creating bottlenecks that slow payment timelines and increase error rates. This epic focuses on streamlining and automating bill processing workflows to reduce manual intervention, improve throughput, and ensure faster, more accurate payments to suppliers. The scope covers workflow optimisation from bill receipt through to payment authorisation, targeting the operational steps between invoice receipt and final approval.

This is distinct from invoice-level features (anomaly detection, query/dispute workflows) covered by Invoices V2 and AI Invoice V3. Optimising Bill Processing targets the end-to-end processing pipeline, batch operations, routing rules, and workload distribution.

---

## User Scenarios & Testing

### User Story 1 - Automated Bill Routing (Priority: P1)

As a Billing Coordinator, I want incoming bills to be automatically routed to the correct processing queue based on bill type, supplier, and value so that I do not have to manually triage every bill.

**Acceptance Scenarios**:
1. **Given** a new bill is received, **When** the system processes it, **Then** it is automatically routed to the correct queue based on configurable routing rules (bill type, supplier category, value threshold, client region).
2. **Given** routing rules are configured, **When** a bill matches multiple rules, **Then** the highest-priority rule takes precedence and the bill is routed accordingly.
3. **Given** a bill does not match any routing rule, **When** the system evaluates it, **Then** it is placed in a default "unrouted" queue for manual triage.
4. **Given** a routing rule is updated, **When** the change is saved, **Then** it applies to newly received bills only (not retroactively).

### User Story 2 - Batch Bill Processing (Priority: P1)

As a Finance Coordinator, I want to process multiple bills from the same supplier in a batch so that I can review and approve them efficiently rather than one at a time.

**Acceptance Scenarios**:
1. **Given** multiple bills from the same supplier are in the processing queue, **When** the coordinator selects batch processing, **Then** the bills are grouped and presented together with summary totals.
2. **Given** a batch of bills is under review, **When** the coordinator approves the batch, **Then** all bills in the batch are moved to the approved state with a single action.
3. **Given** a batch contains a bill with an issue, **When** the coordinator flags it, **Then** the flagged bill is excluded from the batch and the remaining bills can still be approved.
4. **Given** a batch is processed, **When** the action is complete, **Then** an audit record is created for each bill in the batch.

### User Story 3 - Processing SLA Dashboard (Priority: P2)

As a Finance Manager, I want to see a dashboard showing bill processing times and SLA compliance so that I can identify bottlenecks and allocate resources effectively.

**Acceptance Scenarios**:
1. **Given** bills are being processed, **When** the manager views the SLA dashboard, **Then** they see metrics including average processing time, bills approaching SLA breach, and bills past SLA.
2. **Given** a bill is approaching its SLA deadline, **When** the warning threshold is reached, **Then** the bill is highlighted on the dashboard and the assigned coordinator is notified.
3. **Given** processing metrics are displayed, **When** the manager filters by date range, supplier, or bill type, **Then** the metrics update to reflect the filtered data.

### User Story 4 - Workload Distribution (Priority: P2)

As a Finance Manager, I want bills to be distributed across coordinators based on workload capacity so that no single coordinator is overwhelmed while others are idle.

**Acceptance Scenarios**:
1. **Given** new bills are routed to a processing queue, **When** auto-assignment is enabled, **Then** bills are distributed to coordinators based on current workload and capacity settings.
2. **Given** a coordinator is on leave or at capacity, **When** new bills arrive, **Then** those bills are assigned to available coordinators.
3. **Given** a coordinator's workload is reassigned, **When** the reassignment is complete, **Then** both coordinators are notified and the audit trail reflects the change.

### User Story 5 - Processing Rules Engine (Priority: P3)

As a Finance Administrator, I want to configure processing rules that automate common decisions so that routine bills move through the pipeline without manual intervention.

**Acceptance Scenarios**:
1. **Given** a processing rule is configured (e.g., "auto-approve bills under $100 from verified suppliers"), **When** a matching bill is received, **Then** the rule is applied and the bill progresses automatically.
2. **Given** a bill triggers a processing rule, **When** the action is applied, **Then** the rule application is logged with the specific rule that was triggered.
3. **Given** conflicting rules exist, **When** a bill matches both, **Then** the system applies the rule with the highest priority and logs the conflict.

### Edge Cases

- **Supplier sends a single bill covering multiple clients**: The system should support splitting bills by client for individual processing and approval.
- **Bill received with no matching supplier in the system**: Route to the unrouted queue with a flag indicating an unknown supplier.
- **Processing rule creates a loop**: Rules engine must detect and prevent circular rule applications.
- **Coordinator reassignment during active review**: If a bill is being actively reviewed by one coordinator and is reassigned, the system should warn before reassigning.
- **Batch approval with mixed currencies**: Batches should only group bills with the same currency; mixed currency batches should be rejected.

---

## Functional Requirements

- **FR-001**: System MUST support configurable routing rules for automated bill triage based on bill type, supplier category, value threshold, and client region.
- **FR-002**: System MUST support batch processing of bills, allowing grouped review and approval with a single action.
- **FR-003**: System MUST provide an SLA tracking dashboard with processing time metrics, breach warnings, and filtering capabilities.
- **FR-004**: System MUST support automatic workload distribution across coordinators based on capacity settings and availability.
- **FR-005**: System MUST provide a configurable rules engine for automating routine processing decisions.
- **FR-006**: System MUST maintain a complete audit trail for all bill processing actions, including routing, assignments, approvals, and rule applications.
- **FR-007**: System MUST support bill splitting for multi-client bills.
- **FR-008**: System MUST provide notifications for SLA breach warnings, workload reassignments, and rule-triggered actions.
- **FR-009**: System MUST support manual override of all automated routing, assignment, and processing decisions.
- **FR-010**: System MUST integrate with the existing invoice workflow (query, dispute, approval statuses) defined in [Invoices V2](/initiatives/Supplier-Management/Invoices-V2).

---

## Key Entities

- **Bill**: The core processing entity representing a supplier bill moving through the pipeline. Contains supplier reference, amount, bill type, routing assignment, processing status, SLA deadline, and assigned coordinator.
- **RoutingRule**: A configurable rule that determines how incoming bills are triaged. Contains match criteria (supplier category, bill type, value range, client region), target queue, and priority.
- **ProcessingQueue**: A named queue for bill processing. Contains bills assigned by routing rules or manual triage, with capacity limits and SLA targets.
- **ProcessingRule**: An automation rule that applies actions to bills matching defined criteria. Contains match conditions, action (approve, flag, route, escalate), and priority.
- **WorkloadAssignment**: Tracks coordinator capacity and current bill assignments for workload balancing.

---

## Success Criteria

### Measurable Outcomes

- Average bill processing time reduced by 40% compared to current manual workflows.
- Manual triage of incoming bills reduced by 80% through automated routing.
- SLA compliance rate >95% for bill processing deadlines.
- Coordinator workload variance reduced by 50% (more even distribution).
- Batch processing adoption >60% for eligible multi-bill suppliers.

---

## Assumptions

- Bill types and supplier categories are well-defined and consistently applied in the existing system.
- Coordinators have measurable capacity that can be configured for workload distribution.
- Current SLA targets for bill processing are defined and agreed by finance leadership.
- Routing rules can be expressed as simple condition-action pairs without requiring complex logic.

---

## Dependencies

- Invoice workflow statuses and transitions defined in [Invoices V2](/initiatives/Supplier-Management/Invoices-V2).
- Supplier data quality (categories, verification status) from the supplier management system.
- Coordinator availability and capacity data from workforce management.
- Existing bill receipt and ingestion pipeline.

---

## Out of Scope

- Invoice anomaly detection and AI classification (covered by [AI Invoice V3](/initiatives/Supplier-Management/AI-Invoice-V3)).
- Invoice query and dispute workflows (covered by [Invoices V2](/initiatives/Supplier-Management/Invoices-V2)).
- Supplier onboarding or credentialing.
- Payment execution (this epic covers processing up to approval, not payment settlement).
- Express payment processing (covered by [Express Pay](/initiatives/Supplier-Management/Express-Pay)).


## Clarification Outcomes

### Q1: [Scope] How does this epic relate to Invoices V2?
**Answer:** IV2 focuses on invoice-level features (anomaly detection, query/dispute, auto-approval, MYOB sync, SAH claims). OPT focuses on the OPERATIONAL pipeline: routing, batching, SLA tracking, workload distribution, and rules engine. They are complementary — IV2 makes individual invoices smarter, OPT makes the processing pipeline more efficient. FR-010 explicitly states OPT "MUST integrate with the existing invoice workflow defined in Invoices V2." The overlap is minimal: IV2's auto-approval (US4) could be seen as a subset of OPT's rules engine (US5), but IV2's auto-approval is specifically about eliminating human review for qualifying invoices, while OPT's rules engine is broader (routing, flagging, escalation).

### Q2: [Dependency] What is the delivery sequence relative to OHB, AIV3?
**Answer:** OPT depends on IV2 for invoice statuses and transitions. OHB integrates at the `ON_HOLD` stage. AIV3 integrates at the classification step. Recommended sequence: (1) IV2 pipeline foundation, (2) OHB on-hold flow, (3) AIV3 classification, (4) OPT workflow optimization. OPT is an enhancement layer that benefits from all three being in place. The codebase already has bill assignment infrastructure (`AssignOrReassignModal.vue`, `SetCanAssignBillsModal.vue`, `PutBillsToAssignableQueueModal.vue`, `SetPrioritySuppliersForTeamMemberModal.vue`, `SetWorkingStatusModal.vue`) confirming that workload management is partially implemented. OPT extends this.

### Q3: [Data] What specific bottlenecks exist in the current pipeline?
**Answer:** The codebase reveals several bottleneck indicators: (1) Manual bill assignment UI exists (`AssignOrReassignModal.vue`) — bills are manually routed, (2) Multiple bill index tables exist for different roles (`BillsTable`, `DraftBillsTable`, `OnHoldBillsTable`) — fragmented views, (3) The `BillReminderService` handles cadence but no SLA tracking exists, (4) Bill processing assignments are per-coordinator with priority suppliers (`SetPrioritySuppliersForTeamMemberModal.vue`). **Assumption:** The primary bottleneck is manual triage (no automated routing), lack of SLA visibility (no dashboard), and uneven workload distribution.

### Q4: [Edge Case] Does faster processing affect auto-approval windows?
**Answer:** IV2's auto-approval is criteria-based, not time-based. There is no "48-hour auto-approval window" in the current codebase or the IV2 spec. Auto-approval triggers when an invoice meets all criteria at submission time, regardless of processing speed. Faster processing through OPT actually complements auto-approval — invoices that are NOT auto-approved reach a human reviewer faster.

### Q5: [Data] The spec mentions bill splitting for multi-client bills. Does this overlap with AIV3's split flow?
**Answer:** No. AIV3 splits individual LINE ITEMS that contain multiple service types (e.g., "personal care and cleaning" becomes two line items). OPT's multi-client bill split (edge case) splits an entire BILL that covers multiple clients into separate bills per client. These are different operations at different levels. AIV3 splits line items within a bill; OPT splits a bill into multiple bills.

### Q6: [Scope] The routing rules engine (US5) is marked P3. Is there existing routing logic?
**Answer:** The codebase has `SetPrioritySuppliersForTeamMemberModal.vue` suggesting supplier-based assignment exists. There is no configurable routing rules engine. The `Dashboard/BillProcessingAssignedBillsTable.php` shows bills are assigned to specific processors. **Assumption:** Current routing is manual or semi-manual. The P3 priority for the rules engine is appropriate — automated routing (US1, P1) delivers the most value first, with the full rules engine as an enhancement.

### Q7: [Integration] The batch processing (US2) — does the codebase support batch operations?
**Answer:** Yes. The V2 supplier actions include `BatchProcessBillsAction` (`domain/Supplier/Actions/V2/Billing/BatchProcessBillsAction.php`) and a `BillBatchController`. This confirms batch processing is already scaffolded in the V2 API. OPT would extend this with the UI components (batch selection, grouped review, batch approval) and the existing backend.

### Q8: [UX] The SLA dashboard (US3) — is there existing dashboard infrastructure?
**Answer:** The `DashboardRepository` exists and the codebase has multiple table views. There is no dedicated SLA tracking dashboard. The SLA dashboard would be a new Inertia page (e.g., `resources/js/Pages/Bills/SlasDashboard.vue`) with metrics calculated from bill stage transition timestamps (existing `StageHistory` model via `HasStageHistory` trait on Bill).

### Q9: [Performance] What is the expected improvement from automated routing?
**Answer:** The spec targets "80% reduction in manual triage." With 5-6K bills/day, this means 4,000-4,800 bills would be automatically routed. The routing rules need to be fast — executing rule matching on bill creation should add <100ms. A simple condition-action rule engine (bill_type + supplier_category + value_threshold → target_queue) is sufficient.

### Q10: [Edge Case] Coordinator reassignment during active review — is this a real scenario?
**Answer:** Yes. The codebase has `SetWorkingStatusModal.vue` suggesting coordinators can set their working status (available/unavailable). When a coordinator goes on leave, their assigned bills need reassignment. OPT formalizes this with FR-004 (workload distribution based on capacity and availability). The warning before reassignment during active review is a good UX pattern.

## Refined Requirements

1. **AC for US1**: Given a bill matches a routing rule for "Allied Health suppliers over $500", When the rule is the highest priority match, Then the bill is placed in the "Senior Review" queue AND the routing rule that was applied is logged in the bill's activity log.

2. **New FR**: System MUST track bill stage transition timestamps (already available via `StageHistory`) to calculate processing time metrics for the SLA dashboard.

3. **Dependency Clarification**: OPT's batch processing (US2) can leverage the existing `BatchProcessBillsAction` and `BillBatchController` in the V2 API, reducing implementation effort for the backend.
