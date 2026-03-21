---
title: "Idea Brief: Lead Desirable (LDS)"
description: "Consumer Onboarding > Lead Desirable"
icon: i-heroicons-light-bulb
navigation:
  order: 1
---

**Created**: 2026-01-27
**Epic Code**: LDS
**Initiative**: Consumer Onboarding (TP-1858)

---

## Problem Statement (What)

- Core lead management (LES/LTH) handles workflows but lacks CRM-style insights for informed interactions
- Critical client context — history, relationships, attribution, traits, preferences — is scattered or missing
- Sales staff operate transactionally rather than with personalized, qualified discussions
- No unified view of lead origin, linked relationships, or service alignment data

**Current State**: Staff lack holistic lead context; interactions are transactional, not relationship-driven

---

## Possible Solution (How)

Extend the **Lead Profile** with advanced contextual and analytical layers:

- **Linked Leads Management** — Two-way navigable relationships between related leads (spouses, carers)
- **Lead Timeline** — Complete audit trail with before/after values, timestamps, and authorship
- **Attribution Tab** — Combines Sales Defined Attribution (self-reported) with Lead Generation Attribution (UTM/referral data)
- **Options & Traits Tab** — Capture language, culture, lifestyle, mobility, and service requirements
- **Package Tab Enhancements** — Display MAC progress, approval milestones, and contribution details

```
// Before (Current)
1. Basic lead data without relationship context
2. Manual tracking of attribution sources
3. No visibility into lead traits or preferences

// After (With LDS)
1. Full relationship graph with linked leads
2. Unified attribution (manual + automated UTM)
3. Rich traits profile for service matching
```

---

## Benefits (Why)

**User/Client Experience**:
- CRM-style relationship management, not just transactions
- Personalized engagement via traits and preferences matching

**Operational Efficiency**:
- Complete audit trail — every update visible with full history
- End-to-end attribution analysis for marketing ROI

**Business Value**:
- Regulatory readiness — complete lead history aids audits
- Portal becomes true CRM replacement with holistic client view

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
- Staff have workflow access to full lead profiles
- MAC data is retrievable for existing and new clients

**Dependencies**:
- **LES** — Lead schema, tab framework, persistent components
- **LGI** — Attribution data sources and standardization
- **LTH** — Onboarding data and package creation fields

**Risks**:
- Performance degradation (MEDIUM) → Mitigation: Optimize timeline logging, pagination
- Inconsistent traits data (LOW) → Mitigation: Defined schema, validation rules, training

---

## Estimated Effort

**4–5 sprints**

- **Sprint 1**: Design — UI for tabs, timeline feed, traits cards
- **Sprint 2–3**: Backend — Data model, relationship logic, event logging, MAC linkage
- **Sprint 4**: Frontend — Tab implementations, linked leads UI, attribution display
- **Sprint 5**: QA/UAT — Data integrity, cross-tab testing

---

## Proceed to PRD?

**YES** — LDS completes the Lead module family, transforming the Portal into a true CRM replacement with rich contextual intelligence.

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
3. [ ] Create Jira epic
4. [ ] Break down into user stories
