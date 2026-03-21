---
title: "Business: Care Partner Check-Ins"
---

# Business: Care Partner Check-Ins

## Executive Summary

Re-enable structured check-in calls between care partners and their clients. Check-ins fill the gap between monthly direct care activities and annual care plan reviews. The coordination team currently tracks these via Excel spreadsheets — this feature replaces that manual process with a first-class system artifact, starting with clinical team question assignment and a care partner completion workflow.

## Business Problem

**Current state**:
- Care partners have stopped performing regular check-in calls with clients
- Coordination team tracks who needs check-ins via Excel spreadsheets
- Existing portal infrastructure computes check-ins from package dates but lacks structured data capture
- No mechanism for clinical team to attach questions or receive feedback from check-in calls

**Pain points**:
- Excel workaround is unsustainable and creates data silos
- No audit trail of client engagement frequency
- Clinical team has no visibility into or input on check-in conversations
- Third-party coordinators involved in client relationships have no structured touchpoint

**Opportunity**:
- Regulatory requirement exists for regular client contact — check-ins formalise the gap between monthly direct care and annual care plan review
- Establishes constant communication and connection with clients, even when third-party coordinators are involved
- Existing codebase infrastructure (enums, data classes, dashboard components) provides a strong foundation

## Business Objectives

**Primary goals**:
- Replace Excel-based check-in tracking with a system-managed process
- Ensure every active client receives regular formal check-in calls from their care partner
- Enable clinical team to assign questions to upcoming check-ins, closing the feedback loop

**Secondary goals**:
- Create a compliance-ready audit trail of client engagement
- Surface check-in status in the existing My Activities dashboard
- Provide structured data capture replacing free-text notes

**Non-goals (for V1)**:
- Question assignment from teams beyond clinical
- Client-facing check-in experience (e.g., mobile app)

## Success Metrics & KPIs

| Metric | Baseline | Target | Measurement |
|--------|----------|--------|-------------|
| Check-in completion rate | Unknown (Excel) | TBD | % of due check-ins completed on time |
| Clients with overdue check-ins | Unknown | TBD | Count of clients past due date without completed check-in |
| Excel usage for check-in tracking | Active | Zero | Coordination team fully migrated off Excel |
| Clinical question attachment rate | 0% | TBD | % of check-ins with at least one clinical question |

## Stakeholder Analysis

| Stakeholder | Role | Interest | RACI |
|-------------|------|----------|------|
| Care Partners | Primary user | Execute check-in calls, complete structured forms | R |
| Coordination Team | Process owner | Currently managing via Excel, need system replacement | R |
| Clinical Team | Question assigner | Attach questions to check-ins, receive feedback | C |
| Clients | Recipient | Receive regular contact from care partner | I |
| — | Executive sponsor | — | A |

## Business Risks & Mitigations

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Migration from package-date check-ins to entity-based | Medium | Medium | Run both systems in parallel during rollout, feature-flag new entity |
| Care partner adoption of new workflow | Medium | Low | Integrate into existing My Activities dashboard — minimal workflow change |
| Question assignment adds coordination overhead | Low | Low | Start with clinical team only, keep questions optional |

## ROI Analysis

**Investment**: Medium (3-4 sprints)
**Expected returns**:
- Elimination of manual Excel tracking (coordination team time saved)
- Compliance coverage for client contact requirements
- Structured data enabling reporting and audit

**Payback period**: To be quantified after baseline metrics established

## Market Context

**Regulatory context**: Requirement for regular client contact through direct care activities. Check-ins formalise the touchpoint between monthly direct care and annual care plan review/reissue.
**Target users**: Care partners and care coordinators (both from V1)
**Timing driver**: Operational pain — Excel workaround is unsustainable now

## Business Clarifications

### Session 2026-03-03

- Q: Compliance driver? → A: Regulatory requirement for monthly client contact via direct care activities. Check-ins fill the gap between monthly direct activity and annual care plan review. Also want constant communication even with third-party coordinators involved.
- Q: Primary success metric? → A: Check-in completion rate
- Q: Question assigners? → A: Clinical team only for V1, expand later
- Q: Timing driver? → A: Operational pain — Excel workaround is unsustainable
- Q: Cadence? → A: Every 3 months. Monthly contact requirement is met through direct care activities; formal check-ins are the quarterly touchpoint.
- Q: Scope? → A: Both care partner AND care coordinator check-ins from day one (not phased).
- Q: Scale? → A: ~15,000 clients, ~150 care partners. Implies ~5,000 check-ins generated per quarter.
- Q: Clinical notification? → A: Self-serve review — clinical team checks at their own pace, no push notifications for V1.

## Approval

- [ ] Business objectives approved
- [ ] Success metrics defined
- [ ] Stakeholders aligned
