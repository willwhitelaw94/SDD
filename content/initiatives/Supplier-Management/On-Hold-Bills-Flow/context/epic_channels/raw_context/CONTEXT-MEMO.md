# Context Memo: On Hold Bills Flow (OHB) Epic

**Epic**: TP-3787 | **Initiative**: TP-1857 Supplier Management | **Code**: OHB
**Date Created**: 2026-01-09
**Last Updated**: 2026-01-13
**Status**: Requirements gathering and flow design phase

---

## What This Epic Is About

### The Problem
Trilogy Care processes hundreds of thousands of bill line items monthly. Bills that can't be auto-rejected or auto-paid go "on hold". Currently, the system can only assign **ONE on-hold reason per bill at a time**, creating:
- Multiple rejection-resubmission cycles (suppliers fix one issue, resubmit, hit a new issue)
- No coordination between departments (Care, Compliance, Accounts) for internal resolution
- Bottlenecks, delayed payments, wasted capacity on preventable resubmissions
- Poor supplier and client experience

### The Solution
Build a **multi-issue tracking system with AI-assisted diagnosis** that:
1. Identifies ALL issues with a bill upfront (not just the first one found)
2. Routes internal reasons to appropriate departments with discrete outcome tracking
3. Auto-rejects bills with 99% AI-detectable disqualifiers instantly
4. Re-validates time-sensitive qualifiers (funding, dates) before final communication
5. Sends ONE consolidated communication to suppliers/clients listing all issues

---

## Key Design Decisions Made

### 1. Submission Identity: Discrete Units, Not Versions
- **Decision**: Treat each resubmission as a **discrete submission** (not version tracking)
- **Why**: Prevents messiness when new issues appear on second/third attempts
- **Requirement**: Need a linking mechanism to track "this is attempt #3 of the same invoice"
- **Example**:
  - Submission 1: Rejected for missing ABN
  - Submission 2 (linked to #1): ABN fixed, but NEW issue (calculation error)
  - Each diagnosed fresh, but history tracked

### 2. Two Critical Dimensions for Reasons

#### Dimension 1: Touches Invoice? (Y/N)
- **TRUE**: Issue is WITH the invoice itself → Must reject and request resubmission
  - Examples: Missing ABN, calculation error, missing itemization, wrong dates
- **FALSE**: Issue is contextual/environmental → Same submission can proceed if context changes
  - Examples: Supplier not verified, client approval pending, insufficient balance

#### Dimension 2: Requires Internal Action? (Y/N)
- **TRUE**: Needs department (Care/Compliance/Accounts) to investigate/approve before we can communicate outcome
  - Examples: Client approval needed, funding verification, supplier performance review
- **FALSE**: Can communicate directly to supplier without internal work
  - Examples: Missing ABN, calculation error (bill processor identifies, communicates immediately)

**Note**: Originally called "Internal/External" but that was too vague. Changed to "Requires Internal Action" for clarity.

### 3. Outcomes vs Status
- **Status** (during processing): Resolved, Unresolved, Awaiting
- **Final Outcomes** (for submission): PAID or REJECTED
- "Pending" is NOT an outcome - it's a temporal status while waiting

### 4. Communication Strategy

**Rule**: If ANY reason touches invoice → Bill REJECTED (even if some reasons don't touch invoice)

**Critical Concept: Batch → Single Communique**
- All unresolved reasons are collected as a **batch**
- The COMMS TYPE decision cascade asks "does ANY reason in this batch have this characteristic?"
- The result is **ONE communication type** for the entire batch
- ALL reasons are consolidated into **ONE communique** to the supplier
- This is NOT per-reason communication - it's batch-level communication

**Three Communication Types** (determined by batch characteristics):
1. **REJECT-RESUBMIT**: At least one reason touches invoice → supplier must fix and resubmit (includes resubmit link)
   - May include **Resubmit Soft Warning** if time-sensitive qualifiers detected (e.g., funding close to depletion, authorization nearing expiry)
2. **REJECT PERIOD**: Permanent rejection (e.g., supplier terminated) → do not resubmit (no resubmit link)
3. **ON HOLD**: All reasons are contextual (don't touch invoice) → same bill can proceed once resolved (no resubmit needed)

**Communication Type vs Payload**:
- **Communication TYPE** = Subject/tone of message ("Rejected - Resubmit" vs "On Hold" vs "Rejected - Do Not Resubmit")
- **Communication PAYLOAD** = Always includes ALL detected external-facing issues (regardless of type)
- **Single Communique**: All reasons consolidated into one message - not multiple messages per reason
- **Example**: Even if bill is REJECT PERIOD (dead on arrival), message still lists other issues for supplier to avoid in future submissions ("This invoice cannot be paid because [primary blocker]. Additionally, for future submissions, please note: [other issues]")

### 5. The Context Decay Problem
- **Issue**: Bill rejected Day 0 for missing ABN, supplier resubmits Day 15, but client's funding depleted in meantime
- **Solution**: **Temporal Re-validation** - Always re-check time-sensitive qualifiers (funding balance, dates, authorization) BEFORE sending communication
- **Trade-off**: Creates poor UX ("fix ABN" then "sorry no money now") but unavoidable
- **Status**: Flagged as edge case, deferred for now (potential future: fund reservation system)

### 6. Cadence Logic
- **Cadence** = countdown timer for external parties to respond (Day 0 → 3 → 7 → 10)
- **Applies to**:
  - **ON HOLD** communication type (waiting for external party action)
  - **REJECT-RESUBMIT** with time-sensitive qualifiers (optional soft warning)
- **Does NOT apply to**:
  - **REJECT PERIOD** (final rejection, no action expected)
  - **Auto-reject** (instant rejection)
  - Internal department work (no hard timeouts on internal work)
- **Triggers**: AFTER communication sent, not before
- **Timeout**: Day 10 → Reject if still unresolved (ON HOLD path only)

### 7. Two Communication Streams (Added 2026-01-13)

The workflow has two distinct communication streams:

| Stream | Recipient | Purpose | When |
|--------|-----------|---------|------|
| **Resolution Outreach** | Client, Coordinator (NOT bill submitter) | Request action to resolve contextual issues | During department work phase |
| **Submitter Notification** | Supplier (bill submitter) | Inform of outcome or status | After COMMS TYPE determined |

**Key distinctions**:
- **Resolution Outreach** = action-seeking comms to stakeholders who can resolve the hold
- **Submitter Notification** = informational comms to whoever submitted the bill
- The Day_0/Day_3/Day_7/Day_10 columns in master list are **Resolution Outreach** templates

### 8. Parallel Processing with Resolution Window (Added 2026-01-13)

**Decision**: Process all reasons **in parallel** with a **1-day Resolution Window** for reasons requiring client/coordinator action.

**How it works**:
1. Bill diagnosed → routed to departments (parallel)
2. If reason requires client/coordinator action → **Resolution Outreach** sent immediately
3. **1-day grace period**: If resolved within 1 day → supplier NEVER knows there was an issue
4. **If NOT resolved in 1 day** → supplier informed: "Your invoice is on hold. Other processes required." (privacy preserved - no client details shared)
5. All departments complete → temporal re-validation → determine COMMS TYPE → Submitter Notification

**Why parallel (not sequential)?**
- **Speed**: Internal issues worked simultaneously
- **Efficiency**: Departments work independently
- **Privacy**: Quick internal resolutions stay internal

**Schema implication**: New column `Requires_Resolution_Outreach` (Boolean) identifies which reasons need client/coordinator action during resolution phase.

### 9. Can Coexist Filter
- **Purpose**: Determine which reasons to include in communication (optimize clarity)
- **Example**: "Supplier terminated" dominates → hide other invoice defects (terminated supplier can't fix them anyway)
- **Applies**: Before communication sent, after temporal re-validation
- **Schema column**: `Can_Coexist_With` - defines which reasons can/cannot be communicated together

---

## Work Completed

### 1. IDEA-BRIEF.md Created
- Location: `.claude/INITIATIVES/TP-1857-Supplier-Management/TP-3787-OHB-On-Hold-Bills-Flow/IDEA-BRIEF.md`
- Format: Lean, 1-page executive summary (94 lines)
- Sections: Problem, Solution, Benefits, Stakeholders, Assumptions/Dependencies/Risks, Effort, Scope, Decision

### 2. Jira Tasks Created
- **TP-3813**: Receive reason data from care (Assigned: Romy Blacklaw)
- **TP-3814**: Receive reason data from compliance (Assigned: Zoe Judd)
- **TP-3815**: Receive reason data from accounts (Assigned: Mellette Opena)
- **TP-3816**: Compile reason master list (Assigned: David Henry)

**Purpose**: Gather all on-hold reasons from 3 departments, compile/de-duplicate into master list

### 3. Master List Schema Created
- **Source**: `compliance-reasons-schema.csv` (original from compliance team)
- **Output**: `master-list-schema-updated.csv` (new 23-column schema)
- **Total Reasons**: 36 (16 Compliance, 14 Care, 6 Accounts)
- **Migration Notes**: `SCHEMA-MIGRATION-NOTES.md` documents automated vs manual review items

#### New Schema Columns (23 total):
1. Reason (name, used as ID - no arbitrary codes)
2. Description
3. Department_Owner (Care/Compliance/Accounts/Auto)
4. Touches_Invoice (Boolean)
5. Auto_Reject_Eligible (Boolean - 99% AI accuracy)
6. Cadence_Days (0, 10, null)
7. Has_Timeout (Boolean)
8. Bill_Processor_Action
9. Department_Action
10. Supplier_Action_Required
11. Possible_Outcomes
12. Success_Outcome
13. Failure_Outcome
14. Day_0_Comms
15. Day_3_Comms
16. Day_7_Comms
17. Day_10_Comms
18. Requires_Revalidation (Boolean)
19. Revalidation_Checks (array: funding_balance, funding_period, etc.)
20. Can_Coexist_With (defines communication filtering rules)
21. Key_Principles
22. Examples
23. Notes

#### Migration Status:
- **70% automated** (direct mappings, inferences)
- **30% flagged for manual review** (Can_Coexist_With, Revalidation_Checks, Auto_Reject_Eligible validation)

### 4. Workflow Diagrams
- **Original**: `workflow-diagram.jpg` (hand-drawn Frame 1)
- **Updated**: Flow evolved through 3 iterations based on design discussions
- **Current status**: Mermaid code needs correction (identified issues with COMMS TYPE logic)

### 5. Flow Side-Note Definitions
- Created concise definitions for each major workflow step
- Format: Title in ALL CAPS, bullet points, examples
- Purpose: To be used as annotations in Miro/Lucidchart diagram

---

## Current Workflow (Corrected Logic)

### Key Insight: Diagram Maps Batch Characteristics, Not Individual Issue Journey

**Early portion** (Multi-Issue Diagnosis → Route to Departments):
- Operates on **individual reasons**
- Each reason gets its own status (Resolved/Unresolved/Awaiting)

**Later portion** (after "Still Reasons Unresolved?" node):
- Operates on **the batch/collection** of all unresolved reasons
- Decision logic: "Given the **characteristics of this set of reasons**, what communication type do we send?"

### Flow

```
1. Bill Submission Received
   ↓
2. Auto-Reject Check (AI 99% accuracy - disqualifiers)
   → YES: REJECTED (Final)
   → NO: Continue
   ↓
3. Multi-Issue Diagnosis (Bill Processor + AI)
   - Identify ALL reasons simultaneously
   - For each reason, determine: Touches Invoice? Requires Internal Action?
   ↓
4. Split by Reason Type (INDIVIDUAL REASON PROCESSING)
   - External Reasons (can communicate directly) → Hold for later
   - Internal Reasons (need department work) → Route to departments
   ↓
5. Internal Reasons → Route to Departments
   - Care/Compliance/Accounts perform work on individual reasons
   - Each reason outcome: Resolved | Unresolved | Awaiting
   ↓
6. Temporal Re-validation (BEFORE comms - BATCH PROCESSING BEGINS)
   - Re-check: funding balance, dates, authorization, supplier status
   - May ADD new reasons if context changed
   - Output: Updated list of ALL unresolved reasons
   ↓
7. Still Reasons Unresolved? (BATCH DECISION)
   → NO: All Resolved → PROCEED TO PAYMENT
   → YES: Continue
   ↓
8. Can Coexist Filter (BATCH PROCESSING)
   - Determine which reasons to include in comms
   - Apply dominance rules (e.g., "Supplier terminated" hides others)
   ↓
9. Determine Communication Type (BATCH DECISION)
   - ANY reason Touches Invoice? → COMMS TYPE = REJECT-RESUBMIT
   - ALL reasons contextual + permanent block? → COMMS TYPE = REJECT PERIOD
   - ALL reasons contextual + awaiting external action? → COMMS TYPE = ON HOLD
   ↓
10. External Parties Filter
    - Split comms by recipient: Supplier | Client | Coordinator
    - Filter sensitive info per recipient
    - Include ALL external-facing issues in payload (regardless of type)
    ↓
11. Draft & Send Communication
    - Type determines subject/tone
    - Payload includes all filtered issues
    - Example: REJECT PERIOD still lists other issues for future reference
    ↓
12. Trigger Cadence (if applicable)
    - ON HOLD → Always triggers cadence (Day 0→3→7→10)
    - REJECT-RESUBMIT → Triggers cadence ONLY if time-sensitive qualifiers detected (soft warning)
    - REJECT PERIOD → NO cadence (final rejection)
    ↓
13. Final Outcome Paths:
    - REJECT-RESUBMIT → Supplier resubmits → Back to step 1 (linked submission)
    - REJECT PERIOD → REJECTED FINAL
    - ON HOLD → Cadence runs:
        → Timeout Day 10 → REJECTED FINAL
        → External party acts → Resolved → PROCEED TO PAYMENT (after re-validation)
```

### Three Final Outcomes (Not Statuses)
1. **PAID** - Bill successfully processed and payment initiated
2. **REJECTED FINAL** - Bill permanently rejected (may be REJECT PERIOD or timeout)
3. **AWAITING RESUBMISSION** - REJECT-RESUBMIT sent, waiting for supplier to fix and resubmit

**Note**: "ON HOLD" is a **status during processing**, not a final outcome. All ON HOLD bills eventually become PAID or REJECTED FINAL.

---

## Key Statistics

### By Department
- **Compliance**: 16 reasons (44%)
- **Care**: 14 reasons (39%)
- **Accounts**: 6 reasons (17%)

### By Type
- **Touches Invoice** (must resubmit): 24 reasons (67%)
- **Contextual Hold** (resolve in place): 12 reasons (33%)

### By Auto-Reject Eligibility
- **Auto-Reject Eligible**: 9 reasons (25%)
  - ABN/GST error, Calculation error, Client name, Itemisation, Supplier terminated, Itemisation for contribution categories, Commencement date, Termination date, Finance QA failure
- **Requires Human Review**: 27 reasons (75%)

### By Cadence
- **Instant (0 days)**: 9 reasons (25%) - auto-rejects
- **10-day timeout**: 26 reasons (72%) - standard
- **No fixed timeline**: 2 reasons (3%) - ATHM, Supplier performance improvement

---

## Open Questions / Needs Manual Review

### 1. Can_Coexist_With Matrix
- **Question**: Which reasons should dominate communication?
- **Known**: "Supplier terminated" overrides all others
- **Needs**: Complete matrix from stakeholders (Romy, Zoe, Mellette, David)

### 2. Auto_Reject_Eligible Validation
- **Question**: Can AI truly detect these 9 reasons with 99% accuracy?
- **Needs**: Tech/AI team validation
- **Examples to verify**:
  - Missing ABN detection accuracy
  - Calculation error detection (math validation)
  - Date validation (requires system data access)

### 3. Revalidation_Checks Completeness
- **Current**: Default to `funding_balance, funding_period` for invoice-touching reasons
- **Question**: Are there other time-sensitive qualifiers to re-check?
- **Potential additions**: authorization_status, service_eligibility, client_active_status

### 4. Department Action Workflows
- **Status**: Intentionally left out of main flow diagram
- **Next step**: Define internal department workflows separately
- **Questions**:
  - How long does department work typically take?
  - Are there SLAs for department responses?
  - What happens if departments don't respond?

### 5. REJECT PERIOD Use Cases
- **Question**: When exactly is REJECT PERIOD used vs REJECT-RESUBMIT?
- **Known**: Supplier terminated = REJECT PERIOD
- **Needs**: Complete list of permanent rejection scenarios

### 6. Example Scenario: 5 Issues, Split External/Internal
- **Scenario**: Bill has 5 issues
  - 1 external reason (e.g., ABN/GST error - can communicate directly to supplier)
  - 4 internal reasons (e.g., funding verification, client approval needed, service type review, coordinator approval)
- **Workflow**:
  1. External reason → Flagged for communication payload
  2. Internal reasons → Routed to Care/Compliance/Accounts departments
  3. Departments work their queue (no hard timeouts)
  4. Cannot determine final communication TYPE until first temporal re-validation completes
  5. At re-validation: Check what's still unresolved from the batch
  6. Determine communication type based on batch characteristics
- **Key Point**: We can't know if it's REJECT-RESUBMIT, ON HOLD, or REJECT PERIOD until temporal re-validation completes, because we don't know which reasons will be resolved by then

---

## Files in Epic Raw Context

1. **IDEA-BRIEF.md** - Executive summary (approved format)
2. **compliance-reasons-schema.csv** - Original source data
3. **master-list-schema-updated.csv** - New schema with 36 reasons, 23 columns
4. **SCHEMA-MIGRATION-NOTES.md** - Analysis of automated vs manual review items
5. **workflow-diagram.jpg** - Original hand-drawn diagram (Frame 1)
6. **CONTEXT-MEMO.md** - This document

---

## Next Steps

### Immediate (Before Continuing)
1. **Fix Mermaid diagram** - Correct COMMS TYPE logic (ON HOLD missing, Type Split in wrong place)
2. **Generate corrected Mermaid code** - For import into Mermaid Live / Lucidchart / Miro
3. **Save flow side-note definitions** - For use as diagram annotations

### Short-term (Next Session)
1. **Complete master list** - Wait for TP-3813, TP-3814, TP-3815, TP-3816 completion
2. **Stakeholder review** - Validate Can_Coexist_With, Revalidation_Checks, Auto_Reject_Eligible
3. **Define department workflows** - Internal routing and SLAs
4. **Data model specification** - Complete submission/reason object parameters

### Medium-term
1. **Create spec.md** - Detailed user requirements and acceptance criteria
2. **Create plan.md** - Technical approach and implementation design
3. **Create tasks.md** - Granular implementation tasks
4. **AI validation** - Test auto-reject accuracy assumptions

---

## Critical Design Constraints

### What We MUST Do
1. ✅ Diagnose ALL issues upfront (no single-reason limitation)
2. ✅ Track discrete outcomes for each internal reason
3. ✅ Re-validate time-sensitive qualifiers before communication
4. ✅ Send ONE consolidated communication (not multiple back-and-forth)
5. ✅ Support cadence-based timeouts for external party responses

### What We MUST NOT Do
1. ❌ Create version tracking for invoices (treat resubmissions as discrete)
2. ❌ Skip temporal re-validation (even if it creates poor UX)
3. ❌ Send piecemeal communications (one issue at a time)
4. ❌ Block internal department work with hard timeouts (departments work on their timeline)
5. ❌ Share sensitive info with wrong external parties (client financials to supplier, etc.)

---

## Glossary / Terminology

- **Submission**: A single invoice submission (discrete unit, not a version)
- **Reason**: A specific issue blocking payment (36 possible reasons in master list)
- **Touches Invoice**: Issue is WITH the invoice itself (requires resubmission to fix)
- **Contextual Hold**: Issue is with environment/status (can resolve without resubmission)
- **Requires Internal Action**: Department must work the issue before we know outcome
- **Auto-Reject**: AI-detected disqualifier with 99% accuracy, instant rejection
- **Cadence**: Day 0→3→7→10 countdown for external party response
- **Temporal Re-validation**: Re-checking time-sensitive qualifiers before communication
- **Can Coexist Filter**: Logic determining which reasons to include in communication
- **External Parties**: Supplier, Client, Coordinator (not internal staff)
- **Department**: Care Team, Compliance Team, or Accounts Team
- **Final Outcome**: PAID, REJECTED FINAL, or AWAITING RESUBMISSION (only three possibilities)
- **Reason Status**: Resolved, Unresolved, or Awaiting (during processing - applies to individual reasons)
- **Communication Type**: REJECT-RESUBMIT, REJECT PERIOD, or ON HOLD (determines subject/tone of message)
- **Communication Payload**: All external-facing issues included in message (regardless of type)
- **Resubmit Soft Warning**: Optional time-sensitive qualifier warning added to REJECT-RESUBMIT messages
- **Batch Processing**: Decision logic operating on the collection of all unresolved reasons (vs individual reason processing)
- **Individual Reason Processing**: Early workflow steps that handle each reason separately
- **Single Communique**: One consolidated communication containing ALL issues from the batch (not per-reason messages)
- **Batch Decision Cascade**: The questions "Does ANY reason disqualify?", "Does ANY touch invoice?" applied to the whole batch to determine ONE COMMS TYPE
- **Resolution Outreach**: Comms to Client/Coordinator seeking action to resolve contextual issues (during department work phase)
- **Submitter Notification**: Comms to bill submitter (supplier) informing of outcome/status (after COMMS TYPE determined)
- **Resolution Window**: 1-day grace period for internal resolution before notifying supplier of "other processes required"
- **Requires Resolution Outreach**: Boolean flag identifying reasons that need client/coordinator action during resolution phase

---

## Stakeholders

### Internal
- **Romy Blacklaw** (Care Team) - romyb@trilogycare.com.au - TP-3813
- **Zoe Judd** (Compliance Team) - zoej@trilogycare.com.au - TP-3814
- **Mellette Opena** (Accounts Team) - melletteo@trilogycare.com.au - TP-3815
- **David Henry** (Data/Compilation) - davidh@trilogycare.com.au - TP-3816
- **Bill Processors** - Primary users of the system
- **Product Owner** - TBD
- **Tech Lead** - TBD

### External
- **Suppliers** - Receive rejection/on-hold notices, must fix and resubmit
- **Clients** - May need to approve services, provide funding, etc.
- **Coordinators** - May need to approve exceptions

---

## Known Edge Cases

1. **Context Decay After Rejection**
   - Problem: Funding available Day 0, rejected for ABN, resubmitted Day 15, funding gone
   - Current solution: Temporal re-validation catches this, but creates poor UX
   - Potential future solution: Fund reservation system (not in scope for MVP)

2. **Multiple Departments Working Same Bill**
   - Problem: Care, Compliance, Accounts all working different reasons on same bill
   - Current solution: Each tracks independently, all must resolve before proceeding
   - Risk: One slow department blocks entire bill

3. **Supplier Terminated Mid-Process**
   - Problem: Bill on hold for client approval, then supplier gets terminated
   - Current solution: Re-validation should catch termination, flip to REJECT PERIOD
   - Needs validation: Does supplier termination trigger re-check?

4. **Client Funding Changes During Hold**
   - Problem: Bill on hold for compliance, client adds voluntary contribution during wait
   - Current solution: Re-validation before comms should see new funding
   - Needs validation: Real-time funding updates in system?

5. **Resubmission Links Breaking**
   - Problem: How do we reliably link resubmissions to originals?
   - Current approach: Supplier reference matching + fuzzy heuristics + manual linking
   - Risk: False matches or missed links

---

## Design Philosophy

### Core Principle
**Diagnose everything upfront, fix everything in one go.**

Avoid: "Fix ABN" → resubmit → "Fix calculation" → resubmit → "No funding"
Prefer: "Fix ABN + calculation + get client approval" → resubmit once → paid

### Communication Philosophy
**One consolidated message with all issues, actionable guidance, and clear next steps.**

Not: Multiple emails over days with different issues
Instead: Single email listing everything wrong, what to fix, how to resubmit

### Outcome Philosophy
**Binary outcomes only: PAID or REJECTED. Everything else is status.**

Not: "Pending", "On Hold", "Awaiting", "Processing"
Instead: These are statuses DURING processing, not final outcomes

### Department Coordination Philosophy
**Route to departments for work, track discrete outcomes, no hard timeouts on internal work.**

Not: "Department has 2 days to respond or bill auto-rejects"
Instead: Department works their queue, bill waits until they decide, timeout only for external parties

---

## Questions to Address in Next Session

1. **Mermaid diagram corrections** - Need working diagram for stakeholder review (incorporating Resubmit Soft Warning node)
2. **Can_Coexist_With rules** - Complete the filtering matrix
3. **Department workflow details** - How does internal routing actually work?
4. **AI validation strategy** - How to test 99% accuracy assumptions?
5. **Fund reservation feasibility** - Future feature or edge case we live with?
6. **REJECT PERIOD criteria** - Complete list of permanent rejection scenarios
7. **Resubmission linking** - Technical approach to linking submissions reliably
8. **Real-time re-validation** - Do we re-check continuously or only before comms?
9. **Time-sensitive qualifier detection** - Which qualifiers trigger Resubmit Soft Warning? How to calculate risk?

---

**End of Context Memo**

To resume this work, review:
1. This memo (CONTEXT-MEMO.md)
2. IDEA-BRIEF.md (approved executive summary)
3. master-list-schema-updated.csv (36 reasons, 23 columns)
4. SCHEMA-MIGRATION-NOTES.md (what needs manual review)
5. workflow-diagram.jpg (original hand-drawn flow)

The main outstanding task is fixing the Mermaid diagram and getting it into an editable format for stakeholder review.
