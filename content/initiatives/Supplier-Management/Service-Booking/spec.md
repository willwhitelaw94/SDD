---
title: "Feature Specification: Service Booking (APA)"
---

> **[View Mockup](/mockups/service-booking/index.html)**{.mockup-link}

**Status**: Draft
**Epic**: TP-2293 | **Initiative**: Supplier Management (TP-1857)

---

## Overview

Service Booking (APA) introduces a lightweight, multi-provider booking system for Planned Services within the Trilogy Care Portal. Currently, supplier changes trigger full budget resubmission, creating unnecessary friction and delays. This epic decouples supplier relationship management from rate card operations, enabling atomic supplier add/remove operations that do not force budget recalculation. Care Partners and Recipients can invite one or more Service Providers to a Planned Service, track responses, and contract the first suitable provider under an APA agreement.

The system introduces a **Booking** pivot record linking a Planned Service to a Service Provider invitation, with a full lifecycle (invite, accept, reject, decline, expire, withdraw) and urgency tracking. An optional **Shopping List** sub-feature (TP-2336) allows users to compile procurement items with integrated supplier pricing.

---

## User Scenarios & Testing

### User Story 1 - Create Multi-Provider Booking (Priority: P1)

As a Care Partner, I want to invite one or more Service Providers to a Planned Service so that the first suitable provider can be contracted quickly without manual chasing.

**Acceptance Scenarios**:
1. **Given** a Planned Service exists with scope and schedule defined, **When** the Care Partner clicks "Create Booking", **Then** a modal appears with multi-select provider list, urgency selector, and message textarea.
2. **Given** multiple providers are selected, **When** the booking is submitted, **Then** individual Booking records are created for each provider with status `pending`.
3. **Given** a booking is created, **When** the system processes it, **Then** a Booking Email is auto-sent to each selected provider with service summary, urgency badge, and deep-link.
4. **Given** the urgency is set to `high`, **When** the email is sent, **Then** the urgency badge is prominently displayed in the email.

### User Story 2 - Provider Accepts Booking (Priority: P1)

As a Service Provider, I want to review a booking invitation and accept or reject it so that I can confirm my availability to deliver the service.

**Acceptance Scenarios**:
1. **Given** a provider receives a Booking Email, **When** they click the deep-link, **Then** they see a booking summary with service details, T&C checkbox, and Accept/Reject buttons.
2. **Given** the provider checks the T&C box and clicks Accept, **When** the acceptance is processed, **Then** the booking status changes to `accepted`, `accepted_terms` is set to `true`, and `accepted_at` is recorded.
3. **Given** a provider accepts, **When** auto-expire is enabled, **Then** all other `pending` bookings for the same Planned Service transition to `expired`.
4. **Given** a provider clicks Reject, **When** they submit a response message, **Then** the booking status changes to `rejected` with the `provider_response_message` recorded.

### User Story 3 - Track Booking Status and Audit Trail (Priority: P1)

As a Care Partner or Coordinator, I want to view the status of all bookings for a Planned Service so that I can track provider responses and take action on non-responses.

**Acceptance Scenarios**:
1. **Given** a Planned Service has multiple bookings, **When** the user opens the Bookings tab, **Then** they see a list with urgency badges, status pills, and quick filters.
2. **Given** a booking has not been responded to, **When** the configured timeout period passes, **Then** the booking status automatically changes to `expired`.
3. **Given** any booking status change occurs, **When** the change is processed, **Then** an audit event is logged with timestamp and actor information.
4. **Given** a staff member views a booking, **When** they click inline actions, **Then** they can resend email, withdraw the booking, change urgency, or view the audit trail.

### User Story 4 - Supplier Change Without Budget Resubmission (Priority: P1)

As a Care Partner, I want to change the supplier assigned to a budget plan item without triggering full budget resubmission so that I can manage suppliers efficiently.

**Acceptance Scenarios**:
1. **Given** a budget plan item has an assigned supplier, **When** the Care Partner changes the supplier via the booking workflow, **Then** no budget resubmission is triggered.
2. **Given** a supplier is changed, **When** the rate card has not changed, **Then** the budget amounts remain unchanged.
3. **Given** a supplier is changed, **When** the rate card differs, **Then** only the affected line items are selectively updated.

### User Story 5 - APA Service Agreement Generation (Priority: P2)

As an operations staff member, I want an APA Service Agreement to be created when a provider accepts a booking so that the contractual relationship is formally recorded.

**Acceptance Scenarios**:
1. **Given** a provider accepts a booking, **When** the APA agreement creation is configured as automatic, **Then** an APA Service Agreement record is created linking the accepted booking.
2. **Given** an APA Service Agreement exists, **When** viewed, **Then** it shows the accepted booking details, T&C version, and acceptance timestamp.

### User Story 6 - Shopping List for Procurement (Priority: P3)

As a care team member, I want to compile a shopping list of items needed for home modifications and supplies so that I can coordinate procurement with suppliers efficiently.

**Acceptance Scenarios**:
1. **Given** a participant needs home modification supplies, **When** a care team member creates a shopping list, **Then** items can be added with supplier catalog integration.
2. **Given** a shopping list exists, **When** shared with team members, **Then** all team members can view and edit the list.
3. **Given** items are on the shopping list, **When** pricing data is available, **Then** supplier pricing comparison is displayed.

### Edge Cases

- **All providers reject**: System alerts the Care Partner that no providers have accepted and suggests creating a new booking invitation.
- **Provider requests information**: Booking status moves to `info_requested`, then back to `pending` after clarification is sent.
- **Concurrent acceptances**: If two providers accept simultaneously before auto-expire runs, the system processes the first acceptance and expires the second.
- **Token expiry on email links**: Signed URLs have a configurable lifespan; expired tokens show a message directing the provider to log in via the portal.
- **Withdrawn booking**: An admin can withdraw a booking at any time, changing status to `withdrawn` regardless of current state.
- **Bulk invite limits**: System enforces a configurable maximum number of providers per Planned Service invitation.

---

## Functional Requirements

- **FR-001**: System MUST create individual Booking pivot records linking a Planned Service to each invited Service Provider.
- **FR-002**: System MUST support booking statuses: `pending`, `accepted`, `rejected`, `declined`, `expired`, `withdrawn`, `info_requested`.
- **FR-003**: System MUST support urgency levels: `low`, `medium` (default), `high`.
- **FR-004**: System MUST auto-trigger a Booking Email on booking creation with service summary, urgency badge, message, and deep-links.
- **FR-005**: System MUST support at least two acceptance paths: Portal login (Option A) and email-direct signed URL (Option B).
- **FR-006**: System MUST require T&C acceptance (with version tracking) before a provider can accept a booking.
- **FR-007**: System MUST optionally auto-expire other `pending` bookings when one provider accepts (configurable).
- **FR-008**: System MUST record audit timestamps for all status transitions (`booking_email_sent_at`, `responded_at`, `accepted_at`, `rejected_at`).
- **FR-009**: System MUST decouple supplier changes from budget resubmission workflows.
- **FR-010**: System MUST support atomic supplier add/remove operations on budget plan items.
- **FR-011**: System MUST fire webhook/notification to internal staff on booking status changes.
- **FR-012**: System MUST support inline staff actions: resend email, withdraw, change urgency, view audit trail.
- **FR-013**: System SHOULD support APA Service Agreement generation on provider acceptance (auto or manual, configurable).
- **FR-014**: System SHOULD support reporting on acceptance rate, average response time, and expiry counts.

---

## Key Entities

- **Package**: Funding package owning one or more Planned Services. (1:N to Planned Service)
- **Planned Service**: Planned piece of care/work with scope, schedule, and cost estimate. (belongs to Package, 1:N to Booking)
- **Booking**: Pivot record linking a Planned Service to one Service Provider invitation. Fields: `id`, `planned_service_id` (FK), `service_provider_id` (FK), `status` (enum), `urgency` (enum), `message_to_provider` (text), `provider_response_message` (text), `booking_email_sent_at`, `responded_at`, `accepted_terms` (boolean), `terms_version` (string), `accepted_at`/`rejected_at` (datetimes), standard audit fields.
- **Service Provider**: External provider org/user. (1:N to Booking)
- **APA Service Agreement**: Legal/financial agreement created once a provider accepts. (1:N to accepted Bookings)
- **Risk**: Risk items logged during assessment, linked to Planned Service.

---

## Success Criteria

### Measurable Outcomes

- **SC-001**: Supplier change operations not requiring budget resubmission >80%.
- **SC-002**: Booking workflow completion time reduced by 50% compared to current process.
- **SC-003**: User satisfaction with booking process >4/5.
- **SC-004**: Zero data consistency issues from atomic operations.
- **SC-005**: Median provider acceptance time <24 hours.
- **SC-006**: Percentage of bookings receiving any response >90%.

---

## Assumptions

- Supplier relationship and rate card updates can be technically decoupled within the existing architecture.
- Budget rebalance engine can handle selective supplier updates without full recalculation.
- Rate card management system is available and stable.
- Budget plan structure supports supplier-level granularity.
- Providers have reliable email access and can authenticate in the portal.
- Planned Service data (scope, schedule, cost) is complete before invitation.
- A single provider acceptance will normally fulfil the service (winner-takes-all), unless explicitly configured otherwise.

---

## Dependencies

- Rate card management system availability and stability.
- Budget plan structure supporting supplier-level granularity.
- Email template engine (Notify-style) for booking emails.
- Notification infrastructure for internal staff alerts.
- Existing authentication system for provider portal access.

---

## Out of Scope

- Pricing/quote negotiation loop.
- SLA auto-calculation.
- Multi-signature APA generation.
- Service Provider search engine.
- Preferred Service Provider logic.
- Shopping list supplier catalog integration (deferred to sub-epic TP-2336 phase 2).


## Clarification Outcomes

### Q1: [Scope] What is the booking model — direct, request-based, or coordinator-mediated?
**Answer:** The spec clearly defines a REQUEST-BASED model. A Care Partner invites one or more providers to a Planned Service (US1). Providers receive booking emails with deep-links and can accept or reject (US2). The first provider to accept wins (auto-expire others). This is NOT direct booking (no real-time availability) and NOT purely coordinator-mediated (providers self-serve their response). The model is "multi-invite, first-to-accept."

### Q2: [Dependency] Does APA create appointments that CIP syncs?
**Answer:** The spec does not mention Calendar Integration (CIP). APA creates Booking records linking Planned Services to Service Providers. These are invitations and acceptance records, not calendar appointments. **Assumption:** CIP, if it exists, would create calendar events from accepted Bookings. APA delivers first; CIP consumes APA's accepted bookings. However, no CIP spec or code was found in the initiative. **Recommendation:** APA should be designed with a webhook/event on booking acceptance that future calendar integrations can consume.

### Q3: [Data] Is there a new Booking entity?
**Answer:** Yes. The spec defines a `Booking` pivot record: `id`, `planned_service_id` (FK to BudgetPlanItem), `service_provider_id` (FK to Supplier), `status` (pending/accepted/rejected/declined/expired/withdrawn/info_requested), `urgency` (low/medium/high), `message_to_provider`, `provider_response_message`, `booking_email_sent_at`, `responded_at`, `accepted_terms`, `terms_version`, `accepted_at`/`rejected_at`. No `Booking` model exists in the codebase yet. This is a new entity. The relationship to bills is indirect: `BudgetPlanItem` → `Booking` → accepted Supplier → future bills from that supplier are linked via `BillItem.supplier_id` and `BillItem.package_budget_item_id`.

### Q4: [Edge Case] What happens with no-show by supplier?
**Answer:** The spec does not address no-shows explicitly. The QR Code Service Confirmation (QRW) spec would detect unconfirmed visits (US3: "scheduled booking has no visit confirmation"). **Assumption:** No-show detection is QRW's responsibility, not APA's. APA manages the invitation and acceptance lifecycle; service delivery confirmation is separate. **Recommendation:** Add an edge case: "Given a booking is accepted but service not delivered, When the scheduled date passes without QR confirmation, Then the booking status remains `accepted` but a `no_show` flag is available for future QRW integration."

### Q5: [Integration] Does Service Booking integrate with QR Code Service Confirmation?
**Answer:** Not directly in v1. QRW validates visits against bookings (QRW FR-004: "validate recipient-booking linkage"). This means QRW depends on APA's Booking entity. APA should expose the accepted booking data that QRW needs for validation: which supplier is expected at which recipient on which date. The integration is one-directional: QRW reads APA's booking data.

### Q6: [Data] FR-009 says "decouple supplier changes from budget resubmission." How does this work technically?
**Answer:** The `BudgetPlanItem` model uses event sourcing (`BudgetPlanItemAggregateRoot`). Currently, changing a supplier likely triggers a budget recalculation event. FR-009 requires that supplier swaps via the booking workflow do NOT trigger full recalculation. This means the supplier association must be stored on the Booking entity, not directly on `BudgetPlanItem`. When the budget calculates costs, it looks at the accepted Booking's supplier's rates. **Assumption:** This requires a new relationship: `BudgetPlanItem → active Booking → Supplier` instead of a direct `BudgetPlanItem → Supplier` link.

### Q7: [Scope] The spec mentions "APA Service Agreement" — what is this?
**Answer:** US5 (P2) describes an APA Service Agreement created when a provider accepts. This is a contractual record linking the accepted booking with T&C acceptance. The codebase already has `SupplierAgreement` model (`domain/Supplier/Models/SupplierAgreement.php`) with `AgreementTypeEnum` and `AgreementStatusEnum`. The APA agreement would be a new agreement type. **Recommendation:** Add `APA` to `AgreementTypeEnum` and create the agreement record on booking acceptance.

### Q8: [UX] Email-direct signed URL vs portal login — which is the primary acceptance path?
**Answer:** FR-005 supports both. The email contains a signed URL (time-limited, one-use) for quick response AND a portal login link. The signed URL is the low-friction path for providers who don't regularly use the portal. Existing providers with portal accounts would log in. The `SupplierApiRefreshToken` model and V2 auth routes (`domain/Supplier/Routes/v2/authRoutes.php`) confirm the portal auth infrastructure exists.

### Q9: [Edge Case] Concurrent acceptances — how is the race condition handled?
**Answer:** The spec says "the system processes the first acceptance and expires the second." This requires atomic database operations. Use a database-level lock: when processing an acceptance, lock the Booking's `planned_service_id` scope, check if another acceptance exists, process or reject. This is a standard optimistic concurrency pattern. **Recommendation:** Use `DB::transaction` with `lockForUpdate()` on the Booking query scoped by `planned_service_id`.

### Q10: [Dependency] The existing supplier pages have Bills, Documents, Prices, etc. Where does Booking management appear?
**Answer:** The spec says US3 has a "Bookings tab" on the Planned Service view. For the Care Partner, this would be within the budget/care plan interface. For the supplier, bookings would appear as a new page in the supplier portal (alongside Bills, Documents, Prices). The existing `Suppliers/` Vue pages provide the framework. A new `Suppliers/Bookings/Index.vue` page would be needed.

## Refined Requirements

1. **New Edge Case**: Given a booking is accepted but service is not delivered (no QR confirmation after scheduled date), When the care partner views the booking, Then a "Service unconfirmed" indicator is shown (enabled by QRW integration).

2. **Technical Requirement**: Booking acceptance MUST use database-level locking (`lockForUpdate()`) scoped by `planned_service_id` to prevent race conditions in concurrent acceptance scenarios.

3. **Data Model Clarification**: The Booking entity stores the supplier association for a Planned Service. `BudgetPlanItem` should reference the accepted Booking (or the Booking's supplier) rather than storing a direct supplier FK, enabling supplier changes without budget resubmission.

4. **Dependency Chain**: APA's Booking entity is a prerequisite for SSP (Search Service Provider) booking creation and QRW (QR Code Service Confirmation) visit validation.
