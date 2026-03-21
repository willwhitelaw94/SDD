---
title: "Feature Specification: Incident Management Phase 1"
---

# Feature Specification: Incident Management Phase 1

**Epic**: ICM — Incident Management
**Linear**: [ICM Incident Management](https://linear.app/trilogycare/project/icm-incident-management-b30dd804abdb)
**Created**: 2026-02-12
**Status**: Draft
**Input**: User description: "Get incidents visible and raisable from Portal — intake form based on Marianne's redesigned form, Edit page for viewing/editing incidents, client-record visibility during calls, triage at intake, and basic SIRS deadline tracking. Phase 1 keeps CRM for editing as fallback while Portal becomes the primary intake point."

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Raise an Incident from Portal (Priority: P1)

As a **Care Partner**, I want to raise a new incident directly in Portal using a form designed around SIRS requirements — so that I can report incidents where I actually work without switching to Zoho CRM.

**Why this priority**: This is the foundational capability. Currently ~930 incidents per month are created exclusively in CRM, forcing care partners to context-switch. Marianne has redesigned the incident form to be SIRS-compliant and "reduce everyone's time". Without Portal intake, the entire ICM initiative stalls.

**Independent Test**: Can be fully tested by navigating to a recipient's package, clicking "Raise Incident", filling in the form (date, description, origin, classification, triage category), and saving. The incident appears in the package incidents tab and the global incidents list.

**Acceptance Scenarios**:

1. **Given** a Care Partner is on a recipient's package view, **When** they click "Raise Incident", **Then** an incident form opens with required fields: occurred date, reported date, reported by, description, origin (Incident/Accident/Change), classification (Clinical/Non-clinical/SIRS), and triage category (CAT 1–5)

2. **Given** the Care Partner fills in all required fields and saves, **When** the incident is created, **Then** it appears in the package incidents tab, the global incidents list, and an audit trail entry is recorded with the creating user and timestamp

3. **Given** the Care Partner selects "SIRS" as the classification, **When** they proceed, **Then** additional SIRS-specific fields appear: reportable incident type (8 SIRS types), SIRS priority (Priority 1 or Priority 2), and SIRS reporting deadline (auto-calculated: 24 hours for P1, 30 days for P2 from reported date)

4. **Given** the Care Partner leaves required fields blank and attempts to save, **When** validation runs, **Then** the system highlights each missing field and prevents saving

5. **Given** the Care Partner selects a triage category of CAT 1 or CAT 2, **When** the incident is saved, **Then** it is flagged as requiring clinical nurse review

---

### User Story 2 — View and Edit Incidents in Portal (Priority: P1)

As a **Care Partner**, I want to view the full details of any incident and edit it directly in Portal — so that I can update incident information, add resolution details, and progress incidents through their lifecycle without opening CRM.

**Why this priority**: The Edit.vue page is the most documented gap in the current system — the route and action exist but the page is missing. Without edit capability, Portal remains read-only and care partners must still use CRM for any changes.

**Independent Test**: Can be tested by clicking on any incident in the list or package tab, viewing all its details, editing a field (e.g., adding a solution), and saving. The changes persist and appear in the audit trail.

**Acceptance Scenarios**:

1. **Given** a Care Partner clicks on an incident from the incidents list or package tab, **When** the edit page loads, **Then** they see all incident fields: dates, reporter, description, origin, classification, triage, resolution, solution, outcomes, clinical nurse review status, and hospitalisation status

2. **Given** a Care Partner updates the incident's resolution to "Management Plan" and adds solution text, **When** they save, **Then** the changes persist and the audit trail records the update with the user and timestamp

3. **Given** an incident was originally synced from Zoho CRM, **When** the Care Partner views it, **Then** all synced data is displayed and the incident is editable in Portal

4. **Given** a Care Partner changes the stage from "New" to "Resolved", **When** they save, **Then** the stage updates and the resolution field becomes required

5. **Given** a Care Partner edits an incident with SIRS classification, **When** they view the SIRS section, **Then** they see the SIRS priority, reportable incident type, and calculated deadline — all editable

---

### User Story 3 — See Incident History on Client Record (Priority: P1)

As a **Care Partner**, I want to see a recipient's incident history when viewing their package — so that I have full context during calls and can see past incidents alongside care plans and risk profiles.

**Why this priority**: Care partners currently can't see incident history when calling clients — information is trapped in CRM. This is one of Marianne's primary motivations: "care partners can see incident history during client calls — informed conversations."

**Independent Test**: Can be tested by navigating to a package that has incidents and verifying the incidents tab shows a summary list with key details, sorted by most recent first.

**Acceptance Scenarios**:

1. **Given** a recipient's package has 5 incidents, **When** a Care Partner opens the package view and clicks the Incidents tab, **Then** they see all 5 incidents listed with: occurred date, classification, triage category, stage, and description summary

2. **Given** the incidents tab is loaded, **When** the Care Partner scans the list, **Then** incidents are sorted by occurred date (most recent first) and SIRS-classified incidents are visually distinguished (e.g., badge or colour indicator)

3. **Given** an incident has a triage category of CAT 1 or CAT 2, **When** it appears in the list, **Then** it shows a visual urgency indicator so the Care Partner immediately knows it's high priority

4. **Given** a package has no incidents, **When** the Care Partner opens the Incidents tab, **Then** an empty state message is shown (e.g., "No incidents recorded for this package") with a "Raise Incident" action

---

### User Story 4 — Triage at Intake (Priority: P2)

As a **Care Partner**, I want the system to guide me through triage when raising an incident — so that incidents are correctly categorised from the start and routed to the right person without requiring a second triage step.

**Why this priority**: Marianne's redesigned form includes improved triage logic at the point of intake. Getting triage right upfront reduces rework and ensures clinical nurses see the right incidents early. This is a precursor to Phase 2's auto-escalation.

**Independent Test**: Can be tested by raising an incident and verifying that the triage category selection includes clear descriptions of each category and the system flags SIRS-reportable scenarios.

**Acceptance Scenarios**:

1. **Given** a Care Partner is raising an incident and selects classification "SIRS", **When** they proceed to triage, **Then** the system presents the SIRS Priority decision tree: "Has/could the incident cause harm requiring treatment?" → Priority 1; "Involves sexual contact, death, or unexplained absence?" → Priority 1; "Reasonable grounds to report to police?" → Priority 1; otherwise → Priority 2

2. **Given** a Care Partner selects triage category CAT 1 or CAT 2, **When** the incident is saved, **Then** the incident is automatically flagged for clinical nurse review (`is_reviewed` remains false until a clinical nurse marks it reviewed)

3. **Given** a Care Partner is uncertain about the triage category, **When** they view the triage options, **Then** each category (CAT 1–5) shows a clear description: CAT 1 "Critical — immediate risk to life", CAT 2 "High — serious harm potential", CAT 3 "Medium — moderate harm", CAT 4 "Low — minor impact", CAT 5 "Minimal — observation only"

4. **Given** the Care Partner selects a triage category and classification, **When** they save, **Then** the incident record captures both the original triage and classification as set at intake (immutable intake snapshot for audit purposes)

---

### User Story 5 — Basic SIRS Deadline Tracking (Priority: P2)

As a **Clinical Team Member**, I want the system to calculate and display SIRS reporting deadlines — so that I can see which incidents need to be reported to the ACQSC and when, without relying on memory or spreadsheets.

**Why this priority**: SIRS compliance is currently manual and relies on human memory. Priority 1 incidents must be reported within 24 hours — missing this is a regulatory breach. Even basic deadline visibility is a significant compliance improvement.

**Independent Test**: Can be tested by creating a SIRS-classified incident with Priority 1, checking that the deadline shows as 24 hours from reported date, and verifying the incident appears in a "SIRS deadlines" filtered view.

**Acceptance Scenarios**:

1. **Given** an incident is classified as SIRS with Priority 1, **When** it is saved, **Then** the system calculates a deadline of 24 hours from the reported date and displays it on the incident record

2. **Given** an incident is classified as SIRS with Priority 2, **When** it is saved, **Then** the system calculates a deadline of 30 days from the reported date and displays it on the incident record

3. **Given** a SIRS deadline is approaching (within 4 hours for P1, within 3 days for P2), **When** a Clinical Team Member views the incidents list, **Then** the incident shows a visual warning indicator (e.g., amber for approaching, red for overdue)

4. **Given** the Clinical Team Member wants to see all SIRS incidents, **When** they filter the global incidents list by classification "SIRS", **Then** they see all SIRS incidents sorted by deadline urgency (nearest deadline first) with clear P1/P2 indicators and days/hours remaining

5. **Given** a SIRS incident has been reported to the ACQSC, **When** the Clinical Team Member marks it as "Reported", **Then** the deadline warning is removed and the report date is recorded

---

### User Story 6 — Gradual Rollout via Feature Flag (Priority: P2)

As a **Product Owner**, I want to enable the Portal incident intake form per organisation — so that we can roll it out gradually while CRM remains the fallback for organisations not yet switched over.

**Why this priority**: Phase 1 runs in parallel with CRM during transition. Some organisations need time to adjust workflows. The feature flag allows co-design with early adopters as Marianne recommended.

**Independent Test**: Can be tested by enabling the flag for one organisation and verifying they see the "Raise Incident" button and edit capability, while another organisation still sees the read-only incident views.

**Acceptance Scenarios**:

1. **Given** the feature flag is enabled for Organisation A, **When** a Care Partner from Organisation A views incidents, **Then** they see the "Raise Incident" button and can create and edit incidents in Portal

2. **Given** the feature flag is disabled for Organisation B, **When** a Care Partner from Organisation B views incidents, **Then** they see the current read-only incident views (no create/edit capability — incidents managed in CRM)

3. **Given** the feature flag is toggled on for an organisation, **When** new incidents are created in Portal, **Then** they are stored in Portal as the source of truth (not synced back to CRM)

4. **Given** the Zoho sync job receives an incident update from CRM, **When** the feature flag is enabled for that organisation, **Then** the sync still processes updates for existing CRM-originated incidents (dual-system coexistence)

---

### User Story 7 — Zoho Sync Coexistence (Priority: P3)

As a **System Administrator**, I want existing Zoho CRM incident sync to continue working alongside the new Portal intake — so that there's no disruption during the transition period and historical data remains accessible.

**Why this priority**: ~2,781 incidents per quarter already exist via CRM sync. Breaking this during Phase 1 would be catastrophic. This story ensures the sync continues while Portal intake adds new capability alongside it.

**Independent Test**: Can be tested by triggering a Zoho webhook for an incident and verifying it still syncs correctly to Portal, even for organisations where the new intake flag is enabled.

**Acceptance Scenarios**:

1. **Given** the Zoho sync job receives a webhook for a new incident, **When** the job processes, **Then** the incident is created in Portal with all existing field mappings intact

2. **Given** an incident was created in Portal (not CRM), **When** the Zoho sync job runs, **Then** Portal-originated incidents are not affected or overwritten

3. **Given** an incident exists in both CRM and Portal (synced), **When** a Care Partner edits it in Portal, **Then** the Portal version is updated but no sync back to CRM occurs (one-way sync preserved during Phase 1)

4. **Given** an incident was synced from CRM, **When** a Care Partner views it in Portal, **Then** the CRM origin is indicated (e.g., "Synced from CRM" label) to distinguish it from Portal-originated incidents

---

### Out of Scope (Phase 2)

- **Incident → Case automation** — creating clinical pathways/cases from incident resolution (depends on CLI epic)
- **Auto-escalation routing** — automatic routing to clinical nurse or POD leader based on triage category
- **Risk profile auto-update** — incidents automatically updating risk scores (depends on RNC2)
- **Notifications and alerts** — email/in-app alerts on new incidents, escalations, approaching deadlines
- **Export and analytics** — trend analysis, pattern detection, Commission-ready reporting
- **Care plan review trigger** — automatic care plan review prompt after incident (depends on RNC2)
- **Full CRM deprecation** — Phase 1 runs alongside CRM; full migration is Phase 2
- **Bi-directional CRM sync** — Portal → CRM updates are not in scope; sync remains one-way

### Edge Cases

- What happens when an incident is created in Portal for a package that also has CRM-synced incidents? — Both coexist in the same list; Portal-originated incidents are distinguished from CRM-synced ones
- What happens if the Zoho webhook fires for an incident that was already edited in Portal? — CRM sync updates CRM-originated incidents only; Portal-originated incidents are never overwritten by CRM data
- What happens when a Care Partner changes classification from "Non-clinical" to "SIRS" during editing? — SIRS fields appear and become required; deadline is calculated from the reported date
- What happens when a SIRS deadline has already passed when the incident is first classified as SIRS? — The deadline shows as overdue immediately; the system does not prevent saving
- What happens when an incident is soft-deleted? — It is removed from the default list but retained for audit; SIRS-classified incidents cannot be deleted (only resolved)
- What happens when triage category is changed after initial intake? — Both the original intake triage and the current triage are recorded for audit trail purposes

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow Care Partners to create incidents directly in Portal with fields: occurred date, reported date, reported by (auto-populated with current user), description, origin (Incident/Accident/Change-Deterioration), classification (Clinical/Non-clinical/SIRS), triage category (CAT 1–5)
- **FR-002**: System MUST provide the missing Edit page for viewing and editing all incident fields including: stage, resolution, solution, outcomes, clinical nurse review status, and hospitalisation status
- **FR-003**: System MUST display SIRS-specific fields when classification is "SIRS": reportable incident type (8 types per Aged Care Act 2024), SIRS priority (P1/P2), and reporting deadline
- **FR-004**: System MUST auto-calculate SIRS reporting deadlines: 24 hours from reported date for Priority 1, 30 days from reported date for Priority 2
- **FR-005**: System MUST display deadline urgency indicators on SIRS incidents: approaching (amber) and overdue (red)
- **FR-006**: System MUST allow Clinical Team Members to mark a SIRS incident as "Reported" and record the report date
- **FR-007**: System MUST flag incidents with CAT 1 or CAT 2 triage as requiring clinical nurse review
- **FR-008**: System MUST display triage category descriptions during intake to guide correct classification
- **FR-009**: System MUST present the SIRS Priority decision tree when classification is "SIRS" to guide correct priority assignment
- **FR-010**: System MUST capture an immutable intake snapshot recording the original triage category and classification at time of creation (separate from current values if later changed)
- **FR-011**: System MUST show incidents on the package view with: occurred date, classification, triage category, stage, description summary, and SIRS status where applicable
- **FR-012**: System MUST sort package incidents by occurred date (most recent first) with visual distinction for SIRS-classified and high-triage (CAT 1–2) incidents
- **FR-013**: System MUST provide an empty state with a "Raise Incident" call-to-action when a package has no incidents
- **FR-014**: System MUST allow filtering the global incidents list by SIRS classification to show all SIRS incidents sorted by deadline urgency
- **FR-015**: System MUST continue processing Zoho CRM webhook syncs for CRM-originated incidents regardless of feature flag state
- **FR-016**: System MUST distinguish CRM-originated incidents from Portal-originated incidents (visible indicator)
- **FR-017**: System MUST prevent CRM sync from overwriting Portal-originated incidents
- **FR-018**: System MUST be controllable via a feature flag toggled per organisation — when disabled, the current read-only views remain; when enabled, create and edit capabilities appear
- **FR-019**: System MUST maintain a complete audit trail for every incident creation, update, and field change with acting user and timestamp
- **FR-020**: System MUST require resolution when stage is changed to "Resolved"
- **FR-021**: System MUST prevent deletion of SIRS-classified incidents (soft-delete only for non-SIRS)
- **FR-022**: System MUST respect existing incident-related permissions — only authorised users can create, edit, or view incidents

### Key Entities

- **Incident** *(existing, extended)*: A recorded event during care delivery that caused or could cause harm. Existing model with all fields from Zoho sync. Extended with: `source` (CRM or Portal — to distinguish origin), `sirs_priority` (Priority 1 or Priority 2), `sirs_reportable_type` (one of 8 SIRS types), `sirs_deadline` (calculated datetime), `sirs_reported_date` (when reported to ACQSC), `intake_triage_category` (immutable snapshot), `intake_classification` (immutable snapshot).

- **Incident Outcome** *(existing)*: Outcome labels (permanent injury, elder abuse) linked to incidents via pivot. No changes required.

- **Package** *(existing)*: The care package an incident belongs to. Already has `incidents()` relationship. No changes required.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Care Partners can raise an incident in Portal in under 5 minutes (compared to the current CRM workflow requiring system switching)
- **SC-002**: 100% of incidents created through Portal have a triage category and classification assigned at intake (structured data from the start)
- **SC-003**: 100% of SIRS-classified incidents have an auto-calculated reporting deadline visible on the record
- **SC-004**: The Edit page is functional — 100% of incidents viewable and editable in Portal (eliminating the documented "Edit.vue missing" gap)
- **SC-005**: Zoho CRM sync continues uninterrupted for existing incidents — zero sync failures attributable to Phase 1 changes
- **SC-006**: SIRS deadline visibility allows the Clinical Team to identify overdue reports — target: zero missed P1 deadlines (24h) after rollout
- **SC-007**: Care Partners report improved context during client calls — incidents visible on package view without CRM switching (qualitative feedback from pilot)
