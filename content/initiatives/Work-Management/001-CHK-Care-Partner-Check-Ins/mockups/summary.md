---
title: "Mockup Summary: Care Partner Check-Ins"
---

# Mockup Summary: Care Partner Check-Ins

**Generated:** 2026-03-03
**Format:** HTML/Tailwind with TC Portal design system
**Shell:** Portal skeleton sidebar framing

---

## Screens

| # | Screen | File | Description |
|---|--------|------|-------------|
| 1 | Dashboard Check-In Cards | `01-dashboard-checkins.html` | My Activities panel with Overdue/Today/Upcoming grouping. Shows INT/EXT badges, question counts, attempt counts, flagged state, and "First" badge for new clients |
| 2 | Check-In Completion Page | `02-checkin-completion.html` | Two-column layout — left: client summary, previous check-in, active risks; right: clinical questions (grouped by risk), wellbeing 1-5 rating, notes, follow-up, draft/submit actions |
| 3 | Completion Report | `03-completion-report.html` | KPI header cards (completion rate, completed, overdue, flagged) + filterable per-care-partner table with CSV export. Period/team/type filters |
| 4 | Risk Questions Tab | `04-risk-questions-tab.html` | New "Check-In Questions" tab on risk detail page. Shows existing questions with type badges, add new question form, and recent response preview |
| 5 | Failed Attempt (Inline) | `05-failed-attempt.html` | Same completion page context but showing: attempt history timeline, expanded inline "Log Attempt" form with reason radio cards + notes |

---

## Key Design Patterns

### Dashboard Cards (Screen 1)
- **Grouped by urgency**: Overdue (red dot + red border), Today (teal dot), Upcoming (gray dot, slightly faded)
- **Card information density**: Client name, type badge (INT/EXT), due date, overdue duration, question count, attempt count
- **Flagged state**: Amber badge with flag icon + "3 attempts" for 3+ failed attempts
- **First check-in**: Purple "First" badge when no previous check-in exists
- **Click target**: Entire card row is clickable → navigates to completion page

### Completion Page (Screen 2)
- **Two-column layout** (1/3 context + 2/3 form): Context before action — client summary, previous check-in, and active risks visible alongside the form
- **Clinical questions grouped by risk**: Each risk section has a coloured dot + risk name header. Questions use appropriate input types (radio, select, textarea)
- **Wellbeing rating**: Large clickable number buttons (1-5) with selected state highlight
- **Attempt banner**: Amber warning bar at top when attempts exist
- **Actions**: Save Draft + Complete Check-In, with back-to-dashboard link

### Completion Report (Screen 3)
- **KPI cards**: 4 metric cards with trend indicator, progress bar (completion rate), and descriptive labels
- **Per-care-partner table**: Sortable columns for due/completed/overdue/missed/rate/flagged. Low-performing rows highlighted with red tint
- **Filters**: Period (quarterly), team, and type dropdowns above KPI cards
- **Pagination**: Standard numbered pagination with page count

### Risk Questions Tab (Screen 4)
- **Tab integration**: New "Check-In Questions" tab with question count badge on risk detail page
- **Question cards**: Show question text, answer type badge (Yes/No, Multiple Choice, Free Text, Rating), options preview, added-by attribution
- **Add form**: Dashed border container with question text + answer type selector
- **Response preview**: Recent responses inline with Q1/Q2 labels, linking to full response view

### Failed Attempt (Screen 5)
- **Attempt timeline**: Numbered circles (colour-coded by recency) with connecting line, reason badge, notes, and timestamp
- **Inline form**: Radio card grid for reason selection with teal highlight on selected option
- **Reason options**: No answer, Client unavailable, Wrong number, Client declined, Other

---

## Recommendations

1. **Completion page layout**: The two-column (1/3 + 2/3) layout works well for desktop-first — context visible alongside the form without scrolling. Recommended for implementation.

2. **Dashboard card density**: Current card rows are compact enough for 10+ items without scrolling. Consider adding a summary count at the top ("5 overdue, 2 today, 4 upcoming") if care partners manage large caseloads.

3. **Question types on risks**: The 4 answer types (Free Text, Yes/No, Multiple Choice, Rating 1-5) cover the clinical team's likely needs. Can be extended later without breaking existing responses.

4. **Failed attempt form**: The radio card grid is more scannable than a dropdown for 5 options. Keeps the care partner on the same page as the completion form.

---

## Open Questions for Stakeholder Feedback

- [ ] Is the two-column completion page layout preferred, or would a single-column full-width form be better?
- [ ] Should the completion report default to the current quarter or the previous quarter?
- [ ] Should the "Responses" section on risk questions tab link to completed check-ins or show responses inline?
- [ ] Are the 5 failed attempt reasons (no answer, unavailable, wrong number, declined, other) sufficient?

---

## Next Steps

- [ ] Review mockups with stakeholders
- [ ] `/trilogy-design-handover` — Gate 2 (Design → Dev)
