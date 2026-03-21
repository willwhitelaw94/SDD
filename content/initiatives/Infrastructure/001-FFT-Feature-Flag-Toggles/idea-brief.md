---
title: "Idea Brief: Feature Flag Toggles"
---

# Idea Brief: Feature Flag Toggles

**Created**: 2026-02-23
**Author**: Will Whitelaw

---

## Problem Statement (What)

- Feature flags (Laravel Pennant) are currently managed **programmatically only** — no UI exists to toggle them per user or per organisation
- Nova Settings provides global on/off toggles but has **no per-scope granularity** (can't enable a feature for one user while keeping it off for others)
- Developers must deploy code or run Tinker commands to activate/deactivate flags for specific users — slow, error-prone, and inaccessible to non-developers
- No visibility into which flags are active for a given user or organisation

**Current State**: 6 global flags in Nova Settings + 4 Pennant database flags managed via code. No per-user or per-org toggle capability outside of direct database manipulation.

---

## Possible Solution (How)

Add a **Feature Flags** section to the user profile page (and potentially org detail page) where admins can toggle Pennant flags per user and per organisation.

- Toggle switches for each registered feature flag, showing current state (active/inactive/inherited)
- Scope hierarchy: **Global default → Organisation override → User override**
- Clear indication of where a flag's value is coming from (inherited vs explicitly set)
- Ability to "reset to default" (remove override, fall back to parent scope)

```
// Before
1. Developer identifies user who needs flag toggled
2. SSH into server or open Tinker
3. Run Feature::for($user)->activate('flag-name')
4. No audit trail, no visibility

// After
1. Admin navigates to user profile → Feature Flags tab
2. Sees all flags with current state and inheritance source
3. Toggles switch → saved immediately via Pennant API
4. Change is visible, auditable, reversible
```

---

## Benefits (Why)

**User/Client Experience**:
- Controlled rollouts: enable new features for specific users before wider release
- Faster incident response: disable a broken feature for affected users in seconds

**Operational Efficiency**:
- Non-developers can manage flag states without engineering support
- Eliminates need for Tinker/SSH access for flag management

**Business Value**:
- Enables A/B testing and phased rollouts per user/org
- Reduces risk of feature releases through granular control

---

## Owner & Stakeholders

| Role | Person |
|------|--------|
| **R** | Will Whitelaw (PO, Dev) |
| **A** | — |
| **C** | — |
| **I** | — |

---

## Assumptions & Dependencies, Risks

**Assumptions**:
- Laravel Pennant's database driver remains the primary store (not PostHog)
- All feature flags worth toggling are registered as Pennant features

**Dependencies**:
- Existing user profile page infrastructure (UserAccountPageController)
- Laravel Pennant v1 database driver

**Risks**:
- Feature flag state confusion if global, org, and user scopes conflict (LOW) → Mitigation: Clear UI showing inheritance chain
- Performance if querying many flags per page load (LOW) → Mitigation: Pennant caches resolved values

---

## Estimated Effort

**S (1 sprint)**, approximately 8-13 story points

- **Sprint 1**: Backend API (controller, routes, Pennant integration) + Frontend (Vue page with CommonSwitch toggles, scope indicator badges)

---

## Proceed to PRD?

**YES** — Small, well-scoped feature with clear implementation path using existing Pennant infrastructure.

---

## Decision

- [ ] **Approved** - Proceed to PRD
- [ ] **Needs More Information** - [What's needed?]
- [ ] **Declined** - [Reason]

**Approval Date**: —

---

## Next Steps

**If Approved**:
1. [ ] `/trilogy-idea-handover` — Gate 0: Create epic in Linear as Backlog
2. [ ] `/speckit-specify` — Create spec with detailed AC
3. [ ] Implementation (small enough to skip design phase)

**If Declined**:
- Continue managing flags via Tinker/Nova Settings

---

**Notes**: Existing infrastructure already supports per-scope storage. The backend work is largely wiring up existing toggle capabilities to a user-facing interface.
