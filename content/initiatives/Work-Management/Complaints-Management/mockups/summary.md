---
title: "Mockup Summary: Feedback Records Management"
---

# Mockup Summary: Feedback Records Management

## Screens Generated

| # | Screen | File | Description |
|---|--------|------|-------------|
| 1 | Record List | `01-record-list.html` | Feedback records list within Package page, with filters, badges, and overdue indicators |
| 2 | Record Detail | `02-record-detail.html` | Full CRM-like single-pane-of-glass view with all fields, notes, action plan |
| 3 | Create Form | `03-create-form.html` | Full intake form with all CRM fields organized in sections |
| 4 | Stage Management | `04-stage-management.html` | Stage lifecycle visualization, advance options, and stage history |

## Design Decisions

### Layout: "Single Pane of Glass"
The detail view (Screen 2) follows the North Star principle — everything visible in one scrollable view without tabs or accordions:
- **Stage progress bar** at top for instant status
- **7-5 column split**: left for record data, right for people and timeline
- **Notes and Action Plan** full-width below the split
- No hidden content — all fields visible on scroll

### CRM-Like Feel
- **Two-column definition lists** for field display (mirrors CRM record layout)
- **All 30+ actively-used CRM fields** captured across create and detail views
- **Section grouping**: Record Overview, Complainant, Details (descriptions), Resolution, People & Ownership
- **Stage progression bar** gives quick visual status

### Badge System
- **Type badges**: Complaint (red), Remediation (amber)
- **Stage badges**: Active (blue), Closed (gray)
- **Triage badges**: Urgent (red), Medium (amber), Standard (gray)
- **CRM sync badge**: Sync pending (orange, with spinner)
- **Categories**: Multiple category tags as small gray pills

### Key Patterns
- **Overdue alert**: Red banner at top of detail view when past due date
- **CRM sync indicator**: Small non-blocking badge showing sync status
- **Stage advance**: Dedicated page with clear next-stage options and confirmation modal
- **Notes**: Chronological with author avatars, inline edit/delete for own notes
- **Action Plan**: Table with checkbox completion, due date highlighting, and actions menu
- **Resolution section**: Faded/disabled on create form (populated during investigation)

## CRM Field Coverage

### Create Form (Screen 3) captures:
- Type (Complaint/Remediation) — radio card selection
- Complainant Name, Complainant Type, Source, Incident link
- Triage Category, Primary Department, Categories of Concern (multiselect)
- Safety Concerns, Confidential, Priority Resolution
- Accountable Person, Quality Support Lead, Escalation Point, Due Date
- Description, Desired Outcome, Background/Events, Specific Language Used
- Resolution fields (disabled on create, enabled on edit)

### Detail View (Screen 2) displays:
- All create form fields plus:
- Reference number, Date Received
- Stage progress bar with all transitions
- People cards with assignment dates
- Stage transition timestamps
- Notes (full timeline with CRUD)
- Action Plan (table with completion tracking)
- CRM Sync status (Zoho ID, last push, migration flag)

## Recommendations

1. **Detail view is the hero** — users will spend most time here. The single-pane layout avoids the "accordion blindness" where collapsed sections get forgotten.

2. **Stage management as a separate page** keeps the detail view clean while giving stages the space they need for the complex lifecycle. The detail view shows the compact progress bar with a "View full history" link.

3. **Create form sections match detail view sections** — this consistency means users learn one layout. Resolution section is present but disabled on create (grayed out with "populated during investigation" label).

4. **Overdue indicator is prominent** — red banner at top of detail view is impossible to miss.

## Questions for Stakeholder Review

1. Is the 7-5 column split right, or would full-width be better for the detail view?
2. Should the stage advance options be on the detail page (inline) rather than a separate page?
3. Is the resolution section on the create form helpful (showing what will be needed later) or confusing?
4. Do all three people fields (AP, QSL, Escalation Point) need equal prominence?

## Next Steps

- [ ] Review mockups and provide feedback
- [ ] `/trilogy-clarify design` — Refine UX/UI decisions
- [ ] `/trilogy-design-handover` — Gate 2 (Design → Dev)
