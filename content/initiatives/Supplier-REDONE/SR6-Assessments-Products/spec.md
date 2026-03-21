---
title: "Feature Specification: Assessments & Products"
---

# Feature Specification: Assessments & Products

**Feature Branch**: `sr6-assessments-products`
**Created**: 2026-03-19
**Author**: Will Whitelaw
**Status**: Draft
**Input**: ASS1 (Assessments/Prescriptions) and PSF (Product Supplier Flow) Linear projects

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Care Partner Creates an Assessment for a Client (Priority: P1)

A Care Partner needs to record that a client has had an assessment — for example, an occupational therapy assessment that recommends assistive technology. The Care Partner creates the assessment in the portal, selecting the assessment category, recording the purpose and recommendation, and linking it to the client. This assessment record becomes the clinical justification for any subsequent product procurement.

**Why this priority**: This is the foundational action. Without a structured assessment record, the entire assessment-to-product-to-payment chain cannot function. Every other story depends on assessments existing as structured data.

**Independent Test**: Can be fully tested by logging in as a Care Partner, creating an assessment for an existing client, and verifying the assessment appears on the client's record with all fields captured.

**Acceptance Scenarios**:

1. **Given** a Care Partner viewing a client's record, **When** they create a new assessment, **Then** they can select a category (AT, nursing, mobility, nutrition, communication aids), enter the purpose and recommendation, and the assessment is saved and linked to the client.
2. **Given** a Care Partner creating an assessment, **When** they save the assessment, **Then** the assessment has a status of "New" and an audit trail entry recording who created it and when.
3. **Given** a Care Partner viewing a client's record, **When** assessments exist for that client, **Then** all assessments are listed with their category, date, status, and recommendation summary.
4. **Given** a Care Partner, **When** they attempt to create an assessment without selecting a category, **Then** the system prevents submission and highlights the required field.

---

### User Story 2 - Assessment Status Workflow (Priority: P1)

An assessment moves through a defined lifecycle: New -> Under Review -> Approved -> Actioned -> Expired/Cancelled. Each transition captures who made the change and when. An approved assessment authorises product procurement. An expired or cancelled assessment prevents further product linkage.

**Why this priority**: Status workflow is required before assessments can gate product billing (Story 4). Without it, assessments are just static records with no business meaning.

**Independent Test**: Can be tested by creating an assessment, transitioning it through each status, and verifying that the transitions are recorded and the correct actions are available at each stage.

**Acceptance Scenarios**:

1. **Given** an assessment in "New" status, **When** a coordinator reviews it, **Then** they can move it to "Under Review" and the transition is recorded.
2. **Given** an assessment in "Under Review" status, **When** it is approved, **Then** the status changes to "Approved" and the assessment becomes eligible for product linkage.
3. **Given** an assessment in "Approved" status, **When** a product is procured and linked, **Then** the status changes to "Actioned".
4. **Given** an assessment in "Approved" status that has not been actioned within the configured validity period, **When** the period expires, **Then** the assessment status changes to "Expired" and it can no longer be used for product procurement.
5. **Given** an assessment in any pre-actioned status, **When** it is cancelled, **Then** the status changes to "Cancelled" with a reason, and any pending product linkages are removed.

---

### User Story 3 - Supplier Product Discovery (Priority: P1)

When a supplier adds product-related service categories to their price list, a Products tab automatically appears in their supplier portal profile. Care Partners searching for a supplier to fulfil an assessment recommendation can filter by product category and see only suppliers who are registered and priced for that category.

**Why this priority**: Without supplier discovery, Care Partners cannot find the right supplier for a recommended product. This connects the assessment (clinical need) to the supplier (service provider).

**Independent Test**: Can be tested by setting up a supplier with product categories on their price list, then searching for suppliers by that category and verifying the supplier appears in results.

**Acceptance Scenarios**:

1. **Given** a supplier who adds "Assistive Technology" as a service category on their price list, **When** the price list is saved, **Then** a Products tab appears in their supplier portal profile showing their product capabilities.
2. **Given** a Care Partner with an approved assessment for "Mobility" products, **When** they search for suppliers, **Then** they can filter by "Mobility" product category and see only suppliers registered for that category.
3. **Given** a supplier whose product categories are removed from their price list, **When** the last product category is removed, **Then** the Products tab is no longer visible in their profile.
4. **Given** a Care Partner viewing supplier search results, **When** they select a supplier, **Then** they can see the supplier's product categories, pricing, and service areas.

---

### User Story 4 - Mandatory Assessment-Budget-Supplier Linkage for Product Bills (Priority: P1)

Before a product bill can be processed for payment, the system requires three mandatory linkages: a linked assessment (proving clinical need), a linked budget line item (proving funding availability), and a linked supplier who is approved for the product category. Bills submitted without all three linkages are rejected with a clear explanation of what is missing.

**Why this priority**: This is the compliance core of the epic. Without mandatory linkage, product expenditure cannot be verified against clinical justification and budget availability — the primary audit risk the epic addresses.

**Independent Test**: Can be tested by submitting a product bill with all three linkages (should succeed), then submitting bills missing each linkage individually (each should be rejected with the correct reason).

**Acceptance Scenarios**:

1. **Given** a supplier submitting a bill for a product, **When** the bill has a linked approved assessment, a linked budget line item with sufficient funds, and the supplier is approved for the product category, **Then** the bill is accepted for processing.
2. **Given** a supplier submitting a bill for a product, **When** no assessment is linked, **Then** the bill is rejected with a message indicating that a linked assessment is required.
3. **Given** a supplier submitting a bill for a product, **When** an assessment is linked but no budget line item is linked, **Then** the bill is rejected with a message indicating that a linked budget is required.
4. **Given** a supplier submitting a bill for a product, **When** all linkages exist but the assessment has expired or been cancelled, **Then** the bill is rejected with a message indicating the assessment is no longer valid.
5. **Given** a supplier submitting a bill for a product category they are not registered for, **When** submission is attempted, **Then** the bill is rejected with a message indicating the supplier is not approved for this product category.

---

### User Story 5 - Product Status Workflow (Priority: P2)

Each product linked to an assessment follows a defined workflow: Approved (Pending Product) -> Bill Received -> Paid, with a Rejected path for items that fail validation. Care Partners and coordinators can view the status of every product linked to a client's assessments.

**Why this priority**: Provides visibility into the product lifecycle after the assessment-to-billing linkage is established. Depends on Stories 1-4 being in place.

**Independent Test**: Can be tested by creating a product linked to an approved assessment, advancing it through each status, and verifying the status is visible on the client's assessment record.

**Acceptance Scenarios**:

1. **Given** an approved assessment with a linked product, **When** the product is created, **Then** it starts in "Approved — Pending Product" status.
2. **Given** a product in "Approved — Pending Product" status, **When** the supplier submits a bill for it, **Then** the product status changes to "Bill Received".
3. **Given** a product in "Bill Received" status, **When** the bill is paid, **Then** the product status changes to "Paid" and the payment details are recorded.
4. **Given** a product at any pre-paid status, **When** it is rejected, **Then** the status changes to "Rejected" with a reason, and the linked budget allocation is released.
5. **Given** a Care Partner viewing a client's assessments, **When** products are linked, **Then** each product shows its current status, the linked supplier, and the payment status.

---

### User Story 6 - S@H Product Category Taxonomy (Priority: P2)

The nine Support at Home product categories (Assistive Technology, Nursing consumables, Home maintenance, Nutrition, Mobility, Domestic life, Managing body functions, Self-care, Communication & information management) are enforced as the standard taxonomy across assessments, supplier capabilities, and billing. All three must use the same category list to ensure consistency.

**Why this priority**: Ensures data consistency across the assessment-to-payment chain. Without a shared taxonomy, mismatches between assessment categories and supplier categories would break the mandatory linkage.

**Independent Test**: Can be tested by creating an assessment with a specific S@H category, searching for suppliers in that category, and submitting a bill — verifying the same category is used at each step.

**Acceptance Scenarios**:

1. **Given** a Care Partner creating an assessment, **When** they select a product category, **Then** the available categories match the nine S@H product categories exactly.
2. **Given** a supplier configuring their price list, **When** they add product service categories, **Then** the available categories match the same nine S@H product categories.
3. **Given** a bill being validated, **When** the system checks the product category, **Then** it validates that the assessment category, supplier category, and bill category all match.
4. **Given** a system administrator, **When** they need to add or modify product categories, **Then** they can update the taxonomy from a central configuration, and changes propagate to assessments, supplier profiles, and billing.

---

### User Story 7 - Assessment and Product Reporting (Priority: P3)

Coordinators and administrators can generate reports showing assessment-to-product-to-payment chains for compliance auditing. Reports can be filtered by client, supplier, product category, date range, and status.

**Why this priority**: Important for compliance and audit but not required for the core assessment-to-billing workflow. Depends on all other stories being in place.

**Independent Test**: Can be tested by generating a report with specific filters and verifying the output includes the correct assessment, product, and payment data.

**Acceptance Scenarios**:

1. **Given** a coordinator, **When** they request an assessment report filtered by product category and date range, **Then** the report shows all assessments matching the criteria with their linked products, suppliers, and payment status.
2. **Given** an administrator running a compliance audit, **When** they generate a report of all product bills without linked assessments, **Then** the report is empty (proving 100% linkage compliance) or lists any exceptions.
3. **Given** a coordinator viewing a specific client, **When** they request the client's assessment history, **Then** they see a chronological view of all assessments, recommendations, linked products, and payment outcomes.

---

### Edge Cases

- What happens when an assessment is approved but the recommended product category has no registered suppliers? The system should display a warning to the Care Partner and allow them to proceed (the product cannot be fulfilled until a supplier registers for that category, but the assessment should not be blocked).
- What happens when a supplier's product category registration is removed after a bill has been submitted but not yet paid? Bills already in the pipeline continue processing against the original linkage. New bills cannot be submitted against the deregistered category.
- What happens when a client's budget is exhausted after an assessment is approved but before a product bill is submitted? The bill validation catches this at submission time — the assessment remains valid but the bill is rejected for insufficient budget. The Care Partner is notified.
- How does the system handle assessments that recommend multiple products from different categories? Each product is linked to the assessment independently — one assessment can spawn multiple product records, each with their own supplier and billing linkage.
- What happens when an assessment expires while a product bill is in "Bill Received" status? Bills already received continue processing — the expiry prevents new product linkages but does not void in-progress bills.
- What happens when a supplier submits a bill for a product amount that exceeds the approved quote? The system flags the discrepancy for coordinator review but does not automatically reject — the coordinator can approve the variance or reject the bill.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow Care Partners to create assessments linked to a client, capturing category, purpose, recommendation, and assessor details.
- **FR-002**: System MUST enforce assessment categories matching the nine S@H product categories: Assistive Technology, Nursing consumables, Home maintenance (product-only), Nutrition, Mobility, Domestic life, Managing body functions, Self-care, Communication & information management. These are stored in a dedicated `product_categories` lookup table, separate from the existing `service_categories` table (see CLR-001).
- **FR-003**: System MUST support an assessment status workflow: New -> Under Review -> Approved -> Actioned -> Expired/Cancelled, with audit trail for every transition.
- **FR-004**: System MUST automatically expire assessments that have not been actioned within the configured validity period (default: 12 months from approval date, globally configurable via Nova — see CLR-005).
- **FR-005**: System MUST automatically create a Products tab on a supplier's profile when they add product-related service categories to their price list.
- **FR-006**: System MUST allow Care Partners to search for suppliers filtered by product category, returning only suppliers registered and priced for that category.
- **FR-007**: System MUST require a linked approved assessment before a product bill can be submitted for processing.
- **FR-008**: System MUST require a linked budget line item with sufficient available funds before a product bill can be submitted for processing.
- **FR-009**: System MUST require the billing supplier to be registered for the product category matching the linked assessment before a product bill can be submitted.
- **FR-010**: System MUST reject product bills that fail any of the three mandatory linkage checks (assessment, budget, supplier category) with a specific message indicating which linkage is missing or invalid.
- **FR-011**: System MUST support a product status workflow: Approved (Pending Product) -> Bill Received -> Paid -> Rejected, with audit trail for every transition.
- **FR-012**: System MUST release budget allocations when a product is rejected.
- **FR-013**: System MUST allow one assessment to link to multiple products, each with independent supplier and billing linkages.
- **FR-014**: System MUST enforce the same product category taxonomy across assessments, supplier price lists, and billing validation.
- **FR-015**: System MUST support reporting on assessment-to-product-to-payment chains, filterable by client, supplier, product category, date range, and status.
- **FR-016**: System MUST flag product bills where the billed amount exceeds the approved quote for coordinator review.
- **FR-017**: System MUST allow in-progress bills (status "Bill Received") to continue processing even if the linked assessment subsequently expires.

### Key Entities

- **Assessment**: A clinical evaluation linked to a client. Captures category (from S@H taxonomy), purpose, recommendation, assessor, status, and validity period. One assessment can authorise multiple products. Created by Care Partners or coordinators.
- **Product**: A procurement authorisation record created by a Care Partner after an assessment is approved (see CLR-003). Specifies the product category, the selected supplier, and the budget linkage. The supplier submits a bill *against* an existing Product record. Tracks its own status workflow independently from the assessment. Linked to exactly one assessment, one supplier (at the Supplier entity level per CLR-004), and one budget line item.
- **Product Category**: One of the nine S@H product categories, stored in a dedicated `product_categories` lookup table separate from the existing `service_categories` (see CLR-001). Used as the shared taxonomy across assessments, supplier capabilities, and billing. Centrally managed via Nova.
- **Supplier Product Profile**: The auto-generated Products tab on an individual Supplier entity's profile (not Organisation-level — see CLR-004), derived from their price list product categories. Determines which product categories this supplier can be linked to for billing. Suppliers see only linked assessment summaries, not full assessment records (see CLR-002).
- **Assessment-Budget-Supplier Linkage**: The mandatory three-way relationship required before a product bill can be processed. Enforced at bill submission time.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Care Partners can create an assessment and link it to a client in under 3 minutes.
- **SC-002**: 100% of product bills have a linked approved assessment — no product payments without clinical justification.
- **SC-003**: 100% of product bills have a linked budget line item — no product payments without confirmed funding.
- **SC-004**: 100% of product bills are submitted by suppliers registered for the matching product category.
- **SC-005**: Supplier product discovery returns results in under 2 seconds when filtered by product category.
- **SC-006**: Assessment status transitions are 100% auditable — every transition records who, when, and why.
- **SC-007**: Product status is visible on the client's assessment record within 1 second of page load.
- **SC-008**: The nine S@H product categories are consistently applied across assessments, supplier profiles, and billing with zero mismatches.
- **SC-009**: Expired assessments cannot be used for new product linkages — enforced at the system level, not by user discipline.
- **SC-010**: Compliance reports can be generated for any date range showing the full assessment-to-payment chain for audit purposes.

## Clarifications

The following clarifications were resolved during spec review to close ambiguities identified against the existing codebase and the broader Supplier REDONE initiative.

### CLR-001: Product Category Taxonomy — New Lookup Table vs Reuse of ServiceCategory

**Question**: The spec references nine S@H "product categories" (Assistive Technology, Nursing consumables, Home maintenance, etc.) but the existing `ServiceCategory` model (`app/Models/AdminModels/ServiceCategory.php`) contains eight *service* categories (Daily Living, Social Connections, Personal Care, Health & Clinical, Allied Health, Respite Care, Environmental Improvements, Other). These are different taxonomies with different cardinalities. Should product categories be a new dedicated lookup table, a filtered subset of `ServiceCategory`, or an extension of the existing model?

**Options**:
- **(A) New `product_categories` lookup table** — A standalone table with the nine S@H product categories, referenced by assessments, supplier product profiles, and bill validation. Cleanly separated from service categories.
- **(B) Add a `is_product_category` flag to `ServiceCategory`** — Tag existing rows and add missing ones. Couples product and service taxonomies.
- **(C) Seed the nine categories into existing `ServiceCategory` with a new `service_group_id`** — Use a "Products" service group to partition them. Reuses existing infrastructure.

**Resolution: Option A — New `product_categories` lookup table.** The nine S@H product categories are a distinct, government-defined taxonomy that must not drift with operational service category changes. A dedicated table keeps the compliance boundary clean, avoids coupling product validation to service pricing infrastructure, and is the simplest path since it requires no changes to the existing `ServiceCategory` model or its consumers. The table is seeded with the nine categories and is admin-manageable via Nova for future S@H programme updates.

### CLR-002: Supplier Visibility of Assessments — Read-Only Access Scope

**Question**: The idea brief states "suppliers see assessments read-only (care team creates them)" but the spec does not encode what "read-only" means in practice. When a supplier submits a product bill (Story 4), do they see the full assessment record, just the assessment reference ID, or a summary? Can suppliers browse all assessments for a client, or only assessments that have been explicitly linked to them?

**Options**:
- **(A) Suppliers see only a linked assessment summary** — When a product is linked to a supplier, they see the assessment category, date, status, and recommendation summary. No browsing of unlinked assessments.
- **(B) Suppliers can browse all assessments for their assigned clients** — Full read access to all assessments for clients they serve, regardless of linkage.
- **(C) Suppliers see no assessment details** — They only see a validation result ("assessment linked: yes/no") when submitting a bill.

**Resolution: Option A — Suppliers see only a linked assessment summary.** Suppliers need enough context to confirm they are billing against the correct assessment (category, date, recommendation summary), but should not have browse access to a client's full clinical assessment history. This minimises data exposure, aligns with the principle of least privilege, and is sufficient for the billing workflow. The linked summary is displayed on the product record within the supplier's bill creation flow.

### CLR-003: Product Entity Lifecycle — Pre-Created Record vs Bill-Derived

**Question**: The spec introduces a "Product" entity (Key Entities section) with its own status workflow (Story 5: Approved Pending Product -> Bill Received -> Paid -> Rejected). But it is unclear whether the Product record is created *before* the supplier submits a bill (like a purchase order authorising procurement) or *derived from* the bill line item after submission. This affects who creates the Product record and when.

**Options**:
- **(A) Product is pre-created by the Care Partner after assessment approval** — The Care Partner creates a Product record specifying the category, expected supplier, and budget linkage. The supplier later submits a bill *against* this existing Product record.
- **(B) Product is derived from the bill line item** — The supplier submits a bill with a product line item, and the system auto-creates the Product record during bill validation if the three-way linkage passes.
- **(C) Hybrid — Product is created when the Care Partner links an assessment to a supplier** — The act of selecting a supplier for a product category creates the Product record, and the supplier bills against it.

**Resolution: Option A — Product is pre-created by the Care Partner.** This makes the Product record a purchase authorisation: the Care Partner approves the assessment, creates a Product record specifying what should be procured and from which supplier, and links the budget. The supplier then submits a bill *referencing* the existing Product record. This is the simplest model because it enforces the three-way linkage at creation time (before the supplier is involved), gives Care Partners explicit control over procurement authorisation, and means the supplier bill flow only needs to select from a list of authorised Product records rather than constructing the linkage from scratch.

### CLR-004: Two-Tier Org/Supplier Scoping for Assessments and Product Registration

**Question**: The two-tier Organisation -> Supplier model is non-negotiable. Bills belong to a Supplier entity (`bills.supplier_id`). But the spec does not clarify: (a) whether product category registration (the "Products tab") is at the Supplier level or Organisation level, and (b) whether assessment-to-supplier linkage on a Product record points to the Supplier entity or the Organisation.

**Options**:
- **(A) Everything at Supplier level** — Product category registration, the Products tab, and assessment linkage all reference the individual Supplier entity. An Organisation with three Supplier entities could have different product capabilities per entity.
- **(B) Product registration at Organisation level, billing at Supplier level** — The Organisation registers product categories (shared across all its Supplier entities), but bills are still submitted per Supplier entity.
- **(C) Mixed — registration at Supplier, with Organisation-level rollup view** — Each Supplier registers independently, but Org Admins get an aggregate view.

**Resolution: Option A — Everything at Supplier level.** This is consistent with the existing billing model where `bills.supplier_id` references the Supplier entity, and with SR3 where pricing is submitted per Supplier per location. Product category registration lives on the Supplier's price list (same as service categories in SR3), the Products tab appears on the individual Supplier profile, and Product records link to a specific Supplier entity. This is the simplest model and avoids introducing Organisation-level product logic that would diverge from the established per-Supplier pattern. An Organisation-level rollup view can be added later as a P3 read-only dashboard concern without changing the data model.

### CLR-005: Assessment Validity Period — Default Duration and Configuration Scope

**Question**: FR-004 requires automatic expiry of assessments after a "configured validity period" but does not specify: what the default period is, whether it varies by product category, who can configure it, or where the configuration lives.

**Options**:
- **(A) Single global default (12 months), admin-configurable via Nova** — One validity period applies to all assessments regardless of category. Stored in a `settings` table or config file. Simplest to implement and reason about.
- **(B) Per-category validity periods** — Each of the nine product categories has its own validity period (e.g., AT assessments valid 12 months, nutrition assessments valid 6 months). More granular but adds configuration complexity.
- **(C) Per-assessment validity set by the Care Partner at creation time** — The Care Partner enters an expiry date when creating the assessment. Maximum flexibility but no system-enforced consistency.

**Resolution: Option A — Single global default of 12 months, admin-configurable via Nova.** S@H does not currently mandate different validity periods per product category, and introducing per-category configuration adds complexity without a known business requirement. A single global default stored in the `settings` table (or a `support-at-home` config key) keeps the logic simple: `assessment.expires_at = assessment.approved_at + validity_period`. Administrators can adjust the period via Nova if S@H rules change. If per-category periods are needed later, the model can be extended by adding an optional `validity_days` column to the `product_categories` table that overrides the global default.
