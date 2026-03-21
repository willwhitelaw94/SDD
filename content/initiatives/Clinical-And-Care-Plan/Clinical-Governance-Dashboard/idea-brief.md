---
title: "Idea Brief: Clinical Governance Dashboard (CGD)"
description: "Clinical And Care Plan > Clinical Governance Dashboard"
icon: i-heroicons-light-bulb
navigation:
  order: 1
---

**Epic Code**: CGD | **Created**: 2026-03-05

---

## Problem Statement (What)

- **No centralised governance view**: Clinical governance activities — audit compliance, data traceability, risk KPIs — are spread across spreadsheets, emails, and manual processes with no single source of truth
- **ACQSC audit readiness is manual**: Compliance against Aged Care Quality Standards (particularly Standards 3 and 5) is tracked offline with no systematic mapping of Portal data to audit requirements
- **Data governance gaps**: No formal traceability matrix connecting data attributes to their collection method, owner, source, and definition — making it impossible to answer "where does this data come from?" systematically
- **No KPI visibility**: Clinical governance KPIs (incident rates, risk profile distributions, care plan review timeliness, etc.) are calculated manually each quarter — no real-time or automated reporting
- **Governance committee inefficiency**: Monthly CQCC and governance meetings rely on manually assembled reports; no dashboard to drive evidence-based decision-making
- **Standard 3 & 5 compliance tracking**: Standard 3 (Personal Care and Clinical Care) is fully drafted as a data/information requirement; Standard 5 (Organisation's Service Environment) is the immediate next priority — but no system tracks completeness or gaps

**Current State**: Clinical governance operates on manual spreadsheets and meeting-driven review. ACQSC audit tool has been reviewed at high level for Standards 3 and 5, with a draft data/information requirement mapped per audit line item. No Portal dashboard, no automated KPI tracking, no data traceability matrix in the system.

---

## Possible Solution (How)

A **Clinical Governance Dashboard** in Portal — a centralised hub for ACQSC audit traceability, clinical data governance, and governance KPI reporting.

**Phase 1 — ACQSC Audit Traceability + Data Governance Matrix (2-3 sprints)**:
- Map each ACQSC Audit Tool line item to Portal data sources, fields, and evidence points
- Complete Standard 3 mapping (already drafted) and Standard 5 mapping (next priority)
- Data traceability matrix: for each data attribute, record collection method, data owner, data source, data definition, and potential KPIs
- Read-only dashboard showing audit compliance status per standard/line item (mapped / partially mapped / unmapped)
- Export for governance committee review and Commission audit preparation

**Phase 2 — Governance KPI Dashboard (2-3 sprints)**:
- Real-time KPI tiles: incident rates, risk profile distributions (from Risk Radar), care plan review timeliness, assessment completion rates
- Trend charts: monthly/quarterly comparisons with sparklines
- Drill-down from KPI → underlying data (e.g., click "overdue care plan reviews" → list of affected clients)
- Configurable date range and organisation/POD filters
- Automated governance report generation for CQCC meetings

**Phase 3 — Data Quality + Gap Analysis (1-2 sprints)**:
- Data quality scoring per standard: completeness, timeliness, accuracy indicators
- Gap analysis: highlight standards/line items where Portal data coverage is weak
- Recommendations engine: suggest which data collection improvements would close the most compliance gaps
- Integration with Risk Radar for clinical risk governance overlay

```
// Before                                    // After
ACQSC audit prep is manual spreadsheets     → Traceability matrix in Portal per standard
No data governance documentation            → Every data attribute traced: owner, source, method, definition
KPIs calculated quarterly by hand           → Real-time dashboard with drill-down
Governance meetings rely on ad-hoc reports  → Automated governance report generation
Standard compliance status unknown          → Traffic-light per standard line item
No data quality visibility                  → Completeness/timeliness/accuracy scoring
```

---

## Benefits (Why)

**User/Client**: Better data governance means more reliable clinical information driving care decisions; clients benefit from proactive gap identification
**Operational**: Governance committee meetings become data-driven; saves hours of manual report preparation per governance cycle; clinical governance team (Marianne + 3 new roles) has a single source of truth
**Compliance**: Direct mapping from ACQSC Audit Tool to Portal data satisfies Commission audit requirements; evidence-based compliance status per standard; systematic tracking of Standards 3 and 5 (and extensible to all 8 standards)
**Business**: Quantified data quality and compliance coverage reduces regulatory risk; positions Trilogy for Commission audits with confidence; bridges clinical governance data to organisational risk management

---

## Owner & Stakeholders

| Role | Person |
|------|--------|
| **R** | — (Dev), — (Des) |
| **A** | Marianne (Clinical Governance) |
| **C** | Sian Holman, Erin Headley, Patrick Hawker, Clinical Governance Team |
| **I** | POD Leaders, Compliance Team, CQCC Members |

---

## Assumptions & Dependencies, Risks

**Assumptions**:
- ACQSC Audit Tool review for Standards 3 and 5 has been conducted at high level — Standard 3 data requirements are fully drafted
- Data traceability matrix format has been commenced (data attributes, collection method, data owner, source, definitions, potential KPIs)
- Dashboard requirements have been initially scoped by the clinical governance team
- Portal already holds much of the data needed (incidents via ICM, risks via Risk Radar, care plans, assessments) — this epic is about mapping and surfacing it
- The dashboard is primarily a read-only reporting/visibility tool in Phase 1-2

**Dependencies**:
- **ICM** (Incident Management) — incident KPIs require incident data in Portal
- **RRA** (Risk Radar) — risk distribution KPIs require residual risk scoring
- **RNC2** (Future State Care Planning) — care plan review timeliness requires care plan data
- **Marianne** — Standard 5 data requirements mapping (next priority after Standard 3)
- **Clinical Governance Team** — KPI definitions and governance reporting requirements

**Risks**:
- Standard 5 mapping not yet started (MED) → Standard 3 can ship independently; Phase 1 scope can focus on Standard 3 first
- KPI definitions may evolve as governance team matures (LOW) → Dashboard designed for configurable KPIs
- Data quality scoring methodology needs clinical validation (MED) → Co-design with Marianne
- Scope creep across all 8 ACQSC standards (LOW) → Phase 1 focuses on Standards 3 and 5 only; extensible architecture for future standards

---

## Estimated Effort

**Phase 1: 2-3 sprints** — ACQSC audit traceability matrix, data governance documentation, compliance status dashboard (Standards 3 & 5)
**Phase 2: 2-3 sprints** — Governance KPI dashboard, real-time tiles, trend charts, automated report generation
**Phase 3: 1-2 sprints** — Data quality scoring, gap analysis, recommendations, Risk Radar integration

---

## Proceed to PRD?

**YES** — Standard 3 data requirements are already drafted, dashboard requirements have been scoped. This epic provides the governance visibility layer that ties together ICM, Risk Radar, and care planning data. High value for Commission audit readiness.

---

## Decision

- [ ] **Approved** - Proceed to PRD
- [ ] **Needs More Information**
- [ ] **Declined**

---

## Next Steps

1. [ ] Complete Standard 3 data requirements mapping (finalise draft)
2. [ ] Begin Standard 5 data requirements mapping (immediate next priority)
3. [ ] Define governance KPI list with Marianne and CQCC
4. [ ] `/trilogy-idea-handover` — Gate 0 (Idea Gate)
5. [ ] Map Portal data model to ACQSC Audit Tool line items (technical discovery)
6. [ ] Determine dashboard UX approach (dedicated page vs. embedded widgets)

---

## Source Context

| Date | Source | Key Topics |
|------|--------|------------|
| Mar 2026 | Clinical Governance Progress Update | 4 workstreams: ACQSC audit tool review, data requirements mapping (Std 3 done, Std 5 next), data traceability matrix commenced, dashboard requirements scoped |
| Feb 11, 2026 | [Clinical Product Requirements (Marianne)](https://app.fireflies.ai/view/Clinical-Product-Requirements::01KH7HSR11DJBCBJETN0J8W2R4) | Clinical governance direction, risk scoring, incident management, governance roles |

---

## Related Epics

| Epic | Relationship |
|------|-------------|
| **ICM** (Incident Management) | Incident data feeds governance KPIs |
| **RRA** (Risk Radar) | Risk distribution data for governance dashboard |
| **RNC2** (Future State Care Planning) | Care plan review timeliness KPIs |
| **CLI** (Clinical Pathways/Cases) | Clinical pathway compliance tracking |
| **ASS1** (Assessments) | Assessment completion rate KPIs |
