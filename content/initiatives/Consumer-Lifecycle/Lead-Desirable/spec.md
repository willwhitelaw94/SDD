---
title: "Feature Specification: Lead Desirable (LDS)"
description: "Specification for advanced lead nurturing, CRM-style context, and conversion intelligence"
---

> **[View Mockup](/mockups/lead-desirable/index.html)**{.mockup-link}

**Status**: Draft
**Epic**: TP-2453 | **Initiative**: Consumer Onboarding (TP-1858)

---

## Overview

Lead Desirable (LDS) extends the Lead Profile with advanced contextual and analytical layers that transform the Trilogy Care Portal from a transactional lead tracker into a CRM-style relationship management tool. By surfacing linked relationships, complete audit timelines, attribution data, traits and preferences, and package progress -- all within the lead profile -- sales staff can conduct personalised, qualified discussions rather than operating transactionally. LDS is the capstone of the Lead module family (LES, LTH, LGI, LDS), completing the Portal's evolution into a holistic client intelligence platform.

---

## User Scenarios & Testing

### User Story 1 - Linked Leads Navigation (Priority: P1)

As a sales staff member, I want to see and navigate between related leads (e.g., spouse, carer) so that I understand the full relationship context before engaging.

**Acceptance Scenarios**:
1. **Given** a lead has a linked relationship (e.g., spouse also registered as a lead), **When** I view the lead profile, **Then** I should see a "Linked Leads" section displaying related leads with their name, relationship type, and current status.
2. **Given** I am viewing a linked lead card, **When** I click on the linked lead, **Then** I should navigate to that lead's full profile with a back-navigation breadcrumb.
3. **Given** two leads are linked, **When** I view either lead, **Then** the relationship should be visible from both sides (bidirectional).

### User Story 2 - Lead Timeline (Priority: P1)

As a sales staff member, I want to see a complete chronological timeline of all changes to a lead so that I have full audit visibility and context for conversations.

**Acceptance Scenarios**:
1. **Given** a lead profile field is updated, **When** I view the timeline tab, **Then** I should see the change logged with timestamp, author, field name, previous value, and new value.
2. **Given** a lead has a long history, **When** I scroll the timeline, **Then** entries should paginate and load progressively without performance degradation.
3. **Given** multiple changes occur in a single session, **When** I view the timeline, **Then** each change should be individually logged with its own audit entry.

### User Story 3 - Attribution Tab (Priority: P2)

As a marketing or sales manager, I want to view unified attribution data for a lead so that I understand how the lead was acquired and can measure campaign ROI.

**Acceptance Scenarios**:
1. **Given** a lead was acquired via a marketing campaign, **When** I view the Attribution tab, **Then** I should see Lead Generation Attribution fields (UTM Source, Medium, Campaign, referral ID) populated from the ingestion source.
2. **Given** a sales rep has spoken to a lead, **When** they record the lead's self-reported source, **Then** the Sales Defined Attribution section should display this alongside the automated attribution data.
3. **Given** both attribution types exist, **When** I view the tab, **Then** both should be displayed in clearly labelled sections for comparison.

### User Story 4 - Options and Traits Tab (Priority: P2)

As a sales staff member, I want to capture and view a lead's personal traits and preferences so that I can match them to appropriate services.

**Acceptance Scenarios**:
1. **Given** I am on the Options & Traits tab, **When** I enter language, cultural background, mobility level, and lifestyle preferences, **Then** these should be saved and visible on subsequent visits.
2. **Given** traits have been captured, **When** I view the lead profile summary, **Then** key traits should be surfaced as tags or badges for quick reference.
3. **Given** a lead has specific service requirements (e.g., language-specific carer), **When** the requirements are recorded, **Then** they should be searchable and filterable across the lead database.

### User Story 5 - Package Tab Enhancements (Priority: P3)

As a sales staff member, I want to see MAC progress, approval milestones, and contribution details on the lead's Package tab so that I can discuss package status accurately.

**Acceptance Scenarios**:
1. **Given** a lead has an active MAC application, **When** I view the Package tab, **Then** I should see the current MAC approval stage and expected timeline.
2. **Given** a lead's package has been approved, **When** I view contribution details, **Then** I should see the contribution amount, frequency, and any income-tested fee details.

### Edge Cases

- Circular relationships in linked leads (A linked to B, B linked to C, C linked to A)
- Timeline entries for bulk-imported leads (should show import event rather than individual field changes)
- Attribution data conflicts between automated UTM and manual sales attribution
- Leads with no attribution data (organic/walk-in)
- Performance with leads that have hundreds of timeline entries
- Concurrent edits to the same lead by multiple users
- Deletion of a linked lead (what happens to the relationship record)

---

## Functional Requirements

1. **Linked Leads Management** -- Two-way navigable relationships between related leads with relationship type classification (spouse, carer, child, sibling, other)
2. **Lead Timeline Feed** -- Complete audit trail of all lead profile changes with before/after values, timestamps, authorship, and event categorisation
3. **Attribution Tab** -- Combined view of Sales Defined Attribution (self-reported source) and Lead Generation Attribution (UTM/referral data from LGI)
4. **Options & Traits Tab** -- Structured capture of language, culture, lifestyle, mobility, dietary, and service requirement preferences with defined schema and validation
5. **Package Tab Enhancements** -- Display MAC progress stages, approval milestones, contribution amounts, and income-tested fee details
6. **Timeline Pagination** -- Progressive loading of timeline entries with filtering by event type and date range
7. **Traits Search & Filter** -- Enable searching and filtering leads by trait values across the database
8. **Relationship Graph** -- Visual or list representation of all linked leads for a given lead

---

## Key Entities

| Entity | Description |
|--------|-------------|
| **LeadRelationship** | Bidirectional link between two leads with relationship type and metadata |
| **LeadTimelineEvent** | Individual audit log entry with event type, field, old value, new value, author, and timestamp |
| **LeadAttribution** | Combined attribution record with automated (UTM) and manual (sales-defined) source data |
| **LeadTrait** | Structured trait/preference record (language, culture, mobility, lifestyle, service requirements) |
| **MACProgress** | MAC application stage tracking with milestone dates and approval status |

---

## Success Criteria

### Measurable Outcomes

| Metric | Target |
|--------|--------|
| Lead profiles with complete traits data | Greater than 60% within 3 months of launch |
| Sales staff using linked leads navigation per week | Greater than 80% of active sales users |
| Attribution data completeness (at least one source recorded) | Greater than 90% of leads |
| Timeline query response time (p95) | Less than 500ms |
| Reduction in CRM tool licensing costs | Full replacement within 12 months |

---

## Assumptions

- Staff have workflow access to full lead profiles and will adopt the new tabs as part of their daily process
- MAC data is retrievable from existing systems for both new and existing clients
- The LES lead schema and tab framework are stable and support extension with new tabs
- LGI attribution data sources are standardised and available for integration
- Performance optimisations (pagination, indexed queries) will keep timeline responsive at scale

---

## Dependencies

- **LES (Lead Essential)** -- Lead schema, tab framework, persistent UI components
- **LGI (Lead Generation Integrations)** -- Attribution data sources and standardisation layer
- **LTH (Lead to Home)** -- Onboarding data, package creation fields, and MAC linkage
- Engineering capacity for event logging infrastructure and timeline indexing
- UX design for new tabs (timeline feed, traits cards, attribution display, linked leads UI)

---

## Out of Scope

- Automated lead scoring based on traits or attribution data
- AI-powered lead recommendations or next-best-action suggestions
- External CRM integrations (Salesforce, HubSpot) -- Portal replaces these
- Lead deduplication logic (handled separately)
- Marketing campaign management or UTM generation tools
- Bulk editing of traits across multiple leads

## Clarification Outcomes

### Q1: [Dependency] What is the delivery status of LES (Lead Essential)?
**Answer:** The codebase contains `domain/Lead/Models/Lead.php`, `domain/Lead/Models/LeadContent.php`, `domain/Lead/Models/LeadOwner.php`, and `domain/Lead/Models/LeadResource.php`, confirming the Lead domain model exists. There is also a Nova resource at `app/Nova/Lead.php`. However, there is no evidence of a tab framework or profile view in the Vue pages. **LES appears to have foundational models in place but the UI layer (lead profile, tab navigation) is not yet built.** LDS must wait for LES to deliver the tab framework before adding new tabs.

### Q2: [Scope] Should MAC progress be a shared component across LDS, MPS, and CBP?
**Answer:** MAC (My Aged Care) progress data relates to government funding approval stages. The `domain/Package/Models/PackageAllocation.php` and `domain/Package/Models/PackageAllocatedClassification.php` models handle classifications and funding allocations. **A shared `MACProgressComponent.vue` should be built in the Common components library** that LDS, MPS, and CBP all consume. The data source should be a single `MACProgressData` DTO populated from the Package/Funding domain.

### Q3: [Data] Will converted leads become contacts in the care circle? Should the relationship model be shared?
**Answer:** The LTH spec (User Story 7, Step 6) creates a Package record when a lead is converted. At this point, the lead becomes a care recipient. The existing `PackageContact` model (visible in event sourcing config) manages care circle relationships for packages. **When a lead converts, the LeadRelationship records should migrate to PackageContact records.** However, the models are structurally different -- LeadRelationship is bidirectional between leads, while PackageContact links contacts to packages. **Recommendation:** Build LeadRelationship as a standalone model for pre-conversion, with a migration action that converts relationships to PackageContact records upon lead conversion.

### Q4: [Edge Case] Should circular relationships in linked leads be prevented or allowed?
**Answer:** Circular relationships (A linked to B, B linked to C, C linked to A) are valid in aged care -- a married couple and their adult child may all be leads simultaneously. **Allow circular links but implement cycle detection for the UI.** The relationship graph (FR-8) should use a traversal limit (max depth 3) to prevent infinite rendering loops, and the UI should display a "See more" indicator rather than attempting to render the full graph.

### Q5: [UX] Has a CRM gap analysis been done for the "Full replacement within 12 months" target?
**Answer:** This is an assumption that cannot be validated from the codebase. The Portal currently has no CRM-style features -- no pipeline views, no deal tracking, no activity tracking on leads (beyond Zoho sync). **The 12-month CRM replacement target requires LES + LGI + LTH + LDS to all be delivered and adopted.** This is a high-risk target given that LES has not yet delivered the lead profile UI. **Recommendation:** Reframe SC-5 as "Full replacement of lead-tracking CRM functions" rather than "Full CRM replacement" -- the Portal will not replicate marketing automation or campaign management features.

### Q6: [Data] What is the expected volume of timeline entries per lead?
**Answer:** Based on the LTH wizard's 6 steps with Zoho sync at each step, plus manual edits, a typical lead could accumulate 20-50 timeline entries during the conversion process. High-touch leads with multiple calls and status changes could reach 200+ entries. **The p95 < 500ms target (SC timeline query response time) requires database indexing on (lead_id, created_at) and pagination at 25 entries per page.**

### Q7: [Integration] Where does attribution data originate?
**Answer:** LGI (Lead Generation Integrations) is responsible for capturing UTM data and referral IDs at ingestion time. The LeadAttribution entity in LDS is a read-only display of data written by LGI. **LDS should not write attribution data -- it only surfaces what LGI has captured.** The Attribution Tab should gracefully handle leads with no attribution data (pre-LGI legacy leads) by showing an "Attribution data not available" empty state.

## Refined Requirements

1. **Add prerequisite gate:** LDS cannot begin development until LES delivers the lead profile page with tab navigation framework.
2. **MAC progress should be a shared component** -- add a dependency on the Common component library for `MACProgressPanel.vue`.
3. **Add lead-to-package relationship migration** as a separate FR: "When a lead is converted to a package (via LTH), LeadRelationship records MUST be offered for migration to PackageContact records."
4. **Revise SC-5** from "Full CRM replacement" to "Full replacement of lead-tracking and qualification functions within 12 months."
5. **Timeline entries should be write-once/immutable** for audit compliance -- the LeadTimelineEvent entity should not support editing or deletion.
