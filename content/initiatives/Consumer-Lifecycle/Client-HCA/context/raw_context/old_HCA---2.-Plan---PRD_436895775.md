---
title: "Trilogy Care Portal : HCA - 2. Plan - PRD"
---

<div id="page">

<div id="main" class="aui-page-panel">

<div id="main-header">

<div id="breadcrumb-section">

1.  [Trilogy Care Portal](index.html)
2.  [Consumer Journey](Consumer-Journey_436208084.html)
3.  [HCA - Client HCA](HCA---Client-HCA_436896376.html)

</div>

# <span id="title-text"> Trilogy Care Portal : HCA - 2. Plan - PRD </span>

</div>

<div id="content" class="view">

<div class="page-metadata">

Created by <span class="author"> Mike Wise</span>, last modified by <span class="editor"> David Henry</span> on Oct 29, 2025

</div>

<div id="main-content" class="wiki-content group">

# 2. PRD – Client Home Care Agreement (HCA)

## PRD Overview

<div class="table-wrap">

|  |  |
|----|----|
| Field | Entry |
| Document Status | Draft |
| Confluence Status | Drafted on 26/Oct |
| Jira ID (Epic) | <span class="confluence-jim-macro jira-issue" jira-key="TP-1865"> <a href="https://trilogycare.atlassian.net/browse/TP-1865" class="jira-issue-key"><img src="https://trilogycare.atlassian.net/images/icons/issuetypes/epic.svg" class="icon" />TP-1865</a> - <span class="summary">\[HCA\] Client HCA \[TP-1865\]</span> <span class="aui-lozenge aui-lozenge-subtle aui-lozenge-complete jira-macro-single-issue-export-pdf">Triaged</span> </span> |
| Internal / SharePoint Links |  |
| Document Owner |  |
| Designer |  |
| Tech Lead |  |
| QA |  |
| Target Release |  |

</div>

------------------------------------------------------------------------

## 1. Executive Summary

**Problem Statement**  
Clients and representatives currently execute Home Care Agreements (HCAs) outside the Portal (e.g., DocuSign/PDF), creating friction, missed SLAs, and weak auditability during Support at Home (SAH) transition. We need a **Portal-native contracting experience** that introduces a **pre-meeting “Sample HCA”** (non-offer), **first-login routing** to signing when required, **explicit state model** (Sample → Sent → Signed, plus Terminated/Reactivate), **amendments/variations** (e.g., management option or coordinator change), **durable consent artefacts** (digital signature, uploaded signed PDF, or **verbal consent with minimum transcript + call ID**, audio link preferred), **reminders/escalations**, **annual review triggers**, and **lifecycle visibility**. Interim Zoho bridging is acknowledged; north-star is Portal-native. 【turn1file16†source】

**Audience**  
Recipients & Representatives / Care Partners / Sales & Assessment / Operations & Finance / Compliance. 【turn1file19†source】

**Outcomes**

1.  Reduce time-to-contract and drop-offs; 2) Improve consent auditability and compliance; 3) Prepare for SAH scale with clear states, SLAs, and artefact storage. 【turn1file16†source】

------------------------------------------------------------------------

## 2. Goals & Success Metrics

<div class="table-wrap">

|  |  |  |
|----|----|----|
| Goal | Metric | Target |
| Faster agreement completion | Median time from **Sent** → **Signed** | ≤ 24 hours |
| Robust consent audit | % agreements with complete artefacts (sig OR PDF OR transcript+call ID) | ≥ 99% |
| First-login conversion | % first-login users completing HCA in-session (if required) | ≥ 80% |
| Reduce manual follow-ups | % agreements auto-closed via reminders (no staff chase) | ≥ 60% |
| Lifecycle visibility | % agreements with accurate state (incl. Terminated/Reactivate) | 100% |

</div>

**Assumptions**

- Interim **Zoho** form/webhook bridging persists during migration; long-term flow is Portal-native. 【turn1file16†source】

- **TPC (Third-Party Contracts)** will live under **Other Agreements** within the Agreements area.

- External contact/identity feeds (Services Australia / My Aged Care) may be imperfect; we store durable IDs/links where available. 【turn1file16†source】

------------------------------------------------------------------------

## 3. Background / Context

- Meeting direction prioritises **Portal-native contracting**, **pre-meeting Sample HCA** (watermarked, non-offer), post-meeting conversion to actionable **Sent**, **first-login routing** into Agreements if unsigned, strengthened **verbal consent minimum** (transcript + call ID; audio/link preferred), and **annual review** trigger. 【turn1file16†source】

- Broader BRP/SAH materials emphasise contracting readiness, mobile usage patterns, and scaled artefact storage/auditability. 【turn1file14†source】

------------------------------------------------------------------------

## 4. Definitions

<div class="table-wrap">

|  |  |
|----|----|
| Term | Definition |
| Agreements (Portal Area) | New Recipient Portal section hosting **HCA**, **Variations**, and **Other Agreements** (e.g., ATHM, oxygen supply, **TPC**) with list/detail views and lifecycle states. 【turn1file19†source】 |
| HCA | Client Home Care Agreement – primary contract to commence services. |
| Sample (state) | **Watermarked, non-offer** preview shown pre-meeting; becomes actionable post-meeting. 【turn1file16†source】 |
| Sent (state) | Actionable agreement issued for signing. |
| Signed (state) | Executed agreement (digital signature, uploaded signed PDF, or **verbal consent** per minimum requirements). |
| Terminated / Reactivated | Lifecycle end / restart; history retained and auditable. 【turn1file16†source】 |
| Variations | Amendments such as management option or coordinator change, retaining version history and effective dates. 【turn1file16†source】 |
| Other Agreements | Non-HCA artefacts surfaced under Agreements (e.g., ATHM, oxygen supply, **TPC**). |

</div>

------------------------------------------------------------------------

## 5. Requirements (User Stories)

> All user stories assume proper permissions (recipient, authorised representative, or staff role) and full audit logging of reads/changes. 【turn1file19†source】

<div class="table-wrap">

|  |  |  |  |  |
|----|----|----|----|----|
| Ref | Description | Acceptance Criteria (incl. scenario) | MoSCoW | Other info |
| US-A1 | Create the **Agreements** area in Recipient Portal IA. | Given I’m an authorised user, when I open Portal then I see a left-nav/tab **Agreements** (feature-flagged). | Must | Hosts HCA, Variations, Other Agreements. 【turn1file19†source】 |
| US-A2 | Render **three sections** inside Agreements. | Lists for **HCA** (pinned first), **Variations**, **Other Agreements**; each row shows Type, Stage (Sample/Sent/Signed/Terminated/Reactivate), Created Date, Signed Date; empty states defined. | Must | TPC lives in **Other Agreements**. 【turn1file16†source】 |
| US-A3 | **Detail view** for any agreement. | Detail shows “Basic Facts” (type, state, dates, parties), artefact viewer/link, lifecycle history; breadcrumb back to Agreements. | Must | Matches template design notes. 【turn1file19†source】 |
| US-01 | **First-login redirect** to Agreements if no Signed HCA. | Given first login and HCA≠Signed, when I authenticate then I am routed to Agreements with explainer; bypass requires explicit exit; event logged. | Must | Meeting directive. 【turn1file16†source】 |
| US-03 | **Sample HCA** pre-meeting → **Sent** post-meeting. | “Sample” shows watermark and no sign controls; when post-meeting flag is set then state→Sent and signing UI unlocks; transitions logged. | Must | Introduces **Sample** state. 【turn1file16†source】 |
| US-04 | **Digital signing** in Portal. | Capture signature; store signed artefact or durable link; stamp signer ID, time; ACs: error states, retries, accessibility. | Must |  |
| US-05 | **Upload signed PDF** (manual signing path). | Staff can attach a signed PDF; set state=Signed; log uploader, time, reason; artefact retrievable. | Must |  |
| US-06 | **Verbal consent** capture (strengthened minimum). | Required: transcript text + call ID; Optional: audio URL; when saved then state=Signed; all fields audited. | Must | Verbal minimum from meeting. 【turn1file16†source】 |
| US-08 | **Variations** management. | Create variation linked to HCA; version chain; effective dates; artefact (PDF) rendered; notify stakeholders; visible under Variations. | Must | Management option & coordinator changes. 【turn1file16†source】 |
| US-09 | **Other Agreements** incl. **TPC**. | List + detail UX; artefact storage/links; states/dates; optional cross-links to Suppliers/Services for context. | Must | TPC kept here by decision. |
| US-A6 | **Search / filter / export** within Agreements. | Filter by type, stage, date range; keyword search; paginated; CSV export (permissions-aware). | Should |  |
| US-A7 | **Permissions & privacy**. | Recipients see their package agreements; reps see those they are entitled to; staff by role; reads/writes logged. | Must |  |
| US-A8 | **Backend models & APIs**. | DB schema for agreements, states, artefacts, signatures, verbal records; REST/GraphQL for list/detail/create/update; file store for PDFs/audio/transcripts with durable links + retention metadata. | Must |  |
| US-A9 | **Interim migration & Zoho bridging**. | One-time backfill of historical HCAs; connectors/feature flags to ingest Zoho-originated agreements until cutover; backfill call IDs where available. | Should | Meeting acknowledges bridging. 【turn1file16†source】 |
| US-A10 | **Notifications / SLAs** for “Sent”. | Auto reminder at T+24h; escalation at T+48h (channels templated); delivery status logged on record. | Should | SLA timings to confirm. 【turn1file16†source】 |
| US-11 | **Terminate / Reactivate** lifecycle. | Terminate with reason; read-only historical access; Reactivate restarts flow; all events audited. | Should | Ex-client visibility TBD. 【turn1file16†source】 |
| US-A12 | **Annual Review** trigger. | “Annual Review Due” field; dashboard; notifications at 30/7/1-day pre-due; completion logging. | Should | Added from meeting. 【turn1file16†source】 |

</div>

------------------------------------------------------------------------

## 6. Out of Scope

- Provider claims/billing/MYOB workflows (beyond storing agreement artefacts/links). 【turn1file14†source】

- Bespoke DocuSign template management UIs (outside artefact capture). 【turn1file19†source】

------------------------------------------------------------------------

## 7. Open Questions

1.  **Ex-client visibility:** Should ex-clients retain Portal access to view past agreements and a “Rejoin” CTA? 【turn1file16†source】

2.  **TPC cross-surfacing:** While **TPC remains under Other Agreements**, do we also surface a read-only view under Suppliers/Services? 【turn1file16†source】

3.  **SLA policy:** Confirm reminder/escalation timings (24h/48h?) and channels (email/SMS/in-app). 【turn1file16†source】

4.  **Durable storage:** Confirm system of record for audio and retention policy; minimum remains transcript + call ID. 【turn1file16†source】

------------------------------------------------------------------------

## 8. User Interaction & Design Notes

- **Navigation & IA:** Add **Agreements** to primary Recipient Portal nav. Inside: three blocks — **HCA** (pinned), **Variations**, **Other Agreements** (ATHM, oxygen supply, **TPC**). Each shows Type, Stage, Created/Signed dates. Selecting opens detail (Facts panel + artefact). **First-login redirect** here if HCA≠Signed. 【turn1file19†source】【turn1file16†source】

- **State Model & Gating:** **Sample** (non-offer, watermarked) → **Sent** (actionable) → **Signed**; plus **Terminated/Reactivate**. Post-meeting flag flips Sample→Sent. All transitions audited. 【turn1file16†source】

- **Consent Patterns:** Digital sign; staff upload signed PDF; **verbal consent form** (required transcript + call ID; optional audio link). Artefacts stored or durably linked. 【turn1file16†source】

- **Accessibility & Devices:** Mobile-friendly lists/detail (significant mobile usage); clear state chips; readable dates; large tap targets. 【turn1file14†source】

------------------------------------------------------------------------

## 9. Milestones

<div class="table-wrap">

|  |  |  |  |  |
|----|----|----|----|----|
| Phase | Owner | Start | End | Status |
| Design – Agreements area (IA, list + detail, states) |  |  |  | Planned |
| Backend – Models, storage, APIs |  |  |  | Pending |
| Frontend – Tab + lists + detail views |  |  |  | Pending |
| Migration/Bridging – Historical HCAs + Zoho connectors |  |  |  | Pending |
| Notifications/SLAs |  |  |  | Pending |
| QA / UAT |  |  |  | Pending |
| Release |  |  |  | Pending |

</div>

------------------------------------------------------------------------

## 10. Reference Materials

- **Meeting recap** (states, first-login routing, consent minimums, TPC placement, annual review, lifecycle & Zoho bridging). 【turn1file16†source】

- **BRP / SAH context** (portal usage insights; programme drivers). 【turn1file14†source】

- **PRD template structure** (section/table conventions). 【turn1file19†source】

- **Initiative index** (Client HCA appears within 2025 BRP initiative set). 【turn1file15†source】

</div>

</div>

</div>

<div id="footer" role="contentinfo">

<div class="section footer-body">

Document generated by Confluence on Nov 07, 2025 09:52

<div id="footer-logo">

[Atlassian](http://www.atlassian.com/)

</div>

</div>

</div>

</div>
