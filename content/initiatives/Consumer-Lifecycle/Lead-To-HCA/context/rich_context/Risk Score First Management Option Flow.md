# Risk Score First Management Option Flow

**Created**: 2026-02-06
**Updated**: 2026-02-10
**Source**: Will's architecture session + stakeholder clarification + Fast Lane Retrospective (Feb 10, 2026)

---

## Overview

This document outlines how the risk score (IAT extraction + manual questions) determines whether the Home Care Agreement can be sent for signing or requires clinical/coordinator review first. It also establishes the **confirmed management option** that appears on the HCA.

> **Scope Note (Feb 10, 2026)**: LTH ends at agreement **sent** (or not-signable package created). All signature capture and post-send workflows are handled by Client HCA. The management option flow and risk score logic documented here remain accurate — the change is where LTH's responsibility ends.

---

## Key Terminology

| Term | Definition |
|------|------------|
| **Preferred Management Option** | Captured at lead/sales stage. Represents what the client *wants* if given the choice. Stored on the lead record in Zoho. Discrete field: SM, SM+, or Coordinated. |
| **Management Option** | The confirmed/hard-coded option that ends up on the Home Care Agreement. Determined by the risk score outcome and (if applicable) clinical review. This is what the client *actually gets*. |

**The distinction matters because:**
- A client may *prefer* SM but be assessed as only suitable for SM+
- The preferred option is "lead data" — it stays on the lead
- The management option is "agreement data" — it goes on the HCA

---

## Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        LEAD TO HCA: MANAGEMENT OPTION FLOW                   │
└─────────────────────────────────────────────────────────────────────────────┘

                    ┌──────────────────────────────┐
                    │  1. CAPTURE PREFERRED        │
                    │     MANAGEMENT OPTION        │
                    │     (Step 1: Essentials)     │
                    │     SM | SM+ | Coordinated   │
                    └──────────────┬───────────────┘
                                   │
                                   ▼
                    ┌──────────────────────────────┐
                    │  2. CLIENT DETAILS            │
                    │     (Step 2: includes         │
                    │      postcode for Monash)     │
                    └──────────────┬───────────────┘
                                   │
                                   ▼
                    ┌──────────────────────────────┐
                    │  3. RISK SCORE OUTCOME       │
                    │     (Step 3: Assessment Tool) │
                    └──────────────┬───────────────┘
                                   │
          ┌────────────────────────┼────────────────────────┐
          │                        │                        │
          ▼                        ▼                        ▼
┌─────────────────┐    ┌─────────────────────┐    ┌─────────────────┐
│ A. SUITABLE FOR │    │ B. NEEDS CLINICAL   │    │ C. NOT SUITED   │
│    EVERYTHING   │    │    ATTENTION        │    │                 │
│    (~98%)       │    │    (~2%)            │    │    (rare)       │
└────────┬────────┘    └──────────┬──────────┘    └────────┬────────┘
         │                        │                        │
         ▼                        │                        ▼
┌─────────────────────┐           │               ┌─────────────────┐
│ STEP 4: COORDINATOR │           │               │     STOP        │
│ CONFIRMATION        │           │               │ End of process  │
│                     │           │               └─────────────────┘
│ Confirm Mgmt Option │           │
│ If Coordinated:     │           │
│  • BD pipeline →    │           │
│    locked coord     │           │
│  • Normal → TC Int  │           │
│    (20%, override)  │           │
│  • Remote → escal.  │           │
│  • Unknown → hold   │           │
└────────┬────────────┘           │
         │                        │
    ┌────┴─────┐                  │
    │          │                  │
    ▼          ▼                  ▼
┌────────┐ ┌────────────┐ ┌─────────────────────┐
│RESOLVED│ │ESCALATION/ │ │ Package created     │
│(SM/SM+ │ │UNKNOWN     │ │ (NOT SIGNABLE)      │
│or coord│ │(not        │ └──────────┬──────────┘
│ known) │ │ signable)  │            │
└───┬────┘ └─────┬──────┘            ▼
    │            │        ┌─────────────────────┐
    ▼            │        │ Clinical Nurse Call │
┌────────────┐   │        │ (may ≠ assessor)    │
│ HCA sent   │   │        └──────────┬──────────┘
│ (SIGNABLE) │   │                   │
└─────┬──────┘   │      ┌───────────┼───────────┐
      │          │      │           │           │
      │          │      ▼           ▼           ▼
      │          │ ┌─────────┐ ┌─────────┐ ┌─────────┐
      │          │ │ CLEARED │ │ SM+     │ │ NOT     │
      │          │ │ FOR     │ │ REQUIRED│ │ SUITABLE│
      │          │ │PREFERRED│ │         │ │         │
      │          │ └────┬────┘ └────┬────┘ └────┬────┘
      │          │      │           │           │
      │          │      └─────┬─────┘           │
      │          │            │                 │
      │          │            ▼                 ▼
      │          │   ┌──────────────────┐  ┌────────┐
      │          │   │ Hold resolved →  │  │  STOP  │
      │          └──►│ Coord assigned + │  └────────┘
      │              │ Client HCA sends │
      │              │ agreement        │
      │              └────────┬─────────┘
      │                       │
      └──────────┬────────────┘
                 │
                 ▼
┌───────────────────────────────────────┐
│  ═══ LTH ENDS HERE ═══               │
│  Agreement "Sent" or "Not Signable"   │
│  Package created in Portal            │
│  Deal created in Zoho                 │
└───────────────────┬───────────────────┘
                    │
                    ▼
┌───────────────────────────────────────┐
│  CLIENT HCA (post-LTH)               │
│  • Signature capture                  │
│  • SLA reminders                      │
│  • Meeting booking (gated by signed)  │
└───────────────────────────────────────┘
```

---

## Risk Score Outcomes Explained

### A. Suitable for Everything (~98%)

- Client clears the risk assessment
- Proceeds to **Step 4: Coordinator Confirmation** where Management Option is confirmed
- **Management Option** = their Preferred Management Option (they get what they wanted)
- If Coordinated: coordinator selected/confirmed in Step 4 (TC Internal default, BD pipeline pre-pop, or searchable override)
- If Coordinated + remote area or unknown coordinator: agreement becomes not signable (coordinator escalation)
- Agreement sent immediately at point of sale (for resolved cases) — target: 95%+ sent rate (structural)
- Package created in Portal, Deal created in Zoho
- Portal invitation sent to client → Client HCA handles signature capture
- Meeting booking gated by signed agreement (enforced by Client HCA, not LTH)

### B. Needs Clinical Attention (~2%)

- Risk flags identified — requires clinical/coordinator review
- Package created in Portal with "Not Signable" status and hold reason(s)
- Deal created in Zoho, but NO portal invitation sent
- Package visible in packages index for relevant stakeholders

> **Scope Note**: LTH ends here. Resolution of the hold (clinical review, coordinator assignment) is handled by respective owners. Once resolved, Client HCA sends the agreement and portal invitation.

**Clinical call outcomes (post-LTH, handled by respective owners):**

| Outcome | Management Option | Next Step |
|---------|-------------------|-----------|
| Cleared for preferred | = Preferred | Hold resolved → Client HCA sends agreement |
| SM+ required | = SM+ | Hold resolved → Client HCA sends agreement |
| Not suitable | N/A | STOP — end of process |

### C. Not Suited (rare)

- Client rejected at risk score stage
- Process stops immediately
- Same as current behaviour

---

## Timeline

| Step | Timing | Owner |
|------|--------|-------|
| Risk score completed (Step 3) | During sales call | LTH |
| Coordinator confirmed (Step 4) | During sales call | LTH |
| Agreement sent (Path A) | Immediately after coordinator confirmation | LTH |
| Package created (Path B, not signable) | Immediately after wizard completion | LTH |
| Clinical review (Path B) | 24-48hr SLA | Clinical team (post-LTH) |
| Coordinator escalation (remote/unknown) | 24hr SLA | Operations (post-LTH) |
| Signature capture | After agreement received | Client HCA |
| Meeting booking | After agreement signed | Client HCA / TBD |

---

## Related Documents

- [Multiple Funding Streams Summary](Multiple%20Funding%20Streams/Multiple_Funding_Streams_Summary.md)
- [Current State - Lead to HCA](raw_context/lead%20to%20hca%20current%20state/current-state-readable.md)
