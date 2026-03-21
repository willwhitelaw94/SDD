---
title: "Idea Brief: Lead to HCA (LTH)"
description: "Consumer Onboarding > Lead To HCA"
icon: i-heroicons-light-bulb
navigation:
  order: 1
---

**Created**: 2026-01-27
**Updated**: 2026-02-09
**Epic Code**: LTH
**Initiative**: Consumer Lifecycle (TP-1858)
**Jira Epic**: TP-2012

---

## Problem Statement (What)

**Current State** (validated Feb 2026 with Sales & Assessment teams):

- **Fragmented conversion workflow**: Zoho CRM convert button → Manual PUSH form → Portal webhook → Manual follow-ups → High churn (was 14%, improved to <6% with faster turnaround)
- **Single funding stream capture**: Only primary stream (highest value) captured at point of sale; additional streams buried in care plan notes → missed activations, unpaid invoices, compliance risk
- **Late agreement signing**: Home Care Agreement sent as sample before meeting, then signed post-meeting → delays activation, contributes to churn
- **Zoho as source of truth during conversion**: Data scattered across Zoho modules, PUSH form, and Portal → no single point of truth
- **Manual data entry duplication**: Same information entered in multiple places (Zoho lead, PUSH form, Portal)
- **No funding stream lifecycle tracking**: Applications, approvals, and exits not tracked systematically → manual effort, missed opportunities

**Impact**: Churn, lost revenue, compliance risk, operational inefficiency, incomplete client funding picture

---

## Solution (How)

**Portal takes over conversion entirely** — replacing BOTH Zoho's convert button AND the PUSH form with a unified 4-step Portal Conversion Form.

### Architecture Overview

```
PRE-CONVERSION                          CONVERSION                          POST-CONVERSION
─────────────                          ──────────                          ───────────────
Zoho CRM (Lead Mgmt)    ────►    Portal 4-Step Form    ────►    Portal (Source of Truth)
  • Sales captures lead              • Replaces Zoho convert              • Package active
  • Preferred mgmt option            • Replaces PUSH form                 • Consumer + Care Plan
  • Two-way sync to Portal           • Continuous sync TO Zoho              synced to Zoho
                                     • Portal becomes source of truth    → Handoff to Client HCA
```

### 4-Step Conversion Form

| Step | Name | Purpose |
|------|------|---------|
| **1** | Conversion Essentials | Identifiers, primary classification, dates, preferred management option, representative, attribution |
| **2** | Risk Assessment Outcome | Receive risk score from Assessment Tool (external) — gates rest of flow |
| **3** | Questionnaire | Client details, funding & financial, Calendly meeting booking |
| **4** | Agreement | Management option confirmed, signature capture (verbal/digital/manual) |

### External Dependencies

| Tool | What It Does | Output to LTH Flow |
|------|--------------|-------------------|
| **Assessment Tool** | IAT upload, screening questions, AI eligibility analysis | Risk Score Outcome |
| **Calendly** | Meeting booking | Meeting Date/Time |

### Continuous Sync (Portal → Zoho API)

Each step syncs immediately — not batched at the end:

| Sync | Trigger | Zoho Action |
|------|---------|-------------|
| **#1** | Step 1 complete | Convert Lead → Consumer, create Care Plan |
| **#2** | Step 2 complete | Update Care Plan with risk outcome |
| **#3** | Step 3 complete | Update Consumer + Care Plan with client/scheduling data |
| **#4** | Step 4 complete | Finalize agreement, create Deal record |

### Risk Score Flow

```
Risk Score Outcome
       │
       ├──► SUITABLE FOR EVERYTHING (~98%)
       │        │
       │        ▼
       │    Management Option = Preferred
       │    Actual HCA sent → Signature capture
       │
       ├──► NEEDS CLINICAL ATTENTION (~2%)
       │        │
       │        ▼
       │    Sample HCA sent (not signable)
       │    Clinical Nurse Call
       │        │
       │        ├──► Cleared for Preferred → Agreement unlocked
       │        ├──► SM+ Required → Agreement unlocked (SM+ locked in)
       │        └──► Not Suitable → STOP
       │
       └──► NOT SUITED (rare) → STOP
```

### Key Terminology

| Term | Definition | Where Used |
|------|------------|------------|
| **Preferred Management Option** | What client *wants* if given choice | Lead data |
| **Management Option (Confirmed)** | What client *actually gets* based on risk outcome | Agreement data |

---

## Benefits (Why)

**Revenue & Compliance**:
- **Capture all funding streams at onboarding** → Eliminate missed activations (opt-out consent model)
- **Unified source of truth** → Portal owns conversion data, syncs to Zoho
- **Earlier agreement signing** → Target 60% uptake before meeting (vs 0% current)

**Churn Reduction**:
- **Streamlined conversion** → Single 4-step flow replaces fragmented Zoho + PUSH + webhook
- **Faster activation** → Continuous sync creates Zoho records immediately
- **~98% sign immediately** → Risk-cleared clients proceed without delay

**Operational Efficiency**:
- **Single data entry point** → No more duplicating data across systems
- **Assessment Tool handles IAT** → Screening logic moved out of conversion form
- **Clear handoff to clinical** → ~2% flagged clients routed to Clinical Review Index

---

## Owner & Stakeholders

| Role | Person |
|------|--------|
| **R** | David Henry (PO, BA), Beth Poultney (Des), Khoa Duong (Dev) |
| **A** | Nick Lunn |
| **C** | Romy Blacklaw, Jacqueline Palmer |
| **I** | — |

---

## Scope

### In Scope

1. **Portal 4-Step Conversion Form** — Replaces Zoho convert + PUSH form
2. **Assessment Tool Integration** — Receive Risk Score Outcome (external app)
3. **Calendly Integration** — Meeting booking embedded in Step 3
4. **Continuous Sync to Zoho** — Create Consumer, Care Plan, Deal via API
5. **Agreement Signature Capture** — Verbal (audio upload), Digital (email), Manual (PDF)
6. **Clinical Review Path** — Sample HCA flow for ~2% flagged clients
7. **Classification Consent** — Opt-out model (default: consent to all)
8. **First Instance (Sales)** — Full conversion flow
9. **Second Instance (Clinical)** — Agreement unlock after clinical review

### Out of Scope (Deferred to Client HCA Epic)

| Item | Reason |
|------|--------|
| Exit vs Terminate | Post-conversion lifecycle |
| Existing Clients: New Funding Streams | Managing active consumers |
| Agreement Amendments | Post-onboarding changes |
| ACER Lodgement Automation | Nightly poll, post-conversion |

---

## Assumptions & Dependencies

**Assumptions**:
- Lead data already synced to Portal via existing two-way sync
- Assessment Tool exists and returns Risk Score Outcome via API/callback
- Calendly integration patterns established
- Agreement templates and verbal consent scripts finalized

**Dependencies**:
- **Assessment Tool** — External app for IAT extraction + screening (must be built/available)
- **Calendly** — Meeting booking service
- **Zoho API** — Consumer, Care Plan, Deal module write access
- **E-signature service** — For digital signature path
- **Audio upload** — For verbal consent recording

---

## Estimated Effort

**6–8 sprints** (includes Assessment Tool integration and Zoho API sync)

**Key phases**:
1. Foundation/Design (1–2 sprints)
2. Step 1 + Sync #1 (1 sprint)
3. Step 2 + Assessment Tool integration + Sync #2 (1–2 sprints)
4. Step 3 + Calendly + Sync #3 (1 sprint)
5. Step 4 + Signature flows + Sync #4 (1 sprint)
6. QA/UAT/Rollout (1 sprint)

---

## Risks

| Risk | Severity | Mitigation |
|------|----------|------------|
| Assessment Tool not ready | HIGH | Define clear API contract, can stub for testing |
| Zoho API rate limits | MEDIUM | Batch where possible, implement retry logic |
| Verbal consent legal requirements | MEDIUM | Confirm script and recording retention with legal |
| Clinical Review Index workflow | MEDIUM | Design in parallel with main flow |

---

## Decision

- [ ] **Approved** - Proceed to PRD (spec.md)
- [ ] **Needs More Information**
- [ ] **Declined**

**Approval Date**: ____
**Approver**: ____

---

## Next Steps

**If Approved**:
1. [ ] Create PRD (spec.md) from 4-step form specification
2. [ ] Define Assessment Tool API contract
3. [ ] Map Zoho API endpoints for Consumer, Care Plan, Deal
4. [ ] Design Clinical Review Index (for ~2% flagged clients)
5. [ ] Confirm verbal consent legal requirements
6. [ ] Break down into user stories per step

---

## Rich Context Documents

Detailed specifications are in [context/rich_context/](context/rich_context/):

| Document | Contents |
|----------|----------|
| [LTH General Context](context/rich_context/LTH%20General%20Context.md) | Architecture overview, system flow |
| [Consolidated Conversion Form Fields](context/rich_context/Consolidated%20Conversion%20Form%20Fields.md) | Complete 4-step field specification |
| [Conversion Sync-Back Flow](context/rich_context/Conversion%20Sync-Back%20Flow.md) | Portal → Zoho API field mapping |
| [Risk Score First Management Option Flow](context/rich_context/Risk%20Score%20First%20Management%20Option%20Flow.md) | Risk outcome decision tree |
| [Agreement Signature Flow](context/rich_context/Agreement%20Signature%20Flow.md) | Verbal/Digital/Manual signature paths |
| [Classification Data Model](context/rich_context/Classification%20Data%20Model.md) | SA Mirror vs TC Actions model |

---

## Re-Spec History

**Feb 2026 Re-Spec**: Complete architectural shift — Portal now owns conversion entirely (replaces Zoho convert + PUSH form). Added 4-step form structure, continuous sync model, Assessment Tool as external dependency, and clinical review path. See [_resume_prompt.md](context/rich_context/_resume_prompt.md) for re-spec context.
