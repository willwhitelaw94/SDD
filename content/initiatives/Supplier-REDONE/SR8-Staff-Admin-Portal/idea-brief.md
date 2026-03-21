---
title: "Idea Brief: Staff Admin Portal"
---

# Idea Brief: Staff Admin Portal

**Epic Code**: SR8
**Created**: 2026-03-19
**Author**: Will Whitelaw
**Status**: Draft

---

## The Problem

TC staff manage suppliers through a set of Inertia-based pages inside the TC Portal monolith. While functional, these pages have accumulated pain points that reduce operational efficiency and create support overhead:

- **Impersonation targets the hardcoded owner** — when a supplier's owner changes roles or is deactivated, staff who impersonate get 404 errors because the system doesn't pick the active administrator (Mar 4 meeting)
- **Owner vs Administrator distinction is unclear** — staff cannot easily determine who holds which role within a supplier organisation, leading to confusion when processing stage changes, approvals, or escalations (Feb 25 meeting)
- **No cross-supplier organisation view for staff** — the two-tier model (SR0) introduces Organisation Administrators managing multiple suppliers, but staff tooling has no way to see the organisation-level picture — staff must click into each supplier individually
- **Approval workflows are disconnected** — pending document approvals, stage updates, and credentialing checks live in separate views with no unified queue or priority system
- **Coordinator-supplier linkage is incomplete** — Jay's Loom demo (PLA-1312) shows the in-progress work, but the staff-facing UI does not yet surface which coordinators are linked to which suppliers

The existing staff supplier management (StaffSupplierController, StaffSupplierPendingController, StaffSupplierApprovalDocumentController) provides a solid foundation. The problem is not building from scratch — it is adapting these views to work correctly with the two-tier model and fixing long-standing UX issues.

---

## The Solution

Enhance the staff admin portal to support the two-tier organisation model and resolve operational pain points:

1. **Smart impersonation** — when impersonating a supplier, pick the active Organisation Administrator or Supplier Administrator rather than the hardcoded owner. If no active admin exists, show a clear warning instead of a 404
2. **Organisation-aware supplier views** — staff can see the organisation hierarchy (which suppliers belong to which ABN), view aggregate compliance status, and navigate between related suppliers in one click
3. **Role visibility** — clearly display owner vs Organisation Administrator vs Supplier Administrator roles on the supplier detail page, with the ability to reassign roles when needed
4. **Unified approval queue** — combine pending documents, stage updates, and credentialing checks into a single prioritised view that staff can filter and action
5. **Coordinator linkage UI** — surface the coordinator-supplier relationship in the staff supplier detail view, building on PLA-1312

---

## Why Now

- **SR0 (API Foundation) introduces the two-tier model** — staff tooling must understand organisations and multiple supplier entities; without this, staff will be unable to manage suppliers correctly after migration
- **Can be deferred if needed** — if staff continue using the existing Inertia portal without the two-tier model, this epic can wait. But once SR0 ships and suppliers start using the new structure, staff tooling must follow
- **Impersonation bugs are causing support tickets today** — the 404 errors from role changes are an active pain point that predates the rebuild
- **Coordinator linkage (PLA-1312) is in progress** — aligning the staff portal update with this work avoids duplicate effort

---

## RACI

| Role | Person | Responsibility |
|------|--------|----------------|
| Accountable | Will Whitelaw | Epic owner, spec approval |
| Responsible | Dev team | Implementation |
| Consulted | Khoa Duong | Existing staff controller architecture, data model |
| Consulted | Stephen Bogue | Architecture alignment, impersonation system |
| Consulted | Jay | Coordinator-supplier linkage (PLA-1312) |
| Informed | Sophie Pickett | Supplier operations impact |

---

## Success

- Staff can impersonate any supplier without encountering 404 errors from role changes
- Staff can see the full organisation hierarchy for any supplier in under 2 clicks
- Owner, Organisation Administrator, and Supplier Administrator roles are clearly visible and distinguishable on the staff detail page
- Pending approvals from all workflows (documents, stage updates, credentialing) are visible in a single queue
- Coordinator-supplier linkage is surfaced in the staff supplier detail view

---

## Estimated Effort

| Metric | Value |
|--------|-------|
| **Size** | S (Small) |
| **Days** | 10-15 |
| **Confidence** | High |

**Key Drivers**: Most infrastructure already exists in StaffSupplierController and related controllers. Primary work is adapting views for two-tier model, fixing impersonation logic, and adding organisation-level navigation. No new data models required.

**Assumptions**: SR0 two-tier auth model is in place. Existing staff supplier controllers (StaffSupplierController, StaffSupplierPendingController, StaffSupplierApprovalDocumentController) remain the foundation. PLA-1312 coordinator linkage work provides the relationship data.

---

## Proceed to PRD?

**YES** — This epic adapts existing, working staff tooling to support the two-tier model. The scope is well-defined, the existing controllers provide a clear starting point, and the impersonation fix alone justifies the work. Can be deferred if staff continue with the current portal, but should ship before or alongside the supplier-facing SR0 migration.

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
2. [ ] Review and finalise the [spec](/initiatives/Supplier-REDONE/SR8-Staff-Admin-Portal/spec)
3. [ ] Coordinate with Jay on PLA-1312 coordinator linkage timeline
4. [ ] Run `/speckit-plan` — Technical plan (impersonation fix, organisation-aware views, approval queue)

---

## Links

- [Spec](/initiatives/Supplier-REDONE/SR8-Staff-Admin-Portal/spec)
- [SR0 - API Foundation](/initiatives/Supplier-REDONE/SR0-API-Foundation/spec)
- Parent: [Supplier REDONE](/initiatives/Supplier-REDONE)
