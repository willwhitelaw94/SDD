---
title: "RACI Matrix: ASS1 - Assessment Prescriptions"
---


**Epic**: TP-1904 - Assessment Prescriptions
**Initiative**: TP-1859 - Clinical and Care Plan
**Created**: 2025-11-13
**Last Updated**: 2025-11-13
**Status**: Active

---

## Executive Summary

This RACI matrix defines roles, responsibilities, and decision-making authority for the Assessment Prescriptions epic. The epic delivers a Prescriptions Module to handle practitioner assessments and Tier 5 item classifications for Support at Home (SAH) compliance.

**RACI Legend**:
- **R** (Responsible): Does the work to complete the task
- **A** (Accountable): Ultimately answerable for completion and has decision authority
- **C** (Consulted): Provides input and expertise (two-way communication)
- **I** (Informed): Kept up-to-date on progress (one-way communication)

---

## Core Team

### Product & Requirements

| Name | Role | Responsibilities |
|------|------|------------------|
| **David** | Business Analyst | Requirements gathering, user stories, acceptance criteria, stakeholder coordination, documentation |
| **Romi** | Product Owner / SME | Product decisions, scope prioritization, clinical workflow expertise, go/no-go decisions |

### Design

| Name | Role | Responsibilities |
|------|------|------------------|
| **Beth** | Design Lead | UX/UI design, wireframes, prototypes, user research, design specifications |

### Engineering

| Name | Role | Responsibilities |
|------|------|------------------|
| **Khoa** | Tech Lead | Development coordination, technical delivery, architecture decisions, code quality |
| Development Team | Backend/Frontend | Implementation, testing, code reviews |

### Data & AI

| Name | Role | Responsibilities |
|------|------|------------------|
| **Katja** | Data Team Lead | AI/ML extraction logic, Tier 5 mapping, data architecture, analytics requirements |

### Support Roles

| Name/Group | Role | Responsibilities |
|------------|------|------------------|
| QA Team | Quality Assurance | Test planning, UAT coordination, bug tracking |
| DevOps Team | Infrastructure | Deployment, monitoring, infrastructure |
| Care Partners | End Users | Requirements validation, UAT participation |
| Practitioners (OTs) | External Users | Workflow testing, field validation |

---

## RACI Matrix by Activity

### Phase 1: Discovery & Planning

| Activity | David (BA) | Romi (PO/SME) | Beth (Design) | Khoa (Tech Lead) | Katja (Data) |
|----------|------------|---------------|---------------|------------------|--------------|
| **Idea Brief Development** | R | A | C | C | C |
| **PRD Development** | R | A | C | C | C |
| **User Research & Interviews** | R | A | R | I | I |
| **Requirements Gathering** | R | A | C | C | C |
| **User Stories Creation** | R | A | C | C | C |
| **Acceptance Criteria Definition** | R | A | C | C | C |
| **Requirements Prioritization** | C | A | C | C | C |
| **Success Metrics Definition** | R | A | C | C | C |
| **Risk Assessment** | R | A | C | R | C |
| **Timeline & Roadmap** | C | A | C | R | C |

### Phase 2: Design

| Activity | David (BA) | Romi (PO/SME) | Beth (Design) | Khoa (Tech Lead) | Katja (Data) |
|----------|------------|---------------|---------------|------------------|--------------|
| **Practitioner Workflow Design** | C | C | A | C | C |
| **Care Partner Workflow Design** | C | C | A | C | I |
| **Magic Link UX Design** | C | C | A | C | I |
| **Invoice Gating UI Design** | C | C | A | C | I |
| **Wireframes & Prototypes** | C | C | R/A | C | I |
| **Design Validation & Testing** | C | A | R | I | I |
| **Design Handoff** | I | I | R/A | C | I |

### Phase 3: Technical Architecture

| Activity | David (BA) | Romi (PO/SME) | Beth (Design) | Khoa (Tech Lead) | Katja (Data) |
|----------|------------|---------------|---------------|------------------|--------------|
| **Architecture Design** | C | C | I | R/A | C |
| **Assessment Object Model** | C | C | I | R/A | C |
| **Tier 5 Integration Design** | C | C | I | R/A | R |
| **Magic Link Auth System** | C | C | I | R/A | I |
| **Document Storage Strategy** | C | C | I | R/A | C |
| **AI Extraction Pipeline** | I | C | I | C | R/A |
| **Data Architecture** | I | C | I | C | R/A |
| **Technical Feasibility Review** | C | C | C | R/A | C |

### Phase 4: Development

| Activity | David (BA) | Romi (PO/SME) | Beth (Design) | Khoa (Tech Lead) | Katja (Data) |
|----------|------------|---------------|---------------|------------------|--------------|
| **Backend Development** | C | C | I | R/A | C |
| **Frontend Development** | C | C | C | R/A | I |
| **AI Model Training** | I | C | I | C | R/A |
| **Tier 5 Extraction Logic** | C | C | I | C | R/A |
| **PDF Document Processing** | I | C | I | C | R/A |
| **Data Pipeline Design** | I | C | I | C | R/A |
| **Code Reviews** | I | I | I | R/A | C |
| **Unit Testing** | I | I | I | R | C |

### Phase 5: Testing & Validation

| Activity | David (BA) | Romi (PO/SME) | Beth (Design) | Khoa (Tech Lead) | Katja (Data) |
|----------|------------|---------------|---------------|------------------|--------------|
| **UAT Planning** | R | A | C | C | C |
| **Test Scenario Definition** | R | A | C | C | C |
| **UAT Coordination** | R | A | C | C | I |
| **UAT Execution** | C | A | C | C | C |
| **Bug Tracking & Triage** | R | A | C | R | C |
| **AI Accuracy Testing** | C | C | I | C | R/A |
| **Regression Testing** | C | C | I | R | C |
| **Performance Testing** | C | C | I | R | C |

### Phase 6: Documentation & Training

| Activity | David (BA) | Romi (PO/SME) | Beth (Design) | Khoa (Tech Lead) | Katja (Data) |
|----------|------------|---------------|---------------|------------------|--------------|
| **User Guides (Care Partners)** | R | A | C | I | I |
| **User Guides (Practitioners)** | R | A | C | I | I |
| **API Documentation** | C | I | I | R/A | I |
| **Training Materials** | R | A | C | I | I |
| **Support Procedures** | R | A | C | C | I |
| **Train-the-Trainer Sessions** | R | A | C | I | I |

### Phase 7: Deployment & Go-Live

| Activity | David (BA) | Romi (PO/SME) | Beth (Design) | Khoa (Tech Lead) | Katja (Data) |
|----------|------------|---------------|---------------|------------------|--------------|
| **Deployment Planning** | C | A | I | R | I |
| **Rollout Plan** | R | A | C | R | I |
| **Go/No-Go Decision** | C | A | C | R | C |
| **Production Deployment** | I | I | I | R/A | I |
| **Production Monitoring** | I | I | I | R/A | C |
| **Post-Launch Support** | C | A | I | R | C |

---

## Decision Authority

| Decision Type | Owner (Accountable) | Consulted | Final Authority |
|---------------|---------------------|-----------|-----------------|
| **Go/No-Go (Epic Level)** | Romi (PO) | David (BA), Khoa (Tech Lead), Beth (Design), Katja (Data) | Romi (PO) |
| **Scope Changes** | Romi (PO) | David (BA), Khoa (Tech Lead), Beth (Design) | Romi (PO) |
| **Requirements Prioritization** | Romi (PO) | David (BA), Khoa (Tech Lead), Care Partners | Romi (PO) |
| **Clinical Workflow Decisions** | Romi (PO/SME) | David (BA), Beth (Design), Care Partners | Romi (PO/SME) |
| **Technical Architecture** | Khoa (Tech Lead) | Romi (PO), Katja (Data), Dev Team | Khoa (Tech Lead) |
| **UX/UI Design** | Beth (Design Lead) | Romi (PO), David (BA), Care Partners | Beth (Design) |
| **AI/ML Approach** | Katja (Data Lead) | Khoa (Tech Lead), Romi (PO) | Katja (Data) |
| **Tier 5 Mapping Logic** | Katja (Data Lead) | Romi (PO), Khoa (Tech Lead), Practitioners | Katja (Data) |
| **Deployment Timing** | Romi (PO) | Khoa (Tech Lead), David (BA), QA Team | Romi (PO) |
| **Bug Priority/Triage** | Romi (PO) | David (BA), Khoa (Tech Lead), QA Team | Romi (PO) |

---

## Communication & Escalation

### Regular Updates

**Daily Standups** (Dev Team):
- Attendees: Khoa (Tech Lead), Dev Team, QA
- Duration: 15 minutes
- Focus: Progress, blockers, dependencies

**Sprint Planning** (Bi-Weekly):
- Attendees: Romi (PO), David (BA), Khoa (Tech Lead), Beth (Design), Katja (Data), Dev Team
- Duration: 2 hours
- Focus: Sprint goals, story estimation, capacity planning

**Weekly Status Updates** (Stakeholder Sync):
- Attendees: Romi (PO), David (BA), Khoa (Tech Lead), Beth (Design), Katja (Data)
- Duration: 30 minutes
- Focus: Progress against milestones, risks, decisions needed

**UAT Sessions** (Bi-Weekly during testing phase):
- Attendees: David (BA), Romi (PO), Beth (Design), QA, Care Partners, Practitioners
- Duration: 1 hour
- Focus: Feature demos, feedback collection, issue reporting

**Retrospectives** (End of each sprint):
- Attendees: Full team (Romi, David, Beth, Khoa, Katja, Dev Team, QA)
- Duration: 1 hour
- Focus: What went well, what to improve, action items

### Escalation Path

**Level 1: Developer → Khoa (Tech Lead)**
- Issues: Technical blockers, design questions, API questions
- Response SLA: Same day
- Method: Slack, daily standup

**Level 2: Khoa (Tech Lead) → Romi (PO)**
- Issues: Scope clarification, requirements conflicts, resource needs
- Response SLA: 1 business day
- Method: Slack, scheduled sync

**Level 3: Romi (PO) → Executive Team**
- Issues: Budget, critical scope changes, strategic alignment
- Response SLA: 3 business days
- Method: Email, escalation meeting

---

## Notes & Clarifications

### David (BA) - Project Driver

David is the project's primary driver, responsible for:
- Gathering requirements from all stakeholders
- Creating user stories and acceptance criteria
- Coordinating UAT sessions
- Documenting all workflows and processes
- Ensuring smooth communication across teams

### Romi (PO/SME) - Clinical Workflow Expert

Romi brings deep clinical workflow expertise and is the final decision-maker on:
- Product scope and prioritization
- Clinical workflow requirements
- Care coordination processes
- Practitioner and Care Partner workflows

### Beth (Design) - UX/UI Authority

Beth owns all design decisions including:
- User experience for practitioners and Care Partners
- UI components and design system
- Wireframes, prototypes, and design specifications

### Khoa (Tech Lead) - Technical Delivery

Khoa coordinates all technical delivery including:
- Development team coordination
- Architecture and technical decisions
- Code quality and reviews
- Production deployment

### Katja (Data Lead) - AI & Data Expert

Katja is consulted on all data-related aspects:
- AI/ML extraction logic
- Tier 5 mapping algorithms
- Data pipeline architecture
- Analytics and reporting requirements

### Coordination with ASS2 (TP-2914 - ATHM Inclusions)

**Shared Dependencies**:
- Assessment object model design (must support both ASS1 and ASS2 use cases)
- Tier 5 integration layer (common data layer for both epics)
- Magic link authentication (shared pattern for external stakeholders)

**Joint Planning Required**:
- Combined architecture review sessions with Khoa and Katja
- Shared data model design workshops
- Coordinated release planning

**DRI**: Romi (Product Owner) responsible for coordinating across ASS1 and ASS2

---

**Document Version**: 2.0
**Created**: 2025-11-13
**Last Updated**: 2025-11-13
**Next Review**: Sprint planning kick-off
**Owner**: Romi (Product Owner)
**Approved By**: Pending
