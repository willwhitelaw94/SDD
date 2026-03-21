---
title: "Idea Brief: Profile & Organisation Management"
---

# Idea Brief: Profile & Organisation Management

**Epic Code**: SR2
**Created**: 2026-03-19
**Status**: Draft
**Owner**: Will Whitelaw

---

## The Problem

Supplier profile management today is fragmented and flat. Business details, locations, team members, documents, and bank details all live at the Supplier level -- but there is no organisation-level dashboard that gives Org Admins cross-supplier visibility. An Organisation Administrator who manages three supplier entities under one ABN has no single place to see aggregate status, switch between entities, or perform bulk actions.

Specific pain points:

- **No organisation dashboard** -- Org Admins must navigate into each supplier entity individually to review profiles, workers, or compliance status
- **Multiple businesses under one ABN require manual profile creation** -- there is no self-service way to add a second supplier entity (Jan 21 Fireflies)
- **Credentialing matrix inconsistencies** -- document requirements vary by supplier type but are not enforced consistently (Feb 25, Mar 4 meetings)
- **Admin role confusion** -- owner vs administrator semantics cause 404 errors when role changes happen, and impersonation is hardcoded to the owner rather than picking an active admin (Feb 25, Mar 4)
- **No account switcher** -- users with access to multiple supplier entities have no in-context way to switch between them

---

## The Solution

Build the organisation-level management layer on top of the existing supplier profile infrastructure:

1. **Organisation Dashboard** -- a cross-supplier overview showing all supplier entities under the ABN, with aggregate stats (compliance status, worker counts, pending documents) and quick actions (TMC-138)
2. **Account Switcher** -- an always-visible component that lets users switch between supplier entities without navigating away (TMC-136)
3. **Profile Management API** -- expose business details, locations, team/workers, documents, and bank details through the v2 API, scoped to the active supplier context
4. **Role clarity** -- clean up the owner vs administrator distinction so role changes don't break access, and impersonation targets the active admin
5. **Self-service supplier entity creation** -- Org Admins can add a new supplier entity under their ABN from the dashboard

---

## Why Now

- **SR0 (API Foundation) is landing** -- the two-tier auth and organisation model are being built, and profile management is the first consumer of that foundation
- **SR1 (Registration) can run in parallel** -- SR2 doesn't depend on registration flows, only on the core API and data model from SR0
- **Supplier portal usage is growing** -- more suppliers are actively using the portal after Supplier Bill Submission shipped, making the missing organisation layer increasingly painful
- **Credentialing and compliance features (SR5) depend on clean profile data** -- getting profiles right now prevents rework later

---

## RACI

| Role | Person | Responsibility |
|------|--------|----------------|
| Accountable | Will Whitelaw | Epic owner, spec approval |
| Responsible | Dev team | Implementation |
| Consulted | Khoa Duong | Data model, existing supplier infrastructure |
| Consulted | Sophie Pickett | Supplier operations, credentialing requirements |
| Consulted | Jay | Coordinator linkage to supplier profiles |
| Informed | Stephen Bogue | Architecture alignment with broader initiative |

---

## Success

- Org Admins can see all supplier entities and their compliance status from a single dashboard
- Switching between supplier entities takes less than 1 second
- Org Admins can add a new supplier entity under their ABN without contacting TC staff
- Zero 404 errors caused by admin role changes
- Impersonation correctly targets the active administrator, not a hardcoded owner

---

## Estimated Effort

| Metric | Value |
|--------|-------|
| **Size** | M (Medium) |
| **Days** | 25-35 |
| **Cost Range** | ~$75k-$105k |
| **Confidence** | Medium |

**Key Drivers**: Organisation dashboard is net-new UI, account switcher is a cross-cutting component, profile API endpoints build on existing controllers but need v2 wrapping, role cleanup requires careful migration of existing data

**Assumptions**: SR0 API foundation and two-tier auth are in place, existing `SupplierCompanyDetailsController`, `SupplierLocationsController`, `SupplierWorkersController`, `SupplierDocumentController` provide working logic to wrap, `OrganisationWorker` and `OrganisationLocation` models exist

---

## Links

- [Spec](/initiatives/Supplier-REDONE/SR2-Profile-Org-Management/spec)
- [SR0 - API Foundation](/initiatives/Supplier-REDONE/SR0-API-Foundation/spec)
- Related: [Supplier Org Identity](/initiatives/Supplier-Management/Supplier-Org-Identity/spec)
- Parent: [Supplier REDONE](/initiatives/Supplier-REDONE)
