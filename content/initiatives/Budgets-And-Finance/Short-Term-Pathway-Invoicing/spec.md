---
title: "Feature Specification: Short Term Pathway Invoicing (STP)"
---

> **[View Mockup](/mockups/short-term-pathway-invoicing/index.html)**{.mockup-link}

**Status**: Draft
**Epic**: STP | **Initiative**: Budgets & Finance
**Priority**: P0
**Owner**: TBD

---

## Overview

Short Term Pathway Invoicing (STP) automates the creation of bills for care management services delivered to clients on End of Life (EoL) and Restorative Care (RC) pathways. Currently, there is no automated mechanism to generate bills for these short-term pathway services, resulting in missed billing, manual workarounds, and revenue leakage. This epic introduces automated bill generation triggered by service delivery events on EoL and RC pathways.

**Scope boundaries**: This epic covers automated bill generation for care management services on EoL and RC pathways only. It does not cover clinical pathway management, care plan creation, general invoicing workflows, or billing for services outside EoL/RC short-term pathways.

---

## User Scenarios & Testing

### User Story 1 - System Automatically Creates a Bill When RC Care Management Service Is Delivered (Priority: P0)

As a Finance team member, I want bills for Restorative Care care management services to be automatically generated when the service is delivered so that I do not have to manually create them and no billable services are missed.

**Acceptance Scenarios**:

1. **Given** a client is on an active Restorative Care (RC) pathway, **When** a care management service event is recorded for that client, **Then** the system automatically generates a bill for the service with the correct service type, date, rate, and client/funding details
2. **Given** a bill is auto-generated for an RC service, **When** Finance views the bills list, **Then** the bill is identified as an auto-generated STP bill with the source pathway (RC) indicated
3. **Given** the auto-generated bill references the client's active plan, **When** the bill is created, **Then** the correct funding stream for the RC pathway is assigned automatically
4. **Given** an RC pathway has ended for a client, **When** a care management service is recorded after the end date, **Then** the system does not auto-generate a bill and flags the event for manual review

---

### User Story 2 - System Automatically Creates a Bill When EoL Care Management Service Is Delivered (Priority: P0)

As a Finance team member, I want bills for End of Life care management services to be automatically generated so that these critical services are billed promptly and accurately.

**Acceptance Scenarios**:

1. **Given** a client is on an active End of Life (EoL) pathway, **When** a care management service event is recorded, **Then** the system automatically generates a bill with EoL-specific service codes, rates, and funding stream assignment
2. **Given** an EoL bill is auto-generated, **When** it enters the processing pipeline, **Then** it follows the same downstream processing as manually created bills (validation, classification, claiming)
3. **Given** the EoL pathway has specific rate schedules, **When** the bill is generated, **Then** the system applies the correct EoL rate for the service type and duration

---

### User Story 3 - Finance Reviews and Adjusts Auto-Generated STP Bills (Priority: P1)

As a Finance team member, I want to review auto-generated STP bills before they are finalized so that I can correct any errors in service details, rates, or funding assignment.

**Acceptance Scenarios**:

1. **Given** an STP bill has been auto-generated, **When** Finance views the bill, **Then** they see all auto-populated fields (client, service type, date, rate, funding stream, pathway type) and can edit any field
2. **Given** Finance corrects an auto-generated bill, **When** they save the changes, **Then** the bill is updated and an audit log records the original auto-generated values and the corrections made
3. **Given** Finance determines an auto-generated bill is invalid (e.g., service was not actually delivered), **When** they void the bill, **Then** the bill is marked as voided with a reason and excluded from downstream processing

---

### User Story 4 - Care Partner Views Billing Status for Pathway Clients (Priority: P2)

As a Care Partner, I want to see which care management services for my RC/EoL clients have been billed so that I have visibility into billing activity for my clients.

**Acceptance Scenarios**:

1. **Given** a Care Partner views a client on an RC or EoL pathway, **When** they navigate to the client's billing summary, **Then** they see a list of auto-generated STP bills with status (draft, submitted, paid)
2. **Given** a care management service was recorded but no bill was generated (e.g., pathway ended), **When** the Care Partner views the client, **Then** they see the unbilled service flagged for attention

---

### Edge Cases

- **What happens when a client is on both RC and EoL pathways simultaneously?**
  The system generates separate bills for each pathway based on the service type recorded. Each bill references the specific pathway and funding stream.

- **What happens when the service rate for the pathway changes mid-period?**
  The system uses the rate effective on the service date. Rate schedules are date-versioned, and the bill applies the rate active at the time of service delivery.

- **What happens when a care management service is recorded but the client's plan has no available funding?**
  The bill is generated but flagged with an "Insufficient Funds" warning. It enters the standard on-hold workflow for resolution (potentially involving voluntary contributions per VCE).

- **What happens when a service event is backdated?**
  The system generates the bill with the backdated service date and applies the rate effective on that date. A note indicates the bill was generated from a backdated event.

- **What happens when duplicate service events are recorded?**
  The system checks for existing bills matching the client, service date, and service type before generating a new bill. Duplicate events are flagged for review rather than generating duplicate bills.

---

## Functional Requirements

- **FR-001**: System MUST automatically generate a bill when a care management service event is recorded for a client on an active RC pathway
- **FR-002**: System MUST automatically generate a bill when a care management service event is recorded for a client on an active EoL pathway
- **FR-003**: System MUST populate auto-generated bills with the correct client, service type, service date, rate (from pathway-specific rate schedule), and funding stream
- **FR-004**: System MUST assign the correct funding stream based on the pathway type (RC or EoL) and the client's active plan
- **FR-005**: System MUST NOT generate bills for service events recorded after a pathway has ended for the client
- **FR-006**: System MUST flag service events outside active pathway periods for manual review
- **FR-007**: System MUST apply date-versioned rate schedules so that the rate effective on the service date is used
- **FR-008**: System MUST prevent duplicate bill generation for the same client, service date, and service type combination
- **FR-009**: System MUST allow Finance to review, edit, and void auto-generated bills before finalization
- **FR-010**: System MUST route auto-generated bills into the standard bill processing pipeline for validation, classification, and claiming
- **FR-011**: System MUST identify auto-generated STP bills distinctly from manually created bills in the bills list (source type, pathway indicator)
- **FR-012**: System MUST log all auto-generation events with trigger details (service event ID, pathway, client, timestamp) for audit purposes
- **FR-013**: System SHOULD provide a dashboard or filter view showing all auto-generated STP bills and their processing status

---

## Key Entities

- **STPBillTrigger**: Records the service event that triggered automatic bill generation
  - Key Fields: id, service_event_id, client_id, pathway_type (RC, EoL), pathway_id, generated_bill_id, triggered_at, trigger_status (generated, skipped, duplicate, error)
  - Relationships: Belongs to Client, Pathway. Has one Bill

- **PathwayRateSchedule**: Defines rates for care management services by pathway type and effective date
  - Key Fields: id, pathway_type, service_type, rate, effective_from, effective_to
  - Relationships: Used by STPBillTrigger for rate lookup

---

## Success Criteria

### Measurable Outcomes

- **SC-001**: 100% of care management services on active RC/EoL pathways generate bills automatically (zero missed billing)
- **SC-002**: Manual bill creation effort for RC/EoL services reduced to zero for standard cases
- **SC-003**: Auto-generated bills require corrections in <10% of cases (accuracy target >90%)
- **SC-004**: Time from service delivery to bill generation is under 1 hour (near real-time)
- **SC-005**: Zero duplicate bills generated for the same service event

---

## Assumptions

- Service events for RC and EoL care management are recorded in the system with sufficient detail (client, date, service type) to trigger bill generation
- Pathway status (active, ended) is reliably maintained in the client's record
- Rate schedules for RC and EoL care management services are defined and maintained
- The existing bill processing pipeline can accept auto-generated bills without modification
- Funding stream assignment for RC and EoL pathways follows deterministic rules based on the client's plan

---

## Dependencies

- **Pathway Management**: Client pathway status (RC, EoL) must be tracked and accessible via API or database
- **Service Event Recording**: Care management service events must be recorded with structured data (client, date, type)
- **Rate Schedules**: RC and EoL rate schedules must be configured in the system
- **Bill Processing Pipeline**: Auto-generated bills must be compatible with the existing validation, classification, and claiming pipeline
- **Budget Module**: Funding stream assignment requires access to the client's active plan and available funding streams

---

## Out of Scope

- Clinical pathway management and care plan workflows
- Billing for services outside RC and EoL short-term pathways
- Supplier-submitted invoices (covered by PBS)
- Invoice classification (covered by IRC)
- Claims submission to Services Australia (covered by SCP)
- General invoice automation beyond RC/EoL care management services

## Clarification Outcomes

### Q1: [Data] What constitutes a "care management service event" that triggers bill generation?
**Answer:** The codebase shows care management bills already have automated generation. `ProcessWeeklyCareManagementBills` in `domain/Bill/Actions/ProcessWeeklyCareManagementBills.php` and `CreateCareManagementBill` in `domain/Bill/Actions/CreateCareManagementBill.php` handle automated care management bill creation. The `CheckForDuplicateCareManagementBill` action prevents duplicates. These actions suggest care management billing is event-driven or scheduled. For STP, the "service event" is likely the recording of care management time/activity for an RC or EoL client. This could be triggered by: (a) a scheduled weekly billing run (like `ProcessWeeklyCareManagementBills`), (b) a specific touchpoint/activity log entry for the client, or (c) a manual "record service" action by the Care Partner. The existing weekly care management bill pattern is the most likely trigger mechanism to extend for RC/EoL pathways.

### Q2: [Dependency] Which system tracks RC and EoL pathway status?
**Answer:** The `FundingStream` model has constants for RC (`RESTORATIVE_CARE_EXTERNAL_ID = 'RC'`, `RESTORATIVE_CARE_ID = 3`) and EoL (`END_OF_LIFE_EXTERNAL_ID = 'EL'`, `END_OF_LIFE_ID = 4`). Pathway status is implicitly tracked through funding stream activation — if a client has an active RC or EoL funding stream on their package, they are on that pathway. The `Funding` model has `status` (OPEN/CLOSED) and `start_date`/`end_date` to determine if a pathway funding stream is active. The `Package` model links to fundings. Assumption: Portal tracks pathway status via the presence and status of RC/EoL funding streams, not through a separate "pathway" entity. If the CLI (Clinical Pathways) epic introduces a dedicated pathway entity, STP should consume it; otherwise, funding stream status is the proxy.

### Q3: [Scope] Which epic owns funding stream assignment logic — STP or MPS?
**Answer:** STP should not own funding stream assignment. FR-004's requirement to "assign the correct funding stream based on pathway type" means STP looks up the client's active RC or EoL funding stream (already assigned by the budget/funding module) and assigns the bill to it. MPS handles the activation of funding streams on packages. STP consumes the already-active funding stream. The lookup logic: given client and pathway type (RC or EoL), find the active `Funding` record where `funding_stream_id` matches RC or EoL. This is a query, not an assignment.

### Q4: [Edge Case] Client with both RC and EoL pathways active — how is the correct pathway determined?
**Answer:** The service event itself must indicate which pathway it belongs to. If the care management service is generic (not pathway-specific), the system cannot automatically determine the correct pathway. Recommendation: the service recording form/action must include a `pathway_type` field (RC or EoL) when the client has multiple active pathways. If the client has only one active short-term pathway, auto-assign. If both are active, require explicit selection. The `STPBillTrigger` entity already includes `pathway_type` as a field, confirming this is expected.

### Q5: [UX] Who records care management service events?
**Answer:** Based on the codebase patterns, care management services are either: (a) automatically generated on a schedule (`ProcessWeeklyCareManagementBills` runs weekly), or (b) recorded by Care Partners through touchpoint/activity logging. For RC and EoL pathways, the trigger is likely the same scheduled process — the system checks for clients on active RC/EoL pathways and generates care management bills. The Care Partner does not need to manually trigger bill creation for each service. The `CreateCareManagementBillData` data class in `domain/Bill/Data/` defines the bill creation input.

### Q6: [Data] Where do pathway-specific rate schedules come from?
**Answer:** The `PathwayRateSchedule` entity defined in the spec (pathway_type, service_type, rate, effective_from, effective_to) would be a new table. Currently, rates are managed through `BudgetPlanItemRateData` and rate card infrastructure in the Budget domain. For STP, pathway rates may differ from standard budget rates. The `config/support-at-home.php` file defines service category mappings but not pathway-specific rates. These rate schedules need to be configurable — either in a new database table or in config. Recommendation: use a database table for rate schedules since they are date-versioned and need admin management.

### Q7: [Integration] How do auto-generated bills enter the standard processing pipeline?
**Answer:** FR-010 requires routing to the standard pipeline. The existing `CreateCareManagementBill` action creates bill records that enter the standard flow (evaluation -> approval -> funding allocation -> claiming). STP bills should follow the same pattern: create standard bill/bill_item records with a flag indicating auto-generation (`source: 'stp_auto'`). The `BillProjector` in `domain/Bill/EventSourcing/Projectors/BillProjector.php` and `BillReactor` handle bill lifecycle events. Auto-generated bills should go through the same projector/reactor pipeline.

### Q8: [Edge Case] Duplicate detection — what constitutes a duplicate?
**Answer:** FR-008 prevents duplicates for the same (client, service_date, service_type). The `CheckForDuplicateCareManagementBill` action already implements this pattern for standard care management bills. STP should extend this check to include pathway_type: duplicate = same (client_id, service_date, service_type, pathway_type). This prevents double-billing when the same service event is processed multiple times.

### Q9: [Performance] SC-004 targets bill generation under 1 hour from service delivery. Is this achievable?
**Answer:** If STP extends the weekly `ProcessWeeklyCareManagementBills` scheduled job, the latency is up to 7 days (weekly batch), not 1 hour. To achieve near-real-time (<1 hour), STP needs an event-driven trigger: when a care management service event is recorded, immediately generate the bill. This requires a listener/observer pattern on service events rather than a batch job. Recommendation: implement event-driven generation for new pathway services while maintaining the weekly batch as a safety net that catches any missed events.

### Q10: [Scope] Should STP bills be distinguishable from standard care management bills in the UI?
**Answer:** Yes, FR-011 requires distinct identification with source type and pathway indicator. The bills list (`resources/js/Pages/Bills/Index.vue`) should show a badge or column indicating "STP - RC" or "STP - EoL" for auto-generated pathway bills. The `STPBillTrigger` entity links the bill to its pathway and trigger event, providing the metadata for this display.

## Refined Requirements

- **FR-REFINED-001**: STP bill generation SHOULD be event-driven (triggered by service event recording) rather than batch-only, to achieve the <1 hour SC-004 target. A weekly batch job should serve as a safety net for missed events.
- **FR-REFINED-002**: When a client has both active RC and EoL pathways, the service recording interface MUST require explicit pathway selection. Auto-assignment is only permitted when a single short-term pathway is active.
- **FR-REFINED-003**: Duplicate detection MUST include `pathway_type` in the uniqueness check: (client_id, service_date, service_type, pathway_type).
- **FR-REFINED-004**: Pathway rate schedules SHOULD be stored in a database table (not config) to support date-versioning and admin management.
