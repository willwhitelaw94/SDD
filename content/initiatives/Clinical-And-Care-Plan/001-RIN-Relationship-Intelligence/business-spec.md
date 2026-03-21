---
title: "Business Specification: Relationship Intelligence"
description: "Business outcomes, success metrics, and stakeholder alignment for RIN"
---

# Business Specification: Relationship Intelligence

**Epic**: RIN — Relationship Intelligence
**Created**: 2026-02-17
**Status**: Draft

---

## Executive Summary

Relationship Intelligence (RIN) gives coordinators a unified view of each client — combining personal context (interests, family, preferences) with operational data (bills, complaints, incidents, touchpoints) — surfaced at the point of interaction. The primary driver is **Aged Care Quality Standards compliance** for monthly direct care management touchpoints, currently untracked and at risk of gaps. Secondary value is complaint reduction through relationship-first interactions.

---

## Business Problem

### Current State
- **No structured relationship data** — coordinators rely on memory for personal details about clients. When a coordinator is absent or reassigned, all context is lost
- **Fragmented operational view** — bills, complaints, incidents, and care plans live on separate screens. Coordinators toggle between 4-5 views to understand a client's full picture before calling
- **Untracked touchpoint compliance** — Trilogy Care has a regulatory requirement (Aged Care Quality Standards) for monthly direct care management touchpoints. There is currently **no system to track whether this is being met**. Compliance is unknown
- **Transactional interactions** — without personal context or conversation prompts, calls jump straight into operational issues, making clients feel like "just a number"

### Pain Points
1. Regulatory risk: monthly touchpoint compliance is unmeasured and likely inconsistent
2. Lost relationship context on coordinator handover or absence
3. 2-3 minutes wasted per call navigating between screens
4. Higher complaint rates from impersonal, transactional interactions

### Opportunity
- Establish the **first-ever touchpoint compliance measurement** — the act of measuring creates accountability
- Reduce coordinator prep time by consolidating data into a single view
- Build a relationship asset that persists beyond individual coordinators
- Reduce complaints by 15% through rapport-first interactions

---

## Business Objectives

### Primary Goals
1. **Achieve and track monthly touchpoint compliance** — regulatory requirement under Aged Care Quality Standards
2. **Establish a compliance baseline** — currently unknown; RIN will provide the first measurable data
3. **Reduce coordinator call prep time** — from 4-5 screen checks to a single unified view

### Secondary Goals
4. Reduce client complaints through relationship-first interactions
5. Build persistent relationship context that survives coordinator changes
6. Provide team leaders with oversight of per-coordinator compliance

### Non-Goals (Phase 1)
- AI-generated conversation prompts (Phase 2)
- Automated touchpoint detection from phone/email systems (Phase 2)
- Cross-organisation relationship views (Phase 2)
- Client-facing portal or self-service context editing
- Gamification or adoption dashboards

---

## Success Metrics & KPIs

| Metric | Baseline | Target | Measurement | Timeline |
|--------|----------|--------|-------------|----------|
| Monthly touchpoint compliance rate | Unknown (first baseline) | 90%+ within pilot pod | % clients contacted within 30 days | 4-6 weeks post-pilot |
| Personal context adoption | 0% | 70% of active clients have context | % clients with at least 1 entry | 3 months post-rollout |
| Call prep time | ~3 min (est. 4-5 screen toggles) | < 1 min (single view) | Coordinator survey / time study | Post-pilot survey |
| Client complaint rate | Current rate (to be baselined) | 15% reduction | Complaints per 100 clients per month | 6 months post-rollout |
| Context entry speed | N/A | < 15 seconds per entry | Measured via UX testing | At launch |

### Leading Indicators (first 4 weeks)
- Number of personal context entries created per coordinator per week
- Number of touchpoints logged per coordinator per week
- Compliance view access frequency (are team leaders checking it?)

### Lagging Indicators (3-6 months)
- Touchpoint compliance rate trend (monthly)
- Complaint rate trend (monthly)
- Client satisfaction survey scores (if available)

---

## Stakeholder Analysis

| Stakeholder | Role | Interest | RACI |
|-------------|------|----------|------|
| Romy Blacklaw | Product Owner | Feature delivers on care quality vision | **R** (Responsible) |
| Patrick Hawker | Head of Department | Regulatory compliance, team efficiency | **A** (Accountable) |
| William Whitelaw | Technical Lead | Architecture, implementation | **C** (Consulted) |
| Coordinator Pod (Pilot) | End Users | Daily workflow impact, usability | **C** (Consulted) |
| Team Leaders | Oversight Users | Compliance monitoring, team management | **I** (Informed) |
| Clinical Governance | Compliance | Regulatory audit trail | **I** (Informed) |

---

## Business Risks & Mitigations

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Low coordinator adoption of personal context capture | High — undermines core value | Medium | Integrate into natural workflow; quick-add form (< 15s); onboarding prompt; make it visible and valuable via conversation prompts |
| Stale/inaccurate personal context | Medium — could backfire in calls | Low | Last-updated timestamps; periodic review prompts (Phase 2) |
| Privacy concerns from clients | Medium — trust erosion | Low | No explicit consent required (covered by existing service agreements); data is internal-only; no client-facing exposure |
| Compliance data reveals gaps | Low — actually a benefit | High | Frame as "now we can see and fix it" rather than punitive. The baseline is unknown, so any measurement is progress |
| Pilot pod not representative | Medium — false positive/negative | Low | Choose a pod with typical caseload size and client mix |

---

## ROI Analysis

### Investment
- Development effort: ~6-8 weeks (estimated, pending technical plan)
- No new infrastructure costs (uses existing event sourcing, existing DB, existing models)
- Training: minimal (integrated into existing UI, onboarding prompts guide usage)

### Expected Returns
- **Regulatory compliance**: Eliminates risk of audit findings for touchpoint gaps — potential regulatory penalty avoidance
- **Coordinator efficiency**: 2-3 min saved per call x ~20 calls/day x ~50 coordinators = **~33-50 hours/week** saved across the organisation
- **Complaint reduction**: 15% reduction target. If current rate is X complaints/month, reduction = 0.15X fewer complaints to manage, investigate, and resolve
- **Retention**: Stronger client relationships reduce churn risk (hard to quantify, directionally positive)

### Payback Period
- Immediate value from touchpoint compliance tracking (regulatory risk reduction)
- Efficiency gains measurable within first month of pilot
- Complaint reduction signal expected at 3-6 months

---

## Rollout Strategy

### Phase 1: Pilot (Single Pod)
- **Scope**: Enable for one coordinator pod (~5 coordinators)
- **Duration**: 4-6 weeks
- **Success gate**: Touchpoint compliance rate measurable and trending toward 90%+
- **Feedback**: Weekly check-ins with pilot coordinators

### Phase 2: Expand
- If pilot succeeds, enable per-organisation via feature flag
- Staggered rollout to manage support load

### Phase 3: Mature
- Add Phase 2 features (AI prompts, adoption dashboards, automated detection)
- Cross-organisation views if multi-org clients are common

---

## Business Clarifications

### Session 2026-02-17

- Q: What is the pilot rollout strategy? → A: **Single pod first** (~5 coordinators, 4-6 weeks) before expanding
- Q: What is the primary go/no-go metric for expanding beyond pilot? → A: **Touchpoint compliance rate** — % of clients contacted within 30 days
- Q: Is there a current baseline for touchpoint compliance? → A: **Unknown / not tracked** — RIN will establish the first baseline. This is itself a value proposition
- Q: What regulatory body mandates the monthly touchpoint? → A: **Aged Care Quality Standards** — required under the quality and safeguards framework
- Q: Is explicit client consent needed for personal context storage? → A: **No** — covered by existing service agreements. Data is internal-only

---

## Approval

- [ ] Business objectives approved
- [ ] Success metrics defined and baselines planned
- [ ] Stakeholders aligned
- [ ] Pilot pod identified
