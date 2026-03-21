---
title: "Design Challenge Comparison: Lead Essential"
---

# Design Challenge Comparison: Lead Essential

## The Students

```
  Linear Lisa        Notion Nick        GitHub Gary      Superhuman Sam     HubSpot Hannah
  ___________        ___________        ___________       ___________        ___________
 /           \      /           \      /           \     /           \      /           \
|  ^_______^  |    |  ^_______^  |    |  ^_______^  |   |  ^_______^  |    |  ^_______^  |
|  | o   o |  |    |  | o   o |  |    |  | o   o |  |   |  | o   o |  |    |  | o   o |  |
|  |   ^   |  |    |  |  ___  |  |    |  | ===   |  |   |  |  ___  |  |    |  |   ^   |  |
|  |  ___  |  |    |  | |   | |  |    |  |  [>]  |  |   |  | |_| | |  |    |  |  ___  |  |
 \_|_______|_/      \_|_______|_/      \_|_______|_/     \_|_______|_/      \_|_______|_/
   Minimal &          Database          Review &           Speed &           Activity &
  Keyboard-first     & Flexible         Workflow           Triage            3-Column
```

---

## Screen 1: Lead Profile Overview

### Pattern Comparison

| Criteria | Linear Lisa | Notion Nick | GitHub Gary | Superhuman Sam | HubSpot Hannah |
|---|---|---|---|---|---|
| **Layout** | 65/35 two-panel | Large title + property groups | H1 + 75/25 sidebar | 280px split pane list + detail | 25/50/25 three-column |
| **Editing** | Click-to-set sidebar fields | Inline slash commands, click-to-edit | Inline edit with Save/Cancel | Inline fields in detail pane | Editable property cards |
| **Navigation** | J/K keyboard, peek preview | Scroll-based sections | Tab anchors in sidebar | Pre-cached adjacent leads, keyboard | Quick actions bar above fold |
| **Key Features** | Command palette, auto-save | Property groups, database views | Status badge, mixed timeline | Triage shortcuts, auto-advance | Associations panel, pinned activities |
| **Activity Feed** | Compact event list | Page-level comments | Mixed timeline (cards + compact) | Inbox-style threaded notes | Full activity feed with pinning |
| **Stage Visibility** | Tag in header | Property field in sidebar | Status badge + progress bar | Badge + keyboard shortcut | Kanban stage indicator |

### Winner: HubSpot Hannah — Three columns done right for care context

The 25/50/25 layout wins because aged care leads require constant cross-referencing between contact details, timeline, and associated records (family members, ACAT assessor, care manager). The quick actions bar solves the "I need to log a call right now" problem that every intake coordinator faces. Associations panel is table stakes for a care context where family members, referrers, and providers are all linked to one lead. The pinned activities feature is uniquely valuable for surfacing critical context like "family has requested no phone calls before 10am."

**Steal from others:** Linear's 65/35 split is a worthy alternative for users who don't need associations. GitHub's mixed timeline (cards for notes, compact for system events) is superior to Hannah's flat feed.

---

## Screen 2: List View

### Pattern Comparison

| Criteria | Linear Lisa | Notion Nick | GitHub Gary | Superhuman Sam | HubSpot Hannah |
|---|---|---|---|---|---|
| **Layout** | Dense 36px rows | View tab bar with grouped table | Preset tabs with counts | Split inbox categories | View tabs with KPI summary bar |
| **Data Density** | High — 36px rows | Medium — grouped with expand | High — structured query filter | High — prioritised triage | Medium — KPI bar takes space |
| **Filtering** | Command palette filters | Click-to-group, database filters | Structured query filter syntax | Keyboard-driven triage filters | Saved views + inline filter builder |
| **Bulk Actions** | Keyboard multi-select | Column checkboxes | Batch actions bar with review flow | Z to undo bulk | Checkbox select with action toolbar |
| **Preview** | Peek preview on hover | Click-to-expand inline | Hover card | Adjacent lead pre-cache | Preview slide-out panel |
| **Stage Visibility** | Tag column | View grouped by stage | Count badges on tabs | Category header | KPI summary bar + column |
| **Saved Views** | None | Named database views | Preset tabs | Inbox categories | Named workflow tabs |

### Winner: GitHub Gary — Pipeline counts solve the coordinator's morning ritual

Every intake coordinator starts their day by checking "how many leads are in each stage?" Gary's preset tabs with counts answer this instantly without any interaction. The structured query filter syntax looks intimidating but is actually faster than HubSpot's builder for power users, and the batch actions bar with readiness checks prevents coordinators from accidentally advancing leads who are missing critical information.

**Steal from others:** HubSpot's KPI summary bar (total leads, conversion rate this week, overdue follow-ups) deserves to live above Gary's tab bar. Notion's saved views concept should power the preset tabs. Linear's 36px density is ideal for coordinators managing 50+ leads.

---

## Screen 3: Journey Stage Wizard

### Pattern Comparison

| Criteria | Linear Lisa | Notion Nick | GitHub Gary | Superhuman Sam | HubSpot Hannah |
|---|---|---|---|---|---|
| **Trigger** | Click stage tag in header | Drag card in mini kanban | "Move to Stage" button + review flow | Keyboard shortcut dropdown popover | Click kanban card + modal |
| **Field Collection** | Lightweight popover, minimal fields | Inline drag with no field gate | CI-style readiness check before advance | Inline fields in dropdown | Required + suggested field split |
| **Validation** | None — auto-save, undo toast | None — drag and drop | Hard gate — cannot advance without checks | Soft — warns but allows | Hard gate — required fields block, suggested prompt |
| **Required Fields** | No concept | No concept | Checklist items | Optional inline | Explicit required vs suggested split |
| **Undo** | Toast with undo action | Drag back | No undo | Z to undo | No undo |
| **Automation** | Auto-save on dismiss | None | CI-style hooks (conceptual) | None | Probability indicator update |
| **UX Pattern** | Popover / inline | Kanban drag | Review workflow | Command popover | Modal wizard |

### Winner: HubSpot Hannah + GitHub Gary hybrid — Data quality is non-negotiable in aged care

This is the most important screen in LES. Aged care has compliance requirements — if a lead advances to Allocated without a completed ACAT assessment, real harm can follow. Hannah's explicit required vs suggested field split is the right mental model: some things block the transition, others are strongly recommended. Gary's CI-style readiness checks add the right visual weight to convey "this matters." Sam's Z-to-undo is essential UX borrowed from email — stage regressions happen and should be painless.

**Skip:** Notion's drag-and-drop has no friction by design, which is dangerous here. Linear's auto-save popover is elegant but lacks the stage-appropriate gravity for a compliance-sensitive workflow.

---

## Trade-off Matrix

| Student | Familiarity | Speed | Clarity | Scalability | Consistency |
|---|---|---|---|---|---|
| Linear Lisa | ★★★☆☆ | ★★★★★ | ★★★★☆ | ★★★☆☆ | ★★★★☆ |
| Notion Nick | ★★★★☆ | ★★★☆☆ | ★★★☆☆ | ★★★★★ | ★★★☆☆ |
| GitHub Gary | ★★★☆☆ | ★★★★☆ | ★★★★★ | ★★★★☆ | ★★★★★ |
| Superhuman Sam | ★★☆☆☆ | ★★★★★ | ★★★☆☆ | ★★★☆☆ | ★★★☆☆ |
| HubSpot Hannah | ★★★★★ | ★★★☆☆ | ★★★★☆ | ★★★★☆ | ★★★★☆ |

**Familiarity**: How quickly would an aged care coordinator recognise and use this without training?
**Speed**: Time to complete core tasks (log call, advance stage, find lead)?
**Clarity**: Is the current state of a lead obvious at a glance?
**Scalability**: Does the pattern hold with 200+ leads and 10+ coordinators?
**Consistency**: Do the three screens feel like one coherent product?

---

## Cherry-Pick Recommendations

### Adopt (implement in unified design)

| Pattern | Source Student(s) | Why Adopt | Priority |
|---|---|---|---|
| Split Pane Layout | Superhuman Sam + Linear Lisa | List + detail side by side eliminates page transitions; critical for high-volume coordinators | P0 |
| Quick Actions Bar | HubSpot Hannah | Call/Note/Task always visible above the fold; this is the #1 action on every lead | P0 |
| Journey Stage Tabs with Counts | GitHub Gary + HubSpot Hannah | Instant pipeline visibility; answers "what needs attention today" without interaction | P0 |
| Gated Stage Transitions with Required/Suggested Fields | HubSpot Hannah + GitHub Gary | Compliance requirement in aged care; blocks advance without ACAT, funding type, etc. | P0 |
| Mixed Activity Timeline | GitHub Gary + HubSpot Hannah | Notes and calls as full cards; system events (stage change, status update) as compact rows | P1 |
| Click-to-Set Sidebar Properties | Linear Lisa + GitHub Gary | One-click metadata changes without opening an edit mode; reduces cognitive overhead | P1 |
| Optimistic UI with Undo Toast | Superhuman Sam | Instant feedback on all mutations; Z to undo stage changes and status updates | P1 |
| Saved Views | Notion Nick + HubSpot Hannah | Named workflow tabs (My Leads, Needs Follow-up, Pending ACAT) as first-class objects | P1 |
| Pinned Activities | HubSpot Hannah | Critical context (family preferences, funding notes) pinned to timeline top | P1 |
| Inline Property Editing | Notion Nick + Linear Lisa | Edit where you read; no separate edit mode for sidebar fields | P2 |
| Keyboard Shortcuts | Linear Lisa + Superhuman Sam | J/K navigation, S for status, Cmd+K palette for power users once familiar | P2 |
| Command Palette / Cmd+K | Linear Lisa + Superhuman Sam | Universal action dispatch; find lead, log note, advance stage without mouse | P2 |

### Consider (future enhancements)

- **Board view for pipeline** (Notion Nick + HubSpot Hannah) — Valuable for managers reviewing pipeline health; not needed for day-to-day intake work
- **Task queues with auto-advance** (HubSpot Hannah + Superhuman Sam) — Powerful for coordinators working a call list; adds complexity, defer to Phase 3
- **Inline table cell editing** (Notion Nick) — Efficient for bulk data entry; requires careful conflict handling in multi-user environment
- **Contact pane sidebar** (Superhuman Sam) — Pre-loaded adjacent lead context is a UX win; evaluate after split pane is stable

### Skip

- **Slash commands** (Notion Nick) — Unfamiliar interaction pattern for aged care coordinators; adds discovery burden with no CRM-specific payoff
- **Three-state review flow** (GitHub Gary) — "Approve / Request Changes / Comment" mental model is developer-native and will confuse coordinators
- **Auto-advance triage** (Superhuman Sam) — Automatically moving to the next lead after action is too aggressive; every aged care lead deserves deliberate attention, not email-inbox behaviour

---

## Implementation Priority

### Phase 1 — MVP

The core loop: find a lead, understand their state, take action, advance their stage.

- Split pane layout (list + detail, no page transition)
- Quick actions bar (Call, Note, Task) pinned above fold
- Journey stage tabs with counts on list view
- Gated stage transitions with required field validation
- Mixed activity timeline (cards + compact events)
- Click-to-set sidebar properties
- Optimistic UI with undo toast on all mutations
- Basic saved views (hardcoded: All Leads, My Leads, Needs Follow-up)

### Phase 2 — Enhancement

Reduce friction, improve data quality, give coordinators workflow control.

- Pinned activities on timeline
- Inline property editing (no separate edit mode)
- User-defined saved views (name, save, share)
- KPI summary bar on list view (total, conversion rate, overdue)
- Suggested fields prompt on stage transition (soft gate)
- Associations panel (family members, referrers, providers)

### Phase 3 — Power User

For coordinators who have internalised the product and want to move at keyboard speed.

- Keyboard shortcuts (J/K navigation, S for status, E to log note)
- Command palette (Cmd+K) with universal action dispatch
- Pre-cached adjacent lead detail (Superhuman-style)
- Board view for pipeline (manager-facing)
- Task queue with auto-advance (optional, opt-in per user)
