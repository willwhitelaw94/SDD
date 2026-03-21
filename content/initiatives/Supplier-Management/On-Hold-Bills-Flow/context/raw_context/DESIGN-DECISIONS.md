---
title: "Design Decisions & Rationale"
---


**Epic**: TP-3787 | **Initiative**: TP-1857 Supplier Management | **Code**: OHB
**Date**: 2026-01-13

This document captures the **WHY** behind key design decisions made during workflow design sessions.

---

## Table of Contents
1. [Submission Identity: Discrete vs Versioned](#submission-identity)
2. [Three Communication Types Logic](#three-communication-types)
3. [Cadence: Why Only ON HOLD?](#cadence-only-on-hold)
4. [Temporal Re-validation Timing](#temporal-revalidation)
5. [Batch vs Individual Processing](#batch-vs-individual)
6. [Can Coexist Filter Rationale](#can-coexist-filter)
7. [Limited-Time Soft Warning](#limited-time-soft-warning)
8. [No Hard Timeouts on Internal Work](#no-hard-timeouts)
9. [Final Outcomes Naming](#final-outcomes)
10. [Communication Payload Strategy](#communication-payload)
11. [Two Communication Streams: Resolution Outreach vs Submitter Notification](#two-communication-streams)
12. [Parallel Processing with Resolution Window](#parallel-processing-resolution-window)

---

## Submission Identity

### Decision
Treat each resubmission as a **discrete submission** (not version tracking), but link to original.

### Rationale
- **Messiness prevention**: If we version (v1, v2, v3), what happens when v2 introduces NEW issues not present in v1?
  - Example: v1 rejected for ABN error. Supplier fixes ABN but makes calculation error in v2. Now v2 has issue v1 didn't have.
  - Version tracking implies linear progression, but bills can get *worse* on resubmission.

- **Discrete units are cleaner**: Each submission is diagnosed fresh. Previous attempts inform context but don't constrain diagnosis.

- **Linking preserves history**: We still track "this is attempt #3 related to original submission SUB-12345" for audit and analytics.

### Alternative Rejected
Version tracking (v1, v2, v3) - too complex when new issues emerge, confusing for suppliers.

---

## Three Communication Types

### Decision
Three distinct communication types based on reason characteristics:
1. **REJECT-RESUBMIT**: Any reason touches invoice (requires invoice changes)
2. **REJECT PERIOD**: Permanent blocker disqualifies future attempts (e.g., supplier terminated)
3. **ON HOLD**: All contextual reasons, awaiting external action

### Rationale

#### Why "Touches Invoice" is the primary split?
- **Invoice issues** REQUIRE resubmission. Same physical invoice can never be paid if it has calculation errors, missing ABN, wrong dates, etc.
- **Contextual issues** can resolve without touching the invoice. Funding depletes → gets replenished. Client approval pending → gets approved. Same invoice, different context.

#### Why REJECT PERIOD exists separately?
- Some blockers are **permanent and absolute**: Supplier terminated, service category fundamentally ineligible.
- Telling supplier "fix and resubmit" when they're terminated is misleading and wasteful.
- REJECT PERIOD clearly communicates: "This is over. Do not resubmit this invoice for this client."

#### Why ON HOLD is distinct from REJECT-RESUBMIT?
- **User experience**: "On Hold" signals "we're working on it" vs "you need to fix this"
- **Accountability**: ON HOLD = our side (internal approvals, client funding). REJECT-RESUBMIT = your side (invoice errors).
- **Cadence logic**: ON HOLD needs countdown because we're waiting for someone. REJECT-RESUBMIT doesn't (supplier resubmits whenever they can).

### Alternative Rejected
Two types only (REJECT / ON HOLD) - doesn't distinguish permanent blockers from fixable issues, creates supplier confusion.

---

## Cadence: Why Only ON HOLD?

### Decision
Day 0→3→7→10 cadence **only** applies to ON HOLD communication type.

### Rationale

#### REJECT-RESUBMIT should NOT have cadence:
- **Supplier controls timeline**: They fix invoice whenever they can. Some issues take hours (ABN lookup), others take days (client signature on corrected dates).
- **Arbitrary deadline is unhelpful**: "Fix your invoice by Day 10 or it's rejected" - but it's ALREADY rejected. Resubmission restarts the clock anyway.
- **Soft warning suffices**: If funding expires soon, we warn them. But no hard countdown.

#### REJECT PERIOD should NOT have cadence:
- **It's final**: No action expected. Countdown to what? It's already permanently rejected.

#### ON HOLD NEEDS cadence:
- **We're waiting on external parties**: Client to approve, coordinator to respond, supplier to provide documentation (not invoice changes).
- **Accountability mechanism**: Without countdown, bills sit "on hold" indefinitely. Day 10 timeout forces closure.
- **Supplier/client expectations**: "We'll wait 10 days. If no response, we're moving on."

### Alternative Rejected
Cadence on all paths - creates artificial urgency on REJECT-RESUBMIT, doesn't make sense for REJECT PERIOD.

---

## Temporal Re-validation

### Decision
Always re-validate time-sensitive qualifiers (funding, authorization, dates, supplier status) BEFORE drafting any communication.

### Rationale

#### The "Context Decay" problem:
- **Day 0**: Bill diagnosed with ABN error. Client has $5000 funding.
- **Day 15**: Supplier resubmits with ABN fixed. Client funding now $0 (spent on other bills).
- **Without re-validation**: We'd send "APPROVED - PAID" then discover funding issue afterward. Terrible UX.
- **With re-validation**: We catch funding depletion, add new reason to diagnosis, communicate all issues at once.

#### Why BEFORE every communication?
- Context changes constantly: funding depletes/replenishes, authorizations expire, suppliers get terminated.
- Can't trust Day 0 checks when communicating on Day 5, Day 10, or Day 20.
- **Better UX to consolidate issues upfront** than send multiple conflicting messages.

#### Why temporal recheck AGAIN after ON HOLD resolution?
- ON HOLD can last days/weeks. Funding status on Day 0 ≠ funding status on Day 15.
- Bill "on hold for client approval" gets approved Day 8, but funding depleted Day 6. Re-check catches this.

### Trade-off Acknowledged
Poor UX when supplier fixes invoice but temporal re-validation adds NEW reason (funding depleted). But **unavoidable** without fund reservation system (out of scope).

### Alternative Rejected
Re-validate only once (at initial diagnosis) - leads to stale data, failed payments, supplier frustration.

---

## Batch vs Individual Processing

### Decision
Workflow has two distinct processing modes:
- **Individual Reason Processing** (early): Each reason gets status (Resolved/Unresolved/Awaiting)
- **Batch Processing** (later): Decision logic operates on characteristics of ALL unresolved reasons

### Rationale

#### Why individual processing first?
- **Departmental work is reason-specific**: Care team resolves "client approval needed". Compliance resolves "supplier verification pending". Each reason gets discrete outcome.
- **Tracking granularity**: Need to know "out of 5 issues, 3 resolved, 2 still unresolved" for audit trail and analytics.

#### Why batch processing for communication?
- **Communication type depends on the SET of unresolved reasons**, not individual reasons.
- Example: Bill has 3 reasons after dept work:
  - ABN error (touches invoice)
  - Funding pending (contextual, awaiting)
  - Client approval pending (contextual, awaiting)
- **Question**: What communication? Answer: REJECT-RESUBMIT (because ANY touches invoice).
- Can't answer that by looking at reasons individually - need batch view.

#### The diagram maps BOTH:
- **Nodes before "Still Reasons Unresolved?"** → operate on individual reasons
- **Nodes after "Still Reasons Unresolved?"** → operate on batch of reasons

### Why this matters
Someone implementing this needs to understand:
- Database schema needs **reason-level** status tracking (Resolved/Unresolved/Awaiting)
- Communication logic needs **batch-level** queries ("Do ANY reasons touch invoice?")

### Alternative Rejected
Pure individual processing (check each reason separately) - can't determine communication type. Pure batch processing - loses granular tracking of what departments did.

---

## Can Coexist Filter

### Decision
Before drafting communication, filter reasons through "Can Coexist" logic to hide dominated/redundant issues.

### Rationale

#### The supplier confusion problem:
- Bill has 5 issues: Supplier terminated, ABN error, Calculation error, Missing itemization, Wrong dates.
- **Without filter**: Communication lists all 5 issues.
- **Supplier reaction**: "You want me to fix ABN, calculation, itemization, dates... but I'm TERMINATED?!"
- **Result**: Wasted supplier time, confused communications.

#### The dominance hierarchy:
- **Supplier terminated** dominates all other issues. If supplier can't submit ANY bills, no point listing invoice-specific errors.
- Other examples: "Service category ineligible" dominates invoice-level errors for that category.

#### Why "Can Coexist" column in schema?
- Some reasons genuinely coexist: "ABN error" + "Calculation error" → both need fixing, list both.
- Some reasons block others: "Supplier terminated" → hide invoice defects.
- Business rules, not technical rules - needs stakeholder input for complete matrix.

#### Communication payload still includes dominated issues
For REJECT PERIOD with supplier terminated, we DO mention: "Additionally, for future reference with other suppliers, this invoice also had: ABN error, calculation issues..."
- **Why?** Educational value - supplier learns what to avoid in future.
- **But** we don't ask them to fix these (they can't, they're terminated).

### Alternative Rejected
List all issues always - creates supplier confusion, wastes time on unfixable issues.

---

## Limited-Time Soft Warning

### Decision
Detect time-sensitive qualifiers (funding nearing depletion, authorization expiring soon) and add soft warning to REJECT-RESUBMIT and ON HOLD communications.

### Rationale

#### The urgency signal problem:
- Bill rejected for ABN error Day 0. Supplier has until Day 25 before client funding period ends.
- **Without warning**: Supplier fixes ABN leisurely, resubmits Day 28. Funding period ended Day 25. New rejection.
- **With warning**: "Note: Client funding period ends 2026-02-25. Please resubmit promptly."

#### Why "soft" warning (not cadence)?
- **Soft**: Informational, not enforced. Supplier still controls resubmission timeline.
- **Cadence**: Hard countdown with timeout. Too aggressive for REJECT-RESUBMIT (supplier might not be able to fix in 10 days).

#### Why add to ON HOLD too?
- ON HOLD can last days. If funding expires DURING hold, parties should know urgency.

### When to trigger?
- TBD by stakeholders. Likely: "If time-sensitive qualifier expires within 14 days of rejection."

### Alternative Rejected
No urgency signal - leads to preventable resubmission failures due to expired funding/auth.

---

## No Hard Timeouts on Internal Work

### Decision
Department work (Care/Compliance/Accounts) has **NO hard timeouts**. Bill waits until departments complete work.

### Rationale

#### Why no timeouts?
- **Departments control priority**: Care team might prioritize urgent client issues over bill approvals. That's a legitimate business decision.
- **Work complexity varies**: Some approvals take 10 minutes (check system). Others take days (contact client's family, wait for callback).
- **Auto-rejecting bills because dept is slow hurts suppliers**: Supplier did nothing wrong. Why punish them for our internal delays?

#### How do we prevent bills sitting forever?
- **Management visibility**: Analytics dashboard shows "bills awaiting dept work >5 days". Management addresses capacity issues.
- **Not technical timeout**: Operational problem requires operational solution (hiring, prioritization), not system auto-reject.

#### Contrast with external timeouts:
- **External parties** (suppliers, clients) get Day 10 timeout (ON HOLD path).
- **Why different?** We control our departments (can address capacity). We don't control suppliers (timeout needed to force closure).

### Alternative Rejected
Department SLA with auto-reject after X days - punishes suppliers for our internal issues, doesn't solve root cause (capacity).

---

## Final Outcomes Naming

### Decision
Three final outcomes:
1. **PAID** - Payment processed
2. **REJECTED FINAL** - Permanent rejection (from REJECT PERIOD or ON HOLD timeout)
3. **REJECTED RESUBMIT** - Rejected, supplier may resubmit as new linked submission

### Rationale

#### Why "REJECTED RESUBMIT" (not "AWAITING RESUBMISSION")?
- **This submission is done. Rejected. Over.**
- "Awaiting Resubmission" implies ongoing status. But THIS bill is closed. Supplier MAY submit a NEW bill (linked), but current bill is rejected.
- Clarity for audit/reporting: "How many bills rejected?" → Count REJECTED RESUBMIT + REJECTED FINAL.

#### Why distinguish REJECTED FINAL from REJECTED RESUBMIT?
- **Analytics/reporting**: "Why are bills rejected?"
  - REJECTED FINAL: Permanent blockers or timeouts (supplier/client didn't act).
  - REJECTED RESUBMIT: Invoice errors (supplier CAN fix).
- **Supplier communications differ**:
  - REJECTED FINAL: "Do not resubmit."
  - REJECTED RESUBMIT: "Fix and resubmit."

### Alternative Rejected
Single "REJECTED" outcome - loses important distinction between fixable and unfixable, muddles reporting.

---

## Communication Payload Strategy

### Decision
Communication **payload** always includes ALL external-facing issues (after Can Coexist filter), regardless of communication **type**.

### Rationale

#### Why include "other issues" in REJECT PERIOD?
- **Scenario**: Supplier terminated (REJECT PERIOD). Invoice also has ABN error, calculation error.
- **Message**: "This invoice cannot be paid because supplier is terminated. Additionally, for future submissions to other clients, please note: ABN error, calculation issues..."
- **Why?** Educational value. Supplier learns what to avoid. Even though THIS invoice is dead, help them improve.

#### Type vs Payload:
- **Type** (REJECT-RESUBMIT / REJECT PERIOD / ON HOLD) = subject line, tone, resubmit link presence.
- **Payload** = body content listing all relevant issues.
- **Both needed**: Type sets expectation. Payload provides detail.

#### Example messages:

**REJECT-RESUBMIT**:
```
Subject: Invoice [ID] Rejected - Resubmit Required
Your invoice cannot be processed due to the following issues:
- ABN/GST error: Invalid ABN [details]
- Calculation error: Total doesn't match line items [details]
Please correct and resubmit: [LINK]
```

**REJECT PERIOD**:
```
Subject: Invoice [ID] Rejected - Do Not Resubmit
Your invoice cannot be paid because supplier is no longer active in our system.
For future reference with other clients, please note this invoice also had:
- ABN/GST error: Invalid ABN [details]
No resubmission is possible for this invoice.
```

**ON HOLD**:
```
Subject: Invoice [ID] On Hold
Your invoice is on hold pending:
- Client approval for service type
- Coordinator authorization
We are working to resolve. No action needed from you at this time.
We'll update you by Day 3.
```

### Alternative Rejected
Type determines payload (REJECT PERIOD only mentions termination) - loses educational value, supplier makes same mistakes on future bills.

---

## Two Communication Streams: Resolution Outreach vs Submitter Notification

### Decision
Recognise and name two distinct communication streams in the workflow:

| Stream | Formal Name | Recipient | Purpose | When |
|--------|-------------|-----------|---------|------|
| **Resolution Outreach** | Resolution Outreach | Client, Coordinator, or other stakeholder (NOT the bill submitter) | Request action to resolve contextual issues | During department work phase (Day 0→3→7→10 as per master list) |
| **Submitter Notification** | Submitter Notification | Supplier (the entity that submitted the invoice) | Inform of outcome or status | After COMMS TYPE determination |

### Rationale

#### Why "Resolution Outreach" (not "Internal On Hold")?
- **"Internal" is misleading**: The client is EXTERNAL to Trilogy Care. They're just not the bill submitter.
- **"Outreach" implies action-seeking**: We're reaching out to request something (approval, information, documentation).
- **"Resolution" clarifies purpose**: These comms aim to resolve the hold, not just notify.

#### Why "Submitter Notification" (not "Supplier Notification")?
- **Precision**: The supplier is the bill SUBMITTER in this context. Some clients may self-submit (reimbursements). "Submitter" covers both.
- **"Notification" implies informing**: We're telling them what happened, not asking them to do internal work.

#### Why two streams needed?
- **Different recipients**: Resolution Outreach goes to stakeholders who can ACTION the hold. Submitter Notification goes to whoever submitted the bill.
- **Different purposes**: Resolution = seek action. Notification = inform of outcome.
- **Different timing**: Resolution happens during dept work. Notification happens after COMMS TYPE determined.
- **Privacy preservation**: Client-specific issues (approval pending, funding queries) stay between Trilogy and client. Supplier only learns "other processes required" if relevant.

### Schema Implication
The master list Day_0/Day_3/Day_7/Day_10 columns are **Resolution Outreach** templates. These are NOT the same as the final Submitter Notification.

A new schema column may be needed: `Requires_Resolution_Outreach` (Boolean) - TRUE for reasons that need client/coordinator action during resolution phase.

### Alternative Rejected
Single communication stream - conflates resolution-seeking comms with outcome notifications, violates client privacy, confuses recipients.

---

## Parallel Processing with Resolution Window

### Decision
Process all reasons and communications **in parallel** with a **1-day Resolution Window** for reasons requiring client/coordinator action.

### The Flow

```
Bill diagnosed with reasons → Route to departments (parallel)
                                    ↓
              ┌─────────────────────┼─────────────────────┐
              │                     │                     │
        Compliance              Care                 Accounts
              │                     │                     │
              │          ┌──────────┴──────────┐          │
              │          │                     │          │
              │    Requires Client/      Pure Internal    │
              │    Coord Action?         Resolution       │
              │          │                     │          │
              │          ↓                     │          │
              │    Resolution Outreach         │          │
              │    (Day 0 comms)               │          │
              │          │                     │          │
              │    ┌─────┴─────┐               │          │
              │    │           │               │          │
              │  Resolved    NOT Resolved      │          │
              │  in 1 day?   in 1 day          │          │
              │    │           │               │          │
              │    ↓           ↓               │          │
              │  Supplier   Supplier           │          │
              │  NEVER      informed:          │          │
              │  knows      "other processes   │          │
              │             required"          │          │
              │             (privacy           │          │
              │             preserved)         │          │
              └─────────────┬──────────────────┘          │
                            │                             │
              ←─────────────┴─────────────────────────────┘
                            │
                   All departments done
                            │
                   Temporal re-validation
                            │
                   Determine COMMS TYPE
                            │
                   Submitter Notification
```

### Rationale

#### Why parallel processing (not sequential client-first)?
- **Speed**: Internal issues can be worked simultaneously. No reason to make ABN validation wait for client approval.
- **Efficiency**: Departments work independently. Compliance doesn't need to wait for Care.
- **Better UX**: Faster resolution = happier suppliers.

#### Why 1-day Resolution Window?
- **Grace period for quick fixes**: Many client/coordinator actions resolve same-day (approval clicks, quick phone calls).
- **Supplier ignorance when possible**: If client approves in 4 hours, supplier never knew there was an issue. Cleaner experience.
- **Privacy preservation**: Client's internal issues stay internal when quickly resolved.

#### What happens if NOT resolved in 1 day?
- **Supplier gets notified**: "Your invoice is on hold. Other processes required before we can proceed. No action needed from you."
- **Privacy preserved**: We don't say "client hasn't approved" or "waiting on coordinator". Just "other processes".
- **Transparency without details**: Supplier knows something is happening. They don't know what.

#### Why "other processes required" (not specific details)?
- **Client privacy**: Client's approval status, funding discussions, care arrangements are private.
- **Reduced supplier anxiety**: "Other processes required" is neutral. "Client hasn't approved" creates tension between supplier and client.
- **Professional boundary**: Trilogy manages the client relationship. Supplier doesn't need to know client-side details.

### Trade-off Acknowledged
- **Slight opacity**: Supplier doesn't know exactly what's happening. Trade-off for client privacy.
- **Potential supplier frustration**: "What processes?" - but this is better than revealing client information.

### Schema Implication
New column needed: `Requires_Resolution_Outreach` (Boolean)
- TRUE: Reasons where client/coordinator must take action (approvals, confirmations, documentation provision)
- FALSE: Pure internal work (verification checks, data lookups, system corrections)

Examples:
- `Client approval required` → TRUE (client must approve)
- `Coordinator approval required` → TRUE (coordinator must approve)
- `Insufficient balance` → TRUE (may require client discussion about voluntary contribution)
- `Missing supplier bank details` → FALSE (internal lookup/request to supplier directly)
- `ABN/GST error` → FALSE (supplier issue, not client action needed)

### Alternative Rejected
**Option 1 (Sequential)**: Client/coordinator resolution completes before ANY supplier notification. Rejected because it delays all processing, even for issues unrelated to client action.

---

## Open Design Questions

These were flagged during design but deferred:

1. **Can_Coexist_With complete matrix**: Which reasons truly dominate which others? Needs stakeholder workshop.

2. **Auto-Reject eligible validation**: Can AI truly detect 9 reasons with 99% accuracy? Needs tech validation.

3. **Revalidation_Checks completeness**: Are funding_balance, funding_period, authorization_status, supplier_status sufficient? Any others?

4. **Time-sensitive threshold**: When to trigger Limited-Time Soft Warning? 14 days? 7 days? 30 days?

5. **REJECT PERIOD complete criteria**: Supplier terminated is clear. What other permanent blockers exist?

6. **Resubmission linking strategy**: How to reliably match resubmissions to originals? Supplier reference? Fuzzy matching?

7. **Maximum revalidation loops**: If temporal re-validation keeps adding new reasons (oscillating context), when do we manual-intervention?

8. **Fund reservation feasibility**: Future feature to reserve funding when bill initially submitted? Prevents context decay but adds complexity.

9. **Resolution Window duration**: Is 1 day (24 hours) the right grace period before notifying supplier of "other processes required"? Should it be business hours only? Should different reason types have different windows?

10. **Requires_Resolution_Outreach classification**: Complete audit of all 36 reasons to classify TRUE/FALSE for this new column. Some edge cases (e.g., "Missing supplier bank details" - is that Resolution Outreach to supplier, or Submitter Notification?).

---

## Key Principles (Design Philosophy)

These principles guided all decisions:

### 1. **Diagnose everything upfront, fix everything in one go**
Avoid: Multiple rejection-resubmission cycles
Prefer: Single consolidated communication with ALL issues

### 2. **Binary outcomes only: PAID or REJECTED**
Everything else (ON HOLD, AWAITING RESUBMISSION) is a **status during processing**, not a final outcome.

### 3. **No hard timeouts on internal work**
Departments work at their pace. Timeouts only for external parties (supplier/client).

### 4. **Temporal re-validation is non-negotiable**
Always re-check time-sensitive qualifiers. Stale data = failed payments = bad UX.

### 5. **Communication type vs payload**
Type = subject/tone. Payload = comprehensive issue list (educational value).

### 6. **Batch processing for communication, individual tracking for departments**
Both perspectives needed for different purposes.

### 7. **Supplier-first language**
"REJECT-RESUBMIT" not "REJECT-RESUBMIT-INVOICE". Clear what's rejected (this submission), clear what to do (resubmit).

---

## Stakeholder Sign-Off Required

Before proceeding to spec.md/plan.md:

- [ ] **Can_Coexist_With matrix** - Romy (Care), Zoe (Compliance), Mellette (Accounts), David (Data)
- [ ] **Auto-Reject eligible reasons** - Tech team validation of AI accuracy
- [ ] **Time-sensitive thresholds** - Product owner defines urgency windows
- [ ] **REJECT PERIOD criteria** - Business stakeholders define permanent blockers
- [ ] **Resubmission linking approach** - Tech lead proposes matching strategy

---

**Document Version**: 1.1
**Last Updated**: 2026-01-13

**Changelog**:
- v1.1 (2026-01-13): Added "Two Communication Streams" and "Parallel Processing with Resolution Window" decisions. Added open questions 9-10.
- v1.0 (2026-01-12): Initial design decisions document.

**For Questions**: Review CONTEXT-MEMO.md for detailed workflow, WORKFLOW-PARAMETERS.md for all variables, workflow-diagram-updated.mmd for visual flow.
