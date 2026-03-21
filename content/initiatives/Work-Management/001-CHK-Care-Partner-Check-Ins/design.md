---
title: "Design Brief: Care Partner Check-Ins"
status: Approved
created: 2026-03-03
---

# Design Brief: Care Partner Check-Ins

**Epic:** CHK
**Spec:** [spec.md](spec.md)

---

## User Context

| Aspect | Answer | Impact on Design |
|--------|--------|------------------|
| Primary User | Care Partner | Owns the daily check-in workflow — optimise for their morning routine |
| Secondary Users | Care Coordinator, Clinical Team, Team Lead | Coordinators share the same completion flow; clinical team defines questions on risks and reviews responses; team leads monitor completion rates |
| Device Priority | Desktop-first | Can use full-width layouts, tables, keyboard shortcuts |
| Usage Frequency | Daily | Worth investing in efficient card layouts, quick-action patterns |
| Context | Morning routine — review dashboard, prioritise calls, make calls, record outcomes | Design should support a sequential "review → call → record" flow |

### User Workflows

**Care Partner (daily):**
1. Open dashboard → scan overdue/today check-ins
2. Click a check-in → review client context + risk questions
3. Make the call
4. Complete the form (notes, wellbeing, question responses, follow-up)
5. Submit → next check-in auto-scheduled

**Clinical Team (periodic):**
1. Open a client's risk record
2. Add check-in questions to active risks
3. Later: review completed check-in responses grouped by risk

**Team Lead (weekly):**
1. View completion report → identify lagging care partners
2. Spot flagged check-ins (3+ failed attempts)
3. Export compliance data

---

## Design Principles

**North Star:** Structured and auditable — every client interaction is captured properly for compliance, while keeping the workflow practical for daily use.

**Supporting Principles:**
1. **Complete record over speed** — the form should guide care partners through all required fields, but not block them with unnecessary friction
2. **Context before action** — show the client's last check-in summary, active risks, and clinical questions before the call, not after
3. **Clear status at a glance** — dashboard cards must instantly communicate overdue/today/upcoming, attempt count, and question count without clicking
4. **Audit-ready by default** — every state change (pending → completed, missed, cancelled) is timestamped and attributed

---

## Build Size

**Size:** Large (L)

**Rationale:**
- 6+ new screens/views (dashboard cards, dedicated completion page, clinical question management on risks, response review, completion report, ad-hoc creation)
- New entity with full lifecycle (Pending → In Progress → Completed/Missed/Cancelled)
- New relationship between risks and check-in questions (extends existing risk model)
- Daily cron job with generation + missed transitions
- Notification job replacement
- Feature flag for parallel running with legacy system

---

## Scope

**MVP (P1 + P2 — 10 stories):**
- Dashboard integration (overdue/today/upcoming cards)
- Check-in completion page (summary, wellbeing 1-5, risk questions, follow-up)
- Auto-generation via daily cron (default 3-month cadence)
- Coordinator external check-ins
- Risk-based clinical questions (define on risks, inherit on check-ins)
- Clinical response review
- Failed attempt tracking (3+ = dashboard flag)
- Completion report with export
- Ad-hoc check-in creation
- Auto-mark Missed after 30 days

**Deferred (P3):**
- System transition from package-date tracking (Story 11) — feature flag in place but parallel running deferred
- Configurable cadence per client (Story 12) — default 3 months covers most cases
- Question assignment from teams beyond clinical (non-goal for V1)
- Client-facing check-in experience (non-goal for V1)

**Feature Flags:**
- `care-partner-check-ins` — Controls whether the new check-in records are shown on the dashboard vs the legacy package-date computation

---

## Constraints

### Accessibility
- Standard portal level — follow existing keyboard navigation and ARIA patterns
- No special WCAG target beyond current portal standards

### Security & Privacy
- **Visibility:** Role-based broad access
  - Care partners see their own assigned clients' check-ins on their dashboard
  - Team leads, clinical, and coordinators can see all check-ins across the organisation
  - Wellbeing ratings and clinical question responses are visible to all staff with check-in access
- **Audit trail:** All state changes timestamped and attributed to user

### Dependencies
- **Risk model** — check-in questions are added to risk records (requires new `RiskQuestion` model/relationship on existing `Risk`)
- **Care Partner Dashboard** — My Activities panel needs to render new check-in entity cards alongside existing items
- **Notification system** — existing `CheckInNotificationsJob` replaced with new record-based notifications
- **Package model** — `int_check_in_date` and `ext_check_in_date` fields coexist during transition but are not updated by new system

---

## Edge Cases

| Edge Case | How to Handle | Priority |
|-----------|---------------|----------|
| **No check-ins due** | Empty state on dashboard: "No check-ins due — all caught up" | P1 |
| **First check-in for client** | Show "First check-in for this client" instead of previous summary | P1 |
| **Client with no active risks** | Questions section empty but check-in completable without questions | P1 |
| **Draft state (mid-call pause)** | Preserve form progress when navigating away — auto-save draft | P1 |
| **Care partner reassignment** | Pending check-ins automatically reassigned to new care partner | P1 |
| **Client with no assigned care partner** | Check-in created as "Unassigned", flagged for coordination team | P2 |
| **Multiple active packages** | One check-in per client (not per package). Questions from primary package risks only | P2 |
| **Package suspended** | Pending check-ins remain; no new ones generated until reactivation | P2 |
| **Concurrent internal + external** | Both proceed independently — separate check-in types for same client in same period | P2 |
| **3+ failed attempts** | Visual flag on dashboard card for team lead attention | P2 |
| **30+ days overdue** | Auto-transition to Missed, generate next check-in | P2 |
| **Risk closed after question added** | Question no longer inherited on next check-in; previous responses preserved | P2 |
| **Ad-hoc + scheduled overlap** | Ad-hoc check-in doesn't affect scheduled cadence — both coexist | P2 |
| **Cancelled check-in** | Record preserved with mandatory reason for audit | P3 |
| **Large report data** | Pagination/lazy loading for completion reports spanning 15,000 clients | P3 |

---

## Screen Inventory

| Screen | Type | Users | Notes |
|--------|------|-------|-------|
| Dashboard check-in cards | Component (in existing My Activities) | Care Partner, Coordinator | Overdue/Today/Upcoming grouping, question count, attempt count, flagged state |
| Check-in completion page | New dedicated page | Care Partner, Coordinator | Client context, previous summary, risk questions, wellbeing, notes, follow-up |
| Failed attempt form | Modal or inline action | Care Partner, Coordinator | Quick reason selection + optional notes |
| Risk question management | Extension of existing risk form | Clinical Team | Add/edit/remove check-in questions on risk records |
| Check-in response review | New section on client profile | Clinical Team | Completed check-ins with responses grouped by risk |
| Completion report | New report page | Team Lead, Manager | Completion rates by care partner, team, period. Export capability |
| Ad-hoc check-in creation | Action on client profile | Care Partner, Coordinator | Quick-create with today's date |
| Cancellation dialog | Modal | Any staff | Mandatory reason field |

---

## UX Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Completion page layout | **TBD — deferred to mockup** | User wants to explore options visually during mockup phase |
| Post-submit redirect | **Back to dashboard** | Supports sequential morning workflow — complete one, start next |
| Failed attempt action | **Inline on completion page** | "Log Attempt" button opens inline form (reason dropdown + notes). Stays on same page, no modal needed |

## UI Decisions

| Decision | Choice | Component | Rationale |
|----------|--------|-----------|-----------|
| Dashboard card style | **Evolve existing** | CommonCard (enhanced) | Keep consistency but add: question count badge, attempt count, type indicator (INT/EXT), flagged state |
| Completion report | **KPI header + table** | CommonKpiCard + CommonTable | KPI cards (rate, overdue, completed) above filterable per-care-partner table. Export button. |
| Risk question management | **Separate tab on risk page** | CommonTabs (new tab) | "Questions" tab alongside existing risk tabs. Dedicated space for add/edit/remove check-in questions |

## Clarification Log

| Phase | Question | Decision |
|-------|----------|----------|
| UX | Completion page layout | Deferred to mockup — user wants to explore visually |
| UX | Post-submit redirect | Back to dashboard (sequential morning workflow) |
| UX | Failed attempt action | Inline on completion page (reason dropdown + notes) |
| UI | Dashboard card style | Evolve existing CommonCard with badges and indicators |
| UI | Completion report pattern | KPI header cards + filterable CommonTable + CSV export |
| UI | Risk question management | Separate tab on risk page (not embedded in form) |

---

## Gate 2: Design Handover

**Date**: 2026-03-03
**Status**: PASS (14/14 checks)

### Checklist Results

**Design Kickoff Completeness (5/5):**
- [x] User research complete — primary/secondary users, device, frequency, context
- [x] Design principles defined — north star + 4 supporting principles
- [x] Edge cases identified — 15 cases with handling strategies
- [x] Constraints documented — accessibility, security, dependencies
- [x] Build size assessed — Large (L) with rationale

**Mockup Coverage (4/4):**
- [x] Key screens mocked up — 5 screens covering all primary workflows
- [x] Design system used — TC Portal tokens, correct brand colours
- [x] UX decisions resolved — layout, navigation, interactions finalised
- [x] UI component decisions — CommonCard, CommonKpiCard, CommonTable, CommonTabs

**Design-Spec Alignment (3/3):**
- [x] All 10 MVP user stories have design coverage
- [x] 7 measurable success criteria defined
- [x] MVP vs deferred scope clearly phased

**Stakeholder Alignment (2/2):**
- [x] Risks and constraints documented
- [x] Dependencies identified (4 systems)

---

### Design Handover Summary

#### What We're Building

A standalone check-in record system replacing Excel-based tracking. Care partners and coordinators get a dashboard-driven workflow to manage quarterly client check-ins, with clinical team question assignment via risk records and structured completion forms capturing wellbeing, notes, and follow-up actions.

#### Key Screens

| # | Screen | Purpose | Key Interactions |
|---|--------|---------|------------------|
| 1 | Dashboard Cards | Entry point — scan overdue/today/upcoming | Click card → completion page |
| 2 | Completion Page | Core workflow — call + record | Fill form, answer risk questions, rate wellbeing, submit |
| 3 | Completion Report | Management visibility | Filter by period/team/type, export CSV |
| 4 | Risk Questions Tab | Clinical question management | Add/edit/remove questions on risk records |
| 5 | Failed Attempt | Track unsuccessful contact | Log reason via inline radio cards |

#### Component Decisions

**Reusing Existing:**
- `CommonCard` — Dashboard check-in cards (evolved with badges)
- `CommonTable` — Completion report per-care-partner table
- `CommonTabs` — Risk page tab for "Check-In Questions"
- `CommonBadge` — INT/EXT type indicators, flagged state, question count
- `CommonAlert` — Attempt warning banner (amber)
- `CommonButton` — Submit/draft/cancel actions

**New Patterns Needed:**
- Wellbeing rating component — 1-5 number buttons with selected state
- Attempt timeline — numbered circles with connecting line
- Radio card grid — for failed attempt reason selection
- Risk-grouped question sections — collapsible sections with risk name headers

#### Critical UX Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Completion page layout | Two-column (1/3 context + 2/3 form) | Context before action — client info always visible |
| Post-submit redirect | Back to dashboard | Sequential morning workflow support |
| Failed attempt action | Inline on completion page | No modal — stays in context |
| Dashboard card style | Evolve existing CommonCard | Consistency with current dashboard |
| Report pattern | KPI header + filterable table | Standard reporting pattern for TC Portal |
| Risk question management | Separate tab on risk page | Dedicated space, not embedded in existing form |

#### Data Requirements

| Screen | Data Needed | Source |
|--------|-------------|--------|
| Dashboard Cards | Check-ins with client, type, due date, questions count, attempts | CheckIn model → DashboardRepository |
| Completion Page | Client summary, previous check-in, active risks with questions | CheckIn + Client + Package + Risk + RiskQuestion |
| Completion Report | Aggregated completion rates by care partner, team, period | CheckIn model aggregate queries |
| Risk Questions Tab | Risk questions, answer types, recent responses | RiskQuestion + CheckInResponse |
| Failed Attempt | Attempt history, reason options | CheckInAttempt model |

#### Open Questions for Development

- [ ] Should the two-column layout use a fixed sidebar or scroll independently?
- [ ] Default report period: current quarter or previous quarter?
- [ ] Risk question responses: link to check-ins or show inline on risk tab?
- [ ] Failed attempt reason list — 5 sufficient or add more?

#### Out of Scope (Deferred to P3)

- System transition from package-date tracking (Story 11)
- Configurable cadence per client (Story 12)
- Question assignment from teams beyond clinical
- Client-facing check-in experience

---

### Next Steps

- [ ] `/speckit-plan` — Technical implementation plan
- [ ] Developer to review design artifacts and mockups
- [ ] Schedule architecture discussion if needed
