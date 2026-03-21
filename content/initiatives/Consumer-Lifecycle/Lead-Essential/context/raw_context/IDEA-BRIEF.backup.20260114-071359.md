---
title: "LES - 1. Idea Brief - Lead Essential"
---


**Epic Code**: LES  
**Created**: 2026-01-14

## Problem Statement (What)

Sales agents currently rely on fragmented tools (Zoho CRM and manual forms) to capture, manage, and convert leads. This creates inconsistent data, duplicated records, and poor visibility of the sales journey. A unified Lead module within the Portal is required to manage leads end-to-end — from creation and contact capture through to onboarding readiness — without external dependencies.

## Possible Solution (How)

Develop a **Lead Essentials module** in the Portal, introducing:• A **Leads List View** as the central workspace displaying all leads in structured, filterable tables.• A **Create Lead workflow** (internal and external) enforcing mandatory data (Lead Name, Email) and automatic assignment rules.• A **Lead Profile View** with persistent UI elements — Journey Stage bar, Lead Status actions, and Notes — across all tabs.• **Journey Stage and Lead Status wizards** to standardize updates and ensure mandatory data completion.• An **Overview Tab** summarizing lead identity, contact hierarchy, and assignment.• **Onboarding capture fields** (Cessation/Commencement Dates, Referral Codes, Management Type) to prepare for conversion to HCA. These form the foundation for later LTH ("Lead to HCA") automation.

## Benefits (Why)

Creates a **single source of truth** for all lead interactions, reducing reliance on Zoho CRM and manual spreadsheets.• Improves **data accuracy and compliance** by enforcing mandatory fields and structured updates via guided wizards.• Enables **real-time visibility** of the sales funnel via Journey Stage and Status indicators.• Lays the **technical groundwork for conversion workflows**, integrations, and automation (LTH, CRM sync).• Increases sales efficiency by minimizing friction and manual entry, aligning with Trilogy's digital transformation and self-service roadmap.

## Owner (Who)

_(Leave blank as instructed)_

## Other Stakeholders (Accountable / Consulted / Informed)

_(Leave blank as instructed — Accountable / Consulted / Informed roles will be assigned later)_

## Assumptions & Dependencies, Risks

### Assumptions
**Assumptions:**• Zoho Leads module integration will provide interim data sync until Portal fully replaces CRM.• The Journey Stage and Status models align with existing business reporting fields.**Dependencies:**• ZOHO integration for short-term sync of lead data.• Design dependency for consistent UI across persistent tabs and wizards.• Future dependency on LTH module for onboarding automation.**Risks:**• Data duplication if CRM and Portal run in parallel beyond transition period.• Misclassification risk if submitter/client logic is not validated correctly.

### Risks
[Risks to be identified]

## Estimated Effort

**Design:** ~1 sprint (UI for list view, profile, and wizards).**Development:** ~2–3 sprints for core CRUD, filtering, and onboarding fields.**Total:** ~3–4 sprints (≈$90k–$120k total dev cost).

## Proceed to PRD?

**Yes** — LES is foundational to all subsequent Lead and Package modules. It must precede LTH, LGI, and LDS for proper data model alignment.
