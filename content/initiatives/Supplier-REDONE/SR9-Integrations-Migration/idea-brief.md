---
title: "Idea Brief: Integrations & Migration"
---

# Idea Brief: Integrations & Migration

**Epic Code**: SR9
**Created**: 2026-03-19
**Author**: Will Whitelaw
**Status**: Draft

---

## The Problem

The supplier portal rebuild (SR0-SR8) creates a new API-driven frontend, but ~13,000 existing supplier profiles, active external integrations, and the legacy Inertia portal must all continue working during and after the transition:

- **Zoho CRM two-way sync must not break** — suppliers flow between the portal and Zoho via webhooks and SyncSupplierToZohoJob. Any disruption means sales pipeline data goes stale and follow-ups are missed
- **MYOB vendor ID mapping is critical for accounting** — bank details and supplier identity flow to MYOB for payment runs. Breaking this mapping stops supplier payments
- **EFTSure bank verification must continue** — the green/yellow/red verification status protects against payment fraud. New bank detail flows (SR2) must integrate with the existing EFTSure checks
- **AHPRA and banning order register checks are not yet automated** — staff manually check AHPRA suspension/banning orders, NDIS banning register, aged care banning register, and AFRA (Feb 25 meeting). This is a compliance gap
- **~13,000 profiles need role assignment, not schema migration** — the data model already supports the two-tier structure, but existing organisation owners need Organisation Administrator roles assigned, and multi-supplier organisations need hierarchy reconciliation
- **No safe migration path exists** — there is no feature flag system to gradually route suppliers from the legacy portal to the new one, no kill switch to fall back, and no parallel-running strategy

---

## The Solution

Build the integration and migration infrastructure that runs throughout the entire Supplier REDONE initiative:

1. **Integration continuity** — ensure Zoho CRM sync, MYOB vendor mapping, EFTSure verification, and Laravel Scout search all work through the new API layer without disruption
2. **Automated compliance checks** — integrate with AHPRA register, NDIS banning register, aged care banning register, and AFRA for automated suspension and banning order detection
3. **Data migration tooling** — scripts to assign Organisation Administrator roles to existing owners, reconcile multi-supplier organisations into proper hierarchies, and provision API tokens for existing users
4. **Parallel frontend strategy** — reverse proxy configuration to run both the legacy Inertia portal and the new standalone frontend simultaneously, with feature flags routing suppliers to the appropriate portal
5. **Gradual rollout with kill switch** — new registrations go to the new portal first, then migrate existing suppliers in waves. A kill switch can fall back to the Inertia portal at any point
6. **API token provisioning** — existing users receive API tokens on their next login (transparent to the user), enabling the new frontend without forcing a manual migration step

---

## Why Now

- **This epic runs throughout the initiative** — it is not a single deliverable but a continuous workstream that supports every other epic (SR0-SR8)
- **Zoho and MYOB integrations are active today** — any disruption has immediate business impact on sales pipeline and supplier payments
- **AHPRA/banning order checks are a compliance gap** — automating these reduces risk exposure now, regardless of the portal rebuild timeline
- **Migration strategy must be designed before SR0 ships** — without a plan for parallel running and gradual rollout, the first supplier-facing epic creates a hard cutover with no fallback

---

## RACI

| Role | Person | Responsibility |
|------|--------|----------------|
| Accountable | Will Whitelaw | Epic owner, migration strategy approval |
| Responsible | Dev team | Implementation |
| Consulted | Khoa Duong | Existing integrations (Zoho, MYOB, EFTSure), data model |
| Consulted | Lachlan Dennis | Infrastructure, reverse proxy, deployment strategy |
| Consulted | Stephen Bogue | Architecture, search infrastructure |
| Informed | Sophie Pickett | AHPRA/compliance register requirements |
| Informed | Finance team | MYOB integration continuity |

---

## Success

- Zero disruption to Zoho CRM sync, MYOB vendor mapping, and EFTSure verification during and after migration
- AHPRA and banning order register checks are automated with alerts for staff
- All ~13,000 supplier profiles are migrated to the two-tier role model with correct Organisation Administrator assignments
- Both portals run in parallel with feature-flag-controlled routing
- Kill switch can revert any supplier to the legacy portal within 30 seconds
- Existing users receive API tokens transparently on next login — no manual migration step

---

## Estimated Effort

| Metric | Value |
|--------|-------|
| **Size** | L (Large) |
| **Days** | 30-45 (spread across the initiative timeline) |
| **Confidence** | Medium |

**Key Drivers**: This is a long-running workstream, not a single sprint. Integration continuity testing, data migration scripting, parallel frontend infrastructure, and compliance register integrations each require dedicated effort. The spread nature means work happens in parallel with other epics.

**Assumptions**: Existing Zoho webhook integration (SyncSupplierToZohoJob) is well-documented and testable. MYOB and EFTSure integrations have stable APIs. AHPRA and banning order registers have publicly accessible lookup endpoints. The reverse proxy approach for parallel frontends is technically feasible with the current infrastructure.

---

## Proceed to PRD?

**YES** — Integration continuity is non-negotiable for a production migration of ~13,000 suppliers. The compliance register automation addresses an existing gap. The parallel frontend strategy de-risks the entire initiative by ensuring a safe fallback path. Work should begin in parallel with SR0.

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
2. [ ] Review and finalise the [spec](/initiatives/Supplier-REDONE/SR9-Integrations-Migration/spec)
3. [ ] Audit existing Zoho/MYOB/EFTSure integration code to document current behaviour
4. [ ] Research AHPRA and banning order register APIs for automated checks
5. [ ] Spike reverse proxy configuration for parallel frontend running
6. [ ] Run `/speckit-plan` — Technical plan (migration scripts, integration adapters, feature flag strategy)

---

## Links

- [Spec](/initiatives/Supplier-REDONE/SR9-Integrations-Migration/spec)
- [SR0 - API Foundation](/initiatives/Supplier-REDONE/SR0-API-Foundation/spec)
- Parent: [Supplier REDONE](/initiatives/Supplier-REDONE)
