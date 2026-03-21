---
title: "Implementation Plan: Lead Essential (LES)"
---

# Implementation Plan: Lead Essential (LES)

**Spec**: [spec.md](spec.md)
**Design**: [design.md](design.md)
**Created**: 2026-02-22
**Status**: Draft

---

## Technical Context

### Technology Stack

- **Backend**: Laravel 12, PHP 8.3, domain-driven design in `domain/Lead/`
- **Frontend**: Vue 3, Inertia.js v2, TypeScript, Tailwind CSS v3
- **Database**: MySQL — traditional Eloquent (Lead is NOT event sourced)
- **Queue**: Redis + Horizon — used for bulk assignment jobs
- **DTOs**: Spatie Laravel Data (`LeadData`, `LeadRecipientMetaData`, etc.)
- **Feature Flags**: Laravel Pennant + PostHog
- **Auth**: Existing gates + policies in `domain/Lead/Policies/`

### Existing Infrastructure (Do Not Re-build)

| Component | Location | Notes |
|-----------|----------|-------|
| Lead model | `domain/Lead/Models/Lead.php` | 3 JSON cols: tracking_meta, recipient_meta, journey_meta |
| LeadOwner model | `domain/Lead/Models/LeadOwner.php` | The consumer identity record |
| LeadJourneyStageEnum | `domain/Lead/Enums/LeadJourneyStageEnum.php` | 10 cases → mapped to 6 display stages |
| LeadData DTO | `domain/Lead/Data/LeadData.php` | fromModel(), profile completion calc, Zoho transform |
| LeadRecipientMetaData | `domain/Lead/Data/LeadRecipientMetaData.php` | All recipient profile fields |
| UpdateLeadAction | `domain/Lead/Actions/UpdateLeadAction.php` | General lead update |
| UpdateLeadJourneyStageAction | `domain/Lead/Actions/UpdateLeadJourneyStageAction.php` | Stage update action |
| CreateLeadAction | `domain/Lead/Actions/CreateLeadAction.php` | Lead creation |
| CheckLeadSimilarityAction | `domain/Lead/Actions/CheckLeadSimilarityAction.php` | Duplicate detection |
| StaffLeadController | `domain/Lead/Controllers/StaffLeadController.php` | index(), show(), fromZoho() |
| Lead routes | `domain/Lead/Routes/leadRoutes.php` | All behind `lead-to-hca-conversion` flag |
| Staff Leads list | `resources/js/Pages/Staff/Leads/Index.vue` | KPI cards + table |
| Lead conversion wizard (staff) | `resources/js/Pages/Staff/Leads/Conversion/` | Steps 1-6, do not modify |
| Consumer wizard | `resources/js/Pages/Lead/Edit.vue` + LeadEditForm | 6-step wizard — kept running. Deprecated in LDS. |

### Key Constraints

- **No event sourcing on Lead** — Lead is a plain Eloquent model with JSON metadata columns. Timeline/audit trail needs a new `lead_timeline_entries` table.
- **Journey Stage Enum immutable** — `LeadJourneyStageEnum` has 10 cases and must not be changed. The 6-stage UI display is a mapping layer on top.
- **Zoho sync compatibility** — Any new fields added to Lead must not break `LeadData::forZoho()` or the sync pipeline.
- **Feature flag** — Single flag: extend existing `lead-to-hca-conversion`. All new LES routes and enhancements go under this flag. No new flag needed.
- **Consumer wizard kept alive** — `Lead/Edit.vue` (6-step wizard) stays running alongside the new `Lead/Profile.vue` (section-based). Old wizard is deprecated in LDS, not LES.
- **Tab routing: client-side only** — `Staff/Leads/Show.vue` handles all 3 tabs (Overview, Timeline, Other) with local Vue state. No separate Inertia routes per tab. URL does not change on tab switch.
- **Section save: Inertia redirect-back** — `useForm()` submits `PUT /staff/leads/{lead}/section/{section}`. Controller returns `redirect()->back()`. Standard Inertia pattern, no partial reloads.
- **One action per section** — `UpdateLeadPersonalDetailsAction`, `UpdateLeadLivingSituationAction`, etc. Each has its own Data class with specific validation. No single generic dispatcher.
- **Existing conversions** — `Staff/Leads/Conversion/` pages and `LeadConversionController` must not be modified.
- **Assignment rule forward-compatibility** — LDS will add configurable assignment rules (round-robin, least-loaded, hybrid) and a lead-steal mechanic (claim stale leads after N hours of no contact). LES data model must support this without re-migration. `assigned_user_id` (nullable) + `last_contact_at` (indexed timestamp) are the two columns LDS will build on. No rule engine in LES.

---

## Gates

Review against constitution:

- [x] **Majestic Monolith** — All code in `domain/Lead/`, no microservices
- [x] **Domain-Driven Design** — Follows existing `domain/Lead/` structure
- [x] **Laravel Data for DTOs** — New data classes extend existing patterns (LeadData, LeadRecipientMetaData)
- [x] **Action classes** — One action per use case (CreateLeadTimelineEntryAction, AssignLeadAction, etc.)
- [x] **Feature flag** — New `lead-essential` Pennant flag via PostHog
- [x] **Authorization** — Extend existing LeadPolicy; new LeadTimelinePolicy for notes
- [x] **Event sourcing** — NOT used for Lead (Lead domain uses Eloquent, not event sourcing). Timeline is a dedicated table.
- [x] **Type safety** — All Vue files `<script setup lang="ts">`, PHP explicit return types
- [x] **Pint formatting** — Run `vendor/bin/pint --dirty` before finalizing

---

## Design Decisions

### Feature Flag

**Decision**: Extend existing `lead-to-hca-conversion` flag. No new flag needed for LES.

**Rationale**: LES builds on the same routes and data as LTH. Creating a second flag would require syncing two flags in PostHog and could cause confusion about which flag controls what. All lead staff routes are already behind `lead-to-hca-conversion` — LES enhancements are additive to that same gate.

**Implementation**: All new LES routes added under `check.feature.flag:lead-to-hca-conversion` middleware. The flag is renamed conceptually to "lead features" in PostHog description, but the key stays the same to avoid breaking existing checks.

---

### Data Model

#### New Table: `lead_timeline_entries`

The spec requires an **immutable timeline** of all lead events (FR-021, FR-023, FR-048). Lead has no event sourcing — we need a dedicated table.

```
lead_timeline_entries
├── id (bigint, PK)
├── lead_id (FK → leads.id, cascade)
├── created_by (FK → users.id, nullable — null for system events)
├── event_type (string 50) — 'note', 'status_change', 'stage_change', 'assignment', 'creation', 'section_edit', 'traits_edit'
├── title (string 200) — human-readable summary
├── description (text, nullable) — extended content (note text, context)
├── metadata (json, nullable) — structured data for the event type
│   ├── status_change: { from: string, to: string, contact_method?: string, outcome?: string, follow_up_date?: string }
│   ├── stage_change: { from: string, to: string }
│   ├── assignment: { from_user_id?: int, to_user_id: int }
│   └── note: (no extra metadata — description IS the note)
├── is_pinned (boolean, default false) — reserved for LDS pinning feature, no UI in LES
├── created_at (timestamp)
```

> **No `updated_at`** — entries are immutable (FR-048). No soft deletes.

---

#### New Table: `lead_status_histories`

The spec requires status-specific wizard data to be stored per transition (FR-015 to FR-020). The status history provides structured storage beyond what the timeline entry's `metadata` JSON holds.

```
lead_status_histories
├── id (bigint, PK)
├── lead_id (FK → leads.id, cascade)
├── created_by (FK → users.id)
├── previous_status (string 30, nullable) — null for first status
├── new_status (string 30) — LeadStatusEnum value
├── contact_method (string 50, nullable) — 'phone', 'email', 'sms', 'in_person'
├── contact_outcome (string 50, nullable) — 'no_answer', 'left_voicemail', 'line_busy', etc.
├── journey_stage (string 50, nullable) — captured at Made Contact transition
├── purchase_intent (string 10, nullable) — 'hot', 'warm', 'cold'
├── attribution (string 100, nullable) — lead source at Made Contact
├── lost_type (string 30, nullable) — 'lost_lead', 'junk', 'uncontactable'
├── lost_reason (string 100, nullable)
├── follow_up_date (date, nullable)
├── notes (text, nullable)
├── created_at (timestamp)
```

---

#### New Table: `lead_stage_histories`

Journey Stage transitions need their own structured record (FR-013, separate from timeline entry) to support the mandatory fields per-stage capture.

```
lead_stage_histories
├── id (bigint, PK)
├── lead_id (FK → leads.id, cascade)
├── created_by (FK → users.id)
├── previous_stage (string 50, nullable)
├── new_stage (string 50) — LeadJourneyStageEnum value
├── mandatory_fields (json, nullable) — fields captured during the stage wizard
├── created_at (timestamp)
```

---

#### Contact Information Storage

Contacts (primary + secondary) are stored as a JSON array in `recipient_meta` under a `contacts` key. No new table.

```json
{
  "contacts": [
    {
      "id": "uuid-v4",
      "name": "Jane Smith",
      "relationship": "Daughter",
      "email": "jane@example.com",
      "phone": "0400 000 000",
      "contact_type": "primary"
    }
  ]
}
```

> Single-primary-contact rule enforced in `UpdateLeadContactsAction` — validates exactly one `contact_type: primary` before saving.

---

#### New Column on `leads`: `assigned_user_id`

Currently, `leads.user_id` is the staff owner. The spec requires an **assigned agent** (FR-024 to FR-027) which may differ from the record owner. We add `assigned_user_id` as a nullable FK to `users`.

```sql
ALTER TABLE leads ADD COLUMN assigned_user_id BIGINT UNSIGNED NULL AFTER user_id;
ALTER TABLE leads ADD FOREIGN KEY (assigned_user_id) REFERENCES users(id) ON DELETE SET NULL;
ALTER TABLE leads ADD INDEX (assigned_user_id);
```

> **Note**: `user_id` remains as the original owner/creator. `assigned_user_id` is the active sales agent responsible. Auto-set to `user_id` on creation for staff-created leads.

---

#### New Column on `leads`: `lead_status`

Lead Status (Not Contacted, Attempted Contact, Made Contact, Lost) is currently not on the Lead model — it exists only in the conversion context. LES needs it as a first-class column.

```sql
ALTER TABLE leads ADD COLUMN lead_status VARCHAR(30) NOT NULL DEFAULT 'not_contacted' AFTER journey_meta;
ALTER TABLE leads ADD INDEX (lead_status);
```

---

#### New Column on `leads`: `last_contact_at`

`last_contact_at` is auto-calculated from status transitions (FR-051 — most recent Made Contact or Attempted Contact). Stored as a cached column updated by `UpdateLeadStatusAction` for fast reads (avoids re-querying `lead_status_histories` on every profile load).

```sql
ALTER TABLE leads ADD COLUMN last_contact_at TIMESTAMP NULL AFTER lead_status;
ALTER TABLE leads ADD INDEX (last_contact_at);
```

> Updated by `UpdateLeadStatusAction` when new status is `made_contact` or `attempted_contact`. Indexed for fast filtering/sorting on the list view. Not manually editable.

---

#### New JSON within `journey_meta`: Stage Tracking Fields

The existing `journey_meta` JSON already stores journey data. We extend it:

```json
{
  "stage": "ACAT_BOOKED",
  "follow_up_date": "2026-03-15",
  "last_contact_at": "2026-02-22T10:30:00Z",
  "purchase_intent": "hot",
  "attribution": "Website Enquiry"
}
```

> `follow_up_date` and `last_contact_at` are stored here (auto-calculated — not manually entered by staff).

---

#### New Enum: `LeadStatusEnum`

```php
enum LeadStatusEnum: string
{
    case NOT_CONTACTED = 'not_contacted';
    case ATTEMPTED_CONTACT = 'attempted_contact';
    case MADE_CONTACT = 'made_contact';
    case LOST = 'lost';
    case CONVERTED = 'converted'; // Set by LTH, read-only in LES
}
```

---

#### Traits Storage

Traits (FR-040, FR-041) are stored in `recipient_meta` JSON under a `traits` key:

```json
{
  "traits": {
    "preferred_communication": "phone",
    "best_time_to_call": "morning",
    "preferred_days": ["monday", "wednesday"],
    "personal_interests": "Gardening, reading...",
    "technology_comfort": "medium",
    "additional_notes": "..."
  }
}
```

> No new table needed — `recipient_meta` is already JSON-cast on Lead.

---

### API Contracts

#### New Staff LES Routes (prefix: `staff/leads`, guard: `lead-to-hca-conversion` flag)

All new routes added to existing `leadRoutes.php` under the same middleware group.

> **Note**: Tabs (Overview, Timeline, Other) are client-side state in `Show.vue` — no separate routes.

| Method | URI | Controller | Route Name |
|--------|-----|------------|------------|
| GET | `/staff/leads/create` | StaffLeadController@create | `staff.leads.create` |
| POST | `/staff/leads` | StaffLeadController@store | `staff.leads.store` |
| GET | `/staff/leads/{lead}/duplicate-check` | StaffLeadController@duplicateCheck | `staff.leads.duplicate-check` |
| POST | `/staff/leads/{lead}/timeline` | StaffLeadTimelineController@store | `staff.leads.timeline.store` |
| PUT | `/staff/leads/{lead}/section/{section}` | StaffLeadSectionController@update | `staff.leads.section.update` |
| PUT | `/staff/leads/{lead}/stage` | StaffLeadStageController@update | `staff.leads.stage.update` |
| PUT | `/staff/leads/{lead}/status` | StaffLeadStatusController@update | `staff.leads.status.update` |
| PUT | `/staff/leads/{lead}/assign` | StaffLeadAssignController@update | `staff.leads.assign.update` |
| POST | `/staff/leads/bulk-assign` | StaffLeadAssignController@bulk | `staff.leads.assign.bulk` |
| POST | `/staff/leads/export` | StaffLeadController@export | `staff.leads.export` |

> All field edits go through `/section/{section}`. No general `PUT /staff/leads/{lead}` — that route is removed.

> `{section}` param values: `lead-information`, `contact-information`, `personal-details`, `living-situation`, `support-needs`, `cultural-background`, `traits`

> `Show.vue` loads all 3 tabs' data in the single `staff.leads.show` Inertia response. Timeline data is deferred (Inertia v2 deferred props) to avoid blocking the initial page render.

#### New Consumer Routes (prefix: `leads`, guard: `lead-to-hca-conversion` flag)

New `leads.profile` route alongside the existing `leads.edit` wizard (which stays alive).

| Method | URI | Controller | Route Name |
|--------|-----|------------|------------|
| GET | `/leads/{lead}/profile` | LeadController@profile | `leads.profile` |
| PUT | `/leads/{lead}/section/{section}` | LeadSectionController@update | `leads.section.update` |

---

### UI Components

#### New Vue Pages

| Page | Route | Notes |
|------|-------|-------|
| `Staff/Leads/Show.vue` | `staff.leads.show` | Full rewrite — 2-panel with client-side tabs (Overview, Timeline, Other) |
| `Staff/Leads/Create.vue` | `staff.leads.create` | New guided create stepper (3 steps) |
| `Lead/Profile.vue` | `leads.profile` | New section-based consumer profile. Exists alongside `Lead/Edit.vue` (old wizard stays). |

> `Lead/Edit.vue` is NOT deleted in LES. Both routes coexist. Deprecation is LDS scope.

#### New Vue Components

| Component | Purpose | Common Components Used |
|-----------|---------|----------------------|
| `Leads/LeadProfileSidebar.vue` | Persistent sidebar (avatar, stage, status, assignment) | CommonAvatar, CommonBadge, CommonSelectMenu |
| `Leads/LeadJourneyStageBar.vue` | Horizontal 6-stage progress bar, click to open wizard | Custom SVG dots + lines |
| `Leads/SectionCard.vue` | Read/edit toggle card (ACRM pattern) | CommonCard, CommonForm, CommonFormField |
| `Leads/LeadStatusWizard.vue` | Status-specific wizard modal | CommonModal, CommonForm, CommonSelectMenu |
| `Leads/LeadStageWizard.vue` | Journey Stage update modal | CommonModal, CommonForm |
| `Leads/TimelineEntry.vue` | Single timeline event row | CommonAvatar, CommonBadge |
| `Leads/LeadQuickCreateModal.vue` | Quick create (name + email modal) | CommonModal, CommonForm, CommonFormField |
| `Leads/TraitsEditor.vue` | Traits section with inline edit | SectionCard, CommonSelectMenu, CommonInput |
| `Leads/LeadBulkAssignModal.vue` | Bulk assign modal for list view | CommonModal, CommonSelectMenu |

**Behavioural notes:**
- `SectionCard.vue` in edit mode registers `router.on('before', ...)` guard — shows browser confirm if user navigates away with unsaved changes
- `TimelineEntry.vue` timestamps: relative format ('2 hours ago', '3 days ago') with full datetime tooltip on hover. Uses existing Portal date utility pattern.

#### Modified Vue Components/Pages

| Component | Modification |
|-----------|-------------|
| `Staff/Leads/Index.vue` | Add: columns (Journey Stage, Lead Status, Assigned Agent), bulk action toolbar, quick create modal trigger. Rename KPI cards to LES context. |
| `Staff/Leads/StaffLeadsTable.vue` | Add columns, filters (Journey Stage, Lead Status, Assigned Agent), bulk selection |

---

## Implementation Phases

### Phase 1: Foundation + P1 Stories (US1–US5)

**Goal**: Staff can manage leads with a rich profile view, stage + status tracking, and inline section editing.

#### 1.1 — Database & Backend Foundation

- [ ] Migration: `add_assigned_user_id_to_leads_table`
- [ ] Migration: `add_lead_status_and_last_contact_at_to_leads_table` (adds `lead_status`, `last_contact_at`)
- [ ] Migration: `create_lead_timeline_entries_table`
- [ ] Migration: `create_lead_status_histories_table`
- [ ] Migration: `create_lead_stage_histories_table`
- [ ] Enum: `LeadStatusEnum` in `domain/Lead/Enums/`
- [ ] Update `Lead` model: add `lead_status` cast, `assigned_user_id` cast, `assigned()` relationship
- [ ] Update `LeadData` DTO: add nullable props `leadStatus`, `assignedUser` (UserData), `followUpDate`, `lastContactAt`, `purchaseIntent` directly. `fromModel()` populates from new columns + `journey_meta`. No separate DTO.
- [ ] New DTO: `LeadTimelineEntryData` (`fromModel()`, for Inertia deferred prop serialization)
- [ ] New DTO: `LeadStatusHistoryData`
- [ ] New DTO: `LeadContactData` (for contacts JSON array items: id, name, relationship, email, phone, contact_type)
- [ ] Update `LeadPolicy`:
  - `update` → any staff with `edit-lead` permission
  - `assign` → agents can self-assign (set `assigned_user_id = auth()->id()`); team leaders can assign anyone
  - `bulkAssign` → team leaders only (FR-025, FR-043)
- [ ] Update `SubmitConversionStep6Action` (or `SaveAndExitConversionAction` on completion): set `lead.lead_status = LeadStatusEnum::CONVERTED` when conversion status becomes `completed`. LES status wizard blocks setting converted directly.

#### 1.2 — Journey Stage + Status Actions

- [ ] Action: `UpdateLeadStatusAction` — validates transition, writes `lead_status_histories`, fires timeline entry. If new status is `made_contact`, also calls `UpdateLeadJourneyStageAction` to sync the stage captured in the wizard. Updates `lead.last_contact_at` when status is `made_contact` or `attempted_contact`.
- [ ] Action: `UpdateLeadJourneyStageAction` — extend existing to write `lead_stage_histories` + timeline entry
- [ ] Action: `CreateLeadTimelineEntryAction` — creates `lead_timeline_entries` record
- [ ] Add `displayStage(): string` and `substageLabel(): string` methods to `LeadJourneyStageEnum` — maps 10 cases to 6 display stages. `INACTIVE` maps to `'Active'` in `displayStage()` (hidden from UI, not removed from enum — safe for existing data)
- [ ] Update `LeadData::recipientProfileCompletedPercentage` — add 10% weight for Traits (same as other minor sections). Adjust existing weights: base 20% + aged care 20% + personal 15% + living 9% + support 9% + cultural 9% + management 9% + traits 9% = 100%

#### 1.3 — Section Update Actions

One action per section. Each has its own Data class with typed fields and validation rules. This is the most explicit, testable pattern:

- [ ] Action: `UpdateLeadInformationAction` + `UpdateLeadInformationData` (journey stage, lead status, purchase intent, attribution)
- [ ] Action: `UpdateLeadPersonalDetailsAction` + `UpdateLeadPersonalDetailsData` (name, DOB, gender, address)
- [ ] Action: `UpdateLeadLivingSituationAction` + `UpdateLeadLivingSituationData` (accommodation, current situation)
- [ ] Action: `UpdateLeadSupportNeedsAction` + `UpdateLeadSupportNeedsData` (what's important, care needs, support network)
- [ ] Action: `UpdateLeadCulturalBackgroundAction` + `UpdateLeadCulturalBackgroundData` (English proficiency, languages, ethnicity)
- [ ] Action: `UpdateLeadContactsAction` + `UpdateLeadContactsData` (add/edit/delete contacts, enforce single primary)
- [ ] Action: `UpdateLeadTraitsAction` + `UpdateLeadTraitsData` (writes to `recipient_meta.traits` JSON)

Each action writes to the appropriate JSON column slice and calls `CreateLeadTimelineEntryAction` with `event_type: 'section_edit'`.

#### 1.4 — Staff Controllers + Routes

- [ ] Add new LES routes to `leadRoutes.php` under `lead-to-hca-conversion` flag
- [ ] `StaffLeadController`: add `store()`, `create()`, `show()` (rewrite), `duplicateCheck()`, `export()`
  - `show()` returns: lead (full `LeadData`), sections (overview data), deferred `timeline` (paginated `LeadTimelineEntryData` collection)
  - `export()` streams CSV synchronously (all visible columns, up to ~5,000 rows)
- [ ] `StaffLeadTimelineController`: `store()` (note creation only — timeline entries read via deferred prop in show)
- [ ] `StaffLeadSectionController`: `update()` — reads `{section}` param, switches to the appropriate per-section action. Invalid section → `abort(404)`. One controller, clean URL, action carries the complexity.
- [ ] `StaffLeadStageController`: `update()` (calls `UpdateLeadJourneyStageAction`)
- [ ] `StaffLeadStatusController`: `update()` (calls `UpdateLeadStatusAction`)

#### 1.5 — List View Enhancements (US1)

- [ ] Update `StaffLeadController@index`: add `assignedUser`, `leadStatus`, `journeyStage` to serialized data; add filter scopes; add second KPI row (New This Week, Made Contact count, Lost count, Converted count) alongside existing LTH KPI cards
- [ ] Update `Lead` model: add scopes `scopeByJourneyStage()`, `scopeByLeadStatus()`, `scopeByAssignedUser()`
- [ ] Update `Staff/Leads/Index.vue`: add Journey Stage, Lead Status, Assigned Agent columns; add filter dropdowns; add second KPI row for LES stats below existing LTH cards
- [ ] Update `StaffLeadsTable.vue`: new columns + filter support
- [ ] Quick Create modal: `LeadQuickCreateModal.vue` — name + email form, `POST /staff/leads`

#### 1.6 — Lead Profile View (US2 + US3)

- [ ] `Staff/Leads/Show.vue` full rewrite:
  - Two-panel layout: `LeadProfileSidebar.vue` (fixed 280px) + main content area
  - `LeadJourneyStageBar.vue` at top of content
  - Tab navigation: Overview | Timeline | Other (using `<Link>` for tab switching)
  - Tab content: Overview renders `SectionCard` components for each section
- [ ] `LeadProfileSidebar.vue`: avatar, name, TC ID, journey stage badge, profile completion %, email, phone, DOB, assigned agent dropdown
- [ ] `LeadJourneyStageBar.vue`: 6-dot progress bar with connecting lines, current stage highlighted, click opens `LeadStageWizard`
- [ ] `SectionCard.vue`: shared component, read mode shows `CommonDefinitionItem` rows, edit mode shows `CommonForm` with `CommonFormField` inputs, save calls `PUT /staff/leads/{lead}/section/{section}`
- [ ] Sections on Overview: Lead Information, Contact Information, Personal Details, Living Situation, Support Needs, Cultural Background

#### 1.7 — Journey Stage Wizard (US4)

- [ ] `LeadStageWizard.vue`: Modal with 6-stage selector + mandatory field form for selected stage
- [ ] Stage mandatory fields config: hardcode in a `const STAGE_REQUIRED_FIELDS` map (can be extracted to config later)
- [ ] On save: `PUT /staff/leads/{lead}/stage`

#### 1.8 — Lead Status Wizards (US5)

- [ ] `LeadStatusWizard.vue`: Dynamic modal, renders different fields based on target status:
  - **Not Contacted**: no extra fields
  - **Attempted Contact**: Contact Method (required), Contact Outcome (required), Notes (optional)
  - **Made Contact**: Journey Stage (required), Attribution (required), Purchase Intent (required), Contact Method/Outcome/Follow-up Date/Notes (optional)
  - **Lost**: Lost Type (required), Lost Reason dynamic to type (required), Notes (optional)
- [ ] On save: `PUT /staff/leads/{lead}/status`

---

### Phase 2: P2 Stories (US6–US9)

**Goal**: Timeline tab, bulk assignment, consumer profile replacement, guided create stepper.

#### 2.1 — Timeline Tab (US6)

- [ ] `Staff/Leads/Timeline.vue`: paginated list of `LeadTimelineEntryData`, newest-first, grouped by date
- [ ] `TimelineEntry.vue`: icon by event_type, title, description, agent avatar, relative timestamp
- [ ] Add Note panel: textarea + `POST /staff/leads/{lead}/timeline`
- [ ] `StaffLeadTimelineController@index`: paginate 20 per page, eager load `creator`
- [ ] Timeline entries auto-created by all Phase 1 actions (stage, status, section edit, assignment, note)

#### 2.2 — Staff Assignment (US7)

- [ ] `StaffLeadAssignController`: `update()` (single assign), `bulk()` (bulk assign job dispatch)
- [ ] Action: `AssignLeadAction` — updates `assigned_user_id`, creates timeline entry
- [ ] Action: `BulkAssignLeadsAction` — dispatches `BulkLeadAssignmentJob` for batches >10, synchronous for ≤10
- [ ] Job: `BulkLeadAssignmentJob` — processes bulk assignment, fires toast on completion
- [ ] `LeadBulkAssignModal.vue`: staff search + confirm, shown from list view bulk toolbar
- [ ] List view: checkbox column + bulk action toolbar (`LeadBulkAssignModal`, export CSV)
- [ ] Auto-assignment on creation: `CreateLeadAction` sets `assigned_user_id = auth()->id()` for staff-created leads

#### 2.3 — Consumer Profile Replacement (US8)

- [ ] `Lead/Profile.vue`: new section-based consumer profile (My Details, Living Situation, Support Needs, Cultural Background, Management Option)
- [ ] Uses same `SectionCard.vue` component (different fields, consumer-facing labels)
- [ ] Route: `GET /leads/{lead}` → `LeadController@profile`
- [ ] Section update: `PUT /leads/{lead}/section/{section}` → `LeadSectionController@update`
- [ ] Profile completion indicator on consumer profile
- [ ] Incomplete sections: visual badge/indicator on section card
- [ ] Keep `Lead/Edit.vue` for backwards-compatible guest/wizard flow — do not delete yet

#### 2.4 — Internal Lead Creation (US9)

- [ ] Guided Create stepper: `Staff/Leads/Create.vue` (3 steps using `CommonStepNavigation`)
  - Step 1: Personal Details → `POST /staff/leads` (creates lead via `CreateLeadAction`, redirects to Step 2 with new lead ID)
  - Step 2: Aged Care Stage → `PUT /staff/leads/{lead}/section/lead-information`
  - Step 3: Contact Information → `PUT /staff/leads/{lead}/section/contact-information`
  - Reuses existing `CreateLeadAction` — same pattern as consumer wizard. Abandoned leads after Step 1 appear in list with 'Not Contacted' status and minimal data.
- [ ] On complete: redirect to `staff.leads.show` for new lead
- [ ] Duplicate email detection: `GET /staff/leads/duplicate-check?email=...` → returns existing lead if found
- [ ] Warning banner shown if duplicate found (proceed or navigate to existing). Email is NOT unique at DB level — duplicate check is advisory only. Staff can proceed with duplicate email if they choose (e.g. same email, different person).
- [ ] Route: `GET /staff/leads/create` → `StaffLeadController@create`
- [ ] Route: `POST /staff/leads` → `StaffLeadController@store` (both quick create and guided create use same endpoint, `source` param differentiates)

#### 2.5 — Other Tab: Attribution (US10 preview)

- [ ] `Staff/Leads/Other.vue`: Attribution section (read-only) + Traits section
- [ ] Attribution: renders `tracking_meta` fields in 3-column definition list (Traffic Source, UTM Parameters, Session Data)
- [ ] Empty state when no attribution data

---

### Phase 3: P3 Stories (US10–US11)

**Goal**: Attribution display + Traits editor.

#### 3.1 — Full Attribution Display (US10)

- [ ] Complete `Other.vue` attribution section with all 3 columns and tooltips
- [ ] `LeadTrackingMetaData` DTO already exists — use as-is

#### 3.2 — Traits Editor (US11)

- [ ] `TraitsEditor.vue`: inline edit section with fields for communication preferences, best time to call, preferred days, personal interests, tech comfort, notes
- [ ] On save: `PUT /staff/leads/{lead}/section/traits`
- [ ] `UpdateLeadSectionAction`: handle `traits` section by writing to `recipient_meta.traits` JSON
- [ ] Timeline entry on traits update
- [ ] Empty state encouragement message

---

## Testing Strategy

### Approach

Write tests alongside each phase. Feature tests for all HTTP endpoints. Unit tests for Actions and Enums. No browser tests for LES (covered by feature tests).

### Test Coverage Targets

**Phase 1 Tests** (`tests/Feature/Lead/`, `tests/Unit/Lead/`)

- `StaffLeadController`: index (with filters), show (overview), store, update, overview, other, duplicateCheck
- `StaffLeadStageController`: update (valid transition, stage history record, timeline entry created)
- `StaffLeadStatusController`: update for each status type (Not Contacted, Attempted Contact, Made Contact, Lost), validate required fields per status, history record + timeline entry
- `StaffLeadSectionController`: update each section, verify only that section's data changes in recipient_meta
- `UpdateLeadStatusAction`: unit tests per status transition
- `UpdateLeadJourneyStageAction`: unit tests, verify stage_history + timeline entry
- `CreateLeadTimelineEntryAction`: unit tests for each event_type
- `LeadJourneyStageMapper`: unit tests mapping 10 enum cases to 6 display stages

**Phase 2 Tests**

- `StaffLeadTimelineController`: index (paginated), store (note)
- `StaffLeadAssignController`: update (single assign, timeline entry), bulk (dispatches job)
- `BulkLeadAssignmentJob`: unit test batch assignment
- `AssignLeadAction`: unit test
- `LeadController@profile`: renders consumer profile with sections
- `LeadSectionController@update`: consumer section update (security: owner only)
- `Staff/Leads/Create.vue` (Pest): guided create stepper flow (if browser tests are added)

**Phase 3 Tests**

- `TraitsEditor` section update: `traits` written to `recipient_meta.traits` JSON
- Timeline entry on traits save

### Test Location

```
tests/
├── Feature/
│   └── Lead/
│       ├── StaffLeadControllerTest.php
│       ├── StaffLeadStageControllerTest.php
│       ├── StaffLeadStatusControllerTest.php
│       ├── StaffLeadSectionControllerTest.php
│       ├── StaffLeadTimelineControllerTest.php
│       ├── StaffLeadAssignControllerTest.php
│       └── LeadConsumerProfileTest.php
└── Unit/
    └── Lead/
        ├── UpdateLeadStatusActionTest.php
        ├── UpdateLeadJourneyStageActionTest.php
        ├── CreateLeadTimelineEntryActionTest.php
        ├── AssignLeadActionTest.php
        └── LeadJourneyStageMapperTest.php
```

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| `journey_meta` JSON schema drift (new fields break Zoho sync) | Medium | High | Never write Zoho-synced fields into journey_meta. Keep `LeadData::forZoho()` stable. Add test asserting forZoho output doesn't change. |
| `Lead/Edit.vue` wizard and new `Lead/Profile.vue` conflicting for same lead | Medium | Medium | `Lead/Profile.vue` is a new route (`leads.profile`). Old wizard stays on `leads.edit`. Route them separately; deprecate wizard in LDS. |
| Timeline performance with high volume entries | Low | Medium | Index `lead_id` on `lead_timeline_entries`. Paginate at 20/page. Add DB index on `(lead_id, created_at DESC)`. |
| `assigned_user_id` NULL for legacy leads | Medium | Low | Default filter on list view excludes unassigned leads from visible columns. Round-robin auto-assignment job for existing unassigned leads can be run post-deploy. |
| Bulk assignment blocking the request for large batches | Medium | Medium | Threshold: ≤10 synchronous, >10 dispatches `BulkLeadAssignmentJob`. Toast notification on completion. |
| `LeadStatusEnum::CONVERTED` read-only enforcement | Low | High | LES controllers reject `PUT /status` with `converted` as new status. Only LTH (conversion wizard) sets converted status. |

---

## Open Questions (From Gate 2)

- [x] **Feature flag**: Extend `lead-to-hca-conversion` — no new flag. (Dev clarify 2026-02-22)
- [x] **Journey Stage wizard mandatory fields**: Deferred to implementation — dev defines at build time. Not specified in plan. (Dev clarify 2026-02-22)
- [ ] **Pinned notes**: `is_pinned` column on `lead_timeline_entries`. Pinning is LDS — column reserved, no UI in LES.
- [x] **Consumer profile vs staff aggregate**: Same Eloquent model, separate controllers, separate authorization. No event sourcing boundary. (Dev clarify 2026-02-22)
- [ ] **Bulk assignment**: ≤10 leads → synchronous; >10 leads → `BulkLeadAssignmentJob` queued. Success feedback via toast.

---

## Development Clarifications

### Session 2026-02-22

- Q: New `lead-essential` flag or extend `lead-to-hca-conversion`? -> A: Extend existing `lead-to-hca-conversion` flag. All LES routes go under the same flag. No new PostHog flag needed.
- Q: Tab routing — separate Inertia pages or client-side tab state? -> A: Single `Show.vue` with client-side tab state. No separate routes for Timeline/Other tabs. URL does not change on tab switch. Timeline data loaded via Inertia v2 deferred props.
- Q: Section save — Inertia redirect-back or partial reload? -> A: Standard `useForm()` PUT + `redirect()->back()`. No partial reloads. Consistent with existing project patterns.
- Q: One `UpdateLeadSectionAction` dispatcher or one action per section? -> A: One action per section. Each has its own typed Data class and validation. (`UpdateLeadPersonalDetailsAction`, `UpdateLeadLivingSituationAction`, etc.)
- Q: Old `Lead/Edit.vue` wizard — delete in LES or keep? -> A: Keep wizard running. New `Lead/Profile.vue` is an additional route (`leads.profile`). Wizard deprecated in LDS, not LES.

### Session 2026-02-22 (Round 2)

- Q: `StaffLeadSectionController` — one controller switching on section param, or one controller per section? -> A: Single controller, switch on `{section}` param (Laravel best practice — resource controller pattern). Individual actions carry complexity, not the controller.
- Q: `Show.vue` data loading — all eager or timeline deferred? -> A: All in one `StaffLeadController@show` response. Timeline loaded as Inertia v2 deferred prop (async after initial render). Overview and sidebar render immediately.
- Q: `LeadData` extension — add new props directly or create separate DTOs? -> A: Add `leadStatus`, `assignedUser`, `followUpDate`, `lastContactAt`, `purchaseIntent` directly to `LeadData` as nullable props. `fromModel()` populates from new columns.
- Q: Contact Information storage — JSON in `recipient_meta` or new `lead_contacts` table? -> A: JSON array in `recipient_meta.contacts`. No new table. Single-primary rule enforced in `UpdateLeadContactsAction`.
- Q: Journey Stage display mapping — separate mapper class or methods on `LeadJourneyStageEnum`? -> A: Methods on the enum: `displayStage()` and `substageLabel()`. Enum owns its own presentation logic (standard Laravel enum pattern).

### Session 2026-02-22 (Round 3)

- Q: How to keep `lead_status = 'converted'` in sync with LTH completion? -> A: `SubmitConversionStep6Action` (on completion) sets `lead.lead_status = LeadStatusEnum::CONVERTED`. LES status wizard blocks setting converted directly. LTH is the source of truth for conversion.
- Q: Guided Create — how to handle partial abandonment mid-stepper? -> A: Step 1 calls `CreateLeadAction` (POST), leads created immediately. Steps 2-3 are PUT section updates. Abandoned leads exist with minimal data. Reuses existing action pattern — same as consumer wizard.
- Q: List view KPI cards — replace LTH cards or add alongside? -> A: Add LES KPIs as a second row alongside existing LTH conversion cards. New row: New This Week, Made Contact, Lost, Converted.
- Q: Traits weight in profile completion percentage? -> A: 10% (same as other minor sections). Adjust existing weights proportionally to sum to 100%.
- Q: `INACTIVE` enum case (dropped from spec) — remove or keep? -> A: Keep in enum (no data migration). `displayStage()` maps INACTIVE → 'Active' display stage. Invisible to staff in UI, safe for existing data.

### Session 2026-02-22 (Round 4)

- Q: Journey Stage wizard mandatory fields — define in plan or defer? -> A: Defer to implementation. Dev defines at build time.
- Q: FR-026a round-robin auto-assignment for public/Zoho leads — implement or descope? -> A: Descope from LES. Public/Zoho leads assigned to a configurable default agent. Round-robin deferred to LDS.
- Q: CSV export — synchronous stream or queued job? -> A: Synchronous `POST /staff/leads/export` streaming CSV response. Fine for up to ~5,000 rows.
- Q: Invalid `{section}` param in `StaffLeadSectionController` — 404 or 422? -> A: `abort(404)` — the resource doesn't exist. Standard RESTful behaviour.
- Q: `PUT /staff/leads/{lead}` general update route — keep or remove? -> A: Remove. All field updates go through `/section/{section}`. No ambiguity.

### Session 2026-02-22 (Round 5)

- Q: Who can change assigned agent from the profile sidebar? -> A: Agents can self-assign (set themselves). Team leaders can assign anyone. `LeadPolicy::assign()` enforces this.
- Q: Made Contact wizard captures Journey Stage — does it also write the stage? -> A: Yes. `UpdateLeadStatusAction` calls `UpdateLeadJourneyStageAction` when status is `made_contact`. Two writes, two timeline entries.
- Q: `last_contact_at` — computed on read or cached column? -> A: Cached column on `leads` table with index. Updated by `UpdateLeadStatusAction` on Made Contact / Attempted Contact. Indexed for list view filtering/sorting.
- Q: Duplicate email — unique constraint or advisory check only? -> A: Advisory only. No unique constraint on email. Duplicate check is a JS/API call. Staff can proceed with duplicate email if they choose.
- Q: Bulk assign permission? -> A: Team leaders only (FR-025, FR-043). Agents can use single self-assign from sidebar, not bulk assign.

### Session 2026-02-22 (Round 6)

- Q: Assignment rules — future direction? -> A: LES ships simple assignment (staff self-assign, team leader assign anyone). LDS will add configurable assignment rules: pure round-robin, least-loaded, hybrid. Also: a "lead steal" mechanic — if a lead has had no contact attempt for N hours (e.g. 72h), any staff member can claim it regardless of current assignment. **LES data model must support this without re-migration**: `assigned_user_id` stays nullable, `last_contact_at` (already planned) enables the staleness check. No rule engine in LES — just the columns that LDS will query.
- Q: Timeline timestamps — relative or absolute? -> A: Relative ('2 hours ago') with absolute datetime on hover. Matches existing Portal patterns.
- Q: Unsaved section edits — warn on navigation or silent discard? -> A: Warn using `router.on('before', ...)` when a section is in edit mode. Browser confirm dialog before navigating away.
- Q: `StaffLeadAssignController` — separate controller or on `StaffLeadController`? -> A: Separate `StaffLeadAssignController` as planned. Keeps `StaffLeadController` slim.

---

## Next Steps

1. Run Phase 1.1 migrations and model updates
2. Run tests: `php artisan test --compact --filter=Lead`
3. Proceed phase by phase, running tests at each step

