---
title: "Navigation"
description: "Complete navigation system — sidebar, top nav bar, secondary tabs, account menus, mobile patterns, and context navigation"
---

The portal navigation system spans multiple layers — a collapsible sidebar, a web primary nav bar (recipient/consumer portal), secondary tab navigation, account menus, and context-aware sidebars. All are defined in the [Figma Navigation page](https://www.figma.com/design/ojTCI9yefnl9ORYEVrv2WJ/Trilogy-Care-Design-System?node-id=67-12730).

## Navigation Layers

The system is composed of five distinct navigation layers:

| Layer | Purpose | Portal | Component |
|---|---|---|---|
| **Sidebar** | Primary app navigation | Internal (Admin, Supplier, Coordinator) | `CommonSidebar` |
| **Primary Nav Bar** | Top horizontal navigation | Consumer (Recipient/Auth Rep) | WEB Primary Nav Bar |
| **Secondary Navigation** | Sub-section tabs below primary bar | Consumer | WEB Secondary Navigation |
| **Account Menu** | User profile, settings, logout | All | `CommonProfileDropdown` / Account Menu |
| **Context Sidebar** | Entity details panel (right side) | Internal | `PackageSidebar` |

---

## Sidebar Navigation (Internal Portal)

The sidebar is built from 8 Vue components using [Reka UI](https://reka-ui.com/) tree primitives.

**Components:** `resources/js/Components/Common/navigation/`
**Layout:** `resources/js/Components/Common/CommonSidebar.vue`
**State:** `resources/js/composables/sidebar.js`

### Dimensions

| State | Width | Breakpoint |
|---|---|---|
| Expanded | 250px | Desktop (lg+) |
| Collapsed | 77px | Desktop (lg+) |
| Mobile overlay | Full-width, 80dvh height | < 1024px |

### Context Variants

The sidebar renders different navigation items per user context:

| Context | Items | Figma |
|---|---|---|
| **Admin** | Home, Packages, Care Coordinators, Suppliers, Invoices, Tags, Tasks | Expanded + Collapsed + Mobile |
| **Supplier** | Home, Invoices, Client Care, Business Details, Locations, Prices, Team, Documents | Expanded + Collapsed + Mobile |
| **Care Coordinator** | Home, Packages, Organisation, Team, Accounts, Services, Pending Fees | Expanded + Collapsed + Mobile |
| **Recipient/Auth Rep** | Home, Packages, Registration, Packages, Activity Log, Accounts, Settings | Expanded + Collapsed + Mobile |

:navigation-showcase

---

## Primary Nav Bar (Consumer/Web Portal)

The consumer-facing web portal uses a horizontal top navigation bar instead of a sidebar.

### Structure

The primary nav bar consists of:
1. **Trilogy Care logo** (left)
2. **Recipient selector** — dropdown with name + chevron (e.g. "John Doe")
3. **Primary tabs** — Home, Services, Finances, Profile
4. **Utility icons** — Search, Add, Share, Notifications, Account avatar + chevron
5. **Package Level Banner** (optional, below nav)

### Responsive Sizes

| Size | Breakpoint | Layout |
|---|---|---|
| Desktop | >= 1366px | Full horizontal bar, all tabs visible |
| Tablet | ~600px | Compressed, fewer utility icons |
| Mobile M | ~390px | Logo + hamburger only, tabs hidden |
| Mobile S | ~320px | Minimal, mobile menu required |

### Primary Tab States

| Tab | Selected Visual | Description |
|---|---|---|
| Home | **Bold text**, bottom underline | Dashboard/overview |
| Services | **Bold text**, bottom underline | Service plan, find services, suppliers |
| Finances | **Bold text**, red badge count, bottom underline | Balance, bills, contributions, statements |
| Profile | **Bold text**, bottom underline | Personal details, care circle, goals, needs |

### Packages Variants

The nav bar adapts based on number of packages:

| Variant | Behaviour |
|---|---|
| **1 Package** | Standard layout, no package selector |
| **2+ Packages** | Shows package context bar with selector dropdown |

---

## Secondary Navigation

Below the primary nav bar, a secondary tab row appears when inside a section.

### Tab Groups

| Section | Tabs |
|---|---|
| **Care Plan** | Personal details, Care Circle, My Goals, Care Needs, Reported incidents, Documents, Agreements |
| **Services** | Service plan, Find services, Your suppliers |
| **Billing** | Overview, Supplier bills, Your contributions, Statements |

### Visual Style

- Horizontal text links, no icons
- Selected tab: teal underline (`border-teal-700`)
- Unselected: plain text
- Full-width bottom border separating from content

---

## Nav Items (Top Bar Tabs)

Individual navigation tab items in the primary nav bar have three states:

| State | Visual |
|---|---|
| **Unselected** | Regular weight text, no underline, badge (if applicable) |
| **Hover** | Subtle background highlight |
| **Selected** | Bold text, bottom teal underline, filled badge |

Tabs may include a **notification badge** (red circle with count) for items like Finances.

---

## Icon Nav Items (Utility Bar)

The top-right utility bar contains icon-only buttons:

| Icon | Purpose | Badge Support |
|---|---|---|
| Notifications (bell) | View notifications | 8, 10, 99+ |
| Tasks (clipboard) | View tasks | 8, 10, 99+ |
| Search (magnifying glass) | Global search | None |
| AI (sparkle) | AI assistant | None |
| Actions (plus) | Quick actions | None |
| Help (question mark) | Help centre | None |

### Notification Badge

- Position: `absolute -right-2 -top-2`
- Size: `h-5 w-5` (20px)
- Style: `rounded-full bg-red-600 text-xs text-white font-bold`
- Overflow: Shows "99+" for counts over 99

---

## Account Menu

Three responsive variants for the user account dropdown:

### Desktop

- Trigger: Avatar circle + chevron in the nav bar utility area
- Content: Compact dropdown (246px wide)
- Sections: **Account** (Login & Security, Support/resources, Help centre), **Legal** (Privacy Centre, Terms & conditions)
- Footer: "Logged in as" with avatar + name, Logout button

### Tablet

- Full-height slide-in panel (480px wide)
- Same sections as desktop but with more padding
- "Viewing" section at top with recipient selector
- Navigation links: Home, Services, Finances, Profile
- Sections below: Account, Legal
- Logout at bottom

### Mobile

- Full-screen overlay (390px)
- "Menu" header with close (X) button
- "Viewing" section with recipient selector
- Stacked navigation links with chevrons
- Account, Legal sections
- "Logged in as" footer with Logout

---

## Sidebar Navigation Tabs (Legacy Internal)

Individual sidebar nav items support four states across two modes:

### Expanded Mode

| State | Selected | Visual |
|---|---|---|
| Default | No | Icon (outline) + label, transparent background |
| Hover | No | Icon + label, `bg-gray-100` |
| Focus | No | Icon + label, teal focus ring |
| Disabled | No | Icon + label, reduced opacity, `cursor-not-allowed` |
| Default | Yes | Icon (filled, teal) + label (teal), `bg-gray-50` |
| Hover | Yes | Icon (filled) + label (teal), `bg-teal-50` |
| Focus | Yes | Icon (filled) + label (teal), teal focus ring |
| Disabled | Yes | Icon (filled) + label (teal), reduced opacity |

### Collapsed Mode (Icon Only)

Same states as expanded but icon-only (45x45px square). Selected items show teal-filled icon on light teal background.

---

## Package Level Banner

A coloured banner indicating the recipient's package classification level. Two sizes:

### Sizes

| Size | Height | Usage |
|---|---|---|
| Regular | 32px | Sidebar context, inline |
| Large (LG) | 40px | Primary nav bar, prominent |

### Classification Colours

| Level | Background | Text |
|---|---|---|
| Basic Subsidy | `bg-gray-200` | `text-gray-700` |
| Level 1 | `bg-purple-200` | `text-purple-700` |
| Level 2 | `bg-blue-200` | `text-blue-700` |
| Level 3 | `bg-green-200` | `text-green-700` |
| Level 4 | `bg-yellow-200` | `text-yellow-700` |

---

## Adaptive Mobile Nav Items

Bottom tab-bar navigation items for mobile web:

| State | Selected | Notification | Visual |
|---|---|---|---|
| Default | No | No | Icon + label, muted |
| Default | No | Yes | Icon + label + red badge |
| Selected | Yes | No | Icon (filled) + label (teal) |
| Selected | Yes | Yes | Icon (filled) + label (teal) + red badge |
| Disabled | Either | Either | Muted, non-interactive |

Item dimensions: 70.5 x 56px per item.

---

## Mobile Navigation Patterns

### Global Navigation (Mobile)

- Top bar: Logo + avatar icon + hamburger menu
- Tap hamburger: Full-screen menu overlay
- Menu header: "Menu" + close (X)
- Navigation links with chevrons

### Package Context Bar (Mobile)

- Compact horizontal bar (394px x 74px)
- Shows package-level banner + context
- Taps through to package details

### Expanded Mobile Menu

- "Menu" header with close button
- Full navigation item list
- Items vary per context (Admin, Supplier, Coordinator, Recipient)
- Each item: Icon + label + optional notification badge

---

## Recipient Full Navigation

The most complex navigation pattern — shown when viewing a specific recipient's profile in the consumer portal. Combines:

1. **Primary nav bar** with recipient selector
2. **Primary tabs** (Home, Services, Finances, Profile) with selected state
3. **Secondary tabs** that change based on primary selection

### Full Tab Map

| Primary Tab | Secondary Tabs |
|---|---|
| Home | *(none)* |
| Services | Service plan, Find services, Suppliers |
| Finances | Balance, Supplier bills, Your contributions, Statements |
| Profile | Personal details, Care Circle, My Goals, Care Needs, Reported incidents, Documents, Agreements |

---

## Spacing & Layout Tokens

| Token | Value | Tailwind | Usage |
|---|---|---|---|
| Sidebar expanded width | 250px | `w-[250px]` | Main sidebar |
| Sidebar collapsed width | 77px | `w-[77px]` | Collapsed sidebar |
| Context sidebar expanded | 324px | `w-[324px]` | Package sidebar |
| Context sidebar collapsed | 50px | `w-[50px]` | Collapsed context |
| Nav item height | ~40px | `py-2` | Sidebar items |
| Nav item gap | 8px | `gap-2` | Between items |
| Primary nav bar height | 64px | `h-16` | Top nav (desktop) |
| Secondary nav height | 51px | — | Sub-tab bar |
| Mobile nav bar height | 59-64px | — | Mobile top bar |
| Breakpoint (mobile) | < 1024px | `lg:` | Sidebar → overlay |

---

## Component Architecture

### Sidebar Tree

```
AppLayout
├── CommonLayout
│   ├── CommonPanel (main sidebar)
│   │   └── CommonSidebar
│   │       ├── CommonLogo / CommonBrandIcon
│   │       ├── Search + Notification buttons
│   │       ├── CommonNavItems (Reka UI TreeRoot)
│   │       │   ├── CommonNavParentItem (expanded + children)
│   │       │   ├── CommonNavChildItem (child items + leaf items)
│   │       │   ├── CommonNavDropdownItem (collapsed + children)
│   │       │   ├── CommonNavCollapsedItem (collapsed, no children)
│   │       │   ├── CommonNavTitleItem (section dividers)
│   │       │   └── CommonNavItemIcon (icon/avatar renderer)
│   │       └── CommonProfileDropdown
│   │           ├── RoleSwitcher
│   │           └── TeamSwitcher
│   └── CommonContent
│       ├── Mobile header (< lg)
│       ├── CommonHeader + CommonTabs
│       └── Page content
└── CommonPanel (context sidebar, optional)
    └── PackageSidebar + PackageLevel
```

### Key Files

| Component | File | Purpose |
|---|---|---|
| `CommonSidebar` | `Components/Common/CommonSidebar.vue` | Full sidebar container |
| `CommonNavItems` | `Components/Common/navigation/CommonNavItems.vue` | Tree orchestrator |
| `CommonNavParentItem` | `Components/Common/navigation/CommonNavParentItem.vue` | Expandable parent |
| `CommonNavChildItem` | `Components/Common/navigation/CommonNavChildItem.vue` | Child/leaf items |
| `CommonNavDropdownItem` | `Components/Common/navigation/CommonNavDropdownItem.vue` | Collapsed hover dropdown |
| `CommonNavCollapsedItem` | `Components/Common/navigation/CommonNavCollapsedItem.vue` | Collapsed icon-only |
| `CommonNavTitleItem` | `Components/Common/navigation/CommonNavTitleItem.vue` | Section divider |
| `CommonNavItemIcon` | `Components/Common/navigation/CommonNavItemIcon.vue` | Icon/avatar renderer |
| `CommonProfileDropdown` | `Components/Common/CommonProfileDropdown.vue` | User account menu |
| `CommonTabs` | `Components/Common/CommonTabs.vue` | Horizontal tab navigation |
| `CommonHeader` | `Components/Common/CommonHeader.vue` | Page header with tabs |
| `CommonContent` | `Components/Common/CommonContent.vue` | Main content + mobile header |
| `PackageSidebar` | `Components/Package/PackageSidebar.vue` | Right-side context panel |
| `PackageLevel` | `Components/Package/PackageLevel.vue` | Package level banner |
| `useSidebar` | `composables/sidebar.js` | Sidebar state (localStorage) |

---

## Usage Guidelines

1. **Keep nesting shallow** — Maximum 2 levels deep. Deeper nesting creates poor UX in collapsed state
2. **Use section titles sparingly** — Title items (dividers) only appear when sidebar is expanded
3. **Active state is pathname-based** — Items highlight via URL matching in `isNavItemActive()`
4. **Disabled items remain visible** — Use `disabled: true` to grey out. Don't hide features
5. **Icons required for level-1 items** — Every top-level item needs an icon for collapsed view. Use Heroicons outline style
6. **Close sidebar on mobile navigation** — Every clickable item calls `controlSidebar()` to dismiss the overlay
7. **Consumer portal uses top nav** — Recipients/Auth Reps see horizontal tabs, not sidebar
8. **Package level banner is always visible** — Shows classification colour in both sidebar and top nav contexts

---

## Do / Don't

| | Guidance |
|---|---|
| ✅ Do | Keep sidebar nesting to maximum 2 levels deep |
| ❌ Don't | Add a third nesting level — collapsed state can't represent it well |
| ✅ Do | Use Heroicons outline style for all top-level sidebar icons |
| ❌ Don't | Mix icon libraries in the sidebar — consistency matters at the navigation level |
| ✅ Do | Use `disabled: true` to grey out unavailable features in the sidebar |
| ❌ Don't | Hide nav items based on permissions — disabled items tell users the feature exists |
| ✅ Do | Use the consumer primary nav bar (horizontal tabs) for the recipient portal |
| ❌ Don't | Use the internal sidebar for consumer-facing pages — different portals use different nav patterns |
| ✅ Do | Show the package level banner in both sidebar and top nav contexts |
| ❌ Don't | Omit the package classification colour — it's a critical contextual indicator |
| ✅ Do | Use `controlSidebar()` to close the mobile overlay after navigation |
| ❌ Don't | Leave the mobile sidebar open after a nav item click — always dismiss it |
