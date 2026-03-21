---
title: "IAT Gap Analysis — Risk Module Alignment"
description: "Gap analysis comparing the My Aged Care Integrated Assessment Tool (IAT v2.4, Nov 2025) with TC Portal's Risk Radar module"
---

# IAT Gap Analysis — Risk Module Alignment

**Source**: My Aged Care Integrated Assessment Tool (IAT) User Guide, Version 2.4, November 2025
**Compared against**: TC Portal Risk Radar module (ClinicalDomain enum, 28 risk categories, consequence/mitigation framework)
**Date**: 2026-03-10

---

## Executive Summary

The IAT is a **needs assessment tool** that determines Support at Home (SaH) classification levels 1–8. It uses binary flags and ordinal scales rather than a clinical risk matrix. TC Portal's Risk Radar is already **more sophisticated** than the IAT — it has consequence levels, mitigation tracking, traffic-light scoring, and dignity of risk declarations that the IAT lacks entirely.

However, the IAT covers **7 goal domains** where Risk Radar has **5 clinical domains**, and the IAT flags **9 risk/complexity areas** that Risk Radar doesn't currently track.

---

## Domain Gap

### Current ClinicalDomain enum (5 values)

| ClinicalDomain | IAT Equivalent | Status |
|---|---|---|
| `FUNCTIONAL_ABILITY` | Physical function | Covered |
| `CLINICAL_HEALTH` | General health / Personal health | Covered |
| `MENTAL_HEALTH` | Cognitive function + Psychological | Covered (merged) |
| `NUTRITIONAL_SENSORY` | _(spread across Personal health + Function)_ | Covered (no IAT equivalent) |
| `SAFETY` | Home/personal safety | Covered |

### Missing Domains

| IAT Domain | Gap | Notes |
|---|---|---|
| **Cognitive function** | IAT separates cognition (memory, thinking, KICA Cog, GP Cog) from psychological (depression, anxiety, PHQ-4, GDS). Risk Radar merges both into `MENTAL_HEALTH` | Consider splitting into `COGNITIVE` and `PSYCHOLOGICAL` |
| **Social support** | IAT has a full social assessment section + Duke Social Support Index + Good Spirit Good Life. Risk Radar has a `Social isolation` risk category but no top-level domain | Add `SOCIAL` domain |

### Proposed Domain Expansion: 5 → 7

```
FUNCTIONAL_ABILITY    → keep
CLINICAL_HEALTH       → keep
COGNITIVE             → new (split from MENTAL_HEALTH)
PSYCHOLOGICAL         → new (split from MENTAL_HEALTH)
NUTRITIONAL_SENSORY   → keep
SAFETY                → keep
SOCIAL                → new
```

---

## Risk Category Gap

### Existing Coverage (28 categories — well aligned)

| IAT Area | Risk Category | Match |
|---|---|---|
| Falls/slips/trips | Falls | Direct |
| Continence | Continence | Direct |
| Pain | Pain management | Direct |
| Oral health | Oral Health | Direct |
| Skin/pressure | Skin integrity, Pressure injury, Wound management | Direct |
| Medication safety | Medication safety | Direct |
| Hydration/nutrition/appetite | Hydration and nutrition | Direct |
| Cognition/memory | Cognition | Direct |
| Mental health/depression | Mental health | Direct |
| Behavioural changes | Behavioural | Direct |
| Infection | Infection | Direct |
| Choking/swallowing | Choking/Aspiration | Direct |
| Social isolation | Social isolation | Direct |
| Diabetes | Diabetes | Direct |
| Palliative care | Palliative Care | Direct |
| Hearing/vision | Hearing/Vision Loss | Direct |
| In-home safety | In-home safety | Direct |
| Activity tolerance | Activity intolerance | Direct |
| Carer sustainability | Carer burnout | Direct |
| Delirium | Delirium | Direct |
| Clinical equipment | Clinical Equipment | Direct |
| Emergency evacuation | Emergency evacuation, Fire/Emergency | Direct |
| Allergies/sensitivities | Allergies | Direct |

### Missing Risk Categories (9 new from IAT)

| Missing Category | IAT Context | Suggested Domain |
|---|---|---|
| **Alcohol & substance use** | Complexity indicator — "exposed to risks due to drug/alcohol issues" | `SAFETY` |
| **Tobacco use** | Separate health concern flag | `CLINICAL_HEALTH` |
| **Sleep disturbance** | Health consideration — affects wellbeing and recovery | `CLINICAL_HEALTH` |
| **Health literacy** | Difficulty understanding health information — affects medication compliance, care plan adherence | `SOCIAL` / `CLINICAL_HEALTH` |
| **Driving safety** | Functional assessment — ability to drive safely, risk to self and others | `FUNCTIONAL_ABILITY` / `SAFETY` |
| **Financial & legal vulnerability** | Full IAT assessment section + complexity indicator for "financial disadvantage threatening access to services" | `SOCIAL` |
| **Self-neglect** | Complexity indicator — "self-neglecting of personal care/safety" | `SAFETY` |
| **Abuse & neglect risk** | Suspected or confirmed abuse (physical, sexual, psychological, financial) — IAT complexity flag | `SAFETY` |
| **Housing insecurity** | Inadequate housing / insecure tenure / homelessness — complexity indicator | `SAFETY` / `SOCIAL` |

---

## Framework Comparison

| Feature | IAT | Risk Radar | Gap? |
|---|---|---|---|
| Risk scoring | Binary flags (yes/no) | 5-level ConsequenceLevel (Negligible → Extreme) | Risk Radar is stronger |
| Risk matrix | None | Traffic light (GREEN/AMBER/RED) from residual risk | Risk Radar is stronger |
| Mitigation tracking | None | MitigationLevel (None/Partial/Strong) | Risk Radar is stronger |
| Domain grouping | 14 flat assessment sections | 5 ClinicalDomains with risk area mapping | Risk Radar is stronger (structured) |
| Assessment versioning | Single point-in-time | Immutable records, full audit history | Risk Radar is stronger |
| Dignity of risk | Not addressed | DignityOfRiskDeclaration model | Risk Radar is stronger |
| Validated tools | RUIS, RFIS, DEMMI, PHQ-4, GDS, KICA Cog, Duke SSI | Category-specific questionnaires (JSON) | Comparable — different approach |
| Social assessment | Duke Social Support Index, Good Spirit Good Life | Social isolation category only | IAT is broader |
| Cognitive screening | Step 1/2 GP Cog, KICA Cog | Cognition risk category | IAT has validated tools |
| Complexity flags | 8 binary indicators | Not tracked separately | IAT has this, Risk Radar doesn't |

---

## IAT Complexity Indicators (not in Risk Radar)

These are binary flags the IAT uses to identify high-complexity clients:

1. Inadequate housing / insecure tenure / homelessness
2. Risk of, or suspected or confirmed abuse (physical, sexual, psychological, financial)
3. Emotional/mental health issues limiting capacity for self-care
4. Financial disadvantage threatening access to services
5. Adverse effects of institutionalisation or system abuse
6. Exposed to risks due to drug/alcohol issues
7. Self-neglecting of personal care/safety
8. Memory/confusion limiting capacity for self-care

These could be modelled as a separate `ComplexityIndicator` enum or as flags on the package/assessment level.

---

## IAT Validated Scoring Tools (reference)

| Tool | What it measures | Score range |
|---|---|---|
| RUIS (Revised Urinary Incontinence Scale) | Urinary incontinence severity | 0–16 (ISI sub-score 0–12: 1–2 slight, 3–6 moderate, 8–12 severe) |
| RFIS (Revised Faecal Incontinence Scale) | Faecal incontinence severity | 0–20 |
| DEMMI (De Morton Mobility Index) | Mobility across clinical settings | Numeric (clinician-scored) |
| GP Cog (Step 1 & 2) | Cognitive screening | Pass/fail with clock drawing |
| KICA Cog / KICA Cog Regional Urban | Cognitive screening (First Nations) | Numeric |
| PHQ-4 (Patient Health Questionnaire-4) | Anxiety + depression screening | 0–12 |
| GDS (Geriatric Depression Scale) | Depression screening | Numeric |
| Duke SSI (Social Interaction Subscale) | Social support/interaction | Numeric |
| Good Spirit Good Life | Social/emotional wellbeing (First Nations) | 5-point ordinal per item |

---

## Recommendations

### Priority 1 — Add missing domains
- Add `COGNITIVE` and `PSYCHOLOGICAL` (split from `MENTAL_HEALTH`)
- Add `SOCIAL`
- Remap existing risk areas to new domains

### Priority 2 — Add missing risk categories
- Add the 9 IAT-aligned categories listed above
- Map each to appropriate clinical domain(s)

### Priority 3 — Consider complexity indicators
- Model IAT's 8 complexity flags — either as a `ComplexityIndicator` enum on the package or as a separate assessment section
- These are binary and don't need the full consequence/mitigation framework

### Not recommended
- Adopting IAT's scoring approach — Risk Radar's consequence + mitigation + traffic light is clinically superior
- Replacing existing categories — all 28 align well with IAT, just need additions
