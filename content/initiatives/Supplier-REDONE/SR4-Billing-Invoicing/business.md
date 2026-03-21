---
title: "Business Alignment: Billing & Invoicing"
---

# Business Alignment: Billing & Invoicing (SR4)

**Created**: 2026-03-19
**Author**: Will Whitelaw

---

## 1. Business Objectives

- **Enable mobile bill submission**: Break the desktop/session dependency so field workers and sole traders can submit bills from phones and tablets via the v2 API.
- **Reduce bill rejections at source**: Pre-submission validation catches "service type not in budget" (the most common rejection reason) before the supplier submits, eliminating avoidable rejection-resubmission cycles.
- **Resolve the on-hold bill backlog**: Replace the current ad-hoc hold process with structured reasons, write-off workflows, and supplier-visible hold status so bills do not sit indefinitely.
- **Scale bill processing beyond linear headcount**: Batch processing and automated validation (auto-approval) allow the operations team to handle growing bill volume without proportional staff increases.
- **Accelerate payment for trusted suppliers**: Express Pay rewards reliable suppliers with 5-business-day payment turnaround, improving retention and cash flow for the supplier base.
- **Eliminate duplicate data entry**: AI invoice extraction pre-populates bill line items from uploaded invoices, reducing manual keying and errors.

---

## 2. Success Metrics

| KPI | Target | Measurement Method |
|-----|--------|--------------------|
| Mobile bill submission | 100% of flows completable on mobile | End-to-end test: create and submit a 3-line-item bill in < 5 minutes on mobile via API |
| Bill rejection rate | 30% reduction within 3 months | Pre/post comparison: rejections / total submissions, with pre-submission warnings acted on tracked |
| On-hold bill visibility | 100% of holds have structured reasons visible to both staff and supplier | Audit query: bills in Hold status without a HoldReason record = 0 |
| Bill processing time | 40% reduction in avg submission-to-decision time | Mean elapsed time (submitted_at to approved/rejected_at) vs pre-launch baseline |
| Auto-approval adoption | 30% of submitted bills auto-approved within 6 months | Auto-approved count / total submitted count, with false-positive rate < 2% |
| Express Pay turnaround | Payment within 5 business days for qualifying bills | Elapsed time from submission to payment for Express Pay-flagged bills |
| AI extraction accuracy | 80%+ of line item fields pre-populated | Fields pre-populated / total fields on standard invoice formats |
| "Where is my payment?" support tickets | 50% reduction within 3 months | Support ticket volume tagged "payment status" vs pre-launch baseline |
| Audit trail completeness | 100% — every status change logged | Automated check: bill status transitions without an audit record = 0 |
| Data isolation | Zero cross-entity leakage | Penetration test: supplier entity A cannot access supplier entity B's bills |

---

## 3. ROI Analysis

### Costs

| Item | Estimate |
|------|----------|
| Development (80-110 days, 5 sub-projects) | ~$240k-$330k |
| AI invoice vendor integration (API costs + dev) | ~$20k-$40k |
| QA, load testing, event sourcing validation | ~$20k-$30k |
| **Total estimated cost** | **$280k-$400k** |

This is the largest epic in the Supplier REDONE initiative. The wide cost range reflects low-medium confidence due to the event-sourced bill domain complexity, AI vendor dependency, and five interleaved sub-projects.

### Benefits

| Benefit | Estimated Value |
|---------|-----------------|
| Operations team time saved (40% processing time reduction across bill reviewers) | ~$80k-$120k/year (based on current team size and manual review hours) |
| Reduced rejection-resubmission cycles (30% fewer rejections = fewer re-reviews) | ~$30k-$50k/year in avoided rework |
| Auto-approval handling 30% of volume | Equivalent to 1-2 FTE bill processors not needed as volume grows |
| Express Pay supplier retention | Indirect but significant — faster payment is the #1 supplier satisfaction driver. Reduced churn saves recruitment/onboarding cost |
| AI extraction reducing data entry time by 60% | ~$20k-$30k/year in supplier time savings (indirect, but reduces errors that cause rejections) |
| "Where is my payment?" support reduction (50%) | ~$15k-$25k/year in support team capacity freed |

### Payback

Estimated payback period: **18-24 months** from direct operational savings. The strategic value extends beyond cost savings — billing is the core revenue cycle for Trilogy Care. Every day of unnecessary payment delay erodes supplier trust and retention. SR4 transforms billing from a linear-scaling bottleneck into a system that can handle 2-3x volume growth without proportional headcount.

---

## 4. Stakeholder Impact

| Stakeholder | Impact |
|-------------|--------|
| **Suppliers (13,000)** | Gain mobile submission, clear rejection reasons with resubmission guidance, hold reason visibility, payment status tracking, and (for qualifying suppliers) Express Pay. AI extraction eliminates manual data entry for most invoices. |
| **Operations / Bill Processors** | Workflow shifts from individual manual review to dashboard-based processing with batch actions and auto-approval. Estimated 40% time savings. On-hold bills gain structured resolution paths. |
| **Khoa Duong** | Consulted on bill processing workflows and validation rules — directly shapes the operational model. |
| **Lachlan Dennis** | Consulted on AI invoice processing — owns the integration scope and vendor relationship. |
| **Zoe Judd** | Operations perspective on on-hold/write-off workflows — shapes the hold reason taxonomy and resolution flows. |
| **Finance** | Payment run integration (Express Pay) affects payment scheduling. Write-off workflow requires senior approval — finance visibility into write-off decisions. |
| **Supplier-facing team** | Must communicate changes to submission and payment flows. Expect reduced "where is my payment?" queries. |

---

## 5. Risk to Business

### If we don't do this

- **Billing stays desktop-only**: Field workers and sole traders (a significant portion of the 13K supplier base) cannot submit bills without access to a desktop browser. This limits portal adoption and forces continued use of paper/email invoicing.
- **Rejection cycle continues**: "Service type not in budget" rejections remain the #1 issue. Each rejection-resubmission cycle adds days to payment and costs staff time on both sides.
- **On-hold bills accumulate indefinitely**: Without structured tracking, on-hold bills are a growing liability — no resolution path, no supplier visibility, no write-off process.
- **Processing bottleneck scales linearly**: Every new supplier adds to the manual review queue. Without batch processing and auto-approval, the operations team must grow proportionally with supplier volume.
- **Supplier trust erodes**: Slow, opaque payment processes push suppliers to competitors or cause them to deprioritise Trilogy Care clients.

### If we do this badly

- **Auto-approval false positives**: If auto-approval rules are too loose, incorrectly approved bills result in overpayment. The 2% false-positive target and reversal capability mitigate this, but early calibration is critical.
- **Event sourcing migration risk**: Extending the existing event-sourced Bill aggregate (rather than replacing it) means the v2 API layer must be additive. Breaking existing operations-side Inertia views during SR4 would be catastrophic.
- **AI extraction confidence miscalibration**: If extraction pre-populates incorrect data and suppliers blindly submit, it creates more problems than manual entry. The "AI-extracted — please verify" UX pattern is essential.
- **Express Pay gaming**: Suppliers could optimise for Express Pay eligibility by submitting only safe, small bills. Configurable thresholds and lookback periods mitigate this.
- **Partial approval confusion**: If suppliers do not clearly understand that a "partially approved" bill means some line items were rejected, they may miss the need to resubmit rejected items.

---

## 6. Dependencies on Other Epics

| Dependency | Direction | Nature |
|------------|-----------|--------|
| **SR0 (API Foundation)** | SR4 depends on SR0 | v2 API infrastructure, token-based auth, rate limiting (60 req/min), supplier context scoping |
| **SR2 (Profile & Org Management)** | SR4 depends on SR2 | Bills scoped to supplier entities within the two-tier org model. Supplier verification status feeds Express Pay eligibility |
| **SR3 (Supplier Pricing)** | SR4 depends on SR3 | Rate validation on bill line items checks against SR3's approved supplier rates. Without validated rates from SR3, FR-004 (rate comparison) has no reliable baseline |
| **SR5 (Agreements & Compliance)** | Parallel, loose coupling | Payment blocks from SR5 compliance checks affect whether SR4 bills can be paid. No hard build dependency, but operational integration needed |
| **Existing bill domain** | Internal | SR4 extends (not replaces) the existing Bill model, event sourcing aggregates, Nova resources, and operations Inertia views. `supplier_entity_id` FK added to `bills` table |

**Critical path**: SR0 → SR2 → SR3 → SR4. SR4 is the end of the critical chain and the highest-value delivery. Any delay upstream cascades directly to SR4.

---

## 7. Go/No-Go Criteria

Before starting SR4 development, the following must be true:

- [ ] **SR0 API Foundation**: v2 API, token-based auth, and rate limiting are deployed and stable
- [ ] **SR2 Two-Tier Org Model**: Supplier entities exist and bills can be scoped to them (`supplier_entity_id` FK path is validated)
- [ ] **SR3 Supplier Pricing**: Validated, auto-approved rates are available for at least the most common service types — enough to make bill rate validation meaningful
- [ ] **Existing bill domain assessed**: Technical spike confirms the event-sourced Bill aggregate can be extended with v2 API endpoints without breaking existing operations views
- [ ] **Bill status lifecycle confirmed**: The 7 statuses and their transitions (FR-038) are agreed by operations — no ambiguity about who can trigger what
- [ ] **Hold reason taxonomy finalised**: Zoe's structured hold reason list is agreed (missing documentation, budget query, recipient dispute, supplier query, other)
- [ ] **Auto-approval thresholds proposed**: Operations has proposed initial thresholds (max amount, rate tolerance %) for the auto-approval rules — even if they will be tuned post-launch
- [ ] **AI invoice vendor API available**: Lachlan has confirmed vendor access, API credentials, and extraction capabilities for PDF/image invoices (P3, but long-lead-time dependency)
- [ ] **MYOB integration path identified**: Accounting system integration for payment runs is scoped (at least for Express Pay)
