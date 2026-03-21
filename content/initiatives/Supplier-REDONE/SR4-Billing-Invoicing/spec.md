---
title: "Feature Specification: Billing & Invoicing"
---

# Feature Specification: Billing & Invoicing

**Feature Branch**: `sr4-billing-invoicing`
**Created**: 2026-03-19
**Author**: Will Whitelaw
**Status**: Draft
**Dependencies**: SR0, SR2, SR3

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Supplier Creates and Submits a Bill (Priority: P1)

A Supplier Administrator or team member creates a new bill for a recipient. They select the recipient from their assigned assessments, add one or more line items specifying the service type, date of service, units, and rate, then submit the bill for review. The system validates that each line item's service type exists in the recipient's budget and that the rate is within the agreed pricing before allowing submission. If validation issues are found, the supplier sees clear warnings explaining what needs to change before they can submit.

**Why this priority**: This is the core billing workflow. Without it, no other billing feature can function. Every supplier interaction with the portal ultimately leads to getting paid for services delivered.

**Independent Test**: Can be fully tested by logging in as a supplier user, creating a bill with line items against a recipient assessment, and verifying the bill appears in the submitted queue with correct totals.

**Acceptance Scenarios**:

1. **Given** a supplier user with an active assessment for a recipient, **When** they create a new bill and add a line item with a valid service type, date, units, and rate, **Then** the line item is saved with the correct total calculated (units x rate) and linked to the recipient's budget.
2. **Given** a supplier user adding a line item with a service type that is not in the recipient's budget, **When** they attempt to save the line item, **Then** the system displays a clear warning: "This service type is not included in [Recipient]'s current budget. The bill may be rejected."
3. **Given** a supplier user adding a line item with a rate that exceeds the agreed supplier pricing for that service type, **When** they attempt to save, **Then** the system warns: "The rate ($X) exceeds the agreed rate ($Y) for this service type."
4. **Given** a supplier user with a complete bill (at least one valid line item), **When** they submit the bill, **Then** the bill status changes to "Submitted", a confirmation is shown, and the operations team is notified.
5. **Given** a supplier user who has started a bill but not yet submitted it, **When** they return to the portal later, **Then** the draft bill is preserved and they can continue editing or discard it.
6. **Given** a supplier user on a mobile device, **When** they complete the full bill creation and submission flow, **Then** the experience is fully functional via the API without any dependency on a desktop browser session.

---

### User Story 2 - Operations Staff Reviews and Processes a Submitted Bill (Priority: P1)

An operations team member (bill processor) reviews submitted bills. They can see all line items, the validation results (budget match, rate check, supplier verification), and any flags. They approve, reject, or place the bill on hold with a structured reason. For bills that pass all automated checks, the processor can approve with a single action.

**Why this priority**: The review and approval step is the counterpart to submission — bills cannot be paid without processing. This story is co-dependent with Story 1.

**Independent Test**: Can be tested by submitting a bill as a supplier, then logging in as an operations user and processing it through to approval or rejection.

**Acceptance Scenarios**:

1. **Given** an operations user viewing a submitted bill, **When** they open the bill, **Then** they see all line items with their service types, dates, units, rates, totals, and automated validation results (budget match status, rate comparison, supplier ABN verification).
2. **Given** a bill where all line items pass automated validation, **When** the operations user approves the bill, **Then** the bill status changes to "Approved", funding consumption records are created, and the supplier is notified.
3. **Given** a bill with a line item that fails validation, **When** the operations user rejects the bill, **Then** they must select a rejection reason from a structured list and optionally add a note. The supplier receives a notification with the specific reason and guidance on resubmission.
4. **Given** an operations user processing bills, **When** they view the processing queue, **Then** bills are sorted by submission date with the oldest first, and they can filter by supplier, recipient, status, and validation flags.
5. **Given** an operations user who has been assigned a set of bills, **When** they complete processing one bill, **Then** the system automatically presents the next bill in their assigned queue.

---

### User Story 3 - On-Hold Bill Tracking and Resolution (Priority: P1)

When a bill cannot be immediately approved or rejected — for example, missing supporting documentation, a budget query pending with the recipient, or a dispute about services delivered — the operations team places it on hold with a structured reason. The supplier can see that their bill is on hold, why, and what action (if any) is needed from them. Operations staff can resolve on-hold bills by approving, rejecting, or writing them off with a documented reason.

**Why this priority**: On-hold bills are a major pain point. Without structured tracking, they accumulate indefinitely with no resolution path. This directly affects supplier cash flow and trust.

**Independent Test**: Can be tested by placing a bill on hold with a reason, verifying the supplier sees the hold reason, then resolving the bill through approval or write-off.

**Acceptance Scenarios**:

1. **Given** an operations user reviewing a submitted bill, **When** they place the bill on hold, **Then** they must select a hold reason from a structured list (missing documentation, budget query, recipient dispute, supplier query, other) and optionally add a note.
2. **Given** a supplier user with a bill on hold, **When** they view their bills, **Then** they see the hold reason, when it was placed on hold, and any action required from them (e.g., "Please upload the signed service agreement").
3. **Given** an operations user resolving an on-hold bill, **When** they choose to write off the bill, **Then** they must provide a write-off reason, the write-off requires approval from a senior processor, and the supplier is notified of the outcome.
4. **Given** a bill that has been on hold for more than 14 days, **When** an operations user views their dashboard, **Then** the bill is flagged as overdue with the number of days on hold highlighted.
5. **Given** a supplier user with an on-hold bill that requires their action, **When** they upload the requested documentation or respond to the query, **Then** the bill is automatically returned to the processing queue for review.

---

### User Story 4 - Batch Bill Processing (Priority: P2)

An operations team member can process multiple bills at once. They select a batch of bills that share common characteristics (same supplier, same service type, all passing validation) and approve or reject them in a single action. The system applies the same decision to all bills in the batch and records individual audit trails for each.

**Why this priority**: Reduces processing time for the operations team. Depends on the core review workflow (Story 2) being in place. High value for operational efficiency but not blocking supplier submission.

**Independent Test**: Can be tested by submitting multiple bills from the same supplier, then batch-approving them and verifying all are approved with individual audit records.

**Acceptance Scenarios**:

1. **Given** an operations user viewing the processing queue, **When** they select multiple bills, **Then** they can apply a bulk action (approve all, reject all with a shared reason, place all on hold with a shared reason).
2. **Given** an operations user batch-approving 10 bills, **When** the batch action completes, **Then** each bill has its own approval record with the timestamp, approver, and method ("batch approved") recorded.
3. **Given** an operations user attempting to batch-approve bills where some fail validation, **When** the batch action is triggered, **Then** the system warns that N bills have validation issues and offers to approve only the passing bills or cancel the batch.
4. **Given** an operations user, **When** they filter the queue by supplier and validation status, **Then** they can quickly identify and select batches of straightforward bills for bulk processing.

---

### User Story 5 - Automated Bill Validation and Auto-Approval (Priority: P2)

Bills that meet all automated validation criteria — the supplier is verified, the service type is in the recipient's budget, the rate matches agreed pricing, no duplicate bill is detected, and the total is within a configurable threshold — are automatically approved without manual review. Operations staff are notified of auto-approved bills and can review or reverse them if needed.

**Why this priority**: The single highest-impact efficiency improvement for the operations team. Depends on reliable validation rules from Stories 1-2 being proven in production first.

**Independent Test**: Can be tested by submitting a bill that meets all auto-approval criteria and verifying it is approved without manual intervention within the expected timeframe.

**Acceptance Scenarios**:

1. **Given** a submitted bill where all line items pass validation (service type in budget, rate within tolerance, supplier verified, no duplicate detected, total under threshold), **When** the automated validation runs, **Then** the bill is automatically approved and the supplier is notified of approval.
2. **Given** a submitted bill where one line item fails any validation check, **When** the automated validation runs, **Then** the bill is routed to the manual review queue with the specific failure flagged.
3. **Given** an auto-approved bill, **When** an operations user reviews the auto-approval log, **Then** they can see which validation rules were checked, the result of each, and can reverse the approval if needed.
4. **Given** an operations user configuring auto-approval rules, **When** they set the maximum auto-approval amount to $500, **Then** only bills with a total at or below $500 are eligible for auto-approval — bills above this threshold always go to manual review.

---

### User Story 6 - Express Pay for Verified Suppliers (Priority: P2)

Suppliers who have a strong track record — high approval rate, no recent rejections, verified ABN and bank details, and a minimum number of processed bills — qualify for Express Pay. Express Pay bills that pass automated validation are approved and queued for payment on the next payment run, reducing payment turnaround from the standard cycle to within 5 business days.

**Why this priority**: A strong retention incentive for reliable suppliers. Depends on auto-approval (Story 5) and the supplier verification status from SR2.

**Independent Test**: Can be tested by submitting a bill from an Express Pay-eligible supplier, verifying it is auto-approved, and confirming it is included in the next payment run.

**Acceptance Scenarios**:

1. **Given** a supplier with an approval rate above 95%, no rejections in the last 90 days, verified bank details, and more than 20 processed bills, **When** they view their supplier dashboard, **Then** they see an "Express Pay" badge indicating their eligibility.
2. **Given** an Express Pay supplier submitting a bill that passes all automated validation, **When** the bill is auto-approved, **Then** it is flagged for the next payment run and the supplier sees an estimated payment date.
3. **Given** a supplier who previously qualified for Express Pay but has a bill rejected, **When** their approval rate drops below the threshold, **Then** Express Pay status is revoked and they are notified with the reason.
4. **Given** an operations user, **When** they view the Express Pay configuration, **Then** they can adjust eligibility thresholds (minimum approval rate, minimum bill count, lookback period) without code changes.

---

### User Story 7 - AI Invoice Extraction (Priority: P3)

A supplier uploads an invoice document (PDF or image) when creating a bill. The system uses AI document reading to extract line items — service descriptions, dates, quantities, rates, and totals — and pre-populates the bill creation form. The supplier reviews the extracted data, corrects any errors, and submits. This replaces manual data entry for the majority of invoice submissions.

**Why this priority**: High user value but depends on an external AI integration and all core billing flows being stable. The manual creation flow (Story 1) must work first as the fallback.

**Independent Test**: Can be tested by uploading a sample invoice PDF and verifying that the extracted line items appear pre-populated in the bill creation form with reasonable accuracy.

**Acceptance Scenarios**:

1. **Given** a supplier user creating a new bill, **When** they upload an invoice document (PDF or image), **Then** the system extracts line items and pre-populates the form fields (service description, date, units, rate, total) within 30 seconds.
2. **Given** extracted invoice data, **When** the supplier reviews the pre-populated form, **Then** each field is editable and clearly marked as "AI-extracted — please verify". The supplier must confirm each line item before submission.
3. **Given** an uploaded invoice where the AI cannot extract a field with confidence, **When** the form is pre-populated, **Then** the uncertain field is left blank with a note: "Could not extract — please enter manually."
4. **Given** a supplier who uploads an invoice in an unsupported format, **When** the upload is processed, **Then** the system informs them of supported formats and allows them to proceed with manual entry.
5. **Given** an uploaded invoice, **When** the AI extraction completes, **Then** the original document is stored and linked to the bill as supporting documentation.

---

### User Story 8 - Supplier Views Bill History and Payment Status (Priority: P1)

A supplier user can view all their bills — draft, submitted, in review, approved, paid, rejected, and on hold — with filtering and search. For each bill, they see the current status, line item details, any review feedback, and payment information (date paid, payment reference). This gives suppliers full visibility into their billing history and cash flow.

**Why this priority**: Suppliers need visibility into their payment pipeline. Without this, they call support to ask "where is my payment?" — this is one of the highest-volume support queries.

**Independent Test**: Can be tested by creating bills in various statuses and verifying the supplier can view, filter, and inspect each one with correct details.

**Acceptance Scenarios**:

1. **Given** a supplier user, **When** they navigate to their bill history, **Then** they see all bills for their active supplier entity listed with status, recipient name, submission date, total amount, and current status.
2. **Given** a supplier user with bills in multiple statuses, **When** they filter by status (e.g., "On Hold"), **Then** only bills matching that status are displayed.
3. **Given** a supplier user viewing a rejected bill, **When** they open the bill details, **Then** they see the rejection reason, reviewer notes, and a clear option to create a corrected resubmission (pre-populated with the original bill data).
4. **Given** a supplier user viewing a paid bill, **When** they open the bill details, **Then** they see the payment date, payment reference number, and payment method.
5. **Given** a supplier user with access to multiple supplier entities (Organisation Administrator), **When** they switch supplier context, **Then** the bill history updates to show only bills for the selected supplier entity.

---

### Edge Cases

- What happens when a supplier submits a bill for a recipient whose assessment has expired since the service was delivered? The system should accept the bill with a warning flag for the reviewer — services may have been legitimately delivered before expiry.
- What happens when a supplier submits a bill and the recipient's budget is subsequently reduced below the bill amount? The bill remains in its current state; budget changes do not retroactively affect submitted bills. The reviewer is warned of the budget shortfall.
- What happens when a bill is partially valid — some line items pass validation and others fail? The supplier can submit the bill with warnings. The reviewer can approve valid line items and reject others (partial approval).
- How does the system handle duplicate bill detection? Bills are checked against existing submissions for the same supplier, recipient, service date, and service type. Potential duplicates are flagged for reviewer attention but not blocked — genuine re-submissions (e.g., after correction) are valid.
- What happens when the AI extraction returns completely incorrect data for an invoice? The supplier sees the pre-populated data and can clear all extracted fields to enter manually. The extraction confidence score is logged for model improvement.
- What happens when a supplier's bank details change between bill submission and payment? The payment uses the bank details on record at the time of payment processing, not at submission. If bank details changed, the supplier is notified before payment.
- What happens when Express Pay status is revoked while bills are in the Express Pay pipeline? Bills already approved continue to payment. Only new submissions lose Express Pay treatment.
- How does the system handle bills from suppliers with multiple supplier entities under one organisation? Each bill is scoped to a specific supplier entity. An Organisation Administrator can view bills across all entities but cannot mix line items from different entities in a single bill.
- The existing bill domain (models, event sourcing aggregates, Nova resources, operations Inertia views) continues to function during and after SR4. The v2 API layer is additive — it does not replace or break the existing bill processing workflow. New supplier-entity scoping is achieved by adding a `supplier_entity_id` foreign key to the existing `bills` table rather than creating parallel tables.

## Requirements *(mandatory)*

### Functional Requirements

#### Bill Creation & Submission

- **FR-001**: System MUST expose bill creation, editing, submission, and retrieval via the v2 API with token-based authentication, supporting both web and mobile clients.
- **FR-002**: System MUST allow suppliers to create bills against recipient assessments, with each line item linked to a service type, date of service, units, and rate.
- **FR-003**: System MUST validate each line item against the recipient's current budget at the time of submission and display clear warnings when the service type is not in the budget.
- **FR-004**: System MUST validate line item rates against the supplier's agreed pricing and warn when the rate exceeds the agreed amount.
- **FR-005**: System MUST support bill statuses: Draft, Submitted, In Review, Approved, Paid, Rejected, and On Hold.
- **FR-006**: System MUST preserve draft bills so suppliers can return and continue editing before submission.
- **FR-007**: System MUST detect potential duplicate bills (same supplier, recipient, service date, service type) and flag them for reviewer attention without blocking submission.
- **FR-008**: System MUST scope all bills to the active supplier entity within the two-tier organisation model — a bill belongs to one supplier entity, not the organisation.
- **FR-038**: System MUST enforce the following bill status transitions. Supplier-initiated: Draft to Submitted. Operations-initiated: Submitted to In Review, In Review to Approved / Rejected / On Hold, On Hold to Approved / Rejected / Written Off, Approved to Paid. No other transitions are valid. Suppliers cannot withdraw or cancel a bill after submission — they must contact operations.
- **FR-041**: Bill creation and submission via the v2 API MUST be atomic — the bill header and all line items are sent in a single request. The standard SR0 rate limit (60 req/min) applies with no special billing-specific rate limit bucket. Maximum line items per bill is capped at 100 to prevent payload abuse. Bulk multi-bill submission endpoints are out of scope for SR4.

#### Bill Processing & Review

- **FR-009**: System MUST provide a processing queue for operations staff showing submitted bills sorted by submission date, with filtering by supplier, recipient, status, and validation flags.
- **FR-010**: System MUST display automated validation results (budget match, rate comparison, supplier verification, duplicate check) alongside each bill during review.
- **FR-011**: System MUST require a structured rejection reason from a predefined list when a bill is rejected, with optional reviewer notes.
- **FR-012**: System MUST notify suppliers of bill status changes (submitted, approved, rejected, on hold, paid) with specific details (rejection reason, hold reason, payment reference).
- **FR-040**: System MUST deliver bill status notifications via two channels: (1) in-app notifications visible in the supplier portal, and (2) email notifications for critical status changes (approved, rejected, on hold, paid). Email notifications MUST include the bill reference number, new status, reason where applicable, and a link to view the bill. Push notifications are out of scope for SR4.
- **FR-013**: System MUST support partial bill approval — individual line items can be approved or rejected independently within a single bill.
- **FR-039**: When a bill is partially approved (some line items approved, others rejected), the bill status moves to "Approved" with its total adjusted to reflect only the approved line items. Each rejected line item carries its own rejection reason. The supplier is notified of both the approved amount and the rejected line items with reasons, and can create a new bill for the rejected items.
- **FR-014**: System MUST record an audit trail for every bill status change including the user, timestamp, reason, and method (manual or automated).

#### On-Hold Bills

- **FR-015**: System MUST require a structured hold reason from a predefined list when a bill is placed on hold: missing documentation, budget query, recipient dispute, supplier query, other.
- **FR-016**: System MUST make hold reasons and required actions visible to the affected supplier.
- **FR-017**: System MUST support a write-off workflow for on-hold bills requiring senior processor approval with a documented reason.
- **FR-018**: System MUST flag on-hold bills that exceed 14 days as overdue and surface them on the operations dashboard.
- **FR-019**: System MUST automatically return a bill to the processing queue when a supplier responds to an on-hold action (e.g., uploads requested documentation).

#### Batch Processing & Automation

- **FR-020**: System MUST support batch actions on multiple selected bills: bulk approve, bulk reject (with shared reason), bulk place on hold (with shared reason).
- **FR-021**: System MUST record individual audit trail entries for each bill in a batch action, not a single batch entry.
- **FR-022**: System MUST support automated validation rules that auto-approve bills meeting all criteria: supplier verified, service type in budget, rate within tolerance, no duplicate detected, total at or below configurable threshold.
- **FR-023**: System MUST allow operations staff to configure auto-approval thresholds (maximum amount, rate tolerance percentage) without code changes.
- **FR-024**: System MUST allow operations staff to review and reverse auto-approved bills.

#### Express Pay

- **FR-025**: System MUST calculate Express Pay eligibility based on configurable criteria: minimum approval rate, maximum recent rejections, verified bank details, minimum processed bill count, and lookback period.
- **FR-026**: System MUST display Express Pay status to eligible suppliers on their dashboard.
- **FR-027**: System MUST automatically revoke Express Pay status when a supplier falls below eligibility thresholds and notify the supplier with the reason.
- **FR-028**: System MUST flag auto-approved Express Pay bills for inclusion in the next payment run, targeting payment within 5 business days.

#### AI Invoice Processing

- **FR-029**: System MUST accept invoice document uploads (PDF, PNG, JPG) during bill creation and process them through AI extraction.
- **FR-030**: System MUST pre-populate bill line item fields (service description, date, units, rate, total) from extracted invoice data within 30 seconds of upload.
- **FR-031**: System MUST clearly mark AI-extracted fields and require supplier confirmation before submission — extracted data must not be submitted without review.
- **FR-032**: System MUST leave fields blank when extraction confidence is low rather than pre-populating incorrect data.
- **FR-033**: System MUST store the original uploaded invoice document and link it to the bill as supporting documentation.

#### Bill History & Visibility

- **FR-034**: System MUST provide suppliers with a searchable, filterable view of all their bills across all statuses.
- **FR-035**: System MUST display payment information (date, reference number, method) on paid bills.
- **FR-036**: System MUST allow suppliers to create a corrected resubmission from a rejected bill, pre-populated with the original bill data.
- **FR-037**: System MUST support bill history scoped to the active supplier entity, with Organisation Administrators able to view bills across all their supplier entities.

### Key Entities

- **Bill**: A claim for payment from a supplier for services delivered to a recipient. Contains one or more line items, is scoped to a single supplier entity, and progresses through a defined status lifecycle (Draft, Submitted, In Review, Approved, Paid, Rejected, On Hold). Linked to a recipient assessment and the submitting supplier user.
- **Bill Line Item**: An individual service entry within a bill. Specifies the service type, date of service, units, rate, and total. Linked to a budget item within the recipient's assessment. Can be independently approved or rejected during review.
- **Bill Status**: The current state of a bill in the processing lifecycle. Each transition is recorded with the user, timestamp, and reason. Valid transitions are defined (e.g., Draft can only move to Submitted, Submitted can move to In Review, Approved, Rejected, or On Hold).
- **Hold Reason**: A structured categorisation of why a bill is placed on hold. Drawn from a predefined list with optional free-text notes. Visible to both operations staff and the supplier.
- **Write-Off**: A resolution for an on-hold bill that will not be paid. Requires a documented reason and senior processor approval. Creates a permanent record for audit purposes.
- **Auto-Approval Rule**: A configurable validation rule that determines whether a bill can be automatically approved. Includes thresholds for maximum amount, rate tolerance, and supplier verification requirements.
- **Express Pay Eligibility**: A calculated status for suppliers based on their billing track record. Determines whether their auto-approved bills qualify for fast-track payment. Eligibility is recalculated on each bill processing event.
- **Bill Extraction**: The result of AI document reading on an uploaded invoice. Contains extracted field data, confidence scores per field, and a reference to the original document. Used to pre-populate the bill creation form.
- **Rejection Reason**: A structured categorisation of why a bill is rejected, drawn from a predefined list (service type not in budget, rate exceeds agreement, duplicate submission, invalid assessment, other). Included in supplier notifications.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Suppliers can create and submit a bill from a mobile device via the API, completing the full flow in under 5 minutes for a bill with 3 line items.
- **SC-002**: Bill rejection rate decreases by at least 30% within 3 months of launch, measured by comparing pre-submission validation warnings acted on vs post-submission rejections.
- **SC-003**: 100% of on-hold bills have a structured reason visible to both the operations team and the supplier — zero bills in hold status without a categorised reason.
- **SC-004**: Average bill processing time (submission to approval/rejection) decreases by at least 40% through batch processing and automated validation.
- **SC-005**: Auto-approval handles at least 30% of submitted bills within 6 months, with a false-positive rate (incorrectly auto-approved bills requiring reversal) below 2%.
- **SC-006**: Express Pay suppliers receive payment within 5 business days of bill submission for qualifying bills.
- **SC-007**: AI invoice extraction pre-populates at least 80% of line item fields for standard invoice formats, reducing average data entry time per bill by at least 60%.
- **SC-008**: Supplier support tickets related to "where is my payment" or "why was my bill rejected" decrease by at least 50% within 3 months of launch.
- **SC-009**: Zero data leakage between supplier entities — bills for Supplier Entity A are never visible to users scoped to Supplier Entity B.
- **SC-010**: Every bill status change has a complete audit trail (user, timestamp, reason, method) with zero gaps.

---

## Clarifications

The following questions were identified during spec review and resolved with the recommended option applied. Each clarification has been integrated into the relevant sections above where applicable.

### CQ-1: Bill Status Lifecycle — What are the valid state transitions, and can suppliers or only operations staff trigger them?

**Category**: Functional Scope & Behavior

**Gap**: The spec defines 7 statuses (FR-005) and mentions a Bill Status entity with "valid transitions defined" but never enumerates the allowed transitions or who can trigger each one. Without this, the implementation will have to guess, and different developers may implement different rules.

**Options**:
- (a) Supplier-driven transitions only (Draft to Submitted, Submitted back to Draft for withdrawal). All other transitions operations-only.
- (b) Suppliers can also withdraw Submitted bills back to Draft and cancel On Hold bills themselves.
- (c) Full supplier self-service: suppliers can cancel at any stage before Approved.

**Decision**: Option (a) — simplest and safest. Suppliers can move Draft to Submitted. All other transitions (Submitted to In Review, In Review to Approved/Rejected/On Hold, On Hold to Approved/Rejected/Written Off, Approved to Paid) are operations-only. This avoids race conditions where a supplier withdraws a bill mid-review.

**Applied change** — Added FR-038 below:

- **FR-038**: System MUST enforce the following bill status transitions. Supplier-initiated: Draft to Submitted. Operations-initiated: Submitted to In Review, In Review to Approved / Rejected / On Hold, On Hold to Approved / Rejected / Written Off, Approved to Paid. No other transitions are valid. Suppliers cannot withdraw or cancel a bill after submission — they must contact operations.

### CQ-2: Relationship between the new v2 API billing and the existing Laravel monolith bill domain — coexistence or replacement?

**Category**: Integration & Dependencies

**Gap**: The idea brief mentions "existing bill domain event sourcing patterns maintained" and the codebase already has `Bill`, `BillItem`, `BillService`, `BillPolicy`, and event-sourced aggregate patterns. The spec says nothing about whether SR4 extends the existing domain, creates a parallel v2 domain, or replaces the existing one. This is a critical architecture decision that affects every story.

**Options**:
- (a) Extend the existing Bill model and domain — add v2 API endpoints that read/write the same `bills` and `bill_items` tables and reuse the existing event sourcing aggregates.
- (b) Create a new parallel billing domain (e.g., `SupplierBill`) scoped to the two-tier model, with a sync layer to the existing domain during migration.
- (c) Full replacement — deprecate the existing bill domain and rewrite.

**Decision**: Option (a) — extend the existing domain. The existing Bill model already works for operations staff. Adding supplier-entity scoping (via the two-tier org model from SR0/SR2) and v2 API endpoints on top of the existing domain avoids data migration, preserves the event sourcing history, and lets the operations-side Inertia views continue working unchanged. New columns/relationships are added to the existing tables as needed (e.g., `supplier_entity_id` foreign key on `bills`).

**Applied change** — Added to Edge Cases:

- The existing bill domain (models, event sourcing aggregates, Nova resources, operations Inertia views) continues to function during and after SR4. The v2 API layer is additive — it does not replace or break the existing bill processing workflow. New supplier-entity scoping is achieved by adding a `supplier_entity_id` foreign key to the existing `bills` table rather than creating parallel tables.

### CQ-3: How does partial bill approval (FR-013) affect the bill's overall status and payment?

**Category**: Edge Cases & Failure Handling

**Gap**: FR-013 says line items can be independently approved or rejected, but the spec does not define what happens to the bill as a whole when some line items are approved and others rejected. Does the bill stay "In Review"? Does it split into two bills? What status does the supplier see? What gets paid?

**Options**:
- (a) The bill moves to "Approved" with an adjusted total reflecting only the approved line items. Rejected line items are marked individually with reasons. The supplier sees one bill with mixed line-item statuses.
- (b) The bill is split into two: an approved bill and a rejected bill, each with their own lifecycle.
- (c) The bill stays "In Review" until all line items have a decision, then moves to the majority outcome.

**Decision**: Option (a) — single bill with mixed line-item statuses. Splitting bills (b) creates complexity in audit trails, duplicate detection, and supplier understanding. Keeping one bill with line-item-level decisions is how the existing OHB sub-project works and is simplest for suppliers to understand. The bill total adjusts to reflect only approved line items, and the supplier can resubmit rejected line items as a new bill.

**Applied change** — Added FR-039 below:

- **FR-039**: When a bill is partially approved (some line items approved, others rejected), the bill status moves to "Approved" with its total adjusted to reflect only the approved line items. Each rejected line item carries its own rejection reason. The supplier is notified of both the approved amount and the rejected line items with reasons, and can create a new bill for the rejected items.

### CQ-4: What is the notification delivery mechanism for bill status changes (FR-012)?

**Category**: Non-Functional Quality

**Gap**: FR-012 says suppliers are notified of status changes but does not specify the channel. Email? In-app notification? Push notification via mobile? The answer affects scope significantly — especially since Story 1 AC-6 mentions mobile usage via the API.

**Options**:
- (a) In-app notifications only (visible in the portal when the supplier next logs in), delivered via the existing notification system.
- (b) In-app notifications plus email for critical status changes (approved, rejected, on hold).
- (c) In-app, email, and push notifications (requires mobile push infrastructure).
- (d) Email-only, matching the current system behavior.

**Decision**: Option (b) — in-app plus email for critical changes. In-app notifications are low-cost (the portal already has a notification system) and cover the "where is my payment?" use case for active users. Email for approved/rejected/on-hold ensures suppliers who do not log in daily are still informed. Push notifications (c) require mobile app infrastructure that does not exist yet and are out of scope for SR4. The notification content includes the bill reference number, status, reason (if rejected/on hold), and a deep link to the bill in the portal.

**Applied change** — Updated FR-012 in place and added FR-040:

- **FR-040**: System MUST deliver bill status notifications via two channels: (1) in-app notifications visible in the supplier portal, and (2) email notifications for critical status changes (approved, rejected, on hold, paid). Email notifications MUST include the bill reference number, new status, reason where applicable, and a link to view the bill. Push notifications are out of scope for SR4.

### CQ-5: Rate limit and payload constraints for bill submission via the v2 API — how do the SR0 rate limits (60 req/min) interact with bulk bill creation or large bills?

**Category**: Constraints & Tradeoffs

**Gap**: SR0 defines a 60 req/min rate limit. The spec does not address whether creating a bill with many line items is a single API call or multiple calls (one per line item), nor whether batch submission of multiple bills has special rate limit treatment. A supplier uploading 20 bills with 10 line items each could easily hit the rate limit if each operation is a separate request.

**Options**:
- (a) Single-request bill creation: the entire bill (header + all line items) is created/submitted in one API call. Standard 60 req/min applies. No special batch endpoint.
- (b) Multi-request: separate endpoints for bill creation and line item addition, with a higher rate limit bucket for bill-related endpoints.
- (c) Single-request creation plus a dedicated batch submission endpoint for uploading multiple bills in one call.

**Decision**: Option (a) — single-request bill creation. The bill payload (header + line items) is submitted as one atomic API call. This is simplest, avoids partial-creation states, and means a supplier creating 20 bills uses 20 requests — well within the 60 req/min limit. A bill with 50+ line items is an extreme edge case in aged care (typical bills have 1-10 line items). No batch submission endpoint is needed at this stage — if bulk import becomes a need, it can be added as a dedicated feature later.

**Applied change** — Added FR-041 below:

- **FR-041**: Bill creation and submission via the v2 API MUST be atomic — the bill header and all line items are sent in a single request. The standard SR0 rate limit (60 req/min) applies with no special billing-specific rate limit bucket. Maximum line items per bill is capped at 100 to prevent payload abuse. Bulk multi-bill submission endpoints are out of scope for SR4.
