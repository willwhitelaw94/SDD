---
title: "Feature Specification: Feature Flag Toggles"
---

# Feature Specification: Feature Flag Toggles

**Feature Branch**: `feat/feature-flag-toggles`
**Created**: 2026-02-24
**Status**: Draft
**Input**: Per-user feature flag toggle UI so admins can control feature rollouts from the portal without developer intervention

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View Feature Flags for a User (Priority: P1)

An administrator navigates to a user's profile and opens the **Feature Flags tab** (alongside Profile Details, Contact Preferences, etc.). They see all registered feature flags with their current state. Each flag shows whether it is **on**, **off**, or **inherited** (falling back to the global default). The administrator can immediately understand which features a specific user has access to.

**Why this priority**: Without visibility into flag state, admins cannot make informed decisions about toggling. This is the foundation everything else builds on.

**Independent Test**: Can be fully tested by navigating to any user's profile and verifying that all registered flags are listed with their correct resolved state.

**Acceptance Scenarios**:

1. **Given** an administrator is viewing a user's profile, **When** they open the Feature Flags tab, **Then** they see a list of all auto-discovered feature flags, each showing the flag name, a short human-readable description, and the current resolved state (on/off)
2. **Given** a feature flag has no user-level override, **When** the administrator views it, **Then** the state shows as "inherited" with an indicator showing the global default value
3. **Given** a feature flag has a user-level override, **When** the administrator views it, **Then** the state shows the override value and is visually distinct from inherited flags
4. **Given** the administrator is viewing their own profile, **When** they open the Feature Flags tab, **Then** they see and can toggle their own flags (no self-view restriction)

---

### User Story 2 - Toggle a Feature Flag for a Specific User (Priority: P1)

An administrator can toggle a feature flag on or off for a specific user directly from the user's profile. The change takes effect immediately — the next time that user loads a page, they see (or don't see) the feature. The administrator can also reset the flag to "inherit from default" to remove a user-level override.

**Why this priority**: This is the core value — enabling fast, targeted feature rollouts and instant incident response without developer intervention.

**Independent Test**: Can be fully tested by toggling a flag for one user, then logging in as that user and confirming the feature is enabled/disabled.

**Acceptance Scenarios**:

1. **Given** an administrator is viewing a user's feature flags, **When** they toggle a flag from off to on, **Then** the change is saved inline immediately (no Save button) and a success toast is shown
2. **Given** an administrator has overridden a flag for a user, **When** they click "Reset to default", **Then** the user-level override is removed and the flag falls back to the global default
3. **Given** an administrator toggles a flag on for a user, **When** that user next loads a page, **Then** they see the feature enabled
4. **Given** an administrator toggles a flag off for a user who previously had it on, **When** that user next loads a page, **Then** the feature is no longer visible

---

### User Story 3 - View and Toggle Flags at Organisation Level (Priority: P2 — Deferred, Fast Follow)

> **Deferred from MVP.** Ship User-level toggles (US1 + US2) first. Organisation scope added as a fast follow once per-user toggles are validated.

An administrator can view and toggle feature flags at the organisation level, affecting all users within that organisation. Organisation-level flags sit between global defaults and user-level overrides in the scope hierarchy: **Global → Organisation → User**.

**Why this priority**: Organisation-level control enables phased rollouts to specific care partners or teams before a wider release, which is critical for managing risk with larger features.

**Independent Test**: Can be fully tested by toggling a flag at organisation level and verifying all users in that organisation see the change (unless they have a user-level override).

**Acceptance Scenarios**:

1. **Given** an administrator is viewing an organisation's details, **When** they open the Feature Flags section, **Then** they see all flags with their current organisation-level state
2. **Given** an administrator enables a flag at organisation level, **When** a user in that organisation (with no user override) loads the portal, **Then** they see the feature enabled
3. **Given** an organisation-level flag is on but a specific user has a user-level override of off, **When** that user loads the portal, **Then** the feature remains off (user override takes precedence)

---

### User Story 4 - Search and Filter Feature Flags (Priority: P3)

When the number of registered flags grows, an administrator can search by flag name or description and filter by state (on/off/inherited) to quickly find the flag they need.

**Why this priority**: Quality-of-life improvement that becomes important as the flag catalogue grows, but not blocking for initial release.

**Independent Test**: Can be tested by creating multiple flags and verifying search and filter narrow the list correctly.

**Acceptance Scenarios**:

1. **Given** an administrator is viewing a user's feature flags, **When** they type in the search field, **Then** the list filters to flags matching the search term by name or description
2. **Given** an administrator filters by "overridden", **When** the filter is applied, **Then** only flags with a user-level (or org-level) override are shown

---

### Edge Cases

- What happens when a flag is deleted from the registry but user-level overrides still exist in the database? The system should clean up stale overrides gracefully and not display deleted flags.
- What happens when two administrators toggle the same flag for the same user simultaneously? The last write wins, and both administrators see the updated state on their next page load.
- What happens when a user belongs to multiple organisations? Deferred — organisation-level scope is not in MVP. Will be resolved when US3 is picked up.
- What happens when PostHog is unreachable? The portal database (Pennant) is the source of truth. Changes push one-way to PostHog. If PostHog is unreachable, the local state is authoritative and the sync retries.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display all registered feature flags on a user's profile page, showing name, description, and resolved state
- **FR-002**: System MUST allow administrators to toggle any feature flag on or off for a specific user
- **FR-003**: System MUST allow administrators to reset a user-level flag override back to the inherited default
- **FR-004**: System MUST resolve flag state using the scope hierarchy: Global default → User override (most specific wins). Organisation scope deferred to fast follow.
- **FR-005**: System MUST show the inheritance source for each flag (e.g., "Global default", "User override")
- **FR-006**: System MUST persist flag changes immediately and reflect them on the user's next page load
- **FR-007**: System MUST restrict flag management to users with any admin-level role
- **FR-008**: ~~System MUST display feature flags on organisation detail pages~~ — Deferred to fast follow (US3)
- **FR-009**: System MUST support searching flags by name or description
- **FR-010**: System MUST use the portal database (Pennant) as source of truth and push flag changes one-way to PostHog
- **FR-011**: System MUST include all existing Nova Settings flags (`ff_chat_gpt_create_needs`, `ff_recipient_bill_list`, `ff_create_bill_from_email`, `ff_klaviyo_integration`, `ff_relationship_intelligence`) in the flag list
- **FR-012**: System MUST include all PostHog-managed flags (`budget-uplift`, `invoice-submitted-visibility`, `care-coordinator-bill-submission`, `workos-auth`, `assessment-document-review-mode`) in the flag list
- **FR-013**: System MUST provide visual distinction between flags that are globally controlled versus scoped overrides
- **FR-014**: System MUST log all flag toggle actions via Spatie Activity Log (who toggled, which flag, old value, new value, timestamp)
- **FR-015**: System MUST auto-discover available flags from Feature classes (`app/Features/`), Nova Settings (`ff_` prefix keys), and PostHog flag keys — no manual registration required
- **FR-016**: System MUST always display the full flag list (no empty state). Flags without user overrides show their inherited global default with an "inherited" badge
- **FR-017**: System MUST save flag changes inline on toggle (no explicit Save button), with a success toast confirmation
- **FR-018**: System MUST show each flag with its name, a short human-readable description, and a toggle switch
- **FR-019**: System MUST display the Feature Flags tab on all user profiles, including the administrator's own profile

### Key Entities

- **Feature Flag**: A named toggle controlling visibility of a feature. Has a name, description, global default state, and optional scope overrides. Each flag can be boolean (on/off) or multi-variant (for A/B testing).
- **Flag Override**: A scoped override of a flag's default state. Belongs to a User (MVP) or Organisation (fast follow). Stores the override value and when it was last changed.
- **Scope Hierarchy**: MVP: Global → User. Fast follow: Global → Organisation → User. The most specific scope wins.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Administrators can view and toggle a feature flag for a specific user in under 10 seconds, without any developer assistance
- **SC-002**: Flag state changes are reflected for the target user within one page load (no cache delay)
- **SC-003**: 100% of existing feature flags (both Nova Settings and PostHog-managed) are visible in the new UI
- **SC-004**: Zero developer interventions required for per-user flag management after initial rollout (currently requires Tinker/SSH access)
- **SC-005**: Scope hierarchy resolution is correct in 100% of cases — user overrides always take precedence over global defaults

## Scope

### In Scope (MVP)
- US1: View feature flags on user profile tab
- US2: Toggle flags per user with immediate effect
- FR-014: Audit logging via Spatie Activity Log
- All existing Nova Settings + PostHog flags unified in one UI

### Out of Scope (Fast Follow)
- US3: Organisation-level flag management
- US4: Search and filter (low priority, added when flag count grows)
- Multi-variant / A/B test management (view-only for experiments)
- Creating new feature flags from the UI (flags are registered in code)

## Clarifications

### Session 2026-02-24
- Q: Where should the Feature Flags UI live? → A: New tab on the user account/profile page (alongside Profile Details, Contact Preferences, etc.)
- Q: Which roles should have access to toggle flags? → A: Any admin-level role
- Q: Should PostHog sync be bi-directional or one-way? → A: Portal database (Pennant) is source of truth, one-way push to PostHog
- Q: Should Org-level scope be in MVP? → A: No — ship User-level only. Org scope is a fast follow.
- Q: Should flag toggles have audit trail? → A: Yes, via Spatie Activity Log (already in the project)
- Q: How should the flag registry work? → A: Auto-discover from code (Feature classes + Nova Settings ff_ keys + PostHog flag names). No manual registration.
- Q: Should the tab be visible on your own profile? → A: Yes, visible on all user profiles including your own. No self-view restriction.
- Q: What's the empty state when no overrides exist? → A: Always show full flag list. Each row shows global default with "inherited" badge. No empty state needed.
- Q: Inline save or batch save? → A: Inline save on toggle with success toast. No explicit Save button.
- Q: What detail to show per flag? → A: Name + short human-readable description + toggle. Descriptions sourced from Feature class docblocks or config.

## Clarification Outcomes

### Q1: [Dependency] What is the timeline for US3 (Organisation Level)? Epics need it for gradual rollouts.
**Answer:** US3 is explicitly deferred as a "fast follow" after MVP. Multiple portfolio epics need per-organisation flags for phased rollout. The Organisation model exists at `domain/Organisation/Models/Organisation.php`. **Recommendation:** US3 should be prioritised immediately after MVP (US1 + US2) ships. The database schema should be designed upfront to accommodate the organisation scope (add `flaggable_type` and `flaggable_id` polymorphic columns to the flag overrides table) even if the UI is deferred. This avoids a migration later.

### Q2: [Scope] What is the purpose of PostHog sync? Is it essential for MVP?
**Answer:** The spec states "Portal database (Pennant) is source of truth, one-way push to PostHog" (FR-010). PostHog is used for product analytics (event tracking, funnel analysis) and also serves some feature flags (FR-012 lists 5 PostHog-managed flags: `budget-uplift`, `invoice-submitted-visibility`, etc.). **PostHog sync is important for analytics continuity** -- product team uses PostHog dashboards to correlate feature flag state with user behaviour metrics. **For MVP, PostHog sync should be included** but implemented as a fire-and-forget queue job so PostHog downtime doesn't block flag toggles.

### Q3: [Data] How are flags auto-discovered?
**Answer:** Per FR-015: "Auto-discover available flags from Feature classes (`app/Features/`), Nova Settings (`ff_` prefix keys), and PostHog flag keys." The codebase has one Feature class: `app/Features/ToggleKlaviyoFeature.php`. Nova Settings with `ff_` prefix include at least 5 flags (FR-011: `ff_chat_gpt_create_needs`, `ff_recipient_bill_list`, `ff_create_bill_from_email`, `ff_klaviyo_integration`, `ff_relationship_intelligence`). PostHog flags add 5 more (FR-012). **The auto-discovery mechanism scans three sources at runtime and merges them into a unified flag list.** This is well-defined in the spec.

### Q4: [Edge Case] Multi-organisation user behaviour (deferred to US3)?
**Answer:** This is explicitly deferred. When US3 is implemented, the expected behaviour should be **most permissive (union)** -- if any organisation the user belongs to has the flag enabled, the user gets it. This aligns with the scope hierarchy "most specific wins" principle: User override > Organisation override > Global default. If a user has no user-level override, the system checks all their organisations and applies the most permissive result. **This decision should be documented now** even though implementation is deferred.

### Q5: [Data] How many total flags exist today?
**Answer:** Based on FR-011 (5 Nova Settings flags) + FR-012 (5 PostHog flags) + 1 Feature class = **approximately 11 flags today**. US4 (Search and Filter) is low priority because the flag count is small. As the portfolio grows, expect 30-50 flags within 12 months. **The auto-discovery approach scales well** but flag descriptions (sourced from Feature class docblocks or config) must be maintained for the list to be useful.

## Refined Requirements

1. **Design the database schema for organisation scope upfront** (polymorphic `flaggable_type`/`flaggable_id`) even though US3 UI is deferred.
2. **PostHog sync should be a queue job** (fire-and-forget) to prevent PostHog downtime from blocking flag toggle operations.
3. **Document the multi-organisation resolution strategy (most permissive/union)** now for US3 implementation later.
4. **Flag descriptions must be maintained** in Feature class docblocks, Nova Settings config, or a separate registry file to keep the flag list human-readable.
5. **Add acceptance criteria for audit logging** (FR-014): Spatie Activity Log entries should include the flag name, old value, new value, scope (user/global), and target user ID.
