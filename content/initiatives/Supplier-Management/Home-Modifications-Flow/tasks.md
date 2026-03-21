---
title: "Tasks"
---


**Spec**: [spec.md](./spec.md)
**Plan**: [plan.md](./plan.md)
**Created**: 2025-12-08
**Epic**: TP-3155 | **Initiative**: TP-1857 Supplier Management

---

## Overview

This task list implements the HMF supplier ecosystem layer, organized by user story priority to enable incremental delivery. Each user story is independently testable and delivers value.

**Total Tasks**: 149 tasks across 7 user stories
**Estimated Duration**: 12 weeks
**MVP Scope**: User Story 1 (Product Supplier Onboarding) - 18 tasks, ~3 weeks

---

## ⚠️ CRITICAL: Existing Infrastructure Review Required

**IMPORTANT CONTEXT**:
- This epic is for **Support at Home (Australian Aged Care)** program, NOT NDIS
- "Tier-3 categories" refer to Support at Home service/product categories (7 categories from tiers.csv)
- Existing supplier infrastructure must be EXTENDED, not recreated

**What Already Exists (DO NOT DUPLICATE)**:
1. ✅ **Suppliers table & model** - `domain/Supplier/Models/Supplier.php` with full relationships
2. ✅ **Organisation prices** - `domain/Organisation/Models/OrganisationPrice.php` with `rate_type` (DIRECT/INDIRECT)
3. ✅ **Service types** - `app/Models/AdminModels/ServiceType.php` with `supports_direct_indirect_rates` flag
4. ✅ **Event-sourced onboarding** - Complete at `domain/Supplier/EventSourcing/` with aggregates and projectors
5. ✅ **Supplier onboarding model** - `domain/Supplier/Models/SupplierOnboarding.php` tracks 7 stages

**What Needs Building (NET-NEW)**:
1. ❌ Tier-3 categories table (Support at Home categories)
2. ❌ Supplier type distinction (Contractor | ProductSupplier)
3. ❌ Contractor credentials (23+8 state-specific documents)
4. ❌ Modification types (ramps, bathroom mods, etc.)
5. ❌ Compliance workflows (criteria templates, document approvals, works dashboard)

**Tasks Requiring Revision**:
- **T008**: ⚠️ DUPLICATE - Extend existing suppliers table, don't create new
- **T020**: ⚠️ DUPLICATE - Extend existing Supplier model
- **T033**: ⚠️ INTEGRATE - Use existing event sourcing, don't create parallel service

**Before Starting**: Review marked tasks (⚠️) to understand integration points with existing infrastructure

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization, database foundation, and shared constants

- [ ] T001 Create feature branch `TP-3155-hmf-supplier-ecosystem` from dev
- [ ] T002 [P] Create enums file at `app/Enums/SupplierType.php` with values: Contractor, ProductSupplier
- [ ] T003 [P] Create enums file at `app/Enums/DocumentType.php` with 31 document types from plan.md
- [ ] T004 [P] Create enums file at `app/Enums/DocumentApprovalStatus.php` with values: Pending, Approved, Rejected
- [ ] T005 [P] Create enums file at `app/Enums/WorkStatus.php` with values: New, Quoted, DocumentsReceived, UnderReview, Escalated, Approved, Completed
- [ ] T006 [P] Create enums file at `app/Enums/PaymentStatus.php` with values: Pending, Partial, Paid
- [ ] T007 [P] Create state constants file at `config/states.php` with AU states/territories: VIC, NSW, QLD, WA, SA, TAS, ACT, NT

---

## Phase 2: Foundation (Blocking Prerequisites)

**Purpose**: Core database schema, models, and shared services that ALL user stories depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

**⚠️ IMPORTANT - EXISTING INFRASTRUCTURE**:
- Suppliers table and model already exist at `domain/Supplier/Models/Supplier.php`
- Organisation prices table already exists with `rate_type` (DIRECT/INDIRECT) support
- Service types table already exists at `app/Models/AdminModels/ServiceType.php`
- Event-sourced supplier onboarding already exists (`domain/Supplier/EventSourcing/`)
- **ACTION REQUIRED**: Review tasks T008, T020, T033 - these need to EXTEND existing models, not create new ones

### Database Migrations

- [ ] T008 ⚠️ **DUPLICATE - ALREADY EXISTS** - Suppliers table exists at `domain/Supplier/Models/Supplier.php`. Instead: Create migration to ADD `supplier_type` enum column to existing `suppliers` table
- [ ] T009 Create migration `create_tier3_categories_table` with columns: id, code, name, description, timestamps
- [ ] T010 Create migration `create_modification_types_table` with columns: id, code, name, description, timestamps
- [ ] T011 Create migration `create_supplier_tier3_category_pivot_table` with columns: supplier_id, tier3_category_id, timestamps
- [ ] T012 Create migration `create_supplier_service_area_table` with columns: id, supplier_id, state_code, timestamps
- [ ] T013 Create migration `create_supplier_modification_type_pivot_table` with columns: supplier_id, modification_type_id, timestamps
- [ ] T014 Create migration `create_supplier_credentials_table` with columns: id, supplier_id, state_code (nullable), document_type (enum), credential_number (nullable), expiry_date (nullable), document_path, verification_status (enum), verified_at, verified_by, rejection_reason (nullable), timestamps
- [ ] T015 Create migration `create_compliance_criteria_templates_table` with columns: id, name, modification_type (nullable), required_documents_config (json), payment_milestones_config (json), multi_quote_requirement (integer), timestamps
- [ ] T016 Create migration `create_document_approvals_table` with columns: id, assessment_id, document_id, document_type (enum), approval_status (enum), approved_by (nullable), approved_at (nullable), rejection_reason (nullable), version_number (integer default 1), timestamps

### Seeders

- [ ] T017 Create seeder `Tier3CategorySeeder` in `database/seeders/` with Support at Home Tier-3 categories:
  - Communication and Information Management Products (SERV-0065)
  - Domestic Life Products (SERV-0064)
  - Home Modification Products (SERV-0067)
  - Home Modifications Prescription and Clinical Support (SERV-0068)
  - Managing Body Functions (SERV-0061)
  - Mobility Products (SERV-0063)
  - Self-care Products (SERV-0062)
  **Note**: These are Support at Home (Australian Aged Care) categories, NOT NDIS categories
- [ ] T018 Create seeder `ModificationTypeSeeder` with types: ramps, bathroom_mods, stair_lifts, accessibility_renos, kitchen_mods, smart_home, other
- [ ] T019 Create seeder `ComplianceCriteriaTemplateSeeder` with sample templates for ramps, bathroom_mods, stair_lifts (including state-conditional docs, payment milestones, multi-quote requirements)

### Models

- [ ] T020 ⚠️ **DUPLICATE - ALREADY EXISTS** - Supplier model exists at `domain/Supplier/Models/Supplier.php`. Instead: EXTEND existing Supplier model by adding:
  - `supplier_type` cast to enum
  - `categories()` relationship: BelongsToMany Tier3Category
  - `credentials()` relationship: HasMany SupplierCredential (new)
  - `capabilities()` relationship: BelongsToMany ModificationType (new)
  **Note**: serviceAreas likely already exists as morphMany(OrganisationLocation)
- [ ] T021 Create model `Tier3Category` in `app/Models/Tier3Category.php` with relationship: suppliers (BelongsToMany)
- [ ] T022 Create model `ModificationType` in `app/Models/ModificationType.php` with relationship: contractors (BelongsToMany Supplier)
- [ ] T023 Create model `SupplierCredential` in `app/Models/SupplierCredential.php` with relationships: supplier (BelongsTo), verifier (BelongsTo User) and methods: isExpired(), isValid(), requiresExpiryDate()
- [ ] T024 Create model `ComplianceCriteriaTemplate` in `app/Models/ComplianceCriteriaTemplate.php` with casts for JSON fields and methods: getRequiredDocumentsForState(string $stateCode), getPaymentMilestones()
- [ ] T025 Create model `DocumentApproval` in `app/Models/DocumentApproval.php` with relationships: assessment (BelongsTo), document (BelongsTo), approver (BelongsTo User) and method: isApproved()

### Model Tests

- [ ] T026 Create test `SupplierTest` in `tests/Unit/Models/SupplierTest.php` testing relationships and factory
- [ ] T027 Create test `SupplierCredentialTest` in `tests/Unit/Models/SupplierCredentialTest.php` testing expiry logic, requiresExpiryDate() for 6 document types
- [ ] T028 Create test `ComplianceCriteriaTemplateTest` in `tests/Unit/Models/ComplianceCriteriaTemplateTest.php` testing getRequiredDocumentsForState() with state-conditional logic

### Shared Services (Interfaces)

- [ ] T029 Create service `SupplierValidationService` in `app/Services/Supplier/SupplierValidationService.php` with methods: isVerifiedForCategory(int $supplierId, string $tier3Code), hasValidCredentialsForState(int $supplierId, string $stateCode), validateIndependentQuotes(int $inclusionId, array $supplierIds)
- [ ] T030 Create service `ComplianceCriteriaService` in `app/Services/Compliance/ComplianceCriteriaService.php` with methods: getTemplateForModificationType(string $type), getRequiredDocuments(string $modificationType, string $stateCode), getPaymentMilestones(string $modificationType)

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Product Supplier Onboarding (Priority: P1) 🎯 MVP

**Goal**: Enable product suppliers to register and select Tier-3 categories they can supply

**Independent Test**: Complete supplier registration form, select Tier-3 categories, verify supplier profile created with verified categories stored

**Value**: Enables product suppliers to participate in ecosystem and validates basic supplier registration flow

### Backend Implementation

- [ ] T031 [P] [US1] Create controller `SupplierRegistrationController` in `app/Http/Controllers/Supplier/SupplierRegistrationController.php` with methods: create(), store()
- [ ] T032 [P] [US1] Create form request `RegisterProductSupplierRequest` in `app/Http/Requests/Supplier/RegisterProductSupplierRequest.php` with validation for business_name, abn, contact_email, contact_phone
- [ ] T033 [US1] ⚠️ **INTEGRATE WITH EXISTING** - Event-sourced supplier onboarding already exists at `domain/Supplier/EventSourcing/SupplierOnboardingAggregateRoot`. Instead:
  - Add new event `ProductSupplierTier3CategorySelected` to existing aggregate
  - Extend existing `SupplierOnboardingProjector` to handle Tier-3 category selection
  - Use existing `SupplierOnboarding` model to track completion
  **DO NOT create parallel SupplierOnboardingService** - use existing event sourcing pattern
- [ ] T034 [US1] Add event `ProductSupplierTier3CategorySelected` to `domain/Supplier/EventSourcing/Events/` and update aggregate root with `selectTier3Category(string $tier3Code)` method
- [ ] T035 [US1] Create event `SupplierRegistered` in `app/Events/Supplier/SupplierRegistered.php`
- [ ] T036 [US1] Create listener `NotifySupplierOfRegistration` in `app/Listeners/Supplier/NotifySupplierOfRegistration.php`
- [ ] T037 [US1] Create notification `SupplierRegisteredNotification` in `app/Notifications/Supplier/SupplierRegisteredNotification.php` with email template
- [ ] T038 [US1] Add routes in `routes/web.php`: GET /suppliers/register → create, POST /suppliers/register → store, POST /suppliers/{id}/categories → store

### Frontend Implementation

- [ ] T039 [P] [US1] Create page `Register.vue` in `resources/js/Pages/Suppliers/Register.vue` with 3-step wizard: business details, category selection, review
- [ ] T040 [P] [US1] Create component `WizardProgress.vue` in `resources/js/Components/Supplier/WizardProgress.vue`
- [ ] T041 [P] [US1] Create component `CategorySelector.vue` in `resources/js/Components/Supplier/CategorySelector.vue` with Tier-3 category checkboxes
- [ ] T042 [P] [US1] Create component `RegistrationSummary.vue` in `resources/js/Components/Supplier/RegistrationSummary.vue`
- [ ] T043 [US1] Create component `FileUpload.vue` in `resources/js/Components/Shared/FileUpload.vue` (reusable for optional price lists)

### Tests

- [ ] T044 [US1] Create feature test `ProductSupplierRegistrationTest` in `tests/Feature/Supplier/ProductSupplierRegistrationTest.php` testing complete registration flow
- [ ] T045 [US1] Add test case to ProductSupplierRegistrationTest: category selection validation (canonical list only)
- [ ] T046 [US1] Add test case to ProductSupplierRegistrationTest: multiple Tier-3 categories stored correctly
- [ ] T047 [US1] Add test case to ProductSupplierRegistrationTest: notification sent on registration
- [ ] T048 [US1] Run `php artisan test --filter=ProductSupplierRegistration` and ensure all pass

**Checkpoint**: User Story 1 complete - Product suppliers can register and select categories

---

## Phase 4: User Story 2 - Home Modifications Contractor Onboarding (Priority: P2)

**Goal**: Enable contractors to complete verification with state-specific credentials (23 base + 8 state-specific documents)

**Independent Test**: Complete contractor registration with all required credentials, select service areas, verify contractor profile created with all verification data

**Value**: Enables contractors to register and receive assessment requests

### Backend Implementation

- [ ] T049 [P] [US2] Add method registerContractor(array $data): Supplier to SupplierOnboardingService
- [ ] T050 [P] [US2] Create controller `SupplierCredentialController` in `app/Http/Controllers/Supplier/SupplierCredentialController.php` with methods: store(), update(), destroy()
- [ ] T051 [P] [US2] Create form request `RegisterContractorRequest` in `app/Http/Requests/Supplier/RegisterContractorRequest.php` validating 23 required documents + state-specific based on service areas
- [ ] T052 [P] [US2] Create form request `UploadCredentialRequest` in `app/Http/Requests/Supplier/UploadCredentialRequest.php` with validation: document_type, expiry_date (conditional), file type (PDF/JPG/PNG), state_code (conditional)
- [ ] T053 [US2] Add method uploadCredential(Supplier $supplier, string $stateCode, string $type, array $data): SupplierCredential to SupplierOnboardingService
- [ ] T054 [US2] Add static method getRequiredDocumentsForState(string $stateCode): array to SupplierCredential model
- [ ] T055 [US2] Add static method getRegistrationRequirement(string $stateCode): ?array to SupplierCredential model
- [ ] T056 [US2] Configure S3 bucket `supplier-credentials/` for credential document storage in `config/filesystems.php`
- [ ] T057 [US2] Add routes in `routes/web.php`: POST /suppliers/{id}/credentials → store, PUT /suppliers/{id}/credentials/{credentialId} → update, DELETE /suppliers/{id}/credentials/{credentialId} → destroy

### Validation Rules Implementation

- [ ] T058 [US2] Implement validation rule in RegisterContractorRequest: all 23 base documents required for all contractors
- [ ] T059 [US2] Implement validation rule in RegisterContractorRequest: state-specific documents required only for selected service states (QLD→QBCC, NSW→NSW contract, etc.)
- [ ] T060 [US2] Implement validation rule in UploadCredentialRequest: expiry_date required for 6 specific document types (builders_warranty_insurance, workers_compensation, worksafe, professional_body_membership, WA contract, NT contract)
- [ ] T061 [US2] Implement validation rule in UploadCredentialRequest: expiry_date must be future date (not expired)
- [ ] T062 [US2] Implement validation rule in UploadCredentialRequest: file type must be PDF, JPG, or PNG, max 10MB

### Frontend Implementation

- [ ] T063 [P] [US2] Create page `RegisterContractor.vue` in `resources/js/Pages/Suppliers/RegisterContractor.vue` with accordion sections
- [ ] T064 [P] [US2] Create component `AccordionSection.vue` in `resources/js/Components/Supplier/AccordionSection.vue`
- [ ] T065 [P] [US2] Create component `StateServiceAreaSelector.vue` in `resources/js/Components/Supplier/StateServiceAreaSelector.vue` with multi-select for 8 states
- [ ] T066 [P] [US2] Create component `BaseDocumentsUploadForm.vue` in `resources/js/Components/Supplier/BaseDocumentsUploadForm.vue` handling 23 required documents with expiry date pickers for 6 types
- [ ] T067 [P] [US2] Create component `StateSpecificDocumentsUploadForm.vue` in `resources/js/Components/Supplier/StateSpecificDocumentsUploadForm.vue` dynamically showing 8 state-specific contracts
- [ ] T068 [P] [US2] Create component `RegistrationDisclaimerModal.vue` in `resources/js/Components/Supplier/RegistrationDisclaimerModal.vue` showing threshold requirements for selected states
- [ ] T069 [P] [US2] Create component `CapabilitySelector.vue` in `resources/js/Components/Supplier/CapabilitySelector.vue` for modification types selection
- [ ] T070 [US2] Enhance FileUpload.vue component with drag-and-drop, file preview, status indicators
- [ ] T071 [US2] Add progress indicator to RegisterContractor.vue showing completion (X of Y documents uploaded)

### File Storage Implementation

- [ ] T072 [US2] Implement S3 file upload logic in SupplierOnboardingService for credential documents
- [ ] T073 [US2] Implement signed URL generation for credential document viewing
- [ ] T074 [US2] Implement file validation (type, size, malware scan if available) before S3 upload
- [ ] T075 [US2] Implement document versioning logic for resubmissions after rejection

### Tests

- [ ] T076 [US2] Create feature test `ContractorRegistrationTest` in `tests/Feature/Supplier/ContractorRegistrationTest.php` testing single state registration (VIC - expects 24 docs: 23 base + VIC contract)
- [ ] T077 [US2] Add test case to ContractorRegistrationTest: multiple states registration (VIC + NSW - expects 25 docs)
- [ ] T078 [US2] Add test case to ContractorRegistrationTest: credential upload with expiry_date for builders_warranty_insurance
- [ ] T079 [US2] Add test case to ContractorRegistrationTest: validation fails when expiry_date missing for workers_compensation
- [ ] T080 [US2] Add test case to ContractorRegistrationTest: validation fails when expiry_date is in the past
- [ ] T081 [US2] Add test case to ContractorRegistrationTest: state-specific document requirements (QLD requires QBCC contract)
- [ ] T082 [US2] Add test case to ContractorRegistrationTest: registration disclaimer displayed for selected states (non-blocking)
- [ ] T083 [US2] Create unit test `SupplierCredentialValidationTest` in `tests/Unit/SupplierCredentialValidationTest.php` testing requiresExpiryDate() returns true for 6 types
- [ ] T084 [US2] Add test case to SupplierCredentialValidationTest: isExpired() correctly checks date
- [ ] T085 [US2] Add test case to SupplierCredentialValidationTest: getRequiredDocumentsForState('VIC') returns ['vic_major_domestic_building_contract']
- [ ] T086 [US2] Run `php artisan test --filter=ContractorRegistration` and ensure all pass

**Checkpoint**: User Story 2 complete - Contractors can register with comprehensive state-specific credentials

---

## Phase 5: User Story 3 - Contractor Receives Assessment Request and Submits Quote (Priority: P3)

**Goal**: Enable contractors to receive assessment requests and submit quotes with required documents

**Independent Test**: Create assessment request (via ASS1), contractor receives notification, views request details, uploads quote and documents, verify submission received

**Value**: Enables contractors to respond to assessment requests

### Backend Implementation

- [ ] T087 [P] [US3] Create controller `ContractorAssessmentController` in `app/Http/Controllers/Contractor/ContractorAssessmentController.php` with methods: show(string $token), submitQuote(string $token)
- [ ] T088 [P] [US3] Create form request `SubmitQuoteRequest` in `app/Http/Requests/Contractor/SubmitQuoteRequest.php` validating quote document and required compliance documents
- [ ] T089 [US3] Generate secure token for assessment requests (use signed URL or create AssessmentToken model)
- [ ] T090 [US3] Create event `AssessmentRequestSent` in `app/Events/Assessment/AssessmentRequestSent.php` with assessment and contractor data
- [ ] T091 [US3] Create listener `NotifyContractorOfAssessmentRequest` in `app/Listeners/Assessment/NotifyContractorOfAssessmentRequest.php`
- [ ] T092 [US3] Create notification `AssessmentRequestNotification` in `app/Notifications/Assessment/AssessmentRequestNotification.php` with email template including request details and deadline
- [ ] T093 [US3] Integrate with ASS1 to store quote document in assessment (call ASS1 service or use DocumentApproval model)
- [ ] T094 [US3] Create DocumentApproval records when contractor submits quote
- [ ] T095 [US3] Create event `DocumentSubmitted` in `app/Events/Compliance/DocumentSubmitted.php`
- [ ] T096 [US3] Create listener `NotifyComplianceTeamOfNewDocument` in `app/Listeners/Compliance/NotifyComplianceTeamOfNewDocument.php`
- [ ] T097 [US3] Add routes in `routes/web.php`: GET /contractors/assessments/{token} → show, POST /contractors/assessments/{token}/quote → submitQuote

### Frontend Implementation

- [ ] T098 [P] [US3] Create page `AssessmentRequest.vue` in `resources/js/Pages/Contractors/AssessmentRequest.vue`
- [ ] T099 [P] [US3] Create component `AssessmentDetails.vue` in `resources/js/Components/Contractor/AssessmentDetails.vue` showing client details, modification required, location, deadline
- [ ] T100 [P] [US3] Create component `RequiredDocumentsList.vue` in `resources/js/Components/Contractor/RequiredDocumentsList.vue` showing state-specific required documents
- [ ] T101 [P] [US3] Create component `DocumentUploadSection.vue` in `resources/js/Components/Contractor/DocumentUploadSection.vue` with file upload for each document type
- [ ] T102 [US3] Add validation in AssessmentRequest.vue: ensure all required documents uploaded before submit enabled

### Tests

- [ ] T103 [US3] Create feature test `ContractorAssessmentResponseTest` in `tests/Feature/Contractor/ContractorAssessmentResponseTest.php` testing contractor views assessment request
- [ ] T104 [US3] Add test case to ContractorAssessmentResponseTest: contractor uploads quote and documents
- [ ] T105 [US3] Add test case to ContractorAssessmentResponseTest: validation prevents submit if documents missing
- [ ] T106 [US3] Add test case to ContractorAssessmentResponseTest: state-specific documents required based on client location (VIC requires Building Permit - VIC)
- [ ] T107 [US3] Add test case to ContractorAssessmentResponseTest: compliance team notified on submission
- [ ] T108 [US3] Run `php artisan test --filter=ContractorAssessmentResponse` and ensure all pass

**Checkpoint**: User Story 3 complete - Contractors can receive and respond to assessment requests

---

## Phase 6: User Story 4 - Compliance Team Views Works Dashboard (Priority: P4)

**Goal**: Provide compliance team with centralized view of all home modification works grouped by supplier

**Independent Test**: Create multiple home modification Inclusions with assessment submissions, view Works dashboard, filter by supplier, verify all work details displayed correctly

**Value**: Provides centralized compliance review interface

### Backend Implementation

- [ ] T109 [P] [US4] Create service `WorksDashboardService` in `app/Services/Compliance/WorksDashboardService.php` with methods: getWorksGroupedBySupplier(array $filters = []): Collection, getWorkDetails(int $inclusionId): array, getDocumentsForWork(int $inclusionId): Collection
- [ ] T110 [P] [US4] Create controller `ComplianceWorksController` in `app/Http/Controllers/Compliance/ComplianceWorksController.php` with methods: index(), show(int $inclusionId)
- [ ] T111 [US4] Implement query in WorksDashboardService filtering to Inclusions with supplier_type = Contractor (home modifications only)
- [ ] T112 [US4] Implement query optimization: eager load suppliers, assessments, documents, approvals in WorksDashboardService
- [ ] T113 [US4] Implement filter logic in WorksDashboardService: filter by supplier, state, work_status, payment_status
- [ ] T114 [US4] Implement search logic in WorksDashboardService: search by client_name, work_description
- [ ] T115 [US4] Add routes in `routes/web.php`: GET /compliance/works → index, GET /compliance/works/{inclusionId} → show

### Frontend Implementation

- [ ] T116 [P] [US4] Create page `Works.vue` in `resources/js/Pages/Compliance/Works.vue` with accordion layout
- [ ] T117 [P] [US4] Create component `WorksAccordion.vue` in `resources/js/Components/Compliance/WorksAccordion.vue` grouping works by supplier
- [ ] T118 [P] [US4] Create component `WorkCard.vue` in `resources/js/Components/Compliance/WorkCard.vue` showing work summary (collapsible) and details (expanded)
- [ ] T119 [P] [US4] Create component `DocumentList.vue` in `resources/js/Components/Compliance/DocumentList.vue` showing all documents with approval status and aggregate count (X of Y approved)
- [ ] T120 [P] [US4] Create component `WorksFilter.vue` in `resources/js/Components/Compliance/WorksFilter.vue` with filter panel for supplier, state, work status, payment status
- [ ] T121 [US4] Add status badges to WorkCard.vue for work_status and payment_status (separate display)
- [ ] T122 [US4] Add progress indicators to WorkCard.vue showing document approval progress

### Performance Optimization

- [ ] T123 [US4] Implement query caching for works list (15 min cache) in WorksDashboardService
- [ ] T124 [US4] Implement lazy loading of work details on accordion expansion in Works.vue
- [ ] T125 [US4] Implement pagination or virtual scrolling for 100+ works in Works.vue

### Tests

- [ ] T126 [US4] Create feature test `ComplianceWorksDashboardTest` in `tests/Feature/Compliance/ComplianceWorksDashboardTest.php` testing fetch works grouped by supplier
- [ ] T127 [US4] Add test case to ComplianceWorksDashboardTest: filter by state returns correct works
- [ ] T128 [US4] Add test case to ComplianceWorksDashboardTest: filter by work_status returns correct works
- [ ] T129 [US4] Add test case to ComplianceWorksDashboardTest: search by client_name finds works
- [ ] T130 [US4] Add test case to ComplianceWorksDashboardTest: only Inclusions with supplier_type=Contractor shown
- [ ] T131 [US4] Run `php artisan test --filter=ComplianceWorksDashboard` and ensure all pass

**Checkpoint**: User Story 4 complete - Compliance team can view and filter all works

---

## Phase 7: User Story 5 - Compliance Team Approves or Rejects Individual Documents (Priority: P5)

**Goal**: Enable compliance team to approve or reject each document individually with specific feedback

**Independent Test**: View submitted documents, approve some, reject others with reasons, verify contractor receives notifications, track document status changes

**Value**: Enables precise compliance feedback

### Backend Implementation

- [ ] T132 [P] [US5] Create service `DocumentApprovalService` in `app/Services/Compliance/DocumentApprovalService.php` with methods: createApprovalRecord(int $assessmentId, int $documentId, string $type): DocumentApproval, approveDocument(DocumentApproval $approval, User $approver): void, rejectDocument(DocumentApproval $approval, User $approver, string $reason): void, getApprovalSummary(int $assessmentId): array
- [ ] T133 [P] [US5] Create controller `DocumentApprovalController` in `app/Http/Controllers/Compliance/DocumentApprovalController.php` with methods: approve(int $approvalId), reject(int $approvalId)
- [ ] T134 [US5] Implement audit trail logging in DocumentApprovalService: log all approvals/rejections with timestamp, user, reason
- [ ] T135 [US5] Create event `DocumentApproved` in `app/Events/Compliance/DocumentApproved.php`
- [ ] T136 [US5] Create event `DocumentRejected` in `app/Events/Compliance/DocumentRejected.php`
- [ ] T137 [US5] Create listener `NotifyContractorOfApproval` in `app/Listeners/Compliance/NotifyContractorOfApproval.php`
- [ ] T138 [US5] Create listener `NotifyContractorOfRejection` in `app/Listeners/Compliance/NotifyContractorOfRejection.php`
- [ ] T139 [US5] Create notification `DocumentApprovedNotification` in `app/Notifications/Compliance/DocumentApprovedNotification.php`
- [ ] T140 [US5] Create notification `DocumentRejectedNotification` in `app/Notifications/Compliance/DocumentRejectedNotification.php` including rejection_reason and remediation steps
- [ ] T141 [US5] Integrate with ASS2 to update Inclusion compliance criteria status when all documents approved
- [ ] T142 [US5] Add routes in `routes/web.php`: POST /compliance/documents/{approvalId}/approve → approve, POST /compliance/documents/{approvalId}/reject → reject

### Frontend Implementation

- [ ] T143 [P] [US5] Create component `DocumentReviewModal.vue` in `resources/js/Components/Compliance/DocumentReviewModal.vue` with side-by-side layout (document list left, viewer right)
- [ ] T144 [P] [US5] Create component `DocumentViewer.vue` in `resources/js/Components/Compliance/DocumentViewer.vue` integrating PDF.js for PDF rendering
- [ ] T145 [P] [US5] Create component `ApprovalDecision.vue` in `resources/js/Components/Compliance/ApprovalDecision.vue` with approve/reject buttons
- [ ] T146 [P] [US5] Create component `RejectionReasonSelector.vue` in `resources/js/Components/Compliance/RejectionReasonSelector.vue` with dropdown of common reasons + custom text
- [ ] T147 [US5] Add document version history display to DocumentReviewModal.vue for resubmitted documents

### Tests

- [ ] T148 [US5] Create feature test `DocumentApprovalWorkflowTest` in `tests/Feature/Compliance/DocumentApprovalWorkflowTest.php` testing approve document updates status
- [ ] T149 [US5] Add test case to DocumentApprovalWorkflowTest: reject document with reason notifies contractor
- [ ] T150 [US5] Add test case to DocumentApprovalWorkflowTest: resubmit rejected document increments version_number
- [ ] T151 [US5] Add test case to DocumentApprovalWorkflowTest: all docs approved satisfies compliance criteria (updates Inclusion via ASS2)
- [ ] T152 [US5] Add test case to DocumentApprovalWorkflowTest: audit trail logged for all approval actions
- [ ] T153 [US5] Run `php artisan test --filter=DocumentApprovalWorkflow` and ensure all pass

**Checkpoint**: User Story 5 complete - Compliance team can approve/reject documents with granular feedback

---

## Phase 8: User Story 6 - System Validates Supplier Category for Billing (Priority: P6)

**Goal**: Validate product supplier is verified for Tier-3 category to prevent billing errors

**Independent Test**: Create product Inclusion with specific Tier-3 category, attempt billing from supplier with matching category (should succeed), attempt billing from supplier without matching category (should fail with reason code)

**Value**: Ensures billing compliance

### Backend Implementation

- [ ] T154 [US6] Implement method isVerifiedForCategory(int $supplierId, string $tier3Code): bool in SupplierValidationService
- [ ] T155 [US6] Add validation logic in isVerifiedForCategory: check supplier.categories includes requested tier3_code
- [ ] T156 [US6] Return reason code "Supplier not verified for category: [category name]" when validation fails
- [ ] T157 [US6] Document API contract in service for ASS2 integration (validation endpoint or service method)

### Tests

- [ ] T158 [US6] Create feature test `SupplierCategoryValidationTest` in `tests/Feature/Supplier/SupplierCategoryValidationTest.php` testing validation passes when supplier verified for category
- [ ] T159 [US6] Add test case to SupplierCategoryValidationTest: validation fails when supplier NOT verified for category
- [ ] T160 [US6] Add test case to SupplierCategoryValidationTest: correct reason code returned on failure
- [ ] T161 [US6] Add test case to SupplierCategoryValidationTest: ASS2 can call validation service (integration test with mocked ASS2)
- [ ] T162 [US6] Add test case to SupplierCategoryValidationTest: supplier can add new Tier-3 category and future validations use updated list
- [ ] T163 [US6] Run `php artisan test --filter=SupplierCategoryValidation` and ensure all pass

**Checkpoint**: User Story 6 complete - Category validation prevents unqualified suppliers from billing

---

## Phase 9: User Story 7 - Automated Notifications for Contractors and Compliance (Priority: P7)

**Goal**: Send automated notifications for key events to keep stakeholders informed

**Independent Test**: Trigger each notification event (assessment request sent, document approved, document rejected, etc.) and verify correct recipients receive notifications with correct content

**Value**: Improves user experience and reduces delays

### Backend Implementation

- [ ] T164 [P] [US7] Verify all events created in previous phases are registered in EventServiceProvider
- [ ] T165 [P] [US7] Verify all listeners created in previous phases are registered in EventServiceProvider
- [ ] T166 [US7] Create email template for SupplierRegisteredNotification in `resources/views/emails/supplier/registered.blade.php`
- [ ] T167 [US7] Create email template for AssessmentRequestNotification in `resources/views/emails/assessment/request.blade.php`
- [ ] T168 [US7] Create email template for DocumentApprovedNotification in `resources/views/emails/compliance/document-approved.blade.php`
- [ ] T169 [US7] Create email template for DocumentRejectedNotification in `resources/views/emails/compliance/document-rejected.blade.php` with rejection reason and remediation instructions
- [ ] T170 [US7] Create event `PaymentMilestoneReached` in `app/Events/Payment/PaymentMilestoneReached.php`
- [ ] T171 [US7] Create listener `NotifyRelevantPartiesOfPayment` in `app/Listeners/Payment/NotifyRelevantPartiesOfPayment.php`
- [ ] T172 [US7] Create notification `PaymentMilestoneNotification` in `app/Notifications/Payment/PaymentMilestoneNotification.php` with email template

### Tests

- [ ] T173 [US7] Create feature test `NotificationDeliveryTest` in `tests/Feature/Notifications/NotificationDeliveryTest.php` testing all notification events trigger correctly
- [ ] T174 [US7] Add test case to NotificationDeliveryTest: SupplierRegistered event sends email to supplier
- [ ] T175 [US7] Add test case to NotificationDeliveryTest: AssessmentRequestSent event sends email to contractor with request details
- [ ] T176 [US7] Add test case to NotificationDeliveryTest: DocumentApproved event sends email to contractor
- [ ] T177 [US7] Add test case to NotificationDeliveryTest: DocumentRejected event sends email to contractor with reason
- [ ] T178 [US7] Add test case to NotificationDeliveryTest: PaymentMilestoneReached event sends email to relevant parties
- [ ] T179 [US7] Run `php artisan test --filter=NotificationDelivery` and ensure all pass

**Checkpoint**: User Story 7 complete - All stakeholders receive automated notifications

---

## Phase 10: Polish & Cross-Cutting Concerns

**Purpose**: Final improvements, error handling, documentation

- [ ] T180 [P] Add error handling and user-friendly error messages across all controllers
- [ ] T181 [P] Add loading states for slow operations (PDF rendering, file uploads) in all Vue components
- [ ] T182 [P] Add empty states (no works, no documents, etc.) to all dashboard components
- [ ] T183 [P] Add success messages and confirmations for all user actions
- [ ] T184 Perform accessibility audit (WCAG AA compliance) on all pages
- [ ] T185 Test mobile/tablet responsive behavior for all pages
- [ ] T186 Run `vendor/bin/pint --dirty` across entire codebase
- [ ] T187 Run full test suite `php artisan test` and fix any failures
- [ ] T188 Create user guide for supplier onboarding in `docs/guides/supplier-onboarding.md`
- [ ] T189 Create user guide for compliance review in `docs/guides/compliance-review.md`
- [ ] T190 Create admin guide for managing criteria templates in `docs/guides/admin-criteria-templates.md`
- [ ] T191 Document API contracts between HMF/ASS1/ASS2 in `docs/api/integration-contracts.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundation (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-9)**: All depend on Foundation phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3 → P4 → P5 → P6 → P7)
- **Polish (Phase 10)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundation (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundation (Phase 2) - No dependencies on other stories
- **User Story 3 (P3)**: Can start after Foundation (Phase 2) - May reference US2 contractor data but independently testable
- **User Story 4 (P4)**: Can start after Foundation (Phase 2) - Displays data from US3 submissions
- **User Story 5 (P5)**: Can start after Foundation (Phase 2) - Operates on documents from US3/US4
- **User Story 6 (P6)**: Can start after Foundation (Phase 2) - Validates suppliers from US1
- **User Story 7 (P7)**: Can start after Foundation (Phase 2) - Notifies users from all previous stories

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundation tasks within each subsection (migrations, seeders, models, tests) marked [P] can run in parallel
- Once Foundation phase completes, all user stories can start in parallel (if team capacity allows)
- All implementation tasks within a user story marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members

---

## Implementation Strategy

### MVP First (User Story 1 Only)

**Timeline**: 3 weeks
**Tasks**: T001-T048 (48 tasks)

1. Complete Phase 1: Setup (7 tasks)
2. Complete Phase 2: Foundation (22 tasks) - CRITICAL, blocks all stories
3. Complete Phase 3: User Story 1 (15 tasks)
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo product supplier registration

### Incremental Delivery

**Full Feature Timeline**: 12 weeks

1. Week 1-2: Setup + Foundation → Foundation ready
2. Week 3: User Story 1 → Product supplier onboarding MVP deployed
3. Week 4-5: User Story 2 → Contractor onboarding deployed
4. Week 6: User Story 3 → Contractor quote submission deployed
5. Week 7-8: User Story 4 → Compliance dashboard deployed
6. Week 9-10: User Story 5 → Document approval workflow deployed
7. Week 11: User Story 6 → Category validation deployed
8. Week 12: User Story 7 + Polish → Full feature complete

### Parallel Team Strategy

With 3 developers:

1. Weeks 1-2: All developers complete Setup + Foundation together
2. Week 3+: Once Foundation complete:
   - Developer A: User Story 1 + User Story 4
   - Developer B: User Story 2 + User Story 5
   - Developer C: User Story 3 + User Story 6 + User Story 7
3. Stories integrate independently as they complete

---

## Parallel Execution Examples

### Foundation Phase - Models

```bash
# These can all be created in parallel:
T020: Create Supplier model
T021: Create Tier3Category model
T022: Create ModificationType model
T023: Create SupplierCredential model
T024: Create ComplianceCriteriaTemplate model
T025: Create DocumentApproval model
```

### User Story 1 - Frontend Components

```bash
# These can all be created in parallel:
T039: Create Register.vue page
T040: Create WizardProgress.vue component
T041: Create CategorySelector.vue component
T042: Create RegistrationSummary.vue component
T043: Create FileUpload.vue component
```

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability (US1, US2, US3, etc.)
- Each user story should be independently completable and testable
- Tests should be written alongside implementation, not batched at end
- Run `vendor/bin/pint --dirty` after each file creation
- Run `php artisan test --filter=[TestName]` after each story phase
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently

---

## References

- **Spec**: [spec.md](./spec.md)
- **Plan**: [plan.md](./plan.md)
- **IDEA-BRIEF**: [IDEA-BRIEF.md](./IDEA-BRIEF.md)
- **Document Requirements**: [DUMP/other_context/home-modifications-contractor-document-requirements.md](./DUMP/other_context/home-modifications-contractor-document-requirements.md)
