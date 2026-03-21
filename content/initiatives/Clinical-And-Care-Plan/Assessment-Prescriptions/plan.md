---
title: "Plan"
---


**Branch**: `feat/TP-1904-ASS1-assessment-prescriptions` | **Date**: 2025-12-01 | **Spec**: [spec.md](./spec.md)
**Epic**: TP-1904 | **Initiative**: TP-1859 Clinical & Care Plan
**Input**: Feature specification from `spec.md` (9 user stories, 63 functional requirements)

## Summary

ASS1 creates a structured workflow for assessment requests, document upload, AI-powered ATHM extraction, assessor confirmation, and Care Partner acceptance with Service Plan integration. The system reduces manual classification effort through AI-assisted Tier-5 mapping while maintaining mandatory human-in-the-loop validation. Core value: transform unstructured assessment documents into structured, budget-ready recommendations with full audit trails.

**Primary Technical Approach**: Laravel backend with event-sourced state management, Vue 3 + Inertia.js frontend, AI service integration for document extraction, and MySQL storage with comprehensive audit logging.

## Technical Context

**Language/Version**: PHP 8.4, JavaScript ES2023
**Primary Dependencies**: Laravel 12, Vue 3 (Composition API), Inertia.js v2, TypeScript
**Storage**: MySQL (primary data), Laravel filesystem (document storage), event sourcing (state changes)
**Testing**: Pest v3 (PHP), Vitest (JavaScript), Laravel Dusk v8 (E2E)
**Target Platform**: Web application (responsive design for desktop/tablet)
**Project Type**: Web (Laravel backend + Vue frontend)
**Performance Goals**:
  - Document upload: <30s for 10MB PDF
  - AI extraction: <60s per document
  - Recommendation list: <500ms page load
  - Audit log export: <30s for 1000 entries
**Constraints**:
  - 100% recommendations must be confirmed before submission (validation gating)
  - Immutable audit trail (no edits/deletes)
  - Bidirectional links must survive Service Plan item edits/deletes
  - Graceful degradation if Tier-5 dataset unavailable
**Scale/Scope**:
  - 200+ active packages simultaneously
  - 50-100 assessments/week at launch
  - 5-15 recommendations per assessment (average)
  - 3-year audit retention minimum

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**Laravel Boost Guidelines Compliance**:

✅ **Core Conventions**:
- Follow existing Laravel application structure (Models, Controllers, Requests, Resources)
- Use descriptive names (e.g., `AssessmentRequest`, `RecommendationConfirmationService`)
- Check existing components before creating new ones (Service Plan, Package models)
- Stick to existing directory structure (no new base folders)

✅ **Frontend Bundling**:
- Vue components require `npm run build` or `npm run dev` for changes to reflect

✅ **Testing**:
- Pest for unit/feature tests (mandatory for state transitions, business logic)
- Vitest for Vue component tests
- Laravel Dusk for E2E workflows (Assessment creation → Upload → Confirmation → Acceptance)

✅ **Laravel Ecosystem Patterns**:
- Use Inertia.js v2 for seamless SPA routing
- Laravel Fortify for authentication (assessor secure link flow)
- Laravel Sanctum for API authentication
- Laravel Horizon for queue monitoring (AI extraction jobs)
- Laravel Scout for Tier-5 search if needed

**Critical Constraints**:
- ❌ Do not change dependencies without approval
- ✅ Use existing Package, Service Plan, Supplier models where possible
- ✅ Reuse authentication infrastructure for assessor secure links
- ✅ Follow existing audit logging patterns if established

## Project Structure

### Documentation (this feature)

```text
.claude/INITIATIVES/TP-1859-Clinical-And-Care-Plan/TP-1904-ASS1-Assessment-Prescriptions/
├── plan.md              # This file
├── spec.md              # User requirements (source of truth)
├── meta.yaml            # Epic metadata
├── ASS1-IDEA-BRIEF.md   # Original idea brief
├── ASS1-PRD.md          # Product requirements document
├── ASS1-RACI.md         # Team roles & responsibilities
└── USER-STORIES/
    ├── user-stories.csv      # Jira import source
    └── jira-mapping.json     # Jira key mappings
```

### Source Code (repository root)

```text
app/
├── Models/
│   ├── Assessment/
│   │   ├── AssessmentRequest.php           # Core entity: CP's assessment request
│   │   ├── Assessment.php                  # Individual assessor's work (one per assessor)
│   │   ├── Recommendation.php              # AI extraction + confirmation output
│   │   ├── InclusionSeed.php               # Backend-only acceptance artifact
│   │   └── AssessmentDocument.php          # Uploaded file metadata
│   ├── Tier/
│   │   ├── TierClassification.php          # Tier-3/4/5 hierarchy
│   │   └── TierDatasetVersion.php          # Versioned canonical dataset
│   └── Audit/
│       └── AssessmentAuditLog.php          # Immutable state changes
│
├── Http/
│   ├── Controllers/
│   │   ├── AssessmentRequestController.php # CRUD for requests
│   │   ├── AssessmentDocumentController.php # Upload handling
│   │   ├── RecommendationController.php    # Review/edit/confirm
│   │   └── RecommendationAcceptanceController.php # CP acceptance
│   ├── Requests/
│   │   ├── CreateAssessmentRequest.php
│   │   ├── UploadAssessmentDocumentRequest.php
│   │   ├── ConfirmRecommendationRequest.php
│   │   └── AcceptRecommendationRequest.php
│   └── Resources/
│       ├── AssessmentRequestResource.php
│       ├── RecommendationResource.php
│       └── AssessmentAuditLogResource.php
│
├── Services/
│   ├── Assessment/
│   │   ├── AssessmentRequestService.php    # Business logic for requests
│   │   ├── SecureLinkGenerator.php         # Secure assessor links
│   │   └── NotificationService.php         # CP/Assessor notifications
│   ├── AI/
│   │   ├── DocumentExtractionService.php   # AI extraction orchestration
│   │   ├── TierClassificationService.php   # Tier-5 suggestion logic
│   │   └── PathwayClassificationService.php # Low Risk/Advice/Prescribed
│   ├── Recommendation/
│   │   ├── RecommendationConfirmationService.php # Assessor confirmation
│   │   ├── RecommendationSubmissionService.php   # Validation gating
│   │   └── RecommendationAcceptanceService.php   # CP acceptance + Inclusion Seed
│   └── Audit/
│       ├── AssessmentAuditService.php      # Log all state changes
│       └── AuditExportService.php          # CSV/JSON export
│
├── Jobs/
│   ├── ExtractDocumentContent.php          # Queued AI extraction
│   ├── ClassifyTierRecommendations.php     # Queued Tier-5 suggestion
│   └── NotifyAssessorOfRequest.php         # Email notification
│
├── Events/
│   ├── AssessmentRequestCreated.php
│   ├── DocumentUploaded.php
│   ├── RecommendationConfirmed.php
│   ├── RecommendationsSubmitted.php
│   └── RecommendationAccepted.php
│
└── Listeners/
    ├── CreateAuditLogEntry.php             # Auto-log all events
    ├── TriggerAIExtraction.php             # On DocumentUploaded
    └── CreateInclusionSeed.php             # On RecommendationAccepted

resources/
├── js/
│   ├── Pages/
│   │   └── Assessment/
│   │       ├── Create.vue                  # US1: CP creates request
│   │       ├── DocumentUpload.vue          # US2: Assessor uploads
│   │       ├── RecommendationReview.vue    # US4: Assessor confirms
│   │       ├── RecommendationList.vue      # US5: CP reviews/accepts
│   │       └── ServicePlanIntegration.vue  # US6: Add to budget
│   ├── Components/
│   │   └── Assessment/
│   │       ├── AssessmentStatusBadge.vue   # Status tracking
│   │       ├── TierSearchDropdown.vue      # Tier-3/4/5 search UI
│   │       ├── ConfidenceScoreIndicator.vue # Visual confidence scores
│   │       ├── RecommendationCard.vue      # Individual recommendation
│   │       └── PathwayBadge.vue            # Low Risk/Advice/Prescribed
│   └── Composables/
│       ├── useAssessmentRequest.ts         # Assessment CRUD logic
│       ├── useRecommendations.ts           # Recommendation state
│       └── useTierSearch.ts                # Tier classification search
│
└── views/
    └── emails/
        ├── assessor-invitation.blade.php   # Secure link email
        └── recommendations-submitted.blade.php # CP notification

database/
├── migrations/
│   ├── 2025_12_01_100000_create_assessment_requests_table.php
│   ├── 2025_12_01_100001_create_assessments_table.php
│   ├── 2025_12_01_100002_create_recommendations_table.php
│   ├── 2025_12_01_100003_create_inclusion_seeds_table.php
│   ├── 2025_12_01_100004_create_assessment_documents_table.php
│   ├── 2025_12_01_100005_create_tier_classifications_table.php
│   ├── 2025_12_01_100006_create_tier_dataset_versions_table.php
│   ├── 2025_12_01_100007_create_assessment_audit_logs_table.php
│   └── 2025_12_01_100008_add_tier_fields_to_service_plan_items_table.php
│
├── factories/
│   ├── AssessmentRequestFactory.php
│   ├── AssessmentFactory.php
│   ├── RecommendationFactory.php
│   └── AssessmentDocumentFactory.php
│
└── seeders/
    └── TierClassificationSeeder.php        # Initial Tier-3/4/5 dataset

tests/
├── Feature/
│   ├── Assessment/
│   │   ├── CreateAssessmentRequestTest.php
│   │   ├── UploadAssessmentDocumentTest.php
│   │   ├── ConfirmRecommendationTest.php
│   │   └── AcceptRecommendationTest.php
│   ├── AI/
│   │   ├── DocumentExtractionTest.php
│   │   └── TierClassificationTest.php
│   ├── Audit/
│   │   ├── AuditLoggingTest.php
│   │   └── AuditExportTest.php
│   └── ServicePlan/
│       └── AddRecommendationToServicePlanTest.php
│
├── Unit/
│   ├── Services/
│   │   ├── SecureLinkGeneratorTest.php
│   │   ├── TierClassificationServiceTest.php
│   │   └── RecommendationSubmissionServiceTest.php
│   └── Models/
│       ├── AssessmentRequestTest.php
│       └── RecommendationTest.php
│
└── Browser/
    └── AssessmentWorkflowTest.php          # Dusk E2E test (US1→US6)

routes/
└── web.php                                 # Inertia routes for SPA
```

**Structure Decision**: Web application structure chosen (backend/ + frontend/ logical separation within Laravel). Models organized by domain (Assessment, Tier, Audit) to improve maintainability. Services follow single-responsibility principle (one service per business capability). Vue components structured by feature (Assessment/) with reusable subcomponents.

## Design Decisions

### 1. Data Model Architecture

**Entity Relationships**:

```text
Package (existing)
    ↓ 1:N
AssessmentRequest (package_id, type, supplier_id?, status, secure_token)
    ↓ 1:N
Assessment (assessment_request_id, assessor_id, status, secure_token)
    ↓ 1:N
AssessmentDocument (assessment_id, file_path, type, uploader_id, metadata)
    ↓ triggers
Recommendation (assessment_id, tier_code, product_name, quantity, cost,
                confidence_score, status, pathway, confirmed_by, confirmed_at)
    ↓ on acceptance (Advice/Prescribed only)
InclusionSeed (recommendation_id, raw_data, pathway)
    ↓ manual CP action
ServicePlanItem (existing, add: assessment_id?, recommendation_id?, tier_code?)
```

**Architecture Notes**:
- One AssessmentRequest can spawn multiple Assessment objects (one per assessor/type)
- Each Assessment is worked on by a single assessor (no concurrent editing within an Assessment)
- CP sees aggregated view of all Assessments and their Recommendations
- If multiple assessors recommend the same product, CP manually reconciles using common sense

**Key Design Choices**:

1. **AssessmentRequest.status** - Enum: `pending_upload`, `in_review`, `submitted`, `accepted`
   - Drives UI state and workflow gating
   - Indexed for dashboard queries

2. **Recommendation.pathway** - Enum: `low_risk`, `advice`, `prescribed`
   - Determines Inclusion Seed creation logic
   - Immutable after confirmation

3. **Recommendation.confidence_score** - Float 0.0-1.0
   - Visual indicator for assessor review priority
   - Logged in audit trail for AI performance tracking

4. **InclusionSeed** - Backend-only (no UI)
   - Created silently on CP acceptance (FR-044)
   - Links: assessment_id, recommendation_id, tier_code
   - Stores raw_data for future TP-2315 (Inclusion/Integration workflow)

5. **ServicePlanItem extensions** - Add optional fields:
   - `assessment_id` (nullable foreign key)
   - `recommendation_id` (nullable foreign key)
   - `tier_code` (nullable string, stores Tier-5 or Tier-3)
   - Maintains bidirectional links (FR-041)

6. **Audit Strategy** - Polymorphic audit log table:
   - `auditable_type` (AssessmentRequest, Recommendation, etc.)
   - `auditable_id`
   - `action` (created, updated, confirmed, submitted, accepted)
   - `before_state`, `after_state` (JSON)
   - `user_id`, `ip_address`, `user_agent`
   - Immutable (no updates/deletes)

### 2. API Contracts

**RESTful Endpoints**:

```php
// US1: CP Creates Assessment Request
POST   /api/assessments
Request: { package_id, type, supplier_id? }
Response: { id, secure_link, status }

// US2: Assessor Uploads Documents
POST   /api/assessments/{id}/documents
Request: FormData (file, type?)
Response: { document_id, metadata, extraction_job_id }

// US3: AI Extraction (internal, triggered by job)
// No direct API - queued job processes documents

// US4: Assessor Reviews/Edits Recommendations
GET    /api/assessments/{id}/recommendations
Response: [{ id, product_name, tier_code, confidence_score, status }]

PATCH  /api/recommendations/{id}
Request: { tier_code?, product_name?, quantity?, cost? }
Response: { id, updated_fields, audit_log_id }

POST   /api/recommendations/{id}/confirm
Request: {}
Response: { id, confirmed_at, confirmed_by }

POST   /api/assessments/{id}/submit
Request: {}
Response: { status, submitted_at, validation_errors? }

// US5: CP Accepts Recommendations
POST   /api/recommendations/{id}/accept
Request: {}
Response: { id, accepted_at, inclusion_seed_id? }

// US6: Add to Service Plan
POST   /api/service-plans/{id}/items/from-recommendation
Request: { recommendation_id, description, quantity, cost }
Response: { service_plan_item_id, tier_code, assessment_id }

// US8: Audit Logs
GET    /api/audit-logs?package_id={id}&user_id={id}&action={type}
Response: [{ id, action, before, after, timestamp }]

POST   /api/audit-logs/export
Request: { format: 'csv'|'json', filters }
Response: File download
```

**Validation Rules**:

- `CreateAssessmentRequest`: package_id required, type in enum, supplier_id required if type=OT
- `UploadAssessmentDocumentRequest`: file required, max 10MB, mimes: pdf, jpg, png
- `ConfirmRecommendationRequest`: tier_code required, exists in tier_classifications
- `AcceptRecommendationRequest`: recommendation must have status=submitted

### 3. UI Components

**Vue 3 Composition API + TypeScript**:

1. **AssessmentCreate.vue** (US1)
   - Package selector (autocomplete)
   - Assessment type dropdown (OT, Physio, Nurse, Contractor)
   - Supplier selector (filtered by type, visible only for OT)
   - Submit → generates secure link + notification

2. **DocumentUpload.vue** (US2)
   - Drag-and-drop file upload (PDF/images)
   - Multi-file support
   - Progress indicators
   - Auto-classify document type with manual override
   - Real-time AI extraction job status

3. **RecommendationReview.vue** (US4)
   - Table view: product_name, tier_code, confidence_score, pathway
   - Inline edit: TierSearchDropdown for Tier-3/4/5 hierarchy search
   - Visual confidence indicators (green >0.8, yellow 0.5-0.8, red <0.5)
   - Confirmation checkboxes (required for all before submit)
   - Validation gating: Submit button disabled until all confirmed
   - Audit trail link per recommendation

4. **RecommendationList.vue** (US5)
   - Read-only view of submitted recommendations
   - Evidence links (click to view source documents)
   - Per-item "Accept" button
   - Status badges (Submitted, Accepted)
   - Filter by pathway (Low Risk, Advice, Prescribed)

5. **ServicePlanIntegration.vue** (US6)
   - "Add Service" action on accepted recommendations
   - Prefills tier_code (terminal tier only)
   - Standard Service Plan form for description, quantity, cost
   - Bidirectional link indicator (show source assessment/recommendation)

**Reusable Components**:

- `TierSearchDropdown.vue` - Autocomplete for Tier-3 → Tier-4 → Tier-5 hierarchy
- `ConfidenceScoreIndicator.vue` - Color-coded confidence visualization
- `PathwayBadge.vue` - Visual pathway indicator (Low Risk, Advice, Prescribed)
- `AssessmentStatusBadge.vue` - Status tracking (Pending, In Review, Submitted, Accepted)

### 4. AI Integration Strategy

**Document Extraction Service**:

```php
// Queued job triggered on document upload
class ExtractDocumentContent implements ShouldQueue
{
    public function handle(DocumentExtractionService $service)
    {
        // 1. Send PDF/image to AI service (external API)
        $rawExtraction = $service->extract($this->document);

        // 2. Parse ATHM items from response
        $items = $service->parseAthm($rawExtraction);

        // 3. Create draft recommendations
        foreach ($items as $item) {
            Recommendation::create([
                'assessment_id' => $this->document->assessment_id,
                'product_name' => $item['name'],
                'quantity' => $item['quantity'],
                'cost' => $item['cost'],
                'raw_extraction' => $item['raw'],
                'status' => 'draft',
            ]);
        }

        // 4. Trigger Tier classification job
        ClassifyTierRecommendations::dispatch($this->document->assessment_id);
    }
}
```

**Tier Classification Service**:

```php
class TierClassificationService
{
    public function classify(Recommendation $rec): array
    {
        // 1. Check if Tier-5 dataset available
        $dataset = TierDatasetVersion::latest();
        if (!$dataset) {
            return [
                'tier_code' => null,
                'confidence_score' => 0.0,
                'pathway' => 'manual_entry_required',
                'warning' => 'Tier-5 dataset unavailable',
            ];
        }

        // 2. Call AI service for Tier-5 suggestion
        $suggestion = $this->aiService->suggestTier(
            $rec->product_name,
            $rec->raw_extraction,
            $dataset->version
        );

        // 3. Determine pathway (Low Risk, Advice, Prescribed)
        $pathway = $this->classifyPathway($suggestion['tier_code']);

        return [
            'tier_code' => $suggestion['tier_code'],
            'confidence_score' => $suggestion['confidence'],
            'pathway' => $pathway,
            'dataset_version' => $dataset->version,
        ];
    }

    private function classifyPathway(string $tierCode): string
    {
        // Business rules for pathway classification
        // (to be defined with product team)
        return match (true) {
            $this->isLowRisk($tierCode) => 'low_risk',
            $this->requiresAdvice($tierCode) => 'advice',
            default => 'prescribed',
        };
    }
}
```

**Graceful Degradation** (FR-021):
- If AI service unavailable: allow manual recommendation creation
- If Tier-5 dataset unavailable: show warning, allow manual tier entry
- All failures logged in audit trail

### 5. Security & Authentication

**Assessor Secure Link Flow**:

1. CP creates AssessmentRequest → generates unique `secure_token` (UUID)
2. Secure link: `https://portal.test/assessments/{id}/upload?token={secure_token}`
3. Assessor clicks link → redirects to login if not authenticated
4. After login, validates token matches AssessmentRequest
5. If valid, grants access to DocumentUpload UI
6. Token expires after first use or 7 days (configurable)

**Authorization Rules**:

- **CP**: Create requests, view all assessments for their packages, accept recommendations
- **Assessor**: Upload documents (via secure link only), edit/confirm recommendations
- **Billing Processor**: Read-only access to tier-coded Service Plan items and invoices
- **Compliance**: Export audit logs (via role-based permission)

**Laravel Policies**:

```php
class AssessmentRequestPolicy
{
    public function create(User $user): bool
    {
        return $user->hasRole('care_partner');
    }

    public function upload(User $user, AssessmentRequest $request): bool
    {
        return $user->hasRole('assessor')
            && $request->secure_token === request('token');
    }

    public function accept(User $user, Recommendation $rec): bool
    {
        return $user->hasRole('care_partner')
            && $rec->assessment->package->care_partner_id === $user->id;
    }
}
```

## Implementation Phases

### Phase 0: Foundation (Week 1)

**Goal**: Database schema, core models, basic CRUD operations

**Tasks**:
1. Create migrations for all tables (AssessmentRequest, Assessment, Recommendation, InclusionSeed, AssessmentDocument, TierClassification, AuditLog)
2. Generate models with relationships
3. Create factories and seeders
4. Add tier_code fields to existing ServicePlanItem migration
5. Set up base routes and controllers (empty implementations)

**Deliverables**:
- ✅ All migrations run successfully
- ✅ Models have proper relationships (AssessmentRequest hasMany Assessments, Assessment hasMany Recommendations)
- ✅ Factories produce valid test data
- ✅ Pest unit tests for model relationships

**Success Criteria**:
- `php artisan migrate:fresh --seed` runs without errors
- Factories can create 100+ records in <5 seconds

---

### Phase 1: US1 - Assessment Request Creation (Week 2, Priority: P1)

**Goal**: CP can create Assessment Requests with supplier selection and secure link generation

**Frontend**:
- `AssessmentCreate.vue` - Form with package selector, assessment type, supplier dropdown
- `useAssessmentRequest.ts` - Composable for CRUD operations
- `AssessmentStatusBadge.vue` - Reusable status component

**Backend**:
- `CreateAssessmentRequest` - Validation (FR-001 to FR-006)
- `AssessmentRequestController@store` - Create request + generate secure token
- `SecureLinkGenerator` - UUID generation + expiration logic
- `NotificationService` - Email to supplier with secure link
- `AssessmentRequestCreated` event + audit listener

**Tests**:
- Feature: Create request with valid data → 201 response
- Feature: Create OT request without supplier → 422 validation error
- Feature: Secure link generation → unique token persisted
- Feature: Notification sent to supplier email
- Unit: SecureLinkGenerator produces valid UUID
- Browser: CP navigates to package → creates request → sees confirmation

**Deliverables**:
- ✅ CP can create requests via UI
- ✅ Supplier receives email with secure link
- ✅ Dashboard shows request status
- ✅ Audit log records creation event

**Success Criteria** (from spec.md SC-001):
- CP can create request in <2 minutes (90% of users)

---

### Phase 2: US2 - Document Upload (Week 3, Priority: P1)

**Goal**: Assessor authenticates via secure link and uploads documents

**Frontend**:
- `DocumentUpload.vue` - Drag-and-drop multi-file upload
- File validation (10MB max, PDF/jpg/png only)
- Progress indicators
- Document type selector (report/quote/amendment)

**Backend**:
- `UploadAssessmentDocumentRequest` - File validation (FR-009 to FR-014)
- `AssessmentDocumentController@store` - Handle upload + storage
- `DocumentUploaded` event → triggers AI extraction job
- Secure link validation middleware
- Auto-classify document type (simple heuristic or AI call)

**Tests**:
- Feature: Upload PDF via secure link → 201 response
- Feature: Upload without valid token → 403 forbidden
- Feature: Upload 11MB file → 422 validation error
- Feature: Multi-file upload → all files persisted
- Feature: Document type auto-classification
- Browser: Assessor clicks secure link → logs in → uploads document → sees success

**Deliverables**:
- ✅ Assessor can upload files via secure link
- ✅ Files stored in Laravel filesystem
- ✅ Metadata captured (uploader, timestamp, type)
- ✅ Audit log records upload event

**Success Criteria**:
- Upload <30s for 10MB PDF (performance goal)

---

### Phase 3: US3 - AI Extraction & Classification (Week 4, Priority: P1)

**Goal**: System extracts ATHM items and suggests Tier-5 codes

**Backend**:
- `ExtractDocumentContent` job - Queued AI extraction (FR-015 to FR-021)
- `DocumentExtractionService` - External AI API integration
- `ClassifyTierRecommendations` job - Tier-5 suggestion
- `TierClassificationService` - AI classification logic + pathway assignment
- `PathwayClassificationService` - Low Risk/Advice/Prescribed rules
- TierDatasetVersion seeder - Initial Tier-3/4/5 hierarchy
- Graceful degradation logic (dataset unavailable warning)

**Tests**:
- Feature: DocumentUploaded event → ExtractDocumentContent job dispatched
- Feature: AI extraction creates draft recommendations
- Feature: Tier classification updates recommendations with tier_code + confidence_score
- Feature: Pathway assigned based on tier_code
- Feature: Tier dataset unavailable → manual entry allowed with warning
- Unit: TierClassificationService returns valid suggestions
- Unit: PathwayClassificationService assigns correct pathway

**Deliverables**:
- ✅ AI extraction runs automatically after upload
- ✅ Recommendations created with tier suggestions
- ✅ Confidence scores displayed in UI
- ✅ Pathway classification complete
- ✅ Raw extraction stored in audit trail

**Success Criteria** (from spec.md SC-002):
- AI extraction ≥80% Tier-5 accuracy at launch

---

### Phase 4: US4 - Assessor Review & Confirmation (Week 5, Priority: P1)

**Goal**: Assessor reviews AI extractions, edits Tier codes, confirms all recommendations

**Frontend**:
- `RecommendationReview.vue` - Table view with inline editing
- `TierSearchDropdown.vue` - Autocomplete Tier-3/4/5 hierarchy search
- `ConfidenceScoreIndicator.vue` - Visual confidence display
- `PathwayBadge.vue` - Pathway indicator
- Confirmation checkboxes (all required before submit)
- Submit button with validation gating

**Backend**:
- `RecommendationController@update` - Edit tier_code (FR-022 to FR-026)
- `RecommendationController@confirm` - Mark recommendation confirmed
- `RecommendationSubmissionService` - Validation gating (FR-027)
- `AssessmentRequestController@submit` - Submit all recommendations
- `RecommendationConfirmed` event + audit listener
- `RecommendationsSubmitted` event + CP notification

**Tests**:
- Feature: Edit tier_code → updates recommendation + audit log
- Feature: Confirm recommendation → confirmed_at timestamp set
- Feature: Submit with unconfirmed items → 422 validation error
- Feature: Submit all confirmed → status changes to 'submitted'
- Feature: Tier search returns filtered hierarchy
- Browser: Assessor edits tier → confirms → submits → CP notified

**Deliverables**:
- ✅ Assessor can edit and confirm recommendations
- ✅ Validation prevents submission without 100% confirmation
- ✅ CP receives notification on submission
- ✅ Submissions are immutable

**Success Criteria** (from spec.md SC-004, SC-005):
- 100% recommendations confirmed before submission
- Review/confirm in <5 minutes per assessment (average)

---

### Phase 5: US5 - CP Review & Acceptance (Week 6, Priority: P2)

**Goal**: CP reviews submitted recommendations and accepts them (triggers Inclusion Seed creation)

**Frontend**:
- `RecommendationList.vue` - Read-only view with Accept buttons
- Evidence links (click to view source documents)
- Status badges (Submitted, Accepted)
- Pathway filter

**Backend**:
- `RecommendationAcceptanceController@accept` - CP acceptance (FR-031 to FR-037)
- `RecommendationAcceptanceService` - Business logic + Inclusion Seed creation
- `InclusionSeed` model + migration
- `RecommendationAccepted` event + CreateInclusionSeed listener
- Pathway-based Inclusion Seed logic (Advice/Prescribed only, not Low Risk)

**Tests**:
- Feature: Accept recommendation with Advice pathway → Inclusion Seed created
- Feature: Accept recommendation with Prescribed pathway → Inclusion Seed created
- Feature: Accept recommendation with Low Risk pathway → NO Inclusion Seed
- Feature: Accepted recommendation remains visible with status badge
- Feature: Ignored recommendation stays in Submitted state
- Browser: CP reviews submitted → accepts → Inclusion Seed created silently

**Deliverables**:
- ✅ CP can accept recommendations individually
- ✅ Inclusion Seeds created for Advice/Prescribed pathways
- ✅ Recommendations remain visible after acceptance
- ✅ Audit log records acceptance events

**Success Criteria** (from spec.md SC-007):
- 100% Inclusion Seeds created for accepted Advice/Prescribed recommendations

---

### Phase 6: US6 - Service Plan Integration (Week 7, Priority: P2)

**Goal**: CP adds accepted recommendations to Service Plan with tier_code prefilled

**Frontend**:
- `ServicePlanIntegration.vue` - "Add Service" action
- Prefill tier_code (terminal tier only)
- Standard Service Plan form (description, quantity, cost)
- Bidirectional link indicator

**Backend**:
- Add assessment_id, recommendation_id, tier_code to ServicePlanItem migration
- `ServicePlanItemController@createFromRecommendation` - New endpoint
- Bidirectional link maintenance (FR-041 to FR-043)
- Service Plan item edits/deletes do NOT cascade to recommendations

**Tests**:
- Feature: Add product recommendation → Tier-5 prefilled in Service Plan item
- Feature: Add service recommendation → Tier-3 prefilled
- Feature: Service Plan item created → bidirectional links persisted
- Feature: Edit Service Plan item → source recommendation unchanged
- Feature: Delete Service Plan item → source recommendation unchanged
- Browser: CP accepts → adds to Service Plan → tier_code displayed

**Deliverables**:
- ✅ CP can add recommendations to Service Plan
- ✅ Terminal tier value prefilled
- ✅ Bidirectional links maintained
- ✅ Source recommendations preserved

**Success Criteria** (from spec.md SC-008):
- 100% bidirectional links maintained for Service Plan items from recommendations

---

### Phase 7: US7 - Billing Visibility (Week 8, Priority: P3)

**Goal**: Billing processors see Tier-5 context on Service Plan items and invoices

**Frontend**:
- Update existing Service Plan UI to display tier_code
- Update existing Invoice UI to display tier-coded line items
- No new screens (context only)

**Backend**:
- Invoice AI classification service (integrate with existing Invoice AI)
- Read-only access for billing processors
- No auto-gating or auto-release logic (FR-053)

**Tests**:
- Feature: Service Plan item from recommendation → tier_code visible
- Feature: Invoice AI classifies invoice → tier_code stored
- Feature: Billing processor views Service Plan → sees tier context
- Browser: Billing processor views invoice → tier-coded items displayed

**Deliverables**:
- ✅ Tier-5/Tier-3 values visible on Service Plan items
- ✅ Invoice line items classified with tier codes
- ✅ Read-only access for billing processors

**Success Criteria** (from spec.md SC-006):
- Billing processors report 40% reduction in manual interpretation effort (survey-based)

---

### Phase 8: US8 - Audit Logging (Week 9, Priority: P3)

**Goal**: Comprehensive immutable audit trail for all state changes

**Backend**:
- `AssessmentAuditService` - Log all actions (FR-059 to FR-063)
- `AuditExportService` - CSV/JSON export
- Polymorphic audit log queries
- Immutability enforcement (no updates/deletes)

**Frontend**:
- Audit log viewer (filter by package, user, action, date range)
- Export button (CSV/JSON)
- Before/after state diff view

**Tests**:
- Feature: All actions create audit log entries
- Feature: Audit log modification blocked
- Feature: Export 1000 entries → completes in <30s
- Feature: Filter by package → correct entries returned
- Browser: Compliance user exports audit logs → receives file download

**Deliverables**:
- ✅ All actions logged (uploads, edits, confirmations, submissions, acceptance)
- ✅ Immutable audit trail
- ✅ Export functionality (CSV/JSON)
- ✅ Filtering and search

**Success Criteria** (from spec.md SC-009, SC-010):
- Zero data loss incidents (99.99% uptime)
- Audit log export <30s for 1000 entries

---

### Phase 9: US9 - Tier-5 Dataset Management (Week 10, Priority: P3)

**Goal**: Versioned Tier-5 canonical dataset with graceful degradation

**Backend**:
- `TierDatasetVersion` model + migration
- Dataset import service (CSV/JSON)
- Version tracking (historical classifications unchanged)
- Graceful degradation logic (manual entry with warning)

**Frontend**:
- Dataset version indicator in TierSearchDropdown
- Warning message when dataset unavailable
- Historical classification display (which version used)

**Tests**:
- Feature: Import new dataset version → preserves historical classifications
- Feature: Dataset unavailable → manual entry allowed with warning
- Feature: Multiple versions exist → correct version displayed
- Unit: TierDatasetVersion tracks version history

**Deliverables**:
- ✅ Versioned Tier-5 dataset
- ✅ Historical classifications preserved
- ✅ Graceful degradation
- ✅ Dataset update workflow

**Success Criteria** (from spec.md FR-056, FR-058):
- Historical classifications remain valid after dataset updates
- Dataset version tracked for each classification

---

## Risk Assessment

### Technical Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| **AI extraction accuracy <80%** | High | High | - Pilot with 50 real assessments before launch<br>- Manual override always available<br>- Improve prompts/training data iteratively |
| **Tier-5 dataset unavailable** | Medium | Medium | - Graceful degradation (manual entry)<br>- Warning messages<br>- Fallback to Tier-3 classification |
| **Performance: AI extraction >60s** | Medium | High | - Queue all AI jobs (Horizon)<br>- Batch processing for multiple documents<br>- Show progress indicators |
| **Multiple Assessments for same Request** | Medium | Low | - CP sees aggregated view of all Assessments<br>- Manual reconciliation UI for duplicate recommendations<br>- Audit trail tracks all acceptances |
| **Service Plan integration breaking changes** | Medium | Medium | - Add fields as nullable (backward compatible)<br>- Test extensively with existing Service Plan flows<br>- Feature flag for rollout |
| **Secure link expiration edge cases** | Low | Low | - Clear expiration messaging<br>- Allow CP to regenerate links<br>- Log all link access attempts |
| **File upload interruptions** | Medium | Low | - Client-side retry logic<br>- Chunked uploads for large files<br>- Progress persistence |

### Data Quality Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| **Unstructured documents (unreadable scans)** | High | Medium | - Allow manual recommendation creation<br>- Document quality validation<br>- Assessor feedback loop |
| **Ambiguous Tier-5 classifications** | High | Low | - Return multiple suggestions with confidence scores<br>- Assessor chooses final classification<br>- Audit trail for overrides |
| **Missing Tier-5 codes in dataset** | Medium | Medium | - Flag as "unmapped" requiring manual correction<br>- Regular dataset updates<br>- Assessor feedback to product team |
| **Service Plan item orphaned after recommendation deletion** | Low | Medium | - Do NOT allow recommendation deletion (immutable after submission)<br>- Bidirectional links survive edits/deletes |

### Integration Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| **External AI service downtime** | Medium | High | - Queue retries (3 attempts)<br>- Manual entry fallback<br>- Service status monitoring |
| **Notification delivery failures** | Low | Low | - Retry up to 3 times<br>- In-app notification backup<br>- Audit log tracks failures |
| **Service Plan breaking changes** | Low | High | - Add fields as nullable<br>- Extensive regression testing<br>- Coordinate with Service Plan team |

### Security Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| **Secure link token leakage** | Low | High | - Single-use tokens (expire after first access)<br>- 7-day expiration<br>- IP address validation (optional) |
| **Unauthorized access to recommendations** | Low | High | - Laravel policies enforce authorization<br>- Role-based access control<br>- Audit all access attempts |
| **PII in audit logs** | Medium | Medium | - Mask sensitive fields in before/after state<br>- Encrypt audit logs at rest<br>- Access logs restricted to compliance role |

### Operational Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| **Queue job failures** | Medium | Medium | - Horizon monitoring<br>- Failed job retry logic<br>- Alert on repeated failures |
| **Audit log storage growth** | High | Low | - Partition by quarter (3-year retention)<br>- Archive to cold storage<br>- Efficient indexing |
| **Tier dataset version conflicts** | Low | Medium | - Lock dataset during updates<br>- Version all classifications<br>- Rollback capability |

### Architecture Clarifications (Resolved 2025-12-01)

1. **Multiple Assessments per Request** - One Assessment Request can spawn multiple Assessment objects (one per assessor/type). Each Assessment is worked on by a single assessor (no concurrent editing within an Assessment). CP sees aggregated view of all Assessments and manually reconciles duplicate recommendations using common sense.

2. **Inclusion Seed creation failure** - Not a concern for ASS1. If creation fails, it will be logged in audit trail. No special retry logic or validation required.

3. **High-cost recommendation validation** - No automated threshold validation. If assessor wants to recommend a million-dollar wheelchair, it can come through. CP oversight is sufficient given resource constraints.

4. **AI extraction failure recovery** - Allow manual recommendation creation from scratch with warning message when AI extraction fails completely.

## Next Steps

1. **Tier-5 Dataset Acquisition** - Obtain canonical dataset for seeding
2. **AI Service Selection** - Choose/configure external AI extraction service
3. **Design Review** (After Phase 1) - Review UI mockups with design team
4. **Pilot Planning** (After Phase 4) - Identify 50 real assessments for accuracy testing
5. **Launch Checklist** (After Phase 9):
   - ✅ All 9 user stories tested E2E
   - ✅ AI accuracy ≥80% (SC-002)
   - ✅ Performance benchmarks met (SC-001, SC-005, SC-010)
   - ✅ Audit trail export validated (SC-009)
   - ✅ Service Plan integration tested with existing flows (SC-008)
   - ✅ Billing visibility confirmed by billing team (SC-006)

---

**Version**: 1.0.0 | **Author**: Claude Code (Discovery Agent) | **Last Updated**: 2025-12-01
