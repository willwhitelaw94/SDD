---
title: "Mockup Summary: LTH Conversion Form"
---

# Mockup Summary: Lead to HCA

**Created**: 2026-02-09
**Updated**: 2026-02-10

---

## Mockup Inventory

| File | Element | Variations | Status |
|------|---------|------------|--------|
| [conversion-form-variations.txt](conversion-form-variations.txt) | Overall 4-step accordion layout | 8 (A-H) | Complete |
| [step1-essentials-variations.txt](step1-essentials-variations.txt) | Step 1: Conversion Essentials fields | 6 (A-F) | Complete |
| [step2-risk-outcome-variations.txt](step2-risk-outcome-variations.txt) | Step 2: Risk Assessment Outcome (4 states) | 6 (A-F) | Complete |
| [step3-questionnaire-variations.txt](step3-questionnaire-variations.txt) | Step 3: Questionnaire (client, funding, scheduling) | 6 (A-F) | Complete |
| [step4-agreement-variations.txt](step4-agreement-variations.txt) | Step 4: Agreement + Signature flows | 8 (A-H) | Complete |
| [clinical-review-index-variations.txt](clinical-review-index-variations.txt) | Clinical Review Index page | 6 (A-F) | Complete |

**Total: 40 variations across 6 mockup files**

---

## Recommendations by Element

### Overall Form Layout (conversion-form-variations.txt)

| Recommended | Runner-up |
|-------------|-----------|
| **Option G** (Card-Based Accordion) | **Option A** (Classic Accordion) |

- Card pattern used elsewhere in Portal
- Clear visual distinction between active and completed steps
- Nested cards for sub-sections add organization

### Step 1: Conversion Essentials (step1-essentials-variations.txt)

| Recommended | Runner-up |
|-------------|-----------|
| **Option E** (Progressive Disclosure) | **Option A** (Two-Column Grouped) |

- Classification-dependent date fields appear contextually
- Radio buttons for Management Option make the 3 choices obvious
- Representative shown as cards (future multi-rep support)
- Option A is the safe fallback — conventional, everything visible

### Step 3: Questionnaire (step3-questionnaire-variations.txt)

| Recommended | Runner-up |
|-------------|-----------|
| **Option D** (Progressive with Conditional Funding) | **Option B** (Card-Based Sub-Sections) |

- FSO/MSO as radio buttons makes the binary choice obvious
- "Default to max" checkbox disabling rate fields prevents confusion
- Payment method as radio shows all 4 options at once
- Option E (Calendly States) is essential as a supplement for booked/fallback states
- Option B is best if using Card-Based accordion (Option G) for consistency

### Step 2: Risk Assessment Outcome (step2-risk-outcome-variations.txt)

| Recommended | Runner-up |
|-------------|-----------|
| **Option A** (Centered Status Card) | **Option E** (Minimal Inline) |

- Clear visual hierarchy with outcome front and center
- Room for risk flags and explanatory text
- "What happens next" info box for clinical path
- Option E is best if Step 2 doesn't warrant a full page (it's read-only, not a form)

### Step 4: Agreement & Signatures (step4-agreement-variations.txt)

**Composite recommendation — combine patterns:**

| Pattern | From Option | Purpose |
|---------|-------------|---------|
| Radio selection for signature type | **Option D** | Clean progressive disclosure |
| Sample agreement with SAMPLE watermark | **Option E** | Visually distinct clinical path |
| Digital tracking with auto-reminder timeline | **Option G** | Post-send status tracking |
| Manual two-step send/upload flow | **Option H** | Clear send-then-upload process |

### Clinical Review Index (clinical-review-index-variations.txt)

| Recommended | Runner-up |
|-------------|-----------|
| **Option C** (Split Panel) | **Option A** (Data Table) |

- Select client and record outcome without page navigation
- Mirrors CommonSplitPanel pattern already used in Portal
- Works well for expected volume (~2-3 reviews at a time)
- Option A is the safe fallback — familiar, sortable, scales better

---

## Key Design Decisions Still Needed

1. **Step 2 as full page vs inline status?** Options A vs E — Step 2 has no form fields, only a read-only outcome display. Does it need a full step or can it be a thin banner?

2. **Agreement body visibility during signature?** Split panel (Option B) keeps it visible vs stacked (Options A/C/D) which requires scrolling past it.

3. **Clinical Review Index placement?** Spec says "dedicated page under Consumers" — confirm navigation IA.

4. **Sample agreement watermark treatment?** Physical watermark on PDF vs in-app visual indicator vs both?

---

## Preferences Captured

*To be filled after stakeholder review:*

- [ ] Overall layout: ____
- [ ] Step 1 layout: ____
- [ ] Step 2 treatment (full page vs inline): ____
- [ ] Step 3 layout: ____
- [ ] Step 4 signature type selection: ____
- [ ] Clinical Review Index layout: ____

---

## Next Steps

1. Share mockups with design/product team
2. Gather stakeholder feedback on preferences
3. Run `/trilogy-design-handover` (Gate 2) to validate design completeness
4. Run `/speckit-plan` to create implementation plan
