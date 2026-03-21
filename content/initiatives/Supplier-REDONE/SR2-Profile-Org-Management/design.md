---
title: "Design: Profile & Organisation Management"
---

**Status:** Draft
**Designer:** Bruce (AI)
**Feature Spec:** [SR2 spec.md](/initiatives/supplier-redone/sr2-profile-org-management/spec)
**Created:** 2026-03-19
**Last Updated:** 2026-03-19

---

## Overview

Supplier organisations need a single place to manage all their entities, people, documents, and payment details. This design creates a master-detail pattern: an organisation dashboard shows all supplier entities at a glance, with drill-through into tabbed profile sections for each entity. An always-visible account switcher lets multi-supplier users change context without losing their place.

---

## Design Resources

_No external design resources yet. ASCII wireframes below serve as the initial design reference._

---

## User Context

| Aspect | Decision | Rationale |
|--------|----------|-----------|
| **Primary User** | Organisation Administrator / Supplier Administrator | Manages business profiles, compliance, team |
| **Device Priority** | Desktop-primary, tablet-functional | Admin workflows — data entry, document upload, table review |
| **Usage Pattern** | Weekly maintenance, daily during onboarding | Profile setup is intensive, then periodic updates |
| **Information Density** | Dense-efficient | Admins need to see compliance status, counts, and actions at a glance |

---

## Layout & Structure

### Page Type

Master-detail with tabbed sub-sections.

### Navigation Pattern

- **Global**: Sidebar navigation (shared across portal)
- **Organisation level**: Card grid dashboard
- **Supplier level**: Horizontal tab bar (Business Details | Locations | Team | Documents | Bank Details)
- **Account switcher**: Dropdown in the global header, always visible for multi-supplier users

### Information Architecture

```
Organisation Dashboard (card grid)
  └── Supplier Entity (selected via card click or account switcher)
        ├── Business Details (tab)
        ├── Locations (tab)
        ├── Team (tab)
        ├── Documents (tab)
        └── Bank Details (tab)
```

---

## Wireframes

### 1. Organisation Dashboard

The landing page for Organisation Administrators. Shows all supplier entities under the ABN as cards with compliance status badges and summary metrics.

```
┌─────────────────────────────────────────────────────────────────────────┐
│  [Logo]  Supplier Portal          [🔽 Switch: Acme Allied Health ▾]  [👤] │
├────────┬────────────────────────────────────────────────────────────────┤
│        │                                                                │
│  Nav   │  Organisation Dashboard                                        │
│        │  Acme Health Group · ABN 12 345 678 901                       │
│ Dash   │                                                                │
│ Profile│  ┌──────────────────────┐  ┌──────────────────────┐           │
│ Pricing│  │  Acme Allied Health  │  │  Acme Nursing        │           │
│ Billing│  │                      │  │                      │           │
│ Docs   │  │  ● Compliant         │  │  ▲ Expiring (2 docs) │           │
│        │  │  Workers: 12         │  │  Workers: 8          │           │
│        │  │  Locations: 3        │  │  Locations: 2        │           │
│        │  │  Pending: 0          │  │  Pending: 2          │           │
│        │  │                      │  │                      │           │
│        │  │  [Manage →]          │  │  [Manage →]          │           │
│        │  └──────────────────────┘  └──────────────────────┘           │
│        │                                                                │
│        │  ┌──────────────────────┐                                      │
│        │  │  ╋ Add Supplier      │                                      │
│        │  │    Entity            │                                      │
│        │  │                      │                                      │
│        │  │  (dashed border)     │                                      │
│        │  └──────────────────────┘                                      │
│        │                                                                │
└────────┴────────────────────────────────────────────────────────────────┘
```

**Notes:**
- Compliance badge colours: `● Compliant` = green, `▲ Expiring` = amber, `✕ Non-compliant` = red
- Badge is document-driven per FR-011
- "Add Supplier Entity" card only visible to Organisation Administrators (FR-017)
- Single-entity orgs still see the dashboard with one card + the add button (AC 1.3)
- Supplier Administrators are redirected to their single supplier's profile (AC 1.4)

---

### 2. Account Switcher (Header Dropdown)

Always visible in the global header for users with 2+ supplier entities. Hidden for single-entity users.

```
┌─────────────────────────────────────────────────────────────────┐
│  [Logo]  Supplier Portal      [🔽 Acme Allied Health ▾]  [👤]  │
│                                ┌──────────────────────────┐     │
│                                │  Acme Allied Health  ✓   │     │
│                                │  ● Compliant             │     │
│                                ├──────────────────────────┤     │
│                                │  Acme Nursing            │     │
│                                │  ▲ Expiring              │     │
│                                ├──────────────────────────┤     │
│                                │  Acme Physio             │     │
│                                │  ● Compliant             │     │
│                                ├──────────────────────────┤     │
│                                │  ← Back to Dashboard     │     │
│                                └──────────────────────────┘     │
└─────────────────────────────────────────────────────────────────┘
```

**Notes:**
- Dropdown shows compliance badge beside each entity name
- Current entity has a checkmark
- Switching updates all page data without navigation (FR-002, AC 2.4)
- "Back to Dashboard" link returns to the org overview
- System remembers last-selected entity for next login (FR-003)

---

### 3. Supplier Profile — Business Details Tab

The default tab when managing a supplier entity. Organisation fields are read-only, supplier fields are editable inline.

```
┌─────────────────────────────────────────────────────────────────────────┐
│  [Logo]  Supplier Portal          [🔽 Acme Allied Health ▾]  [👤]      │
├────────┬────────────────────────────────────────────────────────────────┤
│        │                                                                │
│  Nav   │  Acme Allied Health                                           │
│        │  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │
│        │  [Business Details]  Locations  Team  Documents  Bank Details  │
│        │                                                                │
│        │  ┌─ Organisation Details (read-only) ─────────────────────┐   │
│        │  │                                                        │   │
│        │  │  ABN              12 345 678 901        🔒             │   │
│        │  │  Legal Name       Acme Health Group Pty Ltd  🔒        │   │
│        │  │  GST Registered   Yes                   🔒             │   │
│        │  │                                                        │   │
│        │  └────────────────────────────────────────────────────────┘   │
│        │                                                                │
│        │  ┌─ Supplier Details ─────────────────────────────────────┐   │
│        │  │                                                        │   │
│        │  │  Trading Name     [Acme Allied Health          ]       │   │
│        │  │  Contact Email    [admin@acmeallied.com.au     ]       │   │
│        │  │  Phone            [03 9876 5432                ]       │   │
│        │  │  Service Types    [Allied Health ✕] [Nursing ✕] [+]   │   │
│        │  │                                                        │   │
│        │  │                          [Cancel]  [Save Changes]      │   │
│        │  └────────────────────────────────────────────────────────┘   │
│        │                                                                │
└────────┴────────────────────────────────────────────────────────────────┘
```

**Notes:**
- Organisation section has a lock icon and grey background to signal read-only
- Supplier section uses standard form inputs
- Service types use a tag/chip input with removable items
- Field-level validation on blur (AC 3.4)
- Optimistic concurrency: if another admin saved changes, show conflict toast on save (Edge Case)

---

### 4. Supplier Profile — Locations Tab

Card-based list of locations with primary badge. Add/edit via slide-over drawer.

```
┌─────────────────────────────────────────────────────────────────────────┐
│  [Logo]  Supplier Portal          [🔽 Acme Allied Health ▾]  [👤]      │
├────────┬────────────────────────────────────────────────────────────────┤
│        │                                                                │
│  Nav   │  Acme Allied Health                                           │
│        │  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │
│        │  Business Details  [Locations]  Team  Documents  Bank Details  │
│        │                                                                │
│        │  Locations (3)                          [+ Add Location]       │
│        │                                                                │
│        │  ┌──────────────────────────────────────────────────────┐     │
│        │  │  📍 123 Collins St, Melbourne VIC 3000    ★ Primary  │     │
│        │  │  Phone: 03 9876 5432 · Email: mel@acme.com.au       │     │
│        │  │                                      [Edit] [Delete] │     │
│        │  └──────────────────────────────────────────────────────┘     │
│        │  ┌──────────────────────────────────────────────────────┐     │
│        │  │  📍 456 George St, Sydney NSW 2000                   │     │
│        │  │  Phone: 02 1234 5678 · Email: syd@acme.com.au       │     │
│        │  │                        [Set Primary] [Edit] [Delete] │     │
│        │  └──────────────────────────────────────────────────────┘     │
│        │  ┌──────────────────────────────────────────────────────┐     │
│        │  │  📍 789 Adelaide St, Brisbane QLD 4000                │     │
│        │  │  Phone: 07 9876 1234 · Email: bne@acme.com.au       │     │
│        │  │                        [Set Primary] [Edit] [Delete] │     │
│        │  └──────────────────────────────────────────────────────┘     │
│        │                                                                │
└────────┴────────────────────────────────────────────────────────────────┘
```

**Notes:**
- Primary location has a star badge, no "Set Primary" or "Delete" button
- Delete is blocked on the last remaining location (AC 4.3) — button disabled with tooltip
- "Add Location" opens a drawer/slide-over with address fields and a map preview (Google Places autocomplete)
- Cards are scoped per supplier entity — no cross-supplier leakage (FR-005)

---

### 5. Supplier Profile — Team Tab

Table of workers with status badges. Invite via modal dialog.

```
┌─────────────────────────────────────────────────────────────────────────┐
│  [Logo]  Supplier Portal          [🔽 Acme Allied Health ▾]  [👤]      │
├────────┬────────────────────────────────────────────────────────────────┤
│        │                                                                │
│  Nav   │  Acme Allied Health                                           │
│        │  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │
│        │  Business Details  Locations  [Team]  Documents  Bank Details  │
│        │                                                                │
│        │  Team Members (12)                       [+ Invite Member]     │
│        │                                                                │
│        │  ┌────────────────────────────────────────────────────────┐   │
│        │  │ Name          Role       Locations   Status   Actions  │   │
│        │  ├────────────────────────────────────────────────────────┤   │
│        │  │ Jane Smith    Admin      All         ● Active   [···] │   │
│        │  │ Bob Lee       Worker     Melbourne   ● Active   [···] │   │
│        │  │ Sarah Chen    Worker     Sydney      ◐ Pending  [···] │   │
│        │  │ Tom Green     Worker     Brisbane    ○ Inactive [···] │   │
│        │  └────────────────────────────────────────────────────────┘   │
│        │                                                                │
│        │  Showing 1-4 of 12                         [< 1 2 3 >]        │
│        │                                                                │
└────────┴────────────────────────────────────────────────────────────────┘
```

**Invite Modal:**

```
┌──────────────────────────────────────────┐
│  Invite Team Member                   ✕  │
├──────────────────────────────────────────┤
│                                          │
│  Email        [                       ]  │
│  Role         [Worker           ▾    ]   │
│  Locations    [Melbourne ✕] [Sydney ✕]   │
│  Services     [Allied Health ✕]          │
│                                          │
│              [Cancel]  [Send Invite]     │
└──────────────────────────────────────────┘
```

**Notes:**
- Three-dot menu on each row: Edit, Remove (with confirmation)
- Cannot remove the last admin — action is disabled with tooltip (FR-009)
- Pending members show a dimmed row with "Resend Invite" in the menu
- Status colours: Active = green, Pending = amber, Inactive = grey

---

### 6. Supplier Profile — Documents Tab

Two sections: Organisation Documents (shared, read-only for Supplier Admins) and Supplier Documents (entity-scoped, editable).

```
┌─────────────────────────────────────────────────────────────────────────┐
│  [Logo]  Supplier Portal          [🔽 Acme Allied Health ▾]  [👤]      │
├────────┬────────────────────────────────────────────────────────────────┤
│        │                                                                │
│  Nav   │  Acme Allied Health                                           │
│        │  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │
│        │  Business Details  Locations  Team  [Documents]  Bank Details  │
│        │                                                                │
│        │  ┌─ Organisation Documents (shared across all entities) ──┐   │
│        │  │                                                        │   │
│        │  │  Type              Expiry       Status     Actions     │   │
│        │  │  ──────────────────────────────────────────────────    │   │
│        │  │  Public Liability  2026-08-15   ● Approved  [View]    │   │
│        │  │  Workers Comp      2026-04-10   ▲ Expiring  [View]    │   │
│        │  │  ABN Verification  N/A          ● Approved  [View]    │   │
│        │  │                                                        │   │
│        │  │  🔒 Managed by Organisation Administrator              │   │
│        │  └────────────────────────────────────────────────────────┘   │
│        │                                                                │
│        │  ┌─ Supplier Documents ───────────────────────────────────┐   │
│        │  │                                           [+ Upload]   │   │
│        │  │  Type              Expiry       Status     Actions     │   │
│        │  │  ──────────────────────────────────────────────────    │   │
│        │  │  Prof. Indemnity   2026-12-01   ● Approved  [···]     │   │
│        │  │  NDIS Cert         2026-04-05   ▲ Expiring  [···]     │   │
│        │  │  ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─    │   │
│        │  │  ┌──────────────────────────────────────────────┐     │   │
│        │  │  │  📂 Drag and drop files here, or [Browse]    │     │   │
│        │  │  │     PDF, JPG, PNG up to 10MB                 │     │   │
│        │  │  └──────────────────────────────────────────────┘     │   │
│        │  └────────────────────────────────────────────────────────┘   │
│        │                                                                │
└────────┴────────────────────────────────────────────────────────────────┘
```

**Notes:**
- Organisation Documents section is read-only for Supplier Admins, editable for Org Admins (FR-010)
- Expiry warnings: amber badge + row highlight for docs within 30 days (FR-011)
- Expired docs: red badge, row highlight, rolls up to dashboard compliance status
- Upload zone supports drag-and-drop with file type and size validation (AC 6.4)
- New uploads enter "Pending Review" status
- Three-dot menu: View, Replace, Delete

---

### 7. Supplier Profile — Bank Details Tab

Masked account numbers with reveal toggle. Confirmation dialog for changes.

```
┌─────────────────────────────────────────────────────────────────────────┐
│  [Logo]  Supplier Portal          [🔽 Acme Allied Health ▾]  [👤]      │
├────────┬────────────────────────────────────────────────────────────────┤
│        │                                                                │
│  Nav   │  Acme Allied Health                                           │
│        │  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │
│        │  Business Details  Locations  Team  Documents  [Bank Details]  │
│        │                                                                │
│        │  Bank Accounts                          [+ Add Bank Account]  │
│        │                                                                │
│        │  ┌──────────────────────────────────────────────────────┐     │
│        │  │  Commonwealth Bank                       ★ Primary   │     │
│        │  │  BSB: 063-000                                        │     │
│        │  │  Account: ●●●● ●●●● 4521          [👁 Reveal]       │     │
│        │  │  Name: Acme Health Group Pty Ltd                     │     │
│        │  │  Status: ● Verified (EFTSure)                        │     │
│        │  │                                          [Edit]      │     │
│        │  └──────────────────────────────────────────────────────┘     │
│        │  ┌──────────────────────────────────────────────────────┐     │
│        │  │  Westpac                                              │     │
│        │  │  BSB: 032-000                                        │     │
│        │  │  Account: ●●●● ●●●● 7890          [👁 Reveal]       │     │
│        │  │  Name: Acme Health Group Pty Ltd                     │     │
│        │  │  Status: ◐ Pending Verification                      │     │
│        │  │                    [Set Primary] [Edit] [Delete]     │     │
│        │  └──────────────────────────────────────────────────────┘     │
│        │                                                                │
└────────┴────────────────────────────────────────────────────────────────┘
```

**Confirmation Dialog (on BSB/Account Number change):**

```
┌──────────────────────────────────────────────┐
│  ⚠️  Confirm Bank Detail Change           ✕  │
├──────────────────────────────────────────────┤
│                                              │
│  You are changing the BSB or account number  │
│  for this bank account. This will:           │
│                                              │
│  • Trigger a new EFTSure verification        │
│  • Payments continue to the previous account │
│    until the new details are verified         │
│                                              │
│  Are you sure you want to proceed?           │
│                                              │
│          [Cancel]  [Yes, Update Details]      │
└──────────────────────────────────────────────┘
```

**Notes:**
- Account numbers masked by default, "Reveal" toggle shows full number (FR-014)
- Changing BSB or account number triggers confirmation dialog (FR-013)
- EFTSure verification status: Verified = green, Pending = amber (edge case)
- Primary account has a star badge, cannot be deleted without setting another as primary
- "Add Bank Account" opens a form drawer with BSB, account number, account name fields

---

## Component Inventory

### Existing Components (shadcn/ui)

| Component | Usage | Variant |
|-----------|-------|---------|
| Card | Dashboard supplier cards, location cards, bank detail cards | default |
| Badge | Compliance status, worker status, document status | green/amber/red/grey variants |
| Button | All actions | primary (navy), secondary (outline), destructive (red) |
| Table | Team members list, documents list | with sorting |
| Dialog | Invite modal, confirmation dialogs | default |
| DropdownMenu | Account switcher, row action menus | default |
| Tabs | Supplier profile sections | default |
| Input / Select | All form fields | default |
| Sheet (Drawer) | Add/edit location, add bank account | side="right" |
| Tooltip | Disabled action explanations | default |

### New Components Needed

- **AccountSwitcher** — Header dropdown combining entity list with compliance badges and dashboard link. Wraps shadcn DropdownMenu.
- **ComplianceBadge** — Reusable badge with icon + text for Compliant/Expiring/Non-compliant states. Used on dashboard cards, switcher, and document rows.
- **MaskedField** — Input display that shows masked value with a reveal toggle. Used for bank account numbers.
- **FileDropzone** — Drag-and-drop upload area with file type/size validation. Used on Documents tab.

---

## Interaction Design

### Data Display

| Aspect | Decision | Details |
|--------|----------|---------|
| **Dashboard View** | Card grid | 2-3 columns responsive, 1 on mobile |
| **Default Sort** | Alphabetical by trading name | Dashboard cards |
| **Filtering** | None on dashboard (small entity count) | Team table has status filter |
| **Pagination** | Numbered pages | Team table (12+ workers) |
| **Row Actions** | Three-dot dropdown menu | Team and Documents tables |

### Editing Pattern

| Aspect | Decision | Details |
|--------|----------|---------|
| **Edit Method** | Inline form (Business Details), Drawer (Locations, Bank), Modal (Team invite) | Matches complexity of each section |
| **Validation** | Inline on blur + submit-time | Field-level errors below each input |
| **Save Feedback** | Wait-for-server with toast | Success/error toast notification |
| **Unsaved Warning** | Yes for Business Details form | Browser beforeunload + in-app prompt |

### Special Interactions

| Feature | Needed? | Details |
|---------|---------|---------|
| Bulk actions | No | Entity counts are small enough for individual actions |
| Drag & drop | Yes | Document upload only |
| Search | No | Small data sets per entity |
| Keyboard shortcuts | No | Standard form navigation sufficient |
| Real-time updates | No | Polling not needed — data changes infrequently |

---

## States

### Loading States

| Context | Treatment | Duration Threshold |
|---------|-----------|-------------------|
| Dashboard cards | Skeleton card placeholders (2-3) | Show after 200ms |
| Tab content | Skeleton matching section layout | Show after 200ms |
| Account switch | Spinner overlay on content area | Immediate |
| Button actions | Spinner in button, disable | Immediate |

### Empty States

| Context | Message | CTA |
|---------|---------|-----|
| No locations | "No locations added yet. Add your first location to get started." | [+ Add Location] |
| No team members | "No team members yet. Invite your first team member." | [+ Invite Member] |
| No documents | "No documents uploaded. Upload compliance documents to maintain your status." | [+ Upload Document] |
| No bank accounts | "No bank accounts added. Add payment details to receive payments." | [+ Add Bank Account] |

### Edge Cases

| Scenario | Handling |
|----------|----------|
| Very long trading name | Truncate with ellipsis on dashboard cards, full on profile |
| Concurrent edit conflict | Toast: "These details were updated by another user. Please refresh." |
| Permission denied (Supplier Admin on org docs) | Section shows read-only with lock icon and explanation |
| Last admin removal blocked | Button disabled, tooltip: "At least one administrator must remain" |
| Last location deletion blocked | Button disabled, tooltip: "At least one location is required" |

---

## Responsive Behavior

### Desktop (1024px+)

- Full sidebar navigation visible
- Dashboard: 3-column card grid
- Profile: sidebar + full-width tabbed content
- Tables show all columns
- Drawer slides in from right (480px wide)

### Tablet (768-1023px)

```
┌─────────────────────────────────────────────┐
│  [☰]  Supplier Portal  [Acme Allied ▾] [👤] │
├─────────────────────────────────────────────┤
│                                             │
│  Organisation Dashboard                      │
│                                             │
│  ┌───────────────────┐ ┌───────────────────┐│
│  │ Acme Allied       │ │ Acme Nursing      ││
│  │ ● Compliant       │ │ ▲ Expiring        ││
│  │ Workers: 12       │ │ Workers: 8        ││
│  │ [Manage →]        │ │ [Manage →]        ││
│  └───────────────────┘ └───────────────────┘│
│                                             │
└─────────────────────────────────────────────┘
```

- Sidebar collapses to hamburger menu
- Dashboard: 2-column card grid
- Tables: hide less critical columns (e.g., locations in team table)
- Drawer becomes full-width overlay

### Mobile (320-767px)

```
┌───────────────────────────────┐
│  [☰]  Portal  [Acme.. ▾] [👤] │
├───────────────────────────────┤
│                               │
│  Organisation Dashboard        │
│                               │
│  ┌───────────────────────┐   │
│  │ Acme Allied Health    │   │
│  │ ● Compliant           │   │
│  │ Workers: 12  Locs: 3  │   │
│  │ [Manage →]            │   │
│  └───────────────────────┘   │
│  ┌───────────────────────┐   │
│  │ Acme Nursing          │   │
│  │ ▲ Expiring (2 docs)   │   │
│  │ Workers: 8   Locs: 2  │   │
│  │ [Manage →]            │   │
│  └───────────────────────┘   │
│                               │
└───────────────────────────────┘
```

- Single column card stack
- Tables become card lists on mobile (CL-005): Team rows become stacked cards (name, role, status, actions); Document rows become cards (type, expiry, status, action)
- Tabs become a scrollable horizontal strip or dropdown
- Touch targets: 44px minimum
- Drawer becomes full-screen modal

---

## Accessibility

| Requirement | Implementation |
|-------------|----------------|
| **WCAG Level** | AA |
| **Keyboard Navigation** | Full tab order through cards, tabs, forms. Enter to activate. |
| **Focus Indicators** | Visible focus rings (`:focus-visible`) on all interactive elements |
| **Screen Reader** | Account switcher announces current entity. Compliance badges use `aria-label`. Status changes announced via `aria-live`. |
| **Focus Trapping** | Modals and drawers trap focus, return focus on close |
| **Color Independence** | Compliance status uses icon + text label, not just colour. Status badges include text. |

---

## Visual Design

### Colors

| Usage | Color | Tailwind Class |
|-------|-------|----------------|
| Primary actions | Navy #2C4C79 | `bg-[#2C4C79] text-white` |
| Accent / active states | Teal #007F7E | `text-[#007F7E]` |
| Compliant badge | Green | `bg-green-100 text-green-700` |
| Expiring badge | Amber | `bg-amber-100 text-amber-700` |
| Non-compliant badge | Red | `bg-red-100 text-red-700` |
| Read-only section bg | Grey | `bg-gray-50` |
| Card borders | Light grey | `border border-gray-200` |

### Typography

| Element | Style |
|---------|-------|
| Page title | `text-2xl font-bold text-gray-900` |
| Card title | `text-lg font-semibold text-gray-900` |
| Tab labels | `text-sm font-medium` |
| Form labels | `text-sm font-medium text-gray-700` |
| Secondary text | `text-sm text-gray-500` |

### Spacing

| Context | Tailwind Class |
|---------|----------------|
| Page padding | `p-6` (desktop), `p-4` (mobile) |
| Card grid gap | `gap-6` |
| Card internal padding | `p-5` |
| Tab content padding | `pt-6` |
| Form field gaps | `space-y-4` |

---

## Open Questions

- [x] ~~Should the account switcher show in the sidebar or the top header bar?~~ **Resolved: Top header bar** — see CL-001
- [x] ~~Is Google Places autocomplete available for location address entry?~~ **Resolved: Yes, Google Places API** — see CL-004
- [ ] What specific document types are "required" for compliance status calculation? Need the definitive list from the compliance team.
- [x] ~~Should audit trail be visible within the profile UI (e.g., an "Activity" tab), or only accessible to TC staff via a separate admin view?~~ **Resolved: Staff-only admin view** — see CL-003

---

## Approval

| Role | Name | Date | Status |
|------|------|------|--------|
| Product Manager | | | [ ] Approved |
| Developer | | | [ ] Approved |
| Stakeholder | | | [ ] Approved |

---

## Next Steps

- [ ] `/trilogy-mockup` — Create interactive mockups for dashboard and profile tabs
- [ ] `/speckit-plan` — Create technical implementation plan
- [ ] Resolve remaining open questions with compliance team (document type matrix)

---

## Clarification Log

### UX Clarifications

**CL-001: Should the account switcher live in the sidebar or the top header bar?**
- **Option A (Recommended): Top header bar.** The account switcher is a global context control — it affects what data the entire page shows. Placing it in the persistent header makes it always visible and accessible regardless of sidebar state (collapsed on tablet/mobile). Consistent with SR0's switcher design.
- Option B: In the sidebar navigation, above the nav items.
- Option C: Both (redundant, but always reachable).
- **Decision: Option A** — Top header bar. Confirmed as consistent with SR0 design. Wireframes already reflect this placement.

**CL-002: What editing pattern should the Locations tab use — inline editing, drawer, or modal?**
- **Option A (Recommended): Slide-over drawer (right side).** Location editing involves multiple fields (address, contact, phone, service radius) — too many for inline editing but not complex enough for a full page. A drawer keeps context (the location list stays visible on desktop) and works well on tablet (full-width overlay).
- Option B: Full-page edit form (navigates away from the list).
- Option C: Modal dialog.
- Option D: Inline expansion (accordion-style) within the card.
- **Decision: Option A** — Slide-over drawer. Already reflected in wireframe notes. Drawer is 480px on desktop, full-width overlay on tablet, full-screen on mobile.

**CL-003: Should the audit trail be visible within the supplier profile UI?**
- **Option A (Recommended): Staff-only admin view.** Suppliers do not need to see a change log — it adds complexity and potential confusion. TC staff access the audit trail from the admin portal when investigating compliance or disputes. Keeps the supplier profile clean and focused.
- Option B: Read-only "Activity" tab on the supplier profile.
- Option C: Expandable "Last modified by" info on each field.
- **Decision: Option A** — Staff-only admin view. No "Activity" tab in the supplier-facing profile. Audit data is consumed by TC staff in the admin portal.

### UI Clarifications

**CL-004: Should the Location add/edit drawer use Google Places autocomplete?**
- **Option A (Recommended): Yes — Google Places API with a single search field.** User types an address, Google Places suggests matches, selecting one auto-fills street, suburb, state, postcode into structured fields below. Consistent with SR1 onboarding Locations step (CL-005 there). Standard UX for Australian address entry.
- Option B: Manual separate fields only (street, suburb, state, postcode).
- Option C: Australia Post PAF integration.
- **Decision: Option A** — Google Places API. Single search field at top of the drawer, structured fields below auto-populated on selection. User can manually edit individual fields after auto-fill.

**CL-005: How should tables (Team, Documents) adapt on mobile — card list or simplified table?**
- **Option A (Recommended): Card list.** Each table row becomes a stacked card with the key info (name, status, primary action). Touch-friendly, no horizontal scrolling, consistent with mobile patterns across the portal.
- Option B: Horizontally scrollable table (native table with `overflow-x: scroll`).
- Option C: Simplified table with fewer columns (hide secondary data).
- **Decision: Option A** — Card list on mobile. Team table becomes a list of cards showing name, role, status badge, and a three-dot action menu. Documents table becomes cards showing document type, expiry, status, and action button. Consistent with mobile patterns in SR1 and SR3.
