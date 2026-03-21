---
title: "Feature Specification: AI Invoice V3 Classification System"
---

> **[View Mockup](/mockups/ai-invoice-v3/index.html)**{.mockup-link}


**Feature Branch**: `feat/TP-2323-AIV3-ai-invoice-classification`
**Created**: 2025-12-23
**Updated**: 2026-02-26
**Status**: Draft
**Epic**: TP-2323-AIV3 - AI Invoice V3

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

**Two-Scenario Chip Behaviour**:

The AI returns a payload of SERTs (service types) with nested SERVs (services) and confidence scores. The UI behaviour differs based on how many SERTs are detected:

- **Sunny day (1 SERT)**: Row shows a violet `✦ AI Suggested` chip with the category name (e.g., "Domestic Assistance"). Clicking "Select service" opens the modal pre-filtered to AI-matched SERVs sorted by confidence.
- **Multi-SERT (2+ SERTs)**: Row shows both `✦ AI Suggested` chip AND an amber pulsing `⑂ Split recommended` chip. See User Story 5 for the full split flow.
- **No AI match**: No chips shown. Standard manual "Select service" flow.

**User Flow (Sunny Day)**:
1. Open bill edit page with unclassified line items
2. View AI suggestion displayed as chip: `✦ Domestic Assistance` next to the "Select service" button
3. Click "Select service" — modal opens pre-filtered to the AI-suggested SERT
4. See rich service rows sorted by AI confidence (service name, date, supplier badge, rate/schedule, budget, ON/OFF status, total, confidence %)
5. Top AI match is pre-highlighted; user confirms or selects a different service
6. After confirmation, chip changes to teal `✓ Service Name (SERV-xxx)` indicating linked service

**User Flow (Override)**:
1. If AI suggestion is wrong, click "Show all services" in the modal to remove the SERT filter
2. Select from the full catalog; contribution category warning appears if different from AI suggestion
3. Override is logged for model feedback

**Why this priority**: Core value proposition - reduces classification time and errors; enables 80% accuracy target

**Independent Test**: User can view AI classification suggestion and confirm or override it for any line item

**Acceptance Scenarios**:
1. **Given** line item with description containing "physio", **When** AI processes it, **Then** suggests Allied Health → Physiotherapy with confidence score
2. **Given** supplier has verified Physiotherapy service, **When** AI processes matching line item, **Then** confidence score increases
3. **Given** AI suggestion is displayed, **When** user clicks confirm, **Then** classification is applied and logged
4. **Given** AI suggestion is displayed, **When** user clicks dropdown, **Then** can select different category
5. **Given** single SERT detected, **When** viewing bill table, **Then** violet "AI Suggested" chip shows category name on the row
6. **Given** no AI match, **When** viewing bill table, **Then** no AI chips shown; standard "Select service" button only
7. **Given** AI suggestion confirmed, **When** service linked, **Then** chip changes to teal with checkmark and linked service name

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

**Service List Modal — Rich Row Pattern**:

The "Select planned service" modal displays services as data-rich rows matching the Estimate component pattern. Each row shows:

| Column | Content |
|--------|---------|
| Icon | `✦` sparkle (AI match) or `○` circle (no match) |
| Service name | e.g., "General house cleaning" |
| Badge | `Unplanned` amber badge if applicable |
| Date | e.g., "27/1/2026 ongoing" |
| Supplier | `MPL` badge (teal) |
| Rate/schedule | e.g., "$50 per hour, 10 hours weekly (weekdays)" |
| Budget | e.g., "$4,105.00" with money bag icon |
| Status | `ON` / `OFF` pill |
| Total | e.g., "$15,371.00" |
| AI confidence | e.g., "92%" (violet badge, only for AI-matched rows) |

The top AI match row is highlighted with a violet left border and violet background. Rows are sorted by AI confidence descending. A footer shows "Show all services (N)" link and "Showing X of Y recommended services."

**User Flow**:
1. View line item with AI suggestion "Personal Care → Assistance with self-care"
2. Click "Select service" — modal opens with AI pre-filter banner: `✦ AI pre-filtered to Personal Care · 95% match`
3. See rich service rows sorted by confidence; top match pre-highlighted
4. If wrong category: click "Show all services" to remove AI filter
5. If completely wrong: step-back navigation to browse Tier 1 → Tier 2 → full catalog
6. Select service and click "Confirm Selection"

**Why this priority**: Prevents accidental wrong category selection; enforces deliberate category changes

**Independent Test**: User sees scoped service items by default and must explicitly expand to see other categories

**Acceptance Scenarios**:
1. **Given** AI suggested Tier 2 category, **When** opening service picker, **Then** only shows items within that Tier 2
2. **Given** scoped view, **When** user clicks "Step back to Tier 1", **Then** shows all Tier 2 options within current Tier 1
3. **Given** Tier 1 view, **When** user clicks "Step back to ALL", **Then** shows all Tier 1 categories
4. **Given** user changes Tier 1/Tier 2, **When** selecting new category, **Then** contribution category warning appears if different
5. **Given** AI-matched services exist, **When** modal opens, **Then** services sorted by confidence with top match pre-highlighted
6. **Given** service list modal, **When** viewing rows, **Then** each row shows service name, date, supplier badge, rate/schedule, budget, status, total
7. **Given** AI-matched row, **When** viewing, **Then** confidence percentage shown as violet badge

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

**Mockup**: See [ai-service-split.html](./context/mockups/ai-service-split.html) for the interactive prototype.

**AI Payload Structure**:

When AI detects multiple SERTs, the payload contains nested service types with confidence scores:

```json
{
  "SERT_1": {
    "confidence": 0.95,
    "name": "Domestic Assistance",
    "services": {
      "SERV_1": { "name": "General house cleaning", "confidence": 0.92 },
      "SERV_2": { "name": "Laundry services", "confidence": 0.87 }
    }
  },
  "SERT_2": {
    "confidence": 0.88,
    "name": "Personal Care",
    "services": {
      "SERV_6": { "name": "Showering assistance", "confidence": 0.81 }
    }
  }
}
```

**UI Flow — 4 States**:

**State 1 — Initial (both chips visible)**:
1. Bill table shows the line item with two chips side by side:
   - Violet `✦ AI Suggested` chip (always present when AI has a suggestion)
   - Amber pulsing `⑂ Split recommended` chip (only when 2+ SERTs detected)
2. The amber chip pulses to draw attention — this is the primary call to action

**State 2 — Split panel slides out**:
3. User clicks the "Split recommended" chip
4. A panel slides out from the right side of the table, showing:
   - Panel header: `✦ AI Split Recommendation` with close button
   - Original item summary: description, total, hours, date
   - SERT cards (one per detected service type), each showing:
     - Split label (Split A, Split B, etc.)
     - SERT name (e.g., "Domestic Assistance")
     - Confidence ring (conic gradient, violet)
     - Matching SERVs listed with individual confidence scores
     - Editable hours and amount allocation
   - Total validation row showing whether the split amounts balance
5. The table compresses to accommodate the panel; the row being split is highlighted amber
6. User can adjust hours/amounts per split leg before confirming

**State 3 — After split (two rows in table)**:
7. User clicks "Confirm Split" in the panel
8. The original single row is replaced by:
   - A **group header row** (gray): `⑂ AI Split from "Description" — $X total` with "Undo split" link
   - **Split row A**: Same date, new description (from top SERV), allocated hours/rate/total, violet left border, `✦ Domestic Assistance · 95%` chip + "Select service" button
   - **Split row B**: Same pattern for second SERT, `✦ Personal Care · 88%` chip + "Select service" button
9. Each split row's "Select service" button opens the modal scoped to that row's SERT
10. The violet left border visually groups the split rows

**State 4 — Undo split**:
11. User clicks "Undo split" on the group header
12. Split children are deleted; original row is restored with both chips
13. Any linked services on the split children are unlinked

**Alternative — Pay as-is**:
- Instead of splitting, user can click "Pay as-is, notify supplier" (in the split panel or via three-dot menu)
- The item is processed with the primary SERT classification
- An education email is sent to the supplier about splitting combined items in future invoices

**Why this priority**: Multi-service items cause contribution calculation errors; splitting ensures accuracy

**Independent Test**: User is warned when line item contains multiple primary keywords and can split or proceed

**Acceptance Scenarios**:
1. **Given** line item with "personal care and cleaning", **When** AI analyzes, **Then** detects multiple service keywords
2. **Given** multi-service detected, **When** viewing bill table, **Then** both "AI Suggested" and amber "Split recommended" chips are shown on the row
3. **Given** user clicks "Split recommended" chip, **When** panel opens, **Then** shows SERT cards with confidence scores and editable allocations
4. **Given** user adjusts split amounts, **When** total doesn't balance, **Then** validation error shown (amounts must equal original total)
5. **Given** user clicks "Confirm Split", **When** split applied, **Then** original row replaced by group header + split child rows with violet left border
6. **Given** split rows in table, **When** user clicks "Select service" on split row A, **Then** modal opens scoped to split A's SERT
7. **Given** split rows in table, **When** user clicks "Undo split", **Then** children deleted and original row restored
8. **Given** user clicks "Pay as-is, notify supplier", **When** processed, **Then** supplier receives education email about splitting
9. **Given** services already linked on split children, **When** user clicks "Undo split", **Then** services are unlinked before restoring original

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

- **0% confidence**: Display as "Needs Manual Classification" with no suggestion; no AI chips shown
- **Multiple high-confidence matches**: Show top 3 alternatives with "Did you mean...?"
- **Supplier not registered**: Reduce confidence, show "Supplier services not verified" warning
- **Client has no budget for suggested category**: Show warning "Client has no approved budget for this category"
- **Line item already claimed**: Display as read-only; no classification changes allowed
- **Rate doesn't match any known service**: Flag for manual review with "Unusual rate" warning
- **Description is blank or generic**: Lower confidence; prompt for more information
- **Multiple currencies or invalid amounts**: Flag for validation before classification
- **Split amounts don't balance**: Validation error in split panel — amounts must equal original total before "Confirm Split" is enabled
- **3+ SERTs detected**: Split panel shows 3+ SERT cards; same flow but with more split legs. Amount allocation becomes more critical.
- **Undo split after services linked on children**: Services are unlinked, children deleted, original restored. User warned before proceeding.
- **Split child row deleted individually**: Not allowed — user must "Undo split" to restore original, then re-split if needed. Individual child deletion would leave orphan siblings.
- **Bill submitted while split is pending**: Split must be fully resolved (all children have linked services) before bill can proceed past `IN_REVIEW`

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

#### Multi-Service Detection & Split

- **FR-020**: System MUST detect when line item contains multiple primary keywords from different categories
- **FR-021**: System MUST display amber "Split recommended" chip with pulse animation when multi-service detected (alongside violet "AI Suggested" chip)
- **FR-022**: System MUST offer "Split Line Item" action with AI-suggested categories for each split
- **FR-022a**: When user clicks "Split recommended" chip, system MUST slide out a panel from the right showing SERT cards with confidence rings, matching SERVs, and editable hour/amount allocations
- **FR-022b**: System MUST validate that split amounts balance to the original total before allowing confirmation
- **FR-022c**: After split confirmation, system MUST replace the original row with a group header and split child rows, each with a violet left border and SERT-scoped "Select service" button
- **FR-022d**: System MUST create real `BillItem` database rows for each split child (not virtual/UI-only)
- **FR-022e**: System MUST soft-hide the original `BillItem` (status = `split`) and store `child_bill_item_ids` in `ai_extraction.split`
- **FR-022f**: Each split child MUST store `parent_bill_item_id` and `split_leg` in `ai_extraction.split`
- **FR-023**: System MUST offer "Pay as-is, notify supplier" option with education email as alternative to splitting
- **FR-023a**: System MUST provide "Undo split" action on the group header row that deletes children, unlinks any services, and restores the original row
- **FR-023b**: "Undo split" MUST be available at any point before the bill is submitted/approved
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

#### Split Data Model (User Story 5)

When a line item is split, the original `BillItem` is soft-hidden and two or more child `BillItem` rows are created in the database. Split children are **real DB rows** — they flow through the normal service selection, GST, loading, and payment pipeline.

**On the original BillItem** (status changes to `split`, hidden from table):

```json
{
  "split": {
    "is_split": true,
    "child_bill_item_ids": [42, 43],
    "split_source": "ai",
    "split_at": "2026-02-26T10:00:00Z"
  },
  "classification": {
    "serts_detected": 2,
    "serts": {
      "SERT_1": {
        "confidence": 0.95,
        "name": "Domestic Assistance",
        "services": {
          "SERV_1": { "name": "General house cleaning", "confidence": 0.92 },
          "SERV_2": { "name": "Laundry services", "confidence": 0.87 }
        }
      },
      "SERT_2": {
        "confidence": 0.88,
        "name": "Personal Care",
        "services": {
          "SERV_6": { "name": "Showering assistance", "confidence": 0.81 }
        }
      }
    }
  }
}
```

**On each split child BillItem**:

```json
{
  "split": {
    "is_split_child": true,
    "parent_bill_item_id": 41,
    "split_leg": "A"
  },
  "classification": {
    "suggested_sert": "Domestic Assistance",
    "confidence": 0.95,
    "services": [
      { "id": "SERV_1", "name": "General house cleaning", "confidence": 0.92 },
      { "id": "SERV_2", "name": "Laundry services", "confidence": 0.87 }
    ]
  }
}
```

**Split Design Decisions**:

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Split children are real `BillItem` rows | Yes | Simpler downstream; each child flows through normal service selection, GST, loading, payment pipeline |
| Dollar amount split | AI suggests based on SERT confidence ratio; user can adjust in panel before confirming | FR-022 requires AI-suggested categories; user retains control |
| Partial service selection | Not allowed — both children must have a service linked before bill can proceed | Prevents orphan line items failing downstream validation |
| Undo split after services linked | Allowed — unlinks services, deletes children, restores parent | Must be reversible at any point before bill is submitted/approved |
| Original item status when split | `split` — hidden from table but preserved | Full audit trail; undo restores to previous status |

### UI Colour Convention

| Colour | Semantic | Usage |
|--------|----------|-------|
| **Violet** (`#7C3AED` / `ai-600`) | AI intelligence | Confidence scores, AI suggestion chips, sparkle icons, split SERT card borders |
| **Amber** (`#D97706`) | Warning / action needed | "Split recommended" chip, pulsing animation, unplanned service badges |
| **Teal** (`#007F7E` / `teal-700`) | Confirmed / success | Linked service chips, supplier badges, "ON" status, "Confirm" buttons |
| **Gray** | Neutral / no AI | Standard rows with no AI involvement |

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

### In Scope (Phase 1 - January/February)

- AI classification engine with keyword + supplier + rate matching
- Breadcrumb hierarchy display with icons and colors
- Scoped service selection with step-back options
- Confidence display with reasoning panel
- Classification override workflow
- Promoted unplanned service creation
- Multi-service detection with split recommendation
- Travel/transport classification logic
- Audit logging of all classifications

### In Scope (Phase 2 - February/March)

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

### Session 2026-02-26 — Multi-Service Split UI Exploration

Built interactive mockup exploring the split flow. Key decisions:

- Q: How should multi-SERT detection be surfaced? → A: Two chips side by side on the row — violet "AI Suggested" (always) + amber pulsing "Split recommended" (only when 2+ SERTs). The amber chip is the primary CTA.
- Q: What happens when user clicks "Split recommended"? → A: A panel slides out from the right showing SERT cards with confidence rings, matching SERVs, and editable allocations. Table compresses to accommodate.
- Q: After split, what does the table look like? → A: Original row replaced by group header ("AI Split from...") + child rows with violet left borders. Each child has its own "Select service" scoped to that SERT. "Undo split" link in header.
- Q: Are split children real DB rows or UI-only? → A: Real `BillItem` rows. Simpler for downstream pipeline (GST, loading, payment). Original gets status `split` and is hidden.
- Q: Can user undo a split after linking services? → A: Yes — services unlinked, children deleted, original restored. Reversible at any point before bill submission.
- Q: What should the service list modal look like? → A: Rich table rows matching the Estimate Figma component — service name, date, supplier badge, rate/schedule, budget, ON/OFF, total, AI confidence %. Top match pre-highlighted.
- Q: Should high-confidence AI scores be green? → A: No — green implies "validated/correct" which is misleading for AI suggestions. Use violet for all AI confidence. Reserve green/teal for user-confirmed actions.
- Q: What colour convention? → A: Violet = AI intelligence, Amber = warning/action needed, Teal = confirmed/linked.
- Mockup: [ai-service-split.html](./context/mockups/ai-service-split.html)
- Data model: [ai-service-split-data-model.md](./context/mockups/ai-service-split-data-model.md)

---

## Notes

- January target: Majority invoice coverage via AI
- February: Refinement for top 200 providers
- Human-in-the-loop is maintained - AI assists, humans confirm
- Release before Philippines team starts checking to maximize value
- Day of week and rate patterns useful once provider → client relationship spotted


## Clarification Outcomes

### Q1: [Scope] This spec and the Invoice Reclassification (IRC) epic both address AI-assisted invoice classification. What is the definitive boundary?
**Answer:** Based on codebase inspection, there is an archived `_archive/AI-Invoice-Classification` directory containing a separate spec and plan. AIV3 is clearly the active successor. AIV3 owns the AI engine, UI chip behaviour, scoped selection, split flow, and breadcrumb display. IV2 (Invoices V2) owns the broader invoice pipeline (anomaly detection, query/dispute, auto-approval, MYOB sync). The IV2 spec explicitly states "AI-based invoice line item classification (covered by AI Invoice V3)" in its Out of Scope. The boundary is clear: AIV3 = classification intelligence, IV2 = pipeline orchestration. No merge needed.

### Q2: [Data] The two-scenario chip behaviour (single SERT vs multi-SERT) introduces UI complexity. Has the multi-SERT split flow been validated with billing staff? What percentage of invoices are expected to trigger split recommendations?
**Answer:** The spec documents a design session on 2026-02-26 that produced an interactive mockup (`ai-service-split.html`). The split flow was explored but there is no explicit validation with billing staff recorded. **Assumption:** Based on aged care invoice patterns, multi-service line items (e.g., "personal care and cleaning") are estimated at 10-20% of total line items. The spec should document the expected split frequency and confirm usability testing has occurred or is planned pre-launch.

### Q3: [Dependency] The AI classification model accuracy target is 80%. What is the current baseline accuracy? If the model is new, what training data is available?
**Answer:** The spec states historical cleaned data from Nov 1 - Dec 13 is available for training/reference. The current process is fully manual with inconsistent classification by offshore/onshore teams, so there is no formal baseline accuracy metric. The 80% target represents "better than current manual process" which the spec identifies as error-prone. FR-008a specifies classification occurs "off-platform with a local PHP failsafe service" suggesting a keyword + rule-based approach rather than an ML model, reducing dependency on training data volume.

### Q4: [Edge Case] When a user overrides the AI suggestion, the override is logged for model feedback. What is the retraining cadence?
**Answer:** FR-033/FR-035 require logging all classification actions and tracking acceptance/rejection rates. The spec does not define a retraining cadence. Given the keyword + supplier data + rate analysis approach (not an ML model), "retraining" likely means rubric refinement rather than model retraining. **Assumption:** Retraining is periodic (monthly), driven by the data team (Ry, Matthias, Matteo) who are responsible for "custom prompting rollout for top 200 suppliers."

### Q5: [Integration] The breadcrumb hierarchy (Tier 1, 2, 3) must align with the Support at Home service classification taxonomy. Is this taxonomy stable?
**Answer:** The codebase has a `ServiceType` model (`app/Models/AdminModels/ServiceType.php`) that is already used throughout the billing pipeline. The `BillItem` model references `service_type_id`. The SAH taxonomy underwent a major revision in late 2025 (SAH program commencement July 2025). **Assumption:** The taxonomy is now relatively stable post-SAH launch, but FR-009 through FR-012 should account for taxonomy updates by referencing the `ServiceType` model dynamically rather than hardcoding tier definitions.

### Q6: [Data] How does AI classification data integrate with the existing `BillItem.ai_extraction` JSON column?
**Answer:** The `BillItem` model (`app/Models/Bill/BillItem.php`) already has an `ai_extraction` column used for extraction confidence and `sa_service_id`. The spec extends this with `suggested_service_type_id`, `confidence_score`, `reasoning`, `suggested_service_item_ids`, `classification_source`, and `classified_at`. This is a sound approach — extending the existing JSON column avoids schema migration for what is semi-structured AI metadata.

### Q7: [Data] The split flow creates real BillItem rows. How does this interact with existing bill totals and the payment pipeline?
**Answer:** Bill totals are calculated from BillItem rows (see `CalculateTotalAmountWithoutTax` action referenced in `BillItem`). Creating real split child rows means bill totals will naturally recalculate. The original item gets status `split` and is hidden. FR-022b requires split amounts to balance to the original total, which ensures no total discrepancy. The existing GST, loading, and fee calculation pipeline (`CalculateFeesAction`, `FeeCalculationData`) will apply to each child independently. This is the cleanest approach.

### Q8: [Scope] FR-023 mentions "Pay as-is, notify supplier" with education email. What email infrastructure does this use?
**Answer:** The codebase uses Laravel notifications extensively (`Spatie\NotificationLog`, `Illuminate\Notifications\Notifiable`). The `Supplier` model implements `Notifiable`. The `BillReminderService` already sends bill-related notifications on a cadence (Day 0->3->7->10). The education email would be a new notification class following existing patterns.

### Q9: [Edge Case] The spec allows classification changes for bills in `IN_REVIEW`, `APPROVED`, `PAYING`, `PAID` (unclaimed). Does the existing `BillStageEnum` support this?
**Answer:** Yes. The `BillStageEnum` has cases: `DRAFT`, `SUBMITTED`, `ESCALATED`, `IN_REVIEW`, `APPROVED`, `PAYING`, `ON_HOLD`, `REJECTED`, `PAID`. CONSTRAINT-001 maps directly to existing enum values. The "unclaimed" distinction for PAID bills would need to be derived from the `ServicesAustraliaInvoiceState` model (claims status).

### Q10: [Dependency] The spec lists "Supplier Services API" as a dependency. Does this exist?
**Answer:** Yes. The `SupplierServiceStatus` model tracks `supplier_id`, `service_type_id`, and `service_status` (verified/unverified via `SupplierServiceStatusEnum`). This provides the supplier verified services data needed for FR-002. The `SupplierVerificationController` and `VerificationController` (V2) expose this data.

### Q11: [UX] The service list modal uses a "rich row pattern matching the Estimate component." Does this component exist?
**Answer:** The bill edit page is at `resources/js/Pages/Bills/Edit.vue` with partials including `BillsEditRightColumn.vue`. There is no specific "Estimate" component found in the codebase by that name. **Assumption:** The rich row pattern is a new UI pattern to be built for this feature, inspired by a Figma design called "Estimate." The spec should reference the specific Figma frame or provide a component wireframe.

### Q12: [Performance] AI classification triggers on invoice upload. What is the expected latency?
**Answer:** FR-008a states classification happens "off-platform with a local PHP failsafe service." This suggests an async job pattern. The existing bill creation flow (`CreateBillAction` in V2) could dispatch a classification job. The "local PHP failsafe" implies a synchronous fallback if the external service is unavailable. **Recommendation:** Specify maximum acceptable latency (e.g., <5 seconds for the PHP fallback, <30 seconds for external service) and confirm the async job approach.

### Q13: [Migration] How are existing unclassified bills handled when this feature launches?
**Answer:** US7 (Retrospective Batch Classification, P3) covers this — historical bills from Nov 1 - Dec 13 can be batch-processed. However, there is no migration plan for bills created between Dec 13 and feature launch. **Recommendation:** Add a scope note clarifying whether AI classification will backfill to all unclassified `IN_REVIEW` and `APPROVED` bills, or only apply to newly submitted bills.

### Q14: [Permissions] CONSTRAINT-004 says "respect existing permission model for editing line items." What permissions govern line item editing?
**Answer:** The `BillPolicy` (`app/Policies/BillPolicy.php`) governs bill-level permissions. Bill items inherit permissions from their parent bill. Editing is typically restricted to bills in `IN_REVIEW` stage by users with bill processing roles. The Care Coordinator role referenced in the spec aligns with existing role-based access control. No new permission model is needed.

## Refined Requirements

Based on clarification outcomes, the following additional acceptance criteria are recommended:

1. **AC for US1**: Given the AI classification service is unavailable, When a bill is submitted, Then no AI chips are shown and the manual "Select service" flow is available (FR-008b already covers this, but should be an explicit test scenario).

2. **AC for US5**: Given a bill has split children in progress, When the bill processor attempts to move the bill past `IN_REVIEW`, Then the system blocks progression with "All split children must have linked services before bill can proceed."

3. **AC for US7**: Specify the backfill scope — does batch classification apply to all historical unclassified bills, or only the Nov 1 - Dec 13 date range?

4. **NFR**: Add explicit latency requirements for the PHP failsafe classification service (target: <5 seconds per line item).
