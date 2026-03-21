---
title: "Feature Specification: Consumer Budget Preview (CBP)"
description: "Client-facing budget visibility with compliant PDF generation under Support at Home"
---

> **[View Mockup](/mockups/consumer-budget-preview/index.html)**{.mockup-link}

**Status**: Draft
**Epic**: TP-1910 | **Initiative**: Budgets & Finance
**Prefix**: CBP | **Created**: 2026-01-14

---

## Overview

Consumer Budget Preview provides clients and their representatives with a clear, compliant, and accessible view of their budgets under the Support at Home program. The feature generates downloadable PDFs displaying Final Agreed Price (FAP) as a consolidated figure, provides source rate transparency (excluding Trilogy loadings), includes regulatory disclaimers, and itemises services with contributions and subsidies. The system serves both new client onboarding and existing client migration, meeting Department of Health compliance requirements.

**Scope boundaries**: This specification covers the client-facing budget output (PDF generation and display). It does not cover the care plan redesign, supplier-specific pricing (supplier names excluded), or AI-driven budget forecasting. The coordinator-facing budget management workflow is covered by the separate [Coordinator Budget Management](/initiatives/budgets-and-finance/coordinator-budget-management) and [Budget Reloaded](/initiatives/budgets-and-finance/budget-reloaded) epics.

---

## User Scenarios & Testing

### User Story 1 - Client Downloads Budget PDF (Priority: P1)

As a client, I want a downloadable PDF of my budget, so that I can print, share, and keep a permanent copy.

**Why this priority**: Core compliance requirement - clients must receive an individualised budget under Support at Home rules (manual version 4, page 100).

**Acceptance Scenarios**:

1. **Given** a client has an approved budget, **When** they click "Preview PDF" on their budget tab, **Then** a PDF is generated within 60 seconds containing accurate budget content
2. **Given** a PDF is generated, **When** the client downloads it, **Then** it includes Trilogy Care branding, large readable fonts, and screen-reader compatible structure
3. **Given** a budget covers multiple funding streams, **When** the PDF is generated, **Then** each funding stream is itemised with services, frequencies, quantities, and costs

---

### User Story 2 - FAP Display per Service and Total (Priority: P1)

As a client, I want to see the Final Agreed Price (FAP) as a single consolidated figure per service and in total, so that I know the official cost without confusion.

**Why this priority**: Mandatory regulatory requirement under Section 155-50 of the Aged Care Rules. FAP must consolidate all fees.

**Acceptance Scenarios**:

1. **Given** a client views their budget, **When** FAP is displayed, **Then** it appears as a single all-inclusive figure per service line consolidating all fees
2. **Given** a coordinator explains a budget, **When** they view the budget, **Then** FAP is broken down to per-service rates for detailed explanation
3. **Given** FAP is displayed, **When** compared to regulatory requirements, **Then** all wording complies with Department of Health terminology

---

### User Story 3 - Budget Summary with Funding Details (Priority: P1)

As a client, I want to see my total ongoing funding, government funding amount (including supplements), classification level, and exact quarterly dollar amount, so that I understand my financial position.

**Why this priority**: Mandatory information required by Support at Home rules for individualised budgets.

**Acceptance Scenarios**:

1. **Given** a budget summary is displayed, **When** the client reviews it, **Then** total ongoing funding, government funding (with supplements), exact classification label/level, and exact quarterly dollar amount are shown
2. **Given** a client has unspent funds, **When** the budget summary displays, **Then** the maximum carry-over amount, current carry-over, and any usage conditions are shown
3. **Given** a budget includes a "Missed Care" scenario, **When** displayed, **Then** a headline reads: "You may lose up to $X this quarter that will not roll over unless..." with a prompt to contact their care partner for a service plan review

---

### User Story 4 - Contribution Rate Display (Priority: P1)

As a client, I want to see my contribution rate and dollar amount per service, so that I understand how much I pay versus government funding.

**Why this priority**: Mandatory compliance requirement - contribution information must be included in individualised budgets.

**Acceptance Scenarios**:

1. **Given** the contribution rate is known, **When** the budget displays, **Then** the contribution rate determination is shown per service with breakdown of participant payment vs government funding
2. **Given** the contribution rate is NOT known, **When** the budget displays, **Then** the maximum contribution rate that could apply is shown with a disclaimer noting assumptions subject to departmental confirmation
3. **Given** service costs are itemised, **When** the client reviews, **Then** each service shows: frequencies/quantities x cost per service = total estimated cost, AND frequencies/quantities x contribution per service = total estimated contribution
4. **Given** subsidy information is available, **When** displayed, **Then** the amount of subsidy the provider is eligible for is shown

---

### User Story 5 - Source Rate Transparency (Priority: P2)

As a self-managing client, I want to see source rates (excluding Trilogy loadings), so that I can procure services at the right cost.

**Why this priority**: Prevents self-managing clients from sourcing at inflated budget rates. Supports transparency under Support at Home.

**Acceptance Scenarios**:

1. **Given** a self-managing client views their budget, **When** source rates are displayed, **Then** procurement costs are shown excluding Trilogy loadings
2. **Given** source rates are displayed, **When** reviewing rate cards, **Then** supplier names are excluded but weekday fees, units, and frequency are shown
3. **Given** a rate card table is shown, **When** the client reviews, **Then** it displays unit prices at different times of the week (e.g., Sundays may cost more)

---

### User Story 6 - Regulatory Disclaimers (Priority: P1)

As a client, I want disclaimers included for estimated funding streams and contributions, so that I understand these are estimates subject to confirmation.

**Why this priority**: Mandatory compliance - disclaimers are required for pre-confirmation periods and contribution rate assumptions.

**Acceptance Scenarios**:

1. **Given** a budget is generated before departmental confirmation, **When** the PDF is created, **Then** contribution rate disclaimers noting assumed calculations subject to departmental confirmation are included
2. **Given** a budget includes carry-over or quarterly funding estimates, **When** the PDF is created, **Then** funding stream disclaimers for quarterly and carryover amounts are included
3. **Given** an admin wants to remove disclaimers after regulatory confirmation, **When** they access configuration, **Then** a toggle/flag is available to disable disclaimers

---

### User Story 7 - Assistive Technology and Home Modifications Budget (Priority: P1)

As a client, I want to see itemised budgets for Assistive Technology (AT) and Home Modifications (HM), so that I understand the cost of specific products, equipment, and services.

**Why this priority**: AT and HM are distinct funding streams under Support at Home and must be itemised separately.

**Acceptance Scenarios**:

1. **Given** a client has AT items in their budget, **When** the budget displays, **Then** an itemised list shows description and cost of each AT product/equipment
2. **Given** a client has HM items in their budget, **When** the budget displays, **Then** an itemised list shows description and cost of each HM supply/service
3. **Given** AT and HM exist alongside ongoing services, **When** the PDF is generated, **Then** they appear as distinct sections

---

### User Story 8 - Collaborative Planning Language (Priority: P2)

As a client, I want the budget to include language reflecting collaborative planning ("prepared in partnership with you"), so that I feel included in the process.

**Why this priority**: Support at Home requires budgets prepared "in partnership" with the person. Supports person-centred care principles.

**Acceptance Scenarios**:

1. **Given** a budget PDF is generated, **When** the header/intro section renders, **Then** it includes words to the effect of "this has been prepared in partnership with you"
2. **Given** the budget references goals, **When** displayed, **Then** it references "your preferences, goals and needs as per your care plan"

---

### Edge Cases

- **Client with no contribution rate determination yet**: Must show maximum possible rate with disclaimer
- **Client with only AT-HM funding (no ongoing services)**: Generate statement with AT-HM sections only; ongoing section shows "No ongoing services planned"
- **Budget generated during rate card migration**: If rate card data is incomplete, PDF generation should fail gracefully with a clear error rather than showing incorrect data
- **Grandfathered vs new Support at Home clients**: Contribution calculations differ; system must apply correct method based on client classification
- **Budget period spanning regulatory changes**: Disclaimers should be period-aware and only display when relevant

---

## Functional Requirements

- **FR-001**: The system MUST generate a downloadable PDF of the client budget within 60 seconds
- **FR-002**: The system MUST display FAP as a single consolidated figure per service line, using Department of Health official terminology per Section 155-50 of the Aged Care Rules
- **FR-003**: The system MUST show total ongoing funding, government funding (including supplements), exact classification label/level, and exact quarterly dollar amount
- **FR-004**: The system MUST display a "Missed Care" headline showing the amount at risk of not rolling over, with a prompt to contact the care partner
- **FR-005**: The system MUST define the period covered by the budget
- **FR-006**: The system MUST show the cost of delivery per service type: frequencies/quantities x cost per service = total estimated cost in the quarterly budget
- **FR-007**: The system MUST show the individual contribution amount per service type: frequencies/quantities x contribution per service = total estimated contribution
- **FR-008**: The system MUST show the amount of subsidy the provider is eligible for, if known
- **FR-009**: The system MUST include contribution rate disclaimers noting assumed calculations subject to departmental confirmation
- **FR-010**: The system MUST include funding stream disclaimers for quarterly and carryover amounts
- **FR-011**: The system MUST provide a toggle/flag to remove disclaimers after regulatory confirmation
- **FR-012**: The system MUST show itemised AT budgets with description and cost of products/equipment
- **FR-013**: The system MUST show itemised HM budgets with description and cost of supplies/services
- **FR-014**: The system MUST show unspent funds/carry-over rules including maximum amount allowed, carry-over amount, and usage conditions
- **FR-015**: The system SHOULD display source rates (excluding Trilogy loadings) for self-managing clients
- **FR-016**: The system SHOULD include collaborative planning language ("prepared in partnership with you")
- **FR-017**: The system SHOULD reference participant preferences, goals, and needs as per their care plan
- **FR-018**: The system MUST use consistent Trilogy Care branding with table structure for rates/units/frequency
- **FR-019**: The system SHOULD support large font and screen reader compatibility for accessibility

---

## Key Entities

| Entity | Description |
|--------|-------------|
| **Budget** | The recipient's quarterly financial plan covering ongoing services, AT, and HM |
| **Final Agreed Price (FAP)** | All-inclusive figure shown to clients, consolidating all fees per regulatory mandate |
| **Source Rate / Source Price** | Actionable provider cost excluding Trilogy loadings; what the client can source a supplier for |
| **Rate Card** | Structured table showing units, frequency, and weekday fee format per service |
| **Contribution Rate** | Determination of how much the participant pays vs government funding |
| **Subsidy** | Government funding amount the provider is eligible for |
| **Disclaimer** | Regulatory text clarifying estimated values for funding streams and contributions |
| **Supplement** | Additional funding (oxygen, enteral feeding, dementia) included in government funding amount |

---

## Success Criteria

### Measurable Outcomes

- 100% of generated budgets meet FAP and disclaimer regulatory requirements
- PDF generation completes in under 60 seconds
- 90% or greater of migrated budgets display correct rate card data
- Coordinator usability satisfaction score of 4.0/5 or higher
- 100% of budgets use Department of Health official terminology
- System supports both onboarding and migration use cases for all coordinators

---

## Assumptions

- All client budgets will be migrated to Budget V2 structure before launch
- Legal disclaimers are finalised and approved in advance by compliance/legal
- Migration team ensures complete and accurate rate card data
- Rate card migration is complete for accurate budget display
- Clients and representatives have access to digital devices and internet (with paper alternative available)

---

## Dependencies

- Budget V2 migration and stability (ensures accurate funding data)
- Rate card infrastructure with complete data
- Legal/compliance approval of disclaimer text (Romy)
- Client communications package aligned with Budget V2 Contact rollout
- Claims workflow stability for correct subsidy and co-payment values
- [Budget Reloaded](/initiatives/budgets-and-finance/budget-reloaded) for underlying budget data model enhancements

---

## Out of Scope

- Care Plan redesign (covered in separate PRD/epic)
- Supplier-specific pricing (supplier names excluded from client view)
- Advanced AI-driven budget forecasting (future enhancement)
- Coordinator-facing budget management workflow (covered by [Coordinator Budget Management](/initiatives/budgets-and-finance/coordinator-budget-management))
- Direct client editing of budget allocations
- Real-time transaction log (covered by [Digital Transactions](/initiatives/budgets-and-finance/digital-transactions))

## Clarification Outcomes

### Q1: [Dependency] The spec depends on Budget V2 migration, rate card infrastructure, and legal/compliance approval of disclaimer text. What is the status of each?
**Answer:** Budget V2 is live based on codebase evidence — `domain/Budget/V2/` contains extensive actions, data classes, and tests. The V2 aggregate root, projectors, and page actions all exist and are functional. Rate card infrastructure exists (`BudgetPlanItemRateData`, `BudgetItemRateType` enum, `GetBudgetPlanItemRateSourcesAction`). Legal/compliance approval of disclaimer text is an external dependency (assigned to Romy per the Dependencies section) and cannot be verified from codebase. This is the most likely blocker — development can proceed with placeholder disclaimer text but cannot ship without legal sign-off.

### Q2: [Scope] US5 (Source Rate Transparency) — how is the "self-managing" flag determined?
**Answer:** The `Package` model tracks management options. The codebase references package types and management levels. Assumption: "self-managing" corresponds to a management option where the client sources their own services rather than using Trilogy-coordinated suppliers. This is likely captured during the Letter to Holder (LTH) onboarding process. The exact attribute name needs verification — search for `management_option` or `self_managing` on the Package model. This is a P2 requirement, so it can be deferred until the attribute is confirmed.

### Q3: [Data] FR-002 requires FAP as a single consolidated figure per Section 155-50. Has the calculation been validated?
**Answer:** FAP (Final Agreed Price) must consolidate all fees per regulatory requirements. The codebase has `CoordinatorLoadingFeeData` and `CoordinatorLoadingFeeOptionData` in `domain/Budget/Data/View/`, and the `RecalculateBudgetPlanCoordinatorLoadingFeeAction` handles loading fee calculations. FAP = base service rate + coordination overhead + any other fees. The formula must be: FAP per service = provider rate + TC coordination loading + any applicable supplements. The exact formula needs compliance validation — it is a regulatory requirement under Section 155-50 of the Aged Care Rules. Recommendation: document the formula in the spec and get compliance sign-off before implementation.

### Q4: [Edge Case] How is "Missed Care" defined? Where does the data come from?
**Answer:** "Missed Care" refers to the gap between planned (budgeted) services and actual service delivery. The budget plan items define planned services; funding consumptions (`budget_plan_item_funding_consumptions` table, referenced in DST spec) track actual spending. "Missed Care" = planned budget allocation - actual spending for the period. The difference represents services that were planned but not delivered, potentially resulting in funds that cannot be rolled over. The data source is the difference between `BudgetPlanItem` planned amounts and `FundingConsumption` actual amounts for the same period.

### Q5: [UX] What are the specific accessibility requirements for the PDF?
**Answer:** The spec mentions "large font and screen reader compatibility" (FR-019, marked as SHOULD). For the aged care demographic: minimum 12pt font body text (preferably 14pt), high contrast ratios (WCAG AA minimum), tagged PDF structure for screen readers, and simple table layouts. The existing PDF generation infrastructure (`domain/Budget/Actions/ServicePlanPdf/GenerateServicePlanPdf.php`) uses Blade templates (`resources/views/pdf/`) for rendering. These templates can be styled for accessibility. Specific WCAG compliance level should be defined — recommendation: WCAG 2.1 AA as the target.

### Q6: [Integration] How does CBP relate to the Digital Statements (DST) epic?
**Answer:** CBP generates a budget preview PDF (forward-looking plan). DST generates monthly statement PDFs (backward-looking actuals). They are distinct outputs but share infrastructure: both generate PDFs, both use Trilogy branding, and both need similar data from the budget/funding domain. Recommendation: create a shared PDF generation service with common branding, formatting, and accessibility patterns. The `ServicePlanPdfData` in `domain/Budget/Data/ServicePlanPdf/` already provides a pattern for budget PDF data assembly.

### Q7: [Data] The spec requires "exact quarterly dollar amount." How is this calculated for different funding stream time windows?
**Answer:** Funding streams have different time windows (per BUR spec: quarterly ON, 6-week RC, 12-month ATHM). The `Funding` model tracks `start_date`, `end_date`, and amounts. Quarterly amounts for non-quarterly streams need pro-rating: for a 12-month ATHM stream, the quarterly amount = annual amount / 4. For RC (6 weeks), the amount is the full stream amount since it does not span multiple quarters. The `GetBudgetPlanFundingStreamsAction` already handles funding stream data assembly.

### Q8: [Scope] Should the PDF be re-generatable when the budget changes?
**Answer:** Yes, implicitly. Each time the client or coordinator requests a PDF, it should generate from the current approved budget data. There is no need to store generated PDFs permanently — they are point-in-time snapshots. However, for audit purposes, consider storing a copy when the budget is formally approved/published. The existing `GenerateServicePlanPdf` action generates on demand.

### Q9: [Edge Case] What happens for grandfathered HCP clients who have not migrated to SAH?
**Answer:** The spec assumes Budget V2 migration is complete for all clients. Grandfathered clients may have different funding structures, contribution calculations (per BUR US9), and terminology. The PDF should handle both SAH and grandfathered formats, or at minimum, only be available for SAH clients. Recommendation: add a guard that CBP PDF generation is only available for SAH-era budgets (commencement date >= SAH start date).

### Q10: [Compliance] FR-011 provides a toggle to remove disclaimers after regulatory confirmation. Who controls this toggle?
**Answer:** The spec says "an admin" can access configuration to toggle disclaimers. This should be a system-level configuration setting (not per-client). Recommendation: implement as a Pennant feature flag (`disclaimer-display`) that can be toggled by admin without deployment. This aligns with the existing Pennant usage pattern in the codebase.

## Refined Requirements

- **FR-REFINED-001**: A shared PDF generation service with common Trilogy branding, accessibility formatting, and template infrastructure SHOULD be created, reusable by both CBP and DST.
- **FR-REFINED-002**: The FAP calculation formula MUST be documented in the spec and validated by compliance before implementation.
- **FR-REFINED-003**: CBP PDF generation SHOULD be gated to SAH-era budgets only (commencement date >= SAH start date) to avoid generating non-compliant PDFs for grandfathered clients.
- **FR-REFINED-004**: The disclaimer toggle (FR-011) SHOULD be implemented as a Pennant feature flag rather than a database configuration setting.
