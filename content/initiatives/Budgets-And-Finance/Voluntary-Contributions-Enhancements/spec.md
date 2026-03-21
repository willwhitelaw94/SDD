---
title: "Feature Specification: Voluntary Contributions Enhancements (VCE)"
---

> **[View Mockup](/mockups/voluntary-contributions-enhancements/index.html)**{.mockup-link}

**Status**: Draft
**Epic**: VCE | **Initiative**: Budgets & Finance
**Priority**: Idea
**Owner**: CPO (William Whitelaw)

---

## Overview

Voluntary Contributions Enhancements (VCE) addresses critical gaps in the Voluntary Contributions (VC) feature across three areas: Care Partner workflow fixes (removing the $30k quarterly cap, enabling date range editing, completing the edit drawer, adding a verification workflow), recipient self-service (direct debit enrollment for VC via the portal with an "overflow account" model), and a new overspend invoice workflow (on-hold bills with VC approval process). VC funds are drawn last in the funding hierarchy (after ON/EOL/RCP, HC/CU, AT/HM) and require explicit client consent for each service, with 0% loading/overhead fees.

**Scope boundaries**: This epic covers care partner VC editing and verification workflows, recipient portal direct debit VC enrollment, the overflow account funding model, and the overspend-to-VC approval workflow. It does not cover mandatory contribution management, general budget management (covered by Budget-Reloaded), invoice processing (covered by Invoices V2), or collections workflows (covered by COL, though patterns may be reused).

---

## User Scenarios & Testing

### User Story 1 - Care Partner Edits Voluntary Contribution Details (Priority: P0)

As a Care Partner, I want to edit voluntary contribution details (amount, date ranges, funding stream settings) so that I can align VC periods with ON dates and manage client contributions effectively.

**Acceptance Scenarios**:

1. **Given** a client has an active voluntary contribution, **When** the Care Partner opens the VC edit drawer, **Then** they see all editable fields (amount, start date, end date, notes) populated with current values and can modify them
2. **Given** the Care Partner changes the VC date range, **When** they save the changes, **Then** the system updates the VC period and validates that the new dates do not conflict with other funding stream periods
3. **Given** the Care Partner edits the VC amount, **When** the amount exceeds any configured limits, **Then** the system displays a warning but allows the change (no hard $30k quarterly cap)
4. **Given** the edit drawer is opened, **When** all fields are displayed, **Then** there are no TODO placeholders or non-functional UI elements (all backend API endpoints are wired to the frontend form)

---

### User Story 2 - System Triggers Verification When VC Funding Stream Is Added (Priority: P0)

As a Care Partner, I want a verification workflow to be triggered automatically when I add a VC funding stream to a client's plan so that VC additions are properly reviewed and documented.

**Acceptance Scenarios**:

1. **Given** a Care Partner adds a VC funding stream to a client's plan, **When** the funding stream is saved, **Then** the system automatically creates a verification task assigned to the appropriate reviewer
2. **Given** a verification task is created, **When** the reviewer opens the task, **Then** they see the client details, the VC configuration (amount, date range), and the Care Partner who added it
3. **Given** the reviewer approves the verification, **When** they confirm, **Then** the VC funding stream status changes to "Verified" and becomes active for billing
4. **Given** the reviewer rejects the verification, **When** they provide a reason, **Then** the Care Partner is notified and the VC funding stream remains in "Pending Verification" status

---

### User Story 3 - Recipient Enrolls in VC Direct Debit via Portal (Priority: P1)

As a recipient (client), I want to set up voluntary contributions via direct debit through the portal so that I can fund additional services without manual payment processes.

**Acceptance Scenarios**:

1. **Given** a recipient is authenticated in the portal, **When** they navigate to the Voluntary Contributions section, **Then** they see an enrollment form for setting up VC direct debit (separate from the mandatory contributions DD form)
2. **Given** the recipient fills in the DD form, **When** they enter bank account details, contribution amount, and payment limit, **Then** the form validates the input and shows a clear summary before confirmation
3. **Given** the recipient confirms the DD enrollment, **When** the enrollment is processed, **Then** a VC funding stream is created on the client's plan and a verification workflow is triggered for Care Partner review
4. **Given** the recipient wants to set a payment limit, **When** they specify a maximum amount, **Then** the system respects this limit and does not draw VC funds beyond the specified ceiling

---

### User Story 4 - Recipient Chooses Preload or Reactive VC Funding (Priority: P1)

As a recipient, I want to choose between preloading VC funds (proactive) or having them drawn as needed (reactive) so that I can manage my financial exposure according to my preference.

**Acceptance Scenarios**:

1. **Given** the recipient is on the VC enrollment form, **When** they reach the funding model selection, **Then** they see clear explanations of both options: "Preload" (funds deposited upfront as a reserve) and "Reactive" (charged only when services exceed other funding)
2. **Given** the recipient selects "Preload", **When** they specify an amount, **Then** the system sets up the VC account as an advance balance that is drawn from last in the funding hierarchy
3. **Given** the recipient selects "Reactive", **When** services exceed other funding streams, **Then** the system charges the recipient's DD account for the shortfall amount up to their payment limit
4. **Given** the VC account is configured as an "overflow account", **When** billing occurs, **Then** the system draws from funding streams in order: ON/EOL/RCP, HC/CU, AT/HM, and finally VC (last)

---

### User Story 5 - Overspend Invoice Triggers On-Hold with VC Approval Workflow (Priority: P0)

As a Care Partner, I want bills that exceed available funding to be placed on hold with a clear workflow for obtaining VC consent from the client so that overspend situations are resolved with proper authorization.

**Acceptance Scenarios**:

1. **Given** a bill exceeds the available funds in the selected funding streams, **When** the system detects insufficient funds, **Then** the bill is placed on hold with reason "Insufficient Funds"
2. **Given** a bill is on hold for insufficient funds, **When** the Care Partner reviews the bill, **Then** they see a prompt to contact the client for VC consent with clear instructions on the workflow
3. **Given** the Care Partner has obtained client consent for VC, **When** they document the consent in notes and toggle "VC Approved" on the bill, **Then** the system processes the bill using VC funds with 0% loading/overhead fees
4. **Given** a VC funding stream does not exist for the client, **When** the Care Partner approves VC on a bill, **Then** the system prompts the Care Partner to create a VC funding stream first and guides them through the setup
5. **Given** only Care Partners and Senior Care Partners have authorization, **When** a junior team member attempts to toggle "VC Approved", **Then** the action is blocked with a message indicating insufficient permissions

---

### User Story 6 - 100% Utilization Triggers VC Discussion Prompt (Priority: P2)

As a Care Partner, I want to receive a prompt when a client reaches 100% budget utilization suggesting a VC discussion so that I can proactively address potential overspend situations.

**Acceptance Scenarios**:

1. **Given** a client's budget utilization reaches 100% across their primary funding streams, **When** the Care Partner views the client's budget, **Then** a modal or banner appears suggesting they discuss voluntary contributions with the client
2. **Given** the prompt is displayed, **When** the Care Partner dismisses it, **Then** the system records the dismissal and does not show the prompt again for that budget period unless utilization changes
3. **Given** the Care Partner acts on the prompt, **When** they click "Set Up VC", **Then** they are directed to the VC funding stream creation workflow

---

### Edge Cases

- **What happens when a recipient's direct debit payment fails?**
  The system retries according to the DD provider's retry policy. If the payment fails definitively, the VC funding stream is flagged as "Payment Failed" and Care Partners are notified. Bills relying on VC funds are placed on hold until payment is resolved.

- **What happens when a Care Partner removes the $30k cap but the client's VC amount is already above the new limit?**
  Since the cap is being removed or made configurable, existing high-value VCs continue to function. If a configurable cap is set below the existing amount, the system warns but does not retroactively block existing contributions.

- **What happens when VC date ranges are edited to overlap with or conflict with ON dates?**
  The system validates that VC date ranges align with the client's active plan period. Overlapping VC periods are prevented, and the system suggests date ranges that align with ON dates.

- **What happens when a client's consent for VC is revoked?**
  The Care Partner updates the VC funding stream status to "Revoked". No new bills are processed against VC. Bills already in the pipeline using VC funds are placed on hold for reassignment to another funding source.

- **What happens when the funding hierarchy draws from VC but the reactive DD charge exceeds the client's payment limit?**
  The system draws VC funds only up to the payment limit. Any remaining shortfall is flagged as "Insufficient Funds" and the bill is placed on hold for manual resolution.

---

## Functional Requirements

- **FR-001**: System MUST remove or make configurable the $30k quarterly cap on voluntary contributions
- **FR-002**: System MUST enable date range editing for VC funding streams, allowing alignment with ON dates
- **FR-003**: System MUST complete the VC edit drawer UI, wiring all frontend form fields to the existing `ContributionController` backend API endpoints
- **FR-004**: System MUST trigger an automated verification workflow when a VC funding stream is added to a client's plan
- **FR-005**: System MUST provide a VC direct debit enrollment form in the recipient portal, separate from the mandatory contributions DD form
- **FR-006**: System MUST support two VC funding models: "Preload" (advance balance) and "Reactive" (charged on demand)
- **FR-007**: System MUST enforce the funding hierarchy: ON/EOL/RCP first, then HC/CU, then AT/HM, then VC last
- **FR-008**: System MUST allow recipients to set a maximum payment limit for VC direct debit
- **FR-009**: System MUST place bills on hold with reason "Insufficient Funds" when a bill exceeds available funding in selected streams
- **FR-010**: System MUST provide a "VC Approved" toggle on on-hold bills, accessible only to Care Partners and Senior Care Partners
- **FR-011**: System MUST apply 0% loading/overhead fees to VC-funded bills
- **FR-012**: System MUST require consent documentation (notes) before VC approval can be toggled on a bill
- **FR-013**: System MUST prompt VC funding stream creation when a Care Partner approves VC on a bill but no VC stream exists
- **FR-014**: System SHOULD display a 100% utilization modal suggesting VC discussion when a client's primary funding is fully utilized
- **FR-015**: System MUST prevent auto-fallback to VC funds without explicit consent (VC is opt-in per service)
- **FR-016**: System MUST log all VC-related actions (enrollment, approval, edits, verifications) with user identity and timestamps for audit

---

## Key Entities

- **VoluntaryContribution**: Represents a client's voluntary contribution funding stream
  - Key Fields: id, client_id, package_id, amount, start_date, end_date, funding_model (preload, reactive), payment_limit, status (pending_verification, verified, active, revoked, payment_failed), quarterly_cap (nullable/configurable), created_by, verified_by, verified_at
  - Relationships: Belongs to Client, Package. Has many VoluntaryContributionPayments

- **VoluntaryContributionPayment**: Tracks individual DD payments for reactive VC
  - Key Fields: id, voluntary_contribution_id, amount, payment_date, dd_reference, payment_status (pending, success, failed, retrying)
  - Relationships: Belongs to VoluntaryContribution

- **VCVerificationTask**: Verification workflow task created when VC is added
  - Key Fields: id, voluntary_contribution_id, assigned_to, status (pending, approved, rejected), rejection_reason, completed_at
  - Relationships: Belongs to VoluntaryContribution, User (assignee)

- **VCBillApproval**: Records VC approval on on-hold bills
  - Key Fields: id, bill_id, voluntary_contribution_id, approved_by, consent_notes, approved_at
  - Relationships: Belongs to Bill, VoluntaryContribution, User (approver)

---

## Success Criteria

### Measurable Outcomes

- **SC-001**: Bills on hold due to VC issues reduced to zero
- **SC-002**: VC-related support tickets reduced by 80%
- **SC-003**: Care Partner VC self-service completion rate exceeds 95% (edits, verifications handled without escalation)
- **SC-004**: Recipient self-service VC enrollment rate reaches target adoption (TBD, measured after launch)
- **SC-005**: Zero unauthorized VC fund usage (all VC draws have documented consent)
- **SC-006**: Average time to resolve VC-related on-hold bills reduced by 70%

---

## Assumptions

- Backend API for contributions exists and is functional (confirmed via `ContributionController` endpoints)
- MYOB sync for contribution invoices is operational
- Direct debit infrastructure exists from mandatory contributions and can be extended for VC
- The recipient portal can host new enrollment forms alongside existing functionality
- The `PackageContributionsEditDrawer.vue` component can be completed by wiring to existing backend APIs
- Care Partners and Senior Care Partners can be reliably identified by role for permission enforcement

---

## Dependencies

- **ContributionController API**: Existing backend endpoints for VC CRUD operations
- **PackageContributionsEditDrawer.vue**: Incomplete frontend component requiring completion
- **MYOB Webhook Integration**: For syncing VC-related invoice data
- **Direct Debit Provider**: Existing DD integration from mandatory contributions must support a second DD mandate for VC
- **On-Hold Bills (OHB)**: VC approval workflow extends the on-hold bill flow
- **Collections Epic (COL, TP-2329)**: May share DD and payment failure handling patterns
- **Budget Module**: Funding hierarchy enforcement requires integration with the budget allocation system

---

## Out of Scope

- Mandatory contribution management and DD setup (existing feature, not part of VCE)
- General budget management and funding allocation logic (covered by Budget-Reloaded)
- Invoice processing pipeline (covered by Invoices V2)
- Claims submission (covered by SCP)
- Supplier management and onboarding
- Collections and debt recovery workflows (covered by COL)
- DD provider onboarding or payment gateway setup (infrastructure concern)

## Clarification Outcomes

### Q1: [Dependency] What is the current state of the ContributionController endpoints and PackageContributionsEditDrawer.vue?
**Answer:** Codebase evidence confirms both exist. The `ContributionController` is at `app-modules/api/src/V1/src/Http/Controllers/ContributionController.php` with tests at `app-modules/api/src/V1/tests/apiContributionControllerTest.php`. It is registered in `app-modules/api/src/V1/routes/routes.php`. The `PackageContributionsEditDrawer.vue` exists at `resources/js/Components/Package/Drawers/PackageContributionsEditDrawer.vue`. The `PackageContributions.vue` component at `resources/js/Components/Package/Profile/PackageContributions.vue` provides the display view. The `PackageContributionsViewData` at `app/Data/View/Package/PackageContributionsViewData.php` handles the server-side data. The backend API exists and is testable; the frontend drawer needs completion (wiring forms to API endpoints). The spec's assumption about existing backend API is confirmed.

### Q2: [Scope] Should VC direct debit enrollment share infrastructure with Collections V1 Phase 2?
**Answer:** Yes, strongly recommended. Collections V1 Phase 2 introduces DD enrollment for mandatory contributions (BSB, account number, mandate management). VCE US3-US4 introduces DD enrollment for voluntary contributions. The enrollment form, BSB validation, mandate status tracking, and payment processing are identical patterns. Creating two separate DD enrollment systems would be wasteful and inconsistent. Recommendation: build a shared DD enrollment service that supports multiple mandate types (mandatory, voluntary). VCE-specific logic (preload vs reactive, overflow account model) sits on top of the shared DD infrastructure. The `VoluntaryContribution` entity has its own `funding_model` field to distinguish VC-specific behavior.

### Q3: [Data] Is the funding hierarchy (ON/EOL/RCP -> HC/CU -> AT/HM -> VC) already codified?
**Answer:** Partially. The `config/support-at-home.php` defines allocation rules per SERG category (e.g., SERG-0001 -> EL, ON, RC, CU, HC, VC). The order in the array represents the allocation waterfall priority. VC is already last in the SERG-0001 allocation list. The `AllocateFundingsAction` in `domain/Budget/Actions/AllocateFundingsAction.php` processes funding streams in the order defined by these rules. However, the hierarchy across SERG groups (ON first, then HC, then AT/HM, then VC) is not explicitly codified — the current logic allocates per-item based on the item's SERG group, not across groups. For VCE, the requirement is that VC is drawn LAST across all funding streams, not just within a SERG group. This may require a two-pass allocation: first allocate all non-VC streams, then allocate VC for any remaining shortfall. Cross-reference: BUR US2 changes allocation order (quarterly before unspent), AFC adds hold priority for ATHM. All three touch the allocation engine and should be coordinated.

### Q4: [Edge Case] How does the VCE on-hold bill workflow interact with OHB?
**Answer:** VCE extends OHB, not replaces it. The existing bill approval pipeline (`ApproveBill`, `UnapproveBill`, `ReprocessInReviewBill`) already handles on-hold bills. VCE adds a new on-hold reason ("Insufficient Funds") and a resolution mechanism ("VC Approved" toggle). The `VCBillApproval` entity records the VC approval decision. The bill remains in the standard on-hold state but has a VC-specific resolution path. Recommendation: add "Insufficient Funds - Pending VC" as a new hold reason in the bill status system, and add the VC approval action as an additional resolution option alongside existing ones (reprocess, escalate, reject).

### Q5: [UX] How is "explicit consent" for VC captured and tracked?
**Answer:** FR-015 prevents auto-fallback to VC without consent. FR-012 requires consent documentation (notes) before VC approval on a bill. This means consent is per-bill, not blanket. The workflow: (1) bill is on hold for insufficient funds, (2) Care Partner contacts client, discusses VC, (3) Care Partner documents consent in notes on the bill, (4) Care Partner toggles "VC Approved" with the notes as evidence. The `VCBillApproval` entity captures `consent_notes` and `approved_by`. This is a per-bill consent model. A blanket consent option (client agrees to VC for all future overages) could be a future enhancement stored on the `VoluntaryContribution` entity. For MVP, per-bill consent is appropriate and safer.

### Q6: [Data] The spec mentions removing the $30k quarterly cap. Where is this cap currently enforced?
**Answer:** The cap is likely enforced in the `ContributionController` or the contribution-related validation logic. The `VoluntaryContribution` entity in the spec includes `quarterly_cap (nullable/configurable)` — setting this to null removes the cap. The current enforcement point would be in the API validation rules when creating or updating a VC funding stream. FR-001 says "remove or make configurable" — the implementation should make the cap nullable in the database and skip validation when null.

### Q7: [Integration] The "overflow account" model (US4) — how does this interact with billing?
**Answer:** The overflow model means VC funds are the last resort in the funding waterfall. When a bill is processed and all primary funding streams are exhausted, the remaining amount overflows to VC. For "Preload" mode, the VC account has a pre-funded balance that is drawn from. For "Reactive" mode, the client's DD is charged on demand. The billing integration point is `CalculateBillFundingAllocations` — this action needs to check for active VC funding streams after all other streams are exhausted, and if found, allocate the remainder to VC (up to the payment limit). The reactive DD charge would be triggered after bill approval when VC funds are consumed.

### Q8: [Permissions] FR-010 restricts "VC Approved" toggle to Care Partners and Senior Care Partners. How is this enforced?
**Answer:** The permission system uses role-based access. Care Partner and Senior Care Partner roles are defined in the permission config files. The "VC Approved" action should check the user's role before allowing the toggle. The existing `BillPolicy` or a new gate/policy for VC approval should enforce this. The `config/permissions/` config files define role-permission mappings.

### Q9: [Edge Case] What happens when the reactive DD charge fails?
**Answer:** Per the spec's edge case: the system retries per DD provider policy, flags the VC as "Payment Failed," notifies Care Partners, and puts bills relying on VC on hold. The `VoluntaryContributionPayment` entity tracks payment status (pending, success, failed, retrying). This creates a feedback loop: bill approved with VC -> DD charge attempted -> charge fails -> bill goes back on hold -> Care Partner investigates. The hold reason should be "VC Payment Failed" to distinguish from initial insufficient funds.

### Q10: [Scope] US6 (100% utilization modal) — is this a modal or a notification?
**Answer:** The spec says "a modal or banner" — this is a proactive UI element that appears when the Care Partner views the client's budget at 100% utilization. It is not a push notification; it is a contextual prompt. The `GetUtilisationThresholdColourAction` in `domain/Budget/Actions/GetUtilisationThresholdColourAction.php` already calculates utilization thresholds. At 100%, this action could trigger the VC discussion prompt. Implementation: check utilization at budget page load; if 100%, show a dismissable banner with "Set Up VC" CTA. The dismissal should be tracked per user per budget period.

## Refined Requirements

- **FR-REFINED-001**: DD enrollment infrastructure MUST be shared with Collections V1 Phase 2, supporting multiple mandate types (mandatory, voluntary) on a single shared service.
- **FR-REFINED-002**: The funding hierarchy enforcement (VC last) requires a two-pass allocation approach in `CalculateBillFundingAllocations`: first allocate all non-VC streams, then allocate VC for any remaining shortfall. This must be coordinated with BUR US2 and AFC.
- **FR-REFINED-003**: "Insufficient Funds - Pending VC" MUST be added as a new hold reason in the bill status system, with the VC approval action as an additional resolution path alongside existing on-hold bill resolution mechanisms.
- **FR-REFINED-004**: Per-bill consent is the MVP model. A future blanket consent option (stored on `VoluntaryContribution`) can be considered post-launch based on Care Partner feedback.
