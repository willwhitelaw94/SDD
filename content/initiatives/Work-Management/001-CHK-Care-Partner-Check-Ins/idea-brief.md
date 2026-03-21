---
title: "Idea Brief: Care Partner Check-Ins"
---

# Idea Brief: Care Partner Check-Ins

**Created**: 2026-03-03
**Epic Code**: CHK

---

## Problem Statement (What)

- Care partners are no longer performing regular check-in calls with their clients — the previous check-in workflow was tied to package dates and note categories but has fallen out of active use
- The internal coordination team has reverted to **Excel spreadsheets** to track which clients need check-ins, creating manual overhead and data silos
- Check-ins are currently computed from package dates — they don't exist as their own record, so there's no way to attach questions, track completion details, or close feedback loops with other teams
- Clinical and other stakeholder groups have no mechanism to attach questions to upcoming check-ins, meaning care partners can't gather information on behalf of other business units during calls

**Current State**: The Care Partner Dashboard shows overdue/upcoming check-ins based on package dates. When a check-in note is recorded, the date updates and the item moves to the future. No structured data capture, no cross-team question assignment, and no standalone check-in record exists.

---

## Possible Solution (How)

Promote check-ins from a computed date to a **standalone record** with its own lifecycle and dedicated screens.

- **Check-In record** — a dedicated record with status, due date, assigned care partner, linked client, and completion details
- **Recurring schedule** — auto-generate check-ins on a quarterly cadence (every 3 months) per active client, configurable per client/package
- **Question assignment** — clinical team and other stakeholders can attach questions to upcoming check-ins so care partners gather specific information during the call
- **Structured completion** — care partners action check-ins through a guided flow: answer assigned questions, record notes, mark complete
- **My Activities integration** — check-ins surface in the existing Care Partner Dashboard sidebar with overdue/today/upcoming grouping
- **Feedback loop** — completed check-in responses route back to the requesting stakeholder group

```
// Before (Current)
1. Coordination team tracks due dates in Excel
2. Care partner sees overdue item on dashboard (package date-driven)
3. Care partner calls client, records a note with "Check-In" category
4. Package date updates — no structured data captured
5. Clinical team has no visibility or input

// After (New)
1. System auto-generates check-in every 3 months per client
2. Clinical team attaches questions before the due date
3. Care partner sees check-in in My Activities with questions listed
4. Care partner calls client, completes structured check-in form
5. Responses flow back to clinical team — feedback loop closed
```

---

## Benefits (Why)

**Client Experience**:
- Guaranteed regular touchpoints every 3 months — no clients falling through the cracks
- More meaningful calls when care partners arrive with targeted questions from clinical team

**Operational Efficiency**:
- Eliminates Excel-based tracking for the coordination team — estimated 5+ hours/week of manual effort across the team
- Structured records replace free-text notes — reportable and auditable

**Business Value**:
- Closes the feedback loop between care partners and clinical teams
- Creates a compliance-ready audit trail of client engagement frequency (~5,000 check-ins/quarter across 15,000 clients)
- Supports regulatory requirement for regular client contact between monthly direct care and annual care plan review

---

## Owner & Stakeholders

| Role | Person |
|------|--------|
| **R** | — |
| **A** | — |
| **C** | — |
| **I** | — |

---

## Assumptions & Dependencies, Risks

**Assumptions**:
- Existing check-in functionality in the portal can be extended rather than rebuilt from scratch
- The 3-month default cadence is the primary use case, but cadence should be configurable per client
- Care partners will adopt the new workflow if it's integrated into their existing dashboard

**Dependencies**:
- Care Partner Dashboard — the "My Activities" panel will need to show the new check-in records
- Existing check-in date tracking on packages — will need to coexist during transition

**Risks**:
- Transition from the current date-based check-ins to standalone records needs a migration plan (MEDIUM) → Mitigation: run both systems in parallel during rollout, use a feature flag
- Question assignment adds cross-team coordination overhead (LOW) → Mitigation: keep questions optional, start with clinical team only

---

## Estimated Effort

**Medium (3-4 sprints)**, to be refined during specification

- **Sprint 1**: Check-in records, scheduling, and care partner/coordinator views
- **Sprint 2**: Question assignment, structured completion form, dashboard integration
- **Sprint 3**: Feedback loop, transition from current system, notifications
- **Sprint 4**: Reporting, compliance views, polish

---

## Proceed to PRD?

**YES** — Core coordination team is using Excel workarounds, care partners have stopped doing check-ins, and existing infrastructure provides a strong foundation to build on.

---

## Decision

- [ ] **Approved** - Proceed to PRD
- [ ] **Needs More Information**
- [ ] **Declined**

**Approval Date**: —
