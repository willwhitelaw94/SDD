---
title: "Design Challenge Brief: Feedback Records Management"
---

# Design Challenge Brief: Feedback Records Management

## Challenge Overview
Design a comprehensive feedback records management system for the TC Portal — complaint and remediation lifecycle management with notes, action plans, and CRM mirror push.

## Feature Summary
- **Source of truth**: Portal owns all feedback records. CRM is read-only mirror.
- **Record types**: Complaint (full lifecycle, triage, action plan) and Remediation (lighter, convertible to complaint)
- **Access**: Permission-based, not package-scoped. Multi-departmental.
- **Navigation**: Top-level index page (global) + package-level menu item (filtered)
- **Key entities**: FeedbackRecord, FeedbackActionItem, Notes (polymorphic)

## User Stories to Address
1. **Create** — Full intake form (type, complainant, description, categories, triage, department, safety, source, outcome, background)
2. **View** — Index list with search/filter/sort + detail view with all fields
3. **Edit** — Inline editing, blocked on closed records unless reopened
4. **Stage Management** — Complaint: 0.New → 6d.Closed. Remediation: 0.New → 5.Converted. Timestamps auto-recorded.
5. **Notes** — Create/edit/delete with attachments, chronological, author-only editing
6. **Action Plan** — Checklist items: description, assigned person/dept, due date, completed checkbox, completed_at, notes

## Key Interactions to Design
1. Scanning a list of feedback records — finding overdue, filtering by type/stage/triage
2. Opening a record and understanding its current state at a glance
3. Advancing through stage lifecycle with clear next-action visibility
4. Writing investigation notes with context
5. Managing action plan items (quick-complete, add notes, track due dates)
6. Creating a new feedback record with all intake fields

## Screens Per Student
1. **01-index.html** — Global feedback records index (search, filter, sort, badges)
2. **02-package-tab.html** — Feedback records within a package page
3. **03-detail-view.html** — Full record detail (overview, stage bar, people)
4. **04-create-form.html** — Intake form for new complaint/remediation
5. **05-notes-section.html** — Notes timeline on a record
6. **06-action-plan.html** — Action plan checklist on a record

## Constraints
- Portal shell with skeleton sidebar (framing only)
- TC Portal design system (flexible — use as guide, not hard constraint)
- TC brand: teal-700 `#007F7E`, teal-500 `#43C0BE`, primary-blue-700 `#2C4C79`
- Font: Roboto Flex
- Must handle: overdue indicators (red), CRM sync status, confidential records, empty states

## Evaluation Criteria
1. **Familiarity** — How recognizable are the patterns?
2. **Speed** — How fast can users complete tasks?
3. **Clarity** — Is the status/action obvious?
4. **Scalability** — Does it work for 5 items or 500?
5. **Information density** — Right amount of info at each level (list vs detail)

## Students

| # | Student | Paradigm | Focus |
|---|---------|----------|-------|
| 1 | Pyramid Petra | **Maslow Pyramid** | Maslow pyramid IS the UI — tier-based visual hierarchy, urgency as elevation, needs-based categorization |
| 2 | Clinical Chris | **Clinical/EHR** | Dense electronic health record register, SOAP-note style, structured assessment fields, clinical conventions |
| 3 | Canvas Clara | **Card Canvas / Kanban** | Trello-style board with swim lanes, cards per stage, drag to advance, visual workflow |
| 4 | Sidebar Sam | **Split Panel** | Split panel — persistent list + detail side by side, triage inbox, preview without navigation |
| 5 | Timeline Tess | **Vertical Timeline** | Vertical activity feed, expandable cards, chronological everything, event-driven UI |

## Deliverables Per Student
1. `research.md` — 3-5 patterns researched
2. `rationale.md` — Why these patterns work for TC Portal
3. 6 HTML mockup pages (01-06) with portal shell + viewer toolbar
