---
title: "Feature Specification: On Hold Bills Flow (OHB)"
---

> **[View Mockup](/mockups/on-hold-bills-flow/index.html)**{.mockup-link}


**Epic**: TP-3787
**Initiative**: TP-1857 Supplier Management
**Created**: 2026-01-15
**Status**: Ready for Implementation
**Input**: Raw context from discovery phase (IDEA-BRIEF.md, CONTEXT-MEMO.md, DESIGN-DECISIONS.md, WORKFLOW-PARAMETERS.md)
**Related Specs**: [db-spec.md](db-spec.md), [design.md](design.md), [plan.md](plan.md)

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Multi-Issue Diagnosis (Priority: P1)

As a **Bill Processor**, I need to see **all issues** with a bill identified upfront so that I can communicate everything to the supplier in one consolidated message, eliminating multiple rejection-resubmission cycles.

**Why this priority**: This is the core value proposition. Currently bills can only have ONE on-hold reason at a time, causing 60-70% of resubmissions to fail again due to undiscovered issues.

**Independent Test**: Can be fully tested by submitting a bill with multiple issues (e.g., ABN error + calculation error + missing itemization) and verifying ALL issues are identified and displayed in a single diagnosis report.

**Acceptance Scenarios**:

1. **Given** a bill submission with 3 distinct issues (ABN error, calculation error, missing itemization), **When** the bill processor initiates diagnosis, **Then** all 3 issues are identified and displayed simultaneously.

2. **Given** a bill with both invoice-level issues (ABN error) and contextual issues (funding pending), **When** diagnosis completes, **Then** both issue types are captured with their respective attributes (Touches_Invoice, Requires_Internal_Action).

3. **Given** a bill submission with no detectable issues, **When** diagnosis completes, **Then** the system indicates the bill is ready for payment processing with zero issues.

---

### User Story 2 - AI Auto-Reject for Disqualifiers (Priority: P1)

As a **Bill Processor**, I need bills with 99% AI-detectable disqualifiers to be instantly rejected so that obvious errors (missing ABN, calculation errors) don't consume manual review time.

**Why this priority**: 25% of reasons (9 out of 36) are auto-reject eligible. Instant rejection for these frees significant processing capacity.

**Independent Test**: Can be fully tested by submitting a bill with a known disqualifier (e.g., invalid ABN) and verifying immediate rejection without human intervention.

**Acceptance Scenarios**:

1. **Given** a bill with an invalid ABN, **When** submitted, **Then** the system auto-rejects within seconds with clear reason "ABN/GST error" and no human review required.

2. **Given** a bill with a calculation error (line items don't sum to total), **When** submitted, **Then** the system auto-rejects with specific error details showing expected vs actual totals.

3. **Given** a bill with issues that require human judgment (service type verification), **When** submitted, **Then** the system does NOT auto-reject and routes to appropriate department.

---

### User Story 3 - Department Routing with Discrete Outcome Tracking (Priority: P2)

As a **Department User** (Care/Compliance/Accounts), I need bills with issues in my domain routed to my queue with clear actions required so that I can resolve issues and record discrete outcomes (Resolved/Unresolved/Awaiting).

**Why this priority**: Internal coordination is a key bottleneck. This enables parallel processing across departments without blocking each other.

**Independent Test**: Can be fully tested by submitting a bill with a Care-specific reason (client approval required) and verifying it appears in the Care queue with actionable context.

**Acceptance Scenarios**:

1. **Given** a bill with "Client approval required" reason, **When** diagnosis completes, **Then** the issue is routed to Care team queue with client context and approval request actions.

2. **Given** a Care team member resolves "Client approval required" by obtaining approval, **When** they mark the reason as Resolved, **Then** the reason status updates and the system continues processing remaining issues.

3. **Given** a bill with 3 issues across 3 departments (Care, Compliance, Accounts), **When** routed, **Then** all 3 departments can work their reasons in parallel without waiting for each other.

---

### User Story 4 - Temporal Re-validation Before Communication (Priority: P2)

As a **System**, I need to re-validate time-sensitive qualifiers (funding balance, authorization status, supplier status) before sending any communication so that stale data doesn't cause incorrect approvals or misleading messages.

**Why this priority**: Context decay is a significant edge case. Funding available on Day 0 may be depleted by Day 15 when supplier resubmits.

**Independent Test**: Can be fully tested by diagnosing a bill, waiting for funding to change, then triggering re-validation and verifying new issues are discovered.

**Acceptance Scenarios**:

1. **Given** a bill on hold with funding_balance=$5000 at diagnosis, **When** temporal re-validation runs and funding_balance is now $0, **Then** a new reason "Insufficient balance" is added to the issue list.

2. **Given** a bill ready for payment after all reasons resolved, **When** temporal re-validation discovers supplier status changed to "Terminated", **Then** the communication type changes to REJECT PERIOD.

3. **Given** a bill with no time-sensitive qualifier changes, **When** temporal re-validation runs, **Then** no new reasons are added and processing continues.

---

### User Story 5 - Three Communication Types (Priority: P2)

As a **Supplier**, I need to receive one of three clear communication types (REJECT-RESUBMIT, REJECT PERIOD, ON HOLD) so that I understand exactly what action is expected from me.

**Why this priority**: Clear communication reduces supplier confusion and prevents wasted resubmission attempts.

**Independent Test**: Can be fully tested by creating bills that trigger each communication type and verifying correct subject/tone/resubmit link presence.

**Acceptance Scenarios**:

1. **Given** a bill with at least one reason that touches invoice (ABN error), **When** communication is generated, **Then** type is REJECT-RESUBMIT with resubmit link and actionable fix instructions.

2. **Given** a bill where supplier is terminated, **When** communication is generated, **Then** type is REJECT PERIOD with no resubmit link and clear "do not resubmit" message.

3. **Given** a bill with only contextual reasons awaiting external action (client approval pending), **When** communication is generated, **Then** type is ON HOLD with "no action needed from you" message.

---

### User Story 6 - Cadence Management for ON HOLD (Priority: P3)

As a **Bill Processor**, I need ON HOLD bills to follow a Day 0->3->7->10 cadence with automatic reminders and timeout so that bills don't sit indefinitely and external parties are prompted to act.

**Why this priority**: Without cadence, ON HOLD bills accumulate without resolution. Timeout forces closure.

**Independent Test**: Can be fully tested by placing a bill on hold and verifying reminder/warning messages are sent at Day 3 and Day 7, with timeout at Day 10.

**Acceptance Scenarios**:

1. **Given** a bill with ON HOLD communication sent on Day 0, **When** Day 3 is reached without resolution, **Then** a reminder communication is automatically sent.

2. **Given** an ON HOLD bill at Day 7, **When** Day 10 is reached without external party action, **Then** the bill is automatically rejected with REJECTED FINAL outcome.

3. **Given** an ON HOLD bill at Day 5, **When** the external party takes action resolving the hold, **Then** cadence stops, temporal re-validation runs, and processing continues toward payment.

---

### User Story 7 - Resolution Outreach vs Submitter Notification Streams (Priority: P3)

As a **System**, I need to distinguish between Resolution Outreach (to clients/coordinators seeking action) and Submitter Notification (to suppliers informing of outcome) so that privacy is preserved and appropriate parties receive appropriate messages.

**Why this priority**: Client-specific issues should not be disclosed to suppliers. Different recipients need different messages.

**Independent Test**: Can be fully tested by creating a bill requiring client approval and verifying client receives approval request while supplier receives only "other processes required" after 1-day window.

**Acceptance Scenarios**:

1. **Given** a bill with "Client approval required" reason, **When** Resolution Outreach is triggered, **Then** the client receives approval request, NOT the supplier.

2. **Given** a reason resolved within the 1-day Resolution Window, **When** processing completes, **Then** the supplier is never notified that the issue existed.

3. **Given** a reason NOT resolved within 1-day window, **When** the window expires, **Then** supplier receives generic "other processes required" notification without client-specific details.

---

### User Story 8 - Can Coexist Filter for Communication Clarity (Priority: P3)

As a **Supplier**, I need to receive only relevant issues in my communication so that dominant blockers (like termination) don't appear alongside fixable issues that are now irrelevant.

**Why this priority**: Listing "fix ABN" to a terminated supplier is confusing and wastes their time.

**Independent Test**: Can be fully tested by creating a bill with "Supplier terminated" plus invoice errors and verifying only termination appears in primary message.

**Acceptance Scenarios**:

1. **Given** a bill with "Supplier terminated" and 3 other invoice errors, **When** communication is generated, **Then** primary message focuses on termination with other issues listed only as "for future reference".

2. **Given** a bill with multiple coexisting invoice errors (ABN + calculation), **When** communication is generated, **Then** all errors are listed as actionable items.

---

### User Story 9 - Linked Resubmissions (Priority: P3)

As a **Bill Processor**, I need resubmissions to be linked to their original submission so that I can track "this is attempt #3 of the same invoice" for audit and analytics.

**Why this priority**: Understanding resubmission patterns helps identify systematic issues and measure improvement.

**Independent Test**: Can be fully tested by submitting a bill, receiving rejection, resubmitting, and verifying the new submission shows linkage to original.

**Acceptance Scenarios**:

1. **Given** a rejected bill (ID: SUB-001) that supplier resubmits, **When** the new submission is received, **Then** it is automatically or manually linked to SUB-001 as a resubmission.

2. **Given** a linked resubmission chain (SUB-001 -> SUB-002 -> SUB-003), **When** viewing any submission, **Then** the full history chain is visible.

---

### Edge Cases

- **Context Decay After Rejection**: What happens when funding available at rejection is depleted by resubmission? Temporal re-validation catches this but creates poor UX ("fix ABN" then "no funding"). Acknowledged trade-off.

- **Multiple Departments Working Same Bill**: What if one department is slow and blocks the entire bill? No hard timeouts on internal work - management visibility via analytics instead.

- **Supplier Terminated Mid-Process**: What if supplier is terminated while bill is on hold for client approval? Re-validation should catch termination and flip to REJECT PERIOD.

- **Resubmission Introduces NEW Issues**: What if fixed ABN submission has new calculation error? Treat as discrete submission diagnosed fresh, but linked to original for history.

- **Maximum Revalidation Loops**: What if context keeps changing (oscillating)? After 5 loops, trigger manual intervention.

## Requirements *(mandatory)*

### Functional Requirements

**Diagnosis & Detection**:
- **FR-001**: System MUST identify ALL issues with a bill submission during diagnosis (not just the first issue found)
- **FR-002**: System MUST classify each reason with `Touches_Invoice` (Boolean) attribute
- **FR-003**: System MUST classify each reason with `Requires_Internal_Action` (Boolean) attribute
- **FR-004**: System MUST support 36 defined on-hold reasons across 3 departments (16 Compliance, 14 Care, 6 Accounts)

**AI Auto-Reject**:
- **FR-005**: System MUST auto-reject bills with AI-detectable disqualifiers at 99% confidence threshold
- **FR-006**: System MUST support 9 auto-reject eligible reasons (ABN/GST error, Calculation error, Client name error, Itemisation error, Supplier terminated, Itemisation for contribution categories, Commencement date error, Termination date error, Finance QA failure)

**Department Routing**:
- **FR-007**: System MUST route reasons requiring internal action to appropriate department queues (Care/Compliance/Accounts)
- **FR-008**: System MUST allow department users to mark reason outcomes as Resolved, Unresolved, or Awaiting
- **FR-009**: System MUST support parallel processing of reasons across departments

**Temporal Re-validation**:
- **FR-010**: System MUST re-validate time-sensitive qualifiers before sending any communication
- **FR-011**: System MUST check: funding_balance, funding_period, authorization_status, supplier_status, service_eligibility
- **FR-012**: System MUST add new reasons if re-validation discovers changed context

**Communication**:
- **FR-013**: System MUST determine one of three communication types: REJECT-RESUBMIT, REJECT PERIOD, ON HOLD
- **FR-014**: System MUST include resubmit link ONLY in REJECT-RESUBMIT communications
- **FR-015**: System MUST apply Can Coexist filter to hide dominated issues in communications
- **FR-016**: System MUST distinguish Resolution Outreach (to clients/coordinators) from Submitter Notification (to suppliers)

**Cadence**:
- **FR-017**: System MUST implement Day 0->3->7->10 cadence ONLY for ON HOLD communication type
- **FR-018**: System MUST auto-reject after Day 10 timeout on ON HOLD path
- **FR-019**: System MUST NOT apply cadence to REJECT-RESUBMIT or REJECT PERIOD paths

**Resolution Window**:
- **FR-020**: System MUST implement 1-day Resolution Window for reasons requiring client/coordinator action
- **FR-021**: System MUST NOT notify supplier of issues resolved within Resolution Window
- **FR-022**: System MUST notify supplier of "other processes required" if window expires without resolution

**Submissions**:
- **FR-023**: System MUST treat resubmissions as discrete submissions (not version tracking)
- **FR-024**: System MUST support linking resubmissions to original submission for audit trail

**Outcomes**:
- **FR-025**: System MUST support three final outcomes: PAID, REJECTED FINAL, REJECTED RESUBMIT

### Key Entities

- **Submission**: A single invoice submission (discrete unit). Key attributes: submission_id, status, linked_to_original, communication_type, cadence_status, resolution_window_status, final_outcome
- **Reason**: A specific issue blocking payment (36 possible). Key attributes: reason_name, touches_invoice, requires_internal_action, auto_reject_eligible, department_owner, reason_status, requires_resolution_outreach, requires_revalidation, revalidation_checks, can_coexist_with, cadence_days
- **Department Queue**: Work items for Care/Compliance/Accounts. Key attributes: department, pending_reasons, assigned_user
- **Communication**: Messages sent to external parties. Key attributes: communication_type, payload, recipients, includes_resubmit_link, soft_warning
- **Cadence**: Countdown timer for ON HOLD path. Key attributes: current_day, next_action_date, status
- **Resolution Window**: 1-day grace period tracking. Key attributes: started_at, expires_at, status

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 60-70% reduction in resubmission cycles (suppliers fix all issues in one go instead of discovering issues sequentially)
- **SC-002**: 50% faster processing for auto-reject eligible bills (instant rejection vs manual review)
- **SC-003**: 40% reduction in duplicate work across departments (parallel processing instead of sequential handoffs)
- **SC-004**: 100% of communications include ALL relevant issues (no single-issue rejections requiring multiple rounds)
- **SC-005**: Day 10 timeout enforced on 100% of ON HOLD bills without external party action
- **SC-006**: 99% accuracy maintained for AI auto-reject (monitored via human review sampling)
- **SC-007**: 0% of supplier communications reveal client-specific details (privacy preserved via Resolution Outreach stream)
- **SC-008**: Audit trail available for 100% of submissions showing full reason history and linkage to resubmissions

## Clarifications

### Functional Clarifications (Session 2026-01-16)

- Q: Should OHB extend the existing 41 `BillOnHoldReasonsEnum` values, or use a separate reason taxonomy? -> A: New separate taxonomy preferred. Create parallel reason list with OHB-specific attributes, map to existing enum for compatibility. Final implementation approach deferred to dev team based on complexity assessment.
- Q: Where should OHB multi-issue diagnosis hook into the existing bill flow? -> A: At SUBMITTED → IN_REVIEW transition. Hook into existing `ReviewBillAction` / `BillValidator` where 25+ validation checks already run.
- Q: Should OHB use the existing `BillReminderService` (Day 0→3→7→10 cadence) or implement its own? -> A: Extend existing `BillReminderService`. Add OHB logic for two-stream communication (Resolution Outreach vs Submitter Notification), reuse notification infrastructure.

### Database Clarifications (Session 2026-01-16)

- Q: Should OHB fields be added to existing Bill model or separate table? -> A: Separate `bill_ohb_states` table with 1:1 relationship. Keeps OHB logic isolated, easier to feature-flag.
- Q: Should `reason_id` reference database table or enum? -> A: Database table (`ohb_reasons`). 36 reasons with 20+ attributes too complex for enum, allows runtime updates.
- Q: Should `bill_reasons` records be soft-deleted or hard-deleted? -> A: Soft delete. Audit trail critical per SC-008 requirement.
- Q: Expected bill volume? -> A: 5-6K bills/day (~150-180K/month). Need careful index optimization.
- Q: Primary query pattern for bill_reasons? -> A: Bill → Reasons (viewing bill). Department routing handled via Tasks system, not direct bill_reasons queries.

### UI/UX Clarifications (Session 2026-01-16)

- Q: Who is the primary user? -> A: Bill Processor (sees all reasons, triggers comms). However, the holistic bill view should be accessible to ANY internal user when they need full context. Department users primarily work via Tasks but can drill into the full bill view.
- Q: What happens when a department user clicks a task notification? -> A: Opens Focused Reason Modal with reason details, status, department action, and resolution notes field. "View Full Bill" link available for holistic context.
- Q: How should reasons be displayed? -> A: Traffic-light checklist pattern: BLOCKING (red) → COMPLETE (green) → WARNINGS (amber). Secondary grouping by separation of concerns (Bill-level, Supplier-related, Care Recipient).
- Q: Where should the checklist appear? -> A: Integrate into existing Bills/Edit.vue as collapsible right panel (IDE-style layout).
- Q: How should real-time updates work? -> A: Polling every 30-60s with "Updated X ago" indicator. WebSockets considered overkill for this workflow.

### Core Design Principle

**Batch → Single Communique**: All unresolved reasons are consolidated into ONE communication to the supplier. The system determines ONE COMMS TYPE based on batch characteristics, sends ONE message with all relevant issues. This is the key differentiator from the current single-reason-at-a-time approach.


## Clarification Outcomes

### Q1: [Scope] How does OHB interact with other epics that introduce on-hold reasons?
**Answer:** OHB is the CANONICAL on-hold management system. FR-004 defines 36 on-hold reasons across 3 departments (16 Compliance, 14 Care, 6 Accounts). The existing `BillOnHoldReasonsEnum` has 41+ values already in the codebase (including `UNPLANNED_SERVICES_REACHED_CAP`, `UNVERIFIED_FUNDING_STREAM`, `INSUFFICIENT_BALANCE`, etc.). The clarification session (2026-01-16) decided: "New separate taxonomy preferred. Create parallel reason list with OHB-specific attributes, map to existing enum for compatibility." Other epics (SVF for compliance holds, Express Pay for payment eligibility) would add reasons to this taxonomy.

### Q2: [Dependency] Which epic leads the resubmission UI pattern — OHB or SBS?
**Answer:** OHB defines the resubmission LOGIC (FR-023, FR-024 — linked resubmissions, discrete submissions). SBS (Supplier Bill Submission) defines the supplier-facing resubmission UI (SBS FR-022: "REJECT-RESUBMIT bills MUST show a [Resubmit] action that reopens the existing bill for editing"). The SBS spec explicitly references OHB's communication types and reason filtering (SBS FR-020 to FR-024). OHB leads the business logic; SBS implements the supplier-facing view. This cross-epic dependency is well-documented.

### Q3: [Data] What are all 36 on-hold reasons?
**Answer:** The spec states 36 reasons: 16 Compliance + 14 Care + 6 Accounts. The existing `BillOnHoldReasonsEnum` has cases including: `SERVICE_DATE_PRIOR_TO_1ST_NOVEMBER`, `UNPLANNED_SERVICES_REACHED_CAP`, `UNVERIFIED_FUNDING_STREAM`, `UNAPPROVED_SERVICES`, `AT_HM`, `INSUFFICIENT_BALANCE`, and many more. The clarification session decided to use a DATABASE TABLE (`ohb_reasons`) rather than an enum because "36 reasons with 20+ attributes too complex for enum, allows runtime updates." Each reason has attributes: `touches_invoice`, `requires_internal_action`, `auto_reject_eligible`, `department_owner`, `requires_resolution_outreach`, `requires_revalidation`, `can_coexist_with`, `cadence_days`. This is well-specified in the db-spec.md companion document.

### Q4: [Edge Case] What is the maximum time a bill can remain on hold?
**Answer:** FR-017 through FR-019 define the cadence: Day 0→3→7→10. FR-018 states "System MUST auto-reject after Day 10 timeout on ON HOLD path." This only applies to the ON HOLD communication type. REJECT-RESUBMIT has no cadence (supplier acts on their own timeline). REJECT PERIOD has no cadence (bill is permanently rejected). The maximum on-hold duration is 10 days, after which the bill auto-rejects with `REJECTED FINAL` outcome.

### Q5: [UX] Who sees on-hold bills?
**Answer:** The clarification session states: "Bill Processor (sees all reasons, triggers comms). However, the holistic bill view should be accessible to ANY internal user when they need full context. Department users primarily work via Tasks." The codebase confirms this — there are tables for various roles: `OnHoldBillsTable.php`, `CarePartnerOnHoldBillsTable.php`, `CareCoordinatorBillsTable.php`. Each role gets a filtered view. The OHB checklist panel integrates into `Bills/Edit.vue` as a "collapsible right panel."

### Q6: [Data] The spec uses separate `bill_ohb_states` and `bill_reasons` tables. How does this relate to the existing Bill model?
**Answer:** The clarification session explicitly decided: "Separate `bill_ohb_states` table with 1:1 relationship. Keeps OHB logic isolated, easier to feature-flag." The `Bill` model would have a `hasOne` relationship to `BillOhbState`. The `bill_reasons` table links bills to `ohb_reasons` with per-reason status tracking. This follows good isolation practices and allows OHB to be feature-flagged without touching the core Bill model.

### Q7: [Integration] How does the auto-reject (FR-005, FR-006) integrate with existing bill rejection?
**Answer:** The existing `BillStageEnum` has `REJECTED`. The codebase has rejection actions and notification infrastructure (`BillRejectedReasonsEnum`, `RejectBill` action). OHB auto-reject would transition bills from `SUBMITTED` → `REJECTED` with the specific auto-reject reason logged. The 9 auto-reject eligible reasons (ABN/GST error, Calculation error, Client name error, etc.) are validated at 99% confidence — this is the AI detection threshold. The existing `BillValidator` is the integration point.

### Q8: [Performance] With 5-6K bills/day, how does multi-issue diagnosis scale?
**Answer:** The clarification session addressed this: "Need careful index optimization" on `bill_reasons`. Primary query pattern is "Bill → Reasons" (viewing a specific bill). Department routing uses the existing Tasks system, not direct `bill_reasons` queries. FR-001 requires identifying ALL issues during diagnosis — this runs once at `SUBMITTED` → `IN_REVIEW` transition, not continuously. The diagnosis is a batch check, not a real-time query against all bills.

### Q9: [UX] The traffic-light checklist pattern (BLOCKING red → COMPLETE green → WARNINGS amber) — is this consistent with the OHB isolation rule?
**Answer:** The memory notes an "OHB Isolation Rule: OHB must not touch existing bill edit views, controllers, services, or data structures." The OHB checklist panel is a NEW panel added to the right side of `Bills/Edit.vue` (IDE-style layout). It does not modify existing bill edit components — it adds alongside them. This is consistent with the isolation rule.

### Q10: [Edge Case] What happens when all reasons are resolved but temporal re-validation discovers new issues?
**Answer:** FR-010 through FR-012 handle this. Re-validation runs before any communication is sent. If funding balance changed, a new "Insufficient balance" reason is added. US4 AC1 tests this exact scenario. The spec acknowledges this as a "poor UX" trade-off ("fix ABN" then "no funding") but it is necessary for correctness. After 5 re-validation loops, manual intervention is triggered (edge case: "Maximum Revalidation Loops").

### Q11: [Scope] The 1-day Resolution Window (FR-020 to FR-022) — is this calendar days or business days?
**Answer:** Not specified. **Assumption:** Calendar days, since the cadence (Day 0→3→7→10) appears to be calendar days. Supplier communications happen regardless of business days. **Recommendation:** Explicitly specify calendar days in the FR definitions.

## Refined Requirements

1. **FR-017 Clarification**: Specify that cadence days are CALENDAR days, not business days.

2. **New AC for US2**: Given a bill has a mix of auto-reject eligible and non-auto-reject reasons, When the auto-reject reasons are detected at 99% confidence, Then ONLY the auto-reject eligible reasons trigger immediate rejection — the system does not auto-reject if the bill ALSO has non-auto-reject reasons that require human judgment.

3. **New AC for US9**: Given a resubmission chain has 3+ submissions, When viewing any submission in the chain, Then the full chain is visible with timestamps and reasons for each rejection, enabling pattern analysis.
