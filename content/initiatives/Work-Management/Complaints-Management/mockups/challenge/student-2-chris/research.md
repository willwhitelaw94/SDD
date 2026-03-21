---
title: "Clinical Chris — Research"
---

# Clinical EHR Pattern Research

## 1. SOAP Note Documentation

**Source**: Medical documentation standard used universally in clinical settings since the 1960s (Dr. Lawrence Weed).

**Pattern**: Structured note format with four mandatory sections:
- **S (Subjective)**: Patient-reported symptoms, concerns, history — what the person *says*
- **O (Objective)**: Measurable findings, observations, test results — what the clinician *observes*
- **A (Assessment)**: Clinical judgment synthesizing S+O — what the clinician *thinks*
- **P (Plan)**: Actions, referrals, follow-up — what will be *done*

**Application to Complaints**: Each investigation note becomes a SOAP entry. Subjective = what was reported by the complainant. Objective = evidence gathered (rosters, medication charts, witness statements). Assessment = professional opinion on the complaint validity and severity. Plan = remediation steps and follow-up actions.

**Why it works**: Aged care staff are trained in SOAP documentation. Reusing the format for complaints reduces cognitive load and ensures comprehensive notes every time.

---

## 2. Australasian Triage Scale (ATS)

**Source**: Emergency department triage system used across all Australian hospitals (Australasian College for Emergency Medicine).

**Pattern**: 5-level urgency classification:
| Category | Name | Treatment Acuity | Color |
|----------|------|-------------------|-------|
| 1 | Resuscitation | Immediate | Red |
| 2 | Emergency | ≤10 minutes | Orange |
| 3 | Urgent | ≤30 minutes | Yellow |
| 4 | Semi-urgent | ≤60 minutes | Green |
| 5 | Non-urgent | ≤120 minutes | Blue |

**Application to Complaints**: Map complaint urgency to a familiar 5-point scale:
- Cat 1 (Critical): Immediate harm, abuse allegations, mandatory reporting
- Cat 2 (Urgent): Safety risk, active service disruption, regulatory exposure
- Cat 3 (High): Significant dissatisfaction, quality concern, media risk
- Cat 4 (Medium): Service improvement opportunity, minor process failure
- Cat 5 (Low): General feedback, suggestion, positive feedback with improvement note

**Why it works**: Every clinical staff member in Australia understands triage categories instantly. Color-coded dots provide immediate visual priority without reading text.

---

## 3. Clinical Register / Census Board

**Source**: Hospital ward census boards, ED tracking boards, clinical handover sheets.

**Pattern**: Dense tabular display showing all active patients/cases at a glance:
- Maximum data density — small font, tight row spacing, many columns
- Color-coded status indicators (traffic light, triage dots)
- Sortable/filterable columns
- Key identifiers prominently displayed (MRN, bed number, name)
- Overdue/critical flags with red highlighting
- Real-time or near-real-time updates

**Application to Complaints**: The feedback register becomes a clinical census board. REF numbers serve as MRNs. Triage category dots provide instant priority reading. Stage progression mirrors patient flow (Waiting → Triage → Treatment → Discharge). Overdue items get red alert flags like overdue medications.

**Why it works**: Clinical staff scan these boards dozens of times per shift. The density is intentional — trained eyes extract information faster from compact layouts than from spacious "modern" designs.

---

## 4. Patient Identification Banner

**Source**: EHR systems (Cerner, Epic, EMIS, Best Practice) — the sticky header showing patient demographics.

**Pattern**: Colored header strip that persists across all views for a single record:
- Patient name (bold, large), DOB, age, gender
- Medical Record Number (MRN)
- Allergies/alerts in red
- Key identifiers: ward, bed, consultant
- Often color-coded by acuity or alert status

**Application to Complaints**: Each feedback record gets a "record banner" — a colored header strip showing REF number, record type, triage category, subject line, current stage, and assigned coordinator. The banner color reflects triage urgency (red strip for Cat 1, orange for Cat 2, etc.). This banner persists across all tabs/sections of the record detail view.

**Why it works**: Prevents wrong-record errors. Staff always know exactly which complaint they're viewing, just like knowing which patient they're treating.

---

## 5. Clinical Care Plan / Action Checklist

**Source**: Nursing care plans, multidisciplinary action plans, clinical pathway checklists.

**Pattern**: Structured action items with accountability:
- Problem/goal statement
- Interventions listed with: responsible clinician, target timeframe, frequency
- Status tracking: Active, Complete, Discontinued, Overdue
- Progress notes linked to specific interventions
- Review dates with escalation for missed targets
- Grouped by active vs completed

**Application to Complaints**: The complaint action plan becomes a clinical care plan. Each action item has an owner (responsible person), target date, status, and completion notes. Overdue items trigger clinical-style alerts (red borders, warning icons). Progress is tracked as "3 of 5 actions complete" — familiar from care plan completion metrics.

**Why it works**: Mirrors the accountability structure staff already use for client care plans. The mental model transfers directly: identify the problem, assign actions, track completion, escalate if overdue.
