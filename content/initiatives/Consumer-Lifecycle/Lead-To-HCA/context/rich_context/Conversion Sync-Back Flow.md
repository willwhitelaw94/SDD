# Conversion Sync-Back Flow

**Created**: 2026-02-09
**Updated**: 2026-02-10
**Purpose**: Documents when and what Portal syncs back to Zoho during the 5-step conversion process

---

## Overview

In the new Lead-to-HCA flow, **Portal becomes the source of truth during conversion**. Unlike the current state (where Zoho pushes to Portal via webhook), the new flow reverses direction: Portal calls Zoho API to create and update records as the conversion progresses.

This is a **continuous sync model** — each step syncs its data to Zoho immediately, rather than batching everything at the end.

---

## Sync Timing Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     CONVERSION SYNC-BACK FLOW                                │
└─────────────────────────────────────────────────────────────────────────────┘

  PRE-CONVERSION
  ─────────────────────────────
  Lead exists in Zoho CRM
  Lead synced to Portal (two-way sync)
  Sales opens Portal conversion form
                    │
                    ▼
  ┌─────────────────────────────────────────────────────────────────────────┐
  │  STEP 1: Conversion Essentials                                          │
  │  • Identifiers (Consumer Name, TCID, Referral Code, Type)               │
  │  • Primary Funding (Classification, Key Dates)                          │
  │  • Preferred Management Option                                          │
  │  • Other Classifications (consent checkbox, exclusions)                 │
  │  • Representative / Care Circle                                         │
  │  • Attribution (Stage, Pipeline, Lead Source)                           │
  └─────────────────────────────────────────────────────────────────────────┘
                    │
                    ▼
  ══════════════════════════════════════════════════════════════════════════
  ║  SYNC #1: CREATE RECORDS                                               ║
  ║                                                                        ║
  ║  Portal → Zoho API:                                                    ║
  ║  • Convert Lead → Consumer (Zoho's convert action)                     ║
  ║  • Create Consumer module record with Step 1 data                      ║
  ║  • Create Care Plan module record (stage: "booked")                    ║
  ║                                                                        ║
  ║  Result: Consumer + Care Plan exist in Zoho for downstream workflows   ║
  ══════════════════════════════════════════════════════════════════════════
                    │
                    ▼
  ┌─────────────────────────────────────────────────────────────────────────┐
  │  STEP 2: Client Details                                                 │
  │  • Client Details (DOB, Gender, Nationality, Language, Interpreter)     │
  │  • Funding & Financial (Funding Status, Pensioner Status, Contribution │
  │    Rates [Everyday Living, Independence], Payment Method)              │
  └─────────────────────────────────────────────────────────────────────────┘
                    │
                    ▼
  ══════════════════════════════════════════════════════════════════════════
  ║  SYNC #2: UPDATE — CLIENT DATA                                         ║
  ║                                                                        ║
  ║  Portal → Zoho API:                                                    ║
  ║  • Update Consumer: Client details (DOB, gender, language, etc.)       ║
  ║  • Update Consumer: Payment method preference                          ║
  ══════════════════════════════════════════════════════════════════════════
                    │
                    ▼
  ┌─────────────────────────────────────────────────────────────────────────┐
  │  STEP 3: Risk Assessment Outcome                                        │
  │  • Risk Score Outcome (manually entered after external Assessment Tool) │
  │  • IAT Document (re-uploaded in Portal — MVP double-handling)           │
  │  • Clinical flags if applicable                                         │
  └─────────────────────────────────────────────────────────────────────────┘
                    │
                    ▼
  ══════════════════════════════════════════════════════════════════════════
  ║  SYNC #3: UPDATE — RISK DATA                                           ║
  ║                                                                        ║
  ║  Portal → Zoho API:                                                    ║
  ║  • Update Care Plan: Risk score outcome (manually entered)             ║
  ║  • Update Care Plan: IAT document (re-uploaded in Portal)              ║
  ║  • Update Care Plan: Clinical intervention flag (if needed)            ║
  ║  • Update Care Plan: Agreement status (draft vs ready-to-send)         ║
  ══════════════════════════════════════════════════════════════════════════
                    │
                    ▼
  ┌─────────────────────────────────────────────────────────────────────────┐
  │  STEP 4: Coordinator Confirmation                                       │
  │  • Management Option (confirmed — may differ from preferred)            │
  │  • Coordinator selection (Coordinated clients only):                    │
  │    - BD pipeline: pre-populated from Zoho Lead Manager field (locked)  │
  │    - Normal onboard: TC Internal default (searchable override)         │
  │    - Remote area: escalation (not signable)                            │
  │  • Coordination fee displayed from coordinator database                │
  └─────────────────────────────────────────────────────────────────────────┘
                    │
                    ▼
  ══════════════════════════════════════════════════════════════════════════
  ║  SYNC #4: UPDATE — COORDINATOR DATA                                    ║
  ║                                                                        ║
  ║  Portal → Zoho API:                                                    ║
  ║  • Update Consumer: Management Option (confirmed)                      ║
  ║  • Update Consumer: Coordinator (name/entity)                          ║
  ║  • Update Consumer: Coordination Fee                                   ║
  ══════════════════════════════════════════════════════════════════════════
                    │
                    ▼
  ┌─────────────────────────────────────────────────────────────────────────┐
  │  STEP 5: Agreement                                                      │
  │  • Agreement body preview + cooling off period information              │
  │  • Coordination fee included in agreement (Coordinated clients)        │
  │  • Send agreement (signable) or complete conversion (not signable)      │
  └─────────────────────────────────────────────────────────────────────────┘
                    │
                    ▼
  ══════════════════════════════════════════════════════════════════════════
  ║  SYNC #5: FINALIZE — AGREEMENT & DEAL                                  ║
  ║                                                                        ║
  ║  Portal → Zoho API:                                                    ║
  ║  • Update Care Plan: Agreement status ("Sent" or "Not Signable")       ║
  ║  • Create Deal record (for legacy reporting)                           ║
  ║                                                                        ║
  ║  Portal actions:                                                       ║
  ║  • Create Package record in Portal                                     ║
  ║  • Send portal invitation (signable path only)                         ║
  ══════════════════════════════════════════════════════════════════════════
                    │
                    ▼
  ═══ LTH ENDS HERE ═══
  ─────────────────────────────
  Consumer + Care Plan fully populated in Zoho
  Package active in Portal (agreement status: Sent or Not Signable)
  Deal created in Zoho
  → Handoff to Client HCA epic (signature capture, SLA reminders, meeting booking)
```

---

## Sync Summary Table

| Sync | Trigger | Zoho Action | Records Affected |
|------|---------|-------------|------------------|
| **#1** | Step 1 complete | CREATE | Lead → Consumer, Care Plan |
| **#2** | Step 2 complete | UPDATE | Consumer (client details) |
| **#3** | Step 3 complete | UPDATE | Care Plan (risk data) |
| **#4** | Step 4 complete | UPDATE | Consumer (management option, coordinator, fee) |
| **#5** | Step 5 complete | UPDATE + CREATE | Care Plan, Deal, Package (Portal) |

---

## Data Mapping: Portal → Zoho

### Sync #1: Create Records (after Step 1)

| Portal Field | Zoho Module | Zoho Field |
|--------------|-------------|------------|
| Consumer Name | Consumer | Name |
| Preferred Name | Consumer | Preferred_Name |
| TCID | Consumer | TCID |
| Referral Code | Consumer | Referral_Code |
| Type | Consumer | Type |
| Primary Classification | Care Plan | HCP_Level / Classification |
| First Approval Date | Care Plan | First_Approval_Date |
| Take-up Date / Expiry Date | Care Plan | Expiry_Date |
| Commencement Date | Care Plan | Commencement_Date |
| Cessation Date | Care Plan | Cessation_Date |
| Closing Date | Consumer | Closing_Date |
| Preferred Management Option | Consumer | Preferred_Management_Option |
| Consent to All Classifications | Care Plan | Classification_Consent |
| Excluded Classifications | Care Plan | Excluded_Classifications |
| Representative Name | Consumer | Rep_Name |
| Representative Email | Consumer | Rep_Email |
| Relationship | Consumer | Rep_Relationship |
| Representative Type | Consumer | Rep_Type |
| Stage | Consumer | Stage |
| Pipeline | Consumer | Pipeline |
| Lead Source | Consumer | Lead_Source |

### Sync #2: Update Client Data (after Step 2)

| Portal Field | Zoho Module | Zoho Field |
|--------------|-------------|------------|
| Date of Birth | Consumer | DOB |
| Gender | Consumer | Gender |
| Nationality | Consumer | Nationality |
| Preferred Language | Consumer | Language |
| Interpreter Required | Consumer | Interpreter_Required |
| Pensioner Status | Consumer | Pensioner_Status |
| Contribution Rate (Everyday Living) | Consumer | Contribution_Rate_Everyday |
| Contribution Rate (Independence) | Consumer | Contribution_Rate_Independence |
| Payment Method | Consumer | Payment_Method |

### Sync #3: Update Risk Data (after Step 3)

| Portal Field | Zoho Module | Zoho Field |
|--------------|-------------|------------|
| Risk Score Outcome | Care Plan | Risk_Score_Outcome |
| IAT Document (PDF) | Care Plan | IAT_Document |
| Clinical Intervention Required | Care Plan | Requires_Clinical_Review |
| Agreement Status | Care Plan | Agreement_Status |

### Sync #4: Update Coordinator Data (after Step 4)

| Portal Field | Zoho Module | Zoho Field |
|--------------|-------------|------------|
| Management Option (Confirmed) | Consumer | Management_Option |
| Coordinator (name/entity) | Consumer | Coordinator |
| Coordination Fee | Consumer | Coordination_Fee |

### Sync #5: Finalize Agreement (after Step 5)

| Portal Field | Zoho Module | Zoho Field |
|--------------|-------------|------------|
| Agreement Status ("Sent" / "Not Signable") | Care Plan | Agreement_Status |
| Hold Reason(s) (if not signable) | Care Plan | Hold_Reason |
| — | Deal | *(new record created)* |
| — | Package (Portal) | *(new record created — tracks agreement status)* |

---

## Key Principles

1. **Portal is source of truth during conversion**
   - All data entry happens in Portal
   - Zoho receives data via API, not the other way around

2. **Continuous sync, not batch**
   - Each step syncs immediately after completion
   - Zoho records are progressively enriched
   - Enables parallel workflows (e.g., clinical review can start after Step 3)

3. **Consumer + Care Plan created early**
   - Records exist in Zoho after Step 1
   - Downstream Zoho workflows can begin (e.g., finance, clinical)

4. **Deal + Package created at the end**
   - Deal created in Zoho when wizard completes (for legacy reporting)
   - Package created in Portal when wizard completes (tracks agreement status)
   - Portal invitation sent only if agreement is signable

5. **Idempotent updates**
   - Each sync should be safe to retry
   - Portal maintains sync state to prevent duplicates

---

## Clinical Intervention Path

When Risk Score Outcome = "Needs Clinical Attention":

```
  STEP 3: Risk Score = Needs Clinical Attention
                    │
                    ▼
  ══════════════════════════════════════════════════════════════════════════
  ║  SYNC #3: UPDATE — CLINICAL FLAG                                       ║
  ║                                                                        ║
  ║  • Care Plan: Requires_Clinical_Review = true                          ║
  ║  • Care Plan: Agreement_Status = "draft" (not sendable)                ║
  ══════════════════════════════════════════════════════════════════════════
                    │
                    ▼
  Sales continues with Step 4 (Coordinator Confirmation) → Step 5 (Agreement)
  Step 5 shows "Not Signable" with hold reason(s)
  Package created with "Not Signable" status
                    │
                    ▼
  ═══ LTH ENDS HERE ═══
                    │
                    ▼
  ┌─────────────────────────────────────────────────────────────────┐
  │  POST-LTH: Hold Resolution (handled by respective owners)      │
  │                                                                 │
  │  Clinical team reviews (24-48hr SLA)                            │
  │       │                                                         │
  │       ├── CLEARED → Management_Option = Preferred               │
  │       ├── SM+ REQUIRED → Management_Option = SM+                │
  │       └── NOT SUITABLE → STOP                                   │
  │                                                                 │
  │  Once resolved → Client HCA sends agreement + portal invitation │
  └─────────────────────────────────────────────────────────────────┘
```

> **Scope Note**: The clinical intervention path now continues beyond LTH. Sales completes the wizard through to Step 5, but the agreement is marked "Not Signable". Resolution (clinical review, coordinator escalation) and subsequent agreement sending are handled post-LTH by their respective owners and Client HCA.

---

## Related Documents

- [LTH General Context](LTH%20General%20Context.md)
- [Consolidated Conversion Form Fields](Consolidated%20Conversion%20Form%20Fields.md)
- [Risk Score First Management Option Flow](Risk%20Score%20First%20Management%20Option%20Flow.md)
- [Agreement Signature Flow](Agreement%20Signature%20Flow.md)
