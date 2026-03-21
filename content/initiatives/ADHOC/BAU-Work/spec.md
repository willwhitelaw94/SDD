---
title: "Feature Specification: BAU Work (BAU)"
---

**Status**: Draft
**Epic**: BAU | **Initiative**: ADHOC

---

## Overview

BAU Work encompasses bugs, feature requests, and operational tasks that do not sit under a specific project or initiative. This is a catch-all epic for ad-hoc development work including production incident response, minor enhancements, technical debt reduction, and cross-cutting improvements that span multiple systems or are too small to warrant their own epic.

> **Scope note**: This spec covers the process and criteria for BAU work intake, prioritisation, and delivery. It does not define a single feature but rather the framework for handling unplanned and miscellaneous work items.

---

## User Scenarios & Testing

### User Story 1 — Report and Resolve a Production Bug (Priority: P1)

As a **care coordinator or internal staff member**, when I encounter a bug in the portal, I want to report it through an established channel and have it triaged and resolved promptly — so that my work is not blocked by system issues.

**Acceptance Scenarios**:

1. **Given** a user encounters a bug in production, **When** they report it via the designated channel (Linear, Slack, or support ticket), **Then** the issue is logged as a BAU ticket with severity classification within 1 business day
2. **Given** a P0/P1 bug is reported, **When** the engineering team triages it, **Then** work begins within 4 hours during business hours and a fix is deployed within 1 business day where feasible
3. **Given** a bug fix is deployed, **When** the reporter is notified, **Then** they can verify the fix and confirm resolution

### User Story 2 — Request a Minor Enhancement (Priority: P2)

As a **product owner or care partner**, when I identify a small improvement that would save time or reduce errors, I want to submit an enhancement request — so that it can be evaluated and potentially delivered without requiring a full epic.

**Acceptance Scenarios**:

1. **Given** a minor enhancement request is submitted, **When** the team reviews it in backlog grooming, **Then** it is estimated, prioritised, and either scheduled or deferred with rationale provided
2. **Given** an enhancement is approved for delivery, **When** it is completed, **Then** it is tested against the acceptance criteria documented in the ticket before release

### User Story 3 — Address Technical Debt (Priority: P3)

As a **developer**, when I identify technical debt that increases maintenance burden or risk, I want to log it as a BAU item — so that it can be addressed during available capacity windows.

**Acceptance Scenarios**:

1. **Given** a technical debt item is logged, **When** there is available capacity between epic work, **Then** the team can pick up and address the item
2. **Given** a technical debt item is completed, **When** the change is deployed, **Then** it does not introduce regressions (verified by existing test suites)

### Edge Cases

- A reported bug turns out to be a feature request — reclassify and re-prioritise accordingly
- A BAU item grows in scope beyond 1 sprint — escalate to product owner for potential epic creation
- Multiple BAU items are reported for the same root cause — consolidate into a single ticket and address the root cause
- A BAU fix requires changes that conflict with in-progress epic work — coordinate with the epic team lead before merging

---

## Functional Requirements

### Intake & Triage

- **FR-001**: All BAU work items MUST be logged in Linear under the BAU project with appropriate labels (bug, enhancement, tech-debt, or support)
- **FR-002**: Each BAU item MUST have a severity/priority classification (P0-P4)
- **FR-003**: P0/P1 items MUST be triaged within 4 hours during business hours

### Delivery

- **FR-004**: BAU items MUST have acceptance criteria documented before work begins
- **FR-005**: All BAU code changes MUST follow the standard code review and CI/CD pipeline process
- **FR-006**: BAU fixes SHOULD include regression tests where the fix addresses a repeatable defect

### Communication

- **FR-007**: The reporter of a BAU item MUST be notified when work begins and when it is resolved
- **FR-008**: A weekly summary of BAU items completed and in progress SHOULD be shared with the product team

---

## Key Entities

- **BAU Ticket**: A work item in Linear categorised under the BAU project. Contains title, description, severity, status, assignee, and acceptance criteria
- **Severity Classification**: P0 (production down), P1 (critical workflow blocked), P2 (degraded experience with workaround), P3 (minor issue), P4 (cosmetic or trivial)

---

## Success Criteria

### Measurable Outcomes

- **SC-001**: P0/P1 bugs have a mean time to resolution (MTTR) of less than 1 business day
- **SC-002**: BAU backlog does not exceed 30 open items at any time (excluding deferred/icebox)
- **SC-003**: No BAU item remains in "In Progress" status for more than 5 business days without escalation
- **SC-004**: 90% or more of BAU bug fixes include a regression test

---

## Assumptions

- BAU work is resourced from the same engineering team as epic work, with capacity allocated per sprint
- Linear is the single source of truth for BAU ticket tracking
- Existing CI/CD pipelines and test infrastructure support rapid deployment of BAU fixes

---

## Dependencies

- Linear project board configured for BAU work
- Established communication channels (Slack, email) for bug reporting
- CI/CD pipeline availability for deployments

---

## Out of Scope

- Work that requires more than 1 sprint of effort (should be escalated to its own epic)
- Infrastructure or platform-level changes (covered by DevOps/platform team)
- Feature work that is already tracked under a specific initiative or epic

## Clarification Outcomes

### Q1: [Scope] What is the maximum effort threshold before escalation to an epic?
**Answer:** The spec says "more than 1 sprint" but sprint sizes vary. **Recommendation:** Define the threshold in effort days, not sprint sizes. **5 engineering days** (one person-week) is a reasonable threshold. Items estimated at 5+ days should be evaluated for epic creation. This gives a concrete, team-agnostic measure. Items under 5 days stay as BAU; items over 5 days get a mini-spec and their own Linear project.

### Q2: [Data] How are cross-domain BAU items tracked?
**Answer:** The spec places all BAU items in a single Linear BAU project (FR-001). If a bug spans Supplier and Budget domains, **it goes in the BAU project with labels for affected domains** (e.g., `domain:supplier`, `domain:budget`). The assignee should be from the team with the most expertise in the primary affected domain. **Cross-domain bugs should not be split** unless they require independent changes -- a single ticket with multiple domain labels is cleaner.

### Q3: [Dependency] What is the Intercom-to-Linear triage handoff?
**Answer:** The Intercom-On-Portal (ITC) spec covers chat-based bug reporting (US3). ITC creates support tickets in Intercom's system. **The triage handoff should be:** (a) User reports bug via Intercom, (b) Support team reviews in Intercom, (c) If engineering work is needed, support creates a Linear BAU ticket with Intercom ticket reference, (d) Engineering works in Linear, (e) Resolution communicated back to Intercom ticket. **This is a manual triage step** -- no automatic Intercom-to-Linear integration for MVP. FR-007 requires notifying the reporter; the Intercom ticket link enables this.

### Q4: [Edge Case] Can BAU fixes include database migrations?
**Answer:** The Out of Scope section excludes "infrastructure or platform-level changes" but this refers to large-scale platform migrations (e.g., changing hosting, upgrading major packages), not individual schema changes. **Small database migrations that fix bugs are acceptable as BAU items.** Examples: adding an index to fix a slow query, adding a nullable column to fix a data integrity issue. **The threshold:** If the migration affects more than one table or requires data backfill across 1000+ rows, it should be flagged as potentially needing its own epic.

### Q5: [Process] How is BAU capacity allocated?
**Answer:** The Assumptions state "BAU work is resourced from the same engineering team as epic work, with capacity allocated per sprint." **Recommendation:** Reserve 20% of sprint capacity for BAU work. This balances feature delivery with maintenance. If BAU volume exceeds 20%, escalate to the product owner to either defer lower-priority epic work or increase team capacity.

## Refined Requirements

1. **Define the escalation threshold as 5 engineering days** -- items exceeding this should be evaluated for epic creation.
2. **Use domain labels in Linear** (e.g., `domain:supplier`, `domain:budget`) for cross-domain BAU items.
3. **Manual Intercom-to-Linear triage** -- support team creates Linear tickets referencing Intercom conversations. No automated integration for MVP.
4. **Small database migrations are acceptable in BAU** -- flag migrations affecting multiple tables or large data backfills for epic evaluation.
5. **Reserve 20% sprint capacity for BAU** as the default allocation, adjustable by product owner.
