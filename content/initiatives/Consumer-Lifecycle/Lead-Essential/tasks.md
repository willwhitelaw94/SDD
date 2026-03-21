---
title: "Implementation Tasks: Lead Essential (LES)"
---

# Implementation Tasks: Lead Essential (LES)

**Spec**: [spec.md](spec.md)
**Plan**: [plan.md](plan.md)
**DB Spec**: [db-spec.md](db-spec.md)
**Created**: 2026-02-22
**Status**: Draft

---

## Phase 1 — Foundation (Migrations, Enums, Models, Core Actions)

> Blocking prerequisites for all user stories. No UI yet.

- [ ] T001 Migration: `add_assigned_user_id_to_leads_table` — nullable FK → `users.id`, ON DELETE SET NULL, indexed. File: `database/migrations/YYYY_add_assigned_user_id_to_leads_table.php`
- [ ] T002 Migration: `add_lead_status_and_last_contact_at_to_leads_table` — `lead_status` varchar(30) default `not_contacted`, `last_contact_at` timestamp nullable, both indexed. File: `database/migrations/YYYY_add_lead_status_and_last_contact_at_to_leads_table.php`
- [ ] T003 Migration: `create_lead_timeline_entries_table` — `id`, `lead_id` (FK cascade), `created_by` (FK nullable), `event_type` varchar(50), `title` varchar(200), `description` text nullable, `metadata` json nullable, `is_pinned` bool default false, `created_at` only (immutable). Composite index `(lead_id, created_at)`. File: `database/migrations/YYYY_create_lead_timeline_entries_table.php`
- [ ] T004 Migration: `create_lead_status_histories_table` — `id`, `lead_id` (FK cascade), `created_by` (FK), `previous_status` varchar(30) nullable, `new_status` varchar(30), `contact_method` varchar(50) nullable, `contact_outcome` varchar(50) nullable, `journey_stage` varchar(50) nullable, `purchase_intent` varchar(10) nullable, `attribution` varchar(100) nullable, `lost_type` varchar(30) nullable, `lost_reason` varchar(100) nullable, `follow_up_date` date nullable, `notes` text nullable, `created_at` only. File: `database/migrations/YYYY_create_lead_status_histories_table.php`
- [ ] T005 Migration: `create_lead_stage_histories_table` — `id`, `lead_id` (FK cascade), `created_by` (FK), `previous_stage` varchar(50) nullable, `new_stage` varchar(50), `mandatory_fields` json nullable, `created_at` only. File: `database/migrations/YYYY_create_lead_stage_histories_table.php`
- [ ] T006 [P] Enum: `LeadStatusEnum` — cases: `NOT_CONTACTED`, `ATTEMPTED_CONTACT`, `MADE_CONTACT`, `LOST`, `CONVERTED` (read-only in LES). File: `domain/Lead/Enums/LeadStatusEnum.php`
- [ ] T007 [P] Update `LeadJourneyStageEnum` — add `displayStage(): string` method (maps 10 cases to 6 display stages: Pre-Care, ACAT Booked, Approved, Allocated, Active, Converted; `INACTIVE` → 'Active') and `substageLabel(): string` method. File: `domain/Lead/Enums/LeadJourneyStageEnum.php`
- [ ] T008 [P] Update `Lead` model — add `lead_status` (cast `LeadStatusEnum`), `last_contact_at` (cast datetime), `assigned_user_id` to `$fillable`; add `assignedUser()` BelongsTo, `timelineEntries()` HasMany, `statusHistories()` HasMany, `stageHistories()` HasMany; add scopes `scopeByLeadStatus()`, `scopeByAssignedUser()`, `scopeByJourneyStage()`. File: `domain/Lead/Models/Lead.php`
- [ ] T009 [P] New model: `LeadTimelineEntry` — `$timestamps = false`, `const CREATED_AT`, `lead()` BelongsTo, `creator()` BelongsTo (User). File: `domain/Lead/Models/LeadTimelineEntry.php`
- [ ] T010 [P] New model: `LeadStatusHistory` — `$timestamps = false`, `const CREATED_AT`, `lead()` BelongsTo, `creator()` BelongsTo. File: `domain/Lead/Models/LeadStatusHistory.php`
- [ ] T011 [P] New model: `LeadStageHistory` — `$timestamps = false`, `const CREATED_AT`, `lead()` BelongsTo, `creator()` BelongsTo. File: `domain/Lead/Models/LeadStageHistory.php`
- [ ] T012 [P] New DTO: `LeadTimelineEntryData` — props: `id`, `leadId`, `createdBy` (UserData nullable), `eventType`, `title`, `description` nullable, `metadata` array nullable, `isPinned`, `createdAt`. `fromModel()` method. File: `domain/Lead/Data/LeadTimelineEntryData.php`
- [ ] T013 [P] New DTO: `LeadStatusHistoryData` — props matching `lead_status_histories` columns. `fromModel()` method. File: `domain/Lead/Data/LeadStatusHistoryData.php`
- [ ] T014 [P] New DTO: `LeadContactData` — props: `id` (UUID), `name`, `relationship` nullable, `email` nullable, `phone` nullable, `contactType` ('primary'|'secondary'). File: `domain/Lead/Data/LeadContactData.php`
- [ ] T015 Update `LeadData` DTO — add nullable props: `leadStatus` (LeadStatusEnum), `assignedUser` (UserData nullable), `followUpDate` (Carbon nullable), `lastContactAt` (Carbon nullable), `purchaseIntent` nullable. Update `fromModel()` to populate from new columns. File: `domain/Lead/Data/LeadData.php`
- [ ] T016 Action: `CreateLeadTimelineEntryAction` — accepts `Lead`, `event_type`, `title`, `description` nullable, `metadata` array nullable, `created_by` nullable. Creates `LeadTimelineEntry` record. File: `domain/Lead/Actions/CreateLeadTimelineEntryAction.php`
- [ ] T017 Update factories — add `assigned_user_id` (nullable), `lead_status` (default `not_contacted`), `last_contact_at` (nullable) to `LeadFactory::definition()`. Create `LeadTimelineEntryFactory`, `LeadStatusHistoryFactory`, `LeadStageHistoryFactory`. Files: `domain/Lead/Factories/`
- [ ] T018 Run migrations: `php artisan migrate --no-interaction`
- [ ] T019 Feature tests — Phase 1 models/enums. File: `tests/Unit/Lead/LeadStatusEnumTest.php`, `tests/Unit/Lead/LeadJourneyStageEnumTest.php`

---

## Phase 2 — Core Actions (Status, Stage, Section, Assignment)

> Backend logic for all write operations. Required before any controllers.

- [ ] T020 Action: `UpdateLeadStatusAction` — validates transition (no direct set of `converted`), writes `lead_status_histories` record with all wizard fields, updates `lead.lead_status`, updates `lead.last_contact_at` if status is `made_contact` or `attempted_contact`, calls `CreateLeadTimelineEntryAction` with `event_type: status_change`, calls `UpdateLeadJourneyStageAction` if status is `made_contact` (uses `journey_stage` from wizard data). File: `domain/Lead/Actions/UpdateLeadStatusAction.php`
- [ ] T021 Update `UpdateLeadJourneyStageAction` — extend to also write `lead_stage_histories` record and call `CreateLeadTimelineEntryAction` with `event_type: stage_change`. File: `domain/Lead/Actions/UpdateLeadJourneyStageAction.php`
- [ ] T022 [P] Action: `UpdateLeadInformationAction` + `UpdateLeadInformationData` — writes `journey_meta` fields (purchase_intent, attribution, follow_up_date), calls timeline entry with `event_type: section_edit`. Files: `domain/Lead/Actions/UpdateLeadInformationAction.php`, `domain/Lead/Data/UpdateLeadInformationData.php`
- [ ] T023 [P] Action: `UpdateLeadPersonalDetailsAction` + `UpdateLeadPersonalDetailsData` — writes `recipient_meta` personal fields (name, DOB, gender, address), calls timeline entry. Files: `domain/Lead/Actions/UpdateLeadPersonalDetailsAction.php`, `domain/Lead/Data/UpdateLeadPersonalDetailsData.php`
- [ ] T024 [P] Action: `UpdateLeadLivingSituationAction` + `UpdateLeadLivingSituationData` — writes `recipient_meta` living fields, calls timeline entry. Files: `domain/Lead/Actions/UpdateLeadLivingSituationAction.php`, `domain/Lead/Data/UpdateLeadLivingSituationData.php`
- [ ] T025 [P] Action: `UpdateLeadSupportNeedsAction` + `UpdateLeadSupportNeedsData` — writes `recipient_meta` support fields, calls timeline entry. Files: `domain/Lead/Actions/UpdateLeadSupportNeedsAction.php`, `domain/Lead/Data/UpdateLeadSupportNeedsData.php`
- [ ] T026 [P] Action: `UpdateLeadCulturalBackgroundAction` + `UpdateLeadCulturalBackgroundData` — writes `recipient_meta` cultural fields, calls timeline entry. Files: `domain/Lead/Actions/UpdateLeadCulturalBackgroundAction.php`, `domain/Lead/Data/UpdateLeadCulturalBackgroundData.php`
- [ ] T027 [P] Action: `UpdateLeadContactsAction` + `UpdateLeadContactsData` — writes `recipient_meta.contacts` JSON array, enforces exactly one `contact_type: primary` (422 if violated), calls timeline entry. Files: `domain/Lead/Actions/UpdateLeadContactsAction.php`, `domain/Lead/Data/UpdateLeadContactsData.php`
- [ ] T028 [P] Action: `UpdateLeadTraitsAction` + `UpdateLeadTraitsData` — writes `recipient_meta.traits` JSON, calls `CreateLeadTimelineEntryAction` with `event_type: traits_edit`. Files: `domain/Lead/Actions/UpdateLeadTraitsAction.php`, `domain/Lead/Data/UpdateLeadTraitsData.php`
- [ ] T029 Action: `AssignLeadAction` — updates `lead.assigned_user_id`, calls `CreateLeadTimelineEntryAction` with `event_type: assignment` including from/to user metadata. File: `domain/Lead/Actions/AssignLeadAction.php`
- [ ] T030 Action: `BulkAssignLeadsAction` — for batches ≤10 calls `AssignLeadAction` synchronously; for >10 dispatches `BulkLeadAssignmentJob`. File: `domain/Lead/Actions/BulkAssignLeadsAction.php`
- [ ] T031 Job: `BulkLeadAssignmentJob` — iterates lead IDs, calls `AssignLeadAction` for each. File: `domain/Lead/Jobs/BulkLeadAssignmentJob.php`
- [ ] T032 Update `LeadPolicy` — add `assign()` (agents = self-assign only; team leaders = any), `bulkAssign()` (team leaders only), `exportCsv()` (team leaders only). File: `domain/Lead/Policies/LeadPolicy.php`
- [ ] T033 Update `CreateLeadAction` — set `assigned_user_id = auth()->id()` for staff-created leads; set `lead_status = LeadStatusEnum::NOT_CONTACTED`; set `journey_stage = LeadJourneyStageEnum::UNKNOWN` in `journey_meta`; create timeline entry with `event_type: creation`. File: `domain/Lead/Actions/CreateLeadAction.php`
- [ ] T034 Unit tests — all Phase 2 actions. Files: `tests/Unit/Lead/UpdateLeadStatusActionTest.php`, `tests/Unit/Lead/UpdateLeadJourneyStageActionTest.php`, `tests/Unit/Lead/AssignLeadActionTest.php`, `tests/Unit/Lead/CreateLeadTimelineEntryActionTest.php`

---

## Phase 3 — US1: Staff Leads List View

> FR-001 to FR-006, FR-043 (permissions)

- [ ] T035 [US1] Update `StaffLeadController@index` — add eager loading of `assignedUser`, serialize `leadStatus`, `journeyStage` (display stage via `displayStage()`), `assignedUser` to Inertia prop; add filter scopes (`scopeByLeadStatus`, `scopeByAssignedUser`, `scopeByJourneyStage`); add second KPI row (New This Week, Made Contact count, Lost count, Converted count) alongside existing LTH cards. File: `domain/Lead/Controllers/StaffLeadController.php`
- [ ] T036 [US1] Update `Staff/Leads/Index.vue` — add columns: Journey Stage (display stage), Lead Status (badge), Assigned Agent; add filter dropdowns for Journey Stage, Lead Status, Assigned Agent; add second KPI row below existing cards; add "Create Lead" button with quick-create / guided-create split. File: `resources/js/Pages/Staff/Leads/Index.vue`
- [ ] T037 [US1] Update `StaffLeadsTable.vue` (or equivalent table component) — add new columns, filter state, bulk-select checkboxes. File: `resources/js/Pages/Staff/Leads/` (check actual filename)
- [ ] T038 [US1] New component: `LeadQuickCreateModal.vue` — CommonModal with CommonForm, fields: Lead Name (required), Email (required), Phone (optional), Relationship to recipient (optional), Notes (optional). On submit: `POST /staff/leads` with `source: quick`. On success: close modal, stay on list. File: `resources/js/Components/Leads/LeadQuickCreateModal.vue`
- [ ] T039 [US1] Feature test: list view returns correct columns, filters apply correctly, KPI counts match. File: `tests/Feature/Lead/StaffLeadControllerTest.php`

---

## Phase 4 — US2: Staff Lead Profile View

> FR-007, FR-008, FR-011, FR-011a

- [ ] T040 [US2] Add route `staff.leads.show` to `leadRoutes.php` (GET `/staff/leads/{lead}`). Update `StaffLeadController@show` to return full `LeadData`, deferred `timeline` prop (paginated `LeadTimelineEntryData`). File: `domain/Lead/Routes/leadRoutes.php`, `domain/Lead/Controllers/StaffLeadController.php`
- [ ] T041 [US2] New page: `Staff/Leads/Show.vue` — two-panel layout: fixed 280px `LeadProfileSidebar` + main content. Client-side tab state (Overview | Timeline | Other) using local `ref`. No URL change on tab switch. File: `resources/js/Pages/Staff/Leads/Show.vue`
- [ ] T042 [US2] New component: `LeadProfileSidebar.vue` — CommonAvatar (initials), name, TC Customer Number, Journey Stage badge (CommonBadge), profile completion % (CommonProgress), email + phone with copy buttons, DOB, assigned agent (CommonSelectMenu — single assign). On agent change: `PUT /staff/leads/{lead}/assign`. File: `resources/js/Components/Leads/LeadProfileSidebar.vue`
- [ ] T043 [US2] New component: `LeadJourneyStageBar.vue` — horizontal 6-dot progress bar with connecting lines. Current stage dot highlighted in teal-700. Click dot → opens `LeadStageWizard`. Shows substage label below active dot. File: `resources/js/Components/Leads/LeadJourneyStageBar.vue`
- [ ] T044 [US2] Feature test: `show` response contains LeadData + deferred timeline. File: `tests/Feature/Lead/StaffLeadControllerTest.php`

---

## Phase 5 — US3: Overview Tab (Section Editing)

> FR-009, FR-010, FR-028 to FR-030, FR-052

- [ ] T045 [US3] New component: `SectionCard.vue` — read mode: slot for `CommonDefinitionItem` rows + "Edit" button. Edit mode: slot for `CommonForm` with `CommonFormField` inputs + Save/Cancel buttons. On save: `PUT /staff/leads/{lead}/section/{section}` via `useForm()`. In edit mode, register `router.on('before', ...)` guard — browser confirm if navigating away unsaved. File: `resources/js/Components/Leads/SectionCard.vue`
- [ ] T046 [US3] Add routes to `leadRoutes.php`: `PUT /staff/leads/{lead}/section/{section}` → `StaffLeadSectionController@update`. File: `domain/Lead/Routes/leadRoutes.php`
- [ ] T047 [US3] New controller: `StaffLeadSectionController` — `update()` switches on `{section}` param, routes to correct action. Invalid section → `abort(404)`. Sections: `lead-information`, `contact-information`, `personal-details`, `living-situation`, `support-needs`, `cultural-background`, `traits`. Returns `redirect()->back()`. File: `domain/Lead/Controllers/StaffLeadSectionController.php`
- [ ] T048 [US3] Overview tab in `Show.vue` — renders `SectionCard` for each section: Lead Information, Contact Information, Personal Details, Living Situation, Support Needs, Cultural Background. Each section passes correct `section` param to `SectionCard`. File: `resources/js/Pages/Staff/Leads/Show.vue`
- [ ] T049 [US3] Feature test: each section update writes only that section's data, other sections unchanged, `redirect()->back()` returned. File: `tests/Feature/Lead/StaffLeadSectionControllerTest.php`

---

## Phase 6 — US4: Journey Stage Wizard

> FR-011, FR-012, FR-013

- [ ] T050 [US4] Add route: `PUT /staff/leads/{lead}/stage` → `StaffLeadStageController@update`. File: `domain/Lead/Routes/leadRoutes.php`
- [ ] T051 [US4] New controller: `StaffLeadStageController` — `update()` calls `UpdateLeadJourneyStageAction`, returns `redirect()->back()`. File: `domain/Lead/Controllers/StaffLeadStageController.php`
- [ ] T052 [US4] New component: `LeadStageWizard.vue` — CommonModal with 6-stage selector (buttons matching `LeadJourneyStageBar` display stages). On stage select: show mandatory fields for that stage (defined in `const STAGE_REQUIRED_FIELDS` map). On save: `PUT /staff/leads/{lead}/stage`. File: `resources/js/Components/Leads/LeadStageWizard.vue`
- [ ] T053 [US4] Feature test: stage update writes `lead_stage_histories`, creates timeline entry, updates `journey_meta.stage`. File: `tests/Feature/Lead/StaffLeadStageControllerTest.php`

---

## Phase 7 — US5: Lead Status Wizards

> FR-014 to FR-020

- [ ] T054 [US5] Add route: `PUT /staff/leads/{lead}/status` → `StaffLeadStatusController@update`. File: `domain/Lead/Routes/leadRoutes.php`
- [ ] T055 [US5] New controller: `StaffLeadStatusController` — `update()` calls `UpdateLeadStatusAction`, returns `redirect()->back()`. Rejects `converted` as target status (403). File: `domain/Lead/Controllers/StaffLeadStatusController.php`
- [ ] T056 [US5] New component: `LeadStatusWizard.vue` — CommonModal with dynamic fields per target status:
  - Not Contacted: no extra fields
  - Attempted Contact: Contact Method (required), Contact Outcome (required), Notes (optional)
  - Made Contact: Journey Stage (required), Attribution (required), Purchase Intent (required), Contact Method, Outcome, Follow-up Date, Notes (all optional)
  - Lost: Lost Type (required), Lost Reason dynamic to type (required), Notes (optional)
  On save: `PUT /staff/leads/{lead}/status`. File: `resources/js/Components/Leads/LeadStatusWizard.vue`
- [ ] T057 [US5] Feature test: status update for each target status — correct fields required, `lead_status_histories` record written, timeline entry created, `last_contact_at` updated for made_contact/attempted_contact, `converted` rejected. File: `tests/Feature/Lead/StaffLeadStatusControllerTest.php`

---

## Phase 8 — US6: Lead Timeline & Notes (P2)

> FR-021 to FR-023, FR-048

- [ ] T058 [US6] Add routes: `POST /staff/leads/{lead}/timeline` → `StaffLeadTimelineController@store`. Deferred prop `timeline` on `staff.leads.show`. File: `domain/Lead/Routes/leadRoutes.php`
- [ ] T059 [US6] New controller: `StaffLeadTimelineController` — `store()` creates note entry via `CreateLeadTimelineEntryAction` (event_type: note, description = note text), returns `redirect()->back()`. File: `domain/Lead/Controllers/StaffLeadTimelineController.php`
- [ ] T060 [US6] New component: `TimelineEntry.vue` — icon by `event_type`, title, description (collapsible if long), CommonAvatar for creator, relative timestamp ('2 hours ago') with full datetime tooltip on hover. File: `resources/js/Components/Leads/TimelineEntry.vue`
- [ ] T061 [US6] Timeline tab in `Show.vue` — paginated list of `LeadTimelineEntryData`, newest-first, grouped by date. Add Note panel: textarea + submit (`POST /staff/leads/{lead}/timeline`). Uses Inertia v2 deferred prop for `timeline`. File: `resources/js/Pages/Staff/Leads/Show.vue`
- [ ] T062 [US6] Feature test: note creation appears in timeline, auto-generated entries appear for all action types. File: `tests/Feature/Lead/StaffLeadTimelineControllerTest.php`

---

## Phase 9 — US7: Staff Assignment (P2)

> FR-024 to FR-027

- [ ] T063 [US7] Add routes: `PUT /staff/leads/{lead}/assign` → `StaffLeadAssignController@update`, `POST /staff/leads/bulk-assign` → `StaffLeadAssignController@bulk`. File: `domain/Lead/Routes/leadRoutes.php`
- [ ] T064 [US7] New controller: `StaffLeadAssignController` — `update()` calls `AssignLeadAction` (policy gate: agent = self only, leader = any), `bulk()` calls `BulkAssignLeadsAction` (policy gate: team leaders only). Both return `redirect()->back()`. File: `domain/Lead/Controllers/StaffLeadAssignController.php`
- [ ] T065 [US7] New component: `LeadBulkAssignModal.vue` — CommonModal with staff search (CommonSelectMenu), confirm button. On save: `POST /staff/leads/bulk-assign` with selected lead IDs + agent ID. File: `resources/js/Components/Leads/LeadBulkAssignModal.vue`
- [ ] T066 [US7] List view bulk toolbar — checkbox column on table, floating toolbar appears on selection with "Bulk Assign" action (opens `LeadBulkAssignModal`). File: `resources/js/Pages/Staff/Leads/Index.vue`
- [ ] T067 [US7] Feature test: single assign (agent self-assign succeeds, agent assign-other fails, leader assign-other succeeds), bulk assign dispatches job, timeline entry created. File: `tests/Feature/Lead/StaffLeadAssignControllerTest.php`

---

## Phase 10 — US8: Consumer Profile Management (P2)

> FR-031 to FR-034, FR-053

- [ ] T068 [US8] Add consumer routes: `GET /leads/{lead}/profile` → `LeadController@profile`, `PUT /leads/{lead}/section/{section}` → `LeadSectionController@update`. File: `domain/Lead/Routes/leadRoutes.php` (consumer route group)
- [ ] T069 [US8] Update `LeadController` — add `profile()` method returning sections data. File: `domain/Lead/Controllers/LeadController.php`
- [ ] T070 [US8] New controller: `LeadSectionController` — `update()` switches on `{section}` param (same as staff controller), routes to section actions. Authorization: `lead.owner` only. Returns `redirect()->back()`. File: `domain/Lead/Controllers/LeadSectionController.php`
- [ ] T071 [US8] New page: `Lead/Profile.vue` — section-based consumer profile. Sections: My Details, Living Situation, Support Needs, Cultural Background, Management Option. Reuses `SectionCard.vue` (section param: consumer labels). Profile completion indicator at top. Incomplete sections show visual badge. File: `resources/js/Pages/Lead/Profile.vue`
- [ ] T072 [US8] Feature test: consumer can edit own sections, cannot edit other lead's sections, section save updates only that section. File: `tests/Feature/Lead/LeadConsumerProfileTest.php`

---

## Phase 11 — US9: Internal Lead Creation (P2)

> FR-035, FR-035a, FR-036, FR-037

- [ ] T073 [US9] Add routes: `GET /staff/leads/create` → `StaffLeadController@create`, `POST /staff/leads` → `StaffLeadController@store`, `GET /staff/leads/duplicate-check` → `StaffLeadController@duplicateCheck`. File: `domain/Lead/Routes/leadRoutes.php`
- [ ] T074 [US9] Update `StaffLeadController` — add `create()` (returns `Create` Inertia page), `store()` (calls `CreateLeadAction`, returns redirect to show or back depending on `source` param), `duplicateCheck()` (searches leads by email, returns matching lead or null as JSON). File: `domain/Lead/Controllers/StaffLeadController.php`
- [ ] T075 [US9] New page: `Staff/Leads/Create.vue` — 3-step guided create using `CommonStepNavigation`. Step 1: Personal Details → `POST /staff/leads` (creates lead, redirects to Step 2 with new lead ID). Step 2: Aged Care Stage → `PUT /staff/leads/{lead}/section/lead-information`. Step 3: Contact Information → `PUT /staff/leads/{lead}/section/contact-information`. On completion: redirect to `staff.leads.show`. File: `resources/js/Pages/Staff/Leads/Create.vue`
- [ ] T076 [US9] Duplicate email check — `LeadQuickCreateModal.vue` and `Create.vue` both call `GET /staff/leads/duplicate-check?email=...` on email blur. Show warning banner if match found with link to existing lead. Submission still allowed. File: `resources/js/Components/Leads/LeadQuickCreateModal.vue`, `resources/js/Pages/Staff/Leads/Create.vue`
- [ ] T077 [US9] Feature test: quick create (POST /staff/leads source=quick), guided create (3-step flow), duplicate-check returns existing lead when email matches, default status/stage set on creation. File: `tests/Feature/Lead/StaffLeadControllerTest.php`

---

## Phase 12 — US10: Attribution Display (P3)

> FR-038, FR-039

- [ ] T078 [US10] Other tab in `Show.vue` — Attribution section (read-only): 3-column `CommonDefinitionList` (Traffic Source, UTM Parameters, Session Data). Empty state when `tracking_meta` is empty. File: `resources/js/Pages/Staff/Leads/Show.vue`
- [ ] T079 [US10] Feature test: Other tab attribution data serialized correctly from `tracking_meta`. File: `tests/Feature/Lead/StaffLeadControllerTest.php`

---

## Phase 13 — US11: Lead Traits (P3)

> FR-040 to FR-042

- [ ] T080 [US11] New component: `TraitsEditor.vue` — `SectionCard` with fields: preferred communication (CommonSelectMenu: Phone/Email/SMS), best time to call (Morning/Afternoon/Evening), preferred days (multi-select), personal interests (CommonInput textarea), technology comfort (Low/Medium/High), additional notes (CommonInput). On save: `PUT /staff/leads/{lead}/section/traits`. Empty state when no traits set. File: `resources/js/Components/Leads/TraitsEditor.vue`
- [ ] T081 [US11] Other tab in `Show.vue` — add `TraitsEditor` below Attribution section. File: `resources/js/Pages/Staff/Leads/Show.vue`
- [ ] T082 [US11] Feature test: traits section saves to `recipient_meta.traits` JSON, timeline entry created. File: `tests/Feature/Lead/StaffLeadSectionControllerTest.php`

---

## Phase 14 — CSV Export

> FR-005

- [ ] T083 Add route: `POST /staff/leads/export` → `StaffLeadController@export`. File: `domain/Lead/Routes/leadRoutes.php`
- [ ] T084 Update `StaffLeadController` — add `export()` method: apply same filters as index, stream CSV response with all visible columns. Policy gate: team leaders only. File: `domain/Lead/Controllers/StaffLeadController.php`
- [ ] T085 List view — "Export CSV" button in bulk toolbar (or standalone). `POST /staff/leads/export` with current filter state. File: `resources/js/Pages/Staff/Leads/Index.vue`

---

## Phase 15 — Cross-Cutting Concerns & Polish

- [ ] T086 Run `vendor/bin/pint --dirty` across all modified PHP files before PR
- [ ] T087 Verify `LeadData::forZoho()` output unchanged — add test asserting Zoho payload shape. File: `tests/Unit/Lead/LeadDataTest.php`
- [ ] T088 Verify `lead_status = 'converted'` set by `SubmitConversionStep6Action` (or equivalent LTH completion action) — check LTH action and add hook if missing. File: LTH action (do not modify LTH controllers)
- [ ] T089 Verify Pennant flag `lead-to-hca-conversion` gates all new routes — test a new route without flag returns 403/404. File: `tests/Feature/Lead/StaffLeadControllerTest.php`
- [ ] T090 Performance: confirm indexes on `leads.lead_status`, `leads.last_contact_at`, `leads.assigned_user_id`, `lead_timeline_entries.(lead_id, created_at)` are present. Run `SHOW INDEX FROM` via tinker if needed.

---

## Summary

| Phase | User Story | Task Count | Priority |
|-------|------------|-----------|----------|
| 1 | Foundation | T001–T019 (19) | P1 (blocking) |
| 2 | Core Actions | T020–T034 (15) | P1 (blocking) |
| 3 | US1 List View | T035–T039 (5) | P1 |
| 4 | US2 Profile View | T040–T044 (5) | P1 |
| 5 | US3 Overview Tab | T045–T049 (5) | P1 |
| 6 | US4 Journey Stage | T050–T053 (4) | P1 |
| 7 | US5 Lead Status | T054–T057 (4) | P1 |
| 8 | US6 Timeline | T058–T062 (5) | P2 |
| 9 | US7 Assignment | T063–T067 (5) | P2 |
| 10 | US8 Consumer Profile | T068–T072 (5) | P2 |
| 11 | US9 Lead Creation | T073–T077 (5) | P2 |
| 12 | US10 Attribution | T078–T079 (2) | P3 |
| 13 | US11 Traits | T080–T082 (3) | P3 |
| 14 | CSV Export | T083–T085 (3) | P2 |
| 15 | Polish | T086–T090 (5) | Cross-cutting |
| **Total** | | **90 tasks** | |

**Parallel opportunities** (tasks marked `[P]`): T006–T015 (enums, models, DTOs) can all run in parallel after T001–T005 migrations land. T020–T028 (section actions) can run in parallel. T040–T043 (profile view components) can run in parallel.

**MVP scope (P1 only)**: T001–T057 — Foundation through Lead Status Wizards.
