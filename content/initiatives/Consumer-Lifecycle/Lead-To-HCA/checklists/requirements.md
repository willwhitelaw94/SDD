---
title: "Requirements Checklist: Lead to HCA (LTH)"
---

# Requirements Checklist: LTH

**Spec**: [spec.md](../spec.md)
**Date**: 2026-02-09
**Reviewer**: —

---

## Content Quality

| Check | Status | Notes |
|-------|--------|-------|
| No implementation details (APIs, databases, frameworks) | PASS | Spec uses business language throughout |
| Focused on user value, not technical tasks | PASS | All stories describe user outcomes |
| Uses Trilogy Care terminology | PASS | Package, Recipient, Coordinator, etc. |
| Active voice throughout | PASS | "Sales Staff can..." not "can be..." |
| Concrete examples where helpful | PASS | Specific outcomes in acceptance scenarios |

---

## Requirement Completeness

| Check | Status | Notes |
|-------|--------|-------|
| No [NEEDS CLARIFICATION] markers | PASS | All requirements are specific |
| All requirements are testable | PASS | Each FR has clear success criteria |
| Edge cases documented | PASS | 6 edge cases covered |
| External dependencies identified | PASS | Assessment Tool, Calendly, Zoho API, E-signature |
| Out of scope clearly defined | PASS | Exit/Terminate, Amendments, ACER automation |

---

## INVEST Criteria (User Stories)

| Story | I | N | V | E | S | T | Status |
|-------|---|---|---|---|---|---|--------|
| US1: Convert with Immediate Agreement | Y | Y | Y | Y | Y | Y | PASS |
| US2: Conversion Essentials | Y | Y | Y | Y | Y | Y | PASS |
| US3: Risk Assessment Outcome | Y | Y | Y | Y | Y | Y | PASS |
| US4: Questionnaire with Calendly | Y | Y | Y | Y | Y | Y | PASS |
| US5: Digital Signature | Y | Y | Y | Y | Y | Y | PASS |
| US6: Sample Agreement Clinical | Y | Y | Y | Y | Y | Y | PASS |
| US7: Clinical Nurse Clears | Y | Y | Y | Y | Y | Y | PASS |
| US8: Manual Signature | Y | Y | Y | Y | Y | Y | PASS |

**Legend**: I=Independent, N=Negotiable, V=Valuable, E=Estimable, S=Small, T=Testable

---

## Feature Readiness

| Check | Status | Notes |
|-------|--------|-------|
| Acceptance criteria in Given/When/Then format | PASS | All scenarios use GWT format |
| Success criteria are measurable | PASS | SC-001 through SC-008 all quantified |
| Success criteria are technology-agnostic | PASS | No framework/API specifics |
| Key entities defined | PASS | Lead, Consumer, Care Plan, Package, Agreement, Deal, Risk/Clinical Outcomes |
| Priority assigned to each story | PASS | P1, P2, P3 assigned |

---

## Summary

| Category | Result |
|----------|--------|
| Content Quality | 5/5 PASS |
| Requirement Completeness | 5/5 PASS |
| INVEST Criteria | 8/8 stories PASS |
| Feature Readiness | 5/5 PASS |

**Overall Status**: READY FOR CLARIFICATION/PLANNING

---

## Recommendations

1. Run `/trilogy-clarify design` to nail down UI/UX patterns for the 4-step form
2. Run `/trilogy-clarify development` to identify architectural considerations (Zoho API integration, Assessment Tool contract)
3. Consider `/trilogy-mockup` for key screens (Step 1, Agreement signature, Clinical Review Index)
