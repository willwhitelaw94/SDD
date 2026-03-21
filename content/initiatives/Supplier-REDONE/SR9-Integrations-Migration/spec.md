---
title: "Feature Specification: Integrations & Migration"
---

# Feature Specification: Integrations & Migration

**Feature Branch**: `sr9-integrations-migration`
**Created**: 2026-03-19
**Author**: Will Whitelaw
**Status**: Draft
**Dependency**: All epics (SR0-SR8). This workstream runs throughout the initiative timeline.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Zoho CRM Sync Continues Working Through the New API Layer (Priority: P1)

The existing two-way sync between the supplier portal and Zoho CRM (via webhooks and SyncSupplierToZohoJob) continues functioning without disruption when suppliers are managed through the new API. Supplier profile changes, stage updates, and contact information flow bidirectionally regardless of whether the supplier is using the legacy Inertia portal or the new standalone frontend.

**Why this priority**: Zoho CRM sync is active in production today. Any disruption means the sales pipeline goes stale and follow-up activities are missed. This is the highest-risk integration.

**Independent Test**: Can be tested by updating a supplier profile through the new API and verifying the change propagates to Zoho CRM within the expected SLA, and vice versa.

**Acceptance Scenarios**:

1. **Given** a supplier updates their profile through the new API, **When** the update is saved, **Then** the SyncSupplierToZohoJob fires and the change is reflected in Zoho CRM within the existing sync SLA.
2. **Given** a Zoho CRM webhook triggers for a supplier update, **When** the webhook is received, **Then** the portal processes it and updates the supplier record regardless of which frontend the supplier is using.
3. **Given** a supplier's stage changes (e.g., from Pending to Approved), **When** the stage update is persisted, **Then** the corresponding Zoho CRM record is updated with the new stage.
4. **Given** the new API is deployed alongside the legacy portal, **When** both systems process supplier updates concurrently, **Then** no data conflicts or duplicate sync jobs occur.

---

### User Story 2 - MYOB Vendor Mapping Remains Intact During Migration (Priority: P1)

The MYOB vendor ID mapping (myob_vendor_id on Supplier and BankDetail) continues to work correctly during and after migration. Supplier payments processed through MYOB are not disrupted by the portal rebuild.

**Why this priority**: MYOB integration is critical for supplier payments. A broken mapping stops payment runs and creates accounting reconciliation issues.

**Independent Test**: Can be tested by verifying that a supplier's myob_vendor_id is preserved through the migration process and that bank detail changes through the new API correctly propagate to MYOB.

**Acceptance Scenarios**:

1. **Given** a supplier with an existing myob_vendor_id, **When** their profile is migrated to the two-tier model, **Then** the myob_vendor_id remains unchanged on both the Supplier and BankDetail records.
2. **Given** a supplier updates their bank details through the new portal, **When** the update is saved via the API, **Then** the MYOB vendor mapping is updated with the new bank details.
3. **Given** a new supplier entity is created under an existing organisation, **When** bank details are added, **Then** a new MYOB vendor record is provisioned and the myob_vendor_id is stored.
4. **Given** a payment run is executed in MYOB, **When** it references supplier bank details, **Then** the mapping resolves correctly for both migrated and newly created suppliers.

---

### User Story 3 - EFTSure Bank Verification Works with New Bank Detail Flows (Priority: P1)

EFTSure bank detail verification (green/yellow/red status) continues to function for all bank detail submissions, whether through the legacy portal or the new API. New bank detail flows introduced in SR2 (Profile Management) trigger EFTSure verification automatically.

**Why this priority**: EFTSure protects against payment fraud. Bypassing verification for new flows creates a security and financial risk.

**Independent Test**: Can be tested by submitting new bank details through the new API and verifying the EFTSure verification status is returned and stored.

**Acceptance Scenarios**:

1. **Given** a supplier submits new bank details through the new API, **When** the submission is processed, **Then** an EFTSure verification check is triggered automatically and the status (green/yellow/red) is stored.
2. **Given** a supplier's bank details have a yellow or red EFTSure status, **When** a staff member views the supplier detail page, **Then** the verification status is clearly displayed with appropriate warnings.
3. **Given** a supplier resubmits corrected bank details after a red verification, **When** the new details are submitted, **Then** a fresh EFTSure check is triggered and the status is updated.
4. **Given** the EFTSure service is temporarily unavailable, **When** bank details are submitted, **Then** the submission is queued for verification retry and the status shows as "pending verification".

---

### User Story 4 - Existing Supplier Profiles Are Migrated to Two-Tier Role Model (Priority: P1)

All ~13,000 existing supplier profiles are migrated to the two-tier role model without schema changes. Single-supplier organisations have their current owner auto-assigned as Organisation Administrator. Multi-supplier organisations (manually created) are reconciled into proper hierarchies with manual review for ambiguous cases.

**Why this priority**: Without role migration, existing suppliers cannot use the new portal features. This is the prerequisite for gradual rollout.

**Independent Test**: Can be tested by running the migration on a subset of profiles and verifying that Organisation Administrator roles are correctly assigned and multi-supplier hierarchies are properly formed.

**Acceptance Scenarios**:

1. **Given** a single-supplier organisation, **When** the migration script runs, **Then** the current owner is assigned the Organisation Administrator role and no other data changes.
2. **Given** a multi-supplier organisation that was manually created, **When** the migration script runs, **Then** the system identifies the common owner across entities and assigns them as Organisation Administrator, linking all entities under one organisation.
3. **Given** a multi-supplier organisation with ambiguous ownership (different owners per entity), **When** the migration script runs, **Then** the case is flagged for manual review with a report detailing the ambiguity.
4. **Given** a migrated supplier, **When** they log in after migration, **Then** their existing credentials work, their data is intact, and they see the appropriate view for their assigned role.
5. **Given** the migration has completed, **When** a report is generated, **Then** it shows the total profiles processed, Organisation Administrator assignments, multi-supplier reconciliations, and flagged-for-review cases.

---

### User Story 5 - Suppliers Are Gradually Routed to the New Portal via Feature Flags (Priority: P1)

New supplier registrations are routed to the new standalone portal. Existing suppliers continue using the legacy Inertia portal until they are migrated in waves. Feature flags control which portal a supplier sees, and a kill switch can revert any supplier to the legacy portal.

**Why this priority**: The parallel frontend strategy is the safety net for the entire initiative. Without it, deploying the new portal is an all-or-nothing cutover with no fallback.

**Independent Test**: Can be tested by toggling the feature flag for a specific supplier and verifying they are routed to the correct portal, then activating the kill switch and verifying the fallback works.

**Acceptance Scenarios**:

1. **Given** a new supplier completing registration, **When** the new portal feature flag is active for new registrations, **Then** they are directed to the new standalone portal.
2. **Given** an existing supplier who has not been migrated, **When** they log in, **Then** they are directed to the legacy Inertia portal as usual.
3. **Given** a supplier whose feature flag has been toggled to the new portal, **When** they log in, **Then** they are directed to the new standalone portal with their data intact.
4. **Given** a supplier on the new portal experiencing issues, **When** a staff member activates the kill switch for that supplier, **Then** the supplier is immediately routed back to the legacy Inertia portal on their next request.
5. **Given** a global kill switch activation, **When** all suppliers are reverted, **Then** every supplier is routed to the legacy portal within 30 seconds and no data is lost.

---

### User Story 6 - Existing Users Receive API Tokens Transparently (Priority: P2)

Existing supplier users who log in after the migration receive API tokens automatically — no manual token generation, no password reset, no re-registration. The token is provisioned on first login through the new system and works for subsequent API-authenticated sessions.

**Why this priority**: Transparent token provisioning removes friction from migration. Without it, each supplier would need a manual onboarding step that does not scale to ~13,000 profiles.

**Independent Test**: Can be tested by logging in as an existing user after migration and verifying that API tokens are issued without any additional steps.

**Acceptance Scenarios**:

1. **Given** an existing user who logs in after migration, **When** authentication succeeds, **Then** API tokens (access + refresh) are issued alongside the session — transparent to the user.
2. **Given** a user who already has API tokens from a previous login, **When** they log in again, **Then** existing valid tokens are reused or refreshed — no duplicate token proliferation.
3. **Given** a user logging in via WorkOS SSO, **When** SSO authentication succeeds, **Then** API tokens are issued identically to password-authenticated users.
4. **Given** a user whose API tokens have expired, **When** they log in via the legacy portal, **Then** new tokens are provisioned automatically.

---

### User Story 7 - AHPRA and Banning Order Register Checks Are Automated (Priority: P2)

The system automatically checks the AHPRA register for suspension or conditions, the NDIS banning register, the aged care banning register, and AFRA for banning orders. Results are stored against the supplier profile and alerts are raised for staff when issues are detected.

**Why this priority**: These checks are currently manual, creating a compliance gap. Automation reduces risk and frees staff time. Not blocking for the portal rebuild but adds significant value.

**Independent Test**: Can be tested by running automated checks against known test cases (suppliers with and without issues) and verifying correct detection and alerting.

**Acceptance Scenarios**:

1. **Given** a supplier with an AHPRA-registered practitioner, **When** the automated check runs, **Then** the system queries the AHPRA register and stores the current status (registered, suspended, conditions applied).
2. **Given** a supplier whose practitioner has a suspension on AHPRA, **When** the check detects the suspension, **Then** an alert is raised for staff and the supplier profile is flagged.
3. **Given** a supplier name appearing on the NDIS banning register, **When** the automated check detects the match, **Then** an alert is raised and the supplier is flagged for immediate staff review.
4. **Given** the automated checks run on a schedule, **When** a check completes for all active suppliers, **Then** a summary report is generated showing total checks, issues found, and suppliers flagged.
5. **Given** a register API is temporarily unavailable, **When** the check fails, **Then** the failure is logged, the supplier is marked as "check pending", and a retry is scheduled.

---

### User Story 8 - Laravel Scout Search Works Across Both Portals (Priority: P3)

Supplier search via Laravel Scout and Elasticsearch returns consistent results regardless of which portal the search originates from. The search index reflects the two-tier model (organisation and supplier entity data) and stays synchronised as suppliers are migrated.

**Why this priority**: Search is foundational but already works. This story ensures it remains functional through the migration and understands the new data model.

**Independent Test**: Can be tested by searching for a supplier from both the legacy and new portal, verifying identical results that include organisation-level metadata.

**Acceptance Scenarios**:

1. **Given** a search query submitted through the new API, **When** the query matches a supplier, **Then** the results include the supplier's organisation name, ABN, and entity name — consistent with legacy portal results.
2. **Given** a supplier that has been migrated to the two-tier model, **When** their profile is updated, **Then** the search index is updated to reflect the organisation hierarchy.
3. **Given** a search for an ABN with multiple supplier entities, **When** results are returned, **Then** all entities under that ABN appear in the results.

---

### Edge Cases

- What happens when a Zoho webhook arrives for a supplier that is mid-migration (being moved to the two-tier model)? The webhook should be queued and processed after the migration transaction completes — no data should be lost or applied to a stale record.
- What happens when the same supplier updates their profile simultaneously on the legacy and new portal during the parallel-running period? The last-write-wins approach applies, but the system should log conflicting concurrent updates for staff review.
- What happens when the EFTSure service returns an ambiguous status for a bank detail that was valid under the old system? The existing verification status is preserved, and a re-check is scheduled rather than overwriting the green status with an ambiguous one.
- What happens when a multi-supplier organisation migration discovers a circular ownership reference (user A owns Supplier 1 and is a team member of Supplier 2, while user B owns Supplier 2 and is a team member of Supplier 1)? The migration flags both entities for manual review and does not auto-assign Organisation Administrator.
- What happens when a feature flag routes a supplier to the new portal but their Organisation Administrator has not yet been provisioned with API tokens? The system provisions tokens on-demand during the first authenticated request — the supplier should not encounter an error.
- What happens when the kill switch is activated while a supplier is mid-transaction on the new portal (e.g., submitting a bill)? The transaction completes on the new portal's API — the kill switch only affects routing for the next request, not in-flight operations.

## Requirements *(mandatory)*

### Functional Requirements

**Integration Continuity**

- **FR-001**: System MUST maintain bidirectional Zoho CRM sync (via webhooks and SyncSupplierToZohoJob) for all supplier profile changes, stage updates, and contact updates — regardless of which portal the change originates from.
- **FR-002**: System MUST preserve all existing myob_vendor_id mappings on Supplier and BankDetail records during migration, with zero disruption to MYOB payment runs.
- **FR-003**: System MUST trigger EFTSure bank verification for all bank detail submissions through the new API, with the same green/yellow/red status tracking as the legacy portal.
- **FR-004**: System MUST queue integration operations (Zoho sync, EFTSure check, MYOB updates) for retry when the external service is temporarily unavailable, with configurable retry intervals.
- **FR-005**: System MUST prevent duplicate sync operations when the same supplier update triggers from both the legacy event system and the new API event system during the parallel-running period. *(Clarified: satisfied by the existing `ShouldBeUnique` constraint on `SyncSupplierToZohoJob`, keyed by supplier ID. No additional deduplication layer needed.)*

**Data Migration**

- **FR-006**: System MUST provide a migration script that assigns the Organisation Administrator role to existing single-supplier organisation owners without altering any other profile data.
- **FR-007**: System MUST provide a migration script that identifies multi-supplier organisations by common ABN/owner and reconciles them into proper hierarchies, flagging ambiguous cases for manual review.
- **FR-008**: System MUST generate a migration report detailing: total profiles processed, Organisation Administrator assignments made, multi-supplier reconciliations completed, and cases flagged for manual review.
- **FR-009**: System MUST support incremental migration — processing suppliers in batches rather than requiring a single atomic migration of all ~13,000 profiles. *(Clarified: Artisan command with `--batch-size`/`--offset` flags. A `role_migrated_at` timestamp on suppliers tracks progress and ensures idempotent re-runs.)*
- **FR-010**: System MUST preserve all existing supplier data (bank details, locations, pricing, documents, agreements, workers, bills) unchanged during role migration.

**Frontend Migration Strategy**

- **FR-011**: System MUST support parallel running of the legacy Inertia portal and the new standalone frontend. *(Clarified: routing is handled by Laravel middleware + Pennant feature flag, not reverse proxy config. Both frontends hit the same Laravel API; the middleware redirects Inertia page requests based on the supplier's feature flag state.)*
- **FR-012**: System MUST use feature flags (Laravel Pennant) to control which portal a supplier is routed to, with per-supplier granularity.
- **FR-013**: System MUST route new registrations to the new portal when the feature flag is active, while existing suppliers default to the legacy portal until explicitly migrated.
- **FR-014**: System MUST provide a kill switch that reverts any supplier (or all suppliers) to the legacy Inertia portal within 30 seconds of activation. *(Clarified: kill switch is a Pennant override — `Feature::deactivateForEveryone()` for global, `Feature::for($supplier)->deactivate()` for per-supplier. No infrastructure-level switch needed.)*
- **FR-015**: System MUST ensure the kill switch does not interrupt in-flight transactions — only subsequent requests are rerouted.

**Token Provisioning**

- **FR-016**: System MUST provision API tokens (access + refresh) transparently to existing users on their first login after migration, with no manual steps required.
- **FR-017**: System MUST support token provisioning for both password-authenticated and WorkOS SSO-authenticated users identically.
- **FR-018**: System MUST prevent duplicate token proliferation — reuse or refresh existing valid tokens rather than issuing new ones on each login.

**Compliance Register Automation**

- **FR-019**: System MUST support automated checking of the AHPRA register for practitioner suspension, conditions, and current registration status. *(Clarified: SR9 delivers the framework — model, job skeleton, schedule entry. Actual AHPRA register connector delivered when API access is confirmed.)*
- **FR-020**: System MUST support automated checking of the NDIS banning register, aged care banning register, and AFRA for supplier banning orders. *(Clarified: same stub-then-connector approach as FR-019. Each register connector is a separate deliverable.)*
- **FR-021**: System MUST raise alerts for staff when a compliance register check detects an issue, and flag the supplier profile accordingly. *(Delivered in SR9 as part of the framework.)*
- **FR-022**: System MUST run compliance register checks on a configurable schedule and support on-demand checks triggered by staff. *(Delivered in SR9 as part of the framework.)*
- **FR-023**: System MUST log all compliance register check results (including clean results) for audit purposes. *(Delivered in SR9 as part of the framework.)*

**Search**

- **FR-024**: System MUST maintain Laravel Scout + Elasticsearch search index synchronisation across both portals during the parallel-running period.
- **FR-025**: System MUST update the search index to include organisation-level metadata (organisation name, hierarchy) as suppliers are migrated to the two-tier model.

### Key Entities

- **SyncSupplierToZohoJob**: The existing queued job that synchronises supplier data to Zoho CRM. Must fire for changes originating from both the legacy and new portals.
- **MYOB Vendor Mapping**: The myob_vendor_id stored on Supplier and BankDetail models, linking portal records to MYOB vendor records for payment processing.
- **EFTSure Verification Status**: The green/yellow/red bank detail verification result stored against bank detail records, used to protect against payment fraud.
- **Migration Script**: Artisan command(s) that assign Organisation Administrator roles, reconcile multi-supplier hierarchies, and generate migration reports.
- **Feature Flag (Portal Routing)**: A Laravel Pennant feature flag that controls whether a specific supplier is routed to the legacy Inertia portal or the new standalone frontend.
- **Kill Switch**: A system-wide or per-supplier override that immediately routes suppliers back to the legacy portal, bypassing the feature flag.
- **Compliance Register Check**: An automated job that queries AHPRA, NDIS, aged care, and AFRA registers for supplier compliance issues.
- **Migration Report**: A generated document summarising migration progress, role assignments, hierarchy reconciliations, and manual review cases.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Zero Zoho CRM sync failures caused by the portal migration — all supplier changes continue to propagate bidirectionally.
- **SC-002**: Zero MYOB payment run failures caused by broken vendor ID mappings during or after migration.
- **SC-003**: 100% of bank detail submissions through the new API trigger EFTSure verification with the correct status stored.
- **SC-004**: 100% of single-supplier organisation owners are correctly assigned Organisation Administrator role by the migration script.
- **SC-005**: Multi-supplier organisation reconciliation identifies and flags 100% of ambiguous cases for manual review — zero silent misassignments.
- **SC-006**: Feature flag routing correctly directs suppliers to the intended portal with zero mis-routes during testing.
- **SC-007**: Kill switch reverts supplier routing within 30 seconds of activation with zero data loss.
- **SC-008**: 100% of existing users receive API tokens on first post-migration login with zero manual intervention.
- **SC-009**: AHPRA and banning order register checks detect known test cases with 100% accuracy.
- **SC-010**: Search results are consistent across both portals during the parallel-running period — zero discrepancies in results for identical queries.
- **SC-011**: Migration report accurately reflects the state of all ~13,000 profiles post-migration.

## Clarifications

### Session 2026-03-19

**Q1: How should the new v2 API actions trigger Zoho sync without duplicating dispatches from the legacy action classes?**

Today, `SyncSupplierToZohoJob::dispatch()` is called imperatively from 4 domain Action classes (`UpdateSupplierContactInfoAction`, `UpdateSupplierPaymentInfoAction`, `UpdateSupplierOrgStructureAction`, `RegisterSupplierWithPaymentDetails`) and 1 controller (`SupplierCompanyDetailsController`). The job itself uses `ShouldBeUnique` keyed by supplier ID, which already prevents concurrent duplicates — but it does not prevent two sequential dispatches from legacy + API paths updating the same supplier seconds apart.

Options considered:
- **A) Keep imperative dispatch in both legacy and new action classes, rely on ShouldBeUnique** — Simplest. The existing `uniqueId()` on `SyncSupplierToZohoJob` already deduplicates by supplier ID. If both legacy and API paths dispatch the same job within the uniqueness window, only one runs. No refactoring needed.
- B) Refactor to model observer/event-driven dispatch — Cleaner long-term but touches 5+ files in production code during a migration. Risky refactor for zero user-facing benefit.
- C) Add a debounce/coalesce layer — Over-engineered for a temporary parallel-running period.

**Decision: Option A — keep imperative dispatch, rely on ShouldBeUnique.** The new v2 API action classes will dispatch `SyncSupplierToZohoJob` the same way legacy actions do. The existing `ShouldBeUnique` constraint on supplier ID is sufficient deduplication for the parallel-running period. No refactoring of existing action classes. FR-005 is satisfied by the existing job uniqueness mechanism.

---

**Q2: Where should the portal routing decision live — reverse proxy level, Laravel middleware, or login redirect?**

FR-011 says "reverse proxy configuration" and FR-012 says "Laravel Pennant feature flags". These need to work together. The question is: does the routing happen before the request hits Laravel (nginx/Caddy level) or inside Laravel?

Options considered:
- A) Reverse proxy routes based on a cookie/header set by Laravel — Adds operational complexity with proxy config + cookie synchronisation.
- **B) Laravel middleware checks Pennant flag on authenticated supplier requests and redirects to the appropriate frontend** — All logic stays in Laravel where Pennant lives. The standalone frontend calls the same API regardless. The middleware only controls which *frontend* the user sees, not which API they hit.
- C) Login controller redirect only — Misses cases where a user bookmarks a direct URL or is mid-session when their flag changes.

**Decision: Option B — Laravel middleware with Pennant flag check.** A new middleware checks the `SupplierNewPortal` Pennant feature for the authenticated user's supplier. If active, it redirects Inertia page requests to the standalone frontend URL. API requests are unaffected (both portals hit the same API). The kill switch is implemented as a Pennant override that forces the flag to `false`. FR-011 is simplified: no reverse proxy routing logic needed — both frontends are served from different origins but hit the same Laravel API. FR-014 kill switch = `Feature::deactivateForEveryone(SupplierNewPortal::class)` or per-supplier `Feature::for($supplier)->deactivate(SupplierNewPortal::class)`.

---

**Q3: For the ~13,000 profile migration, should the Artisan command run as a single batch or support resumable cursor-based processing?**

FR-009 requires incremental migration. The question is the granularity and resumability model.

Options considered:
- A) Single Artisan command processes all records in chunked queries — Simple but if it fails mid-run, no way to resume without re-processing already-migrated records.
- **B) Artisan command with `--batch-size` and `--offset` flags, plus an `is_role_migrated` boolean column on suppliers** — The flag column lets the command skip already-processed records on re-run. Staff can run it in batches (`--batch-size=500`) or all at once. Idempotent by design.
- C) Queue a job per supplier for async processing — Over-engineered. Role assignment is a lightweight column update, not a heavy operation. Queuing 13,000 jobs adds monitoring overhead for no benefit.

**Decision: Option B — resumable Artisan command with a migration-tracking flag.** Add a nullable `role_migrated_at` timestamp to the suppliers table (lightweight, no schema restructuring). The command processes only records where `role_migrated_at IS NULL`, applies the role assignment logic, sets the timestamp, and generates the report. Idempotent, resumable, and observable. FR-006, FR-007, FR-008, FR-009 all satisfied.

---

**Q4: Should AHPRA and banning register checks (US7) be built as part of the portal migration, or deferred to a separate post-migration epic?**

US7 is marked P2 and the spec notes it is "not blocking for the portal rebuild but adds significant value." There is zero existing code for AHPRA/NDIS/aged care/AFRA register integration — this is entirely greenfield. The registers may not have public APIs (AHPRA has a public lookup but no documented API; banning registers are PDF/web-scrape).

Options considered:
- A) Build it as part of SR9 — Adds significant scope to an already complex migration workstream. API availability for these registers is unconfirmed.
- **B) Stub the domain model and scheduled job framework in SR9, defer the actual register integration to a follow-up epic** — SR9 creates the `ComplianceRegisterCheck` model, the `CheckComplianceRegistersJob` skeleton, the staff alert mechanism, and the scheduled job entry. The actual API integrations (AHPRA scraping, NDIS register lookup) are implemented when register API access is confirmed. FR-019 through FR-023 are satisfied at the framework level; actual register connectors are delivered incrementally.
- C) Remove US7 from SR9 entirely — Loses the architectural slot, making it harder to add later.

**Decision: Option B — stub the framework in SR9, defer register connectors.** SR9 delivers the compliance check infrastructure (model, job, schedule, alerts, audit logging). Each register connector (AHPRA, NDIS, aged care, AFRA) is a separate implementation task that can be delivered independently once API access is confirmed. US7 acceptance scenarios 1-3 are deferred to connector delivery; scenarios 4-5 (scheduling and retry) are delivered in SR9.

---

**Q5: How should the myob_vendor_id be handled when a new supplier entity is created under an existing organisation in the two-tier model?**

US2 AC3 says "a new MYOB vendor record is provisioned and the myob_vendor_id is stored." But today, MYOB vendor creation is triggered by the existing `MyobCreateOrUpdateVendorAction` which is tied to bank detail submission flows. The two-tier model means one organisation can have multiple supplier entities, each needing their own MYOB vendor ID.

Options considered:
- **A) No change to MYOB vendor provisioning — new supplier entities get a vendor ID through the existing bank detail submission flow** — Today's flow already creates MYOB vendors when bank details are submitted. A new supplier entity under an existing org will go through the same bank detail submission, triggering `MyobCreateOrUpdateVendorAction`. The org-level grouping is a portal concept; MYOB still sees individual vendors per supplier entity. Zero refactoring.
- B) Create MYOB vendors at organisation creation time — Breaks the 1:1 vendor-to-supplier-entity mapping that MYOB expects. An organisation is not a payment entity.
- C) Batch-provision MYOB vendors for all entities when an org admin adds a new entity — Premature. The vendor should only be created when bank details exist.

**Decision: Option A — no change to MYOB vendor provisioning flow.** The existing `MyobCreateOrUpdateVendorAction` triggered by bank detail submission handles new supplier entities naturally. Each supplier entity gets its own `myob_vendor_id` when its bank details are first submitted, regardless of whether it belongs to a single-supplier or multi-supplier organisation. FR-002 is satisfied by preserving existing mappings; US2 AC3 is satisfied by the existing provisioning flow applying to new entities. No MYOB-side changes needed.
