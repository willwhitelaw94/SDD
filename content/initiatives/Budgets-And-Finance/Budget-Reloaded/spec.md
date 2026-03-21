---
title: "Feature Specification: Budget Reloaded (BUR)"
description: "Comprehensive budget UI and workflow redesign for care coordinators"
---

> **[View Mockup](/mockups/budget-reloaded/index.html)**{.mockup-link}

**Status**: Draft
**Epic**: BUR (TP-2501) | **Initiative**: TP-1869 Budgets and Services
**Created**: 2026-01-14 | **Updated**: 2026-03-20
**Assignees**: Will Whitelaw (PO), Bruce Blyth (PO/Design), Romy Blacklaw (PO), Khoa Duong (Backend), Tim Maier (Dev Lead)

---

## Overview

Budget Reloaded is a comprehensive overhaul of the budget management UI and workflow for care coordinators. The epic addresses supplier integration gaps, high cognitive load from repetitive funding stream selection, unclear coordination settings, inconsistent funding displays, and scattered UI patterns. The scope covers supplier and rate card integration, exception-based funding defaults, prominent coordination display, human-readable funding context, unified UI patterns, and enhanced notifications. Work is organised into sub-epics: Discovery (TP-2502), Design (TP-2503), Development (TP-2504), QA (TP-2505), and Release (TP-2506).

Key decisions from the Dec 8, 2025 design review meeting include: renaming "Service Plan" to "Budget" in the front end (backend unchanged), moving funding streams into a collapsible side panel to reclaim screen space, adding pie chart visualisations in collapsed state, displaying remaining balances per funding stream in the left sidebar, removing the misleading overall funding rollup, showing funding stream expiry warnings, and renaming "Coord Loading" to "Coord Overheads".

**Scope boundaries**: This specification covers the coordinator-facing budget management experience within the Trilogy Care Portal. Clinical care plan redesign (US-023, US-024), client data model changes (US-025), and care coordinator inbox enhancements (US-021) are explicitly out of scope and deferred to future epics.

---

## User Scenarios & Testing

### User Story 1 - Item-Based Rate Cards (Priority: P0)

As a care coordinator, I want to add budget items like falls alarms, nutritional powder, and equipment using a quantity + price model (not hours + rate), so that I can allocate non-hourly services correctly.

**Why this priority**: Coordinators cannot do their job without this. Current system only supports hours-based rate cards, forcing workarounds for item-based services.

**Acceptance Scenarios**:

1. **Given** a coordinator is adding a budget item for equipment (e.g., falls alarm), **When** they select "Item" service type, **Then** the form presents quantity and unit price fields instead of hours and rate fields
2. **Given** a coordinator has entered quantity = 2 and unit price = $150, **When** the budget calculates totals, **Then** the line item total shows $300 (quantity x unit price)
3. **Given** a budget contains both hourly and item-based services, **When** the coordinator views the budget, **Then** item-based services are visually distinguished from hourly services
4. **Given** a coordinator opens the rate card section, **When** item-based services exist, **Then** a separate rate card section exists for item-based services

---

### User Story 2 - Funding Stream Allocation Priority (Priority: P0)

As a care coordinator, I want budgets to allocate to quarterly funding first, then unspent funds (when both are selected), so that funding allocation follows the correct priority without glitches.

**Why this priority**: Incorrect allocation order causes budget errors that require manual workarounds (unselect/reselect unspent funds).

**Acceptance Scenarios**:

1. **Given** a budget has both quarterly and unspent funding streams selected, **When** services are allocated, **Then** quarterly funds are allocated first before unspent funds
2. **Given** quarterly funding is exhausted, **When** additional services are added, **Then** unspent funds are allocated for the overflow
3. **Given** a coordinator submits a budget with hybrid funding, **When** reviewing before submission, **Then** allocation order is visible and confirmed
4. **Given** a budget was saved with both funding streams, **When** the coordinator reopens it, **Then** allocation priority is maintained without needing to unselect/reselect

---

### User Story 3 - Remaining Balance in Left Sidebar (Priority: P0)

As a care coordinator, I want to see the remaining cash balance for each funding stream in the left sidebar (visible across all package pages), so that I always know available funds without navigating to the budget page.

**Why this priority**: Coordinators cannot do their job without persistent funding visibility across all package context pages.

**Acceptance Scenarios**:

1. **Given** a coordinator is viewing any package page (Claims, Budget, Documents, etc.), **When** they look at the left sidebar, **Then** remaining balance for each active funding stream is displayed
2. **Given** funding streams have different time windows (e.g., restorative care for 6 weeks, ATHM for 12 months), **When** the sidebar displays, **Then** only currently active funding streams are shown
3. **Given** an invoice is approved, **When** the sidebar next renders, **Then** the remaining balance is updated (Total Funding - Approved Invoice Spend)
4. **Given** a package has 2-5 concurrent funding streams, **When** displayed in sidebar, **Then** they appear as small minimalist cards/badges without visual clutter
5. **Given** a coordinator clicks on a funding stream badge, **When** navigating, **Then** they are taken to the budget/funding detail page

---

### User Story 4 - Expanded Frequency Options (Priority: P1)

As a care coordinator, I want frequency options beyond weekly/fortnightly/monthly (including 3-weekly, 6-weekly, 8-weekly, 13-weekly, biannual, annual), so that I can accurately plan maintenance services.

**Acceptance Scenarios**:

1. **Given** a coordinator is setting up a maintenance service, **When** they open the frequency dropdown, **Then** options include: weekly, fortnightly, 3-weekly, 4-weekly (monthly), 6-weekly, 8-weekly, 13-weekly, biannual, annual
2. **Given** "6-weekly" frequency is selected, **When** 4-weekly totals are calculated, **Then** the calculation correctly reflects the 6-weekly cycle

---

### User Story 5 - Budget Change Comparison (Priority: P1)

As a care coordinator receiving a budget change, I want to see what changed (not just the new version), so that I can approve or reject changes confidently.

**Acceptance Scenarios**:

1. **Given** a coordinator submits a budget change, **When** the approver opens the submission, **Then** a "View Changes" or "Compare" option is available
2. **Given** a budget has changed line items, **When** the approver selects Compare, **Then** a side-by-side diff (or highlighted changes) shows old vs new values
3. **Given** changes are reviewed, **When** the approver is ready, **Then** Approve/Reject buttons appear after reviewing changes

---

### User Story 6 - Batch Save Budget Amendments (Priority: P1)

As a care coordinator, I want to save all budget amendments in one action, so that I can edit multiple services efficiently without waiting for individual saves.

**Acceptance Scenarios**:

1. **Given** a coordinator has made changes to 3 service lines, **When** they click "Save All", **Then** all pending changes are saved in one request
2. **Given** validation errors exist in one field, **When** "Save All" is clicked, **Then** all fields are validated and errors shown before any save occurs
3. **Given** all changes are saved successfully, **When** the save completes, **Then** a single success confirmation is shown

---

### User Story 7 - Funding Stream Expiry Warning (Priority: P1)

As a care coordinator, I want to see when each funding stream will expire based on planned spend, so that I can proactively plan for reviews or contribution changes.

**Acceptance Scenarios**:

1. **Given** a funding stream is projected to run out before the planning period ends, **When** the coordinator views the funding panel, **Then** a warning icon and message appear (e.g., "In 45 days you will be out of funds")
2. **Given** an ATHM funding stream has a 12-month limit, **When** displayed, **Then** the expiry date is prominently shown
3. **Given** a time-window funding stream (e.g., restorative care for 6 weeks), **When** the coordinator plans services, **Then** services cannot be planned beyond the expiry date for that stream

---

### User Story 8 - Pie Charts in Collapsed Funding Panel (Priority: P1)

As a care coordinator, I want to see pie chart visualizations in the collapsed funding panel state, so that I can quickly see funding stream distribution at a glance.

**Acceptance Scenarios**:

1. **Given** the funding panel is collapsed, **When** the coordinator views it, **Then** mini pie charts display for each active funding stream showing plan/spent/projected proportions
2. **Given** the coordinator clicks on a pie chart, **When** expanding, **Then** the full funding detail view opens
3. **Given** services are added or modified, **When** the pie charts render, **Then** they update in real-time

---

### User Story 9 - Participant Contributions Based on Fortnightly Cap (Priority: P1)

As a care coordinator working with grandfathered clients, I want contributions calculated using the fortnightly cap (not monthly percentage), so that clients see accurate expected contributions.

**Acceptance Scenarios**:

1. **Given** a grandfathered client, **When** contributions are calculated, **Then** the fortnightly cap method is used
2. **Given** a hybrid or new client, **When** contributions are calculated, **Then** the monthly percentage method is used
3. **Given** a grandfathered client scenario, **When** the coordinator reviews the budget, **Then** contribution display shows accurate amounts based on the service plan

---

### User Story 10 - Form Validation Consistency (Priority: P1)

As a care coordinator, I want form validation to be consistent (fields with asterisk required, without asterisk optional), so that I do not save incomplete forms.

**Acceptance Scenarios**:

1. **Given** a form field is marked with *, **When** the coordinator leaves it empty and saves, **Then** server-side validation rejects the save with a specific error message
2. **Given** a form field is NOT marked with *, **When** the coordinator leaves it empty, **Then** the form saves successfully
3. **Given** multiple required fields are missing, **When** saving, **Then** all missing required fields are listed in the error message

---

### User Story 11 - Supplement Visibility on Service Plan (Priority: P1)

As a care coordinator, I want supplements to show on the service plan page, so that I can verify all allocated services before submission.

**Acceptance Scenarios**:

1. **Given** a budget includes supplements, **When** the coordinator views the service plan page, **Then** a Supplements section is visible listing all selected supplements with quantities and details
2. **Given** supplements exist, **When** viewed in both draft and submitted states, **Then** they are visible and clearly distinguished from primary services

---

### User Story 12 - Screen Rendering on Laptops (Priority: P1)

As a care coordinator, I want the budget screen to render clearly on laptops without blur, so that I can read and edit budgets properly.

**Acceptance Scenarios**:

1. **Given** a coordinator opens the budget on a laptop at 1366x768 resolution, **When** the page renders, **Then** all text and UI elements are sharp without blur
2. **Given** a coordinator uses 125% browser zoom, **When** the page renders, **Then** text clarity is maintained
3. **Given** a coordinator uses Chrome, Firefox, Safari, or Edge, **When** the page renders, **Then** no blur or rendering issues occur

---

### User Story 13 - Remove Funding Rollup from Right Panel (Priority: P1)

As a care coordinator, I want to see individual funding stream balances (not a combined total), so that I do not misunderstand available funds when they have different time constraints.

**Acceptance Scenarios**:

1. **Given** the funding panel is displayed, **When** the coordinator views it, **Then** only individual funding streams are shown (ON, HC, AT-HM, RC, VC, etc.) with no aggregated "Total Available" rollup
2. **Given** each funding stream is displayed, **When** the coordinator reviews, **Then** each shows its own plan/spent/projected/remaining values

---

### User Story 14 - Total Coordination Fee Display (Priority: P2)

As a care coordinator, I want a field showing total coordination fee for the period, so that I can see coordination costs at a glance.

**Acceptance Scenarios**:

1. **Given** a budget has coordination services, **When** the coordinator views the budget page, **Then** a "Total Coordination Fee" field displays the sum of all coordination fees for the period formatted as currency
2. **Given** coordination services are added or removed, **When** the total updates, **Then** it recalculates automatically

---

### User Story 15 - Minimalist Budget Screen Design (Priority: P2)

As a care coordinator, I want the SAH budget screen to load faster with a minimalist design, so that transitions between screens are quick.

**Acceptance Scenarios**:

1. **Given** a coordinator opens a typical budget, **When** the page loads, **Then** load time is under 2 seconds
2. **Given** a budget line is displayed, **When** the coordinator hovers, **Then** a summary view appears (Frequency, Units, Rates, 4-weekly Total)
3. **Given** a budget line summary is visible, **When** the coordinator clicks the dropdown, **Then** full details expand (planned/projected spend)

---

### User Story 16 - Rename "Coord Loading" to "Coord Overheads" (Priority: P2)

As a care coordinator, I want the coordination cost label to say "Coord Overheads" instead of "Coord Loading", so that terminology is clearer.

**Acceptance Scenarios**:

1. **Given** any budget or funding view, **When** coordination costs are displayed, **Then** the label reads "Coord Overheads" (not "Coord Loading")
2. **Given** the label change is applied, **When** tested across budget UI, service plan, funding breakdown, and tooltips, **Then** all instances are updated consistently

---

### User Story 17 - Service Plan Email Template (Priority: P1)

As a care coordinator, I want configurable email templates for service plan notifications, so that clients receive consistent, branded communication.

**Acceptance Scenarios**:

1. **Given** a service plan is sent, **When** the email is generated, **Then** template variables are populated: [ClientName], [ServicePlanDate], [CoordinatorName], [ContactInfo]
2. **Given** an admin wants to customize the template, **When** they access template settings, **Then** they can edit text and formatting with draft and live versions

---

### User Story 18 - Rename "Duplicate" to "Edit" (Priority: P2)

As a care coordinator, I want the action to edit a submitted plan called "Edit" (not "Duplicate"), so that the UI is intuitive.

**Acceptance Scenarios**:

1. **Given** a submitted plan exists, **When** the coordinator wants to make changes, **Then** the button/menu reads "Edit" instead of "Duplicate"
2. **Given** the coordinator clicks "Edit", **When** a new revision is created, **Then** help text clarifies that editing submitted plans creates a new revision

---

### User Story 19 - Funding Stream Tooltip with Supplement Details (Priority: P2)

As a care coordinator, I want to see supplement dollar amounts in tooltips when hovering over funding stream indicators, so that I understand the total funding breakdown.

**Acceptance Scenarios**:

1. **Given** a coordinator hovers over a funding stream pie/card, **When** the tooltip appears, **Then** it shows breakdown including Oxygen supplement ($X), Enteral feeding supplement ($X), Dementia supplement ($X), date ranges, and MSO percentage/dollar value
2. **Given** 3-5 supplements exist, **When** the tooltip displays, **Then** formatting is clear and readable

---

### User Story 20 - Service Plan PDF Language Update (Priority: P2)

As a client receiving a service plan PDF, I want the language to reflect collaborative planning ("planned with you" instead of "planned for you"), so that I feel included in the planning process.

**Acceptance Scenarios**:

1. **Given** a service plan PDF is generated, **When** the template renders, **Then** it reads "A list of services planned with you" (not "planned for you")
2. **Given** the language is updated, **When** tested across all service plan sections, **Then** collaborative language is consistent

---

### Edge Cases

- **Multiple funding streams with different time windows**: A package with quarterly ON funding and 6-week restorative care must not combine remaining balances into one misleading total
- **Zero-balance funding streams**: When a funding stream is fully consumed, it should display $0 remaining with clear visual indicator
- **Grandfathered vs new client contribution methods**: System must correctly identify client type to apply the right contribution calculation
- **OT prescription vs general OT**: Invoices for OT prescription services (ATHM-eligible) must be distinguished from general OT services (ON-eligible) based on service ID or prescription module flag (requires discovery per US-034)
- **Budget with no services**: Empty budget state should clearly indicate no services have been planned

---

## Functional Requirements

- **FR-001**: The system MUST support an "Item" service type with quantity and unit price fields, separate from the hours-based rate card
- **FR-002**: The system MUST allocate quarterly funding before unspent funds when both are selected for a budget
- **FR-003**: The system MUST display remaining cash balance for each active funding stream in the left sidebar across all package pages
- **FR-004**: The system MUST support frequency options: weekly, fortnightly, 3-weekly, 4-weekly, 6-weekly, 8-weekly, 13-weekly, biannual, and annual
- **FR-005**: The system MUST provide a budget change comparison view showing differences between old and new budget versions
- **FR-006**: The system MUST support batch saving of all budget amendments in a single request
- **FR-007**: The system MUST calculate and display funding stream expiry dates based on current planned spend
- **FR-008**: The system MUST display warning indicators when funding will run out before the end of the planning period
- **FR-009**: The system MUST display pie chart visualizations in the collapsed funding panel state
- **FR-010**: The system MUST use fortnightly cap calculation for grandfathered client contributions and monthly percentage for hybrid/new clients
- **FR-011**: The system MUST enforce consistent form validation where asterisk-marked fields are required and unmarked fields are optional
- **FR-012**: The system MUST display supplements on the service plan page in both draft and submitted states
- **FR-013**: The system MUST render clearly on standard laptop resolutions (1920x1080, 1366x768) at 100% and 125% zoom
- **FR-014**: The system MUST NOT display an aggregated "Total Available" funding rollup; only individual funding stream balances
- **FR-015**: The system SHOULD display a "Total Coordination Fee" calculated field on the budget page
- **FR-016**: The system SHOULD achieve page load time under 2 seconds for a typical budget
- **FR-017**: The system SHOULD provide hover-based summary views with click-to-expand detail sections
- **FR-018**: The system SHOULD support configurable email templates with template variables for service plan notifications
- **FR-019**: The system SHOULD provide funding stream tooltips showing supplement dollar breakdowns, date ranges, and MSO values

---

## Key Entities

| Entity | Description |
|--------|-------------|
| **Budget** | A client's financial plan for a given period, containing service line items allocated across funding streams |
| **Budget Plan Item** | An individual service line within a budget, with frequency, rate, and funding stream allocation |
| **Funding Stream** | A source of funding (ON, HC, AT-HM, RC, VC) with its own balance, time window, and allocation rules |
| **Rate Card** | Structured pricing table supporting both hourly (hours x rate) and item-based (quantity x unit price) models |
| **Coordination Overhead** | Percentage-based loading applied to services for coordination management costs |
| **Service Plan** | The approved version of a budget that is communicated to the client |
| **Supplement** | Additional funding allocations (oxygen, enteral feeding, dementia) attached to a funding stream |

---

## Success Criteria

### Measurable Outcomes

- Funding stream selection time reduced by 80% through exception-based defaults
- Budget creation time reduced by 50% through unified UI patterns and batch save
- Coordinator satisfaction score improved by 20%
- Zero errors from supplier-rate card mismatches
- Page load time under 2 seconds for typical budgets
- Budget screen renders without blur on all supported resolutions and browsers

---

## Assumptions

- Services Australia funding streams are well-defined and stable enough to establish defaults
- Rate cards exist in the current system and can be extended to support item-based (quantity x price) workflows
- Coordination loading percentages are stored and accessible for display
- Package metadata (created by, commencement date, last modified) is tracked in the current system
- Budget V2 is live and stable as the foundation for these enhancements

---

## Dependencies

- Existing rate card infrastructure for supplier and rate card integration
- CMA Activity email notification pattern for reuse in service plan notifications
- Discovery work on OT prescription vs general OT funding stream assignment (US-034) before invoice matching can be finalized
- Funding stream allocation priority logic (US-004) must be completed before quarterly vs total planned toggle (US-005)

---

## Out of Scope

- **Clinical care plan redesign**: Mandatory action plans for risks (US-023), EPOA/AHD recording fields (US-024) - deferred to future clinical epic
- **Client data model changes**: Country of Birth field (US-025) - deferred to future data model epic
- **Care coordinator name in Service Plans inbox** (US-021) - deferred to future epic
- **Outlook email tagging add-in** (US-019) - deferred to separate future epic or TP-2506 release phase
- **Client-facing budget views** - covered by separate Consumer Budget Preview (CBP) epic
- **Direct client access** to coordinator budget workflows

## Clarification Outcomes

### Q1: [Dependency] This epic lists 20 user stories spanning UI, allocation logic, rate cards, email templates, and PDF language. Given the breadth, what is the phased delivery plan? Which user stories form the MVP vs. fast-follow?
**Answer:** The priority labels provide natural phasing: P0 (US1-US3) form the MVP — item-based rate cards, allocation priority, and sidebar balances are all daily-use coordinator needs. P1 stories (US4-US13, US17) form the fast-follow. P2 stories (US14-US16, US18-US20) are enhancements. Recommendation: align MVP with the Support at Home launch timeline dependency. US2 (allocation priority) should be delivered before other allocation-dependent epics (AFC, VCE) since it changes the core allocation order in `AllocateFundingsAction`.

### Q2: [Data] US1 (Item-Based Rate Cards) introduces a new "Item" service type. How does this interact with the existing billing and claims pipeline (SCP, Invoices V2)? Do downstream systems need to support quantity x price alongside hours x rate?
**Answer:** The existing `BudgetItemRateType` enum (`domain/Budget/Enums/BudgetItemRateType.php`) supports WEEKDAY, WEEKDAY_NON_STANDARD, SATURDAY, SUNDAY — all time-based. A new "ITEM" type or separate enum value is needed. The `BudgetItemRateFrequencyEnum` supports ONCE_OFF which partially covers item-based scenarios. Downstream impact: `GenerateClaimInvoiceItems` in `domain/Bill/Actions/GenerateClaimInvoiceItems.php` and `CalculateBillFundingAllocations` currently expect hours-based calculations. These actions will need branching logic for item-based services (quantity x unit price instead of hours x rate). The claims pipeline (SCP) submits to Services Australia which has its own service type codes — item-based services need SA-compatible coding.

### Q3: [Scope] US17 (Service Plan Email Template) mentions configurable email templates. This overlaps significantly with the Email Templates & Notifications (ETN) epic. Should this be deferred to ETN to avoid duplication?
**Answer:** Assumption: US17 should be deferred to or coordinated with ETN to avoid building a template management UI twice. The existing codebase has `BudgetPlanEmailNotification` in `domain/Budget/V2/Notifications/BudgetPlanEmailNotification.php` and `BudgetSendEmailAction` — these use the standard Laravel notification system. If ETN builds a generic template management framework, US17 should consume it rather than build its own. Recommendation: mark US17 as dependent on ETN and reduce BUR scope.

### Q4: [Edge Case] US9 (Participant Contributions Based on Fortnightly Cap) distinguishes grandfathered vs new clients. What data attribute determines client type? Is this classification reliably available in the current data model?
**Answer:** The `Package` model (`domain/Package/Models/Package.php`) tracks package-level attributes including the SAH transition date. The `DefaultPackageContributionRate` projector in `domain/Budget/V2/EventSourcing/Projectors/DefaultPackageContributionRateProjector.php` handles contribution rate calculations. Whether a client is "grandfathered" likely depends on their package commencement date relative to the SAH start date (`config/support-at-home.php` -> `date` field, currently 2025-11-01). Clients with packages commencing before this date would use fortnightly cap; after would use monthly percentage. This classification needs to be explicitly defined and documented — it is not currently a first-class attribute on the package model. Recommendation: add a `contribution_calculation_method` enum or derive it from commencement date vs SAH start date.

### Q5: [UX] The spec mentions moving funding streams into a collapsible side panel (per Dec 8 design review). Has this been validated with care partners through usability testing?
**Answer:** Assumption: the Dec 8 design review included coordinator/care partner feedback, but formal usability testing with field users is not confirmed. The current budget page (`resources/js/Pages/Budgets/` area and Budget V2 Vue components) shows funding streams inline. Moving them to a collapsible panel is a significant UX change. Recommendation: validate with 3-5 active coordinators before committing to development.

### Q6: [Data] US3 requires remaining cash balance per funding stream in the left sidebar across all package pages. What is the calculation formula?
**Answer:** The `Funding` model (`domain/Funding/Models/Funding.php`) already tracks `services_australia_total_amount`, `services_australia_available_amount`, `used_services_amount`, `used_fees_amount`, `adjustment_amount`, and `write_off`. The `SidebarFundingData` in `domain/Package/Data/Sidebar/SidebarFundingData.php` already exists, suggesting sidebar funding display is partially implemented or planned. The remaining balance formula should be: `services_australia_total_amount - used_services_amount - used_fees_amount + adjustment_amount - write_off - rollover_deduction`. This data is already available per package.

### Q7: [Data] US4 requests expanded frequency options. Are these already implemented?
**Answer:** Yes, partially. The `BudgetItemRateFrequencyEnum` already includes: ONCE_OFF, DAILY, WEEKLY, TWICE_WEEKLY, FORTNIGHTLY, FOUR_WEEKLY, SIX_WEEKLY, EIGHT_WEEKLY, THIRTEEN_WEEKLY, BI_ANNUALLY, ANNUALLY. This covers all frequencies listed in US4 (weekly, fortnightly, 3-weekly is missing but 4-weekly, 6-weekly, 8-weekly, 13-weekly, biannual, annual are present). **Gap: 3-weekly is not in the enum and needs to be added as `THREE_WEEKLY` with a daily conversion factor of 21.**

### Q8: [Integration] US5 (Budget Change Comparison) — does the codebase support budget versioning?
**Answer:** The `BudgetPlanStatus` enum supports ACTIVE, DRAFT, SUBMITTED, IN_REVIEW, ARCHIVED, REJECTED. The `DuplicateBudgetPlanAction` creates new drafts from existing plans. Budget plan event sourcing (`BudgetPlanDraftedEvent`, `BudgetPlanUpdated`, etc.) provides a history of changes. However, there is no explicit "version comparison" mechanism. The diff view would need to compare the current ACTIVE plan with the SUBMITTED plan's items. Event sourcing provides the data; the comparison UI needs to be built.

### Q9: [Performance] US15 targets page load under 2 seconds. What is the current budget page load time?
**Answer:** Unknown from codebase analysis alone. The Budget V2 page uses `BudgetPageViewAction` and `BudgetPageDataAction` with multiple eager-loaded relationships. Performance testing is needed. The spec mentions this as P2, so it is an optimization target rather than a blocker.

### Q10: [Scope] US16 rename "Coord Loading" to "Coord Overheads" — how widespread is the term?
**Answer:** The term "coordinator loading" appears in `RecalculateBudgetPlanCoordinatorLoadingFeeAction`, `CoordinatorLoadingFeeData`, `CoordinatorLoadingFeeOptionData`, and related test files. This is a label-only change in the UI but the backend class names use "loading." Recommendation: rename the UI labels only; do not rename backend classes to avoid unnecessary churn. Document the terminology mapping.

## Refined Requirements

Based on the clarification analysis:

- **FR-REFINED-001**: The `BudgetItemRateFrequencyEnum` MUST add a `THREE_WEEKLY` case with `getDailyConversionFactor()` returning 21 to fulfill US4's 3-weekly frequency requirement.
- **FR-REFINED-002**: US17 (Service Plan Email Template) SHOULD be coordinated with or deferred to the ETN epic to avoid building duplicate template management infrastructure.
- **FR-REFINED-003**: A `contribution_calculation_method` attribute or derivation logic MUST be defined to distinguish grandfathered vs new client contribution calculations (US9).
- **FR-REFINED-004**: US1 (Item-Based Rate Cards) requires downstream changes to `GenerateClaimInvoiceItems` and `CalculateBillFundingAllocations` to support quantity x unit price calculations alongside hours x rate.
