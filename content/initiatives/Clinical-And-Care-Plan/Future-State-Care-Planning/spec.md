---
title: "Feature Specification: Future State Care Planning (RNC2)"
---

> **[View Mockup](/mockups/future-state-care-planning/index.html)**{.mockup-link}

# Feature Specification: Future State Care Planning (RNC2)

**Epic**: RNC2 — Future State Care Planning
**Linear**: [RNC2 Future State Care Planning](https://linear.app/trilogycare/project/rnc2-future-state-care-planning-tp-2357-e08fb8938c2d)
**Created**: 2026-02-12
**Status**: Draft
**Input**: IDEA-BRIEF approved — 3-pillar system: Maslow-based needs, evidence-based risk scoring, and needs-risk-budget integration

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Create a Simplified Need with Maslow Category (Priority: P1)

As a **Coordinator**, I want to create a new need for a recipient by selecting a care-focused category organised by Maslow's hierarchy, describing the need in plain language, explaining how it will be met, and choosing a funding source — so that I can quickly capture what the recipient actually needs without wading through the current 20-minute form.

**Why this priority**: This is the foundational action. Without simplified needs capture, the entire care planning overhaul can't proceed. Directly addresses Marianne's feedback that the current module is "pretty wordy" and care partners find it overwhelming.

**Independent Test**: Navigate to a recipient's package, open "Add Need", select a category (e.g., "Nutrition & Hydration" under Physiological), fill in description and funding source, save. The need appears in the needs list.

**Acceptance Scenarios**:

1. **Given** a Coordinator is on a recipient's package needs tab, **When** they click "Add Need", **Then** a guided wizard opens with Step 1 showing need categories grouped by Maslow level (Physiological → Safety → Belonging → Esteem → Self-Actualisation)

2. **Given** the wizard is on Step 1 (Define Need), **When** the Coordinator selects a category, enters a description (e.g., "Requires assistance with meal preparation due to limited mobility"), selects "HCP" as the funding source, and completes the wizard, **Then** the need is saved and appears in the needs list under the selected category

3. **Given** the Coordinator selects "Other" as the funding source, **When** they proceed, **Then** they must specify the funding source in a free-text field before the need can be saved

4. **Given** the Coordinator leaves the description blank and attempts to save, **When** validation runs, **Then** the system highlights the missing field and prevents saving

---

### User Story 2 — Link Risks to a Need (Priority: P1)

As a **Coordinator**, I want to associate one or more existing risks to a need during the creation wizard — so that I can see which risks are connected to which needs, and the care plan reflects the relationship between what the recipient needs and what could go wrong.

**Why this priority**: Risk-to-need linking is the core integration that makes this module different from v1. Without it, needs remain disconnected from risks — the exact problem identified in the IDEA-BRIEF.

**Independent Test**: Create a need and on Step 2 of the wizard, select existing package risks. After saving, the need's detail view shows linked risks.

**Acceptance Scenarios**:

1. **Given** a package has existing risks (e.g., "Falls Risk", "Medication Risk"), **When** the Coordinator reaches Step 2 (Link Risks) of the wizard, **Then** they see a list of the package's existing risks available for selection

2. **Given** the Coordinator selects "Falls Risk" and "Medication Risk" on Step 2, **When** they complete the wizard, **Then** the saved need shows both risks as linked associations

3. **Given** a package has no existing risks, **When** the Coordinator reaches Step 2, **Then** the step shows an empty state message and the Coordinator can skip to Step 3

4. **Given** a Coordinator is editing an existing need, **When** they change the linked risks, **Then** the associations update accordingly

---

### User Story 3 — Associate Budget Items to a Need (Priority: P1)

As a **Coordinator**, I want to associate one or more existing budget items to a need during the creation wizard — so that I can see the funding allocation for each need and trace the flow from need → budget → service.

**Why this priority**: Budget association connects "what the recipient needs" to "how we're paying for it" — enabling future cost-per-need analysis and care plan generation.

**Independent Test**: Create a need and on Step 3 of the wizard, select existing package budget items. After saving, the need shows linked budget items.

**Acceptance Scenarios**:

1. **Given** a package has existing budget items (e.g., "Personal Care — $150/week"), **When** the Coordinator reaches Step 3 (Associate Budget Items), **Then** they see a list of available budget items for selection

2. **Given** the Coordinator selects two budget items on Step 3, **When** they complete the wizard, **Then** the saved need shows both budget items as linked associations

3. **Given** a package has no budget items, **When** the Coordinator reaches Step 3, **Then** the step shows an empty state and the Coordinator can save without budget associations

4. **Given** a budget item is already associated with a different need, **When** the Coordinator views it on Step 3, **Then** it is still available for selection (a budget item can serve multiple needs)

---

### User Story 4 — Evidence-Based Risk Assessment with Scoring (Priority: P1)

As a **Clinician**, I want to assess a recipient's risk using structured, scored questions instead of subjective high/medium/low ratings — so that risk levels are objective, comparable across clinicians, and backed by an evidence trail.

**Why this priority**: Subjective risk ratings are the single biggest clinical governance gap. One clinician's "high" is another's "medium". Marianne has already built the risk scoring methodology document — this is ready for implementation and is an audit differentiator.

**Independent Test**: Open a recipient's risk assessment, answer structured questions for a risk category (e.g., Falls), and see a calculated risk score that is consistent regardless of which clinician performs the assessment.

**Acceptance Scenarios**:

1. **Given** a Clinician opens a Falls risk assessment for a recipient, **When** they answer structured questions (fall frequency, hospitalisation history, medication count, mobility level), **Then** the system calculates and displays a risk score for Falls based on impact x likelihood

2. **Given** two different Clinicians answer the same structured questions with the same responses for the same recipient, **When** the system calculates risk scores, **Then** both scores are identical (eliminating subjective variance)

3. **Given** a Clinician completes a risk assessment, **When** they view the results, **Then** each answer is recorded with the specific question asked, the response given, and how it contributed to the score — creating an evidence trail

4. **Given** a Clinician answers "3-5 falls in the last 6 months" and "falls caused hospitalisation", **When** the score is calculated, **Then** the Falls score is higher than if they answered "0 falls" — and the factors contributing to the score are visible

---

### User Story 5 — Aggregated Client Risk Score with Drill-Down (Priority: P1)

As a **Coordinator** or **Clinician**, I want to see a single aggregated risk score for a recipient that I can drill down into by risk category — so that I can quickly understand the overall risk picture and know where to focus attention.

**Why this priority**: Aggregated scores enable at-a-glance prioritisation. The IDEA-BRIEF example shows "Client Overall Score: 67/100" with category breakdown. This replaces the current approach where risk/needs data has generic "October" updated dates and nobody has actually reviewed it.

**Independent Test**: View a recipient's profile and see an overall risk score. Click to drill down into category-level scores showing which factors contribute most.

**Acceptance Scenarios**:

1. **Given** a recipient has assessed risks across multiple categories (Falls: 42, Cognitive: 15, Medication: 7), **When** a Coordinator views the recipient's profile, **Then** they see an aggregated overall risk score combining all category scores

2. **Given** the overall score is displayed, **When** the Coordinator clicks to drill down, **Then** they see each risk category's individual score, the contributing factors, and the percentage each contributes to the overall score

3. **Given** a recipient has only one assessed risk category, **When** viewing the overall score, **Then** the score reflects only that category and the drill-down shows other categories as "Not assessed"

4. **Given** a risk assessment is updated (e.g., a new fall is recorded), **When** the system recalculates, **Then** the category score and overall score update to reflect the new data

---

### User Story 6 — Clinical Risk Badge on Recipient Profile (Priority: P2)

As a **Coordinator**, I want to see a clinical risk badge on a recipient's profile showing their overall risk score alongside existing package/HCP badges — so that during calls I can quickly see if a recipient is high-risk without navigating to their risk register.

**Why this priority**: Quick visual indicator during routine calls. Coordinators handle many calls daily and need at-a-glance risk awareness. Marianne specifically requested this as a "quick visual for care partners during calls".

**Independent Test**: View a recipient's profile header and see the clinical risk badge with a numeric score and colour indicator alongside existing badges.

**Acceptance Scenarios**:

1. **Given** a recipient has an overall risk score of 67/100, **When** a Coordinator views the recipient's profile, **Then** a clinical risk badge displays showing "67" with a colour indicating severity (e.g., amber for moderate risk)

2. **Given** a recipient has no risk assessments, **When** viewing their profile, **Then** no clinical risk badge is shown (or shows "Not assessed")

3. **Given** a recipient's risk score changes from 45 to 72 after a new assessment, **When** the Coordinator next views the profile, **Then** the badge reflects the updated score and colour

---

### User Story 7 — Needs-to-Budget Traceability View (Priority: P2)

As a **Coordinator**, I want to see a unified view that links each need to its associated risks and budget items — so that I can trace the full chain from "what the recipient needs" through "what risks exist" to "how we're funding the response".

**Why this priority**: The IDEA-BRIEF identifies disconnected data as a core problem — "no linkage between needs, risks, budget items, and service providers". This view materialises the Pillar 3 integration.

**Independent Test**: View a recipient's needs and see each need with its linked risks and budget items in a single view, with the ability to navigate to any linked entity.

**Acceptance Scenarios**:

1. **Given** a recipient has needs with linked risks and budget items, **When** a Coordinator views the needs list, **Then** each need shows its Maslow category, linked risks (with scores if available), and linked budget items (with amounts)

2. **Given** a need has no linked risks or budget items, **When** viewing the traceability view, **Then** the need displays with empty risk/budget sections and an indication that associations can be added

3. **Given** a Coordinator clicks on a linked risk from the needs view, **When** navigating, **Then** they are taken to the risk detail showing the full assessment and evidence trail

---

### User Story 8 — View and Manage Needs List (Priority: P2)

As a **Coordinator**, I want to see all of a recipient's simplified needs in a clear list grouped or filterable by Maslow category — so that I can quickly understand the full picture and manage them efficiently.

**Why this priority**: Completes the CRUD cycle and provides the day-to-day working view for Coordinators.

**Independent Test**: Create several needs across different Maslow categories and verify they display correctly in the list with category, description, funding source, linked risk count, and linked budget item count.

**Acceptance Scenarios**:

1. **Given** a package has needs across multiple Maslow levels, **When** the Coordinator views the needs tab, **Then** they see each need with its category, description summary, funding source, number of linked risks, and number of linked budget items

2. **Given** the Coordinator clicks "Edit" on a need, **When** the wizard opens, **Then** it is pre-populated with all existing data including linked risks and budget items

3. **Given** the Coordinator clicks "Delete" on a need, **When** they confirm the deletion, **Then** the need is removed, its risk associations are unlinked, and its budget item associations are cleared

---

### User Story 9 — Incident Data Feeds Risk Score Automatically (Priority: P2)

As a **Clinician**, I want incident data (e.g., a recorded fall) to automatically update the relevant risk factor data — so that risk scores stay current without manual re-assessment after every incident.

**Why this priority**: Real-time risk accuracy. If a recipient has a fall recorded as an incident, their Falls risk score should reflect this without waiting for the next scheduled assessment. Marianne specified: "falls incidents update prevalence in real-time".

**Independent Test**: Record a falls incident for a recipient who has a Falls risk assessment. The Falls risk score updates to reflect the new incident data.

**Acceptance Scenarios**:

1. **Given** a recipient has a Falls risk score based on "0 falls in last 6 months", **When** a falls incident is recorded through Incident Management (ICM), **Then** the Falls risk prevalence factor updates and the score recalculates

2. **Given** an incident is recorded, **When** the risk score updates, **Then** the system records what triggered the update (incident reference) for audit trail

3. **Given** an incident is recorded for a category where the recipient has no existing risk assessment, **When** the system processes the incident, **Then** a notification or flag alerts the clinician that a risk assessment may be needed for that category

---

### User Story 10 — Gradual Rollout via Feature Flag (Priority: P2)

As a **Product Owner**, I want to enable the new care planning features per organisation — so that we can roll out gradually, gather feedback, and ensure it works before making it available to all organisations.

**Why this priority**: Risk mitigation. The current system serves all packages. Marianne emphasised co-design: care partners "were not consulted on original rollout — just jumped on them". Gradual rollout prevents repeating this.

**Independent Test**: Enable the flag for one organisation and verify they see the new UI, while another organisation sees the current UI.

**Acceptance Scenarios**:

1. **Given** the feature flag is enabled for Organisation A, **When** a Coordinator from Organisation A views the needs/risk tabs, **Then** they see the new simplified needs interface and scored risk assessments

2. **Given** the feature flag is disabled for Organisation B, **When** a Coordinator from Organisation B views the same tabs, **Then** they see the existing interfaces unchanged

3. **Given** the feature flag is toggled from disabled to enabled, **When** a Coordinator refreshes, **Then** they see the new interface immediately

---

### User Story 11 — Clinician Population View by Risk/Condition (Priority: P3)

As a **Clinician**, I want to see all my recipients grouped by risk category or condition at a pod level — so that I can plan my monthly workload by knowing "I have 75 clients with chronic dementia" rather than reviewing each client individually.

**Why this priority**: Clinician workflow optimisation. Currently clinicians have no aggregate view. Marianne described this as enabling "clinical workload planning" at the population level.

**Independent Test**: A Clinician views a dashboard showing recipient counts grouped by risk category, filterable by their assigned pod/caseload.

**Acceptance Scenarios**:

1. **Given** a Clinician has 200 assigned recipients, **When** they open the population view, **Then** they see recipient counts grouped by risk category (e.g., Falls: 45, Cognitive: 32, Medication: 28)

2. **Given** the Clinician clicks on a risk category group, **When** the detail opens, **Then** they see the list of recipients in that category sorted by risk score (highest first)

3. **Given** a recipient's risk category changes after reassessment, **When** the Clinician refreshes the population view, **Then** the counts update to reflect the change

---

### User Story 12 — Annual Review Validation of Needs and Risks (Priority: P3)

As a **Coordinator**, I want annual reviews to prompt re-validation of all needs and risks — so that updated dates reflect actual human review, not system timestamps, and nothing goes stale.

**Why this priority**: Compliance and audit readiness. The IDEA-BRIEF identifies that current risk/needs data has "generic 'October' updated dates — nobody has actually reviewed". This ensures dates mean something.

**Independent Test**: An annual review is triggered for a recipient. The Coordinator is prompted to re-validate each need and risk. After validation, timestamps reflect actual review dates.

**Acceptance Scenarios**:

1. **Given** a recipient's annual review is due, **When** the Coordinator starts the review, **Then** they see a checklist of all needs and risks requiring re-validation

2. **Given** the Coordinator reviews a need and confirms it's still accurate, **When** they mark it as reviewed, **Then** the need's "last reviewed" date updates to today with the Coordinator's name

3. **Given** the Coordinator reviews a risk and the circumstances have changed, **When** they update the assessment answers, **Then** the risk score recalculates and the review date updates

---

### Edge Cases

- What happens when a Coordinator creates a v2 need on a package that already has v1 needs? — Both coexist; v1 needs remain visible and editable through the v1 interface
- What happens when a linked risk is deleted from the package? — The risk association is removed from the need automatically; the need itself is not affected
- What happens when a linked budget item is deleted? — The budget item association is cleared from the need automatically
- What happens if the same need category is used twice on one package? — Allowed; a recipient may have multiple needs within the same Maslow category
- What happens if a risk assessment question set changes after scores have been calculated? — Existing scores remain valid; a re-assessment using the new questions is prompted at next review
- What happens if an incident triggers a risk update but the risk category doesn't exist for that recipient? — A notification alerts the clinician; no automatic risk creation without clinical oversight
- What happens when a recipient transfers between organisations with different feature flag states? — Their data persists; the UI shown depends on the receiving organisation's feature flag setting
- What happens if a Clinician disagrees with a calculated risk score? — The score is system-generated from structured answers; to change the score, they must update their assessment answers. An optional "Clinical override note" can be recorded for audit trail [NEEDS CLARIFICATION: Should clinicians be able to override calculated scores with a manual adjustment + justification?]

---

## Requirements *(mandatory)*

### Functional Requirements

**Pillar 1: Maslow-Based Needs Framework**

- **FR-001**: System MUST provide 14 need categories organised across 5 Maslow levels: Physiological (4), Safety (3), Belonging (3), Esteem (2), Self-Actualisation (2)
- **FR-002**: System MUST allow Coordinators to create a need by selecting a category, entering a description, optionally describing how it will be met, and selecting a funding source
- **FR-003**: System MUST support these funding sources: HCP, Informal Support, PHN, PBS, Private Health Insurance, Other (with free-text specification)
- **FR-004**: System MUST present the creation/editing flow as a guided wizard with three steps: Define Need → Link Risks → Associate Budget Items
- **FR-005**: System MUST preserve all entered data when navigating between wizard steps
- **FR-006**: System MUST validate required fields (category, description, funding source) before saving
- **FR-007**: System MUST support editing existing needs, pre-populating the wizard with current data
- **FR-008**: System MUST support soft-deleting needs, cleaning up risk and budget item associations
- **FR-009**: System MUST record who created and last updated each need
- **FR-010**: System MUST allow each need to be flagged as "Add to Care Plan" (default: yes)
- **FR-011**: System MUST coexist with the current needs module — existing v1 needs are not migrated or affected

**Pillar 2: Evidence-Based Risk Scoring**

- **FR-012**: System MUST replace subjective risk ratings with structured, scored questions for each risk category
- **FR-013**: System MUST calculate a numeric risk score per category using an impact x likelihood model from structured question responses
- **FR-014**: System MUST aggregate category-level scores into a single overall client risk score
- **FR-015**: System MUST display the overall score with drill-down into category-level breakdowns showing contributing factors
- **FR-016**: System MUST use client-friendly language in structured assessment questions — suitable for client self-assessment where appropriate
- **FR-017**: System MUST record each assessment answer with the question asked, response given, and contribution to the score (evidence trail)
- **FR-018**: System MUST display a clinical risk badge on the recipient's profile showing the overall risk score with colour-coded severity
- **FR-019**: System MUST ensure identical structured answers produce identical scores regardless of which clinician performs the assessment
- **FR-020**: System MUST support the existing 26 risk categories while adding scoring methodology to each [NEEDS CLARIFICATION: Will all 26 categories get scoring simultaneously, or will scoring roll out category-by-category starting with highest-priority categories like Falls?]

**Pillar 3: Needs-Risk-Budget Integration**

- **FR-021**: System MUST allow linking one or more existing package risks to a need
- **FR-022**: System MUST allow associating one or more existing package budget items to a need
- **FR-023**: System MUST display a traceability view showing need → linked risks (with scores) → linked budget items (with amounts)
- **FR-024**: System MUST allow navigation from a need to its linked risks and budget items, and vice versa

**Risk-Incident Integration**

- **FR-025**: System MUST automatically update risk factor data when relevant incidents are recorded (e.g., falls incident → falls risk prevalence factor)
- **FR-026**: System MUST record what triggered each automatic risk update (incident reference) for audit trail
- **FR-027**: System MUST notify clinicians when an incident is recorded for a risk category where no assessment exists

**Operational Capabilities**

- **FR-028**: System MUST provide a clinician population view showing recipient counts grouped by risk category, filterable by pod/caseload
- **FR-029**: System MUST support annual review validation — prompting re-validation of all needs and risks with actual review timestamps
- **FR-030**: System MUST maintain a complete audit trail for every need and risk creation, update, deletion, and review
- **FR-031**: System MUST respect existing permissions — only authorised users can create, edit, or delete needs and risks
- **FR-032**: System MUST be controllable via a feature flag that can be toggled per organisation for gradual rollout

### Key Entities

- **Need Category**: A classification of care need based on Maslow's hierarchy. Each category belongs to a Maslow level, has a display name, priority order, and optional icon/colour. 14 predefined categories.

- **Need (v2)**: A specific care requirement for a recipient within a package. Contains: what the need is (description), how it will be met, funding source, priority, and whether it should appear on the care plan. Linked to one category, zero or more risks, and zero or more budget items.

- **Risk** *(existing, enhanced)*: An identified hazard or concern for the recipient. Already exists with 26 categories and questionnaire-based assessment. Enhanced with calculated risk scoring from structured questions.

- **Risk Score**: A calculated numeric value per risk category derived from structured assessment answers using impact x likelihood methodology. Aggregated across categories into an overall client risk score.

- **Risk Category** *(existing)*: One of 26 clinical risk classifications (Falls, Medication Safety, Cognition, etc.). Enhanced with scoring methodology per category.

- **Budget Item** *(existing)*: A funded line item within the recipient's package budget. Referenced by needs through an association — not duplicated.

- **Incident** *(existing, via ICM)*: A reactive event (fall, medication error, etc.) recorded through Incident Management. Feeds risk scoring data automatically.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Coordinators can create a new need in under 2 minutes using the wizard (compared to 20+ minutes with the current form)
- **SC-002**: 100% of needs created through v2 have an associated Maslow category and funding source (structured data, no free-text-only records)
- **SC-003**: At least 80% of needs created during pilot have one or more linked risks (demonstrating adoption of the integration feature)
- **SC-004**: Two Clinicians assessing the same recipient for the same risk category produce identical risk scores when answering questions consistently (zero subjective variance)
- **SC-005**: All need and risk creations, updates, deletions, and reviews are captured in the audit trail with the acting user and timestamp
- **SC-006**: During pilot, Coordinators report the new form as "simpler" or "easier to use" compared to the current module (qualitative feedback from co-design sessions)
- **SC-007**: Incident-triggered risk updates are reflected in risk scores within 5 minutes of incident recording (near real-time)
- **SC-008**: Clinicians can view their caseload grouped by risk category in under 10 seconds (population view performance)
- **SC-009**: The new system works independently of the existing system — toggling the feature flag on or off does not affect existing data

## Clarification Outcomes

### Q1: [Scope] This spec covers 3 pillars with 12 user stories. Should this be restructured as a parent initiative with separate specs for each pillar?
**Answer:** The Needs V2 (Simplified Needs Module) spec already exists as a separate spec under the RNC2 umbrella, with its own Gate 1 passed. The Risk Radar (RRA) spec also exists separately with Gate 1 passed (2026-03-05). This RNC2 spec is effectively a parent/umbrella spec that combines all three pillars. Stories 1-3, 8 overlap almost verbatim with the Needs V2 spec. Stories 4-5 overlap with Risk Radar. **This spec SHOULD be restructured as a parent initiative document that references the individual pillar specs rather than duplicating them. Pillar 1 = Needs V2 spec, Pillar 2 = Risk Radar spec, Pillar 3 = the integration layer (Stories 7, part of 3). This avoids spec drift where the parent and child specs diverge.**

### Q2: [Data] FR-020 says 26 existing risk categories must support scoring methodology. Should all 26 get scoring simultaneously or roll out category-by-category?
**Answer:** The Risk Radar spec (which supersedes Pillar 2 of this spec) defines 16 clinical risk areas (not 26) mapped to 5 clinical domains. The RiskCategorySeeder confirms 28 existing risk categories (including Hearing/Vision Loss rename). Risk Radar maps 16 of these 28 to clinical risk areas; the remaining 12 stay on the "All Risks" tab without scoring. **Resolution: NOT all 26/28 categories get scoring. 16 clinical risk areas receive consequence scoring per Maryanne's framework. The remaining 12 categories are excluded from the radar but remain fully functional. This significantly reduces scope. The RNC2 spec's FR-020 should be updated to reference the Risk Radar spec's 16-area model.**

### Q3: [Dependency] US9 (Incident Data Feeds Risk Score) depends on ICM. What is the fallback if incidents remain in CRM?
**Answer:** The Incident domain exists in the codebase (`domain/Incident/Models/Incident.php`) with models, enums for classification, stage, resolution, and outcome. Incidents are currently synced from Zoho (`domain/Incident/Jobs/SyncIncidentsFromZohoJob.php`). The Incident model has `IncidentClassificationEnum`, `IncidentStageEnum`, `IncidentResolutionEnum`, and `IncidentOutcomeEnum`. **Incidents are already in Portal (synced from Zoho). US9 can use existing incident data without waiting for ICM to deliver native incident creation. The risk-incident integration just needs to query existing Incident records. ICM enhances this by adding native incident creation, but the integration can work with synced data as a starting point.**

### Q4: [Edge Case] Should clinicians be able to override calculated risk scores with manual adjustment + justification?
**Answer:** The Risk Radar spec (which supersedes Pillar 2) resolves this clearly: FR-003b says "System MUST support clinical judgement override -- if the clinician's mitigation rating does not align with the calculated domain risk, they MUST document rationale in an override field (governance safeguard)." The override is on the mitigation rating (Strong/Partial/None), not on the raw consequence score. **Resolution: Clinicians override the mitigation effectiveness per domain, not the calculated score directly. The consequence score (0-4) is always derived from the questionnaire -- no manual score editing. The override mechanism is on the mitigation assessment, with mandatory documented rationale. This preserves the objectivity of consequence scoring while allowing clinical judgement on mitigation.**

### Q5: [Integration] Risk Radar (RRA) uses consequence + mitigation = residual risk. This spec (RNC2) uses impact x likelihood. Are they the same or competing approaches?
**Answer:** The Risk Radar spec (updated 2026-03-10, Gate 1 passed 2026-03-05) supersedes the initial RNC2 Pillar 2 model. The RRA spec explicitly states: "Input: Maryanne's whole-of-client clinical risk framework (Feb 2026)... Replaces initial P x I model with residual-risk model (consequence + mitigation = residual risk)." The initial clarification in the RRA spec says "Initial spec proposed Max/Mean toggle. Now superseded by residual-risk model." **The impact x likelihood model in this RNC2 spec is superseded. The correct model is Risk Radar's residual-risk model: consequence (0-4 from questionnaire) minus mitigation effectiveness (0-2) = residual risk. This RNC2 spec's FR-013 ("impact x likelihood model") should be updated to reference the Risk Radar spec's residual-risk calculation.**

### Q6: [Data] The spec introduces 14 need categories across 5 Maslow levels. The existing NeedCategory model has different categories (Domestic assistance, Meals, Personal care, etc.). How do v1 and v2 categories coexist?
**Answer:** The existing `NeedCategory` model (`domain/Need/Models/NeedCategory.php`) has categories like "Domestic assistance", "Meals", "Social support and community engagement", etc. (mapped from Zoho via `PackageNeed::$mapping`). The v2 Maslow-based categories are completely different (Nutrition & Hydration, Mobility & Physical Function, etc.). FR-011 and FR-014 say v1 and v2 coexist. **The v2 categories should be a separate model (e.g., `NeedCategoryV2` or a `maslow_need_categories` table) rather than extending the existing `NeedCategory`. The existing model is tightly coupled to Zoho mapping and the current needs form. The feature flag controls which UI is shown, and v1 data remains in the `package_needs` table while v2 data uses a new table.**

### Q7: [Performance] US11 (Clinician Population View) requires querying risk data across 200+ recipients filtered by pod. Is this performant with the calculated-on-read approach?
**Answer:** FR-020 in the Risk Radar spec says "Domain residual risk scores MUST be calculated on read." For a population view querying 200+ packages with 5 domains each, this means calculating 1000+ domain scores on every page load. **This is a performance concern for the population view. Recommendation: The per-package risk tab can use calculated-on-read (a single package). The population view (US11) should use a materialized/cached score stored on the package record (e.g., `overall_risk_status` column updated whenever an assessment changes). This is a Phase 2/3 optimization that should be planned for when implementing US11.**

## Refined Requirements

1. **Spec restructuring**: This RNC2 spec SHOULD be restructured as a parent initiative document that references Needs V2 and Risk Radar as pillar specs, rather than duplicating their content. The integration layer (Pillar 3: needs-risk-budget traceability) is the unique content in this spec.
2. **Risk model alignment**: FR-013 references "impact x likelihood" which is superseded by Risk Radar's "consequence - mitigation = residual risk" model. Update FR-013 to reference the Risk Radar spec.
3. **Need category separation**: V2 Maslow-based categories SHOULD use a separate database table from v1 categories to avoid coupling with the existing Zoho-derived category model.
4. **Population view performance**: US11 (Clinician Population View) SHOULD use a materialized/cached risk status rather than calculating-on-read across 200+ packages.
