---
title: "Design: Agreements & Compliance"
---

# Design: Agreements & Compliance

**Epic**: SR5-Agreements-Compliance
**Initiative**: Supplier REDONE
**Created**: 2026-03-19
**Status**: Draft
**Spec**: [spec.md](/initiatives/supplier-redone/sr5-agreements-compliance/spec)

---

## User Context

| Aspect | Decision | Impact on Design |
|--------|----------|------------------|
| **Primary User** | Supplier Administrator (signs APA, uploads TPCs, manages compliance) | Needs clear agreement status, guided flows, no legal confusion |
| **Secondary User** | Compliance Team (reviews amendments, monitors registers, manages credentialing) | Needs dashboard-level visibility, bulk actions, risk-sorted views |
| **Device Priority** | Desktop-first (legal documents, compliance dashboards) | Full-width layouts for agreement text, multi-column for dashboards |
| **Usage Frequency** | Periodic (signing: once; amendments: occasional; compliance: continuous monitoring) | Agreement signing must be frictionless. Compliance dashboard is daily-use for staff. |
| **Context** | Suppliers want to get compliant and stay compliant with minimal effort. Compliance team needs to catch issues before they become problems. | Guide suppliers through steps. Surface risks early for staff. |

---

## Design Principles

**North Star:** Compliance should feel like protection, not paperwork.

**Supporting Principles:**
1. **Guide, don't gate** — Walk suppliers through agreement signing and termination with clear steps, not walls of text
2. **Risk at a glance** — Compliance staff see red/yellow/green across all suppliers without drilling in
3. **Lock what's locked** — Visually distinguish non-negotiable from negotiable clauses so suppliers never waste time on the wrong thing
4. **No silent failures** — Every expiry, flag, and status change triggers a notification. Nothing slips through quietly.

---

## Build Size

**Size:** Extra Large

**Rationale:**
- APA viewer with scroll-tracking and digital signature
- APA amendment dual-sided interface with AI drafting
- TPC upload flow with consumer/package linkage
- Self-termination guided flow (15 criteria, 3 risk tiers)
- Reactivation flow with eligibility and document checks
- Compliance dashboard (EFTSure, government registers, document expiry)
- Notification preferences page with mandatory/optional classification
- Credentialing matrix configuration (compliance staff)

---

## Scope

### MVP (P1)
- **US1**: APA viewing and digital signing
- **US2**: APA amendment interface (locked/negotiable clauses, AI drafting)
- **US3**: TPC upload with consumer/package linkage

### Phase 2 (P2)
- **US4**: Self-termination flow (15 criteria, risk tiers, reactivation)
- **US5**: Government register checks (AHPRA, NDIS, aged care, AFRA)
- **US6**: EFTSure fraud indicators on supplier profiles
- **US7**: Compliance notifications (expiry alerts, mandatory notifications)

### Phase 3 (P3)
- **US8**: Credentialing matrix configuration

### Feature Flags
- `supplier-apa-signing` — Gates APA viewer and digital signing (US1)
- `supplier-apa-amendments` — Gates amendment interface and AI drafting (US2)
- `supplier-tpc-upload` — Gates TPC upload and management (US3)
- `supplier-self-termination` — Gates self-termination and reactivation flows (US4)
- `compliance-register-checks` — Gates government register integration (US5)
- `compliance-eftsure` — Gates EFTSure indicator display (US6)
- `compliance-credentialing-matrix` — Gates matrix configuration (US8)

---

## Constraints

### Technical
- Standalone React (Next.js) frontend with shadcn/ui + Tailwind
- TC brand: Navy `#2C4C79` primary, Teal `#007F7E` accent
- v2 API with token-based auth
- APA is signed per supplier entity, not per organisation (Q1 decision)
- TPCs linked to consumer + care package, independent of APA version (Q5 decision)
- Government register checks: AHPRA per worker, banning/AFRA per entity + key personnel (Q3 decision)

### Business Rules
- Termination is per supplier entity — siblings unaffected (Q2 decision)
- Reactivation window: 12 months from termination (Q4 decision)
- After 12 months: must go through SR1 re-onboarding
- Operational notifications (agreement, compliance, payment) cannot be disabled (FR-019)
- Most restrictive register result applies — any single flag triggers payment block (edge case)

### Accessibility
- WCAG AA target
- Agreement text must be readable at default font size, no horizontal scroll
- Colour indicators (EFTSure green/yellow/red) must include text labels
- Sign button must not be activatable until agreement is scrolled/reviewed
- Keyboard navigation for all flows

---

## Page-by-Page Design

### 1. Agreement Viewer & Signing (`/agreements`)

**Full agreement text with scroll tracking. Sign button activates after reading.**

```
┌──────────────────────────────────────────────────────────────────┐
│  Agreements                                                      │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─ Approved Provider Agreement (v3.2) ──────────────────────┐  │
│  │  Status: Awaiting Signature                                │  │
│  │  Your details have been pre-populated from your profile.   │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌─ Agreement Text ───────────────────────────────────────────┐ │
│  │                                                             │ │
│  │  APPROVED PROVIDER AGREEMENT                                │ │
│  │                                                             │ │
│  │  Between: Trilogy Care Pty Ltd                              │ │
│  │  And:     ABC Allied Health Services                        │ │
│  │  ABN:     12 345 678 901                                    │ │
│  │  Address: 123 Main St, Brisbane QLD 4000                    │ │
│  │                                                             │ │
│  │  1. DEFINITIONS                                             │ │
│  │  1.1 "Approved Provider" means...                           │ │
│  │  1.2 "Services" means...                                    │ │
│  │                                                             │ │
│  │  2. SCOPE OF SERVICES                                       │ │
│  │  2.1 The Provider agrees to deliver...                      │ │
│  │                                                             │ │
│  │  ...                                                        │ │
│  │                                                             │ │
│  │  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  ← scroll bar    │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  ┌─ Reading Progress ────────────────────────────────────────┐  │
│  │  ████████████████████░░░░░░░░░░  68% — Keep scrolling     │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌─ Digital Signature ───────────────────────────────────────┐  │
│  │                                                            │  │
│  │  Signer Name:     [Jane Smith            ]                 │  │
│  │  Position:        [Director              ]                 │  │
│  │                                                            │  │
│  │  Signature:       ┌────────────────────────┐               │  │
│  │                   │                        │               │  │
│  │                   │   [Draw signature]     │               │  │
│  │                   │                        │               │  │
│  │                   └────────────────────────┘               │  │
│  │                                                            │  │
│  │  ☐ I confirm I have read and agree to the terms above.     │  │
│  │                                                            │  │
│  │                            [Sign Agreement]  (disabled)    │  │
│  │                            ↑ Enabled when 100% scrolled    │  │
│  │                              + checkbox ticked             │  │
│  └────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────┘
```

**Reading progress behaviour:**
- First-time signing: Full scroll tracking with progress bar. Sign button enabled at 100% scroll + checkbox.
- APA renewal (supplier has signed a prior version): Show a "Changes from v3.1" diff summary at the top highlighting what changed. Scroll tracking disabled — supplier can sign directly after reviewing changes and ticking the checkbox. This respects repeat users' time while maintaining compliance for new agreements.

**Post-signing view (already signed):**
```
┌──────────────────────────────────────────────────────────────────┐
│  ┌─ Approved Provider Agreement (v3.2) ──────────────────────┐  │
│  │  Status: ✓ Signed                                          │  │
│  │  Signed by: Jane Smith (Director)                          │  │
│  │  Signed on: 19 Mar 2026 at 2:34 PM AEST                   │  │
│  │                                               [Download]   │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
│  [View Agreement Text]  [Request Amendment]                      │
└──────────────────────────────────────────────────────────────────┘
```

---

### 2. APA Amendment Interface (`/agreements/amendments`)

**Two-panel layout: left panel = clause table of contents with locked/negotiable icons; right panel = selected clause text. Locked clauses greyed, negotiable clauses editable. AI draft assist.**

**Layout:** The left panel shows a scrollable table of contents listing all clauses with their locked (lock icon) or negotiable (pencil icon) status. Clicking a clause loads its full text in the right panel. This is the standard pattern for legal document browsing and allows quick navigation of long APAs.

```
┌──────────────────────────────────────────────────────────────────┐
│  Agreement Amendments                          [+ New Amendment]  │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  APA v3.2 — ABC Allied Health Services                           │
│                                                                  │
│  ┌─ Clause Browser ──────────────────────────────────────────┐  │
│  │                                                            │  │
│  │  1. DEFINITIONS                                   🔒 Locked│  │
│  │  ┌────────────────────────────────────────────────────┐   │  │
│  │  │  1.1 "Approved Provider" means a provider who...   │   │  │
│  │  │  1.2 "Services" means the aged care services...    │   │  │
│  │  │                                                    │   │  │
│  │  │  ░░░░░░░░░░░░░ (greyed out — non-negotiable) ░░░░ │   │  │
│  │  └────────────────────────────────────────────────────┘   │  │
│  │                                                            │  │
│  │  2. SCOPE OF SERVICES                             🔒 Locked│  │
│  │  ┌────────────────────────────────────────────────────┐   │  │
│  │  │  ░░░░░░░░░░░░░ (greyed out — non-negotiable) ░░░░ │   │  │
│  │  └────────────────────────────────────────────────────┘   │  │
│  │                                                            │  │
│  │  5. PRICING & RATES                           ✏ Negotiable│  │
│  │  ┌────────────────────────────────────────────────────┐   │  │
│  │  │  5.1 Standard hourly rates for services shall be   │   │  │
│  │  │  as set out in Schedule A...                        │   │  │
│  │  │                                                    │   │  │
│  │  │                              [Request Amendment]   │   │  │
│  │  └────────────────────────────────────────────────────┘   │  │
│  │                                                            │  │
│  │  8. SPECIAL CONDITIONS                        ✏ Negotiable│  │
│  │  ┌────────────────────────────────────────────────────┐   │  │
│  │  │  8.1 The Provider may request special conditions    │   │  │
│  │  │  subject to mutual agreement...                     │   │  │
│  │  │                                                    │   │  │
│  │  │                              [Request Amendment]   │   │  │
│  │  └────────────────────────────────────────────────────┘   │  │
│  └────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────┘
```

**Amendment request dialog (with AI drafting):**

```
┌──────────────────────────────────────────────────────────────────┐
│  Request Amendment — Clause 5.1: Pricing & Rates                 │
│                                                                  │
│  ┌─ Current Clause ──────────────────────────────────────────┐  │
│  │  "Standard hourly rates for services shall be as set out  │  │
│  │   in Schedule A, reviewed annually on the anniversary of  │  │
│  │   the Agreement commencement date."                       │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
│  Your Justification:                                             │
│  [We are requesting a rate increase due to rising operational  ] │
│  [costs and CPI adjustments since the agreement was signed.   ] │
│                                                                  │
│  ┌─ AI Draft Assist ─────────────────────────────────────────┐  │
│  │  🤖 Suggested amendment language:                          │  │
│  │                                                            │  │
│  │  "Standard hourly rates for services shall be as set out  │  │
│  │   in Schedule A, subject to annual CPI adjustment applied │  │
│  │   automatically on the anniversary of the Agreement       │  │
│  │   commencement date, with any additional rate changes      │  │
│  │   subject to mutual written agreement."                    │  │
│  │                                                            │  │
│  │  [Use This Draft]  [Edit Draft]  [Write My Own]            │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
│  Your Proposed Change:                                           │
│  [Standard hourly rates for services shall be as set out in   ] │
│  [Schedule A, subject to annual CPI adjustment applied        ] │
│  [automatically on the anniversary of the Agreement           ] │
│  [commencement date...                                        ] │
│                                                                  │
│                               [Cancel]  [Submit Amendment]       │
└──────────────────────────────────────────────────────────────────┘
```

**Amendment decision model (compliance side):**
Three outcomes available to compliance staff:
- **Approve** — Clause updated as proposed. Supplier notified.
- **Approve with modifications** — Compliance edits the proposed text and sends back. Supplier sees the modified clause and must explicitly acknowledge it before it takes effect. This avoids multiple decline/resubmit round-trips.
- **Decline** — Reason provided. Supplier can submit a new amendment request.

**Amendment history (below clause browser):**

```
┌─ Amendment History ──────────────────────────────────────────┐
│                                                              │
│  ┌─ Clause 5.1 — 12 Feb 2026 ────────────────────────────┐ │
│  │  Status: ✓ Approved                                    │ │
│  │  Original: "...reviewed annually..."                   │ │
│  │  Approved: "...subject to annual CPI adjustment..."    │ │
│  │  Decided by: Sarah Chen (TC Compliance) — 18 Feb 2026 │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌─ Clause 8.1 — 5 Jan 2026 ─────────────────────────────┐ │
│  │  Status: ✕ Declined                                    │ │
│  │  Proposed: "...exclusive territory clause..."          │ │
│  │  Reason: "Exclusivity not available under current..."  │ │
│  │  Decided by: Mark Johnson (TC Compliance) — 12 Jan    │ │
│  └────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────┘
```

---

### 3. TPC Upload Flow (`/agreements/tpc`)

**Upload TPC linked to a consumer and care package.**

```
┌──────────────────────────────────────────────────────────────────┐
│  Third Party Contractor Agreements                               │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  [Download Draft TPC Template]                                   │
│                                                                  │
│  ┌─ Your TPC Agreements ─────────────────────────────────────┐  │
│  │ ┌──────────────┬──────────────┬────────────┬────────────┐ │  │
│  │ │ Consumer     │ Care Package │ Uploaded   │ Status     │ │  │
│  │ ├──────────────┼──────────────┼────────────┼────────────┤ │  │
│  │ │ Smith, John  │ QY-566392    │ 15 Mar '26 │ ✓ Approved │ │  │
│  │ │ Jones, Mary  │ QY-441283    │ 10 Mar '26 │ ◐ Review   │ │  │
│  │ │ Lee, Karen   │ QY-338291    │ —          │ — None     │ │  │
│  │ └──────────────┴──────────────┴────────────┴────────────┘ │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
│                                            [+ Upload TPC]        │
└──────────────────────────────────────────────────────────────────┘
```

**TPC Upload dialog:**

```
┌──────────────────────────────────────────────────────────────────┐
│  Upload TPC Agreement                                            │
│                                                                  │
│  Consumer:      [Select consumer ▾]                              │
│                 Lee, Karen                                       │
│                                                                  │
│  Care Package:  [Select care package ▾]                          │
│                 QY-338291 — Home Care Level 3                    │
│                                                                  │
│  TPC Document:  ┌──────────────────────────────────────┐        │
│                 │                                      │        │
│                 │  📄 Drop TPC document here            │        │
│                 │     or [Browse Files]                 │        │
│                 │                                      │        │
│                 │  Accepted: PDF, DOC, DOCX             │        │
│                 └──────────────────────────────────────┘        │
│                                                                  │
│                                    [Cancel]  [Upload TPC]        │
└──────────────────────────────────────────────────────────────────┘
```

---

### 4. Self-Termination Flow (`/account/termination`)

**Guided multi-step flow. Reason selection determines risk tier and next steps.**

#### Step 1: Select Reason

```
┌──────────────────────────────────────────────────────────────────┐
│  End Engagement                                                  │
│                                                                  │
│  Step 1 of 3: Select Reason                                      │
│  ●───────────○───────────○                                       │
│  Reason      Confirm      Complete                               │
│                                                                  │
│  This applies to: ABC Allied Health — Brisbane                   │
│  (Your other supplier entities will not be affected.)            │
│                                                                  │
│  Why are you ending your engagement?                             │
│                                                                  │
│  ┌─ Business Reasons ────────────────────────────────────────┐  │
│  │  ○ Closing or selling the business                         │  │
│  │  ○ Relocating outside service area                         │  │
│  │  ○ Changing industry / no longer providing aged care       │  │
│  │  ○ Temporary pause in operations                           │  │
│  │  ○ Reducing service capacity                               │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌─ Relationship Reasons ────────────────────────────────────┐  │
│  │  ○ Dissatisfied with partnership terms                     │  │
│  │  ○ Found alternative arrangement                           │  │
│  │  ○ Payment or billing disputes                             │  │
│  │  ○ Administrative burden too high                          │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌─ Compliance Reasons ──────────────────────────────────────┐  │
│  │  ○ Unable to meet credentialing requirements               │  │
│  │  ○ Insurance or certification lapsed                       │  │
│  │  ○ Regulatory issue or investigation                       │  │
│  │  ○ Staffing shortages preventing service delivery          │  │
│  │  ○ Quality concerns raised by TC                           │  │
│  │  ○ Other (please specify)                                  │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
│                                               [Cancel] [Next →]  │
└──────────────────────────────────────────────────────────────────┘
```

#### Step 2: Risk Tier Outcome

**Low-risk path:**
```
┌──────────────────────────────────────────────────────────────────┐
│  End Engagement                                                  │
│                                                                  │
│  Step 2 of 3: Confirm                                            │
│  ●───────────●───────────○                                       │
│  Reason      Confirm      Complete                               │
│                                                                  │
│  Reason: Temporary pause in operations                           │
│                                                                  │
│  ┌─ What Happens Next ───────────────────────────────────────┐  │
│  │                                                            │  │
│  │  Your supplier entity will be deactivated immediately.     │  │
│  │                                                            │  │
│  │  • You will not be able to submit bills                    │  │
│  │  • Existing submitted bills will continue to be processed  │  │
│  │  • Your compliance documents will be preserved             │  │
│  │                                                            │  │
│  │  ✓ You can reactivate within 12 months if your documents   │  │
│  │    remain current and approved.                            │  │
│  │                                                            │  │
│  │  ⚠ After 12 months, you will need to re-register as a     │  │
│  │    new supplier.                                           │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ☐ I understand this will deactivate my supplier entity.         │
│                                                                  │
│                              [← Back] [Confirm Termination]      │
└──────────────────────────────────────────────────────────────────┘
```

**Conditional path:**
```
┌──────────────────────────────────────────────────────────────────┐
│  Step 2 of 3: Under Review                                       │
│                                                                  │
│  Reason: Payment or billing disputes                             │
│                                                                  │
│  ┌─ Review Required ─────────────────────────────────────────┐  │
│  │                                                            │  │
│  │  This termination reason requires a review by our          │  │
│  │  compliance team before it can be processed.               │  │
│  │                                                            │  │
│  │  • Your account remains active during the review           │  │
│  │  • You will be contacted by our QA team within 5 days     │  │
│  │  • You can continue submitting bills in the meantime       │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
│  Additional context (optional):                                  │
│  [________________________________________]                      │
│  [________________________________________]                      │
│                                                                  │
│                       [← Back] [Submit for Review]               │
└──────────────────────────────────────────────────────────────────┘
```

**Post-termination portal experience:**
After self-termination, the supplier entity is redirected to a dedicated "Terminated" landing page. This page shows:
- Reactivation CTA (primary action) with eligibility window countdown
- Entity name and termination date
- Links to view historical bills and agreements (read-only)
- "Start New Registration" link (shown after 12 months)
All other portal navigation for that entity is disabled. Sibling entities remain fully accessible if the supplier has multiple entities.

**High-risk path:**
```
┌──────────────────────────────────────────────────────────────────┐
│  Step 2 of 3: Contact Required                                   │
│                                                                  │
│  Reason: Regulatory issue or investigation                       │
│                                                                  │
│  ┌─ ⚠ Cannot Self-Terminate ─────────────────────────────────┐  │
│  │                                                            │  │
│  │  This termination reason requires direct discussion with   │  │
│  │  our compliance team. Self-service termination is not      │  │
│  │  available for this reason.                                │  │
│  │                                                            │  │
│  │  Please contact:                                           │  │
│  │  📧 compliance@trilogycare.com.au                          │  │
│  │  📞 1300 000 000 (option 3)                                │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
│                                              [← Back] [Close]    │
└──────────────────────────────────────────────────────────────────┘
```

---

### 5. Reactivation Flow (`/account/reactivation`)

**Available to terminated supplier entities within 12 months.**

```
┌──────────────────────────────────────────────────────────────────┐
│  Reactivate Supplier Entity                                      │
│                                                                  │
│  ABC Allied Health — Brisbane                                    │
│  Terminated: 19 Mar 2026 (0 days ago)                            │
│  Reactivation available until: 19 Mar 2027                       │
│                                                                  │
│  ┌─ Document Validity Check ─────────────────────────────────┐  │
│  │                                                            │  │
│  │  ✓ Public Liability Insurance      Expires: 30 Nov 2026   │  │
│  │  ✓ Professional Indemnity          Expires: 15 Dec 2026   │  │
│  │  ✓ Workers Compensation            Expires: 1 Jul 2026    │  │
│  │  ✕ AHPRA Registration              Expired: 1 Feb 2026    │  │
│  │                                                            │  │
│  │  ⚠ 1 document has expired. Please upload a renewed         │  │
│  │    version before reactivation can proceed.                │  │
│  │                                                            │  │
│  │  AHPRA Registration: [Upload Renewal]                      │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
│  [Reactivate Now]  (disabled until all documents valid)          │
│                                                                  │
│  ── or ──                                                        │
│                                                                  │
│  Past the 12-month window? [Start New Registration →]            │
└──────────────────────────────────────────────────────────────────┘
```

---

### 6. Compliance Dashboard (`/compliance` — staff view)

**Compliance team overview of all supplier compliance status. Tabbed layout with summary cards always visible above tabs.**

**Layout:** Summary stat cards (Flagged, Warnings, Clear, Pending) are pinned above the tab bar. Three tabs below: "EFTSure", "Register Checks", "Document Expiry". Each tab contains its own filterable table. This avoids scroll fatigue on a single long page while keeping the at-a-glance summary always visible.

```
┌──────────────────────────────────────────────────────────────────┐
│  Compliance Dashboard                                            │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─ Summary ─────────────────────────────────────────────────┐  │
│  │                                                            │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐ │  │
│  │  │ 🔴 12    │  │ 🟡 28    │  │ 🟢 185   │  │ ⏳ 8     │ │  │
│  │  │ Flagged  │  │ Warnings │  │ Clear    │  │ Pending  │ │  │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘ │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌─ EFTSure Status ──────────────────────────────────────────┐  │
│  │                                                            │  │
│  │  ┌────────────────────┬──────────┬──────────┬───────────┐ │  │
│  │  │ Supplier           │ EFTSure  │ Last     │ Action    │ │  │
│  │  │                    │ Status   │ Checked  │           │ │  │
│  │  ├────────────────────┼──────────┼──────────┼───────────┤ │  │
│  │  │ ABC Allied Health  │ 🟢 Green │ 18 Mar   │ —         │ │  │
│  │  │ XYZ Home Services  │ 🟡 Yellow│ 17 Mar   │ Review    │ │  │
│  │  │ Quick Care Pty Ltd │ 🔴 Red   │ 19 Mar   │ Blocked   │ │  │
│  │  │ Best Health Co     │ ⏳ Pending│ Checking │ —         │ │  │
│  │  └────────────────────┴──────────┴──────────┴───────────┘ │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌─ Government Register Flags ───────────────────────────────┐  │
│  │                                                            │  │
│  │  ┌────────────────────┬──────────┬──────────┬───────────┐ │  │
│  │  │ Supplier / Worker  │ Register │ Result   │ Action    │ │  │
│  │  ├────────────────────┼──────────┼──────────┼───────────┤ │  │
│  │  │ Quick Care Pty Ltd │ NDIS Ban │ ⚠ Flagged│ Payment   │ │  │
│  │  │                    │          │          │ Blocked   │ │  │
│  │  │ J. Roberts (worker)│ AHPRA    │ ⚠ Susp.  │ Payment   │ │  │
│  │  │ @ ABC Allied       │          │          │ Blocked   │ │  │
│  │  │ Best Health Co     │ AFRA     │ ✓ Clear  │ —         │ │  │
│  │  └────────────────────┴──────────┴──────────┴───────────┘ │  │
│  │                                                            │  │
│  │  Last full check run: 18 Mar 2026    [Run Check Now]       │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌─ Document Expiry Alerts ──────────────────────────────────┐  │
│  │                                                            │  │
│  │  ┌────────────────────┬──────────────────┬──────┬───────┐ │  │
│  │  │ Supplier           │ Document         │ Days │ Alert │ │  │
│  │  ├────────────────────┼──────────────────┼──────┼───────┤ │  │
│  │  │ ABC Allied Health  │ Public Liability │ 7    │ 🔴    │ │  │
│  │  │ XYZ Home Services  │ Prof. Indemnity  │ 14   │ 🟡    │ │  │
│  │  │ Quick Care Pty Ltd │ Workers Comp     │ 28   │ 🟡    │ │  │
│  │  └────────────────────┴──────────────────┴──────┴───────┘ │  │
│  └────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────┘
```

**EFTSure indicator states:**
- `🟢 Green` — Low risk. No action required. Displayed as green badge with "Verified" text.
- `🟡 Yellow` — Medium risk. Bank detail changes flagged for additional review. Amber badge with "Review Required" text.
- `🔴 Red` — High risk. Bank detail changes and payments blocked. Red badge with "Blocked" text.
- `⏳ Pending` — Check in progress or API unavailable. Grey badge with "Pending" text. Staff can manually override with audit trail.

**Government register check results on supplier profile:**

```
┌─ Government Register Status ─────────────────────────────────┐
│                                                              │
│  AHPRA (Workers)                                             │
│  ┌───────────────────────┬──────────┬───────────────────┐   │
│  │ Worker                │ Status   │ Last Checked      │   │
│  ├───────────────────────┼──────────┼───────────────────┤   │
│  │ J. Roberts (PHY001)   │ ⚠ Susp.  │ 19 Mar 2026       │   │
│  │ S. Chen (NUR042)      │ ✓ Active │ 19 Mar 2026       │   │
│  └───────────────────────┴──────────┴───────────────────┘   │
│                                                              │
│  Entity & Key Personnel Checks                               │
│  ┌───────────────────────┬──────────┬───────────────────┐   │
│  │ Register              │ Status   │ Last Checked      │   │
│  ├───────────────────────┼──────────┼───────────────────┤   │
│  │ NDIS Banning Orders   │ ✓ Clear  │ 18 Mar 2026       │   │
│  │ Aged Care Banning     │ ✓ Clear  │ 18 Mar 2026       │   │
│  │ AFRA                  │ ✓ Clear  │ 18 Mar 2026       │   │
│  └───────────────────────┴──────────┴───────────────────┘   │
│                                                              │
│  ⚠ Payment block active — AHPRA suspension for J. Roberts   │
└──────────────────────────────────────────────────────────────┘
```

---

### 7. Notification Preferences (`/settings/notifications`)

**Supplier-facing. Operational notifications mandatory, optional ones toggleable.**

```
┌──────────────────────────────────────────────────────────────────┐
│  Notification Preferences                                        │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─ Operational (Mandatory) ─────────────────────────────────┐  │
│  │                                                            │  │
│  │  These notifications cannot be disabled. They are          │  │
│  │  required for compliance and payment processing.           │  │
│  │                                                            │  │
│  │  Agreement Events                         Email  In-App    │  │
│  │  ├ APA renewal required                   ✓ 🔒   ✓ 🔒     │  │
│  │  ├ Amendment decision                     ✓ 🔒   ✓ 🔒     │  │
│  │  └ TPC approval/denial                    ✓ 🔒   ✓ 🔒     │  │
│  │                                                            │  │
│  │  Compliance Events                                         │  │
│  │  ├ Document expiring (30/14/7 days)       ✓ 🔒   ✓ 🔒     │  │
│  │  ├ Government register flag               ✓ 🔒   ✓ 🔒     │  │
│  │  └ Payment block applied/lifted           ✓ 🔒   ✓ 🔒     │  │
│  │                                                            │  │
│  │  Payment Events                                            │  │
│  │  ├ Bill approved/rejected/on hold         ✓ 🔒   ✓ 🔒     │  │
│  │  ├ Bill paid                              ✓ 🔒   ✓ 🔒     │  │
│  │  └ Express Pay status change              ✓ 🔒   ✓ 🔒     │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌─ Optional ────────────────────────────────────────────────┐  │
│  │                                                            │  │
│  │  Marketing & Updates                      Email  In-App    │  │
│  │  ├ New features and updates               [✓]    [✓]       │  │
│  │  ├ Training and webinar invitations       [✓]    [ ]       │  │
│  │  └ Newsletter                             [ ]    [ ]       │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
│                                                [Save Preferences]│
└──────────────────────────────────────────────────────────────────┘
```

---

## Component Inventory

| Component | Type | Notes |
|-----------|------|-------|
| `AgreementViewer` | Page | Full-text scroll with reading progress tracker |
| `DigitalSignature` | Form section | Name, position, signature pad, confirmation checkbox |
| `ReadingProgressBar` | UI element | Tracks scroll position, enables sign button at 100% |
| `ClauseBrowser` | Page section | Lists clauses with locked/negotiable visual distinction |
| `AmendmentRequestDialog` | Dialog | Current clause, justification, AI draft, proposed text |
| `AIDraftAssist` | Dialog section | AI-generated amendment language with accept/edit/write-own |
| `AmendmentHistory` | List | Per-clause amendment history with decisions |
| `TPCList` | Page section | Table of TPC agreements with consumer/package/status |
| `TPCUploadDialog` | Dialog | Consumer select, package select, document upload |
| `TerminationFlow` | Multi-step page | Reason select, risk tier outcome, confirmation |
| `ReactivationPage` | Page | Document validity check, reactivation action |
| `ComplianceDashboard` | Page | Summary cards, EFTSure table, register flags, expiry alerts |
| `EFTSureIndicator` | Badge | Green/yellow/red/pending with text label |
| `RegisterCheckResults` | Profile section | Per-register check results with timestamps |
| `NotificationPreferences` | Page | Mandatory/optional toggles with lock icons |
| `RiskTierBadge` | Badge | Low (green), Conditional (amber), High (red) |

---

## Interaction Patterns

### APA Signing Flow
1. Supplier navigates to Agreements section
2. Sees APA with pre-populated details (pulled from profile)
3. **First-time signing:** Scrolls through full agreement text — reading progress bar tracks position. At 100% scroll: signature section enables.
4. **Renewal signing:** Sees "Changes from previous version" diff summary at top. Scroll tracking skipped — can sign directly after reviewing changes.
5. Enters name, position, draws signature, ticks confirmation checkbox
6. Clicks "Sign Agreement" — agreement recorded with all signing metadata
7. Post-sign: sees signed confirmation with download option

### Amendment Request Flow
1. Supplier views clause browser — locked clauses greyed, negotiable clauses highlighted
2. Clicks "Request Amendment" on a negotiable clause
3. Writes justification for the change
4. AI Draft Assist suggests compliant language — supplier can use, edit, or write their own
5. Submits amendment request → TC compliance team notified
6. TC staff sees original clause, proposed change, justification → three options: approve, approve with modifications, or decline
7. If approved with modifications: supplier sees modified text and must acknowledge before it takes effect
8. Supplier notified of decision — approved changes reflected in agreement

### Self-Termination Flow
1. Supplier initiates from account settings → selects supplier entity
2. Selects reason from 15 predefined criteria (grouped by category)
3. System classifies risk tier:
   - **Low-risk** → Confirmation screen → immediate deactivation → reactivation available 12 months
   - **Conditional** → Review queued → QA team emailed → supplier notified of review timeline
   - **High-risk** → Contact compliance message → no self-service option
4. Terminated entity removed from active supplier list; siblings unaffected

### Reactivation Flow
1. Terminated supplier entity accesses reactivation page (within 12 months)
2. System checks all required documents against credentialing matrix
3. Valid documents: green checkmarks. Expired: red with upload prompt.
4. Supplier uploads renewed documents as needed
5. All documents valid → "Reactivate Now" enabled
6. Low-risk: immediate reactivation. Conditional: QA review required.
7. After 12 months: redirected to SR1 re-onboarding flow

### Compliance Monitoring Flow (Staff)
1. Dashboard shows summary cards: flagged, warnings, clear, pending
2. EFTSure section: colour-coded status per supplier, click for detail
3. Government register section: flagged suppliers/workers, payment block status
4. Document expiry section: sorted by urgency (days until expiry)
5. Click any supplier → profile view with full compliance detail
6. Manual actions: trigger register check, override EFTSure (with audit), lift/apply payment block

---

## Clarification Log

| # | Phase | Question | Decision | Rationale |
|---|-------|----------|----------|-----------|
| 1 | UX | APA reading progress — scroll tracking vs section acknowledgement vs renewal shortcut | Scroll tracking for first-time signing; diff summary + direct sign for renewals | Maintains compliance for new agreements while respecting repeat users' time |
| 2 | UX | Amendment negotiation round-trips — binary approve/decline vs counter-propose | Approve with modifications — compliance edits proposed text, supplier acknowledges | Most efficient; avoids multiple decline/resubmit cycles while maintaining audit trail |
| 3 | UX | Terminated entity visibility — full read-only vs landing page vs locked | Dedicated "Terminated" landing page with reactivation CTA + historical data links | Clear focus on primary action (reactivation) without confusing supplier into thinking they are active |
| 4 | UI | Clause browser layout — accordion vs two-panel vs tabbed | Two-panel: clause TOC on left, clause text on right | Standard legal document pattern; allows quick navigation of long APAs with locked/negotiable icons in TOC |
| 5 | UI | Compliance dashboard — single scroll vs tabbed vs sub-pages | Tabbed layout: summary cards pinned above, tabs for EFTSure / Register Checks / Document Expiry | Avoids scroll fatigue; keeps at-a-glance summary visible while focusing on one compliance domain at a time |
