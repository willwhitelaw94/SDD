---
title: "Design Brief: Feedback Records Management"
status: Draft
created: 2026-02-26
---

# Design Brief: Feedback Records Management

**Epic:** COM
**Spec:** [spec.md](/initiatives/Work-Management/Complaints-Management/spec)

---

## User Context

| Aspect | Answer | Impact on Design |
|--------|--------|------------------|
| Primary User | Care Partner | Needs efficiency, status-at-a-glance |
| Secondary User | Operations staff | Triage, create records, monitor overdue |
| Tertiary User | Compliance Manager | Oversight, confidential records, audit |
| Device Priority | Desktop-first | Can use complex layouts, tables, split views |
| Usage Frequency | Daily (CPs), weekly (Compliance) | Worth investing in quick-scan patterns |
| Context | Multitasking, time-pressured | Quick status checks, not deep reading |
| Primary Intent | Check status quickly | Lead with summary (stage, AP, due date, last note) |

---

## Design Principles

**North Star:** "Single pane of glass" — everything about a feedback record visible without clicking away.

**Supporting Principles:**
1. **Status at a glance** — stage, accountable person, due date, and last note visible without opening the record
2. **Actions within context** — write a note, advance stage, update action plan without navigating away from the record view
3. **Don't hide the detail** — all fields visible in one scrollable view, not buried behind tabs or accordions

---

## Build Size

**Size:** Large

**Rationale:**
- 6+ new screens (list, detail, create form, edit, action plan, public intake)
- New domain model (FeedbackRecord, FeedbackActionItem)
- Stage management workflow (new pattern for Portal)
- CRM push infrastructure (Portal→CRM mirror)
- Migration tooling (one-time CRM import)
- Public-facing form (unauthenticated, Phase 3)

---

## Scope

**MVP (Phase 1):**
- Create, view, edit feedback records (full intake form)
- Stage management with transition timestamps
- Notes (create, edit, delete) with CRM push
- Action Plan CRUD with CRM push
- CRM mirror push (non-blocking background jobs)
- One-time migration from CRM
- Permissions (6 permission keys)

**Deferred:**
- Package Notes timeline integration (Phase 2)
- Public intake form (Phase 3)
- Feedback & Compliment record types (future)
- Automated notifications (separate initiative)
- Analytics/reporting (separate initiative)

**Feature Flag:**
- `feedback-records` — gates the entire Feedback Records tab on packages. Allows gradual rollout by team.

---

## Constraints

### Accessibility
- WCAG Target: Level AA (matches Portal standard)
- Keyboard navigation: Required for stage advancement and note creation
- Screen reader: Labels on all form fields, status announcements on stage changes

### Security & Privacy
- Confidential records: hidden from all users except those with `view-confidential-complaints`
- Complaint content may contain sensitive personal information — same encryption as package data
- Public intake form (Phase 3): unauthenticated, requires CSRF + rate limiting

### Dependencies
- Depends on: existing Package page infrastructure, Note model, Document model
- Blocks: Phase 2 (Package Notes integration), Phase 3 (public form)

---

## Edge Cases

| Edge Case | How to Handle | Priority |
|-----------|---------------|----------|
| No feedback records on package | Empty state with "Create New" CTA | P1 |
| CRM push pending | Small "sync pending" badge on record — no functionality blocked | P1 |
| CRM push failed after 3 retries | "CRM sync failed" badge + admin can retry | P1 |
| Confidential record in list | Hidden entirely for unauthorised users — no "locked" placeholder | P1 |
| Remediation converted to complaint | Type pill changes, stage workflow switches, history preserved | P1 |
| Very long description text | Truncated in list view, full in detail view | P2 |
| 20+ feedback records on one package | Paginated list, sorted by date received descending | P2 |
| Action plan with 10+ items | Scrollable section, completed items collapsed by default | P2 |
| User without create permission views list | "Create" button hidden, list is read-only | P1 |
| Stage advanced then CRM push fails | Portal stage is authoritative — CRM catches up on retry | P1 |

---

## Next Steps

- [x] `/trilogy-mockup` — UI mapping (4 HTML screens generated)
- [x] `/trilogy-design-handover` — Gate 2 (Design → Dev)
- [x] `/speckit-plan` — Technical implementation plan (Gate 3: PASS)

---

## Gate 2: Design Handover

**Date**: 2026-02-26
**Status**: PASS

### Checklist Results

- [x] User research complete (primary, secondary, tertiary users defined)
- [x] Design principles defined (North Star + 3 supporting)
- [x] Edge cases identified (9 cases with handling and priority)
- [x] Constraints documented (accessibility, security, dependencies)
- [x] Build size assessed (Large, with rationale)
- [x] Mockups complete (4 HTML screens with portal shell)
- [x] All Phase 1 user stories covered in mockups (US1-6)
- [x] CRM fields captured (30+ fields in create form and detail view)
- [x] Empty/error states addressed (sync badges, overdue alert, empty list)
- [x] Phased rollout planned (Phase 1/2/3 with feature flag)
- [x] Permissions visualised (create button hidden, confidential records hidden)
- [x] Dependencies identified (Package page, Note model, Document model)

### Design Handover Summary

**Initiative**: Feedback Records Management (COM)
**Date**: 2026-02-26
**Design Owner**: Sian Henderson (Compliance Manager)

#### What We're Building

A full feedback records management system on the Portal replacing the CRM as source of truth. Complaints and remediations are created, viewed, edited, and resolved entirely on the Portal. All changes push to the CRM as a read-only mirror via non-blocking background jobs. One-time migration imports existing CRM data.

#### Key Screens

1. **Record List** (`01-record-list.html`) — Feedback records tab on Package page
   - Table with reference, type, stage, triage, AP, due date, last note
   - Filters by type, stage, triage category
   - Overdue indicators, CRM sync badges

2. **Record Detail** (`02-record-detail.html`) — Full CRM-like single-pane view
   - 7-5 column split: data left, people/timeline right
   - All 30+ fields in sections: Overview, Complainant, Details, Resolution
   - Notes with author avatars, inline edit/delete
   - Action plan table with completion tracking
   - Stage progress bar with link to full management

3. **Create Form** (`03-create-form.html`) — Full intake form
   - Type selector (radio cards: Complaint vs Remediation)
   - All CRM fields in sections matching the detail view
   - Resolution section disabled on create ("populated during investigation")

4. **Stage Management** (`04-stage-management.html`) — Stage lifecycle
   - Current stage card with advance options
   - Clickable next-stage buttons with descriptions
   - Confirmation modal with optional note
   - Full stage history timeline with timestamps and durations

#### Component Decisions

**Reusing Existing:**
- `CommonTable` for record list and action plan
- `CommonCard` for section containers
- `CommonBadge` for type, stage, triage, sync status
- `CommonFormField` + `CommonInput` / `CommonSelectMenu` / `CommonTextarea` for create/edit forms
- `CommonButton` for all actions
- `CommonAlert` for overdue warning
- `CommonDefinitionList` for field display in detail view
- `CommonTabs` for Package page tabs (existing tab infrastructure)
- `CommonAvatar` for note authors and people cards
- `CommonModal` for stage advance confirmation

**New Components Needed:**
- [ ] Stage progress bar — horizontal step indicator (may extend `CommonStepNavigation` or build custom)
- [ ] CRM sync status badge — small inline indicator with spinner animation

#### Critical UX Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Detail view layout | Single scrollable page, no tabs | "Single pane of glass" principle — don't hide fields |
| Column split | 7-5 (data left, people right) | Core fields need more space; people cards are compact |
| Stage management | Separate page from detail | Complex lifecycle needs dedicated space; detail shows compact progress bar |
| Resolution fields on create | Present but disabled | Shows users what's needed later without cluttering the immediate task |
| Notes display | Chronological, inline in detail | Avoids modal/overlay — notes are part of the record context |
| CRM sync indicator | Small non-blocking badge | Portal is source of truth — CRM sync is informational, never blocks |

#### Data Requirements

| Screen | Data Needed | Source |
|--------|-------------|--------|
| Record List | FeedbackRecords for package | `FeedbackRecord` model via Package relationship |
| Record Detail | Full FeedbackRecord with notes and action items | `FeedbackRecord` with eager-loaded `notes`, `actionItems`, `accountablePerson`, `qualitySupportLead`, `escalationPoint` |
| Create Form | User list for people fields, enum values for picklists | Users with package access, enum classes for triage/department/source/etc. |
| Stage Management | FeedbackRecord with stage history | `FeedbackRecord` with stage transition timestamps |

#### Open Questions for Development

- [ ] **Action Plan subform fields**: Need a populated CRM example to confirm exact schema
- [ ] **Direct vs Indirect classification**: Determines `NoteCategoryEnum` value for Phase 2
- [ ] **Old Complaints module (CustomModule14)**: Confirm superseded by `Complaints2`
- [ ] Stage progress bar: extend `CommonStepNavigation` or build custom component?
- [ ] REF number generation: continue CRM sequence or start new Portal sequence?

#### Out of Scope (Deferred)

- Package Notes timeline integration (Phase 2)
- Public intake form (Phase 3)
- Feedback & Compliment record types (future)
- Automated notifications (separate initiative)
- Analytics/reporting (separate initiative)

### Sign-Off

| Role | Name | Date | Status |
|------|------|------|--------|
| Product/Compliance | Sian Henderson | | [ ] Approved |
| Lead Developer | | | [ ] Approved |
