---
title: "Idea Brief: Risk Radar"
description: "Clinical And Care Plan > Risk Radar"
icon: i-heroicons-light-bulb
navigation:
  order: 1
---

**Epic Code**: RRA | **Created**: 2026-02-14

---

## Problem Statement (What)

- **No risk visibility at a glance**: Care partners and POD leaders have no visual summary of a client's risk profile — they must scroll through individual risk cards to understand the overall picture
- **No severity scoring**: 28 risk categories exist with 107+ category-specific enums, but no quantified severity/likelihood scoring — everything is subjective "high/medium/low" or unrated
- **No cross-client risk analytics**: ~2,500+ active packages with risk data but no way to spot patterns, compare risk profiles, or identify clients who need urgent review
- **Clinical governance blind spot**: Monthly governance committee reviews risks manually — no aggregated view, no trend tracking, no automated flagging of deteriorating risk profiles
- **Maslow hierarchy disconnected**: NeedsV2 groups needs by Maslow level but risks are flat — no visual connection between foundational needs and associated risks
- **Incident → risk gap**: ICM will feed incident data to risk profiles (SAH Manual s8.6.2) but there's no visual representation of how incidents shift a client's risk landscape

**Current State**: 28 risk categories stored as flat cards with JSON data blobs. No scoring, no radar visualisation, no trend tracking. Clinical team reviews risks manually with no aggregated dashboard.

---

## Possible Solution (How)

**Risk Radar** — a whole-of-client clinical risk framework with residual-risk scoring across 5 clinical domains, traffic-light dashboard, and system-driven risk calculation.

**Core Model (Refined Feb 2026 — Maryanne's Clinical Risk Framework)**:

16 clinical risk areas grouped into **5 clinical risk domains** — Functional Ability, Clinical Health Status, Mental Health & Psychosocial, Nutritional & Sensory Health, Safety Risks. Each risk area scored via **client questionnaire** (Consequence 0-4) with **mitigation effectiveness** (Strong 2 / Partial 1 / None 0) to determine **residual risk**. Domain residual risks synthesised into a **single traffic-light status** (Green / Amber / Red).

**Key shift from initial spec**: Replaces simple Prevalence × Impact multiplication with a **residual-risk model** — consequence after mitigation. A client with high falls risk but strong mitigation (equipment, supervision, insight) is not automatically "high risk". The system assesses the whole client, not isolated risks.

**Phase 1 — Residual Risk Engine + Traffic-Light Dashboard (2-3 sprints)**:
- Client questionnaire: 16 risk areas with plain-language questions → Consequence score (0-4)
- Mitigation effectiveness scoring per domain: Strong (2) / Partial (1) / None (0)
- Residual risk calculation: Consequence adjusted by mitigation effectiveness
- 5 clinical domains: Functional Ability, Clinical Health Status, Mental Health & Psychosocial, Nutritional & Sensory Health, Safety Risks
- Domain residual scores synthesised into single traffic-light status (Green / Amber / Red)
- Traffic-light dashboard: care partners see who needs attention now, who needs monitoring, who is stable
- Clinician decision prompts for mitigation effectiveness (structured, not subjective)
- Clinical judgement override with documented rationale
- Composite risk badge on client/package profile header
- Radar chart OR bar chart (toggle) on package risk tab showing 5 domains
- Drill-down from domain → individual risk areas with consequence + mitigation detail
- Feature flag per organisation for gradual rollout

**Phase 2 — Trend Tracking + Clinical Dashboard (2-3 sprints)**:
- Risk score history via event sourcing (already in place) — replay for trends
- Trend overlay: radar shape comparison over 30/60/90 days; sparklines per domain
- Clinical dashboard: POD-level heatmap, organisation-wide risk distribution, auto-flagging
- Auto-escalation: clients whose residual risk crosses into Red trigger clinical review (HRVC)
- Integration with ICM — incidents update relevant domain consequence scores
- Escalation pathways aligned with Organisational Risk Management Procedure

**Phase 3 — Maslow-Risk Mapping + System Automation (1-2 sprints)**:
- Map risk domains to Maslow levels (Functional Ability = Physiological, Psychosocial = Belonging)
- System-driven auto-calculation from assessments + documented mitigation (reduces manual review)
- Clinical risk score badge on client profile header
- Intervention comparison view: before/after radar overlay for care plan reviews
- Org-level risk register integration (bridge client risk patterns to corporate risk register)

```
// Before                                // After
Flat risk cards, no scoring             → 5-domain residual risk with traffic-light
Subjective high/med/low                 → Questionnaire-based consequence (0-4) + mitigation
28 categories, no grouping             → 16 risk areas in 5 clinical domains
No mitigation tracking                  → Strong/Partial/None mitigation per domain
Single-risk escalation                  → Whole-of-client residual risk assessment
No trends, no history                   → 30/60/90 day trend overlay + sparklines
Manual governance review                → Auto-flagged deteriorating profiles
No cross-client visibility              → Traffic-light dashboard + POD heatmap
No composite score                      → Traffic-light (Green/Amber/Red) per client
```

---

## Benefits (Why)

**User/Client**: Care partners see risk profile at a glance — 10-second understanding vs. scrolling through cards; clients benefit from proactive intervention when trends are caught early
**Operational**: POD leaders identify their highest-risk clients instantly; clinical dashboard replaces manual governance review spreadsheets
**Compliance**: Evidence-based scoring satisfies Support at Home Program Manual s8.6.2 (systematic risk identification); Commission audit-ready with quantified scores and history
**Business**: Pattern analysis enables preventive care model — reducing incidents, hospitalisations, and regulatory risk

---

## Owner & Stakeholders

| Role | Person |
|------|--------|
| **R** | — (Dev), — (Des) |
| **A** | Marianne (Clinical Governance) |
| **C** | Sian Holman, Erin Headley, Care Partners |
| **I** | POD Leaders, Compliance Team |

---

## Assumptions & Dependencies, Risks

**Assumptions**:
- Maryanne's residual-risk model (consequence + mitigation = residual risk) is the target framework — replaces simple P × I
- 5 clinical risk domains with 16 risk areas are the definitive grouping (validated by Maryanne, Feb 2026)
- Client questionnaire provides consequence scoring (0-4) with plain-language questions
- Mitigation effectiveness (Strong/Partial/None) is assessed per domain by clinicians using structured decision prompts
- Traffic-light output (Green/Amber/Red) is the primary user-facing indicator for care partners
- Clinical judgement override is preserved through structured prompts and documented rationale
- Event sourcing already captures risk CRUD — can be replayed for historical trend data
- System-driven auto-calculation is the target (Phase 3) — manual clinician input in Phase 1
- Organisational Risk Management Procedure (ISO 31000 aligned) governs corporate-level risks separately

**Dependencies**:
- **RNC2** (Needs V2) — Maslow-risk mapping in Phase 3 depends on NeedsV2 being live
- **ICM** (Incident Management) — Phase 2 incident → risk score integration depends on ICM Phase 1
- **Marianne** — Clinical risk domains framework, consequence table, and mitigation strategies (NOW PROVIDED)

**Risks**:
- Residual risk calculation method needs clinical validation (MED) → Maryanne to confirm aggregation rules
- Domain grouping may need adjustment as clinical team validates (LOW) → 5 domains clinically grounded
- Retrospective scoring of existing risks (LOW) → Default existing risks to "unscored" with prompt to assess
- Mitigation scoring subjectivity (MED) → Structured decision prompts and governance safeguard (document overrides) mitigate this
- Alignment between org-level risk matrix (ordinal 1-25) and client-level consequence (0-4) (LOW) → Different audiences, different purposes

---

## Estimated Effort

**Phase 1: 2-3 sprints** — Residual risk engine, client questionnaire, traffic-light dashboard, radar/bar visualisation
**Phase 2: 2-3 sprints** — Trend tracking, clinical dashboard, ICM integration, escalation pathways
**Phase 3: 1-2 sprints** — Maslow mapping, system-driven auto-calculation, org-level risk bridge

---

## Proceed to PRD?

**YES** — The radar visualisation is a high-impact, low-risk addition. Phase 1 can ship independently. Evidence-based scoring is a clinical governance priority flagged by Marianne in Feb 2026 meeting.

---

## Decision

- [ ] **Approved** - Proceed to PRD
- [ ] **Needs More Information**
- [ ] **Declined**

---

## Next Steps

1. [x] Validate 5 domain groupings with Marianne and clinical team — **DONE**: Maryanne provided definitive 5-domain framework (Feb 2026)
2. [x] Marianne to share evidence-based scoring criteria — **DONE**: Clinical Risk Domains + Consequence Table + Framework Overview received
3. [ ] Confirm residual risk aggregation rules (how domain residual risks → traffic-light Green/Amber/Red)
4. [ ] Confirm mitigation scoring calibration with clinical team (is Strong/Partial/None sufficient granularity?)
5. [ ] Update spec to reflect residual-risk model (consequence + mitigation) — replaces P × I
6. [ ] `/trilogy-idea-handover` — Gate 0 (Idea Gate)
7. [ ] Align with RNC2 on Maslow-level mapping for risk domains
8. [ ] Determine alignment/integration points with Organisational Risk Management Procedure

---

## Source Meetings & Documents

| Date | Meeting / Document | Key Topics |
|------|---------|------------|
| Feb 2026 | Maryanne: Clinical Risk Domains (docx) | 5 clinical domains, mitigation scoring (Strong/Partial/None), clinician decision prompts, worked examples |
| Feb 2026 | Maryanne: Clinical Risk Consequence Table (docx) | 16 risk areas, client questionnaire with consequence levels (0-4), dementia staging |
| Feb 2026 | Maryanne: Client Clinical Risk Framework (email) | Residual risk model, traffic-light output, system-driven design, governance rationale |
| Feb 2026 | Maryanne: Organisational Risk Management Procedure (docx) | Corporate-level risk governance (ISO 31000), 5×5 matrix with ordinal ranking, treatment lifecycle |
| Feb 11, 2026 | Clinical Product Requirements (Marianne) | Evidence-based risk scoring framework, clinical risk badge, Maslow-based hierarchy |
| Sep 3, 2025 | Care/Clinical/Assessment Teams | Risk profiles, auto-escalation, clinical pathways |

---

## Related Epics

| Epic | Relationship |
|------|-------------|
| **ICM** (Incident Management) | Incidents feed risk score changes |
| **RNC2** (Needs V2) | Maslow-level mapping shared taxonomy |
| **CLI** (Clinical Portal Uplift) | Clinical dashboard integration |
| **CCU** (Care Circle Uplift) | External provider risk visibility |
