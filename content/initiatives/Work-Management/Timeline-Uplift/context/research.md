---
title: "Communications Canvas Research"
description: "Comprehensive research from Fireflies, Linear, codebase, and industry sources"
created: 2026-02-07
topic: "Communications Canvas / Visual Timeline / Training Materials"
sources_searched:
  fireflies: BRP January 2026, strategy documents
  linear: 15+ issues related to communications, timelines, calls
  web: 20+ industry sources on aged care communication software
  codebase: Contact management, notes, activity logging, timeline components
---

# Communications Canvas Research Document

## Executive Summary

Luke Traini proposed a **Communications Canvas** - a visual timeline showing all communications across clients/suppliers with links to training materials and briefing documents. The goal is to **improve handle time and first touch resolution**.

Research across Fireflies, Linear, codebase, and industry sources reveals:

1. **Significant existing infrastructure** - Notes system, Event Sourcing, Activity Logging, Timeline UI components
2. **Related work in progress** - Calls Uplift addresses call tracking; DUC-5 addresses activity infrastructure
3. **Industry best practices** align with Luke's vision - unified timelines, knowledge integration, mobile access
4. **Recommended approach**: Build on Note system, extend with Communications-specific features

---

## Source Findings

### From Strategic Planning (BRP/Fireflies Context)

| Meeting/Source | Key Points |
|----------------|------------|
| BRP January 2026 | Contact Data Quality identified as prerequisite for all comms |
| BRP January 2026 | Calls Uplift in development for call tracking |
| BRP January 2026 | 66% of calls untagged - revenue loss from unattributed time |
| Strategy Docs | Work Management integration planned across features |

**Decisions from Strategy:**
- Call bridge UI development approved
- Graph integration for phone matching planned
- Activity capture integrated with care management module

### From Linear Issues

**Directly Related Issues:**

| Issue | Summary | Status | Relevance |
|-------|---------|--------|-----------|
| [DUC-5](https://linear.app/trilogycare/issue/DUC-5) | Timelines & Activity Log Infrastructure | Backlog | Foundation for unified timeline |
| [TRI-62](https://linear.app/trilogycare/issue/TRI-62) | Show email history/audit log on bills UI | Backlog | Email visibility on entity pages |
| [TRI-38](https://linear.app/trilogycare/issue/TRI-38) | Click-to-call/email in Care Circle | Backlog | Communication quick actions |
| [PLA-1254](https://linear.app/trilogycare/issue/PLA-1254) | Calls Uplift Phase 1 - Infrastructure | Backlog | Call transcription capture |
| [PLA-1255](https://linear.app/trilogycare/issue/PLA-1255) | Calls Uplift Phase 2 - Core UI | Backlog | Calls Inbox and review panel |
| [PLA-177](https://linear.app/trilogycare/issue/PLA-177) | Improve Audit Log for Packages | Reviewing | Track all changes and comms |

**Key Insight from TRI-62:**
> "Care partners need visibility into what communications have gone out about each bill."
> - Timestamp of when email was sent
> - Who it was sent to
> - What exactly the email said

### From Codebase

**Existing Infrastructure (Ready to Extend):**

| Component | Location | Capability |
|-----------|----------|------------|
| **PackageRepresentative** | `app/Models/AdminModels/` | Contact model with full attributes |
| **Event Sourcing** | `domain/PackageContact/EventSourcing/` | 8 contact event types tracked |
| **Notes System** | `domain/Note/` | 50+ categories, polymorphic, auditable |
| **Activity Logging** | `LogsActivity` trait | Spatie activity log on key models |
| **Timeline UI** | `SupplierTimeline.vue` | Table-based timeline display pattern |
| **Contact Info UI** | `PackageContactInformation.vue` | Contact preferences display |

**Key Patterns Found:**

1. **Polymorphic Relationships** - Notes attach to Package, Bill, Supplier, Contact
2. **NoteCategoryEnum** - 50+ categories including `CRISIS_CONTACT`, `FINANCIAL_ENQUIRY`, `PROVIDER_COORDINATION`
3. **Spatie Activity Log** - Tracks model changes with before/after properties
4. **Event Sourcing** - Immutable event store for contact lifecycle

**Recommendation:** Build on **Note system** rather than Event Sourcing:
- Already proven in production
- UI components built and tested
- Can add `COMMUNICATION` categories
- Activity logging provides audit trail

### From Industry Research

**Key Industry Platforms:**

| Platform | Features Relevant to TC |
|----------|-------------------------|
| **Alora Health** | Communication logs at client/staff levels |
| **Axxess** | Real-time mobile communication, point-of-care |
| **TigerConnect** | Secure updates, files, group video |
| **ShiftCare** | Instant messaging, desktop/mobile sync |
| **athenahealth** | Unified care coordination with full history |

**Best Practices for Communications Canvas:**

1. **Unified Timeline** - Single view of all interaction types (calls, emails, SMS, notes)
2. **Context-Rich Display** - Show client background, care plan, recent interactions
3. **Mobile-First Design** - Field staff access from point-of-care
4. **Automated Workflows** - Route communications, track follow-ups
5. **Knowledge Integration** - Link to FAQs, scripts, training materials
6. **Compliance & Audit** - Full audit trails for regulatory purposes
7. **Analytics** - Track FCR rates, handle time, communication efficiency

**Industry Benchmark (First Touch Resolution):**
- Target: 70-79% FCR rate
- Key enablers: Knowledge base access, CRM integration, skills-based routing

---

## Synthesis

### Consolidated Requirements

1. **Visual Timeline** - Chronological view of all communications
   - Source: Luke Teams chat, Industry research
   - Related: DUC-5, SupplierTimeline.vue pattern

2. **Material Links** - Training materials, scripts, briefing docs attached to comms
   - Source: Luke Teams chat
   - Related: Documents system, Notes attachments

3. **Cross-Entity View** - See comms for client OR supplier in one place
   - Source: Luke Teams chat
   - Related: Polymorphic notes pattern, Activity logging

4. **Quick Context** - Recent comms at a glance during inbound calls
   - Source: Luke Teams chat ("improve handle time")
   - Related: Calls Uplift call bridge UI

5. **Audit Trail** - Full history of what was sent and when
   - Source: TRI-62, Industry compliance
   - Related: Spatie Activity Log, Event Sourcing

### Open Questions

| Question | Ask/Research |
|----------|--------------|
| Where should training materials live? | Product decision - Documents? Separate module? |
| Package-centric or Contact-centric view? | UX decision - likely both needed |
| Real-time updates needed? | Tech decision - polling vs WebSocket |
| Integration with Calls Uplift timeline? | Architecture decision - shared component? |
| Mobile access priority? | Product decision - affects build approach |

---

## Recommended Next Steps

### Immediate (This Quarter)

1. **Complete DUC-5** - Activity Log Infrastructure
   - Unify email send events into activity stream
   - Create efficient timeline queries
   - Build reusable timeline component

2. **Extend TRI-62** - Email history on bills
   - Implement email audit log display
   - Pattern can extend to other entities

### Near-Term

3. **Create Communications Canvas Epic** in Linear
   - Link to DUC-5 as dependency
   - Break into phased delivery

4. **Training Materials Organization**
   - Audit existing training content
   - Create tagging/categorization structure
   - Build directory UI

### Later

5. **Full Communications Canvas**
   - Unified timeline across calls, emails, notes
   - Material linking
   - Mobile access
   - Analytics/FCR tracking

---

## Technical Architecture Recommendation

### Option A: Extend Notes (Recommended)

```
domain/Note/Enums/NoteCategoryEnum.php
+ COMMUNICATION_CALL
+ COMMUNICATION_EMAIL
+ COMMUNICATION_SMS
+ COMMUNICATION_MEETING

resources/js/Components/Timeline/
+ CommunicationsTimeline.vue (extends CommonNotes pattern)
+ TimelineItem.vue (generic timeline entry)
+ MaterialLink.vue (training material attachment)
```

**Pros:**
- Proven production system
- Existing UI components
- Familiar to developers
- Fast to implement

**Cons:**
- Notes table may grow large
- Different from Calls Uplift approach

### Option B: Unified Activity System

```
app/Models/Activity.php (Spatie extended)
+ subject_type, subject_id (polymorphic)
+ activity_type (enum)
+ properties (JSON - context, attachments)
+ related_material_id (training doc)

resources/js/Components/Timeline/
+ UnifiedTimeline.vue (queries unified activity table)
```

**Pros:**
- Single source of truth
- Cleaner architecture long-term
- Aligns with DUC-5 goals

**Cons:**
- Larger infrastructure change
- Migration of existing data
- More planning needed

### Recommendation

**Start with Option A** (extend Notes) for quick wins, **migrate to Option B** (unified activities) as DUC-5 completes.

---

## Research Sources

### Internal
- Luke Traini Teams Chat (2026-02-07)
- BRP January 2026 Strategic Planning Documents
- Linear Issues (15+ searched)
- Codebase Analysis (domain/, app/, resources/)

### External
- [ShiftCare - Care Management Software](https://shiftcare.com/us/care-management-software)
- [Alora Health - Home Care Software](https://www.alorahealth.com/home-care-software/)
- [athenahealth - Care Coordination](https://www.athenahealth.com/solutions/care-coordination)
- [Birdie Blog - Communication Tools](https://www.birdie.care/blog/home-care-communication-tools)
- [RingCentral - Unified Healthcare Communications](https://www.ringcentral.com/us/en/blog/ringcentrals-communications-platform-enables-better-healthcare-outcomes/)
- [SQM Group - First Call Resolution Best Practices](https://www.sqmgroup.com/resources/library/blog/fcr-metric-operating-philosophy)
