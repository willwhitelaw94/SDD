---
title: "Risk Radar — Idea Sketches"
description: "ASCII concept sketches for the Risk Radar visualisation"
---

# Risk Radar — Idea Sketches

Created: 2026-02-14

---

## 1. Radar Chart (Client Risk Profile)

```
                        Falls/Mobility
                             |
                            /|\
                           / | \
                          /  |  \
                         /   |   \
                        / ·--+--· \
              Environ- /·´   |    `·\ Medication
              ment    /·  ·--+--·   ·\  Safety
                     /·  ·´  |  `·   ·\
                    /· ·´    |    `·  ·\
         ─────────·──·───────┼────────·──·─────────
              Social \·  `·  |  ·´  ·/ Cognitive
                      \·  `·-+-·´  ·/
                       \·   `·´   ·/
                        \·   |   ·/
                         \·  |  ·/
                          `·-+-·´
                Mental      |      Skin/
                Health      |      Nutrition
                             |

         ┌─────────────────────────────────────────┐
         │  ── Current risk profile (solid)         │
         │  ·· Previous 90-day profile (dotted)     │
         │                                          │
         │  Zone colours:                           │
         │  ○ Inner   = Low (green)                 │
         │  ◎ Middle  = Medium (amber)              │
         │  ● Outer   = High (red)                  │
         │  ◉ Edge    = Critical (black)            │
         └─────────────────────────────────────────┘
```

---

## 2. Meta-Axis Groupings

8 radar axes grouping the 28 risk categories:

```
 Axis                  Categories Grouped
 ─────────────────────────────────────────────────
 Falls/Mobility        Falls, Activity Intolerance,
                       Emergency Evacuation
 Medication Safety     Medication, Allergies, Diabetes
 Cognitive             Cognition, Delirium, Behavioural
 Skin/Nutrition        Skin Integrity, Pressure Injury,
                       Wound, Hydration & Nutrition,
                       Choking/Aspiration, Oral Health
 Mental Health         Mental Health, Social Isolation,
                       Carer Burnout
 Social/Environment    In-home Safety, Fire/Emergency,
                       Hearing/Vision Loss
 Medical/Clinical      Medical, Infection, Pain,
                       Continence, Clinical Equipment
 Palliative            Palliative Care
```

---

## 3. Drill-Down (Click Axis)

```
 ┌──────────────────────────────────────────────┐
 │  ▼ Falls/Mobility (Score: 12/16 — HIGH)      │
 │  ┌──────────────────────────────────────────┐ │
 │  │ Falls              ████████████░░  12/16 │ │
 │  │ Activity Intol.    ██████░░░░░░░░   6/16 │ │
 │  │ Emergency Evac.    ████░░░░░░░░░░   4/16 │ │
 │  └──────────────────────────────────────────┘ │
 │                                                │
 │  Trend: ▲ +3 from 90 days ago                 │
 │  Linked Incidents: 2 (falls in bathroom)      │
 │  Last Review: 2026-01-15                      │
 └────────────────────────────────────────────────┘
```

---

## 4. Clinical Dashboard (POD-Level Heatmap)

```
 POD: Duck, Duck Go — 42 active clients
 ─────────────────────────────────────────────────
 Client          Fall  Med  Cog  Skin Mntl Soc  Med  Pall
 ─────────────────────────────────────────────────
 Margaret T.     ██▓▓ ░░░░ ▓▓░░ ░░░░ ░░░░ ░░░░ ▓▓░░ ░░░░
 Arthur K.       ████ ▓▓░░ ████ ░░░░ ▓▓░░ ░░░░ ░░░░ ░░░░  ⚠
 Dorothy P.      ▓▓░░ ████ ░░░░ ▓▓░░ ░░░░ ░░░░ ████ ░░░░  ⚠
 Frank M.        ░░░░ ░░░░ ░░░░ ████ ░░░░ ▓▓░░ ░░░░ ████  🔴
 Jean W.         ▓▓░░ ░░░░ ░░░░ ░░░░ ████ ████ ░░░░ ░░░░  ⚠
 ─────────────────────────────────────────────────
 ░░ Low   ▓▓ Medium   ██ High   🔴 Critical   ⚠ Trending up
```

---

## 5. Risk Score Badge (Client Profile Header)

```
 ┌──────────────────────────────────────────────────────────┐
 │  Margaret Thompson          DOB: 12/03/1938  (87)        │
 │  HCP Level 4 — PKG-4521    POD: Duck, Duck Go            │
 │                                                          │
 │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐ │
 │  │ Risk     │  │ Needs    │  │ Incidents│  │ Budget   │ │
 │  │  ██ 7.2  │  │  ○ 14    │  │  ▲ 3     │  │  $48,200 │ │
 │  │  HIGH    │  │  Active  │  │  Open    │  │  76% used│ │
 │  └──────────┘  └──────────┘  └──────────┘  └──────────┘ │
 └──────────────────────────────────────────────────────────┘

 Risk badge colour:
   0-4   = ░░ green  (Low)
   5-8   = ▓▓ amber  (Medium)     ← Margaret is here
   9-12  = ██ red    (High)
   13-16 = ██ black  (Critical)
```

---

## 6. Trend Sparkline (Compact History)

```
 Risk trend — last 6 months

 Falls/Mobility:   ▁▂▃▅▇█  ↑ Worsening
 Medication:       ▇▅▃▂▁▁  ↓ Improving
 Cognitive:        ▃▃▃▃▃▅  → Stable (slight uptick)
 Skin/Nutrition:   ▁▁▁▁▁▁  → Stable (low)
 Mental Health:    ▁▁▃▅▇█  ↑ Worsening — flagged for review

 ┌─────────────────────────────────────────┐
 │  ⚠ 2 domains trending up > 3 months    │
 │  Auto-flagged for clinical review       │
 │  Next review due: 2026-02-28            │
 └─────────────────────────────────────────┘
```

---

## 7. Risk Matrix Scoring (Per Category)

```
                  SEVERITY
                  Minor(1)  Moderate(2)  Major(3)  Severe(4)
               ┌─────────┬───────────┬──────────┬──────────┐
 L  Likely(4)  │    4    │     8     │    12    │    16    │
 I             │  Medium │   High    │ Critical │ Critical │
 K             ├─────────┼───────────┼──────────┼──────────┤
 E  Possible(3)│    3    │     6     │     9    │    12    │
 L             │   Low   │  Medium   │   High   │ Critical │
 I             ├─────────┼───────────┼──────────┼──────────┤
 H  Unlikely(2)│    2    │     4     │     6    │     8    │
 O             │   Low   │   Low     │  Medium  │   High   │
 O             ├─────────┼───────────┼──────────┼──────────┤
 D  Rare(1)    │    1    │     2     │     3    │     4    │
               │   Low   │   Low     │   Low    │  Medium  │
               └─────────┴───────────┴──────────┴──────────┘

 Score = Severity × Likelihood
 Overall client risk = max(all category scores) or weighted average
```

---

## 8. Radar Comparison View (Before/After Intervention)

```
 Margaret T. — Falls Intervention Impact (3 months)

                    Falls/Mobility
                         |
                        /|\
                  ····/··|··\····        ·· = Pre-intervention (Oct)
                  ·· /   |   \ ··
            Env──/──·····+··  \──Medication
                /  / ····|···· \  \
               / ·/ ─────+───── \· \
              / ·/  /    |    \  \· \      ── = Post-intervention (Jan)
         ────·─/───·─────┼─────·───\─·────
              \·\   \    |    /  /·/
               \ ·\  \   |   /  /· /
                \  \ ──── +────  /  /
            Soc──\──·····+··  /──Cognitive
                  ·· \   |   / ··
                  ····\··|··/····
                Mental   |   Skin/
                Health   |   Nutrition

 ┌──────────────────────────────────────────┐
 │  Falls axis: 14 → 8  (▼ 43% reduction)  │
 │  Overall:    9.2 → 6.1  (▼ 34%)         │
 │                                          │
 │  Key changes:                            │
 │  + OT home assessment completed          │
 │  + Grab rails installed (bathroom)       │
 │  + Physio 2x/week started                │
 │  + Medication review (dizziness med adj) │
 └──────────────────────────────────────────┘
```

---

## 9. Risk Notification Card (Auto-Escalation)

```
 ┌─ ⚠ RISK ESCALATION ──────────────────────────────┐
 │                                                    │
 │  Arthur K. (PKG-3892)                             │
 │  POD: Duck, Duck Go — Care Partner: Sarah M.      │
 │                                                    │
 │  Falls/Mobility risk increased to CRITICAL (14)    │
 │  ├── 2 falls in 7 days (Feb 7, Feb 12)           │
 │  ├── Latest incident: fall in bathroom, no injury │
 │  └── Previous score: 8 (High) → Now: 14 (Critical)│
 │                                                    │
 │  ┌────────────────────────────────────────────┐   │
 │  │ Required Actions:                          │   │
 │  │ □ Clinical review within 24 hours          │   │
 │  │ □ Update risk profile                      │   │
 │  │ □ Notify GP / allied health                │   │
 │  │ □ Review care plan interventions           │   │
 │  └────────────────────────────────────────────┘   │
 │                                                    │
 │  [ Acknowledge ]  [ View Risk Profile ]  [ Snooze ]│
 └────────────────────────────────────────────────────┘
```

---

## 10. Organisation-Wide Risk Summary (Executive View)

```
 Trilogy Care — Risk Summary — February 2026
 ═══════════════════════════════════════════════════

 Total Active Clients: 2,547
 Clients with Risk Profile: 2,312 (91%)

 RISK DISTRIBUTION
 ─────────────────────────────────────────────
 Critical (13-16)  ██░░░░░░░░░░░░░░░░░░   23  (1%)
 High (9-12)       ██████████░░░░░░░░░░  287  (12%)
 Medium (5-8)      ████████████████░░░░  891  (39%)
 Low (1-4)         ████████████████████ 1111  (48%)
 ─────────────────────────────────────────────

 TOP RISK CATEGORIES (by prevalence)
 ─────────────────────────────────────────────
 1. Falls/Mobility      ████████████████  68%
 2. Medication Safety   ██████████████    57%
 3. Cognitive           ████████████      49%
 4. Skin/Nutrition      ████████          34%
 5. Mental Health       ██████            26%

 TRENDING UP (last 30 days)
 ─────────────────────────────────────────────
 Falls/Mobility    ▲ +4.2%   (winter season)
 Mental Health     ▲ +2.8%   (social isolation)
 Medication        ▼ -1.3%   (med review program working)

 POD COMPARISON
 ─────────────────────────────────────────────
 POD                 Avg Score   Critical   Trending
 Duck, Duck Go       6.4         3          ▲ +0.8
 Phoenix Rising      5.8         2          → stable
 Starfish Squad      7.1         5          ▲ +1.2  ⚠
 Ocean Breeze        5.2         1          ▼ -0.4

 ⚠ Starfish Squad: highest avg risk + most criticals — review
```

---

## 11. Maslow-Risk Overlay

```
 Maslow Pyramid with Risk Intensity Overlay

              /\
             /  \
            / ·· \          Self-Actualisation
           / ·  · \         Goals & Wellbeing | Palliative
          /········\        Risk: ░░ 2.1 (Low)
         /──────────\
        /   ·····    \      Esteem
       /  ··     ··   \    Independence | Communication
      /  ·         ·   \   Risk: ▓▓ 5.4 (Medium)
     /──────────────────\
    /    ····     ····   \  Belonging
   /   ··    ·····   ··  \ Social | Cultural | Family
  /   ·                ·  \Risk: ▓▓ 6.8 (Medium)
 /────────────────────────\
 /   ·······    ·······    \ Safety
/  ··       ····       ··   \Home | Emergency | Financial
/ ·                      ·  \Risk: ██ 9.2 (High)
/────────────────────────────\
/  ···········  ···········   \ Physiological
/ ··                       ·· \Nutrition | Hygiene | Mobility | Meds
/·                            ·\Risk: ██ 11.4 (High)
/──────────────────────────────\

 Darker fill = higher aggregate risk at that Maslow level
 Click any level to expand into the radar view for those categories
```

---

## 12. Mobile-Friendly Risk Summary Card

```
 ┌─── Risk Radar (compact) ────────────┐
 │                                      │
 │  Margaret T.         Overall: ▓▓ 7.2 │
 │                                      │
 │  Fall ████████████░░░░  12  Critical │
 │  Med  ████████░░░░░░░░   8  High    │
 │  Cog  ████░░░░░░░░░░░░   4  Low     │
 │  Skin ██░░░░░░░░░░░░░░   2  Low     │
 │  Mntl ██████░░░░░░░░░░   6  Medium  │
 │  Soc  ░░░░░░░░░░░░░░░░   1  Low     │
 │  Clin ████░░░░░░░░░░░░   4  Low     │
 │  Pall ░░░░░░░░░░░░░░░░   0  None    │
 │                                      │
 │  ⚠ Falls trending up — review due    │
 │                                      │
 │  [ Full Radar ]  [ History ]         │
 └──────────────────────────────────────┘
```

---

## 13. Client Self-Assessment Flow (Marianne's Evidence-Based Input)

```
 ┌─── Self-Assessment: Falls ──────────────────────┐
 │                                                   │
 │  Step 1 of 4                                     │
 │                                                   │
 │  Have you had a fall in the last 6 months?       │
 │                                                   │
 │  ┌─────────┐  ┌─────────┐  ┌──────────────────┐ │
 │  │   Yes   │  │   No    │  │ Prefer not to say│ │
 │  └─────────┘  └─────────┘  └──────────────────┘ │
 │                                                   │
 │  ──────────────────────────────────────────────  │
 │                                                   │
 │  If YES:                                         │
 │                                                   │
 │  Did the fall result in hospitalisation?          │
 │  ○ Yes — admitted     (+3 severity)              │
 │  ○ Yes — ED only      (+2 severity)              │
 │  ○ No — minor injury  (+1 severity)              │
 │  ○ No — no injury     (+0 severity)              │
 │                                                   │
 │                          [ Next → ]               │
 └───────────────────────────────────────────────────┘

 Scoring builds automatically:
 Q1: Fall history?     → Likelihood factor
 Q2: Hospitalisation?  → Severity factor
 Q3: Fear of falling?  → Behavioural modifier
 Q4: Home hazards?     → Environmental modifier
 Result: Falls score = 12/16 (Critical)
```

---

---

# REFINED MODEL — 5 Home Care Risk Domains

Updated 2026-02-14 after discussion. The radar/bar visualisation focuses on
**5 home care risk domains** (not 28 individual categories). Individual categories
feed into domains. Composite score is the headline; radar/bar is the detail.

---

## 14. The 5 Domains

```
 Domain                    What it covers                          Existing categories that feed in
 ──────────────────────────────────────────────────────────────────────────────────────────────────
 1. Physical Safety        Falls, mobility, home environment,      Falls, Activity Intolerance,
                           emergency evacuation                    Emergency Evac, In-home Safety,
                                                                   Fire/Emergency

 2. Clinical Health        Medication, medical conditions,         Medication, Medical, Diabetes,
                           infections, pain, clinical equipment    Infection, Pain, Allergies,
                                                                   Clinical Equipment

 3. Functional Capacity    Cognition, continence, skin integrity,  Cognition, Delirium, Continence,
                           nutrition, oral health, wounds          Skin, Pressure Injury, Wound,
                                                                   Hydration/Nutrition, Choking,
                                                                   Oral Health, Hearing/Vision

 4. Psychosocial           Mental health, social isolation,        Mental Health, Social Isolation,
                           carer burnout, behavioural              Behavioural, Carer Burnout

 5. End of Life &          Palliative care, advance care           Palliative Care
    Complex Care           planning, complex multi-morbidity
```

---

## 15. Risk Assessment Matrix — 5×5 (Aged Care Standard)

Two reference matrices inform our approach.

### Matrix A: Numeric Scored (for the scoring engine)

```
                         CONSEQUENCE
                  Insignif(1)  Minor(2)  Moderate(3)  Major(4)  Catastrophic(5)
               ┌───────────┬─────────┬────────────┬──────────┬───────────────┐
 L  Almost     │     5     │   10    │     15     │    20    │      25       │
 I  certain(5) │  Moderate │  High   │  Extreme   │ Extreme  │   Extreme     │
 K             ├───────────┼─────────┼────────────┼──────────┼───────────────┤
 E  Likely(4)  │     4     │    8    │     12     │    16    │      20       │
 L             │  Moderate │  High   │   High     │ Extreme  │   Extreme     │
 I             ├───────────┼─────────┼────────────┼──────────┼───────────────┤
 H  Possible(3)│     3     │    6    │      9     │    12    │      15       │
 O             │   Low     │ Moderate│   High     │  High    │   Extreme     │
 O             ├───────────┼─────────┼────────────┼──────────┼───────────────┤
 D  Unlikely(2)│     2     │    4    │      6     │     8    │      10       │
               │   Low     │ Moderate│  Moderate  │  High    │    High       │
               ├───────────┼─────────┼────────────┼──────────┼───────────────┤
    Rare(1)    │     1     │    2    │      3     │     4    │       5       │
               │   Low     │  Low    │    Low     │ Moderate │   Moderate    │
               └───────────┴─────────┴────────────┴──────────┴───────────────┘

 Score = Likelihood × Consequence  (range 1-25)

 Zones:
   1-3    Low       (green)     → Routine monitoring
   4-6    Moderate  (yellow)    → Active management
   8-12   High      (orange)    → Clinical involvement within 48h
   15-25  Extreme   (red)       → Immediate clinical escalation
```

### Matrix B: Simplified 3-Zone (for the care partner UI)

```
                         CONSEQUENCES
              Insignif  Minor   Moderate  Major   Catastrophic
           ┌─────────┬───────┬──────────┬───────┬──────────────┐
 Almost    │░░ Low   │▓▓ Med │██ HIGH   │██ HIGH│██ HIGH       │
 certain   │         │       │          │       │              │
           ├─────────┼───────┼──────────┼───────┼──────────────┤
 Likely    │░░ Low   │▓▓ Med │██ HIGH   │██ HIGH│██ HIGH       │
           │         │       │          │       │              │
           ├─────────┼───────┼──────────┼───────┼──────────────┤
 Possible  │░░ Low   │▓▓ Med │▓▓ Med   │██ HIGH│██ HIGH       │
           │         │       │          │       │              │
           ├─────────┼───────┼──────────┼───────┼──────────────┤
 Unlikely  │░░ Low   │░░ Low │▓▓ Med   │▓▓ Med │██ HIGH       │
           │         │       │          │       │              │
           ├─────────┼───────┼──────────┼───────┼──────────────┤
 Rare      │░░ Low   │░░ Low │▓▓ Med   │▓▓ Med │▓▓ Med        │
           │         │       │          │       │              │
           └─────────┴───────┴──────────┴───────┴──────────────┘

 UX: Care partners see Low/Medium/High only.
 Numeric score (1-25) runs under the hood for trending and automation.
 Clinical dashboard can toggle to see numeric scores.
```

---

## 16. Prevalence × Impact Per Domain

Each of the 5 domains gets scored on two axes:

```
 PREVALENCE                              IMPACT
 "How present is this risk?"             "How bad if it materialises?"
 ─────────────────────────────           ─────────────────────────────
 1 = Not identified / absent             1 = Insignificant — no lasting effect
 2 = Low / single factor                 2 = Minor — temporary, self-resolving
 3 = Possible / multiple factors         3 = Moderate — intervention needed, recoverable
 4 = Likely / well-established           4 = Major — significant harm, extended recovery
 5 = Almost certain / pervasive          5 = Catastrophic — life-threatening, permanent

 Domain Score = Prevalence × Impact  (1-25)

 Example: Margaret T.
 ┌───────────────────────────┬─────┬────────┬───────┬──────────┐
 │ Domain                    │ P   │ I      │ Score │ Zone     │
 ├───────────────────────────┼─────┼────────┼───────┼──────────┤
 │ Physical Safety           │ 4   │ 4      │ 16    │ Extreme  │
 │ Clinical Health           │ 3   │ 3      │  9    │ High     │
 │ Functional Capacity       │ 3   │ 2      │  6    │ Moderate │
 │ Psychosocial              │ 2   │ 2      │  4    │ Moderate │
 │ End of Life               │ 1   │ 1      │  1    │ Low      │
 └───────────────────────────┴─────┴────────┴───────┴──────────┘

 Composite = weighted avg or max-dominant (TBD with Marianne)
```

---

## 17. Radar vs Bar — Toggle Views

```
 ┌─── RADAR VIEW ─────────────────────┐  ┌─── BAR VIEW ──────────────────────────┐
 │                                     │  │                                        │
 │       Physical Safety               │  │  Physical Safety                       │
 │            ╱|╲                      │  │  P ████████████████░░░░░  4            │
 │           / | \                     │  │  I ████████████████░░░░░  4            │
 │          /  |  \                    │  │  = █████████████████████████████░ 16 E  │
 │ End of  /   |   \ Clinical         │  │                                        │
 │ Life   / ·--+--· \ Health          │  │  Clinical Health                       │
 │       / ·   |   · \                │  │  P ████████████░░░░░░░░░  3            │
 │ ─────·──────┼──────·─────          │  │  I ████████████░░░░░░░░░  3            │
 │       \ ·   |   · /                │  │  = █████████████████░░░░░░░░░  9  H    │
 │        \ ·--+--· /                 │  │                                        │
 │  Psycho-\  |   / Functional        │  │  Functional Capacity                   │
 │  social  \ |  /  Capacity          │  │  P ████████████░░░░░░░░░  3            │
 │           \| /                      │  │  I ████████░░░░░░░░░░░░  2            │
 │            |                        │  │  = ████████████░░░░░░░░░░░░░  6  M    │
 │                                     │  │                                        │
 │  Composite: 9.6 (High)             │  │  Psychosocial                          │
 │                                     │  │  P ████████░░░░░░░░░░░░  2            │
 │  ░░ Low  ▓▓ Moderate               │  │  I ████████░░░░░░░░░░░░  2            │
 │  ██ High ██ Extreme                │  │  = ████████░░░░░░░░░░░░░░░░░  4  M    │
 │                                     │  │                                        │
 │  [ Switch to Bar ]                 │  │  End of Life                           │
 │                                     │  │  P ████░░░░░░░░░░░░░░░░  1            │
 └─────────────────────────────────────┘  │  I ████░░░░░░░░░░░░░░░░  1            │
                                          │  = ████░░░░░░░░░░░░░░░░░░░░░  1  L    │
                                          │                                        │
                                          │  Composite: 9.6 (High)                │
                                          │  [ Switch to Radar ]                   │
                                          └────────────────────────────────────────┘
```

---

## 18. Per-Domain Matrix Drill-Down (Interactive)

When you click a domain on the radar/bar, you get the matrix for that domain:

```
 ┌─── Physical Safety — Score: 16 (Extreme) ────────────────────────┐
 │                                                                    │
 │  Individual risks in this domain:                                 │
 │                                                                    │
 │  Risk             Prevalence   Impact   Score   Zone              │
 │  ─────────────────────────────────────────────────────            │
 │  Falls            4 (Likely)   4 (Major) → 16   Extreme  ⬤       │
 │  Activity Intol.  3 (Possible) 2 (Minor) →  6   Moderate ⬤       │
 │  Emergency Evac.  2 (Unlikely) 3 (Mod)   →  6   Moderate ⬤       │
 │  In-home Safety   3 (Possible) 3 (Mod)   →  9   High     ⬤       │
 │  Fire/Emergency   1 (Rare)     2 (Minor) →  2   Low      ⬤       │
 │                                                                    │
 │  ┌─── Matrix (this domain) ───────────────────────────────────┐  │
 │  │                                                             │  │
 │  │            Insig   Minor   Mod    Major   Catastrophic     │  │
 │  │  Almost    ░  5    ░ 10   ▓ 15   █ 20    █ 25             │  │
 │  │  certain                                                    │  │
 │  │  Likely    ░  4    ▓  8   ▓ 12   █ 16◄   █ 20             │  │
 │  │                                   Falls                     │  │
 │  │  Possible  ░  3    ▓  6◄  ▓  9◄  ▓ 12    █ 15             │  │
 │  │                  ActInt  InHome                              │  │
 │  │  Unlikely  ░  2    ░  4   ▓  6◄  ▓  8    ▓ 10             │  │
 │  │                         EmEvac                               │  │
 │  │  Rare      ░  1    ░  2◄  ░  3   ░  4    ▓  5             │  │
 │  │                  Fire                                        │  │
 │  └─────────────────────────────────────────────────────────────┘  │
 │                                                                    │
 │  Domain score = max(16) or avg(7.8) — configurable               │
 │                                                                    │
 │  [ Edit Scores ]  [ View Trends ]  [ Back to Radar ]             │
 └────────────────────────────────────────────────────────────────────┘

 ◄ = individual risk plotted on the matrix
 Each dot is clickable → opens the full risk detail card
```

---

## 19. Composite Score Calculation Options

```
 5 domains, each scored 1-25. How do we get one number?

 Option A: Weighted Average
 ─────────────────────────────────────────────────────
 Domain              Score   Weight   Weighted
 Physical Safety       16    × 1.2  =  19.2
 Clinical Health        9    × 1.2  =  10.8
 Functional Capacity    6    × 1.0  =   6.0
 Psychosocial           4    × 0.8  =   3.2
 End of Life            1    × 0.8  =   0.8
                              ─────    ─────
                              5.0      40.0
 Composite = 40.0 / 5.0 = 8.0 (High)

 Weights reflect aged care priorities:
 Physical Safety + Clinical = highest (most incidents, most harm)
 Psychosocial + End of Life = lower weight (smaller cohort, less frequent)


 Option B: Max-Dominant Hybrid
 ─────────────────────────────────────────────────────
 Composite = (max_domain × 0.6) + (avg_all × 0.4)
           = (16 × 0.6) + (7.2 × 0.4)
           = 9.6 + 2.88
           = 12.5 (Extreme)

 Ensures a single extreme domain drives the score UP.
 A client with one catastrophic domain can't be "averaged away".


 Option C: Simple Average (most transparent)
 ─────────────────────────────────────────────────────
 Composite = (16 + 9 + 6 + 4 + 1) / 5 = 7.2 (High)

 Easy to explain. But hides that Physical Safety is Extreme.


 RECOMMENDATION: Option B (Max-Dominant)
 ─────────────────────────────────────────────────────
 - One extreme domain should dominate the composite
 - Prevents "averaging away" critical risks
 - The radar/bar view shows the detail anyway
 - Badge shows: "12.5 Extreme" — care partner knows to look deeper
 - Clinical dashboard can show both max and avg for governance
```

---

## 20. Package Risk Tab — Full Layout

```
 ┌──────────────────────────────────────────────────────────────────┐
 │  Risk Profile                                       [+ Add Risk] │
 │                                                                   │
 │  ┌─── Composite Score ──────────────────────────────────────────┐│
 │  │                                                               ││
 │  │  ██ 12.5  EXTREME            Last assessed: 3 days ago       ││
 │  │  ██████████████████████████████████████████████████░░░░░░░░  ││
 │  │  0     Low(5)    Moderate(10)    High(15)    Extreme(25)     ││
 │  │                                                               ││
 │  │  Calculated from: max-dominant hybrid (Physical Safety: 16)  ││
 │  └───────────────────────────────────────────────────────────────┘│
 │                                                                   │
 │  ┌─── Domain Breakdown ──────────── [Radar ○ | Bar ●] ─────────┐│
 │  │                                                               ││
 │  │  (radar or bar chart of 5 domains — toggle)                  ││
 │  │  Each axis/bar shows: domain score (P × I)                   ││
 │  │  Click any domain → matrix drill-down (sketch 18)            ││
 │  │                                                               ││
 │  └───────────────────────────────────────────────────────────────┘│
 │                                                                   │
 │  ┌─── Individual Risks (grouped by domain) ─────────────────────┐│
 │  │                                                               ││
 │  │  ▼ Physical Safety (3 risks)              Domain: 16 Extreme ││
 │  │    ┌──────────────────────────────────────────────────────┐  ││
 │  │    │ Falls           P:4 I:4 = 16 Extreme   ▲ trending   │  ││
 │  │    │ In-home Safety  P:3 I:3 =  9 High      → stable     │  ││
 │  │    │ Activity Intol. P:3 I:2 =  6 Moderate  → stable     │  ││
 │  │    └──────────────────────────────────────────────────────┘  ││
 │  │                                                               ││
 │  │  ▼ Clinical Health (2 risks)              Domain:  9 High    ││
 │  │    ┌──────────────────────────────────────────────────────┐  ││
 │  │    │ Medication      P:3 I:3 =  9 High      ▼ improving  │  ││
 │  │    │ Diabetes        P:2 I:2 =  4 Moderate  → stable     │  ││
 │  │    └──────────────────────────────────────────────────────┘  ││
 │  │                                                               ││
 │  │  ► Functional Capacity (4 risks)          Domain:  6 Moderate││
 │  │  ► Psychosocial (1 risk)                  Domain:  4 Moderate││
 │  │  ► End of Life (0 risks)                  Domain:  1 Low     ││
 │  │                                                               ││
 │  └───────────────────────────────────────────────────────────────┘│
 └──────────────────────────────────────────────────────────────────┘
```

---

## 21. Prevalence vs Impact — Dual Bar (Per Domain Detail)

```
 Physical Safety — Prevalence vs Impact Breakdown

 Falls
   Prevalence  ████████████████████  4 (Likely)
   Impact      ████████████████████  4 (Major)
                                     Score: 16 Extreme

 In-home Safety
   Prevalence  ███████████████░░░░░  3 (Possible)
   Impact      ███████████████░░░░░  3 (Moderate)
                                     Score: 9 High

 Activity Intolerance
   Prevalence  ███████████████░░░░░  3 (Possible)
   Impact      ██████████░░░░░░░░░░  2 (Minor)
                                     Score: 6 Moderate

 Emergency Evacuation
   Prevalence  ██████████░░░░░░░░░░  2 (Unlikely)
   Impact      ███████████████░░░░░  3 (Moderate)
                                     Score: 6 Moderate

 Fire/Emergency
   Prevalence  █████░░░░░░░░░░░░░░░  1 (Rare)
   Impact      ██████████░░░░░░░░░░  2 (Minor)
                                     Score: 2 Low

 ┌──────────────────────────────────────────────────┐
 │ Insight: Falls dominates this domain.             │
 │ High prevalence AND high impact = Extreme.        │
 │ Other risks are well-managed.                     │
 │                                                    │
 │ Where P ≫ I: "happening often but not too bad"   │
 │ Where I ≫ P: "rare but devastating when it does" │
 └──────────────────────────────────────────────────┘
```

---

## Design Notes

- **5 domains, not 28 categories** — radar/bar shows domains; drill-down shows categories
- **5×5 matrix** (1-25 range) — standard aged care risk assessment
- **Two matrix modes**: Numeric scored (engine) + 3-zone simplified (care partner UX)
- **Prevalence × Impact** = domain score — two clear dimensions, not abstract "likelihood"
- **Composite score**: Max-dominant hybrid recommended — one extreme domain can't be averaged away
- **Toggle radar/bar**: Radar for pattern recognition, bar for precise numbers
- **Matrix drill-down**: Click domain → see individual risks plotted on 5×5 matrix
- Radar gives **10-second read** on any client's risk landscape
- Heatmap gives POD leaders **whole-of-caseload** view
- Click anything to drill into detail
- Trend overlay (dotted line) shows risk trajectory over time
- Colour zones match the documented risk matrix
- Mobile card (sketch 12) is the fallback for the full radar on small screens
- Maslow overlay (sketch 11) bridges the gap between NeedsV2 and Risk Radar
- Self-assessment (sketch 13) is Marianne's evidence-based scoring input
- Comparison view (sketch 8) is powerful for care plan reviews — "did the intervention work?"
- Executive view (sketch 10) is for quarterly governance reporting and BRP sessions
- Notification card (sketch 9) replaces Teams tagging for clinical escalation
