---
title: "Feature Specification: Express Pay (EXP)"
---

> **[View Mockup](/mockups/express-pay/index.html)**{.mockup-link}

**Status**: Draft
**Epic**: TP-2779 EXP | **Initiative**: TP-1857 Supplier Management

---

## Overview

Payment processing for suppliers currently follows standard timelines that lack flexibility for urgent or expedited payments. Suppliers experience cash flow challenges due to payment delays, and there is no mechanism for priority payment handling when needed. Express Pay introduces an expedited payment processing option for eligible suppliers, enabling faster settlement times while maintaining financial controls. The feature includes eligibility criteria, priority workflows, and supplier self-service capabilities.

---

## User Scenarios & Testing

### User Story 1 - Request Express Payment (Priority: P1)

As a Supplier, I want to request express payment for an approved invoice so that I can receive funds faster when I have urgent cash flow needs.

**Acceptance Scenarios**:
1. **Given** a supplier has an approved invoice eligible for express payment, **When** they view the invoice in the supplier portal, **Then** an "Request Express Pay" option is displayed.
2. **Given** the supplier clicks "Request Express Pay", **When** the request is submitted, **Then** the system validates eligibility criteria and confirms or rejects the request.
3. **Given** the express payment request is approved, **When** processing begins, **Then** the invoice is moved to a priority payment queue with an expedited settlement timeline.
4. **Given** the express payment request is rejected, **When** the supplier views the response, **Then** a clear reason is displayed (e.g., "Invoice amount exceeds express pay limit").

### User Story 2 - Manage Express Pay Eligibility (Priority: P1)

As a Finance Administrator, I want to define and manage eligibility criteria for express payments so that the organisation maintains financial control over expedited outflows.

**Acceptance Scenarios**:
1. **Given** a finance administrator opens the express pay settings, **When** they configure eligibility rules, **Then** criteria such as invoice amount thresholds, supplier history, and payment frequency limits can be set.
2. **Given** eligibility criteria are configured, **When** a supplier requests express payment, **Then** the system automatically evaluates the request against all criteria.
3. **Given** a supplier does not meet eligibility criteria, **When** the request is evaluated, **Then** it is automatically rejected with the specific failing criterion identified.

### User Story 3 - Monitor Express Payment Queue (Priority: P2)

As a Finance Coordinator, I want to view and manage the express payment queue so that I can ensure priority payments are processed within SLA.

**Acceptance Scenarios**:
1. **Given** express payment requests exist, **When** a finance coordinator views the payment dashboard, **Then** a dedicated "Express Pay" queue is visible with SLA countdown timers.
2. **Given** an express payment is approaching its SLA deadline, **When** the countdown reaches a warning threshold, **Then** the coordinator receives an alert.
3. **Given** an express payment has been processed, **When** settlement is confirmed, **Then** the supplier is notified of payment completion.

### User Story 4 - Express Pay Fee Transparency (Priority: P2)

As a Supplier, I want to understand any fees associated with express payment so that I can make an informed decision before requesting it.

**Acceptance Scenarios**:
1. **Given** a supplier views the express pay option, **When** fees apply, **Then** the fee amount or percentage is clearly displayed before the request is submitted.
2. **Given** no fees apply, **When** the supplier views the express pay option, **Then** it is clearly indicated that express payment is fee-free.

### Edge Cases

- **Duplicate requests**: If a supplier requests express payment for an invoice already in the express queue, the system should inform them of the existing request rather than creating a duplicate.
- **Invoice amended after express request**: If an invoice is amended after express payment is requested, the express request should be re-evaluated against eligibility criteria.
- **Banking system unavailable**: If the banking integration is down, express requests should be queued and processed once connectivity is restored, with supplier notification of the delay.
- **Cash flow capacity exceeded**: If total express payment requests exceed a configured daily/weekly cap, new requests should be queued with an estimated processing time.
- **Supplier suspended**: Suspended suppliers should not be eligible for express payment.

---

## Functional Requirements

- **FR-001**: System MUST provide a self-service express payment request option for eligible suppliers on approved invoices.
- **FR-002**: System MUST evaluate express payment eligibility against configurable criteria (invoice amount, supplier history, frequency limits, supplier status).
- **FR-003**: System MUST process approved express payments within the configured SLA (target: <48 hours settlement).
- **FR-004**: System MUST maintain a priority payment queue separate from standard payment processing.
- **FR-005**: System MUST notify suppliers of express payment request status (approved, rejected, processed, settled).
- **FR-006**: System MUST log all express payment requests, approvals, rejections, and settlements for audit purposes.
- **FR-007**: System MUST enforce a configurable daily/weekly cap on total express payment value to manage cash flow.
- **FR-008**: System MUST display any applicable fees before the supplier confirms the express payment request.
- **FR-009**: System MUST integrate with existing billing and financial systems (MYOB) for payment processing.
- **FR-010**: System MUST prevent express payment requests for invoices that are disputed, on hold, or already in payment processing.

---

## Key Entities

- **ExpressPayRequest**: A request from a supplier for expedited payment of an approved invoice. Contains invoice reference, request timestamp, eligibility evaluation result, status (pending, approved, rejected, processing, settled), and fee amount.
- **ExpressPayEligibilityCriteria**: Configurable rules that determine whether a supplier/invoice qualifies for express payment. Includes amount thresholds, supplier history requirements, frequency limits, and supplier status checks.
- **ExpressPayQueue**: A priority queue of approved express payment requests awaiting processing. Tracks SLA deadlines and processing status.
- **Invoice**: The existing invoice entity, extended with express pay request status and settlement tracking.

---

## Success Criteria

### Measurable Outcomes

- Express payment settlement time <48 hours from request approval.
- Supplier satisfaction score improvement >10% among express pay users.
- Express payment adoption rate >20% of eligible suppliers within 6 months.
- Zero eligibility disputes escalated beyond automated resolution.
- No negative impact on standard payment processing timelines.

---

## Assumptions

- Express payment processing aligns with existing financial policies and can be approved by finance leadership.
- Banking infrastructure supports expedited settlement (same-day or next-day transfers).
- Supplier portal exists or is being developed to support self-service requests.
- MYOB integration can handle priority payment flagging.
- Express pay fees (if any) are determined and approved by finance before launch.

---

## Dependencies

- Financial system (MYOB) must support priority payment processing and expedited settlement.
- Cash management policies must accommodate faster outflows and configurable caps.
- Banking partner SLAs must support expedited settlement timelines.
- Supplier portal must support the express payment request interface.
- Finance leadership must approve eligibility criteria and fee structure.

---

## Out of Scope

- Changes to standard payment processing timelines.
- Supplier credit or financing arrangements.
- Automated invoice approval (covered by [Invoices V2](/initiatives/Supplier-Management/Invoices-V2)).
- Supplier onboarding workflow changes.
- Integration with external payment platforms (PayPal, Stripe, etc.).


## Clarification Outcomes

### Q1: [Scope] What is the business model? Fee-based or funded from existing budgets?
**Answer:** US4 (Fee Transparency) and FR-008 address this — the system must display fees before the supplier confirms. The spec supports both fee-based and fee-free models, with the final decision deferred to finance leadership (listed as a dependency). **Assumption:** Express Pay is likely fee-based (a small percentage of the invoice amount, similar to invoice factoring services), providing a revenue stream to offset the cash flow cost. The fee structure must be approved before launch.

### Q2: [Dependency] How does Express Pay interact with the billing pipeline (IV2, OHB)?
**Answer:** The codebase already has an `ExpressPayController` (`domain/Supplier/Http/Controllers/V2/ExpressPayController.php`) with a `status` endpoint and `CheckExpressPayEligibilityAction`. This confirms Express Pay is already partially scaffolded in the V2 supplier API. It checks eligibility on the current supplier context. FR-010 specifies express pay cannot be requested for invoices that are "disputed, on hold, or already in payment processing" — confirming it integrates with the existing bill stage pipeline. Bills must be in `APPROVED` stage (approved but not yet paying). Express Pay accelerates the `APPROVED` → `PAYING` → `PAID` transition.

### Q3: [Data] What eligibility criteria determine qualification?
**Answer:** FR-002 lists: invoice amount thresholds, supplier history, frequency limits, and supplier status. The existing `CheckExpressPayEligibilityAction` in the codebase handles this logic. FR-007 adds daily/weekly caps on total express payment value. **Assumption:** Supplier must be in `ACTIVE` stage (not `PENDING`, `SUSPENDED`), invoice must be `APPROVED`, and there is likely a minimum relationship duration (e.g., supplier must have had 3+ successfully paid invoices).

### Q4: [Edge Case] What happens if an express-paid invoice is later disputed or reversed?
**Answer:** The spec's edge case "Invoice amended after express request" addresses partial reversal — the request is re-evaluated. For full dispute after payment, this is a standard payment reversal scenario. The existing bill pipeline supports `REJECTED` stage. **Assumption:** Express pay funds would need to be recovered through the standard MYOB credit/debit workflow. This should be explicitly documented as a financial operations process, not necessarily a system feature.

### Q5: [Integration] Does Express Pay require MYOB integration?
**Answer:** FR-009 explicitly states "System MUST integrate with existing billing and financial systems (MYOB) for payment processing." The codebase has MYOB integration (`Domain\Myob\Models\MyobSyncLog`, `BillMyobSyncLogs.vue`). Express Pay would use the same MYOB sync but with priority flagging. The `MyobSyncLog` model tracks sync status per bill.

### Q6: [Scope] The supplier portal must support the express payment request interface. Does the supplier portal exist?
**Answer:** Yes. The codebase has a full supplier portal at `resources/js/Pages/Suppliers/` with pages for Dashboard, Bills (Index, Show, Create, Edit), Prices, Documents, Team, Locations, Agreements, BusinessDetails, Clients, and Verification. The V2 API (`domain/Supplier/Routes/v2/`) provides the backend. Express Pay would add a new action button on the `Suppliers/Bills/Show.vue` page for approved invoices.

### Q7: [Data] What is the ExpressPayRequest entity structure?
**Answer:** The spec defines it conceptually (invoice reference, timestamp, eligibility result, status, fee amount). The existing `express_pay_configs` migration table (untracked file in git status) suggests a configuration table already exists. **Recommendation:** Create `express_pay_requests` table with: `id`, `bill_id` (FK), `supplier_id` (FK), `status` (pending/approved/rejected/processing/settled), `fee_amount`, `fee_percentage`, `requested_at`, `approved_at`, `processed_at`, `settled_at`, `rejection_reason`, `eligibility_snapshot` (JSON).

### Q8: [Performance] With 5-6K bills/day, what is the expected volume of express pay requests?
**Answer:** The spec targets >20% adoption among eligible suppliers within 6 months. Not all bills will be eligible (must be approved, meet thresholds). **Assumption:** Express pay requests would be 5-10% of daily approved bills initially (250-600 requests/day at peak), growing to 20% (1,000-1,200/day). The priority queue needs to handle this volume within the <48 hour SLA.

### Q9: [Compliance] Are there aged care regulatory implications for accelerated supplier payments?
**Answer:** Under Support at Home, providers must demonstrate responsible financial management. Express Pay is a supplier relationship management tool, not a care delivery feature. **Assumption:** No specific SAH regulatory barrier exists, but finance leadership approval (listed as dependency) should cover compliance review.

### Q10: [Edge Case] What happens with concurrent express pay requests from the same supplier for different invoices?
**Answer:** FR-007 enforces daily/weekly caps on total express payment value. If a supplier requests express pay for 5 invoices totaling $50K and the daily cap is $20K, the system should process the first requests up to the cap and queue the remainder. The spec should clarify whether partial fulfillment is supported or if the entire batch is rejected when it exceeds the cap.

## Refined Requirements

1. **New AC for US1**: Given a supplier has already reached the daily express pay cap, When they request express pay for another invoice, Then the system informs them of the cap and estimated next available processing date.

2. **New AC for US2**: Given a finance administrator updates eligibility criteria, When the changes are saved, Then existing pending express pay requests are NOT re-evaluated retroactively (only new requests use updated criteria).

3. **NFR**: Express pay requests must be processed within 5 minutes of submission (eligibility evaluation and queue placement, not settlement).
