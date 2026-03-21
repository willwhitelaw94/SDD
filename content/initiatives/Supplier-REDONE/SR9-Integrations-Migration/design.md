---
title: "Design: Integrations & Migration"
---

**Status:** Draft
**Feature Spec:** [spec.md](spec.md)
**Created:** 2026-03-19
**Last Updated:** 2026-03-19

---

## Design Resources

### LOOM Videos

| Title | Link | Description |
|-------|------|-------------|
| | | |

### Figma

| File | Link | Description |
|------|------|-------------|
| | | |

### Miro

| Board | Link | Description |
|-------|------|-------------|
| | | |

---

## Overview

SR9 is predominantly backend — Zoho sync, MYOB mapping, EFTSure verification, data migration scripts, and compliance register automation all run server-side with no dedicated UI. The design scope covers only the **migration UI surfaces**: the feature flag toggle for portal routing, the portal routing indicator visible to suppliers, the migration status dashboard for TC staff, and the kill switch interface.

---

## User Context

| Aspect | Decision | Rationale |
|--------|----------|-----------|
| **Primary User (Migration UI)** | TC Staff (ops, engineering) | Toggle feature flags, monitor migration, activate kill switch |
| **Secondary User** | Supplier | Sees the portal routing indicator banner |
| **Device Priority** | Desktop-only | Internal admin tooling |
| **Usage Pattern** | Infrequent — migration is a one-time process, kill switch is emergency-only |
| **Information Density** | Low — dashboard-style summary, not data-heavy |

---

## Technology Context

| Aspect | Decision |
|--------|----------|
| **Feature Flags** | Laravel Pennant (`SupplierNewPortal` feature class) |
| **Migration Scripts** | Artisan commands with `--batch-size` / `--offset` flags |
| **Kill Switch** | Pennant override: `Feature::deactivateForEveryone()` (global) or `Feature::for($supplier)->deactivate()` (per-supplier) |
| **Admin Interface** | Laravel Nova for flag management; lightweight Inertia page for migration dashboard |

---

## Design Scope

| Surface | Audience | Location | Priority |
|---------|----------|----------|----------|
| Feature flag toggle | TC Staff | Nova admin panel | P1 |
| Portal routing indicator | Supplier | New portal banner | P1 |
| Migration status dashboard | TC Staff | Staff portal (Inertia page) | P1 |
| Kill switch UI | TC Staff | Nova admin panel + migration dashboard | P1 |

---

## Screen Inventory

### Screen 1 — Portal Routing Indicator (Supplier-Facing)

A persistent banner shown to suppliers who have been routed to the new standalone portal. Provides context and a feedback channel.

```
┌─────────────────────────────────────────────────────────────────┐
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │  🟢  You are using the new Supplier Portal.                 │ │
│ │      If you experience any issues, contact support.    [×]  │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  ┌── Rest of the new portal page content ──────────────────┐   │
│  │                                                          │   │
│  │  ... supplier dashboard, profile, etc. ...               │   │
│  │                                                          │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

**Key decisions:**
- Teal `#007F7E` background with white text — matches TC brand accent
- **Dismissible** (stores dismissal in localStorage so it does not reappear) — no time limit or expiry; user-controlled (CLR-UXQ2)
- "Contact support" links to the existing support channel
- Only shown on the new portal — legacy Inertia portal does not show any banner
- No banner shown to suppliers who have not been migrated (they stay on legacy)

### Screen 2 — Feature Flag Toggle (Nova Admin)

Managed through Laravel Nova. The `SupplierNewPortal` Pennant feature is exposed as a Nova resource with per-supplier toggle capability.

```
┌─────────────────────────────────────────────────────────────────┐
│  Nova — Feature Flags                                            │
│                                                                  │
│  SupplierNewPortal                                               │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │                                                            │  │
│  │  Global State:  ○ Off (default)                            │  │
│  │                                                            │  │
│  │  Per-Supplier Overrides:                                   │  │
│  │  ┌──────────────────────┬──────────┬──────────────────┐   │  │
│  │  │ Supplier             │ State    │ Changed           │   │  │
│  │  ├──────────────────────┼──────────┼──────────────────┤   │  │
│  │  │ SafeHome Co          │ ● On     │ 15 Mar 2026      │   │  │
│  │  │ MedEquip Pty Ltd     │ ● On     │ 14 Mar 2026      │   │  │
│  │  │ AccessBuild          │ ○ Off    │ (global default)  │   │  │
│  │  └──────────────────────┴──────────┴──────────────────┘   │  │
│  │                                                            │  │
│  │  New Registrations:  ● On (route to new portal)            │  │
│  │                                                            │  │
│  │  [Activate for All]  [Deactivate for All (Kill Switch)]   │  │
│  └────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

**Key decisions:**
- Pennant features managed via Nova resource (existing pattern)
- Global state toggle: Off by default (existing suppliers stay on legacy)
- Per-supplier overrides: toggle individual suppliers to the new portal for wave-based migration
- New registrations toggle: separate flag for routing new signups to the new portal (FR-013)
- "Activate for All" = `Feature::activateForEveryone()` — full cutover
- "Deactivate for All" = `Feature::deactivateForEveryone()` — global kill switch (FR-014)
- Both global actions require a confirmation dialog with "type CONFIRM to proceed" pattern

### Screen 3 — Migration Status Dashboard (Staff-Facing)

A lightweight Inertia page in the staff portal showing migration progress. Aggregates data from the `role_migrated_at` timestamp on suppliers.

```
┌─────────────────────────────────────────────────────────────────┐
│  Staff Portal — Migration Dashboard                              │
│                                                                  │
│  Role Migration Progress                                         │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │                                                            │  │
│  │  Total Suppliers: 13,247                                   │  │
│  │  Migrated:        8,932  (67%)                             │  │
│  │  Pending:         4,102  (31%)                             │  │
│  │  Flagged:           213  ( 2%)                             │  │
│  │                                                            │  │
│  │  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 67%             │  │
│  │  ██████████████████████████░░░░░░░░░░░░░░                  │  │
│  │  migrated                  pending    flagged              │  │
│  │                                                            │  │
│  │  Last batch: 15 Mar 2026 — 500 processed, 3 flagged       │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
│  Portal Routing                                                  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │                                                            │  │
│  │  New Portal:     1,247 suppliers  (9%)                     │  │
│  │  Legacy Portal: 12,000 suppliers (91%)                     │  │
│  │                                                            │  │
│  │  New Registrations: Routed to new portal ●                 │  │
│  │                                                            │  │
│  │  [View Flag Overrides in Nova ↗]                           │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
│  Kill Switch                                                     │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │                                                            │  │
│  │  Status: ● Inactive (all systems normal)                   │  │
│  │                                                            │  │
│  │  [Activate Global Kill Switch]                             │  │
│  │                                                            │  │
│  │  ⚠ This will route ALL suppliers back to the legacy       │  │
│  │    portal on their next request. In-flight transactions    │  │
│  │    are not affected. Takes effect within 30 seconds.       │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
│  Flagged for Review                                              │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Supplier         │ Issue                    │ Action        │  │
│  ├──────────────────┼──────────────────────────┼───────────────┤  │
│  │ ABC Services     │ Ambiguous ownership      │ [Resolve ↗]  │  │
│  │ XYZ Holdings     │ Circular owner reference │ [Resolve ↗]  │  │
│  │ 123 Care Ltd     │ No active owner          │ [Resolve ↗]  │  │
│  └──────────────────┴──────────────────────────┴───────────────┘  │
│                                                                  │
│  Integration Health                                              │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  Zoho CRM Sync:      ● Healthy   (last sync: 2 min ago)  │  │
│  │  MYOB Vendor Map:     ● Healthy   (0 broken mappings)     │  │
│  │  EFTSure Verify:      ● Healthy   (last check: 5 min ago)│  │
│  │  Search Index:        ● Healthy   (in sync)               │  │
│  └────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

**Key decisions:**
- Single-page dashboard with four sections: migration progress, portal routing, kill switch, flagged cases
- **Dashboard visible to all staff; kill switch restricted to admin role** via Gate/policy (CLR-UXQ1)
- Progress bar shows three segments: migrated (teal), pending (grey), flagged (amber)
- Kill switch is a prominent red-outlined button with a confirmation dialog requiring "CONFIRM" text input
- "Flagged for Review" table links to the supplier detail page where staff can resolve ambiguous cases
- Integration health section shows **status dot + last activity timestamp** only — link to Horizon for deeper investigation (CLR-UIQ1). No queue depth or failure counts on this page
- "View Flag Overrides in Nova" links to the Nova Pennant management page
- Dashboard data is read-only — all mutations happen via Nova (flags) or Artisan commands (migration batches)

### Screen 4 — Kill Switch Confirmation Dialog

The critical confirmation flow for the global kill switch.

```
┌─────────────────────────────────────────────────────────────────┐
│  ┌────────────────────────────────────────────────────────────┐  │
│  │                                                            │  │
│  │  ⚠ Activate Global Kill Switch                            │  │
│  │                                                            │  │
│  │  This will immediately route ALL suppliers (1,247          │  │
│  │  currently on new portal) back to the legacy Inertia       │  │
│  │  portal on their next request.                             │  │
│  │                                                            │  │
│  │  • In-flight transactions will complete normally           │  │
│  │  • Takes effect within 30 seconds                          │  │
│  │  • No data will be lost                                    │  │
│  │  • Can be reversed by deactivating the kill switch         │  │
│  │                                                            │  │
│  │  Type CONFIRM to proceed:                                  │  │
│  │  ┌────────────────────────────┐                            │  │
│  │  │                            │                            │  │
│  │  └────────────────────────────┘                            │  │
│  │                                                            │  │
│  │  [Cancel]                    [Activate Kill Switch]        │  │
│  │                               (disabled until confirmed)   │  │
│  └────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

**Key decisions:**
- Destructive action pattern: text-input confirmation required
- "Activate Kill Switch" button is disabled until "CONFIRM" is typed
- Red button styling for the destructive action
- Summary of impact: how many suppliers affected, what happens, what does not happen
- After activation: dashboard refreshes to show "Kill Switch: ACTIVE" with a red status indicator and a "Deactivate" button

---

## Component Inventory

### Existing Components (TC Portal Common)

| Component | Usage | Variant/Props |
|-----------|-------|---------------|
| `CommonCard` | Dashboard sections | Default |
| `CommonTable` | Flagged cases list | Default |
| `CommonBadge` | Integration health status | Green/amber/red variants |
| `CommonDialog` | Kill switch confirmation | Destructive variant |
| `CommonProgress` | Migration progress bar | Teal colour |

### New Components Needed

- **MigrationProgressBar** — Three-segment progress bar (migrated/pending/flagged) with counts and percentages. Uses teal/grey/amber segments.
- **IntegrationHealthIndicator** — Row component showing integration name, status dot, and last activity timestamp. Green/amber/red states.

---

## Interaction Design

### Data Display

| Aspect | Decision | Details |
|--------|----------|---------|
| **View Type** | Dashboard (read-only summary) | Single page with card sections |
| **Data Refresh** | Auto-refresh every 60 seconds | Polling for migration progress and integration health |
| **Filtering** | Flagged cases only — no complex filtering needed | — |

### Editing Pattern

| Aspect | Decision | Details |
|--------|----------|---------|
| **Feature Flag Toggle** | Via Nova (not on dashboard) | Dashboard links to Nova |
| **Kill Switch** | Button on dashboard + confirmation dialog | "Type CONFIRM" pattern |
| **Migration Execution** | Via Artisan CLI (not UI) | Dashboard is monitoring-only |
| **Flagged Case Resolution** | Link to supplier detail page | Resolved via existing staff supplier tools |

---

## States

### Loading States

| Context | Treatment |
|---------|-----------|
| Dashboard load | Skeleton blocks for each section |
| Integration health check | Spinner on individual health indicators |

### Empty States

| Context | Message | CTA |
|---------|---------|-----|
| No flagged cases | "No suppliers flagged for review" | — |
| Migration not started | "Role migration has not been run yet. Run the migration Artisan command to begin." | — |
| No suppliers on new portal | "No suppliers have been routed to the new portal yet" | [View Flag Management in Nova] |

### Error States

| Context | Treatment |
|---------|-----------|
| Integration unhealthy | Amber/red badge with "Last successful: {time}" and link to Horizon job monitoring |
| Kill switch active | Red banner at top of dashboard: "KILL SWITCH ACTIVE — all suppliers on legacy portal" |

---

## Colour Mapping

| State | Colour | Usage |
|-------|--------|-------|
| Healthy / Migrated / Active | Teal `#007F7E` | Progress bars, health indicators |
| Pending / In Progress | Grey `#6B7280` | Pending migration segment |
| Flagged / Warning | Amber `#F59E0B` | Flagged cases, integration warnings |
| Kill Switch Active / Error | Red `#DC2626` | Kill switch banner, integration errors |
| Legacy Portal | Navy `#2C4C79` | Portal routing indicator |
| New Portal | Teal `#007F7E` | Portal routing indicator |

---

## Open Questions

- [x] ~~Should the migration dashboard be restricted?~~ **Dashboard visible to all staff; kill switch restricted to admin role.** (CLR-UXQ1)
- [x] ~~Should the portal routing banner be time-limited?~~ **No — dismissible via localStorage, user-controlled.** (CLR-UXQ2)
- [x] ~~Should integration health include queue depth?~~ **No — status dot + last activity only. Link to Horizon for details.** (CLR-UIQ1)

---

## Clarification Log

| ID | Phase | Question | Decision | Rationale |
|----|-------|----------|----------|-----------|
| CLR-UXQ1 | UX | Migration dashboard access: role-restricted or open? | **Dashboard open to all staff; kill switch admin-only** | Dashboard is read-only monitoring; all staff benefit. Kill switch is destructive — requires admin Gate |
| CLR-UXQ2 | UX | Portal routing banner: time-limited or permanent? | **Dismissible (localStorage), no expiry** | Simplest approach; respects user agency; no server-side date tracking needed |
| CLR-UIQ1 | UI | Integration health: minimal or detailed? | **Status dot + last activity + link to Horizon** | Dashboard is monitoring overview, not debugging tool. Horizon for deeper investigation |

---

## Approval

| Role | Name | Date | Status |
|------|------|------|--------|
| Product Manager | | | [ ] Approved |
| Developer | | | [ ] Approved |
