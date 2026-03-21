---
title: "Design"
---

**Status:** Draft | In Review | Approved
**Designer:** Bruce (AI) / [Human Designer]
**Feature Spec:** [link to spec.md]
**Linear:** [TP-XXXX]
**Created:** [Date]
**Last Updated:** [Date]

---

## Overview

[1-2 sentence summary of the feature from a design perspective. What is the user trying to accomplish and what experience are we creating?]

---

## Design Resources

### LOOM Videos

| Title | Link | Description |
|-------|------|-------------|
| [Video Title] | [LOOM URL] | [Brief description of what the video covers] |

### Figma

| File | Link | Description |
|------|------|-------------|
| [File Name] | [Figma URL] | [What designs are included] |

### Miro

| Board | Link | Description |
|-------|------|-------------|
| [Board Name] | [Miro URL] | [What the board contains - flows, brainstorms, etc.] |

### Other Resources

| Type | Link | Description |
|------|------|-------------|
| [Type] | [URL] | [Brief description] |

---

## User Context

| Aspect | Decision | Rationale |
|--------|----------|-----------|
| **Primary User** | [Customer staff / Consumer / Internal staff] | [Why this user type] |
| **Device Priority** | [Desktop-primary / Mobile-first / Responsive-equal] | [Usage context] |
| **Usage Pattern** | [Daily power-user / Weekly / Occasional] | [Frequency impact] |
| **Information Density** | [Dense-efficient / Balanced / Spacious-friendly] | [User needs] |

---

## Layout & Structure

### Page Type

[Single page / Multi-step wizard / Master-detail / Dashboard / Form]

### Navigation Pattern

[Sidebar / Tabs / Breadcrumbs / Linear flow / None]

### Content Layout

[Description of main layout areas and their relationships]

```
┌─────────────────────────────────────────────────────────┐
│ Header / Breadcrumbs                                    │
├─────────────────────────────────────────────────────────┤
│ ┌─────────┐ ┌─────────────────────────────────────────┐ │
│ │         │ │                                         │ │
│ │ Sidebar │ │           Main Content                  │ │
│ │  (opt)  │ │                                         │ │
│ │         │ │                                         │ │
│ └─────────┘ └─────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────┤
│ Footer / Actions                                        │
└─────────────────────────────────────────────────────────┘
```

---

## Component Inventory

### Existing Components (from Storybook)

| Component | Usage | Variant/Props |
|-----------|-------|---------------|
| CommonCard | [Where used] | [variant: soft/outlined] |
| CommonButton | [Where used] | [colour: navy/teal] |
| CommonTable | [Where used] | [with sorting/filtering] |
| CommonModal | [Where used] | [size: sm/md/lg] |

### New Components Needed

- [ ] **ComponentName** - [Purpose and why existing components don't suffice]

### Pattern References

| Aspect | Reference Page | Notes |
|--------|----------------|-------|
| Table layout | /customers | Similar filtering pattern |
| Card design | /dashboard | Same card style |
| Form pattern | /settings | Multi-section form |

---

## Interaction Design

### Data Display

| Aspect | Decision | Details |
|--------|----------|---------|
| **View Type** | [Table / Card grid / List / Mixed] | |
| **Default Sort** | [Column, direction] | |
| **Filtering** | [Inline / Side panel / Search bar / None] | |
| **Pagination** | [Infinite scroll / Numbered pages / Load more] | |
| **Row Actions** | [Inline buttons / Dropdown menu / On hover] | |

### Editing Pattern

| Aspect | Decision | Details |
|--------|----------|---------|
| **Edit Method** | [Modal / Inline / Drawer / Dedicated page] | |
| **Validation** | [Inline real-time / On blur / Submit-time] | |
| **Save Feedback** | [Optimistic / Wait-for-server] | |
| **Unsaved Warning** | [Yes / No] | |

### Special Interactions

| Feature | Needed? | Details |
|---------|---------|---------|
| Bulk actions | [ ] Yes / [ ] No | [Which actions] |
| Drag & drop | [ ] Yes / [ ] No | [For what purpose] |
| Search | [ ] Yes / [ ] No | [What fields searchable] |
| Keyboard shortcuts | [ ] Yes / [ ] No | [Which shortcuts] |
| Real-time updates | [ ] Yes / [ ] No | [Polling / WebSocket] |

---

## States

### Loading States

| Context | Treatment | Duration Threshold |
|---------|-----------|-------------------|
| Initial page load | Skeleton matching content | Show after 200ms |
| Table data | Skeleton rows | Show after 200ms |
| Button action | Spinner in button, disable | Immediate |
| Form submit | Button spinner + "Saving..." | Immediate |

### Empty States

| Context | Message | CTA |
|---------|---------|-----|
| First time (no data) | "[Friendly message about getting started]" | [Primary action button] |
| No search results | "No results for '[query]'" | Clear filters / Try again |
| Error loading | "Unable to load [thing]. Please try again." | Retry button |

### Edge Cases

| Scenario | Handling |
|----------|----------|
| Very long text | Truncate with ellipsis, tooltip on hover |
| Missing optional data | Show "—" or hide field entirely |
| Concurrent edit conflict | [How to handle] |
| Permission denied | [How to handle] |

---

## Responsive Behavior

### Desktop (1024px+)

```
[ASCII layout for desktop]
```

- Full sidebar visible
- Multi-column layouts
- Hover interactions enabled
- Full table with all columns

### Tablet (768-1023px)

```
[ASCII layout for tablet]
```

- Collapsible sidebar
- [What changes from desktop]

### Mobile (320-767px)

```
[ASCII layout for mobile]
```

- Navigation: [Hamburger / Bottom tabs]
- Tables become: [Cards / Horizontal scroll / Simplified]
- Hidden on mobile: [List what's hidden]
- Touch targets: 44px minimum

---

## Accessibility

| Requirement | Implementation |
|-------------|----------------|
| **WCAG Level** | AA (default) |
| **Keyboard Navigation** | Full tab order, Enter/Space for actions |
| **Focus Indicators** | Visible focus rings (`:focus-visible`) |
| **Screen Reader** | [Specific announcements needed] |
| **Focus Trapping** | [Modals trap focus, return on close] |
| **Color Independence** | Status uses icons + text, not just color |

---

## Visual Design

### Colors (from Brand Guidelines)

| Usage | Color | Tailwind Class |
|-------|-------|----------------|
| Primary actions | Navy #2C4C79 | `bg-navy-500` |
| Secondary actions | Gray border | `border-gray-300` |
| Success | Green #4DC375 | `bg-green-100 text-green-600` |
| Warning | Orange #FF8F51 | `bg-orange-100 text-orange-600` |
| Error | Red #E04B51 | `bg-red-100 text-red-600` |
| Info | Blue #64BCEA | `bg-blue-100 text-blue-600` |

### Typography

| Element | Style |
|---------|-------|
| Page title | `text-2xl font-bold text-gray-900` |
| Section heading | `text-lg font-semibold text-gray-900` |
| Body text | `text-base text-gray-700` |
| Secondary text | `text-sm text-gray-500` |

### Spacing

| Context | Tailwind Class |
|---------|----------------|
| Page padding | `p-6` |
| Section gaps | `space-y-6` |
| Card padding | `p-4` or `p-6` |
| Form field gaps | `space-y-4` |
| Inline element gaps | `gap-2` or `gap-3` |

---

## Clarifications Log

### Session [YYYY-MM-DD]

| Question | Answer | Impact |
|----------|--------|--------|
| [Question asked] | [Answer given] | [Section updated] |

---

## Open Questions

- [ ] [Any remaining design questions that need stakeholder input]

---

## Wireframes

### [Screen Name 1]

```
[ASCII wireframe]
```

**Notes:** [Any specific notes about this screen]

### [Screen Name 2]

```
[ASCII wireframe]
```

**Notes:** [Any specific notes about this screen]

---

## Approval

| Role | Name | Date | Status |
|------|------|------|--------|
| Product Manager | | | [ ] Approved |
| Developer | | | [ ] Approved |
| Stakeholder | | | [ ] Approved |

---

## Next Steps

- [ ] `/trilogy.mockup` - Create interactive mockups (optional)
- [ ] `/speckit.plan` - Create technical implementation plan
- [ ] Create Linear sub-issues for UI implementation
