---
title: "Feature Specification: Clinical Governance Dashboard (CGD)"
description: "Clinical And Care Plan > Clinical Governance Dashboard"
---

> **[View Mockup](/mockups/clinical-governance-dashboard/index.html)**{.mockup-link}

# Feature Specification: Clinical Governance Dashboard (CGD)

**Status**: Draft
**Epic**: CGD — Clinical Governance Dashboard | **Initiative**: Clinical and Care Plan
**Prefix**: CGD
**Priority**: P2

---

## Overview

The Clinical Governance Dashboard provides a centralised hub in Portal for ACQSC (Aged Care Quality and Safety Commission) audit traceability, clinical data governance, and governance KPI reporting. Currently, clinical governance activities — audit compliance, data traceability, risk KPIs — are spread across spreadsheets, emails, and manual processes with no single source of truth. ACQSC audit readiness is tracked offline, KPIs are calculated manually each quarter, and governance committee meetings rely on manually assembled reports.

CGD maps ACQSC Audit Tool line items to Portal data sources, introduces a data traceability matrix, and surfaces real-time governance KPIs with drill-down capability. It is delivered across three phases: audit traceability and data governance matrix, governance KPI dashboard, and data quality and gap analysis.

---

## User Scenarios & Testing

### User Story 1 — View ACQSC Audit Compliance Status Per Standard (Priority: P1)

As a **Clinical Governance team member**, I want to view the compliance status for each ACQSC Audit Tool line item mapped to Portal data so that I can see which standards are fully mapped, partially mapped, or unmapped — and prepare for Commission audits with confidence.

**Acceptance Scenarios**:

1. **Given** the Clinical Governance team has mapped Standard 3 data requirements, **When** a team member views the Audit Traceability dashboard, **Then** each Standard 3 line item displays its compliance status: Mapped (green), Partially Mapped (amber), or Unmapped (red)

2. **Given** a line item is mapped to specific Portal data fields, **When** the user clicks on the line item, **Then** they see the linked data sources, fields, and evidence points

3. **Given** Standard 5 mapping is in progress, **When** the dashboard renders, **Then** Standard 5 line items show their current mapping status alongside Standard 3

4. **Given** a governance committee meeting is scheduled, **When** the Clinical Governance team exports the audit compliance report, **Then** the export includes all line items, their mapping status, linked data sources, and any gaps identified

---

### User Story 2 — View Data Traceability Matrix (Priority: P1)

As a **Clinical Governance team member**, I want to view a data traceability matrix that shows how each clinical data attribute is collected, who owns it, where it comes from, and what KPIs it feeds so that I can answer the question "where does this data come from?" systematically.

**Acceptance Scenarios**:

1. **Given** data attributes have been documented in the traceability matrix, **When** a team member views the Data Governance page, **Then** each attribute displays: collection method, data owner, data source, data definition, and potential KPIs

2. **Given** a data attribute feeds multiple KPIs, **When** the user views the attribute detail, **Then** all linked KPIs are listed with their current values

3. **Given** the traceability matrix has been populated, **When** the user searches for a data attribute by name, **Then** matching attributes are returned with their governance metadata

---

### User Story 3 — View Real-Time Governance KPI Tiles (Priority: P2)

As a **Clinical Governance team member or CQCC member**, I want to view real-time governance KPI tiles showing incident rates, risk profile distributions, care plan review timeliness, and assessment completion rates so that governance decisions are data-driven rather than based on manually assembled quarterly reports.

**Acceptance Scenarios**:

1. **Given** incident data exists in Portal via ICM, **When** the Governance KPI dashboard loads, **Then** an incident rate KPI tile shows the current rate with a sparkline trend for the selected date range

2. **Given** risk scoring data exists via Risk Radar, **When** the dashboard loads, **Then** a risk profile distribution KPI tile shows the breakdown of risk levels across the client population

3. **Given** care plan data exists, **When** the dashboard loads, **Then** a care plan review timeliness KPI tile shows the percentage of care plans reviewed on time vs overdue

4. **Given** assessment data exists via ASS1, **When** the dashboard loads, **Then** an assessment completion rate KPI tile shows the current completion percentage

5. **Given** a user clicks on a KPI tile (e.g., "overdue care plan reviews"), **When** the drill-down opens, **Then** the user sees a list of affected clients with relevant details

---

### User Story 4 — Configure Dashboard Date Range and Filters (Priority: P2)

As a **Clinical Governance team member**, I want to filter the KPI dashboard by date range and organisation/POD so that I can analyse governance metrics for specific time periods and organisational units.

**Acceptance Scenarios**:

1. **Given** the Governance KPI dashboard is displayed, **When** a user selects a date range (e.g., last quarter), **Then** all KPI tiles recalculate to reflect only data from that period

2. **Given** the dashboard supports POD filtering, **When** a user selects a specific POD, **Then** all KPI tiles show metrics for that POD only

3. **Given** filters are applied, **When** the user clicks "Reset Filters", **Then** the dashboard returns to the default view (all PODs, current quarter)

---

### User Story 5 — Generate Automated Governance Report (Priority: P2)

As a **Clinical Governance team member**, I want to generate an automated governance report for CQCC meetings so that report preparation takes minutes instead of hours.

**Acceptance Scenarios**:

1. **Given** the Governance KPI dashboard has current data, **When** the user clicks "Generate Report", **Then** the system produces a formatted report including all KPI values, trend data, and compliance status for the selected date range

2. **Given** the report is generated, **When** the user downloads it, **Then** the report is in a format suitable for governance committee review (PDF or structured export)

---

### User Story 6 — View Data Quality Scores Per Standard (Priority: P3)

As a **Clinical Governance team member**, I want to view data quality scores (completeness, timeliness, accuracy) for each ACQSC standard so that I can identify where data collection needs improvement.

**Acceptance Scenarios**:

1. **Given** data quality scoring rules have been configured, **When** the Data Quality dashboard loads, **Then** each standard shows scores for completeness, timeliness, and accuracy

2. **Given** a standard has low completeness, **When** the user views the gap analysis, **Then** the system highlights which data attributes are missing or incomplete

3. **Given** gaps are identified, **When** the user views recommendations, **Then** the system suggests which data collection improvements would close the most compliance gaps

---

### Edge Cases

- What happens if Portal does not hold the data for a specific ACQSC line item? The line item is marked as "Unmapped — External Source Required" with a note indicating the source system
- What happens if KPI definitions change mid-quarter? The dashboard recalculates from the updated definition; historical snapshots preserve the prior calculation for audit trail
- What happens if ICM or Risk Radar data is not yet available? KPI tiles for unavailable data sources display "Data source pending" with a link to the dependency epic
- What happens if the Clinical Governance team wants to add a new KPI? The dashboard supports configurable KPIs — new KPIs can be added without code changes (Phase 2)

---

## Functional Requirements

**ACQSC Audit Traceability (Phase 1)**

- **FR-001**: System MUST display ACQSC Audit Tool line items with compliance status indicators: Mapped (green), Partially Mapped (amber), Unmapped (red)
- **FR-002**: System MUST link each mapped line item to specific Portal data sources, fields, and evidence points
- **FR-003**: System MUST support Standards 3 and 5 initially, with an extensible architecture for all 8 ACQSC standards
- **FR-004**: System MUST support export of audit compliance status for governance committee review and Commission audit preparation

**Data Governance Matrix (Phase 1)**

- **FR-005**: System MUST store and display a data traceability matrix with attributes: collection method, data owner, data source, data definition, and potential KPIs
- **FR-006**: System MUST support search and filtering of data attributes by name and governance metadata
- **FR-007**: Dashboard MUST be read-only in Phase 1 (no data modification from the dashboard)

**Governance KPI Dashboard (Phase 2)**

- **FR-008**: System MUST display real-time KPI tiles for: incident rates (from ICM), risk profile distributions (from Risk Radar), care plan review timeliness, and assessment completion rates
- **FR-009**: System MUST display trend charts with monthly/quarterly comparisons and sparklines
- **FR-010**: System MUST support drill-down from KPI tile to underlying data (e.g., list of affected clients)
- **FR-011**: System MUST support configurable date range and organisation/POD filters
- **FR-012**: System MUST support automated governance report generation for CQCC meetings

**Data Quality & Gap Analysis (Phase 3)**

- **FR-013**: System MUST display data quality scores per standard: completeness, timeliness, accuracy
- **FR-014**: System MUST highlight standards and line items where Portal data coverage is weak
- **FR-015**: System SHOULD provide a recommendations engine suggesting which data collection improvements would close the most compliance gaps
- **FR-016**: System SHOULD integrate with Risk Radar for a clinical risk governance overlay

---

## Key Entities

| Entity | Description |
|--------|-------------|
| **ACQSC Standard** | One of the 8 Aged Care Quality Standards (focus: Standards 3 and 5 initially) |
| **Audit Line Item** | A specific requirement within an ACQSC standard, mapped to Portal data sources |
| **Data Attribute** | A clinical data field with governance metadata (owner, source, collection method, definition) |
| **Governance KPI** | A configurable metric derived from Portal data (incidents, risks, care plan timeliness, etc.) |
| **Compliance Status** | Traffic-light indicator: Mapped / Partially Mapped / Unmapped |
| **Data Quality Score** | Composite score: completeness, timeliness, accuracy per standard |

---

## Success Criteria

### Measurable Outcomes

| Goal | Metric | Target |
|------|--------|--------|
| Audit readiness | ACQSC line items mapped to Portal data (Standards 3 & 5) | 100% of applicable items |
| Data governance | Data attributes documented in traceability matrix | 100% of clinical data attributes |
| Report efficiency | Time to prepare governance committee report | Reduced from hours to minutes |
| KPI visibility | Governance KPIs available in real-time | All defined KPIs live in dashboard |
| Data quality | Standards with data quality scoring enabled | Standards 3 and 5 in Phase 3 |
| Committee adoption | CQCC meetings using dashboard-generated reports | 100% of meetings post-Phase 2 |

---

## Assumptions

- ACQSC Audit Tool review for Standards 3 and 5 has been conducted at high level; Standard 3 data requirements are fully drafted
- Data traceability matrix format has been commenced (attributes, collection method, owner, source, definitions, potential KPIs)
- Portal already holds much of the required data (incidents via ICM, risks via Risk Radar, care plans, assessments); this epic maps and surfaces it
- The dashboard is primarily a read-only reporting/visibility tool in Phases 1-2
- KPI definitions will be co-designed with Marianne and the Clinical Governance team
- The clinical governance team (Marianne + 3 new roles) will maintain the audit traceability mappings

---

## Dependencies

| Dependency | Type | Impact |
|------------|------|--------|
| [ICM — Incident Management](/initiatives/Clinical-And-Care-Plan/Incident-Management/) | Epic | Incident KPIs require incident data in Portal |
| [RRA — Risk Radar](/initiatives/Clinical-And-Care-Plan/Risk-Radar/) | Epic | Risk distribution KPIs require residual risk scoring |
| [RNC2 — Future State Care Planning](/initiatives/Clinical-And-Care-Plan/Future-State-Care-Planning/) | Epic | Care plan review timeliness requires care plan data |
| [ASS1 — Assessment Prescriptions](/initiatives/Clinical-And-Care-Plan/Assessment-Prescriptions/) | Epic | Assessment completion rate KPIs |
| Marianne (Clinical Governance) | Stakeholder | Standard 5 data requirements mapping; KPI definitions |
| Clinical Governance Team | Stakeholder | KPI definitions and governance reporting requirements |

---

## Out of Scope

- Data modification from the dashboard (read-only in Phase 1-2)
- Standards beyond 3 and 5 in initial phases (extensible architecture allows future expansion)
- Clinical decision support or recommendations engine beyond data quality gap suggestions
- Real-time alerting or notification system for compliance breaches (future enhancement)
- Integration with external audit systems or Commission portals
- Automated data collection improvement workflows

---

## Risks

| Risk | Severity | Mitigation |
|------|----------|------------|
| Standard 5 mapping not yet started | MEDIUM | Standard 3 can ship independently; Phase 1 scope focuses on Standard 3 first |
| KPI definitions may evolve as governance team matures | LOW | Dashboard designed for configurable KPIs; definitions versioned |
| Data quality scoring methodology needs clinical validation | MEDIUM | Co-design scoring methodology with Marianne |
| Scope creep across all 8 ACQSC standards | LOW | Phase 1 focuses on Standards 3 and 5 only; extensible architecture for future standards |
| Dependent epics (ICM, RRA) not yet delivering data | MEDIUM | Phase 1 audit traceability does not require live KPI data; Phase 2 KPIs can show placeholder for unavailable sources |

## Clarification Outcomes

### Q1: [Dependency] All Phase 2 KPIs depend on data from other epics (ICM for incidents, RRA for risk scores, ASS1 for assessments, RNC2 for care plans). What is the expected delivery order? If these epics are delayed, does CGD Phase 2 have fallback behaviour?
**Answer:** The dependency table lists ICM, RRA, RNC2, and ASS1 as Phase 2 dependencies. The existing codebase already has incident data (`domain/Incident/Models/Incident.php` with stages, classifications, resolutions, outcomes), risk data (`domain/Risk/Models/Risk.php` with categories and assessment data), and need data (`domain/Need/Models/PackageNeed.php`). Risk Radar (RRA) introduces scored risk assessments but the existing Risk model has `comprehensive_risks_data` and category-specific enums. **Phase 2 KPIs can partially launch using existing data: incidents (from Incident model), care plan timeliness (from PackageNeed timestamps), and basic risk distributions (from Risk model). Scored risk and assessment completion KPIs require RRA and ASS1 respectively. Fallback: show "Data source pending" tiles for unavailable sources per the edge case definition.**

### Q2: [Scope] Phase 1 is read-only, but the data traceability matrix (FR-005) requires data attributes to be documented. Who populates this data? Is it a manual admin task or auto-generated from the Portal schema?
**Answer:** The spec says "data traceability matrix format has been commenced" in assumptions. FR-007 says "Dashboard MUST be read-only in Phase 1 (no data modification from the dashboard)." The matrix contains metadata like collection method, data owner, data source, definition, potential KPIs. **Assumption: This is a manual admin task initially. The Clinical Governance team (Marianne + 3 new roles) populates the matrix. The data is stored in a database table (not a spreadsheet) so it's searchable. Auto-generation from the Portal schema is Phase 3 territory. Recommendation: Build a simple admin CRUD (via Nova or a dedicated admin page) for the governance team to populate the traceability matrix.**

### Q3: [Data] The spec mentions "configurable KPIs" in Phase 2 (FR-008). What is the configuration mechanism? Are KPIs defined via code, a YAML file, or a UI builder?
**Answer:** The edge case section says "the dashboard supports configurable KPIs -- new KPIs can be added without code changes (Phase 2)." This suggests a UI builder or config file, not code-managed definitions. **Recommendation: Phase 2 KPIs should be defined as database records (a `governance_kpis` table) with fields: name, query/calculation definition, data source reference, threshold values, display type (tile/chart), and target value. A simple admin UI allows the governance team to configure new KPIs. Code changes are needed only for novel data source integrations, not for KPI definitions.**

### Q4: [Edge Case] KPI definitions may evolve as the governance team matures. How does the dashboard handle historical data when a KPI definition changes? Are historical snapshots preserved for audit?
**Answer:** The edge case says "historical snapshots preserve the prior calculation for audit trail." This implies a versioning system. **Recommendation: Each KPI calculation should be snapshotted (stored as a periodic record: daily or weekly) with the KPI definition version. When a definition changes, a new version is created. Historical snapshots retain the prior version's calculation. This enables audit trail showing "KPI X was Y% on date Z using definition v1."**

### Q5: [UX] The spec targets CQCC meetings with automated report generation. What is the output format? Does it need to be a specific template (e.g., board paper format), or is a generic PDF acceptable?
**Answer:** FR-012 says "automated governance report generation for CQCC meetings." US5 says "formatted report including all KPI values, trend data, and compliance status." The output format is "PDF or structured export." **Assumption: A branded PDF using the existing PDF generation infrastructure (the codebase has `resources/views/pdf/service-plans/service-plan.blade.php` showing Blade-based PDF generation) is appropriate. The template should include: report period, KPI summary table, trend sparklines, compliance status matrix, and identified gaps. A generic but branded PDF is acceptable for MVP -- specific board paper formatting can be iterated based on CQCC feedback.**

### Q6: [Integration] The spec says CGD maps ACQSC Audit Tool line items to Portal data sources. How many line items exist across Standards 3 and 5? Is this a manageable manual mapping exercise?
**Answer:** ACQSC Standard 3 (Personal Care and Clinical Care) and Standard 5 (Organisation's Governance) each contain multiple expected outcomes with numerous line items. The spec says Standard 3 data requirements are "fully drafted" and Standard 5 is "in progress." **Assumption: The mapping is a manual exercise performed by the governance team (Marianne). The system stores the mapping; it does not auto-detect it. Each line item maps to zero or more Portal data fields. This is a data entry task, not an engineering task. Recommendation: Estimate 50-100 line items across Standards 3 and 5. Build the mapping UI to handle this volume efficiently (searchable, sortable table).**

### Q7: [Permissions] Who can access the Clinical Governance Dashboard? Is it restricted to the governance team, or visible to all staff?
**Answer:** The spec describes the target users as "Clinical Governance team member" and "CQCC member." The existing Portal uses role-based access via policies. **Assumption: The dashboard should be restricted to users with a "clinical governance" or equivalent permission. This aligns with the existing pattern where budget dashboards are restricted to budget coordinators. A new permission (e.g., `view-governance-dashboard`) should be created.**

## Refined Requirements

1. **Phase 1 data population**: The data traceability matrix SHOULD be populated via a simple admin CRUD interface (not spreadsheet import). The Clinical Governance team is responsible for initial data entry.
2. **KPI snapshotting**: Each KPI calculation MUST be periodically snapshotted (minimum weekly) with the KPI definition version to support historical audit trail.
3. **Access control**: A new `view-governance-dashboard` permission SHOULD gate access to the CGD pages.
4. **Partial Phase 2 launch**: Phase 2 KPI tiles SHOULD launch with available data sources (incidents, basic risks, care plan timeliness) and show "Data source pending" for sources not yet delivering data.
