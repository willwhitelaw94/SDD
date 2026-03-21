# Multiple Funding Streams
## Solution Summary & Process Flow

**Document Status:** Working Summary
**Last Updated:** 6 February 2026
**Source Meetings:** Jan 30 (Initial), Feb 6 AM (LTH), Feb 6 (Will's Architecture), Feb 6 PM (Beth UI)

---

# Executive Summary

## The Problem

Clients can have multiple funding streams (Ongoing, ATHM, Restorative Care, End of Life) but current systems only support single-stream onboarding. This causes:

- Lost revenue from untracked funding streams
- Funding withdrawals when entries are lodged after take-up date expiry
- Unpaid invoices due to unverified funding streams
- Accidental full client termination when exiting single funding streams

## The Solution

Portal becomes the source of truth. A four-step conversion form in Portal replaces Zoho's lead conversion. Agreements cover all current and future services by default. Individual funding streams (classifications) can be tracked, lodged, and exited independently.

## Urgency

**Critical.** Clients are currently unclaimable. Under Support at Home rules, recording an entry even one day after the take-up expiry date results in funding withdrawal by Services Australia.

---

# The Process: End-to-End Flow

## Phase 1: Lead Capture (Zoho CRM)

Sales captures lead information in Zoho CRM as normal. Key data captured:

- Client details (name, DOB, contact)
- Preferred management option (indicative only at this stage)
- Coordinator (if external referral)

Lead sync service maintains 1:1 relationship between Zoho lead and Portal lead.

## Phase 2: Risk Survey (Vibe App)

Jackie's team completes the risk survey in the Vibe app. The survey asks:

- Do you live alone?
- Can you use technology?
- Other risk assessment questions

The survey outputs a risk profile determining if the client can self-manage, needs coordination, or requires clinical review before proceeding.

## Phase 3: Lead Conversion (Portal)

Sales clicks Convert button (either in Portal lead index or via custom link in Zoho). This opens a four-step conversion form in Portal:

### Step 1: Referral Code
- Enter 11-digit referral code from My Aged Care (mandatory, unique per client)
- This validates the client exists in MAC

### Step 2: Classifications
- Check My Aged Care to see available funding streams
- Multi-select classifications (Ongoing, ATHM, Restorative Care, End of Life, etc.)
- Default: consent to ALL services (current and future)
- If client opts out of specific classifications, deselect those

### Step 3: Risk Survey Result & Consent
- Confirm Vibe survey has been completed
- If flagged for clinical review: agreement stays in Draft
- If clear: agreement can proceed to Sent
- Upload IAT (assessment document)

### Step 4: Finalize
- Review and confirm all details
- On submission: Package created in Portal
- API call converts lead in Zoho (creates Deal + Care Plan + Consumer records)
- Home Care Agreement (HCA) created with selected classifications

## Phase 4: Clinical Review (If Required)

Only ~2% of clients require clinical review (60 of last 3,000).

- Clinical team sees index of HCAs in Draft requiring intervention
- IAT auto-generates needs, goals, and risks for review
- Clinical approves: ticks "OK to sign now"
- Target SLA: 24 hours

## Phase 5: Agreement Signing

Once cleared (either immediately or after clinical review):

- Agreement sent to client for signing
- Agreement covers ALL services by default (no re-signing needed for future funding)
- Client signs agreement
- Agreement status: Draft → Sent → Signed

## Phase 6: ACER Lodgement

Once agreement is signed, ACER entries can be lodged:

- Nightly poll at midnight checks classification statuses
- System automatically lodges ACER entries via API (replaces Brennan's manual process)
- Each classification tracks: Lodged (Y/N), Lodged Date, Entry Date, Exit Date

## Phase 7: Assessment & Care Plan

Concurrent with agreement signing:

- Assessment meeting booked with care partner
- Budget created covering all active classifications
- Care plan finalized and sent
- Package status: Onboarding → Active

---

# Existing Clients: New Funding Streams

When an existing client gets new funding allocated (e.g., ATHM-only client gets Ongoing):

## Detection

1. Nightly API poll detects new funding allocated in My Aged Care
2. New funding appears in Portal inbox tab: "Allocated but Unverified"
3. Care partner is notified via inbox (not email)

## Action

1. Care partner confirms client consent for new funding stream
2. Because original agreement covers "all services", no amendment needed
3. System lodges ACER entry for new classification
4. Budget updated to include new funding stream

---

# Exiting Funding Streams vs Terminating Clients

## Key Terminology

| Term | Meaning |
|------|---------|
| **Exit** | Close an individual funding stream (classification) |
| **Terminate** | End entire client relationship (only when ALL funding streams closed) |

## Exit Process (Individual Funding Stream)

1. Care partner initiates exit in Portal for specific classification
2. Warning displayed: "You are about to exit [Classification] for [Client]"
3. Care partner confirms
4. Portal calls Departure API to exit that funding stream only
5. Classification marked as exited; other classifications remain active

## Termination (Full Client)

- Only occurs when ALL funding streams are closed
- Portal detects no active funding streams remaining
- Package status moves to Terminated
- ~60% of monthly exits are death or residential moves (closes all streams)

---

# Classification Tracking

Each classification (funding stream) tracks four key dates:

| Date Field | Meaning |
|------------|---------|
| **Aware Date** | When we first knew about it (e.g., awaiting assignment in MAC) |
| **Available Date** | When funding became available (= entry date for ACER) |
| **Lodged Date** | When we lodged the ACER entry |
| **Exit/Expired Date** | When it ended (terminated or expired) |

Care partners see these statuses in the Portal UI to track progression and take action when needed.

---

# Agreement Amendments

## When Amendments Are NOT Needed

- New funding stream allocated (agreement already covers "all services")
- Exiting a single funding stream

## When Amendments ARE Needed

- Management option change (e.g., SM to SM+) — triggers 20% fee change
- Client withdraws consent for specific classification

## Amendment Workflow

1. Change triggers amendment (e.g., fee change)
2. Agreement status: Signed → Amended
3. Updated budget attached to amendment email
4. Client signs amendment
5. New fees apply to future planning (actuals reflect prior rates)

---

# Coordination Fee Rules

| Funding Stream | Coordinator | Coordination Fee |
|----------------|-------------|------------------|
| **Restorative Care** | Trilogy (always) | 0% always |
| **End of Life** | Trilogy | 10% always |
| **End of Life** | External | Per their fee schedule |
| **Ongoing** | Any | Per agreed management option |

**Key complexity:** Restorative Care is always internally coordinated at 0%, even if the client has an external coordinator for their Ongoing package. The external coordinator's fee only applies to Ongoing services.

---

# System Architecture Summary

| System | Role |
|--------|------|
| **Portal** | Source of truth. Lead conversion form, package management, HCA, budgets, classification tracking, individual exits |
| **Zoho CRM** | Lead capture, Deal/Care Plan/Consumer records (for legacy reporting), full client termination |
| **My Aged Care** | Source for referral codes, funding stream availability. Manual lookup (no API) |
| **Services Australia API** | Nightly poll for funding status. Entry/Departure API for ACER lodgement |
| **Vibe App** | Risk survey (temporary — will be embedded in Portal later) |

---

# MVP Scope

## In Scope

- Lead sync service (Zoho ↔ Portal)
- Four-step conversion form in Portal
- Multi-select classifications on HCA
- ACER status tracking (lodged / not lodged)
- Inbox tab for "allocated but unverified" funding
- Individual classification exit capability
- Automated ACER lodgement via API
- Risk survey integration (checkbox referencing Vibe result)
- Clinical review index for flagged agreements

## Descoped (Future Iterations)

- Individual entry/exit dates per classification (use commencement date for MVP)
- Clinical care partner assignment
- Bespoke coordinator fees per classification
- Native risk survey in Portal (keep Vibe for now)
- Full one-to-many care partner filtering

---

# Open Questions

| Question | Answer |
|----------|--------|
| Can we get subform space on consumer module, or must we build custom module? | Zoho only allows 2 subforms per module and consumer module is maxed out. Will need to build custom module with Deluge script. |
| Who validates the mutual exclusivity rules — Zoho or Portal? | Zoho handles validation via JavaScript/Deluge on the form. Portal trusts the data coming through but can add secondary validation if invalid combinations slip through. |

---

# Action Items

| Owner | Action |
|-------|--------|
| **Tim** | Build four-step conversion form in Portal |
| **Tim** | Implement multi-select classifications with Zoho integration |
| **Tim** | Build nightly sync for funding status polling |
| **Tim** | Automate ACER lodgement via Entry/Departure API |
| **Tim** | Create state transition diagrams for lead-to-HCA lifecycle |
| **Dave** | Add array support for multi-select in Zoho sync service |
| **Dave** | Stop using Zoho convert button; coordinate Portal button |
| **Beth** | Design HCA UI with multi-classification + consent capture |
| **Beth** | Design clinical review index view |
| **Beth** | Design amendment workflow UI |
| **Romy** | Provide coordination fee matrix |
| **Romy** | Training plan for 200 coordinators |
| **Will** | Stakeholder validation during development |
