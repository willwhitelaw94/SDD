---
title: "Business Alignment: Supplier Registration & Onboarding"
---

# Business Alignment: Supplier Registration & Onboarding

**Epic**: SR1
**Date**: 2026-03-19
**Owner**: Will Whitelaw (Head of Digital)

---

## 1. Business Objectives

SR1 tackles the biggest supplier lifecycle problem at Trilogy Care: **8,000 of 13,000 supplier profiles are incomplete or not started**. The current registration and onboarding flow is flat, confusing, breaks on mobile, and gives suppliers no visibility into where they stand.

Specific business outcomes:

- **Increase onboarding completion** — redesign the step-by-step flow with clear progress indicators, mobile support, and actionable rejection feedback to move the ~8,000 incomplete profiles toward completion.
- **Enable multi-supplier registration** — Organisation Administrators can add new supplier entities under the same ABN without staff intervention, eliminating the manual profile creation bottleneck.
- **Reduce time-to-activation** — streamlined lite verification path (automated document checks + EFTSure green) gets straightforward suppliers verified in under 48 hours instead of the current days-to-weeks.
- **Improve compliance pipeline** — structured heavy verification flow with document-level rejection and resubmission gives the Compliance team a clear pipeline instead of a pile of "pending" suppliers.
- **Subcontractor compliance at point of entry** — APA signing during onboarding ensures subcontractors are compliant before they deliver services, not after.

---

## 2. Success Metrics

| KPI | Target | Baseline | Measurement Method |
|-----|--------|----------|--------------------|
| Onboarding completion rate | > 60% within 14 days of registration | ~38% (5K complete out of 13K profiles) | `SupplierOnboarding` timestamps vs `created_at` |
| Registration completion (ABN to Organisation created) | > 90% | Unknown (no funnel tracking) | Registration API funnel analytics |
| Time to VERIFIED (lite path) | < 48 hours | Days to weeks (manual process) | Portal stage transition timestamps |
| Time to VERIFIED (heavy path) | < 7 days | Weeks (no structured flow) | Portal stage transition timestamps |
| Mobile onboarding completion | Within 10% of desktop rate | Significantly lower (iPhone failures reported) | Device-segmented funnel analytics |
| Multi-supplier orgs using Tier 2 | > 50 organisations with 2+ entities within 6 months | 0 (not possible today) | Organisation/Supplier entity count |
| Onboarding support tickets | 30% reduction within 3 months | Current ticket volume (baseline from Supplier Ops) | Support ticket categorisation |
| Compliance rejection turnaround | < 3 business days (rejection to resubmission) | Unmeasured (no structured flow) | Document status transition timestamps |

---

## 3. ROI Analysis

### Costs

| Item | Estimate |
|------|----------|
| API endpoints (registration, onboarding, verification) | ~$60K-$80K (3-4 weeks x 2 devs) |
| Frontend (registration flows, onboarding wizard, progress indicators) | ~$60K-$80K (3-4 weeks x 2 devs) |
| EFTSure integration (3-stage bank verification) | ~$15K-$20K (1-2 weeks) |
| Verification flows (lite + heavy pathways) | ~$30K-$40K (2 weeks) |
| Migration tooling for existing 13K profiles | ~$10K-$15K (1 week) |
| QA and mobile testing | ~$15K-$25K (1-2 weeks) |
| **Total estimated cost** | **$190K-$260K** (10-14 weeks with SR0 complete) |

### Benefits

| Benefit | Annual Value | Rationale |
|---------|-------------|-----------|
| Increase active supplier base | $200K-$400K/year | Moving onboarding completion from 38% to 60%+ means ~2,800 additional active suppliers who can bill and be matched to recipients. Each active supplier represents revenue throughput. |
| Reduce manual onboarding support | $60K-$90K/year | Supplier Ops team currently handles onboarding queries, manual profile creation for multi-supplier orgs, and "where am I in the process" calls. 30% ticket reduction is conservative. |
| Faster supplier activation | $50K-$100K/year | Lite verification in 48 hours (vs days/weeks) means suppliers start delivering services sooner, improving service coverage for recipients. |
| Eliminate duplicate profile management | $30K-$50K/year | Multi-supplier self-service registration eliminates manual duplicate creation and reconciliation. |
| Reduced compliance risk | Risk avoidance | Subcontractor APA at onboarding, structured document verification, and clear rejection flow reduce the risk of unverified suppliers delivering services. |

### Payback Period

**6-10 months.** The combination of increased active supplier base, reduced support burden, and faster activation delivers $340K-$640K annually against a $190K-$260K investment.

---

## 4. Stakeholder Impact

| Stakeholder | Impact | Change Required |
|-------------|--------|-----------------|
| **New suppliers** | Completely new registration and onboarding experience. ABN-first registration, step-by-step progress, mobile-friendly, clear verification status. | Must complete the new flow (not the old one). |
| **Existing incomplete suppliers (~8,000)** | Will see their partial progress preserved in the new system. Reminder emails at 3, 7, and 14 days. New progress indicator shows exactly what remains. | Return to onboarding and complete remaining steps. |
| **Multi-supplier organisations** | Can add new supplier entities self-service via Tier 2 registration. Organisation-level documents (public liability, ABN verification, workers comp) shared across entities. | Learn the "Add Supplier Entity" workflow from the org dashboard. |
| **Supplier Operations (Cassandra's team)** | Major workload reduction. Fewer "how do I register?" calls, no manual profile creation for multi-supplier orgs, structured verification pipeline instead of "pending" pile. | New verification pipeline tools. Training on lite vs heavy flow. |
| **Compliance team (Sophie Pickett)** | Structured heavy verification flow with document-level rejection. Clear pipeline view instead of ad hoc reviews. EFTSure 3-stage indicators visible on dashboard. | Define document requirements by supplier type/service. Adopt new review workflow. |
| **Vishal (UX)** | Onboarding progress indicator redesign (already in backlog) gets implemented. | Finalise design for progress indicator component. |

---

## 5. Risk to Business

### If we don't do this

- **8,000 supplier profiles remain incomplete.** The 38% onboarding completion rate continues, meaning a significant portion of registered suppliers never become active. This limits Trilogy Care's service delivery capacity.
- Multi-supplier organisations remain stuck with manual processes, driving support tickets and frustration.
- Mobile onboarding remains broken on iPhone, excluding a growing segment of suppliers who operate primarily from mobile devices.
- Verification remains a black box. Suppliers have no visibility into their status, leading to repeated support queries and compliance team operating reactively.
- Subcontractors may start delivering services before signing the APA, creating compliance exposure.

### If we do this badly

- **Migration breaks existing profiles** — if the transition from the old onboarding flow corrupts progress for the 5,000 complete or 4,000 partially complete profiles, it creates a support crisis and supplier trust damage. Mitigation: migration script with dry-run mode, parallel-run period.
- **Mobile still broken** — if mobile usability issues (iPhone business verification failures) are not resolved, the "mobile-first" promise falls flat. Mitigation: dedicated mobile QA pass, device-specific testing.
- **Verification bottleneck shifts** — if the heavy verification flow is too complex, the Compliance team becomes the new bottleneck instead of the system. Mitigation: clear state machine, maximum rejection cycles, escalation to Supplier Ops.
- **EFTSure dependency** — if EFTSure API has downtime or changes, bank verification blocks the entire pipeline. Mitigation: graceful degradation with manual verification fallback.

---

## 6. Dependencies on Other Epics

| Direction | Epic | Dependency |
|-----------|------|------------|
| **SR1 depends on** | SR0 (API Foundation) | Token-based auth (no session dependency), Organisation/Supplier entity model, two-tier role hierarchy, v2 API structure |
| **SR1 depends on** | SR5 (Agreements & Compliance) — partial | APA agreement templates (SR1 handles the signing step; SR5 manages the agreement lifecycle) |
| **SR1 depends on** | External: EFTSure API | Bank verification for 3-stage flow |
| **SR1 depends on** | External: ABR API | ABN validation and business name lookup |
| **Depends on SR1** | SR2 (Profile & Org Management) — soft | SR2 can start in parallel with SR0, but the "Add Supplier Entity" flow in SR2 redirects to SR1's onboarding wizard |
| **Depends on SR1** | SR3+ (Pricing, Billing, etc.) | Suppliers must be onboarded and verified before they can use pricing, billing, or compliance features |

SR1 is the **first consumer-facing epic** after the foundation. It directly determines how quickly suppliers become active and start generating value on the platform.

---

## 7. Go/No-Go Criteria

Before starting SR1 development, the following must be true:

- [ ] **SR0 API Foundation delivered** — token-based auth, Organisation/Supplier entity model, and v2 API endpoints are deployed and tested. SR1 cannot function without SR0.
- [ ] **EFTSure integration confirmed** — existing EFTSure API contract and access verified. 3-stage verification rules documented and approved by Compliance (Sophie).
- [ ] **ABR API integration validated** — existing `useAbnLookup` composable confirmed compatible with v2 API, or adaptation plan agreed.
- [ ] **Document requirements defined** — Sophie Pickett and Compliance have provided the document requirement matrix by supplier type and service category. Without this, the Documents onboarding step cannot be built.
- [ ] **Onboarding progress indicator design finalised** — Vishal's redesign (currently in backlog) is complete and approved. This is a core UX element.
- [ ] **Migration plan for 13K existing profiles** — strategy for transitioning existing complete, partial, and not-started profiles to the new system is documented and dry-run tested. No data loss acceptable.
- [ ] **Mobile testing strategy agreed** — dedicated device testing plan for iPhone and Android to resolve the known mobile verification failures.
- [ ] **Lite vs heavy verification rules agreed** — Compliance has defined the criteria for which suppliers go through lite (automated) vs heavy (manual review) verification.
