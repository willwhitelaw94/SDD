---
title: "Research: Incidents & Management Plans"
description: "Cross-source research synthesis covering current state, regulatory requirements, stakeholder vision, and gaps"
---

# Research: Incidents & Management Plans

> Comprehensive research across TC Docs, Codebase, Linear, Fireflies, ACQSC, and the Support at Home Program Manual

---

## Executive Summary

Incident management at Trilogy Care is currently split between **Zoho CRM** (primary, editable) and **TC Portal** (read-only sync). A February 2026 decision was made to migrate incident management fully into the Portal. The existing Portal implementation has models, enums, tables, and list views but is **read-only** with no edit capability. Management plans serve as a key incident resolution pathway but the linkage is currently informal.

Regulatory pressure is increasing: the **Aged Care Act 2024** (effective Nov 1, 2025) expanded SIRS to all funded aged care including home care, and the **Strengthened Quality Standards** mandate an Incident Management System as a condition of registration.

---

## 1. Current State

### What Exists in Portal

| Component | Status | Details |
|-----------|--------|---------|
| **Incident model** | Exists | `domain/Incident/Models/Incident.php` with full field set |
| **IncidentOutcome model** | Exists | Many-to-many via `incident_outcome` pivot |
| **6 enums** | Exist | Origin, Stage, Classification, Triage, Resolution, Outcome |
| **Data DTOs** | Exist | `IncidentData`, `IncidentZohoData`, etc. |
| **List action** | Exists | `ListIncidentsAction` → `Incidents/Index.vue` |
| **Edit action** | Exists | `EditIncidentAction` but **Edit.vue page is missing** |
| **Package tab** | Exists | `PackageIncidents.vue` filtered by package |
| **Zoho sync job** | Exists | `SyncIncidentsFromZohoJob` via webhook |
| **Table component** | Exists | `IncidentTable` with columns, filters, search |
| **Factory & Seeder** | Exist | `IncidentFactory`, `IncidentSeeder` |

### What's Missing

| Gap | Impact |
|-----|--------|
| **No Edit.vue page** | Can't edit incidents in Portal despite route existing |
| **No update action** | No PUT endpoint for saving changes |
| **No export** | `IncidentTable::exports()` returns empty array |
| **No incident→risk linking** | Incidents don't auto-update risk profiles |
| **No SIRS workflow** | SIRS reporting done manually via My Aged Care Provider Portal |
| **No notifications** | No alerts on new incidents or escalations |
| **One-way sync only** | CRM → Portal; no Portal → CRM updates |

### Zoho CRM (Current Primary System)

Incidents are managed as **Cases** in Zoho CRM. The webhook at `POST /api/webhooks/zoho/incident` dispatches `SyncIncidentsFromZohoJob` to pull data into Portal.

**Field Mapping (Zoho → Portal):**

| Zoho Field | Portal Column |
|------------|---------------|
| `Care_Plan.id` | `package_id` (via Package zoho_id lookup) |
| `Date_of_Incident` | `occurred_date` |
| `Reported_By` | `reported_by` |
| `Date_Reported` | `reported_date` |
| `Description` | `description` |
| `Solution` | `solution` |
| `Case_Origin` | `origin` |
| `Status` | `stage` |
| `Category` | `classification` |
| `Incident_Type` | `incident_type` |
| `Triage_Category` | `triage_category` |
| `Resolution_Action` | `resolution` |
| `Reviewed_by_Clinical_Nurse` | `is_reviewed` |
| `Hospitalised` | `is_hospitalised` |

---

## 2. Regulatory Framework

### Aged Care Act 2024

| Provision | Requirement |
|-----------|-------------|
| **Section 16(1)** | Providers must notify the Commission when a reportable incident occurs |
| **Sections 164 & 166** | Primary incident management and reporting obligations |
| **Effective Nov 1, 2025** | Expanded SIRS to all funded aged care (including home care/Support at Home) |

### SIRS — Reportable Incident Types

1. Unreasonable use of force
2. Unlawful sexual contact or inappropriate sexual conduct
3. Psychological or emotional abuse
4. Unexpected death
5. Stealing or financial coercion
6. Neglect
7. Inappropriate use of a restrictive practice
8. Unexplained absence from care

### Reporting Timeframes

| Priority | Criteria | Timeframe |
|----------|----------|-----------|
| **Priority 1** | Has/could cause harm requiring treatment; OR involves sexual contact, death, unexplained absence; OR reasonable grounds to report to police | **Within 24 hours** |
| **Priority 2** | All other reportable incidents | **Within 30 days** |

### Strengthened Quality Standards

| Standard | Relevance |
|----------|-----------|
| **Standard 2 (The Organisation)** | Organisational governance including IMS |
| **Standard 5, Outcome 5.1 (Clinical Governance)** | All providers must have clinical governance covering incident management |
| **Standard 5, Outcome 5.4** | Clinical assessment, prevention, treatment, management |

### Support at Home Program Manual (V4.2)

| Section | Requirement |
|---------|-------------|
| **3.4** | SIRS obligations overview; comply with s164 and s166 |
| **8.6** | Care plans must include risk identification and management strategies |
| **8.6.2** | Care plan review mandatory when incident occurs |
| **8.7** | Incidents must be recorded in care notes or dedicated IMS |
| **8.4** | SIRS reporting excluded from claimable care management activities |
| **10.10** | Elder abuse reporting obligations |
| **11.5.1** | Third-party workers must be trained in incident management procedures |

**IMS is a mandatory condition of registration** under the new Act. Providers must have an incident management system that covers prevention, management, reporting, and quality improvement.

---

## 3. Stakeholder Vision

### Sian Holman (Sep 3, 2025 — Care/Clinical/Assessment Teams)

> "We need something like Riskman... where if someone raises a clinical incident, it would auto-escalate to a clinical nurse... the system should know based on the triage category who needs to be notified and when."

Key requirements identified:
- **Auto-escalation** based on triage category
- **Integrated notifications** to clinical team
- **Dashboard visibility** for care partners
- **Audit trail** for Commission compliance
- **Pattern analysis** across incidents

### CQCC Meeting (May 9, 2025)

- **2,781 incidents per quarter** across the organisation
- SIRS breakdown tracked for Commission compliance
- Management plan (MP) over-reporting identified as a problem — need to distinguish genuine MPs from routine follow-up
- Triage category system was implemented in Aug 2024 to standardise prioritisation

### Engineering Decision (Feb 2, 2026)

- **Decision**: Move incident management from CRM to Portal
- **Rationale**: Better integration with care plans, risk profiles, and clinical workflows
- **No timeline set** — currently backlog priority (P3)

### Commission Audit Preparedness (Oct 28, 2024)

- Incident management identified as a key audit area
- Need for demonstrable incident tracking, resolution, and quality improvement cycle
- Documentation of lessons learned and systemic improvements

---

## 4. Management Plans Connection

Management plans are a primary **resolution pathway** for incidents. The `IncidentResolutionEnum::MANAGEMENT_PLAN` value directly links incident resolution to clinical recommendation creation.

### Current Flow

```
Incident Resolved with "Management plan"
    → Care Partner manually creates/updates MP in CRM
    → No automated link between incident and MP
    → Care plan updated separately
```

### Desired Flow

```
Incident Resolved with "Management plan"
    → System prompts for MP creation/update
    → MP auto-linked to incident record
    → Risk profile updated automatically
    → Care plan review triggered
    → Budget impact assessed if new services needed
```

### Key Issue: MP Over-Reporting

From May 2025 CQCC meeting: too many incidents are being resolved as "Management plan" when the actual resolution was simpler (advice, referral). This inflates MP creation work and muddies reporting. Need clearer resolution category definitions and training.

---

## 5. Linear Projects & Issues

### [ICM] Incident Management

- **Project ID**: `34d0e75b-d882-4885-a519-a1ccd9d0642e`
- **Status**: Backlog
- **Priority**: P3
- **URL**: [Linear Project](https://linear.app/trilogycare/project/incident-management-34d0e)

### [CLI] Clinical Portal Uplift (Parent)

- **Project ID**: `025eb552-8b57-4f23-aee1-61eba3084f5f`
- **Status**: Start
- **Priority**: P2
- **Owner**: Marianne
- **Includes**: Management Plans & Risk Update (PLA-1244)

### Key Issues

| Issue | Title | Status |
|-------|-------|--------|
| PLA-1244 | [CLI] Clinical Portal Uplift - Management Plans & Risk Update | In Progress |
| PLA-1126 | Clinical Assessor assessments creating needs/risks/prescriptions | Related |

---

## 6. Codebase Architecture

### Domain Structure

```
domain/Incident/
├── Actions/
│   ├── ListIncidentsAction.php       # Inertia controller → Incidents/Index
│   └── EditIncidentAction.php        # Inertia controller → Incidents/Edit (MISSING PAGE)
├── Data/
│   ├── IncidentData.php              # TypeScript-transformable DTO
│   ├── IncidentOutcomeData.php       # Outcome DTO
│   ├── IncidentZohoData.php          # Zoho CRM mapping
│   └── IncidentZohoCarePlanData.php  # Zoho Care Plan reference
├── Enums/
│   ├── IncidentOriginEnum.php        # Incident, Accident, Change/Deterioration
│   ├── IncidentStageEnum.php         # 0.New → 3.Resolved, 9.Insufficient
│   ├── IncidentClassificationEnum.php # Clinical, Non-clinical, SIRS
│   ├── IncidentTriageCategoryEnum.php # CAT 1–5
│   ├── IncidentResolutionEnum.php    # Management plan, Referral, Advice, etc.
│   └── IncidentOutcomeEnum.php       # Permanent injury, Elder abuse
├── Factories/
│   └── IncidentFactory.php           # Test factory
├── Jobs/
│   └── SyncIncidentsFromZohoJob.php  # Zoho → Portal sync
├── Models/
│   ├── Incident.php                  # Main model (SoftDeletes, HasHashId)
│   └── IncidentOutcome.php           # Outcome lookup (M2M)
├── Providers/
│   └── IncidentServiceProvider.php   # Routes registration
├── Routes/
│   └── incidentRoutes.php            # GET /incidents, GET /incidents/{id}/edit
├── Seeders/
│   └── IncidentSeeder.php            # 20 incidents with random outcomes
└── Tables/
    └── IncidentTable.php             # InertiaUI table with columns/filters
```

### Related Domain Touchpoints

| Domain | Connection |
|--------|-----------|
| **Package** | `Package::incidents()` HasMany relationship |
| **Risk** | No direct code link — manual process via CRM |
| **Need** | No direct code link |
| **Assessment** | No direct code link |

---

## 7. Gaps & Recommendations

### Critical Gaps

| Gap | Priority | Rationale |
|-----|----------|-----------|
| **No edit capability** | High | Portal is read-only; all edits in CRM |
| **No SIRS workflow** | High | Regulatory obligation; currently manual |
| **No incident→risk auto-link** | High | Mandatory under SAH Manual s8.6.2 |
| **No notifications/escalation** | High | Stakeholder requirement; audit risk |

### Medium Gaps

| Gap | Priority | Rationale |
|-----|----------|-----------|
| **No export** | Medium | Compliance reporting needs |
| **No incident→MP linking** | Medium | Resolution pathway is informal |
| **One-way sync** | Medium | Portal can't update CRM |
| **No dashboard/analytics** | Medium | Pattern analysis for quality improvement |

### Future State Vision

Based on stakeholder input, the target system should:

1. **Be the primary IMS** — replace CRM as single source of truth
2. **Auto-escalate** — route incidents based on triage category
3. **Integrate with risk profiles** — auto-update when incidents reveal new risks
4. **Link to management plans** — formal MP creation as resolution pathway
5. **Support SIRS reporting** — track Priority 1/2 status and deadlines
6. **Provide analytics** — trend analysis, pattern detection, quality metrics
7. **Notify stakeholders** — clinical team, care partners, POD leaders
8. **Support audit** — full trail for Commission compliance reviews

---

## 8. Sources

| Source | Type | Key Findings |
|--------|------|-------------|
| TC Portal Codebase | Code | Full Incident domain with 6 enums, Zoho sync, read-only UI |
| TC Docs | Documentation | Initiative, domain docs for risk/care plan/complaints |
| Linear | Project Management | ICM (Backlog P3), CLI (Start P2), PLA-1244 |
| Fireflies | Meeting Transcripts | Riskman vision, 2,781/quarter, CRM→Portal decision |
| Support at Home Manual V4.2 | Regulation | SIRS obligations, s164/s166, care plan review triggers |
| ACQSC Reportable Incidents Workflow | Regulation | Priority 1/2 decision tree, reportable incident types |
| Aged Care Act 2024 | Legislation | Expanded SIRS from Nov 2025, IMS mandatory |
| Strengthened Quality Standards | Regulation | Standard 2 (Organisation), Standard 5 (Clinical Governance) |

---

*Research conducted: Feb 7, 2026*
*Sources: TC Docs, Codebase, Linear, Fireflies, ACQSC, Support at Home Manual V4.2*
