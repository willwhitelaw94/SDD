---
name: trilogy-clarify-design
description: >-
  Refine UX/UI decisions in an existing design specification. Asks targeted questions
  through the designer lens about usability, components, interactions, and responsive behavior.
  Requires design.md. Triggers on: clarify design, refine design, design questions,
  UX clarify, UI decisions.
metadata:
  version: 1.0.0
  type: agent
---

# Clarify Design

Refine UX/UI decisions in an existing design specification.

## Prerequisites

| Artifact | Required | Location |
|----------|----------|----------|
| design.md | Yes | Initiative folder (from `/trilogy-design`) |

If design.md doesn't exist: "Run `/trilogy-design` first to create the design artifact."

## Output

Updates existing `design.md` in the epic folder with clarified decisions.

## Execution Flow

### Step 1: Find the Design Artifact

```bash
git branch --show-current
find .tc-docs/content/initiatives -name "design.md" -type f 2>/dev/null | sort
```

Read design.md thoroughly. Also read spec.md for context.

### Step 2: Phase 1 — UX Clarification

Focus on **behavior, flow, and user experience** before visual decisions.

Scan for gaps in:

**HIGH PRIORITY**
- **User Context**: Who is the primary user? (customer-facing staff, consumer/public, internal staff)
- **Task Flow**: What is the happy path? What are the decision points?
- **Information Architecture**: How is data organized? What's the hierarchy?
- **Navigation**: How do users get here? Where do they go next?

**MEDIUM PRIORITY**
- **Interaction Model**: Direct manipulation vs form submission? Optimistic vs wait-for-server?
- **Error Handling**: How are errors surfaced? Recovery paths?
- **Edge Cases**: Empty states, bulk operations, undo/redo?
- **Device Priority**: Desktop-first or mobile-first? Touch considerations?

Ask up to 3 UX questions.

### Step 3: Phase 2 — UI Clarification

Focus on **components, layout, and visual implementation** after UX is settled.

**CRITICAL**: Before suggesting new components, check existing Storybook library:

```bash
ls stories/Common/
```

**Available Components**:
- **Layout**: CommonCard, CommonModal, CommonCollapsible, CommonTabs, CommonSplitPanel
- **Data Display**: CommonTable, CommonList, CommonBadge, CommonKpiCard
- **Forms**: CommonForm, CommonInput, CommonSelectMenu, CommonDatePicker, CommonButton
- **Navigation**: CommonDropdown, CommonCommandPalette, CommonPagination
- **Feedback**: CommonAlert, CommonConfirmDialog, CommonEmptyPlaceholder

Scan for gaps in:

**HIGH PRIORITY**
- **Page Layout**: Single page, wizard, master-detail, dashboard?
- **Component Selection**: Which existing components fit?
- **Pattern Matching**: "Should look like [existing page]"?

**MEDIUM PRIORITY**
- **States & Loading**: Skeleton loaders, spinners, optimistic updates?
- **Responsive Behavior**: Breakpoint adaptations needed?
- **New Components**: Any gaps requiring new components?

Ask up to 3 UI questions.

### Step 4: Update Design

After each answer, update design.md:
1. Apply the clarification to the appropriate section
2. Append to clarification log:

```markdown
## Clarification Log
| Phase | Question | Decision |
|-------|----------|----------|
| UX | ... | ... |
| UI | ... | ... |
```

### Step 5: Report

```
## Design Clarification Complete

**UX Questions**: N
**UI Questions**: N

**Key Decisions**:
- [UX] Primary user: customer-facing staff
- [UI] Layout: master-detail with CommonSplitPanel

**Document Updated**: design.md

**Next Steps**:
- /trilogy-mockup → Generate wireframes
- /trilogy-design-handover → Gate 2
```

## Behavior Rules

- Max 3 UX questions + 3 UI questions per session (6 total)
- After UX phase, ask "Move to UI questions?" before proceeding
- Respect user termination signals at any point
- Save design.md after each answered question
- Always check Storybook before suggesting new components
- Always provide recommended option with reasoning

### Use AskUserQuestion Previews for Layout Decisions

When asking about spatial layout, component arrangement, or visual options, use the `AskUserQuestion` tool with the `markdown` preview field on each option. This renders an ASCII mockup in a side-by-side layout so the user can visually compare options instead of reading descriptions.

```json
{
  "questions": [{
    "question": "How should the filter bar be arranged?",
    "header": "Filter layout",
    "options": [
      {
        "label": "Search above, filters below (Recommended)",
        "description": "Search bar full-width, category pills on second row",
        "markdown": "┌──────────────────────────────┐\n│ 🔍 Search notes...     [x]  │\n├──────────────────────────────┤\n│ All │ Clinical │ Operational │\n└──────────────────────────────┘"
      },
      {
        "label": "Single row with dropdown",
        "description": "Search and filter on one line",
        "markdown": "┌──────────────────────────────┐\n│ 🔍 Search...  [Category ▾]  │\n└──────────────────────────────┘"
      }
    ],
    "multiSelect": false
  }]
}
```

Use previews for:
- Page layout options (single column vs sidebar vs split panel)
- Component arrangement (stacked vs inline vs grid)
- Navigation patterns (tabs vs sidebar vs breadcrumbs)
- Form layouts (single column vs multi-column vs wizard steps)

Do NOT use previews for simple preference questions where a label and description are enough (e.g. "Should we use optimistic updates?").

## Workflow Position

```
/trilogy-design              → design.md (initial)
        ↓
/trilogy-clarify-design      → design.md (refined)
        ↓
/trilogy-mockup              → mockups
        ↓
/trilogy-design-handover     → Gate 2
```
