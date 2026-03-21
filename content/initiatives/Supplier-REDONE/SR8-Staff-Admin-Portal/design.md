---
title: "Design: Staff Admin Portal"
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

Targeted improvements to the existing Inertia-based staff portal: fix the impersonation bug (selecting an active admin instead of a hardcoded owner), add organisation hierarchy visibility, and clean up role labelling. This epic may be deferred entirely — the design is intentionally lightweight, focusing on the minimum changes needed for Phase A (P1 fixes) with optional Phase B enhancements.

**Important context:** SR8 targets the *existing* Inertia/Vue portal (not the new standalone React frontend). These are enhancements to existing pages, not new pages.

---

## User Context

| Aspect | Decision | Rationale |
|--------|----------|-----------|
| **Primary User** | TC Staff (support, operations) | Investigating supplier issues, processing approvals |
| **Device Priority** | Desktop-only | Staff portal is an internal tool |
| **Usage Pattern** | High frequency — staff use the supplier detail page daily |
| **Information Density** | High — staff need full context to make decisions quickly |

---

## Technology Context

| Aspect | Decision |
|--------|----------|
| **Frontend** | Existing Inertia v2 + Vue 3 (TC Portal) |
| **Styling** | Tailwind v3 with existing Common components |
| **API** | Existing Inertia controllers (StaffSupplierController, etc.) |

---

## Phase A vs Phase B Scope

| Phase | Stories | Effort | Status |
|-------|---------|--------|--------|
| **Phase A** — Critical Fixes | US1 (Impersonation), US2 (Org Hierarchy), US3 (Roles) | 3-5 days | Ship first |
| **Phase B** — Enhancements | US4 (Unified Queue), US6 (Stage Context), US7 (Org Search) | 5-8 days | Ship after A or defer |
| **Deferred** | US5 (Coordinator Linkage) | TBD | Blocked on PLA-1312 |

---

## Screen Inventory

### Screen 1 — Impersonation Fix (Phase A)

Current behaviour: Staff clicks "Impersonate" and the system uses a hardcoded owner. If the owner is deactivated, 404 error.

New behaviour: System selects the active admin with a visible indicator of who will be impersonated.

```
┌─────────────────────────────────────────────────────────────────┐
│  Supplier: SafeHome Co                                           │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  Impersonate as:                                           │  │
│  │  ┌───────────────────────────────────────────┐             │  │
│  │  │ ▾  Jane Park (Supplier Administrator)     │             │  │
│  │  └───────────────────────────────────────────┘             │  │
│  │                                                            │  │
│  │  Other active admins:                                      │  │
│  │  • Tom Chen (Supplier Administrator) — active              │  │
│  │                                                            │  │
│  │  [Start Impersonation]           [Cancel]                  │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ── No active admins scenario ──                                │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  ⚠ No active administrators found for this supplier.      │  │
│  │                                                            │  │
│  │  The original owner (M. Smith) is deactivated.             │  │
│  │  [Assign an Administrator]                                 │  │
│  └────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

**Key decisions:**
- Dropdown shows all active admins ranked by role: Org Admin first, then Supplier Admin, then owner. **Name + role only** — no last login date (CLR-UXQ1)
- Default selection is the highest-ranking active admin
- Staff can override the selection if they need to impersonate a specific admin
- When no active admins exist: warning state with explanation and CTA to assign one
- Phase 1 (pre-SR0): Supplier Administrator and active owner only
- Phase 2 (post-SR0): Organisation Administrator added to the top of the fallback chain

### Screen 2 — Organisation Hierarchy Card (Phase A)

An info card added to the existing Supplier Overview tab (`Staff/Suppliers/tabs/SupplierOverview.vue`).

```
┌─────────────────────────────────────────────────────────────────┐
│  Supplier: SafeHome Co — Overview Tab                            │
│                                                                  │
│  ┌── Existing supplier details... ──────────────────────────┐   │
│  │  ABN: 12 345 678 901                                     │   │
│  │  Stage: Approved    Created: 15 Jan 2025                  │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌── Organisation Hierarchy (NEW) ──────────────────────────┐   │
│  │                                                           │   │
│  │  Organisation: SafeHome Group Pty Ltd                     │   │
│  │  ABN: 12 345 678 901                                      │   │
│  │                                                           │   │
│  │  Supplier Entities (3):                                   │   │
│  │  ┌─────────────────────┬───────────┬────────────────────┐ │   │
│  │  │ Entity              │ Stage     │ Compliance         │ │   │
│  │  ├─────────────────────┼───────────┼────────────────────┤ │   │
│  │  │ SafeHome Co ← you   │ ●Approved │ ✅ All clear       │ │   │
│  │  │ SafeHome North ↗    │ ●Approved │ ⚠ 1 doc expiring  │ │   │
│  │  │ SafeHome Regional ↗ │ ○Pending  │ ❌ 3 docs missing  │ │   │
│  │  └─────────────────────┴───────────┴────────────────────┘ │   │
│  │                                                           │   │
│  │  ── Single-entity org ──                                  │   │
│  │  Organisation: Solo Supplier Pty Ltd                      │   │
│  │  ABN: 98 765 432 100                                      │   │
│  │  Only supplier entity under this organisation.            │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

**Key decisions:**
- Collapsible card on the existing Overview tab — no new tab or layout changes (per CQ-2). **Expanded by default for multi-entity orgs; collapsed for single-entity orgs** (CLR-UXQ2)
- Shows org name, ABN, and a table of all sibling supplier entities
- Current entity marked with "you are here" indicator
- Sibling entities are clickable links (navigate to that supplier's detail page)
- Compliance column shows a quick-glance summary (all clear / docs expiring / docs missing)
- Single-entity orgs get a simplified display with "Only supplier entity" text
- Legacy suppliers without org assignment show "Organisation assignment pending" banner (FR-013)

### Screen 3 — Role Labels on Team Tab (Phase A)

Enhancement to the existing Team tab to clearly distinguish roles.

```
┌─────────────────────────────────────────────────────────────────┐
│  Supplier: SafeHome Co — Team Tab                                │
│                                                                  │
│  Team Members                                                    │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │ Name           │ Email              │ Role              │ St │ │
│  ├────────────────┼────────────────────┼───────────────────┼────┤ │
│  │ Jane Park      │ jane@safehome.au   │ 🔷 Org Admin      │ ● │ │
│  │                │                    │   + Owner         │    │ │
│  │ Tom Chen       │ tom@safehome.au    │ 🔹 Supplier Admin │ ● │ │
│  │ Lisa Wang      │ lisa@safehome.au   │ ○  Team Member   │ ● │ │
│  │ Mark Smith     │ mark@safehome.au   │ ○  Team Member   │ ◌ │ │
│  └────────────────┴────────────────────┴───────────────────┴────┘ │
│                                                                  │
│  🔷 = Organisation Administrator  🔹 = Supplier Administrator    │
│  ○ = Team Member  ● = Active  ◌ = Inactive                      │
│                                                                  │
│  [Reassign Org Admin ▾]                                          │
└─────────────────────────────────────────────────────────────────┘
```

**Key decisions:**
- Three distinct role labels with visual icons: Org Admin (filled diamond), Supplier Admin (outline diamond), Team Member (circle)
- Owner designation shown as a sub-label beneath the role — not conflated with the admin role
- Active/inactive status shown with filled/outline dot in the rightmost column
- "Reassign Org Admin" action with confirmation dialog and guard against removing the last Org Admin (FR-006)

### Screen 4 — Unified Approval Queue (Phase B)

Extension of the existing Pending page with type-filter tabs.

```
┌─────────────────────────────────────────────────────────────────┐
│  Pending Approvals                                               │
│                                                                  │
│  ┌─────────────────┬─────────────────┬─────────────────┐        │
│  │ All (24)        │ Documents (18)  │ Stage Updates (6)│        │
│  └─────────────────┴─────────────────┴─────────────────┘        │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ Type     │ Supplier      │ Item           │ Age  │ Action│   │
│  ├──────────┼───────────────┼────────────────┼──────┼───────┤   │
│  │ 📄 Doc   │ SafeHome Co   │ Insurance cert │ 5d   │ Review│   │
│  │ 📄 Doc   │ AccessBuild   │ ABN verify     │ 3d   │ Review│   │
│  │ 📋 Stage │ MedEquip Ltd  │ Pending→Active │ 2d   │ Review│   │
│  │ 📄 Doc   │ CareSupply    │ WWCC upload    │ 1d   │ Review│   │
│  └──────────┴───────────────┴────────────────┴──────┴───────┘   │
│                                                                  │
│  Sorted by age (oldest first)                                    │
│                                                                  │
│  Future: Credentialing tab added when workflow exists (CQ-3)     │
└─────────────────────────────────────────────────────────────────┘
```

**Key decisions:**
- Tab-style filter on the existing Pending page (not a new page)
- Three tabs: All, Documents, Stage Updates — counts shown on each tab
- Default sort: oldest first (to prevent items ageing out)
- **SLA indicator**: rows older than 3 days get an amber background tint — no extra column needed, the "Age" column already shows the number (CLR-UIQ1)
- "Review" action navigates to the appropriate approval view
- Concurrent approval handling: if another staff member already actioned the item, show a "Already actioned by {name}" banner on return (FR-014)

---

## Component Inventory

### Existing Components (TC Portal Common)

| Component | Usage | Variant/Props |
|-----------|-------|---------------|
| `CommonTable` | Team table, approval queue | Existing table component |
| `CommonBadge` | Stage badges, role badges | Colour variants |
| `CommonCard` | Organisation hierarchy card | Collapsible |
| `CommonTabs` | Approval queue type filter | `:items` prop with `title` |
| `CommonSelectMenu` | Impersonation admin picker | `value-key="value"` |
| `CommonDialog` | Reassign confirmation, impersonation confirmation | Default |

### New Components Needed

- **OrgHierarchyCard** — Collapsible card showing org name, ABN, sibling entities with stage/compliance. Reusable for any supplier detail page section.
- **ImpersonationPicker** — Dropdown with active admin list, role labels, and fallback warning state. Replaces the hardcoded impersonation trigger.

---

## Interaction Design

### Editing Pattern

| Aspect | Decision | Details |
|--------|----------|---------|
| **Impersonation** | Dropdown + confirm button | Default to highest-ranking active admin |
| **Role Reassignment** | Action button + confirmation dialog | Guard: cannot remove last Org Admin |
| **Approval Actions** | "Review" link navigates to existing approval view | No inline approval — preserves existing flow |

---

## States

### Empty States

| Context | Message | CTA |
|---------|---------|-----|
| No active admins | "No active administrators found. The original owner is deactivated." | [Assign an Administrator] |
| Single-entity org | "Only supplier entity under this organisation." | — |
| No pending approvals | "All caught up — no pending items." | — |
| Legacy supplier (no org) | "Organisation assignment pending" | — (flagged for migration) |

---

## Open Questions

- [x] ~~Should the impersonation picker show last login date?~~ **No — name + role is sufficient.** Active/inactive is already filtered. (CLR-UXQ1)
- [x] ~~Should the unified queue have SLA indicators?~~ **Yes — amber row background for items > 3 days old.** (CLR-UIQ1)
- [ ] Will the Organisation Administrator role from SR0 require any changes to the hierarchy card, or is it additive?

---

## Clarification Log

| ID | Phase | Question | Decision | Rationale |
|----|-------|----------|----------|-----------|
| CLR-UXQ1 | UX | Impersonation picker: show last login date? | **No — name + role only** | Selection defaults to highest-ranking active admin; last login adds clutter for minimal value |
| CLR-UXQ2 | UX | Org hierarchy card: collapsed or expanded by default? | **Expanded for multi-entity, collapsed for single-entity** | Multi-entity orgs are the reason the card exists; single-entity has nothing interesting to show |
| CLR-UIQ1 | UI | Phase B unified queue: SLA indicators? | **Amber row background for items > 3 days** | Low-effort visual urgency; the Age column already provides the number |

---

## Approval

| Role | Name | Date | Status |
|------|------|------|--------|
| Product Manager | | | [ ] Approved |
| Developer | | | [ ] Approved |
