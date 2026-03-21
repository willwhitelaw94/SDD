---
title: "Idea Brief: Supplier Pricing"
---

# Idea Brief: Supplier Pricing

**Created**: 2026-03-19
**Author**: Will Whitelaw

---

## Problem Statement (What)

- **Rate submission is incomplete and stalled** — of ~13,000 suppliers, only 5,000 have completed rate submissions, 4,000 are partial, and 4,000 have not started (Dec 2025 data)
- Suppliers can enter prices that exceed Trilogy Care's price caps, but there is **no structured approval workflow** for out-of-cap pricing — compliance review is manual and ad-hoc
- **Price cap thresholds are not shared with suppliers** to prevent gaming, yet suppliers have no feedback on whether their submitted rates are within acceptable limits until after review
- **Partial rate entry is painful** — suppliers are forced to submit $0 for services they do not offer, rather than marking them as not applicable. This creates dirty data and confusion
- **No downloadable pricing reference** — suppliers must navigate the portal to understand rate structures. There is no PDF or export they can use offline or share internally
- **Digital platform pricing (Mable, etc.) is unreliable** — rates sourced from platforms require manual workarounds that are error-prone and time-consuming
- If a supplier is flagged twice for exceeding price caps, **billing is placed on hold** — but suppliers have no visibility into their compliance status or how close they are to a hold

**Current State**: Direct and indirect rate management was deployed in December 2025. Suppliers enter per-location, per-service-type pricing across six rate categories (weekday, non-standard weekday, Saturday, Sunday, public holiday, travel). A 10% minimum threshold for price cap validation was finalized in March 2026. Service-type level approvals are available in preview. There is no structured approve/reject workflow, no compliance dashboard, and no supplier-facing pricing reference documents.

---

## Possible Solution (How)

A comprehensive pricing management system with structured approval workflows, compliance visibility, and self-service tools for suppliers.

- **Approve/reject dashboard**: Staff can review, approve, or reject supplier pricing submissions from a centralized dashboard scoped by service type and location
- **Price cap validation with submit-for-review flow**: When a supplier submits a rate exceeding the cap, the system flags it and requires a "submit price request" action rather than silently accepting it
- **Not-applicable toggle per rate**: Suppliers can mark individual rate categories as "N/A" instead of entering $0 — producing cleaner data and eliminating false zero-rate records
- **Compliance status indicators**: Green tick for approved prices, warning indicators for pending review, and clear visibility of how many flags a supplier has accumulated
- **Downloadable PDF pricing reference**: Suppliers can download a PDF summarising rate structures by service type, scoped to their locations
- **Partial rate entry support**: Allow null/blank entries for rates a supplier does not offer, with clear distinction from $0 rates
- **Billing hold transparency**: Suppliers can see their compliance status, flag count, and whether they are approaching or already on a billing hold

```
// Before (Current Process)
1. Supplier logs in and enters rates across all categories
2. Must enter $0 for services they don't offer
3. Submits rates above cap — no immediate feedback
4. Staff manually reviews flagged rates in spreadsheets
5. Supplier flagged twice — billing on hold, no warning

// After (Supplier Pricing)
1. Supplier logs in and enters rates, marks N/A for irrelevant services
2. Submits a rate above cap — system shows warning, prompts "submit price request"
3. Staff reviews request in approve/reject dashboard with cap context
4. Approved: green tick appears. Rejected: supplier notified with reason
5. Compliance status visible — supplier sees flag count and hold risk
```

---

## Benefits (Why)

**Supplier Experience**:
- Clear feedback on rate compliance — suppliers know where they stand before billing is affected
- Self-service N/A toggles and PDF downloads reduce support queries and confusion
- Transparent approval process replaces opaque manual review

**Operational Efficiency**:
- Centralized approve/reject dashboard replaces ad-hoc spreadsheet reviews — estimated 5+ hours/week saved for the pricing team
- Automated price cap validation catches out-of-range submissions at entry time, reducing downstream rework
- Clean data (null vs $0 vs N/A) improves billing accuracy and reporting

**Business Value**:
- Accelerate rate completion from 38% (5,000/13,000) toward full coverage
- Reduce billing holds caused by supplier confusion about caps and compliance rules
- Price cap confidentiality maintained — suppliers cannot reverse-engineer caps from the validation feedback

**ROI**: Faster rate completion + fewer billing holds + reduced manual review effort — estimated significant operational savings per month once rate submission backlog is cleared.

---

## Owner & Stakeholders

| Role | Person |
|------|--------|
| **R** | Will Whitelaw |
| **A** | Khoa Duong |
| **C** | Sophie Pickett, Rudy Chartier |
| **I** | Zoe Judd |

---

## Assumptions & Dependencies, Risks

**Assumptions**:
- The 10% minimum price cap threshold is finalized and will not change significantly during development
- Suppliers will adopt the "submit price request" flow when their rates exceed caps, rather than abandoning rate entry
- Service-type level approvals (currently in preview) will be stable enough to build the approval dashboard on top of
- Existing `OrganisationPrice` model and per-location, per-service-type pricing grid can be extended without architectural rework

**Dependencies**:
- **SR0 (API Foundation)**: Token-based auth and API infrastructure must be in place for the standalone frontend
- **SR2 (Profile & Org Management)**: Location management must be available — pricing is scoped per location
- Price cap list and validation rules must be defined and maintained by the business team
- Existing rate management system (deployed Dec 2025) as the foundation

**Risks**:
- Suppliers may game the system by submitting rates just below the flag threshold (MEDIUM) -> Mitigation: Price cap thresholds remain confidential; validation feedback does not reveal exact cap values
- Approval dashboard may become a bottleneck if volume of out-of-cap submissions is high (MEDIUM) -> Mitigation: Batch approval tools, filtering by service type and location, and auto-approve for rates within a configurable tolerance band
- Data migration for existing $0 entries to null/N/A may be complex (LOW) -> Mitigation: Phased migration with business rules to distinguish genuine $0 rates from "not applicable" entries
- Digital platform pricing (Mable, etc.) remains unreliable and may need a separate manual workflow (LOW) -> Mitigation: Defer platform integration to SR9 (Integrations & Migration); manual workaround documented

---

## Estimated Effort

**3-4 sprints / 6-8 weeks**, approximately

- **Sprint 1**: Price cap validation + N/A toggle + partial rate entry cleanup
- **Sprint 2**: Approve/reject dashboard + compliance status indicators
- **Sprint 3**: PDF pricing reference + billing hold transparency + supplier compliance view
- **Sprint 4**: Edge case handling, digital platform workarounds, and data migration tooling

---

## Proceed to PRD?

**YES** — Direct dependency on operational efficiency and supplier experience. Rate submission backlog (62% incomplete) is a business-critical metric and the approval workflow is already being tracked in Linear (TMC-84, TMC-12, PLA-1354).

---

## Decision

- [ ] **Approved** - Proceed to PRD
- [ ] **Needs More Information** - [What's needed?]
- [ ] **Declined** - [Reason]

**Approval Date**: --

---

## Next Steps

**If Approved**:
1. [ ] Run `/trilogy-idea-handover` -- Gate 0 (create epic in Linear)
2. [ ] Run `/speckit-specify` -- Create detailed PRD
3. [ ] Run `/trilogy-clarify business` -- Refine business outcomes and success metrics
4. [ ] Run `/trilogy-research` -- Gather context from Teams, Fireflies, and codebase

---

**Notes**: Existing Linear tickets (TMC-84, TMC-12, PLA-1354) cover portions of this scope. The idea brief consolidates them into a single cohesive epic under the Supplier REDONE initiative. Price cap values are intentionally excluded from all supplier-facing documentation and UI to prevent gaming.
