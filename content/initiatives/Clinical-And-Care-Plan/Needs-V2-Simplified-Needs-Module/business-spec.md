---
title: "Business Specification: Simplified Needs Module (Needs v2)"
---

# Business Specification: Simplified Needs Module (Needs v2)

## Executive Summary

Replace the current overwhelming needs capture module (20+ minute Zoho-derived form with 300+ fields) with a simplified, Maslow-based needs system that captures care needs in under 2 minutes. The new module links needs directly to risks and budget items — enabling end-to-end traceability from "what does the recipient need?" to "how are we paying for it?" and "what could go wrong?". This is the first deliverable under the RNC2 (Future State Care Planning) epic.

## Business Problem

### Current State
- Care partners spend 20+ minutes completing the needs questionnaire per recipient
- The form references services rather than focusing on the person's actual needs
- Needs, risks, and budget items are disconnected — no way to trace relationships
- Marianne (Clinical Governance) describes the current module as "pretty wordy" — care partners find it overwhelming
- Previous rollout attempts "jumped on" care partners without co-design
- Risk/needs data shows generic "October" updated dates — nobody has actually reviewed

### Pain Points
- **Coordinators**: Time spent on admin instead of client engagement
- **Clinical Team**: Can't see which needs connect to which risks
- **Compliance**: No audit trail linking needs to funding sources and budget items
- **Recipients**: Care plans may not reflect their actual needs because the form is too complex

### Opportunity
- Position Trilogy Care as an audit differentiator with evidence-based, Maslow-framed needs assessment
- Marianne: *"imagine the commission coming and saying this is cool"*
- Foundation for the broader RNC2 vision: risk scoring, AI-assisted drafting, care plan PDF generation

## Business Objectives

### Primary Goals
1. Reduce needs capture time from 20+ minutes to under 2 minutes per need
2. Ensure every need is categorised by Maslow level and linked to a funding source (structured data)
3. Enable needs-to-risks-to-budget traceability within a single workflow

### Secondary Goals
1. Improve Coordinator satisfaction with the needs capture process
2. Build data foundation for future care plan PDF generation and AI-assisted drafting
3. Demonstrate evidence-based practice positioning for aged care audits

### Non-Goals
- Replacing the risk scoring system (separate RNC2 workstream)
- AI-assisted need creation from assessment documents (future capability)
- Care plan PDF generation (future capability that will consume v2 data)
- Migrating existing v1 needs to v2

## Success Metrics & KPIs

| Metric | Baseline | Target | Measurement |
|--------|----------|--------|-------------|
| Time to capture a single need | 20+ minutes (full form) | Under 2 minutes | Observed during pilot sessions |
| Structured data rate | Varies (free-text heavy) | 100% of v2 needs have Maslow category + funding source | Query on v2 needs data |
| Risk linkage adoption | 0% (needs and risks disconnected) | 80% of v2 needs have at least one linked risk | Query on risk associations |
| Coordinator satisfaction | "Pretty wordy" / overwhelming | "Simpler" or "easier to use" reported | Qualitative feedback from co-design sessions |
| Feature flag independence | N/A | Toggling flag on/off does not affect v1 data | Regression test |
| Audit trail completeness | No audit trail on needs | 100% of create/update/delete events captured | Event store verification |

## Stakeholder Analysis

| Stakeholder | Role | Interest | RACI |
|-------------|------|----------|------|
| Romy Blacklaw | Product Owner | Feature scope, rollout strategy | **R**esponsible |
| Patrick Hawker | Executive Sponsor | Business alignment, budget approval | **A**ccountable |
| David Henry | Business Analyst | Requirements, acceptance criteria | **R**esponsible |
| Beth Poultney | Designer | UX/UI for wizard and list view | **R**esponsible |
| Khoa Duong | Developer | Implementation | **R**esponsible |
| Marianne | Clinical Governance | Maslow framework validation, clinical compliance | **C**onsulted |
| Erin Headley | Operations | Care partner workflow impact | **C**onsulted |
| Jennifer | OT (Allied Health) | Clinical perspective on need categories | **C**onsulted |
| Ian | Care Partner + Clinician | Dual-role user perspective | **I**nformed |
| Care Partners (general) | End Users | Daily users of the needs module | **I**nformed |

## Business Risks & Mitigations

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Care partners resist change if they feel the new module was imposed without consultation | HIGH | MEDIUM | Gradual rollout via feature flag; co-design sessions with care partners before broad rollout (lesson learned from previous "jumped on them" incident) |
| 14 Maslow categories don't cover all real-world needs | MEDIUM | LOW | Categories reviewed with Marianne (Clinical Governance) and Jennifer (OT); "Other" scenarios covered by flexible description field within closest category |
| V1 needs on existing packages become orphaned when v2 replaces the tab | MEDIUM | MEDIUM | V1 data remains in the system; v2 replaces the UI only. Future migration path can be planned if needed |
| Coordinators skip risk/budget linking steps because they're optional | MEDIUM | MEDIUM | Track linkage rates during pilot (SC-003 target: 80%); if low, investigate UX friction in wizard Steps 2-3 |

## ROI Analysis

### Investment
- Engineering effort: Estimated 3-5 sprints (shared with broader RNC2 deliverables)
- Design effort: Wizard UI, category grouping, list view
- Stakeholder time: Co-design sessions with care partners and clinicians

### Expected Returns
- **Time savings**: If 500 needs are captured per month and each saves 18 minutes vs v1, that's 150 hours/month of Coordinator time redirected to client engagement
- **Compliance**: Structured, auditable needs data reduces regulatory risk and positions TC favourably in aged care commission audits
- **Data quality**: 100% structured data (vs mixed free-text) enables future analytics, AI-assisted drafting, and population-level clinical insights

### Payback Period
- Immediate operational efficiency gains post-pilot
- Medium-term compliance and audit positioning value
- Long-term foundation for the full RNC2 care planning vision

## Market Context

### Target Users
- **Primary**: Coordinators / Care Partners (~50-100 daily users capturing and managing needs)
- **Secondary**: Clinical Team (reviewing needs and risk linkages)
- **Tertiary**: Compliance & Quality Assurance (audit trail consumers)

### Competitive Landscape
- Most aged care software uses generic free-text needs capture
- Maslow-based framework is a differentiator — evidence-based practice positioning
- Marianne believes this approach will impress the Aged Care Quality and Safety Commission during audits

### Timing Considerations
- Marianne's risk scoring methodology document is ready for pickup — clinical governance alignment is current
- April Falls Month (April 2026) — opportunity to socialize the Maslow framework alongside falls risk education
- Annual review cycles — v2 needs with proper timestamps address the "generic October dates" problem

## Business Clarifications

### Session 2026-02-12 — Business Lens

- Q: Which organisation(s) should be the pilot group? → A: **Decide during co-design**. Don't pick now — let the co-design sessions determine which group is most ready.
- Q: What is the primary go/no-go signal for broad rollout? → A: **Positive Coordinator feedback**. Qualitative signal — if care partners report the wizard as simpler/easier, proceed with rollout.

## Approval

- [ ] Business objectives approved
- [ ] Success metrics defined
- [ ] Stakeholders aligned
