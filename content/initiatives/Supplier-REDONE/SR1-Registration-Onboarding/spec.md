---
title: "Feature Specification: Supplier Registration & Onboarding"
---

# Feature Specification: Supplier Registration & Onboarding

**Feature Branch**: `sr1-registration-onboarding`
**Created**: 2026-03-19
**Status**: Draft

---

## User Scenarios & Testing

### User Story 1 -- Supplier Registers a New Organisation (Priority: P1)

A supplier visits the registration page and enters their ABN. The system validates the ABN against the Australian Business Register, presents matching business names, and creates an Organisation with the first Supplier entity underneath. The user becomes the Organisation Administrator. This is the primary entry point for all new suppliers.

**Why this priority**: Without registration, no supplier can enter the system. This replaces the existing flat registration flow with the two-tier model from SR0.

**Independent Test**: Register with a valid ABN, verify Organisation + Supplier + User are created, and confirm the user lands on the onboarding dashboard with Organisation Administrator permissions.

**Acceptance Scenarios**:

1. **Given** a new supplier with a valid ABN, **When** they complete the registration form (ABN, business name, contact details, password), **Then** an Organisation is created with that ABN, a Supplier entity is created underneath, a `SupplierOnboarding` record is initialised, and the user is assigned the Organisation Administrator role.
2. **Given** a supplier entering an ABN, **When** the ABN lookup returns multiple trading names, **Then** the supplier can select the correct business name from a dropdown before proceeding.
3. **Given** a supplier entering an ABN that already exists in the system, **When** the system detects the duplicate, **Then** the supplier is informed that the organisation already exists and is offered the option to request access from the existing Organisation Administrator.
4. **Given** a supplier on a mobile device, **When** they complete registration, **Then** the flow works identically to desktop with no session dependency (token-based auth from SR0).
5. **Given** a supplier who submits the registration form, **When** reCAPTCHA validation fails, **Then** the form is not submitted and the supplier sees a clear error message.

---

### User Story 2 -- Organisation Administrator Adds a Supplier Entity (Priority: P1)

An Organisation Administrator who already has one or more supplier entities wants to add another -- for a different trading name, service line, or location. They do this from the organisation dashboard without re-registering. The new supplier entity starts its own onboarding journey.

**Why this priority**: This is the core value of the two-tier model. Currently, adding a second supplier under the same ABN requires staff intervention.

**Independent Test**: Log in as Organisation Administrator, add a new supplier entity, verify it appears on the dashboard with its own onboarding status set to NOT_ONBOARDED.

**Acceptance Scenarios**:

1. **Given** an Organisation Administrator, **When** they choose "Add Supplier" from the organisation dashboard, **Then** they can enter a trading name and basic details, and a new Supplier entity is created under the same Organisation with a fresh `SupplierOnboarding` record.
2. **Given** a new supplier entity is created, **When** the Organisation Administrator views the dashboard, **Then** both supplier entities are listed with independent onboarding progress, compliance status, and portal stage.
3. **Given** a new supplier entity, **When** it is created, **Then** its portal stage is set to NOT_ONBOARDED and all onboarding step timestamps are null.

---

### User Story 3 -- Supplier Completes Business Details Step (Priority: P1)

A supplier begins onboarding by completing the Business Details step. This captures the supplier's legal information, contact details, and business classification. It is the first onboarding step and must be completed before any other step.

**Why this priority**: Business details are required for compliance verification and are a prerequisite for all subsequent onboarding steps.

**Independent Test**: Log in as a supplier in NOT_ONBOARDED stage, complete the Business Details form, verify `business_completed_at` is set and the progress indicator advances.

**Acceptance Scenarios**:

1. **Given** a supplier at the NOT_ONBOARDED stage, **When** they access onboarding, **Then** they see a progress indicator showing all steps with Business Details as the first active step.
2. **Given** a supplier on the Business Details step, **When** they submit valid business information (legal name, trading name, business type, contact details), **Then** `business_completed_at` is recorded and the next step (Locations) becomes active.
3. **Given** a supplier on a mobile device, **When** they complete Business Details, **Then** the form validates and saves without the mobile verification failures reported on iPhone.
4. **Given** a supplier who partially fills the Business Details form, **When** they navigate away and return, **Then** their progress is preserved (draft state).

---

### User Story 4 -- Supplier Completes Locations Step (Priority: P1)

A supplier adds one or more service locations where they operate. Each location captures address, service area, and availability. Locations are required for service matching with recipients.

**Why this priority**: Locations determine where a supplier can provide services and are needed for pricing and recipient matching.

**Independent Test**: Complete Business Details, then add at least one location, verify `location_completed_at` is set.

**Acceptance Scenarios**:

1. **Given** a supplier who has completed Business Details, **When** they access the Locations step, **Then** they can add one or more service locations with address, service area radius, and contact details.
2. **Given** a supplier adding a location, **When** they enter an address, **Then** the system validates and geocodes the address.
3. **Given** a supplier with at least one location saved, **When** they mark the Locations step as complete, **Then** `location_completed_at` is recorded and Pricing becomes active.

---

### User Story 5 -- Supplier Completes Pricing Step (Priority: P1)

A supplier sets their pricing for services at each location. Pricing must align with Trilogy Care's approved rate structure.

**Why this priority**: Pricing is required before a supplier can be matched to recipients and generate invoices.

**Independent Test**: Complete Locations, then set pricing for at least one service, verify `pricing_completed_at` is set.

**Acceptance Scenarios**:

1. **Given** a supplier who has completed Locations, **When** they access the Pricing step, **Then** they see the services they can provide and can set rates within Trilogy Care's approved range.
2. **Given** a supplier submitting pricing, **When** a rate exceeds the approved range, **Then** the system warns the supplier and requires confirmation or adjustment.
3. **Given** a supplier with valid pricing saved, **When** they mark the Pricing step as complete, **Then** `pricing_completed_at` is recorded and Documents becomes active.

---

### User Story 6 -- Supplier Uploads Required Documents (Priority: P1)

A supplier uploads compliance documents (insurance certificates, qualifications, ABN verification, etc.). The document requirements vary by supplier type and service category.

**Why this priority**: Documents are the primary compliance gate. Without them, a supplier cannot be verified.

**Independent Test**: Complete Pricing, upload all required documents for the supplier's type, verify `documents_completed_at` is set.

**Acceptance Scenarios**:

1. **Given** a supplier who has completed Pricing, **When** they access the Documents step, **Then** they see a checklist of required documents specific to their supplier type and services.
2. **Given** a supplier uploading a document, **When** the file is valid (PDF, JPG, PNG, under 10MB), **Then** the document is stored and marked as uploaded in the checklist.
3. **Given** a supplier who has uploaded all required documents, **When** they mark the Documents step as complete, **Then** `documents_completed_at` is recorded and Agreements becomes active.
4. **Given** a supplier whose documents have been rejected by Compliance, **When** they return to onboarding, **Then** they see which specific documents were rejected with the reason, and the Documents step is re-opened.

---

### User Story 7 -- Supplier Signs Agreements (Priority: P1)

A supplier reviews and signs the required agreements. For standard suppliers, this is the Trilogy Care Supplier Agreement. For subcontractors, this also includes the APA (Approved Provider Agreement).

**Why this priority**: Signed agreements are a legal requirement before a supplier can deliver services.

**Independent Test**: Complete Documents, review and sign the required agreement(s), verify `agreement_signed_at` is set.

**Acceptance Scenarios**:

1. **Given** a supplier who has completed Documents, **When** they access the Agreements step, **Then** they see the applicable agreement(s) for their supplier type.
2. **Given** a subcontractor supplier, **When** they access Agreements, **Then** they must sign both the Supplier Agreement and the APA.
3. **Given** a supplier who signs all required agreements, **When** the signing is confirmed, **Then** `agreement_signed_at` is recorded and the supplier enters the verification queue.
4. **Given** a supplier viewing an agreement, **When** they read the document, **Then** they can scroll through the full text before the "Sign" button becomes active (informed consent).

---

### User Story 8 -- Lite Verification Flow (Priority: P1)

After completing all onboarding steps, a supplier enters the verification queue. The lite flow is for straightforward cases where documents are standard, bank details verify quickly via EFTSure, and no manual review is needed. The supplier's portal stage transitions from ONBOARDING to PENDING_VERIFICATION to VERIFIED.

**Why this priority**: Most suppliers should complete verification quickly. A streamlined path reduces time-to-activation.

**Independent Test**: Complete all onboarding steps for a supplier with standard documents; trigger EFTSure verification; verify portal stage transitions to VERIFIED.

**Acceptance Scenarios**:

1. **Given** a supplier who has completed all onboarding steps, **When** their documents pass automated checks and EFTSure bank verification returns green, **Then** the supplier's portal stage transitions to VERIFIED.
2. **Given** a supplier in PENDING_VERIFICATION, **When** they view their dashboard, **Then** they see a clear status indicating verification is in progress with expected timeline.
3. **Given** EFTSure returns green for bank details, **When** the verification check completes, **Then** the bank details indicator shows green and this step is marked complete.

---

### User Story 9 -- Heavy Verification Flow (Priority: P2)

Some suppliers require manual compliance review -- multiple document pathways, flagged bank details, or special service categories. The heavy flow involves Compliance team review with potential back-and-forth.

**Why this priority**: Important for completeness but affects fewer suppliers than the lite path. Can ship after the lite flow is live.

**Independent Test**: Complete onboarding for a supplier requiring manual review; verify Compliance can review, request changes, and approve/reject.

**Acceptance Scenarios**:

1. **Given** a supplier whose documents require manual review, **When** they complete onboarding, **Then** their portal stage is set to PENDING_VERIFICATION and the Compliance team is notified.
2. **Given** a Compliance reviewer examining a supplier, **When** they identify an issue with a document, **Then** they can reject the specific document with a reason, and the supplier is notified with clear instructions on what to fix.
3. **Given** a supplier whose compliance review is rejected, **When** they return to onboarding, **Then** their portal stage reverts to ONBOARDING, the specific step with the issue is highlighted, and they can correct and resubmit.
4. **Given** a Compliance reviewer, **When** they approve all documents and checks, **Then** the supplier's portal stage transitions to VERIFIED.

---

### User Story 10 -- EFTSure Bank Verification (Priority: P2)

Bank details submitted during onboarding are verified through EFTSure's 3-stage process. The supplier dashboard shows green/yellow/red indicators reflecting the current verification stage. A refusal stage handles cases where EFTSure cannot verify the details.

**Why this priority**: Bank verification is critical for payment integrity but the 3-stage flow can be introduced after basic onboarding is live.

**Independent Test**: Submit bank details, trigger EFTSure verification, observe indicator transitions through stages.

**Acceptance Scenarios**:

1. **Given** a supplier who submits bank details, **When** EFTSure begins verification, **Then** the bank details indicator shows yellow (pending).
2. **Given** EFTSure completes stage 1 verification, **When** the result is positive, **Then** the indicator progresses and the supplier sees updated status.
3. **Given** EFTSure completes all 3 stages successfully, **When** the final result is positive, **Then** the indicator shows green and bank verification is marked complete.
4. **Given** EFTSure returns a refusal, **When** the supplier views their dashboard, **Then** the indicator shows red with a clear explanation of what to do next (update bank details or contact support).
5. **Given** a supplier with red bank verification, **When** they update their bank details, **Then** a new EFTSure verification is triggered and the indicator resets to yellow.

---

### User Story 11 -- Onboarding Progress Indicator (Priority: P2)

Suppliers see a clear, always-visible progress indicator during onboarding showing which steps are complete, which is current, and which are upcoming. The indicator works on both desktop and mobile.

**Why this priority**: The current lack of progress visibility contributes to the ~8,000 incomplete onboardings. Vishal has a redesign in the backlog.

**Independent Test**: Start onboarding, complete each step sequentially, verify the progress indicator updates at each transition.

**Acceptance Scenarios**:

1. **Given** a supplier at any onboarding step, **When** they view the onboarding page, **Then** they see a progress indicator showing: completed steps (with checkmark), current step (highlighted), and upcoming steps (greyed out).
2. **Given** a supplier on mobile, **When** they view the progress indicator, **Then** it renders correctly without horizontal overflow or truncation.
3. **Given** a supplier whose Compliance review was rejected, **When** they return to onboarding, **Then** the progress indicator shows the rejected step with a warning icon and the reason is accessible.

---

### User Story 12 -- Invitation-Based Registration (Priority: P3)

An existing Organisation Administrator can invite a new user to join their organisation. The invited user receives an email with a registration link that pre-fills the organisation details. This supports scenarios where a supplier's operations manager invites their team.

**Why this priority**: Nice-to-have for launch; the Organisation Administrator can initially manage all supplier entities themselves.

**Independent Test**: Send an invitation, follow the link, complete registration, verify the user is added to the existing organisation.

**Acceptance Scenarios**:

1. **Given** an Organisation Administrator, **When** they invite a new user by email, **Then** the invitee receives an email with a registration link containing an invitation token.
2. **Given** an invitee following the registration link, **When** they complete the form, **Then** their account is created under the existing Organisation with the ABN and business name pre-filled and read-only.
3. **Given** an invitation token, **When** it is used after expiry (configurable, default 7 days), **Then** the registration fails with a clear message to request a new invitation.

---

## Requirements

### Functional Requirements

#### Registration

| ID | Requirement | Priority | Stories |
|---|---|---|---|
| FR-001 | The system shall validate ABN against the Australian Business Register API and return matching business names | P1 | 1 |
| FR-002 | The system shall create an Organisation, Business, and first Supplier entity from a valid ABN registration | P1 | 1 |
| FR-003 | The system shall assign the registering user the Organisation Administrator role | P1 | 1 |
| FR-004 | The system shall detect existing ABNs and offer access-request flow instead of duplicate creation | P1 | 1 |
| FR-005 | The system shall support Tier 2 supplier entity creation by Organisation Administrators | P1 | 2 |
| FR-006 | Each new supplier entity shall have an independent `SupplierOnboarding` record with all step timestamps set to null | P1 | 2 |
| FR-007 | Registration shall work via token-based auth (no session dependency) for mobile support | P1 | 1, 2 |
| FR-008 | The system shall support invitation-based registration with pre-filled organisation details and token expiry | P3 | 12 |

#### Onboarding Steps

| ID | Requirement | Priority | Stories |
|---|---|---|---|
| FR-010 | Onboarding shall follow a sequential step flow for initial completion: Business Details → Locations → Pricing → Documents → Agreements. A step cannot be started until the previous step is complete (real data dependencies — e.g., pricing depends on locations). After initial completion, all steps are freely editable. | P1 | 3-7 |
| FR-011 | Each step completion shall record a timestamp on the `SupplierOnboarding` model (`business_completed_at`, `location_completed_at`, `pricing_completed_at`, `documents_completed_at`, `agreement_signed_at`) | P1 | 3-7 |
| FR-012 | The system shall preserve partial form progress (draft state) when a supplier navigates away | P1 | 3 |
| FR-013 | The system shall display a progress indicator showing completed, current, and upcoming steps | P2 | 11 |
| FR-014 | All onboarding steps shall work on mobile devices without session dependency | P1 | 3-7 |
| FR-015 | Subcontractor suppliers shall be required to sign the APA in addition to the standard Supplier Agreement. Subcontractor status is self-declared at the supplier entity level during the Business Details step when the supplier selects their service delivery model (Direct Provider, Subcontractor, or Both). This is per supplier entity, not per organisation — one org may have a direct provider entity and a subcontractor entity. | P1 | 7 |
| FR-016 | Document requirements shall vary by supplier type and service category | P1 | 6 |
| FR-017 | Organisation-level documents (public liability insurance, ABN verification, workers compensation) shall be uploaded once at the organisation level and shared across all supplier entities. Service-specific documents, pricing, locations, and agreements remain independent per supplier entity. | P1 | 6 |
| FR-018 | When a second supplier entity is added, the organisation-level documents from the first entity's onboarding are automatically available — the new entity's Documents step only requires service-specific documents. | P1 | 2, 6 |

#### Verification

| ID | Requirement | Priority | Stories |
|---|---|---|---|
| FR-020 | The system shall support a lite verification flow (automated document checks + EFTSure green = auto-verify) | P1 | 8 |
| FR-021 | The system shall support a heavy verification flow (Compliance manual review with document-level rejection and resubmission) | P2 | 9 |
| FR-022 | The system shall integrate with EFTSure for 3-stage bank verification with green/yellow/red indicators | P2 | 10 |
| FR-023 | EFTSure refusal shall show red indicator with actionable guidance for the supplier | P2 | 10 |
| FR-024 | Compliance rejection shall revert portal stage to ONBOARDING and highlight the specific step requiring correction | P2 | 9 |
| FR-025 | The system shall transition portal stages: NOT_ONBOARDED -> ONBOARDING -> PENDING_VERIFICATION -> VERIFIED (or MISSING_DOCS / back to ONBOARDING on rejection) | P1 | 8, 9 |
| FR-026 | During PENDING_VERIFICATION, the supplier can see the full dashboard in read-only preview mode — they can explore their profile, locations, pricing, and documents but cannot submit bills, get matched with recipients, or perform transactional actions. Full access unlocks only at VERIFIED status. | P1 | 8 |

#### Portal Stage Transitions

| ID | Requirement | Priority | Stories |
|---|---|---|---|
| FR-030 | New supplier entities shall start at portal stage NOT_ONBOARDED | P1 | 2 |
| FR-031 | Completing the first onboarding step shall transition portal stage to ONBOARDING | P1 | 3 |
| FR-032 | Completing all onboarding steps shall transition portal stage to PENDING_VERIFICATION | P1 | 8 |
| FR-033 | Successful verification shall transition portal stage to VERIFIED | P1 | 8 |
| FR-034 | Incomplete documents after verification review shall transition portal stage to MISSING_DOCS | P2 | 9 |
| FR-035 | Compliance rejection shall transition portal stage back to ONBOARDING | P2 | 9 |

### Key Entities

| Entity | Description | Key Fields |
|---|---|---|
| `Organisation` | Top-level entity identified by ABN (from SR0) | id, abn, legal_trading_name, gst_registered |
| `Supplier` | Service-providing entity under an Organisation | id, organisation_id, trading_name, portal_stage, supplier_type |
| `SupplierOnboarding` | Tracks onboarding progress per supplier | id, supplier_id, invited_at, registered_at, business_completed_at, location_completed_at, pricing_completed_at, documents_completed_at, agreement_signed_at |
| `SupplierDocument` | Uploaded compliance document | id, supplier_id, document_type, file_path, status (uploaded/approved/rejected), rejection_reason |
| `SupplierAgreement` | Signed agreement record | id, supplier_id, agreement_type (supplier_agreement/apa), signed_at, version |
| `SupplierBankVerification` | EFTSure verification record | id, supplier_id, eftsure_stage (1/2/3/refused), status (pending/verified/refused), verified_at |
| `PortalStageEnum` | Existing enum: NOT_ONBOARDED, REGISTERED, INVITED, ONBOARDING, VERIFIED, TERMINATED, MISSING_DOCS, PENDING_VERIFICATION | -- |

---

## Success Criteria

### Measurable Outcomes

| ID | Criteria | Target | Measurement |
|---|---|---|---|
| SC-001 | Supplier registration completion rate (ABN entry to Organisation created) | > 90% | Funnel analytics on registration API |
| SC-002 | Onboarding completion rate (NOT_ONBOARDED to all steps complete) | > 60% within 14 days of registration (up from current ~38%) | `SupplierOnboarding` timestamps vs `created_at` |
| SC-003 | Time from registration to VERIFIED status | Lite path: < 48 hours; Heavy path: < 7 days | Portal stage transition timestamps |
| SC-004 | Mobile onboarding completion rate | Within 10% of desktop completion rate | Device-segmented funnel analytics |
| SC-005 | Multi-supplier organisations using Tier 2 registration | > 50 organisations with 2+ supplier entities within 6 months | Organisation/Supplier entity count query |
| SC-006 | Support tickets related to onboarding | 30% reduction within 3 months of launch | Support ticket categorisation |
| SC-007 | Compliance rejection turnaround (rejection to resubmission) | < 3 business days average | Document status transition timestamps |

### Edge Cases

- **ABR API unavailable**: Registration is blocked — ABN lookup is mandatory. The supplier sees a clear error message ("We're unable to verify your ABN right now. Please try again shortly.") and no organisation/supplier records are created. No manual ABN entry is permitted.
- **EFTSure slow or unavailable**: Bank verification enters a "pending" state. The supplier can continue onboarding but verification cannot complete until EFTSure responds. The system retries automatically.
- **Supplier abandons onboarding mid-flow**: Partial progress is preserved. The system sends reminder emails at 3 days, 7 days, and 14 days. After 30 days of inactivity, the account remains but is flagged for cleanup review.
- **Compliance rejects a document after supplier has completed all steps**: Portal stage reverts to ONBOARDING, the specific rejected step is re-opened, and subsequent steps remain completed (no cascade reset — only the rejected item needs fixing).
- **Supplier changes locations after pricing is set**: Pricing for removed locations is archived (not deleted). New locations have no pricing and the supplier is prompted to set rates. Existing location pricing is unaffected.
- **Duplicate registration attempt (same person, different email)**: The system does not prevent this — a person can have multiple accounts. Duplicate detection is based on ABN (organisation level), not individual identity.

## Clarifications

### Session 2026-03-19
- Q: Can a supplier go back and edit a completed onboarding step? -> A: Onboarding is sequential for initial completion (real data dependencies — locations before pricing). After initial completion, all steps are freely editable.
- Q: What happens when ABR API is unavailable? -> A: Registration is blocked. ABN lookup is mandatory — no manual entry permitted. Supplier sees a clear error and tries again later.
- Q: What does a verified supplier land on after onboarding? -> A: During PENDING_VERIFICATION, suppliers get a read-only dashboard preview — can explore but not transact. Full access (bills, matching) unlocks only at VERIFIED status.
- Q: Should onboarding steps be shared across supplier entities? -> A: Organisation-level documents (public liability, ABN verification, workers comp) are shared across all entities. Service-specific documents, pricing, locations, and agreements are independent per supplier entity.
- Q: How is a supplier identified as a subcontractor? -> A: Self-declared at the supplier entity level during Business Details — selects service delivery model (Direct Provider, Subcontractor, Both). Per entity, not per org.
