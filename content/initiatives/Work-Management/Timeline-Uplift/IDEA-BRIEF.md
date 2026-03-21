---
title: "Timeline Uplift: Idea Brief"
description: "Work Management > Timeline Uplift"
icon: i-heroicons-light-bulb
navigation:
  order: 1
---

**Epic Code**: TLU (TP-2507)
**Created**: 2026-01-14
**Updated**: 2026-02-07

## Problem Statement (What)

**Staff lack visibility into total communications across clients/suppliers**, making it difficult to understand inbound enquiry context, handle calls efficiently, and disseminate training materials.

### Current State

- Multiple teams contact suppliers, clients, driving inbound traffic
- No centralized view of total communications being sent
- Training materials and scripts scattered, hard to access during calls
- Staff cannot quickly see communication history when handling inbound enquiries
- No visual timeline linking comms to materials and briefing documents
- Activity data fragmented across 3 systems (Spatie Activity, Event Sourcing, Notes)

### Impact

| Problem | Business Impact |
|---------|-----------------|
| Scattered communications | Poor first touch resolution, longer handle times |
| No comms visibility | Staff unaware of recent outreach before receiving callbacks |
| Training materials disconnected | Inconsistent responses, repeated escalations |
| Manual context gathering | Time wasted searching for relevant communications |
| Fragmented activity data | Cannot build unified timeline view |

### Luke's Vision (Original Quote - Feb 2026)

> "Would be great to create something that creates a visual timeline so staff can see all comms across clients/suppliers with links to the materials and any briefing documents. That will help the teams deal better with answering and resolving calls quickly and disseminating training, education and scripting training across the org."
>
> **Goal**: Improve handle time and first touch resolution

## Possible Solution (How)

### Communications Canvas / Timeline Uplift

A unified visual timeline providing staff with complete communication and activity context:

1. **Unified Activity Timeline** - All events (calls, emails, SMS, notes, changes) in chronological order
2. **Material Links** - Quick access to training materials, scripts, briefing docs
3. **Cross-Entity View** - See activities for a client OR supplier in one place
4. **Quick Context** - "What's happened with this person recently?" at a glance
5. **Training Integration** - Link communications to relevant training/education content

### Key Features

| Feature | Description |
|---------|-------------|
| **Unified Timeline** | All activity types in chronological order |
| **Material Attachments** | Link each comms campaign to relevant scripts/training |
| **Search & Filter** | Find activities by type, date, sender, subject |
| **Context Preview** | See email/SMS content without leaving the timeline |
| **Training Directory** | Organized access to scripts and briefing documents |

### Integration Points

- **Calls System** (Aircall) - Call logs and recordings
- **Email System** - Sent emails with templates used
- **Notes System** - Internal notes tagged as communications
- **Documents System** - Training materials, scripts, briefings
- **Notifications System** - System-generated communications
- **Spatie Activity Log** - Model change events
- **Event Sourcing** - Domain events (contacts, fees, budgets)

## Benefits (Why)

| Benefit | Metric/Outcome |
|---------|----------------|
| **Faster call handling** | Reduce average handle time with instant context |
| **Better first touch** | Resolve enquiries without callbacks/transfers |
| **Consistent messaging** | Staff follow same scripts and training |
| **Reduced training burden** | Self-service access to materials during calls |
| **Improved onboarding** | New staff can learn from communication history |
| **Complete audit trail** | Full visibility into what was sent and when |

## Owner (Who)

**Stakeholder**: Luke Traini (CEO)
**Product Owner**: TBD
**Pod**: TBD

## Other Stakeholders (Accountable / Consulted / Informed)

| Role | Person | RACI |
|------|--------|------|
| CEO | Luke Traini | Accountable |
| Product | TBD | Responsible |
| Engineering | TBD | Responsible |
| Care Partners | End users | Consulted |
| Care Coordinators | End users | Informed |

## Related Work

### Calls Uplift (In Progress)

The [Calls Uplift](/initiatives/Work-Management/Calls-Uplift/) initiative addresses call-specific tracking:
- Call bridge UI for package context during calls
- Call transcriptions and AI summaries
- Calls Inbox for post-call review
- Links calls to packages and activities

### Linear Issues (Related)

| Issue | Description | Status |
|-------|-------------|--------|
| [DUC-5](https://linear.app/trilogycare/issue/DUC-5) | Timelines & Activity Log Infrastructure | Backlog |
| [TRI-62](https://linear.app/trilogycare/issue/TRI-62) | Show email history/audit log on bills UI | Backlog |
| [PLA-1254](https://linear.app/trilogycare/issue/PLA-1254) | Calls Uplift Phase 1 - Infrastructure | Backlog |
| [PLA-1255](https://linear.app/trilogycare/issue/PLA-1255) | Calls Uplift Phase 2 - Core UI | Backlog |

### Domain Documentation

| Domain | Relevance |
|--------|-----------|
| [Activity Log](/context/domains/activity-log) | Unified activity tracking infrastructure |
| [Telephony/Calls](/context/domains/calls) | Call tracking, recordings, Aircall integration |
| [Emails](/context/domains/emails) | Email notifications and templates |
| [Notes](/context/domains/notes) | Internal communication logging |
| [Notifications](/context/domains/notifications) | System-generated communications |

## Technical Foundation

### Current State (Fragmented)

The codebase has **three separate mechanisms** for activity tracking:

| Mechanism | Location | Used For |
|-----------|----------|----------|
| **Spatie Activity Log** | `spatie/laravel-activitylog` | Model changes on selected models |
| **Event Sourcing** | `domain/*/EventSourcing/` | PackageContact, Fee, Budget events |
| **Notes** | `domain/Note/` | Manual communication logging |

### Existing Patterns (Ready to Extend)

1. **Event Sourcing** - PackageContact events track all contact interactions
2. **Notes System** - 50+ note categories, polymorphic, audit trail
3. **Activity Logging** - Spatie Activity Log on key models
4. **Timeline UI** - SupplierTimeline.vue pattern for visual display

### Recommended Approach

**Phase 1**: Unify activity infrastructure (DUC-5)
- Create unified activity table/queries
- Capture email send events
- Efficient context-specific retrieval

**Phase 2**: Build timeline UI components
- Reusable timeline component
- Type badges, filtering, search
- Material linking

**Phase 3**: Full Communications Canvas
- Integrate all data sources
- Training materials directory
- Mobile access

## Industry Best Practices

Research into aged care communication software reveals key patterns:

| Best Practice | Application |
|---------------|-------------|
| **Unified Timeline** | Single view of all client/supplier interactions |
| **Mobile Access** | Field staff access from point-of-care |
| **Family Portals** | Stakeholder visibility (future) |
| **Knowledge Integration** | Link comms to FAQs, scripts, training |
| **FCR Metrics** | Track first touch resolution rates |

### Industry Benchmark

- **First Touch Resolution target**: 70-79%
- Key enablers: Knowledge base access, CRM integration, unified view

## Assumptions & Dependencies, Risks

### Assumptions

- Staff will use the timeline if it saves time
- Training materials can be organized and linked
- Existing communication data is accessible (calls, emails)
- Timeline view is the right UX metaphor

### Dependencies

- **DUC-5** - Activity Log Infrastructure (foundation)
- **Calls Uplift** - Call data and transcriptions
- **Documents System** - Training material organization

### Risks

| Risk | Mitigation |
|------|------------|
| Data scattered across systems | Start with Package-centric view |
| Training materials unorganized | Create tagging/categorization first |
| Adoption resistance | Embed in existing workflows |
| Performance with large histories | Paginate, filter, lazy load |

## Estimated Effort

| Component | Estimate |
|-----------|----------|
| Activity Log Infrastructure (DUC-5) | Medium |
| Timeline UI Component | Medium |
| Material Linking | Small |
| Training Directory | Small |
| Integration with Calls/Emails | Medium |

**Total:** Medium-Large

## Proceed to PRD?

Research complete. Recommend phased approach:

1. **Phase 1**: Complete DUC-5 (Activity Log Infrastructure)
2. **Phase 2**: Build reusable Timeline UI component
3. **Phase 3**: Full Communications Canvas with training materials

---

## Research Sources

- Luke Traini Teams Chat (2026-02-07)
- BRP January 2026 Strategic Planning
- Linear Issues Search (15+ issues)
- Codebase Analysis (domain/, app/, resources/)
- Industry Best Practices Research (20+ sources)

See: [Full Research Document](./research.md)
