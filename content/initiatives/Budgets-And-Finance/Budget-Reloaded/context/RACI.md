---
title: "RACI Matrix: Budget Reloaded (TP-2501)"
---


**Epic:** TP-2501 BUR | **Initiative:** TP-1869 Budgets and Services | **Created:** 2025-11-06

## Key Stakeholders

| Role | Name | Responsibilities |
|------|------|------------------|
| **Lead Product Owner** | Will | Vision, requirements, go/no-go decisions, scope management |
| **Product Owner** | Romy | Requirements refinement, user story acceptance, backlog management |
| **Engineering Lead** | Tim (Lead Dev) | Technical direction, resource allocation, architecture approval |
| **Backend Lead** | Khoa | Backend architecture, schema design, API implementation |
| **Database Engineer** | David | Schema migration, data integrity, performance optimization |
| **Business Analyst** | Steven | Requirements analysis, stakeholder liaison, documentation |
| **UX/Designer** | Beth | User research, mockups, usability testing, design system |
| **QA Lead** | Meagan | Test strategy, quality gates, regression testing |
| **Finance Consultant** | Fran | Funding stream rules, compliance validation |
| **Care Coordinator Reps** | Bruce, Tim | User validation, feedback, acceptance testing |

---

## Responsibility Matrix

### Strategic Decisions

| Decision | Product Owner | Engineering Lead | Backend Lead | Frontend Lead | UX/Designer | QA Lead | Finance | Care Coord Reps | Database Engineer | Notes |
|----------|--------------|------------------|--------------|---------------|-------------|---------|---------|-----------------|-------------------|-------|
| **Go/No-Go Decision** | A | C | C | C | I | I | C | C | I | Product Owner has final authority with input from all technical leads and finance |
| **Scope Changes** | A | C | C | C | C | I | C | I | I | Product Owner approves all scope changes after consulting engineering and UX |
| **Phased Rollout Strategy** | A | C | I | I | I | C | C | C | I | Product Owner decides rollout phases, consults engineering and QA for feasibility |
| **Success Metrics Definition** | A | C | I | I | C | C | I | C | I | Product Owner defines metrics with input from UX and care coordinators |
| **Budget & Timeline** | A | C | C | C | I | I | I | I | I | Product Owner accountable for budget/timeline with engineering input |

### Technical Architecture

| Decision | Product Owner | Engineering Lead | Backend Lead | Frontend Lead | UX/Designer | QA Lead | Finance | Care Coord Reps | Database Engineer | Notes |
|----------|--------------|------------------|--------------|---------------|-------------|---------|---------|-----------------|-------------------|-------|
| **Database Schema Design** | C | A | R | I | - | C | I | - | R | Backend and DB engineer design, engineering lead approves |
| **Supplier-Booking Relationship Model** | C | A | R | I | - | C | - | - | R | Backend and DB engineer responsible, product consulted on business rules |
| **API Contract Design** | C | A | R | C | - | C | - | - | I | Backend leads with frontend consultation for frontend needs |
| **Frontend Architecture** | I | A | I | R | C | C | - | - | - | Frontend lead designs, engineering lead approves |
| **Rate Card System Enhancement** | C | A | R | I | - | C | I | - | C | Backend responsible, DB engineer consulted for data model |
| **Performance Targets (response time, load time)** | C | A | R | R | I | C | - | - | C | Engineering lead accountable, backend/frontend/DB responsible for meeting targets |

### User Experience & Design

| Decision | Product Owner | Engineering Lead | Backend Lead | Frontend Lead | UX/Designer | QA Lead | Finance | Care Coord Reps | Database Engineer | Notes |
|----------|--------------|------------------|--------------|---------------|-------------|---------|---------|-----------------|-------------------|-------|
| **UI Pattern Decisions** | C | I | - | R | A | I | - | C | - | Designer leads, product approves, care coordinators consulted |
| **Collapsed States Design** | C | I | - | R | A | I | - | C | - | Designer creates mockups, frontend implements, care coordinators validate |
| **Action Tray Layout** | C | I | - | R | A | I | - | C | - | Designer accountable for UX consistency |
| **Modal Workflows** | C | I | I | R | A | I | - | C | - | Designer leads, backend consulted if data implications |
| **Coordination Display Format** | C | I | I | R | A | I | C | C | - | Designer leads with finance and care coordinator input |
| **Human-Readable Funding Context** | C | I | I | R | A | I | C | C | - | Designer creates format, finance validates accuracy |
| **Usability Testing Plan** | C | I | - | I | A | I | - | C | - | Designer accountable for user testing with care coordinators |

### Data & Business Logic

| Decision | Product Owner | Engineering Lead | Backend Lead | Frontend Lead | UX/Designer | QA Lead | Finance | Care Coord Reps | Database Engineer | Notes |
|----------|--------------|------------------|--------------|---------------|-------------|---------|---------|-----------------|-------------------|-------|
| **Funding Stream Defaults Configuration** | A | C | C | I | I | C | C | C | I | Product Owner accountable with finance and care coordinator input |
| **Exception Handling Rules** | A | C | R | I | C | C | C | C | - | Backend implements, product approves, finance validates |
| **Data Analysis (funding patterns)** | C | C | R | - | - | I | C | C | R | Backend and DB engineer analyze data, finance validates patterns |
| **Migration Strategy for Existing Budgets** | C | A | R | I | - | C | I | I | R | Backend and DB engineer plan migration, engineering lead approves |
| **Coordination Loading Display Logic** | C | C | R | C | C | I | C | C | - | Backend implements, frontend displays, finance validates |

### Testing & Quality

| Decision | Product Owner | Engineering Lead | Backend Lead | Frontend Lead | UX/Designer | QA Lead | Finance | Care Coord Reps | Database Engineer | Notes |
|----------|--------------|------------------|--------------|---------------|-------------|---------|---------|-----------------|-------------------|-------|
| **Test Strategy** | C | C | I | I | - | A | I | - | I | QA Lead defines strategy, engineering lead approves |
| **Acceptance Criteria** | A | C | C | C | C | C | I | C | I | Product Owner accountable, all teams consulted |
| **Quality Gates** | C | C | I | I | - | A | I | - | I | QA Lead sets quality standards |
| **Regression Testing Scope** | I | C | I | I | - | A | I | I | - | QA Lead determines scope with engineering input |
| **User Acceptance Testing Plan** | C | C | - | - | C | A | I | C | - | QA Lead plans with designer and care coordinator involvement |

### Implementation Work Streams

| Work Stream | Product Owner | Engineering Lead | Backend Lead | Frontend Lead | UX/Designer | QA Lead | Finance | Care Coord Reps | Database Engineer | Notes |
|-------------|--------------|------------------|--------------|---------------|-------------|---------|---------|-----------------|-------------------|-------|
| **Data Analysis (funding defaults patterns)** | C | C | R | - | - | I | C | C | R | Backend and DB engineer analyze, finance validates |
| **Database Schema Design** | I | A | R | I | - | C | I | - | R | DB engineer and backend lead responsible, engineering approves |
| **Supplier-Booking Schema Implementation** | I | C | R | I | - | C | - | - | R | DB engineer and backend implement |
| **Backend API Development** | I | C | R | I | - | C | - | - | C | Backend lead responsible, DB consulted |
| **Rate Card System Enhancement** | C | C | R | I | - | C | - | - | C | Backend responsible with DB consultation |
| **Frontend UI Redesign** | C | C | I | R | A | C | - | C | - | Frontend implements designer's specs, care coordinators validate |
| **Collapsed States Implementation** | I | C | I | R | C | C | - | I | - | Frontend responsible, designer consulted |
| **Unified Action Tray** | I | C | I | R | C | C | - | I | - | Frontend responsible, designer consulted |
| **Modal Workflows** | I | C | I | R | C | C | - | I | - | Frontend responsible, designer consulted |
| **Funding Defaults Configuration System** | C | C | R | I | I | C | C | I | C | Backend builds config system, finance provides rules |
| **Coordination Display** | C | C | C | R | C | C | C | I | - | Frontend responsible, all consulted on requirements |
| **Notification System Integration** | I | C | R | I | - | C | - | I | - | Backend integrates with existing email system |
| **Unit/Feature Testing** | I | C | R | R | - | A | - | - | I | Backend/frontend write tests, QA Lead validates coverage |
| **User Testing/Validation** | C | C | - | - | A | C | - | R | - | Designer facilitates, care coordinators test and validate |
| **Documentation (technical)** | I | C | R | R | - | I | - | - | C | Backend/frontend document APIs and components |
| **Documentation (user-facing)** | C | I | I | I | C | I | - | R | - | Support/operations create training materials with care coordinator input |
| **Migration Scripts** | I | C | R | I | - | C | - | - | R | Backend and DB engineer write and test migration |
| **Deployment Planning** | C | A | R | R | I | C | - | I | - | Backend/frontend deploy, engineering lead approves |
| **Rollout Coordination** | A | C | I | I | I | C | I | C | I | Product Owner manages rollout communication |

## Decision Authority Summary

| Decision Type | Final Authority | Consulted Before Decision |
|--------------|-----------------|---------------------------|
| **Go/No-Go** | Product Owner | Engineering Lead, Backend Lead, Frontend Lead, QA Lead, Finance, Care Coordinators |
| **Scope Changes** | Product Owner | Engineering Lead, Backend Lead, Frontend Lead, UX/Designer, Finance |
| **Technical Architecture** | Engineering Lead | Backend Lead, Frontend Lead, DB Engineer, QA Lead |
| **UI/UX Patterns** | UX/Designer (approved by Product Owner) | Frontend Lead, Care Coordinators |
| **Funding Rules & Defaults** | Product Owner | Finance, Care Coordinators, Backend Lead |
| **Database Schema** | Engineering Lead | Backend Lead, DB Engineer, QA Lead |
| **Quality Gates** | QA Lead | Engineering Lead |
| **Deployment Timing** | Product Owner | Engineering Lead, QA Lead |

## Risk Ownership

| Risk | Owner | Mitigation Actions | Monitored By |
|------|-------|-------------------|--------------|
| **Complexity Creep (supplier-rate card workflow)** | Engineering Lead | Phased rollout, design reviews with UX | Product Owner |
| **Default Accuracy (funding stream defaults)** | Finance Consultant | Extensive data analysis, validation with care coordinators | Product Owner |
| **Migration Effort (existing budgets)** | Database Engineer | Early migration script testing, rollback plan | Engineering Lead |
| **Stakeholder Alignment (Bruce, Beth, Tim feedback)** | UX/Designer | Regular user testing sessions, feedback loops | Product Owner |
| **Scope Expansion (print options, advanced filtering)** | Product Owner | Strict scope control, defer to future phases | Engineering Lead |
| **Performance Degradation (new queries, N+1 issues)** | Backend Lead | Performance benchmarks, load testing | QA Lead |
| **Timeline Slippage (3-6 month estimate)** | Engineering Lead | Sprint velocity tracking, early risk escalation | Product Owner |
| **User Adoption (resistance to new UI patterns)** | Product Owner | Phased rollout, training materials, support readiness | Support/Operations |

## RACI Definitions

**R** = Responsible | **A** = Accountable | **C** = Consulted | **I** = Informed
