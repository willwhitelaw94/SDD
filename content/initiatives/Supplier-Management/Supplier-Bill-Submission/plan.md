---
title: "Implementation Plan: Invoice Uplift (SBS + OHB)"
---

# Implementation Plan: Invoice Uplift (SBS + OHB)

**Branch**: `feature/invoice-uplift` | **Date**: 2026-03-07
**Specs**: [SBS spec.md](../Supplier-Bill-Submission/spec.md) | [OHB spec.md](../On-Hold-Bills-Flow/spec.md)
**OHB Design**: [design.md](../On-Hold-Bills-Flow/design.md) | [db-spec.md](../On-Hold-Bills-Flow/context/db-spec.md)
**Foundation**: `feat/bill-edit-v2-ide` branch (IDE layout, consolidated checks, multi-select reasons)
**Status**: Draft

## Summary

This plan combines two Supplier Management epics into a single implementation branch:

- **OHB (On Hold Bills Flow)** — Multi-issue diagnosis, department routing, communication engine, traffic-light checklist UI on the Bill Edit IDE layout
- **SBS (Supplier Bill Submission)** — Inbound email tokens, per-client email addresses, supplier client tabs, public bill submission form

Cherry-pick useful patterns from `feat/bill-edit-v2-ide` (IDE layout, UI components) into new files behind feature flags — existing `Bills/Edit.vue` preserved untouched. OHB layers the diagnosis engine + checklist on the new `Bills/EditV2.vue`. SBS adds supplier-facing email/portal features independently.

**Development Tracks**: OHB (Phases 0-5) and SBS (Phases 6-8) run in **parallel** — they share Phase 0 (foundation) and Phase 9 (integration). Two developers can work simultaneously on independent tracks.

---

## Technical Context

### Technology Stack

| Layer | Technology | Version |
|-------|------------|---------|
| Backend | Laravel | 12 |
| PHP | PHP | 8.3 |
| Frontend | Vue 3 + Inertia.js | v3 / v2 |
| Database | MySQL | 8.x |
| Testing | Pest | v3 |
| Queue | Laravel Horizon | v5 |
| Email (Inbound) | AWS SES | Inbound Receive + S3 + SNS |
| Email (Outbound) | Postmark / Mailgun | Configured |

### Dependencies

**Existing Systems (OHB)**:
- `Bills/Edit.vue` — Preserved as-is (legacy). New `Bills/EditV2.vue` behind `ohb-enabled` feature flag
- `BillController.php` — Conditional render: `ohb-enabled` → `Bills/EditV2`, else → `Bills/Edit`
- `BillReminderService.php` — Extend for two-stream communications
- `Tasks` system — Create tasks for department routing
- `BillOnHoldReasonsEnum` — 44 existing reasons, dual-write to old column + new table during migration
- `feat/bill-edit-v2-ide` — Cherry-pick useful parts only (IDE layout patterns, UI components). **Replace** its `bill_cannot_process_reasons`/`bill_reason` tables with OHB-spec schema

**Existing Systems (SBS)**:
- `Supplier` model — Add inbound email token relationship
- `SupplierDashboardController` — Show email address
- `SupplierBillController` — Current submission flow
- `SupplierClientsController` — Currently simple index, needs tabs
- `BillSourceEnum::EMAIL` — Already exists, currently unused

**New External Integrations (SBS)**:
- AWS SES Inbound Receive (S3 bucket for email storage + SNS topic → webhook)
- DNS: MX record on `invoices.trilogycare.com.au` subdomain (DevOps/infra team — out of scope for this plan)
- No new PHP packages required

### Constraints

**Performance**:
- 5-6K bills/day (~150-180K/month)
- Bill → Reasons queries must be < 50ms
- Batch cadence jobs process 1000+ bills

**Security**:
- Client-specific details never exposed to suppliers (OHB two-stream)
- Inbound email domain validation — only accept from supplier's registered domain (SBS)
- Public bill form — rate limiting, CSRF, honeypot

---

## Design Decisions

### Data Model — OHB

Detailed in [OHB db-spec.md](../On-Hold-Bills-Flow/context/db-spec.md). Key entities:

| Entity | Table | Purpose |
|--------|-------|---------|
| BillOhbState | `bill_ohb_states` | OHB workflow state (1:1 with bills) |
| OhbReason | `ohb_reasons` | Master list of 36 reasons with attributes |
| BillReason | `bill_reasons` | Per-bill reason instances with status tracking |
| OhbCommunication | `ohb_communications` | Audit trail for external comms |
| OhbRevalidationLog | `ohb_revalidation_logs` | Temporal re-validation history |

### Data Model — SBS

| Entity | Table | Purpose |
|--------|-------|---------|
| SupplierInboundToken | `supplier_inbound_tokens` | Unique email token per supplier |
| SupplierPackageEmail | `supplier_package_emails` | Per-client email address (supplier + package pair) |

**supplier_inbound_tokens**:

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| `id` | BIGINT UNSIGNED | NO | PK |
| `supplier_id` | BIGINT UNSIGNED | NO | FK to suppliers.id (unique) |
| `token` | VARCHAR(64) | NO | Unique token for email address |
| `email_address` | VARCHAR(255) | NO | Generated: `{token}@invoices.trilogycare.com.au` |
| `is_active` | BOOLEAN | NO | Can be deactivated by admin |
| `created_at` | TIMESTAMP | NO | |
| `updated_at` | TIMESTAMP | NO | |

Indexes: `UNIQUE (supplier_id)`, `UNIQUE (token)`, `INDEX (email_address)`

**supplier_package_emails**:

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| `id` | BIGINT UNSIGNED | NO | PK |
| `supplier_id` | BIGINT UNSIGNED | NO | FK to suppliers.id |
| `package_id` | BIGINT UNSIGNED | NO | FK to packages.id |
| `token` | VARCHAR(64) | NO | Unique token for this pair |
| `email_address` | VARCHAR(255) | NO | Generated: `{token}@invoices.trilogycare.com.au` |
| `is_active` | BOOLEAN | NO | |
| `created_at` | TIMESTAMP | NO | |
| `updated_at` | TIMESTAMP | NO | |

Indexes: `UNIQUE (supplier_id, package_id)`, `UNIQUE (token)`, `INDEX (email_address)`

### UI Components — OHB

From [OHB design.md](../On-Hold-Bills-Flow/design.md):

| Component | Approach |
|-----------|----------|
| Layout | IDE-style three-panel (from `feat/bill-edit-v2-ide`) |
| Checklist | Traffic-light accordion (BLOCKING/COMPLETE/WARNINGS) |
| Reason Modal | CommonModal with detail card + resolution actions |
| Updates | Inertia v2 partial reload polling (30-60s) — no separate API endpoint |

New pages:
- `Bills/EditV2.vue` — Full IDE layout with checklist panel (behind `ohb-enabled` flag)

New components:
- `BillChecklistPanel.vue` — Container with progress bar + accordion groups
- `BillReasonItem.vue` — Single reason row with status icon + department badge
- `BillReasonModal.vue` — Focused reason view with resolution actions

### UI Components — SBS

| Component | Approach |
|-----------|----------|
| Email display | Inline with copy button on dashboard + invoices page |
| Client tabs | CommonTabs with "All Clients", "With Agreements", "Invoiced", "Archived" |
| Public form | Standalone unauthenticated page at `/bills` |

Modified pages:
- `Suppliers/Dashboard/SupplierDashboard.vue` — Add inbound email address display
- `Suppliers/Bills/Index.vue` — Add email address in header
- `Suppliers/Clients/Index.vue` — Add tabs + per-client email generation
- New: `Public/Bills/PublicBillCreate.vue` — Public submission form

### API Contracts — OHB

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/bills/{bill}/edit` | OHB data included via Inertia partial reload (no separate API) |
| POST | `/api/bills/{bill}/ohb/diagnose` | Trigger multi-issue diagnosis |
| PATCH | `/api/bill-reasons/{billReason}` | Update reason status |
| POST | `/api/bill-reasons/{billReason}/resolve` | Mark resolved with notes |
| POST | `/api/bills/{bill}/ohb/revalidate` | Trigger temporal re-validation |

### API Contracts — SBS

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/webhooks/inbound-email` | Receive AWS SNS notification (SES inbound email) |
| POST | `/suppliers/{supplier}/clients/{package}/generate-email` | Generate per-client email |
| GET | `/suppliers/{supplier}/clients` | Client list with tabs (query param: `tab`) |
| GET | `/bills` | Public bill submission form (unauthenticated) |
| POST | `/bills` | Submit public bill (unauthenticated) |

---

## Implementation Phases

### Phase 0: Foundation — New Files + Cherry-Pick

**Strategy**: Preserve existing `Bills/Edit.vue` untouched. Create new `Bills/EditV2.vue` behind `ohb-enabled` feature flag. Cherry-pick useful patterns from `feat/bill-edit-v2-ide` (IDE layout components, UI patterns) but **replace** its database tables with OHB-spec schema.

**Deliverables**:
1. New `Bills/EditV2.vue` with IDE-style three-panel layout
2. Feature flag conditional rendering in `BillController@edit`
3. Cherry-picked UI components from IDE branch (layout panels, sticky footer)
4. Drop IDE branch's `bill_cannot_process_reasons`/`bill_reason` tables — replaced in Phase 1

**Tasks**:
```
P0.1 - Create Bills/EditV2.vue with IDE three-panel layout (cherry-pick layout patterns from feat/bill-edit-v2-ide)
P0.2 - Cherry-pick reusable UI components (panel collapse, sticky footer) from IDE branch
P0.3 - Add Pennant feature flag: ohb-enabled
P0.4 - Modify BillController@edit: if ohb-enabled → render Bills/EditV2 with OHB data; else → render Bills/Edit (unchanged)
P0.5 - Verify existing Bills/Edit.vue still renders correctly (no regressions)
P0.6 - Run existing bill tests to confirm no regressions
```

**Exit Criteria**:
- [ ] `Bills/Edit.vue` unchanged and renders correctly
- [ ] `Bills/EditV2.vue` renders with IDE layout when `ohb-enabled` is ON
- [ ] All existing bill tests pass
- [ ] No console errors

---

### Phase 1: OHB — Database & Models

**Deliverables**:
1. Create migrations for 5 new OHB tables + 2 SBS tables (replacing IDE branch tables)
2. Create Eloquent models with relationships
3. Seed `ohb_reasons` from CSV
4. Add feature flags
5. Dual-write adapter for legacy `bill_on_hold_reason` column

**Legacy Enum Migration Strategy** (dual-write, then deprecate):
- **Step 1** (this phase): New `bill_reasons` table created. `BillOnHoldReasonsEnum` values mapped to `ohb_reasons` via `legacy_enum_mapping` column.
- **Step 2** (Phase 2): When OHB diagnosis writes to `bill_reasons`, also write the primary reason to the legacy `bill_on_hold_reason` column (dual-write via model observer).
- **Step 3** (Phase 9): After verification on staging, create migration to drop `bill_on_hold_reason` column and remove dual-write logic.

**Tasks**:
```
P1.1 - Create migration: bill_ohb_states table
P1.2 - Create migration: ohb_reasons table (replaces IDE branch's bill_cannot_process_reasons)
P1.3 - Create migration: bill_reasons table with soft deletes (replaces IDE branch's bill_reason)
P1.4 - Create migration: ohb_communications table
P1.5 - Create migration: ohb_revalidation_logs table
P1.6 - Create migration: supplier_inbound_tokens table
P1.7 - Create migration: supplier_package_emails table
P1.8 - Create model: BillOhbState (1:1 with Bill)
P1.9 - Create model: OhbReason (master list, with legacy_enum_mapping column)
P1.10 - Create model: BillReason (soft deletes, status transitions)
P1.11 - Create model: OhbCommunication
P1.12 - Create model: OhbRevalidationLog
P1.13 - Create model: SupplierInboundToken (1:1 with Supplier)
P1.14 - Create model: SupplierPackageEmail (supplier + package pair)
P1.15 - Create seeder: OhbReasonsSeeder (36 reasons with legacy_enum_mapping)
P1.16 - Add Pennant feature flags: sbs-email-submission, supplier-ohb-view, public-bill-form, create-supplier-invoice
P1.17 - Add Bill relationship: ohbState(), billReasons()
P1.18 - Add Supplier relationship: inboundToken(), packageEmails()
P1.19 - Create BillReason model observer for dual-write to legacy bill_on_hold_reason column
P1.20 - Create factories for all new models
P1.21 - Write tests: Model relationships and validation
P1.22 - Write tests: Dual-write observer correctly maps to legacy enum
```

**Exit Criteria**:
- [ ] All migrations run successfully
- [ ] Models created with proper relationships
- [ ] 36 OHB reasons seeded with legacy mappings
- [ ] Feature flags work per-environment
- [ ] Dual-write observer maps new reasons to legacy column
- [ ] Unit tests passing

---

### Phase 2: OHB — Diagnosis Engine

**Deliverables**:
1. Multi-issue diagnosis action
2. Auto-reject detection (9 types)
3. Department routing via Tasks
4. Hook into bill submission flow

**Tasks**:
```
P2.1 - Create action: DiagnoseBillAction (AsAction)
       - Accepts Bill, returns detected reasons
       - Calls individual validators per reason type
P2.2 - Create service: OhbDiagnosisService
       - Coordinates validators, creates BillReason + BillOhbState records
P2.3 - Create category validators (one class per category, not per reason):
       - SupplierValidator (ABN/GST, terminated, not verified, bank details, MYOB)
       - RecipientValidator (client name, package status, eligibility)
       - InvoiceValidator (calculation error, itemisation, commencement/termination date)
       - ComplianceValidator (finance QA, duplicate detection)
       - (Additional categories per ohb_reasons grouping)
P2.4 - Create action: AutoRejectBillAction (AsAction)
       - Instant rejection for 99% confidence disqualifiers
P2.5 - Create action: RouteToDepartmentsAction (AsAction)
       - Creates Tasks for reasons with requires_internal_action
       - Links task_id to bill_reasons
P2.6 - Hook into existing bill flow at SUBMITTED → IN_REVIEW
       - Feature flag check before diagnosis
P2.7 - Write tests: Diagnosis with multiple issues
P2.8 - Write tests: Auto-reject scenarios
P2.9 - Write tests: Department routing creates correct tasks
```

**Exit Criteria**:
- [ ] Diagnosis detects multiple reason types per bill
- [ ] Auto-reject fires for eligible reasons at 99% confidence
- [ ] Tasks created per department for internal-action reasons
- [ ] Existing bill flow unchanged when flag off
- [ ] Feature tests passing

---

### Phase 3: OHB — Communication Engine

**Deliverables**:
1. Communication type determination (REJECT-RESUBMIT / REJECT PERIOD / ON HOLD)
2. Can Coexist filter
3. Two-stream notifications (Resolution Outreach + Submitter Notification)
4. Cadence management (Day 0→3→7→10)

**Tasks**:
```
P3.1 - Create action: DetermineCommsTypeAction (AsAction)
       - REJECT-RESUBMIT if any touches_invoice
       - REJECT_PERIOD if permanent block (terminated)
       - ON_HOLD if awaiting external
P3.2 - Add BillReason::scopeVisibleToSupplier() query scope
       - Reads can_coexist_with from reasons, hides dominated issues
       - Applied when building supplier-facing notifications
P3.3 - Extend BillReminderService for OHB two-stream
       - Resolution Outreach → client/coordinator
       - Submitter Notification → supplier
P3.4 - Create notifications:
       - OhbResolutionOutreachNotification
       - OhbSubmitterNotification
       - OhbCadenceReminderNotification
P3.5 - Create job: OhbCadenceJob (scheduled hourly via Kernel)
       - Queries bills where next_cadence_at <= now(), processes in batches
       - Day 3 reminder, Day 7 warning, Day 10 timeout
P3.6 - Create action: TimeoutOnHoldBillAction (AsAction)
       - Day 10 → REJECTED_FINAL outcome
P3.7 - Write tests: Communication type determination
P3.8 - Write tests: Cadence progression
P3.9 - Write tests: Privacy (client details hidden from supplier)
```

---

### Phase 4: OHB — Temporal Re-validation

**Deliverables**:
1. Re-validation service for time-sensitive qualifiers
2. Pre-communication and post-resolution triggers

**Tasks**:
```
P4.1 - Create action: RevalidateBillAction (AsAction)
       - Checks: funding_balance, funding_period, authorization_status,
         supplier_status, service_eligibility
       - Adds new reasons if context changed
       - Logs to ohb_revalidation_logs
P4.2 - Create validators: Time-sensitive validators
       - FundingBalanceValidator, FundingPeriodValidator
       - AuthorizationStatusValidator, SupplierStatusValidator
       - ServiceEligibilityValidator
P4.3 - Add trigger: Pre-communication re-validation
P4.4 - Add trigger: Post-resolution re-validation
P4.5 - Add max loop limit (5) to prevent oscillation
P4.6 - Write tests: Context decay scenarios
P4.7 - Write tests: Re-validation loop limit
```

---

### Phase 5: OHB — UI (Checklist Panel + Reason Modal)

**Deliverables**:
1. BillChecklistPanel with traffic-light grouping
2. BillReasonItem rows
3. BillReasonModal with resolution workflow
4. Polling composable
5. Integration with IDE layout

All Vue components use `<script setup lang="ts">`.

**Tasks**:
```
P5.1 - Implement Inertia v2 polling for OHB data
       - Use router.reload({ only: ['billReasons', 'ohbState'] }) on 30-60s interval
       - No separate API endpoint — data flows through BillController@edit
       - Group reasons by status: BLOCKING / COMPLETE / WARNINGS in computed
       Types: BillReasonData, OhbReasonData, BillOhbStateData

P5.2 - Create component: BillChecklistPanel.vue
       - Props: defineProps<Props>() with:
         - bill: Bill
         - reasons: BillReasonData[]
         - ohbState: BillOhbStateData
       - Emits: defineEmits<Emits>() with:
         - (e: 'select-reason', reason: BillReasonData): void
       - Progress bar header (CommonProgressBar)
       - Accordion groups: BLOCKING (red) / COMPLETE (green) / WARNINGS (amber)
       - "Updated X ago" indicator (CommonTimer)
       - Common components: CommonAccordion, CommonProgressBar, CommonBadge

P5.3 - Create component: BillReasonItem.vue
       - Props: defineProps<Props>() with:
         - reason: BillReasonData
       - Emits: defineEmits<Emits>() with:
         - (e: 'click', reason: BillReasonData): void
       - Status icon badge (CommonIconBadge)
       - Reason name + department badge (CommonBadge)
       - Common components: CommonIconBadge, CommonBadge

P5.4 - Create component: BillReasonModal.vue
       - Props: defineProps<Props>() with:
         - reason: BillReasonData | null
         - bill: Bill
       - Emits: defineEmits<Emits>() with:
         - (e: 'resolved', reasonId: number, notes: string): void
         - (e: 'unresolved', reasonId: number, notes: string): void
         - (e: 'close'): void
       - CommonModal wrapper
       - CommonDefinitionList for reason attributes
       - Resolution notes textarea
       - Mark Resolved / Mark Unresolved buttons
       - "View Full Bill" link
       - Common components: CommonModal, CommonDefinitionList, CommonDefinitionItem,
         CommonButton, CommonTextarea

P5.5 - Build Bills/EditV2.vue (IDE layout — created in Phase 0)
       - Add BillChecklistPanel to right collapsible panel
       - Wire up reason selection → modal
       - Inertia v2 polling for billReasons + ohbState
       - Bills/Edit.vue remains unchanged

P5.6 - BillController@edit already conditionally renders EditV2 (from Phase 0)
       - Add ohb_state, bill_reasons (eager loaded) to EditV2 props only
       - Existing Edit.vue props unchanged

P5.7 - Create TypeScript types:
       - resources/js/types/ohb.ts (BillReasonData, OhbReasonData, BillOhbStateData, etc.)

P5.8 - Write browser tests: Checklist display + panel collapse
P5.9 - Write browser tests: Reason modal open/close + resolution
```

---

### Phase 6: SBS — Inbound Email Infrastructure

**Deliverables**:
1. Token generation for suppliers
2. Inbound email webhook controller
3. Bill creation from email attachments

**Tasks**:
```
P6.1 - Create action: GenerateSupplierInboundTokenAction (AsAction)
       - Generates unique token, creates SupplierInboundToken
       - Called on supplier creation (or backfill existing)
P6.2 - Create action: GeneratePackageEmailAction (AsAction)
       - Generates per-client email for supplier + package pair
       - authorize(): supplier must own the relationship
P6.3 - Create controller: InboundEmailWebhookController
       - POST /webhooks/inbound-email
       - Validates AWS SNS message signature
       - Fetches email from S3 bucket (SES stores raw email)
       - Extracts token from recipient email address
       - Validates sender domain against supplier's registered domain
       - Queues bill creation job
P6.4 - Create job: ProcessInboundEmailJob (ShouldQueue)
       - Extracts PDF attachments
       - Creates Bill per attachment (source: BillSourceEnum::EMAIL)
       - Links to supplier via token
       - Links to package if per-client email used
       - Logs sender email for audit
P6.5 - Create action: ValidateInboundEmailAction (AsAction)
       - Domain validation: sender matches supplier's registered domain
       - Attachment validation: PDF required
       - Deduplication: document hash check
P6.6 - Create seeder/command: BackfillSupplierTokensCommand
       - Generate tokens for existing suppliers
P6.7 - Write tests: Token generation
P6.8 - Write tests: Webhook processing (valid/invalid emails)
P6.9 - Write tests: Domain validation
P6.10 - Write tests: Bill creation from email
```

---

### Phase 7: SBS — Supplier Portal UI

**Deliverables**:
1. Email address display on dashboard + invoices page
2. Client tabs (All, With Agreements, Invoiced, Archived)
3. Per-client email generation

All Vue components use `<script setup lang="ts">`.

**Tasks**:
```
P7.1 - Modify SupplierDashboard.vue
       - Display inbound email address with copy button
       - Use CommonButton + clipboard API
       - Feature flag: sbs-email-submission

P7.2 - Modify Suppliers/Bills/Index.vue
       - Add email address in header section with copy button

P7.3 - Modify SupplierClientsController@index
       - Query clients with tabs:
         - "With Agreements": supplier attached to package budget items
         - "Invoiced": supplier has submitted bills for client
         - "Archived": client package is inactive
         - "All Clients": deduplicated union
       - Accept `tab` query parameter
       - Return per-client email addresses

P7.4 - Modify Suppliers/Clients/Index.vue
       - Add CommonTabs with items: All Clients, With Agreements, Invoiced, Archived
       - Per-client row: show email if exists, "Generate Email" button if not
       - Copy button on existing emails
       - Props types for client data + email data

P7.5 - Create action: GetSupplierClientsAction (AsAction)
       - Query logic for each tab relationship type
       - Returns clients with relationship type + email data

P7.6 - Modify SupplierDashboardController
       - Include inbound_email_address in Inertia response

P7.7 - Write tests: Client tabs query logic
P7.8 - Write tests: Email generation + copy
P7.9 - Write browser tests: Tab switching + email display
```

---

### Phase 8: SBS — Public Bill Submission Form

**Deliverables**:
1. Public unauthenticated form at `/bills`
2. ABN-based supplier matching
3. Service picklist
4. Reference number on confirmation

All Vue components use `<script setup lang="ts">`.

**Tasks**:
```
P8.1 - Create controller: PublicBillSubmissionController
       - GET /bills → render form (unauthenticated)
       - POST /bills → validate + create bill
       - Rate limiting middleware
       - Honeypot field for spam prevention

P8.2 - Create page: Public/Bills/PublicBillCreate.vue
       - Form fields: ABN, supplier name, client name, invoice PDF(s),
         service picklist, description
       - Single useForm instance for all fields
       - Client-side validation via Zod
       - Props: defineProps<Props>() with:
         - services: ServicePicklistItem[]
       - Common components: CommonInput, CommonSelect, CommonFileUpload, CommonButton

P8.3 - Create page: Public/Bills/PublicBillConfirmation.vue
       - Displays reference number
       - "Submit another" link

P8.4 - Create action: MatchSupplierByAbnAction (AsAction)
       - Matches ABN to existing supplier
       - Returns supplier or flags for manual matching

P8.5 - Create data class: PublicBillSubmissionData
       - Validates: ABN format, required fields, file type/size

P8.6 - Add routes to public routes file (no auth middleware)
P8.7 - Write tests: Public form submission
P8.8 - Write tests: ABN matching (found/not found)
P8.9 - Write tests: Rate limiting
```

---

### Phase 9: Integration & Polish

**Tasks**:
```
P9.1 - E2E test: OHB full flow (diagnosis → resolution → payment)
P9.2 - E2E test: OHB timeout flow (diagnosis → cadence → rejection)
P9.3 - E2E test: SBS email → bill creation → processing
P9.4 - E2E test: Public form → bill creation → processing
P9.5 - Edge case: Resubmission linking (LinkResubmissionAction)
P9.6 - Edge case: Max revalidation loops (5)
P9.7 - Performance: Query optimization, index verification
P9.8 - Performance: Eager loading in BillController@edit
P9.9 - Run Pint: vendor/bin/pint --dirty
P9.10 - Run Larastan
P9.11 - Feature flag: Enable both flags for staging
```

---

## Testing Strategy

### Test File Structure

```
tests/
├── Unit/
│   └── OHB/
│       ├── Models/ (BillOhbState, OhbReason, BillReason)
│       ├── Services/ (Diagnosis, Revalidation, Communication)
│       └── Validators/ (AbnGst, Calculation, etc.)
│   └── SBS/
│       ├── Models/ (SupplierInboundToken, SupplierPackageEmail)
│       └── Actions/ (GenerateToken, ValidateInbound, MatchAbn)
├── Feature/
│   └── OHB/
│       ├── DiagnoseBillTest.php
│       ├── AutoRejectTest.php
│       ├── DepartmentRoutingTest.php
│       ├── RevalidationTest.php
│       ├── CommunicationTest.php
│       └── CadenceTest.php
│   └── SBS/
│       ├── InboundEmailWebhookTest.php
│       ├── SupplierClientTabsTest.php
│       ├── PublicBillSubmissionTest.php
│       └── EmailGenerationTest.php
└── Browser/
    └── OHB/
        ├── ChecklistPanelTest.php
        └── ReasonModalTest.php
    └── SBS/
        ├── EmailDisplayTest.php
        └── PublicFormTest.php
```

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| IDE branch merge conflicts | High | Medium | Cherry-pick specific files, not full merge |
| 36 OHB reasons complexity | Medium | High | Start with top 9 auto-reject, expand gradually |
| Legacy enum compatibility | Medium | Medium | Map via `legacy_enum_mapping`, dual-write initially |
| Inbound email reliability | Medium | High | Queue processing, retry logic, dead letter monitoring |
| Public form spam/abuse | Medium | Medium | Rate limiting, honeypot, CAPTCHA fallback |
| Performance at 5K bills/day | Low | High | Indexing strategy, batch jobs for cadence |
| Two-stream privacy leakage | Low | High | Strict separation, code review, browser tests |

---

## Rollout Strategy

### Feature Flags

| Flag | Scope | Default |
|------|-------|---------|
| `ohb-enabled` | OHB diagnosis + checklist UI | OFF |
| `sbs-email-submission` | Inbound email + email display | OFF |

**Stages**: Dev → Staging → Pilot (specific users) → Rollout → Stable (remove flag)

**Rollback**: Flags OFF immediately disables features. Existing bill flow continues unchanged.

---

## Architecture Gate Check

**Date**: 2026-03-07
**Status**: PASS

### Technical Feasibility
- [x] Architecture approach clear (IDE layout + OHB engine + SBS email)
- [x] Existing patterns leveraged (BillReminderService, Tasks, CommonTable)
- [x] All requirements buildable
- [x] Performance considered (indexes, batch jobs, eager loading)
- [x] Security considered (domain validation, rate limiting, two-stream privacy)

### Data & Integration
- [x] Data model understood (OHB: 5 new tables, SBS: 2 new tables)
- [x] API contracts clear (OHB: 5 endpoints, SBS: 4 endpoints)
- [x] Dependencies identified (Postmark/Mailgun webhook, feat/bill-edit-v2-ide)
- [x] Integration points mapped (BillReminderService, Tasks, SupplierDashboard)
- [x] DTO persistence explicit (Data classes for all form submissions)

### Implementation Approach
- [x] File changes identified (per phase)
- [x] Risk areas noted (merge conflicts, email reliability, privacy)
- [x] Testing approach defined (unit + feature + browser per phase)
- [x] Rollback possible (feature flags, no existing schema changes)

### Resource & Scope
- [x] Scope matches spec (SBS 6 stories + OHB 9 stories)
- [x] Effort reasonable (phased delivery)
- [x] Skills available

### Laravel & Cross-Platform Best Practices
- [x] No hardcoded business logic in Vue (reasons from DB, types from backend)
- [x] Cross-platform reusability (API endpoints serve any client)
- [x] Laravel Data for validation
- [x] Model route binding
- [x] No magic numbers (OHB reasons in DB, not hardcoded)
- [x] Common components pure
- [x] Use Lorisleiva Actions (AsAction trait on all new actions)
- [x] Action authorization in `authorize()`
- [x] Data classes remain anemic
- [x] Migrations schema-only (OHB reasons seeded via Seeder)
- [x] Models have single responsibility
- [x] Granular model policies (BillReasonPolicy for reason resolution)
- [x] Response objects in auth
- [x] Feature flags dual-gated (backend middleware + frontend HasFeatureFlag)

### Vue TypeScript Standards
- [x] All Vue components use `<script setup lang="ts">`
- [x] Props use named `type Props` with `defineProps<Props>()`
- [x] Emits use named `type Emits` with `defineEmits<Emits>()`
- [x] No `any` types — all backend data has TypeScript types in `types/ohb.ts` and `types/sbs.ts`
- [x] Shared types identified (`types/ohb.ts`, `types/sbs.ts`)
- [x] Common components reused (CommonAccordion, CommonBadge, CommonModal, CommonTabs, etc.)
- [x] New components assessed — BillChecklistPanel/BillReasonItem/BillReasonModal are feature-specific (bespoke)
- [x] Inertia v2 partial reload polling (not custom composable — no separate API endpoint)

### Data Tables
- [x] No new data tables in this plan — existing BillsTable/OnHoldBillsTable extended

---

## Development Clarifications

### Session 2026-03-07

- Q: How to handle table overlap between `feat/bill-edit-v2-ide` tables and OHB tables? → A: **Replace with OHB tables**. Drop IDE branch's `bill_cannot_process_reasons`/`bill_reason` tables and create OHB-spec schema (`ohb_reasons` + `bill_reasons`). Rewire any classification logic.
- Q: Merge strategy for `feat/bill-edit-v2-ide`? → A: **Preserve existing Bills/Edit.vue, create new files behind feature flag**. Cherry-pick useful UI patterns (IDE layout, components) but don't full-merge. New `Bills/EditV2.vue` behind `ohb-enabled`.
- Q: Legacy `bill_on_hold_reason` enum column migration path? → A: **Dual-write, then deprecate**. Phase 1: dual-write via model observer. Phase 2: switch reads. Phase 3: drop column.
- Q: Inbound email provider? → A: **AWS SES inbound**. S3 + SNS → webhook. DNS/MX setup is DevOps/infra (out of scope).
- Q: SBS and OHB development tracks? → A: **Parallel tracks**. OHB (Phases 0-5) and SBS (Phases 6-8) run concurrently. Shared Phase 0 and Phase 9.
- Q: New OHB Bill Edit page approach? → A: **Separate Bills/EditV2.vue**. BillController@edit checks `ohb-enabled` flag and conditionally renders Edit.vue or EditV2.vue.
- Q: Cadence job scheduling? → A: **Hourly scheduled job**. Queries bills where `next_cadence_at <= now()`, processes in batches.
- Q: AWS SES DNS infrastructure? → A: **DevOps/infra team (out of scope)**. Plan covers webhook controller + processing logic only.
- Q: Validator architecture for 36 OHB reasons? → A: **One class per category** (9 category validators: SupplierValidator, RecipientValidator, InvoiceValidator, etc.). Each checks 3-5 reasons within their domain.
- Q: Can Coexist filter location? → A: **BillReason query scope** (`BillReason::scopeVisibleToSupplier()`). Applied when building supplier-facing notifications.
- Q: Polling method for OHB data on EditV2? → A: **Inertia v2 partial reload** (`router.reload({ only: ['billReasons', 'ohbState'] })`). No separate API endpoint needed.
- Q: Controller split for EditV2? → A: **Same controller, conditional render**. BillController@edit checks `ohb-enabled` flag — one entry point, shared bill loading logic.
- Q: OhbCadenceJob scheduling pattern? → A: **Hourly** via `$schedule->job(new OhbCadenceJob)->hourly()` in Kernel.

---

## Next Steps

1. Run `/speckit-tasks` to generate implementation task list
2. Begin Phase 0: Create EditV2.vue + cherry-pick IDE layout patterns
3. **Parallel tracks**: OHB (Phases 0-5) and SBS (Phases 6-8) run concurrently
4. Phase 9: Integration + drop legacy column + polish
