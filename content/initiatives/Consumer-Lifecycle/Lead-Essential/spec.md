---
title: "Feature Specification: Lead Essential (LES)"
---

> **[View Mockup](/mockups/lead-essential/index.html)**{.mockup-link}

# Feature Specification: Lead Essential (LES)

**Feature Branch**: `feat/les-lead-essential`
**Created**: 2026-02-21
**Status**: Approved (Gate 1 passed 2026-02-21)
**Input**: Idea brief, old Confluence PRD (David Henry, Oct 2025), existing Lead domain codebase, FE-Shark-attack-2 reference branch, Figma designs (LTH)

---

## Overview

Lead Essential establishes the **native lead management module** in the Portal — replacing Zoho CRM as the primary workspace for viewing, managing, and progressing leads through the sales funnel. It builds on the existing lead record infrastructure (already used by LTH for conversion) and adds the staff-facing management layer: a rich lead profile view, section-based profile editing, staff assignment, journey stage & status tracking, timeline, and notes.

On the consumer side, LES replaces the existing 6-step linear wizard with an ACRM-style profile — discrete, independently editable section forms (personal details, living situation, support needs, etc.) so that leads (or their representatives) can view and update specific parts of their profile without navigating unrelated sections.

**Key Actors**:
- **Sales Staff** — View, manage, assign, and progress leads through the funnel
- **Sales Team Leader / Head of Sales** — Bulk operations, reassignment, pipeline visibility
- **Lead Owner** (consumer/representative) — Manage their own profile via section-based forms

**Epic Dependencies**:
- **Lead-to-HCA (LTH)** — Conversion wizard (already built). LES enriches the lead record that LTH consumes.
- **Lead Generation Integrations (LGI)** — Future: automated lead capture from external sources (website forms, marketing). Builds on LES data model.
- **Lead Desirable (LDS)** — Future: extended CRM features (timeline enrichment, attribution analytics, options & traits). Builds on LES profile structure.

---

## What Already Exists

LES builds on substantial existing infrastructure. The following are **already built** and should not be re-specified:

| Capability | Status | Location |
|------------|--------|----------|
| Lead data model (Lead, LeadOwner, recipient_meta JSON) | Built | `domain/Lead/Models/` |
| Lead creation — public, authenticated, and guest paths | Built | `LeadController`, `MyLeadController`, `LeadPublicController` |
| 6-step profile wizard (consumer-facing) | Built — **to be replaced** by section-based forms (ACRM pattern) | `resources/js/Pages/Lead/Edit.vue` + form partials |
| Lead conversion dashboard (staff) | Built | `Staff/Leads/Index.vue` — KPI cards, table, filters |
| Lead conversion wizard (6-step, staff) | Built | `Staff/Leads/Conversion/` — Steps 1-6 |
| Lead record view (basic, staff) | Built | `Staff/Leads/Show.vue` — personal details + conversion status |
| Zoho sync (lead records, bi-directional) | Built | Sync enums, sync logs, zoho_id tracking |
| Feature flag gating | Built | `lead-to-hca-conversion` flag on staff routes |

**LES scope** = everything in the sections below that is NOT in the table above.

---

## User Scenarios & Testing

### User Story 1 — Staff Leads List View (Priority: P1)

As a Sales Staff member, I can view all leads in a structured, filterable list with key details visible at a glance, so that I can quickly identify which leads need attention and navigate to their profiles.

**Why this priority**: The list view is the primary workspace for sales staff. Without it, there is no central place to manage leads. The conversion dashboard (already built) provides a starting point, but LES requires additional columns and capabilities beyond conversion tracking.

**Independent Test**: Can be fully tested by logging in as staff, navigating to the leads list, verifying all columns are present, applying filters, sorting by any column, and clicking through to a lead profile.

**Acceptance Scenarios**:

1. **Given** I am a sales staff member, **When** I navigate to the Leads page, **Then** I see a table displaying: Lead Name, Contact Name, Email, Phone, Journey Stage, Lead Status, Assigned Agent, Created Date, and Conversion status.

2. **Given** I am viewing the leads list, **When** I apply filters for Journey Stage, Lead Status, Assigned Agent, or Conversion status, **Then** the list updates to show only matching leads.

3. **Given** I am viewing the leads list, **When** I click on a lead name, **Then** I am navigated to that lead's profile view.

4. **Given** I am viewing the leads list, **When** I click "Create Lead", **Then** a lead creation form appears with mandatory fields (Lead Name, Email) and optional fields, and upon save the new lead appears in the list.

5. **Given** I am a Sales Team Leader, **When** I select multiple leads using checkboxes, **Then** I can perform bulk actions (assign agent, export).

---

### User Story 2 — Staff Lead Profile View (Priority: P1)

As a Sales Staff member, I can view a lead's full profile organised into tabs, with a persistent sidebar showing key identification and status information, so that I have complete context when working with a lead.

**Why this priority**: The profile view is where all lead management happens. It replaces the current basic show page with a rich, tabbed layout that surfaces all lead data and actions in context.

**Independent Test**: Can be tested by navigating to any lead from the list view and verifying that the profile loads with sidebar, tabs, and all sections populated from the lead's data.

**Acceptance Scenarios**:

1. **Given** I navigate to a lead's profile, **When** the page loads, **Then** I see a sidebar with: avatar/initials, full name, TC Customer Number, Journey Stage badge, profile completion percentage, email (with copy), phone (with copy), date of birth, and assigned agent.

2. **Given** I am viewing a lead's profile, **When** I look at the tab navigation, **Then** I see tabs for: Overview, Timeline, and Other (Attribution, Traits). Settings is deferred to LDS.

3. **Given** I am on any tab within the lead profile, **Then** the sidebar with key identification details remains visible and accessible.

4. **Given** I am viewing the lead profile sidebar, **When** I click the assigned agent dropdown, **Then** I can search for and select a different staff member to assign.

---

### User Story 3 — Overview Tab: Lead Summary (Priority: P1)

As a Sales Staff member, I can view and edit a lead's profile information in discrete sections (personal details, living situation, support needs, cultural background, management option), so that I can review and update specific parts without navigating through a full wizard.

**Why this priority**: The overview tab is the most-used view — it provides the lead's complete profile at a glance and allows staff to update any section independently.

**Independent Test**: Can be tested by viewing a lead's Overview tab, verifying all sections display current data, clicking "Edit" on any individual section, modifying a field, saving, and confirming the change persists.

**Acceptance Scenarios**:

1. **Given** I am on the Overview tab, **When** the page loads, **Then** I see the following sections as read-only cards: Lead Information (name, journey stage, lead status, purchase intent, attribution, created date, last contact), Contact Information (primary and secondary contacts with name, relationship, email, phone, contact type), Personal Details (name, gender, DOB, address), Living Situation (accommodation type, current living situation), Support Needs (what's important, care needs, support network), and Cultural Background (English proficiency, other languages, ethnicity).

2. **Given** I am viewing any section on the Overview tab, **When** I click "Edit" on that section, **Then** the card expands inline to show the edit form for just that section's fields, pre-filled with current data (ACRM inline expansion pattern — no modal).

3. **Given** I have edited a section and click "Save", **When** the save completes, **Then** only the fields in that section are updated, the card refreshes with the new data, and other sections remain unchanged.

4. **Given** I am viewing the Contact Information section, **When** I click "Add Contact", **Then** I can add a new contact with name, relationship, email, phone, and contact type (Primary/Secondary), and delete secondary contacts.

5. **Given** I am viewing the Lead Information section, **When** I click "Edit", **Then** I can update: journey stage, lead status, purchase intent, and lead attribution. The lead name remains read-only for staff.

---

### User Story 4 — Journey Stage Tracking (Priority: P1)

As a Sales Staff member, I can view and update a lead's Journey Stage through a guided wizard that enforces required data at each stage transition, so that leads progress through the funnel with complete and accurate information.

**Why this priority**: Journey Stage is the core sales pipeline metric. Every reporting dashboard, forecast, and SLA depends on accurate stage tracking. Without it, there is no funnel visibility.

**Independent Test**: Can be tested by opening a lead at any journey stage, initiating a stage change, completing the required fields in the wizard, saving, and verifying the stage is updated with a timestamped history entry.

**Acceptance Scenarios**:

1. **Given** I am viewing a lead's profile, **When** I look at the Journey Stage indicator, **Then** I see the lead's current position along the funnel: Pre-Care → ACAT Booked → Approved → Allocated → Active → Converted, with the current stage highlighted. Each stage may show a substage label for granularity.

2. **Given** I click to update the Journey Stage, **When** the Journey Stage wizard opens, **Then** I can select any stage (forward or backward — no directional restriction) and see mandatory fields that must be completed for the target stage before the change can be confirmed.

3. **Given** I complete all mandatory fields and confirm the stage change, **When** the wizard saves, **Then** the Journey Stage is updated, a history entry is recorded with the previous stage, new stage, timestamp, and who made the change.

4. **Given** a lead's Journey Stage is updated, **When** I view the timeline, **Then** I see an entry showing the stage transition with before/after values.

5. **Given** a lead's status is set to "Lost", **When** I view the Journey Stage, **Then** the Journey Stage remains frozen at its current position (independent of Lead Status). If the lead is re-engaged, they resume from the same stage.

---

### User Story 5 — Lead Status Tracking (Priority: P1)

As a Sales Staff member, I can update a lead's status through guided wizards that capture the right context for each status, so that engagement history is consistently recorded and auditable.

**Why this priority**: Lead Status captures engagement quality — it's how staff communicate progress on individual leads and how managers identify leads going cold. Each status has different required context.

**Independent Test**: Can be tested by updating a lead through each status transition (Not Contacted → Attempted Contact → Made Contact → Lost), verifying the correct wizard fields appear for each, and checking the timeline records the changes.

**Acceptance Scenarios**:

1. **Given** I am viewing a lead's profile, **When** I see the Lead Status actions, **Then** I can select from: Not Contacted, Attempted Contact, Made Contact, and Lost. (Converted is handled by LTH.)

2. **Given** I update a lead's status to "Made Contact", **When** the wizard opens, **Then** I see mandatory fields: Journey Stage, Lead Attribution, Purchase Intent; and optional fields: contact method, outcome, follow-up date, and notes.

3. **Given** I update a lead's status to "Attempted Contact", **When** the wizard opens, **Then** I see mandatory fields: Contact Method and Contact Outcome (No Answer, Left Voicemail, Line Busy, Wrong Number, Email Bounced, Other); and optional notes.

4. **Given** I update a lead's status to "Lost", **When** the wizard opens, **Then** I see mandatory fields: Lost Type (Lost Lead, Junk, Uncontactable) and a Reason dropdown with options dynamic to the selected Lost Type:
   - **Lost Lead**: Chose competitor, Too expensive, Not ready, Changed mind, Other
   - **Junk**: Spam, Test entry, Duplicate, Invalid data
   - **Uncontactable**: No response after 5 attempts, Wrong number, Deceased, Moved overseas

5. **Given** any status update is saved, **When** I view the timeline, **Then** I see a chronological entry with the old status, new status, timestamp, agent name, and any notes captured.

---

### User Story 6 — Lead Timeline & Notes (Priority: P2)

As a Sales Staff member, I can view a chronological timeline of all interactions, status changes, stage transitions, and notes for a lead, and add new notes, so that I have a complete audit trail and can record ad-hoc observations.

**Why this priority**: The timeline is the lead's history — it enables handoffs between agents, provides context for follow-ups, and creates an audit trail. Notes are the most common day-to-day action.

**Independent Test**: Can be tested by viewing a lead's Timeline tab, adding a note, performing a status change, and verifying both appear chronologically with correct metadata.

**Acceptance Scenarios**:

1. **Given** I am on a lead's Timeline tab, **When** the page loads, **Then** I see a chronological list of all events: lead creation, status changes, journey stage updates, notes added, and agent assignments — each with timestamp, event type, description, and who performed it.

2. **Given** I want to add a note, **When** I type in the "Add Note" panel and click save, **Then** the note is added to the timeline with my name, the current date/time, and the note content.

3. **Given** a status change or stage update occurs, **When** I view the timeline, **Then** I see an auto-generated entry showing the change details (before → after values, the wizard fields captured).

4. **Given** the timeline has many entries, **When** I navigate through pages, **Then** entries are grouped by date and paginated.

---

### User Story 7 — Staff Assignment (Priority: P2)

As a Sales Team Leader, I can assign leads to individual sales agents and bulk-assign multiple leads at once, so that workload is distributed and every lead has a responsible owner.

**Why this priority**: Without assignment, leads have no accountability. Team Leaders need both individual and bulk assignment to manage pipelines effectively.

**Independent Test**: Can be tested by assigning a single lead from the profile sidebar, bulk-selecting leads from the list view and assigning them, and verifying the assigned agent appears on both the list and profile views.

**Acceptance Scenarios**:

1. **Given** I am viewing a lead's profile sidebar, **When** I click the Assigned Agent dropdown, **Then** I can search for any internal staff member and select them to assign.

2. **Given** I select the new assigned agent, **When** the assignment saves, **Then** the lead's assigned agent is updated immediately and a timeline entry is recorded.

3. **Given** I am on the leads list view, **When** I select multiple leads using checkboxes and click "Bulk Assign", **Then** a modal appears where I can search for and select a staff member, and all selected leads are assigned in one action.

4. **Given** a lead was created by a sales agent directly, **When** the lead is saved, **Then** the creating agent is automatically assigned as the lead owner.

---

### User Story 8 — Consumer Profile Management (Priority: P2)

As a Lead Owner (the consumer or their representative), I can view and edit my profile information in discrete sections rather than a sequential wizard, so that I can update just the information that has changed without navigating through unrelated steps.

**Why this priority**: The existing 6-step wizard forces consumers through a linear flow even when they only need to update one field. Section-based editing improves the experience and encourages profile completion.

**Independent Test**: Can be tested by logging in as a lead owner, navigating to the profile, clicking "Edit" on a specific section (e.g., Living Situation), updating a field, saving, and verifying only that section is updated.

**Acceptance Scenarios**:

1. **Given** I am a lead owner viewing my profile, **When** the page loads, **Then** I see my information organised into sections: My Details, Living Situation, Support Needs, Cultural Background, and Management Option — each with an "Edit" action.

2. **Given** I click "Edit" on any section, **When** the edit form appears, **Then** only the fields for that section are shown, pre-filled with my current data.

3. **Given** I save changes to a section, **When** the save completes, **Then** the section card refreshes with the updated data and my overall profile completion percentage updates accordingly.

4. **Given** my profile is incomplete, **When** I view the profile page, **Then** incomplete sections are visually indicated (e.g., a completion badge or prompt) encouraging me to fill them in.

5. **Given** I am a representative managing a lead on behalf of someone else, **When** I view the profile, **Then** I see the recipient's information (not my own) and can edit their details.

> **Note**: The existing 6-step linear wizard is replaced by this section-based approach for both new and existing leads — similar to the ACRM profile pattern used elsewhere in the Portal.

---

### User Story 9 — Internal Lead Creation (Priority: P2)

As a Sales Staff member, I can create a new lead using either a quick modal or a guided stepper, so that I can choose the right level of detail capture depending on the situation.

**Why this priority**: Staff need to capture leads in real-time during calls. A quick create path (modal) for minimal capture and a guided stepper for detailed intake gives flexibility without friction.

**Independent Test**: Can be tested by using both create paths — quick modal and guided stepper — verifying leads are created with correct defaults and the creating agent is auto-assigned.

**Acceptance Scenarios**:

1. **Given** I am on the leads list view, **When** I click "Create Lead", **Then** I see two options: "Quick Create" (modal) and "Guided Create" (stepper).

2. **Given** I choose "Quick Create", **When** the modal opens, **Then** I see mandatory fields: Lead Name and Email; and optional fields: phone, relationship to recipient, and notes. On save, the lead is created and I remain on the list view.

3. **Given** I choose "Guided Create", **When** the stepper opens, **Then** I am walked through 3 steps: Step 1 — Personal Details (name, DOB, gender, email, phone, address), Step 2 — Aged Care Stage, Step 3 — Contact Information. All other sections (Living Situation, Support Needs, Cultural Background, Traits, Management Option) are filled on the profile afterwards. On completion, I am navigated to the new lead's profile view.

4. **Given** I use either create path and fill in mandatory fields, **When** the lead is created, **Then** the lead appears in the list with me as the assigned agent, a default journey stage of "Pre-Care", and a default lead status of "Not Contacted".

5. **Given** a lead with the same email already exists, **When** I attempt to save via either path, **Then** the system warns me of the potential duplicate and allows me to proceed or navigate to the existing lead.

---

### User Story 10 — Marketing Attribution Display (Priority: P3)

As a Sales Staff member, I can view a lead's marketing attribution data (traffic source, UTM parameters, session data), so that I can understand how the lead found Trilogy Care and tailor my approach.

**Why this priority**: Attribution data is already captured during public lead creation (UTM tracking). Displaying it gives sales context on lead quality and source without requiring separate analytics tools.

**Independent Test**: Can be tested by viewing a lead that was created through a tracked marketing channel and verifying the attribution section on the Other tab displays source, medium, campaign, UTM parameters, and session data.

**Acceptance Scenarios**:

1. **Given** I am on a lead's Other tab → Attribution section, **When** the page loads, **Then** I see three columns: Traffic Source (source, medium, campaign, keyword), UTM Parameters (utm_source, utm_medium, utm_campaign, utm_term, utm_content), and Session Data (first touch date, session count, page views, time on site, device type, browser, location).

2. **Given** a lead was created without tracking data (e.g., internal creation), **When** I view the Attribution section, **Then** I see an empty state indicating no attribution data is available.

---

### User Story 11 — Lead Traits (Priority: P3)

As a Sales Staff member, I can view and edit a lead's preferences and interests (communication preferences, best time to call, personal interests, technology comfort), so that I can personalise my approach and build rapport.

**Why this priority**: Soft data that helps agents personalise conversations. Low effort to build (simple key-value section) but high impact on sales quality.

**Independent Test**: Can be tested by navigating to the Other tab → Traits section, adding/editing preferences, saving, and verifying persistence.

**Acceptance Scenarios**:

1. **Given** I am on a lead's Other tab → Traits section, **When** the page loads, **Then** I see editable fields for: preferred communication method (Phone, Email, SMS), best time to call (Morning, Afternoon, Evening), preferred days, personal interests (free text), technology comfort level (Low, Medium, High), and any additional notes.

2. **Given** I edit any trait field, **When** I save, **Then** the value persists and a timeline entry is recorded.

3. **Given** a lead has no traits set, **When** I view the Traits section, **Then** I see the fields with empty/default states and an encouragement to complete them.

---

### Edge Cases

- **What happens if a lead is created with a duplicate email?** The system warns the staff member of the potential duplicate. Staff can proceed (different person, same email) or navigate to the existing lead.

- **What happens if a staff member tries to update a lead they are not assigned to?** All staff with the `view-all-leads` permission can view and edit any lead. Assignment is for accountability, not access control.

- **What happens if a lead owner tries to edit a section with validation errors?** The form shows inline validation errors. The section is not saved until all required fields within that section are valid.

- **What happens to existing leads created through the old wizard?** They appear in the staff list view with whatever data they have. Missing sections show as incomplete in the profile completion indicator.

- **What happens if a "Lost" lead needs to be re-engaged?** Staff can change the status back from "Lost" to "Not Contacted" or "Attempted Contact" with a required note explaining the re-engagement.

- **What happens if Zoho sync data conflicts with a staff edit?** Portal is the source of truth for fields edited in Portal. Zoho-synced fields that have been manually overridden in Portal are not overwritten by subsequent syncs.

---

### User Flow Summary

**Staff Lead Management Flow:**
```
Leads List View
    │
    ├── Create Lead → Quick form (name + email) → Lead appears in list
    │
    └── Click Lead → Lead Profile View
                        │
                        ├── Sidebar: Avatar, TC ID, Journey Stage, Assignment
                        │
                        ├── Overview Tab
                        │     ├── Lead Information (edit)
                        │     ├── Contact Information (add/edit/delete)
                        │     ├── Personal Details (edit)
                        │     ├── Living Situation (edit)
                        │     ├── Support Needs (edit)
                        │     └── Cultural Background (edit)
                        │
                        ├── Timeline Tab
                        │     ├── Chronological event history
                        │     └── Add Note
                        │
                        └── Other Tab
                              ├── Attribution (read-only)
                              ├── Traits (preferences/interests, JSON storage)
                              └── Settings (LDS scope)
```

**Consumer Profile Management Flow:**
```
Lead Owner Dashboard
    │
    └── Click Recipient → Profile View
                            │
                            ├── My Details (edit section)
                            ├── Living Situation (edit section)
                            ├── Support Needs (edit section)
                            ├── Cultural Background (edit section)
                            └── Management Option (edit section)
```

---

## Requirements

### Functional Requirements

**Leads List View**

- **FR-001**: System MUST display all leads in a structured table with columns: Lead Name (care recipient), Contact Name (primary contact — may be same as lead), Email, Phone, Journey Stage, Lead Status, Assigned Agent, Created Date, and Conversion status.
- **FR-002**: System MUST support filtering by Journey Stage, Lead Status, Assigned Agent, Conversion status, and Created Date.
- **FR-003**: System MUST support sorting by any sortable column.
- **FR-004**: System MUST support full-text search across lead name, email, phone, and TC Customer Number.
- **FR-005**: System MUST support bulk actions: assign agent and export (CSV format with all visible columns).
- **FR-006**: System MUST provide a "Create Lead" action from the list view.

**Staff Lead Profile**

- **FR-007**: System MUST display a lead profile with a persistent sidebar showing: avatar/initials, full name, TC Customer Number, Journey Stage badge, profile completion percentage, email, phone, date of birth, and assigned agent.
- **FR-008**: System MUST organise the lead profile into tabs: Overview, Timeline, and Other.
- **FR-009**: System MUST allow staff to edit lead profile sections independently via inline card expansion (ACRM pattern — not modals or sequential wizards).
- **FR-010**: System MUST support section-level editing for: Lead Information, Contact Information, Personal Details, Living Situation, Support Needs, and Cultural Background.

**Journey Stage**

- **FR-011**: System MUST display the lead's current Journey Stage using 6 primary stages in the progress bar: Pre-Care, ACAT Booked, Approved, Allocated, Active, Converted. Each primary stage may have optional substages for granular tracking (e.g., Pre-Care includes "Never Spoken to MAC", "Initiated MAC Referral"). Transitions are permitted in any direction (forward or backward).
- **FR-011a**: Journey Stage MUST remain independent of Lead Status — setting a lead to "Lost" does not change the Journey Stage.
- **FR-012**: System MUST require completion of stage-specific mandatory fields before allowing a Journey Stage transition.
- **FR-013**: System MUST record a history entry for every Journey Stage change with: previous stage, new stage, timestamp, and agent.

**Lead Status**

- **FR-014**: System MUST support the following Lead Statuses: Not Contacted, Attempted Contact, Made Contact, Lost. (Converted status is managed by the LTH conversion wizard, not LES.)
- **FR-015**: System MUST display a status-specific wizard for each status transition with the required and optional fields defined per status.
- **FR-016**: "Made Contact" wizard MUST require: Journey Stage, Lead Attribution, Purchase Intent. Optional: contact method, outcome, follow-up date, notes.
- **FR-017**: "Attempted Contact" wizard MUST require: Contact Method, Contact Outcome (No Answer, Left Voicemail, Line Busy, Wrong Number, Email Bounced, Other). Optional: notes.
- **FR-018**: "Lost" wizard MUST require: Lost Type (Lost Lead, Junk, Uncontactable) and a Reason field with options dynamic to the selected Lost Type: Lost Lead (Chose competitor, Too expensive, Not ready, Changed mind, Other), Junk (Spam, Test entry, Duplicate, Invalid data), Uncontactable (No response after 5 attempts, Wrong number, Deceased, Moved overseas).
- **FR-019**: "Converted" status is out of LES scope — managed by the LTH conversion wizard which handles its own prerequisite validation.
- **FR-020**: System MUST record a history entry for every Lead Status change with: previous status, new status, captured fields, timestamp, and agent.

**Timeline & Notes**

- **FR-021**: System MUST display a chronological timeline of all lead events: creation, status changes, stage transitions, notes, and agent assignments.
- **FR-022**: System MUST allow staff to add free-text notes to any lead.
- **FR-023**: Every timeline entry MUST include: event type, description, timestamp, and agent name.

**Assignment**

- **FR-024**: System MUST allow staff to assign any internal staff member to a lead from the profile sidebar.
- **FR-025**: System MUST allow bulk assignment of multiple leads to a single agent from the list view.
- **FR-026**: System MUST auto-assign the creating agent when a lead is created by staff.
- **FR-026a**: System MUST auto-assign leads created via public form or Zoho sync using round-robin distribution across active sales agents.
- **FR-027**: System MUST record a timeline entry for every assignment change.

**Contact Management**

- **FR-028**: System MUST support primary and secondary contacts per lead with: name, relationship, email, phone, and contact type (Primary/Secondary).
- **FR-029**: System MUST enforce exactly one Primary Contact at any time.
- **FR-030**: System MUST allow adding new contacts and deleting secondary contacts.

**Consumer Profile Management**

- **FR-031**: System MUST allow lead owners to view their profile organised into discrete sections.
- **FR-032**: System MUST allow lead owners to edit any individual section independently without navigating a sequential wizard.
- **FR-033**: System MUST display a profile completion indicator showing overall progress.
- **FR-034**: System MUST visually indicate incomplete sections to encourage completion.

**Internal Lead Creation**

- **FR-035**: System MUST provide two internal lead creation paths: Quick Create (modal with Lead Name + Email only) and Guided Create (multi-step stepper with personal details, aged care stage, contacts).
- **FR-035a**: Quick Create MUST keep staff on the list view after save. Guided Create MUST navigate to the new lead's profile view after completion.
- **FR-036**: System MUST default new leads to Journey Stage "Pre-Care" and Lead Status "Not Contacted".
- **FR-037**: System MUST warn when a lead with a duplicate email already exists, allowing staff to proceed or navigate to the existing record.

**Attribution**

- **FR-038**: System MUST display marketing attribution data (traffic source, UTM parameters, session data) when available.
- **FR-039**: System MUST display an appropriate empty state when no attribution data exists.

**Traits**

- **FR-040**: System MUST display a Traits section on the Other tab with fields for: preferred communication method (Phone/Email/SMS), best time to call (Morning/Afternoon/Evening), preferred days, personal interests (free text), technology comfort level (Low/Medium/High), and additional notes.
- **FR-041**: Traits MUST be stored as flexible JSON to support future market segmentation fields without schema migration.
- **FR-042**: System MUST record a timeline entry when traits are updated.

**Permissions**

- **FR-043**: System MUST enforce two permission tiers: Sales Agent (view/edit all leads, assign self) and Sales Team Leader (all agent permissions + bulk assign, reassign others, export).

**Data Definitions**

- **FR-044**: Purchase Intent MUST use a 3-tier classification: Hot (ready to convert), Warm (interested but not yet), Cold (early/exploratory).
- **FR-045**: Lead Attribution source options MUST mirror current Zoho lead source values for bi-directional sync compatibility.
- **FR-046**: Portal access (login invitation) MUST be managed independently from the contact primary/secondary hierarchy — any contact can be invited to Portal regardless of contact type.

**Journey Stage Substage Mapping**

- **FR-047**: The 6 primary stages MUST map to existing enum substages as follows:
  - Pre-Care: Unknown, Never Spoken to MAC, Initiated MAC Referral, RAS in Progress, Receiving CHSP
  - ACAT Booked: ACAT Booked
  - Approved: ACAT Assessment Conducted
  - Allocated: Allocated HCP
  - Active: Active (Inactive substage dropped)
  - Converted: (new — set when LTH conversion completes)

**Timeline Integrity**

- **FR-048**: All timeline entries MUST be immutable after creation — no editing or deletion. Staff can add correction notes as new entries.

**Follow-up & Notifications**

- **FR-049**: Follow-up date (optional field on Made Contact wizard) MUST be stored and displayed on the lead profile (e.g., "Next follow-up: 25 Feb"). No automated reminders — agents check their pipeline manually.
- **FR-050**: No email, push, or in-app notifications for assignment changes in LES. Timeline entry is the only record. Notifications are deferred to LDS.

**Computed Fields**

- **FR-051**: "Last Contact" date on the Lead Information card MUST be auto-calculated as the timestamp of the most recent "Made Contact" or "Attempted Contact" status change. No manual entry.
- **FR-052**: Profile completion percentage MUST reuse the existing LeadData weighted calculation, with a small additional weight for Traits.

**Consumer Profile Scope**

- **FR-053**: Consumer profile view MUST show only the lead owner's own sections (My Details, Living Situation, Support Needs, Cultural Background, Management Option). Contact hierarchy is staff-facing only — consumers do not manage contacts.

### Key Entities

- **Lead**: A potential client or their representative's record, created at first contact. Contains personal details, contact hierarchy, journey stage, lead status, and attribution data. The foundational record for the entire sales funnel.

- **Lead Owner**: The authenticated or guest user who created/owns the lead. May be the care recipient themselves ("Self") or a family member/representative.

- **Contact**: A person associated with a lead — the primary contact (designated for communications) and optionally secondary contacts (family, representatives). Each has name, relationship, email, phone.

- **Journey Stage**: An objective indicator of where the lead sits in the aged care funnel — from Pre-Care through to Converted. Transitions are gated by required data completion.

- **Lead Status**: An engagement classification tracking the sales team's interaction quality — Not Contacted, Attempted Contact, Made Contact, Lost, Converted. Each transition captures status-specific context.

- **Timeline Entry**: A chronological audit record of every lead event — status changes, stage transitions, notes, assignments. Immutable once created.

- **Staff Assignment**: The link between a lead and the responsible internal agent. One agent per lead, changeable by team leaders. Auto-assigned on creation.

---

## Success Criteria

### Measurable Outcomes

- **SC-001**: Sales staff can create a new lead in under 30 seconds with mandatory fields only.

- **SC-002**: 100% of leads have a valid Journey Stage and Lead Status at all times (no null/unknown states after creation).

- **SC-003**: Staff can update any individual profile section in under 60 seconds (no need to navigate through unrelated sections).

- **SC-004**: 100% of status and stage transitions are recorded in the timeline with complete audit metadata (who, when, before, after).

- **SC-005**: Every lead has an assigned agent — 0% of leads with no assignment after 24 hours of creation.

- **SC-006**: Lead owners can independently edit any profile section — section save does not require completing other sections.

- **SC-007**: The leads list view loads within 2 seconds for up to 10,000 leads with filters applied.

- **SC-008**: Profile completion percentage increases by 15% within the first month of section-based editing availability (compared to wizard-only flow).

---

## Out of Scope

| Item | Handled By | Reason |
|------|-----------|--------|
| Lead-to-HCA conversion wizard | LTH (already built) | Separate epic, already in `feat/lth-lead-to-hca` |
| Automated lead capture from forms/marketing | LGI (Lead Generation Integrations) | Separate epic for external integrations |
| Lead Settings | LDS (Lead Desirable) | Future configuration options |
| AI/predictive workflows | Future roadmap | Not in current planning horizon |
| Timeline enrichment (call recordings, email threads) | LDS (Lead Desirable) | Requires integration with communication tools |
| Linked Leads (family member cross-referencing) | LDS (Lead Desirable) | Complex relationship model, deferred |
| Zoho CRM deprecation/migration | Separate initiative | Requires organisation-wide rollout plan |

---

## Clarifications

### Session 2026-02-21
- Q: Can staff move Journey Stage backwards or only forward? -> A: Any direction — no directional restriction on stage transitions.
- Q: Section editing pattern — inline expansion, modal, or slideout? -> A: Inline expansion (ACRM pattern). Card expands in-place, no modal.
- Q: When a lead is marked "Lost", does Journey Stage freeze or reset? -> A: Freeze in place. Journey Stage and Lead Status are fully independent dimensions.
- Q: What are the Lost reason options per Lost Type? -> A: Mirror Zoho reasons — Lost Lead (Chose competitor, Too expensive, Not ready, Changed mind, Other), Junk (Spam, Test entry, Duplicate, Invalid data), Uncontactable (No response after 5 attempts, Wrong number, Deceased, Moved overseas).
- Q: Staff lead creation — modal, new page, or inline? -> A: Two paths — Quick Create (modal, name + email, stay on list) and Guided Create (stepper like conversion, navigate to profile on completion).

### Session 2026-02-21 (Spec Lens Round 2)
- Q: Stage-specific mandatory fields per Journey Stage transition? -> A: Defer to design phase.
- Q: Purchase Intent options? -> A: Hot / Warm / Cold (3-tier classification).
- Q: Lead Attribution source options? -> A: Mirror Zoho lead source values for sync compatibility.
- Q: Primary contact = Portal user? -> A: Separate concepts — portal access is independent of contact hierarchy.
- Q: Substage mapping for hybrid Journey Stage model? -> A: Pre-Care (Unknown, Never Spoken to MAC, Initiated MAC Referral, RAS in Progress, Receiving CHSP), ACAT Booked (ACAT Booked), Approved (ACAT Assessment Conducted), Allocated (Allocated HCP), Active (Active only — Inactive dropped), Converted (new).
- Q: What does 'Inactive' mean vs 'Lost'? -> A: Drop Inactive entirely. Redundant with Lost.
- Q: Permission tiers? -> A: Two tiers — Sales Agent (view/edit all, assign self) and Sales Team Leader (+ bulk assign, reassign, export).
- Q: Timeline entries editable? -> A: Immutable. No editing or deletion. Correction notes added as new entries.
- Q: Other tab scope — Attribution only or include Traits? -> A: Include Traits. Traits = lead preferences/interests (communication method, best time to call, interests, tech comfort). Stored as flexible JSON for future market segmentation.
- Q: What should Traits cover? -> A: Lead preferences/interests — personalisation data for agents.

### Session 2026-02-21 (Spec Lens Round 3)
- Q: Contact Status options in Made Contact wizard? -> A: Redundant with Lead Status — removed from wizard.
- Q: Can leads skip to Converted without Made Contact? -> A: Converted is LTH scope, not LES. Removed from LES Lead Status options.
- Q: Profile completion weighting? -> A: Reuse existing LeadData weights, add small weight for Traits.
- Q: Timeline loading pattern? -> A: Paginated (not infinite scroll).
- Q: Export format? -> A: CSV with all visible columns.
- Q: Follow-up date behavior? -> A: Display only — stored and shown on profile. No automated reminders.
- Q: Notifications on assignment change? -> A: None in LES. Timeline entry only. Notifications deferred to LDS.
- Q: Consumer profile sections vs staff overview? -> A: Consumers see own 5 sections only. Contact management is staff-facing.
- Q: Lead Name vs Contact Name columns? -> A: Lead Name = care recipient. Contact Name = primary contact. May be same person.
- Q: Last Contact date — auto or manual? -> A: Auto-calculated from latest Made Contact or Attempted Contact status change.
- Q: Guided Create steps? -> A: Lean 3 steps: Personal Details, Aged Care Stage, Contacts. Everything else on profile after.

### Session 2026-02-21 (Business Lens)
- Q: Journey Stage model — 6 simplified vs existing 10-stage enum? -> A: Hybrid — 6 primary stages (Pre-Care, ACAT Booked, Approved, Allocated, Active, Converted) in the progress bar with optional substages for granularity.
- Q: Phased delivery or single release? -> A: Single release — all stories shipped together.
- Q: Zoho relationship post-LES launch? -> A: Keep bi-directional sync. Portal is primary.
- Q: Auto-assignment for public/Zoho leads? -> A: Round-robin across active sales agents.
- Q: Primary success metric? -> A: Pipeline visibility score — % of leads with accurate Journey Stage + Lead Status.

---

## Related Documents

| Document | Location |
|----------|----------|
| Idea Brief | [IDEA-BRIEF.md](IDEA-BRIEF.md) |
| Old Confluence PRD | [context/raw_context/old_LES---2.-PRD---Lead-Essential_652771371.md](context/raw_context/old_LES---2.-PRD---Lead-Essential_652771371.md) |
| LTH Spec (sibling epic) | [../Lead-To-HCA/spec.md](../Lead-To-HCA/spec.md) |
| Client HCA Spec (downstream) | [../Client-HCA/spec.md](../Client-HCA/spec.md) |
