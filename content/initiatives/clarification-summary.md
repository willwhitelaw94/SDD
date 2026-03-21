---
title: "Epic Spec Clarification Summary"
description: "Cross-portfolio analysis of 69 epic specifications with identified gaps, dependencies, and patterns"
---

# Epic Spec Clarification Summary

**Date**: 2026-03-21
**Analyst**: Requirements review pass across all initiative specs
**Total epics reviewed**: 69

---

## Portfolio Overview

| Initiative | Epic Count | High Priority Concerns |
|-----------|-----------|----------------------|
| ADHOC | 3 | CVI scope confusion (calendar vs CV), Intercom-to-BAU triage gap |
| Budgets & Finance | 14 | Heaviest cross-dependency cluster, multiple MYOB integration points, overlapping invoice/claims pipelines |
| Clinical & Care Plan | 13 | Duplicate specs (CLI vs Clinical Pathways/Cases), competing risk models (RRA vs RNC2), deep dependency chains |
| Consumer Lifecycle | 7 | Zoho dependency risk (LTH), agreement signing fragmentation across 3 epics |
| Consumer Mobile | 3 | MOB3 scope is 4-5 products in one spec, shared API surface with web portal unclear |
| Coordinator Management | 1 | Overlaps with CMA and CAP |
| Infrastructure | 6 | Feature flag org-level toggles are prerequisite for 5+ epics but deferred to fast-follow |
| Supplier Management | 17 | Most epics are thin/early-stage, multiple overlapping invoice processing concepts |
| Work Management | 5 | Thread vs Timeline vs Notes distinction unclear, activity logging spread across 3+ epics |

---

## Critical Cross-Epic Dependencies

### 1. MYOB Integration Hub (5+ epics)
Collections V1, Collections V2, Funding Reconciliation, Digital Statements, and Voluntary Contributions all depend on MYOB sync (webhooks, polling, or both). These should share a common MYOB integration layer to avoid 5 separate webhook implementations.

**Affected epics**: COL, COL2, FRR, DST, VCE

### 2. Services Australia API (4+ epics)
SAH API (Infrastructure), SAH Claims Process, Funding Reconciliation Phase 2, and Multi-Package Support all require direct SA API integration. The SAH API epic is the infrastructure foundation and has an immovable April 2026 deadline.

**Affected epics**: SAH, SCP, FRR, MPS

### 3. Agreement Signing Infrastructure (3+ epics)
Home Care Agreement signing is implemented independently in Client HCA (web), Consumer Mobile V1 (native), and Recipient Uplift (responsive web). All three need the same `RecipientAgreement` model, signature capture, and PDF generation.

**Affected epics**: Client HCA, MOB1, RCU

### 4. Feature Flag Organisation Scope (5+ epics)
Risk Radar, Future State Care Planning, Needs V2, Clinical Pathways/Cases, and Feature Flag Toggles all require per-organisation feature flags. The FFT epic defers organisation-level scope to a fast-follow (US3), but these epics need it for gradual rollout.

**Affected epics**: RRA, RNC2, Needs V2, CLI, FFT

### 5. Invoice Processing Pipeline (6+ epics)
AI Invoice V3, Invoice Reclassification, Invoices V2, On-Hold Bills, Portal Bill Submission, and Supplier Bill Submission all touch the invoice/bill processing pipeline. There is no clear canonical pipeline definition that these epics plug into.

**Affected epics**: AIV3, IRC, IV2, OHB, PBS, SBS

### 6. Budget Allocation Engine (4+ epics)
ATHM Funding Commitment, Budget Reloaded, Voluntary Contributions Enhancements, and Coordinator Budget Management all modify or depend on the budget allocation engine. Changes in one epic directly affect the others.

**Affected epics**: AFC, BUR, VCE, CBM

### 7. Teams & Permissions Infrastructure (2 epics, many consumers)
Teams Management (TMG) and Roles & Permissions Refactor (RAP) are tightly coupled. RAP cannot function without TMG. Multiple epics reference role-based access (Collections, VCE approval, Adjustment Management).

**Affected epics**: TMG, RAP, COL, VCE, FRR

---

## Duplicate and Overlapping Specs

### Confirmed Duplicates (need resolution)

1. **Clinical Portal Uplift (CLI) vs Clinical Pathways/Cases (CLI)**
   Both describe clinical case management with the same case types (Mandatory/Recommended/Self-Service), review lifecycle, and incident integration. The Clinical Pathways/Cases spec is more detailed and refined. The Clinical Portal Uplift spec should likely be deprecated.
   - **Contradictions**: CLI says closed cases can be reopened; Clinical Pathways says they cannot. CLI includes CRM migration; Clinical Pathways excludes it. CLI includes triage routing; Clinical Pathways defers it.

2. **Future State Care Planning (RNC2) vs Needs V2 Simplified Needs Module**
   Needs V2 is a subset of RNC2 Pillar 1. The content is nearly identical (same user stories, same acceptance criteria, same 14 Maslow categories). Needs V2 appears to be an extracted sub-spec but this relationship is not documented.

3. **Invoice Reclassification (IRC) vs AI Invoice V3 (AIV3)**
   Both address AI-assisted invoice classification with confidence scoring. IRC focuses on the workflow (classify-at-entry, learning loop). AIV3 focuses on the UI (chips, breadcrumbs, split recommendations). They appear to be the same feature described from different angles.

4. **Portal Bill Submission (PBS) vs Supplier Bill Submission (SBS)**
   Both cover supplier-facing bill submission through the portal. The boundary between them is unclear.

### Significant Overlaps (need boundary clarification)

5. **Digital Statements (DST) vs Digital Transactions (DTX)** -- Same data source, similar UI, could be one epic
6. **CV Integration (CVI) vs Calendar Integration (CIP)** -- Both address calendar sync for different audiences
7. **CM Activities (CMA) vs Coordination Audit Process (CAP)** -- Both log coordinator activities
8. **Supplier Audit Process (SAP) vs Supplier Service Verification (SVF)** -- Verification is a subset of auditing
9. **Search Service Provider (SSP) vs Service Booking (APA) vs MOB2 Service Discovery** -- Three epics for finding/booking services

---

## Common Patterns and Gaps

### Pattern 1: Missing Data Model Specifications
Many specs describe entities at a high level but lack schema detail. This creates risk of incompatible data models when multiple epics touch the same domain (e.g., billing, funding streams, agreements).

### Pattern 2: Audit Trail Proliferation
At least 8 epics independently implement audit logging (DOC, CCU, CLI, CAP, CMA, FRR, RAP, TMG). There is no shared audit infrastructure specification. Each epic designs its own audit schema, risking inconsistency.

### Pattern 3: Feature Flag Dependency Without Infrastructure
Five clinical epics require per-organisation feature flags, but the FFT epic defers this to a fast-follow. This creates a delivery bottleneck.

### Pattern 4: Notification System Fragmentation
The Email Templates & Notifications (ETN) epic proposes a unified notification system, but numerous epics (CBM, VCE, MPS, CLI, STP) define their own notification requirements. Without ETN being delivered first, each epic will implement notifications ad-hoc.

### Pattern 5: Thin Specs in Supplier Management
Several Supplier Management specs (Express-Pay, CareVicinity-Job-Posting, Optimising-Bill-Processing, QR-Code-Service-Confirmation, Search-Service-Provider) are early-stage with high-level descriptions and lack the depth of the Budgets & Finance or Clinical specs. These need significant refinement before development.

---

## Epics Needing Most Attention

### Tier 1: Resolve Before Development (blocking issues)

| Epic | Issue | Urgency |
|------|-------|---------|
| **Clinical Portal Uplift vs Clinical Pathways/Cases** | Duplicate specs with contradictions | Must resolve which is canonical |
| **Invoice Reclassification vs AI Invoice V3** | Overlapping scope, unclear boundary | Must merge or define boundary |
| **Future State Care Planning (RNC2)** | 2 unresolved NEEDS CLARIFICATION markers, risk model conflict with Risk Radar | Blocks data model design |
| **Package Level Upgrade (SHIP)** | 3 unresolved NEEDS CLARIFICATION markers (stages, data, types) | Cannot design or develop |
| **SAH API** | April 2026 immovable deadline, 4+ dependent epics | Critical path item |

### Tier 2: Clarify Before Design (scope/boundary issues)

| Epic | Issue |
|------|-------|
| **Funding Reconciliation (FRR)** | 37 FRs across 2 phases, 6 open questions marked "Needs Decision" |
| **Budget Reloaded (BUR)** | 20 user stories spanning UI, logic, rate cards, email -- needs phasing |
| **Multi-Package Support (MPS)** | High dependency count (LTH, Client HCA, SAH API, BUR) |
| **Inclusion Integration (ASS2)** | Complex engine with tight coupling to HMF/PSF supplier epics |
| **Consumer Mobile V3 (MOB3)** | 4-5 products in one spec (marketplace, AI, health devices, referrals) |

### Tier 3: Refine Before Planning (thin specs)

| Epic | Issue |
|------|-------|
| Express Pay | Business model undefined |
| CareVicinity Job Posting | API contract unknown |
| QR Code Service Confirmation | End-to-end flow unclear |
| Search Service Provider | Audience (staff vs consumer) undefined |
| Threads | Entity model (what is a thread?) undefined |
| Re-Assignment Rules | Scope of reassignment undefined |

---

## Recommendations

1. **Resolve duplicate specs immediately**: Deprecate Clinical Portal Uplift in favour of Clinical Pathways/Cases. Merge IRC and AIV3 or define explicit boundaries. Clarify PBS vs SBS ownership.

2. **Establish shared infrastructure epics**: Create explicit shared infrastructure for MYOB integration, agreement signing, and audit logging. These are implicit dependencies across 10+ epics.

3. **Unblock feature flag org-level scope**: Promote FFT US3 (Organisation Level) from "fast follow" to MVP. Five clinical epics are blocked without it.

4. **Define the canonical invoice pipeline**: Invoices V2 should be the definitive pipeline spec that IRC, AIV3, OHB, PBS, and SBS all reference as their integration point.

5. **Phase the mega-specs**: Budget Reloaded (20 stories), Funding Reconciliation (37 FRs), and MOB3 (8 products) each need phased delivery plans with explicit MVP scope.

6. **Resolve the risk model conflict**: RNC2 uses impact x likelihood scoring; Risk Radar uses consequence + mitigation = residual risk. Both claim to be the evidence-based approach recommended by Maryanne. One model must win before either is built.

7. **Enrich thin supplier specs**: Express Pay, CareVicinity Job Posting, QR Code, Search Service Provider, and several others need discovery sessions before they are development-ready.
