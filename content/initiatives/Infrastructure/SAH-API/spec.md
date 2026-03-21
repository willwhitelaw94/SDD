---
title: "Feature Specification: SaH API Integration (SAH)"
---

**Status**: Draft
**Epic**: TP-432 | **Initiative**: Infrastructure

---

## Overview

Trilogy Care needs to integrate directly with the Services Australia (SA) Aged Care API to submit claims, lodge entry/departure records (ACER), retrieve budgets and payment information, and sync care recipient data under the Support at Home (SaH) program effective July 2025. The current process relies on CSV uploads via Databricks, which took 15 hours for a single claim run and is unsustainable at scale with 1,000+ daily invoices.

This epic delivers direct API integration from TC Portal to Services Australia, covering eight API endpoints prioritized by business criticality. The Invoice and Claim APIs (real-time and daily cadence) are the highest priority, enabling automated claim submission that replaces the manual CSV workflow. The Entry/Departure API enables ACER lodgement triggered by HCA signing. Budget, Care Recipient Summary, and Payment Statement APIs provide real-time financial visibility. PRODA authentication is already operational. The production deadline is the first week of April 2026, with practice runs during February-March 2026.

---

## User Scenarios & Testing

### User Story 1 - Submit Claims via API (Priority: P0)

As a finance team member, I want claims to be submitted automatically to Services Australia via the API so that claim processing takes minutes instead of 15 hours and eliminates manual CSV generation.

**Why this priority**: This is the primary business driver. The CSV process is unsustainable and the April 2026 production deadline is immovable.

**Independent Test**: Can be tested by approving a bill in Portal and verifying the corresponding claim appears in the Services Australia test environment within the expected cadence.

**Acceptance Scenarios**:

1. **Given** a bill is approved in Portal, **When** the daily claim batch runs, **Then** the bill is enriched with classification data, submitted to SA via the Claim API, and the claim status is tracked in Portal
2. **Given** a claim is submitted, **When** SA validates it, **Then** the response status (Held, Accepted, Rejected) is recorded against the Portal bill and visible to finance staff
3. **Given** a claim is rejected by SA, **When** the rejection reason is returned, **Then** the error is displayed on the bill with a clear description and the bill is flagged for correction
4. **Given** a batch of 100+ claims is submitted, **When** the batch completes, **Then** processing time is under 30 minutes (vs 15 hours for CSV)

### User Story 2 - Submit Invoices to SA (Priority: P0)

As a bill processor, I want invoices to be submitted to Services Australia in real-time so that the claim pipeline stays current and delays are minimized.

**Why this priority**: The Invoice API is the highest-volume integration (1,000+ per day) and feeds directly into the claim process.

**Independent Test**: Can be tested by creating and submitting an invoice via Portal and verifying it appears in SA's invoice endpoint with correct line items.

**Acceptance Scenarios**:

1. **Given** a bill is processed and classified, **When** the invoice submission is triggered, **Then** the invoice is created in SA with all mandatory fields: `careRecipientId`, `serviceId` (Tier 3), `deliveryDate`, `quantity` (0.25 increments), `pricePerUnit`, and `fundingSource`
2. **Given** an invoice contains AT-HM items, **When** submitted, **Then** the `itemDescriptionCode`, `purchaseMethodType` (PURCHASED/LOANED), and evidence documents are included
3. **Given** an invoice is submitted past the 60-day claim window, **When** submitted, **Then** the `lateSubmissionReasonCode` is included with the required PDF justification uploaded
4. **Given** the invoice status flow progresses (OPEN > SUBMITTED > HELD > CLAIMED > COMPLETED), **When** status changes occur, **Then** Portal reflects the current status in real-time

### User Story 3 - Lodge Entry Records (ACER) on HCA Signing (Priority: P0)

As a care coordinator, I want entry records to be automatically lodged with Services Australia when a Home Care Agreement is signed so that the participant can start receiving funded services immediately.

**Why this priority**: Entry records must be lodged before any claims can be submitted. Delays in ACER lodgement block the entire claim pipeline for a participant.

**Independent Test**: Can be tested by marking an HCA as signed and verifying the ACER entry record(s) appear in SA's Entry/Departure endpoint.

**Acceptance Scenarios**:

1. **Given** an HCA reaches "Signed" state, **When** the background job fires, **Then** entry records are lodged for all applicable classifications (ON, AT, HM, RC, EL) in a single batch
2. **Given** a participant has multiple classifications (e.g., Ongoing + AT + HM), **When** the HCA is signed, **Then** separate ACER records are lodged for each classification with the correct `entryCategoryCode`
3. **Given** the entry API call fails with a transient error, **When** the retry logic activates, **Then** exponential backoff retries up to 3 times before flagging for manual intervention
4. **Given** the ACER lodgement succeeds, **When** a care coordinator views the HCA detail page, **Then** the ACER status shows as "Lodged" (or "Confirmed" after SA processing)

### User Story 4 - Retrieve Real-Time Budget Information (Priority: P1)

As a care partner, I want to see real-time budget balances from Services Australia so that I can make informed decisions about service delivery and avoid over-commitment.

**Why this priority**: Budget visibility drives daily care decisions. Stale budget data leads to over-servicing and financial risk.

**Independent Test**: Can be tested by comparing budget figures displayed in Portal against the SA test environment for a given participant.

**Acceptance Scenarios**:

1. **Given** a care partner views a participant's package, **When** the budget section loads, **Then** it displays the current quarterly budget, HCP unspent (provider-held and SA-held), and remaining balances from the daily SA sync
2. **Given** a claim has been processed by SA, **When** the next budget sync runs, **Then** the budget balances reflect the claimed amount and draw-down order (quarterly > provider-held HCP unspent > SA-held HCP unspent)
3. **Given** a participant has zero remaining budget, **When** a care partner views the package, **Then** a clear indicator shows budget exhausted with guidance on zero-value claim requirements

### User Story 5 - Lodge Departure Records (Priority: P1)

As an operations staff member, I want departure records to be submitted to Services Australia when a participant exits so that compliance obligations are met within the 28-day lodgement window.

**Why this priority**: Departure records have strict regulatory timeframes. Late lodgement risks compliance penalties.

**Independent Test**: Can be tested by initiating a participant exit in Portal and verifying the departure record appears in SA with the correct reason code and date.

**Acceptance Scenarios**:

1. **Given** a participant exit is initiated, **When** the departure record is submitted, **Then** it includes the correct `departureReasonCode` (TERMS, DECEA, TORES, MOVED, CEASE, etc.) and `departureDate`
2. **Given** a departure is lodged, **When** SA processes it, **Then** the response status (Held, Accepted, Rejected) is recorded in Portal
3. **Given** a participant exit was 20 days ago and no departure record has been lodged, **When** a staff member views the participant's record, **Then** an urgent alert indicates the 28-day deadline is approaching

### User Story 6 - Reconcile Payments (Priority: P2)

As a finance manager, I want payment statements from Services Australia synced daily so that I can reconcile payments received against claims submitted.

**Why this priority**: Financial reconciliation is essential but can initially be done manually. Automation improves accuracy and reduces effort.

**Independent Test**: Can be tested by comparing Portal payment records against SA payment statement data for a given period.

**Acceptance Scenarios**:

1. **Given** the daily payment sync runs, **When** payment statements are retrieved, **Then** each payment item is matched to the corresponding Portal claim and bill
2. **Given** a payment amount differs from the claimed amount, **When** the reconciliation identifies the discrepancy, **Then** it is flagged for finance review with the variance amount and reason

### Edge Cases

- What happens when the SA API returns "Service Temporarily Unavailable"? Check the invoice GET response for hidden validation messages (per QUIRKS.md). Retry with exponential backoff, and if persistent, queue for manual submission.
- What happens when an invoice's ETag mismatches during update? Always use the ETag from the closest related entity (invoice item ETag for invoice item updates, not the invoice ETag). Refresh the ETag and retry.
- What happens when a claim exceeds the participant's budget? Submit the full claim amount regardless. SA auto-draws from HCP unspent funds per the draw-down order. The provider absorbs any remaining difference or invoices the participant (with prior agreement).
- What happens when classification data is missing or low-confidence at claim time? The pre-claim validation gate blocks submission until classification is verified (human review or high-confidence AI at Tier 3 level). Claims are not submitted with unverified classifications.
- What happens when a participant has no SA-issued `careRecipientId`? A `temp-access-key` is required for initial entry. The ID is assigned by SA upon first entry record acceptance.
- What happens when the PRODA token expires mid-batch? The `AttachFreshProdaHeaders` middleware handles token refresh. If refresh fails, the batch pauses and alerts the operations team.
- What happens for late claims (>60 days past quarter end)? The system requires a `lateSubmissionReasonCode` and PDF justification upload. Aboriginal/Torres Strait Islander cultural leave does not require evidence.

---

## Functional Requirements

**Invoice & Claim Submission (P0 - MVP)**:

- **FR-001**: Portal MUST submit invoices to the SA Invoice API with all mandatory fields (`careRecipientId`, `serviceId`, `deliveryDate`, `quantity`, `pricePerUnit`, `fundingSource`)
- **FR-002**: Portal MUST submit claims to the SA Claim API on a daily batch cadence
- **FR-003**: Invoice status transitions (OPEN > SUBMITTED > HELD > CLAIMED > COMPLETED > DELETED) MUST be tracked and displayed in Portal
- **FR-004**: Claim validation errors from SA MUST be displayed on the corresponding bill with actionable error messages
- **FR-005**: Late submissions (>60 days) MUST require a `lateSubmissionReasonCode` and PDF justification
- **FR-006**: AT-HM items MUST include `itemDescriptionCode`, `purchaseMethodType`, and evidence documents (prescription + invoice/quote for High Tier)
- **FR-007**: Zero-value claims MUST be supported for compliance when budget is exhausted

**Entry/Departure (P0 - MVP)**:

- **FR-008**: Entry records (ACER) MUST be lodged automatically when an HCA reaches "Signed" state
- **FR-009**: Multiple entry records MUST be lodged simultaneously for participants with multiple classifications
- **FR-010**: Departure records MUST be submitted with correct reason codes within 28 days of exit
- **FR-011**: ACER status MUST be visible on the HCA detail page (Pending, Lodged, Confirmed, Failed, Manual Override)
- **FR-012**: Retry logic with exponential backoff MUST handle transient API failures for entry/departure calls

**Budget & Reconciliation (P1)**:

- **FR-013**: Budget balances MUST be synced daily from the SA Budget API and displayed on participant packages
- **FR-014**: Care Recipient Summary data MUST be synced daily for classification and approved services validation
- **FR-015**: Payment statements MUST be synced daily for financial reconciliation
- **FR-016**: Funding draw-down order (quarterly > provider-held HCP unspent > SA-held HCP unspent) MUST be correctly applied

**Pre-Claim Validation (P0 - MVP)**:

- **FR-017**: Invoices MUST NOT be submitted for claim until classification is verified at Tier 3 level
- **FR-018**: Pre-submission validation MUST catch common errors (invalid recipient IDs, wrong service codes, incorrect funding sources) before SA submission
- **FR-019**: Reclassification workflow MUST track original vs reclassified codes for accuracy metrics

**Authentication & Infrastructure (P0 - MVP)**:

- **FR-020**: PRODA authentication MUST be maintained with automatic token refresh via `AttachFreshProdaHeaders`
- **FR-021**: All SA API calls MUST include required headers (`dhs-auditId`, `dhs-subjectId`, `dhs-messageId`, `dhs-correlationId`, `X-IBM-Client-Id`)
- **FR-022**: API call logs MUST be retained for audit and troubleshooting purposes

---

## Key Entities

- **SA Invoice**: A container for line items submitted to Services Australia. Maps from Portal bills. Contains items with `careRecipientId`, `serviceId`, `deliveryDate`, `quantity`, `pricePerUnit`, `fundingSource`. Status flow: OPEN > SUBMITTED > HELD > CLAIMED > COMPLETED.
- **SA Claim**: A grouped set of invoices submitted for payment processing. Created from daily batch runs. Tracks submission status, SA response, and payment outcome.
- **SA Payment Item**: The actual payment record after SA validates a claim. Amount may differ from claimed amount based on budget availability and draw-down rules.
- **ACER (Entry Record)**: An entry registration for a participant under a specific classification (`entryCategoryCode`: ON, AT, HM, RC, EL). Required before any claims can be submitted. Linked to HCA signing.
- **Departure Record**: An exit registration for a participant with reason code and departure date. Required within 28 days of exit. Triggers final claim window (60 days).
- **Care Recipient**: A participant record with SA-issued `careRecipientId` (immutable after creation). Contains classification, approved services, and budget information synced from SA.
- **Classification**: A 5-tier service hierarchy mapping Portal services to SA service codes. Tier 3 (`serviceId`) is mandatory for invoices. Tier 5 is required for AT-HM claims.
- **Funding Source**: One of ON (Ongoing), CM (Care Management), RC (Restorative Care), EL (End-of-Life), AT (Assistive Technology), HM (Home Modifications), AS (HCP Commonwealth Unspent).

---

## Success Criteria

### Measurable Outcomes

- **SC-001**: Claim lodgement time reduced from 15 hours (CSV) to under 1 hour (API) for a full claim run
- **SC-002**: Zero manual data entry required for standard claim submissions
- **SC-003**: Real-time budget visibility available for all active participants via daily SA sync
- **SC-004**: ACER lodgement automated on HCA signing with >95% success rate on first attempt
- **SC-005**: Departure records lodged within 14 days of exit (well within 28-day compliance window)
- **SC-006**: Pre-claim validation catches >90% of errors before SA submission (reducing SA rejections)
- **SC-007**: Production-ready API integration operational by first week of April 2026

---

## Assumptions

- PRODA authentication is operational and stable (confirmed done)
- The SA APIs will be stable by the production deadline (APIs were unstable during initial rollout, necessitating the CSV fallback)
- The existing `app-modules/aged-care-api/` module provides a suitable foundation for extending API integration
- Classification accuracy (AI or human review) is sufficient to support automated claim submission
- The HCA Epic (TP-1865) will deliver the HCA signing workflow that triggers ACER lodgement
- SA's auto-draw-down of HCP unspent funds will function as documented in the SaH Manual v4.2
- Databricks can be removed from the claim path once direct API integration is stable

---

## Dependencies

- **PRODA Authentication**: Operational (done). Token refresh via `AttachFreshProdaHeaders`
- **HCA Epic (TP-1865)**: Provides the HCA signing trigger for ACER lodgement. ACER status tracking story [PLA-1118](https://linear.app/trilogycare/issue/PLA-1118) is part of that epic
- **Classification Workflow**: Tier 3/5 service code mapping must be accurate before claims can be submitted. Risk: Khoa (classification lead) availability. Related: [PLA-1216](https://linear.app/trilogycare/issue/PLA-1216), [PLA-1185](https://linear.app/trilogycare/issue/PLA-1185)
- **Bill Processing**: Approved bills are the input to the invoice/claim pipeline
- **SA OpenAPI Specifications**: `Aged_Care_API_-_Support_at_Home_claim-1.0.0.yaml` and `Aged_Care_API_-_Support_at_Home_Invoices-1.0.0.yaml`
- **Databricks**: Current CSV pathway remains as fallback until API integration is validated
- **Budget domain**: Budget display components must consume data from the Budget API sync

---

## Out of Scope

- Building a full Databricks replacement (Databricks is a fallback, not being rebuilt)
- Individual Contribution API integration (6/10 priority, deferred to post-launch)
- Service List API integration (2/10 priority, monthly cadence, low urgency)
- AI classification model training or hosting (separate initiative [PLA-1216](https://linear.app/trilogycare/issue/PLA-1216))
- Reclassification workflow UX design (TBD, needs Khoa's input)
- Participant-facing budget portal (internal staff visibility only for MVP)
- HCP unspent funds reconciliation with SA (data not yet available in API response)
- Migration of historical CSV-submitted claims into the new system
- Multi-provider claim scenarios (single-provider focus for MVP)

## Clarification Outcomes

### Q1: [Scope] Which endpoints are required for the April 2026 deadline?
**Answer:** The spec clearly prioritises: **P0 (April deadline):** Invoice API (US2, highest volume), Claim API (US1, core business driver), Entry/Departure API (US3/US5, compliance gating). **P1 (post-April):** Budget API (US4), Care Recipient Summary API, Payment Statement API (US6). **The April deadline requires 4 endpoints:** Invoice submission, Claim submission, Entry record lodgement, and Departure record submission. The budget and reconciliation APIs can be phased after April since the existing Databricks CSV process can serve as a fallback for budget data.

### Q2: [Dependency] What is the priority order for endpoint delivery?
**Answer:** Based on dependency analysis: (1) **Invoice API first** -- highest volume (1,000+/day), feeds into claims. (2) **Claim API second** -- depends on invoices being submitted. (3) **Entry/Departure API third** -- depends on HCA signing (Client-HCA epic). (4) **Budget API fourth** -- unblocks budget display in Portal and MOB1. (5) **Payment Statement API fifth** -- unblocks FRR reconciliation. **The codebase already has foundation code** in `app-modules/aged-care-api/` with PRODA authentication, connectors, and controllers, confirming active development.

### Q3: [Data] Where does classification data come from for claim enrichment?
**Answer:** The spec references "pre-claim validation gate" (FR-017) requiring Tier 3 classification verification. The codebase has `domain/Package/Models/PackageAllocatedClassification.php` for classification tracking. The classification source is described in the spec as "human review or high-confidence AI at Tier 3 level." **Classification data comes from multiple sources:** (a) AI Invoice V3 auto-classification (primary), (b) Invoice Reclassification manual review (fallback), (c) Manual entry (last resort). The pre-claim validation gate (FR-017) ensures no unverified classifications are submitted. **The `PackageAllocatedClassification` model is the source of truth** for verified classifications.

### Q4: [Edge Case] What is the rate of late submissions? Is there proactive identification?
**Answer:** The spec does not provide current late submission rates. **Recommendation:** Build a proactive alert system that identifies claims approaching the 60-day deadline. A scheduled job (daily) should query invoices where `delivery_date + 60 days < today + 7 days` and flag them for urgent processing. This aligns with the care management compliance approach (similar to CMA's overdue detection). **FR-005 requires `lateSubmissionReasonCode` and PDF justification** -- the workflow should prompt for these when a late submission is detected.

### Q5: [Integration] What is the PRODA token refresh mechanism?
**Answer:** The codebase confirms PRODA is operational: `app-modules/aged-care-api/src/Http/Integrations/AttachFreshProdaHeaders.php` handles token refresh, and `app-modules/aged-care-api/src/Models/ProdaDevice.php` manages PRODA device certificates. **The `AttachFreshProdaHeaders` middleware automatically refreshes tokens before they expire.** FR-020 confirms this: "PRODA authentication MUST be maintained with automatic token refresh via `AttachFreshProdaHeaders`." Certificate rotations are handled through the ProdaDevice model with manual certificate upload. **No additional work needed for PRODA authentication.**

### Q6: [Performance] Can the system handle 1,000+ invoices per day?
**Answer:** SC-001 targets "under 1 hour" for a full claim run (vs 15 hours for CSV). With 1,000+ invoices per day, the Invoice API needs to process ~42 invoices per hour sustained, or handle bursts of several hundred in a batch. **The API calls should be queue-processed via Laravel Horizon** with concurrency control (SA API rate limits are not documented in the spec). **Add a configurable batch size and rate limit** to prevent overwhelming the SA API.

### Q7: [Data] How is the ETag mechanism handled?
**Answer:** The edge cases mention ETag mismatches: "Always use the ETag from the closest related entity." This is a SA API requirement -- every update requires the current ETag to prevent stale overwrites. **The Portal must store ETags alongside each SA entity** (invoice ETag, claim ETag) and refresh them before updates. The `ServicesAustraliaInvoiceState` model at `domain/Bill/Models/ServicesAustraliaInvoiceState.php` should include an `etag` column.

## Refined Requirements

1. **Invoice API is the #1 priority** -- deliver before Claim API since claims depend on submitted invoices.
2. **Build a proactive late-submission alert** -- daily job identifying claims within 7 days of the 60-day deadline.
3. **Store ETags alongside SA entities** for concurrency control during API updates.
4. **Add configurable batch size and rate limiting** for SA API calls to prevent overwhelming the service.
5. **PRODA authentication is complete** -- no additional work needed. Focus engineering effort on the 4 P0 endpoints.
