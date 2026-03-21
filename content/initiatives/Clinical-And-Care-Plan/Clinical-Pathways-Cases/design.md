---
title: "Design Kickoff: Clinical Pathways / Cases"
status: Draft
created: 2026-02-13
---

# Design Kickoff: Clinical Pathways / Cases

**Epic:** CLI — Clinical Portal Uplift
**Spec:** [spec.md](spec.md) | **Plan:** [plan.md](plan.md)

---

## Context

### User Research

| Aspect | Answer | Impact on Design |
|--------|--------|------------------|
| Primary User | Clinical Lead (governance, population oversight) | Dashboard-first thinking — aggregate counts, overdue visibility, drill-down to individual cases |
| Secondary User | Coordinator (care partner) | Needs efficient case creation and review completion during calls — forms must be fast |
| Device Priority | Desktop-first | Can use data-dense layouts, CommonTable with multiple columns, modal forms |
| Usage Frequency | Daily (Coordinators), Weekly (Clinical Leads) | Worth investing in at-a-glance status indicators and review prompts |
| Context | Coordinators: multitasking during calls, time-pressured. Clinical Leads: focused governance sessions, reviewing caseloads | Coordinators need quick actions; Clinical Leads need comprehensive data density |

### Competitive Research

#### Salesforce Health Cloud — Care Plans
**What they do well:**
- "Today Page" that automatically surfaces patients needing attention — prioritisation over chronology
- Care plans live inside Case records (integrated, not isolated)
- Task hierarchy: Problems > Goals > Tasks, but also supports flat task-only views for simpler plans

**What we can learn:**
- Surface overdue/urgent cases automatically rather than relying on users to scroll and find them
- Assessment-first patterns — put conclusions and next actions at the top for quick scanning

#### Cliniko — Australian Allied Health
**What they do well:**
- Persistent Medical Alerts that follow the user across all patient sections (profile, notes, cases)
- Customisable treatment note templates for clinical consistency
- Chronological treatment history as the primary navigation model

**What we can learn:**
- Critical case info (escalated status, overdue review) should be contextually persistent — visible wherever the recipient appears
- Template-driven notes reduce variance and improve audit quality

#### General Healthcare UX Patterns (2026)
**Key patterns:**
- **Overdue prominence**: Dedicated sections for overdue cases with visual emphasis (colour-coded, count badges)
- **Dense data is acceptable**: Clinicians prefer comprehensive data over minimalism — they look for "signals in noise"
- **Modal discipline**: Use modals for confirmations and short forms; prefer sidebars or full pages for complex case details
- **SOAP note evolution**: Assessment-first ordering (APSO) places most relevant data at top for ongoing care
- **Calm interfaces**: Generous spacing, clear hierarchy, minimal animations, predictable patterns

**Sources:**
- [Salesforce Health Cloud Care Plans](https://trailhead.salesforce.com/content/learn/modules/health-cloud-care-plans/create-and-use-care-plans)
- [Healthcare UI Design 2026: Best Practices (Eleken)](https://www.eleken.co/blog-posts/user-interface-design-for-healthcare-applications)
- [Top 10 UX trends shaping digital healthcare (UX Studio)](https://www.uxstudioteam.com/ux-blog/healthcare-ux)
- [Modal UX Design Patterns (LogRocket)](https://blog.logrocket.com/ux-design/modal-ux-design-patterns-examples-best-practices/)

### Existing Implementation

**Current State:** No existing Portal UI. Management plans are unstructured free-text documents in Zoho CRM — no lifecycle, no review schedule, no integration with Portal data.

**This is net new.** No UI to audit or replace. The Cases tab is a new addition to the Package view alongside existing tabs (Overview, Needs, Risks, Budget, etc.).

---

## Strategy

### Design Principles

**North Star:** Transparency over efficiency

Clinical leads need to **see everything clearly** — status, history, overdue items, escalations. Visibility and governance trump speed of data entry. If there's a trade-off between showing more information and simplifying the interface, show more.

**Supporting Principles:**
1. **Surface urgency automatically** — overdue reviews and escalated cases should demand attention without the user searching for them
2. **Dense data is a feature** — clinicians are comfortable with data-rich views. Don't over-simplify at the cost of visibility
3. **Audit trail is visible, not hidden** — review history, who did what, and when should be immediately accessible on the case detail — not buried in logs

### Emotional Design

**Target Emotion:** In control — "I can see everything, nothing is falling through the cracks."

This is especially important for clinical leads doing governance. The current CRM state creates anxiety ("what am I missing?"). The new Cases view should replace that with confidence.

**Frustration Risks:**
- Can't quickly tell which cases are overdue vs on track (solved: visual overdue indicators)
- Review history is hard to scan (solved: timeline-style review history with outcomes as headings)
- Too many clicks to complete a review (solved: review action accessible from case list, not just detail view)
- Uncertainty about what happens after escalation (solved: clear state machine feedback — "Case escalated to Mandatory, review interval reset to weekly")

### Build Size Assessment

**Size:** Medium (BMW 3 Series)

**Rationale:**
- 4 new Vue page components (Create, Show, Edit, Review Create)
- 6 new Vue components (tab content, card, detail, form, review form, report dashboard)
- Uses existing CommonTable, CommonModal, CommonBadge, CommonButton, CommonFormField patterns
- No new interaction paradigms — follows established Risks/Incidents tab pattern
- Phase 4 (reporting dashboard) adds complexity but is deferred from MVP

**Effort Estimate:** ~2-3 sprints design + dev (Phases 1-3 MVP)

---

## Constraints

### Accessibility Requirements

**WCAG Target:** Level AA

**Specific Requirements:**
- [x] Keyboard navigation — coordinators tab through forms during calls, must support full keyboard flow
- [x] Screen reader — standard ARIA labels on badges, buttons, form fields
- [x] Focus management — modal forms must trap focus, return focus on close
- [ ] High contrast mode — not required for MVP
- [ ] Cognitive accessibility — not explicitly required but supported by clear labelling

### Security & Privacy

**Sensitive Data:**
- [x] Personal information (recipient details visible on package)
- [x] Health information (clinical concern descriptions, review notes)

**Visibility Rules:**
- Coordinators see cases for packages they have access to (existing package permissions)
- Clinical leads see all cases for their organisation (via reporting view)
- `manage-clinical-case` permission gates create/review/close actions

**Audit Requirements:**
- All case lifecycle events recorded via event sourcing (who, what, when)
- Soft deletes only — no hard deletion of clinical data
- Review history immutable once recorded

### Stakeholder Constraints

**Constraints:**
- Mandatory cases require documented clinical justification for closure (regulatory duty of care)
- Escalation upgrades case type to Mandatory and resets review interval to weekly (7 days)
- Terminology: "Clinical Case" user-facing, "Case" in code, "Clinical Pathway" only for incident resolution enum

**Approvers:**
- [ ] Romy Blacklaw (PO)
- [ ] Patrick Hawker (Accountable)
- [ ] Marianne (Clinical Governance)

### Dependencies

**Depends On:**
- Existing Package tab system (`PackageService::getTabs()`) — confirmed working, supports feature-flagged tabs
- Existing Risk model and `riskables` polymorphic pivot — confirmed, no migration needed
- Existing Common component library — confirmed all required components exist

**Blocks:**
- None immediately. Phase 4 (incident bridge + reporting) depends on ICM delivering incident creation in Portal

---

## Planning

### Edge Case Inventory

| Edge Case | How to Handle | Priority |
|-----------|---------------|----------|
| No cases for recipient | Empty state with explanation + "Create Case" CTA | P1 |
| Overdue review on case list | Visual warning indicator (amber/red badge or icon) on the review date cell | P1 |
| Mandatory case closure attempt | Require clinical justification field (min 20 chars), validation prevents save without it | P1 |
| Escalated case — coordinator tries to close directly | Disabled close option with tooltip: "Escalated cases must be reviewed before closing" | P1 |
| Self-service case — no review schedule | Hide review date column/field. Show "No review required" in place of date | P1 |
| Case with deleted linked incident | Show "(Incident deleted)" reference. Case lifecycle unaffected | P2 |
| Feature flag toggled mid-session | Current action completes; tab hidden on next page load. Data preserved | P2 |
| Duplicate incident resolution triggering second case | Prompt: "An active case exists for this recipient. Create new or add to existing?" | P2 (Phase 4) |
| Case with 20+ reviews (long history) | Paginate or collapse older reviews in timeline. Most recent at top | P2 |
| Coordinator not assigned to package tries to create case | Blocked by existing package permission middleware | P1 |

### Performance Considerations

**Page Frequency:** Medium — accessed during care coordination, not high-traffic

**Data Considerations:**
- Cases per package: typically 1-10 (no pagination needed for list)
- Reviews per case: typically 1-20 over lifetime (timeline view, no pagination for MVP)
- Reporting view: queries across all packages — requires indexed queries on `(status, next_review_at)` and `(assigned_to, next_review_at)`

**Real-time:** Not required for MVP. No live updates or polling needed.

### Analytics & Success Metrics

**Success Metrics (Clinical Governance Focus):**
- Review compliance rate: % of reviews completed on time (target: >90% during pilot)
- Time-to-close: average days from case creation to closure
- Escalation rate: % of cases escalated (monitor for anomalies)
- Cases per coordinator: workload distribution visibility
- Overdue case count trend: decreasing over time indicates system is working

**Events to Track:**
- `clinical_case_created` (with case_type, trigger_source)
- `clinical_case_reviewed` (with outcome, days_since_last_review)
- `clinical_case_escalated`
- `clinical_case_closed` (with days_open, review_count)
- `clinical_case_overdue` (daily check — case with past-due review)

### Phased Rollout

**MVP Scope (Phases 1-3):**
- Manual case CRUD (create, view, edit, delete)
- Review lifecycle (continue, close, escalate)
- Dedicated "Cases" tab on Package view
- Feature-flagged per organisation from day one
- Risk linking via existing riskables pivot

**Phase 4 (Deferred):**
- Incident → Case bridge (auto-creation when incident resolves as "Clinical Pathway")
- Population-level reporting dashboard
- Organisation-filtered governance view

**Feature Flags:**
- `clinical-cases` — Enable Cases tab on Package view (PostHog + Pennant, per organisation)

---

## Validation

### Risks & Assumptions

**Assumptions:**
- Clinical leads will use the Cases tab as their primary governance tool (replacing CRM checks)
- Coordinators will find structured case creation faster than writing free-text CRM management plans
- The three case types (Mandatory, Recommended, Self-Service) cover all clinical scenarios
- Review compliance will improve with system-enforced scheduling (vs current "remember to check CRM")

**Risks:**

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Clinical leads find the case list insufficient for governance (need dashboard-style view) | Medium | Medium | MVP uses CommonTable with filters. Phase 4 adds dedicated reporting dashboard. Collect feedback during pilot |
| Coordinators resist structured workflow over flexible CRM free-text | Medium | High | Co-design case creation form with care partners. Keep form minimal (4-5 fields). Clinical concern remains free-text |
| Review timeline becomes unwieldy for long-running cases (20+ reviews) | Low | Low | Most recent reviews at top. Collapse older reviews. Defer pagination to post-MVP |
| Mandatory closure justification feels burdensome | Low | Medium | Clear inline guidance explaining why justification is required. Consider minimum character count (20) rather than complex validation |

### User Testing Plan

**Approach:** Prototype testing with 3-5 users during co-design sessions

**Participants:**
- 2-3 Clinical Leads (Marianne, governance perspective)
- 2-3 Coordinators (care partner perspective)

**Questions to Answer:**
1. Can clinical leads quickly identify which cases are overdue from the list view?
2. Is the case creation form fast enough to complete during a call? (target: <3 mins)
3. Is the review outcome flow clear? (Continue vs Close vs Escalate)
4. Does the mandatory closure justification feel appropriate or burdensome?
5. Is the case detail view comprehensive enough for governance audits?

**Timeline:** During first sprint, before UI finalisation

---

## UI Pattern Decisions

### Case List View
- **Pattern**: CommonTable (modern pattern, matching Incidents/Documents tabs)
- **Not**: PrimeVue DataTable (legacy pattern used in Risks/Needs — avoid for new tabs)
- **Columns**: Case type badge, Clinical concern (truncated), Status badge, Next review date (with overdue indicator), Assigned to, Actions

### Case Detail View
- **Pattern**: Inertia modal (right-slide, matching Risks/Contacts pattern)
- **Rationale**: Case detail is read-heavy but not so complex it needs a full page. Modal keeps context of the case list visible. Review history timeline sits naturally in a scrollable modal body

### Case Create/Edit Form
- **Pattern**: Inertia modal (right-slide)
- **Fields**: Case type (select), Clinical concern (textarea), Review interval (select + custom input), Trigger source (select), Trigger incident (select, conditional), Assigned to (select), Risk links (multi-select)

### Review Form
- **Pattern**: Inertia modal (right-slide)
- **Fields**: Outcome (radio: Continue/Close/Escalate), Clinical notes (textarea), Closure reason (textarea, conditional on Close)
- **State feedback**: After save, clear confirmation of what changed ("Case continues. Next review: 27 Feb 2026")

### Status Badges
- **Active**: `CommonBadge colour="success"` (green)
- **Escalated**: `CommonBadge colour="error"` (red)
- **Closed**: `CommonBadge colour="gray"` (neutral)

### Case Type Badges
- **Mandatory**: `CommonBadge colour="error" variant="soft"` (red-soft — duty of care)
- **Recommended**: `CommonBadge colour="info" variant="soft"` (blue-soft — standard)
- **Self-Service**: `CommonBadge colour="gray" variant="soft"` (gray-soft — low risk)

### Overdue Indicator
- **Pattern**: Amber/red text or icon on the review date cell when `next_review_at < today`
- **Example**: `CommonBadge colour="warning" leading-icon="heroicons:exclamation-triangle" label="Overdue"` next to the date

### Empty State
- **Pattern**: `CommonEmptyPlaceholder` with explanation text and "Create Case" action button
- **Text**: "No clinical cases recorded for this recipient"

---

## Ready for Mockups

- [x] User research complete
- [x] Design principles defined ("Transparency over efficiency")
- [x] Emotional goals defined ("In control")
- [x] Competitive research reviewed (Salesforce Health Cloud, Cliniko, 2026 healthcare UX patterns)
- [x] Edge cases identified (10 cases documented)
- [x] Constraints documented (WCAG AA, keyboard nav, clinical data sensitivity)
- [x] UI pattern decisions made (CommonTable, Inertia modals, badge colour mapping)
- [x] Phased rollout defined (Phases 1-3 MVP, Phase 4 deferred)
- [ ] Stakeholder alignment (pending Romy, Patrick, Marianne review)

**Next Step:** `/trilogy-mockup`
