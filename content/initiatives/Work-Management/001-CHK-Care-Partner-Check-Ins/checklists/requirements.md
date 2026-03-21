---
title: "Requirements Checklist: Care Partner Check-Ins"
---

# Requirements Checklist: Care Partner Check-Ins

**Date**: 2026-03-03
**Last Updated**: 2026-03-03 (post-clarification)

## Content Quality

- [x] No implementation details (no API, database, component, framework references)
- [x] Focused on user value and business outcomes
- [x] Written in plain English for business stakeholders
- [x] Uses Trilogy Care terminology (Package, Recipient, Coordinator, Care Partner)
- [x] Active voice throughout
- [x] Concrete examples provided

## Requirement Completeness

- [x] No [NEEDS CLARIFICATION] markers remain (0 of max 3)
- [x] All functional requirements are testable (FR-001 through FR-026)
- [x] All success criteria are measurable (SC-001 through SC-007)
- [x] Key entities defined without implementation detail
- [x] Edge cases identified and addressed (5 edge cases)
- [x] 16 clarifications resolved and applied

## INVEST Compliance

- [x] US1 (Dashboard View) — Independent, valuable, small, testable
- [x] US2 (Complete Check-In) — Independent, valuable, estimable, testable
- [x] US3 (Auto-Generate) — Independent, valuable, testable
- [x] US4 (Coordinator Check-Ins) — Independent, valuable, testable
- [x] US5 (Risk-Based Questions) — Independent, valuable, small, testable
- [x] US6 (Review Responses) — Independent, valuable, testable
- [x] US7 (Failed Attempts) — Independent, valuable, small, testable
- [x] US8 (Completion Report) — Independent, valuable, testable
- [x] US9 (Ad-Hoc Check-Ins) — Independent, valuable, small, testable
- [x] US10 (Auto-Mark Missed) — Independent, valuable, testable
- [x] US11 (System Transition) — Independent, testable
- [x] US12 (Configurable Cadence) — Independent, small, testable

## Feature Readiness

- [x] Acceptance scenarios in Given/When/Then format
- [x] Priority levels assigned (P1: 4 stories, P2: 6 stories, P3: 2 stories)
- [x] Success criteria baseline and targets defined
- [x] Two check-in types (internal/external) + ad-hoc scoped
- [x] Clinical question model clarified (risk-based, primary package only)
- [x] Lifecycle fully defined (Pending → In Progress → Completed/Missed/Cancelled)
- [x] Daily cron job scope defined (generation + missed transitions)
- [x] Notification strategy decided (replace existing job)
- [x] Form UX pattern decided (dedicated page)
- [ ] RACI not yet populated on idea brief — must be completed before Gate 1

## Clarification Coverage

| Category | Status |
|----------|--------|
| Functional Scope & Behavior | Clear |
| Domain & Data Model | Clear |
| User Journeys & Flows | Clear |
| Non-Functional Quality | Partial (no load/perf targets beyond SC-007) |
| Integration & Dependencies | Clear |
| Edge Cases & Failure Handling | Clear |
| Constraints & Tradeoffs | Partial (no rejected alternatives documented) |
| Terminology & Consistency | Clear |
| Completion Signals | Clear |
| Misc / Placeholders | Clear |
