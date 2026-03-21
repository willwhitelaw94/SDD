---
title: "1. Idea Brief – Client Home Care Agreement (HCA)"
---


**Epic Code**: HCA  
**Created**: 2026-01-14

## Problem Statement (What)

New and transitioning clients are signing Home Care Agreements (HCAs) outside the Portal (e.g., DocuSign/PDF or ad-hoc uploads). This creates friction at onboarding, inconsistent SLAs, and weak auditability of consent artefacts—especially as Support at Home (SAH) scales. Clients need a clear, guided in-Portal contracting experience with states, reminders, and durable evidence of consent.

## Possible Solution (How)

Create a new **Agreements** area in the Recipient Portal hosting three sections: **HCA** (pinned first), **Variations** (e.g., management option or coordinator changes), and **Other Agreements** (ATHM, oxygen supply, and **TPC**). Introduce a **state model** and consent capture patterns: * **State model:** **Sample** (watermarked, non-offer, pre-meeting) → **Sent** (actionable) → **Signed**; plus **Terminated/Reactivate** lifecycle events. Post-meeting gating flips Sample→Sent. First-login redirect to Agreements if no Signed HCA exists. * **Consent capture:** 1. **Digital in-Portal signature** (preferred), 2. **Upload signed PDF** (manual path), 3. **Verbal consent** with **minimum transcript + call ID** (audio link preferred) stored or durably linked on the agreement record. * **TPC placement:** Keep **TPC** within **Other Agreements** (Agreements tab) for consistency; optionally cross-link to Suppliers/Services for context later. * **SLA & reminders:** Automated reminders at T+24h and escalation at T+48h for "Sent" items, with delivery logs and audit trail. * **Annual review:** Track next review due date, show in dashboards, and notify ahead of due dates. The solution follows the **latest PRD/Confluence structure** and Portal IA conventions for list/detail views, facts panels, and auditability.

## Benefits (Why)

* **Reduced time-to-contract:** Guided first-login flow, gating from Sample→Sent, and automated reminders shorten the path to signature. Target median **≤24h** from Sent→Signed. * **Compliance & audit strength:** Standardised artefacts (digital/PDF/verbal) with durable storage/links and immutable event logs; target **≥99%** agreements with complete consent artefacts. * **Operational scale for SAH:** Centralised Agreements area, clear states, and lifecycle visibility support thousands of clients on mobile and desktop. * **Experience consistency:** One place for HCA, variations, and other agreements (incl. TPC), improving discoverability and reducing handoffs.

## Owner (Who)

[Owner to be assigned]

## Other Stakeholders (Accountable / Consulted / Informed)

[Stakeholders to be defined]

## Assumptions & Dependencies, Risks

### Assumptions
**Assumptions & Dependencies** * Interim **Zoho** form/webhook bridging persists for a controlled migration; long-term flow is Portal-native. * External identity/contact feeds (Services Australia / My Aged Care) may be incomplete; store durable IDs/links where available. * UX patterns, tables, and PRD formatting align to current **Confluence PRD/Idea Brief templates**. **Risks** * **Evidence gaps** if transcript/call ID or audio links aren't captured reliably (mitigate with required fields, validations). * **SLA non-compliance** if reminder/escalation policy isn't enforced or contact data is inaccurate (mitigate with templated comms + contact data uplift). * **Migration complexity** when backfilling historic agreements and linking artefacts; plan for scripts, QA, and staged cutover.

### Risks
[Risks to be identified]

## Estimated Effort

* **Design & IA:** Agreements tab (list/detail, states, empty-states) — ~1 sprint * **Backend:** Models (agreements, artefacts, states), file storage, APIs — ~1–2 sprints * **Frontend:** Lists, detail views, signing flows, upload & verbal-consent forms — ~1–2 sprints * **SLA/Notifications & Audit:** schedulers, templates, logs/exports — ~0.5–1 sprint * **Migration/Bridging:** historical HCA import, Zoho connectors, verification — ~0.5–1 sprint * **QA/UAT & Hardening:** ~0.5–1 sprint (Indicative; refine after technical discovery and dependency confirmation.)

## Proceed to PRD?

**Yes.** (PRD to include detailed user stories, acceptance criteria, permissions, audit/export, migration plan, and milestone plan consistent with the latest template.)
