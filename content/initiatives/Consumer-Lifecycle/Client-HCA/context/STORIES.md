---
title: "User Stories – Client Home Care Agreement (HCA)"
---

**Epic**: HCA - Client Home Care Agreement
**Initiative**: Consumer Journey (TP-1858)
**Jira Epic**: [TP-1865](https://trilogycare.atlassian.net/browse/TP-1865)
**Full Specification**: [spec.md](./spec.md)

---

## Priority Summary

| Priority | Count | Description |
|----------|-------|-------------|
| P1 | 6 | Core signing flow + SAH recontracting - must have for launch |
| P2 | 10 | Important features for compliance, operations, and migration |
| P3 | 3 | Nice-to-have enhancements |

---

## P1 Stories (Core)

### HCA-US01: First-Login HCA Signing Flow
Guide new recipients directly to HCA signing on first login.
- **Jira**: Part of TP-1865

### HCA-US02: Digital In-Portal Signature
Enable recipients to sign HCA digitally within the Portal.
- **Jira**: Part of TP-1865

### HCA-US03: View Agreements List
Display all agreements (HCA, Variations, Other) in a unified list view.
- **Jira**: Part of TP-1865

### HCA-US04: View Agreement Details
Show agreement details with facts panel, artefact viewer, and lifecycle history.
- **Jira**: Part of TP-1865

### HCA-US05: Draft HCA to Sent Transition
Gate HCA signing until post-meeting flag is set (Draft → Sent).
- **Jira**: Part of TP-1865

### HCA-US18: Bulk Recontracting for SAH Transition
Send new agreements to ~10,000 clients, coordinators, brokered managers, and suppliers for Support at Home transition.
- **Jira**: [TCR-35](https://trilogycare.atlassian.net/browse/TCR-35) (blocked by TP-516)

**Campaign Management**:
- [ ] Create recontracting campaigns with selectable target audiences
- [ ] Attach cover letters, appendices, service lists, DD authorities
- [ ] Batch sending to ~10,000+ recipients

**Multi-Channel Delivery**:
- [ ] Email with magic link to Portal (primary)
- [ ] Postal mail with tracked delivery (fallback)
- [ ] Verbal recontracting with transcript + call ID
- [ ] Translated versions for multi-language support

**Tracking & Follow-up**:
- [ ] Campaign dashboard: Sent, Opened, Signed, Declined, No Response
- [ ] Automatic follow-up reminders at configurable intervals
- [ ] Filter non-responders by channel, days outstanding, audience type
- [ ] Flag coordinators who have not agreed to new rate
- [ ] Track amendments and authorised rep changes
- [ ] Export full audit trail

**Note**: Decision register indicates Portal-native approach preferred (Asim working on it). Zoho Sign/Forms and DocuSign as alternatives if needed.

---

## P2 Stories (Important)

### HCA-US06: Upload Signed PDF
Allow staff to upload signed PDF for manual signing path.
- **Jira**: Part of TP-1865

### HCA-US07: Verbal Consent Capture
Record verbal consent with transcript and call ID (minimum requirement).
- **Jira**: Part of TP-1865

### HCA-US08: Create and Manage Variations
Track amendments (management option changes, coordinator changes) with version history.
- **Jira**: Part of TP-1865

### HCA-US09: SLA Reminders and Escalation
Automatic reminders at T+24h and escalation at T+48h for unsigned agreements.
- **Jira**: Part of TP-1865

### HCA-US14: ACER Status Tracking
Track ACER lodgement status (Pending/Lodged/Confirmed/Failed) with Services Australia.
- **Jira**: [TP-533](https://trilogycare.atlassian.net/browse/TP-533), [TC-2498](https://trilogycare.atlassian.net/browse/TC-2498)

**Acceptance Criteria**:
- [ ] HCA model has an `acer_status` field with states: `pending`, `lodged`, `confirmed`, `failed`, `manual_override`
- [ ] After HCA reaches "Signed" state, a background job is dispatched to lodge via ACI
- [ ] ACI integration logs the lodgement and updates `acer_status` based on response
- [ ] HCA detail view displays the current ACER status with appropriate styling (pending=yellow, confirmed=green, failed=red)
- [ ] Admin users can manually set/override the ACER status with a reason note
- [ ] Status changes are logged in the audit trail with timestamps and user attribution
- [ ] Failed lodgements trigger a notification to the relevant team for manual follow-up

**Technical Notes**:
- Integrate with existing ACI (Aged Care Interface) connection
- Use Laravel Jobs + Horizon for background processing
- Consider retry logic with exponential backoff for transient ACI failures
- Store lodgement attempts and responses for debugging

---

### HCA-US15: Terminate Flow with Compliance
Terminate HCA through structured workflow with compliance triggers.
- **Jira**: [TP-516](https://trilogycare.atlassian.net/browse/TP-516)

**Acceptance Criteria**:
- [ ] "Terminate Agreement" action available on signed HCAs (permission-gated)
- [ ] Termination wizard captures:
  - Termination reason (dropdown with standard reasons)
  - Effective date
  - Final statement requirements
  - Notes/comments
- [ ] Termination triggers:
  - HCA state changes to "Terminated"
  - Package status update
  - Notification to relevant stakeholders
  - ACI notification (if required)
- [ ] Terminated HCAs show termination details (date, reason, terminated by)
- [ ] Reactivation path available for eligible cases (e.g., client returns)
- [ ] Full audit trail of termination actions

**Termination Reasons**:
- Transition to another provider
- Entry to residential care
- Death
- Voluntary exit from program
- Other (with notes required)

**Technical Notes**:
- Follows existing state model: Signed → Terminated
- Consider Reactivate as a separate state transition
- Ensure compliance with Services Australia notification requirements
- Coordinate with Billing for final statement generation

---

### HCA-US16: Package Management Option Selection (HCA Signing)
Allow recipients to confirm/change management option during HCA signing.
- **Jira**: [TC-2113](https://trilogycare.atlassian.net/browse/TC-2113), [TP-527](https://trilogycare.atlassian.net/browse/TP-527)

**Acceptance Criteria**:
- [ ] Management option selection displayed during HCA signing flow
- [ ] All options shown with descriptions, benefits: Self-Managed, Self-Managed Plus, Fully Managed
- [ ] Coordinator assignment workflow triggered when managed option selected
- [ ] Self-manage options hidden when coordinator is predefined/mandatory
- [ ] Support multiple price templates per Care Coordinator (e.g., 20% or 25% loading)
- [ ] Notifications sent to recipient, representative, and affected coordinators on change
- [ ] Self-Managed clients see upgrade option to Self-Managed Plus with benefits explained
- [ ] Recipients can confirm/adjust package commencement date

---

### HCA-US17: Switch Management Option (Post-HCA)
Allow recipients/staff to switch management option after HCA is signed.
- **Jira**: [TC-2113](https://trilogycare.atlassian.net/browse/TC-2113), [TP-527](https://trilogycare.atlassian.net/browse/TP-527)

**For Recipients/Representatives**:
- [ ] "Switch Management Option" button on Package Overview page
- [ ] Rich card selector with descriptions, benefits, and cost calculations
- [ ] Self-Managed Plus clients do NOT see downgrade to Self-Managed (coordination partner protection)
- [ ] Change creates HCA Variation with effective date

**For Care Partners/Staff**:
- [ ] "Change Management Option" button with dropdown on Package Overview
- [ ] Form captures: new option, effective date, optional coordinator assignment
- [ ] If new option requires coordinator: can assign coordinator with price template (20%/25% loading)
- [ ] Email + dashboard notification to recipient, primary rep, and new coordinator
- [ ] If new option does NOT require coordinator: previous coordinator is removed
- [ ] Email + dashboard notification to recipient, primary rep, and removed coordinator

**Coordinator Notes**:
- If Coordinator has "Preferred Care Manager", offer to also change care partner
- Coordinator can have multiple price templates - user must select which package

---

### HCA-US19: Zoho Bridging & Historical Migration
Migrate historical HCAs from Zoho and ingest ongoing Zoho agreements during transition.
- **Jira**: Part of TP-1865

**Historical Migration**:
- [ ] One-time backfill of historical HCAs with state, dates, and artefacts
- [ ] Preserve call IDs for audit purposes
- [ ] Display "Migrated from Zoho" indicator on migrated records

**Zoho Bridging (During Transition)**:
- [ ] Webhook listeners for ongoing Zoho agreement events
- [ ] Create Portal agreements from Zoho webhooks with correct state mapping
- [ ] Display "Source: Zoho" indicator on Zoho-originated agreements
- [ ] Feature flags to enable/disable bridging

**Technical Notes**:
- Map Zoho states to Portal states (Draft/Sent/Signed)
- Store durable links to Zoho artefacts or migrate to Portal storage
- Disable connectors via feature flag when Portal-native is fully live

---

## P3 Stories (Nice-to-have)

### HCA-US10: Terminate and Reactivate Agreement
Basic termination and reactivation lifecycle management.
- **Jira**: Part of TP-1865
- **Note**: Superseded by HCA-US15 for full compliance workflow

### HCA-US11: Annual Review Tracking
Track annual review due dates with dashboard and notifications.
- **Jira**: Part of TP-1865

### HCA-US12: Other Agreements (TPC, ATHM, etc.)
Display non-HCA agreements in unified Agreements area.
- **Jira**: Part of TP-1865

### HCA-US13: Search, Filter, and Export
Search, filter, and export agreements for reporting.
- **Jira**: Part of TP-1865

---

## Open Questions

1. **Ex-client visibility**: Should ex-clients retain Portal access to view past agreements and a "Rejoin" CTA?
2. **TPC cross-surfacing**: Should TPC also surface in Suppliers/Services (read-only)?
3. **SLA policy confirmation**: Confirm reminder timings (24h/48h?) and channels (email/SMS/in-app)
4. **Durable storage**: Confirm system of record for audio files and retention policy

---

## Backlog

_Additional stories to be added as requirements are refined._
