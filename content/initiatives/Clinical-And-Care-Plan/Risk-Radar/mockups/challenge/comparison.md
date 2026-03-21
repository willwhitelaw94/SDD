# Risk Radar — Design Challenge Comparison

```
    ┌─────────┐                    ╭━━━━━╮                     ⚡ ⚡ ⚡
    │  ◠ ◠   │                    ┃ ⊙ ⊙ ┃  ☕                ┌─────────┐
    │   ▽    │                    ┃  △  ┃                     │  ● ●   │
    │  ╰─╯   │                    ┃ ╰─╯ ┃                     │   ◇    │
    └─────────┘                    ╰━━━━━╯                     └─────────┘
       │││                          /│ │\                       ⚡⚡⚡

   LINEAR LISA               NOTION NICK              SUPERHUMAN SAM
  "Less, but better"       "Everything is            "Speed is a feature"
                             a database"
```

---

## Pattern Comparison

### 1. All Risks Layout

| Aspect | Linear Lisa | Notion Nick | Superhuman Sam |
|--------|-------------|-------------|----------------|
| **Layout** | Single-column cards, full width | Gallery grid (2-col), rounded-xl cards | Split-view triage (60/40 list + detail) |
| **Information Density** | Medium — card with summary + badges | Medium — card with property tags + emoji | High — dense rows left, full detail right |
| **Navigation** | Scroll + keyboard arrows | View toggle (Cards/Table/Board) | Arrow keys through list, instant detail |
| **Visual Style** | Monochrome + semantic colour | Warm, rounded, colourful property tags | Dense, sharp, status-first hierarchy |
| **Card Actions** | Three-dot dropdown | Three-dot dropdown | Inline kbd-hinted buttons (A/E/D) |

**Winner: Linear Lisa** — The single-column card layout maps best to TC Portal's existing patterns (CommonCard) and provides the right balance of scannability without overwhelming the user. Sam's split-view is powerful but a significant departure from existing UX.

### 2. Risk Radar Sub-Tab

| Aspect | Linear Lisa | Notion Nick | Superhuman Sam |
|--------|-------------|-------------|----------------|
| **Chart Placement** | Hero element, full-width, top half | Hero element, full-width | Side-by-side (chart left, summary right) |
| **Domain Summary** | Row of domain cards below chart | Grid of domain cards with emoji | Dense table rows with score bars |
| **Toggle** | Radar / Bar pills | Radar / Bar Chart pills | Radar / Bar small pills |
| **Assessment Progress** | "3 of 5 domains assessed" | Progress bars per domain card | "12 of 16 risk areas assessed" with bar |

**Winner: Linear Lisa** — Chart-as-hero with clean domain cards below. Nick's emoji-heavy approach is friendly but may feel informal for clinical data. Sam's side-by-side packs information efficiently but reduces chart impact.

### 3. Check-In Questions Accordion

| Aspect | Linear Lisa | Notion Nick | Superhuman Sam |
|--------|-------------|-------------|----------------|
| **Expand/Collapse** | Chevron accordion | Triangle toggle block (▶/▼) | Visible in detail pane (always-on) |
| **Question Display** | Rows in bg-gray-50 with drag grip | Mini-database rows with property tags | Compact rows with kbd badges |
| **Drag-and-Drop** | 6-dot grip handle + "Drag to reorder" | 6-dot grip handle + "Add a question" row | Drag handle, compact rows |
| **Answer Type Badge** | Colour-coded pills (blue/emerald/purple) | Colour-coded pills (blue/green/purple/orange) | Kbd-style badges |

**Winner: Notion Nick** — The toggle block pattern with colourful property tags makes questions feel like a natural extension of the card (progressive disclosure done right). Lisa's accordion is clean but Nick's feels more inviting to interact with.

### 4. Step-Based Risk Form

| Aspect | Linear Lisa | Notion Nick | Superhuman Sam |
|--------|-------------|-------------|----------------|
| **Container** | Modal overlay (centred, dimmed bg) | Full-page (page-as-form, breadcrumb nav) | Modal overlay (compact, dense) |
| **Step Navigation** | Numbered circles + connecting lines | Breadcrumb-style steps | Horizontal pills |
| **Form Density** | Generous padding, focused | Spacious, document-like | Compact, tight spacing |
| **Feel** | Focused clinical form | Writing a clinical note | Speed-filling a form |

**Winner: Linear Lisa** — Modal keeps the user in context (they can see their risk list behind the overlay). Nick's full-page feels too disconnected; Sam's compact modal is efficient but may feel rushed for clinical data entry.

### 5. Assessment Wizard

| Aspect | Linear Lisa | Notion Nick | Superhuman Sam |
|--------|-------------|-------------|----------------|
| **Layout** | Centred modal, dark backdrop | Centred modal, warm rounded | Wide overlay, question left + options right |
| **Options** | Card-style radio rows, stacked | Rounded cards, stacked | Compact rows with [1-5] key hints |
| **Progress** | Dots + "3 of 16" | Progress bar + "3 of 16" | Dots + progress text + summary counts |
| **Selection** | Click card | Click card | Press 1-5 key |
| **Skip/Next** | Skip (ghost) / Save & Next (teal) | Skip this one / Save & Next | S Skip / Enter Save & Next |

**Winner: Superhuman Sam** (cherry-pick: keyboard selection) + **Linear Lisa** (cherry-pick: focused modal layout). Sam's [1-5] key selection is brilliant for speed — a care partner can assess all 16 risk areas in under 3 minutes using keyboard only. But Lisa's focused dark-backdrop modal creates better clinical attention.

### 6. Domain Drill-Down

| Aspect | Linear Lisa | Notion Nick | Superhuman Sam |
|--------|-------------|-------------|----------------|
| **Pattern** | Inline expand below chart | Toggle blocks (▶/▼) | Split-view (chart left, detail right) |
| **Risk Area Display** | Table-like rows with badges | Database rows with property tags | Dense table with columns |
| **Mitigation** | Badge (Strong/Partial/None) | Selectable pills | Cell in table |
| **Other Domains** | Collapsed rows below | Toggle blocks | Collapsed rows |

**Winner: Linear Lisa** — Inline expansion is the simplest mental model and matches the design.md decision. Nick's toggle blocks work well too but the emoji styling may feel informal for clinical assessment data.

---

## Trade-Off Matrix

| Criteria | Lisa (★) | Nick (★) | Sam (★) |
|----------|----------|----------|---------|
| **Clinical Confidence** | ★★★★★ | ★★★☆☆ | ★★★★☆ |
| **Scannability** | ★★★★☆ | ★★★★☆ | ★★★★★ |
| **Progressive Disclosure** | ★★★★☆ | ★★★★★ | ★★★☆☆ |
| **TC Portal Consistency** | ★★★★★ | ★★★☆☆ | ★★☆☆☆ |
| **Speed / Efficiency** | ★★★☆☆ | ★★★☆☆ | ★★★★★ |
| **Learnability** | ★★★★★ | ★★★★☆ | ★★☆☆☆ |
| **Accessibility** | ★★★★★ | ★★★★☆ | ★★★☆☆ |

**Overall**: Lisa wins on consistency and clinical confidence. Sam wins on speed. Nick wins on progressive disclosure.

---

## Cherry-Pick Recommendations

### Adopt (High confidence)

| Pattern | Source | Why |
|---------|--------|-----|
| **Single-column card layout** | Lisa | Matches TC Portal patterns (CommonCard), scannable, simple |
| **Monochrome + semantic colour** | Lisa | Traffic-light colours carry genuine meaning when colour is scarce |
| **Keyboard shortcut hints (assessment)** | Sam | [1-5] key selection for consequence levels dramatically speeds assessment |
| **Toggle blocks for accordion** | Nick | Triangle (▶/▼) is more intuitive than chevron accordion for progressive disclosure |
| **Inline domain drill-down** | Lisa | No modals, no overlays — content expands in place |
| **Focused modal for assessment** | Lisa | Dark backdrop creates clinical attention for consequence judgment |
| **Progress dots on assessment** | Sam | Visual progress tracking creates momentum across 16 risk areas |
| **Colourful answer type badges** | Nick | Property-tag style badges (blue/green/purple) are more scannable than monochrome |

### Consider (Worth discussing)

| Pattern | Source | Why |
|---------|--------|-----|
| **View toggle (Cards/Table)** | Nick | Table view useful for clinicians in meetings, but adds complexity |
| **Persistent bottom shortcut bar** | Sam | Teaches keyboard usage, but adds visual noise |
| **Emoji domain icons** | Nick | Friendly but may feel informal for clinical context |
| **Split-view triage** | Sam | Powerful for power users, significant build cost and UX departure |

### Defer (Phase 2+)

| Pattern | Source | Why |
|---------|--------|-----|
| **Command palette (Cmd+K)** | Lisa/Sam | Valuable but scope creep — implement after core risk cards work |
| **Board view (Kanban by status)** | Nick | Interesting for POD leaders but adds build complexity |
| **Batch assessment selection** | Sam | Multi-select assessment useful but Phase 1 should establish single-risk flow first |

---

## Unified Design Direction

**Base**: Linear Lisa's clean, minimal approach
**Enhance with**: Nick's toggle blocks + colourful badges, Sam's keyboard shortcuts + progress tracking

The unified mockup should combine:
1. Lisa's single-column card layout with monochrome + semantic colour
2. Nick's triangle toggle (▶/▼) for check-in questions accordion
3. Nick's colourful property tags for answer types
4. Sam's [1-5] keyboard selection in the assessment wizard
5. Sam's progress dots and completion tracking
6. Lisa's focused dark-backdrop modal for assessment
7. Lisa's inline domain drill-down pattern

This creates a design that:
- **Looks like TC Portal** (consistency with existing patterns)
- **Inspires clinical confidence** (monochrome base, semantic colour for risk)
- **Supports speed** (keyboard shortcuts where they matter most — assessment)
- **Discloses progressively** (toggle blocks for questions, inline expand for domains)
