---
title: "Mockup Summary: Simplified Needs Module (Needs v2)"
---

# Mockup Summary: Simplified Needs Module (Needs v2)

## Mockups Produced

| File | What it covers |
|------|----------------|
| `wizard-form.txt` | 3-step wizard (Define Need → Link Risks → Budget Items), empty state, validation error state |
| `needs-list.txt` | List view with Maslow pyramid filter, status tabs, card layout, draft/archived views, empty state, expanded card detail |

---

## Key Design Decisions

### Wizard Form (wizard-form.txt)

| Decision | Rationale |
|----------|-----------|
| **Grouped visual category picker** (not dropdown) | Maslow levels need visual prominence — collapsible sections let Coordinators scan all 14 categories quickly while keeping the form compact |
| **3 steps with free navigation** | Back/forward always allowed; validation only on save. Reduces friction — Coordinators won't lose data if they click around |
| **Steps 2 & 3 are skippable** | Risk and budget linking is valuable but optional. "Skip" button + hint text ("You can link risks later") avoids blocking the core flow |
| **Search + checkbox list** for risk/budget selection | Familiar pattern from CommonSelectMenu; scales to packages with 10+ risks or budget items |
| **Selected items shown as removable tags** | Quick visual confirmation of what's linked; one-click removal |
| **Status radio (Draft / Active)** on Step 1 | Defaults to Active per FR-019; Draft available for incomplete needs |

### Needs List (needs-list.txt)

| Decision | Rationale |
|----------|-----------|
| **Maslow pyramid filter** (hidden by default, toggle via [△ Maslow] button) | Visual summary of recipient's care needs distribution across the hierarchy. Each tier shows need count and acts as a clickable filter. Hidden by default to keep daily workflow clean; revealed on demand for clinical overview and audit context |
| **Cards grouped by Maslow level** (not DataTable) | More scannable for care context; groups reinforce the Maslow framework visually |
| **Status tabs** (Active / Draft / Archived) | Clean separation — Coordinators see active needs by default, can access drafts and archive when needed |
| **Drag handles on cards** | Manual reorder within the list (FR-022); only on Active and Draft tabs |
| **Compact card with expandable detail** | Default shows category, description snippet, funding source, linked counts. Expand shows full description, "how met", individual linked items, and timestamp |
| **Archived = read-only** | No edit/delete actions; View only. Preserves audit trail |
| **"Add to Care Plan" indicator** (📋 icon) | Subtle visual cue on cards where this is enabled |

### Maslow Pyramid Filter — Detailed Behaviour

| Behaviour | Detail |
|-----------|--------|
| **Toggle** | [△ Maslow] button in toolbar reveals/hides the pyramid with slide animation |
| **Counts** | Each tier displays the number of needs at that Maslow level |
| **Filter** | Clicking a tier filters the list to only that level |
| **Overview mode** | When no tier is selected, pyramid shows all counts (summary view) |
| **Dimmed tiers** | Tiers with 0 needs are dimmed but remain clickable |
| **Tab-aware** | Counts update based on active status tab (Active/Draft/Archived) |
| **Clear filter** | "Clear filter" button resets to show all needs grouped by level |
| **Hidden on empty** | Pyramid button hidden when the package has 0 needs |
| **Audit value** | At-a-glance view of where needs concentrate — "heavily Physiological = foundational support needed" |

---

## States Covered

| State | Wizard | List |
|-------|--------|------|
| Happy path (data present) | ✅ All 3 steps | ✅ Active tab with 4 needs |
| Empty (no data) | ✅ Step 2 — no risks on package | ✅ No needs created yet |
| Validation error | ✅ Step 1 — missing required fields | — |
| Draft | ✅ Status radio on Step 1 | ✅ Draft tab view |
| Archived | — | ✅ Archived tab (read-only) |
| Expanded detail | — | ✅ Card detail with linked items |
| Pyramid — overview | — | ✅ All counts, no filter active |
| Pyramid — filtered | — | ✅ Single tier selected, list filtered |
| Pyramid — dimmed tiers | — | ✅ Tiers with 0 needs shown dimmed |

---

## Component Mapping

| Mockup Element | Existing Component | Notes |
|----------------|-------------------|-------|
| Modal shell | `CommonModal` | Right-slide dialog |
| Step navigation | `CommonStepNavigation` | reka-ui based stepper |
| Category picker | **New** | Grouped visual selector with collapsible Maslow sections |
| Description textarea | Native `<textarea>` | Standard form field |
| Funding source dropdown | `CommonSelectMenu` | Single-select combobox |
| Risk/budget multi-select | `CommonSelectMenu` (multiple) | With search + checkbox items |
| Selected tags | **New** (simple chip/tag) | Removable tag display |
| Maslow pyramid | **New** (`MaslowPyramid.vue`) | SVG/CSS pyramid with clickable tiers, count badges, filter emit |
| Status tabs | **New** (tab bar) | Active/Draft/Archived filter |
| Need card | **New** | Card with drag handle, expandable detail |
| Drag-and-drop | **New** (library needed) | `@vueuse/core` useSortable or similar |
| Empty state | Existing pattern | Centered illustration + message + CTA |

---

## Questions for Stakeholder Review

1. **Card expand behaviour** — Should cards expand inline (pushing content down) or open as a side panel / modal?
2. **Maslow level colours** — Should each Maslow level have a distinct colour accent on the pyramid tiers and corresponding cards?
3. **Drag-and-drop scope** — Can needs be reordered across Maslow groups, or only within their group?
4. **Archive action** — Should archiving require confirmation, or is it a simple one-click action?
5. **Pyramid on wizard** — Should the Maslow pyramid also appear on Step 1 of the wizard as the category selector, or keep the grouped list there?

---

## Next Steps

1. Review mockups with stakeholders
2. Run `/trilogy-design-handover` — Gate 2 (Design → Dev handover)
3. Run `/speckit-plan` — Technical implementation plan
