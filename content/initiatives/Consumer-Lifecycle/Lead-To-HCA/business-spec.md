---
title: "Business Specification: Lead to HCA (LTH)"
---

# Business Specification: Lead to HCA (LTH)

**Created**: 2026-02-09
**Updated**: 2026-02-10
**Source**: /trilogy-clarify business lens + Fast Lane Retrospective (Feb 10, 2026)
**Spec**: [spec.md](spec.md)

---

## Success Metrics

### Primary KPI

**Agreement Sent Rate at Point of Sale**

| Metric | Current | Target | Owner |
|--------|---------|--------|-------|
| % of conversions where agreement is sent during the initial sales call | 0% (agreement sent post-meeting) | 95%+ (structural — wizard ends with agreement sent) | Sales Team Lead |

**Rationale**: Under the new flow, every conversion that passes risk screening and coordinator confirmation results in the agreement being sent immediately. The wizard structurally enforces this — Step 5 ends with the agreement sent. The 5% margin accounts for edge cases where sales may need to pause mid-wizard or where coordinator assignment cannot be resolved in-wizard.

### Secondary KPIs

| Metric | Current | Target | Owner |
|--------|---------|--------|-------|
| Conversion wizard completion time | N/A | <10 min | Sales |
| Not-signable hold rate | N/A | <2% | Clinical / Ops |
| Not-signable resolution turnaround | N/A | <48 hr | Clinical Team Lead |
| Portal ↔ Zoho sync accuracy | N/A | 100% | Engineering |

---

## SLAs & Accountability

### Not-Signable Resolution SLA

| Stage | SLA | Owner | Escalation |
|-------|-----|-------|------------|
| Package flagged as not signable | Immediate visibility in packages index | System | — |
| Clinical review (if applicable) | 24-48 hours from flag | Clinical Team | Clinical Team Lead |
| Coordinator escalation (remote area or unknown) | 24 hours from flag | Operations | Operations Lead |
| Agreement unlocked → client invited | Immediate after hold resolved | System (via Client HCA) | — |

> **Note**: Resolution of not-signable holds is handled by respective owners/epics (not LTH). LTH creates the package and surfaces the hold in the packages index.

### Agreement Follow-up (Handled by Client HCA)

| Stage | Timing | Action | Owner |
|-------|--------|--------|-------|
| Agreement sent | Day 0 | Portal invite sent to client | LTH (System) |
| No signature received | Day 1 (24h) | Auto-reminder sent to client | Client HCA |
| Still no signature | Day 2 (48h) | Escalation notification | Client HCA |
| Still no signature | Day 7 | Follow-up reminder | Client HCA |
| Still no signature | Day 14 | Final reminder | Client HCA |

---

## Notifications

### During LTH Conversion

| Event | Notified Parties |
|-------|------------------|
| Package created as not signable (clinical hold) | Clinical Team, Original Sales Person |
| Package created as not signable (coordinator escalation) | Operations / Coordinator Assignment, Original Sales Person |
| Conversion completed (agreement sent) | Original Sales Person (confirmation) |

### Post-LTH (Handled by Client HCA)

| Event | Notified Parties |
|-------|------------------|
| Not-signable hold resolved | Original Sales Person |
| Client signs agreement | Original Sales Person, relevant stakeholders |
| SLA reminders | Client |

---

## Process Decisions

### Agreement as Gate for Meeting Booking

**Decision**: The assessment meeting CANNOT be booked until the agreement is signed.

**Context (from Fast Lane Retrospective, Feb 10 2026)**:
- Previously, meetings were booked before agreement signing, resulting in ~$100K/yr in wasted assessment resources on uncommitted clients
- The 14-day cooling off period provides a legal safety net — clients can sign immediately knowing they have 14 days to reconsider
- Sales retains ownership of the client through to agreement signing + meeting booking
- This is enforced by whoever handles meeting booking (Client HCA or subsequent workflow), not by LTH

**Flow**:
1. Sales completes LTH wizard → agreement sent
2. Client signs agreement (via Client HCA)
3. Only then can the assessment meeting be booked

### Assessment Tool (MVP)

**Decision**: Assessment Tool is an external application for MVP. Sales accesses it via a button/link from Step 3, then manually records the outcome in Portal.

**Flow**:
1. Sales completes Step 1 (Conversion Essentials) and Step 2 (Client Details)
2. Sales clicks button to access external Assessment Tool in Step 3
3. Sales completes the assessment externally (IAT upload + screening questions → AI produces risk outcome)
4. Sales returns to Portal and manually selects the Risk Score Outcome
5. Sales re-uploads the IAT document in Portal
6. Sales proceeds to Step 4 (Coordinator Confirmation) based on outcome

**Double-handling note**: For MVP, the IAT is uploaded in both the Assessment Tool and Portal, and the risk outcome is manually entered in Portal rather than received as an automated payload. This is acknowledged temporary double-handling.

**Future**: The Assessment Tool will integrate directly with Portal, eliminating manual outcome entry and duplicate IAT uploads.

### Coordinator Assignment (In-Wizard)

**Decision**: Coordinator assignment is resolved within the conversion wizard (Step 4) for most cases, rather than deferring to a post-LTH hold.

**Logic**:
1. If Management Option = Coordinated and lead came through a BD pipeline → coordinator pre-populated from Zoho Lead "Manager" field (locked)
2. If Management Option = Coordinated (normal onboard) → system checks client postcode against Monash Model remoteness:
   - Below threshold → defaults to TC Internal (flat 20% coordination fee), searchable override from coordinator database
   - Above threshold → escalation (not signable — requires external coordinator assignment post-LTH)
3. If "I don't know" selected → not signable (coordinator assignment pending post-LTH)
4. If Management Option = SM or SM+ → no coordinator logic, skip entirely

**Impact**: This replaces the previous approach where all coordinator assignment was deferred to a post-LTH hold. Now, only remote area escalations and unknown coordinator cases result in a not-signable hold for coordinator reasons — significantly reducing the not-signable rate.

---

### LTH Scope Boundary

**Decision**: LTH ends when the agreement is sent and the package record exists in Portal.

**What LTH does**:
- Creates the lead record in Portal (synced from Zoho)
- Runs the 5-step conversion wizard
- Creates Consumer + Care Plan in Zoho (Step 1)
- Confirms coordinator assignment in-wizard for Coordinated clients (Step 4)
- Sends the agreement or holds it as not signable (Step 5)
- Creates the Package record in Portal
- Sends the portal invitation (signable path only)
- Provides the packages index for pipeline visibility

**What LTH does NOT do**:
- Signature capture (Client HCA)
- Meeting booking (Client HCA / TBD)
- SLA reminders (Client HCA)
- Not-signable resolution (respective owners)
- Agreement lifecycle management (Client HCA)

---

## Stakeholder Alignment

| Stakeholder | Primary Concern | How LTH Addresses |
|-------------|-----------------|-------------------|
| Sales Team | Too many systems to use | Single 5-step wizard replaces Zoho convert + PUSH form |
| Sales Team | No visibility of agreement pipeline | Packages index filterable by agreement status |
| Clinical Team | Not knowing who needs review | Not-signable packages visible in packages index with hold reasons |
| Operations | Churn from slow activation | Agreement sent at point of sale; signing gate prevents uncommitted meetings |
| Finance | Missed revenue from secondary streams | Opt-out classification consent captures all streams |

---

## ROI Considerations

### Revenue Impact

- **Primary**: Agreement sent at point of sale → faster path to signed → earlier billing start
- **Secondary**: Capturing all funding streams at onboarding (vs buried in notes)
- **Tertiary**: Meeting booking gated by signing → reduced wasted assessment resources (~$100K/yr)

### Cost Savings

- **Sales time**: Single data entry point vs duplicate entry across Zoho + PUSH form
- **Assessment resources**: No more meetings with uncommitted clients
- **Data quality**: Portal as source of truth reduces inconsistent/incomplete data

---

## Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Assessment Tool not ready for integration | Medium | High | MVP uses external tool with button/link; define clear payload contract |
| Not-signable resolution takes too long | Low | Medium | SLA targets (24-48hr); packages index gives visibility |
| Zoho API sync failures | Low | High | Retry logic, idempotent operations, manual intervention flag |
| Sales resistance to new workflow | Medium | Medium | Wizard pre-fills from lead record; fewer steps than current process |
| Coordinator hold blocking too many agreements | Low | Medium | Most coordination resolved in-wizard (Step 4); only remote area and unknown cases remain as holds |
| Monash Model remoteness data unavailable | Low | Medium | Default to TC Internal with manual review flag |
| Coordinator database incomplete | Medium | Medium | Ensure coordinator database is seeded with all active coordinators and fees before launch |

---

## Out of Scope (Confirmed)

| Item | Owner | Timeline |
|------|-------|----------|
| Signature capture (all methods) | Client HCA | Concurrent / next phase |
| Meeting booking | Client HCA / TBD | After signing gate implemented |
| SLA reminders for unsigned agreements | Client HCA | Concurrent / next phase |
| Not-signable resolution workflows | Clinical / Ops owners | Respective epics |
| Exit vs Terminate flows | Client HCA | TBD |
| Agreement Amendments / Variations | Client HCA | TBD |
| ACER Lodgement Automation | Client HCA | TBD |
| Lead record enrichment | LES / LDS | Future epics |
