---
title: "Feature Specification: Agreements & Compliance"
---

# Feature Specification: Agreements & Compliance

**Feature Branch**: `sr5-agreements-compliance`
**Created**: 2026-03-19
**Author**: Will Whitelaw
**Status**: Draft

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Supplier Signs the APA Through the Portal (Priority: P1)

A supplier who has completed registration and profile setup needs to sign the Approved Provider Agreement before they can begin delivering services. They view the agreement with their pre-populated details (legal name, ABN, address, rates), review the terms, sign digitally, and receive confirmation. This is the gateway to becoming an active supplier.

**Why this priority**: No services can be delivered and no invoices can be submitted without a signed agreement. This is the most fundamental compliance requirement and blocks all revenue activity for new suppliers.

**Independent Test**: Can be fully tested by navigating to the agreement page as a registered supplier, reviewing the pre-populated APA, signing it, and verifying the supplier status updates to agreement-signed.

**Acceptance Scenarios**:

1. **Given** a registered supplier with a completed profile, **When** they navigate to the agreements section, **Then** they see the current APA version with their organisation details pre-populated (legal name, ABN, business address, contact details, agreed rates).
2. **Given** a supplier viewing the APA, **When** they digitally sign and submit, **Then** the agreement is recorded with the signer's name, position, signature, timestamp, and agreement version, and the supplier's onboarding status advances.
3. **Given** a supplier who has already signed the current APA version, **When** they visit the agreements section, **Then** they see their signed agreement with a download option and the signing details.
4. **Given** a supplier who has signed, **When** a new APA version is published, **Then** the supplier is notified and prompted to review and re-sign the updated agreement.

---

### User Story 2 - Supplier Requests an APA Amendment (Priority: P1)

A supplier needs to request a change to their agreement --- for example, a rate adjustment, a scope change, or a special condition. They submit an amendment request through a dual-sided interface that distinguishes locked clauses (non-negotiable terms) from negotiable clauses. The request goes to TC staff for review.

**Why this priority**: Amendment requests are currently handled via email, creating version control issues, lost requests, and no audit trail. This is a frequent pain point raised in stakeholder meetings (Dec 4) and directly impacts supplier satisfaction and agreement accuracy.

**Independent Test**: Can be fully tested by logging in as a supplier, creating an amendment request on a negotiable clause, and verifying TC staff receive the request with full context.

**Acceptance Scenarios**:

1. **Given** a supplier with a signed APA, **When** they view the amendment interface, **Then** they see their agreement clauses categorised as locked (non-negotiable, visually distinct) and negotiable (editable, with amendment request option).
2. **Given** a supplier requesting an amendment on a negotiable clause, **When** they draft their proposed change, **Then** AI-assisted drafting suggests language that aligns with the agreement structure, and the supplier can edit or accept the suggestion.
3. **Given** a supplier who has submitted an amendment request, **When** TC staff review it, **Then** they see the original clause, the proposed change, the supplier's justification, and options to approve, modify, or decline.
4. **Given** TC staff approving or declining an amendment, **When** the decision is made, **Then** the supplier is notified with the outcome, the updated agreement reflects approved changes, and the amendment history is preserved.
5. **Given** a supplier attempting to modify a locked clause, **When** they view the locked clause, **Then** the interface clearly indicates it is non-negotiable and does not offer an amendment option.

---

### User Story 3 - Supplier Uploads a TPC Agreement (Priority: P1)

A supplier who provides services through a Third Party Contractor arrangement needs to upload their TPC agreement and link it to the specific consumer and care package it covers. They can also download draft TPC templates to prepare agreements before uploading.

**Why this priority**: TPC agreements are currently managed entirely offline with no digital audit trail. Linking TPCs to consumers and care packages is a compliance requirement and was identified as a medium-priority, 2-week target in the Mar 4 meeting.

**Independent Test**: Can be fully tested by downloading a draft TPC template, uploading a completed TPC agreement, linking it to a consumer/care package, and verifying it appears in the supplier's agreement list.

**Acceptance Scenarios**:

1. **Given** a supplier in the agreements section, **When** they access the TPC area, **Then** they can download draft TPC form templates (matching the existing APA draft download pattern).
2. **Given** a supplier uploading a TPC agreement, **When** they attach the document, **Then** they must select the consumer and care package the agreement relates to.
3. **Given** a supplier who has uploaded a TPC agreement, **When** TC staff review it internally, **Then** the TPC is linked to the specified consumer and care package with an approval status tracked internally.
4. **Given** a supplier viewing their uploaded TPCs, **When** they access the TPC list, **Then** they see each TPC with its linked consumer, care package, upload date, and current status.

---

### User Story 4 - Supplier Entity Self-Terminates Their Engagement (Priority: P2)

A supplier entity needs to end or pause their engagement with Trilogy Care. Termination is scoped to a single supplier entity — sibling entities under the same ABN are unaffected. The supplier initiates self-termination through a guided flow that assesses their reason against 15 predefined criteria. The system classifies the termination into a risk tier and routes it accordingly --- low-risk terminations are processed immediately, conditional terminations require QA review, and high-risk cases must contact compliance directly.

**Why this priority**: Self-termination was targeting Mar 2 release (Feb 25 meeting) and has 15 criteria already defined. Automating low-risk terminations frees the compliance team from routine processing while ensuring high-risk cases still receive appropriate oversight.

**Independent Test**: Can be fully tested by selecting a low-risk termination reason and verifying the account is immediately deactivated with reactivation available, then selecting a conditional reason and verifying the QA team receives a review request.

**Acceptance Scenarios**:

1. **Given** a supplier initiating self-termination, **When** they select their reason from the 15 predefined criteria, **Then** the system classifies the termination as low-risk, conditional, or high-risk and displays the appropriate next steps.
2. **Given** a low-risk termination reason, **When** the supplier confirms, **Then** the account is deactivated immediately, and the supplier is informed they can reactivate if their documents remain valid.
3. **Given** a conditional termination reason, **When** the supplier confirms, **Then** the termination is queued for QA review, an automated email is sent to the QA/compliance team with context, and the supplier is notified that review is in progress.
4. **Given** a high-risk termination reason, **When** the supplier selects it, **Then** the portal displays a message directing them to contact compliance directly and does not allow self-service termination.
5. **Given** a terminated supplier entity returning within 12 months with all required documents current and approved, **When** they request reactivation, **Then** low-risk terminations are reactivated immediately, and conditional terminations require a fresh QA review. After 12 months, the supplier must go through SR1 re-onboarding.

---

### User Story 5 - Compliance Team Reviews Supplier Against Government Registers (Priority: P2)

The compliance team needs to verify that suppliers are not suspended, banned, or flagged on government registers. The system automatically checks AHPRA, NDIS banning orders, aged care banning orders, and AFRA data, and surfaces results on the supplier profile. Flagged suppliers have their payments automatically blocked until the issue is resolved.

**Why this priority**: Currently compliance monitoring is entirely manual and reactive. A banned supplier could continue submitting invoices for days or weeks before someone notices. This was raised as a priority in the Feb 25 and Mar 4 meetings.

**Independent Test**: Can be fully tested by triggering a compliance check for a supplier and verifying the results display on their profile, and that a flagged result triggers a payment block and supplier notification.

**Acceptance Scenarios**:

1. **Given** a supplier profile, **When** a compliance check is triggered (automatically on schedule or manually by staff), **Then** the system queries the relevant registers: AHPRA checks run against individual workers (practitioner registration numbers), while NDIS banning order, aged care banning order, and AFRA checks run against both the supplier entity and key personnel (directors/owners). Results are displayed on the supplier profile.
2. **Given** a supplier flagged on any government register, **When** the check result is received, **Then** a payment block is automatically applied to the supplier, and a notification is sent to the supplier explaining the suspension and payment hold.
3. **Given** a supplier with a payment block due to a register flag, **When** the issue is resolved and the supplier is cleared on a subsequent check, **Then** the payment block is lifted and the supplier is notified.
4. **Given** a compliance team member, **When** they view the compliance dashboard, **Then** they see all suppliers with current flags, pending checks, and check history with timestamps.

---

### User Story 6 - Supplier Profile Shows EFTSure Fraud Indicators (Priority: P2)

Staff reviewing a supplier profile or processing a bank detail change can see the supplier's EFTSure fraud risk indicator (green, yellow, or red). Yellow and red indicators trigger additional review steps before bank details are accepted or payments are processed.

**Why this priority**: The fraud task force ("Operation Onion Slot", Jan 21 meeting) identified EFTSure integration as key to preventing supplier fraud. Bank detail changes are a common fraud vector. This provides the tooling the fraud team needs within the portal rather than requiring separate system cross-referencing.

**Independent Test**: Can be fully tested by viewing a supplier profile with EFTSure data and verifying the correct colour indicator displays, and that a red indicator blocks bank detail changes without compliance approval.

**Acceptance Scenarios**:

1. **Given** a supplier profile, **When** a staff member views it, **Then** the EFTSure fraud risk indicator is displayed (green/yellow/red) with a last-checked timestamp.
2. **Given** a supplier with a yellow EFTSure indicator, **When** a bank detail change is submitted, **Then** the change is flagged for additional review before approval and the fraud team is notified.
3. **Given** a supplier with a red EFTSure indicator, **When** a bank detail change is submitted or a payment is queued, **Then** the change/payment is blocked and requires explicit compliance team approval.
4. **Given** a supplier whose EFTSure status changes, **When** the updated indicator is received, **Then** the profile is updated and an alert is generated if the status has worsened.

---

### User Story 7 - Supplier Receives Compliance Notifications (Priority: P2)

A supplier receives automated notifications for agreement-related events: expiring documents (insurance, certifications), agreement renewal reminders, approval/denial decisions, and compliance-related actions. Operational notifications cannot be disabled by the supplier.

**Why this priority**: Inconsistent notifications are a major cause of lapsed compliance documents. Suppliers missing renewal deadlines creates operational overhead for the compliance team. This was discussed in both Dec 4 and Mar 4 meetings.

**Independent Test**: Can be fully tested by setting a document to expire within the notification window and verifying the supplier receives the reminder email, and that the notification cannot be disabled in preferences.

**Acceptance Scenarios**:

1. **Given** a supplier with an insurance certificate expiring in 30 days, **When** the expiry threshold is reached, **Then** the supplier receives an email notification with the document name, expiry date, and instructions to upload a renewal.
2. **Given** a supplier whose APA is approaching renewal, **When** the renewal window opens, **Then** the supplier receives a notification prompting them to review and re-sign.
3. **Given** a supplier viewing notification preferences, **When** they see operational notifications (agreement, compliance, payment), **Then** these are marked as mandatory and cannot be disabled.
4. **Given** TC staff approving or denying a supplier action (amendment, TPC, reactivation), **When** the decision is made, **Then** the supplier receives an email with the outcome, reason (if denied), and next steps.
5. **Given** a supplier whose payment has been blocked due to a compliance flag, **When** the block is applied, **Then** the supplier receives a notification explaining the reason and what action is required to resolve it.

---

### User Story 8 - Compliance Team Manages the Credentialing Matrix (Priority: P3)

The compliance team configures which documents and credentials are required for different supplier types and service categories. The credentialing matrix drives automated reminders, onboarding checklists, and compliance status calculations. Changes to the matrix take effect for all affected suppliers.

**Why this priority**: The credentialing matrix is currently under review (Feb 25, Mar 4 meetings) and needs to be stable before it can be encoded in the system. This is a configuration story that enables other compliance features but can ship after the core agreement and termination workflows.

**Independent Test**: Can be fully tested by configuring a new credential requirement for a supplier type and verifying that existing suppliers of that type see the new requirement in their compliance checklist.

**Acceptance Scenarios**:

1. **Given** a compliance team member, **When** they access the credentialing matrix configuration, **Then** they can define required documents per supplier type and service category (e.g., AHPRA registration required for allied health suppliers).
2. **Given** a new credential requirement added to the matrix, **When** it takes effect, **Then** all suppliers matching the criteria see the new requirement in their compliance checklist with a deadline to provide it.
3. **Given** a supplier missing a required credential, **When** the compliance status is calculated, **Then** the supplier's compliance percentage reflects the missing item, and automated reminders are triggered.
4. **Given** a compliance team member removing a credential requirement, **When** the change takes effect, **Then** suppliers who previously had that requirement are no longer flagged for it.

---

### Edge Cases

- What happens when a supplier has an active amendment request and their APA expires? The amendment request should be preserved but paused until the supplier re-signs the new APA version, at which point the amendment request can be re-evaluated against the new terms.
- What happens when a supplier is flagged on a government register mid-termination? The termination proceeds, but the flag is recorded against the supplier record for future reference if they attempt reactivation.
- What happens when EFTSure data is unavailable or the API is down? The system should display a "check pending" indicator rather than defaulting to green. Staff should be able to manually override the indicator with an audit trail.
- How does the system handle a supplier who self-terminates and then is found on a banning order register? The banning order flag is applied regardless of termination status and prevents reactivation until cleared.
- What happens when a TPC agreement is uploaded for a consumer who is discharged? The TPC remains on record for audit purposes but is marked as inactive, linked to the historical care package.
- What happens when locked and negotiable clause classifications change after a supplier has an active amendment? Existing amendment requests are grandfathered under the clause classification at the time of submission. New requests use the updated classification.
- What happens when multiple government registers return conflicting results (e.g., cleared on AHPRA but flagged on NDIS)? The most restrictive result applies --- any single flag triggers the payment block. All results are displayed for the compliance team to assess.
- What happens when a supplier's documents expire while a conditional termination review is in progress? The document expiry is recorded separately. If the termination is not approved, the supplier receives the expiry notification upon reactivation.
- What happens when the last active supplier entity under an organisation is terminated? The organisation record persists (it is never deleted) but has no active entities. If the Org Admin later reactivates that entity or creates a new one, the organisation resumes. Org-level documents remain intact.
- What happens when a terminated supplier entity requests reactivation after the 12-month window? The self-service reactivation path is unavailable. The supplier must go through the SR1 re-onboarding flow as if they were a new supplier entity. Their historical agreement and compliance records are preserved for audit.
- What happens to active TPC agreements when the parent APA is superseded by a new version? TPCs remain valid — they are linked to the consumer and care package, not to a specific APA version. New TPCs are created under the current APA version. If a TPC needs updating due to APA term changes, TC staff flag it manually through the existing TPC review workflow.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow suppliers to view and digitally sign the current APA version with pre-populated organisation details (legal name, ABN, address, rates) and digital signature capture.
- **FR-002**: System MUST store signed agreements with signer identity, position, signature, timestamp, agreement version, and authenticated user reference.
- **FR-003**: System MUST categorise APA clauses as locked (non-negotiable) or negotiable, with the categorisation configurable by compliance staff.
- **FR-004**: System MUST provide a dual-sided amendment interface where suppliers submit proposed changes to negotiable clauses and TC staff can approve, modify, or decline.
- **FR-005**: System MUST provide AI-assisted drafting suggestions when suppliers compose amendment requests, generating language aligned with agreement structure.
- **FR-006**: System MUST maintain a complete amendment history for each agreement showing original clause, proposed change, decision, and decision-maker.
- **FR-007**: System MUST support TPC agreement upload with mandatory linkage to a specific consumer and care package.
- **FR-008**: System MUST provide downloadable draft TPC form templates.
- **FR-009**: System MUST support per-supplier-entity self-termination with a guided flow that classifies reasons against 15 predefined criteria into three risk tiers: low-risk, conditional, and high-risk. Termination of one supplier entity does not affect sibling entities under the same ABN.
- **FR-010**: System MUST process low-risk terminations immediately with automatic reactivation available within a 12-month window if all required documents (per credentialing matrix) are current and approved by TC. After 12 months, the supplier entity must go through SR1 re-onboarding. "Documents valid" means uploaded, approved, and not expired.
- **FR-011**: System MUST route conditional terminations to the QA/compliance team with automated email notification and block processing until review is complete.
- **FR-012**: System MUST block self-service termination for high-risk reasons and direct the supplier to contact compliance directly.
- **FR-013**: System MUST integrate with government registers using appropriate check granularity: AHPRA checks run against individual workers (practitioner registration numbers); NDIS banning order, aged care banning order, and AFRA checks run against both the supplier entity and key personnel (directors/owners). Checks run on an automated schedule and on manual trigger.
- **FR-014**: System MUST automatically apply a payment block to any supplier flagged on a government register and notify the supplier with the reason and required resolution steps.
- **FR-015**: System MUST display EFTSure fraud risk indicators (green/yellow/red) on supplier profiles with a last-checked timestamp.
- **FR-016**: System MUST flag bank detail changes from suppliers with yellow EFTSure indicators for additional review and block changes from suppliers with red indicators until compliance approves.
- **FR-017**: System MUST send automated expiry notifications for insurance, certifications, agreements, and credentials at configurable thresholds (e.g., 30 days, 14 days, 7 days before expiry).
- **FR-018**: System MUST send approval/denial notifications for all supplier actions (amendments, TPC uploads, reactivation requests) with the outcome, reason, and next steps.
- **FR-019**: System MUST classify notifications as operational (mandatory, not disableable) or optional, and enforce that suppliers cannot disable operational notifications.
- **FR-020**: System MUST support a configurable credentialing matrix that defines required documents per supplier type and service category, driving compliance status calculations and automated reminders.

### Key Entities

- **Agreement**: A signed contract between a supplier and Trilogy Care. Has a version, signing details, status (draft, active, expired, superseded), and amendment history. The current type is APA (Approved Provider Agreement) with TPC (Third Party Contractor) as a second type. Linked to a supplier entity.
- **Agreement Clause**: An individual section within an agreement. Classified as locked (non-negotiable) or negotiable. Negotiable clauses can be the subject of amendment requests.
- **Amendment Request**: A supplier-initiated proposal to change a negotiable clause. Contains the original text, proposed text, justification, AI-assisted draft (if used), and a review decision (approved, modified, declined) with decision-maker and timestamp.
- **TPC Agreement**: A Third Party Contractor agreement uploaded by a supplier. Linked to a specific consumer and care package — not to a specific APA version. TPCs remain valid across APA version changes. Has an upload date, approval status, and document attachment.
- **Termination Request**: A supplier-initiated request to end or pause their engagement. Classified by reason (one of 15 criteria) into a risk tier (low, conditional, high). Tracks status, review outcome (for conditional), and reactivation eligibility.
- **Compliance Check**: A record of a government register query. Stores the register checked (AHPRA, NDIS, aged care, AFRA), the subject type (supplier entity or individual worker), the subject identifier, result (clear/flagged), check timestamp, and any resulting actions (payment block applied/lifted).
- **EFTSure Indicator**: A fraud risk assessment for a supplier's bank details. Stores the colour indicator (green/yellow/red), last-checked timestamp, and any manual overrides with audit trail.
- **Credentialing Requirement**: A rule in the credentialing matrix specifying which documents/credentials are required for a supplier type and service category. Drives compliance status and automated reminders.
- **Compliance Notification**: An automated message sent to a supplier regarding agreement, document, or compliance events. Classified as operational (mandatory) or optional.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Suppliers can sign an APA digitally through the portal in under 5 minutes from viewing to signed confirmation.
- **SC-002**: APA amendment requests submitted through the portal include a complete audit trail (original clause, proposed change, justification, decision, decision-maker) for 100% of amendments.
- **SC-003**: TPC agreements uploaded through the portal are linked to a specific consumer and care package in 100% of cases --- no unlinked TPCs.
- **SC-004**: Low-risk self-terminations are processed within 30 seconds of supplier confirmation with zero compliance team involvement.
- **SC-005**: Conditional self-terminations generate an automated email to the QA/compliance team within 1 minute of submission.
- **SC-006**: Government register checks run on a configurable schedule (at minimum weekly) and on-demand, with results surfaced on the supplier profile within 5 minutes of check completion.
- **SC-007**: 100% of suppliers flagged on a government register have a payment block applied automatically --- zero gap between flag detection and payment block.
- **SC-008**: EFTSure fraud indicators are visible on every supplier profile where data is available, with the last-checked timestamp no older than the configured refresh interval.
- **SC-009**: Document expiry notifications are sent at all configured thresholds (e.g., 30, 14, 7 days) with zero missed notifications for valid supplier email addresses.
- **SC-010**: Operational notifications cannot be disabled by suppliers --- 100% enforcement of mandatory notification delivery for agreement, compliance, and payment events.

---

## Clarifications

The following questions were identified during spec review against taxonomy categories (Functional Scope, Domain & Data Model, UX Flow, Non-Functional, Integration, Edge Cases, Constraints). Each was resolved with the recommended option and applied to the spec.

### Q1 — Domain & Data Model: Agreement ownership in the two-tier org/supplier model

**Gap**: The spec says agreements are "linked to a supplier entity" but does not clarify how this interacts with the Organisation tier. Specifically: who signs the APA — the Organisation Administrator on behalf of all supplier entities, or each Supplier Administrator independently? And how do org-level compliance documents (public liability, workers comp from SR2 FR-010) relate to agreement compliance status?

**Options**:
- (a) APA is signed once at the organisation level and covers all supplier entities under that ABN.
- (b) **APA is signed per supplier entity.** Each supplier entity has its own APA with its own signing details, rates, and amendment history. Org-level documents remain separate (managed in SR2) and are not duplicated into the agreement model — agreement compliance status considers only agreement-specific items (APA signed, not expired, no active blocks). Org-level document compliance rolls up separately through the SR2 compliance status.
- (c) Hybrid — a master APA at the org level with per-supplier schedules for rates and special conditions.

**Decision**: **(b) — per supplier entity.** This is consistent with the SR1 spec (FR-015: subcontractor status is per supplier entity, not per org) and avoids coupling agreement lifecycle to the org tier. Org-level documents already have their own management in SR2. No spec change needed — the existing language is correct but is now explicitly confirmed.

### Q2 — Functional Scope: Self-termination scope — supplier entity vs organisation

**Gap**: Story 4 says "a supplier needs to end or pause their engagement" but does not specify whether termination applies to a single supplier entity, or whether an Org Admin can terminate the entire organisation (all supplier entities at once). The 15 criteria and risk tiers may apply differently at each level.

**Options**:
- (a) Termination applies only at the organisation level — all supplier entities terminate together.
- (b) **Termination is per supplier entity.** A supplier entity can be independently terminated without affecting sibling entities under the same ABN. If an Org Admin wants to terminate all entities, they do so one by one. The organisation itself is not terminated — it persists as long as at least one supplier entity is active.
- (c) Both — entity-level termination plus an org-level "terminate all" shortcut.

**Decision**: **(b) — per supplier entity.** Matches the two-tier model where each supplier entity is independently managed. Adding an org-level bulk action is scope creep and can be added later if needed.

**Spec changes applied**:
- Story 4 updated to clarify "supplier entity" scope.
- FR-009 updated to specify per-supplier-entity termination.
- Edge case added for last-entity termination.

### Q3 — Integration: Government register checks — per worker or per supplier entity?

**Gap**: Story 5 mentions checking AHPRA, NDIS banning orders, etc., but AHPRA is a practitioner-level register (individual health professionals), while banning orders apply to individuals or organisations. The spec does not clarify whether checks run against the supplier entity (ABN-level), individual workers, or both.

**Options**:
- (a) All checks run against the supplier entity (ABN) only.
- (b) **AHPRA checks run against individual workers (practitioners); banning order and AFRA checks run against both the supplier entity and key personnel (directors/owners).** This reflects how the registers actually work — AHPRA has no ABN lookup, only practitioner registration numbers.
- (c) All checks run against every individual worker — comprehensive but operationally expensive for large suppliers.

**Decision**: **(b) — split by register type.** AHPRA is inherently practitioner-level. Banning orders cover both individuals and organisations. This avoids false negatives (checking an ABN against a practitioner register) without the overhead of checking every worker against every register.

**Spec changes applied**:
- FR-013 updated to specify check granularity per register type.
- Compliance Check entity updated to include a `subject_type` (supplier entity or worker).
- Story 5 AC1 updated to reflect the split.

### Q4 — UX Flow: Reactivation window and document validity for self-termination

**Gap**: Story 4 AC5 says "low-risk terminations are reactivated immediately... if their documents remain valid" but does not define the reactivation window. How long can a terminated supplier reactivate without going through full re-onboarding? And what "documents remaining valid" means — just not expired, or still approved?

**Options**:
- (a) No time limit — reactivation is always available if documents are valid.
- (b) **12-month reactivation window.** Within 12 months, if all required documents (per credentialing matrix) are current and approved, the supplier entity can reactivate through self-service (low-risk) or QA review (conditional). After 12 months, the supplier must go through SR1 re-onboarding. "Documents valid" means uploaded, approved by TC, and not expired.
- (c) 6-month window with a mandatory compliance review regardless of document status.

**Decision**: **(b) — 12-month window.** Balances operational simplicity with compliance rigour. 12 months aligns with typical insurance and certification renewal cycles.

**Spec changes applied**:
- FR-010 updated to include the 12-month reactivation window and document validity definition.
- Story 4 AC5 updated with the window and re-onboarding fallback.
- Edge case added for expired reactivation window.

### Q5 — Edge Cases: APA version transition for suppliers with active TPCs and amendments

**Gap**: The spec handles APA expiry with active amendments (edge case 1) but does not address what happens to active TPC agreements when the parent APA is superseded by a new version. TPCs reference specific APA terms — if the APA changes, are existing TPCs still valid?

**Options**:
- (a) TPCs are invalidated when the APA is superseded — suppliers must re-upload against the new APA.
- (b) **TPCs remain valid through APA version changes.** TPCs are linked to the consumer and care package, not to a specific APA version. When the APA is superseded, existing TPCs continue under their original terms. New TPCs are created under the current APA version. If a TPC needs updating due to APA changes, TC staff flag it manually through the existing TPC review workflow.
- (c) TPCs automatically inherit the new APA terms and suppliers are notified to review.

**Decision**: **(b) — TPCs persist independently.** TPCs are consumer-specific operational agreements. Mass-invalidating them on an APA version bump would create chaos for active service delivery. The manual flag approach uses the existing review workflow without new automation.

**Spec changes applied**:
- Edge case added for TPC validity across APA versions.
- TPC Agreement entity updated to note version independence from the parent APA.
