---
title: "Feature Specification: Supplier Audit Process (SAP)"
---

> **[View Mockup](/mockups/supplier-audit-process/index.html)**{.mockup-link}

**Status**: Draft
**Epic**: TP-2291 | **Initiative**: Supplier Management (TP-1857)

---

## Overview

The Supplier Audit Process (SAP) epic introduces a systematic, structured audit process to verify supplier compliance with operational and regulatory requirements within the Trilogy Care Portal. Current audit workflows are manual, inconsistent, and labor-intensive, creating compliance risk and poor visibility into supplier compliance status across the platform.

SAP replaces ad-hoc manual reviews with automated, schedule- and event-driven audit workflows, standardized checklists, complete audit trails, and a compliance dashboard. The system transitions from legacy SLA-based reviews toward a risk-based audit prioritisation model, ensuring that audit effort is directed where it is most needed while maintaining full regulatory documentation.

---

## User Scenarios & Testing

### User Story 1 - Schedule-Triggered Audit Workflow (Priority: P1)

As a Compliance Officer, I want audit workflows to be automatically triggered on a compliance cycle schedule so that all active suppliers are audited within the required timeframe without manual tracking.

**Acceptance Scenarios**:
1. **Given** a supplier's audit cycle date has arrived, **When** the system processes the schedule, **Then** an audit workflow is automatically created and assigned to the appropriate compliance officer.
2. **Given** an audit workflow is triggered, **When** the compliance officer opens it, **Then** a standardized audit checklist is pre-populated with assessment criteria relevant to the supplier's service types.
3. **Given** an audit is in progress, **When** the officer completes all checklist items, **Then** the audit status transitions to "Complete" and results are recorded in the audit trail.

### User Story 2 - Event-Triggered Audit Workflow (Priority: P1)

As a Compliance Officer, I want audit workflows to trigger when compliance-relevant events occur (e.g., document expiry, complaint received, service change) so that risk events are investigated promptly.

**Acceptance Scenarios**:
1. **Given** a supplier's insurance document expires, **When** the expiry is detected by the system, **Then** an event-triggered audit workflow is created with the expiry flagged as the trigger reason.
2. **Given** a compliance complaint is logged against a supplier, **When** the complaint is recorded, **Then** an audit workflow is triggered with the complaint details attached.
3. **Given** an event-triggered audit is created, **When** viewed alongside scheduled audits, **Then** it is clearly distinguished as event-triggered with the trigger event displayed.

### User Story 3 - Standardized Audit Checklists (Priority: P1)

As a Compliance Officer, I want to use standardized audit checklists and templates so that audits are consistent across all suppliers and assessors.

**Acceptance Scenarios**:
1. **Given** an audit workflow is created for a supplier, **When** the checklist is generated, **Then** it includes all assessment criteria defined for the supplier's service types and risk profile.
2. **Given** a checklist item requires supporting documentation, **When** the officer reviews it, **Then** they can attach or link relevant documents directly to the checklist item.
3. **Given** audit criteria are updated centrally, **When** a new audit is created, **Then** the updated criteria are reflected in the checklist.

### User Story 4 - Compliance Dashboard (Priority: P1)

As a Compliance Manager, I want a dashboard showing supplier audit status across the platform so that I can identify compliance gaps and prioritise action.

**Acceptance Scenarios**:
1. **Given** the compliance dashboard is loaded, **When** viewed, **Then** it displays audit status for all active suppliers with filters for status, service type, risk level, and due date.
2. **Given** a supplier has an overdue audit, **When** viewing the dashboard, **Then** the supplier is highlighted with an overdue indicator.
3. **Given** audit results are recorded, **When** the dashboard is refreshed, **Then** aggregate metrics show completion rates, pass/fail ratios, and average audit duration.

### User Story 5 - Audit Trail and Reporting (Priority: P2)

As a Compliance Officer, I want a complete audit trail for each supplier so that I can provide documented evidence of compliance verification to regulatory bodies.

**Acceptance Scenarios**:
1. **Given** an audit has been completed, **When** a regulatory body requests compliance evidence, **Then** a complete audit report can be generated showing all checklist items, findings, evidence, and outcomes.
2. **Given** multiple audits have been completed for a supplier, **When** viewing the supplier's audit history, **Then** all historical audits are listed with dates, outcomes, and key findings.
3. **Given** audit data is available, **When** generating reports, **Then** reports include acceptance rate, average response time, and compliance trend data.

### User Story 6 - Risk-Based Audit Prioritisation (Priority: P2)

As a Compliance Manager, I want to prioritise audits based on supplier risk profile so that higher-risk suppliers receive more frequent and thorough audits.

**Acceptance Scenarios**:
1. **Given** supplier risk profiles are defined, **When** the system generates the audit schedule, **Then** higher-risk suppliers are scheduled for more frequent audits.
2. **Given** a supplier's risk profile changes (e.g., due to a complaint or failed audit), **When** the change is recorded, **Then** the audit schedule is automatically adjusted.
3. **Given** risk-based prioritisation is active, **When** viewing the audit queue, **Then** audits are sorted by risk level with highest-risk suppliers at the top.

### Edge Cases

- **Supplier not responsive during audit**: System sends automated reminders at configurable intervals; after final reminder, audit is escalated to management.
- **Conflicting audit triggers**: If a scheduled audit and event-triggered audit overlap for the same supplier, the system merges them into a single comprehensive audit.
- **Audit criteria dispute**: Supplier can raise a dispute on specific checklist items; disputes are flagged for manager review.
- **Mid-audit service type change**: If a supplier adds or removes services during an active audit, the checklist is updated to reflect current services.

---

## Functional Requirements

- **FR-001**: System MUST support automated audit workflow creation triggered by compliance cycle schedules.
- **FR-002**: System MUST support event-triggered audit workflows (document expiry, complaints, service changes).
- **FR-003**: System MUST provide standardized, configurable audit checklist templates per service type and risk profile.
- **FR-004**: System MUST maintain a complete audit trail for every supplier, including checklist responses, evidence attachments, and outcomes.
- **FR-005**: System MUST provide a compliance dashboard with filters for audit status, service type, risk level, and due date.
- **FR-006**: System MUST support risk-based audit prioritisation with configurable risk weighting factors.
- **FR-007**: System MUST generate audit reports suitable for regulatory body submissions.
- **FR-008**: System MUST send automated reminders to suppliers for outstanding audit items.
- **FR-009**: System MUST track audit completion metrics: duration, pass/fail rates, overdue counts.
- **FR-010**: System SHOULD support configurable escalation paths for non-responsive suppliers.
- **FR-011**: System SHOULD integrate with the Compliance Matrix for consistent requirement definitions.
- **FR-012**: System SHOULD bridge to Zoho CRM for audit workflows until portal-native compliance tools are complete.

---

## Key Entities

- **Audit Workflow**: A single audit instance for a supplier, containing trigger type (scheduled/event), assigned officer, status, and timestamps.
- **Audit Checklist**: A collection of assessment criteria items associated with an Audit Workflow, derived from templates per service type.
- **Checklist Item**: Individual assessment criterion with fields: description, required evidence type, status (pending/passed/failed/N/A), notes, evidence attachments.
- **Audit Template**: Master template defining checklist items per service type and risk profile. Managed centrally and versioned.
- **Supplier Risk Profile**: Risk classification of a supplier based on factors such as service type, complaint history, audit history, and compliance status.
- **Audit Event Log**: Immutable log of all status changes, actions, and findings within an audit workflow.

---

## Success Criteria

### Measurable Outcomes

- **SC-001**: 100% of active suppliers audited within each compliance cycle.
- **SC-002**: Audit completion time reduced by 50% compared to manual process.
- **SC-003**: Compliance documentation completeness >95%.
- **SC-004**: Zero regulatory findings attributable to audit gaps.
- **SC-005**: Audit administration time reduced by 40% through automation.

---

## Assumptions

- Clear audit criteria can be defined and standardized across service types.
- Suppliers have systems capable of providing audit documentation electronically.
- Compliance framework and regulatory standards are finalized before development begins.
- Audit documentation templates are created and approved by compliance stakeholders.
- Risk-based audit model is accepted as a replacement for legacy SLA-based reviews.

---

## Dependencies

- Compliance framework and standards must be finalized.
- Audit documentation templates must be created and approved.
- Compliance Matrix must be available for consistent requirement definitions.
- Notification infrastructure for automated reminders and alerts.
- Zoho CRM integration for interim audit workflow bridging.
- [Supplier Service Verification Features (SVF)](/initiatives/Supplier-Management/Supplier-Service-Verification-Features/spec) for service-level compliance data.

---

## Out of Scope

- Automated remediation actions based on audit findings (future phase).
- Supplier self-assessment capabilities (future phase).
- Financial penalty or contract termination workflows triggered by audit failures.
- Integration with external regulatory reporting systems.
- Historical backfill of legacy audit data (handled as a separate migration task).


## Clarification Outcomes

### Q1: [Scope] What types of supplier audits are covered?
**Answer:** The spec covers ALL types: scheduled compliance audits (US1), event-triggered audits (US2 — document expiry, complaints, service changes), and risk-based prioritisation (US6). The standardized checklists (US3) are per service type and risk profile. This is comprehensive — SAP is the unified audit framework for suppliers. It does NOT cover care quality audits (that would be under clinical operations) or financial audits of Trilogy Care itself. The scope is supplier compliance with Trilogy Care's operational and regulatory requirements.

### Q2: [Dependency] Does this use the existing Spatie ActivityLog?
**Answer:** The codebase uses `Spatie\Activitylog\Traits\LogsActivity` extensively (on `Bill`, `Supplier`, `Organisation`, etc.). SAP's "Audit Event Log" (immutable log of status changes) is conceptually similar but purpose-built. **Recommendation:** SAP should use a DEDICATED `audit_event_logs` table rather than overloading Spatie ActivityLog. Spatie ActivityLog tracks general model changes; SAP's audit trail is domain-specific (checklist responses, evidence attachments, findings). The V2 actions already include `GetSupplierAuditLogAction` confirming this approach is in progress.

### Q3: [Data] What is the audit frequency?
**Answer:** The spec supports BOTH scheduled and triggered: US1 covers scheduled audits (compliance cycle), US2 covers event-triggered audits. FR-006 supports "risk-based audit prioritisation with configurable risk weighting factors" meaning higher-risk suppliers are audited more frequently. The edge case "Conflicting audit triggers" addresses overlap: "If a scheduled audit and event-triggered audit overlap, the system merges them into a single comprehensive audit." This is well-designed — prevents duplicate audit work.

### Q4: [Edge Case] What happens when a supplier fails an audit?
**Answer:** The spec's Out of Scope explicitly states: "Financial penalty or contract termination workflows triggered by audit failures." This means failed audits result in findings and remediation requests, but automatic suspension is NOT in scope. FR-010 supports "configurable escalation paths for non-responsive suppliers." **Assumption:** A failed audit changes the supplier's compliance status (visible in SVF's compliance dashboard), may trigger a hold on new bills (via OHB reasons), and generates escalation notifications. The compliance team decides manually whether to suspend.

### Q5: [Dependency] FR-012 says "bridge to Zoho CRM for audit workflows." What is the Zoho CRM role?
**Answer:** The codebase has several Zoho references: `ZohoSupplierStageEnum`, `ZohoSupplierTagEnum`, and `zoho_id` on the Supplier model. Zoho CRM appears to be the legacy supplier management system being replaced by the portal. FR-012 uses SHOULD (not MUST), making it a transitional bridge. **Assumption:** Zoho CRM currently handles audit workflows manually. SAP replaces this with portal-native tools. The bridge exists during the transition period. As SAP matures, the Zoho bridge is deprecated.

### Q6: [Data] The Audit Template entity — how is it managed?
**Answer:** Audit Templates define checklist items per service type and risk profile. The spec says "Managed centrally and versioned." No template management UI exists in the codebase. **Recommendation:** Use a simple admin interface (Nova or dedicated page) for template management. Templates should be versioned — each audit instance snapshots the template version at creation time (as specified in the edge case: "Mid-audit service type change: checklist is updated to reflect current services").

### Q7: [Integration] How does SAP relate to SVF (Supplier Service Verification Features)?
**Answer:** SVF manages service-level compliance status (documents, verification checklists). SAP conducts periodic audits that may CHECK those same compliance statuses. SAP depends on SVF data — when an audit runs, it checks whether the supplier's documents are current (via SVF's compliance checklist). If SVF shows expired documents, the audit captures this as a finding. The spec lists SVF as a dependency: "Supplier Service Verification Features for service-level compliance data."

### Q8: [Performance] How many audit workflows are expected concurrently?
**Answer:** With ~15,000 suppliers (per SOP2 spec) and annual compliance cycles, approximately 15,000 audits/year or ~1,250/month. Event-triggered audits add variable volume. This is manageable — audit workflows are long-running (days/weeks) with low-frequency status changes, not real-time transactions.

### Q9: [Scope] The Compliance Dashboard (US4) — does this overlap with SVF's Compliance Dashboard (US13)?
**Answer:** Yes, there is overlap. SVF has a "Compliance Dashboard" (US13) showing unverified suppliers and services. SAP has a "Compliance Dashboard" (US4) showing audit status. **Recommendation:** These should be the SAME dashboard with different tabs or views: "Verification Status" (from SVF) and "Audit Status" (from SAP). A unified compliance dashboard prevents compliance officers from switching between two separate views.

### Q10: [Data] Supplier Risk Profile — who defines risk factors?
**Answer:** FR-006 supports "configurable risk weighting factors." Risk factors include: service type (higher risk for clinical services), complaint history, audit history (previous failures), compliance status (from SVF), and bill volume. The risk profile is CALCULATED, not manually assigned. **Recommendation:** Define initial risk weighting in configuration (not hardcoded): `complaint_weight: 3, failed_audit_weight: 5, expired_doc_weight: 2, etc.`

## Refined Requirements

1. **Dashboard Unification**: SAP's Compliance Dashboard (US4) and SVF's Compliance Dashboard (US13) should be unified into a single compliance dashboard with tabs for Verification Status and Audit Status.

2. **New AC for US2**: Given a supplier's insurance document expires (detected by SVF/SDOC), When the expiry event fires, Then an event-triggered audit is created ONLY if the supplier does not already have an active audit. If an active audit exists, the expiry finding is added to the existing audit.

3. **Risk Profile Calculation**: Define the risk scoring formula explicitly: `risk_score = (complaint_count * complaint_weight) + (failed_audits * failure_weight) + (expired_docs * expiry_weight) + (service_risk_tier * tier_weight)`. Audit frequency: High risk = quarterly, Medium = semi-annual, Low = annual.
