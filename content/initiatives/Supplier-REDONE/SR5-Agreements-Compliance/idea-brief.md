---
title: "Idea Brief: Agreements & Compliance"
---

# Idea Brief: Agreements & Compliance

**Created**: 2026-03-19
**Author**: Will Whitelaw

---

## Problem Statement (What)

- **Service agreements are static and one-directional** — the current APA signing flow is a take-it-or-leave-it PDF. Suppliers cannot request amendments, negotiate clauses, or propose variations through the portal. Every amendment requires manual back-and-forth over email, which creates version control issues and delays service commencement
- **TPC agreements have no digital workflow** — Third Party Contractor agreements are managed entirely offline (paper forms, email attachments). There is no linkage between a TPC agreement and the consumer/care package it relates to, making audit trails incomplete
- **Self-termination and reactivation is a manual process** — when a supplier needs to pause or end their relationship, it requires direct contact with compliance. There is no risk-tiered workflow, so low-risk terminations (e.g., temporary pause with valid documents) consume the same compliance team effort as high-risk ones
- **Compliance monitoring is reactive, not proactive** — there is no integration with AHPRA, NDIS banning orders, aged care banning orders, or AFRA registers. Suspended or banned suppliers can continue submitting invoices until someone manually flags the issue
- **Fraud detection is disconnected** — EFTSure data exists but is not surfaced in the supplier portal or staff workflows. Bank detail changes and suspicious patterns require manual cross-referencing ("Operation Onion Slot" fraud task force created as a workaround)
- **Notification gaps create compliance risk** — expiry reminders for insurance, agreements, and credentials are inconsistent. Approval/denial notifications exist but are incomplete, and there is no clear separation between operational notifications (which suppliers must receive) and optional communications

**Current State**: Agreements are managed via `SupplierAgreementController` with a sign-once APA flow. The agreement is rendered from a Blade template with pre-populated supplier data and signed digitally. Once signed, there is no amendment, variation, or termination workflow. Compliance monitoring relies on manual checks by the QA/compliance team. EFTSure fraud indicators are available but not integrated into the supplier lifecycle. Self-termination has been partially built (targeting Mar 2 release) with 15 criteria, but the risk-tiered reactivation workflow is not yet in the portal.

---

## Possible Solution (How)

Build the **Agreements & Compliance** layer for the supplier portal, covering the full lifecycle from agreement signing through ongoing compliance monitoring, self-termination, and fraud prevention.

- **APA variation and amendment process**: A dual-sided interface where suppliers can request amendments and TC staff can respond. Locked clauses (non-negotiable terms Sophie is defining) are visually distinguished from negotiable clauses. AI-assisted drafting helps suppliers compose amendment requests. Special conditions clauses capture contract deviations in a structured way
- **TPC agreement management**: Suppliers upload TPC agreements linked to specific consumers and care packages. Downloadable draft TPC templates (matching the APA draft download pattern). Internal approval workflow with linkage tracking
- **Risk-tiered self-termination**: Suppliers initiate termination through a guided flow that classifies the reason against 15 criteria into three risk tiers:
  - Low-risk: immediate processing with automatic reactivation if documents remain valid
  - Conditional: QA review required with automated email to QA/compliance team
  - High-risk: must contact compliance directly (portal blocks self-service)
- **Compliance register integration**: Automated checks against AHPRA practitioner register, NDIS banning order register, aged care banning order register, and AFRA data. Automatic payment blocks on suspended/banned suppliers with supplier notification explaining the hold
- **EFTSure fraud indicators**: Green/yellow/red fraud risk indicators surfaced on supplier profiles and during bank detail changes. Integration with the fraud task force workflow
- **Compliance notification system**: Expiry and renewal reminders for insurance, agreements, and credentials. Approval/denial email templates (Zoe finalising). Operational notifications that suppliers cannot disable. Credentialing matrix integration for document requirements

```
// Agreement Lifecycle
Draft APA → Sign → Active → Amendment Request → Review → Updated APA
                          → Expiry Warning → Renewal → Re-signed
                          → Termination Request → Risk Assessment → Low/Conditional/High

// Compliance Monitoring
Register Check (AHPRA/NDIS/Aged Care/AFRA) → Clean ✓ / Flagged ✗
Flagged → Payment Block → Supplier Notified → Resolution Required
EFTSure Check → Green ✓ / Yellow ⚠ / Red ✗ → Fraud Review
```

---

## Benefits (Why)

**For Suppliers**:
- Self-service agreement amendments instead of email back-and-forth — estimated 2-3 week reduction in amendment turnaround
- TPC agreement upload and tracking without paper forms
- Self-service termination and reactivation for low-risk scenarios — no waiting for compliance team availability
- Proactive notifications about expiring documents before they lapse

**For Trilogy Care Operations**:
- Compliance team freed from low-risk termination processing — estimated 60-70% of terminations are low-risk and can be fully automated
- Automatic payment blocks on banned/suspended suppliers eliminate the risk window between register update and manual detection
- Structured amendment process creates an auditable trail of agreement changes (currently lost in email threads)
- Credentialing matrix enforcement ensures suppliers maintain required documents without manual chasing

**For Compliance/QA**:
- Real-time integration with government registers replaces periodic manual checks
- EFTSure fraud indicators surface risk before payments are processed, not after
- Conditional terminations route directly to the QA team with context, reducing triage time

**ROI**: Reduced compliance team workload (estimated 15-20 hours/week on manual agreement/termination processing) + eliminated fraud risk window + reduced agreement amendment cycle time from weeks to days. Primary strategic value is **completing the compliance layer** of the supplier portal rebuild — without SR5, the portal cannot enforce agreement and regulatory requirements.

---

## Owner (Who)

| Role | Person | Responsibility |
|------|--------|----------------|
| **Accountable** | Will Whitelaw (Head of Digital) | Epic owner, architecture decisions |
| **Responsible** | Engineering team (TBD) | Implementation |
| **Consulted** | Sophie Pickett (Compliance — APA clauses), Rudy Chartier (Self-termination criteria/templates), Zoe Judd (Notification templates), Erin (APA process), Megan (QA review workflow) |
| **Informed** | Supplier Operations team, Finance (payment block impacts) |

---

## Other Stakeholders

- **Sophie Pickett** — defining locked vs negotiable clauses for APA; credentialing matrix review
- **Rudy Chartier** — self-termination criteria, reactivation email templates, risk tier definitions
- **Zoe Judd** — approval/denial notification email templates (awaiting final input)
- **Erin** — APA variation process, dual-sided interface requirements
- **Megan** — QA review workflow for conditional terminations
- **Fraud task force** — EFTSure integration requirements, "Operation Onion Slot" workflow
- **Existing suppliers (~13,000)** — will see new agreement amendment, termination, and notification features

---

## Assumptions & Dependencies, Risks

**Assumptions**:
- Sophie will provide the locked vs negotiable clause list before design begins
- The 15 self-termination criteria and risk tier classifications are finalised (Dec 17 meeting)
- EFTSure API access is available and provides green/yellow/red indicators programmatically
- AHPRA, NDIS, aged care, and AFRA banning order registers have public or API-accessible data
- Zoe will finalise approval/denial email templates before notification system build
- The credentialing matrix will be stable enough to encode as rules (currently under review)
- Existing `SupplierAgreementController` APA signing flow can be extended rather than replaced

**Dependencies**:
- **SR0 (API Foundation)** — token-based auth and API v2 infrastructure required
- **SR1 (Registration & Onboarding)** — supplier must be registered before agreements apply
- **SR2 (Profile & Org Management)** — supplier profile and organisation structure must exist for agreement linkage
- Existing `Agreement` model and `CreateServiceAgreement` action (already in codebase)
- EFTSure API credentials and integration agreement
- Government register API access (AHPRA, NDIS, aged care banning orders)

**Risks**:
- **Government register API availability** (HIGH) — AHPRA and banning order registers may not have stable public APIs. Mitigation: research API availability early; fallback to periodic batch imports if real-time integration is not feasible
- **Locked clause definition delays** (MEDIUM) — Sophie's clause list is a prerequisite for the amendment interface. Mitigation: build the amendment framework first with placeholder clause categorisation; swap in real data when available
- **EFTSure integration complexity** (MEDIUM) — fraud detection integration may require custom middleware and data mapping. Mitigation: spike EFTSure API early; use manual indicator override as interim solution
- **Credentialing matrix instability** (MEDIUM) — the matrix is under active review and may change. Mitigation: build credentialing rules as configuration, not hard-coded logic
- **Self-termination scope creep** (LOW) — 15 criteria with three risk tiers and multiple reactivation paths is complex. Mitigation: ship low-risk tier first as MVP, add conditional and high-risk in subsequent iterations

---

## Estimated Effort

| Metric | Value |
|--------|-------|
| **Size** | L (Large) |
| **Confidence** | Medium |

**Key Drivers**: APA amendment dual-sided interface, TPC upload workflow, self-termination risk tiers, government register integrations, EFTSure fraud indicators, notification system, credentialing matrix rules

**Phases**:
- **Phase 1**: APA amendment process + TPC agreement upload (foundation agreement workflows)
- **Phase 2**: Self-termination with risk-tiered reactivation (low-risk first, then conditional/high-risk)
- **Phase 3**: Compliance register integration + EFTSure fraud indicators (AHPRA, banning orders, payment blocks)
- **Phase 4**: Notification system + credentialing matrix enforcement (expiry reminders, operational notifications)

---

## Proceed to PRD?

**YES** — SR5 addresses critical compliance and regulatory requirements that the supplier portal cannot operate without. The current manual processes for agreement amendments, self-termination, and compliance monitoring create operational bottlenecks and regulatory risk. Dependencies (SR0, SR1, SR2) are already specified and in progress. Key stakeholder inputs (Sophie's clause list, Rudy's termination criteria, Zoe's email templates) are in flight. A spec has been drafted with 8 user stories, 20 functional requirements, and 10 success criteria.

---

## Decision

- [ ] **Approved** - Proceed to PRD
- [ ] **Needs More Information** - [What's needed?]
- [ ] **Declined** - [Reason]

**Approval Date**: ---

---

## Next Steps

**If Approved**:
1. [ ] Run `/trilogy-idea-handover` --- Gate 0 (create epic in Linear under Supplier REDONE initiative)
2. [ ] Review and finalise the [spec](/initiatives/Supplier-REDONE/SR5-Agreements-Compliance/spec) --- 8 user stories drafted
3. [ ] Confirm Sophie's locked/negotiable clause list is available
4. [ ] Confirm Zoe's email templates are finalised
5. [ ] Spike government register API availability (AHPRA, NDIS, aged care banning orders)
6. [ ] Spike EFTSure API integration requirements
7. [ ] Run `/speckit-plan` --- Technical architecture plan
