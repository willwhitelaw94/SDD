---
title: "Idea Brief: Inclusion Integration (ASS2)"
description: "Clinical and Care Plan > Inclusion Integration"
icon: i-heroicons-light-bulb
navigation:
  order: 1
---

**Created**: 2026-01-14
**Epic Code**: ASS2
**Initiative**: Clinical and Care Plan (TP-1859)

---

## Problem Statement (What)

- ASS1 creates structured Recommendations and backend Inclusion seeds, but downstream logic is missing
- No governed Inclusion lifecycle to determine whether ATHM items are clinically justified, eligible, ready, and fundable
- No structured Needs model to consolidate assessments
- No automated invoice gating — compliance checks, funding decisions, and invoice approvals rely on manual processes
- No clinical criteria index to power action plans or Request module

**Current State**: Compliance checks, funding decisions, and invoice approvals rely heavily on manual processes, leading to inconsistency, delays, and operational risk

---

## Possible Solution (How)

ASS2 activates the full **post-assessment engine**, turning raw Inclusion data from ASS1 into governed, rule-driven, auditable objects:

- **Inclusion Lifecycle** — Convert backend seeds into full objects with states: Draft → Ready → Active → Closed; readiness checklist includes evidence, Tier-5, quotes, eligibility, staleness, and funding pathway
- **Needs Lifecycle** — Consistent Need object consolidating multiple assessments into stable Needs for planning and audit
- **Funding & Eligibility Rules** — Automated rule engine determines fundability and contribution requirements; prevents invalid inclusions with clear ineligibility reasons
- **Invoice Gating & Automation** — Auto-match invoices to Inclusions using Tier-5 and metadata; auto-hold without Ready Inclusion; auto-release when criteria met
- **Inclusion Index & Search** — Organisation-wide searchable listing with filters by Tier-5, Need, funding stream, lifecycle state, supplier
- **Action-Plan Engine** — Canonical index of clinical criteria (mobility, ADLs, safety); map Needs and Inclusions for structured action plans
- **Assessment Consolidation** — Combine overlapping assessments into unified Needs and Inclusions

```
// Before (Current)
1. ASS1 creates Inclusion seeds
2. Manual compliance checks
3. Manual invoice gating
4. No structured Needs model

// After (With ASS2)
1. Governed Inclusion lifecycle
2. Automated eligibility rules
3. Auto-match invoices to Inclusions
4. Structured Needs + action plans
```

---

## Benefits (Why)

**User/Client Experience**:
- Coordinators receive structured, criteria-mapped action plans
- Clear visibility into Inclusion status and eligibility

**Operational Efficiency**:
- Reduces manual invoice checks and "on hold" volumes
- Unified Need + Inclusion logic across all assessments and CP workflows

**Business Value**:
- Compliance — all ATHM items meet evidence, eligibility, and funding rules before approval
- Full audit chain from Need → Inclusion → Assessment → Recommendation → Budget → Invoice

---

## Owner & Stakeholders

| Role | Person |
|------|--------|
| **R** | Romy Blacklaw (PO), David Henry (PO, BA), Beth Poultney (Des), Khoa Duong (Dev) |
| **A** | Patrick Hawker |
| **C** | Maryanne Humphries, Janith Disanayake |
| **I** | Emma Andrada |

---

## Assumptions & Dependencies, Risks

**Assumptions**:
- ASS1 produces consistent, validated Recommendations and Inclusion seeds
- Tier-5 dataset and clinical criteria index are centrally governed

**Dependencies**:
- **ASS1** — Budget linkage, Recommendation and Inclusion seed data
- Invoice ingestion & classification
- Clinical criteria index creation & maintenance

**Risks**:
- Incorrect rules blocking necessary payments (MEDIUM) → Mitigation: Rule validation with clinical team, override workflows
- Needs/Inclusion consolidation requiring clinical judgement (MEDIUM) → Mitigation: Clear consolidation rules, human review option
- Coordinator confusion with action-plan UX (LOW) → Mitigation: User testing, intuitive interface design

---

## Estimated Effort

**4–5 sprints**

- **Sprint 1**: Design — Inclusion lifecycle, Needs model, action-plan UX
- **Sprint 2–3**: Backend — Inclusion/Needs data models, rule engine, invoice gating logic
- **Sprint 4**: Frontend — Inclusion index, search, action-plan UI, coordinator workflows
- **Sprint 5**: QA/UAT — Rule validation, invoice matching accuracy, end-to-end testing

---

## Proceed to PRD?

**YES** — ASS2 adds a governed Inclusion and Needs engine with rules-based eligibility and invoice gating for compliant ATHM funding.

---

## Decision

- [ ] **Approved** - Proceed to PRD
- [ ] **Needs More Information**
- [ ] **Declined**

**Approval Date**: ____

---

## Next Steps

**If Approved**:
1. [ ] Create PRD (spec.md)
2. [ ] Create RACI Matrix
3. [ ] Create Jira epic (TP-2914)
4. [ ] Break down into user stories
