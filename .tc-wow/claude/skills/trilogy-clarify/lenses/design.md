# Design Lens

Refine UX/UI decisions in an existing design specification.

## Prerequisite

**REQUIRED**: `design.md` must already exist (created by `/trilogy-design`).

If design.md doesn't exist, skip this lens with message:
> "Design clarification requires an existing design artifact. Run `/trilogy-design` first to create design.md."

## Output
Updates existing `design.md` in the epic folder with clarified decisions.

## Phase 1: UX Clarification

Focus on **behavior, flow, and user experience** before visual decisions.

### HIGH PRIORITY
- **User Context**: Who is the primary user? (customer-facing staff, consumer/public, internal staff)
- **Task Flow**: What is the happy path? What are the decision points?
- **Information Architecture**: How is data organized? What's the hierarchy?
- **Navigation**: How do users get here? Where do they go next?

### MEDIUM PRIORITY
- **Interaction Model**: Direct manipulation vs form submission? Optimistic vs wait-for-server?
- **Error Handling**: How are errors surfaced? Recovery paths?
- **Edge Cases**: Empty states, bulk operations, undo/redo?
- **Device Priority**: Desktop-first or mobile-first? Touch considerations?

Max 3 UX questions.

## Phase 2: UI Clarification

Focus on **components, layout, and visual implementation** after UX is settled.

### Component Library Reference

**CRITICAL**: Before suggesting new components, check existing Storybook library.

```bash
ls stories/Common/
```

#### Available Components

**Layout**: CommonCard, CommonModal, CommonCollapsible, CommonTabs, CommonSplitPanel
**Data Display**: CommonTable, CommonList, CommonBadge, CommonKpiCard
**Forms**: CommonForm, CommonInput, CommonSelectMenu, CommonDatePicker, CommonButton
**Navigation**: CommonDropdown, CommonCommandPalette, CommonPagination
**Feedback**: CommonAlert, CommonConfirmDialog, CommonEmptyPlaceholder

### HIGH PRIORITY
- **Page Layout**: Single page, wizard, master-detail, dashboard?
- **Component Selection**: Which existing components fit?
- **Pattern Matching**: "Should look like [existing page]"?

### MEDIUM PRIORITY
- **States & Loading**: Skeleton loaders, spinners, optimistic updates?
- **Responsive Behavior**: Breakpoint adaptations needed?
- **New Components**: Any gaps requiring new components?

Max 3 UI questions.

## Document Structure

```markdown
# Design Specification: [Feature Name]

## 1. UX Decisions

### User Context
- **Primary User**: [staff type]
- **Device Priority**: [desktop/mobile/both]
- **Usage Pattern**: [frequency, duration]

### Task Flow
- **Happy Path**: [step-by-step]
- **Decision Points**: [branches]
- **Error Recovery**: [how users recover]

### Information Architecture
- **Data Hierarchy**: [primary → secondary → tertiary]
- **Navigation Context**: [where this fits in app]

### Interaction Model
- **Feedback Style**: [optimistic/wait-for-server]
- **Validation**: [inline/on-submit]

## 2. UI Decisions

### Page Layout
- **Type**: [single/wizard/master-detail/dashboard]
- **Structure**: [description or wireframe reference]

### Component Inventory

#### Existing Components (from Storybook)
| Component | Usage | Props/Variants |
|-----------|-------|----------------|

#### New Components Required
| Component | Purpose | Similar To |
|-----------|---------|------------|

### States
- **Loading**: [skeleton/spinner/deferred]
- **Empty**: [message]
- **Error**: [handling]

### Responsive Behavior
- **Desktop**: [default]
- **Tablet**: [adaptations]
- **Mobile**: [adaptations]

## 3. Clarification Log
| Phase | Question | Decision |
|-------|----------|----------|

## 4. Open Questions

## 5. Approval
- [ ] UX decisions approved
- [ ] UI decisions approved
- [ ] Ready for /trilogy-mockup
```
