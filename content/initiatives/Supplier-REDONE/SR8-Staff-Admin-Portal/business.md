---
title: "Business Alignment: Staff Admin Portal"
---

# Business Alignment: Staff Admin Portal

**Epic Code**: SR8
**Created**: 2026-03-19
**Author**: Will Whitelaw

---

## Business Objectives

1. **Fix a production bug causing support overhead** -- the impersonation system targets the hardcoded owner, which breaks when the owner changes roles or is deactivated. Staff get 404 errors, create support tickets, and cannot assist suppliers. This is happening today.
2. **Adapt staff tooling for the two-tier model** -- SR0 introduces Organisation > Supplier hierarchy. Without staff-side updates, staff cannot see which suppliers belong to which organisation, cannot distinguish roles, and cannot make informed decisions on stage changes or approvals.
3. **Consolidate approval workflows** -- pending document approvals and stage updates live in separate views. Staff miss items because there is no unified queue.
4. **Reduce operational friction** -- role confusion between owner and administrator causes incorrect access decisions and unnecessary escalations.

---

## Success Metrics

| KPI | Target | Measurement Method | Baseline |
|-----|--------|--------------------|----------|
| Impersonation 404 errors | Zero | Error monitoring (Sentry/logs) post-deployment | Multiple per week (active production bug) |
| Time to identify org hierarchy for a supplier | < 2 clicks from supplier index | UX task timing | Currently requires clicking into each supplier individually |
| Role visibility accuracy | 100% of users on team tab show correct role label | Manual audit of supplier team tabs | Roles conflated (owner vs admin unclear) |
| Missed approval items due to view separation | Zero | Compare pending items across views vs unified queue | Unmeasured but reported by staff |
| Support tickets for impersonation failures | Zero | Support ticket tracking | Multiple per month |

---

## ROI Analysis

### Costs

| Item | Estimate | Notes |
|------|----------|-------|
| **Phase A (P1 -- Critical Fixes)** | 3-5 days | Impersonation fix (US1), org hierarchy card (US2), role labels (US3). Zero SR0 hard dependency for the bug fix |
| **Phase B (P2 -- Enhancements)** | 5-8 days | Unified approval queue (US4), stage transitions with org context (US6), org-aware search (US7). Can be deferred |
| **Deferred (US5)** | 1-2 days | Coordinator-supplier linkage UI. Blocked on PLA-1312 data model |
| QA and testing | ~2 days | Impersonation edge cases, role display validation |
| **Total estimated cost** | **Phase A: ~1 week, Phase B: ~2 weeks** | Phase A can ship independently |

### Benefits

| Benefit | Estimated Value | Timeframe |
|---------|----------------|-----------|
| Support ticket reduction (impersonation) | ~2-4 hrs/week staff time recovering from 404 errors, re-routing impersonation requests, workarounds | Immediate (Phase A) |
| Faster supplier investigation | ~5-10 min saved per supplier lookup when staff need org context (currently requires multiple page loads) | Immediate (Phase A) |
| Reduced role confusion escalations | ~1-2 hrs/week wasted on incorrect access decisions due to owner/admin conflation | Immediate (Phase A) |
| Approval throughput improvement | Unmeasured but consolidating 2 separate views into 1 queue reduces context-switching and missed items | Phase B |

### Payback Period

**Phase A pays back in under 2 weeks.** The impersonation bug fix alone eliminates a recurring support drain. The org hierarchy card and role labels are low-effort, high-visibility improvements.

**Phase B payback is 1-2 months** if implemented, but can be deferred without business-critical impact.

---

## Stakeholder Impact

| Stakeholder | Impact | Sentiment |
|-------------|--------|-----------|
| **TC Staff (Support)** | Impersonation works reliably, org context visible, role labels clear. Directly addresses their daily pain | Strongly positive |
| **TC Staff (Approvals)** | Unified queue replaces two separate views. Reduced risk of missed approvals | Positive (Phase B) |
| **Sophie Pickett (Ops)** | Better visibility into supplier operations, fewer escalations from role confusion | Positive |
| **Suppliers** | No direct impact -- this is staff-facing tooling. Indirect benefit: faster support response when they raise issues | Neutral |
| **Khoa Duong / Stephen Bogue (Tech)** | Consulted on existing controller architecture and impersonation system | Neutral |

---

## Risk to Business

### If we don't do this

- **Impersonation bug persists**: Staff continue hitting 404 errors when impersonating suppliers whose owners have changed. This creates support overhead and delays issue resolution for suppliers. The bug exists today and gets worse as more suppliers change ownership over time.
- **Two-tier model is unusable for staff**: When SR0 ships and suppliers start using the Organisation > Supplier hierarchy, staff have no way to see the organisation-level picture. They will be making decisions (stage changes, approvals) without full context.
- **Approval items get missed**: With separate views for document approvals and stage updates, staff must remember to check both. Items fall through the cracks, delaying supplier onboarding.

### If we do it badly

- **Impersonation fix picks the wrong user**: If the active administrator selection logic has edge cases (e.g., multiple admins, deactivated users with active sessions), staff could impersonate as the wrong user with incorrect permissions.
- **Org hierarchy card shows stale data**: If the card does not refresh when supplier-org relationships change, staff make decisions based on outdated information.
- **Role labels are misleading**: If the owner/admin distinction is displayed but the underlying permissions are not aligned (e.g., showing "Organisation Administrator" before SR0 ships the role), staff trust the label but get unexpected behaviour.

---

## Dependencies on Other Epics

| Dependency | Type | Detail |
|------------|------|--------|
| **SR0 (API Foundation)** | Soft dependency | Phase A (impersonation fix) has zero SR0 dependency -- the Organisation model and relationships already exist. Phase B benefits from the full two-tier role model but can work with current roles |
| **PLA-1312 (Coordinator Linkage)** | Hard blocker for US5 only | Jay's work on coordinator-supplier data model must land before US5 can be built. US5 is already deferred |
| **SR2 (Profile Management)** | Informational | Supplier profile changes may affect what staff see on the detail page, but SR8 reads existing data rather than creating new flows |

**Key insight**: SR8 Phase A is the most independent deliverable in the entire Supplier REDONE initiative. It has zero hard dependencies and fixes an active production bug. It can and should ship first.

---

## Go/No-Go Criteria

### Phase A (Critical Fixes -- recommended to start immediately)

- [ ] **Impersonation bug is confirmed reproducible** -- verify the 404 error occurs when impersonating a supplier whose owner has been deactivated (already confirmed in Mar 4 meeting)
- [ ] **Active administrator selection logic is agreed** -- the fallback chain (Supplier Administrator with active OrganisationWorker > active owner > warning) is validated with Stephen Bogue
- [ ] **Organisation model and suppliers() relationship exist** -- confirmed: they already do

### Phase B (Enhancements -- defer decision)

- [ ] **Phase A is deployed and stable** -- no point building enhancements if the foundation has issues
- [ ] **Staff workload justifies the investment** -- if staff are managing fine with separate views, Phase B can wait
- [ ] **SR0 two-tier role model is live** -- Phase B features (org-aware search, stage context) are more valuable once the full hierarchy is active

---

## Recommendation

**Ship Phase A immediately.** It is 3-5 days of work, fixes an active production bug, and has zero dependencies. Evaluate Phase B after Phase A is live and SR0 has shipped. Defer US5 until PLA-1312 lands.

---

## Links

- [Spec](/initiatives/Supplier-REDONE/SR8-Staff-Admin-Portal/spec)
- [Idea Brief](/initiatives/Supplier-REDONE/SR8-Staff-Admin-Portal/idea-brief)
- [SR0 - API Foundation](/initiatives/Supplier-REDONE/SR0-API-Foundation/spec)
- Parent: [Supplier REDONE](/initiatives/Supplier-REDONE)
