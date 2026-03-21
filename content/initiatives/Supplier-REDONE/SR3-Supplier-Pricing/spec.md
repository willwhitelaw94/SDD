---
title: "Feature Specification: Supplier Pricing"
---

# Feature Specification: Supplier Pricing

**Feature Branch**: `sr3-supplier-pricing`
**Created**: 2026-03-19
**Author**: Will Whitelaw
**Status**: Draft

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Supplier Submits Rates for a Location (Priority: P1)

A supplier logs into the portal and enters their pricing for a specific location and service type. They fill in rates across applicable categories (weekday, non-standard weekday, Saturday, Sunday, public holiday, travel). For services they do not offer, they toggle the rate as "not applicable" rather than entering $0. When they save, the system validates their entries against price caps and clearly indicates which rates are approved and which require further review. Rates within the cap are auto-approved immediately — no staff review is required for compliant submissions.

**Why this priority**: This is the core pricing workflow. Without rate submission, no other pricing feature has value. The 62% incomplete rate backlog makes this the highest-impact improvement.

**Independent Test**: Can be fully tested by logging in as a supplier user, selecting a location and service type, entering rates, toggling N/A for inapplicable services, and verifying the saved rates show correct approval indicators.

**Acceptance Scenarios**:

1. **Given** a supplier with a registered location, **When** they navigate to pricing for that location and service type, **Then** they see a rate entry grid with fields for weekday, non-standard weekday, Saturday, Sunday, public holiday, and travel rates.
2. **Given** a supplier entering rates, **When** they toggle a rate category as "not applicable", **Then** the field is disabled, no value is stored (null, not $0), and the grid visually indicates "N/A".
3. **Given** a supplier who submits all rates within price caps, **When** they save, **Then** each rate is auto-approved and receives a green tick indicator confirming approval — no staff review is triggered.
4. **Given** a supplier who submits a rate exceeding the price cap, **When** they save, **Then** the system flags the rate, displays a warning (without revealing the cap value), and prompts them to "submit a price request" for review.
5. **Given** a supplier who leaves a rate field blank (not toggled N/A), **When** they save, **Then** the system treats it as an incomplete submission and prompts them to either enter a value or mark it as N/A.

---

### User Story 2 - Supplier Submits a Price Request for Out-of-Cap Rates (Priority: P1)

When a supplier enters a rate that exceeds the price cap, the system does not silently accept it. Instead, the supplier must explicitly submit a price request explaining why their rate is higher. This creates a reviewable record for the pricing team. The supplier can see the status of their pending requests and is notified when they are approved or rejected.

**Why this priority**: Without this, out-of-cap rates either go unreviewed (compliance risk) or are manually tracked in spreadsheets (operational waste). This is the bridge between supplier entry and staff approval.

**Independent Test**: Can be tested by entering an above-cap rate, submitting the price request with a reason, and verifying the request appears in pending status with the correct details.

**Acceptance Scenarios**:

1. **Given** a supplier whose rate exceeds the cap, **When** they choose to submit a price request, **Then** a form appears asking for a reason/justification for the higher rate.
2. **Given** a supplier who submits a price request, **When** the request is saved, **Then** the rate shows a "pending review" indicator and the supplier can see it in their list of pending requests.
3. **Given** a supplier with a pending price request, **When** staff approves it, **Then** the rate indicator changes to the green tick and the supplier receives an in-app notification (with an email summary if email notifications are enabled in their profile settings).
4. **Given** a supplier with a pending price request, **When** staff rejects it, **Then** the supplier receives an in-app notification with the rejection reason (and email summary if enabled) and can submit a revised rate.
5. **Given** a supplier with a pending price request, **When** they view their pricing grid, **Then** the pending rate is clearly distinguished from approved rates and N/A entries.

---

### User Story 3 - Staff Reviews Pricing on the Approve/Reject Dashboard (Priority: P1)

A pricing team member opens the approve/reject dashboard and sees all supplier pricing submissions that require review. They can filter by service type, location, and compliance status. For each submission, they see the supplier's submitted rate, the applicable price cap context, and any justification provided. They can approve or reject individually or in batch. The dashboard shows submissions across all supplier entities — scoped to the supplier entity level, not the organisation level.

**Why this priority**: The staff-side counterpart to supplier submission. Without structured review tooling, the approval process remains ad-hoc and unscalable. Directly addresses TMC-84 and TMC-12.

**Independent Test**: Can be tested by logging in as a pricing team member, viewing the dashboard with pending submissions, and approving or rejecting a price request with a reason.

**Acceptance Scenarios**:

1. **Given** a pricing team member, **When** they open the approve/reject dashboard, **Then** they see a list of all pending price submissions with supplier entity name, location, service type, submitted rate, and submission date.
2. **Given** the dashboard with multiple pending submissions, **When** staff filters by service type and location, **Then** only matching submissions are shown.
3. **Given** a pending submission, **When** staff approves it, **Then** the rate is marked as approved, the supplier sees a green tick, and the action is logged.
4. **Given** a pending submission, **When** staff rejects it with a reason, **Then** the supplier is notified with the rejection reason and the rate reverts to requiring re-entry.
5. **Given** multiple pending submissions from the same supplier, **When** staff selects several and chooses "batch approve", **Then** all selected rates are approved in a single action.
6. **Given** a submission where the supplier entity has been flagged once before, **When** the dashboard displays it, **Then** a warning indicator shows the flag count and notes that a second flag will trigger a billing hold.

---

### User Story 4 - Supplier Views Compliance Status and Flag Count (Priority: P2)

A supplier can see their overall compliance status across all locations and service types. They can see how many rates are approved, how many are pending review, how many have been flagged, and whether they are at risk of a billing hold. If billing is already on hold due to two flags, the supplier sees a clear explanation of why and what action is needed. Flags are resolved individually when the underlying rate is corrected and re-approved; the billing hold is lifted once all outstanding flags are resolved.

**Why this priority**: Gives suppliers transparency and agency over their compliance status. Reduces support queries and surprises when billing holds are applied.

**Independent Test**: Can be tested by logging in as a supplier with mixed compliance statuses and verifying the compliance summary accurately reflects their approved, pending, flagged, and on-hold rates.

**Acceptance Scenarios**:

1. **Given** a supplier with a mix of approved and pending rates, **When** they view their compliance status, **Then** they see a summary: X rates approved, Y rates pending review, Z rates flagged.
2. **Given** a supplier flagged once, **When** they view their compliance status, **Then** a warning indicates that one more flag will result in a billing hold.
3. **Given** a supplier flagged twice (billing on hold), **When** they view their compliance status, **Then** a clear message explains that billing is on hold, the reason, and the action required to resolve it.
4. **Given** a supplier who corrects a flagged rate and receives staff re-approval, **When** they view their compliance status, **Then** the flag count decrements by one. If all flags are resolved, the billing hold is lifted.

---

### User Story 5 - Supplier Downloads a PDF Pricing Reference (Priority: P2)

A supplier can download a PDF document that summarises the rate structure for their service types, scoped to their locations. The PDF includes the rate categories, any applicable notes, and the supplier's currently submitted rates. This allows suppliers to review and share pricing information offline without logging into the portal.

**Why this priority**: Addresses a specific stakeholder request (Stephen, Mar 4 meeting). Reduces portal dependency for pricing discussions and internal supplier reviews.

**Independent Test**: Can be tested by selecting a service type and location, downloading the PDF, and verifying it contains the correct rate structure and submitted values.

**Acceptance Scenarios**:

1. **Given** a supplier with rates submitted for a location, **When** they choose to download the pricing reference, **Then** a PDF is generated containing service type, location, rate categories, and their submitted rates.
2. **Given** a supplier with rates across multiple service types, **When** they download the reference scoped to a specific service type, **Then** the PDF only contains rates for that service type.
3. **Given** a supplier with some N/A rates, **When** they download the PDF, **Then** N/A entries are clearly shown as "Not Applicable" rather than $0 or blank.
4. **Given** a supplier downloading the PDF, **When** the PDF is generated, **Then** it does NOT include price cap values — only the supplier's own submitted rates and their approval status.

---

### User Story 6 - Staff Manages Price Cap Configuration (Priority: P2)

A staff member with appropriate permissions can view and update price cap thresholds by service type. Price caps are defined as fixed dollar amounts per service type and rate category — they are not percentages. The "10% minimum threshold" refers to the validation tolerance: a rate is flagged only if it exceeds the cap by more than 10%. Changes to caps trigger re-validation of existing approved rates — any previously approved rate that now exceeds the new cap is flagged for review. Cap values are never exposed to suppliers.

**Why this priority**: Price caps must be maintainable without developer intervention. Re-validation on cap changes prevents stale approvals that no longer meet business thresholds.

**Independent Test**: Can be tested by updating a price cap for a service type and verifying that existing rates exceeding the new cap are re-flagged for review.

**Acceptance Scenarios**:

1. **Given** a staff member with price cap management permissions, **When** they view the price cap configuration, **Then** they see current cap values (fixed dollar amounts) organised by service type and rate category.
2. **Given** a staff member updating a cap, **When** they save the new threshold, **Then** the system re-validates all existing approved rates against the new cap.
3. **Given** a previously approved rate that now exceeds a reduced cap, **When** re-validation runs, **Then** the rate is flagged for review and the supplier is notified that their rate requires re-submission.
4. **Given** a cap update, **When** the change is saved, **Then** an audit log records who changed the cap, the old value, the new value, and when.

---

### User Story 7 - Service-Type Level Approval Workflow (Priority: P3)

Pricing approval can be managed at the service-type level rather than individual rate level. A staff member can approve all rates for a supplier's specific service type at a given location in one action, or flag the entire service type for review. This supports the service-type level approval model already in preview.

**Why this priority**: Builds on the individual rate approval (Stories 2-3) to support bulk operations at the service-type level — a workflow already partially built and previewed (Dec 17 meeting).

**Independent Test**: Can be tested by selecting a supplier's service type at a location and approving all rates at once, verifying all individual rates update accordingly.

**Acceptance Scenarios**:

1. **Given** a staff member reviewing a supplier's pricing, **When** they select a service type at a location, **Then** they see all rates for that service type with individual and aggregate approval options.
2. **Given** all rates within cap for a service type, **When** staff approves at the service-type level, **Then** all individual rates are marked as approved in a single action.
3. **Given** some rates within cap and some exceeding cap for a service type, **When** staff attempts service-type level approval, **Then** the system warns that X rates exceed the cap and requires individual review for those rates.

---

### User Story 8 - Supplier Pricing History and Audit Trail (Priority: P3)

All pricing changes are tracked with a full audit trail. Staff can view the history of rate changes for any supplier, location, and service type — including who changed the rate, when, the old value, the new value, and whether it was approved or rejected. Suppliers can view their own rate change history for their locations.

**Why this priority**: Required for compliance and dispute resolution. Lower priority because it enhances transparency but does not block the core pricing workflow.

**Independent Test**: Can be tested by changing a rate, then viewing the audit trail and verifying it shows the old value, new value, timestamp, and actor.

**Acceptance Scenarios**:

1. **Given** a supplier who updates a rate, **When** the change is saved, **Then** an audit record is created with the old value, new value, timestamp, and who made the change.
2. **Given** a staff member reviewing a supplier's pricing, **When** they view the audit trail for a specific rate, **Then** they see the full history of changes in chronological order.
3. **Given** a price request that was rejected and resubmitted, **When** the audit trail is viewed, **Then** it shows the original submission, rejection with reason, and the resubmission.

---

### Edge Cases

- What happens when a supplier changes location and their rates no longer apply? Rates remain associated with the original location. If the location is deactivated, the rates are archived but not deleted. The supplier must enter new rates for any new location.
- What happens when a price cap is reduced below the majority of existing approved rates? The system flags all affected rates for review. Staff can batch-review and either approve exceptions or require re-submission. A bulk notification is sent to affected suppliers. Re-validation runs as an async queued job to avoid blocking the staff member's cap update action.
- What happens when a supplier enters the exact same rate as their existing approved rate? The system recognises no change and does not create a new audit entry or trigger re-validation.
- What happens when a supplier has rates for a location that is transferred to a different organisation (SR2 dependency)? Rates remain with the original supplier entity. The new organisation must enter their own rates for that location.
- How does the system handle digital platform pricing (Mable, etc.) that cannot be reliably validated? Digital platform rates are tagged as "platform-sourced" and follow a separate manual review process. They are excluded from automated cap validation until SR9 addresses integration reliability.
- What happens when a supplier submits rates for a service type they are not registered to provide? The system restricts the pricing grid to only service types linked to the supplier's agreements. Unregistered service types are not shown.
- What happens when a rate is $0 legitimately (e.g., no travel charge)? The N/A toggle is separate from a $0 entry. $0 is a valid rate that can be saved and approved. The system distinguishes between "this supplier charges nothing for this" ($0) and "this supplier does not offer this" (N/A/null).
- What happens when a cap re-validation affects thousands of rates? Re-validation runs as a queued job. Staff see a progress indicator on the cap configuration page. Supplier notifications are batched (one notification per affected supplier, not per rate).
- What happens when an Organisation Administrator views pricing — do they see all supplier entities? The Org Admin sees a pricing compliance rollup on the SR2 org dashboard. To manage individual rates, they must switch to a specific supplier entity context using the SR2 account switcher. Pricing entry and approval always operate at the supplier-entity level.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide a per-location, per-service-type pricing grid with fields for weekday, non-standard weekday, Saturday, Sunday, public holiday, and travel rates. Pricing is scoped to the supplier entity level (not the organisation level) consistent with the SR2 two-tier model.
- **FR-002**: System MUST allow suppliers to toggle individual rate categories as "not applicable", storing null rather than $0, with clear visual distinction.
- **FR-003**: System MUST validate submitted rates against price caps. Price caps are fixed dollar amounts per service type and rate category. The 10% threshold is a validation tolerance — rates exceeding the cap by more than 10% are flagged. Rates within the cap (or within the 10% tolerance) are auto-approved without staff review.
- **FR-004**: System MUST NOT expose price cap values to suppliers in any UI element, error message, notification, or downloadable document.
- **FR-005**: System MUST require suppliers to submit a price request with justification when their rate exceeds the cap, rather than silently accepting or rejecting the rate.
- **FR-006**: System MUST provide a staff-facing approve/reject dashboard showing all pending price submissions with filtering by service type, location, and compliance status.
- **FR-007**: System MUST support individual and batch approval/rejection of pricing submissions by staff.
- **FR-008**: System MUST display a green tick indicator for approved rates, a pending indicator for rates under review, and a warning indicator for flagged rates.
- **FR-009**: System MUST track supplier entity flag counts and automatically place billing on hold when a supplier entity accumulates two unresolved flags. Flags are resolved individually when the underlying rate is corrected and re-approved. The billing hold is lifted when all outstanding flags are resolved.
- **FR-010**: System MUST provide suppliers with visibility into their compliance status, including flag count, approved/pending/flagged rate counts, and billing hold status.
- **FR-011**: System MUST generate a downloadable PDF pricing reference scoped by service type and location, showing the supplier's submitted rates and approval status (excluding cap values).
- **FR-012**: System MUST allow staff to manage price cap thresholds (fixed dollar amounts) by service type and rate category, with re-validation of existing rates when caps change. Re-validation runs as an async queued job.
- **FR-013**: System MUST maintain a complete audit trail for all pricing changes, approvals, rejections, and cap modifications, including actor, timestamp, old value, and new value.
- **FR-014**: System MUST support service-type level approval, allowing staff to approve all rates for a supplier's service type at a location in one action.
- **FR-015**: System MUST notify suppliers when a price request is approved or rejected, including rejection reasons. Notifications are delivered in-app (always) with optional email summaries based on the supplier's notification preferences.
- **FR-016**: System MUST restrict the pricing grid to only service types linked to the supplier's active agreements.
- **FR-017**: System MUST distinguish between $0 rates (valid, supplier charges nothing) and N/A rates (null, supplier does not offer this service) in storage, display, and reporting.
- **FR-018**: System MUST support partial rate entry — suppliers can save progress without completing all rate categories, with clear indication of incomplete submissions.
- **FR-019**: System MUST tag digital platform-sourced rates separately and exclude them from automated cap validation.
- **FR-020**: System MUST prevent price cap values from being derivable through repeated submission attempts (e.g., binary search by submitting incrementally higher rates) by using non-specific feedback language.
- **FR-021**: System MUST scope all pricing data, flag counts, compliance status, and billing holds to the supplier entity level — not the organisation level. Organisation Administrators see a compliance rollup on the org dashboard (SR2) but manage pricing per supplier entity.

### Key Entities

- **OrganisationPrice**: The core pricing record linking a supplier entity's location to a service type. Contains rate values for each category (weekday, non-standard weekday, Saturday, Sunday, public holiday, travel), rate type (direct/indirect), approval status, and flag count. Supports null values for N/A rates. Scoped to the supplier entity (not the organisation).
- **PriceRequest**: A submission record created when a supplier's rate exceeds the cap. Contains the submitted rate, supplier justification, review status (pending/approved/rejected), reviewer identity, and review notes.
- **PriceCap**: A configuration record defining the maximum acceptable rate (fixed dollar amount) by service type and rate category. Globally scoped — the same cap applies to all suppliers for a given service type/category combination. Managed by staff. Changes trigger re-validation of existing approved rates. Values are never exposed to suppliers.
- **ServiceType**: The classification of services a supplier can provide. Linked to agreements and used to scope the pricing grid.
- **OrganisationLocation**: A supplier entity's operational location. Pricing is entered per location, per service type.
- **PriceAuditLog**: An immutable record of every pricing change, approval, rejection, and cap modification. Includes actor, timestamp, old value, new value, and action type.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Rate submission completion increases from 38% to 70% within 3 months of launch, measured by suppliers with all applicable rates submitted (including N/A entries).
- **SC-002**: 100% of out-of-cap rate submissions go through the price request workflow — zero rates silently accepted above the cap.
- **SC-003**: Average time for staff to review and action a price request is under 2 business days, measured from submission to approval/rejection.
- **SC-004**: Supplier support queries related to pricing ("what rate should I enter?", "why is my billing on hold?") decrease by 30% within 3 months.
- **SC-005**: All pricing changes have a complete, queryable audit trail — 100% traceability for compliance audits.
- **SC-006**: Price cap values remain confidential — zero instances of cap values being exposed to suppliers through any channel (UI, PDF, notifications, error messages).
- **SC-007**: Suppliers flagged for out-of-cap pricing can see their flag count and hold risk — 100% of affected suppliers have access to their compliance status before a billing hold is applied.
- **SC-008**: PDF pricing reference can be generated and downloaded in under 5 seconds for any service type and location combination.
- **SC-009**: Batch approval of service-type level rates completes in under 3 seconds for staff, regardless of the number of rate categories.
- **SC-010**: Zero data integrity issues between $0 rates and N/A entries — distinct storage, display, and reporting for each.

---

## Clarifications

### Session 2026-03-19

**Q1: How does pricing relate to the two-tier org/supplier model from SR2? Is pricing scoped to the organisation level or the supplier entity level?**

Options:
- (a) Organisation level — one set of rates per ABN, shared across all supplier entities
- (b) Supplier entity level — each supplier entity under an ABN manages its own rates independently
- (c) Hybrid — org sets default rates, supplier entities can override

**Answer: (b) Supplier entity level.** Pricing is inherently tied to locations and service agreements, both of which are scoped to individual supplier entities in SR2. An organisation with multiple supplier entities (e.g., different trading names for different regions) will have different rates per entity. Organisation Administrators see a compliance rollup on the SR2 org dashboard but must switch to a specific supplier entity context to manage rates. This is consistent with how SR2 scopes locations, workers, and documents to the supplier entity level. Applied to: FR-001, FR-009, FR-021 (new), Key Entities (OrganisationPrice, PriceCap), Story 3, Story 4, Edge Cases.

---

**Q2: Are price caps fixed dollar amounts or percentage-based? The spec references a "10% minimum threshold" (FR-003) but does not clarify whether caps themselves are dollar values or percentages, and what the 10% is relative to.**

Options:
- (a) Caps are percentages above the NDIS price guide
- (b) Caps are fixed dollar amounts; the "10% threshold" is a tolerance band above the cap
- (c) Caps are fixed dollar amounts; the "10%" is a minimum margin TC requires

**Answer: (b) Fixed dollar amounts with a 10% tolerance band.** Price caps are stored as fixed dollar amounts per service type and rate category (e.g., "Weekday home care: $65.00"). The 10% threshold is a validation tolerance — a rate is only flagged if it exceeds the cap by more than 10%. Rates within the cap or within the 10% tolerance are auto-approved. This keeps cap management simple (staff enter dollar values, not formulas) and the tolerance avoids flagging rates that are only marginally above the cap. Applied to: FR-003, FR-012, Story 6, Key Entities (PriceCap).

---

**Q3: What is the notification mechanism for price request approvals/rejections (FR-015)? In-app only, email only, or both?**

Options:
- (a) In-app notifications only (bell icon / notification centre)
- (b) Email notifications only
- (c) In-app always, with optional email summaries based on supplier notification preferences

**Answer: (c) In-app always, with optional email summaries.** In-app notifications are the primary channel — they are guaranteed to be seen on next login and are low-cost to implement. Email summaries are opt-in based on the supplier's notification preferences (which SR2 profile settings should support). This avoids spamming suppliers with emails they did not ask for while ensuring critical pricing decisions are never missed. Applied to: FR-015, Story 2 ACs 3-4.

---

**Q4: How do flags resolve and when does the billing hold lift? Story 4 AC4 says "flag count resets as per business rules" but those rules are undefined.**

Options:
- (a) Flags never expire — they accumulate permanently and staff must manually clear them
- (b) Flags resolve individually when the underlying rate is corrected and re-approved; billing hold lifts when all flags are resolved
- (c) Flags expire after a time period (e.g., 6 months) regardless of rate status

**Answer: (b) Individual resolution, hold lifts when all resolved.** Each flag is tied to a specific rate that exceeded the cap. When that rate is corrected (re-submitted within cap or approved via price request), the flag is resolved. The billing hold is lifted once the supplier entity has zero unresolved flags. This gives suppliers a clear path to recovery: fix each flagged rate, get it re-approved, and the hold clears automatically. No time-based expiry — flags persist until actively resolved. Applied to: FR-009, Story 4 AC4, Edge Cases.

---

**Q5: Do rates within the price cap require staff review, or are they auto-approved? The spec implies staff review for out-of-cap rates but is silent on within-cap rates.**

Options:
- (a) All rates require staff review regardless of cap compliance
- (b) Within-cap rates are auto-approved; only out-of-cap rates require staff review
- (c) Within-cap rates are auto-approved with a configurable override for staff to require manual review for specific service types

**Answer: (b) Auto-approve within-cap rates.** With 13,000 suppliers and 6 rate categories each, requiring manual review of every compliant rate would create an unmanageable backlog and negate the purpose of having price caps. Rates at or below the cap (including the 10% tolerance) are auto-approved instantly with a green tick. Only rates exceeding the cap + tolerance enter the price request workflow for staff review. This keeps the approve/reject dashboard focused on genuine exceptions. Applied to: FR-003, Story 1 AC3, Story 3 description.
