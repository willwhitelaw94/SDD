---
title: "Feature Specification: AI Invoice Classification System"
---


**Feature Branch**: `feat/TP-3301-AIC-ai-invoice-classification`
**Created**: 2025-12-23
**Status**: Draft
**Epic**: TP-3301-AIC - AI Invoice Classification

---

## Problem Statement

Invoice line items are being misclassified into incorrect categories, causing:
- **Funding stream errors** - Wrong SERG selection (Tier 1) leads to incorrect funding source
- **Client contribution calculation errors** - Wrong co-contribution category affects client payments
- **Inconsistent manual coding** - Offshore/onshore teams apply categories inconsistently and error-prone

Current state: Manual classification with no AI assistance, high error rate, time-consuming QA process.

---

## User Scenarios & Testing

### User Story 1 - AI-Assisted Category Classification (Priority: P1)

**Actor**: Care Coordinator processing an invoice line item

**Scenario**:
A coordinator opens a bill with line item "Physio assessment home visit - 1hr". The AI analyzes the description, supplier data, and client budget to suggest "Allied Health → Physiotherapy" with 92% confidence. The coordinator reviews the suggestion and confirms it.

**User Flow**:
1. Open bill edit page with unclassified line items
2. View AI suggestion displayed as breadcrumb: "Allied Health → Physiotherapy" (92%)
3. See reasoning: "Keywords: 'physio', 'assessment'. Supplier rate: $165/hr matches Physio. Client has Physio budget."
4. Click to confirm suggestion OR click dropdown to change
5. Proceed to select specific service items (scoped to Physiotherapy)

**Why this priority**: Core value proposition - reduces classification time and errors; enables 80% accuracy target

**Independent Test**: User can view AI classification suggestion and confirm or override it for any line item

**Acceptance Scenarios**:
1. **Given** line item with description containing "physio", **When** AI processes it, **Then** suggests Allied Health → Physiotherapy with confidence score
2. **Given** supplier has verified Physiotherapy service, **When** AI processes matching line item, **Then** confidence score increases
3. **Given** AI suggestion is displayed, **When** user clicks confirm, **Then** classification is applied and logged
4. **Given** AI suggestion is displayed, **When** user clicks dropdown, **Then** can select different category

---

### User Story 2 - Breadcrumb Hierarchy Display (Priority: P1)

**Actor**: Billing Coordinator reviewing classified line items

**Scenario**:
A coordinator needs to quickly scan multiple line items to verify classifications. Each item shows a visual breadcrumb with icons and colors indicating the category hierarchy.

**User Flow**:
1. View bill line items table
2. See each item with breadcrumb: "[Icon] Independence → Personal Care → Assistance with self-care"
3. Icons match category (e.g., shower icon for Personal Care)
4. Colors indicate Tier 1 (e.g., purple = Independence)
5. Quickly scan to spot misclassifications visually
6. Click any breadcrumb to expand details or change

**Why this priority**: Visual clarity enables faster review; reduces cognitive load with 15+ categories

**Independent Test**: User can visually identify category hierarchy for all line items at a glance

**Acceptance Scenarios**:
1. **Given** classified line item, **When** viewing table, **Then** breadcrumb shows "Tier 1 → Tier 2 → Tier 3" with icons
2. **Given** Tier 1 category, **When** displayed, **Then** background/text color matches category (configurable colors)
3. **Given** multiple line items, **When** scanning table, **Then** icons provide visual waypoints for category identification
4. **Given** planned service item, **When** displaying breadcrumb, **Then** shows full hierarchy from budget plan

---

### User Story 3 - Scoped Service Selection (Priority: P1)

**Actor**: Care Coordinator selecting service items after AI classification

**Scenario**:
After AI suggests "Personal Care → Assistance with self-care", the coordinator opens the service picker. Instead of seeing all 100+ items, they see only items within Personal Care. To see other categories, they must explicitly step back.

**User Flow**:
1. View line item with AI suggestion "Personal Care → Assistance with self-care"
2. Click to select service items
3. See only Personal Care service items (scoped view)
4. If wrong category: click "Step back to Tier 1" to see all Tier 1 options
5. If completely wrong: click "Step back to ALL" to see full catalog
6. Select items and confirm

**Why this priority**: Prevents accidental wrong category selection; enforces deliberate category changes

**Independent Test**: User sees scoped service items by default and must explicitly expand to see other categories

**Acceptance Scenarios**:
1. **Given** AI suggested Tier 2 category, **When** opening service picker, **Then** only shows items within that Tier 2
2. **Given** scoped view, **When** user clicks "Step back to Tier 1", **Then** shows all Tier 2 options within current Tier 1
3. **Given** Tier 1 view, **When** user clicks "Step back to ALL", **Then** shows all Tier 1 categories
4. **Given** user changes Tier 1/Tier 2, **When** selecting new category, **Then** contribution category warning appears if different

---

### User Story 4 - Promote Unplanned Service Creation (Priority: P2)

**Actor**: Care Coordinator with line item that doesn't match any budget

**Scenario**:
A line item "Emergency plumbing repair" doesn't match any of the client's planned budget items. Currently, coordinators often force it into wrong budgets. The system should prominently suggest creating an unplanned service.

**User Flow**:
1. View line item with no budget match
2. See prominent "No matching budget found" alert
3. See "Create Unplanned Service" button (more visible than current nested option)
4. AI pre-fills unplanned service form with suggested Tier 2 category and possible Tier 3 items
5. Coordinator reviews and creates unplanned service
6. Line item is classified correctly

**Why this priority**: Currently too nested; people choose wrong budgets instead of correct unplanned services

**Independent Test**: User is prompted to create unplanned service when no budget match exists, with AI pre-fill

**Acceptance Scenarios**:
1. **Given** line item with no matching budget, **When** viewing, **Then** "Create Unplanned Service" is prominently displayed (not nested)
2. **Given** unplanned service flow started, **When** AI has suggestion, **Then** Tier 2 category is pre-filled
3. **Given** AI suggests multiple Tier 3 options, **When** creating unplanned service, **Then** suggested items are pre-selected
4. **Given** user creates unplanned service, **When** saved, **Then** line item is linked to new unplanned service

---

### User Story 5 - Multi-Service Line Item Detection (Priority: P2)

**Actor**: Care Coordinator processing invoice with combined services

**Scenario**:
A line item reads "Personal care and cleaning - 3hrs". This contains two different contribution categories that should be split. The AI detects this and recommends splitting.

**User Flow**:
1. View line item with multi-service description
2. See warning: "We detected multiple services: 'personal care' and 'cleaning'. These have different contribution categories."
3. See recommendation: "Split into separate line items for accurate billing"
4. Click "Split Line Item" to create two items
5. AI pre-fills each split item with suggested category
6. Alternatively: Click "Pay as-is, notify supplier" to process but send education email

**Why this priority**: Multi-service items cause contribution calculation errors; splitting ensures accuracy

**Independent Test**: User is warned when line item contains multiple primary keywords and can split or proceed

**Acceptance Scenarios**:
1. **Given** line item with "personal care and cleaning", **When** AI analyzes, **Then** detects multiple service keywords
2. **Given** multi-service detected, **When** viewing, **Then** warning displayed with split recommendation
3. **Given** user clicks "Split Line Item", **When** split created, **Then** two new items with AI-suggested categories
4. **Given** user clicks "Pay as-is, notify supplier", **When** processed, **Then** supplier receives education email about splitting

---

### User Story 6 - Travel/Transport Classification (Priority: P2)

**Actor**: Care Coordinator classifying transport-related line items

**Scenario**:
A line item shows "$8.50 - travel to client". The AI recognizes this as a travel charge (under $10) that should be added to another service line item, not classified as standalone transport.

**User Flow**:
1. View line item with low-value travel charge
2. See AI suggestion: "This appears to be a travel component ($8.50 < $10). Consider adding to related service."
3. See related line items that could include this travel charge
4. Click to merge with related item OR classify as standalone transport
5. If standalone, must select: Direct transport, Indirect transport, or Accompanied activity

**Why this priority**: Transport misclassification is a common error; rates help disambiguate

**Independent Test**: User is guided to correctly classify travel charges based on amount and context

**Acceptance Scenarios**:
1. **Given** line item under $10 with travel keyword, **When** AI analyzes, **Then** suggests adding to related service
2. **Given** direct transport (picking up/dropping off client), **When** classifying, **Then** selects "Direct transport"
3. **Given** Uber/cab receipt, **When** classifying, **Then** selects "Indirect transport"
4. **Given** shopping trip with client, **When** classifying, **Then** selects "Everyday Living" (not transport)
5. **Given** intermingled transport with social support, **When** classifying, **Then** includes in Social Support category

---

### User Story 7 - Retrospective Batch Classification (Priority: P3)

**Actor**: Finance Manager correcting historical bills

**Scenario**:
There are paid but unclaimed bills from Nov 1 - Dec 13 that need reclassification before claiming. The AI can process these in batch using the same classification logic.

**User Flow**:
1. Export list of paid/unclaimed bills to spreadsheet
2. AI processes each line item and suggests categories
3. Review suggestions in spreadsheet format
4. Apply corrections in batch
5. Bills ready for claiming with correct categories

**Why this priority**: Retrospective cleanup needed but less urgent than new invoice processing

**Independent Test**: User can batch-process historical bills through AI classification and apply corrections

**Acceptance Scenarios**:
1. **Given** list of paid/unclaimed bills, **When** exported, **Then** includes all line items with current categories
2. **Given** AI processes batch, **When** complete, **Then** spreadsheet shows suggested categories with confidence
3. **Given** user approves suggestions, **When** applied, **Then** bill items updated with audit trail
4. **Given** batch correction applied, **When** viewing bill, **Then** shows "Batch Corrected" indicator

---

### Edge Cases

- **0% confidence**: Display as "Needs Manual Classification" with no suggestion
- **Multiple high-confidence matches**: Show top 3 alternatives with "Did you mean...?"
- **Supplier not registered**: Reduce confidence, show "Supplier services not verified" warning
- **Client has no budget for suggested category**: Show warning "Client has no approved budget for this category"
- **Line item already claimed**: Display as read-only; no classification changes allowed
- **Rate doesn't match any known service**: Flag for manual review with "Unusual rate" warning
- **Description is blank or generic**: Lower confidence; prompt for more information
- **Multiple currencies or invalid amounts**: Flag for validation before classification

---

## Requirements

### Constraints & Eligibility

- **CONSTRAINT-001**: System MUST only allow classification changes for bills in stages: `IN_REVIEW`, `APPROVED`, `PAYING`, `PAID` (unclaimed)
- **CONSTRAINT-002**: System MUST prevent classification changes for claimed bills
- **CONSTRAINT-003**: System MUST maintain human-in-the-loop for all classifications (no auto-apply)
- **CONSTRAINT-004**: System MUST respect existing permission model for editing line items

### Functional Requirements

#### AI Classification Engine

- **FR-001**: System MUST perform keyword matching on line item descriptions to suggest Tier 2 category
- **FR-002**: System MUST lookup supplier verified services to narrow category options when available
- **FR-003**: System MUST use supplier unit rates to disambiguate similar services (e.g., physio $140 vs OT $500)
- **FR-004**: System MUST reference historical classification data (Nov 1 - Dec 13 cleaned data) for pattern matching
- **FR-005**: System MUST check client budget/approved services to validate category suggestions
- **FR-006**: System MUST check Services Australia Approved Services for the client
- **FR-007**: System MUST calculate confidence score (0-100%) based on signal strength from each source
- **FR-008**: System MUST target 80% accuracy (better than current manual process)
- **FR-008a**: System MUST trigger AI classification on invoice upload; classification occurs off-platform with a local PHP failsafe service
- **FR-008b**: If AI classification fails or dependencies unavailable, system MUST fall back to manual classification (no AI suggestion displayed)

#### Breadcrumb Display

- **FR-009**: System MUST display classification as breadcrumb: "[Icon] Tier 1 → Tier 2 → Tier 3"
- **FR-010**: System MUST display category-specific icons (e.g., shower icon for Independence/Self Care)
- **FR-011**: System MUST apply Tier 1 colors to breadcrumb (e.g., purple = Independence)
- **FR-012**: System MUST show confidence percentage with color coding (green ≥80%, yellow 60-79%, orange <60%)
- **FR-013**: System MUST allow clicking breadcrumb to expand reasoning panel

#### Scoped Selection

- **FR-014**: System MUST scope service picker to show only items within AI-suggested Tier 2 by default
- **FR-015**: System MUST provide "Step back to Tier 1" option to see all Tier 2s within current Tier 1
- **FR-016**: System MUST provide "Step back to ALL" option to see full category catalog
- **FR-017**: System MUST warn when user changes to different contribution category
- **FR-018**: System MUST promote "Create Unplanned Service" when no budget match found (not nested)
- **FR-019**: System MUST pre-fill unplanned service form with AI-suggested categories

#### Multi-Service Detection

- **FR-020**: System MUST detect when line item contains multiple primary keywords from different categories
- **FR-021**: System MUST display warning when multi-service line item detected
- **FR-022**: System MUST offer "Split Line Item" action with AI-suggested categories for each split
- **FR-023**: System MUST offer "Pay as-is, notify supplier" option with education email
- **FR-024**: System SHOULD recommend rejection for multi-service items with different contribution categories (future)

#### Travel/Transport Logic

- **FR-025**: System MUST flag line items under $10 with travel keywords as potential travel charges
- **FR-026**: System MUST suggest merging low-value travel charges with related service items
- **FR-027**: System MUST distinguish: Direct transport, Indirect transport (Uber/cab), Accompanied activities
- **FR-028**: System MUST classify shopping trips with client as "Everyday Living" not transport
- **FR-029**: System MUST include intermingled transport in parent service category (e.g., Social Support)

#### Classification Reasoning

- **FR-030**: System MUST display reasoning for AI suggestions: keywords matched, supplier data, rate analysis, client budget
- **FR-031**: System MUST show top 3 alternative categories considered with confidence scores
- **FR-032**: System MUST indicate when confidence is reduced due to missing data (e.g., "Supplier not verified")

#### Logging & Audit

- **FR-033**: System MUST log all classification actions: AI suggestion, user confirmation, user override
- **FR-034**: System MUST record which AI signals contributed to each classification
- **FR-035**: System MUST track acceptance/rejection rates for AI suggestions (model feedback)

### Key Entities

- **BillItem.ai_extraction** (existing JSON column, extended): AI classification data stored alongside extraction data
  - `suggested_service_type_id` (Tier 2), `confidence_score`, `reasoning` (object), `suggested_service_item_ids` (Tier 3 array), `classification_source` (ai|manual|override), `classified_at`
  - Existing fields: `sa_service_id`, extraction confidence, etc.

- **ClassificationReasoning**: Structure within `ai_extraction.reasoning`
  - `keywords_matched`, `supplier_verified` (boolean), `supplier_service_ids`, `rate_match` (service type matched by rate), `client_budget_match` (boolean), `historical_pattern_match`, `alternative_categories` (array)

- **MultiServiceDetection**: Detection result stored in `ai_extraction`
  - `detected_keywords` (array), `suggested_splits` (array of category suggestions), `notification_sent` (boolean)

---

## Success Criteria

### Measurable Outcomes

- **SC-001**: AI achieves 80% classification accuracy (measured against QA-verified classifications)
- **SC-002**: Coordinator classification time reduced by 60% (from ~2 min to ~45 sec per item)
- **SC-003**: 70% of AI suggestions are confirmed without override (validates model quality)
- **SC-004**: Multi-service detection catches 90% of combined items (validated against manual audit)
- **SC-005**: Travel charge misclassification reduced by 80%
- **SC-006**: "Unplanned service" usage increases by 50% (proper routing vs. forcing into wrong budgets)
- **SC-007**: Supplier verified service coverage reaches 90% by end of January

### User Experience Metrics

- **SC-008**: Users understand AI suggestion within 5 seconds (breadcrumb is immediately parseable)
- **SC-009**: Users can override classification in under 10 seconds (accessible workflow)
- **SC-010**: Zero training required to use new UI (intuitive design validated by user testing)

---

## Assumptions

- AI classification model will be built using keyword matching, supplier data, and rate analysis
- Supplier verified services data is accessible and will reach 90% coverage
- Historical cleaned data (Nov 1 - Dec 13) is available for training/reference
- Human-in-the-loop confirmation is required for all classifications (no auto-apply)
- Philippines team can manually split multi-service items until automated flow is built
- ServiceCategory/ServiceType models are stable with icons and colors configured

---

## Dependencies

- **Supplier Services API**: Access to supplier verified services data
- **Client Budget API**: Access to client's approved services and budget items
- **Services Australia Integration**: Access to approved services list per client
- **Historical Data**: Cleaned classification data from Nov 1 - Dec 13
- **Email Service**: For supplier education notifications
- **Activity Logging**: Existing logging infrastructure for audit trail

---

## Scope Boundaries

### In Scope (Phase 1 - January)

- AI classification engine with keyword + supplier + rate matching
- Breadcrumb hierarchy display with icons and colors
- Scoped service selection with step-back options
- Confidence display with reasoning panel
- Classification override workflow
- Promoted unplanned service creation
- Multi-service detection with split recommendation
- Travel/transport classification logic
- Audit logging of all classifications

### In Scope (Phase 2 - February)

- Top 200 supplier-specific refinements
- Retrospective batch classification for historical bills
- Automated supplier education emails
- Classification acceptance/rejection analytics

### Out of Scope

- Automatic classification without human confirmation
- Supplier portal enhancements (separate initiative)
- Invoice rejection workflow for multi-service items
- Mobile-responsive design
- Product vs. service classification (pending Romy's availability)
- Chart of accounts integration guides

---

## Testing & QA Framework

### Rubric Requirements

- **Rubric spreadsheet** with 15 Tier 2 categories containing:
  - Category descriptions (100-200 characters each)
  - Exclusive keywords (definitive match) - e.g., "Personal Care", "Domestic Assistance"
  - Possible keywords (probable match) - e.g., "Bathroom", "Home Care"
- **Validation process**: Run AI against historical data to validate accuracy
- **Responsible**: Dave & Erin to finalize category list and keywords

---

## Action Items

| Owner | Action |
|-------|--------|
| Dave & Erin | Finalize 15 Tier 2 categories with descriptions and keywords |
| Will | Share AI prompt template for supplier-specific support |
| Data team (Ry, Matthias, Matteo) | Continue custom prompting rollout for top 200 suppliers |
| Erin | Establish casual team to call suppliers for verified services (target 90%) |
| Zoe/QA | Shift from audits to supplier invoicing/price list coaching |
| Romy | Product classification (when available) |

---

## Clarifications

### Session 2025-12-23

- Q: When should AI classification process line items? → A: On invoice upload (background job) - classification happens off-platform with PHP failsafe service locally
- Q: What happens if dependencies unavailable during classification? → A: Skip AI entirely - fall back to manual classification (no AI suggestion). All dependencies are local to DB.
- Q: How should AI classification data be stored? → A: Extend existing `ai_extraction` JSON column on BillItem (already used for extraction data with confidence, sa_service_id, etc.)

---

## Notes

- January target: Majority invoice coverage via AI
- February: Refinement for top 200 providers
- Human-in-the-loop is maintained - AI assists, humans confirm
- Release before Philippines team starts checking to maximize value
- Day of week and rate patterns useful once provider → client relationship spotted
