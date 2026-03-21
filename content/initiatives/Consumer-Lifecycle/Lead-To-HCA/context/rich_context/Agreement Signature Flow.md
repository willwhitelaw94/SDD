# Agreement Flow

**Created**: 2026-02-09
**Updated**: 2026-02-10
**Purpose**: Visual flow diagram and explanation for agreement logic in the conversion process

---

## Overview

The **risk score outcome** determines which agreement path the client follows. LTH handles sending the agreement (or creating a not-signable package) — all signature capture is handled by **Client HCA**.

---

## Flow Diagram

```
[Risk Score Calculated]
  |
  |====================================================|
  |              LTH SCOPE (Conversion Wizard)          |
  |====================================================|
  |
  +--> Outcome: SUITABLE FOR EVERYTHING (~98%)
  |       |
  |       v
  |   [Step 3: Client Details]
  |       |
  |       v
  |   [Step 4: Agreement]
  |       |
  |       +--> Confirm Management Option
  |       |      (defaults to Preferred; may differ if risk outcome requires)
  |       |
  |       +--> Display Agreement Body
  |       |      + Cooling Off Period Information
  |       |
  |       +--> [Send Agreement]
  |               |
  |               +--> Agreement status = "Sent"
  |               +--> Package created in Portal
  |               +--> Deal created in Zoho
  |               +--> Portal invitation sent to client
  |               |
  |               v
  |       ════════════════════════════════════
  |       ║  LTH ENDS — HANDOFF TO CLIENT HCA  ║
  |       ════════════════════════════════════
  |
  +--> Outcome: NEEDS CLINICAL ATTENTION (~2%)
  |       |
  |       v
  |   [Step 3: Client Details]
  |       |
  |       v
  |   [Step 4: Agreement — Not Signable]
  |       |
  |       +--> Display hold reason(s):
  |       |      • Clinical review required
  |       |      • Coordinator assignment pending (if applicable)
  |       |
  |       +--> [Complete Conversion]
  |               |
  |               +--> Agreement status = "Not Signable"
  |               +--> Package created in Portal (with hold status)
  |               +--> Deal created in Zoho
  |               +--> NO portal invitation sent
  |               |
  |               v
  |       ════════════════════════════════════
  |       ║  LTH ENDS                          ║
  |       ║  Hold resolution → respective owners║
  |       ║  Once resolved → Client HCA sends   ║
  |       ║  agreement + portal invitation       ║
  |       ════════════════════════════════════
  |
  +--> Outcome: NOT SUITED (rare)
          |
          v
      [STOP — Process Ends]
      No package created. Consumer + Care Plan
      remain in Zoho but flagged as not proceeding.
```

---

## Flow Explanation

After the screening section is completed, the system calculates a **risk score**, which determines how the agreement process proceeds.

### Suitable for Everything (~98%)

If the risk score outcome is *suitable for everything*, sales proceeds to **Step 4: Agreement**.

On this step:
- **Management Option** is confirmed (defaults to the client's Preferred Management Option)
- **Agreement body** is displayed inline for review
- **Cooling off period information** is shown alongside the agreement (14-day right to cancel, right to seek independent advice, ceases when services commence)
- **"Send Agreement"** action sends the agreement, creates the Package in Portal, creates the Deal in Zoho, and triggers a portal invitation to the client

**LTH ends here.** The client receives a portal invitation and accesses the agreement via Client HCA workflows. Signature capture (verbal, digital, manual PDF) is entirely handled by Client HCA.

### Needs Clinical Attention (~2%)

If the risk score outcome is *needs clinical attention*, sales completes the wizard but the agreement is marked **not signable**.

On Step 4:
- A clear explanation of the hold reason is displayed (clinical review required, and/or coordinator assignment pending)
- **"Complete Conversion"** creates the Package in Portal with hold status, creates the Deal in Zoho, but does NOT send a portal invitation

**LTH ends here.** The not-signable package appears in the packages index for relevant stakeholders. Resolution is handled by respective owners:
- **Clinical review**: Clinical team resolves within 24-48hr SLA
- **Coordinator assignment**: Operations resolves within 24hr SLA

Once the hold is resolved, Client HCA sends the agreement and portal invitation.

### Not Suited (rare)

Process stops immediately. No agreement screen shown. No package created in Portal. Consumer and Care Plan records remain in Zoho but are flagged as not proceeding.

---

## Key Points

1. **Risk score gates the agreement path** — "Suitable" gets signable agreement, "Needs clinical" gets not-signable package
2. **LTH sends but does NOT sign** — All signature capture (verbal, digital, manual PDF) is Client HCA territory
3. **Cooling off period displayed at send** — 14-day right to cancel, ceases when services commence
4. **Not-signable creates a package** — Package exists in Portal with hold status visible in packages index
5. **Two stop points** — "Not suited" at risk score (no package), "Not suitable" at clinical review (post-LTH)
6. **Portal invitation only for signable** — Not-signable packages get no client invitation until hold is resolved

---

## LTH → Client HCA Handoff

| LTH Creates | Client HCA Handles |
|-------------|-------------------|
| Agreement in "Sent" state | Signature capture (verbal, digital, manual PDF) |
| Package record in Portal | Agreement state transitions (Sent → Signed) |
| Portal invitation (signable only) | First-login flow, agreement access |
| Deal record in Zoho | SLA reminders for unsigned agreements |
| Not-signable package with hold reasons | Hold resolution → send agreement when cleared |

---

## Related Documents

- [Consolidated Conversion Form Fields](Consolidated%20Conversion%20Form%20Fields.md)
- [Risk Score First Management Option Flow](Risk%20Score%20First%20Management%20Option%20Flow.md)
- [LTH General Context](LTH%20General%20Context.md)
