---
title: "Mockup Summary: Clinical Pathways / Cases"
---

# Mockup Summary: Clinical Pathways / Cases

**Design Brief:** [design.md](../design.md) | **Spec:** [spec.md](../spec.md)

---

## Recommendations

### 1. Case List View

**Recommended: Option E — Table with Inline Status Row**

| Option | Pattern | Verdict |
|--------|---------|---------|
| A — Flat Table | CommonTable, matches Incidents | Good baseline but doesn't surface urgency |
| B — Status-Grouped | Overdue/Escalated/Active sections | Great for governance but custom layout |
| **E — Table + Alert Banner** | **CommonTable + overdue/escalated callout** | **Best of both: familiar table + urgency surfacing** |
| C — Dashboard Hybrid | Summary cards + table | Over-engineered for per-package view |
| D — Compact Cards | Linear-style compact list | Clean but not CommonTable |
| F — Tabbed Status | Active/Escalated/Closed tabs | Hides escalated cases behind tabs |

**Why Option E:**
- Uses standard CommonTable (consistency with Incidents tab)
- Alert banner at top surfaces overdue + escalated counts automatically
- Clinical leads see urgency at a glance without scanning the full table
- Banner only appears when there are overdue or escalated cases (not noisy)
- Easy to implement (existing components + conditional banner div)
- Aligns with "Transparency over efficiency" — most important info surfaces first

**Alternative worth considering:** Option B (Status-Grouped) if clinical leads prefer visual grouping over table sorting. Could be Phase 2 enhancement.

---

### 2. Create Case Form

**Recommended: Option C — Radio Cards for Case Type + Collapsible Optional Section**

| Option | Pattern | Verdict |
|--------|---------|---------|
| A — Single Column | All fields, flat list | Simple but type selection is just a dropdown |
| B — Grouped Sections | Required vs Optional headers | Better hierarchy but still dropdown for type |
| **C — Radio Cards** | **Type as radio cards with descriptions** | **Makes duty of care implication clear** |
| D — Two Column | Side-by-side fields | Unusual for TC Portal modals |
| E — Progressive Disclosure | Type first, then reveal form | Over-engineered for 6 fields |

**Why Option C:**
- Radio cards with descriptions force intentional type selection
- "Mandatory: Duty of care — cannot be closed without justification" is visible before selection
- Collapsible "Trigger & Links" section hides optional fields by default
- Review interval field dynamically hides when Self-Service is selected
- Aligns with "Transparency" — consequences are visible upfront
- Cliniko research: template-driven consistency matters for clinical data

---

### 3. Case Detail View

**Recommended: Option D — Sticky Header + Scrollable Body**

| Option | Pattern | Verdict |
|--------|---------|---------|
| A — Stacked Sections | Simple top-down scroll | Clean but loses header on scroll |
| B — Tabbed Sections | Header card + tabs | Hides info behind tabs — violates Transparency |
| C — Two-Panel | Info left, timeline right | Excellent but complex wide modal |
| **D — Sticky Header** | **Case identity pinned, body scrolls** | **Header always visible, review timeline scannable** |
| E — Assessment-First | Last review at top (APSO) | Smart but pushes concern below fold |

**Why Option D:**
- Sticky header keeps case type, status, next review, and actions visible while scrolling review history
- "Review" button always accessible — don't need to scroll back up
- Review history as cards is visually distinct and scannable
- Compact detail section (Type: Mandatory · Interval: 14d) saves space
- Standard modal width — no custom wide layout needed
- Aligns with "In control" emotion — key info never disappears

**Alternative worth considering:** Option C (Two-Panel) if review history gets long (20+ reviews). Could be Phase 2 upgrade for high-activity cases.

---

### 4. Review Form

**Recommended: Option B — Radio Cards for Outcome with Consequences**

| Option | Pattern | Verdict |
|--------|---------|---------|
| A — Dropdown + Textarea | Simple, minimal | No visibility into outcome consequences |
| **B — Radio Cards** | **Outcomes with consequence descriptions** | **"Escalate → Mandatory, weekly reviews" visible before selecting** |
| C — Button Group | Notes first, action buttons at bottom | Fast but no consequence preview |
| D — Context Panel | Case summary + form side-by-side | Overkill for 2-field form |
| E — Tab Toggle | Outcome tabs with inline consequence box | Non-standard, potentially confusing |

**Why Option B:**
- Radio cards show what each outcome does BEFORE the coordinator selects it
- "Escalate: Case → Mandatory, review interval resets to weekly" is critical information
- Prevents surprises — aligns with "Transparency over efficiency"
- Only 3 options — radio cards are the natural fit
- Closure reason field appears conditionally when "Close" is selected
- Mandatory case closure shows inline guidance about justification requirement

---

### 5. Empty State

**Recommended: Option B — Explanatory Text + Button**

| Option | Pattern | Verdict |
|--------|---------|---------|
| A — Simple Text | Icon + "No cases" + button | Matches existing pattern but unexplained |
| **B — Explanatory** | **Icon + description + triggers + button** | **Educates new users about what cases are** |
| C — Contextual | Uses risk/incident counts to suggest action | Smart but complex to implement |
| D — Quick-Start Cards | Three case type cards | Over-engineered for empty state |
| E — Minimal | Just icon + "No cases" | Too sparse, no guidance |

**Why Option B:**
- New feature — users need to understand what clinical cases are
- Mentions trigger types (incidents, assessments, clinical judgement)
- Not overly verbose — 3 lines of description
- CTA button in the empty area + header (both paths to create)
- Experienced users will rarely see this (cases accumulate quickly)

---

## Trade-off Matrix

| Criterion | List (E) | Create (C) | Detail (D) | Review (B) | Empty (B) |
|-----------|----------|------------|------------|------------|-----------|
| Familiarity | ★★★★★ | ★★★★☆ | ★★★★☆ | ★★★★☆ | ★★★★★ |
| Speed | ★★★★☆ | ★★★★☆ | ★★★★★ | ★★★★☆ | ★★★★★ |
| Transparency | ★★★★★ | ★★★★★ | ★★★★★ | ★★★★★ | ★★★★☆ |
| Consistency | ★★★★★ | ★★★☆☆ | ★★★★☆ | ★★★☆☆ | ★★★★★ |

**Familiarity**: How closely it matches existing TC Portal patterns
**Speed**: How fast users can complete the task
**Transparency**: How much information is visible without interaction
**Consistency**: How well it uses existing Common components

---

## Implementation Notes

- **Case List (E)**: CommonTable + conditional `<div>` banner above table. Banner uses `CommonBadge` with warning/error colours.
- **Create Form (C)**: Radio button group component (check if CommonRadioGroup exists, otherwise simple radio inputs with card styling). `v-show` for conditional fields.
- **Detail (D)**: Standard `CommonModal` with `position: sticky` on header div. Reviews rendered as `v-for` cards.
- **Review (B)**: Radio button group + conditional `v-show` for closure reason textarea.
- **Empty (B)**: Standard `CommonEmptyPlaceholder` with `text` and `description` props.

---

## Questions for Stakeholders

1. **Case list**: Should overdue cases sort to the top automatically, or respect the user's chosen sort order?
2. **Create form**: Should the "Mandatory" radio card show a stronger visual warning (e.g., red border) to reinforce the duty of care implication?
3. **Detail view**: When review history exceeds 10 entries, should older reviews be collapsed by default?
4. **Review form**: After saving a review, should the detail modal reopen with the new review visible, or return to the case list?
5. **Empty state**: Should the empty state text change based on whether the feature was recently enabled for the organisation? (e.g., "Clinical Cases is now available for your organisation")

---

## Next Steps

- [ ] Stakeholder review of recommended options
- [ ] `/trilogy-design-handover` — Gate 2 (design → dev)
- [ ] `/speckit-plan` update if design decisions change plan
- [ ] Implementation begins
