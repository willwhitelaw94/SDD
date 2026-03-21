---
title: "Feature Specification: Search Service Provider (SSP)"
---

> **[View Mockup](/mockups/search-service-provider/index.html)**{.mockup-link}

**Status**: Draft
**Epic**: TP-2292 SSP | **Initiative**: TP-1857 Supplier Management

---

## Overview

Users cannot efficiently search for available service providers in the system. Provider discovery currently relies on tribal knowledge, third-party marketplaces, and manual lookup (including Google searches), which delays matching clients with the best available providers. Trilogy Care has data on thousands of providers that is not being surfaced effectively.

This feature introduces a Searchable Service Provider Portal that enables Care Partners, Care Coordinators, and self-managed Recipients to discover and invite Service Providers (and their regional outlets) based on location, specialty, rating, and sponsorship tier. Preferred or Sponsored providers are surfaced at the top of search results, supporting partner-marketing agreements and faster client matching. Each provider card includes a call-to-action to "Add to Booking", creating a Booking record in the Planned Service flow.

---

## User Scenarios & Testing

### User Story 1 - Search and Filter Providers (Priority: P1)

As a Care Partner, I want to search for providers near a specific location offering a specific service type so that I can find the best available option for my client.

**Acceptance Scenarios**:
1. **Given** a Care Partner opens the provider search portal, **When** they enter a suburb/postcode and service category, **Then** results are displayed showing matching providers sorted by distance within sponsorship tier buckets (Sponsored > Preferred > Standard).
2. **Given** search results are displayed, **When** the user applies additional filters (tags like "Veteran-friendly", "After-hours", languages spoken), **Then** results are refined to match all selected filters.
3. **Given** search results are displayed, **When** the user changes the sort order (distance, rating, alphabetical), **Then** results re-sort within their tier buckets.
4. **Given** a search returns no results, **When** the empty state is displayed, **Then** helpful suggestions are shown (broaden filters, increase radius).
5. **Given** the user enters a location, **When** an autocomplete suburb/postcode picker is displayed, **Then** suggestions appear as the user types with a radius slider (5-100 km).

### User Story 2 - View Provider and Outlet Details (Priority: P1)

As a Care Coordinator, I want to see provider details including their outlets, contact information, and ratings so that I can make an informed selection.

**Acceptance Scenarios**:
1. **Given** search results are displayed, **When** the user clicks on a provider card, **Then** an accordion expands showing outlet details (addresses, phone numbers, opening hours).
2. **Given** a provider has a sponsorship tier, **When** displayed in results, **Then** a tier badge (Sponsored, Preferred, Standard) is clearly visible.
3. **Given** a provider has ratings, **When** displayed in results, **Then** the rating score and number of reviews are shown.
4. **Given** a provider has multiple outlets, **When** the accordion is expanded, **Then** each outlet is listed with its distance from the searched location.

### User Story 3 - Add Provider to Booking (Priority: P1)

As a Care Coordinator, I want to add a provider to a booking directly from the search results so that I can complete the provider selection in a single flow.

**Acceptance Scenarios**:
1. **Given** the user is viewing search results within a Planned Service context, **When** they click "Add to Booking" on a provider card, **Then** a booking invitation is created linking the selected provider and outlet to the Planned Service.
2. **Given** the user is viewing search results outside a Planned Service context, **When** they click "Invite to Booking", **Then** a Planned Service picker is displayed to select the target booking.
3. **Given** a booking invitation is sent, **When** the action completes, **Then** a toast notification confirms "Booking invitation sent" with a link to the Planned Service.
4. **Given** the booking invitation API call (`POST /bookings` with `planned_service_id`, `service_provider_id`, `outlet_id`, `urgency`, `message`), **When** it succeeds, **Then** the booking record is created and the provider is notified.

### User Story 4 - Self-Managed Recipient Search (Priority: P2)

As a self-managed Recipient, I want to browse providers and request an invite without seeing back-office pricing so that I can participate in selecting my care providers.

**Acceptance Scenarios**:
1. **Given** a self-managed recipient accesses the search portal, **When** they search for providers, **Then** results are displayed without back-office pricing information.
2. **Given** a recipient selects a provider, **When** they click "Request Invite", **Then** a draft booking is created that requires Care Partner approval before being actioned.
3. **Given** a draft booking is created by a recipient, **When** the Care Partner reviews it, **Then** they can approve, modify, or reject the request.

### User Story 5 - Sponsorship Tier Management (Priority: P2)

As an Admin, I want to manage provider sponsorship tiers so that sponsored providers are correctly promoted in search results.

**Acceptance Scenarios**:
1. **Given** an admin opens the sponsorship management UI, **When** they assign a tier (Sponsored, Preferred, Standard) to a provider, **Then** the provider's search ranking is updated accordingly.
2. **Given** a sponsorship has an expiry date, **When** the expiry date passes, **Then** the provider is automatically downgraded to Standard tier.
3. **Given** sponsorship tier data is modified, **When** the search index is refreshed, **Then** results reflect the updated tier rankings.

### Edge Cases

- **Provider with no outlets in range**: Provider should not appear in location-filtered results if no outlet is within the selected radius.
- **Provider data is stale or incomplete**: Providers missing critical data (address, services) should be flagged in admin views but not excluded from search unless configured.
- **High volume of invites from single user**: Configurable daily invite quota per user to prevent spam (open question: what limit?).
- **Recipient-initiated invite when no Care Partner assigned**: The request should be queued and an alert sent to the coordinator to assign a Care Partner.
- **Sponsorship tier expired but provider still appearing as Sponsored**: Auto-downgrade must run before or during search index refresh; stale cache should not display expired tiers.
- **Provider appears in multiple service categories**: Provider should appear in results for each matching category; deduplication at the provider level (not outlet level).
- **Search returns very large result set**: Pagination with skeleton loaders; results capped at a configurable maximum per page.

---

## Functional Requirements

### Search and Filters
- **FR-001**: System MUST provide free-text search over provider name, service keywords, and description.
- **FR-002**: System MUST provide location filtering with autocomplete suburb/postcode and configurable radius slider (5-100 km).
- **FR-003**: System MUST support multi-select service category filtering (NDIS/SAH categories such as Cleaning, Nursing, Allied Health).
- **FR-004**: System MUST support tag and attribute filtering (languages spoken, Veteran-friendly, After-hours).
- **FR-005**: System MUST support tier filtering (Sponsored, Preferred, Standard).
- **FR-006**: System MUST support sorting by distance (default), rating, and alphabetical within tier buckets.

### Ranking Logic
- **FR-007**: System MUST rank results in tier order: Sponsored > Preferred > Standard.
- **FR-008**: System MUST sort within tier by the user-selected sort criteria (distance, rating, alphabetical).
- **FR-009**: System MUST fall back to Standard results when no Sponsored or Preferred providers exist within 25 km.

### Provider Display
- **FR-010**: System MUST display provider cards with tier badge, name, service types, rating, and distance.
- **FR-011**: System MUST display provider outlet details (address, phone, opening hours) in an expandable accordion.
- **FR-012**: System MUST display "Add to Booking" CTA when user is in a Planned Service context, or "Invite to Booking" with a Planned Service picker otherwise.

### Booking Integration
- **FR-013**: System MUST create booking records via `POST /bookings` with payload including `planned_service_id`, `service_provider_id`, `outlet_id`, `urgency`, and `message`.
- **FR-014**: System MUST display success confirmation with link to the Planned Service after booking creation.

### Permissions
- **FR-015**: Care Partners and Care Coordinators MUST have full search and invite capability.
- **FR-016**: Self-managed Recipients MUST be able to search and request invite (creates draft booking for approval).
- **FR-017**: Provider users MUST NOT have access to the search portal.
- **FR-018**: Admins MUST be able to manage sponsorship tiers and search settings.

### Analytics
- **FR-019**: System MUST emit analytics events: `provider_search_performed`, `filter_applied`, `provider_invited`, `search_no_results`.

### Performance
- **FR-020**: System MUST return search results in <300 ms (p95).
- **FR-021**: System MUST support 100,000 providers and 500,000 outlets without performance degradation.
- **FR-022**: System MUST meet WCAG 2.1 AA accessibility standards.

---

## Key Entities

- **ServiceProvider**: The existing provider entity, extended with `tier` (sponsored, preferred, standard), `tier_expiry` date, and search-indexed fields.
- **ServiceProviderOutlet**: A physical location for a service provider. Contains address, geo-coordinates (lat/lng), phone, opening hours, and service coverage area.
- **SearchIndexProvider**: A materialised view or search index (ElasticSearch or Postgres PGTrgm+GiST) containing provider name, tier_weight, services_vector, location (lat/lng), rating, and tags for sub-second search performance.
- **BookingInvitation**: A booking record created from the search portal, linking a Planned Service to a selected provider and outlet. Contains planned_service_id, service_provider_id, outlet_id, urgency, message, and status.
- **SponsorshipTier**: Configuration for provider sponsorship levels, including tier name, ranking weight, and expiry tracking.

---

## Success Criteria

### Measurable Outcomes

- Median time from search start to first provider invite <60 seconds.
- Percentage of invites going to Preferred-tier providers >=40%.
- User satisfaction (CSAT) on search flow >=4.5/5.
- Searches ending in at least one "Add to Booking" action >=80%.
- Provider search time reduced by 70% compared to current manual lookup.
- Search result relevance score >85%.
- Filter usage adoption rate >60% of searches.
- >=95% of new bookings created through the search portal (vs. manual provider entry).

---

## Assumptions

- Provider master data (including outlets and geo-coordinates) is complete in the database or synchronised nightly from CRM.
- Search operates on a dedicated indexed table or search cluster to meet sub-second performance.
- Sponsorship metadata (tier, expiry) is maintained by Provider Relations via an admin UI.
- Filter dimensions are clearly defined by business rules and stable.
- The Planned Service / booking flow from the previous release is available for integration.

---

## Dependencies

- Provider database completeness and accuracy (addresses, services, geo-coordinates).
- Search infrastructure decision (ElasticSearch cluster vs Postgres PGTrgm+GiST -- open question).
- Sponsorship tier management admin UI.
- Planned Service and booking APIs from the previous release.
- Geo-coding service for location data (Google Geocoding vs open-source -- open question, licensing cost implications).
- Ratings data source (internal survey data only, or external marketplace reviews -- open question).

---

## Out of Scope

- Provider price comparison.
- Real-time provider availability calendars.
- Bulk-invite automation.
- Provider sponsorship/bidding workflow (future feature).
- CareVicinity integration for job posting (covered by [CareVicinity Job Posting](/initiatives/Supplier-Management/CareVicinity-Job-Posting)).
- Supplier onboarding or credentialing.
- Mobile-native application (mobile-responsive web is in scope).


## Clarification Outcomes

### Q1: [Scope] Is this a supplier directory or a consumer-facing marketplace?
**Answer:** The spec is explicit — it serves THREE audiences: Care Partners, Care Coordinators, and self-managed Recipients. FR-015 to FR-018 define permissions per role. Care Partners and Coordinators have full search + invite. Self-managed Recipients can search and request invite (draft booking for approval). Provider users cannot access the search. This is an INTERNAL tool for the Trilogy Care ecosystem, not a public marketplace. It differs from CareVicinity (external marketplace) — SSP searches Trilogy's own provider database.

### Q2: [Dependency] Does this use existing supplier data?
**Answer:** The `Supplier` model uses Laravel Scout `Searchable` trait, confirming existing search infrastructure. The `OrganisationLocation` model provides geographic data. `SupplierServiceStatus` tracks service types per supplier. The spec extends existing data with: sponsorship tiers (`tier`, `tier_expiry` on ServiceProvider), outlet geo-coordinates, and ratings. The codebase has `OrganisationLocation` which could serve as the "outlet" concept. **Recommendation:** Reuse `OrganisationLocation` as outlets rather than creating a new `ServiceProviderOutlet` entity.

### Q3: [Data] What search infrastructure is needed?
**Answer:** The Supplier model already uses `Laravel\Scout\Searchable`. The spec mentions "ElasticSearch cluster vs Postgres PGTrgm+GiST" as an open question. For geographic search (radius from postcode), the codebase would need GIS capabilities. Scout supports Algolia and MeiliSearch drivers. **Recommendation:** Given the existing Scout integration, use MeiliSearch (open-source, supports geo-filtering) or Algolia (managed, supports geo-search natively). This avoids building custom Postgres GIS queries.

### Q4: [Edge Case] How are inactive or non-compliant suppliers filtered?
**Answer:** The `SupplierStageEnum` has stage tracking, and `SupplierServiceStatusEnum` tracks per-service verification. FR-017 says "Provider users MUST NOT have access to the search portal" but doesn't address which providers APPEAR in results. **Assumption:** Only suppliers in ACTIVE stage with at least one VERIFIED service should appear. Suppliers with expired compliance documents (tracked by `SupplierDocument.expires_at`) should be filtered out. **Recommendation:** Add an explicit FR: "System MUST only display suppliers with active status and at least one verified service in search results."

### Q5: [Integration] Does this overlap with consumer mobile marketplace?
**Answer:** The spec's Out of Scope explicitly lists "CareVicinity integration for job posting (covered by CareVicinity Job Posting)." The consumer mobile (MOB) specs are in a different initiative. SSP is the internal search tool; CareVicinity is the external marketplace. If a consumer mobile app needs provider search, it should call the same search API that SSP uses. **Recommendation:** Design the search API as a reusable service that both SSP (web) and MOB (mobile) can consume.

### Q6: [Data] The "Booking" entity in FR-013 — does this depend on Service Booking (APA)?
**Answer:** Yes. FR-013 references `POST /bookings` with `planned_service_id`, `service_provider_id`, `outlet_id`, `urgency`, `message`. This is exactly the Booking entity from the APA spec. SSP creates booking invitations; APA manages the booking lifecycle. This is a clear dependency — SSP needs APA's booking API to exist.

### Q7: [Performance] Sub-second search for 100K providers — is this achievable?
**Answer:** FR-020 requires <300ms p95 latency. FR-021 requires supporting 100K providers and 500K outlets. This is achievable with a dedicated search index (MeiliSearch/Algolia/ElasticSearch) but NOT with raw Postgres queries. The `SearchIndexProvider` entity in the spec is essentially a materialized search document. **Recommendation:** Use MeiliSearch (already popular in Laravel ecosystem via Scout) with documents containing: `provider_name`, `tier_weight`, `services`, `location_lat_lng`, `rating`, `tags`. Rebuild index nightly from source tables.

### Q8: [Scope] The "Add to Booking" CTA — what happens when used outside a Planned Service context?
**Answer:** FR-012 specifies two CTAs: "Add to Booking" (in Planned Service context) and "Invite to Booking" (with Planned Service picker). The Planned Service picker would show the user's client's active `BudgetPlanItem` records that need a supplier. This is well-specified.

### Q9: [Data] Ratings — where does rating data come from?
**Answer:** Listed as an open question in dependencies: "Ratings data source (internal survey data only, or external marketplace reviews)." No ratings data exists in the current codebase. **Assumption:** Ratings would come from internal feedback — Care Partners rating providers after service delivery. This is a new data collection feature that should be scoped separately. For v1, ratings could be omitted or populated with a default value, with the sort-by-rating feature deferred.

### Q10: [UX] Sponsorship tiers — is this a revenue model?
**Answer:** Sponsorship tiers (Sponsored > Preferred > Standard) with FR-007 ranking logic suggests a commercial arrangement where providers pay for higher visibility. US5 (Sponsorship Tier Management, P2) includes expiry dates, confirming these are time-limited commercial agreements. This is a business model decision, not a technical one. The tier system is straightforward to implement as a `tier` enum on the Supplier model with a `tier_expiry` date.

## Refined Requirements

1. **New FR**: System MUST only display suppliers with ACTIVE stage and at least one VERIFIED service in search results. Suppliers with expired compliance documents are excluded.

2. **Dependency Clarification**: SSP requires the Service Booking (APA) epic's `Booking` entity and API for the "Add to Booking" / "Invite to Booking" CTAs.

3. **Phase Recommendation**: Deploy ratings sort as Phase 2 after a ratings collection mechanism is built. Phase 1 sorts by distance within tier buckets only.

4. **Reuse Recommendation**: Use `OrganisationLocation` as the outlet entity rather than creating a new `ServiceProviderOutlet` model. Add geo-coordinates (`latitude`, `longitude`) to `OrganisationLocation` if not already present.
