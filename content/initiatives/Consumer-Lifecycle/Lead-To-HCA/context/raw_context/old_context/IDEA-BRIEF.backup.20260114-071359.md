---
title: "LTH - 1. Idea - Brief"
---


**Epic Code**: LTH  
**Created**: 2026-01-14

## Problem Statement (What)

Once a lead is qualified and ready to convert, sales staff must currently manage onboarding, assessments, and agreements across disconnected tools — spreadsheets, Zoho, DocuSign, and manual follow-ups. This fragmented process leads to data duplication, compliance risks, and delayed activations. A unified conversion workflow is needed to move a verified lead into an active Home Care Package efficiently and with full regulatory traceability.

## Possible Solution (How)

Introduce a **Conversion Wizard** within the Portal that transforms a qualified lead into a client through a single guided flow. The wizard integrates: • **Prerequisite validation** — ensures all mandatory Lead data (Made Contact, onboarding, compliance) is complete. • **Stepper navigation** — sequential steps for Package Details, Dates, Recipients, ACAT/IAT extraction, and Agreement setup. • **Data automation** — prefills known information and enforces chronological and completeness checks. • **ACAT/IAT integration** — automatically retrieves or allows upload of assessment data via API. • **Digital Home Care Agreement** — generates, sends, and tracks agreement status through integrated e-signature and logs all actions to the Lead Timeline.

## Benefits (Why)

**Streamlines conversion** — cuts activation time by guiding staff through every required step in one flow.• **Ensures compliance** — validation prevents incomplete or out-of-sequence conversions.• **Improves accuracy** — prefilling data from LES eliminates re-entry and mismatched details.• **Enables automation** — provides a consistent structure for future auto-onboarding and direct API submissions.• **Enhances visibility** — all agreement, assessment, and activation actions are logged in the lead record for audit and reporting.

## Owner (Who)

_(blank)_

## Other Stakeholders (Accountable / Consulted / Informed)

_(blank – Accountable / Consulted / Informed to be assigned)_

## Assumptions & Dependencies, Risks

### Assumptions
**Dependencies:**• Relies on **LES (Lead Essential)** for data model, onboarding fields, and lead lifecycle management.• Requires integration readiness for ACAT/IAT APIs and e-signature service.**Assumptions:**• All sales leads have been captured and validated through the LES framework.• Agreement templates and compliance texts are finalized prior to go-live.**Risks:**• API unavailability may delay ACAT/IAT automation (manual upload fallback).• E-signature or compliance misconfiguration could delay onboarding.

### Risks
[Risks to be identified]

## Estimated Effort

**Design:** ~1 sprint (wizard flow, stepper UX, validation UI).**Development:** ~2–3 sprints (wizard logic, data sync, API integration).**Testing & QA:** ~1 sprint (validation, signature, data mapping).

## Proceed to PRD?

**Yes.** LTH is the natural successor to LES and operationalizes the lead conversion lifecycle — a prerequisite for downstream Billing, Client Portal, and Agreement management modules.
