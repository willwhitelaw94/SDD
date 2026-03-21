---
title: "Requirements Checklist: Feature Flag Toggles"
---

# Requirements Checklist: Feature Flag Toggles

## Content Quality

- [x] No implementation details (no mention of Laravel, Vue, SQL, API endpoints)
- [x] Focused on user value and business outcomes
- [x] Uses Trilogy Care terminology (Administrator, Organisation, User)
- [x] Written in active voice with concrete examples
- [x] Technology-agnostic success criteria

## Requirement Completeness

- [x] All user stories meet INVEST criteria
- [x] All acceptance scenarios use Given/When/Then format
- [ ] No clarification markers remain — **1 marker exists**: Multi-org user flag resolution
- [x] All functional requirements are testable
- [x] All success criteria are measurable
- [x] Edge cases documented

## INVEST Validation

| Story | I | N | V | E | S | T | Notes |
|-------|---|---|---|---|---|---|-------|
| US1 - View flags | Y | Y | Y | Y | Y | Y | Read-only, no dependencies |
| US2 - Toggle per user | Y | Y | Y | Y | Y | Y | Core value, clear scope |
| US3 - Org-level toggles | Y | Y | Y | Y | Y | Y | Extends US2 to org scope |
| US4 - Search & filter | Y | Y | Y | Y | Y | Y | UI enhancement, independent |

## Feature Readiness

- [x] Acceptance criteria defined for all stories
- [x] Scope hierarchy documented (Global → Org → User)
- [x] Existing flags inventoried (Nova Settings + PostHog)
- [x] Permission requirements stated (administrator only)
- [ ] Multi-organisation edge case needs clarification
