---
title: "Feature Specification: Simplified Needs Module (Needs v2)"
---

> **[View Mockup](/mockups/needs-v2-simplified-needs-module/index.html)**{.mockup-link}

# Feature Specification: Simplified Needs Module (Needs v2)

**Epic**: RNC2 — Future State Care Planning
**Linear**: [RNC2 Future State Care Planning](https://linear.app/trilogycare/project/rnc2-future-state-care-planning-tp-2357-e08fb8938c2d)
**Created**: 2026-02-12
**Status**: Draft
**Input**: User description: "Build a new simplified needs system with its own categories based on Maslow's hierarchy, a guided wizard form that links needs to risks and budget items, coexisting alongside the current needs module."

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Create a Need with Maslow Category (Priority: P1)

As a **Coordinator**, I want to create a new need for a recipient by selecting a care-focused category organised by Maslow's hierarchy, describing the need in plain language, explaining how it will be met, and choosing a funding source — so that I can quickly capture what the recipient actually needs without wading through the current 20-minute form.

**Why this priority**: This is the foundational action. Without the ability to create a simplified need, nothing else in the module works. It directly addresses Marianne's feedback that the current module is "pretty wordy" and care partners find it overwhelming.

**Independent Test**: Can be fully tested by navigating to a recipient's package, opening the "Add Need" wizard, selecting a category (e.g., "Nutrition & Hydration" under Physiological), filling in the description and funding source, and saving. The need appears in the needs list.

**Acceptance Scenarios**:

1. **Given** a Coordinator is on a recipient's package needs tab, **When** they click "Add Need", **Then** a guided wizard opens with the first step showing need categories grouped by Maslow level (Physiological → Safety → Belonging → Esteem → Self-Actualisation)

2. **Given** the wizard is on Step 1 (Define Need), **When** the Coordinator selects a category, enters a description (e.g., "Requires assistance with meal preparation due to limited mobility"), selects "HCP" as the funding source, and completes the wizard, **Then** the need is saved and appears in the needs list under the selected category

3. **Given** the Coordinator selects "Other" as the funding source, **When** they proceed, **Then** they must specify the funding source in a free-text field before the need can be saved

4. **Given** the Coordinator leaves the description blank and attempts to save, **When** validation runs, **Then** the system highlights the missing field and prevents saving

---

### User Story 2 — Link Risks to a Need (Priority: P1)

As a **Coordinator**, I want to associate one or more existing risks to a need during the creation wizard — so that I can see which risks are connected to which needs, and the care plan reflects the relationship between what the recipient needs and what could go wrong.

**Why this priority**: Risk-to-need linking is the core integration that makes this module different from v1. Without it, needs remain disconnected from risks — the exact problem the IDEA-BRIEF identifies.

**Independent Test**: Can be tested by creating a need and on Step 2 of the wizard, selecting existing package risks. After saving, the need's detail view shows linked risks, and the risk's detail view shows linked needs.

**Acceptance Scenarios**:

1. **Given** a package has existing risks (e.g., "Falls Risk", "Medication Risk"), **When** the Coordinator reaches Step 2 (Link Risks) of the wizard, **Then** they see a list of the package's existing risks available for selection

2. **Given** the Coordinator selects "Falls Risk" and "Medication Risk" on Step 2, **When** they complete the wizard, **Then** the saved need shows both risks as linked associations

3. **Given** a package has no existing risks, **When** the Coordinator reaches Step 2, **Then** the step shows an empty state message (e.g., "No risks recorded for this package yet") and the Coordinator can skip to Step 3

4. **Given** a Coordinator is editing an existing need, **When** they change the linked risks (removing one, adding another), **Then** the associations update accordingly

---

### User Story 3 — Associate Budget Items to a Need (Priority: P1)

As a **Coordinator**, I want to associate one or more existing budget items to a need during the creation wizard — so that I can see the funding allocation for each need and eventually trace the flow from need → budget → service.

**Why this priority**: Budget association is the second half of the needs-risk-budget integration pillar. It connects "what the recipient needs" to "how we're paying for it" — enabling future cost-per-need analysis and care plan PDF generation.

**Independent Test**: Can be tested by creating a need and on Step 3 of the wizard, selecting existing package budget items. After saving, the need shows linked budget items.

**Acceptance Scenarios**:

1. **Given** a package has existing budget items (e.g., "Personal Care — $150/week", "Meal Preparation — $80/week"), **When** the Coordinator reaches Step 3 (Associate Budget Items) of the wizard, **Then** they see a list of available budget items for selection

2. **Given** the Coordinator selects two budget items on Step 3, **When** they complete the wizard, **Then** the saved need shows both budget items as linked associations

3. **Given** a package has no budget items, **When** the Coordinator reaches Step 3, **Then** the step shows an empty state and the Coordinator can save the need without budget associations

4. **Given** a budget item is already associated with a different need, **When** the Coordinator views it on Step 3, **Then** it is still available for selection (a budget item can serve multiple needs)

---

### User Story 4 — View and Manage Needs List (Priority: P2)

As a **Coordinator**, I want to see all of a recipient's simplified needs in a clear list grouped or filterable by Maslow category — so that I can quickly understand the full picture of a recipient's care needs and manage them efficiently.

**Why this priority**: Without a usable list view, Coordinators can't manage needs after creation. This completes the CRUD cycle and provides the day-to-day working view.

**Independent Test**: Can be tested by creating several needs across different Maslow categories and verifying they display correctly in the list with category, description, funding source, linked risk count, and linked budget item count.

**Acceptance Scenarios**:

1. **Given** a package has needs across multiple Maslow levels, **When** the Coordinator views the needs tab, **Then** they see each need with its category, description summary, funding source, number of linked risks, and number of linked budget items

2. **Given** the Coordinator clicks "Edit" on a need, **When** the wizard opens, **Then** it is pre-populated with all existing data including linked risks and budget items

3. **Given** the Coordinator clicks "Delete" on a need, **When** they confirm the deletion, **Then** the need is removed from the list, its risk associations are unlinked, and its budget item associations are cleared

4. **Given** a need has "Add to Care Plan" enabled, **When** the Coordinator views it, **Then** it is visually indicated as included in the care plan

5. **Given** a package has multiple needs, **When** the Coordinator drags a need to a new position in the list, **Then** the priority order is updated and persists when the page is refreshed

---

### User Story 5 — Navigate Wizard Steps Freely (Priority: P2)

As a **Coordinator**, I want to move back and forth between wizard steps without losing my entered data — so that I can review or change my category selection, risk links, or budget associations before saving.

**Why this priority**: Wizard usability directly impacts adoption. If Coordinators lose data when clicking back, they'll avoid using the wizard and revert to the old form.

**Independent Test**: Can be tested by filling in Step 1, advancing to Step 3, clicking back to Step 1, and confirming all previously entered data is still present.

**Acceptance Scenarios**:

1. **Given** the Coordinator has filled in Step 1 and advanced to Step 2, **When** they click back to Step 1, **Then** all their previously entered data (category, description, funding source) is preserved

2. **Given** the Coordinator is on Step 3, **When** they click back to Step 1 and change the category, **Then** their risk and budget selections on Steps 2 and 3 are preserved

3. **Given** the Coordinator has not completed Step 1, **When** they attempt to navigate forward, **Then** the system does not block navigation but validation runs on save at the final step

---

### User Story 6 — Gradual Rollout via Feature Flag (Priority: P2)

As a **Product Owner**, I want to enable the simplified needs module per organisation — so that we can roll it out gradually, gather feedback, and ensure it works before making it available to all organisations.

**Why this priority**: Risk mitigation. The current needs module serves all packages. Switching everyone at once without validation would be reckless. Gradual rollout lets us co-design with care partners as Marianne recommended.

**Independent Test**: Can be tested by enabling the flag for one organisation and verifying they see the new needs UI, while another organisation still sees the current needs UI.

**Acceptance Scenarios**:

1. **Given** the feature flag is enabled for Organisation A, **When** a Coordinator from Organisation A views a package's needs tab, **Then** the v2 interface completely replaces the needs tab — the v1 interface is not shown

2. **Given** the feature flag is disabled for Organisation B, **When** a Coordinator from Organisation B views a package's needs tab, **Then** they see the existing v1 needs interface (unchanged)

3. **Given** the feature flag is toggled from disabled to enabled for an organisation, **When** a Coordinator refreshes the page, **Then** they see the new v2 interface immediately, replacing the v1 tab entirely

4. **Given** a package has existing v1 needs and the flag is enabled, **When** the Coordinator views the needs tab, **Then** v1 needs are not displayed — only v2 needs are shown (v1 data remains in the system but is not surfaced through the v2 interface)

---

### Out of Scope

- **Care plan PDF generation** — v2 focuses on data capture and linking. PDF export is a separate future story under RNC2 that will consume v2 data. The data model should support future PDF integration but no template changes are included here.
- **Migration of v1 needs to v2** — existing needs remain in the v1 system; no data migration is planned.
- **AI-assisted need creation** — AI drafting from assessment documents is a separate RNC2 capability.
- **Risk scoring** — evidence-based risk scoring (Pillar 2 of RNC2) is a separate workstream.

### Edge Cases

- What happens when a Coordinator creates a v2 need on a package that already has v1 needs? — Both coexist; v1 needs remain visible and editable through the v1 interface
- What happens when a linked risk is deleted from the package? — The risk association is removed from the need automatically; the need itself is not affected
- What happens when a linked budget item is deleted? — The budget item association is cleared from the need automatically
- What happens if the same need category is used twice on one package? — Allowed; a recipient may have multiple needs within "Mobility & Physical Function" (e.g., wheelchair access AND physiotherapy)
- What happens during annual review? — Needs v2 records carry last-updated timestamps reflecting actual human review, not system defaults

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide 14 need categories organised across 5 Maslow levels: Physiological (4), Safety (3), Belonging (3), Esteem (2), Self-Actualisation (2)
- **FR-002**: System MUST allow Coordinators to create a need by selecting a category, entering a description, optionally describing how it will be met, and selecting a funding source
- **FR-003**: System MUST support these funding sources: HCP, Informal Support, PHN, PBS, Private Health Insurance, Other (with free-text specification)
- **FR-004**: System MUST allow linking one or more existing package risks to a need
- **FR-005**: System MUST allow associating one or more existing package budget items to a need
- **FR-006**: System MUST present the creation/editing flow as a guided wizard with three steps: Define Need → Link Risks → Associate Budget Items
- **FR-007**: System MUST preserve all entered data when the Coordinator navigates between wizard steps
- **FR-008**: System MUST validate required fields (category, description, funding source) before saving
- **FR-009**: System MUST support editing existing needs, pre-populating the wizard with current data including associations
- **FR-010**: System MUST support soft-deleting needs, cleaning up risk and budget item associations
- **FR-011**: System MUST record who created and last updated each need
- **FR-012**: System MUST allow each need to be flagged as "Add to Care Plan" (default: yes)
- **FR-018**: System MUST support a need lifecycle with three statuses: Draft (saved but not yet confirmed), Active (confirmed, included in care planning), and Archived (no longer current, retained for audit)
- **FR-019**: System MUST default new needs to Active status; Coordinators may optionally save as Draft if the need is incomplete
- **FR-020**: System MUST hide Archived needs from the default list view but allow Coordinators to view them via a filter
- **FR-021**: Only Active needs with "Add to Care Plan" enabled MUST be included when generating care plan documents
- **FR-013**: System MUST display needs in a list showing category, description, funding source, linked risk count, and linked budget item count
- **FR-022**: System MUST support drag-and-drop reordering of needs within the list; the updated priority order is saved and persists across sessions
- **FR-014**: System MUST coexist with the current needs module — existing needs are not migrated or affected
- **FR-015**: System MUST be controllable via a feature flag that can be toggled per organisation; when enabled, the v2 interface completely replaces the v1 needs tab (v1 data remains but is not surfaced)
- **FR-016**: System MUST maintain a complete audit trail for every need creation, update, and deletion
- **FR-017**: System MUST respect existing "manage-need" permissions — only authorised Coordinators can create, edit, or delete needs

### Key Entities

- **Need Category**: A classification of care need based on Maslow's hierarchy. Each category belongs to a Maslow level (Physiological, Safety, Belonging, Esteem, Self-Actualisation), has a display name, priority order, and optional icon/colour. 14 predefined categories are provided. Categories are **fixed and code-managed** — they are seeded via releases and cannot be modified by admins. This ensures the Maslow framework remains consistent across all organisations.

- **Need (v2)**: A specific care requirement for a recipient within a package. Contains: what the need is (description), how it will be met, funding source, priority within the package, status, and whether it should appear on the care plan. Linked to one category, zero or more risks, and zero or more budget items. Lifecycle: **Draft** (saved but not yet confirmed) → **Active** (confirmed and included in care planning) → **Archived** (no longer current, retained for audit history). Needs default to Active on creation; Coordinators can save as Draft if incomplete. Archived needs are hidden from the default list view but accessible via a filter.

- **Risk** *(existing)*: An identified hazard or concern for the recipient. Already exists in the system. Needs v2 references risks through an association — risks are not duplicated.

- **Budget Item** *(existing)*: A funded line item within the recipient's package budget. Already exists in the system. Needs v2 references budget items through an association — budget items are not duplicated.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Coordinators can create a new need in under 2 minutes using the wizard (compared to 20+ minutes with the current Zoho-derived form)
- **SC-002**: 100% of needs created through v2 have an associated Maslow category and funding source (structured data, no free-text-only records)
- **SC-003**: At least 80% of needs created during the pilot period have one or more linked risks (demonstrating adoption of the integration feature)
- **SC-004**: The new needs module works independently of the existing module — toggling the feature flag on or off does not affect existing needs data
- **SC-005**: All need creations, updates, and deletions are captured in the audit trail with the acting user and timestamp
- **SC-006**: During pilot, Coordinators report the new form as "simpler" or "easier to use" compared to the current module (qualitative feedback from co-design sessions)

---

## Clarifications

### Session 2026-02-12 — Spec Lens

- Q: Should a v2 need have a lifecycle status? → A: **Draft → Active → Archived**. Needs default to Active on creation; Coordinators can save as Draft if incomplete. Archived needs are hidden from default view but accessible via filter.
- Q: How should v2 needs integrate with the care plan PDF? → A: **Out of scope** for this spec. PDF export is a future story under RNC2 that will consume v2 data. Data model should support future integration.
- Q: When the feature flag is enabled, should Coordinators see both v1 and v2? → A: **V2 replaces the tab completely**. V1 data remains in the system but is not surfaced through the v2 interface.
- Q: Can the 14 Maslow-based categories be modified by admins? → A: **Fixed, code-managed**. Categories are seeded via releases and cannot be modified by admins.
- Q: Should the needs list support reordering? → A: **Manual drag-and-drop**. Coordinators can drag needs to reorder; priority order is saved and persists.

---

## Gate 1: Spec Handover (Spec → Design)

**Date**: 2026-02-12
**Status**: PASS

### Gate 1 Checklist

#### Spec Completeness

| Check | Status | Evidence |
|-------|--------|----------|
| User stories defined with Given/When/Then | [x] PASS | 6 user stories (US1-US6), all with acceptance scenarios |
| INVEST criteria validated | [x] PASS | All 6 stories pass INVEST — see `checklists/requirements.md` |
| Priority levels assigned | [x] PASS | P1: US1-US3 (core CRUD + linking), P2: US4-US6 (list, wizard UX, feature flag) |
| Functional requirements testable | [x] PASS | FR-001 through FR-022, all verifiable |
| Key entities defined | [x] PASS | Need Category, Need (v2), Risk (existing), Budget Item (existing) |
| Edge cases documented | [x] PASS | 5 edge cases with resolution |
| Out of scope defined | [x] PASS | PDF generation, v1 migration, AI creation, risk scoring |
| Success criteria measurable | [x] PASS | SC-001 through SC-006, all quantifiable or verifiable |

#### Business Alignment

| Check | Status | Evidence |
|-------|--------|----------|
| Business spec created | [x] PASS | `business-spec.md` with executive summary, ROI, stakeholder RACI |
| Stakeholders identified | [x] PASS | 10 stakeholders with RACI roles |
| Business risks documented | [x] PASS | 4 risks with impact/likelihood/mitigation |
| Success metrics with baselines | [x] PASS | 6 KPIs with baseline and target |
| Pilot strategy defined | [x] PASS | Feature flag per org; co-design determines pilot group |

#### Clarifications Resolved

| Check | Status | Evidence |
|-------|--------|----------|
| Spec-lens questions answered | [x] PASS | 5 questions resolved (status lifecycle, PDF scope, feature flag behaviour, category management, list reordering) |
| Business-lens questions answered | [x] PASS | 2 questions resolved (pilot group, go/no-go signal) |
| No blocking NEEDS CLARIFICATION markers | [x] PASS | 0 remaining |

### Handover Notes

- Spec is complete and ready for design exploration
- Business case approved with ROI analysis and stakeholder alignment
- 5 clarifications resolved and incorporated into spec (FR-018 through FR-022 added)
- Requirements checklist at `checklists/requirements.md` — all passing

### Next Steps

- [x] Run `/trilogy-design` — Design kickoff
- [x] Run `/trilogy-mockup` — UI exploration
- [x] Run `/trilogy-design-handover` — Gate 2

## Clarification Outcomes

### Q1: [Scope] This spec is nearly identical to Stories 1-3 and 8 of the Future State Care Planning (RNC2) spec. Is this a standalone deliverable, or a sub-spec of RNC2?
**Answer:** This spec has passed Gate 1 independently (2026-02-12) with a full specification quality matrix, design kickoff, mockups, and design handover completed. The RNC2 spec duplicates this content as "Pillar 1." This spec is more detailed with resolved clarifications (FR-018-022 added post-clarification), a lifecycle model (Draft/Active/Archived), and drag-and-drop reordering. **This is a standalone deliverable tracked independently under the RNC2 umbrella. It is the canonical spec for Needs V2. The RNC2 spec's Pillar 1 should reference this spec rather than duplicating it. This spec's Gate 1 pass means it is ready for implementation independently of RNC2's other pillars.**

### Q2: [Dependency] FR-015 says v2 completely replaces the v1 needs tab when enabled. What happens to v1 data?
**Answer:** The spec is explicit: "v1 data remains in the system but is not surfaced through the v2 interface." The existing `PackageNeed` model (`domain/Need/Models/PackageNeed.php`) stores v1 needs with fields like `need_category_id`, `details`, `is_supported_by_hcp`, `comprehensive_needs_data`. FR-014 says v1 needs are "not migrated or affected." **V1 needs are preserved in the database but invisible when the v2 flag is enabled. Coordinators cannot see or edit v1 needs through the v2 interface. This is intentional -- v1 needs have different categories (Zoho-derived: "Domestic assistance", "Meals", etc.) that don't map to Maslow categories. If the flag is toggled off, v1 needs reappear. This means coordinators must recreate needs in v2 format -- there is no migration path. This should be communicated clearly during rollout.**

### Q3: [Data] The 14 predefined Maslow-based categories are "fixed and code-managed." What is the process for adding or modifying categories?
**Answer:** The clarification session resolved: "Categories are seeded via releases and cannot be modified by admins." The existing `NeedCategory` model (`domain/Need/Models/NeedCategory.php`) has fields: `name`, `label`, `icon`, `colour`, `can_select_multiple`. **Adding or modifying categories requires a code release with a new database seed/migration. This follows the same pattern as `RiskCategory` (seeded via `RiskCategorySeeder`). The 14 categories are treated like constants. To add a 15th category, a developer creates a migration or operation that inserts the new record. This is appropriate for a Maslow-based framework that should not change frequently.**

### Q4: [Edge Case] FR-022 supports drag-and-drop reordering. Is the priority order meaningful beyond display?
**Answer:** FR-021 says "Only Active needs with 'Add to Care Plan' enabled MUST be included when generating care plan documents." The order could affect care plan PDF generation (needs listed in priority order). **Assumption: Priority order is primarily for display and future care plan PDF generation. The order determines the sequence in which needs appear in the list and any future PDF output. It does not affect clinical decision-making or funding allocation. The `priority` or `order` column should be an integer that updates via drag-and-drop.**

### Q5: [Data] The v2 Need entity has a lifecycle (Draft/Active/Archived) but the v1 PackageNeed has no status field. How is the lifecycle stored?
**Answer:** The existing `PackageNeed` model has no status field. FR-018-021 introduce Draft/Active/Archived lifecycle. **A new `status` column (string, not enum column per Laravel conventions) should be added to the v2 needs table. Since v1 and v2 coexist with different schemas, v2 needs should use a new table (e.g., `needs_v2` or `simplified_needs`) rather than adding columns to the existing `package_needs` table. This avoids polluting the v1 schema with v2 fields.**

### Q6: [Integration] The spec links needs to risks via "one or more existing package risks." The existing `Risk` model uses a polymorphic `riskables` table. Should v2 needs use the same mechanism?
**Answer:** The existing `PackageNeed` model already has a `risks()` relationship via `morphToMany(Risk::class, 'riskable', 'riskables')`. The `Risk` model has the inverse `packageNeeds()` relationship. **V2 needs should use the same `riskables` polymorphic table for risk linking. If v2 uses a new model class (e.g., `SimplifiedNeed`), add it as a new riskable type. The existing infrastructure supports this without schema changes to the riskables table.**

### Q7: [UX] The wizard has 3 steps: Define Need, Link Risks, Associate Budget Items. Step 3 links to existing budget items. The budget domain uses `BudgetPlanItem` model with event sourcing. How are budget items presented for selection?
**Answer:** The existing `PackageNeed` model has a `budgetItems()` HasMany relationship to `PackageBudgetItem`. The Budget domain (`domain/Budget/`) has complex models including `BudgetPlanItem` with funding streams. **The wizard should display a selectable list of active budget items for the package, showing item name, amount, and funding stream. The association is many-to-many (a budget item can serve multiple needs). This requires a pivot table between v2 needs and budget plan items. The display should be simple -- budget item name and weekly/annual amount -- without exposing the full Budget complexity.**

## Refined Requirements

1. **V1 data communication**: When an organisation enables the v2 flag, a notification or onboarding message SHOULD inform coordinators that v1 needs are hidden and must be recreated in v2 format. No automatic migration occurs.
2. **Separate table**: V2 needs SHOULD use a new database table (e.g., `simplified_needs`) rather than adding columns to the existing `package_needs` table, to maintain clean separation between v1 and v2 data models.
3. **Risk linking reuse**: V2 needs SHOULD use the existing `riskables` polymorphic table for risk associations, adding the v2 Need model as a new riskable type.
4. **Budget item display**: The wizard's Step 3 (Associate Budget Items) SHOULD display budget items with: name, amount, and funding stream label. The association is stored in a pivot table.
