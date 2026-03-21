---
title: "Idea Brief: Lead Essential (LES)"
description: "Consumer Onboarding > Lead Essential"
icon: i-heroicons-light-bulb
navigation:
  order: 1
---

**Created**: 2026-01-27
**Epic Code**: LES
**Initiative**: Consumer Onboarding (TP-1858)

---

## Problem Statement (What)

- Sales agents rely on fragmented tools (Zoho CRM, manual forms, spreadsheets) to capture and manage leads
- Inconsistent data entry creates duplicated records and data quality issues
- No unified visibility into the sales journey or lead pipeline status
- Manual handoffs between systems cause delays and lost information

**Current State**: Leads split across Zoho CRM and manual processes; no single source of truth for sales pipeline

---

## Possible Solution (How)

Build the **Lead Essentials module** in the Portal with core foundational features:

- **Leads List View** — Central workspace with structured, filterable tables
- **Create Lead Workflow** — Internal/external creation enforcing mandatory data (Lead Name, Email) with auto-assignment
- **Lead Profile View** — Persistent UI with Journey Stage bar, Lead Status actions, and Notes across all tabs
- **Journey Stage & Status Wizards** — Guided updates ensuring data completion
- **Overview Tab** — Lead identity, contact hierarchy, and assignment summary
- **Onboarding Fields** — Cessation/Commencement Dates, Referral Codes, Management Type for HCA readiness

```
// Before (Current)
1. Lead captured in Zoho CRM or spreadsheet
2. Manual data re-entry across systems
3. Status updates via email/chat — no audit trail

// After (With LES)
1. Lead created in Portal with validation
2. Single record with full history
3. Journey Stage progression tracked automatically
```

---

## Benefits (Why)

**User/Client Experience**:
- Single source of truth for all lead interactions: 100% leads in Portal
- Guided wizards eliminate data entry errors: 95%+ records complete

**Operational Efficiency**:
- Real-time funnel visibility via Journey Stage indicators
- 30% reduction in manual data entry time

**Business Value**:
- Foundation for LTH, LGI, LDS automation modules
- Enables deprecation of Zoho CRM dependency

---

## Owner & Stakeholders

| Role | Person |
|------|--------|
| **R** | David Henry (PO, BA), Beth Poultney (Des), Khoa Duong (Dev) |
| **A** | Nick Lunn |
| **C** | Jacqueline Palmer |
| **I** | — |

---

## Assumptions & Dependencies, Risks

**Assumptions**:
- Zoho integration provides interim sync until Portal replaces CRM
- Journey Stage/Status models align with existing business reporting

**Dependencies**:
- Design system for consistent UI across tabs and wizards
- LTH module (future) for onboarding automation

**Risks**:
- Data duplication (MEDIUM) → Mitigation: Clear migration timeline, Zoho deprecation plan
- User adoption resistance (MEDIUM) → Mitigation: Training, gradual rollout, feedback loops
- Submitter/client misclassification (LOW) → Mitigation: Validation rules, QA testing

---

## Estimated Effort

**3–4 sprints**, approximately $90k–$120k total dev cost

- **Sprint 1**: Design & IA — List view, profile, wizards UI
- **Sprint 2**: Backend — Core CRUD, models, filtering, assignment logic
- **Sprint 3**: Frontend — List views, profile tabs, wizards, onboarding forms
- **Sprint 4**: Integration & QA — Zoho sync, data migration, UAT

---

## Proceed to PRD?

**YES** — LES is foundational to all subsequent Lead modules. Must precede LTH, LGI, and LDS for proper data model alignment.

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
3. [ ] Create Jira epic (TP-2315)
4. [ ] Break down into user stories
