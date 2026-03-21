---
title: "COL - 2329. Idea - Brief"
---


**Epic Code**: COL  
**Created**: 2026-01-14

## Problem Statement (What)

Deliver an **AR Invoice Visibility & Direct Debit Enrollment** capability for care packages, enabling recipients, coordinators, and finance teams to view contribution invoices from MyOB and streamline payment collection through Direct Debit mandates. Collections V1 focuses on read-only invoice visibility and DD enrollment for Support at Home go-live (Nov 2025), replacing manual AR workflows with a compliant, integrated system that improves payment timeliness and data accuracy.

## Possible Solution (How)

[Solution description needed]

## Benefits (Why)

**Effort & Timeline**: ~2.5-3 sprints total. Phase 1 (AR Invoice Visibility): 1.5 sprints (data model, MyOB sync, frontend pages). Phase 2 (DD Enrollment): 1-1.5 sprints (mandate model, 3-step modal, consent workflow). **Cost**: 2-3 dev squad members. **Target Launch**: Sept 2025 (pre-SAH go-live Nov 2025). **Benefits Realisation**: 40-50% reduction in manual AR tracking time. 70%+ DD adoption target within 3 months post-launch. Zero late-payment follow-ups for DD-enrolled packages. Improved NPS for financial transparency (target +10 points).

## Owner (Who)

[Owner to be assigned]

## Other Stakeholders (Accountable / Consulted / Informed)

**Owner**: TBD (Finance/Collections)**Product & Dev Teams** – Design, build, release**Finance & Operations** – AR process ownership, MyOB configuration**Recipient Services** – User acceptance, training materials**MyOB Integration Partner** – API and sync configuration**Compliance & Legal** – DD mandate compliance review

## Assumptions & Dependencies, Risks

### Assumptions
**Assumptions**: HCP-Contribution category accurately identifies all contribution invoices in MyOB. VIEW_FINANCIALS permission controls access to invoice and DD data. BSB/account validation rules follow Australian financial standards. MyOB API is available and stable for hourly sync. **Dependencies**: MyOB integration readiness (API-014). Direct Debit scheme compliance (APRA guidelines). Permission system implementation (PERM-006). Budget V2 completion for package reference data. **Risks**: MyOB sync delays could lead to stale invoice data; mitigate with fallback manual refresh. High DD enrollment failure rates if UX is unclear; mitigate with coordinator training and simplified 3-step flow. Regulatory changes to DD mandate requirements; mitigate with compliance review gate before launch.

### Risks
[Risks to be identified]

## Estimated Effort

[Effort estimate needed]

## Proceed to PRD?

Yes.
