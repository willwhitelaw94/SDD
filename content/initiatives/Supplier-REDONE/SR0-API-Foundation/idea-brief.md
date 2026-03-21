---
title: "Idea Brief: API Foundation & Two-Tier Auth"
---

# Idea Brief: API Foundation & Two-Tier Auth

**Created**: 2026-03-19
**Author**: Will Whitelaw

---

## Problem Statement (What)

- The supplier portal is **embedded in the TC Portal Laravel monolith** (Vue 3 + Inertia.js v2), which means there is no clean API boundary — every interaction depends on server-side sessions and cookies
- **Session-based auth (Fortify/Sanctum + WorkOS) blocks mobile access** — suppliers cannot use the portal from a phone or tablet in any meaningful way, and third-party integrations have no stable contract to build against
- **Flat registration model** (ABN → 1 Supplier) does not reflect reality — suppliers with multiple trading names, locations, or service lines under one ABN must create separate manual profiles, leading to ~4,000 partial or duplicate records across ~13,000 supplier profiles
- The existing data model **already supports** Organisation → Business → Supplier hierarchy with bank details, locations, and workers scoped at the Supplier level — but the registration flow, role model, and UI do not expose this structure
- Every subsequent epic in the Supplier REDONE initiative (registration, profile management, pricing, billing, compliance, assessments, admin portal, integrations) **depends on this foundation** — without a clean API layer and two-tier auth, nothing else can ship

**Current State**: Suppliers authenticate via Laravel session cookies. There is no API versioning, no token-based auth, and no concept of an Organisation Administrator who can manage multiple supplier entities. Multi-supplier organisations work around the system by maintaining separate logins, separate profiles, and separate compliance documents — all manually reconciled by TC operations staff.

---

## Possible Solution (How)

Build the **API v2 infrastructure** and **two-tier authentication model** that underpins the entire supplier portal rebuild.

- **Token-based authentication**: Replace session/cookie auth with short-lived access tokens and long-lived refresh tokens (Sanctum token abilities). Works identically on web, mobile, and third-party integrations — no cookie dependency
- **Two-tier role hierarchy**: Organisation Administrator (cross-supplier access under one ABN) and Supplier Administrator / Team Member (scoped to a single supplier entity). Leverages the existing Organisation → Business → Supplier data model that is already in the database
- **Supplier context switching**: Users with access to multiple supplier entities can switch their active context without re-authenticating. All data queries (bank details, locations, pricing, documents, bills) scope to the active supplier
- **Tiered invitation system**: Organisation Administrators invite at org level (access to all suppliers) or supplier level (access to one). Supplier Administrators can only invite to their own entity — decoupling invites from the current flat model (TMC-137)
- **Versioned API (`/api/v2/`)**: Consistent JSON response envelope, standardised error format, rate limiting with standard headers, CORS for the standalone frontend, and machine-readable documentation (OpenAPI)
- **WorkOS SSO preservation**: The existing WorkOS integration flows through the new token-based auth — SSO users receive the same token pair as password-authenticated users

```
// Architecture
Organisation (ABN — Tier 1)
├── Organisation Administrator(s)
├── Shared: legal name, ABN, GST, org-level compliance
│
├── Supplier A (Tier 2)
│   ├── Bank Details, Locations, Prices, Documents, Agreements
│   └── Supplier Admin / Workers (scoped)
│
└── Supplier B (Tier 2)
    └── Own bank details, locations, pricing, etc.
```

---

## Benefits (Why)

**For Suppliers**:
- Mobile access — suppliers can check compliance status, review bills, and manage their profile from any device
- Multi-supplier organisations manage all entities from a single login with context switching, eliminating duplicate accounts and split data
- Team management — invite colleagues, assign roles, remove former employees without contacting TC support

**For Trilogy Care Operations**:
- Eliminates the root cause of duplicate supplier records (~4,000 partial/incomplete profiles that require manual reconciliation)
- Decoupled invite system (TMC-137) removes manual profile creation for multi-supplier orgs
- Standardised API enables future integrations (Zoho, mobile app, third-party billing) without bespoke session handling

**For Engineering**:
- Clean API boundary enables the standalone frontend build — every subsequent SR epic (SR1–SR9) consumes this API
- Versioned endpoints allow the legacy Inertia portal and the new frontend to coexist during migration
- Token-based auth simplifies testing, CI/CD, and external developer onboarding

**ROI**: Reduced duplicate resolution effort + self-service team management + mobile enablement — to be quantified during discovery. The primary ROI is **unblocking the entire Supplier REDONE initiative** — without SR0, SR1–SR9 cannot proceed.

---

## Owner (Who)

| Role | Person | Responsibility |
|------|--------|----------------|
| **Accountable** | Will Whitelaw (Head of Digital) | Epic owner, architecture approval |
| **Responsible** | Khoa Duong (Tech Lead), Stephen Bogue (Dev) | Implementation |
| **Consulted** | Sophie Pickett (Compliance) | Role hierarchy compliance implications |
| **Informed** | Cassandra (Supplier Operations) | Changes to supplier access model |

---

## Other Stakeholders

- **Supplier Operations team** — will see changes to how suppliers register and manage team access; need advance notice and training materials
- **Existing suppliers (~13,000)** — must be able to authenticate through the new system with current credentials; no password reset required
- **Future mobile app consumers** — SR0 establishes the auth contract they will build against
- **External integration partners** — versioned API with documentation enables self-service integration

---

## Assumptions & Dependencies, Risks

**Assumptions**:
- The existing Organisation → Business → Supplier data model is structurally sound and does not require schema migration — only the registration flow, role model, and UI need to change
- Sanctum token abilities are sufficient for the two-tier role model without a custom auth provider
- WorkOS SSO can be adapted to issue tokens instead of sessions without breaking existing SSO contracts
- Existing supplier credentials (email/password) will work with the new auth system unchanged

**Dependencies**:
- Existing `Organisation`, `Business`, and `Supplier` Eloquent models and relationships
- WorkOS SSO integration (must be preserved through the transition)
- ABR API integration (already in place for ABN lookup)
- Linear tickets: TMC-136 (account switcher), TMC-137 (decouple invites), TMC-138 (org manager dashboard), TMC-139 (onboarding migration)

**Risks**:
- **Session-to-token migration** (HIGH) — existing active suppliers must not experience auth disruption during the transition. Mitigation: run both auth mechanisms in parallel during migration, with feature flag to gradually shift traffic
- **Role hierarchy complexity** (MEDIUM) — the two-tier model introduces new permission boundaries that could create data access bugs. Mitigation: comprehensive test coverage for context scoping; zero-tolerance policy on cross-supplier data leakage
- **WorkOS SSO compatibility** (MEDIUM) — WorkOS may require configuration changes to work with token-based flow. Mitigation: spike WorkOS token integration early in the epic
- **Scope creep from downstream epics** (LOW) — SR1–SR9 teams may request API changes that destabilise the foundation. Mitigation: strict API versioning and change management from day one

---

## Estimated Effort

| Metric | Value |
|--------|-------|
| **Size** | XL (Extra Large) |
| **Confidence** | Medium |

**Key Drivers**: Token-based auth infrastructure, two-tier role hierarchy, context switching, invitation system refactor, API versioning/documentation, WorkOS SSO preservation, parallel auth during migration

**Phases**:
- **Phase 1**: Token-based auth + two-tier role model (Sanctum tokens, Organisation Administrator / Supplier Administrator roles, login/refresh/revoke endpoints)
- **Phase 2**: Supplier context switching + scoped data queries (account switcher UI, context-aware middleware, data isolation)
- **Phase 3**: Tiered invitations + API documentation (org-level and supplier-level invites, OpenAPI spec, rate limiting, CORS)

---

## Proceed to PRD?

**YES** — This is the foundation epic for the entire Supplier REDONE initiative. The existing data model supports the two-tier structure; the gap is in auth, roles, and API infrastructure. Every other epic (SR1–SR9) is blocked until SR0 ships. A spec has already been drafted with 6 user stories, 17 functional requirements, and 10 success criteria.

---

## Decision

- [ ] **Approved** - Proceed to PRD
- [ ] **Needs More Information** - [What's needed?]
- [ ] **Declined** - [Reason]

**Approval Date**: —

---

## Next Steps

**If Approved**:
1. [ ] Run `/trilogy-idea-handover` — Gate 0 (create epic in Linear under Supplier REDONE initiative)
2. [ ] Review and finalise the existing [spec](/initiatives/Supplier-REDONE/SR0-API-Foundation/spec) — 6 user stories already drafted
3. [ ] Run `/trilogy-clarify business` — Validate success metrics with Supplier Operations
4. [ ] Spike WorkOS SSO → token integration to de-risk the highest uncertainty
5. [ ] Run `/speckit-plan` — Technical architecture plan (Sanctum configuration, middleware design, migration strategy)
