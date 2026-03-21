---
title: "Idea Brief: Lead Generation Integrations (LGI)"
description: "Consumer Onboarding > Lead Generation Integrations"
icon: i-heroicons-light-bulb
navigation:
  order: 1
---

**Created**: 2026-01-27
**Epic Code**: LGI
**Initiative**: Consumer Onboarding (TP-1858)

---

## Problem Statement (What)

- Lead generation sources fragmented across multiple systems with inconsistent tracking
- Marketing forms, ad platforms (Google, Meta), BD leads (Coordinated, Priority One), and organic channels each use different storage methods
- Inconsistent attribution data causes missed leads and limited campaign visibility
- No unified view of lead origin for marketing ROI analysis

**Current State**: Each lead source operates independently; attribution scattered, campaign performance unmeasurable

---

## Possible Solution (How)

Develop a **unified lead ingestion and attribution framework** that standardizes all incoming leads:

- **Marketing Leads** — Route Google, Meta, and form submissions directly into Portal preserving UTM metadata (Source, Medium, Campaign)
- **BD Leads** — Integrate Coordinated and Priority One referrals with referral IDs and source context
- **Organic Leads** — Capture website forms and direct portal entries using same lead structure
- **Central Attribution Layer** — All sources feed into Attribution Tab for unified reporting
- **Data Validation Model** — Ensures every lead includes complete, traceable origin data

```
// Before (Current)
1. Google lead → separate tracking
2. BD referral → manual import
3. Website form → different system
4. No unified attribution

// After (With LGI)
1. All sources → single ingestion API
2. UTM/referral IDs preserved
3. Central attribution layer
4. Unified campaign ROI reporting
```

---

## Benefits (Why)

**User/Client Experience**:
- Single reliable source of truth for all inbound leads
- Accurate source-based reporting for Marketing, Sales, and Partnerships

**Operational Efficiency**:
- Improved data hygiene and deduplication via unified object model
- Campaign ROI tracking and optimization with consistent UTM data

**Business Value**:
- Data backbone for lead scoring, attribution analysis, and automation
- Foundation for future CRM and marketing workflow enhancements

---

## Owner & Stakeholders

| Role | Person |
|------|--------|
| **R** | David Henry (PO, BA), Beth Poultney (Des), Khoa Duong (Dev) |
| **A** | Nick Lunn |
| **C** | Stephen Danckert, Bernie Ng, Ray Jayathunga, Katja Panova, Jacqueline Palmer |
| **I** | — |

---

## Assumptions & Dependencies, Risks

**Assumptions**:
- All lead sources have identifiable IDs or tracking parameters (UTM, referral ID, form ID)
- Attribution data can be stored and queried consistently across leads

**Dependencies**:
- **LES** — Provides lead schema and data model
- Engineering support for API ingestion from ad/form platforms
- BD pipelines (Coordinated, Priority One) must expose structured data endpoints

**Risks**:
- Naming convention misalignment (MEDIUM) → Mitigation: Marketing/Engineering alignment workshop, documented standards
- Legacy pipeline bypass (LOW) → Mitigation: Migration plan for manual imports

---

## Estimated Effort

**2–3 sprints**

- **Sprint 1**: Design — Data model mapping, attribution structure, API specs
- **Sprint 2**: Backend — API routing, validation, ingestion logic for all sources
- **Sprint 3**: QA/UAT — Attribution accuracy testing, end-to-end validation

---

## Proceed to PRD?

**YES** — LGI is foundational for ensuring all marketing, partnership, and organic leads are standardized. Critical dependency for accurate analytics and lifecycle tracking.

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
