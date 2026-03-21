# OHB Bill Processor Cockpit — Design Challenge Comparison

```
    ┌─────────┐          ╭━━━━━╮          ╔═══════════╗          ⚡ ⚡ ⚡
    │  ◠ ◠   │          ┃ ⊙ ⊙ ┃  ☕       ║  👓      ║         ┌─────────┐
    │   ▽    │          ┃  △  ┃           ║  ◉   ◉   ║         │  ● ●   │
    │  ╰─╯   │          ┃ ╰─╯ ┃           ║    ◇     ║         │   ◇    │
    └─────────┘          ╰━━━━━╯           ║   ═══    ║         └─────────┘
       │││                /│ │\            ╚═══════════╝         ⚡⚡⚡

   LINEAR LISA        NOTION NICK       GITHUB GARY        SUPERHUMAN SAM
  "Less, but better"  "Everything is    "Review, approve,  "Speed is a feature"
                       a database"       ship"
```

---

## Screen-by-Screen Comparison

### 1. Bill Edit IDE (Main Cockpit)

| Aspect | Linear Lisa | Notion Nick | GitHub Gary | Superhuman Sam |
|--------|-------------|-------------|-------------|----------------|
| **Layout** | Three-panel with collapsible L/R panels via `[`/`]` keys | Notion page with property table, toggle blocks, linked DB checklist | GitHub PR page with tabs (Details/Checks/Activity/Files) + sidebar | Split triage: bill queue left, detail right, checklist below |
| **Checklist** | Traffic-light accordion, colour progress bar (53.8%) | Linked database view with status property pills | CI status checks with pass/fail groups (Supplier/Rate/Recipient) | Grouped cards with traffic-light dots |
| **Footer** | Sticky totals + disabled Approve when blocking exists | Totals + cadence day + comm type + action buttons | "Merge readiness box" — amber verdict aggregating all signals | Triage bar: Skip/Snooze/Hold/Reject/Approve with keyboard hints |
| **Command** | Cmd+K palette with fuzzy search | Inline property editing, hover-to-edit | Tab switching (1-4 keys), Escape to close | Cmd+K palette + persistent shortcut bar |
| **Unique** | Panel collapse shortcuts, minimal chrome | Bill rendered as a "page" with emoji icon, drag handles | "Not ready to approve — 2 blocking issues remain" verdict | Speed stats in header (127 bills, 42s/bill, 86/hr) |

**Standout**: GitHub Gary's **merge readiness box** is the strongest approval verdict pattern — it aggregates all signals into one "can I approve?" answer. Superhuman Sam's **speed stats** create accountability and gamification.

### 2. Reason Modal (Focused Resolution)

| Aspect | Linear Lisa | Notion Nick | GitHub Gary | Superhuman Sam |
|--------|-------------|-------------|-------------|----------------|
| **Layout** | Clean modal with properties grid + description + notes thread | Notion "page peek" with property table + linked views | Three variant states shown: BLOCKING/COMPLETE/AWAITING | Overlay on Bill Edit with metadata grid |
| **Resolution** | Threaded notes with Cmd+Enter submit | Timeline history + textarea + resolve buttons | Threaded comments with department-coloured borders | Resolution notes with auto-save |
| **Can Coexist** | Dedicated section explaining parallel resolution | Blue info box with impact explanation | "Dominant blocker" warning with suppression context | Impact section: blocks/suppresses/independent |
| **AI Context** | "Diagnosed By: AI Triage" badge | AI Detection confidence % with purple highlight | AI confidence sidebar widget | AI Engine version + confidence score |
| **Unique** | Affected line items list with amounts | Rate comparison table (invoiced vs schedule max) | Three modal variants showing lifecycle states | Expected resolution timeframe |

**Standout**: Notion Nick's **rate comparison table** (invoiced vs schedule max with variance) is the most actionable — processors immediately see the discrepancy. GitHub Gary showing **three lifecycle states** of the same modal is brilliant for documentation.

### 3. Bills Index (On-Hold Queue)

| Aspect | Linear Lisa | Notion Nick | GitHub Gary | Superhuman Sam |
|--------|-------------|-------------|-------------|----------------|
| **Layout** | Dense table with filter bar + saved views | Notion database with Table/Board/Timeline view switcher | GitHub Issues list with Open/Closed toggle | Split inbox with tabs (All/Overdue/New/Awaiting/Auto-Rejected) |
| **Columns** | Invoice, Supplier, Recipient, Amount, Issues (dots), Reason Groups (pills), Cadence, Comms, Assignee | Invoice, Supplier, Recipient, Reason Groups (pills), Issues (dots), Cadence (chips), Comms, Assigned, Amount | Bill/Supplier, Reason Labels, Issues, Checks (dots), Cadence, Comms, Amount, Assignee | Invoice, Supplier, Recipient, Amount, Issues (dots), Reason Groups, Cadence, Comms, Assigned |
| **Batch** | J/K navigation with selection indicator | Checkbox selection with batch action bar | Checkbox with floating action bar (Bulk Assign/Approve/Reject) | Select all + Bulk Approve/Assign/Snooze |
| **Filters** | Status/Reason/Department/Cadence dropdowns | Visible filter pills with × remove, compound filters | Department dropdown with checkboxes, filter chips, sort | Split tab pre-filters + search |
| **Unique** | Saved views, J/K keyboard navigation | Board view (Kanban by Comms Type), Timeline view | "247 On Hold │ 1,892 Resolved │ 56 Rejected" counter | Preview pane showing selected bill, progress bar to inbox zero |

**Standout**: Notion Nick's **view switcher** (Table → Board by Comms Type) gives managers a Kanban perspective. Superhuman Sam's **split tabs** pre-filter by urgency, making triage fastest. GitHub Gary's **Open/Closed counter** gives instant queue health.

### 4. BP Dashboard

| Aspect | Linear Lisa | Notion Nick | GitHub Gary | Superhuman Sam |
|--------|-------------|-------------|-------------|----------------|
| **KPIs** | 4 cards: On Hold (247), Awaiting (89), Overdue (34), Auto-Rejected (7) | 5 cards: On Hold (247), Blocking (183), Resolved Today (34), Avg Resolution (4.2d), At Risk (38) | 4 cards: On Hold (247), Awaiting (89), Overdue (34), Auto-Rejected (23) | 5 hero metrics (dark): Processed (127), Bills/Hr (86), Avg Time (42s), Queue (47), Keyboard % (94%) |
| **Heatmap** | 9-cell grid with reason categories | Weekly grid (Mon-Sat × 5 categories) with colour intensity | Horizontal bar chart of top 6 reasons | 4-week heat grid for top 6 categories |
| **Queue** | Stacked progress bars by department | Three-column panel (Care/Compliance/Accounts) with sub-breakdowns | GitHub language bar (proportional) + department rows | Department breakdown with sub-category counts |
| **Unique** | Minimal, focused on actionable data | Cadence distribution cards (Day 0/3/7/10), linked database widgets | "Today's Processing" progress (142/180 = 79%) | Progress to inbox zero (73%), ETA, keyboard usage tracking |

**Standout**: Superhuman Sam's **speed-first dashboard** with bills/hour, keyboard usage %, and "inbox zero progress" creates a gamified, accountable workflow. Notion Nick's **weekly heatmap** reveals patterns over time.

### 5. Department Queue (Task View)

| Aspect | Linear Lisa | Notion Nick | GitHub Gary | Superhuman Sam |
|--------|-------------|-------------|-------------|----------------|
| **Grouping** | Priority: Overdue/Urgent/Normal + Recently Resolved | Priority with toggle expand: Blocking/In Progress/Awaiting/Warnings/Complete | Priority with colour bars: Overdue/Urgent/Normal + Resolved | Priority: Overdue/Urgent/Normal with sticky headers |
| **Task Cards** | Compact rows with hover-reveal Resolve button | Cards with left border colour, checkbox, status pills, hover Resolve | Cards with left colour bar, status badge, inline Resolve | Status icon, cadence chip, inline Resolve (M key) |
| **Department Switch** | Segmented control (Care/Compliance/Accounts) | Coloured tabs with counts | Tabs with coloured dots | Tabs with counts |
| **Stats** | Avg resolution, Resolved today, SLA breached | None (focus on the task list itself) | Total, Overdue, Assigned, Avg resolve | None (focus on speed of resolution) |
| **Unique** | E for quick resolve, J/K navigation | In Progress shows inline resolution notes, Awaiting shows ETA | "Claim" button for unassigned tasks, expandable resolution textarea | Detail preview pane, M key to resolve, J/K navigation |

**Standout**: GitHub Gary's **"Claim" button** for unassigned tasks enables self-service assignment. Linear Lisa's **stats bar** (SLA breached count) adds accountability. Notion Nick's **inline resolution notes** visible on In Progress tasks reduce click-through.

---

## Trade-off Matrix

| Criteria | Linear Lisa | Notion Nick | GitHub Gary | Superhuman Sam |
|----------|:-----------:|:-----------:|:-----------:|:--------------:|
| **Speed** (50+ bills/hr) | ★★★★☆ | ★★★☆☆ | ★★★☆☆ | ★★★★★ |
| **Information Density** | ★★★★☆ | ★★★★★ | ★★★★☆ | ★★★★☆ |
| **Keyboard-First** | ★★★★★ | ★★☆☆☆ | ★★★☆☆ | ★★★★★ |
| **Scalability** (1-12 issues) | ★★★★☆ | ★★★★★ | ★★★★☆ | ★★★☆☆ |
| **Glanceability** (<2s status) | ★★★★☆ | ★★★☆☆ | ★★★★★ | ★★★★☆ |
| **Familiarity** | ★★★☆☆ | ★★★★☆ | ★★★★★ | ★★★☆☆ |
| **Flexibility** | ★★★☆☆ | ★★★★★ | ★★★☆☆ | ★★☆☆☆ |
| **Learning Curve** | Medium | Low | Low | High |

---

## Cherry-Pick Recommendations

### Adopt (Best-in-Class Patterns)

| Pattern | Source | Why |
|---------|--------|-----|
| **Merge readiness box** | GitHub Gary | Single most impactful pattern — aggregates all signals into "can I approve?" verdict. Eliminates scanning the entire checklist. |
| **Speed stats header** | Superhuman Sam | Bills/hour, avg time, queue remaining + ETA creates accountability and natural gamification. Processors self-optimize. |
| **Cmd+K command palette** | Linear Lisa | Power users process 50+ bills/hour. Command palette lets them do anything without mouse. Essential for keyboard-first workflow. |
| **Split inbox tabs** | Superhuman Sam | Pre-filtered views (Overdue / New / Awaiting Dept / Auto-Rejected) eliminate manual filtering. Each tab is a triage workflow. |
| **View switcher (Table/Board)** | Notion Nick | Table for processors, Board (Kanban by Comms Type) for managers. Same data, different perspectives. |
| **Rate comparison table** | Notion Nick | In reason modal, showing invoiced vs schedule max with variance makes the issue instantly actionable. |
| **Persistent shortcut bar** | Superhuman Sam | Context-aware keyboard hints at bottom of screen. Progressive disclosure — experts ignore it, new users learn. |
| **"Claim" self-assignment** | GitHub Gary | Department queue — unassigned tasks get a "Claim" button so team members self-serve. Reduces manager bottleneck. |

### Consider (Worth Evaluating)

| Pattern | Source | Trade-off |
|---------|--------|-----------|
| **Inline resolution notes** | Notion Nick | Shows department progress without opening modal, but adds visual noise to the task list |
| **Three modal variants** | GitHub Gary | Documenting BLOCKING/COMPLETE/AWAITING states in one page is great for design spec, may be complex to implement |
| **Inbox zero progress** | Superhuman Sam | Gamification can motivate but may create pressure; should be opt-in per team |
| **Weekly reason heatmap** | Notion Nick | Reveals patterns but dashboard may already have enough widgets |
| **Board view by Comms Type** | Notion Nick | Useful for managers, but adds view switcher complexity |

### Skip (Not Right for This Context)

| Pattern | Source | Why Not |
|---------|--------|---------|
| **Bill as a "Notion page"** | Notion Nick | Too much flexibility — bill processors need consistent layout, not configurable blocks |
| **Drag-and-drop reordering** | Notion Nick | Reasons have system-defined priority; manual reorder undermines diagnostic ordering |
| **Dark mode** | Superhuman Sam | Nice-to-have but out of MVP scope; TC Portal doesn't support it system-wide |
| **Emoji page icons** | Notion Nick | Doesn't match TC Portal design language |
| **Keyboard usage %** | Superhuman Sam | Interesting metric but may feel surveillance-like; defer |

---

## Unified Design Direction

Based on the challenge, the optimal OHB cockpit combines:

1. **Layout**: Linear Lisa's three-panel IDE base (matches existing `feat/bill-edit-v2-ide` branch)
2. **Verdict**: GitHub Gary's merge readiness box as the approval widget
3. **Speed**: Superhuman Sam's stats header + persistent shortcut bar + split inbox tabs
4. **Data**: Notion Nick's rate comparison in reason modal + view switcher for managers
5. **Navigation**: Linear Lisa's Cmd+K palette + Superhuman Sam's J/K triage
6. **Department**: GitHub Gary's claim button + Linear Lisa's stats bar

### Implementation Priority

**Phase 1 (MVP)**:
- Three-panel IDE layout (from existing branch)
- Traffic-light checklist with merge readiness verdict
- Sticky footer with totals + disabled approve when blocking
- Bills Index with split tabs (Overdue / New / Awaiting / Auto-Rejected)
- Department Queue with priority grouping + inline resolve

**Phase 2 (Power User)**:
- Cmd+K command palette
- J/K keyboard navigation
- Persistent shortcut bar
- Speed stats header
- Batch actions on Bills Index

**Phase 3 (Manager)**:
- Board view (Kanban by Comms Type)
- BP Dashboard with KPIs + heatmap
- Weekly reason trend analysis
- Claim button for self-assignment
