---
title: "Task Management"
description: "Enterprise task engine for care coordination, compliance, finance, and supplier management workflows"
---


> Enterprise-grade task engine for care coordination, compliance, finance, and supplier management

---

## Overview

The Task Management domain (internally called "Composable Workday") organizes work items for staff into prioritized queues. It helps care teams manage their daily activities, follow-ups, and deadlines.

**Vision**: Build a comprehensive, enterprise-grade task management engine for TC Portal that serves care coordination, compliance, finance, and supplier management from a unified system. The task engine will be the operational backbone of the portal, enabling intelligent workflow automation, team collaboration, and accountability tracking.

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

---

## Key Concepts

| Concept | Description |
|---------|-------------|
| **Task** | A work item requiring action, linked to portal objects |
| **Task Type** | Category of work (Follow-up, Review, Approval, etc.) |
| **Task Queue** | Prioritized list of tasks for a user/team |
| **Task Template** | Pre-defined task configuration with points |
| **Subtask** | Child task linked to a parent task |
| **Due Date** | Deadline for task completion |
| **Assignment** | User or team responsible |
| **SLA** | Service level agreement for response/completion time |

---

## Task Types (Existing Templates)

Current templates in the system (from `TaskTemplateSeeder`):

**Onboarding**
- Initial Assessment, Welcome Call, Documentation Review, Care Plan Setup

**Client Management**
- Regular Check-in, Service Review, Care Plan Review, Family Meeting

**Compliance**
- Incident Report, Quality Audit, Risk Assessment Review, Compliance Check

**Operations**
- Supplier Follow-up, Invoice Processing, Service Coordination, Equipment Check

**Support**
- Client Complaint, Service Request, Feedback Follow-up, Emergency Response

---

## Sub-Epic Structure

The task management system is organized into sub-epics:

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

## Frontend Evolution (TFE)

Modern task management UI inspired by Asana, Linear, Notion:

### Core Features
- **Group By** — Collapsible task groups with counts (stage, priority, assignee, due date, tags)
- **Saved Views** — Save and switch between filter/sort/group configurations
- **Inline Editing** — Edit any field without opening task dialog
- **Bulk Operations** — Multi-select with keyboard (Shift+Click, Cmd+Click)
- **Command Palette** — Cmd+K for quick actions
- **Keyboard Navigation** — Full keyboard-first workflow

### View Modes
- **Table view** — With grouping and inline editing
- **Kanban board** — Drag-drop between status columns
- **List view** — Simplified, mobile-first

### Keyboard Shortcuts (Linear-inspired)
| Shortcut | Action |
|----------|--------|
| `Cmd/Ctrl+K` | Command palette |
| `C` | Create new task |
| `E` | Edit selected task |
| `/` | Focus filter/search |
| `1-9` | Move task to status column |
| `A` | Assign task |
| `D` | Set due date |
| `?` | Show shortcuts help |

---

## Polymorphic Relations (TPR)

Connect tasks to all portal entities:

**Supported Relationships:**
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

## User Personas

| Persona | Usage |
|---------|-------|
| **Care Coordinators** | Daily task execution, client tasks |
| **Care Partners** | Task oversight, approval, visibility |
| **Team Leaders** | Workload distribution, team views |
| **Internal Users** | Cross-module task management |
| **Finance Team** | Invoice/bill related tasks |

---

## Success Metrics

| Metric | Target | Measured By |
|--------|--------|-------------|
| User adoption | 60%+ of active users weekly | Task creation/update events |
| Tasks per user | 5+ tasks/user/week | Weekly average |
| Completion rate | 70%+ | Completed / Created |
| AI suggestion acceptance | 40%+ | Accepted / Shown (Phase 2) |
| SLA compliance | 85%+ on-time | Completed within SLA |
| Entity coverage | 90%+ tasks linked to entity | Tasks with taskable_id |

---

## Open Questions

| Question | Context |
|----------|---------|
| **Why doesn't TaskTemplate model exist?** | Docs describe 20 templates across 5 categories but no model or seeder exists |
| **Where is the points system?** | Gamification with template-defined points documented but not implemented |
| **Why is Kanban view not implemented?** | Docs show TaskKanban.vue but no Kanban view in codebase |
| **What happened to saved views?** | useSavedViews.ts documented but doesn't exist |
| **Are SLAs and escalation planned for Phase 2?** | Feature documented but no implementation started |
| **Why do stage enum methods reference undefined stages?** | `isInReview()` and `isArchived()` reference stages that don't exist in enum |

---

## Technical Components

**Note**: Documentation describes aspirational "enterprise-grade" system. Actual implementation is MVP/foundation.

### What Actually Exists

```
domain/Task/Models/                   # NOT app/Domain/Task/ as documented
├── Task.php                          # Core task model
├── TaskComment.php                   # Basic comments
├── TaskTag.php                       # Simple tags (Follow Up, New Consumer)
└── TaskAssignable.php                # Polymorphic assignments

domain/Task/Actions/
├── CreateTaskAction.php
├── UpdateTaskAction.php
├── CompleteTaskAction.php
├── DuplicateTaskAction.php          # Handles recurring task creation
└── DeleteTaskAction.php

domain/Task/Enums/
├── TaskPriorityEnum.php             # LOW, MEDIUM, HIGH
└── TaskStageEnum.php                # NOT_STARTED, IN_PROGRESS, APPROVED, ON_HOLD, COMPLETED
```

### What Does NOT Exist (Despite Documentation)

```
❌ TaskTemplate.php                   # Templates not implemented
❌ TaskTemplateSeeder.php             # Only TaskTagsSeeder exists (2 tags)
❌ Points system                      # No gamification
❌ SLA/escalation                     # No time-based rules
❌ Task dependencies                  # Only parent_id for subtasks
❌ @mentions in comments              # Basic text only
```

### Frontend (Actual)

```
resources/js/Pages/Tasks/
└── Index.vue                        # 920 lines, table view only

resources/js/Components/Task/
├── TaskButton.vue
├── TaskForm.vue                     # 1054 lines
├── TaskSidebarComponent.vue
└── CarePartner/ActivityTask.vue
```

**Missing Components:**
- ❌ TaskTable.vue (logic embedded in Index.vue)
- ❌ TaskKanban.vue (no Kanban view)
- ❌ TaskDialog.vue
- ❌ useSavedViews.ts composable

---

## Roadmap

### Phase 1: Foundation (Q1 2026) - IN PROGRESS
- TFE: Task Frontend Evolution
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

## Related Features

- [Coordinator Portal](/features/domains/coordinator-portal) dashboard
- [Notes](/features/domains/notes) (linked to task completion)
- Check-ins
- [Bill Processing](/features/domains/bill-processing) (task triggers)

---

## Epic Documentation

For detailed specifications and implementation plans, see the initiative folder:
`content/initiatives/TP-2141-Work-Management/TP-2143-TSK-Task-Management/`

---

## Status

**Maturity**: In Development (Phase 1)
**Initiative**: Work Management (TP-2141)
**Epic**: TP-2143-TSK
**Squad**: Duck, Duck Go (Care Coordination)
**Owner**: William Whitelaw
