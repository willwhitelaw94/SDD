---
title: "Business Specification: Calls Uplift"
description: Business objectives, success metrics, ROI, and stakeholder alignment
---

# Business Specification: Calls Uplift

**Epic Code**: CALLS-UPLIFT
**Created**: 2026-02-25
**Status**: Draft
**Input**: spec.md (clarified 2026-02-25)

---

## Business Objectives

### Primary Objective

Increase call attribution from 34% to 95%+ within 3 months of launch, reducing revenue loss from unattributed care management time.

### Secondary Objectives

- Reduce coordinator context-switching between Aircall and Portal
- Improve oversight of provider organisation communication
- Create platform stickiness for external coordinators via Aircall integration
- Enable team leaders to manage call review workload across their teams

---

## Success Metrics

### Attribution & Revenue

| Metric | Current | Target | Timeframe | Measurement |
|--------|---------|--------|-----------|-------------|
| **Total call attribution** (linked to any entity) | 34% | 95%+ | 3 months post-launch | Calls linked to package, coordinator, or provider / total calls |
| **Package-specific attribution** | 34% | TBD | 3 months post-launch | Sub-metric: calls linked specifically to packages / total calls |
| **Revenue from attributed calls** | Baseline TBD | Proportional increase | 6 months post-launch | Care management revenue from phone call activities |

### Operational Efficiency

| Metric | Current | Target | Timeframe | Measurement |
|--------|---------|--------|-----------|-------------|
| Context display latency | N/A | <3 seconds | Launch | Time from call connect to context panel display |
| Package/entity link time | Manual TC# entry | <10 seconds | Launch | Time from search to link confirmation |
| Context-switching reduction | Baseline TBD | 80% reduction | 3 months | Coordinator self-reported or observed |
| Call review completion rate | N/A | >90% | 3 months | Reviews completed / calls received |

### Data Quality

| Metric | Current | Target | Timeframe | Measurement |
|--------|---------|--------|-----------|-------------|
| Call notes saved successfully | N/A | 99.9% | Launch | Notes saved / notes attempted |
| Duplicate activity prevention | N/A | 0 duplicates | Launch | Duplicate activity count per call |

---

## Clarifications

### Session 2026-02-25

- Q: Should the 95% attribution target measure package-linked calls or all-entity-linked calls? -> A: **Any entity attribution** - 95% target measures calls linked to ANY entity (package, coordinator, or provider). This measures overall operational visibility. A separate sub-metric tracks package-specific attribution for revenue purposes.
- Q: Is the 15-min wrap-up time an accepted billing practice? -> A: **Already accepted** - Wrap-up time is standard practice in aged care management billing. Coordinators already log it manually. Calls Uplift automates what they should already be doing. No finance/compliance approval needed.
- Q: Should Phase 1 stay tight or include expanded scope? -> A: **All of it in Phase 1** - All clarified features ship together: Calls Inbox, Call Review, multi-modal linking (packages/coordinators/providers), escalations, team leader oversight, unified search, batch review, flash alerts. No phased rollout of features — ship the complete experience. The original 4-phase plan needs re-planning via `/speckit-plan`.
- Q: What's the rollout and change management strategy? -> A: **Mandatory training** - All coordinators must attend a training session before getting access. Feature flag stays off until training is complete for each user/team. Slower rollout but ensures consistent understanding of the new workflow. Training materials needed as a deliverable alongside the feature.
- Q: Can we quantify the revenue impact? -> A: **Confidential** - Revenue figures not shareable. Keep metric qualitative: 'proportional increase with improved attribution rate'. Finance models the dollar impact using data we provide (call counts, attribution rates, durations).
- Q: Do external coordinators/providers already have Aircall accounts? -> A: **Not yet** - External coordinators/providers don't have Aircall accounts currently. These accounts need to be created/provisioned as part of the rollout. This is a **dependency**: Aircall account provisioning for external users. The "friendly error state prompting to link account" in the spec applies here — it's not just linking an existing account, it may involve provisioning a new one.
- Q: What's the MVP definition of done for beta launch? -> A: **Core review loop** - Minimum for beta: calls appear in inbox, coordinator can review + link to package + complete review (activity logged). Everything else (escalation, TL view, multi-modal linking, batch review, unified search) follows as fast-follows. All features ship together for full launch, but beta can start with the core loop.
- Q: Should team leaders have specific KPIs or reporting? -> A: **No TL-specific KPIs** - Team leaders use the same inbox with broader access. No separate reporting or dashboard for this initiative. Call metrics dashboards remain out of scope (separate reporting initiative).
- Q: Who owns training materials and delivery? -> A: **Ops/L&D owns training** - Operations/Learning & Development team creates and delivers training. Dev team just builds the feature — no in-app onboarding or guided tour required. Dev deliverable is the feature itself, not training content.
- Q: Should we architect for Suggested Actions extensibility now? -> A: **Lightweight hooks** - Don't build full extensibility infrastructure. But use event-driven architecture so future features can subscribe to 'call reviewed', 'call linked', 'call escalated' events. Polymorphic pivot already provides natural entity extensibility. Minimal cost, maximum future flexibility.
- Q: What happens to existing 50k call records at launch? -> A: **Launch date onwards** - Clean start. Inbox only shows calls after feature launch. Existing calls marked as 'reviewed' or 'archived' in data migration. No inbox backlog on day one. Coordinators start fresh with the new workflow.

---

## Stakeholder Alignment

| Stakeholder | Role | Interest | Key Concern |
|-------------|------|----------|-------------|
| Beth P | Product Owner | Revenue attribution, adoption | Feature completeness vs delivery speed |
| Matt | Tech Lead | Architecture, integration | Graph dependency, performance at scale |
| Graph Team | Consulted | Webhook contract, transcriptions | API stability, payload schema |
| Operations | Consulted | Aircall provisioning, training | External coordinator onboarding |
| Finance | Informed | Revenue modelling | Wrap-up time billing validation |
| Care Coordinators | End Users | Workflow efficiency | Learning curve, mandatory training |
| Team Leaders | End Users | Team oversight, escalations | Workload management |

## Rollout Strategy

| Phase | Audience | Prerequisite | Feature Flag |
|-------|----------|--------------|-------------|
| Beta | 5-10 internal power users | Identified by Beth P | `calls-inbox-v1` per-user |
| Internal rollout | All internal coordinators (pod by pod) | Mandatory training completed | `calls-inbox-v1` per-user |
| External rollout | External coordinators with Aircall | Aircall account provisioned + training | `calls-inbox-v1` per-user |
| Full rollout | All eligible users | All training complete | Flag removed / default on |

### Deliverables Beyond Code

- Training materials (slide deck / video / help centre article)
- Aircall provisioning process for external coordinators
- Team leader escalation guidelines
- PostHog dashboards for attribution tracking

---

## ROI Analysis

Revenue figures confidential. ROI model inputs provided to finance:

| Input | Value | Source |
|-------|-------|--------|
| Daily call volume | ~500 calls/day (~2,000 peak) | Aircall data |
| Current attribution rate | 34% | Aircall tagging data |
| Target attribution rate | 95%+ (any entity) | Business target |
| Default activity duration | Call duration + 15 min wrap-up | Spec clarification |
| Coordinators | 250+ | Operations data |

### Qualitative Benefits

- **Revenue recovery**: 61% more calls attributed → proportional revenue capture
- **Operational visibility**: Multi-modal linking gives complete communication picture
- **Provider stickiness**: External coordinators on Aircall = deeper platform engagement
- **Team leader efficiency**: Oversight + escalation reduces dropped calls
- **Compliance**: 7-year retention + audit trail already in place

---

## Risks & Mitigations

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Coordinator adoption resistance | High | Medium | Mandatory training, champion users, gradual rollout |
| Graph webhook reliability | High | Low | 24h timeout + Aircall API polling fallback |
| External Aircall provisioning delays | Medium | Medium | Decouple from Phase 1 — internal users launch first |
| Unified search performance | Medium | Low | Fall back to package-only search if needed |
| Training logistics for 250+ users | Medium | Medium | Pod-by-pod scheduling, video option |
| Scope creep (all features in Phase 1) | High | Medium | Strict scope lock after spec sign-off |

---

## Related Documents

- [Feature Specification](spec)
- [Idea Brief](IDEA-BRIEF)
- [User Flows](user-flows)
