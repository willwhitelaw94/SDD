---
title: "Idea Brief: CareVicinity Job Posting"
description: "Supplier Management > CareVicinity Job Posting"
icon: i-heroicons-light-bulb
navigation:
  order: 1
---

**Epic Code**: CVJ | **Created**: 2026-02-19

---

## Opportunity Statement (What)

TC Portal and CareVicinity are sister platforms under Trilogy Care that currently operate independently. By connecting them at the moment a Care Coordinator needs a supplier, we can drive job volume through CareVicinity while providing a convenient path for users who would choose CV anyway.

**Opportunity:**
- CareVicinity is a Trilogy-owned marketplace — more jobs through CV benefits the business
- Care Coordinators who choose to use CV currently re-enter data that already exists in the budget
- No automatic link between budget line items and CV jobs for future invoice matching
- This is the first real integration between TC Portal and CV — establishes reusable patterns

**Current State**: TC Portal and CV are disconnected; users who want to post to CV must context-switch and re-key data.

**Important Context**: This is a business opportunity, not a pain point fix. Care Coordinators have other ways to find suppliers — CV is optional. Self-managed recipients organise their own care.

---

## Proposed Solution (How)

Add a "Post to CareVicinity" button to the Planned Service modal in TC Portal:

- **Context Passing**: Button opens CV in new window with pre-filled job details (recipient, service type, schedule, budget line ID)
- **Lightweight Integration**: No webhooks or complex sync for first pass
- **State Indicator**: Button changes from "Post to CareVicinity" to "View in CareVicinity" after job is posted
- **Independent Auth**: CV handles login on their side if user isn't already authenticated

```
// User Flow
1. Coordinator reviews budget in TC Portal
2. Sees service needs a supplier
3. Clicks "Post to CareVicinity" button
4. CV opens in new tab with pre-filled details
5. Coordinator posts job in CV
6. Returns to Portal — button shows "View in CareVicinity"
```

---

## Benefits (Why)

**Business Value:**
- Drives job volume through Trilogy-owned CareVicinity marketplace
- Budget line ID linkage enables future automated invoice matching
- Establishes integration patterns for deeper TC ↔ CV connectivity

**User Experience:**
- Eliminates re-keying for coordinators who choose to use CV
- Seamless handoff without disrupting existing workflow
- CV remains optional — not a mandate

**Operational Efficiency:**
- Foundation for invoice reconciliation automation
- Fewer data entry errors from manual re-keying

---

## Owner & Stakeholders

| Role | Person |
|------|--------|
| **R** | Beth Poultney (Design), Bruce (Technical), Liam (CareVicinity) |
| **A** | Ed King |
| **C** | Care Coordinators, Care Partners |
| **I** | Finance/AR (future invoice matching) |

---

## Assumptions, Dependencies & Risks

**Assumptions:**
- CV can accept context via URL parameters or similar lightweight mechanism
- Budget line ID format is stable and can be passed to CV
- Users who click the button intend to post a job (not just browse CV)

**Dependencies:**
- CareVicinity team availability to build receiving endpoint
- Agreement on data contract between TC Portal and CV
- Auth flow decision (OAuth vs independent login)

**Risks:**
- Data contract changes (MEDIUM impact, LOW probability) → Define clear versioned contract
- User confusion about CV being optional (LOW impact, MEDIUM probability) → Clear UI messaging
- Button clicked but job not posted (LOW impact, HIGH probability) → Accept for v1, webhook sync in future

---

## Success Metrics

- Increase in jobs posted through CareVicinity from TC Portal users
- Reduction in time from "need supplier" to "job posted" for CV users
- Budget line ID present on >95% of jobs posted via integration
- User satisfaction with posting flow >4/5

---

## Estimated Effort

**S (Small) — 1-2 sprints**

- Sprint 1: Discovery workshop, data contract definition, design
- Sprint 2: Implementation (button, context passing, state indicator)

---

## Decision

- [ ] **Approved** — Proceed to specification
- [x] **Needs More Information** — Workshop scheduled
- [ ] **Declined**

---

## Next Steps (If Approved)

1. Run discovery workshop to finalise data contract and auth flow
2. Design button placement and states
3. `/speckit.specify` — Create detailed technical specification

---

## Open Questions

1. **Data contract**: What exactly does CV need to pre-fill a job? What format?
2. **Auth flow**: OAuth handoff? Session sharing? Or let CV handle login separately?
3. **State sync**: How does Portal know a job was posted? Manual refresh acceptable for v1?
4. **Button visibility**: Show for all services with no supplier, or only certain types?
