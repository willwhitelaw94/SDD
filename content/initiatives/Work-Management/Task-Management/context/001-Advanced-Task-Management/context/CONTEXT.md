---
title: "Context: Advanced Task Management System (TSK)"
---


**Epic Code:** TSK
**Owner:** William Whitelaw
**Initiative:** Work Management
**Date Started:** 2026-01-03

---

## Idea Development Summary

### Key Decisions Made

1. **Single Large Epic (not phased)**
   - Decision: Build full task management system as one epic
   - Rationale: March deadline, coordinated rollout to internal users + coordinators

2. **Epic Code: TSK**
   - 3-letter code selected for "Task"
   - Unique within Work Management initiative

3. **Core Modules Covered**
   - Patients, Packages, Risks, Bills, Supplies, Coordinators
   - Each module will surface contextual AI-recommended tasks

4. **Frontend Views Priority**
   - Kanban board (primary interaction model)
   - Table/list view (leverage existing table components)
   - Timeline/Gantt deferred to future phases

5. **AI Task Generation**
   - Contextual recommendations surfaced throughout app
   - One-click capture into centralized task system
   - Scope: Rules-based initially, ML-based in future phases

6. **User Audience**
   - Internal users (primary)
   - Coordinators (equal priority)
   - Role-based access controls required

### Assumptions Locked In

- Existing table view components can be reused for task lists
- Current task data can be migrated or reset
- AI recommendation engine can integrate into module views
- March 2026 delivery is achievable with L (Large) effort estimate

### Business Clarifications Locked In

- ✅ **Primary Outcome:** Increase task adoption & engagement (60%+ target vs. near-zero v1)
- ✅ **Success Metrics:** Task adoption rate, avg tasks/user, completion rate, AI recommendation acceptance
- ✅ **Target Baseline:** 60%+ adoption within 3 months of launch
- ✅ **Stakeholders:** William (owner) + Coordinators + Internal users + Care Partners
- ✅ **Main Risks:** Timeline pressure (March) + AI recommendation accuracy

### Open Questions for Specification Phase

- [ ] Exact AI recommendation triggers per module (rules-based heuristics)
- [ ] Task dependency support (subtasks? linked tasks? blocking tasks?)
- [ ] Custom fields support for tasks?
- [ ] Team collaboration features (comments, mentions, assignees)?
- [ ] Reporting/analytics on task completion?
- [ ] Bulk task operations support?
- [ ] Care Partner access level (view-only? can comment/update?)

---

## Team & Stakeholders

| Name | Role | Involvement |
|------|------|------------|
| William Whitelaw | Owner | All decisions, primary contact |

---

## Timeline

- **2026-01-03:** Idea brief created (TSK Epic)
- **Next:** Specification phase via `/speckit.specify`
- **Target Delivery:** March 2026

---

## Related Artifacts

- `idea.md` — Publication-ready idea brief (updated with business context)
- `business-spec.md` — Business clarification output (outcomes, metrics, ROI, risks)
- `PROGRESS.md` — Ongoing status and team sync notes
