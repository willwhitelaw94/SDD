---
title: "Feature Specification: Care Wins (CW)"
description: "Clinical And Care Plan > Care Wins"
---

# Feature Specification: Care Wins (CW)

**Status**: Draft
**Epic**: CW — Care Wins | **Initiative**: Clinical and Care Plan
**Prefix**: CW
**Priority**: P1

---

## Overview

Care Wins is an umbrella epic for quick, focused UX improvements to care coordination workflows, identified from care partner and coordinator feedback. Unlike large feature epics, Care Wins targets small, high-impact changes that enhance daily workflows — fixing friction points, improving readability, streamlining interactions, and polishing existing features based on real user pain points.

Each improvement is scoped as a sub-epic with its own specification. This parent-level spec defines the overarching goals, governance model, and success criteria for the Care Wins programme.

### Sub-Epics

| Sub-Epic | Description | Status |
|----------|-------------|--------|
| [001 — Personal Context Notes Redesign](/initiatives/Clinical-And-Care-Plan/Care-Wins/001-Personal-Context-Notes-Redesign/spec) | Inline note creation/editing, compact category indicators, category filtering | Draft |

---

## User Scenarios & Testing

### User Story 1 — Identify and Prioritise UX Friction Points (Priority: P1)

As a **Product Owner**, I want to systematically capture and prioritise UX friction points reported by care partners and coordinators so that the team works on the improvements with the highest daily workflow impact first.

**Acceptance Scenarios**:

1. **Given** a care partner or coordinator reports a UX friction point, **When** the feedback is reviewed, **Then** it is logged as a candidate Care Win with a description of the pain point, affected role(s), and estimated frequency of occurrence

2. **Given** multiple Care Win candidates exist, **When** the Product Owner prioritises them, **Then** each candidate is ranked by daily workflow impact (frequency of use multiplied by severity of friction) and estimated effort

3. **Given** a Care Win is approved for implementation, **When** it is added to the backlog, **Then** a sub-epic directory is created with its own spec.md containing user stories and acceptance criteria

---

### User Story 2 — Deliver Incremental UX Improvements Without Regression (Priority: P1)

As a **Coordinator**, I want UX improvements to be delivered incrementally and tested independently so that each change improves my workflow without breaking existing features I rely on.

**Acceptance Scenarios**:

1. **Given** a Care Win sub-epic is implemented, **When** it is deployed, **Then** it does not alter the behaviour of any feature outside its stated scope

2. **Given** a Care Win changes the interaction pattern for an existing feature (e.g., modal to inline), **When** the change is deployed, **Then** all existing data and functionality is preserved — no data loss, no missing capabilities

3. **Given** a Care Win is deployed, **When** users interact with it for the first time, **Then** the change is intuitive enough to use without training documentation (self-evident UX)

---

### User Story 3 — Track Care Win Impact After Deployment (Priority: P2)

As a **Product Owner**, I want to measure the impact of each Care Win after deployment so that I can validate whether the improvement achieved its intended workflow benefit and inform future prioritisation.

**Acceptance Scenarios**:

1. **Given** a Care Win has been deployed for 2+ weeks, **When** the Product Owner reviews its impact, **Then** measurable outcomes defined in the sub-epic spec can be evaluated (e.g., time to complete action, user satisfaction, support ticket reduction)

2. **Given** a Care Win does not achieve its intended outcome, **When** the review identifies the gap, **Then** a follow-up improvement or rollback decision is made and documented

---

### Edge Cases

- What happens if two Care Wins affect the same UI component? They are sequenced so that only one ships at a time for that component, avoiding merge conflicts and UX inconsistency
- What happens if a Care Win conflicts with a larger epic in progress? The larger epic takes priority; the Care Win is deferred or adapted to align with the epic's design direction
- What happens if user feedback contradicts itself (some users want change, others do not)? The Product Owner weighs frequency of feedback, role impact, and alignment with design principles to make a decision

---

## Functional Requirements

**Programme Governance**

- **FR-001**: Each Care Win MUST be scoped as an independent sub-epic with its own spec.md containing user stories and acceptance criteria
- **FR-002**: Each Care Win MUST be deployable independently — no cross-dependency between Care Wins unless explicitly documented
- **FR-003**: Each Care Win MUST define measurable success criteria before implementation begins

**Quality Standards**

- **FR-004**: Care Wins MUST NOT introduce regressions to existing functionality
- **FR-005**: Care Wins MUST preserve all existing data and capabilities when changing interaction patterns
- **FR-006**: Care Wins MUST follow existing design system patterns (colours, typography, spacing, component library) unless explicitly redesigning a component
- **FR-007**: Care Wins MUST meet WCAG 2.1 AA accessibility standards

**Feedback Loop**

- **FR-008**: System SHOULD provide a mechanism for care partners and coordinators to report UX friction points (e.g., feedback form, Slack channel, regular survey)
- **FR-009**: Each deployed Care Win SHOULD be reviewed for impact within 4 weeks of deployment

---

## Key Entities

| Entity | Description |
|--------|-------------|
| **Care Win** | A single, focused UX improvement scoped as a sub-epic |
| **Friction Point** | A user-reported UX pain point with role, frequency, and severity context |
| **Sub-Epic** | A numbered directory (e.g., 001-Personal-Context-Notes-Redesign) containing spec.md and optional checklists |

---

## Success Criteria

### Measurable Outcomes

| Goal | Metric | Target |
|------|--------|--------|
| Ship improvements continuously | Care Wins delivered per quarter | 2+ per quarter |
| Improve daily workflows | User-reported friction points addressed | Reduce top-5 pain points within 6 months |
| No regressions | Bugs introduced by Care Wins | 0 regressions per release |
| Self-evident UX | Training required for Care Win changes | No training needed — self-evident from UI |
| User satisfaction | Care partner/coordinator satisfaction trend | Positive trend in quarterly feedback surveys |

---

## Assumptions

- Care partner and coordinator feedback is collected regularly through existing channels (surveys, Slack, 1:1s, Big Room Planning)
- Each Care Win is small enough to be delivered within 1-2 sprints
- The design system and component library are stable enough to support incremental improvements
- Care Wins do not require architectural changes — they are presentation-layer improvements

---

## Dependencies

| Dependency | Type | Impact |
|------------|------|--------|
| User feedback channels | Process | Required to identify and prioritise Care Wins |
| Design system / component library | Technical | Care Wins must align with existing design patterns |
| Larger epics in progress | Coordination | Care Wins affecting the same UI areas must be sequenced with active epics |

---

## Out of Scope

- Large feature development (new modules, new data models, new integrations) — those belong in dedicated epics
- Backend architectural changes — Care Wins are focused on presentation-layer improvements
- Mobile-specific redesigns — Care Wins address the current responsive behaviour; dedicated mobile work is a separate initiative
- User research or discovery — Care Wins are driven by direct user feedback, not exploratory research

## Clarification Outcomes

### Q1: [Scope] The spec says Care Wins are "presentation-layer improvements" with "no backend architectural changes." Some UX improvements (e.g., switching from modal to inline editing) may require API changes. Is the constraint too strict?
**Answer:** The first sub-epic (001 - Personal Context Notes Redesign) changes interaction patterns from modal to inline. This requires no new database entities but does require API changes (the controller endpoints change from modal-oriented to inline-form-oriented). The codebase pattern for inline forms uses `useForm()` from `@inertiajs/vue3` which posts to the same endpoints. **The constraint is slightly too strict as written. Recommendation: Reword to "no new database entities or architectural changes" rather than "no backend changes." API adjustments to support UX improvements (e.g., returning partial data for inline forms) are acceptable.**

### Q2: [Data] FR-009 says each deployed Care Win should be reviewed for impact within 4 weeks. What is the mechanism for this review? Is there a template or checklist?
**Answer:** The spec does not define a review template. Success criteria are defined per sub-epic (e.g., SC-001 through SC-005 for the Notes Redesign). **Assumption: The review mechanism is a lightweight product review comparing the sub-epic's success criteria against observed outcomes. No formal template is needed -- the measurable outcomes in each sub-epic spec serve as the checklist. The Product Owner reviews these metrics 4 weeks post-deploy and documents findings in the sub-epic directory.**

### Q3: [Dependency] How are Care Wins prioritised against larger epics when they affect the same UI area? The spec says the larger epic takes priority, but what if the Care Win is urgently needed?
**Answer:** The edge case section says "the larger epic takes priority; the Care Win is deferred or adapted." In practice, the Personal Context Notes Redesign (001) depends on RIN delivering the PersonalContextEntry model first, illustrating this sequencing. **Recommendation: When a Care Win is urgent and conflicts with an active epic, the Care Win should be discussed with the epic owner. Options: (a) merge the Care Win into the epic scope, (b) the Care Win ships first if it doesn't create merge conflicts, or (c) defer. The decision is made at sprint planning, not by a rigid rule.**

### Q4: [Edge Case] The target of "2+ per quarter" seems low for small UX fixes. Is this a minimum floor, or is there capacity for more?
**Answer:** "2+ per quarter" is a minimum floor. Care Wins are 1-2 sprint efforts each. With typical sprint capacity, 2-4 per quarter is realistic depending on competing epic work. **The target is a floor, not a ceiling. The actual delivery rate depends on sprint capacity and epic workload. The spec correctly states this is about "continuous" improvement -- the metric ensures Care Wins are not deprioritised entirely in favour of large epics.**

### Q5: [Scope] The assumptions say "Care Wins do not require architectural changes -- they are presentation-layer improvements." But the current sub-epics list only includes 001 (Personal Context Notes Redesign). Will future Care Wins always be presentation-only?
**Answer:** The assumption is aspirational. Some UX friction points may require minor backend changes (e.g., adding an index for performance, changing a sort order, adding a computed field). **Recommendation: Clarify that Care Wins should be "primarily presentation-layer" with minor backend changes acceptable if they directly support the UX improvement. If a Care Win requires significant backend work (new models, new event sourcing, new integrations), it should be promoted to a standalone epic.**

## Refined Requirements

1. **Scope clarification**: FR-005 ("preserve all existing data and capabilities when changing interaction patterns") should be strengthened to include: "API endpoints may be adjusted to support new interaction patterns, but no new database entities or event sourcing aggregates should be introduced."
2. **Review process**: Each sub-epic's success criteria serve as the 4-week review checklist. The Product Owner documents review findings in the sub-epic directory as a `review.md` file.
