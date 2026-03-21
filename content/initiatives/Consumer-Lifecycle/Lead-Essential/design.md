---
title: "Design Kickoff: Lead Essential (LES)"
---

# Design Kickoff: Lead Essential (LES)

**Epic:** LES (TP-2315)
**Spec:** [spec.md](spec.md)
**Created:** 2026-02-21
**Status:** Draft

---

## Context

### User Research

| Aspect | Answer | Impact on Design |
|--------|--------|------------------|
| Primary User | Sales Staff (agents + team leaders) | Needs efficiency, quick actions, keyboard nav |
| Secondary User | Lead Owner (consumer/representative) | Needs simplicity, section-based editing |
| Device Priority | Desktop-first (sales staff on desktop all day) | Can use complex layouts, sidebars, multi-column |
| Usage Frequency | Daily power-user (staff), occasional (consumers) | Worth investing in list view performance, quick create |
| Context | Multitasking — phone calls, switching between leads | Needs persistent sidebar context, fast transitions |

### Competitive Research

#### HubSpot CRM — Contact Record
**Layout:** 3-column (left sidebar properties, middle activity timeline, right related records).
**What they do well:**
- Customisable overview tab with drag-and-drop card arrangement
- Activity timeline filterable by type (calls, emails, notes, tasks)
- Sidebar properties grouped into collapsible cards

**What we can learn:**
- Overview tab as the default landing spot — quick summary before diving into timeline
- Sidebar should show identity + status at a glance without scrolling

#### Salesforce — Lead Record
**Layout:** 3-column with 4-zone sidebar hierarchy (ownership → frequent fields → high-value info → system metadata).
**What they do well:**
- Path component at top — horizontal stage bar with click-to-advance and guidance text per stage
- Collapsible sections with remembered preferences per user
- Activity timeline in centre column with expand/collapse all

**What we can learn:**
- Stage guidance text per step (tell agent what's needed at each stage)
- Zone-based field prioritisation — most-updated fields highest, system fields lowest
- 3-column is overkill for our use case — we don't have enough related records to justify a third panel

#### Pipedrive — Contact Detail
**Layout:** 2-panel (main content + sidebar) with independent scroll bars.
**What they do well:**
- Summary panel at top of sidebar — critical info (email, phone, labels, linked org) always visible
- Independent scrollbars for sidebar and main content — scroll main without losing sidebar context
- Collapsible sections with focus/history/changelog tabs
- Focus section highlights upcoming activities, pinned notes, email drafts

**What we can learn:**
- Independent scrolling is essential — sidebar context must persist while scrolling main content
- Summary panel pattern for the persistent sidebar

#### Close CRM — Lead Record
**Layout:** 2-panel (fields left, activity timeline right).
**What they do well:**
- Pinned activities (up to 5) float to top of timeline — critical context always visible
- Unified activity stream — all communication types (calls, emails, SMS, notes, status changes) in one chronological feed
- Auto-logging of all communication — eliminates manual data entry
- Inline editing with ESC to cancel
- Custom field descriptions visible on hover

**What we can learn:**
- Pinned notes pattern for timeline — could adopt for LES (pin important notes/events)
- Activity filtering by type without leaving the page
- Speed-first philosophy matches our design principle

#### Zoho CRM — Lead Record (the system we're replacing)
**Layout:** Tabs (Basic Info, Deal Details, etc.) + related lists below detail view.
**What they do well:**
- Blueprint workflow — visual stage progression with mandatory fields per transition
- Canvas view for custom visual layouts without code
- Related lists with expandable/collapsible sections
- Tab-based organisation keeps information chunked

**What they do badly (why users want to leave):**
- Timeline defaults to oldest-first with no persistent preference — constant manual reset
- Interface complexity — steep learning curve, inconsistent across modules
- Missing context on updates — hard to see who changed what and why
- Performance degrades with too many related lists

**What we must improve on:**
- Timeline newest-first by default
- Simpler, consistent interface
- Clear audit trail showing who/when/why on every change

### Pattern Synthesis

| Decision | Our Approach | Rationale |
|----------|-------------|-----------|
| Layout | 2-panel (sidebar + main with tabs) | Matches Portal's existing patterns (Suppliers, CareCoordinators). 3-column is overkill. |
| Stage visualisation | Horizontal progress bar at page top | Universal CRM pattern. Click-to-advance opens wizard. |
| Timeline position | Dedicated tab (not always-visible panel) | Keeps Overview tab clean. Staff go to Timeline when they need history. |
| Section editing | Inline card expansion (ACRM pattern) | Spec decision. Collapsible cards with edit toggle — read mode by default. |
| Sidebar content | Identity + status + assignment (persistent) | Pipedrive/Close pattern — key context always visible regardless of tab. |
| Notes | Pinned notes support (Close pattern) | High-value for lead handoffs between agents. |

---

## Strategy

### Design Principles

**North Star:** Speed over polish — optimise for agent efficiency. Fastest possible path to update a lead.

**Supporting Principles:**
1. **Context without navigation** — Key lead info (stage, status, assignment, last contact) visible from any tab without clicking back
2. **Edit where you read** — Section cards toggle between read and edit mode in-place. No modals, no page navigation.
3. **Pipeline first** — Journey Stage and Lead Status are the most prominent elements on every screen. They're what the business measures.
4. **Familiar > clever** — Use patterns sales staff already know from Zoho/CRMs. Don't innovate on interaction patterns, innovate on speed.

### Emotional Design

**Target Emotion:** In control — "I can see my whole pipeline and know exactly what to do next"

**Frustration Risks:**
- Too many clicks to update a single field (Zoho complaint)
- Losing context when switching between leads (need fast back-to-list)
- Not knowing what's required before a stage transition (wizard should preview requirements)
- Timeline buried under too much scrolling (paginate, filter)

### Build Size Assessment

**Size:** M (BMW 3 Series)

**Rationale:**
- ~4 new screens (profile view with 3 tabs, quick create modal, guided create stepper, status wizards)
- ~2 modified screens (list view enhancements, consumer profile replacement)
- New components: Journey Stage bar, status wizard modals, timeline entries, section edit cards, traits editor
- Heavy reuse: CommonCard, CommonForm, CommonFormField, CommonStepNavigation, CommonSelectMenu, CommonTable, CommonBadge

**Existing components to reuse:**
- `CommonCard` — section containers (read mode)
- `CommonForm` + `CommonFormField` — all edit forms
- `CommonStepNavigation` — guided create stepper + Journey Stage bar reference
- `CommonSelectMenu` — dropdowns with fuzzy search (agent assignment, status selection)
- `CommonButton`, `CommonBadge`, `CommonAlert` — actions, status display, validation
- `CommonDefinitionItem` — read-only field display in section cards
- `CommonModal` — quick create, status wizards
- `CommonSplitPanel` — potential sidebar + main layout

---

## Constraints

### Accessibility Requirements

**WCAG Target:** Level A (minimum)

**Specific Requirements:**
- [x] Keyboard navigation — staff tab through forms during phone calls, critical for efficiency
- [ ] Screen reader — not required for MVP
- [ ] High contrast — not required for MVP

### Security & Privacy

**Sensitive Data:**
- [x] Personal information (name, DOB, address, phone, email)
- [x] Health-adjacent information (aged care stage, ACAT status, support needs)

**Visibility Rules:**
- Sales agents see all leads (no row-level filtering in LES)
- Sales team leaders see all leads + bulk operations
- Consumers see only their own profile sections (5 sections, no contact management)
- Staff see all tabs including Timeline, Other

**Audit Requirements:**
- All status/stage changes logged to immutable timeline (FR-048)
- Who changed what, when, and the before/after values

### Stakeholder Constraints

**Constraints:**
- Bi-directional Zoho sync must be maintained — field names and values need to map
- Journey Stage enum must map to existing `LeadJourneyStageEnum` (10 cases → 6 primary stages)
- Feature flag gated — existing `lead-to-hca-conversion` flag or new LES flag

**Approvers:**
- [x] Us — no formal design approval gate. Ship and iterate.

### Dependencies

**Depends On:**
- Lead-to-HCA conversion wizard (already built) — LES profile enriches data that LTH consumes
- Existing Lead data model (`domain/Lead/Models/`) — already built
- Zoho sync infrastructure — already built
- CommonStepNavigation, CommonCard, CommonForm — already built

**Blocks:**
- LTH conversion quality (better lead profiles → better conversion data)
- LGI lead capture (needs LES profile structure to populate)
- LDS extended CRM features (builds on LES profile + timeline)

---

## Planning

### Screen Inventory

| Screen | Type | Route Pattern | Components |
|--------|------|---------------|------------|
| Staff Leads List | Enhanced existing | `/staff/leads` | CommonTable, filters, KPI cards, bulk actions |
| Staff Lead Profile — Overview | New | `/staff/leads/{lead}` | Sidebar + tabbed main. Section cards (read/edit toggle) |
| Staff Lead Profile — Timeline | New | `/staff/leads/{lead}/timeline` | Chronological entries, add note, pagination |
| Staff Lead Profile — Other | New | `/staff/leads/{lead}/other` | Attribution (read-only), Traits (editable) |
| Quick Create Modal | New | Modal overlay on list | CommonModal + CommonForm (name, email, phone) |
| Guided Create Stepper | New | `/staff/leads/create` | CommonStepNavigation (3 steps) |
| Journey Stage Wizard | New | Modal overlay | Stage selector + mandatory field form |
| Lead Status Wizards (x4) | New | Modal overlays | Status-specific field forms |
| Consumer Profile | Replace existing | `/lead/edit` | Section cards (5 sections, edit toggle) |

### Edge Case Inventory

| Edge Case | How to Handle | Priority |
|-----------|---------------|----------|
| Duplicate email on create | Warning banner with link to existing lead. Allow proceed. | P1 |
| Lead with no Journey Stage data | Default to Pre-Care on creation. Show "Unknown" badge for legacy leads. | P1 |
| Lost lead re-engagement | Allow status change back from Lost. Require re-engagement note. Stage unfreezes. | P1 |
| Empty timeline | Show empty state with "No activity yet" message | P2 |
| Missing attribution data | Show "No attribution data" empty state on Other tab | P2 |
| Bulk assign 100+ leads | Paginated selection. Background job for bulk assignment. Success toast. | P2 |
| Zoho sync conflict | Portal wins for fields edited in Portal. Show "Last synced" timestamp. | P2 |
| Long lead name (overflow) | Truncate with ellipsis in list view. Full name in profile sidebar. | P3 |
| Consumer with no account (guest) | Section cards still display. "Create account to save" prompt for guests. | P3 |

### Performance Considerations

**Page Frequency:** High — list view accessed dozens of times per day per agent.

**Data Considerations:**
- Lead list: 500-10,000 leads. Server-side pagination + filtering essential (already exists).
- Timeline: Paginated (FR decision). Load 20 entries, "Load more" button.
- Profile sections: All data loaded on initial page load (single lead, not large).
- Sidebar: Static once loaded — no real-time updates needed.

**Real-time:** Not required for MVP. Zoho sync is async/queued.

### Analytics & Success Metrics

**Success Metrics (from spec):**
- SC-001: Create lead in < 30 seconds
- SC-002: 100% leads with valid Journey Stage + Lead Status
- SC-003: Update any section in < 60 seconds
- SC-007: List view loads in < 2 seconds for 10,000 leads
- SC-008: Profile completion +15% in first month

**Events to Track:**
- `lead.created` (path: quick_create | guided_create)
- `lead.section_edited` (section: personal_details | living_situation | etc.)
- `lead.stage_changed` (from → to)
- `lead.status_changed` (from → to, status_type)
- `lead.assigned` (from → to, bulk: true/false)
- `lead.note_added`
- `lead.exported` (count, format)

### Phased Rollout

**Single release** — all 11 stories behind feature flag. No phased rollout per business-spec.md.

**Feature Flag:** `lead-essential` (new flag, or extend existing `lead-to-hca-conversion`)

---

## Validation

### Risks & Assumptions

**Assumptions:**
- Sales staff will adapt to inline section editing (not modal-based like Zoho)
- Timeline tab is sufficient — staff don't need always-visible activity feed
- 6 primary Journey Stages are enough — substages provide granularity without overwhelming the progress bar
- Consumer section-based forms will increase completion vs the current 6-step wizard

**Risks:**

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Staff miss Zoho's tab-heavy layout | Medium | Low | Section cards are familiar from ACRM. Training session at launch. |
| Timeline tab gets ignored | Low | Medium | Add "last activity" summary to sidebar. Key events visible without visiting tab. |
| Journey Stage wizard feels heavy | Medium | Medium | Show required fields upfront. Pre-fill what we can. Allow save without all optional fields. |
| Quick Create used for everything (data quality drops) | Medium | High | Profile completion indicator nudges staff to complete sections. Team leader dashboard shows completion rates. |

### User Testing Plan

**Approach:** Ship and iterate. No formal testing before build.

**Post-Launch Feedback:**
- Jacqueline Palmer (Sales Team Leader) — primary feedback source
- Sales agents — observe usage patterns in first week
- Track SC-001 through SC-008 metrics from day 1

---

## Ready for Mockups

- [x] User research complete
- [x] Competitive research complete (HubSpot, Salesforce, Pipedrive, Close, Zoho)
- [x] Design principles defined (Speed over polish, In control)
- [x] Edge cases identified (9 cases documented)
- [x] Constraints documented (accessibility, security, dependencies)
- [x] Existing component inventory complete
- [x] Screen inventory defined (9 screens)
- [x] No stakeholder approval needed

**Next Step:** `/trilogy-mockup` or `/speckit-plan`

---

## Gate 2: Design Handover

**Date**: 2026-02-22
**Status**: PASS ✅
**Design Owner**: William Whitelaw
**Next Step**: `/speckit-plan`

### Checklist Results

#### Design Kickoff Completeness
- [x] User research complete — Primary (Sales Staff), device priority, usage context all defined
- [x] Design principles defined — North Star + 4 supporting principles
- [x] Edge cases identified — 9 cases with handling and priority
- [x] Constraints documented — accessibility, security, Zoho sync, dependencies
- [x] Build size assessed — M (BMW 3 Series), rationale clear

#### Design-Spec Alignment
- [x] All user stories have design coverage — 9 screen types covering 11 spec stories
- [x] Success metrics defined — SC-001 through SC-008 + analytics event tracking plan
- [x] Phased rollout documented — Single release, all behind feature flag

#### Mockup Coverage
- [x] 9 HTML screens in `mockups/` — all screen types from design.md covered
- [x] Challenge mode completed — 5 students with rationale + comparison.md

#### Stakeholder Alignment
- [x] Constraints noted — Zoho field mapping, Journey Stage enum, feature flag gating
- [x] Risks documented — 4 risks with likelihood/impact/mitigation
- [x] Dependencies clear — LTH (depends on), LGI + LDS (blocks)

### Handover Summary

**What we're building:** Lead Essential replaces Zoho CRM as the primary lead management workspace for sales staff. It adds a rich 2-panel lead profile (sidebar + tabbed main), section-based editing (ACRM pattern), Journey Stage tracking with wizard, Lead Status wizards, timeline, quick create modal, guided create stepper, and a redesigned consumer profile.

#### Key Screens

| # | Screen | Type | Route |
|---|--------|------|-------|
| 01 | Lead Profile — Overview | New | `/staff/leads/{lead}` |
| 02 | Lead Profile — Timeline | New | `/staff/leads/{lead}/timeline` |
| 03 | Lead Profile — Other | New | `/staff/leads/{lead}/other` |
| 04 | Quick Create Modal | New | Modal on `/staff/leads` |
| 05 | Guided Create Stepper | New | `/staff/leads/create` |
| 06 | Journey Stage Wizard | New | Modal overlay |
| 07 | Lead Status Wizards (×4) | New | Modal overlays |
| 08 | Consumer Profile | Replace | `/lead/edit` |
| 09 | Staff Leads List | Enhance existing | `/staff/leads` |

Mockup files: `mockups/01-lead-profile-overview.html` through `mockups/09-list-view.html`

#### Component Decisions

**Reusing Existing:**
- `CommonCard` — section containers (read mode)
- `CommonForm` + `CommonFormField` — all edit forms
- `CommonStepNavigation` — guided create stepper
- `CommonSelectMenu` — agent assignment, status dropdowns
- `CommonButton`, `CommonBadge`, `CommonAlert` — actions, status, validation
- `CommonDefinitionItem` — read-only field display in section cards
- `CommonModal` — quick create, all status wizards
- `CommonTable` — staff leads list

**New Components Needed:**
- Journey Stage progress bar (horizontal, click-to-advance)
- Section edit card (read/edit toggle, ACRM pattern)
- Timeline entry (activity types, pinned notes)
- Traits editor (JSON field editor for lead traits)

#### Critical UX Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Layout | 2-panel (sidebar + tabbed main) | Matches Portal patterns. 3-column overkill for our data volume |
| Section editing | Inline card toggle (not modals) | Staff requested Zoho-style tabs are confusing. Edit where you read. |
| Stage advancement | Click progress bar → wizard | Journey Stage wizard pre-fills requirements, prevents invalid transitions |
| Timeline position | Dedicated tab | Keeps Overview clean. Staff go to Timeline for history. |
| Sidebar content | Identity + status + assignment (always visible) | Pipedrive/Close pattern — context persists across tab navigation |

#### Data Requirements

| Screen | Key Data Needed |
|--------|----------------|
| Lead Profile Sidebar | lead.name, journey_stage, lead_status, assigned_agent, last_contact |
| Overview Tab | personal_details, living_situation, support_needs, contact_info |
| Timeline Tab | Stored events (paginated, 20/page), notes, status/stage changes |
| Other Tab | Attribution (utm_source, referral), traits (JSON) |
| Stage Wizard | Required fields per stage transition |
| Status Wizards | Status-specific fields (e.g. Lost reason, Enquiry type) |

#### Open Questions for Development

- [ ] Which feature flag to use — new `lead-essential` or extend existing `lead-to-hca-conversion`?
- [ ] Journey Stage wizard: store required fields per stage in config or hardcode in aggregate?
- [ ] Pinned notes: new event type or flag on existing note events?
- [ ] Consumer profile sections: same aggregate as staff-side, or separate read/write boundaries?
- [ ] Bulk assignment: queue job or synchronous for small batches (<10)?

#### Out of Scope (Deferred to LDS)

- Timeline enrichment (call recordings, email body, SMS content)
- Attribution analytics dashboard
- Options & Traits extended editor
- Custom field descriptions on hover
- Real-time sync status indicator

### Sign-Off

| Role | Status |
|------|--------|
| Designer/Product | ✅ Approved — William Whitelaw, 2026-02-22 |
| Formal stakeholder approval | Not required — ship and iterate |

Design is complete. All major UX decisions are finalised. Open questions are documented and non-blocking for technical planning to begin.
