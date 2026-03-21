---
title: "Idea Brief: Care Circle Uplift (CCU)"
description: "Clinical and Care Plan > Care Circle Uplift"
icon: i-heroicons-light-bulb
navigation:
  order: 1
---

**Created**: 2026-01-14
**Epic Code**: CCU
**Initiative**: Clinical and Care Plan (TP-1859)

---

## Problem Statement (What)

- Current Contacts module only displays ~6 rows at once, relies on free-text role entries
- Surfaces only the primary Supporter Representative from My Aged Care — missing contacts and inaccurate authority attribution
- Coordinators and Care Partners struggle to find and manage the right stakeholders efficiently
- Critical flows (HCA sign-off, care communications, compliance audits) depend on accurate contact-role mapping
- Need clarity on responsibilities and limitations of Authorised Representatives and Supporters

**Current State**: Missing contacts, inaccurate authority attribution, and downstream compliance risks due to limited contact visibility and free-text roles

---

## Possible Solution (How)

Deliver a **Contact Module Uplift** that:

- **Expanded Grid** — ≥15 visible rows on desktop; mobile accordion with lazy load
- **Role Taxonomy** — Fixed roles: Supporter Rep, Secondary Supporter, GP, Specialist, Informal Carer, Emergency Contact, Other
- **Authority Mapping** — Roles mapped to authority levels: Decision-Maker, Advisor, View-Only
- **Primary Decision-Maker** — Exactly one per recipient; editable only by Trilogy staff, Care Partners, or existing Primary Decision-Makers
- **CRUD Workflows** — Add/edit/archive with audit logging
- **MAC Contact Import** — Monthly + manual refresh with conflict resolution in side-by-side modal
- **Private Partners** — Add GPs, pharmacists, specialists with predefined partner types
- **Activity Visibility** — Surface "Last Login" and "Last Communication" per contact

```
// Before (Current)
1. ~6 visible contacts at once
2. Free-text roles, no authority mapping
3. Only primary MAC contact visible
4. No audit trail for changes

// After (With CCU)
1. ≥15 visible rows, mobile accordion
2. Fixed role taxonomy + authority levels
3. All MAC contacts imported + reconciled
4. Full audit logging
```

---

## Benefits (Why)

**User/Client Experience**:
- Faster navigation and clearer role visibility — addresses top pain point
- Contact add/classify completed in ≤30 seconds

**Operational Efficiency**:
- 100% of MAC contacts surfaced and reconciled (no manual re-keying)
- Role-specific comms, HCA sign-off workflows at scale

**Business Value**:
- Accuracy & Governance — every recipient has one validated Primary Decision-Maker
- Compliance — complete audit of all lifecycle changes; no mis-escalations
- SAH readiness — prerequisite for HCA workflows

---

## Owner & Stakeholders

| Role | Person |
|------|--------|
| **R** | Romy Blacklaw (PO), Beth Poultney (PO, Des), David Henry (BA), Khoa Duong (Dev) |
| **A** | Patrick Hawker |
| **C** | Patrick Hawker |
| **I** | — |

---

## Assumptions & Dependencies, Risks

**Assumptions**:
- MAC integration delivers contact exports but does not push deletes; stale contacts flagged manually
- Monthly sync cadence plus manual refresh is sufficient
- Multiple roles per contact allowed

**Dependencies**:
- MAC contact export API
- Audit logging and comms governance align with Care Management Activities (CMA)
- Email MVP is mailto; in-portal sendMail may follow under CMA

**Risks**:
- Authority mis-mapping — wrong person signing HCA (HIGH) → Mitigation: Role-to-authority locks and audit confirmation
- MAC schema changes — import failures (MEDIUM) → Mitigation: Contract tests and schema versioning
- Mobile UX degradation — large lists harder on small screens (LOW) → Mitigation: Accordion and virtual scroll

---

## Estimated Effort

**2–3 sprints**

- **Sprint 1**: Design — Grid uplift, role taxonomy, authority model, MAC import UX
- **Sprint 2**: Backend — Role schema, MAC import logic, audit logging, CRUD workflows
- **Sprint 3**: Frontend — Expanded grid, mobile accordion, conflict resolution modal, email hooks

---

## Proceed to PRD?

**YES** — CCU upgrades the Contacts module with structured roles, authority mapping, and auditability to ensure compliant, accurate stakeholder management under SAH.

---

## Decision

- [ ] **Approved** - Proceed to PRD
- [ ] **Needs More Information**
- [ ] **Declined**

**Approval Date**: ____

---

## Next Steps

**If Approved**:
1. [ ] Create PRD (spec.md)
2. [ ] Create RACI Matrix
3. [ ] Create Jira epic (TP-1908)
4. [ ] Break down into user stories
