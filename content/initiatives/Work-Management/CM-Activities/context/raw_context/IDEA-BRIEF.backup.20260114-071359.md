---
title: "CMA - 1. Idea - Brief"
---


**Epic Code**: CMA  
**Created**: 2026-01-14

## Problem Statement (What)

Support at Home (SAH) requires ≥1 direct Care Management activity (CMA) per client per month (≥15 mins). In Trilogy's self-management model, clients operate independently, meaning natural monthly contact doesn't occur with all clients. This creates compliance risk and lost CM revenue while undermining proactive client engagement. Current processes (manual notes, calls, emails) are fragmented and reactive.

## Possible Solution (How)

Build a data-triggered communications system that ensures compliance and proactive engagement. Data Integration Layer (Databricks): analyse CRM, budget, incident, and utilisation data against trigger rules. Portal Alert Dashboard: queue of client alerts by care partner; shows trigger reason + draft comms; one-click approve/edit/reject. Communication Templates (MVP – 4 scenarios): service gap, fall incident, vulnerability (isolation/homelessness), budget overspend. Multi-channel delivery: email + SMS, routed to client preference, with delivery tracking. Activity logging: auto-create CM note with 15-min entry, linked to trigger, for audit/claims. Human oversight: all communications require care partner approval/edit before send (no AI personalisation in MVP).

## Benefits (Why)

Compliance: 100% monthly CM coverage. Revenue: Capture full 10% CM pool + vulnerable cohort allowances. Efficiency: Automated detection + drafting reduces manual gap checks. Client experience: Proactive, relevant outreach via preferred channel. Data quality: Triggered comms linked to evidence and audit trail.

## Owner (Who)

To be assigned – Product Owner / Care Operations lead

## Other Stakeholders (Accountable / Consulted / Informed)

Primary: Care Partners / Coordinators Other: Recipients & their representatives/supporters; Service Providers; Internal Finance, Compliance, and Operations teams

## Assumptions & Dependencies, Risks

### Assumptions
Databricks integration available for data processing. Reliable SMS + email delivery services in place. Portal infrastructure ready for alert dashboard + workflows. Client contact data accurate (representatives, preferences). Services Australia system stable; SAH requirements unchanged.

### Risks
Data quality issues → false/irrelevant alerts. Over-communication → client dissatisfaction. Integration complexity with Databricks, CRM, SMS. Staff adoption risk if alerts overwhelm or drafts need heavy editing. Compliance gaps if audit trail isn't watertight.

## Estimated Effort

[Effort estimate needed]

## Proceed to PRD?

Yes – directly tied to SAH requirements for monthly direct care management activity
