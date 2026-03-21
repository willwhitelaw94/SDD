---
title: "Risk Radar Vue Stubs"
---

# Risk Radar — Vue Stubs

Vue component mockups translated from the Superhuman Sam HTML mockups.
These use real Common components and demonstrate the target UI with hardcoded data.

## Stub → Target Mapping

| Stub File | Source HTML | Target Location | Replaces |
|-----------|------------|-----------------|----------|
| `RiskAccordion.vue` | `student-3-superhuman/03-card-accordion.html` | `resources/js/Pages/Packages/tabs/PackageRisks.vue` | PrimeVue DataTable + Dialog |
| `RiskRadar.vue` | `student-3-superhuman/02-risk-radar.html` | Tab content within `PackageRisks.vue` (Risk Radar tab) | N/A (new) |
| `RiskStepForm.vue` | `student-3-superhuman/04-step-form.html` | `resources/js/Pages/Packages/Risks/Create.vue` + `Edit.vue` | Single scrollable modal form |

## Step Form — Current Workflow Preserved

The step form mockup reorganises the existing `RiskForm.vue` into 3 steps:

| Step | Contents | Current Location |
|------|----------|-----------------|
| **1. Basics** | Risk category, need, care plan, details, action plan | Top of `RiskForm.vue` (lines 648–735) |
| **2. Details** | Category-specific fields (26 sections: Falls, Wounds, etc.) | Conditional sections in `RiskForm.vue` (lines 737–1031) |
| **3. Questions** | Check-in questions (feature-flagged) | New — currently only on risk cards |

**Key design decisions:**
- Step 2 is **skipped** when the category has no specific fields OR "Not identified during assessment" is toggled
- All 26 existing `*Section.vue` components are reused as-is — only the layout wrapper changes
- The `childFormData` pattern and `updateX` callbacks stay identical
- `CommonStepNavigation` replaces the horizontal step pills from the HTML mockup

## Common Components Used

- `CommonCard`, `CommonBadge`, `CommonButton`, `CommonIcon`
- `CommonTabs` (All Risks / Risk Radar toggle)
- `CommonCollapsible` (check-in questions accordion)
- `CommonStepNavigation` (3-step form wizard)
- `CommonFormField`, `CommonSelectMenu`, `CommonTextarea`, `CommonCheckbox`
- `CommonEmptyPlaceholder` (empty states)

## Not Yet Implemented (needs real backend)

- Keyboard shortcuts (↑↓ navigate, A assess, Q toggle questions, etc.)
- Drag-and-drop question reorder (needs vuedraggable or similar)
- Chart.js radar chart (current SVG is a placeholder)
- Real risk data from `PackageRiskController` props
- Feature flag gating (`CarePartnerCheckInsFeature`, Risk Radar flag)
