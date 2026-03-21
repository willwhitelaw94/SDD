---
title: "Idea Brief: On Hold Bills Flow (OHB)"
description: "Budgets And Finance > On Hold Bills Flow"
icon: i-heroicons-light-bulb
navigation:
  order: 1
---

**Epic Code**: OHB (TP-3787) | **Created**: 2026-01-14

---

## Problem Statement (What)

Trilogy Care processes hundreds of thousands of bill line items monthly, but bills that can't be auto-rejected or auto-paid go "on hold" with only ONE reason at a time, creating multiple rejection-resubmission cycles.

**Pain Points:**
- Bills on hold show only ONE reason at a time, forcing suppliers to fix issues one by one
- Multiple rejection-resubmission cycles waste time and create frustration
- No coordination between departments (Care, Compliance, Accounts) for internal resolution
- Bottlenecks, delayed payments, and wasted capacity on preventable resubmissions
- No consolidated communication to suppliers about all issues

**Current State**: Single-reason holds, multiple resubmission cycles, no department coordination, delayed payments.

---

## Possible Solution (How)

Multi-issue tracking system with AI-assisted diagnosis and consolidated single-communique output:

- **AI Auto-Reject**: Instantly reject bills with 99% accurate disqualifiers (9 eligible reasons)
- **Multi-Issue Diagnosis**: Identify ALL reasons simultaneously (36 reason taxonomy)
- **Parallel Department Routing**: Route to Care/Compliance/Accounts with discrete reason-level tracking
- **Temporal Re-validation**: Re-check time-sensitive qualifiers before every communication
- **Two Communication Streams**: Resolution Outreach (to Client/Coordinator) + Submitter Notification (to Supplier)
- **Batch → Single Communique**: All unresolved reasons collected, ONE communication type to supplier with ALL issues

```
// Before (Current)
1. Single-reason holds
2. Multiple resubmission cycles
3. No department coordination
4. Fragmented supplier communication

// After (With OHB)
1. Multi-issue diagnosis
2. Fix all issues in one go
3. Parallel department resolution
4. Single consolidated communication
```

**Communication Types:**
- REJECT-RESUBMIT — supplier can fix and resubmit
- REJECT PERIOD — bill rejected, no resubmission
- ON HOLD — awaiting internal or external resolution

---

## Benefits (Why)

**User/Client Experience:**
- Suppliers receive clear, consolidated feedback with all issues
- Faster resolution with single resubmission fixing all problems
- Privacy preservation (client issues stay internal when resolved quickly)

**Operational Efficiency:**
- 60-70% fewer resubmission cycles (fix all issues in one go)
- 50% faster processing with AI auto-reject

**Business Value:**
- Efficiency — reduced resubmission cycles and faster payments
- Quality — audit trail for root cause analysis and process improvement
- Client experience — clear, consolidated feedback

---

## Owner & Stakeholders

| Role | Person |
|------|--------|
| **R** | David Henry (PO, BA), Romy Blacklaw (PO), Mellette Opena-Fitzpatrick (PO), Bruce Blyth (Des), Khoa Duong (Dev) |
| **A** | Marko Rukovina, Patrick Hawker |
| **C** | Katja Panova |
| **I** | Luke Traini |

---

## Assumptions, Dependencies & Risks

**Assumptions:**
- AI capability exists for 99% accurate auto-reject
- Master reason list (TP-3816) will be complete and deduplicated
- Departments can define clear resolution criteria

**Dependencies:**
- TP-3813: Care team reasons (Romy)
- TP-3814: Compliance reasons (Zoe)
- TP-3815: Accounts reasons (Mellette)
- TP-3816: Master list compilation (David)

**Risks:**
- AI accuracy <99% (HIGH impact, MEDIUM probability) → Phased rollout with human review
- Master list incomplete (MEDIUM impact, MEDIUM probability) → Stakeholder validation workshops
- Department workflows unclear (MEDIUM impact, MEDIUM probability) → Early engagement with teams

---

## Success Metrics

- Resubmission cycles reduced by 60-70%
- Bill processing time reduced by 50%
- Supplier satisfaction improved with consolidated feedback
- Zero privacy breaches (client issues resolved internally)

---

## Estimated Effort

**L (Large) — 10-14 weeks**

**Scope Boundaries:**

*IN SCOPE:*
- 36-reason master taxonomy with `Requires_Resolution_Outreach` classification
- AI auto-reject (9 eligible reasons)
- Multi-issue diagnosis engine
- Two communication streams
- 1-day resolution window for client/coordinator issues
- Cadence system for ON HOLD (Day 0→3→7→10)
- Audit trail, analytics dashboard

*OUT OF SCOPE:*
- Upstream bill submission process changes
- Supplier portal rebuild
- Retrospective data migration
- Fund reservation system

---

## Supplier Service Verification (SVF)

> **BRP Priority**: P1 — Supplier Management
> **JIRA**: TP-2478

### Problem

Under Support at Home reforms, suppliers must meet compliance requirements at the **service level**, not just provider level. Currently:
- Portal tracks verification only at provider level
- Bills submitted for unverified services → manual holds and follow-up
- Suppliers lack visibility into what they're verified for
- Compliance officers manually chase documents and expiring credentials

### Solution

Extend On Hold Bills to include service-level verification:

1. **Service-Level Compliance** — Each service has its own checklist from Compliance Matrix
2. **Bill-Triggered Workflow** — When bill held for unverified service, auto-send Update Service Request email
3. **Supplier Self-Service** — Verified suppliers can add/update services, upload docs, receive expiry reminders
4. **Compliance Dashboard** — Officers review/approve submissions, view unverified suppliers
5. **Billing Visibility** — Staff see service-level verification indicators on invoices

### Scope within OHB

| Component | OHB Scope |
|-----------|-----------|
| Unverified service reason | Part of 36-reason taxonomy |
| Bill-triggered workflow | Auto-email when held for verification |
| Compliance hold resolution | Department routing to Compliance team |
| Supplier notification | Included in consolidated communication |

### Success Metrics

- 100% of Tier-3 services have defined compliance checklists
- 50% reduction in manual compliance follow-ups
- 100% supplier access to compliance summary

### Dependencies

- **SOP - Supplier Onboarding 2** — Integration with onboarding flow
- **Compliance Matrix** — Must be complete and maintained

---

## Decision

- [ ] **Approved** — Proceed to specification
- [x] **Needs More Information** — Pending master list compilation (TP-3816) and stakeholder approval
- [ ] **Declined**

---

## Next Steps (If Approved)

1. Complete master reason list (TP-3816)
2. Stakeholder alignment on department workflows
3. `/speckit.specify` — Create detailed technical specification
