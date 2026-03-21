---
title: "Feature Specification: Lead Generation Integrations (LGI)"
description: "Specification for unified lead ingestion and attribution from all marketing, partnership, and organic sources"
---

> **[View Mockup](/mockups/lead-generation-integrations/index.html)**{.mockup-link}

**Status**: Draft
**Epic**: TP-2445 | **Initiative**: Consumer Onboarding (TP-1858)

---

## Overview

Lead Generation Integrations (LGI) establishes a unified lead ingestion and attribution framework that standardises all incoming leads -- from marketing campaigns (Google Ads, Meta Ads), business development partnerships (Coordinated, Priority One), website forms, and organic Portal entries -- into a single, consistent data model. By preserving UTM metadata, referral IDs, and source context at the point of ingestion, LGI enables accurate campaign ROI analysis, end-to-end attribution reporting, and reliable lead origin tracking. LGI serves as the data backbone for all downstream lead management features (LES, LTH, LDS).

---

## User Scenarios & Testing

### User Story 1 - Marketing Lead Ingestion (Priority: P1)

As a marketing team member, I want leads from Google Ads, Meta Ads, and website forms to flow automatically into the Portal with their UTM data preserved so that I can track campaign performance.

**Acceptance Scenarios**:
1. **Given** a prospect submits a Google Ads lead form, **When** the form data is received by the ingestion API, **Then** a new lead should be created in the Portal with UTM Source, Medium, Campaign, and ad group preserved.
2. **Given** a prospect submits a Meta lead form, **When** the webhook fires, **Then** the lead should be created with Facebook campaign ID, ad set, and form name as attribution metadata.
3. **Given** a prospect submits a website contact form, **When** the form includes UTM query parameters, **Then** those parameters should be captured and stored with the lead record.

### User Story 2 - Business Development Lead Ingestion (Priority: P1)

As a partnerships manager, I want referrals from Coordinated and Priority One to flow into the Portal with referral context so that I can track partner-sourced leads.

**Acceptance Scenarios**:
1. **Given** a Coordinated referral is received, **When** the referral data is submitted to the ingestion API, **Then** a lead should be created with referral ID, referring organisation, and referral date.
2. **Given** a Priority One referral is received, **When** the data is ingested, **Then** the lead should include the priority classification, referral source, and any notes from the referring party.
3. **Given** a BD lead already exists in the Portal, **When** a duplicate referral arrives, **Then** the system should flag the duplicate and merge attribution data rather than creating a new lead.

### User Story 3 - Organic Lead Capture (Priority: P2)

As a sales staff member, I want leads entered directly into the Portal or via the website to follow the same data structure so that all leads are consistent regardless of source.

**Acceptance Scenarios**:
1. **Given** a staff member creates a lead manually in the Portal, **When** they save the lead, **Then** the source should default to "Direct - Portal" with a timestamp and creating user recorded.
2. **Given** a website visitor fills out a general enquiry form without UTM parameters, **When** the form is submitted, **Then** the lead should be created with source "Organic - Website" and the page URL captured.

### User Story 4 - Attribution Reporting (Priority: P2)

As a marketing manager, I want to generate reports on lead volume and conversion by source, campaign, and channel so that I can optimise marketing spend.

**Acceptance Scenarios**:
1. **Given** leads have been ingested from multiple sources, **When** I filter the lead list by source type, **Then** I should see accurate counts and conversion rates per source.
2. **Given** a specific campaign is running, **When** I search by campaign name or UTM campaign value, **Then** I should see all leads attributed to that campaign with their current lifecycle status.

### User Story 5 - Data Validation and Quality (Priority: P1)

As a system administrator, I want all ingested leads to pass validation rules so that data quality is maintained.

**Acceptance Scenarios**:
1. **Given** a lead is submitted via the ingestion API, **When** required fields (name, contact method, source) are missing, **Then** the API should return a validation error with specific field-level messages.
2. **Given** a lead is submitted with an invalid email or phone format, **When** validation runs, **Then** the lead should be rejected with a clear error message.
3. **Given** a lead is submitted with unknown UTM values, **When** ingested, **Then** the values should be stored as-is but flagged for review in the attribution report.

### Edge Cases

- Duplicate leads from different sources (same person, different campaigns)
- Leads with partial attribution data (e.g., UTM source but no medium)
- API rate limiting from ad platforms during high-volume campaign periods
- Webhook delivery failures and retry logic
- Legacy leads imported without attribution data (pre-LGI)
- UTM parameter naming convention mismatches across marketing channels
- Leads from sources not yet integrated (graceful handling of unknown source types)

---

## Functional Requirements

1. **Unified Ingestion API** -- Single API endpoint that accepts leads from all sources with standardised payload structure
2. **Source Adapters** -- Platform-specific adapters for Google Ads, Meta Ads, Coordinated, Priority One, and website forms that normalise data into the unified schema
3. **UTM Preservation** -- Capture and store UTM Source, Medium, Campaign, Term, and Content fields from marketing leads
4. **Referral ID Tracking** -- Capture and store referral IDs, referring organisation, and referral context from BD partners
5. **Data Validation Layer** -- Validate all incoming leads against required field rules, format rules, and deduplication checks before creation
6. **Duplicate Detection** -- Identify potential duplicates by email, phone, or name match and flag for review or auto-merge attribution
7. **Attribution Storage** -- Persist all attribution metadata in a structured, queryable format linked to the lead record
8. **Webhook Receivers** -- Webhook endpoints for Google Ads, Meta Ads, and partner platforms with signature verification and retry handling
9. **Ingestion Audit Log** -- Log all ingestion attempts with source, timestamp, validation result, and created lead ID
10. **Source Classification** -- Classify all leads into standardised source categories (Paid Search, Paid Social, Organic, Referral, Direct) regardless of ingestion method

---

## Key Entities

| Entity | Description |
|--------|-------------|
| **LeadIngestion** | Record of an ingestion event with source, raw payload, validation result, and created lead reference |
| **LeadAttribution** | Structured attribution data (UTM fields, referral IDs, source classification) linked to a lead |
| **SourceAdapter** | Configuration for each integrated platform (API keys, webhook URLs, field mappings) |
| **IngestionValidationRule** | Validation rule definition with field, rule type, and error message |
| **DuplicateMatch** | Flagged potential duplicate with match type (email, phone, name) and resolution status |

---

## Success Criteria

### Measurable Outcomes

| Metric | Target |
|--------|--------|
| Leads ingested with complete attribution data | Greater than 95% |
| Ingestion API uptime | Greater than 99.9% |
| Average ingestion latency (receipt to lead creation) | Less than 10 seconds |
| Duplicate detection accuracy | Greater than 90% |
| Marketing channels integrated | All active channels within 3 months |
| Manual lead imports (reduction from current baseline) | 80% reduction |

---

## Assumptions

- All lead sources have identifiable IDs or tracking parameters (UTM, referral ID, form ID)
- Attribution data can be stored and queried consistently across leads using a unified schema
- Google Ads, Meta Ads, Coordinated, and Priority One platforms expose structured APIs or webhooks for lead data
- Marketing team will adopt standardised UTM naming conventions as documented
- Existing manually imported leads will not be retroactively enriched with attribution data (forward-looking only)

---

## Dependencies

- **LES (Lead Essential)** -- Provides the lead data model and schema that LGI writes into
- Engineering support for API ingestion, webhook infrastructure, and adapter development
- BD pipeline partners (Coordinated, Priority One) must expose structured data endpoints or agree on data exchange format
- Marketing team alignment on UTM naming conventions and campaign tagging standards
- Google Ads API credentials and Meta Marketing API access tokens

---

## Out of Scope

- Lead scoring or qualification logic (handled by LDS)
- Marketing campaign creation or management tools
- UTM link builder or campaign URL generator
- Automated lead nurturing sequences or email drip campaigns
- Real-time bidding or ad spend optimisation
- Historical attribution backfill for pre-existing leads
- CRM migration from external tools (separate initiative)

## Clarification Outcomes

### Q1: [Integration] Have API contracts been established with Coordinated and Priority One?
**Answer:** No evidence of Coordinated or Priority One API integrations exists in the codebase. The only external CRM integration is with Zoho (via `app/Http/Controllers/ZohoWebhookController.php` and Zoho sync jobs). **Assumption:** API contracts with BD partners have not yet been established. **Recommendation:** Start with the Unified Ingestion API (FR-1) and the website form adapter. BD partner adapters should be Phase 2, contingent on partner API availability. A manual CSV import fallback should be provided for BD leads until APIs are ready.

### Q2: [Data] What fuzzy matching algorithm is intended for duplicate detection by name?
**Answer:** The codebase does not currently implement fuzzy matching. The Lead model at `domain/Lead/Models/Lead.php` has standard Eloquent queries. **For MVP, duplicate detection should use exact email match (primary) and exact phone match (secondary).** Name-based matching is unreliable and should be deferred to Phase 2 with Soundex or metaphone algorithms. **FR-6 should be scoped to email and phone matching only for MVP**, with name matching flagged as a future enhancement.

### Q3: [Scope] What percentage of existing leads lack attribution data?
**Answer:** Since LGI is forward-looking and the spec explicitly excludes historical backfill, all pre-LGI leads will lack attribution data. The Lead model does not currently have UTM or attribution fields. **The percentage is effectively 100% of existing leads.** This is a known gap. **Recommendation:** Attribution reporting should include a "No attribution data" category and clearly label the report baseline date as "LGI launch date." Pre-LGI leads should not distort ROI calculations.

### Q4: [Dependency] Is the LES lead data model stable enough to build against?
**Answer:** The Lead model exists at `domain/Lead/Models/Lead.php` with related models (`LeadContent`, `LeadOwner`, `LeadResource`). However, the LTH spec introduces significant new fields (sales qualifications, journey stage, purchase intent, Google status) that are synced from Zoho. **The lead schema is actively evolving.** LGI should define its attribution fields as a separate `lead_attributions` table linked to the lead via foreign key, rather than adding columns to the `leads` table. This isolates LGI from LES schema changes.

### Q5: [Edge Case] Who enforces UTM naming conventions? Is there a documented standard?
**Answer:** No UTM naming convention documentation exists in the codebase or tc-docs. **This is a marketing operations responsibility, not an engineering one.** However, LGI should: (a) store raw UTM values as-is, (b) provide a `SourceClassification` mapping table that normalises raw UTM values to standard categories (Paid Search, Paid Social, Organic, Referral, Direct), and (c) flag unknown UTM values for marketing team review (FR-5 data validation).

### Q6: [Performance] What is the expected ingestion volume?
**Answer:** The spec targets 80% reduction in manual lead imports. If Trilogy currently processes 100-200 leads per week (assumption based on aged care industry norms), the ingestion API would handle 500-1,000 leads per week at peak campaign periods. Google Ads and Meta Ads webhooks can fire in bursts. **The ingestion API should be queue-based (Laravel Horizon) with rate limiting (100 requests/minute) to prevent burst-related issues.**

### Q7: [Data] How are webhook delivery failures and retries handled?
**Answer:** The spec mentions webhook receivers with retry handling (FR-8) but does not define the retry strategy. **Standard webhook best practice:** Respond with 200 OK immediately, process asynchronously via queue. For outbound webhook failures (if LGI sends callbacks), implement exponential backoff with 3 retries over 1 hour. Store all raw webhook payloads in a `lead_ingestion_logs` table for replay capability.

## Refined Requirements

1. **Phase MVP to email/phone dedup only** -- name matching deferred to Phase 2 with phonetic algorithms.
2. **Attribution data should live in a separate `lead_attributions` table** to isolate from LES schema evolution.
3. **Add a manual CSV import adapter** for BD partner leads until API contracts are established.
4. **Add FR for UTM normalisation:** System MUST provide a configurable `SourceClassification` mapping from raw UTM values to standard source categories.
5. **Attribution reports must clearly indicate the LGI launch date** and exclude pre-LGI leads from ROI calculations.
