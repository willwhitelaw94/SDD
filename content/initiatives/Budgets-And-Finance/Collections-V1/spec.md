---
title: "Feature Specification: Collections Module"
---

> **[View Mockup](/mockups/collections-v1/index.html)**{.mockup-link}


**Feature Branch**: `TP-2329-collections-module`
**Created**: 2025-12-23
**Status**: Draft
**Epic**: TP-2329-COL | Budgets And Services Initiative

---

## Clarifications

### Session 2025-12-23

- Q: Invoice status definitions (3 vs 4 states)? → A: 4 statuses - Current, New (within 7 days), Overdue (past 7 days), Paid
- Q: DD monthly limit behavior when invoice exceeds limit? → A: Skip DD entirely, notify user to pay manually (prep data model for future partial debit)
- Q: MyOB sync frequency target? → A: Hourly automated sync

---

## User Scenarios & Testing

### User Story 1 - Recipient Views Outstanding Invoices (Priority: P1)

A recipient logs into the portal and navigates to their care package. They want to see what contribution invoices are outstanding and what they've already paid, without needing to contact finance.

**Why this priority**: Core value proposition - self-service visibility reduces finance queries and improves client transparency. Required for Support at Home launch.

**Independent Test**: Can be fully tested by a recipient viewing their package's Collections tab and seeing a list of invoices with statuses.

**Acceptance Scenarios**:

1. **Given** a recipient has unpaid contribution invoices in MyOB, **When** they view the Collections section for their package, **Then** they see all outstanding invoices with amount, due date, and "Unpaid" status
2. **Given** a recipient has paid contribution invoices, **When** they view the Collections section, **Then** they see paid invoices with payment date and "Paid" status
3. **Given** a recipient has no invoices, **When** they view the Collections section, **Then** they see an empty state message indicating no invoices are available
4. **Given** a recipient has invoices past due date, **When** they view the Collections section, **Then** overdue invoices are visually distinguished (e.g., highlighted)

---

### User Story 2 - Coordinator Views Client Invoice History (Priority: P1)

A coordinator is having a financial conversation with a client and needs to quickly see their invoice history to provide context and support.

**Why this priority**: Enables coordinators to proactively manage client financial conversations without escalating to finance.

**Independent Test**: Can be fully tested by a coordinator viewing a client's package and seeing invoice summary and history.

**Acceptance Scenarios**:

1. **Given** a coordinator has access to a client's package, **When** they view the Collections section, **Then** they see the same invoice information as the recipient
2. **Given** a coordinator views Collections, **When** there are multiple invoices, **Then** they see a summary showing total outstanding and total paid
3. **Given** a coordinator accesses a package, **When** they don't have VIEW_FINANCIALS permission, **Then** the Collections section is not visible

---

### User Story 3 - Finance User Views AR Data in Portal (Priority: P1)

A finance team member wants to verify that AR data from MyOB is correctly synced and visible in the portal for a specific package.

**Why this priority**: Ensures data accuracy and provides finance visibility into what stakeholders see.

**Independent Test**: Can be fully tested by a finance user viewing any package's Collections data and comparing against MyOB source.

**Acceptance Scenarios**:

1. **Given** invoices exist in MyOB for a package, **When** sync has completed, **Then** finance user sees matching data in portal
2. **Given** an invoice is updated in MyOB (e.g., marked paid), **When** the next sync occurs, **Then** the portal reflects the updated status
3. **Given** a finance user views Collections, **When** they want to check sync status, **Then** they can see when data was last synced

---

### User Story 4 - Recipient Signs Direct Debit Agreement (Priority: P2)

A recipient wants to set up automatic payments by nominating a bank account and signing a Direct Debit agreement, all within the portal.

**Why this priority**: Phase 2 functionality - increases DD adoption rate and reduces manual paper-based enrollment.

**Independent Test**: Can be fully tested by a recipient completing the DD form, nominating bank details, and receiving confirmation.

**Acceptance Scenarios**:

1. **Given** a recipient has no existing DD mandate, **When** they access the DD enrollment section, **Then** they see an option to set up Direct Debit
2. **Given** a recipient is enrolling in DD, **When** they enter BSB and account number, **Then** the system validates the BSB format
3. **Given** a recipient has entered valid bank details, **When** they review the DD agreement, **Then** they see the full Australian-compliant DD terms and conditions
4. **Given** a recipient agrees to DD terms, **When** they submit their signature/consent, **Then** their DD mandate is recorded as "Pending" until processed
5. **Given** a recipient has an active DD mandate, **When** they view the DD section, **Then** they see their mandate status and last 4 digits of nominated account

---

### User Story 5 - Coordinator Views Client DD Status (Priority: P2)

A coordinator wants to see whether a client has an active Direct Debit arrangement to inform financial discussions.

**Why this priority**: Phase 2 - provides coordinators visibility into payment arrangements.

**Independent Test**: Can be fully tested by a coordinator viewing a client's DD status on their package.

**Acceptance Scenarios**:

1. **Given** a client has an active DD mandate, **When** coordinator views Collections, **Then** they see DD status as "Active" with setup date
2. **Given** a client has no DD mandate, **When** coordinator views Collections, **Then** they see DD status as "None"
3. **Given** a client has a pending DD mandate, **When** coordinator views Collections, **Then** they see DD status as "Pending"

---

### User Story 6 - Recipient Invoice Exceeds DD Limit (Priority: P2)

A recipient has set a monthly DD limit for cashflow management. When an invoice exceeds their limit, they are notified to pay manually instead of automatic debit.

**Why this priority**: Phase 2 - supports DD monthly limit feature for cashflow control.

**Independent Test**: Can be fully tested by setting a limit lower than an invoice amount and verifying notification is sent.

**Acceptance Scenarios**:

1. **Given** a recipient has a DD limit of $500 and an invoice of $600, **When** the DD processing runs, **Then** no debit occurs and the recipient is notified to pay manually
2. **Given** a recipient has a DD limit of $500 and an invoice of $400, **When** the DD processing runs, **Then** the full $400 is debited as normal
3. **Given** a recipient has no DD limit set, **When** any invoice is due, **Then** the full amount is debited regardless of invoice size

---

### Edge Cases

- What happens when MyOB sync fails or is delayed? (Show cached data with "last synced" timestamp)
- What happens when a recipient's package has no MyOB customer mapping? (Show appropriate message)
- What happens when BSB validation fails during DD enrollment? (Show clear error, allow retry)
- What happens when a recipient tries to cancel their DD mandate? (Show instructions to contact finance - cancellation is out of scope for V1)
- What happens when invoice data in MyOB is corrected/amended? (Next sync updates portal data)

---

## Requirements

### Functional Requirements

**Phase 1: AR Invoice Visibility**

- **FR-001**: System MUST display all contribution invoices (HCP-Contribution category) for a care package
- **FR-002**: System MUST show invoice status using 4-state lifecycle:
  - **Current**: Invoice for future billing period (not yet due)
  - **New**: Due date passed, within 7-day payment terms
  - **Overdue**: More than 7 days past due date
  - **Paid**: Payment received
- **FR-003**: System MUST display invoice amount, due date, and invoice number
- **FR-004**: System MUST show payment date for paid invoices
- **FR-005**: System MUST display a summary showing total outstanding and total paid amounts per package
- **FR-006**: System MUST sync invoice data from MyOB (manual trigger initially, hourly automated sync as target)
- **FR-007**: System MUST display last sync timestamp to users
- **FR-008**: System MUST enforce VIEW_FINANCIALS permission for Collections access
- **FR-009**: System MUST log all sync operations for audit purposes

**Phase 2: Direct Debit Enrollment**

- **FR-010**: System MUST allow recipients to nominate a bank account (BSB + Account Number)
- **FR-011**: System MUST validate BSB format (6 digits, valid Australian BSB)
- **FR-012**: System MUST display full DD agreement terms compliant with Australian DD requirements
- **FR-013**: System MUST capture digital consent/signature for DD agreement
- **FR-014**: System MUST store DD mandate with status: Pending, Active, Cancelled
- **FR-015**: System MUST display masked bank account details (last 4 digits only) for active mandates
- **FR-016**: System MUST NOT allow editing of DD details once submitted (must cancel and re-enroll)
- **FR-017**: System MUST allow recipients to optionally set a monthly DD limit for cashflow management
- **FR-018**: System MUST skip DD and notify user to pay manually when invoice exceeds their set monthly limit

### Key Entities

- **AR Invoice**: Represents a contribution invoice synced from MyOB (invoice number, amount, due date, status, payment date, package reference)
- **Invoice Sync Log**: Records each sync operation (timestamp, status, records processed, errors)
- **DD Mandate**: Represents a Direct Debit agreement (package reference, BSB, account number (encrypted), status, consent timestamp, consent reference)

---

## Success Criteria

### Measurable Outcomes

- **SC-001**: Recipients and coordinators can view invoice status within 3 seconds of loading the Collections section
- **SC-002**: Finance team receives 50% fewer invoice status queries within 3 months of Phase 1 launch
- **SC-003**: 100% of contribution invoices from MyOB are accurately reflected in portal after sync
- **SC-004**: Users can complete DD enrollment in under 5 minutes (Phase 2)
- **SC-005**: DD adoption rate increases by 10% within 6 months of Phase 2 launch
- **SC-006**: All invoice data is audit-ready with full sync logs available

---

## Assumptions

- MyOB remains the source of truth for all contribution invoices
- Contribution invoices are identifiable in MyOB via HCP-Contribution category
- MyOB API (API-014) is available and stable for data extraction
- Package-level access control (PERM-006) is implemented or can be extended
- Australian DD legal requirements are well-documented and stable
- Recipients have valid Australian bank accounts for DD enrollment

---

## Dependencies

- **API-014**: MyOB authentication and polling integration
- **PERM-006**: Package-level VIEW_FINANCIALS permission
- **Support at Home**: November 2025 launch timeline
- **Legal Review**: DD agreement terms approved before Phase 2

---

## Scope Boundaries

### In Scope

- View unpaid/paid/overdue contribution invoices per package
- Package-level invoice summary (totals)
- MyOB sync (manual initially, automated later)
- DD form with Australian compliance (Phase 2)
- DD mandate status tracking (Phase 2)

### Out of Scope

- Payment processing within portal
- Invoice dispute handling
- PDF invoice download/retrieval
- Automated payment reminders
- DD cancellation workflows (contact finance)
- Partial payment tracking
- Multi-currency support

### Future Considerations

- **Partial DD debit**: When invoice exceeds limit, debit up to limit and track remainder as outstanding (data model should accommodate this)

## Clarification Outcomes

### Q1: [Dependency] The spec references API-014 (MYOB authentication and polling) and PERM-006 (package-level VIEW_FINANCIALS permission). What is the status of these dependencies?
**Answer:** The codebase shows extensive MYOB integration already exists. `domain/Myob/` contains assembler actions (`AssembleMyobFeeBillItemDataAction`, etc.), and `domain/MyobAdjustment/` has `SyncMyobAdjustment`, `OvernightGetMyobAdjustmentsAction` — demonstrating established MYOB API connectivity. The `SyncMyobTransactionsJob` is referenced in the FRR spec as an existing job (which FRR explicitly says not to extend). For PERM-006, the permission system uses config-based permission lists (`config/permissions/organisation-permission-list.php`, `config/permissions/care-coordinator-permission-list.php`). VIEW_FINANCIALS would need to be added to these config files if not already present. The MYOB API integration is mature; the permission may need creation.

### Q2: [Integration] Hourly automated sync from MYOB is the target, but the spec starts with manual trigger. What is the trigger mechanism for manual sync?
**Answer:** The existing pattern for MYOB sync is via scheduled Artisan commands. `OvernightGetMyobAdjustmentsAction` in `domain/MyobAdjustment/Actions/` runs as a scheduled job. The Console Kernel (`app/Console/Kernel.php`) registers scheduled commands. Manual trigger could be an Artisan command callable via a Nova action or admin UI button. The FRR spec also describes webhook-based sync for adjustments. For Collections V1 AR invoices, polling is the likely initial approach (matching existing patterns) with manual trigger via an admin Artisan command or UI button.

### Q3: [Scope] Phase 2 (Direct Debit Enrollment) captures bank account details. What PCI/data security compliance requirements apply?
**Answer:** Bank account details (BSB + account number) for Australian Direct Debit are not PCI-scoped (PCI applies to card data). However, they are sensitive financial data subject to the Australian Privacy Act and the Bulk Electronic Clearing System (BECS) rules. DD agreement terms must comply with BECS Direct Debit Request (DDR) service agreement requirements. The spec mentions "Australian-compliant DD terms" — this needs legal sign-off before Phase 2 development. The VCE epic also introduces DD enrollment for voluntary contributions, so a shared DD infrastructure is recommended.

### Q4: [Edge Case] DD monthly limit — when the system skips DD entirely, what notification channel is used?
**Answer:** The spec does not specify the notification channel. The codebase uses Laravel notifications (`domain/Budget/Notifications/BudgetPlanSubmittedNotification.php` pattern) supporting both database (portal) and mail channels. Recommendation: use both in-app notification and email, consistent with the portal notification pattern. Cross-reference: VCE US3-US4 also introduces DD enrollment with payment limits. These should share a common DD notification infrastructure. ETN (if it exists) should define the notification template.

### Q5: [Data] The spec says "prep data model for future partial debit." What specific fields need to be included now?
**Answer:** The DD Mandate entity should include: `monthly_limit` (nullable decimal — null means no limit), `partial_debit_enabled` (boolean, default false — feature flag for future), `last_debit_amount` (decimal — tracks what was actually debited), and `remaining_invoice_amount` (decimal — tracks unpaid remainder after partial debit). Including these fields now avoids a breaking migration when partial debit is enabled later. The `partial_debit_enabled` flag can be controlled by a Pennant feature flag.

### Q6: [Integration] How does the MyOB customer mapping work? What links a Portal package to a MyOB customer?
**Answer:** The `Package` model has existing MYOB integration points. The MYOB sync infrastructure in `domain/Myob/` uses package-level identifiers to map between systems. For Collections, the AR invoice sync needs a reliable `package_id` -> MYOB customer mapping. If this mapping does not exist for all packages, the edge case of "no MyOB customer mapping" (identified in the spec) will be common during rollout. Recommendation: verify mapping coverage before launch.

### Q7: [Scope] Collections V1 and V2 (COL2) are separate epics but closely related. What is the delivery order?
**Answer:** V1 (TP-2329) is the foundation — AR invoice visibility and permissions. V2 (TP-2285) depends on V1 for AR invoice data and permissions. V2 adds VC approval and reconciliation dashboards. The dependency is correctly stated in V2's spec. V1 must ship before V2. Phase 2 DD enrollment in V1 is independent of V2 and can be parallel-tracked.

### Q8: [Performance] SC-001 targets 3-second load time for the Collections section. Is this achievable with hourly sync?
**Answer:** Yes — the data is read from Portal's local database after sync, not fetched from MYOB in real-time. The sync populates local tables; the Collections UI reads from those tables. A 3-second render target is achievable with proper indexing on the AR invoice table (package_id, status, due_date).

### Q9: [UX] How does the Collections section integrate into the existing package navigation?
**Answer:** The Package model (`domain/Package/Models/Package.php`) is the parent entity. Existing package pages include Budget, Documents, Claims, etc. (visible in `resources/js/Pages/` structure). Collections would be a new tab/section within the package context, consistent with existing navigation patterns.

### Q10: [Data] Invoice statuses use 4 states (Current, New, Overdue, Paid). Is "New" derived from due date or creation date?
**Answer:** Per the spec's own clarification: "New" means within 7 days of the due date passing (not creation date). The status is derived: Current = due date in future; New = due date passed, within 7 days; Overdue = more than 7 days past due; Paid = payment received. These are computed statuses, not stored — they should be calculated at read time based on `due_date`, `payment_date`, and current date.

## Refined Requirements

- **FR-REFINED-001**: The DD Mandate data model MUST include `monthly_limit`, `partial_debit_enabled`, `last_debit_amount`, and `remaining_invoice_amount` fields to support future partial debit without breaking migrations.
- **FR-REFINED-002**: Invoice status (Current/New/Overdue/Paid) SHOULD be computed at read time rather than stored, to avoid sync staleness.
- **FR-REFINED-003**: DD enrollment infrastructure SHOULD be designed as a shared service, reusable by both Collections V1 Phase 2 and VCE (Voluntary Contributions Enhancements) DD enrollment.
