---
title: "Idea Brief: Client HCA (HCA)"
description: "Consumer Onboarding > Client HCA"
icon: i-heroicons-light-bulb
navigation:
  order: 1
---

**Created**: 2026-01-14
**Epic Code**: HCA
**Initiative**: Consumer Onboarding (TP-1858)

---

## Problem Statement (What)

- New and transitioning clients sign Home Care Agreements (HCAs) outside the Portal (DocuSign/PDF or ad-hoc uploads)
- Friction at onboarding with inconsistent SLAs and weak auditability of consent artefacts
- No unified workflow for agreement states, reminders, or durable evidence of consent
- SAH scaling requires clear, guided in-Portal contracting experience

**Current State**: HCAs managed externally with fragmented audit trails; compliance gaps as client volume scales

---

## Possible Solution (How)

Create a new **Agreements** area in the Recipient Portal with:

- **HCA Section** — Pinned first, primary agreement type
- **Variations Section** — Management option or coordinator changes
- **Other Agreements** — ATHM, oxygen supply, TPC (cross-linked to Suppliers/Services)
- **State Model** — Sample (watermarked, pre-meeting) → Sent (actionable) → Signed; plus Terminated/Reactivate lifecycle
- **Consent Capture** — Digital in-Portal signature (preferred), upload signed PDF, or verbal consent with transcript + call ID
- **SLA & Reminders** — Automated reminders at T+24h, escalation at T+48h, with delivery logs
- **Annual Review** — Track next review due date, dashboard visibility, ahead-of-due notifications

```
// Before (Current)
1. HCA sent via DocuSign or PDF email
2. Signed document uploaded manually
3. No state tracking or reminders
4. Audit trail fragmented across systems

// After (With HCA)
1. Agreement generated in-Portal with state model
2. Digital signature or upload with validation
3. Automated reminders and escalation
4. Complete audit trail with consent artefacts
```

---

## Benefits (Why)

**User/Client Experience**:
- Guided first-login flow directs to Agreements if no Signed HCA exists
- Single place for HCA, variations, and other agreements

**Operational Efficiency**:
- Target median ≤24h from Sent→Signed with automated reminders
- Target ≥99% agreements with complete consent artefacts

**Business Value**:
- SAH compliance with standardised artefacts and immutable event logs
- Operational scale supporting thousands of clients on mobile and desktop

---

## Owner & Stakeholders

| Role | Person |
|------|--------|
| **R** | David Henry (PO, BA), Romy Blacklaw (PO), Beth Poultney (Des), Khoa Duong (Dev) |
| **A** | Nick Lunn |
| **C** | Erin Headley, Romy Blacklaw, Zoe Judd |
| **I** | — |

---

## Assumptions & Dependencies, Risks

**Assumptions**:
- Interim Zoho form/webhook bridging persists for controlled migration; long-term flow is Portal-native
- External identity/contact feeds (Services Australia / My Aged Care) may be incomplete; store durable IDs/links where available

**Dependencies**:
- E-signature service integration
- Document storage and retrieval infrastructure
- Portal IA conventions for list/detail views and facts panels

**Risks**:
- E-signature integration complexity (MEDIUM) → Mitigation: Template validation, staging environment testing
- Migration of historical HCAs (MEDIUM) → Mitigation: Phased import with verification
- Verbal consent compliance (LOW) → Mitigation: Minimum transcript + call ID requirements

---

## Estimated Effort

**~5–7 sprints**

- **Sprint 1**: Design & IA — Agreements tab, list/detail views, states, empty-states
- **Sprint 2–3**: Backend — Models (agreements, artefacts, states), file storage, APIs
- **Sprint 3–4**: Frontend — Lists, detail views, signing flows, upload & verbal-consent forms
- **Sprint 5**: SLA/Notifications & Audit — Schedulers, templates, logs/exports
- **Sprint 6**: Migration/Bridging — Historical HCA import, Zoho connectors, verification
- **Sprint 7**: QA/UAT & Hardening

---

## Proceed to PRD?

**YES** — HCA directly improves compliance and client onboarding experience. Foundation for SAH-mandated agreement workflows.

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
3. [ ] Create Jira epic (TP-1865)
4. [ ] Break down into user stories
