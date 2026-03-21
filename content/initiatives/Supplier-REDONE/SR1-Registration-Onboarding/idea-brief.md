---
title: "Idea Brief: Supplier Registration & Onboarding"
---

# Idea Brief: Supplier Registration & Onboarding

**Created**: 2026-03-19
**Author**: Will Whitelaw

---

## Problem Statement (What)

The current supplier registration and onboarding experience has three structural problems:

1. **Flat registration model** -- ABN lookup creates a single Organisation + Business + Supplier + User in one shot. There is no way to add a second supplier entity under the same ABN without manual intervention by staff. Organisations operating multiple trading names, service lines, or locations must contact Trilogy Care to have additional profiles created.

2. **Incomplete and unreliable onboarding** -- Of ~13,000 supplier profiles, only ~5,000 have completed onboarding. ~4,000 are partially complete and ~4,000 have not started. The current six-step flow (Business Details, Locations, Pricing, Documents, Agreements, Verified) lacks clear progress visibility, has mobile usability issues (business verification fails on iPhone), and does not handle compliance rejection gracefully -- suppliers revert to pending with no clear guidance.

3. **Verification is a black box** -- Bank verification (EFTSure), document verification, and compliance sign-off happen through disconnected manual processes. Suppliers have no visibility into where they stand, what is blocking them, or what action they need to take. The green/yellow/red bank detail indicators designed in January 2026 have not been implemented.

These problems directly impact supplier activation rates and create unnecessary support burden for the Supplier Operations team.

## Possible Solution (How)

Rebuild registration and onboarding as two distinct tiers on top of the SR0 API foundation:

**Tier 1 -- Organisation Registration (ABN)**
- Supplier enters their ABN; system looks up and validates via ABR
- Creates Organisation + first Business + first Supplier entity
- User becomes Organisation Administrator with visibility across all supplier entities under that ABN
- Existing ABN detection: if the ABN already exists, offer to request access from the existing Organisation Administrator rather than creating a duplicate

**Tier 2 -- Add Supplier Entity**
- Organisation Administrator adds additional supplier entities from their organisation dashboard
- Each supplier entity gets its own bank details, locations, pricing, documents, and agreements
- Each supplier entity goes through its own onboarding independently

**Onboarding Redesign**
- Per-supplier onboarding with clear step-by-step progress indicator (the redesign by Vishal, currently in backlog)
- Steps: Business Details, Locations, Pricing, Documents, Agreements (including APA for subcontractor services), Verification
- Lite verification flow for straightforward cases; heavy verification flow with multiple document pathways for complex cases
- EFTSure bank verification with 3-stage progression + refusal stage, surfaced as green/yellow/red indicators
- Compliance rejection sends the supplier back to the relevant step with a clear explanation, not a generic "pending" state
- Mobile-first: all flows must work on iPhone and Android without session dependency (token-based auth from SR0)

## Benefits (Why)

- **Supplier activation**: Clear progress, mobile support, and actionable rejection feedback should move the ~8,000 incomplete/not-started profiles toward completion
- **Multi-supplier organisations**: Self-service Tier 2 registration eliminates manual profile creation by staff, reducing support tickets and turnaround time
- **Compliance visibility**: Green/yellow/red bank verification and document status indicators reduce "where am I?" queries from suppliers and give Compliance a clear pipeline view
- **Subcontractor compliance**: APA signing during onboarding ensures subcontractors are compliant before they start delivering services
- **Operational efficiency**: Supplier Ops team (Cassandra) spends less time on manual onboarding support and duplicate profile management

## Owner (Who)

**Will Whitelaw** -- Product Owner

## Other Stakeholders

| Stakeholder | Role |
|---|---|
| Khoa Duong | Engineering Lead |
| Sophie Pickett | Compliance -- verification rules, document requirements, EFTSure integration |
| Rudy Chartier | Technical architecture, API design |
| Cassandra | Supplier Operations -- day-to-day onboarding support, escalations |
| Vishal | UX -- onboarding progress indicator redesign (existing backlog item) |

## Assumptions & Dependencies, Risks

### Assumptions

- SR0 (API Foundation & Two-Tier Auth) is complete: token-based auth, Organisation/Supplier entity model, and API v2 endpoints are available
- ABR (Australian Business Register) lookup API remains available and its current integration (`useAbnLookup` composable) can be reused or adapted for the new API
- EFTSure integration contract and API access are already established (bank verification is an existing capability)
- The existing `SupplierOnboarding` model (tracking timestamps per step) can be extended rather than replaced

### Dependencies

| Dependency | Description |
|---|---|
| SR0 -- API Foundation & Two-Tier Auth | Organisation/Supplier entity model, token-based auth, role-based access |
| EFTSure | Bank verification API for 3-stage + refusal flow |
| ABR API | ABN validation and business name lookup |
| SR5 -- Agreements & Compliance | APA agreement templates (SR1 handles the signing step; SR5 manages agreement lifecycle) |

### Risks

| Risk | Impact | Mitigation |
|---|---|---|
| Mobile verification failures persist | Suppliers cannot complete onboarding on iPhone | Dedicated mobile QA pass; consider alternative verification methods for mobile |
| EFTSure API changes or downtime | Bank verification blocked | Graceful degradation -- allow onboarding to proceed with manual bank verification fallback |
| Existing ~13K profiles need migration | Data integrity issues during cutover | Migration script with dry-run mode; parallel-run period where old and new flows coexist |
| Compliance rejection flow complexity | Edge cases where suppliers get stuck in loops | Clear state machine with maximum rejection cycles and escalation to Supplier Ops |

## Estimated Effort

**T-shirt size**: Large

- API endpoints (registration, onboarding steps, verification): 3-4 weeks
- Frontend (registration flows, onboarding wizard, progress indicators): 3-4 weeks
- EFTSure integration (3-stage bank verification): 1-2 weeks
- Verification flows (lite + heavy pathways): 2 weeks
- Migration tooling for existing profiles: 1 week
- QA and mobile testing: 1-2 weeks

**Total estimate**: 10-14 weeks (with SR0 complete)

## Proceed to PRD?

Yes -- this is the highest-priority epic after SR0 and directly impacts supplier activation rates for ~13,000 profiles.

## Decision

Pending -- awaiting SR0 completion and stakeholder alignment on verification flow complexity (lite vs. heavy pathways).

## Next Steps

1. Finalise SR0 API Foundation delivery timeline
2. Align with Sophie Pickett on verification document requirements and EFTSure 3-stage flow rules
3. Review Vishal's onboarding progress indicator design (currently in backlog)
4. Draft feature specification with detailed acceptance criteria (see companion spec.md)
5. Create Linear project under Supplier REDONE initiative
