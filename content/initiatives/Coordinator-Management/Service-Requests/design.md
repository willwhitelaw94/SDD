---
title: "Design Brief: Service Requests — Cab Charge & Meals"
status: Draft
created: 2026-02-26
---

# Design Brief: Service Requests — Cab Charge & Meals

**Epic:** SRQ — Service Requests
**Spec:** [spec.md](/initiatives/coordinator-management/service-requests/spec)

---

## User Context

| Aspect | Answer | Impact on Design |
|--------|--------|------------------|
| Primary User | Coordinator (staff) | Needs efficiency, familiar patterns, minimal clicks |
| Secondary User | Team Lead (oversight) | Needs quick status visibility across recipients |
| Device Priority | Desktop-first | Can use full-width tables, modals, multi-column forms |
| Usage Frequency | Daily | Worth investing in keyboard shortcuts and quick actions |
| Context | Multitasking, time-pressured, often on the phone | Needs clear status at a glance, fast create flows, minimal form fields |

---

## Design Principles

**North Star:** Replace Zoho, not reinvent it — faithful translation with minimal learning curve for coordinators already using Zoho.

**Supporting Principles:**
1. **Streamline what Zoho made clunky** — use the migration as an opportunity to simplify (conditional fields, auto-linking care plan, stage validation)
2. **Status at a glance** — prioritise visibility of where every request sits in its lifecycle (colour-coded stage badges, clear timelines)
3. **Consistent with Portal** — follow existing recipient profile tab patterns so this feels native, not bolted on

---

## Build Size

**Size:** Medium

**Rationale:**
- ~8 new screens (Index, Create, Edit, Show × 2 modules)
- Both modules share structural patterns — build one, adapt for the other
- Reuses existing recipient profile tab pattern and Common components
- New interaction patterns: stage progression controls, conditional form fields (delivery option → address/SMS/email), replacement card linking
- Zoho read-only import adds a data layer but minimal UI beyond a "historical" badge

---

## Scope

### MVP (Phase 1)

- **Cab Charge**: Full CRUD + 8-stage lifecycle on recipient profile tab
- **Meals**: Full CRUD + 5-stage lifecycle on recipient profile tab
- **Zoho import**: Read-only historical records with visual badge distinguishing them from Portal-created records
- **Stage history**: Native event-sourced timeline (who changed what, when, duration per stage)
- **Declaration**: Checkbox confirmation (coordinator attests recipient declared externally)
- **Replacement cards**: Linked to original request, original auto-cancels
- **Auto-cancel on exit**: Active requests cancelled when recipient's care plan closes

### Deferred (Phase 2+)

- In-Portal declaration form with digital signing
- Email/in-app notifications on stage changes
- Coordinator request dashboard (cross-recipient view)
- Stage aging alerts (stuck requests)
- Provider API integration (auto-submit to LiteNeasy, YouFoodz, etc.)
- Recipient self-service view
- Meal dietary preferences capture

### Feature Flags

- `cab_charge_requests` — controls visibility of Cab Charge tab on recipient profile
- `meal_requests` — controls visibility of Meals tab on recipient profile
- Independent rollout: can ship Meals first (existing branch) then Cab Charge, or vice versa

### Success Metrics

| Metric | Target | How to Measure |
|--------|--------|----------------|
| Zoho Cab Charge usage → zero | Within 30 days of rollout | Zoho login/access audit |
| Zoho Meals usage → zero | Within 30 days of rollout | Zoho login/access audit |
| Stage transitions per day | ≥ current Zoho volume | Portal analytics (PostHog) |
| Coordinator adoption | 100% of active coordinators | Feature flag + usage tracking |
| Avg time to create request | < 60 seconds | PostHog timing events |

---

## UI Structure

### Navigation

Both modules live as **tabs on the recipient's staff profile page**. No standalone sidebar pages.

```
Recipient Profile
├── Overview
├── Care Plan
├── Needs
├── Risks
├── Budget
├── Cab Charge ← NEW (behind feature flag)
├── Meals ← NEW (behind feature flag)
├── Documents
└── Timeline
```

> **Migration note**: The existing `feature/meals-module` branch uses standalone `/staff/meals` pages. These should be refactored into the recipient profile tab pattern.

### Screen Map

#### Cab Charge Tab (on recipient profile)

| Screen | Pattern | Notes |
|--------|---------|-------|
| **Index** | Table list | Columns: ID, Stage (colour badge), Budget, Delivery Option, Start Date, Actions |
| **Create** | Modal or slide-over form | Pre-filled recipient + care plan. Conditional fields based on delivery option |
| **Show** | Detail view | All fields + stage progression controls + stage history timeline |
| **Edit** | Same as Create (pre-filled) | Read-only if Closed/Cancelled. Read-only for Zoho-imported records |

#### Meals Tab (on recipient profile)

| Screen | Pattern | Notes |
|--------|---------|-------|
| **Index** | Table list | Columns: ID, Stage (colour badge), Provider, Budget + Occurrence, State, Actions |
| **Create** | Modal or slide-over form | Pre-filled recipient + care plan. Provider dropdown with "Other" option |
| **Show** | Detail view | All fields + stage progression controls + stage history timeline |
| **Edit** | Same as Create (pre-filled) | Read-only if Closed/Cancelled. Read-only for Zoho-imported records |

### Stage Progression Controls

The key interaction pattern — a coordinator viewing a request's detail (Show) needs to:

1. **See current stage** prominently with colour badge
2. **See valid next stages** as action buttons (not a dropdown — buttons feel intentional)
3. **Provide required fields** for the transition (e.g., tracking number when moving to "Sent to Recipient")
4. **Confirm the transition** with a simple click (no unnecessary confirmation modal for forward progression)
5. **Cancellation requires a note** — moving to Pending Cancellation shows a reason field

```
┌─────────────────────────────────────────────────┐
│  CC15190 — Cab Charge Request                   │
│  Stage: [■ Ordered]                             │
│                                                 │
│  ┌──────────────────┐  ┌──────────────────────┐ │
│  │ → Sent to Recip. │  │ ⚠ Cancel Request     │ │
│  └──────────────────┘  └──────────────────────┘ │
│                                                 │
│  When "Sent to Recipient" clicked:              │
│  ┌─────────────────────────────────┐            │
│  │ Tracking Number: [____________] │            │
│  │ (optional)       [Confirm Move] │            │
│  └─────────────────────────────────┘            │
└─────────────────────────────────────────────────┘
```

### Historical Record Badge

Zoho-imported records show a subtle badge:

```
┌─────────────────────────────────────────┐
│ 📋 CC14500 — Imported from Zoho         │
│ Stage: Delivered  │  Budget: $100       │
│ ─── This record is read-only ───        │
└─────────────────────────────────────────┘
```

---

## Constraints

### Accessibility
- WCAG Level AA target (Portal standard)
- Keyboard navigation for stage progression buttons
- Stage colours must have sufficient contrast and not rely on colour alone (include text labels)
- Screen reader: stage changes announced via aria-live

### Security & Privacy
- Recipient PII (address, phone, email) follows existing Portal data handling
- Card numbers stored as last 4 digits only (no full card numbers)
- Zoho-imported records respect same access controls as Portal-created records

### Dependencies
- **Depends on**: Recipient profile tab infrastructure (exists), Care Plan model (exists), Pennant feature flags (exists)
- **Blocks**: Phase 2 declaration form, notification system, reporting dashboards
- **Reconcile with**: `feature/meals-module` branch (active development, needs tab refactor)

---

## Edge Cases

| Edge Case | How to Handle | Priority |
|-----------|---------------|----------|
| **No active care plan** | Disable "New Request" button with tooltip: "Recipient has no active care plan" | P1 |
| **Recipient exited/deceased** | Auto-cancel all active requests with system note | P1 |
| **Duplicate active Cab Charge** | Show warning banner but allow creation | P1 |
| **Zoho record with legacy stage** | Map to nearest active stage or show as "Legacy: [original stage]" | P1 |
| **Zoho record with mismatched actual/display values** | Use display_value for presentation, actual_value for data integrity | P2 |
| **Replacement card for already-cancelled request** | Allow — don't filter the "replaces" dropdown to only active requests | P2 |
| **Create form abandoned mid-entry** | No auto-save in v1. Browser confirms navigation away if form is dirty | P2 |
| **Stage moved backward** | Not allowed — stages only progress forward (or to cancellation). Enforce in UI and backend | P1 |
| **Bulk import fails partially** | Log failures, show import report. Successfully imported records are kept | P2 |
| **Empty delivery option on Cab Charge** | Allow save without delivery option — coordinator may not know yet at creation time | P2 |
| **Meal provider "Other" selected** | No secondary "specify provider" field in v1. Just "Other" is sufficient | P3 |
| **Large number of requests per recipient** | Unlikely (typically 1-3). No pagination needed in v1, but sort by most recent | P3 |

---

## Component Reuse

| Component | Existing? | Usage |
|-----------|-----------|-------|
| `CommonTable` | Yes | Request index lists |
| `CommonBadge` | Yes | Stage colour badges |
| `CommonSelectMenu` | Yes | Dropdowns (delivery option, provider, state, etc.) |
| `CommonRadioGroup` | Yes | Yes/No fields (existing customer, phone order authority) |
| `CommonModal` | Yes | Create/Edit forms |
| `CommonDefinitionList` | Yes | Show/detail view field display |
| `CommonTabs` | Yes | Recipient profile tab navigation |
| `CommonEmptyState` | Yes | No requests yet |
| Stage progression buttons | **New** | Forward/cancel action buttons on Show view |
| Stage timeline | **New** | Vertical timeline of stage transitions with duration |
| Historical badge | **New** | "Imported from Zoho" read-only indicator |

---

## UX/UI Decisions (Design Clarification — 2026-02-27)

### Interaction Model

| Decision | Choice | Rationale |
|----------|--------|-----------|
| **Stage transition feedback** | Optimistic update + green toast | Stage badge updates instantly on click. Toast confirms "Moved to [stage]". If server fails, revert with error toast. Feels fast for daily-use coordinators. |
| **Edit flow** | Inline editing on Show page | Click-to-edit fields on the detail view. No separate Edit form/slide-over. Stage field remains read-only (changes only via progression controls). Zoho records stay fully read-only. |
| **Empty state** | Illustration + CTA (`CommonCardEmptyState`) | Centered undraw illustration, "No Cab Charge requests yet" text, and prominent "New Request" button. Matches existing Portal empty state patterns. |
| **Tab loading** | Deferred props + skeleton rows | Inertia v2 `<Deferred>` wrapping tab content. Tab switches instantly, table shows pulsing grey skeleton rows while data loads server-side (200-500ms). |
| **Form validation** | Server-side + field highlight | Standard Laravel Data validation. `CommonFormField` auto-displays red border + error message below each invalid field on submit. No client-side pre-validation in v1. |

### Updated Screen Patterns

| Screen | Pattern | Notes |
|--------|---------|-------|
| **Index** | Table list in `CommonCard` with `<Deferred>` wrapper | Skeleton fallback while loading. Empty state with illustration when no records. |
| **Create** | Right slide-over (`CommonModal side="right"`) | Conditional fields, pre-filled care plan. Server-side validation. |
| **Show** | Standalone detail page with inline editing | Click-to-edit fields, stage progression controls, stage history timeline. Read-only for Zoho imports. |
| **Edit** | ~~Same as Create~~ → Inline on Show page | No separate Edit form. Fields toggle to editable state on the Show page. |

---

## Mockups

Generated 5 HTML mockup screens with TC Portal shell:

| Screen | File | Key Patterns |
|--------|------|-------------|
| CC Index | `mockups/01-cab-charge-index.html` | Profile tabs, table with stage badges, Zoho indicators, duplicate-active warning |
| CC Create | `mockups/02-cab-charge-create.html` | Right slide-over, conditional delivery fields, declaration checkbox, replacement linking |
| CC Show | `mockups/03-cab-charge-show.html` | Stage progression buttons, inline transition fields, stepper, vertical stage timeline |
| Meals Index | `mockups/04-meals-index.html` | Profile tabs, provider/budget/state columns, Zoho indicators |
| Meals Create | `mockups/05-meals-create.html` | Right slide-over, provider dropdown, budget+occurrence, Yes/No radio groups |

---

## Gate 2: Design Handover

**Date**: 2026-02-27
**Status**: PASS

### Checklist Results

- [x] User research complete (User Context table)
- [x] Design principles defined (North Star + 3 supporting)
- [x] Edge cases identified (12 with handling + priority)
- [x] Constraints documented (Accessibility, Security, Dependencies)
- [x] Build size assessed (Medium)
- [x] User stories covered (all 8 from spec)
- [x] Success metrics defined
- [x] Phased rollout planned (MVP vs Deferred, feature flags)
- [x] Key screens mocked up (5 HTML screens)
- [x] Interaction model defined (5 UX/UI decisions)
- [x] Component inventory (8 existing + 3 new)
- [x] Dependencies identified
- [x] Risks documented

### Handover Summary

**What we're building:** Two service request modules (Cab Charge and Meals) that replace Zoho CRM workflows. Both live as tabs on the recipient profile page, with full CRUD, stage-based lifecycle management, and read-only Zoho historical import.

**Key Screens:**
1. **Index** (per module) — Table list with stage badges, Zoho import indicators, empty state with illustration
2. **Create** — Right slide-over form with conditional fields, pre-filled care plan, server-side validation
3. **Show** — Detail page with inline editing, stage progression buttons, vertical stage history timeline

**New Components Needed:**
- Stage progression button bar (forward/cancel actions with inline transition fields)
- Stage history timeline (vertical timeline with duration tracking)
- Historical badge (Zoho read-only indicator)

**Reusing Existing:** CommonTable, CommonBadge, CommonSelectMenu, CommonRadioGroup, CommonModal, CommonDefinitionList, CommonTabs, CommonCardEmptyState

**Critical Decisions:**
- Optimistic updates + toast for stage transitions
- Inline editing on Show page (no separate Edit form)
- Deferred props + skeleton for tab loading
- Server-side validation with field highlighting
- Stages only progress forward (no backward movement)
- Auto-cancel on recipient exit

**Open Questions for Dev:**
- [ ] Event sourcing approach for stage history (custom stored events table vs shared?)
- [ ] Zoho import strategy — bulk migration script or API sync?
- [ ] Reconciliation plan for `feature/meals-module` branch
- [ ] Click-to-edit implementation — custom composable or existing pattern?

**Out of Scope (Deferred):**
- In-Portal declaration form with digital signing
- Email/in-app notifications
- Cross-recipient coordinator dashboard
- Stage aging alerts
- Provider API integration
- Recipient self-service view

---

## Next Steps

- [x] `/trilogy-clarify design` — Refine UX/UI decisions
- [x] `/trilogy-mockup` — UI mapping (5 screens generated)
- [x] `/trilogy-design-handover` — Gate 2 PASS
- [ ] `/speckit-plan` — Technical implementation plan
- [ ] `/trilogy-clarify dev` — Refine technical approach
- [ ] `/speckit-tasks` — Implementation task breakdown
