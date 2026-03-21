---
title: "Requirements Checklist: Feedback Records Management"
---

# Requirements Checklist: Feedback Records Management

## Content Quality

- [x] No implementation details (no mention of frameworks, APIs, databases)
- [x] Focused on user value and business outcomes
- [x] Written in business-readable language (Trilogy Care terminology)
- [x] Active voice throughout
- [x] Concrete examples where appropriate

## Requirement Completeness

- [x] All user stories meet INVEST criteria
- [x] All functional requirements are testable
- [x] All success criteria are measurable
- [x] Edge cases identified and resolved with expected behaviour
- [ ] 3 must-answer stakeholder questions remain (Action Plan fields, Direct vs Indirect, old module)

## Feature Readiness

- [x] Acceptance scenarios use Given/When/Then format
- [x] User stories prioritised (P1/P2)
- [x] Each story independently testable
- [x] Key entities defined
- [x] Success criteria are technology-agnostic
- [x] Phasing strategy defined (Phase 1: core management, Phase 2: notes integration, Phase 3: public form)
- [x] CRM field mapping documented with active-use fields identified
- [x] Out of scope explicitly defined
- [x] Permissions and access control specified (6 permission keys, full role matrix)
- [x] Non-functional requirements defined (8 NFRs)
- [x] Edge cases resolved with expected system behaviour (7 cases)
- [x] Architecture decision documented (Portal = source of truth)
- [x] Terminology defined (Feedback Record as generic term)

## Major Decisions Recorded

- [x] Portal is source of truth (not CRM)
- [x] No CRM→Portal sync — one-way push only
- [x] Full intake form on Portal (all CRM fields)
- [x] Action Plan fully Portal-managed
- [x] CRM push is non-blocking
- [x] Migration: active + 12 months closed
- [x] Public intake form on Portal (Phase 3)
- [x] Note deletion pushes to CRM
- [x] "Feedback Record" as generic term
- [x] Stage management via `manage-complaint-stages` permission

## Open Items

1. **Action Plan subform fields**: Confirm schema from a populated CRM record
2. **Direct vs Indirect classification**: How determined? Drives NoteCategoryEnum
3. **Old Complaints module (CustomModule14)**: Still active or superseded?
