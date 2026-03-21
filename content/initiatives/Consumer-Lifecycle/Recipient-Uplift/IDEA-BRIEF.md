---
title: "Idea Brief: Recipient Uplift (RCU)"
description: "Consumer Onboarding > Recipient Uplift"
icon: i-heroicons-light-bulb
navigation:
  order: 1
---

**Created**: 2026-01-27
**Epic Code**: RCU
**Initiative**: Consumer Onboarding (TP-1858)

---

## Problem Statement (What)

- Recipient portal not optimized as user-friendly experience
- All data on one long scrollable page — key package information not immediately visible
- Navigation not mobile-optimized (~40% of users on mobile)
- Limited self-service capabilities force recipients to contact support for routine tasks

**Current State**: Recipients struggle to find key information; high support call volume for basic queries

---

## Possible Solution (How)

Redesign and enhance the recipient-facing experience with:

- **Simplified Navigation** — Intuitive menu structure optimized for all device sizes
- **Dashboard Window** — Key package info at a glance with direct links to common tasks
- **Self-Service Features** — Profile updates, invoice comments, budget requests from one place
- **Mobile-First Design** — Responsive interface for ~40% mobile user base
- **SAH Integration** — Digital Home Care Agreement signing and SAH-mandated interactions
- **Transparency Improvements** — Clear visibility of pending payments, care activity, package utilization

```
// Before (Current)
1. Long scrollable page with all data
2. Key info buried below fold
3. Limited mobile usability
4. Call support for basic tasks

// After (With RCU)
1. Dashboard with key info at glance
2. Clear navigation to tasks
3. Mobile-optimized experience
4. Self-service for routine actions
```

---

## Benefits (Why)

**User/Client Experience**:
- Faster access to key actions — view budgets, sign agreements, manage bills
- Increased self-service reduces frustration and wait times

**Operational Efficiency**:
- Fewer support calls for routine queries (contact info, payment status, navigation)
- Higher engagement and retention through improved UX

**Business Value**:
- SAH compliance — seamless integration of mandated recipient interactions
- Foundation for mobile app and future recipient features

**Benefit Rating**: 5/5 — High impact on satisfaction, engagement, and operational efficiency

---

## Owner & Stakeholders

| Role | Person |
|------|--------|
| **R** | Beth Poultney (PO), David Henry (BA), Ed King (Des), Khoa Duong (Dev) |
| **A** | Will Whitelaw |
| **C** | Nick Lunn |
| **I** | — |

---

## Assumptions & Dependencies, Risks

**Assumptions**:
- SAH requirements for recipient interactions (agreement signing, contribution display) are finalized
- Core portal infrastructure supports responsive design without major re-platforming

**Dependencies**:
- Supplier Onboarding and Budget V2 features completed
- Updated contact data accuracy for communications and agreements

**Risks**:
- Design complexity vs SAH timeline (MEDIUM) → Mitigation: Phased rollout, prioritize SAH-critical features
- UX change confusion (LOW) → Mitigation: Recipient onboarding, in-app guidance, support training

---

## Estimated Effort

**~2 sprints** (plus UX design phase)

| Factor | Rating |
|--------|--------|
| Effort | 3/5 — Design, backend integrations, frontend rebuild of multiple views |
| Cost | 2/5 — Moderate, mostly internal design/dev resourcing |
| Benefit | 5/5 — High impact on satisfaction and efficiency |

- **Design Phase**: UX research, wireframes, prototypes
- **Sprint 1**: Core navigation, dashboard, mobile responsiveness
- **Sprint 2**: Self-service features, SAH integration, transparency views

---

## Proceed to PRD?

**YES** — RCU directly improves recipient satisfaction and aligns with SAH compliance requirements.

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
3. [ ] Create Jira epic
4. [ ] Break down into user stories
