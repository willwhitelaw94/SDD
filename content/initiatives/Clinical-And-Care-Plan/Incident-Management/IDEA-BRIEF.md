---
title: "Idea Brief: Incident Management (ICM)"
description: "Clinical And Care Plan > Incident Management"
icon: i-heroicons-light-bulb
navigation:
  order: 1
---

**Epic Code**: ICM | **Created**: 2026-02-07 | **Linear**: [ICM Incident Management](https://linear.app/trilogycare/project/icm-incident-management-b30dd804abdb)

---

## Problem Statement (What)

- **System fragmentation**: Incidents live in Zoho CRM; care partners work in Portal — can't see, create, or edit incidents where they work. Portal is read-only (no `Edit.vue`)
- **No automation**: Incident → MP link is manual, risk profiles not updated (violates SAH Manual s8.6.2), care plan reviews not triggered, MP over-reporting
- **SIRS compliance is manual**: P1 (24h) and P2 (30d) deadlines tracked by memory — no system enforcement. IMS is mandatory for registration under Aged Care Act 2024
- **No visibility**: ~2,781 incidents/quarter with no dashboard, notifications, analytics, or export. Commission audit readiness weak
- **Self-managed model gap**: Trilogy remains legally responsible for self-managed clients but no clear incident pathway for them

**Current State**: Read-only Portal sync from CRM, no edit capability, no SIRS workflow, no automation — ~2,781 incidents/quarter across fragmented systems.

---

## Possible Solution (How)

Two-phase migration from CRM to Portal as primary IMS.

**Phase 1 — Portal Intake + Viewer (2-3 sprints)**:
- Web form → Portal using Marianne's redesigned V2 form (4-tier harm classification, trend tracking, structured outcomes/actions, escalation trail, follow-up plan)
- Incidents visible on client record during calls
- Care partners raise incidents from Portal (not CRM) — form designed for all reporters including care recipients and family
- Editing could stay in Zoho initially
- New model fields needed: harm tier, trend tracking, escalation details, follow-up plan, client notification, reporter relationship, location, actions taken

**Phase 2 — Full IMS with Automation (3-4 sprints)**:
- Full CRUD in Portal, CRM deprecated for incidents
- Incident → Case automation (triggers clinical pathway — depends on CLI)
- Risk profile auto-update, care plan review trigger (depends on RNC2)
- SIRS deadline tracking with system-enforced P1/P2 alerts
- Auto-escalation based on triage category
- Export, analytics, trend analysis, Commission-ready reporting

```
// Before                              // After
Incidents in Zoho CRM                → Portal where care partners work
Read-only, no Edit.vue               → Full CRUD with audit trail
SIRS deadlines by memory             → System-enforced alerts
No notifications                     → Auto-escalation by triage
Manual incident → MP handoff         → Incident → Case → Risk → Care Plan
2,781/quarter, no analytics          → Dashboard, trends, Commission reporting
```

---

## Benefits (Why)

**User/Client**: Care partners see incident history during calls; faster resolution; clinical pathways auto-created
**Operational**: "Reduces everyone's time" (Marianne); 3 new clinical governance roles work from Portal; auto-escalation
**Compliance**: Portal becomes the IMS (mandatory for registration); SIRS deadline enforcement; audit trail for Commission; satisfies SAH s8.6.2
**Business**: Pattern analysis across 2,781+ incidents/quarter; reduced CRM dependency; MP over-reporting resolved

---

## Owner & Stakeholders

| Role | Person |
|------|--------|
| **R** | — (Dev), — (Des) |
| **A** | Marianne (Clinical Governance) |
| **C** | Sian Holman, Erin Headley, Patrick Hawker, Care Partners |
| **I** | POD Leaders, Compliance Team |

---

## Assumptions & Dependencies, Risks

**Assumptions**:
- Form V2 requires extending Portal data model (confirmed — 8+ new fields)
- Stakeholder consultation completed (Sep–Oct 2025) — care partners, clinicians, pod leaders, operations
- Self-managed clients: Trilogy legally responsible as registered provider — form must work for all reporter types

**Dependencies**:
- **CLI** (Clinical Portal Uplift) — incident → case automation requires cases in Portal
- **RNC2** (Future State Care Planning) — risk auto-update requires scoring engine
- Pat to confirm clinician trial timeline

**Key Artifacts** (✅ received — saved to `context/rich_context/`):
1. ✅ [Documentation Review (Sep 2025)](context/rich_context/Incident%20Reporting%20Documentation%20Review%20September%202025) — gap analysis of current vs revised form
2. ✅ [Form Draft V2](context/rich_context/New%20Incident%20Form%20Draft%20V2) — complete form spec (4-tier harm, outcomes, actions, trends, escalation)
3. ✅ [Best Practice Guide (Oct 2025)](context/rich_context/Trilogy%20Care%20Best%20Practice%20Guide%20Incident%20Management) — 8 guiding principles

**Risks**:
- CRM deprecation timeline unclear (MED) → Phase 1 keeps CRM for editing
- Adoption resistance (MED) → Co-design with care partners from start; clinician trial with Pat
- SIRS integration with My Aged Care Portal out of scope (LOW) → Track deadlines; submission stays manual

---

## Estimated Effort

**Phase 1: 2-3 sprints** — Intake form, Edit.vue, client-record visibility, triage at intake, basic SIRS tracking
**Phase 2: 3-4 sprints** — Full CRUD, auto-escalation, incident → case (CLI), risk auto-update (RNC2), analytics

---

## Proceed to PRD?

**YES** — Phase 1 is a quick win: Portal already has Incident domain infrastructure. Marianne's form V2 is ready. Phase 2 depends on CLI and RNC2.

---

## Decision

- [x] **Approved** - Proceed to PRD
- [ ] **Needs More Information**
- [ ] **Declined**

---

## Next Steps

1. [x] Pick up Marianne's redesigned incident form — ✅ received
2. [ ] Map form V2 fields to Portal data model — identify gaps
3. [ ] Scope Phase 1 minimum — incidents raisable + viewable from Portal
4. [ ] Co-design with care partners (Marianne: "they must be involved from the start")
5. [ ] Determine Zoho CRM deprecation timeline with Pat/operations
6. [ ] Wait for Pat to confirm clinician trial timeline

---

## Source Meetings

| Date | Meeting | Key Topics |
|------|---------|------------|
| Feb 11, 2026 | [Clinical Product Requirements (Marianne)](https://app.fireflies.ai/view/Clinical-Product-Requirements::01KH7HSR11DJBCBJETN0J8W2R4) | Redesigned form, triage, incident → case, governance roles, Portal migration |
| Feb 2, 2026 | Engineering Huddle | Decision to move incidents CRM → Portal |
| Sep 3, 2025 | Care/Clinical/Assessment Teams (Sian) | Riskman vision, auto-escalation |
| May 9, 2025 | CQCC | 2,781 incidents/quarter, SIRS breakdown |

---

## Related Epics

| Epic | Relationship |
|------|-------------|
| **CLI** (Clinical Portal Uplift) | Incident → Case automation |
| **RNC2** (Future State Care Planning) | Incidents feed risk scores |
| **CCU** (Care Circle Uplift) | External providers on incidents |
| **DOC** (Documents) | Incident-related documents |
