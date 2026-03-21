---
title: "Requirements Checklist: Incident Management"
---

# Requirements Checklist: Incident Management (ICM)

## Content Quality

- [x] No implementation details — spec describes what, not how
- [x] Focused on user value — each story explains why it matters
- [x] Business-readable language — uses Trilogy Care terminology (Package, Care Partner, Recipient)
- [x] No technical jargon — no mention of APIs, databases, components, frameworks
- [x] Plain language form descriptions match Marianne's V2 design intent
- [x] Phase 1 and Phase 2 stories clearly delineated with priority labels

## Requirement Completeness

- [x] No [NEEDS CLARIFICATION] markers — all requirements are specific
- [x] Every functional requirement is testable
- [x] Every success criterion is measurable
- [x] INVEST criteria validated for all user stories
- [x] Edge cases identified for boundary conditions (9 edge cases)
- [x] Out of scope items explicitly listed

### INVEST Validation

| Story | I | N | V | E | S | T | Notes |
|-------|---|---|---|---|---|---|-------|
| US1 — Raise Incident | Yes | Yes | Yes | Yes | Yes | Yes | Core intake — can be delivered standalone |
| US2 — View History | Yes | Yes | Yes | Yes | Yes | Yes | Read-only view — independent of intake |
| US3 — Harm Classification | No* | Yes | Yes | Yes | Yes | Yes | *Part of intake form but separately testable as a form section |
| US4 — View & Edit | Yes | Yes | Yes | Yes | Yes | Yes | Edit page — independent of intake (works on existing CRM-synced incidents) |
| US5 — Trend Tracking | Yes | Yes | Yes | Yes | Yes | Yes | Optional fields on intake |
| US6 — Actions & Escalation | Yes | Yes | Yes | Yes | Yes | Yes | Optional fields on intake |
| US7 — Open Disclosure | Yes | Yes | Yes | Yes | Yes | Yes | Optional fields on intake |
| US8 — Global Incidents List | Yes | Yes | Yes | Yes | Yes | Yes | Filtering on existing list |
| US9 — SIRS Deadline Tracking | Yes | Yes | Yes | Yes | Yes | Yes | Internal operational workflow |
| US10 — Feature Flag | Yes | Yes | Yes | Yes | Yes | Yes | Rollout control — independent |
| US11 — Zoho Coexistence | Yes | Yes | Yes | Yes | Yes | Yes | Sync preservation — independent |
| US12–17 (Phase 2) | Yes | Yes | Yes | Yes | No** | Yes | **Phase 2 stories are larger; will be broken down when Phase 2 is scoped |

*US3 is tightly coupled to US1 (both are part of the intake form) but is separated because harm classification is the most critical new capability and deserves focused testing.

**Phase 2 stories are vision-level and will need further breakdown into sprint-sized stories when Phase 2 is scoped.

## Feature Readiness

- [x] Acceptance criteria defined in Given/When/Then format
- [x] Priority assigned to each story (P1–P4)
- [x] Success criteria are technology-agnostic and measurable
- [x] Source artifacts referenced (form V2, documentation review, best practice guide)
- [x] Phasing strategy documented (Phase 1 vs Phase 2 with dependencies)
- [x] Feature flag rollout strategy included (US10)
- [x] Zoho CRM coexistence strategy included (US11)
- [x] Audit trail requirements specified (FR-026, FR-027)
- [ ] Design review completed — pending design team
- [ ] Care partner co-design session completed — Marianne emphasised early involvement

## Scope Notes

**Phase 1 — Portal Intake + Viewer (P1–P2)**:
- Incident intake form (V2 with 4-tier harm classification)
- Package incident visibility (list + detail view)
- Edit/detail page (closing the documented Edit.vue gap)
- Trend tracking, actions, escalation, follow-up, disclosure
- Global incidents list with filtering
- Basic SIRS deadline tracking (visibility, not enforcement)
- Feature flag controlled rollout
- Coexistence with Zoho CRM sync
- Audit trail with immutable intake snapshots

**Phase 2 — Full IMS with Automation (P3–P4)**:
- Auto-escalation based on harm classification
- Incident → Case automation (depends on CLI epic)
- Risk profile auto-update (depends on RNC2 epic)
- SIRS deadline enforcement with automated alerts
- Notifications (in-app + email)
- Analytics dashboard and Commission-ready export
