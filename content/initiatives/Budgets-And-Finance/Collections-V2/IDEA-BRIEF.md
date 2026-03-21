---
title: "Idea Brief: Collections V2 (COL2)"
description: "Budgets And Finance > Collections V2"
icon: i-heroicons-light-bulb
navigation:
  order: 1
---

**Epic Code**: COL2 (TP-2285) | **Created**: 2026-01-14

---

## Problem Statement (What)

Current collections process lacks sophisticated rules, targeting capabilities, and systematic tracking for improvement.

**Pain Points:**
- Current collections process lacks sophisticated rules and targeting capabilities
- Collection workflows are manual and time-intensive for billing teams
- No intelligent prioritization or escalation mechanisms for overdue accounts
- Collections data and outcomes are not systematically tracked
- Compliance with fair collection practices is difficult to monitor

**Current State**: Manual collections, limited tracking, inconsistent processes, compliance gaps.

---

## Possible Solution (How)

Implement advanced collections management system with rule-based workflows:

- **Intelligent Prioritization**: Account prioritization based on aging and risk assessment
- **Automated Escalation**: Automated triggers for overdue accounts
- **Tracking Dashboard**: Comprehensive collections tracking and reporting
- **Compliance Monitoring**: Fair practice enforcement and monitoring
- **Rule Engine**: Configurable business rules for collections workflows

```
// Before (Current)
1. Manual collections
2. Limited tracking
3. Inconsistent processes
4. Compliance gaps

// After (With COL2)
1. Automated workflows
2. Intelligent prioritization
3. Comprehensive tracking
4. Compliance verified
```

---

## Benefits (Why)

**User/Client Experience:**
- Consistent, fair collections experience for clients
- Clear communication and escalation paths

**Operational Efficiency:**
- Reduces manual workload for billing and collections teams
- Intelligent targeting improves collection success rate

**Business Value:**
- Efficiency — automated prioritization and workflows
- Compliance — fair collection practice enforcement
- Insights — data-driven collections performance analysis

---

## Owner & Stakeholders

| Role | Person |
|------|--------|
| **R** | Mellette Opena-Fitzpatrick (PO), Marlèze Scheepers (PO), Steven Boge (BA), Ed King (Des), Khoa Duong (Dev) |
| **A** | Marko Rukovina |
| **C** | Marko Rukovina |
| **I** | — |

---

## Assumptions, Dependencies & Risks

**Assumptions:**
- Collections rules and escalation criteria are well-defined by business
- Account aging and payment data is accurate and up-to-date

**Dependencies:**
- Billing system integration must support rule implementation
- Notification system must be reliable for escalations

**Risks:**
- Overly aggressive automated collections (HIGH impact, MEDIUM probability) → Human review workflows; fair practice validation
- Account data quality issues (MEDIUM impact, MEDIUM probability) → Data validation and cleansing before implementation
- Integration complexity with billing (HIGH impact, MEDIUM probability) → Phased integration approach with testing

---

## Success Metrics

- Collections success rate improved by 20%
- Manual collections workload reduced by 50%
- Zero compliance violations from collections practices
- Average days to collection reduced by 30%

---

## Estimated Effort

**L (Large) — 4-6 sprints**

- Sprint 1: Collections workflow design & requirements
- Sprint 2-3: Rules engine & prioritization implementation
- Sprint 3-4: Automation & escalation logic
- Sprint 5-6: Reporting, testing & launch

---

## Decision

- [ ] **Approved** — Proceed to specification
- [x] **Needs More Information** — Collections rules and compliance framework need stakeholder alignment
- [ ] **Declined**

---

## Next Steps (If Approved)

1. Finalize collections rules with business stakeholders
2. Legal review of fair practice requirements
3. `/speckit.specify` — Create detailed technical specification
