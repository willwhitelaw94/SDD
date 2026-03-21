# Lead to HCA - Current State (Feb 2026)

**Source**: Jackie Palmer (Head of Sales), Feb 3, 2026 + Rebecca Eadie, Romy Blacklaw, Jan 30, 2026

---

## 1. Lead Capture (Zoho CRM - Lead Module)

Sales captures initial lead data in the Zoho CRM Lead module:
- Contact info (name, email, phone)
- Source/attribution
- Initial qualification notes

**Trigger to next step**: Sales rep manually converts Lead → Consumer

---

## 2. Lead Conversion (Zoho CRM)

When sales rep clicks "Convert", Zoho CRM creates two new records:

**Consumer Record**:
- TCID (Trilogy Care ID) auto-generated
- Funding classification (HCP, Restorative, etc.)
- Basic profile data

**Care Plan Record**:
- Linked to Consumer
- Package level placeholder
- Management option (self/coordinated/brokered)

**Note**: At this point, the Portal knows nothing yet. The webhook fires later.

---

## 3. Sales Onboarding Push Form (Zoho Web Form)

This is a **Zoho Web Form** (not a CRM module) - completed live on the phone with the client.

**What's captured**:
- **IAT Screening**: PDF upload of assessment
- **AI Risk Scoring**: ~2% rejection rate, 0.2% false negative
- **Funding Stream**: Primary stream only (highest value) — additional streams noted in free text
- **Management Option**: Self-managed, coordinated, or brokered
- **Client Consent**: Terms, privacy, service agreement
- **Representative Details**: POA, family contacts
- **Payment Method**: Direct debit preferred
- **Language/Accessibility**: Interpreter needs

**Screening Outcomes**:
- Approved for all pathways → Continue
- Approved for coordinated only → Continue (restricted)
- Rejected (~2%) → End

**Trigger to next step**: Form submission updates Care Plan record → Webhook fires

---

## 4. Webhook to Portal

When the Care Plan record is updated (post push form), a webhook fires to the Portal.

**Portal creates Package Record with**:
- Consumer ID (TCID)
- Package level
- Funding classification
- Management option
- Status: Pending

**What does NOT come through**:
- Secondary funding streams (not captured)
- Detailed consent per stream (doesn't exist)

---

## 5. Sample Agreement Sent (Email)

After push form completion, client receives:
- Sample Home Care Agreement (HCA) via email
- Sent before the care plan meeting
- Purpose: Let client review terms ahead of meeting

**Pain Point**: This is just a preview — actual signing happens post-meeting.

---

## 6. Meeting Booking (Calendly)

Care plan meeting is scheduled via Calendly:
- SMS reminder sent to client
- Confirmation call on meeting day
- Meeting time = default commencement date

---

## 7. Care Plan Meeting (Zoho CRM Modules)

The assessment team conducts the meeting using Zoho CRM modules (Care Plan, Consumer).

**What happens**:
- Budget finalized per funding stream
- Risk evaluation completed
- Client preferences confirmed
- Care plan document prepared
- Verbal agreement offered

**If client verbally agrees**: Marked as accepted in CRM
**If client doesn't verbally agree**: Digital signature request sent post-meeting, sales follows up

**Turnaround**: Target 24hrs from meeting to care plan delivery (recently improved from 7-9 days)

---

## 8. Agreement Signing (Email/DocuSign)

**Current flow**:
1. Sample HCA sent pre-meeting (step 5)
2. Meeting happens (step 7)
3. Verbal acceptance OR digital signature request sent post-meeting
4. If digital: DocuSign email, sales follows up until signed

**Pain Point**: 0% pre-meeting agreement uptake. All signing happens post-meeting → delays activation.

---

## 9. Proda Entry (Manual)

After agreement is signed, operations manually enters funding in Proda (government system).

**What's entered**:
- Primary funding stream only
- Commencement date
- Package level
- Client details

**Pain Points**:
- Manual process (no automation)
- No validation that amendment signed for secondary streams
- Entries often late or missed
- Backdating required if delayed

---

## 10. Care Plan Delivery

**Self-Managed Clients**:
- Care plan emailed immediately after meeting
- Client receives budget + service plan
- Proceeds to activation

**Coordinated Clients**:
- Manually assigned to care partner (coordinator)
- **Current backlog: 130 clients** waiting for allocation
- Coordinator delivers care plan within 24hrs (target)
- Delays common due to capacity

**Pain Point**: Coordinator bottleneck contributes to churn.

---

## 11. Active Client

Client is now active with:
- Package in Portal
- Care plan delivered
- Agreement signed (tracked in Consumer module)
- Proda entry completed (primary stream only)

---

## Current Metrics

| Metric | Value |
|--------|-------|
| Churn rate | <6% (was 14%) |
| Screening rejection | ~2% |
| Screening false negative | 0.2% |
| Coordinator backlog | 130 clients |
| Funding streams captured | 1 (primary only) |
| Pre-meeting agreement uptake | 0% |

---

## Key Pain Points Summary

1. **Single funding stream** — Only primary captured; secondary buried in notes → missed revenue
2. **Late agreement signing** — All signing post-meeting → delays, churn
3. **Coordinator bottleneck** — 130-client backlog in coordinated pathway
4. **Manual Proda entry** — No validation, late entries, errors
5. **No multi-stream tracking** — Amendments, consents, terminations not tracked per stream
