---
title: "Feature Specification: Digital Statements (DST)"
description: "Online monthly financial statements for clients with compliant, transparent budget visibility"
---

> **[View Mockup](/mockups/digital-statements/index.html)**{.mockup-link}

**Status**: Draft
**Epic**: TP-1907 | **Initiative**: Budgets & Finance
**Prefix**: DST | **Created**: 2026-01-14

---

## Overview

Digital Statements replaces manual, paper-based financial statement generation with an automated digital system integrated with the Trilogy Care Portal. The feature generates Support at Home-compliant monthly statements showing funding streams, service bookings, participant co-payments, coordination fees, remaining budgets, and transaction history. Statements are delivered via portal, email, and hard copy, with QR code access for participants. The system includes an interactive digital transaction table with filtering, hyperlinking to source documents, and dispute lodging capabilities.

A critical architectural decision ([ADR-001](/initiatives/budgets-and-finance/digital-statements/context/adr-001-statement-data-source)) addresses the data source for statements, transitioning from MYOB GL transactions (which have unreliable category classifications) to Portal funding consumptions as the source of truth, with a phased approach: Option A (hide classifications) immediately, Option B (consumptions with adjustment sync) in Q1 2026, and Option C (correct classifications before GL posting) in Q2 2026.

**Scope boundaries**: This specification covers monthly statement generation, delivery, and the interactive statement view in the Portal. It does not cover the real-time transaction log view (covered by [Digital Transactions](/initiatives/budgets-and-finance/digital-transactions)), care plan redesign, or supplier billing workflows beyond their data contribution to statements.

---

## User Scenarios & Testing

### User Story 1 - Recipient Views Monthly Statement (Priority: P1)

As a recipient, I want to view my monthly financial statement in the portal, so that I can see what services were delivered, what was charged, and my remaining budget.

**Why this priority**: Mandatory compliance requirement - Support at Home requires monthly statements delivered by the last day of the following month.

**Acceptance Scenarios**:

1. **Given** a recipient logs into the portal, **When** they navigate to their statements section, **Then** they see a list of available monthly statements ordered by period
2. **Given** a statement is available for November, **When** the recipient opens it, **Then** it shows funding streams grouped by SERG classification (Ongoing Support, Assistive Technology, Home Modifications) with line-item consumptions filtered by payment period
3. **Given** a statement displays, **When** the recipient reviews totals, **Then** period totals and running balance are shown alongside each funding stream
4. **Given** the statement mirrors the Portal funding streams view, **When** the recipient compares portal budget page to statement, **Then** the same data structure, groupings, and totals are consistent

---

### User Story 2 - Recipient Downloads Statement PDF (Priority: P1)

As a recipient, I want to download a PDF version of my statement, so that I can print, share, or keep a permanent record.

**Why this priority**: Many recipients prefer or require physical copies. PDF generation infrastructure is already functional.

**Acceptance Scenarios**:

1. **Given** a recipient views a monthly statement, **When** they click "Download PDF", **Then** a branded PDF is generated and downloaded
2. **Given** a PDF is generated, **When** the recipient opens it, **Then** it contains the same data as the portal view for that period with Trilogy Care branding
3. **Given** a statement includes multiple funding streams, **When** the PDF renders, **Then** each funding stream appears as a distinct section with its consumptions

---

### User Story 3 - Statement Delivered via Email and Post (Priority: P1)

As a recipient, I want my monthly statement delivered to me via email and hard copy post, so that I receive it without needing to log in.

**Why this priority**: Not all recipients actively use the portal. Multi-channel delivery ensures compliance with statement distribution requirements.

**Acceptance Scenarios**:

1. **Given** a monthly statement is generated, **When** the delivery process runs, **Then** the statement PDF is emailed to the recipient's registered email address
2. **Given** a recipient has opted for hard copy, **When** the statement is generated, **Then** a hard copy is queued for postal mailing
3. **Given** a statement email is sent, **When** the recipient opens it, **Then** the email includes the PDF as an attachment or a link to view in portal

---

### User Story 4 - QR Code Statement Access (Priority: P2)

As a recipient, I want to access my statement via a QR code, so that I can quickly view it on my mobile device.

**Why this priority**: Enhances accessibility for recipients who may find portal login cumbersome. QR code feature is already in progress (TP-706).

**Acceptance Scenarios**:

1. **Given** a hard copy statement includes a QR code, **When** the recipient scans it, **Then** they are directed to the digital version of that statement in the portal
2. **Given** a QR code is scanned, **When** the recipient is not logged in, **Then** they are prompted to authenticate before viewing the statement
3. **Given** the QR code links to a specific statement period, **When** accessed, **Then** it opens directly to the correct month's statement

---

### User Story 5 - Interactive Transaction Table (Priority: P2)

As a recipient, I want to filter and group my statement transactions by funding stream, so that I can understand spending in specific areas.

**Why this priority**: Interactive capabilities go beyond static PDF and empower recipients with self-service financial analysis.

**Acceptance Scenarios**:

1. **Given** a recipient views a digital statement, **When** they use the filter controls, **Then** they can filter transactions by funding stream, date range, and service type
2. **Given** a transaction is displayed, **When** the recipient clicks on it, **Then** a hyperlink navigates to the source document (bill, invoice)
3. **Given** a recipient identifies a discrepancy, **When** they click "Dispute", **Then** a dispute workflow is initiated directly from the transaction line

---

### User Story 6 - Automated Statement Generation (Priority: P1)

As a system administrator, I want statements to be generated automatically on a scheduled basis, so that manual compilation is eliminated.

**Why this priority**: Manual generation is time-consuming and error-prone. Compliance requires timely statement delivery.

**Acceptance Scenarios**:

1. **Given** a monthly period closes, **When** the scheduled generation runs, **Then** statements are generated for all active packages with transactions in that period
2. **Given** an administrator needs an ad-hoc statement, **When** they trigger manual generation for a specific package and period, **Then** a statement is generated on demand
3. **Given** a statement is generated, **When** verified, **Then** it uses the `payment_period` field from funding consumptions to determine which items belong to the statement month

---

### User Story 7 - Care Coordinator Views Client Statements (Priority: P1)

As a care coordinator, I want to view my client's statements in the portal, so that I can reference them when explaining financial details.

**Why this priority**: Coordinators need access to the same financial information as recipients to support client conversations. Currently hidden due to incorrect fee calculations (TP-3923).

**Acceptance Scenarios**:

1. **Given** a care coordinator opens a client's package, **When** they navigate to statements, **Then** they see the same statement data as the recipient
2. **Given** coordinator statements were previously hidden due to fee calculation errors, **When** the data source is switched to consumptions, **Then** coordinator statements display correct fee breakdowns
3. **Given** a coordinator views a statement, **When** they compare it to the Portal funding streams view, **Then** the data is consistent

---

### Edge Cases

- **ATHM-only clients**: Statements should be generated but may be sparse (AT-HM items only, no ongoing services)
- **Package with no transactions in a period**: Generate an empty statement showing zero activity with available balance carried forward
- **Finance adjustments in MYOB with no Portal record**: Under Option A, adjustments are included from MYOB but categories are hidden. Under Option B, adjustments must be synced back to Portal as consumption records with `source: 'myob_adjustment'`
- **Statement period spanning claim reconciliation**: If categories were corrected during claiming, the consumptions table reflects the corrected values; the transactions table does not
- **2026 requirements (TP-3836)**: Future statements must include committed AT-HM funds and care management hours
- **Multiple funding streams with different time windows**: Statement must correctly show only active funding streams for the statement period

---

## Functional Requirements

- **FR-001**: The system MUST generate monthly statements by the last day of the following month per Support at Home requirements
- **FR-002**: The system MUST use `budget_plan_item_funding_consumptions` table as the primary data source for statement line items (per ADR-001 Option B)
- **FR-003**: The system MUST use `payment_period` field (from daily payrun paid date) to determine which consumptions belong to which statement month
- **FR-004**: The system MUST group statement line items by funding stream (SERG classification: Ongoing Support, Assistive Technology, Home Modifications)
- **FR-005**: The system MUST display period totals and running balance for each funding stream
- **FR-006**: The system MUST mirror the Portal funding streams view structure so that statement and portal show consistent data
- **FR-007**: The system MUST generate downloadable PDF statements with Trilogy Care branding
- **FR-008**: The system MUST deliver statements via email (PDF attachment or portal link) and support hard copy postal mailing
- **FR-009**: The system MUST support scheduled (automated) and on-demand (manual) statement generation
- **FR-010**: The system MUST support QR code access linking to the digital version of a specific statement period
- **FR-011**: The system SHOULD hide SERG/SERV/co-contribution classification labels when data reliability cannot be verified (Option A interim)
- **FR-012**: The system SHOULD create consumption records for MYOB finance adjustments with a `source` field tracking origin (`bill_item`, `myob_adjustment`, `claim_correction`, `manual`) (Option B)
- **FR-013**: The system SHOULD provide interactive filtering by funding stream, date range, and service type on digital statement views
- **FR-014**: The system SHOULD provide hyperlinks from transaction line items to source documents
- **FR-015**: The system SHOULD support a dispute workflow initiated directly from statement transaction lines
- **FR-016**: The system MUST display care coordinator statements with correct fee calculations (resolving TP-3923)
- **FR-017**: The system MUST handle the `BillMarkedAsPaidEvent` to update `payment_period` on funding consumption records

---

## Key Entities

| Entity | Description |
|--------|-------------|
| **Statement** | A monthly financial report for a package showing consumptions, balances, and funding stream breakdowns for a specific period |
| **Funding Consumption** | A record in `budget_plan_item_funding_consumptions` representing a charge against a funding stream, with corrected SA-reconciled categories |
| **Payment Period** | A 6-character string (e.g., "112025" for November 2025) derived from the daily payrun paid date, used to assign consumptions to statement months |
| **Funding Stream (SERG)** | Classification of funding: Ongoing Support, Assistive Technology, Home Modifications |
| **Source Field** | Origin tracker on consumption records: `bill_item`, `myob_adjustment`, `claim_correction`, `manual` |
| **GL Transaction** | MYOB general ledger entry; current (unreliable) data source being replaced by consumptions |
| **Statement PDF** | Generated document delivered via portal, email, and postal mail |

---

## Success Criteria

### Measurable Outcomes

- 80% of participants accessing digital statements through the portal
- Statement generation time reduced by 90% compared to manual process
- Zero manual statement preparation required for standard monthly requests
- Participant satisfaction with financial transparency improved by 15%
- 100% of statements delivered by the last day of the following month (compliance)
- Statement data matches Portal funding streams view with zero divergence

---

## Assumptions

- Accurate, consolidated transaction and contribution data is available from MYOB sync, budget modules, and claims workflows
- Participants have access to digital devices and internet (with paper alternative for those who do not)
- Budget V2 migration is complete, ensuring accurate funding data
- Claims workflow is stable, ensuring correct subsidy and co-payment values
- Recipients will prefer an online interactive statement view alongside PDFs

---

## Dependencies

- Budget V2 completion and migration for accurate funding data
- Claims workflow stability for correct subsidy and co-payment values
- MYOB/Portal sync for contributions and adjustments
- ADR-001 decision approval (data source: consumptions vs transactions)
- `BillMarkedAsPaidEvent` infrastructure for `payment_period` population
- QR Code Statements feature (TP-706) for QR code access
- Portal infrastructure for statement delivery (email, portal view)
- Statement design uplift (TP-3836) for 2026 requirements

---

## Out of Scope

- Real-time transaction log view in portal (covered by [Digital Transactions](/initiatives/budgets-and-finance/digital-transactions))
- Care plan redesign
- Supplier billing workflow changes (beyond data contribution to statements)
- Full two-way MYOB sync (Option C deferred to Q2 2026+)
- Advanced analytics or spending trend visualizations
- Client-facing budget preview/PDF (covered by [Consumer Budget Preview](/initiatives/budgets-and-finance/consumer-budget-preview))

## Clarification Outcomes

### Q1: [Dependency] Has ADR-001 Option B been formally approved?
**Answer:** The spec treats Option B (consumptions with adjustment sync) as the target architecture, and the codebase shows evidence of implementation. The `StatementRunController` in `domain/Statement/Http/Controllers/StatementRunController.php` handles statement generation. The assembler pipes in `domain/Statement/Assembler/Pipes/` (including `AssembleQuarterSpendSummary`, `AssembleSapsiExpenses`, `AssembleSapsiFundings`) demonstrate an existing statement generation pipeline. The FRR spec's `MyobAdjustmentProjector` already creates adjustment records linked to funding consumptions. FR-002 explicitly references `budget_plan_item_funding_consumptions` as the data source. Assumption: Option B is the approved direction based on the spec's definitive language and codebase alignment.

### Q2: [Data] What happens for bills paid across two different periods (payment straddles month-end)?
**Answer:** The spec defines `payment_period` as derived from the "daily payrun paid date." Each bill payment occurs on a specific payrun date, so a bill payment lands in exactly one period. If a bill has multiple partial payments across periods, each payment would have its own `payment_period`. The `BillMarkedAsPaidEvent` in `domain/Bill/EventSourcing/Events/BillMarkedAsPaidEvent.php` fires when a bill is marked as paid — this event should populate the `payment_period` field on funding consumption records. The consumption record's `payment_period` is atomic per payment event, so straddling does not occur for individual consumption records.

### Q3: [Integration] What is the mechanism for queuing postal mail? Is there existing infrastructure?
**Answer:** No postal mail integration currently exists in the codebase. The `domain/Statement/Notifications/YourMonthlyStatementNotification.php` handles email delivery. Postal mail would require either: (a) integration with a print-and-mail service (e.g., Lob, PostGrid, or an Australian equivalent like PostConnect), or (b) generating a batch of PDFs for manual printing and mailing. Recommendation: for MVP, generate a "postal batch" of PDFs that the operations team can print and mail. Automated print-and-mail integration can be a future enhancement. The `StatementSendItem` model and `StatementSendItemTable` suggest a tracking mechanism for statement delivery that could be extended with a `delivery_method` field (email, postal, portal).

### Q4: [Edge Case] Are "2026 requirements (TP-3836)" documented and do they affect current data model design?
**Answer:** The spec mentions TP-3836 requires committed AT-HM funds and care management hours in future statements. This directly relates to the AFC (ATHM Funding Commitment) epic's `is_funding_held` feature — held AT-HM funds would appear as "committed" in statements. For care management hours, the STP (Short Term Pathway Invoicing) epic tracks care management service events. The current data model should include: (a) a `committed_amount` field or relationship on funding consumption/statement records to support AT-HM display, and (b) care management hours from bill items. These fields should be nullable for now and populated when the upstream features ship.

### Q5: [Scope] Should the dispute workflow share a common model with other epics?
**Answer:** Yes. A shared dispute model would be beneficial since DST, DTX, and potentially consumer mobile features all need "query this transaction" capability. The dispute entity should be generic: `Dispute(id, disputable_type, disputable_id, user_id, reason, status, resolution, created_at)` using a polymorphic relationship. For MVP (DST), a lightweight version that creates a note/task for Finance is sufficient. Full dispute resolution workflow can be built later. FR-015 is marked as SHOULD, so it is not critical path.

### Q6: [Data] The `source` field on consumption records tracks origin. What are all valid sources?
**Answer:** Per FR-012: `bill_item` (standard bill processing), `myob_adjustment` (MYOB finance adjustment synced to Portal), `claim_correction` (SA claim reconciliation correction), `manual` (manual Finance entry). The FRR spec's `MyobAdjustmentProjector` already creates adjustment-sourced records. This `source` field is critical for statement accuracy — it allows statements to show where each charge originated, and helps diagnose discrepancies.

### Q7: [Performance] Statement generation for all active packages — what is the expected volume?
**Answer:** The scheduled generation runs monthly for all active packages. If there are ~2000 active packages, generation needs to handle this volume within a reasonable time window (overnight batch). The `StatementRunController` suggests batch processing is already patterned. PDF generation is the bottleneck — each PDF takes seconds. Recommendation: use queued jobs with configurable concurrency. The `domain/Statement/Seeders/StatementPDFSeeder.php` suggests PDF generation is already supported.

### Q8: [Integration] How does the statement data mirror the Portal funding streams view?
**Answer:** FR-006 requires consistency between statements and the portal budget page. The `AssembleSapsiFundings` pipe and `FundingPageSectionRowData` handle funding section assembly for statements. The budget V2 funding stream actions (`GetBudgetPlanFundingStreamsAction`) provide portal funding data. Both should use the same underlying data source (funding consumptions table). The test `AssembleSapsiFundingsTest` validates this consistency.

### Q9: [Compliance] What is the regulatory deadline for statement delivery?
**Answer:** FR-001 states: "by the last day of the following month per Support at Home requirements." This means November statements must be delivered by December 31. The automated generation should run by the 25th of the following month to allow review time before delivery.

### Q10: [Data] How does the `payment_period` field interact with the ATHM Funding Commitment (AFC) epic?
**Answer:** Held ATHM funds (from AFC) affect budget allocation but not payment periods. `payment_period` is derived from actual bill payments (when money moves), not budget planning. Held funds are a planning concept; payment periods are a billing concept. No direct interaction, but statements should eventually show committed (held) AT-HM amounts per TP-3836 requirements.

## Refined Requirements

- **FR-REFINED-001**: For postal mail delivery (US3), the MVP SHOULD generate a "postal batch" PDF export for manual printing. Automated print-and-mail integration should be deferred to a future phase.
- **FR-REFINED-002**: The consumption/statement data model SHOULD include nullable `committed_amount` and `care_management_hours` fields to prepare for TP-3836 2026 requirements without requiring a breaking migration.
- **FR-REFINED-003**: Statement generation MUST be implemented as queued jobs with configurable concurrency to handle batch generation for ~2000+ active packages.
- **FR-REFINED-004**: A shared, polymorphic dispute model SHOULD be designed for use across DST, DTX, and consumer mobile features, rather than building a DST-specific implementation.
