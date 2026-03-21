---
title: "Calls Uplift - UI Mockups"
---

# Calls Uplift - UI Mockups

ASCII wireframe mockups for the Calls Uplift feature in TC Portal.

## Mockup Index

| Mockup | Description | Priority |
|--------|-------------|----------|
| [Calls Page](/initiatives/work-management/calls-uplift/context/mockups/01-calls-page) | Main calls inbox table with filters, status badges, and bulk actions | P1 |
| [Call Review Modal](/initiatives/work-management/calls-uplift/context/mockups/02-call-review-modal) | Modal for reviewing individual calls with AI summary, transcription, and package linking | P1 |
| [Global Inbox Badge](/initiatives/work-management/calls-uplift/context/mockups/03-global-inbox-badge) | Header component showing unreviewed call count with dropdown preview | P1 |

---

## Design Context

These mockups are based on:

- [Feature Specification](/initiatives/work-management/calls-uplift/spec)
- [Design Specification](/initiatives/work-management/calls-uplift/design-spec)

## Key Design Decisions

### Layout Approach
- **Table-based** calls list with inline row expansion or modal detail view
- **Modal** for call review to avoid page navigation during workflow
- **Dropdown** preview in header for quick access without context switching

### Status Indicators
- **PENDING** (orange/amber) - Call needs review
- **REVIEWED** (green) - Call review completed
- **UNLINKED** (red/warning) - No package linked

### AI Summary First
- AI-generated summary shown expanded by default
- Full transcription collapsed, available on demand
- Reduces cognitive load for quick reviews

### Package Linking
- Auto-matched packages shown with confidence indicator
- Multiple matches require explicit selection
- Search fallback for unmatched calls

---

## Component Inventory

### Existing Components (from Storybook)

| Component | Usage |
|-----------|-------|
| `CommonTable` | Call list with sorting/filtering |
| `CommonModal` | Call review details (large size) |
| `CommonCard` | Package context display |
| `CommonBadge` | Status indicators |
| `CommonButton` | Action buttons |
| `CommonAlert` | Flash notification banner |
| `CommonEmptyPlaceholder` | Empty states |
| `CommonCollapsible` | AI summary and transcription sections |
| `CommonDropdown` | Filter dropdowns, header dropdown |
| `CommonToast` | Success/error notifications |

### New Components Required

| Component | Purpose |
|-----------|---------|
| `CallInboxBadge` | Header badge with count and dropdown preview |
| `CallSummaryCard` | AI summary display with copy action |
| `TranscriptionViewer` | Speaker-aware transcription with timestamps |

---

## Next Steps

1. Review mockups with Product/Design team
2. Create interactive Figma prototypes (if needed)
3. Implement components following existing Storybook patterns
4. Write feature tests for key user flows
