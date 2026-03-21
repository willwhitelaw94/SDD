---
title: "Design Kickoff: Incident Management Portal Migration"
status: Draft
created: 2026-02-24
---

# Design Kickoff: Incident Management Portal Migration

**Epic:** ICM — Incident Management
**Spec:** [spec.md](spec.md) (Approved, Gate 1 passed 2026-02-24)

---

## Context

### User Research

| Aspect | Answer | Impact on Design |
|--------|--------|------------------|
| Primary User | Care Partner (coordinator) | Needs fast intake during client calls, quick access to history |
| Secondary User | Clinical Team member | Needs triage tools, SIRS tracking, filtering, governance views |
| Tertiary User | External reporter (family/rep) | Needs simple, guided public form — no Portal knowledge assumed |
| Device Priority | Desktop-first | Can use complex layouts, multi-column, keyboard shortcuts |
| Usage Frequency | Daily (Care Partners), weekly (Clinical Team) | Worth investing in power-user features for Care Partners |
| Context | On the phone with clients, time-pressured, multitasking | Fast capture is critical — every extra click costs care quality |

### Competitive Research

#### RiskMan (RLDatix) — Market Leader in Australian Aged Care

**What they do well:**
- ISR (Incident Severity Rating) — algorithmic severity from 3 consequence questions rather than self-assessed severity
- Conditional sections that expand based on incident type (e.g. medication section only for medication incidents)
- 4-level severity scale (ISR 1-4) is clinically validated and well-understood
- Comprehensive audit trail valued by managers and quality teams
- Configurable modules via "Infinity Framework"

**What they get wrong:**
- Single long scrolling form — nurses describe it as "too difficult and time consuming"
- Redundant text fields (summary AND detailed description)
- "Excessive drop boxes" — cascading dropdowns are the #1 UX complaint
- No feedback loop — reporters submit and never hear what happened
- Desktop-only — no mobile/bedside entry
- SIRS tracking is retrofitted, not native — providers maintain parallel spreadsheets for 24h deadlines

**What we should do differently:**
- Multi-step wizard with progress indicator instead of single scrolling form
- One narrative field, not summary + description
- Smart defaults and conditional fields to minimise mandatory dropdowns
- Native SIRS deadline tracking with countdown and urgency indicators
- Reporter feedback: show incident status and clinical team actions

#### Sonder — Modern Australian Aged Care Platform

**What they do well:**
- Clean, modern UI with card-based incident views
- Mobile-responsive intake form
- Built-in SIRS workflow with automated deadline tracking
- Incident → care plan linkage

**What we can learn:**
- Card-based incident list with colour-coded severity badges works well for scanning
- Inline status progression (stepper) on the detail view

#### SafetyCulture (iAuditor) — Field Safety Platform

**What they do well:**
- Mobile-first incident capture with camera integration
- Template-based forms that adapt per incident type
- Offline capability for field workers
- Analytics dashboards with trend detection

**What we can learn:**
- Template approach: pre-configured form sections based on incident type reduce cognitive load
- Photo/evidence capture is valued by field workers (future consideration)

### Existing Implementation

**Current State:** Mostly net new. The existing Portal has:
- A global incidents list (basic stub)
- A package incidents tab (basic stub)
- Zoho CRM sync that pulls incidents into Portal read-only
- **No Edit.vue page** — the route and action exist but the page is missing
- **No create form** — all incident creation happens in Zoho CRM

This is effectively a greenfield build that replaces CRM-based incident management entirely.

---

## Strategy

### Design Principles

**North Star:** "Fast capture, thorough follow-up"

Intake should feel like jotting a note — reporters shouldn't dread the form. Processing should feel like a power tool — clinical staff should fly through triage and review.

**Supporting Principles:**
1. **Minimise time-to-submit** — Pre-fill everything possible, use smart defaults, make the happy path obvious
2. **Guide classification, don't quiz** — Help reporters pick the right harm tier with plain language descriptions and examples, not clinical jargon
3. **Surface urgency, not complexity** — SIRS deadlines, overdue indicators, and severity badges should be immediately visible without opening the record
4. **One source of truth** — After migration, Portal is the only system. Design for completeness.

### Emotional Design

**Target Emotion — Reporters:** Relieved — "That was easier than expected"
**Target Emotion — Clinical Team:** Efficient — "I can fly through these"

**Frustration Risks:**
- Too many mandatory fields on intake (RiskMan's #1 complaint)
- Unclear what happens after submission (no feedback loop)
- SIRS deadlines hidden behind clicks (compliance anxiety)
- Form feels like a bureaucratic obligation rather than a care tool

### Build Size Assessment

**Size:** Large (Ferrari)

**Rationale:**
- 5+ new screens: Create form (wizard), Detail/Edit view, Global list (enhanced), Package tab (enhanced), Public form, Pending Review queue
- New data model: Incident with 6 related entities (Outcome, Action, Escalation, Follow-Up, Disclosure, Audit)
- New lifecycle system: 6-stage state machine with skip logic and justification
- SIRS deadline engine: Auto-calculation, urgency indicators, filtering
- One-time CRM migration job
- Feature flag per organisation
- Public form with rate limiting and CAPTCHA

**Component Reuse:**
- `CommonForm` + `CommonFormField` — all form sections
- `CommonStepNavigation` — intake wizard progress and lifecycle stepper
- `CommonSelectMenu` — dropdowns with search
- `CommonCheckboxGroup` — outcomes and actions checklists
- `CommonPillSelect` — harm classification tier selector (4 options, colour-coded)
- `CommonRadioGroup` — yes/no/not-yet fields (disclosure, trend)
- `CommonTable` — global incidents list with filtering
- `CommonBadge` — harm tier badges, SIRS indicators, lifecycle stage
- `CommonTabs` — detail view sections
- `CommonDefinitionList` — incident metadata display
- `CommonEmptyPlaceholder` — empty states
- `CommonAlert` — SIRS deadline warnings
- `CommonDatePicker` / `CommonDateRangePicker` — date fields and filters
- `CommonCollapsible` — conditional form sections (escalation, SIRS)
- `CommonCard` — incident summary cards in package tab

**New Components Needed:**
- Lifecycle stepper (horizontal stage indicator with skip capability) — may extend `CommonStepNavigation`
- SIRS deadline badge (countdown timer with amber/red states)
- Harm tier selector (visual card-style selector with colour + description + timeframe)

---

## Constraints

### Accessibility Requirements

**WCAG Target:** Level AA

**Specific Requirements:**
- [x] Keyboard navigation — Care Partners tab through forms constantly
- [x] Screen reader support — standard compliance
- [x] Colour contrast — harm tier colours (red/orange/yellow/white) must meet 4.5:1 ratio with text
- [x] Focus management — wizard step transitions must manage focus correctly
- [ ] Cognitive accessibility — plain language already mandated by Marianne's V2 form design

**Harm Tier Colour Accessibility:**
The 4-tier colour scheme (red/orange/yellow/white) relies on colour alone for differentiation. Each tier MUST also include:
- A text label (Severe / Moderate / Low / Clinical Notification)
- An icon or shape differentiator for colour-blind users

### Security & Privacy

**Sensitive Data:**
- [x] Personal information — client name, DOB, Support at Home ID
- [x] Health information — incident details, clinical outcomes, harm classification
- [ ] Financial data — not applicable
- [ ] Authentication/credentials — not applicable (except public form CAPTCHA)

**Visibility Rules:**
- Care Partners see incidents on packages they have access to
- Clinical Team sees all incidents (global list)
- Public form reporters see only their own submission confirmation
- Standard Portal role-based access control (no additional sensitivity layers)

**Audit Requirements:**
- Every creation, update, and field change logged with acting user + timestamp (FR-027)
- Immutable intake snapshot preserved (FR-026)
- SIRS incidents cannot be deleted (FR-030)

**Public Form Security:**
- Rate limiting: max 5 submissions per IP per hour (FR-033)
- CAPTCHA required before submission (FR-033)
- No authentication — form is fully public
- Reporter contact details captured for follow-up

### Stakeholder Constraints

**Constraints:**
- Clinical: 4-tier harm classification is non-negotiable (Marianne's V2 form)
- Compliance: SIRS P1 incidents must show 24h deadline prominently
- Operational: One-time CRM migration must preserve all historical data
- Regulatory: Open disclosure tracking is a regulatory requirement (Best Practice Guide)

**Approvers:**
- [ ] Marianne (Clinical Product Owner)
- [ ] Clinical Lead (SIRS compliance sign-off)
- [ ] Product team (UX and technical feasibility)

### Dependencies

**Depends On:**
- Zoho CRM incident data export (for migration job)
- Existing Portal package/client data model (incidents attach to packages)
- Portal role/permission system (Care Partner, Clinical Team, Coordinator roles)

**Blocks:**
- US14 (Incident → Case Automation) — depends on CLI epic
- US15 (Risk Profile Auto-Update) — depends on RNC2 epic
- Phase 2 automation features depend on Phase 1 data model being stable

---

## Planning

### Screen Inventory

| Screen | Type | Priority | FR Coverage |
|--------|------|----------|-------------|
| **Incident Create (Wizard)** | New page | P1 | FR-001 to FR-011, FR-019, FR-020, FR-026 |
| **Incident Detail/Edit** | New page | P1 | FR-012, FR-027, FR-028, FR-029 |
| **Package Incidents Tab** | Enhanced existing | P1 | FR-013, FR-014 |
| **Global Incidents List** | Enhanced existing | P2 | FR-015, FR-024 |
| **SIRS Priority Assignment** | Inline on Detail | P2 | FR-022, FR-023, FR-024, FR-025 |
| **Public Intake Form** | New standalone | P2 | FR-033 |
| **Pending Review Queue** | New page/tab | P2 | FR-033 |
| **Lifecycle Progression** | Inline on Detail | P1 | FR-028, FR-029, FR-031 |

### V2 Intake Form — Section Breakdown

The 10-section V2 form maps to a wizard with logical groupings:

| Wizard Step | V2 Sections | Fields | Auto-filled |
|-------------|-------------|--------|-------------|
| **1. Client & Incident** | Client ID + Incident Details | Name, DOB, SAH ID, Date, Time, Location, Care Context | Name, DOB, SAH ID (from package) |
| **2. What Happened** | Reporter + Description | Reporter name, role, relationship, narrative | Reporter name, role (from auth) |
| **3. Classification** | Harm Classification + Classification | 4-tier harm selector, Clinical/Non-clinical/SIRS | — |
| **4. Impact & Response** | Outcomes + Actions Taken | Outcomes checklist, Actions checklist, Trend tracking | — |
| **5. Escalation & Follow-up** | Escalation + Follow-up + Disclosure | Who contacted, when, follow-up plan, client informed | — |

**Design Rationale:**
- 5 steps instead of 10 sections — grouping reduces perceived complexity
- Steps 1-2 are pre-filled heavy — fast to complete
- Step 3 is the critical decision point (harm classification drives everything downstream)
- Steps 4-5 can be partially skipped for urgent incidents and completed later via Edit

### Edge Case Inventory

| Edge Case | How to Handle | Priority |
|-----------|---------------|----------|
| No active package for client | Allow creation, flag missing package for resolution | P1 |
| Reporter doesn't know SAH ID | Accept name + DOB as minimum identification | P1 |
| Self-managed client incident | Form works identically — legal responsibility unchanged | P1 |
| Incident outside business hours | Severe Harm = 24h absolute; others use business days | P1 |
| CRM migration: missing/invalid data | Log error, skip record, produce unmigrated report | P1 |
| CRM migration: blank CAT value | Default to Clinical Notification + flag for review | P1 |
| Harm classification changed after intake | Preserve original in immutable snapshot, track both | P1 |
| SIRS deadline already passed at classification | Show as overdue immediately, don't prevent saving | P2 |
| Soft-delete attempted on SIRS incident | Block deletion, show explanation | P2 |
| Public form: duplicate submission | Rate limit catches most; reviewer can reject duplicates | P2 |
| Public form: invalid client details | Sits in Pending Review until reviewer resolves | P2 |
| Lifecycle stage skip without justification | Block the skip, require justification text | P1 |
| Multiple incidents for same event | Allow — each incident is independent | P2 |
| Reporter submits then wants to edit | Editable until Resolved (any Care Partner/Coordinator on that package) | P1 |

### Performance Considerations

**Page Frequency:** High — incidents list accessed multiple times daily by Care Partners during client calls

**Data Considerations:**
- ~930 incidents/month, ~2,781/quarter — pagination required on global list
- Package-level typically <50 incidents — no pagination needed
- CRM migration: one-time bulk job, not a runtime concern
- Incident detail: single record load, lightweight

**Real-time:** Not required for Phase 1. Phase 2 notifications may need polling or SSR.

### Analytics & Success Metrics

**Success Metrics** (from spec):
- SC-001: Incident creation < 5 minutes (vs 10-15 min in CRM)
- SC-002: 100% include harm classification at intake
- SC-003: View incident history in 2 clicks from package
- SC-009: 100% of incidents viewable and editable in Portal

**Events to Track:**
- `incident_create_started` — wizard opened
- `incident_create_completed` — form submitted (with duration)
- `incident_create_abandoned` — wizard closed without submitting (with last step reached)
- `incident_viewed` — detail page opened
- `incident_edited` — field changed and saved
- `incident_stage_advanced` — lifecycle progression
- `incident_stage_skipped` — stage skip with justification
- `incident_sirs_assigned` — SIRS priority set
- `incident_sirs_reported` — marked as reported to ACQSC
- `public_form_submitted` — public intake used
- `public_form_reviewed` — accepted/rejected from queue

### Phased Rollout

**Phase 1 — Portal Intake + Viewer (P1-P2 stories):**
- Incident Create wizard (V2 form)
- Incident Detail/Edit page
- Enhanced package incidents tab
- Enhanced global incidents list
- Basic SIRS deadline tracking
- One-time CRM migration
- Feature flag per organisation
- Public intake form + Pending Review queue

**Phase 2 — Full IMS with Automation (P3-P4 stories):**
- Auto-escalation routing
- Incident → Case automation (CLI dependency)
- Risk profile auto-update (RNC2 dependency)
- SIRS deadline enforcement with alerts
- Notifications (in-app + email)
- Analytics dashboard + Commission-ready export

**Feature Flags:**
- `incident-management` — Per-organisation toggle. When disabled: read-only migrated incidents. When enabled: full V2 create/edit/lifecycle.

---

## Validation

### Risks & Assumptions

**Assumptions:**
- Care Partners will adopt the V2 form without training (plain language design should be self-explanatory)
- 5-step wizard is the right granularity (not too many steps, not too few)
- 4-tier harm classification is intuitive for non-clinical reporters (family members, support workers)
- One-time migration will capture all CRM incidents without significant data loss
- Feature flag rollout allows co-design with early adopters before full rollout

**Risks:**

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Intake form still feels too long | Medium | High | 5-step wizard with pre-fill; benchmark against 5-min target |
| Harm tier confusion for non-clinical reporters | Medium | Medium | Plain language descriptions with examples on each tier card |
| SIRS deadline missed during transition from CRM | Low | High | Migration maps existing SIRS incidents; deadline engine active from day one |
| Public form abuse (spam/fake reports) | Low | Medium | Rate limiting + CAPTCHA; Pending Review queue catches bad submissions |
| CRM migration data quality issues | Medium | Medium | Validation report for unmigrated records; manual review process |
| Clinical team resistance to new lifecycle | Low | Medium | Gradual rollout with co-design; familiar terminology used |

### User Testing Plan

**Approach:** Prototype testing with 3-5 users per role

**Participants:**
- 2-3 Care Partners (coordinators — primary intake users)
- 1-2 Clinical Team members (triage and SIRS workflow)
- 1 external reporter proxy (family member scenario)

**Questions to Answer:**
1. Can a Care Partner complete the intake wizard in under 5 minutes?
2. Is the 4-tier harm classification self-explanatory without training?
3. Can Clinical Team members find and triage SIRS incidents efficiently?
4. Is the lifecycle progression intuitive (Reported → Triaged → ... → Resolved)?
5. Does the public form work for someone with no Portal knowledge?

**Timeline:** Before dev sprint starts — prototype review with Marianne + Clinical Lead

---

## Ready for Mockups

- [x] User research complete
- [x] Competitive research complete (RiskMan, Sonder, SafetyCulture)
- [x] Design principles defined ("Fast capture, thorough follow-up")
- [x] Edge cases identified (14 cases documented)
- [x] Constraints documented (accessibility, security, stakeholder)
- [x] Screen inventory mapped (8 screens)
- [x] Wizard structure defined (5 steps)
- [ ] Stakeholder alignment (Marianne + Clinical Lead + Product)

**Next Step:** `/trilogy-mockup` ✅ Complete — deployed at https://icm-mockups.vercel.app

---

## Gate 2: Design Handover

**Date**: 2026-02-24
**Status**: PASS

### Checklist Results

#### Design Kickoff Completeness
- [x] User research complete — 3 user types, device priority, usage context
- [x] Competitive research — RiskMan, Sonder, SafetyCulture
- [x] Design principles — "Fast capture, thorough follow-up"
- [x] Edge cases — 14 cases with handling strategy
- [x] Constraints — WCAG AA, security, stakeholder, dependencies
- [x] Build size — Large (Ferrari) with component reuse plan

#### Design-Spec Alignment
- [x] All 18 user stories have design consideration
- [x] Success metrics defined (SC-001 to SC-011)
- [x] Phase 1 vs Phase 2 scope clear

#### Mockups
- [x] 5 HTML mockups: Create Wizard, Detail/Edit, Package Tab, Global List, Public Form
- [x] Deployed: https://icm-mockups.vercel.app
- [x] Portal shell with sidebar navigation

#### Stakeholder Alignment
- [x] Constraints and approvers identified
- [x] 6 risks documented with mitigation
- [x] Dependencies mapped (CRM, CLI, RNC2)
- [ ] Stakeholder sign-off (Marianne, Clinical Lead, Product) — pending, not blocking dev planning

### Handover Summary

**What We're Building**: Full incident management system replacing Zoho CRM. Care Partners create/edit incidents via a 5-step V2 wizard form with 4-tier harm classification, SIRS deadline tracking, 6-stage lifecycle, and public intake form for external reporters.

#### Key Screens

| Screen | Mockup | Purpose |
|--------|--------|---------|
| **Create Wizard** | `01-create-wizard.html` | 5-step V2 form with pre-fill, harm classification, outcomes, escalation |
| **Detail/Edit** | `02-incident-detail.html` | Full incident view with lifecycle stepper, SIRS badge, audit trail |
| **Package Incidents** | `03-package-incidents.html` | Client-scoped incident list with harm tier badges, empty state |
| **Global Incidents** | `04-global-incidents.html` | Filtered table for Clinical Team: harm tier, status, date, SIRS |
| **Public Form** | `05-public-form.html` | Standalone V2 form — no login, rate limited, CAPTCHA |

#### Component Decisions

**Reusing Existing:**
- `CommonStepNavigation` — wizard progress
- `CommonTable` — global incidents list with filtering
- `CommonForm` / `CommonFormField` — all form sections
- `CommonBadge` — harm tier + SIRS + lifecycle badges
- `CommonTabs` — detail view sections
- `CommonSelectMenu`, `CommonCheckboxGroup`, `CommonRadioGroup` — form inputs
- `CommonPillSelect` — harm tier selector
- `CommonCard`, `CommonAlert`, `CommonCollapsible`, `CommonDatePicker`

**New Components Needed:**
- Lifecycle stepper (horizontal stage indicator with skip + justification)
- SIRS deadline badge (countdown with amber/red urgency)
- Harm tier card selector (colour + description + timeframe)

#### Critical UX Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Form structure | 5-step wizard (not 10 sections) | Reduces perceived complexity; steps 1-2 pre-fill heavy |
| Harm classification | 4-tier visual cards (not dropdown) | Plain language with colour + timeframe — self-explanatory |
| SIRS workflow | Inline on detail page (not separate screen) | Clinical Lead assigns priority after reviewing harm tier |
| Lifecycle | 6 stages with skip + justification | Flexible enough for low harm (skip escalation) but auditable |
| Public form | Separate standalone page + Pending Review queue | No login needed; quality control via reviewer acceptance |
| Migration | One-time clean cut (not gradual sync) | Portal becomes sole system from day one |

#### Data Requirements

| Screen | Data Needed | Source |
|--------|-------------|--------|
| Create Wizard | Package + client details (pre-fill) | Package model |
| Detail/Edit | Full incident with outcomes, actions, escalation, follow-up, disclosure | Incident aggregate |
| Package Tab | Incidents for package (sorted, with badges) | Package → incidents relationship |
| Global List | All incidents with filters | Incident query with harm/status/date/SIRS filters |
| Public Form | None (standalone) | Creates new pending incident |

#### Open Questions for Development

- [ ] Event sourcing or standard Eloquent for incident aggregate?
- [ ] Custom stored event table (`incident_stored_events`) or shared?
- [ ] How to handle CRM migration — Artisan command or queued job?
- [ ] SIRS deadline calculation — business hours for P2 or calendar days?
- [ ] Feature flag scope — per-organisation via Pennant?

### Next Steps

- [x] Gate 2 PASS — Design handover complete
- [ ] Run `/speckit-plan` to create technical implementation plan
- [ ] Run `/speckit-tasks` to generate implementation task list
- [ ] Developer to review mockups at https://icm-mockups.vercel.app
- [ ] Schedule architecture review for event sourcing / data model decisions
