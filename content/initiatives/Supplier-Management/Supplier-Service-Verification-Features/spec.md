---
title: "Feature Specification: Supplier Service Verification Features (SVF)"
---

> **[View Mockup](/mockups/supplier-service-verification-features/index.html)**{.mockup-link}

**Status**: Draft
**Epic**: TP-2478 | **Initiative**: Supplier Management (TP-1857)

---

## Overview

Supplier Service Verification Features (SVF) introduces a unified compliance module in the Trilogy Care Portal that manages both supplier-level and service-level verification. Under the Support at Home (SAH) reforms, suppliers must meet compliance requirements not only at the organisation level but also for each individual service type they deliver. Currently, the portal tracks verification only at the provider level, causing bills to be submitted for unverified services, requiring manual holds and follow-up.

SVF establishes service-level compliance tracking driven by a central Compliance Matrix, enables supplier self-service for compliance management, automates bill-triggered workflows when unverified services are detected, and provides compliance officers with review tools and dashboards. The system ensures that every service type has defined compliance checklists, suppliers have visibility into their compliance status, and billing decisions are backed by clear verification data.

---

## User Scenarios & Testing

### User Story 1 - Add Service Types with Compliance Requirements (Priority: P1)

As a Supplier User, I want to add a new service type I provide and see the compliance requirements for that service so that I understand what documentation is needed.

**Acceptance Scenarios**:
1. **Given** a supplier is onboarding or updating services, **When** they select a Tier-3 service type to offer, **Then** the system displays the specific compliance requirements for that service type as defined in the Compliance Matrix.
2. **Given** compliance requirements are displayed, **When** the supplier views them, **Then** each requirement shows the document type, expiry rules, and a clear explanation of why it is needed.
3. **Given** the Compliance Matrix is updated, **When** a supplier adds a service type, **Then** the updated requirements are reflected immediately.

### User Story 2 - View Compliance Checklist Per Service (Priority: P1)

As a Supplier User, I want to see the compliance checklist for each service I provide so that I know which documents I need to upload and their current status.

**Acceptance Scenarios**:
1. **Given** a supplier has active services, **When** they open a service's compliance section, **Then** they see required documents, expiry requirements, and current verification status for each item.
2. **Given** a document is verified and current, **When** displayed in the checklist, **Then** it shows a green "Verified" status badge with the expiry date.
3. **Given** a document is missing or expired, **When** displayed in the checklist, **Then** it shows a red "Required" or "Expired" status badge with an upload action.

### User Story 3 - Compliance Officer Review and Approval (Priority: P1)

As a Compliance Officer, I want to review and approve or reject uploaded documents for each service so that service verification status is accurately maintained.

**Acceptance Scenarios**:
1. **Given** a supplier uploads a document for a service, **When** the Compliance Officer reviews it, **Then** they can approve or reject the document with notes.
2. **Given** a document is approved and all requirements are met for the service, **When** the approval is processed, **Then** the service status transitions to "Verified".
3. **Given** a document is rejected, **When** the rejection is processed, **Then** the service status remains "Pending", the supplier is notified by email with the rejection reason, and they can re-upload.

### User Story 4 - Automatic Expiry Status Change (Priority: P1)

As a Compliance Officer, I want services with expired documents to automatically move to "Expired" status so that compliance gaps are identified without manual monitoring.

**Acceptance Scenarios**:
1. **Given** a document passes its expiry date, **When** the system's expiry job runs, **Then** the service status changes to "Expired".
2. **Given** a service expires, **When** the status changes, **Then** the supplier receives a notification specifying which document and which service is affected.
3. **Given** a supplier-level document expires (e.g., police check at Tier 2), **When** the expiry is detected, **Then** all services dependent on that document are flagged.

### User Story 5 - Billing Verification Indicators (Priority: P1)

As Billing Staff, I want to see whether a supplier is verified at both supplier and service level on an invoice so that I can decide whether to proceed with payment or place the bill on hold.

**Acceptance Scenarios**:
1. **Given** a bill is being reviewed, **When** the billing staff views a line item, **Then** they can see supplier-level and service-level verification status indicators.
2. **Given** either supplier or service verification is false, **When** the processor identifies the gap, **Then** they can flag the bill as "On Hold - Compliance" with a single action.
3. **Given** both supplier and service are verified, **When** viewing the line item, **Then** a green "Verified" indicator is displayed and payment can proceed normally.

### User Story 6 - Bill-Triggered Update Service Workflow (Priority: P1)

As a Supplier User, I want to receive an email from Compliance when my bill is placed on hold due to an unverified service so that I know to take action promptly.

**Acceptance Scenarios**:
1. **Given** a bill is placed on hold for compliance reasons, **When** the hold is applied, **Then** the system automatically sends an "Update Service Request" email to the supplier.
2. **Given** the email is sent, **When** the supplier clicks the link, **Then** they are directed to the relevant service update page where they can upload documents or apply for the service.
3. **Given** no response is received, **When** configured reminder intervals pass (3, 7, and 10 days), **Then** automated reminder emails are sent.

### User Story 7 - Supplier Self-Service Application (Priority: P1)

As a verified Supplier, I want to log in at any time to add new locations or new services so that I can expand my offerings without waiting for Compliance to contact me.

**Acceptance Scenarios**:
1. **Given** a verified supplier is logged in, **When** they navigate to service management, **Then** they can initiate adding a new location or new service type.
2. **Given** a supplier adds a new service, **When** they submit the application, **Then** the compliance process begins with the appropriate checklist generated from the Compliance Matrix.
3. **Given** the supplier views their profile, **When** organisation-level and service-level verification are displayed, **Then** they are shown in clearly separated sections.

### User Story 8 - Matrix-Driven Compliance Requirements (Priority: P1)

As a Compliance Officer, I want all service-level compliance requirements to come from the central Compliance Matrix so that requirements are consistent across all suppliers.

**Acceptance Scenarios**:
1. **Given** a service type exists in the Compliance Matrix, **When** any supplier adds that service, **Then** the same set of required documents and rules is applied.
2. **Given** the Compliance Matrix is updated (e.g., a new document type is added for a service), **When** the update is saved, **Then** all suppliers providing that service see the updated requirements.

### User Story 9 - Planned Service Verification Alignment (Priority: P1)

As Operations Staff, I want each client's planned services to reflect the verification status of the service types provided to them so that compliance status is visible in care planning.

**Acceptance Scenarios**:
1. **Given** a supplier provides a service type to a client, **When** the verification status changes, **Then** all linked planned services show the correct verified/unverified status.
2. **Given** a planned service becomes unverified, **When** viewed on the bills page, **Then** the unverified status is visible on the line items and affects the current approval logic.

### User Story 10 - Expiry Reminders (Priority: P2)

As a Supplier User, I want to receive reminders before any compliance document expires so that I can renew on time and avoid service disruption.

**Acceptance Scenarios**:
1. **Given** a document has an expiry date, **When** it is 30 days before expiry, **Then** the document status changes to "Expiring Soon" in the portal.
2. **Given** a document is 7 days from expiry, **When** the reminder fires, **Then** an email is sent to the supplier with a link to upload the renewal document.
3. **Given** a document reaches its expiry date, **When** the expiry occurs, **Then** the supplier is notified that they are no longer compliant for the specific service and that this may affect payments.

### User Story 11 - Supplier Compliance Summary View (Priority: P1)

As a Supplier User, I want to view my overall compliance summary showing both supplier-level and service-level status so that I have full visibility of my compliance position.

**Acceptance Scenarios**:
1. **Given** a supplier logs into the portal, **When** they open the Compliance Summary, **Then** they see supplier-level status and all service-level statuses in a combined view.
2. **Given** the summary is displayed, **When** a service is not compliant, **Then** it is highlighted with clear indicators and next actions.
3. **Given** the compliance summary is viewed, **When** both organisation-level and service-level sections are shown, **Then** they are visually distinct with separate status badges (Verified / Pending / Expired).

### User Story 12 - Unverified Planned Service Alerts (Priority: P1)

As a Compliance Officer, I want to be alerted when a planned service becomes unverified due to expired or rejected compliance so that I can take immediate action.

**Acceptance Scenarios**:
1. **Given** a planned service's related service type becomes unverified, **When** the status change occurs, **Then** the Compliance Officer receives an internal alert with affected supplier and service details.
2. **Given** the alert is received, **When** the officer views the affected supplier, **Then** the specific expired or rejected document is identified.

### User Story 13 - Compliance Dashboard (Priority: P3)

As a Compliance Officer, I want a dashboard showing all suppliers or services that are not verified so that I can prioritise compliance remediation.

**Acceptance Scenarios**:
1. **Given** the Compliance Dashboard is loaded, **When** it displays, **Then** it shows lists of unverified suppliers and services.
2. **Given** the dashboard is displayed, **When** using filters, **Then** results can be filtered by supplier, service type, status, or date.
3. **Given** non-compliant services are listed, **When** viewed on the supplier screen, **Then** they are clearly marked as not compliant.

### Edge Cases

- **Compliance Matrix updated while audits are in progress**: New requirements are applied to future audits; in-progress audits use the version active at audit creation.
- **Supplier has services across multiple tiers**: Each Tier-3 service has its own compliance checklist; supplier-level documents (Tier 2) apply across all services.
- **Document uploaded to wrong service**: Compliance Officer can reassign a document to the correct service without requiring re-upload.
- **Concurrent uploads for same requirement**: System accepts the most recent upload and notifies the officer of the superseded document.
- **Supplier loses all verified services**: Supplier-level status is not affected but all services show as unverified; supplier is blocked from billing until at least one service is re-verified.
- **Tooltip guidance during upload**: Document upload fields display tooltip guidance to help suppliers upload the correct document type (e.g., "Upload your current public liability insurance certificate showing coverage amount and expiry date").

---

## Functional Requirements

- **FR-001**: System MUST support service-level compliance tracking in addition to existing supplier-level tracking.
- **FR-002**: System MUST derive compliance requirements for each service type from the central Compliance Matrix.
- **FR-003**: System MUST allow Compliance Officers to approve or reject uploaded documents with notes, updating service verification status accordingly.
- **FR-004**: System MUST automatically change service status to "Expired" when a document passes its expiry date and notify the supplier with specifics.
- **FR-005**: System MUST display supplier-level and service-level verification indicators on bill line items.
- **FR-006**: System MUST support "On Hold - Compliance" billing flag when verification requirements are not met.
- **FR-007**: System MUST auto-send "Update Service Request" emails when a bill is placed on hold for compliance reasons, with follow-up reminders at 3, 7, and 10 days.
- **FR-008**: System MUST allow verified suppliers to self-service add new locations and services, triggering the compliance process.
- **FR-009**: System MUST display compliance requirements during onboarding and service update flows.
- **FR-010**: System MUST reflect service verification status changes on all linked client planned services.
- **FR-011**: System MUST send expiry reminders at configurable intervals (default: "Expiring Soon" at 30 days, reminder at 7 days, expired notification on expiry date).
- **FR-012**: System MUST provide a combined compliance summary view showing supplier-level and service-level statuses with clear next actions.
- **FR-013**: System MUST alert Compliance Officers when planned services become unverified.
- **FR-014**: System SHOULD provide a compliance dashboard with filter options for unverified suppliers and services.
- **FR-015**: System SHOULD display tooltip guidance during document upload to help suppliers submit correct documents.

---

## Key Entities

- **Supplier Verified Stage**: Overall compliance status of a supplier organisation. Represents provider-level verification independent of individual services.
- **Service Verified Stage**: Compliance status of a specific service type provided by a supplier. Determined by whether all Compliance Matrix requirements are met for that service.
- **Compliance Matrix**: Central source of truth defining required documents, expiry rules, and validation logic per service type. Managed internally; not editable via the supplier portal.
- **Service Compliance Checklist**: Instance of Compliance Matrix requirements applied to a specific supplier's service, tracking document upload status, review status, and expiry dates.
- **Compliance Document Submission**: A document uploaded by a supplier for a specific service compliance requirement. Fields: `id`, `supplier_id` (FK), `service_type_id` (FK), `requirement_id` (FK), `file_reference`, `uploaded_at`, `status` (pending/approved/rejected/expired), `reviewed_by`, `reviewed_at`, `expiry_date`, `review_notes`.
- **On Hold - Compliance**: Billing hold reason applied when supplier or service verification is false. Triggers automated supplier notification workflow.
- **Update Service Request Email**: System-generated message prompting supplier to update an unverified or expired service, triggered by billing holds.

---

## Success Criteria

### Measurable Outcomes

- **SC-001**: 100% of Tier-3 services have defined compliance checklists derived from the Compliance Matrix.
- **SC-002**: 50% reduction in manual compliance follow-ups by Compliance Officers.
- **SC-003**: 100% of suppliers have access to their compliance summary through the portal.
- **SC-004**: Zero billing delays linked to compliance holds for properly verified services.
- **SC-005**: Average days between document expiry and supplier update < 7 days.

---

## Assumptions

- The Compliance Matrix remains the single source of truth for document requirements and is maintained by the compliance team.
- Automated reminders and emails rely on active notification infrastructure being available and operational.
- Supplier onboarding flow integrates with compliance display logic (dependency on SOP2).
- Existing billing approval logic can be extended to incorporate service-level verification checks.
- Suppliers will adopt self-service compliance management when given appropriate tools and guidance.

---

## Dependencies

- **Compliance Matrix**: Must be complete and actively maintained for all service types.
- **Notification infrastructure**: Must be available for automated emails, reminders, and internal alerts.
- [Supplier Onboarding 2 (SOP2)](/initiatives/Supplier-Management/Supplier-Onboarding-2/spec) for integration with the onboarding flow and compliance display.
- [Supplier Docs AI (SDOC)](/initiatives/Supplier-Management/Supplier-Docs-AI/spec) for automated document classification and data extraction (enhancement).
- Billing system must support the "On Hold - Compliance" flag and verification indicator display.
- Credentials and Compliance Matrix with Expiry spreadsheet as initial data source.

---

## Out of Scope

- Automatic bill approval workflows based on verification status (not yet implemented).
- Integration of Compliance Matrix data editing within the supplier portal (maintained internally).
- Historical backfill of legacy compliance data (handled as a separate one-time migration).
- Configurable expiry reminder frequency by Compliance Admin (potential future enhancement).
- Supplier restriction from billing on unverified services (currently flagged with hold, not blocked).
- Compliance officer override authority to manually set verification (potential future enhancement).


## Clarification Outcomes

### Q1: [Scope] What is being verified — qualification to deliver, or actual delivery?
**Answer:** QUALIFICATION to deliver specific service types. The spec is clear: "suppliers must meet compliance requirements not only at the organisation level but also for each individual service type they deliver." This is about compliance documentation (insurance, qualifications, certifications) per service type. Actual delivery verification is QRW's domain. SVF ensures the supplier IS QUALIFIED before they deliver; QRW confirms they DID deliver.

### Q2: [Data] What evidence is required?
**Answer:** Evidence comes from the central Compliance Matrix (FR-002, US8). Each service type has defined required documents. The `SupplierDocument` model stores compliance documents with `DocumentTypeEnum` (PUBLIC_LIABILITY, ABN_VERIFICATION, WORKERS_COMP, PROFESSIONAL_INDEMNITY, POLICE_CHECK, AHPRA, NDIS_SCREENING). The `DocumentScopeEnum` distinguishes organisation-level vs service-level documents. The existing `SupplierServiceStatus` model tracks per-service verification status (`supplier_id`, `service_type_id`, `service_status` via `SupplierServiceStatusEnum`). No Compliance Matrix entity exists in the codebase yet — this is a new data structure to be built.

### Q3: [Dependency] Does verification status gate invoice processing?
**Answer:** Yes. US5 (Billing Verification Indicators) shows supplier-level and service-level verification on bill line items. US6 (Bill-Triggered Update Service Workflow) sends compliance emails when bills are held. FR-006 supports "On Hold - Compliance" billing flag. The existing `BillOnHoldReasonsEnum` already has `UNVERIFIED_FUNDING_STREAM` and `UNAPPROVED_SERVICES` which are related. The new `BillHoldReasonEnum` (V2) has `MISSING_DOCUMENTATION`. SVF extends this with service-level specificity: a bill can be held because the specific SERVICE TYPE is unverified, not just the supplier overall.

### Q4: [Edge Case] What is the verification renewal process?
**Answer:** FR-004 defines automatic expiry: "change service status to Expired when a document passes its expiry date." FR-011/US10 defines reminders: "Expiring Soon" at 30 days, email reminder at 7 days, expired notification on expiry date. US4 AC3 adds: "a supplier-level document expires → all services dependent on that document are flagged." The renewal process: supplier receives reminder → uploads new document → compliance officer reviews → approves → service status returns to "Verified." This is a well-defined cycle.

### Q5: [Integration] Does SVF overlap with SAP?
**Answer:** They are complementary. SVF is CONTINUOUS MONITORING — real-time document status, automatic expiry detection, bill-triggered workflows. SAP is PERIODIC AUDITING — scheduled/event-triggered comprehensive reviews. SVF provides the data that SAP audits check. An audit (SAP) might verify that all of a supplier's documents are current (SVF data). If an audit finds a gap, the compliance officer uses SVF's document upload workflow to remediate. **Recommendation:** SVF provides the "current state" dashboard; SAP provides the "audit history" dashboard. Both should be tabs in a unified compliance interface.

### Q6: [Data] The Compliance Matrix — what is its structure?
**Answer:** No Compliance Matrix model exists in the codebase. The spec defines it as "Central source of truth defining required documents, expiry rules, and validation logic per service type." This is a new entity: `compliance_matrix_requirements` table with: `id`, `service_type_id` (FK), `document_type` (enum), `is_required`, `expiry_rules` (JSON — e.g., "max_age_months: 36" for police checks), `description`, `scope` (organisation/service), `effective_from`. The `DocumentRequirementService` in V2 may already implement some of this logic.

### Q7: [Data] The "Service Verified Stage" and "Supplier Verified Stage" — how do they differ?
**Answer:** Supplier Verified Stage = organisation-level compliance (ABN valid, insurance current, general business requirements). Service Verified Stage = per-service compliance (specific qualifications for that service type, e.g., AHPRA registration for allied health). Both must be true for a bill to proceed. The `SupplierServiceStatus` model provides per-service tracking. The `OrganisationVerificationStageEnum` on the Organisation model provides org-level tracking. These are already separate in the data model.

### Q8: [UX] The supplier-facing compliance summary (US11) — where does this appear?
**Answer:** The supplier portal has `Suppliers/Verification/SupplierVerification.vue`, `SupplierVerificationHeavy.vue`, and `SupplierVerificationLite.vue`. SVF would enhance these existing pages with the combined supplier-level + service-level view. The V2 `VerificationController` and `CalculateComplianceStatusAction` provide the backend. The infrastructure exists — SVF adds service-level granularity to the existing verification UI.

### Q9: [Scope] US9 (Planned Service Verification Alignment) — how does this work technically?
**Answer:** When a `BudgetPlanItem` references a supplier and service type, and the supplier's verification status for that service changes, all linked planned services need to reflect the new status. This requires a listener/observer: when `SupplierServiceStatus` changes, find all `BudgetPlanItem` records for that supplier + service_type and update their verification display. This is read-time data — no denormalization needed. The bill view (`Bills/Edit.vue`) queries the supplier's current verification status when displaying line items.

### Q10: [Performance] Automatic expiry status change — how often does the job run?
**Answer:** FR-004 implies a scheduled job checks document expiry dates. Running daily at midnight is sufficient (documents expire on a date, not a time). The job queries `SupplierDocument` where `expires_at <= today AND status != EXPIRED`, updates status to EXPIRED, and triggers notifications. With ~75,000 documents, a daily batch of expiry checks completes in seconds.

### Q11: [Edge Case] Tooltip guidance during upload (edge case) — is this in SVF or SOP2?
**Answer:** The spec's edge case says "Document upload fields display tooltip guidance." This is a UI enhancement that applies wherever documents are uploaded: SVF's compliance update page, SOP2's onboarding document step, and SDOC's compliance dashboard. **Recommendation:** Implement tooltips as a shared component that reads from the Compliance Matrix requirement descriptions.

### Q12: [Compliance] Bill hold triggered by unverified service — does this create an OHB reason?
**Answer:** FR-006 supports "On Hold - Compliance" flag. FR-007 auto-sends "Update Service Request" emails. This integrates with OHB's reason taxonomy. The OHB spec defines 36 reasons across departments, and "unverified service" would be a Compliance department reason. SVF triggers the hold; OHB manages the hold lifecycle. This cross-epic integration is well-defined.

## Refined Requirements

1. **Compliance Matrix Entity**: Create `compliance_matrix_requirements` table: `id`, `service_type_id` (FK), `document_type` (string, maps to DocumentTypeEnum), `is_required` (boolean), `expiry_rules` (JSON), `description` (text for tooltip guidance), `scope` (organisation/service), `effective_from`, `effective_to` (nullable). Managed via admin interface, not supplier portal.

2. **Dashboard Unification**: SVF's Compliance Dashboard (US13) should be a view within a unified compliance interface shared with SAP (Audit Status) and SDOC (Document Intelligence).

3. **New AC for US5**: Given a bill has 5 line items from the same supplier, When 3 service types are verified and 2 are not, Then each line item shows its own verification status independently — the 3 verified items show green, the 2 unverified show red with specific missing documents identified.

4. **Cross-Epic Integration**: SVF's "On Hold - Compliance" flag MUST map to an OHB reason in the `ohb_reasons` table, enabling OHB's multi-issue diagnosis to include compliance holds alongside other reasons.
