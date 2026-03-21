---
title: "Design Brief: Risk Radar"
status: Draft
created: 2026-03-05
---

# Design Brief: Risk Radar

**Epic:** RRA — Risk Radar
**Spec:** [spec.md](./spec.md)

---

## User Context

| Aspect | Answer | Impact on Design |
|--------|--------|------------------|
| Primary User | Care Partner (field-based, managing client risks daily) | Needs quick scanning, clear status indicators, minimal clicks to understand risk picture |
| Secondary User | Coordinator (supports care partners, manages risk data) | Needs efficient data entry (step form), bulk scanning of risks across clients |
| Clinical User | Clinician (mitigation assessment, clinical overrides) | Needs structured decision prompts, audit-defensible override workflow |
| Consumer | POD Leader (cross-client oversight) | Needs traffic-light summary, sorting by risk status, at-a-glance dashboard |
| Device Priority | Desktop-first | Can use full-width card layouts, radar charts, multi-column drill-downs |
| Usage Frequency | Daily (Care Partners), weekly (Clinicians for assessment review) | Invest in scannability — users will see this page repeatedly |
| Context | Time-pressured, multitasking across multiple clients | Traffic-light must communicate in < 5 seconds. Cards must be scannable without reading every field |

---

## Design Principles

**North Star:** Clinical confidence at a glance

The design should let care partners and clinicians trust the system's risk assessment instantly — clear, evidence-based, no ambiguity. A care partner glancing at a client's risk tab should know within seconds: stable, needs monitoring, or needs action now.

**Supporting Principles:**

1. **Progressive disclosure** — Show the simple answer first (traffic-light badge, card summary), let users drill into complexity (accordion, assessment modal, radar chart) only when they need it
2. **Whole client, not isolated risks** — Every design element should connect individual risks to the broader client picture. The radar chart and domain grouping reinforce this
3. **Trust through transparency** — Show how scores are calculated (consequence - mitigation = residual). Don't hide the logic. Clinicians need to trust and override the system
4. **Consistency with existing patterns** — Use Common components, existing colour conventions, and established TC Portal interaction patterns (modals for edit, cards for display, collapsibles for detail)

---

## Build Size

**Size:** Large (L)

**Rationale:**
- 6+ distinct screens/views: All Risks cards, Risk Radar sub-tab, assessment modal, step-based risk form (3 steps), view modal, drill-down
- New interaction patterns: drag-and-drop question reorder, radar/bar chart toggle, domain drill-down
- New visualisation: radar (spider) chart and bar chart — no existing chart component covers this
- Complex state management: two independent feature flags, progressive badge display, step form with conditional steps

**Existing patterns reused:**
- CommonCard, CommonCollapsible, CommonBadge, CommonButton, CommonTabs, CommonStepNavigation, CommonConfirmDialog, CommonDefinitionList
- Modal pattern (Inertia::modal)
- Feature flag pattern (CarePartnerCheckInsFeature, new Risk Radar flag)

**New components needed:**
- RiskCard — card wrapper for individual risks with accordion
- RiskRadarChart — radar (spider) chart for 5 domains
- RiskBarChart — horizontal bar chart alternative
- TrafficLightBadge — Green/Amber/Red status indicator (reusable)
- ConsequenceAssessmentModal — questionnaire flow for risk area scoring
- MitigationAssessmentSection — domain mitigation with decision prompts

---

## Scope

**Full Phase 1 — included in this design:**

- Card-based risk layout (replacing DataTable) on All Risks tab
- Step-based risk form (3 steps: Basics, Details, Check-In Questions)
- Check-in questions accordion on risk cards (feature-flagged to Check-Ins flag)
- Drag-and-drop question reorder in accordion
- Consequence assessment modal (16 risk areas, questionnaire-based)
- Mitigation assessment per domain (Strong/Partial/None with decision prompts)
- Residual risk calculation (max consequence - mitigation)
- Traffic-light badge on package risk profile header
- Risk Radar sub-tab with radar chart and bar chart toggle
- Domain drill-down from chart to individual risk areas
- Domain grouping on Risk Radar view
- Consequence badges on risk cards (progressive — shown when assessed)
- Feature flag per organisation (Risk Radar flag)
- Soft delete for risks (audit trail preservation)
- View modal with check-in questions section

**Deferred (Phase 2+):**

- Trend tracking and sparklines (historical score changes)
- Clinical dashboard / POD heatmap (cross-client aggregation)
- Auto-escalation and notifications
- Incident-to-risk score integration (depends on ICM)
- System-driven auto-calculation
- Maslow-risk mapping overlay
- Intervention comparison (before/after radar)

**Feature Flags:**

- `CarePartnerCheckInsFeature` (existing) — Controls check-in questions accordion visibility on risk cards and Step 3 in the form
- Risk Radar feature flag (new, FR-028) — Controls scoring, radar chart, traffic-light badge, assessment questionnaire, domain grouping. Independent of Check-Ins flag

---

## Constraints

### Accessibility
- **WCAG Target:** Level AA
- **Keyboard navigation:** Required for all interactive elements (card actions, accordion expand/collapse, step navigation, chart interaction)
- **Traffic-light colours:** Must be supplemented with text labels (Green/Amber/Red) and icons — not colour alone. Standard WCAG AA contrast ratios
- **Screen reader:** Semantic HTML for cards, ARIA labels on chart elements, announce traffic-light status changes

### Security & Privacy
- **Sensitive data:** Clinical risk assessments, consequence scores, mitigation ratings — all clinical data with audit requirements
- **Permissions:** `manage-risks` permission gates all write actions (create, edit, delete, assess). Read access follows existing package visibility rules
- **Audit trail:** All assessment changes (consequence, mitigation, overrides) recorded with user, timestamp, and rationale

### Dependencies
- **Depends on:** Existing risk CRUD infrastructure, RiskCategory model (28 categories), CarePartnerCheckInsFeature flag, RiskCheckInQuestion model
- **New dependencies:** Radar/spider chart library (likely Chart.js with radar type, or custom SVG)
- **Blocks:** Phase 2 trend tracking (needs assessment history from Phase 1)

### Data Constraints
- **28 existing risk categories** — All remain functional. 16 map to clinical risk areas for the radar
- **Existing risks have no scores** — All display as "Not assessed" on enable. No migration needed — scores are additive
- **Domain mapping is code-managed** — Seeded, not admin-configurable. Changes via releases only

---

## Edge Cases

| Edge Case | How to Handle | Priority |
|-----------|---------------|----------|
| No risks on package | Empty state with "Add a risk" prompt | P1 |
| Risk has 10+ check-in questions | Accordion scrolls internally, all visible when expanded | P1 |
| Check-Ins flag OFF, risk has existing questions | Hide accordion entirely. Data preserved, reappears on flag ON | P1 |
| Risk Radar flag OFF | Show cards without scoring, badges, radar. Standard All Risks view | P1 |
| Both flags OFF | Standard risk cards without accordion or scoring | P1 |
| All 16 risk areas unassessed | Radar empty state: "Assess your client's risks to see the Risk Radar" | P1 |
| Domain has mix of assessed/unassessed | Calculate from assessed only. Show "2 of 5 assessed" indicator | P1 |
| Category has no conditional fields | Step 2 skipped in form | P1 |
| "Not identified during assessment" toggled | Step 2 skipped, Step 3 still available | P1 |
| Category changed after Step 2 filled | Confirmation prompt, Step 2 data resets | P2 |
| Risk area in multiple domains (e.g., Falls) | Score contributes to each domain independently | P2 |
| Clinician overrides mitigation | Requires documented rationale. Audit trail captures both values | P1 |
| Partially completed assessment dismissed | Save partial progress. Incomplete areas remain "Not assessed" | P2 |
| Questionnaire response doesn't match client | "Select highest relevant consequence level" guidance + rationale field | P2 |
| Soft-deleted risk | Archived, hidden from cards, preserved in audit. Assessment data retained | P1 |
| Unmapped category (12 of 28) | No Assess button, no consequence badge. Standard card only | P1 |
| Post-create prompt for questions | "Risk saved — add check-in questions?" → reopens at Step 3 | P2 |

---

## Component Mapping

| Design Element | Common Component | Notes |
|----------------|-----------------|-------|
| Split-view container | Custom flex layout | 60/40 split, full viewport height (`calc(100vh - header)`) |
| Risk list panel | Custom scrollable panel | Left panel with risk rows, summary stats bar at top |
| Risk detail panel | Custom panel | Right panel with properties, details, accordion, action buttons |
| Risk card wrapper | `CommonCard` | `variant="default"`, slots for header/body/footer |
| Check-in questions accordion | `CommonCollapsible` | `variant="soft"`, title shows question count |
| Status badges (care plan, generated, etc.) | `CommonBadge` | `colour` mapped to status type |
| Traffic-light badge | `CommonBadge` | `colour="success"/"warning"/"error"` for G/A/R |
| Consequence badge | `CommonBadge` | Score (0-4) with traffic-light colour |
| Action buttons (view, edit, delete) | `CommonButton` | `variant="ghost"` with icons |
| Delete confirmation | `CommonConfirmDialog` | `type="danger"` |
| Sub-tabs (All Risks / Risk Radar) | `CommonTabs` | `:items` with `title` prop |
| Step form navigation | `CommonStepNavigation` | Steps array with status |
| View modal content | `CommonDefinitionList` + `CommonDefinitionItem` | Key-value display |
| Radar chart | Custom (new) | Chart.js radar or custom SVG |
| Bar chart | Custom (new) | Horizontal bars with domain labels |
| Assessment modal | Custom focused modal (dark overlay) | Not standard Inertia modal — dark backdrop for clinical focus |
| Consequence option cards | Custom clickable cards | Full-width, [1-5] keyboard hints, teal border on selection |
| Assessment progress dots | Custom or `CommonProgressBar` | Dot-style: filled/current/empty for 16 risk areas |
| Answer type badges | `CommonBadge` (coloured variants) | blue=Free Text, green=Yes/No, purple=MC, orange=Rating |

---

## Mockup Challenge Outcome

**Winner: Superhuman Sam (Student 3)**

The mockup challenge ran 3 students across 6 screens each. After review, the **Superhuman Sam** accordion/split-view pattern was selected as the primary UI for Risk Radar.

**Key design decisions from the chosen mockup:**

| Screen | Chosen Pattern | Source |
|--------|---------------|--------|
| All Risks | **Split-view** — left panel (60%) risk list rows with severity dots, consequence badges, domain labels; right panel (40%) selected risk detail card with properties grid, details, action plan | `student-3-superhuman/03-card-accordion.html` |
| Risk detail | **Inline detail panel** — properties grid (domain, consequence, mitigation, residual, need, care plan), expandable check-in questions accordion with drag-reorder and answer type badges | `student-3-superhuman/03-card-accordion.html` |
| Risk form | **Step-through wizard** — replaces the current single scrollable modal (873-line data class, 70+ enums). Step 1: Basics, Step 2: Category-specific fields, Step 3: Check-in Questions | `student-3-superhuman/04-step-form.html` |
| Assessment | **Focused dark overlay modal** with clickable severity cards, keyboard shortcuts [1-5], progress dots for 16 risk areas | `student-3-superhuman/05-assessment-wizard.html` |
| Risk Radar tab | **Radar chart** with 5 domain axes, ghost outline for unassessed, traffic-light fill for assessed | `student-3-superhuman/02-risk-radar.html` |
| Domain drill-down | **Inline expand** below chart showing individual risk areas with consequence, mitigation, residual | `student-3-superhuman/06-domain-drilldown.html` |

**Why Superhuman Sam won:**
- Split-view layout gives instant context — select a risk on the left, see full detail on the right without modals or page navigation
- Keyboard-driven interaction model (arrow keys to navigate, Enter to open, Q to toggle questions, A to assess) suits daily-use power users
- Check-in questions are visible inline via accordion — no need to edit a risk just to see what questions are configured
- Bottom status bar with keyboard hints reinforces discoverability

**Mockup files:** `.tc-docs/content/initiatives/Clinical-And-Care-Plan/Risk-Radar/mockups/challenge/student-3-superhuman/`

---

## UX Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Primary layout | **Split-view** (Superhuman Sam accordion) | Left panel risk list + right panel detail. No modals for viewing. Matches Superhuman/Linear pattern for dense data scanning |
| Default sub-tab | All Risks | Familiar starting point — card list they already know. Risk Radar one click away |
| Risk list interaction | Click to select, detail appears in right panel | Faster than open/close modals. Arrow keys for power users |
| Assessment flow | One-at-a-time wizard | Focused questionnaire per risk area. Less overwhelming than all 16 at once. Skip/Save & Next navigation |
| Domain drill-down | Inline expand below chart | Clicking a domain expands a section showing risk areas, consequence levels, mitigation. No overlays, simple scrolling |
| Risk form | Step-through wizard (3 steps) | Replaces current single scrollable modal. Progressive disclosure of complexity. Step 2 skipped for categories with no specific fields |

---

## UI Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Risk list layout | **Split-view** — 60/40 left/right panels, full viewport height | Superhuman Sam pattern. Left: scrollable risk rows. Right: selected risk detail with accordion |
| Risk row design | Severity dot + name + consequence badge + domain label + date | Compact, scannable. Selected row gets teal left border + teal-50 background |
| Detail panel | Properties grid (2-col) + Details + Action Plan + expandable Check-in Questions | All risk info visible without editing. Accordion for questions |
| Card actions | Action buttons in detail panel footer (Assess, Edit, Delete, Questions) | Direct action buttons with keyboard shortcut hints. More discoverable than three-dot menu in split-view context |
| Traffic-light badge | Dot + label in page header | Coloured dot with text label (e.g., "Red — Safety"). Accessible, compact. Uses CommonBadge |
| Bottom status bar | Dark bar with keyboard shortcut hints | Superhuman Sam pattern. Shows available shortcuts for current context |
| Radar chart technology | Chart.js (direct, no wrapper) | Already installed. Canvas ref + onMounted(). Only 1 chart component — wrapper unnecessary |
| Step form | CommonStepNavigation with 3 steps | Step 1: Basics, Step 2: Category-specific, Step 3: Check-in Questions. Step 2 skipped when no specific fields |

---

## Clarification Log

| Phase | Question | Decision |
|-------|----------|----------|
| UX | Default sub-tab when landing on risk tab? | All Risks (familiar, radar is one click away) |
| UX | Assessment flow: wizard vs checklist vs inline? | One-at-a-time wizard modal (1 of 16, Skip, Save & Next) |
| UX | Domain drill-down: inline expand vs side panel? | Inline expand below chart (simple, no overlays) |
| UX | Assessment wizard navigation for 16 risk areas? | One-at-a-time with progress dots (Sam's pattern). Show 1 risk area per screen, progress dots at bottom showing complete/skipped/remaining. Skip and Save & Next buttons. Creates focused clinical attention per risk area |
| UX | Consequence badges on risk cards — always visible or progressive? | Always visible when assessed (Lisa's monochrome + semantic colour). Traffic-light dot + score badge on every assessed card. Unassessed cards show "Not assessed" text. Colour only appears when earned via assessment |
| UX | Check-in question answer type badges in accordion? | Colourful property-tag badges (Nick's pattern). Each answer type gets a distinct colour: blue=Free Text, green=Yes/No, purple=Multiple Choice, orange=Rating 1-5. More scannable when browsing questions |
| UI | Card actions layout? | Dropdown menu (three-dot). All actions in menu, clean card surface |
| UI | Traffic-light badge style? | Dot + label. Compact, accessible, uses CommonBadge |
| UI | Radar chart: Chart.js or custom SVG? | Chart.js with vue-chartjs wrapper. Built-in radar type, responsive |
| UI | Consequence option input in assessment modal? | Clickable severity cards (Sam's pattern). Full-width cards per consequence level showing name, score (0-4), and plain-language description. Selected card highlighted with teal border. Keyboard shortcuts [1-5] for speed. More clinical weight than a radio group |
| UI | Radar chart empty/partial state? | Ghost outline with assessed domains filled. Full 5-axis outline in light gray always visible. Assessed domains fill with traffic-light colour. Shows "2 of 5 domains assessed" indicator. Creates visual target showing what's complete vs remaining |
| UI | Assessment modal overlay style? | Focused dark overlay (Lisa's pattern). Dark semi-transparent backdrop (bg-gray-900/80) with centered white card. Creates clinical focus for consequence judgment. Signals this is a clinical decision, not routine data entry. Different from standard Inertia modals intentionally |

---

## Next Steps

- [x] `/trilogy-clarify design` — UX + UI decisions refined (2 sessions: initial + post-mockup)
- [x] `/trilogy-mockup --challenge` — Multi-perspective UI challenge (3 students, 6 screens each, comparison + voting)
- [x] Mockup decision — **Superhuman Sam accordion + step form selected** (2026-03-10)
- [ ] `/trilogy-design-handover` — Gate 2 (Design → Dev)
- [ ] `/speckit-plan` — Technical plan
- [ ] Implementation: Replace PackageRisks.vue PrimeVue table with Superhuman Sam split-view
- [ ] Implementation: Step-through risk form (replacing single scrollable modal)
