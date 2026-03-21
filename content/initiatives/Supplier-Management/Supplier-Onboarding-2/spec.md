---
title: "Feature Specification: Supplier Portal 2 (SOP2)"
---

> **[View Mockup](/mockups/supplier-onboarding-2/index.html)**{.mockup-link}

**Status**: Draft
**Epic**: TP-2294 | **Initiative**: Supplier Management (TP-1857)

---

## Overview

Supplier Portal 2 (SOP2) delivers enhanced self-service capabilities for suppliers to manage complex pricing scenarios across multiple locations and service types within the Trilogy Care Portal. The current supplier onboarding and pricing management processes are fragmented across website forms, Zoho CRM, and ad-hoc back-office creation from invoices, relying on spreadsheet-based workflows that introduce errors and delays.

SOP2 builds on the initial Supplier Onboarding work to deliver a comprehensive pricing matrix management system supporting direct and indirect pricing models, bulk operations, real-time validation, and seamless integration with bill matching and budget systems. The portal supports both new supplier onboarding (~15,000 suppliers) and mass recontracting of existing suppliers to Support at Home (SAH) compliant agreements, with conditional workflows that minimize steps for no-change suppliers while capturing new details where needed.

---

## User Scenarios & Testing

### User Story 1 - Self-Registration with ABN Validation (Priority: P1)

As a new Supplier, I want to self-register on the portal with my ABN so that my business details are automatically populated and validated without manual data entry.

**Acceptance Scenarios**:
1. **Given** a new supplier accesses the registration page, **When** they enter their ABN, **Then** the system queries the ABR API and auto-populates legal name, GST status, and entity type.
2. **Given** the ABN lookup returns valid data, **When** the supplier reviews the auto-populated fields, **Then** they can confirm or correct the details before proceeding.
3. **Given** the ABN already exists in the system, **When** a new user attempts to register with it, **Then** the system initiates a token-based ownership claim workflow for the existing supplier record.
4. **Given** the registration is partially complete, **When** the supplier closes the browser and returns later, **Then** they can resume from where they left off (save/resume capability).

### User Story 2 - Pricing Matrix Management (Priority: P1)

As a Supplier, I want to manage my pricing across multiple locations and service types with weekday/weekend/public holiday rates so that my pricing is accurately represented for all scenarios.

**Acceptance Scenarios**:
1. **Given** a supplier has multiple service types across multiple locations, **When** they access the pricing matrix, **Then** they see a grid with services as rows and rate types (weekday, Saturday, Sunday, public holiday, plus a fifth price type) as columns, filterable by location.
2. **Given** a supplier enters a price for one location, **When** they click "Apply to All", **Then** the same price is applied across all their locations for that service and rate type.
3. **Given** a supplier modifies pricing, **When** they submit changes, **Then** real-time validation prevents pricing errors (e.g., negative values, rates exceeding price caps) before submission.
4. **Given** bulk pricing needs to be updated, **When** the supplier uses bulk operations, **Then** multiple prices can be updated simultaneously with validation applied to each.

### User Story 3 - Bank Details Verification via EFTSure (Priority: P1)

As a Supplier, I want my bank details to be verified in real-time so that payment processing is accurate and secure.

**Acceptance Scenarios**:
1. **Given** a supplier enters bank account details (BSB, account number, account name), **When** the details are submitted, **Then** the system verifies them via EFTSure/EFT Shore integration in real-time.
2. **Given** bank verification succeeds, **When** the result is displayed, **Then** a verified badge is shown on the bank details section.
3. **Given** bank verification fails, **When** the result is displayed, **Then** the supplier sees a clear error message and can correct the details.
4. **Given** EFTSure integration is unavailable, **When** the supplier submits bank details, **Then** the system falls back to manual verification with a notification to the compliance team.

### User Story 4 - Conditional Recontracting Workflow (Priority: P1)

As an existing Supplier, I want to be guided through a streamlined recontracting process for SAH compliance so that I can update my agreement with minimal effort if nothing has changed.

**Acceptance Scenarios**:
1. **Given** bulk recontracting invitations are triggered, **When** an existing supplier receives the invitation email, **Then** they are directed to a portal page showing their current agreement details and what needs updating.
2. **Given** the supplier's services and pricing have not changed, **When** they begin recontracting, **Then** they are presented with a minimal-step pathway: review details, accept new T&C, and confirm.
3. **Given** the supplier's services or pricing have changed, **When** they begin recontracting, **Then** they are directed to a partial onboarding flow to capture updated services, pricing, and compliance documents.
4. **Given** a supplier has not completed recontracting within the configured timeframe, **When** the reminder interval passes, **Then** automated reminder/escalation emails are sent.

### User Story 5 - Compliance Document Upload with Conditional Requests (Priority: P1)

As a Supplier, I want to upload only the compliance documents relevant to my business type and services so that I am not burdened with unnecessary paperwork.

**Acceptance Scenarios**:
1. **Given** a supplier is an organisation (not sole trader), **When** they reach the compliance document step, **Then** they see organisation-specific document requirements (e.g., ASIC registration, workers compensation insurance).
2. **Given** a supplier is a sole trader, **When** they reach the compliance document step, **Then** they see sole-trader-specific requirements (e.g., professional indemnity, police check).
3. **Given** a supplier's documents have been previously verified and are not expired, **When** they go through recontracting, **Then** those documents are pre-populated and marked as current; only expired or missing documents require upload.
4. **Given** targeted statutory declarations are configured, **When** a supplier meets the criteria, **Then** only relevant declarations are requested.

### User Story 6 - Internal Creation from Invoice Data (Priority: P2)

As an Operations Staff member, I want to create a supplier record from invoice data when an unregistered supplier submits a bill so that onboarding is initiated automatically.

**Acceptance Scenarios**:
1. **Given** an invoice is received from an unrecognised supplier, **When** staff initiates supplier creation from the invoice, **Then** a new supplier record is created with data extracted from the invoice (ABN, name, services).
2. **Given** a supplier record is created from an invoice, **When** the supplier is notified, **Then** they receive an email invitation to complete their onboarding via the self-registration wizard.

### Edge Cases

- **Duplicate ABN detection**: System identifies and handles ABN duplicates, including multi-trading-name suppliers using the same ABN.
- **Complex pricing scenarios**: Multi-location suppliers with different pricing per location/service combination are supported via the pricing matrix with per-cell override capability.
- **EFTSure timeout**: If EFTSure verification times out, the system queues the verification and allows the supplier to proceed, with bank details marked as "Pending Verification".
- **Incomplete recontracting at cutover**: Suppliers who have not completed recontracting by the SAH cutover date are flagged and can continue the process, but their services may be restricted.
- **Save/resume data expiry**: Partially completed registrations are retained for a configurable period (e.g., 30 days) before being purged.

---

## Functional Requirements

- **FR-001**: System MUST support multi-step self-registration wizard with save/resume capability.
- **FR-002**: System MUST integrate with ABR API for ABN lookup and GST validation during registration.
- **FR-003**: System MUST support token-based ownership claim for existing supplier records.
- **FR-004**: System MUST capture mandatory SAH compliance data: legal name, ABN, GST status, services (mapped to SAH service list), and pricing for five price types per service per location.
- **FR-005**: System MUST provide a pricing matrix UI supporting multi-rate (weekday/Sat/Sun/PH + fifth type) and multi-location pricing with "Apply to All" function.
- **FR-006**: System MUST support bulk pricing operations with real-time validation.
- **FR-007**: System MUST validate pricing against configurable price caps and business rules before submission.
- **FR-008**: System MUST integrate with EFTSure/EFT Shore for real-time bank detail verification with manual fallback.
- **FR-009**: System MUST support conditional compliance document requests based on supplier type (organisation vs sole trader) and service type.
- **FR-010**: System MUST support targeted statutory declarations to reduce administrative burden.
- **FR-011**: System MUST support bulk recontracting invitations with conditional pathways (minimal steps for no-change vs partial onboarding for changes).
- **FR-012**: System MUST support automated compliance refresh during recontracting (only request expired or missing documents).
- **FR-013**: System MUST store pre-SAH and SAH agreements with version control for audit and legal reference.
- **FR-014**: System MUST support automated reminder/escalation workflows for incomplete onboarding and recontracting.
- **FR-015**: System MUST support internal supplier creation from invoice data with automated onboarding invitation.
- **FR-016**: System MUST integrate pricing data with bill matching and budget calculation systems.
- **FR-017**: System SHOULD bridge to Zoho CRM for audit workflows until portal-native tools are complete.

---

## Key Entities

- **Supplier**: Core entity representing a service provider organisation or sole trader. Key fields: `id`, `abn`, `legal_name`, `trading_name`, `gst_status`, `entity_type` (organisation/sole_trader), `registration_status`, `onboarding_step`, `eftsure_status`, standard audit fields.
- **Supplier Location**: A physical location where a supplier operates. Fields: `id`, `supplier_id` (FK), `address`, `region`, `active`.
- **Pricing Matrix Entry**: Pricing for a specific service at a specific location. Fields: `id`, `supplier_id` (FK), `location_id` (FK), `service_type_id` (FK), `weekday_rate`, `saturday_rate`, `sunday_rate`, `public_holiday_rate`, `fifth_rate`, `effective_from`, `effective_to`.
- **Supplier Agreement**: Legal agreement version. Fields: `id`, `supplier_id` (FK), `agreement_type` (pre_sah/sah), `version`, `accepted_at`, `terms_content_hash`.
- **Compliance Document**: Uploaded document with type, status, and expiry tracking. Conditional per entity type and service type.
- **Onboarding Session**: Tracks registration/recontracting progress with save/resume capability. Fields: `id`, `supplier_id` (FK), `session_type` (new/recontract), `current_step`, `data` (JSON), `started_at`, `completed_at`, `expires_at`.

---

## Success Criteria

### Measurable Outcomes

- **SC-001**: Supplier pricing management time reduced by 50% through bulk operations and self-service.
- **SC-002**: Billing errors from pricing reduced by 40-50% through real-time validation.
- **SC-003**: Coordinator pricing update overhead reduced by 60%.
- **SC-004**: Zero billing disputes from pricing inconsistencies post-launch.
- **SC-005**: 50% reduction in time to onboard or recontract a supplier.
- **SC-006**: 95% of suppliers fully compliant before SAH go-live.

---

## Assumptions

- Supplier pricing requirements (including direct/indirect pricing models) are finalized prior to development.
- EFTSure integration is available and stable for production use.
- Database pricing logic has been validated and is ready for implementation.
- Direct and indirect pricing models are clearly defined and documented.
- SAH compliance rules and document requirements are finalized.
- Supplier data cleansing is completed before triggering onboarding/recontracting.
- Accurate supplier contact data is available for bulk recontracting invitations.

---

## Dependencies

- Multi-rate and multi-location pricing logic must be fully operational.
- Miro Auth Flow must be implemented to enable conditional workflow logic.
- ABN duplicate issue resolution must be completed.
- ABR API for ABN lookup and GST validation.
- EFTSure/EFT Shore API for bank verification.
- [Supplier Pricing (PRI)](/initiatives/Supplier-Management/Supplier-Pricing/spec) for pricing model definitions.
- [Supplier Service Verification Features (SVF)](/initiatives/Supplier-Management/Supplier-Service-Verification-Features/spec) for service-level compliance integration.
- Zoho CRM for interim audit workflow bridging.

---

## Out of Scope

- Supplier search engine or marketplace functionality.
- Automated supplier matching/recommendation for care partners.
- Financial penalty or contract termination workflows.
- Risk-based audit model implementation (deferred to SAP epic).
- Mobile-native application for suppliers (web portal only).
- Integration with accounting systems beyond MYOB.


## Clarification Outcomes

### Q1: [Scope] Is SOP2 a new frontend application or an extension of the current portal?
**Answer:** The codebase reveals SOP2 is a V2 API-backed supplier portal ALREADY under development. The `domain/Supplier/Routes/v2/` routes, `domain/Supplier/Http/Controllers/V2/` controllers, and `domain/Supplier/Actions/V2/` actions form a comprehensive V2 layer. The Vue frontend exists at `resources/js/Pages/Suppliers/` with pages for Dashboard, Bills, Prices, Documents, Team, Locations, Agreements, BusinessDetails, Clients, and Verification. SOP2 extends the EXISTING portal with enhanced onboarding (multi-step wizard), pricing matrix management, bank verification, and recontracting workflows.

### Q2: [Dependency] Does SOP2 deliver the common supplier auth infrastructure?
**Answer:** Yes. The V2 auth routes (`domain/Supplier/Routes/v2/authRoutes.php`) and controllers (`AuthController`, `SupplierContextController`, `InvitationController`) provide: login, token refresh, supplier context switching (for multi-supplier users), and invitation-based registration. The `SupplierApiRefreshToken` model handles API auth. The `SupplierPortalRoleEnum` defines roles: `ORGANISATION_ADMINISTRATOR`, `SUPPLIER_ADMINISTRATOR`, `SUPPLIER`, `TEAM_MEMBER`. Multiple epics (SBS, HMF, SVF, Express Pay) depend on this auth layer, which is already built.

### Q3: [Data] What data is captured in v2 that v1 misses?
**Answer:** Based on codebase analysis, v2 adds: (1) Multi-step onboarding with save/resume (`SupplierOnboardingDraft` model, `OnboardingStepEnum`: BUSINESS_DETAILS → LOCATIONS → PRICING → DOCUMENTS → AGREEMENTS), (2) Pricing matrix with 5 rate types per service per location (`OrganisationPrice`), (3) Bank verification via EFTSure (`SupplierBankVerification`, `EftSureService`), (4) Document management with types and scopes (`SupplierDocument`, `DocumentTypeEnum`, `DocumentScopeEnum`), (5) Agreement versioning (`SupplierAgreement`, `AgreementVersion`), (6) Service delivery model (`ServiceDeliveryModelEnum`: DIRECT_PROVIDER, SUBCONTRACTOR, BOTH). V1 was a simple Zoho-backed registration; v2 is a full self-service portal.

### Q4: [Edge Case] How does SOP2 handle existing v1 suppliers?
**Answer:** US4 (Conditional Recontracting) explicitly addresses this. Existing suppliers receive bulk recontracting invitations. The "conditional pathway" means: if nothing changed → minimal steps (review + accept T&C), if services/pricing changed → partial onboarding flow. The codebase has `MigrationController` and `MigrateSupplierAction` in V2, confirming a migration pathway exists. The `PortalStageTransitionService` manages stage transitions. `PortalStageEnum` likely defines the progression.

### Q5: [Integration] Should SOP2 and Supplier Org Identity (SOI) be merged?
**Answer:** No. They address different problems. SOP2 focuses on ONBOARDING AND PRICING (the workflow of getting a supplier registered, priced, and compliant). SOI focuses on IDENTITY AND TEAM (ABN deduplication, multi-user teams, legal identity display). They share the same underlying models (`Organisation`, `Supplier`, `OrganisationWorker`) but have distinct user stories. SOI's US1 (join existing org) prevents duplicates during the registration flow that SOP2 defines. They should be coordinated but not merged.

### Q6: [Data] The pricing matrix — how does it relate to the Supplier Pricing (PRI) spec?
**Answer:** PRI defines the pricing MODEL (direct/indirect costs, price caps, bill matching integration, audit trails). SOP2 provides the pricing UI (matrix editor, bulk operations, Apply to All). The `OrganisationPrice` model stores per-service per-location pricing. The `PriceCap` model enforces limits. SOP2's FR-007 (validate against price caps) uses PRI's cap data. They are complementary: PRI = data model + business rules, SOP2 = self-service UI for suppliers to manage their prices.

### Q7: [Dependency] EFTSure integration — is this built?
**Answer:** Yes. `EftSureService` (`domain/Supplier/Services/V2/EftSureService.php`) and `EftSureWebhookController` (`domain/Supplier/Http/Controllers/V2/EftSureWebhookController.php`) exist. The `SupplierBankVerification` model stores verification results. `BankVerificationStatusEnum` tracks status. The V2 actions include `CreateBankDetailAction`, `UpdateBankDetailAction`, and `SetPrimaryBankDetailAction`. EFTSure integration is already implemented.

### Q8: [Scope] The document upload conditional logic — how complex is it?
**Answer:** FR-009 requires conditional documents based on supplier type (organisation vs sole trader) and service type. The codebase has `DocumentRequirementService` (`domain/Supplier/Services/V2/DocumentRequirementService.php`) which likely implements this conditional logic. The `DocumentScopeEnum` provides scoping (organisation-level documents vs service-specific documents). `DocumentTypeEnum` has 7 types currently. The conditional logic maps: organisation → require WORKERS_COMP; sole trader → require POLICE_CHECK, PROFESSIONAL_INDEMNITY.

### Q9: [Performance] The pricing matrix with "Apply to All" — what is the expected data volume?
**Answer:** A supplier with 10 locations and 20 service types has 200 service-location combinations × 5 rate types = 1,000 price cells. "Apply to All" updates all locations for one service-rate combination (10 cells at once). With real-time validation (FR-006), each update validates against price caps. This is manageable but the UI must batch validation requests rather than validating each cell individually.

### Q10: [Edge Case] Save/resume for registration — how long are drafts retained?
**Answer:** Edge case: "Partially completed registrations are retained for a configurable period (e.g., 30 days) before being purged." The `SupplierOnboardingDraft` model stores draft data. The `CheckStaleOnboardingsCommand` (untracked file in git status) confirms a scheduled command exists for purging stale drafts. This is well-handled.

### Q11: [Compliance] SAH compliance — what specific data is mandatory?
**Answer:** FR-004: "legal name, ABN, GST status, services (mapped to SAH service list), and pricing for five price types per service per location." The five rate types are: weekday, Saturday, Sunday, public holiday, and a configurable fifth type. This aligns with SAH's rate structure requirements. The recontracting workflow (US4) ensures existing suppliers update to SAH-compliant agreements before the cutover.

## Refined Requirements

1. **Coordination with SOI**: SOP2's registration flow should check for existing ABN (SOI US1) before creating a new organisation. SOP2 owns the registration wizard; SOI adds the "join existing org" fork at the ABN entry step.

2. **AC for US3**: Given EFTSure verification times out, When the supplier submits bank details, Then the system queues verification and shows "Pending Verification" status, allowing the supplier to continue onboarding. The bank details are marked as unverified until the async verification completes.

3. **NFR**: Pricing matrix must support up to 50 locations × 100 service types × 5 rate types (25,000 cells) without UI performance degradation. Use virtual scrolling or pagination for large matrices.
