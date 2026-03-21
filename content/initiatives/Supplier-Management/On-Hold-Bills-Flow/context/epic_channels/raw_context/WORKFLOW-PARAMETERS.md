# Workflow Parameters Reference

**Epic**: TP-3787 | **Initiative**: TP-1857 Supplier Management | **Code**: OHB
**Date Created**: 2026-01-12
**Last Updated**: 2026-01-13

This document defines all parameters (variables) used in the On Hold Bills Flow workflow and their possible values.

---

## Submission-Level Parameters

### Submission Status
**Type**: Enumeration
**Description**: Current state of the bill submission in the workflow
**Possible Values**:
- `Received` - Initial state when bill first submitted
- `In Diagnosis` - Multi-issue diagnosis in progress
- `Routing to Departments` - Being routed to Care/Compliance/Accounts
- `Awaiting Department Work` - Waiting for internal departments to complete work
- `In Temporal Revalidation` - Re-checking time-sensitive qualifiers
- `Awaiting Communication` - Communication being drafted
- `On Hold` - Communication sent, waiting for external party action
- `Awaiting Resubmission` - Rejected, waiting for supplier to resubmit
- `Paid` - Final outcome: payment processed
- `Rejected Final` - Final outcome: permanently rejected

### Auto-Reject Eligible
**Type**: Boolean
**Description**: Whether the bill can be instantly rejected by AI (99% accuracy)
**Possible Values**:
- `true` - Bill has disqualifying issue detectable by AI (e.g., missing ABN, calculation error)
- `false` - Requires human review

### Communication Type
**Type**: Enumeration
**Description**: The type of communication sent to external parties
**Possible Values**:
- `REJECT-RESUBMIT` - At least one reason touches invoice; supplier must fix and resubmit
- `REJECT PERIOD` - Permanent rejection; do not resubmit
- `ON HOLD` - All reasons are contextual; no resubmission needed, waiting for resolution

### Limited Time Soft Warning
**Type**: Boolean
**Description**: Whether time-sensitive qualifier warning is included in communication
**Possible Values**:
- `true` - Time-sensitive qualifiers detected (funding depletion, authorization expiry, etc.)
- `false` - No time-sensitive urgency

### Cadence Status
**Type**: Enumeration
**Description**: Current stage in the Day 0→3→7→10 countdown (ON HOLD path only)
**Possible Values**:
- `null` - No cadence (REJECT-RESUBMIT or REJECT PERIOD paths)
- `Day 0` - Communication just sent
- `Day 3` - Reminder sent
- `Day 7` - Final warning sent
- `Day 10` - Timeout reached
- `Resolved` - External party acted before timeout

### Resolution Window Status (Added 2026-01-13)
**Type**: Enumeration
**Description**: Status of the 1-day grace period for reasons requiring client/coordinator action
**Possible Values**:
- `null` - No resolution window (no reasons require Resolution Outreach)
- `Active` - Within 1-day window, awaiting resolution
- `Resolved` - Issue resolved within window (supplier never notified)
- `Expired` - Window expired, supplier notified of "other processes required"

### Communication Stream (Added 2026-01-13)
**Type**: Enumeration
**Description**: Which communication stream is currently active for this submission
**Possible Values**:
- `Resolution Outreach` - Comms to Client/Coordinator during department work phase
- `Submitter Notification` - Comms to Supplier after COMMS TYPE determined
- `Both` - Parallel streams active (Resolution Outreach ongoing + Supplier notified of "other processes")

---

## Reason-Level Parameters

### Reason
**Type**: String (36 possible values)
**Description**: The specific on-hold reason blocking payment
**Examples**:
- `ABN/GST error`
- `Supplier not verified`
- `Client approval required`
- `Insufficient balance`
- `Supplier terminated`
- (See `master-list-schema-updated.csv` for complete list of 36 reasons)

### Touches Invoice
**Type**: Boolean
**Description**: Whether the issue is WITH the invoice itself (requires resubmission)
**Possible Values**:
- `true` - Issue requires invoice changes/resubmission (e.g., ABN error, calculation error, missing itemization)
- `false` - Issue is contextual/environmental (e.g., funding balance, supplier status, client approval)

### Requires Internal Action
**Type**: Boolean
**Description**: Whether department work is needed before communicating outcome
**Possible Values**:
- `true` - Care/Compliance/Accounts must investigate/approve before outcome known
- `false` - Can communicate directly to supplier without internal work

### Reason Status (Individual)
**Type**: Enumeration
**Description**: Current state of a specific reason after department work
**Possible Values**:
- `Resolved` - Issue has been fixed/approved
- `Unresolved` - Issue still exists and cannot be resolved internally
- `Awaiting` - Waiting for external party to act (supplier, client, coordinator)

### Department Owner
**Type**: Enumeration
**Description**: Which department is responsible for this reason
**Possible Values**:
- `Care` - Care Team
- `Compliance` - Compliance Team
- `Accounts` - Accounts Team
- `Auto` - Automated/AI handling (no department work needed)

### Auto-Reject Eligible (Reason-Level)
**Type**: Boolean
**Description**: Whether AI can detect this reason with 99% accuracy
**Possible Values**:
- `true` - Eligible for instant AI rejection (9 out of 36 reasons)
- `false` - Requires human review (27 out of 36 reasons)

### Has Timeout
**Type**: Boolean
**Description**: Whether this reason has a Day 10 timeout
**Possible Values**:
- `true` - Standard 10-day timeout applies (26 out of 36 reasons)
- `false` - No fixed timeline or instant decision (10 out of 36 reasons)

### Requires Revalidation
**Type**: Boolean
**Description**: Whether time-sensitive qualifiers must be re-checked before communication
**Possible Values**:
- `true` - Must re-check funding, dates, authorization, etc.
- `false` - Static reason, no temporal re-check needed

### Revalidation Checks
**Type**: Array of Enumerations
**Description**: Which specific qualifiers to re-check during temporal re-validation
**Possible Values** (can be multiple):
- `funding_balance` - Check client's current funding balance
- `funding_period` - Check if funding period is still active
- `authorization_status` - Check if service authorization is still valid
- `supplier_status` - Check if supplier is still active/verified
- `service_eligibility` - Check if client is still eligible for service type
- `null` - No re-validation needed

### Can Coexist With
**Type**: Array of Strings
**Description**: Which other reasons can be communicated simultaneously with this one
**Possible Values**:
- `All` - Can be communicated with all other reasons
- `All except [Reason Name]` - Can coexist with all except specific blockers (e.g., "Supplier terminated")
- `[Reason Name 1], [Reason Name 2], ...` - Explicit list of compatible reasons
- `None` - Dominates all other reasons (e.g., "Supplier terminated" hides other issues)

### Requires Resolution Outreach (Added 2026-01-13)
**Type**: Boolean
**Description**: Whether this reason requires client/coordinator action during resolution phase
**Possible Values**:
- `true` - Client or coordinator must take action (approvals, confirmations, documentation)
- `false` - Pure internal work or supplier-facing issue only
**Examples**:
- TRUE: `Client approval required`, `Coordinator approval required`, `Insufficient balance` (may need VC discussion)
- FALSE: `ABN/GST error` (supplier issue), `Missing supplier bank details` (accounts lookup)
**Workflow Impact**:
- If TRUE → Resolution Outreach sent immediately during department work
- If TRUE and resolved within 1-day Resolution Window → supplier never notified
- If TRUE and NOT resolved within 1 day → supplier gets "other processes required" notification

### Cadence Days
**Type**: Integer
**Description**: Number of days before timeout for this reason
**Possible Values**:
- `0` - Instant decision (auto-reject)
- `10` - Standard 10-day countdown (most reasons)
- `null` - No fixed timeline (e.g., ATHM, Supplier performance improvement)

---

## Decision Point Parameters

### New Reasons Added?
**Type**: Boolean
**Description**: Whether temporal re-validation discovered new issues
**Possible Values**:
- `true` - New reasons added (e.g., funding depleted during hold) → Loop back to Diagnosis
- `false` - No new issues discovered → Continue to next step

### Any Reason Still Unresolved?
**Type**: Boolean
**Description**: After temporal re-validation, are any reasons still unresolved?
**Possible Values**:
- `true` - At least one reason remains unresolved → Continue to communication path
- `false` - All reasons resolved → Proceed to Payment

### Any Reason Disqualifies Future Attempts?
**Type**: Boolean
**Description**: Is there a permanent blocker preventing any future submissions?
**Possible Values**:
- `true` - Permanent block exists (e.g., Supplier terminated) → COMMS TYPE = REJECT PERIOD
- `false` - No permanent block → Continue to next decision

### Any Reason Touches Invoice?
**Type**: Boolean
**Description**: Do any unresolved reasons require invoice changes?
**Possible Values**:
- `true` - At least one reason requires invoice resubmission → COMMS TYPE = REJECT-RESUBMIT
- `false` - All reasons are contextual → Continue to next decision

### Any Reason Status = Awaiting External Action?
**Type**: Boolean
**Description**: Are any reasons waiting for external party to act?
**Possible Values**:
- `true` - Waiting for supplier/client/coordinator action → COMMS TYPE = ON HOLD
- `false` - No external action needed, but still unresolved → COMMS TYPE = REJECT PERIOD

### Passed Re-validation?
**Type**: Boolean
**Description**: After ON HOLD resolution or timeout, do all qualifiers still pass?
**Possible Values**:
- `true` - All time-sensitive checks pass → Proceed to Payment
- `false` - New issues discovered (e.g., funding depleted) → Loop back to Diagnosis

---

## Communication Parameters

### Communication Payload
**Type**: Object/Array
**Description**: All external-facing issues included in the message
**Structure**:
```
{
  "reasons": [
    {
      "reason_name": "ABN/GST error",
      "description": "Invoice contains inactive ABN...",
      "action_required": "Submit corrected invoice with valid ABN"
    },
    ...
  ],
  "resubmit_link": "https://portal.example.com/resubmit/12345",
  "soft_warning": "Note: Client funding expires 2026-02-15. Please resubmit promptly.",
  "recipients": ["supplier", "client", "coordinator"]
}
```

### Recipients
**Type**: Array of Enumerations
**Description**: Who receives this communication (filtered by sensitivity)
**Possible Values**:
- `Supplier` - External supplier/provider
- `Client` - Client (or client's coordinator)
- `Coordinator` - Support coordinator
- (May include multiple recipients with different filtered payloads)

### Includes Resubmit Link
**Type**: Boolean
**Description**: Whether communication includes a resubmission link
**Possible Values**:
- `true` - REJECT-RESUBMIT path only
- `false` - REJECT PERIOD and ON HOLD paths

---

## Temporal Parameters

### Funding Balance
**Type**: Decimal
**Description**: Client's current available funding balance
**Possible Values**:
- Any positive decimal (e.g., `5000.00`)
- `0.00` - No funds remaining
- **Re-checked during**: Temporal Re-validation, Temporal Recheck (ON HOLD)

### Funding Period Start/End
**Type**: Date
**Description**: Date range for client's funding period
**Format**: `YYYY-MM-DD`
**Re-checked during**: Temporal Re-validation, Temporal Recheck (ON HOLD)

### Authorization Status
**Type**: Enumeration
**Description**: Current status of service authorization
**Possible Values**:
- `Active` - Authorization is valid
- `Expired` - Authorization has lapsed
- `Pending` - Authorization approval pending
- `Cancelled` - Authorization revoked
- **Re-checked during**: Temporal Re-validation, Temporal Recheck (ON HOLD)

### Supplier Status
**Type**: Enumeration
**Description**: Current status of the supplier in the system
**Possible Values**:
- `Active` - Supplier verified and active
- `Pending Verification` - Not yet verified
- `Terminated` - Supplier no longer active (triggers REJECT PERIOD)
- `Suspended` - Temporarily inactive
- **Re-checked during**: Temporal Re-validation, Temporal Recheck (ON HOLD)

### Service Eligibility
**Type**: Boolean
**Description**: Whether client is still eligible for the service type on invoice
**Possible Values**:
- `true` - Client eligible
- `false` - Client no longer eligible (status changed)
- **Re-checked during**: Temporal Re-validation, Temporal Recheck (ON HOLD)

---

## Workflow Control Parameters

### Current Day in Cadence
**Type**: Integer
**Description**: Days elapsed since ON HOLD communication sent
**Possible Values**:
- `0` - Day of initial communication
- `1-2` - Between Day 0 and Day 3
- `3` - Reminder sent
- `4-6` - Between Day 3 and Day 7
- `7` - Final warning sent
- `8-9` - Between Day 7 and Day 10
- `10` - Timeout reached

### Submission Linked to Original
**Type**: String (Submission ID)
**Description**: If this is a resubmission, link to the original submission ID
**Possible Values**:
- `null` - Original submission
- `[Submission ID]` - ID of the original submission this one is linked to (e.g., `SUB-12345`)

---

## System Constants

### AI Accuracy Threshold
**Type**: Percentage
**Value**: `99%`
**Description**: Required AI confidence level for auto-reject

### Default Cadence Timeline
**Type**: Array of Integers
**Value**: `[0, 3, 7, 10]`
**Description**: Day markers for ON HOLD cadence (comms sent, reminder, warning, timeout)

### Maximum Revalidation Loops
**Type**: Integer
**Value**: `5` (recommended)
**Description**: Maximum times temporal re-validation can add new reasons before manual intervention

---

## Final Outcomes (Terminal States)

### Outcome
**Type**: Enumeration
**Description**: The final result of processing this submission
**Possible Values**:
- `PAID` - Bill successfully processed and payment initiated
- `REJECTED FINAL` - Bill permanently rejected (no further action possible)
- `REJECTED RESUBMIT` - Bill rejected, supplier may submit corrected version as new linked submission

---

## Usage Notes

1. **Batch vs Individual Processing**:
   - Early workflow parameters operate on **individual reasons** (e.g., Reason Status)
   - Later workflow parameters operate on **batches/collections** (e.g., Communication Type)

2. **Temporal Re-validation**:
   - Always occurs BEFORE drafting communication
   - May ADD new reasons if context changed (e.g., funding depleted)
   - If new reasons added → loop back to Diagnosis

3. **Can Coexist Filter**:
   - Determines which reasons to include in communication
   - Example: "Supplier terminated" dominates → hide other invoice issues
   - Applied AFTER temporal re-validation, BEFORE drafting communication

4. **Communication Type Logic**:
   - Determined by batch characteristics of ALL unresolved reasons
   - Decision cascade: Disqualifies? → Touches Invoice? → Awaiting External?

5. **Cadence Only on ON HOLD**:
   - REJECT-RESUBMIT: No cadence (supplier resubmits whenever)
   - REJECT PERIOD: No cadence (final rejection)
   - ON HOLD: Day 0→3→7→10 countdown for external party response

6. **Two Communication Streams** (Added 2026-01-13):
   - **Resolution Outreach**: Sent to Client/Coordinator during department work phase (uses Day_0/3/7/10 templates)
   - **Submitter Notification**: Sent to Supplier after COMMS TYPE determined
   - These are DISTINCT streams with different recipients, timing, and purpose

7. **Resolution Window** (Added 2026-01-13):
   - 1-day grace period for reasons requiring client/coordinator action
   - If resolved within window → supplier never knows
   - If NOT resolved → supplier gets "other processes required" (privacy preserved)
   - Only applies to reasons where `Requires_Resolution_Outreach = TRUE`

---

**Document Version**: 1.1
**Last Updated**: 2026-01-13

**Changelog**:
- v1.1 (2026-01-13): Added Resolution Window Status, Communication Stream, Requires Resolution Outreach parameters. Updated Usage Notes.
- v1.0 (2026-01-12): Initial parameters document.
