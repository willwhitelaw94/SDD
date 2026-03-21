---
title: "Feature Specification: CareVicinity Job Posting (CVJ)"
---

> **[View Mockup](/mockups/carevicinity-job-posting/index.html)**{.mockup-link}

**Status**: Draft
**Epic**: CVJ | **Initiative**: TP-1857 Supplier Management

---

## Overview

TC Portal and CareVicinity are sister platforms under Trilogy Care that currently operate independently. This feature adds a "Post to CareVicinity" button to the Planned Service modal in TC Portal, enabling Care Coordinators to post jobs to the CareVicinity marketplace without re-entering data. The integration passes context (recipient, service type, schedule, budget line ID) via URL parameters, opening CareVicinity in a new window with pre-filled job details. This is a lightweight, first integration between the two platforms, establishing reusable patterns for deeper connectivity.

CareVicinity is a Trilogy-owned marketplace. More jobs through CV benefits the business directly. This is a business opportunity rather than a pain point fix -- Care Coordinators have other ways to find suppliers and CV remains optional.

---

## User Scenarios & Testing

### User Story 1 - Post a Job to CareVicinity from Planned Service (Priority: P1)

As a Care Coordinator, I want to post a job to CareVicinity directly from a Planned Service in TC Portal so that I do not have to re-enter data that already exists in the budget.

**Acceptance Scenarios**:
1. **Given** a Planned Service with no supplier assigned, **When** the coordinator views the Planned Service modal, **Then** a "Post to CareVicinity" button is displayed.
2. **Given** the coordinator clicks "Post to CareVicinity", **When** CareVicinity opens in a new tab, **Then** the job details (recipient, service type, schedule, budget line ID) are pre-filled from the Planned Service data.
3. **Given** the coordinator has posted a job in CareVicinity, **When** they return to TC Portal, **Then** the button changes from "Post to CareVicinity" to "View in CareVicinity".
4. **Given** the coordinator clicks "View in CareVicinity", **When** CareVicinity opens, **Then** it navigates directly to the previously posted job.

### User Story 2 - Authentication Handoff (Priority: P1)

As a Care Coordinator, I want the CareVicinity authentication to be handled independently so that I am not blocked from posting a job if my CareVicinity session has expired.

**Acceptance Scenarios**:
1. **Given** the coordinator is not authenticated in CareVicinity, **When** they click "Post to CareVicinity", **Then** CareVicinity handles login on its side before displaying the pre-filled job form.
2. **Given** the coordinator is already authenticated in CareVicinity, **When** they click "Post to CareVicinity", **Then** they go directly to the pre-filled job form without re-authenticating.

### User Story 3 - Budget Line ID Linkage (Priority: P2)

As a Finance team member, I want the budget line ID to be passed to CareVicinity when a job is posted so that future invoice matching can be automated.

**Acceptance Scenarios**:
1. **Given** a Planned Service has a budget line ID, **When** the coordinator posts to CareVicinity, **Then** the budget line ID is included in the context passed to CareVicinity.
2. **Given** a job was posted via the integration, **When** the job is viewed in CareVicinity, **Then** the budget line ID is stored and visible on the job record.

### Edge Cases

- **No supplier needed**: Button should only appear on Planned Services where a supplier is needed but not yet assigned.
- **Budget line ID missing**: If the budget line ID is unavailable, the button should still function but log a warning for monitoring.
- **CareVicinity unavailable**: If CareVicinity is down, the new tab should display an appropriate error. TC Portal should not be affected.
- **Job posted but coordinator navigates away before state updates**: On next load of the Planned Service, Portal should check if a CV job exists for this budget line ID and update the button state accordingly.
- **Multiple clicks**: Clicking "Post to CareVicinity" multiple times should not create duplicate jobs; CareVicinity should handle idempotency via the budget line ID.

---

## Functional Requirements

- **FR-001**: System MUST display a "Post to CareVicinity" button on the Planned Service modal when a service needs a supplier.
- **FR-002**: System MUST pass recipient details, service type, schedule, and budget line ID to CareVicinity via URL parameters or equivalent lightweight mechanism.
- **FR-003**: System MUST open CareVicinity in a new browser tab/window when the button is clicked.
- **FR-004**: System MUST update the button state from "Post to CareVicinity" to "View in CareVicinity" after a job has been posted.
- **FR-005**: System MUST NOT require webhooks or complex synchronisation for the first version.
- **FR-006**: System MUST allow CareVicinity to handle authentication independently (no shared session or OAuth required for v1).
- **FR-007**: System MUST ensure no PII is exposed in URL parameters beyond what is necessary for job creation.

---

## Key Entities

- **PlannedService**: The TC Portal entity representing a budgeted service that needs a supplier. Contains service type, schedule, budget line ID, and recipient reference.
- **CareVicinityJob**: The CareVicinity entity created when a job is posted. Linked back to TC Portal via the budget line ID.
- **BudgetLineID**: Stable identifier for a budget line item in TC Portal, used as the linkage key between the two platforms.

---

## Success Criteria

### Measurable Outcomes

- Increase in jobs posted through CareVicinity from TC Portal users (baseline to be established pre-launch).
- Reduction in time from "need supplier" to "job posted" for coordinators who use CV (target: >50% reduction).
- Budget line ID present on >95% of jobs posted via the integration.
- User satisfaction with the posting flow >4/5.

---

## Assumptions

- CareVicinity can accept context via URL parameters or a similar lightweight mechanism.
- Budget line ID format is stable and can be passed to CareVicinity.
- Users who click the button intend to post a job (not just browse CareVicinity).
- CareVicinity team has availability to build the receiving endpoint.
- No changes to TC Portal authentication are required.

---

## Dependencies

- CareVicinity team availability to build the receiving endpoint and pre-fill logic.
- Agreement on data contract between TC Portal and CareVicinity (fields, format, versioning).
- Auth flow decision (OAuth vs independent login) -- independent login assumed for v1.
- Budget line ID stability and availability in the Planned Service data model.

---

## Out of Scope

- Webhooks or real-time synchronisation between TC Portal and CareVicinity (accepted limitation for v1; manual refresh acceptable).
- Deep CareVicinity integration (job status updates, invoice matching automation).
- Changes to CareVicinity authentication (OAuth, session sharing).
- Self-managed recipient workflows (self-managed recipients organise their own care).
- Provider search or comparison functionality (covered by [Search Service Provider](/initiatives/Supplier-Management/Search-Service-Provider)).


## Clarification Outcomes

### Q1: [Scope] What is the CareVicinity API contract? Is there a documented API specification available?
**Answer:** The spec explicitly describes a lightweight URL-parameter-based integration, not an API integration. FR-005 states "System MUST NOT require webhooks or complex synchronisation for the first version." Context is passed via URL parameters when opening CareVicinity in a new tab. CareVicinity is a Trilogy-owned marketplace (sister platform). No formal API contract is needed for v1 — it is a simple deep-link with query parameters. The CareVicinity team builds the receiving endpoint to parse those parameters.

### Q2: [Dependency] Does this epic require SOP2 to be complete before suppliers can be posted to CareVicinity?
**Answer:** No. This feature posts JOBS to CareVicinity, not suppliers. The actor is a Care Coordinator posting a job from a Planned Service in TC Portal. The job goes to the CareVicinity marketplace where suppliers can respond. SOP2 (supplier onboarding) is unrelated — CVJ is about finding suppliers through CareVicinity, not managing existing suppliers. The dependency is on the Planned Service data model (`BudgetPlanItem` in `domain/Budget/Models/BudgetPlanItem.php`) being available, which it already is.

### Q3: [Data] What data is shared with CareVicinity? What data privacy considerations apply?
**Answer:** Per FR-002 and FR-007: recipient details, service type, schedule, and budget line ID are passed via URL parameters. FR-007 explicitly requires no PII beyond what is necessary for job creation. **Assumption:** "Recipient details" means first name and suburb (not full address or health information). The budget line ID is an internal reference. Since CareVicinity is a Trilogy-owned platform, data sharing occurs within the same organisational boundary, but the URL should still avoid sensitive PII as URL parameters are logged in browser history and server access logs.

### Q4: [Edge Case] What happens when a supplier is deactivated in Portal but still has active listings on CareVicinity?
**Answer:** Out of scope for v1. The spec explicitly excludes "Deep CareVicinity integration (job status updates, invoice matching automation)" and "Webhooks or real-time synchronisation." In v1, CareVicinity operates independently — deactivation sync would be a future enhancement. The budget line ID linkage (US3) establishes the foundation for eventual bidirectional sync.

### Q5: [Data] What is the "BudgetLineID" referenced as the linkage key?
**Answer:** The codebase has `BudgetPlanItem` (`domain/Budget/Models/BudgetPlanItem.php`) with an `id` field. The `PackageBudgetItem` model is also referenced in bill items. The budget line ID is likely the `BudgetPlanItem.id` or a composite key. The spec should clarify whether this is the `BudgetPlanItem.id`, the `PackageBudgetItem.id`, or a separate stable identifier. **Recommendation:** Use `BudgetPlanItem.id` as it represents the planned service level, which is what CareVicinity jobs correspond to.

### Q6: [Integration] How does the "Post to CareVicinity" / "View in CareVicinity" button state change persist?
**Answer:** US1 AC3 says "the button changes from 'Post to CareVicinity' to 'View in CareVicinity'" after a job has been posted. Since there are no webhooks in v1, the state must be tracked locally. Edge case 4 says "Portal should check if a CV job exists for this budget line ID and update the button state accordingly." This implies CareVicinity has an endpoint that TC Portal can query (GET by budget line ID). **Recommendation:** Clarify whether this is a lightweight polling check or if the state is stored locally in TC Portal when the user clicks "Post."

### Q7: [UX] Where does the button appear in the existing UI?
**Answer:** The spec says "Planned Service modal." The codebase has `BudgetPlanItem` views but the specific Planned Service modal would need to be identified in the Vue pages. The `SelectServicePlan.vue` exists at `resources/js/Pages/Bills/SelectServicePlan.vue`. **Assumption:** The button appears in a Planned Service detail modal or slide-out panel, not on the bill edit page. This needs UX design input.

### Q8: [Scope] The spec mentions "self-managed recipients" in Out of Scope. What is the permission model?
**Answer:** Only Care Coordinators should see the "Post to CareVicinity" button. The spec's US1 actor is "Care Coordinator." The existing permission model uses roles defined via Spatie permissions. **Recommendation:** FR-001 should specify which roles can see and use the button (Care Coordinator, Care Partner, Admin).

### Q9: [Edge Case] Multiple clicks / idempotency — who owns idempotency?
**Answer:** Edge case 5 says "CareVicinity should handle idempotency via the budget line ID." This means TC Portal fires and forgets — CareVicinity uses the budget line ID as a deduplication key. This is the correct approach for a lightweight v1 integration.

### Q10: [Dependency] Does the CareVicinity team have documented availability for this work?
**Answer:** Listed as a dependency. The spec assumes "CareVicinity team has availability to build the receiving endpoint." This is a cross-team dependency that should be tracked. No codebase evidence of CareVicinity integration exists beyond the spec and a `SoftDeleteSuppliersWithCareVicinityWorkersTag` action, confirming the platforms currently have minimal integration.

## Refined Requirements

1. **FR-002 Clarification**: Specify the exact data contract — which fields are passed, their format, and the URL structure. Example: `https://carevicinity.com/jobs/new?recipient_name=John&service_type=cleaning&schedule=weekly_3hrs&budget_line_id=12345`

2. **New AC for US1**: Given a Planned Service already has a supplier assigned, When the coordinator views the modal, Then the "Post to CareVicinity" button is NOT displayed (per edge case: button only appears when supplier is needed but not yet assigned).

3. **New FR**: System MUST store the CareVicinity job URL or reference locally after a job is posted, so the "View in CareVicinity" button can link back without requiring a CareVicinity API call.
