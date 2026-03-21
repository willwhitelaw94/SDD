---
title: "Business Alignment: Profile & Organisation Management"
---

# Business Alignment: Profile & Organisation Management

**Epic**: SR2
**Date**: 2026-03-19
**Owner**: Will Whitelaw (Head of Digital)

---

## 1. Business Objectives

SR2 builds the day-to-day management layer that suppliers use after onboarding. Today, there is no organisation-level dashboard, no way to switch between supplier entities, and the admin role model causes 404 errors when roles change. This epic gives Organisation Administrators a single pane of glass across all their supplier entities.

Specific business outcomes:

- **Organisation dashboard** — Org Admins see all supplier entities under their ABN with compliance status, worker counts, and pending actions in one view. Eliminates the need to navigate into each entity individually.
- **Account switcher** — users with multiple supplier entities switch context instantly from any page, scoped to their active entity for all data (locations, workers, documents, bank details, bills).
- **Self-service profile management** — suppliers edit business details, manage locations, invite team members, upload documents, and update bank details without contacting TC staff.
- **Self-service supplier entity creation** — Org Admins add new supplier entities from the dashboard without manual profile creation by TC operations.
- **Fix admin role bugs** — resolve the owner vs administrator confusion that causes 404 errors and hardcoded impersonation targeting.

---

## 2. Success Metrics

| KPI | Target | Baseline | Measurement Method |
|-----|--------|----------|--------------------|
| Organisation dashboard load time | < 3 seconds | N/A (doesn't exist) | Frontend performance monitoring |
| Context switch speed | < 1 second | N/A (not possible) | User action to page update timing |
| Self-service entity creation | Org Admins complete in < 2 minutes, no staff needed | Manual process via support ticket | Task completion analytics |
| Admin role 404 errors | Zero | Recurring issue (Feb 25, Mar 4 meetings) | Error monitoring (Sentry/Nightwatch) |
| Impersonation targeting | 100% targets active administrator | Hardcoded to owner (breaks on role change) | Impersonation audit logs |
| Cross-supplier data leakage | Zero incidents | Untested today | Automated security tests per endpoint |
| "Add colleague" / "add supplier entity" support tickets | Zero after launch | Current ticket volume (Supplier Ops baseline) | Support ticket categorisation |
| Document expiry surfaced proactively | 100% of documents within 30 days of expiry flagged | Manual checking by Compliance | Automated expiry monitoring |

---

## 3. ROI Analysis

### Costs

| Item | Estimate |
|------|----------|
| Organisation dashboard (net-new UI) | ~$25K-$35K |
| Account switcher (cross-cutting component) | ~$10K-$15K |
| Profile API endpoints (v2 wrapping of existing controllers) | ~$20K-$25K |
| Role cleanup and migration | ~$10K-$15K |
| Self-service entity creation | ~$5K-$10K |
| QA and security testing | ~$10K-$15K |
| **Total estimated cost** | **$75K-$105K** (25-35 days, as estimated in idea brief) |

### Benefits

| Benefit | Annual Value | Rationale |
|---------|-------------|-----------|
| Eliminate "add team member" support tickets | $20K-$30K/year | Self-service worker management via invite/remove flow. Currently requires contacting TC support. |
| Eliminate "add supplier entity" support tickets | $15K-$25K/year | Multi-supplier orgs currently require staff to create additional profiles. With ~13,000 suppliers and growing multi-supplier demand, this is a recurring cost. |
| Reduce compliance monitoring effort | $30K-$50K/year | Automated 30-day document expiry warnings and dashboard compliance rollup replace manual document tracking by Compliance team. |
| Fix admin role errors | $5K-$10K/year | 404 errors from role changes generate support tickets and user frustration. Fix eliminates an entire error category. |
| Reduce profile update support queries | $15K-$25K/year | Suppliers currently contact support for profile changes they cannot make themselves. Self-service business details, locations, and bank details editing removes this. |

### Payback Period

**8-12 months.** SR2 delivers $85K-$140K annually in operational savings against a $75K-$105K investment. This is the most cost-efficient epic in the initiative — it wraps existing controller logic with v2 API endpoints and adds the organisation-level UI layer.

---

## 4. Stakeholder Impact

| Stakeholder | Impact | Change Required |
|-------------|--------|-----------------|
| **Organisation Administrators** | Major upgrade. Gain a dashboard with cross-supplier visibility, account switcher, self-service entity creation, and team management. | Learn new dashboard and organisation-level features. |
| **Supplier Administrators** | Gain self-service profile editing (business details, locations, documents, bank details, team members) without contacting support. | Use the new profile management interface instead of calling support. |
| **Team Members (workers)** | Can be invited by Supplier Admins, see their assigned locations and services. | Accept invitation, learn portal navigation. |
| **Supplier Operations (Cassandra's team)** | Significant workload reduction. "Add colleague," "add supplier entity," and profile update requests drop to near-zero. | Shift focus from manual profile management to verification and compliance support. |
| **Compliance team (Sophie)** | Automated document expiry warnings and compliance status on dashboard. Credentialing requirements enforced consistently by supplier type. | Define credentialing matrix rules. Trust the automated system. |
| **Jay (Coordinators)** | Coordinator linkage to supplier profiles improves with cleaner data and proper role model. | No immediate change, but foundation enables future coordinator-supplier workflows. |
| **TC Staff (impersonation users)** | Impersonation correctly targets active administrator instead of hardcoded owner. Fewer broken impersonation sessions. | None — transparent improvement. |

---

## 5. Risk to Business

### If we don't do this

- Organisation Administrators continue managing supplier entities one at a time with no cross-supplier dashboard, no context switcher, and no aggregate compliance view. This is the status quo and it is painful for every multi-supplier organisation.
- Profile changes continue to require support tickets for common actions (add team member, update bank details, add supplier entity), driving ongoing operational cost.
- The admin role confusion (owner vs administrator 404 errors) persists, causing access failures and support escalations flagged in the Feb 25 and Mar 4 meetings.
- Document expiry monitoring remains manual, increasing the risk that expired documents go unnoticed and suppliers operate out of compliance.

### If we do this badly

- **Cross-supplier data leakage** — if the context-scoping is buggy, users could see bank details, documents, or worker information from other supplier entities. This is a privacy and compliance breach. Mitigation: automated security tests on every endpoint, zero-tolerance policy.
- **Bank detail changes without safeguards** — if confirmation dialogs are skipped or buggy, suppliers could accidentally redirect payments to wrong accounts. Mitigation: explicit confirmation on BSB/account number changes, EFTSure re-verification triggered automatically, payments continue to old details until new ones verified.
- **Concurrent editing conflicts** — if two Org Admins edit the same profile simultaneously, data could be lost. Mitigation: optimistic concurrency control (conflict error on second save, user refreshes and re-applies).
- **Audit trail gaps** — if profile change logging is incomplete, there is no accountability for who changed what. Mitigation: event sourcing pattern already established in the codebase, apply to all profile operations.

---

## 6. Dependencies on Other Epics

| Direction | Epic | Dependency |
|-----------|------|------------|
| **SR2 depends on** | SR0 (API Foundation) | Two-tier auth, role hierarchy, v2 API structure, context switching infrastructure, account switcher backend |
| **SR2 depends on** | SR1 (Registration & Onboarding) — soft | "Add Supplier Entity" redirects to SR1's onboarding wizard. SR2 can start development in parallel with SR1, but the full add-entity flow is not testable until SR1's onboarding steps exist. |
| **Depends on SR2** | SR5 (Agreements & Compliance) | Compliance features depend on clean profile data, document management, and the compliance status rollup built in SR2. |
| **Depends on SR2** | SR3 (Pricing) | Pricing management builds on the location management and profile patterns established in SR2. |
| **Depends on SR2** | SR4 (Billing) | Billing requires bank details and verified supplier profiles managed through SR2. |

SR2 can run **in parallel with SR1** once SR0 is complete. SR2 does not depend on registration flows — only on the core API and data model from SR0. This parallelism is a scheduling advantage.

---

## 7. Go/No-Go Criteria

Before starting SR2 development, the following must be true:

- [ ] **SR0 API Foundation delivered** — two-tier auth, role hierarchy, context switching, and v2 API structure deployed. SR2 is the first management-layer consumer of SR0.
- [ ] **Existing controller logic reviewed** — confirm that `SupplierCompanyDetailsController`, `SupplierLocationsController`, `SupplierWorkersController`, and `SupplierDocumentController` contain reusable business logic that can be wrapped with v2 API endpoints. This determines build effort.
- [ ] **Admin role bug root-caused** — the owner vs administrator confusion (Feb 25, Mar 4 Fireflies) is root-caused and the fix approach is agreed. This affects impersonation, role changes, and access control across the entire epic.
- [ ] **Credentialing matrix defined** — Sophie Pickett has provided document requirements by supplier type so that the compliance status calculation (Compliant / Expiring / Non-compliant) is based on real business rules, not placeholder logic.
- [ ] **Org-level vs supplier-level document split agreed** — stakeholders have confirmed which documents are organisation-level (shared, editable by Org Admins only) vs supplier-level (scoped per entity, editable by Supplier Admins).
- [ ] **Bank detail change workflow agreed** — confirmation dialog, EFTSure re-verification trigger, and "payments continue to old details" behaviour approved by operations.
- [ ] **Audit trail approach confirmed** — event sourcing pattern validated as the right approach for profile change logging, and the scope of what gets logged is agreed.
