<div id="page">

<div id="main" class="aui-page-panel">

<div id="main-header">

<div id="breadcrumb-section">

1.  [Trilogy Care Portal](index.html)

</div>

# <span id="title-text"> Trilogy Care Portal : SSP2. Plan - PRD </span>

</div>

<div id="content" class="view">

<div class="page-metadata">

Created by <span class="author"> Mike Wise</span> on Aug 12, 2025

</div>

<div id="main-content" class="wiki-content group">

<div class="plugin-tabmeta-details">

<div class="table-wrap">

|  |  |
|----|----|
| **Target release** | <span colorid="wrijwfl2dz">Type // to add a target release date</span> |
| **Epic** | <span colorid="f0rnzuysrk">Type /Jira to add Jira epics and issues</span> |
| **Document status** | <span class="status-macro aui-lozenge aui-lozenge-visual-refresh">DRAFT</span> |
| **Document owner** | <span colorid="p5o0hrdaft">@ mention owner</span> |
| **Designer** | <span colorid="i3ykfcaolh">@ designer</span> |
| **Tech lead** | <span colorid="d46z3ds9n2">@ lead</span> |
| **Technical writers** | <span colorid="mkbuigfclj">@ writers</span> |
| **QA** |  |

</div>

</div>

# Service Provider Search Portal

### Product Requirements Document (Draft v0.1)

------------------------------------------------------------------------

## Executive Summary ✍️

We will introduce a **Searchable Service Provider Portal** that enables Care Partners, Care Coordinators, and self‑managed Recipients to quickly discover and invite the right Service Providers (and their regional outlets) based on location, specialty, rating, and sponsorship tier. Preferred or Sponsored Providers will be surfaced at the top of search results, supporting partner‑marketing agreements and faster client matching. Each Provider card will include a *Call‑to‑Action* (CTA) to **Add to Booking**, seamlessly creating a new Booking record in the Planned Service flow shipped in the previous release.

------------------------------------------------------------------------

## Problem — Why Now?

- Only tribal knowledge of best providers in an area, delaying best option for recipient.

- Reliance on third-party marketplaces and fragmented search experience including googling.

- Trilogy has 1000's of providers data available, which can drive price competition and choice and freedom for the searching stakeholder.

- Preferred‑provider commercial agreements cannot be operationalised without search ranking controls.

------------------------------------------------------------------------

## Audience

- **Primary Users:** Care Partners, Care Coordinators, Recipients (self‑managed) on the *client* side of TC‑Portal.

- Secondary Stakeholders: Partnerships (sponsorships), Sales team (during onboarding)

------------------------------------------------------------------------

## Desired Outcomes

- \< 60 sec average time from search‑start to provider invite.

- ≥ 95 % of new bookings created through the search portal (vs. manual provider entry).

- Sponsored providers receive ≥ 3× more invites than non‑sponsored baseline.

------------------------------------------------------------------------

## Goals & Success Metrics

<div class="table-wrap">

|  |  |  |  |
|----|----|----|----|
| \# | Goal | Metric | Target |
| 1 | Speed up provider discovery | Median seconds to first invite | \< 60 s |
| 2 | Promote preferred providers | % invites that go to *Preferred* tier | ≥ 40 % |
| 3 | User satisfaction | CSAT on search flow (1‑5) | ≥ 4.5 |
| 4 | Funnel conversion | Searches that end in at least one "Add to Booking" | ≥ 80 % |

</div>

------------------------------------------------------------------------

## Assumptions

- Provider master‑data (including outlets & geo‑coords) is complete in the DB or synchronised nightly from CRM.

- Search will operate on a dedicated indexed table or ElasticSearch cluster to meet sub‑second performance.

- Sponsorship metadata (tier, expiry) is maintained by Provider Relations admin UI.

------------------------------------------------------------------------

## User Stories

1.  **As a Care Partner** I can search for providers near *Brisbane 4000* offering *Physiotherapy*, filter by *working‑with‑veterans*, and invite them to my client’s Planned Service.

2.  **As a Care Coordinator** I can quickly see which providers are *Preferred* and sort by client rating before inviting.

3.  **As a self‑managed Recipient** I can browse providers, view service coverage areas, and request an invite without seeing back‑office pricing.

------------------------------------------------------------------------

## Functional Requirements

### 1. Search & Filters

<div class="table-wrap">

|  |  |
|----|----|
| Requirement | Detail |
| **F1.1 Text Search** | Free‑text over provider name, service keywords, description. |
| **F1.2 Location Filter** | Autocomplete suburb/postcode, radius slider (e.g., 5–100 km). |
| **F1.3 Service Category** | Multi‑select NDIS/S@H categories (e.g., Cleaning, Nursing). |
| **F1.4 Tags & Attributes** | e.g., Languages spoken, Veteran‑friendly, After‑hours. |
| **F1.5 Tier Filter** | Preferred, Sponsored, Standard. |
| **F1.6 Sort** | Distance (default), Rating, Alphabetical. |

</div>

### 2. Ranking Logic

1.  Sponsored \> Preferred \> Standard (tier buckets).

2.  Within bucket, sort by chosen criteria (distance, rating…).

3.  Within ≤ 25 km and no Sponsored/Preferred present, fall back to Standard.

### 3. Provider & Outlet Display

- Provider card accordion listing outlets (addresses, phone, opening hours).

- CTA **Add to Booking** visible if user is inside a Planned Service context; **Invite to Booking** opens Planned‑Service picker otherwise.

### 4. Booking Integration

- Clicking CTA triggers `POST /bookings` with payload `{planned_service_id, service_provider_id, outlet_id?, urgency, message}`.

- On success, toast “Booking invitation sent” + link to Planned Service.

### 5. Permissions

<div class="table-wrap">

|  |  |
|----|----|
| Role | Capability |
| Care Partner / Coordinator | Full search & invite |
| Recipient (self‑managed) | Search & request invite (creates *draft* booking for approval) |
| Provider user | **No** access to search portal (they appear in results) |
| Admin | Manage sponsorship tiers & search settings |

</div>

### 6. Analytics Events

`provider_search_performed`, `filter_applied`, `provider_invited`, `search_no_results` (for heat‑map gaps).

------------------------------------------------------------------------

## Non‑Functional Requirements

<div class="table-wrap">

|                   |                                              |
|-------------------|----------------------------------------------|
| Attribute         | Target                                       |
| **Performance**   | \< 300 ms p95 search response                |
| **Uptime**        | 99.9 % for search API                        |
| **Scalability**   | 100 k providers, 500 k outlets               |
| **Security**      | ASA‑02 compliance, role‑based access control |
| **Accessibility** | WCAG 2.1 AA                                  |

</div>

------------------------------------------------------------------------

## Data Model Changes (high‑level)

- **service_providers** (existing) → add `tier` (`sponsored`, `preferred`, `standard`), `tier_expiry`.

- **service_provider_outlets** s \*\*(new) with geo‑coords.rds.

- **search_index_providers** (materialised view or Elastic). Fields: name, tier_weight, services_vector, location (lat/lng), rating, tags.

------------------------------------------------------------------------

## User Interaction & Design (MVP Wireframe Notes)

1.  **Search Bar** + location input inline.

2.  **Filter Drawer** (left).

3.  **Results Grid/List** with tier badges.

4.  Skeleton loader for fast perceived perf.

5.  Empty‑state illustration with retry tips.  
    *(Detailed Figma wireframes to be supplied in Design ticket.)*

------------------------------------------------------------------------

## Out‑of‑Scope (Phase‑1)

- Provider price comparison.

- Real‑time provider availability calendars.

- Bulk‑invite automation.

- Provider sponsorship/bidding workflow (future feature)

------------------------------------------------------------------------

## Open Questions & Decisions Needed

1.  **Search Tech:** ElasticSearch cluster vs. Postgres‑PGTrgm + GiST?

2.  **Tier Expiry:** Auto‑downgrade when sponsorship ends? Notification needed?

3.  **Ratings Source:** Internal survey data only, or pull from external marketplace reviews?

4.  **Recipient Requests:** Should Recipient‑initiated invites auto‑notify Care Partner for approval?

5.  **Quota:** Max invites per day per user to avoid spam?

6.  **Geo Data:** Use Google Geocoding or open‑source? licensing cost.

------------------------------------------------------------------------

## Vibe App / Existing UI

> 

------------------------------------------------------------------------

## Reference Materials

- PRD v0.2 – Multi‑Provider Booking System.

- Support @ Home Program Manual v3.

- Initial system diagram `search‑architecture.drawio`.

------------------------------------------------------------------------

## Next Steps

1.  Finalise open decisions.

2.  Create epics: **Search Backend**, **UI/UX**, **Booking Integration**, **Admin Tier Management**.

3.  Performance spike on search tech.

4.  Produce wireframes & usability test with 3 Care Partners.

5.  Define acceptance tests & rollout plan.

------------------------------------------------------------------------

*(Drafted: {{date}} by {{author}})*

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
