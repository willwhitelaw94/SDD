---
title: "Idea Brief: Multi-Package Support"
description: "Clinical And Care Plan > Multi Package Support"
icon: i-heroicons-light-bulb
navigation:
  order: 1
---

**Epic Code**: TP-2432 | **Updated**: 2026-02-25

---

## Problem Statement (What)

Clients qualify for multiple concurrent funding classifications from Services Australia, but Portal treats each client as having a single funding stream lifecycle. This causes:

**Pain Points:**
- Clients onboard with up to 5 funding streams but only 1 is tracked through the ACER lodgement process
- 60+ restorative care approvals were recently discovered only through an ad-hoc API check — no notification system exists
- Finance team manually works through a CRM report ("ACER to be lodged") with no visibility into which streams have been lodged per client
- ACER lodgement is tied to a single CR-ID per consumer in CRM's Consider module — cannot track multiple lodgements
- Funding is being withdrawn because ACERs are lodged after the take-up date, or with commencement dates in the wrong quarter
- Short-term pathway funding (AT, HM, Restorative Care, End of Life) goes unnoticed when approved after onboarding
- Some funding streams are being activated without client consent (regulatory risk)

**Demand Signal:** ~60 restorative care approvals undetected, 4 active EOL packages, multiple AT/HM clients in pipeline, material funding withdrawals from late ACER lodgement

**Example (Margaret):** Qualifies for Ongoing ($18k/quarter) + AT ($5k one-time). Zoho sends package level → Portal creates Ongoing only → SA confirms AT → Budget Coordinator manually adds → No ACER lodged for AT → Service delayed → Funding at risk of withdrawal.

---

## Possible Solution (How)

Three capabilities built on the existing single-package, multi-funding-stream data model:

### 1. Funding Stream Detection & Queue
- Nightly SA sync already detects new `PackageAllocation` records
- Surface new classifications in a dedicated "New Funding Streams" queue page
- Show: client name, existing streams, new classification(s), take-up deadline

### 2. Activation & Consent Workflow
- Coordinators review new streams and confirm client consent before activation
- RC/EOL require management model change acknowledgement + clinical care partner assignment
- Deferral option with take-up deadline reminders

### 3. ACER Lodgement Tracking
- Track ACER lodgement status per funding stream per client (Pending / Lodged / Not Required)
- Dedicated ACER Lodgement Queue for Finance, sorted by take-up deadline urgency
- Commencement date validation: block dates after take-up deadline, warn on first-week-of-quarter dates
- Finance lodges in PRODA manually, records lodgement in Portal (API automation is a future phase)

| Funding Stream | Type | Special Rules |
|----------------|------|---------------|
| **Ongoing (ON)** | Quarterly, ongoing | Default at onboarding, expires quarterly |
| **Restorative Care (RC)** | Short-term, 2 episodes/year | Requires fully coordinated, clinical care partner |
| **End of Life (EL)** | Once-in-a-lifetime, 3 months | Ongoing package goes dormant (not terminated) |
| **Assistive Technology (AT)** | 1-year funding period | First-time approval only triggers ACER |
| **Home Modifications (HM)** | Once-in-a-lifetime | First-time approval only triggers ACER |

---

## Benefits (Why)

- **Client**: No more accidentally activated funding that wastes limited approvals; timely service commencement
- **Finance**: Single queue replaces CRM report; per-stream ACER tracking eliminates missed lodgements
- **Operations**: Proactive detection of new classifications; no more manual discovery of 60+ missed approvals
- **Compliance**: Consent tracked before activation; commencement date validation prevents funding withdrawals
- **Business**: Preferred provider positioning for ATHM→Ongoing conversion; Growth team notified of new streams

---

## Owner & Stakeholders

| Role | Person |
|------|--------|
| **R** | Romy Blacklaw (PO), Jacqueline Palmer (PO), David Henry (BA), TBA (Des), Tim Maier (Dev), Matthew Allan (Dev) |
| **A** | Patrick Hawker |
| **C** | Finance Team (Brennan, Lydia, Jacob), Mathew Philip |
| **I** | Care Partners, Clinical Coordinators |

---

## Assumptions, Dependencies & Risks

**Assumptions:**
- Single package + multiple funding streams model (existing data model) — not multiple package records
- SA API nightly sync already detects new `PackageAllocation` records — MPS surfaces them, doesn't create a new integration
- Home Care Agreement already covers all funding stream types (per Romy, Feb 2026 meeting) — new streams require a budget, not a new agreement
- Manual ACER lodgement in PRODA first; API automation is a future phase

**Dependencies:**
- SAH API sync pipeline (existing — `SyncPackageFromServicesAustralia`)
- Lead to HCA (LTH) epic — captures primary + secondary classifications at point of sale
- Client HCA epic — agreement amendments when new streams are activated post-onboarding
- Budget Reloaded — budget generation per funding stream (already supports multiple)

**Risks:**
- ACER consent complexity (MEDIUM) → RC/EOL activation requires client conversation and management model change. Mitigated by activation workflow with required fields.
- Take-up date enforcement (HIGH) → Late lodgement causes material funding withdrawal. Mitigated by date validation and deadline-based queue sorting.
- Notification fatigue (LOW) → Too many notifications for funding changes. Mitigated by role-based filtering.

---

## Open Design Questions

1. ~~Care Circle: Shared across types or separate per type?~~ → Shared (from archived spec)
2. ~~Statements: Combined view or per-type or toggle?~~ → Toggle-able (from archived spec)
3. ~~Timeline: Show all types' events or primary only?~~ → Toggle between all/active (from archived spec)

*All three resolved during Dec 2025 spec review. See `context/raw_context/spec-archived-2026-01-27.md`.*

---

## Success Metrics

- Zero funding streams missed — 100% detected within 24 hours of SA approval
- Zero ACERs lodged after take-up deadline (system-enforced validation)
- Finance queue replaces CRM report — all pending lodgements in one view
- RC/EOL activations always have clinical care partner assigned (100% compliance)
- Bills routed to correct funding stream >99% first attempt

---

## Estimated Effort

**M (Medium) — 3-4 sprints**

- Sprint 1: Funding stream detection queue + notification system
- Sprint 2: Activation workflow (consent, RC/EOL care partner, deferral)
- Sprint 3: ACER lodgement tracking queue + commencement date validation
- Sprint 4: Package view multi-stream display + testing + edge cases

---

## Decision

- [x] **Approved** — Proceed to specification
- [ ] **Needs More Information**
- [ ] **Declined**

---

## Next Steps

1. ~~`/speckit-specify` — Create spec~~ ✅ Done (2026-02-25)
2. `/trilogy-clarify spec` — In progress (spec lens clarification)
3. `/trilogy-clarify business` — Align on business objectives
4. `/trilogy-design` → Design decisions
5. `/speckit-plan` → Technical plan

---

## Context

- **Spec**: [spec.md](spec.md)
- **ACER Lodgement Meeting (Feb 2026)**: [context/raw_context/acer-lodgement-meeting-2026-02.json](context/raw_context/acer-lodgement-meeting-2026-02.json)
- **Teams Chat (Jan 2026)**: [context/raw_context/teams-chat-2026-01-27.md](context/raw_context/teams-chat-2026-01-27.md)
- **Archived Spec (Dec 2025)**: [context/raw_context/spec-archived-2026-01-27.md](context/raw_context/spec-archived-2026-01-27.md)
- **Context README**: [context/README.md](context/README.md)
