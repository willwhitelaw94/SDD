---
title: "Feature Specification: QR Code Service Confirmation (QRW)"
---

> **[View Mockup](/mockups/qr-code-service-confirmation/index.html)**{.mockup-link}

**Status**: Draft
**Epic**: TP-1906 QRW | **Initiative**: TP-1857 Supplier Management

---

## Overview

Trilogy Care lacks a reliable, auditable method to confirm that scheduled services have actually been delivered to clients. Confirmation currently relies on supplier invoices and manual checks, which are inconsistent and leave gaps in assurance. Under the Support at Home program (Manual v4.0, Section 10.5) and the Aged Care Rules 2025 (s.154-1205, s.148-70, s.148-80), registered providers must maintain accurate records confirming services were delivered before government funding can be claimed.

This feature implements a lightweight, QR-based Visit Confirmation module. Each recipient gets a client-specific QR code (printed on their care plan and optionally a fridge magnet). Service workers scan the QR code on arrival to open a mobile web page unique to that recipient, enter their details, select the relevant booking, confirm attendance, and submit. The system validates the recipient-booking linkage and time window, stores an auditable record, and optionally captures additional data including photo evidence, geolocation, wellbeing surveys, and voice case notes.

---

## User Scenarios & Testing

### User Story 1 - QR Code Check-In at Service Delivery (Priority: P1)

As a Service Worker, I want to scan a QR code at the client's home to confirm my visit so that I can quickly record my attendance without needing to log in or use a separate app.

**Acceptance Scenarios**:
1. **Given** a service worker arrives at a client's home, **When** they scan the QR code on the care plan or fridge magnet, **Then** a mobile web page opens showing the client's name (no other PII) and a check-in form.
2. **Given** the check-in form is displayed, **When** the worker enters their name and supplier ID, **Then** the system displays a list of bookings for that recipient filtered to today's date and near-current time.
3. **Given** a booking is selected, **When** the worker ticks the "I have attended" checkbox and submits, **Then** the system validates the recipient-booking linkage and time window, stores an auditable record, and displays a confirmation.
4. **Given** the check-in is completed, **When** the worker departs and scans the QR code again, **Then** a departure confirmation is recorded with a timestamp.
5. **Given** the entire check-in process, **When** measured end-to-end, **Then** it takes no more than 10-20 seconds.

### User Story 2 - QR Code Generation and Distribution (Priority: P1)

As a Care Coordinator, I want each recipient to have a unique QR code embedded in their care plan and optionally on a fridge magnet so that service workers can easily scan it on arrival.

**Acceptance Scenarios**:
1. **Given** a new recipient is onboarded, **When** their care plan is generated, **Then** a unique QR code and short URL are automatically embedded in the care plan PDF.
2. **Given** a QR code is generated, **When** it is scanned, **Then** it resolves to a non-PII short URL (e.g., `/v/abc123`) that identifies the recipient without exposing personal information.
3. **Given** a coordinator requests a fridge magnet for a recipient, **When** the request is processed, **Then** a print-ready PDF with the QR code and short URL is generated for printing.
4. **Given** a QR code may be compromised, **When** a coordinator revokes it, **Then** the old QR code is invalidated and a new one is generated.

### User Story 3 - Visit Log and Exception Monitoring (Priority: P1)

As a Care Coordinator, I want to view a log of all visit confirmations for my clients so that I can monitor service delivery and identify exceptions.

**Acceptance Scenarios**:
1. **Given** visit confirmations are recorded, **When** the coordinator views the visit log, **Then** they see a list of confirmed visits with worker name, booking reference, check-in time, check-out time, and validation status.
2. **Given** a visit confirmation has a validation exception (e.g., outside time window, wrong recipient-booking linkage), **When** viewing the log, **Then** the exception is highlighted with the specific issue described.
3. **Given** a scheduled booking has no visit confirmation, **When** the expected time window has passed, **Then** the booking is flagged as "unconfirmed" in the visit log.
4. **Given** visit log data is available, **When** the coordinator exports it, **Then** a CSV or PDF report is generated for compliance and audit purposes.

### User Story 4 - Wellbeing Survey at Check-In (Priority: P2)

As a Service Worker, I want to answer quick wellbeing questions about the client during my visit so that care concerns can be identified early.

**Acceptance Scenarios**:
1. **Given** the worker completes the check-in form, **When** a wellbeing survey is configured for this service type, **Then** a set of radio-button questions about client wellbeing is displayed.
2. **Given** the survey questions are displayed, **When** the worker answers and submits, **Then** the responses are stored with the visit confirmation record.
3. **Given** a wellbeing response indicates a potential concern (e.g., "client appeared distressed"), **When** the response is submitted, **Then** an alert is generated for the Care Coordinator.
4. **Given** different service types (support levels 1-5), **When** the survey is displayed, **Then** the questions are tailored to the relevant service type and supplier category.

### User Story 5 - Voice Case Notes with Multilingual Support (Priority: P2)

As a Service Worker with limited computer interaction skills, I want to dictate case notes in my preferred language so that important observations are captured without requiring typing.

**Acceptance Scenarios**:
1. **Given** the worker is completing a visit check-in, **When** they tap the voice notes option, **Then** a voice recording interface is displayed with language selection.
2. **Given** the worker records a voice note, **When** it is submitted, **Then** AI transcription converts the audio to text, with automatic translation to English if recorded in another language.
3. **Given** the transcribed note is available, **When** AI review processes it, **Then** important information (incidents, health changes, care concerns) is extracted and flagged.
4. **Given** a flagged concern is detected, **When** the AI review completes, **Then** a recommendation for care partner review or clinical referral is generated.

### User Story 6 - Geolocation and Photo Evidence (Priority: P3)

As a Compliance Officer, I want optional geolocation and photo evidence captured during check-in so that service delivery evidence is strengthened for audits.

**Acceptance Scenarios**:
1. **Given** geolocation capture is enabled for a recipient, **When** the worker scans the QR code, **Then** the system requests GPS consent and, if granted, captures the worker's location.
2. **Given** photo evidence is enabled, **When** the worker is completing check-in, **Then** an optional photo capture field is displayed.
3. **Given** geolocation data is captured, **When** it is stored, **Then** the system records coordinates, accuracy, and timestamp without displaying the address (privacy protection).
4. **Given** a worker denies GPS consent, **When** they proceed with check-in, **Then** the check-in is still accepted without geolocation data.

### Edge Cases

- **QR code damaged or lost**: Fallback short URL (printed alongside QR) allows manual entry in a mobile browser.
- **No internet connectivity**: The check-in form should be fast-loading; submissions are queued locally and retried when connectivity is restored.
- **Wrong booking selected**: Bookings are filtered by recipient and near-timeframe; out-of-window selections are flagged but not blocked.
- **Spoofing attempts (no auth)**: Mitigated by recipient scoping, time-window validation, roster cross-check, device/IP rate-limits, optional client PIN, and QR rotation capability.
- **Worker scans QR but does not submit**: Incomplete check-ins are logged but not counted as confirmed visits.
- **Multiple workers for one booking**: Each worker checks in independently; the system supports multiple check-ins per booking.
- **Worker checks in at wrong client's home**: The QR code uniquely identifies the recipient; if the booking does not match the recipient, a validation warning is displayed.
- **Privacy concerns**: No PII is stored in the QR code; IP addresses are hashed; GPS requires explicit consent; data retention policy applies.

---

## Functional Requirements

- **FR-001**: System MUST generate a unique, non-PII QR code and short URL for each recipient, embeddable in care plan PDFs and printable for fridge magnets.
- **FR-002**: System MUST provide a mobile-optimised web page (PWA-capable) for visit check-in, requiring no login or app installation.
- **FR-003**: System MUST capture worker name (free text), supplier ID, booking selection, and attendance confirmation at check-in.
- **FR-004**: System MUST validate recipient-booking linkage and check-in time against the booking time window.
- **FR-005**: System MUST store auditable visit confirmation records including check-in time, check-out time, worker details, booking reference, and validation status.
- **FR-006**: System MUST display bookings filtered by recipient and near-current timeframe, highlighting "today/now" bookings.
- **FR-007**: System MUST provide admin views for visit log, exceptions, and data export.
- **FR-008**: System MUST support QR code revocation and regeneration.
- **FR-009**: System SHOULD support wellbeing surveys with configurable questions tailored to service type and supplier category.
- **FR-010**: System SHOULD support voice note recording with AI transcription and multi-language translation.
- **FR-011**: System SHOULD support AI review of case notes to extract and flag incidents, health changes, and care concerns.
- **FR-012**: System SHOULD support optional geolocation capture (with explicit consent) and photo evidence.
- **FR-013**: System MUST support offline/poor-connectivity scenarios with queued submission and retry.
- **FR-014**: System MUST implement anti-spoofing measures including time-window validation, device/IP rate-limits, and optional client PIN.
- **FR-015**: System MUST provide basic reporting and eventing for finance and compliance teams.

---

## Key Entities

- **RecipientQRCode**: A unique QR code and short URL slug assigned to a recipient. Contains recipient reference (non-PII), slug, generation date, revocation status, and print-ready asset references.
- **VisitConfirmation**: An auditable record of a service worker's visit. Contains worker name, supplier ID, booking reference, check-in timestamp, check-out timestamp, validation result, device fingerprint (hashed), IP (hashed), and optional geolocation.
- **WellbeingSurveyResponse**: Responses to wellbeing questions captured during check-in. Contains survey template reference, question-answer pairs, service type context, and any flags generated.
- **VoiceCaseNote**: A voice recording with AI transcription. Contains audio reference, transcription text, source language, English translation, and AI-extracted flags (incidents, health changes, concerns).
- **Booking**: The existing booking entity, extended with visit confirmation status (confirmed, unconfirmed, exception) and confirmation references.

---

## Success Criteria

### Measurable Outcomes

- Visit confirmation adoption rate >90% within 3 months of rollout.
- Questionable claims reduced by 1-2% (estimated annual savings $28k-$58k based on 4,000 visits/month at $60/visit).
- Coordinator and payroll admin time saved by 20% through automated confirmation tracking.
- Zero compliance findings related to service verification in SAH audits.
- Check-in completion time <20 seconds (95th percentile).
- QR code scan-to-submission success rate >95%.

---

## Assumptions

- Workers have smartphones with cameras and intermittent data coverage.
- The booking system exposes recipient-scoped bookings and stable booking IDs/UIDs.
- Care plan generation pipeline can embed QR codes and short URLs.
- Worker names can be entered as free text (no SSO or login required for MVP).
- Recipients and families consent to QR code display in the home.
- Voice transcription accuracy is sufficient for clinical case notes (>90% target).

---

## Dependencies

- Recipient and booking data access (API/DB) for booking lookup and validation.
- Short URL/slug service for non-PII QR link resolution.
- PDF generation pipeline for care plans and magnet print assets.
- Basic reporting and eventing infrastructure for finance/compliance.
- AI transcription service with multilingual support (for voice case notes).
- QR code generation infrastructure.
- Incident management system integration (for AI-flagged concerns).

---

## Out of Scope

- Full integration with existing CRM systems.
- Advanced analytics and reporting beyond basic visit logs and exports.
- Supplier rostering or scheduling.
- Budget management tools for coordinators.
- Formal incident investigation workflow (distinct from incident flagging).
- Invoice reconciliation automation (future capability enabled by visit confirmation data; covered by [Invoices V2](/initiatives/Supplier-Management/Invoices-V2) and [Optimising Bill Processing](/initiatives/Supplier-Management/Optimising-Bill-Processing)).
- Billing reconciliation engine matching invoices to visit data (planned as a future phase building on this foundation).


## Clarification Outcomes

### Q1: [Scope] What is the end-to-end flow? Who scans what?
**Answer:** The spec is explicit: the QR code is CLIENT-specific (per recipient), printed on the care plan and optionally a fridge magnet. The SERVICE WORKER scans the client's QR code on arrival using their smartphone camera. The QR resolves to a mobile web page (`/v/abc123`) where the worker identifies themselves and confirms attendance. The recipient does NOT scan anything. TC Portal generates the QR code when the recipient is onboarded (US2).

### Q2: [Data] What data is captured and how does it feed into billing?
**Answer:** FR-003 to FR-005 define captured data: worker name (free text), supplier ID, booking selection, attendance confirmation, check-in/check-out timestamps, and validation status. The spec's Out of Scope explicitly states "Billing reconciliation engine matching invoices to visit data (planned as a future phase building on this foundation)" and "Invoice reconciliation automation." So QRW captures visit evidence but does NOT directly trigger billing in v1. It creates an audit trail that can later be cross-referenced with invoices manually or through a future reconciliation engine.

### Q3: [Dependency] Does this replace or complement existing service confirmation?
**Answer:** No existing QR-based or digital service confirmation mechanism was found in the codebase. The current confirmation relies on "supplier invoices and manual checks" (per the problem statement). QRW introduces a NEW confirmation method. It complements the invoice-based approach — visits are confirmed independently of invoicing. The `Booking` concept is referenced (FR-004, FR-006) but no `Booking` model exists in the codebase yet. This depends on the Service Booking (APA) epic to create the Booking entity. **Recommendation:** Clarify whether QRW can work without APA's Booking entity by validating against `BudgetPlanItem` records instead.

### Q4: [Edge Case] What happens with no internet connectivity?
**Answer:** FR-013 explicitly states "System MUST support offline/poor-connectivity scenarios with queued submission and retry." The spec's edge case section says "submissions are queued locally and retried when connectivity is restored." This implies a Progressive Web App (PWA) approach with local storage and background sync. The check-in form should be fast-loading (FR-002: "PWA-capable"). This is a significant technical requirement — offline queuing with retry adds complexity.

### Q5: [Integration] Does QR confirmation feed into other epics?
**Answer:** QRW is explicitly out of scope for billing reconciliation. However, the visit confirmation data is valuable for: (1) Supplier Audit Process (SAP) — visit evidence for audits, (2) AI Invoice V3 (AIV3) — matching invoice line items to confirmed visits could improve classification confidence, (3) OHB — "service not delivered" could be an on-hold reason. These integrations are future phases. For v1, QRW is standalone with basic reporting.

### Q6: [Data] The spec references "bookings" but no Booking entity exists. What is the dependency?
**Answer:** The Service Booking (APA) spec introduces a `Booking` pivot record. QRW's FR-004 validates "recipient-booking linkage." If APA is not delivered before QRW, the system needs an alternative: validate against `BudgetPlanItem` records (planned services for the recipient). The `BudgetPlanItem` has `service_type_id` and supplier references. **Recommendation:** Design QRW's booking lookup to be pluggable — use `BudgetPlanItem` initially, swap to `Booking` when APA delivers.

### Q7: [Compliance] The spec cites SAH Manual v4.0 Section 10.5 and Aged Care Rules 2025. Is this a compliance requirement?
**Answer:** Yes. Under SAH, registered providers must maintain accurate records confirming services were delivered before government funding can be claimed. QRW provides this evidence. The "questionable claims reduced by 1-2%" success criterion (SC) translates to $28K-$58K annual savings. This makes QRW a compliance feature, not just an operational improvement. Priority should reflect this regulatory driver.

### Q8: [Security] Anti-spoofing measures — is the worker authenticated?
**Answer:** No. FR-002 explicitly states "requiring no login or app installation." Workers identify themselves with free text name and supplier ID. Anti-spoofing relies on: time-window validation, recipient scoping (QR is per-client), device/IP rate-limits, optional client PIN, and QR rotation capability. This is a pragmatic v1 approach — requiring authentication would kill adoption among low-tech service workers. **Assumption:** Spoofing risk is low because the QR code is in the client's home, so physical presence is implicitly verified.

### Q9: [UX] The wellbeing survey (US4) and voice notes (US5) — are these P2 features or nice-to-haves?
**Answer:** Both are marked P2, making them secondary to the core check-in flow (P1). They are also flagged with SHOULD (not MUST) in the FRs (FR-009, FR-010, FR-011). Voice notes with multilingual AI transcription (US5) is technically complex (speech-to-text + translation + NLP flagging). **Recommendation:** Treat US5 as a separate mini-epic or phase 2, not part of the initial QRW delivery.

### Q10: [Performance] 4,000 visits/month — what is the expected concurrent load?
**Answer:** 4,000 visits/month = ~130 visits/day = ~15-20 concurrent check-ins at peak (assuming visits cluster in morning and afternoon). The mobile web page must load fast on 3G connections (<3 seconds). PWA caching of the check-in form HTML/JS is essential. The backend receives check-in submissions — not high throughput, but latency-sensitive for user experience.

### Q11: [Data] QR code format and slug uniqueness — what prevents enumeration?
**Answer:** FR-001 uses a "non-PII short URL" like `/v/abc123`. The slug must be unguessable to prevent enumeration attacks (someone trying `/v/abc124`). **Recommendation:** Use cryptographically random slugs (minimum 8 characters, base62 encoding = 62^8 = 218 trillion combinations). Do NOT use sequential IDs or predictable patterns.

### Q12: [Migration] How are existing recipients given QR codes?
**Answer:** US2 says QR codes are generated when care plans are created. Existing recipients would need a backfill job to generate QR codes for all active recipients. The care plan PDF generation pipeline would need modification to embed the QR code. **Recommendation:** Provide a bulk QR generation command (`php artisan qr:generate --all-active`) and a batch print job for fridge magnets.

## Refined Requirements

1. **Dependency Clarification**: QRW should work WITHOUT the Service Booking (APA) epic by validating visits against `BudgetPlanItem` records. When APA is delivered, the validation layer switches to the `Booking` entity.

2. **New AC for US1**: Given the check-in form is loaded on a 3G connection, When the worker accesses it via QR scan, Then the page loads in under 3 seconds.

3. **US5 Phase Separation**: Voice case notes with multilingual AI transcription should be treated as a separate phase (QRW Phase 2) due to the complexity of speech-to-text + translation infrastructure.

4. **Security FR**: QR slugs MUST be cryptographically random (minimum 8 characters, base62 encoding) to prevent enumeration attacks.
