---
title: "Requirements Checklist: Client Home Care Agreement (HCA)"
---

**Epic**: HCA - Client Home Care Agreement
**Specification**: [spec.md](../spec.md)
**Generated**: 2026-01-22

---

## Content Quality

| Criteria | Status | Notes |
|----------|--------|-------|
| No implementation details in user stories | ✅ Pass | Stories focus on user outcomes, not technical approach |
| User stories focused on value delivery | ✅ Pass | Each story describes user benefit |
| Requirements are technology-agnostic | ✅ Pass | No framework/library references in requirements |
| Success criteria are measurable | ✅ Pass | All SC-xxx items have specific metrics |
| Edge cases identified | ✅ Pass | 5 edge cases documented |

---

## Requirement Completeness

| Criteria | Status | Notes |
|----------|--------|-------|
| All user stories have acceptance scenarios | ✅ Pass | Each story has 3-6 acceptance scenarios in Given/When/Then format |
| User stories are prioritized (P1/P2/P3) | ✅ Pass | 5 P1, 8 P2, 3 P3 stories |
| User stories are independently testable | ✅ Pass | Each story has Independent Test description |
| Functional requirements are testable | ✅ Pass | All FR-xxx items use MUST and are verifiable |
| Key entities defined | ✅ Pass | 10 entities identified with attributes |
| Open questions documented | ✅ Pass | 4 open questions listed |

---

## Feature Readiness

| Criteria | Status | Notes |
|----------|--------|-------|
| Acceptance criteria defined for all P1 stories | ✅ Pass | 5 P1 stories with full acceptance scenarios |
| Integration points identified | ✅ Pass | ACI, Services Australia, Zoho (interim) noted |
| Permissions model documented | ✅ Pass | FR-050 to FR-053 cover access control |
| Audit requirements specified | ✅ Pass | Multiple FR items require audit logging |
| Compliance requirements addressed | ✅ Pass | ACER lodgement, termination workflow, consent artefacts |

---

## Clarification Markers

| Marker | Location | Status |
|--------|----------|--------|
| Ex-client visibility | Open Questions #1 | ⏳ Needs stakeholder input |
| TPC cross-surfacing | Open Questions #2 | ⏳ Needs stakeholder input |
| SLA policy confirmation | Open Questions #3 | ⏳ Needs stakeholder input |
| Durable storage (audio) | Open Questions #4 | ⏳ Needs stakeholder input |

---

## Related Jira Issues

| Issue | Title | Status | Linked User Story |
|-------|-------|--------|-------------------|
| [TP-1865](https://trilogycare.atlassian.net/browse/TP-1865) | Client HCA Epic | Triaged | All stories |
| [TP-516](https://trilogycare.atlassian.net/browse/TP-516) | Recipient HCA | Done | US-1 to US-13 |
| [TC-2113](https://trilogycare.atlassian.net/browse/TC-2113) | Package Management Option | Reviewing | US-16 |
| [TC-2498](https://trilogycare.atlassian.net/browse/TC-2498) | ACER (Aged Care Entry Record) | Reviewing | US-14 |
| [TP-533](https://trilogycare.atlassian.net/browse/TP-533) | ACER | Backlog | US-14 |
| [TP-527](https://trilogycare.atlassian.net/browse/TP-527) | Package Management Option | Reviewing | US-16, US-17 |
| [TCR-35](https://trilogycare.atlassian.net/browse/TCR-35) | Recontracting | Discovery | US-18 |

---

## Summary

- **Total User Stories**: 19
- **P1 (Critical)**: 6 (includes SAH Recontracting)
- **P2 (Important)**: 10 (includes Zoho Bridging)
- **P3 (Nice-to-have)**: 3
- **Functional Requirements**: 116
- **Open Questions**: 5 (includes LTH package timing question)
- **Overall Readiness**: Ready for clarification and mockups
- **Upstream Dependency**: Lead to HCA (LTH) Conversion Wizard

---

## Next Steps

1. `/speckit.clarify` — Resolve 4 open questions with stakeholders
2. `/trilogy.mockup` — Create UI mockups for Agreements area
3. `/speckit.plan` — Create phased implementation plan
4. `/speckit.tasks` — Generate dependency-ordered task list
