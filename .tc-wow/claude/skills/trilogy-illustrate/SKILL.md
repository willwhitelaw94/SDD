---
name: trilogy-illustrate
description: >-
  Selects icons and illustrations for TC Portal. Covers the Monicon icon system (Heroicons, Radix,
  Material, FA6, local SVGs via CommonIcon) and undraw.co illustrations for empty states,
  onboarding, and error pages. Activates when choosing icons, adding illustrations, building
  empty states, or selecting any visual asset; or when the user mentions icon, illustration,
  undraw, empty state, CommonIcon, Heroicons, or visual asset.
---

# Trilogy Illustrate

Select the right icon or illustration for any TC Portal context.

## When to Apply

Activate this skill when:
- Choosing an icon for a button, nav item, status badge, or action
- Adding an illustration to an empty state, onboarding, or error page
- Deciding between an icon vs illustration for a given context
- The user asks "what icon should I use?" or "I need a visual for this"

## Quick Decision: Icon vs Illustration

| Need | Use | Why |
|------|-----|-----|
| Inline with text (buttons, labels, nav) | **Icon** | Small, 16-24px, part of UI flow |
| Status indicator | **Icon** | Semantic, compact, colour-coded |
| Empty state (full page) | **Illustration** | Large, decorative, communicates context |
| Empty state (inline/card) | **Icon or Illustration** | Small illustration or large icon depending on space |
| Error page (404, 500) | **Illustration** | Friendly, reassuring, fills the page |
| Onboarding / first-time | **Illustration** | Welcoming, guides the user |
| Loading / spinner | **Icon** | Animated SVG spinner |

---

# Part 1: Icons

## Icon System Overview

TC Portal uses **Monicon** (`@monicon/vue`) to manage SVG icons at build time. Icons are rendered via the `<CommonIcon>` component.

### How It Works

1. Icons are registered in [icons.ts](icons.ts) (322 icons from multiple libraries)
2. Monicon bundles only registered icons at build time (tree-shaken)
3. Local SVGs in `assets/icons/` are available with the `local:` prefix
4. Browse icons at [icones.js.org](https://icones.js.org/)

### Usage

```vue
<CommonIcon icon="heroicons:check" class="h-5 w-5" />
<CommonIcon icon="heroicons:check" class="h-4 w-4 text-teal-600" />
<CommonIcon :icon="isOpen ? 'heroicons:chevron-up' : 'heroicons:chevron-down'" class="h-3 w-3" />
```

### Icon Libraries Available

| Library | Prefix | Count | Best For |
|---------|--------|-------|----------|
| **Heroicons** | `heroicons:`, `heroicons-solid:`, `heroicons-outline:` | ~180 | Primary UI icons (nav, actions, status) |
| **Radix Icons** | `radix-icons:` | ~8 | Dropdowns, form controls |
| **Material Design** | `material-symbols:`, `mdi:` | ~30 | People, roles, counters, moods |
| **Font Awesome 6** | `fa6-solid:` | ~3 | Pin, spinner, folder |
| **Flag Icons** | `flag:` | 7 | Country flags (AU, US, GB, etc.) |
| **Logos** | `logos:` | 2 | Telegram, WhatsApp |
| **Spinners** | `svg-spinners:` | 2 | Loading animations |
| **Local SVGs** | `local:` | 81+ | Custom brand icons, service types |
| **Misc** | `bi:`, `tabler:`, `iconoir:`, `fluent:`, `ph:`, etc. | ~15 | Specialised icons |

### Icon Sizing

| Context | Size | Tailwind |
|---------|------|----------|
| Inline with small text | 12px | `h-3 w-3` |
| Inline with body text | 14px | `h-3.5 w-3.5` |
| Buttons, form controls | 16px | `h-4 w-4` |
| Standard UI elements | 20px | `h-5 w-5` |
| Navigation, headings | 24px | `h-6 w-6` |
| Feature highlights | 32px | `h-8 w-8` |

### Context-to-Icon Quick Reference

| Context | Icon | Variant |
|---------|------|---------|
| **Edit / modify** | `heroicons:pencil-square` | `heroicons-outline:pencil` |
| **Delete** | `heroicons:trash` | `heroicons-outline:trash` |
| **Add / create** | `heroicons:plus` | `heroicons:plus-circle` |
| **Search** | `heroicons:magnifying-glass` | `heroicons-solid:magnifying-glass` |
| **Filter** | `heroicons:funnel` | `heroicons:funnel-solid` |
| **Sort** | `heroicons:arrows-up-down` | — |
| **Download** | `heroicons:arrow-down-tray` | `heroicons-solid:download` |
| **Upload** | `heroicons:arrow-up-tray` | `heroicons:document-arrow-up` |
| **Close / dismiss** | `heroicons:x-mark` | `heroicons-solid:x-mark` |
| **Confirm / success** | `heroicons:check` | `heroicons:check-circle` |
| **Warning** | `heroicons:exclamation-triangle` | `heroicons:exclamation-circle` |
| **Info** | `heroicons:information-circle` | `heroicons-outline:information-circle` |
| **Error / danger** | `heroicons:x-circle` | `heroicons-solid:x-circle` |
| **Settings** | `heroicons:cog-6-tooth` | `heroicons-solid:cog` |
| **User / profile** | `heroicons:user` | `heroicons:user-circle` |
| **Users / group** | `heroicons:user-group` | `heroicons:users` |
| **Home** | `heroicons:home` | `heroicons:home-solid` |
| **Calendar / date** | `heroicons:calendar-days` | `heroicons:calendar-date-range` |
| **Document** | `heroicons:document-text` | `heroicons-outline:document` |
| **Copy / clipboard** | `heroicons:clipboard-document` | `heroicons-outline:clipboard` |
| **Email** | `heroicons:envelope` | `heroicons-solid:mail` |
| **Phone** | `heroicons:phone` | `heroicons-solid:phone` |
| **Money / billing** | `heroicons:currency-dollar` | `heroicons:banknotes` |
| **Link / external** | `heroicons:arrow-top-right-on-square` | `heroicons-solid:external-link` |
| **Lock / security** | `heroicons:lock-closed` | `heroicons:lock-open` |
| **Notification** | `heroicons:bell-solid` | `heroicons-outline:bell-alert` |
| **Pin / bookmark** | `fa6-solid:thumbtack` | `heroicons:bookmark-16-solid` |
| **Navigation back** | `heroicons:arrow-left` | `heroicons:chevron-left` |
| **Navigation forward** | `heroicons:arrow-right` | `heroicons:chevron-right` |
| **Expand / collapse** | `heroicons:chevron-down` / `heroicons:chevron-up` | — |
| **Loading** | `svg-spinners:dot-revolve` | `svg-spinners:180-ring-with-bg` |
| **AI / smart** | `streamline:ai-technology-spark` | `heroicons:sparkles` |

### Local Custom Icons

Access with `local:` prefix. Key custom icons:

| Icon | Name | Usage |
|------|------|-------|
| ABN lookup | `local:abn` | ABN search/validation |
| TC ID | `local:tcid` | Trilogy Care identifier |
| Zoho | `local:zoho` | Zoho integration |
| Service icons | `local:fa-*-regular` | 81 FontAwesome regular variants for service types |

### Adding a New Icon

1. **Find the icon** at [icones.js.org](https://icones.js.org/)
2. **Add to** `icons.ts` array (e.g., `'heroicons:new-icon'`)
3. **Use** via `<CommonIcon icon="heroicons:new-icon" />`
4. **For custom SVGs**, save to `assets/icons/` and use `local:filename`

### Custom Vue Icon Components

For complex or domain-specific icons, dedicated Vue components exist at `resources/js/Components/Icons/`:
- 37 custom SVG icon components (CheckIcon, EditIcon, TrashIcon, etc.)
- `ServiceTypeIcons/` — 28 care service icons (Nursing, Physiotherapy, Gardening, etc.)
- Imported directly: `import EditIcon from '@/Components/Icons/EditIcon.vue'`

### Legacy: Direct Heroicons Imports

Some older components import from `@heroicons/vue` directly. Prefer `<CommonIcon>` for new code:
```vue
// OLD (still works, but avoid for new code)
import { EyeIcon } from '@heroicons/vue/20/solid'

// NEW (preferred)
<CommonIcon icon="heroicons:eye" class="h-5 w-5" />
```

---

# Part 2: Illustrations

## Illustration System

All illustrations are sourced from [undraw.co](https://undraw.co) and catalogued in the Figma Design System:
[Illustrations page](https://www.figma.com/design/ojTCI9yefnl9ORYEVrv2WJ/Trilogy-Care-Design-System?node-id=2640-2803)

## Brand Colours (for undraw.co customisation)

When downloading from undraw.co, set the **accent colour** to the TC Portal primary teal:

| Token | Hex | Usage |
|-------|-----|-------|
| **Primary Teal** | `#007F7E` | Default accent for all illustrations |
| **Teal 500** | `#43C0BE` | Lighter alternative for secondary elements |
| **Primary Blue** | `#2C4C79` | Alternative accent for finance/formal contexts |
| **Dark Navy** | `#13171D` | Dark outlines and figure details |

Always use **`#007F7E`** as the primary undraw accent colour unless the context specifically calls for blue (financial/formal) or a lighter variant.

## Illustration Library

### General Use

| Illustration | Figma Node | Best For |
|-------------|-----------|----------|
| `undraw_profile` | `2640:4237` | User profiles, account settings |
| `undraw_calendar` | `2640:4235` | Scheduling, appointments, dates |
| `undraw_completing` | `2640:4241` | Task completion, progress, success |
| `undraw_contact_us` | `2640:4233` | Contact forms, support pages |
| `undraw_fill_form` | `2640:4240` | Forms, data entry, onboarding |
| `undraw_key_points` | `2640:4239` | Summaries, key info, highlights |
| `undraw_read_notes` | `2640:4234` | Notes, documentation, reading |
| `undraw_to_do` | `2640:4229` | Task lists, checklists, planning |
| `undraw_to_do_list` | `2641:5282` | Todo lists, task management |
| `undraw_next_tasks` | `2641:5281` | Upcoming tasks, next steps |
| `undraw_add_tasks` | `2645:5621` | Adding new tasks, creating items |
| `undraw_file_searching` | `2880:394` | Search, file lookup |
| `undraw_not_found` | `3090:6051` | 404, not found, missing content |
| `undraw_search_app` | `3090:6049` | Search features, app search |
| `undraw_selected_options` | `3090:6050` | Selection, multi-select, filters |
| `undraw_business_shop` | `3090:6379` | Business, marketplace, services |
| `undraw_join` | `3090:6376` | Onboarding, joining, sign up |
| `undraw_projection` | `3090:6375` | Forecasts, projections, analytics |
| `undraw_reminder` | `3090:6378` | Reminders, notifications, alerts |
| `undraw_searching` | `3090:6377` | Search in progress, looking |
| `undraw_start_building` | `3090:6374` | Getting started, setup, building |
| `undraw_data_reports` | `3113:1341` | Reports, data, dashboards |
| `undraw_progress_overview` | `3113:1340` | Progress tracking, overview |
| `undraw_percentages` | `3113:1339` | Statistics, percentages, metrics |
| `undraw_attached_file` | `3338:1976` | File attachments, uploads |
| `undraw_blog_post` | `3338:1974` | Content, articles, posts |
| `undraw_certificate` | `3338:1973` | Certificates, achievements, compliance |
| `undraw_collaborators` | `3338:1972` | Teamwork, collaboration |
| `undraw_done_checking` | `3338:1975` | Verification, approval, done |
| `undraw_fast_loading` | `3338:1971` | Performance, speed, loading |
| `undraw_hiring` | `3338:1968` | People, HR, recruitment |
| `undraw_live_collaboration` | `3338:1967` | Real-time collaboration, live |
| `undraw_my_personal_files` | `3338:1966` | Personal files, documents |
| `undraw_online_cv` | `3338:1965` | CVs, resumes, profiles |
| `undraw_personal_documents` | `3338:1969` | Personal docs, ID, paperwork |
| `undraw_personal_information` | `3338:1964` | Personal info, data entry |
| `undraw_reviewed_docs` | `3338:1963` | Document review, approval |
| `undraw_spreadsheets` | `3338:1962` | Spreadsheets, tables, data |
| `undraw_people_search` | `5590:5592` | People search, directory |

### Financial

| Illustration | Figma Node | Best For |
|-------------|-----------|----------|
| `undraw_transfer_money` | `2640:4228` | Transfers, payments |
| `undraw_mobile_encryption` | `2640:4230` | Security, encryption, mobile |
| `undraw_online_payments` | `2640:4236` | Online payments, checkout |
| `undraw_printing_invoices` | `2640:4238` | Invoices, billing, print |
| `undraw_receipt` | `2640:4231` | Receipts, transactions |
| `undraw_vault` | `2640:4232` | Security, vault, safe storage |
| `undraw_online_banking` | `4609:1342` | Banking, accounts |
| `undraw_finance` | `4609:1341` | Finance, money management |
| `undraw_organizing_data` | `4609:1340` | Data organisation, sorting |

### File Management

| Illustration | Figma Node | Best For |
|-------------|-----------|----------|
| `undraw_add_document` | `2645:5535` | New document, create |
| `undraw_add_file` | `2645:5530` | Add file, upload |
| `undraw_add_files` | `2645:5533` | Bulk file add, batch upload |
| `undraw_file_manager` | `2645:5531` | File management, organising |
| `undraw_filing_system` | `2645:5534` | Filing, categorisation |
| `undraw_folder_files` | `2645:5532` | Folders, directory structure |
| `undraw_upload` | `2645:5529` | Upload, file transfer |
| `undraw_my_files` | `3338:1970` | My files, personal storage |
| `undraw_file_search` | `4609:1339` | File search, find document |

### Empty / No Data States

| Illustration | Figma Node | Best For |
|-------------|-----------|----------|
| `undraw_no_data` | `4859:9693` | No data, empty dataset |
| `undraw_empty` | `4859:9704` | Empty state, nothing here |

## Context-to-Illustration Mapping

| Context | Recommended | Alternative |
|---------|------------|-------------|
| **Empty table / no results** | `undraw_not_found` | `undraw_no_data`, `undraw_empty` |
| **Empty file list** | `undraw_my_files` | `undraw_add_file` |
| **First-time setup** | `undraw_start_building` | `undraw_fill_form` |
| **Onboarding welcome** | `undraw_join` | `undraw_start_building` |
| **Search no results** | `undraw_searching` | `undraw_not_found` |
| **Invoice / billing** | `undraw_printing_invoices` | `undraw_receipt` |
| **Payment success** | `undraw_online_payments` | `undraw_completing` |
| **Document upload** | `undraw_add_document` | `undraw_upload` |
| **Profile incomplete** | `undraw_personal_information` | `undraw_fill_form` |
| **Task list empty** | `undraw_to_do` | `undraw_add_tasks` |
| **Report / analytics** | `undraw_data_reports` | `undraw_projection` |
| **Schedule / calendar** | `undraw_calendar` | `undraw_reminder` |
| **Collaboration** | `undraw_collaborators` | `undraw_live_collaboration` |
| **Security / auth** | `undraw_vault` | `undraw_mobile_encryption` |
| **404 page** | `undraw_not_found` | `undraw_searching` |

## Existing Illustration Assets

| File | Location | Description |
|------|----------|-------------|
| `undraw_vault.svg` | `resources/js/Assets/Common/` | Vault/safe illustration (teal branded) |
| `empty.svg` | `resources/js/Assets/Common/` | Generic empty state |
| `404.svg` | `resources/js/Assets/Errors/` | 404 error page |

## How to Add a New Illustration

1. **Select** the right illustration from the library above (or browse [undraw.co](https://undraw.co))
2. **Set accent colour** to `#007F7E` on undraw.co before downloading
3. **Download as SVG** (always prefer SVG over PNG)
4. **Save to** `resources/js/Assets/Common/` with the naming pattern `undraw_[name].svg`
5. **Import** in your Vue component:
   ```vue
   <img src="@/Assets/Common/undraw_[name].svg" alt="Description" class="max-w-xs" />
   ```
6. **If adding to Figma**, place it on the Illustrations page under the appropriate category

## Illustration Sizing

| Context | Recommended Size | Tailwind Class |
|---------|-----------------|----------------|
| Empty state (full page) | 280-320px wide | `max-w-xs` or `w-72` |
| Empty state (inline/card) | 160-200px wide | `w-40` or `w-48` |
| Onboarding step | 240-280px wide | `w-60` or `max-w-[280px]` |
| Modal illustration | 180-220px wide | `w-48` or `w-56` |
| Error page (404/500) | 300-400px wide | `max-w-sm` |

## Empty State Pattern

```vue
<div class="flex flex-col items-center justify-center py-12 text-center">
  <img
    src="@/Assets/Common/undraw_[name].svg"
    alt="No items found"
    class="mb-6 w-48"
  />
  <h3 class="text-lg font-semibold text-gray-900">No items yet</h3>
  <p class="mt-1 text-sm text-gray-500">Get started by creating your first item.</p>
  <button class="mt-4 btn-primary">Create Item</button>
</div>
```
