---
title: "Feature Specification: Voluntary Contributions Approval & Reconciliation Dashboard"
---

> **[View Mockup](/mockups/collections-v2/index.html)**{.mockup-link}


**Feature Branch**: `TP-2285-vc-approval-dashboard`
**Created**: 2026-01-16
**Status**: Draft
**Epic**: TP-2285-COL2 | Budgets And Services Initiative
**Priority**: P0 - Ship Next Week

---

## User Flow Diagram

See [user-flow.txt](./user-flow.txt) for comprehensive visual flow diagrams covering:
- Care Partner adds VC funding to budget
- Finance approves VC funding stream
- Finance reconciles VC with AR invoices
- MYOB AR invoice sync (automated)
- Edge case flows (permission changes, sync failures, multiple invoices)

## UI Design Decisions

See [mockups/](./mockups/) for detailed mockup variations and analysis.

**VC Approval Dashboard**: Table UI (Option A)
- Leverages existing table component (filtering, multi-select, CSV export)
- Inline approval actions
- Supports bulk operations

**VC Reconciliation Dashboard**: Table UI with Payment-Level Records
- Unique records: AR Invoice Payments (child records of AR Invoices)
- Supports partial payments tracking
- Grouped/nested display of payments per invoice

---

## Clarifications

### Session 2026-01-16

- Q: Which Finance role approves VC funding streams? → A: Finance payable managers
- Q: Can VC approval be bulk-approved or must be individual? → A: Bulk approval supported via table multi-select (standard table UI pattern)
- Q: What happens to bills on hold after VC approval? → A: Automatic release - Bills that triggered the VC funding stream have a direct association to the AR invoice. When the AR invoice is marked as fully paid, the system automatically approves those bills for payment. Bills remain on hold if they have other non-compliant reasons beyond missing VC funding.
- Q: What notification mechanism for Finance when VC funding streams are added? → A: No notifications - Finance goes directly to the approval table to manage work. Notifications would be information overload.

---

## User Scenarios & Testing

### User Story 1 - Finance Approves VC Funding Stream (Priority: P0)

A Finance payable manager receives notification that a new Voluntary Contribution funding stream has been added to a care package. Bills are currently on hold pending approval. The manager reviews the VC details and approves the funding stream, unblocking the bills for invoicing.

**Why this priority**: Immediate business blocker - bills cannot be invoiced until VC funding streams are approved by Finance.

**Independent Test**: Can be fully tested by a Finance payable manager viewing pending VC funding streams and toggling approval.

**Acceptance Scenarios**:

1. **Given** a new VC funding stream is added to a package, **When** Finance payable manager views the VC dashboard, **Then** they see the pending VC funding stream with package details, amount, and period
2. **Given** a pending VC funding stream is displayed, **When** Finance payable manager clicks "Approve", **Then** the funding stream status changes to "Approved" and becomes available for invoicing
3. **Given** multiple pending VC funding streams exist, **When** Finance payable manager views the dashboard, **Then** they see all pending items sorted by most recent first
4. **Given** a VC funding stream is approved, **When** Finance payable manager views the dashboard again, **Then** the approved item is removed from the pending list or marked as approved
5. **Given** a Finance payable manager lacks the approval permission, **When** they attempt to access the VC approval dashboard, **Then** they see an access denied message

---

### User Story 2 - Finance Reconciles VC with AR Invoices (Priority: P0)

A Finance team member performs daily reconciliation by viewing all VC funding streams alongside their related AR invoices. They need to quickly identify which VC funds have been invoiced, which are pending payment, and which have been paid.

**Why this priority**: Essential for daily/weekly financial reconciliation and audit trail.

**Independent Test**: Can be fully tested by a Finance user viewing the VC index with linked AR invoice status.

**Acceptance Scenarios**:

1. **Given** VC funding streams exist with linked AR invoices, **When** Finance user views the VC reconciliation dashboard, **Then** they see each VC funding stream with its related AR invoice number, status, and amount
2. **Given** a VC funding stream has an unpaid AR invoice, **When** Finance user views the dashboard, **Then** they see the invoice status as "Unpaid" with due date
3. **Given** a VC funding stream's AR invoice has been paid, **When** Finance user views the dashboard, **Then** they see the invoice status as "Paid" with payment date
4. **Given** multiple VC funding streams exist across multiple packages, **When** Finance user views the dashboard, **Then** they can filter by package, date range, or approval status
5. **Given** a VC funding stream has no linked AR invoice yet, **When** Finance user views the dashboard, **Then** they see "Not Yet Invoiced" status

---

### User Story 3 - Finance Views VC Funding History (Priority: P1)

A Finance manager needs to review historical VC funding streams for a specific package to understand funding patterns and support budget planning discussions.

**Why this priority**: Supports audit, reporting, and strategic planning conversations.

**Independent Test**: Can be fully tested by a Finance user viewing VC history for a specific package.

**Acceptance Scenarios**:

1. **Given** a package has historical VC funding streams, **When** Finance user selects the package, **Then** they see all VC funding streams (approved and pending) sorted by date
2. **Given** a Finance user is viewing VC history, **When** they want to export data, **Then** they can download a CSV/Excel report of VC funding streams
3. **Given** a Finance user views a specific VC funding stream, **When** they click for details, **Then** they see who added it, when, approval timestamp, and related invoice details

---

### User Story 4 - Care Partner Adds VC to Budget (Priority: P1)

A care partner realizes a consumer needs Voluntary Contribution funding added to their budget for the current or previous quarter. They add the VC funding stream, which appears in the Finance approval table for processing.

**Why this priority**: Enables the workflow that creates VC funding streams requiring approval.

**Independent Test**: Can be fully tested by a care partner adding VC funding to a budget and verifying it appears in Finance approval table.

**Acceptance Scenarios**:

1. **Given** a care partner has budget editing access, **When** they add a VC funding stream to a package budget, **Then** the VC is saved with status "Pending Approval"
2. **Given** a care partner adds a VC funding stream, **When** they submit the change, **Then** the VC appears in the Finance approval table
3. **Given** a care partner views a budget with pending VC, **When** the VC is not yet approved, **Then** they see a status indicator showing "Pending Finance Approval"
4. **Given** a care partner adds VC for a previous quarter, **When** they submit, **Then** the system allows retroactive VC addition

---

### Edge Cases

- What happens when Finance rejects a VC funding stream instead of approving? [NEEDS CLARIFICATION: Is rejection in scope for V1?]
- What happens when a VC funding stream is edited after approval? (Requires re-approval)
- What happens when Finance approval permission is removed from a user mid-session? (Access denied on next action)
- What happens when MYOB sync fails and AR invoice status is stale? (Show "last synced" timestamp, manual refresh option)
- What happens when a VC funding stream has multiple AR invoices linked? (Display all related invoices)

---

## Requirements

### Functional Requirements

**VC Approval Dashboard**

- **FR-001**: System MUST display all pending VC funding streams requiring Finance approval
- **FR-002**: System MUST show VC funding stream details: package name, consumer name, amount, period (quarter/year), date added, added by (user)
- **FR-003**: System MUST provide an "Approve" action for Finance payable managers with approval permission
- **FR-004**: System MUST update VC funding stream status to "Approved" when approval action is taken
- **FR-005**: System MUST record approval timestamp and approver user ID for audit trail
- **FR-006**: System MUST restrict VC approval actions to users with FINANCE_APPROVE_VC permission
- **FR-007**: System MUST remove approved VC funding streams from the pending approval list (or mark as approved)
- **FR-008**: System MUST create a direct association between bills and their triggering AR invoice when VC funding stream is created
- **FR-009**: System MUST automatically release bills for payment when their associated AR invoice is marked as fully paid
- **FR-010**: System MUST NOT release bills that have other on-hold reasons beyond missing VC funding (e.g., non-compliance issues)

**VC Reconciliation Dashboard**

- **FR-011**: System MUST display AR invoice payments as unique records in reconciliation table
- **FR-012**: System MUST link VC funding streams to Accounts Receivable invoices and their child payment records from MYOB
- **FR-013**: System MUST display AR invoice number, payment reference, payment amount, payment date, payment method for each payment record
- **FR-014**: System MUST show invoice status derived from payments (Not Yet Invoiced, Partially Paid, Fully Paid)
- **FR-015**: System MUST sync AR invoice and payment data from MYOB (hourly sync target, manual refresh available)
- **FR-016**: System MUST support partial payment tracking (multiple payments per invoice)
- **FR-017**: System MUST allow filtering by package, date range, approval status, invoice status, and payment status
- **FR-018**: System MUST display "last synced" timestamp for AR invoice data
- **FR-019**: System MUST provide export functionality for payment records (CSV or Excel format)
- **FR-020**: System MUST show summary metrics: total VC approved, total invoiced, total paid (aggregated from payments)
- **FR-021**: System MUST support table features: sorting, filtering, multi-select, bulk export

**Budget Editing for VC**

- **FR-022**: System MUST allow care partners to add VC funding streams to current quarter budgets
- **FR-023**: System MUST allow care partners to add VC funding streams to previous quarter budgets (retroactive)
- **FR-024**: System MUST set VC funding stream status to "Pending Approval" when added by care partner
- **FR-025**: System MUST prevent VC funding streams from being used in invoicing until approved by Finance
- **FR-026**: System MUST display approval status in budget view for care partners

### Key Entities

- **VC Funding Stream**: Represents a Voluntary Contribution added to a package budget (package reference, amount, period/quarter, status: Pending/Approved, added by user ID, added timestamp, approved by user ID, approved timestamp)
- **AR Invoice**: Synced from MYOB, linked to VC funding stream (invoice number, VC funding stream ID, invoice amount, due date, status: derived from payments)
- **AR Invoice Payment**: Child record of AR Invoice, unique reconciliation record (payment ID, AR invoice ID, payment reference, payment amount, payment date, payment method, MYOB sync timestamp) - **Primary reconciliation entity**
- **Bill-to-Invoice Association**: Links bills that triggered the VC workflow to their related AR invoice (bill ID, AR invoice ID, created timestamp) - enables automatic bill release when invoice is paid
- **VC Approval Log**: Audit log for all VC approvals (VC funding stream ID, action: Approved/Rejected, approver user ID, timestamp, notes)

---

## Success Criteria

### Measurable Outcomes

- **SC-001**: Finance payable managers can approve pending VC funding streams in under 30 seconds per item
- **SC-002**: Zero bills remain blocked due to pending VC approvals for more than 24 hours after approval dashboard launch
- **SC-003**: Finance team completes daily reconciliation in 50% less time (target: under 15 minutes for 50+ VC funding streams)
- **SC-004**: 100% of VC funding streams have complete audit trail (added by, approved by, timestamps)
- **SC-005**: Care partners can add retroactive VC funding to previous quarters without manual workarounds

---

## Assumptions

- MYOB remains the source of truth for AR invoice status and payment tracking
- MYOB code 2480 is the correct GL code for VC invoicing and payment tracking
- Finance payable managers have clarity on VC approval criteria (amount thresholds, eligibility rules)
- Care partners understand when VC funding is appropriate vs other funding types
- MYOB API/webhooks are available for AR invoice payment sync
- Package-level permissions system supports Finance-specific approval permissions

---

## Dependencies

- **MYOB Integration (API-014)**: Must support AR invoice linkage and payment status sync via webhook or polling
- **Collections V1 (TP-2329)**: AR invoice visibility foundation and permission system
- **Budget V2**: Package budget editing capability and funding stream data model
- **Permission System**: FINANCE_APPROVE_VC permission must be defined and assignable

---

## Scope Boundaries

### In Scope

- Finance dashboard to approve pending VC funding streams
- VC reconciliation dashboard showing VC funding streams + linked AR invoices
- Care partner ability to add VC funding to current and previous quarter budgets
- Audit trail for VC approvals (who approved, when)
- Export VC funding stream data for reporting
- Filter and search VC funding streams by package, date, status

### Out of Scope

- VC rejection workflow (approve-only for V1)
- Automated VC approval based on rules/thresholds
- VC funding stream editing after approval (requires new workflow)
- Payment processing within portal
- PDF invoice retrieval or download
- Direct Debit setup triggered by VC addition (deferred to later sprint)
- Email reminders for pending VC approvals

### Future Considerations

- **VC Rejection**: Allow Finance to reject VC funding streams with reason notes (requires notification back to care partner)
- **Automated Approval Rules**: Auto-approve VC funding streams under certain thresholds or conditions
- **DD Trigger on VC Addition**: Automatically prompt Direct Debit authorization forms when VC funding stream is approved
- **Bulk Approval**: Allow Finance to approve multiple VC funding streams at once
- **VC Funding Stream Templates**: Pre-defined VC amounts/periods for common scenarios

## Clarification Outcomes

### Q1: [Dependency] This epic depends on Collections V1 (TP-2329) for AR invoice visibility and the permission system. Is V1 complete, or is there a risk of V2 being blocked?
**Answer:** V1 is listed as Draft status, meaning it is not yet delivered. V2 is marked P0 ("Ship Next Week"), creating a timing tension. Codebase evidence: there is no `domain/Collection/` directory or AR invoice model yet, confirming V1 has not been built. V2's dependency on V1 is real — the AR invoice sync, permission system, and data tables must exist before V2 can build approval and reconciliation on top. Recommendation: V1 Phase 1 (AR invoice visibility) must be the immediate priority. V2 can begin design work in parallel but cannot ship until V1's core data layer is live.

### Q2: [Scope] The "Out of Scope" says VC rejection is not in V1, but Key Entities include a VC Approval Log with "Rejected" as a valid action. Is rejection supported or not?
**Answer:** This is a spec inconsistency. The out-of-scope section says "VC rejection workflow (approve-only for V1)" but the `VCApprovalLog` entity lists `action: Approved/Rejected`. Resolution: for V1 of COL2, implement approve-only. The data model should include "Rejected" in the enum to avoid a future migration, but the UI should only expose the "Approve" action. The "Rejected" log entry can be used for future rejection workflow. This is consistent with the pattern of forward-compatible data models.

### Q3: [Edge Case] FR-009 auto-releases bills when AR invoice is fully paid. What is the latency between MYOB payment recording and Portal auto-release?
**Answer:** This depends on the sync mechanism. The FRR spec defines webhook-based MYOB sync with <2 second P95 latency for adjustment events. If COL2 uses the same webhook infrastructure, bill auto-release would occur within seconds of MYOB payment confirmation. If using polling (hourly sync from V1), latency could be up to 1 hour. Recommendation: use webhooks for payment status changes (sharing infrastructure with FRR) to minimize the window. The `BillMarkedAsPaidEvent` already exists in `domain/Bill/EventSourcing/Events/BillMarkedAsPaidEvent.php` — the auto-release should listen for a similar payment confirmation event on the AR invoice side. There is no risk of premature release if the webhook only fires on `closed` MYOB status (confirmed payment).

### Q4: [Data] How are partial payments handled in the MYOB data model? Can a single AR invoice have payments from multiple sources?
**Answer:** The spec explicitly addresses this: "Unique records: AR Invoice Payments (child records of AR Invoices). Supports partial payments tracking." MYOB does support multiple payment records per invoice from different sources (DD, bank transfer, cash, etc.). The data model correctly separates AR Invoices (parent) from AR Invoice Payments (children). Invoice status should be derived: sum of all payment amounts vs invoice amount determines Partially Paid / Fully Paid. The reconciliation table correctly uses payments as primary records.

### Q5: [Integration] Should MYOB webhook infrastructure be shared with FRR?
**Answer:** Yes, strongly recommended. The FRR spec (`domain/MyobAdjustment/`) already has established MYOB webhook processing patterns (`SyncMyobAdjustment`, `OvernightGetMyobAdjustmentsAction`). Building a second webhook handler for AR invoice payments would duplicate infrastructure. Recommendation: create a shared MYOB webhook dispatcher that routes different event types (adjustments -> FRR, payment status changes -> COL2) to their respective handlers. This follows the existing `domain/Myob/` shared infrastructure pattern.

### Q6: [Permissions] What is the FINANCE_APPROVE_VC permission and where does it fit in the permission hierarchy?
**Answer:** The permission system uses config-based permission lists (`config/permissions/organisation-permission-list.php`). FINANCE_APPROVE_VC would need to be added as a new permission. The spec says "Finance payable managers" have this permission. The existing role system in the codebase supports granular permissions. Recommendation: add FINANCE_APPROVE_VC to the organisation permission list and assign it to the appropriate finance role.

### Q7: [Scope] FR-022-FR-026 describe care partner budget editing for VC. This overlaps with VCE (Voluntary Contributions Enhancements). Should VC budget editing live in COL2 or VCE?
**Answer:** This is a significant scope overlap. VCE US1-US2 cover care partner VC editing and verification workflows. COL2 US4 also covers care partner adding VC to budgets. Recommendation: the care partner VC workflow should live in VCE (which is the VC-specific epic), and COL2 should focus exclusively on the Finance approval and reconciliation dashboards. COL2 FR-022 through FR-026 should reference VCE as the implementation owner and consume VC funding stream data rather than implementing the editing workflow.

### Q8: [Data] The bill-to-invoice association (FR-008) — how is this association created?
**Answer:** When a VC funding stream is created on a budget and bills are generated against it, the system needs to link those bills to the AR invoice that the VC funding stream triggers. This association must be created at bill generation time (when the bill references a VC funding stream) or at AR invoice creation time in MYOB. The linking mechanism needs design — it is not currently implemented in the codebase.

### Q9: [UX] The reconciliation dashboard shows payment-level records. Could the volume be overwhelming for Finance?
**Answer:** With filtering by package, date range, approval status, and invoice status (FR-017), plus bulk export (FR-019), the table UI should handle typical volumes. The spec estimates "50+ VC funding streams" for daily reconciliation. With multiple payments per invoice, this could be 100-200 payment records. Table pagination and filtering make this manageable.

### Q10: [Compliance] Is there an audit requirement for VC approvals beyond the approval log?
**Answer:** The spec defines FR-005 (approval timestamp and approver user ID). The existing `LogsActivity` trait pattern in the codebase provides automatic audit logging. The VC Approval Log entity provides dedicated audit data. For compliance, recommendation: ensure the approval log is immutable (no soft deletes) and includes the full VC configuration snapshot at approval time.

## Refined Requirements

- **FR-REFINED-001**: COL2 SHOULD share MYOB webhook infrastructure with FRR rather than building a parallel webhook handler. A shared dispatcher pattern is recommended.
- **FR-REFINED-002**: The VC Approval Log data model SHOULD include "Rejected" as a valid action enum value for forward compatibility, even though the V1 UI only exposes "Approve."
- **FR-REFINED-003**: Care partner VC budget editing (FR-022 through FR-026) SHOULD be deferred to or coordinated with VCE to avoid duplicate implementation. COL2 should consume VC data rather than implement the editing workflow.
- **FR-REFINED-004**: The bill-to-AR-invoice association mechanism (FR-008) needs explicit design — the linking path between Portal bills, VC funding streams, and MYOB AR invoices is not currently defined in the codebase.
