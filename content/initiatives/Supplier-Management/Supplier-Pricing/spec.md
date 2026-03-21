---
title: "Feature Specification: Supplier Pricing (PRI)"
---

> **[View Mockup](/mockups/supplier-pricing/index.html)**{.mockup-link}

**Status**: Draft
**Epic**: TP-3652 | **Initiative**: Supplier Management (TP-1857)

---

## Overview

Supplier Pricing (PRI) introduces a comprehensive pricing management system within the Trilogy Care Portal that distinguishes between direct and indirect costs, enables supplier self-service price list management, integrates pricing data into bill matching and budget calculations, and validates prices against configurable caps. Currently, the portal's pricing input is limited and does not capture the full complexity of supplier pricing, resulting in bill matching challenges, budget planning inaccuracies, and no distinction between direct and indirect costs.

This epic delivers the foundational pricing model that underpins accurate billing, budgeting, and financial reporting across the Supplier Management domain. It is a key enabler for both the Supplier Onboarding 2 (SOP2) pricing matrix and the bill matching improvements required for Support at Home compliance.

---

## User Scenarios & Testing

### User Story 1 - Direct and Indirect Pricing Model (Priority: P1)

As a Finance Manager, I want the portal to distinguish between direct and indirect costs for each supplier service so that budgets and bills are categorized correctly for SAH reporting.

**Acceptance Scenarios**:
1. **Given** a supplier provides a service, **When** configuring pricing, **Then** the system allows separate pricing entries for direct costs (service delivery) and indirect costs (travel, administration, materials).
2. **Given** a bill line item is submitted, **When** the system processes it for matching, **Then** it can match against either direct or indirect pricing based on the line item description and classification.
3. **Given** a budget is being planned, **When** pricing data is retrieved, **Then** both direct and indirect costs are displayed separately with clear labelling.
4. **Given** a report is generated, **When** costs are summarised, **Then** direct and indirect costs are reported as distinct categories.

### User Story 2 - Supplier Price List Self-Service (Priority: P1)

As a Supplier, I want to manage my own price list through the portal so that my pricing is always current and I do not need to rely on Trilogy staff to update it.

**Acceptance Scenarios**:
1. **Given** a verified supplier logs into the portal, **When** they navigate to the pricing section, **Then** they see their current price list organised by service type and location.
2. **Given** a supplier updates a price, **When** they submit the change, **Then** the system validates the price against configured caps and business rules before accepting.
3. **Given** a price exceeds the configured cap, **When** the validation fires, **Then** the supplier receives a clear error message indicating the maximum allowed price and the cap source.
4. **Given** a supplier submits price changes, **When** the changes are saved, **Then** a complete audit trail records the previous price, new price, timestamp, and user who made the change.
5. **Given** a supplier has multiple locations, **When** they update pricing, **Then** they can update prices per-location or use "Apply to All" for uniform pricing.

### User Story 3 - Price Cap Validation (Priority: P1)

As a Compliance Manager, I want pricing to be validated against price caps so that suppliers cannot charge above regulated or agreed maximum rates.

**Acceptance Scenarios**:
1. **Given** price caps are configured for a service type, **When** a supplier enters a price above the cap, **Then** the system rejects the entry with a clear validation message.
2. **Given** SAH price caps are updated, **When** the caps are changed in the system, **Then** existing supplier prices that exceed the new caps are flagged for review.
3. **Given** a bill is submitted with a line item price above the supplier's price list, **When** the bill is processed, **Then** the price anomaly is flagged for manual review.

### User Story 4 - Bill Matching Integration (Priority: P1)

As a Billing Coordinator, I want bill line items to be automatically matched against supplier price lists so that price discrepancies are identified during processing.

**Acceptance Scenarios**:
1. **Given** a bill line item is submitted, **When** the system processes it, **Then** it matches the line item against the supplier's price list for the relevant service type, location, and day-of-week.
2. **Given** a line item price matches the price list within tolerance, **When** processed, **Then** the item is marked as "Price Verified" with a green indicator.
3. **Given** a line item price exceeds the price list by more than the configured tolerance, **When** processed, **Then** the item is flagged as "Price Anomaly" with the expected price shown for comparison.
4. **Given** no price list exists for the supplier/service combination, **When** processing a bill, **Then** the system flags the item as "No Price List" for manual pricing verification.

### User Story 5 - Budget Planning with Pricing Data (Priority: P2)

As a Care Partner, I want budget plans to reflect supplier-specific pricing so that budget estimates are realistic and accurate.

**Acceptance Scenarios**:
1. **Given** a budget plan includes a service from a specific supplier, **When** the budget is calculated, **Then** the supplier's current direct and indirect rates are used for cost estimation.
2. **Given** a supplier updates their pricing, **When** a budget plan references that supplier, **Then** the budget plan shows a "Pricing Updated" notification with the impact on the total.
3. **Given** multiple suppliers are available for a service, **When** comparing options in budget planning, **Then** side-by-side pricing comparison is available.

### Edge Cases

- **No price list available**: Bill items without a matching price list are flagged but not blocked; manual verification is required.
- **Price cap changes retroactively**: Existing prices above new caps are flagged for review but not automatically changed; supplier notification is sent.
- **Multiple rate types for same service**: System supports weekday, Saturday, Sunday, public holiday, and a fifth rate type (e.g., after-hours) per service per location.
- **Price list effective dates**: Price changes take effect from a configurable future date, not retroactively; historical prices are preserved for audit.
- **Supplier submits bill at old rate after price update**: System uses the price list effective at the service delivery date, not the current price.

---

## Functional Requirements

- **FR-001**: System MUST support distinct direct and indirect cost categories for all supplier pricing.
- **FR-002**: System MUST provide a supplier-facing price list management interface with per-service, per-location pricing.
- **FR-003**: System MUST support five rate types per service per location: weekday, Saturday, Sunday, public holiday, and a configurable fifth type.
- **FR-004**: System MUST validate all pricing against configurable price caps with clear validation messages.
- **FR-005**: System MUST flag existing prices that exceed newly updated price caps for review.
- **FR-006**: System MUST integrate pricing data into the bill matching workflow with automatic price comparison.
- **FR-007**: System MUST display price verification status on bill line items: "Price Verified", "Price Anomaly", or "No Price List".
- **FR-008**: System MUST integrate pricing data into budget planning calculations.
- **FR-009**: System MUST maintain a complete audit trail for all pricing changes (previous value, new value, timestamp, actor).
- **FR-010**: System MUST support "Apply to All" functionality for uniform pricing across locations.
- **FR-011**: System MUST support effective dating for price changes with historical price preservation.
- **FR-012**: System MUST use the price list effective at the service delivery date for bill matching, not the current price.
- **FR-013**: System SHOULD support bulk price import/export for large supplier price lists.
- **FR-014**: System SHOULD provide pricing comparison tools for budget planning across multiple suppliers.

---

## Key Entities

- **Price List**: A collection of pricing entries for a supplier. Fields: `id`, `supplier_id` (FK), `name`, `effective_from`, `effective_to`, `status` (draft/active/archived), standard audit fields.
- **Price List Entry**: An individual price for a specific service at a specific location. Fields: `id`, `price_list_id` (FK), `service_type_id` (FK), `location_id` (FK), `cost_type` (direct/indirect), `weekday_rate`, `saturday_rate`, `sunday_rate`, `public_holiday_rate`, `fifth_rate`, `unit` (per_hour/per_visit/per_item), standard audit fields.
- **Price Cap**: Configurable maximum price for a service type. Fields: `id`, `service_type_id` (FK), `cost_type` (direct/indirect), `max_rate`, `effective_from`, `source` (sah_regulation/internal_policy), standard audit fields.
- **Price Audit Log**: Immutable record of all pricing changes. Fields: `id`, `price_list_entry_id` (FK), `field_changed`, `old_value`, `new_value`, `changed_by`, `changed_at`, `reason`.

---

## Success Criteria

### Measurable Outcomes

- **SC-001**: Supplier price list adoption >80% of active suppliers.
- **SC-002**: Bill matching accuracy improvement >20% through automated price verification.
- **SC-003**: Price anomaly detection rate >95%.
- **SC-004**: Budget planning accuracy improvement >15% through supplier-specific pricing data.
- **SC-005**: Manual price management effort reduced by 60%.

---

## Assumptions

- Direct and indirect pricing models are well-defined by the business and documented before development.
- Suppliers have systems or processes capable of managing price lists through a web portal.
- Pricing business rules (caps, tolerances, rate types) are finalized before development.
- Integration points with budget and billing systems are designed and agreed upon.
- SAH price caps and regulated rates are available as reference data.

---

## Dependencies

- Pricing business rules must be finalized by business stakeholders.
- Integration design with budget and billing systems must be completed.
- [Supplier Onboarding 2 (SOP2)](/initiatives/Supplier-Management/Supplier-Onboarding-2/spec) for the pricing matrix UI component.
- SAH regulated price cap data must be sourced and loaded.
- Bill matching engine must support price list lookups by service date.

---

## Out of Scope

- Automated price negotiation workflows between suppliers and Trilogy Care.
- Dynamic pricing based on demand or availability.
- Supplier pricing analytics and benchmarking dashboards (future phase).
- Integration with external pricing databases or market rate services.
- Mobile-specific pricing management interface.


## Clarification Outcomes

### Q1: [Scope] What pricing models are covered?
**Answer:** The spec is comprehensive: FR-001 (direct/indirect cost categories), FR-003 (five rate types: weekday, Saturday, Sunday, public holiday, configurable fifth type), FR-002 (per-service per-location pricing). This covers time-based rates (day-of-week), location-based rates, and cost-type distinction (direct service delivery vs indirect costs like travel). Volume discounts are NOT in scope. The pricing model aligns with SAH requirements for transparent cost categorisation.

### Q2: [Dependency] Does PRI define rate cards that BUR consumes?
**Answer:** Yes. FR-008 states "integrate pricing data into budget planning calculations." The `BudgetPlanItem` model references service types and suppliers. When a budget plan includes a specific supplier's service, PRI's pricing data provides the rates for cost estimation (US5). The `BudgetPlanItemRateCard` and `BudgetPlanItemRate` models in the codebase confirm rate card integration already exists in the budget domain. PRI is the SOURCE of pricing data; the budget system CONSUMES it.

### Q3: [Data] What is the rate card hierarchy?
**Answer:** Per-supplier → per-location → per-service-type → per-rate-type. The `OrganisationPrice` model stores pricing at the location × service level. The `PriceCap` model (`domain/Supplier/Models/PriceCap.php`) stores caps at the service-type level. Prices are NOT per-client — they are supplier-wide (a supplier charges the same rate for cleaning regardless of which client they serve). **Assumption:** If client-specific pricing is needed in the future, it would be handled as a discount or adjustment on the budget plan item, not in the pricing model.

### Q4: [Edge Case] How are price changes handled for existing contracts?
**Answer:** FR-011 explicitly states "support effective dating for price changes with historical price preservation." FR-012 adds "use the price list effective at the service delivery date for bill matching, not the current price." This is a critical requirement — a supplier who changes their rate from $50 to $55 on March 1st should have bills for services delivered in February matched against the $50 rate. The `Price List Entry` entity has `effective_from` and `effective_to` dates. The codebase has `PriceRequest` and `PriceRequestStatusEnum` suggesting price changes go through an approval workflow.

### Q5: [Integration] Does PRI enforce SAH price caps?
**Answer:** Yes. FR-004 validates all pricing against configurable price caps. FR-005 flags existing prices exceeding newly updated caps. The `PriceCap` model stores caps per service type. The `PriceCapController` and `UpdatePriceCapsAction` in V2 manage cap updates. FR-007 in the spec (also SOP2 FR-007) validates supplier-entered prices against these caps. The V2 `PricingGridController` and `PricingOverviewController` provide the pricing UI backend.

### Q6: [Data] The price approval workflow — how does this work?
**Answer:** The codebase has `PriceRequest` model, `PriceRequestStatusEnum`, `SubmitPriceRequestAction`, `ApprovePriceRequestAction`, `RejectPriceRequestAction`, and `BatchApprovePriceRequestsAction`. There is also `StaffPricingApprovalController` and `ApprovalStatusEnum`. This confirms price changes submitted by suppliers go through a staff approval process. The `PriceAuditLog` model and `PriceAuditActionEnum` provide the audit trail. This is already well-scaffolded.

### Q7: [Data] Direct vs indirect pricing — is this a new distinction?
**Answer:** The `OrganisationPrice` model exists but the direct/indirect distinction is new. FR-001 requires separate pricing entries for direct costs (service delivery) and indirect costs (travel, administration, materials). The `Price List Entry` entity defines `cost_type` (direct/indirect). **Recommendation:** Add a `cost_type` column to the existing `OrganisationPrice` model or create separate entries per cost type.

### Q8: [Integration] Bill matching — how does price verification work at bill processing time?
**Answer:** FR-006/FR-007 define price verification on bill line items. When a `BillItem` is processed, the system looks up the supplier's price for that `service_type_id` at the service delivery date, at the relevant location, for the day of week. It compares the billed rate against the price list rate within a configurable tolerance. Status is displayed on the bill item: "Price Verified" (green), "Price Anomaly" (flagged), "No Price List" (manual verification needed). This enhances the existing bill edit view (`Bills/Edit.vue`).

### Q9: [Performance] Price comparison for budget planning — what volume?
**Answer:** US5 (Budget Planning with Pricing Data, P2) includes "side-by-side pricing comparison across multiple suppliers." With ~15,000 suppliers, not all are relevant for a specific service. The comparison would filter to suppliers verified for the specific service type in the client's region. **Assumption:** Typically 3-10 suppliers are compared for a given service, making this a small-volume query.

### Q10: [Edge Case] Bulk price import/export — what format?
**Answer:** FR-013 (SHOULD) supports bulk import/export. Given the pricing matrix structure (service × location × rate type × cost type), a CSV format is most practical. The V2 `SaveRatesAction` already handles batch rate updates. **Recommendation:** CSV format with columns: `service_type_code`, `location_id`, `cost_type`, `weekday_rate`, `saturday_rate`, `sunday_rate`, `public_holiday_rate`, `fifth_rate`, `effective_from`.

## Refined Requirements

1. **Data Model Extension**: Add `cost_type` (direct/indirect) to `OrganisationPrice` to support FR-001. This doubles the number of price entries per service-location combination.

2. **New AC for US4**: Given a bill line item is submitted at $65/hr but the supplier's price list shows $60/hr weekday rate, When the tolerance is configured at 5%, Then the item is flagged as "Price Anomaly" because $65 exceeds $60 + 5% ($63).

3. **New AC for US1**: Given a supplier has a service with direct cost of $60/hr and indirect cost (travel) of $15/visit, When a budget is planned, Then both cost components are displayed separately with a combined total of $75 per visit.

4. **NFR**: Price list lookups for bill matching must complete in <100ms per line item to avoid slowing the bill processing pipeline.
