---
title: "Business Alignment: API Foundation & Two-Tier Auth"
---

# Business Alignment: API Foundation & Two-Tier Auth

**Epic**: SR0
**Date**: 2026-03-19
**Owner**: Will Whitelaw (Head of Digital)

---

## 1. Business Objectives

SR0 exists for one reason: **unblock the entire Supplier REDONE initiative**. Every downstream epic (SR1 through SR9) depends on the API layer and authentication model that SR0 delivers.

Specific business outcomes:

- **Mobile access for suppliers** — remove the session/cookie dependency so suppliers can manage their profile, check compliance, and review bills from any device. Today this is impossible.
- **Multi-supplier organisation support** — introduce the Organisation Administrator role so businesses operating multiple trading names under one ABN can manage all entities from a single login, eliminating duplicate accounts and manual reconciliation by TC staff.
- **Self-service team management** — allow Organisation and Supplier Administrators to invite, assign, and remove team members without contacting Trilogy Care support.
- **Third-party integration readiness** — a versioned, documented API enables future integrations (Zoho, mobile app, billing partners) without bespoke session handling.

---

## 2. Success Metrics

| KPI | Target | Measurement Method | Baseline |
|-----|--------|--------------------|----------|
| API endpoint consistency | 100% of v2 endpoints follow standard JSON envelope | Automated contract tests | 0% (no v2 exists) |
| Supplier context switch speed | < 1 second from action to page update | Frontend performance monitoring | N/A (not possible today) |
| Concurrent authenticated users | 500+ without degradation | Load testing (k6 or similar) | Unknown (session-based) |
| Token refresh transparency | Zero forced re-logins during active sessions | Auth error rate monitoring | Frequent session timeouts reported |
| Cross-supplier data leakage | Zero incidents | Automated security tests on every endpoint | Untested today |
| Downstream epic unblock | SR1-SR9 can begin development | Epic dependency tracking in Linear | All blocked |

---

## 3. ROI Analysis

### Costs

| Item | Estimate |
|------|----------|
| Development (XL epic — 3 phases) | ~$120K-$160K (8-12 weeks, 2 developers + tech lead) |
| QA and security testing | ~$15K-$20K |
| Migration support (parallel auth) | ~$10K |
| **Total estimated cost** | **$145K-$190K** |

### Benefits

| Benefit | Annual Value | Rationale |
|---------|-------------|-----------|
| Eliminate duplicate profile management | ~$50K-$80K/year | ~4,000 partial/duplicate records across 13,000 profiles require manual reconciliation by Supplier Ops. Multi-supplier orgs currently maintain separate logins and profiles. |
| Reduce "add team member" support tickets | ~$20K-$30K/year | Self-service invites and role management eliminate a category of support requests entirely. |
| Unblock SR1-SR9 delivery | Priceless (gating) | Without SR0, the entire Supplier REDONE initiative stalls. The combined value of SR1-SR9 (registration, profiles, pricing, billing, compliance, assessments, admin, integrations) cannot be realised. |
| Mobile access enablement | Revenue protection | Suppliers increasingly expect mobile access. Inability to operate on mobile is a competitive disadvantage for supplier retention. |

### Payback Period

SR0 pays for itself within **12-18 months** through operational savings alone. The real value is strategic: it is the prerequisite for approximately $500K-$800K of downstream initiative value across SR1-SR9.

---

## 4. Stakeholder Impact

| Stakeholder | Impact | Change Required |
|-------------|--------|-----------------|
| **Existing suppliers (~13,000)** | Must authenticate through new token-based system using existing credentials. No password reset required. During migration, both old and new auth coexist. | Minimal — transparent to most users. |
| **Multi-supplier organisations** | Gain Organisation Administrator role with cross-supplier visibility and context switching. Major workflow improvement. | Learn new dashboard and context switcher. Training materials needed. |
| **Supplier Operations (Cassandra's team)** | Reduced manual work: fewer duplicate profiles to reconcile, fewer "add user" tickets, fewer "can't switch supplier" escalations. | Updated internal processes. Advance notice of new access model. |
| **Compliance (Sophie Pickett)** | Role hierarchy affects who can view/manage compliance documents. Organisation Administrators gain broader visibility. | Review role hierarchy for compliance implications. |
| **Engineering team** | Every subsequent SR epic consumes this API. Clean boundary enables standalone frontend and parallel development. | Adopt v2 API conventions. No more session-dependent supplier features. |
| **Future mobile app consumers** | SR0 establishes the auth contract they build against. | None yet — but contract must be right from day one. |

---

## 5. Risk to Business

### If we don't do this

- **SR1 through SR9 cannot ship.** The entire Supplier REDONE initiative remains blocked. Every investment in supplier portal improvement is stalled.
- Multi-supplier organisations continue maintaining duplicate accounts and split data, costing TC staff hours weekly in manual reconciliation.
- Mobile access remains impossible, putting Trilogy Care at a competitive disadvantage as suppliers expect modern portal experiences.
- No path to third-party integrations or a standalone frontend.

### If we do this badly

- **Data leakage between supplier entities** — if the context-scoping middleware has bugs, Supplier A could see Supplier B's bank details, documents, or billing data. This is a compliance and trust catastrophe. Mitigation: zero-tolerance policy, automated security tests on every endpoint.
- **Auth disruption during migration** — if the session-to-token transition breaks existing supplier access, 13,000 suppliers lose portal access. Mitigation: parallel auth mechanisms, feature flag for gradual rollout.
- **Unstable API contract** — if the v2 API structure changes frequently under pressure from SR1-SR9 teams, integration chaos follows. Mitigation: strict API versioning, change management, OpenAPI spec as source of truth.

---

## 6. Dependencies on Other Epics

| Direction | Epic | Dependency |
|-----------|------|------------|
| **SR0 depends on** | Nothing | SR0 is the foundation layer. It leverages existing Organisation/Business/Supplier data models and the ABR API integration already in the codebase. |
| **Depends on SR0** | SR1 (Registration & Onboarding) | Token-based auth, organisation/supplier entity model, role-based access |
| **Depends on SR0** | SR2 (Profile & Org Management) | API v2 endpoints, context switching, account switcher, role hierarchy |
| **Depends on SR0** | SR3-SR9 (Pricing, Billing, Compliance, Assessments, Admin, Integrations) | All consume the v2 API and rely on two-tier auth |

SR0 is the single point of dependency for the entire initiative. **Any delay to SR0 delays everything.**

---

## 7. Go/No-Go Criteria

Before starting SR0 development, the following must be true:

- [ ] **Data model validated** — confirm the existing Organisation > Business > Supplier hierarchy is structurally sound and does not require schema migration. Only auth, roles, and API infrastructure need to change.
- [ ] **Sanctum token spike complete** — verify that Sanctum token abilities support the two-tier role model without a custom auth provider. This is the highest technical uncertainty.
- [ ] **WorkOS SSO compatibility assessed** — spike confirms whether WorkOS can issue tokens instead of sessions without breaking existing SSO contracts. (WorkOS SSO is out of scope for SR0, but the approach must not preclude it.)
- [ ] **Stakeholder alignment** — Supplier Operations (Cassandra) and Compliance (Sophie) have reviewed the role hierarchy and confirmed it meets operational needs.
- [ ] **Migration strategy agreed** — parallel auth approach (both Inertia sessions and API tokens valid simultaneously) is approved as the transition path. No big-bang cutover.
- [ ] **Linear project created** — epic tracked under Supplier REDONE initiative with clear milestones for each phase (token auth, context switching, invitations/docs).
- [ ] **Dev capacity confirmed** — 2 developers + tech lead available for 8-12 weeks without competing priorities pulling them off.
