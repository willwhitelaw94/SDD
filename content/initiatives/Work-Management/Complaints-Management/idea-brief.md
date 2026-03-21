---
title: "Idea Brief: Complaint Note Sync"
---

# Idea Brief: Complaint Note Sync

**Created**: 2026-02-26
**Author**: Will Whitelaw
**Linear**: [TRI-99](https://linear.app/trilogycare/issue/TRI-99/sync-notes-between-crm-complaints-and-portal), [TRI-100](https://linear.app/trilogycare/issue/TRI-100/joining-notes-sync-portal-notes-to-crm-complaints)
**Initiative**: Work-Management / Complaints Management (COM)

---

## Problem Statement (What)

- **Fragmented complaint history**: Complaint notes in Zoho CRM and client notes on the Portal are completely siloed — staff must check both systems to get the full picture
- **Stale contact dates**: CRM shows last contact as 29 Jan when Portal shows 19 Feb — complaint handlers make decisions on inaccurate timelines
- **Lost investigation context**: Ops updates, transcript requests, and commission-related follow-ups logged in one system are invisible in the other
- **Commission risk**: When complaints escalate to commission, the documentation trail is incomplete because notes are split across systems

**Current State**: Complaints are managed entirely in Zoho CRM. The CRM complaint page shows ~4 notes, while the Portal has the full client note timeline. Staff manually cross-reference both systems. There is zero complaint infrastructure in the Portal — no models, controllers, or sync jobs exist for complaints.

---

## Possible Solution (How)

Sync complaint-related notes from Zoho CRM into the existing **Package Notes tab** on the Portal, giving staff a single unified timeline.

- **Zoho → Portal sync**: Pull complaint notes from Zoho CRM into the Portal's existing `notes` table, linked to the relevant package via the polymorphic `noteable` relationship
- **Complaint note categorisation**: Use the existing `FEEDBACK_COMPLAINT_DIRECT` and `FEEDBACK_COMPLAINT_INDIRECT` note categories to tag synced complaint notes
- **Unified timeline**: Complaint notes appear inline with existing package notes, sorted chronologically — no separate UI needed
- **Last contact accuracy**: Package "last contact" dates reflect activity from both systems

```
// Before (Manual Cross-Referencing)
1. Staff opens complaint in Zoho CRM → sees 4 complaint notes
2. Staff opens Portal → sees 20+ client notes (some complaint-related)
3. Staff mentally merges the two timelines
4. Staff misses that Ops posted an update on Portal 3 weeks ago

// After (Synced Notes)
1. Staff opens Package Notes tab on Portal → sees full unified timeline
2. Complaint notes from CRM appear with complaint category tags
3. Last contact date is accurate across both systems
4. All investigation context visible in one place
```

---

## Benefits (Why)

**User/Client Experience**:
- Complete complaint history in one view — no more manual cross-referencing
- Faster complaint resolution through better information visibility

**Operational Efficiency**:
- Eliminates dual-system lookup (~5-10 min per complaint review)
- Reduces risk of missed context during investigations

**Business Value**:
- Stronger documentation trail for commission escalations
- Supports 28-day resolution target by reducing information delays

**ROI**: With 200-250 complaints/month, even 5 min saved per review = ~20 hours/month recovered

---

## Owner (Who)

| Role | Person |
|------|--------|
| **R** | — |
| **A** | — |
| **C** | Sian H (Complaints Process Lead), Patrick H (Operational Lead) |
| **I** | — |

---

## Assumptions & Dependencies, Risks

**Assumptions**:
- Zoho CRM complaint records are associated with a client/package that exists in the Portal
- The existing `SyncNotesFromZohoJob` pattern can be extended for complaint notes
- Complaint notes in Zoho have a module/field that distinguishes them from regular notes

**Dependencies**:
- Zoho CRM API access to the Complaints module (may need new API scope)
- Understanding of Zoho complaint data structure (fields, relationships)

**Risks**:
- Zoho complaint module may not expose notes via the same API pattern as Care_Plans (MEDIUM) → Mitigation: Investigate Zoho API early in discovery
- Note deduplication — some complaint notes may already be synced as package notes (LOW) → Mitigation: Use `zoho_id` unique constraint to prevent duplicates

---

## Estimated Effort

**2-3 sprints**, approximately M (medium)

- **Sprint 1**: Discovery & sync job — investigate Zoho complaint API, create sync job following `SyncIncidentsFromZohoJob` pattern, map complaint notes to packages
- **Sprint 2**: Integration & testing — webhook for real-time sync, complaint category tagging, ensure "last contact" date accuracy, write tests
- **Sprint 3** (if needed): Polish — handle edge cases (orphaned complaints, missing package links), monitoring, documentation

---

## Proceed to PRD?

**YES** — The existing sync infrastructure (ZohoService, webhook system, Note model with Zoho fields) makes this well-scoped. The Incident domain provides a proven one-way sync pattern to follow.

---

## Decision

- [ ] **Approved** - Proceed to PRD
- [ ] **Needs More Information** - [What's needed?]
- [ ] **Declined** - [Reason]

**Approval Date**: —

---

## Next Steps

**If Approved**:
1. [ ] Investigate Zoho Complaints module API structure
2. [ ] Create PRD with detailed sync mapping
3. [ ] Break down into user stories

**If Declined**:
- Continue manual cross-referencing workflow
