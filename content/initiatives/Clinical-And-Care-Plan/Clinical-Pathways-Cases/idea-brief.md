---
title: "Idea Brief: Clinical Pathways / Cases (CLI)"
---

# Idea Brief: Clinical Pathways / Cases

**Created**: 2026-02-13
**Author**: Will Whitelaw

---

## Problem Statement (What)

Management plans at Trilogy Care exist only in Zoho CRM as unstructured, lengthy documents (1,000+ words) with no lifecycle, no review schedule, and no connection to the data that matters — incidents, risks, needs, or budgets. Care partners can't see them in Portal. Clinical governance can't track them systematically.

- **No first-class entity**: Management plans are a free-text concept in CRM — not a structured, trackable record. There's no model, no status, no review cycle
- **Incident → MP link is manual**: When an incident resolves via "Management plan" (`IncidentResolutionEnum::MANAGEMENT_PLAN`), care partners manually create/update the MP in CRM. No automated handoff, no audit trail connecting the two
- **Risk profiles don't update**: Incidents that reveal new risks don't feed back into the risk register — mandatory under SAH Manual s8.6.2
- **No review schedule**: Once created, MPs sit until someone remembers to check them. No system-enforced follow-up, no reminders, no escalation
- **Duty of care gaps**: High-risk scenarios (repeated falls, elder abuse, dignity of risk) require mandatory clinical management — currently tracked informally
- **MP over-reporting**: Too many incidents resolved as "Management plan" when the actual resolution was simpler (advice, referral) — inflates clinical workload and muddies reporting

**Current State**: Management plans are unstructured CRM documents with no lifecycle, no automation, and no integration with Portal's clinical data. ~930 incidents/month, unknown percentage resolving via MP with no systematic follow-through.

---

## Possible Solution (How)

Introduce **Clinical Pathways / Cases** as a first-class domain entity in Portal — structured, lifecycle-managed clinical records that replace unstructured management plans.

- **Case model with lifecycle**: Create → Active → Scheduled Review → Continue / Close / Escalate
- **Three case types**: Mandatory (duty of care), Recommended (clinical follow-up), Self-Service (low risk resources)
- **Incident → Case automation**: When an incident resolves via clinical pathway, auto-create a Case linked to the incident
- **Risk register integration**: Cases update the risk register bidirectionally — new risks feed into RNC2 risk scores
- **Prescribed review schedules**: Every case gets a review schedule at creation — system-enforced reminders prevent follow-up gaps
- **Clinical Risk Badge**: Case data feeds the client-level risk badge on the recipient profile

```
// Before (Current)
1. Incident occurs → resolved as "Management plan"
2. Care partner manually writes MP in Zoho CRM (1000+ words)
3. No link back to incident, no risk update, no review schedule
4. MP sits indefinitely until someone remembers to check it
5. Clinical governance has no visibility or tracking

// After (With Clinical Pathways)
1. Incident occurs → resolved as "Clinical Pathway"
2. Case auto-created in Portal, linked to incident
3. Risk register updated, care plan review triggered
4. Review schedule set — system sends reminders
5. Case tracked through lifecycle with full audit trail
```

---

## Benefits (Why)

**User/Client Experience**:
- Care partners see active cases on client record during calls — informed conversations
- Clinicians manage pathways where they work (Portal), not in CRM

**Operational Efficiency**:
- Auto-creation from incidents eliminates manual MP writing in CRM
- Review schedule reminders prevent follow-up gaps — no more "forgotten" management plans
- Clearer resolution categories reduce MP over-reporting

**Compliance & Risk**:
- Structured case lifecycle satisfies SAH Manual s8.6.2 (care plan review on incident)
- Mandatory case type enforces duty of care obligations (elder abuse, high DOR/DOI)
- Full audit trail: who created, reviewed, escalated, closed — Commission-ready
- Marianne: *"If the commission comes in, we've got clinical audits to show"*

**Business Value**:
- Foundation for cross-epic clinical automation (ICM → CLI → RNC2)
- Reduced CRM dependency — another module migrated to Portal
- Population-level insights: which case types are most common, review compliance rates

---

## Owner & Stakeholders

| Role | Person |
|------|--------|
| **R** | Romy Blacklaw (PO), David Henry (BA), Beth Poultney (Des), Khoa Duong (Dev) |
| **A** | Patrick Hawker |
| **C** | Marianne (Clinical Governance), Erin Headley, Jennifer (OT) |
| **I** | Ian (Care Partner + Clinician), Care Partners, POD Leaders |

---

## Assumptions & Dependencies, Risks

**Assumptions**:
- Marianne's "Clinical Pathways / Cases" framing is the agreed terminology (confirmed Feb 11 2026 meeting)
- Cases will coexist with CRM management plans during transition — no big-bang migration
- Care partners will adopt structured pathways over free-text MPs (co-design required)
- The three case types (Mandatory, Recommended, Self-Service) cover all clinical scenarios

**Dependencies**:
- **ICM** (Incident Management) — incident → case automation requires incidents in Portal first (ICM Phase 1 minimum)
- **RNC2** (Future State Care Planning) — risk profile auto-update requires risk scoring engine for full integration
- Marianne's care partner + clinician survey on MP pain points (planned, not yet completed)
- Marianne's risk scoring methodology document (ready for pickup)

**Risks**:
- ICM Phase 1 not yet delivered — cases can't auto-trigger from incidents until incidents are creatable in Portal (HIGH) → Mitigation: CLI can be built independently with manual case creation; incident bridge added when ICM delivers
- Terminology confusion between "management plan", "case", and "clinical pathway" (MEDIUM) → Mitigation: Align naming in Feb 2026 with Marianne; use "Case" in code, user-facing label TBD
- Scope creep from duty of care scenarios (elder abuse, DOR/DOI) adding complexity (MEDIUM) → Mitigation: Phase 1 delivers lifecycle + review schedule; duty of care subtypes in Phase 2
- Care partner adoption risk — new structured workflow vs familiar free-text CRM (MEDIUM) → Mitigation: Co-design from start; lesson learned from Needs v1 rollout that "jumped on" care partners

---

## Estimated Effort

**3-4 sprints**, approximately M-L t-shirt size

- **Sprint 1**: Case domain model, lifecycle (Create → Active → Review → Close/Escalate), case types, manual CRUD
- **Sprint 2**: Review schedule engine — prescribed intervals, reminders, overdue tracking
- **Sprint 3**: Incident → Case bridge (requires ICM), risk register integration (requires RNC2 risk model)
- **Sprint 4**: Clinical Risk Badge feed, population-level case reporting, duty of care subtypes

---

## Proceed to PRD?

**YES** — Clinical Pathways / Cases fill the critical gap between incident response (ICM) and ongoing clinical management. The domain doc and Marianne's Feb 2026 requirements provide strong direction. ICM Phase 1 should land first, but CLI's domain model and manual CRUD can be built in parallel.

---

## Decision

- [ ] **Approved** - Proceed to PRD
- [ ] **Needs More Information** - [What's needed?]
- [ ] **Declined** - [Reason]

**Approval Date**: —

---

## Next Steps

**If Approved**:
1. [ ] `/trilogy-clarify business` — Refine business outcomes, success metrics, ROI
2. [ ] Pick up Marianne's risk scoring methodology document
3. [ ] Co-design case lifecycle with care partners and clinicians
4. [ ] `/speckit-specify` — Create detailed developer-ready specification
5. [ ] Coordinate with ICM timeline for incident → case bridge

---

## Source Meetings

| Date | Meeting | Key Topics |
|------|---------|------------|
| Feb 11, 2026 | [Clinical Product Requirements (Marianne)](https://app.fireflies.ai/view/Clinical-Product-Requirements::01KH7HSR11DJBCBJETN0J8W2R4) | Reframing MPs as clinical pathways/cases, mandatory vs recommended, duty of care, self-service resources |
| Sep 29, 2025 | Clinical Meeting - Project Activate | Clinical governance, risk profiles, dignity of risk forms |
| Sep 3, 2025 | Care/Clinical/Assessment Teams (Sian) | Riskman vision, auto-escalation, system limitations |
| May 9, 2025 | CQCC | Incident volume, SIRS breakdown, MP over-reporting |

---

## Related Epics

| Epic | Relationship |
|------|-------------|
| **ICM** (Incident Management) | Upstream — incidents trigger case creation |
| **RNC2** (Future State Care Planning) | Downstream — cases update risk scores, reference needs |
| **CCU** (Care Circle Uplift) | Cases may involve external providers in care circle |
| **ASS1** (Assessments/Prescriptions) | Assessments can trigger case creation (clinical judgement pathway) |
