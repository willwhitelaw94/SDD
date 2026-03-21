---
title: Complaints Management
description: End-to-end complaints handling process with triage, tracking, resolution, and quality assurance
status: in_development
owner: sianh@trilogycare.com.au
teams: [Care, Operations, Compliance, Clinical]
keywords: [complaints, remediation, triage, 28-day resolution, CRM, escalation, POD leaders]
---

# Complaints Management

A comprehensive system for receiving, triaging, tracking, and resolving client complaints within regulatory timeframes while identifying process improvements.

## Overview

### Problem Statement

The current complaints management process faces significant challenges:

- **Volume**: 200-250 complaints and remediations monthly (~10 per day)
- **Resolution delays**: Many complaints remain unresolved past the **28-day target**
- **Manual processes**: Heavy reliance on spreadsheets and manual tracking
- **Unclear ownership**: POD leaders often don't update complaint stages in CRM
- **Communication gaps**: Automated emails turned off, causing inconsistent client updates
- **System limitations**: CRM lacks task notifications and owner assignments at care partner level

### Solution Goals

| Goal | Target |
|------|--------|
| **Resolution timeframe** | 28 days or less |
| **Visibility** | Real-time dashboard for all complaint stages |
| **Automation** | Task notifications and status updates |
| **Quality** | Root cause analysis feeding into training and process improvements |

## Key Components

### 1. Triage System

Complaints are categorized by risk level with corresponding response timeframes:

| Risk Level | Description | Response Timeframe |
|------------|-------------|-------------------|
| **High** | Serious safety/clinical/regulatory concerns | Immediate (within 24 hours) |
| **Medium** | Service quality or significant process issues | Within 5 business days |
| **Standard** | General feedback or minor concerns | Within 10 business days |

### 2. Complaints vs Remediations

| Type | Description | Resolution Time |
|------|-------------|-----------------|
| **Remediation** | Quick, low-level care partner escalations | Same shift to 2 days |
| **Formal Complaint** | Issues requiring formal process | Up to 28 days |

**Escalation triggers:**
- Remediation extends beyond expected timeframe
- Issue cannot be resolved at care partner level
- Client explicitly requests formal complaint

### 3. Workflow Stages

```
Complaint Received (Operations Inbox)
    ↓
Triage by Operations Staff
    ↓
Assigned in CRM to Accountable Person
    ↓
POD Leader Takes Ownership
    ↓
Action Plan Created
    ↓
Investigation/Resolution
    ↓
Client Communication (updates at each stage)
    ↓
Closure with Root Cause Analysis
    ↓
Quality Review and Trend Analysis
```

### 4. Escalation Process

- **Weekly/Bi-weekly escalation meetings** review complaint status
- **Overdue complaints** flagged and actioned
- **Cross-departmental handoffs** coordinated (Care, Accounts, Compliance)
- **Sign-off delays** escalated to appropriate leadership

### 5. Client Communication Standards

| Touchpoint | Timing | Content |
|------------|--------|---------|
| **Acknowledgement** | Within 24 hours | Complaint received, reference number, next steps |
| **Progress Update** | Every 5-7 business days | Current status, expected resolution timeline |
| **Delay Notice** | When 28-day target at risk | Explanation, revised timeline, contact details |
| **Resolution** | At closure | Outcome, actions taken, feedback invitation |

## Technical Implementation

### Current Systems

| System | Role | Limitations |
|--------|------|-------------|
| **CRM (Zoho)** | Complaint records, stages, assignments | No task notifications, poor care partner visibility |
| **Spreadsheet** | Tracking overdue complaints | Manual, prone to errors |
| **Teams** | Cross-team communication | Relies on tagging, creates clutter |
| **Operations Inbox** | Complaint intake | Manual triage required |

### Planned Improvements

1. **Dashboard visibility** for care partners
2. **Automated notifications** on stage changes
3. **Task assignment** at care partner level
4. **Streamlined stages** (reduce granularity)
5. **Action plans** surfaced on dashboards

### Data & Reporting

| Report | Frequency | Purpose |
|--------|-----------|---------|
| **Volume report** | Monthly | Track complaint counts and trends |
| **Resolution compliance** | Monthly | % resolved within 28 days |
| **Trend analysis** | Quarterly | Identify recurring themes |
| **Quality metrics** | Quarterly | Closure quality and root cause patterns |

## Roles & Responsibilities

### POD Leaders

- Primary accountability for complaint resolution
- Create and manage action plans
- Update complaint stages in CRM
- Escalate when needed
- Complete resolution within 28 days

### Care Partners

- Initial point of contact for clients
- Resolve remediations quickly
- Escalate to POD leaders when needed
- Document interactions and outcomes

### Operations Team

- Receive and triage complaints
- Assign to appropriate team members
- Monitor overdue complaints
- Maintain tracking spreadsheet (interim)

### Clinical Team

- Review clinically-related complaints
- Provide clinical input on incident-related issues
- Support root cause analysis

### Compliance Team

- Regulatory guidance
- Audit trail maintenance
- External reporting requirements

## Quality Assurance

### Root Cause Categories

Each complaint closure identifies process gaps:

- **Process failure** - System or procedure didn't work as intended
- **Communication breakdown** - Information not shared appropriately
- **Training gap** - Staff needed additional skills/knowledge
- **System limitation** - Technology couldn't support the need
- **External factor** - Outside of organizational control

### Competency Framework

POD leader competency includes:

- Understanding complaint handling processes
- Cross-departmental knowledge
- Client communication skills
- Documentation and CRM proficiency
- Escalation judgment

Performance development linked to complaint handling effectiveness.

## Key Stakeholders

| Role | Person | Responsibility |
|------|--------|----------------|
| Process Lead | Sian H | Triage process, system enhancements |
| Operational Lead | Patrick H | Current state documentation, future-proofing |
| Data Management | Andy N | Dashboard cleansing, data accuracy |
| Training | Mary Anne H | Team training, remediation processes |

## Metrics & Success Criteria

### Target Outcomes

- **28-day resolution rate**: >90%
- **First response time**: <24 hours
- **Client communication compliance**: 100%
- **Root cause documentation**: 100%
- **Repeat complaint reduction**: Track quarter-over-quarter

### Monitoring

- Weekly escalation meetings
- Monthly volume and trend reports
- Quarterly strategic review
- Annual process audit

## Related Initiatives

- [Task Management](/features/domains/task-management) - Task assignment and tracking
- [Clinical-And-Care-Plan](/initiatives/Clinical-And-Care-Plan/) - Clinical governance

## Source Meetings

| Date | Meeting | Key Topics |
|------|---------|------------|
| Jan 28, 2026 | Complaints Review | Current state, triage system, automation needs, POD leader competencies |

---

## Action Items from Discovery

### Patrick H
- Document current complaints state, barriers, and future-proof solutions
- Develop triage criteria with clear risk descriptions and timelines
- Prepare monthly/quarterly reporting framework
- Formalize POD leader competency framework

### Andy N
- Cleanse complaint dashboard for missing data
- Analyze complaint volumes and triage workload for resourcing
- Support escalation process monitoring

### Mary Anne H
- Plan training session for remediation processes
- Clarify distinctions between remediation and complaints

### Sian H
- Assist with system enhancements for automation
- Improve task notifications and dashboard visibility
