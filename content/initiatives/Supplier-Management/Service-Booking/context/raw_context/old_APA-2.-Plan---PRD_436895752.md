<div id="page">

<div id="main" class="aui-page-panel">

<div id="main-header">

<div id="breadcrumb-section">

1.  [Trilogy Care Portal](index.html)

</div>

# <span id="title-text"> Trilogy Care Portal : APA 2. Plan - PRD </span>

</div>

<div id="content" class="view">

<div class="page-metadata">

Created by <span class="author"> Mike Wise</span>, last modified by <span class="editor"> William Whitelaw</span> on Oct 21, 2025

</div>

<div id="main-content" class="wiki-content group">

# Planned Service → Multi‑Provider Booking System

### Functional / Data‑Model Specification (Draft v0.2)

------------------------------------------------------------------------

## Executive Summary ✍️

### Problem — Why now?

> *Urgency of First Service is not necessarily given to Service Providers when Packag commences. Will have a material impact on the Utilisation Rate early in a person’s package.*

### Audience

> *Care Partners, Service Providers, Recipients (self-Managed), Care Coordinators*

### Desired Outcome

> *Placeholder: faster provider matching, transparent acceptance tracking, improved SLA compliance, and audit‑ready records.*

------------------------------------------------------------------------

## Goals & Success Metrics

<div class="table-wrap">

|  |  |  |  |
|----|----|----|----|
| \# | Goal | Metric | Target |
| 1 | *e.g. Reduce average provider acceptance time* | Median hours from invite → accept | \< 24 h |
| 2 | *e.g. Improve provider participation* | % of bookings receiving any response | \> 90 % |

</div>

------------------------------------------------------------------------

## Assumptions

- Providers have reliable email access and can authenticate in the portal.

- Planned Service data (scope, schedule, cost) is complete before invitation.

- A single provider acceptance will normally fulfil the service (winner‑takes‑all), unless explicitly configured otherwise.

------------------------------------------------------------------------

## User Story

> **As** a Care Partner (or Recipient) creating a Planned Service,  
> **I want** to invite one or more Service Providers and track their responses,  
> **so that** the first suitable provider can be contracted quickly under the APA agreement and work can commence without manual chasing.

------------------------------------------------------------------------

## Out‑of‑Scope (phase‑1)

- Pricing/quote negotiation loop.

- SLA auto‑calculation.

- Multi‑signature APA generation.

- Service Provider search engine.

- Preferred Service Provider logic.

------------------------------------------------------------------------

## User Interaction & Design

- **Planned Service → Bookings tab:** list with urgency badge, status pills, and quick filters.

- **Create Booking**: modal (multi‑select providers, urgency selector, message textarea) → send.

- **Provider Portal/ViewLink:** booking summary, T&C checkbox, Accept/Reject buttons.

- **Staff inline actions:** resend email, withdraw, change urgency, view audit trail.

------------------------------------------------------------------------

## 1 Purpose

Enable TC‑Portal to:

- attach **multiple Service Providers** to a single **Planned Service** via individual **Bookings** (pivot records)

- track each booking’s lifecycle (invite → accept/reject/decline). Booking will be added by Care Partner and/or recipients.

- enforce or capture urgency rating (low,med,high), expiration, notes, and terms of the APA.

- generate & log a **Booking Email** workflow

- support eventual contractual grouping under an **APA Service Agreement** (umbrella record that aggregates Bookings once final provider is selected).

------------------------------------------------------------------------

## 2 Context & Key Objects

<div class="table-wrap">

|  |  |  |
|----|----|----|
|  Entity  |  Description  | Key Relations  |
| **Package** | Funding package that owns one or more Planned Services. | 1 → N to Planned Service |
| **Planned Service** | Planned piece of care/work (scope, schedule, cost estimate). | Belongs‑to Package. 1 → N Bookings. Optional risks. |
| **Risk** | Risk items logged during assessment (e.g., lone‑worker, infection). | Many risks ↔ one Planned Service. |
| **Booking** | *Pivot* row linking a Planned Service to **one** Service Provider invitation. | Many Bookings ↔ one Planned Service & one Service Provider. |
| **Service Provider** | External provider org/user. | Can have many bookings. |
| **APA Service Agreement** | Legal/financial agreement created once a provider accepts. Contains the accepted Booking(s). | 1 → N accepted Bookings. |

</div>

------------------------------------------------------------------------

## 3 Booking Record – PIVOT Table

<div class="table-wrap">

|  |  |  |
|----|----|----|
|  Field  |  Type / Enum  |  Notes  |
| `id` | PK |  |
| `planned_service_id` | FK |  |
| `service_provider_id` | FK |  |
| `status` | ENUM `pending`, `accepted`, `rejected`, `declined`, `expired`, `withdrawn`, `info_requested` |  |
| `urgency` | ENUM `low`, `medium`, `high` | default `medium` |
| `message_to_provider` | text | Scope/notes merged into booking email |
| `provider_response_message` | text | Free‑text reply when provider rejects or requests info |
|  |  |  |
| `booking_email_sent_at` | datetime |  |
| `responded_at` | datetime | first response timestamp |
| `accepted_terms` | boolean | must be true if status =`accepted` |
| `terms_version` | string | hash or version \# of T&C |
| `accepted_at` / `rejected_at` etc. | datetimes | per‑status audit |
| Meta | created/updated/by | standard audit |

</div>

------------------------------------------------------------------------

## 4 Status Flow (happy path)

<div class="code panel pdl" style="border-width: 1px;">

<div class="codeContent panelContent pdl">

``` syntaxhighlighter-pre
pending  --accept-->  accepted  --(optional) create APA Service Agreement
        \--reject-->  rejected
        \--decline--> declined (provider declines without evaluation)
        \--info_requested--> pending (after clarification sent)
pending (timeout) --> expired
admin withdraw --> withdrawn
```

</div>

</div>

------------------------------------------------------------------------

## 5 Email & Acceptance Workflow

1.  **Booking Email** auto‑triggers on create (`pending`).

    - Includes service summary, urgency badge, message, deep‑link(s).

2.  **Option A (Portal‑first)**

    - Link → login → modal with booking details & T&C → provider clicks **Accept** or **Reject**.

3.  **Option B (Email‑direct)** (MVP alt)

    - Signed URL contains JWT & hash of T&C. Single click registers acceptance; optional confirmation page.

4.  System updates status + audit fields, fires webhook/notification to internal staff, and (if `accepted`) transitions other `pending` bookings → `expired` (configurable).

------------------------------------------------------------------------

## 6 Data & Integration

- **Email templates** managed in Notify‑style template engine.

- **Audit**: all status changes captured via `booking_events` table or event‑store.

- **Reporting**: show acceptance rate, avg response time, expiry counts.

------------------------------------------------------------------------

## 7 Open Questions & Decisions Needed

(unchanged from previous version – see lines below)

1.  **Acceptance Path:** Do we implement Option A (Portal login) first, Option B (email‑direct), or support both?

2.  **Auto‑expire logic:** After an acceptance, should all other pending bookings *always* expire, or is manual selection allowed?

3.  **Risk Tagging:** Should Risks be linked at the Booking level (copy from Planned Service)? Or just all links to Planned Service Link

4.  **Urgency default & editability:** Can raise/lower urgency after creation? triggers re‑email?

5.  **Terms & Conditions:** One global APA, per service‑type, or per provider? need versioning strategy.

6.  **Notifications:** Should provider see reminders before expiry? internal SLA alerts?

7.  **APA Service Agreement creation:** auto‑generate on first acceptance or manual?

8.  **Partial fulfilment:** Can multiple providers *jointly* accept (e.g., split work) or is it winner‑takes‑all?

9.  **Decline vs Reject semantics:** keep both or merge?

10. **Security:** token lifespan for email acceptance links; revoke on status changes?

11. **Bulk‑invite:** How many providers max per Planned Service?

12. **Reporting granularity:** any regulatory fields (e.g., Support @ Home) that must be captured at booking level?

------------------------------------------------------------------------

## Vibe App

> <a href="https://trilogycare-my.sharepoint.com/:u:/g/personal/romyb_trilogycare_com_au/EcQxBvMr2OhNuEp8gKZP2ZYBQZH0f048njIcZk-Ym5R6MA?e=p1yclr" class="external-link" rel="nofollow">trilogy-smart-forms-prototype.html</a>

------------------------------------------------------------------------

## Reference Materials

- System diagram: `booking‑flow.png` (2025‑07‑23)

- Support @ Home Program Manual v3 PDF (internal)

- Related tickets: TC‑1234, TC‑1240

<span class="confluence-embedded-file-wrapper image-center-wrapper confluence-embedded-manual-size"><img src="attachments/436895752/436897408.png?width=760" class="confluence-embedded-image image-center" loading="lazy" data-image-src="attachments/436895752/436897408.png" data-height="913" data-width="1071" data-unresolved-comment-count="0" data-linked-resource-id="436897408" data-linked-resource-version="1" data-linked-resource-type="attachment" data-linked-resource-default-alias="{524F9B94-601A-488C-AF75-13A46688B7AA}-20250807-022637.png" data-base-url="https://trilogycare.atlassian.net/wiki" data-linked-resource-content-type="image/png" data-linked-resource-container-id="436895752" data-linked-resource-container-version="2" data-media-id="211323d5-9f85-4dbe-903b-aac8cad20d94" data-media-type="file" width="760" /></span>

------------------------------------------------------------------------

### Next Steps

- Confirm decisions on Section 7 questions.

- Break down into epics → backend, email service, UI, migrations.

- Produce wireframes (if required).

- Add acceptance criteria & test cases.

------------------------------------------------------------------------

</div>

<div class="pageSection group">

<div class="pageSectionHeader">

## Attachments:

</div>

<div class="greybox" align="left">

<img src="images/icons/bullet_blue.gif" width="8" height="8" /> [{524F9B94-601A-488C-AF75-13A46688B7AA}-20250807-022637.png](attachments/436895752/436897408.png) (image/png)  

</div>

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
