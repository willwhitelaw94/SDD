---
title: "Idea Brief: Roles & Permissions Refactor (RAP)"
description: "Infrastructure > Roles And Permissions Refactor"
icon: i-heroicons-light-bulb
navigation:
  order: 1
---

**Epic Code**: RAP (TP-2403) | **Created**: 2026-01-14

---

## Problem Statement (What)

User and team management in Portal does not exist and causes issues when staff and teams change at Trilogy.

**Pain Points:**
- No team management UI — team relationships are invisible to users
- Teams are essential to foundational features (tasks, package management, bill processing) but lack proper management tools
- Team leaders cannot manage their own team membership (add/remove members)
- Permissions are tied to roles but don't provide the flexibility needed in Portal
- Staff changes require manual intervention and create data integrity issues

**Current State**: No team list page, no self-service team management, rigid role-based permissions, manual updates when staff change.

---

## Possible Solution (How)

Introduce team and role management in the Portal:

- **Team Visibility**: Surface team relationships through packages, inboxes, composable workday
- **Team Management UI**: Team list page where team leader/owner can manage membership (add/remove)
- **Role Assignment**: Team leaders can assign roles within teams granting Portal permissions
- **Data Integrity**: Maintain accurate team relationships to support workflows

```
// Before (Current)
1. No team management UI
2. Manual team membership updates
3. Rigid role-based permissions
4. Data integrity issues on staff changes

// After (With RAP)
1. Self-service team management
2. Team leader controls membership
3. Flexible role assignment
4. Accurate team relationships
```

**Key Capabilities:**
- Team list page with membership management
- Role assignment within teams
- Foundation for team-based views (e.g., kanban workflows)

---

## Benefits (Why)

**User/Client Experience:**
- Team leaders can self-service team membership changes
- Clear visibility into team structure and relationships

**Operational Efficiency:**
- Reduction in team management time
- Fewer queries and errors raised about team access
- Improved accuracy of team data

**Business Value:**
- Data integrity — accurate team relationships support workflows
- Foundation — enables new team-based features (kanban, composable workday)
- Scalability — self-service reduces admin burden

---

## Owner & Stakeholders

| Role | Person |
|------|--------|
| **R** | Will Whitelaw (PO), Katja Panova (PO), David Henry (BA), TBA (Des), Tim Maier (Dev) |
| **A** | Will Whitelaw |
| **C** | Will Whitelaw |
| **I** | — |

---

## Assumptions, Dependencies & Risks

**Assumptions:**
- Team management can be built natively in Portal (vs third-party integration)
- Team leaders are appropriate owners for membership management
- Role-based permissions can be extended to support team context

**Dependencies:**
- Existing user and role infrastructure
- Features that depend on team relationships (tasks, packages, bills)

**Risks:**
- Third-party integration complexity (MEDIUM) → Discovery sprint to evaluate build vs buy
- Permission model changes may impact existing workflows (MEDIUM) → Careful migration planning
- Scope creep from related features (LOW) → Clear boundaries in specification

**Open Questions (Discovery):**
- Do we integrate with a third party to manage teams? Pros/Cons to evaluate.

---

## Success Metrics

- Team membership updates self-serviced by team leaders >80%
- Reduction in team-related support queries by 50%
- Zero data integrity issues from staff changes
- Team-based features (tasks, inboxes) using accurate team data

---

## Estimated Effort

**M (Medium) — 4-5 sprints**

- Sprint 1: Discovery — Build vs buy evaluation, permission model design
- Sprint 2: Design — Team management UI, role assignment flows
- Sprint 3-4: Development — Team list page, membership management, role assignment
- Sprint 5: Testing & Rollout

---

## Decision

- [ ] **Approved** — Proceed to specification
- [ ] **Needs More Information**
- [ ] **Declined**

---

## Next Steps (If Approved)

1. Discovery sprint — evaluate third-party integration vs native build
2. `/speckit.specify` — Create detailed technical specification
3. Define permission model extensions for team context
