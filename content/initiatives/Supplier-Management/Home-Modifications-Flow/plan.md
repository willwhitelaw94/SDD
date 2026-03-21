---
title: "Plan"
---


**Branch**: `TP-3155-hmf-supplier-ecosystem`
**Date**: 2025-12-05
**Spec**: [spec.md](./spec.md)
**Epic**: TP-3155 | **Initiative**: TP-1857 Supplier Management

---

## Summary

Build the supplier ecosystem layer (UI shell + supplier management) for home modifications and product suppliers. HMF provides the supplier-facing and compliance-facing interfaces, while ASS2 owns the Inclusion business logic that powers these views.

**⚠️ IMPORTANT CONTEXT**:
- This epic is for **Support at Home (Australian Aged Care)** program, NOT NDIS
- "Tier-3 categories" refer to Support at Home service/product categories (7 categories from tiers.csv)
- Existing supplier infrastructure (`domain/Supplier/`) must be EXTENDED, not recreated

**What HMF Builds**:
1. **Supplier Onboarding**: Contractors (23+8 documents, credentials), Product Suppliers (Support at Home Tier-3 categories)
2. **Supplier Portal Tabs (UI Shell)**:
   - Pricing tab (fixed rates for non-HM services like home maintenance, repairs)
   - Documents & Agreements tab (assessment quote submissions)
   - Works tab (active home mod projects after quote selection)
3. **Compliance Dashboard**: Works tab UI for compliance team document approval
4. **Validation APIs**: Category verification, credential validation, multi-quote validation (for ASS2 to call)
5. **Data Structure Contracts**: Compliance criteria templates, payment milestones, document taxonomy (for ASS2 to consume)

**Critical Scope Boundary**:
- **HMF Builds**: The supplier UI shell, compliance dashboard UI, supplier onboarding, validation APIs
- **ASS2 Owns**: Inclusion lifecycle, quote selection workflow, criteria evaluation logic, payment gating, linking selected quote → work
- **The Workflow**: Inclusion (ASS2) → Assessment requests sent → Contractors submit quotes (Documents tab - HMF UI) → Care partner selects winning quote (ASS2 logic) → Becomes "Work" (Works tab - HMF UI, data from ASS2)

**Pricing Clarification**: Home Modifications work is ALWAYS quote-by-quote. Contractors CAN have fixed hourly rates for OTHER services (home maintenance, repairs).

**Technical Approach**: Laravel-based backend with Vue 3/Inertia.js frontend, extending existing supplier management infrastructure, integrating with ASS1 (Assessments) and ASS2 (Inclusions) systems.

---

## Technical Context

**Language/Version**: PHP 8.4.14, JavaScript (Vue 3)
**Framework**: Laravel 12, Inertia.js v2, Vue 3
**Database**: MySQL
**Primary Dependencies**:
- Laravel/Fortify (authentication)
- Laravel/Nova (admin interface)
- Laravel/Sanctum (API authentication)
- Inertia.js v2 (SSR)
- Vue 3 (frontend)
- Tailwind CSS v3 (styling)

**Storage**:
- Database: MySQL (supplier data, credentials, categories, documents metadata)
- File Storage: S3/blob storage (credential documents, quotes, compliance documents)

**Testing**:
- Backend: Pest v3 (feature and unit tests)
- Frontend: Pest + Vue Test Utils
- E2E: Laravel Dusk v8

**Target Platform**: Web application (desktop/tablet primary, mobile secondary)

**Performance Goals**:
- Dashboard loads <2s with 100 works
- Document upload <5s for 10MB files
- Search/filter results <500ms
- Real-time notifications <1s delay

**Constraints**:
- Must not duplicate ASS1/ASS2 logic (clear boundaries)
- State-specific credential requirements must be extensible
- Document approval audit trail must be immutable
- Tier-3 category validation must prevent billing errors

**Scale/Scope**:
- ~500 suppliers (50 contractors, 450 product suppliers)
- ~1000 works per year
- ~4 documents per work average
- ~10 concurrent compliance team users

---

## Constitution Check

*Based on Laravel/TC Portal standards (CLAUDE.md and Laravel Boost guidelines)*

**Laravel Conventions**:
- [x] Follow existing codebase structure (app/Models, app/Http/Controllers, resources/js/Pages)
- [x] Use Eloquent relationships with return type hints
- [x] Use Form Request classes for validation (not inline)
- [x] No `env()` calls outside config files
- [x] Use `php artisan make:` commands for file generation
- [x] Pest tests for all features

**Inertia/Vue Conventions**:
- [x] Single root element per Vue component
- [x] Use `router.visit()` or `<Link>` for navigation
- [x] Leverage Inertia v2 features (deferred props, prefetching, polling where appropriate)
- [x] Check existing components before creating new ones

**Code Quality**:
- [x] Run `vendor/bin/pint --dirty` before finalizing
- [x] Write tests before implementation (TDD)
- [x] Use descriptive names (e.g., `isVerifiedForCategory`, not `verify()`)
- [x] Technology-agnostic success criteria in spec

**Integration Boundaries**:
- [x] ASS2 owns Inclusion lifecycle (HMF defines criteria templates, ASS2 evaluates)
- [x] ASS1 owns Assessment creation (HMF defines contractor data formats)
- [x] HMF owns supplier types, onboarding, compliance UI
- [x] Clear API contracts between HMF ↔ ASS1 ↔ ASS2

**No violations identified** - Plan aligns with TC Portal conventions.

---

## Data Model

### New Models

**Supplier** (extends existing or new)
```php
class Supplier extends Model
{
    // Core fields
    protected $fillable = [
        'business_name',
        'abn',
        'contact_email',
        'contact_phone',
        'supplier_type', // enum: 'contractor', 'product_supplier'
    ];

    // Relationships
    public function categories(): BelongsToMany // Tier3Category
    public function serviceAreas(): BelongsToMany // State (for contractors)
    public function credentials(): HasMany // SupplierCredential
    public function capabilities(): BelongsToMany // ModificationType (for contractors)
    public function works(): HasMany // via Assessment (for dashboard)

    // Methods
    public function isVerifiedForCategory(string $tier3Code): bool
    public function hasCredentialForState(string $stateCode): bool
}
```

**Tier3Category**
```php
class Tier3Category extends Model
{
    protected $fillable = ['code', 'name', 'description'];

    // Canonical list:
    // - AT_CLINICAL (Assistive Tech Prescription & Clinical Support)
    // - MOBILITY (Mobility Products)
    // - SELF_CARE (Self-care Products)
    // - DOMESTIC_LIFE (Domestic Life Products)
    // - COMMS_INFO (Communication & Information Management)
    // - HOME_MODS (Home Modification Products)
    // - BODY_FUNCTIONS (Managing Body Functions)

    public function suppliers(): BelongsToMany
}
```

**SupplierCredential**
```php
class SupplierCredential extends Model
{
    protected $fillable = [
        'supplier_id',
        'state_code', // VIC, NSW, QLD, WA, SA, TAS, ACT, NT (nullable for non-state-specific docs)
        'document_type', // enum: see DOCUMENT_TYPES constant below
        'credential_number', // nullable for documents without numbers
        'expiry_date', // nullable, required for specific document types
        'document_path', // S3 path to uploaded file
        'verification_status', // 'pending', 'verified', 'expired', 'rejected'
        'verified_at',
        'verified_by',
        'rejection_reason', // nullable
    ];

    // Document Types (23 required + 8 state-specific = 31 total types)
    const DOCUMENT_TYPES = [
        // Required for all Home Modifications contractors (23):
        'builders_license',
        'builders_warranty_insurance', // REQUIRES expiry_date
        'building_contract',
        'building_permit',
        'workers_compensation', // REQUIRES expiry_date
        'worksafe', // REQUIRES expiry_date
        'certificate_of_currency',
        'bank_statement',
        'certificate_of_registration',
        'business_name_registration_certificate',
        'tax_certificate',
        'notice_of_assessment',
        'utility_bill',
        'professional_body_membership', // REQUIRES expiry_date

        // State-specific contract documents (8):
        'qbcc_contract_level_2', // QLD only
        'nsw_building_contract', // NSW only
        'vic_major_domestic_building_contract', // VIC only
        'act_residential_building_work_contract', // ACT only
        'sa_domestic_building_contract_indemnity', // SA only
        'tas_residential_building_work_contract_insurance', // TAS only
        'wa_home_building_work_contract_indemnity', // WA only, REQUIRES expiry_date
        'nt_worksafe_building_contract_permit', // NT only, REQUIRES expiry_date
    ];

    // Document types requiring expiry date (6 total)
    const EXPIRY_REQUIRED_TYPES = [
        'builders_warranty_insurance',
        'workers_compensation',
        'worksafe',
        'professional_body_membership',
        'wa_home_building_work_contract_indemnity',
        'nt_worksafe_building_contract_permit',
    ];

    // State-specific document mappings
    const STATE_REQUIRED_DOCUMENTS = [
        'QLD' => ['qbcc_contract_level_2'],
        'NSW' => ['nsw_building_contract'],
        'VIC' => ['vic_major_domestic_building_contract'],
        'ACT' => ['act_residential_building_work_contract'],
        'SA' => ['sa_domestic_building_contract_indemnity'],
        'TAS' => ['tas_residential_building_work_contract_insurance'],
        'WA' => ['wa_home_building_work_contract_indemnity'],
        'NT' => ['nt_worksafe_building_contract_permit'],
    ];

    // Builder registration thresholds by state (for disclaimer display)
    const REGISTRATION_REQUIREMENTS = [
        'VIC' => [
            'body' => 'Victorian Building Authority (VBA)',
            'threshold' => 'Domestic building work > $10,000 or any structural/building permit work',
        ],
        'NSW' => [
            'body' => 'NSW Fair Trading',
            'threshold' => 'Residential building work > $5,000 (license); > $20,000 (insurance)',
        ],
        'QLD' => [
            'body' => 'Queensland Building and Construction Commission (QBCC)',
            'threshold' => 'Building work > $3,300 or structural work of any value',
        ],
        'WA' => [
            'body' => 'Building Services Board / Building and Energy WA',
            'threshold' => 'Residential work > $20,000 or structural work',
        ],
        'SA' => [
            'body' => 'Consumer and Business Services (CBS)',
            'threshold' => 'Building work > $12,000 or requiring development approval',
        ],
        'TAS' => [
            'body' => 'Consumer, Building and Occupational Services (CBOS)',
            'threshold' => 'All licensed work (building, plumbing, electrical) regardless of value',
        ],
        'ACT' => [
            'body' => 'ACT Planning and Land Authority (Access Canberra)',
            'threshold' => 'Any building work requiring approval must be licensed',
        ],
        'NT' => [
            'body' => 'NT Building Practitioners Board',
            'threshold' => 'Residential work > $12,000 or any regulated work',
        ],
    ];

    protected $casts = [
        'expiry_date' => 'date',
        'verified_at' => 'datetime',
    ];

    // Relationships
    public function supplier(): BelongsTo
    public function verifier(): BelongsTo // User

    // Methods
    public function isExpired(): bool
    public function isValid(): bool
    public function requiresExpiryDate(): bool // Check if document_type in EXPIRY_REQUIRED_TYPES

    // Validation
    public static function getRequiredDocumentsForState(string $stateCode): array
    public static function getRegistrationRequirement(string $stateCode): ?array
}
```

**ModificationType**
```php
class ModificationType extends Model
{
    protected $fillable = ['code', 'name', 'description'];

    // Types: ramps, bathroom_mods, stair_lifts, accessibility_renos, kitchen_mods, smart_home, other

    public function contractors(): BelongsToMany // Supplier where type=contractor
}
```

**ComplianceCriteriaTemplate**
```php
class ComplianceCriteriaTemplate extends Model
{
    protected $fillable = [
        'name',
        'modification_type', // ramps, bathroom_mods, etc. (or null for general)
        'required_documents_config', // JSON: state-conditional logic
        'payment_milestones_config', // JSON: installment definitions
        'multi_quote_requirement', // int: number of independent quotes required (0 if N/A)
    ];

    protected $casts = [
        'required_documents_config' => 'array',
        'payment_milestones_config' => 'array',
    ];

    // Example required_documents_config:
    // [
    //   {
    //     "document_type": "quote",
    //     "required": true,
    //     "conditions": []
    //   },
    //   {
    //     "document_type": "building_permit",
    //     "required": true,
    //     "conditions": [
    //       {"field": "client_state", "operator": "in", "values": ["VIC", "NSW", "QLD"]}
    //     ],
    //     "state_specific_suffix": true // e.g., "Building Permit - VIC"
    //   },
    //   {
    //     "document_type": "completion_certificate",
    //     "required": true,
    //     "conditions": []
    //   },
    //   {
    //     "document_type": "progress_photos",
    //     "required": true,
    //     "conditions": []
    //   }
    // ]

    // Example payment_milestones_config:
    // [
    //   {"percentage": 30, "trigger_criteria": "quote_approved"},
    //   {"percentage": 40, "trigger_criteria": "progress_photos_approved"},
    //   {"percentage": 30, "trigger_criteria": "completion_certificate_approved"}
    // ]

    public function getRequiredDocumentsForState(string $stateCode): array
    public function getPaymentMilestones(): array
}
```

**DocumentApproval** (extends Assessment documents with approval metadata)
```php
class DocumentApproval extends Model
{
    protected $fillable = [
        'assessment_id', // FK to ASS1 Assessment
        'document_id', // FK to ASS1 Document
        'document_type', // quote, building_permit, completion_certificate, progress_photos
        'approval_status', // 'pending', 'approved', 'rejected'
        'approved_by',
        'approved_at',
        'rejection_reason',
        'version_number', // increments on resubmission
    ];

    public function assessment(): BelongsTo // ASS1
    public function document(): BelongsTo // ASS1
    public function approver(): BelongsTo // User
    public function isApproved(): bool
}
```

### Integration with ASS1/ASS2

**ASS1 Integration** (Assessment module):
- HMF reads Assessment.supplier_id to link contractors
- HMF reads Assessment.documents to create DocumentApproval records
- ASS1 stores uploaded documents, HMF tracks approval workflow

**ASS2 Integration** (Inclusions module):
- ASS2 calls `Supplier::isVerifiedForCategory($tier3Code)` during readiness validation
- ASS2 reads `ComplianceCriteriaTemplate` to build action plan criteria
- ASS2 uses `DocumentApproval` status to check compliance criteria completion
- ASS2 uses payment_milestones_config to determine payment release triggers

---

## API Contracts

### Internal Service Layer (not REST - Laravel service classes)

**SupplierOnboardingService**
```php
class SupplierOnboardingService
{
    public function registerProductSupplier(array $data): Supplier
    public function registerContractor(array $data): Supplier
    public function addTier3Category(Supplier $supplier, string $tier3Code): void
    public function uploadCredential(Supplier $supplier, string $stateCode, string $type, array $data): SupplierCredential
    public function verifyCredential(SupplierCredential $credential, User $verifier): void
}
```

**SupplierValidationService** (called by ASS2)
```php
class SupplierValidationService
{
    public function isVerifiedForCategory(int $supplierId, string $tier3Code): bool
    public function hasValidCredentialsForState(int $supplierId, string $stateCode): bool
    public function validateIndependentQuotes(int $inclusionId, array $supplierIds): bool // ensures different suppliers
}
```

**ComplianceCriteriaService** (provides templates to ASS2)
```php
class ComplianceCriteriaService
{
    public function getTemplateForModificationType(string $type): ?ComplianceCriteriaTemplate
    public function getRequiredDocuments(string $modificationType, string $stateCode): array
    public function getPaymentMilestones(string $modificationType): array
}
```

**DocumentApprovalService**
```php
class DocumentApprovalService
{
    public function createApprovalRecord(int $assessmentId, int $documentId, string $type): DocumentApproval
    public function approveDocument(DocumentApproval $approval, User $approver): void
    public function rejectDocument(DocumentApproval $approval, User $approver, string $reason): void
    public function getApprovalSummary(int $assessmentId): array // X of Y approved
}
```

**WorksDashboardService**
```php
class WorksDashboardService
{
    public function getWorksGroupedBySupplier(array $filters = []): Collection // Inclusions with contractor supplier_type
    public function getWorkDetails(int $inclusionId): array // work + documents + statuses
    public function getDocumentsForWork(int $inclusionId): Collection // DocumentApprovals
}
```

### Inertia Routes (Controller → Vue Pages)

**Supplier Onboarding**
```
GET  /suppliers/register                    → SupplierRegistrationController@create → Pages/Suppliers/Register.vue
POST /suppliers/register                    → SupplierRegistrationController@store
GET  /suppliers/{id}/profile                → SupplierProfileController@show → Pages/Suppliers/Profile.vue
POST /suppliers/{id}/categories             → SupplierCategoryController@store
POST /suppliers/{id}/credentials            → SupplierCredentialController@store
```

**Compliance Dashboard**
```
GET  /compliance/works                      → ComplianceWorksController@index → Pages/Compliance/Works.vue
GET  /compliance/works/{inclusionId}        → ComplianceWorksController@show → Pages/Compliance/WorkDetail.vue
POST /compliance/documents/{approvalId}/approve → DocumentApprovalController@approve
POST /compliance/documents/{approvalId}/reject  → DocumentApprovalController@reject
```

**Contractor Portal (assessment response)**
```
GET  /contractors/assessments/{token}       → ContractorAssessmentController@show → Pages/Contractors/AssessmentRequest.vue
POST /contractors/assessments/{token}/quote → ContractorAssessmentController@submitQuote
```

### Events/Notifications

```php
// Events
AssessmentRequestSent(Assessment $assessment, Supplier $contractor)
DocumentSubmitted(DocumentApproval $approval)
DocumentApproved(DocumentApproval $approval)
DocumentRejected(DocumentApproval $approval, string $reason)
PaymentMilestoneReached(Inclusion $inclusion, array $milestone)

// Listeners
NotifyContractorOfAssessmentRequest
NotifyComplianceTeamOfNewDocument
NotifyContractorOfApproval
NotifyContractorOfRejection
NotifyRelevantPartiesOfPayment
```

---

## UI Components

### Product Supplier Registration (Wizard - 3 steps)
**Page**: `Pages/Suppliers/Register.vue`
- Step 1: Business details (name, ABN, email, phone)
- Step 2: Tier-3 category selection (checkboxes with descriptions)
- Step 3: Optional price list upload, review summary
- Components: `WizardProgress`, `CategorySelector`, `FileUpload`, `RegistrationSummary`

### Contractor Registration (Accordion - expandable sections)
**Page**: `Pages/Suppliers/RegisterContractor.vue`
- Section 1: Business details (auto-filled if existing supplier)
- Section 2: Service areas (state/territory checkboxes)
- Section 3-N: Credentials per state (dynamic based on Section 2 selection)
- Section N+1: Capabilities (modification types)
- Section N+2: Optional quote templates
- Components: `AccordionSection`, `StateSelector`, `CredentialUploadForm`, `CapabilitySelector`

### Compliance Dashboard (Accordion list)
**Page**: `Pages/Compliance/Works.vue`
- Grouped by supplier (accordion headers)
- Work cards (collapsible, show summary when collapsed, detail when expanded)
- Inline document list with approve/reject actions
- Filters: supplier, state, work status, payment status
- Components: `WorksAccordion`, `WorkCard`, `DocumentList`, `DocumentApprovalActions`, `WorksFilter`

### Document Review (Side-by-side)
**Component**: `DocumentReviewModal.vue` (modal or dedicated page)
- Left panel: Document list with status
- Right panel: PDF viewer + approval actions
- Quick actions: Approve button, Reject with reason dropdown
- Components: `DocumentViewer` (PDF.js wrapper), `ApprovalDecision`, `RejectionReasonSelector`

### Multi-Quote Comparison (Side-by-side)
**Component**: `QuoteComparisonView.vue`
- Split view showing 2 quotes side-by-side
- Price difference highlighted
- Independent supplier validation indicator
- Individual approve/reject per quote
- Components: `QuotePreview`, `ComparisonSummary`

### Contractor Assessment Response
**Page**: `Pages/Contractors/AssessmentRequest.vue`
- Assessment details (client, modification, location, deadline)
- Required documents list (based on state)
- File upload for each document type
- Submit button (validates all required docs uploaded)
- Components: `AssessmentDetails`, `RequiredDocumentsList`, `DocumentUploadSection`

---

## Implementation Phases

### Phase 0: Foundation & Integration Contracts (Week 1-2)

**Database**:
- [ ] ⚠️ EXTEND existing suppliers table (add supplier_type column) - table already exists at `domain/Supplier/Models/Supplier.php`
- [ ] Create migration for tier3_categories table (Support at Home categories)
- [ ] Create migrations for supplier_credentials, modification_types, compliance_criteria_templates, document_approvals tables
- [ ] Create pivot tables (supplier_tier3_category, supplier_service_area, supplier_modification_type)
- [ ] Seed Tier-3 categories (Support at Home canonical list: 7 categories from tiers.csv)
- [ ] Seed modification types
- [ ] Create sample compliance criteria templates (ramps, bathroom mods, stair lifts)

**Models & Relationships**:
- [ ] ⚠️ EXTEND existing Supplier model (add supplier_type cast, Tier3 category relationship) - model exists at `domain/Supplier/Models/Supplier.php`
- [ ] Create Tier3Category model
- [ ] Create SupplierCredential model
- [ ] Create ModificationType model
- [ ] Create ComplianceCriteriaTemplate model
- [ ] Create DocumentApproval model

**Integration Contracts**:
- [ ] Define SupplierValidationService interface (for ASS2 to call)
- [ ] Define ComplianceCriteriaService interface (for ASS2 to call)
- [ ] Document ASS1 Assessment/Document structure we'll integrate with
- [ ] Create shared enum/constants file for document types, credential types, states

**Tests**:
- [ ] Model relationship tests (Pest feature tests)
- [ ] Service interface tests (mocked ASS1/ASS2 calls)

### Phase 1: Product Supplier Onboarding (Week 3)

**Backend**:
- [ ] SupplierRegistrationController (create, store)
- [ ] SupplierOnboardingService (registerProductSupplier, addTier3Category)
- [ ] Form Request: RegisterProductSupplierRequest (validation rules)
- [ ] Routes for registration
- [ ] Notifications: SupplierRegistered event + email

**Frontend**:
- [ ] Pages/Suppliers/Register.vue (wizard UI)
- [ ] Components/WizardProgress.vue
- [ ] Components/CategorySelector.vue (Tier-3 checkboxes with descriptions)
- [ ] Components/FileUpload.vue (optional price list)
- [ ] Components/RegistrationSummary.vue

**Tests**:
- [ ] Feature tests: complete registration flow
- [ ] Feature tests: category selection validation
- [ ] Feature tests: ABN verification (if implemented)
- [ ] E2E test: full product supplier registration (Dusk)

### Phase 2: Contractor Onboarding (Week 4-5)

**Backend**:
- [ ] Extend SupplierOnboardingService (registerContractor, uploadCredential, validateCredentialRequirements)
- [ ] SupplierCredentialController (store, update, destroy for resubmissions)
- [ ] Form Request: RegisterContractorRequest (validates 23 required documents + state-specific)
- [ ] Form Request: UploadCredentialRequest (validates document_type, expiry_date, file type, state_code)
- [ ] Migration: supplier_credentials table with document_type enum (31 values), expiry_date nullable, state_code nullable
- [ ] Validation Rules:
  - [ ] All 23 base documents required for all contractors
  - [ ] State-specific documents required only for selected service states
  - [ ] Expiry date required for 6 specific document types (builders_warranty_insurance, workers_compensation, worksafe, professional_body_membership, WA/NT contracts)
  - [ ] Expiry date must be future date (not expired)
  - [ ] File type must be PDF, JPG, or PNG
- [ ] SupplierCredential model methods:
  - [ ] `requiresExpiryDate()`: Check if document_type requires expiry
  - [ ] `isExpired()`: Check if expiry_date is past
  - [ ] `getRequiredDocumentsForState($stateCode)`: Return array of required state-specific document types
  - [ ] `getRegistrationRequirement($stateCode)`: Return registration disclaimer text for state

**Frontend**:
- [ ] Pages/Suppliers/RegisterContractor.vue (accordion UI - recommended from mockups)
- [ ] Components/AccordionSection.vue (expandable sections for document groups)
- [ ] Components/StateServiceAreaSelector.vue (multi-select: VIC, NSW, QLD, WA, SA, TAS, ACT, NT)
- [ ] Components/BaseDocumentsUploadForm.vue (23 required documents)
  - [ ] Shows expiry date picker conditionally for 6 document types
  - [ ] Visual indicator for which documents need expiry dates
  - [ ] Validation feedback for expired documents
- [ ] Components/StateSpecificDocumentsUploadForm.vue (dynamic based on selected states)
  - [ ] QLD: QBCC Contract (Level 2)
  - [ ] NSW: NSW Building Contract
  - [ ] VIC: VIC Major Domestic Building Contract
  - [ ] ACT: ACT Residential Building Work Contract
  - [ ] SA: SA Domestic Building Contract & SA Building Indemnity Insurance
  - [ ] TAS: TAS Residential Building Work Contract & TAS Residential Building Insurance/Statutory Warranties
  - [ ] WA: WA Home Building Work Contract & WA Home Indemnity Insurance (WITH expiry date)
  - [ ] NT: NT Work Safe, NT Building Contract, & NT Building Permit information (WITH expiry date)
- [ ] Components/RegistrationDisclaimerModal.vue
  - [ ] Triggered when states selected
  - [ ] Shows threshold requirements for each selected state
  - [ ] Contractor must acknowledge responsibility for registration compliance
  - [ ] Non-blocking (informational only)
- [ ] Components/CapabilitySelector.vue (modification types: ramps, bathroom_mods, stair_lifts, etc.)
- [ ] Progress indicator showing completion (23 base + X state-specific documents uploaded / total required)

**Document Upload UX**:
- [ ] Drag-and-drop file upload
- [ ] File preview (thumbnail for images, PDF icon for PDFs)
- [ ] Document status indicators (uploaded, pending review, verified, rejected)
- [ ] Clear labeling for which documents require expiry dates
- [ ] Inline validation errors (file too large, wrong type, expired date)

**File Storage**:
- [ ] S3 integration for credential documents (bucket: supplier-credentials/)
- [ ] Generate signed URLs for document viewing
- [ ] File validation (type: PDF/JPG/PNG, size: max 10MB, malware scan if available)
- [ ] Document versioning (when contractor resubmits after rejection)

**Tests**:
- [ ] Feature tests: contractor registration with single state (VIC) - verify 24 documents required (23 base + VIC contract)
- [ ] Feature tests: contractor registration with multiple states (VIC + NSW) - verify 25 documents required
- [ ] Feature tests: credential upload with expiry date for builders_warranty_insurance
- [ ] Feature tests: validation fails when expiry_date missing for workers_compensation
- [ ] Feature tests: validation fails when expiry_date is in the past
- [ ] Feature tests: state-specific document requirements (QLD requires QBCC contract)
- [ ] Feature tests: registration disclaimer displayed for selected states
- [ ] Unit tests: SupplierCredential::requiresExpiryDate() returns true for 6 types
- [ ] Unit tests: SupplierCredential::isExpired() correctly checks date
- [ ] Unit tests: getRequiredDocumentsForState('VIC') returns ['vic_major_domestic_building_contract']
- [ ] E2E test: full contractor registration with document uploads (Dusk)

### Phase 3: Supplier Category Validation (Week 5)

**Backend**:
- [ ] SupplierValidationService (isVerifiedForCategory, hasValidCredentialsForState, validateIndependentQuotes)
- [ ] API endpoint or service method for ASS2 to call validation
- [ ] Validation logic: check supplier.categories includes requested tier3
- [ ] Validation logic: check credentials.expiry_date is future
- [ ] Validation logic: ensure different suppliers for multi-quote

**Tests**:
- [ ] Unit tests: category verification logic
- [ ] Unit tests: credential expiry validation
- [ ] Unit tests: independent quote validation
- [ ] Integration test: ASS2 calling validation service (mocked)

### Phase 4: Compliance Criteria Templates (Week 6)

**Backend**:
- [ ] ComplianceCriteriaService (getTemplateForModificationType, getRequiredDocuments, getPaymentMilestones)
- [ ] Seed compliance criteria templates for common modification types
- [ ] State-conditional logic implementation (parse JSON config)
- [ ] Payment milestone configuration

**Admin Interface** (Laravel Nova):
- [ ] Nova resource for ComplianceCriteriaTemplate (CRUD)
- [ ] Custom fields for JSON editors (required_documents_config, payment_milestones_config)

**Tests**:
- [ ] Unit tests: getRequiredDocuments with state conditions
- [ ] Unit tests: VIC requires building permit, QLD doesn't (example)
- [ ] Unit tests: payment milestone parsing
- [ ] Feature tests: ASS2 retrieving criteria templates

### Phase 5: Contractor Assessment Response (Week 7)

**Backend**:
- [ ] ContractorAssessmentController (show via secure token, submitQuote)
- [ ] Generate secure token for assessment requests (signed URL or token model)
- [ ] Store quote document in assessment (call ASS1 service)
- [ ] Create DocumentApproval records when contractor submits
- [ ] Notification to compliance team on submission

**Frontend**:
- [ ] Pages/Contractors/AssessmentRequest.vue
- [ ] Components/AssessmentDetails.vue (client info, modification, location, deadline)
- [ ] Components/RequiredDocumentsList.vue (based on state from criteria template)
- [ ] Components/DocumentUploadSection.vue (per document type)
- [ ] Validation: ensure all required documents uploaded before submit

**Tests**:
- [ ] Feature tests: contractor views assessment request
- [ ] Feature tests: contractor uploads documents
- [ ] Feature tests: validation prevents submit if documents missing
- [ ] Feature tests: state-specific documents required (VIC vs QLD)
- [ ] E2E test: full contractor response flow (Dusk)

### Phase 6: Compliance Dashboard (Week 8-9)

**Backend**:
- [ ] WorksDashboardService (getWorksGroupedBySupplier, getWorkDetails, getDocumentsForWork)
- [ ] ComplianceWorksController (index, show)
- [ ] Query optimization: eager load suppliers, assessments, documents, approvals
- [ ] Filter implementation (supplier, state, work status, payment status)
- [ ] Search implementation (client name, work description)

**Frontend**:
- [ ] Pages/Compliance/Works.vue (accordion layout)
- [ ] Components/WorksAccordion.vue (group by supplier)
- [ ] Components/WorkCard.vue (collapsible, summary + detail)
- [ ] Components/DocumentList.vue (shows all documents with status)
- [ ] Components/WorksFilter.vue (filter panel)
- [ ] Progress indicators (2 of 4 docs approved)
- [ ] Status badges (work status, payment status)

**Performance**:
- [ ] Implement query caching for works list (15min cache)
- [ ] Lazy load work details on expansion
- [ ] Pagination or virtual scrolling for 100+ works

**Tests**:
- [ ] Feature tests: fetch works grouped by supplier
- [ ] Feature tests: filter by state
- [ ] Feature tests: filter by status
- [ ] Feature tests: search by client name
- [ ] E2E test: navigate dashboard, expand work, view documents (Dusk)

### Phase 7: Document Approval Workflow (Week 9-10)

**Backend**:
- [ ] DocumentApprovalService (createApprovalRecord, approveDocument, rejectDocument, getApprovalSummary)
- [ ] DocumentApprovalController (approve, reject)
- [ ] Audit trail: log all approvals/rejections with timestamp, user, reason
- [ ] Notification on approval/rejection (to contractor)
- [ ] Update Inclusion compliance criteria status (call ASS2)

**Frontend**:
- [ ] Components/DocumentReviewModal.vue (side-by-side)
- [ ] Components/DocumentViewer.vue (PDF.js integration)
- [ ] Components/ApprovalDecision.vue (approve/reject buttons)
- [ ] Components/RejectionReasonSelector.vue (dropdown + custom text)
- [ ] Document version history display (if resubmitted)

**Notifications**:
- [ ] Email to contractor on approval
- [ ] Email to contractor on rejection (with reason)
- [ ] In-app notification for compliance team on new submission

**Tests**:
- [ ] Feature tests: approve document, check status
- [ ] Feature tests: reject document with reason, notify contractor
- [ ] Feature tests: resubmit rejected document, version increments
- [ ] Feature tests: all docs approved, compliance criteria satisfied
- [ ] E2E test: full document review workflow (Dusk)

### Phase 8: Multi-Quote Comparison (Week 11)

**Backend**:
- [ ] Logic to identify Inclusions requiring multiple quotes (from criteria template)
- [ ] Fetch multiple assessments for same Inclusion
- [ ] Validate different suppliers for each quote
- [ ] Comparison data API endpoint

**Frontend**:
- [ ] Components/QuoteComparisonView.vue (side-by-side quotes)
- [ ] Components/QuotePreview.vue (show quote summary)
- [ ] Components/ComparisonSummary.vue (price difference, supplier validation)
- [ ] Individual approve/reject actions per quote

**Tests**:
- [ ] Feature tests: fetch 2 quotes for same Inclusion
- [ ] Feature tests: validate different suppliers
- [ ] Feature tests: reject if same supplier for both quotes
- [ ] E2E test: compare quotes, approve one, reject other (Dusk)

### Phase 9: Notifications & Polish (Week 12)

**Notifications**:
- [ ] Implement all event listeners
- [ ] Email templates (assessment request, approval, rejection, payment milestone)
- [ ] In-app notification system (if not already available)
- [ ] Notification preferences for users

**Polish**:
- [ ] Error handling and user-friendly error messages
- [ ] Loading states for slow operations (PDF rendering, file uploads)
- [ ] Empty states (no works, no documents, etc.)
- [ ] Success messages and confirmations
- [ ] Accessibility audit (WCAG AA compliance)
- [ ] Mobile/tablet responsive adjustments

**Documentation**:
- [ ] API documentation (service layer contracts)
- [ ] User guides (supplier onboarding, compliance review)
- [ ] Admin guide (manage criteria templates)

**Tests**:
- [ ] Notification delivery tests
- [ ] Error scenario tests (network failure, file too large, etc.)
- [ ] Accessibility tests
- [ ] Full regression test suite

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| **ASS1/ASS2 integration delays** | Medium | High | Define clear contracts early (Phase 0), use mocks for development, parallel workstreams |
| **State-specific credential requirements change** | High | Medium | Flexible JSON config in ComplianceCriteriaTemplate, version control, admin UI for updates |
| **Contractor resistance to standardized quote format** | Medium | Medium | Phased rollout, supplier training (documented in PSF communications plan), flexible upload (PDF accepted) |
| **PDF viewer performance issues** | Low | Medium | Use lightweight PDF.js, lazy load pages, server-side thumbnail generation, progressive loading |
| **Duplicate supplier records** | Low | High | ABN uniqueness validation, search before create, data migration plan for existing suppliers |
| **File upload failures (large documents, timeouts)** | Medium | Medium | Chunked uploads, progress indicators, retry logic, client-side validation before upload |
| **Compliance team capacity** (many pending reviews) | Medium | High | Priority queue, batch approval UI (Phase 9 enhancement), aging alerts, escalation flags |
| **Multi-quote validation complexity** | Low | Medium | Clear business rules documented, automated validation, manual override for edge cases |
| **Tier-3 category changes** | Low | Medium | Use codes (not names) in DB, separate display names, versioning if needed |
| **Scalability beyond 500 suppliers** | Low | Low | Query optimization, caching, pagination, consider queue for notifications |

---

## Next Steps

### Immediate (Before Starting Implementation):
1. **Validate Integration Contracts**:
   - Review with ASS1/ASS2 teams: SupplierValidationService, ComplianceCriteriaService interfaces
   - Confirm Assessment/Document data structures from ASS1
   - Confirm Inclusion criteria evaluation expectations from ASS2

2. **Confirm Tier-3 Canonical Dataset**:
   - Get authoritative list of Tier-3 categories with codes and descriptions
   - Confirm these align with ASS2's dataset

3. **Clarify State Credential Requirements**:
   - Get detailed requirements per state (VIC, NSW, QLD, SA, WA, TAS, NT, ACT)
   - Document in config/credentials.php

4. **Review Mockups with Stakeholders**:
   - Show compliance team the Works dashboard mockups (accordion vs table vs cards)
   - Show contractors the onboarding mockups (wizard vs accordion)
   - Adjust based on feedback

### Development Workflow:
1. Run `/speckit.tasks` to generate tasks.md (break phases into granular tasks)
2. Create feature branch: `git checkout -b TP-3155-hmf-supplier-ecosystem`
3. Phase 0: Database + models first (TDD - write tests before implementation)
4. Run `vendor/bin/pint --dirty` after each file creation
5. Run `php artisan test --filter=HMF` after each feature
6. Phase 1-9: Sequential implementation (each phase is independently testable)
7. Continuous integration with ASS1/ASS2 as they progress

### Post-Implementation:
1. Run `/trilogy.jira-sync` to sync tasks to Jira (if using Jira)
2. UAT with compliance team and sample contractors
3. Soft launch with limited suppliers (pilot program)
4. Monitor performance, error rates, notification delivery
5. Iterate based on user feedback
6. Full rollout once stable

---

## Notes

- **Critical Scope Boundary**: HMF builds the UI shell (Supplier Portal tabs, Compliance Dashboard) and defines data structures (criteria templates, payment milestones). ASS2 owns all business logic that populates these views (Inclusion lifecycle, quote selection, criteria evaluation, payment gating). All ASS2 logic context has been saved to `supplier-workflow-requirements-from-hmf-psf.md` in the ASS2 epic.

- **ASS1/ASS2 Dependencies**: HMF can be developed largely independently using mocks for ASS1/ASS2 interfaces. Real integration happens in Phase 5 (contractor response - documents stored via ASS1) and Phase 6/7 (compliance dashboard displays Works data from ASS2).

- **Pricing Tab Implementation**: Shows fixed hourly rates for non-HM services (home maintenance, repairs - weekday/weekend/holiday rates). For Home Modifications, displays "Quote Basis - Per Project" with link to Works tab.

- **Quote → Work Flow** (ASS2 owns, HMF displays):
  1. Inclusion created (ASS2) → Assessment requests sent to contractors
  2. Contractors submit quotes → appear in Documents & Agreements tab (HMF UI, data via ASS1)
  3. Care partner selects winning quote (ASS2 logic)
  4. Selected quote becomes "Work" → appears in Works tab (HMF UI, data from ASS2)

- **Supplier Migration**: If existing suppliers in system, create data migration script to populate new Supplier records from existing data source.

- **Admin Interface**: Laravel Nova will be used for compliance criteria template management, not for day-to-day compliance review (that's the Works dashboard).

- **Mobile Considerations**: Compliance dashboard is desktop/tablet primary. Contractor assessment response should work on mobile (camera integration for document photos).

- **Accessibility**: All forms and dashboards must be keyboard navigable and screen-reader friendly (WCAG AA minimum).

- **Future Enhancements** (out of initial scope):
  - Batch document approval (select multiple, approve all)
  - Contractor dashboard (view all their works, submission history)
  - Analytics/reporting (average approval time, bottleneck identification)
  - Integration with external verification services (ABN lookup API, license verification API)
  - Document expiry monitoring/alerts (notify contractors 30 days before credential expiry)

---

## References

- **Spec**: [spec.md](./spec.md)
- **IDEA-BRIEF**: [IDEA-BRIEF.md](./IDEA-BRIEF.md)
- **Home Modifications Contractor Document Requirements**: [DUMP/other_context/home-modifications-contractor-document-requirements.md](./DUMP/other_context/home-modifications-contractor-document-requirements.md)
  - **Critical Reference**: Contains detailed list of 23 required documents + 8 state-specific contracts, expiry date requirements, registration thresholds by state
- **Revised Scope Summary**: [DUMP/other_context/hmf-revised-scope-summary.md](./DUMP/other_context/hmf-revised-scope-summary.md)
- **Mockups**:
  - [mockups/compliance-dashboard-variations.txt](./mockups/compliance-dashboard-variations.txt) (Option F recommended)
  - [mockups/supplier-onboarding-variations.txt](./mockups/supplier-onboarding-variations.txt) (Option E for contractors, Option B for products)
  - [mockups/document-review-variations.txt](./mockups/document-review-variations.txt) (Option B recommended)
- **ASS1 Context**: `../../../TP-1859-Clinical-And-Care-Plan/TP-1904-ASS1-Assessment-Prescriptions/`
- **ASS2 Context**: `../../../TP-1859-Clinical-And-Care-Plan/TP-2914-ASS2-Inclusion-Integration/`
- **Supplier Workflow Requirements for ASS2**: `../../../TP-1859-Clinical-And-Care-Plan/TP-2914-ASS2-Inclusion-Integration/DUMP/other_context/supplier-workflow-requirements-from-hmf-psf.md`
