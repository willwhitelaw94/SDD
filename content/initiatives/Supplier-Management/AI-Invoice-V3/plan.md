---
title: "Plan"
---


**Feature**: AI Invoice V3 Classification System
**Epic**: TP-2323-AIV3
**Feature Spec**: [spec.md](./spec.md)
**Design Spec**: [design.md](./design.md)
**Created**: 2025-12-23
**Updated**: 2026-02-03
**Status**: Draft

---

## Technical Context

### Existing Infrastructure

- **BillItem Model**: Already has `ai_extraction` JSON column (used for extraction confidence, `sa_service_id`, etc.)
- **ServiceCategory Model**: Tier 1 categories with `icon`, `colour` fields (8 categories)
- **ServiceType Model**: Tier 2 services linked to `ContributionCategory`
- **ServiceItem Model**: Tier 3 specific line items
- **Bill Edit Page**: `resources/js/Pages/Bills/Edit.vue` - primary integration point
- **Supplier Services**: Existing `services` relationship on Supplier model (~50% coverage)

### Key Decision: Extend ai_extraction Column

Per clarification (2025-12-23): Extend existing `BillItem.ai_extraction` JSON column rather than creating new tables. This preserves extraction data alongside classification data.

### Classification Trigger

Per clarification: Classification occurs **off-platform** on invoice upload. A local PHP failsafe service provides backup classification. If both fail, fall back to manual classification (no AI suggestion displayed).

---

## Constitution Check

| Principle | Status | Implementation Notes |
|-----------|--------|---------------------|
| I. Majestic Monolith | ✅ | All classification logic in domain/Billing, no microservices |
| II. Domain-Driven Design | ✅ | New Actions in domain/Billing/Actions, DTOs for classification data |
| III. Convention Over Configuration | ✅ | Follow existing BillItem patterns, use config for classification rules |
| IV. Code Quality Standards | ✅ | Type-safe DTOs, explicit return types, PHPDoc for complex types |
| V. Testing is First-Class | ✅ | Unit tests for classification engine, Feature tests for API, Browser tests for UI |
| VI. Event Sourcing | ⚪ | Not required - classification is not financial transaction |
| VII. Laravel Data for DTOs | ✅ | AiClassificationData, ClassificationReasoningData, MultiServiceDetectionData |
| VIII. Action Classes | ✅ | ClassifyBillItemAction, DetectMultiServiceAction, SuggestUnplannedServiceAction |
| X. Inertia.js + Vue 3 + TypeScript | ✅ | New Vue components with TypeScript interfaces |
| XI. Component Library & Tailwind | ✅ | Use existing CommonBadge, CommonDropdown; create new components |
| XIII. Progress Over Perfection | ✅ | Phase 1 (January) = MVP, Phase 2 (February) = refinements |
| XIV. Feature Flags | ✅ | `ai_invoice_classification` flag for staged rollout |
| XV. Permissions | ✅ | Reuse existing `edit-bill-item` permission |
| XVI. Compliance & Audit | ✅ | Log all classification actions (AI suggestion, confirm, override) |

---

## Data Model

### Extended BillItem.ai_extraction Structure

```php
// BillItem.ai_extraction JSON structure
{
    // Existing extraction fields (preserve)
    "confidence": 0.85,
    "sa_service_id": 12345,
    "extracted_at": "2025-12-23T10:00:00Z",

    // NEW: AI Classification fields
    "classification": {
        "suggested_service_type_id": 5,        // Tier 2 ID
        "suggested_service_category_id": 2,    // Tier 1 ID (denormalized for speed)
        "confidence_score": 92,                 // 0-100
        "suggested_service_item_ids": [12, 15, 18],  // Tier 3 IDs (array)
        "classification_source": "ai",          // ai | manual | override
        "classified_at": "2025-12-23T10:01:00Z",
        "classified_by": null,                  // User ID if manual/override

        "reasoning": {
            "keywords_matched": ["physio", "assessment"],
            "keywords_score": 85,
            "supplier_verified": true,
            "supplier_service_ids": [5, 8],
            "supplier_score": 100,
            "rate_match": {
                "detected_rate": 165.00,
                "expected_range": [140, 180],
                "matched_service_type_id": 5,
                "rate_score": 90
            },
            "client_budget_match": true,
            "budget_remaining": 2400.00,
            "budget_score": 100,
            "historical_pattern_match": null,
            "alternative_categories": [
                {"service_type_id": 6, "confidence": 67, "reason": "rate mismatch"},
                {"service_type_id": 10, "confidence": 45, "reason": "generic fallback"}
            ]
        },

        "multi_service_detection": {
            "detected": false,
            "detected_keywords": [],
            "suggested_splits": [],
            "notification_sent": false
        },

        "travel_detection": {
            "is_travel": false,
            "travel_type": null,  // direct | indirect | accompanied
            "merge_suggested_item_id": null
        }
    }
}
```

### DTOs (Laravel Data)

```
domain/Billing/Data/
├── AiClassificationData.php           # Top-level classification result
├── ClassificationReasoningData.php    # Reasoning breakdown (keywords, supplier, rate, budget)
├── MultiServiceDetectionData.php      # Multi-service detection result
├── TravelDetectionData.php            # Travel/transport detection result
├── ClassificationAlternativeData.php  # Alternative category suggestion
└── ClassificationRequestData.php      # Input for classification action
```

---

## Backend Architecture

### Actions (domain/Billing/Actions/)

| Action | Purpose | Input | Output |
|--------|---------|-------|--------|
| `ClassifyBillItemAction` | Orchestrates classification | `BillItem`, `?Supplier` | `AiClassificationData` |
| `MatchKeywordsAction` | Keyword matching against rubric | `string $description` | `KeywordMatchResult` |
| `MatchSupplierServicesAction` | Check supplier verified services | `Supplier`, `string $description` | `SupplierMatchResult` |
| `MatchRateAction` | Rate disambiguation | `float $rate`, `?ServiceType` | `RateMatchResult` |
| `MatchClientBudgetAction` | Client budget validation | `Package`, `ServiceType` | `BudgetMatchResult` |
| `DetectMultiServiceAction` | Multi-service keyword detection | `string $description` | `MultiServiceDetectionData` |
| `DetectTravelAction` | Travel/transport classification | `BillItem` | `TravelDetectionData` |
| `SuggestUnplannedServiceAction` | Generate unplanned service pre-fill | `AiClassificationData` | `UnplannedServiceSuggestion` |
| `ConfirmClassificationAction` | User confirms AI suggestion | `BillItem`, `User` | `void` |
| `OverrideClassificationAction` | User overrides AI suggestion | `BillItem`, `ServiceType`, `User` | `void` |
| `SplitBillItemAction` | Split multi-service item | `BillItem`, `array $splits` | `Collection<BillItem>` |
| `LogClassificationAction` | Audit trail for classification | `BillItem`, `string $action`, `User` | `void` |

### Services (domain/Billing/Services/)

| Service | Purpose |
|---------|---------|
| `ClassificationRubricService` | Load/cache Tier 2 categories with keywords (exclusive + possible) |
| `ConfidenceCalculatorService` | Calculate weighted confidence score from signals |
| `ClassificationFailsafeService` | Local PHP fallback if off-platform classification fails |

### Events (domain/Billing/Events/)

| Event | Payload | Listeners |
|-------|---------|-----------|
| `BillItemClassified` | `BillItem`, `source`, `confidence` | `LogClassificationListener` |
| `ClassificationOverridden` | `BillItem`, `from`, `to`, `User` | `LogClassificationListener`, `UpdateFeedbackListener` |
| `MultiServiceDetected` | `BillItem`, `keywords` | `NotifyCoordinatorListener` |
| `SupplierEducationRequired` | `Supplier`, `BillItem` | `SendSupplierEducationEmailListener` |

### API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/api/v1/bill-items/{id}/classification` | Get AI classification for item |
| `POST` | `/api/v1/bill-items/{id}/classification/confirm` | Confirm AI suggestion |
| `POST` | `/api/v1/bill-items/{id}/classification/override` | Override with different category |
| `POST` | `/api/v1/bill-items/{id}/split` | Split multi-service item |
| `GET` | `/api/v1/service-types/{id}/service-items` | Get scoped service items |
| `GET` | `/api/v1/service-categories/{id}/service-types` | Step-back to Tier 1 |
| `GET` | `/api/v1/service-categories` | Step-back to ALL |

### Controllers

```
app/Http/Controllers/Api/V1/
├── BillItemClassificationController.php
│   ├── show(BillItem $billItem)                    # GET classification
│   ├── confirm(BillItem $billItem)                 # POST confirm
│   ├── override(BillItem $billItem, Request)       # POST override
│   └── split(BillItem $billItem, Request)          # POST split
│
└── ScopedServiceController.php
    ├── serviceItems(ServiceType $serviceType)      # GET scoped items
    ├── serviceTypes(ServiceCategory $category)     # GET step-back Tier 1
    └── serviceCategories()                         # GET step-back ALL
```

---

## Frontend Architecture

### New Vue Components

| Component | Location | Purpose |
|-----------|----------|---------|
| `AiClassificationBreadcrumb.vue` | `resources/js/Components/Bill/` | Breadcrumb with icon, Tier 1 → Tier 2, confidence badge, expand |
| `AiReasoningPanel.vue` | `resources/js/Components/Bill/` | Expandable reasoning: keywords, supplier, rate, budget, alternatives |
| `ScopedServicePicker.vue` | `resources/js/Components/Bill/` | Service picker with step-back navigation (Option B: Breadcrumb at top) |
| `ServicesTableHeader.vue` | `resources/js/Components/Bill/` | Header showing Co-Contrib → SERG → Services array (Option C: Horizontal tags with dropdown) |
| `ConfidenceBadge.vue` | `resources/js/Components/Common/` | Color-coded percentage (green/yellow/orange) |
| `MultiServiceWarning.vue` | `resources/js/Components/Bill/` | Warning banner with Split / Pay as-is buttons (Option B: Compact with popover) |
| `TravelWarning.vue` | `resources/js/Components/Bill/` | Low-value travel suggestion banner |
| `UnplannedServicePrompt.vue` | `resources/js/Components/Bill/` | Prominent CTA when no budget match (Option A) |
| `ContributionCategoryWarning.vue` | `resources/js/Components/Bill/` | Warning when changing contribution category |

### TypeScript Interfaces

```typescript
// resources/js/types/classification.ts

interface AiClassification {
    suggested_service_type_id: number | null;
    suggested_service_category_id: number | null;
    confidence_score: number;
    suggested_service_item_ids: number[];
    classification_source: 'ai' | 'manual' | 'override';
    classified_at: string | null;
    reasoning: ClassificationReasoning;
    multi_service_detection: MultiServiceDetection;
    travel_detection: TravelDetection;
}

interface ClassificationReasoning {
    keywords_matched: string[];
    keywords_score: number;
    supplier_verified: boolean;
    supplier_score: number;
    rate_match: RateMatch | null;
    client_budget_match: boolean;
    budget_remaining: number | null;
    budget_score: number;
    alternative_categories: AlternativeCategory[];
}

interface MultiServiceDetection {
    detected: boolean;
    detected_keywords: string[];
    suggested_splits: SuggestedSplit[];
}

interface TravelDetection {
    is_travel: boolean;
    travel_type: 'direct' | 'indirect' | 'accompanied' | null;
    merge_suggested_item_id: number | null;
}
```

### Integration Point: Bill Edit Page

Modify `resources/js/Pages/Bills/Edit.vue`:

1. **Add AiClassificationBreadcrumb** above each line item row (Option D: Two-Line Compact)
2. **Add ServicesTableHeader** at top of services selection panel (Option C: Horizontal tags with dropdown)
3. **Replace existing service picker** with ScopedServicePicker (or wrap existing)
4. **Add warning components** (MultiServiceWarning, TravelWarning, UnplannedServicePrompt)

### User Preferences Applied

| Element | User Selection | Implementation |
|---------|---------------|----------------|
| Breadcrumb | Option D: Two-Line Compact | `[Icon] Tier 1 → Tier 2` on line 1, `92%` badge on line 2 |
| Services Header | Option C: Horizontal Tags with Dropdown | Selectable tags, overflow menu, click to change |
| Scoped Picker | Option B: Breadcrumb at Top | `← Allied Health › Physiotherapy (12 items)` navigation |
| Reasoning Panel | Option B: Signal Strength Bars | Progress bars for each signal type |
| Multi-Service Warning | Option B: Compact with Popover | Inline warning, [Fix ▼] dropdown for actions |
| Unplanned Service | Option A: Prominent CTA | Large button, AI pre-fill explanation |

---

## Configuration

### Feature Flag

```php
// config/features.php
'ai_invoice_classification' => [
    'enabled' => env('FEATURE_AI_INVOICE_CLASSIFICATION', false),
    'rollout_percentage' => 0,  // 0-100 for staged rollout
],
```

### Classification Rubric

```php
// config/classification-rubric.php
return [
    'service_types' => [
        1 => [
            'name' => 'Personal Care',
            'exclusive_keywords' => ['personal care', 'self-care', 'hygiene assistance'],
            'possible_keywords' => ['bathroom', 'shower', 'bathing', 'dressing'],
            'expected_rate_range' => [50, 80],
        ],
        2 => [
            'name' => 'Physiotherapy',
            'exclusive_keywords' => ['physio', 'physiotherapy', 'physical therapy'],
            'possible_keywords' => ['assessment', 'treatment', 'mobility', 'exercise'],
            'expected_rate_range' => [140, 180],
        ],
        // ... 15 total Tier 2 categories
    ],

    'confidence_weights' => [
        'keywords_exclusive' => 40,
        'keywords_possible' => 20,
        'supplier_verified' => 25,
        'rate_match' => 10,
        'client_budget' => 5,
    ],

    'multi_service_triggers' => [
        ['personal care', 'cleaning'],
        ['personal care', 'domestic'],
        ['transport', 'shopping'],
    ],

    'travel_threshold' => 10.00,  // Under this = travel component
];
```

---

## Testing Strategy

### Unit Tests (domain/Billing/Tests/Unit/)

| Test File | Coverage |
|-----------|----------|
| `MatchKeywordsActionTest.php` | Exclusive vs possible keywords, confidence scores |
| `MatchSupplierServicesActionTest.php` | Verified supplier, unverified supplier |
| `MatchRateActionTest.php` | Rate within range, outside range, no range |
| `ConfidenceCalculatorServiceTest.php` | Weighted score calculation |
| `DetectMultiServiceActionTest.php` | Multi-service detection, split suggestions |
| `DetectTravelActionTest.php` | Travel detection, merge suggestions |

### Feature Tests (tests/Feature/)

| Test File | Coverage |
|-----------|----------|
| `BillItemClassificationApiTest.php` | GET/POST endpoints, authorization |
| `ClassificationConfirmTest.php` | Confirm flow, audit logging |
| `ClassificationOverrideTest.php` | Override flow, contribution warning |
| `BillItemSplitTest.php` | Split multi-service items |
| `ScopedServiceSelectionTest.php` | Scoped picker, step-back navigation |

### Browser Tests (tests/Browser/)

| Test File | Coverage |
|-----------|----------|
| `AiClassificationBreadcrumbTest.php` | Breadcrumb display, click to expand |
| `ScopedServicePickerTest.php` | Default scope, step-back buttons |
| `MultiServiceWarningTest.php` | Warning display, split action |
| `ClassificationWorkflowTest.php` | End-to-end: view → confirm/override → save |

---

## Implementation Phases

### Phase 1: Core Classification (January-February)

**Week 1-2: Backend Foundation**
- [ ] Create DTOs (AiClassificationData, ClassificationReasoningData, etc.)
- [ ] Create ClassificationRubricService with config
- [ ] Create MatchKeywordsAction, MatchRateAction
- [ ] Create ConfidenceCalculatorService
- [ ] Extend BillItem model with `ai_extraction` accessors
- [ ] Unit tests for all classification logic

**Week 2-3: Classification Actions**
- [ ] Create ClassifyBillItemAction (orchestrator)
- [ ] Create MatchSupplierServicesAction
- [ ] Create MatchClientBudgetAction
- [ ] Create DetectMultiServiceAction
- [ ] Create DetectTravelAction
- [ ] Create ConfirmClassificationAction, OverrideClassificationAction
- [ ] Create LogClassificationAction with audit trail
- [ ] Feature tests for classification workflows

**Week 3-4: API & Controllers**
- [ ] Create BillItemClassificationController
- [ ] Create ScopedServiceController
- [ ] API authorization (use existing permissions)
- [ ] Feature tests for API endpoints

**Week 4-5: Frontend Components**
- [ ] Create ConfidenceBadge.vue
- [ ] Create AiClassificationBreadcrumb.vue (Option D: Two-Line Compact)
- [ ] Create AiReasoningPanel.vue (Option B: Signal Strength Bars)
- [ ] Create ScopedServicePicker.vue (Option B: Breadcrumb Navigation)
- [ ] Create ServicesTableHeader.vue (Option C: Horizontal Tags with Dropdown)
- [ ] TypeScript interfaces for classification types

**Week 5-6: Integration & Warnings**
- [ ] Integrate components into Bill Edit page
- [ ] Create MultiServiceWarning.vue (Option B: Compact with Popover)
- [ ] Create TravelWarning.vue
- [ ] Create UnplannedServicePrompt.vue (Option A: Prominent CTA)
- [ ] Create ContributionCategoryWarning.vue
- [ ] Browser tests for UI workflows

**Week 6: Polish & Rollout**
- [ ] Feature flag implementation
- [ ] Staged rollout (10% → 50% → 100%)
- [ ] Monitoring and error tracking
- [ ] User documentation/training

### Phase 2: Refinement (February-March)

**Week 7-8: Top 200 Suppliers**
- [ ] Supplier-specific classification prompts
- [ ] Custom keyword mappings per supplier
- [ ] Supplier rate normalization

**Week 8-9: Retrospective Batch**
- [ ] Batch classification export/import
- [ ] Historical data reclassification
- [ ] Batch correction audit trail

**Week 9-10: Analytics & Feedback**
- [ ] Classification acceptance/rejection metrics
- [ ] Confidence calibration analysis
- [ ] Model feedback loop implementation

---

## Monitoring & Observability

### Metrics

| Metric | Description | Alert Threshold |
|--------|-------------|-----------------|
| `classification.accuracy` | AI suggestions accepted without override | < 70% |
| `classification.confidence.avg` | Average confidence score | < 60% |
| `classification.multi_service.detected` | Multi-service detections per day | N/A (monitoring) |
| `classification.fallback.rate` | Fallback to manual (AI failed) | > 5% |
| `classification.time.p95` | 95th percentile classification time | > 500ms |

### Logging

```php
// All classification actions logged to activity_log
Log::channel('classification')->info('Classification completed', [
    'bill_item_id' => $billItem->id,
    'source' => 'ai',
    'confidence' => 92,
    'suggested_type_id' => 5,
    'user_id' => null,  // AI action
]);

// Override logging with before/after
Log::channel('classification')->info('Classification overridden', [
    'bill_item_id' => $billItem->id,
    'from_type_id' => 5,
    'to_type_id' => 8,
    'user_id' => $user->id,
    'reason' => 'user_selection',
]);
```

---

## Rollback Plan

### If Issues Found

1. **Disable feature flag**: Set `FEATURE_AI_INVOICE_CLASSIFICATION=false`
2. **No data migration needed**: ai_extraction JSON is additive
3. **UI falls back**: Bill Edit page shows existing picker if flag off
4. **Manual classification**: Users can classify without AI suggestion

### Data Recovery

- AI classification data stored in `ai_extraction.classification` (JSON)
- Original extraction data preserved in `ai_extraction` root
- Audit trail in `activity_log` table
- No destructive changes to existing data

---

## Dependencies

| Dependency | Status | Owner | Notes |
|------------|--------|-------|-------|
| Classification rubric (15 Tier 2 categories) | Pending | Dave & Erin | Needed Week 1 |
| Supplier verified services (90% target) | In Progress | Erin | Casual team calling suppliers |
| Historical cleaned data (Nov 1 - Dec 13) | Available | Data team | For pattern matching |
| Off-platform AI classification API | External | External | PHP failsafe as backup |

---

## Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| AI accuracy | 80% | Suggestions confirmed / total suggestions |
| Classification time | 45 seconds | Time from page load to confirm (avg) |
| AI acceptance rate | 70% | Confirmed without override |
| Multi-service detection | 90% | Detected / actual multi-service (QA audit) |
| Travel misclassification | -80% | Compared to Nov baseline |
| Unplanned service usage | +50% | Compared to Nov baseline |
| Supplier coverage | 90% | Verified / total suppliers |

---

## Approval

- [ ] Tech Lead (Khoa)
- [ ] Product Manager (Will)
- [ ] QA Lead (Zoe)
