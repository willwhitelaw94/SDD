---
title: "Task Engine Master Epic"
---


**Epic Code:** TSK
**Initiative:** Work Management
**Owner:** William Whitelaw
**Status:** Master Epic (Umbrella)
**Created:** 2026-01-03

---

## Vision

Build a comprehensive, enterprise-grade task management engine for TC Portal that serves care coordination, compliance, finance, and supplier management from a unified system. The task engine will be the operational backbone of the portal, enabling intelligent workflow automation, team collaboration, and accountability tracking.

---

## Problem Statement

The current task system has near-zero adoption due to:
- Limited functionality (no grouping, filtering, inline editing)
- No relationship to other portal objects
- No workflow automation or dependencies
- No collaboration features (comments, @mentions)
- No accountability (SLAs, escalation)
- Clunky UX that discourages use

**User Pain Points:**
- Staff don't know what tasks to prioritize
- Tasks are disconnected from the records they relate to
- No way to track task dependencies or blocked work
- No visibility into team workload or progress
- No audit trail for compliance

---

## Solution Overview

A **polymorphic, workflow-enabled task engine** with:

### 1. Core Task Functionality
- **Polymorphic tasks** — Link tasks to all primary portal objects (clients, suppliers, invoices, care plans, service bookings, etc.)
- **Related tasks inline** — View tasks on any record via "View Related Tasks" button
- **Recurring tasks** — Schedule tasks on defined intervals
- **Task templates** — Pre-built templates with points values for consistency

### 2. Task Relationships & Dependencies
- **Task dependencies** — Tasks can require another task to complete first
- **Blocked status** — Mark tasks blocked with external reasons (distinct from dependencies)
- **Related tasks** — Link connected but non-dependent tasks

### 3. Collaboration & Communication
- **Comments with @mentions** — Threaded discussions, tag individuals or teams
- **Rich text editor integration** — Create tasks from any Tiptap editor field
- **Email from task** — Send emails directly from tasks, log correspondence
- **Share with stakeholders** — Configurable visibility for family/nominees

### 4. Workflow & Automation
- **SLAs** — Response/completion time expectations by task type with visual indicators
- **Escalation rules** — Automatic escalation when SLAs breached
- **AI-generated tasks** — Intelligent suggestions from module context
- **Natural language creation** — Plain language input → structured task

### 5. Views & Organisation
- **Groupable list views** — Group by any field (status, assignee, priority, etc.)
- **Nested grouping** — Group by X, then by Y within each group
- **Group summaries** — Header counts and stats per group
- **Drag between groups** — Move tasks to update status/field
- **Saved views** — Persist group-by, filters, sort configurations

### 6. Data Integrity & Compliance
- **Activity log** — Full audit trail of all changes
- **Mandatory fields** — Required fields by task type before completion
- **Document attachments** — Attach files, enforce requirements by type

### 7. Gamification
- **Points system** — Tasks earn points on completion (template-defined)

### 8. Productivity
- **Keyboard shortcuts** — Power-user navigation and actions
- **Export** — Flexible export for reporting and compliance

### 9. Future Considerations
- **Time tracking** — Optional timer for effort understanding

---

## Epic Structure

This master epic contains the following sub-epics:

| Epic | Code | Focus | Priority |
|------|------|-------|----------|
| **Task Frontend Evolution** | TFE | UI/UX: Grouping, inline edit, views, keyboard | P1 |
| **Task Polymorphic Relations** | TPR | Link tasks to all portal objects | P1 |
| **Task Dependencies & Blocking** | TDB | Dependencies, blocked status, workflow | P1 |
| **Task Collaboration** | TCO | Comments, @mentions, email, sharing | P2 |
| **Task Automation** | TAU | SLAs, escalation, AI tasks, NLP creation | P2 |
| **Task Templates & Points** | TTP | Templates, recurring, gamification | P2 |
| **Task Audit & Compliance** | TAC | Activity log, mandatory fields, attachments | P2 |
| **Task Time Tracking** | TTT | Timer, effort tracking (future) | P3 |

---

## Sub-Epic Details

### TFE - Task Frontend Evolution (P1)
**Status:** In Progress | [View Epic](../002-TFE-Task-Frontend-Evolution/)

Modern task management UI inspired by Asana, Linear, Notion:
- TaskTable component with inline editing
- Group by any field with collapsible sections
- View modes: Table, Kanban, List
- Saved views extending current filter system
- Keyboard shortcuts (C, E, A, P, D, 1-5, Cmd+K)
- Bulk operations (multi-select, bulk update)

---

### TPR - Task Polymorphic Relations (P1)
**Status:** Planned

Connect tasks to all portal entities:

**Polymorphic Relationships:**
- Clients (recipients)
- Suppliers
- Invoices / Bills
- Care Plans
- Service Bookings
- Packages
- Staff / Coordinators
- Organisations
- Risk Assessments
- Documents

**Features:**
- `taskable_type` and `taskable_id` columns
- "Related Tasks" panel on each entity detail view
- "View All Tasks" button → filtered task list
- Auto-suggest entity when creating task from context
- Bulk assign tasks to entity

---

### TDB - Task Dependencies & Blocking (P1)
**Status:** Planned

Workflow sequencing and external blockers:

**Dependencies:**
- Task A depends on Task B → can't start until B complete
- Visual dependency indicator (chain icon)
- Dependency graph view (future)
- Circular dependency prevention

**Blocked Status:**
- Distinct from dependencies (external factors)
- Blocked reason field (free text)
- Blocked indicator on task card/row
- Blocked tasks report

---

### TCO - Task Collaboration (P2)
**Status:** Planned

Team communication within tasks:

**Comments:**
- Threaded comments on each task
- @mention individuals and teams
- Rich text formatting (bold, lists, links)
- Comment notifications

**Email Integration:**
- Send email from task context
- Email logged as comment/activity
- Reply-to-task threading (future)

**Stakeholder Sharing:**
- Share task visibility with:
  - Family members
  - Nominees
  - External parties
- Configurable per-task or per-template

---

### TAU - Task Automation (P2)
**Status:** Planned

Intelligent workflow automation:

**SLAs:**
- Define expected response time by task type
- Define expected completion time
- Visual indicators: On track / At risk / Overdue
- SLA dashboard/report

**Escalation Rules:**
- Auto-escalate when SLA breached
- Escalation chain (assignee → supervisor → manager)
- Notification triggers

**AI-Generated Tasks:**
- Context-aware suggestions per module
- "Suggested Tasks" panel
- One-click task creation from suggestion
- Learning from acceptance patterns (future)

**Natural Language Creation:**
- "Call John tomorrow about invoice" → structured task
- Parse: title, due date, related entity, assignee
- Confirmation before save

---

### TTP - Task Templates & Points (P2)
**Status:** Planned

Standardization and gamification:

**Templates:**
- Pre-defined task configurations
- Template fields: title pattern, default priority, checklist, points
- Template linked to task type/category
- Clone template → new task

**Recurring Tasks:**
- Schedule: daily, weekly, monthly, custom
- Generate next occurrence on completion
- Skip/pause recurrence
- Recurrence end date

**Points System:**
- Points defined at template level
- Based on complexity/effort
- Points visible on task
- User point leaderboard (optional)
- Points report/dashboard

---

### TAC - Task Audit & Compliance (P2)
**Status:** Planned

Data integrity and compliance:

**Activity Log:**
- Full audit trail per task
- Who, what, when for every change
- Comment additions, status changes, field edits
- Immutable log (append-only)

**Mandatory Fields:**
- Configure required fields by task type
- Block completion until satisfied
- Visual indicator of missing fields

**Document Attachments:**
- Attach files to tasks
- Required attachments by task type
- Link to document management system

---

### TTT - Task Time Tracking (P3)
**Status:** Future

Effort and time tracking:

**Timer:**
- Start/stop timer on task
- Multiple time entries per task
- Manual time entry

**Reporting:**
- Time by task type
- Time by user
- Time by client/entity
- Billable vs non-billable (future)

---

## Success Metrics

| Metric | Target | Measured By |
|--------|--------|-------------|
| User adoption | 60%+ of active users weekly | Task creation/update events |
| Tasks per user | 5+ tasks/user/week | Weekly average |
| Completion rate | 70%+ | Completed / Created |
| AI suggestion acceptance | 40%+ | Accepted / Shown |
| SLA compliance | 85%+ on-time | Completed within SLA |
| Entity coverage | 90%+ tasks linked to entity | Tasks with taskable_id |

---

## Timeline & Phases

### Phase 1: Foundation (Q1 2026)
- TFE: Task Frontend Evolution ← **IN PROGRESS**
- TPR: Polymorphic Relations
- Basic filtering, grouping, inline editing

### Phase 2: Workflow (Q2 2026)
- TDB: Dependencies & Blocking
- TCO: Collaboration (Comments, @mentions)
- TAC: Audit Log

### Phase 3: Intelligence (Q3 2026)
- TAU: SLAs, Escalation
- TAU: AI Suggestions
- TTP: Templates & Points

### Phase 4: Optimization (Q4 2026)
- TAU: Natural Language Creation
- TTT: Time Tracking
- Advanced analytics & dashboards

---

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Scope creep | Timeline slip | Strict phase boundaries, defer to next phase |
| Polymorphic complexity | Performance issues | Efficient indexing, eager loading |
| User adoption | Investment wasted | Early user testing, iterate on feedback |
| AI accuracy | Low trust | Start rules-based, add ML gradually |
| Migration complexity | Data loss | Incremental migration, maintain backward compat |

---

## Owner & Stakeholders

| Role | Stakeholder | Responsibility |
|------|-------------|----------------|
| Owner | William Whitelaw | Vision, prioritization, delivery |
| End Users | Coordinators, Staff, Care Partners | Feedback, validation, adoption |
| Engineering | Dev Team | Implementation, technical decisions |
| Design | UX Team | Interface design, usability testing |

---

## Next Steps

1. ✅ Complete TFE (Task Frontend Evolution) - IN PROGRESS
2. → Create TPR epic for Polymorphic Relations
3. → Create TDB epic for Dependencies & Blocking
4. → Prioritize Phase 2 epics based on user feedback
