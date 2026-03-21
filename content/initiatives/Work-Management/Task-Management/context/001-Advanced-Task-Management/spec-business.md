---
title: "Business Specification: Advanced Task Management System (TSK)"
---


**Epic Code:** TSK
**Initiative:** Work Management
**Owner:** William Whitelaw
**Date:** 2026-01-03

---

## Executive Summary

The Advanced Task Management System (TSK) replaces the failed v1 task system with an AI-powered, feature-rich platform designed to achieve **60%+ user adoption within 3 months of launch**. Current adoption is near-zero due to missing features and poor UX. TSK addresses this with Kanban/table views, contextual AI recommendations, and multi-module integration.

**Primary Business Outcome:** Increase task adoption & engagement
**Timeline:** March 2026
**Effort:** Large (L)

---

## Business Problem

### Current State
- Task management system v1 launched with near-zero adoption
- Users ignore tasks due to:
  - Lack of rich features (no Kanban, limited filtering, no AI)
  - No contextual visibility (tasks isolated from business objects)
  - Poor UX (clunky front end discourages usage)
  - No coordinator workflow support

### Pain Points
- **Internal users:** Don't know what tasks exist, can't prioritize, no AI guidance
- **Coordinators:** Manual task distribution, no automation, hard to coordinate with internal users
- **Care Partners:** Not aware of task system, no visibility into coordination
- **Organization:** Wasted investment in v1, no ROI on task functionality

### Opportunity
- 60%+ adoption is achievable with proper features (Kanban, AI, clean UX)
- AI recommendations can drive task discovery (contextual throughout app)
- Better coordination between internal users, coordinators, and care partners
- Foundation for future automation (dependencies, escalations, etc.)

---

## Business Objectives

### Primary Objective
**Achieve 60%+ user adoption within 3 months of launch** by delivering a feature-rich, AI-powered task system with intuitive UX.

### Secondary Objectives
- Improve task coordination between internal users and coordinators
- Enable care partners to see relevant tasks and updates
- Establish foundation for AI-driven task automation
- Reduce manual task distribution overhead

### Non-Objectives
- Real-time task notifications (future phase)
- Advanced reporting/analytics (future phase)
- Mobile app (future consideration)
- Third-party integrations (future phase)

---

## Success Metrics & KPIs

| Metric | Baseline | Target | Measurement Method | Timeline |
|--------|----------|--------|-------------------|----------|
| **Task Adoption Rate** | ~0% | 60%+ | % of active users creating/completing tasks weekly | 3 months post-launch |
| **Average Tasks per User** | 0.5 | 5+ | Tasks created/completed per user per week | Monthly |
| **Task Completion Rate** | 20% | 70%+ | % of tasks marked complete within SLA | Monthly |
| **User Engagement** | Low | High | Daily/weekly active task users | Monthly |
| **AI Recommendation Acceptance** | N/A | 40%+ | % of recommended tasks accepted into task system | Post-launch |
| **Coordinator Efficiency** | Manual | Automated | Reduction in manual task distribution (hours/week) | Post-launch |

### Leading Indicators (Early Signals)
- Feature usage: Kanban drag-drop, table filtering, task creation
- AI recommendation clicks/views
- Task capture from recommendations
- User feedback on UX

### Lagging Indicators (Outcome Measures)
- Sustained adoption rate (% active users over time)
- Task completion velocity
- Care partner awareness of task system

---

## Stakeholder Analysis (RACI)

| Stakeholder | Role | Responsible | Accountable | Consulted | Informed |
|---|---|---|---|---|---|
| **William Whitelaw** | Owner/PM | ✓ | ✓ | | |
| **Internal Users** | End Users | | | ✓ | ✓ |
| **Coordinators** | End Users | | | ✓ | ✓ |
| **Care Partners** | End Users/Decision-makers | | | ✓ | ✓ |
| **Engineering Team** | Implementation | ✓ | | ✓ | |
| **Design Team** | UX/UI | ✓ | | ✓ | |
| **Product/Leadership** | Strategic Alignment | | | ✓ | ✓ |

---

## Business Risks & Mitigations

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|-----------|
| **AI Recommendations Inaccurate** | Low adoption if recommendations don't match user needs | Medium | Start with rules-based recommendations, test with coordinators early, iterate based on feedback |
| **Timeline Pressure (March Deadline)** | Scope creep, reduced quality, missed deadline | High | Strict scope control, prioritize core Kanban + table views, defer advanced features |
| **Coordinator Adoption Resistance** | End users reject new system if workflow disrupted | Medium | Involve coordinators in design, map existing workflows to new system, strong training/support |
| **Multi-Module Integration Complexity** | Delays, bugs, inconsistent experiences | Medium | Phased module integration, comprehensive testing per module, clear API contracts |
| **Data Migration** | Lost tasks, corruption, user frustration | Low | Plan migration strategy early, test with sample data, communication plan |

---

## ROI Analysis

### Investment
- **Development effort:** Large (5–7 sprints)
- **Team:** Engineering + Design + PM
- **Timeline:** ~12 weeks (through March 2026)
- **Estimated cost:** [To be determined with engineering]

### Expected Returns
- **Adoption ROI:** If 60%+ adoption achieved, task system becomes core platform for coordination
- **Efficiency Gains:** Reduced manual task distribution (coordinator time savings)
- **Foundation for Automation:** AI task generation = future automation of routine work
- **User Retention:** Better task visibility = improved user engagement in platform

### Payback Period
- **Quick wins:** Within 3 months of launch (adoption metrics show success)
- **Long-term value:** Compound efficiency gains from automation, reduced coordinator workload

---

## Market & Customer Context

### Target Users
- **Internal Users:** Staff who manage care/coordination workflows
- **Coordinators:** Care coordinators managing patient workflows
- **Care Partners:** External stakeholders needing task visibility

### Competitive Landscape
- Existing systems: Asana, Monday.com, Trello (feature reference)
- Internal v1: Failed due to missing features, poor UX
- **Our advantage:** Contextual to TC Portal modules, AI-powered recommendations, tight integration

### Timing Considerations
- March 2026 deadline is achievable but tight
- Q1 2026 is good time to launch (post-holiday, fresh start)
- Early coordinator feedback during beta critical to adoption

---

## Business Clarifications Session Log

**Date:** 2026-01-03
**Facilitator:** Claude
**Participant:** William Whitelaw (Owner)

### Questions Asked & Decisions

1. **Primary Business Outcome?**
   - Decision: Increase task adoption & engagement
   - Rationale: v1 failure was feature/UX gap, not concept

2. **Success Metrics?**
   - Decision: Task adoption rate & engagement
   - Metrics: % users, tasks/user/week, completion rate

3. **Baseline & Target?**
   - Decision: Near-zero → 60%+ within 3 months
   - Rationale: Realistic jump with strong features

4. **Key Stakeholders?**
   - Decision: William (owner) + Coordinators + Internal users + Care Partners
   - Roles: End users, decision-makers, informed parties

5. **Business Risks?**
   - Decision: Timeline pressure + AI recommendation accuracy
   - Mitigation: Rules-based AI initially, scope control for March deadline

---

## Approval

| Role | Name | Status | Date |
|------|------|--------|------|
| Owner | William Whitelaw | ⏳ Pending | |
| Stakeholders | TBD | ⏳ Pending | |

---

## Next Steps

1. ✅ Business clarification complete
2. → Flow diagrams (`/trilogy.flow-diagram`) — Visualize user journeys
3. → Functional spec (`/speckit.specify`) — Detailed requirements
4. → Implementation plan (`/speckit.plan`) — Execution strategy
