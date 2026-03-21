---
title: "Feature Specification: Invoice Reclassification (IRC)"
---

> **[View Mockup](/mockups/invoice-reclassification/index.html)**{.mockup-link}

**Status**: Draft
**Epic**: IRC | **Initiative**: Budgets & Finance
**Priority**: P1
**Owner**: Bruce (Design), KWA (Dev)

---

## Overview

Invoice Reclassification (IRC) implements AI-assisted classification of invoice line items to budget categories at the point of entry, replacing the current manual classification process. The system provides AI-suggested budget category assignments with confidence scoring, a classification review modal for human verification and correction, and a learning loop to continuously improve AI accuracy. By processing reclassification at entry rather than downstream, IRC ensures clean data flows into billing, claims, and payment workflows.

**Scope boundaries**: This epic covers AI-powered classification suggestion, confidence scoring, the classification review modal UI, reclassify-at-entry workflow integration, and the learning feedback loop. It does not cover invoice submission (covered by PBS), claims processing (covered by SCP), budget category definition (covered by Budget-Reloaded), or invoice processing pipeline mechanics (covered by Invoices V2).

---

## User Scenarios & Testing

### User Story 1 - System Suggests Budget Category for Invoice Line Items (Priority: P0)

As an Accounts team member, I want the system to automatically suggest a budget category for each invoice line item so that I do not have to manually classify every line.

**Acceptance Scenarios**:

1. **Given** an invoice arrives in the system with one or more line items, **When** the invoice enters the processing pipeline, **Then** the AI classification engine assigns a suggested budget category to each line item along with a confidence score (0-100%)
2. **Given** the AI has classified line items, **When** the Accounts team member views the invoice, **Then** each line item displays the suggested category and its confidence level (e.g., high, medium, low)
3. **Given** the AI cannot determine a category with any meaningful confidence, **When** the line item is processed, **Then** it is marked as "Unclassified" and flagged for mandatory manual review

---

### User Story 2 - Accounts Reviews Classifications via Modal (Priority: P0)

As an Accounts team member, I want to review and correct AI-suggested classifications in a dedicated modal so that I can efficiently verify or override suggestions before the invoice proceeds downstream.

**Acceptance Scenarios**:

1. **Given** an invoice has AI-suggested classifications, **When** the Accounts team member opens the classification modal, **Then** they see all line items listed with their suggested categories, confidence scores, and the ability to accept or change each classification
2. **Given** a line item has a high-confidence classification (above threshold), **When** the modal opens, **Then** the classification is pre-accepted and visually indicated as high confidence, requiring no action unless the user wants to override
3. **Given** a line item has a low-confidence classification, **When** the modal opens, **Then** the line item is visually flagged for review and the user must explicitly confirm or change the classification before proceeding
4. **Given** the user changes a classification, **When** they select a different budget category from the dropdown, **Then** the new category is applied and the change is recorded for the learning loop

---

### User Story 3 - Bulk Classification Acceptance (Priority: P1)

As an Accounts team member processing a large invoice, I want to accept all high-confidence classifications in bulk so that I only need to focus on low-confidence items.

**Acceptance Scenarios**:

1. **Given** an invoice has multiple line items with mixed confidence levels, **When** the user clicks "Accept All High Confidence", **Then** all line items above the confidence threshold are marked as accepted and the view filters to show only remaining items requiring review
2. **Given** the user has accepted high-confidence items in bulk, **When** they review the remaining low-confidence items, **Then** they can classify each one individually and proceed when all items are classified
3. **Given** all line items on an invoice are classified (accepted or manually assigned), **When** the user confirms, **Then** the invoice proceeds to the next stage in the processing pipeline with clean classification data

---

### User Story 4 - AI Learns from Corrections (Priority: P1)

As a system administrator, I want the AI to learn from human corrections so that classification accuracy improves over time.

**Acceptance Scenarios**:

1. **Given** an Accounts team member corrects an AI classification, **When** the correction is saved, **Then** the correction is recorded as training feedback with the original suggestion, the corrected category, and the line item context
2. **Given** the learning loop has accumulated correction data, **When** the AI model is retrained or updated, **Then** accuracy for previously misclassified patterns improves measurably
3. **Given** a specific invoice description pattern was consistently corrected by users, **When** a new invoice with the same pattern arrives, **Then** the AI assigns the corrected category with higher confidence

---

### User Story 5 - Reclassification at Entry Before Downstream Processing (Priority: P0)

As a Finance team member, I want invoice classification to happen at entry so that downstream processes (billing, claims) receive correctly classified data from the start.

**Acceptance Scenarios**:

1. **Given** an invoice enters the system, **When** it reaches the classification step, **Then** the invoice is held from downstream processing until all line items have confirmed classifications
2. **Given** classification is complete for all line items, **When** the invoice is released, **Then** it proceeds to downstream processing (matching, claims) with verified budget categories attached
3. **Given** a previously processed invoice needs reclassification, **When** a user triggers reclassification, **Then** the classification modal opens with current categories and allows changes, which propagate to downstream records

---

### Edge Cases

- **What happens when the AI model is unavailable or returns an error?**
  Line items are marked as "Unclassified" and routed to the manual review queue. The system logs the AI failure and continues processing. Users see a notification that AI suggestions are unavailable.

- **What happens when budget categories are added or changed?**
  The AI model must be updated to include new categories. During the transition, new categories may have low confidence scores. A configuration change triggers revalidation of the category mapping.

- **What happens when a line item description is ambiguous and could map to multiple categories?**
  The AI returns the top suggestion with its confidence score and may present alternative suggestions ranked by confidence. The user selects the correct category via the modal.

- **What happens when the same supplier consistently sends invoices with the same line item descriptions?**
  The AI learns supplier-specific patterns through the learning loop. Over time, invoices from that supplier receive higher-confidence classifications based on historical corrections.

- **What happens when a classification is corrected after the invoice has already been processed downstream?**
  The reclassification triggers an update to downstream records (e.g., budget allocations, pending claims). An audit log entry records the change and affected downstream entities.

---

## Functional Requirements

- **FR-001**: System MUST invoke the AI classification engine for each invoice line item at entry, before downstream processing
- **FR-002**: System MUST assign a suggested budget category and confidence score (0-100%) to each line item
- **FR-003**: System MUST present a classification modal UI showing all line items with their AI suggestions, confidence indicators, and category selection controls
- **FR-004**: System MUST visually distinguish high-confidence, medium-confidence, and low-confidence classifications in the modal
- **FR-005**: System MUST require explicit user confirmation for low-confidence classifications before the invoice can proceed
- **FR-006**: System MUST allow users to accept all high-confidence classifications in bulk
- **FR-007**: System MUST hold invoices from downstream processing until all line items have confirmed classifications
- **FR-008**: System MUST record all classification corrections as training feedback for the AI learning loop
- **FR-009**: System MUST allow reclassification of previously classified invoices with propagation to downstream records
- **FR-010**: System MUST log all classification actions (AI suggestion, user acceptance, user correction, reclassification) with timestamps and user identity for audit
- **FR-011**: System MUST fall back to manual classification when the AI engine is unavailable
- **FR-012**: System SHOULD display alternative category suggestions ranked by confidence when the top suggestion is below the confidence threshold
- **FR-013**: System SHOULD surface classification accuracy metrics to administrators (overall accuracy, accuracy by category, trend over time)

---

## Key Entities

- **InvoiceLineClassification**: Records the classification state of each invoice line item
  - Key Fields: id, invoice_line_item_id, suggested_category_id, confirmed_category_id, confidence_score, classification_status (pending, accepted, corrected, unclassified), classified_by (ai, user), confirmed_by_user_id, confirmed_at
  - Relationships: Belongs to InvoiceLineItem, BudgetCategory

- **ClassificationFeedback**: Training data from user corrections for the AI learning loop
  - Key Fields: id, invoice_line_item_id, original_category_id, corrected_category_id, line_item_description, supplier_id, created_at
  - Relationships: Belongs to InvoiceLineItem, BudgetCategory (original), BudgetCategory (corrected)

- **ClassificationAuditLog**: Tracks all classification lifecycle events
  - Key Fields: id, invoice_line_item_id, action (ai_classified, user_accepted, user_corrected, reclassified), previous_category_id, new_category_id, user_id, timestamp
  - Relationships: Belongs to InvoiceLineItem, User

---

## Success Criteria

### Measurable Outcomes

- **SC-001**: AI classification accuracy exceeds 80% (correctly suggested category matches confirmed category)
- **SC-002**: Manual reclassification time per invoice reduced by 50% compared to fully manual process
- **SC-003**: Zero classification errors reaching the claims stage (all errors caught at entry)
- **SC-004**: AI confidence scores correlate with actual accuracy (high-confidence items are >95% correct)
- **SC-005**: Classification accuracy improves by at least 5 percentage points within 3 months of learning loop activation

---

## Assumptions

- The AI model can be improved beyond its current ~50% confidence level through training on historical data and user corrections
- Budget categories are well-defined, stable, and available as structured reference data
- Invoice line item descriptions contain sufficient information for AI classification (description text, amounts, supplier context)
- The classification step can be inserted into the invoice processing pipeline without disrupting existing workflows
- Users will consistently correct AI misclassifications, providing quality training data for the learning loop

---

## Dependencies

- **Budget Module**: Must provide accurate, up-to-date budget category reference data for classification targets
- **Classification Modal UI (Bruce)**: Design must be completed before frontend development begins
- **AI/ML Infrastructure**: AI classification engine must be available and capable of returning predictions with confidence scores
- **Invoice Processing Pipeline**: Must support a classification gate that holds invoices until classification is confirmed
- **Invoices V2**: Clean invoice data with structured line items is required for effective AI classification

---

## Out of Scope

- Budget category definition and management (covered by Budget-Reloaded)
- Invoice submission and capture (covered by PBS)
- Invoice processing pipeline mechanics beyond the classification step (covered by Invoices V2)
- Claims submission to Services Australia (covered by SCP)
- AI model training infrastructure and MLOps (operational concern, not product scope)
- Supplier onboarding or management

## Clarification Outcomes

### Q1: [Dependency] What is the current state of the AI/ML classification engine?
**Answer:** The codebase shows existing AI infrastructure for bill processing. The `ProcessBillExtraction` action in `domain/Bill/Actions/ProcessBillExtraction.php` handles bill data extraction, suggesting AI/ML integration at the bill ingestion stage. The `FindRecommendedServiceAction` in `domain/Bill/Actions/FindRecommendedServiceAction.php` already provides AI-powered service matching for bill items. The `RecommendedServiceData` in `domain/Bill/Data/View/` contains service recommendation results. This suggests a classification/recommendation engine exists but may need enhancement for budget category classification specifically. The spec notes the current model has ~50% confidence — this baseline exists and needs improvement through the learning loop.

### Q2: [Scope] What is the boundary between IRC and AIV3 (AI Invoice V3)?
**Answer:** Based on the spec's scope boundaries, IRC focuses specifically on budget category classification at the point of entry, with a classification review modal and learning feedback loop. AIV3 (if it exists as a separate epic) likely covers broader AI-assisted invoice processing (OCR extraction, line item parsing, supplier matching). The boundary: IRC = budget category assignment for already-parsed line items. AIV3 = upstream invoice data extraction and parsing. IRC consumes clean line item data from the invoice pipeline (Invoices V2) and adds budget category classification on top. If AIV3 and IRC are duplicate names for the same feature, they should be consolidated. Recommendation: verify with the product team whether AIV3 exists separately.

### Q3: [Data] What downstream records are affected by reclassification, and how far does propagation reach?
**Answer:** When a line item's budget category changes after processing, the following downstream records are affected: (1) `BudgetPlanItemFundingConsumption` — the consumption record links to a specific funding stream via the budget category. Reclassification changes which funding stream is consumed. (2) `BudgetPlanFundingAllocation` — the funding stream allocation amounts may change. (3) Pending claims (in `domain/Claim/`) — if the line item has not yet been claimed to SA, the claim needs to reference the corrected category. (4) Statements (DST) — the consumption records that feed statements would reflect the corrected category. Propagation should NOT reach SA-submitted claims (these require a separate correction workflow per SCP). The `BillItemFundingConsumptionCorrectedData` in `domain/Bill/Data/` and `BillItemServiceTypesCorrectedEvent` already support correction propagation.

### Q4: [Edge Case] What is the expected hold duration, and is there a timeout?
**Answer:** The hold duration depends on the Accounts team's processing speed. For high-confidence items (auto-accepted in bulk), the hold is seconds. For low-confidence items requiring manual review, the hold could be hours to a business day. Recommendation: implement a configurable timeout (default 48 hours) after which unclassified items are escalated to a supervisor queue with a notification. The invoice should remain held — never auto-release unclassified items. The `GetNextBillAssignedToProcessingUserAction` in `domain/Bill/Actions/` shows an existing assignment/queue pattern that could be extended.

### Q5: [UX] What is the confidence threshold, and who configures it?
**Answer:** The spec does not define a specific threshold. Recommendation: default threshold at 80% (high confidence >= 80%, medium 50-79%, low < 50%), configurable via a system setting. The 80% threshold means items with >80% AI confidence are pre-accepted (green visual indicator), 50-79% are flagged for review (yellow), and <50% require mandatory manual classification (red). Configuration should be accessible to Finance administrators, not end users. Implement as a config value in `config/` or a Pennant-managed setting.

### Q6: [Integration] How does IRC integrate with the existing bill processing pipeline?
**Answer:** The bill processing pipeline flows: ingestion -> extraction (`ProcessBillExtraction`) -> service matching (`FindRecommendedServiceAction`) -> evaluation -> approval (`ApproveBill`) -> funding allocation (`CalculateBillFundingAllocations`). IRC inserts a classification gate between extraction/service matching and evaluation. The classification must complete before the bill proceeds to evaluation. The `BillEvaluationTrafficLightEnum` already provides a traffic-light pattern for bill assessment — IRC's confidence indicators can follow the same visual pattern.

### Q7: [Data] How does the ClassificationFeedback entity feed the learning loop?
**Answer:** Each correction creates a `ClassificationFeedback` record with the original AI suggestion and the human correction, plus contextual data (line item description, supplier ID). Over time, this builds a training dataset. The AI model retraining frequency is an operational concern — could be weekly batch retraining or continuous learning depending on the AI infrastructure. The feedback data should be exportable for the ML team. Supplier-specific patterns (US4 AC3) are particularly valuable since suppliers tend to use consistent descriptions.

### Q8: [Performance] What is the expected invoice volume, and can the AI classify in real-time?
**Answer:** The classification needs to happen at bill entry time, which could be hundreds of bills per day. If the AI model is hosted as an API endpoint, each classification call should complete in <1 second per line item. For invoices with 10-50 line items, total classification time should be <10 seconds. If the AI model is slow, classification can be queued and the bill enters a "Classifying" status before the review modal is available.

### Q9: [Scope] Does IRC replace or augment the existing service matching in FindRecommendedServiceAction?
**Answer:** IRC augments, not replaces. `FindRecommendedServiceAction` matches invoice line items to budget plan services (which service was this bill for?). IRC classifies the budget category (which funding category does this service fall under?). These are sequential steps: first match the service, then classify the category. IRC uses the service match result as input context for category classification.

### Q10: [Compliance] Is the classification audit log sufficient for regulatory requirements?
**Answer:** The `ClassificationAuditLog` entity captures all actions with timestamps and user identity. Combined with the existing `LogsActivity` trait pattern, this provides a complete audit trail. For regulatory compliance (SA claims), the confirmed classification must be traceable to the audited decision. The audit log should be immutable (no soft deletes on audit records).

## Refined Requirements

- **FR-REFINED-001**: The confidence threshold MUST be configurable (default 80% for high confidence) and accessible to Finance administrators via system configuration.
- **FR-REFINED-002**: A configurable timeout (default 48 hours) MUST be implemented for unclassified items, with escalation to a supervisor queue. Unclassified items MUST NOT be auto-released.
- **FR-REFINED-003**: IRC MUST be inserted as a classification gate in the existing bill processing pipeline, between extraction/service matching and evaluation/approval.
- **FR-REFINED-004**: Reclassification propagation MUST NOT reach SA-submitted claims. Claims that have been submitted to Services Australia require a separate correction workflow (via SCP or FRR).
