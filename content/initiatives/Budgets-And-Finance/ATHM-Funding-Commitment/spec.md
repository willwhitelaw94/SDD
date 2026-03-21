---
title: "Feature Specification: ATHM Funding Commitment"
---

> **[View Mockup](/mockups/athm-funding-commitment/index.html)**{.mockup-link}

# Feature Specification: ATHM Funding Commitment

**Epic Code**: AFC
**Created**: 2026-02-15
**Status**: Draft
**Input**: Idea Brief — reserve ATHM funds against a budget item for contractually committed services

## User Scenarios & Testing

### User Story 1 — Hold ATHM funds for a budget item (Priority: P1)

A user building a budget for a recipient with Assistive Technology or Home Modifications services needs to mark specific budget items as "held" so the ATHM-specific funding stream allocations are reserved and cannot be consumed by other services or bills.

When editing a budget item that belongs to the Assistive Technology (SERG-0002) or Home Modifications (SERG-0003) service category, the user sees a "Hold ATHM funds for this budget item" checkbox. The checkbox is always visible and toggleable for eligible service categories, even before a funding stream is assigned — it represents a declaration of intent. Enabling it signals that the ATHM funding stream allocations (AT and HM streams only) on this item are contractually held. Other funding streams on the same item (CU, HC, VC) remain available to other services.

**Why this priority**: This is the core interaction — without the hold mechanism, nothing else in this feature has value.

**Independent Test**: Can be tested by opening a budget item for an AT or HM service and toggling the checkbox on and off, confirming it persists on save.

**Acceptance Scenarios**:

1. **Given** a budget item under the Assistive Technology service category, **When** the user expands the item for editing, **Then** a "Hold ATHM funds for this budget item" checkbox is visible
2. **Given** a budget item under the Home Modifications service category, **When** the user expands the item for editing, **Then** the same checkbox is visible
3. **Given** a budget item under any other service category (e.g. Home Support), **When** the user expands the item, **Then** no hold checkbox is displayed
4. **Given** the user enables the hold checkbox and saves, **When** they reopen the budget item, **Then** the checkbox remains enabled
5. **Given** the user disables a previously enabled hold checkbox and saves, **When** they reopen the budget item, **Then** the checkbox is disabled

---

### User Story 2 — Allocation logic respects held amounts (Priority: P1)

When ATHM funds are held against a budget item, the allocation engine must give held items priority claim on ATHM-specific funding streams (AT, HM) during budget submission and bill processing. Other funding streams (CU, HC, VC) on the same item are unaffected. This prevents over-allocation when other services compete for the same ATHM funding pool.

The held item gets priority claim on the ATHM funding streams — if the item's cost exceeds the ATHM stream total, the remainder overflows to other eligible funding streams (HC, VC, etc.) per the normal allocation waterfall defined in `config/support-at-home.php`. The available-to-allocate display in the UI stays as-is (held amounts are already included in the "planned" total); the hold is enforced at allocation time, not in the display layer.

**Why this priority**: Equal to P1 — the hold has no protective value unless allocation calculations respect it. Users would still over-allocate without this.

**Independent Test**: Can be tested by holding funds on one budget item and submitting the budget, confirming the held item is allocated its ATHM funds before other items.

**Acceptance Scenarios**:

1. **Given** an AT funding stream with $10,000 total and two budget items competing for AT funds, **When** one item ($2,000 from AT) has funding held and the budget is submitted, **Then** the held item's $2,000 AT allocation is guaranteed before other items are allocated
2. **Given** the same budget item also has $1,000 allocated from CU, **When** allocation runs, **Then** the CU allocation is unaffected by the hold — only AT/HM streams receive priority
3. **Given** a held budget item is later released (hold removed) and the budget is resubmitted, **When** allocation runs, **Then** the previously held amount is available to all items equally
4. **Given** multiple budget items hold funds from the same AT funding stream, **When** allocation runs, **Then** all held items receive their AT allocations first, cumulatively
5. **Given** a held budget item costs $15,000 but only $10,000 is available from AT, **When** allocation runs, **Then** the full $10,000 AT amount is prioritised for this item and the remaining $5,000 flows to HC or VC per the allocation waterfall

---

### User Story 3 — Bill processing respects held funds (Priority: P1)

When a bill is processed and funding is allocated to bill items, the system must not draw from ATHM funds that are held for other budget items. Bill processing only respects holds from the active/published budget plan — draft holds do not affect bill allocation.

**Why this priority**: Equal to P1 — if bills can consume held funds, the hold is meaningless and the original over-allocation problem persists at billing time.

**Independent Test**: Can be tested by holding funds against a budget item on a published budget, then processing a bill for a different service against the same funding stream and confirming the held amount is excluded from available funds.

**Acceptance Scenarios**:

1. **Given** $5,000 is held from an AT funding stream on a published budget, **When** a bill for a different service tries to allocate from the same AT stream, **Then** the held $5,000 is excluded from the available pool for that bill
2. **Given** a bill is for the same budget item that holds AT funds, **When** the bill is processed, **Then** the bill can draw from the held amount (the hold protects funds *for* that item, not *from* it)
3. **Given** no holds exist on any budget items, **When** a bill is processed, **Then** allocation works identically to today — no change in behaviour
4. **Given** a hold exists only on a draft (unpublished) budget, **When** a bill is processed, **Then** the hold is ignored and allocation works as normal

---

### User Story 4 — Visual indicator for held budget items (Priority: P2)

Users viewing the budget plan need to quickly distinguish which items have held funds without expanding each one. A visual indicator on the collapsed budget item row communicates that funds are committed.

**Why this priority**: Enhances usability but the core hold mechanics work without it. Important for at-a-glance awareness.

**Independent Test**: Can be tested by enabling a hold on a budget item, collapsing it, and confirming a visual indicator is present in the summary row.

**Acceptance Scenarios**:

1. **Given** a budget item has the hold enabled, **When** the user views the budget in collapsed state, **Then** a "held" indicator (badge or icon) is visible alongside the item's metadata
2. **Given** a budget item does not have the hold enabled, **When** the user views it in collapsed state, **Then** no commitment indicator is shown
3. **Given** the user is viewing a past or future quarter period for a held item, **Then** the commitment indicator is consistent across all periods

---

### Edge Cases

- **What happens when a held budget item is deleted?** The hold is released and the funds return to the available pool. No orphaned holds remain.
- **What happens when the funding stream linked to a held item is removed from the budget item?** The hold flag remains on the budget item (it's a declaration of intent), but has no practical effect until an ATHM funding stream is re-assigned.
- **What happens if a budget item's service category changes from AT/HM to Home Support?** The hold should be automatically cleared since the hold only applies to SERG-0002 and SERG-0003.
- **What happens when a hold is enabled but the budget item has no funding stream allocated yet?** The checkbox is always visible and toggleable for SERG-0002/0003 items. The hold is a declaration of intent — it takes practical effect once an ATHM funding stream is assigned.
- **Can a budget item hold funds from multiple funding streams?** A budget item can be linked to multiple funding streams. The hold applies only to ATHM-specific streams (AT, HM). Other streams (CU, HC, VC) on the same item are not affected.
- **What is the "held amount"?** The sum of the budget item's funding allocations against ATHM-specific streams (AT, HM) only. Other stream allocations on the same item remain available. If the item's cost exceeds the ATHM stream total, the overflow is allocated to other eligible streams per the normal waterfall.
- **Draft vs Published holds?** Budget planning views respect holds on any budget state (draft or published). Bill processing only respects holds from the active/published budget plan.
- **Budget versioning?** When a new draft is created from a published plan, holds carry over automatically. Users do not need to re-enable them.

## Out of Scope

The following are explicitly not part of this feature and may be considered in future iterations:

- **Partial holds** — holding only a portion of the ATHM allocation rather than the full amount
- **Hold expiry** — auto-releasing holds after a date or time limit
- **Approval workflow** — requiring a second user to approve or review the hold
- **Notifications** — alerts when a hold is placed or released
- **Hold reporting** — a dedicated dashboard or report listing all held items across packages

## Requirements

### Functional Requirements

- **FR-001**: The system MUST display a "Hold ATHM funds for this budget item" checkbox when editing a budget item that belongs to the Assistive Technology (SERG-0002) or Home Modifications (SERG-0003) service categories
- **FR-002**: The system MUST NOT display the hold checkbox for budget items in any other service category
- **FR-003**: The checkbox MUST be visible and toggleable for eligible service categories even before a funding stream is assigned (declaration of intent). No additional permission is required — any user who can edit the budget item can toggle the hold
- **FR-004**: The system MUST persist the hold state (`is_funding_held`) when the budget item is saved. Changes to the hold state are captured by the existing activity log (no additional audit mechanism required)
- **FR-005**: The held amount is the sum of the budget item's funding allocations against ATHM-specific streams (AT, HM) only. Other stream allocations (CU, HC, VC) on the same item are not held
- **FR-006**: When allocating funding during budget plan submission, the system MUST give held items priority claim on ATHM-specific streams (AT, HM) — held items are allocated first before remaining capacity is distributed to other items
- **FR-007**: When allocating funding to bill items, the system MUST exclude held ATHM stream amounts from the available pool — unless the bill item is for the budget item that holds those funds. Bill processing MUST only respect holds from the active/published budget plan
- **FR-008**: Held budget items MUST receive priority claim on ATHM funding streams. If the item's cost exceeds the ATHM stream total, the remainder overflows to other eligible streams per the allocation waterfall
- **FR-009**: The system MUST display a visual "held" indicator on budget items that have the hold enabled, visible in both collapsed and expanded states
- **FR-010**: The system MUST automatically clear the hold if the budget item's service category changes away from SERG-0002 or SERG-0003
- **FR-011**: The system MUST release held funds when a budget item is deleted
- **FR-012**: When no holds exist, the system MUST behave identically to the current allocation logic — zero regression

### Key Entities

- **Budget Plan Item**: Existing entity representing a planned service within a budget. Gains a new `is_funding_held` attribute (boolean) indicating whether ATHM funds are held for this item
- **Budget Plan Funding Allocation**: Existing entity linking a budget item to a funding stream with an allocated amount. When the parent budget item has the hold enabled, only ATHM-specific stream allocations (AT, HM) are treated as held — other stream allocations (CU, HC, VC) remain available
- **Funding Stream**: Existing entity representing a source of funds (e.g. AT, HM, ON). The allocation engine must give held items priority claim on ATHM-specific streams during submission and bill processing
- **Bill Item Funding Allocation**: Existing entity created during bill processing. Must respect held amounts from published budgets when determining which ATHM funding streams have capacity

## Success Criteria

### Measurable Outcomes

- **SC-001**: Users can enable or disable the funding hold on eligible budget items within the normal save workflow — no additional steps or screens required
- **SC-002**: Allocation logic accurately respects held amounts — held items receive priority on ATHM streams during budget submission and bill processing. The available-to-allocate display stays as-is (held amounts are included in the "planned" total); no changes to aggregate views required
- **SC-003**: Bills processed against funding streams with held amounts never consume the reserved portion (unless the bill is for the held item itself)
- **SC-004**: Zero regressions in allocation behaviour for budget items and bills where no holds are active
- **SC-005**: Users can identify held budget items at a glance from the collapsed budget view without expanding each item

## Clarifications

### Session 2026-02-15

- Q: When a hold is enabled, what amount is reserved? -> A: Only ATHM-specific funding stream allocations (AT, HM) are held. Other streams on the same item (CU, HC, VC) remain available to other services.
- Q: Should the checkbox be disabled until a funding stream is allocated? -> A: No — the checkbox is always visible and toggleable for SERG-0002/0003 items. It's a declaration of intent that takes practical effect once an ATHM funding stream is assigned.
- Q: When does a hold affect availability and bill allocation? -> A: Budget planning views respect holds on any budget state (draft or published). Bill processing only respects holds from the active/published budget plan.
- Q: How do holds interact with the 200% over-allocation threshold? -> A: They don't interact directly. The held item gets priority claim on the ATHM funding stream. If the item's cost exceeds the ATHM stream total, the remainder overflows to other eligible streams (HC, VC) per the normal allocation waterfall. The threshold check remains unchanged.
- Q: What is the canonical term? -> A: "Held" — UI label: "Hold ATHM funds for this budget item", data model: `is_funding_held`, documentation: "held".

### Session 2026-02-15 (Round 2)

- Q: Who can toggle the hold? -> A: Any user who can edit the budget item. No additional permission required.
- Q: Do holds carry over when a new draft is created from a published plan? -> A: Yes — holds carry over automatically. Users don't need to re-enable them.
- Q: Should hold changes be audited? -> A: Yes, automatically via the existing LogsActivity trait on BudgetPlanItem. No additional audit mechanism needed.
- Q: Should downstream views (sidebar, utilisation, charts) reflect held amounts separately? -> A: No — held amounts are already included in the "planned" total. No changes needed to aggregate views. The hold only affects allocation logic.
- Q: What is explicitly out of scope? -> A: Partial holds, hold expiry, approval workflows, notifications, and hold reporting dashboards.

### Session 2026-02-15 (Development Lens)

- Q: Should FundingStreamData available-to-allocate display change to reflect held amounts? -> A: No — FundingStreamData doesn't need to be concerned with held amounts. The hold is only enforced within the allocation logic (AllocateFundingsAction during budget submission and CalculateBillFundingAllocations during bill processing), not in the display layer.
- Q: Should AllocateFundingsAction give held items priority during submission? -> A: Yes — held items should be allocated first in the submission validation pass, ensuring their ATHM funds are reserved before other items claim them.
- Q: Should this feature be behind a feature flag? -> A: No — the feature is additive (checkbox defaults to off), low risk, and only affects users who actively enable it.
- Q: How should the event sourcing projector handle existing events that predate this feature? -> A: Default to `false` if `is_funding_held` key is missing in the event payload.
- Q: FundingStream has AT constant but no HM constant? -> A: Add `HOME_MODIFICATIONS_EXTERNAL_ID = 'HM'` constant to FundingStream, consistent with existing AT pattern.

## Clarification Outcomes

### Q1: [Dependency] How does the ATHM funding hold interact with the Budget Reloaded (BUR) epic's funding stream allocation priority (US2)? If BUR changes allocation order, does the hold mechanism need updating?
**Answer:** The hold mechanism and BUR's allocation priority are complementary, not conflicting. BUR US2 changes the order in which funding streams are consumed (quarterly before unspent). The AFC hold adds a pre-allocation reservation step that runs before the BUR ordering logic. Codebase evidence: `AllocateFundingsAction` in `domain/Budget/Actions/AllocateFundingsAction.php` processes items sequentially against funding streams using `config/support-at-home.php` allocation rules (SERG-0001 -> EL/ON/RC/CU/HC/VC, SERG-0002 -> CU/HC/AT/VC, SERG-0003 -> CU/HC/HM/VC). The hold mechanism would insert a priority pass before the existing allocation loop. If BUR reorders funding stream priority, the hold still operates at a higher level (held items allocated first), so no conflict arises. The two features should be developed with awareness of each other's allocation entry points.

### Q2: [Edge Case] The spec says the hold applies to AT and HM streams only. What happens when the Support at Home program introduces new ATHM-related funding streams in the future? Is the hold mechanism extensible?
**Answer:** The mechanism should be extensible. Currently `FundingStream` in `domain/Funding/Models/FundingStream.php` defines `ASSISTIVE_TECHNOLOGY_EXTERNAL_ID = 'AT'` but lacks an HM constant (the spec already identifies this gap and prescribes adding `HOME_MODIFICATIONS_EXTERNAL_ID = 'HM'`). The hold logic should reference a configurable list of "ATHM-eligible" stream external IDs rather than hardcoding AT and HM. Recommendation: define an `ATHM_STREAM_EXTERNAL_IDS` constant array (or config key in `support-at-home.php`) so future streams can be added without code changes.

### Q3: [Data] The spec mentions `is_funding_held` on BudgetPlanItem. How does this interact with the Inclusion Integration (ASS2) epic, which also governs ATHM funding pathways and eligibility?
**Answer:** The `BudgetPlanItem` model (`domain/Budget/Models/BudgetPlanItem.php`) currently has no `is_funding_held` field — it needs to be added via migration. The model's `$fillable` includes `service_category_id` which links to SERG codes, and the hold checkbox visibility depends on this being SERG-0002 or SERG-0003. ASS2 governs eligibility for ATHM funding pathways at the package/client level (whether a client qualifies for AT/HM funding). AFC operates at the budget item level (reserving already-allocated ATHM funds). They are complementary: ASS2 determines if a client has ATHM funding streams available, AFC determines if specific budget items hold those funds. No direct data model conflict, but both touch the funding allocation pipeline.

### Q4: [Scope] The spec explicitly excludes partial holds. Has the business validated that full-amount-only holds cover all real-world scenarios? Are there cases where a care partner needs to hold only a portion of the ATHM allocation?
**Answer:** Assumption: full-amount holds are sufficient for the initial release based on the spec's clarification that "the held amount is the sum of the budget item's funding allocations against ATHM-specific streams." In practice, a budget item typically has a single ATHM allocation amount, so "full hold" means holding that specific item's AT/HM allocation — not the entire funding stream pool. A care partner wanting to hold only part of an item's ATHM allocation would need to split the budget item into two items (one held, one not). This is a viable workaround. The out-of-scope section explicitly defers partial holds to future iterations, which is reasonable for MVP.

### Q5: [Data] The `BudgetPlanItem` model uses event sourcing via `BudgetPlanItemCreated` event. How should the `is_funding_held` field be handled in the event sourcing pipeline?
**Answer:** The spec's own clarification answers this: default to `false` if `is_funding_held` is missing from the event payload. Codebase evidence: the Budget domain uses event sourcing extensively (`domain/Budget/EventSourcing/Events/BudgetPlanItemCreated.php`, `BudgetPlanItemQuarterUpdated.php`, etc.) with a `BudgetPlanProjector`. The new field should be added to the relevant events and the projector should handle missing keys gracefully. The `LogsActivity` trait on `BudgetPlanItem` will automatically capture hold state changes in the audit log.

### Q6: [Integration] How does the hold interact with `CalculateBillFundingAllocations` during bill processing?
**Answer:** `CalculateBillFundingAllocations` in `domain/Funding/Actions/CalculateBillFundingAllocations.php` determines how bill items consume funding. FR-007 requires this action to exclude held ATHM amounts from the available pool unless the bill is for the held item itself. This means `CalculateBillFundingAllocations` needs access to the active/published budget plan's held items and their ATHM allocations. The action currently receives funding stream data; it will need an additional parameter or query to check for holds.

### Q7: [Edge Case] What happens if a budget item has `is_funding_held = true` but no ATHM funding stream is assigned to the budget plan?
**Answer:** The spec addresses this: "The checkbox is always visible and toggleable for SERG-0002/0003 items. The hold is a declaration of intent — it takes practical effect once an ATHM funding stream is assigned." The `is_funding_held` flag persists on the model regardless of funding stream assignment. The allocation engine should check both the flag AND whether ATHM streams are present before applying priority logic.

### Q8: [Performance] Could the priority allocation pass for held items create performance issues with large budgets?
**Answer:** Unlikely. The `AllocateFundingsAction` already iterates over all budget items and funding streams. Adding a pre-pass for held items (typically 1-3 items per budget with ATHM services) is negligible. The held items are filtered by `is_funding_held = true` AND `service_category_id` in SERG-0002/0003, which is a small subset.

### Q9: [Permissions] Who can toggle the hold checkbox?
**Answer:** Per the spec's clarification: "Any user who can edit the budget item. No additional permission required." This aligns with the existing Budget domain where editing permissions are controlled at the budget plan level, not individual field level.

### Q10: [Migration] Does the hold carry over correctly when duplicating a budget plan?
**Answer:** The spec says holds carry over when a new draft is created from a published plan. The `DuplicateBudgetPlanAction` in `domain/Budget/Actions/DuplicateBudgetPlanAction.php` copies budget plan items. The `is_funding_held` field must be included in the duplication logic. This is a straightforward addition to the existing copy mechanism.

## Refined Requirements

Based on the clarification analysis, the following additional acceptance criteria and implementation notes are recommended:

- **FR-REFINED-001**: The list of ATHM-eligible funding stream external IDs (AT, HM) SHOULD be defined in `config/support-at-home.php` as a configurable array rather than hardcoded, to support future ATHM stream additions.
- **FR-REFINED-002**: The `DuplicateBudgetPlanAction` MUST include `is_funding_held` when copying budget plan items from a published plan to a new draft.
- **FR-REFINED-003**: A `HOME_MODIFICATIONS_EXTERNAL_ID = 'HM'` constant MUST be added to the `FundingStream` model, consistent with the existing `ASSISTIVE_TECHNOLOGY_EXTERNAL_ID = 'AT'` pattern.
- **FR-REFINED-004**: The `CalculateBillFundingAllocations` action MUST receive held item data from the active/published budget plan to enforce bill-time fund reservation.
