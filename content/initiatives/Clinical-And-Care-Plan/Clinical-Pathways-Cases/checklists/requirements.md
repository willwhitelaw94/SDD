---
title: "Requirements Checklist: Clinical Pathways / Cases"
---

# Requirements Checklist: Clinical Pathways / Cases

**Spec**: [spec.md](../spec.md)
**Date**: 2026-02-13

---

## INVEST Validation

| Story | I | N | V | E | S | T | Result |
|-------|---|---|---|---|---|---|--------|
| US1 — Create Case | Yes — standalone CRUD | Yes — form details negotiable | Yes — replaces 1000+ word CRM MPs | Yes — single form, clear scope | Yes — one sprint | Yes — Given/When/Then | PASS |
| US2 — View/Manage List | Yes — read-only view | Yes — layout negotiable | Yes — daily working view | Yes — list + detail | Yes — one sprint | Yes — 4 scenarios | PASS |
| US3 — Complete Review | Yes — review cycle standalone | Yes — review UX negotiable | Yes — core lifecycle mechanism | Yes — review form + history | Yes — one sprint | Yes — 5 scenarios | PASS |
| US4 — Incident → Case | Yes — requires ICM but testable with mock | Yes — prompt flow negotiable | Yes — eliminates manual CRM handoff | Yes — automation bridge | Yes — one sprint | Yes — 4 scenarios | PASS |
| US5 — Risk Register Link | Yes — linkage standalone | Yes — UI negotiable | Yes — bidirectional visibility | Yes — association CRUD | Yes — one sprint | Yes — 3 scenarios | PASS |
| US6 — Feature Flag | Yes — flag infrastructure | Yes — rollout strategy negotiable | Yes — risk mitigation | Yes — standard Pennant pattern | Yes — one sprint | Yes — 3 scenarios | PASS |
| US7 — Reporting | Yes — read-only aggregate | Yes — metrics negotiable | Yes — governance visibility | Yes — dashboard scope | Yes — one sprint | Yes — 3 scenarios | PASS |

---

## Functional Requirements Traceability

| FR | Story | Testable | Description |
|----|-------|----------|-------------|
| FR-001 | US1 | Yes | Three case types |
| FR-002 | US1 | Yes | Case creation flow |
| FR-003 | US1, US3 | Yes | Lifecycle statuses |
| FR-004 | US1 | Yes | Review schedule required at creation |
| FR-005 | US3 | Yes | Complete scheduled review |
| FR-006 | US3 | Yes | Mandatory case closure justification |
| FR-007 | US3 | Yes | Escalation upgrades to Mandatory |
| FR-008 | US1, US3 | Yes | Full audit trail |
| FR-009 | US2 | Yes | Case list display |
| FR-010 | US2 | Yes | Overdue review highlighting |
| FR-011 | US5 | Yes | Risk linking |
| FR-012 | US4 | Yes | Incident linking |
| FR-013 | US4 | Yes | Auto-create case from incident |
| FR-014 | US4 | Yes | Duplicate prevention |
| FR-015 | US6 | Yes | Feature flag per org |
| FR-016 | US2 | Yes | Case detail view |
| FR-017 | US1 | Yes | Editable concern + interval |
| FR-018 | US2 | Yes | Soft delete |
| FR-019 | US1 | Yes | Permission enforcement |
| FR-020 | US7 | Yes | Population reporting |
| FR-021 | US7 | Yes | Organisation filter |
| FR-022 | US5 | Yes | Bidirectional risk-case link |

| FR-023 | US1, US7 | Yes | Explicit assignee field |

**Coverage**: 23/23 FRs mapped to stories. 0 orphaned requirements.

---

## Clarification Markers

All markers resolved in spec clarify session 2026-02-13.

| Marker | Location | Resolution |
|--------|----------|------------|
| ~~Escalation auto-notification~~ | US3, scenario 4 | RESOLVED — deferred to Phase 2. Escalation status recorded; no notification in Phase 1 |

**Total**: 0 open markers

---

## Edge Case Coverage

| Edge Case | Addressed | Resolution |
|-----------|-----------|------------|
| Case with no incident or risk link | Yes | "Clinical judgement" trigger covers this |
| Linked incident deleted | Yes | Case retains reference noting deletion |
| Linked risk deleted | Yes | Association removed; case unaffected |
| Mandatory review missed | Yes | Flagged overdue; no auto-escalate in Phase 1 |
| Reopen closed case | Yes | Not allowed; create new case with reference |
| Flag toggled mid-session | Yes | Current action completes; hidden on next load |
