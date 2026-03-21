---
title: "Feature Specification: Risk Radar"
description: "Clinical And Care Plan > Risk Radar"
---

> **[View Mockup](/mockups/risk-radar/index.html)**{.mockup-link}

# Feature Specification: Risk Radar

**Epic**: RRA — Risk Radar
**Created**: 2026-02-14
**Updated**: 2026-03-10
**Status**: Approved (Gate 1 passed 2026-03-05)
**Input**: Maryanne's whole-of-client clinical risk framework (Feb 2026) — Clinical Risk Domains, Clinical Risk Consequence Table, Organisational Risk Management Procedure. Replaces initial P × I model with residual-risk model (consequence + mitigation = residual risk).

---

## User Scenarios & Testing *(mandatory)*

### User Story 0 — View Risks as Cards with Inline Check-In Questions (Priority: P1)

As a **Coordinator**, I want to see each risk displayed as a card showing the risk category, status indicators, details, and actions — with an expandable section showing the check-in questions configured for that risk — so that I can scan a client's risk profile at a glance and see the monitoring questions without opening an edit form.

**Why this priority**: The current risk list is a flat data table that hides check-in questions inside the edit modal. Coordinators cannot see what questions are asked during care partner check-ins without editing each risk individually. Cards with inline accordions make risks scannable and check-in questions visible — and this card layout is the foundation for domain grouping, consequence badges, and traffic-light colours in later stories.

**Independent Test**: Can be tested by navigating to a package's risk tab and verifying each risk appears as a card with its category name, status badges (care plan, import generated, not identified during assessment), details summary, action buttons (view, edit, delete), and an expandable accordion showing the risk's check-in questions.

**Acceptance Scenarios**:

1. **Given** a package has risks, **When** a Coordinator views the risk tab, **Then** each risk displays as a card showing: risk category name, status badges (care plan, import generated, not identified during assessment), a details summary, the last updated date, and action buttons (view, edit, delete)

2. **Given** a risk has check-in questions configured, **When** the Coordinator views the risk card, **Then** a collapsible accordion shows the question count (e.g., "Check-In Questions (3)") and can be expanded to see each question with its answer type badge (free text, yes/no, multiple choice, rating 1-5)

3. **Given** a risk has no check-in questions, **When** the Coordinator views the risk card, **Then** no accordion section is shown — the card displays only the risk information

4. **Given** a Coordinator expands the check-in questions accordion on a risk card, **When** they view the questions, **Then** the questions display with answer type badges and support drag-and-drop reordering — all other editing (add, edit text, delete) still happens through the risk edit form

5. **Given** a package has no risks, **When** the Coordinator views the risk tab, **Then** an empty state is shown with a prompt to add a risk

---

### User Story 0b — Step-Based Risk Form (Priority: P1)

As a **Coordinator**, I want the risk creation and edit form to be organised into clear steps rather than a single long scroll — so that I can focus on one section at a time and the form feels manageable regardless of which risk category I select.

**Why this priority**: The current risk form presents all fields in a single scrollable modal — common fields, category-specific detail fields, and check-in questions all mixed together. For complex risk categories (e.g., Allergies with 10+ conditional fields), the form becomes overwhelming. A step-based flow groups related fields logically and reveals complexity progressively.

**Independent Test**: Can be tested by opening the Add Risk or Edit Risk form and verifying the form is split into navigable steps with clear step indicators, per-step validation, and the ability to move between steps.

**Acceptance Scenarios**:

1. **Given** a Coordinator opens the Add Risk form, **When** the form loads, **Then** it displays Step 1 (Risk Basics) with: Risk Category, Need, Add to care plan, Not identified during assessment, Details, and Action Plan

2. **Given** a Coordinator has selected a risk category (e.g., Allergies) on Step 1, **When** they proceed to Step 2 (Risk Details), **Then** the form shows only the category-specific fields for the selected category (e.g., Allergies present, Anaphylaxis history, Has EpiPen)

3. **Given** a Coordinator is editing an existing risk, **When** they proceed to Step 3 (Check-In Questions), **Then** the form shows the check-in questions section where they can add, edit, or remove questions for this risk

4. **Given** a Coordinator is creating a new risk (no risk ID yet), **When** they view the step navigation, **Then** Step 3 (Check-In Questions) is not shown — questions can only be added after the risk is saved

5. **Given** a Coordinator is on Step 2, **When** they click back to Step 1, **Then** their previously entered data is preserved — no data is lost when navigating between steps

---

### User Story 1 — Assess a Client's Risk via Questionnaire (Priority: P1)

As a **Coordinator**, I want to assess a client's clinical risk using plain-language questionnaire responses that map to consequence levels (0-4) — so that each risk area has an objective, defensible score based on the client's reported experience, not subjective clinical judgement alone.

**Why this priority**: Without consequence scoring at the individual risk level, nothing else in Risk Radar works. This is the data input that feeds domain scores, mitigation assessment, residual risk, and all visualisations. Maryanne's framework provides 16 risk areas with specific client questions that directly map to consequence levels.

**Independent Test**: Can be tested by navigating to a package's risk tab, selecting a risk area (e.g., Falls), answering the questionnaire ("Have you had a few falls that caused bruises or small injuries?"), and seeing the risk display its consequence level as Moderate (2).

**Acceptance Scenarios**:

1. **Given** a Coordinator opens the risk assessment for a package, **When** they select a risk area (e.g., Falls), **Then** the system presents the corresponding client questionnaire with plain-language response options that map to consequence levels (Negligible 0, Minor 1, Moderate 2, Major 3, Extreme 4)

2. **Given** a Coordinator selects the Falls response "Have you had a few falls that caused bruises or small injuries?", **When** they save, **Then** the consequence level is recorded as Moderate (2) and displayed on the risk card

3. **Given** an existing risk has no consequence score (legacy data), **When** a Coordinator views it, **Then** the risk displays as "Not assessed" with a prompt to assess — it does not block any workflow

4. **Given** a Coordinator updates a risk area's questionnaire response, **When** they save, **Then** the consequence level recalculates immediately and the change is recorded in the audit trail

---

### User Story 2 — Assess Mitigation Effectiveness per Domain (Priority: P1)

As a **Coordinator** or **Clinician**, I want to assess the mitigation effectiveness for each clinical domain (Strong / Partial / None) using structured decision prompts — so that the system can calculate residual risk that reflects the whole client, not just raw consequence scores.

**Why this priority**: This is the core innovation of Maryanne's framework. A client with high falls risk but strong mitigation (equipment, supervision, insight) should not be treated as "high risk". Without mitigation assessment, Risk Radar would over-escalate stable, well-managed clients while missing those with genuinely unmitigated risks.

**Independent Test**: Can be tested by assessing Falls consequence as Major (3), then setting Functional Ability domain mitigation to Strong (2), and seeing the residual risk for that domain is lower than the raw consequence.

**Acceptance Scenarios**:

1. **Given** a domain has one or more assessed risk areas, **When** the Coordinator views the domain assessment, **Then** the system presents structured decision prompts for mitigation effectiveness: Strong (2) — controls in place, used correctly, adhered to; Partial (1) — controls present but inconsistently applied; None (0) — controls absent, refused, or ineffective

2. **Given** the Coordinator selects "Strong mitigation" for the Functional Ability domain, **When** they save, **Then** the mitigation score (2) is recorded against the domain and the residual risk recalculates

3. **Given** a clinician disagrees with the calculated residual risk, **When** they select a different mitigation level, **Then** the system requires a documented rationale in the override field (governance safeguard)

4. **Given** a domain has no mitigation assessment, **When** the system calculates residual risk, **Then** it defaults to "No mitigation" (0) — worst case, ensuring safety

---

### User Story 3 — See the Traffic-Light Risk Status (Priority: P1)

As a **Care Partner** or **POD Leader**, I want to see a single traffic-light status (Green / Amber / Red) for each client — so that I can quickly identify which clients need attention now, who needs monitoring, and who is stable, without interpreting complex clinical data.

**Why this priority**: This is the primary user-facing output. Maryanne's framework synthesises domain residual risks into one traffic-light indicator. Care partners need simplicity. The traffic-light tells them what to do — Green = stable, Amber = monitor, Red = act now.

**Independent Test**: Can be tested by completing risk assessments and mitigation for a package and verifying the traffic-light badge appears on the client/package profile, correctly reflecting the residual risk synthesis.

**Acceptance Scenarios**:

1. **Given** a package has assessed risks and mitigation across domains, **When** the system synthesises domain residual risks, **Then** a traffic-light badge (Green / Amber / Red) displays on the package risk profile header with the primary driver(s) of risk visible on hover

2. **Given** one domain has Red residual risk while others are Green, **When** the traffic-light is calculated, **Then** the overall status reflects the highest-risk domain (Red) — a single unmitigated domain drives the status up

3. **Given** a package has no assessed risks, **When** the Coordinator views the header, **Then** the traffic-light badge shows "Not assessed" rather than Green

4. **Given** a POD leader views their client list, **When** traffic-light statuses are present, **Then** clients can be sorted by risk status (Red first, then Amber, then Green)

---

### User Story 4 — View Domain Scores on the Risk Radar (Priority: P1)

As a **Coordinator**, I want to see the package's risks grouped into 5 clinical domains with a visual radar chart or bar chart — so that I can understand the client's overall risk landscape in 10 seconds without reading every individual risk card.

**Why this priority**: This is the core visualisation — the "radar" in Risk Radar. Maryanne's framework groups 16 risk areas into 5 evidence-based clinical domains. Care partners currently scroll through flat risk cards with no structure. This replaces subjective overview with a quantified, visual summary.

**Independent Test**: Can be tested by assessing several risk areas across multiple domains and verifying the radar/bar chart displays 5 domain residual scores with correct traffic-light colours.

**Acceptance Scenarios**:

1. **Given** a package has assessed risks across multiple domains, **When** the Coordinator views the risk tab and selects the "Risk Radar" sub-tab, **Then** a radar chart (or bar chart, togglable) displays 5 domain axes: Functional Ability, Clinical Health Status, Mental Health & Psychosocial, Nutritional & Sensory Health, Safety Risks. The existing "All Risks" sub-tab remains unchanged

2. **Given** the Functional Ability domain has Falls (Major 3), Mobility (Minor 1), and Continence (Moderate 2) with Strong mitigation, **When** the domain residual risk is calculated, **Then** the domain displays its residual score with the corresponding traffic-light colour

3. **Given** all risk areas in a domain are unassessed, **When** the radar renders, **Then** that domain axis shows as "Not assessed" rather than Green — distinguishing "no risk identified" from "risk exists but not yet assessed"

4. **Given** the Coordinator prefers precise numbers over the radar shape, **When** they click the bar chart toggle, **Then** the view switches to horizontal bars showing each domain's consequence, mitigation level, and residual risk

---

### User Story 5 — Drill Down from Domain to Individual Risk Areas (Priority: P2)

As a **Coordinator**, I want to click on a domain in the radar or bar chart and see the individual risk areas within that domain with their consequence levels and mitigation detail — so that I can understand which specific risks are driving the domain score and where to focus interventions.

**Why this priority**: The domain residual risk tells you "Functional Ability is Amber" but not why. The drill-down reveals "Falls is Major (3) but mitigation is Strong — it's the Mobility decline that's unmitigated" — critical for care planning.

**Independent Test**: Can be tested by clicking the Functional Ability domain on the radar and verifying individual risk areas appear with their consequence level, questionnaire response, and contribution to the domain score.

**Acceptance Scenarios**:

1. **Given** the Coordinator clicks a domain on the radar or bar chart, **When** the drill-down opens, **Then** they see a list of individual risk areas within that domain with each risk area's consequence level (0-4), questionnaire response, and traffic-light colour

2. **Given** the drill-down is open for Functional Ability, **When** the Coordinator views the mitigation detail, **Then** they see the domain's mitigation assessment (Strong/Partial/None) with the clinician decision prompts that informed it

3. **Given** the Coordinator clicks an individual risk area in the drill-down, **When** the risk detail opens, **Then** they can view and edit the questionnaire response and see the client's assessment history

---

### User Story 6 — Map Risk Areas to Domains (Priority: P2)

As a **Product Owner**, I want each of the 16 clinical risk areas mapped to one of 5 clinical domains — so that when a risk area is assessed, it automatically belongs to the correct domain for radar grouping and residual risk calculation.

**Why this priority**: Without risk-area-to-domain mapping, the radar has no data. Maryanne's framework defines the definitive mapping. It should be code-managed, not admin-configurable.

**Independent Test**: Can be tested by assessing Falls (→ Functional Ability + Safety Risks), Chronic Disease (→ Clinical Health Status), Mental Health (→ Mental Health & Psychosocial), and verifying each appears under the correct domain.

**Acceptance Scenarios**:

1. **Given** the 16 clinical risk areas exist in the system, **When** Risk Radar is enabled, **Then** each risk area is mapped to its clinical domain per Maryanne's framework:
   - **Functional Ability**: Falls, Mobility, Continence, Cognitive Decline, Dementia
   - **Clinical Health Status**: Chronic Disease, Infection, Polypharmacy, Chronic Pain, End of Life
   - **Mental Health & Psychosocial**: Cognitive Decline, Dementia, Mental Health
   - **Nutritional & Sensory Health**: Nutrition & Hydration, Oral Health, Sensory Impairment
   - **Safety Risks**: Choking & Swallowing, Pressure Injuries & Wounds, Falls

2. **Given** some risk areas appear in multiple domains (e.g., Falls in both Functional Ability and Safety Risks), **When** the risk area is assessed, **Then** its consequence score contributes to all mapped domains

3. **Given** the domain mapping needs adjustment, **When** the mapping is updated via a release, **Then** existing assessments retroactively appear in the correct domain

---

### User Story 7 — Gradual Rollout via Feature Flag (Priority: P3)

As a **Product Owner**, I want to enable Risk Radar per organisation — so that we can pilot with selected organisations, gather feedback from Maryanne's clinician trial, and iterate before broader rollout.

**Why this priority**: Risk scoring changes how care partners and clinicians assess and discuss risk — it needs validation in practice before organisation-wide rollout.

**Independent Test**: Can be tested by enabling the flag for one organisation and verifying they see the Risk Radar assessment, traffic-light dashboard, and radar visualisation, while another organisation sees the existing risk cards.

**Acceptance Scenarios**:

1. **Given** the feature flag is enabled for Organisation A, **When** a Coordinator from Organisation A views the risk tab, **Then** they see the Risk Radar visualisation, traffic-light badge, and assessment questionnaires

2. **Given** the feature flag is disabled for Organisation B, **When** a Coordinator from Organisation B views the risk tab, **Then** they see the existing risk cards without scoring or radar visualisation (unchanged)

3. **Given** a package has existing risks when the flag is enabled, **When** the Coordinator views the risk tab, **Then** existing risks display as "Not assessed" with a prompt to assess — no data is lost or changed

4. **Given** the flag is toggled off after being on, **When** the Coordinator views the risk tab, **Then** assessed data is preserved in the database but the Risk Radar UI is hidden — reverting to the standard risk card view

---

### Out of Scope

- **Trend tracking and sparklines** — Historical score changes over time are Phase 2; this spec covers the residual risk engine and visualisation (Phase 1)
- **Clinical dashboard / POD heatmap** — Aggregated cross-client views are Phase 2; this spec covers the per-package risk tab
- **Auto-escalation and notifications** — Automated clinical review triggers based on residual risk thresholds are Phase 2
- **Incident → risk score integration** — Automatic consequence adjustment when incidents are raised depends on ICM Phase 1 (separate epic)
- **System-driven auto-calculation** — Full automation from assessments + documented mitigation is Phase 3; Phase 1 requires manual clinician input
- **Maslow-risk mapping overlay** — Visual connection between NeedsV2 Maslow hierarchy and risk domains is Phase 3
- **Intervention comparison (before/after radar)** — Phase 3 capability for care plan reviews
- **AI-assisted risk scoring** — Automatic score suggestions from assessment documents (IAT extraction) is a separate workstream
- **Organisational risk register integration** — Bridge between client-level risk patterns and corporate risk register is Phase 3
- **Validated clinical assessment tools per risk area** — Phase 1 uses Maryanne's consequence table questionnaire only. Phase 2 integrates validated instruments (e.g., Timed Up & Go, Waterlow, MMSE) via ASS1 assessment workflow, where assessment documents inform consequence scoring
- **Risk ↔ service/budget linkage** — Phase 2 adds optional "Linked Services" on risk records referencing service bookings and/or service plan items, enabling traceability: Risk → Assessment → Recommendation → Service Plan Item → Service Booking

### Edge Cases

- What happens when a risk has many check-in questions (e.g., 10+)? — The accordion scrolls internally; all questions are visible when expanded
- What happens when the Care Partner Check-Ins feature flag is off? — Risk cards display without the check-in questions accordion; all other risk information remains visible. The step-based form shows only Steps 1 and 2 (no Check-In Questions step)
- What happens when a risk category has no category-specific fields (e.g., "Other")? — Step 2 (Risk Details) is skipped; the form moves directly from Step 1 to Step 3 (or submission if creating)
- What happens when a Coordinator changes the risk category on Step 1 after filling Step 2? — The category-specific fields on Step 2 reset to match the newly selected category; a confirmation prompt warns that detail data will be lost
- What happens when a risk area has not been assessed? — The risk area displays as "Not assessed" with a prompt; it does not contribute to domain or composite calculations
- What happens when a domain has a mix of assessed and unassessed risk areas? — The domain residual risk is calculated from assessed areas only; an indicator shows "2 of 5 risk areas assessed"
- What happens when all risk areas in all domains are unassessed? — The radar shows an empty state: "Assess your client's risks to see the Risk Radar" with a link to start assessment
- What happens when a clinician overrides the mitigation effectiveness? — The override is recorded with documented rationale; the residual risk recalculates using the override value; the audit trail captures both the system recommendation and the override
- What happens when a risk area contributes to multiple domains (e.g., Falls)? — Its consequence score contributes to each domain independently; mitigation is assessed per domain
- What happens when a Coordinator dismisses the assessment without completing it? — Partially completed assessments are saved; incomplete risk areas remain "Not assessed"
- What happens when the questionnaire response doesn't perfectly match the client? — Clinical judgement is applied per the consequence table instructions: "select the highest relevant consequence level where descriptors overlap" and document the rationale
- What happens when a risk area on the Risk Radar has no risk record? — The risk area still appears as "Not assessed" with an "Add & Assess" action. Clicking creates a minimal risk record (category only) and opens the assessment
- What happens when a risk with a consequence assessment is deleted? — Soft delete removes the risk from All Risks tab. The consequence score persists on the Risk Radar sub-tab (assessment is about the client's condition, independent of CRUD). Assessment data preserved in audit trail
- What happens when a Dignity of Risk declaration covers multiple risk areas? — The DOR record links to all relevant risk areas. Each linked risk card shows the "Dignity of Risk" badge. During domain mitigation assessment, the clinician sees all active DOR declarations as contextual evidence
- What happens when a DOR is revoked (client changes their mind)? — The DOR record is marked as inactive with a date. Historical DOR remains in audit trail. Risk cards lose the DOR badge. Mitigation assessment should be reviewed

---

## Requirements *(mandatory)*

### Functional Requirements

**Consequence Assessment**

- **FR-001**: System MUST present a risk assessment interface with 16 clinical risk areas, each with plain-language client questionnaire responses that map to consequence levels: Negligible (0), Minor (1), Moderate (2), Major (3), Extreme (4). Questions are sourced from Maryanne's Clinical Risk Consequence Table
- **FR-001a**: The assessment MUST be accessible via an "Assess" or "Reassess" button on risk cards for the 16 clinical risk areas only — categories that do not map to a clinical risk area do not show an Assess button. The button opens a focused assessment flow for that single risk area, separate from the risk create/edit form. A separate "Assess All" entry point on the Risk Radar sub-tab opens the full 16-area wizard
- **FR-001b**: Assessment MUST be skippable/dismissable per risk area. Unassessed areas are treated as "Not assessed". The Risk Radar sub-tab MUST show a persistent banner indicating how many risk areas remain unassessed
- **FR-002**: System MUST store the consequence level (0-4) and the selected questionnaire response for each risk area per package. Each reassessment MUST create a new versioned record — previous assessment records are retained for direct history querying
- **FR-002a**: System MUST support the Dementia staging mapping: Very Early (0) → Early/Mild (1) → Middle/Moderate (2) → Late/Severe (3) → End-of-life (4), with associated behavioural indicators

**Mitigation Assessment**

- **FR-003**: System MUST present mitigation effectiveness assessment per clinical domain with 3 levels: Strong (2) — controls in place, used correctly, adhered to; Partial (1) — controls present but inconsistently applied; None (0) — controls absent, refused, or ineffective
- **FR-003a**: System MUST display structured clinician decision prompts for each domain's mitigation assessment, sourced from Maryanne's Clinical Risk Domains framework (e.g., for Functional Ability: "Are appropriate supports in place and consistently used?")
- **FR-003b**: System MUST support clinical judgement override — if the clinician's mitigation rating does not align with the calculated domain risk, they MUST document rationale in an override field (governance safeguard)
- **FR-003c**: System MUST display recognised mitigation strategies per domain (e.g., Falls: "Falls management plan; mobility aids correctly prescribed and used; home/environmental modifications") as contextual guidance

**Residual Risk Calculation**

- **FR-004**: System MUST calculate domain residual risk as: max(consequence scores in domain) minus mitigation effectiveness level. e.g., Falls Major (3) with Strong mitigation (2) = residual risk 1 (Green). This is the Phase 1 default — to be refined with Maryanne if needed
- **FR-004a**: System MUST synthesise the 5 domain residual risks into a single overall traffic-light status using hardcoded thresholds: Green (residual 0-1, stable), Amber (residual 2, monitoring required), Red (residual 3-4, action required). Overall status = highest domain status
- **FR-004b**: A single Red domain MUST be sufficient to drive the overall status to Red — whole-of-client assessment does not average away genuine high risk
- **FR-005**: System MUST display the traffic-light status as the primary indicator for care partners, with full consequence + mitigation detail available on toggle or drill-down for clinicians
- **FR-006**: System MUST treat existing unassessed risks as "Not assessed" — not as Green — and display a prompt to assess

**Domain Structure**

- **FR-007**: System MUST implement 5 clinical risk domains per Maryanne's framework: Functional Ability, Clinical Health Status, Mental Health & Psychosocial, Nutritional & Sensory Health, Safety Risks
- **FR-007a**: System MUST implement 16 clinical risk areas mapped to domains:
  - Functional Ability: Falls, Mobility, Continence, Cognitive Decline, Dementia
  - Clinical Health Status: Chronic Disease, Infection, Polypharmacy, Chronic Pain, End of Life
  - Mental Health & Psychosocial: Cognitive Decline, Dementia, Mental Health
  - Nutritional & Sensory Health: Nutrition & Hydration, Oral Health, Sensory Impairment
  - Safety Risks: Choking & Swallowing, Pressure Injuries & Wounds, Falls
- **FR-008**: Domain structure and risk area mappings MUST be code-managed (seeded via releases) — not configurable by administrators
- **FR-008a**: Only the 16 clinical risk areas MUST appear on the Risk Radar sub-tab. The existing 28 risk categories remain fully visible on the All Risks tab. Categories that do not map to a clinical risk area are invisible to the radar but unaffected otherwise
- **FR-008b**: Risk area ↔ risk category mapping MUST use a `ClinicalRiskArea` lookup model. 16 of the 28 existing risk categories receive a `clinical_risk_area_id` foreign key. Categories without a mapping are excluded from the radar. One risk record per category per package (existing constraint)
- **FR-008c**: The Risk Radar sub-tab MUST show all 16 clinical risk areas regardless of whether a risk record exists for that category on the package. Risk areas without a risk record display as "Not assessed" with an "Add & Assess" action
- **FR-008d**: "Add & Assess" MUST auto-create a minimal risk record (category only, no details/action plan) and immediately open the consequence assessment. Coordinator can fill in details later via Edit

**Visualisation**

- **FR-011**: System MUST add a "Risk Radar" sub-tab to the package risk tab alongside the existing "All Risks" sub-tab. The existing flat risk list remains unchanged under "All Risks"
- **FR-011a**: System MUST render a radar (spider) chart on the Risk Radar sub-tab showing 5 domain axes with residual risk scores as radial distances and traffic-light colours
- **FR-012**: System MUST provide a bar chart alternative view, togglable from the radar, showing each domain's consequence level, mitigation effectiveness, and residual risk
- **FR-013**: System MUST display a traffic-light risk badge in the package risk profile header, showing the overall status (Green/Amber/Red) with primary risk driver(s) on hover
- **FR-014**: System MUST allow clicking any domain on the radar or bar chart to drill down to individual risk areas with consequence levels, questionnaire responses, and mitigation detail
- **FR-015**: System MUST use the traffic-light colour system (green/amber/red) as the primary visual language throughout the UI: individual risk area cards, domain headers, overall status badge, radar chart, and bar chart. The same thresholds (Green 0-1, Amber 2, Red 3-4) MUST apply to both consequence badges on individual risk cards AND residual risk scores on the radar — consistent visual language everywhere

**Risk Card Layout (All Risks View)**

- **FR-009**: System MUST display each risk as a card (replacing the current table layout) showing: risk category name, status indicators (added to care plan, import generated, not identified during assessment), details summary (truncated), action plan summary (truncated), last updated date, and action buttons (view, edit, delete). Cards MUST be sorted by last updated date (newest first)
- **FR-009a**: Each risk card MUST include a collapsible accordion section showing the check-in questions configured for that risk, with the question count displayed in the accordion header (e.g., "Check-In Questions (3)")
- **FR-009b**: Check-in questions in the accordion MUST display showing the question text and answer type badge (free text, yes/no, multiple choice, rating 1-5). Questions MUST support drag-and-drop reordering directly in the accordion. All other question editing (add, edit text, delete) continues through the risk edit form
- **FR-009c**: The accordion section MUST only appear on risk cards that have check-in questions configured. Risks with no questions display without an accordion
- **FR-010**: The check-in questions accordion MUST only be visible when the Care Partner Check-Ins feature is enabled for the organisation. When the flag is OFF, the accordion is hidden even if the risk has existing questions — data is preserved and reappears when the flag is turned back on
- **FR-010a**: Risk cards MUST preserve all existing risk management actions: view (read-only modal with single-scroll layout), edit (step-based form modal), and delete (soft delete with confirmation prompt — archived for audit trail, assessment data preserved)
- **FR-010a-view**: The read-only view modal MUST include check-in questions as a section at the bottom (when Care Partner Check-Ins feature is enabled), consistent with the card accordion display
- **FR-010aa**: Risk cards MUST display in a single-column full-width layout. Card details MUST be truncated to 2-3 lines with a "Show more" option for full comprehensive risk data
- **FR-010ab**: After creating a new risk, the system MUST prompt the Coordinator to add check-in questions (e.g., "Risk saved — would you like to add check-in questions?") and offer to reopen the edit form at the Check-In Questions step

**Step-Based Risk Form**

- **FR-010b**: The risk create and edit form MUST be organised into navigable steps with a step indicator showing current progress
- **FR-010c**: Step 1 (Risk Basics) MUST contain: Risk Category, Need, Add to care plan, Not identified during assessment, Details, and Action Plan
- **FR-010d**: Step 2 (Risk Details) MUST contain the category-specific fields that are conditional on the selected risk category. If no category is selected, the category has no additional fields, or 'Not identified during assessment' is toggled ON, this step MUST be skipped
- **FR-010e**: Step 3 (Check-In Questions) MUST contain the check-in questions management section. This step MUST only appear when editing an existing risk (not during creation) and when the Care Partner Check-Ins feature is enabled
- **FR-010f**: Each step MUST validate its own fields before allowing the Coordinator to proceed to the next step. Navigation between completed steps MUST preserve all entered data
- **FR-010g**: The form MUST submit as a single operation after the final step — not per step. All data across steps is held in memory until the Coordinator submits

**Risk Cards & Domain Grouping (Risk Radar View)**

- **FR-016**: System MUST group risk areas by domain in the Risk Radar view, with each domain section showing its residual risk and mitigation effectiveness
- **FR-017**: Each risk area card MUST display its consequence level (0-4) with traffic-light colour badge as soon as a consequence assessment exists — on both the All Risks and Risk Radar views. Unassessed risks display "Not assessed"
- **FR-018**: System MUST support expanding/collapsing domain groups in the risk list
- **FR-018a**: Within each domain group on the Risk Radar view, risk areas MUST be sorted by consequence level (highest first) — Red risks surface to the top within each domain

**Contextual Help**

- **FR-022**: System MUST display help tooltips on all consequence assessment inputs explaining the consequence levels (Negligible through Extreme) with clinical action guidance
- **FR-023**: System MUST display a tooltip on mitigation levels explaining: "Strong = controls in place, used correctly, adhered to. Partial = controls present but inconsistently applied. None = controls absent, refused, or ineffective."
- **FR-024**: System MUST display a tooltip on the traffic-light badge explaining the overall status, which domains are driving the risk, and what the status means for care planning
- **FR-025**: System MUST display contextual help on the radar/bar chart explaining how to interpret the visualisation

**Dignity of Risk**

- **FR-019**: System MUST support Dignity of Risk (DOR) declarations as documented mitigation evidence. A DOR is an informed-choice record where the client (or their representative) accepts a known risk after being informed of consequences
- **FR-019a**: Each DOR declaration MUST be a separate record linked to one or more risk areas, capturing: who made the decision, what risks are being accepted, what was explained, the client's response, date, and witness (if applicable)
- **FR-019b**: DOR declarations MUST be visible as contextual information during domain mitigation assessment — clinicians factor active DOR declarations into their Strong/Partial/None mitigation rating with documented reasoning
- **FR-019c**: Risk cards linked to an active DOR MUST display a "Dignity of Risk" badge. The risk still contributes to consequence scoring — DOR does not suppress the score, it provides governance context

**Performance**

- **FR-020**: Domain residual risk scores MUST be calculated on read (eager loaded by the controller when rendering the risk tab). No cached/stored calculation in Phase 1 — calculate all 5 domain scores on every page render
- **FR-021**: The risk tab controller MUST eager-load all risk records, assessments, and mitigation data for the package in a single query set to avoid N+1 problems

**Audit & Permissions**

- **FR-026**: System MUST record all assessment changes (consequence levels, mitigation ratings, clinical overrides) in the audit trail with the acting user, timestamp, and override rationale where applicable
- **FR-027**: System MUST respect existing "manage-risk" permissions — only authorised Coordinators/Clinicians can assess or change scores
- **FR-028**: System MUST be controllable via a feature flag that can be toggled per organisation

### Key Entities

- **Clinical Risk Domain**: One of 5 clinical domains defined by Maryanne's framework. Each domain has: a name (Functional Ability, Clinical Health Status, Mental Health & Psychosocial, Nutritional & Sensory Health, Safety Risks), a display label, a colour, recognised mitigation strategies, and clinician decision prompts. Domains are fixed and code-managed.

- **Clinical Risk Area** *(new model)*: One of 16 risk areas (e.g., Falls, Chronic Disease, Mental Health). Implemented as a `ClinicalRiskArea` lookup model with: name, client questionnaire, consequence level mappings, and one or more domain associations via pivot table. 16 of the 28 existing `RiskCategory` records receive a `clinical_risk_area_id` foreign key. Code-managed, seeded.

- **Risk Assessment** *(new entity, versioned)*: A per-package, per-risk-area record storing: the selected questionnaire response, the corresponding consequence level (0-4), the assessing user, and timestamp. Each reassessment creates a new record — previous records are retained for history querying. Replaces the old `prevalence`/`impact` scoring approach.

- **Dignity of Risk Declaration** *(new entity)*: An informed-choice record where a client accepts known risk. Stores: who decided, what risks are accepted (linked to multiple risk areas), what was explained, client's response, date, witness. Referenced during domain mitigation assessment as governance evidence. Displayed as a badge on linked risk cards.

- **Domain Mitigation Assessment** *(new entity)*: A per-package, per-domain record storing: mitigation effectiveness (Strong 2 / Partial 1 / None 0), the assessing clinician, structured decision prompt responses, override rationale (if any), and timestamp.

- **Domain Residual Risk** *(calculated)*: The residual risk for a domain on a given package. Calculated on read from the individual risk area consequence scores adjusted by the domain's mitigation effectiveness. Not stored — derived.

- **Overall Risk Status** *(calculated)*: A single traffic-light status (Green / Amber / Red) for a package, synthesised from the 5 domain residual risks. Calculated on read. The highest-risk domain drives the overall status.

### Glossary

- **Risk Category**: One of the existing 28 risk types in the system (e.g., Allergies, Falls, Medication Safety, Behavioural). Used on the All Risks tab and in the risk create/edit form.
- **Clinical Risk Area**: One of 16 evidence-based risk areas defined by Maryanne's framework (e.g., Falls, Chronic Disease, Mental Health). Each maps to one or more Clinical Risk Domains. Used on the Risk Radar sub-tab.
- **Clinical Risk Domain**: One of 5 high-level clinical groupings (Functional Ability, Clinical Health Status, Mental Health & Psychosocial, Nutritional & Sensory Health, Safety Risks). Used for radar visualisation and residual risk calculation.
- **Consequence Level**: A score from 0 (Negligible) to 4 (Extreme) assigned via client questionnaire to a clinical risk area.
- **Mitigation Effectiveness**: A per-domain rating — Strong (2), Partial (1), or None (0) — reflecting how well controls mitigate the domain's risks.
- **Residual Risk**: Domain consequence minus mitigation effectiveness. Determines the traffic-light colour for each domain.
- **Traffic-Light Status**: Green (residual 0-1), Amber (residual 2), Red (residual 3-4). The overall package status is driven by the highest domain status. Same thresholds apply to consequence badges on individual risk cards.
- **Dignity of Risk (DOR)**: A client's informed choice to accept a known risk after being explained the consequences. A core aged care principle (Quality Standard 1 — Consumer dignity and choice). Captured as a cross-cutting declaration spanning multiple risk areas. Functions as documented mitigation evidence, not a mitigation level.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-000**: Coordinators can see a risk's check-in questions directly from the risk tab without opening the edit form — reducing the steps to review monitoring configuration from 3 clicks (navigate → edit → scroll) to 1 click (expand accordion)
- **SC-001**: Coordinators can complete a risk area assessment using the client questionnaire in under 30 seconds per risk area
- **SC-002**: Assessment is always skippable. The Risk Radar sub-tab displays a persistent "X risk areas unassessed" banner, driving adoption through visibility rather than enforcement
- **SC-003**: Care partners report they can understand a client's overall risk status from the traffic-light badge within 5 seconds (validated during pilot)
- **SC-004**: All 16 clinical risk areas are mapped to their clinical domains — no orphaned areas
- **SC-005**: Traffic-light correctly reflects residual risk — a client with one Red domain and four Green domains displays as Red, not Green
- **SC-006**: All assessment changes (consequence, mitigation, overrides) are captured in the audit trail with user attribution and timestamp
- **SC-007**: Risk Radar can be enabled and disabled per organisation without data loss — toggling the flag off preserves all assessment data
- **SC-008**: During pilot, Maryanne's clinicians confirm the residual-risk framework aligns with whole-of-client clinical assessment practice
- **SC-009**: Clinician overrides are documented with rationale, supporting audit defensibility and governance requirements

---

## Clarifications

### Session 2026-02-14 (Initial)
- Q: Which aggregation method for domain scores? -> A: Initial spec proposed Max/Mean toggle. Now superseded by residual-risk model.
- Q: Where does the Risk Radar sit on the risk tab? -> A: New "Risk Radar" sub-tab alongside existing "All Risks" sub-tab. Existing flat risk list unchanged.
- Q: Are domain scores manually set or derived? -> A: Derived only — calculated from individual risk area consequence scores adjusted by mitigation.
- Q: Should the assessment be mandatory for new risks? -> A: Always skippable. Soft nudge via persistent "X risk areas unassessed" banner. Adoption driven by visibility, not enforcement.

### Session 2026-03-05 (UX Foundation)
- Q: What should the risk tab look like before Risk Radar scoring? -> A: Replace the data table with cards (one per risk) showing category, status badges, details, and actions. Each card has an accordion for check-in questions.
- Q: How should the risk form be structured? -> A: Step-based: Step 1 = Risk Basics (category, need, care plan, details, action plan), Step 2 = Risk Details (category-specific conditional fields), Step 3 = Check-In Questions (edit only, feature-flagged). Current form is 1000+ lines in a single scroll.
- Q: Should check-in questions be editable from the risk card? -> A: No — read-only in the accordion. Editing continues through the risk edit form (Step 3).

### Session 2026-03-05 (Spec Clarification)
- Q: Should US-0 (cards) and US-0b (step form) be delivered separately before scoring, or interleaved? -> A: Interleaved — build cards and scoring together. Cards ship with consequence badges from day one.
- Q: When does the step-based form save? -> A: Single submit at end. Coordinator fills all steps, then submits once. Back navigation preserves in-memory data.
- Q: When Risk Radar flag is OFF but Check-Ins is ON, do risk cards still show the check-in questions accordion? -> A: Yes — the accordion follows the Check-Ins feature flag only. Risk Radar flag controls scoring, radar chart, and traffic-light features independently.
- Q: What happens to existing risk categories that don't map to the 16 clinical risk areas? -> A: Only the 16 mapped areas appear on the Risk Radar. The All Risks tab shows all 28 categories. Unmapped categories are invisible to the radar but fully functional on the All Risks view.
- Q: Should the view (read-only) modal also use the step-based layout? -> A: No — single-scroll read-only. Steps are only for create/edit. Simpler implementation.
- Q: Should the consequence assessment questionnaire (US-1) be a 4th step in the form or a separate action? -> A: Separate action from the risk card. An "Assess" button opens a focused assessment flow. Keeps the risk form about CRUD and the assessment about scoring.
- Q: How should risk cards be sorted on the All Risks tab? -> A: By last updated (newest first). Most recently changed risks appear at the top.
- Q: After creating a new risk, should the Coordinator be prompted to add check-in questions? -> A: Yes — prompt after save (e.g., "Risk saved — would you like to add check-in questions?"). Reopens in edit mode at Step 3.
- Q: How much detail should each risk card show? -> A: Truncated summary — 2-3 lines of the details text. Full comprehensive data visible via View modal or "Show more" toggle.
- Q: Single column or grid for risk cards? -> A: Single column full width. Better for scanning, consistent card heights, matches clinical data patterns.
- Q: What form does the consequence assessment take? -> A: Modal. Focused questionnaire overlay, consistent with other risk interactions. Coordinator stays on the risk tab.
- Q: Should risk cards show consequence badge before full Risk Radar is built? -> A: Yes — show badge with traffic-light colour as soon as a risk has a consequence score. Progressive enhancement.
- Q: What aggregation formula for residual risk (FR-004 TBD)? -> A: Highest consequence minus mitigation as Phase 1 default. Domain residual = max(consequence in domain) - mitigation level. e.g., Falls Major(3) - Strong(2) = residual 1 (Green). Can be refined with Maryanne later.
- Q: Who can perform consequence assessments? -> A: Same 'manage-risks' permission. Only Coordinators and Clinicians can assess. Care Partners see results but can't change scores.
- Q: How to distinguish 'risk category' (28) from 'risk area' (16)? -> A: Keep both terms. 'Risk Category' = existing 28 categories (Allergies, Falls, etc). 'Clinical Risk Area' = the 16 Maryanne-defined areas that map to clinical domains. Add glossary entry to spec.
- Q: Should traffic-light thresholds be configurable? -> A: Hardcoded for Phase 1. Green = residual 0-1, Amber = residual 2, Red = residual 3-4. Can be made configurable later.
- Q: What happens when a risk is deleted? -> A: Soft delete — risk is archived and preserved for audit trail. Assessment data (consequence scores, mitigation ratings) is retained. Risk disappears from the active card list but remains in audit history.
- Q: Which risks get the "Assess" button? -> A: Only the 16 clinical risk areas that map to a clinical domain. The remaining 12 unmapped categories (e.g., Allergies, Behaviours) do not show an Assess button — they remain as standard risk cards without scoring.
- Q: Should the action plan be visible on the risk card or only in the view/edit modal? -> A: Show on card, truncated to 2-3 lines alongside the details text. Both details and action plan are visible at a glance.
- Q: Can Coordinators reorder check-in questions from the card accordion? -> A: Yes — drag-and-drop reordering in the accordion. Not strictly read-only for question order.
- Q: Should the read-only view modal show check-in questions? -> A: Yes — show questions as a section at the bottom of the view modal. Consistent with the card accordion.
- Q: Should 'Not identified during assessment' skip form steps? -> A: Skip Step 2 (Risk Details) only. Check-in questions (Step 3) may still be relevant for monitoring even if the risk wasn't identified during assessment.
- Q: When Check-Ins flag is OFF but risk has existing questions, what shows? -> A: Hide accordion entirely. Data preserved in database, reappears when flag is turned back on.

### Session 2026-03-10 (Data Model & Clinical Governance)
- Q: How should clinical risk areas relate to the existing 28 risk categories? -> A: 1:1 mapping via lookup table. `ClinicalRiskArea` as a new model. 16 of 28 categories get a `clinical_risk_area_id` FK. Clean separation, extensible.
- Q: Should consequence assessments attach to risk area or individual risk records? -> A: One consequence score per risk area per package. One risk per category per package is an existing constraint.
- Q: What happens on reassessment? -> A: Versioned records. Each reassessment creates a new record, previous records retained for direct history querying without event replay.
- Q: Should the Assess button on a card assess just that risk or open the full wizard? -> A: Assess just that one risk area. "Assess All" is a separate entry point on the Risk Radar sub-tab.
- Q: Should Risk Radar use validated clinical assessment tools per category? -> A: Phase 1 uses Maryanne's consequence table only. Phase 2 integrates validated tools via ASS1 assessment workflow (OT/Physio/Nurse assessments inform consequence scoring).
- Q: How should radar data be assembled (performance)? -> A: Eager load on page render. Controller calculates all 5 domain scores on render. Simple, sufficient for Phase 1 single-package view.
- Q: How should risk areas be sorted within domain groups on the Risk Radar? -> A: By consequence level, highest first. Red risks surface to the top within each domain.
- Q: Should risk areas without a risk record appear on the Risk Radar? -> A: Yes — show all 16 always. Missing records show "Not assessed" with "Add & Assess" action. Reinforces whole-of-client model.
- Q: What does "Add & Assess" do? -> A: Auto-creates minimal risk record (category only), then opens consequence assessment. Low friction — details come later.
- Q: How should Dignity of Risk be captured? -> A: DOR is a cross-cutting documented mitigation evidence record spanning multiple risks. Captured as a separate record (who, what risks, what was explained, client response, date). Referenced during domain mitigation assessment — clinician factors it into their Strong/Partial/None rating. Shows as a badge on linked risk cards.
- Q: Should traffic-light thresholds apply to consequence badges on cards as well as residual risk? -> A: Same thresholds everywhere. Green (0-1), Amber (2), Red (3-4) for both consequence badges and residual risk. Consistent visual language.
- Q: Should risks link to service bookings and budget items? -> A: Phase 2. Add optional "Linked Services" field on risk records referencing service bookings and/or service plan items. Full traceability: Risk → Assessment → Recommendation → Service Plan Item → Service Booking.

### Session 2026-02-18 (Framework Update)
- Q: What replaces the P × I scoring model? -> A: Maryanne's residual-risk model: client questionnaire → consequence (0-4) + mitigation effectiveness (Strong/Partial/None) → residual risk → traffic-light (Green/Amber/Red). This is clinically stronger because it assesses the whole client, not isolated risks.
- Q: How does mitigation affect scoring? -> A: A high falls risk (Major 3) with Strong mitigation (2) results in lower residual risk than the same consequence with No mitigation (0). The exact formula TBD with Maryanne.
- Q: What about clinical judgement? -> A: Preserved through structured decision prompts and documented overrides. The system supports — rather than replaces — professional decision-making.
- Q: How do the 5 domains compare to the initial spec? -> A: Domains updated per Maryanne's framework: Functional Ability (was Functional Capacity), Clinical Health Status (was Clinical Health, now includes End of Life), Mental Health & Psychosocial (was Psychosocial), Nutritional & Sensory Health (new — was split across others), Safety Risks (was Physical Safety).
- Q: How does the org-level Risk Management Procedure relate? -> A: Complementary. Org procedure governs corporate/strategic/operational risks (ISO 31000, ordinal 1-25 matrix). Risk Radar governs per-client clinical risks (residual risk model). Different audiences, different purposes. Integration bridge planned for Phase 3.
- Q: What about the existing 28 risk categories? -> A: The 16 clinical risk areas in Maryanne's framework map to the existing categories. The old categories remain for backward compatibility; the new risk areas provide the structured assessment layer on top.

## Clarification Outcomes

### Q1: [Dependency] The risk scoring model (consequence + mitigation = residual risk) differs from RNC2's impact x likelihood. Are these competing models?
**Answer:** The RNC2 spec's "impact x likelihood" model is superseded. The Risk Radar spec (updated 2026-03-10) explicitly states: "Replaces initial P x I model with residual-risk model (consequence + mitigation = residual risk)." The clarification session (2026-02-18) confirms: "Maryanne's residual-risk model: client questionnaire -> consequence (0-4) + mitigation effectiveness -> residual risk -> traffic-light." **These are not competing models. Risk Radar's residual-risk model is the canonical approach. The RNC2 spec should be updated to reference this model. There is no "impact x likelihood" calculation to build.**

### Q2: [Data] Some risk areas appear in multiple domains (e.g., Falls in both Functional Ability and Safety Risks). How is double-counting prevented when calculating the overall traffic-light status?
**Answer:** FR-004a says "Overall status = highest domain status." This means the overall traffic-light is determined by the worst domain, not by aggregating all risk areas across all domains. Falls contributing to both Functional Ability and Safety Risks does not cause double-counting because each domain calculates its own residual risk independently. The overall status is simply: max(all domain residual risks). **No double-counting occurs. Each domain calculates its own residual risk from its member risk areas. The overall status takes the worst domain. If Falls is Major(3) and both Functional Ability and Safety Risks have Strong mitigation(2), both domains get residual 1 (Green). If Safety Risks has No mitigation(0), Safety Risks gets residual 3 (Red), driving the overall to Red -- regardless of Functional Ability's assessment.**

### Q3: [Scope] US0 and US0b (cards + step form) are UX improvements. Should they be a separate Care Wins sub-epic?
**Answer:** The clarification session (2026-03-05) resolved: "Interleaved -- build cards and scoring together. Cards ship with consequence badges from day one." US0/US0b are not just UX polish -- they provide the foundation for consequence badges, domain grouping, and the assessment entry point. The existing risk form (`resources/js/Components/Staff/Risks/RiskForm.vue`) is a single-scroll form with 27 category-specific section components. The step-based form is necessary to accommodate the new consequence assessment. **US0/US0b should remain part of Risk Radar, not separated into Care Wins. They are foundational to the scoring UX -- consequence badges on cards, the "Assess" button, and the step-based form that separates CRUD from assessment. Splitting them would create a dependency chain with no benefit.**

### Q4: [Edge Case] For organisations with 500+ client risks, what is the assessment timeline? Is there a bulk assessment tool?
**Answer:** FR-001b says assessment is "skippable/dismissable per risk area." FR-006 says "treat existing unassessed risks as 'Not assessed' -- not as Green." SC-002 says assessment adoption is driven by visibility ("X risk areas unassessed" banner), not enforcement. The spec defers bulk assessment tools to future phases. **No bulk assessment tool in Phase 1. Assessment happens organically during care partner interactions. The persistent "X risk areas unassessed" banner drives adoption. For 500+ client risks, expect a 3-6 month adoption curve where risks are assessed during routine care reviews. The design deliberately avoids mandating assessment -- it uses soft nudges. Bulk assessment could be a Phase 2 capability if adoption is too slow.**

### Q5: [Integration] CGD Phase 2 depends on Risk Radar for risk distribution KPIs. What is the minimum data required?
**Answer:** CGD Phase 2 KPI tiles include "risk profile distributions" (from Risk Radar). The minimum data needed is consequence levels per risk area per package. Even partial assessments (e.g., 30% of risk areas assessed) provide useful distribution data. **CGD can launch with partially assessed risk data. The KPI tile should show "Risk profile based on X% assessed packages" as a caveat. The distribution KPI uses whatever consequence data exists -- it doesn't require 100% assessment coverage. If Risk Radar launches first with soft-nudge adoption, CGD Phase 2 can follow 2-3 months later with meaningful (if incomplete) data.**

### Q6: [Data] The existing Risk model stores `comprehensive_risks_data` as a JSON array for category-specific fields. The step form (US0b) restructures this. Is the JSON schema changing?
**Answer:** The existing Risk model (`domain/Risk/Models/Risk.php`) has `comprehensive_risks_data` cast to `array`. Each risk category has its own section component (e.g., `FallsSection.vue`, `MedicationSafetySection.vue`) that reads/writes to this JSON. The step form reorganises the UI but the underlying data structure can remain the same. **The JSON schema should not change for existing category-specific fields. Step 2 (Risk Details) renders the same category-specific fields from `comprehensive_risks_data` -- it's a layout change, not a data change. New fields (consequence level, mitigation rating) are stored in separate models (RiskAssessment, DomainMitigationAssessment), not inside `comprehensive_risks_data`.**

### Q7: [Data] The spec introduces new models: ClinicalRiskArea, RiskAssessment (versioned), DomainMitigationAssessment, DignityOfRiskDeclaration. These are significant schema additions. What domain folder should they live in?
**Answer:** The existing Risk domain (`domain/Risk/`) contains Models, Enums, Factories, EventSourcing, Seeder, and Data subfolders. The new models are all Risk-domain entities. **All new models should live in `domain/Risk/Models/`. Specifically: `ClinicalRiskArea`, `ClinicalRiskDomain` (the 5 domain groups), `RiskAssessment` (consequence scores), `DomainMitigationAssessment`, and `DignityOfRiskDeclaration`. Seeders for ClinicalRiskArea and ClinicalRiskDomain mappings go in `domain/Risk/Seeder/`. This keeps the Risk domain cohesive.**

### Q8: [Performance] FR-020 says domain residual risk is calculated on read. With 16 risk areas, 5 domains, mitigation assessments, and DOR declarations, how many queries does this require?
**Answer:** FR-021 says "The risk tab controller MUST eager-load all risk records, assessments, and mitigation data for the package in a single query set." With proper eager loading: 1 query for risks (with category), 1 query for risk assessments (latest per area), 1 query for domain mitigation assessments, 1 query for DOR declarations. The domain mapping is code-managed (in-memory array). **4-5 queries total with eager loading, all scoped to a single package. Calculation is in-memory: iterate 5 domains, find max consequence per domain, subtract mitigation. This is trivially fast (<10ms). No performance concern for the single-package view. The population-level view (Phase 2/3) is a different story -- that needs caching.**

## Refined Requirements

1. **RNC2 alignment**: The RNC2 spec's "impact x likelihood" references MUST be updated to reference Risk Radar's "consequence - mitigation = residual risk" model. Risk Radar is the canonical risk scoring approach.
2. **Domain folder**: All new Risk Radar models (ClinicalRiskArea, ClinicalRiskDomain, RiskAssessment, DomainMitigationAssessment, DignityOfRiskDeclaration) SHOULD live in `domain/Risk/Models/`.
3. **JSON schema stability**: The `comprehensive_risks_data` JSON schema on the Risk model MUST NOT change for existing category-specific fields. New scoring data (consequence, mitigation) lives in separate models.
4. **CGD compatibility**: Risk Radar data SHOULD be usable by CGD Phase 2 even with partial assessment coverage. CGD KPI tiles should indicate assessment coverage percentage.
