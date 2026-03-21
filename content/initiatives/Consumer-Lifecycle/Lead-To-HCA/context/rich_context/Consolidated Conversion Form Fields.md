# Consolidated Conversion Form Fields

**Created**: 2026-02-09
**Updated**: 2026-02-10
**Purpose**: Complete field list for Portal 5-step conversion form, merged from Zoho Lead Conversion + PUSH Form

---

## Overview

This document consolidates all fields captured during the Portal conversion process. The Portal conversion form replaces:
- Zoho's lead convert button
- Zoho PUSH form (all fields)

Only the **Assessment Tool** (IAT extraction + screening) stays external during LTH.

> **Scope Note (Feb 10, 2026)**: LTH ends at agreement **sent** (or not-signable package created). Signature capture (verbal, digital, manual) is handled by Client HCA. Meeting booking is post-signing and handled by Client HCA / TBD.

---

## External Dependencies

| Tool | What It Does | Output to LTH Flow |
|------|--------------|-------------------|
| **Assessment Tool** | IAT upload, screening questions, AI eligibility analysis | Risk Score Outcome |

---

# FIRST INSTANCE (Sales Conversion)

All fields below are captured during the sales conversion process, organized by step.

---

# Step 1: Conversion Essentials (~15 fields)

## Identifiers

| Field | Type | Values/Notes |
|-------|------|--------------|
| Consumer Name | Text | (from lead) |
| Preferred Name | Text | |
| Trilogy Care ID (TCID) | Text | Auto-generated |
| Referral Code | Text | 11-digit MAC code |
| Type | Single select | New Consumer, Existing/Transfer |

## Primary Funding and Preferred Management

| Field | Type | Values/Notes |
|-------|------|--------------|
| Primary Classification | Single select | **Required** — Support@Home Ongoing, Assistive Technology, AT Specific Needs, Home Modifications, End of Life, Restorative Care |
| First Approval Date | Date | From MAC |
| Take-up Date / Expiry Date | Date | Deadline to lodge ACER |
| Commencement Date | Date | |
| Cessation Date | Date | |
| Closing Date | Date | |
| Preferred Management Option | Single select | SM, SM+, Coordinated — *Lead data: what client wants if given choice* |

## Other Classifications

| Field | Type | Values/Notes |
|-------|------|--------------|
| Consent to All Classifications | Checkbox | Default: checked (opt-out model) |
| *Excluded Classifications* | Multi-select | *If client opts out of specific streams* |

## Representative / Care Circle

| Field | Type | Values/Notes |
|-------|------|--------------|
| Representative Name | Text | |
| Representative Email | Text | |
| Relationship | Single select | Husband, Wife, Son, Daughter, Extended family, Friend, GP, Partner, Advocate |
| Representative Type | Multi-select | Primary representative, Emergency contact, MAC representative, Lives close to consumer, Receives statements, EPOA, Authorized rep, Family/friend advocate, Care worker, Other |
| Representative Consent | Checkbox | |

## Attribution

| Field | Type | Values/Notes |
|-------|------|--------------|
| Stage | Single select | Home care approved, Investigating suitability, Lost/rejected, Terminated service, Onboarding, Manually sent, Sent followed up in issue, Signed manually, Assumed in place |
| Pipeline | Single select | Standard |
| Lead Source | Single select | (long picklist - TBD) |
| Campaign Source | ? | TBD |

---

# Step 2: Client Details

## Client Details

| Field | Type | Values/Notes |
|-------|------|--------------|
| Gender | Single select | Male, Female, Other |
| Date of Birth | Date | |
| Email | Text | |
| Phone Number | Text | |
| Country | Text/Select | |
| Nationality | Text/Select | |
| Preferred Language | Text/Select | |
| Interpreter Required | Boolean | Yes/No |

## Funding & Financial

| Field | Type | Values/Notes |
|-------|------|--------------|
| Funding Status | Single select | FSO (Full), MSO (60%) — *independent of contribution rates* |
| Pensioner Status | Single select | None, Self-funded, Retiree, Full pensioner, Part pensioner, DBA pension |
| Contribution Rate (Everyday Living) | Percentage | Max 17.5%. Clinical rate is always 0% and is not captured as a user input. |
| Contribution Rate (Independence) | Percentage | Max 80% |
| Default to max | Checkbox | Sets Everyday Living to 17.5% and Independence to 80%. Used when client doesn't know their rates. |
| Payment Method | Single select | Direct debit, Refuse to specify, Wants further info, Invoice |

---

# Step 3: Risk Assessment Outcome (~3 fields + reference)

## Assessment Tool (External)

The IAT extraction, screening questions, and AI eligibility decision happen in the **Assessment Tool** — a separate application from the LTH conversion flow. For MVP, sales completes the assessment externally, then **manually records the outcome and re-uploads the IAT** in Portal.

### Assessment Tool Flow (for reference)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  ASSESSMENT TOOL (External)                                                  │
│  apps.trilogycare.com.au/care-clinical/assessment-tool                       │
└─────────────────────────────────────────────────────────────────────────────┘

  Step 1: Upload          Step 2: Review              Step 3: Decision
  ─────────────────       ──────────────────────      ─────────────────────
  • PDF upload (IAT)      • Provider History          • AI eligibility
                            - Previously offboarded?     analysis
                            - Switching providers?     • Risk Score Outcome
                            - # previous providers       returned to LTH
                          • Technology Capability
                            - Comfort level
                            - Online banking?
                            - Has support person?
```

### Fields Captured in Assessment Tool (NOT in LTH)

| Field | Type | Values/Notes |
|-------|------|--------------|
| IAT Document | File upload | PDF from My Aged Care |
| Previously off-boarded by Trilogy Care? | Boolean | Yes/No — Critical flag |
| Switching from self-managed provider? | Boolean | Yes/No |
| Number of previous providers | Select | 0, 1, 2, 3+ |
| Comfort level with technology | Select | Comfortable, Somewhat comfortable, Not comfortable |
| Can use online banking? | Boolean | Yes/No |
| Has support person for technology? | Boolean | Yes/No |

---

## Risk Score Outcome (Manually Entered — MVP)

| Field | Type | Values/Notes |
|-------|------|--------------|
| **Risk Score Outcome** | Single select | **Suitable for everything** (~98%), **Needs clinical attention** (~2%), **Not suited** (rare/stop) — *Manually selected by Sales after completing external Assessment Tool* |
| **IAT Document** | File upload | PDF from My Aged Care — *Re-uploaded in Portal (also uploaded in external Assessment Tool for MVP — acknowledged double-handling)* |

The LTH conversion flow gates on this outcome. The salesperson cannot proceed to Step 4 until both the Risk Score Outcome is selected and the IAT document is uploaded.

> **MVP Note**: Both fields are manually entered/uploaded by Sales. In future iterations, the Assessment Tool will integrate directly with Portal, providing the risk outcome automatically and eliminating the duplicate IAT upload.

---

# Step 4: Coordinator Confirmation

## Management Option (Confirmed)

| Field | Type | Values/Notes |
|-------|------|--------------|
| **Management Option (Confirmed)** | Single select | SM, SM+, Coordinated — *Defaults to Preferred Management Option. Sales can confirm or change.* |

**Note**: Preferred ≠ Confirmed. A client may *prefer* SM but be assessed as only suitable for SM+.

## Coordinator Assignment (Coordinated clients only)

| Field | Type | Values/Notes |
|-------|------|--------------|
| Coordinator | Searchable dropdown | From Portal coordinator database. Defaults to TC Internal for normal onboard (below Monash remoteness threshold). Pre-populated and locked from Zoho Lead "Manager" field for BD pipeline leads. |
| Coordination Fee | Read-only (display) | From coordinator database. TC Internal = flat 20%. External coordinators have individual fee schedules. Populates the agreement. |
| "I don't know" | Option | Flags conversion as not signable (coordinator assignment pending). |

### Coordinator Selection Logic

| Condition | Coordinator Default | Fee | Editable? |
|-----------|-------------------|-----|-----------|
| BD pipeline lead (Manager field populated) | Pre-populated from Manager field | From coordinator record | No (locked) |
| Normal onboard, postcode below Monash threshold | TC Internal (Trilogy Care) | 20% flat | Yes (searchable override) |
| Normal onboard, postcode above Monash threshold | Escalation — cannot determine in-wizard | N/A | N/A — not signable |
| "I don't know" selected | Pending assignment | N/A | N/A — not signable |

---

# Step 5: Agreement

## Agreement Display (Signable Path)

*Shown if Risk Score Outcome = "Suitable for everything"*

| Field | Type | Values/Notes |
|-------|------|--------------|
| *Agreement Body* | Display | Full agreement content, scrollable |
| *Cooling Off Period Information* | Display | 14-day right to cancel, right to independent advice, ceases on service commencement |
| **[Send Agreement]** | **Button** | Sends agreement, creates Package + Deal, sends portal invitation |

## Agreement Display (Not-Signable Path)

*Shown if Risk Score Outcome = "Needs clinical attention" or coordinator assignment pending*

| Field | Type | Values/Notes |
|-------|------|--------------|
| *Hold Reason(s)* | Display | Clinical review required and/or coordinator assignment pending |
| *Hold Explanation* | Display | Why the agreement cannot be sent for signing yet |
| **[Complete Conversion]** | **Button** | Creates Package (not signable) + Deal, NO portal invitation |

> **Scope Note**: Signature capture (verbal, digital, manual PDF) is entirely handled by **Client HCA**, not LTH. LTH's Step 4 sends the agreement or creates a not-signable package — it does not capture signatures.

---

# POST-LTH: Clinical Resolution (formerly "Second Instance")

> **Scope Note**: This section documents what happens AFTER LTH ends for the ~2% of conversions flagged as "Needs Clinical Attention". This is NOT part of the LTH conversion wizard — it is handled by the clinical team and respective owners. Documented here for context only.

*Only applies if Risk Score Outcome = "Needs clinical attention"*

This section is completed by the clinical team after the package has been created as "Not Signable". It is a separate workflow from the LTH conversion.

---

## Clinical Review Fields

| Field | Type | Values/Notes |
|-------|------|--------------|
| Clinical Call Session ID | Text | Reference to call recording/session |
| Clinical Call Date | Date/Time | When clinical nurse call occurred |
| Clinician Name | Text | Who conducted the review |
| **Clinical Screening Outcome** | Single select | **Cleared for preferred**, **SM+ required**, **Not suitable** |

### Outcome Logic

| Clinical Outcome | Management Option (Confirmed) | Next Step |
|------------------|-------------------------------|-----------|
| Cleared for preferred | = Preferred Management Option | Agreement screen unlocked |
| SM+ required | = SM+ | Agreement screen unlocked |
| Not suitable | N/A | STOP — process ends |

---

## Agreement Send (Post-Clinical Resolution)

*Once Clinical Screening Outcome = "Cleared for preferred" or "SM+ required"*

The hold is resolved, and **Client HCA** handles sending the agreement and portal invitation. The same Client HCA signature workflows then apply (verbal, digital, manual PDF).

> See [Client HCA spec](../../Client-HCA/spec.md) for signature capture field details.

---

# Key Distinctions

| Term | Definition | Where Used |
|------|------------|------------|
| **Preferred Management Option** | What client wants if given choice | Lead data |
| **Management Option (Confirmed)** | What client actually gets based on risk outcome | Agreement data |
| **Risk Score Outcome** | From Assessment Tool (external) — AI eligibility analysis. MVP: manually entered by Sales in Portal | Gates LTH flow at Step 3 |
| **Clinical Screening Outcome** | From clinical nurse call | Unlocks agreement (if flagged) |
| **LTH Conversion Wizard** | Sales conversion — all clients go through this (5 steps) | Sales |
| **Clinical Resolution (post-LTH)** | Clinical review — only ~2% flagged clients | Clinical team / respective owners |
| **Assessment Tool** | External app for IAT extraction + screening questions | Runs during LTH Step 3 (external for MVP) |
| **Coordinator** | Entity from Portal coordinator database with fee schedule | Selected/confirmed in Step 4 for Coordinated clients |
| **Monash Model** | Remoteness classification for Australian postcodes | Used in Step 4 to determine coordinator eligibility |

---

## Related Documents

- [LTH General Context](LTH%20General%20Context.md)
- [Conversion Sync-Back Flow](Conversion%20Sync-Back%20Flow.md)
- [Risk Score First Management Option Flow](Risk%20Score%20First%20Management%20Option%20Flow.md)
- [Classification Data Model](Classification%20Data%20Model.md)
- [Agreement Signature Flow](Agreement%20Signature%20Flow.md)
